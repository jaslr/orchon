import * as server from '../entries/pages/admin/media/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/media/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/media/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.DuzpguXu.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/3lJB4T0S.js","_app/immutable/chunks/BqZwnDtf.js","_app/immutable/chunks/BkU7iF2q.js","_app/immutable/chunks/Dq9r9tkR.js","_app/immutable/chunks/53_MOYEh.js","_app/immutable/chunks/CK0fwhnO.js","_app/immutable/chunks/CzNO7jfn.js","_app/immutable/chunks/B-8_DJw-.js","_app/immutable/chunks/CXT8IPDr.js","_app/immutable/chunks/BWU_0Y4_.js","_app/immutable/chunks/DYolqvgm.js","_app/immutable/chunks/B0HCi3WP.js","_app/immutable/chunks/ul4LdOAw.js"];
export const stylesheets = [];
export const fonts = [];
