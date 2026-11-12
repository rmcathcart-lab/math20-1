/* Math 20-1 · Unit 5 · Lesson 9 — Maximum and Minimum Problems: Graphical Approach (outcome RF4 on every part)
 * Assignment 9 (m201book unit5/u5_l09.tex, Questions 1–14) and the Lesson 9 Extra Practice (u5_ep09.tex, A1–A3, B1–B6,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (contexts vary a
 * little); the lesson's example models and the booklet question's own numbers are left out. Calculator lesson: answers
 * from a model are rounded as the booklet asks (nearest hundredth unless it says otherwise) and accepted within the
 * rounding (a domain or range endpoint may be any value that rounds to the right one).
 *
 * This file also defines the kit HW.u5mm, used by u5l10.js (which waits for it if it loads first):
 *   numbers   cl, same, nT, fx, rd, money, toFrac, rT (exact rational TeX), polyTex(coefs, v, fracMode), vfTex(a, p, q, v)
 *   checkers  exactCheck(value, o), cdiag(cands, dp), setCheck(T) (domain/range in set notation, endpoints within the
 *             rounding), exprCheck(fn, o) (any equivalent expression in one letter; o.vertex = {a, p, q, c}: vertex form
 *             a(x − p)² + q with sign-slip / completing-the-square diagnoses), maxminCheck('max' | 'min')
 *   parts     numPart, apxPart, fieldsPart (boxes: number / rounded / set / expression / max-min word; o.swap = [i, j] accepts
 *             the two boxes in either order), mcPart, exprPart
 *   figures   graphFig(o) (a model's graph on a labelled grid, from the actual function)
 * Recognised mistakes (codes u5l9-…): the wrong feature of the graph (vertex vs intercepts, the negative zero), the
 * context range started at the launch height, an open-ended domain, the time for the height (or the reverse), the number
 * of price changes for the price, price and sales changes in the wrong direction, the vertex of a whole-step revenue
 * model used directly, rounded to the nearer step instead of comparing, whole-number ranges rounded instead of trimmed.
 * Conversions: "sketch the graph" / "plot the data" → choose the graph; "which coordinate" → multiple choice;
 * "explain" / "which plan" → multiple choice of explanations; pairs of times or lengths → two boxes (either order).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 6(b), 10(b), Extra C2(b), C3. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u5l9';

  /* =========================== the kit (HW.u5mm) =========================== */
  var M = HW.u5mm = {};
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function same(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function nT(x) { x = cl(x); if (Math.abs(x) < 1e-12) x = 0; return F(x); }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function fx(x, dp) { return F(rd(x, dp).toFixed(dp)); }
  function money(x) { var v = cl(x); return '\\$' + (Math.abs(v - Math.round(v)) < 1e-9 ? F(Math.round(v)) : fx(v, 2)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function pickWhere(gen, okf) { for (var i = 0; i < 20000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('u5mm: no valid numbers'); }
  function toFrac(x) { for (var q = 1; q <= 720; q++) { var p = x * q; if (Math.abs(p - Math.round(p)) < 1e-7) { var g = gcd(Math.round(p), q) || 1; return [Math.round(p) / g, q / g]; } } return null; }
  function terminates(fr) { var q = fr[1]; while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; }
  /* exact rational as TeX (an integer, or a fraction) */
  function rT(x) { var f = toFrac(x); if (!f || f[1] === 1) return nT(x); return (f[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(f[0]) + '}{' + f[1] + '}'; }
  function cT(x, fracMode) { var f = toFrac(x); if (fracMode && f && f[1] !== 1) return '\\frac{' + Math.abs(f[0]) + '}{' + f[1] + '}'; return nT(Math.abs(x)); }
  /* a polynomial from its coefficients, highest power first */
  function polyTex(cs, v, fracMode) {
    var n = cs.length - 1, s = '';
    cs.forEach(function (c, i) {
      var pw = n - i; if (same(c, 0)) return;
      var neg = c < 0, body = (same(Math.abs(c), 1) && pw > 0 ? '' : cT(c, fracMode)) + (pw > 1 ? v + '^{' + pw + '}' : pw === 1 ? v : '');
      s += s ? (neg ? '-' : '+') + body : (neg ? '-' : '') + body;
    });
    return s || '0';
  }
  function binTex(v, p, fracMode) { return same(p, 0) ? v : v + (p > 0 ? '-' : '+') + cT(p, fracMode); }
  /* vertex form a(v − p)² + q */
  function vfTex(a, p, q, v, fracMode) {
    var s = (same(a, 1) ? '' : same(a, -1) ? '-' : (a < 0 ? '-' : '') + cT(a, fracMode)) + (same(p, 0) ? v + '^{2}' : '(' + binTex(v, p, fracMode) + ')^{2}');
    if (!same(q, 0)) s += (q < 0 ? '-' : '+') + cT(q, fracMode);
    return s;
  }
  function pq(cs, x) { var s = 0; cs.forEach(function (c) { s = s * x + c; }); return s; }
  function roots(a, b, c) { var D = b * b - 4 * a * c; if (D < -1e-12) return []; D = Math.max(0, D); var r1 = (-b - Math.sqrt(D)) / (2 * a), r2 = (-b + Math.sqrt(D)) / (2 * a); return r1 < r2 ? [r1, r2] : [r2, r1]; }
  M.cl = cl; M.same = same; M.nT = nT; M.rd = rd; M.fx = fx; M.money = money; M.gcd = gcd; M.pickWhere = pickWhere; M.toFrac = toFrac; M.rT = rT; M.cT = cT;
  M.polyTex = polyTex; M.binTex = binTex; M.vfTex = vfTex; M.pq = pq; M.roots = roots;

  /* ---- reading a number answer (a leading $ is fine; a trailing unit gets a nudge) ---- */
  var UNIT = /\s*(cm\^\{?2\}?|m\^\{?2\}?|cm²|m²|mm|cm|km\/h|km|kg\/ha|kg|m|g|s|sec|seconds?|h|hours?|days?|weeks?|months?|years?|min|L|bikes|bicycles|members|skiers|pizzas|tickets|yearbooks|cupcakes|phones|units|bushels|°C|\^\{?\\circ\}?C|\\%|%)\s*\.?\s*$/i;
  function clean(resp) {
    var s = String(resp == null ? '' : resp).trim().replace(/^\s*(\\\$|\$)\s*/, '').replace(/^\s*\\text\{\s*\$\s*\}\s*/, '');
    var u = s.replace(/\\(text|mathrm)\{\s*([^{}]*)\}/g, '$2').replace(/\\[,;: ]|~/g, ' ');
    var u2 = u.replace(UNIT, '');
    return { s: s, u: u2 !== u && u2.trim() ? u2.trim() : null };
  }
  function cdiag(cands, dp) {
    return function (v) {
      var c = cands || [];
      for (var i = 0; i < c.length; i++) {
        if (!c[i] || !isFinite(c[i][0])) continue;
        if (same(v, c[i][0]) || (dp != null && Math.abs(v - rd(c[i][0], dp)) < 1e-9)) return { code: c[i][1], hint: c[i][2] };
      }
      return null;
    };
  }
  /* an exact number (a terminating value may be a decimal; otherwise a fraction in lowest terms) */
  function exactCheck(T, o) {
    o = o || {};
    var fr = toFrac(T), nonTerm = fr && fr[1] !== 1 && !terminates(fr), dg = cdiag(o.cands);
    return function (resp) {
      var C = clean(resp), a = K.read(C.s);
      if (a.res && C.u != null) { var a2 = K.read(C.u); if (!a2.res && same(a2.val, T)) return form('units', 'Right — now leave the unit out and type just the number.'); if (!a2.res) a = a2; }
      if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (Object.keys(sh.vars).length) return form('notnumber', 'Type a number only (no letters).');
      if (same(a.val, T)) {
        var pf = ex.plainFraction(a.ast);
        if (sh.ops || sh.pow || sh.roots || sh.muls || (sh.divs && !pf)) return form('simplify', 'Right value — now simplify it to a single number.');
        if (pf && pf[1] !== 1 && gcd(pf[0], pf[1]) > 1) return form('lowest', 'Right value — now reduce the fraction to lowest terms.');
        return ok();
      }
      if (nonTerm && sh.decimals && Math.abs(a.val - T) < 0.01) return form('decimal-rounded', 'That decimal is close, but it isn’t exact. Give the exact value as a fraction.');
      if (!isFinite(a.val)) return wrong('undefined', null);
      var h = dg(a.val); if (h) return wrong(h.code, h.hint);
      if (T !== 0 && same(a.val, -T)) return wrong('sign', 'Check the sign of your answer.');
      return wrong('value', null);
    };
  }
  function exactKey(T) { var f = toFrac(T); return f && f[1] !== 1 && !terminates(f) ? rT(T) : String(cl(T)); }
  function badOf(cands, ans, dp) {
    var out = [];
    (cands || []).forEach(function (c) {
      if (!c || !isFinite(c[0])) return;
      var x = dp != null ? rd(c[0], dp) : cl(c[0]);
      if (dp != null ? Math.abs(x - rd(ans, dp)) < 1e-9 : same(x, ans)) return;
      if (Math.abs(x) > 1e15) return;
      var f = toFrac(x);
      out.push(dp != null ? x.toFixed(dp) : f && f[1] !== 1 && !terminates(f) ? rT(x) : String(x));
    });
    return out;
  }
  function nrWrap(check) {
    return function (resp) { var s = String(resp == null ? '' : resp).replace(/\s/g, ''); if (HW.parse.number(s).ok && s.length > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).'); return check(resp); };
  }
  function unitAns(o) { return (o.unit ? '\\text{ ' + o.unit + '}' : '') + (o.unitTex || ''); }
  /* one exact number. o: cands, before, after, sol, hints, text, nr, unit, ansPre */
  function numPart(prompt, ans, o) {
    o = o || {};
    var f = toFrac(ans), frac = f && f[1] !== 1 && !terminates(f);
    var input = frac || o.math ? { type: 'math', keys: 'fraction', before: o.before, after: o.after } : { type: 'number', before: o.before, after: o.after, nr: !!o.nr };
    var check = exactCheck(ans, o); if (o.nr) check = nrWrap(check);
    return { prompt: prompt, input: input, check: check, key: exactKey(ans), answer: t((o.ansPre || '') + (frac ? rT(ans) : nT(ans)) + unitAns(o)),
      solution: o.sol, hints: o.hints || [], text: o.text, bad: badOf(o.cands, ans).concat(o.bad || []), good: o.good, outcome: o.outcome };
  }
  /* one rounded number */
  function apxPart(prompt, x, dp, o) {
    o = o || {};
    var want = rd(x, dp);
    return { prompt: prompt, input: { type: 'number', before: o.before, after: o.after, nr: !!o.nr }, check: K.approx(x, dp, { diag: cdiag(o.cands, dp), nr: o.nr }), key: want.toFixed(Math.max(dp, 0)),
      answer: t((o.ansPre || '') + fx(x, dp) + unitAns(o)), solution: o.sol, hints: o.hints || [], text: o.text, bad: badOf(o.cands, x, dp).concat(o.bad || []), good: o.good, outcome: o.outcome };
  }

  /* ---- domain / range in set notation. T = { v, lo, hi, lc, hc, dp (endpoints within the rounding), wrong: [{lo, hi, lc, hc, code, hint}], other: {…} } ---- */
  var SETWHY = {
    empty: 'Type your answer first.', unbalanced: 'Check your braces: a { needs a matching }.', 'var-mix': 'Use the same letter all the way through.',
    backwards: 'Write the smaller number first (on the left).', 'inf-bracket': 'Infinity is never included: use a round bracket next to ' + t('\\infty') + '.',
    'no-braces': 'Write the set with an inequality, e.g. ' + t('\\{t\\mid 0\\le t\\le 5,\\ t\\in\\mathbb{R}\\}') + '.', 'list-var': 'Write the set with an inequality, not a list.',
    unreadable: 'I can’t read that. Write it like ' + t('\\{t\\mid 0\\le t\\le 5,\\ t\\in\\mathbb{R}\\}') + ' or ' + t('0\\le t\\le 5') + '.'
  };
  function setTex(T) {
    var e = function (x) { return T.dp == null || Number.isInteger(cl(x)) ? nT(x) : fx(x, T.dp); }, v = T.v, lo = e(T.lo), hi = e(T.hi);
    return '\\{' + v + '\\mid ' + lo + (T.lc ? '\\le ' : '<') + v + (T.hc ? '\\le ' : '<') + hi + ',\\ ' + v + '\\in\\mathbb{R}\\}';
  }
  function setKey(T) { return setTex(T).replace(/\\,(?=\d)/g, ''); }
  function setCheck(T) {
    var tol = T.dp == null ? 1e-9 : 0.5 * Math.pow(10, -T.dp) + 1e-9;
    function near(a, b) { return a === b || Math.abs(a - b) <= tol || (T.dp != null && isFinite(a) && isFinite(b) && Math.abs(rd(a, T.dp) - rd(b, T.dp)) < 1e-9); }
    function match(P, S) { return near(P.lo, S.lo) && near(P.hi, S.hi) && P.lc === !!S.lc && P.hc === !!S.hc; }
    return function (resp) {
      var r = HW.sets.parse(resp);
      if (!r.ok) return form(r.why === 'empty' ? 'empty' : 'set-' + r.why, SETWHY[r.why] || SETWHY.unreadable);
      if (r.set.kind === 'list') return wrong('set-continuous', 'Every value in between is included too (the graph is a solid curve), so use an inequality, not a list of values.');
      if (r.set.parts.length !== 1) return wrong('set-values', 'In this context the values form one unbroken interval.');
      var P = r.set.parts[0];
      if (match(P, T)) {
        if (r.v && r.v !== T.v) return form('set-letter', 'Right set — but use the letter ' + t(T.v) + ' here.');
        if (r.form === 'builder' && !r.tagged) return form('set-tag', 'Right — now finish the set notation with ' + t(',\\ ' + T.v + '\\in\\mathbb{R}') + '.');
        return ok();
      }
      var ws = T.wrong || [];
      for (var i = 0; i < ws.length; i++) if (match(P, ws[i])) return wrong(ws[i].code, ws[i].hint);
      if (T.other && match(P, T.other)) return wrong('set-swap', 'That’s the ' + (T.otherName || 'other set') + '. The <b>domain</b> is the inputs (' + t(T.v === 'h' || T.v === 'T' ? 'the other letter' : T.v) + '); the <b>range</b> is the outputs.');
      if (near(P.lo, T.lo) && near(P.hi, T.hi)) return wrong('set-endpoint', 'The end values are right — check whether each one is included (' + t('\\le') + ') or not (' + t('<') + ').');
      if (P.lo === -Infinity || P.hi === Infinity) return wrong(LID + '-unbounded', 'In this context the values stop: the model is only used ' + (T.ctx || 'between the start and the end of the situation') + ', so the set has an end value on both sides.');
      if (near(P.hi, T.hi)) return wrong(LID + '-set-low', 'The upper end is right. Check the <b>lowest</b> value that makes sense in the context.');
      if (near(P.lo, T.lo)) return wrong(LID + '-set-high', 'The lower end is right. Check the <b>greatest</b> value: ' + (T.hiWhy || 'read it from the graph.'));
      return wrong('set-values', null);
    };
  }
  M.setCheck = setCheck; M.setTex = setTex; M.setKey = setKey;

  /* ---- expressions in one letter: equivalent to fn (checked at several values) ---- */
  function stripLHS(s) {
    return String(s == null ? '' : s).replace(/^\s*[A-Za-z](_\{?[A-Za-z0-9]+\}?)?\s*(\\left)?\(\s*[a-zA-Z]\s*(\\right)?\)\s*=\s*/, '').replace(/^\s*[A-Za-z]\s*=\s*/, '');
  }
  var XS = [-2.3, -0.7, 0.4, 1.3, 2.9, 4.6];
  function unparen(a) { while (a && a.t === 'paren') a = a.a; return a; }
  function isConst(a) { var sh = ex.shape(a); return !Object.keys(sh.vars).length; }
  function terms(a, sign, out) { // flatten + and − at the top level
    a = unparen(a);
    if (a.t === 'add') { terms(a.a, sign, out); terms(a.b, sign, out); }
    else if (a.t === 'sub') { terms(a.a, sign, out); terms(a.b, -sign, out); }
    else out.push({ s: sign, a: a });
    return out;
  }
  function factorsOf(a, out) { // the factors of a product (a numerator and constant divisors)
    if (a.t === 'neg') return factorsOf(a.a, out);
    if (a.t === 'mul') { factorsOf(a.a, out); return factorsOf(a.b, out); }
    if (a.t === 'div') { if (!isConst(a.b)) { out.bad = true; return out; } return factorsOf(a.a, out); }
    out.push(a); return out;
  }
  /* written as a(v − p)² + q (any constant a and q; inside the bracket v ± k) */
  function isVertexForm(ast, v) {
    var ts = terms(ast, 1, []), sq = ts.filter(function (x) { return !isConst(x.a); });
    if (sq.length !== 1 || ts.length > 2) return false;
    var fs = factorsOf(sq[0].a, []); if (fs.bad) return false;
    var vf = fs.filter(function (f) { return !isConst(f); });
    if (vf.length !== 1) return false;
    var pw = vf[0]; if (pw.t !== 'pow' || !same(ex.value(pw.b), 2)) return false;
    var inner = unparen(pw.a);
    if (inner.t === 'var') return inner.n === v;
    if ((inner.t === 'add' || inner.t === 'sub') && unparen(inner.a).t === 'var' && unparen(inner.a).n === v && isConst(inner.b)) return true;
    return false;
  }
  function fitQuad(f) { // a, b, c of a quadratic through f, or null
    var c = f(0), f1 = f(1), fm = f(-1); if (![c, f1, fm].every(isFinite)) return null;
    var a = (f1 + fm) / 2 - c, b = (f1 - fm) / 2;
    for (var i = 0; i < XS.length; i++) { var x = XS[i], y = f(x); if (!isFinite(y) || Math.abs(a * x * x + b * x + c - y) > 1e-6 * Math.max(1, Math.abs(y))) return null; }
    return { a: a, b: b, c: c };
  }
  function eqFn(f, g) { for (var i = 0; i < XS.length; i++) { var x = XS[i], y = f(x), z = g(x); if (!isFinite(y) || !isFinite(z) || Math.abs(y - z) > 1e-7 * Math.max(1, Math.abs(z))) return false; } return true; }
  /* o: v (letter), cands [[fn, code, hint]], vertex {a, p, q, c} (the general-form constant c, for the completing-the-square slips), what */
  function exprCheck(fn, o) {
    o = o || {}; var v = o.v || 'x';
    return function (resp) {
      var a = K.read(stripLHS(resp)); if (a.res) return a.res;
      var vs = Object.keys(ex.shape(a.ast).vars);
      if (vs.some(function (x) { return x !== v; })) return form(LID + '-letter', 'Use only the letter ' + t(v) + ' in your expression.');
      if (!vs.length) return wrong(LID + '-no-var', 'Your answer should be an expression in ' + t(v) + '.');
      var f = function (x) { var e = {}; e[v] = x; return ex.value(a.ast, e); };
      if (eqFn(f, fn)) {
        if (o.vertex && !isVertexForm(a.ast, v)) return form(LID + '-not-vertex', 'Right function — now write it in vertex form, ' + t('a(' + v + '-p)^{2}+q') + '.');
        return ok();
      }
      var c = o.cands || [];
      for (var i = 0; i < c.length; i++) if (c[i] && eqFn(f, c[i][0])) return wrong(c[i][1], c[i][2]);
      if (o.vertex) {
        var Vt = o.vertex, g = fitQuad(f);
        if (g && Math.abs(g.a) > 1e-9) {
          var p2 = -g.b / (2 * g.a), q2 = g.c - g.b * g.b / (4 * g.a), sa = same(g.a, Vt.a);
          if (sa && same(p2, -Vt.p) && !same(Vt.p, 0) && same(q2, Vt.q)) return wrong('u5l10-p-sign', 'Check the sign inside the bracket: the vertex is at ' + t(v + '=' + rT(Vt.p)) + ', so the bracket is ' + t('(' + binTex(v, Vt.p, true) + ')') + '.');
          if (sa && same(p2, -Vt.p) && !same(Vt.p, 0)) return wrong('u5l10-p-sign', 'Check the sign inside the bracket (and then the constant): ' + t(v + '-p=0') + ' at the vertex.');
          if (sa && same(p2, Vt.p) && Vt.c != null && !same(Vt.a, 1) && same(q2, Vt.c - Vt.p * Vt.p)) return wrong('u5l10-cs-a', 'The bracket is right. When you took out ' + t(rT(Vt.a)) + ', the number you added and subtracted inside the bracket is multiplied by ' + t(rT(Vt.a)) + ' when it comes out.');
          if (sa && same(p2, Vt.p) && Vt.c != null && same(q2, Vt.c + Vt.a * Vt.p * Vt.p)) return wrong('u5l10-cs-sign', 'The bracket is right. The square you added inside the bracket has to be <b>subtracted</b> again (so the value doesn’t change).');
          if (sa && same(p2, Vt.p)) return wrong('u5l10-q', 'The bracket is right — check the constant ' + t('q') + ': substitute ' + t(v + '=' + rT(Vt.p)) + ' into the original function.');
          if (!sa && same(p2, Vt.p)) return wrong('u5l10-a', 'The value of ' + t('a') + ' in vertex form is the same as the coefficient of ' + t(v + '^{2}') + ' in general form: ' + t(rT(Vt.a)) + '.');
        }
        if (!g) return wrong('value', 'Your expression isn’t a quadratic. Check the square on the bracket.');
      }
      return wrong('value', o.what ? 'Check your expression: substitute a value of ' + t(v) + ' and compare with ' + o.what + '.' : null);
    };
  }
  function exprPart(prompt, fn, keyTex, o) {
    o = o || {}; var v = o.v || 'x';
    return { prompt: prompt, input: { type: 'math', keys: 'poly', vars: [v], before: o.before, placeholder: o.placeholder || (o.vertex ? 'e.g. 2(' + v + '-3)^2+5' : 'an expression in ' + v) }, check: exprCheck(fn, o), key: keyTex,
      answer: t((o.ansPre || '') + keyTex), solution: o.sol, hints: o.hints || [], text: o.text, bad: o.bad, good: o.good, outcome: o.outcome };
  }
  M.exprCheck = exprCheck; M.exprPart = exprPart; M.isVertexForm = isVertexForm; M.stripLHS = stripLHS;

  /* ---- "maximum" or "minimum" typed in a box ---- */
  function maxminCheck(kind) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, '$1$2').replace(/[\\{}]/g, '').trim().toLowerCase();
      if (!s) return form('empty', 'Type <b>maximum</b> or <b>minimum</b>.');
      var isMax = /^max/.test(s), isMin = /^min/.test(s);
      if (!isMax && !isMin) return form('u5l9-maxmin-word', 'Type the word <b>maximum</b> or <b>minimum</b>.');
      if ((kind === 'max') === isMax) return ok();
      return wrong('u5l9-maxmin', kind === 'max' ? 'Here ' + t('a<0') + ': the parabola opens down, so the vertex is the highest point (a maximum).' : 'Here ' + t('a>0') + ': the parabola opens up, so the vertex is the lowest point (a minimum).');
    };
  }
  M.maxminCheck = maxminCheck;

  /* ---- several boxes. specs: [{ label, name, ans, dp, cands, set (T), expr: {fn, v, cands, vertex}, maxmin, check, key, ansTex, after, before, math, keys, vars }] ---- */
  function fieldsPart(prompt, specs, o) {
    o = o || {};
    var fields = [], checks = [], keys = [], ans = [];
    specs.forEach(function (s) {
      var f = s.ans != null && !s.dp && s.dp !== 0 ? toFrac(s.ans) : null, frac = f && f[1] !== 1 && !terminates(f);
      var mode, kk = s.keys, vars = s.vars, chk, key, aTex;
      if (s.set) { mode = 'math'; kk = 'set'; vars = [s.set.v]; chk = setCheck(s.set); key = setKey(s.set); aTex = setTex(s.set); }
      else if (s.expr) { mode = 'math'; kk = 'poly'; vars = [s.expr.v || 'x']; chk = exprCheck(s.expr.fn, s.expr); key = s.key; aTex = s.ansTex || s.key; }
      else if (s.maxmin) { mode = 'text'; chk = maxminCheck(s.maxmin); key = s.maxmin === 'max' ? 'maximum' : 'minimum'; aTex = '\\text{' + key + '}'; }
      else if (s.check) { mode = s.math ? 'math' : undefined; chk = s.check; key = s.key; aTex = s.ansTex; }
      else if (s.dp != null) { chk = K.approx(s.ans, s.dp, { diag: cdiag(s.cands, s.dp) }); key = rd(s.ans, s.dp).toFixed(Math.max(0, s.dp)); aTex = fx(s.ans, s.dp); }
      else { mode = frac || s.math ? 'math' : undefined; kk = kk || 'fraction'; chk = exactCheck(s.ans, s); key = exactKey(s.ans); aTex = frac ? rT(s.ans) : nT(s.ans); }
      fields.push({ label: s.label, name: s.name || String(s.label || '').replace(/<[^>]+>|\\\(|\\\)/g, ''), after: s.after, before: s.before, mode: mode, keys: mode === 'math' ? kk : undefined, vars: vars, wide: s.wide || !!s.maxmin,
        placeholder: s.placeholder || (s.maxmin ? 'maximum or minimum' : s.set ? 'e.g. {' + s.set.v + ' | 0 <= ' + s.set.v + ' <= 5, ' + s.set.v + ' in R}' : s.expr ? (s.expr.vertex ? 'e.g. 2(' + vars[0] + '-3)^2+5' : 'an expression in ' + vars[0]) : undefined) });
      checks.push(chk); keys.push(key);
      ans.push((s.label ? s.label + ' ' : '') + t(aTex + (s.unit ? '\\text{ ' + s.unit + '}' : '')));
    });
    var p = B.fields(prompt, fields, checks, keys, ans.join('<br>'), o.sol, o.hints || [], o.text);
    if (o.swap) { // the two boxes may be given in either order
      var i = o.swap[0], j = o.swap[1], inner = p.check;
      p.check = function (resp) {
        var r1 = inner(resp); if (r1.v === 'correct' || !Array.isArray(resp)) return r1;
        var sw = resp.slice(); sw[i] = resp[j]; sw[j] = resp[i];
        var r2 = inner(sw); return r2.v === 'correct' ? r2 : r1;
      };
    }
    p.bad = o.bad; p.good = o.good; p.outcome = o.outcome;
    return p;
  }
  function mcPart(r, prompt, opts, sol, hints, text, keepOrder) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k] && !op.right) return; seen[k] = 1; out.push(op); });
    return B.mc(r, prompt, out, sol, hints || [], text, keepOrder);
  }
  M.clean = clean; M.cdiag = cdiag; M.exactCheck = exactCheck; M.exactKey = exactKey; M.numPart = numPart; M.apxPart = apxPart; M.fieldsPart = fieldsPart; M.mcPart = mcPart;

  /* ---- a model's graph on a grid: o = { f, from, to, x:[x0,x1], y:[y0,y1], gx, gy, lx, ly, xName, yName, xTitle, yTitle, w, h, points, max, ends } ---- */
  function graphFig(o, bare) {
    var W0 = o.w || 300, H0 = o.h || 220;
    var svg = HW.graph({ x: o.x, y: o.y, grid: o.gx || 1, gridY: o.gy || 1, labels: o.lx || 1, labelsX: o.lx || 1, labelsY: o.ly || 1, unitX: W0 / (o.x[1] - o.x[0]), unitY: H0 / (o.y[1] - o.y[0]),
      xName: o.xName || 'x', yName: o.yName || 'y', xTitle: o.xTitle, yTitle: o.yTitle, firstQuadrant: o.x[0] >= 0, max: o.max || 340, aria: o.aria || 'graph',
      fns: o.fns || (o.f ? [{ f: o.f, from: o.from, to: o.to, start: o.start || 'none', end: o.end || 'none' }] : []), points: o.points || [], segs: o.segs, hline: o.hline });
    return bare ? svg : '<div class="fig">' + svg + '</div>';
  }
  function niceTop(v, step) { return Math.ceil((v + 1e-9) / step) * step; }
  M.graphFig = graphFig; M.niceTop = niceTop;

  var CODES = {
    'u5l9-feature': 'Used the wrong feature of the graph', 'u5l9-neg-zero': 'Used the negative zero (before the start)', 'u5l9-swap-coords': 'Time and value (vertex coordinates) swapped',
    'u5l9-range-launch': 'Context range started at the launch height', 'u5l9-dom-neg': 'Domain included negative times', 'u5l9-unbounded': 'Context domain/range left open-ended',
    'u5l9-set-low': 'Wrong lower end of a context domain/range', 'u5l9-set-high': 'Wrong upper end of a context domain/range', 'u5l9-letter': 'Wrong letter in an expression', 'u5l9-no-var': 'Expression with no variable',
    'u5l9-not-vertex': 'Not written in vertex form', 'u5l9-maxmin': 'Maximum and minimum mixed up', 'u5l9-maxmin-word': 'Max/min box not filled with the word',
    'u5l9-steps': 'Gave the number of price changes, not the price', 'u5l9-dir': 'Price or sales changed in the wrong direction', 'u5l9-step-size': 'Used 1 instead of the size of each change',
    'u5l9-not-whole': 'Used the vertex of a whole-step model', 'u5l9-round-vertex': 'Rounded the vertex instead of comparing whole steps', 'u5l9-rev-current': 'Gave the revenue, not the increase over the current revenue',
    'u5l9-whole-range': 'Whole numbers in the range: rounded the ends instead of trimming', 'u5l9-depth-sign': 'Depth given as a negative', 'u5l9-half': 'Used half of the width/time',
    'u5l9-landing-twice': 'Assumed the time in the air is twice the time to the top', 'u5l9-cap': 'Ignored the price cap (vertex outside the domain)', 'u5l9-time-height': 'Gave the time instead of the height (or the reverse)',
    'u5l9-thousands': 'Sales not in thousands', 'u5l9-years-after': 'Gave years after the start, not the year', 'u5l9-diff': 'Gave a height instead of the difference'
  };
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  HW.addCodes({ 'u5l10-p-sign': 'Vertex form: sign of p wrong', 'u5l10-cs-a': 'Completing the square: the added square not multiplied by a', 'u5l10-cs-sign': 'Completing the square: the added square not subtracted', 'u5l10-q': 'Vertex form: wrong constant q', 'u5l10-a': 'Vertex form: wrong a' });
  HW.addPartial({ 'u5l9-feature': 'b', 'u5l9-neg-zero': 's', 'u5l9-swap-coords': 's', 'u5l9-range-launch': 's', 'u5l9-dom-neg': 's', 'u5l9-unbounded': 'b', 'u5l9-set-low': 's', 'u5l9-set-high': 'b',
    'u5l9-steps': 's', 'u5l9-dir': 'b', 'u5l9-step-size': 'b', 'u5l9-not-whole': 's', 'u5l9-round-vertex': 's', 'u5l9-rev-current': 's', 'u5l9-whole-range': 's', 'u5l9-depth-sign': 's', 'u5l9-half': 'b',
    'u5l9-landing-twice': 'b', 'u5l9-cap': 'b', 'u5l9-time-height': 's', 'u5l9-thousands': 's', 'u5l9-years-after': 's', 'u5l9-diff': 's',
    'u5l10-p-sign': 's', 'u5l10-cs-a': 's', 'u5l10-cs-sign': 's', 'u5l10-q': 's', 'u5l10-a': 'b' });

  /* =========================== Lesson 9 =========================== */
  var CALC = '2nd [CALC]';
  var HFEAT = ['Greatest or least value: the <b>vertex</b> (its second coordinate). When it happens: the first coordinate of the vertex.', 'Starting value: the vertical intercept. Landing: the positive zero.'];
  var HCALC = ['Enter the model as ' + t('Y_1') + ', set a window that fits the context, then use ' + CALC + ': 1:value, 2:zero, 3:minimum, 4:maximum or 5:intersect.'];
  var HINT_K = ['Enter ' + t('Y_2=k') + ' (the given value) and use ' + CALC + ', 5:intersect at each crossing.'];
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* domain / range of a launched object: [0, T] and [0, H] */
  function domRange(T, H, c, dp, vIn, vOut) {
    var D = { v: vIn || 't', lo: 0, hi: T, lc: true, hc: true, dp: dp, ctx: 'from the start (' + t((vIn || 't') + '=0') + ') to the landing', hiWhy: 'the object lands at the positive zero.',
      wrong: [{ lo: -Infinity, hi: T, lc: false, hc: true, code: 'u5l9-dom-neg', hint: 'Times before the start make no sense: the domain starts at ' + t('0') + '.' }] };
    var R = { v: vOut || 'h', lo: 0, hi: H, lc: true, hc: true, dp: dp, ctx: 'from the ground up to the maximum', hiWhy: 'the greatest height is the second coordinate of the vertex.',
      wrong: [{ lo: c, hi: H, lc: true, hc: true, code: 'u5l9-range-launch', hint: 'The object falls past its starting height all the way to the ground, so the range starts at ' + t('0') + ', not ' + t(nT(c)) + '.' }] };
    D.other = R; R.other = D; D.otherName = 'range'; R.otherName = 'domain';
    return [D, R];
  }
  var CTX1 = [
    { who: 'A stone is thrown from the top of a cliff.', above: 'above the beach', land: 'land on the beach' },
    { who: 'A ball is tossed from a balcony.', above: 'above the ground', land: 'hit the ground' },
    { who: 'A water balloon is launched from the roof of a shed.', above: 'above the lawn', land: 'land on the lawn' },
    { who: 'A diver jumps up from a diving platform.', above: 'above the water', land: 'reach the water' }];

  var QUESTIONS = [
    { num: '1', shared: function (r) {
        return pickWhere(function () { var k = r.pick([1, 2, 3, 4]), m = r.pick([1, 2, 3]), s = m + 2 * r.int(1, 4); return { k: k, m: m, s: s, c: k * m * s, p: (s - m) / 2, q: k * Math.pow((s + m) / 2, 2), ctx: r.pick(CTX1) }; },
          function (z) { return z.q <= 32 && z.c < z.q && z.s <= 9 && !(z.k === 2 && z.m === 1 && z.s === 5) && !(z.k === 5 && z.m === 1 && z.s === 3) && (z.q <= 26 || (z.q % 2 === 0 && z.c % 2 === 0)); });
      },
      stem: function (o) {
        var gy = o.q <= 26 ? 1 : 2, top = niceTop(o.q + 1, 2), f = function (x) { return -o.k * (x + o.m) * (x - o.s); };
        return o.ctx.who + ' Its height ' + o.ctx.above + ' in metres after ' + t('t') + ' seconds is ' + t('h(t)=' + polyTex([-o.k, o.k * (o.s - o.m), o.c], 't')) + ', graphed below. Use the graph.' +
          graphFig({ f: f, from: 0, to: o.s, x: [0, o.s + 1], y: [0, top], gx: 1, gy: gy, lx: 1, ly: top > 20 ? 4 : 2, xName: 't', yName: 'h', xTitle: 't (s)', yTitle: 'h (m)', w: 40 * (o.s + 1), h: 230, aria: 'graph of the height' });
      },
      parts: [
        { id: '1a', level: 'BEG', make: function (r, o) { return numPart('From what height was it launched?', o.c, { after: 'm', unit: 'm', cands: [[o.q, 'u5l9-feature', 'That is the maximum height (the vertex). The starting height is where the graph meets the ' + t('h') + '-axis, at ' + t('t=0') + '.'], [o.s, 'u5l9-feature', 'That is the landing time. The starting height is the value at ' + t('t=0') + '.']], sol: 'The ' + t('h') + '-intercept: ' + t(o.c) + ' m.', hints: ['The starting height is the height at ' + t('t=0') + '.'], text: 'graph: launch height' }); } },
        { id: '1b', level: 'BEG', make: function (r, o) {
          return fieldsPart('What is its maximum height, and when is it reached?', [{ label: 'Maximum height', ans: o.q, after: 'm', cands: [[o.p, 'u5l9-swap-coords', 'That is the time of the maximum. The height is the second coordinate of the vertex.']] }, { label: 'Time', ans: o.p, after: 's', cands: [[o.q, 'u5l9-swap-coords', 'That is the maximum height. The time is the first coordinate of the vertex.']] }],
            { sol: 'The vertex is ' + t('(' + o.p + ',\\ ' + o.q + ')') + ': a maximum height of ' + t(o.q) + ' m after ' + t(o.p) + ' s.', hints: HFEAT, text: 'graph: maximum height and time' });
        } },
        { id: '1c', level: 'BEG', make: function (r, o) { return numPart('When does it ' + o.ctx.land + '?', o.s, { after: 's', unit: 's', cands: [[-o.m, 'u5l9-neg-zero', 'The negative zero is before the launch. Use the positive ' + t('t') + '-intercept.'], [o.m, 'u5l9-neg-zero', 'That comes from the zero to the left of the ' + t('h') + '-axis, which is before the launch. Use the positive ' + t('t') + '-intercept.'], [o.p, 'u5l9-feature', 'That is when it is highest. It lands where the height is ' + t('0') + '.']], sol: 'The positive zero: ' + t('t=' + o.s) + ' s.', hints: ['It lands when ' + t('h(t)=0') + ': where the graph meets the ' + t('t') + '-axis.'], text: 'graph: landing time' }); } },
        { id: '1d', level: 'EMG', make: function (r, o) { return numPart('At what other time is it at its launch height?', 2 * o.p, { after: 's', unit: 's', cands: [[0, 'u5l9-feature', 'That is the launch itself. Find the <b>other</b> time with the same height, on the way down.'], [o.p, 'u5l9-feature', 'That is when it is highest. Use the symmetry of the parabola about the axis ' + t('t=' + o.p) + '.'], [o.s, 'u5l9-feature', 'That is when it lands (height 0).']], sol: 'By symmetry about the axis ' + t('t=' + o.p) + ': ' + t('t=' + 2 * o.p) + ' s. (Check: ' + t('h(' + 2 * o.p + ')=' + o.c) + '.)', hints: ['The parabola is symmetric about the axis through the vertex. ' + t('t=0') + ' is ' + o.p + ' s to the left of it.'], text: 'graph: symmetric time at launch height' }); } },
        { id: '1e', level: 'PRG', make: function (r, o) {
          var dr = domRange(o.s, o.q, o.c, null);
          dr[0].wrong.push({ lo: -o.m, hi: o.s, lc: true, hc: true, code: 'u5l9-dom-neg', hint: 'The model is only used from the launch (' + t('t=0') + ') to the landing.' });
          return fieldsPart('State the domain and range in this context.', [{ label: 'Domain', set: dr[0] }, { label: 'Range', set: dr[1] }],
            { sol: 'Domain ' + t(setTex(dr[0])) + '; range ' + t(setTex(dr[1])) + ' (it falls from ' + o.q + ' m all the way to the ground).', hints: ['Domain: from launch to landing. Range: from the ground up to the maximum height.'], text: 'graph: context domain and range' });
        } }] },

    { num: '2', shared: function (r) {
        return pickWhere(function () { var b = r.int(140, 235) / 10, c = r.int(4, 15) / 10; var H = c + b * b / 19.6, T = (b + Math.sqrt(b * b + 19.6 * c)) / 9.8; return { b: b, c: c, tv: b / 9.8, H: H, T: T, k: r.int(Math.ceil(c) + 2, Math.floor(H) - 2), ctx: r.pick(['A football is punted.', 'A soccer goalie punts the ball.', 'A rugby ball is kicked high.']) }; },
          function (z) { return !(z.b === 19.6 && z.c === 0.8) && z.b !== 32 && Math.abs(z.T / 2 - z.tv) > 0.006; });
      },
      stem: function (o) { return o.ctx + ' Its height in metres above the field after ' + t('t') + ' seconds is ' + t('h(t)=' + polyTex([-4.9, o.b, o.c], 't') + ',\\ t\\ge 0') + '. Use a graphing calculator. Answer to the nearest hundredth where necessary.'; },
      parts: [
        { id: '2a', level: 'BEG', make: function (r, o) {
          var f = function (x) { return -4.9 * x * x + o.b * x + o.c; }, xmax = Math.ceil(o.T) + 1, top = niceTop(o.H + 2, 5), lo = -10;
          var g = function (from, to, st, en) { return graphFig({ fns: [{ f: f, from: from, to: to, start: st, end: en }], x: [-1, xmax], y: [lo, top], gx: 1, gy: 5, lx: 1, ly: 10, xName: 't', yName: 'h', w: 34 * (xmax + 1), h: 150, max: 260, aria: 'a sketch of the height' }, true); };
          return mcPart(r, 'Which sketch shows the part of the graph that fits the context?', [
            { html: g(0, o.T, 'closed', 'closed'), right: true },
            { html: g(-0.45, o.T + 0.45, 'arrow', 'arrow'), why: 'Times before the kick (' + t('t<0') + ') and heights below the field don’t fit the context. Keep only ' + t('0\\le t') + ' up to the landing.' },
            { html: g(0, o.T + 0.45, 'closed', 'arrow'), why: 'The ball stops when it hits the field: the graph should end at the positive zero, not go below the ground.' }],
            'From the kick (' + t('t=0') + ', ' + t('h=' + nT(o.c)) + ') up to the vertex ' + t('(' + fx(o.tv, 2) + ',\\ ' + fx(o.H, 2) + ')') + ' and down to the positive zero ' + t('t\\approx ' + fx(o.T, 2)) + '.', ['In this context, time starts at 0 and the ball can’t go below the field.'], 'punt: sketch in context');
        } },
        { id: '2b', level: 'BEG', make: function (r, o) { return apxPart('How high was the ball when it was kicked?', o.c, 2, { after: 'm', unit: 'm', cands: [[o.H, 'u5l9-feature', 'That is the maximum height. At the kick, ' + t('t=0') + '.']], sol: t('h(0)=' + fx(o.c, 2)) + ' m', hints: ['Find ' + t('h(0)') + '.'], text: 'punt: starting height' }); } },
        { id: '2c', level: 'BEG', make: function (r, o) { var v = -4.9 + o.b + o.c; return apxPart('How high was it ' + t('1') + ' s after the kick?', v, 2, { after: 'm', unit: 'm', cands: [[4.9 + o.b + o.c, 'sign', t('-4.9(1)^{2}=-4.9') + ': subtract it.'], [o.b + o.c - 9.8, 'u5l9-feature', t('1^{2}=1') + ', so the first term is ' + t('-4.9') + '.']], sol: t('h(1)=-4.9+' + nT(o.b) + '+' + nT(o.c) + '=' + fx(v, 2)) + ' m (' + CALC + ', 1:value, ' + t('X=1') + ').', hints: ['Substitute ' + t('t=1') + ', or use ' + CALC + ', 1:value.'], text: 'punt: height at 1 s' }); } },
        { id: '2d', level: 'EMG', make: function (r, o) { return apxPart('What is the maximum height?', o.H, 2, { after: 'm', unit: 'm', cands: [[o.tv, 'u5l9-time-height', 'That is when the maximum happens (the first coordinate). The height is the second coordinate of the vertex.']], sol: CALC + ', 4:maximum: ' + t('(' + fx(o.tv, 2) + ',\\ ' + fx(o.H, 2) + ')') + '. The maximum height is ' + t(fx(o.H, 2)) + ' m, the ' + t('y') + '-coordinate (second coordinate) of the vertex.', hints: HCALC, text: 'punt: maximum height' }); } },
        { id: '2e', level: 'EMG', make: function (r, o) {
          var tv = fx(o.tv, 2), H = fx(o.H, 2), half = fx(o.T / 2, 2);
          return mcPart(r, 'When is the maximum height reached, and which coordinate of the vertex is it?', [
            { html: t(tv) + ' s, the first coordinate (' + t('t') + ', or ' + t('x') + ' on the calculator) of the vertex', right: true },
            { html: t(tv) + ' s, the second coordinate (' + t('h') + ', or ' + t('y') + ') of the vertex', why: 'The second coordinate is the height. The time is the first coordinate.' },
            { html: t(H) + ' s, the first coordinate of the vertex', why: t(H) + ' is the maximum <b>height</b>, in metres.' },
            { html: t(half) + ' s, half of the time in the air', why: 'The ball was kicked from above the field, so the maximum is not exactly halfway to the landing. Read the vertex.' }],
            '4:maximum: ' + t('(' + tv + ',\\ ' + H + ')') + '. The maximum is reached after ' + t(tv) + ' s: the first coordinate of the vertex.', HFEAT, 'punt: time of maximum and which coordinate');
        } },
        { id: '2f', level: 'PRG', make: function (r, o) { return apxPart('The ball is not caught. When does it hit the field?', o.T, 2, { after: 's', unit: 's', cands: [[2 * o.tv, 'u5l9-landing-twice', 'Twice the time to the top only works for a ball kicked from ground level. Find the positive zero.'], [o.tv, 'u5l9-feature', 'That is the time of the maximum. Find the positive zero.']], sol: CALC + ', 2:zero, with bounds on either side of the positive ' + t('t') + '-intercept: ' + t('t\\approx ' + fx(o.T, 2)) + ' s.', hints: HCALC, text: 'punt: landing time' }); } },
        { id: '2g', level: 'PRG', make: function (r, o) {
          var dr = domRange(o.T, o.H, o.c, 2);
          return fieldsPart('The domain was given as ' + t('t\\ge 0') + '. Write a more accurate domain, and the range.', [{ label: 'Domain', set: dr[0] }, { label: 'Range', set: dr[1] }],
            { sol: 'Domain ' + t(setTex(dr[0])) + '; range ' + t(setTex(dr[1])) + '.', hints: ['Domain: from the kick to the landing (the zero). Range: from the field up to the maximum height.'], text: 'punt: context domain and range' });
        } },
        { id: '2h', level: 'ADV', make: function (r, o) {
          var rt = roots(-4.9, o.b, o.c - o.k);
          return fieldsPart('When is the ball ' + t(o.k) + ' m above the field?', [{ label: 'On the way up', ans: rt[0], dp: 2, after: 's', cands: [[o.T, 'u5l9-feature', 'That is the landing time (height 0).']] }, { label: 'On the way down', ans: rt[1], dp: 2, after: 's', cands: [[o.T, 'u5l9-feature', 'That is the landing time (height 0).']] }],
            { swap: [0, 1], sol: t('Y_2=' + o.k) + ', intersect: ' + t('t\\approx ' + fx(rt[0], 2)) + ' s (going up) and ' + t('t\\approx ' + fx(rt[1], 2)) + ' s (coming down).', hints: HINT_K, text: 'punt: times at a given height' });
        } }] },

    { num: '3', shared: function (r) {
        return pickWhere(function () { var a = r.pick([0.05, 0.06, 0.07, 0.09, 0.1, 0.11, 0.12]), W = 2 * r.int(4, 8); return { a: a, W: W, b: cl(a * W), D: cl(a * W * W / 4), k: r.int(1, W - 1), d: 0.5 * r.int(1, 10), ctx: r.pick(['skateboard bowl', 'mountain-bike pump track dip', 'concrete spillway channel']) }; },
          function (z) { return !(z.a === 0.08 && z.W === 12) && z.k !== z.W / 2 && z.d > 0.3 * z.D && z.d < 0.85 * z.D && z.D >= 1.2; });
      },
      stem: function (o) { return 'A ' + o.ctx + ' has a parabolic cross-section. Its height in metres relative to the ground (negative means below the ground), ' + t('x') + ' metres from the left rim, is ' + t('y=' + polyTex([o.a, -o.b, 0], 'x')) + '. Answer to the nearest hundredth of a metre.'; },
      parts: [
        { id: '3a', level: 'BEG', make: function (r, o) { var y = o.a * o.k * o.k - o.b * o.k; return apxPart('How deep is it ' + t(o.k) + ' m from the left rim?', -y, 2, { after: 'm deep', unit: 'm', cands: [[o.D, 'u5l9-feature', 'That is the greatest depth (at the vertex). Substitute ' + t('x=' + o.k) + '.']], sol: t('y=' + nT(o.a) + '(' + o.k * o.k + ')-' + nT(o.b) + '(' + o.k + ')=' + fx(y, 2)) + ': ' + t(fx(-y, 2)) + ' m deep.', hints: ['Substitute ' + t('x=' + o.k) + ' (or 1:value). A negative height is a depth.'], text: 'bowl: depth at a distance' }); } },
        { id: '3b', level: 'EMG', make: function (r, o) {
          return fieldsPart('What is the greatest depth, and how far from the left rim is it?', [{ label: 'Greatest depth', ans: o.D, dp: 2, after: 'm', cands: [[o.W / 2, 'u5l9-swap-coords', 'That is the distance. The depth comes from the second coordinate of the vertex.']] }, { label: 'Distance from the left rim', ans: o.W / 2, dp: 2, after: 'm', cands: [[o.D, 'u5l9-swap-coords', 'That is the depth. The distance is the first coordinate of the vertex.'], [o.W, 'u5l9-feature', 'That is the whole width. The deepest point is at the vertex.']] }],
            { sol: CALC + ', 3:minimum: ' + t('(' + nT(o.W / 2) + ',\\ ' + fx(-o.D, 2) + ')') + '. The greatest depth is ' + t(fx(o.D, 2)) + ' m, ' + t(nT(o.W / 2)) + ' m from the left rim.', hints: ['The parabola opens up (' + t('a>0') + '), so the vertex is a minimum: use 3:minimum.'], text: 'bowl: greatest depth' });
        } },
        { id: '3c', level: 'BEG', make: function (r, o) { return apxPart('How wide is it at ground level?', o.W, 2, { after: 'm', unit: 'm', cands: [[o.W / 2, 'u5l9-half', 'That is the distance to the deepest point. The width is the distance between the two zeros.'], [o.D, 'u5l9-feature', 'That is the depth.']], sol: 'Zeros at ' + t('x=0') + ' and ' + t('x=' + o.W) + ': ' + t(fx(o.W, 2)) + ' m wide.', hints: ['At ground level ' + t('y=0') + ': find both zeros.'], text: 'bowl: width at ground level' }); } },
        { id: '3d', level: 'ADV', make: function (r, o) {
          var rt = roots(o.a, -o.b, o.d);
          return fieldsPart('How far from the left rim is it exactly ' + t(nT(o.d)) + ' m deep?', [{ label: 'Nearer the left rim', ans: rt[0], dp: 2, after: 'm' }, { label: 'Farther from the left rim', ans: rt[1], dp: 2, after: 'm' }],
            { swap: [0, 1], sol: t(nT(o.d)) + ' m deep means ' + t('y=-' + nT(o.d)) + '. ' + t('Y_2=-' + nT(o.d)) + ', intersect: ' + t('x\\approx ' + fx(rt[0], 2)) + ' m and ' + t('x\\approx ' + fx(rt[1], 2)) + ' m.', hints: ['A depth of ' + t(nT(o.d)) + ' m is the height ' + t('y=-' + nT(o.d)) + '. ' + HINT_K[0]], text: 'bowl: where it is a given depth' });
        } }] },

    { num: '4', shared: gymShared,
      stem: function (o) { return 'A ' + o.ctx.place + ' has ' + t(nT(o.N)) + ' ' + o.ctx.who + ' who each pay ' + t(money(o.P)) + ' a month. The owner learns that for every ' + t(money(o.s)) + ' increase in the monthly fee, ' + t(o.m) + ' ' + o.ctx.who + ' would leave. The fee changes in steps of ' + t(money(o.s)) + '.'; },
      parts: [
        { id: '4a', level: 'EMG', make: function (r, o) {
          var fee = function (x) { return o.P + o.s * x; }, mem = function (x) { return o.N - o.m * x; }, Rf = function (x) { return fee(x) * mem(x); };
          return fieldsPart('Let ' + t('x') + ' be the number of ' + t(money(o.s)) + ' increases. Write expressions for the fee and the number of ' + o.ctx.who + ', and the revenue function ' + t('R(x)') + '.', [
            { label: 'Fee', before: t('\\$'), expr: { fn: fee, cands: [[function (x) { return o.P - o.s * x; }, 'u5l9-dir', 'The fee goes <b>up</b> by ' + t(money(o.s)) + ' for each increase.'], [function (x) { return o.P + x; }, 'u5l9-step-size', 'Each increase is ' + t(money(o.s)) + ', so the fee is ' + t(o.P + '+' + o.s + 'x') + '.']] }, key: o.P + '+' + o.s + 'x' },
            { label: cap(o.ctx.who), expr: { fn: mem, cands: [[function (x) { return o.N + o.m * x; }, 'u5l9-dir', 'Raising the fee <b>loses</b> ' + o.m + ' ' + o.ctx.who + ' each time.']] }, key: o.N + '-' + o.m + 'x' },
            { label: t('R(x)='), expr: { fn: Rf, cands: [[function (x) { return fee(x) + mem(x); }, 'value', 'Revenue = fee × number of ' + o.ctx.who + ' (multiply, don’t add).']] }, key: '(' + o.P + '+' + o.s + 'x)(' + o.N + '-' + o.m + 'x)' }],
            { sol: 'Fee ' + t(o.P + '+' + o.s + 'x') + '; ' + o.ctx.who + ' ' + t(o.N + '-' + o.m + 'x') + '; ' + t('R(x)=(' + o.P + '+' + o.s + 'x)(' + o.N + '-' + o.m + 'x)') + '.', hints: ['Price ' + t('=') + ' current price ' + t('+') + ' (change)' + t('x') + '; number ' + t('=') + ' current number ' + t('-') + ' (change)' + t('x') + '. Revenue is their product.'], text: 'gym: price, members and revenue expressions' });
        } },
        { id: '4b', level: 'PRG', make: function (r, o) { var f = o.P + o.s * o.x1; return numPart('Use a graphing calculator to find the fee that gives the maximum monthly revenue.', f, { before: '\\$', ansPre: '\\$', cands: [[o.x1, 'u5l9-steps', t('x=' + o.x1) + ' is the number of increases. The fee is ' + t(o.P + '+' + o.s + '(' + o.x1 + ')') + '.'], [o.R1, 'u5l9-feature', 'That is the maximum revenue. The question asks for the fee.']], sol: '4:maximum: ' + t('(' + o.x1 + ',\\ ' + nT(o.R1) + ')') + '. ' + t('x=' + o.x1) + ' increases: fee ' + t(o.P + '+' + o.s * o.x1 + '=\\$' + f) + '.', hints: ['Graph ' + t('R(x)') + ' and use 4:maximum. Then turn the number of increases into a fee.'], text: 'gym: fee for maximum revenue' }); } },
        { id: '4c', level: 'PRG', make: function (r, o) {
          var n = o.N - o.m * o.x1;
          return fieldsPart('How many ' + o.ctx.who + ' would there be, and what is the maximum revenue?', [{ label: cap(o.ctx.who), ans: n, cands: [[o.N + o.m * o.x1, 'u5l9-dir', 'Raising the fee loses ' + o.ctx.who + '.']] }, { label: 'Maximum revenue', before: t('\\$'), ans: o.R1, after: 'per month', cands: [[o.P * o.N, 'u5l9-feature', 'That is the current revenue.']] }],
            { sol: t(o.N + '-' + o.m * o.x1 + '=' + n) + ' ' + o.ctx.who + '; revenue ' + t((o.P + o.s * o.x1) + '\\times ' + n + '=' + money(o.R1)) + ' per month.', hints: ['Substitute ' + t('x=' + o.x1) + ' into each expression.'], text: 'gym: members and maximum revenue' });
        } },
        { id: '4d', level: 'PRG', make: function (r, o) { var d = o.R1 - o.P * o.N; return numPart('How much more is this than the current monthly revenue?', d, { before: '\\$', ansPre: '\\$', cands: [[o.R1, 'u5l9-rev-current', 'That is the new revenue. Subtract the current revenue, ' + t(money(o.P * o.N)) + '.']], sol: 'Now: ' + t(o.P + '\\times ' + nT(o.N) + '=' + money(o.P * o.N)) + '. Increase: ' + t(money(d)) + ' per month.', hints: ['Current revenue is ' + t('R(0)') + '.'], text: 'gym: increase over current revenue' }); } }] },

    { num: '5', shared: gymShared,
      stem: function (o) { return 'A ' + o.ctx.place + ' has ' + t(nT(o.N)) + ' ' + o.ctx.who + ' who each pay ' + t(money(o.P)) + ' a month. The owner’s plan: for every ' + t(money(o.s)) + ' increase, ' + t(o.m) + ' ' + o.ctx.who + ' would leave. The manager suggests <i>lowering</i> the fee instead: for every ' + t(money(o.s2)) + ' decrease, ' + t(o.m2) + ' new ' + o.ctx.who + ' would join.'; },
      parts: [
        { id: '5a', level: 'ADV', make: function (r, o) {
          var f = o.P - o.s2 * o.x2, n = o.N + o.m2 * o.x2;
          return fieldsPart('Let ' + t('x') + ' be the number of ' + t(money(o.s2)) + ' decreases. Find the fee, the number of ' + o.ctx.who + ' and the revenue at the maximum.', [
            { label: 'Fee', before: t('\\$'), ans: f, cands: [[o.x2, 'u5l9-steps', 'That is the number of decreases.'], [o.P + o.s2 * o.x2, 'u5l9-dir', 'The fee goes <b>down</b>.']] },
            { label: cap(o.ctx.who), ans: n, cands: [[o.N - o.m2 * o.x2, 'u5l9-dir', 'Lowering the fee brings <b>new</b> ' + o.ctx.who + '.']] },
            { label: 'Revenue', before: t('\\$'), ans: o.R2, cands: [[o.R1, 'u5l9-feature', 'That is the owner’s plan. Use the decreases.']] }],
            { sol: t('R(x)=(' + o.P + '-' + o.s2 + 'x)(' + nT(o.N) + '+' + o.m2 + 'x)') + '. 4:maximum: ' + t('(' + o.x2 + ',\\ ' + nT(o.R2) + ')') + '.<br>Fee ' + t(o.P + '-' + o.s2 * o.x2 + '=\\$' + f) + '; ' + t(nT(o.N) + '+' + o.m2 * o.x2 + '=' + nT(n)) + ' ' + o.ctx.who + '; revenue ' + t(money(o.R2)) + ' per month.', hints: ['Price ' + t(o.P + '-' + o.s2 + 'x') + ', number ' + t(nT(o.N) + '+' + o.m2 + 'x') + '. Graph the product and find its maximum.'], text: 'gym: decrease plan at maximum' });
        } },
        { id: '5b', level: 'ADV', make: function (r, o) {
          var up = o.R1 > o.R2, f1 = o.P + o.s * o.x1, f2 = o.P - o.s2 * o.x2, now = o.P * o.N;
          return mcPart(r, 'Which plan would you advise the owner to follow?', [
            { html: 'Raise the fee to ' + t(money(f1)) + ': it earns ' + t(money(o.R1)) + ' a month.', right: up, why: up ? null : 'Compare the two maximum revenues: the increase plan earns ' + t(money(o.R1)) + ', the decrease plan ' + t(money(o.R2)) + '.' },
            { html: 'Lower the fee to ' + t(money(f2)) + ': it earns ' + t(money(o.R2)) + ' a month.', right: !up, why: !up ? null : 'Compare the two maximum revenues: the increase plan earns ' + t(money(o.R1)) + ', the decrease plan ' + t(money(o.R2)) + '.' },
            { html: 'Keep the fee at ' + t(money(o.P)) + ': changing it loses money.', why: 'Both plans beat the current ' + t(money(now)) + ' a month.' }],
            'Increase plan: ' + t(money(o.R1)) + '; decrease plan: ' + t(money(o.R2)) + '; now: ' + t(money(now)) + '. ' + (up ? 'Raise the fee to ' + t(money(f1)) : 'Lower the fee to ' + t(money(f2))) + ': it earns more.', ['Find the maximum revenue for each plan and compare.'], 'gym: compare the two plans');
        } }] },

    { num: '6', shared: fishShared,
      stem: function (o) { return o.ctx.a + ' ' + t(nT(o.M)) + ' kg ' + o.ctx.b + ' at ' + t(money2(o.p)) + ' per kg. For each week it waits, ' + o.ctx.c + ' a total of ' + t(o.g) + ' kg, but the market price falls by ' + t(money2(o.d)) + ' per kg. ' + o.ctx.d; },
      parts: [
        { id: '6a', level: 'EMG', make: function (r, o) {
          var Rf = function (w) { return (o.M + o.g * w) * (o.p - o.d * w); };
          return exprPart('Write the revenue function ' + t('R(w)') + ', where ' + t('w') + ' is the number of weeks it waits.', Rf, '(' + o.M + '+' + o.g + 'w)(' + nT(o.p) + '-' + nT(o.d) + 'w)', { v: 'w', before: t('R(w)='),
            cands: [[function (w) { return (o.M + o.g * w) * (o.p + o.d * w); }, 'u5l9-dir', 'The price <b>falls</b> each week.'], [function (w) { return (o.M - o.g * w) * (o.p - o.d * w); }, 'u5l9-dir', 'The amount <b>grows</b> each week.']],
            sol: t('R(w)=(\\text{mass})(\\text{price})=(' + nT(o.M) + '+' + o.g + 'w)(' + fx(o.p, 2) + '-' + fx(o.d, 2) + 'w)'), hints: ['Mass after ' + t('w') + ' weeks ' + t('=' + nT(o.M) + '+' + o.g + 'w') + '; price ' + t('=' + nT(o.p) + '-' + nT(o.d) + 'w') + '.'], text: 'fish farm: revenue function' });
        } },
        { id: '6b', level: 'MAS', make: function (r, o) {
          var Rf = function (w) { return cl((o.M + o.g * w) * (o.p - o.d * w)); }, lo = Math.floor(o.w), hi = lo + 1, best = Rf(lo) > Rf(hi) ? lo : hi, other = best === lo ? hi : lo;
          return fieldsPart('After how many whole weeks should it sell to earn the most? What is that revenue?', [
            { label: 'Weeks', ans: best, after: 'weeks', cands: [[other, 'u5l9-round-vertex', 'Compare the revenue at the whole numbers on both sides of the vertex: ' + t('R(' + lo + ')=' + money(Rf(lo))) + ' and ' + t('R(' + hi + ')=' + money(Rf(hi))) + '.']] },
            { label: 'Revenue', before: t('\\$'), ans: Rf(best), cands: [[Rf(other), 'u5l9-round-vertex', 'Compare ' + t('R(' + lo + ')') + ' and ' + t('R(' + hi + ')') + ': choose the larger.'], [o.Rv, 'u5l9-not-whole', 'That is the revenue at the vertex, ' + t('w=' + nT(o.w)) + ', but the farm sells only at the end of a whole week.']] }],
            { sol: '4:maximum: ' + t('(' + nT(o.w) + ',\\ ' + fx(o.Rv, 2) + ')') + ', but ' + t('w') + ' is a whole number.<br>TABLE: ' + t('R(' + lo + ')=' + money(Rf(lo))) + '; ' + t('R(' + hi + ')=' + money(Rf(hi))) + '.<br>Sell after ' + best + ' weeks, for ' + t(money(Rf(best))) + '.', hints: ['Find the vertex, then compare ' + t('R') + ' at the whole numbers on either side of it (TABLE).'], text: 'fish farm: best whole week' });
        } }] },

    { num: '7', shared: function (r) {
        return pickWhere(function () { var a = r.pick([0.01, 0.0125, 0.015, 0.02, 0.025]), fs = r.pick([60, 80, 100]), c = r.int(12, 45); var top = a * fs * fs; return { a: a, fs: fs, c: c, Y: cl(c + top), b: cl(2 * a * fs), noise: [r.int(-2, 2), r.int(-3, 3), r.int(-1, 1), r.int(-3, 3), r.int(-2, 2)], f1: r.pick([10, 20, 30]), f2: fs + r.pick([0.5, 0.6, 0.7, 0.8, 0.9]) * fs, crop: r.pick(['crop yield', 'wheat yield', 'canola yield']) }; },
          function (z) { var Yf = function (f) { return -z.a * f * f + z.b * f + z.c; }; return z.Y <= 180 && Number.isInteger(z.Y) && !(z.a === 0.015 && z.fs === 80 && z.c === 30) && Math.abs(Yf(z.f1) - Yf(z.f2)) >= 3 && z.f2 % 10 === 0; });
      },
      stem: function (o) {
        var Yf = function (f) { return -o.a * f * f + o.b * f + o.c; }, xs = [0, 1, 2, 3, 4].map(function (i) { return i * o.fs / 2; }), ys = xs.map(function (f, i) { return Math.round(Yf(f)) + o.noise[i]; });
        return 'A farm tests different amounts of fertilizer on test plots and records the ' + o.crop + '.' + HW.valueTable([['Fertilizer, ' + t('f') + ' (kg/ha)'].concat(xs), ['Yield, ' + t('Y') + ' (bushels/acre)'].concat(ys)]) + 'The data are modelled by ' + t('Y(f)=' + polyTex([-o.a, o.b, o.c], 'f')) + '.';
      },
      parts: [
        { id: '7a', level: 'LIM', make: function (r, o) {
          var Yf = function (f) { return -o.a * f * f + o.b * f + o.c; }, xs = [0, 1, 2, 3, 4].map(function (i) { return i * o.fs / 2; }), ys = xs.map(function (f, i) { return Math.round(Yf(f)) + o.noise[i]; });
          var top = niceTop(Math.max.apply(null, ys) + 5, 20), X = 2 * o.fs + o.fs / 4;
          var g = function (pts, half) { return graphFig({ fns: [{ f: Yf, from: 0, to: 2 * o.fs }], points: pts.map(function (p) { return { x: p[0], y: p[1] }; }), x: [0, X], y: [0, top], gx: o.fs / 4, gy: 10, lx: o.fs / 2, ly: 20, xName: 'f', yName: 'Y', w: 250, h: 150, max: 260, aria: 'data and model' }, true); };
          var good = xs.map(function (x, i) { return [x, ys[i]]; }), sw = good.map(function (p, i) { return i === 1 ? [p[0], ys[3] - 25 < 0 ? ys[0] : ys[3] - 25] : p; }), half = good.map(function (p) { return [p[0] / 2, p[1]]; });
          return mcPart(r, 'Which graph shows the data plotted correctly, with the model curve?', [
            { html: g(good), right: true },
            { html: g(half), why: 'Check the ' + t('f') + '-axis: each grid square is ' + nT(o.fs / 4) + ' kg/ha, so ' + t('f=' + nT(o.fs / 2)) + ' is ' + 2 + ' squares from 0.' },
            { html: g(sw), why: 'Check the point at ' + t('f=' + nT(o.fs / 2)) + ': its yield is ' + t(ys[1]) + '.' }],
            'Each data point ' + t('(f,\\ Y)') + ' is plotted at its fertilizer amount and yield; the model curve passes close to them, with its highest point near ' + t('f=' + o.fs) + '.', ['Plot each column of the table as a point ' + t('(f,\\ Y)') + ', using the scale on each axis.'], 'fertilizer: plot the data');
        } },
        { id: '7b', level: 'EMG', make: function (r, o) {
          return fieldsPart('Use the model to find the amount of fertilizer that gives the greatest yield, and that yield.', [{ label: 'Fertilizer', ans: o.fs, after: 'kg/ha', cands: [[o.Y, 'u5l9-swap-coords', 'That is the yield.']] }, { label: 'Greatest yield', ans: o.Y, after: 'bushels/acre', cands: [[o.fs, 'u5l9-swap-coords', 'That is the amount of fertilizer.']] }],
            { sol: '4:maximum: ' + t('(' + o.fs + ',\\ ' + nT(o.Y) + ')') + '. ' + t(o.fs) + ' kg/ha gives ' + t(nT(o.Y)) + ' bushels/acre.', hints: ['Graph the model and use 4:maximum (use the model, not the table).'], text: 'fertilizer: greatest yield' });
        } },
        { id: '7c', level: 'EMG', make: function (r, o) {
          var Yf = function (f) { return -o.a * f * f + o.b * f + o.c; }, y1 = Yf(o.f1), y2 = Yf(o.f2), first = y1 > y2;
          return mcPart(r, 'Which gives the greater yield by the model: ' + t(o.f1) + ' kg/ha or ' + t(nT(o.f2)) + ' kg/ha?', [
            { html: t(o.f1) + ' kg/ha', right: first, why: first ? null : 'Evaluate both: ' + t('Y(' + o.f1 + ')\\approx ' + fx(y1, 1)) + ' and ' + t('Y(' + nT(o.f2) + ')\\approx ' + fx(y2, 1)) + '.' },
            { html: t(nT(o.f2)) + ' kg/ha', right: !first, why: !first ? null : 'More fertilizer is not always better: past ' + o.fs + ' kg/ha the yield falls. ' + t('Y(' + nT(o.f2) + ')\\approx ' + fx(y2, 1)) + '.' },
            { html: 'They give the same yield.', why: 'Evaluate both with 1:value: ' + t('Y(' + o.f1 + ')\\approx ' + fx(y1, 1)) + ', ' + t('Y(' + nT(o.f2) + ')\\approx ' + fx(y2, 1)) + '.' }],
            t('Y(' + o.f1 + ')\\approx ' + fx(y1, 1)) + '; ' + t('Y(' + nT(o.f2) + ')\\approx ' + fx(y2, 1)) + '. ' + (first ? t(o.f1) + ' kg/ha gives more: too much fertilizer lowers the yield.' : t(nT(o.f2)) + ' kg/ha gives more.'), ['Evaluate the model at both amounts (1:value).'], 'fertilizer: compare two amounts', true);
        } }] },

    { num: '8', shared: function (r) {
        return pickWhere(function () { var L = 20 * r.int(10, 30), d = 10 * r.int(1, 8); return { L: L, d: d, x: L / 4, A: L * L / 8, x1: L / 4 - d, ctx: r.pick([['parking lot', 'a building'], ['dog run', 'a garage'], ['storage yard', 'a warehouse']]) }; },
          function (z) { return z.L !== 400 && z.x1 >= 10 && z.d <= z.L / 8 && Number.isInteger(z.x); });
      },
      stem: function (o) { return 'A rectangular ' + o.ctx[0] + ' is fenced on three sides; the fourth side is ' + o.ctx[1] + '. With ' + t(o.L) + ' m of fencing and ' + t('x') + ' metres for each side perpendicular to ' + o.ctx[1].replace(/^a /, 'the ') + ', the area in square metres is ' + t('A(x)=x(' + o.L + '-2x)') + '.'; },
      parts: [
        { id: '8a', level: 'PRG', make: function (r, o) {
          return fieldsPart('Use a graphing calculator to find the maximum area and the dimensions that give it.', [
            { label: 'Maximum area', ans: o.A, after: t('\\text{m}^2'), cands: [[o.x, 'u5l9-time-height', 'That is the width. The area is the second coordinate of the vertex.']] },
            { label: 'Each perpendicular side', ans: o.x, after: 'm', cands: [[o.L / 2, 'u5l9-feature', 'That is the other side, ' + t(o.L + '-2x') + '.']] },
            { label: 'The side parallel to ' + o.ctx[1].replace(/^a /, 'the '), ans: o.L / 2, after: 'm', cands: [[o.x, 'u5l9-feature', 'The parallel side is ' + t(o.L + '-2x') + ', not ' + t('x') + '.']] }],
            { sol: '4:maximum: ' + t('(' + o.x + ',\\ ' + nT(o.A) + ')') + '. The ' + o.ctx[0] + ' is ' + t(o.x) + ' m by ' + t(o.L + '-' + 2 * o.x + '=' + o.L / 2) + ' m, with area ' + t(nT(o.A) + '\\text{ m}^2') + '.', hints: ['The vertex gives the width ' + t('x') + ' and the area. The other side is ' + t(o.L + '-2x') + '.'], text: 'fenced lot: maximum area and dimensions' });
        } },
        { id: '8b', level: 'PRG', make: function (r, o) {
          var A0 = o.x1 * (o.L - 2 * o.x1), x2 = o.L / 2 - o.x1;
          return fieldsPart('For which values of ' + t('x') + ' is the area ' + t(nT(A0) + '\\text{ m}^2') + '?', [{ label: t('x='), ans: o.x1, after: 'm' }, { label: 'or ' + t('x='), ans: x2, after: 'm' }],
            { swap: [0, 1], sol: t('Y_2=' + nT(A0)) + ', intersect: ' + t('x=' + o.x1) + ' m or ' + t('x=' + x2) + ' m. (Check: ' + t(o.x1 + '(' + (o.L - 2 * o.x1) + ')=' + nT(A0)) + '.)', hints: HINT_K, text: 'fenced lot: widths for a given area' });
        } }] },

    { num: '9', shared: function (r) {
        return pickWhere(function () { var a = r.pick([0.001, 0.002, 0.004, 0.005]), n = 50 * r.int(3, 8), Cm = 5 * r.int(8, 24), D = r.pick([10, 15, 20, 25, 30, 40]); return { a: a, n: n, Cm: Cm, b: cl(2 * a * n), c: cl(Cm + a * n * n), K: Cm + D, off: Math.sqrt(D / a), ctx: r.pick([['bicycle maker', 'bikes', 'bike'], ['furniture maker', 'chairs', 'chair'], ['brewery', 'cases', 'case']]) }; },
          function (z) { var lo = z.n - z.off, hi = z.n + z.off; return !(z.a === 0.002 && z.n === 300 && z.Cm === 70) && lo > 60 && Math.abs(lo - Math.round(lo)) > 0.08 && Math.abs(lo - Math.round(lo)) < 0.92 && Math.abs(Math.abs(lo - Math.floor(lo)) - 0.5) > 0.06 && z.c < 1000; });
      },
      stem: function (o) { return 'A ' + o.ctx[0] + '’s average cost per ' + o.ctx[2] + ', in dollars, when it makes ' + t('n') + ' ' + o.ctx[1] + ' a week is ' + t('C(n)=' + polyTex([o.a, -o.b, o.c], 'n')) + ', for ' + t('50\\le n\\le ' + (2 * o.n - 50)) + '.'; },
      parts: [
        { id: '9a', level: 'PRG', make: function (r, o) {
          return fieldsPart('How many ' + o.ctx[1] + ' should it make each week to keep the average cost as low as possible? What is the lowest average cost?', [{ label: cap(o.ctx[1]), ans: o.n, after: 'a week', cands: [[o.Cm, 'u5l9-swap-coords', 'That is the cost. The number is the first coordinate of the vertex.']] }, { label: 'Lowest average cost', before: t('\\$'), ans: o.Cm, cands: [[o.n, 'u5l9-swap-coords', 'That is the number made.'], [o.c, 'u5l9-feature', 'That is ' + t('C(0)') + '. Use 3:minimum.']] }],
            { sol: CALC + ', 3:minimum: ' + t('(' + o.n + ',\\ ' + o.Cm + ')') + '. ' + t(o.n) + ' ' + o.ctx[1] + ' a week, at ' + t(money(o.Cm)) + ' per ' + o.ctx[2] + '.', hints: ['The parabola opens up: its vertex is a minimum.'], text: 'average cost: minimum' });
        } },
        { id: '9b', level: 'ADV', make: function (r, o) {
          var lo = o.n - o.off, hi = o.n + o.off, A = Math.ceil(lo), Bn = Math.floor(hi);
          return fieldsPart('For what numbers of ' + o.ctx[1] + ' is the average cost ' + t(money(o.K)) + ' or less?', [
            { label: 'From', ans: A, after: o.ctx[1], cands: [[Math.floor(lo), 'u5l9-whole-range', 'At ' + t(Math.floor(lo)) + ' ' + o.ctx[1] + ' the cost is still above ' + t(money(o.K)) + ': start at the first whole number <b>inside</b> the interval.'], [rd(lo, 1), 'u5l9-whole-range', 'The number of ' + o.ctx[1] + ' is a whole number.']] },
            { label: 'to', ans: Bn, after: o.ctx[1] + ' a week', cands: [[Math.ceil(hi), 'u5l9-whole-range', 'At ' + t(Math.ceil(hi)) + ' the cost is above ' + t(money(o.K)) + ' again: stop at the last whole number inside the interval.'], [rd(hi, 1), 'u5l9-whole-range', 'The number of ' + o.ctx[1] + ' is a whole number.']] }],
            { sol: t('Y_2=' + o.K) + ', intersect: ' + t('n\\approx ' + fx(lo, 1)) + ' and ' + t('n\\approx ' + fx(hi, 1)) + '. The cost is ' + t(money(o.K)) + ' or less between them: from ' + A + ' to ' + Bn + ' ' + o.ctx[1] + ' a week.', hints: HINT_K.concat(['The graph is below ' + t('Y_2') + ' between the two crossings. Only whole numbers of ' + o.ctx[1] + ' count.']), text: 'average cost: whole numbers under a cost' });
        } }] },

    { num: '10', shared: function (r) { return pickWhere(function () { return { p: r.int(1, 4), q: r.int(1, 3), name: r.pick(['Sam', 'Priya', 'Mateo', 'Ava']) }; }, function (z) { return !(z.p === 2 && z.q === 1); }); },
      stem: function (o) { return o.name + ' says, “A ball is in the air for exactly twice the time it takes to reach its maximum height.”'; },
      parts: [
        { id: '10a', level: 'EMG', make: function (r, o) {
          var s = 2 * o.p + o.q, c = 5 * o.q * s, h1 = 'h(t)=' + polyTex([-5, 10 * o.p, 0], 't'), h2 = 'h(t)=' + polyTex([-5, 10 * o.p, c], 't');
          return fieldsPart('Test the claim on ' + t(h1) + ' and on ' + t(h2) + '.', [
            { label: 'First: time of the maximum', ans: o.p, after: 's' }, { label: 'First: landing time', ans: 2 * o.p, after: 's' },
            { label: 'Second: time of the maximum', ans: o.p, after: 's', cands: [[s / 2, 'u5l9-landing-twice', 'Don’t assume the claim: find the vertex with 4:maximum.']] }, { label: 'Second: landing time', ans: s, after: 's', cands: [[2 * o.p, 'u5l9-landing-twice', 'That would make the claim true — but check the positive zero of the second function.']] }],
            { sol: 'First: maximum at ' + t('t=' + o.p) + ', lands at ' + t('t=' + 2 * o.p) + ': true.<br>Second: maximum at ' + t('t=' + o.p) + ' (same axis), lands at ' + t('t=' + s) + ': false.', hints: ['Use 4:maximum and 2:zero for each function.'], text: 'claim: test two functions' });
        } },
        { id: '10b', level: 'MAS', make: function (r, o) {
          return mcPart(r, 'Using the symmetry of the parabola, when is ' + o.name + '’s claim true?', [
            { html: 'Only when the ball starts at ground level (' + t('h(0)=0') + '): then ' + t('t=0') + ' is one zero, and the other zero is the same distance past the axis.', right: true },
            { html: 'Always: a parabola is symmetric, so the landing time is always twice the time of the maximum.', why: 'The two <b>zeros</b> are symmetric about the axis. If the ball starts above the ground, the other zero is before ' + t('t=0') + ', not at it.' },
            { html: 'Only when the ball starts above the ground.', why: 'Test it: for the second function the ball starts above the ground and the claim is false.' },
            { html: 'Only when the maximum height is reached after exactly 2 seconds.', why: 'The time of the maximum doesn’t matter; the starting height does.' }],
            'The zeros are the same distance from the axis. The claim is true only when the other zero is ' + t('t=0') + ', that is, when the ball starts at ground level. From above the ground, the time in the air is longer.', ['Where are the two zeros of a parabola, compared with its axis?'], 'claim: when it is true');
        } }] },

    { num: '11', parts: [
      { id: '11', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(1, 3), c: r.int(1, 6), k: 5 }; }, function (z) { return !(z.p === 1.5); }), b = 10 * o.p;
        var asks = [['when the ball hits the ground', 'the positive ' + t('t') + '-intercept', 'the ball is on the ground when ' + t('h(t)=0') + '.'], ['the height the ball was thrown from', 'the ' + t('h') + '-intercept', 'that is the height at ' + t('t=0') + '.'], ['the ball’s maximum height', 'the second coordinate of the vertex', 'the highest point is the vertex; its height is the second coordinate.'], ['when the ball reaches its maximum height', 'the first coordinate of the vertex', 'the time of the highest point is the first coordinate of the vertex.']];
        var w = r.int(0, 3), A = asks[w];
        return mcPart(r, 'A ball’s height is given by ' + t('h(t)=' + polyTex([-5, b, o.c], 't')) + '. The feature of its graph that tells ' + A[0] + ' is', asks.map(function (x, i) { return { html: cap(x[1]), right: i === w, why: i === w ? null : cap(x[1]) + ' tells ' + x[0] + '.' }; }),
          'It is ' + A[1] + ': ' + A[2], HFEAT, 'MC: which feature of the graph');
      } }] },

    { num: '12', parts: [
      { id: '12', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { var a = r.pick([0.5, 1, 0.25]), t1 = r.int(1, 5), t2 = t1 + 2 * r.int(1, 4), c = r.int(2, 8); return { a: a, t1: t1, t2: t2, c: c, k: cl(a * t1 * t2 + c), b: cl(a * (t1 + t2)), thing: r.pick(['drone', 'kite', 'hawk']) }; }, function (z) { return !(z.a === 0.5 && z.t1 === 4 && z.t2 === 8) && z.k % 1 === 0; });
        var Y = polyTex([-o.a, o.b, o.c], 'X'), w = r.int(0, 2);
        var Qs = [['when the ' + o.thing + ' is ' + t(nT(o.k)) + ' m high', 2], ['the ' + o.thing + '’s greatest height', 1], ['the height after ' + t(o.t1) + ' seconds', 3]], q = Qs[w];
        var opts = [{ html: 'find the zeros of ' + t('Y_1=' + Y), why: 'The zeros are where the height is 0.' }, { html: 'find the maximum of ' + t('Y_1'), why: 'The maximum gives the greatest height (and when it happens).' },
          { html: 'graph ' + t('Y_2=' + nT(o.k)) + ' and find the intersections with ' + t('Y_1'), why: 'The intersections give the times when the height is ' + nT(o.k) + ' m.' }, { html: 'evaluate ' + t('Y_1') + ' at ' + t('X=' + (w === 0 ? nT(o.k) : o.t1)), why: w === 0 ? 'That gives the height at ' + nT(o.k) + ' s, not the time of a ' + nT(o.k) + ' m height.' : 'That gives the height at a given time.' }];
        opts = opts.map(function (x, i) { return { html: x.html, right: i === q[1], why: i === q[1] ? null : x.why }; });
        var sol = w === 0 ? 'C: the times when ' + t('h(t)=' + nT(o.k)) + ' are where ' + t('Y_1') + ' and ' + t('Y_2=' + nT(o.k)) + ' meet (' + t('t=' + o.t1) + ' s and ' + t('t=' + o.t2) + ' s).' : w === 1 ? 'The greatest height is the maximum of ' + t('Y_1') + '.' : 'The height at a given time: evaluate (1:value) at ' + t('X=' + o.t1) + '.';
        return mcPart(r, 'The height of a ' + o.thing + ' is modelled by ' + t('h(t)=' + polyTex([-o.a, o.b, o.c], 't')) + '. To find ' + q[0] + ' with a graphing calculator, a student should', opts, sol.replace(/^C: /, ''), HCALC, 'MC: which calculator tool', true);
      } }] },

    { num: '13', parts: [
      { id: '13', level: 'EMG', make: function (r) {
        var o = subsModel(r), yr = o.y0 + o.x;
        return numPart('<i>(Numerical Response)</i> A streaming service models its number of subscribers, ' + t('S') + ' (millions), ' + t('x') + ' years after the start of ' + o.y0 + ' by ' + t('S(x)=' + polyTex([-o.a, o.b, o.c], 'x')) + '. According to the model, the number of subscribers peaks in the year ______.', yr, { nr: true, cands: [[o.x, 'u5l9-years-after', t('x=' + o.x) + ' is the number of years after ' + o.y0 + '. Add it to ' + o.y0 + '.']],
          sol: '4:maximum: ' + t('(' + o.x + ',\\ ' + nT(o.S) + ')') + '. ' + t('x=' + o.x) + ' years after ' + o.y0 + ': the year ' + yr + '.', hints: ['The time of the maximum is the first coordinate of the vertex.'], text: 'NR: year of the peak' });
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var o = subsModel(r);
        return apxPart('<i>(Numerical Response)</i> A streaming service models its number of subscribers, ' + t('S') + ' (millions), ' + t('x') + ' years after the start of ' + o.y0 + ' by ' + t('S(x)=' + polyTex([-o.a, o.b, o.c], 'x')) + '. The greatest number of subscribers, in millions to the nearest tenth, is ______.', o.S, 1, { nr: true, cands: [[o.x, 'u5l9-time-height', 'That is when the peak happens. The number of subscribers is the second coordinate.'], [o.c, 'u5l9-feature', 'That is the number at the start.']],
          sol: '4:maximum: ' + t('(' + o.x + ',\\ ' + nT(o.S) + ')') + ': ' + t(fx(o.S, 1)) + ' million.', hints: HCALC, text: 'NR: greatest number of subscribers' });
      } }] }
  ];

  function money2(x) { return '\\$' + fx(x, 2); }
  function subsModel(r) {
    return pickWhere(function () { var a = r.pick([0.2, 0.3, 0.4, 0.5, 0.6]), x = r.int(4, 10), c = r.int(50, 180) / 10; return { a: a, x: x, b: cl(2 * a * x), c: c, S: cl(c + a * x * x), y0: r.pick([2010, 2012, 2015, 2018]) }; },
      function (z) { return !(z.a === 0.4 && z.x === 8) && z.S < 100; });
  }
  function gymShared(r) {
    return pickWhere(function () {
      var P = 5 * r.int(8, 16), s = r.pick([2, 4, 5, 10]), x1 = r.int(2, 8), m = r.pick([10, 15, 20, 25, 30, 40]), N = m * (2 * x1 + P / s);
      var s2 = r.pick([1, 2, 3, 4, 5]), x2 = r.int(2, 6), den = P / s2 - 2 * x2, m2 = den > 0 ? N / den : -1;
      return { P: P, s: s, x1: x1, m: m, N: N, s2: s2, x2: x2, m2: m2, R1: (P + s * x1) * (N - m * x1), R2: (P - s2 * x2) * (N + m2 * x2), ctx: r.pick([{ place: 'climbing gym', who: 'members' }, { place: 'swim club', who: 'members' }, { place: 'music school', who: 'students' }]) };
    }, function (z) { return Number.isInteger(z.N) && z.N >= 150 && z.N <= 900 && !(z.P === 60 && z.s === 5 && z.m === 20) && Number.isInteger(z.m2) && z.m2 >= 10 && z.m2 <= 150 && z.P - z.s2 * z.x2 > 0 && z.R1 !== z.R2 && z.R2 > z.P * z.N && z.R1 > z.P * z.N; });
  }
  function fishShared(r) {
    return pickWhere(function () {
      var M = 500 * r.int(6, 16), g = r.pick([200, 250, 300, 400, 500]), p = 0.5 * r.int(8, 16), d = r.pick([0.1, 0.15, 0.2, 0.25, 0.3]), w = (p / d - M / g) / 2;
      return { M: M, g: g, p: p, d: d, w: cl(w), Rv: (M + g * w) * (p - d * w), ctx: r.pick([{ a: 'A fish farm could sell its stock today:', b: 'of fish', c: 'the fish gain', d: 'The farm sells at the end of a whole week.' }, { a: 'An orchard could pick its whole crop today:', b: 'of apples', c: 'the apples on the trees gain', d: 'It picks at the end of a whole week.' }]) };
    }, function (z) { var fr = z.w - Math.floor(z.w); return !(z.M === 5000 && z.g === 400 && z.p === 6 && z.d === 0.2) && z.w >= 3 && z.w <= 14 && fr > 0.08 && fr < 0.92 && Math.abs(fr - 0.5) > 0.08 && z.p - z.d * Math.ceil(z.w) > 0.5; });
  }

  /* =========================== Extra practice =========================== */
  function clockH(h) { return (h === 0 ? 12 : h > 12 ? h - 12 : h) + ':00 ' + (h < 12 ? 'a.m.' : 'p.m.'); }
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', shared: function (r) {
        return pickWhere(function () { var a = r.pick([0.5, 1, 2]), rr = r.int(1, 4), s = rr + 2 * r.int(1, 5); return { a: a, r: rr, s: s, T0: a * rr * s, hv: (rr + s) / 2, q: -a * Math.pow((s - rr) / 2, 2), D: rr + s }; },
          function (z) { return !(z.a === 0.5 && z.r === 2 && z.s === 10) && Number.isInteger(z.T0) && Number.isInteger(z.q) && z.D <= 14 && z.q >= -18 && z.T0 <= 20 && z.q <= -2; });
      },
      stem: function (o) {
        var f = function (h) { return o.a * (h - o.r) * (h - o.s); }, lo = o.q - 2, hi = o.T0 + 2;
        if (hi - lo > 26) return 'On a winter night, the temperature in degrees Celsius ' + t('h') + ' hours after midnight is modelled by ' + t('T(h)=' + polyTex([o.a, -o.a * (o.r + o.s), o.T0], 'h') + ',\\ 0\\le h\\le ' + o.D) + ', graphed below. Use the graph.' +
          graphFig({ f: f, from: 0, to: o.D, x: [0, o.D + 1], y: [lo, hi], gx: 1, gy: 1, lx: 2, ly: 4, xName: 'h', yName: 'T', w: 22 * (o.D + 1), h: 9 * (hi - lo), max: 340, aria: 'graph of the temperature' });
        return 'On a winter night, the temperature in degrees Celsius ' + t('h') + ' hours after midnight is modelled by ' + t('T(h)=' + polyTex([o.a, -o.a * (o.r + o.s), o.T0], 'h') + ',\\ 0\\le h\\le ' + o.D) + ', graphed below. Use the graph.' +
          graphFig({ f: f, from: 0, to: o.D, x: [0, o.D + 1], y: [lo, hi], gx: 1, gy: 1, lx: 2, ly: 2, xName: 'h', yName: 'T', w: 22 * (o.D + 1), h: 12 * (hi - lo), max: 340, aria: 'graph of the temperature' });
      },
      parts: [
        { id: 'eA1a', level: 'BEG', make: function (r, o) { return numPart('What was the temperature at midnight?', o.T0, { after: '°C', unit: '°C', cands: [[o.q, 'u5l9-feature', 'That is the lowest temperature. Midnight is ' + t('h=0') + '.']], sol: t('T(0)=' + o.T0 + '^\\circ\\text{C}'), hints: ['Midnight is ' + t('h=0') + ': the vertical intercept.'], text: 'temperature: at midnight' }); } },
        { id: 'eA1b', level: 'BEG', make: function (r, o) {
          return fieldsPart('What was the lowest temperature, and at what time?', [{ label: 'Lowest temperature', ans: o.q, after: '°C', cands: [[-o.q, 'sign', 'The vertex is below the ' + t('h') + '-axis: the temperature is negative.'], [o.hv, 'u5l9-swap-coords', 'That is the time.']] }, { label: 'At', ans: o.hv, after: ':00 a.m.', cands: [[o.q, 'u5l9-swap-coords', 'That is the temperature.']] }],
            { sol: 'Vertex ' + t('(' + o.hv + ',\\ ' + o.q + ')') + ': ' + t(o.q + '^\\circ\\text{C}') + ' at ' + clockH(o.hv) + '.', hints: ['The lowest point is the vertex. Its first coordinate is the number of hours after midnight.'], text: 'temperature: lowest and when' });
        } },
        { id: 'eA1c', level: 'EMG', make: function (r, o) {
          return mcPart(r, 'At what times was the temperature ' + t('0^\\circ\\text{C}') + '?', [
            { html: clockH(o.r) + ' and ' + clockH(o.s), right: true }, { html: clockH(o.hv) + ' only', why: 'That is when it was coldest. ' + t('0^\\circ\\text{C}') + ' is where the graph crosses the ' + t('h') + '-axis.' },
            { html: clockH(o.r) + ' only', why: 'The graph crosses the ' + t('h') + '-axis twice.' }, { html: '12:00 a.m. and ' + clockH(o.D), why: 'Those are the ends of the model. Look for the zeros.' }],
            'The zeros: ' + t('h=' + o.r) + ' and ' + t('h=' + o.s) + ', at ' + clockH(o.r) + ' and ' + clockH(o.s) + '.', ['The temperature is 0 where the graph meets the ' + t('h') + '-axis.'], 'temperature: times at 0 degrees');
        } },
        { id: 'eA1d', level: 'PRG', make: function (r, o) {
          var T = { v: 'T', lo: o.q, hi: o.T0, lc: true, hc: true, ctx: 'from midnight to ' + clockH(o.D), hiWhy: 'the warmest time is at the ends of the domain.', wrong: [{ lo: o.q, hi: Infinity, lc: true, hc: false, code: 'u5l9-unbounded', hint: 'The model stops at ' + t('h=' + o.D) + ', so the temperature has a greatest value too.' }, { lo: 0, hi: o.D, lc: true, hc: true, code: 'set-swap', hint: 'That is the domain (the hours). The range is the temperatures.' }] };
          return fieldsPart('State the range of the model.', [{ label: 'Range', set: T }], { sol: t(setTex(T)), hints: ['From the lowest temperature (the vertex) up to the highest on the graph (at the ends).'], text: 'temperature: range' });
        } }] },

    { num: 'A2', shared: function (r) {
        return pickWhere(function () { var b = r.int(110, 190) / 10, c = r.int(2, 12) / 10; return { b: b, c: c, tv: b / 9.8, H: c + b * b / 19.6, T: (b + Math.sqrt(b * b + 19.6 * c)) / 9.8, k: r.pick([1, 1.5, 2, 2.5]) }; },
          function (z) { return !(z.b === 15 && z.c === 0.5) && z.k < z.T - 0.3 && Math.abs(z.k - z.tv) > 0.2; });
      },
      stem: function (o) { return 'A soccer ball is kicked. Its height in metres after ' + t('t') + ' seconds is ' + t('h(t)=' + polyTex([-4.9, o.b, o.c], 't')) + '. Use a graphing calculator and answer to the nearest hundredth.'; },
      parts: [
        { id: 'eA2a', level: 'EMG', make: function (r, o) { return fieldsPart('What is the maximum height, and when is it reached?', [{ label: 'Maximum height', ans: o.H, dp: 2, after: 'm', cands: [[o.tv, 'u5l9-swap-coords', 'That is the time.']] }, { label: 'Time', ans: o.tv, dp: 2, after: 's', cands: [[o.H, 'u5l9-swap-coords', 'That is the height.']] }], { sol: '4:maximum: ' + t('(' + fx(o.tv, 2) + ',\\ ' + fx(o.H, 2) + ')') + '. ' + t(fx(o.H, 2)) + ' m after ' + t(fx(o.tv, 2)) + ' s.', hints: HCALC, text: 'soccer: maximum' }); } },
        { id: 'eA2b', level: 'BEG', make: function (r, o) { var v = -4.9 * o.k * o.k + o.b * o.k + o.c; return apxPart('How high is the ball after ' + t(nT(o.k)) + ' s?', v, 2, { after: 'm', unit: 'm', sol: t('h(' + nT(o.k) + ')=' + fx(v, 2)) + ' m', hints: ['1:value with ' + t('X=' + nT(o.k)) + '.'], text: 'soccer: height at a time' }); } },
        { id: 'eA2c', level: 'EMG', make: function (r, o) { return apxPart('When does the ball land?', o.T, 2, { after: 's', unit: 's', cands: [[2 * o.tv, 'u5l9-landing-twice', 'The ball starts above the ground: find the positive zero.']], sol: '2:zero: ' + t('t\\approx ' + fx(o.T, 2)) + ' s', hints: HCALC, text: 'soccer: landing' }); } },
        { id: 'eA2d', level: 'PRG', make: function (r, o) { var dr = domRange(o.T, o.H, o.c, 2); return fieldsPart('State the domain and range in this context.', [{ label: 'Domain', set: dr[0] }, { label: 'Range', set: dr[1] }], { sol: 'Domain ' + t(setTex(dr[0])) + '; range ' + t(setTex(dr[1])) + '.', hints: ['From the kick to the landing; from the ground to the maximum.'], text: 'soccer: domain and range' }); } }] },

    { num: 'A3', parts: [
      { id: 'eA3', level: 'BEG', make: function (r) {
        var pool = [['the lowest cost', 'min'], ['the least fuel use', 'min'], ['the height after 3 s', 'val'], ['the revenue at a price of $25', 'val'], ['when a ball hits the ground', 'zero'], ['when the profit is $0 (the break-even points)', 'zero'], ['when the profit is $500', 'int'], ['when a ball is 10 m high', 'int'], ['the greatest area', 'max'], ['the maximum height', 'max']];
        var rows = r.shuffle(pool).filter(function (x, i, arr) { return arr.findIndex(function (y) { return y[1] === x[1]; }) === i; }); rows = r.shuffle(rows);
        var cols = [{ id: 'val', html: 'value' }, { id: 'zero', html: 'zero' }, { id: 'min', html: 'minimum' }, { id: 'max', html: 'maximum' }, { id: 'int', html: 'intersect' }], want = {};
        var R = rows.map(function (x, i) { want['r' + i] = x[1]; return { id: 'r' + i, html: cap(x[0]) }; });
        return B.grid('Name the calculator feature that answers each question.', R, cols, want, { rowHead: 'Question', colHead: 'Feature' },
          rows.map(function (x) { return cap(x[0]) + ': ' + cols.filter(function (c) { return c.id === x[1]; })[0].html + (x[1] === 'int' ? ' (with ' + t('Y_2') + ' = the given value)' : ''); }).join('<br>'), ['value: the output for an input. zero: where the output is 0. minimum / maximum: the vertex. intersect: where the output equals a given value.'], 'calculator features');
      } }] },

    { num: 'B1', section: 'B. Applying', shared: function (r) {
        return pickWhere(function () { var P = r.pick([2, 2.5, 3, 3.5, 4]), s = r.pick([0.1, 0.2, 0.25, 0.5]), x = r.int(2, 8), m = r.pick([5, 10, 12, 15, 20]); return { P: P, s: s, x: x, m: m, N: cl(m * (2 * x + P / s)), what: r.pick([['bakery', 'cupcakes'], ['coffee cart', 'lattes'], ['bike shop', 'tune-ups']]) }; },
          function (z) { return Number.isInteger(z.N) && z.N >= 60 && z.N <= 600 && !(z.P === 3 && z.s === 0.25 && z.m === 15); });
      },
      stem: function (o) { return 'A ' + o.what[0] + ' sells ' + t(o.N) + ' ' + o.what[1] + ' a day at ' + t(money2(o.P)) + ' each. For every ' + t(money2(o.s)) + ' increase in price, it sells ' + t(o.m) + ' fewer ' + o.what[1] + '.'; },
      parts: [
        { id: 'eB1a', level: 'EMG', make: function (r, o) {
          var Rf = function (x) { return (o.P + o.s * x) * (o.N - o.m * x); };
          return exprPart('Let ' + t('x') + ' be the number of ' + t(money2(o.s)) + ' increases. Write the revenue function ' + t('R(x)') + '.', Rf, '(' + nT(o.P) + '+' + nT(o.s) + 'x)(' + o.N + '-' + o.m + 'x)', { before: t('R(x)='),
            cands: [[function (x) { return (o.P - o.s * x) * (o.N - o.m * x); }, 'u5l9-dir', 'The price goes <b>up</b>.'], [function (x) { return (o.P + o.s * x) * (o.N + o.m * x); }, 'u5l9-dir', 'Sales go <b>down</b>.'], [function (x) { return (o.P + x) * (o.N - o.m * x); }, 'u5l9-step-size', 'Each increase is ' + t(money2(o.s)) + '.']],
            sol: t('R(x)=(' + fx(o.P, 2) + '+' + fx(o.s, 2) + 'x)(' + o.N + '-' + o.m + 'x)'), hints: ['Revenue = (price)(number sold).'], text: 'bakery: revenue function' });
        } },
        { id: 'eB1b', level: 'PRG', make: function (r, o) {
          var pr = cl(o.P + o.s * o.x), n = o.N - o.m * o.x, R = cl(pr * n);
          return fieldsPart('Find the price that gives the maximum daily revenue, the number sold and the revenue.', [{ label: 'Price', before: t('\\$'), ans: pr, cands: [[o.x, 'u5l9-steps', 'That is the number of increases.']] }, { label: cap(o.what[1]), ans: n }, { label: 'Revenue', before: t('\\$'), ans: R, after: 'a day' }],
            { sol: '4:maximum: ' + t('(' + o.x + ',\\ ' + nT(R) + ')') + '. Price ' + t(nT(o.P) + '+' + nT(cl(o.s * o.x)) + '=' + money2(pr)) + '; ' + t(o.N + '-' + o.m * o.x + '=' + n) + ' ' + o.what[1] + '; revenue ' + t(money(R)) + ' a day.', hints: ['Find the maximum of ' + t('R(x)') + ', then substitute that ' + t('x') + ' into the price and the number sold.'], text: 'bakery: maximum revenue' });
        } }] },

    { num: 'B2', shared: function (r) { return pickWhere(function () { var a = r.pick([1, 1.5, 2, 2.5]), T = r.int(4, 10); return { a: a, T: T, b: cl(a * T), D: cl(a * T * T / 4), k: r.int(3, 12), who: r.pick(['A dolphin', 'A seal', 'A penguin']) }; }, function (z) { return !(z.a === 1.5 && z.T === 6) && z.k < 0.85 * z.D && z.k > 0.3 * z.D; }); },
      stem: function (o) { return o.who + ' dives and comes back to the surface. Its position in metres relative to the surface (negative is below) after ' + t('t') + ' seconds is ' + t('d(t)=' + polyTex([o.a, -o.b, 0], 't')) + '.'; },
      parts: [
        { id: 'eB2a', level: 'EMG', make: function (r, o) { return fieldsPart('How deep does it go, and when?', [{ label: 'Depth', ans: o.D, dp: 2, after: 'm', cands: [[-o.D, 'u5l9-depth-sign', 'A depth is a distance below the surface: give it as a positive number.'], [o.T / 2, 'u5l9-swap-coords', 'That is the time.']] }, { label: 'Time', ans: o.T / 2, dp: 2, after: 's', cands: [[o.T, 'u5l9-feature', 'That is when it comes back up. The deepest point is the vertex.']] }], { sol: '3:minimum: ' + t('(' + nT(o.T / 2) + ',\\ ' + nT(-o.D) + ')') + '. ' + t(nT(o.D)) + ' m deep after ' + t(nT(o.T / 2)) + ' s.', hints: ['The parabola opens up: 3:minimum.'], text: 'dolphin: deepest point' }); } },
        { id: 'eB2b', level: 'BEG', make: function (r, o) { return numPart('How long is it under water?', o.T, { after: 's', unit: 's', cands: [[o.T / 2, 'u5l9-half', 'That is the time to the deepest point. It is under water from one zero to the other.']], sol: 'Zeros ' + t('t=0') + ' and ' + t('t=' + o.T) + ': ' + t(o.T) + ' s.', hints: ['At the surface ' + t('d(t)=0') + '.'], text: 'dolphin: time under water' }); } },
        { id: 'eB2c', level: 'ADV', make: function (r, o) { var rt = roots(o.a, -o.b, o.k); return fieldsPart('When is it ' + t(o.k) + ' m below the surface? Answer to the nearest hundredth of a second.', [{ label: 'Going down', ans: rt[0], dp: 2, after: 's' }, { label: 'Coming up', ans: rt[1], dp: 2, after: 's' }], { swap: [0, 1], sol: t('Y_2=-' + o.k) + ', intersect: ' + t('t\\approx ' + fx(rt[0], 2)) + ' s and ' + t('t\\approx ' + fx(rt[1], 2)) + ' s.', hints: ['Below the surface is negative: ' + t('Y_2=-' + o.k) + '.'], text: 'dolphin: times at a depth' }); } }] },

    { num: 'B3', shared: function (r) { return pickWhere(function () { var a = r.pick([5, 10, 12, 15, 20]), x = r.int(15, 40), Pm = 500 * r.int(4, 20); return { a: a, x: x, b: 2 * a * x, Pm: Pm, c: a * x * x - Pm, off: Math.sqrt(Pm / a), thing: r.pick(['bicycles', 'snowboards', 'kayaks']) }; }, function (z) { var lo = z.x - z.off, fr = lo - Math.floor(lo); return !(z.a === 15 && z.x === 30) && z.c > 0 && lo > 1 && fr > 0.1 && fr < 0.9; }); },
      stem: function (o) { return 'A company’s daily profit, in dollars, from making ' + t('x') + ' ' + o.thing + ' is ' + t('P(x)=' + polyTex([-o.a, o.b, -o.c], 'x')) + '.'; },
      parts: [
        { id: 'eB3a', level: 'EMG', make: function (r, o) { return fieldsPart('How many ' + o.thing + ' give the greatest profit, and what is it?', [{ label: cap(o.thing), ans: o.x, cands: [[o.Pm, 'u5l9-swap-coords', 'That is the profit.']] }, { label: 'Greatest profit', before: t('\\$'), ans: o.Pm, cands: [[o.x, 'u5l9-swap-coords', 'That is the number of ' + o.thing + '.']] }], { sol: '4:maximum: ' + t('(' + o.x + ',\\ ' + nT(o.Pm) + ')') + '. ' + o.x + ' ' + o.thing + ' give ' + t(money(o.Pm)) + '.', hints: HCALC, text: 'profit: maximum' }); } },
        { id: 'eB3b', level: 'ADV', make: function (r, o) {
          var lo = o.x - o.off, hi = o.x + o.off, A = Math.ceil(lo), Bn = Math.floor(hi);
          return fieldsPart('For what whole numbers of ' + o.thing + ' does the company make a profit?', [{ label: 'From', ans: A, cands: [[Math.floor(lo), 'u5l9-whole-range', 'At ' + Math.floor(lo) + ' the profit is still negative. Start at the first whole number between the zeros.']] }, { label: 'to', ans: Bn, after: o.thing, cands: [[Math.ceil(hi), 'u5l9-whole-range', 'At ' + Math.ceil(hi) + ' the profit is negative again.']] }],
            { sol: '2:zero: ' + t('x\\approx ' + fx(lo, 2)) + ' and ' + t('x\\approx ' + fx(hi, 2)) + '. ' + t('P(x)>0') + ' between them: from ' + A + ' to ' + Bn + ' ' + o.thing + '.', hints: ['A profit means ' + t('P(x)>0') + ': between the two zeros. Only whole numbers count.'], text: 'profit: whole numbers with a profit' });
        } }] },

    { num: 'B4', shared: function (r) { return pickWhere(function () { var a = r.pick([0.4, 0.5, 0.6, 0.8]), m = r.int(11, 19) / 2, c = r.int(2, 8); return { a: a, m: m, b: cl(2 * a * m), c: c, S: cl(c + a * m * m), Z: m + Math.sqrt((c + a * m * m) / a) }; }, function (z) { return !(z.a === 0.6 && z.m === 7.5) && Number.isInteger(cl(z.b * 10)); }); },
      stem: function (o) { return 'Monthly sales of a new phone, in thousands, ' + t('m') + ' months after its release are modelled by ' + t('S(m)=' + polyTex([-o.a, o.b, o.c], 'm')) + '.'; },
      parts: [
        { id: 'eB4a', level: 'EMG', make: function (r, o) { return fieldsPart('When do sales peak, and what are the peak monthly sales (in thousands)?', [{ label: 'Months after release', ans: o.m, dp: 1, after: 'months' }, { label: 'Peak sales', ans: o.S, dp: 2, after: 'thousand phones a month', cands: [[o.S * 1000, 'u5l9-thousands', 'Give the sales in thousands, as the model does.']] }], { sol: '4:maximum: ' + t('(' + nT(o.m) + ',\\ ' + nT(o.S) + ')') + ': ' + t(nT(o.m)) + ' months after release, at about ' + t(F(Math.round(o.S * 1000))) + ' phones a month.', hints: HCALC, text: 'phone sales: peak' }); } },
        { id: 'eB4b', level: 'EMG', make: function (r, o) { return apxPart('By the model, when would sales fall to zero? Answer to the nearest tenth of a month.', o.Z, 1, { after: 'months', unit: 'months', cands: [[2 * o.m, 'u5l9-landing-twice', 'Sales don’t start at 0, so use the positive zero, not twice the peak time.']], sol: '2:zero: ' + t('m\\approx ' + fx(o.Z, 1)) + ' months after release.', hints: ['Find the positive zero.'], text: 'phone sales: zero' }); } }] },

    { num: 'B5', parts: [
      { id: 'eB5', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(1, 4), c: r.int(1, 9) }; }, function (z) { return !(z.p === 2 && z.c === 2); }), q = 5 * o.p * o.p + o.c;
        return mcPart(r, 'The height of a ball is ' + t('h(t)=' + polyTex([-5, 10 * o.p, o.c], 't')) + ' metres after ' + t('t') + ' seconds. The range of the function in this context is', [
          { html: t('\\{h\\mid 0\\le h\\le ' + q + ',\\ h\\in\\mathbb{R}\\}'), right: true }, { html: t('\\{h\\mid h\\le ' + q + ',\\ h\\in\\mathbb{R}\\}'), why: 'That ignores the context: the ball stops at the ground (' + t('h=0') + ').' },
          { html: t('\\{h\\mid ' + o.c + '\\le h\\le ' + q + ',\\ h\\in\\mathbb{R}\\}'), why: 'The ball falls past its launch height all the way to the ground.' }, { html: t('\\{h\\mid 0\\le h\\le ' + o.c + ',\\ h\\in\\mathbb{R}\\}'), why: o.c + ' m is the launch height; the ball goes higher, to the vertex.' }],
          'The vertex is ' + t('(' + o.p + ',\\ ' + q + ')') + ', and the ball falls from ' + q + ' m all the way to the ground (' + t('h=0') + ').', ['Range in context: from the ground up to the maximum height.'], 'MC: range in context');
      } }] },
    { num: 'B6', parts: [
      { id: 'eB6', level: 'EMG', make: function (r) {
        var b = pickWhere(function () { return r.int(150, 300) / 10; }, function (x) { return x !== 22 && x < 48; }), T = b / 4.9;
        return apxPart('<i>(Numerical Response)</i> A golf ball’s height in metres is ' + t('h(t)=' + polyTex([-4.9, b, 0], 't')) + '. The time the ball is in the air, in seconds to the nearest tenth, is ______.', T, 1, { nr: true, cands: [[T / 2, 'u5l9-half', 'That is the time to the top. Use the positive zero.']], sol: '2:zero (positive): ' + t('t=\\frac{' + nT(b) + '}{4.9}\\approx ' + fx(T, 2)) + ', so ' + t(fx(T, 1)) + ' s.', hints: ['The ball is in the air until the positive zero.'], text: 'NR: time in the air' });
      } }] },

    { num: 'C1', section: 'C. Stretch', shared: function (r) {
        return pickWhere(function () { var b1 = r.pick([16, 18, 20, 22, 24, 25]), b2 = r.pick([10, 12, 14, 15, 16]), t0 = r.pick([0.5, 1, 1.5, 2]), c1 = r.int(1, 4); var c2 = cl(c1 + t0 * (b1 - b2)); return { b1: b1, b2: b2, c1: c1, c2: c2, t0: t0, H1: c1 + b1 * b1 / 20, H2: c2 + b2 * b2 / 20 }; },
          function (z) { return z.b1 > z.b2 && z.c2 <= 15 && !(z.b1 === 20 && z.b2 === 15 && z.c1 === 1) && Math.abs(z.H1 - z.H2) > 0.4 && z.t0 < z.b2 / 5; });
      },
      stem: function (o) { return 'Two balls are thrown at the same moment. Their heights in metres are ' + t('h_1(t)=' + polyTex([-5, o.b1, o.c1], 't')) + ' and ' + t('h_2(t)=' + polyTex([-5, o.b2, o.c2], 't')) + '.'; },
      parts: [
        { id: 'eC1a', level: 'ADV', make: function (r, o) {
          var d = Math.abs(o.H1 - o.H2), one = o.H1 > o.H2;
          return mcPart(r, 'Which ball goes higher, and by how much?', [
            { html: 'The first ball, by ' + t(nT(d)) + ' m', right: one, why: one ? null : 'Compare the maximums: ' + t(nT(o.H1)) + ' m and ' + t(nT(o.H2)) + ' m.' }, { html: 'The second ball, by ' + t(nT(d)) + ' m', right: !one, why: !one ? null : 'Compare the maximums: ' + t(nT(o.H1)) + ' m and ' + t(nT(o.H2)) + ' m.' },
            { html: (one ? 'The first' : 'The second') + ' ball, by ' + t(nT(Math.abs(o.c1 - o.c2))) + ' m', why: 'That is the difference in the starting heights. Compare the maximum heights.' }, { html: 'They reach the same height.', why: 'Find each maximum with 4:maximum.' }],
            t('h_1') + ': maximum ' + t('(' + nT(o.b1 / 10) + ',\\ ' + nT(o.H1) + ')') + '; ' + t('h_2') + ': maximum ' + t('(' + nT(o.b2 / 10) + ',\\ ' + nT(o.H2) + ')') + '. The ' + (one ? 'first' : 'second') + ' ball goes ' + t(nT(d)) + ' m higher.', HCALC, 'two balls: which goes higher');
        } },
        { id: 'eC1b', level: 'ADV', make: function (r, o) {
          var h = -5 * o.t0 * o.t0 + o.b1 * o.t0 + o.c1;
          return fieldsPart('When are the balls at the same height, and what is that height?', [{ label: 'Time', ans: o.t0, dp: 2, after: 's' }, { label: 'Height', ans: h, dp: 2, after: 'm' }],
            { sol: 'Intersect ' + t('Y_1') + ' and ' + t('Y_2') + ': ' + t('(' + nT(o.t0) + ',\\ ' + nT(h) + ')') + '. After ' + t(nT(o.t0)) + ' s, at ' + t(nT(h)) + ' m.', hints: ['Graph both and use 5:intersect.'], text: 'two balls: same height' });
        } }] },

    { num: 'C2', shared: function (r) { return pickWhere(function () { var P = 2 * r.int(6, 15), m = r.pick([5, 10, 20]), x = r.int(8, 20), N = m * (2 * x + P); return { P: P, m: m, N: N, x: x, cap: P + r.int(3, x - 2), what: r.pick(['parking lot', 'campground', 'marina']) }; }, function (z) { return !(z.P === 20 && z.m === 10 && z.x === 15) && z.N <= 2000 && z.cap < z.P + z.x; }); },
      stem: function (o) { return 'A ' + o.what + ' charges ' + t('\\$' + o.P) + ' a day and fills ' + t(o.N) + ' spaces. For each ' + t('\\$1') + ' increase, ' + t(o.m) + ' fewer spaces are rented. A city bylaw caps the price at ' + t('\\$' + o.cap) + ' a day.'; },
      parts: [
        { id: 'eC2a', level: 'PRG', make: function (r, o) { var pr = o.P + o.x; return numPart('Without the cap, what price would give the maximum revenue?', pr, { before: '\\$', ansPre: '\\$', cands: [[o.x, 'u5l9-steps', 'That is the number of increases.'], [o.cap, 'u5l9-cap', 'Without the cap, use the vertex.']], sol: t('R(x)=(' + o.P + '+x)(' + o.N + '-' + o.m + 'x)') + '; 4:maximum: ' + t('(' + o.x + ',\\ ' + nT(pr * (o.N - o.m * o.x)) + ')') + ', a price of ' + t('\\$' + pr) + '.', hints: ['Write ' + t('R(x)') + ' and find its maximum.'], text: 'price cap: without the cap' }); } },
        { id: 'eC2b', level: 'MAS', make: function (r, o) {
          var k = o.cap - o.P, R = o.cap * (o.N - o.m * k), Rv = (o.P + o.x) * (o.N - o.m * o.x);
          return fieldsPart('With the cap, what price gives the maximum revenue, and what is it?', [{ label: 'Price', before: t('\\$'), ans: o.cap, cands: [[o.P + o.x, 'u5l9-cap', 'That price is above the cap. The domain is now ' + t('0\\le x\\le ' + k) + '.']] }, { label: 'Revenue', before: t('\\$'), ans: R, after: 'a day', cands: [[Rv, 'u5l9-cap', 'That is the revenue at the vertex, which the cap doesn’t allow.']] }],
            { sol: 'Now ' + t('0\\le x\\le ' + k) + '. The vertex ' + t('x=' + o.x) + ' is outside this domain and ' + t('R') + ' is increasing on it, so the maximum is at the endpoint ' + t('x=' + k) + ': price ' + t('\\$' + o.cap) + ', ' + (o.N - o.m * k) + ' spaces, ' + t('R=' + money(R)) + '.', hints: ['With the cap, ' + t('x') + ' can only go up to ' + k + '. Where is the highest point of the graph on that domain?'], text: 'price cap: maximum at the endpoint' });
        } }] },

    { num: 'C3', parts: [
      { id: 'eC3', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { tv: r.int(8, 25) / 10, c: r.int(5, 25) / 10 }; }, function (z) { return !(z.tv === 1.6 && z.c === 1.5); }), b = cl(10 * o.tv), H = cl(5 * o.tv * o.tv + o.c);
        return fieldsPart('A ball’s height is modelled by ' + t('h(t)=-5t^{2}+bt+' + nT(o.c)) + ', and its maximum height is reached at ' + t('t=' + nT(o.tv)) + ' s. Determine ' + t('b') + ' and the maximum height. (Hint: the axis of symmetry is ' + t('t=-\\frac{b}{2a}') + '.)', [{ label: t('b='), ans: b, cands: [[cl(o.tv * 5), 'u5l9-half', t('2a=2(-5)=-10') + ', so ' + t('b=10(' + nT(o.tv) + ')') + '.'], [-b, 'sign', t(nT(o.tv) + '=-\\frac{b}{-10}=\\frac{b}{10}') + '.']] }, { label: 'Maximum height', ans: H, after: 'm' }],
          { sol: t(nT(o.tv) + '=-\\frac{b}{2(-5)}=\\frac{b}{10}') + ', so ' + t('b=' + nT(b)) + '.<br>' + t('h(' + nT(o.tv) + ')=-5(' + nT(cl(o.tv * o.tv)) + ')+' + nT(b) + '(' + nT(o.tv) + ')+' + nT(o.c) + '=' + nT(H)) + ' m.', hints: ['Solve ' + t(nT(o.tv) + '=-\\frac{b}{2(-5)}') + ' for ' + t('b') + ', then substitute ' + t('t=' + nT(o.tv)) + '.'], text: 'find b from the time of the maximum' });
      } }] }
  ];

  HW.defineLesson({ id: LID, unit: 5, num: '9', title: 'Maximum and Minimum Problems: Graphical Approach', outcome: 'RF4', calc: true, questions: QUESTIONS, extra: EXTRA });
  (HW.u5mmWait || []).splice(0).forEach(function (f) { f(); }); // u5l10.js, if it loaded first
})(window);
