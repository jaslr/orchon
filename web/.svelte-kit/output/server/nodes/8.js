import * as server from '../entries/pages/admin/repos/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/repos/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/repos/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.D_TDJU6y.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/bOSu8_9I.js","_app/immutable/chunks/Ctk_jbRy.js","_app/immutable/chunks/C3RYBViL.js","_app/immutable/chunks/CNoyRSNi.js","_app/immutable/chunks/Di9dn3sX.js","_app/immutable/chunks/DephRoQt.js","_app/immutable/chunks/DBLdSKmK.js","_app/immutable/chunks/B3m_Asyl.js","_app/immutable/chunks/CXc4qgr9.js","_app/immutable/chunks/D3M7jnZE.js","_app/immutable/chunks/CeZRj0qK.js","_app/immutable/chunks/C9ePCuFK.js","_app/immutable/chunks/CeJG3NcX.js","_app/immutable/chunks/DdP2pKCi.js","_app/immutable/chunks/BMKZ75K2.js"];
export const stylesheets = [];
export const fonts = [];
