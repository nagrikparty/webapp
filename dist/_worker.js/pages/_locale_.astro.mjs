globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Cvbbl0_e.mjs';
import { j as jsxRuntimeExports, m as motion, u as usePathname, L as Link, I as Image, $ as $$Layout } from '../chunks/Layout_Brw6dZGA.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DNSRmELw.mjs';

function PageTransition({ children }) {
  const pathname = usePathname();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, filter: "blur(10px)" },
      animate: { opacity: 1, filter: "blur(0px)" },
      exit: { opacity: 0, filter: "blur(10px)" },
      transition: { duration: 0.8, ease: "easeInOut" },
      children
    },
    pathname
  );
}

function HeroSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-off-white dark:bg-[#0A0A0A] pt-20 transition-colors duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col lg:flex-row items-center py-20 gap-12 lg:gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-[60%] flex flex-col justify-center order-2 lg:order-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: "easeOut" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-hindi text-[4rem] sm:text-[6rem] lg:text-[8rem] leading-[0.85] font-black text-black dark:text-[#F7F7F5] tracking-tighter uppercase mb-8 drop-shadow-sm", children: "काम दिखना चाहिए।" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay: 0.2, ease: "easeOut" },
          className: "mb-10 font-body",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl sm:text-2xl text-black dark:text-white font-bold tracking-tight mb-2", children: "India doesn't only have a corruption problem." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl sm:text-2xl text-red font-bold tracking-tight mb-6", children: "India has a governance problem." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-black/70 dark:text-white/70 max-w-xl font-medium tracking-tight mb-6 leading-relaxed", children: "Broken roads. Flooded streets. Dead streetlights. Unanswered complaints. Missing accountability." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-black dark:text-white font-bold tracking-tight max-w-xl", children: "Nagrik Party exists to make governance visible." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay: 0.4, ease: "easeOut" },
          className: "flex flex-col sm:flex-row gap-4 mb-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                href: "/report",
                className: "flex items-center justify-center bg-black dark:bg-[#F7F7F5] text-white dark:text-[#0A0A0A] px-8 py-4 font-mono uppercase tracking-widest font-bold text-sm transition-all hover:bg-black/80 dark:hover:bg-white/80 rounded-none",
                children: "[ REPORT AN ISSUE ]"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                href: "/join",
                className: "flex items-center justify-center border-2 border-black dark:border-[#F7F7F5] text-black dark:text-[#F7F7F5] px-8 py-4 font-mono uppercase tracking-widest font-bold text-sm transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-none",
                children: "[ BECOME A VOLUNTEER ]"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.8, delay: 0.6, ease: "easeOut" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-widest text-black/50 dark:text-white/50 font-bold", children: "Citizen-first constitutional governance movement." })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:w-[40%] flex justify-center lg:justify-end order-1 lg:order-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 1, ease: "easeOut" },
        className: "relative w-full max-w-[400px] aspect-[3/4] lg:aspect-auto lg:h-[70vh] bg-black/5 dark:bg-white/5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grayscale contrast-125 brightness-90 dark:brightness-110 mix-blend-multiply dark:mix-blend-lighten", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Image,
            {
              src: "/images/founder.jpg",
              alt: "Founder",
              fill: true,
              className: "object-cover object-top",
              priority: true
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-4 -left-4 w-24 h-24 border-b-4 border-l-4 border-red pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-4 -right-4 w-24 h-24 border-t-4 border-r-4 border-black dark:border-white pointer-events-none" })
        ]
      }
    ) })
  ] }) });
}

function DifferentSection() {
  const cards = [
    {
      id: 1,
      title: "NOT DYNASTY POLITICS",
      desc: "Leadership should be earned."
    },
    {
      id: 2,
      title: "NOT COMMUNAL POLITICS",
      desc: "Citizens before divisions."
    },
    {
      id: 3,
      title: "NOT PERSONALITY POLITICS",
      desc: "Governance over spectacle."
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-white dark:bg-[#111111] py-32 border-t-8 border-black dark:border-white transition-colors duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6 },
        className: "mb-20",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-hindi text-5xl sm:text-7xl font-black text-black dark:text-[#F7F7F5] uppercase tracking-tighter mb-4", children: "WHAT MAKES NAGRIK DIFFERENT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 bg-red" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: cards.map((card, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.5, delay: index * 0.15 },
        className: "group border-4 border-black dark:border-[#F7F7F5] p-10 bg-off-white dark:bg-[#0A0A0A] hover:bg-black hover:text-white dark:hover:bg-[#F7F7F5] dark:hover:text-black transition-all duration-300 flex flex-col justify-between min-h-[320px]",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-5xl font-black text-black/20 dark:text-white/20 group-hover:text-white/20 dark:group-hover:text-black/20 mb-6 block", children: [
              "0",
              card.id
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-body text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4 leading-none", children: card.title })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm uppercase tracking-widest font-bold text-red group-hover:text-white dark:group-hover:text-black mt-8", children: card.desc })
        ]
      },
      card.id
    )) })
  ] }) });
}

