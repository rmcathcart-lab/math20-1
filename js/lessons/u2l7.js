/* Math 20-1 · Unit 2 · Lesson 7 — Unit 2 Review (outcome AN2 on every part). No calculator: every answer exact, in simplest form.
 * Assignment 7 (u2_l07.tex: Written Response 1–15, then Multiple Choice and Numerical Response 16–27) and the Lesson 7
 * Extra Practice, a second practice test (u2_ep07.tex: A. Multiple Choice 1–10, B. Numerical Response 11–14, C. Written
 * Response 15–18). Every part is a generator: the booklet question's idea, form and difficulty with new numbers; the
 * lesson's example numbers and the booklet question's own numbers are left out.
 * Checking: radical answers are any expression equal to the key (variables compared at several positive values), then a
 * simplest-form check that nudges without using a try — no perfect-power factor under a root, no fraction under a root,
 * no radical in a denominator, like radicals combined, no brackets left, fraction reduced (formIssue below). Restrictions
 * are inequalities checked with K.set (x ≥ 3 / 3 ≤ x / x ∈ ℝ). Mixed/entire radicals use the shared K.radical /
 * K.varRadical checkers. All helpers are local to this file; the only globals are the keypads u2l7rad, u2l7var and
 * u2l7ineq (W.KEYSETS), registered when the widgets are loaded.
 * Conversions: "show that" items ask for the value being shown (12a the length, 15a x² and the left side, 15b the
 * rationalized value, 17a the length, 18a the value of the sum); 13(a) "explain the mistake" -> multiple choice of
 * explanations; 14(b) and 18(b) "give two irrational numbers…" -> boxes checked for any valid example; 18(c) "which rule
 * does it break and simplify" -> a multiple choice (18c) and the simplification (18d).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 9(d), 21, Extra 13, Extra 16(b), Extra 17(c). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, P = K.P;
  var LID = 'u2l7';

  var CODES = {
    'u2l7-rad-den': 'Radical left in a denominator', 'u2l7-frac-under': 'Fraction left under a radical', 'u2l7-like': 'Like radicals not combined', 'u2l7-expand': 'Brackets not multiplied out',
    'u2l7-neg-den': 'Negative sign in the denominator', 'u2l7-neg-rad': 'Negative left inside a cube root', 'u2l7-coef': 'Forgot to multiply by the coefficient in front',
    'u2l7-add-radicands': 'Added or subtracted the radicands', 'u2l7-unlike': 'Combined unlike radicals', 'u2l7-var-out': 'Dropped the variable that came out of the root',
    'u2l7-middle-term': 'Squared a binomial without the middle term', 'u2l7-coef-square': 'Did not square the coefficient', 'u2l7-foil': 'Multiplied only the first and last terms',
    'u2l7-conj-den': 'Conjugate: denominator worked out as a² + b', 'u2l7-den-only': 'Rationalized only the denominator', 'u2l7-den-m': 'Denominator after rationalizing wrong',
    'u2l7-den-simplify': 'Did not simplify the radical in the denominator first', 'u2l7-cube-den': 'Cube root: multiplied by the wrong radical', 'u2l7-one-term': 'Divided only one term of the numerator',
    'u2l7-no-power': 'Did not raise the coefficient to the index before moving it inside', 'u2l7-var-exp': 'Did not divide the variable exponent by the index',
    'u2l7-ineq-flip': 'Restriction: inequality not flipped after dividing by a negative', 'u2l7-strict': 'Restriction: used > instead of ≥', 'u2l7-den-zero': 'Restriction: allowed a zero denominator',
    'u2l7-odd': 'Restriction: restricted an odd-index radical', 'u2l7-ineq-div': 'Restriction: divided the wrong way', 'u2l7-hyp-add': 'Hypotenuse: added the legs',
    'u2l7-no-root': 'Gave c² instead of c', 'u2l7-perim-hyp': 'Perimeter: left out a side', 'u2l7-half': 'Triangle area: forgot the ½', 'u2l7-half-perim': 'Perimeter: did not double',
    'u2l7-conj-sign': 'Multiplied by the width instead of its conjugate', 'u2l7-k-square': 'Chose a rational square root', 'u2l7-not-rational': 'Example does not give a rational result',
    'u2l7-x-rational': 'Chose a rational number', 'u2l7-kth': 'Picked the wrong place in the order'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u2l7-coef': 'b', 'u2l7-add-radicands': 'n', 'u2l7-unlike': 'n', 'u2l7-var-out': 's', 'u2l7-middle-term': 'b', 'u2l7-coef-square': 'b', 'u2l7-foil': 'b',
    'u2l7-conj-den': 's', 'u2l7-den-only': 'b', 'u2l7-den-m': 's', 'u2l7-den-simplify': 's', 'u2l7-cube-den': 'b', 'u2l7-one-term': 'b', 'u2l7-no-power': 'b', 'u2l7-var-exp': 'b',
    'u2l7-ineq-flip': 's', 'u2l7-strict': 's', 'u2l7-den-zero': 's', 'u2l7-odd': 'n', 'u2l7-ineq-div': 'b', 'u2l7-hyp-add': 'n', 'u2l7-no-root': 's', 'u2l7-perim-hyp': 'b',
    'u2l7-half': 's', 'u2l7-half-perim': 's', 'u2l7-conj-sign': 'b', 'u2l7-k-square': 'b', 'u2l7-not-rational': 'n', 'u2l7-x-rational': 'b', 'u2l7-kth': 'b' });

  /* ---------------- keypads (registered only where the widgets are loaded) ---------------- */
  (function () {
    var W = HW.widgets; if (!W || !W.KEYSETS) return;
    function d(n) { return { label: String(n), tex: String(n), plain: String(n) }; }
    var KY = {
      del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      enter: { label: 'Check ↵', fn: 'enter', wide: true }, sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' }, cbrt: { label: '∛', tex: '\\sqrt[3]{#0}', plain: 'cbrt(', title: 'Cube root' },
      nrt: { label: '<sup>n</sup>√', tex: '\\sqrt[#?]{#0}', plain: '\\sqrt[]{}', title: 'Root with any index' }, frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' },
      par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Brackets' }, plus: { label: '+', tex: '+', plain: '+' }, minus: { label: '−', tex: '-', plain: '-' },
      times: { label: '×', tex: '\\times', plain: ' × ', title: 'Multiply' }, pow: { label: 'x<sup>n</sup>', tex: '#@^{#?}', plain: '^', title: 'Exponent' }, dot: { label: '.', tex: '.', plain: '.' },
      le: { label: '≤', tex: '\\le ', plain: ' <= ' }, lt: { label: '<', tex: '<', plain: ' < ' }, ge: { label: '≥', tex: '\\ge ', plain: ' >= ' }, gt: { label: '>', tex: '>', plain: ' > ' },
      inn: { label: '∈', tex: '\\in ', plain: ' in ', title: 'is an element of' }, R: { label: 'ℝ', tex: '\\mathbb{R}', plain: 'R', title: 'the real numbers' }
    };
    W.KEYSETS.u2l7rad = [[d(7), d(8), d(9), KY.sqrt, KY.cbrt, KY.nrt, KY.del], [d(4), d(5), d(6), KY.frac, KY.par, KY.times, KY.clear], [d(1), d(2), d(3), KY.plus, KY.minus, KY.left, KY.right], [d(0), KY.enter]];
    W.KEYSETS.u2l7var = function (opt) {
      var vs = (opt && opt.vars && opt.vars.length ? opt.vars : ['x']).slice(0, 3).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; });
      return [[d(7), d(8), d(9), KY.sqrt, KY.cbrt, KY.nrt, KY.del], [d(4), d(5), d(6), KY.frac, KY.par, KY.pow, KY.clear], [d(1), d(2), d(3), KY.plus, KY.minus, KY.left, KY.right], [d(0)].concat(vs, [KY.times, KY.enter])];
    };
    W.KEYSETS.u2l7ineq = function (opt) {
      var v = (opt && opt.vars && opt.vars[0]) || 'x', vk = { label: '<i>' + v + '</i>', tex: v, plain: v };
      return [[d(7), d(8), d(9), KY.le, KY.lt, KY.del], [d(4), d(5), d(6), KY.ge, KY.gt, KY.clear], [d(1), d(2), d(3), KY.minus, KY.frac, KY.left, KY.right], [d(0), KY.dot, vk, KY.inn, KY.R, KY.enter]];
    };
    if (W.KEYHELP) {
      W.KEYHELP.u2l7rad = ['Use <b>√</b>, <b>∛</b> or <b><sup>n</sup>√</b> for roots and <b><sup>a</sup>⁄<sub>b</sub></b> for a fraction, e.g. ' + HW.k('\\frac{3\\sqrt{5}-3}{2}') + '. Press <b>▶</b> to step out of a root or a fraction.', 'Type e.g. <code>3sqrt(5) - 2</code> or <code>(3sqrt(5) - 3)/2</code>; cube roots as <code>cbrt(4)</code>.'];
      W.KEYHELP.u2l7var = ['Type the number, then the variables, then the root, e.g. ' + HW.k('7a\\sqrt{3a}') + '. Use <b>x<sup>n</sup></b> for exponents and <b>▶</b> to step out of a box.', 'Type e.g. <code>7a sqrt(3a)</code> or <code>(x + 2sqrt(x))/(x - 4)</code>.'];
      W.KEYHELP.u2l7ineq = ['Write the restriction as an inequality, e.g. ' + HW.k('x\\ge -3') + ' or ' + HW.k('x\\le\\frac{7}{2}') + '. If every real number works, write ' + HW.k('x\\in\\mathbb{R}') + '.', 'Type e.g. <code>x >= -3</code>, <code>x <= 7/2</code>, or <code>x in R</code> for any real number.'];
    }
  })();

  /* ---------------- small helpers ---------------- */
  var SF2 = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15], CF3 = [2, 3, 4, 5, 6, 7, 9, 10];
  function gen(make, test) { for (var i = 0; i < 3000; i++) { var v = make(); if (!test || test(v)) return v; } throw new Error(LID + ': could not find parameters'); }
  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  function isSqN(n) { var s = Math.round(Math.sqrt(n)); return n >= 0 && s * s === n; }
  function isCubeN(n) { var s = Math.round(Math.cbrt(n)); return s * s * s === n; }
  function pw(v, e) { return e === 1 ? v : v + '^{' + e + '}'; }
  function cf(k) { return k === 1 ? '' : k === -1 ? '-' : String(k); }
  function frT(p, q) { var r = ex.norm(p, q); return qT(r); }
  /* multiple choice from LaTeX strings (right first); wrongs = [[latex, why]] */
  function mcT(r, prompt, right, wrongs, sol, hints, text, plain) {
    var w = plain ? function (s) { return s; } : t;
    var opts = [{ html: w(right), right: true }].concat(wrongs.map(function (x) { return { html: w(x[0]), why: x[1] }; }));
    var seen = {}; opts.forEach(function (o) { if (seen[o.html]) throw new Error(LID + ': repeated choice ' + o.html); seen[o.html] = 1; });
    return P.mc(r, prompt, opts, sol, hints, text);
  }
  function nrP(prompt, ans, cands, sol, hints, text) {
    if (!(ans >= 0 && ans <= 9999 && Number.isInteger(ans))) throw new Error(LID + ': NR answer out of range ' + ans);
    var p = P.nr(prompt, ans, function (v) { for (var i = 0; i < (cands || []).length; i++) if (cands[i][0] === v) return { code: cands[i][1], hint: cands[i][2] }; return null; }, sol, hints, text);
    p.bad = (cands || []).map(function (c) { return String(c[0]); }).filter(function (s) { return Number(s) !== ans && s.length <= 4; });
    return p;
  }
  /* a restriction: an inequality (or x ∈ ℝ); wrongs = [[latex, code, hint]] */
  function ineqP(prompt, keyTex, wrongs, sol, hints, text) {
    var ck = K.set(keyTex, { wrong: wrongs.map(function (w) { return { is: w[0], code: w[1], hint: w[2] }; }), tag: false });
    var p = P.math(prompt, ck, keyTex, sol, hints, text, { keys: 'u2l7ineq', vars: ['x'], placeholder: 'e.g. x >= -3' });
    p.bad = wrongs.map(function (w) { return w[0]; });
    return p;
  }
  /* a shared-checker math part (K.radical / K.varRadical) with extra recognised wrong answers */
  function varP(prompt, chk, keyTex, vars, sol, hints, text) {
    var p = P.math(prompt, chk, keyTex, sol, hints, text, { keys: 'u2l7var', vars: vars });
    p.bad = chk.cands || []; return p;
  }
  /* ---------------- drawings ---------------- */
  function svgWrap(w, h, body) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" style="max-width:' + w + 'px;display:block;margin:6px 0" role="img" fill="none" stroke="currentColor" stroke-width="1.6" font-size="14" font-family="KaTeX_Main,\'Times New Roman\',serif">' + body + '</svg>'; }
  function txt(x, y, s, anchor) { return '<text x="' + x + '" y="' + y + '" fill="currentColor" stroke="none" text-anchor="' + (anchor || 'middle') + '">' + s + '</text>'; }
  /* "3√2 cm" for SVG text; parts = [[k, m]] (m = 1: a whole number), joined with signs */
  function radLab(parts, unit) {
    return parts.map(function (p, i) { var a = Math.abs(p[0]), s = p[0] < 0 ? ' − ' : i ? ' + ' : ''; return s + (p[1] === 1 ? a : (a === 1 ? '' : a) + '√<tspan text-decoration="overline">' + p[1] + '</tspan>'); }).join('') + (unit ? ' ' + unit : '');
  }
  function triFig(l1, l2, unit) {
    var W = 190, H = 110, x0 = 92, y0 = 12;
    return svgWrap(320, H + 44, '<path d="M' + x0 + ' ' + y0 + ' L' + x0 + ' ' + (y0 + H) + ' L' + (x0 + W) + ' ' + (y0 + H) + ' Z"/><path stroke-width="1.2" d="M' + x0 + ' ' + (y0 + H - 12) + ' h12 v12"/>' +
      txt(x0 + W / 2, y0 + H + 22, radLab(l2, unit)) + txt(x0 - 8, y0 + H / 2 + 5, radLab(l1, unit), 'end') + '<text x="' + (x0 + W / 2 + 14) + '" y="' + (y0 + H / 2 - 4) + '" fill="currentColor" stroke="none" font-style="italic">c</text>');
  }
  function rectFig(len, wid, unit, area) {
    var W = 200, H = 90, x0 = 30, y0 = 26;
    return svgWrap(360, H + 40, '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '"/>' + txt(x0 + W / 2, y0 - 8, len) + txt(x0 + W + 8, y0 + H / 2 + 5, radLab(wid, unit), 'start') +
      (area ? txt(x0 + W / 2, y0 + H / 2 + 5, 'A = ' + area) : ''));
  }
  /* ======================= exact radical arithmetic (numbers only) =======================
   * A surd is { c:[p,q], n, m }: (p/q)·ⁿ√m with m free of perfect nth powers (n = 1, m = 1 for a rational number).
   * An expression is a list of surds, like radicals combined, kept in order of first appearance. */
  function R(c) { return typeof c === 'number' ? [c, 1] : c; }
  function gcd(a, b) { return ex.gcd(a, b); }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function rmul(a, b) { a = R(a); b = R(b); return ex.norm(a[0] * b[0], a[1] * b[1]); }
  function rdiv(a, b) { a = R(a); b = R(b); return ex.norm(a[0] * b[1], a[1] * b[0]); }
  function radd(a, b) { a = R(a); b = R(b); return ex.norm(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function ipow(a, n) { return Math.round(Math.pow(a, n)); }
  function sd(c, n, m) {
    c = R(c); if (m == null) { m = 1; n = 1; }
    if (m === 0 || c[0] === 0) return { c: [0, 1], n: 1, m: 1 };
    if (m < 0) { if (n % 2 === 0) throw new Error('even root of a negative'); m = -m; c = [-c[0], c[1]]; }
    if (n > 1) { var f = ex.nthFactor(m, n); c = rmul(c, f); m = m / ipow(f, n); }
    if (m === 1) n = 1;
    return { c: c, n: n, m: m };
  }
  function comb(list) {
    var out = [];
    list.forEach(function (s) {
      for (var i = 0; i < out.length; i++) if (out[i].n === s.n && out[i].m === s.m) { out[i] = { c: radd(out[i].c, s.c), n: s.n, m: s.m }; return; }
      out.push({ c: R(s.c), n: s.n, m: s.m });
    });
    return out.filter(function (s) { return s.c[0] !== 0; });
  }
  /* S(c, n, m, c2, n2, m2, …) or S([c, n, m], …): build an expression */
  function S() { var a = [].slice.call(arguments), out = []; if (Array.isArray(a[0]) && a[0].length === 3) a.forEach(function (x) { out.push(sd(x[0], x[1], x[2])); }); else for (var i = 0; i < a.length; i += 3) out.push(sd(a[i], a[i + 1], a[i + 2])); return comb(out); }
  function Q(c) { return comb([sd(c, 1, 1)]); }
  function smul(A, B) {
    var out = [];
    A.forEach(function (a) { B.forEach(function (b) {
      var c = rmul(a.c, b.c);
      if (a.n === 1) out.push(sd(c, b.n, b.m)); else if (b.n === 1) out.push(sd(c, a.n, a.m));
      else if (a.n === b.n) out.push(sd(c, a.n, a.m * b.m)); else throw new Error('different indices');
    }); });
    return comb(out);
  }
  function sadd(A, B) { return comb(A.concat(B)); }
  function sscale(A, k) { return comb(A.map(function (s) { return { c: rmul(s.c, k), n: s.n, m: s.m }; })); }
  function sneg(A) { return sscale(A, -1); }
  function sval(A) { return A.reduce(function (acc, s) { return acc + s.c[0] / s.c[1] * Math.pow(s.m, 1 / s.n); }, 0); }
  function isRat(A) { return A.every(function (s) { return s.n === 1; }); }
  function ratOf(A) { return A.length ? A[0].c : [0, 1]; }
  /* the conjugate of a binomial a + b√m (the middle sign changed) */
  function conj(A) { return A.map(function (s, i) { return i === A.length - 1 ? { c: [-s.c[0], s.c[1]], n: s.n, m: s.m } : s; }); }
  /* A ÷ D for a rational D */
  function sdivq(A, d) { return sscale(A, rdiv(1, d)); }
  function rootT(n, m) { return n === 1 ? '' : ex.texRoot(n, String(m)); }
  /* signed term: k (integer), rad = radical LaTeX ('' = none) */
  function tm(k, rad, first) { var a = Math.abs(k), s = k < 0 ? '-' : first ? '' : '+'; return s + (rad ? (a === 1 ? '' : a) + rad : a); }
  function jn(arr) { return arr.map(function (x, i) { return tm(x[0], x[1], i === 0); }).join(''); }
  /* LaTeX in simplest form: integer coefficients joined, or one fraction over the common denominator (booklet style) */
  function stex(A) {
    if (!A.length) return '0';
    var L = A.reduce(function (l, s) { return lcm(l, s.c[1]); }, 1);
    var parts = A.map(function (s) { return [s.c[0] * L / s.c[1], rootT(s.n, s.m)]; });
    if (L === 1) return jn(parts);
    if (parts.every(function (p) { return p[0] < 0; })) return '-\\frac{' + jn(parts.map(function (p) { return [-p[0], p[1]]; })) + '}{' + L + '}';
    return '\\frac{' + jn(parts) + '}{' + L + '}';
  }
  /* LaTeX of the unsimplified pieces, e.g. "3\sqrt{20}" for k = 3, n = 2, m = 20 */
  function mixT(k, n, m) { return tm(k, ex.texRoot(n, String(m)), true); }
  function sq(m) { return '\\sqrt{' + m + '}'; }
  function cr(m) { return '\\sqrt[3]{' + m + '}'; }
  /* LaTeX of a rational [p, q] */
  function qT(c) { return ex.texRat(R(c)); }

  /* ======================= checking: any expression equal to the key, in simplest form ======================= */
  function strip(a) { while (a && a.t === 'paren') a = a.a; return a; }
  function isSum(a) { a = strip(a); return !!a && (a.t === 'add' || a.t === 'sub'); }
  function has(a, tt) { var f = false; (function w(x) { if (!x || typeof x !== 'object' || f) return; if (x.t === tt) { f = true; return; } ['a', 'b', 'n'].forEach(function (k) { w(x[k]); }); })(a); return f; }
  function varsOf(a) { return Object.keys(ex.shape(a).vars).sort(); }
  function vkey(v) { return Object.keys(v).filter(function (x) { return v[x]; }).sort().map(function (x) { return x + v[x]; }).join(''); }
  var FI = {
    radDen: ['u2l7-rad-den', 'Right value — but simplest form has <b>no radical in a denominator</b>. Rationalize it: multiply the top and bottom by the radical (or the conjugate) that clears it.'],
    fracUnder: ['u2l7-frac-under', 'Right value — but simplest form has <b>no fraction under a radical</b>. Write it as a radical over a radical, then rationalize the denominator.'],
    like: ['u2l7-like', 'Right value — now <b>combine like radicals</b> (same index and same radicand) by adding their coefficients, and combine the whole numbers.'],
    expand: ['u2l7-expand', 'Right value — now multiply out the brackets and simplify (simplest form has no brackets left).'],
    negDen: ['u2l7-neg-den', 'Right value — put the negative sign in front of the fraction (or in the numerator), not in the denominator.'],
    negRad: ['u2l7-neg-rad', 'Right value — take the negative out of the cube root: ' + t('\\sqrt[3]{-a}=-\\sqrt[3]{a}') + '.'],
    one: ['one-radical', 'Right value — now multiply the radicals together into one radical: ' + t('\\sqrt[n]{a}\\cdot\\sqrt[n]{b}=\\sqrt[n]{ab}') + '.'],
    coef: ['simplify', 'Right value — now simplify the numbers into a single coefficient (reduce any fraction).'],
    evalPow: ['simplify', 'Right value — now work out the powers and simplify.'],
    dec: ['decimal', 'Right value — but give exact fractions, not decimals.'],
    simp: ['simplify', 'That has the right value, but simplify it further.'],
    den: ['simplify', 'Right value — now work out the denominator to a single whole number.']
  };
  function fi(k, hint) { return { code: FI[k][0], hint: hint || FI[k][1] }; }
  /* what is not simplest about one term (a product/quotient): returns { key, coef, iss } */
  function termInfo(a) {
    var fz = ex.factors(a), coef = [fz.sign, 1], nv = {}, dv = {}, root = null, nNum = 0, nDen = 0, numV = [1, 1], denV = [1, 1], iss = null;
    function set(i) { if (!iss) iss = i; }
    fz.num.forEach(function (x) {
      x = strip(x);
      if (x.t === 'num') { if (x.dec) set(fi('dec')); var r = ex.rat(x); if (!r) { set(fi('simp')); return; } coef = rmul(coef, r); numV = rmul(numV, r); nNum++; return; }
      if (x.t === 'var') { nv[x.n] = (nv[x.n] || 0) + 1; return; }
      if (x.t === 'pow') { var b = strip(x.a), e = ex.rat(x.b); if (b.t === 'var' && e && e[1] === 1 && e[0] > 0) { nv[b.n] = (nv[b.n] || 0) + e[0]; return; } set(isSum(b) ? fi('expand') : fi('evalPow')); return; }
      if (x.t === 'root') { if (root) set(fi('one')); else root = x; return; }
      if (x.t === 'add' || x.t === 'sub') { set(fi('expand')); return; }
      if (x.t === 'neg') { set(fi('simp')); return; }
      set(fi('simp'));
    });
    fz.den.forEach(function (x) {
      x = strip(x);
      if (has(x, 'root')) { set(fi('radDen')); return; }
      if (x.t === 'num') { if (x.dec) set(fi('dec')); var r = ex.rat(x); if (!r || !r[0]) { set(fi('simp')); return; } coef = rdiv(coef, r); denV = rmul(denV, r); nDen++; return; }
      if (x.t === 'var') { dv[x.n] = (dv[x.n] || 0) + 1; return; }
      if (x.t === 'pow') { var b = strip(x.a), e = ex.rat(x.b); if (b.t === 'var' && e && e[1] === 1 && e[0] > 0) { dv[b.n] = (dv[b.n] || 0) + e[0]; return; } set(fi('evalPow')); return; }
      if ((x.t === 'add' || x.t === 'sub') && has(x, 'var')) return; // e.g. (x − 4) under a term
      set(fi('den'));
    });
    if (nNum > 1 || nDen > 1 || numV[1] !== 1 || denV[1] !== 1) set(fi('coef'));
    else if (nNum && nDen && gcd(numV[0], denV[0]) > 1) set({ code: 'lowest', hint: 'Right value — now reduce the fraction: the top and bottom share the factor ' + t(gcd(numV[0], denV[0])) + '.' });
    if (Object.keys(nv).some(function (v) { return dv[v]; })) set(fi('simp', 'Right value — now cancel the variable that is in both the numerator and the denominator.'));
    var key = '1|1|';
    if (root) {
      var n = ex.rat(root.n); n = n && n[1] === 1 ? n[0] : null;
      var ra = root.a, mo = n && n >= 2 && !has(ra, 'div') && !has(ra, 'root') ? ex.mono(ra) : null;
      if (!n || n < 2) set(fi('simp'));
      else if (has(ra, 'div')) set(fi('fracUnder'));
      else if (!mo || mo.k[1] !== 1) set(fi('simp'));
      else {
        var m = mo.k[0], iv = mo.vars;
        if (m < 0 && n % 2) { set(fi('negRad')); m = -m; }
        if (m === 1 && !vkey(iv)) set(fi('simp', 'Right value — but ' + t(ex.texRoot(n, '1') + '=1') + ', so leave the radical out.'));
        else if (!ex.simplest(m, n)) { var f = ex.nthFactor(m, n); set({ code: 'not-simplest', hint: 'Right value, but not in simplest form yet: ' + t(F(m)) + ' still has the factor ' + t(ipow(f, n) + '=' + f + '^{' + n + '}') + '. Take ' + t(f) + ' out of the radical.' }); }
        var big = Object.keys(iv).filter(function (v) { return iv[v] >= n; });
        if (big.length) set({ code: 'not-simplest-var', hint: 'Right value, but ' + t(big[0] + '^{' + iv[big[0]] + '}') + ' under the radical still contains ' + t(big[0] + '^{' + n + '}') + '. Take it out of the radical.' });
        key = n + '|' + m + '|' + vkey(iv);
      }
    }
    var ov = {}; Object.keys(nv).forEach(function (v) { ov[v] = nv[v]; }); Object.keys(dv).forEach(function (v) { ov[v] = (ov[v] || 0) - dv[v]; });
    return { key: key + '#' + vkey(ov), coef: coef, iss: iss };
  }
  function flatTerms(a, s, out) {
    var b = strip(a);
    if (b.t === 'add') { flatTerms(b.a, s, out); flatTerms(b.b, s, out); return; }
    if (b.t === 'sub') { flatTerms(b.a, s, out); flatTerms(b.b, -s, out); return; }
    if (b.t === 'neg' && isSum(b.a)) { flatTerms(b.a, -s, out); return; }
    out.push(b);
  }
  /* null when the answer is in simplest form, else { code, hint } */
  function formIssue(ast) {
    var a = strip(ast);
    while (a.t === 'neg' || a.t === 'paren') a = strip(a.a);
    var terms = [], D = null;
    if (a.t === 'div' && (isSum(a.a) || isSum(a.b))) {
      if (has(a.b, 'root')) return fi('radDen');
      if (!has(a.b, 'var')) {
        var bb = strip(a.b), neg = false; if (bb.t === 'neg') { neg = true; bb = strip(bb.a); }
        if (bb.t !== 'num') return fi('den');
        if (bb.dec) return fi('dec');
        if (neg) return fi('negDen');
        if (bb.v === 1) return fi('simp', 'Right value — a denominator of ' + t(1) + ' can be left out.');
        D = bb.v;
      }
      flatTerms(a.a, 1, terms);
    } else flatTerms(a, 1, terms);
    var infos = terms.map(termInfo), seen = {};
    for (var i = 0; i < infos.length; i++) if (infos[i].iss) return infos[i].iss;
    for (var j = 0; j < infos.length; j++) { if (seen[infos[j].key]) return fi('like'); seen[infos[j].key] = 1; }
    if (D) {
      if (infos.some(function (x) { return x.coef[1] !== 1; })) return fi('coef', 'Right value — write the numerator with whole-number coefficients (no fraction inside a fraction).');
      var g = infos.reduce(function (acc, x) { return gcd(acc, x.coef[0]); }, D);
      if (g > 1) return { code: 'lowest', hint: 'Right value — now reduce: every term of the numerator and the denominator share the factor ' + t(g) + '. Divide it out.' };
    }
    return null;
  }
  function sameVal(a, b) {
    var vs = varsOf(a).concat(varsOf(b)).filter(function (v, i, arr) { return arr.indexOf(v) === i; });
    if (vs.length) return ex.equiv(a, b, vs, 6);
    return ex.eq(ex.value(a), ex.value(b), 1e-9);
  }
  function parseT(s) { var p = ex.parse(s); if (!p.ok) throw new Error(LID + ': bad LaTeX ' + s + ' (' + p.code + ')'); return p.ast; }
  /* cands: [[latex, code, hint]] — recognised wrong answers (dropped if equal to the key) */
  function radCheck(keyTex, opt) {
    opt = opt || {};
    var tp = parseT(keyTex), tv = varsOf(tp), V = tv.length ? null : ex.value(tp);
    if (formIssue(tp)) throw new Error(LID + ': key not in simplest form: ' + keyTex + ' ' + JSON.stringify(formIssue(tp)));
    var cands = (opt.cands || []).map(function (c) { return { tex: c[0], ast: parseT(c[0]), code: c[1], hint: c[2] }; }).filter(function (c) { return !sameVal(c.ast, tp); });
    var negT = { t: 'neg', a: tp };
    var chk = function (resp) {
      var r = K.read(resp); if (r.res) return r.res;
      var sv = varsOf(r.ast), extra = sv.filter(function (v) { return tv.indexOf(v) < 0; });
      if (extra.length) return wrong('var', 'Your answer has a variable ' + t(extra[0]) + ' that isn’t in the question.');
      var sh = ex.shape(r.ast);
      if (sameVal(r.ast, tp)) { var f = formIssue(r.ast); return f ? form(f.code, f.hint) : ok(); }
      if (!tv.length && sh.decimals && !sh.roots && isFinite(r.val) && Math.abs(r.val - V) < 0.01 * Math.max(1, Math.abs(V))) return form('decimal', 'That’s a decimal approximation. Give the <b>exact</b> answer (use the radical keys) — no calculator in this unit.');
      for (var i = 0; i < cands.length; i++) if (sameVal(r.ast, cands[i].ast)) return wrong(cands[i].code, cands[i].hint);
      if ((tv.length || V !== 0) && sameVal(r.ast, negT)) return wrong('sign', 'Check the sign of your answer.');
      return wrong('value', opt.miss || null);
    };
    chk.cands = cands.map(function (c) { return c.tex; });
    return chk;
  }
  /* a math part checked by radCheck. opt: cands, vars (extra keypad letters), before, after, good (other accepted forms) */
  function radP(prompt, keyTex, opt, sol, hints, text) {
    opt = opt || {};
    var ck = radCheck(keyTex, opt), vs = varsOf(parseT(keyTex)).concat(opt.vars || []).filter(function (v, i, arr) { return arr.indexOf(v) === i; });
    var p = K.P.math(prompt, ck, keyTex, sol, hints, text, { keys: vs.length ? 'u2l7var' : 'u2l7rad', vars: vs, before: opt.before, after: opt.after });
    p.bad = ck.cands.concat(opt.bad || []); if (opt.good) p.good = opt.good;
    return p;
  }
  /* recognised wrong answers on top of a shared checker (K.radical / K.varRadical) */
  function withCands(chk, keyTex, cands) {
    var tp = parseT(keyTex), cs = (cands || []).map(function (c) { return { tex: c[0], ast: parseT(c[0]), code: c[1], hint: c[2] }; }).filter(function (c) { return !sameVal(c.ast, tp); });
    var f = function (resp) {
      var res = chk(resp); if (res.v !== 'wrong' || (res.code !== 'value' && res.hint)) return res;
      var r = K.read(resp); if (r.res) return res;
      for (var i = 0; i < cs.length; i++) if (sameVal(r.ast, cs[i].ast)) return wrong(cs[i].code, cs[i].hint);
      return res;
    };
    f.cands = cs.map(function (c) { return c.tex; });
    return f;
  }

  /* =========================== Assignment 7 =========================== */
  /* Q1: entire -> mixed radical (shared K.radical) */
  function toMixed(r, n, lo, hi, avoid, neg, minA) {
    var z = gen(function () { return { a: r.int(minA || 2, n === 2 ? 9 : n === 3 ? 5 : 3), b: r.pick(n === 2 ? SF2.slice(0, 8) : n === 3 ? CF3 : [2, 3, 5, 6, 7]) }; },
      function (z) { var M = ipow(z.a, n) * z.b; return M >= lo && M <= hi && avoid.indexOf(M) < 0; });
    var M = ipow(z.a, n) * z.b, s = neg ? -1 : 1, P0 = ipow(z.a, n);
    var given = ex.texRoot(n, String(s * M));
    return P.radical(t(given), { k: s * z.a, n: n, m: z.b }, 'mixed',
      t(given + '=' + ex.texRoot(n, (neg ? '-' : '') + P0) + '\\cdot' + ex.texRoot(n, String(z.b)) + '=' + cf(s * z.a) + ex.texRoot(n, String(z.b))) + ' (' + t((neg ? '-' : '') + P0 + '=(' + (neg ? '-' : '') + z.a + ')^{' + n + '}') + ' is the largest perfect ' + (n === 2 ? 'square' : n === 3 ? 'cube' : 'fourth power') + ' factor).',
      ['Look for the largest perfect ' + (n === 2 ? 'square (4, 9, 16, 25, 36, 49, 64, 81, …)' : n === 3 ? 'cube (8, 27, 64, 125, …)' : 'fourth power (16, 81, 256, …)') + ' that divides ' + t(F(M)) + '.', t('\\sqrt[n]{a^n b}=a\\sqrt[n]{b}')], 'mixed radical');
  }
  /* Q2: restrictions */
  var EVEN = 'Even index: the radicand must be at least 0.';
  /* Q6, Extra 2: mixed radicals whose entire radicands lie in a window */
  function windowItems(r, nMixed, entire, avoidSets) {
    return gen(function () {
      var lo = r.int(40, 140), pool = [];
      for (var a = 2; a <= 9; a++) SF2.forEach(function (b) { var v = a * a * b; if (v >= lo && v <= lo + 12) pool.push({ a: a, b: b, v: v }); });
      if (pool.length < nMixed) return null;
      var pick = r.sample(pool, nMixed), vals = pick.map(function (x) { return x.v; });
      if (vals.some(function (v, i) { return vals.indexOf(v) !== i; })) return null;
      var items = pick.map(function (x, i) { return { id: 'm' + i, tex: x.a + sq(x.b), v: x.v, conv: x.a + sq(x.b) + '=\\sqrt{' + x.a * x.a + '\\times ' + x.b + '}=' + sq(x.v) }; });
      if (entire) {
        var es = []; for (var n = lo; n <= lo + 12; n++) if (vals.indexOf(n) < 0 && ex.simplest(n, 2) && !isSqN(n)) es.push(n);
        var sqs = []; for (var k = 7; k <= 12; k++) if (k * k >= lo && k * k <= lo + 12 && vals.indexOf(k * k) < 0) sqs.push(k);
        if (sqs.length && r.chance(0.35)) { var k2 = r.pick(sqs); items.push({ id: 'e', tex: String(k2), v: k2 * k2, conv: k2 + '=' + sq(k2 * k2) }); }
        else if (es.length) { var e = r.pick(es); items.push({ id: 'e', tex: sq(e), v: e, conv: sq(e) + '\\ \\text{(already entire)}' }); }
        else return null;
      }
      var key = items.map(function (x) { return x.v; }).sort().join();
      if ((avoidSets || []).indexOf(key) >= 0) return null;
      return items;
    }, function (v) { return !!v; });
  }

  var QUESTIONS = [
    { num: '1', section: 'Written Response', stem: 'Express each radical as a mixed radical in simplest form.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return toMixed(r, 2, 40, 200, [98, 72, 50, 18, 32, 75, 48, 45, 20, 80]); } },
      { id: '1b', level: 'EMG', make: function (r) { return toMixed(r, 2, 120, 450, [180, 98, 147, 150], false, 4); } },
      { id: '1c', level: 'PRG', make: function (r) { return toMixed(r, 3, 16, 600, [108, 40, 128, 250, 54]); } },
      { id: '1d', level: 'PRG', make: function (r) { return toMixed(r, 4, 32, 600, [162]); } },
      { id: '1e', level: 'EMG', make: function (r) { return toMixed(r, 3, 16, 600, [375, 54, 250, 16, 24, 81, 128]); } },
      { id: '1f', level: 'PRG', make: function (r) {
        var z = gen(function () { return { q: r.pick([2, 3]), j: r.int(2, 4), b: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { var M = z.q * z.q * z.j * z.j * z.b; return M <= 500 && !(z.q === 2 && M === 96); });
        var A = z.q * z.j, M = A * A * z.b;
        return P.radical(t('\\frac{1}{' + z.q + '}\\sqrt{' + M + '}'), { k: z.j, n: 2, m: z.b }, 'mixed',
          t('\\frac{1}{' + z.q + '}\\sqrt{' + M + '}=\\frac{1}{' + z.q + '}\\sqrt{' + A * A + '}\\sqrt{' + z.b + '}=\\frac{1}{' + z.q + '}(' + A + '\\sqrt{' + z.b + '})=' + cf(z.j) + sq(z.b)),
          ['Simplify the radical first, then multiply by ' + t('\\frac{1}{' + z.q + '}') + '.'], 'mixed radical with a fraction in front');
      } }] },
    { num: '2', stem: 'State the restriction on the variable for which each expression is defined (a real number).', parts: [
      { id: '2a', level: 'BEG', make: function (r) {
        var z = gen(function () { return { a: r.int(2, 12), s: r.pick([1, 1, -1]) }; }, function (z) { return !(z.a === 6 && z.s === 1) && !(z.s === -1 && (z.a === 9 || z.a === 1)); });
        var b = -z.s * z.a; // x ≥ b
        return ineqP(t('\\sqrt{x' + (z.s > 0 ? '+' : '-') + z.a + '}'), 'x\\ge ' + b, [['x\\ge ' + (-b), 'sign', 'Check the sign: solve ' + t('x' + (z.s > 0 ? '+' : '-') + z.a + '\\ge 0') + '.'], ['x>' + b, 'u2l7-strict', 'The radicand can equal 0 (' + t('\\sqrt{0}=0') + '), so use ' + t('\\ge') + '.'], ['x\\le ' + b, 'u2l7-ineq-flip', 'The radicand must be <b>at least</b> 0: ' + t('x' + (z.s > 0 ? '+' : '-') + z.a + '\\ge 0') + '.']],
          EVEN + ' ' + t('x' + (z.s > 0 ? '+' : '-') + z.a + '\\ge 0') + ', so ' + t('x\\ge ' + b) + '.', ['Set the radicand ' + t('\\ge 0') + ' and solve.'], 'restriction');
      } },
      { id: '2b', level: 'PRG', make: function (r) {
        var z = gen(function () { return { c: r.int(2, 5), k: r.int(2, 9) }; }, function (z) { return !(z.c === 3 && z.k === 4); });
        var b = z.c * z.k;
        return ineqP(t('\\sqrt{' + b + '-' + z.c + 'x}'), 'x\\le ' + z.k, [['x\\ge ' + z.k, 'u2l7-ineq-flip', 'Dividing both sides of an inequality by a <b>negative</b> number flips the sign.'], ['x\\le ' + (-z.k), 'sign', 'Check the sign: ' + t('-' + z.c + 'x\\ge -' + b) + '.'], ['x<' + z.k, 'u2l7-strict', 'The radicand can equal 0, so use ' + t('\\le') + '.'], ['x\\ge ' + (-z.k), 'sign', 'Solve ' + t(b + '-' + z.c + 'x\\ge 0') + ' carefully.']],
          EVEN + ' ' + t(b + '-' + z.c + 'x\\ge 0\\ \\Rightarrow\\ -' + z.c + 'x\\ge -' + b + '\\ \\Rightarrow\\ x\\le ' + z.k) + ' (dividing by ' + t('-' + z.c) + ' flips the sign).', ['Set the radicand ' + t('\\ge 0') + '.', 'When you divide by a negative number, flip the inequality.'], 'restriction with a sign flip');
      } },
      { id: '2c', level: 'EMG', make: function (r) {
        var z = gen(function () { return { p: r.int(2, 5), q: r.int(1, 9) * r.pick([1, -1]) }; }, function (z) { return !(z.p === 2 && z.q === 1) && z.q % z.p !== 0; });
        var bnd = frT(-z.q, z.p);
        return ineqP(t('\\sqrt[3]{' + z.p + 'x' + (z.q > 0 ? '+' : '-') + Math.abs(z.q) + '}'), 'x\\in\\mathbb{R}', [['x\\ge ' + bnd, 'u2l7-odd', 'This is a <b>cube</b> root (odd index): the cube root of a negative number is a real number, e.g. ' + t('\\sqrt[3]{-8}=-2') + '. There is no restriction.'], ['x>' + bnd, 'u2l7-odd', 'Odd index: any real radicand works, so there is no restriction.'], ['x\\le ' + bnd, 'u2l7-odd', 'Odd index: any real radicand works, so there is no restriction.']],
          'Odd index: the cube root of any real number is real (' + t('\\sqrt[3]{-8}=-2') + '), so there is <b>no restriction</b>: ' + t('x\\in\\mathbb{R}') + '.', ['Is the index even or odd?'], 'restriction: odd index');
      } },
      { id: '2d', level: 'BEG', make: function (r) {
        var z = gen(function () { return { k: r.int(2, 7), p: r.int(2, 9) }; }, function (z) { return !(z.k === 4 && z.p === 5); });
        return ineqP(t(z.k + '\\sqrt{' + z.p + 'x}'), 'x\\ge 0', [['x>0', 'u2l7-strict', 'The radicand can equal 0: ' + t(z.k + '\\sqrt{0}=0') + ' is defined.'], ['x\\le 0', 'u2l7-ineq-flip', t(z.p + 'x') + ' must be at least 0.'], ['x\\ge ' + z.p, 'value', 'Solve ' + t(z.p + 'x\\ge 0') + ': divide both sides by ' + t(z.p) + '.']],
          EVEN + ' ' + t(z.p + 'x\\ge 0') + ', so ' + t('x\\ge 0') + '. (The ' + t(z.k) + ' in front does not matter.)', ['Only the radicand matters.'], 'restriction');
      } },
      { id: '2e', level: 'PRG', make: function (r) {
        var z = gen(function () { return { c: r.int(2, 5), b: r.int(1, 15) }; }, function (z) { return z.b % z.c !== 0 && !(z.b === 7 && z.c === 2) && ex.gcd(z.b, z.c) === 1; });
        var B = frT(z.b, z.c), Bi = frT(z.c, z.b);
        return ineqP(t('\\sqrt[4]{' + z.b + '-' + z.c + 'x}'), 'x\\le ' + B, [['x\\ge ' + B, 'u2l7-ineq-flip', 'Dividing by a <b>negative</b> number flips the inequality.'], ['x\\le ' + Bi, 'u2l7-ineq-div', 'Divide ' + t(z.b) + ' by ' + t(z.c) + ' (not the other way round).'], ['x<' + B, 'u2l7-strict', 'The radicand can equal 0, so use ' + t('\\le') + '.'], ['x\\le -' + B, 'sign', 'Check the sign.']],
          'Even index (4): ' + t(z.b + '-' + z.c + 'x\\ge 0\\ \\Rightarrow\\ -' + z.c + 'x\\ge -' + z.b + '\\ \\Rightarrow\\ x\\le ' + B) + '.', ['A fourth root has an even index: the radicand must be ' + t('\\ge 0') + '.', 'Leave the answer as a fraction.'], 'restriction with a fraction');
      } },
      { id: '2f', level: 'ADV', make: function (r) {
        var z = gen(function () { return { k: r.int(2, 9), a: r.int(1, 9), s: r.pick([1, -1]) }; }, function (z) { return !(z.s === 1 && z.a === 2) && !(z.s === -1 && z.a === 1); });
        var b = -z.s * z.a;
        return ineqP(t('\\dfrac{' + z.k + '}{\\sqrt{x' + (z.s > 0 ? '+' : '-') + z.a + '}}'), 'x>' + b, [['x\\ge ' + b, 'u2l7-den-zero', 'The radical is in a <b>denominator</b>, so it cannot equal 0: the radicand must be <b>greater than</b> 0.'], ['x>' + (-b), 'sign', 'Check the sign: solve ' + t('x' + (z.s > 0 ? '+' : '-') + z.a + '>0') + '.'], ['x<' + b, 'u2l7-ineq-flip', 'The radicand must be positive.']],
          'The radicand must be ' + t('\\ge 0') + ', and a denominator cannot be 0, so ' + t('x' + (z.s > 0 ? '+' : '-') + z.a + '>0') + ': ' + t('x>' + b) + '.', ['Even index: radicand ' + t('\\ge 0') + '. In a denominator it also cannot be 0.'], 'restriction: radical in a denominator');
      } }] },
    { num: '3', stem: 'Simplify.', parts: [
      { id: '3a', level: 'PRG', make: function (r) {
        var z = gen(function () { return { m: r.pick([2, 3, 5, 6, 7]), p: r.int(2, 5), q: r.int(2, 5), rr: r.int(2, 5), a: r.int(2, 3), b: r.int(2, 3), s2: r.pick([-1, -1, 1]), s3: r.pick([1, 1, -1]) }; },
          function (z) { var T = z.a * z.p + z.s2 * z.q + z.s3 * z.b * z.rr; return T > 0 && z.p !== z.q && z.q !== z.rr && z.p !== z.rr && z.rr * z.rr * z.m <= 200 && z.p * z.p * z.m <= 200 && z.q * z.q * z.m <= 200 && !(z.m === 5 && z.p === 2 && z.q === 3 && z.rr === 4) && z.m !== 2; });
        var T = z.a * z.p + z.s2 * z.q + z.s3 * z.b * z.rr, key = stex(S(T, 2, z.m));
        var shown = jn([[z.a, sq(z.p * z.p * z.m)], [z.s2, sq(z.q * z.q * z.m)], [z.s3 * z.b, sq(z.rr * z.rr * z.m)]]);
        var mid = jn([[z.a * z.p, sq(z.m)], [z.s2 * z.q, sq(z.m)], [z.s3 * z.b * z.rr, sq(z.m)]]);
        var T0 = z.p + z.s2 * z.q + z.s3 * z.rr, rs = z.a * z.p * z.p * z.m + z.s2 * z.q * z.q * z.m + z.s3 * z.b * z.rr * z.rr * z.m;
        return radP(t(shown), key, { cands: [[stex(S(T0, 2, z.m)), 'u2l7-coef', 'Multiply the number in front by what comes out of the root, e.g. ' + t(z.a + sq(z.p * z.p * z.m) + '=' + z.a + '(' + z.p + sq(z.m) + ')=' + (z.a * z.p) + sq(z.m)) + '.']].concat(rs > 0 ? [[sq(rs), 'u2l7-add-radicands', 'You can’t combine the numbers under the roots. Simplify each radical first; then they are like radicals.']] : []) },
          t(shown + '=' + mid + '=' + key), ['Simplify every radical first: they all become multiples of ' + t(sq(z.m)) + '.', 'Then add the coefficients of the like radicals.'], 'adding radicals');
      } },
      { id: '3b', level: 'PRG', make: function (r) {
        var z = gen(function () { var ms = r.sample([2, 3, 5, 6, 7], 2); return { m1: ms[0], m2: ms[1], a: r.int(2, 6), b: r.int(2, 6), c: r.int(2, 6), d: r.int(2, 6) }; },
          function (z) { var v = [z.a * z.a * z.m1, z.b * z.b * z.m1, z.c * z.c * z.m2, z.d * z.d * z.m2]; return z.a > z.b && z.c !== z.d && v.every(function (x) { return x <= 200; }) && !(z.m1 === 2 && z.a === 6 && z.b === 5 && z.m2 === 3 && z.c === 3 && z.d === 2); });
        var A = S(z.a - z.b, 2, z.m1, z.c - z.d, 2, z.m2), key = stex(A);
        var shown = jn([[1, sq(z.a * z.a * z.m1)], [-1, sq(z.b * z.b * z.m1)], [1, sq(z.c * z.c * z.m2)], [-1, sq(z.d * z.d * z.m2)]]);
        var mid = jn([[z.a, sq(z.m1)], [-z.b, sq(z.m1)], [z.c, sq(z.m2)], [-z.d, sq(z.m2)]]);
        var cands = []; if (z.a - z.b === 1 && z.c - z.d === 1) cands.push([sq(z.m1 + z.m2), 'u2l7-unlike', 'Only like radicals combine: ' + t(sq(z.m1) + '+' + sq(z.m2) + '\\ne' + sq(z.m1 + z.m2)) + '.']);
        if ((z.a - z.b) + (z.c - z.d) !== 0) cands.push([stex(S((z.a - z.b) + (z.c - z.d), 2, z.m1 * z.m2)), 'u2l7-unlike', 'Only like radicals (same radicand) combine. ' + t(sq(z.m1)) + ' and ' + t(sq(z.m2)) + ' stay separate.']);
        return radP(t(shown), key, { cands: cands }, t(shown + '=' + mid + '=' + key), ['Simplify each radical.', 'Collect the ' + t(sq(z.m1)) + ' terms and the ' + t(sq(z.m2)) + ' terms separately.'], 'two kinds of like radicals');
      } },
      { id: '3c', level: 'PRG', make: function (r) {
        var z = gen(function () { return { m: r.pick([2, 3, 4, 5]), k: r.int(2, 3), a: r.int(2, 5), b: r.int(2, 5), c: r.int(2, 5) }; },
          function (z) { var T = z.k * z.a - z.b + z.c; return T > 0 && z.a !== z.b && z.b !== z.c && z.a !== z.c && [z.a, z.b, z.c].every(function (x) { return x * x * x * z.m <= 500; }) && z.m !== 2 && !(z.m === 3 && z.k === 2 && z.a === 2 && z.b === 3 && z.c === 5); });
        var T = z.k * z.a - z.b + z.c, key = stex(S(T, 3, z.m)), c3 = function (v) { return cr(v * v * v * z.m); };
        var shown = jn([[z.k, c3(z.a)], [-1, c3(z.b)], [1, c3(z.c)]]), mid = jn([[z.k * z.a, cr(z.m)], [-z.b, cr(z.m)], [z.c, cr(z.m)]]);
        return radP(t(shown), key, { cands: [[stex(S(z.a - z.b + z.c, 3, z.m)), 'u2l7-coef', 'Multiply the ' + t(z.k) + ' in front by what comes out of its cube root.']] },
          t(shown + '=' + mid + '=' + key), ['Look for perfect cube factors (8, 27, 64, 125).', 'Then combine the like cube roots.'], 'adding cube roots');
      } },
      { id: '3d', level: 'ADV', make: function (r) {
        var z = gen(function () { return { L: r.pick(['a', 'x', 'y', 'b']), m: r.pick([2, 3, 5, 6, 7]), p: r.int(2, 5), q: r.int(2, 5), k: r.int(1, 3) }; },
          function (z) { var T = z.p + z.q - z.k; return T > 1 && z.p !== z.q && z.p * z.p * z.m <= 150 && z.q * z.q * z.m <= 150 && !(z.m === 3 && z.p === 4 && z.q === 5 && z.k === 2) && !(z.m === 3 && z.p === 2 && z.q === 3); });
        var L = z.L, T = z.p + z.q - z.k, key = T + L + '\\sqrt{' + z.m + L + '}';
        var shown = '\\sqrt{' + z.p * z.p * z.m + L + '^{3}}+' + L + '\\sqrt{' + z.q * z.q * z.m + L + '}-' + cf(z.k) + '\\sqrt{' + z.m + L + '^{3}}';
        var mid = z.p + L + '\\sqrt{' + z.m + L + '}+' + z.q + L + '\\sqrt{' + z.m + L + '}-' + cf(z.k) + L + '\\sqrt{' + z.m + L + '}';
        return radP(t(shown) + ', ' + t(L + '\\ge 0'), key, { cands: [[T + '\\sqrt{' + z.m + L + '}', 'u2l7-var-out', 'Check each term: ' + t('\\sqrt{' + L + '^{3}}=' + L + '\\sqrt{' + L + '}') + ', so every term has an ' + t(L) + ' in front of the root.'], [(z.p + z.q + z.k) + L + '\\sqrt{' + z.m + L + '}', 'sign', 'Check the sign of the last term.']] },
          t(shown + '=' + mid + '=' + key), ['Divide each exponent by the index 2: the quotient goes outside, the remainder stays inside.', 'Every term becomes a multiple of ' + t(L + '\\sqrt{' + z.m + L + '}') + '.'], 'adding radicals with variables');
      } }] },
    { num: '4', stem: 'Express each as an entire radical. Assume the variables are non-negative.', parts: [
      { id: '4a', level: 'BEG', make: function (r) {
        var z = gen(function () { return { c: r.int(3, 9), m: r.pick([2, 3, 5, 6, 7, 10, 11]) }; }, function (z) { return z.c * z.c * z.m <= 500 && !(z.c === 6 && z.m === 3) && !(z.c === 4 && z.m === 3) && !(z.c === 3 && z.m === 5) && !(z.c === 5 && z.m === 2); });
        return P.radical(t(z.c + sq(z.m)), { k: z.c, n: 2, m: z.m }, 'entire', t(z.c + sq(z.m) + '=\\sqrt{' + z.c + '^{2}\\cdot ' + z.m + '}=\\sqrt{' + z.c * z.c + '\\cdot ' + z.m + '}=' + sq(z.c * z.c * z.m)), ['Square the coefficient and multiply it into the radicand.'], 'entire radical');
      } },
      { id: '4b', level: 'PRG', make: function (r) {
        var z = gen(function () { return { c: r.int(2, 4), m: r.pick([2, 3, 4, 5, 6, 7, 9]) }; }, function (z) { return !(z.c === 2 && z.m === 9) && !(z.c === 3 && z.m === 2) && z.c * z.c * z.c * z.m <= 700; });
        var C = z.c * z.c * z.c;
        return P.radical(t('-' + z.c + cr(z.m)), { k: -z.c, n: 3, m: z.m }, 'entire', t('-' + z.c + cr(z.m) + '=\\sqrt[3]{(-' + z.c + ')^{3}\\cdot ' + z.m + '}=\\sqrt[3]{-' + C + '\\cdot ' + z.m + '}=\\sqrt[3]{-' + C * z.m + '}'), ['Cube the coefficient (a negative cubed stays negative).'], 'entire cube root');
      } },
      { id: '4c', level: 'PRG', make: function (r) {
        var z = gen(function () { return { c: r.int(2, 3), m: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return !(z.c === 3 && z.m === 2); });
        var C = ipow(z.c, 4);
        return P.radical(t(z.c + '\\sqrt[4]{' + z.m + '}'), { k: z.c, n: 4, m: z.m }, 'entire', t(z.c + '\\sqrt[4]{' + z.m + '}=\\sqrt[4]{' + z.c + '^{4}\\cdot ' + z.m + '}=\\sqrt[4]{' + C + '\\cdot ' + z.m + '}=\\sqrt[4]{' + C * z.m + '}'), ['Raise the coefficient to the power of the index, 4.'], 'entire fourth root');
      } },
      { id: '4d', level: 'ADV', make: function (r) {
        var z = gen(function () { var f = r.pick([[2, 3], [3, 2], [3, 4], [2, 5], [4, 3], [5, 2], [3, 5]]); return { p: f[0], q: f[1], w: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return z.q * z.q * z.w <= 200 && !(z.p === 2 && z.q === 3 && z.w === 2); });
        var M = z.q * z.q * z.w;
        return P.radical(t('\\frac{' + z.p + '}{' + z.q + '}\\sqrt{' + M + '}'), { k: [z.p, z.q], n: 2, m: M }, 'entire',
          t('\\frac{' + z.p + '}{' + z.q + '}\\sqrt{' + M + '}=\\sqrt{\\frac{' + z.p * z.p + '}{' + z.q * z.q + '}\\cdot ' + M + '}=\\sqrt{' + z.p * z.p * z.w + '}'), ['Square the fraction in front: ' + t('\\left(\\frac{' + z.p + '}{' + z.q + '}\\right)^{2}=\\frac{' + z.p * z.p + '}{' + z.q * z.q + '}') + '.', 'Multiply it into the radicand and simplify the fraction.'], 'entire radical from a fraction coefficient');
      } },
      { id: '4e', level: 'PRG', make: function (r) {
        var z = gen(function () { return { c: r.int(2, 6), m: r.pick([2, 3, 5, 6, 7]), L: r.pick(['a', 'x', 'y']) }; }, function (z) { return !(z.c === 2 && z.m === 5) && z.c * z.c * z.m <= 200; });
        var L = z.L, key = '\\sqrt{' + z.c * z.c * z.m + L + '^{3}}';
        var chk = withCands(K.varRadical(key, 'entire'), key, [['\\sqrt{' + z.c * z.m + L + '^{3}}', 'u2l7-no-power', 'Square the ' + t(z.c) + ' too before it goes inside: ' + t(z.c + '=\\sqrt{' + z.c * z.c + '}') + '.'], ['\\sqrt{' + z.c * z.c * z.m + L + '^{2}}', 'u2l7-no-power', 'Square the ' + t(L) + ' outside (' + t(L + '^{2}') + ') and multiply by the ' + t(L) + ' inside: ' + t(L + '^{2}\\cdot ' + L + '=' + L + '^{3}') + '.']]);
        return varP(t(z.c + L + '\\sqrt{' + z.m + L + '}'), chk, key, [L], t(z.c + L + '\\sqrt{' + z.m + L + '}=\\sqrt{(' + z.c + L + ')^{2}\\cdot ' + z.m + L + '}=\\sqrt{' + z.c * z.c + L + '^{2}\\cdot ' + z.m + L + '}=' + key), ['Square everything in front of the root: ' + t('(' + z.c + L + ')^{2}=' + z.c * z.c + L + '^{2}') + '.'], 'entire radical with a variable');
      } },
      { id: '4f', level: 'ADV', make: function (r) {
        var z = gen(function () { return { c: r.int(2, 4), e: r.int(1, 2), f: r.int(1, 2), L: r.pick(['b', 'x', 'y']) }; }, function (z) { return !(z.c === 4 && z.e === 2 && z.f === 1); });
        var L = z.L, C = z.c * z.c * z.c, E = 3 * z.e + z.f, key = '\\sqrt[3]{-' + C + pw(L, E) + '}';
        var chk = withCands(K.varRadical(key, 'entire'), key, [['\\sqrt[3]{-' + C + pw(L, z.e + z.f) + '}', 'u2l7-no-power', 'Cube the ' + t(pw(L, z.e)) + ' outside: ' + t('(' + pw(L, z.e) + ')^{3}=' + pw(L, 3 * z.e)) + ', then multiply by ' + t(pw(L, z.f)) + '.'], ['\\sqrt[3]{-' + z.c * z.c + pw(L, E) + '}', 'u2l7-no-power', 'Cube the coefficient (index 3): ' + t('(-' + z.c + ')^{3}=-' + C) + '.']]);
        return varP(t('-' + z.c + pw(L, z.e) + '\\sqrt[3]{' + pw(L, z.f) + '}'), chk, key, [L], t('-' + z.c + pw(L, z.e) + '\\sqrt[3]{' + pw(L, z.f) + '}=\\sqrt[3]{(-' + z.c + pw(L, z.e) + ')^{3}\\cdot ' + pw(L, z.f) + '}=\\sqrt[3]{-' + C + pw(L, 3 * z.e) + '\\cdot ' + pw(L, z.f) + '}=' + key), ['Cube everything in front of the root (the negative stays negative).'], 'entire cube root with a variable');
      } }] },
    { num: '5', stem: 'Expand and simplify. Assume the variables are non-negative.', parts: [
      { id: '5a', level: 'PRG', make: function (r) {
        var z = gen(function () { var ss = r.sample([2, 3, 5, 6, 7, 10], 2); return { p: r.pick([2, 3, 5, 7]), s1: ss[0], s2: ss[1], c: r.int(2, 4) * r.pick([1, -1]), d: r.int(2, 4), e: r.pick([1, -1]) }; },
          function (z) { return ex.simplest(z.p * z.s1, 2) && ex.simplest(z.p * z.s2, 2) && !(z.c === -2 && z.p === 5 && z.d === 3 && z.s1 === 2 && z.s2 === 3) && !(z.c === 3 && z.p === 2); });
        var A = S(z.c, 2, z.p), B = S(z.d, 2, z.p * z.s1, z.e, 2, z.p * z.s2), res = smul(A, B), key = stex(res);
        var shown = cf(z.c) + sq(z.p) + '\\left(' + jn([[z.d, sq(z.p * z.s1)], [z.e, sq(z.p * z.s2)]]) + '\\right)';
        var mid = jn([[z.c * z.d, sq(z.p * z.p * z.s1)], [z.c * z.e, sq(z.p * z.p * z.s2)]]);
        return radP(t(shown), key, { cands: [[stex(S(z.c * z.d * z.p, 2, z.s1, -z.c * z.e * z.p, 2, z.s2)), 'sign', 'Distribute the sign too: ' + t(cf(z.c) + sq(z.p)) + ' times ' + t(tm(z.e, sq(z.p * z.s2), true)) + '.'], [stex(S(z.c * z.d, 2, z.s1 * z.p * z.p, z.c * z.e, 2, z.s2)), 'u2l7-coef', 'Multiply every term by ' + t(cf(z.c) + sq(z.p)) + '.']] },
          t(shown + '=' + mid + '=' + key), ['Multiply ' + t(cf(z.c) + sq(z.p)) + ' by each term: coefficients times coefficients, radicands times radicands.', 'Then simplify each radical.'], 'distributing a radical');
      } },
      { id: '5b', level: 'PRG', make: function (r) {
        var z = gen(function () { var ps = r.sample([2, 3, 5, 7], 2); return { p: ps[0], q: ps[1], a: r.int(2, 4), b: r.int(2, 4) }; }, function (z) { return !(z.a === 4 && z.p === 2 && z.q === 3 && z.b === 2); });
        var A = S(z.a, 2, z.p, 1, 2, z.q), B = S(1, 2, z.p, -z.b, 2, z.q), res = smul(A, B), key = stex(res), pq = z.p * z.q;
        var shown = '\\left(' + jn([[z.a, sq(z.p)], [1, sq(z.q)]]) + '\\right)\\left(' + jn([[1, sq(z.p)], [-z.b, sq(z.q)]]) + '\\right)';
        return radP(t(shown), key, { cands: [[String(z.a * z.p - z.b * z.q), 'u2l7-foil', 'Multiply all four pairs: first, outer, inner and last. The outer and inner terms give ' + t(sq(pq)) + ' terms.'], [stex(S(z.a * z.p * z.p, 1, 1, -z.a * z.b, 2, pq, 1, 2, pq, -z.b * z.q * z.q, 1, 1)), 'u2l7-coef-square', t('\\sqrt{a}\\cdot\\sqrt{a}=a') + ', not ' + t('a^{2}') + '.']] },
          t(shown + '=' + jn([[z.a * z.p, ''], [-z.a * z.b, sq(pq)], [1, sq(pq)], [-z.b * z.q, '']]) + '=' + key), ['Multiply each term of the first bracket by each term of the second.', t('\\sqrt{' + z.p + '}\\cdot\\sqrt{' + z.p + '}=' + z.p) + '.'], 'multiplying binomials');
      } },
      { id: '5c', level: 'ADV', make: function (r) {
        var z = gen(function () { var ps = r.sample([2, 3, 5, 6, 7, 10, 11], 2); return { p: ps[0], q: ps[1], c: r.int(2, 3), s: r.pick([1, -1]) }; }, function (z) { return !(z.p === 7 && z.q === 5 && z.c === 2) && !(z.p === 5 && z.q === 2); });
        var B = S(1, 2, z.p, z.s * z.c, 2, z.q), res = smul(B, B), key = stex(res), pq = z.p * z.q;
        var shown = '\\left(' + jn([[1, sq(z.p)], [z.s * z.c, sq(z.q)]]) + '\\right)^{2}';
        return radP(t(shown), key, { cands: [[String(z.p + z.c * z.c * z.q), 'u2l7-middle-term', t('(a+b)^{2}=a^{2}+2ab+b^{2}') + ': you are missing the middle term ' + t('2ab') + '.'], [stex(sadd(S(z.p + z.c * z.q, 1, 1), S(2 * z.s * z.c, 2, pq))), 'u2l7-coef-square', 'Square the coefficient too: ' + t('(' + z.c + sq(z.q) + ')^{2}=' + z.c * z.c + '(' + z.q + ')=' + z.c * z.c * z.q) + '.']] },
          t(shown + '=' + z.p + (z.s > 0 ? '+' : '-') + '2(' + sq(z.p) + ')(' + z.c + sq(z.q) + ')+' + z.c * z.c * z.q + '=' + key), [t('(a+b)^{2}=a^{2}+2ab+b^{2}') + ' — don’t forget the middle term.'], 'squaring a binomial');
      } },
      { id: '5d', level: 'PRG', make: function (r) {
        var z = gen(function () { return { a: r.int(2, 4), p: r.pick([2, 3, 5, 6, 7]), b: r.int(1, 7) }; }, function (z) { return z.a * z.a * z.p !== z.b * z.b && !(z.a === 2 && z.p === 6 && (z.b === 3 || z.b === 5)) && !(z.a === 3 && z.p === 2 && z.b === 4); });
        var A2 = z.a * z.a * z.p, key = String(A2 - z.b * z.b), ap = z.a + sq(z.p);
        var shown = '\\left(' + ap + '-' + z.b + '\\right)\\left(' + ap + '+' + z.b + '\\right)';
        return radP(t(shown), key, { cands: [[String(z.a * z.p - z.b * z.b), 'u2l7-coef-square', t('(' + ap + ')^{2}=' + z.a * z.a + '(' + z.p + ')=' + A2) + ' — square the coefficient too.'], [String(A2 + z.b * z.b), 'u2l7-conj-den', 'The last terms are ' + t('-' + z.b) + ' and ' + t('+' + z.b) + ': their product is ' + t('-' + z.b * z.b) + '.'], [stex(S(A2 - z.b * z.b, 1, 1, -2 * z.a * z.b, 2, z.p)), 'u2l7-foil', 'The middle terms ' + t('+' + z.a * z.b + sq(z.p)) + ' and ' + t('-' + z.a * z.b + sq(z.p)) + ' cancel.']] },
          'Conjugates: ' + t('(a-b)(a+b)=a^{2}-b^{2}') + '. ' + t('(' + ap + ')^{2}-' + z.b + '^{2}=' + A2 + '-' + z.b * z.b + '=' + key), ['These are conjugates: the middle terms cancel.'], 'product of conjugates');
      } },
      { id: '5e', level: 'ADV', make: function (r) {
        var pool = [[2, [12, 20, 28], 4], [4, [6, 10, 14], 2], [3, [18, 45], 9], [9, [6, 15, 21], 3], [5, [50], 25], [25, [10, 15], 5]];
        var z = gen(function () { var e = r.pick(pool); return { p: e[0], q1: r.pick(e[1]), q2: e[2], c: r.int(2, 4) }; }, function (z) { return !(z.p === 4 && z.q1 === 6 && z.c === 3); });
        var A = S(1, 3, z.p), B = S(1, 3, z.q1, -z.c, 3, z.q2), res = smul(A, B), key = stex(res);
        var shown = cr(z.p) + '\\left(' + cr(z.q1) + '-' + z.c + cr(z.q2) + '\\right)';
        return radP(t(shown), key, { cands: [[stex(smul(S(1, 3, z.p), S(1, 3, z.q1, -1, 3, z.q2))), 'u2l7-coef', 'Keep the ' + t(z.c) + ' in front of its cube root.']] },
          t(shown + '=' + cr(z.p * z.q1) + '-' + z.c + cr(z.p * z.q2) + '=' + key), ['Multiply the radicands: ' + t('\\sqrt[3]{a}\\cdot\\sqrt[3]{b}=\\sqrt[3]{ab}') + '.', 'Look for perfect cubes (8, 27, 64, 125).'], 'distributing a cube root');
      } },
      { id: '5f', level: 'ADV', make: function (r) {
        var z = gen(function () { return { p: r.pick([2, 3, 5]), s: r.int(2, 3), w: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return z.w !== z.p && ex.simplest(z.p * z.w, 2) && !(z.p === 2 && z.s === 2 && z.w === 3); });
        var key = (z.p * z.s) + 'x-' + cf(z.p) + '\\sqrt{' + z.w + 'x}';
        var shown = '\\sqrt{' + z.p + 'x}\\left(\\sqrt{' + z.p * z.s * z.s + 'x}-' + sq(z.p * z.w) + '\\right)';
        return radP(t(shown), key, { cands: [[(z.p * z.s) + 'x^{2}-' + cf(z.p) + '\\sqrt{' + z.w + 'x}', 'u2l7-var-exp', t('\\sqrt{x^{2}}=x') + ' (divide the exponent by 2).'], [(z.p * z.s) + 'x+' + cf(z.p) + '\\sqrt{' + z.w + 'x}', 'sign', 'Check the sign of the second term.']] },
          t(shown + '=\\sqrt{' + z.p * z.p * z.s * z.s + 'x^{2}}-\\sqrt{' + z.p * z.p * z.w + 'x}=' + key), ['Multiply the radicands, including the variables.', t('\\sqrt{x}\\cdot\\sqrt{x}=\\sqrt{x^{2}}=x') + ' for ' + t('x\\ge 0') + '.'], 'distributing a variable radical');
      } }] },
    { num: '6', parts: [{ id: '6', level: 'PRG', make: function (r) {
      var items = windowItems(r, 4, true, ['72,75,76,78,80', '45,48,49,50,52']);
      var sorted = items.slice().sort(function (a, b) { return b.v - a.v; });
      return P.order(r, 'Without a calculator, arrange from <b>greatest to least</b>: ' + items.map(function (x) { return t(x.tex); }).join(',  ') + '.', sorted, { first: 'greatest', last: 'least',
        why: function (a, b) { var A = items.filter(function (x) { return x.id === a; })[0], B = items.filter(function (x) { return x.id === b; })[0]; return t(A.tex) + ' and ' + t(B.tex) + ' are in the wrong order. Write each one as an entire radical, ' + t('a\\sqrt{b}=\\sqrt{a^{2}b}') + ', and compare the radicands.'; } },
        'Entire radicals: ' + items.map(function (x) { return t(x.conv); }).join(', ') + '.<br>Greatest to least: ' + t(sorted.map(function (x) { return x.tex; }).join(',\\ ')) + '.', ['Write each number as an entire radical; the larger radicand is the larger number.'], 'ordering radicals');
    } }] },
    { num: '7', stem: 'Rationalize the denominator and simplify.', parts: [
      { id: '7a', level: 'PRG', make: function (r) {
        var z = gen(function () { return { m: r.pick([2, 3, 5, 6, 7, 10, 11]), j: r.int(2, 6) }; }, function (z) { return !(z.m === 5 && z.j === 2) && !(z.m === 6 && z.j === 2); });
        var k = z.j * z.m, key = stex(S(z.j, 2, z.m));
        return radP(t('\\dfrac{' + k + '}{' + sq(z.m) + '}'), key, { cands: [[stex(S(k, 2, z.m)), 'u2l7-den-m', t(sq(z.m) + '\\cdot' + sq(z.m) + '=' + z.m) + ': the denominator becomes ' + t(z.m) + '.'], [String(z.j), 'u2l7-den-only', 'Multiply the <b>top and the bottom</b> by ' + t(sq(z.m)) + '.']] },
          t('\\dfrac{' + k + '}{' + sq(z.m) + '}\\cdot\\dfrac{' + sq(z.m) + '}{' + sq(z.m) + '}=\\dfrac{' + k + sq(z.m) + '}{' + z.m + '}=' + key), ['Multiply the top and bottom by ' + t(sq(z.m)) + '.'], 'rationalizing');
      } },
      { id: '7b', level: 'PRG', make: function (r) {
        var z = gen(function () { return { c: r.int(2, 5), m: r.pick([2, 3, 5, 6, 7]), k: r.int(3, 15) }; }, function (z) { var D = z.c * z.m; return ex.gcd(z.k, D) > 1 && z.k % D !== 0 && !(z.k === 9 && z.c === 2 && z.m === 6) && !(z.k === 15 && z.c === 2 && z.m === 3); });
        var D = z.c * z.m, res = S([z.k, D], 2, z.m), key = stex(res);
        return radP(t('\\dfrac{' + z.k + '}{' + z.c + sq(z.m) + '}'), key, { cands: [[stex(S([z.k, z.c], 2, z.m)), 'u2l7-den-m', 'The denominator becomes ' + t(z.c + sq(z.m) + '\\cdot' + sq(z.m) + '=' + z.c + '(' + z.m + ')=' + D) + '.'], [stex(S([z.k, z.c * z.m * z.m], 2, z.m)), 'u2l7-den-m', t(sq(z.m) + '\\cdot' + sq(z.m) + '=' + z.m) + ', not ' + t(z.m * z.m) + '.']] },
          t('\\dfrac{' + z.k + '}{' + z.c + sq(z.m) + '}\\cdot\\dfrac{' + sq(z.m) + '}{' + sq(z.m) + '}=\\dfrac{' + z.k + sq(z.m) + '}{' + D + '}=' + key), ['Multiply the top and bottom by ' + t(sq(z.m)) + ' (not by the ' + t(z.c) + ').', 'Reduce the fraction at the end.'], 'rationalizing with a coefficient');
      } },
      { id: '7c', level: 'PRG', make: function (r) {
        var z = gen(function () { return { a: r.pick([2, 3, 5, 6, 7, 11]), s: r.int(2, 3), tt: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return z.a !== z.tt && ex.gcd(z.a, z.tt) === 1 && ex.simplest(z.a * z.tt, 2) && !(z.a === 7 && z.s === 2 && z.tt === 3); });
        var B = z.s * z.s * z.tt, key = stex(S([1, z.s * z.tt], 2, z.a * z.tt));
        return radP(t('\\dfrac{' + sq(z.a) + '}{' + sq(B) + '}'), key, { cands: [['\\frac{' + sq(z.a * z.tt) + '}{' + z.tt + '}', 'u2l7-den-simplify', 'Simplify ' + t(sq(B) + '=' + z.s + sq(z.tt)) + ' first; the ' + t(z.s) + ' stays in the denominator.']] },
          t('\\dfrac{' + sq(z.a) + '}{' + sq(B) + '}=\\dfrac{' + sq(z.a) + '}{' + z.s + sq(z.tt) + '}\\cdot\\dfrac{' + sq(z.tt) + '}{' + sq(z.tt) + '}=' + key), ['Simplify the denominator first: ' + t(sq(B) + '=' + z.s + sq(z.tt)) + '.'], 'rationalizing a quotient of radicals');
      } },
      { id: '7d', level: 'ADV', make: function (r) {
        var z = gen(function () { return { p: r.pick([2, 3, 5]), j: r.int(2, 5), B: r.chance(0.4) }; }, function (z) { return !(z.p === 3 && z.j === 4 && !z.B) && !(z.p === 3 && z.j === 2 && z.B) && !(z.p === 2 && z.j === 2 && !z.B); });
        var p = z.p, k = p * z.j, den = z.B ? p * p : p, mult = z.B ? p : p * p, key = stex(S(z.j, 3, mult));
        return radP(t('\\dfrac{' + k + '}{' + cr(den) + '}'), key, { cands: [[stex(S([k, p], 3, den)), 'u2l7-cube-den', 'Multiply by the cube root that makes the radicand a perfect <b>cube</b>: ' + t(cr(den) + '\\cdot' + cr(mult) + '=' + cr(p * p * p) + '=' + p) + '.'], [stex(S(k, 3, mult)), 'u2l7-den-only', 'Divide by the new denominator ' + t(cr(p * p * p) + '=' + p) + '.'], [stex(S(z.j, 2, mult)), 'index', 'Keep the cube root (index 3).']] },
          t(den + '=' + (z.B ? p + '^{2}' : p)) + ', so multiply by ' + t(cr(mult)) + ' to make ' + t(cr(p * p * p)) + ': ' + t('\\dfrac{' + k + '}{' + cr(den) + '}\\cdot\\dfrac{' + cr(mult) + '}{' + cr(mult) + '}=\\dfrac{' + k + cr(mult) + '}{' + cr(p * p * p) + '}=\\dfrac{' + k + cr(mult) + '}{' + p + '}=' + key), ['You need a perfect <b>cube</b> under the root in the denominator.'], 'rationalizing a cube root');
      } },
      { id: '7e', level: 'ADV', make: function (r) {
        var z = gen(function () { return { a: r.pick([1, 2, 3, 5, 7]), s: r.int(2, 3), tt: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { var b = z.s * z.s * z.tt; return ex.gcd(z.a, b) === 1 && ex.simplest(z.a * z.tt, 2) && !(z.a === 3 && b === 20) && !(z.a === 5 && b === 8) && !(z.a === 7 && b === 18); });
        var b = z.s * z.s * z.tt, key = stex(S([1, z.s * z.tt], 2, z.a * z.tt));
        return radP(t('\\sqrt{\\dfrac{' + z.a + '}{' + b + '}}'), key, { cands: [['\\frac{' + sq(z.a * z.tt) + '}{' + z.tt + '}', 'u2l7-den-simplify', t(sq(b) + '=' + z.s + sq(z.tt)) + ' — keep the ' + t(z.s) + ' in the denominator.']] },
          t('\\sqrt{\\dfrac{' + z.a + '}{' + b + '}}=\\dfrac{' + sq(z.a) + '}{' + z.s + sq(z.tt) + '}\\cdot\\dfrac{' + sq(z.tt) + '}{' + sq(z.tt) + '}=' + key), ['Write it as ' + t('\\dfrac{' + sq(z.a) + '}{' + sq(b) + '}') + ', simplify the bottom, then rationalize.'], 'fraction under a radical');
      } },
      { id: '7f', level: 'ADV', make: function (r) {
        var z = gen(function () { return { p: r.pick([2, 3, 5]), j: r.int(2, 5), c: r.int(2, 4), s: r.pick([1, -1]) }; }, function (z) { return !(z.p === 2 && z.j === 3 && z.c === 2 && z.s === -1) && z.c * z.c * z.p <= 80; });
        var k = z.p * z.j, R2 = z.c * z.c * z.p, key = stex(S(z.j, 2, z.p, z.s * z.c, 1, 1));
        var shown = '\\dfrac{' + k + (z.s > 0 ? '+' : '-') + sq(R2) + '}{' + sq(z.p) + '}';
        return radP(t(shown), key, { cands: [[stex(S(z.j, 2, z.p, z.s * z.c * z.p, 1, 1)), 'u2l7-one-term', 'Divide <b>every</b> term of the numerator by ' + t(z.p) + '.'], [stex(S(k, 2, z.p, z.s * z.c * z.p, 1, 1)), 'u2l7-den-only', 'The new denominator is ' + t(z.p) + ' — divide by it.']] },
          t(shown + '\\cdot\\dfrac{' + sq(z.p) + '}{' + sq(z.p) + '}=\\dfrac{' + k + sq(z.p) + (z.s > 0 ? '+' : '-') + sq(R2 * z.p) + '}{' + z.p + '}=\\dfrac{' + k + sq(z.p) + (z.s > 0 ? '+' : '-') + z.c * z.p + '}{' + z.p + '}=' + key), ['Multiply the top and bottom by ' + t(sq(z.p)) + '.', 'Then divide each term by ' + t(z.p) + '.'], 'rationalizing a binomial numerator');
      } },
      { id: '7g', level: 'ADV', make: function (r) {
        var z = gen(function () { return { p: r.pick([2, 3, 5, 6, 7]), k: r.int(2, 9) }; }, function (z) { return !(z.p === 2 && z.k === 5) && !(z.p === 3 && z.k === 6); });
        var g = ex.gcd(z.k, z.p), Kk = z.k / g, Pp = z.p / g, key = '\\frac{' + cf(Kk) + '\\sqrt{' + z.p + 'x}}{' + cf(Pp) + 'x}';
        return radP(t('\\dfrac{' + z.k + '}{\\sqrt{' + z.p + 'x}}') + ', ' + t('x>0'), key, { cands: [['\\frac{' + z.k + '\\sqrt{' + z.p + 'x}}{x}', 'u2l7-den-m', t('\\sqrt{' + z.p + 'x}\\cdot\\sqrt{' + z.p + 'x}=' + z.p + 'x') + '.'], ['\\frac{' + z.k + '\\sqrt{' + z.p + 'x}}{' + z.p * z.p + 'x^{2}}', 'u2l7-den-m', t('\\sqrt{' + z.p + 'x}\\cdot\\sqrt{' + z.p + 'x}=' + z.p + 'x') + ', not ' + t('(' + z.p + 'x)^{2}') + '.']] },
          t('\\dfrac{' + z.k + '}{\\sqrt{' + z.p + 'x}}\\cdot\\dfrac{\\sqrt{' + z.p + 'x}}{\\sqrt{' + z.p + 'x}}=\\dfrac{' + z.k + '\\sqrt{' + z.p + 'x}}{' + z.p + 'x}' + (g > 1 ? '=' + key : '')), ['Multiply the top and bottom by ' + t('\\sqrt{' + z.p + 'x}') + '.'], 'rationalizing with a variable');
      } }] },
    { num: '8', stem: 'Simplify. Assume all variables are non-negative.', parts: [
      { id: '8a', level: 'PRG', make: function (r) {
        var z = gen(function () { return { c: r.int(2, 6), m: r.pick([2, 3, 5, 6, 7, 10, 11]), e: r.int(2, 4) }; }, function (z) { return z.c * z.c * z.m <= 300 && !(z.c === 3 && z.m === 7 && z.e === 3); });
        var key = z.c + pw('x', z.e) + sq(z.m), shown = '\\sqrt{' + z.c * z.c * z.m + 'x^{' + 2 * z.e + '}}';
        var chk = withCands(K.varRadical(key, 'mixed'), key, [[z.c * z.c + pw('x', z.e) + sq(z.m), 'coef-power', t(z.c * z.c) + ' comes out of the root as ' + t(z.c) + '.']]);
        return varP(t(shown), chk, key, ['x'], t(shown + '=\\sqrt{' + z.c * z.c + 'x^{' + 2 * z.e + '}}\\cdot' + sq(z.m) + '=' + key), ['Divide the exponent by the index 2.'], 'variable radical');
      } },
      { id: '8b', level: 'PRG', make: function (r) {
        var z = gen(function () { var L = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]); return { u: L[0], v: L[1], c: r.int(2, 7), m: r.pick([2, 3, 5, 6, 7]), i: r.int(1, 2), j: r.int(1, 2) }; }, function (z) { return z.c * z.c * z.m <= 300 && !(z.c === 7 && z.m === 2 && z.i === 1 && z.j === 2); });
        var key = z.c + pw(z.u, z.i) + pw(z.v, z.j) + '\\sqrt{' + z.m + z.u + '}', shown = '\\sqrt{' + z.c * z.c * z.m + pw(z.u, 2 * z.i + 1) + pw(z.v, 2 * z.j) + '}';
        var chk = withCands(K.varRadical(key, 'mixed'), key, [[z.c + pw(z.u, z.i) + pw(z.v, z.j) + sq(z.m), 'u2l7-var-out', 'One ' + t(z.u) + ' is left over inside the root: ' + t(pw(z.u, 2 * z.i + 1) + '=' + pw(z.u, 2 * z.i) + '\\cdot ' + z.u) + '.'], [z.c + pw(z.u, z.i) + pw(z.v, 2 * z.j) + '\\sqrt{' + z.m + z.u + '}', 'u2l7-var-exp', t('\\sqrt{' + pw(z.v, 2 * z.j) + '}=' + pw(z.v, z.j)) + ' — divide the exponent by 2.']]);
        return varP(t(shown), chk, key, [z.u, z.v], t(shown + '=\\sqrt{' + z.c * z.c + pw(z.u, 2 * z.i) + pw(z.v, 2 * z.j) + '}\\cdot\\sqrt{' + z.m + z.u + '}=' + key), ['Split the radicand into a perfect square times what is left.'], 'variable radical with two variables');
      } },
      { id: '8c', level: 'ADV', make: function (r) {
        var z = gen(function () { return { c: r.int(2, 5), m: r.pick([2, 3, 4, 5, 6, 7]), L: r.pick(['m', 'n', 't', 'y']), i: r.int(1, 2), rr: r.int(1, 2) }; }, function (z) { return z.c * z.c * z.c * z.m <= 700 && !(z.c === 5 && z.m === 2 && z.L === 'm' && z.i === 2); });
        var C = z.c * z.c * z.c, E = 3 * z.i + z.rr, key = '-' + z.c + pw(z.L, z.i) + '\\sqrt[3]{' + z.m + pw(z.L, z.rr) + '}', shown = '\\sqrt[3]{-' + C * z.m + pw(z.L, E) + '}';
        var chk = withCands(K.varRadical(key, 'mixed'), key, [[z.c + pw(z.L, z.i) + '\\sqrt[3]{' + z.m + pw(z.L, z.rr) + '}', 'sign', 'The cube root of a negative is negative: ' + t('\\sqrt[3]{-' + C + '}=-' + z.c) + '.']]);
        return varP(t(shown), chk, key, [z.L], t(shown + '=\\sqrt[3]{-' + C + pw(z.L, 3 * z.i) + '}\\cdot\\sqrt[3]{' + z.m + pw(z.L, z.rr) + '}=' + key), ['Divide the exponent by the index 3: the quotient comes out, the remainder stays in.'], 'variable cube root');
      } },
      { id: '8d', level: 'ADV', make: function (r) {
        var z = gen(function () { return { k: r.int(2, 4), c: r.int(2, 4), m: r.pick([2, 3, 5, 6, 7]), i: r.int(1, 3) }; }, function (z) { return !(z.k === 2 && z.c === 3 && z.m === 5 && z.i === 2); });
        var key = '-' + z.k * z.c + pw('x', z.i) + '\\sqrt{' + z.m + 'xy}', shown = '-' + z.k + '\\sqrt{' + z.c * z.c * z.m + pw('x', 2 * z.i + 1) + 'y}';
        var chk = withCands(K.varRadical(key, 'mixed'), key, [['-' + z.c + pw('x', z.i) + '\\sqrt{' + z.m + 'xy}', 'u2l7-coef', 'Multiply by the ' + t('-' + z.k) + ' in front too.']]);
        return varP(t(shown), chk, key, ['x', 'y'], t(shown + '=-' + z.k + '(' + z.c + pw('x', z.i) + ')\\sqrt{' + z.m + 'xy}=' + key), ['Simplify the radical, then multiply by the number in front.'], 'variable radical with a coefficient');
      } }] },
    { num: '9', stem: 'Rationalize the denominator and simplify.', parts: [
      { id: '9a', level: 'PRG', make: function (r) {
        var z = gen(function () { return { p: r.pick([2, 3, 5, 6, 7, 10, 11]), c: r.int(1, 3), s: r.pick([1, -1]), k: r.int(2, 12) }; }, function (z) { var D = z.p - z.c * z.c; return D !== 0 && Math.abs(D) <= 10 && !(z.p === 5 && z.c === 1 && z.k === 6 && z.s === 1) && !(z.p === 5 && z.c === 1 && z.k === 8 && z.s === -1); });
        var den = S(1, 2, z.p, z.s * z.c, 1, 1), D = z.p - z.c * z.c, num = smul(Q(z.k), conj(den)), res = sdivq(num, D), key = stex(res);
        var shown = '\\dfrac{' + z.k + '}{' + sq(z.p) + (z.s > 0 ? '+' : '-') + z.c + '}';
        return radP(t(shown), key, { cands: [[stex(sdivq(num, z.p + z.c * z.c)), 'u2l7-conj-den', t('(a+b)(a-b)=a^{2}-b^{2}') + ': the denominator is ' + t(z.p + '-' + z.c * z.c) + '.'], [stex(Q([z.k, D])), 'u2l7-den-only', 'Multiply the numerator by the conjugate too.']] },
          t(shown + '\\cdot\\dfrac{' + stex(conj(den)) + '}{' + stex(conj(den)) + '}=\\dfrac{' + z.k + '(' + stex(conj(den)) + ')}{' + z.p + '-' + z.c * z.c + '}=' + key), ['Multiply the top and bottom by the conjugate ' + t(stex(conj(den))) + '.'], 'conjugate');
      } },
      { id: '9b', level: 'ADV', make: function (r) {
        var z = gen(function () { return { p: r.pick([2, 3, 5]), w: r.pick([2, 3, 5, 6, 7]), s: r.pick([1, -1]) }; }, function (z) { return z.w !== z.p && ex.simplest(z.p * z.w, 2) && !(z.p === 3 && z.w === 2 && z.s === -1); });
        var q = z.p * z.w, den = S(1, 2, q, z.s, 2, z.p), D = q - z.p, num = smul(S(1, 2, z.p), conj(den)), res = sdivq(num, D), key = stex(res);
        var shown = '\\dfrac{' + sq(z.p) + '}{' + sq(q) + (z.s > 0 ? '+' : '-') + sq(z.p) + '}';
        return radP(t(shown), key, { cands: [[stex(sdivq(num, q + z.p)), 'u2l7-conj-den', 'The denominator is ' + t('(' + sq(q) + ')^{2}-(' + sq(z.p) + ')^{2}=' + q + '-' + z.p) + '.'], [stex(sdivq(S(1, 2, z.p), D)), 'u2l7-den-only', 'Multiply the numerator by the conjugate too.']] },
          t(shown + '=\\dfrac{' + sq(z.p) + '(' + stex(conj(den)) + ')}{' + q + '-' + z.p + '}=\\dfrac{' + stex(num) + '}{' + D + '}=' + key), ['The conjugate of ' + t(stex(den)) + ' is ' + t(stex(conj(den))) + '.', 'Simplify, then reduce.'], 'conjugate with two radicals');
      } },
      { id: '9c', level: 'ADV', make: function (r) {
        var z = gen(function () { return { a: r.int(2, 6), p: r.pick([2, 3, 5, 6, 7, 10, 11, 13]), s: r.pick([1, -1]) }; }, function (z) { return z.a * z.a !== z.p && !(z.a === 4 && z.p === 2 && z.s === 1) && !(z.a === 3 && z.p === 5 && z.s === -1); });
        var num = S(z.a, 1, 1, -z.s, 2, z.p), den = S(z.a, 1, 1, z.s, 2, z.p), D = z.a * z.a - z.p, top = smul(num, conj(den)), key = stex(sdivq(top, D));
        var shown = '\\dfrac{' + stex(num) + '}{' + stex(den) + '}';
        return radP(t(shown), key, { cands: [[stex(sdivq(Q(z.a * z.a + z.p), D)), 'u2l7-middle-term', t('(' + stex(num) + ')^{2}') + ' has a middle term: ' + t('a^{2}-2ab+b^{2}') + '.'], [stex(sdivq(top, z.a * z.a + z.p)), 'u2l7-conj-den', 'The denominator is ' + t(z.a * z.a + '-' + z.p) + '.']] },
          t(shown + '=\\dfrac{(' + stex(num) + ')^{2}}{' + z.a * z.a + '-' + z.p + '}=\\dfrac{' + stex(top) + '}{' + D + '}=' + key), ['Multiply the top and bottom by ' + t(stex(conj(den))) + ': the numerator becomes a square.'], 'conjugate: binomial over binomial');
      } },
      { id: '9d', level: 'MAS', make: function (r) {
        var z = gen(function () { var ps = r.sample([2, 3, 5, 7], 2); return { p: ps[0], q: ps[1], a: r.int(1, 3), b: r.int(1, 3) }; }, function (z) { return (z.a > 1 || z.b > 1) && z.p !== z.b * z.b * z.q && !(z.a === 2 && z.p === 5 && z.q === 3 && z.b === 2); });
        var num = S(z.a, 2, z.p, 1, 2, z.q), den = S(1, 2, z.p, -z.b, 2, z.q), D = z.p - z.b * z.b * z.q, top = smul(num, conj(den)), key = stex(sdivq(top, D));
        var shown = '\\dfrac{' + stex(num) + '}{' + stex(den) + '}';
        return radP(t(shown), key, { cands: [[stex(sdivq(top, z.p + z.b * z.b * z.q)), 'u2l7-conj-den', 'The denominator is ' + t('(' + sq(z.p) + ')^{2}-(' + cf(z.b) + sq(z.q) + ')^{2}=' + z.p + '-' + z.b * z.b * z.q) + '.'], [stex(sdivq(num, D)), 'u2l7-den-only', 'Multiply the numerator by the conjugate too.']] },
          t(shown + '=\\dfrac{(' + stex(num) + ')(' + stex(conj(den)) + ')}{' + z.p + '-' + z.b * z.b * z.q + '}=\\dfrac{' + stex(top) + '}{' + D + '}=' + key), ['Multiply the top and bottom by ' + t(stex(conj(den))) + '.', 'Expand the numerator term by term; the denominator is ' + t('a^{2}-b^{2}') + '.'], 'conjugate: radical binomials');
      } },
      { id: '9e', level: 'ADV', make: function (r) {
        var z = gen(function () { return { k: r.pick([1, 1, 2, 3]), c: r.int(2, 5), s: r.pick([1, -1]) }; }, function (z) { return !(z.k === 1 && z.c === 2 && z.s === -1); });
        var c2 = z.c * z.c, sg = z.s < 0 ? '+' : '-', key = '\\frac{' + cf(z.k) + 'x' + sg + z.k * z.c + '\\sqrt{x}}{x-' + c2 + '}';
        var shown = '\\dfrac{' + cf(z.k) + '\\sqrt{x}}{\\sqrt{x}' + (z.s > 0 ? '+' : '-') + z.c + '}';
        return radP(t(shown) + ', ' + t('x\\ge 0,\\ x\\ne ' + c2), key, { cands: [['\\frac{' + cf(z.k) + 'x' + sg + z.k * z.c + '\\sqrt{x}}{x+' + c2 + '}', 'u2l7-conj-den', t('(\\sqrt{x})^{2}-' + z.c + '^{2}=x-' + c2) + '.'], ['\\frac{' + cf(z.k) + 'x}{x-' + c2 + '}', 'u2l7-foil', 'Multiply ' + t(cf(z.k) + '\\sqrt{x}') + ' by <b>both</b> terms of the conjugate.']] },
          t(shown + '\\cdot\\dfrac{\\sqrt{x}' + sg + z.c + '}{\\sqrt{x}' + sg + z.c + '}=\\dfrac{' + cf(z.k) + '\\sqrt{x}(\\sqrt{x}' + sg + z.c + ')}{x-' + c2 + '}=' + key), ['The conjugate of ' + t('\\sqrt{x}' + (z.s > 0 ? '+' : '-') + z.c) + ' is ' + t('\\sqrt{x}' + sg + z.c) + '.', t('(\\sqrt{x})^{2}=x') + '.'], 'conjugate with a variable');
      } }] },
    { num: '10', stem: 'Simplify. Assume the variables are positive.', parts: [
      { id: '10a', level: 'EMG', make: function (r) {
        var z = gen(function () { return { b: r.int(2, 6), j: r.int(2, 5), p: r.pick([2, 3, 5, 6, 7]), q: r.pick([2, 3, 5, 7, 11]) }; }, function (z) { return z.p !== z.q && ex.gcd(z.p, z.q) === 1 && z.p * z.q <= 80 && !(z.b === 6 && z.j === 3 && z.p === 6 && z.q === 5) && !(z.b === 5 && z.j === 2 && z.p === 7 && z.q === 6); });
        var a = z.b * z.j, key = stex(S(z.j, 2, z.p)), shown = '\\dfrac{' + a + sq(z.p * z.q) + '}{' + z.b + sq(z.q) + '}';
        return radP(t(shown), key, {}, t(shown + '=\\dfrac{' + a + '}{' + z.b + '}\\sqrt{\\dfrac{' + z.p * z.q + '}{' + z.q + '}}=' + key), ['Divide the coefficients and divide the radicands.'], 'dividing radicals');
      } },
      { id: '10b', level: 'PRG', make: function (r) {
        var z = gen(function () { return { p: r.pick([2, 3, 5, 6, 7]), s1: r.int(2, 5), s2: r.int(2, 5), sg: r.pick([1, 1, -1]) }; }, function (z) { return z.s1 > z.s2 && z.s1 * z.s1 * z.p <= 200 && !(z.p === 3 && z.s1 === 4 && z.s2 === 2 && z.sg === 1); });
        var ans = z.s1 + z.sg * z.s2, shown = '\\dfrac{' + sq(z.s1 * z.s1 * z.p) + (z.sg > 0 ? '+' : '-') + sq(z.s2 * z.s2 * z.p) + '}{' + sq(z.p) + '}';
        var rr = z.s1 * z.s1 + z.sg * z.s2 * z.s2;
        return radP(t(shown), String(ans), { cands: [[sq(rr), 'u2l7-add-radicands', 'Divide each term separately: ' + t('\\dfrac{a+b}{c}=\\dfrac{a}{c}+\\dfrac{b}{c}') + ' — the roots don’t combine.'], [stex(S(z.s1, 1, 1, z.sg * z.s2, 2, z.p)), 'u2l7-one-term', 'Divide <b>both</b> terms by ' + t(sq(z.p)) + '.']] },
          t(shown + '=\\sqrt{\\dfrac{' + z.s1 * z.s1 * z.p + '}{' + z.p + '}}' + (z.sg > 0 ? '+' : '-') + '\\sqrt{\\dfrac{' + z.s2 * z.s2 * z.p + '}{' + z.p + '}}=' + sq(z.s1 * z.s1) + (z.sg > 0 ? '+' : '-') + sq(z.s2 * z.s2) + '=' + ans), ['Divide each term of the numerator by ' + t(sq(z.p)) + '.'], 'dividing a sum by a radical');
      } },
      { id: '10c', level: 'PRG', make: function (r) {
        var z = gen(function () { var qr = r.sample([2, 3, 5, 6, 7, 10, 11], 2); return { p: r.pick([2, 3, 5, 7]), q: qr[0], rr: qr[1], c: r.int(2, 3), i: r.int(1, 5), j: r.int(1, 5) }; },
          function (z) { return ex.gcd(z.p, z.q) === 1 && ex.gcd(z.p, z.rr) === 1 && z.p * z.q <= 80 && z.p * z.rr <= 80 && !(z.p === 7 && z.q === 2 && z.rr === 3 && z.c === 2 && z.i === 2 && z.j === 5) && !(z.p === 5 && z.c === 3); });
        var a = z.c * z.i, b = z.c * z.j, key = stex(S(z.i, 2, z.q, -z.j, 2, z.rr)), shown = '\\dfrac{' + cf(a) + sq(z.p * z.q) + '-' + cf(b) + sq(z.p * z.rr) + '}{' + z.c + sq(z.p) + '}';
        return radP(t(shown), key, { cands: [[stex(S(z.i, 2, z.q, -b, 2, z.p * z.rr)), 'u2l7-one-term', 'Divide <b>both</b> terms by ' + t(z.c + sq(z.p)) + '.']] },
          t(shown + '=\\dfrac{' + cf(a) + sq(z.p * z.q) + '}{' + z.c + sq(z.p) + '}-\\dfrac{' + cf(b) + sq(z.p * z.rr) + '}{' + z.c + sq(z.p) + '}=' + key), ['Divide each term by the monomial ' + t(z.c + sq(z.p)) + ': coefficients by coefficients, radicands by radicands.'], 'dividing each term');
      } },
      { id: '10d', level: 'ADV', make: function (r) {
        var z = gen(function () { return { m: r.pick([2, 3, 5, 6, 7]), c: r.int(2, 6), e: r.int(1, 3) }; }, function (z) { return z.c * z.c * z.m <= 250 && !(z.m === 3 && z.c === 5 && z.e === 2); });
        var key = z.c + pw('x', z.e), shown = '\\dfrac{\\sqrt{' + z.c * z.c * z.m + pw('x', 2 * z.e + 1) + '}}{\\sqrt{' + z.m + 'x}}';
        return radP(t(shown), key, { cands: [[z.c + pw('x', 2 * z.e), 'u2l7-var-exp', t('\\sqrt{' + pw('x', 2 * z.e) + '}=' + pw('x', z.e)) + ' — divide the exponent by 2.'], [z.c * z.c + pw('x', z.e), 'coef-power', t(sq(z.c * z.c) + '=' + z.c) + '.']] },
          t(shown + '=\\sqrt{\\dfrac{' + z.c * z.c * z.m + pw('x', 2 * z.e + 1) + '}{' + z.m + 'x}}=\\sqrt{' + z.c * z.c + pw('x', 2 * z.e) + '}=' + key), ['Put everything under one root and divide (subtract the exponents).'], 'dividing variable radicals');
      } }] },
    { num: '11', stem: function (s) { return 'A right triangle has legs of length ' + t(stex(S(s.p, 2, s.u)) + '\\text{ cm}') + ' and ' + t(stex(S(s.q, 2, s.w)) + '\\text{ cm}') + '.' + triFig([[s.p, s.u]], [[s.q, s.w]], 'cm'); },
      shared: function (r) {
        return gen(function () { var w = r.pick([2, 3, 5, 6, 7]), q = r.int(1, 2), h = q + r.int(1, 3), L = sd(1, 2, (h * h - q * q) * w); return { w: w, q: q, h: h, p: L.c[0], u: L.m, n: L.n }; },
          function (s) { return s.n === 2 && s.u !== s.w && s.u <= 30 && !(s.w === 6 && s.q === 1 && s.h === 2); });
      }, parts: [
      { id: '11a', level: 'PRG', make: function (r, s) {
        var key = stex(S(s.h, 2, s.w)), c2 = s.p * s.p * s.u + s.q * s.q * s.w;
        return radP('Determine the exact length of the hypotenuse, ' + t('c') + ', in simplest form.', key, { after: 'cm', cands: [[stex(S(s.p, 2, s.u, s.q, 2, s.w)), 'u2l7-hyp-add', 'Use the Pythagorean theorem: ' + t('c^{2}=a^{2}+b^{2}') + '.'], [String(c2), 'u2l7-no-root', 'That is ' + t('c^{2}') + '. Take the square root.']] },
          t('c^{2}=(' + stex(S(s.p, 2, s.u)) + ')^{2}+(' + stex(S(s.q, 2, s.w)) + ')^{2}=' + s.p * s.p * s.u + '+' + s.q * s.q * s.w + '=' + c2) + ', so ' + t('c=' + sq(c2) + '=' + key) + ' cm.', [t('c^{2}=a^{2}+b^{2}') + ', and ' + t('(k\\sqrt{m})^{2}=k^{2}m') + '.'], 'hypotenuse');
      } },
      { id: '11b', level: 'PRG', make: function (r, s) {
        var key = stex(S(s.p, 2, s.u, s.q + s.h, 2, s.w));
        return radP('Determine the exact perimeter.', key, { after: 'cm', cands: [[stex(S(s.p, 2, s.u, s.q, 2, s.w)), 'u2l7-perim-hyp', 'The perimeter includes the hypotenuse too.']] },
          t('c=' + stex(S(s.h, 2, s.w))) + ' (part a). ' + t('P=' + stex(S(s.p, 2, s.u)) + '+' + stex(S(s.q, 2, s.w)) + '+' + stex(S(s.h, 2, s.w)) + '=' + key) + ' cm.', ['Find the hypotenuse first, then add all three sides (combine like radicals).'], 'perimeter');
      } },
      { id: '11c', level: 'ADV', make: function (r, s) {
        var A = S([s.p * s.q, 2], 2, s.u * s.w), key = stex(A);
        return radP('Determine the exact area.', key, { after: 'cm²', cands: [[stex(S(s.p * s.q, 2, s.u * s.w)), 'u2l7-half', 'The area of a triangle is ' + t('\\frac{1}{2}bh') + '.']] },
          t('A=\\frac{1}{2}(' + stex(S(s.p, 2, s.u)) + ')(' + stex(S(s.q, 2, s.w)) + ')=\\frac{' + s.p * s.q + '}{2}' + sq(s.u * s.w) + '=' + key) + ' cm².', [t('A=\\frac{1}{2}bh') + ': the legs are the base and the height.'], 'area');
      } }] },
    { num: '12', stem: function (s) { return 'A rectangle has an area of ' + t(s.A + '\\text{ m}^{2}') + ' and a width of ' + t('(' + stex(s.W) + ')\\text{ m}') + '.' + rectFig('length ?', s.ri ? [[1, s.p], [-s.c, 1]] : [[1, s.p], [-1, s.q]], 'm', s.A + ' m²'); },
      shared: function (r) {
        var s = gen(function () {
          var ri = r.chance(0.4), p = r.pick([2, 3, 5, 6, 7, 10, 11, 13]), q = r.pick([2, 3, 5, 6, 7]), c = r.int(1, 3), d = ri ? p - c * c : p - q, k = r.int(2, 8);
          return { ri: ri, p: p, q: q, c: c, d: d, k: k, A: k * d };
        }, function (s) { return s.d > 0 && s.A <= 60 && (s.ri || s.p > s.q) && !(s.A === 24 && s.p === 7 && s.q === 3 && !s.ri) && !(s.ri && s.p === 5 && s.c === 1 && s.A === 8); });
        s.W = s.ri ? S(1, 2, s.p, -s.c, 1, 1) : S(1, 2, s.p, -1, 2, s.q);
        s.Lg = sdivq(smul(Q(s.A), conj(s.W)), s.d);
        return s;
      }, parts: [
      { id: '12a', level: 'ADV', make: function (r, s) {
        var key = stex(s.Lg);
        return radP('Determine the exact length of the rectangle in simplest form.', key, { after: 'm', cands: [[stex(sdivq(smul(Q(s.A), s.W), s.d)), 'u2l7-conj-sign', 'Divide the area by the width: multiply the top and bottom by the <b>conjugate</b> ' + t(stex(conj(s.W))) + '.'], [stex(sdivq(smul(Q(s.A), conj(s.W)), s.ri ? s.p + s.c * s.c : s.p + s.q)), 'u2l7-conj-den', 'The denominator is ' + t('a^{2}-b^{2}') + '.']] },
          t('\\ell=\\dfrac{' + s.A + '}{' + stex(s.W) + '}\\cdot\\dfrac{' + stex(conj(s.W)) + '}{' + stex(conj(s.W)) + '}=\\dfrac{' + s.A + '(' + stex(conj(s.W)) + ')}{' + s.d + '}=' + s.k + '(' + stex(conj(s.W)) + ')=' + key) + ' m.', [t('\\ell=\\dfrac{A}{w}') + '. Rationalize with the conjugate.'], 'length from the area');
      } },
      { id: '12b', level: 'ADV', make: function (r, s) {
        var sum = sadd(s.Lg, s.W), P2 = sscale(sum, 2), key = stex(P2);
        return radP('Determine the exact perimeter.', key, { after: 'm', cands: [[stex(sum), 'u2l7-half-perim', 'The perimeter is ' + t('2(\\ell+w)') + ' — double it.']] },
          t('\\ell=' + stex(s.Lg)) + ' (part a). ' + t('P=2\\left[(' + stex(s.Lg) + ')+(' + stex(s.W) + ')\\right]=2(' + stex(sum) + ')=' + key) + ' m.', ['Find the length first. ' + t('P=2(\\ell+w)') + ': combine like radicals.'], 'perimeter');
      } }] },
    { num: '13', stem: 'A student made each error below. Find the mistake and the correct value in simplest form.', parts: [
      { id: '13a', level: 'EMG', make: function (r) {
        var T = r.pick([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25], [15, 20, 25], [20, 21, 29]]), a2 = T[0] * T[0], b2 = T[1] * T[1], c2 = T[2] * T[2];
        return mcT(r, 'A student wrote ' + t('\\sqrt{' + a2 + '+' + b2 + '}=\\sqrt{' + a2 + '}+\\sqrt{' + b2 + '}=' + (T[0] + T[1])) + '. Which statement is correct?',
          'A root of a sum is not the sum of the roots. Add first: ' + t('\\sqrt{' + a2 + '+' + b2 + '}=\\sqrt{' + c2 + '}=' + T[2]) + '.',
          [['The work is correct: ' + t('\\sqrt{a+b}=\\sqrt{a}+\\sqrt{b}') + ', so the value is ' + t(T[0] + T[1]) + '.', 'Test it: ' + t('\\sqrt{' + c2 + '}=' + T[2]) + ', not ' + t(T[0] + T[1]) + '.'],
            ['The roots should be multiplied: ' + t('\\sqrt{' + a2 + '}\\cdot\\sqrt{' + b2 + '}=' + T[0] * T[1]) + '.', 'Only a root of a <b>product</b> splits into a product of roots.'],
            ['Add first, but ' + t('\\sqrt{' + c2 + '}') + ' is already in simplest form, so leave it as ' + t('\\sqrt{' + c2 + '}') + '.', t(c2) + ' is a perfect square: ' + t('\\sqrt{' + c2 + '}=' + T[2]) + '.']],
          t('\\sqrt{a+b}\\ne\\sqrt{a}+\\sqrt{b}') + '. ' + t('\\sqrt{' + a2 + '+' + b2 + '}=\\sqrt{' + c2 + '}=' + T[2]) + '.', ['Work out what is under the root first.'], 'error: root of a sum', true);
      } },
      { id: '13b', level: 'PRG', make: function (r) {
        var z = gen(function () { var ps = r.sample([2, 3, 5, 6, 7, 10, 11], 2); return { p: Math.max(ps[0], ps[1]), q: Math.min(ps[0], ps[1]), s: r.pick([1, 1, -1]) }; }, function (z) { return !(z.p === 3 && z.q === 2); });
        var B = S(1, 2, z.p, z.s, 2, z.q), res = smul(B, B), key = stex(res), b = '\\left(' + sq(z.p) + (z.s > 0 ? '+' : '-') + sq(z.q) + '\\right)^{2}';
        return radP('A student wrote ' + t(b + '=' + z.p + (z.s > 0 ? '+' : '-') + z.q + '=' + (z.p + z.s * z.q)) + '. Give the correct value in simplest form.', key, { cands: [[String(z.p + z.q), 'u2l7-middle-term', 'The student forgot the middle term: ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + '.'], [String(z.p + z.s * z.q), 'u2l7-middle-term', 'Square each term (both squares are positive) and include the middle term ' + t('2ab') + '.']] },
          'The middle term is missing (and both squares are positive): ' + t(b + '=' + z.p + (z.s > 0 ? '+' : '-') + '2\\sqrt{' + z.p * z.q + '}+' + z.q + '=' + key) + '.', [t('(a+b)^{2}=a^{2}+2ab+b^{2}') + '.'], 'error: squaring a binomial');
      } }] },
    { num: '14', parts: [
      { id: '14a', level: 'PRG', make: function (r) {
        var rows = [], want = {}, why = [];
        function add(tex, rat, w) { var id = 'r' + rows.length; rows.push({ id: id, html: t(tex) }); want[id] = rat ? 'r' : 'i'; why.push(t(tex) + ': ' + w + ', ' + (rat ? 'rational' : 'irrational')); }
        var flags = gen(function () { return [0, 1, 2, 3, 4, 5].map(function () { return r.chance(0.5); }); }, function (f) { var n = f.filter(Boolean).length; return n >= 2 && n <= 4; });
        var b = r.int(2, 7), a = gen(function () { return r.int(1, 9); }, function (a) { return ex.gcd(a, b) === 1 && a !== b; }), c0 = r.pick([2, 3, 5, 7]);
        if (flags[0]) add('\\sqrt{\\dfrac{' + a * a + '}{' + b * b + '}}', true, t('=\\frac{' + a + '}{' + b + '}')); else add('\\sqrt{\\dfrac{' + c0 + '}{' + b * b + '}}', false, t('=\\frac{' + sq(c0) + '}{' + b + '}'));
        var kk = r.int(2, 5), nc = r.pick([10, 20, 25, 30, 50, 60, 90, 100]);
        if (flags[1]) add('\\sqrt[3]{' + (r.chance(0.5) ? '-' : '') + kk * kk * kk + '}', true, 'a perfect cube'); else add(cr(nc), false, t(nc) + ' is not a perfect cube');
        var m = r.pick([2, 3, 5, 6, 7]), u = r.int(2, 4), m2 = gen(function () { return r.pick([2, 3, 5, 6, 7]); }, function (x) { return x !== m && !isSqN(x * m); });
        if (flags[2]) add(sq(m * u * u) + '\\cdot' + sq(m), true, t('=\\sqrt{' + m * m * u * u + '}=' + m * u)); else add(sq(m * u * u) + '\\cdot' + sq(m2), false, t('=\\sqrt{' + m * u * u * m2 + '}') + ', not a perfect square');
        var v = r.int(2, 4), w2 = r.pick([2, 3, 5]);
        if (flags[3]) add('\\dfrac{' + sq(m2 * v * v) + '}{' + sq(m2) + '}', true, t('=\\sqrt{' + v * v + '}=' + v)); else add('\\dfrac{' + sq(m2 * v * v * w2) + '}{' + sq(m2) + '}', false, t('=\\sqrt{' + v * v * w2 + '}=' + v + sq(w2)));
        var c = r.int(4, 9), d = r.int(2, 3);
        if (flags[4]) add(c + '-\\sqrt{' + d * d + '}', true, t('=' + c + '-' + d + '=' + (c - d))); else add(c + '-' + sq(d * d + 1), false, 'a rational minus an irrational number');
        var mm = r.pick([2, 3, 5]), uu = r.int(2, 3), x1 = r.int(2, 5), x2 = r.int(2, 5);
        if (flags[5]) add('\\sqrt{' + x1 * x1 + '}+\\sqrt{' + x2 * x2 + '}', true, t('=' + x1 + '+' + x2 + '=' + (x1 + x2))); else add(sq(mm * uu * uu) + '+' + sq(mm), false, t('=' + uu + sq(mm) + '+' + sq(mm) + '=' + (uu + 1) + sq(mm)));
        return P.grid('Classify each number as rational or irrational.', rows, [{ id: 'r', html: 'Rational' }, { id: 'i', html: 'Irrational' }], want, {},
          why.join('<br>'), ['Simplify each number first. A root is rational only when the radicand is a perfect power.'], 'rational or irrational');
      } },
      { id: '14b', level: 'ADV', make: function (r) {
        var n = r.pick([2, 3, 5, 6, 7, 10]), a = r.int(2, 9), b = r.pick([2, 3, 5, 6, 7].filter(function (x) { return x !== n; })), c = r.int(1, 6);
        function ckK(resp) {
          var p = HW.parse.number(resp); if (!p.ok) return form('notnumber', 'Type a whole number for ' + t('k') + '.');
          var k = p.value; if (!(k > 0) || !Number.isInteger(k)) return wrong('value', 'Choose a positive whole number.');
          if (isSqN(k)) return wrong('u2l7-k-square', t('\\sqrt{' + k + '}=' + Math.round(Math.sqrt(k))) + ' is rational. Choose ' + t('k') + ' so that ' + t('\\sqrt{k}') + ' is irrational.');
          if (!isSqN(n * k)) return wrong('u2l7-not-rational', t('\\sqrt{' + n + '}\\cdot\\sqrt{' + k + '}=\\sqrt{' + n * k + '}') + ', which is not a perfect square, so it is irrational.');
          return ok();
        }
        function ratish(x) { for (var q = 1; q <= 60; q++) if (Math.abs(x * q - Math.round(x * q)) < 1e-7) return true; return false; }
        function ckX(resp) {
          var rd = K.read(resp); if (rd.res) return rd.res; var x = rd.val; if (!isFinite(x)) return wrong('value', null);
          if (ratish(x)) return wrong('u2l7-x-rational', t('x') + ' must be <b>irrational</b> (for example, it can include ' + t('-' + sq(b)) + ').');
          if (!ratish(a + Math.sqrt(b) + x)) return wrong('u2l7-not-rational', 'The sum ' + t(a + '+' + sq(b) + '+x') + ' is still irrational. Cancel the ' + t(sq(b)) + '.');
          return ok();
        }
        var k0 = n * r.pick([1, 4]);
        var p = P.fields('Give examples. (a) A whole number ' + t('k') + ', with ' + t('\\sqrt{k}') + ' irrational, so that ' + t('\\sqrt{' + n + '}\\cdot\\sqrt{k}') + ' is rational. (b) An irrational number ' + t('x') + ' so that ' + t('(' + a + '+' + sq(b) + ')+x') + ' is rational.',
          [{ label: t('k='), name: 'k' }, { label: t('x='), name: 'x', mode: 'math', keys: 'u2l7rad' }], [ckK, ckX], [String(k0), c + '-' + sq(b)], t('k=' + k0) + ', ' + t('x=' + c + '-' + sq(b)) + ' (answers vary)',
          'Answers vary. (a) ' + t('\\sqrt{' + n + '}\\cdot\\sqrt{' + k0 + '}=\\sqrt{' + n * k0 + '}=' + Math.round(Math.sqrt(n * k0))) + ', rational. (b) ' + t('(' + a + '+' + sq(b) + ')+(' + c + '-' + sq(b) + ')=' + (a + c)) + ', rational: two irrational numbers can have a rational sum.',
          ['(a) Make ' + t(n + 'k') + ' a perfect square.', '(b) Choose ' + t('x') + ' so the ' + t(sq(b)) + ' cancels.'], 'irrational numbers with a rational result');
        p.good = [[String(n * 9), '-' + sq(b)]]; p.bad = [[String(n * n), c + '-' + sq(b)], [String(k0), '5']];
        return p;
      } }] },
    { num: '15', parts: [
      { id: '15a', level: 'ADV', make: function (r) {
        var z = gen(function () { return { a: r.int(2, 5), b: r.pick([2, 3, 5, 6, 7, 10, 11, 13]), s: r.pick([1, -1, -1]) }; }, function (z) { return !(z.a === 2 && z.b === 3) && z.a * z.a !== z.b; });
        var X = S(z.a, 1, 1, z.s, 2, z.b), X2 = smul(X, X), c0 = z.a * z.a - z.b, eq = 'x^{2}-' + 2 * z.a + 'x' + tm(c0, '', false);
        var p = P.fields('Show that ' + t('x=' + stex(X)) + ' is a solution of ' + t(eq + '=0') + ': find ' + t('x^{2}') + ' in simplest form, then the value of ' + t(eq) + '.',
          [{ label: t('x^{2}='), name: 'x²', mode: 'math', keys: 'u2l7rad' }, { label: t(eq + '='), name: 'value' }], [radCheck(stex(X2), { cands: [[String(z.a * z.a + z.b), 'u2l7-middle-term', t('(a+b)^{2}=a^{2}+2ab+b^{2}') + ' — include the middle term.']] }), K.number(0)],
          [stex(X2), '0'], t('x^{2}=' + stex(X2)) + ', value ' + t('0'),
          t('x^{2}=(' + stex(X) + ')^{2}=' + z.a * z.a + (z.s > 0 ? '+' : '-') + 2 * z.a + sq(z.b) + '+' + z.b + '=' + stex(X2)) + '<br>' + t(eq + '=(' + stex(X2) + ')-(' + stex(sscale(X, 2 * z.a)) + ')' + tm(c0, '', false) + '=0') + ' ✓, so ' + t('x=' + stex(X)) + ' is a solution.',
          ['Square the binomial (with the middle term).', 'Substitute and collect the whole numbers and the radicals separately.'], 'checking a radical solution');
        p.bad = [[String(z.a * z.a + z.b), '0']];
        return p;
      } },
      { id: '15b', level: 'PRG', make: function (r) {
        var z = gen(function () { var e = r.pick([[4, 1, 15], [5, 2, 6], [7, 4, 3], [8, 3, 7], [9, 4, 5], [10, 3, 11], [6, 1, 35], [2, 1, 3], [3, 2, 2]]); return { a: e[0], c: e[1], d: e[2], s: r.pick([-1, -1, 1]) }; }, function (z) { return !(z.a === 2 && z.c === 1 && z.d === 3 && z.s === -1) && !(z.a === 3 && z.c === 2); });
        var den = S(z.a, 1, 1, z.s * z.c, 2, z.d), key = stex(conj(den)), dd = z.a * z.a + z.c * z.c * z.d;
        return radP('Show that ' + t('\\dfrac{1}{' + stex(den) + '}') + ' is a binomial with no radical in the denominator: rationalize it and simplify.', key, { cands: [[stex(sdivq(conj(den), dd)), 'u2l7-conj-den', 'The denominator is ' + t(z.a * z.a + '-' + z.c * z.c * z.d + '=1') + '.'], [stex(den), 'sign', 'Multiplying by the conjugate changes the sign of the radical term.']] },
          t('\\dfrac{1}{' + stex(den) + '}\\cdot\\dfrac{' + key + '}{' + key + '}=\\dfrac{' + key + '}{' + z.a * z.a + '-' + z.c * z.c * z.d + '}=' + key) + ' ✓', ['Multiply the top and bottom by the conjugate ' + t(key) + '.'], 'reciprocal of a conjugate');
      } }] },
    { num: '16', section: 'Multiple Choice and Numerical Response', parts: [{ id: '16', level: 'BEG', make: function (r) {
      var z = gen(function () { return { k: r.int(2, 5), m: r.pick([2, 3, 4, 5, 6, 7, 9]) }; }, function (z) { return !(z.k === 3 && z.m === 4) && !(z.k === 3 && z.m === 2) && !(z.k === 5 && z.m === 2); });
      var K3 = z.k * z.k * z.k;
      return mcT(r, t(z.k + cr(z.m)) + ', written as an entire radical, is', cr(K3 * z.m), [[cr(z.k * z.m), 'Raise ' + t(z.k) + ' to the power of the index (3) before moving it inside.'], [cr(z.k * z.k * z.m), 'For a cube root, <b>cube</b> the coefficient (not square it).'], [cr(K3 * z.m * z.m * z.m), 'Only the coefficient is cubed, not the radicand.']],
        t(z.k + cr(z.m) + '=\\sqrt[3]{' + z.k + '^{3}\\cdot ' + z.m + '}=\\sqrt[3]{' + K3 + '\\cdot ' + z.m + '}=' + cr(K3 * z.m)), ['Cube the coefficient.'], 'MC: entire cube root');
    } }] },
    { num: '17', parts: [{ id: '17', level: 'EMG', make: function (r) {
      var z = gen(function () { return { c: r.int(2, 5), b: r.int(3, 15) }; }, function (z) { return z.b % z.c !== 0 && ex.gcd(z.b, z.c) === 1 && !(z.b === 9 && z.c === 2) && !(z.b === 10 && z.c === 4); });
      var B = frT(z.b, z.c);
      return mcT(r, 'The expression ' + t('\\sqrt{' + z.b + '-' + z.c + 'x}') + ' is defined for', 'x\\le ' + B, [['x\\ge ' + B, 'Dividing by ' + t('-' + z.c) + ' flips the inequality.'], ['x\\ge -' + B, 'Check the sign: ' + t('-' + z.c + 'x\\ge -' + z.b) + '.'], ['x\\le -' + B, 'Check the sign.']],
        t(z.b + '-' + z.c + 'x\\ge 0\\ \\Rightarrow\\ -' + z.c + 'x\\ge -' + z.b + '\\ \\Rightarrow\\ x\\le ' + B) + ' (dividing by ' + t('-' + z.c) + ' flips the sign).', ['Radicand ' + t('\\ge 0') + '.'], 'MC: restriction');
    } }] },
    { num: '18', parts: [{ id: '18', level: 'PRG', make: function (r) {
      var z = gen(function () { return { a: r.int(2, 6), b: r.int(2, 6), s: r.pick([2, 3, 5, 6]) }; }, function (z) { var k = 4 * (z.a + z.b) * (z.a + z.b) * z.s; return z.a !== z.b && k <= 9999 && z.a * z.a * z.s <= 200 && z.b * z.b * z.s <= 200 && !(z.a === 4 && z.b === 3 && z.s === 3); });
      var L = z.a * z.a * z.s, Wd = z.b * z.b * z.s, P2 = 2 * (z.a + z.b), k = P2 * P2 * z.s;
      return nrP('A rectangle has length ' + t(sq(L)) + ' cm and width ' + t(sq(Wd)) + ' cm. Its perimeter can be written as the entire radical ' + t('\\sqrt{k}') + ' cm. The value of ' + t('k') + ' is _____.', k,
        [[(z.a + z.b) * (z.a + z.b) * z.s, 'u2l7-half-perim', 'The perimeter is ' + t('2(\\ell+w)') + '.'], [2 * (L + Wd), 'u2l7-add-radicands', 'Simplify each radical and add like radicals first; then write the result as an entire radical.']],
        t('P=2(' + z.a + sq(z.s) + '+' + z.b + sq(z.s) + ')=' + P2 + sq(z.s) + '=\\sqrt{' + P2 * P2 + '\\cdot ' + z.s + '}=\\sqrt{' + k + '}') + ', so ' + t('k=' + k) + '.', ['Simplify each side, add, then write the perimeter as an entire radical.'], 'NR: perimeter as an entire radical');
    } }] },
    { num: '19', parts: [{ id: '19', level: 'PRG', make: function (r) {
      var z = gen(function () { return { k: r.pick([4, 6, 8, 9, 10]), m: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return !(z.k === 4 && z.m === 7) && z.k * z.k * z.m * 4 <= 1200; });
      var j = z.k % 2 === 0 ? 2 : 3, kk = z.k / j;
      return mcT(r, 'Which of the following is <b>not</b> equal to ' + t(z.k + sq(z.m)) + '?', z.k + sq(2 * z.m), [[sq(z.k * z.k * z.m), t(sq(z.k * z.k * z.m) + '=\\sqrt{' + z.k * z.k + '}\\sqrt{' + z.m + '}=' + z.k + sq(z.m)) + ' — equal.'], [j + sq(kk * kk * z.m), t(j + sq(kk * kk * z.m) + '=' + j + '(' + cf(kk) + sq(z.m) + ')=' + z.k + sq(z.m)) + ' — equal.'], ['\\frac{1}{2}' + sq(4 * z.k * z.k * z.m), t('\\frac{1}{2}' + sq(4 * z.k * z.k * z.m) + '=\\frac{1}{2}(' + 2 * z.k + sq(z.m) + ')=' + z.k + sq(z.m)) + ' — equal.']],
        t(z.k + sq(2 * z.m) + '=\\sqrt{' + 2 * z.k * z.k * z.m + '}') + ', but ' + t(z.k + sq(z.m) + '=\\sqrt{' + z.k * z.k * z.m + '}') + '. The others all simplify to ' + t(z.k + sq(z.m)) + '.', ['Simplify each choice (or write each as an entire radical).'], 'MC: equal radicals');
    } }] },
    { num: '20', parts: [{ id: '20', level: 'PRG', make: function (r) {
      var z = gen(function () { return { s: r.pick([2, 3, 5]), a: r.int(2, 5), p: r.int(2, 3), b: r.int(2, 3), q: r.int(2, 3) }; }, function (z) { var T = z.a * z.p - z.b * z.q + 1; return T >= 4 && z.p !== z.q && !(z.s === 3 && z.a === 5 && z.p === 2 && z.b === 2 && z.q === 3); });
      var T = z.a * z.p - z.b * z.q + 1, shown = z.a + sq(z.p * z.p * z.s) + '-' + z.b + sq(z.q * z.q * z.s) + '+' + sq(z.s);
      var ws = [[(T - 1) + sq(z.s), 'Don’t forget the last term ' + t(sq(z.s)) + '.'], [(T + 1) + sq(z.s), 'Recount the coefficients: ' + t(z.a * z.p + '-' + z.b * z.q + '+1') + '.'], [T + sq(2 * z.s), 'Like radicals keep their radicand: ' + t(sq(z.s)) + '.'], [(T - 2) + sq(z.s), 'Recount the coefficients.']].filter(function (w) { return !/^[01]\\/.test(w[0]); }).slice(0, 3);
      return mcT(r, t(shown) + ' simplifies to', (T === 1 ? '' : T) + sq(z.s), ws,
        t(shown + '=' + z.a * z.p + sq(z.s) + '-' + z.b * z.q + sq(z.s) + '+' + sq(z.s) + '=' + T + sq(z.s)), ['Simplify each radical; they are all multiples of ' + t(sq(z.s)) + '.'], 'MC: like radicals');
    } }] },
    { num: '21', parts: [{ id: '21', level: 'MAS', make: function (r) {
      var z = gen(function () { var pt = r.sample([2, 3, 5, 6, 7], 2); return { p: pt[0], tt: pt[1], c: r.int(2, 3), e: r.pick([2, 3, 5]), w: r.int(2, 4), C: r.pick([2, 3, 5, 6, 7]), v: r.int(1, 2) }; },
        function (z) { return z.C !== z.tt && z.C !== z.e && z.e !== z.p && ex.simplest(z.p * z.tt, 2) && ex.simplest(z.e * z.C, 2) && z.e * z.C * z.v * z.v <= 80 && !(z.p === 3 && z.tt === 2 && z.c === 2 && z.e === 2 && z.w === 3 && z.C === 5); });
      var A1 = z.c * z.c * z.p * z.tt, A2 = z.p * z.tt, X = z.e * z.w * z.w, Y = z.e * z.C * z.v * z.v, a = z.e * z.w, b = z.e * z.v, ans = a + b + z.C;
      var shown = sq(z.p) + '\\left(' + sq(A1) + '-' + z.c + sq(A2) + '\\right)+' + sq(z.e) + '\\left(' + sq(X) + '+' + sq(Y) + '\\right)';
      return nrP('The expression ' + t(shown) + ' can be written in simplest form as ' + t('a+b\\sqrt{c}') + '. The value of ' + t('a+b+c') + ' is _____.', ans, [[a + z.c * z.p + b + z.C, 'u2l7-like', 'The two ' + t(sq(z.tt)) + ' terms cancel.']],
        t('=' + sq(z.p * A1) + '-' + z.c + sq(z.p * A2) + '+' + sq(z.e * X) + '+' + sq(z.e * Y) + '=' + z.c * z.p + sq(z.tt) + '-' + z.c * z.p + sq(z.tt) + '+' + a + '+' + b + sq(z.C) + '=' + a + '+' + b + sq(z.C)) + '. ' + t('a+b+c=' + a + '+' + b + '+' + z.C + '=' + ans) + '.',
        ['Distribute, then simplify every radical.', 'Some terms cancel.'], 'NR: expand and simplify');
    } }] },
    { num: '22', parts: [{ id: '22', level: 'PRG', make: function (r) {
      var z = gen(function () { var ps = r.sample([2, 3, 5, 6, 7, 10, 11], 2); return { a: Math.max(ps[0], ps[1]), b: Math.min(ps[0], ps[1]) }; }, function (z) { return !(z.a === 5 && z.b === 2); });
      var B = S(1, 2, z.a, -1, 2, z.b), res = smul(B, B), rad = S(-2, 2, z.a * z.b);
      return mcT(r, t('\\left(' + sq(z.a) + '-' + sq(z.b) + '\\right)^{2}') + ' is equal to', stex(res), [[String(z.a - z.b), 'Squaring gives ' + t(z.a + '+' + z.b) + ' plus a middle term.'], [String(z.a + z.b), 'You forgot the middle term ' + t('-2' + sq(z.a) + sq(z.b)) + '.'], [stex(sadd(Q(z.a - z.b), rad)), 'Both squares are positive: ' + t('(-' + sq(z.b) + ')^{2}=' + z.b) + '.']],
        t('(' + sq(z.a) + '-' + sq(z.b) + ')^{2}=' + z.a + '-2\\sqrt{' + z.a * z.b + '}+' + z.b + '=' + stex(res)), [t('(a-b)^{2}=a^{2}-2ab+b^{2}') + '.'], 'MC: squaring a binomial');
    } }] },
    { num: '23', parts: [{ id: '23', level: 'EMG', make: function (r) {
      var z = gen(function () { return { j: r.pick([2, 3, 5, 6, 7]), m: r.pick([2, 3, 5, 6, 7, 10]) }; }, function (z) { return z.j !== z.m && z.j * z.m <= 70 && !(z.j === 2 && z.m === 6) && !(z.j === 2 && z.m === 5); });
      var k = z.j * z.m;
      return mcT(r, t('\\dfrac{' + k + '}{' + sq(z.m) + '}') + ', written with a rational denominator, is', z.j + sq(z.m), [[sq(z.j), 'Multiply the top and bottom by ' + t(sq(z.m)) + '; don’t divide under the root.'], [z.m + sq(z.j), 'Multiply the top and bottom by ' + t(sq(z.m)) + ': ' + t('\\dfrac{' + k + sq(z.m) + '}{' + z.m + '}') + '.'], [k + sq(z.m), 'The new denominator is ' + t(z.m) + ' — divide by it.']],
        t('\\dfrac{' + k + '}{' + sq(z.m) + '}\\cdot\\dfrac{' + sq(z.m) + '}{' + sq(z.m) + '}=\\dfrac{' + k + sq(z.m) + '}{' + z.m + '}=' + z.j + sq(z.m)), ['Multiply the top and bottom by ' + t(sq(z.m)) + '.'], 'MC: rationalizing');
    } }] },
    { num: '24', parts: [{ id: '24', level: 'BEG', make: function (r) {
      var z = gen(function () { return { k: r.int(2, 9), m: r.pick([2, 3, 4, 5, 6, 7, 9]) }; }, function (z) { var K3 = z.k * z.k * z.k * z.m; return K3 <= 9999 && [250, 108, 54].indexOf(K3) < 0; });
      var K3 = z.k * z.k * z.k, ans = K3 * z.m;
      return nrP('When ' + t(z.k + cr(z.m)) + ' is written as the entire radical ' + t('\\sqrt[3]{k}') + ', the value of ' + t('k') + ' is _____.', ans, [[z.k * z.k * z.m, 'u2l7-no-power', 'Cube the coefficient (index 3).'], [z.k * z.m, 'u2l7-no-power', 'Raise ' + t(z.k) + ' to the power 3 before multiplying.']],
        t(z.k + cr(z.m) + '=\\sqrt[3]{' + K3 + '\\cdot ' + z.m + '}=\\sqrt[3]{' + ans + '}') + ', so ' + t('k=' + ans) + '.', ['Cube the coefficient and multiply it into the radicand.'], 'NR: entire cube root');
    } }] },
    { num: '25', parts: [{ id: '25', level: 'EMG', make: function (r) {
      var z = gen(function () { return { a: r.int(2, 4), b: r.pick([2, 3, 5, 6, 7]), c: r.int(1, 7) }; }, function (z) { var v = z.a * z.a * z.b - z.c * z.c; return v !== 0 && !(z.a === 3 && z.b === 2 && z.c === 4) && z.a * z.b - z.c * z.c !== v && z.a * z.b - z.c * z.c !== z.a * z.a * z.b + z.c * z.c; });
      var v = z.a * z.a * z.b - z.c * z.c, ap = z.a + sq(z.b);
      return mcT(r, t('\\left(' + ap + '+' + z.c + '\\right)\\left(' + ap + '-' + z.c + '\\right)') + ' is equal to', String(v), [[String(z.a * z.b - z.c * z.c), t('(' + ap + ')^{2}=' + z.a * z.a + '\\cdot ' + z.b + '=' + z.a * z.a * z.b) + ', not ' + t(z.a * z.b) + '.'], [String(z.a * z.a * z.b + z.c * z.c), 'The last terms multiply to ' + t('-' + z.c * z.c) + '.'], [stex(S(v, 1, 1, -2 * z.a * z.c, 2, z.b)), 'The middle terms cancel (conjugates).']],
        t('(' + ap + ')^{2}-' + z.c + '^{2}=' + z.a * z.a * z.b + '-' + z.c * z.c + '=' + v), ['Conjugates: ' + t('(a+b)(a-b)=a^{2}-b^{2}') + '.'], 'MC: conjugates');
    } }] },
    { num: '26', parts: [{ id: '26', level: 'PRG', make: function (r) {
      var z = gen(function () { return { p: r.int(3, 9), q: r.int(2, 5), c: r.int(2, 4), m: r.pick([2, 3, 5]), u: r.int(2, 3), m2: r.pick([2, 3, 5]) }; }, function (z) { return ex.gcd(z.p, z.q) === 1 && z.m2 !== z.m && !(z.p === 7 && z.q === 2); });
      var irr = sq(z.m * z.u * z.u) + '+' + sq(z.m);
      return mcT(r, 'Which number is irrational?', irr, [['\\sqrt{\\dfrac{' + z.p * z.p + '}{' + z.q * z.q + '}}', t('=\\frac{' + z.p + '}{' + z.q + '}') + ', rational.'], ['\\sqrt[3]{-' + z.c * z.c * z.c + '}', t('=-' + z.c) + ', rational.'], [sq(z.m2 * 4) + '\\cdot' + sq(z.m2), t('=\\sqrt{' + z.m2 * z.m2 * 4 + '}=' + 2 * z.m2) + ', rational.']],
        t(irr + '=' + z.u + sq(z.m) + '+' + sq(z.m) + '=' + (z.u + 1) + sq(z.m)) + ', irrational. The others are ' + t('\\frac{' + z.p + '}{' + z.q + '}') + ', ' + t('-' + z.c) + ' and ' + t(2 * z.m2) + '.', ['Simplify each one.'], 'MC: irrational');
    } }] },
    { num: '27', parts: [{ id: '27', level: 'ADV', make: function (r) {
      var z = gen(function () { return { a: r.int(2, 5), b: r.pick([2, 3, 5, 6, 7, 10, 11, 13]), j: r.int(1, 4) }; }, function (z) { var d = z.a * z.a - z.b; return d > 0 && d <= 12 && !(z.a === 3 && z.b === 2 && z.j === 2); });
      var d = z.a * z.a - z.b, k = d * z.j, A = z.j * z.a, B = z.j, ans = A * B * z.b;
      return nrP('The expression ' + t('\\dfrac{' + k + '}{' + z.a + '-' + sq(z.b) + '}') + ' can be written in simplest form as ' + t('a+b\\sqrt{c}') + '. The value of ' + t('abc') + ' is _____.', ans, [[k * z.a * k * z.b, 'u2l7-den-only', 'Divide by the new denominator ' + t(z.a * z.a + '-' + z.b + '=' + d) + '.']],
        t('\\dfrac{' + k + '}{' + z.a + '-' + sq(z.b) + '}\\cdot\\dfrac{' + z.a + '+' + sq(z.b) + '}{' + z.a + '+' + sq(z.b) + '}=\\dfrac{' + k + '(' + z.a + '+' + sq(z.b) + ')}{' + z.a * z.a + '-' + z.b + '}=' + stex(S(A, 1, 1, B, 2, z.b))) + '. ' + t('abc=' + A + '\\cdot ' + B + '\\cdot ' + z.b + '=' + ans) + '.',
        ['Multiply the top and bottom by the conjugate ' + t(z.a + '+' + sq(z.b)) + '.'], 'NR: conjugate');
    } }] }
  ];

  /* =========================== Extra Practice 7 (a second practice test) =========================== */
  var EXTRA = [
    { num: '1', section: 'A. Multiple Choice', parts: [{ id: 'x1', level: 'EMG', make: function (r) {
      var z = gen(function () { return { a: r.pick([4, 6, 4]), s: r.pick([2, 3, 5]) }; }, function (z) { return !(z.a === 4 && z.s === 2) && z.a * z.a * z.a * z.s <= 1200; });
      var M = z.a * z.a * z.a * z.s, h = z.a / 2;
      return mcT(r, t('\\sqrt[3]{-' + M + '}') + ' in simplest form is', '-' + z.a + cr(z.s), [['-2' + cr(h * h * h * z.s), 'Equal, but not simplest: ' + t(h * h * h * z.s) + ' still has a perfect cube factor.'], ['-' + 2 * z.a + cr(z.s), t(z.a * z.a * z.a) + ' comes out as its cube root, ' + t(z.a) + '.'], [z.a + cr(z.s), 'The cube root of a negative number is negative.']],
        t('\\sqrt[3]{-' + M + '}=\\sqrt[3]{-' + z.a * z.a * z.a + '}\\cdot' + cr(z.s) + '=-' + z.a + cr(z.s)), ['Find the largest perfect cube factor.'], 'MC: simplest cube root');
    } }] },
    { num: '2', parts: [{ id: 'x2', level: 'PRG', make: function (r) {
      var items = windowItems(r, 4, false, ['96,98,99,104']), sorted = items.slice().sort(function (a, b) { return a.v - b.v; }), kth = r.int(2, 3), names = { 2: 'second', 3: 'third' };
      var right = sorted[kth - 1];
      return mcT(r, 'The numbers ' + items.map(function (x) { return t(x.tex); }).join(', ') + ' are ranked from least to greatest. The ' + names[kth] + ' number in the list is', right.tex, items.filter(function (x) { return x !== right; }).map(function (x) { return [x.tex, 'Write each as an entire radical: ' + t(x.conv) + ' is number ' + (sorted.indexOf(x) + 1) + ' in the order.']; }),
        'Entire radicals: ' + items.map(function (x) { return t(x.conv); }).join(', ') + '. Least to greatest: ' + t(sorted.map(function (x) { return x.tex; }).join(',\\ ')) + '; the ' + names[kth] + ' is ' + t(right.tex) + '.', ['Write each as an entire radical and compare the radicands.'], 'MC: ordering');
    } }] },
    { num: '3', parts: [{ id: 'x3', level: 'EMG', make: function (r) {
      var z = gen(function () { return { c: r.int(2, 6), b: r.int(3, 15) }; }, function (z) { return z.b % z.c !== 0 && ex.gcd(z.b, z.c) === 1 && !(z.c === 4 && z.b === 10); });
      var B = frT(z.b, z.c);
      return mcT(r, 'The expression ' + t('\\sqrt{' + z.c + 'x-' + z.b + '}') + ' is defined for', 'x\\ge ' + B, [['x\\le ' + B, 'The radicand must be at least 0: ' + t(z.c + 'x-' + z.b + '\\ge 0') + ' (dividing by a positive number keeps the sign).'], ['x\\ge -' + B, 'Check the sign: ' + t(z.c + 'x\\ge ' + z.b) + '.'], ['x\\ge ' + z.b, 'Divide both sides by ' + t(z.c) + '.']],
        t(z.c + 'x-' + z.b + '\\ge 0\\ \\Rightarrow\\ ' + z.c + 'x\\ge ' + z.b + '\\ \\Rightarrow\\ x\\ge ' + B), ['Radicand ' + t('\\ge 0') + '.'], 'MC: restriction');
    } }] },
    { num: '4', parts: [{ id: 'x4', level: 'PRG', make: function (r) {
      var z = gen(function () { return { c: r.int(2, 5), s: r.pick([2, 3, 5, 6, 7]), i: r.int(1, 3) }; }, function (z) { return !(z.c === 4 && z.s === 2 && z.i === 2) && z.c * z.c * z.s <= 150; });
      var M = z.c * z.c * z.s, xi = pw('x', z.i);
      return mcT(r, 'For ' + t('x,y\\ge 0') + ', ' + t('\\sqrt{' + M + pw('x', 2 * z.i + 1) + 'y^{2}}') + ' in simplest form is', z.c + xi + 'y\\sqrt{' + z.s + 'x}', [[z.c * z.c + xi + 'y\\sqrt{' + z.s + 'x}', t(z.c * z.c) + ' comes out of the root as ' + t(z.c) + '.'], [z.c + xi + 'y' + sq(z.s), 'One ' + t('x') + ' is left over inside the root.'], [z.c + xi + '\\sqrt{' + z.s + 'xy}', t('\\sqrt{y^{2}}=y') + ' comes out of the root.']],
        t('\\sqrt{' + z.c * z.c + pw('x', 2 * z.i) + 'y^{2}}\\cdot\\sqrt{' + z.s + 'x}=' + z.c + xi + 'y\\sqrt{' + z.s + 'x}'), ['Divide each exponent by 2.'], 'MC: variable radical');
    } }] },
    { num: '5', parts: [{ id: 'x5', level: 'PRG', make: function (r) {
      var z = gen(function () { var pr = r.pick([[2, 6], [3, 6], [2, 10], [5, 10], [3, 15], [5, 15], [6, 10], [6, 15], [2, 14], [7, 14], [3, 21], [10, 15]]); return { a: r.int(2, 5), c: r.int(2, 5), b: pr[0], d: pr[1] }; }, function (z) { return !(z.a === 4 && z.c === 2 && z.b === 3 && z.d === 6); });
      var bd = z.b * z.d, u = ex.nthFactor(bd, 2), v = bd / (u * u), ac = z.a * z.c;
      return mcT(r, t(z.a + sq(z.b) + '\\cdot ' + z.c + sq(z.d)) + ' in simplest form is', ac * u + sq(v), [[(z.a + z.c) + sq(bd), 'Multiply the coefficients (don’t add them), then simplify.'], [ac * u * u + sq(v), t(u * u) + ' comes out of the root as ' + t(u) + '.'], [2 * ac * u + sq(v), 'Check: ' + t(ac + sq(bd) + '=' + ac + '(' + u + sq(v) + ')') + '.']],
        t('(' + z.a + '\\cdot ' + z.c + ')\\sqrt{' + z.b + '\\cdot ' + z.d + '}=' + ac + sq(bd) + '=' + ac + '(' + u + sq(v) + ')=' + ac * u + sq(v)), ['Coefficients times coefficients, radicands times radicands.'], 'MC: multiplying radicals');
    } }] },
    { num: '6', parts: [{ id: 'x6', level: 'PRG', make: function (r) {
      var z = gen(function () { return { p: r.pick([2, 3, 5, 6, 7]), u: r.pick([2, 3, 5, 7, 10, 11]), v: r.int(2, 4) }; }, function (z) { return z.u !== z.p && z.p * z.u <= 80 && !(z.p === 6 && z.u === 10 && z.v === 2) && !isSqN(z.u); });
      var A = z.p * z.u, B = z.p * z.v * z.v;
      return mcT(r, t('\\dfrac{' + sq(A) + '+' + sq(B) + '}{' + sq(z.p) + '}') + ' simplifies to', sq(z.u) + '+' + z.v, [[sq(z.u) + '+' + z.v * z.v, t(sq(z.v * z.v) + '=' + z.v) + '.'], [sq(z.u + z.v * z.v), 'Divide each term separately; the roots don’t combine.'], [z.v + sq(z.u) + '+' + z.v, 'Only the second term simplifies to a whole number.']],
        'Divide each term: ' + t('\\sqrt{\\dfrac{' + A + '}{' + z.p + '}}+\\sqrt{\\dfrac{' + B + '}{' + z.p + '}}=' + sq(z.u) + '+' + sq(z.v * z.v) + '=' + sq(z.u) + '+' + z.v), ['Divide each term of the numerator by ' + t(sq(z.p)) + '.'], 'MC: dividing a sum');
    } }] },
    { num: '7', parts: [{ id: 'x7', level: 'EMG', make: function (r) {
      var z = gen(function () { var bc = r.sample([2, 3, 5, 6, 7], 2); return { a: r.int(2, 4), b: bc[0], c: bc[1] }; }, function (z) { var v = z.a * z.a * z.b - z.c; return v !== 0 && !(z.a === 2 && z.b === 5 && z.c === 3) && z.a * z.b - z.c !== z.a * z.a * z.b + z.c && z.a * z.b - z.c !== v; });
      var v = z.a * z.a * z.b - z.c, e = z.a + sq(z.b) + '-' + sq(z.c);
      return mcT(r, 'When ' + t(e) + ' is multiplied by its conjugate, the result is', String(v), [[String(z.a * z.b - z.c), t('(' + z.a + sq(z.b) + ')^{2}=' + z.a * z.a + '\\cdot ' + z.b + '=' + z.a * z.a * z.b) + '.'], [String(z.a * z.a * z.b + z.c), 'The conjugate product is ' + t('a^{2}-b^{2}') + '.'], [stex(sadd(Q(v), S(-2 * z.a, 2, z.b * z.c))), 'The middle terms cancel when you multiply by the conjugate.']],
        t('(' + e + ')(' + z.a + sq(z.b) + '+' + sq(z.c) + ')=' + z.a * z.a * z.b + '-' + z.c + '=' + v), ['The conjugate changes the middle sign.'], 'MC: conjugate product');
    } }] },
    { num: '8', parts: [{ id: 'x8', level: 'PRG', make: function (r) {
      var z = gen(function () { return { p: r.pick([2, 3, 5]), j: r.int(2, 5), B: r.chance(0.4) }; }, function (z) { return !(z.p === 2 && z.j === 2 && !z.B) && !(z.p === 3 && z.j === 2 && z.B); });
      var p = z.p, k = p * z.j, den = z.B ? p * p : p, mult = z.B ? p : p * p;
      return mcT(r, t('\\dfrac{' + k + '}{' + cr(den) + '}') + ', written with a rational denominator, is', cf(z.j) + cr(mult), [[cf(z.j) + cr(den), 'Multiply by ' + t(cr(mult)) + ' so the denominator becomes ' + t(cr(p * p * p) + '=' + p) + '.'], [k + cr(mult), 'Divide by the new denominator ' + t(p) + '.'], [cf(z.j) + sq(mult), 'Keep the cube root.']],
        t('\\dfrac{' + k + '}{' + cr(den) + '}\\cdot\\dfrac{' + cr(mult) + '}{' + cr(mult) + '}=\\dfrac{' + k + cr(mult) + '}{' + cr(p * p * p) + '}=\\dfrac{' + k + cr(mult) + '}{' + p + '}=' + cf(z.j) + cr(mult)), ['Make a perfect cube under the root in the denominator.'], 'MC: rationalizing a cube root');
    } }] },
    { num: '9', parts: [{ id: 'x9', level: 'EMG', make: function (r) {
      var z = gen(function () { return { a: r.int(2, 6), b: r.int(2, 6), s: r.pick([2, 3, 5, 6]) }; }, function (z) { return z.a > z.b && z.a * z.a * z.s <= 200 && !(z.a === 5 && z.b === 2 && z.s === 2); });
      var L = z.a * z.a * z.s, Wd = z.b * z.b * z.s, P2 = 2 * (z.a + z.b);
      return mcT(r, 'A rectangle has length ' + t(sq(L)) + ' cm and width ' + t(sq(Wd)) + ' cm. Its exact perimeter is', P2 + sq(z.s) + '\\text{ cm}', [[z.a * z.b * z.s + '\\text{ cm}', 'That is the area (' + t(sq(L) + '\\cdot' + sq(Wd)) + ').'], [(z.a + z.b) + sq(z.s) + '\\text{ cm}', 'The perimeter is ' + t('2(\\ell+w)') + '.'], [stex(S(2, 2, L + Wd)) + '\\text{ cm}', 'You can’t add radicands: simplify each radical first.']],
        t('P=2(' + z.a + sq(z.s) + '+' + z.b + sq(z.s) + ')=2(' + (z.a + z.b) + sq(z.s) + ')=' + P2 + sq(z.s)) + ' cm.', ['Simplify each side, then ' + t('P=2(\\ell+w)') + '.'], 'MC: perimeter');
    } }] },
    { num: '10', parts: [{ id: 'x10', level: 'PRG', make: function (r) {
      var z = gen(function () { return { m: r.pick([2, 3, 5, 6, 7]), u: r.int(2, 3), v: r.int(2, 4), w: r.pick([2, 3, 5]) }; }, function (z) { return !(z.m === 3 && z.v === 3) && !(z.m === 2) && z.w !== 1; });
      var rat = sq(z.m) + '\\cdot' + sq(z.m * z.v * z.v);
      return mcT(r, 'Which number is rational?', rat, [[sq(z.m) + '+' + sq(z.m * z.u * z.u), t('=' + (z.u + 1) + sq(z.m)) + ', irrational.'], ['\\dfrac{' + sq(z.m) + '}{' + sq(z.m * z.w) + '}', t('=\\dfrac{1}{' + sq(z.w) + '}=\\dfrac{' + sq(z.w) + '}{' + z.w + '}') + ', irrational.'], ['\\left(1+' + sq(z.m) + '\\right)^{2}', t('=' + (1 + z.m) + '+2' + sq(z.m)) + ', irrational.']],
        t(rat + '=\\sqrt{' + z.m * z.m * z.v * z.v + '}=' + z.m * z.v) + ', rational.', ['Simplify each one.'], 'MC: rational');
    } }] },
    { num: '11', section: 'B. Numerical Response', parts: [{ id: 'x11', level: 'ADV', make: function (r) {
      var z = gen(function () { var pt = r.sample([2, 3, 5, 6, 7], 2); return { p: pt[0], tt: pt[1], a: r.int(1, 3), b: r.int(1, 3) }; }, function (z) { return ex.simplest(z.p * z.tt, 2) && (z.a * z.p) % z.b === 0 && z.a * z.p / z.b >= 2 && (z.a > 1 || z.b > 1) && !(z.a === 2 && z.p === 3 && z.b === 2 && z.tt === 2); });
      var c = z.a * z.p / z.b, X = z.a * z.a * z.p, Y = z.b * z.b * z.tt, ans = z.a * z.p + z.b * z.tt;
      var shown = sq(X) + '\\left(' + sq(z.p * z.tt) + '+' + sq(z.p) + '\\right)-' + sq(Y) + '\\left(' + c + '-' + sq(z.tt) + '\\right)';
      return nrP('The expression ' + t(shown) + ' simplifies to a whole number. The whole number is _____.', ans, [[z.a * z.p - z.b * z.tt, 'sign', t('-' + sq(Y) + '\\cdot(-' + sq(z.tt) + ')') + ' is positive.']].filter(function (x) { return x[0] >= 0; }),
        t('=' + sq(X * z.p * z.tt) + '+' + sq(X * z.p) + '-' + c + sq(Y) + '+' + sq(Y * z.tt) + '=' + cf(z.a * z.p) + sq(z.tt) + '+' + z.a * z.p + '-' + cf(c * z.b) + sq(z.tt) + '+' + z.b * z.tt + '=' + ans), ['Distribute both products and simplify every radical.', 'The radical terms cancel.'], 'NR: whole-number result');
    } }] },
    { num: '12', parts: [{ id: 'x12', level: 'PRG', make: function (r) {
      var z = gen(function () { return { a: r.int(2, 4), b: r.pick([2, 3, 5, 6, 7]), c: r.int(1, 5) }; }, function (z) { return !(z.a === 2 && z.b === 3 && z.c === 1); });
      var A = z.a * z.a * z.b + z.c * z.c, B = 2 * z.a * z.c, ans = A + B + z.b;
      return nrP(t('\\left(' + z.a + sq(z.b) + '-' + z.c + '\\right)^{2}') + ' can be written in simplest form as ' + t('a-b\\sqrt{c}') + '. The value of ' + t('a+b+c') + ' is _____.', ans, [[A + z.b, 'u2l7-middle-term', 'Include the middle term ' + t('-2(' + z.a + sq(z.b) + ')(' + z.c + ')') + '.'], [z.a * z.b + z.c * z.c + B + z.b, 'u2l7-coef-square', t('(' + z.a + sq(z.b) + ')^{2}=' + z.a * z.a * z.b) + '.']],
        t('(' + z.a + sq(z.b) + '-' + z.c + ')^{2}=' + z.a * z.a * z.b + '-' + B + sq(z.b) + '+' + z.c * z.c + '=' + A + '-' + B + sq(z.b)) + ', so ' + t('a+b+c=' + A + '+' + B + '+' + z.b + '=' + ans) + '.', [t('(a-b)^{2}=a^{2}-2ab+b^{2}') + '.'], 'NR: squaring a binomial');
    } }] },
    { num: '13', parts: [{ id: 'x13', level: 'MAS', make: function (r) {
      var z = gen(function () { return { a: r.int(1, 9), c: r.int(2, 5), b: r.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23]) }; }, function (z) { var d = z.c * z.c - z.b; if (d <= 0) return false; var A = (z.a * z.c + z.b) / d, B = (z.a + z.c) / d; return Number.isInteger(A) && Number.isInteger(B) && A * B <= 9999 && !(z.a === 5 && z.c === 2 && z.b === 3); });
      var d = z.c * z.c - z.b, A = (z.a * z.c + z.b) / d, B = (z.a + z.c) / d, ans = A * B;
      return nrP(t('\\dfrac{' + z.a + '+' + sq(z.b) + '}{' + z.c + '-' + sq(z.b) + '}') + ' can be written in the form ' + t('a+b' + sq(z.b)) + '. The value of ' + t('ab') + ' is _____.', ans, (d > 1 ? [[(z.a * z.c + z.b) * (z.a + z.c), 'u2l7-den-only', 'Divide by the denominator ' + t(z.c * z.c + '-' + z.b + '=' + d) + '.']] : []),
        t('=\\dfrac{(' + z.a + '+' + sq(z.b) + ')(' + z.c + '+' + sq(z.b) + ')}{' + z.c * z.c + '-' + z.b + '}=\\dfrac{' + z.a * z.c + '+' + cf(z.a) + sq(z.b) + '+' + z.c + sq(z.b) + '+' + z.b + '}{' + d + '}=' + stex(S(A, 1, 1, B, 2, z.b))) + ', so ' + t('ab=' + A + '\\cdot ' + B + '=' + ans) + '.', ['Multiply the top and bottom by the conjugate ' + t(z.c + '+' + sq(z.b)) + '.'], 'NR: conjugate quotient');
    } }] },
    { num: '14', parts: [{ id: 'x14', level: 'PRG', make: function (r) {
      var z = gen(function () { return { a: r.int(2, 8), b: r.pick([2, 3, 5, 6, 7, 10, 11]) }; }, function (z) { var two = z.a * z.a * z.b; return two % 2 === 0 && two / 2 !== 90 && two / 2 <= 300 && !isSqN(two / 2); });
      var A = z.a * z.a * z.b / 2, ans = z.a * z.b;
      return nrP('A square has an area of ' + t(A) + ' cm². Its diagonal can be written in simplest form as ' + t('a\\sqrt{b}') + ' cm. The value of ' + t('ab') + ' is _____.', ans, [[2 * A, 'u2l7-no-root', 'That is ' + t('d^{2}') + '. Simplify ' + t('d=\\sqrt{' + 2 * A + '}') + '.']],
        'Side ' + t('=' + sq(A)) + ', so ' + t('d^{2}=' + A + '+' + A + '=' + 2 * A) + ' and ' + t('d=' + sq(2 * A) + '=' + z.a + sq(z.b)) + '. ' + t('ab=' + z.a + '\\cdot ' + z.b + '=' + ans) + '.', ['Side ' + t('=\\sqrt{A}') + '. Use the Pythagorean theorem for the diagonal.'], 'NR: diagonal of a square');
    } }] },
    { num: '15', section: 'C. Written Response', stem: 'Simplify. Assume the variables are positive.', parts: [
      { id: 'x15a', level: 'PRG', make: function (r) {
        var z = gen(function () { return { L: r.pick(['a', 'x', 'm']), m: r.pick([2, 3, 5, 6, 7]), p: r.int(2, 5), q: r.int(2, 5) }; }, function (z) { return z.p !== z.q && z.p * z.p * z.m <= 150 && z.q * z.q * z.m <= 150 && !(z.m === 2 && z.p === 3 && z.q === 5); });
        var L = z.L, T = z.p + z.q - 1, key = T + L + '\\sqrt{' + z.m + L + '}';
        var shown = '\\sqrt{' + z.p * z.p * z.m + L + '^{3}}+' + L + '\\sqrt{' + z.q * z.q * z.m + L + '}-\\sqrt{' + z.m + L + '^{3}}';
        return radP(t(shown), key, { cands: [[T + '\\sqrt{' + z.m + L + '}', 'u2l7-var-out', t('\\sqrt{' + L + '^{3}}=' + L + '\\sqrt{' + L + '}') + ': each term has an ' + t(L) + ' in front.']] },
          t(shown + '=' + z.p + L + '\\sqrt{' + z.m + L + '}+' + z.q + L + '\\sqrt{' + z.m + L + '}-' + L + '\\sqrt{' + z.m + L + '}=' + key), ['Simplify each radical; they become like radicals.'], 'adding variable radicals');
      } },
      { id: 'x15b', level: 'ADV', make: function (r) {
        var pool = [];
        [[4, 3], [6, 6], [10, 6], [12, 6], [6, 3]].forEach(function (ue) { var u3 = ue[0] * ue[0] * ue[0]; for (var A = 2; A <= 60; A++) if (u3 % A === 0) { var B = u3 / A; if (B >= 2 && B <= 60 && !isCubeN(A) && !isCubeN(B)) pool.push({ u: ue[0], E: ue[1], A: A, B: B }); } });
        var z = gen(function () { var e = r.pick(pool); return { u: e.u, E: e.E, A: e.A, B: e.B, e1: r.int(1, e.E - 1) }; }, function (z) { return !(z.A === 24 && z.B === 9) && !(z.A === 9 && z.B === 24); });
        var e2 = z.E - z.e1, key = z.u + pw('x', z.E / 3), shown = '\\sqrt[3]{' + z.A + pw('x', z.e1) + '}\\cdot\\sqrt[3]{' + z.B + pw('x', e2) + '}';
        return radP(t(shown), key, { cands: [[z.u + pw('x', z.E), 'u2l7-var-exp', t('\\sqrt[3]{' + pw('x', z.E) + '}=' + pw('x', z.E / 3)) + ' — divide the exponent by 3.']] },
          t(shown + '=\\sqrt[3]{' + z.A * z.B + pw('x', z.E) + '}=' + key) + ' (' + t(z.A * z.B + '=' + z.u + '^{3}') + ').', ['Multiply the radicands into one cube root.', 'Look for a perfect cube.'], 'multiplying cube roots');
      } },
      { id: 'x15c', level: 'ADV', make: function (r) {
        var z = gen(function () { return { p: r.pick([2, 3, 5, 6, 7]), k: r.int(2, 12) }; }, function (z) { return ex.gcd(z.k, z.p) > 1 && !(z.p === 3 && z.k === 6) && !(z.p === 2 && z.k === 5); });
        var g = ex.gcd(z.k, z.p), Kk = z.k / g, Pp = z.p / g, key = '\\frac{' + cf(Kk) + '\\sqrt{' + z.p + 'x}}{' + cf(Pp) + 'x}';
        return radP(t('\\dfrac{' + z.k + '}{\\sqrt{' + z.p + 'x}}'), key, { cands: [['\\frac{' + z.k + '\\sqrt{' + z.p + 'x}}{x}', 'u2l7-den-m', t('\\sqrt{' + z.p + 'x}\\cdot\\sqrt{' + z.p + 'x}=' + z.p + 'x') + '.']] },
          t('\\dfrac{' + z.k + '}{\\sqrt{' + z.p + 'x}}\\cdot\\dfrac{\\sqrt{' + z.p + 'x}}{\\sqrt{' + z.p + 'x}}=\\dfrac{' + z.k + '\\sqrt{' + z.p + 'x}}{' + z.p + 'x}=' + key), ['Multiply the top and bottom by ' + t('\\sqrt{' + z.p + 'x}') + ', then reduce.'], 'rationalizing with a variable');
      } }] },
    { num: '16', stem: 'Rationalize the denominator and simplify.', parts: [
      { id: 'x16a', level: 'ADV', make: function (r) {
        var z = gen(function () { var pq = r.sample([2, 3, 5, 7, 11], 2); return { p: Math.max(pq[0], pq[1]), q: Math.min(pq[0], pq[1]), s: r.pick([1, 1, -1]) }; }, function (z) { return !(z.p === 5 && z.q === 2 && z.s === 1); });
        var den = S(1, 2, z.p, z.s, 2, z.q), D = z.p - z.q, num = smul(S(1, 2, z.p * z.q), conj(den)), key = stex(sdivq(num, D));
        var shown = '\\dfrac{' + sq(z.p * z.q) + '}{' + stex(den) + '}';
        return radP(t(shown), key, { cands: [[stex(sdivq(num, z.p + z.q)), 'u2l7-conj-den', 'The denominator is ' + t(z.p + '-' + z.q) + '.']] },
          t(shown + '=\\dfrac{' + sq(z.p * z.q) + '(' + stex(conj(den)) + ')}{' + z.p + '-' + z.q + '}=\\dfrac{' + stex(num) + '}{' + D + '}=' + key), ['Multiply by the conjugate ' + t(stex(conj(den))) + '.', 'Simplify the radicals in the numerator.'], 'conjugate');
      } },
      { id: 'x16b', level: 'MAS', make: function (r) {
        var z = gen(function () { return { a: r.int(2, 4), b: r.pick([2, 3, 5, 6, 7]), c: r.int(1, 6), s: r.pick([1, -1]) }; }, function (z) { var D = z.a * z.a * z.b - z.c * z.c; return D !== 0 && Math.abs(D) <= 12 && !(z.a === 3 && z.b === 2 && z.c === 4); });
        var num = S(z.a, 2, z.b, -z.s * z.c, 1, 1), den = S(z.a, 2, z.b, z.s * z.c, 1, 1), D = z.a * z.a * z.b - z.c * z.c, top = smul(num, conj(den)), key = stex(sdivq(top, D));
        var shown = '\\dfrac{' + stex(num) + '}{' + stex(den) + '}';
        return radP(t(shown), key, { cands: [[stex(sdivq(Q(z.a * z.a * z.b + z.c * z.c), D)), 'u2l7-middle-term', 'The numerator ' + t('(' + stex(num) + ')^{2}') + ' has a middle term.']] },
          t(shown + '=\\dfrac{(' + stex(num) + ')^{2}}{' + z.a * z.a * z.b + '-' + z.c * z.c + '}=\\dfrac{' + stex(top) + '}{' + D + '}=' + key), ['Multiply by the conjugate of the denominator; the numerator becomes a perfect square.'], 'conjugate: binomial over binomial');
      } }] },
    { num: '17', stem: function (s) { return 'A rectangle has an area of ' + t(s.A + '\\text{ cm}^{2}') + ' and a width of ' + t('(' + stex(s.W) + ')\\text{ cm}') + '.' + rectFig('length ?', [[1, s.p], [-s.c, 1]], 'cm', s.A + ' cm²'); },
      shared: function (r) {
        var s = gen(function () { var p = r.pick([2, 3, 5, 6, 7, 10, 11, 13]), c = r.int(1, 3), k = r.int(2, 5); return { p: p, c: c, k: k, d: p - c * c, A: k * (p - c * c) }; }, function (s) { return s.d > 0 && s.A <= 50 && !(s.p === 5 && s.c === 1 && s.k === 2) && !isSqN(s.A); });
        s.W = S(1, 2, s.p, -s.c, 1, 1); s.Lg = sdivq(smul(Q(s.A), conj(s.W)), s.d); s.P = sscale(sadd(s.Lg, s.W), 2);
        return s;
      }, parts: [
      { id: 'x17a', level: 'ADV', make: function (r, s) {
        var key = stex(s.Lg);
        return radP('Determine the length of the rectangle in simplest form.', key, { after: 'cm', cands: [[stex(sdivq(smul(Q(s.A), s.W), s.d)), 'u2l7-conj-sign', 'Multiply by the <b>conjugate</b> ' + t(stex(conj(s.W))) + '.']] },
          t('\\ell=\\dfrac{' + s.A + '}{' + stex(s.W) + '}\\cdot\\dfrac{' + stex(conj(s.W)) + '}{' + stex(conj(s.W)) + '}=\\dfrac{' + s.A + '(' + stex(conj(s.W)) + ')}{' + s.d + '}=' + key) + ' cm.', [t('\\ell=\\dfrac{A}{w}') + '.'], 'length from the area');
      } },
      { id: 'x17b', level: 'ADV', make: function (r, s) {
        var key = stex(s.P);
        return radP('Determine the exact perimeter of the rectangle.', key, { after: 'cm', cands: [[stex(sadd(s.Lg, s.W)), 'u2l7-half-perim', t('P=2(\\ell+w)') + '.']] },
          t('\\ell=' + stex(s.Lg)) + '. ' + t('P=2\\left[(' + stex(s.Lg) + ')+(' + stex(s.W) + ')\\right]=' + key) + ' cm.', ['Find the length first.'], 'perimeter');
      } },
      { id: 'x17c', level: 'MAS', make: function (r, s) {
        var side = S(1, 2, s.A), Psq = sscale(side, 4), diff = sadd(s.P, sneg(Psq)), key = stex(diff);
        return radP('A square has the same area as the rectangle. How much greater is the perimeter of the rectangle than the perimeter of the square? Give an exact answer.', key, { after: 'cm', cands: [[stex(sadd(s.P, sneg(side))), 'u2l7-perim-hyp', 'The square has four sides: its perimeter is ' + t('4' + sq(s.A)) + '.'], [stex(sadd(Psq, sneg(s.P))), 'sign', 'Rectangle minus square.']] },
          'Square side ' + t('=' + sq(s.A) + '=' + stex(side)) + ', so its perimeter is ' + t(stex(Psq)) + ' cm. Difference: ' + t('(' + stex(s.P) + ')-' + (stex(Psq).indexOf('+') > 0 || stex(Psq).indexOf('-') > 0 ? '(' + stex(Psq) + ')' : stex(Psq)) + '=' + key) + ' cm.', ['Find the side of the square: ' + t('s=\\sqrt{A}') + '.', 'Subtract the perimeters.'], 'comparing perimeters');
      } }] },
    { num: '18', parts: [
      { id: 'x18a', level: 'ADV', make: function (r) {
        var z = gen(function () { var e = r.pick([[4, 1, 15], [5, 2, 6], [7, 4, 3], [8, 3, 7], [9, 4, 5], [10, 3, 11], [2, 1, 3], [6, 1, 35]]); return { a: e[0], c: e[1], d: e[2] }; }, function (z) { return true; });
        var m = cf(z.c) + sq(z.d), shown = '\\dfrac{1}{' + z.a + '+' + m + '}+\\dfrac{1}{' + z.a + '-' + m + '}';
        return P.number('Show that ' + t(shown) + ' is a rational number: find its value.', 2 * z.a, function (v) { return v === z.a ? { code: 'u2l7-like', hint: 'Add both fractions: the common denominator is ' + t('(' + z.a + '+' + m + ')(' + z.a + '-' + m + ')=1') + '.' } : null; },
          'Common denominator ' + t('(' + z.a + '+' + m + ')(' + z.a + '-' + m + ')=' + z.a * z.a + '-' + z.c * z.c * z.d + '=1') + '.<br>Sum ' + t('=\\dfrac{(' + z.a + '-' + m + ')+(' + z.a + '+' + m + ')}{1}=' + 2 * z.a) + ', which is rational.', ['Use the common denominator (a conjugate product).'], 'sum of conjugate reciprocals');
      } },
      { id: 'x18b', level: 'PRG', make: function (r) {
        var n = r.pick([2, 3, 5, 6, 7, 10]);
        var ck = function (resp) {
          var p = HW.parse.number(resp); if (!p.ok) return form('notnumber', 'Type a whole number.');
          var k = p.value; if (!(k > 0) || !Number.isInteger(k)) return wrong('value', 'Choose a positive whole number.');
          if (isSqN(k)) return wrong('u2l7-k-square', t('\\sqrt{' + k + '}') + ' is rational, so it doesn’t show a product of two <b>irrational</b> numbers.');
          if (!isSqN(n * k)) return wrong('u2l7-not-rational', t('\\sqrt{' + n + '}\\cdot\\sqrt{' + k + '}=\\sqrt{' + n * k + '}') + ' is irrational.');
          return ok();
        };
        var k0 = 4 * n;
        return { prompt: 'A student says, “The product of two irrational numbers is always irrational.” Show the student is wrong: give a whole number ' + t('k') + ' (with ' + t('\\sqrt{k}') + ' irrational) so that ' + t('\\sqrt{' + n + '}\\cdot\\sqrt{k}') + ' is rational.', input: { type: 'number', before: t('k=') }, check: ck, key: String(k0), answer: t('k=' + k0) + ' (answers vary)',
          solution: 'Answers vary: ' + t('\\sqrt{' + n + '}\\cdot\\sqrt{' + k0 + '}=\\sqrt{' + n * k0 + '}=' + 2 * n) + ', which is rational.', hints: ['Make ' + t(n + 'k') + ' a perfect square.'], text: 'counterexample', good: [String(n), String(9 * n)], bad: [String(n * n), '2'] };
      } },
      { id: 'x18c', level: 'EMG', make: function (r) {
        var z = gen(function () { return { a: r.pick([1, 3, 5, 7, 11]), s: r.int(2, 3), tt: r.pick([2, 3, 5]) }; }, function (z) { var b = z.s * z.s * z.tt; return ex.gcd(z.a, b) === 1 && z.a !== z.tt; });
        var b = z.s * z.s * z.tt;
        return P.mc(r, 'Which simplest-form rule does ' + t('\\sqrt{\\dfrac{' + z.a + '}{' + b + '}}') + ' break?', [{ html: 'There is a fraction under the radical.', right: true }, { html: 'There is a radical in the denominator.', why: 'Not yet — there is no denominator outside the radical.' }, { html: 'Like radicals have not been combined.', why: 'There is only one radical.' }, { html: 'The index is odd.', why: 'It is a square root (index 2), and an odd index is allowed anyway.' }],
          'It has a fraction under the radical. Writing it as ' + t('\\dfrac{' + sq(z.a) + '}{' + sq(b) + '}') + ' would then put a radical in the denominator, so rationalize that next.', ['Read the simplest form checklist.'], 'MC: simplest-form rule');
      } },
      { id: 'x18d', level: 'ADV', make: function (r) {
        var z = gen(function () { return { a: r.pick([1, 3, 5, 7, 11]), s: r.int(2, 3), tt: r.pick([2, 3, 5, 6]) }; }, function (z) { var b = z.s * z.s * z.tt; return ex.gcd(z.a, b) === 1 && ex.simplest(z.a * z.tt, 2) && !(z.a === 7 && b === 18) && !(z.a === 3 && b === 20) && !(z.a === 5 && b === 8); });
        var b = z.s * z.s * z.tt, key = stex(S([1, z.s * z.tt], 2, z.a * z.tt));
        return radP('Simplify ' + t('\\sqrt{\\dfrac{' + z.a + '}{' + b + '}}') + '.', key, { cands: [['\\frac{' + sq(z.a * z.tt) + '}{' + z.tt + '}', 'u2l7-den-simplify', t(sq(b) + '=' + z.s + sq(z.tt)) + ' — keep the ' + t(z.s) + '.']] },
          t('\\sqrt{\\dfrac{' + z.a + '}{' + b + '}}=\\dfrac{' + sq(z.a) + '}{' + sq(b) + '}=\\dfrac{' + sq(z.a) + '}{' + z.s + sq(z.tt) + '}\\cdot\\dfrac{' + sq(z.tt) + '}{' + sq(z.tt) + '}=' + key), ['Write it as a radical over a radical, simplify, then rationalize.'], 'fraction under a radical');
      } }] }
  ];

  /* every part is outcome AN2 */
  QUESTIONS.concat(EXTRA).forEach(function (q) { q.parts.forEach(function (p) { p.outcome = 'AN2'; }); });
  HW.defineLesson({ id: LID, unit: 2, num: '7', title: 'Unit 2 Review', outcome: 'AN2', calc: false,
    blurb: 'Every Unit 2 skill mixed together, written like the unit test: mixed and entire radicals, ordering, restrictions, variable radicals, adding, multiplying and dividing radicals, rationalizing monomial and binomial denominators, and rational versus irrational numbers. No calculator.',
    questions: QUESTIONS, extra: EXTRA });
})(window);
