<script>
  import { run } from '$lib/mongo_connection.js';
</script>


<h1 class="text-3xl font-bold underline">Hello world!</h1>

<button action={ run } class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Click me</button>

<style lang="postcss">
  @reference "tailwindcss";

  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>
