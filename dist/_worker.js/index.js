globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as renderers } from './chunks/_@astro-renderers_DNSRmELw.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DD6ou5oH.mjs';
import { manifest } from './manifest_BhqhtRlh.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/_actions/_---path_.astro.mjs');
const _page2 = () => import('./pages/api/auth/send_otp.astro.mjs');
const _page3 = () => import('./pages/api/auth/verify_otp.astro.mjs');
const _page4 = () => import('./pages/api/contact.astro.mjs');
const _page5 = () => import('./pages/api/dashboard_stats.astro.mjs');
const _page6 = () => import('./pages/api/donation.astro.mjs');
const _page7 = () => import('./pages/api/geography/states.astro.mjs');
const _page8 = () => import('./pages/api/geography/vidhan_sabhas.astro.mjs');
const _page9 = () => import('./pages/api/geography/wards.astro.mjs');
const _page10 = () => import('./pages/api/leaders.astro.mjs');
const _page11 = () => import('./pages/api/member/_id_.astro.mjs');
const _page12 = () => import('./pages/api/member.astro.mjs');
const _page13 = () => import('./pages/api/press_releases.astro.mjs');
const _page14 = () => import('./pages/api/profile.astro.mjs');
const _page15 = () => import('./pages/api/report.astro.mjs');
const _page16 = () => import('./pages/api/reports/live.astro.mjs');
const _page17 = () => import('./pages/api/verification/create.astro.mjs');
const _page18 = () => import('./pages/api/verification/status.astro.mjs');
const _page19 = () => import('./pages/_locale_/about.astro.mjs');
const _page20 = () => import('./pages/_locale_/admin.astro.mjs');
const _page21 = () => import('./pages/_locale_/cadre.astro.mjs');
const _page22 = () => import('./pages/_locale_/candidates.astro.mjs');
const _page23 = () => import('./pages/_locale_/constitution.astro.mjs');
const _page24 = () => import('./pages/_locale_/contact.astro.mjs');
const _page25 = () => import('./pages/_locale_/dashboard.astro.mjs');
const _page26 = () => import('./pages/_locale_/donate.astro.mjs');
const _page27 = () => import('./pages/_locale_/infrastructure.astro.mjs');
const _page28 = () => import('./pages/_locale_/issues.astro.mjs');
const _page29 = () => import('./pages/_locale_/join.astro.mjs');
const _page30 = () => import('./pages/_locale_/leadership.astro.mjs');
const _page31 = () => import('./pages/_locale_/login.astro.mjs');
const _page32 = () => import('./pages/_locale_/manifesto.astro.mjs');
const _page33 = () => import('./pages/_locale_/media.astro.mjs');
const _page34 = () => import('./pages/_locale_/mission.astro.mjs');
const _page35 = () => import('./pages/_locale_/privacy.astro.mjs');
const _page36 = () => import('./pages/_locale_/report.astro.mjs');
const _page37 = () => import('./pages/_locale_/terms.astro.mjs');
const _page38 = () => import('./pages/_locale_/transparency.astro.mjs');
const _page39 = () => import('./pages/_locale_.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["node_modules/astro/dist/actions/runtime/route.js", _page1],
    ["src/pages/api/auth/send_otp.ts", _page2],
    ["src/pages/api/auth/verify_otp.ts", _page3],
    ["src/pages/api/contact.ts", _page4],
    ["src/pages/api/dashboard_stats.ts", _page5],
    ["src/pages/api/donation.ts", _page6],
    ["src/pages/api/geography/states.ts", _page7],
    ["src/pages/api/geography/vidhan_sabhas.ts", _page8],
    ["src/pages/api/geography/wards.ts", _page9],
    ["src/pages/api/leaders.ts", _page10],
    ["src/pages/api/member/[id].ts", _page11],
    ["src/pages/api/member.ts", _page12],
    ["src/pages/api/press_releases.ts", _page13],
    ["src/pages/api/profile.ts", _page14],
    ["src/pages/api/report.ts", _page15],
    ["src/pages/api/reports/live.ts", _page16],
    ["src/pages/api/verification/create.ts", _page17],
    ["src/pages/api/verification/status.ts", _page18],
    ["src/pages/[locale]/about/index.astro", _page19],
    ["src/pages/[locale]/admin/index.astro", _page20],
    ["src/pages/[locale]/cadre/index.astro", _page21],
    ["src/pages/[locale]/candidates/index.astro", _page22],
    ["src/pages/[locale]/constitution/index.astro", _page23],
    ["src/pages/[locale]/contact/index.astro", _page24],
    ["src/pages/[locale]/dashboard/index.astro", _page25],
    ["src/pages/[locale]/donate/index.astro", _page26],
    ["src/pages/[locale]/infrastructure/index.astro", _page27],
    ["src/pages/[locale]/issues/index.astro", _page28],
    ["src/pages/[locale]/join/index.astro", _page29],
    ["src/pages/[locale]/leadership/index.astro", _page30],
    ["src/pages/[locale]/login/index.astro", _page31],
    ["src/pages/[locale]/manifesto/index.astro", _page32],
    ["src/pages/[locale]/media/index.astro", _page33],
    ["src/pages/[locale]/mission/index.astro", _page34],
    ["src/pages/[locale]/privacy/index.astro", _page35],
    ["src/pages/[locale]/report/index.astro", _page36],
    ["src/pages/[locale]/terms/index.astro", _page37],
    ["src/pages/[locale]/transparency/index.astro", _page38],
    ["src/pages/[locale]/index.astro", _page39]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
