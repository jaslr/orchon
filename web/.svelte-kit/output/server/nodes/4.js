import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.CQbg_AZQ.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/B89TM4mc.js","_app/immutable/chunks/CkbQ0fmx.js"];
export const stylesheets = [];
export const fonts = [];
