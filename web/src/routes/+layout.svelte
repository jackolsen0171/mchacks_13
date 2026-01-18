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
  <title>Bloom Scroll</title>
</svelte:head>

<div class="app-shell">
  <main class="app-main">
    {@render children()}
  </main>

  <nav class="bottom-nav" aria-label="Primary">
    <a class={`nav-item ${isActive("/") ? "is-active" : ""}`} href="/" aria-current={isActive("/") ? "page" : undefined}>
      <span class="icon-chip">D</span>
      <span>Dashboard</span>
    </a>
    <a class={`nav-item ${isActive("/upload") ? "is-active" : ""}`} href="/upload" aria-current={isActive("/upload") ? "page" : undefined}>
      <span class="icon-chip">+</span>
      <span>Upload</span>
    </a>
    <a class={`nav-item ${isActive("/study") ? "is-active" : ""}`} href="/study" aria-current={isActive("/study") ? "page" : undefined}>
      <span class="icon-chip">S</span>
      <span>Study</span>
    </a>
  </nav>
</div>
