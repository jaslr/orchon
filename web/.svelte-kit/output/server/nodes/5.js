import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.3HibXrab.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/DchTnB_e.js","_app/immutable/chunks/BZ9E3_SD.js"];
export const stylesheets = [];
export const fonts = [];
