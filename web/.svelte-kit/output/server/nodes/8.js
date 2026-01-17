import * as server from '../entries/pages/admin/projects/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.zx5hX1P2.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Dnd2HTQh.js","_app/immutable/chunks/BDR25Ma5.js","_app/immutable/chunks/Dc2clUla.js","_app/immutable/chunks/DKZzDoih.js","_app/immutable/chunks/-9B-tiFA.js","_app/immutable/chunks/C4TM4onk.js","_app/immutable/chunks/C-NCt21m.js","_app/immutable/chunks/Cyzlk6cb.js","_app/immutable/chunks/D5oE3Dzy.js","_app/immutable/chunks/H3ICmHr2.js","_app/immutable/chunks/CqyOSPLz.js","_app/immutable/chunks/B4DMYMvU.js","_app/immutable/chunks/DxDiyXRC.js","_app/immutable/chunks/jPWZ-Mdx.js","_app/immutable/chunks/DSIOUwQG.js","_app/immutable/chunks/CrdDX_k0.js","_app/immutable/chunks/BH6OhVQf.js","_app/immutable/chunks/CVhdyYUq.js"];
export const stylesheets = [];
export const fonts = [];
