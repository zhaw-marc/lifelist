import { MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

const uri = env.MONGODB_URI || 'mongodb://localhost:27017/lifelist';
const client = new MongoClient(uri);

export async function connect() {
	await client.connect();
	return client.db();
}

export const db = client.db();
export const observations = db.collection('observations');
