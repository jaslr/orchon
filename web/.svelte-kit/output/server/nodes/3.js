import * as server from '../entries/pages/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.BTc5jQwF.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CL4b-QGh.js","_app/immutable/chunks/DFDYhcTj.js","_app/immutable/chunks/Dq793ZgP.js","_app/immutable/chunks/COk9xX4d.js","_app/immutable/chunks/DGsCO491.js","_app/immutable/chunks/B_BmYVQ0.js","_app/immutable/chunks/BLtbU3fE.js","_app/immutable/chunks/BL3PLj43.js","_app/immutable/chunks/5pPgwzQp.js","_app/immutable/chunks/CAWl8KFU.js","_app/immutable/chunks/nPdX1cYL.js"];
export const stylesheets = [];
export const fonts = [];
