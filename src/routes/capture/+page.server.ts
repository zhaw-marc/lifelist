import { observations, species } from '$lib/db/mongo';
import { birds as staticBirds } from '$lib/data/birds';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [speciesList, observedCodes] = await Promise.all([
		species
			.find({}, { projection: { _id: 0, speciesCode: 1, name: 1, latinName: 1, image: 1 } })
			.sort({ name: 1 })
			.toArray(),
		observations.distinct('birdId')
	]);

	// Fall back to static birds if the species collection hasn't been seeded yet
	const birds =
		speciesList.length > 0
			? speciesList
			: staticBirds.map((b) => ({
					speciesCode: b.id,
					name: b.name,
					latinName: b.latinName,
					image: b.image as string | undefined
				}));

	return {
		speciesList: birds,
		observedCodes: observedCodes as string[]
	};
};

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
			return fail(400, { message: 'Bitte alle Pflichtfelder ausfüllen.' });
		}

		const existingCount = await observations.countDocuments({ birdId });
		const isNewLifer = existingCount === 0;

		try {
			await observations.insertOne({
				birdId,
				location: { lat, lng },
				date,
				time,
				notes: notes || '',
				createdAt: new Date()
			});
		} catch (e) {
			console.error('Failed to save observation:', e);
			return fail(500, { message: 'Speichern fehlgeschlagen. Bitte erneut versuchen.' });
		}

		return { success: true, isNewLifer };
	}
};
