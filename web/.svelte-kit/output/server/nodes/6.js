import * as server from '../entries/pages/admin/media/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/media/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/media/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.CGIU30PX.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CL4b-QGh.js","_app/immutable/chunks/DFDYhcTj.js","_app/immutable/chunks/Dq793ZgP.js","_app/immutable/chunks/COk9xX4d.js","_app/immutable/chunks/DGsCO491.js","_app/immutable/chunks/DKBxQBws.js","_app/immutable/chunks/DV6nwRjG.js","_app/immutable/chunks/ppHdf72C.js","_app/immutable/chunks/DjrN0Uk_.js","_app/immutable/chunks/3OI3-BpM.js","_app/immutable/chunks/D4riwIEL.js","_app/immutable/chunks/RUkTqTw2.js","_app/immutable/chunks/Bu_oxHsc.js"];
export const stylesheets = [];
export const fonts = [];
