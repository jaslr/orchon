import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.CqDUaU4Q.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/0gMlaADi.js","_app/immutable/chunks/Dnd2HTQh.js"];
export const stylesheets = [];
export const fonts = [];
