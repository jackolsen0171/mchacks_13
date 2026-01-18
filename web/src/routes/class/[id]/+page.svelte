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
    --primary: #1f2a44;
    --background: #f8f9fb;
    --surface: #ffffff;
    --border: #e4e7ec;
    --accent-green: #2e7d6f;
    --accent-indigo: #4b5fd7;
  }

  :global(html) {
    background: var(--background);
  }

  .course-shell {
    padding: 2.5rem 1.5rem 5rem;
    color: var(--primary);
    display: grid;
    gap: 2rem;
  }

  .course-header h1 {
    margin: 0.5rem 0 0;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
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
    color: var(--accent-indigo);
    font-weight: 600;
  }

  .subtitle {
    margin: 0.4rem 0 0;
    color: #52607a;
  }

  .delete-button {
    border: 1px solid var(--border);
    background: #fff;
    color: #a11c1c;
    border-radius: 999px;
    padding: 0.6rem 1.2rem;
    font-weight: 600;
    cursor: pointer;
  }

  .topics {
    display: grid;
    gap: 1.5rem;
  }

  .topic-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 14px 28px rgba(31, 42, 68, 0.08);
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
  }

  .topic-title span {
    color: #68748a;
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
    background: #f3f5f9;
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
    color: #68748a;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .empty-state {
    padding: 2rem;
    border-radius: 1.5rem;
    border: 1px dashed var(--border);
    text-align: center;
    color: #68748a;
  }
</style>
