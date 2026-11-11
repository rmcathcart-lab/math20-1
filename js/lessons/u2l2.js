/* Math 20-1 · Unit 2 · Lesson 2 — Radicals with Variables and Their Restrictions (outcome AN2 on every part)
 * Assignment 2 (u2_l02.tex, Questions 1–16) and the Lesson 2 Extra Practice (u2_ep02.tex, A1–A3, B1–B6, C1–C4).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet's own numbers are left out where that is easy). No calculator (Unit 2).
 * Needs the radical kit HW.p21rad from u2l1.js (loads first). Variables are the keypad letters x, y, a, b (the booklet's
 * m and n become a or b); variables under an even index are taken as ≥ 0, as the booklet says.
 *
 * Answers: restrictions in a set box (x ≥ −5, −5 ≤ x, x ∈ ℝ, {x | x ≥ −5, x ∈ ℝ}, [−5, ∞) are all accepted);
 * variable radicals compared by value at several positive values plus the simplest-form checks (no perfect power left
 * under the root, every exponent under the root below the index).
 * Conversions: "state the restrictions where needed" (Q6) → the simplest forms, then a table: which radicals need the
 * variables ≥ 0; "evaluate where possible" → one box per value with a "none" key; "explain" → multiple choice of
 * reasons; "explain the error and correct it" → multiple choice, then the corrected answer; "treat x − 1 as a single
 * base" (C2) → typed with brackets, checked by value for x > 1 and by what is left under the root.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Extra C1 (two radicals), C2 (a binomial base), C3 (√((x−h)²) = x − h). */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var RK = HW.p21rad, LID = 'u2l2';
  var rt = RK.rt, pw = RK.pw, POW = RK.POW, ROOT = RK.ROOT, vtex = RK.vtex, vout = RK.vout, vp = RK.vp, addV = RK.addV, obj = RK.obj, letters = RK.letters, pickWhere = RK.pickWhere, isPow = RK.isPow;
  var varMixed = RK.varMixed, varEntire = RK.varEntire, radFields = RK.radFields;

  HW.addCodes({
    'u2l2-flip': 'Didn’t reverse the inequality when dividing by a negative', 'u2l2-bound-sign': 'Wrong sign on the boundary', 'u2l2-odd': 'Gave a restriction for an odd index',
    'u2l2-even-all': 'Said “all real numbers” for an even index', 'u2l2-strict': 'Allowed the radicand to be 0 in a denominator', 'u2l2-not-strict': 'Excluded the endpoint when it is allowed',
    'u2l2-none': 'Said a value can’t be used when it can', 'u2l2-not-allowed': 'Evaluated at a value outside the restriction', 'u2l2-abs': 'Said √(x²) = x for a negative x',
    'u2l2-restr-table': 'Restriction table wrong', 'u2l2-perimeter': 'Perimeter not 4 × side', 'u2l2-hyp-add': 'Added the legs instead of their squares',
    'u2l2-nr-sum': 'Added the wrong numbers', 'u2l2-largest': 'Largest integer: rounded up past the bound', 'u2l2-bound': 'Gave the bound, not the largest integer',
    'u2l2-one-only': 'Used only one of the two restrictions', 'u2l2-binom': 'Binomial base not simplified', 'u2l2-check': 'Side length from the formula wrong'
  });
  HW.addPartial({ 'u2l2-flip': 'b', 'u2l2-bound-sign': 'b', 'u2l2-odd': 'n', 'u2l2-even-all': 'n', 'u2l2-strict': 's', 'u2l2-not-strict': 's', 'u2l2-none': 'n', 'u2l2-not-allowed': 'n',
    'u2l2-abs': 'b', 'u2l2-restr-table': 'n', 'u2l2-perimeter': 'b', 'u2l2-hyp-add': 'n', 'u2l2-nr-sum': 'b', 'u2l2-largest': 's', 'u2l2-bound': 's', 'u2l2-one-only': 'b', 'u2l2-binom': 'b', 'u2l2-check': 'n' });

  /* ---------- restrictions ---------- */
  function rTex(q) { return ex.texRat(q); }
  /* LaTeX of a·x + b (a, b rational [p,q]; constant first when a < 0 < b, as in the booklet) */
  function linTex(a, b, v) {
    v = v || 'x'; a = ex.norm(a[0], a[1]); b = ex.norm(b[0], b[1]);
    var aT = a[1] === 1 ? (Math.abs(a[0]) === 1 ? '' : String(Math.abs(a[0]))) : '\\frac{' + Math.abs(a[0]) + '}{' + a[1] + '}', term = aT + v;
    if (b[0] === 0) return (a[0] < 0 ? '-' : '') + term;
    if (a[0] < 0 && b[0] > 0) return rTex(b) + '-' + term;
    return (a[0] < 0 ? '-' : '') + term + (b[0] < 0 ? '-' + rTex([-b[0], b[1]]) : '+' + rTex(b));
  }
  /* the restriction for ⁿ√(a x + b) (strict when the radical is in a denominator) */
  function linRestr(a, b, n, strict, v) {
    v = v || 'x'; a = ex.norm(a[0], a[1]); b = ex.norm(b[0], b[1]);
    if (n % 2) return { tex: v + '\\in\\mathbb{R}', all: true };
    var bd = ex.norm(-b[0] * a[1], b[1] * a[0]), up = a[0] > 0, op = up ? (strict ? '>' : '\\ge ') : (strict ? '<' : '\\le ');
    return { tex: v + op + rTex(bd), bd: bd, up: up, op: op, strict: strict };
  }
  function restrSol(a, b, n, strict, v, R) {
    v = v || 'x'; var rad = linTex(a, b, v);
    if (n % 2) return 'The index ' + t(n) + ' is <b>odd</b>, so any radicand is allowed: ' + t(v + '\\in\\mathbb{R}') + ' (no restriction).';
    a = ex.norm(a[0], a[1]); b = ex.norm(b[0], b[1]);
    var rel = strict ? '>' : '\\ge ', s = (strict ? 'The radical is in a denominator, so it can’t be ' + t('0') + ': the radicand must be <b>positive</b>.<br>' : 'Even index: the radicand must be ' + t('\\ge 0') + '.<br>') + t(rad + rel + '0');
    var ax = linTex(a, [0, 1], v), mb = ex.norm(-b[0], b[1]);
    if (b[0] !== 0) s += '\\(\\Rightarrow\\)' + t(ax + rel + rTex(mb));
    if (!(a[0] === 1 && a[1] === 1)) s += '\\(\\Rightarrow\\)' + t(R.tex) + (a[0] < 0 ? ' (dividing by a negative number reverses the inequality sign)' : '') + '.';
    else s += '.';
    return s;
  }
  function restrWrongs(R, n, strict, v) {
    v = v || 'x';
    if (R.all) return [{ is: v + '\\ge 0', code: 'u2l2-odd', hint: 'The index is <b>odd</b>: an odd root of a negative number is fine (e.g. ' + t('\\sqrt[3]{-8}=-2') + '), so there is no restriction.' },
      { is: v + '\\le 0', code: 'u2l2-odd', hint: 'The index is <b>odd</b>, so any radicand is allowed.' }];
    var bd = R.bd, nb = [-bd[0], bd[1]], w = [];
    var flipOp = R.up ? (strict ? '<' : '\\le ') : (strict ? '>' : '\\ge ');
    w.push({ is: v + flipOp + rTex(bd), code: 'u2l2-flip', hint: R.up ? 'Check the direction: try a value. The radicand must be ' + t('\\ge 0') + ' — which side of ' + t(rTex(bd)) + ' makes it non-negative?' : 'You divided both sides by a <b>negative</b> number, so the inequality sign must reverse.' });
    if (bd[0] !== 0) { w.push({ is: v + R.op + rTex(nb), code: 'u2l2-bound-sign', hint: 'Check the sign of the boundary: solve the inequality step by step (move the constant to the other side first).' });
      w.push({ is: v + flipOp + rTex(nb), code: 'u2l2-bound-sign', hint: 'Solve the inequality step by step: radicand ' + t(strict ? '>0' : '\\ge 0') + ', move the constant, then divide (reversing the sign for a negative).' }); }
    w.push({ is: v + '\\in\\mathbb{R}', code: 'u2l2-even-all', hint: 'The index is <b>even</b>, so the radicand can’t be negative. Some values of ' + t(v) + ' make it negative.' });
    var other = R.up ? (strict ? '\\ge ' : '>') : (strict ? '\\le ' : '<');
    w.push({ is: v + other + rTex(bd), code: strict ? 'u2l2-strict' : 'u2l2-not-strict', hint: strict ? 'The radical is in the denominator, so it can’t be ' + t('0') + ': the boundary value is <b>not</b> allowed (use ' + t(R.up ? '>' : '<') + ').' : 'The radicand may equal ' + t('0') + ' (' + t('\\sqrt{0}=0') + '), so the boundary value <b>is</b> allowed.' });
    return w;
  }
  function setPart(prompt, target, wrongs, sol, hints, text, v) {
    var p = K.P.set(prompt, target, { v: v || 'x', wrong: wrongs, tag: false }, sol, hints, text);
    p.bad = wrongs.map(function (w) { return w.is; });
    return p;
  }
  /* ⁿ√(a x + b) → its restriction */
  function restrPart(a, b, n, o) {
    o = o || {}; a = Array.isArray(a) ? a : [a, 1]; b = Array.isArray(b) ? b : [b, 1];
    var v = o.v || 'x', R = linRestr(a, b, n, !!o.strict, v), rad = rt(n, linTex(a, b, v)), shown = o.show || rad;
    return setPart(o.prompt || t(shown), R.tex, restrWrongs(R, n, !!o.strict, v), o.sol || restrSol(a, b, n, !!o.strict, v, R),
      [n % 2 ? 'Is the index even or odd?' : 'Even index: set the radicand ' + t(o.strict ? '>0' : '\\ge 0') + ' and solve for ' + t(v) + '.', 'Dividing or multiplying both sides of an inequality by a negative number reverses the sign. Write your answer like ' + t(v + '\\ge 3') + ', or ' + t(v + '\\in\\mathbb{R}') + ' for no restriction.'],
      o.text || 'restriction ' + shown, v);
  }

  /* ---------- evaluate √(a x + b) at several values (one may be outside the restriction) ---------- */
  function isNone(s) { s = String(s == null ? '' : s).replace(/\\text\{([^}]*)\}/g, '$1').trim(); return /^(none|not real|not a real number|not possible|dne|undefined)$/i.test(s); }
  function evalSetup(r, aPool, cPool, excl) {
    for (var i = 0; i < 400; i++) {
      var a = r.pick(aPool), c = r.pick(cPool), b = a * c, bound = -c; // radicand a(x + c) ≥ 0 ⇔ x ≥ −c
      if (excl && excl.some(function (e) { return e[0] === a && e[1] === b; })) continue;
      var sq = [], simp = [], plain = [];
      for (var x = bound; x <= bound + 30; x++) {
        var R = a * x + b; if (R <= 1) continue;
        var f = ex.nthFactor(R, 2), m = R / (f * f);
        if (m === 1) sq.push(x); else if (f > 1) simp.push(x); else plain.push(x);
      }
      if (!sq.length || simp.length < 2) continue;
      var xs = [r.pick(sq)].concat(r.sample(simp, 2));
      if (xs[1] === xs[2]) continue;
      var bad = bound - r.int(1, 3);
      return { a: a, b: b, bound: bound, xs: r.shuffle(xs.concat([bad])), bad: bad };
    }
    return { a: 2, b: 10, bound: -5, xs: [-3, 7, 20, -6], bad: -6 };
  }
  function evalFields(E) {
    var rad = linTex([E.a, 1], [E.b, 1]), par = function (x) { return '(' + x + ')'; };
    var boxes = E.xs.map(function (x) {
      var R = E.a * x + E.b, valid = x >= E.bound, f = valid ? ex.nthFactor(R, 2) : 1, m = valid ? R / (f * f) : 1, spec = { k: [f, 1], n: 2, m: m };
      var base = valid ? K.radical(spec, 'mixed') : null;
      var check = function (resp) {
        var s = String(resp == null ? '' : resp).trim();
        if (!s) return form('empty', 'Fill in every box (press <b>none</b> if the value can’t be used).');
        if (isNone(s)) return valid ? wrong('u2l2-none', t('x=' + x) + ' satisfies the restriction ' + t('x\\ge ' + E.bound) + ': the radicand is ' + t(E.a + par(x) + (E.b < 0 ? '' : '+') + E.b + '=' + R) + ', which is not negative.') : ok();
        if (!valid) return wrong('u2l2-not-allowed', t('x=' + x) + ' is less than ' + t(E.bound) + ': the radicand would be ' + t(R) + ', and ' + t('\\sqrt{' + R + '}') + ' is not a real number. Press <b>none</b>.');
        return base(s);
      };
      return { name: 'x = ' + x, label: t('x=' + x + ':'), check: check, key: valid ? K.radTex(spec) : 'none', valid: valid, R: R, f: f, m: m, x: x };
    });
    var p = P.fields('Evaluate exactly, in simplest form, where possible. Press <b>none</b> for a value that can’t be used.', boxes.map(function (b) { return { name: b.name, label: b.label, mode: 'math', keys: 'radical', none: true }; }),
      boxes.map(function (b) { return b.check; }), boxes.map(function (b) { return b.key; }), boxes.map(function (b) { return t('x=' + b.x) + ': ' + (b.valid ? t(b.key) : 'not possible'); }).join('<br>'),
      boxes.map(function (b) { var sub = t('\\sqrt{' + E.a + par(b.x) + (E.b < 0 ? '' : '+') + E.b + '}=\\sqrt{' + b.R + '}'); return t('x=' + b.x) + ': ' + (b.valid ? sub.replace(/\\\)$/, (b.m === 1 ? '=' + b.f : b.f > 1 ? '=\\sqrt{' + b.f * b.f + '\\times ' + b.m + '}=' + b.f + '\\sqrt{' + b.m + '}' : '') + '\\)') : 'not possible — ' + t(b.x + '<' + E.bound) + ', so the radicand ' + t(b.R) + ' is negative.'); }).join('<br>'),
      ['Check each value against the restriction ' + t('x\\ge ' + E.bound) + ' first.', 'Substitute, then simplify the radical: take out the largest perfect square.'], 'evaluate sqrt(' + rad + ') at ' + E.xs.join(', '));
    p.bad = [boxes.map(function (b) { return b.valid ? 'none' : b.key; }), boxes.map(function (b) { return b.valid ? '\\sqrt{' + b.R + '}' : 'none'; }).filter(function () { return true; })];
    if (!boxes.some(function (b) { return b.valid && b.f > 1 && b.m > 1; })) p.bad.pop();
    return p;
  }

  /* ---------- side / edge / hypotenuse with variables ---------- */
  function squareVar(r, s, tt, vs, e, intro, text) { // area s²·tt·∏v^(2e)
    var c = s * s * tt, iV = obj(vs, e.map(function (x) { return 2 * x; })), oV = obj(vs, e), A = vtex([c, 1], iV);
    var sideT = vout([s, 1], oV) + (tt > 1 ? '\\sqrt{' + tt + '}' : ''), perT = vout([4 * s, 1], oV) + (tt > 1 ? '\\sqrt{' + tt + '}' : '');
    var perChk = K.varRadical(perT, 'mixed', { diag: function (rr) { if (rr && rr.n === 2 && rr.rad.m === tt && (rr.k[0] === s || rr.k[0] === 2 * s) && rr.k[1] === 1) return { code: 'u2l2-perimeter', hint: 'A square has <b>four</b> equal sides: ' + t('P=4s') + '.' }; return null; } });
    return radFields(intro + 'A square has an area of ' + t(A) + ' square units (' + t(vs.join(', ') + '>0') + '). Determine its side length and perimeter in simplest form.', [
      { name: 'Side', label: t('s='), check: K.varRadical(sideT, 'mixed'), key: sideT, keys: 'var' }, { name: 'Perimeter', label: t('P='), check: perChk, key: perT, keys: 'var' }],
      t('s=\\sqrt{' + A + '}=\\sqrt{' + s * s + '\\cdot ' + tt + '\\cdot ' + vtex([1, 1], iV) + '}=' + sideT) + ' (halve each exponent).<br>' + t('P=4\\times ' + sideT + '=' + perT) + '.',
      ['The side is ' + t('\\sqrt{A}') + ': take the largest perfect square out of the number and halve each exponent.', 'The perimeter is ' + t('4s') + '.'], text || 'square side/perimeter ' + A);
  }

  /* ---------- the restriction table for Question 6 ---------- */
  function q6Specs(r) {
    var L = function () { return letters(r, 2); };
    var specs = [], l;
    var c, s, tt;
    // (a) √(c x²)
    l = L(); c = pickWhere(function () { return r.pick([4, 9]) * r.pick([2, 3, 5, 6, 7]); }, function (v) { return v !== 20 && v !== 45; }, 28); specs.push({ oK: 1, n: 2, iK: c, iV: obj([l[0]], [2]) });
    // (b) √(c a³)
    l = L(); c = pickWhere(function () { return r.pick([4, 9, 25]) * r.pick([2, 3, 5]); }, function (v) { return v !== 27 && v !== 18; }, 12); specs.push({ oK: 1, n: 2, iK: c, iV: obj([l[0]], [3]) });
    // (c) √(c m⁵ n²)
    l = L(); c = pickWhere(function () { return r.pick([25, 36, 49]) * r.pick([2, 3, 5]); }, function (v) { return v !== 98; }, 75); specs.push({ oK: 1, n: 2, iK: c, iV: obj(l, [r.pick([3, 5]), 2]) });
    // (d) √(c x⁷ y⁴)
    l = L(); c = pickWhere(function () { return r.pick([16, 25]) * r.pick([3, 5, 6, 7]); }, function (v) { return v !== 150; }, 80); specs.push({ oK: 1, n: 2, iK: c, iV: obj(l, [r.pick([5, 7]), 4]) });
    // (e) ∛(c a⁵)
    l = L(); c = 8 * r.pick([3, 5, 6, 7]); specs.push({ oK: 1, n: 3, iK: c, iV: obj([l[0]], [r.pick([4, 5])]) });
    // (f) ∛(−c x⁶ y⁸)
    l = L(); c = r.pick([27, 125]) * r.pick([2, 4]); if (c === 250) c = 108; specs.push({ oK: 1, n: 3, iK: -c, iV: obj(l, [6, r.pick([7, 8])]) });
    // (g) ∛(c m¹⁰)
    l = L(); c = 27 * r.pick([2, 4, 5]); specs.push({ oK: 1, n: 3, iK: c, iV: obj([l[0]], [r.pick([7, 10, 11])]) });
    // (h) ⁴√(c x⁵)
    l = L(); c = pickWhere(function () { return r.pick([16, 81]) * r.pick([2, 3, 5]); }, function (v) { return v !== 162 && v !== 48; }, 80); specs.push({ oK: 1, n: 4, iK: c, iV: obj([l[0]], [r.pick([5, 6])]) });
    // (i) −√(c a⁹ b)
    l = L(); c = pickWhere(function () { return r.pick([4, 9]) * r.pick([5, 6, 7]); }, function (v) { return v !== 63; }, 20); specs.push({ oK: -1, n: 2, iK: c, iV: obj(l, [r.pick([7, 9]), 1]) });
    return specs;
  }
  function specTex(sp) { return vout([sp.oK, 1], {}) + rt(sp.n, vtex([sp.iK, 1], sp.iV)); }

  /* ================================ Assignment ================================ */
  var QUESTIONS = [
    { num: '1', section: 'Restrictions on the variable', stem: 'State the restriction on the variable.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return restrPart(1, r.pick([2, 3, 4, 7, 9, 11]), 2); } },
      { id: '1b', level: 'BEG', make: function (r) { return restrPart(1, -r.pick([2, 3, 5, 7, 9, 10]), 2); } },
      { id: '1c', level: 'EMG', make: function (r) { var a = r.pick([2, 3, 4, 5]), k = r.pick([2, 3, 5, 6]); if (a === 3 && k === 4) k = 5; return restrPart(a, -a * k, 2); } },
      { id: '1d', level: 'PRG', make: function (r) { var a = r.pick([2, 4, 5, 6, 7]), k = r.pick([1, 3, 4, 5]); if (a === 5 && k === 2) k = 3; return restrPart(-a, a * k, 2); } },
      { id: '1e', level: 'EMG', make: function (r) { return restrPart(-r.pick([2, 3, 5, 6, 7]), 0, 2); } },
      { id: '1f', level: 'BEG', make: function (r) { return restrPart(r.pick([3, 4, 5]), r.pick([1, 7, -5, 8]), 3); } },
      { id: '1g', level: 'EMG', make: function (r) { return restrPart(1, -r.pick([2, 3, 4, 6]), r.pick([4, 6])); } },
      { id: '1h', level: 'EMG', make: function (r) { return restrPart(-1, r.pick([3, 5, 8, 10]), 5); } },
      { id: '1i', level: 'PRG', make: function (r) { var q = r.pick([2, 3, 4]), c = r.pick([1, 2, 4, 5]); if (q === 2 && c === 3) c = 4; return restrPart([1, q], c, 2); } }] },
    { num: '2', stem: 'For what values of ' + t('x') + ' is each expression defined?', parts: [
      { id: '2a', level: 'EMG', make: function (r) { var c = r.pick([1, 3, 5, 7, 16, 25]), v = r.chance(0.5);
        var shown = v ? '\\sqrt{x^{2}+' + c + '}' : '\\sqrt{' + c + '+x^{2}}';
        return setPart(t(shown), 'x\\in\\mathbb{R}', [{ is: 'x\\ge -' + c, code: 'u2l2-even-all', hint: t('x^{2}\\ge 0') + ' for every ' + t('x') + ', so ' + t('x^{2}+' + c + '\\ge ' + c + '>0') + ' — always positive.' }, { is: 'x\\ge 0', code: 'u2l2-even-all', hint: 'Try a negative value, e.g. ' + t('x=-2') + ': ' + t('(-2)^{2}+' + c + '=' + (4 + c)) + ' — still positive.' }],
          t('x^{2}\\ge 0') + ' for every ' + t('x') + ', so ' + t('x^{2}+' + c + '\\ge ' + c + '>0') + ': the radicand is never negative. ' + t('x\\in\\mathbb{R}') + '.', ['Can ' + t('x^{2}+' + c) + ' ever be negative?'], 'defined: ' + shown); } },
      { id: '2b', level: 'PRG', make: function (r) { var e = r.pick([3, 5]), neg = r.chance(0.7), shown = '\\sqrt{' + (neg ? '-' : '') + 'x^{' + e + '}}', tgt = neg ? 'x\\le 0' : 'x\\ge 0';
        return setPart(t(shown), tgt, [{ is: neg ? 'x\\ge 0' : 'x\\le 0', code: 'u2l2-flip', hint: 'Try a value: when ' + t('x') + ' is ' + (neg ? 'positive' : 'negative') + ', ' + t((neg ? '-' : '') + 'x^{' + e + '}') + ' is negative.' }, { is: 'x\\in\\mathbb{R}', code: 'u2l2-even-all', hint: 'An odd power keeps the sign of ' + t('x') + ', so the radicand can be negative.' }],
          (neg ? t('-x^{' + e + '}\\ge 0') + ' when ' + t('x^{' + e + '}\\le 0') + ', which happens when ' + t('x\\le 0') : t('x^{' + e + '}') + ' has the same sign as ' + t('x') + ', so ' + t('x^{' + e + '}\\ge 0') + ' when ' + t('x\\ge 0')) + ' (an odd power keeps the sign). ' + t(tgt) + '.', ['An odd power of a negative number is negative.'], 'defined: ' + shown); } },
      { id: '2c', level: 'PRG', make: function (r) { var k = r.pick([3, 5, 7, 9, 10]), a = r.pick([2, 3, 4, 5, -3, -4, -5]); if (a === 1) a = 2;
        var rad = 'x' + (a > 0 ? '-' + a : '+' + (-a));
        return restrPart(1, -a, 2, { strict: true, show: '\\dfrac{' + k + '}{\\sqrt{' + rad + '}}', text: 'defined: ' + k + '/sqrt(' + rad + ')' }); } },
      { id: '2d', level: 'EMG', make: function (r) { var c = r.pick([2, 3, 6, 7, 10]), n = r.pick([3, 5]), shown = rt(n, 'x^{2}-' + c);
        return setPart(t(shown), 'x\\in\\mathbb{R}', [{ is: 'x\\ge ' + c, code: 'u2l2-odd', hint: 'The index is <b>odd</b>: a negative radicand is fine.' }, { is: 'x\\ge 0', code: 'u2l2-odd', hint: 'The index is <b>odd</b>, so there is no restriction.' }],
          'The index ' + t(n) + ' is odd, so any radicand is allowed (even a negative one). ' + t('x\\in\\mathbb{R}') + '.', ['Is the index even or odd?'], 'defined: ' + shown); } }] },
    { num: '3', stem: function (sh) { return 'Consider ' + t('\\sqrt{' + linTex([sh.a, 1], [sh.b, 1]) + '}') + '.'; },
      shared: function (r) { return evalSetup(r, [2, 3, 4, 5], [1, 2, 3, 4, 6], [[2, 10], [4, 20]]); }, parts: [
      { id: '3a', level: 'BEG', make: function (r, sh) { var p = restrPart(sh.a, sh.b, 2); p.prompt = '(a) State the restriction on ' + t('x') + '.'; return p; } },
      { id: '3b', level: 'PRG', make: function (r, sh) { var p = evalFields(sh); p.prompt = '(b) ' + p.prompt; return p; } }] },
    { num: '4', stem: '', shared: function (r) { return { c: r.pick([3, 4, 7, 8, 9, 11, 12]) }; }, parts: [
      { id: '4a', level: 'LIM', make: function (r, sh) { var c = sh.c;
        return P.fields('(a) Evaluate ' + t('\\sqrt{x^{2}}') + ' for each value.', [{ name: 'x = ' + c, label: t('x=' + c + ':'), mode: 'number' }, { name: 'x = −' + c, label: t('x=-' + c + ':'), mode: 'number' }],
          [K.number(c), K.number(c, function (v) { return v === -c ? { code: 'u2l2-abs', hint: 'Work it out: ' + t('(-' + c + ')^{2}=' + c * c) + ', and ' + t('\\sqrt{' + c * c + '}') + ' is the <b>principal</b> (non-negative) root.' } : null; })],
          [String(c), String(c)], t('x=' + c) + ': ' + t(c) + '; ' + t('x=-' + c) + ': ' + t(c),
          t('x=' + c) + ': ' + t('\\sqrt{' + c + '^{2}}=\\sqrt{' + c * c + '}=' + c) + '.<br>' + t('x=-' + c) + ': ' + t('\\sqrt{(-' + c + ')^{2}}=\\sqrt{' + c * c + '}=' + c) + ' (not ' + t(-c) + ').', ['Square first, then take the square root.'], 'sqrt(x^2) at ±' + c); } },
      { id: '4b', level: 'EMG', make: function (r, sh) {
        return P.mc(r, '(b) Why do we write “' + t('\\sqrt{x^{2}}=x,\\ x\\ge 0') + '”?', [
          { html: t('\\sqrt{x^{2}}') + ' is never negative, so it equals ' + t('x') + ' only when ' + t('x\\ge 0') + '. The restriction makes the simplification true.', right: true },
          { html: 'Because ' + t('x^{2}') + ' is negative when ' + t('x<0') + '.', why: t('x^{2}') + ' is never negative: ' + t('(-' + sh.c + ')^{2}=' + sh.c * sh.c) + '.' },
          { html: 'Because ' + t('\\sqrt{x^{2}}') + ' is not defined when ' + t('x<0') + '.', why: 'It is defined: ' + t('\\sqrt{(-' + sh.c + ')^{2}}=\\sqrt{' + sh.c * sh.c + '}=' + sh.c) + '. The problem is that the answer isn’t ' + t('x') + '.' },
          { html: 'It doesn’t matter — ' + t('\\sqrt{x^{2}}=x') + ' for every real number.', why: 'Look at (a): for ' + t('x=-' + sh.c) + ' you got ' + t(sh.c) + ', not ' + t(-sh.c) + '.' }],
          'From (a), ' + t('\\sqrt{(-' + sh.c + ')^{2}}=' + sh.c + '\\ne -' + sh.c) + '. A square root is never negative, so ' + t('\\sqrt{x^{2}}=x') + ' is true only when ' + t('x\\ge 0') + '. (In general ' + t('\\sqrt{x^{2}}=|x|') + ', Unit 7.)', ['Look at your answer for the negative value in (a).'], 'why sqrt(x^2)=x needs x>=0');
      } }] },
    { num: '5', section: 'Simplifying powers under a radical', stem: 'Simplify. Assume variables under an even index are ' + t('\\ge 0') + '.', parts: [
      { id: '5a', level: 'BEG', make: function (r) { var v = r.pick(['x', 'a', 'y', 'b']); return varMixed(1, {}, 2, 1, obj([v], [r.pick([6, 12, 14, 16, 18])])); } },
      { id: '5b', level: 'BEG', make: function (r) { var v = r.pick(['x', 'a', 'y', 'b']); return varMixed(1, {}, 2, 1, obj([v], [r.pick([5, 9, 13, 15])])); } },
      { id: '5c', level: 'BEG', make: function (r) { var v = r.pick(['x', 'a', 'y', 'b']); return varMixed(1, {}, 3, 1, obj([v], [r.pick([6, 15, 18, 21])])); } },
      { id: '5d', level: 'EMG', make: function (r) { var v = r.pick(['x', 'a', 'y', 'b']); return varMixed(1, {}, 3, 1, obj([v], [r.pick([5, 7, 10, 13, 14])])); } },
      { id: '5e', level: 'EMG', make: function (r) { var v = r.pick(['x', 'a', 'y', 'b']); return varMixed(1, {}, 4, 1, obj([v], [r.pick([6, 7, 10, 11, 15])])); } },
      { id: '5f', level: 'EMG', make: function (r) { var l = letters(r, 2), e = r.pick([[5, 4], [3, 8], [7, 2], [5, 6]]); return varMixed(1, {}, 2, 1, obj(l, e)); } }] },
    { num: '6', stem: 'Write each radical in simplest form. (Variables under an even index are ' + t('\\ge 0') + '.)', shared: function (r) { return { specs: q6Specs(r) }; },
      parts: 'abcdefghi'.split('').map(function (L, i) {
        return { id: '6' + L, level: [1, 1, 0, 0, 1, 0, 0, 0, 0][i] ? 'EMG' : 'PRG', make: function (r, sh) { var sp = sh.specs[i]; return varMixed(sp.oK, {}, sp.n, sp.iK, sp.iV); } };
      }).concat([{ id: '6j', level: 'EMG', make: function (r, sh) {
        var rows = sh.specs.map(function (sp, i) { return { id: 'r' + i, html: '(' + 'abcdefghi'.charAt(i) + ') ' + t(specTex(sp)) }; }), want = {};
        sh.specs.forEach(function (sp, i) { want['r' + i] = sp.n % 2 ? 'none' : 'ge'; });
        return P.grid('(j) Which of the radicals in (a)–(i) need a restriction? (For each one: must the variables be ' + t('\\ge 0') + ', or is no restriction needed?)', rows, [{ id: 'ge', html: 'Variables ' + t('\\ge 0') }, { id: 'none', html: 'No restriction' }], want,
          { why: function (id) { var sp = sh.specs[Number(id.slice(1))]; return { code: 'u2l2-restr-table', hint: 'Look at the index of ' + t(specTex(sp)) + ': ' + (sp.n % 2 ? 'it is <b>odd</b>, so any value of the variables works — no restriction.' : 'it is <b>even</b>, so the variables must be ' + t('\\ge 0') + ' (the radicand must not be negative, and ' + t('\\sqrt{x^{2}}=x') + ' needs ' + t('x\\ge 0') + ').') }; } },
          'Even index ' + t('(\\sqrt{\\ },\\ \\sqrt[4]{\\ })') + ': state that the variables are ' + t('\\ge 0') + ' — ' + sh.specs.map(function (sp, i) { return sp.n % 2 ? null : '(' + 'abcdefghi'.charAt(i) + ')'; }).filter(Boolean).join(', ') + '.<br>Odd index ' + t('(\\sqrt[3]{\\ })') + ': no restriction — ' + sh.specs.map(function (sp, i) { return sp.n % 2 ? '(' + 'abcdefghi'.charAt(i) + ')' : null; }).filter(Boolean).join(', ') + '.',
          ['Even index: the variables must be non-negative. Odd index: no restriction.'], 'which radicals need restrictions');
      } }]) },
    { num: '7', stem: 'Each simplification has an error (variables are ' + t('\\ge 0') + ').', shared: function (r) {
        var c = r.pick([3, 4, 5, 7, 8, 9, 10]), e = r.pick([8, 12, 20, 24]); if (c === 6 && e === 16) e = 12;
        var bk = r.pick([[3, 'div', 9], [6, 'div', 72], [4, 'sq', 8], [9, 'sq', 27]]), be = r.pick([2, 3, 4, 5]), cc = r.pick([4, 16, 25, 36]);
        return { c: c, e: e, va: r.pick(['x', 'y']), b: { c: bk[0], kind: bk[1], wrongC: bk[2], e: be }, vb: r.pick(['a', 'b']), cc: cc };
      }, parts: [
      { id: '7a1', sub: 'a i', level: 'EMG', make: function (r, sh) { var c = sh.c, e = sh.e, v = sh.va;
        return P.mc(r, 'A student wrote ' + t('\\sqrt{' + c * c + v + '^{' + e + '}}=' + c + v + '^{' + e / 4 + '}') + '. What is the error?', [
          { html: 'The exponent was divided by ' + t('4') + ', not by the index ' + t('2') + '.', right: true },
          { html: t(c * c) + ' should come out as ' + t(c * c / 2 === Math.round(c * c / 2) ? c * c / 2 : c * c) + '.', why: t('\\sqrt{' + c * c + '}=' + c) + ' is right. Look at the exponent.' },
          { html: 'The exponent should be multiplied by ' + t('2') + '.', why: 'Coming <b>out</b> of a square root, the exponent is <b>divided</b> by 2.' },
          { html: 'There is no error.', why: 'Check by squaring: ' + t('(' + c + v + '^{' + e / 4 + '})^{2}=' + c * c + v + '^{' + e / 2 + '}') + ', not ' + t(c * c + v + '^{' + e + '}') + '.' }],
          'Divide the exponent by the index ' + t('2') + ': ' + t('\\sqrt{' + v + '^{' + e + '}}=' + v + '^{' + e / 2 + '}') + ' because ' + t('(' + v + '^{' + e / 2 + '})^{2}=' + v + '^{' + e + '}') + '. The student divided by ' + t('4') + '.', ['Check the answer by squaring it.'], 'error: divided exponent by 4'); } },
      { id: '7a2', sub: 'a ii', level: 'EMG', make: function (r, sh) { var p = varMixed(1, {}, 2, sh.c * sh.c, obj([sh.va], [sh.e])); p.prompt = 'Give the correct simplified form of ' + t('\\sqrt{' + sh.c * sh.c + sh.va + '^{' + sh.e + '}}') + '.'; p.bad.push(sh.c + sh.va + '^{' + sh.e / 4 + '}'); return p; } },
      { id: '7b1', sub: 'b i', level: 'PRG', make: function (r, sh) { var b = sh.b, C = b.c * b.c * b.c, v = sh.vb;
        return P.mc(r, 'A student wrote ' + t('\\sqrt[3]{' + C + v + '^{' + 3 * b.e + '}}=' + b.wrongC + v + '^{' + b.e + '}') + '. What is the error?', [
          b.kind === 'div' ? { html: t(C + '\\div 3=' + b.wrongC) + ' is not the cube root of ' + t(C) + '.', right: true } : { html: t('\\sqrt{' + C + '}=' + b.wrongC) + ' is the <b>square</b> root of ' + t(C) + ', not its cube root.', right: true },
          { html: 'The exponent should be ' + t(3 * b.e * 3) + '.', why: 'Coming out of a cube root, the exponent is <b>divided</b> by 3: ' + t(v + '^{' + b.e + '}') + ' is right.' },
          { html: 'The exponent should be ' + t(3 * b.e / 2 === Math.round(3 * b.e / 2) ? 3 * b.e / 2 : 3 * b.e - 1) + '.', why: 'The variable part is right: ' + t('(' + v + '^{' + b.e + '})^{3}=' + v + '^{' + 3 * b.e + '}') + '. Look at the number.' },
          { html: 'There is no error.', why: 'Check by cubing: ' + t(b.wrongC + '^{3}=' + b.wrongC * b.wrongC * b.wrongC) + ', not ' + t(C) + '.' }],
          t('\\sqrt[3]{' + C + '}=' + b.c) + ' because ' + t(b.c + '^{3}=' + C) + (b.kind === 'div' ? '; dividing by 3 is not taking a cube root.' : '; ' + t(b.wrongC) + ' is its square root.') + ' The variable part ' + t(v + '^{' + b.e + '}') + ' is right.', ['Check the number by cubing it.'], 'error: cube root of the number'); } },
      { id: '7b2', sub: 'b ii', level: 'PRG', make: function (r, sh) { var b = sh.b, C = b.c * b.c * b.c, p = varMixed(1, {}, 3, C, obj([sh.vb], [3 * b.e])); p.prompt = 'Give the correct simplified form of ' + t('\\sqrt[3]{' + C + sh.vb + '^{' + 3 * b.e + '}}') + '.'; p.bad.push(b.wrongC + sh.vb + '^{' + b.e + '}'); return p; } },
      { id: '7c', level: 'PRG', make: function (r, sh) { var cc = sh.cc, c = Math.round(Math.sqrt(cc)), xv = r.pick([3, 4, 5]).toString(); xv = Number(xv);
        return P.mc(r, 'A student wrote ' + t('\\sqrt{' + cc + '+x^{2}}=' + c + '+x') + '. What is the error, and what is the correct simplest form?', [
          { html: 'A root of a sum is not the sum of the roots. ' + t('\\sqrt{' + cc + '+x^{2}}') + ' is already in simplest form.', right: true },
          { html: 'It should be ' + t(c + 'x') + ' (the roots multiply).', why: 'There is no product under the root — it is a <b>sum</b>. Test ' + t('x=' + xv) + ': ' + t('\\sqrt{' + (cc + xv * xv) + '}') + ' vs ' + t(c * xv) + '.' },
          { html: 'It should be ' + t(c + '-x') + '.', why: 'Test ' + t('x=' + xv) + ': ' + t('\\sqrt{' + cc + '+' + xv * xv + '}=\\sqrt{' + (cc + xv * xv) + '}') + ', not ' + t(c - xv) + '.' },
          { html: 'There is no error.', why: 'Test ' + t('x=' + xv) + ': the left side is ' + t('\\sqrt{' + (cc + xv * xv) + '}') + ', the right side ' + t(c + xv) + '.' }],
          'Test ' + t('x=' + xv) + ': ' + t('\\sqrt{' + cc + '+' + xv * xv + '}=\\sqrt{' + (cc + xv * xv) + '}') + ' but ' + t(c + '+' + xv + '=' + (c + xv)) + ' — not equal. A root of a sum is not the sum of the roots; ' + t('\\sqrt{' + cc + '+x^{2}}') + ' has no factor to take out, so it is already in simplest form.', ['Test the claim with a value of ' + t('x') + '.'], 'error: root of a sum'); } }] },
    { num: '8', section: 'Mixed to entire with variables', stem: 'Write each mixed radical as an entire radical. Assume variables under an even index are ' + t('\\ge 0') + '.', parts: [
      { id: '8a', level: 'BEG', make: function (r) { var v = r.pick(['x', 'a', 'y', 'b']); return varEntire(r.pick([2, 3, 6, 7]), obj([v], [1]), 2, 1, obj([v], [1])); } },
      { id: '8b', level: 'EMG', make: function (r) { var v = r.pick(['a', 'x', 'b']), c = r.pick([3, 5, 2]), tt = r.pick([2, 5, 7]); if (c === 2 && tt === 3) tt = 5; return varEntire(c, obj([v], [2]), 2, tt, obj([v], [1])); } },
      { id: '8c', level: 'EMG', make: function (r) { var v = r.pick(['y', 'x', 'a']); return varEntire(-1, obj([v], [1]), 2, r.pick([2, 3, 5, 6, 11]), obj([v], [1])); } },
      { id: '8d', level: 'EMG', make: function (r) { var v = r.pick(['a', 'b', 'x']); return varEntire(r.pick([2, 4, 5]), obj([v], [1]), 3, 1, obj([v], [2])); } },
      { id: '8e', level: 'PRG', make: function (r) { var v = r.pick(['a', 'x', 'y']), c = r.pick([2, 3]), tt = r.pick([2, 3, 4, 7]); return varEntire(-c, obj([v], [2]), 3, tt, obj([v], [1])); } },
      { id: '8f', level: 'PRG', make: function (r) { var l = letters(r, 2); return varEntire(1, obj(l, [1, 2]), 2, r.pick([3, 5, 6, 7]), obj([l[0]], [1])); } }] },
    { num: '9', section: 'Putting it together', stem: '', parts: [
      { id: '9', level: 'PRG', make: function (r) { var s = r.pick([2, 3, 4, 6, 7]), tt = r.pick([2, 3, 5, 6, 7]); if (s === 5 && tt === 3) tt = 2; return squareVar(r, s, tt, letters(r, 2), [r.pick([1, 2, 3]), 1], '', 'square from area with two variables'); } }] },
    { num: '10', stem: '', parts: [
      { id: '10', level: 'PRG', make: function (r) { var s = r.pick([2, 3, 4]), tt = r.pick([2, 3, 4, 5]), e = r.pick([4, 5, 7, 8]), v = r.pick(['x', 'a']); if (s === 4 && tt === 2 && e === 7) e = 8;
        var p = varMixed(1, {}, 3, s * s * s * tt, obj([v], [e]));
        p.prompt = 'A cube has a volume of ' + t(vtex([s * s * s * tt, 1], obj([v], [e]))) + ' cubic units. Determine its edge length in simplest form.';
        p.solution = 'The edge is the cube root of the volume.<br>' + p.solution; return p; } }] },
    { num: '11', stem: '', parts: [
      { id: '11', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var p = r.int(1, 6), q = r.int(p + 1, 9); return { p: p, q: q, S: p * p + q * q }; }, function (v) { var f = ex.nthFactor(v.S, 2); return f > 1 && v.S / (f * f) > 1 && !(v.p === 2 && v.q === 4) && !(v.p === 3 && v.q === 6); }, { p: 3, q: 9, S: 90 });
        var f = ex.nthFactor(o.S, 2), m = o.S / (f * f), v = r.pick(['x', 'a']), target = (f === 1 ? '' : f) + v + '\\sqrt{' + m + '}';
        var chk = K.varRadical(target, 'mixed', { diag: function (rr) { if (rr && rr.n === 2 && rr.rad.m === o.p + o.q) return { code: 'u2l2-hyp-add', hint: 'Square <b>each</b> leg before adding: ' + t('(' + o.p + v + ')^{2}=' + o.p * o.p + v + '^{2}') + '.' }; return null; } });
        var p = P.math('The legs of a right triangle are ' + t(o.p === 1 ? v : o.p + v) + ' and ' + t(o.q + v) + ', ' + t(v + '>0') + '. Determine the length of the hypotenuse in simplest form.', chk, target,
          t('c=\\sqrt{(' + (o.p === 1 ? '' : o.p) + v + ')^{2}+(' + o.q + v + ')^{2}}=\\sqrt{' + o.p * o.p + v + '^{2}+' + o.q * o.q + v + '^{2}}=\\sqrt{' + o.S + v + '^{2}}=\\sqrt{' + (f * f === 1 ? '' : f * f + '\\cdot ') + m + '\\cdot ' + v + '^{2}}=' + target) + '.',
          ['Pythagorean theorem: square each leg (square the number <b>and</b> the variable), then add like terms.', 'Simplify the root: halve the exponent of ' + t(v) + ' and take out the largest perfect square.'], 'hypotenuse ' + o.p + v + ', ' + o.q + v, { keys: 'var' });
        p.bad = [(o.p + o.q) === 4 ? '3x' : '\\sqrt{' + (o.p + o.q) + v + '}'];
        return p;
      } }] },
    { num: '12', section: 'Multiple choice and numerical response', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '12', level: 'EMG', make: function (r) { var b = r.pick([2, 4, 5, 6]), k = r.pick([2, 3, 4, 5]); if (b === 3 && k === 2) k = 3; var c = b * k;
        return P.mc(r, 'The restriction on the variable in ' + t('\\sqrt{' + c + '-' + b + 'x}') + ' is', [
          { html: t('x\\le ' + k), right: true }, { html: t('x\\ge ' + k), why: 'You divided by ' + t(-b) + ' — a negative — so the inequality sign must reverse.' },
          { html: t('x\\ge -' + k), why: 'Solve step by step: ' + t(c + '-' + b + 'x\\ge 0\\Rightarrow -' + b + 'x\\ge -' + c) + '.' }, { html: t('x\\le -' + k), why: 'Check the sign of the boundary: ' + t('-' + c + '\\div(-' + b + ')=' + k) + '.' }],
          t(c + '-' + b + 'x\\ge 0\\Rightarrow -' + b + 'x\\ge -' + c + '\\Rightarrow x\\le ' + k) + ' (dividing by ' + t(-b) + ' reverses the sign).', ['Set the radicand ' + t('\\ge 0') + ' and solve.'], 'MC restriction sqrt(' + c + '-' + b + 'x)'); } }] },
    { num: '13', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '13', level: 'EMG', make: function (r) { var s = r.pick([2, 4, 6]), tt = r.pick([2, 3, 5]), k = r.pick([2, 3, 4]), v = r.pick(['a', 'x']); if (s === 4 && tt === 3 && k === 3) k = 2;
        var c = s * s * tt, e = 2 * k + 1, ra = tt + v, kk = function (x) { return x === 1 ? '' : x; };
        return P.mc(r, 'In simplest form, ' + t('\\sqrt{' + c + v + '^{' + e + '}}') + ', ' + t(v + '\\ge 0') + ', is', [
          { html: t(s + v + '^{' + k + '}\\sqrt{' + ra + '}'), right: true },
          { html: t(s * s + v + '^{' + k + '}\\sqrt{' + ra + '}'), why: t(s * s) + ' comes out of the root as ' + t('\\sqrt{' + s * s + '}=' + s) + '.' },
          { html: t(kk(s / 2) + v + '^{' + k + '}\\sqrt{' + 4 * tt + v + '}'), why: t(4 * tt) + ' still has the perfect-square factor 4 — not simplest form.' },
          { html: t(s + v + '^{' + 2 * k + '}\\sqrt{' + ra + '}'), why: 'Coming out of a square root, the exponent is <b>halved</b>: ' + t('\\sqrt{' + v + '^{' + 2 * k + '}}=' + v + '^{' + k + '}') + '.' }],
          t('\\sqrt{' + s * s + '\\cdot ' + tt + '\\cdot ' + v + '^{' + 2 * k + '}\\cdot ' + v + '}=' + s + v + '^{' + k + '}\\sqrt{' + ra + '}') + '.', ['Largest perfect square out of the number; halve the even part of the exponent.'], 'MC simplest sqrt(' + c + v + '^' + e + ')'); } }] },
    { num: '14', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '14', level: 'BEG', make: function (r) { var c = r.pick([1, 2, 3, 5]), kind = r.pick(['odd', 'odd', 'sq']);
        var right = kind === 'odd' ? (r.chance(0.5) ? '\\sqrt[3]{x-' + c + '}' : '\\sqrt[5]{x+' + c + '}') : '\\sqrt{x^{2}+' + c + '}';
        return P.mc(r, 'Which radical is defined for every real number ' + t('x') + '?', [
          { html: t(right), right: true },
          { html: t('\\sqrt{x-' + c + '}'), why: 'Even index: ' + t('x-' + c) + ' is negative when ' + t('x<' + c) + '.' },
          { html: t('\\sqrt[4]{x}'), why: 'Even index: ' + t('x') + ' can’t be negative.' },
          { html: t('\\sqrt{-x}'), why: 'Even index: ' + t('-x') + ' is negative when ' + t('x>0') + '.' }],
          kind === 'odd' ? 'The index is odd, so any radicand is allowed: ' + t(right) + ' is defined for every ' + t('x') + '.' : t('x^{2}+' + c + '\\ge ' + c + '>0') + ' for every ' + t('x') + ', so ' + t(right) + ' is always defined.', ['Even index: the radicand must be ' + t('\\ge 0') + '. Odd index: anything goes.'], 'MC defined for all x'); } }] },
    { num: '15', stem: '<i>(Numerical Response)</i>', parts: [
      { id: '15', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(3, 12), tt: r.pick([2, 3, 5]), b: r.int(2, 5), c: r.int(2, 6) }; }, function (v) { return !(v.a === 10 && v.b === 3 && v.c === 4); }, { a: 6, tt: 2, b: 2, c: 3 });
        var C = o.a * o.a * o.tt, ans = o.a + o.b + o.c;
        return P.nr('In simplest form, ' + t('\\sqrt{' + F(C) + 'x^{' + 2 * o.b + '}y^{' + (2 * o.c + 1) + '}}=ax^{b}y^{c}\\sqrt{' + o.tt + 'y}') + ' (' + t('x,y\\ge 0') + '). The value of ' + t('a+b+c') + ' is ________.', ans,
          function (v) { if (v === o.a + 2 * o.b + 2 * o.c) return { code: 'var-exp', hint: 'Halve the exponents: ' + t('\\sqrt{x^{' + 2 * o.b + '}}=x^{' + o.b + '}') + '.' }; if (v === o.a * o.a + o.b + o.c) return { code: 'coef-power', hint: t(F(o.a * o.a)) + ' comes out as its square root, ' + t(o.a) + '.' }; if (v === o.a + o.b + 2 * o.c + 1 || v === o.a + o.b + o.c + 1) return { code: 'u2l2-nr-sum', hint: 'One ' + t('y') + ' stays under the root: ' + t('y^{' + (2 * o.c + 1) + '}=y^{' + 2 * o.c + '}\\cdot y') + ', so ' + t('c=' + o.c) + '.' }; return null; },
          t('\\sqrt{' + F(o.a * o.a) + '\\cdot ' + o.tt + '\\cdot x^{' + 2 * o.b + '}\\cdot y^{' + 2 * o.c + '}\\cdot y}=' + o.a + 'x^{' + o.b + '}y^{' + o.c + '}\\sqrt{' + o.tt + 'y}') + ', so ' + t('a+b+c=' + o.a + '+' + o.b + '+' + o.c + '=' + ans) + '.', ['Take the largest perfect square out of ' + t(F(C)) + ' and halve each even exponent.'], 'NR a+b+c');
      } }] },
    { num: '16', stem: '<i>(Numerical Response)</i>', parts: [
      { id: '16', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var b = r.pick([2, 3, 4, 5, 6, 7]); return { b: b, c: r.int(15, 90) }; }, function (v) { return v.c % v.b !== 0 && !(v.b === 4 && v.c === 50); }, { b: 3, c: 40 }), L = Math.floor(o.c / o.b), bd = ex.norm(o.c, o.b);
        return P.nr('The largest integer value of ' + t('x') + ' for which ' + t('\\sqrt{' + o.c + '-' + o.b + 'x}') + ' is defined is ________.', L,
          function (v) { if (v === L + 1) return { code: 'u2l2-largest', hint: 'Check ' + t('x=' + (L + 1)) + ': ' + t(o.c + '-' + o.b + '(' + (L + 1) + ')=' + (o.c - o.b * (L + 1))) + ', a negative radicand.' }; if (Math.abs(v - o.c / o.b) < 0.01) return { code: 'u2l2-bound', hint: t('x\\le ' + rTex(bd)) + ' is the restriction — the question asks for the largest <b>integer</b>.' }; return null; },
          t(o.c + '-' + o.b + 'x\\ge 0\\Rightarrow x\\le ' + rTex(bd) + '=' + Number((o.c / o.b).toFixed(3))) + '. The largest integer is ' + t(L) + '. (Check: ' + t(o.c + '-' + o.b + '(' + L + ')=' + (o.c - o.b * L) + '\\ge 0') + '.)', ['Find the restriction first, then the largest integer that satisfies it.'], 'NR largest integer');
      } }] }
  ];

  /* ================================ Extra practice ================================ */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'State the restriction on the variable.', parts: [
      { id: 'xa1a', level: 'BEG', make: function (r) { return restrPart(1, -r.pick([3, 4, 5, 6, 11]), 2); } },
      { id: 'xa1b', level: 'EMG', make: function (r) { var a = r.pick([2, 3, 5]), k = r.pick([1, 2, 4, 5]); return restrPart(a, a * k, 2); } },
      { id: 'xa1c', level: 'PRG', make: function (r) { var a = r.pick([2, 3, 4, 6]), k = r.pick([2, 4, 5]); return restrPart(-a, a * k, 2); } },
      { id: 'xa1d', level: 'BEG', make: function (r) { return restrPart(-1, r.pick([2, 4, 9, 10]), 3); } },
      { id: 'xa1e', level: 'EMG', make: function (r) { return restrPart(r.pick([3, 5, 7]), 0, 4); } },
      { id: 'xa1f', level: 'PRG', make: function (r) { return restrPart(-1, -r.pick([2, 3, 5, 6, 7]), 2); } }] },
    { num: 'A2', stem: 'Simplify. Assume variables under an even index are ' + t('\\ge 0') + '.', parts: [
      { id: 'xa2a', level: 'BEG', make: function (r) { return varMixed(1, {}, 2, 1, obj([r.pick(['x', 'y'])], [r.pick([8, 10, 12, 20])])); } },
      { id: 'xa2b', level: 'BEG', make: function (r) { return varMixed(1, {}, 2, 1, obj([r.pick(['a', 'b'])], [r.pick([7, 11, 13])])); } },
      { id: 'xa2c', level: 'EMG', make: function (r) { return varMixed(1, {}, 3, 1, obj([r.pick(['b', 'a'])], [r.pick([7, 8, 11, 13])])); } },
      { id: 'xa2d', level: 'EMG', make: function (r) { var c = r.pick([4, 9, 25]) * r.pick([2, 3, 5]); if (c === 32 || c === 18) c = 50; return varMixed(1, {}, 2, c, obj([r.pick(['x', 'a'])], [r.pick([3, 5])])); } },
      { id: 'xa2e', level: 'PRG', make: function (r) { var l = letters(r, 2), c = r.pick([16, 36, 49]) * r.pick([2, 3, 5]); return varMixed(1, {}, 2, c, obj(l, [r.pick([4, 6]), r.pick([3, 5, 7])])); } },
      { id: 'xa2f', level: 'PRG', make: function (r) { var c = 8 * r.pick([2, 5, 7]); return varMixed(1, {}, 3, -c, obj([r.pick(['a', 'x'])], [r.pick([6, 9, 12])])); } },
      { id: 'xa2g', level: 'PRG', make: function (r) { var l = letters(r, 2), c = r.pick([27, 125]) * r.pick([2, 3]); return varMixed(1, {}, 3, c, obj(l, [r.pick([4, 5, 7]), r.pick([1, 2])])); } },
      { id: 'xa2h', level: 'PRG', make: function (r) { var c = 16 * r.pick([3, 5, 2]); if (c === 32 && r.chance(0.5)) c = 48; return varMixed(1, {}, 4, c, obj([r.pick(['a', 'x'])], [r.pick([5, 6, 7])])); } }] },
    { num: 'A3', stem: 'Write each mixed radical as an entire radical. Assume variables under an even index are ' + t('\\ge 0') + '.', parts: [
      { id: 'xa3a', level: 'BEG', make: function (r) { var v = r.pick(['x', 'y']); return varEntire(r.pick([3, 7, 8, 9]), obj([v], [1]), 2, 1, obj([v], [1])); } },
      { id: 'xa3b', level: 'EMG', make: function (r) { var v = r.pick(['a', 'b']); return varEntire(r.pick([2, 4, 5]), obj([v], [1]), 2, r.pick([2, 3, 5]), obj([v], [1])); } },
      { id: 'xa3c', level: 'PRG', make: function (r) { var v = r.pick(['a', 'x']); return varEntire(-r.pick([2, 3, 5]), obj([v], [2]), 3, 1, obj([v], [1])); } },
      { id: 'xa3d', level: 'PRG', make: function (r) { var l = letters(r, 2); return varEntire(r.pick([3, 4, 5]), obj(l, [1, 1]), 2, r.pick([2, 3, 7]), obj([l[1]], [1])); } }] },
    { num: 'B1', section: 'B. Applying', stem: function (sh) { return 'Consider ' + t('\\sqrt{' + linTex([sh.a, 1], [sh.b, 1]) + '}') + '.'; },
      shared: function (r) { return evalSetup(r, [2, 3, 5, 6], [1, 2, 3, 4, 5], [[3, 6], [2, 10]]); }, parts: [
      { id: 'xb1a', level: 'BEG', make: function (r, sh) { var p = restrPart(sh.a, sh.b, 2); p.prompt = 'State the restriction on ' + t('x') + '.'; return p; } },
      { id: 'xb1b', level: 'PRG', make: function (r, sh) { return evalFields(sh); } }] },
    { num: 'B2', stem: '', parts: [
      { id: 'xb2', level: 'PRG', make: function (r) { var s = r.pick([2, 3, 5, 7]), tt = r.pick([2, 3, 5]), v = r.pick(['x', 'a']); if (s === 6) s = 5; return squareVar(r, s, tt, [v], [r.pick([2, 3, 4, 5])], '', 'square side/perimeter, one variable'); } }] },
    { num: 'B3', stem: '', parts: [
      { id: 'xb3', level: 'PRG', make: function (r) { var s = r.pick([2, 3, 4, 5]), tt = r.pick([2, 3, 4]), e = r.pick([4, 5, 7, 8]), v = r.pick(['a', 'x']); if (s === 5 && tt === 2 && e === 5) e = 7;
        var p = varMixed(1, {}, 3, s * s * s * tt, obj([v], [e]));
        p.prompt = 'A cube has a volume of ' + t(vtex([s * s * s * tt, 1], obj([v], [e]))) + ' cubic units. Determine its edge length in simplest form.'; return p; } }] },
    { num: 'B4', stem: function (sh) { return sh.name + ' wrote ' + t('\\sqrt{' + sh.c + sh.v + '^{' + sh.e + '}}=' + sh.s + sh.v + '^{' + (sh.e - 1) + '}\\sqrt{' + sh.tt + sh.v + '}') + ', ' + t(sh.v + '\\ge 0') + '.'; },
      shared: function (r) { var s = r.pick([2, 3, 4, 5]), tt = r.pick([2, 3, 5]), e = r.pick([5, 7, 9]); if (s === 3 && tt === 2 && e === 5) e = 7; return { s: s, tt: tt, c: s * s * tt, e: e, v: r.pick(['x', 'a']), name: r.pick(['Pat', 'Sam', 'Riya', 'Theo']) }; }, parts: [
      { id: 'xb4a', level: 'EMG', make: function (r, sh) { var h = (sh.e - 1) / 2;
        return P.mc(r, 'What is the error?', [
          { html: t(sh.v + '^{' + (sh.e - 1) + '}') + ' comes out of the square root as ' + t(sh.v + '^{' + h + '}') + ' (halve the exponent), not as ' + t(sh.v + '^{' + (sh.e - 1) + '}') + '.', right: true },
          { html: t(sh.c) + ' should come out as ' + t(sh.s * sh.s) + '.', why: t('\\sqrt{' + sh.s * sh.s + '}=' + sh.s) + ' is right.' },
          { html: 'No ' + t(sh.v) + ' should stay under the root.', why: t(sh.v + '^{' + sh.e + '}') + ' has an odd exponent, so one ' + t(sh.v) + ' stays under the root.' },
          { html: 'There is no error.', why: 'Check by squaring: ' + t('(' + sh.v + '^{' + (sh.e - 1) + '})^{2}=' + sh.v + '^{' + 2 * (sh.e - 1) + '}') + '.' }],
          t(sh.v + '^{' + sh.e + '}=' + sh.v + '^{' + (sh.e - 1) + '}\\cdot ' + sh.v) + ', and ' + t('\\sqrt{' + sh.v + '^{' + (sh.e - 1) + '}}=' + sh.v + '^{' + h + '}') + ' (halve the exponent). ' + sh.name + ' didn’t halve it.', ['Check by squaring the part outside the root.'], 'Pat error'); } },
      { id: 'xb4b', level: 'EMG', make: function (r, sh) { var p = varMixed(1, {}, 2, sh.c, obj([sh.v], [sh.e])); p.prompt = 'Give the correct simplest form.'; p.bad.push(sh.s + sh.v + '^{' + (sh.e - 1) + '}\\sqrt{' + sh.tt + sh.v + '}'); return p; } }] },
    { num: 'B5', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: 'xb5', level: 'EMG', make: function (r) { var k = r.pick([2, 3, 4, 5]), c = r.pick([2, 3]);
        var cands = [{ tex: '\\sqrt{-' + c + 'x}', R: c * k, right: true }, { tex: '\\sqrt{x+' + (k - 1) + '}', R: -1 }, { tex: '\\sqrt[4]{x}', R: -k }, { tex: '\\sqrt{x-1}', R: -k - 1 }];
        return P.mc(r, 'Which radical is defined when ' + t('x=-' + k) + '?', cands.map(function (o) { return { html: t(o.tex), right: !!o.right, why: o.right ? null : 'Substitute ' + t('x=-' + k) + ': the radicand is ' + t(o.R) + ', negative, under an even index.' }; }),
          t('\\sqrt{-' + c + '(-' + k + ')}=\\sqrt{' + c * k + '}') + ' is defined. The other radicands are ' + t(cands.slice(1).map(function (o) { return o.R; }).join(',\\ ')) + ' — negative under an even index.', ['Substitute the value into each radicand.'], 'MC defined at x=-' + k); } }] },
    { num: 'B6', stem: '<i>(Numerical Response)</i>', parts: [
      { id: 'xb6', level: 'PRG', make: function (r) { var c = r.pick([2, 3, 4, 5]), p = r.pick([1, 2, 3]), tt = r.pick([2, 3, 5]), q = r.pick([1, 2]), v = r.pick(['a', 'x']); if (c === 2 && p === 3 && tt === 3 && q === 1) p = 2;
        var k = c * c * c * tt, m = 3 * p + q, ans = k + m;
        return P.nr('When ' + t(c + v + (p > 1 ? '^{' + p + '}' : '') + '\\sqrt[3]{' + tt + vp(v, q) + '}') + ' is written as the entire radical ' + t('\\sqrt[3]{k' + v + '^{m}}') + ', the value of ' + t('k+m') + ' is ________.', ans,
          function (x) { if (x === c * tt + p + q || x === c * c * c * tt + p + q) return { code: 'var-no-power', hint: 'Raise everything in front to the power 3: ' + t('(' + c + vp(v, p) + ')^{3}=' + c * c * c + v + '^{' + 3 * p + '}') + '.' }; return null; },
          t('\\sqrt[3]{(' + c + vp(v, p) + ')^{3}\\cdot ' + tt + vp(v, q) + '}=\\sqrt[3]{' + c * c * c + v + '^{' + 3 * p + '}\\cdot ' + tt + vp(v, q) + '}=\\sqrt[3]{' + k + v + '^{' + m + '}}') + ', so ' + t('k+m=' + k + '+' + m + '=' + ans) + '.', ['Cube the coefficient and multiply the exponent of ' + t(v) + ' by 3, then multiply by the radicand.'], 'NR k+m'); } }] },
    { num: 'C1', section: 'C. Stretch', stem: '', parts: [
      { id: 'xc1', level: 'MAS', make: function (r) { var a = r.pick([1, 3, 4, -2]), b = a + r.pick([3, 5, 6, 8]); if (a === 2 && b === 6) b = 7;
        var ra = 'x' + (a < 0 ? '+' + (-a) : '-' + a), rb = b + '-x', tgt = a + '\\le x\\le ' + b;
        return setPart('For what values of ' + t('x') + ' is ' + t('\\sqrt{' + ra + '}+\\sqrt{' + rb + '}') + ' defined?', tgt, [{ is: 'x\\ge ' + a, code: 'u2l2-one-only', hint: 'Both radicands must be ' + t('\\ge 0') + ': what does ' + t('\\sqrt{' + rb + '}') + ' need?' }, { is: 'x\\le ' + b, code: 'u2l2-one-only', hint: 'Both radicands must be ' + t('\\ge 0') + ': what does ' + t('\\sqrt{' + ra + '}') + ' need?' }, { is: 'x\\in\\mathbb{R}', code: 'u2l2-even-all', hint: 'Both are square roots: their radicands can’t be negative.' }],
          'Both radicands must be ' + t('\\ge 0') + ': ' + t(ra + '\\ge 0\\Rightarrow x\\ge ' + a) + ' and ' + t(rb + '\\ge 0\\Rightarrow x\\le ' + b) + '. So ' + t(tgt) + '.', ['Find the restriction for each radical; both must hold.', 'Write it as one inequality, e.g. ' + t('2\\le x\\le 6') + '.'], 'two radicals defined'); } }] },
    { num: 'C2', stem: '', parts: [
      { id: 'xc2', level: 'MAS', make: function (r) { var s = r.pick([2, 3, 5]), tt = r.pick([2, 3, 5, 7]), h = r.pick([1, 2, 3, 4, 5]); if (s === 2 && tt === 2 && h === 1) tt = 3;
        var c = s * s * tt, B = '(x-' + h + ')', target = s + B + '\\sqrt{' + tt + B + '}';
        var xs = [h + 1.7, h + 2.3, h + 4.1, h + 6.5];
        var check = function (resp) {
          var a = K.read(resp); if (a.res) return a.res;
          var sv = Object.keys(ex.shape(a.ast).vars); if (sv.some(function (v) { return v !== 'x'; })) return wrong('var', 'Use only the variable ' + t('x') + '.');
          var same = xs.every(function (x) { return ex.eq(ex.value(a.ast, { x: x }), s * (x - h) * Math.sqrt(tt * (x - h)), 1e-7); });
          if (!same) {
            if (xs.every(function (x) { return ex.eq(ex.value(a.ast, { x: x }), s * (x - h) * (x - h) * Math.sqrt(tt * (x - h)), 1e-7) || ex.eq(ex.value(a.ast, { x: x }), s * s * (x - h) * Math.sqrt(tt * (x - h)), 1e-7); })) return wrong('u2l2-binom', 'Treat ' + t(B) + ' as one base: ' + t(B + '^{3}=' + B + '^{2}\\cdot' + B) + ', and ' + t('\\sqrt{' + B + '^{2}}=' + B) + '. Take ' + t('\\sqrt{' + s * s + '}=' + s) + ' out too.');
            return wrong('value', null);
          }
          var roots = []; (function walk(n) { if (!n || typeof n !== 'object') return; if (n.t === 'root') roots.push(n); ['a', 'b'].forEach(function (k) { if (n[k] && typeof n[k] === 'object') walk(n[k]); }); })(a.ast);
          if (roots.length !== 1) return form('one-radical', 'Right value — now write it with a single square root.');
          var inner = roots[0].a, simp = xs.every(function (x) { return ex.eq(ex.value(inner, { x: x }) / (x - h), tt, 1e-7); });
          if (!simp) return form('not-simplest', 'Right value, but not in simplest form: take every perfect square (the number and ' + t(B + '^{2}') + ') out of the root. Only ' + t(tt + B) + ' should stay under it.');
          return ok();
        };
        var p = P.math('Simplify ' + t('\\sqrt{' + c + B + '^{3}}') + ', ' + t('x\\ge ' + h) + '. (Treat ' + t('x-' + h) + ' as a single base.)', check, target,
          t('\\sqrt{' + c + B + '^{3}}=\\sqrt{' + s * s + '\\cdot ' + tt + '\\cdot ' + B + '^{2}\\cdot ' + B + '}=' + target) + '.',
          ['Write ' + t(B + '^{3}=' + B + '^{2}\\cdot ' + B) + '. The square comes out as ' + t(B) + '.', 'Type the brackets with the ' + t('(\\ )') + ' key.'], 'simplify sqrt(c(x-h)^3)', { keys: 'expo', vars: ['x'] });
        p.bad = ['\\sqrt{' + c + B + '^{3}}', s * s + B + '\\sqrt{' + tt + B + '}'];
        p.good = [s + '\\sqrt{' + tt + B + '}' + B];
        return p; } }] },
    { num: 'C3', stem: '', parts: [
      { id: 'xc3', level: 'MAS', make: function (r) { var h = r.pick([2, 4, 5, 6, 7]), x0 = h - r.pick([2, 3]), d = x0 - h;
        return setPart('For which values of ' + t('x') + ' is ' + t('\\sqrt{(x-' + h + ')^{2}}=x-' + h) + ' true? (Test ' + t('x=' + x0) + ' to see why.)', 'x\\ge ' + h,
          [{ is: 'x\\in\\mathbb{R}', code: 'u2l2-abs', hint: 'Test ' + t('x=' + x0) + ': ' + t('\\sqrt{(' + d + ')^{2}}=' + (-d)) + ', but ' + t('x-' + h + '=' + d) + '.' }, { is: 'x\\le ' + h, code: 'u2l2-flip', hint: 'A square root is never negative, so ' + t('x-' + h) + ' must be ' + t('\\ge 0') + '.' }, { is: 'x\\ge 0', code: 'u2l2-abs', hint: 'Test ' + t('x=' + (h - 1)) + ' (which is ' + t('\\ge 0') + '): does it work?' }],
          'Test ' + t('x=' + x0) + ': ' + t('\\sqrt{(' + d + ')^{2}}=\\sqrt{' + d * d + '}=' + (-d)) + ', but ' + t('x-' + h + '=' + d) + ' — false there. A square root is never negative, so the statement is true only when ' + t('x-' + h + '\\ge 0') + ': ' + t('x\\ge ' + h) + '.', ['A square root is never negative.'], 'sqrt((x-h)^2)=x-h'); } }] },
    { num: 'C4', stem: function (sh) { return 'A square has an area of ' + t(sh.c + 'x^{5}') + ' square units, ' + t('x\\ge 0') + '.'; },
      shared: function (r) { var s = r.pick([2, 3, 4, 5]), tt = r.pick([2, 3, 5]); if (s === 3 && tt === 3) s = 2; return { s: s, tt: tt, c: s * s * tt }; }, parts: [
      { id: 'xc4a', level: 'ADV', make: function (r, sh) { var p = varMixed(1, {}, 2, sh.c, { x: 5 }); p.prompt = '(a) Write its side length in simplest form.'; return p; } },
      { id: 'xc4b', level: 'ADV', make: function (r, sh) { var k = sh.tt, side = sh.s * k * k * k;
        return P.number('(b) Use your answer to find the side length when ' + t('x=' + k) + '.', side,
          function (v) { if (v === sh.s * k * k) return { code: 'u2l2-check', hint: 'Don’t forget the root: ' + t('\\sqrt{' + sh.tt + '(' + k + ')}=\\sqrt{' + sh.tt * k + '}=' + k) + '.' }; if (v === side * side) return { code: 'u2l2-check', hint: 'That is the area. The side is its square root.' }; return null; },
          t(sh.s + 'x^{2}\\sqrt{' + sh.tt + 'x}') + ' at ' + t('x=' + k) + ': ' + t(sh.s + '(' + k * k + ')\\sqrt{' + sh.tt * k + '}=' + sh.s * k * k + '\\times ' + k + '=' + side) + '.<br>Check with the area: ' + t(sh.c + '(' + k + '^{5})=' + sh.c + '\\times ' + pw(k, 5) + '=' + F(sh.c * pw(k, 5)) + '=' + side + '^{2}') + ' ✓',
          ['Substitute into your simplified side length from (a).', 'Check: the side squared should equal the area.'], 'side at x=' + k); } }] }
  ];

  HW.defineLesson({ id: LID, unit: 2, num: '2', title: 'Radicals with Variables and Their Restrictions', outcome: 'AN2', calc: true,
    blurb: 'Restrictions on the variable (even index: radicand ≥ 0; odd index: none), then simplifying and converting radicals with variables.',
    questions: QUESTIONS, extra: EXTRA });
})(window);
