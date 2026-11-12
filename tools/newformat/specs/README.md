# Math 20-1 lesson format (Ryan, 2026-11-11) — the brief

Ryan teaches from these pages on an 11-inch iPad, projected. His Math 15 lessons ran too long and repeated themselves for
whole-class teaching, and the warm-ups had turned into side lessons. Math 15 now has a "Class view" (and keeps the rest
as "Full notes"). **Math 20-1 has only the class version**: what Math 15 hides is simply not on the 20-1 page.
The same rules apply to the lessons still to be built (Units 5–8): build them this way from the start.

## The rules (all from Ryan)
**Warm-up**
- The warm-up card is the FIRST card on screen, above the title card.
- ONE clear, inviting question that students can try while he takes attendance. Fun or interesting, gets them thinking
  mathematically, only loosely tied to the lesson. It is NOT a side lesson: no teaching, no bridge into the lesson.
- Vary the format across lessons: a riddle, which one doesn't belong, two truths and a lie, a picture question,
  estimate, "how many ways", a number trick, a mini mystery … (no two neighbouring lessons the same kind).
- Never give away the twist in the prompt (e.g. "there are two answers" belongs behind Reveal).
- It reads in order: the situation, then the question (the question at least as big as the context), picture beside.
- A fun visual whenever a relevant one exists, and a little MOVING graphic on pretty much every warm-up card (a looping
  SVG picture beside the text, and/or a small moving strip in the top-right corner of the card, e.g. cars driving
  along). Fun and engaging matters even if it adds no information. A picture must never give the answer away.
- Avoid wording students could hear as sexual and laugh at (e.g. not "biggest finish": "largest end result").

**Lesson body**
- Shorter and practical: "listen to me and watch my examples, then you can do the practice." The steps and every
  booklet example stay (the booklet is the students' notes, so the page must still match it).
- At most ONE step-by-step procedure animation per skill. Explainer animations show the question being solved at the
  top, and step-by-step animations show the step number beside each step as it appears.
- Keep the "particularly cool" animations: a real visual payoff — a scene that moves in step with a graph, a machine or
  object doing the math, a stamp/verdict comparison (finished or not, lost a solution, extraneous!), try-everything
  tables, untangling / spot-the-mismatch, hands-on tools the class can play with. Plain line-by-line worked-example
  animations are NOT what he means.
- Remove: visual "why it works" proofs (tile/area/picture proofs — they confused his Math 15 students; prefer the
  written procedure when a lesson teaches a multi-step method), check-the-example cards that only replay a booklet
  example, extra versions of the same animation, Think questions, repeated explanations.
- Keep: Math History boxes, the Stand Up Break, fun whole-class activities, booklet examples, calculator tips (TI-84
  and Casio both work through `data-keys`).
- No "Watch me" / "You try" labels on examples; he decides in the moment.
- Factoring "find the two numbers": use his X — ac on top, b underneath, the two numbers on the sides, and the factor
  pairs listed below/beside with the right pair circled.
- Nothing may refer to something that is no longer on the page (a removed warm-up, "the animation below", "as the
  explainer shows"). A sentence ending in a colon that no longer leads anywhere must be fixed or lose its colon.

**Practice break**
- At most ONE green practice card per lesson: "Assignment N · Questions a–b", placed after the example where the
  booklet assignment's questions a–b can all be done (check question by question against the booklet assignment, not
  just the section headings). The summary's assignment card then names the remaining questions ("Questions c–n").
- Short lessons (and review lessons) may have none.

## Converting an existing lesson (Units 1–4)
1. Read the page (`lessons/uN/lM/index.html`), its JS (`lessons/js/lessons/uNlM.js`) and the booklet
   (`/home/claude/m201book/unitN/uN_lXX.tex`, assignment included).
2. Write `tools/newformat/specs/uNlM.py` defining `SPEC = dict(...)` (fields below). Helpers for small moving pictures:
   `from pichelp import *` (svg, bob, blink, emo, qmark, die, bracket, grid, strip, sb, sblink, sspin, srock, sdrive,
   sroad, sfloat, …; read `tools/newformat/pichelp.py`). Pictures are plain SVG + SMIL, viewBox 330×250, no scripts.
3. Run `python3 tools/newformat/restructure.py uNlM` (re-runnable: it always starts from `orig/uNlM.html`).
4. Clean up the lesson JS where needed: code for the old warm-up or removed explainers must not throw (guard or delete
   it — deleting dead explainer code is welcome but not required), and the Stand Up Break still works.
5. Check: `python3 tests/explainer_dump.py uN/lM --base=http://localhost:8831/lessons/ --out=<scratch>` (0 problems,
   read the captions of what's left), `python3 tests/standup_check.py uN/lM`, `python3 tests/screen_fit_check.py` if
   present for the warm-up (the warm-up start state should fit one iPad screen, ≤ ~690 px), and a screenshot of the
   warm-up card and the practice card. Grep the page for "warm-up", "below", "explainer", "animation", "Think" and for
   paragraphs ending in ":" before a removed block.

## SPEC fields
```python
from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x
SPEC = dict(
  warm=dict(
    title='Two Truths and a Lie',
    # text style (reads in order): ctx = the situation (str or list of str), ask = the question
    ctx='…', ask='…?',
    # OR tile/picture style: ask = the question on top, body = HTML under it (e.g. <div class="vw-tiles" style="--n:3">…)
    # body='…',
    pic=svg('…', 'label'),          # optional looping picture beside the text
    strip=strip(sdrive('🚗', 5)),    # optional small moving strip, top-right of the card
    nudge='How do you know?',        # the line beside the Reveal button
    reveal='…answer and the twist…'),
  drop_expl=['name', …],             # explainers to remove
  drop_expl_with_prev=['name'],      # … and the <p> lead-in just before it
  drop_cards=['s2b', 'ex9check'],    # whole cards by data-ink
  drop_with_warm=[],                 # cards that belonged to the old warm-up
  drop_str=['exact html to delete'],
  replace=[('exact old html', 'new html')],   # each must occur exactly once
  think=True,                        # remove every Think part (default)
  practice=dict(after='ex3', qs='1–6', rest='7–15', line='One-line description.',
                chips=[('1–2', 'what they practise'), ('3–6', '…')],
                note='We carry on when most of the class has reached Question 5.'),
)
```
Tile warm-ups: `.vw-tiles > div` tiles are grids, so wrap each tile's text in ONE `<span>` (or every word becomes its own
row). CSS for the warm-up and practice card is `lessons/css/format.css` (`.vw-seq`, `.vw-ctx`, `.vw-ask`, `.vw-art`,
`.vw-strip`, `.vw-q`, `.vw-tiles`, `.vw-pic`, `.card.practice`, `.pr-chips` …).

## New lessons (Units 5–8)
Build the page in this format directly (no spec needed): warm-up card first with `data-ink="warmq"` and the markup the
script produces (see any converted page), then the title card, then the body by these rules, the Stand Up Break, at
most one practice card (`data-ink="p1"`), and the summary. Link `../../css/format.css`.
