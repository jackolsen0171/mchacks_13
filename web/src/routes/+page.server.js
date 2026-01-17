import { run } from '$lib/mongo_cert.js';

/** @type {import('./$types').PageLoad} */

export async function load({ params }) {
    const numberOfDocs = await run();
	return {
        numberOfDocs
	};
}