function FounderQuote() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-off-white dark:bg-[#0A0A0A] py-32 border-t border-black/10 dark:border-white/10 transition-colors duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row items-center gap-16 lg:gap-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.8 },
        className: "w-full lg:w-1/3 flex justify-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-8 border-white dark:border-[#111111] shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grayscale contrast-125 brightness-95 dark:brightness-110", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Image,
          {
            src: "/images/founder.jpg",
            alt: "Founder",
            fill: true,
            className: "object-cover object-top"
          }
        ) }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: 20 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.8, delay: 0.2 },
        className: "w-full lg:w-2/3 text-center lg:text-left",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-12 h-12 text-red mb-8 mx-auto lg:mx-0 opacity-50", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-hindi text-4xl sm:text-5xl lg:text-6xl font-black text-black dark:text-[#F7F7F5] leading-tight mb-8", children: '"Citizens should not have to beg institutions for dignity."' }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center lg:items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-xl font-bold uppercase tracking-widest text-black dark:text-white", children: "Arsalan Azad" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm tracking-widest text-red uppercase mt-1", children: "Founder, Nagrik Party" })
          ] })
        ]
      }
    )
  ] }) }) });
}

function TransparencyStrip() {
  const trackers = [
    { label: "Principle I", value: "Right to Information", detail: "Mandatory public disclosure of all municipal contracts and vendor payments." },
    { label: "Principle II", value: "Public Audits", detail: "Citizens hold the legal right to audit local government expenditure." },
    { label: "Principle III", value: "Elected Accountability", detail: "Representatives must attend monthly ward assemblies or face recall." },
    { label: "Principle IV", value: "Decentralized Power", detail: "Budgetary control shifted directly to neighborhood civic committees." }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-white dark:bg-[#111111] py-24 border-y border-black/10 dark:border-white/10 transition-colors duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-hindi text-4xl sm:text-5xl font-bold text-black dark:text-[#F7F7F5] uppercase tracking-tight mb-4", children: "Movement Foundations" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm tracking-widest text-black/50 dark:text-white/50 uppercase", children: "The constitutional basis of our civic intervention" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16", children: trackers.map((tracker, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, delay: index * 0.1 },
        className: "p-6 border border-black dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-black dark:text-[#F7F7F5] hover:bg-black dark:hover:bg-[#1A1A1A] hover:text-white dark:hover:text-[#F7F7F5] transition-colors group text-left flex flex-col",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-[10px] uppercase tracking-[0.2em] opacity-60 mb-6 pb-4 border-b border-black/10 dark:border-white/10 group-hover:border-white/20", children: tracker.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-2xl font-black mb-4 leading-tight", children: tracker.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm opacity-80 leading-relaxed mt-auto", children: tracker.detail })
        ]
      },
      index
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: "/manifesto", className: "inline-block font-mono text-sm font-bold uppercase tracking-widest text-black dark:text-[#F7F7F5] hover:bg-black dark:hover:bg-[#F7F7F5] hover:text-white dark:hover:text-[#0A0A0A] border border-black dark:border-[#F7F7F5] px-8 py-4 transition-colors", children: "Read Complete Manifesto" }) })
  ] }) });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const stats = {
    volunteerCount: 42,
    reportCount: 15,
    donationCount: 100
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Nagrik Party" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PageTransition", PageTransition, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/effects/PageTransition", "client:component-export": "default" }, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<main class="bg-off-white min-h-screen text-black transition-colors duration-300"> ${renderComponent($$result3, "HeroSection", HeroSection, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/home/HeroSection", "client:component-export": "default" })} ${renderComponent($$result3, "DifferentSection", DifferentSection, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/home/DifferentSection", "client:component-export": "default" })} ${renderComponent($$result3, "FounderQuote", FounderQuote, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/home/FounderQuote", "client:component-export": "default" })} ${renderComponent($$result3, "TransparencyStrip", TransparencyStrip, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/home/TransparencyStrip", "client:component-export": "default" })}  <section class="bg-off-white dark:bg-[#0A0A0A] py-32 text-center border-t-4 border-black/10 dark:border-white/10 transition-colors duration-300"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="font-hindi text-4xl sm:text-6xl font-black text-black dark:text-[#F7F7F5] uppercase tracking-tighter mb-8 drop-shadow-sm">
Democracy should work <br> <span class="text-red">even after elections.</span> </h2> <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12"> <a href="/join" class="w-full sm:w-auto bg-black dark:bg-[#F7F7F5] text-white dark:text-[#0A0A0A] px-10 py-5 font-mono uppercase tracking-widest font-bold hover:bg-black/80 dark:hover:bg-white/80 transition-colors rounded-none">
[ Join the Movement ]
</a> <a href="/report" class="w-full sm:w-auto border-2 border-black dark:border-[#F7F7F5] text-black dark:text-[#F7F7F5] px-10 py-5 font-mono uppercase tracking-widest font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-none">
[ Report an Issue ]
</a> </div> <div class="flex flex-wrap justify-center gap-12 mt-16 text-sm font-mono opacity-80 border-t border-black/10 dark:border-white/10 pt-16"> <div class="flex flex-col items-center"> <span class="font-black text-4xl text-black dark:text-white mb-2">${stats.volunteerCount}</span> <span class="tracking-widest uppercase">Verified Cadre</span> </div> <div class="flex flex-col items-center"> <span class="font-black text-4xl text-red mb-2">${stats.reportCount}</span> <span class="tracking-widest uppercase">Live Issues</span> </div> <div class="flex flex-col items-center"> <span class="font-black text-4xl text-black dark:text-white mb-2">${stats.donationCount}</span> <span class="tracking-widest uppercase">Public Audits</span> </div> </div> </div> </section> </main> ` })} ` })}`;
}, "C:/Users/hudav/Documents/GitHub/webapp/src/pages/[locale]/index.astro", void 0);

const $$file = "C:/Users/hudav/Documents/GitHub/webapp/src/pages/[locale]/index.astro";
const $$url = "/[locale]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
