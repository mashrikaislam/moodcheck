const API_KEY = "placeholder";

// Load history from localStorage or start empty
let history = JSON.parse(localStorage.getItem("vibecheck-history") || "[]");

function saveToHistory(mood, title, author, why, firstLine, coverUrl, openLibraryUrl) {
  const entry = {
    mood,
    title,
    author,
    why,
    firstLine,
    coverUrl,
    openLibraryUrl,
    date: new Date().toLocaleDateString()
  };
  history.unshift(entry); // add to front
  localStorage.setItem("vibecheck-history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const historyDiv = document.getElementById("history");
  if (history.length === 0) {
    historyDiv.innerHTML = "";
    return;
  }

  let html = `<h2 class="history-title">📖 Your Reading History</h2>`;
  history.forEach((entry, index) => {
    html += `
      <div class="history-card">
        ${entry.coverUrl ? `<img src="${entry.coverUrl}" alt="cover" class="history-cover" />` : ""}
        <div class="history-info">
          <p class="history-mood">"${entry.mood}"</p>
          <h3>${entry.title}</h3>
          <p class="author">by ${entry.author}</p>
          <p class="history-date">${entry.date}</p>
          ${entry.openLibraryUrl ? `<a href="${entry.openLibraryUrl}" target="_blank" class="more-link">Learn more →</a>` : ""}
        </div>
        <button class="delete-btn" onclick="deleteEntry(${index})">✕</button>
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
  return { coverUrl: null, openLibraryUrl: null };
}

async function getRecommendation() {
  const mood = document.getElementById("mood").value;
  const resultDiv = document.getElementById("result");

  if (!mood.trim()) return;

    resultDiv.innerHTML = "<p class='loading'>Finding your book...</p>";
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: "user",
          content: `You are a deeply empathetic book recommender.
The user says: "${mood}"

First check: is this a genuine emotional description or just nonsense/random characters/a single letter? If it's not a real feeling or thought, respond with exactly the word INVALID and nothing else.

Otherwise recommend ONE real, well-known book that emotionally fits this feeling. Reply in this exact format:

TITLE: [book title]
AUTHOR: [author name]
WHY: [2-3 sentences on why this book fits their mood specifically]
FIRST LINE: [one compelling sentence to pull them in]`
        }]
      })
    });

    const data = await response.json();
    const text = data.choices[0].message.content;

    if (text.trim() === "INVALID") {
      resultDiv.innerHTML = "<p>Tell me more about how you're feeling — a sentence or two works best 😊</p>";
      return;
    }

    const lines = text.split("\n").filter(l => l.trim());
    let title = "", author = "", why = "", firstLine = "";
    lines.forEach(line => {
      if (line.startsWith("TITLE:")) title = line.replace("TITLE:", "").trim();
      else if (line.startsWith("AUTHOR:")) author = line.replace("AUTHOR:", "").trim();
      else if (line.startsWith("WHY:")) why = line.replace("WHY:", "").trim();
      else if (line.startsWith("FIRST LINE:")) firstLine = line.replace("FIRST LINE:", "").trim();
    });

    resultDiv.innerHTML = "<p class='loading'>Finding your book cover...</p>";
    const { coverUrl, openLibraryUrl } = await getBookCover(title, author);

    let html = '<div class="book-card">';
    if (coverUrl) html += `<img src="${coverUrl}" alt="Book cover" class="cover" />`;
    html += `<div class="book-info">`;
    html += `<h2>${title}</h2>`;
    html += `<p class="author">by ${author}</p>`;
    html += `<p class="why">${why}</p>`;
    html += `<p class="firstline">"${firstLine}"</p>`;
    if (openLibraryUrl) html += `<a href="${openLibraryUrl}" target="_blank" class="more-link">Learn more →</a>`;
    html += `</div></div>`;
    resultDiv.innerHTML = html;

    // Save to history
    saveToHistory(mood, title, author, why, firstLine, coverUrl, openLibraryUrl);

  } catch (err) {
    resultDiv.innerHTML = "<p>Something went wrong. Check your API key.</p>";
    console.error(err);
  }
}

// Render history on page load
renderHistory();

function setMood(text) {
  document.getElementById("mood").value = text;
  document.getElementById("mood").focus();
}