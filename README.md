# Portfolio

My portfolio, built as a small pixel-art game: walk around my room, boot a retro
operating system, play mini-games on the console, or skip straight to the résumé.

- **Full Experience** – a top-down room you can walk around (arrow keys / WASD, click, or touch), with a cat that
  follows you, a lamp that changes the lighting, weather, hidden items and achievements
- **Art Diary** – my paintings, in a sketchbook on the drawing table (and on the desktop)
- **Cat World** – a secret scene. Ask a cat.
- **Operating System** – a desktop with draggable windows: about me, projects, terminal, paint
- **Video Game** – a memory-card menu with three mini-games and my hackathon projects as save files
- **Résumé** – a plain, printable page
- `classic.html` – the previous scrolling version of the site

## Run it locally

There is no build step and no dependencies, but the code uses ES modules, so it has to be
served over HTTP (opening `index.html` straight from disk will not work):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Any static host works as-is (GitHub Pages, Netlify, Vercel…).

## Editing content

Everything you can read on the site lives in **`app/content.js`**: profile, experience,
education, skills, projects, and every line of room dialog. Edit that one file and all four
modes update.

- Add a project: add an object to `projects`. Set `featured: true` to also show it on the console.
  Leave `image: null` to get a generated pixel-art cover.
- Add a painting: drop the file in `images/art/` and add a line to `art`.
- Hidden items live in `secrets` and achievements in `badges`.
- Change what an object in the room says: edit its entry in `dialog`.

## Project layout

```
index.html          page shell
classic.html        the old site (uses css/ and js/)
app/
  content.js        all text and links
  main.js           hash router (#/room, #/os, #/games, #/resume)
  scenes/           one file per screen
  os/               window manager + desktop apps
  games/            snake, stack match, bug squash
  art/              pixel art, drawn in code (sprites.js = my character)
  core/             DOM helpers, sound, music, preferences, progress, HUD
  styles/           CSS
```



