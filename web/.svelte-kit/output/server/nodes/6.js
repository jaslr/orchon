import * as server from '../entries/pages/admin/media/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/media/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/media/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.DTp9DUNb.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CkbQ0fmx.js","_app/immutable/chunks/DoutiFXv.js","_app/immutable/chunks/2F6J5UoK.js","_app/immutable/chunks/mpq541RX.js","_app/immutable/chunks/BA5TQFIO.js","_app/immutable/chunks/MKQmOL3t.js","_app/immutable/chunks/DSs_ThtC.js","_app/immutable/chunks/ZnW9umad.js","_app/immutable/chunks/Cyn51Uu8.js","_app/immutable/chunks/C_IQjJeC.js","_app/immutable/chunks/DsBYN9U3.js","_app/immutable/chunks/DlEkwEeY.js","_app/immutable/chunks/Cc0UJzpV.js"];
export const stylesheets = [];
export const fonts = [];
