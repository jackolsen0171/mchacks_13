<script>
  let { data } = $props();

  const topics = [
    { id: "t1", name: "Limits and Continuity" },
    { id: "t2", name: "Derivatives and Rules" },
    { id: "t3", name: "Applications of Derivatives" },
    { id: "t4", name: "Integration by Substitution", status: "Needs Review" },
    { id: "t5", name: "Integration by Parts", status: "Stable" },
    { id: "t6", name: "Improper Integrals" },
    { id: "t7", name: "Sequences and Series" },
    { id: "t8", name: "Taylor Series" }
  ];

  const actionCards = [
    {
      id: "exam",
      title: "Exam Practice",
      desc: "Timed sets and exam-style prompts",
      accent: "#8f9a59",
      icon: "clock"
    },
    {
      id: "assignment",
      title: "Assignment Guiding",
      desc: "Work through an assignment step-by-step",
      accent: "#71804f",
      icon: "doc"
    },
    {
      id: "mixed",
      title: "Mixed Practice",
      desc: "Mix of topics, balanced session",
      accent: "#6a7442",
      icon: "shuffle",
      subtleTint: "linear-gradient(135deg, rgba(106,116,66,0.10), rgba(106,116,66,0.06))"
    }
  ];

  const courseTitle = `${data.course.courseCode} · ${data.course.courseName}`;
  const courseMeta = `${data.course.courseCode} · Problem-based exam`;
  const recommended = "Integration by parts";
</script>

<section
  class="subject-shell"
  style="
    --jungle: #5e6536;
    --cocoon: #dfdbca;
    --vitality: #8f9a59;
    --grasshopper: #71804f;
    --ghoul: #6a7442;
    --ghoul2: #66703e;
    --jungle-civ: #646d3b;
    --fog: #cecbb3;
  "
