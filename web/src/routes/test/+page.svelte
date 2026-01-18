<script>
    let poem = $state("");
    async function getPoem() {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_GUMLOOP_API_KEY}`,
            },
            body: JSON.stringify({}),
        };

        poem = await fetch(
            "https://api.gumloop.com/api/v1/start_pipeline?user_id=GcvRdFXs4KVlwHemZ1O2oty8kTV2&saved_item_id=tmCNrAWPUCmWNf5T1fWm5C",
            options,
        )
            .then((response) => response.json())
            .then((response) => console.log(response))
            .catch((err) => console.error(err));
    }
</script>

<button onclick={getPoem}> get poem </button>

<p>{poem.content}</p>
