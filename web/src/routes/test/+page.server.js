/** @type {import('./$types').PageLoad} */

export async function load({ params }) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GUMLOOP_API_KEY}`,
        },
        body: JSON.stringify({})
    };

    let data;

    await fetch(
        "https://api.gumloop.com/api/v1/start_pipeline?user_id=GcvRdFXs4KVlwHemZ1O2oty8kTV2&saved_item_id=tmCNrAWPUCmWNf5T1fWm5C",
        options,
    )
        .then((response) => response.json())
        .then((response) => data = response)
        .catch((err) => console.error(err));

    setTimeout(() => {

        const url = `https://api.gumloop.com/api/v1/get_pl_run?run_id=${data.run_id}&user_id=${import.meta.env.VITE_GUMLOOP_USERID}`;
        const headers = {
            Authorization: `Bearer ${import.meta.env.VITE_GUMLOOP_API_KEY}`,
        };

        fetch(url, {
            method: 'GET',
            headers: headers,
        })
            .then((response) => response.json())
            .then((data) => console.log(data));

    }, 10000);
}