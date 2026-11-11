# Math 20-1

Everything for Mr. Cathcart's Math 20-1, in one site: https://rmcathcart-lab.github.io/math20-1/

It is the Math 10C site's engine (https://github.com/rmcathcart-lab/math10c), by way of its twin the Math 15 site
(https://github.com/rmcathcart-lab/math15), with the Math 20-1 course: its own catalog (`js/catalog.js`, 8 units,
70 lessons, from the course plan), burgundy accent colour, bimetallic 3D outcome coins (`js/coins.js`, one per outcome; see Outcome coins below)
and its own Apps Script backends. Math 20-1 uses the Program of Studies outcome codes AN1–AN6, T1–T3 and RF1–RF11
(official wording in `js/outcomes.js`).

| Part | Where | Repo folder |
|---|---|---|
| **Practice** (students: homework with generated questions, sign-in, progress) | `/math20-1/` | root (`index.html`, `js/`, `assets/`) |
| **Lessons** (projected from the iPad with Apple Pencil ink; students view the class notes with `?class=B`) | `/math20-1/lessons/` | `lessons/` (see `lessons/README.md`, `lessons/LESSON_BRIEF.md`) |
| **Teacher dashboard** (Teacher Ledger) | `/math20-1/teacher/` | `teacher/` |

Each part with a server has its own Apps Script backend (`backend/Code.gs` = Teacher Ledger, `lessons/backend/Code.gs` =
Teaching Ink); their web-app URLs go in `js/config.js` and `lessons/js/config.js`. **Neither is deployed yet:** both URLs
are empty, so the practice site runs in practice mode (no sign-in; work is saved on the device) and lesson ink stays on
each device.

**Publishing:** GitHub Pages builds from the `gh-pages` branch, so push `main` to both: `git push origin main main:gh-pages`.

**Built so far:** nothing yet — Units 1–2 in progress. Every unit and lesson shows as "coming soon".

# Practice

Homework practice for every Math 20-1 lesson, built from the course booklets. Every question is a generator: it keeps the idea and difficulty of the booklet question and changes the numbers, so each student gets their own version (the same on every device) and a fresh one whenever they need it.

- **Students:** `index.html`. Sign in with the class code (or the class link/QR code), pick your name, make a 4-digit PIN.
- **Teacher:** `teacher/` (the Teacher Ledger). Needs the teacher key from the Apps Script project.

## How a question works

