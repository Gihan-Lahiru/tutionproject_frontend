Frontend static storage

Place your files in these folders and update JSON files:
- /public/storage/notes.json
- /public/storage/papers.json
- /public/storage/videos.json
- /public/storage/notes/
- /public/storage/papers/
- /public/storage/videos/
- /public/storage/images/

Notes:
- Paths in JSON should start with /storage/... (example: /storage/notes/my-note.pdf)
- These are static files bundled with frontend; runtime uploads from browser cannot write here automatically.
