import * as server from '../entries/pages/projects/_page.server.ts.js';

export const index = 14;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/14.49fLKIuu.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BSOyUNbi.js","_app/immutable/chunks/B-w-zG1D.js","_app/immutable/chunks/D9u8SmGH.js","_app/immutable/chunks/CWULbE_g.js","_app/immutable/chunks/Bz1uhfmE.js","_app/immutable/chunks/CDwow8u6.js","_app/immutable/chunks/D3DGhv5e.js","_app/immutable/chunks/C619BXAU.js","_app/immutable/chunks/BqxVS0fB.js","_app/immutable/chunks/Aiil3hLA.js","_app/immutable/chunks/BoMp02Tq.js","_app/immutable/chunks/BLtbU3fE.js","_app/immutable/chunks/BL3PLj43.js","_app/immutable/chunks/QzPuRVhz.js","_app/immutable/chunks/ql8GN9kl.js","_app/immutable/chunks/BLlU21Q1.js","_app/immutable/chunks/DHpe76xf.js","_app/immutable/chunks/CX1-Pu5h.js","_app/immutable/chunks/D7IA7gIE.js","_app/immutable/chunks/DDEDQM0d.js","_app/immutable/chunks/C9Mt9y2y.js","_app/immutable/chunks/Cbr0v2LS.js","_app/immutable/chunks/BnxV4dzg.js"];
export const stylesheets = ["_app/immutable/assets/14.CXPR0kzH.css"];
export const fonts = [];
