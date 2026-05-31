const API_KEY = "placeholder";

let history = JSON.parse(localStorage.getItem("vibecheck-history") || "[]");

function saveToHistory(mood, title, author, why, firstLine, coverUrl, openLibraryUrl, song, songReason) {
  const entry = {
    mood,
    title,
    author,
    why,
    firstLine,
    coverUrl,
    openLibraryUrl,
    song,
    songReason,
    date: new Date().toLocaleDateString()
  };

  history.unshift(entry);
  history = history.slice(0, 5);

  localStorage.setItem("vibecheck-history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const historyDiv = document.getElementById("history");

  if (!historyDiv) return;

  if (history.length === 0) {
    historyDiv.innerHTML = "";
    return;
  }

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
      </div>
    `;
  });

  historyDiv.innerHTML = html;
}

function deleteEntry(index) {
  history.splice(index, 1);
  localStorage.setItem("vibecheck-history", JSON.stringify(history));
  renderHistory();
}

async function getBookCover(title, author) {
  const query = encodeURIComponent(`${title} ${author}`);
  const response = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=1`);
  const data = await response.json();

  if (data.docs && data.docs.length > 0) {
    const book = data.docs[0];
    const coverId = book.cover_i;
    const olKey = book.key;

    return {
      coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null,
      openLibraryUrl: olKey ? `https://openlibrary.org${olKey}` : null
    };
  }

  return {
    coverUrl: null,
    openLibraryUrl: null
  };
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function getRecommendation() {
  const moodInput = document.getElementById("mood");
  const resultDiv = document.getElementById("result");
  const buttonText = document.getElementById("btn-text");

  const mood = moodInput.value;

  if (!mood.trim()) return;

  resultDiv.innerHTML = "<p class='loading'>Finding your book and song...</p>";

  if (buttonText) buttonText.textContent = "Matching...";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `You are a deeply empathetic book recommender.
The user says: "${mood}"

First check: is this a genuine emotional description or just nonsense/random characters/a single letter? If it's not a real feeling or thought, respond with exactly the word INVALID and nothing else.

Otherwise recommend ONE real, well-known book that emotionally fits this feeling. Reply in this exact format:

TITLE: [book title]
AUTHOR: [author name]
WHY: [2-3 sentences on why this book fits their mood specifically]
FIRST LINE: [one compelling sentence to pull them in]
SONG: [song title] - [artist name]
SONG REASON: [one sentence on why this song fits the mood]`
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error("No recommendation returned.");
    }

    const text = data.choices[0].message.content;

    if (text.trim() === "INVALID") {
      resultDiv.innerHTML = `
        <p class="error-message">
          Tell me more about how you're feeling — a sentence or two works best.
        </p>
      `;
      return;
    }

    const lines = text.split("\n").filter(line => line.trim());

    let title = "";
    let author = "";
    let why = "";
    let firstLine = "";
    let song = "";
    let songReason = "";

    lines.forEach(line => {
      if (line.startsWith("TITLE:")) title = line.replace("TITLE:", "").trim();
      else if (line.startsWith("AUTHOR:")) author = line.replace("AUTHOR:", "").trim();
      else if (line.startsWith("WHY:")) why = line.replace("WHY:", "").trim();
      else if (line.startsWith("FIRST LINE:")) firstLine = line.replace("FIRST LINE:", "").trim();
      else if (line.startsWith("SONG:")) song = line.replace("SONG:", "").trim();
      else if (line.startsWith("SONG REASON:")) songReason = line.replace("SONG REASON:", "").trim();
    });

    resultDiv.innerHTML = "<p class='loading'>Finding the cover art...</p>";

    const { coverUrl, openLibraryUrl } = await getBookCover(title, author);

    const safeTitle = escapeHTML(title);
    const safeAuthor = escapeHTML(author);
    const safeWhy = escapeHTML(why);
    const safeFirstLine = escapeHTML(firstLine);
    const safeSong = escapeHTML(song);
    const safeSongReason = escapeHTML(songReason);

    const spotifyUrl = song
      ? `https://open.spotify.com/search/${encodeURIComponent(song)}`
      : "";

    const html = `
      <section class="matches-grid">
        <div class="match-card book-match">
          <div class="card-label">📖 Your Book Match</div>

          <div class="book-layout">
            ${
              coverUrl
                ? `<img src="${coverUrl}" alt="Book cover" class="cover" />`
                : `<div class="cover"></div>`
            }

            <div class="book-info">
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
                ${
                  openLibraryUrl
                    ? `<a href="${openLibraryUrl}" target="_blank" class="outline-btn">View Details</a>`
                    : ""
                }

                <button class="ghost-btn" type="button">Add to Want to Read ♡</button>
              </div>
            </div>
          </div>
        </div>

        <div class="match-card song-match">
          <div class="card-label">🎵 Your Song Match</div>

          <div class="song-layout">
            <div class="album-art">♪</div>

            <div class="song-info">
              <h2>${safeSong || "A matching song"}</h2>
              <p class="author">Matched to your book’s mood</p>

              <p class="song-reason">${safeSongReason}</p>

              <div class="fake-player">
                <button type="button">▶</button>
                <span>0:00</span>
                <div class="player-line"></div>
                <span>3:56</span>
              </div>

              ${
                song
                  ? `<a href="${spotifyUrl}" target="_blank" class="spotify-btn">Open in Spotify</a>`
                  : ""
              }
            </div>
          </div>
        </div>
      </section>
    `;

    resultDiv.innerHTML = html;

    saveToHistory(mood, title, author, why, firstLine, coverUrl, openLibraryUrl, song, songReason);
  } catch (err) {
    resultDiv.innerHTML = `
      <p class="error-message">
        Something went wrong. Check your API key and try again.
      </p>
    `;

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