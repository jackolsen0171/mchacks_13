<script>
  let { data, actions } = $props();
</script>

<section>
  <h1 class="section-title">Upload Materials</h1>
  <p class="section-subtitle">
    Add lecture slides, practice sets, or readings. We will label each file and
    adapt study sessions automatically.
  </p>

  <div class="card">
    <div class="upload-zone">
      <h2 class="upload-title">Drag and drop files here</h2>
      <p class="upload-hint">PDF, DOCX, PPT, or images. Max 25 MB per file.</p>
      <div class="upload-actions">
        <form method="POST" action="?/addFile" enctype="multipart/form-data">
          <div class="upload-field">
            <label class="upload-label" for="courseSelect">Course</label>
            <select
              class="upload-select"
              id="courseSelect"
              name="courseId"
              required
            >
              <option value="" disabled selected>Select a course</option>
              {#if data?.courses?.length}
                {#each data.courses as course}
                  <option value={course.id}>
                    {course.courseCode} · {course.courseName}
                  </option>
                {/each}
              {:else}
                <option value="" disabled>No courses available</option>
              {/if}
            </select>
          </div>
          <input
            class="upload-file"
            type="file"
            id="fileInput"
            name="file"
            multiple
            required
          />
          <button class="upload-button" type="submit">Upload</button>
        </form>
      </div>
    </div>
  </div>
</section>

<style>
  .upload-field {
    display: grid;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .upload-label {
    font-weight: 600;
    color: #0f172a;
  }

  .upload-select {
    border: 1px solid #cbd5f5;
    border-radius: 0.75rem;
    padding: 0.6rem 0.75rem;
    background: #fff;
    color: #0f172a;
  }

  .upload-file {
    border: 1px dashed #cbd5f5;
    border-radius: 0.75rem;
    padding: 0.6rem 0.75rem;
    background: #f8fafc;
  }

  .upload-button {
    border: 1px solid #cbd5f5;
    border-radius: 0.75rem;
    padding: 0.6rem 0.75rem;
    background: #f8fafc;
  }
</style>
