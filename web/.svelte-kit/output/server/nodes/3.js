import * as server from '../entries/pages/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.CF2sqvYu.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/iEcfl4Zz.js","_app/immutable/chunks/4ArvJHEk.js","_app/immutable/chunks/CK54UOYh.js","_app/immutable/chunks/7rkDPlKJ.js","_app/immutable/chunks/CMf16_yh.js","_app/immutable/chunks/DgAUzZTY.js","_app/immutable/chunks/BLtbU3fE.js","_app/immutable/chunks/BL3PLj43.js","_app/immutable/chunks/CdGRohIx.js","_app/immutable/chunks/M1V3mCm3.js","_app/immutable/chunks/D4r3jmnC.js"];
export const stylesheets = [];
export const fonts = [];