>
  <div class="subject-wrap">
    <a class="back-link" href="/">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span>Back</span>
    </a>

    <div class="glass-card">
      <header class="card-header">
        <div>
          <h1>{courseTitle}</h1>
          <p>{courseMeta}</p>
        </div>
        <button class="ghost-button" aria-label="More options">•••</button>
      </header>

      <div class="recommend-strip">
        <span class="muted">Recommended next:</span>
        <span class="strong">{recommended}</span>
        <span class="dim">(common exam pattern)</span>
      </div>

      <div class="content-grid">
        <div class="action-stack">
          {#each actionCards as card}
            <button
              class="action-card"
              style={`--accent: ${card.accent}; --tint: ${card.subtleTint ?? "linear-gradient(135deg, rgba(223,219,202,0.12), rgba(223,219,202,0.08))"};`}
            >
              <div class="action-icon">
                {#if card.icon === "clock"}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 7v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2" />
                  </svg>
                {:else if card.icon === "doc"}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path d="M14 3v4a2 2 0 0 0 2 2h4" stroke="currentColor" stroke-width="2" />
                  </svg>
                {:else}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M16 3h5v5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M4 20l6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M10 10l-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M21 3l-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M14 14l7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M16 21h5v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                {/if}
              </div>
              <div>
                <div class="action-title">{card.title}</div>
                <div class="action-desc">{card.desc}</div>
              </div>
            </button>
          {/each}
        </div>

        <div class="topics-panel">
          <div class="topics-header">
            <h2>Topics</h2>
          </div>
          <label class="search-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <input placeholder="Search topics..." />
          </label>
          <div class="topics-list">
            {#each topics as topic}
              <button class="topic-row">
                <div class="topic-text">
                  <div class="topic-name">{topic.name}</div>
                  {#if topic.status}
                    <span class={`topic-tag ${topic.status === "Stable" ? "is-stable" : "is-review"}`}>
                      {topic.status}
                    </span>
                  {/if}
                </div>
                <span class="topic-arrow">›</span>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <div class="recommend-strip recommend-bottom">
        <span class="muted">Recommended:</span>
        <span class="strong">{recommended}</span>
        <span class="dim">(common exam pattern)</span>
      </div>
    </div>
  </div>
</section>

<style>
  :global(body) {
    margin: 0;
  }

  .subject-shell {
    min-height: 100vh;
    background: var(--jungle);
    color: var(--cocoon);
    padding: 1.5rem 1.25rem 4rem;
  }

  .subject-wrap {
    max-width: 900px;
    margin: 0 auto;
  }

  .back-link {
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    color: var(--cocoon);
    text-decoration: none;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .glass-card {
    border-radius: 28px;
    border: 1px solid rgba(223, 219, 202, 0.18);
    background: linear-gradient(180deg, rgba(223, 219, 202, 0.08), rgba(223, 219, 202, 0.04));
    box-shadow: 0 24px 50px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(16px);
    padding: 1.5rem;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .card-header h1 {
    margin: 0;
    font-size: 1.75rem;
  }

  .card-header p {
    margin: 0.4rem 0 0;
    color: rgba(223, 219, 202, 0.7);
    font-size: 0.9rem;
  }

  .ghost-button {
    background: transparent;
    border: none;
    color: rgba(223, 219, 202, 0.7);
    font-size: 1.5rem;
    cursor: pointer;
  }

  .recommend-strip {
    margin: 1.2rem 0;
    border-radius: 18px;
    padding: 0.8rem 1rem;
    background: linear-gradient(135deg, rgba(206, 203, 179, 0.15), rgba(206, 203, 179, 0.08));
    border: 1px solid rgba(223, 219, 202, 0.2);
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .recommend-strip.recommend-bottom {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.15));
    border-color: rgba(223, 219, 202, 0.15);
  }

  .muted {
    color: rgba(223, 219, 202, 0.7);
  }

  .strong {
    color: var(--cocoon);
    font-weight: 700;
  }

  .dim {
    color: rgba(223, 219, 202, 0.55);
  }

  .content-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .action-stack {
    display: grid;
    gap: 1rem;
  }

  .action-card {
    width: 100%;
    text-align: left;
    border-radius: 18px;
    border: 1px solid rgba(223, 219, 202, 0.2);
    padding: 1rem;
    background: var(--tint);
    display: flex;
    gap: 0.9rem;
    color: var(--cocoon);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .action-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 24px rgba(0, 0, 0, 0.2);
  }

  .action-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    border: 1px solid rgba(223, 219, 202, 0.2);
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.1));
    display: grid;
    place-items: center;
    color: var(--accent);
    flex-shrink: 0;
  }

  .action-title {
    font-size: 1rem;
    font-weight: 600;
  }

  .action-desc {
    margin-top: 0.3rem;
    font-size: 0.85rem;
    color: rgba(223, 219, 202, 0.75);
  }

  .topics-panel {
    grid-column: span 2;
    border-radius: 20px;
    border: 1px solid rgba(223, 219, 202, 0.2);
    padding: 1.2rem;
    background: linear-gradient(135deg, rgba(100, 109, 59, 0.45), rgba(94, 101, 54, 0.4));
    display: grid;
    gap: 1rem;
  }

  .topics-header h2 {
    margin: 0;
    font-size: 1.2rem;
  }

  .search-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    border: 1px solid rgba(223, 219, 202, 0.2);
    background: rgba(223, 219, 202, 0.12);
    border-radius: 14px;
    padding: 0.6rem 0.8rem;
    color: rgba(223, 219, 202, 0.5);
  }

  .search-row input {
    border: none;
    background: transparent;
    color: var(--cocoon);
    width: 100%;
    outline: none;
    font-size: 0.9rem;
  }

  .topics-list {
    display: grid;
    gap: 0.5rem;
    max-height: 450px;
    overflow-y: auto;
    padding-right: 0.2rem;
  }

  .topic-row {
    border: none;
    background: transparent;
    color: var(--cocoon);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 0.7rem;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .topic-row:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .topic-text {
    min-width: 0;
  }

  .topic-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: rgba(223, 219, 202, 0.92);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .topic-tag {
    display: inline-flex;
    margin-top: 0.4rem;
    font-size: 0.7rem;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    border: 1px solid rgba(223, 219, 202, 0.15);
  }

  .topic-tag.is-stable {
    background: rgba(143, 154, 89, 0.25);
    color: #c9d99f;
  }

  .topic-tag.is-review {
    background: rgba(206, 203, 179, 0.25);
    color: #e8e4d9;
  }

  .topic-arrow {
    font-size: 1.4rem;
    opacity: 0.6;
  }

  @media (max-width: 860px) {
    .content-grid {
      grid-template-columns: 1fr;
    }

    .topics-panel {
      grid-column: span 1;
    }
  }
</style>
