import * as server from '../entries/pages/admin/repos/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/repos/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/repos/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.BwVWLD_7.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/VB45bhtT.js","_app/immutable/chunks/CgppWemH.js","_app/immutable/chunks/D3xLfT3q.js","_app/immutable/chunks/CuIfUMuc.js","_app/immutable/chunks/CNKuqfku.js","_app/immutable/chunks/oRfbssuc.js","_app/immutable/chunks/D9cb817Y.js","_app/immutable/chunks/CruRBgby.js","_app/immutable/chunks/BmSu2Yhg.js","_app/immutable/chunks/CyWyFm7g.js","_app/immutable/chunks/Vb7vi_9G.js","_app/immutable/chunks/BpcHedM6.js","_app/immutable/chunks/DYc-kdkA.js","_app/immutable/chunks/BTHoARqq.js","_app/immutable/chunks/DXTVCWaa.js","_app/immutable/chunks/DHPVhr-M.js","_app/immutable/chunks/CbrDBhVw.js","_app/immutable/chunks/BvOfDT3N.js","_app/immutable/chunks/3AgTduRZ.js"];
export const stylesheets = [];
export const fonts = [];
