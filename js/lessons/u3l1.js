/* Math 20-1 · Unit 3 · Lesson 1 — Angles in Standard Position and Reference Angles (outcome T1 on every part)
 * Assignment 1 (m201book unit3/u3_l01.tex, Questions 1–18) and the Lesson 1 Extra Practice (u3_ep01.tex, A1–A4, B1–B6,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's
 * example angles and points, and the booklet question's own numbers, are left out). On-screen calculator allowed
 * (Unit 3); every answer here is a whole number of degrees.
 *
 * This file also holds the Unit 3 point-on-the-terminal-arm kit (HW.u3l1kit) that u3l2.js uses, so it must load first:
 * the coordinate sketch (axes, optional grid, terminal arms, rotation arcs — clockwise, more than a turn —, reference
 * angle arcs, point P with the drop to the x-axis), angle facts (quadrant, reference angle, angle from a reference angle),
 * the exact-value checker (c·√m or "undefined": right value, then simplest radical, reduced, rationalized if asked) and
 * the keypads (digits, √, fraction, −, "undefined"; and x, y, r for ratio definitions).
 *
 * Conversions: "sketch each angle" → choose the sketch (each sketch names its quadrant; the distractors turn clockwise,
 * start on the y-axis, or stop a quadrant short); "plot the point and state the quadrant" → the quadrant (multiple choice),
 * the plotted sketch is in the worked solution; tables → labelled boxes; "list the other angles" → a list of angles (any
 * order); reflections → the image's coordinates and the rotation angle; "explain the error" → multiple choice of
 * explanations with the corrected value; "sketch a reference angle in four quadrants" (Q7) → choose the sketch, then the four angles;
 * Extra C3 ("show that") → multiple choice of arguments.
 * Recognised mistakes: measured to the y-axis, the formula for the wrong quadrant, gave θ (not acute), clockwise for
 * counterclockwise, started on the y-axis, a full turn not subtracted / added, listed the given angle too, angles with
 * the wrong reference angle, sign slips in reflected coordinates (reflected in the wrong axis).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 12(b), Extra C1(a), Extra C2. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u3l1';

  /* ============================== the Unit 3 point kit (Lessons 1–2) ============================== */
  var U = HW.u3l1kit = {};
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function Q(p, q) { return ex.norm(p, q == null ? 1 : q); }
  function pickWhere(gen, okf, lid) { for (var i = 0; i < 6000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error((lid || LID) + ': no valid numbers'); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function D(x) { return x + '^\\circ'; }
  function n360(a) { a = a % 360; if (a < 0) a += 360; return Math.round(a * 1e9) / 1e9; }
  function quad(a) { var b = n360(a); return Math.abs(b % 90) < 1e-9 ? 0 : Math.floor(b / 90) + 1; }
  function refOf(a) { var b = n360(a); return b <= 90 ? b : b <= 180 ? 180 - b : b <= 270 ? b - 180 : 360 - b; }
  function fromRef(R, q) { return [R, 180 - R, 180 + R, 360 - R][q - 1]; }
  function angOf(x, y) { var a = Math.atan2(y, x) * 180 / Math.PI; return a < 0 ? a + 360 : a; }
  var REF_F = ['\\theta_R=\\theta', '\\theta_R=180^\\circ-\\theta', '\\theta_R=\\theta-180^\\circ', '\\theta_R=360^\\circ-\\theta'];
  var FROM_F = ['\\theta=\\theta_R', '\\theta=180^\\circ-\\theta_R', '\\theta=180^\\circ+\\theta_R', '\\theta=360^\\circ-\\theta_R'];
  var AXN = { 0: 'the positive ' + t('x') + '-axis', 90: 'the positive ' + t('y') + '-axis', 180: 'the negative ' + t('x') + '-axis', 270: 'the negative ' + t('y') + '-axis' };
  function axisName(a) { return AXN[n360(a)]; }
  function where(a) { var q = quad(a); return q ? 'quadrant ' + q : 'on ' + axisName(a); }
  function placeCap(a) { var q = quad(a); return q ? 'Quadrant ' + q : axisName(a).replace(/^the p/, 'P').replace(/^the n/, 'N'); }
  /* the reference-angle step in the booklet's words */
  function refStep(a) {
    var b = n360(a), q = quad(b), R = refOf(b);
    if (!q) return 'The terminal arm is on ' + axisName(b) + ', so ' + t('\\theta_R=' + D(R)) + '.';
    var e = [t('\\theta_R=' + D(b)), t('\\theta_R=180^\\circ-' + D(b) + '=' + D(R)), t('\\theta_R=' + D(b) + '-180^\\circ=' + D(R)), t('\\theta_R=360^\\circ-' + D(b) + '=' + D(R))][q - 1];
    return 'Quadrant ' + q + ': ' + e + '.';
  }
  function fromStep(R, q) { return [t('\\theta=' + D(R)), t('\\theta=180^\\circ-' + D(R) + '=' + D(180 - R)), t('\\theta=180^\\circ+' + D(R) + '=' + D(180 + R)), t('\\theta=360^\\circ-' + D(R) + '=' + D(360 - R))][q - 1]; }
  function refArc(phi) { var b = n360(phi); return b <= 90 ? [0, b] : b <= 180 ? [b, 180] : b <= 270 ? [180, b] : [b, 360]; }
  function ptTex(x, y, nm) { return (nm || '') + '(' + x + ',\\ ' + y + ')'; }
  U.gcd = gcd; U.Q = Q; U.pickWhere = pickWhere; U.D = D; U.n360 = n360; U.quad = quad; U.refOf = refOf; U.fromRef = fromRef; U.angOf = angOf;
  U.REF_F = REF_F; U.FROM_F = FROM_F; U.axisName = axisName; U.where = where; U.placeCap = placeCap; U.refStep = refStep; U.fromStep = fromStep; U.ptTex = ptTex; U.esc = esc;

  /* ---------------- the coordinate sketch ----------------
   * U.svg(o) -> svg string. o = { size: 200 (viewBox), w: max px width,
   *   grid: n (a grid from −n to n, one line per unit), pt: [x, y] (point P), ptLabel: 'P(3, 5)',
   *   pts: [{ xy: [x, y], label, color }] (more points; arms drawn to them with o.ptArms),
   *   arm: deg | arms: [{ deg, color, dash }] (terminal arms; with o.pt the arm goes through P),
   *   rot: { to, from: 0, label: 'θ', color } | rots: [...] (rotation arrows; clockwise when to < from, a spiral past a full turn),
   *   ref: true | label (the reference-angle arc for the arm), refs: [{ a, b, label, r, color }],
   *   drop: true (dashed drop from P to the x-axis, right-angle box), legs: { x: '|x|', y: '|y|', r: 'r' }, quads: true } */
  var INK = '#2b3340', ARM = '#2b55a0', REFC = '#b0452c', GRID = '#e2e5eb', PTC = '#7a1f33', AXC = '#59606e';
  function f1(x) { return (Math.round(x * 10) / 10).toString(); }
  function stxt(x, y, s, o) {
    o = o || {}; var it = /^[a-zθ]$/.test(String(s)) ? ' font-style="italic"' : '';
    return '<text x="' + f1(x) + '" y="' + f1(y) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + it + (o.weight ? ' font-weight="' + o.weight + '"' : '') + ' paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round">' + esc(String(s).replace(/-/g, '−')) + '</text>';
  }
  function ln(x1, y1, x2, y2, c, w, dash) { return '<line x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '" stroke="' + c + '" stroke-width="' + w + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linecap="round"/>'; }
  function head(x1, y1, x2, y2, c, sz) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L; sz = sz || 6;
    var bx = x2 - dx * sz, by = y2 - dy * sz, px = -dy * sz * 0.55, py = dx * sz * 0.55;
    return '<polygon points="' + [x2, y2, bx + px, by + py, bx - px, by - py].map(f1).join(' ') + '" fill="' + c + '"/>';
  }
  U.svg = function (o) {
    o = o || {};
    var S = o.size || 200, C = S / 2, R = S * 0.36, sc = 1;
    var pts = (o.pts || []).slice(); if (o.pt) pts.unshift({ xy: o.pt, label: o.ptLabel, main: true });
    var ext = o.grid || 0; pts.forEach(function (p) { ext = Math.max(ext, Math.abs(p.xy[0]), Math.abs(p.xy[1])); });
    if (ext) { if (!o.grid) ext = ext * 1.18; sc = R / ext; }
    var P = function (x, y) { return [C + x * sc, C - y * sc]; };
    var pol = function (deg, rho) { var a = deg * Math.PI / 180; return [C + rho * Math.cos(a), C - rho * Math.sin(a)]; };
    var s = '';
    if (o.grid) for (var i = -o.grid; i <= o.grid; i++) { if (!i) continue; var g = C + i * sc; s += ln(g, C - R, g, C + R, GRID, 1) + ln(C - R, g, C + R, g, GRID, 1); }
    var E = R + 13;
    s += ln(C - E, C, C + E, C, AXC, 1.4) + head(C, C, C + E + 2, C, AXC, 7) + ln(C, C + E, C, C - E, AXC, 1.4) + head(C, C, C, C - E - 2, AXC, 7);
    s += stxt(C + E + 4, C + 12, 'x', { size: 13 }) + stxt(C + 11, C - E - 3, 'y', { size: 13 });
    if (o.quads) [1, 2, 3, 4].forEach(function (q) { var p = pol(45 + 90 * (q - 1), R * 0.78); s += stxt(p[0], p[1], 'Q' + q, { size: 11, color: '#8a909c' }); });
    // reference arcs (under the arms)
    var refs = (o.refs || []).slice();
    var arms = (o.arms || []).slice(); if (o.arm != null) arms.push({ deg: o.arm, main: true }); if (o.pt && !arms.length && o.ptArm !== false) arms.push({ deg: angOf(o.pt[0], o.pt[1]), main: true, toPt: true });
    if (o.ref) { var mainDeg = arms.length ? arms[0].deg : 0, ra = refArc(mainDeg); refs.push({ a: ra[0], b: ra[1], label: o.ref === true ? 'θR' : o.ref }); }
    refs.forEach(function (rf) {
      var rr = rf.r || R * 0.5, n = Math.max(6, Math.ceil(Math.abs(rf.b - rf.a) / 4)), d = '';
      for (var k = 0; k <= n; k++) { var p = pol(rf.a + (rf.b - rf.a) * k / n, rr); d += (k ? ' L' : 'M') + f1(p[0]) + ' ' + f1(p[1]); }
      s += '<path d="' + d + '" fill="none" stroke="' + (rf.color || REFC) + '" stroke-width="1.8" stroke-dasharray="4 3"/>';
      if (rf.label) { var mid = (rf.a + rf.b) / 2, lr = rr + 12 + String(rf.label).length * 2.2, lp = pol(mid, lr); s += stxt(lp[0], lp[1], rf.label, { size: 12, color: rf.color || REFC }); }
    });
    // drop from P to the x-axis
    if (o.drop && o.pt) {
      var pp = P(o.pt[0], o.pt[1]), fx = pp[0], sx = o.pt[0] > 0 ? -1 : 1, sy = o.pt[1] > 0 ? -1 : 1, bx = 7;
      s += ln(pp[0], pp[1], fx, C, '#6a7182', 1.5, '5 4');
      if (o.pt[0] && o.pt[1]) s += '<polyline points="' + [fx + sx * bx, C, fx + sx * bx, C + sy * bx, fx, C + sy * bx].map(f1).join(' ') + '" fill="none" stroke="' + INK + '" stroke-width="1.1"/>';
      var lg = o.legs || {};
      if (lg.x) s += stxt((C + fx) / 2, C + (o.pt[1] > 0 ? 11 : -11), lg.x, { size: 12 });
      if (lg.y) s += stxt(fx + (o.pt[0] > 0 ? 6 : -6), (pp[1] + C) / 2, lg.y, { size: 12, anchor: o.pt[0] > 0 ? 'start' : 'end' });
      if (lg.r) { // beside the middle of the arm, on the side away from the drop
        var mx = (C + pp[0]) / 2, my = (C + pp[1]) / 2, nx = -(pp[1] - C), ny = pp[0] - C, nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
        var cx = (C + fx + pp[0]) / 3, cy = (C + C + pp[1]) / 3; if ((mx + nx - cx) * nx + (my + ny - cy) * ny < 0 || nx * (mx - cx) + ny * (my - cy) < 0) { nx = -nx; ny = -ny; }
        s += stxt(mx + nx * 11, my + ny * 11, lg.r, { size: 12 });
      }
    }
    // arms
    arms.forEach(function (a) {
      var end;
      if (a.toPt && o.pt) { var q = P(o.pt[0], o.pt[1]), L = Math.hypot(q[0] - C, q[1] - C), k = (L + 12) / L; end = [C + (q[0] - C) * k, C + (q[1] - C) * k]; }
      else end = pol(a.deg, a.len || R + 4);
      s += ln(C, C, end[0], end[1], a.color || ARM, a.w || 2.6, a.dash);
    });
    if (o.ptArms) pts.forEach(function (p) { if (p.main) return; var q = P(p.xy[0], p.xy[1]), L = Math.hypot(q[0] - C, q[1] - C) || 1, k = (L + 12) / L; s += ln(C, C, C + (q[0] - C) * k, C + (q[1] - C) * k, p.armColor || '#7d8aa8', 1.8, p.dash); });
    // rotation arrows
    var rots = (o.rots || []).slice(); if (o.rot) rots.push(o.rot);
    rots.forEach(function (ro, ri) {
      var from = ro.from || 0, to = ro.to, sw = to - from, big = Math.abs(sw) > 360, r0 = ro.r || (16 + ri * 9), n = Math.max(10, Math.ceil(Math.abs(sw) / 3)), d = '', last = null, prev = null;
      if (Math.abs(sw) < 1e-9) return;
      for (var k = 0; k <= n; k++) { var f = k / n, rho = r0 + (big ? 9 * f * Math.abs(sw) / 360 : 0), p = pol(from + sw * f, rho); d += (k ? ' L' : 'M') + f1(p[0]) + ' ' + f1(p[1]); prev = last; last = p; }
      var col = ro.color || ARM;
      s += '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="1.6"/>' + head(prev[0], prev[1], last[0], last[1], col, 6.5);
      if (ro.label !== '') { var mid = from + (big ? (sw > 0 ? 1 : -1) * 45 : sw / 2), lp = pol(mid, r0 + (big ? 18 : 12)); s += stxt(lp[0], lp[1], ro.label || 'θ', { size: 12, color: col }); }
    });
    // points
    pts.forEach(function (p) {
      var q = P(p.xy[0], p.xy[1]); s += '<circle cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" r="3.6" fill="' + (p.color || PTC) + '"/>';
      if (p.label) { var dx = q[0] - C, dy = q[1] - C, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L; var anc = ux > 0.3 ? 'start' : ux < -0.3 ? 'end' : 'middle'; s += stxt(q[0] + ux * 9 + (anc === 'middle' ? 0 : 0), q[1] + uy * 11 + (Math.abs(uy) < 0.3 ? -9 : 0), p.label, { size: 12, anchor: anc, color: p.color || PTC, weight: 600 }); }
    });
    return '<svg class="fig-svg" viewBox="0 0 ' + S + ' ' + S + '" width="100%" style="max-width:' + (o.w || 210) + 'px;margin:4px auto" role="img" aria-label="' + esc(o.aria || 'angle in standard position') + '">' + s + '</svg>';
  };
  U.sketch = function (o) { return '<div class="fig" style="text-align:center;margin:6px 0">' + U.svg(o) + '</div>'; };
  /* a sketch for one angle (rotation, arm, optional reference arc) */
  U.angSketch = function (a, o) { o = o || {}; return U.sketch({ rot: { to: a }, arm: a, ref: o.ref ? (o.ref === true ? 'θR = ' + refOf(a) + '°' : o.ref) : null, w: o.w || 190 }); };

  /* ---------------- exact values: c·√m (m square-free, m = 1 for a rational) or undefined ----------------
   * U.X(c, m) -> target; U.UNDEF target. U.exact(T, opt) checker; opt.rat: denominator must be rational;
   * opt.cands: [[value, code, hint]]; opt.signHint; opt.undefHint. */
  U.X = function (c, m) { c = Array.isArray(c) ? Q(c[0], c[1]) : [c, 1]; m = m || 1; var f = ex.nthFactor(m, 2); if (f > 1) { c = Q(c[0] * f, c[1]); m = m / (f * f); } return { c: c, m: m }; };
  U.UNDEF = { u: true };
  U.xval = function (T) { return T.u ? NaN : T.c[0] / T.c[1] * Math.sqrt(T.m); };
  U.xtex = function (T) { if (T.u) return '\\text{undefined}'; return T.m === 1 ? ex.texRat(T.c) : ex.texRadical(T.c, 2, T.m); };
  U.xkey = U.xtex;
  /* written with the radical in the denominator (k/√m form), for worked solutions */
  U.xtexDen = function (p, q, m) { // p / (q√m)
    var g = gcd(p, q), a = p / g, b = q / g; if (b < 0) { a = -a; b = -b; }
    var rt = '\\sqrt{' + m + '}', den = (b === 1 ? '' : b) + rt;
    return (a < 0 ? '-' : '') + '\\frac{' + Math.abs(a) + '}{' + den + '}';
  };
  function plainTxt(resp) { return String(resp == null ? '' : resp).replace(/\\(text|mathrm|operatorname|textrm)\{\s*([^{}]*)\}/g, '$2').replace(/\\[,;: !]|~|\\quad/g, ' ').replace(/\s+/g, ' ').trim(); }
  var UNDEF_RE = /^(undefined|undef\.?|und\.?|not defined|does ?n[o']?t exist|dne|no value|none)$/i;
  var INF_RE = /^(-?\s*(\\infty|∞|infinity|inf))$/i;
  U.isUndefText = function (resp) { return UNDEF_RE.test(plainTxt(resp)); };
  function unp(a) { while (a && a.t === 'paren') a = a.a; return a; }
  U.exact = function (T, opt) {
    opt = opt || {};
    var V = U.xval(T);
    return function (resp) {
      var s = plainTxt(resp);
      if (INF_RE.test(s)) return T.u ? form(LID + '-undef-word', 'Dividing by 0 doesn’t give infinity here: the ratio is <b>undefined</b>. Type “undefined” (the <b>undef.</b> key).') : wrong('value', null);
      if (UNDEF_RE.test(s)) return T.u ? ok() : wrong(LID + '-undef-wrong', opt.undefWrong || 'This ratio has a value: its denominator isn’t 0. Work it out from ' + t('x') + ', ' + t('y') + ' and ' + t('r') + '.');
      var a = K.read(resp); if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (Object.keys(sh.vars).length) return form('notnumber', 'Give a number (no letters).' + (T.u ? ' If the ratio has no value, type “undefined”.' : ''));
      if (T.u) {
        if (!isFinite(a.val)) return form(LID + '-undef-word', 'Right idea — you can’t divide by 0. Write the answer as “undefined” (the <b>undef.</b> key).');
        return wrong(LID + '-undef', opt.undefHint || 'Look at the denominator of this ratio: it is 0 here, and dividing by 0 is <b>undefined</b>.');
      }
      if (!isFinite(a.val)) return wrong(LID + '-div0', 'That divides by 0. Check which coordinate goes in the denominator.');
      if (ex.eq(a.val, V) || (V === 0 && Math.abs(a.val) < 1e-12)) {
        if (sh.decimals) {
          if (T.m !== 1) return form('decimal', 'That’s a decimal approximation. Give the <b>exact</b> value (use the ' + t('\\sqrt{\\ }') + ' key).');
          if (T.c[1] !== 1 && !opt.decOk) return form(LID + '-as-frac', 'Right value — now write it as a fraction (an exact value).');
        }
        if (sh.ops || sh.pow || sh.abs) return form('simplify', 'Right value — now simplify it to a single fraction.');
        var fz = ex.factors(a.ast), nN = 1, nD = 1, rN = 0, rD = 0, bad = null;
        var scan = function (list, top) {
          list.forEach(function (f) {
            f = unp(f); if (bad) return;
            if (f.t === 'root') {
              var idx = ex.rat(f.n), rad = ex.rat(f.a);
              if (!idx || idx[0] !== 2 || idx[1] !== 1 || !rad || rad[1] !== 1) { bad = form('simplify', 'Right value — write it with square roots of whole numbers only.'); return; }
              var nf = ex.nthFactor(rad[0], 2);
              if (nf > 1) { bad = form('not-simplest', 'Right value, but simplify the radical: ' + (nf * nf === rad[0] ? t('\\sqrt{' + rad[0] + '}=' + nf) : t(F(rad[0])) + ' has the square factor ' + t(nf * nf + '=' + nf + '^{2}') + ', so ' + t('\\sqrt{' + rad[0] + '}=' + nf + '\\sqrt{' + rad[0] / (nf * nf) + '}')) + '.'); return; }
              if (top) rN++; else rD++;
              return;
            }
            var rr = ex.rat(f); if (!rr) { bad = form('simplify', 'Right value — now simplify it to a single fraction.'); return; }
            if (top) { nN *= rr[0]; nD *= rr[1]; } else { nN *= rr[1]; nD *= rr[0]; }
          });
        };
        scan(fz.num, true); scan(fz.den, false);
        if (bad) return bad;
        if (rN + rD > 1) return form('simplify', 'Right value — combine the radicals into one (and simplify).');
        if (rD && opt.rat) return form(LID + '-rad-den', 'Right value — now rationalize the denominator: multiply the numerator and the denominator by the radical in the denominator.');
        var nums = fz.num.filter(function (f) { return unp(f).t !== 'root'; }).length, dens = fz.den.filter(function (f) { return unp(f).t !== 'root'; }).length;
        if (nums > 1 || dens > 1) return form('simplify', 'Right value — now multiply the numbers out into a single coefficient.');
        if (gcd(nN, nD) > 1 && nD !== 1) return form('lowest', 'Right value — now reduce the fraction (divide the top and bottom by ' + t(gcd(nN, nD)) + ').');
        return ok();
      }
      var c = opt.cands || [];
      for (var i = 0; i < c.length; i++) if (c[i] && isFinite(c[i][0]) && ex.eq(a.val, c[i][0]) && !ex.eq(c[i][0], V)) return wrong(c[i][1], c[i][2]);
      if (V !== 0 && ex.eq(a.val, -V)) return wrong('sign', opt.signHint || 'Check the sign of your answer.');
      if (V !== 0 && ex.eq(a.val, 1 / V)) return wrong('flip', 'Your ratio is upside down — check which value goes on top.');
      if (sh.decimals && Math.abs(a.val - V) < 0.01) return form('decimal', 'That’s a decimal approximation. Give the <b>exact</b> value.');
      return wrong('value', null);
    };
  };
  /* bad answers for the generator test: candidate values that differ from the answer, as LaTeX */
  U.badTex = function (cands, T) {
    var V = U.xval(T), out = [];
    (cands || []).forEach(function (c) { if (!c || !isFinite(c[0]) || (isFinite(V) && ex.eq(c[0], V))) return; out.push(String(Math.round(c[0] * 1e6) / 1e6)); });
    if (T.u) out.push('0'); else out.push('\\text{undefined}');
    return out;
  };

  /* ---------------- keypads ---------------- */
  U.KS = 'u3l1k'; U.KV = 'u3l1xyr';
  (function () {
    var W = HW.widgets; if (!W || !W.KEYSETS) return;
    function d(n) { return { label: String(n), tex: String(n), plain: String(n) }; }
    var Y = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      enter: { label: 'Check ↵', fn: 'enter', wide: true }, sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' }, frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' },
      minus: { label: '−', tex: '-', plain: '-' }, dot: { label: '.', tex: '.', plain: '.' }, undef: { label: 'undef.', tex: '\\text{undefined}', plain: 'undefined', title: 'Undefined (division by 0)' } };
    if (!W.KEYSETS[U.KS]) W.KEYSETS[U.KS] = [[d(7), d(8), d(9), Y.sqrt, Y.del], [d(4), d(5), d(6), Y.frac, Y.clear], [d(1), d(2), d(3), Y.minus, Y.left, Y.right], [d(0), Y.dot, Y.undef, Y.enter]];
    if (!W.KEYSETS[U.KV]) W.KEYSETS[U.KV] = [[{ label: '<i>x</i>', tex: 'x', plain: 'x' }, { label: '<i>y</i>', tex: 'y', plain: 'y' }, { label: '<i>r</i>', tex: 'r', plain: 'r' }, Y.frac, Y.del], [Y.minus, Y.left, Y.right, Y.clear], [Y.enter]];
    if (W.KEYHELP) {
      W.KEYHELP[U.KS] = ['Use <b><sup>a</sup>⁄<sub>b</sub></b> for a fraction and <b>√</b> for a square root; press <b>▶</b> to step out of a box. Press <b>undef.</b> if the value is undefined.', 'Type fractions with <code>/</code> and roots as <code>sqrt(5)</code>, e.g. <code>-2sqrt(5)/5</code>, or type <code>undefined</code>.'];
      W.KEYHELP[U.KV] = ['Use the letters <b><i>x</i></b>, <b><i>y</i></b>, <b><i>r</i></b> and <b><sup>a</sup>⁄<sub>b</sub></b> for a fraction; press <b>▶</b> to step out of a box.', 'Type e.g. <code>y/r</code>.'];
    }
  })();

  /* ---------------- part builders ---------------- */
  function cdiag(c) { return function (v) { for (var i = 0; i < (c || []).length; i++) if (c[i] && Math.abs(v - c[i][0]) < 1e-9) return { code: c[i][1], hint: c[i][2] }; return null; }; }
  function badOf(c, ans) { var o = []; (c || []).forEach(function (x) { if (x && isFinite(x[0]) && Math.abs(x[0] - ans) > 1e-9) o.push(String(x[0])); }); return o; }
  U.cdiag = cdiag; U.badOf = badOf;
  /* a whole-number answer (deg: shown with °) */
  U.numP = function (prompt, ans, o) {
    o = o || {};
    return { prompt: prompt, input: { type: 'number', before: o.before, after: o.after == null ? (o.deg === false ? undefined : '°') : o.after, nr: !!o.nr }, check: K.number(ans, cdiag(o.cands), { nr: o.nr }), key: String(ans),
      answer: t((o.pre || '') + F(ans) + (o.deg === false ? '' : '^\\circ')), solution: o.sol, hints: o.hints || [], text: o.text, bad: badOf(o.cands, ans).concat(o.bad || []) };
  };
  /* several boxes: specs [{ label, name, ans, cands, after ('°' default), before, check, key, ansTex, math, keys, vars }] */
  U.fieldsP = function (prompt, specs, o) {
    o = o || {};
    var fields = [], checks = [], keys = [], ans = [];
    specs.forEach(function (s) {
      var after = s.after === undefined ? '°' : s.after;
      fields.push({ label: s.label, name: s.name || s.label, before: s.before, after: after || undefined, mode: s.math ? 'math' : undefined, keys: s.math ? (s.keys || U.KS) : undefined, vars: s.vars });
      checks.push(s.check || K.number(s.ans, cdiag(s.cands)));
      keys.push(s.key != null ? s.key : String(s.ans));
      ans.push((s.label ? s.label + ' ' : '') + (s.before ? s.before + ' ' : '') + t(s.ansTex || (F(s.ans) + (after === '°' ? '^\\circ' : ''))));
    });
    var p = B.fields(prompt, fields, checks, keys, ans.join('<br>'), o.sol, o.hints || [], o.text);
    p.bad = o.bad; p.good = o.good;
    return p;
  };
  U.mcP = function (r, prompt, opts, sol, hints, text, keepOrder, cols) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k] && !op.right) return; seen[k] = 1; out.push(op); });
    var p = B.mc(r, prompt, out, sol, hints || [], text, keepOrder);
    if (cols) p.input.columns = cols;
    return p;
  };
  /* a set of whole-number angles, any order (o.given: the angle that must not be listed; o.diag(resp) -> {code, hint}) */
  function sameSet(a, b) { if (a.length !== b.length) return false; var x = a.slice().sort(function (p, q) { return p - q; }), y = b.slice().sort(function (p, q) { return p - q; }); return x.every(function (v, i) { return Math.abs(v - y[i]) < 1e-9; }); }
  U.sameSet = sameSet;
  U.setP = function (prompt, vals, o) {
    o = o || {};
    var check = function (resp) {
      resp = (resp || []).map(Number);
      if (!resp.length) return form('empty', 'Add each angle (press Enter or comma after each).');
      var seen = {}; for (var i = 0; i < resp.length; i++) { if (seen[resp[i]]) return form('duplicate', 'You listed ' + t(D(resp[i])) + ' more than once.'); seen[resp[i]] = 1; }
      if (o.given != null && resp.indexOf(o.given) >= 0 && sameSet(resp.filter(function (x) { return x !== o.given; }), vals)) return form(LID + '-given', 'Right angles — but leave out the given angle ' + t(D(o.given)) + ': the question asks for the <b>other</b> ones.');
      if (sameSet(resp, vals)) return ok();
      var h = o.diag ? o.diag(resp) : null; if (h) return wrong(h.code, h.hint);
      if (resp.length !== vals.length) return wrong(LID + '-count', 'There ' + (vals.length === 1 ? 'is ' + t('1') + ' angle' : 'are ' + t(vals.length) + ' angles') + ' to find' + (o.given != null ? ' (not counting the given one)' : '') + '.');
      var n = resp.filter(function (x) { return vals.indexOf(x) >= 0; }).length;
      return wrong(LID + '-set', n ? t(n) + ' of your angles ' + (n === 1 ? 'is' : 'are') + ' right. Check the others.' : null);
    };
    return { prompt: prompt, input: { type: 'list', help: o.help || 'Add each angle (in degrees) with <b>Enter</b> or a comma, in any order. Tap an angle to remove it.' }, check: check, key: vals.slice(),
      answer: t(vals.map(D).join(',\\ ')), solution: o.sol, hints: o.hints || [], text: o.text, bad: o.bad };
  };
  var addCodes = function (o) { HW.addCodes(Object.keys(o).filter(function (k) { return !HW.CODES[k]; }).reduce(function (a, k) { a[k] = o[k]; return a; }, {})); };
  U.addCodes = addCodes;
  addCodes({ 'u3l1-undef': 'Gave a value for an undefined ratio', 'u3l1-undef-wrong': 'Said undefined (it has a value)', 'u3l1-undef-word': 'Wrote ∞ or n/0 instead of undefined',
    'u3l1-div0': 'Divided by zero', 'u3l1-rad-den': 'Radical left in the denominator', 'u3l1-as-frac': 'Decimal instead of an exact fraction' });
  HW.addPartial({ 'u3l1-undef': 'b', 'u3l1-undef-wrong': 'b', 'u3l1-div0': 'b' });

  /* ============================== Lesson 1 ============================== */
  addCodes({
    'u3l1-yaxis': 'Reference angle measured to the y-axis', 'u3l1-formula': 'Reference angle: formula for the wrong quadrant', 'u3l1-theta': 'Gave θ (not acute) as the reference angle',
    'u3l1-quad': 'Wrong quadrant', 'u3l1-axis': 'Wrong axis for a quadrantal angle', 'u3l1-cw': 'Clockwise and counterclockwise mixed up', 'u3l1-fromy': 'Rotation started on the y-axis',
    'u3l1-short': 'Stopped a quadrant short', 'u3l1-turn': 'Full turn not added / subtracted correctly', 'u3l1-from-ref': 'Angle from θR: formula for the wrong quadrant', 'u3l1-from-y': 'Angle from θR: measured from the y-axis',
    'u3l1-given': 'Listed the given angle too', 'u3l1-count': 'Wrong number of angles', 'u3l1-set': 'Wrong angles in the list', 'u3l1-set-ref': 'Angles with the wrong reference angle',
    'u3l1-refl-axis': 'Reflected in the wrong axis', 'u3l1-refl-sign': 'Sign slip in a reflected coordinate', 'u3l1-expr': 'Wrong expression for the reflected angle',
    'u3l1-mc-explain': 'Chose a wrong explanation', 'u3l1-isosceles': 'Equal legs: reference angle not 45°', 'u3l1-largest': 'Largest angle: wrong quadrant', 'u3l1-sum': 'Set up the sum or difference wrongly'
  });
  HW.addPartial({ 'u3l1-yaxis': 'b', 'u3l1-formula': 'b', 'u3l1-theta': 'b', 'u3l1-cw': 'b', 'u3l1-turn': 's', 'u3l1-from-ref': 'b', 'u3l1-from-y': 'b', 'u3l1-given': 's', 'u3l1-set-ref': 'b',
    'u3l1-refl-axis': 'b', 'u3l1-refl-sign': 's', 'u3l1-isosceles': 'b', 'u3l1-largest': 's', 'u3l1-sum': 'b' });

  /* the lesson's example angles and points (left out of every generator) */
  var EXA = [160, 245, 335, 225, 60, 205, 118, 289, 47, 215, 108, 344, 128, 52, 232, 308, 341, 19, 161, 199, 59, 121, 239, 301, 251, 71, 109];
  function angQ(r, q, lo, hi, excl) { return pickWhere(function () { return fromRef(r.int(lo || 5, hi || 85), q); }, function (a) { return EXA.indexOf(a) < 0 && (excl || []).indexOf(a) < 0 && refOf(a) !== 45; }); }
  var EXP = ['-6,2', '1,-3', '-2,-5', '3,5'];
  function ptQ(r, q, lo, hi, excl) {
    var sx = q === 1 || q === 4 ? 1 : -1, sy = q <= 2 ? 1 : -1;
    return pickWhere(function () { return [sx * r.int(lo || 1, hi || 6), sy * r.int(lo || 1, hi || 6)]; }, function (p) { var k = p.join(','); return Math.abs(p[0]) !== Math.abs(p[1]) && EXP.indexOf(k) < 0 && (excl || []).indexOf(k) < 0; });
  }
  var H_REF = ['The reference angle is the <b>acute</b> angle between the terminal arm and the <b>x-axis</b> (never the y-axis).', 'Q1: ' + t(REF_F[0]) + '; Q2: ' + t(REF_F[1]) + '; Q3: ' + t(REF_F[2]) + '; Q4: ' + t(REF_F[3]) + '.'];
  var H_FROM = ['Sketch it: turn ' + t('\\theta_R') + ' away from the x-axis in the quadrant given.', 'Q1: ' + t(FROM_F[0]) + '; Q2: ' + t(FROM_F[1]) + '; Q3: ' + t(FROM_F[2]) + '; Q4: ' + t(FROM_F[3]) + '.'];
  var H_QUAD = ['Quadrant 1: ' + t('0^\\circ<\\theta<90^\\circ') + ', quadrant 2: ' + t('90^\\circ<\\theta<180^\\circ') + ', quadrant 3: ' + t('180^\\circ<\\theta<270^\\circ') + ', quadrant 4: ' + t('270^\\circ<\\theta<360^\\circ') + '.'];
  /* typical wrong reference angles for a (0 < a ≤ 360) */
  function refCands(a) {
    var R = refOf(a), q = quad(a), c = [], seen = {}; seen[R] = 1;
    function add(v, code, hint) { if (v <= 0 || v > 360 || seen[v]) return; seen[v] = 1; c.push([v, code, hint]); }
    if (q) {
      var b = n360(a), yd = Math.abs(b - (b < 180 ? 90 : 270));
      add(yd, LID + '-yaxis', 'That is the angle to the <b>y-axis</b>. A reference angle is always measured to the <b>x-axis</b>.');
      add(b, LID + '-theta', 'The reference angle is <b>acute</b> (between ' + t('0^\\circ') + ' and ' + t('90^\\circ') + '): the gap between the terminal arm and the nearest part of the x-axis.');
      [180 - b, b - 180, 360 - b, b - 90].forEach(function (v) { add(v, LID + '-formula', 'Check the quadrant first: ' + t(D(b)) + ' is in quadrant ' + q + ', so ' + t(REF_F[q - 1]) + '.'); });
    } else {
      add(a, LID + '-theta', 'The arm of ' + t(D(a)) + ' is on ' + axisName(a) + '. The reference angle is the angle between the arm and the x-axis: ' + t(D(R)) + '.');
      add(R === 0 ? 90 : 0, LID + '-yaxis', 'The arm of ' + t(D(a)) + ' is on ' + axisName(a) + '. How far is that from the x-axis?');
    }
    return c;
  }
  function refPart(prompt, a, o) {
    o = o || {};
    return U.numP(prompt, refOf(a), { before: t('\\theta_R='), cands: refCands(a), sol: U.angSketch(a, { ref: true }) + refStep(a), hints: H_REF, text: o.text || 'reference angle' });
  }
  /* wrong angles from a reference angle R in quadrant q */
  function fromCands(R, q) {
    var c = [], want = fromRef(R, q), seen = {}; seen[want] = 1;
    function add(v, code, hint) { if (v < 0 || v > 360 || seen[v]) return; seen[v] = 1; c.push([v, code, hint]); }
    add(90 * (q - 1) + R, LID + '-from-y', 'Measure ' + t('\\theta_R') + ' from the <b>x-axis</b>, not the y-axis. In quadrant ' + q + ', ' + t(FROM_F[q - 1]) + '.');
    [1, 2, 3, 4].forEach(function (k) { if (k !== q) add(fromRef(R, k), LID + '-from-ref', 'That angle is in quadrant ' + k + '. In quadrant ' + q + ', ' + t(FROM_F[q - 1]) + '.'); });
    return c;
  }
  function fromPart(prompt, R, q, o) {
    o = o || {}; var a = fromRef(R, q);
    return U.numP(prompt, a, { before: t('\\theta='), cands: fromCands(R, q), sol: U.angSketch(a, { ref: 'θR = ' + R + '°' }) + 'Quadrant ' + q + ': ' + fromStep(R, q) + '.', hints: H_FROM, text: o.text || 'angle from reference angle' });
  }
  function caption(a) { return '<div style="text-align:center;font-size:14px;margin-top:2px">' + placeCap(a) + '</div>'; }
  /* "which sketch shows a?" (Q1) */
  function sketchMC(r, a, o) {
    o = o || {};
    var mk = function (spec, at) { return U.svg(Object.assign({ size: 170, w: 150 }, spec)) + caption(at); }, opts;
    if (quad(a)) {
      var q = quad(a);
      opts = [{ html: mk({ rot: { to: a }, arm: a }, a), right: true },
        { html: mk({ rot: { to: -a }, arm: -a }, -a), why: 'That rotation turns <b>clockwise</b> (a negative angle). A positive angle turns counterclockwise from the positive x-axis.', code: 'cw' },
        { html: mk({ rot: { from: 90, to: 90 + a }, arm: 90 + a }, 90 + a), why: 'That rotation starts on the y-axis. In standard position the initial arm is the <b>positive x-axis</b>.', code: 'fromy' },
        q === 1 ? { html: mk({ rot: { to: 180 - a }, arm: 180 - a }, 180 - a), why: 'That rotation is ' + t(D(180 - a)) + '. ' + t(D(a)) + ' is less than ' + t('90^\\circ') + ': it stops in quadrant 1.', code: 'short' }
          : { html: mk({ rot: { to: a - 90 }, arm: a - 90 }, a - 90), why: 'That rotation is only ' + t(D(a - 90)) + ' — one quadrant short. Past ' + t('90^\\circ') + ' is quadrant 2, past ' + t('180^\\circ') + ' quadrant 3, past ' + t('270^\\circ') + ' quadrant 4.', code: 'short' }];
    } else {
      opts = [90, 180, 270, 360].map(function (b) { return b === a ? { html: mk({ rot: { to: b }, arm: b }, b), right: true } : { html: mk({ rot: { to: b }, arm: b }, b), why: 'That is ' + t(D(b)) + '. Count quarter turns counterclockwise: ' + t('90^\\circ') + ' is one quarter turn, ' + t('180^\\circ') + ' a half turn, ' + t('270^\\circ') + ' three quarters, ' + t('360^\\circ') + ' a full turn.', code: 'axis' + b }; });
    }
    var sol = U.angSketch(a) + t(D(a)) + (quad(a) ? ' is between ' + t(D(90 * (quad(a) - 1))) + ' and ' + t(D(90 * quad(a))) + ', so it terminates in <b>quadrant ' + quad(a) + '</b>.' : ' is a quadrantal angle: its terminal arm lies on <b>' + axisName(a) + '</b>.');
    return U.mcP(r, o.prompt || 'Which sketch shows ' + t(D(a)) + ' in standard position?', opts, sol, ['Start on the positive x-axis and turn counterclockwise.'].concat(H_QUAD), o.text || 'choose the sketch', false, 2);
  }
  /* the quadrant (or axis) of an angle, multiple choice */
  function quadMC(r, a, o) {
    o = o || {};
    var q = quad(a), b = n360(a), opts;
    if (q) opts = [1, 2, 3, 4].map(function (k) { return k === q ? { html: 'Quadrant ' + k, right: true } : { html: 'Quadrant ' + k, why: 'Quadrant ' + k + ' is ' + t(D(90 * (k - 1)) + '<\\theta<' + D(90 * k)) + '. Where is ' + t(D(a)) + '?', code: 'q' + k }; });
    else {
      var axes = [0, 90, 180, 270].filter(function (x) { return x !== b; });
      opts = [{ html: placeCap(b), right: true }, { html: placeCap(r.pick(axes)), why: 'Count quarter turns: ' + t('90^\\circ') + ' is the positive y-axis, ' + t('180^\\circ') + ' the negative x-axis, ' + t('270^\\circ') + ' the negative y-axis, ' + t('360^\\circ') + ' the positive x-axis.', code: 'axis' },
        { html: 'Quadrant ' + (b / 90 || 4), why: 'The arm lands exactly on an axis, so it isn’t in a quadrant.', code: 'qa' }, { html: 'Quadrant ' + (b / 90 + 1 > 4 ? 1 : b / 90 + 1), why: 'The arm lands exactly on an axis, so it isn’t in a quadrant.', code: 'qb' }];
    }
    var sol = U.angSketch(a) + t(D(a)) + (q ? ' is between ' + t(D(90 * (q - 1))) + ' and ' + t(D(90 * q)) + ': <b>quadrant ' + q + '</b>.' : ' is quadrantal: the arm is on <b>' + axisName(b) + '</b>.');
    return U.mcP(r, o.prompt || 'Where does ' + t(D(a)) + ' terminate?', opts, sol, H_QUAD, o.text || 'quadrant of an angle', true, 2);
  }
  /* the quadrant (or axis) of a point on the terminal arm */
  var SIGNS = ['', t('x>0') + ' and ' + t('y>0'), t('x<0') + ' and ' + t('y>0'), t('x<0') + ' and ' + t('y<0'), t('x>0') + ' and ' + t('y<0')];
  function ptSketch(x, y, nm, o) { o = o || {}; return U.sketch({ grid: o.grid || Math.max(6, Math.abs(x), Math.abs(y)), pt: [x, y], ptLabel: (nm || 'P') + '(' + x + ', ' + y + ')', rot: { to: angOf(x, y) }, w: o.w || 200 }); }
  function ptQuadMC(r, x, y, nm, o) {
    o = o || {};
    var q = x && y ? (x > 0 ? (y > 0 ? 1 : 4) : (y > 0 ? 2 : 3)) : 0, a = angOf(x, y), opts;
    if (q) opts = [1, 2, 3, 4].map(function (k) { return k === q ? { html: 'Quadrant ' + k, right: true } : { html: 'Quadrant ' + k, why: 'In quadrant ' + k + ', ' + SIGNS[k] + '. Here ' + t('x=' + x) + ' and ' + t('y=' + y) + '.', code: 'q' + k }; });
    else opts = [0, 90, 180, 270].map(function (b) { return Math.abs(b - a) < 1e-9 ? { html: placeCap(b), right: true } : { html: placeCap(b), why: (x === 0 ? t('x=0') + ', so the point is on the y-axis; ' : t('y=0') + ', so the point is on the x-axis; ') + 'the sign of the other coordinate tells you which half.', code: 'ax' + b }; });
    var sol = ptSketch(x, y, nm) + (q ? t((x < 0 ? 'x<0' : 'x>0') + ',\\ ' + (y < 0 ? 'y<0' : 'y>0')) + ': <b>quadrant ' + q + '</b>.' : (x === 0 ? t('x=0') : t('y=0')) + ': the point is on <b>' + axisName(a) + '</b>, so ' + t('\\theta=' + D(Math.round(a))) + '.');
    return U.mcP(r, o.prompt || 'The point ' + t(ptTex(x, y, nm)) + ' is on the terminal arm of ' + t('\\theta') + '. Where does ' + t('\\theta') + ' terminate?', opts, sol, ['Look at the signs: ' + t('x') + ' is positive to the right of the y-axis, ' + t('y') + ' is positive above the x-axis.'].concat(H_QUAD), o.text || 'quadrant of a point', true, 2);
  }
  /* co-terminal angle in 0–360 */
  function coterm(prompt, a, o) {
    o = o || {}; var want = n360(a), c = [];
    if (a < 0) { c.push([-a, LID + '-cw', 'A negative angle turns <b>clockwise</b>. It stops on the same arm as ' + t('360^\\circ-' + D(-a)) + '.']); c.push([180 + a > 0 ? 180 + a : null, LID + '-turn', 'One full turn is ' + t('360^\\circ') + ', not ' + t('180^\\circ') + '.']); c.push([n360(a + 180), LID + '-turn', 'One full turn is ' + t('360^\\circ') + ': add ' + t('360^\\circ') + '.']); }
    else { c.push([a - 180, LID + '-turn', 'One full turn is ' + t('360^\\circ') + ', not ' + t('180^\\circ') + '.']); c.push([720 - a, LID + '-cw', 'Subtract the full turn: ' + t(D(a) + '-360^\\circ') + '.']); c.push([a, LID + '-turn', 'That is more than ' + t('360^\\circ') + ': take off one full turn.']); }
    c = c.filter(function (x) { return x[0] != null && x[0] >= 0 && x[0] !== want; });
    var sol = U.sketch({ rot: { to: a }, arm: a, w: 190 }) + (a < 0 ? 'Turning ' + t(D(-a)) + ' clockwise stops on the same arm as ' + t('360^\\circ-' + D(-a) + '=' + D(want)) + '.' : 'One full turn is ' + t('360^\\circ') + '; the extra ' + t(D(a) + '-360^\\circ=' + D(want)) + ' stops ' + where(want) + '. Same arm as ' + t(D(want)) + '.');
    return U.numP(prompt, want, { cands: c, sol: sol, hints: ['A full turn is ' + t('360^\\circ') + '. Clockwise (negative): ' + t('360^\\circ-|\\theta|') + '. More than a turn: ' + t('\\theta-360^\\circ') + '.'], text: o.text || 'co-terminal angle' });
  }
  /* four angles with reference angle R as boxes (labels per quadrant); skip: quadrant whose angle is given */
  function fourBoxes(prompt, R, o) {
    o = o || {};
    var specs = [];
    if (o.askRef) specs.push({ label: t('\\theta_R'), name: 'Reference angle', ans: R, before: '=', cands: o.refC || [] });
    [1, 2, 3, 4].forEach(function (k) { if (k === o.skip) return; specs.push({ label: 'Quadrant ' + k + ':', name: 'Quadrant ' + k, ans: fromRef(R, k), cands: fromCands(R, k) }); });
    var sol = U.sketch({ arms: [1, 2, 3, 4].map(function (k) { return { deg: fromRef(R, k) }; }), refs: [1, 2, 3, 4].map(function (k) { var ra = refArc(fromRef(R, k)); return { a: ra[0], b: ra[1], label: R + '°' }; }), w: 210 }) +
      (o.solPre || '') + 'Q1: ' + t(D(R)) + ', &nbsp;Q2: ' + t('180^\\circ-' + D(R) + '=' + D(180 - R)) + ', &nbsp;Q3: ' + t('180^\\circ+' + D(R) + '=' + D(180 + R)) + ', &nbsp;Q4: ' + t('360^\\circ-' + D(R) + '=' + D(360 - R)) + '.';
    return U.fieldsP(prompt, specs, { sol: sol, hints: o.hints || H_FROM, text: o.text || 'four angles with one reference angle' });
  }
  /* the three other angles with the same reference angle as a */
  function otherThree(prompt, a, o) {
    o = o || {}; var R = refOf(a), q = quad(a), vals = [1, 2, 3, 4].filter(function (k) { return k !== q; }).map(function (k) { return fromRef(R, k); });
    var diag = function (resp) {
      var rest = resp.filter(function (v) { return v !== a; }), refs = rest.map(refOf);
      if (rest.length && refs.every(function (x) { return x === refs[0]; }) && refs[0] !== R) return { code: LID + '-set-ref', hint: 'Your angles all have the reference angle ' + t(D(refs[0])) + ', but the reference angle of ' + t(D(a)) + ' is ' + t('\\theta_R=' + D(R)) + '. ' + refStep(a) };
      return null;
    };
    var sol = refStep(a) + '<br>' + [1, 2, 3, 4].filter(function (k) { return k !== q; }).map(function (k) { return 'Q' + k + ': ' + fromStep(R, k); }).join(', &nbsp;') + '.';
    return U.setP(prompt, vals, { given: a, diag: diag, sol: U.sketch({ arms: [1, 2, 3, 4].map(function (k) { return { deg: fromRef(R, k), color: k === q ? '#7d8aa8' : undefined }; }), refs: [{ a: refArc(a)[0], b: refArc(a)[1], label: R + '°' }], w: 200 }) + sol, hints: ['First find the reference angle of ' + t(D(a)) + '.'].concat(H_FROM.slice(1)), text: o.text || 'three other angles, same reference angle',
      bad: [[a].concat(vals.slice(0, 2)), vals.map(function (v) { return v === 360 ? 0 : v + 1; })] });
  }
  /* reflection of (px, py) on the arm of th0 (rounded): which = 'y' | 'x' | 'o' */
  function reflPart(prompt, px, py, th0, which, o) {
    o = o || {};
    var ix = which === 'x' ? px : -px, iy = which === 'y' ? py : -py, R = refOf(th0), q0 = quad(th0), q = ix > 0 ? (iy > 0 ? 1 : 4) : (iy > 0 ? 2 : 3), ang = fromRef(R, q);
    var wx = [[-ix, LID + '-refl-axis', 'Reflecting in the ' + (which === 'y' ? 'y-axis changes the sign of ' + t('x') + ' only' : which === 'x' ? 'x-axis changes the sign of ' + t('y') + ' only' : 'both axes changes the sign of both coordinates') + '.']];
    var wy = [[-iy, LID + '-refl-axis', 'Reflecting in the ' + (which === 'y' ? 'y-axis keeps ' + t('y') : which === 'x' ? 'x-axis changes the sign of ' + t('y') : 'both axes changes the sign of both coordinates') + '.']];
    var aC = fromCands(R, q).concat([[fromRef(R, q0 === 0 ? 1 : q0), LID + '-from-ref', 'That is the original angle. The image is in quadrant ' + q + '.']]);
    var specs = [{ label: 'Image: ' + t('x'), name: 'x-coordinate', before: '=', ans: ix, cands: wx, after: '' }, { label: t('y'), name: 'y-coordinate', before: '=', ans: iy, cands: wy, after: '' }, { label: 'Rotation angle', name: 'Rotation angle', before: t('\\theta='), ans: ang, cands: aC }];
    var sol = U.sketch({ grid: Math.max(6, Math.abs(px), Math.abs(py)), pts: [{ xy: [px, py], label: 'P', color: '#59606e' }, { xy: [ix, iy], label: '(' + ix + ', ' + iy + ')' }], ptArms: true, arms: [], refs: [{ a: refArc(ang)[0], b: refArc(ang)[1], label: R + '°' }], w: 210 }) +
      'Image ' + t(ptTex(ix, iy)) + ', in quadrant ' + q + '. The reference angle stays ' + t(D(R)) + (q0 && q0 !== 1 ? ' (' + refStep(th0).replace(/^Quadrant \d: /, '').replace(/\.$/, '') + ')' : '') + ', so ' + fromStep(R, q) + '.';
    return U.fieldsP(prompt, specs, { sol: sol, hints: ['Reflect in the y-axis: ' + t('(x,y)\\to(-x,y)') + '. In the x-axis: ' + t('(x,y)\\to(x,-y)') + '. In both axes: ' + t('(x,y)\\to(-x,-y)') + '.', 'The reference angle doesn’t change; only the quadrant does.'], text: o.text || 'reflection: image and angle' });
  }
  /* "explain the error" — student measured to the y-axis (a in Q2–Q4) */
  function yErrMC(r, name, a) {
    var R = refOf(a), q = quad(a), y = Math.abs(a - (a < 180 ? 90 : 270)), wf = q === 4 ? a - 180 : 360 - a;
    return U.mcP(r, name + ' says the reference angle of ' + t(D(a)) + ' is ' + t(D(y)) + '. Which explains the error and gives the correct reference angle?', [
      { html: name + ' measured to the y-axis; measured to the x-axis, ' + t('\\theta_R=' + D(R)) + '.', right: true },
      { html: name + ' is correct: ' + t(D(y)) + ' is acute.', why: 'Acute is not enough: the reference angle is measured to the <b>x-axis</b>. Sketch ' + t(D(a)) + ' and look at the gap to the x-axis.' },
      { html: name + ' used the wrong quadrant; ' + t('\\theta_R=' + D(wf)) + '.', why: t(D(a)) + ' is in quadrant ' + q + ', where ' + t(REF_F[q - 1]) + '. Is ' + t(D(wf)) + ' acute?' },
      { html: name + ' measured to the y-axis; the reference angle is ' + t('90^\\circ+' + D(y) + '=' + D(90 + y)) + '.', why: 'A reference angle is always acute (less than ' + t('90^\\circ') + ').' }],
      U.angSketch(a, { ref: true }) + name + ' measured to the y-axis (' + t(D(y)) + '). ' + refStep(a), H_REF, 'explain: measured to the y-axis');
  }

  var QUESTIONS = [
    { num: '1', stem: 'Sketch each angle in standard position and state the quadrant in which it terminates (or the axis it lies on). Choose the right sketch.',
      shared: function (r) { return { ax: r.sample([180, 270, 360], 2) }; }, parts: [
      { id: '1a', level: 'BEG', make: function (r) { return sketchMC(r, angQ(r, 2, 10, 80, [140]), { text: 'choose the sketch (Q2)' }); } },
      { id: '1b', level: 'BEG', make: function (r) { return sketchMC(r, angQ(r, 3, 10, 80, [215]), { text: 'choose the sketch (Q3)' }); } },
      { id: '1c', level: 'BEG', make: function (r) { return sketchMC(r, angQ(r, 4, 10, 80, [285]), { text: 'choose the sketch (Q4)' }); } },
      { id: '1d', level: 'BEG', make: function (r) { return sketchMC(r, angQ(r, 1, 10, 80, [25]), { text: 'choose the sketch (Q1)' }); } },
      { id: '1e', level: 'LIM', make: function (r, s) { return sketchMC(r, s.ax[0], { text: 'choose the sketch (quadrantal)' }); } },
      { id: '1f', level: 'LIM', make: function (r, s) { return sketchMC(r, s.ax[1], { text: 'choose the sketch (quadrantal)' }); } }] },
    { num: '2', stem: 'Each point is on the terminal arm of an angle ' + t('\\theta') + ' in standard position. Plot the point, draw ' + t('\\theta') + ', and state the quadrant (or axis).', parts: [
      { id: '2a', level: 'BEG', make: function (r) { var p = ptQ(r, 4, 1, 6, ['5,-2']); return ptQuadMC(r, p[0], p[1], 'P', { text: 'quadrant of a point (Q4)' }); } },
      { id: '2b', level: 'BEG', make: function (r) { var p = ptQ(r, 2, 1, 6, ['-3,6']); return ptQuadMC(r, p[0], p[1], 'Q', { text: 'quadrant of a point (Q2)' }); } },
      { id: '2c', level: 'BEG', make: function (r) { var p = ptQ(r, 3, 1, 6, ['-4,-1']); return ptQuadMC(r, p[0], p[1], 'R', { text: 'quadrant of a point (Q3)' }); } },
      { id: '2d', level: 'EMG', make: function (r) { var p = pickWhere(function () { var k = r.int(1, 6), w = r.int(0, 3); return [[k, 0], [0, k], [-k, 0], [0, -k]][w]; }, function (p) { return p.join(',') !== '0,-3'; }); return ptQuadMC(r, p[0], p[1], 'S', { text: 'point on an axis' }); } }] },
    { num: '3', stem: 'Sketch each angle and its reference angle. Determine ' + t('\\theta_R') + '.', parts: [
      { id: '3a', level: 'BEG', make: function (r) { var a = angQ(r, 3, 10, 80, [236]); return refPart('Determine the reference angle of ' + t(D(a)) + '.', a, { text: 'reference angle (Q3)' }); } },
      { id: '3b', level: 'BEG', make: function (r) { var a = angQ(r, 4, 10, 80, [302]); return refPart('Determine the reference angle of ' + t(D(a)) + '.', a, { text: 'reference angle (Q4)' }); } },
      { id: '3c', level: 'BEG', make: function (r) { var a = angQ(r, 2, 60, 88, [99]); return refPart('Determine the reference angle of ' + t(D(a)) + '.', a, { text: 'reference angle (Q2, near 90°)' }); } },
      { id: '3d', level: 'BEG', make: function (r) { var a = angQ(r, 1, 10, 85, [64]); return refPart('Determine the reference angle of ' + t(D(a)) + '.', a, { text: 'reference angle (Q1)' }); } },
      { id: '3e', level: 'BEG', make: function (r) { var a = angQ(r, 2, 3, 25, [165]); return refPart('Determine the reference angle of ' + t(D(a)) + '.', a, { text: 'reference angle (Q2, near 180°)' }); } },
      { id: '3f', level: 'EMG', make: function (r) { var a = r.pick([90, 180, 270, 360]); return refPart('Determine the reference angle of ' + t(D(a)) + '.', a, { text: 'reference angle (quadrantal)' }); } }] },
    { num: '4', stem: 'Without sketching, state the quadrant and the reference angle.', parts: [[4, 5, 40, [344]], [2, 5, 85, [101]], [3, 30, 85, [258]], [1, 5, 40, [12]], [3, 1, 15, [189]], [4, 75, 89, [271]]].map(function (z, i) {
      return { id: '4' + 'abcdef'[i], level: 'EMG', make: function (r) {
        var a = angQ(r, z[0], z[1], z[2], z[3]), q = z[0], R = refOf(a);
        var qC = [1, 2, 3, 4].filter(function (k) { return k !== q; }).map(function (k) { return [k, LID + '-quad', t(D(a)) + ' is between ' + t(D(90 * (q - 1))) + ' and ' + t(D(90 * q)) + '.']; });
        return U.fieldsP('Angle ' + t(D(a)) + ':', [{ label: 'Quadrant', name: 'Quadrant', ans: q, cands: qC, after: '' }, { label: t('\\theta_R'), name: 'Reference angle', before: '=', ans: R, cands: refCands(a) }],
          { sol: refStep(a), hints: H_QUAD.concat(H_REF.slice(1)), text: 'quadrant and reference angle' });
      } };
    }) },
    { num: '5', stem: 'Sketch each rotation. State the angle from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' with the same terminal arm.', parts: [
      { id: '5a', level: 'EMG', make: function (r) { var a = -pickWhere(function () { return r.int(10, 80); }, function (x) { return [45, 60].indexOf(x) < 0; }); return coterm('A rotation of ' + t(D(a)) + '.', a, { text: 'co-terminal: small negative' }); } },
      { id: '5b', level: 'PRG', make: function (r) { var a = -pickWhere(function () { return r.int(100, 350); }, function (x) { return [135, 200, 180, 270].indexOf(x) < 0; }); return coterm('A rotation of ' + t(D(a)) + '.', a, { text: 'co-terminal: large negative' }); } },
      { id: '5c', level: 'EMG', make: function (r) { var a = 360 + pickWhere(function () { return r.int(10, 85); }, function (x) { return [30, 60, 45].indexOf(x) < 0; }); return coterm('A rotation of ' + t(D(a)) + '.', a, { text: 'co-terminal: just past a turn' }); } },
      { id: '5d', level: 'PRG', make: function (r) { var a = 360 + pickWhere(function () { return r.int(100, 355); }, function (x) { return [240, 180, 270].indexOf(x) < 0; }); return coterm('A rotation of ' + t(D(a)) + '.', a, { text: 'co-terminal: well past a turn' }); } }] },
    { num: '6', stem: 'Determine the rotation angle ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta\\le 360^\\circ') + '.', parts: [
      { id: '6a', level: 'PRG', make: function (r) {
        var qs = [2, 3, 4, 1], Rs = pickWhere(function () { return qs.map(function () { return r.int(3, 87); }); }, function (z) { return z.every(function (x, i) { return x !== 45 && [22, 45, 81, 13][i] !== x && [35, 72, 16, 50][i] !== x; }); });
        return U.fieldsP('Complete the table.', qs.map(function (q, i) { return { label: t('\\theta_R=' + D(Rs[i])) + ', quadrant ' + q + ':', name: 'Row ' + (i + 1), before: t('\\theta='), ans: fromRef(Rs[i], q), cands: fromCands(Rs[i], q) }; }),
          { sol: qs.map(function (q, i) { return 'Q' + q + ': ' + fromStep(Rs[i], q); }).join('<br>'), hints: H_FROM, text: 'table: θ from θR and quadrant' });
      } },
      { id: '6b', level: 'PRG', make: function (r) {
        var R1 = pickWhere(function () { return r.int(50, 85); }, function (x) { return x !== 67 && x !== 72; }), R2 = pickWhere(function () { return r.int(2, 12); }, function (x) { return x !== 5; }), ya = r.pick([90, 270]);
        var rows = [{ R: R1, q: 3 }, { R: R2, q: 2 }, { R: 0, ax: 180 }, { R: 90, ax: ya }];
        return U.fieldsP('Complete the table.', rows.map(function (w, i) {
          var ans = w.q ? fromRef(w.R, w.q) : w.ax;
          return { label: t('\\theta_R=' + D(w.R)) + ', ' + (w.q ? 'quadrant ' + w.q : axisName(w.ax).replace(/^the /, '')) + ':', name: 'Row ' + (i + 1), before: t('\\theta='), ans: ans,
            cands: w.q ? fromCands(w.R, w.q) : [[w.ax === 180 ? 0 : w.R === 90 && w.ax === 270 ? 90 : 270, LID + '-axis', 'Which axis? ' + t('0^\\circ') + ': positive x-axis, ' + t('90^\\circ') + ': positive y-axis, ' + t('180^\\circ') + ': negative x-axis, ' + t('270^\\circ') + ': negative y-axis.'], [360, LID + '-axis', t('360^\\circ') + ' is on the positive x-axis.']] };
        }), { sol: rows.map(function (w) { return w.q ? 'Q' + w.q + ': ' + fromStep(w.R, w.q) : axisName(w.ax).replace(/^the /, '') + ': ' + t('\\theta=' + D(w.ax)); }).join('<br>'), hints: H_FROM.concat(['On an axis: ' + t('\\theta_R=0^\\circ') + ' means the arm is on the x-axis, ' + t('\\theta_R=90^\\circ') + ' on the y-axis.']), text: 'table: θ from θR (with axes)' });
      } }] },
    { num: '7', shared: function (r) { return { R: pickWhere(function () { return r.int(12, 78); }, function (x) { return [40, 65, 45, 35, 50, 52, 19, 59].indexOf(x) < 0; }) }; },
      stem: function (s) { return 'A reference angle of ' + t(D(s.R)) + ' is sketched in each of the four quadrants.'; }, parts: [
      { id: '7a', level: 'EMG', make: function (r, s) {
        var R = s.R, sk = function (arms, refs) { return U.svg({ size: 170, w: 160, arms: arms.map(function (d) { return { deg: d }; }), refs: refs.map(function (p) { return { a: p[0], b: p[1], label: R + '°' }; }) }); };
        var good = [1, 2, 3, 4].map(function (k) { return fromRef(R, k); });
        return U.mcP(r, 'Which sketch shows a reference angle of ' + t(D(R)) + ' in each quadrant?', [
          { html: sk(good, good.map(refArc)), right: true },
          { html: sk([90 - R, 90 + R, 270 - R, 270 + R], [[90 - R, 90], [90, 90 + R], [270 - R, 270], [270, 270 + R]]), why: 'Those angles are measured to the <b>y-axis</b>. A reference angle is always measured to the x-axis.', code: 'yaxis' },
          { html: sk([R, 90 + R, 180 + R, 270 + R], [[0, R], [90, 90 + R], [180, 180 + R], [270, 270 + R]]), why: 'Turning ' + t(D(R)) + ' past each axis measures some of the angles to the y-axis. In every quadrant the arm must be ' + t(D(R)) + ' from the <b>x-axis</b>.', code: 'quarter' }],
          'In each quadrant the arm is ' + t(D(R)) + ' from the x-axis:' + U.sketch({ arms: good.map(function (d) { return { deg: d }; }), refs: good.map(function (d) { var p = refArc(d); return { a: p[0], b: p[1], label: R + '°' }; }), w: 200 }), H_REF, 'four-quadrant sketch', false, 2);
      } },
      { id: '7b', level: 'PRG', make: function (r, s) { return fourBoxes('State the rotation angle in each quadrant.', s.R, { text: 'four rotation angles' }); } }] },
    { num: '8', stem: 'Complete the table. Each row lists the four angles from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' with the same reference angle.', parts: [
      { id: '8a', level: 'PRG', make: function (r) { var R = pickWhere(function () { return r.int(5, 40); }, function (x) { return [18, 19, 35, 16, 25, 40].indexOf(x) < 0; }); return fourBoxes('Reference angle ' + t(D(R)) + '.', R, { text: 'table row: from θR' }); } },
      { id: '8b', level: 'PRG', make: function (r) { var R = pickWhere(function () { return r.int(50, 85); }, function (x) { return [63, 52, 59, 72, 50].indexOf(x) < 0; }); return fourBoxes('Reference angle ' + t(D(R)) + '.', R, { text: 'table row: from θR' }); } },
      { id: '8c', level: 'PRG', make: function (r) { var a = angQ(r, 2, 10, 85, [107]); return fourBoxes('Quadrant 2 angle: ' + t(D(a)) + '.', refOf(a), { askRef: true, skip: 2, refC: refCands(a), solPre: refStep(a) + '<br>', text: 'table row: from a Q2 angle' }); } },
      { id: '8d', level: 'PRG', make: function (r) { var a = angQ(r, 3, 10, 85, [222]); return fourBoxes('Quadrant 3 angle: ' + t(D(a)) + '.', refOf(a), { askRef: true, skip: 3, refC: refCands(a), solPre: refStep(a) + '<br>', text: 'table row: from a Q3 angle' }); } },
      { id: '8e', level: 'PRG', make: function (r) { var a = angQ(r, 4, 10, 85, [335]); return fourBoxes('Quadrant 4 angle: ' + t(D(a)) + '.', refOf(a), { askRef: true, skip: 4, refC: refCands(a), solPre: refStep(a) + '<br>', text: 'table row: from a Q4 angle' }); } }] },
    { num: '9', stem: 'Determine the three other angles from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' with the same reference angle as the given angle.', parts: [
      { id: '9a', level: 'PRG', make: function (r) { var a = angQ(r, 2, 8, 82, [147]); return otherThree('The angle ' + t(D(a)) + '.', a, { text: 'three other angles (from Q2)' }); } },
      { id: '9b', level: 'PRG', make: function (r) { var a = angQ(r, 4, 8, 82, [316]); return otherThree('The angle ' + t(D(a)) + '.', a, { text: 'three other angles (from Q4)' }); } },
      { id: '9c', level: 'PRG', make: function (r) { var a = angQ(r, 3, 8, 82, [203]); return otherThree('The angle ' + t(D(a)) + '.', a, { text: 'three other angles (from Q3)' }); } }] },
    { num: '10', shared: function (r) {
        return pickWhere(function () { var a = r.int(1, 9), b = r.int(1, 9), th = Math.atan2(b, a) * 180 / Math.PI; return { a: a, b: b, th: Math.round(th), fr: th - Math.floor(th) }; },
          function (z) { return z.a !== z.b && Math.abs(z.fr - 0.5) > 0.08 && ['2,6', '3,5', '8,3', '1,3', '3,9'].indexOf(z.a + ',' + z.b) < 0 && gcd(z.a, z.b) === 1; });
      },
      stem: function (s) { return 'The point ' + t(ptTex(s.a, s.b, 'P')) + ' is on the terminal arm of an angle of ' + t(D(s.th)) + ' (to the nearest degree). For each reflection of ' + t('P') + ', state the coordinates of the image and the rotation angle whose terminal arm passes through it.'; }, parts: [
      { id: '10a', level: 'PRG', make: function (r, s) { return reflPart('Reflect ' + t('P') + ' in the ' + t('y') + '-axis.', s.a, s.b, s.th, 'y', { text: 'reflection in the y-axis' }); } },
      { id: '10b', level: 'PRG', make: function (r, s) { return reflPart('Reflect ' + t('P') + ' in the ' + t('x') + '-axis.', s.a, s.b, s.th, 'x', { text: 'reflection in the x-axis' }); } },
      { id: '10c', level: 'PRG', make: function (r, s) { return reflPart('Reflect ' + t('P') + ' in both axes.', s.a, s.b, s.th, 'o', { text: 'reflection in both axes' }); } }] },
    { num: '11', shared: function (r) { return { v: r.pick([['a', 'b'], ['m', 'n'], ['p', 'q'], ['h', 'k']]) }; },
      stem: function (s) { return 'The point ' + t('P(' + s.v[0] + ',\\ ' + s.v[1] + ')') + ', with ' + t(s.v[0] + '>0') + ' and ' + t(s.v[1] + '>0') + ', is on the terminal arm of an angle ' + t('\\theta') + '. Write an expression in terms of ' + t('\\theta') + ' for the rotation angle whose terminal arm passes through each point.'; },
      parts: [['-', '', 2], ['-', '-', 3], ['', '-', 4]].map(function (z, i) {
        return { id: '11' + 'abc'[i], level: 'ADV', make: function (r, s) {
          var q = z[2], pt = '(' + z[0] + s.v[0] + ',\\ ' + z[1] + s.v[1] + ')', all = { 2: '180^\\circ-\\theta', 3: '180^\\circ+\\theta', 4: '360^\\circ-\\theta' };
          var opts = [{ html: t(all[q]), right: true }];
          [2, 3, 4].forEach(function (k) { if (k !== q) opts.push({ html: t(all[k]), why: 'That angle is in quadrant ' + k + '. The point ' + t(pt) + ' is in quadrant ' + q + '.', code: 'q' + k }); });
          opts.push({ html: t(q === 2 ? '90^\\circ+\\theta' : q === 3 ? '\\theta-180^\\circ' : '270^\\circ+\\theta'), why: q === 3 ? t('\\theta-180^\\circ') + ' is negative for an acute ' + t('\\theta') + '. Turn past ' + t('180^\\circ') + ' by ' + t('\\theta') + '.' : 'That measures ' + t('\\theta') + ' from the y-axis. The reflected arm makes the angle ' + t('\\theta') + ' with the <b>x-axis</b>.', code: 'y' });
          return U.mcP(r, 'The point ' + t(pt) + '.', opts, 'The point is in quadrant ' + q + ' and its reference angle is ' + t('\\theta') + ', so the rotation angle is ' + t(all[q]) + '.', ['The reflection keeps the reference angle ' + t('\\theta') + '. Which quadrant is the point in?'], 'expression for a reflected angle');
        } };
      }) },
    { num: '12', shared: function (r) {
        return pickWhere(function () {
          var q0 = r.pick([2, 3, 4]), ax = r.pick(['x', 'y']), X = r.int(2, 9), Y = r.int(2, 9), sx = q0 === 4 ? 1 : -1, sy = q0 === 2 ? 1 : -1, x = sx * X, y = sy * Y, th = angOf(x, y);
          return { x: x, y: y, ax: ax, q0: q0, th: Math.round(th), fr: th - Math.floor(th) };
        }, function (z) { return Math.abs(z.x) !== Math.abs(z.y) && Math.abs(z.fr - 0.5) > 0.1 && gcd(z.x, z.y) === 1 && [z.x + ',' + z.y].indexOf('-5,9') < 0 && ['-6,2', '1,-3', '-2,-5'].indexOf(z.x + ',' + z.y) < 0; });
      },
      stem: function (s) { return 'The terminal arm of an angle ' + t('\\theta') + ' passes through ' + t(ptTex(s.x, s.y)) + ', and ' + t('\\theta\\approx ' + D(s.th)) + '.'; }, parts: [
      { id: '12a', level: 'PRG', make: function (r, s) { return refPart('What is the reference angle of ' + t('\\theta') + ' (to the nearest degree)?', s.th, { text: 'reference angle from an approximate θ' }); } },
      { id: '12b', level: 'MAS', make: function (r, s) {
        var R = refOf(s.th), ix = s.ax === 'y' ? -s.x : s.x, iy = s.ax === 'x' ? -s.y : s.y;
        return reflPart('The point ' + t(ptTex(s.x, s.y)) + ' is reflected in the ' + t(s.ax) + '-axis. State the image point and the angle from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' whose terminal arm passes through it.', s.x, s.y, s.th, s.ax, { text: 'reflect, then the new angle' });
      } }] },
    { num: '13', stem: 'Explain each student’s error, then give the correct reference angle.', parts: [
      { id: '13a', level: 'ADV', make: function (r) { var a = angQ(r, r.pick([2, 3, 4]), 10, 80, [305]); return yErrMC(r, 'Jordan', a); } },
      { id: '13b', level: 'ADV', make: function (r) {
        var a = angQ(r, r.pick([2, 3]), 8, 80, [160]), R = refOf(a), q = quad(a);
        return U.mcP(r, 'Kim says the reference angle of ' + t(D(a)) + ' is ' + t(D(a)) + ', “because it is measured from the positive x-axis.” Which explains the error and gives the correct reference angle?', [
          { html: 'A reference angle is acute and measured to the <b>nearest</b> part of the x-axis: ' + t('\\theta_R=' + D(R)) + '.', right: true },
          { html: 'Kim is correct.', why: 'A reference angle is always between ' + t('0^\\circ') + ' and ' + t('90^\\circ') + '. Is ' + t(D(a)) + '?' },
          { html: 'It is measured to the y-axis: ' + t('\\theta_R=' + D(a - 90)) + '.', why: 'Reference angles are measured to the <b>x-axis</b>, never the y-axis.' },
          { html: 'It is measured clockwise: ' + t('\\theta_R=' + D(360 - a)) + '.', why: 'Is ' + t(D(360 - a)) + ' acute? Find the gap between the arm and the nearest part of the x-axis.' }],
          U.angSketch(a, { ref: true }) + 'Kim gave the rotation angle. ' + refStep(a), H_REF, 'explain: gave θ as θR');
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var a = angQ(r, 3, 10, 80, [227]), R = refOf(a);
        return U.mcP(r, '<i>(Multiple Choice)</i> An angle of ' + t(D(a)) + ' in standard position has a reference angle of', [
          { html: t(D(R)), right: true }, { html: t(D(90 - R)), why: 'That is measured to the y-axis (' + t('270^\\circ-' + D(a)) + ').' },
          { html: t(D(360 - a)), why: 'That uses the quadrant 4 rule, and it isn’t acute.' }, { html: t(D(a - 90)), why: 'A reference angle is acute and measured to the x-axis.' }],
          'Quadrant 3, so ' + t('\\theta_R=' + D(a) + '-180^\\circ=' + D(R)) + '.', H_REF, 'MC: reference angle');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var a = angQ(r, 2, 10, 80, [112]), R = refOf(a), W = 90 - R, right = r.pick([180 + R, 360 - R]);
        var wr = r.sample([W, 180 - W, 180 + W, 360 - W].filter(function (v) { return v !== a && v !== right && refOf(v) !== R; }), 3);
        return U.mcP(r, '<i>(Multiple Choice)</i> Which angle has the same reference angle as ' + t(D(a)) + '?', [{ html: t(D(right)), right: true }].concat(wr.map(function (v) { return { html: t(D(v)), why: t(D(v)) + ' has the reference angle ' + t(D(refOf(v))) + '. The reference angle of ' + t(D(a)) + ' is ' + t('180^\\circ-' + D(a)) + '.' }; })),
          t('\\theta_R=180^\\circ-' + D(a) + '=' + D(R)) + ', and ' + refStep(right).replace(/^Quadrant/, 'for ' + t(D(right)) + ' (quadrant').replace(/: /, '): ') + ' The others have ' + t('\\theta_R=' + D(W)) + ' (from the mistake ' + t(D(a) + '-90^\\circ') + ').', H_REF, 'MC: same reference angle');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'PRG', make: function (r) {
        var q = r.pick([2, 3, 4]), p = ptQ(r, q, 1, 9, ['-7,-2']), others = [1, 2, 3, 4].filter(function (k) { return k !== q; }), w1 = r.pick(others), w2 = r.pick(others.filter(function (k) { return k !== w1; })), w3 = r.pick(others.filter(function (k) { return k !== q && k !== 1; }));
        var rng = ['0^\\circ<\\theta<90^\\circ', '90^\\circ<\\theta<180^\\circ', '180^\\circ<\\theta<270^\\circ', '270^\\circ<\\theta<360^\\circ'];
        return U.mcP(r, '<i>(Multiple Choice)</i> The terminal arm of an angle ' + t('\\theta') + ' passes through the point ' + t(ptTex(p[0], p[1])) + '. Which statement is true?', [
          { html: t(REF_F[q - 1]), right: true }, { html: t('\\theta') + ' terminates in quadrant ' + w1, why: 'In quadrant ' + w1 + ', ' + SIGNS[w1] + '. Check the signs of the coordinates.' },
          { html: t(rng[w2 - 1]), why: 'That range is quadrant ' + w2 + '. The point is in quadrant ' + q + '.' }, { html: t(REF_F[w3 - 1]), why: 'That is the quadrant ' + w3 + ' rule. The point is in quadrant ' + q + '.' }],
          SIGNS[q].replace('and', 'and') + ': quadrant ' + q + ', where ' + t(REF_F[q - 1]) + '.', ['Find the quadrant from the signs of the coordinates first.'], 'MC: true statement about a point');
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'PRG', make: function (r) {
        var a = angQ(r, r.pick([2, 3]), 8, 82, [158]), R = refOf(a);
        return U.numP('<i>(Numerical Response)</i> The largest angle from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' with the same reference angle as ' + t(D(a)) + ' is ______' + t('^\\circ') + '.', 360 - R, { nr: true,
          cands: [[180 + R, LID + '-largest', 'There is a larger one: the quadrant 4 angle is the largest.'], [360 - a > 0 ? 360 - a : null, LID + '-formula', 'Find ' + t('\\theta_R') + ' first: ' + refStep(a)], [R, LID + '-largest', 'That is the smallest. The largest is in quadrant 4.']],
          sol: refStep(a) + ' The largest is in quadrant 4: ' + t('360^\\circ-' + D(R) + '=' + D(360 - R)) + '.', hints: ['The four angles with reference angle ' + t('\\theta_R') + ' are ' + t('\\theta_R,\\ 180^\\circ-\\theta_R,\\ 180^\\circ+\\theta_R,\\ 360^\\circ-\\theta_R') + '.'], text: 'NR: largest angle, same reference angle' });
      } }] },
    { num: '18', parts: [
      { id: '18', level: 'ADV', make: function (r) {
        var q = r.pick([2, 3, 4]), k = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 4 && x !== 3; }), x = q === 4 ? k : -k, y = q === 2 ? k : -k, ans = fromRef(45, q);
        return U.numP('<i>(Numerical Response)</i> The point ' + t(ptTex(x, y)) + ' is on the terminal arm of ' + t('\\theta') + '. The value of ' + t('\\theta') + ' is ______' + t('^\\circ') + '.', ans, { nr: true,
          cands: [[45, LID + '-isosceles', 'That is the reference angle. The point is in quadrant ' + q + '.']].concat([1, 2, 3, 4].filter(function (j) { return j !== q && j !== 1; }).map(function (j) { return [fromRef(45, j), LID + '-from-ref', 'Check the quadrant: ' + SIGNS[q] + ' is quadrant ' + q + '.']; })),
          sol: U.sketch({ grid: Math.max(6, k), pt: [x, y], ptLabel: '(' + x + ', ' + y + ')', rot: { to: ans }, drop: true, w: 200 }) + 'The point is in quadrant ' + q + '. The right triangle to the x-axis has two equal legs (' + k + ' and ' + k + '), so it is isosceles and ' + t('\\theta_R=45^\\circ') + '. ' + fromStep(45, q) + '.',
          hints: ['Drop a perpendicular to the x-axis. What kind of right triangle has two equal legs?'], text: 'NR: θ from a point with equal legs' });
      } }] }
  ];

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'State the quadrant in which each angle terminates, or the axis it lies on.', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) { return quadMC(r, angQ(r, 3, 5, 85, [199])); } },
      { id: 'A1b', level: 'BEG', make: function (r) { return quadMC(r, angQ(r, 1, 80, 89, [89])); } },
      { id: 'A1c', level: 'BEG', make: function (r) { return quadMC(r, angQ(r, 4, 5, 85, [301])); } },
      { id: 'A1d', level: 'BEG', make: function (r) { return quadMC(r, angQ(r, 2, 80, 89, [91])); } },
      { id: 'A1e', level: 'BEG', make: function (r) { return quadMC(r, r.pick([90, 180, 360, 270])); } },
      { id: 'A1f', level: 'BEG', make: function (r) { return quadMC(r, angQ(r, 2, 1, 9, [179])); } }] },
    { num: 'A2', stem: 'Determine the reference angle of each angle.', parts: [[2, 10, 80, [152]], [3, 10, 80, [212]], [4, 10, 80, [299]], [1, 10, 85, [76]], [0], [3, 75, 89, [263]]].map(function (z, i) {
      return { id: 'A2' + 'abcdef'[i], level: z[0] ? 'BEG' : 'EMG', make: function (r) { var a = z[0] ? angQ(r, z[0], z[1], z[2], z[3]) : r.pick([90, 180, 270, 360]); return refPart('The angle ' + t(D(a)) + '.', a, { text: 'reference angle' }); } };
    }) },
    { num: 'A3', stem: 'Determine the rotation angle ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta\\le 360^\\circ') + ', from its reference angle and quadrant.', parts: [[4, 10, 80, 27], [2, 10, 80, 54], [3, 80, 89, 89], [3, 1, 9, 3]].map(function (z, i) {
      return { id: 'A3' + 'abcd'[i], level: i < 2 ? 'BEG' : 'EMG', make: function (r) { var R = pickWhere(function () { return r.int(z[1], z[2]); }, function (x) { return x !== z[3] && x !== 45 && EXA.indexOf(fromRef(x, z[0])) < 0; }); return fromPart(t('\\theta_R=' + D(R)) + ', quadrant ' + z[0] + '.', R, z[0], { text: 'θ from θR and quadrant' }); } };
    }) },
    { num: 'A4', stem: 'Each point is on the terminal arm of an angle ' + t('\\theta') + ' in standard position. Plot the point, draw ' + t('\\theta') + ', and state its quadrant.', parts: [
      { id: 'A4a', level: 'BEG', make: function (r) { var p = ptQ(r, 2, 1, 6, ['-1,5']); return ptQuadMC(r, p[0], p[1], '', { prompt: 'The point ' + t(ptTex(p[0], p[1])) + '. Where does ' + t('\\theta') + ' terminate?' }); } },
      { id: 'A4b', level: 'EMG', make: function (r) {
        var q = r.pick([2, 3, 4]), k = pickWhere(function () { return r.int(2, 6); }, function (x) { return x !== 6 && x !== 3; }), x = q === 4 ? k : -k, y = q === 2 ? k : -k, ans = fromRef(45, q);
        return U.fieldsP('The point ' + t(ptTex(x, y)) + '. State its quadrant and ' + t('\\theta') + '.', [{ label: 'Quadrant', name: 'Quadrant', ans: q, after: '', cands: [1, 2, 3, 4].filter(function (j) { return j !== q; }).map(function (j) { return [j, LID + '-quad', 'Look at the signs: ' + SIGNS[q] + '.']; }) },
          { label: t('\\theta'), name: 'θ', before: '=', ans: ans, cands: [[45, LID + '-isosceles', 'That is the reference angle (equal legs). Now place ' + t('\\theta') + ' in quadrant ' + q + '.']] }],
          { sol: U.sketch({ grid: 6, pt: [x, y], ptLabel: '(' + x + ', ' + y + ')', rot: { to: ans }, drop: true, w: 200 }) + 'Quadrant ' + q + ' (equal legs: ' + t('\\theta_R=45^\\circ') + ', ' + fromStep(45, q) + ').', hints: ['Equal legs make an isosceles right triangle: ' + t('\\theta_R=45^\\circ') + '.'], text: 'point with equal legs: quadrant and θ' });
      } },
      { id: 'A4c', level: 'BEG', make: function (r) { var p = ptQ(r, 3, 1, 6, ['-5,-3']); return ptQuadMC(r, p[0], p[1], '', { prompt: 'The point ' + t(ptTex(p[0], p[1])) + '. Where does ' + t('\\theta') + ' terminate?' }); } }] },
    { num: 'B1', section: 'B. Applying', stem: 'Determine the three other angles from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' with the same reference angle as the given angle.', parts: [
      { id: 'B1a', level: 'PRG', make: function (r) { var a = angQ(r, 2, 60, 88, [98]); return otherThree('The angle ' + t(D(a)) + '.', a); } },
      { id: 'B1b', level: 'PRG', make: function (r) { var a = angQ(r, 3, 60, 88, [264]); return otherThree('The angle ' + t(D(a)) + '.', a); } },
      { id: 'B1c', level: 'PRG', make: function (r) { var a = angQ(r, 4, 3, 25, [349]); return otherThree('The angle ' + t(D(a)) + '.', a); } }] },
    { num: 'B2', stem: 'State the angle from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' that has the same terminal arm as each rotation.', parts: [
      { id: 'B2a', level: 'EMG', make: function (r) { var a = -pickWhere(function () { return r.int(275, 350); }, function (x) { return x !== 310 && x !== 315; }); return coterm('A rotation of ' + t(D(a)) + '.', a); } },
      { id: 'B2b', level: 'EMG', make: function (r) { var a = 360 + pickWhere(function () { return r.int(95, 175); }, function (x) { return x !== 140 && x !== 135; }); return coterm('A rotation of ' + t(D(a)) + '.', a); } },
      { id: 'B2c', level: 'EMG', make: function (r) { var a = -r.pick([90, 180, 270]); return coterm('A rotation of ' + t(D(a)) + '.', a, { text: 'co-terminal: negative quadrantal' }); } }] },
    { num: 'B3', shared: function (r) {
        return pickWhere(function () { var a = r.int(2, 9), b = r.int(1, 8), th = Math.atan2(b, a) * 180 / Math.PI; return { a: a, b: b, th: Math.round(th), fr: th - Math.floor(th) }; },
          function (z) { return z.a !== z.b && Math.abs(z.fr - 0.5) > 0.08 && ['8,3', '2,6', '3,5'].indexOf(z.a + ',' + z.b) < 0 && gcd(z.a, z.b) === 1; });
      },
      stem: function (s) { return 'The point ' + t(ptTex(s.a, s.b, 'P')) + ' is on the terminal arm of an angle of ' + t(D(s.th)) + ' (to the nearest degree). State the image of ' + t('P') + ' and the rotation angle through it after each reflection.'; }, parts: [
      { id: 'B3a', level: 'PRG', make: function (r, s) { return reflPart('In the ' + t('y') + '-axis.', s.a, s.b, s.th, 'y'); } },
      { id: 'B3b', level: 'PRG', make: function (r, s) { return reflPart('In both axes.', s.a, s.b, s.th, 'o'); } },
      { id: 'B3c', level: 'PRG', make: function (r, s) { return reflPart('In the ' + t('x') + '-axis.', s.a, s.b, s.th, 'x'); } }] },
    { num: 'B4', parts: [
      { id: 'B4', level: 'ADV', make: function (r) { var a = angQ(r, r.pick([2, 3, 4]), 5, 85, [341, 305]); return yErrMC(r, 'A student', a); } }] },
    { num: 'B5', parts: [
      { id: 'B5', level: 'PRG', make: function (r) {
        var R = pickWhere(function () { return r.int(10, 80); }, function (x) { return x !== 25 && x !== 45; }), oq = r.pick([2, 3, 4]), odd = fromRef(90 - R, oq);
        var opts = [2, 3, 4].map(function (k) { return k === oq ? { html: t(D(odd)), right: true } : { html: t(D(fromRef(R, k))), why: refStep(fromRef(R, k)) + ' That <b>does</b> have the reference angle ' + t(D(R)) + '.' }; });
        opts.push({ html: t(D(R)), why: 'In quadrant 1, ' + t('\\theta_R=\\theta') + ': that does have the reference angle ' + t(D(R)) + '.' });
        return U.mcP(r, '<i>(Multiple Choice)</i> Which angle does <b>not</b> have a reference angle of ' + t(D(R)) + '?', opts, refStep(odd) + ' The others: ' + [1, 2, 3, 4].filter(function (k) { return k !== oq; }).map(function (k) { return t(D(fromRef(R, k))); }).join(', ') + ' all have ' + t('\\theta_R=' + D(R)) + '.', H_REF, 'MC: which does not have this reference angle', true);
      } }] },
    { num: 'B6', parts: [
      { id: 'B6', level: 'EMG', make: function (r) {
        var q = r.pick([2, 3, 4]), R = pickWhere(function () { return r.int(10, 85); }, function (x) { return x !== 38 && x !== 45 && EXA.indexOf(fromRef(x, q)) < 0; });
        var p = fromPart('<i>(Numerical Response)</i> An angle ' + t('\\theta') + ' terminates in quadrant ' + q + ' and has a reference angle of ' + t(D(R)) + '. The value of ' + t('\\theta') + ' is ______' + t('^\\circ') + '.', R, q, { text: 'NR: θ from θR and quadrant' });
        p.input.nr = true; p.input.before = undefined; var inner = p.check; p.check = function (resp) { var s = String(resp == null ? '' : resp).replace(/\s/g, ''); if (HW.parse.number(s).ok && s.length > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).'); return inner(resp); };
        return p;
      } }] },
    { num: 'C1', section: 'C. Stretch', shared: function (r) {
        var pairs = [[2, 4], [2, 3], [3, 4], [3, 2], [4, 2], [4, 3], [2, 1], [3, 1], [4, 1]], pq = r.pick(pairs);
        return { qs: pq[0], qt: pq[1], a: angQ(r, pq[0], 10, 80, [130]) };
      },
      stem: function (s) { return 'An angle ' + t('\\theta') + ' terminates in quadrant ' + s.qs + '.'; }, parts: [
      { id: 'C1a', level: 'MAS', make: function (r, s) {
        var E = { '2,1': '180^\\circ-\\theta', '2,3': '360^\\circ-\\theta', '2,4': '180^\\circ+\\theta', '3,1': '\\theta-180^\\circ', '3,2': '360^\\circ-\\theta', '3,4': '540^\\circ-\\theta', '4,1': '360^\\circ-\\theta', '4,2': '\\theta-180^\\circ', '4,3': '540^\\circ-\\theta' };
        var RX = { 2: '180^\\circ-\\theta', 3: '\\theta-180^\\circ', 4: '360^\\circ-\\theta' }, want = E[s.qs + ',' + s.qt];
        var pool = ['180^\\circ-\\theta', '180^\\circ+\\theta', '360^\\circ-\\theta', '\\theta-180^\\circ', '540^\\circ-\\theta', '\\theta+90^\\circ'].filter(function (e) { return e !== want; });
        var wr = r.sample(pool, 3);
        var sub = { 1: function (x) { return x; }, 2: function (x) { return '180^\\circ-(' + x + ')'; }, 3: function (x) { return '180^\\circ+(' + x + ')'; }, 4: function (x) { return '360^\\circ-(' + x + ')'; } }[s.qt];
        return U.mcP(r, 'Which expression gives the angle in quadrant ' + s.qt + ' with the same reference angle as ' + t('\\theta') + '?', [{ html: t(want), right: true }].concat(wr.map(function (e) { return { html: t(e), why: 'Test it with a quadrant ' + s.qs + ' angle, e.g. ' + t('\\theta=' + D(s.a)) + ': does your expression give an angle in quadrant ' + s.qt + ' with the same reference angle?' }; })),
          'In quadrant ' + s.qs + ', ' + t('\\theta_R=' + RX[s.qs]) + '. The quadrant ' + s.qt + ' angle is ' + t(FROM_F[s.qt - 1].replace(/\\theta=/, '')) + ' with that ' + t('\\theta_R') + ': ' + t(sub(RX[s.qs]) + '=' + want) + '.', ['Write ' + t('\\theta_R') + ' in terms of ' + t('\\theta') + ' first, then put it into the quadrant ' + s.qt + ' formula.'], 'expression: same θR in another quadrant');
      } },
      { id: 'C1b', level: 'ADV', make: function (r, s) {
        var R = refOf(s.a), ans = fromRef(R, s.qt);
        return U.numP('Check: when ' + t('\\theta=' + D(s.a)) + ', the quadrant ' + s.qt + ' angle with the same reference angle is', ans, { before: '', cands: fromCands(R, s.qt).concat([[n360(180 + s.a) === ans ? null : n360(180 + s.a), LID + '-from-ref', 'Find ' + t('\\theta_R') + ' of ' + t(D(s.a)) + ' first.']]).filter(function (c) { return c[0] != null; }),
          sol: refStep(s.a) + ' Quadrant ' + s.qt + ': ' + fromStep(R, s.qt) + '.', hints: H_FROM, text: 'check the expression with a value' });
      } }] },
    { num: 'C2', parts: [
      { id: 'C2', level: 'MAS', make: function (r) {
        var cfg = r.pick([{ qa: 2, qb: 4, op: '+' }, { qa: 1, qb: 3, op: '+' }, { qa: 2, qb: 3, op: '-' }, { qa: 3, qb: 4, op: '-' }, { qa: 1, qb: 4, op: '-' }, { qa: 1, qb: 2, op: '-' }]);
        var x = pickWhere(function () { return r.int(10, 80); }, function (v) { return v !== 70 && v !== 45 && v !== 60 && v !== 30; }), A = fromRef(x, cfg.qa), Bv = fromRef(x, cfg.qb), S = cfg.op === '+' ? A + Bv : Bv - A;
        var EA = ['x', '180^\\circ-x', '180^\\circ+x', '360^\\circ-x'];
        var rel = cfg.op === '+' ? 'A+B=' + D(S) : 'B-A=' + D(S);
        var eqn = cfg.op === '+' ? '(' + EA[cfg.qa - 1] + ')+(' + EA[cfg.qb - 1] + ')=' + D(S) : '(' + EA[cfg.qb - 1] + ')-(' + EA[cfg.qa - 1] + ')=' + D(S);
        var sumWrong = cfg.op === '+' ? [[fromRef(90 - x, cfg.qa), LID + '-sum', 'Check: do your angles add to ' + t(D(S)) + ' and have the same reference angle?']] : [];
        return U.fieldsP('Angle ' + t('A') + ' terminates in quadrant ' + cfg.qa + ' and angle ' + t('B') + ' in quadrant ' + cfg.qb + '. They have the same reference angle, and ' + t(rel) + '. Determine ' + t('A') + ' and ' + t('B') + '.',
          [{ label: t('A'), name: 'A', before: '=', ans: A, cands: sumWrong }, { label: t('B'), name: 'B', before: '=', ans: Bv }],
          { sol: 'Let the reference angle be ' + t('x') + ': ' + t('A=' + EA[cfg.qa - 1]) + ', ' + t('B=' + EA[cfg.qb - 1]) + '.<br>' + t(eqn) + ' gives ' + t('x=' + D(x)) + '. So ' + t('A=' + D(A)) + ' and ' + t('B=' + D(Bv)) + '.', hints: ['Call the reference angle ' + t('x') + ' and write ' + t('A') + ' and ' + t('B') + ' in terms of ' + t('x') + '.', 'Then use the given ' + (cfg.op === '+' ? 'sum' : 'difference') + ' to solve for ' + t('x') + '.'], text: 'two angles, same θR, given sum/difference' });
      } }] },
    { num: 'C3', parts: [
      { id: 'C3', level: 'ADV', make: function (r) {
        return U.mcP(r, 'Show that the four angles from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' with any reference angle ' + t('x') + ' (where ' + t('0^\\circ<x<90^\\circ') + ') always add to ' + t('720^\\circ') + '. Which argument is correct?', [
          { html: t('x+(180^\\circ-x)+(180^\\circ+x)+(360^\\circ-x)=720^\\circ') + ': the ' + t('x') + ' terms cancel.', right: true },
          { html: t('x+(90^\\circ+x)+(180^\\circ+x)+(270^\\circ+x)=540^\\circ+4x') + ', which is ' + t('720^\\circ') + ' when ' + t('x=45^\\circ') + '.', why: 'Those angles turn ' + t('x') + ' past each axis, so some are measured to the y-axis. The four angles are ' + t('x,\\ 180^\\circ-x,\\ 180^\\circ+x,\\ 360^\\circ-x') + '.' },
          { html: 'Check one example: ' + t('30^\\circ+150^\\circ+210^\\circ+330^\\circ=720^\\circ') + ', so it is always true.', why: 'One example doesn’t show it for <b>every</b> ' + t('x') + '. Add the four general angles.' },
          { html: t('4\\times 180^\\circ=720^\\circ') + ', because every angle is ' + t('180^\\circ') + '.', why: 'The angles are not all ' + t('180^\\circ') + '. Write each one in terms of ' + t('x') + '.' }],
          t('x+(180^\\circ-x)+(180^\\circ+x)+(360^\\circ-x)=720^\\circ+(x-x+x-x)=720^\\circ') + '.', ['Write the four angles in terms of ' + t('x') + ' and add them.'], 'show: the four angles add to 720°');
      } }] }
  ];

  HW.defineLesson({ id: 'u3l1', unit: 3, num: 1, title: 'Angles in Standard Position and Reference Angles', outcome: 'T1', questions: QUESTIONS, extra: EXTRA });
})(window);
