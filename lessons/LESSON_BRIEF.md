# Brief: build one Math 20-1 teaching lesson page

Ryan (high-school math teacher, Alberta) projects these pages from his iPad, writes on them with an Apple Pencil, and
steps through explainer animations while he teaches. He loves the existing lessons; **keep that calibre and the same
richness (6–10 explainers per lesson, fewer only for a genuinely short lesson)**. This brief is the lean version of the
process: read the little you need, reuse the shared blocks, test with the dump script, stay within the testing budget.

Repo `/home/claude/math20-1` (pages in `lessons/`, live at https://rmcathcart-lab.github.io/math20-1/lessons/). Serve the
REPO ROOT (a server is usually on http://localhost:8831/; else `cd /home/claude/math20-1 && nohup python3 -m http.server 8831 &`).
File paths below are relative to `lessons/`. Don't run git. Don't edit shared files (`js/*.js` except your lesson file,
`css/site.css`, `css/blocks.css`, `index.html`, other lessons, `../js/catalog.js`, `../tests/`); if you need a shared
change, describe it in your report.

Math 20-1 specifics: the page for lesson M of unit N is `uN/lM/index.html` with lesson id `uNlM` (e.g. `u1/l3/`, `u1l3`);
lesson titles and outcome codes are in `../js/catalog.js` (`HW.CATALOG`) and the official outcome wording in
`../js/outcomes.js`. The hero kicker reads `Math 20-1 · Unit N <Unit Title> · Lesson M` (e.g.
`Math 20-1 · Unit 1 Sequences and Series · Lesson 3`). Outcome codes are the Program of Studies codes: AN1–AN6,
T1–T3, RF1–RF11. Browser storage is under the `m201/` prefix (`../js/ns.js`, the first script on every page), so ink
keys like `ink:u1l3` never mix with the other courses. This repo has no lesson pages yet: the reference lesson named in
your addendum may be in the Math 15 repo (`/home/claude/math15/lessons/`) or the Math 10C repo
(`/home/claude/math10c/lessons/`) — read it there, never edit those repos. Switching a finished lesson on (adding its id
to `HW.TEACHING.lessons` in `../js/catalog.js`, which also makes `index.html` link it) is the coordinator's job.

## Read (in this order, nothing more unless you're stuck)
1. The unit addendum you were given (ids, outcomes, conventions, sources).
2. `BLOCKS.md` (180 lines) — the shared building blocks. Use them for graphs, number lines, tables, arrow diagrams,
   flowcharts, triangles, stamps/check cards, multiple choice (`.bk-mc`), numerical response (`.bk-nr`), guess-first polls,
   tap-to-reveal cells, flip cards and warm-up answer toggles. Copy patterns from `dev/blocks.html` + `js/dev/blocks-demo.js`.
3. ONE reference lesson for page anatomy and tone: the HTML of the page named in the addendum (skim; don't read its JS
   except one explainer to see the style). The anatomy is summarized below.
4. `js/explain.js` lines 1–140 only (the Explainer API) if BLOCKS.md doesn't answer a question.

## Page anatomy (copy the `<head>` and closing script block from the reference page)
- Hero card: kicker, title, lede, "I can…" list, outcome box. Warm-up card (interactive version of the bell-ringer: guess-first
  poll with reveal, tappable reveals). Section cards (`.sec-h` badge + heading) with `.def` callouts, explainers
  (`<div class="explainer" data-explainer="key">`), tips (`.tip.watch` "Watch out", `.tip.calc-tip` with "Show me"
  `data-keys` buttons), "Think" questions. Example cards: every booklet example, `.parts` grid of `.part`
  (`.pl` label, `.work` space with `--h`, `.ansrow` with `.reveal` button + `.ans`), "+ More space" button. Summary card
  ("Key ideas", 4 tiles), assignment link card `../../../#/lesson/<id>`, next-lesson card.
- Every card that takes ink has a unique `data-ink="<id>"`; cards in the ••• Jump menu have `data-section="<name>"`.
- Boot: `import { boot } from '../../js/ui.js'; import '../../js/lessons/<id>.js'; boot({ key: '<id>', homeHref: '../../', title: 'N.M Short Title' });`
- Optional lesson CSS `css/lessons/<id>.css` — prefix every class with your lesson id. Never style bare `span`
  descendants of anything that can contain KaTeX (it stacks/capitalises the math); use classes.

## Explainers — where the quality comes from
- Explainer API: `{ title, height, choices, custom, intro, make(stage, value, ex) → steps [{cap, run(c)}] }`; mount with
  `mountExplainers({ key: def, … })` (blocks.js) or the pattern in the reference lesson. Animate only via `c` (blocks take `c`).
- One explainer per idea that can be SEEN; captions short, plain, for the class to read on a projector, key words bold.
- Chips: concept demos plus "Example N check:" chips that replay the booklet example's own numbers (so Ryan can check the
  class's work after doing it by hand). **Never** use assignment questions in chips (homework would be given away).
- Fixed stage heights; nothing above a work area may change height when an explainer runs (ink must not shift).
- Captions are computed before their step runs: compute numbers in `make()`.
- Use the blocks wherever they fit, and write custom visuals whenever a concept needs something the blocks don't do —
  variety matters more than uniformity. Blocks expose their SVG layers/transforms so you can draw custom things on them.

## Content rules
- Recreate ALL the booklet's notes and examples (not the assignment). Every Answer matches the solutions file; recompute
  answers yourself (python/sympy/node). Report booklet errors; never fix them silently.
- Math always in KaTeX (`tex()` / `<span class="tex">`): never visible "x^2". Numbers ≥ 1000 with a thin space (`fmt()`).
- Projector-readable (≥ 17 px), fixed 1080 px layout (design for ~1000 px content). Interactive things are `<button>`s or
  have `data-tap` (finger AND Pencil).
- Ryan lets Math 20-1 students use their calculators for almost everything: no "no calculator" lessons; where the skill is
  exactness, ask for exact answers (a calculator only gives decimals).
- Calculator: the class calculator is the **TI-84 Plus CE** (some students have a Casio fx-9750GIII: same features,
  different keys). The on-screen one (`../js/calc84.js`, the **Calc** button on every page) has the real key layout and
  TI order of operations (powers before negation, so `(−) 2 x²` = −4; × ÷ and implied multiplication left to right;
  `^` left to right), Degree mode by default, Classic display (fractions as `-2/125`), Y=, WINDOW, ZOOM, GRAPH, TRACE,
  2nd TABLE / TBLSET and 2nd CALC (value, zero, minimum, maximum, intersect). Write keys in `<span class="keys">` with
  TI-84 names: `<kbd>ENTER</kbd>` (there is no = key), `<kbd>(−)</kbd>` for a negative, 2nd functions as
  `<kbd>2nd</kbd><kbd>TABLE</kbd>`, menu items as `<kbd>MATH</kbd><kbd>1</kbd>` (►Frac). A fraction answer: type the
  calculation, ENTER, then `MATH 1 ENTER` (the screen shows `Ans►Frac`). Finding *n* with a "table of values" (keep the
  booklet's wording): put the formula in Y= with `X,T,θ,n` for *n*, set 2nd TBLSET (TblStart, ΔTbl), then 2nd TABLE.
- `data-keys` "Show me" demos: tokens separated by spaces; each token is one or more key presses and the caption shows
  the TI-84 key names (the full list is at the top of `js/calc84.js`; `HW.Calc.plan(spec)` reads it):
  numbers (`500`, `.7`); `+ − × ÷ ^ ( ) ,` and `=`/`ENTER`; `(−)` `x²` `x⁻¹` `sin cos tan log ln` `X` (the X,T,θ,n key)
  `STO→`; `CLEAR DEL MODE MATH VARS ALPHA 2nd`; `Y= WINDOW ZOOM TRACE GRAPH`; arrows `▲ ▼ ◄ ►`; 2nd functions
  `√ π e EE { } Ans ENTRY QUIT INS sin⁻¹ cos⁻¹ tan⁻¹ 10^( e^( TABLE TBLSET CALC FORMAT LIST TEST ANGLE L1…L6`; menu
  items `►Frac ►Dec ³ ³√( ˣ√ Σ( abs( round( iPart( fPart( int( nPr nCr ! seq( dim( cumSum( sum( prod( ° > ≥ < ≤ ≠
  Y1…Y6 ZStandard ZDecimal ZSquare ZoomFit ZTrig ZInteger ZBox ZoomIn ZoomOut value zero minimum maximum intersect`;
  letters `A`–`Z` (ALPHA + key; `X` is the X,T,θ,n key); `k:<key id>` for any key. A digit inside a menu picks that
  item. Each demo starts on a cleared home screen. Examples: `1250 × ( (−) 1 ÷ 5 ) ^ 7 = ►Frac =`;
  `Y= CLEAR 500 × .7 ^ X TBLSET 0 ENTER 1 ENTER TABLE ► ▼ ▼`; `sum( seq( 3 × 2 ^ ( N − 1 ) , N , 1 , 10 ) ) =`;
  `Y= CLEAR X x² − 4 ZStandard zero (−) 1 ENTER 5 ENTER 2 ENTER`. `node tests/calc84_test.js` tests the calculator.

## Testing (budget: aim for ≤ 3 dump runs and ≤ ~12 images viewed in total)
1. Teacher mode is automatic in the dump script. Run
   `cd /home/claude/math20-1 && python3 tests/explainer_dump.py <unit>/<lesson> --sheets --calc --out=/tmp/claude-0/<id>`
   It steps every explainer chip, writes `<out>/<unit>-<lesson>.txt` (every caption and visible stage text, math as LaTeX,
   calculator demo results) and one contact-sheet PNG per explainer, and lists problems (console errors, KaTeX problems,
   raw math text, caption/stage overflow, explainers that don't finish). Fix every listed problem.
2. LOOK at each contact sheet (one image per explainer) and fix anything ugly, overlapping, clipped or wrong. Take a few
   full-page screenshots at 1180×820 (all answers shown: add class `shown` to every `.part`) for the static cards.
3. Read the `.txt` once and check every number/expression in the captions against your own computation.
4. Re-run the dump after fixes. Only take extra step-by-step screenshots to debug a specific problem.

## Report back (concise)
Files created; explainers (one line each); how you verified answers; booklet errors/doubts with exact locations; shared
changes you'd recommend; anything you couldn't do.
