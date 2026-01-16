import * as server from '../entries/pages/projects-infra/_page.server.ts.js';

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/projects-infra/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/projects-infra/+page.server.ts";
export const imports = ["_app/immutable/nodes/23.DWKZp-RR.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/VB45bhtT.js","_app/immutable/chunks/CgppWemH.js","_app/immutable/chunks/D3xLfT3q.js","_app/immutable/chunks/CuIfUMuc.js","_app/immutable/chunks/CNKuqfku.js","_app/immutable/chunks/oRfbssuc.js","_app/immutable/chunks/B2E4lz1E.js","_app/immutable/chunks/Dnptkdu8.js","_app/immutable/chunks/Vb7vi_9G.js","_app/immutable/chunks/0u-3TZwK.js","_app/immutable/chunks/CMHMUA5_.js","_app/immutable/chunks/BX3HDoUx.js","_app/immutable/chunks/3i3wIoE8.js","_app/immutable/chunks/DjhzkWgO.js","_app/immutable/chunks/33od3G62.js","_app/immutable/chunks/BoOMUDzJ.js","_app/immutable/chunks/C0Iw7LoP.js","_app/immutable/chunks/zO2eeF-k.js"];
export const stylesheets = [];
export const fonts = [];
