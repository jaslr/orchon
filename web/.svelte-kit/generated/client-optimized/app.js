export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24')
];

export const server_loads = [0];

export const dictionary = {
		"/": [~4],
		"/admin": [~5,[2]],
		"/admin/infra": [~6,[2]],
		"/admin/media": [~7,[2]],
		"/admin/projects": [~8,[2]],
		"/admin/repos": [~9,[2]],
		"/deployments": [~10],
		"/design-system": [11,[3]],
		"/design-system/colors": [12,[3]],
		"/design-system/components": [13,[3]],
		"/design-system/data-display": [14,[3]],
		"/design-system/layout": [15,[3]],
		"/design-system/typography": [16,[3]],
		"/ecosystem": [17],
		"/infrastructure/map": [~18],
		"/infrastructure/settings": [~19],
		"/login": [20],
		"/logout": [21],
		"/projects-infra": [~23],
		"/projects": [~22],
		"/vastpuddle": [~24]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';