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
 *   node scripts/build-ui-dictionary.mjs --scala ../../backlog/backlog-scala
 *   BACKLOG_SCALA_DIR=... node scripts/build-ui-dictionary.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const DICTIONARY_DIR = join(ROOT, "plugins/translateUi/dictionaries");
const OUTPUT = join(ROOT, "plugins/translateUi/dictionary.generated.json");
const CATALOGS = { ja: "messages.ja", en: "messages.en" };

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
const parseCatalog = (path) => {
	const entries = new Map();

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

/**
 * Only plain labels can be matched against rendered text: entries with
 * MessageFormat placeholders, markup or HTML entities never appear on screen
 * in the form the catalog stores them.
 */
const isMatchableLabel = (value) =>
	value.length > 0 && !/[{}<>&]/.test(value) && value.length <= 60;

const catalogs = Object.fromEntries(
	Object.entries(CATALOGS).map(([lang, file]) => [
		lang,
		parseCatalog(resolve(scalaDir, "backlog-web/conf", file)),
	]),
);

const dictionaries = readdirSync(DICTIONARY_DIR)
	.filter((file) => file.endsWith(".json"))
	.sort();

const output = {};
const problems = [];

for (const file of dictionaries) {
	const lang = basename(file, ".json");
	const translations = JSON.parse(
		readFileSync(join(DICTIONARY_DIR, file), "utf8"),
	);
	// Null-prototype: a source text of "__proto__" or "constructor" would
	// otherwise be dropped on write, or collide with an inherited member.
	/** @type {Record<string, string>} */
	const map = Object.create(null);
	/** source text -> the message key that first claimed it */
	const owners = new Map();

	for (const [key, translation] of Object.entries(translations)) {
		if (!translation) {
			problems.push(`${file}: "${key}" has no translation`);
			continue;
		}

		const sources = [];

		for (const [sourceLang, catalog] of Object.entries(catalogs)) {
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
			const owner = owners.get(source);

			// Many keys render the same text ("担当者" has a dozen). That is fine as
			// long as they agree on the translation; if they disagree the dictionary
			// has to drop one of them, because the DOM cannot tell them apart.
			if (owner !== undefined && map[source] !== translation) {
				problems.push(
					`${file}: "${source}" is translated as both "${map[source]}" (${owner}) and "${translation}" (${key})`,
				);
				continue;
			}

			map[source] = translation;
			owners.set(source, key);
		}
	}

	output[lang] = Object.fromEntries(
		Object.entries(map).sort(([a], [b]) => (a < b ? -1 : 1)),
	);

	console.log(
		`${lang}: ${Object.keys(translations).length} keys -> ${Object.keys(map).length} source texts`,
	);
}

if (problems.length > 0) {
	console.error(`\n${problems.length} problem(s):`);
	for (const problem of problems) console.error(`  - ${problem}`);
	process.exit(1);
}

writeFileSync(OUTPUT, `${JSON.stringify(output, null, "\t")}\n`);
console.log(`wrote ${OUTPUT}`);
