from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from concurrent.futures import ThreadPoolExecutor
import requests
import sqlite3
import json
import base64
import threading
import os

from datetime import datetime

app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:5000", "https://verse-vqsk.onrender.com"])
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
LASTFM_API_KEY = os.environ.get("LASTFM_API_KEY", "")

CURATED_BOOKS = [
    {"title": "Once Upon a Broken Heart", "author": "Stephanie Garber", "tags": ["romantic", "dreamy", "magical", "whimsical", "longing", "fantasy", "bittersweet"]},
    {"title": "Gone Girl", "author": "Gillian Flynn", "tags": ["dark", "twisted", "psychological", "suspense", "tense", "mysterious", "unsettling"]},
    {"title": "Six of Crows", "author": "Leigh Bardugo", "tags": ["adventure", "heist", "dark", "friendship", "bold", "clever", "exciting"]},
    {"title": "Fourth Wing", "author": "Rebecca Yarros", "tags": ["hopeful", "epic", "romantic", "fantasy", "passionate", "intense", "thrilling"]},
    {"title": "Heartless", "author": "Marissa Meyer", "tags": ["cozy", "whimsical", "romantic", "fantasy", "bittersweet", "enchanting", "warm"]},
    {"title": "A Court of Thorns and Roses", "author": "Sarah J. Maas", "tags": ["romantic", "dark", "fantasy", "passionate", "intense", "sensual", "longing"]},
    {"title": "The Secret History", "author": "Donna Tartt", "tags": ["dark", "mysterious", "psychological", "literary", "unsettling", "intellectual", "tense"]},
    {"title": "The Night Circus", "author": "Erin Morgenstern", "tags": ["dreamy", "magical", "romantic", "whimsical", "enchanting", "nostalgic", "wistful"]},
    {"title": "The Young Elites", "author": "Marie Lu", "tags": ["dark", "coming-of-age", "powerful", "revenge", "intense", "lonely", "misunderstood"]},
    {"title": "A Darker Shade of Magic", "author": "V.E. Schwab", "tags": ["adventure", "magical", "epic", "fantasy", "bold", "exciting", "mysterious"]},
    {"title": "Crooked Kingdom", "author": "Leigh Bardugo", "tags": ["adventure", "dark", "friendship", "heist", "clever", "intense", "hopeful"]},
    {"title": "Normal People", "author": "Sally Rooney", "tags": ["romantic", "melancholic", "longing", "intimate", "sentimental", "bittersweet", "tender"]},
    {"title": "The Perks of Being a Wallflower", "author": "Stephen Chbosky", "tags": ["coming-of-age", "melancholic", "hopeful", "lonely", "tender", "heartbroken", "searching"]},
    {"title": "The Cruel Prince", "author": "Holly Black", "tags": ["dark", "romantic", "fantasy", "intense", "enemies-to-lovers", "fae", "thrilling"]},
    {"title": "An Ember in the Ashes", "author": "Sabaa Tahir", "tags": ["epic", "dark", "romantic", "adventure", "intense", "hopeful", "passionate"]},
    {"title": "Legendborn", "author": "Tracy Deonn", "tags": ["magical", "adventure", "coming-of-age", "mysterious", "hopeful", "bold", "exciting"]},
    {"title": "The Gilded Wolves", "author": "Roshani Chokshi", "tags": ["adventure", "heist", "dark", "clever", "exciting", "mysterious", "bold"]},
    {"title": "Caraval", "author": "Stephanie Garber", "tags": ["dreamy", "magical", "mysterious", "whimsical", "enchanting", "adventurous", "bittersweet"]},
    {"title": "They Both Die at the End", "author": "Adam Silvera", "tags": ["heartbroken", "tender", "melancholic", "bittersweet", "hopeful", "emotional", "sentimental"]},
]

