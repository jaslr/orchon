import * as server from '../entries/pages/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.0VZq3gqi.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BZ9E3_SD.js","_app/immutable/chunks/w6f9Dn5M.js","_app/immutable/chunks/C_ntH7U2.js","_app/immutable/chunks/B-25t-Xl.js","_app/immutable/chunks/7Z-uf5tq.js","_app/immutable/chunks/DqmgPq9b.js","_app/immutable/chunks/BNx1VcPb.js","_app/immutable/chunks/BtPIuOMa.js","_app/immutable/chunks/D6GbuAV1.js","_app/immutable/chunks/BLtbU3fE.js","_app/immutable/chunks/BL3PLj43.js","_app/immutable/chunks/BGgzA8wX.js","_app/immutable/chunks/IxzUao5s.js","_app/immutable/chunks/BPgbjbb4.js","_app/immutable/chunks/BV3tpEIY.js","_app/immutable/chunks/BBLIfywf.js","_app/immutable/chunks/CqEMAlYQ.js"];
export const stylesheets = [];
export const fonts = [];
