<script>
  let { data } = $props();

  const groupByTopic = (files) => {
    const map = new Map();
    for (const file of files) {
      const topic = file.topic || "Unassigned";
      if (!map.has(topic)) {
        map.set(topic, []);
      }
      map.get(topic).push(file);
    }
    return Array.from(map, ([name, documents]) => ({ name, documents }));
  };
</script>

<section class="course-shell">
  <header class="course-header">
    <a class="back-link" href="/">Back</a>
    <div class="header-row">
      <div>
        <h1>{data.course.courseCode} · {data.course.courseName}</h1>
        <p class="subtitle">Topics and uploaded documents for this course.</p>
      </div>
      <form method="POST" action="?/deleteCourse">
        <button
          class="delete-button"
          type="submit"
          onclick={(event) => {
            if (!confirm("Delete this course and all its documents?")) {
              event.preventDefault();
            }
          }}
        >
          Delete course
        </button>
      </form>
    </div>
  </header>

  <div class="topics">
    <section class="topic-card">
      <div class="topic-title">
        <h2>Topics</h2>
        <span>{data.topics?.length ?? 0} topics</span>
      </div>
      {#if data.topics?.length}
        <div class="topic-pill-list">
          {#each data.topics as topicName}
            <span class="topic-pill">{topicName}</span>
          {/each}
        </div>
      {:else}
        <p class="empty-topic">No topics extracted yet.</p>
      {/if}
    </section>

    {#if data.files?.length}
      {#each groupByTopic(data.files) as topic}
        <section class="topic-card">
          <div class="topic-title">
            <h2>{topic.name}</h2>
            <span>{topic.documents.length} documents</span>
          </div>
          <ul class="doc-list">
            {#each topic.documents as doc}
              <li>
                <span class="doc-name">{doc.fileName}</span>
                <span class="doc-meta"
                  >{doc.createdAt
                    ? new Date(doc.createdAt).toLocaleDateString()
                    : "Uploaded"}</span
                >
              </li>
            {/each}
          </ul>
        </section>
      {/each}
    {:else}
      <div class="empty-state">
        <p>No documents uploaded yet.</p>
      </div>
    {/if}
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
    background: var(--background);
  }

  .course-shell {
    padding: 2.5rem 1.5rem 5rem;
    color: var(--primary);
    display: grid;
    gap: 2rem;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  .course-header h1 {
    margin: 0.5rem 0 0;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-family: "Fraunces", "Times New Roman", serif;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .back-link {
    text-decoration: none;
    color: var(--accent-green);
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .back-link::before {
    content: "←";
  }

  .back-link:hover {
    text-decoration: underline;
  }

  .subtitle {
    margin: 0.4rem 0 0;
    color: rgba(73, 40, 40, 0.7);
  }

  .delete-button {
    border: 1px solid rgba(161, 28, 28, 0.3);
    background: rgba(161, 28, 28, 0.08);
    color: #a11c1c;
    border-radius: 999px;
    padding: 0.6rem 1.2rem;
    font-weight: 600;
    cursor: pointer;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
    transition: background 0.2s ease;
  }

  .delete-button:hover {
    background: rgba(161, 28, 28, 0.15);
  }

  .topics {
    display: grid;
    gap: 1.5rem;
  }

  .topic-card {
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(73, 40, 40, 0.15);
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 14px 28px rgba(73, 40, 40, 0.06);
  }

  .topic-title {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
  }

  .topic-title h2 {
    margin: 0;
    font-size: 1.2rem;
    font-family: "Fraunces", "Times New Roman", serif;
  }

  .topic-title span {
    color: rgba(73, 40, 40, 0.6);
    font-size: 0.85rem;
  }

  .doc-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0;
    display: grid;
    gap: 0.75rem;
  }

  .doc-list li {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 0.9rem;
    background: rgba(73, 40, 40, 0.05);
    align-items: flex-start;
  }

  .doc-name {
    font-weight: 600;
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .doc-meta {
    color: rgba(73, 40, 40, 0.6);
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .empty-state {
    padding: 2rem;
    border-radius: 1.5rem;
    border: 1px dashed rgba(73, 40, 40, 0.25);
    text-align: center;
    color: rgba(73, 40, 40, 0.6);
  }

  .topic-pill-list {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .topic-pill {
    padding: 0.45rem 0.85rem;
    border-radius: 999px;
    background: var(--accent-green);
    color: #efe9e3;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .empty-topic {
    margin: 1rem 0 0;
    color: rgba(73, 40, 40, 0.6);
  }
</style>
