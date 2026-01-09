import * as server from '../entries/pages/admin/infra/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/infra/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/infra/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.BE9I_yQB.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/bOSu8_9I.js","_app/immutable/chunks/Ctk_jbRy.js","_app/immutable/chunks/C3RYBViL.js","_app/immutable/chunks/CNoyRSNi.js","_app/immutable/chunks/Di9dn3sX.js","_app/immutable/chunks/CLEP-BiZ.js","_app/immutable/chunks/Bha2itWB.js","_app/immutable/chunks/DephRoQt.js","_app/immutable/chunks/DBLdSKmK.js","_app/immutable/chunks/B3m_Asyl.js","_app/immutable/chunks/BtgbrfCX.js","_app/immutable/chunks/CeJG3NcX.js","_app/immutable/chunks/Cldhpsde.js","_app/immutable/chunks/DGJCo_Ae.js","_app/immutable/chunks/8w5CS6qf.js","_app/immutable/chunks/C5Oc2MIu.js","_app/immutable/chunks/BhsAfQsw.js","_app/immutable/chunks/DdP2pKCi.js"];
export const stylesheets = [];
export const fonts = [];
