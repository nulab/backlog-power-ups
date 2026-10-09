import dictionaries from "./dictionary.generated.json";
import { createDomTranslator } from "./translate-dom";

export type TranslateUiLanguage = keyof typeof dictionaries;

/**
 * Builds a plugin that rewrites Backlog's own UI text into `language`.
 *
 * Adding a language means dropping a `dictionaries/<lang>.json` next to this
 * file, regenerating with `npm run build:dictionary`, and exporting one more
 * plugin: the plugin list is a flat list of booleans, so each language is its
 * own toggle.
 */
export const defineTranslateUiPlugin = (language: TranslateUiLanguage) =>
	definePowerUpsPlugin({
		group: "general",
		matches: ["/**"],
		allFrames: true,
		// Rewriting the whole UI gets in the way of developing anything else, and
		// it breaks the plugins that match on Backlog's own wording.
		devEnabled: false,
		main({ onInvalidated }) {
			const translator = createDomTranslator(dictionaries[language]);

			translator.start();

			onInvalidated(translator.stop);
		},
	});
