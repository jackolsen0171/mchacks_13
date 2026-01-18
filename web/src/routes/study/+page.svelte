<script>
  const reels = [
    {
      id: 1,
      theme: "lumen",
      chip: "Integration Techniques",
      title: "Partial Fractions in Motion",
      body: "Break rational functions into sums before integrating. Focus on the setup and the coefficient matching pattern.",
      meta: "3 checkpoints · 8 min · Lecture 5",
    },
    {
      id: 2,
      theme: "tide",
      chip: "Series + Sequences",
      title: "Convergence Tests, Fast",
      body: "Decide between ratio, root, and comparison tests. Follow the decision map to identify convergence in under a minute.",
      meta: "4 checkpoints · 11 min · Problem set 7",
    },
    {
      id: 3,
      theme: "ember",
      chip: "Applications",
      title: "Arc Length and Surface Area",
      body: "Visualize the curve first, then map the formula. Keep the square root term clean and check the bounds twice.",
      meta: "2 checkpoints · 6 min · Lab 3",
    },
    {
      id: 4,
      theme: "lumen",
      chip: "Linear Algebra",
      title: "Eigenvectors in 5 Steps",
      body: "Identify the eigenvalues, solve the null space, and normalize the basis so the matrix stays tidy.",
      meta: "5 checkpoints · 9 min · Homework 2",
    },
    {
      id: 5,
      theme: "tide",
      chip: "Statistics",
      title: "Confidence Intervals Made Simple",
      body: "Pick the right distribution, compute the margin of error, and interpret the interval in plain language.",
      meta: "3 checkpoints · 7 min · Quiz prep",
    },
    {
      id: 6,
      theme: "ember",
      chip: "Physics",
      title: "Momentum and Impulse",
      body: "Sketch the collision, track the impulse, and line up the before/after momentum terms.",
      meta: "4 checkpoints · 10 min · Lab recap",
    },
    {
      id: 7,
      theme: "lumen",
      chip: "Chemistry",
      title: "Balancing Redox Reactions",
      body: "Split oxidation and reduction, balance charge with electrons, then balance atoms with water.",
      meta: "5 checkpoints · 12 min · Unit 4",
    },
    {
      id: 8,
      theme: "tide",
      chip: "Computer Science",
      title: "Big-O by Patterns",
      body: "Scan the loops, collapse the nested parts, and choose the tightest upper bound.",
      meta: "3 checkpoints · 6 min · Lecture 9",
    },
    {
      id: 9,
      theme: "ember",
      chip: "Economics",
      title: "Elasticity on Demand",
      body: "Use the midpoint method, compare absolute values, and interpret what the curve suggests.",
      meta: "4 checkpoints · 8 min · Problem set 5",
    },
    {
      id: 10,
      theme: "lumen",
      chip: "Biology",
      title: "Cell Signaling Cascades",
      body: "Track the receptors, note the secondary messengers, and connect each signal to its response.",
      meta: "5 checkpoints · 9 min · Chapter 12",
    },
    {
      id: 11,
      theme: "tide",
      chip: "Data Structures",
      title: "Binary Trees in Practice",
      body: "Traverse preorder, inorder, and postorder, then compare what each ordering reveals.",
      meta: "4 checkpoints · 10 min · Lab 6",
    },
    {
      id: 12,
      theme: "ember",
      chip: "Psychology",
      title: "Memory Systems Breakdown",
      body: "Contrast working memory, short-term storage, and consolidation with everyday examples.",
      meta: "3 checkpoints · 7 min · Reading 3",
    },
    {
      id: 13,
      theme: "lumen",
      chip: "History",
      title: "Causes of the Great Depression",
      body: "Layer the market crash with policy shifts, global trade, and consumer confidence.",
      meta: "4 checkpoints · 8 min · Lecture 11",
    },
    {
      id: 14,
      theme: "tide",
      chip: "Philosophy",
      title: "Ethical Frameworks at a Glance",
      body: "Compare duty-based reasoning, utilitarian outcomes, and virtue-based perspectives.",
      meta: "3 checkpoints · 6 min · Seminar 2",
    },
    {
      id: 15,
      theme: "ember",
      chip: "Literature",
      title: "Close Reading Strategy",
      body: "Anchor on diction, track the imagery, and link the passage to the larger theme.",
      meta: "2 checkpoints · 5 min · Workshop",
    },
    {
      id: 16,
      theme: "lumen",
      chip: "Engineering",
      title: "Statics Free-Body Diagram",
      body: "Isolate the forces, label the axes, and keep moments consistent with the sign convention.",
      meta: "4 checkpoints · 9 min · Studio 3",
    },
    {
      id: 17,
      theme: "tide",
      chip: "Sociology",
      title: "Social Stratification Essentials",
      body: "Define class, status, and power, then trace how each affects life outcomes.",
      meta: "3 checkpoints · 7 min · Lecture 6",
    },
    {
      id: 18,
      theme: "ember",
      chip: "Art History",
      title: "Renaissance Composition",
      body: "Spot the balance, track the perspective lines, and connect the symbols to the patron.",
      meta: "3 checkpoints · 6 min · Gallery notes",
    },
    {
      id: 19,
      theme: "lumen",
      chip: "International Law",
      title: "Treaty Interpretation Basics",
      body: "Read the text, apply context, and confirm with subsequent practice.",
      meta: "4 checkpoints · 8 min · Case brief",
    },
    {
      id: 20,
      theme: "tide",
      chip: "Marketing",
      title: "Positioning in One Page",
      body: "Clarify the audience, define the category, and anchor on the differentiator.",
      meta: "3 checkpoints · 5 min · Workshop 1",
    },
  ];
</script>

<section class="reels-shell">
  <div class="reels-viewport" aria-label="Study topic reels">
    {#each reels as reel, index (reel.id)}
      <article class={`reel-card reel-card--${reel.theme}`}>
        <div class="reel-rail"></div>
        <div class="reel-content">
          <span class="reel-chip">{reel.chip}</span>
          <h2>{reel.title}</h2>
          <p>{reel.body}</p>
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
