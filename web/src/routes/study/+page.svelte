<script>
  import { marked } from "marked";
  import { tick } from "svelte";

  export let data;

  const themes = ["lumen", "tide", "ember"];

  const renderMarkdown = (value) => marked.parse(value ?? "");

  let activeTabs = {};
  let viewport;

  let reels = (data?.reels ?? []).map((reel, index) => ({
    id: reel.id,
    theme: themes[index % themes.length],
    chip: reel.topic ?? "Study topic",
    title: reel.title ?? "Untitled reel",
    theory: reel?.theory_reel ?? "",
    test: reel?.test_reel ?? "",
    level: typeof reel?.level === "number" ? reel.level : 0,
    meta: reel.createdAt ? new Date(reel.createdAt).toLocaleDateString() : "",
  }));

  const getActiveTab = (reel) =>
    activeTabs[reel.id] ?? (reel.level >= 1 ? "test" : "theory");

  const setActiveTab = (reel, tab) => {
    if (tab === "test" && reel.level < 1) return;
    activeTabs = { ...activeTabs, [reel.id]: tab };
  };

  const scrollToIndex = async (index) => {
    await tick();
    const cards = viewport?.querySelectorAll(".reel-card");
    const target = cards?.[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScroll = () => {
    if (!viewport || reels.length === 0) return;
    const maxScroll = viewport.scrollHeight - viewport.clientHeight;
    if (maxScroll <= 0) return;
    if (viewport.scrollTop >= maxScroll - 2) {
      viewport.scrollTop = 0;
    } else if (viewport.scrollTop <= 0) {
      viewport.scrollTop = maxScroll;
    }
  };

  const markSeen = async (reelId, index) => {
    const formData = new FormData();
    formData.set("reelId", reelId);
    const response = await fetch("?/markSeen", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      reels = reels.map((reel, i) =>
        i === index ? { ...reel, level: reel.level + 1 } : reel,
      );
      const { [reelId]: _removed, ...rest } = activeTabs;
      activeTabs = rest;
      const nextIndex = (index + 1) % reels.length;
      await scrollToIndex(nextIndex);
    }
  };
</script>

<section class="reels-shell">
  <div
    class="reels-viewport"
    aria-label="Study topic reels"
    bind:this={viewport}
    on:scroll={handleScroll}
  >
    {#each reels as reel, index (reel.id)}
      <article class={`reel-card reel-card--${reel.theme}`}>
        <div class="reel-rail"></div>
        <div class="reel-content">
          <span class="reel-chip">{reel.chip}</span>
          <h2>{reel.title}</h2>
          <div class="reel-tabs" role="tablist">
            <button
              class={`reel-tab ${getActiveTab(reel) === "theory" ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={getActiveTab(reel) === "theory"}
              on:click={() => setActiveTab(reel, "theory")}
            >
              Theory
            </button>
            <button
              class={`reel-tab ${getActiveTab(reel) === "test" ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={getActiveTab(reel) === "test"}
              disabled={reel.level < 1}
              on:click={() => setActiveTab(reel, "test")}
            >
              Test
            </button>
          </div>
          <div class="reel-blocks">
            {#if getActiveTab(reel) === "theory"}
              <section class="reel-block">
                <header>Theory</header>
                <div class="reel-markdown">
                  {@html renderMarkdown(
                    reel.theory || "No theory reel available yet.",
                  )}
                </div>
                <button
                  class="reel-seen"
                  type="button"
                  on:click={() => markSeen(reel.id, index)}
                >
                  Seen
                </button>
              </section>
            {:else}
              <section class="reel-block">
                <header>Test</header>
                <div class="reel-markdown">
                  {@html renderMarkdown(
                    reel.test || "No test reel available yet.",
                  )}
                </div>
              </section>
            {/if}
          </div>
        </div>
      </article>
    {/each}
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

  .reels-shell {
    padding: 0;
    color: var(--primary);
    display: grid;
    font-family: "Fraunces", "Times New Roman", serif;
    min-height: 100dvh;
  }

  .reels-viewport {
    display: grid;
    gap: 2rem;
    height: 100dvh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    padding: 0;
  }

  .reel-card {
    min-height: 100dvh;
    scroll-snap-align: start;
    border-radius: 0;
    padding: 3rem 2.5rem 4rem;
    display: grid;
    gap: 1.8rem;
    position: relative;
    overflow: hidden;
    background: linear-gradient(
      160deg,
      rgba(75, 95, 215, 0.08),
      rgba(46, 125, 111, 0.16) 55%,
      #ffffff 100%
    );
    border: 1px solid var(--border);
    box-shadow: 0 18px 36px rgba(31, 42, 68, 0.08);
  }

  .reel-card::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
        circle at top left,
        rgba(46, 125, 111, 0.2),
        transparent 55%
      ),
      radial-gradient(
        circle at bottom right,
        rgba(75, 95, 215, 0.2),
        transparent 55%
      );
    opacity: 0.9;
    pointer-events: none;
  }

  .reel-card--lumen {
    --reel-accent: rgba(46, 125, 111, 0.35);
  }

  .reel-card--tide {
    --reel-accent: rgba(75, 95, 215, 0.32);
  }

  .reel-card--ember {
    --reel-accent: rgba(31, 42, 68, 0.2);
  }

  .reel-rail {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      transparent 15%,
      var(--reel-accent) 45%,
      transparent 75%
    );
    opacity: 0.75;
    pointer-events: none;
  }

  .reel-content {
    display: grid;
    gap: 0.8rem;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
    position: relative;
    z-index: 1;
  }

  .reel-chip {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.7rem;
    color: var(--accent-green);
    font-weight: 700;
  }

  .reel-content h2 {
    margin: 0;
    font-size: 2rem;
  }

  .reel-content p {
    margin: 0;
    color: #52607a;
    max-width: 36rem;
  }

  .reel-blocks {
    display: grid;
    gap: 1.2rem;
    margin-top: 0.4rem;
  }

  .reel-block {
    padding: 1.1rem 1.2rem;
    border-radius: 18px;
    background: rgba(51, 45, 45, 0.8);
    border: 1px solid rgba(31, 42, 68, 0.12);
    box-shadow: 0 12px 24px rgba(31, 42, 68, 0.08);
    display: grid;
    gap: 0.6rem;
    min-height: 12rem;
  }

  .reel-block header {
    font-size: 0.75rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--accent-indigo);
  }

  .reel-block:nth-child(2) header {
    color: var(--accent-green);
  }

  .reel-block p {
    max-width: 42rem;
  }

  .reel-tabs {
    display: inline-flex;
    gap: 0.5rem;
    padding: 0.35rem;
    border-radius: 999px;
    background: rgba(31, 42, 68, 0.08);
    border: 1px solid rgba(31, 42, 68, 0.12);
    width: fit-content;
  }

  .reel-tab {
    border: none;
    background: transparent;
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #52607a;
    cursor: pointer;
  }

  .reel-tab:disabled {
    color: rgba(82, 96, 122, 0.4);
    cursor: not-allowed;
  }

  .reel-tab.active {
    background: #ffffff;
    color: var(--primary);
    box-shadow: 0 8px 16px rgba(31, 42, 68, 0.12);
  }

  .reel-action {
    margin-top: 0.8rem;
  }

  .reel-seen {
    border: none;
    border-radius: 999px;
    padding: 0.55rem 1.4rem;
    font-weight: 700;
    background: var(--accent-indigo);
    color: #fff;
    box-shadow: 0 12px 24px rgba(75, 95, 215, 0.3);
    cursor: pointer;
  }

  .reel-markdown :global(p) {
    margin: 0 0 0.8rem;
  }

  .reel-markdown :global(p:last-child) {
    margin-bottom: 0;
  }

  .reel-markdown :global(ul),
  .reel-markdown :global(ol) {
    margin: 0.4rem 0 0.8rem 1.2rem;
    padding: 0;
  }

  .reel-markdown :global(li) {
    margin-bottom: 0.35rem;
  }

  .reel-markdown :global(code) {
    font-family: "SFMono-Regular", "Menlo", "Monaco", monospace;
    font-size: 0.85em;
    background: rgba(31, 42, 68, 0.08);
    padding: 0.1rem 0.35rem;
    border-radius: 6px;
  }

  .reel-markdown :global(pre) {
    margin: 0.6rem 0 0.8rem;
    padding: 0.8rem;
    border-radius: 12px;
    background: rgba(31, 42, 68, 0.08);
    overflow-x: auto;
  }

  .reel-markdown :global(pre code) {
    background: transparent;
    padding: 0;
  }

  .reel-markdown :global(blockquote) {
    margin: 0.6rem 0 0.8rem;
    padding: 0.3rem 0 0.3rem 0.8rem;
    border-left: 3px solid rgba(75, 95, 215, 0.5);
    color: #656f82;
  }

  .reel-footer {
    margin-top: auto;
    display: grid;
    gap: 1rem;
    position: relative;
    z-index: 1;
  }

  .reel-meta {
    font-size: 0.95rem;
    color: #52607a;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  .reel-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .button {
    border-radius: 999px;
    padding: 0.7rem 1.6rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
  }

  .button.primary {
    background: var(--accent-indigo);
    color: #fff;
    box-shadow: 0 14px 30px rgba(75, 95, 215, 0.3);
  }

  .button.secondary {
    background: rgba(255, 255, 255, 0.7);
    color: var(--primary);
    border: 1px solid rgba(31, 42, 68, 0.12);
  }

  @media (max-width: 720px) {
    .reel-card {
      min-height: 100dvh;
      padding: 2rem 1.5rem 3rem;
    }
  }
</style>
