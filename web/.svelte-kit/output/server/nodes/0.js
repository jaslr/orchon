import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.BUPppgUN.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BSOyUNbi.js","_app/immutable/chunks/B-w-zG1D.js","_app/immutable/chunks/D9u8SmGH.js","_app/immutable/chunks/D3DGhv5e.js","_app/immutable/chunks/CWULbE_g.js","_app/immutable/chunks/Bz1uhfmE.js","_app/immutable/chunks/BqxVS0fB.js","_app/immutable/chunks/Aiil3hLA.js","_app/immutable/chunks/BoMp02Tq.js","_app/immutable/chunks/DKG_u8Im.js","_app/immutable/chunks/Cbr0v2LS.js","_app/immutable/chunks/DDEDQM0d.js","_app/immutable/chunks/CX1-Pu5h.js","_app/immutable/chunks/BLtbU3fE.js","_app/immutable/chunks/BnxV4dzg.js"];
export const stylesheets = ["_app/immutable/assets/0.CWP7jIVk.css"];
export const fonts = [];
