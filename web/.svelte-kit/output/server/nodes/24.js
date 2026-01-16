import * as server from '../entries/pages/vastpuddle/_page.server.ts.js';

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/vastpuddle/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/vastpuddle/+page.server.ts";
export const imports = ["_app/immutable/nodes/24.CDsl9YII.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/VB45bhtT.js","_app/immutable/chunks/CgppWemH.js","_app/immutable/chunks/D3xLfT3q.js","_app/immutable/chunks/CuIfUMuc.js","_app/immutable/chunks/CNKuqfku.js","_app/immutable/chunks/oRfbssuc.js","_app/immutable/chunks/B2E4lz1E.js","_app/immutable/chunks/Dnptkdu8.js","_app/immutable/chunks/Vb7vi_9G.js","_app/immutable/chunks/0u-3TZwK.js","_app/immutable/chunks/BzIwGa5u.js","_app/immutable/chunks/CMHMUA5_.js","_app/immutable/chunks/3i3wIoE8.js","_app/immutable/chunks/Dpfv_2u9.js","_app/immutable/chunks/DNph6RAW.js","_app/immutable/chunks/PoJi_Af0.js","_app/immutable/chunks/zO2eeF-k.js","_app/immutable/chunks/C0Iw7LoP.js","_app/immutable/chunks/DjhzkWgO.js","_app/immutable/chunks/V5_CAiUR.js"];
export const stylesheets = [];
export const fonts = [];
