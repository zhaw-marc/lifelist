import { observations, species } from '$lib/db/mongo';
import { birds as staticBirds } from '$lib/data/birds';
import { error, fail, redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { Actions, PageServerLoad } from './$types';

async function fetchWikiSummary(latinName: string) {
	const title = latinName.replaceAll(' ', '_');
	try {
		const res = await fetch(
			`https://de.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
			{
				headers: { 'User-Agent': 'LifeList/1.0 (bird journal app)' },
				signal: AbortSignal.timeout(5000)
			}
		);
		if (!res.ok) return null;
		const data = await res.json();
		return {
			description: (data.description as string) ?? null,
			extract: (data.extract as string) ?? null
		};
	} catch {
		return null;
	}
}

export const load: PageServerLoad = async ({ params, locals }) => {
	let oid: ObjectId;
	try {
		oid = new ObjectId(params.id);
	} catch {
		throw error(404, 'Beobachtung nicht gefunden');
	}

	const userId = new ObjectId(locals.user!.id);
	const obs = await observations.findOne({ _id: oid, userId });
	if (!obs) throw error(404, 'Beobachtung nicht gefunden');

	const fromDb = await species.findOne({ speciesCode: obs.birdId as string });
	const fromStatic = staticBirds.find((b) => b.id === (obs.birdId as string));

	const speciesInfo = fromDb
		? {
				name: fromDb.name as string,
				latinName: fromDb.latinName as string,
				image: (fromDb.image as string) ?? null,
				order: (fromDb.order as string) ?? null,
				familyComName: (fromDb.familyComName as string) ?? null,
				familySciName: (fromDb.familySciName as string) ?? null
			}
		: fromStatic
			? {
					name: fromStatic.name,
					latinName: fromStatic.latinName,
					image: fromStatic.image ?? null,
					order: null,
					familyComName: null,
					familySciName: null
				}
			: null;

	const wiki = speciesInfo ? await fetchWikiSummary(speciesInfo.latinName) : null;

	return {
		entry: {
			id: obs._id.toString(),
			birdId: obs.birdId as string,
			date: obs.date as string,
			time: obs.time as string,
			notes: (obs.notes as string) ?? '',
			location: (obs.location as { lat: number; lng: number } | null) ?? null,
			species: speciesInfo
		},
		wiki
	};
};

export const actions: Actions = {
	update: async ({ params, request, locals }) => {
		let oid: ObjectId;
		try {
			oid = new ObjectId(params.id);
		} catch {
			return fail(400, { error: 'Ungültige ID.' });
		}

		const userId = new ObjectId(locals.user!.id);
		const data = await request.formData();
		const date = data.get('date') as string;
		const time = data.get('time') as string;
		const notes = (data.get('notes') as string) ?? '';
		const lat = parseFloat(data.get('lat') as string);
		const lng = parseFloat(data.get('lng') as string);

		if (!date || !time) {
			return fail(400, { error: 'Datum und Zeit sind Pflichtfelder.' });
		}

		await observations.updateOne(
			{ _id: oid, userId },
			{ $set: { date, time, notes, ...(isNaN(lat) || isNaN(lng) ? {} : { location: { lat, lng } }) } }
		);

		return { success: true };
	},

	delete: async ({ params, locals }) => {
		let oid: ObjectId;
		try {
			oid = new ObjectId(params.id);
		} catch {
			return fail(400, { error: 'Ungültige ID.' });
		}

		const userId = new ObjectId(locals.user!.id);
		await observations.deleteOne({ _id: oid, userId });
		throw redirect(303, '/lifelist');
	}
};
