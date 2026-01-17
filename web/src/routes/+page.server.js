import { client } from '$lib/mongo_cert.js';

export const prerender = false;

/** @type {import('./$types').PageLoad} */

export async function load({ params }) {
    await client.connect();
    const database = client.db("testDB");
    database.runCursorCommand({ ping: 1 });
    return {
        success: true
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

        // Add course to database 
        const database = client.db("testDB");



        return { success: true };
    }
};


