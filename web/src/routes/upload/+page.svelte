<script>
  import { enhance } from "$app/forms";

  let { data } = $props();
  let selectedFileName = $state(null);
  let isSubmitting = $state(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    selectedFileName = file ? file.name : null;
  };
</script>

<section class="upload-page">
  <header class="hero">
    <div class="hero-text">
      <p class="eyebrow">Upload</p>
      <h1>Bring your materials to life</h1>
      <p class="subtitle">
        Drop lecture slides, notes, or readings. We will keep everything tied to
        the right course so your study sessions stay sharp.
      </p>
    </div>
    <div class="hero-card">
      <p class="hero-label">Tips</p>
      <ul>
        <li>PDF, DOCX, PPT, or images.</li>
        <li>Keep files under 25 MB.</li>
        <li>Upload by course for cleaner topics.</li>
      </ul>
    </div>
  </header>

  <div class="upload-grid">
    <form
      class="card upload-form"
      method="POST"
      action="?/addFile"
      enctype="multipart/form-data"
      use:enhance={() => {
        isSubmitting = true;
        return async ({ result, update }) => {
          isSubmitting = false;
          if (result?.type === "success") {
            selectedFileName = null;
            if (update) await update();
          }
        };
      }}
    >
      {#if isSubmitting}
        <div class="loading-overlay">
          <div class="spinner"></div>
          <p class="loading-text">Uploading file...</p>
        </div>
      {/if}
      <div class="form-header">
        <h2>Upload materials</h2>
        <p>Select a course and add files to grow your knowledge tree.</p>
      </div>

      <div class="field">
        <label for="courseSelect">Course</label>
        <select id="courseSelect" name="courseId" required>
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

      <label class="dropzone" class:has-file={selectedFileName} for="fileInput">
        <input
          id="fileInput"
          name="content_file"
          type="file"
          required
          onchange={handleFileChange}
          disabled={isSubmitting}
        />
        <div class="dropzone-inner">
          {#if selectedFileName}
            <div class="file-selected">
              <span class="file-icon">📄</span>
              <span class="file-name">{selectedFileName}</span>
              <span class="file-ready">Ready to upload</span>
            </div>
          {:else}
            <p class="drop-title">Drag files here</p>
            <p class="drop-subtitle">
              or browse to select files from your device
            </p>
          {/if}
        </div>
      </label>

      <div class="form-actions">
        <button class="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Upload files"}
        </button>
      </div>
    </form>

    <div class="card upload-side">
      <h2>What happens next?</h2>
      <p>
        We will scan each document for key topics and turn them into
        review-ready study prompts.
      </p>
      <div class="accent-block">
        <span class="accent-title">Stay consistent</span>
        <span class="accent-body"
          >Upload after every lecture to keep the tree thriving.</span
        >
      </div>
    </div>
  </div>
</section>

<style>
  :global(:root) {
    --primary: #1f2a44;
    --background: #f8f9fb;
    --surface: #ffffff;
    --border: #e4e7ec;
    --accent-green: #2e7d6f;
    --accent-indigo: #4b5fd7;
  }

  :global(html) {
    background: radial-gradient(
        circle at top,
        rgba(75, 95, 215, 0.15),
        transparent 55%
      ),
      radial-gradient(
        circle at bottom,
        rgba(46, 125, 111, 0.12),
        transparent 60%
      ),
      var(--background);
  }

  .upload-page {
    padding: 2.5rem 1.5rem 5rem;
    color: var(--primary);
    display: grid;
    gap: 2.5rem;
    font-family: "Fraunces", "Times New Roman", serif;
  }

  .hero {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    align-items: start;
  }

  .hero-text h1 {
    font-size: clamp(2rem, 4vw, 3.1rem);
    margin: 0 0 0.75rem;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.75rem;
    color: var(--accent-indigo);
    margin-bottom: 0.6rem;
  }

  .subtitle {
    margin: 0;
    color: #52607a;
    max-width: 34rem;
  }

  .hero-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 20px 40px rgba(31, 42, 68, 0.08);
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  .hero-card ul {
    margin: 0.75rem 0 0;
    padding-left: 1rem;
    color: #52607a;
  }

  .hero-label {
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.7rem;
    color: var(--accent-green);
  }

  .upload-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1.75rem;
    padding: 2rem;
    box-shadow: 0 18px 36px rgba(31, 42, 68, 0.08);
  }

  .upload-form h2 {
    margin: 0;
  }

  .upload-form p {
    margin: 0.5rem 0 1.5rem;
    color: #52607a;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  .field {
    display: grid;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  label {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #5a6780;
  }

  select {
    border: 1px solid var(--border);
    border-radius: 0.9rem;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    background: #fdfdff;
    color: var(--primary);
  }

  .dropzone {
    display: block;
    border-radius: 1.4rem;
    border: 1px dashed rgba(75, 95, 215, 0.4);
    background: linear-gradient(
      145deg,
      rgba(75, 95, 215, 0.08),
      rgba(46, 125, 111, 0.08)
    );
    padding: 2rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  .dropzone input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .dropzone-inner {
    text-align: center;
  }

  .drop-title {
    font-weight: 700;
    margin: 0 0 0.3rem;
    color: var(--primary);
  }

  .drop-subtitle {
    margin: 0;
    color: #52607a;
  }

  .form-actions {
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-end;
  }

  .primary-button {
    border-radius: 999px;
    padding: 0.8rem 1.8rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    background: var(--accent-indigo);
    color: #fff;
    box-shadow: 0 14px 30px rgba(75, 95, 215, 0.3);
    transition: opacity 0.2s ease;
  }

  .primary-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Loading Overlay */
  .upload-form {
    position: relative;
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.92);
    border-radius: 1.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    z-index: 10;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(75, 95, 215, 0.15);
    border-top-color: var(--accent-indigo);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    margin: 0;
    font-size: 0.95rem;
    color: var(--primary);
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
    font-weight: 600;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* File Selected State */
  .dropzone.has-file {
    border-color: var(--accent-green);
    border-style: solid;
    background: rgba(46, 125, 111, 0.08);
  }

  .file-selected {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .file-icon {
    font-size: 2rem;
  }

  .file-name {
    font-weight: 700;
    color: var(--primary);
    word-break: break-all;
    text-align: center;
  }

  .file-ready {
    font-size: 0.85rem;
    color: var(--accent-green);
    font-weight: 600;
  }

  .upload-side h2 {
    margin-top: 0;
  }

  .upload-side p {
    color: #52607a;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  .accent-block {
    margin-top: 2rem;
    padding: 1.2rem;
    border-radius: 1.2rem;
    background: rgba(46, 125, 111, 0.08);
    display: grid;
    gap: 0.4rem;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  .accent-title {
    font-weight: 700;
    color: var(--accent-green);
  }

  .accent-body {
    color: #52607a;
  }

  @media (max-width: 720px) {
    .upload-page {
      padding: 2rem 1rem 4rem;
    }

    .card {
      padding: 1.5rem;
    }

    .form-actions {
      justify-content: stretch;
    }

    .primary-button {
      width: 100%;
    }
  }
</style>
