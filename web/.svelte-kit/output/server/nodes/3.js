import * as server from '../entries/pages/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.lf8dlkwV.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/bOSu8_9I.js","_app/immutable/chunks/Ctk_jbRy.js","_app/immutable/chunks/C3RYBViL.js","_app/immutable/chunks/CNoyRSNi.js","_app/immutable/chunks/Di9dn3sX.js","_app/immutable/chunks/Bha2itWB.js","_app/immutable/chunks/BLtbU3fE.js","_app/immutable/chunks/BL3PLj43.js","_app/immutable/chunks/BhsAfQsw.js","_app/immutable/chunks/CAAZjQWN.js","_app/immutable/chunks/D3M7jnZE.js","_app/immutable/chunks/8w5CS6qf.js"];
export const stylesheets = [];
export const fonts = [];
