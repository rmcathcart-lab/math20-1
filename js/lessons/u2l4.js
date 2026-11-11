/* Math 20-1 · Unit 2 · Lesson 4 — Multiplying Radicals (outcome AN2 on every part)
 * Assignment 4 (u2_l04.tex, Questions 1–18) and the Lesson 4 Extra Practice (u2_ep04.tex, A1–A3, B1–B5, C1–C4).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet's own numbers are left out where that is easy). No calculator (Unit 2): exact answers in
 * simplest form. Uses the radical kit in u2l3.js (HW.p23rad: sums and products of radicals, the simplest-form checker,
 * the restriction box and the keypad), so u2l3.js must load first.
 *
 * Conversions: "write as a product of two mixed radicals in two different ways" → two boxes, each a product of two
 * radicals with the right value (any two different ways); "which product is rational? explain" (10a) → the two products
 * in boxes, then a multiple choice of reasons; "give two irrational numbers whose product is rational / irrational"
 * (10b) → two multiple choice parts; "show that …" (Extra C1, C4) → work out the expression in boxes (C1: its value;
 * C4: x² and the value of the expression).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 13 (difference of two squared binomials), Extra C1–C4. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var R = HW.p23rad; if (!R) throw new Error('u2l4.js needs u2l3.js (the radical kit) loaded first');
  var LID = 'u2l4', T = R.T, qq = R.qq, qmul = R.qmul, qadd = R.qadd, qv = R.qv, gcd = R.gcd, pickWhere = function (g, f) { return R.pickWhere(g, f, LID); };
  function rt(n, m) { return R.rt(n, m); }
  function raw(c, n, m) { return n === 1 || m === 1 ? { c: qq(c), n: 1, m: 1 } : { c: qq(c), n: n, m: m }; }
  function N(c) { return raw(c, 1, 1); }
  function S(c, m) { return raw(c, 2, m); }
  function tx(list) { return list.map(function (u, i) { return R.termTex(u, i === 0); }).join(''); }
  function br(list) { return '\\left(' + tx(list) + '\\right)'; }
  function cT(c) { c = qq(c); return c[1] === 1 ? (c[0] === 1 ? '' : c[0] === -1 ? '-' : String(c[0])) : (c[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(c[0]) + '}{' + c[1] + '}'; }
  function sqf(m) { return ex.simplest(m, 2); }
  function coprime(a, b) { return gcd(a, b) === 1; }
  var SQF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23];

  var CODES = {
    'u2l4-add-rad': 'Added the radicands instead of multiplying', 'u2l4-add-coef': 'Added the coefficients instead of multiplying', 'u2l4-drop-coef': 'Dropped the coefficients',
    'u2l4-coef-power': 'Took the perfect square out without its root', 'u2l4-sq-coef': 'Didn’t square the coefficient', 'u2l4-sq-double': 'Doubled instead of squaring',
    'u2l4-sq-root': 'Squared the coefficient but left the radical', 'u2l4-neg-square': 'Sign slip with a squared negative', 'u2l4-cube-coef': 'Didn’t cube the coefficient',
    'u2l4-dist-one': 'Multiplied only the first term in the brackets', 'u2l4-foil-miss': 'Left out a product when expanding', 'u2l4-no-middle': 'Squared a binomial without the middle term',
    'u2l4-middle-once': 'Middle term not doubled', 'u2l4-rad-sq': 'Treated (√a)² as a', 'u2l4-conj-same': 'Gave the same expression as its conjugate',
    'u2l4-conj-neg': 'Changed both signs for the conjugate', 'u2l4-conj-add': 'Conjugate product: added the squares', 'u2l4-conj-sq': 'Conjugate product: forgot to square the coefficient',
    'u2l4-two-same': 'Gave the same product twice', 'u2l4-two-form': 'Not written as a product of two radicals', 'u2l4-area-half': 'Triangle area without the ½', 'u2l4-perim-area': 'Gave the perimeter instead of the area',
    'u2l4-diag-noroot': 'Gave d² instead of d', 'u2l4-diag-sum': 'Added the sides for the diagonal', 'u2l4-ab-swap': 'Gave a or b instead of a + b',
    'u2l4-k-sub': 'Subtracted instead of adding', 'u2l4-k-root': 'Gave √k instead of k', 'u2l4-cube-sq': 'Cubed only part of the binomial'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u2l4-coef-power': 'b', 'u2l4-sq-coef': 'b', 'u2l4-sq-double': 'n', 'u2l4-sq-root': 'b', 'u2l4-neg-square': 's', 'u2l4-cube-coef': 'b', 'u2l4-dist-one': 'b', 'u2l4-foil-miss': 'b',
    'u2l4-no-middle': 'b', 'u2l4-middle-once': 's', 'u2l4-rad-sq': 's', 'u2l4-conj-same': 'n', 'u2l4-conj-neg': 's', 'u2l4-conj-add': 'b', 'u2l4-conj-sq': 's', 'u2l4-two-same': 's',
    'u2l4-area-half': 's', 'u2l4-perim-area': 'n', 'u2l4-diag-noroot': 'b', 'u2l4-diag-sum': 'n', 'u2l4-ab-swap': 's', 'u2l4-k-sub': 'b', 'u2l4-k-root': 's', 'u2l4-cube-sq': 'b',
    'u2l4-add-rad': 'n', 'u2l4-add-coef': 'b', 'u2l4-drop-coef': 'b' });

  var H_MUL = ['Multiply the coefficients together and the radicands together: ' + t('m\\sqrt{a}\\cdot k\\sqrt{b}=mk\\sqrt{ab}') + '.', 'Then write the result in simplest form (take out any perfect-square factor).'];
  var H_FOIL = ['Multiply each term of the first bracket by each term of the second, then simplify each product.', t('\\left(\\sqrt{a}\\right)^{2}=a') + '; collect the like terms at the end.'];
  var H_SQ = ['Write the square as a product of two equal brackets and expand: ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + '.', 'Never ' + t('(a+b)^{2}=a^{2}+b^{2}') + ' — the middle term ' + t('2ab') + ' is needed.'];
  var H_CONJ = ['The conjugate has the same two terms with the opposite sign between them.', 'Conjugates multiply to ' + t('(a\\sqrt{b})^{2}-(c\\sqrt{d})^{2}') + ': the middle terms cancel.'];

  /* ---------- products of single radicals ---------- */
  function factorTex(fs) {
    var plain = fs.every(function (f) { return f.c[0] === 1 && f.c[1] === 1; });
    return plain ? fs.map(function (f) { return R.termTex(f, true); }).join('\\cdot ') : fs.map(function (f) { return '\\left(' + R.termTex(f, true) + '\\right)'; }).join('');
  }
  function prodPart(fs, o) {
    o = o || {};
    var n = fs.filter(function (f) { return f.n > 1; })[0].n, C = fs.reduce(function (c, f) { return qmul(c, f.c); }, [1, 1]), M = fs.reduce(function (m, f) { return m * (f.n > 1 ? f.m : 1); }, 1);
    var ans = T(C, n, M), key = R.tex([ans]), q = factorTex(fs), fct = ex.nthFactor(M, n), s = M / Math.pow(fct, n);
    var line = q + '=' + cT(C) + rt(n, F(M));
    if (fct > 1) line += s === 1 ? '=' + cT(C) + (cT(C) === '' || cT(C) === '-' ? fct : '(' + fct + ')') + (key !== (cT(C) + fct) ? '=' + key : '') : '=' + cT(C) + rt(n, F(Math.pow(fct, n))) + rt(n, s) + '=' + key;
    var cands = [];
    if (fs.length === 2) {
      cands.push({ tex: R.tex([T(C, n, fs[0].m + fs[1].m)]), code: 'u2l4-add-rad', hint: 'Multiply the radicands — don’t add them: ' + t(rt(n, 'a') + '\\cdot' + rt(n, 'b') + '=' + rt(n, 'ab')) + '.' });
      if (fs.every(function (f) { return Math.abs(f.c[0]) > 1; })) cands.push({ tex: R.tex([T(qadd([Math.abs(fs[0].c[0]), 1], [Math.abs(fs[1].c[0]), 1]).map(function (x, i) { return i ? x : (C[0] < 0 ? -x : x); }), n, M)]), code: 'u2l4-add-coef', hint: 'Multiply the coefficients too: ' + t(Math.abs(fs[0].c[0]) + '\\times' + Math.abs(fs[1].c[0]) + '=' + Math.abs(fs[0].c[0] * fs[1].c[0])) + '.' });
    }
    if (fs.some(function (f) { return Math.abs(f.c[0]) > 1; })) cands.push({ tex: R.tex([T(C[0] < 0 ? -1 : 1, n, M)]), code: 'u2l4-drop-coef', hint: 'Don’t lose the numbers in front: multiply the coefficients together as well.' });
    if (fct > 1) cands.push({ tex: R.tex([T(qmul(C, [Math.pow(fct, n), 1]), n, s)]), code: 'u2l4-coef-power', hint: 'A perfect ' + R.powName(n) + ' comes out as its root: ' + t(rt(n, F(Math.pow(fct, n))) + '=' + fct) + '.' });
    return R.part(t(q), key, { sol: t(line) + (o.note ? '<br>' + o.note : ''), hints: o.hints || H_MUL, text: o.text || 'multiply ' + q, cands: cands.concat(o.cands || []) });
  }
  function pairShare(r, o) { // two square-free radicands sharing a factor s: s·x and s·y
    o = o || {};
    return pickWhere(function () { var s = r.pick(o.s || [2, 3, 5, 7]), xy = r.sample(o.xy || [1, 2, 3, 5, 7, 11], 2); return { s: s, x: xy[0], y: xy[1] }; },
      function (z) { return z.x !== z.s && z.y !== z.s && coprime(z.x, z.s) && coprime(z.y, z.s) && coprime(z.x, z.y) && sqf(z.s * z.x) && sqf(z.s * z.y) && z.s * z.x !== z.s * z.y && (!o.ok || o.ok(z)); });
  }
  /* (c√m)^k with an optional minus in front */
  function powPart(r, o) {
    var c = o.c, m = o.m, n = o.n || 2, k = n, neg = !!o.negOut, inner = R.termTex(raw(c, n, m), true);
    var q = (neg ? '-' : '') + '\\left(' + inner + '\\right)^{' + k + '}', val = (neg ? -1 : 1) * Math.pow(c, k) * m, key = String(val);
    var cands = [{ tex: String((neg ? -1 : 1) * Math.abs(c) * m), code: 'u2l4-sq-coef', hint: 'The coefficient is ' + (k === 2 ? 'squared' : 'cubed') + ' too: ' + t('\\left(' + Math.abs(c) + rt(n, m) + '\\right)^{' + k + '}=' + Math.abs(c) + '^{' + k + '}\\left(' + rt(n, m) + '\\right)^{' + k + '}') + '.' },
      { tex: (neg ? '-' : '') + (k * Math.abs(c)) + rt(n, m), code: 'u2l4-sq-double', hint: 'An exponent ' + t(k) + ' means multiply by itself ' + t(k) + ' times, not multiply by ' + t(k) + '.' },
      { tex: (neg ? '-' : '') + Math.pow(Math.abs(c), k) + rt(n, m), code: 'u2l4-sq-root', hint: t('\\left(' + rt(n, m) + '\\right)^{' + k + '}=' + m) + ': the radical goes away when it is ' + (k === 2 ? 'squared' : 'cubed') + '.' }];
    if (c < 0 || neg) cands.push({ tex: String(-val), code: 'u2l4-neg-square', hint: neg ? 'The minus sign is outside the brackets, so it is not squared: ' + t('-(\\dots)^{2}') + ' is negative.' : 'The negative is inside the brackets, so it is squared too: ' + t('(-' + Math.abs(c) + ')^{2}=' + c * c) + '.' });
    var sol = t(q + '=' + (neg ? '-' : '') + '\\left(' + (c < 0 ? '(' + c + ')' : Math.abs(c) === 1 ? '' : c) + '\\right)^{' + k + '}\\left(' + rt(n, m) + '\\right)^{' + k + '}=' + (neg ? '-' : '') + '(' + Math.pow(c, k) + ')(' + m + ')=' + key).replace('\\left(\\right)^{' + k + '}', '');
    return R.part(t(q), key, { sol: sol, hints: [t('\\left(' + rt(n, 'a') + '\\right)^{' + n + '}=a') + '. Raise the coefficient to the power as well.', neg ? 'The minus sign in front of the brackets is not part of the power.' : 'A negative number squared is positive.'], text: 'power of a radical', cands: Math.abs(c) === 1 ? cands.filter(function (x) { return x.code !== 'u2l4-sq-coef' && x.code !== 'u2l4-sq-double'; }) : cands });
  }
  /* a·(b + c + …): distributing a single term */
  function distPart(a, list, o) {
    o = o || {};
    var lines = R.foilLines([a], list), ans = R.sum(lines.list), key = R.tex(ans), q = R.termTex(a, true) + br(list);
    var steps = [lines.raw]; if (lines.simp !== lines.raw) steps.push(lines.simp); if (key !== lines.simp) steps.push(key);
    var one = R.sum([R.mul(a, list[0])].concat(list.slice(1)));
    return R.part(t(q), key, { sol: t(q + '=' + steps.join('=')) + (o.note ? '<br>' + o.note : ''), hints: ['Multiply ' + t(R.termTex(a, true)) + ' by <b>each</b> term in the brackets (the distributive property).', 'Simplify each product, then collect like terms.'], text: o.text || 'distribute ' + q,
      cands: [{ tex: R.tex(one), code: 'u2l4-dist-one', hint: 'Multiply ' + t(R.termTex(a, true)) + ' by every term in the brackets, not just the first.' }].concat(o.cands || []) });
  }
  /* (A)(B) — binomials; square: B = A */
  function foilPart(A, Bs, o) {
    o = o || {};
    var lines = R.foilLines(A, Bs), ans = R.sum(lines.list), key = R.tex(ans), q = o.q || (A === Bs ? br(A) + '^{2}' : br(A) + br(Bs));
    var steps = [];
    if (A === Bs) steps.push(br(A) + br(A));
    steps.push(lines.raw); if (lines.simp !== lines.raw) steps.push(lines.simp); if (key !== lines.simp) steps.push(key);
    var cands = (o.cands || []).slice();
    if (A === Bs && A.length === 2) {
      var noMid = R.sum([R.mul(A[0], A[0]), R.mul(A[1], A[1])]);
      cands.push({ tex: R.tex(noMid), code: 'u2l4-no-middle', hint: t('(a+b)^{2}\\ne a^{2}+b^{2}') + ': write it as ' + t(br(A) + br(A)) + ' and expand — there is a middle term ' + t('2ab') + '.' });
      var once = R.sum([R.mul(A[0], A[0]), R.mul(A[0], A[1]), R.mul(A[1], A[1])]);
      cands.push({ tex: R.tex(once), code: 'u2l4-middle-once', hint: 'The middle term appears twice when you expand: ' + t('(a+b)(a+b)=a^{2}+ab+ab+b^{2}') + '.' });
    } else if (A.length === 2 && Bs.length === 2) {
      var fl = R.sum([R.mul(A[0], Bs[0]), R.mul(A[1], Bs[1])]);
      cands.push({ tex: R.tex(fl), code: 'u2l4-foil-miss', hint: 'There are four products: each term of the first bracket times each term of the second (first, outer, inner, last).' });
    }
    return R.part((o.pre || '') + t(q), key, { sol: (o.solPre || '') + t(q + '=' + steps.join('=')) + (o.note ? '<br>' + o.note : ''), hints: o.hints || (A === Bs ? H_SQ : H_FOIL), text: o.text || 'expand ' + q, cands: cands, unit: o.unit, after: o.after, before: o.before });
  }
  function conjOf(list) { return [list[0], { c: [-list[1].c[0], list[1].c[1]], n: list[1].n, m: list[1].m }]; }
  /* conjugate + product (two boxes) */
  function conjPart(list, o) {
    o = o || {};
    var cj = conjOf(list), cjT = tx(cj), prod = R.sum(R.foilLines(list, cj).list), pT = R.tex(prod);
    var a2 = R.mul(list[0], list[0]), b2 = R.mul(list[1], list[1]);
    var sum2 = R.tex(R.sum([a2, b2]));
    var specs = [
      { label: 'Conjugate:', name: 'Conjugate', key: cjT, cands: [{ tex: tx(list), code: 'u2l4-conj-same', hint: 'That is the expression itself. Change the sign <b>between</b> the two terms.' }, { tex: tx([{ c: [-list[0].c[0], list[0].c[1]], n: list[0].n, m: list[0].m }, { c: [-list[1].c[0], list[1].c[1]], n: list[1].n, m: list[1].m }]), code: 'u2l4-conj-neg', hint: 'Only the sign <b>between</b> the terms changes; the first term keeps its sign.' }] },
      { label: 'Product:', name: 'Product', key: pT, cands: [{ tex: sum2, code: 'u2l4-conj-add', hint: 'The product of conjugates is a <b>difference</b> of squares: ' + t('a^{2}-b^{2}') + '.' }] }];
    var sol = 'Conjugate: ' + t(cjT) + '<br>' + t(br(list) + br(cj) + '=' + R.foilLines(list, cj).raw + '=' + pT) + ' — the middle terms cancel.';
    if (o.want !== undefined) {
      specs.forEach(function (s) { s.vars = o.vars; s.shift = o.shift; });
      specs.push({ label: 'Restriction:', name: 'Restriction', key: R.restrKey(o.want), check: R.restrCheck(o.want), vars: o.vars, none: true, ansTex: R.restrTex(o.want) });
      sol += ', &nbsp;' + t(R.restrTex(o.want));
    }
    return R.fieldsPart(t(tx(list)), specs, { sol: o.sol || sol, hints: H_CONJ, text: 'conjugate and product', bad: [[tx(list), pT].concat(o.want !== undefined ? [R.restrKey(o.want)] : [])] });
  }

  /* ---------- Q4: a product of two radicals, two different ways ---------- */
  function twoWaysCheck(C, m, other) {
    var V = C * Math.sqrt(m);
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var fz = ex.factors(a.ast), groups = [], cur = [1, 1], roots = 0;
      if (fz.den.length) return form('u2l4-two-form', 'Write it as a product of two radicals, like ' + t('\\left(2\\sqrt{3}\\right)\\left(5\\sqrt{2}\\right)') + ' (no fractions).');
      for (var i = 0; i < fz.num.length; i++) {
        var f = fz.num[i];
        if (f.t === 'num') { var rr = ex.rat(f); if (!rr) return wrong('value', null); cur = qmul(cur, rr); continue; }
        if (f.t === 'root') { var rn = ex.rat(f.n), rm = ex.rat(f.a); if (!rn || rn[0] !== 2 || !rm || rm[1] !== 1) return form('u2l4-two-form', 'Use square roots of whole numbers, like ' + t('\\left(2\\sqrt{3}\\right)\\left(5\\sqrt{2}\\right)') + '.'); groups.push({ c: qmul(cur, [fz.sign < 0 && !groups.length ? -1 : 1, 1]), m: rm[0] }); cur = [1, 1]; roots++; continue; }
        return form('u2l4-two-form', 'Write it as a product of two radicals, like ' + t('\\left(2\\sqrt{3}\\right)\\left(5\\sqrt{2}\\right)') + '.');
      }
      if (groups.length) groups[groups.length - 1].c = qmul(groups[groups.length - 1].c, cur);
      if (!ex.eq(a.val, V)) return wrong('value', 'Check by multiplying: the coefficients must multiply to ' + t(C) + ' and the radicands to ' + t(m) + '.');
      if (roots !== 2) return form('u2l4-two-form', 'Right value — now write it as a product of <b>two</b> radicals, like ' + t('\\left(2\\sqrt{3}\\right)\\left(5\\sqrt{2}\\right)') + '.');
      if (groups.some(function (g) { return g.m === 1 || !ex.simplest(g.m, 2) && Math.sqrt(g.m) % 1 === 0; })) return form('u2l4-two-form', 'Each factor needs a radical part: ' + t('\\sqrt{1}') + ' or the root of a perfect square is just a number.');
      return ok();
    };
  }
  function sigOf(resp) {
    var a = K.read(resp); if (a.res) return null; var fz = ex.factors(a.ast), cur = 1, out = [];
    fz.num.forEach(function (f) { if (f.t === 'num') cur *= f.v; else if (f.t === 'root') { out.push(cur + '|' + ex.value(f.a)); cur = 1; } });
    if (out.length) { var last = out.pop().split('|'); out.push(Number(last[0]) * cur + '|' + last[1]); }
    return out.sort().join(';');
  }
  function twoWaysPart(C, p, q) {
    var m = p * q, chk = twoWaysCheck(C, m);
    var divs = []; for (var d = 1; d <= C; d++) if (C % d === 0) divs.push(d);
    var ways = []; divs.forEach(function (d) { [[p, q], [q, p]].forEach(function (pr) { var w = '\\left(' + (d === 1 ? '' : d) + '\\sqrt{' + pr[0] + '}\\right)\\left(' + (C / d === 1 ? '' : C / d) + '\\sqrt{' + pr[1] + '}\\right)'; if (ways.indexOf(w) < 0) ways.push(w); }); });
    var k1 = ways[1], k2 = ways[2];
    var check = function (resp) {
      resp = resp || [];
      var r1 = chk(resp[0] == null ? '' : resp[0]), r2 = chk(resp[1] == null ? '' : resp[1]);
      if (r1.v !== 'correct') return { v: r1.v, code: r1.code, hint: '<b>First way:</b> ' + (r1.hint || 'Check this one again.') };
      if (r2.v !== 'correct') return { v: r2.v, code: r2.code, hint: '<b>Second way:</b> ' + (r2.hint || 'Check this one again.') };
      if (sigOf(resp[0]) === sigOf(resp[1])) return wrong('u2l4-two-same', 'Both of your products are the same. Split the coefficient or the radicand differently for the second way.');
      return ok();
    };
    return { prompt: t(C + '\\sqrt{' + m + '}'), input: { type: 'fields', fields: [{ label: 'One way:', name: 'First way', mode: 'math', keys: 'p23rad' }, { label: 'Another way:', name: 'Second way', mode: 'math', keys: 'p23rad' }] },
      check: check, key: [k1, k2], answer: 'For example ' + t(k1) + ' and ' + t(k2) + ' (any two different ways).',
      solution: 'Split the coefficient ' + t(C) + ' and the radicand ' + t(m + '=' + p + '\\times' + q) + ': e.g. ' + ways.slice(0, 4).map(function (w) { return t(w); }).join(', ') + '. Check: the coefficients multiply to ' + t(C) + ' and the radicands to ' + t(m) + '.',
      hints: ['Write ' + t(m) + ' as a product of two numbers and ' + t(C) + ' as a product of two numbers.', 'Pair them up: ' + t('(a\\sqrt{b})(c\\sqrt{d})=ac\\sqrt{bd}') + '.'], text: 'two ways as a product', bad: [[k1, k1], [C + '\\sqrt{' + m + '}', k2]], good: [[ways[0], ways[2]]] };
  }

  /* ============================== the assignment ============================== */
  var QUESTIONS = [
    { num: '1', section: 'Multiplying radicals', stem: 'Multiply and simplify.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7, 10, 11, 13], 2); return { p: pq[0], q: pq[1] }; }, function (z) { return coprime(z.p, z.q) && sqf(z.p * z.q) && z.p * z.q <= 80 && !(z.p * z.q === 35) && !(z.p * z.q === 60); }); return prodPart([S(1, o.p), S(1, o.q)]); } },
      { id: '1b', level: 'BEG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 7, 11, 13], 2); return { p: pq[0], q: pq[1], a: r.int(2, 7), b: r.int(2, 7) }; }, function (z) { return !(z.a === 3 && z.b === 5 && z.p * z.q === 14) && !(z.p * z.q === 33); }); return prodPart([S(o.a, o.p), S(o.b, o.q)]); } },
      { id: '1c', level: 'EMG', make: function (r) { var z = pairShare(r, { xy: [1, 3, 5, 7, 11], ok: function (z) { return (z.x === 1 || z.y === 1) && !(z.s === 2 && z.x * z.y === 7); } }), a = r.int(2, 5), b = r.int(2, 5); return prodPart([S(-a, z.s * z.x), S(b, z.s * z.y)]); } },
      { id: '1d', level: 'EMG', make: function (r) { var o = pickWhere(function () { var uv = r.sample([1, 2, 3, 4], 2); return { s: r.pick([2, 3, 5, 6]), u: uv[0], v: uv[1] }; }, function (z) { return z.s * z.u * z.u <= 60 && z.s * z.v * z.v <= 80 && !(z.s === 2 && z.u * z.v === 6) && !(z.s === 3 && z.u * z.v === 6); }); return prodPart([S(1, o.s * o.u * o.u), S(1, o.s * o.v * o.v)], { note: 'Or simplify first: ' + t(R.tex([T(1, 2, o.s * o.u * o.u)]) + '\\cdot ' + R.tex([T(1, 2, o.s * o.v * o.v)])) + '.' }); } },
      { id: '1e', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7, 10]), a: r.int(2, 6), b: r.int(2, 6) }; }, function (z) { return !(z.m === 6 && z.a * z.b === 10); }); return prodPart([S(o.a, o.m), S(o.b, o.m)], { hints: ['Multiply the coefficients and the radicands: ' + t('\\sqrt{' + o.m + '}\\cdot\\sqrt{' + o.m + '}=\\sqrt{' + o.m * o.m + '}=' + o.m) + '.'] }); } },
      { id: '1f', level: 'EMG', make: function (r) { var z = pairShare(r, { s: [5, 3, 2], xy: [2, 3, 7, 11] }); return prodPart([S(r.int(2, 5), z.s * z.x), S(-1, z.s * z.y)]); } },
      { id: '1g', level: 'PRG', make: function (r) { var z = pairShare(r, { s: [7, 5, 11, 3], xy: [2, 3, 5, 7], ok: function (z) { return z.s * z.x * z.s * z.y > 100 && !(z.s === 7 && z.x * z.y === 15); } }); return prodPart([S(r.int(2, 4), z.s * z.x), S(1, z.s * z.y)]); } },
      { id: '1h', level: 'EMG', make: function (r) { var o = pickWhere(function () { var uv = r.sample([2, 3, 4, 5], 2); return { s: r.pick([2, 3, 5, 6, 7]), u: uv[0], v: uv[1] }; }, function (z) { return z.s * z.v * z.v <= 150 && z.s * z.u * z.u <= 150 && !(z.s === 5 && z.u * z.v === 6) && !(z.s === 3 && z.u * z.v === 6); }); return prodPart([S(1, o.s * o.u * o.u), S(1, o.s * o.v * o.v)], { note: 'Or simplify first: ' + t(R.tex([T(1, 2, o.s * o.u * o.u)]) + '\\cdot ' + R.tex([T(1, 2, o.s * o.v * o.v)]) + '=' + (o.u * o.v * o.s)) + '.' }); } },
      { id: '1i', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7, 11]), a: r.int(2, 6), b: r.int(2, 6) }; }, function (z) { return !(z.m === 7 && z.a * z.b === 6); }); return prodPart([S(-o.a, o.m), S(-o.b, o.m)], { hints: ['A negative times a negative is positive.', t('\\sqrt{' + o.m + '}\\cdot\\sqrt{' + o.m + '}=' + o.m) + '.'] }); } },
      { id: '1j', level: 'EMG', make: function (r) { var pr = r.pick([[2, 4], [3, 9], [4, 16], [2, 32], [5, 25], [4, 54], [6, 36], [9, 24], [12, 18], [9, 81], [3, 72]]); if (r.int(0, 1)) pr = [pr[1], pr[0]]; return prodPart([raw(1, 3, pr[0]), raw(1, 3, pr[1])], { hints: ['Same index: multiply the radicands, ' + t('\\sqrt[3]{a}\\cdot\\sqrt[3]{b}=\\sqrt[3]{ab}') + '.', 'Is the product a perfect cube?'] }); } },
      { id: '1k', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: r.pick([2, 3, 4, 5, 6, 9, 10]), q: r.pick([2, 3, 4, 5, 6, 10, 12, 15, 20, 25]), a: r.int(2, 5) }; }, function (z) { var M = z.p * z.q; return z.p !== z.q && ex.nthFactor(M, 3) > 1 && M / Math.pow(ex.nthFactor(M, 3), 3) > 1 && ex.simplest(z.p, 3) && ex.simplest(z.q, 3) && M <= 200 && !(z.p === 2 && z.q === 20); }); return prodPart([raw(o.a, 3, o.p), raw(-1, 3, o.q)], { hints: ['Multiply the coefficients and the radicands, then take out a perfect cube (' + t('8,\\ 27,\\ 64,\\ 125') + ').'] }); } },
      { id: '1l', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: r.pick([2, 3, 4, 6, 8, 12, 24, 27]), q: r.pick([2, 3, 4, 5, 6, 8, 10, 12]), a: r.int(2, 4) }; }, function (z) { var M = z.p * z.q; return z.p !== z.q && ex.nthFactor(M, 4) > 1 && M / Math.pow(ex.nthFactor(M, 4), 4) > 1 && ex.simplest(z.p, 4) && ex.simplest(z.q, 4) && !(z.p === 8 && z.q === 6) && M <= 400; }); return prodPart([raw(o.a, 4, o.p), raw(1, 4, o.q)], { hints: ['Multiply, then look for a perfect fourth power (' + t('16,\\ 81') + ') under the root.'] }); } }] },
    { num: '2', section: 'Powers of radicals', stem: 'Simplify.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { var m = pickWhere(function () { return r.pick([2, 3, 5, 6, 10, 11, 13, 14, 15, 17]); }, function (m) { return m !== 7 && m !== 11; }); return powPart(r, { c: 1, m: m }); } },
      { id: '2b', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { c: r.int(2, 7), m: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return !(z.c === 5 && z.m === 3) && !(z.c === 3 && z.m === 2); }); return powPart(r, o); } },
      { id: '2c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { c: r.int(2, 6), m: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return !(z.c === 2 && z.m === 6) && !(z.c === 4 && z.m === 5); }); o.negOut = true; return powPart(r, o); } },
      { id: '2d', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { c: -r.int(2, 6), m: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return !(z.c === -2 && z.m === 3); }); return powPart(r, o); } },
      { id: '2e', level: 'BEG', make: function (r) { var m = r.pick([2, 3, 5, 6, 7, 9, 10, 11]); return powPart(r, { c: 1, m: m, n: 3 }); } },
      { id: '2f', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { c: r.int(2, 4), m: r.pick([2, 3, 4, 5, 6, 7]), n: 3 }; }, function (z) { return !(z.c === 2 && (z.m === 3 || z.m === 5)); }); return powPart(r, o); } }] },
    { num: '3', section: 'Products of three radicals', stem: 'Multiply and simplify.', parts: [
      { id: '3a', level: 'EMG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 7], 2); return { p: pq[0], q: pq[1] }; }, function (z) { return !(z.p * z.q === 6); }); return prodPart(r.shuffle([S(1, o.p), S(1, o.q), S(1, o.p * o.q)])); } },
      { id: '3b', level: 'PRG', make: function (r) { var o = pickWhere(function () { var uvw = r.sample([2, 3, 5, 7], 3); return { u: uvw[0], v: uvw[1], w: uvw[2], a: r.int(2, 4), b: r.int(2, 4) }; }, function (z) { return !(z.u * z.v * z.w === 30 && z.a * z.b === 6); }); return prodPart([S(o.a, o.u * o.v), S(-1, o.v * o.w), S(o.b, o.u * o.w)]); } },
      { id: '3c', level: 'PRG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5], 2); return { p: pq[0], q: pq[1], a: r.int(2, 4), b: r.int(2, 5), f: r.int(2, 3) }; }, function (z) { return !(z.p === 3 && z.q === 2 && z.a === 2 && z.b === 4); }); return prodPart([S(1, o.p), S(o.a, o.p * o.q), S(o.b, o.f * o.f * o.q)], { hints: ['Multiply all the coefficients, and all the radicands; then simplify.', 'Or simplify ' + t('\\sqrt{' + o.f * o.f * o.q + '}') + ' first to keep the numbers small.'] }); } },
      { id: '3d', level: 'PRG', make: function (r) { var o = pickWhere(function () { var k = r.pick([6, 10, 12, 15]); var pr = { 6: [[4, 6, 9], [2, 12, 9], [3, 8, 9], [4, 3, 18]], 10: [[4, 10, 25], [2, 20, 25], [5, 8, 25]], 12: [[4, 9, 48], [6, 12, 24], [3, 16, 36]], 15: [[9, 15, 25], [3, 25, 45]] }[k]; return { k: k, f: r.pick(pr) }; }, function (z) { return !(z.k === 6 && z.f[0] === 4 && z.f[1] === 6); }); return prodPart(r.shuffle(o.f.map(function (m) { return raw(1, 3, m); })), { hints: ['Multiply the three radicands under one cube root.', 'Is the product a perfect cube?'] }); } }] },
    { num: '4', section: 'Splitting a product', stem: 'Write each as a product of two mixed radicals in two different ways.', parts: [
      { id: '4a', level: 'PRG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 7], 2); return { C: r.pick([6, 8, 10, 12, 15]), p: pq[0], q: pq[1] }; }, function (z) { return !(z.C === 10 && z.p * z.q === 6) && !(z.C === 6 && z.p * z.q === 15); }); return twoWaysPart(o.C, o.p, o.q); } },
      { id: '4b', level: 'ADV', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 7, 11], 2); return { C: r.pick([18, 20, 24, 28, 30, 36]), p: pq[0], q: pq[1] }; }, function (z) { return !(z.C === 24 && z.p * z.q === 15); }); return twoWaysPart(o.C, o.p, o.q); } }] },
    { num: '5', section: 'Multiplying radicals with variables', stem: 'Multiply and simplify. State the restrictions on the variables.', parts: [
      { id: '5a', level: 'EMG', make: function (r) {
        var vs = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]), o = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 6) }; }, function (z) { return !(z.a === 4 && z.b === 2) && !(z.a === 3 && z.b === 5); });
        var q = '\\left(' + o.a + '\\sqrt{' + vs[0] + '}\\right)\\left(' + o.b + '\\sqrt{' + vs[1] + '}\\right)', key = (o.a * o.b) + '\\sqrt{' + vs[0] + vs[1] + '}', w = {}; w[vs[0]] = 0; w[vs[1]] = 0;
        return R.partR(t(q), key, w, { vars: vs, text: 'product with two variables', sol: t(q + '=' + key) + ', &nbsp;' + t(R.restrTex(w)), hints: H_MUL.concat(['Square roots: state each variable ' + t('\\ge 0') + '.']),
          cands: [{ tex: (o.a + o.b) + '\\sqrt{' + vs[0] + vs[1] + '}', code: 'u2l4-add-coef', hint: 'Multiply the coefficients: ' + t(o.a + '\\times' + o.b) + '.' }] });
      } },
      { id: '5b', level: 'PRG', make: function (r) {
        var v = r.pick(['x', 'a', 'y']), o = pickWhere(function () { var uv = r.sample([1, 2, 3, 4], 2); return { s: r.pick([2, 3, 5, 6]), u: uv[0], v: uv[1] }; }, function (z) { return z.s * z.u * z.u <= 50 && z.s * z.v * z.v <= 50 && !(z.s === 3 && z.u * z.v === 2); });
        var p = o.s * o.u * o.u, qv2 = o.s * o.v * o.v, k = o.s * o.u * o.v, q = '\\left(\\sqrt{' + p + v + '}\\right)\\left(\\sqrt{' + qv2 + v + '}\\right)', key = k + v, w = {}; w[v] = 0;
        return R.partR(t(q), key, w, { vars: [v], text: 'product gives a perfect square', sol: t(q + '=\\sqrt{' + p * qv2 + v + '^{2}}=' + key) + ', &nbsp;' + t(v + '\\ge 0'), hints: H_MUL,
          cands: [{ tex: k + '\\sqrt{' + v + '}', code: 'var-exp', hint: t('\\sqrt{' + v + '}\\cdot\\sqrt{' + v + '}=\\sqrt{' + v + '^{2}}=' + v) + ': no radical is left.' }] });
      } },
      { id: '5c', level: 'PRG', make: function (r) {
        var v = r.pick(['y', 'x', 'b']), o = pickWhere(function () { return { p: r.pick([2, 3, 5, 6, 7]), q: r.pick([2, 3, 5, 6, 10, 15]), a: r.int(2, 4), b: r.int(2, 4) }; }, function (z) { var M = z.p * z.q; return z.p !== z.q && ex.nthFactor(M, 2) > 1 && M / Math.pow(ex.nthFactor(M, 2), 2) > 1 && !(z.p === 5 && z.q === 10 && z.a === 2 && z.b === 3); });
        var M = o.p * o.q, f = ex.nthFactor(M, 2), s = M / (f * f), C = o.a * o.b * f, w = {}; w[v] = 0;
        var q = '\\left(' + o.a + '\\sqrt{' + o.p + v + '^{3}}\\right)\\left(' + o.b + '\\sqrt{' + o.q + v + '}\\right)', key = C + v + '^{2}\\sqrt{' + s + '}';
        return R.partR(t(q), key, w, { vars: [v], text: 'product with y³', sol: t(q + '=' + (o.a * o.b) + '\\sqrt{' + M + v + '^{4}}=' + (o.a * o.b) + '\\sqrt{' + f * f + v + '^{4}}\\sqrt{' + s + '}=' + key) + ', &nbsp;' + t(v + '\\ge 0'), hints: H_MUL.concat([t(v + '^{3}\\cdot ' + v + '=' + v + '^{4}') + ', and ' + t('\\sqrt{' + v + '^{4}}=' + v + '^{2}') + '.']),
          cands: [{ tex: C + v + '\\sqrt{' + s + v + '^{2}}', code: 'not-simplest-var', hint: 'Take ' + t(v + '^{4}') + ' out completely: ' + t('\\sqrt{' + v + '^{4}}=' + v + '^{2}') + '.' }] });
      } },
      { id: '5d', level: 'PRG', make: function (r) {
        var v = r.pick(['n', 'm', 'x']), pr = r.pick([[2, 4, 8, 1], [3, 9, 27, 1], [4, 6, 8, 3], [2, 12, 8, 3], [3, 18, 27, 2], [5, 10, 125, 0.4], [9, 6, 27, 2]]);
        var M = pr[0] * pr[1], f = ex.nthFactor(M, 3), s = M / Math.pow(f, 3);
        var q = '\\left(\\sqrt[3]{' + pr[0] + v + '^{2}}\\right)\\left(\\sqrt[3]{' + pr[1] + v + '^{2}}\\right)', key = (f === 1 ? '' : f) + v + '\\sqrt[3]{' + (s === 1 ? '' : s) + v + '}';
        return R.partR(t(q), key, null, { vars: [v], text: 'cube roots with a variable', sol: t(q + '=\\sqrt[3]{' + M + v + '^{4}}=\\sqrt[3]{' + Math.pow(f, 3) + v + '^{3}}\\sqrt[3]{' + (s === 1 ? '' : s) + v + '}=' + key) + '; no restriction (cube roots).', hints: ['Multiply the radicands; ' + t(v + '^{2}\\cdot ' + v + '^{2}=' + v + '^{4}') + '.', 'Take out the perfect cube, including ' + t(v + '^{3}') + '. Cube roots need no restriction.'] });
      } },
      { id: '5e', level: 'PRG', make: function (r) {
        var v = r.pick(['x', 'a']), o = pickWhere(function () { return { p: r.pick([2, 3, 5, 6, 10]), q: r.pick([2, 3, 5, 6, 10, 15]) }; }, function (z) { var M = z.p * z.q; return ex.nthFactor(M, 2) > 1 && M / Math.pow(ex.nthFactor(M, 2), 2) > 1 && !(z.p === 6 && z.q === 2); });
        var M = o.p * o.q, f = ex.nthFactor(M, 2), s = M / (f * f), w = {}; w[v] = 0;
        var q = '\\left(\\sqrt{' + o.p + v + '}\\right)\\left(\\sqrt{' + o.q + v + '^{2}}\\right)', key = f + v + '\\sqrt{' + s + v + '}';
        return R.partR(t(q), key, w, { vars: [v], text: 'product with x³', sol: t(q + '=\\sqrt{' + M + v + '^{3}}=\\sqrt{' + f * f + v + '^{2}}\\sqrt{' + s + v + '}=' + key) + ', &nbsp;' + t(v + '\\ge 0'), hints: H_MUL });
      } },
      { id: '5f', level: 'EMG', make: function (r) {
        var h = pickWhere(function () { return r.int(1, 9); }, function (h) { return h !== 3; }), sgn = r.int(0, 1) ? 1 : -1, rad = 'x' + (sgn > 0 ? '+' : '-') + h;
        return R.partR(t('\\left(\\sqrt{' + rad + '}\\right)^{2}'), rad, { x: -sgn * h }, { vars: ['x'], shift: { x: h + 0.5 }, text: '(√(x + h))²', sol: t('\\left(\\sqrt{' + rad + '}\\right)^{2}=' + rad) + ', &nbsp;' + t(rad + '\\ge 0') + ', so ' + t('x\\ge ' + (-sgn * h)),
          hints: [t('\\left(\\sqrt{a}\\right)^{2}=a') + ' for ' + t('a\\ge 0') + '.', 'Restriction: the radicand ' + t(rad) + ' must be ' + t('\\ge 0') + '.'], rHint: 'The radicand is ' + t(rad) + '.',
          cands: [{ tex: 'x^{2}' + (sgn > 0 ? '+' : '-') + (h * h), code: 'u2l4-rad-sq', hint: 'Squaring a square root undoes it: ' + t('\\left(\\sqrt{' + rad + '}\\right)^{2}=' + rad) + '. Don’t square the terms inside.' }] });
      } }] },
    { num: '6', section: 'Distributing a radical', stem: 'Expand and simplify.', parts: [
      { id: '6a', level: 'EMG', make: function (r) { var z = pairShare(r, { s: [2, 3], xy: [1, 3, 5, 7] , ok: function (z) { return z.x === 1 && !(z.s === 2 && z.y === 3); } }), c = r.int(2, 7); return distPart(S(1, z.s), [S(1, z.s * z.y), N(r.int(0, 1) ? c : -c)]); } },
      { id: '6b', level: 'EMG', make: function (r) { var o = pickWhere(function () { var mq = r.sample([2, 3, 5, 7], 2); return { m: mq[0], q: mq[1], a: r.int(2, 4), b: r.int(2, 4) }; }, function (z) { return !(z.m === 5 && z.q === 3 && z.a === 3 && z.b === 2); }); return distPart(S(o.a, o.m), [S(o.b, o.m), S(1, o.q)]); } },
      { id: '6c', level: 'PRG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5], 2); return { p: pq[0], q: pq[1], c: r.int(2, 4) }; }, function (z) { return !(z.p * z.q === 6 && z.c === 2); }); var a = o.p * o.q; return distPart(S(-1, a), [S(1, o.p), S(-o.c, o.q)]); } },
      { id: '6d', level: 'ADV', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5]), a: r.int(2, 3), f: r.int(2, 3), g: r.int(2, 4), c: r.int(2, 5), q: r.pick([2, 3, 5]) }; }, function (z) { return z.q !== z.m && z.f !== z.g && !(z.m === 3 && z.a === 2 && z.c === 4); }); return distPart(S(o.a, o.m), [S(1, o.f * o.f * o.m), S(-o.c, o.m * o.q), S(1, o.g * o.g * o.m)], { text: 'distribute over three terms' }); } },
      { id: '6e', level: 'PRG', make: function (r) {
        var vs = r.pick([['x', 'y'], ['a', 'b']]), c = r.int(2, 6), sg = r.int(0, 1) ? '-' : '+', x = vs[0], y = vs[1];
        var q = '\\sqrt{' + x + '}\\left(' + c + '\\sqrt{' + x + '}' + sg + '\\sqrt{' + y + '}\\right)', key = c + x + sg + '\\sqrt{' + x + y + '}', w = {}; w[x] = 0; w[y] = 0;
        return R.partR(t(q), key, w, { vars: vs, text: 'distribute with variables', sol: t(q + '=' + c + '\\left(\\sqrt{' + x + '}\\right)^{2}' + sg + '\\sqrt{' + x + y + '}=' + key) + ', &nbsp;' + t(R.restrTex(w)),
          hints: ['Multiply ' + t('\\sqrt{' + x + '}') + ' by each term; ' + t('\\left(\\sqrt{' + x + '}\\right)^{2}=' + x) + '.', 'Square roots: state each variable ' + t('\\ge 0') + '.'],
          cands: [{ tex: c + '\\sqrt{' + x + '}' + sg + '\\sqrt{' + x + y + '}', code: 'u2l4-rad-sq', hint: t('\\sqrt{' + x + '}\\cdot\\sqrt{' + x + '}=' + x) + ' — no radical is left in that term.' }] });
      } },
      { id: '6f', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.pick([2, 3, 4]), p: r.pick([2, 4, 9, 3]), q: r.pick([4, 12, 6, 9, 18, 20]), c: r.int(2, 4) }; }, function (z) { var A = z.a * z.p, Bq = z.a * z.q; return ex.simplest(z.a, 3) && ex.simplest(z.p, 3) && ex.simplest(z.q, 3) && Math.round(Math.cbrt(A)) ** 3 === A && ex.nthFactor(Bq, 3) > 1 && Bq / Math.pow(ex.nthFactor(Bq, 3), 3) > 1 && !(z.a === 2 && z.p === 4 && z.q === 12); }); return distPart(raw(1, 3, o.a), [raw(1, 3, o.p), raw(o.c, 3, o.q)], { text: 'distribute a cube root' }); } }] },
    { num: '7', section: 'Multiplying binomials', stem: 'Expand and simplify.', parts: [
      { id: '7a', level: 'EMG', make: function (r) { var o = pickWhere(function () { var ab = r.sample([1, 2, 3, 4, 5, 6], 2); return { m: r.pick([2, 3, 5, 6, 7]), a: ab[0], b: ab[1] }; }, function (z) { return !(z.m === 3 && z.a * z.b === 8); }); return foilPart([N(o.a), S(1, o.m)], [N(o.b), S(1, o.m)]); } },
      { id: '7b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(2, 7), b: r.int(2, 4), c: r.int(1, 3) }; }, function (z) { return !(z.m === 2 && z.a === 5 && z.b === 3 && z.c === 1); }); return foilPart([N(o.a), S(-1, o.m)], [N(o.c), S(o.b, o.m)]); } },
      { id: '7c', level: 'PRG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7], 2); return { p: pq[0], q: pq[1], a: r.int(2, 3), b: r.int(2, 4) }; }, function (z) { return sqf(z.p * z.q) && !(z.p === 6 && z.q === 5) && !(z.p === 3 && z.q === 5 && z.a === 2); }); return foilPart([S(1, o.p), S(o.a, o.q)], [S(o.b, o.p), S(-1, o.q)]); } },
      { id: '7d', level: 'ADV', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5], 2); return { p: pq[0], q: pq[1], a: r.int(2, 4), b: r.int(2, 3) }; }, function (z) { return !(z.p === 2 && z.q === 3 && z.a === 3 && z.b === 2); }); return foilPart([S(o.a, o.p), S(-1, o.p * o.q)], [S(1, o.q), S(o.b, o.p)], { note: 'No like radicals are left to collect.' }); } },
      { id: '7e', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 7), b: r.int(1, 7) }; }, function (z) { return z.a !== z.b && !(z.a === 4 && z.b === 1); });
        var q = '\\left(\\sqrt{x}+' + o.a + '\\right)\\left(\\sqrt{x}-' + o.b + '\\right)', k = o.a - o.b, key = 'x' + (k > 0 ? '+' + (k === 1 ? '' : k) : '-' + (k === -1 ? '' : -k)) + '\\sqrt{x}-' + (o.a * o.b);
        return R.partR(t(q), key, { x: 0 }, { vars: ['x'], text: 'binomials with √x', sol: t(q + '=x-' + o.b + '\\sqrt{x}+' + o.a + '\\sqrt{x}-' + (o.a * o.b) + '=' + key) + ', &nbsp;' + t('x\\ge 0'), hints: H_FOIL,
          cands: [{ tex: 'x-' + o.a * o.b, code: 'u2l4-foil-miss', hint: 'There are four products: the outer and inner ones give the ' + t('\\sqrt{x}') + ' terms.' }] });
      } }] },
    { num: '8', stem: 'Expand and simplify.', parts: [
      { id: '8a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7, 10, 11]), a: r.int(1, 6) }; }, function (z) { return !(z.m === 7 && z.a === 2) && !(z.m === 5 && z.a === 3); }); var A = [S(1, o.m), N(-o.a)]; return foilPart(A, A); } },
      { id: '8b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(1, 6), b: r.int(2, 4) }; }, function (z) { return !(z.m === 5 && z.a === 3 && z.b === 2); }); var A = [N(o.a), S(o.b, o.m)]; return foilPart(A, A); } },
      { id: '8c', level: 'PRG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7, 10], 2); return { p: pq[0], q: pq[1], a: r.int(2, 4) }; }, function (z) { var M = z.p * z.q; return !sqf(M) && M / Math.pow(ex.nthFactor(M, 2), 2) > 1 && !(z.p === 2 && z.q === 6 && z.a === 4) && !(z.p === 7 && z.q === 3); }); var A = [S(o.a, o.p), S(-1, o.q)]; return foilPart(A, A); } },
      { id: '8d', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7, 10], 2); return { p: pq[0], q: pq[1], k: r.int(2, 3) }; }, function (z) { var M = z.p * z.q; return !sqf(M) && M / Math.pow(ex.nthFactor(M, 2), 2) > 1 && !(z.p * z.q === 50); });
        var A = [S(1, o.p), S(1, o.q)], lines = R.foilLines(A, A), inner = R.sum(lines.list), key = R.tex(R.sum(inner.map(function (u) { return T(qmul(u.c, [o.k, 1]), u.n, u.m); })));
        var q = o.k + br(A) + '^{2}';
        return R.part(t(q), key, { text: 'k(√p + √q)²', sol: t(q + '=' + o.k + '\\left(' + lines.raw + '\\right)=' + o.k + '\\left(' + R.tex(inner) + '\\right)=' + key), hints: ['Square the binomial first (it has a middle term), then multiply every term by ' + t(o.k) + '.'],
          cands: [{ tex: R.tex(R.sum(inner.map(function (u) { return T(qmul(u.c, [o.k * o.k, 1]), u.n, u.m); }))), code: 'u2l4-sq-coef', hint: 'Only the brackets are squared, not the ' + t(o.k) + ' in front.' },
            { tex: String(o.k * (o.p + o.q)), code: 'u2l4-no-middle', hint: t('(a+b)^{2}\\ne a^{2}+b^{2}') + ': there is a middle term ' + t('2ab') + '.' }] });
      } },
      { id: '8e', level: 'PRG', make: function (r) {
        var vs = r.pick([['a', 'b'], ['x', 'y']]), x = vs[0], y = vs[1], c = r.int(2, 5), sg = r.int(0, 1) ? '+' : '-';
        var q = '\\left(' + c + '\\sqrt{' + x + '}' + sg + '\\sqrt{' + y + '}\\right)^{2}', key = (c * c) + x + sg + (2 * c) + '\\sqrt{' + x + y + '}+' + y, w = {}; w[x] = 0; w[y] = 0;
        return R.partR(t(q), key, w, { vars: vs, text: 'square of a binomial with variables', sol: t(q + '=\\left(' + c + '\\sqrt{' + x + '}\\right)^{2}' + sg + '2\\left(' + c + '\\sqrt{' + x + '}\\right)\\left(\\sqrt{' + y + '}\\right)+\\left(\\sqrt{' + y + '}\\right)^{2}=' + key) + ', &nbsp;' + t(R.restrTex(w)), hints: H_SQ,
          cands: [{ tex: (c * c) + x + '+' + y, code: 'u2l4-no-middle', hint: t('(a+b)^{2}\\ne a^{2}+b^{2}') + ': there is a middle term.' }, { tex: (c * c) + x + sg + c + '\\sqrt{' + x + y + '}+' + y, code: 'u2l4-middle-once', hint: 'The middle term is ' + t('2ab') + ': it appears twice when you expand.' }] });
      } }] },
    { num: '9', section: 'Conjugates', stem: 'Write the conjugate of the expression, then multiply the expression by its conjugate.', parts: [
      { id: '9a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7, 10, 11, 13]), a: r.int(1, 5) }; }, function (z) { return z.a * z.a !== z.m && !(z.m === 7 && z.a === 2) && !(z.m === 11 && z.a === 3); }); return conjPart([S(1, o.m), N(-o.a)]); } },
      { id: '9b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(2, 9) }; }, function (z) { return !(z.m === 2 && z.a === 5); }); return conjPart([N(o.a), S(1, o.m)]); } },
      { id: '9c', level: 'PRG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7], 2); return { p: pq[0], q: pq[1], a: r.int(2, 4), b: r.int(2, 4) }; }, function (z) { return !(z.p === 7 && z.q === 2) && !(z.p === 2 && z.q === 5 && z.a === 3); }); return conjPart([S(o.a, o.p), S(o.b, o.q)]); } },
      { id: '9d', level: 'PRG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7, 10, 11, 13, 14, 15], 2); return { p: Math.max(pq[0], pq[1]), q: Math.min(pq[0], pq[1]) }; }, function (z) { return !(z.p === 15 && z.q === 6) && !(z.p === 6 && z.q === 2); }); return conjPart([S(1, o.p), S(-1, o.q)]); } },
      { id: '9e', level: 'PRG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7], 2); return { p: pq[0], q: pq[1], a: r.int(2, 4), b: r.int(2, 4) }; }, function (z) { return z.a * z.a * z.p < z.b * z.b * z.q && !(z.p === 2 && z.q === 5 && z.a === 3 && z.b === 2); }); return conjPart([S(o.a, o.p), S(-o.b, o.q)], {}); } },
      { id: '9f', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 9) }; }, function (z) { return !(z.a === 2 && z.b === 5) && !(z.a === 1 && z.b === 4); }), x = 'x';
        var e = o.a + '\\sqrt{x}+' + o.b, cj = o.a + '\\sqrt{x}-' + o.b, pT = (o.a * o.a) + 'x-' + (o.b * o.b);
        return R.fieldsPart(t(e) + '. State the restriction.', [
          { label: 'Conjugate:', name: 'Conjugate', key: cj, vars: ['x'], cands: [{ tex: e, code: 'u2l4-conj-same', hint: 'Change the sign between the two terms.' }, { tex: '-' + o.a + '\\sqrt{x}-' + o.b, code: 'u2l4-conj-neg', hint: 'Only the sign between the terms changes.' }] },
          { label: 'Product:', name: 'Product', key: pT, vars: ['x'], cands: [{ tex: o.a + 'x-' + (o.b * o.b), code: 'u2l4-conj-sq', hint: 'Square the coefficient too: ' + t('\\left(' + o.a + '\\sqrt{x}\\right)^{2}=' + (o.a * o.a) + 'x') + '.' }, { tex: (o.a * o.a) + 'x+' + (o.b * o.b), code: 'u2l4-conj-add', hint: 'Conjugates multiply to a <b>difference</b> of squares.' }] },
          { label: 'Restriction:', name: 'Restriction', key: 'x\\ge 0', check: R.restrCheck({ x: 0 }), vars: ['x'], none: true, ansTex: 'x\\ge 0' }],
          { text: 'conjugate with a variable', sol: 'Conjugate: ' + t(cj) + '<br>' + t('\\left(' + e + '\\right)\\left(' + cj + '\\right)=\\left(' + o.a + '\\sqrt{x}\\right)^{2}-' + o.b + '^{2}=' + pT) + ', &nbsp;' + t('x\\ge 0'), hints: H_CONJ, bad: [[e, pT, 'x\\ge 0']] });
      } }] },
    { num: '10', parts: [
      { id: '10a', level: 'PRG', make: function (r, sh) {
        var A = [S(1, sh.p), S(1, sh.q)], cj = conjOf(A), conjP = R.tex(R.sum(R.foilLines(A, cj).list)), sqP = R.tex(R.sum(R.foilLines(A, A).list));
        return R.fieldsPart('Expand ' + t(br(A) + br(cj)) + ' and ' + t(br(A) + '^{2}') + '.', [
          { label: t(br(A) + br(cj) + '='), name: 'Conjugate product', key: conjP, cands: [{ tex: String(sh.p + sh.q), code: 'u2l4-conj-add', hint: 'The product of conjugates is a <b>difference</b>: ' + t('a^{2}-b^{2}') + '.' }] },
          { label: t(br(A) + '^{2}='), name: 'Square', key: sqP, cands: [{ tex: String(sh.p + sh.q), code: 'u2l4-no-middle', hint: t('(a+b)^{2}\\ne a^{2}+b^{2}') + ': there is a middle term ' + t('2ab') + '.' }] }],
          { text: 'conjugate product vs square', sol: t(br(A) + br(cj) + '=' + R.foilLines(A, cj).raw + '=' + conjP) + '<br>' + t(br(A) + '^{2}=' + R.foilLines(A, A).raw + '=' + R.foilLines(A, A).simp + '=' + sqP), hints: H_FOIL });
      } },
      { id: '10b', level: 'PRG', make: function (r, sh) {
        var A = [S(1, sh.p), S(1, sh.q)], cj = conjOf(A);
        return R.mcPart(r, 'Which of the two products in (a) is rational, and why?', [
          { html: t(br(A) + br(cj)) + ': the two middle terms are opposites and cancel, and squaring each term removes the radicals.', right: true },
          { html: t(br(A) + '^{2}') + ': squaring always removes the radicals.', why: 'Expand it: the middle terms are <b>equal</b> and add, so a radical term is left.' },
          { html: 'Both: every product of radicals is rational.', why: t('\\sqrt{2}\\cdot\\sqrt{3}=\\sqrt{6}') + ' is irrational. Look at the middle terms of each expansion.' },
          { html: t(br(A) + br(cj)) + ': because its terms are all positive.', why: 'The reason is the middle terms: in the conjugate product they are opposites and cancel.' }],
          'With conjugates the middle terms are opposites and cancel, leaving ' + t(sh.p + '-' + sh.q + '=' + (sh.p - sh.q)) + '. In the square they are equal and add, so a radical term remains.', H_CONJ, 'which is rational and why');
      } },
      { id: '10c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(2, 5), b: r.int(2, 5), p: r.pick([2, 3, 5]), q: r.pick([7, 10, 11]) }; }, function (z) { return !(z.m === 3 && z.a === 2 && z.b === 5); });
        return R.mcPart(r, 'Which two irrational numbers have a <b>rational</b> product?', [
          { html: t(o.a + '\\sqrt{' + o.m + '}') + ' and ' + t(o.b + '\\sqrt{' + o.m + '}'), right: true },
          { html: t('\\sqrt{' + o.p + '}') + ' and ' + t('\\sqrt{' + o.q + '}'), why: t('\\sqrt{' + o.p + '}\\cdot\\sqrt{' + o.q + '}=\\sqrt{' + o.p * o.q + '}') + ', which is irrational.' },
          { html: t('\\sqrt{' + o.m + '}+1') + ' and ' + t('\\sqrt{' + o.m + '}+1'), why: 'That is a square: ' + t('\\left(\\sqrt{' + o.m + '}+1\\right)^{2}=' + (o.m + 1) + '+2\\sqrt{' + o.m + '}') + ', irrational.' },
          { html: t('\\sqrt{' + o.p + '}') + ' and ' + t(o.a + '\\sqrt{' + o.p * o.q + '}'), why: t('\\sqrt{' + o.p + '}\\cdot ' + o.a + '\\sqrt{' + o.p * o.q + '}=' + o.a * o.p + '\\sqrt{' + o.q + '}') + ', irrational.' }],
          t(o.a + '\\sqrt{' + o.m + '}\\cdot ' + o.b + '\\sqrt{' + o.m + '}=' + o.a * o.b + '(' + o.m + ')=' + o.a * o.b * o.m) + ', which is rational.', ['Multiply each pair. When are the radicals gone?'], 'irrationals with a rational product');
      } },
      { id: '10d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 7], 2); return { p: pq[0], q: pq[1], m: r.pick([3, 5, 6]), a: r.int(2, 4), k: r.int(2, 4) }; }, function (z) { return z.k * z.k !== z.m; });
        return R.mcPart(r, 'Which two irrational numbers have an <b>irrational</b> product?', [
          { html: t('\\sqrt{' + o.p + '}') + ' and ' + t('\\sqrt{' + o.q + '}'), right: true },
          { html: t('\\sqrt{' + o.m + '}') + ' and ' + t(o.a + '\\sqrt{' + o.m + '}'), why: t('\\sqrt{' + o.m + '}\\cdot ' + o.a + '\\sqrt{' + o.m + '}=' + o.a * o.m) + ', rational.' },
          { html: t('\\sqrt{' + o.m + '}+' + o.k) + ' and ' + t('\\sqrt{' + o.m + '}-' + o.k), why: 'Conjugates: ' + t(o.m + '-' + o.k * o.k + '=' + (o.m - o.k * o.k)) + ', rational.' },
          { html: t('\\sqrt{' + o.p + '}') + ' and ' + t('\\sqrt{' + o.p * o.k * o.k + '}'), why: t('\\sqrt{' + o.p * o.p * o.k * o.k + '}=' + o.p * o.k) + ', rational.' }],
          t('\\sqrt{' + o.p + '}\\cdot\\sqrt{' + o.q + '}=\\sqrt{' + o.p * o.q + '}') + ', and ' + t(o.p * o.q) + ' is not a perfect square, so the product is irrational.', ['Multiply each pair and simplify.'], 'irrationals with an irrational product');
      } }],
      shared: function (r) { return pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7, 10, 11], 2); return { p: Math.max(pq[0], pq[1]), q: Math.min(pq[0], pq[1]) }; }, function (z) { var M = z.p * z.q; return !(z.p === 6 && z.q === 2) && M / Math.pow(ex.nthFactor(M, 2), 2) > 1; }); } },
    { num: '11', section: 'Area problems', stem: 'Determine the area of the figure in simplest form. Dimensions are in metres.', parts: [
      { id: '11a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { w: r.pick([2, 3, 5, 6, 10]), p: r.pick([2, 3, 5, 6]), q: r.pick([2, 3, 5, 10, 15]), a: r.int(2, 4) }; }, function (z) { return z.p !== z.q && z.p !== z.w && z.q !== z.w && !sqf(z.w * z.p) && !(z.w === 6 && z.p === 3 && z.q === 2); });
        var Lt = [S(o.a, o.p), S(1, o.q)];
        var p = distPart(S(1, o.w), Lt, { text: 'rectangle area' });
        p.prompt = 'Rectangle:<br>' + R.rectFig(o.a + '√' + o.p + ' + √' + o.q, '√' + o.w, { aria: 'rectangle' }); p.solution = t('A=lw') + ': ' + p.solution + ' m²'; p.answer = t(p.key) + ' m²';
        return p;
      } },
      { id: '11b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(2, 4), b: r.int(1, 3), s: r.int(0, 1) ? 1 : -1 }; }, function (z) { return !(z.m === 2 && z.a === 3 && z.b === 1 && z.s > 0) && !(z.m === 5 && z.a === 2 && z.b === 1); });
        var A = [S(o.a, o.m), N(o.s * o.b)], p = foilPart(A, A, { text: 'square area' });
        p.prompt = 'Square:<br>' + R.rectFig(o.a + '√' + o.m + (o.s > 0 ? ' + ' : ' − ') + o.b, '', { square: true, aria: 'square' }); p.solution = t('A=s^{2}') + ': ' + p.solution + ' m²'; p.answer = t(p.key) + ' m²';
        return p;
      } },
      { id: '11c', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 3), p: r.pick([2, 3, 5, 10, 6]), q: r.pick([3, 6, 15, 10, 5]), s: r.pick([2, 3, 5, 6, 10, 15]) }; }, function (z) { return z.q !== z.s && z.p !== 1 && !sqf(z.p * z.q) && !sqf(z.p * z.s) && !(z.p === 10 && z.q === 6 && z.s === 15); });
        var base = S(2 * o.a, o.p), H = [S(1, o.q), S(1, o.s)], half = S(o.a, o.p), lines = R.foilLines([half], H), key = R.tex(R.sum(lines.list));
        var fig = R.triFig(2 * o.a + '√' + o.p, '√' + o.q + ' + √' + o.s, '', { right: true, apex: 40, aria: 'right triangle' });
        var full = R.tex(R.sum(R.foilLines([base], H).list));
        return R.part('Right triangle (the legs are labelled):<br>' + fig, key, { text: 'triangle area', after: 'm²',
          sol: t('A=\\frac{1}{2}bh=\\frac{1}{2}\\left(' + R.termTex(base, true) + '\\right)\\left(' + tx(H) + '\\right)=' + R.termTex(half, true) + '\\left(' + tx(H) + '\\right)=' + lines.raw + (lines.simp !== lines.raw ? '=' + lines.simp : '') + (key !== lines.simp ? '=' + key : '')) + ' m²',
          hints: ['Triangle: ' + t('A=\\frac{1}{2}bh') + ' — the two legs are the base and the height.', 'Halve ' + t(R.termTex(base, true)) + ' first, then distribute.'],
          cands: [{ tex: full, code: 'u2l4-area-half', hint: 'A triangle’s area is ' + t('\\frac{1}{2}bh') + ': don’t forget the ' + t('\\frac{1}{2}') + '.' }] });
      } }] },
    { num: '12', parts: [
      { id: '12a', level: 'PRG', make: function (r, sh) {
        var A = sh.m - sh.a * sh.a;
        return R.part('A rectangle measures ' + t('\\left(\\sqrt{' + sh.m + '}+' + sh.a + '\\right)') + ' cm by ' + t('\\left(\\sqrt{' + sh.m + '}-' + sh.a + '\\right)') + ' cm. Determine its area.', String(A), { after: 'cm²', text: 'area of a conjugate rectangle',
          sol: t('A=\\left(\\sqrt{' + sh.m + '}+' + sh.a + '\\right)\\left(\\sqrt{' + sh.m + '}-' + sh.a + '\\right)=' + sh.m + '-' + (sh.a * sh.a) + '=' + A) + ' cm² (conjugates).', hints: ['Area = length × width. The sides are conjugates.'],
          cands: [{ tex: '4\\sqrt{' + sh.m + '}', code: 'u2l4-perim-area', hint: 'That is the perimeter. The area is the <b>product</b> of the sides.' }, { tex: String(sh.m + sh.a * sh.a), code: 'u2l4-conj-add', hint: 'Conjugates multiply to a <b>difference</b>: ' + t('a^{2}-b^{2}') + '.' }] });
      } },
      { id: '12b', level: 'ADV', make: function (r, sh) {
        var d2 = 2 * (sh.m + sh.a * sh.a), key = R.tex([T(1, 2, d2)]);
        return R.part('The rectangle measures ' + t('\\left(\\sqrt{' + sh.m + '}+' + sh.a + '\\right)') + ' cm by ' + t('\\left(\\sqrt{' + sh.m + '}-' + sh.a + '\\right)') + ' cm. Determine the exact length of its diagonal in simplest form.', key, { before: t('d='), after: 'cm', text: 'diagonal of a conjugate rectangle',
          sol: t('d^{2}=\\left(\\sqrt{' + sh.m + '}+' + sh.a + '\\right)^{2}+\\left(\\sqrt{' + sh.m + '}-' + sh.a + '\\right)^{2}=\\left(' + (sh.m + sh.a * sh.a) + '+' + (2 * sh.a) + '\\sqrt{' + sh.m + '}\\right)+\\left(' + (sh.m + sh.a * sh.a) + '-' + (2 * sh.a) + '\\sqrt{' + sh.m + '}\\right)=' + d2) + '<br>' + t('d=' + R.simpStep(2, d2)) + ' cm',
          hints: ['Pythagorean theorem: ' + t('d^{2}=l^{2}+w^{2}') + '. Square each side (each has a middle term).', 'The radical terms cancel when you add.'],
          cands: [{ tex: String(d2), code: 'u2l4-diag-noroot', hint: 'That is ' + t('d^{2}') + '. Take the square root and simplify.' }, { tex: '2\\sqrt{' + sh.m + '}', code: 'u2l4-diag-sum', hint: 'The diagonal isn’t the sum of the sides: use ' + t('d^{2}=l^{2}+w^{2}') + '.' }] });
      } }],
      shared: function (r) { return pickWhere(function () { return { m: r.pick([3, 5, 6, 7, 8, 10, 11]), a: r.int(1, 3) }; }, function (z) { return z.m > z.a * z.a && !ex.simplest(2 * (z.m + z.a * z.a), 2) && Math.sqrt(2 * (z.m + z.a * z.a)) % 1 !== 0 && !(z.m === 3 && z.a === 1) && z.m !== 8; }); } },
    { num: '13', section: 'Putting it together', parts: [
      { id: '13', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(1, 5) }; }, function (z) { return !(z.m === 3 && z.a === 2); });
        var A = [S(1, o.m), N(o.a)], Bm = [S(1, o.m), N(-o.a)], s1 = R.tex(R.sum(R.foilLines(A, A).list)), s2 = R.tex(R.sum(R.foilLines(Bm, Bm).list)), key = (4 * o.a) + '\\sqrt{' + o.m + '}';
        var q = br(A) + '^{2}-' + br(Bm) + '^{2}';
        return R.part('Simplify ' + t(q) + '.', key, { text: 'difference of two squares of binomials', sol: t('\\left(' + s1 + '\\right)-\\left(' + s2 + '\\right)=' + key),
          hints: ['Expand each square (each has a middle term), then subtract the second result in brackets.'],
          cands: [{ tex: String(2 * (o.m + o.a * o.a)), code: 'u2l3-brackets', hint: 'Subtract the <b>whole</b> second square: put it in brackets, ' + t('-\\left(' + s2 + '\\right)') + '.' }, { tex: '0', code: 'u2l4-no-middle', hint: 'Each square has a middle term: ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + '.' }] });
      } }] },
    { num: '14', section: 'Multiple choice and numerical response', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var vs = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]), a = vs[0], b = vs[1], minus = r.int(0, 1) === 1, s = minus ? '-' : '+';
        return R.mcPart(r, 'For ' + t(a + '\\ge 0') + ' and ' + t(b + '\\ge 0') + ', the expression ' + t('\\left(\\sqrt{' + a + '}' + s + '\\sqrt{' + b + '}\\right)^{2}') + ' is equal to', [
          { html: t(a + '+' + b + s + '2\\sqrt{' + a + b + '}'), right: true },
          { html: t(a + (minus ? '-' : '+') + b), why: 'That forgets the middle term: ' + t('(p' + s + 'q)^{2}=p^{2}' + s + '2pq+q^{2}') + '.' },
          { html: t(a + '+' + b + s + '\\sqrt{' + a + b + '}'), why: 'The middle term is ' + t('2pq') + ' — it appears twice in the expansion.' },
          { html: t(a + '^{2}+' + b + '^{2}'), why: t('\\left(\\sqrt{' + a + '}\\right)^{2}=' + a) + ', not ' + t(a + '^{2}') + ' — and there is a middle term.' }],
          t('\\left(\\sqrt{' + a + '}\\right)^{2}' + s + '2\\sqrt{' + a + '}\\sqrt{' + b + '}+\\left(\\sqrt{' + b + '}\\right)^{2}=' + a + '+' + b + s + '2\\sqrt{' + a + b + '}') + '.', H_SQ, 'square of a binomial MC');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var z = pairShare(r, { s: [2, 3, 5], xy: [3, 5, 7, 2] }), a = r.int(2, 4), b = r.int(2, 5), p = z.s * z.x, q = z.s * z.y, M = p * q, f = ex.nthFactor(M, 2), sR = M / (f * f);
        if (a === 2 && b === 3 && p === 6 && q === 15) a = 4; // not the booklet's own numbers
        return R.mcPart(r, 'In simplest form, ' + t('\\left(' + a + '\\sqrt{' + p + '}\\right)\\left(' + b + '\\sqrt{' + q + '}\\right)') + ' is', [
          { html: t((a * b * f) + '\\sqrt{' + sR + '}'), right: true },
          { html: t((a * b) + '\\sqrt{' + (p + q) + '}'), why: 'That adds the radicands. Multiply them: ' + t('\\sqrt{' + p + '}\\cdot\\sqrt{' + q + '}=\\sqrt{' + M + '}') + '.' },
          { html: t((a + b) + '\\sqrt{' + M + '}'), why: 'That adds the coefficients — multiply them, then simplify ' + t('\\sqrt{' + M + '}') + '.' },
          { html: t(f + '\\sqrt{' + sR + '}'), why: 'That drops the coefficient ' + t(a * b) + ': ' + t(a * b + '\\sqrt{' + M + '}=' + a * b + '\\left(' + f + '\\sqrt{' + sR + '}\\right)') + '.' }],
          t((a * b) + '\\sqrt{' + M + '}=' + (a * b) + '\\left(' + f + '\\sqrt{' + sR + '}\\right)=' + (a * b * f) + '\\sqrt{' + sR + '}') + '.', H_MUL, 'product MC');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7], 2); return { m: r.pick([2, 3, 5, 6, 7]), p: pq[0], q: pq[1], a: r.int(2, 4), k: r.pick([2, 3]) }; }, function (z) { return z.p !== z.m && z.q !== z.m && z.a * z.a * z.p !== z.q && !(z.a === 2 && z.p === 3 && z.q === 2); });
        var rat = o.a * o.a * o.p - o.q;
        return R.mcPart(r, 'Which product is a rational number?', [
          { html: t('\\left(' + o.a + '\\sqrt{' + o.p + '}-\\sqrt{' + o.q + '}\\right)\\left(' + o.a + '\\sqrt{' + o.p + '}+\\sqrt{' + o.q + '}\\right)'), right: true },
          { html: t('\\left(\\sqrt{' + o.m + '}+1\\right)\\left(\\sqrt{' + o.m + '}+1\\right)'), why: 'That is a square: ' + t((o.m + 1) + '+2\\sqrt{' + o.m + '}') + ', irrational.' },
          { html: t('\\left(\\sqrt{' + o.m + '}\\right)\\left(\\sqrt{' + o.m * o.k + '}\\right)'), why: t('\\sqrt{' + o.m * o.m * o.k + '}=' + o.m + '\\sqrt{' + o.k + '}') + ', irrational.' },
          { html: t('\\left(' + o.k + '+\\sqrt{' + o.m + '}\\right)\\left(' + o.k + '\\sqrt{' + o.m + '}\\right)'), why: t(o.k * o.k + '\\sqrt{' + o.m + '}+' + o.k * o.m) + ', irrational.' }],
          'The first is a product of conjugates: ' + t('(' + o.a + '\\sqrt{' + o.p + '})^{2}-(\\sqrt{' + o.q + '})^{2}=' + (o.a * o.a * o.p) + '-' + o.q + '=' + rat) + ', rational.', H_CONJ, 'which product is rational');
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(1, 4), b: r.int(2, 5), c: r.int(1, 3) }; }, function (z) { var A = z.b * z.m - z.a * z.c, Bc = z.a * z.b - z.c; return A + Bc > 0 && Bc !== 0 && A !== 0 && A + Bc < 1000 && !(z.m === 3 && z.a === 2 && z.b === 4 && z.c === 1); });
        var A = o.b * o.m - o.a * o.c, Bc = o.a * o.b - o.c;
        var X = [S(1, o.m), N(o.a)], Y = [S(o.b, o.m), N(-o.c)], lines = R.foilLines(X, Y);
        return R.nrPart('<b>Numerical response.</b> The product ' + t(br(X) + br(Y)) + ' can be written in the form ' + t('a+b\\sqrt{' + o.m + '}') + '. The value of ' + t('a+b') + ' is ____.', A + Bc,
          [[A, 'u2l4-ab-swap', 'That is ' + t('a') + ' only. Add ' + t('a') + ' and ' + t('b') + '.'], [Bc, 'u2l4-ab-swap', 'That is ' + t('b') + ' only. Add ' + t('a') + ' and ' + t('b') + '.'], [o.b * o.m - o.a * o.c + o.a * o.b + o.c, 'sign', 'Check the sign of ' + t('\\sqrt{' + o.m + '}\\times(-' + o.c + ')') + '.']],
          t(br(X) + br(Y) + '=' + lines.raw + '=' + R.tex(R.sum(lines.list))) + ', so ' + t('a+b=' + A + '+' + (Bc < 0 ? '(' + Bc + ')' : Bc) + '=' + (A + Bc)) + '.', H_FOIL, 'NR binomial product');
      } }] },
    { num: '18', parts: [
      { id: '18', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { p: r.pick([2, 3, 5]), q: r.pick([6, 10, 15, 3, 2]), a: r.int(2, 4) }; }, function (z) { var M = z.p * z.q; return z.p !== z.q && !sqf(M) && M / Math.pow(ex.nthFactor(M, 2), 2) > 1 && !(z.p === 2 && z.q === 6 && z.a === 3); });
        var A = [S(o.a, o.p), S(1, o.q)], res = R.sum(R.foilLines(A, A).list), rat = res.filter(function (u) { return u.n === 1; })[0], rad = res.filter(function (u) { return u.n > 1; })[0];
        var aV = qv(rat.c), bV = qv(rad.c);
        return R.nrPart('<b>Numerical response.</b> A square has sides of length ' + t(br(A)) + ' cm. Its area can be written as ' + t('a+b\\sqrt{' + rad.m + '}') + ' cm². The value of ' + t('a+b') + ' is ____.', aV + bV,
          [[o.a * o.a * o.p + o.q, 'u2l4-no-middle', 'That leaves out the middle term ' + t('2ab') + '.'], [aV, 'u2l4-ab-swap', 'That is ' + t('a') + ' only.'], [aV + bV / 2, 'u2l4-middle-once', 'The middle term is doubled: ' + t('2ab') + '.']],
          t(br(A) + '^{2}=' + R.foilLines(A, A).raw + '=' + R.tex(res)) + ', so ' + t('a+b=' + aV + '+' + bV + '=' + (aV + bV)) + '.', H_SQ, 'NR square area');
      } }] }
  ];

  /* ============================== the extra practice ============================== */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Multiply and simplify.', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 7, 11, 13], 2); return { p: pq[0], q: pq[1] }; }, function (z) { return z.p * z.q !== 39 && z.p * z.q !== 35; }); return prodPart([S(1, o.p), S(1, o.q)]); } },
      { id: 'A1b', level: 'BEG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 7, 11], 2); return { p: pq[0], q: pq[1], a: r.int(2, 6), b: r.int(2, 6) }; }, function (z) { return !(z.p * z.q === 10 && z.a === 4); }); return prodPart([S(o.a, o.p), S(-o.b, o.q)]); } },
      { id: 'A1c', level: 'EMG', make: function (r) { var o = pickWhere(function () { var uv = r.sample([1, 2, 3], 2); return { s: r.pick([2, 3, 5, 6, 7]), u: uv[0], v: uv[1] }; }, function (z) { return !(z.s === 6 && z.u * z.v === 2); }); return prodPart([S(1, o.s * o.u * o.u), S(1, o.s * o.v * o.v)]); } },
      { id: 'A1d', level: 'EMG', make: function (r) { var z = pairShare(r, { s: [2, 3, 5], xy: [1, 3, 5, 7, 11], ok: function (z) { return (z.x === 1 || z.y === 1) && !(z.s === 2 && z.x * z.y === 7); } }); return prodPart([S(r.int(2, 4), z.s * z.x), S(r.int(2, 6), z.s * z.y)]); } },
      { id: 'A1e', level: 'PRG', make: function (r) { var z = pairShare(r, { s: [5, 3, 2, 7], xy: [2, 3, 5, 7] }); return prodPart([S(-1, z.s * z.x), S(-r.int(2, 5), z.s * z.y)]); } },
      { id: 'A1f', level: 'PRG', make: function (r) { var pr = r.pick([[6, 36], [2, 4], [3, 9], [5, 25], [4, 16], [9, 24], [12, 18], [2, 32]]); return prodPart([raw(r.int(2, 4), 3, pr[0]), raw(1, 3, pr[1])]); } },
      { id: 'A1g', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { c: r.int(2, 7), m: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return !(z.c === 6 && z.m === 2); }); return powPart(r, o); } },
      { id: 'A1h', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { c: r.int(2, 4), m: r.pick([2, 3, 4, 5]), n: 3 }; }, function (z) { return !(z.c === 3 && z.m === 2); }); o.negOut = true; return powPart(r, o); } },
      { id: 'A1i', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: r.pick([4, 9, 25, 2, 3, 5]), q: r.pick([2, 3, 5, 6, 10, 12, 15]), b: r.int(2, 4) }; }, function (z) { var M = z.p * z.q; return z.p !== z.q && ex.nthFactor(M, 3) > 1 && M / Math.pow(ex.nthFactor(M, 3), 3) > 1 && !(z.p === 25 && z.q === 10); }); return prodPart([raw(1, 3, o.p), raw(o.b, 3, o.q)]); } }] },
    { num: 'A2', stem: 'Expand and simplify.', parts: [
      { id: 'A2a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7, 10, 11]), a: r.int(2, 9) }; }, function (z) { return !(z.m === 7 && z.a === 3); }); return distPart(S(1, o.m), [N(o.a), S(-1, o.m)]); } },
      { id: 'A2b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { s: r.pick([2, 3]), x: r.pick([3, 5, 7]), y: r.pick([5, 7, 11]), a: r.int(2, 4), b: r.int(2, 3) }; }, function (z) { return z.x !== z.y && z.x !== z.s && z.y !== z.s && !(z.s === 2 && z.x === 3 && z.y === 5 && z.a === 4); }); return distPart(S(o.a, o.s), [S(1, o.s * o.x), S(o.b, o.s * o.y)]); } },
      { id: 'A2c', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5]), x: r.pick([2, 3, 5, 7]), y: r.pick([2, 3, 5, 7]), c: r.int(2, 3) }; }, function (z) { return z.x !== z.y && z.x !== z.m && z.y !== z.m && !(z.m === 5 && z.x === 3 && z.y === 2); }); return distPart(S(1, o.m), [S(1, o.m * o.x), S(-o.c, o.m), S(1, o.m * o.y)]); } }] },
    { num: 'A3', stem: 'Simplify. State the restrictions on the variables.', parts: [
      { id: 'A3a', level: 'PRG', make: function (r) {
        var v = r.pick(['x', 'a', 'y']), o = pickWhere(function () { var uv = r.sample([1, 2, 3], 2); return { s: r.pick([2, 3, 5]), u: uv[0], v: uv[1], c: r.int(2, 4) }; }, function (z) { return !(z.s === 2 && z.u * z.v === 2 && z.c === 3); });
        var p = o.s * o.u * o.u, q2 = o.s * o.v * o.v, k = o.c * o.s * o.u * o.v, q = '\\left(' + o.c + '\\sqrt{' + p + v + '}\\right)\\left(\\sqrt{' + q2 + v + '}\\right)', w = {}; w[v] = 0;
        return R.partR(t(q), k + v, w, { vars: [v], text: 'product to a perfect square', sol: t(q + '=' + o.c + '\\sqrt{' + p * q2 + v + '^{2}}=' + k + v) + ', &nbsp;' + t(v + '\\ge 0'), hints: H_MUL });
      } },
      { id: 'A3b', level: 'PRG', make: function (r) {
        var v = r.pick(['a', 'x']), o = pickWhere(function () { return { p: r.pick([2, 3, 5, 6, 7]), c: r.int(2, 6) }; }, function (z) { return !(z.p === 5 && z.c === 2); }), w = {}; w[v] = 0;
        var q = '\\sqrt{' + o.p + v + '}\\left(\\sqrt{' + o.p + v + '}-' + o.c + '\\right)', key = o.p + v + '-' + o.c + '\\sqrt{' + o.p + v + '}';
        return R.partR(t(q), key, w, { vars: [v], text: 'distribute with a variable', sol: t(q + '=\\left(\\sqrt{' + o.p + v + '}\\right)^{2}-' + o.c + '\\sqrt{' + o.p + v + '}=' + key) + ', &nbsp;' + t(v + '\\ge 0'), hints: ['Multiply ' + t('\\sqrt{' + o.p + v + '}') + ' by each term; ' + t('\\left(\\sqrt{a}\\right)^{2}=a') + '.'],
          cands: [{ tex: o.p + v + '-' + o.c, code: 'u2l4-dist-one', hint: 'Multiply ' + t('\\sqrt{' + o.p + v + '}') + ' by the ' + t(o.c) + ' as well.' }] });
      } },
      { id: 'A3c', level: 'PRG', make: function (r) {
        var v = r.pick(['y', 'n']), pr = r.pick([[3, 9], [2, 4], [4, 2], [5, 25], [9, 3], [6, 36]]), k = Math.round(Math.cbrt(pr[0] * pr[1]));
        var q = '\\left(\\sqrt[3]{' + pr[0] + v + '}\\right)\\left(\\sqrt[3]{' + pr[1] + v + '^{2}}\\right)';
        return R.partR(t(q), k + v, null, { vars: [v], text: 'cube roots to a perfect cube', sol: t(q + '=\\sqrt[3]{' + pr[0] * pr[1] + v + '^{3}}=' + k + v) + '; no restriction (cube roots).', hints: ['Multiply the radicands under one cube root.', 'Cube roots need no restriction.'] });
      } }] },
    { num: 'B1', section: 'B. Applying', stem: 'Expand and simplify.', parts: [
      { id: 'B1a', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(2, 7), b: r.int(1, 5) }; }, function (z) { return !(z.m === 5 && z.a === 4 && z.b === 2); }); return foilPart([N(o.a), S(-1, o.m)], [N(o.b), S(1, o.m)]); } },
      { id: 'B1b', level: 'PRG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 7], 2); return { p: pq[0], q: pq[1], a: r.int(2, 4) }; }, function (z) { return !(z.p === 2 && z.q === 3 && z.a === 2); }); return foilPart([S(1, o.p), S(1, o.q)], [S(o.a, o.p), S(-1, o.q)]); } },
      { id: 'B1c', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(2, 5), b: r.int(1, 3) }; }, function (z) { return !(z.m === 5 && z.a === 3 && z.b === 1); }); var A = [S(o.a, o.m), N(-o.b)]; return foilPart(A, A); } },
      { id: 'B1d', level: 'ADV', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7, 10], 2); return { p: pq[0], q: pq[1] }; }, function (z) { var M = z.p * z.q; return !sqf(M) && M / Math.pow(ex.nthFactor(M, 2), 2) > 1 && !(z.p * z.q === 18); }); var A = [S(1, o.p), S(1, o.q)]; return foilPart(A, A); } }] },
    { num: 'B2', stem: 'Write the conjugate of the expression, then multiply the expression by its conjugate.', parts: [
      { id: 'B2a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7, 10, 11]), a: r.int(2, 8) }; }, function (z) { return z.a * z.a !== z.m && !(z.m === 10 && z.a === 6); }); return conjPart([N(o.a), S(-1, o.m)]); } },
      { id: 'B2b', level: 'PRG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7], 2); return { p: pq[0], q: pq[1], a: r.int(2, 4) }; }, function (z) { return !(z.p === 5 && z.q === 3 && z.a === 2); }); return conjPart([S(o.a, o.p), S(1, o.q)]); } },
      { id: 'B2c', level: 'PRG', make: function (r) {
        var a = pickWhere(function () { return r.int(2, 9); }, function (a) { return a !== 4; }), e = '\\sqrt{x}-' + a, cj = '\\sqrt{x}+' + a, pT = 'x-' + a * a;
        return R.fieldsPart(t(e) + '. State the restriction.', [
          { label: 'Conjugate:', name: 'Conjugate', key: cj, vars: ['x'], cands: [{ tex: e, code: 'u2l4-conj-same', hint: 'Change the sign between the terms.' }, { tex: '-\\sqrt{x}+' + a, code: 'u2l4-conj-neg', hint: 'Only the sign between the terms changes.' }] },
          { label: 'Product:', name: 'Product', key: pT, vars: ['x'], cands: [{ tex: 'x+' + a * a, code: 'u2l4-conj-add', hint: 'Conjugates multiply to a <b>difference</b> of squares.' }] },
          { label: 'Restriction:', name: 'Restriction', key: 'x\\ge 0', check: R.restrCheck({ x: 0 }), vars: ['x'], none: true, ansTex: 'x\\ge 0' }],
          { text: 'conjugate with √x', sol: 'Conjugate: ' + t(cj) + '<br>' + t('\\left(' + e + '\\right)\\left(' + cj + '\\right)=x-' + a * a) + ', &nbsp;' + t('x\\ge 0'), hints: H_CONJ, bad: [[e, pT, 'x\\ge 0']] });
      } }] },
    { num: 'B3', parts: [
      { id: 'B3a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 9), m: r.pick([2, 3, 5, 6, 7, 10, 11]) }; }, function (z) { return z.a * z.a > z.m && !(z.a === 5 && z.m === 3); });
        var A = o.a * o.a - o.m, P = 4 * o.a;
        return R.fieldsPart('A rectangle measures ' + t('\\left(' + o.a + '+\\sqrt{' + o.m + '}\\right)') + ' cm by ' + t('\\left(' + o.a + '-\\sqrt{' + o.m + '}\\right)') + ' cm. Determine its area and its perimeter.', [
          { label: 'Area:', name: 'Area', key: String(A), after: 'cm²', cands: [{ tex: String(P), code: 'u2l4-perim-area', hint: 'That is the perimeter. The area is the product of the sides.' }, { tex: String(o.a * o.a + o.m), code: 'u2l4-conj-add', hint: 'Conjugates multiply to a <b>difference</b>.' }] },
          { label: 'Perimeter:', name: 'Perimeter', key: String(P), after: 'cm', cands: [{ tex: String(A), code: 'u2l4-perim-area', hint: 'That is the area. The perimeter adds all four sides.' }, { tex: String(2 * o.a), code: 'u2l3-perim-half', hint: 'Add all four sides: ' + t('2(l+w)') + '.' }] }],
          { text: 'area and perimeter of a conjugate rectangle', sol: t('A=\\left(' + o.a + '+\\sqrt{' + o.m + '}\\right)\\left(' + o.a + '-\\sqrt{' + o.m + '}\\right)=' + o.a * o.a + '-' + o.m + '=' + A) + ' cm²<br>' + t('P=2\\left(' + o.a + '+\\sqrt{' + o.m + '}+' + o.a + '-\\sqrt{' + o.m + '}\\right)=' + P) + ' cm',
            hints: ['Area: multiply the conjugates. Perimeter: ' + t('2(l+w)') + ' — the radicals cancel.'] });
      } },
      { id: 'B3b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), f: r.int(2, 4), g: r.int(1, 2) }; }, function (z) { return z.f !== z.g && !(z.m === 2 && z.f === 2 && z.g === 1); });
        var side = o.f + o.g, A = side * side * o.m;
        return R.part('A square has sides of length ' + t('\\left(\\sqrt{' + o.f * o.f * o.m + '}+\\sqrt{' + o.g * o.g * o.m + '}\\right)') + ' m. Determine its area. (Simplify the side first.)', String(A), { after: 'm²', text: 'area after simplifying the side',
          sol: 'Side ' + t('=' + o.f + '\\sqrt{' + o.m + '}+' + (o.g === 1 ? '' : o.g) + '\\sqrt{' + o.m + '}=' + side + '\\sqrt{' + o.m + '}') + '; ' + t('A=\\left(' + side + '\\sqrt{' + o.m + '}\\right)^{2}=' + side * side + '(' + o.m + ')=' + A) + ' m²',
          hints: ['Simplify each radical in the side and combine them.', 'Then square: ' + t('\\left(k\\sqrt{m}\\right)^{2}=k^{2}m') + '.'],
          cands: [{ tex: String(o.f * o.f * o.m + o.g * o.g * o.m), code: 'u2l4-no-middle', hint: t('(a+b)^{2}\\ne a^{2}+b^{2}') + '. Simplify the side to one term first.' }, { tex: String(4 * side) + '\\sqrt{' + o.m + '}', code: 'u2l4-perim-area', hint: 'That is the perimeter. The area is the side squared.' }] });
      } }] },
    { num: 'B4', parts: [
      { id: 'B4', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7, 10, 11], 2); return { p: Math.max(pq[0], pq[1]), q: Math.min(pq[0], pq[1]) }; }, function (z) { return !(z.p === 5 && z.q === 3) && ex.simplest(z.p - z.q, 2) && z.p - z.q > 1; });
        var d = o.p - o.q;
        return R.mcPart(r, 'The product ' + t('\\left(\\sqrt{' + o.p + '}-\\sqrt{' + o.q + '}\\right)\\left(\\sqrt{' + o.p + '}+\\sqrt{' + o.q + '}\\right)') + ' is equal to', [
          { html: t(d), right: true }, { html: t('\\sqrt{' + d + '}'), why: 'Square each term: ' + t('(\\sqrt{' + o.p + '})^{2}-(\\sqrt{' + o.q + '})^{2}=' + o.p + '-' + o.q) + ' — no root is left.' },
          { html: t(o.p + o.q), why: 'Conjugates give a <b>difference</b>: subtract.' }, { html: t(d + '-2\\sqrt{' + o.p * o.q + '}'), why: 'The middle terms cancel for conjugates — nothing with a radical is left.' }],
          'Conjugates: ' + t(o.p + '-' + o.q + '=' + d) + '.', H_CONJ, 'conjugate product MC');
      } }] },
    { num: 'B5', parts: [
      { id: 'B5', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(2, 6), b: r.int(2, 7) }; }, function (z) { var A = z.a * z.b - z.m, Bc = z.b - z.a; return A + Bc > 0 && Bc !== 0 && !(z.m === 2 && z.a === 3 && z.b === 5) && !(z.m === 5 && z.a === 4 && z.b === 2); });
        var X = [N(o.a), S(1, o.m)], Y = [N(o.b), S(-1, o.m)], lines = R.foilLines(X, Y), A = o.a * o.b - o.m, Bc = o.b - o.a;
        return R.nrPart('<b>Numerical response.</b> The product ' + t(br(X) + br(Y)) + ' can be written in the form ' + t('a+b\\sqrt{' + o.m + '}') + '. The value of ' + t('a+b') + ' is ____.', A + Bc,
          [[A, 'u2l4-ab-swap', 'That is ' + t('a') + ' only.'], [o.a * o.b + o.m + Bc, 'u2l4-rad-sq', t('\\sqrt{' + o.m + '}\\times(-\\sqrt{' + o.m + '})=-' + o.m) + '.']],
          t(br(X) + br(Y) + '=' + lines.raw + '=' + R.tex(R.sum(lines.list))) + ', so ' + t('a+b=' + (A + Bc)) + '.', H_FOIL, 'NR product');
      } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'C1', level: 'MAS', make: function (r) {
        var k = r.int(2, 9);
        var q = '\\left(\\sqrt{x+' + k + '}+\\sqrt{x}\\right)\\left(\\sqrt{x+' + k + '}-\\sqrt{x}\\right)';
        return R.part('Simplify ' + t(q) + ' for ' + t('x\\ge 0') + '. (It is the same number for every ' + t('x') + '.)', String(k), { text: 'conjugates with x', sol: 'Conjugates: ' + t('\\left(\\sqrt{x+' + k + '}\\right)^{2}-\\left(\\sqrt{x}\\right)^{2}=(x+' + k + ')-x=' + k) + '.',
          hints: ['The two brackets are conjugates.', t('\\left(\\sqrt{a}\\right)^{2}=a') + '.'], cands: [{ tex: '2x+' + k, code: 'u2l4-conj-add', hint: 'Conjugates give a <b>difference</b>: ' + t('(x+' + k + ')-x') + '.' }, { tex: '\\sqrt{' + k + '}', code: 'u2l4-rad-sq', hint: t('\\left(\\sqrt{x+' + k + '}\\right)^{2}=x+' + k) + ' — the root is gone.' }], vars: ['x'] });
      } }] },
    { num: 'C2', parts: [
      { id: 'C2', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 6), c: r.int(2, 30) }; }, function (z) { return !(z.a === 3 && z.c === 7); });
        var k = o.c + o.a * o.a;
        var p = R.nrPart('Determine ' + t('k') + ' if ' + t('\\left(\\sqrt{k}+' + o.a + '\\right)\\left(\\sqrt{k}-' + o.a + '\\right)=' + o.c) + '.', k,
          [[o.c - o.a * o.a, 'u2l4-k-sub', t('k-' + o.a * o.a + '=' + o.c) + ': add ' + t(o.a * o.a) + ' to both sides.'], [Math.sqrt(k), 'u2l4-k-root', 'That is ' + t('\\sqrt{k}') + '; the question asks for ' + t('k') + '.'], [o.c + o.a, 'u2l4-sq-coef', 'Square the ' + t(o.a) + ': the product is ' + t('k-' + o.a * o.a) + '.']],
          'Conjugates: ' + t('k-' + o.a * o.a + '=' + o.c) + ', so ' + t('k=' + k) + '.', ['The brackets are conjugates: their product is ' + t('k-' + o.a + '^{2}') + '.'], 'find k from a conjugate product');
        p.input = { type: 'number' }; return p;
      } }] },
    { num: 'C3', parts: [
      { id: 'C3', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 3), m: r.pick([2, 3, 5]) }; }, function (z) { return !(z.a === 1 && z.m === 2); });
        var A = [N(o.a), S(1, o.m)], sq = R.sum(R.foilLines(A, A).list), cube = R.sum(R.foilLines(sq, A).list), key = R.tex(cube);
        var wrongC = R.tex(R.sum([T(Math.pow(o.a, 3), 1, 1), T(o.m, 2, o.m)]));
        return R.part('Expand and simplify ' + t(br(A) + '^{3}') + '.', key, { text: 'cube of a binomial', sol: t(br(A) + '^{2}=' + R.tex(sq)) + '<br>' + t('\\left(' + R.tex(sq) + '\\right)' + br(A) + '=' + R.foilLines(sq, A).raw + '=' + key),
          hints: ['Square it first: ' + t(br(A) + '^{2}') + '. Then multiply the result by ' + t(br(A)) + ' once more.'], cands: [{ tex: wrongC, code: 'u2l4-cube-sq', hint: t('(a+b)^{3}\\ne a^{3}+b^{3}') + '. Multiply out ' + t(br(A) + br(A) + br(A)) + ' step by step.' }] });
      } }] },
    { num: 'C4', parts: [
      { id: 'C4', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(1, 4), q: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return !(z.p === 2 && z.q === 3); });
        var c = o.p * o.p - o.q, x = [N(o.p), S(1, o.q)], x2 = R.tex(R.sum(R.foilLines(x, x).list));
        var poly = 'x^{2}-' + (2 * o.p === 1 ? '' : 2 * o.p) + 'x' + (c > 0 ? '+' + c : c < 0 ? String(c) : '');
        return R.fieldsPart('Show that ' + t('x=' + tx(x)) + ' is a solution of ' + t(poly + '=0') + ': work out ' + t('x^{2}') + ', then the value of ' + t(poly) + '.', [
          { label: t('x^{2}='), name: 'x squared', key: x2, cands: [{ tex: String(o.p * o.p + o.q), code: 'u2l4-no-middle', hint: t('(a+b)^{2}=a^{2}+2ab+b^{2}') + ': include the middle term.' }] },
          { label: t(poly + '='), name: 'value', key: '0' }],
          { text: 'show a radical is a solution', sol: t('x^{2}=' + x2) + '; ' + t('-' + 2 * o.p + 'x=' + R.tex(R.sum([T(-2 * o.p * o.p, 1, 1), T(-2 * o.p, 2, o.q)])))+ '.<br>' + t(poly + '=' + x2 + R.tex(R.sum([T(-2 * o.p * o.p, 1, 1), T(-2 * o.p, 2, o.q)])).replace(/^(?!-)/, '+') + (c > 0 ? '+' + c : c < 0 ? String(c) : '') + '=0') + ' ✓',
            hints: ['Square ' + t(br(x)) + ' (it has a middle term).', 'Then substitute: the rational parts and the radical parts both cancel.'] });
      } }] }
  ];

  HW.defineLesson({ id: 'u2l4', unit: 2, num: '4', title: 'Multiplying Radicals', outcome: 'AN2', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
