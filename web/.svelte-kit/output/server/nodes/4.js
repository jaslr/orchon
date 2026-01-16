import * as server from '../entries/pages/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.Cf0KcJh9.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Dnd2HTQh.js","_app/immutable/chunks/BDR25Ma5.js","_app/immutable/chunks/Dc2clUla.js","_app/immutable/chunks/DKZzDoih.js","_app/immutable/chunks/-9B-tiFA.js","_app/immutable/chunks/C4TM4onk.js","_app/immutable/chunks/DoDuvpHD.js","_app/immutable/chunks/H3ICmHr2.js","_app/immutable/chunks/CqyOSPLz.js","_app/immutable/chunks/B9P3TxM7.js","_app/immutable/chunks/I1MDvhxE.js","_app/immutable/chunks/CsZXPqt4.js","_app/immutable/chunks/kBCAqlMW.js","_app/immutable/chunks/BMerYcAb.js","_app/immutable/chunks/BFTGOLv7.js"];
export const stylesheets = [];
export const fonts = [];
