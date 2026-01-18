<script>
  import { enhance } from "$app/forms";

  let { data } = $props();
  let addCourseModalOpen = $state(false);
  let isSubmitting = $state(false);

  // Prevent body scroll when modal is open and reset scroll on close
  $effect(() => {
    if (addCourseModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  });

  const maxCourses = 6;
  const courses = $derived(data?.courses ?? []);
  const courseCount = $derived(courses.length);
  const treeHeight = $derived(Math.min(100, 20 + courseCount * 13));
  const brainScale = $derived(Math.min(1.15, 0.65 + courseCount * 0.1));
  const statusMessage = $derived(
    courseCount === 0
      ? "Your knowledge tree awaits."
      : courseCount === 1
        ? "Your tree is sprouting."
        : courseCount < 4
          ? "Your tree is growing."
          : courseCount < maxCourses
            ? "Your tree is flourishing."
            : "Your knowledge tree is complete.",
  );
</script>

<section class="dashboard">
  <header class="dashboard-header">
    <div>
      <p class="eyebrow">Dashboard</p>
      <h1>Bloomscroll</h1>
      <p class="subtitle">Watch your knowledge tree grow with each course.</p>
    </div>
    <div class="controls">
      {#if courseCount < maxCourses}
        <button
          class="primary-button"
          type="button"
          onclick={() => (addCourseModalOpen = true)}
        >
          + Add Course
        </button>
      {/if}
    </div>
  </header>

  <div class="tree-card">
    <div class="tree-stage">
      <div class="leaves" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div
        class="brain-pot"
        style={`transform: translateX(-50%) scale(${brainScale})`}
      >
        <svg
          width="200"
          height="140"
          viewBox="0 0 240 140"
          aria-hidden="true"
        >
          <g>
            <path
              d="M60 40
                 H180
                 C190 40 196 48 194 58
                 L182 108
                 C180 118 172 124 162 124
                 H78
                 C68 124 60 118 58 108
                 L46 58
                 C44 48 50 40 60 40
                 Z"
              fill="#d9b88b"
              stroke="#8a5a36"
              stroke-width="5"
            />
            <rect
              x="52"
              y="32"
              width="136"
              height="16"
              rx="8"
              fill="#caa57a"
              stroke="#8a5a36"
              stroke-width="4"
            />
            <path
              d="M72 60 C92 54 114 54 134 60"
              stroke="#8a5a36"
              stroke-width="4"
              stroke-linecap="round"
              opacity="0.6"
            />
            <path
              d="M84 74 C104 68 126 68 146 74"
              stroke="#8a5a36"
              stroke-width="4"
              stroke-linecap="round"
              opacity="0.5"
            />
          </g>
        </svg>
        {#if courseCount === 0}
          <div class="root-callout">Add a course to start growing.</div>
        {/if}
      </div>

      {#if courseCount > 0}
        <div class="tree-trunk" style={`height: ${treeHeight}%`}>
          {#each courses as course, index}
            {@const isLeft = index % 2 === 0}
            {@const branchBottom = Math.round(((index + 1) / (courseCount + 1)) * 100)}
            <div
              class="branch-group"
              class:left={isLeft}
              class:right={!isLeft}
              style={`bottom: ${branchBottom}%; animation-delay: ${index * 0.15}s;`}
            >
              <div class="tree-branch"></div>
              <a class="leaf-label" href={`/class/${course.id}`}>
                <span class="leaf-dot"></span>
                <span class="leaf-text">
                  <span class="leaf-code">{course.courseCode}</span>
                  <span class="leaf-name">{course.courseName}</span>
                </span>
              </a>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <div class="tree-footer">
      <p class="tree-status">{statusMessage}</p>
      <p class="tree-count">Courses added: {courseCount}/{maxCourses}</p>
    </div>
  </div>
</section>

{#if addCourseModalOpen && courseCount < maxCourses}
  <div class="modal-backdrop" onclick={() => (addCourseModalOpen = false)} role="button" tabindex="-1" onkeydown={(e) => e.key === 'Escape' && (addCourseModalOpen = false)}></div>
  <div class="modal-container">
    <form
      class="course-form modal-form"
      method="POST"
      action="?/addCourse"
      enctype="multipart/form-data"
      use:enhance={() => {
        isSubmitting = true;
        return async ({ result, update }) => {
          isSubmitting = false;
          if (result?.type === "success") {
            if (update) {
              await update();
            }
            addCourseModalOpen = false;
          }
        };
      }}
    >
      {#if isSubmitting}
        <div class="loading-overlay">
          <div class="spinner"></div>
          <p class="loading-text">Adding course...</p>
        </div>
      {/if}
      <h2 class="form-title">Add New Course</h2>
      <div class="field">
        <label for="courseCode">Course Code</label>
        <input
          id="courseCode"
          name="courseCode"
          placeholder="MATH 242"
          required
          disabled={isSubmitting}
        />
      </div>
      <div class="field">
        <label for="courseName">Course Name</label>
        <input
          id="courseName"
          name="courseName"
          placeholder="Calculus II"
          required
          disabled={isSubmitting}
        />
      </div>
      <div class="field">
        <label for="courseSyllabus">Course Syllabus</label>
        <input
          id="courseSyllabus"
          name="courseSyllabus"
          type="file"
          accept=".pdf"
          required
          disabled={isSubmitting}
        />
      </div>
      <div class="form-actions">
        <button
          class="secondary-button"
          type="button"
          onclick={() => (addCourseModalOpen = false)}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button class="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  </div>
{/if}

<style>
  :global(:root) {
    --primary: #492828;
    --background: #efe9e3;
    --surface: #efe9e3;
    --border: #492828;
    --accent-green: #84934a;
    --accent-indigo: #656d3f;
  }

  :global(html) {
    background-color: var(--background);
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  :global(body) {
    touch-action: manipulation; /* Prevents double-tap zoom */
  }

  .dashboard {
    padding: 2.5rem 1.5rem 5rem;
    color: var(--primary);
    display: grid;
    gap: 2.5rem;
    min-height: 100dvh;
    font-family: "Fraunces", "Times New Roman", serif;
  }

  .dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.75rem;
    color: #656d3f;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: clamp(2rem, 4vw, 3.25rem);
    margin: 0 0 0.5rem;
  }

  .subtitle {
    margin: 0;
    color: rgba(73, 40, 40, 0.75);
    max-width: 32rem;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  .controls {
    display: flex;
    gap: 1rem;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  .primary-button,
  .secondary-button {
    border-radius: 999px;
    padding: 0.7rem 1.6rem;
    font-weight: 600;
    border: 1px solid transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .primary-button {
    background: #84934a;
    color: #efe9e3;
    box-shadow: 0 12px 24px rgba(132, 147, 74, 0.25);
  }

  .primary-button:active,
  .primary-button:focus,
  .primary-button:focus-visible {
    background: #84934a;
    color: #efe9e3;
  }

  .secondary-button {
    background: var(--accent-indigo);
    border-color: var(--border);
    color: #efe9e3;
  }

  .course-form {
    display: grid;
    gap: 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1.5rem;
    padding: 1.5rem;
    max-width: 32rem;
    box-shadow: 0 20px 40px rgba(31, 42, 68, 0.08);
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
    box-sizing: border-box;
    overflow: hidden;
  }

  .field {
    display: grid;
    gap: 0.4rem;
    min-width: 0;
  }

  label {
    font-size: 0.85rem;
    color: rgba(73, 40, 40, 0.75);
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  input {
    border: 1px solid var(--border);
    border-radius: 0.9rem;
    padding: 0.75rem 1rem;
    font-size: 16px; /* Prevents iOS zoom on focus */
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
    width: 100%;
    box-sizing: border-box;
    background: var(--background);
    -webkit-appearance: none; /* Removes iOS default styling */
    appearance: none;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  /* Modal Overlay Styles */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(73, 40, 40, 0.4);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 100;
    animation: fadeIn 0.2s ease;
    cursor: pointer;
  }

  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 101;
    padding: 1.5rem;
    pointer-events: none;
    overflow-y: auto;
  }

  .modal-form {
    pointer-events: auto;
    animation: slideUp 0.3s ease;
    max-width: 28rem;
    width: calc(100% - 2rem);
    box-shadow: 0 25px 50px rgba(73, 40, 40, 0.25);
    margin: auto;
    position: relative;
  }

  .form-title {
    font-size: 1.5rem;
    margin: 0 0 1.25rem;
    font-family: "Fraunces", "Times New Roman", serif;
    color: var(--primary);
  }

  /* Loading Overlay */
  .loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(239, 233, 227, 0.92);
    border-radius: 1.5rem;
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
    border: 3px solid rgba(73, 40, 40, 0.15);
    border-top-color: var(--accent-green);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    margin: 0;
    font-size: 0.95rem;
    color: var(--primary);
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
    font-weight: 500;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  input:disabled,
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .tree-card {
    /* background: linear-gradient(
      180deg,
      rgba(46, 125, 111, 0.08),
      rgba(75, 95, 215, 0.08)
    ); */
    border-radius: 2rem;
    padding: 2.5rem 2rem;
    min-height: 28rem;
    position: relative;
    overflow: visible;
    margin-top: auto;
    margin-bottom: 3rem;
    max-width: 720px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .tree-stage {
    position: relative;
    height: 26rem;
    overflow: visible;
    --branch-length: 120px;
    --leaf-offset: 20px;
  }

  .tree-trunk {
    position: absolute;
    bottom: 4rem;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    background: linear-gradient(180deg, #b07a4a, #7a4f2c);
    border-radius: 8px 8px 0 0;
    transition: height 0.8s ease;
    box-shadow: inset -6px 0 10px rgba(0, 0, 0, 0.2);
    z-index: 5;
  }

  /* Branch and Label System */
  .branch-group {
    position: absolute;
    display: flex;
    align-items: center;
    animation: branchFadeIn 0.5s ease both;
  }

  .branch-group.left {
    right: 50%;
    flex-direction: row-reverse;
    padding-right: 16px;
  }

  .branch-group.right {
    left: 50%;
    flex-direction: row;
    padding-left: 16px;
  }

  .tree-branch {
    width: var(--branch-length);
    height: 10px;
    background: linear-gradient(90deg, #7a4f2c, #8b5b30);
    border-radius: 999px;
    flex-shrink: 0;
  }

  .branch-group.left .tree-branch {
    background: linear-gradient(90deg, #8b5b30, #7a4f2c);
    transform: rotate(-6deg);
  }

  .branch-group.right .tree-branch {
    transform: rotate(6deg);
  }

  .leaf-label {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem 0.9rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(73, 40, 40, 0.1);
    text-decoration: none;
    color: var(--primary);
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(73, 40, 40, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .leaf-label:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(73, 40, 40, 0.12);
  }

  .leaf-label:active {
    transform: scale(0.98);
  }

  .branch-group.left .leaf-label {
    margin-right: 0.5rem;
  }

  .branch-group.right .leaf-label {
    margin-left: 0.5rem;
  }

  .leaf-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent-green);
    flex-shrink: 0;
  }

  .leaf-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    gap: 1px;
  }

  .leaf-code {
    font-weight: 700;
    font-size: 0.9rem;
  }

  .leaf-name {
    font-weight: 500;
    font-size: 0.75rem;
    color: rgba(73, 40, 40, 0.65);
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @keyframes branchFadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .brain-pot {
    position: absolute;
    bottom: 0;
    left: 50%;
    transition: transform 0.8s ease;
    transform-origin: bottom center;
    z-index: 10;
    display: grid;
    place-items: center;
  }

  .brain-pot svg {
    width: 170px;
    height: auto;
    filter: drop-shadow(0 10px 20px rgba(31, 42, 68, 0.2));
  }

  .root-callout {
    position: absolute;
    bottom: 7.5rem;
    padding: 0.5rem 0.9rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.9rem;
    font-size: 0.85rem;
    color: rgba(73, 40, 40, 0.75);
    box-shadow: 0 10px 20px rgba(73, 40, 40, 0.12);
  }

  .tree-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  .leaves {
    position: fixed;
    inset: -2rem 0 0;
    pointer-events: none;
    text-align: right;
    z-index: 1;
  }

  .leaves i {
    display: inline-block;
    width: 200px;
    height: 150px;
    background: linear-gradient(to bottom right, #309900, #005600);
    transform: skew(20deg);
    border-radius: 5% 40% 70%;
    box-shadow: inset 0 0 1px #222;
    border: 1px solid #333;
    z-index: 1;
    animation: falling 5s 0s infinite ease-in-out;
  }

  .leaves i:nth-of-type(2n) {
    animation-name: falling2;
  }

  .leaves i:nth-of-type(3n) {
    animation-name: falling3;
  }

  .leaves i:before {
    position: absolute;
    content: "";
    top: 117px;
    right: 9px;
    height: 27px;
    width: 32px;
    transform: rotate(49deg);
    border-radius: 0% 15% 15% 0%;
    border-top: 1px solid #222;
    border-bottom: 1px solid #222;
    border-left: 0 solid #222;
    border-right: 1px solid #222;
    background: linear-gradient(to right, rgba(0, 100, 0, 1), #005600);
    z-index: 1;
  }

  .leaves i:after {
    content: "";
    height: 125px;
    width: 10px;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0));
    display: block;
    transform: rotate(125deg);
    position: absolute;
    left: 85px;
    border-radius: 50%;
  }

  .leaves i:nth-of-type(n) {
    height: 23px;
    width: 30px;
    animation-delay: 1.9s;
    opacity: 0.7;
    transform: rotate(180deg);
  }

  .leaves i:nth-of-type(n):before {
    width: 7px;
    height: 5px;
    top: 17px;
    right: 1px;
  }

  .leaves i:nth-of-type(n):after {
    width: 2px;
    height: 17px;
    left: 12px;
    top: 0;
  }

  .leaves i:nth-of-type(2n+1) {
    height: 11px;
    width: 16px;
    animation-delay: 3.9s;
  }

  .leaves i:nth-of-type(2n+1):before {
    width: 4px;
    height: 3px;
    top: 7px;
    right: 0;
  }

  .leaves i:nth-of-type(2n+1):after {
    width: 2px;
    height: 6px;
    left: 5px;
    top: 1px;
  }

  .leaves i:nth-of-type(3n+2) {
    height: 17px;
    width: 23px;
    animation-delay: 2.3s;
  }

  .leaves i:nth-of-type(3n+2):before {
    height: 4px;
    width: 4px;
    top: 12px;
    right: 1px;
  }

  .leaves i:nth-of-type(3n+2):after {
    height: 10px;
    width: 2px;
    top: 1px;
    left: 8px;
  }

  .leaves i:nth-of-type(2n) {
    animation-delay: 3.9s;
  }

  .leaves i:nth-of-type(3n) {
    animation-delay: 2.3s;
  }

  .leaves i:nth-of-type(4n) {
    animation-delay: 4.4s;
  }

  .leaves i:nth-of-type(5n) {
    animation-delay: 5s;
  }

  .leaves i:nth-of-type(6n) {
    animation-delay: 3.5s;
  }

  .leaves i:nth-of-type(7n) {
    animation-delay: 2.8s;
  }

  .leaves i:nth-of-type(8n) {
    animation-delay: 1.5s;
  }

  .leaves i:nth-of-type(9n) {
    animation-delay: 3.3s;
  }

  .leaves i:nth-of-type(10n) {
    animation-delay: 2.5s;
  }

  .leaves i:nth-of-type(11n) {
    animation-delay: 1.2s;
  }

  .leaves i:nth-of-type(12n) {
    animation-delay: 4.1s;
  }

  .leaves i:nth-of-type(13n) {
    animation-delay: 1s;
  }

  .leaves i:nth-of-type(14n) {
    animation-delay: 4.7s;
  }

  .leaves i:nth-of-type(15n) {
    animation-delay: 3s;
  }

  .leaves i:nth-of-type(n) {
    background: linear-gradient(to bottom right, #309900, #005600);
  }

  .leaves i:nth-of-type(2n+2) {
    background: linear-gradient(to bottom right, #5e9900, #2b5600);
  }

  .leaves i:nth-of-type(4n+1) {
    background: linear-gradient(to bottom right, #990, #564500);
  }

  .leaves i:nth-of-type(3n+1) {
    opacity: 0.5;
  }

  .leaves i:nth-of-type(3n+2) {
    opacity: 0.3;
  }

  @keyframes falling {
    0% {
      transform: translate3d(300px, 0, 0) rotate(0deg);
    }
    100% {
      transform: translate3d(-350px, 700px, 0) rotate(90deg);
      opacity: 0;
    }
  }

  @keyframes falling3 {
    0% {
      transform: translate3d(0, 0, 0) rotate(-20deg);
    }
    100% {
      transform: translate3d(-230px, 640px, 0) rotate(-70deg);
      opacity: 0;
    }
  }

  @keyframes falling2 {
    0% {
      transform: translate3d(0, 0, 0) rotate(90deg);
    }
    100% {
      transform: translate3d(-400px, 680px, 0) rotate(0deg);
      opacity: 0;
    }
  }

  .tree-status {
    font-size: 1.05rem;
    font-weight: 600;
    margin: 0;
  }

  .tree-count {
    margin: 0.4rem 0 0;
    color: rgba(73, 40, 40, 0.7);
  }

  @media (max-width: 720px) {
    .tree-card {
      padding: 2rem 1rem;
    }

    .tree-stage {
      height: 22rem;
      --branch-length: 60px;
    }

    .tree-branch {
      height: 8px;
    }

    .leaf-label {
      padding: 0.4rem 0.7rem;
      gap: 0.4rem;
    }

    .leaf-code {
      font-size: 0.8rem;
    }

    .leaf-name {
      font-size: 0.7rem;
      max-width: 90px;
    }

    .leaf-dot {
      width: 6px;
      height: 6px;
    }

    .branch-group.left .leaf-label {
      margin-right: 0.3rem;
    }

    .branch-group.right .leaf-label {
      margin-left: 0.3rem;
    }
  }
</style>
