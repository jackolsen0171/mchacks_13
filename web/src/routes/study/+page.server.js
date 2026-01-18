import { ObjectId } from 'mongodb';
import { client } from '$lib/mongo_cert.js';

export const prerender = false;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    await client.connect();
    const database = client.db('brainrejuvenate');
    const collection = database.collection('reels');

    const reels = await collection.find({}).sort({ createdAt: -1 }).toArray();

    const reelsData = reels.map((reel) => ({
        id: reel._id.toString(),
        courseId: reel.courseId?.toString(),
        fileId: reel.fileId?.toString(),
        title: reel.title ?? 'Untitled reel',
        topic: reel.topic ?? 'Study topic',
        theory_reel: reel.theory_reel ?? '',
        test_reel: reel.test_reel ?? '',
        level: typeof reel.level === 'number' ? reel.level : 0,
        createdAt: reel.createdAt ? reel.createdAt.toISOString() : null
    }));

    return {
        success: true,
        reels: reelsData
    };
}

/** @type {import('./$types').Actions} */
export const actions = {
    markSeen: async ({ request }) => {
        const formData = await request.formData();
        const reelId = formData.get('reelId');

        if (!reelId || typeof reelId !== 'string') {
            return { success: false, error: 'Missing reel id' };
        }

        let objectId;
        try {
            objectId = new ObjectId(reelId);
        } catch {
            return { success: false, error: 'Invalid reel id' };
        }

        await client.connect();
        const database = client.db('brainrejuvenate');
        const collection = database.collection('reels');

        await collection.updateOne({ _id: objectId }, { $inc: { level: 1 } });

        return { success: true };
    }
};
