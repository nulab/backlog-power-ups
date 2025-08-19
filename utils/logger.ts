import { createConsola } from "consola";

export const logger = createConsola({
	level: import.meta.env.DEV ? 999 : undefined,
});
