import * as server from '../entries/pages/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.BDBsPxPM.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/3lJB4T0S.js","_app/immutable/chunks/BqZwnDtf.js","_app/immutable/chunks/BkU7iF2q.js","_app/immutable/chunks/Dq9r9tkR.js","_app/immutable/chunks/53_MOYEh.js","_app/immutable/chunks/DL8kRa9u.js","_app/immutable/chunks/BLtbU3fE.js","_app/immutable/chunks/BL3PLj43.js","_app/immutable/chunks/DIT1yhw6.js","_app/immutable/chunks/C1MZzrQL.js","_app/immutable/chunks/CQyleI3m.js"];
export const stylesheets = [];
export const fonts = [];
