// First visit of a session: flag <html> so the entry loader plays once.
try {
  if (!sessionStorage.getItem("tab-intro")) {
    document.documentElement.setAttribute("data-intro", "");
    sessionStorage.setItem("tab-intro", "1");
  }
} catch {
  // storage blocked: no loader
}
