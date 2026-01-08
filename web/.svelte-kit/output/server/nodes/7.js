import * as server from '../entries/pages/admin/projects/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.DUEY7jZR.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/iEcfl4Zz.js","_app/immutable/chunks/4ArvJHEk.js","_app/immutable/chunks/CK54UOYh.js","_app/immutable/chunks/7rkDPlKJ.js","_app/immutable/chunks/CMf16_yh.js","_app/immutable/chunks/BBHEdhUa.js","_app/immutable/chunks/Ca1PA8un.js","_app/immutable/chunks/CwC--y6C.js","_app/immutable/chunks/DyMLruig.js","_app/immutable/chunks/AITZGE8g.js","_app/immutable/chunks/LN5qzXlw.js","_app/immutable/chunks/Bti_CC6q.js","_app/immutable/chunks/BbAxONru.js","_app/immutable/chunks/Db2hGcdT.js"];
export const stylesheets = [];
export const fonts = [];
