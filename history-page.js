async function loadHistory() {
  const list = document.getElementById("history-list");

  try {
    const response = await fetch("https://verse-vqsk.onrender.com/history");
    const entries = await response.json();

    if (entries.length === 0) {
      list.innerHTML = `<p style="color: var(--text-faint); text-align:center;">No recommendations yet — go get your first match!</p>`;
      return;
    }

    list.innerHTML = entries.map(entry => `
      <div class="history-entry">
        ${entry.cover_url
          ? `<img src="${entry.cover_url}" alt="${entry.title}" class="history-entry-cover" />`
          : `<div class="history-entry-cover"></div>`}
        <div class="history-entry-info">
          <p class="history-entry-mood">"${entry.mood}"</p>
          <div class="history-entry-title">${entry.title}</div>
          <div class="history-entry-author">by ${entry.author}</div>
          ${entry.song ? `<div class="history-entry-song">🎵 ${entry.song}</div>` : ""}
          <div class="history-entry-date">${entry.date}</div>
          ${entry.open_library_url
            ? `<a href="${entry.open_library_url}" target="_blank" class="history-entry-link">View book →</a>`
            : ""}
        </div>
      </div>
    `).join("");

  } catch (err) {
    list.innerHTML = `<p style="color: var(--text-faint)">Couldn't load history right now.</p>`;
    console.error(err);
  }
}

loadHistory();