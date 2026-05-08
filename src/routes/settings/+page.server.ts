import { observations } from '$lib/db/mongo';
import { deleteSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = new ObjectId(locals.user!.id);
	const filter = { userId };

	const [totalObs, uniqueBirdIds, earliest] = await Promise.all([
		observations.countDocuments(filter),
		observations.distinct('birdId', filter),
		observations.findOne(filter, { sort: { date: 1 }, projection: { date: 1 } })
	]);

	return {
		stats: {
			totalObservations: totalObs,
			totalSpecies: uniqueBirdIds.length,
			firstSighting: (earliest?.date as string) ?? null
		}
	};
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		const token = cookies.get('session');
		if (token) {
			await deleteSession(token);
			cookies.delete('session', { path: '/' });
		}
		throw redirect(303, '/login');
	}
};
