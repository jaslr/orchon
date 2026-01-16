import * as server from '../entries/pages/admin/repos/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/repos/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/repos/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.xcB0QIib.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/VB45bhtT.js","_app/immutable/chunks/CgppWemH.js","_app/immutable/chunks/D3xLfT3q.js","_app/immutable/chunks/CuIfUMuc.js","_app/immutable/chunks/CNKuqfku.js","_app/immutable/chunks/oRfbssuc.js","_app/immutable/chunks/CdHnUH1e.js","_app/immutable/chunks/DUFUtOrg.js","_app/immutable/chunks/BmSu2Yhg.js","_app/immutable/chunks/Dnptkdu8.js","_app/immutable/chunks/Vb7vi_9G.js","_app/immutable/chunks/37IVKOY9.js","_app/immutable/chunks/C0Iw7LoP.js","_app/immutable/chunks/DhF8aboW.js","_app/immutable/chunks/-gUM5YTg.js","_app/immutable/chunks/CvOgw8TE.js","_app/immutable/chunks/rPvbTGdw.js","_app/immutable/chunks/BoOMUDzJ.js","_app/immutable/chunks/PoJi_Af0.js"];
export const stylesheets = [];
export const fonts = [];
