Verse is a full-stack web application that recommends personalized books and songs based on a user's mood. Users describe how they're feeling in natural language, and Verse generates curated recommendations along with a personalized summary to help them discover their next read and listen.

Features
-Natural language mood input
-Personalized book recommendations
-Personalized song recommendations
-Recommendation summaries
-Recommendation history stored in a SQLite database
-Clean, responsive user interface

Tech Stack
  Frontend
  - HTML
  - CSS
  - JavaScript
  Backend
  - Python
  - Flask
  - SQLite

   APIs
  - Groq API (Llama 3.3)
  - Open Library API
  - Last.fm API
  - 
How It Works
Enter how you're feeling in your own words.
The application analyzes your input to identify key emotional themes.
Matching books are retrieved from the Open Library API.
Songs are recommended using the Last.fm API.
A personalized summary is generated, and the recommendation is saved to the application's history.


Project Structure
verse/
│── app.py
│── templates/
│── static/
│── database/
│── requirements.txt
│── README.md

Future Improvements
User accounts and saved favorites
Personalized recommendation preferences
Additional book and music data sources
Improved recommendation ranking
Dark mode

Live Demo
https://verse-vqsk.onrender.com/
Author

Created by Mashrika Islam.
