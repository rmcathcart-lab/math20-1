/* Outcome badges: an embroidered, scout-style merit badge for each outcome, in seven levels.
 *   Pattern (Not meeting) · Cotton (Limited) · Bronze (Beginning) · Silver (Emerging) · Gold (Progressing) ·
 *   Honour (Advancing) · Master (Mastery)
 * Each outcome has its own patch shape, twill colour and stitched symbol (DESIGNS). The level is the thread: the
 * merrowed (overlocked) edge, the lettering and the stars along the bottom (none for Cotton, one for Bronze … five for
 * Master). Pattern is the badge before it's sewn: the design traced in chalk on plain canvas. Honour's edge is a red-and-gold
 * twisted cord; Master is gold bullion with a sunburst behind the symbol.
 * Badges are plain SVG (no WebGL), so they're light enough for a row of them on any device.
 *
 *   HW.Badges.row(list)          → an element with one small badge per item ({ o: 'AN1', tier: 4, src: 'from practice' }); tap opens the viewer
 *   HW.Badges.open(list, i, opt) → the viewer: the badge big (tilt it), its level, the outcome, and the seven levels for it
 *   HW.Badges.tierOf('PRG')      → 4   (NM 0 … MAS 6)
 *   HW.Badges.svg(o, tier, size) → the badge's SVG markup
 * HW.Medals is the same object (the home page code was written for the Math 10C medals). */
