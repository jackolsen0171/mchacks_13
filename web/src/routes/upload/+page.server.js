import { client } from '$lib/mongo_cert.js';
import { ObjectId } from 'mongodb';

export const prerender = false;

/** @type {import('./$types').PageLoad} */

export async function load({ params }) {
  await client.connect();
  const database = client.db("brainrejuvenate");
  const collection = database.collection("courses");

  // Fetching courses
  const courses = await collection.find({}).toArray();

  const coursesData = courses.map(course => ({
    id: course._id.toString(),
    courseCode: course.courseCode,
    courseName: course.courseName,
    createdAt: course.createdAt.toISOString()
  }))

  database.runCursorCommand({ ping: 1 });
  return {
    success: true,
    courses: coursesData
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  addFile: async ({ request }) => {
    const data = await request.formData();
    const courseId = data.get('courseId');
    const file = data.get('file');
    const fileName = file?.name;

    if (!courseId || !file) {
      return { success: false, error: 'Missing fields' };
    }

    try {
      // Find relevant course ID
      const database = client.db("brainrejuvenate");
      const courseCollection = database.collection("courses");
      const courseDoc = await courseCollection.findOne({
        _id: new ObjectId(courseId)
      });
      if (!courseDoc) {
        return { success: false, error: 'Course not found' };
      }

      // Insert file into files collection
      const fileCollection = database.collection("files");

      const fileDoc = {
        courseId: courseDoc._id,
        fileName: fileName,
        fileData: Buffer.from(await file.arrayBuffer()),
        createdAt: new Date()
      };

      const result = await fileCollection.insertOne(fileDoc);

      return {
        success: true,
        message: 'File added successfully',
        id: result.insertedId?.toString()
      };

    } catch (error) {
      return {
        success: false,
        error: 'Failed to add file: ' + error.message
      }
    }
  }
};
