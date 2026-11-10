# Math History boxes

Ryan likes to bring math history into lessons — **only** where there is a genuinely good, interesting piece of history (or
a real fun fact) that is relevant to the math of that lesson. Not every lesson gets one. Each one is a brown "old paper"
card with a short story, one question for the class, and a small animation. The model is Math 10C Lesson 1.2 (the
cicadas: 13 and 17 → LCM 221 → 1803, 2024, 2245) in the Math 10C repo — read its card in
`/home/claude/math10c/lessons/u1/l2/index.html` and `cicadaTimeline()` at the end of
`/home/claude/math10c/lessons/js/lessons/u1l2.js` before making one (read only; Math 20-1 lessons go in this repo's
`lessons/uN/lM/`).

## The card (markup)
```html
<!-- ================= Math History box (brown) ================= -->
<section class="card history" data-ink="hist" data-section="Math History: <short name>">
  <div class="hist-head"><span class="hist-tag">Math History</span><span class="hist-dates">c. 300 BCE</span></div>
  <div class="hist-grid">
    <div class="hist-text">
      <h3 class="hist-title">A short, vivid title</h3>
      <p>Two or three short paragraphs: who, when, what they did, and how it is exactly this lesson's math.</p>
      <div class="part hist-q"><div class="pl">One question the class can answer with today's math.</div>
        <div class="ansrow"><button class="reveal">Answer</button><div class="ans">The worked answer.</div></div></div>
    </div>
    <figure class="hist-anim">
      <svg id="<lesson>-hist" viewBox="0 0 600 300" role="img" aria-label="What the animation shows"></svg>
      <figcaption><button class="hist-play" type="button">Replay</button><span>Tap the picture to play it again.</span></figcaption>
      <p class="hist-note">Optional: one more sentence (a source of doubt, a modern echo).</p>
    </figure>
  </div>
</section>
```
- `.card.history`, `.hist-*` styles are shared (end of `lessons/css/site.css`) — don't change them. Put the animation's own
  styles in the lesson's CSS file (`lessons/css/lessons/<id>.css`), with class names prefixed for that lesson.
- `data-ink="hist"` must be unique on the page (use `hist2` if a page ever has two). Don't change any other card.
- Place it right after the part of the lesson it belongs to (after the section/example that teaches that math), never
  inside the warm-up or between an example and its parts.
- **One screen:** the card must fit in 684 px of height at 1180 × 746 (the iPad), answer shown. Keep text tight.
- Ink stays put: the answer uses the shared `.part` / `.reveal` / `.ans` pattern (hidden answers keep their space).

## The animation
- An inline SVG drawn by a small function at the end of the lesson's JS file (`lessons/js/lessons/<id>.js`), like
  `cicadaTimeline()`: build the SVG with `createElementNS`, play once when the card scrolls half into view
  (IntersectionObserver), replay on a tap of the picture or the Replay button, and with `prefers-reduced-motion` show the
  finished picture without motion. 8–14 seconds is plenty; pause on the key moment. No libraries, no external files.
- Same palette: browns/parchment (`#7a4a26`, `#4a2c14`, `#b07a12` gold for the key moment, `#fffaf1` panel). If the
  lesson already colours an idea (a term of a sequence, an angle, a root), use the same colour in the animation.
- Text in the SVG: at least 12 px at viewBox scale; headings in Georgia/serif like `.ci-year`.

## Facts
- **Every fact must be checked** (web search) against good sources (encyclopedias, museums, universities, NASA, etc.).
  Keep the source URLs in a comment above the card: `<!-- sources: … -->`.
- Legends are told as legends ("The story goes…", "Legend says…"). Hypotheses are "one idea is…". No made-up quotes.
- Numbers in the box must be right (dates, values). If the history is shaky or only loosely tied to the lesson, skip it.
- Plain language a Grade 11 student reads easily; Canadian spelling.

## Where they are
Add a row here for each box you make (Math 20-1 lesson numbers).

| Lesson | Story |
|---|---|
| 1.4 | Gauss's slate: 1 to 100 as 50 pairs of 101; E. T. Bell's 81 297 + … + 100 899 (source: Brian Hayes, "Gauss's Day of Reckoning", American Scientist) |
