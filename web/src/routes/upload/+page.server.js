import { client } from '$lib/mongo_cert.js';
import { ObjectId } from 'mongodb';
import { PDFParse } from 'pdf-parse';

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
    console.log("upload/addFile: start");
    let courseId;
    let content_file;
    let fileName;
    try {
      const data = await request.formData();
      courseId = data.get('courseId');
      content_file = data.get('content_file');
      fileName = content_file?.name;
      console.log("upload/addFile: parsed form data", {
        hasCourseId: Boolean(courseId),
        hasFile: Boolean(content_file),
        fileName: fileName
      });
    } catch (error) {
      console.log("upload/addFile: form data error", error);
      return { success: false, error: 'Invalid form data' };
    }

    if (!courseId || !content_file) {
      console.log("upload/addFile: missing fields", {
        courseId,
        hasFile: Boolean(content_file)
      });
      return { success: false, error: 'Missing fields' };
    }

    try {
      await client.connect();
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
        fileData: Buffer.from(await content_file.arrayBuffer()),
        createdAt: new Date()
      };

      const file_result = await fileCollection.insertOne(fileDoc);
      console.log("File added successfully: ", file_result.insertedId?.toString());

      const course_topics = courseDoc.topics;

      console.log("course_topics: ", course_topics);

      // Call gumloop workflow
      // Extract text from pdf 
      const arrayBuffer = await content_file.arrayBuffer();
      const parser = new PDFParse({ data: new Uint8Array(arrayBuffer) });
      const pdfData = await parser.getText();
      const content_file_text = (pdfData?.text ?? "").trim();

      console.log("Generating reels...");

      try {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GUMLOOP_API_KEY}`,
          },
          body: JSON.stringify({
            // Pass extracted text so the pipeline works on readable content.
            content_file: content_file_text,
            topics_list: course_topics
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

        // Poll for up to 60 seconds (first-time processing can take longer)
        for (let attempt = 0; attempt < 60; attempt += 1) {
          const response = await fetch(url, {
            method: 'GET',
            headers: headers,
          });
          result = await response.json();

          // Only consider done when state is complete AND outputs exist
          const stateComplete =
            result?.state === 'DONE' ||
            result?.status === 'completed' ||
            result?.status === 'succeeded';
          const hasOutputs =
            result?.outputs?.title &&
            result?.outputs?.topic;

          isDone = stateComplete && hasOutputs;

          if (isDone) {
            console.log("Reel generation complete, outputs received");
            break;
          }

          if (attempt % 10 === 0) {
            console.log(`Waiting for reel generation... attempt ${attempt + 1}/60`);
          }
          await sleep(1000);
        }

        if (isDone) {
          const titles = result.outputs.title;
          const topics = result.outputs.topic;
          const theory_reels = result.outputs.theory_reel;
          const test_reels = result.outputs.test_reel;

          const reelsCollection = database.collection("reels");

          for (let i = 0; i < topics.length; i++) {
            let reelDoc = {
              courseId: courseDoc._id,
              courseName: courseDoc.courseName,
              fileId: file_result.insertedId,
              title: titles[i],
              topic: topics[i],
              theory_reel: theory_reels[i],
              test_reel: test_reels[i],
              level: 0,
              createdAt: new Date()
            }
            const reels_result = await reelsCollection.insertOne(reelDoc);
            console.log("Reel added successfully: ", reels_result.insertedId?.toString());
          }
        } else {
          console.log("Reel generation timed out or failed - outputs not received");
        }

        // Output topics to console
        // console.log("reels: ", reels);
      } catch (error) {
        console.error("Error generating reels: ", error);
      }





      return {
        success: true,
        message: 'File added successfully',
        id: file_result.insertedId?.toString()
      };

    } catch (error) {
      return {
        success: false,
        error: 'Failed to add file: ' + error.message
      }
    }
  }
};
