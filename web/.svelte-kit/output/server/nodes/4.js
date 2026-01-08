import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.Bn1UZGbx.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/D76zQ5lT.js","_app/immutable/chunks/iEcfl4Zz.js"];
export const stylesheets = [];
export const fonts = [];
