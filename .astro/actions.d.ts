declare module "astro:actions" {
	type Actions = typeof import("C:/Users/hudav/Documents/GitHub/webapp/src/actions/index.ts")["server"];

	export const actions: Actions;
}