# Math 20-1 Teaching

Math 20-1 lessons built to be projected from an iPad and written on with an Apple Pencil.

**Site:** https://rmcathcart-lab.github.io/math20-1/lessons/ — part of the combined `math20-1` repo (practice site at the root, lesson pages here). GitHub Pages builds from the `gh-pages` branch: push `main` to both `main` and `gh-pages` (see the root README).

## What's on a lesson page

- **Ink everywhere.** Every card is a writing surface: the Apple Pencil writes, a finger scrolls, a Pencil tap on a button presses it. Pen (4 colours, 3 sizes, pressure-sensitive), highlighter, stroke eraser, laser pointer (fades), hand (Pencil scrolls). Undo/redo, or a two-finger tap to undo. Ink is saved on the device per lesson; clear it from the ••• menu.
- **Explainers** step through with Next / Back / Play, at the teacher's pace. Most let you pick the number (including the example's number, to check the work after doing it by hand).
- **Examples** have dotted work space for each part, an Answer button per part, and "+ More space".
- **Board** opens a blank grid page; **Calc** opens the TI-84 Plus CE–style graphing calculator from the Math 20-1 Practice site (`../js/calc84.js`). "Show me" buttons press the keys on the calculator one at a time, with the TI-84 key names underneath.

## Live notes for students

With `inkApi` set in `js/config.js` (the /exec URL of `backend/Code.gs`, an Apps Script bound to a Google Sheet). Not deployed
yet: `inkApi` is empty, so for now ink is saved on each device only.

- The teacher signs in once per device (••• → Teacher → teacher key; `setup()` in the script prints it), then picks a class in the ••• menu. The page becomes `?class=B` and every stroke, erase, undo and "+ More space" is sent to that class's tab in the sheet. Unsent changes wait on the device until they're saved.
- Students open the class link (or scan the QR from ••• → Show the class link as a QR code). Their page is view only and checks for new ink every few seconds. Each class keeps its own notes; clearing the ink clears only that class.
- The lesson is laid out 1080 px wide and scaled to fit the screen, so ink lines up with the content on every device.
- Testing locally: `node backend/mock_server.js 8790` (teacher key TEST01) and in the browser console `localStorage.setItem('ink:api', JSON.stringify('http://localhost:8790/'))`.

## The lessons home (iPad home-screen app)

`index.html` is the lessons home, https://rmcathcart-lab.github.io/math20-1/lessons/ — open it in Safari on the iPad, then
Share → **Add to Home Screen** ("20-1 Lessons"). Each course has its own app and icon.

- **What it shows:** a **Continue** button for the last lesson opened on this device, the course intro lesson (if the
  course has one), then every unit with its switched-on lessons (`HW.TEACHING.lessons` in `../js/catalog.js`) as big
  rows, a Units bar to jump to a unit, and units with no lessons yet listed at the end as coming soon. Quiet links: the
  practice site, and the Teacher Ledger on the teacher's device only.
- **Teacher only** (the device is signed in with the teacher key, `ink:teacher`, or to the ledger, `hw:tkey`): "Open
  lessons for Block A / B / C / D / No class" — the lesson links carry `?class=B` so the notes go to that class. It
  remembers the last class picked here or opened on a lesson page. Students never see it.
- **Fast:** inline CSS and script; the only scripts are `../js/catalog.js` (and `../js/ns.js`, the storage namespace,
  where the repo has one). No ledger, backend, MathLive or calculator.
- **Last lesson:** `boot()` in `js/ui.js` records it (`lessons:last`, and `lessons:class` for the teacher) — nothing to add
  to a lesson page. The toolbar's home button goes to this page for the teacher and inside the home-screen app (students
  in Safari still go to their assignments).
- **Web app:** `manifest.webmanifest` (`start_url` and `scope` = this folder, standalone), the `apple-mobile-web-app-*`
  metas here and on every lesson page. Lessons opened from the home stay inside the app; the practice site and ledger
  open in Safari.
- **Offline / instant:** `sw.js` serves the home, the catalog and the icons from the device first and refreshes them in
  the background (the home reloads itself, or shows "Lessons updated · tap to refresh", when a lesson is switched on).
  Lesson pages stay network first.
- **Icon:** `assets/icon.svg` (a board on an easel in the course colour, the course mark, an amber pen stroke and a
  pencil — different from the practice site's plain mark and the ledger's dark one), `icon-180/192/512.png`,
  `favicon.svg`, `favicon-32.png`; rebuild them with `python3 lessons/dev/make_icons.py`.
- Checked by `tests/lessons_smoke.py` (every switched-on lesson listed once, no broken links, no heavy scripts).

## Code map

- `index.html` — the lessons home (see above).
- `js/ink.js` — the Pencil ink engine (SVG layer per `[data-ink]` element, strokes stored in a 1000-unit-wide coordinate system so they scale with the page). Uses [perfect-freehand](https://github.com/steveruizok/perfect-freehand) (MIT) for pressure strokes.
- `js/share.js`, `js/config.js`, `backend/Code.gs` — live sharing (see above).
- `js/ui.js` — toolbar, menu, board, calculator wiring and key-press demos (`data-keys="91 ÷ 7 ="`; tokens in `LESSON_BRIEF.md` and at the top of `../js/calc84.js`).
- `js/explain.js` — the step-through explainer framework (`Explainer`), the tap-to-split `FactorTree`, number helpers.
- `js/blocks.js` — the shared building blocks (graphs, number lines, tables, triangles, flowcharts, polls…; see `BLOCKS.md`, demo page `dev/blocks.html`).
- `js/lessons/uNlM.js` — each lesson's explainers (none yet).
- `css/calc.css` — the demo highlight styles; the calculator itself (with its own styles) is the practice site's `../js/calc84.js` (shared), as is KaTeX (`../assets/katex`). `../js/calc.js` (the old TI-30XIIS) is no longer loaded.
- `uN/lM/index.html` — the lesson pages (none yet; Units 1–2 are being built).

## Adding a lesson

See `LESSON_BRIEF.md` for the full checklist (and `BLOCKS.md`, `SCREEN_FIT.md`, `HISTORY_BOXES.md`).

1. Make `uN/lM/index.html` (copy the `<head>` and closing script block from a finished lesson; the Math 15 and Math 10C
   repos have models); every card that should take ink gets a unique `data-ink` id and a `data-section` name for the Jump menu.
   The hero kicker reads `Math 20-1 · Unit N <Unit Title> · Lesson M`.
2. Write `js/lessons/uNlM.js` with explainer definitions (`{ title, height, choices, intro, make(stage, value, ex) → steps }`) and mount them on `[data-explainer]` elements.
3. Call `boot({ key: 'uNlM', homeHref: '../../', title: 'N.M Short Title' })`.
4. Switch it on: add the id to `HW.TEACHING.lessons` in the root `js/catalog.js`. That one line puts it on the lessons
   home (`index.html`), and the practice site and Teacher Ledger link to it.
