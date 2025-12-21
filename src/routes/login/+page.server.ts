import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { verifyPassword, createSession, addSession, getSessionCookie } from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password');

		if (!password || typeof password !== 'string') {
			return fail(400, { error: 'Password is required' });
		}

		if (!verifyPassword(password)) {
			return fail(401, { error: 'Invalid password' });
		}

		// Create session
		const sessionToken = createSession();
		addSession(sessionToken);

		// Set session cookie
		const { name, options } = getSessionCookie();
		cookies.set(name, sessionToken, options);

		// Redirect to home
		throw redirect(303, '/');
	}
};
