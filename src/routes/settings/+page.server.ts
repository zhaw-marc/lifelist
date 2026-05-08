import { observations } from '$lib/db/mongo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [totalObs, uniqueBirdIds, earliest] = await Promise.all([
		observations.countDocuments({}),
		observations.distinct('birdId'),
		observations.findOne({}, { sort: { date: 1 }, projection: { date: 1 } })
	]);

	return {
		stats: {
			totalObservations: totalObs,
			totalSpecies: uniqueBirdIds.length,
			firstSighting: (earliest?.date as string) ?? null
		}
	};
};
