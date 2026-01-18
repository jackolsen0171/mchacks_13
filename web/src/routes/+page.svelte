<script>
  import { enhance } from "$app/forms";

  let { data } = $props();
  let addCourseModalOpen = $state(false);

  const maxCourses = 5;
  const courses = $derived(data?.courses ?? []);
  const courseCount = $derived(courses.length);
  const treeHeight = $derived(Math.min(90, 25 + courseCount * 12));
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
            : "Your knowledge tree is complete."
  );
</script>

<section class="dashboard">
  <header class="dashboard-header">
    <div>
      <p class="eyebrow">Dashboard</p>
      <h1>Brain Rejuvenate</h1>
      <p class="subtitle">Watch your knowledge tree grow with each course.</p>
    </div>
    <div class="controls">
      {#if courseCount < maxCourses}
        <button class="primary-button" type="button" on:click={() => (addCourseModalOpen = true)}>
          + Add Course
        </button>
      {/if}
    </div>
  </header>

  {#if addCourseModalOpen && courseCount < maxCourses}
    <form
      class="course-form"
      method="POST"
      action="?/addCourse"
      use:enhance={() =>
        async ({ result, update }) => {
          if (result?.type === "success") {
            if (update) {
              await update();
            }
            addCourseModalOpen = false;
          }
        }}
    >
      <div class="field">
        <label for="courseCode">Course code</label>
        <input id="courseCode" name="courseCode" placeholder="MATH 242" required />
      </div>
      <div class="field">
        <label for="courseName">Course name</label>
        <input id="courseName" name="courseName" placeholder="Calculus II" required />
      </div>
      <div class="form-actions">
        <button class="secondary-button" type="button" on:click={() => (addCourseModalOpen = false)}>
          Cancel
        </button>
        <button class="primary-button" type="submit">Add</button>
      </div>
    </form>
  {/if}

  <div class="tree-card">
    <div class="tree-stage">
      <div class="brain-pot" style={`transform: translateX(-50%) scale(${brainScale})`}>
        <svg width="200" height="140" viewBox="80 440 200 140" aria-hidden="true">
          <g transform="translate(0,0)">
            <path
              d="M120 520
                 C110 500 120 470 150 465
                 C160 445 190 445 200 460
                 C230 455 250 470 248 495
                 C270 510 260 545 230 548
                 C220 570 190 575 175 560
                 C155 575 125 565 120 545
                 C100 542 95 528 120 520 Z"
              fill="#e9e3d2"
              stroke="#3c5a46"
              stroke-width="6"
            />
            <path
              d="M145 505 C155 490 175 490 185 505"
              stroke="#3c5a46"
              stroke-width="5"
              stroke-linecap="round"
              opacity="0.85"
            />
            <path
              d="M165 528 C175 512 200 512 210 530"
              stroke="#3c5a46"
              stroke-width="5"
              stroke-linecap="round"
              opacity="0.85"
            />
            <path
              d="M135 535 C150 525 160 535 170 545"
              stroke="#3c5a46"
              stroke-width="5"
              stroke-linecap="round"
              opacity="0.75"
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
            {@const branchLength = 120}
            <div
              class="tree-branch"
              style={`width: ${branchLength}px; bottom: ${55 + index * 13}%; ${
                isLeft
                  ? `left: -${branchLength - 4}px; transform: rotate(-8deg); transform-origin: right center;`
                  : `left: 36px; transform: rotate(8deg); transform-origin: left center;`
              } animation-delay: ${index * 0.2}s;`}
            ></div>
            <div
              class="tree-leaf"
              style={`bottom: ${55 + index * 13}%; ${
                isLeft
                  ? `left: calc(50% - ${branchLength + 20}px); transform: translateY(220%);`
                  : `left: calc(50% + ${branchLength + 20}px); transform: translate(-100%, 220%);`
              } animation-delay: ${index * 0.2}s;`}
            >
              <a class="leaf-pill" href={`/class/${course.id}`}>
                <span class="leaf-dot"></span>
                <span>{course.courseCode}</span>
                <span class="leaf-muted">{course.courseName}</span>
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
    background-color: var(--background);
  }

  .dashboard {
    padding: 2.5rem 1.5rem 5rem;
    color: var(--primary);
    display: grid;
    gap: 2.5rem;
    min-height: 100dvh;
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
    color: var(--accent-indigo);
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: clamp(2rem, 4vw, 3.25rem);
    margin: 0 0 0.5rem;
  }

  .subtitle {
    margin: 0;
    color: #52607a;
    max-width: 32rem;
  }

  .controls {
    display: flex;
    gap: 1rem;
  }

  .primary-button,
  .secondary-button {
    border-radius: 999px;
    padding: 0.7rem 1.6rem;
    font-weight: 600;
    border: 1px solid transparent;
    cursor: pointer;
  }

  .primary-button {
    background: var(--accent-green);
    color: #fff;
    box-shadow: 0 12px 24px rgba(46, 125, 111, 0.2);
  }

  .secondary-button {
    background: transparent;
    border-color: var(--border);
    color: var(--primary);
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
  }

  .field {
    display: grid;
    gap: 0.4rem;
  }

  label {
    font-size: 0.85rem;
    color: #52607a;
  }

  input {
    border: 1px solid var(--border);
    border-radius: 0.9rem;
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .tree-card {
    background: linear-gradient(180deg, rgba(46, 125, 111, 0.08), rgba(75, 95, 215, 0.08));
    border-radius: 2rem;
    padding: 2.5rem 2rem;
    min-height: 28rem;
    position: relative;
    overflow: hidden;
    margin-top: auto;
    margin-bottom: 3rem;
  }

  .tree-stage {
    position: relative;
    height: 26rem;
  }

  .tree-trunk {
    position: absolute;
    bottom: 5.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    background: linear-gradient(180deg, #b07a4a, #7a4f2c);
    border-radius: 8px 8px 0 0;
    transition: height 0.8s ease;
    box-shadow: inset -6px 0 10px rgba(0, 0, 0, 0.2);
    z-index: 5;
  }

  .tree-branch {
    position: absolute;
    height: 10px;
    background: #8b5b30;
    border-radius: 999px;
    animation: branchIn 0.6s ease both;
  }

  .tree-leaf {
    position: absolute;
    animation: leafIn 0.7s ease both;
    z-index: 8;
  }

  .leaf-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    border-radius: 999px;
    background: var(--surface);
    border: 1px solid var(--border);
    text-decoration: none;
    color: var(--primary);
    font-weight: 600;
    box-shadow: 0 14px 24px rgba(31, 42, 68, 0.12);
    white-space: nowrap;
  }

  .leaf-dot {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: var(--accent-indigo);
    display: inline-block;
  }

  .leaf-muted {
    font-weight: 500;
    color: #68748a;
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
    color: #52607a;
    box-shadow: 0 10px 20px rgba(31, 42, 68, 0.12);
  }

  .tree-footer {
    margin-top: 1.5rem;
    text-align: center;
  }

  .tree-status {
    font-size: 1.05rem;
    font-weight: 600;
    margin: 0;
  }

  .tree-count {
    margin: 0.4rem 0 0;
    color: #68748a;
  }

  @keyframes leafIn {
    0% {
      opacity: 0;
      transform: translateY(10px) scale(0.8);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes branchIn {
    0% {
      opacity: 0;
      transform: scaleX(0);
    }
    100% {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  @media (max-width: 720px) {
    .tree-card {
      padding: 2rem 1.2rem;
    }

    .tree-stage {
      height: 22rem;
    }

    .tree-branch {
      width: 80px !important;
    }
  }
</style>
