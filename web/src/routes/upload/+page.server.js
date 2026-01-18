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
    // this action will 
    // [1] Save file to chosen course 
    // [2] Attach a topic to the file 
    // [3] Generate reels for the file 
    const data = await request.formData();
    const courseId = data.get('courseId');
    const file = data.get('file');
    const fileName = file?.name;

    const topics = database.collection("files").find({ courseId: courseId }).toArray();
    const topicsList = topics.map(topic => topic.topic);
    const topicsListString = topicsList.join(',');

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


      // Call fumloop workflow
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GUMLOOP_API_KEY}`,
        },
        body: JSON.stringify({
          // Pass extracted text so the pipeline works on readable content.
          syllabus_file: syllabusText
          topics_list: topics
        })
      };

      let data;

      await fetch(
        "https://api.gumloop.com/api/v1/start_pipeline?user_id=GcvRdFXs4KVlwHemZ1O2oty8kTV2&saved_item_id=ehhkbi9B71naRmrkr9Fpcw",
        options,
      )
        .then((response) => response.json())
        .then((response) => data = response)
        .catch((err) => console.error(err));

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const url = `https://api.gumloop.com/api/v1/get_pl_run?run_id=${data.run_id}&user_id=${import.meta.env.VITE_GUMLOOP_USERID}`;
      const headers = {
        Authorization: `Bearer ${import.meta.env.VITE_GUMLOOP_API_KEY}`,
      };

      let result;
      let isDone = false;
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const response = await fetch(url, {
          method: 'GET',
          headers: headers,
        });
        result = await response.json();
        isDone =
          result?.state === 'DONE' ||
          result?.status === 'completed' ||
          result?.status === 'succeeded';
        if (isDone) {
          break;
        }
        await sleep(1000);
      }

      const topics = isDone
        ? (result?.outputs?.key_topics ??
          result?.output?.key_topics ??
          result?.result?.key_topics ??
          result?.data?.output?.key_topics ??
          [])
        : [];

      // Output topics to console
      console.log("Topics: ", topics);

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
