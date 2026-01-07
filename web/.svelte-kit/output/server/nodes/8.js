import * as server from '../entries/pages/admin/repos/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/repos/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/repos/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.BEjXqV7X.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/3lJB4T0S.js","_app/immutable/chunks/BqZwnDtf.js","_app/immutable/chunks/BkU7iF2q.js","_app/immutable/chunks/Dq9r9tkR.js","_app/immutable/chunks/53_MOYEh.js","_app/immutable/chunks/CK0fwhnO.js","_app/immutable/chunks/CzNO7jfn.js","_app/immutable/chunks/B-8_DJw-.js","_app/immutable/chunks/D2XFzKsk.js","_app/immutable/chunks/C1MZzrQL.js","_app/immutable/chunks/BWU_0Y4_.js","_app/immutable/chunks/DYolqvgm.js","_app/immutable/chunks/DxkD0P21.js","_app/immutable/chunks/26VZBFpm.js","_app/immutable/chunks/wnauRcpB.js"];
export const stylesheets = [];
export const fonts = [];
