import { observations } from '$lib/db/mongo';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	save: async ({ request }) => {
		const data = await request.formData();
		const birdId = data.get('birdId') as string;
		const lat = parseFloat(data.get('lat') as string);
		const lng = parseFloat(data.get('lng') as string);
		const date = data.get('date') as string;
		const time = data.get('time') as string;
		const notes = data.get('notes') as string;

		if (!birdId || isNaN(lat) || isNaN(lng) || !date || !time) {
			return fail(400, { message: 'Missing required fields' });
		}

		try {
			await observations.insertOne({
				birdId,
				location: { lat, lng },
				date,
				time,
				notes,
				createdAt: new Date()
			});
		} catch (e) {
			console.error('Failed to save observation:', e);
			return fail(500, { message: 'Internal Server Error' });
		}

		return { success: true };
	}
};
