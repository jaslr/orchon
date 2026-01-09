import * as server from '../entries/pages/admin/projects/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.TqkyCyeC.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/bOSu8_9I.js","_app/immutable/chunks/Ctk_jbRy.js","_app/immutable/chunks/C3RYBViL.js","_app/immutable/chunks/CNoyRSNi.js","_app/immutable/chunks/Di9dn3sX.js","_app/immutable/chunks/DephRoQt.js","_app/immutable/chunks/DBLdSKmK.js","_app/immutable/chunks/B3m_Asyl.js","_app/immutable/chunks/BtgbrfCX.js","_app/immutable/chunks/kAnafDTg.js","_app/immutable/chunks/CeZRj0qK.js","_app/immutable/chunks/C9ePCuFK.js","_app/immutable/chunks/DGJCo_Ae.js","_app/immutable/chunks/B4bRJSkD.js","_app/immutable/chunks/C5Oc2MIu.js"];
export const stylesheets = [];
export const fonts = [];