CURATED_SONGS = [
    {"song": "Let It Happen - Tame Impala", "tags": ["dreamy", "romantic", "whimsical", "longing", "searching", "wistful", "nostalgic"]},
    {"song": "Do I Wanna Know - Arctic Monkeys", "tags": ["dark", "longing", "mysterious", "tense", "restless", "intense", "brooding"]},
    {"song": "God is a Woman - Ariana Grande", "tags": ["powerful", "hopeful", "passionate", "confident", "bold", "intense", "empowered"]},
    {"song": "Cleanest Love - Wallows", "tags": ["cozy", "romantic", "warm", "content", "tender", "happy", "sweet"]},
    {"song": "Just for Me - PinkPantheress", "tags": ["dreamy", "romantic", "longing", "bittersweet", "tender", "soft", "intimate"]},
    {"song": "American Dirt - Current Joys", "tags": ["melancholic", "dark", "lonely", "searching", "lost", "hopeless", "wandering"]},
    {"song": "EARFQUAKE - Tyler the Creator", "tags": ["adventure", "fun", "carefree", "energetic", "bold", "exciting", "playful"]},
    {"song": "Little Things - One Direction", "tags": ["heartbroken", "tender", "sentimental", "soft", "longing", "bittersweet", "romantic"]},
    {"song": "telepatia - Kali Uchis", "tags": ["romantic", "dreamy", "sensual", "bittersweet", "intimate", "longing", "passionate"]},
    {"song": "Need to Know - Doja Cat", "tags": ["fun", "carefree", "confident", "playful", "bold", "flirty", "energetic"]},
    {"song": "Last Nite - The Strokes", "tags": ["melancholic", "indie", "restless", "longing", "bittersweet", "nostalgic", "wistful"]},
    {"song": "The Less I Know The Better - Tame Impala", "tags": ["heartbroken", "dreamy", "bittersweet", "longing", "melancholic", "wistful", "jealous"]},
    {"song": "Something About Us - Daft Punk", "tags": ["romantic", "dreamy", "tender", "cozy", "intimate", "warm", "soft"]},
    {"song": "Feels Like Summer - Childish Gambino", "tags": ["hopeful", "warm", "nostalgic", "reflective", "melancholic", "bittersweet", "content"]},
    {"song": "Motion Sickness - Phoebe Bridgers", "tags": ["heartbroken", "melancholic", "bitter", "searching", "lost", "indie", "emotional"]},
    {"song": "Borderline - Tame Impala", "tags": ["hopeful", "dreamy", "searching", "longing", "bittersweet", "wistful", "indie"]},
    {"song": "Someone Great - LCD Soundsystem", "tags": ["melancholic", "heartbroken", "lost", "lonely", "grieving", "nostalgic", "tender"]},
]


def init_db():
    conn = sqlite3.connect("vibecheck.db")
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS recommendations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mood TEXT, title TEXT, author TEXT, why TEXT,
            first_line TEXT, cover_url TEXT, open_library_url TEXT,
            song TEXT, song_reason TEXT, date TEXT
        )
    ''')
    conn.commit()
    conn.close()

def groq_call(prompt):
    response = requests.post(GROQ_URL, headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROQ_API_KEY}"
    }, json={"model": MODEL, "messages": [{"role": "user", "content": prompt}]})
    return response.json()["choices"][0]["message"]["content"].strip()

def get_book_cover(title, author):
    try:
        query = requests.utils.quote(f"{title} {author}")
        response = requests.get(f"https://openlibrary.org/search.json?q={query}&limit=1")
        data = response.json()
        if data.get("docs"):
            book = data["docs"][0]
            cover_id = book.get("cover_i")
            ol_key = book.get("key")
            return {
                "coverUrl": f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg" if cover_id else None,
                "openLibraryUrl": f"https://openlibrary.org{ol_key}" if ol_key else None
            }
    except:
        pass
    return {"coverUrl": None, "openLibraryUrl": None}

def get_album_art(song_query):
    try:
        parts = song_query.split(" - ")
        track = parts[0].strip()
        artist = parts[1].strip() if len(parts) > 1 else ""
        response = requests.get("http://ws.audioscrobbler.com/2.0/", params={
            "method": "track.search", "track": track, "artist": artist,
            "api_key": LASTFM_API_KEY, "format": "json", "limit": 1
        })
        data = response.json()
        matches = data.get("results", {}).get("trackmatches", {}).get("track", [])
        if matches:
            track_info = requests.get("http://ws.audioscrobbler.com/2.0/", params={
                "method": "track.getInfo", "track": matches[0]["name"],
                "artist": matches[0]["artist"], "api_key": LASTFM_API_KEY, "format": "json"
            }).json()
            album = track_info.get("track", {}).get("album", {})
            images = album.get("image", [])
            art_url = next((img["#text"] for img in reversed(images) if img["#text"]), None)
            return {"albumArt": art_url, "spotifyUrl": matches[0].get("url", "")}
    except Exception as e:
        print("Last.fm error:", e)
    return {"albumArt": None, "spotifyUrl": ""}

@app.route("/recommend", methods=["POST"])
def recommend():
    mood = request.json.get("mood", "")
    if not mood.strip():
        return jsonify({"error": "No mood provided"}), 400

    def fetch_tags():
        return groq_call(f'''Extract 3-5 emotional/thematic tags from this mood description: "{mood}"
