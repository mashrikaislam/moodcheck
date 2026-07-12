const categories = [
  { name: "Heartbroken", emoji: "💔", subject: "heartbreak+romance", desc: "For when you need to feel less alone" },
  { name: "Cozy & Comforting", emoji: "☕", subject: "contemporary+fiction", desc: "Warm, gentle, easy to sink into" },
  { name: "Adventure", emoji: "🧭", subject: "adventure+fiction", desc: "Big journeys, bigger stakes" },
  { name: "Romance", emoji: "♡", subject: "romance+adult", desc: "Swoony, dreamy, slow-burn" },
  { name: "Mystery", emoji: "🔍", subject: "mystery+thriller", desc: "Something to keep you guessing" },
  { name: "Coming of Age", emoji: "🌱", subject: "coming_of_age+young_adult", desc: "Growing up, figuring it out" },
  { name: "Dark & Twisty", emoji: "🖤", subject: "psychological+fiction", desc: "Unsettling in the best way" },
  { name: "Hopeful", emoji: "✨", subject: "inspirational+fiction", desc: "Something to lift you up" }
];

const grid = document.getElementById("category-grid");
const resultsDiv = document.getElementById("book-results");

function renderCategories() {
  grid.innerHTML = categories.map((cat, i) => `
    <div class="category-card" data-index="${i}" onclick="loadCategory(${i})">
      <span class="category-emoji">${cat.emoji}</span>
      <div class="category-name">${cat.name}</div>
      <div class="category-desc">${cat.desc}</div>
    </div>
  `).join("");
}

async function loadCategory(index) {
  const cat = categories[index];

  document.querySelectorAll(".category-card").forEach(c => c.classList.remove("active"));
  document.querySelector(`.category-card[data-index="${index}"]`).classList.add("active");

  resultsDiv.innerHTML = `<p class="discover-loading">Finding ${cat.name.toLowerCase()} books...</p>`;

  try {
    const response = await fetch(`https://openlibrary.org/search.json?subject=${cat.subject}&limit=30&language=eng`);
    const data = await response.json();

    const books = (data.docs || []).filter(b => {
      if (!b.cover_i) return false;
      const subjects = (b.subject || []).map(s => s.toLowerCase());
      const isChildrens = subjects.some(s =>
        s.includes("juvenile") ||
        s.includes("children") ||
        s.includes("picture book") ||
        s.includes("young reader")
      );
      return !isChildrens;
    }).slice(0, 10);

    if (books.length === 0) {
      resultsDiv.innerHTML = `<p class="discover-loading">No books found for this mood, try another one.</p>`;
      return;
    }

    resultsDiv.innerHTML = `
      <h2 class="results-heading">${cat.emoji} ${cat.name}</h2>
      <div class="book-grid">
        ${books.map(book => `
          <a href="https://openlibrary.org${book.key}" target="_blank" class="book-grid-card">
            <img class="book-grid-cover" src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}" />
            <div class="book-grid-title">${book.title}</div>
            <div class="book-grid-author">${(book.author_name || ["Unknown"])[0]}</div>
          </a>
        `).join("")}
      </div>
    `;
  } catch (err) {
    resultsDiv.innerHTML = `<p class="discover-loading">Something went wrong loading books.</p>`;
    console.error(err);
  }
}

renderCategories();