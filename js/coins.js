/* Outcome coins: a spinning 3D bimetallic coin for each outcome, minted in seven levels.
 *   Blank (Not meeting) · Nickel (Limited) · Bronze (Beginning) · Sterling (Emerging) · Gold (Progressing) ·
 *   Two-Tone (Advancing) · Proof (Mastery)
 * Each coin is thick, with a milled (reeded) edge, a raised rim, and two metals: an outer ring and an inner core, joined
 * by a thin band of the outcome's enamel colour. The obverse has the outcome's symbol and code struck in relief on the
 * core, "MATH 20-1 · <code>" around the ring, and one raised pip per level along the bottom (1 for Blank … 7 for Proof).
 * The reverse is engraved: the course name, the outcome's short label and the Math 20-1 mint mark (three peaks drawn as
 * absolute-value graphs, a rising sun and a sine-wave river). Each outcome has its own outline and enamel (DESIGNS);
 * the metals are the level (TIERS). Blank is the unstruck planchet; Proof is mirror gold with a frosted platinum
 * symbol on burgundy enamel, and it glints.
 * The faces are height maps drawn on canvases and rendered with three.js (vendored in js/vendor/three, loaded only when a
 * coin is first shown). One hidden WebGL canvas draws every coin and copies it into each coin's own 2D canvas, so coins
 * sit in the page like images. At most one new coin is built per frame, small coins redraw at about 15 fps, and only the
 * last three outcomes' big (viewer) coins are kept in memory.
 *
 *   HW.Coins.row(list)          → an element with one small coin per item ({ o: 'AN2', tier: 4, src: 'from practice' }); tap opens the viewer
 *   HW.Coins.open(list, i, opt) → the viewer: the coin big (drag or flick to spin; it turns slowly by itself), its metal and
 *                                 level, the outcome, and the seven levels for it (tap a lit one to see it big)
 *   HW.Coins.tierOf('PRG')      → 4   (NM 0 … MAS 6)
 * HW.Medals and HW.Badges are the same object (the home page code was written for the Math 10C medals). */
