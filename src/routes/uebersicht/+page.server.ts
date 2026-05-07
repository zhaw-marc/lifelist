import { species } from '$lib/db/mongo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const list = await species
		.find({})
		.sort({ name: 1 })
		.project({ speciesCode: 1, name: 1, latinName: 1, image: 1, familyComName: 1, order: 1 })
		.toArray();

	return {
		species: list.map((s) => ({
			speciesCode: s.speciesCode as string,
			name: s.name as string,
			latinName: s.latinName as string,
			image: (s.image as string) ?? null,
			familyComName: (s.familyComName as string) ?? null
		}))
	};
};
