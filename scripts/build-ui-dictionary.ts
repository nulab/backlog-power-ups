/**
 * Builds the runtime dictionary used by the translateUi plugins.
 *
 * Backlog's DOM carries no message keys, so the plugin can only match on the
 * text it finds on screen. This script joins the per-language dictionaries in
 * `plugins/translateUi/dictionaries/*.json` (message key -> translation) with
 * Backlog's own catalog in backlog-scala, and emits a flat
 * `source text -> translation` map for both the Japanese and the English
 * rendering of every key.
 *
 *   node scripts/build-ui-dictionary.ts --scala ../../backlog/backlog-scala
 *   BACKLOG_SCALA_DIR=... node scripts/build-ui-dictionary.ts
 *
 * Node runs this directly by stripping the types, so there is no build step.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const DICTIONARY_DIR = join(ROOT, "plugins/translateUi/dictionaries");
const OUTPUT = join(ROOT, "plugins/translateUi/dictionary.generated.json");
const CATALOGS = { ja: "messages.ja", en: "messages.en" } as const;

type SourceLanguage = keyof typeof CATALOGS;

/** The message key that put a source text into the map, for error messages. */
type Entry = { key: string; translation: string };

const scalaFlag = process.argv.indexOf("--scala");
const scalaDir =
	(scalaFlag === -1 ? undefined : process.argv[scalaFlag + 1]) ||
	process.env.BACKLOG_SCALA_DIR;

if (!scalaDir) {
	console.error(
		"Pass the backlog-scala checkout with --scala <path> or BACKLOG_SCALA_DIR=<path>.",
	);
	process.exit(1);
}

/** Play's messages files are `key=value`, one per line, `#` for comments. */
const parseCatalog = (path: string): Map<string, string> => {
	const entries = new Map<string, string>();

	for (const line of readFileSync(path, "utf8").split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;

		const separator = trimmed.indexOf("=");
		if (separator === -1) continue;

		const key = trimmed.slice(0, separator).trim();
		// The catalog is written for java.text.MessageFormat, where a literal
		// apostrophe is escaped as "''".
		const value = trimmed.slice(separator + 1).replace(/''/g, "'");

		entries.set(key, value);
	}

	return entries;
};

const parseDictionary = (path: string): Map<string, string> => {
	const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));

	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
		throw new Error(
			`${path}: expected an object of message key -> translation`,
		);
	}

	const entries = new Map<string, string>();

	for (const [key, translation] of Object.entries(parsed)) {
		if (typeof translation !== "string") {
			throw new Error(`${path}: "${key}" is not a string`);
		}

		entries.set(key, translation);
	}

	return entries;
};

/**
 * Only plain labels can be matched against rendered text: entries with
 * MessageFormat placeholders, markup or HTML entities never appear on screen
 * in the form the catalog stores them.
 */
const isMatchableLabel = (value: string) =>
	value.length > 0 && !/[{}<>&]/.test(value) && value.length <= 60;

const catalogs = new Map<SourceLanguage, Map<string, string>>(
	Object.entries(CATALOGS).map(([lang, file]) => [
		lang as SourceLanguage,
		parseCatalog(resolve(scalaDir, "backlog-web/conf", file)),
	]),
);

const output: Record<string, Record<string, string>> = {};
const problems: string[] = [];

for (const file of readdirSync(DICTIONARY_DIR)
	.filter((name) => name.endsWith(".json"))
	.sort()) {
	const lang = basename(file, ".json");
	const translations = parseDictionary(join(DICTIONARY_DIR, file));
	// A Map rather than an object, so that a source text of "__proto__" or
	// "constructor" is stored like any other.
	const map = new Map<string, Entry>();

	for (const [key, translation] of translations) {
		if (!translation) {
			problems.push(`${file}: "${key}" has no translation`);
			continue;
		}

		const sources: string[] = [];

		for (const [sourceLang, catalog] of catalogs) {
			const value = catalog.get(key);

			if (value === undefined) {
				problems.push(`${file}: "${key}" is not in messages.${sourceLang}`);
				continue;
			}
			if (!isMatchableLabel(value)) {
				problems.push(
					`${file}: "${key}" is not a plain label in messages.${sourceLang} ("${value}")`,
				);
				continue;
			}

			sources.push(value);
		}

		for (const source of sources) {
			const existing = map.get(source);

			// Many keys render the same text ("担当者" has a dozen). That is fine as
			// long as they agree on the translation; if they disagree the dictionary
			// has to drop one of them, because the DOM cannot tell them apart.
			if (existing && existing.translation !== translation) {
				problems.push(
					`${file}: "${source}" is translated as both "${existing.translation}" (${existing.key}) and "${translation}" (${key})`,
				);
				continue;
			}

			map.set(source, { key, translation });
		}
	}

	output[lang] = Object.fromEntries(
		[...map]
			.map(([source, entry]) => [source, entry.translation] as const)
			.sort(([a], [b]) => (a < b ? -1 : 1)),
	);

	console.log(`${lang}: ${translations.size} keys -> ${map.size} source texts`);
}

if (problems.length > 0) {
	console.error(`\n${problems.length} problem(s):`);
	for (const problem of problems) console.error(`  - ${problem}`);
	process.exit(1);
}

writeFileSync(OUTPUT, `${JSON.stringify(output, null, "\t")}\n`);
console.log(`wrote ${OUTPUT}`);
