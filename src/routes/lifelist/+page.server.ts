import { observations, species } from '$lib/db/mongo';
import { birds as staticBirds } from '$lib/data/birds';
import { ObjectId } from 'mongodb';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = new ObjectId(locals.user!.id);
	const obs = await observations
		.find({ userId })
		.sort({ date: -1, time: -1 })
		.toArray();

	const birdIds = [...new Set(obs.map((o) => o.birdId))];

	// Try species collection (eBird codes) first, fall back to static birds.ts
	const speciesList = await species
		.find({ speciesCode: { $in: birdIds } })
		.toArray();

	const speciesMap = Object.fromEntries(speciesList.map((s) => [s.speciesCode, s]));
	const staticMap = Object.fromEntries(staticBirds.map((b) => [b.id, b]));

	const entries = obs.map((o) => {
		const fromDb = speciesMap[o.birdId];
		const fromStatic = staticMap[o.birdId];
		return {
			id: o._id.toString(),
			birdId: o.birdId,
			date: o.date as string,
			time: o.time as string,
			notes: (o.notes as string) ?? '',
			location: o.location as { lat: number; lng: number } | null,
			species: fromDb
				? { name: fromDb.name, latinName: fromDb.latinName, image: fromDb.image ?? null }
				: fromStatic
					? { name: fromStatic.name, latinName: fromStatic.latinName, image: fromStatic.image }
					: null
		};
	});

	return { entries };
};
