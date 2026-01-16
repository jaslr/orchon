import * as server from '../entries/pages/admin/repos/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/repos/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/repos/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.Bj4iMijg.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BZ9E3_SD.js","_app/immutable/chunks/w6f9Dn5M.js","_app/immutable/chunks/C_ntH7U2.js","_app/immutable/chunks/B-25t-Xl.js","_app/immutable/chunks/7Z-uf5tq.js","_app/immutable/chunks/DqmgPq9b.js","_app/immutable/chunks/BPGjxjCa.js","_app/immutable/chunks/DhisZZcJ.js","_app/immutable/chunks/Bobjs0eu.js","_app/immutable/chunks/BtPIuOMa.js","_app/immutable/chunks/D6GbuAV1.js","_app/immutable/chunks/Cb_T99UY.js","_app/immutable/chunks/BBLIfywf.js","_app/immutable/chunks/Cl7wu_cI.js","_app/immutable/chunks/BiC242-u.js","_app/immutable/chunks/j-PQ5oi3.js","_app/immutable/chunks/BjCqqO0p.js","_app/immutable/chunks/B32lMzh2.js","_app/immutable/chunks/Bbu46QjL.js"];
export const stylesheets = [];
export const fonts = [];
