import { error, redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { client } from '$lib/mongo_cert.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  await client.connect();
  const database = client.db('brainrejuvenate');
  const collection = database.collection('courses');

  let courseId;
  try {
    courseId = new ObjectId(params.id);
  } catch {
    throw error(404, 'Course not found');
  }

  const course = await collection.findOne({ _id: courseId });
  if (!course) {
    throw error(404, 'Course not found');
  }

  const filesCollection = database.collection('files');
  const files = await filesCollection.find({ courseId }).toArray();

  const filesData = files.map((file) => ({
    id: file._id.toString(),
    fileName: file.fileName ?? 'Untitled file',
    createdAt: file.createdAt ? file.createdAt.toISOString() : null,
    topic: file.topic ?? 'Unassigned',
    topics: Array.isArray(file.topics) ? file.topics : file.topic ? [file.topic] : []
  }));

  const topicSet = new Set();
  for (const file of filesData) {
    for (const topic of file.topics) {
      if (topic && typeof topic === 'string') {
        topicSet.add(topic);
      }
    }
  }

  // Handle both old format (strings) and new format (objects with progress)
  const rawTopics = course.topics ?? [];
  const topics = rawTopics.map(topic => {
    if (typeof topic === 'string') {
      // Legacy format: convert to new format
      return { name: topic, progress: 0 };
    }
    // New format: ensure it has required fields
    return {
      name: topic.name ?? 'Unknown',
      progress: typeof topic.progress === 'number' ? topic.progress : 0
    };
  });

  return {
    course: {
      id: course._id.toString(),
      courseCode: course.courseCode,
      courseName: course.courseName
    },
    files: filesData,
    topics: topics
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  deleteCourse: async ({ params }) => {
    await client.connect();
    const database = client.db('brainrejuvenate');

    let courseId;
    try {
      courseId = new ObjectId(params.id);
    } catch {
      throw error(404, 'Course not found');
    }

    await database.collection('files').deleteMany({ courseId });
    await database.collection('reels').deleteMany({ courseId });
    await database.collection('courses').deleteOne({ _id: courseId });

    throw redirect(303, '/');
  }
};
