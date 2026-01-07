import * as server from '../entries/pages/projects/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.Dyeo9fWv.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/3lJB4T0S.js","_app/immutable/chunks/BqZwnDtf.js","_app/immutable/chunks/BkU7iF2q.js","_app/immutable/chunks/Dq9r9tkR.js","_app/immutable/chunks/53_MOYEh.js","_app/immutable/chunks/CAKD87xN.js","_app/immutable/chunks/DL8kRa9u.js","_app/immutable/chunks/DrcWuEQs.js","_app/immutable/chunks/BoK36d67.js","_app/immutable/chunks/BYv6PIKQ.js","_app/immutable/chunks/B-8_DJw-.js","_app/immutable/chunks/BLtbU3fE.js","_app/immutable/chunks/BL3PLj43.js","_app/immutable/chunks/CE3FrX7Z.js","_app/immutable/chunks/4HMVQlM3.js","_app/immutable/chunks/C1MZzrQL.js","_app/immutable/chunks/BhyKitcD.js","_app/immutable/chunks/CXT8IPDr.js","_app/immutable/chunks/wnauRcpB.js","_app/immutable/chunks/26VZBFpm.js","_app/immutable/chunks/ul4LdOAw.js","_app/immutable/chunks/DVO2uRpj.js"];
export const stylesheets = ["_app/immutable/assets/13.CXPR0kzH.css"];
export const fonts = [];
