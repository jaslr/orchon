import * as server from '../entries/pages/admin/projects/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.l9odkO_N.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/VB45bhtT.js","_app/immutable/chunks/CgppWemH.js","_app/immutable/chunks/D3xLfT3q.js","_app/immutable/chunks/CuIfUMuc.js","_app/immutable/chunks/CNKuqfku.js","_app/immutable/chunks/oRfbssuc.js","_app/immutable/chunks/JAtD7kf9.js","_app/immutable/chunks/Ck2SGN9w.js","_app/immutable/chunks/BmSu2Yhg.js","_app/immutable/chunks/CyWyFm7g.js","_app/immutable/chunks/Vb7vi_9G.js","_app/immutable/chunks/Cuy74Y2K.js","_app/immutable/chunks/CE2XZDoW.js","_app/immutable/chunks/BTHoARqq.js","_app/immutable/chunks/DXTVCWaa.js","_app/immutable/chunks/-axCHcGS.js","_app/immutable/chunks/Dx9Ea-xZ.js","_app/immutable/chunks/DcuRovnv.js"];
export const stylesheets = [];
export const fonts = [];
