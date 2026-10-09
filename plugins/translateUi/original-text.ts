import dictionaries from "./dictionary.generated.json";

let reverse: Map<string, string[]> | undefined;

const buildReverse = () => {
	const map = new Map<string, string[]>();

	for (const dictionary of Object.values(dictionaries)) {
		for (const [source, translation] of Object.entries(dictionary)) {
			const sources = map.get(translation);

			if (sources) {
				sources.push(source);
			} else {
				map.set(translation, [source]);
			}
		}
	}

	return map;
};

/**
 * Returns the texts Backlog itself renders for `text`, or an empty array when
 * `text` is not a translation.
 *
 * A plugin that recognises an element by Backlog's own wording stops matching
 * once a translateUi plugin has rewritten it, and the rewrite leaves no trace
 * in the DOM. Such a plugin should test the rendered text *and* these, so that
 * it keeps working whether or not a translation is active. One translation
 * normally maps back to several sources, because a key's Japanese and English
 * renderings share it.
 */
export const getUntranslatedTexts = (text: string | null): string[] => {
	if (!text) {
		return [];
	}

	reverse ??= buildReverse();

	return reverse.get(text.trim()) ?? [];
};
