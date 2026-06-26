const PICKS = [
  { title: "Once Upon a Broken Heart", author: "Stephanie Garber", tags: ["romantic", "dreamy", "magical"], coverUrl: "oubh-cover.jpg", olUrl: "https://openlibrary.org/works/OL24364169W" },  { title: "Gone Girl", author: "Gillian Flynn", tags: ["dark", "twisted", "psychological"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780307588371-M.jpg", olUrl: "https://openlibrary.org/works/OL16804658W" },
  { title: "Six of Crows", author: "Leigh Bardugo", tags: ["adventure", "heist", "dark"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781250076960-M.jpg", olUrl: "https://openlibrary.org/works/OL17335509W" },
  { title: "Fourth Wing", author: "Rebecca Yarros", tags: ["hopeful", "epic", "romantic"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781649374042-M.jpg", olUrl: "https://openlibrary.org/works/OL27281706W" },
  { title: "Heartless", author: "Marissa Meyer", tags: ["cozy", "whimsical", "romantic"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781250044655-M.jpg", olUrl: "https://openlibrary.org/works/OL17929966W" },
  { title: "A Court of Thorns and Roses", author: "Sarah J. Maas", tags: ["romantic", "dark", "fantasy"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781619634442-M.jpg", olUrl: "https://openlibrary.org/works/OL17335528W" },
  { title: "The Secret History", author: "Donna Tartt", tags: ["dark", "mysterious", "psychological"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781400031702-M.jpg", olUrl: "https://openlibrary.org/works/OL45804W" },
  { title: "The Night Circus", author: "Erin Morgenstern", tags: ["dreamy", "magical", "romantic"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780307744432-M.jpg", olUrl: "https://openlibrary.org/works/OL16086747W" },
  { title: "The Young Elites", author: "Marie Lu", tags: ["dark", "coming-of-age", "powerful"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780399167836-M.jpg", olUrl: "https://openlibrary.org/works/OL17335527W" },
  { title: "A Darker Shade of Magic", author: "V.E. Schwab", tags: ["adventure", "magical", "epic"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780765376466-M.jpg", olUrl: "https://openlibrary.org/works/OL17335526W" },
  { title: "Crooked Kingdom", author: "Leigh Bardugo", tags: ["adventure", "dark", "clever"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781250076977-M.jpg", olUrl: "https://openlibrary.org/works/OL17335510W" },
  { title: "Normal People", author: "Sally Rooney", tags: ["romantic", "melancholic", "tender"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780571334650-M.jpg", olUrl: "https://openlibrary.org/works/OL17854850W" },
  { title: "The Perks of Being a Wallflower", author: "Stephen Chbosky", tags: ["coming-of-age", "melancholic", "hopeful"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781451696196-M.jpg", olUrl: "https://openlibrary.org/works/OL45803W" },
  { title: "The Cruel Prince", author: "Holly Black", tags: ["dark", "romantic", "fae"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780316310314-M.jpg", olUrl: "https://openlibrary.org/works/OL17854851W" },
  { title: "An Ember in the Ashes", author: "Sabaa Tahir", tags: ["epic", "dark", "romantic"], coverUrl: "ashes-cover.jpg", olUrl: "https://openlibrary.org/works/OL17335525W" },
  { title: "Legendborn", author: "Tracy Deonn", tags: ["magical", "adventure", "coming-of-age"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781534441613-M.jpg", olUrl: "https://openlibrary.org/works/OL21677178W" },
  { title: "The Gilded Wolves", author: "Roshani Chokshi", tags: ["adventure", "heist", "clever"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781250144553-M.jpg", olUrl: "https://openlibrary.org/works/OL17854852W" },
  { title: "Caraval", author: "Stephanie Garber", tags: ["dreamy", "magical", "mysterious"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781250095268-M.jpg", olUrl: "https://openlibrary.org/works/OL17335524W" },
  { title: "They Both Die at the End", author: "Adam Silvera", tags: ["heartbroken", "tender", "bittersweet"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780062457790-M.jpg", olUrl: "https://openlibrary.org/works/OL17335523W" },
  { title: "Sharp Objects", author: "Gillian Flynn", tags: ["dark", "psychological", "tense"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780307341556-M.jpg", olUrl: "https://openlibrary.org/works/OL16804657W" },
  { title: "The Silent Patient", author: "Alex Michaelides", tags: ["psychological", "mysterious", "tense"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781250301697-M.jpg", olUrl: "https://openlibrary.org/works/OL19717044W" },
  { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", tags: ["romantic", "dramatic", "bittersweet"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781501139239-M.jpg", olUrl: "https://openlibrary.org/works/OL17854855W" },
  { title: "The Midnight Library", author: "Matt Haig", tags: ["hopeful", "melancholic", "searching"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780525559474-M.jpg", olUrl: "https://openlibrary.org/works/OL20727473W" },
  { title: "Verity", author: "Colleen Hoover", tags: ["dark", "twisted", "psychological"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781538724736-M.jpg", olUrl: "https://openlibrary.org/works/OL21677179W" },
  { title: "The Girl on the Train", author: "Paula Hawkins", tags: ["mysterious", "tense", "psychological"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781594634024-M.jpg", olUrl: "https://openlibrary.org/works/OL17335521W" },
  { title: "Big Little Lies", author: "Liane Moriarty", tags: ["mysterious", "dark", "dramatic"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780399167065-M.jpg", olUrl: "https://openlibrary.org/works/OL17335520W" },
  { title: "A Little Life", author: "Hanya Yanagihara", tags: ["emotional", "heartbroken", "literary"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780385539258-M.jpg", olUrl: "https://openlibrary.org/works/OL17335519W" },
  { title: "Remarkably Bright Creatures", author: "Shelby Van Pelt", tags: ["hopeful", "warm", "tender"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780063204157-M.jpg", olUrl: "https://openlibrary.org/works/OL26530781W" },
  { title: "The Invisible Life of Addie LaRue", author: "V.E. Schwab", tags: ["magical", "melancholic", "longing"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780765387561-M.jpg", olUrl: "https://openlibrary.org/works/OL20652688W" },
  { title: "City of Bones", author: "Cassandra Clare", tags: ["adventure", "magical", "romantic"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781416914280-M.jpg", olUrl: "https://openlibrary.org/works/OL8284113W" },
  { title: "Children of Blood and Bone", author: "Tomi Adeyemi", tags: ["epic", "adventure", "hopeful"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781250170972-M.jpg", olUrl: "https://openlibrary.org/works/OL17854853W" },
  { title: "The Atlas Six", author: "Olivie Blake", tags: ["dark", "mysterious", "intellectual"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781250854513-M.jpg", olUrl: "https://openlibrary.org/works/OL25435658W" },
  { title: "Eleanor Oliphant is Completely Fine", author: "Gail Honeyman", tags: ["lonely", "hopeful", "healing"], coverUrl: "https://covers.openlibrary.org/b/isbn/9780735220683-M.jpg", olUrl: "https://openlibrary.org/works/OL17854854W" },
  { title: "The House in the Cerulean Sea", author: "TJ Klune", tags: ["cozy", "hopeful", "warm"], coverUrl: "https://covers.openlibrary.org/b/isbn/9781250217318-M.jpg", olUrl: "https://openlibrary.org/works/OL20727474W" },
];


function loadPicks() {
  const grid = document.getElementById("picks-grid");
  grid.innerHTML = PICKS.map(book => `
    <a href="${book.olUrl}" target="_blank" class="pick-card" style="text-decoration:none;">
      <img src="${book.coverUrl}" alt="${book.title}" class="pick-cover"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" />
      <div class="pick-cover" style="display:none;"></div>
      <div class="pick-info">
        <div class="pick-title">${book.title}</div>
        <div class="pick-author">by ${book.author}</div>
        <div class="pick-tags">
          ${book.tags.map(tag => `<span class="pick-tag">${tag}</span>`).join("")}
        </div>
      </div>
    </a>
  `).join("");
}

loadPicks();