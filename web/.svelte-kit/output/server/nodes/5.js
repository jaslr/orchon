import * as server from '../entries/pages/admin/infra/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/infra/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/infra/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.BVX5MXCB.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/3lJB4T0S.js","_app/immutable/chunks/BqZwnDtf.js","_app/immutable/chunks/BkU7iF2q.js","_app/immutable/chunks/Dq9r9tkR.js","_app/immutable/chunks/53_MOYEh.js","_app/immutable/chunks/CAKD87xN.js","_app/immutable/chunks/DL8kRa9u.js","_app/immutable/chunks/DPG26kUK.js","_app/immutable/chunks/BYv6PIKQ.js","_app/immutable/chunks/B-8_DJw-.js","_app/immutable/chunks/D_5SrLdS.js","_app/immutable/chunks/DxkD0P21.js","_app/immutable/chunks/BhyKitcD.js","_app/immutable/chunks/4HMVQlM3.js","_app/immutable/chunks/CQyleI3m.js","_app/immutable/chunks/B0HCi3WP.js","_app/immutable/chunks/26VZBFpm.js"];
export const stylesheets = [];
export const fonts = [];
