/* Math 20-1 · Unit 5 · Lesson 2 — Graphing y = a(x − p)² + q (outcome RF3 on every part)
 * Assignment 2 (m201book unit5/u5_l02.tex, Questions 1–18) and the Lesson 2 Extra Practice (u5_ep02.tex, A1–A3, B1–B5,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (contexts vary a
 * little); the lesson's example functions and the booklet's own functions are left out. Calculator lesson (nothing here
 * needs one); answers are exact, with fractions where the booklet uses them.
 *
 * Built on the kit HW.p51 (js/lessons/u5l1.js, loaded first) and, inside generators and checkers only, HW.u5k34
 * (js/lessons/u5l3.js: points, the axis, max/min words, ranges, vertex-form expressions, field builder, choose-the-graph).
 * Added to HW.p51 here: vf(a, p, q) (vertex-form TeX), desc(a, p, q) (the booklet's description of the transformations),
 * symChk(fn, vars, o) (an expression in letters such as h, k, checked by value), subWrap(mk, envs) (a letter answer checked
 * by substituting numbers into a numeric checker), shiftChk(n, dir) ("3 units left"), wordChk(word, words).
 * Recognised mistakes (codes u5l2-…): the sign of p (x + 3 read as 3 right) or of q, a not solved for y first (y + 6 = …,
 * 3y = …, −y = …), the stretch factor upside down, a reflection left out or added, the horizontal and vertical translations
 * swapped, translating before stretching (the vertex or point stretched too), the point's x-coordinate stretched, the step
 * pattern not multiplied by a, the direction of opening, a reflection that keeps the vertex where it was.
 * Conversions: "describe how the graph is related to y = x²" → multiple choice of descriptions (distractors from those
 * mistakes); "describe the translations" → boxes such as "3 units left"; "sketch" → choose the graph, or the vertex and the
 * step-pattern points in boxes (Extra B1); "explain his error" → multiple choice; "use a table of values to explain" → the
 * table and the conclusion in boxes; "complete the table" → boxes; numerical response → a number box (4 characters).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 8(e), Extra C3(b). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u5l2', X = HW.p51;
  if (!X) throw new Error('u5l2.js needs js/lessons/u5l1.js (HW.p51) loaded first');
  var z = X.z, cl = X.cl, same = X.same, gcd = X.gcd, pickWhere = X.pickWhere, nz = X.nz, toFrac = X.toFrac, nT = X.nT, rT = X.rT, vT = X.vT, cT = X.cT, sT = X.sT, aTex = X.aTex, ptTex = X.ptTex;

  /* ---- vertex form and descriptions ---- */
  function vf(a, p, q, frac) { return aTex(a, frac) + (same(p, 0) ? 'x^{2}' : '(x' + sT(-p, frac) + ')^{2}') + sT(q, frac); }
  function fnOf(a, p, q) { return function (x) { return a * (x - p) * (x - p) + q; }; }
  function units(n, w) { return t(vT(Math.abs(n))) + ' unit' + (same(Math.abs(n), 1) ? '' : 's') + ' ' + w; }
  function hWord(p) { return units(p, p > 0 ? 'right' : 'left'); }
  function vWord(q) { return units(q, q > 0 ? 'up' : 'down'); }
  function facT(s, dec) { return t(dec ? nT(s) : cT(s, true)); }
  function desc(a, p, q, o) {
    o = o || {}; var parts = [], s = Math.abs(a), tr = [];
    if (!same(s, 1)) parts.push('vertical stretch by a factor of ' + facT(s, o.dec) + ' about the ' + t('x') + '-axis');
    if (a < 0) parts.push('reflection in the ' + t('x') + '-axis');
    if (!same(p, 0)) tr.push(hWord(p)); if (!same(q, 0)) tr.push(vWord(q));
    if (tr.length) parts.push('translation ' + tr.join(' and '));
    var s0 = parts.join(', ');
    return s0 ? s0.charAt(0).toUpperCase() + s0.slice(1) : 'No change';
  }
  X.vf = vf; X.desc = desc;
  /* a multiple choice of descriptions; first = specific wrong descriptions [{ a, p, q, why, code }] tried before the generic ones */
  function descMC(r, prompt, a, p, q, first, sol, hints, text, o) {
    o = o || {};
    var right = desc(a, p, q, o), seen = {}, opts = [{ html: right, right: true }]; seen[right] = 1;
    var gen = (first || []).concat([
      { a: a, p: -p, q: q, why: 'Check the horizontal direction: ' + t('(x-p)^{2}') + ' moves the graph ' + t('p') + ' units <b>right</b>, so ' + t('(x+3)^{2}') + ' moves it 3 units <b>left</b>.', code: LID + '-p-sign' },
      { a: a, p: p, q: -q, why: 'Check the vertical direction: ' + t('+q') + ' moves the graph up and ' + t('-q') + ' moves it down.', code: LID + '-q-sign' },
      { a: 1 / a, p: p, q: q, why: 'In ' + t('y=ax^{2}') + ' every ' + t('y') + '-value is multiplied by ' + t('a') + ': the stretch factor is ' + t('|a|') + '.', code: LID + '-recip' },
      { a: -a, p: p, q: q, why: a < 0 ? 'A negative ' + t('a') + ' includes a reflection in the ' + t('x') + '-axis.' : 'Here ' + t('a>0') + ': there is no reflection.', code: LID + '-reflect' },
      { a: a, p: q, q: p, why: 'The number inside the bracket with ' + t('x') + ' gives the <b>horizontal</b> translation; the number added at the end gives the <b>vertical</b> one.', code: LID + '-swap' },
      { a: a, p: -p, q: -q, why: 'Check both directions: ' + t('(x-p)^{2}+q') + ' is ' + t('p') + ' right and ' + t('q') + ' up.', code: LID + '-p-sign' }]);
    gen.forEach(function (w) {
      if (opts.length >= 4) return;
      if (!isFinite(w.a) || same(w.a, 0)) return;
      var h = w.html || desc(w.a, w.p, w.q, o); if (seen[h]) return; seen[h] = 1;
      opts.push({ html: h, why: w.why, code: w.code });
    });
    return X.mc(r, prompt, opts, sol || ('Compared with ' + t('y=x^{2}') + ': ' + right.charAt(0).toLowerCase() + right.slice(1) + '.'), hints || HD, text);
  }
  /* the equation of an image: vertex-form answer checked by value (HW.u5k34.exprChk), with the classic slips */
  function vfCands(a, p, q, o) {
    o = o || {}; var c = [];
    if (!same(p, 0)) c.push({ a: a, p: -p, q: q, code: LID + '-p-sign', hint: 'Moving the graph ' + t('p') + ' units <b>right</b> gives ' + t('(x-p)^{2}') + '; moving it left gives ' + t('(x+p)^{2}') + '.' });
    if (!same(q, 0)) c.push({ a: a, p: p, q: -q, code: LID + '-q-sign', hint: 'Moving the graph up adds to every ' + t('y') + '-value (' + t('+q') + '); moving it down subtracts.' });
    if (!same(Math.abs(a), 1)) c.push({ a: 1 / a, p: p, q: q, code: LID + '-recip', hint: 'A vertical stretch by a factor of ' + t('s') + ' multiplies every ' + t('y') + '-value by ' + t('s') + ': ' + t('a=s') + '.' });
    if (a < 0) c.push({ a: -a, p: p, q: q, code: LID + '-reflect', hint: 'A reflection in the ' + t('x') + '-axis makes ' + t('a') + ' negative.' });
    if (!same(q, 0) && !same(a, 1)) c.push({ a: a, p: p, q: cl(a * q), code: LID + '-order', hint: 'Stretch and reflect <b>first</b>, then translate: the vertical translation is not multiplied by ' + t('a') + ', so the constant is ' + t(vT(q)) + '.' });
    if (!same(p, q)) c.push({ a: a, p: q, q: p, code: LID + '-swap', hint: 'The horizontal translation goes inside the bracket with ' + t('x') + '; the vertical one is added at the end.' });
    return c.filter(function (w) { return !(same(w.a, a) && same(w.p, p) && same(w.q, q)) && isFinite(w.a); });
  }
  function vfPart(prompt, a, p, q, o) {
    o = o || {}; var Z = z(), key = vf(a, p, q, o.frac !== false), C = vfCands(a, p, q, o).concat(o.cands || []);
    return { prompt: prompt, input: { type: 'math', keys: 'u5k34', vars: ['x', 'y'], before: t('y='), placeholder: 'e.g. y = -2(x - 3)^2 + 5' },
      check: Z.exprChk(fnOf(a, p, q), { vertex: { a: a, p: p, q: q }, cands: C.map(function (w) { return [fnOf(w.a, w.p, w.q), w.code, w.hint]; }), what: 'the transformed graph' }),
      key: key, answer: t('y=' + key), solution: o.sol, hints: o.hints || HE, text: o.text, bad: C.map(function (w) { return vf(w.a, w.p, w.q, true); }) };
  }
  function vfSpec(label, a, p, q, o) {
    o = o || {}; var C = vfCands(a, p, q, o).concat(o.cands || []);
    return { label: label, name: o.name || String(label).replace(/<[^>]+>|\\\(|\\\)/g, ''), before: t('y='), expr: { fn: fnOf(a, p, q), key: vf(a, p, q, true), vertex: { a: a, p: p, q: q }, cands: C.map(function (w) { return [fnOf(w.a, w.p, w.q), w.code, w.hint]; }) }, placeholder: 'e.g. y = -2(x - 3)^2 + 5' };
  }

  /* ---- answers in letters ---- */
  var ENVS = [{ x: -1.3, h: 2.7, k: 1.9, m: 3.1, n: 0.7, c: 2.3, d: 1.6, e: 4.1, a: 1.45, s: 2.15, b: 0.35, r: 1.15, t: 2.65 }, { x: 0.6, h: -1.4, k: 3.3, m: 1.2, n: 2.9, c: 0.8, d: -2.2, e: -1.7, a: 3.05, s: 0.55, b: 2.45, r: -0.85, t: 1.35 },
    { x: 2.2, h: 0.9, k: -2.6, m: -0.5, n: 1.8, c: 3.4, d: 0.3, e: 2.5, a: 0.65, s: 1.75, b: -1.25, r: 2.95, t: -0.45 }, { x: -2.7, h: 3.8, k: 0.4, m: 2.4, n: -1.1, c: 1.7, d: 2.9, e: -0.6, a: 2.25, s: 3.35, b: 1.55, r: 0.25, t: 3.15 }];
  function hasSquareOfSum(a) {
    var hit = false; (function walk(n) { if (!n || hit || typeof n !== 'object') return; if (n.t === 'pow') { var b = n.a; while (b && b.t === 'paren') b = b.a; if (b && (b.t === 'add' || b.t === 'sub')) { hit = true; return; } } ['a', 'b', 'n'].forEach(function (k) { if (n[k] && typeof n[k] === 'object') walk(n[k]); }); })(a);
    return hit;
  }
  /* fn(env) the right value; o.vertex: must keep the squared bracket; o.cands [[fn, code, hint]] */
  X.symChk = function (fn, vars, o) {
    o = o || {};
    return function (resp) {
      var a = K.read(z().stripLHS(resp)); if (a.res) return a.res;
      var vs = Object.keys(ex.shape(a.ast).vars), bad = vs.filter(function (v) { return vars.indexOf(v) < 0; });
      if (bad.length) return form(LID + '-letter', 'Use only the letters ' + vars.map(function (v) { return t(v); }).join(', ') + ' (you used ' + t(bad[0]) + ').');
      function eq(g) { return ENVS.every(function (e) { var y1 = ex.value(a.ast, e), y2 = g(e); return isFinite(y1) && Math.abs(y1 - y2) < 1e-7 * Math.max(1, Math.abs(y2)); }); }
      if (eq(fn)) { if (o.vertex && !hasSquareOfSum(a.ast)) return form('u5l3-not-vertex', 'Right — now write it in vertex form, with the squared bracket (don’t expand).'); return ok(); }
      var c = o.cands || [];
      for (var i = 0; i < c.length; i++) if (eq(c[i][0])) return wrong(c[i][1], c[i][2]);
      return wrong('value', o.hint || null);
    };
  };
  function subst(s, env) { return String(s == null ? '' : s).replace(/\\[a-zA-Z]+|[a-zA-Z]/g, function (m) { return m.length === 1 && Object.prototype.hasOwnProperty.call(env, m) ? String(env[m]) : m; }); }
  /* a letter answer checked by putting numbers in for the letters: mk(env) → a numeric checker */
  X.subWrap = function (mk, envs) {
    var cs = null;
    return function (resp) {
      if (!cs) cs = envs.map(mk);
      var rs = envs.map(function (e, i) { return cs[i](subst(resp, e)); }), bad = rs.filter(function (x) { return x.v !== 'correct'; });
      return bad.length ? bad[0] : ok();
    };
  };
  /* "3 units left" */
  var OPP = { left: 'right', right: 'left', up: 'down', down: 'up' };
  function readAmount(s) { var m = /(-?\d+(?:\.\d+)?)(?:\s*\/\s*(\d+))?/.exec(s); if (!m) return null; return m[2] ? Number(m[1]) / Number(m[2]) : Number(m[1]); }
  X.shiftChk = function (n, dir) {
    var hz = dir === 'left' || dir === 'right';
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, '$1$2').replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2').replace(/\\[a-z]+/g, ' ');
      var w = /(left|right|up|down)/.exec(s), v = readAmount(s);
      if (!w || v == null) return form(LID + '-shift-form', 'Write the number of units and the direction, e.g. <b>3 units left</b>.');
      if (v < 0) return form(LID + '-shift-form', 'Give the number of units as a positive number and say the direction (left, right, up or down).');
      var hw = w[1] === 'left' || w[1] === 'right';
      if (w[1] === dir && same(v, n)) return ok();
      if (hw !== hz) return wrong(LID + '-swap', 'This box is the <b>' + (hz ? 'horizontal' : 'vertical') + '</b> translation (' + (hz ? 'left or right' : 'up or down') + ').');
      if (w[1] === OPP[dir] && same(v, n)) return wrong(hz ? LID + '-p-sign' : LID + '-q-sign', hz ? 'Check the direction: the vertex moved from ' + t('x=0') + ' to the new ' + t('x') + '-value.' : 'Check the direction: the vertex moved from ' + t('y=0') + ' to the new ' + t('y') + '-value.');
      if (w[1] === dir) return wrong('value', 'The direction is right — check the number of units.');
      return wrong('value', null);
    };
  };
  function shiftSpec(label, d, horiz) { var dir = horiz ? (d > 0 ? 'right' : 'left') : (d > 0 ? 'up' : 'down'), n = Math.abs(d), key = vT(n) + ' unit' + (n === 1 ? '' : 's') + ' ' + dir; return { label: label, name: label, check: X.shiftChk(n, dir), key: key, ansTex: '\\text{' + key + '}', text: true, placeholder: 'e.g. 3 units left' }; }
  X.wordChk = function (word, words, hint) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[\\{}\s]/g, '');
      var hit = words.filter(function (w) { return s.indexOf(w) >= 0; });
      if (hit.length !== 1) return form(LID + '-word', 'Type one word: ' + words.map(function (w) { return '<b>' + w + '</b>'; }).join(' or ') + '.');
      return hit[0] === word ? ok() : wrong(LID + '-word-wrong', hint || null);
    };
  };

  /* =========================== Lesson 2 =========================== */
  var CODES = {
    'u5l2-p-sign': 'Horizontal translation in the wrong direction (sign of p)', 'u5l2-q-sign': 'Vertical translation in the wrong direction (sign of q)', 'u5l2-recip': 'Stretch factor upside down',
    'u5l2-reflect': 'Reflection left out (or added)', 'u5l2-swap': 'Horizontal and vertical translations swapped', 'u5l2-order': 'Translated before stretching', 'u5l2-solve-y': 'Didn’t solve for y first',
    'u5l2-pt-x': 'Point: stretched or moved the wrong coordinate', 'u5l2-step': 'Step pattern not multiplied by a', 'u5l2-g-dir': 'Graph opens the wrong way', 'u5l2-reflect-q': 'Reflection: kept the vertex where it was',
    'u5l2-letter': 'Wrong letters in the answer', 'u5l2-shift-form': 'Translation not written as units and a direction', 'u5l2-word': 'Not one of the words asked for', 'u5l2-word-wrong': 'Wrong direction word',
    'u5l2-sam': 'Error analysis: wrong explanation', 'u5l2-width': 'Width (narrower/wider) misread', 'u5l2-table': 'Table of values: wrong value', 'u5l2-k': 'Value on the image wrong'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u5l2-p-sign': 's', 'u5l2-q-sign': 's', 'u5l2-recip': 'b', 'u5l2-reflect': 's', 'u5l2-swap': 'b', 'u5l2-order': 'b', 'u5l2-solve-y': 'b', 'u5l2-pt-x': 'b', 'u5l2-step': 'b', 'u5l2-g-dir': 'b',
    'u5l2-reflect-q': 'b', 'u5l2-width': 's', 'u5l2-table': 's', 'u5l2-word-wrong': 'b' });

  var HD = ['Compare with ' + t('y=a(x-p)^{2}+q') + ': ' + t('|a|') + ' is the vertical stretch factor (and ' + t('a<0') + ' adds a reflection in the ' + t('x') + '-axis), ' + t('p') + ' is the horizontal translation and ' + t('q') + ' the vertical one.', 'Watch the sign: ' + t('(x+4)^{2}=(x-(-4))^{2}') + ', so ' + t('p=-4') + ': 4 units <b>left</b>.'];
  var HE = ['The image of ' + t('y=x^{2}') + ' is ' + t('y=a(x-p)^{2}+q') + ': the stretch factor (negative for a reflection) is ' + t('a') + ', the translation is ' + t('p') + ' units horizontally and ' + t('q') + ' units vertically.', 'Right ' + t('p') + ' units gives ' + t('(x-p)^{2}') + '; left gives ' + t('(x+p)^{2}') + '.'];
  var HP = ['Each point ' + t('(x,\\ y)') + ' of ' + t('y=x^{2}') + ' maps to ' + t('(x+p,\\ ay+q)') + ': stretch (and reflect) the ' + t('y') + '-value first, then translate.'];
  var HS = ['Plot the vertex ' + t('(p,\\ q)') + '. From it, go 1 right (and 1 left) and ' + t('a\\times 1') + ' vertically; 1 more and ' + t('a\\times 3') + '; 1 more and ' + t('a\\times 5') + '.'];
  /* the lesson's examples and the booklet's own functions [a, p, q] */
  var AV = z0avoid([[1, 0, 0], [1, 0, -4], [1, 3, 0], [1, 0, -5], [1, 4, 0], [1, -6, 0], [1, -1, 7], [1, 3, 2], [1, -2, -5], [1, 3, -5], [1, -4, -2], [1, -3, 2], [2, 0, 0], [0.5, 0, 0], [-1, 0, 0], [-3, 1, 6], [0.5, -5, -2],
    [0.5, 8, 6], [-4, -3, 7], [2, -4, -3], [2, 3, -5], [-0.5, -2, 4], [1, 7, 0], [1, 0, 9], [1, 0, -6], [1, -4, -1], [1, 5, 5], [1, -9, 0], [1, 2, 6], [1, 0, -8], [1, -5, 0], [1, 3, 3], [1, -1, -4], [1, -5, 3], [5, 0, 0],
    [-0.25, 0, 0], [-2, 6, 1], [2 / 3, -3, -4], [1 / 3, 1, -3], [-1, -2, 0], [-3, 0, 0], [0.5, 0, 7], [-5, 2, -4], [0.75, -6, 1], [-2, 4, 3], [3, -1, 2], [3, 2, -4], [-1, -3, 5], [0.25, 4, -3], [2, -1, 5], [-1 / 3, 6, 0],
    [-5, 0, -2], [-2, 3, 5], [-3, 2, 7], [-0.5, 2, 9], [1, 0, 11], [1, 9, 0], [1, -2, -6], [-4, 0, 0], [0.2, 1, 3], [-3, -7, -5], [1, 8, 0], [1, -2, -9], [-6, 1, 2], [0.4, -4, 0], [-1, 4, 2], [3, -1, -7], [0.5, 0, 8],
    [2, -1, -3], [-0.25, 2, 3], [1 / 3, -4, -2], [-2, 1, 5], [1, -3, 3], [4, -2, 0], [3, 5, -1], [2, 1, 3], [2, -3, -3], [-2, -3, 3], [-2.5, 3, 1]]);
  function z0avoid(list) { return function (a, p, q) { return !list.some(function (L) { return same(L[0], a) && same(L[1], p) && same(L[2], q); }); }; }
  function sgn(r) { return r.chance(0.5) ? 1 : -1; }
  function eqT(a, p, q, frac) { return t('y=' + vf(a, p, q, frac !== false)); }
  function pick3(r, gen) { return pickWhere(gen, function (o) { return AV(o.a, o.p, o.q); }); }
  /* transformation statements in words */
  function stW(s, dec) { return 'a vertical stretch by a factor of ' + facT(s, dec) + ' about the ' + t('x') + '-axis'; }
  var RFW = 'a reflection in the ' + t('x') + '-axis';
  function trW(p, q) { var L = []; if (!same(p, 0)) L.push(hWord(p)); if (!same(q, 0)) L.push(vWord(q)); return 'a translation of ' + L.join(' and '); }
  function listW(items) { return items.length < 3 ? items.join(' and ') : items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1]; }
  /* the image of a point (x0, x0²) */
  function ptCands(x0, a, p, q) {
    var y0 = x0 * x0, c = [[[x0 - p, a * y0 + q], LID + '-p-sign', 'Moving right adds to the ' + t('x') + '-coordinate; moving left subtracts.'], [[x0 + p, cl(a * (y0 + q))], LID + '-order', 'Stretch first, then translate: ' + t('(x,\\ y)\\to(x+p,\\ ay+q)') + '.'], [[cl(a * x0 + p), a * y0 + q], LID + '-pt-x', 'A vertical stretch changes only the ' + t('y') + '-coordinate.']];
    if (a < 0) c.push([[x0 + p, -a * y0 + q], LID + '-reflect', 'A reflection in the ' + t('x') + '-axis changes the sign of the ' + t('y') + '-value.']);
    if (!same(Math.abs(a), 1)) c.push([[x0 + p, cl(y0 / a + q)], LID + '-recip', 'A stretch by a factor of ' + t('s') + ' <b>multiplies</b> the ' + t('y') + '-value by ' + t('s') + '.']);
    return c.filter(function (w) { return !(same(w[0][0], x0 + p) && same(w[0][1], a * y0 + q)); });
  }
  function ptSol(x0, a, p, q) { var y0 = x0 * x0; return t('(' + x0 + ',\\ ' + y0 + ')\\to(' + x0 + sT(p) + ',\\ ' + (same(a, 1) ? y0 : (same(a, -1) ? '-' : vT(a)) + (same(Math.abs(a), 1) ? y0 : '(' + y0 + ')')) + sT(q) + ')=' + ptTex(x0 + p, cl(a * y0 + q))); }
  /* choose the graph of a sketch */
  function sketchMC(r, a, p, q, text) {
    var Z = z(), f = Z.parabola, o = [{ f: f(a, p, q), right: true }];
    if (!same(p, 0)) o.push({ f: f(a, -p, q), why: 'Check the vertex: ' + t('(x' + sT(-p) + ')^{2}') + ' gives ' + t('p=' + vT(p)) + '.', code: LID + '-p-sign' });
    o.push(same(Math.abs(a), 1) ? { f: f(a * 3, p, q), why: 'Check the shape: with ' + t('a=' + vT(a)) + ' the steps from the vertex are ' + t('1,\\ 3,\\ 5') + '.', code: LID + '-step' } : { f: f(Math.sign(a), p, q), why: 'Multiply the step pattern ' + t('1,\\ 3,\\ 5') + ' by ' + t('a=' + vT(a)) + '.', code: LID + '-step' });
    o.push({ f: f(-a, p, q), why: 'Check the direction: ' + t('a=' + vT(a)) + (a > 0 ? ' is positive, so it opens up.' : ' is negative, so it opens down.'), code: LID + '-g-dir' });
    if (o.length < 4 && !same(q, 0)) o.push({ f: f(a, p, -q), why: 'Check the vertex’s ' + t('y') + '-coordinate, ' + t('q') + '.', code: LID + '-q-sign' });
    var W0 = Z.win([[p, q], [-p, q], [p, q + 5], [p, q - 5]], 3, 1);
    var st = stepPts(a, p, q);
    return Z.graphMC(r, 'Which is the graph of ' + eqT(a, p, q) + '? (Sketch it first from the vertex and the step pattern.)', o.slice(0, 4), W0,
      'Vertex ' + t(ptTex(p, q)) + '; ' + st.words + ': ' + st.pts.map(function (P) { return t(ptTex(P[0], P[1])); }).join(', ') + '. It opens ' + (a > 0 ? 'up' : 'down') + '.', HS, text);
  }
  function stepPts(a, p, q) {
    var s = Math.abs(a), pts = [], words;
    if (s < 1) { var d1 = 2, d2 = 4; [d1, d2].forEach(function (dd) { pts.push([p - dd, cl(q + a * dd * dd)], [p + dd, cl(q + a * dd * dd)]); }); words = t(d1) + ' across: ' + (a > 0 ? 'up ' : 'down ') + t(vT(s * 4)) + '; ' + t(d2) + ' across: ' + (a > 0 ? 'up ' : 'down ') + t(vT(s * 16)); }
    else { [1, 2].forEach(function (dd) { pts.push([p - dd, cl(q + a * dd * dd)], [p + dd, cl(q + a * dd * dd)]); }); words = 'steps ' + (a > 0 ? 'up ' : 'down ') + t(vT(s)) + ', ' + t(vT(3 * s)); }
    return { pts: pts, words: words };
  }

  var QUESTIONS = [
    { num: '1', stem: 'Describe how the graph of each function is related to the graph of ' + t('y=x^{2}') + '.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1, p: nz(r, -9, 9), q: 0 }; }); return descMC(r, eqT(1, o.p, 0), 1, o.p, 0, null, null, null, 'describe: horizontal translation'); } },
      { id: '1b', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1, p: 0, q: nz(r, -12, 12) }; }); return descMC(r, eqT(1, 0, o.q), 1, 0, o.q, null, null, null, 'describe: vertical translation'); } },
      { id: '1c', level: 'EMG', make: function (r) {
        var o = pick3(r, function () { return { a: 1, p: 0, q: nz(r, -9, 9) }; }), k = -o.q;
        return descMC(r, t('y' + sT(k) + '=x^{2}'), 1, 0, o.q, [{ a: 1, p: 0, q: k, why: 'Solve for ' + t('y') + ' first: ' + t('y=x^{2}' + sT(o.q)) + '.', code: LID + '-solve-y' }], 'Solve for ' + t('y') + ': ' + eqT(1, 0, o.q) + '. ' + desc(1, 0, o.q) + '.', null, 'describe: y + k = x²');
      } },
      { id: '1d', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1, p: nz(r, -8, 8), q: nz(r, -9, 9) }; }); return descMC(r, eqT(1, o.p, o.q), 1, o.p, o.q, null, null, null, 'describe: both translations'); } },
      { id: '1e', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { p: nz(r, -8, 8), c: nz(r, -6, 6), d: nz(r, -6, 6) }; }, function (z0) { return z0.c + z0.d !== 0 && AV(1, z0.p, z0.c + z0.d); }), q = o.c + o.d;
        return descMC(r, t('y' + sT(-o.c) + '=' + vf(1, o.p, o.d)), 1, o.p, q, [{ a: 1, p: o.p, q: o.d, why: 'Solve for ' + t('y') + ' first: move the ' + t(sT(-o.c)) + ' to the right side.', code: LID + '-solve-y' }, { a: 1, p: o.p, q: o.d - o.c, why: 'Moving ' + t(sT(-o.c)) + ' across changes its sign.', code: LID + '-solve-y' }],
          'Solve for ' + t('y') + ': ' + eqT(1, o.p, q) + '. ' + desc(1, o.p, q) + '.', null, 'describe: y − c = (x − p)² + d');
      } },
      { id: '1f', level: 'EMG', make: function (r) {
        var L = r.pick([['m', 'n'], ['h', 'k'], ['c', 'd'], ['s', 't']]), sh = r.pick([[1, 1], [1, -1], [-1, 1], [-1, -1]]), A = L[0], Bv = L[1];
        var eq = t('y=(x' + (sh[0] > 0 ? '+' : '-') + A + ')^{2}' + (sh[1] > 0 ? '+' : '-') + Bv) + ', where ' + t(A + ',\\ ' + Bv + '>0');
        function d0(hs, vs) { return 'Translation ' + t(A) + ' units ' + (hs > 0 ? 'left' : 'right') + ' and ' + t(Bv) + ' units ' + (vs > 0 ? 'up' : 'down'); }
        var opts = [{ html: d0(sh[0], sh[1]), right: true }, { html: d0(-sh[0], sh[1]), why: t('(x+' + A + ')^{2}=(x-(-' + A + '))^{2}') + ': a plus sign inside the bracket moves the graph <b>left</b>.', code: LID + '-p-sign' },
          { html: d0(sh[0], -sh[1]), why: 'A term added at the end moves the graph up; subtracted moves it down.', code: LID + '-q-sign' }, { html: 'Translation ' + t(Bv) + ' units ' + (sh[0] > 0 ? 'left' : 'right') + ' and ' + t(A) + ' units ' + (sh[1] > 0 ? 'up' : 'down'), why: 'The letter inside the bracket gives the horizontal translation.', code: LID + '-swap' }];
        return X.mc(r, eq, opts, 'Here ' + t('p=' + (sh[0] > 0 ? '-' : '') + A) + ' and ' + t('q=' + (sh[1] > 0 ? '' : '-') + Bv) + ': ' + d0(sh[0], sh[1]).toLowerCase().replace(/^translation/, 'a translation of') + '.', HD, 'describe: letters');
      } }] },

    { num: '2', stem: 'Write the equation of the image of ' + t('y=x^{2}') + ' after each translation.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1, p: nz(r, -9, 9), q: 0 }; }); return vfPart(trW(o.p, 0).replace(/^a translation of /, ''), 1, o.p, 0, { sol: eqT(1, o.p, 0), text: 'image after a horizontal translation' }); } },
      { id: '2b', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1, p: 0, q: nz(r, -12, 12) }; }); return vfPart(trW(0, o.q).replace(/^a translation of /, ''), 1, 0, o.q, { sol: eqT(1, 0, o.q), text: 'image after a vertical translation' }); } },
      { id: '2c', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1, p: nz(r, -8, 8), q: nz(r, -9, 9) }; }); return vfPart(trW(o.p, o.q).replace(/^a translation of /, ''), 1, o.p, o.q, { sol: t('p=' + o.p) + ', ' + t('q=' + o.q) + ': ' + eqT(1, o.p, o.q), text: 'image after both translations' }); } },
      { id: '2d', level: 'EMG', make: function (r) {
        var L = r.pick([['h', 'k'], ['m', 'n'], ['c', 'd']]), sh = r.pick([[-1, -1], [-1, 1], [1, -1]]), A = L[0], Bv = L[1];
        var fn = function (e) { return Math.pow(e.x - sh[0] * e[A], 2) + sh[1] * e[Bv]; };
        var key = '(x' + (sh[0] > 0 ? '-' : '+') + A + ')^{2}' + (sh[1] > 0 ? '+' : '-') + Bv;
        var cands = [[function (e) { return Math.pow(e.x + sh[0] * e[A], 2) + sh[1] * e[Bv]; }, LID + '-p-sign', 'Moving ' + (sh[0] > 0 ? 'right' : 'left') + ' ' + t(A) + ' units gives ' + t('(x' + (sh[0] > 0 ? '-' : '+') + A + ')^{2}') + '.'], [function (e) { return Math.pow(e.x - sh[0] * e[A], 2) - sh[1] * e[Bv]; }, LID + '-q-sign', 'Moving ' + (sh[1] > 0 ? 'up' : 'down') + ' ' + t(Bv) + ' units ' + (sh[1] > 0 ? 'adds' : 'subtracts') + ' ' + t(Bv) + '.'], [function (e) { return Math.pow(e.x - sh[1] * e[Bv], 2) + sh[0] * e[A]; }, LID + '-swap', 'The horizontal translation goes inside the bracket.']];
        return { prompt: t(A) + ' units ' + (sh[0] > 0 ? 'right' : 'left') + ' and ' + t(Bv) + ' units ' + (sh[1] > 0 ? 'up' : 'down'), input: { type: 'math', keys: 'p51', vars: ['x', A, Bv], before: t('y='), placeholder: 'e.g. y = (x + h)^2 - k' }, check: X.symChk(fn, ['x', 'y', A, Bv], { vertex: true, cands: cands }), key: key, answer: t('y=' + key),
          solution: t('p=' + (sh[0] > 0 ? '' : '-') + A) + ', ' + t('q=' + (sh[1] > 0 ? '' : '-') + Bv) + ': ' + t('y=' + key), hints: HE, text: 'image after a translation in letters', bad: ['(x' + (sh[0] > 0 ? '+' : '-') + A + ')^{2}' + (sh[1] > 0 ? '+' : '-') + Bv] };
      } }] },

    { num: '3', shared: function (r) { var x0 = r.pick([-4, -2, -1, 1, 2, 4, 5, -5]); return { x0: x0 }; },
      stem: function (o) { return 'The point ' + t(ptTex(o.x0, o.x0 * o.x0)) + ' is on the graph of ' + t('y=x^{2}') + '. Find its image after each translation.'; },
      parts: [
        { id: '3a', level: 'BEG', make: function (r, o) { var p = nz(r, -8, 8), y0 = o.x0 * o.x0; return z().fields(trW(p, 0).replace(/^a translation of /, ''), [{ label: 'Image', pt: [o.x0 + p, y0], cands: ptCands(o.x0, 1, p, 0).concat([[[o.x0, y0 + p], LID + '-swap', 'Left and right change the ' + t('x') + '-coordinate.']]) }], { sol: ptSol(o.x0, 1, p, 0), hints: HP, text: 'image of a point: horizontal translation' }); } },
        { id: '3b', level: 'BEG', make: function (r, o) { var p = nz(r, -8, 8), q = nz(r, -12, 12), y0 = o.x0 * o.x0; return z().fields(trW(p, q).replace(/^a translation of /, ''), [{ label: 'Image', pt: [o.x0 + p, y0 + q], cands: ptCands(o.x0, 1, p, q).concat([[[o.x0 + q, y0 + p], LID + '-swap', 'Left/right changes ' + t('x') + '; up/down changes ' + t('y') + '.'], [[o.x0 + p, y0 - q], LID + '-q-sign', 'Up adds to ' + t('y') + '; down subtracts.']]) }], { sol: ptSol(o.x0, 1, p, q), hints: HP, text: 'image of a point: both translations' }); } }] },

    { num: '4', stem: 'Complete the table: state the vertex, the maximum or minimum value, the axis of symmetry, the domain and the range.', parts: [
      { id: '4a', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1, p: 0, q: nz(r, -12, 12) }; }); return tableRow(eqT(1, 0, o.q), 1, 0, o.q, '', 'table: y = x² + q'); } },
      { id: '4b', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1, p: nz(r, -9, 9), q: 0 }; }); return tableRow(eqT(1, o.p, 0), 1, o.p, 0, '', 'table: y = (x − p)²'); } },
      { id: '4c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { p: nz(r, -8, 8), c: nz(r, -6, 6), d: nz(r, -6, 6) }; }, function (z0) { return z0.d - z0.c !== 0 && AV(1, z0.p, z0.d - z0.c); }), q = o.d - o.c;
        return tableRow(t('y' + sT(o.c) + '=' + vf(1, o.p, o.d)), 1, o.p, q, 'Solve for ' + t('y') + ' first: ' + eqT(1, o.p, q) + '.<br>', 'table: y + c = (x − p)² + d', [[[o.p, o.d], LID + '-solve-y', 'Solve for ' + t('y') + ' first: move ' + t(sT(o.c)) + ' to the right side.']]);
      } },
      { id: '4d', level: 'PRG', make: function (r) {
        var L = r.pick([['h', 'k'], ['m', 'n'], ['c', 'd']]), A = L[0], Bv = L[1], E1 = {}, E2 = {}; E1[A] = 4; E1[Bv] = 7; E2[A] = 2; E2[Bv] = 9;
        var Z = z(), envs = [E1, E2], vchk = X.subWrap(function (e) { return Z.ptChk(e[A], e[Bv], { cands: [[[e[Bv], e[A]], 'u5l1-swap', 'Write the ' + t('x') + '-coordinate first: ' + t('(' + A + ',\\ ' + Bv + ')') + '.'], [[-e[A], e[Bv]], LID + '-p-sign', t('(x-' + A + ')^{2}') + ' gives ' + t('p=' + A) + '.']] }); }, envs);
        var achk = X.subWrap(function (e) { return Z.axisChk(e[A], { q: e[Bv] }); }, envs), valchk = X.subWrap(function (e) { return Z.numChk(e[Bv], { cands: [[e[A], 'u5l3-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex.']] }); }, envs);
        var rchk = X.subWrap(function (e) { return Z.rangeChk(e[Bv], true, { p: e[A] }); }, envs);
        var R = '\\{y\\mid y\\ge ' + Bv + ',\\ y\\in\\mathbb{R}\\}';
        return X.fields(t('y=(x-' + A + ')^{2}+' + Bv), [{ label: 'Vertex', check: vchk, key: '(' + A + ',' + Bv + ')', ansTex: '(' + A + ',\\ ' + Bv + ')', math: true, placeholder: 'e.g. (h, k)' }, { label: 'Max or min?', mm: 'min' },
          { label: 'Value', check: valchk, key: Bv, ansTex: Bv, math: true }, { label: 'Axis of symmetry', check: achk, key: 'x=' + A, ansTex: 'x=' + A, math: true }, { label: 'Domain', dom: true }, { label: 'Range', check: rchk, key: R, ansTex: R, math: true }],
          { vars: ['x', 'y', A, Bv], sol: 'It is ' + t('y=x^{2}') + ' translated ' + t(A) + ' units horizontally and ' + t(Bv) + ' units vertically: vertex ' + t('(' + A + ',\\ ' + Bv + ')') + ', minimum value ' + t(Bv) + ' (it opens up), axis ' + t('x=' + A) + ', domain ' + t(Z.DOM) + ', range ' + t(R) + '.', hints: ['In ' + t('y=(x-p)^{2}+q') + ' the vertex is ' + t('(p,\\ q)') + '. Here ' + t('p=' + A) + ' and ' + t('q=' + Bv) + '.'], text: 'table: letters' });
      } }] },

    { num: '5', shared: function (r) { return pick3(r, function () { return { a: 1, p: nz(r, -5, 5), q: nz(r, -6, 5) }; }); },
      stem: function (o) { return 'Sketch ' + eqT(1, o.p, o.q) + ' by hand.'; },
      parts: [
        { id: '5a', level: 'EMG', make: function (r, o) { return sketchMC(r, 1, o.p, o.q, 'sketch a translation: choose the graph'); } },
        { id: '5b', level: 'BEG', make: function (r, o) {
          var Z = z();
          return Z.fields('State the vertex, the minimum value, the domain and the range.', [{ label: 'Vertex', pt: [o.p, o.q], cands: [[[-o.p, o.q], LID + '-p-sign', t('(x' + sT(-o.p) + ')^{2}') + ' gives ' + t('p=' + o.p) + '.'], [[o.p, -o.q], LID + '-q-sign', 'Check the sign of ' + t('q') + '.']] }, { label: 'Minimum value', ans: o.q, cands: [[o.p, 'u5l3-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex.']] }, { label: 'Domain', dom: true, opt: { range: Z.rangeTex(o.q, true) } }, { label: 'Range', range: [o.q, true], opt: { p: o.p } }],
            { sol: 'Translate ' + t('y=x^{2}') + ' ' + listW([hWord(o.p), vWord(o.q)]) + '. Vertex ' + t(ptTex(o.p, o.q)) + '; minimum value ' + t(o.q) + '; domain ' + t(Z.DOM) + '; range ' + t(Z.rangeTex(o.q, true)) + '.', hints: ['The vertex is ' + t('(p,\\ q)') + '; it opens up, so the range starts at ' + t('q') + ' and goes up.'], text: 'translation: vertex, min, domain, range' });
        } }] },

    { num: '6', parts: [
      { id: '6', level: 'BEG', make: function (r) {
        var o = pick3(r, function () { return { a: 1, p: nz(r, -9, 9), q: nz(r, -9, 9) }; });
        return X.fields('After a horizontal and a vertical translation, the image of ' + t('y=x^{2}') + ' has its vertex at ' + t(ptTex(o.p, o.q)) + '. Describe the translations and write the equation of the image.', [shiftSpec('Horizontal translation', o.p, true), shiftSpec('Vertical translation', o.q, false), vfSpec('Equation', 1, o.p, o.q)],
          { sol: 'The vertex moved from ' + t('(0,\\ 0)') + ' to ' + t(ptTex(o.p, o.q)) + ': ' + hWord(o.p) + ' and ' + vWord(o.q) + '.<br>' + eqT(1, o.p, o.q), hints: ['The vertex of ' + t('y=x^{2}') + ' is ' + t('(0,\\ 0)') + '. How far did it move, and which way?'], text: 'translations from the vertex' });
      } }] },

    { num: '7', stem: 'Describe how the graph of each function is related to the graph of ' + t('y=x^{2}') + '.', parts: [
      { id: '7a', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: r.int(2, 9), p: 0, q: 0 }; }); return descMC(r, eqT(o.a, 0, 0), o.a, 0, 0, [{ html: 'Translation ' + units(o.a, 'up'), why: 'Multiplying by ' + t(o.a) + ' stretches the graph; it doesn’t move it up.', code: LID + '-swap' }], null, null, 'describe: y = ax²'); } },
      { id: '7b', level: 'EMG', make: function (r) { var o = pickWhere(function () { var dd = r.int(2, 6), k = r.int(1, dd - 1); return { a: -k / dd, p: 0, q: 0, ok: gcd(k, dd) === 1 }; }, function (z0) { return z0.ok && AV(z0.a, 0, 0); }); return descMC(r, eqT(o.a, 0, 0), o.a, 0, 0, null, null, null, 'describe: y = −(1/n)x²'); } },
      { id: '7c', level: 'PRG', make: function (r) { var o = pick3(r, function () { return { a: -r.int(2, 6), p: nz(r, -8, 8), q: nz(r, -9, 9) }; }); return descMC(r, eqT(o.a, o.p, o.q), o.a, o.p, o.q, null, null, null, 'describe: stretch, reflection, translation'); } },
      { id: '7d', level: 'PRG', make: function (r) { var o = pick3(r, function () { var dd = r.pick([3, 4, 5]); return { a: r.int(1, dd - 1) / dd, p: nz(r, -8, 8), q: nz(r, -9, 9) }; }); return descMC(r, eqT(o.a, o.p, o.q), o.a, o.p, o.q, null, null, null, 'describe: a fraction stretch and translation'); } },
      { id: '7e', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var k = r.pick([2, 3, 4, 5]); return { k: k, p: nz(r, -7, 7), m: nz(r, -4, 4) }; }, function (z0) { return AV(1 / z0.k, z0.p, z0.m); }), a = 1 / o.k, q = o.m, C = o.k * o.m;
        return descMC(r, t(o.k + 'y=' + vf(1, o.p, C)), a, o.p, q, [{ a: 1, p: o.p, q: C, why: 'Solve for ' + t('y') + ' first: divide <b>every</b> term by ' + t(o.k) + '.', code: LID + '-solve-y' }, { a: a, p: o.p, q: C, why: 'Divide the constant by ' + t(o.k) + ' too.', code: LID + '-solve-y' }, { a: o.k, p: o.p, q: C, why: 'Divide by ' + t(o.k) + ' (don’t multiply): ' + eqT(a, o.p, q) + '.', code: LID + '-solve-y' }],
          'Divide by ' + t(o.k) + ': ' + eqT(a, o.p, q) + '. ' + desc(a, o.p, q) + '.', null, 'describe: ky = (x − p)² + c');
      } },
      { id: '7f', level: 'PRG', make: function (r) {
        var o = pick3(r, function () { return { a: -1, p: nz(r, -8, 8), q: 0 }; });
        return descMC(r, t('-y=' + vf(1, o.p, 0)), -1, o.p, 0, [{ a: 1, p: o.p, q: 0, why: 'Solve for ' + t('y') + ': multiply both sides by ' + t('-1') + ', so ' + eqT(-1, o.p, 0) + '.', code: LID + '-solve-y' }, { a: 1, p: -o.p, q: 0, why: 'Solve for ' + t('y') + ' first, and check the direction of the translation.', code: LID + '-solve-y' }],
          'Multiply by ' + t('-1') + ': ' + eqT(-1, o.p, 0) + '. ' + desc(-1, o.p, 0) + '.', null, 'describe: −y = (x − p)²');
      } }] },

    { num: '8', stem: 'The transformations are applied to ' + t('y=x^{2}') + ' in the order given. Write the equation of each image.', parts: [
      { id: '8a', level: 'BEG', make: function (r) { var s = r.int(2, 9); if (s === 3) s = 4; return vfPart(stW(s) + ' and ' + RFW, -s, 0, 0, { sol: 'Stretch: ' + t('y=' + s + 'x^{2}') + '; reflect: ' + t('y=-' + s + 'x^{2}'), text: 'image: stretch and reflection' }); } },
      { id: '8b', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1 / r.pick([2, 3, 4, 5]), p: 0, q: nz(r, -9, 9) }; }); return vfPart(stW(o.a) + ' and ' + trW(0, o.q), o.a, 0, o.q, { sol: t('a=' + rT(o.a)) + ', ' + t('q=' + o.q) + ': ' + eqT(o.a, 0, o.q), text: 'image: fraction stretch and vertical translation' }); } },
      { id: '8c', level: 'PRG', make: function (r) { var o = pick3(r, function () { return { a: -r.int(2, 7), p: nz(r, -8, 8), q: nz(r, -9, 9) }; }); return vfPart(listW([RFW, stW(-o.a), trW(o.p, o.q)]), o.a, o.p, o.q, { sol: t('a=' + o.a) + ', ' + t('p=' + o.p) + ', ' + t('q=' + o.q) + ': ' + eqT(o.a, o.p, o.q), text: 'image: reflection, stretch, translation' }); } },
      { id: '8d', level: 'PRG', make: function (r) { var o = pick3(r, function () { var dd = r.pick([3, 4, 5]); return { a: r.int(2, dd - 1) / dd, p: nz(r, -8, 8), q: nz(r, -9, 9) }; }); return vfPart(stW(o.a) + ' and ' + trW(o.p, o.q), o.a, o.p, o.q, { sol: t('a=' + rT(o.a)) + ', ' + t('p=' + o.p) + ', ' + t('q=' + o.q) + ': ' + eqT(o.a, o.p, o.q), text: 'image: fraction stretch and translation' }); } },
      { id: '8e', level: 'MAS', make: function (r) {
        var L = r.pick([['c', 'd', 'e'], ['a', 'h', 'k'], ['s', 'm', 'n']]), sh = r.pick([[-1, 1], [1, -1], [-1, -1], [1, 1]]), S = L[0], H = L[1], V = L[2];
        var fn = function (e) { return -e[S] * Math.pow(e.x - sh[0] * e[H], 2) + sh[1] * e[V]; }, key = '-' + S + '(x' + (sh[0] > 0 ? '-' : '+') + H + ')^{2}' + (sh[1] > 0 ? '+' : '-') + V;
        var cands = [[function (e) { return -e[S] * Math.pow(e.x + sh[0] * e[H], 2) + sh[1] * e[V]; }, LID + '-p-sign', 'Moving ' + (sh[0] > 0 ? 'right' : 'left') + ' gives ' + t('(x' + (sh[0] > 0 ? '-' : '+') + H + ')^{2}') + '.'], [function (e) { return e[S] * Math.pow(e.x - sh[0] * e[H], 2) + sh[1] * e[V]; }, LID + '-reflect', 'The reflection in the ' + t('x') + '-axis makes the coefficient negative: ' + t('-' + S) + '.'],
          [function (e) { return -e[S] * (Math.pow(e.x - sh[0] * e[H], 2) + sh[1] * e[V]); }, LID + '-order', 'The translation comes <b>after</b> the stretch and reflection, so ' + t(V) + ' is not multiplied by ' + t('-' + S) + '.'], [function (e) { return -e[S] * Math.pow(e.x - sh[0] * e[H], 2) - sh[1] * e[V]; }, LID + '-q-sign', 'Check the sign of the vertical translation.']];
        var order = r.pick([0, 1]);
        var words = (order ? [RFW, 'a vertical stretch by a factor of ' + t(S) + ' (' + t(S + '>0') + ')'] : ['a vertical stretch by a factor of ' + t(S) + ' (' + t(S + '>0') + ')', RFW]).concat(['a translation of ' + t(H) + ' units ' + (sh[0] > 0 ? 'right' : 'left') + ' and ' + t(V) + ' units ' + (sh[1] > 0 ? 'up' : 'down')]);
        return { prompt: listW(words), input: { type: 'math', keys: 'p51', vars: ['x', S, H, V], before: t('y='), placeholder: 'e.g. y = -c(x + d)^2 + e' }, check: X.symChk(fn, ['x', 'y', S, H, V], { vertex: true, cands: cands }), key: key, answer: t('y=' + key),
          solution: t('a=-' + S) + ' (stretch and reflection), ' + t('p=' + (sh[0] > 0 ? '' : '-') + H) + ', ' + t('q=' + (sh[1] > 0 ? '' : '-') + V) + ': ' + t('y=' + key), hints: HE, text: 'image: all three transformations in letters', bad: ['-' + S + '(x' + (sh[0] > 0 ? '+' : '-') + H + ')^{2}' + (sh[1] > 0 ? '+' : '-') + V, S + '(x' + (sh[0] > 0 ? '-' : '+') + H + ')^{2}' + (sh[1] > 0 ? '+' : '-') + V] };
      } }] },

    { num: '9', shared: function (r) { return { x0: r.pick([-4, -2, 2, 4]) }; },
      stem: function (o) { return 'The point ' + t(ptTex(o.x0, o.x0 * o.x0)) + ' is on ' + t('y=x^{2}') + '. Find its image after each set of transformations.'; },
      parts: [
        { id: '9a', level: 'EMG', make: function (r, o) { var q = nz(r, -9, 9), y0 = o.x0 * o.x0; return z().fields(RFW + ', then ' + trW(0, q), [{ label: 'Image', pt: [o.x0, -y0 + q], cands: ptCands(o.x0, -1, 0, q).concat([[[-o.x0, y0 + q], LID + '-reflect', 'A reflection in the <b>' + t('x') + '-axis</b> changes the sign of the ' + t('y') + '-coordinate, not the ' + t('x') + '-coordinate.']]) }], { sol: t(ptTex(o.x0, y0) + '\\to' + ptTex(o.x0, -y0) + '\\to' + ptTex(o.x0, -y0 + q)), hints: HP, text: 'image of a point: reflection and translation' }); } },
        { id: '9b', level: 'EMG', make: function (r, o) { var a = r.pick([0.25, 0.5, 1.5, 3, 0.75]), y0 = o.x0 * o.x0; return z().fields(stW(a), [{ label: 'Image', pt: [o.x0, cl(a * y0)], cands: ptCands(o.x0, a, 0, 0) }], { sol: t(ptTex(o.x0, y0) + '\\to(' + o.x0 + ',\\ ' + rT(a) + '\\times ' + y0 + ')=' + ptTex(o.x0, cl(a * y0))), hints: HP, text: 'image of a point: stretch' }); } },
        { id: '9c', level: 'PRG', make: function (r, o) { var a = r.int(2, 4), p = nz(r, -6, 6), q = nz(r, -9, 9), y0 = o.x0 * o.x0; return z().fields(stW(a) + ', then ' + trW(p, q), [{ label: 'Image', pt: [o.x0 + p, a * y0 + q], cands: ptCands(o.x0, a, p, q) }], { sol: t(ptTex(o.x0, y0) + '\\to' + ptTex(o.x0, a * y0) + '\\to' + ptTex(o.x0 + p, a * y0 + q)), hints: HP, text: 'image of a point: stretch, then translation' }); } }] },

    { num: '10', shared: function (r) { return pickWhere(function () { return { s: r.int(2, 5), p: nz(r, -6, 6), q: nz(r, -9, 9), x1: nz(r, -6, 6) }; }, function (o) { return o.x1 !== o.p && Math.abs(o.x1 - o.p) <= 3 && AV(-o.s, o.p, o.q) && !(o.s === 2 && o.p === 4 && o.q === 3); }); },
      stem: function (o) { return 'These transformations are applied to ' + t('y=x^{2}') + ' in order: ' + listW([RFW, stW(o.s), trW(o.p, o.q)]) + '.'; },
      parts: [
        { id: '10a', level: 'PRG', make: function (r, o) {
          return z().fields('Write the equation of the image after each transformation.', [vfSpec('After the reflection', -1, 0, 0), vfSpec('After the stretch', -o.s, 0, 0, { cands: [{ a: o.s, p: 0, q: 0, code: LID + '-reflect', hint: 'Keep the reflection: the stretch multiplies ' + t('-x^{2}') + ' by ' + t(o.s) + '.' }] }), vfSpec('After the translation', -o.s, o.p, o.q)],
            { sol: t('y=-x^{2}') + ', then ' + t('y=-' + o.s + 'x^{2}') + ', then ' + eqT(-o.s, o.p, o.q) + '.', hints: HE, text: 'image after each step' });
        } },
        { id: '10b', level: 'PRG', make: function (r, o) {
          var k = -o.s * (o.x1 - o.p) * (o.x1 - o.p) + o.q;
          return X.num('The point ' + t('(' + o.x1 + ',\\ k)') + ' is on the final graph. Determine ' + t('k') + '.', k, { before: t('k='), cands: [[o.s * (o.x1 - o.p) * (o.x1 - o.p) + o.q, LID + '-reflect', 'Keep the reflection: ' + t('a=-' + o.s) + '.'], [-o.s * (o.x1 + o.p) * (o.x1 + o.p) + o.q, LID + '-p-sign', 'Check the bracket: ' + t('(x' + sT(-o.p) + ')') + '.'], [-o.s * ((o.x1 - o.p) * (o.x1 - o.p) + o.q), LID + '-order', 'Square, multiply by ' + t('-' + o.s) + ', <b>then</b> add ' + t(o.q) + '.']],
            sol: t('k=-' + o.s + '(' + o.x1 + sT(-o.p) + ')^{2}' + sT(o.q) + '=-' + o.s + '(' + (o.x1 - o.p) * (o.x1 - o.p) + ')' + sT(o.q) + '=' + k), hints: ['Substitute ' + t('x=' + o.x1) + ' into the final equation.'], text: 'a value on the final graph' });
        } }] },

    { num: '11', stem: 'Sketch each graph using its vertex and the step pattern.', parts: [
      { id: '11a', level: 'EMG', make: function (r) { var o = pick3(r, function () { return { a: r.int(2, 3), p: nz(r, -4, 4), q: nz(r, -6, 4) }; }); return sketchMC(r, o.a, o.p, o.q, 'sketch: a > 1 with the step pattern'); } },
      { id: '11b', level: 'EMG', make: function (r) { var o = pick3(r, function () { return { a: -1, p: nz(r, -5, 5), q: nz(r, -4, 6) }; }); return sketchMC(r, -1, o.p, o.q, 'sketch: a = −1'); } },
      { id: '11c', level: 'PRG', make: function (r) { var o = pick3(r, function () { return { a: sgn(r) * r.pick([0.25, 0.5]), p: nz(r, -5, 5), q: nz(r, -5, 5) }; }); return sketchMC(r, o.a, o.p, o.q, 'sketch: a fraction with the step pattern'); } }] },

    { num: '12', shared: function (r) { return pickWhere(function () { return { a: r.int(2, 5), p: nz(r, -6, 6), q: nz(r, -6, 6), who: r.pick(['Sam', 'Priya', 'Jordan', 'Mei']) }; }, function (o) { return !(o.a === 3 && o.p === 1 && o.q === 2) && AV(o.a, o.p, o.q); }); },
      stem: function (o) { return o.who + ' graphs ' + eqT(o.a, o.p, o.q) + ' by translating ' + t('y=x^{2}') + ' ' + listW([hWord(o.p), vWord(o.q)]) + ', and then stretching vertically by a factor of ' + t(o.a) + ' about the ' + t('x') + '-axis.'; },
      parts: [
        { id: '12a', level: 'ADV', make: function (r, o) {
          return z().fields('What vertex does ' + o.who + ' get, and what is the correct vertex?', [{ label: o.who + '’s vertex', pt: [o.p, o.a * o.q], cands: [[[o.p, o.q], LID + '-order', 'Follow ' + o.who + '’s steps: after the translation, the stretch multiplies the ' + t('y') + '-coordinate by ' + t(o.a) + '.'], [[o.a * o.p, o.a * o.q], LID + '-pt-x', 'A vertical stretch changes only ' + t('y') + '-coordinates.']] },
            { label: 'Correct vertex', pt: [o.p, o.q], cands: [[[o.p, o.a * o.q], LID + '-order', 'The stretch must be done <b>before</b> the translation, so the vertex is ' + t('(p,\\ q)') + '.'], [[-o.p, o.q], LID + '-p-sign', 'Check the sign of ' + t('p') + '.']] }],
            { sol: 'Translating first moves the vertex to ' + t(ptTex(o.p, o.q)) + '; the stretch then multiplies its ' + t('y') + '-coordinate by ' + t(o.a) + ': ' + t(ptTex(o.p, o.a * o.q)) + '.<br>The stretch must come before the translation, so the correct vertex is ' + t(ptTex(o.p, o.q)) + '.', hints: ['Follow the vertex ' + t('(0,\\ 0)') + ' through ' + o.who + '’s steps, then through the correct order (stretch first).'], text: 'error analysis: translated first' });
        } },
        { id: '12b', level: 'ADV', make: function (r, o) {
          var opts = [{ html: 'The stretch must come <b>before</b> the translation: stretching after translating also multiplies the vertical translation by ' + t(o.a) + '.', right: true },
            { html: 'The translation should be ' + listW([hWord(-o.p), vWord(-o.q)]) + '.', why: t('(x' + sT(-o.p) + ')^{2}' + sT(o.q)) + ' does mean ' + hWord(o.p) + ' and ' + vWord(o.q) + ': the translation is right.', code: LID + '-sam' },
            { html: 'The stretch factor should be ' + t('\\frac{1}{' + o.a + '}') + '.', why: 'The stretch factor is ' + t('a=' + o.a) + ': that part is right.', code: LID + '-sam' },
            { html: 'There is no error: a stretch about the ' + t('x') + '-axis doesn’t move the vertex.', why: 'A stretch about the ' + t('x') + '-axis moves every point that is not on the ' + t('x') + '-axis, including a vertex at ' + t(ptTex(o.p, o.q)) + '.', code: LID + '-sam' }];
          return X.mc(r, 'Explain the error.', opts, 'Order: stretch and reflect first, then translate. Stretching about the ' + t('x') + '-axis after the vertical translation also multiplies the ' + t(o.q) + ' by ' + t(o.a) + ', which moves the vertex to ' + t(ptTex(o.p, o.a * o.q)) + '.', ['Which transformation changes the vertex when it is not on the ' + t('x') + '-axis?'], 'error analysis: explanation');
        } }] },

    { num: '13', stem: 'Write the equation of the image of ' + t('y=x^{2}') + ' after a vertical stretch by the factor ' + t('a') + ' given (a negative ' + t('a') + ' includes a reflection) and a translation that moves the vertex to the point given.', parts: [
      { id: '13a', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: sgn(r) * r.int(2, 6), p: nz(r, -8, 8), q: nz(r, -9, 9) }; }); return vfPart(t('a=' + o.a) + ', vertex ' + t(ptTex(o.p, o.q)), o.a, o.p, o.q, { sol: t('p=' + o.p) + ', ' + t('q=' + o.q) + ': ' + eqT(o.a, o.p, o.q), text: 'equation from a and the vertex' }); } },
      { id: '13b', level: 'EMG', make: function (r) { var o = pick3(r, function () { var dd = r.pick([2, 3, 4, 5]); return { a: -r.int(1, dd - 1) / dd, p: nz(r, -8, 8), q: 0 }; }); return vfPart(t('a=' + rT(o.a)) + ', vertex ' + t(ptTex(o.p, 0)), o.a, o.p, 0, { sol: t('q=0') + ': ' + eqT(o.a, o.p, 0), text: 'equation: fraction a, vertex on the x-axis' }); } },
      { id: '13c', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: -r.int(2, 7), p: 0, q: nz(r, -9, 9) }; }); return vfPart(t('a=' + o.a) + ', vertex ' + t(ptTex(0, o.q)), o.a, 0, o.q, { sol: t('p=0') + ': ' + eqT(o.a, 0, o.q), text: 'equation: vertex on the y-axis' }); } }] },

    { num: '14', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var L = r.pick([['n', 'm'], ['b', 'a'], ['s', 'r'], ['h', 'k']]), N = L[0], M = L[1], sx = r.pick([-1, 1, -1]), sy = r.pick([1, -1, 1]);
        var vx = (sx < 0 ? '-' : '') + N, vy = (sy < 0 ? '-' : '') + M;
        function e(px, py, swap) { var A = swap ? M : N, Bv = swap ? N : M; return t('y=(x' + (px < 0 ? '+' : '-') + A + ')^{2}' + (py > 0 ? '+' : '-') + Bv); }
        var opts = [{ html: e(sx, sy), right: true }, { html: e(-sx, sy), why: 'The vertex has ' + t('x') + '-coordinate ' + t(vx) + ': ' + t('(x-(' + vx + '))^{2}') + '.', code: LID + '-p-sign' }, { html: e(sx, sy, true), why: 'Inside the bracket goes the ' + t('x') + '-coordinate, ' + t(N) + '.', code: LID + '-swap' }, { html: e(-sx, -sy, true), why: 'Use ' + t('p') + ' (the ' + t('x') + '-coordinate) in the bracket and ' + t('q') + ' at the end.', code: LID + '-swap' }];
        return X.mc(r, 'The graph of ' + t('y=x^{2}') + ' is translated so that its vertex is at ' + t('(' + vx + ',\\ ' + vy + ')') + ', where ' + t(M + '>0') + ' and ' + t(N + '>0') + '. The equation of the image is', opts, t('p=' + vx) + ' gives ' + t('(x-(' + vx + '))^{2}') + ' and ' + t('q=' + vy) + ': ' + e(sx, sy) + '.', HD, 'MC: equation from a vertex in letters');
      } }] },

    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { x0: r.pick([-3, -2, -1, 1, 2, 3]), a: r.pick([-2, -3, 2, 3, -4]), p: nz(r, -5, 5), q: nz(r, -8, 8) }; }, function (z0) { return !(z0.x0 === -1 && z0.a === -2 && z0.p === 3 && z0.q === 5) && AV(z0.a, z0.p, z0.q); });
        var y0 = o.x0 * o.x0, R0 = [o.x0 + o.p, o.a * y0 + o.q], C = ptCands(o.x0, o.a, o.p, o.q);
        var opts = [{ html: t(ptTex(R0[0], R0[1])), right: true }].concat(C.slice(0, 4).map(function (c) { return { html: t(ptTex(c[0][0], c[0][1])), why: c[2], code: c[1] }; }));
        return X.mc(r, 'The point ' + t(ptTex(o.x0, y0)) + ' is on ' + t('y=x^{2}') + '. Its image on the graph of ' + eqT(o.a, o.p, o.q) + ' is', opts.slice(0, 4), t('(x,\\ y)\\to(x+p,\\ ay+q)') + ': ' + ptSol(o.x0, o.a, o.p, o.q) + '.', HP, 'MC: image of a point');
      } }] },

    { num: '16', parts: [
      { id: '16', level: 'EMG', make: function (r) {
        var nar = r.chance(0.6), dn = r.chance(0.6), big = function () { return r.pick([2, 2.5, 3, 4, 1.5]); }, small = function () { return r.pick([0.4, 0.5, 0.25, 0.2, 0.8]); };
        function fn(aa) { return t('y=' + vf(aa, nz(r, -5, 5), r.chance(0.5) ? nz(r, -6, 6) : 0, false)); }
        var s1 = dn ? -1 : 1, right = (nar ? big() : small()) * s1;
        var opts = [{ html: fn(right), right: true }, { html: fn(-(nar ? big() : small()) * s1), why: 'Check the direction: ' + (dn ? 'opens down needs ' + t('a<0') : 'opens up needs ' + t('a>0')) + '.', code: LID + '-g-dir' },
          { html: fn((nar ? small() : big()) * s1), why: (nar ? 'Narrower needs ' + t('|a|>1') : 'Wider needs ' + t('0<|a|<1')) + '.', code: LID + '-width' }, { html: fn(s1), why: t('|a|=1') + ' gives the same width as ' + t('y=x^{2}') + '.', code: LID + '-width' }];
        return X.mc(r, 'Which graph is ' + (nar ? 'narrower' : 'wider') + ' than the graph of ' + t('y=x^{2}') + ' and opens ' + (dn ? 'down' : 'up') + '?', opts, 'It needs ' + (nar ? t('|a|>1') + ' (narrower)' : t('0<|a|<1') + ' (wider)') + ' and ' + (dn ? t('a<0') + ' (opens down)' : t('a>0') + ' (opens up)') + ': ' + t('a=' + vT(right)) + '. The translations don’t change the width or the direction.', ['Only ' + t('a') + ' matters: its size for the width, its sign for the direction.'], 'MC: width and direction');
      } }] },

    { num: '17', parts: [
      { id: '17', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { s: r.pick([0.5, 0.25, 1.5, 2.5, 0.2]), neg: r.chance(0.6), p: nz(r, -5, 5), q: r.int(2, 12), dx: r.pick([-3, -2, 2, 3, 1, -1]) }; }, function (z0) { var a = z0.neg ? -z0.s : z0.s, k = a * z0.dx * z0.dx + z0.q; return k > 0 && k < 100 && Math.abs(k * 10 - Math.round(k * 10)) < 1e-9 && !(z0.s === 0.5 && z0.neg && z0.p === 2 && z0.q === 9) && Math.abs(k - Math.round(k)) > 1e-9; });
        var a = o.neg ? -o.s : o.s, x1 = o.p + o.dx, k = cl(a * o.dx * o.dx + o.q);
        var words = o.neg ? [stW(o.s, true), RFW.replace(/^a /, ''), trW(o.p, o.q).replace(/^a /, '')] : [stW(o.s, true), trW(o.p, o.q).replace(/^a /, '')];
        return X.apx('The graph of ' + t('y=x^{2}') + ' is stretched vertically by a factor of ' + t(nT(o.s)) + ' about the ' + t('x') + '-axis, ' + (o.neg ? 'reflected in the ' + t('x') + '-axis, ' : '') + 'and translated ' + listW([hWord(o.p), vWord(o.q)]) + '. The point ' + t('(' + x1 + ',\\ k)') + ' is on the final graph. The value of ' + t('k') + ', to the nearest tenth, is ____.', k, 1,
          { nr: true, cands: [[cl(-a * o.dx * o.dx + o.q), LID + '-reflect', o.neg ? 'Include the reflection: ' + t('a=' + vT(a)) + '.' : 'There is no reflection here.'], [cl(a * (x1 + o.p) * (x1 + o.p) + o.q), LID + '-p-sign', 'Check the bracket: ' + t('(x' + sT(-o.p) + ')') + '.'], [cl(a * (o.dx * o.dx + o.q)), LID + '-order', 'Translate after stretching: ' + t('q') + ' is added at the end.']],
            sol: eqT(a, o.p, o.q, false) + '; ' + t('k=' + vT(a) + '(' + x1 + sT(-o.p) + ')^{2}' + sT(o.q) + '=' + vT(a) + '(' + o.dx * o.dx + ')' + sT(o.q) + '=' + nT(k)), hints: HE.concat(['Write the equation, then substitute ' + t('x=' + x1) + '.']), text: 'NR: a value on the image' });
      } }] },

    { num: '18', parts: [
      { id: '18', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { s: r.int(2, 6), neg: r.chance(0.6), p: nz(r, -6, 8), q: nz(r, -5, 12) }; }, function (z0) { var a = z0.neg ? -z0.s : z0.s, v = a + z0.p + z0.q; return v > 0 && v < 100 && !(z0.s === 3 && z0.neg && z0.p === 2 && z0.q === 7) && AV(a, z0.p, z0.q); });
        var a = o.neg ? -o.s : o.s, v = a + o.p + o.q;
        var pr = 'The graph of ' + t('y=a(x-p)^{2}+q') + ' is the image of ' + t('y=x^{2}') + ' after ' + listW([stW(o.s)].concat(o.neg ? [RFW] : []).concat([trW(o.p, o.q)])) + '. The value of ' + t('a+p+q') + ' is ____.';
        return X.num(pr, v, { nr: true, cands: [[-a + o.p + o.q, LID + '-reflect', o.neg ? 'The reflection makes ' + t('a') + ' negative.' : 'No reflection: ' + t('a>0') + '.'], [a - o.p + o.q, LID + '-p-sign', 'Right ' + t('p') + ' units means ' + t('p>0') + '; left means ' + t('p<0') + '.'], [a + o.p - o.q, LID + '-q-sign', 'Up means ' + t('q>0') + '; down means ' + t('q<0') + '.']],
          sol: t('a=' + a) + ', ' + t('p=' + o.p) + ', ' + t('q=' + o.q) + ': ' + t('a+p+q=' + a + sT(o.p) + sT(o.q) + '=' + v), hints: HE, text: 'NR: a + p + q' });
      } }] }
  ];

  /* one row of the features table (Q4) */
  function tableRow(prompt, a, p, q, pre, text, ptC) {
    var Z = z();
    return Z.fields(prompt, [{ label: 'Vertex', pt: [p, q], cands: [[[-p, q], LID + '-p-sign', t('(x' + sT(-p) + ')^{2}') + ' gives ' + t('p=' + p) + '.'], [[p, -q], LID + '-q-sign', 'Check the sign of ' + t('q') + '.']].concat(ptC || []) }, { label: 'Max or min?', mm: 'min' },
      { label: 'Value', ans: q, cands: [[p, 'u5l3-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex.']] }, { label: 'Axis of symmetry', axis: p, q: q }, { label: 'Domain', dom: true, opt: { range: Z.rangeTex(q, true) } }, { label: 'Range', range: [q, true], opt: { p: p } }],
      { sol: pre + 'Vertex ' + t(ptTex(p, q)) + '; it opens up, so minimum value ' + t(q) + '; axis ' + t('x=' + p) + '; domain ' + t(Z.DOM) + '; range ' + t(Z.rangeTex(q, true)) + '.', hints: ['In ' + t('y=(x-p)^{2}+q') + ': vertex ' + t('(p,\\ q)') + ', axis ' + t('x=p') + '; it opens up, so ' + t('q') + ' is the minimum and the range is ' + t('y\\ge q') + '.'], text: text });
  }

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Describe how the graph of each function is related to the graph of ' + t('y=x^{2}') + '.', parts: [
      { id: 'eA1a', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1, p: 0, q: nz(r, -15, 15) }; }); return descMC(r, eqT(1, 0, o.q), 1, 0, o.q, null, null, null, 'describe: vertical translation'); } },
      { id: 'eA1b', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1, p: nz(r, -12, 12), q: 0 }; }); return descMC(r, eqT(1, o.p, 0), 1, o.p, 0, null, null, null, 'describe: horizontal translation'); } },
      { id: 'eA1c', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1, p: nz(r, -8, 8), q: nz(r, -9, 9) }; }); return descMC(r, eqT(1, o.p, o.q), 1, o.p, o.q, null, null, null, 'describe: both translations'); } },
      { id: 'eA1d', level: 'EMG', make: function (r) { var o = pick3(r, function () { return { a: -r.int(2, 9), p: 0, q: 0 }; }); return descMC(r, eqT(o.a, 0, 0), o.a, 0, 0, null, null, null, 'describe: y = −kx²'); } },
      { id: 'eA1e', level: 'PRG', make: function (r) { var o = pick3(r, function () { return { a: r.pick([0.2, 0.4, 0.5, 0.6, 0.8, 1.5]), p: nz(r, -8, 8), q: nz(r, -9, 9) }; }); return descMC(r, t('y=' + vf(o.a, o.p, o.q, false)), o.a, o.p, o.q, null, null, null, 'describe: a decimal stretch and translation', { dec: true }); } },
      { id: 'eA1f', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: -r.int(2, 6), p: nz(r, -8, 8), c: nz(r, -9, 9) }; }, function (z0) { return AV(z0.a, z0.p, -z0.c); }), q = -o.c;
        return descMC(r, t('y' + sT(o.c) + '=' + vf(o.a, o.p, 0)), o.a, o.p, q, [{ a: o.a, p: o.p, q: o.c, why: 'Solve for ' + t('y') + ' first: move the ' + t(sT(o.c)) + ' to the right side (its sign changes).', code: LID + '-solve-y' }], 'Solve for ' + t('y') + ': ' + eqT(o.a, o.p, q) + '. ' + desc(o.a, o.p, q) + '.', null, 'describe: y + c = a(x − p)²');
      } }] },
    { num: 'A2', stem: 'Write the equation of the image of ' + t('y=x^{2}') + ' after the transformations, in the order given.', parts: [
      { id: 'eA2a', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1, p: nz(r, -12, 12), q: 0 }; }); return vfPart(trW(o.p, 0), 1, o.p, 0, { sol: eqT(1, o.p, 0), text: 'image: horizontal translation' }); } },
      { id: 'eA2b', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: 1, p: nz(r, -8, 8), q: nz(r, -12, 12) }; }); return vfPart(trW(o.p, o.q), 1, o.p, o.q, { sol: eqT(1, o.p, o.q), text: 'image: both translations' }); } },
      { id: 'eA2c', level: 'PRG', make: function (r) { var o = pick3(r, function () { return { a: -r.int(2, 8), p: nz(r, -8, 8), q: nz(r, -9, 9) }; }); return vfPart(listW([RFW, stW(-o.a), trW(o.p, o.q)]), o.a, o.p, o.q, { sol: t('a=' + o.a) + ', ' + t('p=' + o.p) + ', ' + t('q=' + o.q) + ': ' + eqT(o.a, o.p, o.q), text: 'image: reflection, stretch, translation' }); } },
      { id: 'eA2d', level: 'PRG', make: function (r) { var o = pick3(r, function () { var dd = r.pick([3, 5, 7]); return { a: r.int(1, dd - 1) / dd, p: nz(r, -8, 8), q: 0 }; }); return vfPart(stW(o.a) + ' and ' + trW(o.p, 0), o.a, o.p, 0, { sol: eqT(o.a, o.p, 0), text: 'image: fraction stretch and horizontal translation' }); } }] },
    { num: 'A3', stem: 'State the vertex, the axis of symmetry and the direction of opening of each graph.', parts: [
      { id: 'eA3a', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: -1, p: nz(r, -8, 8), q: nz(r, -9, 9) }; }); return vadRow(eqT(-1, o.p, o.q), -1, o.p, o.q, '', 'vertex, axis, direction (a = −1)'); } },
      { id: 'eA3b', level: 'BEG', make: function (r) { var o = pick3(r, function () { return { a: r.int(2, 6), p: nz(r, -8, 8), q: nz(r, -9, 9) }; }); return vadRow(eqT(o.a, o.p, o.q), o.a, o.p, o.q, '', 'vertex, axis, direction'); } },
      { id: 'eA3c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var dd = r.pick([2, 3, 4]); return { a: sgn(r) / dd, c: nz(r, -9, 9) }; }, function (z0) { return AV(z0.a, 0, z0.c); });
        return vadRow(t('y' + sT(-o.c) + '=' + aTex(o.a, true) + 'x^{2}'), o.a, 0, o.c, 'Solve for ' + t('y') + ': ' + eqT(o.a, 0, o.c) + '.<br>', 'vertex, axis, direction: solve for y first', [[[0, -o.c], LID + '-solve-y', 'Solve for ' + t('y') + ' first: move ' + t(sT(-o.c)) + ' to the right side.']]);
      } }] },
    { num: 'B1', section: 'B. Applying', stem: 'Sketch each graph using its vertex and the step pattern. State the maximum or minimum value.', parts: [
      { id: 'eB1a', level: 'EMG', make: function (r) { var o = pick3(r, function () { return { a: r.int(2, 3), p: nz(r, -4, 4), q: nz(r, -6, 4) }; }); return stepFields(o.a, o.p, o.q, 'step pattern points: a > 1'); } },
      { id: 'eB1b', level: 'PRG', make: function (r) { var o = pick3(r, function () { return { a: sgn(r) * r.pick([0.25, 0.5]), p: nz(r, -5, 5), q: nz(r, -5, 5) }; }); return stepFields(o.a, o.p, o.q, 'step pattern points: a fraction'); } }] },
    { num: 'B2', stem: 'Find the image of each point of ' + t('y=x^{2}') + ' on the given graph.', parts: [
      { id: 'eB2a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var dd = r.pick([2, 3, 4]); return { a: 1 / dd, x0: dd * r.pick([-2, -1, 1, 2]), p: nz(r, -6, 6), q: nz(r, -6, 6) }; }, function (z0) { return Math.abs(z0.x0) <= 6 && AV(z0.a, z0.p, z0.q) && !(z0.x0 === 3 && same(z0.a, 1 / 3) && z0.p === -4 && z0.q === -2); });
        var y0 = o.x0 * o.x0, R0 = [o.x0 + o.p, cl(o.a * y0 + o.q)];
        return z().fields(t(ptTex(o.x0, y0)) + ' on ' + eqT(o.a, o.p, o.q), [{ label: 'Image', pt: R0, cands: ptCands(o.x0, o.a, o.p, o.q) }], { sol: ptSol(o.x0, o.a, o.p, o.q) + '<br>Check: ' + t(rT(o.a) + '(' + R0[0] + sT(-o.p) + ')^{2}' + sT(o.q) + '=' + vT(R0[1])) + ' ✓', hints: HP, text: 'image of a point: fraction stretch' });
      } },
      { id: 'eB2b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([-2, -3, -4, 2, 3]), x0: r.pick([-3, -2, -1, 1, 2, 3]), p: nz(r, -6, 6), q: nz(r, -8, 8) }; }, function (z0) { return AV(z0.a, z0.p, z0.q) && !(z0.a === -2 && z0.x0 === -2 && z0.p === 1 && z0.q === 5); });
        var y0 = o.x0 * o.x0, R0 = [o.x0 + o.p, o.a * y0 + o.q];
        return z().fields(t(ptTex(o.x0, y0)) + ' on ' + eqT(o.a, o.p, o.q), [{ label: 'Image', pt: R0, cands: ptCands(o.x0, o.a, o.p, o.q) }], { sol: ptSol(o.x0, o.a, o.p, o.q) + '<br>Check: ' + t(o.a + '(' + R0[0] + sT(-o.p) + ')^{2}' + sT(o.q) + '=' + R0[1]) + ' ✓', hints: HP, text: 'image of a point' });
      } }] },
    { num: 'B3', parts: [
      { id: 'eB3', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { x0: r.pick([-3, -2, -1, 1, 2, 3]), p: nz(r, -7, 7), q: nz(r, -8, 8) }; }, function (z0) { return z0.x0 + z0.p !== 0 && AV(1, z0.p, z0.q) && !(z0.x0 === 2 && z0.p === -3 && z0.q === 3); });
        var y0 = o.x0 * o.x0, X1 = o.x0 + o.p, Y1 = y0 + o.q;
        return X.fields('A translation of ' + t('y=x^{2}') + ' maps the point ' + t(ptTex(o.x0, y0)) + ' to ' + t(ptTex(X1, Y1)) + '. Describe the translation and write the equation of the image.', [shiftSpec('Horizontal translation', o.p, true), shiftSpec('Vertical translation', o.q, false), vfSpec('Equation', 1, o.p, o.q)],
          { sol: t('x') + ': ' + t(o.x0 + '\\to ' + X1) + ' is ' + hWord(o.p) + '; ' + t('y') + ': ' + t(y0 + '\\to ' + Y1) + ' is ' + vWord(o.q) + '.<br>' + eqT(1, o.p, o.q), hints: ['Every point moves the same way: compare the ' + t('x') + '-coordinates, then the ' + t('y') + '-coordinates.'], text: 'translation from a point and its image' });
      } }] },
    { num: 'B4', parts: [
      { id: 'eB4', level: 'BEG', make: function (r) {
        var o = pick3(r, function () { return { a: r.int(2, 6), p: nz(r, -6, 6), q: 0 }; });
        var W1 = function (s, dir) { return stW(s).replace(/^a /, 'A ').replace(' about the ' + t('x') + '-axis', '') + ' and a translation of ' + units(o.p, dir); };
        var opts = [{ html: W1(o.a, o.p > 0 ? 'right' : 'left'), right: true }, { html: W1(o.a, o.p > 0 ? 'left' : 'right'), why: t('(x' + sT(-o.p) + ')') + ' means ' + t('p=' + o.p) + ': ' + hWord(o.p) + '.', code: LID + '-p-sign' },
          { html: W1(1 / o.a, o.p > 0 ? 'right' : 'left'), why: 'The stretch factor is ' + t('a=' + o.a) + ', not its reciprocal.', code: LID + '-recip' }, { html: 'A translation of ' + units(o.a, 'up') + ' and ' + units(o.p, o.p > 0 ? 'right' : 'left'), why: 'Multiplying by ' + t(o.a) + ' is a vertical stretch, not a translation.', code: LID + '-swap' }];
        return X.mc(r, 'Which transformations take the graph of ' + t('y=x^{2}') + ' to the graph of ' + eqT(o.a, o.p, 0) + '?', opts, t('a=' + o.a) + ': a stretch by a factor of ' + t(o.a) + '; ' + t('(x' + sT(-o.p) + ')') + ' means ' + t('p=' + o.p) + ', ' + hWord(o.p) + '.', HD, 'MC: transformations of y = a(x − p)²');
      } }] },
    { num: 'B5', parts: [
      { id: 'eB5', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { s: r.int(2, 5), neg: r.chance(0.3), p: nz(r, -6, 6), q: nz(r, -9, 9), dx: r.pick([-3, -2, -1, 1, 2, 3]) }; }, function (z0) { var a = z0.neg ? -z0.s : z0.s, k = a * z0.dx * z0.dx + z0.q; return k > 0 && k < 1000 && !(z0.s === 3 && z0.p === 5 && z0.q === -1) && AV(a, z0.p, z0.q); });
        var a = o.neg ? -o.s : o.s, x1 = o.p + o.dx, k = a * o.dx * o.dx + o.q;
        return X.num('The graph of ' + t('y=x^{2}') + ' is stretched vertically by a factor of ' + t(o.s) + ' about the ' + t('x') + '-axis, ' + (o.neg ? 'reflected in the ' + t('x') + '-axis, ' : '') + 'and translated ' + listW([hWord(o.p), vWord(o.q)]) + '. The point ' + t('(' + x1 + ',\\ k)') + ' is on the final graph. The value of ' + t('k') + ' is ____.', k,
          { nr: true, cands: [[a * (x1 + o.p) * (x1 + o.p) + o.q, LID + '-p-sign', 'Check the bracket: ' + t('(x' + sT(-o.p) + ')') + '.'], [a * (o.dx * o.dx + o.q), LID + '-order', 'Add ' + t('q') + ' after multiplying by ' + t('a') + '.'], [-a * o.dx * o.dx + o.q, LID + '-reflect', 'Check the sign of ' + t('a') + '.']],
            sol: eqT(a, o.p, o.q) + '; ' + t('k=' + a + '(' + x1 + sT(-o.p) + ')^{2}' + sT(o.q) + '=' + a + '(' + o.dx * o.dx + ')' + sT(o.q) + '=' + k), hints: HE, text: 'NR: a value on the image' });
      } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'eC1', level: 'EMG', make: function (r) {
        var p = r.pick([2, 4, 5, -2, -4, -5, 6]), xs = [p - 2, p - 1, p, p + 1, p + 2];
        var specs = xs.map(function (x) { return { label: t('x=' + x) + ': ' + t('y='), name: 'y at x = ' + x, ans: (x - p) * (x - p), cands: [[(x + p) * (x + p), LID + '-table', 'Substitute into ' + t('(x' + sT(-p) + ')^{2}') + ': ' + t('(' + x + sT(-p) + ')^{2}') + '.'], [x * x, LID + '-table', 'Square ' + t('x' + sT(-p)) + ', not ' + t('x') + '.']] }; });
        var dir = p > 0 ? 'right' : 'left';
        specs.push({ label: 'The lowest point is at ' + t('x='), name: 'x of the lowest point', ans: p, cands: [[-p, LID + '-p-sign', 'Look at your table: where is ' + t('y=0') + '?']] });
        specs.push({ label: 'So the graph is ' + t(Math.abs(p)) + ' units', name: 'left or right', check: X.wordChk(dir, ['left', 'right'], 'The lowest point moved from ' + t('x=0') + ' to ' + t('x=' + p) + '.'), key: dir, ansTex: '\\text{' + dir + '}', text: true, placeholder: 'left or right', after: 'of ' + t('y=x^{2}') });
        return z().fields('Complete the table of values for ' + t('y=(x' + sT(-p) + ')^{2}') + ', then explain which way it is translated from ' + t('y=x^{2}') + '.', specs,
          { sol: t('x') + ': ' + xs.join(', ') + ' gives ' + t('(x' + sT(-p) + ')^{2}') + ': ' + xs.map(function (x) { return (x - p) * (x - p); }).join(', ') + '. The lowest point, ' + t('y=0') + ', is now at ' + t('x=' + p) + ' instead of ' + t('x=0') + ': each ' + t('y') + '-value of ' + t('y=x^{2}') + ' appears ' + Math.abs(p) + ' units ' + (p > 0 ? 'later, i.e. to the right' : 'earlier, i.e. to the left') + '.', hints: ['Substitute each ' + t('x') + ' into the bracket first, then square.'], text: 'table of values: why (x − p)² moves right' });
      } }] },
    { num: 'C2', parts: [
      { id: 'eC2', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3, 4, 5, 0.5, 1.5]), p: nz(r, -5, 5), q: nz(r, -8, 8), x1: nz(r, -4, 6) }; }, function (z0) { var d0 = z0.x1 - z0.p, y = z0.a * d0 * d0 + z0.q; return d0 !== 0 && Math.abs(d0) <= 4 && Number.isInteger(y) && Math.abs(y) <= 60 && !(z0.p === -2 && z0.q === -5 && z0.x1 === 1) && AV(z0.a, z0.p, z0.q); });
        var d0 = o.x1 - o.p, y1 = o.a * d0 * d0 + o.q;
        return X.num('The graph of ' + t('y=x^{2}') + ' is stretched vertically by a factor of ' + t('a') + ' (' + t('a>0') + ') and then translated ' + listW([hWord(o.p), vWord(o.q)]) + '. The image passes through ' + t(ptTex(o.x1, y1)) + '. Determine ' + t('a') + '.', o.a,
          { before: t('a='), cands: [[cl((y1 + o.q) / (d0 * d0)), LID + '-q-sign', 'Move ' + t(o.q) + ' to the other side carefully: ' + t(y1 + sT(-o.q) + '=' + d0 * d0 + 'a') + '.'], [cl((y1 - o.q) / ((o.x1 + o.p) * (o.x1 + o.p))), LID + '-p-sign', 'Check the bracket: ' + t('(x' + sT(-o.p) + ')') + '.'], [cl(d0 * d0 / (y1 - o.q)), LID + '-recip', 'Solve ' + t(d0 * d0 + 'a=' + (y1 - o.q)) + ' by dividing by ' + t(d0 * d0) + '.']],
            sol: t('y=a(x' + sT(-o.p) + ')^{2}' + sT(o.q)) + '<br>' + t(y1 + '=a(' + o.x1 + sT(-o.p) + ')^{2}' + sT(o.q) + '=' + d0 * d0 + 'a' + sT(o.q)) + '<br>' + t(d0 * d0 + 'a=' + (y1 - o.q)) + ', so ' + t('a=' + vT(o.a)), hints: ['Write the equation with ' + t('a') + ' unknown, then substitute the point.'], text: 'the stretch factor from a point' });
      } }] },
    { num: 'C3', shared: function (r) { return pickWhere(function () { return { a: r.pick([2, 3, -2, 0.5, 4]), p: nz(r, -5, 5), q: nz(r, -6, 6), dx: nz(r, -6, 6), dy: nz(r, -8, 8) }; }, function (o) { return o.q + o.dy !== 0 && o.p + o.dx !== 0 && AV(o.a, o.p, o.q) && !(o.a === 2 && o.p === 1 && o.q === 3 && o.dx === -4 && o.dy === -6); }); },
      stem: function (o) { return 'The graph of ' + eqT(o.a, o.p, o.q) + ' is translated ' + listW([hWord(o.dx), vWord(o.dy)]) + '.'; },
      parts: [
        { id: 'eC3a', level: 'ADV', make: function (r, o) {
          var P1 = o.p + o.dx, Q1 = o.q + o.dy;
          return z().fields('Write the equation of the new graph and state its vertex.', [vfSpec('Equation', o.a, P1, Q1, { cands: [{ a: o.a, p: o.dx, q: o.dy, code: LID + '-order', hint: 'Move the vertex ' + t(ptTex(o.p, o.q)) + ', not ' + t('(0,\\ 0)') + ': add the translation to it.' }, { a: o.a, p: o.p - o.dx, q: Q1, code: LID + '-p-sign', hint: 'Moving ' + (o.dx > 0 ? 'right' : 'left') + ' ' + (o.dx > 0 ? 'adds to' : 'subtracts from') + ' the vertex’s ' + t('x') + '-coordinate.' }] }),
            { label: 'Vertex', pt: [P1, Q1], cands: [[[o.p - o.dx, Q1], LID + '-p-sign', 'Moving ' + (o.dx > 0 ? 'right adds to' : 'left subtracts from') + ' the ' + t('x') + '-coordinate.'], [[P1, o.q - o.dy], LID + '-q-sign', 'Moving ' + (o.dy > 0 ? 'up adds to' : 'down subtracts from') + ' the ' + t('y') + '-coordinate.']] }],
            { sol: 'The vertex ' + t(ptTex(o.p, o.q)) + ' moves to ' + t(ptTex(P1, Q1)) + ' (the shape, ' + t('a=' + vT(o.a)) + ', doesn’t change): ' + eqT(o.a, P1, Q1) + '.', hints: ['A translation moves the vertex and keeps ' + t('a') + '.'], text: 'translating a parabola' });
        } },
        { id: 'eC3b', level: 'MAS', make: function (r, o) {
          var P1 = o.p + o.dx, Q1 = o.q + o.dy;
          return z().fields('The new graph is then reflected in the ' + t('x') + '-axis. Write its equation and state its vertex.', [vfSpec('Equation', -o.a, P1, -Q1, { cands: [{ a: -o.a, p: P1, q: Q1, code: LID + '-reflect-q', hint: 'A reflection in the ' + t('x') + '-axis changes the sign of <b>every</b> ' + t('y') + '-value, so the vertex’s ' + t('y') + '-coordinate changes sign too.' }, { a: o.a, p: P1, q: -Q1, code: LID + '-reflect', hint: 'The reflection makes the parabola open the other way: ' + t('a') + ' changes sign too.' }] }),
            { label: 'Vertex', pt: [P1, -Q1], cands: [[[P1, Q1], LID + '-reflect-q', 'The vertex is not on the ' + t('x') + '-axis, so the reflection moves it: ' + t('(x,\\ y)\\to(x,\\ -y)') + '.'], [[-P1, Q1], LID + '-reflect', 'A reflection in the <b>' + t('x') + '-axis</b> changes the ' + t('y') + '-coordinate, not the ' + t('x') + '-coordinate.']] }],
            { sol: 'Every ' + t('y') + '-value changes sign: ' + t('y=-\\left[' + vf(o.a, P1, Q1, true) + '\\right]') + ', so ' + eqT(-o.a, P1, -Q1) + ', vertex ' + t(ptTex(P1, -Q1)) + '.', hints: ['A reflection in the ' + t('x') + '-axis maps ' + t('(x,\\ y)') + ' to ' + t('(x,\\ -y)') + ': multiply the whole right side by ' + t('-1') + '.'], text: 'reflecting a translated parabola' });
        } }] }
  ];

  /* vertex, axis, direction (Extra A3) */
  function vadRow(prompt, a, p, q, pre, text, ptC) {
    return X.fields(prompt, [{ label: 'Vertex', pt: [p, q], cands: [[[-p, q], LID + '-p-sign', t('(x' + sT(-p) + ')^{2}') + ' gives ' + t('p=' + vT(p)) + '.'], [[p, -q], LID + '-q-sign', 'Check the sign of ' + t('q') + '.']].concat(ptC || []) }, { label: 'Axis of symmetry', axis: p, q: q }, X.dirSpec(a > 0)],
      { sol: pre + 'Vertex ' + t(ptTex(p, q)) + '; axis ' + t('x=' + vT(p)) + '; ' + t('a=' + vT(a)) + (a > 0 ? ' > 0: opens up.' : ' < 0: opens down.'), hints: ['In ' + t('y=a(x-p)^{2}+q') + ': vertex ' + t('(p,\\ q)') + ', axis ' + t('x=p') + '; ' + t('a>0') + ' opens up, ' + t('a<0') + ' opens down.'], text: text });
  }
  /* the vertex and the step-pattern points (Extra B1) */
  function stepFields(a, p, q, text) {
    var Z = z(), s = Math.abs(a), d1 = s < 1 ? 2 : 1, d2 = s < 1 ? 4 : 2, P1 = [p + d1, cl(q + a * d1 * d1)], P2 = [p + d2, cl(q + a * d2 * d2)];
    var st = stepPts(a, p, q), pts = [[p, q]].concat(st.pts);
    var W0 = Z.win(pts, 1, 1), fig = X.graphFig([{ f: Z.parabola(a, p, q) }], pts.map(function (P) { return { x: P[0], y: P[1] }; }), { win: W0 });
    var slip = function (dd) { return [[[p + dd, cl(q + Math.sign(a) * dd * dd)], LID + '-step', 'Multiply the step by ' + t('a=' + vT(a)) + '.'], [[p + dd, cl(q - a * dd * dd)], LID + '-g-dir', t('a=' + vT(a)) + (a > 0 ? ' is positive: the points go <b>up</b> from the vertex.' : ' is negative: the points go <b>down</b> from the vertex.')], [[p - dd, cl(q + a * dd * dd)], 'value', 'Give the point to the <b>right</b> of the vertex.']]; };
    return Z.fields('Sketch ' + eqT(a, p, q) + ' using its vertex and the step pattern. Give the vertex, the points ' + t(d1) + ' and ' + t(d2) + ' units to the right of it, and the maximum or minimum value.', [{ label: 'Vertex', pt: [p, q], cands: [[[-p, q], LID + '-p-sign', 'Check the sign of ' + t('p') + '.']] },
      { label: t(d1) + ' unit' + (d1 === 1 ? '' : 's') + ' right', name: d1 + ' right of the vertex', pt: P1, cands: slip(d1) }, { label: t(d2) + ' units right', name: d2 + ' right of the vertex', pt: P2, cands: slip(d2) }, { label: 'Max or min?', mm: a > 0 ? 'min' : 'max' }, { label: 'Value', ans: q, cands: [[p, 'u5l3-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex.']] }],
      { sol: 'Vertex ' + t(ptTex(p, q)) + '; ' + st.words + ': ' + st.pts.map(function (P) { return t(ptTex(P[0], P[1])); }).join(', ') + '. ' + (a > 0 ? 'Minimum' : 'Maximum') + ' value ' + t(q) + '.' + fig, hints: HS.concat(s < 1 ? ['For ' + t('a=' + vT(a)) + ', move ' + t(2) + ' across and ' + t('a\\times 4') + ' vertically so the points land on the grid.'] : []), text: text });
  }

  HW.defineLesson({ id: LID, unit: 5, num: '2', title: 'Graphing y = a(x − p)² + q', outcome: 'RF3', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
