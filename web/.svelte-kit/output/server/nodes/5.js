import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.YRMt9PsW.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/DgMWnZDe.js","_app/immutable/chunks/VB45bhtT.js"];
export const stylesheets = [];
export const fonts = [];
