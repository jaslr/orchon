import * as server from '../entries/pages/admin/repos/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/repos/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/repos/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.B-G74R-_.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BSOyUNbi.js","_app/immutable/chunks/B-w-zG1D.js","_app/immutable/chunks/D9u8SmGH.js","_app/immutable/chunks/CWULbE_g.js","_app/immutable/chunks/Bz1uhfmE.js","_app/immutable/chunks/CC450J7M.js","_app/immutable/chunks/Aiil3hLA.js","_app/immutable/chunks/BoMp02Tq.js","_app/immutable/chunks/Cw-qc8fR.js","_app/immutable/chunks/BLlU21Q1.js","_app/immutable/chunks/BzoROJm5.js","_app/immutable/chunks/DtqEC8bV.js","_app/immutable/chunks/DGaLqRSr.js","_app/immutable/chunks/C9Mt9y2y.js","_app/immutable/chunks/D7IA7gIE.js"];
export const stylesheets = [];
export const fonts = [];
