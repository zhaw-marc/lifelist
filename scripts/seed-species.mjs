import { MongoClient } from 'mongodb';

const EBIRD_API_KEY = process.env.EBIRD_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'lifelist';

if (!EBIRD_API_KEY) throw new Error('EBIRD_API_KEY is not set');
if (!MONGODB_URI) throw new Error('MONGODB_URI is not set');

const EBIRD_HEADERS = { 'X-eBirdApiToken': EBIRD_API_KEY };

async function fetchJson(url) {
	const res = await fetch(url, { headers: EBIRD_HEADERS });
	if (!res.ok) throw new Error(`eBird API error ${res.status}: ${url}`);
	return res.json();
}

async function main() {
	console.log('Fetching Swiss species list from eBird...');
	const swissCodes = new Set(await fetchJson('https://api.ebird.org/v2/product/spplist/CH'));
	console.log(`  Found ${swissCodes.size} species codes for Switzerland`);

	console.log('Fetching full eBird taxonomy (de locale)...');
	const taxonomy = await fetchJson('https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json&locale=de');
	console.log(`  Total taxonomy entries: ${taxonomy.length}`);

	const swissSpecies = taxonomy
		.filter((t) => t.category === 'species' && swissCodes.has(t.speciesCode))
		.map((t) => ({
			speciesCode: t.speciesCode,
			name: t.comName,
			latinName: t.sciName,
			order: t.order,
			familyCode: t.familyCode,
			familyComName: t.familyComName,
			familySciName: t.familySciName
		}));

	console.log(`  Matched ${swissSpecies.length} species with German names`);

	console.log(`Connecting to MongoDB (${MONGODB_DB})...`);
	const client = new MongoClient(MONGODB_URI);
	await client.connect();
	const db = client.db(MONGODB_DB);
	const col = db.collection('species');

	await col.deleteMany({});
	const result = await col.insertMany(swissSpecies);
	console.log(`Inserted ${result.insertedCount} species into 'species' collection`);

	await col.createIndex({ speciesCode: 1 }, { unique: true });
	await col.createIndex({ name: 1 });

	await client.close();
	console.log('Done.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
