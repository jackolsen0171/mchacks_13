<script>
  import { enhance } from "$app/forms";

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

<!-- Add Course Modal -->
{#if addCourseModalOpen === true}
  <form
    method="POST"
    action="?/addCourse"
    use:enhance={() =>
      ({ result }) => {
        console.log("form result", result);
        if (result?.type === "success") {
          addCourseModalOpen = false;
        }
      }}
  >
    <input style="border: 1px solid black;" name="courseCode" />
    <input style="border: 1px solid black;" name="courseName" />
    <button type="submit">Add</button>
  </form>
{/if}

<!-- Courses List -->

{#if data.courses && data.courses.length > 0}
  <ul>
    {#each data.courses as course}
      <li>{course.courseCode}</li>
      <li>{course.courseName}</li>
    {/each}
  </ul>
{/if}

<style lang="postcss">
  @reference "tailwindcss";

  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>
