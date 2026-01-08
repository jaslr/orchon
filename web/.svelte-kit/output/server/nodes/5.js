import * as server from '../entries/pages/admin/infra/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/infra/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/infra/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.DBuIS2Yo.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CL4b-QGh.js","_app/immutable/chunks/DFDYhcTj.js","_app/immutable/chunks/Dq793ZgP.js","_app/immutable/chunks/COk9xX4d.js","_app/immutable/chunks/DGsCO491.js","_app/immutable/chunks/BzCjhwUL.js","_app/immutable/chunks/B_BmYVQ0.js","_app/immutable/chunks/DKBxQBws.js","_app/immutable/chunks/DV6nwRjG.js","_app/immutable/chunks/ppHdf72C.js","_app/immutable/chunks/D4Qbqg20.js","_app/immutable/chunks/sWZfgLfO.js","_app/immutable/chunks/B_1YJyaF.js","_app/immutable/chunks/B-O1add9.js","_app/immutable/chunks/nPdX1cYL.js","_app/immutable/chunks/RUkTqTw2.js","_app/immutable/chunks/DX_uZf51.js","_app/immutable/chunks/1WW8FyDU.js"];
export const stylesheets = [];
export const fonts = [];
