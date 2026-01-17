<script>
  import "./layout.css";
  import { page } from "$app/stores";

  let { children } = $props();

  const isActive = (path) => {
    const current = $page.url.pathname;
    if (path === "/") {
      return current === "/";
    }
    return current.startsWith(path);
  };
</script>

<svelte:head>
  <title>Adaptive Study</title>
</svelte:head>

<div class="app-shell">
  <header class="app-header">
    <div class="app-title">Adaptive Study</div>
    <button class="help-chip" type="button">How it works</button>
  </header>

  <main class="app-main">
    {@render children()}
  </main>

  <nav class="bottom-nav" aria-label="Primary">
    <a class={`nav-item ${isActive("/") ? "is-active" : ""}`} href="/" aria-current={isActive("/") ? "page" : undefined}>
      <span class="icon-chip">D</span>
      <span>Dashboard</span>
    </a>
    <a class={`nav-item ${isActive("/class") ? "is-active" : ""}`} href="/class" aria-current={isActive("/class") ? "page" : undefined}>
      <span class="icon-chip">C</span>
      <span>Classes</span>
    </a>
    <a class={`nav-item ${isActive("/study") ? "is-active" : ""}`} href="/study" aria-current={isActive("/study") ? "page" : undefined}>
      <span class="icon-chip">S</span>
      <span>Study</span>
    </a>
    <a class={`nav-item ${isActive("/upload") ? "is-active" : ""}`} href="/upload" aria-current={isActive("/upload") ? "page" : undefined}>
      <span class="icon-chip">U</span>
      <span>Upload</span>
    </a>
  </nav>
</div>
