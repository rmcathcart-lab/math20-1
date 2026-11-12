/* Math 20-1 · Unit 5 · Lesson 1 — Zeros, Roots and x-Intercepts (outcome RF5 on every part, as the course plan tags the lesson)
 * Assignment 1 (m201book unit5/u5_l01.tex, Questions 1–18) and the Lesson 1 Extra Practice (u5_ep01.tex, A1–A3, B1–B6,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (contexts vary a
 * little); the lesson's example functions and the booklet's own numbers are left out. Calculator lesson: zeros are exact
 * (integers or fractions) where the booklet asks, and rounded to the nearest hundredth where it says so.
 *
 * This file also defines the kit HW.p51 (used by u5l2.js too). It builds on HW.u5k34 (js/lessons/u5l3.js), which loads
 * AFTER this file, so the kit only touches HW.u5k34 inside generators and checkers (never at load time):
 *   numbers   cl, same, gcd, toFrac, nT, rT (exact), vT (display), sT (signed term), aTex (a coefficient), linTex(m, n),
 *             polyTex(coefs, v, frac), pickWhere, nz
 *   factors   a linear factor [m, n] is (mx + n); { f: [m, n], k: 2 } is its square. expand(k, fs), facTex(k, fs), zerosOf(fs),
 *             quad(k, fs) → { cs, tex, fac, zeros, f }
 *   checkers  rootsChk(spec) (HW.u5k34's x-intercept-set checker with the "one root missing" case for factoring, any letter,
 *             "none"), facChk(tex, wrongs) (K.factored; a fraction in a bracket, 2(x + ½)(x − 3), is accepted), genChk(coefs,
 *             wrongs) (K.poly, expanded and simplified), dirChk(up) ("up" / "down")
 *   parts     fields(prompt, specs, o) (HW.u5k34.fields; o.vars = the letters for the keypad), rootsSpec / facSpec / genSpec /
 *             dirSpec (field specs), rootsPart, facPart, num, apx, mc, mcVals (multiple choice of sets of values)
 *   figures   graphFig(fns, points, o) (a parabola on a grid that fits the points)
 *   keypads   'p51' / 'p51s' (HW.u5k34's keypads with the letters a part needs, e.g. t, h, k)
 * Recognised mistakes (codes u5l1-…): a zero with the wrong sign, the zero of (mx − n) as m/n or as n (the coefficient
 * ignored), a constant factor given as a zero, the root x = 0 lost by dividing by x, factoring before one side is 0, the
 * square root not taken (±n²/m²), a double root given as ±, the sign of a, a solved upside down, the vertex value not
 * squared, the y-intercept slips, the negative time kept, the axis not halved, b and c sign slips, the direction of
 * opening.
 * Conversions: "state the number of x-intercepts, and explain" → multiple choice of counts with reasons; "compare the
 * graphs" → the shared features in boxes plus a multiple choice of the difference; "what does it represent" → multiple
 * choice; graphs → SVG from the actual function; numerical response → a number box (4 characters).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 13, Extra C2, C3. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u5l1';

  /* =========================== the kit (HW.p51) =========================== */
  var X = HW.p51 = HW.p51 || {};
  function z() { var Z = HW.u5k34; if (!Z) throw new Error('HW.p51 needs HW.u5k34 (js/lessons/u5l3.js)'); return Z; }
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function same(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function pickWhere(gen, okf) { for (var i = 0; i < 20000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('p51: no valid numbers'); }
  function nz(r, a, b) { return pickWhere(function () { return r.int(a, b); }, function (x) { return x !== 0; }); }
  function toFrac(x) { for (var q = 1; q <= 1000; q++) { var p = x * q; if (Math.abs(p - Math.round(p)) < 1e-7) { var g = gcd(Math.round(p), q) || 1; return [Math.round(p) / g, q / g]; } } return null; }
  function terminates(fr) { var q = fr[1]; while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; }
  function nT(x) { x = cl(x); if (Math.abs(x) < 1e-12) x = 0; return F(x); }
  function rT(x) { var f = toFrac(x); if (!f || f[1] === 1) return nT(x); return (f[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(f[0]) + '}{' + f[1] + '}'; }
  function vT(x) { var f = toFrac(x); if (!f || f[1] === 1) return nT(x); if (terminates(f) && Math.abs(cl(x * 100) - Math.round(x * 100)) < 1e-9) return nT(x); return rT(x); }
  function cT(x, frac) { var f = toFrac(Math.abs(x)); if (frac && f && f[1] !== 1) return '\\frac{' + f[0] + '}{' + f[1] + '}'; return nT(Math.abs(x)); }
  function sT(x, frac) { if (same(x, 0)) return ''; return (x < 0 ? '-' : '+') + (frac ? cT(x, true) : vT(Math.abs(x))); }
  function aTex(a, frac) { return same(a, 1) ? '' : same(a, -1) ? '-' : (a < 0 ? '-' : '') + cT(a, frac); }
  function linTex(m, n, v) { v = v || 'x'; var s = (m === 1 ? '' : m === -1 ? '-' : String(m)) + v; return same(n, 0) ? s : s + (n > 0 ? '+' : '-') + nT(Math.abs(n)); }
  function polyTex(cs, v, frac) {
    var n = cs.length - 1, s = ''; v = v || 'x';
    cs.forEach(function (c, i) {
      var pw = n - i; if (same(c, 0)) return;
      var neg = c < 0, body = (same(Math.abs(c), 1) && pw > 0 ? '' : cT(c, frac)) + (pw > 1 ? v + '^{' + pw + '}' : pw === 1 ? v : '');
      s += s ? (neg ? '-' : '+') + body : (neg ? '-' : '') + body;
    });
    return s || '0';
  }
  function uniq(L) { var o = []; L.forEach(function (x) { if (!o.some(function (y) { return same(x, y); })) o.push(x); }); return o; }
  function setEq(A, T) { A = uniq(A); T = uniq(T); return A.length === T.length && A.every(function (x) { return T.some(function (y) { return same(x, y); }); }); }
  /* polynomials as coefficient arrays (descending); linear factors [m, n] = (mx + n), { f, k } a power */
  function pmul(a, b) { var o = []; for (var i = 0; i < a.length; i++) for (var j = 0; j < b.length; j++) o[i + j] = (o[i + j] || 0) + a[i] * b[j]; return o.map(cl); }
  function F1(f) { return f.f ? f : { f: f, k: 1 }; }
  function expand(k, fs) { var p = [k]; fs.forEach(function (f) { f = F1(f); for (var i = 0; i < f.k; i++) p = pmul(p, f.f); }); return p; }
  function isX(f) { return f[0] === 1 && f[1] === 0; }
  function facTex(k, fs, v) {
    v = v || 'x';
    var L = fs.map(F1).slice().sort(function (A, Bb) { return (isX(A.f) ? 0 : 1) - (isX(Bb.f) ? 0 : 1); });
    return aTex(k, true) + L.map(function (f) { var b = isX(f.f) ? v : '(' + linTex(f.f[0], f.f[1], v) + ')'; return f.k > 1 ? b + '^{' + f.k + '}' : b; }).join('');
  }
  function zerosOf(fs) { return uniq(fs.map(F1).map(function (f) { return cl(-f.f[1] / f.f[0]); })).sort(function (a, b) { return a - b; }); }
  function evalP(cs, x) { return cs.reduce(function (s, c) { return s * x + c; }, 0); }
  function quad(k, fs) { var cs = expand(k, fs); return { k: k, fs: fs, cs: cs, tex: polyTex(cs, 'x', true), fac: facTex(k, fs), zeros: zerosOf(fs), f: function (x) { return evalP(cs, x); } }; }
  function ptTex(x, y) { return '(' + vT(x) + ',\\ ' + vT(y) + ')'; }
  function rootsKey(vals, v) { v = v || 'x'; var T = uniq(vals).sort(function (a, b) { return a - b; }); return T.length ? T.map(function (x) { return v + '=' + rT(x); }).join(',\\ ') : '\\text{none}'; }
  function orT(vals, v) { v = v || 'x'; return uniq(vals).sort(function (a, b) { return a - b; }).map(function (x) { return t(v + '=' + rT(x)); }).join(' or '); }
  function andT(vals) { var L = uniq(vals).sort(function (a, b) { return a - b; }).map(function (x) { return t(rT(x)); }); return L.length < 3 ? L.join(' and ') : L.slice(0, -1).join(', ') + ' and ' + L[L.length - 1]; }
  X.z = z; X.cl = cl; X.same = same; X.gcd = gcd; X.pickWhere = pickWhere; X.nz = nz; X.toFrac = toFrac; X.nT = nT; X.rT = rT; X.vT = vT; X.cT = cT; X.sT = sT; X.aTex = aTex;
  X.linTex = linTex; X.polyTex = polyTex; X.uniq = uniq; X.setEq = setEq; X.pmul = pmul; X.expand = expand; X.facTex = facTex; X.zerosOf = zerosOf; X.evalP = evalP; X.quad = quad;
  X.ptTex = ptTex; X.rootsKey = rootsKey; X.orT = orT; X.andT = andT;

  /* ---- checkers ---- */
  /* roots / zeros / x-intercepts as a set of values (HW.u5k34.rootsChk), with the factoring case "one value missing" */
  X.rootsChk = function (spec) {
    var v = spec.v || 'x', what = spec.what || 'roots', base = null, T = uniq(spec.vals || []);
    var cands = (spec.cands || []).filter(function (c) { return c && c[0].every(isFinite) && !setEq(c[0], T); });
    return function (resp) {
      var Z = z();
      if (!base) base = Z.rootsChk({ vals: T, cands: cands, v: v, what: what, irr: spec.irr, pm: spec.pm,
        noneHint: spec.noneHint || 'There are ' + what + ' here: factor, then set each factor that contains ' + t(v) + ' equal to ' + t('0') + '.',
        negHint: spec.negHint });
      var A = Z.readRoots(resp, v);
      if (A.vals && T.length > 1) {
        var vals = uniq(A.vals.map(function (x) { return x.v; }));
        var isCand = cands.some(function (c) { return setEq(vals, c[0]); });
        if (!isCand && vals.length < T.length && vals.every(function (x) { return T.some(function (y) { return same(x, y); }); }))
          return wrong('sol-missing', 'Correct so far — but there ' + (T.length - vals.length > 1 ? 'are more ' + what : 'is another one') + ': set <b>each</b> factor that contains ' + t(v) + ' equal to ' + t('0') + '.');
      }
      return base(resp);
    };
  };
  function stripLHS(s) { return z().stripLHS(s); }
  /* factored form (K.factored); wrongs: [{ cs (expanded coefficients) | is (LaTeX), code, hint }] */
  X.facChk = function (target, wrongs) {
    var c = null;
    return function (resp) {
      if (!c) c = K.factored(target, { wrong: (wrongs || []).map(function (w) { return { is: w.is || polyTex(w.cs, 'x', true), code: w.code, hint: w.hint }; }) });
      var r = c(stripLHS(resp));
      if (r.v === 'form' && r.code === 'frac-bracket') return ok();
      return r;
    };
  };
  /* general form (K.poly: expanded and simplified) */
  X.genChk = function (cs, wrongs) {
    var c = null;
    return function (resp) {
      if (!c) c = K.poly(polyTex(cs, 'x', true), { wrong: (wrongs || []).map(function (w) { return { is: polyTex(w.cs, 'x', true), code: w.code, hint: w.hint }; }) });
      return c(stripLHS(resp));
    };
  };
  X.dirChk = function (up) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, '$1$2').replace(/[\\{}\s]/g, '').toLowerCase().replace(/^opens/, '');
      if (!s) return form('empty', 'Type <b>up</b> or <b>down</b>.');
      var isUp = /^up(wards?)?$/.test(s), isDown = /^down(wards?)?$/.test(s);
      if (!isUp && !isDown) return form('p51-dir-word', 'Type the word <b>up</b> or <b>down</b>.');
      if (isUp === up) return ok();
      return wrong('p51-dir', up ? t('a>0') + ', so the parabola opens <b>up</b> (its vertex is the lowest point).' : t('a<0') + ', so the parabola opens <b>down</b> (its vertex is the highest point).');
    };
  };

  /* ---- part builders ---- */
  X.fields = function (prompt, specs, o) {
    o = o || {};
    var p = z().fields(prompt, specs, o);
    if (o.vars) {
      var hasSet = p.input.fields.some(function (f) { return f.keys === 'u5k34s'; });
      p.input.fields.forEach(function (f) { if (f.mode === 'math') { f.keys = hasSet ? 'p51s' : 'p51'; f.vars = o.vars; } });
    }
    if (o.outcome) p.outcome = o.outcome;
    return p;
  };
  X.rootsSpec = function (label, spec, o) {
    o = o || {};
    return { label: label, name: o.name || String(label).replace(/<[^>]+>|\\\(|\\\)/g, ''), check: X.rootsChk(spec), key: rootsKey(spec.vals, spec.v), ansTex: rootsKey(spec.vals, spec.v), math: true,
      placeholder: o.placeholder || (spec.v || 'x') + ' = 3, ' + (spec.v || 'x') + ' = -5', before: o.before };
  };
  X.facSpec = function (label, k, fs, wrongs, o) { o = o || {}; var key = facTex(k, fs); return { label: label, name: o.name || 'Factored form', before: o.before == null ? t('y=') : o.before, check: X.facChk(key, wrongs), key: key, ansTex: key, math: true, placeholder: 'e.g. 2(x + 1)(x - 3)' }; };
  X.genSpec = function (label, cs, wrongs, o) { o = o || {}; var key = polyTex(cs, 'x', true); return { label: label, name: o.name || 'General form', before: o.before == null ? t('y=') : o.before, check: X.genChk(cs, wrongs), key: key, ansTex: key, math: true, placeholder: 'e.g. 2x^2 - 4x - 6' }; };
  X.dirSpec = function (up) { return { label: 'Opens', name: 'Opens up or down', check: X.dirChk(up), key: up ? 'up' : 'down', ansTex: '\\text{' + (up ? 'up' : 'down') + '}', text: true, placeholder: 'up or down' }; };
  function badRoots(spec) {
    var T = uniq(spec.vals), v = spec.v || 'x', out = [];
    (spec.cands || []).forEach(function (c) { if (c && c[0].every(isFinite) && !setEq(c[0], T)) out.push(uniq(c[0]).map(function (x) { return v + '=' + rT(cl(x)); }).join(',\\ ')); });
    if (T.length) out.push('\\text{none}');
    if (T.length > 1) out.push(v + '=' + rT(T[T.length - 1]));
    return out;
  }
  X.rootsPart = function (prompt, spec, sol, hints, text, o) {
    o = o || {}; var v = spec.v || 'x';
    return { prompt: prompt, input: { type: 'math', keys: v === 'x' ? 'u5k34' : 'p51', vars: [v], before: o.before, placeholder: 'e.g. ' + v + ' = 3, ' + v + ' = -5' }, check: X.rootsChk(spec), key: rootsKey(spec.vals, v),
      answer: t(rootsKey(spec.vals, v)), solution: sol, hints: hints || [], text: text, bad: badRoots(spec), outcome: o.outcome };
  };
  X.facPart = function (prompt, k, fs, wrongs, sol, hints, text, o) {
    o = o || {}; var key = facTex(k, fs);
    return { prompt: prompt, input: { type: 'math', keys: 'poly', vars: ['x'], before: t('y='), placeholder: 'e.g. 2(x + 1)(x - 3)' }, check: X.facChk(key, wrongs), key: key, answer: t('y=' + key),
      solution: sol, hints: hints || [], text: text, bad: (wrongs || []).map(function (w) { return w.is || facTex(w.k, w.fs || fs); }).filter(function (b) { return b !== key; }), outcome: o.outcome };
  };
  X.num = function (prompt, ans, o) { return z().num(prompt, ans, o); };
  X.apx = function (prompt, x, dp, o) { return z().apx(prompt, x, dp, o); };
  X.mc = function (r, prompt, opts, sol, hints, text, keep) { return z().mc(r, prompt, opts, sol, hints, text, keep); };
  /* multiple choice of value sets: right = [values], wrongs = [{ vals, why, code }] */
  X.mcVals = function (r, prompt, right, wrongs, sol, hints, text, o) {
    o = o || {};
    var fmt = o.fmt || function (vals) { return o.only && vals.length === 1 ? t(rT(vals[0])) + ' only' : vals.map(function (x) { return t(rT(x)); }).join(vals.length > 2 ? ', ' : ' and ').replace(/, ([^,]*)$/, ' and $1'); };
    var opts = [{ html: fmt(right), right: true }].concat(wrongs.filter(function (w) { return !setEq(w.vals, right); }).map(function (w) { return { html: fmt(w.vals), why: w.why, code: w.code }; }));
    return X.mc(r, prompt, opts, sol, hints, text, o.keep);
  };
  /* ---- figures ---- */
  X.graphFig = function (fns, pts, o) {
    o = o || {};
    var Z = z(), W0 = o.win || Z.win(pts.map(function (p) { return [p.x, p.y]; }).concat(o.extra || []), o.padX == null ? 2 : o.padX, o.padY == null ? 2 : o.padY);
    var sx = W0.x[1] - W0.x[0], sy = W0.y[1] - W0.y[0];
    return Z.fig({ x: W0.x, y: W0.y, lx: sx > 16 ? 4 : 2, ly: sy > 32 ? 8 : sy > 16 ? 4 : 2, g: 1, gy: sy > 40 ? 4 : sy > 24 ? 2 : 1, ux: Math.min(26, 270 / sx), uy: Math.min(26, 270 / sy),
      fns: fns, points: o.showPts === false ? [] : pts, max: o.max || 300, aria: o.aria || 'graph of a parabola' });
  };

  /* ---- keypads: HW.u5k34's, with the letters a part needs ---- */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = {
      del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      enter: { label: 'Check ↵', fn: 'enter', wide: true }, minus: { label: '−', tex: '-', plain: '-' }, plus: { label: '+', tex: '+', plain: '+' }, dot: { label: '.', tex: '.', plain: '.' },
      frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' },
      par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Brackets (a point or a factor)' }, comma: { label: ',', tex: ',', plain: ', ' }, eq: { label: '=', tex: '=', plain: ' = ' },
      sq: { label: 'x<sup>2</sup>', tex: '^{2}', plain: '^2', title: 'Squared' }, pm: { label: '±', tex: '\\pm ', plain: '±' },
      none: { label: 'none', tex: '\\text{none}', plain: 'none', title: 'None' },
      le: { label: '≤', tex: '\\le ', plain: ' <= ' }, ge: { label: '≥', tex: '\\ge ', plain: ' >= ' }, lt: { label: '<', tex: '<', plain: ' < ' }, gt: { label: '>', tex: '>', plain: ' > ' },
      braces: { label: '{ }', tex: '\\left\\lbrace #0\\right\\rbrace', plain: '{', title: 'Braces' }, mid: { label: '|', tex: '\\mid ', plain: ' | ', title: 'such that' },
      inn: { label: '∈', tex: '\\in ', plain: ' in ', title: 'is an element of' }, R: { label: 'ℝ', tex: '\\mathbb{R}', plain: 'R', title: 'the real numbers' }
    };
    var letters = function (opt) { var vs = (opt && opt.vars && opt.vars.length ? opt.vars : ['x', 'y']).filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 5); return vs.map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; }); };
    var base = function (opt) { return [[d(7), d(8), d(9), KY.frac, KY.sqrt, KY.del], [d(4), d(5), d(6), KY.par, KY.comma, KY.clear], [d(1), d(2), d(3), KY.plus, KY.minus, KY.left, KY.right], [d(0), KY.dot, KY.eq, KY.sq, KY.pm].concat(letters(opt))]; };
    W.KEYSETS.p51 = function (opt) { return base(opt).concat([[KY.none, KY.enter]]); };
    W.KEYSETS.p51s = function (opt) { return base(opt).concat([[KY.le, KY.ge, KY.lt, KY.gt, KY.braces, KY.mid, KY.inn, KY.R], [KY.enter]]); };
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.p51 = ['Several values: separate them with a comma (or use <b>±</b>). Points: press <b>( )</b>. Press <b>▶</b> to step out of a box.', 'Type e.g. <code>t = 2, t = -1</code>, <code>(3, -2)</code> or <code>y = (x + h)^2 - k</code>.'];
    W.KEYHELP.p51s = ['Sets: ' + HW.k('\\{y\\mid y\\ge k,\\ y\\in\\mathbb{R}\\}') + ' with <b>{ }</b>, <b>|</b>, <b>≥</b>, <b>∈</b> and <b>ℝ</b> (press <b>▶</b> to step out). Points: <b>( )</b>.', 'Type e.g. <code>{y | y >= k, y in R}</code> or <code>(h, k)</code>.'];
  }

  /* =========================== Lesson 1 =========================== */
  var CODES = {
    'u5l1-sign': 'Zero with the wrong sign ((x + 3) read as 3)', 'u5l1-recip': 'Zero of (mx − n) taken as m/n', 'u5l1-coef': 'Zero of (mx − n) taken as n (coefficient ignored)',
    'u5l1-const': 'Gave a constant factor as a zero', 'u5l1-lost0': 'Lost the root x = 0 (divided by x)', 'u5l1-zp-not0': 'Used the zero product property before one side was 0',
    'u5l1-noroot': 'Didn’t take the square root', 'u5l1-dbl': 'Gave a double root as two roots (±)', 'u5l1-a-sign': 'Sign of a wrong', 'u5l1-a-recip': 'Solved for a upside down',
    'u5l1-a-nosq': 'Vertex value not squared when finding a', 'u5l1-yint': 'y-intercept slip', 'u5l1-yint-vertex': 'Gave the vertex value as the y-intercept', 'u5l1-neg-root': 'Kept the negative time',
    'u5l1-mid': 'Axis: added the zeros but didn’t halve', 'u5l1-b-sign': 'Sign of b wrong (b = r + s)', 'u5l1-c-sign': 'Sign of c wrong', 'u5l1-swap': 'Coordinates swapped',
    'u5l1-vertex-y': 'Vertex y-coordinate with the wrong sign', 'u5l1-maxval': 'Max/min value from the wrong point', 'u5l1-given': 'Gave the zero that was given', 'u5l1-k': 'Unknown coefficient wrong',
    'u5l1-profit': 'Profit interval: the wrong values', 'u5l1-maxprofit': 'Greatest profit: wrong value', 'u5l1-each-c': 'Set each factor equal to the constant', 'u5l1-mean': 'Meaning of an intercept misread',
    'u5l1-cmp': 'Compared graphs: wrong description', 'u5l1-round': 'Rounded zeros: wrong value', 'p51-dir': 'Direction of opening wrong', 'p51-dir-word': 'Direction not written as up/down'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u5l1-sign': 's', 'u5l1-recip': 'b', 'u5l1-coef': 'b', 'u5l1-const': 's', 'u5l1-lost0': 'b', 'u5l1-zp-not0': 'n', 'u5l1-noroot': 'b', 'u5l1-dbl': 's', 'u5l1-a-sign': 's', 'u5l1-a-recip': 'b',
    'u5l1-a-nosq': 'b', 'u5l1-yint': 's', 'u5l1-yint-vertex': 'n', 'u5l1-neg-root': 's', 'u5l1-mid': 's', 'u5l1-b-sign': 's', 'u5l1-c-sign': 's', 'u5l1-swap': 's', 'u5l1-vertex-y': 's', 'u5l1-each-c': 'n', 'p51-dir': 'b' });

  var HF = ['Move every term to one side so the other side is ' + t('0') + ', then factor fully.', 'Set each factor that contains ' + t('x') + ' equal to ' + t('0') + ' and solve (the zero product property). A constant factor is never ' + t('0') + '.'];
  var HZ = ['The zeros of ' + t('f') + ' are the values of ' + t('x') + ' that make ' + t('f(x)=0') + ': set ' + t('f(x)=0') + ' and factor.', 'Each factor ' + t('(mx-n)') + ' gives the zero ' + t('x=\\frac{n}{m}') + '.'];
  var HY = ['The ' + t('y') + '-intercept is ' + t('f(0)') + ': substitute ' + t('x=0') + ' (for general form it is the constant term ' + t('c') + ').'];
  var HA = ['Each zero ' + t('r') + ' gives a factor ' + t('(x-r)') + ': write ' + t('y=a(x-r)(x-s)') + '.', 'Substitute the coordinates of the other point for ' + t('x') + ' and ' + t('y') + ', then solve for ' + t('a') + '.'];
  /* the lesson's examples and the booklet's own functions, as zero sets with a: [a, zeros…] */
  var SEEN = [[1, -1, 5], [-1, -3, 1], [1, -4, 2], [1, -2, 7], [6, -0.5, 4], [5, -3, 3], [6, -2 / 3, 0.5], [2, -2, 5], [4, 1.5], [1, -3, 0, 4], [1, 1, 3], [1, 2], [6, -2.5, 4 / 3], [2, -2, 4], [-1.5, 1, 5], [-0.5, -4, 2], [2, 3], [-5, -1, 6],
    [-1, 1, 5], [5, -4, 0], [2, 3, 4], [9, -4 / 3, 4 / 3], [3, -2, 1 / 3], [1, -2, 0, 5], [4, 0.5], [2, 4.5], [49, -6 / 7, 6 / 7], [-6, -5, 4 / 3], [4, -6, 0, 0.25], [3, 0, 4], [-1, -4, 5], [2, -3, 1.5], [6, -1 / 3, 2.5],
    [2, -1, 3], [-1, -4, 1], [0.5, 2], [10, -0.6, 1.5], [2, -2, 0.5, 2], [2, 2, 6], [-2, -5, 1], [2, -0.5, 3], [-1.5, -4], [-5, -1, 2], [-2, 20, 50], [1, -3, 7], [-0.5, -2, 6], [-3, -2, 0.8], [2, -1, 4], [4, -1.5, 1.5],
    [6, -1.5, 5 / 3], [3, 2, 8], [1, 5, 6], [25, -0.4, 0.4], [2, -5, 1.5], [1, -4, 0, 3], [9, 5 / 3], [-2, -3.5, 0], [1, -7, 3], [-4, -2, 2], [3, -1 / 3, 2], [-1, -5, 1], [2, -6, 2], [-0.75, 0, 8], [12, -2 / 3, 0.25],
    [-5, 0, 4], [2, -2.5, 3], [4, -1, 5], [2, -3, 0.5], [0.5, -1, 7], [3, -2, 5 / 3]];
  function fresh(a, zs) { var Z0 = uniq(zs); return !SEEN.some(function (L) { return same(L[0], a) && setEq(L.slice(1), Z0); }); }
  function freshZ(zs) { var Z0 = uniq(zs); return !SEEN.some(function (L) { return setEq(L.slice(1), Z0); }); }
  function eqT(tex, rhs) { return t(tex + '=' + (rhs == null ? '0' : rhs)); }
  function sgn(r) { return r.chance(0.5) ? 1 : -1; }
  /* cands for zeros of factors: signs flipped, m/n, the coefficient ignored */
  function zeroCands(fs, k) {
    var Z0 = zerosOf(fs), c = [[Z0.map(function (x) { return -x; }), LID + '-sign', 'Set each factor equal to ' + t('0') + ': ' + t('(' + linTex(fs[0][0] || 1, fs[0][1]) + ')=0') + ' gives ' + t('x=' + rT(-fs[0][1] / fs[0][0])) + ' (check the sign).']];
    var lin = fs.map(F1).filter(function (f) { return Math.abs(f.f[0]) !== 1 && f.f[1] !== 0; });
    if (lin.length) {
      c.push([fs.map(F1).map(function (f) { return Math.abs(f.f[0]) !== 1 && f.f[1] !== 0 ? -f.f[0] / f.f[1] : -f.f[1] / f.f[0]; }), LID + '-recip', t('(' + linTex(lin[0].f[0], lin[0].f[1]) + ')=0') + ' gives ' + t(lin[0].f[0] + 'x=' + nT(-lin[0].f[1])) + ', so ' + t('x=' + rT(-lin[0].f[1] / lin[0].f[0])) + ': divide by ' + t(lin[0].f[0]) + '.']);
      c.push([fs.map(F1).map(function (f) { return -f.f[1]; }), LID + '-coef', 'Solve each factor fully: ' + t('(' + linTex(lin[0].f[0], lin[0].f[1]) + ')=0') + ' means ' + t(lin[0].f[0] + 'x=' + nT(-lin[0].f[1])) + ', then divide by ' + t(lin[0].f[0]) + '.']);
    }
    if (k != null && !same(Math.abs(k), 1)) c.push([[k].concat(Z0), LID + '-const', 'The constant factor ' + t(nT(k)) + ' is never ' + t('0') + ', so it gives no zero.']);
    return c;
  }
  function facLine(q) { return t(q.fac + '=0'); }
  /* decomposition line for (m1 x + n1)(m2 x + n2) */
  function decompLine(f1, f2) { var a = f1[0] * f2[0], c = f1[1] * f2[1], p1 = f1[0] * f2[1], p2 = f2[0] * f1[1]; return t('ac=' + nT(a * c)) + ': ' + t(nT(p1)) + ' and ' + t(nT(p2)) + ' (product ' + t(nT(a * c)) + ', sum ' + t(nT(p1 + p2)) + ')'; }
  function zeroSolve(fs) { return fs.map(F1).filter(function (f) { return true; }).map(function (f) { return isX(f.f) ? t('x=0') : t(linTex(f.f[0], f.f[1]) + '=0') + ' gives ' + t('x=' + rT(-f.f[1] / f.f[0])); }).join('; '); }

  /* a quadratic (m1 x + n1)(m2 x + n2) with small integers; o.m1, o.m2 the leading coefficients */
  function binPair(r, o) {
    return pickWhere(function () {
      var m1 = r.pick(o.m1), m2 = r.pick(o.m2), n1 = nz(r, -o.n, o.n), n2 = nz(r, -o.n, o.n);
      return { f1: [m1, n1], f2: [m2, n2] };
    }, function (p) {
      var f1 = p.f1, f2 = p.f2, cs = expand(1, [f1, f2]);
      if (gcd(f1[0], f1[1]) !== 1 || gcd(f2[0], f2[1]) !== 1) return false;
      if (same(-f1[1] / f1[0], -f2[1] / f2[0]) || same(cs[1], 0)) return false;
      if (o.notInt && (Math.abs(f1[0]) === 1 || Math.abs(f1[1]) % f1[0] === 0)) return false;
      if (Math.abs(cs[2]) > (o.cmax || 30) || Math.abs(cs[1]) > (o.bmax || 30)) return false;
      if (o.okf && !o.okf(p, cs)) return false;
      return fresh(cs[0], zerosOf([f1, f2]));
    });
  }

  var QUESTIONS = [
    { num: '1', shared: function (r) {
        return pickWhere(function () { var a = r.pick([-1, -1, 1]), r1 = r.int(-5, 4), dd = r.pick([1, 2, 3]); return { a: a, r1: r1, r2: r1 + 2 * dd, d: dd }; },
          function (o) { var c = o.a * o.r1 * o.r2; return o.r1 !== 0 && o.r2 !== 0 && Math.abs(c) <= 10 && fresh(o.a, [o.r1, o.r2]) && o.r2 <= 6; });
      },
      stem: function (o) {
        var q = quad(o.a, [[1, -o.r1], [1, -o.r2]]), h = (o.r1 + o.r2) / 2, k = q.f(h), c = q.cs[2];
        return 'The graph of ' + t('y=' + q.tex) + ' is shown. The marked points have integer coordinates.' + X.graphFig([{ f: q.f }], [{ x: o.r1, y: 0 }, { x: o.r2, y: 0 }, { x: h, y: k }, { x: 0, y: c }]);
      },
      parts: [
        { id: '1a', level: 'BEG', make: function (r, o) {
          var h = (o.r1 + o.r2) / 2, k = -o.a * o.d * o.d;
          return X.fields('State whether it opens up or down, and the vertex.', [X.dirSpec(o.a > 0), { label: 'Vertex', pt: [h, k], cands: [[[k, h], LID + '-swap', 'Write the ' + t('x') + '-coordinate first: ' + t('(x,\\ y)') + '.'], [[h, -k], LID + '-vertex-y', 'Read the vertex’s ' + t('y') + '-value again: it is ' + (k > 0 ? 'above' : 'below') + ' the ' + t('x') + '-axis.']] }],
            { sol: t('a=' + o.a) + (o.a > 0 ? '>0' : '<0') + ': it opens ' + (o.a > 0 ? 'up' : 'down') + '. The vertex is the turning point, ' + t(ptTex(h, k)) + '.', hints: ['Look at the sign of ' + t('a') + ' (the coefficient of ' + t('x^{2}') + ').', 'The vertex is the turning point of the graph.'], text: 'graph: direction and vertex' });
        } },
        { id: '1b', level: 'BEG', make: function (r, o) {
          var h = (o.r1 + o.r2) / 2, k = -o.a * o.d * o.d, c = o.a * o.r1 * o.r2;
          return X.fields('State the axis of symmetry and the maximum or minimum value.', [{ label: 'Axis of symmetry', axis: h, q: k }, { label: 'Max or min?', mm: o.a > 0 ? 'min' : 'max' },
            { label: 'Value', ans: k, cands: [[h, 'u5l3-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex. The ' + (o.a > 0 ? 'minimum' : 'maximum') + ' value is its ' + t('y') + '-coordinate.'], [c, LID + '-maxval', 'That is the ' + t('y') + '-intercept. The ' + (o.a > 0 ? 'minimum' : 'maximum') + ' value is at the vertex.']] }],
            { sol: 'The axis is the vertical line through the vertex: ' + t('x=' + nT(h)) + ' (halfway between the ' + t('x') + '-intercepts: ' + t('\\frac{' + o.r1 + '+' + (o.r2 < 0 ? '(' + o.r2 + ')' : o.r2) + '}{2}=' + nT(h)) + ').<br>It opens ' + (o.a > 0 ? 'up, so the vertex is the lowest point: minimum' : 'down, so the vertex is the highest point: maximum') + ' value ' + t(nT(k)) + '.',
              hints: ['The axis of symmetry is the vertical line ' + t('x=\\ldots') + ' through the vertex.'], text: 'graph: axis and max/min' });
        } },
        { id: '1c', level: 'BEG', make: function (r, o) {
          var c = o.a * o.r1 * o.r2, k = -o.a * o.d * o.d;
          return X.fields('State the ' + t('x') + '-intercepts and the ' + t('y') + '-intercept.', [X.rootsSpec(t('x') + '-intercepts', { vals: [o.r1, o.r2], what: t('x') + '-intercepts', cands: [[[-o.r1, -o.r2], LID + '-sign', 'Read the graph again: where does it cross the ' + t('x') + '-axis?']] }),
            { label: t('y') + '-intercept', name: 'y-intercept', ans: c, cands: [[k, LID + '-yint-vertex', 'That is the vertex. The ' + t('y') + '-intercept is where the graph crosses the ' + t('y') + '-axis.'], [-c, LID + '-yint', 'Check the sign: substitute ' + t('x=0') + '.']] }],
            { sol: 'The graph crosses the ' + t('x') + '-axis at ' + andT([o.r1, o.r2]) + ' and the ' + t('y') + '-axis at ' + t(nT(c)) + ' (the constant term).', hints: ['The ' + t('x') + '-intercepts are where ' + t('y=0') + '; the ' + t('y') + '-intercept is where ' + t('x=0') + '.'], text: 'graph: intercepts' });
        } },
        { id: '1d', level: 'BEG', make: function (r, o) {
          var q = quad(o.a, [[1, -o.r1], [1, -o.r2]]);
          return X.fields('State the zeros of the function and the roots of ' + eqT(q.tex) + '.', [X.rootsSpec('Zeros of the function', { vals: [o.r1, o.r2], what: 'zeros' }), X.rootsSpec('Roots of the equation', { vals: [o.r1, o.r2], what: 'roots' })],
            { sol: 'The zeros of the function, the roots of ' + eqT(q.tex) + ' and the ' + t('x') + '-intercepts are the same numbers: ' + andT([o.r1, o.r2]) + '.', hints: ['Zeros of ' + t('f') + ' = ' + t('x') + '-intercepts of its graph = roots of ' + t('f(x)=0') + '.'], text: 'zeros = roots = x-intercepts' });
        } }] },

    { num: '2', stem: 'Find the roots of each equation.', parts: [
      { id: '2a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(2, 9), m: nz(r, -9, 9) }; }, function (z0) { return freshZ([0, -z0.m]) && z0.k !== Math.abs(z0.m); });
        var sp = { vals: [0, -o.m], cands: [[[0, o.m], LID + '-sign', t('x' + sT(o.m) + '=0') + ' gives ' + t('x=' + nT(-o.m)) + '.'], [[o.k, -o.m], LID + '-const', 'The factor ' + t(o.k) + ' is never ' + t('0') + '; the factor ' + t('x') + ' gives ' + t('x=0') + '.']] };
        return X.rootsPart(eqT(o.k + 'x(x' + sT(o.m) + ')'), sp, t(o.k + '\\ne 0') + ', so ' + t('x=0') + ' or ' + t('x' + sT(o.m) + '=0') + ': ' + orT(sp.vals) + '.', HF, 'roots: kx(x + m) = 0');
      } },
      { id: '2b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(2, 5), r1: nz(r, -7, 7), r2: nz(r, -7, 7) }; }, function (z0) { return z0.r1 < z0.r2 && z0.r1 + z0.r2 !== 0 && Math.abs(z0.k * z0.r1 * z0.r2) <= 90 && fresh(z0.k, [z0.r1, z0.r2]); });
        var q = quad(o.k, [[1, -o.r1], [1, -o.r2]]), inner = polyTex(expand(1, [[1, -o.r1], [1, -o.r2]]));
        var sp = { vals: [o.r1, o.r2], cands: zeroCands([[1, -o.r1], [1, -o.r2]], o.k) };
        return X.rootsPart(eqT(q.tex), sp, t(o.k + '(' + inner + ')=0') + '<br>' + facLine(q) + '<br>' + orT(sp.vals) + '.', HF.concat(['Take out the common factor ' + t(o.k) + ' first.']), 'roots: common factor, then trinomial');
      } },
      { id: '2c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 9), n: r.int(1, 11) }; }, function (z0) { return gcd(z0.m, z0.n) === 1 && z0.n !== 1 && freshZ([z0.n / z0.m, -z0.n / z0.m]); });
        var R0 = o.n / o.m, sp = { vals: [-R0, R0], cands: [[[-o.m / o.n, o.m / o.n], LID + '-recip', t(o.m + 'x=' + o.n) + ' gives ' + t('x=\\frac{' + o.n + '}{' + o.m + '}') + '.'], [[-R0 * R0, R0 * R0], LID + '-noroot', 'Take the square root: ' + t(o.m * o.m + 'x^{2}=' + o.n * o.n) + ' gives ' + t('x^{2}=' + rT(R0 * R0)) + ', so ' + t('x=\\pm' + rT(R0)) + '.'], [[-o.n, o.n], LID + '-coef', 'Solve each factor fully: ' + t(o.m + 'x=' + o.n) + ', then divide by ' + t(o.m) + '.']] };
        return X.rootsPart(eqT(o.m * o.m + 'x^{2}-' + o.n * o.n), sp, 'A difference of squares: ' + t('(' + o.m + 'x-' + o.n + ')(' + o.m + 'x+' + o.n + ')=0') + '<br>' + t('x=\\pm' + rT(R0)), HF.concat(['Is it a difference of squares?']), 'roots: difference of squares');
      } },
      { id: '2d', level: 'PRG', make: function (r) {
        var p = binPair(r, { m1: [2, 3, 5], m2: [1], n: 7, cmax: 30, okf: function (pp, cs) { return !same(cs[2], 0); } }), q = quad(1, [p.f1, p.f2]), C = -q.cs[2];
        var lhs = polyTex([q.cs[0], q.cs[1], 0]), sp = { vals: q.zeros, cands: zeroCands([p.f1, p.f2]).concat([[[C, (C - q.cs[1]) / q.cs[0]], LID + '-zp-not0', 'You can only set each factor equal to ' + t('0') + ' when the other side is ' + t('0') + '. Move ' + t(nT(C)) + ' to the left side first.']]) };
        return X.rootsPart(eqT(lhs, nT(C)), sp, t(q.tex + '=0') + '; ' + decompLine(p.f1, p.f2) + '<br>' + facLine(q) + '<br>' + orT(q.zeros) + '.', HF, 'roots: rearrange, then decomposition');
      } },
      { id: '2e', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { r1: nz(r, -7, 7), r2: nz(r, -7, 7) }; }, function (z0) { return z0.r1 < z0.r2 && z0.r1 + z0.r2 !== 0 && Math.abs(z0.r1 * z0.r2) <= 40 && freshZ([0, z0.r1, z0.r2]); });
        var S = o.r1 + o.r2, P0 = o.r1 * o.r2, lhs = polyTex([1, -S, 0, 0]), rhs = polyTex([-P0, 0]);
        var sp = { vals: [0, o.r1, o.r2], cands: [[[o.r1, o.r2], LID + '-lost0', 'Dividing both sides by ' + t('x') + ' loses the root ' + t('x=0') + '. Move every term to one side and take out the common factor ' + t('x') + '.'], [[0, -o.r1, -o.r2], LID + '-sign', 'Check the signs of the zeros from ' + t('(x' + sT(-o.r1) + ')') + ' and ' + t('(x' + sT(-o.r2) + ')') + '.']] };
        return X.rootsPart(eqT(lhs, rhs), sp, t(polyTex([1, -S, P0, 0]) + '=0') + ' (never divide by ' + t('x') + ')<br>' + t('x(x' + sT(-o.r1) + ')(x' + sT(-o.r2) + ')=0') + '<br>' + orT(sp.vals) + '.', HF.concat(['Take out the common factor ' + t('x') + ': it gives a root too.']), 'roots: a cubic, common factor x');
      } },
      { id: '2f', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 6), n: r.int(1, 7), s: sgn(r) }; }, function (z0) { return gcd(z0.m, z0.n) === 1 && freshZ([z0.s * z0.n / z0.m]); });
        var R0 = o.s * o.n / o.m, A = o.m * o.m, C = o.n * o.n, Bm = 2 * o.m * o.n;
        var eq = o.s > 0 ? t(A + 'x^{2}+' + C + '=' + Bm + 'x') : t(A + 'x^{2}+' + Bm + 'x=-' + C);
        var sp = { vals: [R0], cands: [[[-R0, R0], LID + '-dbl', 'A perfect square ' + t('(' + linTex(o.m, -o.s * o.n) + ')^{2}=0') + ' has only one root (a double root): ' + t(linTex(o.m, -o.s * o.n) + '=0') + '.'], [[-R0], LID + '-sign', 'Check the sign: ' + t(linTex(o.m, -o.s * o.n) + '=0') + ' gives ' + t('x=' + rT(R0)) + '.']] };
        return X.rootsPart(eq, sp, t(polyTex([A, -o.s * Bm, C]) + '=0') + '<br>' + t('(' + linTex(o.m, -o.s * o.n) + ')^{2}=0') + '<br>' + t('x=' + rT(R0)) + ' (a double root)', HF.concat(['Is the trinomial a perfect square?']), 'roots: perfect square (double root)');
      } }] },

    { num: '3', stem: 'Find the zeros of each function.', parts: [
      { id: '3a', level: 'LIM', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 9), n: nz(r, -15, 15) }; }, function (z0) { return gcd(z0.m, z0.n) === 1 && !(z0.m === 2 && z0.n === 9) && Math.abs(z0.n) !== 1; });
        var Z0 = o.n / o.m;
        return X.rootsPart(t('f(x)=' + linTex(o.m, -o.n)), { vals: [Z0], what: 'zeros', cands: [[[-Z0], LID + '-sign', 'Solve ' + t(linTex(o.m, -o.n) + '=0') + ': ' + t(o.m + 'x=' + o.n) + '.'], [[o.m / o.n], LID + '-recip', t(o.m + 'x=' + o.n) + ' gives ' + t('x=\\frac{' + o.n + '}{' + o.m + '}') + ' (divide by ' + t(o.m) + ').']] },
          t(linTex(o.m, -o.n) + '=0') + '<br>' + t(o.m + 'x=' + nT(o.n)) + '<br>' + t('x=' + rT(Z0)), ['Set ' + t('f(x)=0') + ' and solve.'], 'zero of a linear function');
      } },
      { id: '3b', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 9), n: r.int(1, 11) }; }, function (z0) { return gcd(z0.m, z0.n) === 1 && z0.n !== 1 && freshZ([z0.n / z0.m, -z0.n / z0.m]); });
        var R0 = o.n / o.m;
        return X.rootsPart(t('g(x)=' + o.m * o.m + 'x^{2}-' + o.n * o.n), { vals: [-R0, R0], what: 'zeros', cands: [[[-o.m / o.n, o.m / o.n], LID + '-recip', t(o.m + 'x=' + o.n) + ' gives ' + t('x=\\frac{' + o.n + '}{' + o.m + '}') + '.'], [[-R0 * R0, R0 * R0], LID + '-noroot', 'Factor as a difference of squares (or take the square root): ' + t('x=\\pm' + rT(R0)) + '.']] },
          t('(' + o.m + 'x-' + o.n + ')(' + o.m + 'x+' + o.n + ')=0') + '<br>Zeros ' + t('\\pm' + rT(R0)), HZ, 'zeros: difference of squares');
      } },
      { id: '3c', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { k: nz(r, -5, 5), m: r.int(2, 6), n: nz(r, -9, 9), s: nz(r, -8, 8) }; }, function (z0) { return Math.abs(z0.k) > 1 && gcd(z0.m, z0.n) === 1 && Math.abs(z0.n) !== 1 && freshZ([z0.n / z0.m, -z0.s]) && !same(z0.n / z0.m, -z0.s); });
        var fs = [[o.m, -o.n], [1, o.s]], Z0 = zerosOf(fs);
        return X.rootsPart(t('h(x)=' + facTex(o.k, fs)), { vals: Z0, what: 'zeros', cands: zeroCands(fs, o.k) }, t(o.k + '\\ne 0') + ', so ' + zeroSolve(fs) + '.<br>Zeros ' + andT(Z0) + '.', HZ.concat(['A constant factor is never ' + t('0') + '.']), 'zeros from factored form');
      } },
      { id: '3d', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { s: nz(r, -8, 8), m: r.int(2, 7), n: nz(r, -5, 5) }; }, function (z0) { return gcd(z0.m, z0.n) === 1 && freshZ([0, -z0.s, z0.n / z0.m]); });
        var fs = [[1, 0], [1, o.s], [o.m, -o.n]], Z0 = zerosOf(fs);
        return X.rootsPart(t('P(x)=' + facTex(1, fs)), { vals: Z0, what: 'zeros', cands: zeroCands(fs).concat([[[-o.s, o.n / o.m], LID + '-lost0', 'The factor ' + t('x') + ' gives the zero ' + t('0') + ' too.']]) }, zeroSolve(fs) + '.<br>Zeros ' + andT(Z0) + '.', HZ, 'zeros of a product of three factors');
      } }] },

    { num: '4', stem: 'For each function, determine (i) the zeros and (ii) the ' + t('y') + '-intercept of its graph.', parts: [
      { id: '4a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { k: r.pick([2, 3, 4, 5, 6, -2, -3]), m: nz(r, -9, 9) }; }, function (z0) { return freshZ([0, z0.m]) && Math.abs(z0.m) !== Math.abs(z0.k); });
        var cs = [o.k, -o.k * o.m, 0];
        return X.fields(t('f(x)=' + polyTex(cs)), [X.rootsSpec('(i) Zeros', { vals: [0, o.m], what: 'zeros', cands: [[[0, -o.m], LID + '-sign', t('x' + sT(-o.m) + '=0') + ' gives ' + t('x=' + o.m) + '.'], [[o.m], LID + '-lost0', 'The common factor ' + t(o.k + 'x') + ' gives the zero ' + t('0') + '.']] }),
          { label: '(ii) ' + t('y') + '-intercept', name: 'y-intercept', ans: 0, cands: [[o.k, LID + '-yint', t('f(0)=' + o.k + '(0)^{2}' + sT(-o.k * o.m) + '(0)=0') + '.'], [-o.k * o.m, LID + '-yint', 'Substitute ' + t('x=0') + ' into every term: ' + t('f(0)=0') + '.']] }],
          { sol: '(i) ' + t(o.k + 'x(x' + sT(-o.m) + ')=0') + ': zeros ' + andT([0, o.m]) + '.<br>(ii) ' + t('f(0)=0') + '.', hints: HZ.concat(HY), text: 'zeros and y-intercept: common factor kx' });
      } },
      { id: '4b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { r1: nz(r, -8, 8), r2: nz(r, -8, 8) }; }, function (z0) { return z0.r1 < z0.r2 && z0.r1 + z0.r2 !== 0 && Math.abs(z0.r1 * z0.r2) <= 40 && fresh(-1, [z0.r1, z0.r2]); });
        var q = quad(-1, [[1, -o.r1], [1, -o.r2]]), c = q.cs[2];
        return X.fields(t('f(x)=' + q.tex), [X.rootsSpec('(i) Zeros', { vals: q.zeros, what: 'zeros', cands: zeroCands([[1, -o.r1], [1, -o.r2]]) }),
          { label: '(ii) ' + t('y') + '-intercept', name: 'y-intercept', ans: c, cands: [[-c, LID + '-yint', 'The ' + t('y') + '-intercept is the constant term, with its sign: ' + t('f(0)=' + nT(c)) + '.']] }],
          { sol: '(i) ' + t('-(' + polyTex(expand(1, [[1, -o.r1], [1, -o.r2]])) + ')=' + q.fac + '=0') + ': zeros ' + andT(q.zeros) + '.<br>(ii) ' + t('f(0)=' + nT(c)) + '.', hints: ['Take out ' + t('-1') + ' first so the ' + t('x^{2}') + ' term is positive.'].concat(HY), text: 'zeros and y-intercept: a = −1' });
      } },
      { id: '4c', level: 'EMG', make: function (r) {
        var p = binPair(r, { m1: [2, 3, 5], m2: [1], n: 8, notInt: true }), q = quad(1, [p.f1, p.f2]), c = q.cs[2];
        return X.fields(t('f(x)=' + q.tex), [X.rootsSpec('(i) Zeros', { vals: q.zeros, what: 'zeros', cands: zeroCands([p.f1, p.f2]) }), { label: '(ii) ' + t('y') + '-intercept', name: 'y-intercept', ans: c, cands: [[-c, LID + '-yint', 'Check the sign of the constant term.']] }],
          { sol: '(i) ' + decompLine(p.f1, p.f2) + '; ' + facLine(q) + ': zeros ' + andT(q.zeros) + '.<br>(ii) ' + t('f(0)=' + nT(c)) + '.', hints: HZ.concat(HY), text: 'zeros and y-intercept: a ≠ 1' });
      } },
      { id: '4d', level: 'PRG', make: function (r) {
        var p = binPair(r, { m1: [2, 3], m2: [2, 3, 4, 5], n: 7, notInt: true, okf: function (pp) { var g = pp.f2; return pp.f1[0] * g[0] >= 6 && Math.abs(g[0]) !== 1 && Math.abs(g[1]) % g[0] !== 0 && pp.f1[0] !== g[0]; } }), q = quad(1, [p.f1, p.f2]), c = q.cs[2];
        return X.fields(t('f(x)=' + q.tex), [X.rootsSpec('(i) Zeros', { vals: q.zeros, what: 'zeros', cands: zeroCands([p.f1, p.f2]) }), { label: '(ii) ' + t('y') + '-intercept', name: 'y-intercept', ans: c, cands: [[-c, LID + '-yint', 'Check the sign of the constant term.']] }],
          { sol: '(i) ' + decompLine(p.f1, p.f2) + '; ' + facLine(q) + ': zeros ' + andT(q.zeros) + '.<br>(ii) ' + t('f(0)=' + nT(c)) + '.', hints: HZ.concat(['Decomposition: find two numbers with product ' + t('ac') + ' and sum ' + t('b') + '.']), text: 'zeros and y-intercept: decomposition' });
      } }] },

    { num: '5', stem: 'The graph of each quadratic function is shown. The marked points have integer coordinates. State the zeros and the ' + t('y') + '-intercept, then write the function in factored form.', parts: [
      { id: '5a', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3, -2, -3]), r1: nz(r, -4, 3), r2: nz(r, -3, 4) }; }, function (z0) { var c = z0.a * z0.r1 * z0.r2, h = (z0.r1 + z0.r2) / 2, k = z0.a * (h - z0.r1) * (h - z0.r2); return z0.r1 < z0.r2 && Math.abs(c) <= 12 && Math.abs(k) <= 14 && fresh(z0.a, [z0.r1, z0.r2]); });
        return graphFac(r, o.a, [o.r1, o.r2], 'graph: zeros, y-intercept, factored form');
      } },
      { id: '5b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([-1, -1, 1]), r1: nz(r, -6, 2), r2: nz(r, -2, 6) }; }, function (z0) { var c = z0.a * z0.r1 * z0.r2, h = (z0.r1 + z0.r2) / 2, k = z0.a * (h - z0.r1) * (h - z0.r2); return z0.r1 < z0.r2 && Math.abs(c) <= 12 && Math.abs(k) <= 12 && fresh(z0.a, [z0.r1, z0.r2]); });
        return graphFac(r, o.a, [o.r1, o.r2], 'graph: zeros, y-intercept, factored form (a = ±1)');
      } },
      { id: '5c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([0.5, -0.5, 2, -2, 0.25, -0.25]), s: nz(r, -4, 4) }; }, function (z0) { var c = z0.a * z0.s * z0.s; return Number.isInteger(c) && Math.abs(c) <= 9 && fresh(z0.a, [z0.s]); });
        return graphFac(r, o.a, [o.s], 'graph: double zero, factored form');
      } }] },

    { num: '6', stem: 'State the number of ' + t('x') + '-intercepts of each parabola, and explain.', parts: [
      { id: '6a', level: 'BEG', make: function (r) { var p = nz(r, -6, 6), q = r.int(1, 9); if (p === -2 && q === 5) q = 6; return z().countMC(r, 'It opens up; its vertex is ' + t(ptTex(p, q)) + '.', 1, p, q); } },
      { id: '6b', level: 'BEG', make: function (r) { var p = nz(r, -6, 6), q = r.int(1, 9); if (p === 4 && q === 1) q = 2; return z().countMC(r, 'It opens down; its vertex is ' + t(ptTex(p, q)) + '.', -1, p, q); } },
      { id: '6c', level: 'BEG', make: function (r) { var p = nz(r, -7, 7); if (p === 3) p = 4; return z().countMC(r, 'Its vertex is ' + t(ptTex(p, 0)) + '.', r.chance(0.5) ? 1 : -1, p, 0); } },
      { id: '6d', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var a = r.pick([-1, -2, -3, 1, 2, 4]); return { a: a, q: (a > 0 ? 1 : -1) * r.int(1, 16) }; }, function (z0) { return !(z0.a === -1 && z0.q === -9) && !(z0.a === 1 && z0.q === 5); });
        var p = z().countMC(r, t('y=' + aTex(o.a) + 'x^{2}' + sT(o.q)), o.a, 0, o.q);
        p.solution = t(aTex(o.a) + 'x^{2}') + (o.a > 0 ? '\\(\\ge 0\\), so ' + t('y\\ge ' + o.q) + ' is never ' + t('0') : '\\(\\le 0\\), so ' + t('y\\le ' + o.q) + ' is never ' + t('0')) + ': ' + t(aTex(o.a) + 'x^{2}' + sT(o.q) + '=0') + ' has no real roots, <b>0</b> ' + t('x') + '-intercepts. (The vertex ' + t(ptTex(0, o.q)) + ' is ' + (o.q > 0 ? 'above' : 'below') + ' the axis and it opens ' + (o.a > 0 ? 'up' : 'down') + '.)';
        return p;
      } }] },

    { num: '7', stem: 'Use a graphing calculator.', parts: [
      { id: '7a', level: 'PRG', make: function (r) {
        var p = binPair(r, { m1: [2, 4, 5], m2: [2, 5, 4], n: 9, notInt: true, cmax: 40, bmax: 40, okf: function (pp) { var g = pp.f2; return pp.f1[0] !== g[0] && Math.abs(g[1]) % g[0] !== 0 && pp.f1[0] * g[0] <= 20; } });
        var q = quad(1, [p.f1, p.f2]);
        return X.fields('Find the exact zeros of ' + t('f(x)=' + q.tex) + ' and write ' + t('f(x)') + ' in factored form.', [X.rootsSpec('Zeros', { vals: q.zeros, what: 'zeros', cands: zeroCands([p.f1, p.f2]) }), X.facSpec('Factored form', 1, [p.f1, p.f2], facWrongs(1, [p.f1, p.f2]), { before: t('f(x)=') })],
          { sol: 'Calculator (2nd CALC zero): ' + t('x=' + nT(q.zeros[0])) + ' and ' + t('x=' + nT(q.zeros[1])) + ', i.e. ' + andT(q.zeros) + '.<br>A zero ' + t('\\frac{m}{n}') + ' gives the factor ' + t('(nx-m)') + ': ' + t('f(x)=' + q.fac) + '.<br>Check: it expands to ' + t(q.tex) + ' ✓',
            hints: ['Graph it, then use 2nd CALC 2:zero for each ' + t('x') + '-intercept. A decimal like ' + t('0.4') + ' is ' + t('\\frac{2}{5}') + '.', 'A zero ' + t('\\frac{m}{n}') + ' gives a factor ' + t('(nx-m)') + '. Expand to check the leading coefficient.'], text: 'calculator: exact zeros and factored form' });
      } },
      { id: '7b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var m = r.pick([2, 3, 4, 5]); return { m: m, n: nz(r, -5, 5), r1: nz(r, -4, 4), r2: nz(r, -4, 4) }; }, function (z0) {
          var fs = [[z0.m, -z0.n], [1, -z0.r1], [1, -z0.r2]], cs = expand(1, fs);
          return gcd(z0.m, z0.n) === 1 && Math.abs(z0.n) % z0.m !== 0 && z0.r1 < z0.r2 && cs.every(function (c) { return Math.abs(c) <= 60; }) && !same(cs[1], 0) && freshZ(zerosOf(fs)); });
        var fs = [[o.m, -o.n], [1, -o.r1], [1, -o.r2]], q = quad(1, fs), Z0 = q.zeros;
        return X.fields('Find the exact zeros of ' + t('g(x)=' + q.tex) + ' and write ' + t('g(x)') + ' in factored form.', [X.rootsSpec('Zeros', { vals: Z0, what: 'zeros', cands: zeroCands(fs) }), X.facSpec('Factored form', 1, fs, facWrongs(1, fs), { before: t('g(x)=') })],
          { sol: 'Calculator: ' + Z0.map(function (x) { return t('x=' + (toFrac(x)[1] === 1 || terminates(toFrac(x)) ? nT(x) : nT(Math.round(x * 10000) / 10000) + '\\ldots')); }).join(', ') + ', i.e. ' + andT(Z0) + '.<br>Factors ' + fs.map(function (f) { return t('(' + linTex(f[0], f[1]) + ')'); }).join(', ') + ': ' + t('g(x)=' + q.fac) + ' (it expands to ' + t(q.tex) + ' ✓).',
            hints: ['Graph it and find all three ' + t('x') + '-intercepts with 2nd CALC zero.', 'Each zero ' + t('r') + ' gives a factor ' + t('(x-r)') + '; the fraction ' + t('\\frac{m}{n}') + ' gives ' + t('(nx-m)') + '. Check the leading coefficient.'], text: 'calculator: cubic, exact zeros and factored form' });
      } },
      { id: '7c', level: 'PRG', make: function (r) {
        function mk(neg) { return pickWhere(function () { return { a: neg ? r.pick([-1, -2]) : r.pick([1, 2, 3]), b: nz(r, -7, 7), c: nz(r, -9, 9) }; }, function (z0) { var D = z0.b * z0.b - 4 * z0.a * z0.c, s = Math.round(Math.sqrt(Math.max(D, 0))); return D > 0 && s * s !== D && !(z0.a === 2 && z0.b === 5 && z0.c === -4) && !(z0.a === -1 && z0.b === 4 && z0.c === 7) && !(z0.a === 1 && z0.b === -3 && z0.c === -5); }); }
        var A = mk(false), Bq = mk(true);
        function roots(o) { var D = Math.sqrt(o.b * o.b - 4 * o.a * o.c), x1 = (-o.b - D) / (2 * o.a), x2 = (-o.b + D) / (2 * o.a); return [Math.min(x1, x2), Math.max(x1, x2)]; }
        var RA = roots(A), RB = roots(Bq), ta = polyTex([A.a, A.b, A.c]), tb = polyTex([Bq.a, Bq.b, Bq.c]);
        return X.fields('Find the zeros of each function to the nearest hundredth.', [
          { label: t('y=' + ta) + ': ' + t('x\\approx'), name: 'First function, smaller zero', dp: 2, ans: RA[0] }, { label: 'and ' + t('x\\approx'), name: 'First function, larger zero', dp: 2, ans: RA[1] },
          { label: t('y=' + tb) + ': ' + t('x\\approx'), name: 'Second function, smaller zero', dp: 2, ans: RB[0] }, { label: 'and ' + t('x\\approx'), name: 'Second function, larger zero', dp: 2, ans: RB[1] }],
          { swap: [[0, 1], [2, 3]], sol: t('y=' + ta) + ': ' + t('x\\approx ' + RA[0].toFixed(2)) + ' and ' + t('x\\approx ' + RA[1].toFixed(2)) + '.<br>' + t('y=' + tb) + ': ' + t('x\\approx ' + RB[0].toFixed(2)) + ' and ' + t('x\\approx ' + RB[1].toFixed(2)) + '.<br>(These zeros are not rational, so these functions don’t factor over the integers.)',
            hints: ['Graph each function; adjust the WINDOW until both ' + t('x') + '-intercepts show, then use 2nd CALC 2:zero for each one.'], text: 'calculator: zeros to the nearest hundredth' });
      } }] },

    { num: '8', stem: 'Write each quadratic function in factored form, then in general form.', parts: [
      { id: '8a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3, -2, -3, -1, 4]), r1: nz(r, -6, 6), r2: nz(r, -6, 6), x1: nz(r, -5, 5) }; }, function (z0) {
          return z0.r1 < z0.r2 && z0.x1 !== z0.r1 && z0.x1 !== z0.r2 && Math.abs(z0.a * (z0.x1 - z0.r1) * (z0.x1 - z0.r2)) <= 40 && fresh(z0.a, [z0.r1, z0.r2]); });
        return fromZeros(o.a, [[1, -o.r1], [1, -o.r2]], o.x1, 'zeros ' + t(o.r1) + ' and ' + t(o.r2) + '; passes through ', 'from zeros and a point');
      } },
      { id: '8b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3, -2, -3, -1, 5, -4]), r1: nz(r, -6, 6), r2: nz(r, -6, 6) }; }, function (z0) { return z0.r1 < z0.r2 && Math.abs(z0.a * z0.r1 * z0.r2) <= 40 && fresh(z0.a, [z0.r1, z0.r2]); });
        return fromZeros(o.a, [[1, -o.r1], [1, -o.r2]], 0, 'zeros ' + t(o.r1) + ' and ' + t(o.r2) + '; ' + t('y') + '-intercept ', 'from zeros and the y-intercept', true);
      } },
      { id: '8c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { k: r.pick([1, 1, -1, 2, -2]), m: r.pick([2, 3]), n: nz(r, -5, 5), s: nz(r, -6, 6), x1: nz(r, -4, 4) }; }, function (z0) {
          var fs = [[z0.m, z0.n], [1, -z0.s]], y = z0.k * (z0.m * z0.x1 + z0.n) * (z0.x1 - z0.s);
          return gcd(z0.m, z0.n) === 1 && Math.abs(z0.n) % z0.m !== 0 && y !== 0 && Math.abs(y) <= 40 && fresh(z0.k * z0.m, zerosOf(fs)); });
        return fromZeros(o.k, [[o.m, o.n], [1, -o.s]], o.x1, 'zeros ' + t(rT(-o.n / o.m)) + ' and ' + t(o.s) + '; passes through ', 'from a fractional zero and a point');
      } },
      { id: '8d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([0.5, -0.5, 1.5, -1.5, 2, -2, 3, -3, 0.25, -0.75]), s: nz(r, -6, 6), dx: r.pick([-3, -2, -1, 1, 2, 3]) }; }, function (z0) { var y = z0.a * z0.dx * z0.dx; return Number.isInteger(y) && Math.abs(y) <= 30 && z0.s + z0.dx !== 0 && fresh(z0.a, [z0.s]); });
        return fromZeros(o.a, [{ f: [1, -o.s], k: 2 }], o.s + o.dx, 'a double zero at ' + t(o.s) + '; passes through ', 'from a double zero and a point');
      } }] },

    { num: '9', shared: function (r) { return pickWhere(function () { return { k: r.pick([-3, -2, -4, 2, 3, 4, -0.5, 0.5]), r1: nz(r, -6, 5), r2: nz(r, -5, 6) }; }, function (o) { return o.r1 < o.r2 && o.r1 + o.r2 !== 0 && !(o.r1 === -1 && o.r2 === 4) && Math.abs(o.r1 * o.r2) <= 20; }); },
      stem: function (o) { return 'Compare the graphs of ' + t('y=(x' + sT(-o.r1) + ')(x' + sT(-o.r2) + ')') + ' and ' + t('y=' + aTex(o.k, true) + '(x' + sT(-o.r1) + ')(x' + sT(-o.r2) + ')') + '.'; },
      parts: [
        { id: '9a', level: 'EMG', make: function (r, o) {
          var h = (o.r1 + o.r2) / 2, c1 = o.r1 * o.r2, c2 = o.k * c1;
          return X.fields('What do they have in common? State the zeros and the axis of symmetry of both, and each ' + t('y') + '-intercept.', [X.rootsSpec('Zeros (both)', { vals: [o.r1, o.r2], what: 'zeros', cands: [[[-o.r1, -o.r2], LID + '-sign', 'The factor ' + t('(x' + sT(-o.r1) + ')') + ' gives ' + t('x=' + o.r1) + '.']] }),
            { label: 'Axis of symmetry (both)', axis: h, cands: [[o.r1 + o.r2, LID + '-mid', 'The axis is <b>halfway</b> between the zeros: add them and divide by ' + t('2') + '.']] },
            { label: t('y') + '-intercept of the first', name: 'y-intercept of the first', ans: c1, cands: [[-c1, LID + '-yint', 'Substitute ' + t('x=0') + ': ' + t('(0' + sT(-o.r1) + ')(0' + sT(-o.r2) + ')') + '.']] },
            { label: t('y') + '-intercept of the second', name: 'y-intercept of the second', ans: c2, cands: [[c1, LID + '-yint', 'Multiply by ' + t(vT(o.k)) + ' too.'], [-c2, LID + '-yint', 'Check the sign.']] }],
            { sol: 'Same zeros, ' + andT([o.r1, o.r2]) + ', so the same ' + t('x') + '-intercepts and the same axis of symmetry, ' + t('x=\\frac{' + o.r1 + '+' + (o.r2 < 0 ? '(' + o.r2 + ')' : o.r2) + '}{2}=' + rT(h)) + '.<br>' + t('y') + '-intercepts: ' + t('(0' + sT(-o.r1) + ')(0' + sT(-o.r2) + ')=' + c1) + ' and ' + t(vT(o.k) + '(' + c1 + ')=' + vT(c2)) + '.',
              hints: ['Changing ' + t('a') + ' in ' + t('y=a(x-r)(x-s)') + ' keeps the zeros.'], text: 'compare: shared zeros and axis' });
        } },
        { id: '9b', level: 'EMG', make: function (r, o) {
          var down = o.k < 0, nar = Math.abs(o.k) > 1, f = Math.abs(o.k), fT = t(vT(f));
          function desc(dn, nr) { return 'The second opens <b>' + (dn ? 'down' : 'up') + '</b> (' + (dn ? 'a maximum' : 'a minimum') + ') and is <b>' + (nr ? 'narrower' : 'wider') + '</b>: a vertical stretch by a factor of ' + fT + (dn ? ' and a reflection in the ' + t('x') + '-axis' : '') + '.'; }
          var opts = [{ html: desc(down, nar), right: true }, { html: desc(!down, nar), why: 'Look at the sign of ' + t('a=' + vT(o.k)) + ': ' + (down ? 'negative, so it opens down.' : 'positive, so it opens up.'), code: LID + '-cmp' },
            { html: desc(down, !nar), why: t('|a|=' + vT(f)) + (nar ? ' is greater than 1, so the graph is narrower.' : ' is less than 1, so the graph is wider.'), code: LID + '-cmp' },
            { html: 'The second has different zeros: ' + andT([o.r1 * f, o.r2 * f].map(cl)) + '.', why: 'Multiplying by ' + t('a') + ' doesn’t change where the function is ' + t('0') + ': the zeros stay the same.', code: LID + '-cmp' }];
          return X.mc(r, 'How are the graphs different?', opts, 'The first has ' + t('a=1') + '. The second has ' + t('a=' + vT(o.k)) + ': ' + (down ? t('a<0') + ', so it opens down' : t('a>0') + ', so it opens up') + ', and ' + t('|a|' + (nar ? '>' : '<') + '1') + ', so it is ' + (nar ? 'narrower' : 'wider') + ' (stretched vertically by a factor of ' + fT + ').', ['Compare the values of ' + t('a') + ': its sign and its size.'], 'compare: how a changes the graph');
        } }] },

    { num: '10', shared: function (r) { return pickWhere(function () { return { T: r.int(2, 5), u: r.int(1, 3), who: r.pick(['diver', 'diver', 'cliff diver']) }; }, function (o) { return o.T - o.u >= 1 && !(o.T === 2 && o.u === 1); }); },
      stem: function (o) { var c = 5 * o.T * o.u, b = 5 * (o.T - o.u); return 'A ' + o.who + ' jumps from a ' + (o.who === 'diver' ? 'platform' : 'ledge') + '. Her height above the water after ' + t('t') + ' seconds is ' + t('h(t)=-5t^{2}+' + b + 't+' + c) + ' metres.'; },
      parts: [
        { id: '10a', level: 'PRG', make: function (r, o) {
          var b = 5 * (o.T - o.u);
          return X.fields('Find the zeros of ' + t('h') + '. Which one has meaning here?', [X.rootsSpec('Zeros', { vals: [-o.u, o.T], v: 't', what: 'zeros', cands: [[[o.u, -o.T], LID + '-sign', 'Check the signs: ' + t('(t' + sT(-o.T) + ')=0') + ' gives ' + t('t=' + o.T) + '.']] }),
            { label: 'She enters the water after', name: 'Time she enters the water', after: 's', ans: o.T, cands: [[-o.u, LID + '-neg-root', 'Time can’t be negative here: ' + t('t=' + (-o.u)) + ' is before she jumped.']] }],
            { vars: ['t'], sol: t('-5(t^{2}' + sT(-(o.T - o.u)).replace(/^([+-])1$/, '$1') + 't' + sT(-o.T * o.u) + ')=-5(t' + sT(-o.T) + ')(t' + sT(o.u) + ')=0') + ': zeros ' + t(o.T) + ' and ' + t(-o.u) + '.<br>Only ' + t('t=' + o.T) + ' has meaning (time is not negative): she enters the water after ' + t(o.T) + ' s.',
              hints: ['Take out the common factor ' + t('-5') + ', then factor the trinomial.', 'She reaches the water when ' + t('h(t)=0') + '.'], text: 'context: zeros and their meaning' });
        } },
        { id: '10b', level: 'BEG', make: function (r, o) {
          var c = 5 * o.T * o.u, b = 5 * (o.T - o.u), h2 = (o.T - o.u) / 2, mx = cl(-5 * h2 * h2 + b * h2 + c);
          var opts = [{ html: t('h(0)=' + c) + ': the ' + (o.who === 'diver' ? 'platform' : 'ledge') + ' is ' + t(c) + ' m above the water.', right: true },
            { html: t('h(0)=' + c) + ': she reaches the water after ' + t(c) + ' s.', why: 'The ' + t('y') + '-intercept is a <b>height</b> (the value of ' + t('h') + '), at the time ' + t('t=0') + '.', code: LID + '-mean' },
            { html: t('h(0)=' + c) + ': her greatest height is ' + t(c) + ' m.', why: 'Her greatest height is at the vertex, not at ' + t('t=0') + ' (she rises first).', code: LID + '-mean' },
            { html: t('h(0)=' + o.T) + ': she is in the air for ' + t(o.T) + ' s.', why: 'Substitute ' + t('t=0') + ': ' + t('h(0)=' + c) + '.', code: LID + '-mean' }];
          return X.mc(r, 'What does the ' + t('y') + '-intercept of the graph of ' + t('h') + ' represent?', opts, t('h(0)=-5(0)^{2}+' + b + '(0)+' + c + '=' + c) + ': at the moment she jumps (' + t('t=0') + ') she is ' + t(c) + ' m above the water, the height of the ' + (o.who === 'diver' ? 'platform' : 'ledge') + '. (Her greatest height is about ' + t(nT(mx)) + ' m.)', ['The ' + t('y') + '-intercept is ' + t('h(0)') + ': her height when ' + t('t=0') + '.'], 'context: meaning of the y-intercept');
        } },
        { id: '10c', level: 'PRG', make: function (r, o) {
          var c = 5 * o.T * o.u, b = 5 * (o.T - o.u), t2 = o.T - o.u;
          return X.num('When is she ' + t(c) + ' m above the water again?', t2, { after: 's', before: t('t='), cands: [[0, LID + '-given', t('t=0') + ' is the jump itself. Find the <b>other</b> time.'], [o.T, LID + '-mean', 'That is when she reaches the water. Solve ' + t('h(t)=' + c) + '.']],
            sol: t('-5t^{2}+' + b + 't+' + c + '=' + c) + '<br>' + t('-5t^{2}+' + b + 't=0') + '<br>' + t('-5t(t-' + t2 + ')=0') + ': ' + t('t=0') + ' (the jump) and ' + t('t=' + t2) + ' s (on the way down).', hints: ['Set ' + t('h(t)=' + c) + ' and move every term to one side.', 'Take out the common factor ' + t('-5t') + '.'], text: 'context: the time at a given height' });
        } }] },

    { num: '11', shared: function (r) { return pickWhere(function () { return { k: r.int(1, 5), r1: r.pick([10, 15, 20, 25, 30]), gap: r.pick([10, 20, 30, 40]), item: r.pick(['hoodies', 'T-shirts', 'tickets', 'yearbooks']) }; }, function (o) { return !(o.k === 2 && o.r1 === 20 && o.gap === 30) && (o.r1 * 2 + o.gap) % 2 === 0; }); },
      stem: function (o) { var r2 = o.r1 + o.gap, cs = [-o.k, o.k * (o.r1 + r2), -o.k * o.r1 * r2]; return 'A club sells ' + o.item + '. Its profit is ' + t('P(x)=' + polyTex(cs)) + ' dollars when each costs ' + t('x') + ' dollars.'; },
      parts: [
        { id: '11a', level: 'EMG', make: function (r, o) {
          var r2 = o.r1 + o.gap, inner = polyTex([1, -(o.r1 + r2), o.r1 * r2]);
          return X.rootsPart('Find the zeros of ' + t('P') + ' (the <i>break-even</i> prices).', { vals: [o.r1, r2], what: 'zeros', cands: [[[-o.r1, -r2], LID + '-sign', 'Check the signs: ' + t('(x-' + o.r1 + ')=0') + ' gives ' + t('x=' + o.r1) + '.']] },
            t(aTex(-o.k) + '(' + inner + ')=' + aTex(-o.k) + '(x-' + o.r1 + ')(x-' + r2 + ')=0') + '<br>Zeros ' + t(o.r1) + ' and ' + t(r2) + ': the club breaks even at ' + t('\\$' + o.r1) + ' or ' + t('\\$' + r2) + '.', ['Take out the common factor ' + t(-o.k) + ', then factor.'], 'context: break-even prices');
        } },
        { id: '11b', level: 'PRG', make: function (r, o) {
          var r2 = o.r1 + o.gap;
          return X.fields('Between which prices does the club make a profit?', [{ label: 'Between', name: 'Lower price', before: t('\\$'), ans: o.r1, cands: [[0, LID + '-profit', 'At ' + t('\\$0') + ' the club loses money: ' + t('P(0)<0') + '.']] }, { label: 'and', name: 'Higher price', before: t('\\$'), ans: r2, cands: [[(o.r1 + r2) / 2, LID + '-profit', 'That is the best price. The profit is positive all the way to the larger break-even price.']] }],
            { sol: 'The parabola opens down (' + t('a=' + (-o.k) + '<0') + '), so ' + t('P(x)>0') + ' between its zeros: prices between ' + t('\\$' + o.r1) + ' and ' + t('\\$' + r2) + '.', hints: ['Picture the graph: it opens down, and it is above the ' + t('x') + '-axis between the zeros.'], text: 'context: where the profit is positive' });
        } },
        { id: '11c', level: 'PRG', make: function (r, o) {
          var r2 = o.r1 + o.gap, h = (o.r1 + r2) / 2, P0 = -o.k * (h - o.r1) * (h - r2);
          return X.fields('At what price is the profit greatest, and what is the greatest profit? (Use the axis of symmetry.)', [{ label: 'Price', before: t('\\$'), ans: h, cands: [[o.r1 + r2, LID + '-mid', 'The axis is <b>halfway</b> between the zeros: divide the sum by ' + t('2') + '.']] }, { label: 'Greatest profit', before: t('\\$'), ans: P0, cands: [[-o.k * o.r1 * r2, LID + '-maxprofit', 'That is ' + t('P(0)') + '. Substitute the best price into ' + t('P(x)') + '.'], [-P0, LID + '-maxprofit', 'Check the signs when you substitute.']] }],
            { sol: 'Axis: ' + t('x=\\frac{' + o.r1 + '+' + r2 + '}{2}=' + h) + '. The greatest profit is at ' + t('\\$' + h) + ': ' + t('P(' + h + ')=' + aTex(-o.k) + '(' + h + '-' + o.r1 + ')(' + h + '-' + r2 + ')=\\$' + F(P0)) + '.', hints: ['The vertex is on the axis of symmetry, halfway between the zeros.', 'Substitute that price into the factored form.'], text: 'context: greatest profit from the axis' });
        } }] },

    { num: '12', parts: [
      { id: '12', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { r1: nz(r, -9, 9), r2: nz(r, -9, 9) }; }, function (z0) { return z0.r1 < z0.r2 && z0.r1 + z0.r2 !== 0 && !(z0.r1 === -3 && z0.r2 === 7); });
        var b = -(o.r1 + o.r2), c = o.r1 * o.r2;
        return X.fields('The function ' + t('f(x)=x^{2}+bx+c') + ' has zeros ' + t(o.r1) + ' and ' + t(o.r2) + '. Determine ' + t('b') + ' and ' + t('c') + '.', [{ label: t('b='), name: 'b', ans: b, cands: [[-b, LID + '-b-sign', 'The factors are ' + t('(x' + sT(-o.r1) + ')(x' + sT(-o.r2) + ')') + ': expand them carefully.']] }, { label: t('c='), name: 'c', ans: c, cands: [[-c, LID + '-c-sign', 'Expand ' + t('(x' + sT(-o.r1) + ')(x' + sT(-o.r2) + ')') + ': the constant is ' + t('(' + (-o.r1) + ')(' + (-o.r2) + ')') + '.']] }],
          { sol: t('f(x)=(x' + sT(-o.r1) + ')(x' + sT(-o.r2) + ')=' + polyTex([1, b, c])) + ' (here ' + t('a=1') + '), so ' + t('b=' + b) + ' and ' + t('c=' + c) + '.', hints: ['Write the function in factored form from its zeros, then expand.'], text: 'b and c from the zeros' });
      } }] },

    { num: '13', parts: [
      { id: '13', level: 'MAS', make: function (r) { return zerosMax(r, true, [[-2, 6, -0.5]]); } }] },

    { num: '14', parts: [
      { id: '14', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { k: r.pick([-3, -2, 2, 3, 4, -4]), s: nz(r, -7, 7), m: r.int(2, 7), n: nz(r, -9, 9) }; }, function (z0) { return gcd(z0.m, z0.n) === 1 && Math.abs(z0.n) !== 1 && !(z0.k === -3 && z0.s === 2 && z0.m === 5 && z0.n === 4) && !same(z0.n / z0.m, -z0.s) && Math.abs(z0.k) !== Math.abs(z0.s); });
        var fs = [[1, o.s], [o.m, -o.n]], Zr = [-o.s, o.n / o.m];
        return X.mcVals(r, 'The zeros of ' + t('f(x)=' + facTex(o.k, fs)) + ' are', Zr, [{ vals: [o.s, -o.n / o.m], why: 'The signs are reversed: ' + t('x' + sT(o.s) + '=0') + ' gives ' + t('x=' + (-o.s)) + '.', code: LID + '-sign' },
          { vals: [-o.s, o.m / o.n], why: t(linTex(o.m, -o.n) + '=0') + ' gives ' + t(o.m + 'x=' + o.n) + ', so ' + t('x=' + rT(o.n / o.m)) + '.', code: LID + '-recip' },
          { vals: [o.k, -o.s, o.n / o.m], why: 'The constant ' + t(o.k) + ' is never ' + t('0') + ', so it gives no zero.', code: LID + '-const' }],
          t('x' + sT(o.s) + '=0\\Rightarrow x=' + (-o.s)) + '; ' + t(linTex(o.m, -o.n) + '=0\\Rightarrow x=' + rT(o.n / o.m)) + '. (The constant ' + t(o.k) + ' gives no zero.)', HZ, 'MC: zeros from factored form', { keep: true });
      } }] },

    { num: '15', parts: [
      { id: '15', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { k: r.pick([2, 3, 4, 5]), r1: nz(r, -6, 6), r2: nz(r, -6, 6) }; }, function (z0) { return z0.r1 * z0.r2 < 0 && z0.r1 < z0.r2 && z0.r1 + z0.r2 > 0 && !(z0.k === 2 && z0.r1 === -1 && z0.r2 === 4); });
        var m = o.r1 + o.r2, C = -o.k * o.r1 * o.r2;
        return X.mcVals(r, 'The roots of ' + t(o.k + 'x(x-' + m + ')=' + C) + ' are', [o.r1, o.r2], [{ vals: [0, m], why: 'Those are the roots of ' + t(o.k + 'x(x-' + m + ')=0') + '. Move ' + t(C) + ' to the left side first.', code: LID + '-zp-not0' },
          { vals: [C / o.k, C + m], why: 'You can’t set each factor equal to ' + t(C) + ': the zero product property needs ' + t('0') + ' on one side.', code: LID + '-each-c' },
          { vals: [-o.r1, -o.r2], why: 'Check the signs of the roots from the factors.', code: LID + '-sign' }],
          t(o.k + 'x^{2}-' + o.k * m + 'x-' + C + '=0') + '<br>' + t(o.k + '(x^{2}' + sT(-m).replace(/^([+-])1$/, '$1') + 'x' + sT(o.r1 * o.r2) + ')=' + o.k + '(x' + sT(-o.r1) + ')(x' + sT(-o.r2) + ')=0') + '<br>' + orT([o.r1, o.r2]) + '.', HF, 'MC: roots after rearranging');
      } }] },

    { num: '16', parts: [
      { id: '16', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 6), n: r.int(1, 9) }; }, function (z0) { return gcd(z0.m, z0.n) === 1 && !(z0.m === 2 && z0.n === 3); });
        var A = o.m * o.m, C = o.n * o.n, Bm = 2 * o.m * o.n;
        var opts = [{ html: t('y=' + A + 'x^{2}-' + Bm + 'x+' + C), right: true }, { html: t('y=' + A + 'x^{2}-' + C), why: 'A difference of squares has two zeros: ' + t('\\pm' + rT(o.n / o.m)) + '.', code: LID + '-dbl' },
          { html: t('y=' + A + 'x^{2}+' + C), why: t(A + 'x^{2}+' + C + '\\ge ' + C) + ' is never ' + t('0') + ': no zeros.', code: LID + '-dbl' }, { html: t('y=' + A + 'x^{2}-' + Bm + 'x'), why: t(o.m * o.m + 'x^{2}-' + Bm + 'x=' + o.m + 'x(' + linTex(o.m, -2 * o.n) + ')') + ' has two zeros, ' + t('0') + ' and ' + t(rT(2 * o.n / o.m)) + '.', code: LID + '-dbl' }];
        return X.mc(r, 'Which function has exactly one zero?', opts, t(A + 'x^{2}-' + Bm + 'x+' + C + '=(' + linTex(o.m, -o.n) + ')^{2}') + ', a double zero at ' + t(rT(o.n / o.m)) + ' (its vertex is on the ' + t('x') + '-axis). The others have two zeros, no zeros, and two zeros.', ['Exactly one zero means a perfect square: the graph touches the ' + t('x') + '-axis at its vertex.'], 'MC: which has one zero');
      } }] },

    { num: '17', parts: [
      { id: '17', level: 'PRG', make: function (r) {
        var p = binPair(r, { m1: [2, 3], m2: [2, 3, 4, 5], n: 7, notInt: true, okf: function (pp) { var g = pp.f2; var Z0 = zerosOf([pp.f1, g]); return Math.abs(g[1]) % g[0] !== 0 && pp.f1[0] !== g[0] && Z0[1] - Z0[0] < 9.995 && pp.f1[0] * g[0] >= 6; } });
        var q = quad(1, [p.f1, p.f2]), Z0 = q.zeros, D = Z0[1] - Z0[0];
        var pr = 'The zeros of ' + t('f(x)=' + q.tex) + ' are ' + t('m') + ' and ' + t('n') + ', where ' + t('m>n') + '. The value of ' + t('m-n') + ', to the nearest hundredth, is ____.';
        return X.apx(pr, D, 2, { nr: true, cands: [[Z0[1] + Z0[0], LID + '-sign', 'Subtract: ' + t('m-n') + ' with ' + t('n') + ' negative is ' + t('m+|n|') + '.'], [Math.abs(Z0[0]) - Math.abs(Z0[1]), LID + '-sign', t('m') + ' is the <b>larger</b> zero.']],
          sol: decompLine(p.f1, p.f2) + '; ' + facLine(q) + '.<br>' + t('m=' + rT(Z0[1])) + ', ' + t('n=' + rT(Z0[0])) + '; ' + t('m-n=' + rT(Z0[1]) + '-' + (Z0[0] < 0 ? '\\left(' + rT(Z0[0]) + '\\right)' : rT(Z0[0])) + '=' + rT(D) + '\\approx ' + D.toFixed(2)) + '.', hints: HZ.concat(['A graphing calculator gives the zeros too.']), text: 'NR: difference of the zeros' });
      } }] },

    { num: '18', parts: [
      { id: '18', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3, 4, -2, -3, 0.5, 1.5]), r1: nz(r, -4, 9), r2: nz(r, -4, 9), x1: nz(r, -3, 9) }; }, function (z0) {
          var c = z0.a * z0.r1 * z0.r2, y = z0.a * (z0.x1 - z0.r1) * (z0.x1 - z0.r2);
          return z0.r1 < z0.r2 && z0.x1 !== z0.r1 && z0.x1 !== z0.r2 && Number.isInteger(c) && c > 0 && c <= 99 && Number.isInteger(y) && y !== 0 && Math.abs(y) <= 60 && !(z0.r1 === 2 && z0.r2 === 8 && z0.x1 === 4); });
        var c = o.a * o.r1 * o.r2, y = o.a * (o.x1 - o.r1) * (o.x1 - o.r2), m = (o.x1 - o.r1) * (o.x1 - o.r2);
        return X.num('The graph of ' + t('y=a(x' + sT(-o.r1) + ')(x' + sT(-o.r2) + ')') + ' passes through ' + t(ptTex(o.x1, y)) + '. The ' + t('y') + '-intercept of the graph is ____.', c, { nr: true, cands: [[cl(o.r1 * o.r2 * m / y), LID + '-a-recip', 'Solve for ' + t('a') + ' by dividing: ' + t(y + '=' + m + 'a') + '.'], [cl(-c), LID + '-yint', 'Check the signs when you substitute ' + t('x=0') + '.'], [o.r1 * o.r2, LID + '-yint', 'Multiply by ' + t('a') + ' too.']],
          sol: t(y + '=a(' + o.x1 + sT(-o.r1) + ')(' + o.x1 + sT(-o.r2) + ')=' + m + 'a') + ', so ' + t('a=' + vT(o.a)) + '.<br>' + t('y') + '-intercept: ' + t(vT(o.a) + '(0' + sT(-o.r1) + ')(0' + sT(-o.r2) + ')=' + c) + '.', hints: HA.concat(HY), text: 'NR: y-intercept after finding a' });
      } }] }
  ];

  /* the zeros, the y-intercept and the factored form of a marked graph (Q5) */
  function graphFac(r, a, zs, text) {
    var fs = zs.length === 1 ? [{ f: [1, -zs[0]], k: 2 }] : [[1, -zs[0]], [1, -zs[1]]], q = quad(a, fs), c = q.cs[2];
    var h = zs.length === 1 ? zs[0] : (zs[0] + zs[1]) / 2, kv = q.f(h);
    var pts = zs.map(function (x) { return { x: x, y: 0 }; }).concat([{ x: 0, y: c }]);
    var fig = X.graphFig([{ f: q.f }], pts, { extra: [[h, kv]] });
    var sub = zs.length === 1 ? t(c + '=a(0' + sT(-zs[0]) + ')^{2}=' + zs[0] * zs[0] + 'a') : t(c + '=a(0' + sT(-zs[0]) + ')(0' + sT(-zs[1]) + ')=' + zs[0] * zs[1] + 'a');
    var w = facWrongs(a, fs);
    return X.fields('The marked points have integer coordinates.' + fig, [X.rootsSpec(zs.length === 1 ? 'Zero' : 'Zeros', { vals: zs, what: 'zeros', cands: [[zs.map(function (x) { return -x; }), LID + '-sign', 'Read the graph again: where does it meet the ' + t('x') + '-axis?']] }),
      { label: t('y') + '-intercept', name: 'y-intercept', ans: c, cands: [[kv, LID + '-yint-vertex', 'That is the vertex. The ' + t('y') + '-intercept is where the graph crosses the ' + t('y') + '-axis.']] }, X.facSpec('Factored form', a, fs, w)],
      { sol: (zs.length === 1 ? 'The graph touches the ' + t('x') + '-axis only at ' + t(zs[0]) + ': a double zero, ' + t('y=a(x' + sT(-zs[0]) + ')^{2}') : 'Zeros ' + andT(zs) + ': ' + t('y=a(x' + sT(-zs[0]) + ')(x' + sT(-zs[1]) + ')')) + '; ' + t('y') + '-intercept ' + t(c) + '.<br>' + sub + ', so ' + t('a=' + vT(a)) + '.<br>' + t('y=' + q.fac),
        hints: HA, text: text });
  }
  /* classic wrong factored forms: sign of a, a upside down, zeros' signs */
  function facWrongs(a, fs) {
    var w = [{ cs: expand(-a, fs), code: LID + '-a-sign', hint: 'Check the sign of ' + t('a') + ': substitute the known point (or the vertex) again and solve carefully.' }];
    if (!same(Math.abs(a), 1)) w.push({ cs: expand(1 / a, fs), code: LID + '-a-recip', hint: 'Solve for ' + t('a') + ' by <b>dividing</b> the ' + t('y') + '-value by the product of the brackets.' });
    w.push({ cs: expand(a, fs.map(function (f) { f = F1(f); return { f: [f.f[0], -f.f[1]], k: f.k }; })), code: LID + '-sign', hint: 'A zero ' + t('r') + ' gives the factor ' + t('(x-r)') + ': check the signs in your brackets.' });
    if (fs.length === 2 && !same(Math.abs(a), 1)) w.push({ cs: expand(1, fs), code: LID + '-a-sign', hint: 'Every function ' + t('y=a(x-r)(x-s)') + ' has these zeros: use the other point to find ' + t('a') + '.' });
    return w;
  }
  /* factored then general form from the zeros and one point (Q8) */
  function fromZeros(k, fs, x1, words, text, isYint) {
    var q = quad(k, fs), y1 = q.f(x1), Zs = q.zeros, L = fs.map(F1);
    var lead = L.reduce(function (s, f) { return s * Math.pow(f.f[0], f.k); }, 1), a = k * lead;
    var brk = L.map(function (f) { var v = f.f[1] / f.f[0]; return '(x' + sT(v, true) + ')' + (f.k > 1 ? '^{2}' : ''); }).join('');
    var subB = L.map(function (f) { var v = cl(x1 + f.f[1] / f.f[0]); return '(' + rT(v) + ')' + (f.k > 1 ? '^{2}' : ''); }).join(''), prodB = cl(y1 / a);
    var pt = isYint ? t(nT(y1)) : t(ptTex(x1, y1));
    var w = facWrongs(k, fs), gw = [{ cs: expand(-k, fs), code: LID + '-a-sign', hint: 'Check the sign of ' + t('a') + '.' }];
    if (!same(Math.abs(a), 1)) gw.push({ cs: expand(k / (a * a), fs), code: LID + '-a-recip', hint: 'Solve for ' + t('a') + ' by dividing.' });
    gw.push({ cs: q.cs.slice(0, 2).concat([cl(-q.cs[2])]), code: LID + '-c-sign', hint: 'Check the sign of the constant term when you expand.' });
    var facNote = L.some(function (f) { return Math.abs(f.f[0]) !== 1; }) ? '<br>' + t('y=' + aTex(a, true) + brk + '=' + q.fac) + ' (the fraction goes into its bracket)' : '';
    return X.fields(words + pt + '.', [X.facSpec('Factored form', k, fs, w), X.genSpec('General form', q.cs, gw)],
      { sol: t('y=a' + brk) + '<br>' + t(nT(y1) + '=a' + subB + '=' + rT(prodB) + 'a') + ', so ' + t('a=' + rT(a)) + '.' + facNote + '<br>' + t('y=' + q.fac) + '<br>Expand: ' + t('y=' + q.tex),
        hints: HA.concat(['Expand the brackets first, then multiply every term by ' + t('a') + '.']), text: text });
  }
  /* factored form from the zeros and the maximum (mx) or minimum value (Q13, Extra C2) */
  function zerosMax(r, mx, avoidL) {
    var o = pickWhere(function () { var dd = r.int(2, 5), a = (mx ? -1 : 1) * r.pick([0.5, 1, 2, 0.25, 1.5, 3, 0.75]); return { dd: dd, a: a, h: r.int(-4, 5) }; }, function (z0) {
      var M = -z0.a * z0.dd * z0.dd; return Number.isInteger(M) && Math.abs(M) <= 40 && z0.h - z0.dd !== 0 && z0.h + z0.dd !== 0 && !(avoidL || []).some(function (L) { return L[0] === z0.h - z0.dd && L[1] === z0.h + z0.dd && same(L[2], z0.a); });
    });
    var r1 = o.h - o.dd, r2 = o.h + o.dd, M = -o.a * o.dd * o.dd, fs = [[1, -r1], [1, -r2]];
    var w = facWrongs(o.a, fs).concat([{ is: facTex(cl(M / (-o.dd)), fs), code: LID + '-a-nosq', hint: 'At the vertex both brackets are ' + t(o.dd) + ' units from a zero: ' + t('(' + o.h + sT(-r1) + ')(' + o.h + sT(-r2) + ')=' + (-o.dd * o.dd)) + '.' }]);
    return X.facPart('A quadratic function has zeros ' + t(r1) + ' and ' + t(r2) + ', and its ' + (mx ? 'maximum' : 'minimum') + ' value is ' + t(M) + '. Write the function in factored form.', o.a, fs, w,
      'The axis is halfway between the zeros: ' + t('x=\\frac{' + r1 + '+' + (r2 < 0 ? '(' + r2 + ')' : r2) + '}{2}=' + o.h) + ', so the vertex is ' + t(ptTex(o.h, M)) + '.<br>' + t('y=a(x' + sT(-r1) + ')(x' + sT(-r2) + ')') + ': ' + t(M + '=a(' + (o.h - r1) + ')(' + (o.h - r2) + ')=' + (-o.dd * o.dd) + 'a') + ', so ' + t('a=' + rT(o.a)) + '.<br>' + t('y=' + facTex(o.a, fs)),
      ['The ' + (mx ? 'maximum' : 'minimum') + ' is at the vertex, which is on the axis of symmetry halfway between the zeros.', 'Write ' + t('y=a(x-r)(x-s)') + ' and substitute the vertex to find ' + t('a') + '.'], 'factored form from zeros and the ' + (mx ? 'maximum' : 'minimum'));
  }

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Find the roots of each equation.', parts: [
      { id: 'eA1a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { r1: nz(r, -9, 9), r2: nz(r, -9, 9) }; }, function (z0) { return z0.r1 < z0.r2 && z0.r1 + z0.r2 !== 0 && Math.abs(z0.r1 * z0.r2) <= 60 && fresh(1, [z0.r1, z0.r2]); });
        var fs = [[1, -o.r1], [1, -o.r2]], q = quad(1, fs);
        return X.rootsPart(eqT(q.tex), { vals: q.zeros, cands: zeroCands(fs) }, facLine(q) + '<br>' + orT(q.zeros) + '.', HF, 'roots: x² + bx + c');
      } },
      { id: 'eA1b', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 9), n: r.int(1, 11) }; }, function (z0) { return gcd(z0.m, z0.n) === 1 && z0.n !== 1 && freshZ([z0.n / z0.m, -z0.n / z0.m]); });
        var R0 = o.n / o.m;
        return X.rootsPart(eqT(o.m * o.m + 'x^{2}', o.n * o.n), { vals: [-R0, R0], cands: [[[R0], LID + '-dbl', 'A square has two square roots: ' + t('x=\\pm' + rT(R0)) + '.'], [[-R0 * R0, R0 * R0], LID + '-noroot', 'Take the square root of both sides: ' + t('x^{2}=' + rT(R0 * R0)) + ', so ' + t('x=\\pm' + rT(R0)) + '.'], [[-o.m / o.n, o.m / o.n], LID + '-recip', t(o.m + 'x=' + o.n) + ' gives ' + t('x=\\frac{' + o.n + '}{' + o.m + '}') + '.']] },
          t(o.m * o.m + 'x^{2}-' + o.n * o.n + '=0') + '<br>' + t('(' + o.m + 'x-' + o.n + ')(' + o.m + 'x+' + o.n + ')=0') + '<br>' + t('x=\\pm' + rT(R0)), HF, 'roots: m²x² = n²');
      } },
      { id: 'eA1c', level: 'EMG', make: function (r) {
        var p = binPair(r, { m1: [2, 3, 5], m2: [1], n: 8, notInt: true }), q = quad(1, [p.f1, p.f2]);
        return X.rootsPart(eqT(q.tex), { vals: q.zeros, cands: zeroCands([p.f1, p.f2]) }, decompLine(p.f1, p.f2) + '<br>' + facLine(q) + '<br>' + orT(q.zeros) + '.', HF, 'roots: decomposition');
      } },
      { id: 'eA1d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { r1: nz(r, -7, 7), r2: nz(r, -7, 7) }; }, function (z0) { return z0.r1 < z0.r2 && z0.r1 + z0.r2 !== 0 && Math.abs(z0.r1 * z0.r2) <= 40 && freshZ([0, z0.r1, z0.r2]); });
        var S = o.r1 + o.r2, P0 = o.r1 * o.r2;
        return X.rootsPart(eqT(polyTex([1, -S, 0, 0]), polyTex([-P0, 0])), { vals: [0, o.r1, o.r2], cands: [[[o.r1, o.r2], LID + '-lost0', 'Dividing by ' + t('x') + ' loses the root ' + t('x=0') + '.'], [[0, -o.r1, -o.r2], LID + '-sign', 'Check the signs of the zeros.']] },
          t(polyTex([1, -S, P0, 0]) + '=0') + '<br>' + t('x(x' + sT(-o.r1) + ')(x' + sT(-o.r2) + ')=0') + '<br>' + orT([0, o.r1, o.r2]) + '.', HF, 'roots: a cubic');
      } },
      { id: 'eA1e', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 7), n: nz(r, -8, 8) }; }, function (z0) { return gcd(z0.m, Math.abs(z0.n)) === 1 && freshZ([z0.n / z0.m]); });
        var R0 = o.n / o.m, cs = [o.m * o.m, -2 * o.m * o.n, o.n * o.n];
        return X.rootsPart(eqT(polyTex(cs)), { vals: [R0], cands: [[[-R0, R0], LID + '-dbl', 'A perfect square has one root (a double root).'], [[-R0], LID + '-sign', 'Check the sign.']] }, t('(' + linTex(o.m, -o.n) + ')^{2}=0') + '<br>' + t('x=' + rT(R0)) + ' (a double root)', HF.concat(['Is it a perfect square trinomial?']), 'roots: perfect square');
      } },
      { id: 'eA1f', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 7), n: nz(r, -9, 9) }; }, function (z0) { return gcd(z0.m, Math.abs(z0.n)) === 1 && !(z0.m === 2 && z0.n === 7); });
        var R0 = -o.n / o.m;
        return X.rootsPart(eqT('-x(' + linTex(o.m, o.n) + ')'), { vals: [0, R0], cands: [[[0, -R0], LID + '-sign', 'Check the sign: ' + t(linTex(o.m, o.n) + '=0') + ' gives ' + t('x=' + rT(R0)) + '.'], [[-1, 0, R0], LID + '-const', t('-1') + ' is a constant: it gives no root.'], [[0, -o.n], LID + '-coef', 'Divide by ' + t(o.m) + ' too.']] },
          t('-x=0') + ' gives ' + t('x=0') + '; ' + t(linTex(o.m, o.n) + '=0') + ' gives ' + t('x=' + rT(R0)) + '.', HF, 'roots: −x(mx + n) = 0');
      } }] },
    { num: 'A2', stem: 'For each function, determine the zeros and the ' + t('y') + '-intercept of its graph.', parts: [
      { id: 'eA2a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { r1: nz(r, -9, 9), r2: nz(r, -9, 9) }; }, function (z0) { return z0.r1 < z0.r2 && z0.r1 + z0.r2 !== 0 && Math.abs(z0.r1 * z0.r2) <= 50 && fresh(1, [z0.r1, z0.r2]); });
        var fs = [[1, -o.r1], [1, -o.r2]], q = quad(1, fs);
        return X.fields(t('f(x)=' + q.tex), [X.rootsSpec('Zeros', { vals: q.zeros, what: 'zeros', cands: zeroCands(fs) }), { label: t('y') + '-intercept', name: 'y-intercept', ans: q.cs[2], cands: [[-q.cs[2], LID + '-yint', 'Check the sign of the constant term.']] }],
          { sol: facLine(q) + ': zeros ' + andT(q.zeros) + '; ' + t('y') + '-intercept ' + t(nT(q.cs[2])) + '.', hints: HZ.concat(HY), text: 'zeros and y-intercept' });
      } },
      { id: 'eA2b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(2, 6), n: r.int(1, 6) }; }, function (z0) { return !(z0.k === 4 && z0.n === 2) && z0.k !== z0.n; });
        var c = o.k * o.n * o.n;
        return X.fields(t('g(x)=-' + o.k + 'x^{2}+' + c), [X.rootsSpec('Zeros', { vals: [-o.n, o.n], what: 'zeros', cands: [[[-o.n * o.n, o.n * o.n], LID + '-noroot', 'Divide by ' + t('-' + o.k) + ', then take the square root: ' + t('x^{2}=' + o.n * o.n) + '.']] }), { label: t('y') + '-intercept', name: 'y-intercept', ans: c, cands: [[-c, LID + '-yint', t('g(0)=-' + o.k + '(0)^{2}+' + c) + '.'], [-o.k, LID + '-yint', 'The ' + t('y') + '-intercept is ' + t('g(0)') + '.']] }],
          { sol: t('-' + o.k + '(x^{2}-' + o.n * o.n + ')=-' + o.k + '(x-' + o.n + ')(x+' + o.n + ')=0') + ': zeros ' + t('\\pm' + o.n) + '.<br>' + t('y') + '-intercept ' + t(c) + '.', hints: ['Take out the common factor ' + t('-' + o.k) + ' first.'].concat(HY), text: 'zeros and y-intercept: −k x² + c' });
      } },
      { id: 'eA2c', level: 'EMG', make: function (r) {
        var p = binPair(r, { m1: [3, 5, 7], m2: [1], n: 6, notInt: true, cmax: 30 }), q = quad(1, [p.f1, p.f2]);
        return X.fields(t('h(x)=' + q.tex), [X.rootsSpec('Zeros', { vals: q.zeros, what: 'zeros', cands: zeroCands([p.f1, p.f2]) }), { label: t('y') + '-intercept', name: 'y-intercept', ans: q.cs[2], cands: [[-q.cs[2], LID + '-yint', 'Check the sign of the constant term.']] }],
          { sol: decompLine(p.f1, p.f2) + '; ' + facLine(q) + ': zeros ' + andT(q.zeros) + '; ' + t('y') + '-intercept ' + t(nT(q.cs[2])) + '.', hints: HZ.concat(HY), text: 'zeros and y-intercept: a ≠ 1' });
      } }] },
    { num: 'A3', parts: [
      { id: 'eA3', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var a = r.pick([-1, -1, 1]), r1 = r.int(-6, 3), dd = r.pick([2, 3]); return { a: a, r1: r1, r2: r1 + 2 * dd, d: dd }; }, function (z0) { var c = z0.a * z0.r1 * z0.r2; return z0.r1 !== 0 && z0.r2 !== 0 && Math.abs(c) <= 10 && z0.r2 <= 6 && fresh(z0.a, [z0.r1, z0.r2]) && !(z0.a === -1 && z0.r1 === -5 && z0.r2 === 1); });
        var q = quad(o.a, [[1, -o.r1], [1, -o.r2]]), h = (o.r1 + o.r2) / 2, k = q.f(h), c = q.cs[2], up = o.a > 0;
        var fig = X.graphFig([{ f: q.f }], [{ x: o.r1, y: 0 }, { x: o.r2, y: 0 }, { x: h, y: k }, { x: 0, y: c }], { showPts: true });
        return X.fields('The graph of ' + t('y=' + q.tex) + ' is shown. State the direction of opening, the vertex, the axis of symmetry, the maximum or minimum value, the zeros and the ' + t('y') + '-intercept.' + fig,
          [X.dirSpec(up), { label: 'Vertex', pt: [h, k], cands: [[[k, h], LID + '-swap', 'Write the ' + t('x') + '-coordinate first.']] }, { label: 'Axis of symmetry', axis: h, q: k }, { label: 'Max or min?', mm: up ? 'min' : 'max' }, { label: 'Value', ans: k, cands: [[h, 'u5l3-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex.'], [c, LID + '-maxval', 'That is the ' + t('y') + '-intercept.']] },
            X.rootsSpec('Zeros', { vals: [o.r1, o.r2], what: 'zeros' }), { label: t('y') + '-intercept', name: 'y-intercept', ans: c, cands: [[k, LID + '-yint-vertex', 'That is the vertex.']] }],
          { sol: 'Opens ' + (up ? 'up' : 'down') + '; vertex ' + t(ptTex(h, k)) + '; axis ' + t('x=' + nT(h)) + '; ' + (up ? 'minimum' : 'maximum') + ' value ' + t(nT(k)) + '; zeros ' + andT([o.r1, o.r2]) + '; ' + t('y') + '-intercept ' + t(nT(c)) + '.<br>(Check: ' + t(q.tex + '=' + q.fac) + ', and ' + t('\\frac{' + o.r1 + '+' + (o.r2 < 0 ? '(' + o.r2 + ')' : o.r2) + '}{2}=' + nT(h)) + '.)', hints: ['Read each feature from the graph; the axis is halfway between the zeros.'], text: 'graph: all the features' });
      } }] },
    { num: 'B1', section: 'B. Applying', stem: 'Write each quadratic function in factored form.', parts: [
      { id: 'eB1a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3, -2, -3, -1, 4]), r1: nz(r, -7, 7), r2: nz(r, -7, 7) }; }, function (z0) { return z0.r1 < z0.r2 && Math.abs(z0.a * z0.r1 * z0.r2) <= 50 && fresh(z0.a, [z0.r1, z0.r2]); });
        var fs = [[1, -o.r1], [1, -o.r2]], c = o.a * o.r1 * o.r2;
        return X.facPart('Zeros ' + t(o.r1) + ' and ' + t(o.r2) + '; ' + t('y') + '-intercept ' + t(c) + '.', o.a, fs, facWrongs(o.a, fs), t(c + '=a(0' + sT(-o.r1) + ')(0' + sT(-o.r2) + ')=' + o.r1 * o.r2 + 'a') + ', so ' + t('a=' + o.a) + ': ' + t('y=' + facTex(o.a, fs)), HA, 'factored form from zeros and y-intercept');
      } },
      { id: 'eB1b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { s: nz(r, -9, 9), x1: nz(r, -6, 6), a: r.pick([-0.75, -0.5, 0.5, 0.25, -0.25, 1.5, 2, -2, -1.5]) }; }, function (z0) { var y = z0.a * z0.x1 * (z0.x1 - z0.s); return z0.x1 !== z0.s && Number.isInteger(y) && y !== 0 && Math.abs(y) <= 40 && !(z0.s === 8 && z0.x1 === 4); });
        var fs = [[1, 0], [1, -o.s]], y = o.a * o.x1 * (o.x1 - o.s), m = o.x1 * (o.x1 - o.s);
        return X.facPart('Zeros ' + t('0') + ' and ' + t(o.s) + '; passes through ' + t(ptTex(o.x1, y)) + '.', o.a, fs, facWrongs(o.a, fs), t('y=ax(x' + sT(-o.s) + ')') + '<br>' + t(y + '=a(' + o.x1 + ')(' + o.x1 + sT(-o.s) + ')=' + m + 'a') + ', so ' + t('a=' + rT(o.a)) + ': ' + t('y=' + facTex(o.a, fs)), HA.concat(['The zero ' + t('0') + ' gives the factor ' + t('x') + '.']), 'factored form: a zero at 0');
      } }] },
    { num: 'B2', stem: 'Use a graphing calculator.', parts: [
      { id: 'eB2a', level: 'PRG', make: function (r) {
        var p = binPair(r, { m1: [3, 6], m2: [2, 4, 3], n: 7, notInt: true, cmax: 30, bmax: 30, okf: function (pp) { var g = pp.f2; var nt0 = !terminates(toFrac(-pp.f1[1] / pp.f1[0])) || !terminates(toFrac(-g[1] / g[0])); return pp.f1[0] !== g[0] && Math.abs(g[1]) % g[0] !== 0 && pp.f1[0] * g[0] <= 24 && nt0; } });
        var q = quad(1, [p.f1, p.f2]);
        return X.fields('Find the exact zeros of ' + t('f(x)=' + q.tex) + ' and write ' + t('f(x)') + ' in factored form.', [X.rootsSpec('Zeros', { vals: q.zeros, what: 'zeros', cands: zeroCands([p.f1, p.f2]) }), X.facSpec('Factored form', 1, [p.f1, p.f2], facWrongs(1, [p.f1, p.f2]), { before: t('f(x)=') })],
          { sol: 'Calculator: ' + q.zeros.map(function (x) { var f = toFrac(x); return t('x=' + (terminates(f) ? nT(x) : (x < 0 ? '-' : '') + Math.abs(x).toFixed(4) + '\\ldots')); }).join(' and ') + ', i.e. ' + andT(q.zeros) + ' (MATH ►Frac).<br>' + t('f(x)=' + q.fac) + ' (it expands to ' + t(q.tex) + ' ✓)', hints: ['A repeating decimal such as ' + t('0.6666\\ldots') + ' is ' + t('\\frac{2}{3}') + ': use MATH ►Frac.', 'A zero ' + t('\\frac{m}{n}') + ' gives the factor ' + t('(nx-m)') + '.'], text: 'calculator: exact zeros (repeating decimals)' });
      } },
      { id: 'eB2b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3, 4, -2, -3]), b: nz(r, -7, 7), c: nz(r, -9, 9) }; }, function (z0) { var D = z0.b * z0.b - 4 * z0.a * z0.c, s = Math.round(Math.sqrt(Math.max(D, 0))); return D > 0 && s * s !== D && !(z0.a === 3 && z0.b === -2 && z0.c === -6); });
        var D = Math.sqrt(o.b * o.b - 4 * o.a * o.c), x1 = (-o.b - D) / (2 * o.a), x2 = (-o.b + D) / (2 * o.a), R = [Math.min(x1, x2), Math.max(x1, x2)];
        return X.fields('Find the zeros of ' + t('y=' + polyTex([o.a, o.b, o.c])) + ' to the nearest hundredth.', [{ label: t('x\\approx'), name: 'Smaller zero', dp: 2, ans: R[0] }, { label: 'and ' + t('x\\approx'), name: 'Larger zero', dp: 2, ans: R[1] }],
          { swap: [[0, 1]], sol: t('x\\approx ' + R[0].toFixed(2)) + ' and ' + t('x\\approx ' + R[1].toFixed(2)) + ' (2nd CALC 2:zero for each ' + t('x') + '-intercept).', hints: ['Graph it and use 2nd CALC 2:zero for each ' + t('x') + '-intercept.'], text: 'calculator: rounded zeros' });
      } }] },
    { num: 'B3', stem: 'State the number of real roots of ' + t('f(x)=0') + ' for each parabola ' + t('y=f(x)') + ' (the number of its ' + t('x') + '-intercepts).', parts: [
      { id: 'eB3a', level: 'BEG', make: function (r) { var p = nz(r, -6, 6), q = -r.int(1, 9); if (p === -3 && q === -2) q = -3; return z().countMC(r, 'It opens up; its vertex is ' + t(ptTex(p, q)) + '.', 1, p, q); } },
      { id: 'eB3b', level: 'BEG', make: function (r) { var p = nz(r, -6, 6), q = -r.int(1, 9); if (p === 1 && q === -6) q = -5; return z().countMC(r, 'It opens down; its vertex is ' + t(ptTex(p, q)) + '.', -1, p, q); } },
      { id: 'eB3c', level: 'BEG', make: function (r) { var p = nz(r, -7, 7); if (p === -5) p = -4; return z().countMC(r, 'It opens down; its vertex is ' + t(ptTex(p, 0)) + '.', -1, p, 0); } }] },
    { num: 'B4', shared: function (r) { return pickWhere(function () { var T = r.pick([3, 5, 6, 7]), t1 = r.int(1, Math.floor((T - 1) / 2)); return { T: T, t1: t1, t2: T - t1, what: r.pick(['soccer ball', 'football', 'golf ball']) }; }, function (o) { return o.t1 < o.t2; }); },
      stem: function (o) { return 'A ' + o.what + ' is kicked from the ground. Its height after ' + t('t') + ' seconds is ' + t('h(t)=-5t^{2}+' + 5 * o.T + 't') + ' metres.'; },
      parts: [
        { id: 'eB4a', level: 'EMG', make: function (r, o) {
          return X.fields('Find the zeros of ' + t('h') + ' and explain what each one means.', [X.rootsSpec('Zeros', { vals: [0, o.T], v: 't', what: 'zeros', cands: [[[0, -o.T], LID + '-sign', t('t-' + o.T + '=0') + ' gives ' + t('t=' + o.T) + '.'], [[o.T], LID + '-lost0', 'The factor ' + t('-5t') + ' gives the zero ' + t('t=0') + ' too.']] }), { label: 'It lands after', name: 'Landing time', after: 's', ans: o.T, cands: [[0, LID + '-mean', t('t=0') + ' is the kick. It lands at the other zero.']] }],
            { vars: ['t'], sol: t('-5t(t-' + o.T + ')=0') + ': ' + t('t=0') + ' (the kick) and ' + t('t=' + o.T) + ' (it lands after ' + o.T + ' s).', hints: ['Take out the common factor ' + t('-5t') + '.'], text: 'context: zeros of h(t) = −5t² + bt' });
        } },
        { id: 'eB4b', level: 'PRG', make: function (r, o) {
          var H = 5 * o.t1 * o.t2;
          return X.rootsPart('When is the ball ' + t(H) + ' m high?', { vals: [o.t1, o.t2], v: 't', what: 'times', cands: [[[-o.t1, -o.t2], LID + '-sign', 'Check the signs of your factors.']] },
            t('-5t^{2}+' + 5 * o.T + 't-' + H + '=0') + '<br>' + t('t^{2}-' + o.T + 't+' + o.t1 * o.t2 + '=0') + '<br>' + t('(t-' + o.t1 + ')(t-' + o.t2 + ')=0') + ': at ' + t(o.t1) + ' s (going up) and at ' + t(o.t2) + ' s (coming down).', ['Set ' + t('h(t)=' + H) + ', move every term to one side, and divide by ' + t('-5') + '.'], 'context: times at a height');
        } }] },
    { num: 'B5', parts: [
      { id: 'eB5', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 5), n: nz(r, -9, 9), s: nz(r, -7, 7) }; }, function (z0) { return gcd(z0.m, Math.abs(z0.n)) === 1 && Math.abs(z0.n) !== 1 && !(z0.m === 2 && z0.n === 5 && z0.s === 3) && !same(z0.n / z0.m, -z0.s) && Math.abs(z0.n * z0.s) !== Math.abs(z0.s); });
        var fs = [[o.m, -o.n], [1, o.s]], Zr = [o.n / o.m, -o.s], yi = -o.n * o.s;
        return X.mcVals(r, 'The ' + t('x') + '-intercepts of the graph of ' + t('y=' + facTex(1, fs)) + ' are', Zr, [{ vals: [-o.n / o.m, o.s], why: 'The signs are reversed.', code: LID + '-sign' }, { vals: [o.n, -o.s], why: 'Divide by ' + t(o.m) + ': ' + t(o.m + 'x=' + o.n) + '.', code: LID + '-coef' }, { vals: [yi], why: 'That is the ' + t('y') + '-intercept (put ' + t('x=0') + ').', code: LID + '-yint' }],
          zeroSolve(fs) + '. (' + t(yi) + ' is the ' + t('y') + '-intercept.)', HZ, 'MC: x-intercepts from factors', { only: true });
      } }] },
    { num: 'B6', parts: [
      { id: 'eB6', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3, 4, 5, 6, 1.5, 2.5, 0.5]), r1: nz(r, -6, 6), r2: nz(r, -6, 6) }; }, function (z0) { var c = z0.a * z0.r1 * z0.r2; return z0.r1 < z0.r2 && Number.isInteger(c) && Math.abs(c) <= 60 && !(z0.a === 4 && z0.r1 === -1 && z0.r2 === 5); });
        var c = o.a * o.r1 * o.r2, m = o.r1 * o.r2;
        return X.num('The graph of ' + t('f(x)=a(x' + sT(-o.r1) + ')(x' + sT(-o.r2) + ')') + ' has a ' + t('y') + '-intercept of ' + t(c) + '. The value of ' + t('a') + ' is ____.', o.a, { nr: true, cands: [[cl(m / c), LID + '-a-recip', 'Solve ' + t(m + 'a=' + c) + ' by dividing by ' + t(m) + '.'], [-o.a, LID + '-a-sign', 'Check the sign: ' + t('f(0)=a(' + (-o.r1) + ')(' + (-o.r2) + ')') + '.']],
          sol: t('f(0)=a(0' + sT(-o.r1) + ')(0' + sT(-o.r2) + ')=' + m + 'a=' + c) + ', so ' + t('a=' + vT(o.a)) + '.', hints: HY.concat(['Substitute ' + t('x=0') + ' and solve for ' + t('a') + '.']), text: 'NR: a from the y-intercept' });
      } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'eC1', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 4, 5]), n: nz(r, -7, 7), s: nz(r, -6, 6) }; }, function (z0) { return gcd(z0.m, Math.abs(z0.n)) === 1 && Math.abs(z0.n) % z0.m !== 0 && !(z0.m === 2 && z0.n === 1 && z0.s === -3) && !same(z0.n / z0.m, z0.s); });
        var fs = [[1, -o.s], [o.m, -o.n]], cs = expand(1, fs), b = cs[1], c = cs[2];
        return X.fields('The function ' + t('f(x)=' + o.m + 'x^{2}+bx+c') + ' has zeros ' + t(o.s) + ' and ' + t(rT(o.n / o.m)) + '. Determine ' + t('b') + ' and ' + t('c') + '.', [{ label: t('b='), name: 'b', ans: b, cands: [[-b, LID + '-b-sign', 'Check the signs in your factors: a zero ' + t('r') + ' gives ' + t('(x-r)') + '.'], [cl(b / o.m), LID + '-k', 'Multiply by ' + t(o.m) + ' too: ' + t('a=' + o.m) + '.']] }, { label: t('c='), name: 'c', ans: c, cands: [[-c, LID + '-c-sign', 'Check the sign of the constant.'], [cl(c / o.m), LID + '-k', 'Multiply by ' + t(o.m) + ' too.']] }],
          { sol: t('f(x)=' + o.m + '(x' + sT(-o.s) + ')(x' + sT(-o.n / o.m, true) + ')=(x' + sT(-o.s) + ')(' + linTex(o.m, -o.n) + ')=' + polyTex(cs)) + ', so ' + t('b=' + b) + ' and ' + t('c=' + c) + '.', hints: ['Write ' + t('f(x)=' + o.m + '(x-r)(x-s)') + ' and expand. The ' + t(o.m) + ' goes into the bracket with the fraction.'], text: 'b and c from the zeros (a ≠ 1)' });
      } }] },
    { num: 'C2', parts: [
      { id: 'eC2', level: 'MAS', make: function (r) { return zerosMax(r, false, [[-1, 7, 0.5]]); } }] },
    { num: 'C3', parts: [
      { id: 'eC3', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { A: r.pick([2, 3, 4, 5, 6]), r0: nz(r, -4, 4), n: nz(r, -9, 9) }; }, function (z0) {
          var oz = z0.n / z0.A, C = z0.r0 * z0.n, k = -(z0.A * z0.r0 + z0.n); return Math.abs(z0.n) % z0.A !== 0 && C !== 0 && Math.abs(C) <= 30 && k !== 0 && Math.abs(k) <= 25 && !same(oz, z0.r0) && !(z0.A === 3 && z0.r0 === -2 && C === -10); });
        var oz = o.n / o.A, C = o.r0 * o.n, k = -(o.A * o.r0 + o.n), Q0 = quad(1, [[1, -o.r0], [o.A, -o.n]]);
        var g = gcd(o.A, Math.abs(o.n)), f2 = [o.A / g, -o.n / g], kf = g;
        return X.fields('One zero of ' + t('f(x)=' + o.A + 'x^{2}+kx' + sT(C)) + ' is ' + t(o.r0) + '. Determine ' + t('k') + ' and the other zero.', [{ label: t('k='), name: 'k', ans: k, cands: [[-k, LID + '-k', 'Substitute ' + t('x=' + o.r0) + ' carefully: ' + t('(' + o.r0 + ')^{2}=' + o.r0 * o.r0) + '.']] },
          X.rootsSpec('Other zero', { vals: [oz], what: 'zeros', cands: [[[o.r0], LID + '-given', 'That is the zero you were given. Find the other one.'], [[o.r0, oz], 'sol-extra', 'Give only the <b>other</b> zero.'], [[-oz], LID + '-sign', 'Check the sign.']] })],
          { sol: 'A zero makes ' + t('f(x)=0') + ': ' + t(o.A + '(' + o.r0 + ')^{2}+k(' + o.r0 + ')' + sT(C) + '=0') + ', so ' + t(o.A * o.r0 * o.r0 + C + (o.r0 < 0 ? '-' + (-o.r0) : '+' + o.r0) + 'k=0') + ' and ' + t('k=' + k) + '.<br>' + t('f(x)=' + polyTex([o.A, k, C]) + '=' + facTex(kf, [[1, -o.r0], f2])) + ', so the other zero is ' + t(rT(oz)) + '.',
            hints: ['A zero makes the function ' + t('0') + ': substitute it for ' + t('x') + ' and solve for ' + t('k') + '.', 'Then factor: one factor is ' + t('(x' + sT(-o.r0) + ')') + '.'], text: 'k and the other zero' });
      } }] }
  ];

  HW.defineLesson({ id: LID, unit: 5, num: '1', title: 'Zeros, Roots and x-Intercepts', outcome: 'RF5', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
