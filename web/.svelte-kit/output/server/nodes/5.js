import * as server from '../entries/pages/admin/infra/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/infra/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/infra/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.BiYYG1NP.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BSOyUNbi.js","_app/immutable/chunks/B-w-zG1D.js","_app/immutable/chunks/D9u8SmGH.js","_app/immutable/chunks/CWULbE_g.js","_app/immutable/chunks/Bz1uhfmE.js","_app/immutable/chunks/CDwow8u6.js","_app/immutable/chunks/D3DGhv5e.js","_app/immutable/chunks/CC450J7M.js","_app/immutable/chunks/Aiil3hLA.js","_app/immutable/chunks/BoMp02Tq.js","_app/immutable/chunks/CPRrDHYP.js","_app/immutable/chunks/DGaLqRSr.js","_app/immutable/chunks/DHpe76xf.js","_app/immutable/chunks/ql8GN9kl.js","_app/immutable/chunks/CcfTfJjq.js","_app/immutable/chunks/BVYw7Hpw.js","_app/immutable/chunks/DDEDQM0d.js","_app/immutable/chunks/C9Mt9y2y.js"];
export const stylesheets = [];
export const fonts = [];
