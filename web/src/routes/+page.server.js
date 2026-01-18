import { client } from '$lib/mongo_cert.js';
import { PDFParse } from "pdf-parse";

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

    return {
        courses: coursesData
    };
}

/** @type {import('./$types').Actions} */
export const actions = {
    addCourse: async ({ request }) => {
        // This action will 
        // [1] add a coure to the database 
        // [2] Extract the topics from the syllabus 
        // [3] Save the text of the pdf to the database 
        // [4] save the topics to the database 
        const form_data = await request.formData();
        const courseCode = form_data.get('courseCode');
        const courseName = form_data.get('courseName');
        const courseSyllabus = form_data.get('courseSyllabus');

        if (!courseCode || !courseName) {
            return { success: false, error: 'Missing fields' };
        }

        try {
            // Get database and collection
            const database = client.db("brainrejuvenate");
            const collection = database.collection("courses");

            // Insert course
            const syllabusData = Buffer.from(await courseSyllabus.arrayBuffer());
            const add_course_result = await collection.insertOne({
                courseCode: courseCode,
                courseName: courseName,
                courseSyllabus: syllabusData,
                createdAt: new Date()
            })

            console.log("Course added successfully");

            // Begin extracting topics from the syllabus 
            console.log("Extracting topics from the syllabus...");



            // Extract text from pdf 
            const arrayBuffer = await syllabus.arrayBuffer();
            const parser = new PDFParse({ data: new Uint8Array(arrayBuffer) });
            const pdfData = await parser.getText();
            const syllabusText = (pdfData?.text ?? "").trim();


            // Extract topics from the file 

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_GUMLOOP_API_KEY}`,
                },
                body: JSON.stringify({
                    // Pass extracted text so the pipeline works on readable content.
                    syllabus_file: syllabusText
                })
            };

            let data;

            await fetch(
                "https://api.gumloop.com/api/v1/start_pipeline?user_id=GcvRdFXs4KVlwHemZ1O2oty8kTV2&saved_item_id=iuT4BcigkCUN8sNQ6H8U9i",
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
                ? (result?.outputs?.output ??
                    result?.output ??
                    result?.result ??
                    result?.data?.output ??
                    JSON.stringify(result, null, 2))
                : null;


            // Output topics to console 
            console.log("Topics: ", topics);

            // Save text to the database 
            const fileCollection = database.collection("files");
            const fileDoc = {
                courseId: courseId,
                fileName: fileName,
                fileData: syllabusText,
                topics: topics
            }
            const add_topics_result = await fileCollection.insertOne(fileDoc);

            return {
                success: true,
                message: 'Course added successfully & topics saved successfully',
                id: add_course_result.insertedId?.toString()
            };

        } catch (error) {
            return {
                success: false,
                error: 'Failed to add course: ' + error.message
            }
        }
    }
};
