import { client } from '$lib/mongo_cert.js';

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
    addCourse: async ({ request }) => {
        const data = await request.formData();
        const courseCode = data.get('courseCode');
        const courseName = data.get('courseName');

        if (!courseCode || !courseName) {
            return { success: false, error: 'Missing fields' };
        }

        try {
            // Get database and collection
            const database = client.db("brainrejuvenate");
            const collection = database.collection("courses");

            // Insert course 
            const result = await collection.insertOne({
                courseCode: courseCode,
                courseName: courseName,
                createdAt: new Date()
            })

            return {
                success: true,
                message: 'Course added successfully',
                id: result.insertedId?.toString()
            };

        } catch (error) {
            return {
                success: false,
                error: 'Failed to add course: ' + error.message
            }
        }
    },

    addFile: async ({ request }) => {
        const data = await request.formData();
        const courseCode = data.get('courseCode');
        const file = data.get('file');
        
        if (!courseCode || !file) {
            return { success: false, error: 'Missing fields' };
        }

        // Find relevant course ID
        await client.connect();
        const database = client.db("brainrejuvenate");
        const courseCollection = database.collection("courses");
        const courseDoc = await courseCollection.findOne({ courseCode: courseCode });
        if (!courseDoc) {
            return { success: false, error: 'Course not found' };
        }
        const courseId = courseDoc._id;

        const fileCollection = database.collection("files");

        fileDoc = {
            courseId: courseId,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileData: await file.arrayBuffer()
        }

        await fileCollection.insertOne(fileDoc);

        return { success: true };
    }
};