- Answers are checked as soon as the student presses **Check**.
- A recognised mistake (a missing factor pair, calling 161 prime, dividing by a non-prime on a ladder, …) gets a hint aimed at that mistake. A formatting slip (commas instead of ×, a repeated prime, a blank box) gets a nudge that doesn't use a try.
- After 3 wrong tries (2 for multiple choice) the answer and worked solution are shown, and the student finishes the question with a new version.
- Leaving the tab or window while a question is open gives that question new numbers and is logged for the teacher.
- Division ladders and factor trees are built step by step, and every step is checked.
- The on-screen calculator is a TI-84 Plus CE–style graphing calculator (`js/calc84.js`): the real key layout and order of operations, fractions (MATH ►Frac), seq( / sum(, Y=, graphs, TRACE, tables and CALC zero / minimum / maximum / intersect. A **TI-84 | Casio** switch in its head bar swaps in a Casio fx-9750GIII–style one (`js/calcfx.js`: natural display, MENU Run-Matrix / Graph / Table, SET UP, V-Window, Trace, Zoom, G-Solv ROOT / MAX / MIN / Y-ICEPT / INTSECT / Y-CAL / X-CAL, Σ(); the device remembers the choice on every page, and the lesson demos show that calculator's keys.

## Files

| Path | What it is |
|---|---|
| `js/ns.js` | **First script on every page.** Keeps this site's browser storage under an `m201/` prefix, because the other course sites (Math 10C, Math 15, …) share the same web address (otherwise the Teacher Ledgers sign each other out and lesson ink leaks between courses) |
| `js/courses.js` | Fallback course list for the switcher. The real list is `teaching/js/courses.js` (see Teaching Hub below) |
| `js/core.js` | Seeded random numbers, number theory, answer parsing, KaTeX helpers |
| `js/kit.js` | Shared checkers with error diagnoses, and the lesson registry |
| `js/lessons/uNlM.js`, `uNtest.js`, `js/exits/uN.js` | Each lesson's assignment questions plus the extra practice, each unit's test, and its exit slips (none yet) |
| `js/expr.js` | Reads typed answers (LaTeX or plain text): roots of any index, fractions, repeating decimals, π, variables |
| `js/kitx.js` | Checkers for radicals (mixed/entire), fractions, repeating decimals, rounding, ordering, tables; part builders `K.P.*` |
| `js/poly.js` | Exact polynomial algebra (`HW.poly`), the polynomial answer checker `K.poly` / `K.P.poly` (exact equality + expanded/simplified nudges + classic-error diagnoses), the `poly` keypad, algebra tiles (`HW.tiles`) and area models (`HW.areaModel`). Tests: `tests/poly_test.js` |
| `js/widgets.js`, `js/widgets2.js`, `js/steps.js` | Answer inputs: number, list (chips), math (MathLive, with keypads for radicals, fractions, repeating decimals, variables), multiple choice, select, prime/composite with a proof, pairs, ordering, tables, labelled boxes, division ladder, factor tree |
| `js/calc84.js` | The TI-84 Plus CE–style graphing calculator, and the one calculator window and façade for both models (`HW.Calc`: the head bar's TI-84 \| Casio switch, remembered on the device as `calc:model`; key tokens for lesson demos at the top). `js/calc.js` is the old TI-30XIIS one, kept but not loaded |
| `js/calcfx.js` | The Casio fx-9750GIII–style graphing calculator (128×64 LCD, natural display, MENU, SET UP, Graph, Table, G-Solv). `js/calc84.js` loads it from beside itself when it is chosen; it reuses the TI-84's maths, and turns the TI-84 demo tokens into Casio keys and captions. Tests: `tests/calcfx_test.js` |
| `js/app.js`, `js/ledger.js` | The student app, and syncing to the teacher's ledger |
| `js/catalog.js` | Units and lessons (a lesson is open once its lesson file exists), `HW.TEACHING` (lessons with a teaching page), `HW.OUTCOMES` |
| `js/outcomes.js` | The official Math 20-1 outcome wording (general and specific outcomes), shown when an outcome code is tapped |
| `js/coins.js`, `js/vendor/three/` | The outcome coins (`HW.Coins`, also `HW.Medals`/`HW.Badges`): one bimetallic coin per outcome (outline, enamel colour, struck symbol), seven mints; three.js r170 is vendored and loaded only when a coin is first shown. `js/badges.js` is the retired embroidered badges, kept but not loaded |
| `assets/notes/math20-1-unit-N-notes.pdf` | The lessons-only notes booklets behind **Printable Notes** (list each unit's page count in `NOTES_PAGES` in `js/app.js`; the button appears once one is listed) |
| `teacher/` | The teacher dashboard |
| `backend/Code.gs` | Google Apps Script backend (paste into the Apps Script project) |
| `tests/` | `node tests/gen_test.js [runs] [lessonId]` (every generator), `node tests/kitx_test.js` (the shared checkers), `node tests/mathlive_form_test.js` (answer keys typed the way the MathLive keyboard writes them), `node tests/calc84_test.js` (the TI-84), `node tests/calcfx_test.js` (the Casio, and every lesson's demo on both calculators: the same number on each), `node tests/calc_test.js` (the old TI-30XIIS), `node tests/calendar_test.js`; Playwright: `tests/smoke.py`, `tests/e2e.py` (against `backend/mock_server.js`), `tests/lessons_smoke.py`, `tests/coins_fit.py` (every coin's art fits; `--sheet <0-6>` draws a contact sheet), `tests/coins_home_test.py` (coins on the home page, in practice mode). This repo serves on **8831** (`python3 -m http.server 8831` from the root) with the mock on **8835** (`bash tests/restart_mock.sh`), so it can run beside the Math 15 servers (8821/8825). Tests that set storage before the page loads use the `m201/` prefix |

## Outcome coins

Beside "Hi, <name>" on the home page each outcome the class has reached shows as a small spinning coin, at the student's
best level: the hardest question right on the first try in practice, or their level on a released test or exit slip.
When a unit starts, its outcomes appear as Blanks. A coin that is new or higher since the device last showed it opens big
once ("New coin!" / "New coins!"). Tapping a coin opens the viewer: the coin big in a burgundy velvet case (drag or flick
to spin; it turns slowly by itself so the milled edge and the two metals show), its metal and level, the outcome, and the
seven levels, with every level reached lit (tap one to see it big).

Every coin is thick, with a milled edge, a raised rim and a fine bead ring, an outer ring and an inner core in two
different metals, and a thin band of the outcome's enamel colour where they meet. The obverse has the outcome's symbol and
code struck on the core, "MATH 20-1 · code" around the ring and one raised pip per level along the bottom. The reverse is
engraved: MATH 20-1, the outcome's short label, and the Math 20-1 mint mark (three peaks drawn as absolute-value graphs, a
rising sun and a sine-wave river).

| Level | Coin |
|---|---|
| NM | **Blank**: the unstruck planchet (dull steel ring, dull brass core, no design), shown faintly on the home page |
| LIM | **Nickel**: nickel ring, brass core |
| BEG | **Bronze**: bronze ring, nickel core |
| EMG | **Sterling**: sterling silver ring, copper core |
| PRG | **Gold**: gold ring, rose-gold core |
| ADV | **Two-Tone**: polished platinum ring, gold core |
| MAS | **Proof**: mirror gold with frosted relief, the symbol in frosted platinum on burgundy enamel over guilloché, glints |

Each outcome's outline, enamel colour and symbol are in `DESIGNS` at the top of `js/coins.js` (outcomes in the same unit
get different outlines and colours; `tests/coins_fit.py` checks that and that all the art fits).

## Adding a lesson

1. Write `js/lessons/u1l2.js` with `HW.defineLesson({ id: 'u1l2', … questions: […], extra: […] })` (see `u1l1.js`). Each part has an `id`, a `level` (LIM BEG EMG PRG ADV MAS) and a `make(rng, shared)` that returns `{ prompt, input, check, key, answer, solution, hints }`.
2. Add a `<script>` tag for it in `index.html` and `teacher/index.html` (where the "Course content" comment is; per unit:
   the lessons, then `uNtest.js`, then `js/exits/uN.js`).
3. Run `node tests/gen_test.js 300 u1l2` (one lesson at a time is quicker).

## Backend

`backend/Code.gs` runs as an Apps Script web app (Execute as: me · Who has access: Anyone) and writes to the "Math 20-1 Practice Ledger" spreadsheet: Roster, Attempts, Events, Progress, Days. Run `setup()` once; the teacher key is in Project Settings → Script properties. Put the web-app URL in `js/config.js`. After changing `Code.gs`, deploy a **new version of the same deployment** so the URL stays the same.

## Link to the teaching site

The home page shows a small **Lesson** card to the left of each assignment, and the lesson sidebar starts with a
**Go to the lesson** button. Both open the same lesson on the Math 20-1 Teaching site in a new tab (`HW.TEACHING` in
`js/catalog.js` lists the lessons it has; add a lesson's id there once its page exists), with `?class=<block>` so the student sees that class's notes. The block is the one set for the class in the dashboard's Settings; without one, a final letter
A–D in the class code (e.g. `201-b`) is used, otherwise the link has no class.

## Teaching Hub (universal settings)

Bell times, days off, the semester schedule (which class is in which block), the universal calendar and sub plans live
in the Teaching Hub: https://rmcathcart-lab.github.io/teaching/ (repo `teaching`). It sends bell times and days off to
this ledger's backend, gives the current semester's classes their block, and reads and changes the class calendars
through `teacher/bridge.html` (keep `teacher/bridge.js` the same in math10c, math15 and math20-1). The course switcher (the badge in
the ledger's corner) comes from `teaching/js/courses.js`; `js/courses.js` here is only a fallback. The ledger opens a
class with `?class=<code>` and a tab with `?tab=<tab>` (the hub's universal bookmark uses these).
