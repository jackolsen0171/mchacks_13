<script>
  import client from "react-dom/client";

  let { data } = $props();
</script>

<h1 class="text-3xl font-bold underline">Hello world!</h1>

{#if data.success == true}
  <p>MongoDB Connection successful!</p>
{:else}
  <p>MongoDB Connection failed.</p>
{/if}

<button
  onclick={() => console.log(data)}
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >Click me</button
>

<button onClick={() => addCourse()}>Add Course</button>

<style lang="postcss">
  @reference "tailwindcss";

  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>
