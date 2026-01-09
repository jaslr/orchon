import * as server from '../entries/pages/admin/media/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/media/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/media/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.CHLm-7Nz.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/bOSu8_9I.js","_app/immutable/chunks/Ctk_jbRy.js","_app/immutable/chunks/C3RYBViL.js","_app/immutable/chunks/CNoyRSNi.js","_app/immutable/chunks/Di9dn3sX.js","_app/immutable/chunks/DephRoQt.js","_app/immutable/chunks/DBLdSKmK.js","_app/immutable/chunks/B3m_Asyl.js","_app/immutable/chunks/DzKsVWs4.js","_app/immutable/chunks/CeZRj0qK.js","_app/immutable/chunks/C9ePCuFK.js","_app/immutable/chunks/C5Oc2MIu.js","_app/immutable/chunks/Bdf83RYj.js"];
export const stylesheets = [];
export const fonts = [];
