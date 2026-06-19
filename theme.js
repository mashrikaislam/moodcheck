function applyMode(mode) {
  const body = document.body;
  const icon = document.getElementById("mode-icon");
  const text = document.getElementById("mode-text");

  if (mode === "day") {
    body.classList.add("day-mode");
    if (icon) icon.textContent = "☀️";
    if (text) text.textContent = "Daytime mode";
  } else {
    body.classList.remove("day-mode");
    if (icon) icon.textContent = "🌙";
    if (text) text.textContent = "Late night mode";
  }
  localStorage.setItem("vibecheck-mode", mode);
}

function toggleMode() {
  const current = localStorage.getItem("vibecheck-mode") || "night";
  applyMode(current === "night" ? "day" : "night");
}

(function() {
  const saved = localStorage.getItem("vibecheck-mode") || "night";
  applyMode(saved);
})();