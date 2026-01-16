import * as server from '../entries/pages/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.DiCiZO1q.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/VB45bhtT.js","_app/immutable/chunks/CgppWemH.js","_app/immutable/chunks/D3xLfT3q.js","_app/immutable/chunks/CuIfUMuc.js","_app/immutable/chunks/CNKuqfku.js","_app/immutable/chunks/oRfbssuc.js","_app/immutable/chunks/B2E4lz1E.js","_app/immutable/chunks/CyWyFm7g.js","_app/immutable/chunks/Vb7vi_9G.js","_app/immutable/chunks/B9P3TxM7.js","_app/immutable/chunks/DeNegKwn.js","_app/immutable/chunks/pBChZBc8.js","_app/immutable/chunks/eRcnfYE7.js","_app/immutable/chunks/Cc5ivBPk.js","_app/immutable/chunks/DYc-kdkA.js"];
export const stylesheets = [];
export const fonts = [];
