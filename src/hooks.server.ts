import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';

const PUBLIC_PATHS = ['/login'];

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');
	event.locals.user = null;

	if (token) {
		event.locals.user = await getSessionUser(token);
		if (!event.locals.user) {
			event.cookies.delete('session', { path: '/' });
		}
	}

	const isPublic = PUBLIC_PATHS.some((p) => event.url.pathname.startsWith(p));

	if (!event.locals.user && !isPublic) {
		throw redirect(303, '/login');
	}

	if (event.locals.user && event.url.pathname === '/login') {
		throw redirect(303, '/');
	}

	return resolve(event);
};
