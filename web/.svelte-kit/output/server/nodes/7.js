import * as server from '../entries/pages/admin/projects/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.DYgVTUZG.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BSOyUNbi.js","_app/immutable/chunks/B-w-zG1D.js","_app/immutable/chunks/D9u8SmGH.js","_app/immutable/chunks/CWULbE_g.js","_app/immutable/chunks/Bz1uhfmE.js","_app/immutable/chunks/CC450J7M.js","_app/immutable/chunks/Aiil3hLA.js","_app/immutable/chunks/BoMp02Tq.js","_app/immutable/chunks/CPRrDHYP.js","_app/immutable/chunks/BzoROJm5.js","_app/immutable/chunks/DtqEC8bV.js","_app/immutable/chunks/ql8GN9kl.js","_app/immutable/chunks/UgBWGJLQ.js","_app/immutable/chunks/BVYw7Hpw.js"];
export const stylesheets = [];
export const fonts = [];
