import { client } from '$lib/mongo_cert.js';

/** @type {import('./$types').PageLoad} */

export async function load({ params }) {
    await client.connect();
    const database = client.db("testDB");
    database.runCursorCommand({ ping: 1 });
	return {
        success: true
	};
}