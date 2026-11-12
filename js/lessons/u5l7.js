/* Math 20-1 · Unit 5 · Lesson 7 — The Quadratic Formula (outcome RF5 on every part)
 * Assignment 7 (m201book unit5/u5_l07.tex, Questions 1–17) and the Lesson 7 Extra Practice (u5_ep07.tex, A1–A4, B1–B7,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (contexts vary a
 * little); the lesson's example equations and the booklet's own equations are left out. Calculator lesson: roots are
 * exact (simplest radical form, common factor divided out, fractions in lowest terms) where the booklet asks, and rounded
 * to the place the booklet asks otherwise.
 *
 * This file also defines the kit HW.p57, used by u5l8.js (which loads after this file):
 *   numbers   gcd, cl, same, pickWhere, nz, sgn, nT, par (brackets round a negative), sqf(n) → [k, f] with n = k²f,
 *             frT(p, q) (a fraction in lowest terms), polyT([a, b, c], v), eqT(a, b, c, v), avoid(list)(a, b, c)
 *   formula   qf(a, b, c) (D, exact roots: rational fractions or (N ± K√f)/Den), keyT(Q, v), oneT(Q, sign), solF(a, b, c, o)
 *             (the booklet's working), fmlWrongs(cp, a, b, c) (the classic slips as root sets), gen(r, spec)
 *   checkers  rootsChk(cp, vals, o) ("x = 2 ± √5", "(−3 ± √15)/3", "x = 3, x = −5", "no real roots"; o.dp rounded, o.irr
 *             exact radicals: simplest radical form and the common factor divided out), numChk(cp, T, cands),
 *             stdChk(cp, [a, b, c], cands) (an equation in standard form: any non-zero multiple, right side 0, integer
 *             coefficients), ptRound(x, y, dp) (a point to the place asked), prChk(cp, fns, o) (roots in terms of a
 *             parameter, e.g. a(2 ± √3))
 *   parts     solve(cp, prompt, a, b, c, o), roots(cp, prompt, vals, o), num(cp, prompt, T, o), apx(prompt, x, dp, o),
 *             nr(prompt, x, dp, o), fields(prompt, specs, o) (o.swap = [[i, j]]), mc(r, prompt, opts, sol, hints, text),
 *             work(lines) (a student's work in a box)
 *   keypad    'p57' (digits, fraction, √, ( ), comma, + −, x, =, x², ±, "no real roots")
 * Recognised mistakes (codes u5l7-…): b instead of −b, a negative b squared without brackets, the sign of −4ac, only one
 * term of the numerator divided by 2a, dividing by a instead of 2a, "no real roots" when there are roots (and roots when
 * the discriminant is negative), the equation not put in standard form first, a term moved without changing its sign,
 * completing the square without dividing by a or with the wrong sign of p, a negative time or length kept, the time of
 * the maximum height for the landing time, the perimeter used for the sum of two sides, a rounded number of terms.
 * Conversions: "choose an efficient method, name it" → a grid (equation → method) plus the roots; "identify the errors" →
 * multiple choice of the errors plus the correct roots; "describe how to check with a graphing calculator" → the
 * intercepts as points (the keystrokes are in the solution); "can the sum be exactly …?" → multiple choice with reasons;
 * numerical response → a 4-character box.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 12, 13(b), Extra C1, C2, C3. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, P = HW.poly, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u5l7', CP = 'u5l7-', OUT = 'RF5';

  /* =========================== the kit (HW.p57) =========================== */
  var Z = HW.p57 = {};
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function same(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function pickWhere(gen, okf) { for (var i = 0; i < 40000; i++) { var o = gen(); if (o && okf(o)) return o; } throw new Error('p57: no valid numbers'); }
  function nz(r, lo, hi) { return pickWhere(function () { return r.int(lo, hi); }, function (x) { return x !== 0; }); }
  function sgn(r) { return r.chance(0.5) ? 1 : -1; }
  function nT(x) { x = cl(x); if (Math.abs(x) < 1e-12) x = 0; return F(x); }
  function par(x) { return x < 0 ? '(' + nT(x) + ')' : nT(x); }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function sqf(n) { var k = ex.nthFactor(n, 2); return [k, n / (k * k)]; }
  function isSq(n) { if (n < 0) return false; var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function frT(p, q) { if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; p /= g; q /= g; return q === 1 ? nT(p) : (p < 0 ? '-' : '') + '\\frac{' + Math.abs(p) + '}{' + q + '}'; }
  function vT(x) { // a value: integer, short decimal, or a fraction
    if (isInt(x)) return nT(x);
    for (var q = 2; q <= 400; q++) { var p = x * q; if (Math.abs(p - Math.round(p)) < 1e-7) { if (/^(2|4|5|8|10|20|25|50|100)$/.test(String(q))) return nT(x); return frT(Math.round(p), q); } }
    return nT(x);
  }
  function polyT(cs, v) {
    v = v || 'x'; var n = cs.length - 1, s = '';
    cs.forEach(function (c, i) {
      var pw = n - i; if (same(c, 0)) return;
      var neg = c < 0, mag = Math.abs(c), body = (same(mag, 1) && pw > 0 ? '' : nT(mag)) + (pw > 1 ? v + '^{' + pw + '}' : pw === 1 ? v : '');
      s += s ? (neg ? '-' : '+') + body : (neg ? '-' : '') + body;
    });
    return s || '0';
  }
  function eqT(a, b, c, v) { return polyT([a, b, c], v) + '=0'; }
  function avoid(list) { return function (a, b, c) { return !list.some(function (L) { return same(L[1] / L[0], b / a) && same(L[2] / L[0], c / a); }); }; }
  function uniq(L) { var o = []; L.forEach(function (x) { if (!o.some(function (y) { return Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(y)); })) o.push(x); }); return o.sort(function (p, q) { return p - q; }); }
  function rootsOf(a, b, c, D) { if (D == null) D = b * b - 4 * a * c; if (D < -1e-12) return []; var s = Math.sqrt(Math.max(D, 0)); return uniq([(-b - s) / (2 * a), (-b + s) / (2 * a)]); }
  Z.gcd = gcd; Z.cl = cl; Z.same = same; Z.pickWhere = pickWhere; Z.nz = nz; Z.sgn = sgn; Z.nT = nT; Z.par = par; Z.isInt = isInt; Z.sqf = sqf; Z.isSq = isSq;
  Z.frT = frT; Z.vT = vT; Z.polyT = polyT; Z.eqT = eqT; Z.avoid = avoid; Z.uniq = uniq; Z.rootsOf = rootsOf;

  /* ---- the formula, exactly ---- */
  function radT(k, f) { return (k === 1 ? '' : k) + '\\sqrt{' + f + '}'; }
  function qf(a, b, c) {
    var Q = { a: a, b: b, c: c, D: cl(b * b - 4 * a * c) }, D = Q.D;
    Q.int = [a, b, c].every(isInt);
    Q.vals = rootsOf(a, b, c, D);
    Q.n = D < 0 ? 0 : D === 0 ? 1 : 2;
    if (!Q.int || D < 0) return Q;
    var s = sqf(D); Q.k = s[0]; Q.f = s[1];
    if (D === 0 || Q.f === 1) { Q.rational = true; Q.fr = Q.n === 1 ? [[-b, 2 * a]] : [[-b - Q.k, 2 * a], [-b + Q.k, 2 * a]].sort(function (p, q) { return p[0] / p[1] - q[0] / q[1]; }); return Q; }
    var g = gcd(gcd(Math.abs(b), Q.k), Math.abs(2 * a)), N = -b / g, Kc = Q.k / g, Den = 2 * a / g;
    if (Den < 0) { N = -N; Den = -Den; }
    Q.g = g; Q.N = N; Q.Kc = Kc; Q.Den = Den; Q.irr = true;
    return Q;
  }
  function pmT(Q) {
    var rad = radT(Q.Kc, Q.f);
    if (Q.Den === 1) return (Q.N ? nT(Q.N) : '') + '\\pm ' + rad;
    if (!Q.N) return '\\pm\\frac{' + rad + '}{' + Q.Den + '}';
    return '\\frac{' + nT(Q.N) + '\\pm ' + rad + '}{' + Q.Den + '}';
  }
  function oneT(Q, s) { // the + root (s = 1) or the − root (s = −1)
    if (Q.rational) { var f = Q.fr.length === 1 ? Q.fr[0] : Q.fr[s > 0 ? 1 : 0]; return frT(f[0], f[1]); }
    var rad = radT(Q.Kc, Q.f), top = (Q.N ? nT(Q.N) + (s > 0 ? '+' : '-') : s > 0 ? '' : '-') + rad;
    return Q.Den === 1 ? top : '\\frac{' + top + '}{' + Q.Den + '}';
  }
  function keyT(Q, v) {
    v = v || 'x';
    if (!Q.n) return '\\text{no real roots}';
    if (Q.rational) return Q.fr.map(function (f) { return v + '=' + frT(f[0], f[1]); }).join(',\\ ');
    return v + '=' + pmT(Q);
  }
  function fx(x, dp) { return nT(K.roundTo(x, dp).toFixed(dp)); }
  /* the booklet's working: x = (−b ± √(b² − 4ac)) / 2a, simplified. o.dp adds the rounded roots; o.v; o.abc shows a, b, c */
  function dfr(s) { return String(s).replace(/\\frac\{/g, '\\dfrac{'); }
  function solF(a, b, c, o) { return dfr(solF0(a, b, c, o)); }
  function solF0(a, b, c, o) {
    o = o || {}; var v = o.v || 'x', Q = qf(a, b, c), D = Q.D, fac = cl(-4 * a * c);
    var inside = (b ? nT(b * b) : '') + (fac ? (fac > 0 ? (b ? '+' : '') + nT(fac) : '-' + nT(-fac)) : (b ? '' : '0'));
    var s = o.abc ? t('a=' + nT(a) + ',\\ b=' + nT(b) + ',\\ c=' + nT(c)) + ': ' : '';
    var nb = b ? nT(-b) : '', den = nT(2 * a);
    if (D < 0) return s + t('b^{2}-4ac=' + (b ? par(b) + '^{2}' : '0^{2}') + '-4(' + nT(a) + ')(' + nT(c) + ')=' + inside + '=' + nT(D)) + ', which is negative. A negative number has no real square root, so there are <b>no real roots</b>.';
    var L = [v + '=\\frac{' + nb + '\\pm\\sqrt{' + inside + '}}{' + den + '}'];
    if (inside !== nT(D)) L.push('\\frac{' + nb + '\\pm\\sqrt{' + nT(D) + '}}{' + den + '}');
    var out;
    if (!Q.int) {
      out = t(L.join('=')) + '<br>' + t(v + '\\approx ' + fx(Q.vals[Q.vals.length - 1], o.dp == null ? 2 : o.dp) + (Q.n === 2 ? '\\text{ or }' + v + '\\approx ' + fx(Q.vals[0], o.dp == null ? 2 : o.dp) : ''));
      return s + out;
    }
    if (Q.rational) {
      var sq = Q.k;
      if (D === 0) { L.push('\\frac{' + nb + '}{' + den + '}=' + frT(-b, 2 * a)); out = t(L.join('=')) + ' (one root: the radical is 0)'; }
      else {
        L.push('\\frac{' + nb + '\\pm ' + sq + '}{' + den + '}');
        out = t(L.join('=')) + '<br>' + t(v + '=\\frac{' + nT(-b + sq) + '}{' + den + '}' + (isInt((-b + sq) / (2 * a)) && 2 * a !== 1 || gcd(-b + sq, 2 * a) > 1 ? '=' + frT(-b + sq, 2 * a) : '') + '\\text{ or }' + v + '=\\frac{' + nT(-b - sq) + '}{' + den + '}' + (gcd(-b - sq, 2 * a) > 1 ? '=' + frT(-b - sq, 2 * a) : ''));
      }
    } else {
      if (Q.k > 1) L.push('\\frac{' + nb + '\\pm ' + radT(Q.k, Q.f) + '}{' + den + '}');
      if (Q.g > 1 || 2 * a < 0) L.push(pmT(Q));
      out = t(L.join('='));
      if (2 * a < 0) out += ' (the ' + t('\\pm') + ' covers both signs)';
    }
    if (o.dp != null && Q.n === 2) out += '<br>' + t(v + '\\approx ' + fx(Q.vals[1], o.dp) + '\\text{ or }' + v + '\\approx ' + fx(Q.vals[0], o.dp));
    return s + out;
  }
  Z.dfr = dfr; Z.radT = radT; Z.qf = qf; Z.pmT = pmT; Z.oneT = oneT; Z.keyT = keyT; Z.fx = fx; Z.solF = solF;

  /* the classic slips, as root sets */
  function fmlWrongs(cp, a, b, c) {
    var Q = qf(a, b, c), D = Q.D, out = [];
    function add(vals, code, hint) { vals = uniq(vals); if (!vals.length || !vals.every(isFinite)) return; if (vals.length === Q.vals.length && vals.every(function (x, i) { return same(x, Q.vals[i]); })) return; if (out.some(function (w) { return w.vals.length === vals.length && w.vals.every(function (x, i) { return same(x, vals[i]); }); })) return; out.push({ vals: vals, code: cp + code, hint: hint }); }
    if (b) add(rootsOf(a, -b, c), 'negb', 'The formula starts with ' + t('-b') + '. Here ' + t('b=' + nT(b)) + ', so ' + t('-b=' + nT(-b)) + '.');
    if (b < 0) { var D1 = cl(-b * b - 4 * a * c); if (D1 >= 0) add(rootsOf(a, b, c, D1), 'bsq', 'Square ' + t('b') + ' with brackets: ' + t('(' + nT(b) + ')^{2}=' + nT(b * b)) + ', not ' + t(nT(-b * b)) + '.'); }
    if (a * c) { var D2 = cl(b * b + 4 * a * c); if (D2 >= 0) add(rootsOf(a, b, c, D2), '4ac', 'Check the sign of ' + t('-4ac') + ': ' + t('-4(' + nT(a) + ')(' + nT(c) + ')=' + nT(-4 * a * c)) + '.'); }
    if (D > 0) {
      var m = -b / (2 * a), sD = Math.sqrt(D);
      add([m - sD, m + sD], 'half', 'Divide <b>every</b> term of the numerator by ' + t('2a') + ', not just ' + t('-b') + '.');
      if (Q.irr && Q.k > 1) add([m - Q.k * Math.sqrt(Q.f), m + Q.k * Math.sqrt(Q.f)], 'half', 'Divide <b>every</b> term of the numerator by ' + t('2a') + ': the ' + t('-b') + ' term <b>and</b> the radical term.');
      if (Q.irr && Q.g > 1) add([(-b - Q.Kc * Math.sqrt(Q.f)) / (2 * a / Q.g), (-b + Q.Kc * Math.sqrt(Q.f)) / (2 * a / Q.g)], 'half', 'To reduce, divide <b>every</b> term (' + t('-b') + ', the radical’s coefficient and ' + t('2a') + ') by the same common factor.');
      add([(-b - sD) / a, (-b + sD) / a], '2a', 'The whole numerator is divided by ' + t('2a=' + nT(2 * a)) + ', not by ' + t('a') + '.');
    }
    if (D < 0) add(rootsOf(a, b, c, -D), 'neg-disc', 'Here ' + t('b^{2}-4ac=' + nT(D)) + ' is negative, and a negative number has no real square root.');
    return out;
  }
  Z.fmlWrongs = fmlWrongs;

  /* random integer coefficients. spec: { a: [list], b: [lo, hi], c: [lo, hi], test(Q), avoid } */
  function gen(r, sp) {
    return pickWhere(function () { var a = r.pick(sp.a), b = r.int(sp.b[0], sp.b[1]), c = r.int(sp.c[0], sp.c[1]); return qf(a, b, c); },
      function (Q) { return Q.a !== 0 && Q.c !== 0 && (!sp.avoid || sp.avoid(Q.a, Q.b, Q.c)) && (!sp.test || sp.test(Q)) && (sp.prim === false || gcd(gcd(Q.a, Q.b), Q.c) === 1); });
  }
  Z.gen = gen;

  /* ---- roots ---- */
  function isNone(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(text|mathrm|textrm)\{([^{}]*)\}/g, '$2').replace(/\\[ ,;:!]|~|\s+|-/g, '').toLowerCase();
    return /^(no(real)?(solutions?|roots?|zeros?|xintercepts?|values?)|nosol(ution)?s?|none|thereisnosolution|\\emptyset|\\varnothing|∅|\{\}|\\\{\\\})\.?$/.test(s);
  }
  function rootList(resp, v, params) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\text\{\s*(or|and)\s*\}/gi, ',').replace(/\b(or|and)\b/gi, ',').replace(/;/g, ',').replace(/\\approx|≈|\\doteq/g, '=')
      .replace(/\\(text|mathrm)\{\s*(m|cm|s|seconds?|metres?|units?)\s*\}/g, '').replace(/_\{?\d\}?/g, '');
    var m, re = /([a-zA-Z])\s*=/g;
    while ((m = re.exec(s))) if (m[1] !== v) return { letter: m[1] };
    s = s.replace(/(^|[^a-zA-Z\\])[a-zA-Z]\s*=\s*/g, '$1').replace(/\\mp|∓/g, '\\pm').replace(/±/g, '\\pm');
    if (!s.trim()) return { empty: true };
    var pieces = s.split(','), out = [], asts = [], dec = false;
    for (var i = 0; i < pieces.length; i++) {
      var pc = pieces[i].trim(); if (!pc) continue;
      if (!/sqrt|√/.test(pc) && /\\times|\\cdot|[×*·]/.test(pc) && !params) return { unsimp: true };
      var vars = pc.indexOf('\\pm') >= 0 ? [pc.replace(/\\pm/g, '+'), pc.replace(/\\pm/g, '-')] : [pc];
      for (var j = 0; j < vars.length; j++) {
        var src = vars[j].replace(/^\s*\+/, '').replace(/([({]|\\frac\{)\s*\+/g, '$1');
        var a = K.read(src); if (a.res) return { bad: true };
        var vs = Object.keys(ex.shape(a.ast).vars);
        if (params) { if (vs.some(function (x) { return params.indexOf(x) < 0; })) return { bad: true }; }
        else { if (vs.length || !isFinite(a.val)) return { bad: true }; }
        if (ex.shape(a.ast).decimals) dec = true;
        out.push(params ? a.ast : a.val); if (j === 0) asts.push(a.ast);
      }
    }
    if (!out.length) return { empty: true };
    return { vals: out, asts: asts, dec: dec, n: pieces.length };
  }
  function sameSet(A, T, tol) { tol = tol || same; return A.length === T.length && A.every(function (x) { return T.some(function (y) { return tol(x, y); }); }) && T.every(function (y) { return A.some(function (x) { return tol(x, y); }); }); }
  function unp(n) { while (n && n.t === 'paren') n = n.a; return n; }
  function termCoefs(n) {
    var out = [];
    (function walk(x, s) { x = unp(x); if (x.t === 'add') { walk(x.a, s); walk(x.b, s); } else if (x.t === 'sub') { walk(x.a, s); walk(x.b, -s); } else if (x.t === 'neg') walk(x.a, -s); else out.push(x); })(n, 1);
    var cs = [];
    for (var i = 0; i < out.length; i++) {
      var v = ex.value(out[i]), m = null;
      (function find(x) { if (!x || typeof x !== 'object' || m != null) return; if (x.t === 'root') { var q = ex.rat(x.a); if (q && q[1] === 1) m = q[0]; return; } ['a', 'b'].forEach(function (k) { if (x[k]) find(x[k]); }); })(out[i]);
      var c = m ? v / Math.sqrt(m) : v; if (!isInt(c)) return null; cs.push(Math.round(c));
    }
    return cs;
  }
  function exactIssue(cp, ast) {
    var issue = null;
    (function walk(n) {
      if (!n || typeof n !== 'object' || issue) return;
      if (n.t === 'root') { var r = ex.rat(n.a), idx = n.n ? ex.rat(n.n) : [2, 1]; if (r && idx && idx[0] === 2 && idx[1] === 1) { if (r[1] !== 1) issue = 'frac'; else if (isSq(r[0])) issue = 'eval'; else if (r[0] > 0 && sqf(r[0])[0] > 1) issue = 'surd'; } }
      if (n.t === 'div') {
        var hasRoot = false; (function f(x) { if (!x || typeof x !== 'object' || hasRoot) return; if (x.t === 'root') { hasRoot = true; return; } ['a', 'b'].forEach(function (k) { if (x[k]) f(x[k]); }); })(n.b);
        if (hasRoot) issue = 'den';
        var pf = ex.plainFraction(n); if (!issue && pf && (pf[1] === 1 || gcd(pf[0], pf[1]) > 1)) issue = 'lowest';
      }
      ['a', 'b'].forEach(function (k) { if (n[k] && typeof n[k] === 'object') walk(n[k]); });
    })(ast);
    if (issue === 'surd') return form(cp + 'surd', 'Right roots — now simplify the radical: take every perfect-square factor out of the square root.');
    if (issue === 'eval') return form(cp + 'surd', 'Right roots — the square root of a perfect square is a whole number: work it out.');
    if (issue === 'frac') return form(cp + 'surd', 'Right roots — now simplify: no fraction under the square root (' + t('\\sqrt{\\frac{a}{b}}=\\frac{\\sqrt{ab}}{b}') + ').');
    if (issue === 'den') return form(cp + 'surd', 'Right roots — now simplify: no square root in the denominator.');
    if (issue === 'lowest') return form('lowest', 'Right roots — now reduce the fraction to lowest terms.');
    var top = unp(ast); if (top.t === 'neg') top = unp(top.a);
    if (top.t === 'div') {
      var D = ex.rat(top.b), cs = termCoefs(top.a);
      if (D && D[1] === 1 && cs) { var g = Math.abs(D[0]); cs.forEach(function (c) { g = gcd(g, c); }); if (g > 1) return form(cp + 'reduce', 'Right roots — now reduce: every term of the numerator and the denominator share the factor ' + t(g) + '.'); if (D[0] === 1 || D[0] === -1) return form('simplify', 'Right roots — a denominator of ' + t(D[0]) + ' isn’t needed: simplify.'); if (D[0] < 0) return form(cp + 'reduce', 'Right roots — now make the denominator positive (multiply the top and bottom by ' + t('-1') + ').'); }
    }
    return null;
  }
  /* vals: the roots; o: dp | irr (exact radicals), wrongs [{ vals, code, hint }], v, noneHint, single, what */
  function rootsChk(cp, vals, o) {
    o = o || {}; var v = o.v || 'x', T = uniq(vals), dp = o.dp, what = o.what || 'root';
    var RT = dp != null ? T.map(function (x) { return K.roundTo(x, dp); }) : null;
    var place = dp === 1 ? 'tenth' : dp === 2 ? 'hundredth' : dp === 3 ? 'thousandth' : dp === 0 ? 'whole number' : dp + ' decimal places';
    var wrongs = (o.wrongs || []).filter(function (w) { return w && w.vals.every(isFinite) && !sameSet(uniq(w.vals), T); });
    var near = function (x, y) { return Math.abs(x - y) < Math.pow(10, -dp) + 1e-9; };
    return function (resp) {
      if (isNone(resp)) return T.length ? wrong(cp + 'nosol-claim', o.noneHint || 'There are real roots here: ' + t('b^{2}-4ac') + ' is not negative. Substitute into the formula again.') : ok();
      var L = rootList(resp, v);
      if (L.letter) return form('sol-letter', 'Use the variable ' + t(v) + ' here (you wrote ' + t(L.letter + '=') + ').');
      if (L.empty) return form('empty', 'Type your answer first (or <b>no real roots</b>).');
      if (L.unsimp) return form('simplify', 'Simplify each value to a single number (no ' + t('\\times') + ' between numbers).');
      if (L.bad) return form('unreadable', 'Write the ' + what + 's as numbers separated by commas, e.g. ' + t(v + '=2\\pm\\sqrt{5}') + ' or ' + t(v + '=3,\\ ' + v + '=-5') + ', or type <b>no real roots</b>.');
      var A = uniq(L.vals);
      if (!T.length) { for (var w0 = 0; w0 < wrongs.length; w0++) if (sameSet(A, uniq(wrongs[w0].vals), dp != null ? near : null)) return wrong(wrongs[w0].code, wrongs[w0].hint); return wrong(cp + 'none-roots', o.noneWrong || 'Work out ' + t('b^{2}-4ac') + ' first: it is negative here, so there are no real roots.'); }
      if (dp != null) {
        if (sameSet(A, RT)) return ok();
        var close = function (x, y) { return Math.abs(x - y) <= Math.pow(10, -dp) * 0.5 + 1e-9; };
        if (sameSet(A, T)) return form('round', 'Right — now give each ' + what + ' to the nearest ' + place + '.');
        if (sameSet(A, T, near)) return sameSet(A, T, close) ? form('round', 'Right — now round each ' + what + ' to the nearest ' + place + '.') : wrong(cp + 'round', 'Close — check your rounding to the nearest ' + place + '. Round only at the end.');
        for (var i = 0; i < wrongs.length; i++) if (sameSet(A, uniq(wrongs[i].vals), near)) return wrong(wrongs[i].code, wrongs[i].hint);
      } else {
        if (sameSet(A, T)) {
          if (L.dec && o.irr) return form(cp + 'exact', 'Give the <b>exact</b> ' + what + 's (with a square root, in simplest form), not calculator decimals.');
          for (var k = 0; k < L.asts.length; k++) {
            var fi = exactIssue(cp, L.asts[k]); if (fi) return fi;
            if (!o.irr) { var sh = ex.shape(L.asts[k]); if (sh.ops || sh.roots || sh.pow || sh.muls || (sh.divs && !ex.plainFraction(L.asts[k]))) return form('simplify', 'Right ' + what + 's — now simplify each one to a single number (a fraction in lowest terms).'); }
          }
          return ok();
        }
        if (L.dec && sameSet(A, T, function (x, y) { return Math.abs(x - y) < 0.01; })) return form(cp + 'exact', 'Give the <b>exact</b> ' + what + 's, not rounded decimals.');
        for (var j = 0; j < wrongs.length; j++) if (sameSet(A, uniq(wrongs[j].vals))) return wrong(wrongs[j].code, wrongs[j].hint);
      }
      var tolx = dp != null ? near : same, TT = dp != null ? RT : T;
      var miss = TT.filter(function (y) { return !A.some(function (x) { return tolx(x, y); }); }), extra = A.filter(function (x) { return !TT.some(function (y) { return tolx(x, y); }); });
      if (miss.length && !extra.length) return wrong('sol-missing', 'Correct so far — but there is another ' + what + '. ' + (o.missHint || 'The ' + t('\\pm') + ' gives two values.'));
      if (extra.length && !miss.length) return wrong(o.extraCode || 'sol-extra', o.extraHint || 'You have a value that is not a ' + what + ' — substitute each one to check.');
      if (A.length === T.length && A.every(function (x) { return TT.some(function (y) { return tolx(-x, y); }); })) return wrong(cp + 'negb', 'Check the signs of your ' + what + 's (the formula starts with ' + t('-b') + ').');
      return wrong('value', null);
    };
  }
  function badOf(wrongs, T, dp, v) {
    v = v || 'x';
    var out = (wrongs || []).filter(function (w) { return w.vals.length && !sameSet(uniq(w.vals), uniq(T), dp != null ? function (x, y) { return Math.abs(K.roundTo(x, dp) - K.roundTo(y, dp)) < 1e-9; } : null); })
      .map(function (w) { return uniq(w.vals).map(function (x) { return v + '=' + (dp != null ? K.roundTo(x, dp).toFixed(dp) : String(x)); }).join(',\\ '); });
    if (T.length) out.push('\\text{no real roots}'); else out.push(v + '=1');
    return out.filter(function (b, i, arr) { return arr.indexOf(b) === i; });
  }
  var PH = 'e.g. x = 2 ± sqrt(5)  or  no real roots';
  function rootsPart(cp, prompt, vals, o) {
    o = o || {}; var v = o.v || 'x', T = uniq(vals);
    var key = o.key || (T.length ? T.map(function (x) { return v + '=' + (o.dp != null ? K.roundTo(x, o.dp).toFixed(o.dp) : vT(x)); }).join(',\\ ') : '\\text{no real roots}');
    return { prompt: prompt, input: { type: 'math', keys: 'p57', vars: [v], before: o.before, placeholder: o.placeholder || PH.replace(/x/, v) }, check: rootsChk(cp, vals, o), key: key,
      answer: o.answer || (T.length ? t(dfr(key)) : 'no real roots'), solution: o.sol, hints: o.hints || [], text: o.text, bad: badOf(o.wrongs, T, o.dp, v).concat(o.bad || []), good: o.good || [], outcome: OUT };
  }
  /* solve ax² + bx + c = 0 with the formula. o: dp, v, sol, pre (working before the formula), hints, text, wrongs (extra), abc */
  function solvePart(cp, prompt, a, b, c, o) {
    o = o || {}; var v = o.v || 'x', Q = qf(a, b, c), exact = o.dp == null;
    var spec = { dp: o.dp, v: v, irr: exact && !!Q.irr, wrongs: (o.wrongs || []).concat(o.noWrongs ? [] : fmlWrongs(cp, a, b, c)), noneHint: o.noneHint, what: o.what };
    var key = exact && Q.int ? keyT(Q, v) : null, good = [];
    if (exact && Q.irr) { good.push(v + '=' + oneT(Q, 1) + ',\\ ' + v + '=' + oneT(Q, -1)); }
    if (exact && Q.irr && Q.Den > 1 && Q.N % Q.Den === 0) good.push(v + '=' + nT(Q.N / Q.Den) + '\\pm\\frac{' + radT(Q.Kc, Q.f) + '}{' + Q.Den + '}');
    if (!Q.n) good.push('\\text{no real roots}', 'none');
    var bad = [];
    if (exact && Q.irr) { bad.push(v + '=' + Q.vals.map(function (x) { return x.toFixed(3); }).join(',\\ ' + v + '=')); if (Q.k > 1 || a < 0) bad.push(v + '=\\frac{' + nT(-b) + '\\pm\\sqrt{' + Q.D + '}}{' + nT(2 * a) + '}'); if (Q.k > 1 && Q.g > 1) bad.push(v + '=\\frac{' + nT(-b) + '\\pm ' + radT(Q.k, Q.f) + '}{' + nT(2 * a) + '}'); }
    var p = rootsPart(cp, prompt, Q.vals, Object.assign({}, spec, { key: key || undefined, sol: o.sol || ((o.pre ? o.pre + '<br>' : '') + solF(a, b, c, { dp: o.dp, v: v, abc: o.abc }) + (o.post ? '<br>' + o.post : '')), hints: o.hints || HF, text: o.text, good: good.concat(o.good || []), bad: bad.concat(o.bad || []), answer: o.answer }));
    return p;
  }
  var HF = ['Write the equation in standard form, read ' + t('a') + ', ' + t('b') + ' and ' + t('c') + ' with their signs, then use ' + t('x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}') + '.', 'Work out ' + t('b^{2}-4ac') + ' first, simplify the radical, then divide every term by any common factor.'];
  Z.isNone = isNone; Z.rootList = rootList; Z.sameSet = sameSet; Z.exactIssue = exactIssue; Z.rootsChk = rootsChk; Z.roots = rootsPart; Z.solve = solvePart; Z.HF = HF; Z.badOf = badOf;

  /* ---- an exact number (fractions allowed; lowest terms) ---- */
  function numChk(cp, T, cands, o) {
    o = o || {};
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{[^}]*\}/g, '').replace(/\\?\$/g, '').replace(/\\[,;:! ]|~/g, '').replace(/^\s*[a-zA-Z]\s*=\s*/, '').replace(/\s*(m|cm|s|terms?|units?)(\^\{?2\}?)?\s*$/i, '');
      var a = K.read(s); if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (Object.keys(sh.vars).length || !isFinite(a.val)) return form('unreadable', 'Give a single number.');
      if (same(a.val, T)) {
        var pf = ex.plainFraction(a.ast);
        if (sh.ops || sh.roots || sh.pow || sh.muls || (sh.divs && !pf)) return form('simplify', 'Right value — now simplify it to a single number.');
        if (pf && pf[1] !== 1 && gcd(pf[0], pf[1]) > 1) return form('lowest', 'Right value — now reduce the fraction to lowest terms.');
        return ok();
      }
      var c = cands || [];
      for (var i = 0; i < c.length; i++) if (c[i] && isFinite(c[i][0]) && !same(c[i][0], T) && same(a.val, c[i][0])) return wrong(c[i][1], c[i][2]);
      if (sh.decimals && !isInt(T) && Math.abs(a.val - T) < 0.006 * Math.max(1, Math.abs(T)) && !o.allowRound) return form(cp + 'exact', 'Give the exact value (a fraction), not a rounded decimal.');
      if (T !== 0 && same(a.val, -T)) return wrong('sign', 'Check the sign.');
      return wrong('value', null);
    };
  }
  function numPart(cp, prompt, T, o) {
    o = o || {};
    var key = o.key || vT(T).replace(/\\,/g, ''), frac = !/^-?[\d.]+$/.test(key);
    return { prompt: prompt, input: frac || o.math ? { type: 'math', keys: 'p57', before: o.before, after: o.after } : { type: 'number', before: o.before, after: o.after, nr: !!o.nr }, check: numChk(cp, T, o.cands, o), key: key,
      answer: t((o.ansPre || '') + key + (o.unit ? '\\text{ ' + o.unit + '}' : '')), solution: o.sol, hints: o.hints || [], text: o.text, outcome: OUT,
      bad: (o.cands || []).filter(function (c) { return c && isFinite(c[0]) && !same(c[0], T); }).map(function (c) { return String(cl(c[0])); }).concat(o.bad || []) };
  }
  function cdiag(cands, dp) {
    return function (v) {
      var c = cands || [];
      for (var i = 0; i < c.length; i++) { if (!c[i] || !isFinite(c[i][0])) continue; if (same(v, c[i][0]) || (dp != null && Math.abs(v - K.roundTo(c[i][0], dp)) < 1e-9)) return { code: c[i][1], hint: c[i][2] }; }
      return null;
    };
  }
  function apxPart(prompt, x, dp, o) {
    o = o || {}; var want = K.roundTo(x, dp);
    var bad = (o.cands || []).filter(function (c) { return c && isFinite(c[0]) && Math.abs(K.roundTo(c[0], dp) - want) > 1e-9; }).map(function (c) { return K.roundTo(c[0], dp).toFixed(dp); });
    return { prompt: prompt, input: { type: 'number', before: o.before, after: o.after, nr: !!o.nr }, check: K.approx(x, dp, { diag: cdiag(o.cands, dp), nr: o.nr }), key: want.toFixed(dp),
      answer: t(F(want.toFixed(dp)) + (o.unit ? '\\text{ ' + o.unit + '}' : '')), solution: o.sol, hints: o.hints || [], text: o.text, bad: bad.filter(function (b) { return !o.nr || b.replace('-', '').length <= 4; }), outcome: OUT };
  }
  Z.numChk = numChk; Z.num = numPart; Z.cdiag = cdiag; Z.apx = apxPart;
  Z.nr = function (prompt, x, dp, o) { o = Object.assign({}, o || {}, { nr: true }); return apxPart(prompt, x, dp, o); };
  Z.nrInt = function (prompt, n, o) { o = o || {}; var p = B.nr(prompt, n, cdiag(o.cands), o.sol, o.hints || [], o.text); p.outcome = OUT; p.bad = (o.cands || []).filter(function (c) { return c[0] !== n && isInt(c[0]) && c[0] >= 0 && String(c[0]).length <= 4; }).map(function (c) { return String(c[0]); }); return p; };

  /* ---- an equation in standard form: any non-zero multiple of the target, right side 0, integer coefficients ---- */
  function coefs(p) { var r = function (q) { return q[0] / q[1]; }; return [r(P.coef(p, { x: 2 })), r(P.coef(p, { x: 1 })), r(P.constant(p))]; }
  function propTo(A, T) { if (same(A[0], 0) && same(T[0], 0)) return false; var k = null; for (var i = 0; i < 3; i++) { if (same(T[i], 0)) { if (!same(A[i], 0)) return false; continue; } var q = A[i] / T[i]; if (k == null) k = q; else if (!same(k, q)) return false; } return k != null && !same(k, 0); }
  function termsOf(ast) { var n = 0; (function w(x) { x = unp(x); if (x && (x.t === 'add' || x.t === 'sub')) { w(x.a); w(x.b); } else n++; })(ast); return n; }
  function stdChk(cp, T, cands) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '');
      if (!s.trim()) return form('empty', 'Type the equation first.');
      var sides = s.split('='); if (sides.length > 2) return form('unreadable', 'Write one equation, ' + t('ax^{2}+bx+c=0') + '.');
      var L = P.read(sides[0]), R = sides.length === 2 ? P.read(sides[1]) : { ok: true, p: P.num(0) };
      if (!L.ok || !R.ok) return form('unreadable', 'Write the equation as ' + t('ax^{2}+bx+c=0') + ' (no brackets or fractions with ' + t('x') + ' in the denominator).');
      var Dp = P.sub(L.p, R.p);
      if (P.vars(Dp).some(function (x) { return x !== 'x'; })) return form('unreadable', 'Use only the variable ' + t('x') + '.');
      if (P.degree(Dp) > 2) return wrong('value', 'Standard form is ' + t('ax^{2}+bx+c=0') + ': the highest power is ' + t('x^{2}') + '.');
      var A = coefs(Dp);
      if (propTo(A, T)) {
        if (!P.isZero(R.p)) return form(cp + 'std-zero', 'Right — now move every term to the left side, so the right side is ' + t('0') + '.');
        var Lc = coefs(L.p); if (!Lc.every(isInt)) return form(cp + 'std-frac', 'Right — now clear the fractions (or decimals): multiply every term by the same number so the coefficients are integers.');
        if (termsOf(L.ast) > Lc.filter(function (x) { return !same(x, 0); }).length || /\(/.test(sides[0])) return form('simplify', 'Right — now expand and collect like terms.');
        return ok();
      }
      var c = cands || [];
      for (var i = 0; i < c.length; i++) if (propTo(A, c[i][0])) return wrong(c[i][1], c[i][2]);
      return wrong('value', 'Check your expanding and collecting: substitute a value of ' + t('x') + ' into the original equation and into yours.');
    };
  }
  Z.stdChk = stdChk; Z.propTo = propTo;

  /* ---- a point (x, 0) rounded ---- */
  function ptRound(X, Y, dp) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\s|\\[,;:! ]/g, '');
      if (!s) return form('empty', 'Type the point first.');
      var m = /^\((.+),(.+)\)$/.exec(s);
      if (!m) return form('point-form', 'Write the intercept as a point, ' + t('(x,\\ 0)') + '.');
      var ax = K.read(m[1]), ay = K.read(m[2]); if (ax.res || ay.res) return form('unreadable', 'Write each coordinate as a number, e.g. ' + t('(2.35,\\ 0)') + '.');
      if (!same(ay.val, Y)) return wrong(CP + 'pt-y', 'An ' + t('x') + '-intercept is on the ' + t('x') + '-axis, so its ' + t('y') + '-coordinate is ' + t('0') + '.');
      var want = K.roundTo(X, dp);
      if (Math.abs(ax.val - want) < 1e-9) return ok();
      if (same(ax.val, X) || Math.abs(K.roundTo(ax.val, dp) - want) < 1e-9) return form('round', 'Right — now round to the nearest ' + (dp === 2 ? 'hundredth' : 'tenth') + '.');
      return wrong('value', null);
    };
  }
  Z.ptRound = ptRound;

  /* ---- roots in terms of a parameter (e.g. x = a(2 ± √3)); fns: the roots as functions of the parameter ---- */
  function prChk(cp, fns, o) {
    o = o || {}; var pv = o.p || 'a', v = o.v || 'x', PTS = o.pts || [1.3, 2.7, 4.1, 5.6];
    function sig(f) { return PTS.map(function (x) { return f(x); }); }
    var T = fns.map(sig);
    var eqS = function (A, Bs) { return A.length === Bs.length && A.every(function (x) { return Bs.some(function (y) { return x.every(function (u, i) { return same(u, y[i]); }); }); }) && Bs.every(function (y) { return A.some(function (x) { return x.every(function (u, i) { return same(u, y[i]); }); }); }); };
    return function (resp) {
      if (isNone(resp)) return wrong(cp + 'nosol-claim', 'There are real roots: the discriminant is never negative here.');
      var L = rootList(resp, v, [pv]);
      if (L.letter) return form('sol-letter', 'Use ' + t(v + '=') + ' (you wrote ' + t(L.letter + '=') + ').');
      if (L.empty) return form('empty', 'Type your answer first.');
      if (L.bad) return form('unreadable', 'Write the roots in terms of ' + t(pv) + ', e.g. ' + t(v + '=' + pv + '(1\\pm\\sqrt{2})') + '.');
      var A = [], seen = {};
      L.vals.forEach(function (ast) { var sg = sig(function (x) { var e = {}; e[pv] = x; return ex.value(ast, e); }); var k = sg.map(function (u) { return u.toFixed(7); }).join(); if (!seen[k]) { seen[k] = 1; A.push(sg); } });
      if (A.some(function (x) { return !x.every(isFinite); })) return wrong('value', null);
      if (eqS(A, T)) {
        var rad = false; L.asts.forEach(function (a) { (function w(n) { if (!n || typeof n !== 'object') return; if (n.t === 'root' && Object.keys(ex.shape(n.a).vars).length) rad = true; ['a', 'b'].forEach(function (k) { if (n[k]) w(n[k]); }); })(a); });
        if (rad) return form(cp + 'surd', 'Right roots — now simplify the radical: ' + t('\\sqrt{' + pv + '^{2}}=' + pv) + (o.pos ? ' (since ' + t(pv + '>0') + ')' : '') + '.');
        for (var k2 = 0; k2 < L.asts.length; k2++) { var top = unp(L.asts[k2]); if (top.t === 'div') { var D = ex.rat(top.b); if (D && D[1] === 1 && Math.abs(D[0]) > 1 && o.noDen) return form(cp + 'reduce', 'Right roots — now divide every term by the denominator.'); } }
        return ok();
      }
      var c = o.cands || [];
      for (var i = 0; i < c.length; i++) if (eqS(A, c[i][0].map(sig))) return wrong(c[i][1], c[i][2]);
      if (A.length < T.length && A.every(function (x) { return T.some(function (y) { return x.every(function (u, j) { return same(u, y[j]); }); }); })) return wrong('sol-missing', 'Correct so far — but the ' + t('\\pm') + ' gives another root.');
      return wrong('value', 'Substitute a value of ' + t(pv) + ' to check your roots.');
    };
  }
  Z.prChk = prChk;

  /* ---- several boxes. spec: { label, name, chk, key, ans (tex), mode ('math' | 'text' | number), keys, vars, placeholder, before, after } ---- */
  Z.fields = function (prompt, specs, o) {
    o = o || {};
    var fields = specs.map(function (s) { return { label: s.label, name: s.name || String(s.label || '').replace(/<[^>]+>|\\\(|\\\)/g, '').replace(/:\s*$/, ''), before: s.before, after: s.after, mode: s.mode, keys: s.mode === 'math' ? (s.keys || 'p57') : undefined, vars: s.vars || ['x'], placeholder: s.placeholder, wide: s.mode === 'math' }; });
    var p = B.fields(prompt, fields, specs.map(function (s) { return s.chk; }), specs.map(function (s) { return s.key; }), specs.map(function (s) { return (s.label ? s.label + ' ' : '') + (s.ansHtml || t(dfr(s.ans != null ? s.ans : s.key))); }).join('<br>'), o.sol, o.hints || [], o.text);
    (o.swap || []).forEach(function (sw) {
      var i = sw[0], j = sw[1], inner = p.check;
      p.check = function (resp) { var r1 = inner(resp); if (r1.v === 'correct' || !Array.isArray(resp)) return r1; var s2 = resp.slice(); s2[i] = resp[j]; s2[j] = resp[i]; var r2 = inner(s2); return r2.v === 'correct' ? r2 : r1; };
    });
    p.bad = o.bad; p.good = o.good; p.outcome = OUT;
    return p;
  };
  /* field specs for common boxes */
  Z.fRoots = function (cp, label, vals, o) { o = o || {}; var T = uniq(vals), v = o.v || 'x'; return { label: label, mode: 'math', vars: [v], chk: rootsChk(cp, vals, o), key: o.key || (T.length ? T.map(function (x) { return v + '=' + (o.dp != null ? K.roundTo(x, o.dp).toFixed(o.dp) : vT(x)); }).join(',\\ ') : '\\text{no real roots}'), placeholder: o.placeholder || PH.replace(/x/, v) }; };
  Z.fNum = function (cp, label, T, o) { o = o || {}; var key = o.key || vT(T).replace(/\\,/g, ''), frac = !/^-?[\d.]+$/.test(key); return { label: label, mode: frac || o.math ? 'math' : undefined, chk: numChk(cp, T, o.cands, o), key: key, after: o.after, before: o.before }; };
  Z.fApx = function (label, x, dp, o) { o = o || {}; var key = K.roundTo(x, dp).toFixed(dp); return { label: label, chk: K.approx(x, dp, { diag: cdiag(o.cands, dp) }), key: key, ans: F(key), after: o.after, before: o.before }; };
  Z.mc = function (r, prompt, opts, sol, hints, text, keep) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k]) return; seen[k] = 1; out.push(op); });
    var p = B.mc(r, prompt, out, sol, hints || [], text, keep); p.outcome = OUT; return p;
  };
  Z.work = function (lines) { return '<div class="work" style="border:1px solid rgba(128,128,128,.55);border-radius:6px;padding:.45em .9em;margin:.4em 0;display:inline-block">' + lines.map(function (l) { return t(l); }).join('<br>') + '</div>'; };

  /* ---- keypad ---- */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = {
      del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      enter: { label: 'Check ↵', fn: 'enter', wide: true }, minus: { label: '−', tex: '-', plain: '-' }, plus: { label: '+', tex: '+', plain: '+' }, dot: { label: '.', tex: '.', plain: '.' },
      frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' },
      par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Brackets' }, comma: { label: ',', tex: ',', plain: ', ' }, eq: { label: '=', tex: '=', plain: ' = ' },
      x: { label: '<i>x</i>', tex: 'x', plain: 'x' }, sq: { label: 'x<sup>2</sup>', tex: '^{2}', plain: '^2', title: 'Squared' }, pm: { label: '±', tex: '\\pm ', plain: '±' },
      none: { label: 'no real roots', tex: '\\text{no real roots}', plain: 'no real roots', title: 'No real roots' }
    };
    W.KEYSETS.p57 = function (opt) {
      var vs = (opt && opt.vars && opt.vars.length ? opt.vars : ['x']).slice(0, 2).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; });
      return [[d(7), d(8), d(9), KY.frac, KY.sqrt, KY.del], [d(4), d(5), d(6), KY.par, KY.comma, KY.clear], [d(1), d(2), d(3), KY.plus, KY.minus, KY.left, KY.right], [d(0), KY.dot].concat(vs, [KY.eq, KY.sq, KY.pm]), [KY.none, KY.enter]];
    };
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.p57 = ['Two roots: use <b>±</b>, e.g. ' + HW.k('x=\\frac{-3\\pm\\sqrt{15}}{3}') + ', or separate them with a comma. Press <b>no real roots</b> if there are none.', 'Type e.g. <code>x = (-3 ± sqrt(15))/3</code>, <code>x = 2, x = -5</code> or <code>no real roots</code>.'];
  }

  /* ---- codes ---- */
  var CODES = {
    'u5l7-negb': 'Formula: used b instead of −b', 'u5l7-bsq': 'Formula: squared a negative b without brackets', 'u5l7-4ac': 'Formula: sign error in −4ac', 'u5l7-half': 'Formula: divided only one term of the numerator by 2a',
    'u5l7-2a': 'Formula: divided by a instead of 2a', 'u5l7-nosol-claim': 'Said “no real roots” when there are real roots', 'u5l7-none-roots': 'Gave roots when there are no real roots', 'u5l7-neg-disc': 'Took the square root of a negative discriminant',
    'u5l7-exact': 'Gave decimals where exact roots were asked', 'u5l7-surd': 'Radical not in simplest form', 'u5l7-reduce': 'Common factor not divided out', 'u5l7-round': 'Rounding slip (rounded too early or wrongly)',
    'u5l7-std': 'Used a, b, c before writing the equation in standard form', 'u5l7-std-sign': 'Standard form: moved a term without changing its sign', 'u5l7-std-zero': 'Standard form: right side not 0', 'u5l7-std-frac': 'Standard form: fractions or decimals not cleared',
    'u5l7-std-exp': 'Standard form: expanding slip', 'u5l7-cs-p': 'Completing the square: sign of p', 'u5l7-cs-k': 'Completing the square: wrong constant on the right', 'u5l7-cs-div': 'Completing the square: didn’t divide by a first',
    'u5l7-neg-root': 'Kept a negative time or length', 'u5l7-vertex': 'Gave the time of the maximum height', 'u5l7-h0': 'Left out the starting height', 'u5l7-height-sign': 'Set up h = H with the wrong sign',
    'u5l7-perim': 'Used the whole perimeter for the sum of two sides', 'u5l7-legs': 'Right triangle: gave the wrong leg', 'u5l7-n-round': 'Rounded a non-natural number of terms', 'u5l7-n-neg': 'Kept the negative number of terms',
    'u5l7-method': 'Chose a less efficient method', 'u5l7-errors': 'Error analysis: wrong errors identified', 'u5l7-pt-y': 'Intercept point with y ≠ 0', 'u5l7-factor': 'Factoring slip', 'u5l7-mc': 'Multiple choice: classic formula slip',
    'u5l7-param': 'Roots in terms of a parameter: slip', 'u5l7-ratio': 'Golden-ratio type: kept the negative root'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u5l7-negb': 's', 'u5l7-bsq': 's', 'u5l7-4ac': 'b', 'u5l7-half': 's', 'u5l7-2a': 'b', 'u5l7-nosol-claim': 'n', 'u5l7-none-roots': 'n', 'u5l7-neg-disc': 'b', 'u5l7-round': 's', 'u5l7-std': 'b', 'u5l7-std-sign': 'b', 'u5l7-std-exp': 'b',
    'u5l7-cs-p': 's', 'u5l7-cs-k': 'b', 'u5l7-cs-div': 'b', 'u5l7-neg-root': 's', 'u5l7-vertex': 'n', 'u5l7-h0': 'b', 'u5l7-height-sign': 'b', 'u5l7-perim': 'b', 'u5l7-legs': 's', 'u5l7-n-round': 'b', 'u5l7-n-neg': 's', 'u5l7-ratio': 's', 'u5l7-param': 'b' });

  /* =========================== Lesson 7 =========================== */
  /* the lesson's examples and the booklet's own equations [a, b, c] */
  var AV = avoid([[3, -12, 7], [1, 4, -3], [9, -6, -4], [1, 2, -14], [6, 1, -15], [2, 6, -3], [1, -2, 6], [2, -4, -3], [5, 0, -45], [1, 0, -9], [1, -1, -20], [3, 5, -1], [1, -6, -1], [2, -3, -6], [3, -4, -2], [4, -12, -5], [1, 6, -24],
    [1, 2, -15], [6, -7, -3], [1, -6, 2], [2, 8, 3], [1, -8, 4], [1, 10, 18], [4, -4, -7], [3, 4, -2], [1, 3, 5], [5, -2, -1], [3, 1, -5], [5, -8, 2], [1, -14, 9], [-2, 6, 5], [3, 6, -2], [7, 0, -28], [1, 9, 14],
    [1, -5, 1], [2, 1, -4], [1, -7, 5], [1, 4, -1], [2, 0, -6], [3, 4, -12], [1, -2, -5], [4, 8, -3], [3, -5, -2], [4, -8, 1], [2, -7, 1], [1, 8, 3], [3, 1, -200], [1, -14, 42], [2, 6, -135], [1, -6, -24],
    [1, -4, -1], [1, 6, 4], [2, -2, -1], [9, 12, 1], [1, -3, 4], [3, -10, 5], [4, 7, -3], [-1, 5, 3], [10, -11, -6], [1, 10, 7], [1, 1, -11], [1, -4, 2], [1, -3, -2], [3, 7, 2], [1, 2, -6], [-1, 4, 2], [1, -15, 40], [1, -3, 1], [1, -1, -1]]);
  var SQF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23];
  /* formula types */
  function tA1j(r) { return pickWhere(function () { var m = nz(r, -8, 8), j = r.int(2, 3), f = r.pick([2, 3, 5, 6, 7]); return qf(1, -2 * m, m * m - j * j * f); }, function (Q) { return Q.c !== 0 && Math.abs(Q.c) <= 60 && AV(1, Q.b, Q.c); }); }
  function tA1(r) { return pickWhere(function () { var m = nz(r, -9, 9), f = r.pick(SQF); return qf(1, -2 * m, m * m - f); }, function (Q) { return Q.c !== 0 && Math.abs(Q.c) <= 70 && AV(1, Q.b, Q.c); }); }
  function tRed(r, kind) {
    return gen(r, { a: kind === 'kc' ? [2, 4, 6, 8, 9] : [2, 3, 4, 5, 6, 7], b: [-12, 12], c: [-12, 12], avoid: AV, test: function (Q) {
      if (!Q.irr || Q.g < 2 || Q.Den < 2 || Q.D > 300) return false;
      if (kind === 'kc') return Q.Kc > 1;
      if (kind === 'oddA') return Q.a % 2 === 1 && Q.Kc === 1 && Q.Den === Q.a && Q.b > 0;
      if (kind === 'negBC') return Q.Kc === 1 && Q.Den === Q.a && Q.b < 0 && Q.c < 0;
      return true;
    } });
  }
  function tPlain(r) { return gen(r, { a: [2, 3, 4, 5, 6], b: [-9, 9], c: [-9, 9], avoid: AV, test: function (Q) { return Q.irr && Q.g === 1 && Q.D < 200 && Q.b !== 0; } }); }
  function tNone(r) { return gen(r, { a: [1, 1, 2, 3], b: [-7, 7], c: [1, 12], avoid: AV, test: function (Q) { return Q.D < 0 && Q.b !== 0; } }); }
  /* roots away from a rounding boundary */
  function safe(vals, dp) { return vals.every(function (x) { var y = Math.abs(x) * Math.pow(10, dp); return Math.abs(y - Math.floor(y) - 0.5) > 0.06; }); }
  function rqT(Q, v) { return keyT(Q, v); }

  /* decomposition working for (m x + n)(p x + q) */
  function decSol(m, n, p, q) {
    var A = m * p, Bc = m * q + n * p, C = n * q, s1 = m * q, s2 = n * p;
    var lin = function (u, w) { return polyT([u, w]); };
    var grp = (m === 1 ? '' : m) + 'x(' + lin(p, q) + ')' + (n < 0 ? '-' : '+') + Math.abs(n) + '(' + lin(p, q) + ')';
    return t('ac=' + nT(A * C)) + ': ' + t(nT(s1)) + ' and ' + t(nT(s2)) + ' (product ' + t(nT(A * C)) + ', sum ' + t(nT(Bc)) + ').<br>' +
      t(polyT([A, 0, 0]) + (s1 < 0 ? '-' : '+') + (Math.abs(s1) === 1 ? '' : Math.abs(s1)) + 'x' + (s2 < 0 ? '-' : '+') + (Math.abs(s2) === 1 ? '' : Math.abs(s2)) + 'x' + (C < 0 ? '-' : '+') + Math.abs(C) + '=' + grp) + '<br>' +
      t('(' + lin(m, n) + ')(' + lin(p, q) + ')=0') + ', so ' + t('x=' + frT(-n, m)) + ' or ' + t('x=' + frT(-q, p)) + '.';
  }
  function decPick(r, avoidList) {
    return pickWhere(function () { return { m: r.int(2, 6), n: nz(r, -7, 7), p: r.int(1, 5), q: nz(r, -7, 7) }; }, function (o) {
      return gcd(o.m, o.n) === 1 && gcd(o.p, o.q) === 1 && o.p > 1 && o.m * o.q !== o.n * o.p && o.m * o.q + o.n * o.p !== 0 && Math.abs(o.m * o.q + o.n * o.p) <= 20 && AV(o.m * o.p, o.m * o.q + o.n * o.p, o.n * o.q) && Math.abs(o.n * o.q) <= 24 && (!avoidList || avoidList(o));
    });
  }
  function facWrongs(m, n, p, q) { return [{ is: HW.factor.tex([polyT([m, -n]), polyT([p, -q])]), code: CP + 'factor', hint: 'Check the signs in your brackets: expand them to compare with the trinomial.' }]; }

  /* completing the square for ax² + bx + c = 0 (b a multiple of 2a): (x − p)² = k */
  function csPart(r, a, b, c, lvl) {
    var p = -b / (2 * a), k = cl(p * p - c / a), Q = qf(a, b, c);
    var kT = vT(k);
    var sol = (a !== 1 ? t(polyT([1, b / a]) + '=' + vT(-c / a)) + ' (divide every term by ' + t(a) + ')<br>' : t(polyT([1, b]) + '=' + nT(-c)) + '<br>') +
      t(polyT([1, b / a]) + '+' + nT(p * p) + '=' + vT(-c / a) + '+' + nT(p * p)) + ' (add ' + t('\\left(\\frac{' + nT(b / a) + '}{2}\\right)^{2}=' + nT(p * p)) + ')<br>' +
      t('(' + polyT([1, -p]) + ')^{2}=' + kT) + ', so ' + t(keyT(Q)) + '<br>Check with the formula: ' + solF(a, b, c);
    var specs = [
      Z.fNum(CP, t('p='), p, { cands: [[-p, CP + 'cs-p', 'The bracket is ' + t('(x-p)') + ': ' + t('(' + polyT([1, -p]) + ')^{2}') + ' means ' + t('p=' + nT(p)) + '.'], a !== 1 ? [-b / 2, CP + 'cs-div', 'Divide every term by ' + t('a=' + a) + ' first, so the ' + t('x^{2}') + ' coefficient is 1.'] : null] }),
      Z.fNum(CP, t('k='), k, { cands: [[-c / a, CP + 'cs-k', 'Add ' + t('\\left(\\frac{b}{2}\\right)^{2}') + ' to <b>both</b> sides.'], [cl(-c / a - p * p), CP + 'cs-k', 'Add ' + t(nT(p * p)) + ' to both sides (don’t subtract it).'], a !== 1 ? [cl(b * b / 4 - c), CP + 'cs-div', 'Divide every term by ' + t('a=' + a) + ' first.'] : null] }),
      Z.fRoots(CP, 'Roots:', Q.vals, { irr: !!Q.irr, key: keyT(Q), wrongs: fmlWrongs(CP, a, b, c) })];
    return Z.fields('Solve ' + t(eqT(a, b, c)) + ' by completing the square: write it as ' + t('(x-p)^{2}=k') + ', then give the exact roots in simplest form. (Check with the quadratic formula.)', specs,
      { sol: sol, hints: ['Move the constant to the right' + (a !== 1 ? ' and divide every term by ' + t(a) : '') + ', then add ' + t('\\left(\\frac{b}{2}\\right)^{2}') + ' to both sides.', t('(x-p)^{2}=k') + ' gives ' + t('x=p\\pm\\sqrt{k}') + '; simplify the radical.'], text: 'complete the square, then roots' });
  }

  /* the student's error box for Q7 / Extra B3 */
  function q7shared(r) {
    return pickWhere(function () { var a = r.int(2, 5), m = r.int(1, 2), b = 2 * a * m, c0 = r.int(1, 9); return { a: a, b: b, c: -c0 }; }, function (o) {
      var Dw = o.b * o.b + 4 * o.a * o.c, Dc = o.b * o.b - 4 * o.a * o.c; if (Dw <= 0 || isSq(Dw) || sqf(Dw)[0] < 2 || isSq(Dc)) return false;
      var Q = qf(o.a, o.b, o.c); return Q.irr && Q.Den > 1 && AV(o.a, o.b, o.c) && Dc < 400;
    });
  }

  /* standard-form questions: L and R sides as polynomials; returns { a, b, c (reduced, integer), pre (working) } */
  function polyOf(tex) { return P.parse(tex); }
  function stdFields(prompt, Ltex, Rtex, std, o) {
    o = o || {};
    var a = std[0], b = std[1], c = std[2], Q = qf(a, b, c), g = gcd(gcd(a, b), c) || 1;
    var Lp = polyOf(Ltex), Rp = polyOf(Rtex), slip = coefs(P.add(Lp, Rp));
    var cands = [[slip, CP + 'std-sign', 'When a term moves to the other side, its sign changes: subtract the right side from both sides.']].concat(o.cands || []);
    var specs = [{ label: 'Standard form:', mode: 'math', chk: stdChk(CP, std, cands), key: eqT(a / g * (a < 0 ? -1 : 1), b / g * (a < 0 ? -1 : 1), c / g * (a < 0 ? -1 : 1)), placeholder: 'e.g. 2x^2 - 3x - 1 = 0', keys: 'p57' },
      Z.fRoots(CP, 'Roots:', Q.vals, { irr: !!Q.irr, key: keyT(Q), wrongs: fmlWrongs(CP, a, b, c).concat(o.wrongs || []) })];
    return Z.fields(prompt, specs, { sol: o.pre + '<br>' + (o.sqrtSol || solF(a / g, b / g, c / g)), hints: ['Expand, then move every term to the left side and collect like terms' + (o.hint ? '; ' + o.hint : '') + '.', 'Then use the quadratic formula (or square roots if there is no ' + t('x') + ' term).'], text: o.text });
  }

  var QUESTIONS = [
    { num: '1', shared: function (r) { return pickWhere(function () { return { r1: nz(r, -9, 9), r2: nz(r, -9, 9) }; }, function (o) { return o.r1 !== o.r2 && o.r1 !== -o.r2 && AV(1, -(o.r1 + o.r2), o.r1 * o.r2) && Math.abs(o.r1 * o.r2) <= 48; }); },
      stem: function (o) { return 'Solve ' + t(eqT(1, -(o.r1 + o.r2), o.r1 * o.r2)) + '.'; },
      parts: [
        { id: '1a', level: 'BEG', make: function (r, o) {
          var b = -(o.r1 + o.r2), c = o.r1 * o.r2, ft = HW.factor.tex([polyT([1, -o.r1]), polyT([1, -o.r2])]), T = uniq([o.r1, o.r2]);
          return Z.fields('Solve by factoring.', [{ label: 'Factored:', mode: 'math', keys: 'poly', chk: K.factored(ft, { wrong: [{ is: HW.factor.tex([polyT([1, o.r1]), polyT([1, o.r2])]), code: CP + 'factor', hint: 'Check the signs: expand your brackets and compare with ' + t(polyT([1, b, c])) + '.' }] }), key: ft, placeholder: 'e.g. (x + 5)(x - 3)' },
            Z.fRoots(CP, 'Roots:', T, { key: 'x=' + T[0] + ',\\ x=' + T[1], wrongs: [{ vals: [-o.r1, -o.r2], code: CP + 'factor', hint: 'Each factor gives a root: ' + t('x-r=0') + ' means ' + t('x=r') + '.' }] })],
            { sol: 'Two numbers with product ' + t(nT(c)) + ' and sum ' + t(nT(b)) + ': ' + t(nT(-o.r1)) + ' and ' + t(nT(-o.r2)) + '.<br>' + t(ft + '=0') + ', so ' + t('x=' + o.r1) + ' or ' + t('x=' + o.r2) + '.', hints: ['Find two numbers with product ' + t(nT(c)) + ' and sum ' + t(nT(b)) + '.'], text: 'factor x² + bx + c, roots' });
        } },
        { id: '1b', level: 'BEG', make: function (r, o) { return solvePart(CP, 'Solve with the quadratic formula.', 1, -(o.r1 + o.r2), o.r1 * o.r2, { text: 'formula: integer roots', post: 'The same roots as factoring ✓' }); } }] },
    { num: '2', shared: function (r) { return decPick(r); },
      stem: function (o) { return 'Solve ' + t(eqT(o.m * o.p, o.m * o.q + o.n * o.p, o.n * o.q)) + '.'; },
      parts: [
        { id: '2a', level: 'EMG', make: function (r, o) {
          var ft = HW.factor.tex([polyT([o.m, o.n]), polyT([o.p, o.q])]), T = uniq([-o.n / o.m, -o.q / o.p]);
          return Z.fields('Solve by decomposition.', [{ label: 'Factored:', mode: 'math', keys: 'poly', chk: K.factored(ft, { wrong: facWrongs(o.m, o.n, o.p, o.q) }), key: ft, placeholder: 'e.g. (3x + 1)(2x - 3)' },
            Z.fRoots(CP, 'Roots:', T, { key: 'x=' + frT(-o.n, o.m) + ',\\ x=' + frT(-o.q, o.p), wrongs: [{ vals: [o.n / o.m, o.q / o.p], code: CP + 'factor', hint: 'Set each factor equal to 0: ' + t('(' + polyT([o.m, o.n]) + ')=0') + ' gives ' + t('x=' + frT(-o.n, o.m)) + '.' }, { vals: [-o.n, -o.q], code: CP + 'factor', hint: 'Divide by the ' + t('x') + ' coefficient: ' + t(polyT([o.m, o.n]) + '=0') + ' gives ' + t('x=' + frT(-o.n, o.m)) + '.' }] })],
            { sol: decSol(o.m, o.n, o.p, o.q), hints: ['Find two numbers with product ' + t('ac') + ' and sum ' + t('b') + ', split the middle term, then group.'], text: 'decomposition, roots' });
        } },
        { id: '2b', level: 'EMG', make: function (r, o) { return solvePart(CP, 'Solve with the quadratic formula.', o.m * o.p, o.m * o.q + o.n * o.p, o.n * o.q, { text: 'formula: rational roots', post: 'The discriminant is a perfect square, so the roots are rational (the same as by decomposition ✓).' }); } }] },
    { num: '3', parts: [
      { id: '3a', level: 'EMG', make: function (r) { var Q = pickWhere(function () { var h = nz(r, -7, 7), k = r.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 18, 20]); return qf(1, -2 * h, h * h - k); }, function (Q) { return Q.c !== 0 && AV(1, Q.b, Q.c); }); return csPart(r, 1, Q.b, Q.c); } },
      { id: '3b', level: 'PRG', make: function (r) { var o = pickWhere(function () { var a = r.pick([2, 3, 5]), h = nz(r, -4, 4); return { a: a, b: -2 * a * h, c: nz(r, -9, 9) }; }, function (o) { var Q = qf(o.a, o.b, o.c); return Q.irr && gcd(gcd(o.a, o.b), o.c) === 1 && !isInt(o.c / o.a) && AV(o.a, o.b, o.c); }); return csPart(r, o.a, o.b, o.c); } }] },
    { num: '4', stem: 'Solve with the quadratic formula. Give exact roots in simplest form.', parts: [
      { id: '4a', level: 'BEG', make: function (r) { var Q = tA1j(r); return solvePart(CP, t(eqT(1, Q.b, Q.c)), 1, Q.b, Q.c, { text: 'formula: a = 1, m ± k√f' }); } },
      { id: '4b', level: 'BEG', make: function (r) { var Q = tA1(r); return solvePart(CP, t(eqT(1, Q.b, Q.c)), 1, Q.b, Q.c, { text: 'formula: a = 1, m ± √f' }); } },
      { id: '4c', level: 'EMG', make: function (r) { var Q = tRed(r, 'kc'); return solvePart(CP, t(eqT(Q.a, Q.b, Q.c)), Q.a, Q.b, Q.c, { text: 'formula: reduce, radical coefficient left' }); } },
      { id: '4d', level: 'EMG', make: function (r) { var Q = tRed(r, 'oddA'); return solvePart(CP, t(eqT(Q.a, Q.b, Q.c)), Q.a, Q.b, Q.c, { text: 'formula: reduce by 2' }); } },
      { id: '4e', level: 'EMG', make: function (r) { var Q = tNone(r); return solvePart(CP, t(eqT(Q.a, Q.b, Q.c)), Q.a, Q.b, Q.c, { text: 'formula: no real roots' }); } },
      { id: '4f', level: 'PRG', make: function (r) { var Q = tRed(r, 'negBC'); return solvePart(CP, t(eqT(Q.a, Q.b, Q.c)), Q.a, Q.b, Q.c, { text: 'formula: negative b and c, reduce' }); } }] },
    { num: '5', stem: 'Solve with the quadratic formula. Give the roots to the nearest tenth.', parts: [
      { id: '5a', level: 'BEG', make: function (r) { var Q = gen(r, { a: [2, 3, 4], b: [1, 6], c: [-9, -1], avoid: AV, test: function (Q) { return Q.irr && Q.g === 1 && safe(Q.vals, 1); } }); return solvePart(CP, t(eqT(Q.a, Q.b, Q.c)), Q.a, Q.b, Q.c, { dp: 1, text: 'formula to the nearest tenth' }); } },
      { id: '5b', level: 'EMG', make: function (r) { var Q = gen(r, { a: [3, 4, 5, 6], b: [-11, -5], c: [1, 5], avoid: AV, test: function (Q) { return Q.D > 0 && !isSq(Q.D) && Q.vals[0] > 0 && safe(Q.vals, 1); } }); return solvePart(CP, t(eqT(Q.a, Q.b, Q.c)), Q.a, Q.b, Q.c, { dp: 1, text: 'formula to the nearest tenth: two positive roots' }); } },
      { id: '5c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([0.5, 0.2, 0.4, 1.5, 2.5]), b: r.pick([-1, 1]) * r.int(5, 30) / 10, c: -r.int(5, 40) / 10 }; }, function (o) { var D = o.b * o.b - 4 * o.a * o.c, V = rootsOf(o.a, o.b, o.c); return D > 0 && safe(V, 1) && !isInt(o.b) && AV(o.a, o.b, o.c); });
        return solvePart(CP, t(eqT(o.a, o.b, o.c)), o.a, o.b, o.c, { dp: 1, text: 'formula with decimal coefficients' });
      } }] },
    { num: '6', shared: function (r) {
        var A = pickWhere(function () { var m = nz(r, -8, 8), j = r.int(2, 4), f = r.pick([2, 3, 5, 6, 7, 10]); return qf(1, -2 * m, m * m - j * j * f); }, function (Q) { return Q.c !== 0 && Math.abs(Q.c) <= 90 && AV(1, Q.b, Q.c) && safe(Q.vals, 2); });
        var Bq = gen(r, { a: [-2, -3, -4], b: [-9, 9], c: [1, 9], avoid: AV, test: function (Q) { return Q.irr && Q.g > 1 && Q.Den > 1 && Q.b !== 0 && safe(Q.vals, 2); } });
        return { A: A, B: Bq };
      }, stem: 'Determine the zeros of each function, exactly and to the nearest hundredth.', parts: [
      { id: '6a', level: 'EMG', make: function (r, o) {
        var Q = o.A;
        return Z.fields('' + t('y=' + polyT([1, Q.b, Q.c])), [Z.fRoots(CP, 'Exact zeros:', Q.vals, { irr: true, key: keyT(Q), wrongs: fmlWrongs(CP, 1, Q.b, Q.c), what: 'zero' }), Z.fRoots(CP, 'To the nearest hundredth:', Q.vals, { dp: 2, wrongs: fmlWrongs(CP, 1, Q.b, Q.c), what: 'zero' })],
          { sol: 'Solve ' + t(eqT(1, Q.b, Q.c)) + ': ' + solF(1, Q.b, Q.c, { dp: 2 }), hints: ['The zeros of the function are the roots of ' + t(polyT([1, Q.b, Q.c]) + '=0') + '.'].concat(HF.slice(1)), text: 'zeros exact and rounded' });
      } },
      { id: '6b', level: 'PRG', make: function (r, o) {
        var Q = o.B;
        return Z.fields('' + t('y=' + polyT([Q.a, Q.b, Q.c])), [Z.fRoots(CP, 'Exact zeros:', Q.vals, { irr: true, key: keyT(Q), wrongs: fmlWrongs(CP, Q.a, Q.b, Q.c), what: 'zero' }), Z.fRoots(CP, 'To the nearest hundredth:', Q.vals, { dp: 2, wrongs: fmlWrongs(CP, Q.a, Q.b, Q.c), what: 'zero' })],
          { sol: 'Solve ' + t(eqT(Q.a, Q.b, Q.c)) + ': ' + solF(Q.a, Q.b, Q.c, { dp: 2 }), hints: ['Here ' + t('a') + ' is negative, so ' + t('2a') + ' is negative: simplify the signs at the end.'].concat(HF.slice(1)), text: 'zeros with a < 0' });
      } },
      { id: '6c', level: 'EMG', make: function (r, o) {
        var Q = o.B, x1 = Q.vals[1], x2 = Q.vals[0];
        return Z.fields('State the ' + t('x') + '-intercepts of the graph of ' + t('y=' + polyT([Q.a, Q.b, Q.c])) + ' in (b), to the nearest hundredth.', [{ label: 'One intercept:', mode: 'math', chk: ptRound(x1, 0, 2), key: '(' + fx(x1, 2) + ',0)', placeholder: 'e.g. (2.35, 0)' }, { label: 'The other:', mode: 'math', chk: ptRound(x2, 0, 2), key: '(' + fx(x2, 2) + ',0)', placeholder: 'e.g. (-1.07, 0)' }],
          { swap: [[0, 1]], sol: 'The ' + t('x') + '-intercepts are the zeros: ' + t('(' + fx(x1, 2) + ',\\ 0)') + ' and ' + t('(' + fx(x2, 2) + ',\\ 0)') + '.<br>Check: graph ' + t('Y_1=' + polyT([Q.a, Q.b, Q.c])) + ', then 2nd [TRACE] (CALC), 2: zero, with a left and a right bound around each intercept.', hints: ['An ' + t('x') + '-intercept is a point ' + t('(x,\\ 0)') + ' where ' + t('x') + ' is a zero.'], text: 'x-intercepts as points', bad: [['(' + fx(x1, 2) + ',' + fx(x1, 2) + ')', '(' + fx(x2, 2) + ',0)'], ['(0,' + fx(x1, 2) + ')', '(0,' + fx(x2, 2) + ')']] });
      } }] },
    { num: '7', shared: q7shared, stem: function (o) {
        var a = o.a, b = o.b, c = o.c, Dw = b * b + 4 * a * c, s = sqf(Dw), m = -b / (2 * a);
        return 'A student solved ' + t(eqT(a, b, c)) + ' as shown.<br>' + Z.work([
          'x=\\dfrac{' + nT(-b) + '\\pm\\sqrt{' + b + '^{2}-4(' + a + ')(' + c + ')}}{2(' + a + ')}',
          '\\phantom{x}=\\dfrac{' + nT(-b) + '\\pm\\sqrt{' + b * b + '-' + (-4 * a * c) + '}}{' + 2 * a + '}=\\dfrac{' + nT(-b) + '\\pm\\sqrt{' + Dw + '}}{' + 2 * a + '}',
          '\\phantom{x}=\\dfrac{' + nT(-b) + '\\pm ' + radT(s[0], s[1]) + '}{' + 2 * a + '}=' + nT(m) + '\\pm ' + radT(s[0], s[1])]);
      }, parts: [
      { id: '7a', level: 'PRG', make: function (r, o) {
        var a = o.a, b = o.b, c = o.c, Dc = b * b - 4 * a * c;
        return Z.mc(r, 'Identify the two errors.', [
          { html: 'The sign of ' + t('-4ac') + ': ' + t('-4(' + a + ')(' + c + ')=+' + (-4 * a * c)) + ', so the discriminant is ' + t(Dc) + '; and in the last step only ' + t(nT(-b)) + ' was divided by ' + t(2 * a) + '.', right: true },
          { html: 'The sign of ' + t('-b') + ' (it should be ' + t('+' + b) + '); and in the last step only ' + t(nT(-b)) + ' was divided by ' + t(2 * a) + '.', why: 'With ' + t('b=' + b) + ', ' + t('-b=' + nT(-b)) + ' is right. Look at ' + t('-4ac') + ' with ' + t('c=' + c) + '.', code: CP + 'errors' },
          { html: 'The sign of ' + t('-4ac') + '; and the radical should not have been simplified.', why: 'The radical was simplified correctly. Look at the last step: was every term divided by ' + t(2 * a) + '?', code: CP + 'errors' },
          { html: 'The denominator should be ' + t(a) + ', not ' + t(2 * a) + '; and the sign of ' + t('-4ac') + '.', why: 'The denominator ' + t('2a=' + 2 * a) + ' is right. Look at the last step.', code: CP + 'errors' }],
          'Error 1: ' + t('-4(' + a + ')(' + c + ')=+' + (-4 * a * c)) + ', so the discriminant is ' + t(b * b + '+' + (-4 * a * c) + '=' + Dc) + ', not ' + t(b * b + 4 * a * c) + '.<br>Error 2: dividing by ' + t(2 * a) + ' must apply to <b>every</b> term of the numerator.', ['Check each sign in the discriminant, then check the division at the end.'], 'error analysis: which errors');
      } },
      { id: '7b', level: 'PRG', make: function (r, o) { return solvePart(CP, 'Give the correct exact roots.', o.a, o.b, o.c, { text: 'error analysis: correct roots' }); } }] },
    { num: '8', shared: function (r) {
        var q8 = pickWhere(function () { return { a1: r.pick([2, 3, 5, 6, 7]), s1: r.int(2, 6) }; }, function (z) { return AV(z.a1, 0, -z.a1 * z.s1 * z.s1); }), a1 = q8.a1, s1 = q8.s1, sqA = [a1, 0, -a1 * s1 * s1];
        var fac = pickWhere(function () { return [nz(r, -9, 9), nz(r, -9, 9)]; }, function (z) { return z[0] !== z[1] && z[0] !== -z[1] && AV(1, -(z[0] + z[1]), z[0] * z[1]) && Math.abs(z[0] * z[1]) <= 40; });
        var vt = pickWhere(function () { return { k: r.pick([2, 3, 4]), h: nz(r, -5, 5), s: r.int(2, 5) }; }, function (z) { return !(z.k === 2 && z.h === -1 && z.s === 3); });
        var fm1 = gen(r, { a: [1], b: [-9, 9], c: [-9, 9], avoid: AV, test: function (Q) { return Q.irr && Q.b % 2 !== 0; } });
        var gf = pickWhere(function () { return { a: r.int(2, 9), b: nz(r, -9, 9) }; }, function (z) { return gcd(z.a, z.b) > 1 && Math.abs(z.b) !== z.a && !(z.a === 9 && z.b === 6); });
        var fm2 = gen(r, { a: [2, 3, 4, 5], b: [-7, 7], c: [-7, 7], avoid: AV, test: function (Q) { return Q.irr && Q.g === 1 && Q.b !== 0; } });
        return { sqA: sqA, s1: s1, fac: fac, vt: vt, fm1: fm1, gf: gf, fm2: fm2 };
      }, stem: 'Choose an efficient method and solve. Give exact roots.', parts: [
      { id: '8a', level: 'BEG', make: function (r, o) { var a = o.sqA[0], c = o.sqA[2]; return rootsPart(CP, '' + t(polyT([a, 0, c]) + '=0'), [-o.s1, o.s1], { key: 'x=\\pm ' + o.s1, sol: 'Square roots (no ' + t('x') + ' term): ' + t(a + 'x^{2}=' + (-c)) + ', ' + t('x^{2}=' + o.s1 * o.s1) + ', ' + t('x=\\pm ' + o.s1), hints: ['There is no ' + t('x') + ' term: isolate ' + t('x^{2}') + ' and take the square root of both sides.'], text: 'square roots: ax² − c = 0', wrongs: [{ vals: [o.s1], code: 'sol-missing', hint: 'A positive number has two square roots: ' + t('\\pm') + '.' }] }); } },
      { id: '8b', level: 'BEG', make: function (r, o) { var z = o.fac, b = -(z[0] + z[1]), c = z[0] * z[1]; return rootsPart(CP, '' + t(eqT(1, b, c)), z, { sol: 'Factoring: ' + t(HW.factor.tex([polyT([1, -z[0]]), polyT([1, -z[1]])]) + '=0') + ', so ' + t('x=' + z[0]) + ' or ' + t('x=' + z[1]) + '.', hints: ['It factors: two numbers with product ' + t(c) + ' and sum ' + t(b) + '.'], text: 'factoring: x² + bx + c', wrongs: [{ vals: [-z[0], -z[1]], code: CP + 'factor', hint: t('(x-r)=0') + ' gives ' + t('x=r') + ': check the signs.' }] }); } },
      { id: '8c', level: 'EMG', make: function (r, o) { var v = o.vt, q = v.k * v.s * v.s; return rootsPart(CP, '' + t(v.k + '(' + polyT([1, -v.h]) + ')^{2}-' + q + '=0'), [v.h - v.s, v.h + v.s], { sol: 'Square roots: ' + t('(' + polyT([1, -v.h]) + ')^{2}=' + v.s * v.s) + ', ' + t(polyT([1, -v.h]) + '=\\pm ' + v.s) + ', so ' + t('x=' + (v.h + v.s)) + ' or ' + t('x=' + (v.h - v.s)) + '.', hints: ['Isolate the square, then take the square root of both sides (' + t('\\pm') + ').'], text: 'square roots: a(x − p)² − q = 0', wrongs: [{ vals: [-v.h - v.s, -v.h + v.s], code: CP + 'cs-p', hint: 'Check the sign: ' + t('x-p=\\pm s') + ' gives ' + t('x=p\\pm s') + '.' }, { vals: [v.h + v.s], code: 'sol-missing', hint: 'Remember ' + t('\\pm') + ' when you take the square root.' }] }); } },
      { id: '8d', level: 'EMG', make: function (r, o) { var Q = o.fm1; return solvePart(CP, '' + t(eqT(1, Q.b, Q.c)), 1, Q.b, Q.c, { text: 'formula: does not factor', pre: 'Formula (no two integers have product ' + t(Q.c) + ' and sum ' + t(Q.b) + '):' }); } },
      { id: '8e', level: 'EMG', make: function (r, o) { var z = o.gf, g = gcd(z.a, z.b); return rootsPart(CP, '' + t(z.a + 'x^{2}=' + polyT([z.b, 0])), [0, z.b / z.a], { key: 'x=0,\\ x=' + frT(z.b, z.a), sol: 'Factoring (no constant term): ' + t(polyT([z.a, -z.b, 0]) + '=0') + ', ' + t(polyT([g, 0]).replace(/^1x/, 'x') + '(' + polyT([z.a / g, -z.b / g]) + ')=0') + ', so ' + t('x=0') + ' or ' + t('x=' + frT(z.b, z.a)) + '.', hints: ['Move every term to one side and factor out the common factor. Don’t divide both sides by ' + t('x') + ' (you would lose the root ' + t('x=0') + ').'], text: 'factoring: no constant term', wrongs: [{ vals: [z.b / z.a], code: 'sol-missing', hint: 'Dividing by ' + t('x') + ' loses a root: factor instead, and ' + t('x=0') + ' is a root too.' }] }); } },
      { id: '8f', level: 'PRG', make: function (r, o) { var Q = o.fm2; return solvePart(CP, '' + t(eqT(Q.a, Q.b, Q.c)), Q.a, Q.b, Q.c, { text: 'formula: a ≠ 1, does not factor', pre: 'Formula (it does not factor over the integers):' }); } },
      { id: '8g', level: 'EMG', make: function (r, o) {
        var rows = [{ id: 'a', html: '(a) ' + t(polyT([o.sqA[0], 0, o.sqA[2]]) + '=0') }, { id: 'b', html: '(b) ' + t(eqT(1, -(o.fac[0] + o.fac[1]), o.fac[0] * o.fac[1])) }, { id: 'c', html: '(c) ' + t(o.vt.k + '(' + polyT([1, -o.vt.h]) + ')^{2}-' + o.vt.k * o.vt.s * o.vt.s + '=0') },
          { id: 'd', html: '(d) ' + t(eqT(1, o.fm1.b, o.fm1.c)) }, { id: 'e', html: '(e) ' + t(o.gf.a + 'x^{2}=' + polyT([o.gf.b, 0])) }, { id: 'f', html: '(f) ' + t(eqT(o.fm2.a, o.fm2.b, o.fm2.c)) }];
        var cols = [{ id: 'fac', html: 'Factoring' }, { id: 'sq', html: 'Square roots' }, { id: 'qf', html: 'Quadratic formula' }];
        var p = B.grid('Name the most efficient method for each equation above.', rows, cols, { a: 'sq', b: 'fac', c: 'sq', d: 'qf', e: 'fac', f: 'qf' }, { rowHead: 'Equation', colHead: 'Method' },
          'Square roots: no ' + t('x') + ' term, or the form ' + t('a(x-p)^{2}+q=0') + ' — (a), (c).<br>Factoring: it factors easily, or there is no constant term — (b), (e).<br>Quadratic formula: it does not factor — (d), (f).', ['No ' + t('x') + ' term or a squared bracket: square roots. Easy factors or no constant: factoring. Otherwise: the formula.'], 'choose a method');
        p.outcome = OUT; return p;
      } }] },
    { num: '9', stem: 'Write each equation in standard form, then solve. Give exact roots in simplest form.', parts: [
      { id: '9a', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(1, 7), q: r.int(1, 6), s: r.int(1, 9) }; }, function (o) { var Q = qf(1, -(o.p + o.q), o.s); return Q.irr && AV(1, Q.b, Q.c) && !(o.p === 4 && o.q === 3 && o.s === 5); });
        var b = -(o.p + o.q), c = o.s;
        return stdFields('' + t('x(x-' + o.p + ')=' + polyT([o.q, -o.s])), polyT([1, -o.p, 0]), polyT([o.q, -o.s]), [1, b, c], { pre: t(polyT([1, -o.p, 0]) + '=' + polyT([o.q, -o.s])) + ', so ' + t(eqT(1, b, c)), text: 'standard form: x(x − p) = qx − s', wrongs: [{ vals: rootsOf(1, -o.p, 0), code: CP + 'std', hint: 'Put the equation in standard form first (every term on one side, 0 on the other).' }] });
      } },
      { id: '9b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { h: nz(r, -5, 5), m: r.int(1, 6), n: r.int(-9, 12) }; }, function (o) { var b = 2 * o.h - o.m, c = o.h * o.h - o.n, Q = qf(1, b, c); return Q.irr && c !== 0 && b !== 0 && AV(1, b, c) && !(o.h === 3 && o.m === 2 && o.n === 10); });
        var b = 2 * o.h - o.m, c = o.h * o.h - o.n, rhs = polyT([o.m, o.n]);
        return stdFields('' + t('(' + polyT([1, o.h]) + ')^{2}=' + rhs), polyT([1, 2 * o.h, o.h * o.h]), rhs, [1, b, c], { pre: t(polyT([1, 2 * o.h, o.h * o.h]) + '=' + rhs) + ', so ' + t(eqT(1, b, c)), text: 'standard form: (x + h)² = mx + n', hint: t('(x+h)^{2}=x^{2}+2hx+h^{2}'), cands: [[[1, -o.m, o.h * o.h - o.n], CP + 'std-exp', 'Square the binomial fully: ' + t('(' + polyT([1, o.h]) + ')^{2}=' + polyT([1, 2 * o.h, o.h * o.h])) + ' (don’t forget the middle term).']] });
      } },
      { id: '9c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var m = r.int(2, 5), p = nz(r, -4, 4), n = nz(r, -5, 5), s = nz(r, -5, 5), u = nz(r, -5, 5); return { m: m, n: n, p: p, s: s, u: u }; }, function (o) {
          if (o.m * o.p - o.n !== o.s + o.u) return false; var A = o.m - 1, C = -o.n * o.p - o.s * o.u; if (C === 0 || A === 0) return false; var v = -C / A; return v > 0 && isInt(v) && !isSq(v) && sqf(v)[1] === v && v <= 30 && !(o.m === 3 && o.n === 1 && o.p === 2);
        });
        var A = o.m - 1, C = -o.n * o.p - o.s * o.u, v = -C / A, Lt = '(' + polyT([o.m, -o.n]) + ')(' + polyT([1, o.p]) + ')', Rt = '(' + polyT([1, o.s]) + ')(' + polyT([1, o.u]) + ')';
        var Lx = polyT([o.m, o.m * o.p - o.n, -o.n * o.p]), Rx = polyT([1, o.s + o.u, o.s * o.u]);
        return stdFields('' + t(Lt + '=' + Rt), Lx, Rx, [A, 0, C], { pre: t(Lx + '=' + Rx) + ', so ' + t(polyT([A, 0, C]) + '=0'), sqrtSol: 'There is no ' + t('x') + ' term: ' + t('x^{2}=' + v) + ', so ' + t('x=\\pm\\sqrt{' + v + '}') + ' (square roots).', text: 'standard form: the x terms cancel' });
      } },
      { id: '9d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var d = r.pick([[4, 3], [3, 2], [2, 3], [5, 2], [2, 5], [6, 4], [3, 4], [4, 6]]); return { d1: d[0], d2: d[1], s: sgn(r), k: r.int(1, 3) }; }, function (o) {
          var L = o.d1 * o.d2 / gcd(o.d1, o.d2), a = L / o.d1, b = o.s * L / o.d2, c = -o.k * L, Q = qf(a, b, c); return Q.irr && !(o.d1 === 4 && o.d2 === 3 && o.k === 1 && o.s === 1) && !(o.d1 === 3 && o.d2 === 2 && o.s === -1 && o.k === 1) && AV(a, b, c);
        });
        var L = o.d1 * o.d2 / gcd(o.d1, o.d2), a = L / o.d1, b = o.s * L / o.d2, c = -o.k * L;
        var eq = '\\frac{x^{2}}{' + o.d1 + '}' + (o.s > 0 ? '+' : '-') + '\\frac{x}{' + o.d2 + '}-' + o.k + '=0';
        return stdFields('' + t(eq), '\\frac{x^{2}}{' + o.d1 + '}' + (o.s > 0 ? '+' : '-') + '\\frac{x}{' + o.d2 + '}-' + o.k, '0', [a, b, c], { pre: 'Multiply every term by ' + t(L) + ': ' + t(eqT(a, b, c)), text: 'standard form: clear fractions', hint: 'multiply every term by the LCD to clear the fractions' });
      } },
      { id: '9e', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { q: nz(r, -5, 5), s: r.int(1, 9) }; }, function (o) { var Q = qf(1, -o.q, -o.s); return Q.irr && !(o.q === 2 && o.s === 5) && AV(1, -o.q, -o.s); });
        var Q = qf(1, -o.q, -o.s);
        var p = stdFields('' + t('x-\\frac{' + o.s + '}{x}=' + o.q) + ', ' + t('x\\ne 0'), 'x^2-' + o.s, polyT([o.q, 0]), [1, -o.q, -o.s], { pre: 'Multiply both sides by ' + t('x') + ': ' + t('x^{2}-' + o.s + '=' + polyT([o.q, 0])) + ', so ' + t(eqT(1, -o.q, -o.s)), text: 'standard form: variable in a denominator', hint: 'first multiply both sides by ' + t('x') });
        p.solution += '<br>Neither root is ' + t('0') + ', so both are allowed.';
        return p;
      } },
      { id: '9f', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { g: r.pick([3, 4, 5, 6]), a: r.int(2, 5), b: nz(r, -8, 8), c: r.int(1, 9) }; }, function (o) { var Q = qf(o.a, o.b, -o.c); return Q.irr && gcd(gcd(o.a, o.b), o.c) === 1 && AV(o.a, o.b, -o.c) && !(o.g === 5 && o.a === 4 && o.b === 8); });
        var A = o.g * o.a, Bc = o.g * o.b, C = o.g * o.c;
        return stdFields('' + t(polyT([A, Bc, 0]) + '=' + C), polyT([A, Bc, 0]), String(C), [o.a, o.b, -o.c], { pre: t(polyT([A, Bc, -C]) + '=0') + '; divide every term by ' + t(o.g) + ': ' + t(eqT(o.a, o.b, -o.c)), text: 'standard form: divide out a common factor' });
      } }] },
    { num: '10', shared: function (r) { return pickWhere(function () { return { v: r.int(9, 19), h0: r.pick([0.5, 1, 1.2, 1.5, 1.8, 2, 2.5]), H: r.int(3, 9) }; }, function (o) { var top = o.h0 + o.v * o.v / 19.6; return !(o.v === 12 && o.h0 === 1.5) && !(o.v === 15 && o.h0 === 2) && o.H < top - 0.8 && o.H > o.h0 + 1 && safe(rootsOf(-4.9, o.v, o.h0), 1) && safe(rootsOf(-4.9, o.v, o.h0 - o.H), 1); }); },
      stem: function (o) { return 'A soccer ball is kicked from a height of ' + t(nT(o.h0)) + ' m. Its height after ' + t('t') + ' seconds is ' + t('h=-4.9t^{2}+' + o.v + 't+' + nT(o.h0)) + ' metres.'; }, parts: [
      { id: '10a', level: 'PRG', make: function (r, o) {
        var V = rootsOf(-4.9, o.v, o.h0), T = V[1];
        return apxPart('When does the ball land, to the nearest tenth of a second?', T, 1, { after: 's', unit: 's', cands: [[-V[0], CP + 'neg-root', 'That is the negative root without its sign: a negative time is before the kick, so reject it and use the other root.'], [o.v / 9.8, CP + 'vertex', 'That is when the ball is highest. It lands when ' + t('h=0') + '.'], [o.v / 4.9, CP + 'h0', 'Include the starting height: solve ' + t('-4.9t^{2}+' + o.v + 't+' + nT(o.h0) + '=0') + '.']],
          sol: 'It lands when ' + t('h=0') + ': ' + solF(-4.9, o.v, o.h0, { v: 't', dp: 2 }) + '<br>Reject the negative time. It lands after about ' + t(fx(T, 1)) + ' s.', hints: ['The ball lands when ' + t('h=0') + '.', 'Reject the negative root: it is before the kick.'], text: 'ball: landing time' });
      } },
      { id: '10b', level: 'ADV', make: function (r, o) {
        var c = cl(o.h0 - o.H), V = rootsOf(-4.9, o.v, c);
        return rootsPart(CP, 'At what times is the ball ' + o.H + ' m above the ground, to the nearest tenth of a second?', V, { dp: 1, v: 't', what: 'time', placeholder: 'e.g. t = 0.4, t = 2.1', key: 't=' + fx(V[0], 1) + ',\\ t=' + fx(V[1], 1),
          wrongs: [{ vals: rootsOf(-4.9, o.v, cl(o.h0 + o.H)).filter(function (x) { return x > 0; }), code: CP + 'height-sign', hint: 'Set ' + t('h=' + o.H) + ' and subtract ' + t(o.H) + ' from both sides: the constant becomes ' + t(nT(o.h0) + '-' + o.H + '=' + nT(c)) + '.' }].concat(fmlWrongs(CP, -4.9, o.v, c)),
          sol: t('-4.9t^{2}+' + o.v + 't+' + nT(o.h0) + '=' + o.H) + ', so ' + t(eqT(-4.9, o.v, c, 't')) + ':<br>' + solF(-4.9, o.v, c, { v: 't', dp: 2 }) + '<br>About ' + t(fx(V[0], 1)) + ' s (going up) and ' + t(fx(V[1], 1)) + ' s (coming down).', hints: ['Set ' + t('h=' + o.H) + ', move every term to one side, then use the formula.', 'Both roots are positive: the ball passes this height twice.'], text: 'ball: times at a height' });
      } }] },
    { num: '11', parts: [
      { id: '11', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { s: 2 * r.int(5, 12), A: r.int(10, 60) }; }, function (o) { var D = o.s * o.s - 4 * o.A, V = rootsOf(1, -o.s, o.A); return D > 0 && !isSq(D) && !(o.s === 14 && o.A === 42) && !(o.s === 6 && o.A === 24) && V[0] > o.s / 5 && safe(V, 1); });
        var Pm = 2 * o.s, Q = qf(1, -o.s, o.A), V = Q.vals;
        return Z.fields('A rectangular dog run is enclosed by ' + t(Pm) + ' m of fencing and has an area of ' + t(o.A + '\\text{ m}^{2}') + '. Determine its exact dimensions, then give them to the nearest tenth of a metre.', [
          Z.fRoots(CP, 'Exact side lengths:', V, { irr: true, key: pmT(Q), what: 'side length', placeholder: 'e.g. 5 ± sqrt(3)', wrongs: [{ vals: rootsOf(1, -Pm, o.A), code: CP + 'perim', hint: 'Two sides (one length and one width) add to half the perimeter: ' + t('\\frac{' + Pm + '}{2}=' + o.s) + '.' }].concat(fmlWrongs(CP, 1, -o.s, o.A)) }),
          Z.fApx('Longer side:', V[1], 1, { after: 'm' }), Z.fApx('Shorter side:', V[0], 1, { after: 'm' })],
          { sol: 'Width ' + t('x') + '; then length ' + t('=\\frac{' + Pm + '}{2}-x=' + o.s + '-x') + '.<br>' + t('x(' + o.s + '-x)=' + o.A + '\\Rightarrow ' + eqT(1, -o.s, o.A)) + '<br>' + solF(1, -o.s, o.A) + '<br>The two roots are the two sides: ' + t(oneT(Q, 1) + '\\approx ' + fx(V[1], 1)) + ' m by ' + t(oneT(Q, -1) + '\\approx ' + fx(V[0], 1)) + ' m.', hints: ['Let the width be ' + t('x') + '. A length and a width add to half the perimeter.', 'Area: ' + t('x(\\text{half perimeter}-x)=\\text{area}') + '.'], text: 'fencing: exact dimensions' });
      } }] },
    { num: '12', parts: [
      { id: '12', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { d: r.int(1, 7), h: r.int(5, 20) }; }, function (o) { var Q = qf(2, 2 * o.d, o.d * o.d - o.h * o.h); return o.h > o.d + 1 && Q.irr && !(o.d === 3 && o.h === 12) && safe(Q.vals.map(function (x) { return x; }).concat([Q.vals[1] + o.d]), 2); });
        var Q = qf(2, 2 * o.d, o.d * o.d - o.h * o.h), x = Q.vals[1];
        return Z.fields('The legs of a right triangle differ by ' + t(o.d) + ' cm and the hypotenuse is ' + t(o.h) + ' cm. Determine the exact length of the shorter leg, then both legs to the nearest hundredth.', [
          Z.fRoots(CP, 'Shorter leg (exact):', [x], { irr: true, key: oneT(Q, 1), what: 'length', placeholder: 'exact, e.g. (-1 + sqrt(7))/2', wrongs: [{ vals: Q.vals, code: CP + 'neg-root', hint: 'A length can’t be negative: give only the positive root.' }, { vals: [x + o.d], code: CP + 'legs', hint: 'That is the longer leg. The shorter leg is ' + t('x') + '.' }], extraHint: 'A length can’t be negative: give only the positive root.', extraCode: CP + 'neg-root' }),
          Z.fApx('Shorter leg ≈', x, 2, { after: 'cm', cands: [[x + o.d, CP + 'legs', 'That is the longer leg.']] }), Z.fApx('Longer leg ≈', x + o.d, 2, { after: 'cm', cands: [[x, CP + 'legs', 'That is the shorter leg.']] })],
          { sol: t('x^{2}+(x+' + o.d + ')^{2}=' + o.h * o.h + '\\Rightarrow ' + eqT(2, 2 * o.d, o.d * o.d - o.h * o.h)) + '<br>' + solF(2, 2 * o.d, o.d * o.d - o.h * o.h) + '<br>Reject the negative root. Shorter leg ' + t(oneT(Q, 1) + '\\approx ' + fx(x, 2)) + ' cm; longer leg ' + t('\\approx ' + fx(x + o.d, 2)) + ' cm.', hints: ['Let the shorter leg be ' + t('x') + '; the longer leg is ' + t('x+' + o.d) + '. Use the Pythagorean theorem.', 'Expand, collect into standard form, then use the formula. Reject the negative root.'], text: 'right triangle: legs' });
      } }] },
    { num: '13', shared: function (r) {
        return pickWhere(function () { var d = r.int(2, 5), t1 = r.int(1, 9), n0 = r.int(6, 14); return { d: d, t1: t1, n0: n0 }; }, function (o) { return !(o.t1 === 2 && o.d === 3) && o.t1 !== o.d && (2 * o.t1 - o.d) !== 0; });
      }, stem: function (o) { var e = 2 * o.t1 - o.d; return 'The arithmetic series ' + t(o.t1 + '+' + (o.t1 + o.d) + '+' + (o.t1 + 2 * o.d) + '+\\dots') + ' has ' + t('S_n=\\dfrac{n(' + polyT([o.d, e], 'n') + ')}{2}') + '.'; }, parts: [
      { id: '13a', level: 'ADV', make: function (r, o) {
        var e = 2 * o.t1 - o.d, S = o.n0 * (o.d * o.n0 + e) / 2, V = rootsOf(o.d, e, -2 * S);
        return numPart(CP, 'Use the quadratic formula to find how many terms give a sum of ' + t(S) + '.', o.n0, { after: 'terms', cands: [[V[0], CP + 'n-neg', 'A number of terms can’t be negative: reject that root.']],
          sol: t('\\frac{n(' + polyT([o.d, e], 'n') + ')}{2}=' + S + '\\Rightarrow ' + eqT(o.d, e, -2 * S, 'n')) + '<br>' + solF(o.d, e, -2 * S, { v: 'n' }) + '<br>' + t('n=' + o.n0) + ' (the negative root is rejected).', hints: ['Multiply both sides by 2, expand, and write the equation in standard form.', t('n') + ' must be a natural number.'], text: 'series: number of terms' });
      } },
      { id: '13b', level: 'MAS', make: function (r, o) {
        var e = 2 * o.t1 - o.d, Sn = function (n) { return n * (o.d * n + e) / 2; };
        var m = o.n0 + r.int(1, 4), S2 = pickWhere(function () { return Sn(m) + r.int(1, Sn(m + 1) - Sn(m) - 1); }, function (s) { var x = rootsOf(o.d, e, -2 * s)[1]; return Math.abs(x - Math.round(x)) > 0.06; });
        var x = rootsOf(o.d, e, -2 * S2)[1], D = e * e + 8 * o.d * S2;
        return Z.mc(r, 'Can the sum of the series ever be exactly ' + t(S2) + '? Choose the answer with the right reason.', [
          { html: '<b>No</b>: ' + t(eqT(o.d, e, -2 * S2, 'n')) + ' gives ' + t('n\\approx ' + fx(x, 2)) + ', which is not a natural number.', right: true },
          { html: '<b>Yes</b>: about ' + t(fx(x, 2)) + ' terms.', why: 'The number of terms must be a natural number: ' + t(fx(x, 2)) + ' terms is impossible.', code: CP + 'n-round' },
          { html: '<b>Yes</b>: ' + t(Math.round(x)) + ' terms (rounded).', why: t('S_{' + Math.round(x) + '}=' + Sn(Math.round(x))) + ', not ' + t(S2) + '. Rounding doesn’t make it exact.', code: CP + 'n-round' },
          { html: '<b>No</b>: the discriminant is negative, so there is no solution.', why: 'The discriminant is ' + t(nT(D)) + ', which is positive: there are real roots, but are they natural numbers?', code: CP + 'mc' }],
          t(eqT(o.d, e, -2 * S2, 'n')) + ': ' + t('n=\\frac{' + nT(-e) + '\\pm\\sqrt{' + D + '}}{' + 2 * o.d + '}\\approx ' + fx(x, 2)) + ' (or a negative number).<br>' + t('n') + ' must be a natural number, so no: ' + t('S_{' + Math.floor(x) + '}=' + Sn(Math.floor(x))) + ' and ' + t('S_{' + Math.ceil(x) + '}=' + Sn(Math.ceil(x))) + '.', ['Solve ' + t('S_n=' + S2) + ' for ' + t('n') + '. What kind of number must ' + t('n') + ' be?'], 'series: can the sum be exact?');
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), b: -r.pick([1, 3, 5, 7]), c: r.int(1, 6) }; }, function (o) { return !(o.a === 3 && o.b === -5 && o.c === 2) && 4 * o.a * o.c !== o.b * o.b && gcd(gcd(o.a, o.b), o.c) === 1; });
        var a = o.a, b = o.b, cS = -o.c, nb = -b, b2 = b * b, f = 4 * a * o.c, den = 2 * a;
        var opt = function (top, ins) { return t('\\dfrac{' + top + '\\pm\\sqrt{' + ins + '}}{' + den + '}'); };
        var V = rootsOf(a, b, cS);
        return Z.mc(r, 'To solve ' + t(polyT([a, b, 0]) + '=' + o.c) + ', the correct substitution into the quadratic formula is', [
          { html: opt(nb, b2 + '+' + f), right: true },
          { html: opt(nb, b2 + '-' + f), why: 'Write the equation in standard form first: ' + t(eqT(a, b, cS)) + ', so ' + t('c=' + cS) + ' and ' + t('-4ac=+' + f) + '.', code: CP + 'std' },
          { html: opt(b, b2 + '+' + f), why: t('-b=-(' + b + ')=' + nb) + '.', code: CP + 'negb' },
          { html: opt(nb, '-' + b2 + '+' + f), why: t('(' + b + ')^{2}=' + b2) + ', not ' + t(-b2) + ': square a negative with brackets.', code: CP + 'bsq' }],
          'Standard form ' + t(eqT(a, b, cS)) + ', so ' + t('a=' + a + ',\\ b=' + b + ',\\ c=' + cS) + ': ' + t('-b=' + nb) + ' and ' + t('b^{2}-4ac=' + b2 + '+' + f) + '. The roots are ' + t(V.map(function (x) { return vT(x); }).join('\\text{ and }')) + '.', ['Write the equation in standard form before you read ' + t('a') + ', ' + t('b') + ' and ' + t('c') + '.'], 'MC: correct substitution');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'EMG', make: function (r) {
        var Q = gen(r, { a: [2, 4, 6, 8, 9], b: [-12, -2], c: [-6, 6], avoid: AV, test: function (Q) { return Q.irr && Q.g > 1 && Q.Den > 1 && Q.N !== 0 && Q.k > 1; } });
        var rad = radT(Q.Kc, Q.f), m = -Q.b / (2 * Q.a), half = vT(m) + '\\pm ' + radT(Q.k, Q.f);
        return Z.mc(r, 'The zeros of ' + t('y=' + polyT([Q.a, Q.b, Q.c])) + ' are', [
          { html: t(pmT(Q)), right: true },
          { html: t(half), why: 'Every term of the numerator is divided by ' + t('2a=' + 2 * Q.a) + ', including the radical term.', code: CP + 'half' },
          { html: t(Q.Den === 1 ? nT(-Q.N) + '\\pm ' + rad : '\\dfrac{' + nT(-Q.N) + '\\pm ' + rad + '}{' + Q.Den + '}'), why: 'The formula starts with ' + t('-b=' + nT(-Q.b)) + '.', code: CP + 'negb' },
          { html: t(nT(Q.N) + '\\pm ' + rad), why: 'Keep the denominator: the whole numerator is divided by ' + t(Q.Den) + '.', code: CP + 'half' }],
          t('x=\\frac{' + nT(-Q.b) + '\\pm\\sqrt{' + (Q.b * Q.b) + (Q.c > 0 ? '-' : '+') + Math.abs(4 * Q.a * Q.c) + '}}{' + 2 * Q.a + '}=\\frac{' + nT(-Q.b) + '\\pm ' + radT(Q.k, Q.f) + '}{' + 2 * Q.a + '}=' + pmT(Q)), HF.slice(1), 'MC: zeros in simplest form');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'EMG', make: function (r) {
        var Q = gen(r, { a: [2, 3, 4, 5], b: [-11, -3], c: [-4, 4], avoid: AV, test: function (Q) { return Q.irr && Q.vals[1] > 0 && Q.vals[1] < 9.99 && safe([Q.vals[1]], 2); } });
        return Z.nr('<i>Numerical response.</i> The larger root of ' + t(eqT(Q.a, Q.b, Q.c)) + ', to the nearest hundredth, is ____.', Q.vals[1], 2, { cands: [[Q.vals[0], CP + 'mc', 'That is the smaller root.'], [rootsOf(Q.a, -Q.b, Q.c)[1], CP + 'negb', 'The formula starts with ' + t('-b') + '.']], sol: solF(Q.a, Q.b, Q.c, { dp: 2 }) + '<br>The larger root is about ' + t(fx(Q.vals[1], 2)) + '.', hints: ['Use the ' + t('+') + ' sign for the larger root (here ' + t('a>0') + ').'], text: 'NR: larger root' });
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { m: nz(r, -9, 9), n: r.pick(SQF) }; }, function (o) { var c = o.m * o.m - o.n; return c !== 0 && o.m + o.n > 0 && AV(1, -2 * o.m, c) && !(o.m === -4 && o.n === 13); });
        var b = -2 * o.m, c = o.m * o.m - o.n, Q = qf(1, b, c);
        return Z.nrInt('<i>Numerical response.</i> The roots of ' + t(eqT(1, b, c)) + ' can be written as ' + t('m\\pm\\sqrt{n}') + ', where ' + t('m') + ' and ' + t('n') + ' are integers. The value of ' + t('m+n') + ' is ____.', o.m + o.n, { cands: [[-o.m + o.n, CP + 'negb', t('m=\\frac{-b}{2}') + ': check its sign.'], [o.m + 4 * o.n, CP + 'half', 'Simplify the radical and divide every term by 2: ' + t('\\frac{' + nT(-b) + '\\pm 2\\sqrt{' + o.n + '}}{2}=' + nT(o.m) + '\\pm\\sqrt{' + o.n + '}') + '.']],
          sol: solF(1, b, c) + '<br>So ' + t('m=' + o.m) + ', ' + t('n=' + o.n) + ' and ' + t('m+n=' + (o.m + o.n)) + '.', hints: ['Use the formula, simplify the radical, and divide every term by 2.'], text: 'NR: m + n' });
      } }] }
  ];

  /* =========================== Extra Practice 7 =========================== */
  var EXTRA = [
    { num: 'A1', stem: 'Solve with the quadratic formula. Give exact roots in simplest form.', parts: [
      { id: 'eA1a', level: 'BEG', make: function (r) { var Q = tA1(r); return solvePart(CP, '' + t(eqT(1, Q.b, Q.c)), 1, Q.b, Q.c, { text: 'formula: a = 1' }); } },
      { id: 'eA1b', level: 'BEG', make: function (r) { var Q = tA1j(r); return solvePart(CP, '' + t(eqT(1, Q.b, Q.c)), 1, Q.b, Q.c, { text: 'formula: a = 1, simplify' }); } },
      { id: 'eA1c', level: 'EMG', make: function (r) { var Q = tRed(r, 'any'); return solvePart(CP, '' + t(eqT(Q.a, Q.b, Q.c)), Q.a, Q.b, Q.c, { text: 'formula: reduce' }); } },
      { id: 'eA1d', level: 'PRG', make: function (r) { var Q = tRed(r, 'kc'); return solvePart(CP, '' + t(eqT(Q.a, Q.b, Q.c)), Q.a, Q.b, Q.c, { text: 'formula: reduce, a ≥ 4' }); } },
      { id: 'eA1e', level: 'EMG', make: function (r) { var Q = tNone(r); return solvePart(CP, '' + t(eqT(Q.a, Q.b, Q.c)), Q.a, Q.b, Q.c, { text: 'formula: no real roots' }); } },
      { id: 'eA1f', level: 'EMG', make: function (r) { var Q = tPlain(r); return solvePart(CP, '' + t(eqT(Q.a, Q.b, Q.c)), Q.a, Q.b, Q.c, { text: 'formula: nothing to reduce' }); } }] },
    { num: 'A2', stem: 'Solve. Give the roots to the nearest hundredth.', parts: [
      { id: 'eA2a', level: 'BEG', make: function (r) { var Q = gen(r, { a: [2, 3, 4, 5], b: [1, 9], c: [-6, -1], avoid: AV, test: function (Q) { return Q.irr && safe(Q.vals, 2); } }); return solvePart(CP, '' + t(eqT(Q.a, Q.b, Q.c)), Q.a, Q.b, Q.c, { dp: 2, text: 'formula to the nearest hundredth' }); } },
      { id: 'eA2b', level: 'EMG', make: function (r) { var Q = gen(r, { a: [-1], b: [-8, 8], c: [1, 9], avoid: AV, test: function (Q) { return Q.irr && Q.b !== 0 && safe(Q.vals, 2); } }); return solvePart(CP, '' + t(eqT(Q.a, Q.b, Q.c)), Q.a, Q.b, Q.c, { dp: 2, text: 'formula: a = −1, rounded', pre: 'Multiply by ' + t('-1') + ': ' + t(eqT(1, -Q.b, -Q.c)) + ' (the same roots).', sol: 'Multiply by ' + t('-1') + ': ' + t(eqT(1, -Q.b, -Q.c)) + ' (the same roots).<br>' + solF(1, -Q.b, -Q.c, { dp: 2 }) }); } }] },
    { num: 'A3', parts: [
      { id: 'eA3', level: 'EMG', make: function (r) {
        var o = decPick(r), A = o.m * o.p, Bc = o.m * o.q + o.n * o.p, C = o.n * o.q, ft = HW.factor.tex([polyT([o.m, o.n]), polyT([o.p, o.q])]), T = uniq([-o.n / o.m, -o.q / o.p]);
        return Z.fields('Solve ' + t(eqT(A, Bc, C)) + ' by decomposition, and check with the quadratic formula.', [{ label: 'Factored:', mode: 'math', keys: 'poly', chk: K.factored(ft, { wrong: facWrongs(o.m, o.n, o.p, o.q) }), key: ft, placeholder: 'e.g. (5x + 2)(2x - 3)' },
          Z.fRoots(CP, 'Roots:', T, { key: 'x=' + frT(-o.n, o.m) + ',\\ x=' + frT(-o.q, o.p), wrongs: fmlWrongs(CP, A, Bc, C).concat([{ vals: [o.n / o.m, o.q / o.p], code: CP + 'factor', hint: 'Set each factor equal to 0 and solve: check the signs.' }]) })],
          { sol: 'Decomposition: ' + decSol(o.m, o.n, o.p, o.q) + '<br>Formula: ' + solF(A, Bc, C) + ' ✓', hints: ['Find two numbers with product ' + t('ac=' + A * C) + ' and sum ' + t(Bc) + '.'], text: 'decomposition and formula' });
      } }] },
    { num: 'A4', parts: [
      { id: 'eA4', level: 'EMG', make: function (r) { var Q = pickWhere(function () { var h = nz(r, -7, 7), k = r.pick([8, 12, 18, 20, 24, 27, 28, 32, 45, 50]); return qf(1, -2 * h, h * h - k); }, function (Q) { return Q.c !== 0 && AV(1, Q.b, Q.c); }); return csPart(r, 1, Q.b, Q.c); } }] },
    { num: 'B1', stem: 'Write in standard form, then solve. Give exact roots in simplest form.', parts: [
      { id: 'eB1a', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { p: nz(r, -6, 6), q: nz(r, -6, 6), m: r.int(1, 4), n: r.int(-6, 6) }; }, function (o) { var b = o.q - o.p - o.m, c = -o.p * o.q - o.n, Q = qf(1, b, c); return Q.irr && b !== 0 && c !== 0 && o.p !== o.q && AV(1, b, c) && !(o.p === 2 && o.q === 5 && o.m === 2 && o.n === 1); });
        var b = o.q - o.p - o.m, c = -o.p * o.q - o.n, Lx = polyT([1, o.q - o.p, -o.p * o.q]), Rx = polyT([o.m, o.n]);
        return stdFields('' + t('(' + polyT([1, -o.p]) + ')(' + polyT([1, o.q]) + ')=' + Rx), Lx, Rx, [1, b, c], { pre: t(Lx + '=' + Rx) + ', so ' + t(eqT(1, b, c)), text: 'standard form: product = linear' });
      } },
      { id: 'eB1b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { d: r.pick([2, 3, 4]), n: r.int(1, 5), k: r.int(1, 4) }; }, function (o) { var Q = qf(1, -o.k * o.d, o.n * o.d); return Q.irr && !(o.d === 2 && o.n === 1 && o.k === 2) && AV(1, -o.k * o.d, o.n * o.d); });
        var b = -o.k * o.d, c = o.n * o.d;
        var p = stdFields('' + t('\\frac{x}{' + o.d + '}+\\frac{' + o.n + '}{x}=' + o.k) + ', ' + t('x\\ne 0'), 'x^2+' + o.n * o.d, polyT([o.k * o.d, 0]), [1, b, c], { pre: 'Multiply every term by ' + t(o.d + 'x') + ': ' + t('x^{2}+' + o.n * o.d + '=' + polyT([o.k * o.d, 0])) + ', so ' + t(eqT(1, b, c)), text: 'standard form: x in a denominator', hint: 'first multiply every term by ' + t(o.d + 'x') });
        p.solution += '<br>Neither root is ' + t('0') + '.'; return p;
      } },
      { id: 'eB1c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { s: r.pick([0.2, 0.5, 0.25]), b: nz(r, -5, 5), c: nz(r, -5, 5) }; }, function (o) { var Q = qf(1, o.b, o.c); return Q.irr && AV(1, o.b, o.c) && !(o.b === -3 && o.c === -2); });
        var A = o.s, Bd = cl(o.s * o.b), Cd = cl(o.s * o.c), m = Math.round(1 / o.s);
        return stdFields('' + t(eqT(A, Bd, Cd)), polyT([A, Bd, Cd]), '0', [1, o.b, o.c], { pre: 'Multiply every term by ' + t(m) + ': ' + t(eqT(1, o.b, o.c)), text: 'standard form: clear decimals', hint: 'multiply every term by ' + t(m) + ' to clear the decimals' });
      } }] },
    { num: 'B2', shared: function (r) {
        var vt = pickWhere(function () { return { k: r.pick([2, 3, 4, 5]), h: nz(r, -5, 5), m: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return !(z.k === 4 && z.h === 1 && z.m === 5); });
        var fc = decPick(r, function (o) { return o.m * o.p <= 6; });
        var fm = pickWhere(function () { var h = nz(r, -6, 6), f = r.pick([3, 5, 6, 7, 10, 11]); return qf(1, -2 * h, h * h - f); }, function (Q) { return Q.c !== 0 && AV(1, Q.b, Q.c); });
        return { vt: vt, fc: fc, fm: fm };
      }, stem: 'Choose an efficient method and solve exactly.', parts: [
      { id: 'eB2a', level: 'EMG', make: function (r, o) { var v = o.vt; return rootsPart(CP, '' + t(v.k + '(' + polyT([1, -v.h]) + ')^{2}=' + v.k * v.m), [v.h - Math.sqrt(v.m), v.h + Math.sqrt(v.m)], { irr: true, key: 'x=' + v.h + '\\pm\\sqrt{' + v.m + '}', sol: 'Square roots: ' + t('(' + polyT([1, -v.h]) + ')^{2}=' + v.m) + ', so ' + t('x=' + v.h + '\\pm\\sqrt{' + v.m + '}'), hints: ['Divide by ' + t(v.k) + ', then take the square root of both sides (' + t('\\pm') + ').'], text: 'square roots: a(x − p)² = q', wrongs: [{ vals: [-v.h - Math.sqrt(v.m), -v.h + Math.sqrt(v.m)], code: CP + 'cs-p', hint: t('x-p=\\pm\\sqrt{m}') + ' gives ' + t('x=p\\pm\\sqrt{m}') + ': check the sign of ' + t('p') + '.' }, { vals: [v.h - Math.sqrt(v.k * v.m), v.h + Math.sqrt(v.k * v.m)], code: CP + 'cs-div', hint: 'Divide both sides by ' + t(v.k) + ' before taking the square root.' }] }); } },
      { id: 'eB2b', level: 'EMG', make: function (r, o) { var z = o.fc, A = z.m * z.p, Bc = z.m * z.q + z.n * z.p, C = z.n * z.q; return rootsPart(CP, '' + t(eqT(A, Bc, C)), [-z.n / z.m, -z.q / z.p], { key: 'x=' + frT(-z.n, z.m) + ',\\ x=' + frT(-z.q, z.p), sol: 'Factoring: ' + t(HW.factor.tex([polyT([z.m, z.n]), polyT([z.p, z.q])]) + '=0') + ', so ' + t('x=' + frT(-z.n, z.m)) + ' or ' + t('x=' + frT(-z.q, z.p)) + '.', hints: ['It factors: use decomposition (product ' + t(A * C) + ', sum ' + t(Bc) + ').'], text: 'factoring: ax² + bx + c', wrongs: [{ vals: [z.n / z.m, z.q / z.p], code: CP + 'factor', hint: 'Set each factor equal to 0: check the signs.' }] }); } },
      { id: 'eB2c', level: 'EMG', make: function (r, o) { var Q = o.fm; return solvePart(CP, '' + t(eqT(1, Q.b, Q.c)), 1, Q.b, Q.c, { text: 'formula: does not factor', pre: 'Formula (it does not factor):' }); } },
      { id: 'eB2d', level: 'EMG', make: function (r, o) {
        var z = o.fc, rows = [{ id: 'a', html: '(a) ' + t(o.vt.k + '(' + polyT([1, -o.vt.h]) + ')^{2}=' + o.vt.k * o.vt.m) }, { id: 'b', html: '(b) ' + t(eqT(z.m * z.p, z.m * z.q + z.n * z.p, z.n * z.q)) }, { id: 'c', html: '(c) ' + t(eqT(1, o.fm.b, o.fm.c)) }];
        var p = B.grid('Name the most efficient method for each equation above.', rows, [{ id: 'fac', html: 'Factoring' }, { id: 'sq', html: 'Square roots' }, { id: 'qf', html: 'Quadratic formula' }], { a: 'sq', b: 'fac', c: 'qf' }, { rowHead: 'Equation', colHead: 'Method' },
          'a squared bracket: square roots. (b) it factors: factoring. (c) it does not factor: the formula.', ['A squared bracket: square roots. Easy factors: factoring. Otherwise: the formula.'], 'choose a method');
        p.outcome = OUT; return p;
      } }] },
    { num: 'B3', shared: function (r) {
        return pickWhere(function () { return { a: -r.int(1, 2), b: 2 * r.int(1, 4), c: r.int(1, 7) }; }, function (o) { var Dw = o.b * o.b - 4 * Math.abs(o.a) * o.c, Q = qf(o.a, o.b, o.c); return Dw > 0 && sqf(Dw)[0] >= 2 && sqf(Dw)[1] > 1 && Q.irr && !(o.a === -1 && o.b === 4 && o.c === 2) && AV(o.a, o.b, o.c); });
      }, stem: function (o) { var Dw = o.b * o.b - 4 * Math.abs(o.a) * o.c, s = sqf(Dw); var g = gcd(gcd(o.b, s[0]), 2 * o.a), wN = -o.b / g, wK = s[0] / g, wD = 2 * o.a / g; if (wD < 0) { wN = -wN; wD = -wD; }
        return 'A student solved ' + t(eqT(o.a, o.b, o.c)) + ' and wrote:<br>' + Z.work(['x=\\dfrac{' + nT(-o.b) + '\\pm\\sqrt{' + o.b * o.b + '-' + 4 * Math.abs(o.a) * o.c + '}}{' + 2 * o.a + '}=\\dfrac{' + nT(-o.b) + '\\pm ' + radT(s[0], s[1]) + '}{' + 2 * o.a + '}=' + (wD === 1 ? (wN ? nT(wN) : '') + '\\pm ' + radT(wK, s[1]) : '\\dfrac{' + nT(wN) + '\\pm ' + radT(wK, s[1]) + '}{' + wD + '}')]); }, parts: [
      { id: 'eB3a', level: 'PRG', make: function (r, o) {
        var f = 4 * Math.abs(o.a) * o.c;
        return Z.mc(r, 'Find the error.', [
          { html: 'The sign of ' + t('-4ac') + ': with ' + t('a=' + o.a) + ' and ' + t('c=' + o.c) + ', ' + t('-4ac=+' + f) + ', so the discriminant is ' + t(o.b * o.b + '+' + f) + '.', right: true },
          { html: 'The sign of ' + t('-b') + ': it should be ' + t('+' + o.b) + '.', why: t('b=' + o.b) + ', so ' + t('-b=' + nT(-o.b)) + ' is right.', code: CP + 'errors' },
          { html: 'The denominator: it should be ' + t(2 * Math.abs(o.a)) + ', not ' + t(2 * o.a) + '.', why: t('2a=2(' + o.a + ')=' + 2 * o.a) + ' is right.', code: CP + 'errors' },
          { html: 'The last step: only ' + t(nT(-o.b)) + ' was divided.', why: 'The last step divides every term correctly. Check the discriminant.', code: CP + 'errors' }],
          'With ' + t('a=' + o.a) + ' and ' + t('c=' + o.c) + ': ' + t('-4ac=-4(' + o.a + ')(' + o.c + ')=+' + f) + ', so ' + t('b^{2}-4ac=' + o.b * o.b + '+' + f + '=' + (o.b * o.b + f)) + ', not ' + t(o.b * o.b - f) + '.', ['Check the sign of every product in the discriminant: ' + t('a') + ' is negative.'], 'error analysis: find the error');
      } },
      { id: 'eB3b', level: 'PRG', make: function (r, o) { return solvePart(CP, 'Give the correct exact roots.', o.a, o.b, o.c, { text: 'error analysis: correct roots' }); } }] },
    { num: 'B4', parts: [
      { id: 'eB4', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { h0: r.pick([3, 5, 7.5, 10]), v: r.pick([1, 1.5, 2, 2.5, 3, 4, 5]) }; }, function (o) { return !(o.h0 === 10 && o.v === 3) && safe(rootsOf(-4.9, o.v, o.h0), 1); });
        var V = rootsOf(-4.9, o.v, o.h0);
        return apxPart('A diver jumps from a ' + t(nT(o.h0)) + ' m platform. Her height above the water after ' + t('t') + ' seconds is ' + t('h=-4.9t^{2}+' + nT(o.v) + 't+' + nT(o.h0)) + ' metres. When does she enter the water, to the nearest tenth of a second?', V[1], 1, { after: 's', unit: 's', cands: [[-V[0], CP + 'neg-root', 'Reject the negative root (a time before the jump) and use the positive one.'], [o.v / 9.8, CP + 'vertex', 'That is when she is highest. She enters the water when ' + t('h=0') + '.']],
          sol: solF(-4.9, o.v, o.h0, { v: 't', dp: 2 }) + '<br>Reject the negative root. She enters the water after about ' + t(fx(V[1], 1)) + ' s.', hints: ['She enters the water when ' + t('h=0') + '.'], text: 'diver: entry time' });
      } }] },
    { num: 'B5', parts: [
      { id: 'eB5', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { s: 2 * r.int(4, 12) + 1, A: r.int(10, 60) }; }, function (o) { var D = o.s * o.s - 4 * o.A, V = rootsOf(1, -o.s, o.A); return D > 0 && !isSq(D) && !(o.s === 15 && o.A === 40) && V[0] > o.s / 5 && safe(V, 1); });
        var Pm = 2 * o.s, Q = qf(1, -o.s, o.A), V = Q.vals;
        return Z.fields('A rectangular patio has a perimeter of ' + t(Pm) + ' m and an area of ' + t(o.A + '\\text{ m}^{2}') + '. Determine its exact dimensions, then round to the nearest tenth.', [
          Z.fRoots(CP, 'Exact side lengths:', V, { irr: true, key: pmT(Q), what: 'side length', placeholder: 'e.g. (9 ± sqrt(41))/2', wrongs: [{ vals: rootsOf(1, -Pm, o.A), code: CP + 'perim', hint: 'A length and a width add to half the perimeter, ' + t(o.s) + '.' }].concat(fmlWrongs(CP, 1, -o.s, o.A)) }),
          Z.fApx('Longer side:', V[1], 1, { after: 'm' }), Z.fApx('Shorter side:', V[0], 1, { after: 'm' })],
          { sol: 'Width ' + t('x') + ', length ' + t(o.s + '-x') + ': ' + t('x(' + o.s + '-x)=' + o.A + '\\Rightarrow ' + eqT(1, -o.s, o.A)) + '<br>' + solF(1, -o.s, o.A) + '<br>The patio is ' + t(oneT(Q, 1) + '\\approx ' + fx(V[1], 1)) + ' m by ' + t(oneT(Q, -1) + '\\approx ' + fx(V[0], 1)) + ' m.', hints: ['A length and a width add to half the perimeter.'], text: 'patio: exact dimensions' });
      } }] },
    { num: 'B6', parts: [
      { id: 'eB6', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { m: nz(r, -7, 7), n: r.pick([2, 3, 5, 6, 7, 10, 11, 13, 17]) }; }, function (o) { var c4 = o.m * o.m - o.n; return c4 % 4 === 0 && c4 !== 0 && o.m % 2 !== 0 && !(o.m === 3 && o.n === 5); });
        var b = -o.m, c = (o.m * o.m - o.n) / 4; // x² + bx + c with roots (m ± √n)/2
        var rt = '\\dfrac{' + o.m + '\\pm\\sqrt{' + o.n + '}}{2}';
        return Z.mc(r, 'Which equation has the roots ' + t(rt) + '?', [
          { html: t(eqT(1, b, c)), right: true },
          { html: t(eqT(1, -b, c)), why: 'That gives ' + t('\\frac{' + (-o.m) + '\\pm\\sqrt{' + o.n + '}}{2}') + ': the sign of ' + t('-b') + ' is wrong.', code: CP + 'negb' },
          { html: t(eqT(2, b, c)), why: 'With ' + t('a=2') + ' the denominator would be ' + t('2a=4') + '.', code: CP + '2a' },
          { html: t(eqT(1, b, -c)), why: 'That gives ' + t('b^{2}-4ac=' + (o.m * o.m + 4 * c)) + ', not ' + t(o.n) + '.', code: CP + '4ac' }],
          t(eqT(1, b, c)) + ': ' + t('x=\\frac{' + nT(-b) + '\\pm\\sqrt{' + o.m * o.m + (c > 0 ? '-' : '+') + Math.abs(4 * c) + '}}{2}=' + rt) + ' ✓', ['Use the formula on each equation, or compare ' + t('-b') + ', ' + t('b^{2}-4ac') + ' and ' + t('2a') + ' with the roots.'], 'MC: equation from its roots');
      } }] },
    { num: 'B7', parts: [
      { id: 'eB7', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { v: r.int(10, 30), h0: r.int(1, 4) }; }, function (o) { var V = rootsOf(-5, o.v, o.h0); return !(o.v === 18 && o.h0 === 1) && V[1] < 9.95 && safe([V[1]], 1); });
        var V = rootsOf(-5, o.v, o.h0);
        return Z.nr('<i>Numerical response.</i> A ball is thrown upward with height ' + t('h=-5t^{2}+' + o.v + 't+' + o.h0) + ' metres after ' + t('t') + ' seconds. The time it is in the air, to the nearest tenth of a second, is ____ s.', V[1], 1, { cands: [[o.v / 10, CP + 'vertex', 'That is the time of the maximum height. It lands when ' + t('h=0') + '.'], [-V[0], CP + 'neg-root', 'Use the positive root.']], sol: solF(-5, o.v, o.h0, { v: 't', dp: 2 }) + '<br>The positive root: about ' + t(fx(V[1], 1)) + ' s.', hints: ['The ball is in the air until ' + t('h=0') + '.'], text: 'NR: time in the air' });
      } }] }
  ];
  EXTRA.push(
    { num: 'C1', parts: [
      { id: 'eC1', level: 'MAS', make: function (r) {
        var S = pickWhere(function () { var tri = r.chance(0.3); if (tri) { var n = r.int(20, 45); return { S: n * (n + 1) / 2, n: n }; } return { S: 10 * r.int(25, 100) }; }, function (o) { return o.S !== 500 && o.S !== 496 && o.S !== 528 && (o.n || Math.abs((-1 + Math.sqrt(1 + 8 * o.S)) / 2 - Math.round((-1 + Math.sqrt(1 + 8 * o.S)) / 2)) > 0.05); });
        var x = (-1 + Math.sqrt(1 + 8 * S.S)) / 2, D = 1 + 8 * S.S, n = Math.floor(x + 1e-9), Sn = function (k) { return k * (k + 1) / 2; }, yes = isInt(x);
        var opts = yes ? [{ html: '<b>Yes</b>: ' + t('n^{2}+n-' + 2 * S.S + '=0') + ' gives ' + t('n=' + Math.round(x)) + ', a natural number.', right: true },
          { html: '<b>No</b>: ' + t('n') + ' is not a natural number.', why: t('\\sqrt{' + D + '}=' + Math.round(Math.sqrt(D))) + ', so ' + t('n=\\frac{-1+' + Math.round(Math.sqrt(D)) + '}{2}=' + Math.round(x)) + ' exactly.', code: CP + 'n-round' },
          { html: '<b>No</b>: the discriminant is negative.', why: 'The discriminant is ' + t(D) + ', which is positive.', code: CP + 'mc' },
          { html: '<b>Yes</b>: ' + t('n=' + (Math.round(x) + 1)) + '.', why: t('S_{' + (Math.round(x) + 1) + '}=' + Sn(Math.round(x) + 1)) + '.', code: CP + 'mc' }]
          : [{ html: '<b>No</b>: ' + t('n=\\frac{-1+\\sqrt{' + D + '}}{2}\\approx ' + fx(x, 2)) + ', which is not a natural number.', right: true },
            { html: '<b>Yes</b>: ' + t('n\\approx ' + fx(x, 2)) + '.', why: 'A number of terms must be a natural number.', code: CP + 'n-round' },
            { html: '<b>Yes</b>: ' + t('n=' + Math.round(x)) + ' (rounded).', why: t('S_{' + Math.round(x) + '}=' + Sn(Math.round(x))) + ', not ' + t(S.S) + '.', code: CP + 'n-round' },
            { html: '<b>No</b>: the discriminant is negative.', why: 'The discriminant is ' + t(D) + ', which is positive.', code: CP + 'mc' }];
        return Z.mc(r, 'The sum of the first ' + t('n') + ' natural numbers is ' + t('\\dfrac{n(n+1)}{2}') + '. Can this sum ever be exactly ' + t(S.S) + '? Use the quadratic formula.', opts,
          t('\\frac{n(n+1)}{2}=' + S.S + '\\Rightarrow n^{2}+n-' + 2 * S.S + '=0\\Rightarrow n=\\frac{-1\\pm\\sqrt{' + D + '}}{2}') + '. The positive root is ' + (yes ? t(Math.round(x)) + ', a natural number: yes.' : 'about ' + t(fx(x, 2)) + ', not a natural number, so no (' + t('S_{' + n + '}=' + Sn(n)) + ', ' + t('S_{' + (n + 1) + '}=' + Sn(n + 1)) + ').'), ['Set the sum equal to ' + t(S.S) + ' and solve for ' + t('n') + '.'], 'sum of naturals: possible?');
      } }] },
    { num: 'C2', parts: [
      { id: 'eC2', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { p: r.pick([2, 4, 6]) * sgn(r), q: r.pick([1, -1, -2, -3, 2, -4]) }; }, function (o) { var D = o.p * o.p - 4 * o.q; return D > 0 && !isSq(D) && !(o.p === -4 && o.q === 1); });
        // x² + p a x + q a² = 0 → x = a(−p ± √D)/2
        var D = o.p * o.p - 4 * o.q, s = sqf(D), g = gcd(gcd(Math.abs(o.p), s[0]), 2), N = -o.p / g, Kc = s[0] / g, Den = 2 / g;
        var inner = Den === 1 ? nT(N) + '\\pm ' + radT(Kc, s[1]) : '\\frac{' + nT(N) + '\\pm ' + radT(Kc, s[1]) + '}{' + Den + '}';
        var key = 'x=a\\left(' + inner + '\\right)';
        var f1 = function (a) { return a * (N + Kc * Math.sqrt(s[1])) / Den; }, f2 = function (a) { return a * (N - Kc * Math.sqrt(s[1])) / Den; };
        var eq = 'x^{2}' + (o.p > 0 ? '+' : '-') + Math.abs(o.p) + 'ax' + (o.q > 0 ? '+' : '-') + (Math.abs(o.q) === 1 ? '' : Math.abs(o.q)) + 'a^{2}=0';
        var p = B.math('Solve ' + t(eq) + ' for ' + t('x') + ' in terms of ' + t('a') + ', where ' + t('a>0') + '. Give the answer in simplest form.', prChk(CP, [f1, f2], { p: 'a', pos: true, cands: [[[function (a) { return -f1(a); }, function (a) { return -f2(a); }], CP + 'negb', 'The formula starts with ' + t('-b') + '.'], [[function (a) { return a * (-o.p + s[0] * Math.sqrt(s[1])); }, function (a) { return a * (-o.p - s[0] * Math.sqrt(s[1])); }], CP + 'half', 'Divide every term of the numerator by ' + t('2a=2') + '.'], [[function (a) { return a * (-o.p / 2 + s[0] * Math.sqrt(s[1])); }, function (a) { return a * (-o.p / 2 - s[0] * Math.sqrt(s[1])); }], CP + 'half', 'Divide <b>every</b> term of the numerator by ' + t('2') + ', the radical term too.']] }), key,
          'The coefficients are ' + t('1') + ', ' + t((o.p === 1 ? '' : o.p === -1 ? '-' : nT(o.p)) + 'a') + ' and ' + t((o.q === 1 ? '' : o.q === -1 ? '-' : nT(o.q)) + 'a^{2}') + ':<br>' + t('x=\\frac{' + nT(-o.p) + 'a\\pm\\sqrt{' + o.p * o.p + 'a^{2}' + (o.q > 0 ? '-' : '+') + Math.abs(4 * o.q) + 'a^{2}}}{2}=\\frac{' + nT(-o.p) + 'a\\pm\\sqrt{' + D + 'a^{2}}}{2}=\\frac{' + nT(-o.p) + 'a\\pm ' + (s[0] === 1 ? '' : s[0]) + 'a\\sqrt{' + s[1] + '}}{2}=a\\left(' + inner + '\\right)') + ' (' + t('\\sqrt{a^{2}}=a') + ' since ' + t('a>0') + ')',
          ['Here ' + t('b=' + (o.p === 1 ? '' : o.p === -1 ? '-' : nT(o.p)) + 'a') + ' and ' + t('c=' + (o.q === 1 ? '' : o.q === -1 ? '-' : nT(o.q)) + 'a^{2}') + '. Substitute into the formula.', t('\\sqrt{' + D + 'a^{2}}=a\\sqrt{' + D + '}') + ' since ' + t('a>0') + '; then simplify.'], 'roots in terms of a', { keys: 'p57', vars: ['x', 'a'], placeholder: 'e.g. x = a(1 ± sqrt(2))' });
        p.outcome = OUT; p.good = ['x=' + nT(N) + 'a\\pm ' + (Kc === 1 ? '' : Kc) + 'a\\sqrt{' + s[1] + '}'].filter(function () { return Den === 1; }); p.bad = ['x=a\\left(' + nT(-N) + '\\pm\\sqrt{' + s[1] + '}\\right)', 'x=\\frac{' + nT(-o.p) + 'a\\pm\\sqrt{' + D + 'a^{2}}}{2}'];
        return p;
      } }] },
    { num: 'C3', parts: [
      { id: 'eC3', level: 'MAS', make: function (r) {
        var n = r.pick([2, 3, 4, 5]), Q = qf(1, -n, -1), x = Q.vals[1];
        return Z.fields('A rectangle is ' + t('1') + ' unit wide and ' + t('x') + ' units long (' + t('x>' + n) + '). Cutting ' + n + ' squares, each ' + t('1') + ' by ' + t('1') + ', off one end leaves a smaller rectangle with the same shape, so ' + t('\\dfrac{x}{1}=\\dfrac{1}{x-' + n + '}') + '. Determine ' + t('x') + ' exactly and to the nearest thousandth.', [
          Z.fRoots(CP, t('x=') + ' (exact)', [x], { irr: true, key: oneT(Q, 1), what: 'value', placeholder: 'exact, e.g. 1 + sqrt(2)', wrongs: [{ vals: Q.vals, code: CP + 'ratio', hint: 'Only one root has ' + t('x>' + n) + ': reject the negative one.' }], extraHint: 'Only one root has ' + t('x>' + n) + '.', extraCode: CP + 'ratio' }),
          Z.fApx(t('x\\approx'), x, 3, {})],
          { sol: t('x(x-' + n + ')=1\\Rightarrow ' + eqT(1, -n, -1)) + '<br>' + solF(1, -n, -1) + '<br>Since ' + t('x>' + n) + ': ' + t('x=' + oneT(Q, 1) + '\\approx ' + fx(x, 3)) + '.', hints: ['Cross-multiply, then write the equation in standard form.', 'Keep only the root that fits ' + t('x>' + n) + '.'], text: 'golden-ratio type' });
      } }] });

  HW.defineLesson({ id: LID, unit: 5, num: '7', title: 'The Quadratic Formula', outcome: OUT, calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
