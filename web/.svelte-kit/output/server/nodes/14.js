import * as server from '../entries/pages/projects/_page.server.ts.js';

export const index = 14;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/14.Ce8Drlgl.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/iEcfl4Zz.js","_app/immutable/chunks/4ArvJHEk.js","_app/immutable/chunks/CK54UOYh.js","_app/immutable/chunks/7rkDPlKJ.js","_app/immutable/chunks/CMf16_yh.js","_app/immutable/chunks/Bu-3zCN-.js","_app/immutable/chunks/DgAUzZTY.js","_app/immutable/chunks/Boo77ElX.js","_app/immutable/chunks/D077xblk.js","_app/immutable/chunks/Ca1PA8un.js","_app/immutable/chunks/CwC--y6C.js","_app/immutable/chunks/BLtbU3fE.js","_app/immutable/chunks/BL3PLj43.js","_app/immutable/chunks/CVEYR93t.js","_app/immutable/chunks/Bti_CC6q.js","_app/immutable/chunks/M1V3mCm3.js","_app/immutable/chunks/CgocT6K2.js","_app/immutable/chunks/CEP89aA4.js","_app/immutable/chunks/BnRnjDSQ.js","_app/immutable/chunks/Bu3edill.js","_app/immutable/chunks/BZTZLBpC.js","_app/immutable/chunks/FZHiLi6P.js","_app/immutable/chunks/BakHj3fC.js","_app/immutable/chunks/-CFbdOaC.js"];
export const stylesheets = ["_app/immutable/assets/14.CXPR0kzH.css"];
export const fonts = [];
