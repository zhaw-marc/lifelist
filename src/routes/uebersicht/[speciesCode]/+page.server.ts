import { species as speciesCol } from '$lib/db/mongo';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

export const load: PageServerLoad = async ({ params }) => {
	const doc = await speciesCol.findOne({ speciesCode: params.speciesCode });
	if (!doc) throw error(404, 'Vogelart nicht gefunden');

	const wiki = await fetchWikiSummary(doc.latinName as string);

	return {
		bird: {
			speciesCode: doc.speciesCode as string,
			name: doc.name as string,
			latinName: doc.latinName as string,
			image: (doc.image as string) ?? null
		},
		wiki,
		order: (doc.order as string) ?? null,
		familyComName: (doc.familyComName as string) ?? null,
		familySciName: (doc.familySciName as string) ?? null
	};
};
