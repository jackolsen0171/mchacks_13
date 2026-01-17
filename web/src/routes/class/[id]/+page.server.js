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

  return {
    course: {
      id: course._id.toString(),
      courseCode: course.courseCode,
      courseName: course.courseName
    }
  };
}