(function (root) {
  'use strict';
  var HW = root.HW = root.HW || {};
  var BASE = (document.currentScript && document.currentScript.src) || location.href;
  var THREE_URL = new URL('vendor/three/three.module.min.js', BASE).href, ROOM_URL = new URL('vendor/three/RoomEnvironment.js', BASE).href;
  var FONT = '"Barlow Condensed", "Arial Narrow", "Roboto Condensed", sans-serif';
  var BURGUNDY = '#7a1f3d';

  /* the levels: ring and core metals (colour, roughness); alloy = the line under the metal's name in the viewer */
  var TIERS = [
    { metal: 'Blank', lv: 'NM', name: 'Not meeting', ring: '#83878a', core: '#a18f63', rough: 0.62, blank: true, alloy: 'An unstruck blank: practise to strike it' },
    { metal: 'Nickel', lv: 'LIM', name: 'Limited', ring: '#b4b9be', core: '#c9ad62', rough: 0.5, alloy: 'Nickel ring · brass core' },
    { metal: 'Bronze', lv: 'BEG', name: 'Beginning', ring: '#c98450', core: '#cdd1d6', rough: 0.4, alloy: 'Bronze ring · nickel core' },
    { metal: 'Sterling', lv: 'EMG', name: 'Emerging', ring: '#eceff2', core: '#e0906a', rough: 0.36, alloy: 'Sterling silver ring · copper core' },
    { metal: 'Gold', lv: 'PRG', name: 'Progressing', ring: '#f5c24e', core: '#e8907a', rough: 0.32, alloy: 'Gold ring · rose-gold core' },
    { metal: 'Two-Tone', lv: 'ADV', name: 'Advancing', ring: '#e8ecf1', core: '#ffc63f', rough: 0.16, clearcoat: 1, alloy: 'Platinum ring · gold core' },
    { metal: 'Proof', lv: 'MAS', name: 'Mastery', ring: '#f7cd5c', core: '#eef1f5', rough: 0.04, clearcoat: 1, proof: true, alloy: 'Mirror gold · frosted platinum on burgundy enamel' }
  ];
  var TIER_OF = { NM: 0, LIM: 1, BEG: 2, EMG: 3, PRG: 4, ADV: 5, MAS: 6 };

  /* every outcome's coin: s = outline, c = enamel colour, i = symbol, w = its short label (on the reverse).
   * Outlines: circle; n = rounded polygon (r = corner rounding, t = turn); reu = curve-sided (Reuleaux) polygon;
   * wave = scalloped; cusp = scalloped with sharp inward points; notch = a circle with notches. All are left-right
   * symmetric (the reverse uses the same outline). Outcomes taught in the same unit get different outlines and colours. */
  var DESIGNS = {
    RF9: { s: { n: 12, r: 0.07, t: 90 }, c: '#0e7490', i: 'stairs', w: 'ARITHMETIC' },
    RF10: { s: { reu: 7 }, c: '#f97316', i: 'doubling', w: 'GEOMETRIC' },
    AN2: { s: { circle: 1 }, c: '#0891b2', i: 'root', w: 'RADICALS' },
    T1: { s: { n: 11, r: 0.09, t: 90 }, c: '#dc2626', i: 'stdangle', w: 'ANGLES' },
    T2: { s: { wave: 14, d: 0.032 }, c: '#0d9488', i: 'refangle', w: 'TRIG RATIOS' },
    T3: { s: { reu: 9 }, c: '#ca8a04', i: 'triangle', w: 'SINE & COSINE' },
    RF1: { s: { n: 8, r: 0.14, t: 22.5 }, c: '#65a30d', i: 'brackets', w: 'FACTORING' },
    RF5: { s: { wave: 6, d: 0.035 }, c: '#4f46e5', i: 'plusminus', w: 'QUADRATICS' },
    AN3: { s: { n: 10, r: 0.1, t: 90 }, c: '#a21caf', i: 'rooteq', w: 'ROOT EQUATIONS' },
    RF3: { s: { notch: 10, d: 0.05, w: 0.1 }, c: '#0284c7', i: 'parabola', w: 'VERTEX FORM' },
    RF4: { s: { reu: 5 }, c: '#e11d48', i: 'axisym', w: 'GENERAL FORM' },
    AN4: { s: { n: 9, r: 0.12, t: 90 }, c: '#16a34a', i: 'cancel', w: 'SIMPLIFYING' },
    AN5: { s: { wave: 20, d: 0.02 }, c: '#ea580c', i: 'fractimes', w: 'RATIONALS' },
    AN6: { s: { cusp: 12, d: 0.045 }, c: '#db2777', i: 'fraceq', w: 'RATIONAL EQUATIONS' },
    AN1: { s: { n: 6, r: 0.2, t: 90 }, c: '#2563eb', i: 'abs', w: 'ABSOLUTE VALUE' },
    RF2: { s: { n: 13, r: 0.07, t: 90 }, c: '#c2410c', i: 'vee', w: 'ABSOLUTE GRAPHS' },
    RF11: { s: { notch: 12, d: 0.045, w: 0.085 }, c: '#15803d', i: 'hyperbola', w: 'RECIPROCALS' },
    RF6: { s: { notch: 8, d: 0.055, w: 0.12 }, c: '#059669', i: 'linequad', w: 'SYSTEMS' },
    RF7: { s: { wave: 10, d: 0.03 }, c: '#d97706', i: 'region', w: 'SHADED REGIONS' },
    RF8: { s: { cusp: 16, d: 0.028 }, c: '#7c3aed', i: 'numline', w: 'INEQUALITIES' }
  };
  function design(o) { return DESIGNS[o] || { c: '#64748b', s: { circle: 1 }, i: '', w: '' }; }

  /* ---------------- outlines (points, radius ≤ 1, y up, counter-clockwise) ---------------- */
  var R = Math.PI / 180;
  function outline(sh) {
    var pts = [], i, a, M = 720;
    if (sh.circle) { for (i = 0; i < 240; i++) { a = i / 240 * Math.PI * 2; pts.push([Math.cos(a), Math.sin(a)]); } return pts; }
    if (sh.wave) { for (i = 0; i < M; i++) { a = i / M * Math.PI * 2; var rr = 1 - sh.d * (1 - Math.cos(sh.wave * (a - Math.PI / 2))); pts.push([rr * Math.cos(a), rr * Math.sin(a)]); } return pts; }
    if (sh.cusp) { for (i = 0; i < M; i++) { a = i / M * Math.PI * 2; var rc = 1 - sh.d * (1 - Math.abs(Math.cos(sh.cusp * (a - Math.PI / 2) / 2))); pts.push([rc * Math.cos(a), rc * Math.sin(a)]); } return pts; }
    if (sh.notch) {
      var per = Math.PI * 2 / sh.notch;
      for (i = 0; i < M; i++) {
        a = i / M * Math.PI * 2; var q = ((a - Math.PI / 2 + per / 2) % per + per) % per - per / 2, z = Math.abs(q) / sh.w;   // notches between the top and its neighbours
        var rn = 1 - (z < 1 ? sh.d * Math.sqrt(1 - z * z) : 0); pts.push([rn * Math.cos(a), rn * Math.sin(a)]);
      }
      return pts;
    }
    if (sh.reu) {                                  // each side is an arc centred on the opposite corner
      var n = sh.reu, V = [];
      for (i = 0; i < n; i++) { a = Math.PI / 2 + i * 2 * Math.PI / n; V.push([Math.cos(a), Math.sin(a)]); }
      for (i = 0; i < n; i++) {
        var P = V[i], Q = V[(i + 1) % n], O = V[(i + (n + 1) / 2) % n], rad = Math.hypot(P[0] - O[0], P[1] - O[1]);
        var a0 = Math.atan2(P[1] - O[1], P[0] - O[0]), a1 = Math.atan2(Q[1] - O[1], Q[0] - O[0]), da = a1 - a0;
        while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
        for (var j = 0; j < 40; j++) { var b = a0 + da * j / 40; pts.push([O[0] + rad * Math.cos(b), O[1] + rad * Math.sin(b)]); }
      }
      return pts;
    }
    var nn = sh.n, r = sh.r, half = Math.PI / nn, Rv = 1 + r / Math.cos(half) - r, rc2 = Rv - r / Math.cos(half);
    for (var k = 0; k < nn; k++) {
      var th = sh.t * R + k * 2 * half;
      for (var jj = 0; jj <= 12; jj++) { a = th - half + jj / 12 * 2 * half; pts.push([rc2 * Math.cos(th) + r * Math.cos(a), rc2 * Math.sin(th) + r * Math.sin(a)]); }
    }
    return pts;
  }

  /* ---------------- the art: symbols (struck in relief), drawn on a 1024 canvas (scaled for smaller faces) ----------------
   * Ryan's symbols from js/badges.js, in their 100-unit box (about 30 … 70), redrawn bolder for relief:
   *   ['p', svg path, width, height]  a stroke      ['d', x, y, r, height]  a dot      ['o', x, y, r, width, height]  a ring
   *   ['t', text, x, y, size, height] italic text   heights: 1 = full relief, lower = a lower step (axes, helpers) */
  var ICONS = {
    abs: [['p', 'M38 34v32M62 34v32', 4.4, 1], ['p', 'M44 43l12 14M56 43l-12 14', 3.8, 0.85]],                                        // |x|
    root: [['p', 'M30 53l4.5-3l7 15l8-30h20', 4.4, 1], ['p', 'M54 43l9 11M63 43l-9 11', 3.6, 0.85]],                                 // √x
    rooteq: [['p', 'M30 52l3.5-2.5l5.5 12l6.5-23h11', 4.2, 1], ['p', 'M59 45h11M59 54h11', 3.8, 0.85]],                               // √ =
    cancel: [['p', 'M32 50h36', 3.6, 0.7], ['p', 'M45 37l8 8M53 37l-8 8M45 55l8 8M53 55l-8 8', 3.4, 0.8], ['p', 'M40 47l18-12M40 66l18-12', 3, 1]], // x over x, cancelled
    fractimes: [['p', 'M31 50h13M56 50h13', 3.8, 0.9], ['d', 37.5, 42, 3.6, 0.9], ['d', 37.5, 58, 3.6, 0.9], ['d', 62.5, 42, 3.6, 0.9], ['d', 62.5, 58, 3.6, 0.9], ['p', 'M46.5 46.5l7 7M53.5 46.5l-7 7', 3.4, 1]], // a/b × c/d
    fraceq: [['p', 'M31 50h15', 3.8, 0.9], ['d', 38.5, 42, 3.6, 0.9], ['d', 38.5, 58, 3.6, 0.9], ['p', 'M52 46h10M52 54h10', 3.6, 1], ['d', 67.5, 50, 4.2, 1]], // a/b = •
    stdangle: [['p', 'M50 32v36M32 50h36', 2.6, 0.55], ['p', 'M50 50L36 36', 4.4, 1], ['p', 'M60 50A10 10 0 0 0 42.9 42.9', 2.8, 0.8], ['p', 'M42.9 42.9l4.2-.3M42.9 42.9l.3 4.2', 2.6, 0.8]], // an angle in standard position
    refangle: [['p', 'M50 32v36M32 50h36', 2.6, 0.55], ['p', 'M50 50L36 37', 4.2, 1], ['p', 'M36 37V50', 2.8, 0.75], ['d', 36, 37, 4.4, 1]], // a point on the terminal arm and its reference triangle
    triangle: [['p', 'M32 62L55 35L69 62Z', 4.2, 1], ['p', 'M41 62A9 9 0 0 0 37.8 55.1', 2.8, 0.7], ['p', 'M60.4 61A8 8 0 0 0 65.3 55', 2.8, 0.7]], // an oblique triangle, two angles marked
    brackets: [['t', '(x + 3)(x − 2)', 50, 57, 21, 1]],                                                                               // a factored quadratic
    vee: [['p', 'M31 61h37M37 32v36', 2.6, 0.55], ['p', 'M42 36L54 60L66 36', 4.4, 1], ['d', 54, 60, 4.2, 1]],                        // y = |x − h|, its vertex on the axis
    parabola: [['p', 'M32 44h36M42 32v36', 2.6, 0.55], ['p', 'M35 34Q50 78 65 34', 4.2, 1], ['d', 50, 56, 4.4, 1]],                   // vertex form and its vertex
    axisym: [['p', 'M34 66Q50 22 66 66', 4.2, 1], ['p', 'M50 32v4M50 40v4M50 48v4M50 56v4M50 64v3', 3, 0.7]],                          // a parabola and its axis of symmetry
    plusminus: [['p', 'M30 44h12M36 38v12M30 55h12', 3.6, 0.9], ['p', 'M45 51l3.5-2.5l5 11l6.5-23h11', 4.2, 1]],                      // ±√ (the quadratic formula)
    linequad: [['p', 'M30 34Q50 82 70 34', 4, 1], ['p', 'M30 62L70 42', 3.4, 0.75], ['d', 43.3, 55.3, 4.4, 1], ['d', 65, 44.5, 4.4, 1]], // a line meets a parabola twice (opened wider than the badge's, so it reads as a graph in relief)
    region: [['p', 'M34 64L66 34', 4.4, 1], ['p', 'M42 56.5l7.5 7.5M50 49l15 15M58 41.5l8 8M64.5 36l1.5 1.5', 2.6, 0.6]],             // a boundary line and its shaded side
    numline: [['p', 'M32 50h36M36 46.5l-4 3.5l4 3.5M64 46.5l4 3.5l-4 3.5', 2.6, 0.6], ['p', 'M33 50h6.5M60.5 50h6.5', 5, 1], ['o', 43, 50, 3.4, 2.8, 1], ['o', 57, 50, 3.4, 2.8, 1]], // x < a or x > b
    stairs: [['p', 'M34 64h8v-8h8v-8h8v-8h8v-8', 4.2, 1], ['d', 42, 56, 3.8, 0.8], ['d', 50, 48, 3.8, 0.8], ['d', 58, 40, 3.8, 0.8], ['d', 66, 32, 3.8, 0.8]], // equal steps: a common difference
    doubling: [['p', 'M37 65v-3M46 65v-6M55 65v-12M64 65v-24', 6, 0.75], ['p', 'M33 61Q55 62 67 34', 3.2, 1]],                       // each bar double the last
    hyperbola: [['p', 'M50 32v36M32 50h36', 2.6, 0.55], ['p', 'M53 33Q54 47 67 47M33 53Q46 54 47 67', 4.2, 1]]                       // y = 1/x
  };
  var ICON_FIT = { stairs: 0.9, linequad: 0.95 };   // symbols that reach into the corners of their box are struck a little smaller
  /* the Math 20-1 mint mark (the reverse): three peaks drawn as absolute-value graphs, a rising sun and a sine-wave river */
  var EMBLEM = [['o', 39, 41, 5.2, 2.6, 1], ['p', 'M30.5 34l2.2 1.6M39 28.5v2.8M47.5 34l-2.2 1.6', 2.2, 1],
    ['p', 'M27 58L37 46.5L43 52.5L53 37L62 49L66.5 44.5L73 58Z', 3, 1], ['p', 'M27 58h46', 3, 1],
    ['p', 'M30 64q4-3 8 0t8 0t8 0t8 0t8 0', 2.4, 1], ['p', 'M35 69.5q4-3 8 0t8 0t8 0t8 0', 2.4, 1]];

  /* where things sit (fractions of the coin's radius) */
  var RC = 0.54, CORE_IN = RC - 0.036, BAND = [RC + 0.004, RC + 0.056], RING_IN = RC + 0.064;
  var TXT_IN = 0.655, TXT_OUT = 0.76, PIP_R = 0.71, PIP_STEP = 0.17, PIP_SIZE = 0.033;
  var ICON_C = [512, 432], ICON_S = 7.4, CODE_Y = 676;
  function pipSpots(n) { var out = []; for (var i = 0; i < n; i++) { var a = -Math.PI / 2 + (i - (n - 1) / 2) * PIP_STEP; out.push([PIP_R * Math.cos(a), PIP_R * Math.sin(a)]); } return out; }

  /* draw a list of ops (ICONS / EMBLEM) white on x (already scaled to 1024 units), centred at c, scale s */
  function drawOps(x, ops, c, s) {
    x.save(); x.translate(c[0], c[1]); x.scale(s, s); x.translate(-50, -50);
    x.lineCap = 'round'; x.lineJoin = 'round'; x.fillStyle = x.strokeStyle = '#fff';
    (ops || []).forEach(function (op) {
      x.globalAlpha = op[op.length - 1];
      if (op[0] === 'p') { x.lineWidth = op[2]; x.stroke(new Path2D(op[1])); }
      else if (op[0] === 'd') { x.beginPath(); x.arc(op[1], op[2], op[3], 0, Math.PI * 2); x.fill(); }
      else if (op[0] === 'o') { x.lineWidth = op[4]; x.beginPath(); x.arc(op[1], op[2], op[3], 0, Math.PI * 2); x.stroke(); }
      else if (op[0] === 't') { x.font = 'italic 800 ' + op[4] + 'px ' + FONT; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; var w = x.measureText(op[1]).width, mw = 46; if (w > mw) { x.save(); x.translate(op[2], op[3]); x.scale(mw / w, 1); x.fillText(op[1], 0, 0); x.restore(); } else x.fillText(op[1], op[2], op[3]); }
    });
    x.restore(); x.globalAlpha = 1;
  }
  /* text around the ring: top = along the top, reading clockwise (letters' feet on rIn); else along the bottom (feet on rOut) */
  function arcText(x, txt, mid, top, size, gap, maxA) {
    var rIn = TXT_IN * 512, cap = 0.7 * size, rm = rIn + cap / 2, ch = Array.from(txt);
    x.font = '700 ' + size + 'px ' + FONT; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillStyle = '#fff';
    var ws = ch.map(function (c) { return x.measureText(c).width; }), tot = ws.reduce(function (s, w) { return s + w + gap; }, -gap), k = 1;
    if (maxA && tot / rm > maxA) k = maxA * rm / tot;                // too long: squeeze the letters together
    var a = mid + (top ? 1 : -1) * tot * k / 2 / rm, rr = top ? rIn : rIn + cap;
    ch.forEach(function (c, i) {
      var w = ws[i] * k, ac = a + (top ? -1 : 1) * w / 2 / rm;
      x.save(); x.translate(512 + rr * Math.cos(ac), 512 - rr * Math.sin(ac)); x.rotate(top ? Math.PI / 2 - ac : 3 * Math.PI / 2 - ac); x.scale(k, 1);
      x.fillText(c, 0, 0); x.restore();
      a += (top ? -1 : 1) * (w + gap * k) / rm;
    });
  }
  /* the art for one part of a face, white on a canvas scaled to 1024 units: 'core' (symbol + code), 'ring' (lettering),
     'back' (the engraving) */
  function faceArt(o, x, part) {
    var d = design(o);
    x.fillStyle = x.strokeStyle = '#fff';
    if (part === 'core') {
      drawOps(x, ICONS[d.i], ICON_C, ICON_S * (ICON_FIT[d.i] || 1));
      x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '800 ' + (o.length > 3 ? 92 : 100) + 'px ' + FONT; x.fillText(o, 512, CODE_Y);
    } else if (part === 'ring') {
      arcText(x, 'MATH 20-1  ·  ' + o, Math.PI / 2, true, 72, 8, 2.5);
    } else if (part === 'back') {
      drawOps(x, EMBLEM, [512, 452], 5.6);
      x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '800 70px ' + FONT; x.fillText(o, 512, 666);
      arcText(x, 'MATH 20-1', Math.PI / 2, true, 72, 22, 2);
      arcText(x, d.w, -Math.PI / 2, false, 68, 6, 2.3);
    }
  }

  /* ---------------- the 3D part (after three.js loads) ---------------- */
  var G = null, loading = null, stats = [];
  function load() {
    if (!loading) loading = Promise.all([import(THREE_URL), import(ROOM_URL), document.fonts && document.fonts.load ? Promise.all([document.fonts.load('800 100px "Barlow Condensed"'), document.fonts.load('700 100px "Barlow Condensed"'), document.fonts.load('italic 800 100px "Barlow Condensed"')]).catch(function () {}) : null])
      .then(function (m) { G = engine(m[0], m[1].RoomEnvironment); return G; });
    return loading;
  }

  function engine(THREE, RoomEnvironment) {
    var gl = document.createElement('canvas'), renderer;
    renderer = new THREE.WebGLRenderer({ canvas: gl, antialias: true, alpha: true, preserveDrawingBuffer: false });
    renderer.setPixelRatio(1); renderer.setClearColor(0x000000, 0); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.autoClear = false;
    renderer.debug.checkShaderErrors = false;      // no blocking reads of the shader logs
    var scene = new THREE.Scene(), pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
    scene.environmentIntensity = 0.85;
    var key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(-2.5, 3, 4); scene.add(key);
    var rim = new THREE.DirectionalLight(0xffd8c8, 1.3); rim.position.set(3, -1, -2); scene.add(rim);
    var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20); camera.position.set(0, 0, 4.3);
    var CAP = 0.12, DISP = 0.075;
    var RF = 0.22, CF = 0.26, CH = 0.12;          // ring field, core field, the enamel channel's floor

    var sstep = function (a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    function rimHeight(u) {                        // u = distance in from the edge
      if (u < 0.012) return 0.6 * sstep(0, 0.012, u);
      if (u < 0.054) return 0.6 + 0.14 * Math.sin(Math.PI * (u - 0.012) / 0.042);
      return 0.6 + (RF - 0.6) * sstep(0.054, 0.074, u);
    }
    /* the plain planchet at radius r (from the centre), u (in from the edge): rim, ring, the joint, the core */
    function base(r, u, blank) {
      var h = rimHeight(u);
      if (u < 0.06) return h;
      if (blank) {
        if (r < RC) h = RF + 0.03 * sstep(RC, RC - 0.01, r);
        h -= 0.06 * Math.max(0, 1 - Math.abs(r - RC) / 0.006);    // the joint between the two metals
        return h;
      }
      if (r < CORE_IN) return CF;
      if (r < RC) { var t = (r - CORE_IN) / (RC - CORE_IN); return CF + 0.12 * Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.55) / 0.45, 2))) - (CF - CH) * sstep(0.86, 1, t); }   // the core's raised lip
      if (r < RING_IN - 0.006) return Math.min(h, CH);
      return Math.min(h, CH + (RF - CH) * sstep(RING_IN - 0.006, RING_IN, r));
    }
    function cv(N) { var c = document.createElement('canvas'); c.width = c.height = N; c.getContext('2d', { willReadFrequently: true }); return c; }   // CPU canvases: read back without stalling the GPU
    function alphaOf(c) { var N = c.width, d = c.getContext('2d').getImageData(0, 0, N, N).data, out = new Float32Array(N * N); for (var i = 0; i < N * N; i++) out[i] = d[i * 4 + 3] / 255; return out; }
    function soft(c, blur) { var o = cv(c.width), x = o.getContext('2d'); x.filter = 'blur(' + blur + 'px)'; x.drawImage(c, 0, 0); return alphaOf(o); }
    function distanceIn(mask, N) {
      var D = new Float32Array(N * N), INF = 1e9, s2 = Math.SQRT2, x, y, i;
      for (i = 0; i < N * N; i++) D[i] = mask[i] > 0.5 ? INF : 0;
      for (y = 1; y < N - 1; y++) for (x = 1; x < N - 1; x++) { i = y * N + x; if (!D[i]) continue; D[i] = Math.min(D[i], D[i - 1] + 1, D[i - N] + 1, D[i - N - 1] + s2, D[i - N + 1] + s2); }
      for (y = N - 2; y > 0; y--) for (x = N - 2; x > 0; x--) { i = y * N + x; if (!D[i]) continue; D[i] = Math.min(D[i], D[i + 1] + 1, D[i + N] + 1, D[i + N + 1] + s2, D[i + N - 1] + s2); }
      return D;
    }
    function tex(N, fill, color) {                 // fill(i, p) writes the pixel's RGB into p (or returns an array)
      var c = cv(N), x = c.getContext('2d'), img = x.createImageData(N, N), d = img.data, q = [0, 0, 0];
      for (var i = 0, j = 0; i < N * N; i++, j += 4) { var p = fill(i, q) || q; d[j] = p[0]; d[j + 1] = p[1]; d[j + 2] = p[2]; d[j + 3] = 255; }
      x.putImageData(img, 0, 0); var t = new THREE.CanvasTexture(c); t.anisotropy = 4; if (color) t.colorSpace = THREE.SRGBColorSpace; else t.colorSpace = THREE.NoColorSpace; return t;
    }

    function art(o, N, part) { var c = cv(N), x = c.getContext('2d'); x.scale(N / 1024, N / 1024); faceArt(o, x, part); return c; }

    /* one outcome's faces at size N: height + normal maps for both sides (struck, or blank), the masks, and the relief */
    var faceCache = {};
    function faces(o, N, blank) {
      var k = o + '|' + N + '|' + (blank ? 'b' : 's'); if (faceCache[k]) return faceCache[k];
      var d = design(o), pts = outline(d.s), C = N / 2, S = N / 1024;
      var mc = cv(N), mx = mc.getContext('2d'); mx.fillStyle = '#fff'; mx.beginPath(); pts.forEach(function (p, i) { mx[i ? 'lineTo' : 'moveTo'](C + p[0] * C, C - p[1] * C); }); mx.closePath(); mx.fill();
      var mask = alphaOf(mc), dist = distanceIn(mask, N);
      var coreC, sharp, sfC, sfR, engr, engS;
      if (!blank) {
        coreC = art(o, N, 'core'); sharp = alphaOf(coreC); sfC = soft(coreC, 2.4 * S);
        sfR = soft(art(o, N, 'ring'), 1.6 * S);
        var bc = art(o, N, 'back'); engS = alphaOf(bc); engr = soft(bc, 1.6 * S);
      }
      var hF = new Float32Array(N * N), hB = new Float32Array(N * N), band = new Float32Array(N * N), coreE = blank ? null : new Float32Array(N * N), coreEB = blank ? null : new Float32Array(N * N);
      var relF = blank ? null : new Float32Array(N * N), relB = blank ? null : new Float32Array(N * N);
      var UB = 0.09, BR = 0.0105, NB = 150;           // the fine bead ring just inside the rim
      for (var i = 0; i < N * N; i++) {
        if (mask[i] < 0.5) continue;
        var px = (i % N + 0.5 - C) / C, py = (C - ((i / N) | 0) - 0.5) / C, r = Math.hypot(px, py), u = dist[i] / C;
        var h = base(r, u, blank);
        if (blank) { hF[i] = hB[i] = h; continue; }
        if (u > UB - 0.02 && u < UB + 0.02) {           // beads: hemispheres spaced around the rim
          var th = Math.atan2(py, px), q = ((th / (2 * Math.PI) * NB) % 1 + 1) % 1 - 0.5, bd = Math.hypot(u - UB, q * 2 * Math.PI / NB * r);
          if (bd < BR) h = Math.max(h, RF + 0.2 * Math.sqrt(1 - bd * bd / (BR * BR)));
        }
        var f = h, b = h;
        if (r < CORE_IN) { var rc = sstep(0.08, 0.92, sfC[i]); f = CF + 0.5 * rc; relF[i] = rc; coreE[i] = sharp[i] < 0.5 && r < CORE_IN - 0.004 ? 1 : 0; }
        else if (r > RING_IN && u > 0.06) { var rr = sstep(0.08, 0.92, sfR[i]); f = Math.max(h, RF + 0.3 * rr); relF[i] = rr; }
        if (r < CORE_IN || (r > RING_IN && u > 0.06)) { var eg = sstep(0.08, 0.92, engr[i]); b = h - 0.12 * eg; relB[i] = eg; if (r < CORE_IN - 0.004) coreEB[i] = engS[i] < 0.5 ? 1 : 0; }
        if (r > BAND[0] && r < BAND[1]) band[i] = 1;
        hF[i] = f; hB[i] = b;
      }
      function height(hh) { return tex(N, function (i, p) { p[0] = p[1] = p[2] = hh[i] * 255 + 0.5; }); }
      function normal(hh) {
        var kk = DISP / (2 * 2 / N);
        return tex(N, function (i, p) {
          var x = i % N, y = (i / N) | 0; if (x < 1 || y < 1 || x > N - 2 || y > N - 2) { p[0] = p[1] = 128; p[2] = 255; return; }
          var dx = (hh[i + 1] - hh[i - 1]) * kk, dy = (hh[i - N] - hh[i + N]) * kk, l = 1 / Math.sqrt(dx * dx + dy * dy + 1);
          p[0] = (0.5 - 0.5 * dx * l) * 255 + 0.5; p[1] = (0.5 - 0.5 * dy * l) * 255 + 0.5; p[2] = (0.5 + 0.5 * l) * 255 + 0.5;
        });
      }
      function alpha(a) { return tex(N, function (i, p) { p[0] = p[2] = 0; p[1] = a[i] > 0.5 ? 255 : 0; }); }
      function occlusion(hh, ht) {                  // cavities beside the relief (and in the joint) catch less reflected light
        var c = cv(N), x = c.getContext('2d'); x.filter = 'blur(' + Math.max(1, 10 * S) + 'px)'; x.drawImage(ht.image, 0, 0);
        var bl = x.getImageData(0, 0, N, N).data;
        return tex(N, function (i, p) { var cav = bl[i * 4] / 255 - hh[i]; p[0] = 255 * (1 - Math.min(0.65, Math.max(0, cav) * 4)); p[1] = p[2] = 0; });
      }
      var F = { pts: pts, N: N, mask: mask, relF: relF, relB: relB, coreE: coreE, coreEB: coreEB,
        front: { height: height(hF), normal: normal(hF), alpha: alpha(mask) }, back: { height: height(hB), normal: normal(hB) } };
      F.front.ao = occlusion(hF, F.front.height); F.back.ao = occlusion(hB, F.back.height);
      if (!blank) { F.front.band = alpha(band); }
      return faceCache[k] = F;
    }

    /* textures shared by every coin: the two metals' colours (per level), satin noise, the guilloché under Proof's enamel */
    function noise2(seed) { var g = new Float32Array(66 * 66), s = seed; for (var i = 0; i < g.length; i++) { s = (s * 16807) % 2147483647; g[i] = s / 2147483647; } return g; }
    function vnoise(x, y, g) { var xi = Math.floor(x) & 63, yi = Math.floor(y) & 63, xf = x - Math.floor(x), yf = y - Math.floor(y), u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      var a = g[yi * 66 + xi], b = g[yi * 66 + xi + 1], c = g[(yi + 1) * 66 + xi], d = g[(yi + 1) * 66 + xi + 1]; return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
    function fbm(x, y, g) { var v = 0, a = 0.5, f = 1; for (var o = 0; o < 4; o++) { v += a * vnoise(x * f, y * f, g); f *= 2; a *= 0.5; } return v; }
    var shared = {};
    function metalsMap(tier) {                      // ring colour outside RC, core colour inside, a little shadow in the joint
      var k = 'm' + tier; if (shared[k]) return shared[k];
      var t = TIERS[tier], M = 512, c = cv(M), x = c.getContext('2d'), Cc = M / 2;
      x.fillStyle = t.ring; x.fillRect(0, 0, M, M);
      x.fillStyle = t.core; x.beginPath(); x.arc(Cc, Cc, RC * Cc, 0, Math.PI * 2); x.fill();
      x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 1.2; x.beginPath(); x.arc(Cc, Cc, RC * Cc, 0, Math.PI * 2); x.stroke();
      if (t.blank) {                                 // a dull, mottled planchet
        var img = x.getImageData(0, 0, M, M), dd = img.data, g = noise2(9);
        for (var i = 0; i < M * M; i++) { var n = 0.84 + 0.24 * fbm((i % M) / 30, ((i / M) | 0) / 30, g); dd[i * 4] *= n; dd[i * 4 + 1] *= n; dd[i * 4 + 2] *= n; }
        x.putImageData(img, 0, 0);
      }
      var tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; return shared[k] = tx;
    }
    function satin() {                               // fine noise in the roughness (G), so fields don't look like plastic
      if (shared.satin) return shared.satin;
      var g = noise2(3), M = 256, t = tex(M, function (i) { var v = 0.8 + 0.2 * fbm((i % M) / 6, ((i / M) | 0) / 6, g); return [255, v * 255, 255]; });
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); return shared.satin = t;
    }
    function reliefRough(o, N, side, proof) {        // relief a little shinier than the field; on Proof, frosted relief on a mirror field
      var k = 'rr|' + o + '|' + N + '|' + side + (proof ? 'p' : ''); if (shared[k]) return shared[k];
      var F = faces(o, N, false), rel = side === 'f' ? F.relF : F.relB, g = noise2(13), sc = 1024 / N;
      return shared[k] = tex(N, function (i, p) {
        var a = rel[i]; p[0] = p[2] = 255;
        if (proof) p[1] = 255 * (a > 0.18 ? 0.42 + 0.14 * fbm((i % N) * sc / 3, ((i / N) | 0) * sc / 3, g) : 0.035);
        else p[1] = (1 - 0.65 * Math.min(1, a * 1.6)) * 255;
      });
    }
    function guilloche() {                           // engine-turned rays and rings under Proof's burgundy enamel
      if (shared.gu) return shared.gu;
      var M = 512, Cc = M / 2;
      return shared.gu = tex(M, function (i) {
        var x = (i % M) - Cc, y = Cc - ((i / M) | 0), r = Math.hypot(x, y) / Cc, a = Math.atan2(y, x);
        var w = 0.42 * Math.sin(a * 72), rr = 0.18 * Math.sin(r * 90), tx = -Math.sin(a) * w + Math.cos(a) * rr, ty = Math.cos(a) * w + Math.sin(a) * rr, l = Math.hypot(tx, ty, 1);
        return [(0.5 + 0.5 * tx / l) * 255, (0.5 + 0.5 * ty / l) * 255, (0.5 + 0.5 / l) * 255];
      });
    }
    function coreMask(o, N, side) {
      var k = 'ce|' + o + '|' + N + '|' + side; if (shared[k]) return shared[k];
      var F = faces(o, N, false), a = side === 'f' ? F.coreE : F.coreEB;
      return shared[k] = tex(N, function (i, p) { p[0] = p[2] = 0; p[1] = a[i] > 0.5 ? 255 : 0; });
    }

    /* the milled edge: the outline swept down the coin's side, with rounded corners and reeds */
    var geo = {};
    function wallGeo(o, big) {
      var k = 'w|' + o + '|' + (big ? 1 : 0); if (geo[k]) return geo[k];
      var pts = outline(design(o).s), n = pts.length, Ls = [0], i, j;
      for (i = 1; i <= n; i++) { var p = pts[i - 1], q = pts[i % n]; Ls.push(Ls[i - 1] + Math.hypot(q[0] - p[0], q[1] - p[1])); }
      var tot = Ls[n], reeds = big ? 210 : 0, M = big ? reeds * 6 : 300, P = [];
      for (i = 0, j = 0; i < M; i++) { var s = i / M * tot; while (Ls[j + 1] < s) j++; var t = (s - Ls[j]) / (Ls[j + 1] - Ls[j]), a = pts[j], b = pts[(j + 1) % n]; P.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
      var Nn = P.map(function (p, i2) { var a = P[(i2 - 1 + M) % M], b = P[(i2 + 1) % M], tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1; return [ty / l, -tx / l]; });
      var bR = 0.034, rows = [], ph;
      for (ph = 0; ph <= 4; ph++) { var f = ph / 4 * Math.PI / 2; rows.push([bR * Math.sin(f), CAP - bR + bR * Math.cos(f), Math.sin(f)]); }
      for (ph = 4; ph >= 0; ph--) { var f2 = ph / 4 * Math.PI / 2; rows.push([bR * Math.sin(f2), -(CAP - bR + bR * Math.cos(f2)), Math.sin(f2)]); }
      var pos = new Float32Array(rows.length * M * 3), idx = [];
      rows.forEach(function (rw, ri) {
        for (var c = 0; c < M; c++) {
          var reed = reeds ? Math.pow(0.5 - 0.5 * Math.cos(2 * Math.PI * reeds * c / M), 0.8) : 0, off = rw[0] - 0.011 * reed * rw[2] * rw[2], v = (ri * M + c) * 3;
          pos[v] = P[c][0] + Nn[c][0] * off; pos[v + 1] = P[c][1] + Nn[c][1] * off; pos[v + 2] = rw[1];
        }
      });
      for (var ri = 0; ri < rows.length - 1; ri++) for (var c = 0; c < M; c++) {
        var a00 = ri * M + c, a01 = ri * M + (c + 1) % M, a10 = (ri + 1) * M + c, a11 = (ri + 1) * M + (c + 1) % M;
        idx.push(a00, a10, a01, a10, a11, a01);
      }
      var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      return geo[k] = g;
    }
    function capGeo(o) {
      if (geo['c' + o]) return geo['c' + o];
      var g = new THREE.ShapeGeometry(new THREE.Shape(outline(design(o).s).map(function (p) { return new THREE.Vector2(p[0], p[1]); })), 4);
      return geo['c' + o] = g;
    }
    function plane(seg) { return geo['p' + seg] || (geo['p' + seg] = new THREE.PlaneGeometry(2, 2, seg, seg)); }

    var glintTex = null;
    function glints() {
      if (!glintTex) {
        var c = cv(128), x = c.getContext('2d'), rg = x.createRadialGradient(64, 64, 0, 64, 64, 64);
        rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.12, 'rgba(255,240,220,0.8)'); rg.addColorStop(0.4, 'rgba(255,220,190,0.12)'); rg.addColorStop(1, 'rgba(255,220,190,0)');
        x.fillStyle = rg; x.fillRect(0, 0, 128, 128); x.fillStyle = 'rgba(255,255,255,0.9)';
        x.beginPath(); x.moveTo(64, 0); x.quadraticCurveTo(68, 60, 128, 64); x.quadraticCurveTo(68, 68, 64, 128); x.quadraticCurveTo(60, 68, 0, 64); x.quadraticCurveTo(60, 60, 64, 0); x.fill();
        glintTex = new THREE.CanvasTexture(c);
      }
      var grp = new THREE.Group(), list = [];
      for (var i = 0; i < 4; i++) {
        var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glintTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
        var a0 = i * 1.9 + 0.6, r0 = i % 2 ? 0.88 : 0.3;
        sp.userData = { t: i * 0.9, dur: 1.4 + i * 0.3, x: r0 * Math.cos(a0), y: r0 * Math.sin(a0) }; grp.add(sp); list.push(sp);
      }
      grp.userData.tick = function (dt, side) {
        list.forEach(function (sp) {
          var u = sp.userData; u.t += dt;
          if (u.t > u.dur + 0.8) {                   // a new glint somewhere on the rim, the lettering or the symbol
            u.t = 0; var a = Math.random() * Math.PI * 2, r = Math.random() < 0.5 ? 0.86 + 0.06 * Math.random() : Math.sqrt(Math.random()) * 0.45;
            u.x = r * Math.cos(a); u.y = r * Math.sin(a);
          }
          var p = Math.max(0, Math.min(1, u.t / u.dur)), k = Math.sin(Math.PI * p);
          sp.position.set(u.x, u.y, (side || 1) * (CAP + 0.6 * DISP + 0.05));
          sp.material.opacity = side ? k : 0; sp.scale.setScalar(0.06 + 0.2 * k * k); sp.material.rotation = p * 1.2;
        });
      };
      return grp;
    }

    /* big coins take ~25 MB of textures per outcome: keep the last few outcomes, free the rest */
    var bigOrder = [], BIG_KEEP = 3, BN = 768;
    function useBig(o) {
      var k = bigOrder.indexOf(o); if (k >= 0) bigOrder.splice(k, 1); bigOrder.push(o);
      while (bigOrder.length > BIG_KEEP) release(bigOrder.shift());
    }
    function release(o) {
      var gone = {};
      Object.keys(coins).forEach(function (id) {
        if (id.indexOf(o + '|') !== 0 || id.slice(-2) !== '|1') return;
        var g = coins[id]; scene.remove(g); delete coins[id];
        g.traverse(function (m) { if (m.material) { var ms = [].concat(m.material); ms.forEach(function (mt) { if (!gone[mt.uuid]) { gone[mt.uuid] = 1; mt.dispose(); } }); } });
      });
      ['s', 'b'].forEach(function (v) {
        var F = faceCache[o + '|' + BN + '|' + v]; if (!F) return; delete faceCache[o + '|' + BN + '|' + v];
        [F.front, F.back].forEach(function (S) { Object.keys(S).forEach(function (k) { if (S[k] && S[k].dispose) S[k].dispose(); }); });
      });
      Object.keys(shared).forEach(function (k) { if ((k.indexOf('rr|' + o + '|' + BN + '|') === 0 || k.indexOf('ce|' + o + '|' + BN + '|') === 0) && shared[k]) { shared[k].dispose(); delete shared[k]; } });
      var w = geo['w|' + o + '|1']; if (w) { w.dispose(); delete geo['w|' + o + '|1']; }
    }

    /* one coin: the edge, two faces (each with its enamel), the pips, and Proof's glints */
    var coins = {};
    function coin(o, tier, big) {
      var id = o + '|' + tier + '|' + (big ? 1 : 0);
      if (big) useBig(o);
      if (coins[id]) return coins[id];
      var t0 = performance.now(), d = design(o), t = TIERS[tier], N = big ? BN : 256, F = faces(o, N, !!t.blank), seg = big ? 256 : 96, g = new THREE.Group();
      var phys = function (extra) { return new THREE.MeshPhysicalMaterial(Object.assign({ metalness: 1, clearcoat: t.clearcoat || 0, clearcoatRoughness: 0.06 }, extra)); };
      var edge = phys({ color: t.ring, roughness: t.blank ? t.rough : t.proof ? 0.05 : 0.5 * t.rough, roughnessMap: t.blank ? satin() : null });
      g.add(new THREE.Mesh(wallGeo(o, big), edge));
      var cap = new THREE.Mesh(capGeo(o), edge); cap.position.z = CAP - 0.004; g.add(cap);
      var cap2 = new THREE.Mesh(capGeo(o), edge); cap2.rotation.y = Math.PI; cap2.position.z = -(CAP - 0.004); g.add(cap2);
      var relief = function (side) { return { displacementMap: side.height, displacementScale: DISP, normalMap: side.normal, alphaMap: F.front.alpha, alphaTest: 0.5, alphaToCoverage: true, aoMap: side.ao, aoMapIntensity: 1 }; };
      ['f', 'b'].forEach(function (sd) {
        var S = sd === 'f' ? F.front : F.back, sign = sd === 'f' ? 1 : -1;
        var fm = phys(Object.assign({ color: '#ffffff', map: metalsMap(tier), roughness: t.proof ? 1 : t.rough }, relief(S)));
        fm.roughnessMap = t.blank ? satin() : reliefRough(o, N, sd, t.proof);
        var face = new THREE.Mesh(plane(seg), fm); face.position.z = sign * (CAP + 0.0006); if (sign < 0) face.rotation.y = Math.PI; g.add(face);
        if (t.blank) return;
        var off = { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 };
        var em = new THREE.MeshPhysicalMaterial(Object.assign({ color: new THREE.Color(d.c).lerp(new THREE.Color('#000000'), 0.18), roughness: 0.28, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04 }, off, relief(S)));
        em.alphaMap = F.front.band;
        var band = new THREE.Mesh(plane(seg), em); band.position.copy(face.position); band.rotation.copy(face.rotation); g.add(band);
        if (t.proof) {                               // burgundy enamel over guilloché, around the frosted symbol
          var bm = new THREE.MeshPhysicalMaterial(Object.assign({ color: '#5c1027', roughness: 0.16, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.03 }, off, relief(S)));
          bm.normalMap = guilloche(); bm.normalScale.set(0.55, 0.55); bm.alphaMap = coreMask(o, N, sd);
          var be = new THREE.Mesh(plane(seg), bm); be.position.copy(face.position); be.rotation.copy(face.rotation); g.add(be);
        }
      });
      var pipG = geo.pip || (geo.pip = new THREE.SphereGeometry(PIP_SIZE, 20, 10)), pm = phys({ color: t.core, roughness: t.blank ? t.rough : Math.max(0.12, t.rough) });
      if (t.proof) pm.roughness = 0.4;               // frosted, like the symbol
      pipSpots(tier + 1).forEach(function (p) { var m = new THREE.Mesh(pipG, pm); m.scale.set(1, 1, 0.62); m.position.set(p[0], p[1], CAP + RF * DISP + 0.002); g.add(m); });
      if (t.proof) g.add(glints());
      g.visible = false; scene.add(g);
      stats.push([id, Math.round(performance.now() - t0)]);   // build times (ms), for checking performance
      return coins[id] = g;
    }

    /* draw one coin into a 2D canvas */
    var glW = 704, glH = 704; renderer.setSize(glW, glH, false);   // big enough for the viewer's coin at 2× (no resizing later)
    function draw(ctx, w, h, m, rx, ry, dt) {
      if (w > glW || h > glH) { glW = Math.max(glW, w, 256); glH = Math.max(glH, h, 256); renderer.setSize(glW, glH, false); }
      for (var k in coins) coins[k].visible = coins[k] === m;
      m.rotation.set(rx, ry, 0);
      var c = Math.cos(ry), side = c > 0.2 ? 1 : c < -0.2 ? -1 : 0;
      m.children.forEach(function (ch) { if (ch.userData.tick) ch.userData.tick(dt, side); });
      renderer.setScissorTest(true); renderer.setViewport(0, 0, w, h); renderer.setScissor(0, 0, w, h); renderer.clear();
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.render(scene, camera);
      ctx.clearRect(0, 0, w, h); ctx.drawImage(gl, 0, glH - h, w, h, 0, 0, w, h);
    }
    function has(o, tier, big) { return !!coins[o + '|' + tier + '|' + (big ? 1 : 0)]; }
    return { draw: draw, coin: coin, has: has };
  }

  /* ---------------- slots: a 2D canvas per coin on the page ---------------- */
  var slots = [], running = false, last = 0;
  var reduced = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = 'IntersectionObserver' in root ? new IntersectionObserver(function (es) { es.forEach(function (e) { var s = e.target._coin; if (s) s.vis = e.isIntersecting; }); }) : null;
  var IDLE = 0.42;                                   // the big coin's slow turn (radians a second)
  function slot(o, tier, opt) {
    opt = opt || {};
    var c = document.createElement('canvas'); c.className = 'coin-c' + (opt.cls ? ' ' + opt.cls : '');
    var s = { el: c, o: o, tier: tier, big: !!opt.big, drag: !!opt.drag, ang: 0, vel: 0, dir: 1, phase: Math.random() * 6, vis: !io, intro: 0, due: 0 };
    c._coin = s; slots.push(s); if (io) io.observe(c);
    if (s.drag) dragSpin(s);
    start(); return c;
  }
  function dragSpin(s) {
    var c = s.el; c.style.touchAction = 'pan-y'; c.style.cursor = 'grab';
    c.addEventListener('pointerdown', function (e) { s.dragging = true; s.intro = 0; s.lx = e.clientX; s.lt = performance.now(); s.vel = 0; try { c.setPointerCapture(e.pointerId); } catch (x) {} });
    c.addEventListener('pointermove', function (e) {
      if (!s.dragging) return; var now = performance.now(), dx = e.clientX - s.lx, dt = Math.max(1, now - s.lt), k = 2 * Math.PI / Math.max(240, c.clientWidth * 1.4);
      s.ang += dx * k; s.vel = 0.7 * s.vel + 0.3 * (dx * k / dt * 1000); s.lx = e.clientX; s.lt = now; if (Math.abs(dx) > 1) s.dir = dx > 0 ? 1 : -1;
    });
    var up = function () { s.dragging = false; }; c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
  }
  function spinOnce(c) { var s = c && c._coin; if (s && !reduced) { s.intro = 1; s.introFrom = s.ang; s.vel = 0; } }
  function start() { if (running) return; running = true; last = performance.now(); requestAnimationFrame(frame); load().catch(function () { slots.forEach(function (s) { s.el.classList.add('coin-off'); }); running = false; }); }
  var easeOut = function (x) { return 1 - Math.pow(1 - x, 3); };
  function frame(now) {
    slots = slots.filter(function (s) { if (s.el.isConnected) return true; if (io) io.unobserve(s.el); return false; });
    if (!slots.length) { running = false; return; }
    requestAnimationFrame(frame);
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!G || document.hidden) return;
    var time = now / 1000, built = false, dpr = Math.min(root.devicePixelRatio || 1, 2);
    var cover = document.querySelector('.coin-pop');
    slots.forEach(function (s) {
      if (!s.vis || (cover && !cover.contains(s.el))) return;         // under the viewer: skip
      var fresh = !G.has(s.o, s.tier, s.big);
      if (fresh) { if (built) return; built = true; }                 // build at most one new coin per frame
      else if (!s.drag && s.intro <= 0 && now < s.due) return;        // small coins redraw at about 15 fps
      s.due = now + 66;
      var w = Math.round(s.el.clientWidth * dpr), h = Math.round(s.el.clientHeight * dpr); if (w < 4 || h < 4) return;
      if (s.el.width !== w || s.el.height !== h) { s.el.width = w; s.el.height = h; }
      var rx;
      if (s.drag) {
        if (s.intro > 0) { s.intro = Math.max(0, s.intro - dt / 1.2); var p = easeOut(1 - s.intro); s.ang = s.introFrom + (Math.round(s.introFrom / (2 * Math.PI)) * 2 * Math.PI + 2 * Math.PI - s.introFrom) * p; }
        else if (!s.dragging && s.hold == null) {
          s.ang += s.vel * dt; s.vel *= Math.pow(0.2, dt);
          if (reduced) { if (Math.abs(s.vel) < 1.2) { var tg = Math.round(s.ang / Math.PI) * Math.PI; s.ang += (tg - s.ang) * Math.min(1, dt * 2.2); s.vel *= 0.9; } }
          else if (Math.abs(s.vel) < 1.5) s.vel += (IDLE * s.dir - s.vel) * Math.min(1, dt * 0.8);   // then it turns slowly by itself
        }
        rx = reduced ? 0.1 : 0.1 + 0.07 * Math.sin(time * 0.45);
      } else if (s.intro > 0) { s.intro = Math.max(0, s.intro - dt / 1.1); s.ang = 2 * Math.PI * easeOut(1 - s.intro); rx = 0.08; }
      else { s.ang = reduced ? 0 : 0.42 * Math.sin(time * 0.7 + s.phase); rx = reduced ? 0 : 0.08 * Math.sin(time * 0.5 + s.phase); }
      if (s.hold != null) s.ang = s.hold;                              // (tests: hold a coin at an angle)
      if (s.holdX != null) rx = s.holdX;
      G.draw(s.el.getContext('2d'), w, h, G.coin(s.o, s.tier, s.big), rx, s.ang, reduced ? 0 : dt);
    });
  }

  /* ---------------- the row beside "Hi, …" ---------------- */
  function label(it) { var t = TIERS[it.tier]; return it.o + ' · ' + t.metal + ' · ' + t.name; }
  function row(list) {
    var box = document.createElement('div'); box.className = 'coin-row'; box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'Your coins');
    list.forEach(function (it, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'coin-btn' + (it.tier === 0 ? ' is-blank' : ''); b.title = label(it); b.setAttribute('aria-label', label(it) + ' coin');
      var c = slot(it.o, it.tier); b.appendChild(c); if (it.fresh) b.classList.add('is-new');
      b.addEventListener('click', function () { open(list, i); });
      box.appendChild(b);
    });
    return box;
  }

  /* ---------------- the viewer: the coin in a burgundy velvet case ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function open(list, i, opt) {
    opt = opt || {}; close();
    var ov = document.createElement('div'); ov.className = 'coin-pop'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Outcome coin');
    var box = document.createElement('div'); box.className = 'coin-box'; ov.appendChild(box);
    var x = document.createElement('button'); x.type = 'button'; x.className = 'coin-x'; x.setAttribute('aria-label', 'Close'); x.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'; x.addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    function show(k) {
      i = (k + list.length) % list.length; var it = list[i], d = design(it.o);
      box.innerHTML = ''; box.appendChild(x);
      box.style.setProperty('--cc', d.c);
      if (opt.title) box.appendChild(h('div', 'coin-new', esc(opt.title)));
      var heroWrap = h('div', 'coin-herowrap', ''), metal = h('div', 'coin-metal', ''), alloy = h('div', 'coin-alloy', ''), level = h('div', 'coin-level', '');
      box.appendChild(heroWrap); box.appendChild(metal); box.appendChild(alloy); box.appendChild(level);
      if (HW.OUTCOMES && HW.OUTCOMES[it.o]) box.appendChild(h('div', 'coin-out', esc(it.o) + ' · ' + esc(HW.OUTCOMES[it.o])));
      // the seven levels: every one reached is lit, and tapping one shows it big (until the viewer closes)
      var lad = h('div', 'coin-ladder', ''), rungs = [];
      TIERS.forEach(function (tt, k2) {
        var got = k2 <= it.tier, cell = h(got ? 'button' : 'div', 'coin-rung' + (got ? ' got' : ''), '');
        cell.appendChild(slot(it.o, k2)); cell.appendChild(h('div', 'coin-rung-m', esc(tt.metal))); cell.appendChild(h('div', 'coin-rung-l', esc(tt.name)));
        cell.title = tt.metal + ' · ' + tt.name + (got ? (k2 < it.tier ? ' (tap to see it)' : '') : ' (not yet)');
        if (got) { cell.type = 'button'; cell.addEventListener('click', function () { pick(k2); }); }
        lad.appendChild(cell); rungs.push(cell);
      });
      box.appendChild(lad);
      function pick(tk) {
        var tt = TIERS[tk], mine = { o: it.o, tier: tk };
        heroWrap.innerHTML = '';
        var hero = slot(it.o, tk, { big: true, drag: true, cls: 'coin-hero' }); hero.setAttribute('role', 'img'); hero.setAttribute('aria-label', label(mine) + ' coin');
        heroWrap.appendChild(hero); spinOnce(hero);
        metal.textContent = tt.metal; alloy.textContent = tt.alloy;
        level.innerHTML = '<b>' + esc(tt.name) + '</b> on ' + esc(it.o) + (tk === it.tier ? (it.src ? ' <span class="coin-src">· ' + esc(it.src) + '</span>' : '') : ' <span class="coin-src">· a level you’ve passed</span>');
        rungs.forEach(function (c, k2) { c.classList.toggle('here', k2 === tk); if (c.tagName === 'BUTTON') c.setAttribute('aria-pressed', String(k2 === tk)); });
      }
      pick(it.tier);
      box.appendChild(h('div', 'coin-hint', 'Drag or flick the coin to spin it.' + (list.length > 1 ? ' ' + (i + 1) + ' of ' + list.length + '.' : '')));
      if (list.length > 1) {
        var nav = h('div', 'coin-nav', '');
        var pv = h('button', 'btn btn-ghost coin-prev', '‹ Previous'), nx = h('button', 'btn btn-ghost coin-next', 'Next ›'); pv.type = nx.type = 'button';
        pv.addEventListener('click', function () { show(i - 1); }); nx.addEventListener('click', function () { show(i + 1); });
        nav.appendChild(pv); nav.appendChild(nx); box.appendChild(nav);
      }
    }
    function h(tag, cls, html) { var e = document.createElement(tag); e.className = cls; e.innerHTML = html; return e; }
    document.body.appendChild(ov); document.body.classList.add('coin-on');
    show(i || 0);
    setTimeout(function () { try { x.focus(); } catch (e) {} }, 30);
    ov._key = function (e) { if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight' && list.length > 1) show(i + 1); else if (e.key === 'ArrowLeft' && list.length > 1) show(i - 1); };
    document.addEventListener('keydown', ov._key);
    if (opt.onclose) ov._onclose = opt.onclose;
  }
  function close() {
    var ov = document.querySelector('.coin-pop'); if (!ov) return;
    document.removeEventListener('keydown', ov._key); ov.remove(); document.body.classList.remove('coin-on');
    if (ov._onclose) ov._onclose();
  }

  HW.Coins = { TIERS: TIERS, DESIGNS: DESIGNS, tierOf: function (lv) { return TIER_OF[lv] == null ? -1 : TIER_OF[lv]; }, row: row, open: open, close: close, slot: slot, load: load,
    _stats: stats, _built: function (o, tier, big) { return !!(G && G.has(o, tier, !!big)); }, _outline: outline, _icons: ICONS, _art: faceArt, _pipSpots: pipSpots, _geom: { RC: RC, CORE_IN: CORE_IN, BAND: BAND, RING_IN: RING_IN, TXT_IN: TXT_IN, TXT_OUT: TXT_OUT, PIP_SIZE: PIP_SIZE } };
  HW.Medals = HW.Badges = HW.Coins;
})(window);
