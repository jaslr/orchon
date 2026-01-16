

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.Cc2mPh6r.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Dnd2HTQh.js","_app/immutable/chunks/-9B-tiFA.js"];
export const stylesheets = [];
export const fonts = [];
