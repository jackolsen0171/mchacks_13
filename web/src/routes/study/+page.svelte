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
    instanceId: `reel-${index}`,
    theme: themes[index % themes.length],
    chip: reel.topic ?? "Study topic",
    title: reel.title ?? "Untitled reel",
    theory: reel?.theory_reel ?? "",
    test: reel?.test_reel ?? "",
    level: typeof reel?.level === "number" ? reel.level : 0,
    meta: reel.createdAt ? new Date(reel.createdAt).toLocaleDateString() : "",
    courseId: reel.courseId ?? null,
    courseCode: reel.courseCode ?? null,
    courseName: reel.courseName ?? null,
    topicProgress:
      typeof reel?.topicProgress === "number" ? reel.topicProgress : 0,
    answeredOption: reel.answeredOption ?? null,
  }));

  // Initialize testSelections with already answered reels
  let initialSelections = {};
  for (const reel of reels) {
    if (reel.answeredOption) {
      initialSelections[reel.instanceId] = reel.answeredOption;
    }
  }
  let testSelections = initialSelections;

  let nextInstanceId = reels.length;

  const getActiveTab = (reel) =>
    activeTabs[reel.instanceId] ?? (reel.level >= 1 ? "test" : "theory");

  const setActiveTab = (reel, tab) => {
    if (tab === "test" && reel.level < 1) return;
    activeTabs = { ...activeTabs, [reel.instanceId]: tab };
  };

  const parseTest = (text) => {
    if (!text) return null;
    const cleaned = text.replace(/\r/g, "");
    const plain = cleaned.replace(/[*_`]/g, "");
    const questionMatch = plain.match(/question:\s*(.+)/i);
    const question = questionMatch?.[1]?.trim() ?? null;
    const options = [];
    const optionRegex = /(^|\n)\s*(?:[-*]\s*)?([A-D])[\)\.\:]?\s+(.+)/g;
    let match;
    while ((match = optionRegex.exec(plain)) !== null) {
      options.push({ key: match[2], text: match[3].trim() });
    }
    const answerMatch = plain.match(/(correct answer|answer):\s*([A-D])/i);
    const answer = answerMatch?.[2]?.toUpperCase() ?? null;
    if (!question || options.length === 0 || !answer) {
      return null;
    }
    return { question, options, answer };
  };

  // Strip answer from raw test content when parsing fails
  const stripAnswerFromTest = (text) => {
    if (!text) return text;
    // Remove lines containing answer information
    return text
      .replace(/\*?\*?(correct\s*answer|answer)\s*[:=]\s*[A-Da-d]\*?\*?/gi, "")
      .replace(/\n\s*\n\s*\n/g, "\n\n") // Clean up extra blank lines
      .trim();
  };

  const selectOption = async (reel, optionKey, correctAnswer) => {
    if (testSelections[reel.instanceId]) return;
    testSelections = { ...testSelections, [reel.instanceId]: optionKey };

    // Save the answer to the database
    const saveFormData = new FormData();
    saveFormData.set("reelId", reel.id);
    saveFormData.set("answeredOption", optionKey);
    await fetch("?/saveAnswer", {
      method: "POST",
      body: saveFormData,
    });

    // If correct answer, update topic progress
    if (optionKey === correctAnswer && reel.courseId && reel.chip) {
      const formData = new FormData();
      formData.set("courseId", reel.courseId);
      formData.set("topicName", reel.chip);
      formData.set("increment", "10");

      const response = await fetch("?/updateTopicProgress", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Optimistically update the progress in the UI
        const newProgress = Math.min(100, reel.topicProgress + 10);
        reels = reels.map((r) =>
          r.chip === reel.chip ? { ...r, topicProgress: newProgress } : r,
        );
      }
    }
  };

  const scrollToIndex = async (index) => {
    await tick();
    const cards = viewport?.querySelectorAll(".reel-card");
    const target = cards?.[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const markSeen = async (reelId, index, reel) => {
    const formData = new FormData();
    formData.set("reelId", reelId);
    const response = await fetch("?/markSeen", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const nextLevel = reel.level + 1;
      reels = reels.map((item, i) =>
        i === index ? { ...item, level: nextLevel } : item,
      );
      const newInstanceId = `reel-${nextInstanceId++}`;
      const appendedReel = {
        ...reel,
        level: nextLevel,
        instanceId: newInstanceId,
      };
      reels = [...reels, appendedReel];

      // Carry over the answer selection to the new instance
      if (testSelections[reel.instanceId]) {
        testSelections = {
          ...testSelections,
          [newInstanceId]: testSelections[reel.instanceId],
        };
      }

      const { [reel.instanceId]: _removed, ...rest } = activeTabs;
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
  >
    {#each reels as reel, index (reel.instanceId)}
      <article class={`reel-card reel-card--${reel.theme}`}>
        <div class="reel-rail"></div>
        <div class="reel-content">
          <div class="reel-chip-wrapper">
            <div class="reel-chip-bg"></div>
            <div
              class="reel-chip-fill"
              style={`width: ${reel.topicProgress}%`}
            ></div>
            <span class="reel-chip-text">{reel.chip}</span>
            <span class="reel-chip-progress">{reel.topicProgress}%</span>
          </div>
          {#if reel.courseCode || reel.courseName}
            <div class="reel-course-header">
              {#if reel.courseCode}
                <span class="reel-course-code">{reel.courseCode}</span>
              {/if}
              {#if reel.courseName}
                <span class="reel-course-name">{reel.courseName}</span>
              {/if}
            </div>
          {/if}
          <h2 class="reel-title">{reel.title}</h2>
          <div class="reel-tabs" role="tablist">
            <button
              class={`reel-tab ${getActiveTab(reel) === "theory" ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={getActiveTab(reel) === "theory"}
              onclick={() => setActiveTab(reel, "theory")}
            >
              Theory
            </button>
            <button
              class={`reel-tab ${getActiveTab(reel) === "test" ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={getActiveTab(reel) === "test"}
              disabled={reel.level < 1}
              onclick={() => setActiveTab(reel, "test")}
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
                  onclick={() => markSeen(reel.id, index, reel)}
                >
                  Seen
                </button>
              </section>
            {:else}
              <section class="reel-block">
                <header>Test</header>
                {#if parseTest(reel.test)}
                  {@const parsed = parseTest(reel.test)}
                  <div class="reel-test">
                    <div class="reel-test-question">
                      {parsed.question}
                    </div>
                    <div class="reel-test-options">
                      {#each parsed.options as option}
                        <button
                          class={`reel-test-option ${
                            testSelections[reel.instanceId] === option.key
                              ? testSelections[reel.instanceId] ===
                                parsed.answer
                                ? "selected correct"
                                : "selected incorrect"
                              : ""
                          }`}
                          type="button"
                          onclick={() =>
                            selectOption(reel, option.key, parsed.answer)}
                        >
                          <span class="reel-test-key">{option.key}</span>
                          <span>{option.text}</span>
                        </button>
                      {/each}
                    </div>
                    {#if testSelections[reel.instanceId]}
                      {@const isCorrect =
                        testSelections[reel.instanceId] === parsed.answer}
                      <div
                        class={`reel-test-feedback ${isCorrect ? "correct" : "incorrect"}`}
                      >
                        {isCorrect
                          ? "Correct!"
                          : `Incorrect. Correct answer: ${parsed.answer}`}
                      </div>
                      {#if !isCorrect}
                        <button
                          class="reel-test-next incorrect"
                          type="button"
                          onclick={() =>
                            scrollToIndex((index + 1) % reels.length)}
                        >
                          Next
                        </button>
                      {/if}
                    {/if}
                  </div>
                {:else}
                  <div class="reel-markdown">
                    {@html renderMarkdown(
                      stripAnswerFromTest(reel.test) ||
                        "No test reel available yet.",
                    )}
                  </div>
                {/if}
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

  .reels-shell {
    padding: 0;
    color: var(--primary);
    display: grid;
    font-family: "Fraunces", "Times New Roman", serif;
    min-height: 100dvh;
    background: #fffaf6;
  }

  .reels-viewport {
    display: grid;
    gap: 2rem;
    height: 100dvh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    padding-top: calc(env(safe-area-inset-top) + 1.5rem);
    scroll-padding-top: calc(env(safe-area-inset-top) + 1.5rem);
    scrollbar-color: rgba(73, 40, 40, 0.25) transparent;
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
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: 0 18px 40px rgba(73, 40, 40, 0.12);
  }

  .reel-card::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0)
    );
    opacity: 0.7;
    pointer-events: none;
  }

  .reel-card--lumen {
    --reel-accent: rgba(132, 147, 74, 0.28);
  }

  .reel-card--tide {
    --reel-accent: rgba(101, 109, 63, 0.25);
  }

  .reel-card--ember {
    --reel-accent: rgba(73, 40, 40, 0.16);
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
    opacity: 0.35;
    pointer-events: none;
  }

  .reel-content {
    display: grid;
    gap: 0.8rem;
    font-family: "Avenir Next", "Helvetica Neue", sans-serif;
    position: relative;
    z-index: 1;
  }

  .reel-chip-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    min-width: 180px;
    overflow: hidden;
  }

  .reel-chip-bg {
    position: absolute;
    inset: 0;
    background: rgba(132, 147, 74, 0.12);
    border: 1px solid rgba(132, 147, 74, 0.25);
    border-radius: 999px;
  }

  .reel-chip-fill {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background: var(--accent-green);
    border-radius: 999px;
    transition: width 0.5s ease;
    opacity: 0.85;
  }

  .reel-chip-text {
    position: relative;
    z-index: 1;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.7rem;
    color: var(--primary);
    font-weight: 700;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .reel-chip-progress {
    position: relative;
    z-index: 1;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--primary);
    flex-shrink: 0;
  }

  .reel-course-header {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .reel-course-code {
    font-family: "Fraunces", "Times New Roman", serif;
    font-size: clamp(1.5rem, 3.5vw, 2.25rem);
    color: var(--primary);
    line-height: 1.2;
    font-weight: 600;
  }

  .reel-course-name {
    font-family: "Fraunces", "Times New Roman", serif;
    font-size: clamp(1rem, 2.5vw, 1.4rem);
    color: rgba(73, 40, 40, 0.75);
    line-height: 1.2;
  }

  .reel-title {
    margin: 0.5rem 0 0;
    font-family: "Fraunces", "Times New Roman", serif;
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    line-height: 1.3;
    color: rgba(73, 40, 40, 0.6);
    font-weight: 400;
    font-style: italic;
  }

  .reel-content p {
    margin: 0;
    color: rgba(73, 40, 40, 0.7);
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
    background: var(--background);
    border: 1px solid rgba(73, 40, 40, 0.18);
    box-shadow: 0 12px 24px rgba(73, 40, 40, 0.12);
    display: grid;
    gap: 0.6rem;
    min-height: 12rem;
    color: var(--primary);
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
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid var(--border);
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
    color: rgba(73, 40, 40, 0.6);
    cursor: pointer;
  }

  .reel-tab:disabled {
    color: rgba(73, 40, 40, 0.4);
    cursor: not-allowed;
  }

  .reel-tab.active {
    background: #fffaf6;
    color: var(--primary);
    box-shadow: 0 8px 16px rgba(73, 40, 40, 0.12);
  }

  .reel-action {
    margin-top: 0.8rem;
  }

  .reel-seen {
    border: none;
    border-radius: 999px;
    padding: 0.55rem 1.4rem;
    font-weight: 700;
    background: var(--accent-green);
    color: #fff;
    box-shadow: 0 12px 24px rgba(132, 147, 74, 0.3);
    cursor: pointer;
  }

  .reel-test {
    display: grid;
    gap: 0.8rem;
  }

  .reel-test-question {
    font-weight: 700;
    color: var(--primary);
  }

  .reel-test-options {
    display: grid;
    gap: 0.6rem;
  }

  .reel-test-option {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.7rem;
    align-items: start;
    padding: 0.7rem 0.9rem;
    border-radius: 14px;
    border: 1px solid rgba(73, 40, 40, 0.18);
    background: rgba(255, 255, 255, 0.7);
    color: var(--primary);
    cursor: pointer;
    text-align: left;
  }

  .reel-test-option.selected {
    pointer-events: none;
  }

  .reel-test-option.selected.correct {
    border-color: var(--accent-green);
    box-shadow: 0 10px 18px rgba(132, 147, 74, 0.2);
  }

  .reel-test-option.selected.incorrect {
    border-color: #b04040;
    box-shadow: 0 10px 18px rgba(176, 64, 64, 0.2);
  }

  .reel-test-key {
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: rgba(132, 147, 74, 0.18);
    color: var(--primary);
    font-weight: 700;
    font-size: 0.75rem;
  }

  .reel-test-feedback {
    padding: 0.6rem 0.8rem;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.9rem;
  }

  .reel-test-feedback.correct {
    background: rgba(132, 147, 74, 0.14);
    color: var(--primary);
  }

  .reel-test-feedback.incorrect {
    background: rgba(193, 61, 61, 0.12);
    color: #7a2b2b;
  }

  .reel-test-next.incorrect {
    background: #b04040;
    box-shadow: 0 12px 24px rgba(176, 64, 64, 0.24);
    border: none;
    border-radius: 999px;
    padding: 0.6rem 1.4rem;
    font-weight: 700;
    cursor: pointer;
    color: #fff;
  }

  :global(.reels-viewport::-webkit-scrollbar) {
    width: 10px;
  }

  :global(.reels-viewport::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(.reels-viewport::-webkit-scrollbar-thumb) {
    background: rgba(73, 40, 40, 0.2);
    border-radius: 999px;
  }

  :global(.reels-viewport::-webkit-scrollbar-thumb:hover) {
    background: rgba(73, 40, 40, 0.32);
  }

  .reel-markdown :global(p) {
    margin: 0 0 0.8rem;
    color: var(--primary);
  }

  .reel-markdown {
    color: var(--primary);
  }

  .reel-markdown :global(h1),
  .reel-markdown :global(h2),
  .reel-markdown :global(h3),
  .reel-markdown :global(h4) {
    color: var(--primary);
  }

  .reel-markdown :global(p:last-child) {
    margin-bottom: 0;
  }

  .reel-markdown :global(ul),
  .reel-markdown :global(ol) {
    margin: 0.4rem 0 0.8rem 1.2rem;
    padding: 0;
    color: var(--primary);
  }

  .reel-markdown :global(li) {
    margin-bottom: 0.35rem;
    color: var(--primary);
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
