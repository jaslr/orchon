import * as server from '../entries/pages/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.C3AoI7nz.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CkbQ0fmx.js","_app/immutable/chunks/DoutiFXv.js","_app/immutable/chunks/2F6J5UoK.js","_app/immutable/chunks/mpq541RX.js","_app/immutable/chunks/BA5TQFIO.js","_app/immutable/chunks/DXjPty3v.js","_app/immutable/chunks/BLtbU3fE.js","_app/immutable/chunks/BL3PLj43.js","_app/immutable/chunks/ccRZTSYy.js","_app/immutable/chunks/DGckRKcz.js","_app/immutable/chunks/6Ay1lpaz.js","_app/immutable/chunks/DteJ_LcB.js"];
export const stylesheets = [];
export const fonts = [];
