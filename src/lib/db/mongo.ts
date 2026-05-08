import { MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

const uri = env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = env.MONGODB_DB || 'lifelist';
const client = new MongoClient(uri);

export const db = client.db(dbName);
export const observations = db.collection('observations');
export const species = db.collection('species');
export const users = db.collection('users');
export const sessions = db.collection('sessions');