Return ONLY a JSON array of short lowercase tags. Example: ["melancholic", "hopeful", "coming-of-age"]
No explanation, no markdown, just the array.''')

    with ThreadPoolExecutor() as executor:
        tag_future = executor.submit(fetch_tags)
        tag_text = tag_future.result()

    try:
        mood_tags = json.loads(tag_text)
    except:
        mood_tags = ["fiction"]

    # Score curated books with fuzzy matching
    def score_curated(item):
        score = 0
        for mood_tag in mood_tags:
            for curated_tag in item["tags"]:
                if mood_tag in curated_tag or curated_tag in mood_tag:
                    score += 1
        return score

    curated_book_scores = [(b, score_curated(b)) for b in CURATED_BOOKS]
    best_curated_book = max(curated_book_scores, key=lambda x: x[1])

    # Query Open Library
    def fetch_books():
        try:
            tag_query = "+".join(requests.utils.quote(t) for t in mood_tags[:2])
            r = requests.get(f"https://openlibrary.org/search.json?subject={tag_query}&limit=30&language=eng")
            return r.json().get("docs", [])
        except:
            return []

    docs = fetch_books()

    def score_ol_book(book):
        subjects = [s.lower() for s in book.get("subject", [])]
        return sum(1 for tag in mood_tags if any(tag in s for s in subjects))

    scored_ol = sorted(docs, key=score_ol_book, reverse=True)
    best_ol_score = score_ol_book(scored_ol[0]) if scored_ol else 0

    curated_score = best_curated_book[1]
    is_curated_pick = curated_score > 0 and curated_score >= best_ol_score

    if is_curated_pick:
        chosen = best_curated_book[0]
        context_book = f"Title: {chosen['title']}, Author: {chosen['author']}"
    else:
        top_ol = scored_ol[0] if scored_ol else None
        context_book = f"Title: {top_ol['title']}, Author: {(top_ol.get('author_name') or ['Unknown'])[0]}" if top_ol else "any emotionally fitting book"

    # Pick curated song
    curated_song_scores = [(s, score_curated(s)) for s in CURATED_SONGS]
    best_curated_song = max(curated_song_scores, key=lambda x: x[1])
    use_curated_song = best_curated_song[1] > 0
    song_instruction = f"Use this specific song: {best_curated_song[0]['song']}" if use_curated_song else "suggest a fitting song"

    response_text = groq_call(f'''You are a deeply empathetic book recommender.
The user says: "{mood}"

We have matched them with this book: {context_book}

{song_instruction}

Reply in this exact format:

TITLE: [use the exact title provided above]
AUTHOR: [use the exact author provided above]
WHY: [2-3 sentences on why this book fits their mood specifically]
FIRST LINE: [one compelling sentence to pull them in]
SONG: [song title] - [artist name]
SONG REASON: [one sentence on why this song fits the mood]''')

    result = {"mood_tags": mood_tags, "curatedPick": is_curated_pick}
    for line in response_text.split("\n"):
        if line.startswith("TITLE:"): result["title"] = line.replace("TITLE:", "").strip()
        elif line.startswith("AUTHOR:"): result["author"] = line.replace("AUTHOR:", "").strip()
        elif line.startswith("WHY:"): result["why"] = line.replace("WHY:", "").strip()
        elif line.startswith("FIRST LINE:"): result["firstLine"] = line.replace("FIRST LINE:", "").strip()
        elif line.startswith("SONG:"): result["song"] = line.replace("SONG:", "").strip()
        elif line.startswith("SONG REASON:"): result["songReason"] = line.replace("SONG REASON:", "").strip()

    album_data = get_album_art(result.get("song", ""))
    result["albumArt"] = album_data["albumArt"]
    result["spotifyUrl"] = album_data["spotifyUrl"]

    cover_data = get_book_cover(result.get("title", ""), result.get("author", ""))
    result["coverUrl"] = cover_data["coverUrl"]
    result["openLibraryUrl"] = cover_data["openLibraryUrl"]

    conn = sqlite3.connect("vibecheck.db")
    c = conn.cursor()
    c.execute('''INSERT INTO recommendations
        (mood, title, author, why, first_line, cover_url, open_library_url, song, song_reason, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (mood, result.get("title"), result.get("author"), result.get("why"),
         result.get("firstLine"), result.get("coverUrl"), result.get("openLibraryUrl"),
         result.get("song"), result.get("songReason"), datetime.now().strftime("%Y-%m-%d")))
    conn.commit()
    conn.close()

    return jsonify(result)


_picks_cache = None

def warm_picks_cache():
    global _picks_cache
    enriched = []
    for book in CURATED_BOOKS:
        try:
            query = requests.utils.quote(f"{book['title']}")
            r = requests.get(f"https://openlibrary.org/search.json?q={query}&limit=1&fields=cover_i,key")
            doc = r.json().get("docs", [{}])[0]
            cover_id = doc.get("cover_i")
            ol_key = doc.get("key")
            enriched.append({
                **book,
                "coverUrl": f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg" if cover_id else None,
                "olUrl": f"https://openlibrary.org{ol_key}" if ol_key else None
            })
        except:
            enriched.append({**book, "coverUrl": None, "olUrl": None})
    _picks_cache = enriched
    print("Picks cache warmed!")

@app.route("/picks", methods=["GET"])
def get_picks():
    if _picks_cache:
        return jsonify(_picks_cache)
    return jsonify([{"title": b["title"], "author": b["author"], "tags": b["tags"], "coverUrl": None, "olUrl": None} for b in CURATED_BOOKS])

@app.route("/history", methods=["GET"])
def get_history():
    conn = sqlite3.connect("vibecheck.db")
    c = conn.cursor()
    c.execute("SELECT * FROM recommendations ORDER BY id DESC LIMIT 10")
    rows = c.fetchall()
    conn.close()
    keys = ["id", "mood", "title", "author", "why", "first_line", "cover_url", "open_library_url", "song", "song_reason", "date"]
    return jsonify([dict(zip(keys, row)) for row in rows])

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(".", filename)


threading.Thread(target=warm_picks_cache, daemon=True).start()


if __name__ == "__main__":
    init_db()
    app.run(debug=False, port=int(os.environ.get("PORT", 5000)))

    