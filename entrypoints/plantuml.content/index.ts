import plantumlEncoder from "plantuml-encoder";

export default defineContentScript({
	matches: defineMatches(["/wiki/*", "/alias/wiki/*"]),
	allFrames: true,
	async main() {
		if (await isPluginDisabled("plantuml")) {
			return;
		}

		observeQuerySelector(".loom_code", (el) => {
			const sourceCode = el.textContent.trim();

			if (
				el.classList.contains("lang-plantuml") ||
				sourceCode.startsWith("@startuml")
			) {
				const data = plantumlEncoder.encode(sourceCode);
				const plantumlUrl = `https://www.plantuml.com/plantuml/png/${data}`;
				const plantumlHtml = html`
                    <p>
                        <img src=${plantumlUrl} />
                    </p>
                `;

				el.insertAdjacentHTML(
					"beforebegin",
					Array.isArray(plantumlHtml) ? plantumlHtml[0] : plantumlHtml,
				);
				el.remove();
			}
		});
	},
});
