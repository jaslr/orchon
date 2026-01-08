import * as server from '../entries/pages/admin/repos/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/repos/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/repos/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.Cc0sD6Qc.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/iEcfl4Zz.js","_app/immutable/chunks/4ArvJHEk.js","_app/immutable/chunks/CK54UOYh.js","_app/immutable/chunks/7rkDPlKJ.js","_app/immutable/chunks/CMf16_yh.js","_app/immutable/chunks/BBHEdhUa.js","_app/immutable/chunks/Ca1PA8un.js","_app/immutable/chunks/CwC--y6C.js","_app/immutable/chunks/C9o2z8Fi.js","_app/immutable/chunks/M1V3mCm3.js","_app/immutable/chunks/AITZGE8g.js","_app/immutable/chunks/LN5qzXlw.js","_app/immutable/chunks/Cwqc4Kp8.js","_app/immutable/chunks/FZHiLi6P.js","_app/immutable/chunks/BnRnjDSQ.js"];
export const stylesheets = [];
export const fonts = [];
