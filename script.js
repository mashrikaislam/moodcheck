let history = JSON.parse(localStorage.getItem("vibecheck-history") || "[]");

function saveToHistory(mood, title, author, why, firstLine, coverUrl, openLibraryUrl, song, songReason) {
  const entry = { mood, title, author, why, firstLine, coverUrl, openLibraryUrl, song, songReason, date: new Date().toLocaleDateString() };
  history.unshift(entry);
  history = history.slice(0, 5);
  localStorage.setItem("vibecheck-history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const historyDiv = document.getElementById("history");
  if (!historyDiv) return;
  if (history.length === 0) { historyDiv.innerHTML = ""; return; }
  let html = "";
  history.forEach((entry, index) => {
    html += `
      <div class="history-card">
        ${entry.coverUrl ? `<img src="${entry.coverUrl}" alt="cover" class="history-cover" />` : `<div class="history-cover"></div>`}
        <div class="history-info">
          <p class="history-mood">"${entry.mood}"</p>
          <h3>${entry.title}</h3>
          <p class="author">by ${entry.author}</p>
          <p class="history-date">${entry.date}</p>
          ${entry.openLibraryUrl ? `<a href="${entry.openLibraryUrl}" target="_blank" class="more-link">Learn more →</a>` : ""}
        </div>
        <button class="delete-btn" onclick="deleteEntry(${index})" type="button">✕</button>
      </div>`;
  });
  historyDiv.innerHTML = html;
}

function deleteEntry(index) {
  history.splice(index, 1);
  localStorage.setItem("vibecheck-history", JSON.stringify(history));
  renderHistory();
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

async function getRecommendation() {
  const moodInput = document.getElementById("mood");
  const resultDiv = document.getElementById("result");
  const buttonText = document.getElementById("btn-text");
  const mood = moodInput.value;

  if (!mood.trim()) return;

  resultDiv.innerHTML = "<p class='loading'>Extracting your mood...</p>";
  if (buttonText) buttonText.textContent = "Matching...";

  try {
    const backendResponse = await fetch("http://127.0.0.1:5000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood })
    });

    const result = await backendResponse.json();
    console.log("Mood tags:", result.mood_tags);
console.log("Full result:", result); // added

    const title = result.title || "";
    const author = result.author || "";
    const why = result.why || "";
    const firstLine = result.firstLine || "";
    const song = result.song || "";
    const songReason = result.songReason || "";
    const coverUrl = result.coverUrl || null;
    const openLibraryUrl = result.openLibraryUrl || null;

    const safeTitle = escapeHTML(title);
    const safeAuthor = escapeHTML(author);
    const safeWhy = escapeHTML(why);
    const safeFirstLine = escapeHTML(firstLine);
    const safeSong = escapeHTML(song);
    const safeSongReason = escapeHTML(songReason);
    const spotifyUrl = song ? `https://open.spotify.com/search/${encodeURIComponent(song)}` : "";

    resultDiv.innerHTML = `
      <section class="matches-grid">
        <div class="match-card book-match">
          <div class="card-label">📖 Your Book Match</div>
          <div class="book-layout">
            ${coverUrl ? `<img src="${coverUrl}" alt="Book cover" class="cover" />` : `<div class="cover"></div>`}
            <div class="book-info">
              ${result.curatedPick ? `<div class="curated-badge">✦ Author's Pick</div>` : ""}
              <h2>${safeTitle}</h2>
              <p class="author">${safeAuthor}</p>
              <div class="book-meta">
                <span>★★★★★</span>
                <span>Emotional fit</span>
                <span>Open Library</span>
              </div>
              <p class="why">${safeWhy}</p>
              <p class="firstline">"${safeFirstLine}"</p>
              <div class="card-actions">
                ${openLibraryUrl ? `<a href="${openLibraryUrl}" target="_blank" class="outline-btn">View Details</a>` : ""}
                <button class="ghost-btn" type="button">Add to Want to Read ♡</button>
              </div>
            </div>
          </div>
        </div>

        <div class="match-card song-match">
          <div class="card-label">🎵 Your Song Match</div>
          <div class="song-layout">
              ${result.albumArt ? `<img src="${result.albumArt}" alt="album art" class="album-art-img" />` : `<div class="album-art">♪</div>`}            <div class="song-info">
              <h2>${safeSong || "A matching song"}</h2>
              <p class="author">Matched to your mood</p>
              <p class="song-reason">${safeSongReason}</p>
              <div class="fake-player">
                <button type="button">▶</button>
                <span>0:00</span>
                <div class="player-line"></div>
                <span>3:56</span>
              </div>
              ${song ? `<a href="${spotifyUrl}" target="_blank" class="spotify-btn">Open in Spotify</a>` : ""}
            </div>
          </div>
        </div>
      </section>`;

    saveToHistory(mood, title, author, why, firstLine, coverUrl, openLibraryUrl, song, songReason);

  } catch (err) {
    resultDiv.innerHTML = `<p class="error-message">Something went wrong. Make sure the server is running.</p>`;
    console.error(err);
  } finally {
    if (buttonText) buttonText.textContent = "Get My Match";
  }
}

function setMood(text) {
  document.getElementById("mood").value = text;
  document.getElementById("mood").focus();
}

renderHistory();