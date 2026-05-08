import { observations, species } from '$lib/db/mongo';
import { birds as staticBirds } from '$lib/data/birds';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const obs = await observations.find({}).sort({ date: -1, time: -1 }).toArray();

	const birdIds = [...new Set(obs.map((o) => o.birdId as string))];
	const speciesList = await species.find({ speciesCode: { $in: birdIds } }).toArray();
	const speciesMap = Object.fromEntries(speciesList.map((s) => [s.speciesCode, s]));
	const staticMap = Object.fromEntries(staticBirds.map((b) => [b.id, b]));

	const header = ['Datum', 'Zeit', 'Artname', 'Wissenschaftlicher Name', 'Breitengrad', 'Längengrad', 'Notizen'];
	const rows = [header];

	for (const o of obs) {
		const fromDb = speciesMap[o.birdId as string];
		const fromStatic = staticMap[o.birdId as string];
		const name = fromDb?.name ?? fromStatic?.name ?? (o.birdId as string);
		const latinName = fromDb?.latinName ?? fromStatic?.latinName ?? '';
		const lat = (o.location as { lat: number; lng: number } | null)?.lat ?? '';
		const lng = (o.location as { lat: number; lng: number } | null)?.lng ?? '';
		rows.push([
			o.date as string,
			o.time as string,
			name,
			latinName,
			String(lat),
			String(lng),
			(o.notes as string) ?? ''
		]);
	}

	const csv = rows
		.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
		.join('\n');

	return new Response('﻿' + csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename="lifelist.csv"'
		}
	});
};
