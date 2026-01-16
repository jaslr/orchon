import * as server from '../entries/pages/admin/infra/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/infra/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/infra/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.DXXQ7UJX.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BZ9E3_SD.js","_app/immutable/chunks/w6f9Dn5M.js","_app/immutable/chunks/C_ntH7U2.js","_app/immutable/chunks/B-25t-Xl.js","_app/immutable/chunks/7Z-uf5tq.js","_app/immutable/chunks/DqmgPq9b.js","_app/immutable/chunks/ybUTsV0v.js","_app/immutable/chunks/BNx1VcPb.js","_app/immutable/chunks/BPGjxjCa.js","_app/immutable/chunks/DhisZZcJ.js","_app/immutable/chunks/Bobjs0eu.js","_app/immutable/chunks/BtPIuOMa.js","_app/immutable/chunks/D6GbuAV1.js","_app/immutable/chunks/DebMwDgC.js","_app/immutable/chunks/j-PQ5oi3.js","_app/immutable/chunks/BY2y01x2.js","_app/immutable/chunks/CHjeFu-U.js","_app/immutable/chunks/CqEMAlYQ.js","_app/immutable/chunks/CEeGp6p0.js","_app/immutable/chunks/BGgzA8wX.js","_app/immutable/chunks/C2BU44tR.js","_app/immutable/chunks/BjCqqO0p.js"];
export const stylesheets = [];
export const fonts = [];
