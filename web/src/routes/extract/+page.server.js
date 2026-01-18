/** @type {import('./$types').PageLoad} */

export const prerender = false;

import { PDFParse } from "pdf-parse";

export async function load({ params }) {
    // const options = {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${import.meta.env.VITE_GUMLOOP_API_KEY}`,
    //     },
    //     body: JSON.stringify({})
    // };

    // let data;

    // await fetch(
    //     "https://api.gumloop.com/api/v1/start_pipeline?user_id=GcvRdFXs4KVlwHemZ1O2oty8kTV2&saved_item_id=tmCNrAWPUCmWNf5T1fWm5C",
    //     options,
    // )
    //     .then((response) => response.json())
    //     .then((response) => data = response)
    //     .catch((err) => console.error(err));

    // setTimeout(() => {

    //     const url = `https://api.gumloop.com/api/v1/get_pl_run?run_id=${data.run_id}&user_id=${import.meta.env.VITE_GUMLOOP_USERID}`;
    //     const headers = {
    //         Authorization: `Bearer ${import.meta.env.VITE_GUMLOOP_API_KEY}`,
    //     };

    //     fetch(url, {
    //         method: 'GET',
    //         headers: headers,
    //     })
    //         .then((response) => response.json())
    //         .then((data) => console.log(data));

    // }, 10000);
}

export const actions = {
    extractSyllabus: async ({ request }) => {
        console.log("Extracting syllabus...");
        const form_data = await request.formData();
        const syllabus = form_data.get('syllabus');

        console.log(syllabus);
        if (!(syllabus instanceof File) || syllabus.size === 0) {
            return {
                success: false,
                error: "No syllabus file uploaded."
            };
        }
        // Convert file to base64 or text
        //  const fileContent = await syllabusFile.text(); // For text files
        // OR for binary files (PDF, etc.):
        const arrayBuffer = await syllabus.arrayBuffer();
        const parser = new PDFParse({ data: new Uint8Array(arrayBuffer) });
        const pdfData = await parser.getText();
        const syllabusText = (pdfData?.text ?? "").trim();

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

        console.log("Done extracting topics...(hopefully)");

        return {
            success: true,
            data: data,
            state: result?.state ?? result?.status,
            topics
        }
    }
}
