<script>
  import { enhance } from "$app/forms";

  let { data } = $props();
  let addCourseModalOpen = $state(false);

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

  {#if addCourseModalOpen && courseCount < maxCourses}
    <form
      class="course-form"
      method="POST"
      action="?/addCourse"
      enctype="multipart/form-data"
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
        <label for="courseCode">Course Code</label>
        <input
          id="courseCode"
          name="courseCode"
          placeholder="MATH 242"
          required
        />
      </div>
      <div class="field">
        <label for="courseName">Course Name</label>
        <input
          id="courseName"
          name="courseName"
          placeholder="Calculus II"
          required
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
        />
      </div>
      <div class="form-actions">
        <button
          class="secondary-button"
          type="button"
          onclick={() => (addCourseModalOpen = false)}
        >
          Cancel
        </button>
        <button class="primary-button" type="submit">Add</button>
      </div>
    </form>
  {/if}

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
              class="tree-branch"
              style={`bottom: ${branchBottom}%; ${
                isLeft
                  ? `left: calc(-1 * (var(--branch-length) - 4px)); transform: rotate(-8deg); transform-origin: right center;`
                  : `left: 29px; transform: rotate(8deg); transform-origin: left center;`
              } animation-delay: ${index * 0.2}s;`}
            ></div>
            <div
              class="tree-leaf"
              style={`bottom: ${branchBottom}%; ${
                isLeft
                  ? `left: calc(50% - (var(--branch-length) + var(--leaf-offset))); transform: translateY(220%);`
                  : `left: calc(50% + (var(--branch-length) + var(--leaf-offset))); transform: translateY(220%);`
              } animation-delay: ${index * 0.2}s;`}
            >
              <a
                class="leaf-pill"
                style={`${!isLeft ? "position: relative; top: 60px; right: 110px;" : "position: relative; top: 60px; right: 60px;"}`}
                href={`/class/${course.id}`}
              >
                <span class="leaf-dot"></span>
                <span class="leaf-text">
                  <span class="leaf-code">{course.courseCode}</span>
                  <span class="leaf-muted">{course.courseName}</span>
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
  }

  .field {
    display: grid;
    gap: 0.4rem;
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
    font-size: 1rem;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
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
    width: var(--branch-length);
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
    /* background: var(--surface);
    border: 1px solid var(--border); */
    text-decoration: none;
    color: var(--primary);
    font-weight: 600;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
    /* box-shadow: 0 14px 24px rgba(31, 42, 68, 0.12); */
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }

  .leaf-pill:visited,
  .leaf-pill:active {
    color: var(--primary);
  }

  .leaf-text {
    display: inline-flex;
    flex-direction: column;
    line-height: 1.1;
  }

  .leaf-code {
    font-weight: 700;
  }

  .leaf-dot {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: #84934a;
    display: inline-block;
  }

  .leaf-pill:active .leaf-dot,
  .leaf-pill:focus .leaf-dot,
  .leaf-pill:focus-visible .leaf-dot {
    background: #84934a;
  }

  .leaf-muted {
    font-weight: 500;
    color: rgba(73, 40, 40, 0.7);
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
      --branch-length: 70px;
      --leaf-offset: 30px;
    }

    .tree-branch {
      height: 8px;
    }
  }
</style>
