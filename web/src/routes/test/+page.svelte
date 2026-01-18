<script>
  let { form } = $props();
</script>

<form method="POST" action="?/getPoem">
    <input type="text" name="topic" placeholder="Enter a topic" />
    <button type="submit">Get poem</button>
</form>

{#if form?.poem}
  <pre>{form.poem}</pre>
{/if}
