import * as server from '../entries/pages/admin/repos/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/repos/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/repos/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.CM6HqY6J.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CL4b-QGh.js","_app/immutable/chunks/DFDYhcTj.js","_app/immutable/chunks/Dq793ZgP.js","_app/immutable/chunks/COk9xX4d.js","_app/immutable/chunks/DGsCO491.js","_app/immutable/chunks/DKBxQBws.js","_app/immutable/chunks/DV6nwRjG.js","_app/immutable/chunks/ppHdf72C.js","_app/immutable/chunks/zPVcj-Lc.js","_app/immutable/chunks/CAWl8KFU.js","_app/immutable/chunks/3OI3-BpM.js","_app/immutable/chunks/D4riwIEL.js","_app/immutable/chunks/sWZfgLfO.js","_app/immutable/chunks/1WW8FyDU.js","_app/immutable/chunks/Cycx0LZO.js"];
export const stylesheets = [];
export const fonts = [];
