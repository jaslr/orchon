import * as server from '../entries/pages/projects-infra/_page.server.ts.js';

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/projects-infra/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/projects-infra/+page.server.ts";
export const imports = ["_app/immutable/nodes/23.D1nBIhJd.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/VB45bhtT.js","_app/immutable/chunks/CgppWemH.js","_app/immutable/chunks/D3xLfT3q.js","_app/immutable/chunks/CuIfUMuc.js","_app/immutable/chunks/CNKuqfku.js","_app/immutable/chunks/oRfbssuc.js","_app/immutable/chunks/B2E4lz1E.js","_app/immutable/chunks/CyWyFm7g.js","_app/immutable/chunks/Vb7vi_9G.js","_app/immutable/chunks/0u-3TZwK.js","_app/immutable/chunks/CZQQNBM6.js","_app/immutable/chunks/BOQm8QVN.js","_app/immutable/chunks/D-fFndYq.js","_app/immutable/chunks/Dx9Ea-xZ.js","_app/immutable/chunks/DeNegKwn.js","_app/immutable/chunks/BvOfDT3N.js","_app/immutable/chunks/DYc-kdkA.js","_app/immutable/chunks/B7WRp732.js"];
export const stylesheets = [];
export const fonts = [];
