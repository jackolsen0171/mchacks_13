<script>
  import client from "react-dom/client";

  let { data, actions } = $props();
  let addCourseModalOpen = $state(false);
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

<button
  onclick={() => (addCourseModalOpen = true)}
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >Add Course</button
>

{#if addCourseModalOpen === true}
  <form method="POST" action="?/addCourse">
    <input style="border: 1px solid black;" name="courseCode" />
    <input style="border: 1px solid black;" name="courseName" />
    <button type="submit">Add</button>
  </form>
{/if}

<style lang="postcss">
  @reference "tailwindcss";

  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>
