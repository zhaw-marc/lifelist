import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { users, sessions } from '$lib/db/mongo';

export async function createUser(username: string, password: string) {
	const existing = await users.findOne({ username });
	if (existing) throw new Error('Benutzername bereits vergeben.');
	const passwordHash = await bcrypt.hash(password, 12);
	const result = await users.insertOne({ username, passwordHash, createdAt: new Date() });
	return result.insertedId.toString();
}

export async function getUserByCredentials(username: string, password: string) {
	const user = await users.findOne({ username });
	if (!user) return null;
	const valid = await bcrypt.compare(password, user.passwordHash as string);
	if (!valid) return null;
	return { id: user._id.toString(), username: user.username as string };
}

export async function createSession(userId: string) {
	const token = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
	await sessions.insertOne({ _id: token as unknown as ObjectId, userId: new ObjectId(userId), expiresAt });
	return token;
}

export async function getSessionUser(token: string) {
	const session = await sessions.findOne({
		_id: token as unknown as ObjectId,
		expiresAt: { $gt: new Date() }
	});
	if (!session) return null;
	const user = await users.findOne({ _id: session.userId as ObjectId });
	if (!user) return null;
	return { id: user._id.toString(), username: user.username as string };
}

export async function deleteSession(token: string) {
	await sessions.deleteOne({ _id: token as unknown as ObjectId });
}
