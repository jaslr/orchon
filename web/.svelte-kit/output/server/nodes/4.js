import * as server from '../entries/pages/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.ZorNmcLa.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/VB45bhtT.js","_app/immutable/chunks/CgppWemH.js","_app/immutable/chunks/D3xLfT3q.js","_app/immutable/chunks/CuIfUMuc.js","_app/immutable/chunks/CNKuqfku.js","_app/immutable/chunks/oRfbssuc.js","_app/immutable/chunks/B2E4lz1E.js","_app/immutable/chunks/Dnptkdu8.js","_app/immutable/chunks/Vb7vi_9G.js","_app/immutable/chunks/B9P3TxM7.js","_app/immutable/chunks/33od3G62.js","_app/immutable/chunks/5nEHX2Zv.js","_app/immutable/chunks/CdtQIXoB.js","_app/immutable/chunks/Ci1oMc5i.js","_app/immutable/chunks/C0Iw7LoP.js","_app/immutable/chunks/Bgf0s5Dt.js"];
export const stylesheets = [];
export const fonts = [];