(function (root) {
  'use strict';
  var HW = root.HW = root.HW || {};

  var TIERS = [
    { name: 'Pattern', lv: 'NM', level: 'Not meeting', edge: '#b9ae97', edge2: '#d8cfba', text: '#7a8fb8', star: 0 },
    { name: 'Cotton', lv: 'LIM', level: 'Limited', edge: '#e9e1cc', edge2: '#fbf6e9', text: '#f4eedd', star: 0 },
    { name: 'Bronze', lv: 'BEG', level: 'Beginning', edge: '#8f5428', edge2: '#c98a55', text: '#e0a46e', star: 1 },
    { name: 'Silver', lv: 'EMG', level: 'Emerging', edge: '#9aa1ab', edge2: '#e8ebef', text: '#eef1f4', star: 2 },
    { name: 'Gold', lv: 'PRG', level: 'Progressing', edge: '#b88412', edge2: '#f6cf55', text: '#ffd866', star: 3 },
    { name: 'Honour', lv: 'ADV', level: 'Advancing', edge: '#a3241b', edge2: '#f2c447', text: '#ffd866', star: 4, twist: true },
    { name: 'Master', lv: 'MAS', level: 'Mastery', edge: '#9a6a06', edge2: '#fff1a8', text: '#fff3b8', star: 5, bullion: true }
  ];
  var TIER_OF = { NM: 0, LIM: 1, BEG: 2, EMG: 3, PRG: 4, ADV: 5, MAS: 6 };

  /* each outcome: shape, twill colour (f), symbol thread colours (a = main, b = second), symbol, word on the bottom arc.
   * Outcomes taught in the same unit get different shapes. */
  var DESIGNS = {
    AN1: { s: 'circle', f: '#1f4e8c', a: '#f4eedd', b: '#f2b134', i: 'abs', w: 'ABSOLUTE VALUE' },
    AN2: { s: 'hex', f: '#245e73', a: '#f4eedd', b: '#ffd866', i: 'root', w: 'RADICALS' },
    AN3: { s: 'hex', f: '#5b3a8c', a: '#f4eedd', b: '#ffd866', i: 'rooteq', w: 'ROOT EQUATIONS' },
    AN4: { s: 'oct', f: '#2f6b3a', a: '#f6f0dc', b: '#f2b134', i: 'cancel', w: 'SIMPLIFYING' },
    AN5: { s: 'square', f: '#8c3b1e', a: '#fbf0e3', b: '#ffd866', i: 'fractimes', w: 'RATIONALS' },
    AN6: { s: 'hex2', f: '#a3305f', a: '#fbf0f3', b: '#ffd866', i: 'fraceq', w: 'RATIONAL EQUATIONS' },
    T1: { s: 'circle', f: '#9c2a2a', a: '#fbefe9', b: '#ffd866', i: 'stdangle', w: 'ANGLES' },
    T2: { s: 'scallop', f: '#1c5f86', a: '#eef4f8', b: '#f2b134', i: 'refangle', w: 'TRIG RATIOS' },
    T3: { s: 'oct', f: '#6b4a1f', a: '#f6eedc', b: '#9fd2ff', i: 'triangle', w: 'SINE & COSINE' },
    RF1: { s: 'square', f: '#4a2f6b', a: '#f3eefb', b: '#ffd866', i: 'brackets', w: 'FACTORING' },
    RF2: { s: 'hex', f: '#b4471f', a: '#fbf3e0', b: '#2b2b2b', i: 'vee', w: 'ABSOLUTE GRAPHS' },
    RF3: { s: 'circle', f: '#1d6b63', a: '#f1f5ef', b: '#f2b134', i: 'parabola', w: 'VERTEX FORM' },
    RF4: { s: 'hex2', f: '#3b3f8c', a: '#eef0fb', b: '#ffd866', i: 'axisym', w: 'GENERAL FORM' },
    RF5: { s: 'scallop', f: '#8a6d12', a: '#fff6dc', b: '#3a2a0a', i: 'plusminus', w: 'QUADRATICS' },
    RF6: { s: 'oct', f: '#2e3a4f', a: '#f1f3f6', b: '#ff8a4c', i: 'linequad', w: 'SYSTEMS' },
    RF7: { s: 'square', f: '#55663a', a: '#f4f1df', b: '#ffd866', i: 'region', w: 'SHADED REGIONS' },
    RF8: { s: 'circle', f: '#7a2d52', a: '#f7ecf1', b: '#8fd0c4', i: 'numline', w: 'INEQUALITIES' },
    RF9: { s: 'hex', f: '#23574a', a: '#eef6f1', b: '#ffd866', i: 'stairs', w: 'ARITHMETIC' },
    RF10: { s: 'scallop', f: '#6b5530', a: '#f6efdc', b: '#ff8a4c', i: 'doubling', w: 'GEOMETRIC' },
    RF11: { s: 'hex2', f: '#3d6b2a', a: '#f4f1df', b: '#ffd866', i: 'hyperbola', w: 'RECIPROCALS' }
  };
  function design(o) { return DESIGNS[o] || { s: 'circle', f: '#475569', a: '#f1f5f9', b: '#ffd866', i: '', w: '' }; }

  /* ---------------- geometry (a 100 × 100 box, centre 50,50) ---------------- */
  function poly(n, r, rot) { var p = []; for (var k = 0; k < n; k++) { var a = (rot + k * 360 / n) * Math.PI / 180; p.push([50 + r * Math.cos(a), 50 + r * Math.sin(a)]); } return p; }
  /* points around the shape at radius r (corners rounded), for the edge and its stitches */
  function outline(shape, r) {
    var pts = [], i, a, N = 240;
    if (shape === 'circle') { for (i = 0; i < N; i++) { a = i / N * 2 * Math.PI; pts.push([50 + r * Math.cos(a), 50 + r * Math.sin(a)]); } return pts; }
    if (shape === 'scallop') { for (i = 0; i < N; i++) { a = i / N * 2 * Math.PI; var rr = r * (1 - 0.045 * (1 - Math.cos(14 * a))); pts.push([50 + rr * Math.cos(a), 50 + rr * Math.sin(a)]); } return pts; }
    if (shape === 'square') { // a squircle: a rounded square patch
      for (i = 0; i < N; i++) { a = i / N * 2 * Math.PI; var c = Math.cos(a), s = Math.sin(a), q = 2 / 5; pts.push([50 + r * 0.97 * Math.sign(c) * Math.pow(Math.abs(c), q), 50 + r * 0.97 * Math.sign(s) * Math.pow(Math.abs(s), q)]); }
      return pts;
    }
    var n = shape === 'oct' ? 8 : 6, rot = shape === 'hex' ? 30 : shape === 'hex2' ? 0 : 22.5, V = poly(n, r, rot), cut = 0.16;
    for (i = 0; i < n; i++) { // each side, with its corners rounded by a short quadratic
      var P0 = V[(i + n - 1) % n], P1 = V[i], P2 = V[(i + 1) % n], A = lerp(P1, P0, cut), B = lerp(P1, P2, cut);
      for (var t = 0; t <= 1; t += 0.1) { var u = 1 - t; pts.push([u * u * A[0] + 2 * u * t * P1[0] + t * t * B[0], u * u * A[1] + 2 * u * t * P1[1] + t * t * B[1]]); }
      var C = lerp(P1, P2, 1 - cut); for (var t2 = 0.1; t2 < 1; t2 += 0.1) pts.push(lerp(B, C, t2));
    }
    return pts;
  }
  function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  function pathOf(pts) { return 'M' + pts.map(function (p) { return p[0].toFixed(2) + ' ' + p[1].toFixed(2); }).join('L') + 'Z'; }

  /* ---------------- the symbols: stitched strokes in the face (about 30 … 70) ---------------- */
  // each returns a list of [path, colourKey ('a' | 'b'), width]
  var ICONS = {
    abs: function () { return [['M38 35v30M62 35v30', 'a', 3.6], ['M44 43l12 14M56 43l-12 14', 'b', 3]]; }, // |x|
    root: function () { return [['M31 53l4-3l7 15l8-29h19', 'a', 3.4], ['M53 43l9 11M62 43l-9 11', 'b', 2.8]]; }, // √x
    rooteq: function () { return [['M31 52l3-2l5 11l6-21h11', 'a', 3.2], ['M58 45h10M58 53h10', 'b', 3]]; }, // √ =
    cancel: function () { return [['M33 50h34', 'a', 3], ['M45 37l8 8M53 37l-8 8M45 55l8 8M53 55l-8 8', 'a', 2.6], ['M41 47l16-11M41 65l16-11', 'b', 2.2]]; }, // x/x, cancelled
    fractimes: function () { return [['M32 50h12M56 50h12', 'a', 3], ['M38 42l0 0M38 58l0 0M62 42l0 0M62 58l0 0', 'a', 6.5], ['M46.5 46.5l7 7M53.5 46.5l-7 7', 'b', 2.8]]; }, // a/b × c/d
    fraceq: function () { return [['M32 50h14', 'a', 3], ['M39 42l0 0M39 58l0 0', 'a', 6.5], ['M52 46h9M52 54h9', 'b', 3], ['M66.5 50l0 0', 'a', 7]]; }, // a/b = •
    stdangle: function () { return [['M50 33v34M33 50h34', 'a', 2.2], ['M50 50L37 37', 'b', 3.4], ['M59 50A9 9 0 0 0 43.6 43.6', 'a', 2], ['M43.6 43.6l3.6-.4M43.6 43.6l.8 3.4', 'a', 1.8]]; }, // an angle in standard position, with its rotation
    refangle: function () { return [['M50 33v34M33 50h34', 'a', 2.2], ['M50 50L37 38', 'b', 3.2], ['M37 38V50', 'b', 2.2], ['M37 38l0 0', 'a', 7]]; }, // a point on the terminal arm, with its reference triangle
    triangle: function () { return [['M33 62L55 36L68 62Z', 'a', 3], ['M41 62A8 8 0 0 0 38.2 55.9', 'b', 2.2], ['M60.5 61A7 7 0 0 0 64.9 55.8', 'b', 2.2]]; }, // an oblique triangle, two angles marked
    brackets: function () { return [['M39 37q-6 13 0 26M46 37q6 13 0 26M54 37q-6 13 0 26M61 37q6 13 0 26', 'a', 2.8], ['M40.5 46l4 8M44.5 46l-4 8M55.5 46l4 8M59.5 46l-4 8', 'b', 2.2]]; }, // (x)(x)
    vee: function () { return [['M32 61h35M38 33v34', 'a', 2], ['M42 36L54 60L66 36', 'b', 3.4], ['M54 60l0 0', 'a', 6]]; }, // y = |x − h|, its vertex on the x-axis (black thread on orange)
    parabola: function () { return [['M33 44h34M42 33v34', 'a', 2], ['M35 34Q50 78 65 34', 'b', 3.2], ['M50 56l0 0', 'a', 7]]; }, // y = a(x − p)² + q and its vertex
    axisym: function () { return [['M35 66Q50 22 65 66', 'a', 3.2], ['M50 33v4M50 41v4M50 49v4M50 57v4M50 65v2', 'b', 2.4]]; }, // a parabola and its axis of symmetry
    plusminus: function () { return [['M31 44h11M36.5 38.5v11M31 55h11', 'b', 3], ['M45 51l3-2l5 11l6-22h11', 'a', 3.2]]; }, // ±√ (the quadratic formula)
    linequad: function () { return [['M36 36Q50 76 64 36', 'a', 3], ['M33 58L67 40', 'b', 3], ['M43.9 52.2l0 0M61.3 43l0 0', 'a', 7]]; }, // a line meets a parabola twice
    region: function () { return [['M34 64L66 34', 'a', 3.2], ['M42 56.5l7.5 7.5M50 49l15 15M58 41.5l8 8M64 35.9l2 2', 'b', 2]]; }, // a boundary line and its shaded side
    numline: function () { return [['M32 50h36M36 46.5l-4 3.5l4 3.5M64 46.5l4 3.5l-4 3.5', 'a', 2], ['M33 50h7M60 50h7', 'b', 4.4], ['M46 50a3 3 0 1 0 -6 0a3 3 0 1 0 6 0M60 50a3 3 0 1 0 -6 0a3 3 0 1 0 6 0', 'a', 2]]; }, // x < a or x > b
    stairs: function () { return [['M34 64h8v-8h8v-8h8v-8h8v-8', 'a', 3], ['M42 56l0 0M50 48l0 0M58 40l0 0M66 32l0 0', 'b', 6.5]]; }, // equal steps: a common difference
    doubling: function () { return [['M37 65v-3M46 65v-6M55 65v-12M64 65v-24', 'a', 5.5], ['M33 61Q55 62 67 34', 'b', 2.4]]; }, // each bar double the last
    hyperbola: function () { return [['M50 33v34M33 50h34', 'a', 2], ['M53 33Q54 47 67 47M33 53Q46 54 47 67', 'b', 3.2]]; } // y = 1/x
  };

  /* ---------------- one badge as SVG ---------------- */
  var uid = 0;
  function svg(o, tier, size) {
    var d = design(o), T = TIERS[tier] || TIERS[0], id = 'bdg' + (++uid), pattern = tier === 0;
    var fab = pattern ? '#ebe3d0' : d.f, R = 48;
    var outer = outline(d.s, R), edgeIn = outline(d.s, R - 6.5), ring = outline(d.s, R - 11.5);
    var h = '<svg class="badge-svg" viewBox="-2 -2 104 104" width="' + (size || 50) + '" height="' + (size || 50) + '" aria-hidden="true" focusable="false">';
    h += '<defs>';
    // twill: fine diagonal ribs over the fabric, with a little noise so it reads as cloth
    h += '<pattern id="' + id + 'tw" width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><rect width="2.2" height="2.2" fill="' + fab + '"/><rect width="2.2" height="0.9" fill="' + (pattern ? '#d9cfb8' : 'rgba(0,0,0,.16)') + '"/></pattern>';
    // satin stitch for the symbol threads: tight parallel fibres
    ['a', 'b'].forEach(function (k) {
      var col = pattern ? '#7a8fb8' : d[k];
      h += '<pattern id="' + id + 'st' + k + '" width="1.3" height="1.3" patternUnits="userSpaceOnUse" patternTransform="rotate(' + (k === 'a' ? 62 : -28) + ')"><rect width="1.3" height="1.3" fill="' + col + '"/><rect width="1.3" height="0.38" fill="rgba(0,0,0,.18)"/></pattern>';
    });
    h += '<filter id="' + id + 'tx" filterUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="' + (o.charCodeAt(0) + o.length) + '" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in" result="gi"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gi"/></feMerge></filter>';
    h += '<filter id="' + id + 'up" filterUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><feDropShadow dx="0.5" dy="0.9" stdDeviation="0.5" flood-color="#000" flood-opacity="' + (pattern ? 0 : 0.45) + '"/></filter>';
    if (T.bullion) h += '<linearGradient id="' + id + 'gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff4b0"/><stop offset=".35" stop-color="#e2ac2a"/><stop offset=".6" stop-color="#fff0a0"/><stop offset="1" stop-color="#9a6a06"/></linearGradient>';
    h += '<clipPath id="' + id + 'cl"><path d="' + pathOf(edgeIn) + '"/></clipPath>';
    h += '<path id="' + id + 'top" d="M19 50a31 31 0 0 1 62 0"/><path id="' + id + 'bot" d="M16.5 50a33.5 33.5 0 0 0 67 0"/>';
    h += '</defs>';
    // the patch: shadow, fabric, texture
    h += '<path d="' + pathOf(outer) + '" fill="rgba(0,0,0,.28)" transform="translate(0.6 1.4)"/>';
    h += '<path d="' + pathOf(outer) + '" fill="url(#' + id + 'tw)" filter="url(#' + id + 'tx)"/>';
    if (T.bullion) { // a sunburst woven into the face
      var rays = ''; for (var k = 0; k < 24; k++) { var a1 = k * 15 * Math.PI / 180, a2 = (k * 15 + 6.5) * Math.PI / 180; rays += 'M50 50L' + (50 + 60 * Math.cos(a1)).toFixed(1) + ' ' + (50 + 60 * Math.sin(a1)).toFixed(1) + 'L' + (50 + 60 * Math.cos(a2)).toFixed(1) + ' ' + (50 + 60 * Math.sin(a2)).toFixed(1) + 'Z'; }
      h += '<g clip-path="url(#' + id + 'cl)"><path d="' + rays + '" fill="rgba(255,226,120,.16)"/></g>';
    }
    // a running stitch between the lettering band and the face
    h += '<path d="' + pathOf(outline(d.s === 'square' ? 'square' : 'circle', 29.5)) + '" fill="none" stroke="' + (pattern ? '#9fb0cf' : T.text) + '" stroke-width="0.9" stroke-dasharray="2.2 1.6" opacity="' + (pattern ? 0.9 : 0.75) + '"/>';
    // the symbol, stitched (or traced, for Pattern)
    var ic = (ICONS[d.i] || function () { return []; })();
    h += '<g transform="translate(50 50) scale(' + (d.s === 'square' ? 0.98 : 0.92) + ') translate(-50 -51)" fill="none" stroke-linecap="round" stroke-linejoin="round">';
    ic.forEach(function (x) {
      if (pattern) h += '<path d="' + x[0] + '" stroke="#6f86b5" stroke-width="' + Math.max(0.9, Math.min(1.4, x[2] * 0.4)) + '" stroke-dasharray="1.6 1.3"/>';
      else h += '<path d="' + x[0] + '" stroke="url(#' + id + 'st' + x[1] + ')" stroke-width="' + x[2] + '" filter="url(#' + id + 'up)"/>';
    });
    h += '</g>';
    // stars for the level, along the bottom of the face
    var ns = T.star;
    for (var j = 0; j < ns; j++) {
      var sx = 50 + (j - (ns - 1) / 2) * 6.4, sy = 70.5 - Math.abs(j - (ns - 1) / 2) * -0.6;
      h += '<path d="' + star(sx, sy, 2.7) + '" fill="' + (T.bullion ? 'url(#' + id + 'gd)' : T.text) + '" stroke="rgba(0,0,0,.35)" stroke-width="0.35"/>';
    }
    // lettering: the outcome code over the top, the topic along the bottom
    var ls = 'font-family:&quot;Barlow Condensed&quot;,&quot;Arial Narrow&quot;,sans-serif;font-weight:800;';
    var tfill = pattern ? 'none' : (T.bullion ? 'url(#' + id + 'gd)' : T.text), tstroke = pattern ? ' stroke="#6f86b5" stroke-width="0.45" stroke-dasharray="0.9 0.7"' : ' stroke="rgba(0,0,0,.25)" stroke-width="0.3"';
    h += '<text style="' + ls + 'font-size:11.5px;letter-spacing:1.2px" fill="' + tfill + '"' + tstroke + ' text-anchor="middle"><textPath href="#' + id + 'top" startOffset="50%">' + o + '</textPath></text>';
    var w = d.w || '', fs = w.length > 15 ? 5.6 : w.length > 12 ? 6.2 : w.length > 10 ? 7 : w.length > 8 ? 7.8 : 8.6;
    h += '<text style="' + ls + 'font-size:' + fs + 'px;letter-spacing:' + (w.length > 12 ? 0.2 : w.length > 10 ? 0.4 : 0.9) + 'px" fill="' + tfill + '"' + tstroke + ' text-anchor="middle" dominant-baseline="hanging"><textPath href="#' + id + 'bot" startOffset="50%">' + w + '</textPath></text>';
    // the merrowed edge: a thick cord of thread around the patch, its stitches as ridges across it
    var mid = pathOf(outline(d.s, R - 3.2));
    if (pattern) {
      h += '<path d="' + mid + '" fill="none" stroke="#b9ae97" stroke-width="1" stroke-dasharray="3 2.2"/>';
      h += '<path d="' + pathOf(outer) + '" fill="none" stroke="#cfc4ab" stroke-width="0.8"/>';
    } else {
      var e1 = T.bullion ? 'url(#' + id + 'gd)' : T.edge;
      h += '<path d="' + mid + '" fill="none" stroke="' + e1 + '" stroke-width="6.6"/>';
      h += '<path d="' + mid + '" fill="none" stroke="' + (T.twist ? '#f2c447' : T.edge2) + '" stroke-width="6.2" stroke-dasharray="' + (T.twist ? '1.6 2.2' : '0.75 0.85') + '" opacity="' + (T.twist ? 1 : 0.85) + '"/>';
      if (T.twist) h += '<path d="' + mid + '" fill="none" stroke="#fff" stroke-width="6.2" stroke-dasharray="0.4 3.4" stroke-dashoffset="-0.6" opacity=".35"/>';
      h += '<path d="' + pathOf(outer) + '" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="0.6"/>';
      h += '<path d="' + pathOf(outline(d.s, R - 6.6)) + '" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="0.5"/>';
    }
    return h + '</svg>';
  }
  function star(cx, cy, r) { var p = ''; for (var k = 0; k < 10; k++) { var a = (-90 + k * 36) * Math.PI / 180, rr = k % 2 ? r * 0.45 : r; p += (k ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(2) + ' ' + (cy + rr * Math.sin(a)).toFixed(2); } return p + 'Z'; }

  /* ---------------- the row beside "Hi, …" ---------------- */
  function label(it) { var t = TIERS[it.tier]; return it.o + ' · ' + t.name + ' · ' + t.level; }
  function row(list) {
    var box = document.createElement('div'); box.className = 'badge-row';
    list.forEach(function (it, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'badge-btn'; b.title = label(it); b.setAttribute('aria-label', label(it) + ' badge');
      b.innerHTML = svg(it.o, it.tier, 50); if (it.fresh) b.classList.add('is-new');
      b.addEventListener('click', function () { open(list, i); });
      box.appendChild(b);
    });
    return box;
  }

  /* ---------------- the viewer: the badge sewn onto a sash ---------------- */
  var reduced = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function open(list, i, opt) {
    opt = opt || {}; close();
    var ov = document.createElement('div'); ov.className = 'badge-pop'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Outcome badge');
    var box = document.createElement('div'); box.className = 'badge-box'; ov.appendChild(box);
    var x = document.createElement('button'); x.type = 'button'; x.className = 'badge-x'; x.setAttribute('aria-label', 'Close'); x.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'; x.addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    function show(k) {
      i = (k + list.length) % list.length; var it = list[i];
      box.innerHTML = ''; box.appendChild(x);
      if (opt.title) box.appendChild(h('div', 'badge-new', esc(opt.title)));
      var heroWrap = h('div', 'badge-herowrap', ''), name = h('div', 'badge-name', ''), level = h('div', 'badge-level', '');
      box.appendChild(heroWrap); box.appendChild(name); box.appendChild(level);
      if (HW.OUTCOMES && HW.OUTCOMES[it.o]) box.appendChild(h('div', 'badge-out', esc(it.o) + ' · ' + esc(HW.OUTCOMES[it.o])));
      // the seven levels on a strip of sash: every one reached is sewn on and can be tapped to see it big
      var lad = h('div', 'badge-ladder', ''), rungs = [];
      TIERS.forEach(function (tt, k2) {
        var got = k2 <= it.tier, cell = h(got ? 'button' : 'div', 'badge-rung' + (got ? ' got' : ''), svg(it.o, k2, 52) + '<div class="badge-rung-m">' + esc(tt.name) + '</div><div class="badge-rung-l">' + esc(tt.level) + '</div>');
        cell.title = tt.name + ' · ' + tt.level + (got ? (k2 < it.tier ? ' (tap to see it)' : '') : ' (not yet)');
        if (got) { cell.type = 'button'; cell.addEventListener('click', function () { pick(k2); }); }
        lad.appendChild(cell); rungs.push(cell);
      });
      box.appendChild(lad);
      function pick(tk) {
        var tt = TIERS[tk];
        heroWrap.innerHTML = '<div class="badge-tilt" role="img" aria-label="' + esc(label({ o: it.o, tier: tk })) + ' badge">' + svg(it.o, tk, 300) + '<i class="badge-sheen' + (tk >= 4 ? ' is-metal' : '') + '"></i></div>';
        tilt(heroWrap.firstChild);
        name.textContent = tt.name;
        level.innerHTML = '<b>' + esc(tt.level) + '</b> on ' + esc(it.o) + (tk === it.tier ? (it.src ? ' <span class="badge-src">· ' + esc(it.src) + '</span>' : '') : ' <span class="badge-src">· a level you’ve passed</span>');
        rungs.forEach(function (c, k2) { c.classList.toggle('here', k2 === tk); if (c.tagName === 'BUTTON') c.setAttribute('aria-pressed', String(k2 === tk)); });
      }
      pick(it.tier);
      box.appendChild(h('div', 'badge-hint', (reduced ? '' : 'Tilt the badge with your finger or mouse. ') + 'Each level is a new thread: Bronze, Silver and Gold, then Honour and Master.' + (list.length > 1 ? ' ' + (i + 1) + ' of ' + list.length + '.' : '')));
      if (list.length > 1) {
        var nav = h('div', 'badge-nav', '');
        var pv = h('button', 'btn btn-ghost', '‹ Previous'), nx = h('button', 'btn btn-ghost', 'Next ›'); pv.type = nx.type = 'button';
        pv.addEventListener('click', function () { show(i - 1); }); nx.addEventListener('click', function () { show(i + 1); });
        nav.appendChild(pv); nav.appendChild(nx); box.appendChild(nav);
      }
    }
    function h(tag, cls, html) { var e = document.createElement(tag); e.className = cls; e.innerHTML = html; return e; }
    document.body.appendChild(ov); document.body.classList.add('badge-on');
    show(i || 0);
    setTimeout(function () { try { x.focus(); } catch (e) {} }, 30);
    ov._key = function (e) { if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight' && list.length > 1) show(i + 1); else if (e.key === 'ArrowLeft' && list.length > 1) show(i - 1); };
    document.addEventListener('keydown', ov._key);
    if (opt.onclose) ov._onclose = opt.onclose;
  }
  /* the big badge leans toward the pointer, and the light slides over the thread */
  function tilt(el) {
    if (!el || reduced) return;
    el.classList.add('is-in');
    var move = function (e) {
      var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', (-py * 18).toFixed(1) + 'deg'); el.style.setProperty('--ry', (px * 22).toFixed(1) + 'deg');
      el.style.setProperty('--sx', (50 + px * 70).toFixed(0) + '%'); el.style.setProperty('--sy', (50 + py * 70).toFixed(0) + '%');
    };
    var leave = function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); el.style.setProperty('--sx', '30%'); el.style.setProperty('--sy', '25%'); };
    el.addEventListener('pointermove', move); el.addEventListener('pointerdown', move); el.addEventListener('pointerleave', leave); el.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') leave(); });
    el.style.touchAction = 'none';
  }
  function close() {
    var ov = document.querySelector('.badge-pop'); if (!ov) return;
    document.removeEventListener('keydown', ov._key); ov.remove(); document.body.classList.remove('badge-on');
    if (ov._onclose) ov._onclose();
  }

  HW.Badges = { TIERS: TIERS, DESIGNS: DESIGNS, tierOf: function (lv) { return TIER_OF[lv] == null ? -1 : TIER_OF[lv]; }, row: row, open: open, close: close, svg: svg, _icons: ICONS };
  HW.Medals = HW.Badges;
})(window);
