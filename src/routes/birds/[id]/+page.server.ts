import { birds } from '$lib/data/birds';
import { species as speciesCol } from '$lib/db/mongo';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

async function fetchWikiSummary(latinName: string) {
	const title = latinName.replaceAll(' ', '_');
	try {
		const res = await fetch(`https://de.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
			headers: { 'User-Agent': 'LifeList/1.0 (bird journal app)' },
			signal: AbortSignal.timeout(5000)
		});
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
	const bird = birds.find((b) => b.id === params.id);
	if (!bird) throw error(404, 'Vogel nicht gefunden');

	const [wiki, speciesDoc] = await Promise.all([
		fetchWikiSummary(bird.latinName),
		speciesCol.findOne(
			{ latinName: bird.latinName },
			{ projection: { order: 1, familyComName: 1, familySciName: 1 } }
		)
	]);

	return {
		bird,
		wiki,
		order: (speciesDoc?.order as string) ?? null,
		familyComName: (speciesDoc?.familyComName as string) ?? null,
		familySciName: (speciesDoc?.familySciName as string) ?? null
	};
};
