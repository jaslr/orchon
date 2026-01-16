import * as server from '../entries/pages/admin/projects/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.DfhS4e4W.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/VB45bhtT.js","_app/immutable/chunks/CgppWemH.js","_app/immutable/chunks/D3xLfT3q.js","_app/immutable/chunks/CuIfUMuc.js","_app/immutable/chunks/CNKuqfku.js","_app/immutable/chunks/oRfbssuc.js","_app/immutable/chunks/CdHnUH1e.js","_app/immutable/chunks/DUFUtOrg.js","_app/immutable/chunks/BmSu2Yhg.js","_app/immutable/chunks/Dnptkdu8.js","_app/immutable/chunks/Vb7vi_9G.js","_app/immutable/chunks/Cuy74Y2K.js","_app/immutable/chunks/DGg81-t1.js","_app/immutable/chunks/DhF8aboW.js","_app/immutable/chunks/-gUM5YTg.js","_app/immutable/chunks/DldiDE7P.js","_app/immutable/chunks/DjhzkWgO.js","_app/immutable/chunks/zswCIXf2.js"];
export const stylesheets = [];
export const fonts = [];
