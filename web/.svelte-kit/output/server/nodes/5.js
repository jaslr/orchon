import * as server from '../entries/pages/admin/infra/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/infra/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/infra/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.CPgB6IXw.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/iEcfl4Zz.js","_app/immutable/chunks/4ArvJHEk.js","_app/immutable/chunks/CK54UOYh.js","_app/immutable/chunks/7rkDPlKJ.js","_app/immutable/chunks/CMf16_yh.js","_app/immutable/chunks/Bu-3zCN-.js","_app/immutable/chunks/DgAUzZTY.js","_app/immutable/chunks/BBHEdhUa.js","_app/immutable/chunks/Ca1PA8un.js","_app/immutable/chunks/CwC--y6C.js","_app/immutable/chunks/DyMLruig.js","_app/immutable/chunks/Cwqc4Kp8.js","_app/immutable/chunks/BZTZLBpC.js","_app/immutable/chunks/Bti_CC6q.js","_app/immutable/chunks/D4r3jmnC.js","_app/immutable/chunks/Db2hGcdT.js","_app/immutable/chunks/CgocT6K2.js","_app/immutable/chunks/FZHiLi6P.js"];
export const stylesheets = [];
export const fonts = [];
