import * as server from '../entries/pages/admin/repos/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/repos/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/repos/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.23fNnvpV.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Dnd2HTQh.js","_app/immutable/chunks/BDR25Ma5.js","_app/immutable/chunks/Dc2clUla.js","_app/immutable/chunks/DKZzDoih.js","_app/immutable/chunks/-9B-tiFA.js","_app/immutable/chunks/C4TM4onk.js","_app/immutable/chunks/CJAbemVW.js","_app/immutable/chunks/DqDWnSE2.js","_app/immutable/chunks/D5oE3Dzy.js","_app/immutable/chunks/H3ICmHr2.js","_app/immutable/chunks/CqyOSPLz.js","_app/immutable/chunks/jPWZ-Mdx.js","_app/immutable/chunks/DSIOUwQG.js","_app/immutable/chunks/D_udCXUP.js","_app/immutable/chunks/BlC5L8fo.js","_app/immutable/chunks/Co9s49gQ.js","_app/immutable/chunks/BTxy6n0L.js"];
export const stylesheets = [];
export const fonts = [];
