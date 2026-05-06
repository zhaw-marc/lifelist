import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'lifelist';
const CONCURRENCY = 3;
const DELAY_MS = 300;

if (!MONGODB_URI) throw new Error('MONGODB_URI is not set');

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

async function downloadImage(url, retries = 4) {
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const res = await fetch(url, {
				headers: { 'User-Agent': 'LifeList/1.0 (bird journal app; educational project)' },
				signal: AbortSignal.timeout(20000)
			});

			if (res.status === 429 || res.status === 403 || res.status === 503) {
				const backoff = 4000 * 2 ** attempt;
				await sleep(backoff);
				continue;
			}
			if (!res.ok) return null;

			const buffer = Buffer.from(await res.arrayBuffer());
			const mimeType = res.headers.get('content-type')?.split(';')[0].trim() ?? 'image/jpeg';
			return { buffer, mimeType };
		} catch {
			if (attempt === retries) return null;
			await sleep(2000 * (attempt + 1));
		}
	}
	return null;
}

async function processPool(tasks, concurrency) {
	let idx = 0;
	async function worker() {
		while (idx < tasks.length) {
			await tasks[idx++]();
		}
	}
	await Promise.all(Array.from({ length: concurrency }, worker));
}

async function main() {
	const client = new MongoClient(MONGODB_URI);
	await client.connect();
	const col = client.db(MONGODB_DB).collection('species');

	const pending = await col
		.find(
			{ image: { $exists: true }, imageData: { $exists: false } },
			{ projection: { _id: 1, speciesCode: 1, image: 1 } }
		)
		.toArray();

	if (pending.length === 0) {
		console.log('All images already downloaded.');
		await client.close();
		return;
	}

	console.log(`Downloading ${pending.length} images (concurrency: ${CONCURRENCY}, delay: ${DELAY_MS}ms)...`);

	let done = 0;
	let failed = 0;

	const tasks = pending.map((doc) => async () => {
		await sleep(DELAY_MS + Math.random() * DELAY_MS);
		const result = await downloadImage(doc.image);

		if (result) {
			await col.updateOne(
				{ _id: doc._id },
				{ $set: { imageData: result.buffer, imageMimeType: result.mimeType } }
			);
			done++;
		} else {
			failed++;
		}

		const total = done + failed;
		if (total % 10 === 0 || total === pending.length) {
			process.stdout.write(`\r  ${total}/${pending.length} — ${done} ok, ${failed} failed`);
		}
	});

	await processPool(tasks, CONCURRENCY);

	console.log(`\nDone. ${done} stored, ${failed} still failed (re-run to retry).`);
	await client.close();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
