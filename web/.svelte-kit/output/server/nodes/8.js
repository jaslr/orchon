import * as server from '../entries/pages/admin/repos/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/repos/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/repos/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.Cnwh1PCe.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CkbQ0fmx.js","_app/immutable/chunks/DoutiFXv.js","_app/immutable/chunks/2F6J5UoK.js","_app/immutable/chunks/mpq541RX.js","_app/immutable/chunks/BA5TQFIO.js","_app/immutable/chunks/MKQmOL3t.js","_app/immutable/chunks/DSs_ThtC.js","_app/immutable/chunks/ZnW9umad.js","_app/immutable/chunks/CS6Ijvtw.js","_app/immutable/chunks/6Ay1lpaz.js","_app/immutable/chunks/C_IQjJeC.js","_app/immutable/chunks/DsBYN9U3.js","_app/immutable/chunks/D8wHWX2U.js","_app/immutable/chunks/B2wd7ytj.js","_app/immutable/chunks/Bt3tuVPd.js"];
export const stylesheets = [];
export const fonts = [];
