import { ObjectId } from 'mongodb';
import { client } from '$lib/mongo_cert.js';

export const prerender = false;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    await client.connect();
    const database = client.db('brainrejuvenate');
    const reelsCollection = database.collection('reels');
    const coursesCollection = database.collection('courses');

    const reels = await reelsCollection.find({}).sort({ createdAt: -1 }).toArray();

    // Fetch all courses to get topic progress
    const courses = await coursesCollection.find({}).toArray();
    const courseMap = new Map();
    for (const course of courses) {
        courseMap.set(course._id.toString(), course);
    }

    const reelsData = reels.map((reel) => {
        const courseId = reel.courseId?.toString();
        const course = courseId ? courseMap.get(courseId) : null;

        // Find topic progress from course
        let topicProgress = 0;
        if (course && course.topics && reel.topic) {
            const topicData = course.topics.find(t =>
                (typeof t === 'string' ? t : t.name) === reel.topic
            );
            if (topicData) {
                topicProgress = typeof topicData === 'string' ? 0 : (topicData.progress ?? 0);
            }
        }

        return {
            id: reel._id.toString(),
            courseId: courseId,
            fileId: reel.fileId?.toString(),
            title: reel.title ?? 'Untitled reel',
            topic: reel.topic ?? 'Study topic',
            topicProgress: topicProgress,
            theory_reel: reel.theory_reel ?? '',
            test_reel: reel.test_reel ?? '',
            level: typeof reel.level === 'number' ? reel.level : 0,
            answeredOption: reel.answeredOption ?? null,
            createdAt: reel.createdAt ? reel.createdAt.toISOString() : null
        };
    });

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
    },

    updateTopicProgress: async ({ request }) => {
        const formData = await request.formData();
        const courseId = formData.get('courseId');
        const topicName = formData.get('topicName');
        const increment = parseInt(formData.get('increment') ?? '10', 10);

        if (!courseId || typeof courseId !== 'string') {
            return { success: false, error: 'Missing course id' };
        }
        if (!topicName || typeof topicName !== 'string') {
            return { success: false, error: 'Missing topic name' };
        }

        let objectId;
        try {
            objectId = new ObjectId(courseId);
        } catch {
            return { success: false, error: 'Invalid course id' };
        }

        await client.connect();
        const database = client.db('brainrejuvenate');
        const coursesCollection = database.collection('courses');

        // Find the course
        const course = await coursesCollection.findOne({ _id: objectId });
        if (!course) {
            return { success: false, error: 'Course not found' };
        }

        // Update the specific topic's progress
        const topics = course.topics ?? [];
        let newProgress = 0;
        const updatedTopics = topics.map(topic => {
            const name = typeof topic === 'string' ? topic : topic.name;
            const currentProgress = typeof topic === 'string' ? 0 : (topic.progress ?? 0);

            if (name === topicName) {
                // Cap progress at 100
                newProgress = Math.min(100, currentProgress + increment);
                return { name, progress: newProgress };
            }
            return typeof topic === 'string' ? { name: topic, progress: 0 } : topic;
        });

        await coursesCollection.updateOne(
            { _id: objectId },
            { $set: { topics: updatedTopics } }
        );

        return { success: true, newProgress };
    },

    saveAnswer: async ({ request }) => {
        const formData = await request.formData();
        const reelId = formData.get('reelId');
        const answeredOption = formData.get('answeredOption');

        if (!reelId || typeof reelId !== 'string') {
            return { success: false, error: 'Missing reel id' };
        }
        if (!answeredOption || typeof answeredOption !== 'string') {
            return { success: false, error: 'Missing answer' };
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

        await collection.updateOne(
            { _id: objectId },
            { $set: { answeredOption: answeredOption } }
        );

        return { success: true };
    }
};
