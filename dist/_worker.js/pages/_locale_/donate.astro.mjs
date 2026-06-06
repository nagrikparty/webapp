globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../../chunks/astro/server_Cvbbl0_e.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Brw6dZGA.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DNSRmELw.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Nagrik Party - donate" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="pt-32 px-8 min-h-screen bg-off-white text-black"> <div class="max-w-7xl mx-auto"> <h1 class="text-4xl font-bold uppercase mb-8">donate PAGE</h1> <p>This page was migrated from Next.js to Astro. Replace this placeholder with the actual component content.</p> </div> </div> ` })}`;
}, "C:/Users/hudav/Documents/GitHub/webapp/src/pages/[locale]/donate/index.astro", void 0);

const $$file = "C:/Users/hudav/Documents/GitHub/webapp/src/pages/[locale]/donate/index.astro";
const $$url = "/[locale]/donate";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
