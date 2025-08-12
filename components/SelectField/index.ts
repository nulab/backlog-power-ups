import styles from "./index.module.css";

type Props = {
	label?: string;
	defaultValue?: unknown;
	options: string | string[];
};

export const createSelectField = ({ label, defaultValue, options }: Props) => {
	const id = getId();

	const field = html`
    <div class=${styles.field}>
      <select id=${id} class=${styles.select} value=${defaultValue}>
        ${options}
      </select>
    </div>
  ` as string;

	const htmlString = label
		? (html`
        <li class="form-element__item _mg-t-10">
          <label class="form-element__label" for=${id}>${label}</label>
          ${field}
        </li>
      ` as string)
		: field;

	const template = document.createElement("template");
	template.innerHTML = htmlString;

	const select = template.content.querySelector("select")!;
	const element = template.content.firstElementChild as
		| HTMLDivElement
		| HTMLLIElement;

	return { select, element };
};
