import * as server from '../entries/pages/admin/projects/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.INcdh2FY.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/3lJB4T0S.js","_app/immutable/chunks/BqZwnDtf.js","_app/immutable/chunks/BkU7iF2q.js","_app/immutable/chunks/Dq9r9tkR.js","_app/immutable/chunks/53_MOYEh.js","_app/immutable/chunks/CK0fwhnO.js","_app/immutable/chunks/CzNO7jfn.js","_app/immutable/chunks/B-8_DJw-.js","_app/immutable/chunks/D_5SrLdS.js","_app/immutable/chunks/BWU_0Y4_.js","_app/immutable/chunks/DYolqvgm.js","_app/immutable/chunks/4HMVQlM3.js","_app/immutable/chunks/CDzDf117.js","_app/immutable/chunks/B0HCi3WP.js"];
export const stylesheets = [];
export const fonts = [];
