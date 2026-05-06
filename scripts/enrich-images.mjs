import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'lifelist';

if (!MONGODB_URI) throw new Error('MONGODB_URI is not set');

const BATCH_SIZE = 50;
const THUMB_SIZE = 500;
const DELAY_MS = 500;

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

async function fetchImagesForBatch(sciNames, retries = 4) {
	const titles = sciNames.map((n) => n.replaceAll(' ', '_')).join('|');
	const url =
		`https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1` +
		`&prop=pageimages&pithumbsize=${THUMB_SIZE}&titles=${encodeURIComponent(titles)}`;

	for (let attempt = 0; attempt <= retries; attempt++) {
		const res = await fetch(url, {
			headers: { 'User-Agent': 'LifeList-Seed/1.0 (bird sighting app; contact via github)' }
		});
		if (res.status === 429) {
			const backoff = 2000 * 2 ** attempt;
			process.stdout.write(`\n  Rate limited — waiting ${backoff / 1000}s...`);
			await sleep(backoff);
			continue;
		}
		if (!res.ok) throw new Error(`Wikipedia API error ${res.status}`);
		const data = await res.json();

		const imageMap = {};

		const redirectMap = {};
		for (const r of data.query.redirects ?? []) {
			redirectMap[r.to.replaceAll(' ', '_')] = r.from.replaceAll('_', ' ');
		}

		for (const page of Object.values(data.query.pages)) {
			if (!page.thumbnail) continue;
			const normalizedTitle = page.title.replaceAll('_', ' ');
			const originalTitle = redirectMap[page.title.replaceAll(' ', '_')] ?? normalizedTitle;
			imageMap[originalTitle] = page.thumbnail.source;
			imageMap[normalizedTitle] = page.thumbnail.source;
		}

		return imageMap;
	}
	throw new Error('Max retries exceeded');
}

async function main() {
	const client = new MongoClient(MONGODB_URI);
	await client.connect();
	const col = client.db(MONGODB_DB).collection('species');

	const allSpecies = await col
		.find({ image: { $exists: false } }, { projection: { _id: 1, latinName: 1 } })
		.toArray();
	console.log(`Enriching ${allSpecies.length} species with Wikipedia images...`);

	let found = 0;
	let missing = 0;

	for (let i = 0; i < allSpecies.length; i += BATCH_SIZE) {
		const batch = allSpecies.slice(i, i + BATCH_SIZE);
		const sciNames = batch.map((s) => s.latinName);

		let imageMap;
		try {
			imageMap = await fetchImagesForBatch(sciNames);
		} catch (err) {
			console.warn(`  Batch ${i / BATCH_SIZE + 1} failed: ${err.message} — skipping`);
			missing += batch.length;
			continue;
		}

		const ops = batch.map((s) => {
			const imageUrl = imageMap[s.latinName];
			if (imageUrl) {
				found++;
				return {
					updateOne: {
						filter: { _id: s._id },
						update: { $set: { image: imageUrl } }
					}
				};
			} else {
				missing++;
				return null;
			}
		}).filter(Boolean);

		if (ops.length > 0) await col.bulkWrite(ops);

		const progress = Math.min(i + BATCH_SIZE, allSpecies.length);
		process.stdout.write(`\r  Progress: ${progress}/${allSpecies.length} (${found} with image, ${missing} missing)`);

		if (i + BATCH_SIZE < allSpecies.length) await sleep(DELAY_MS);
	}

	console.log(`\nDone. ${found} images added, ${missing} species without image.`);
	await client.close();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
