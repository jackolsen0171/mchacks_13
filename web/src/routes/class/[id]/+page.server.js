import { error } from '@sveltejs/kit';
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
    topic: file.topic ?? 'Unassigned'
  }));

  return {
    course: {
      id: course._id.toString(),
      courseCode: course.courseCode,
      courseName: course.courseName
    },
    files: filesData
  };
}
