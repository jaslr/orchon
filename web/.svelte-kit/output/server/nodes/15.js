import * as server from '../entries/pages/projects/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.C3wVxdl8.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/bOSu8_9I.js","_app/immutable/chunks/Ctk_jbRy.js","_app/immutable/chunks/C3RYBViL.js","_app/immutable/chunks/CNoyRSNi.js","_app/immutable/chunks/Di9dn3sX.js","_app/immutable/chunks/CLEP-BiZ.js","_app/immutable/chunks/Bha2itWB.js","_app/immutable/chunks/B6M8tXk1.js","_app/immutable/chunks/C_E80Rkr.js","_app/immutable/chunks/DBLdSKmK.js","_app/immutable/chunks/B3m_Asyl.js","_app/immutable/chunks/BLtbU3fE.js","_app/immutable/chunks/BL3PLj43.js","_app/immutable/chunks/CMw6ZOtl.js","_app/immutable/chunks/DGJCo_Ae.js","_app/immutable/chunks/D3M7jnZE.js","_app/immutable/chunks/Cldhpsde.js","_app/immutable/chunks/DzKsVWs4.js","_app/immutable/chunks/BMKZ75K2.js","_app/immutable/chunks/BhsAfQsw.js","_app/immutable/chunks/DoOMFIXW.js","_app/immutable/chunks/DdP2pKCi.js","_app/immutable/chunks/Bdf83RYj.js","_app/immutable/chunks/DT_KS8kY.js"];
export const stylesheets = ["_app/immutable/assets/15.CXPR0kzH.css"];
export const fonts = [];
