import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createUser, getUserByCredentials, createSession, deleteSession } from '$lib/server/auth';

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = (data.get('username') as string)?.trim();
		const password = data.get('password') as string;

		if (!username || !password) {
			return fail(400, { error: 'Bitte alle Felder ausfüllen.', mode: 'login' });
		}

		const user = await getUserByCredentials(username, password);
		if (!user) {
			return fail(401, { error: 'Ungültiger Benutzername oder Passwort.', mode: 'login' });
		}

		const token = await createSession(user.id);
		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60
		});

		throw redirect(303, '/');
	},

	register: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = (data.get('username') as string)?.trim();
		const password = data.get('password') as string;
		const confirm = data.get('confirm') as string;

		if (!username || !password || !confirm) {
			return fail(400, { error: 'Bitte alle Felder ausfüllen.', mode: 'register' });
		}
		if (username.length < 2) {
			return fail(400, { error: 'Benutzername muss mindestens 2 Zeichen haben.', mode: 'register' });
		}
		if (password.length < 8) {
			return fail(400, { error: 'Passwort muss mindestens 8 Zeichen haben.', mode: 'register' });
		}
		if (password !== confirm) {
			return fail(400, { error: 'Passwörter stimmen nicht überein.', mode: 'register' });
		}

		let userId: string;
		try {
			userId = await createUser(username, password);
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : 'Registrierung fehlgeschlagen.';
			return fail(409, { error: msg, mode: 'register' });
		}

		const token = await createSession(userId);
		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60
		});

		throw redirect(303, '/');
	},

	logout: async ({ cookies }) => {
		const token = cookies.get('session');
		if (token) {
			await deleteSession(token);
			cookies.delete('session', { path: '/' });
		}
		throw redirect(303, '/login');
	}
};
