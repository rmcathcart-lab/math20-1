/* Math 20-1 · Unit 2 · Lesson 3 — Adding and Subtracting Radicals (outcome AN2 on every part)
 * Assignment 3 (u2_l03.tex, Questions 1–17) and the Lesson 3 Extra Practice (u2_ep03.tex, A1–A3, B1–B6, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet's own numbers are left out where that is easy). No calculator (Unit 2): exact answers in
 * simplest form.
 *
 * This file also holds the radical-expression kit shared by Lessons 3 and 4 (HW.p23rad): exact sums of radicals,
 * products, LaTeX, the "simplest form" answer checker for sums of radicals (any index, with or without variables), the
 * restriction box (x ≥ 0, y ≥ 0 / no restriction) and the keypad with roots, + and −, variables and ≥. u2l4.js needs
 * it, so this file must load first.
 *
 * The answer checker (R.check): the value must be right (exactly, or at several values of the variables), then the form:
 * every radical in simplest form (no perfect-power factor or variable power ≥ the index left under the root), like
 * radicals collected, one rational term, one coefficient per term (fractions reduced), no brackets or powers left,
 * no product of two radicals — a right value in the wrong form gets a nudge that doesn't use a try.
 *
 * Conversions: "explain the error" → multiple choice of explanations with the corrected answer; "which pairs are like
 * radicals" → a table (like / not like); "plot the triangle and find the perimeter" → the triangle is drawn on a grid;
 * "show that …" (Extra C1a) → multiple choice of reasons; "list every k" (Extra C2) → a number list.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 12(b) (t₂₀ of a sequence with radical terms), Extra C1(b), C2, C3. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u2l3';

  /* ============================== the radical kit (Lessons 3–4) ============================== */
  var R = HW.p23rad = {};
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function Q(p, q) { q = q == null ? 1 : q; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function qq(x) { return Array.isArray(x) ? Q(x[0], x[1]) : [x, 1]; }
  function qadd(a, b) { return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function qmul(a, b) { return Q(a[0] * b[0], a[1] * b[1]); }
  function qv(a) { return a[0] / a[1]; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function pickWhere(gen, okf, lid) { for (var i = 0; i < 6000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error((lid || LID) + ': no valid numbers'); }
  function sqFree(m) { return ex.simplest(m, 2); }
  R.gcd = gcd; R.Q = Q; R.qq = qq; R.qadd = qadd; R.qmul = qmul; R.qv = qv; R.range = range; R.pickWhere = pickWhere;

  /* ---- terms {c:[p,q], n, m}: c·ⁿ√m (n = 1, m = 1 for a rational term), always simplified ---- */
  function T(c, n, m) {
    c = qq(c); n = n || 1; m = m == null ? 1 : m;
    if (c[0] === 0 || m === 0) return { c: [0, 1], n: 1, m: 1 };
    if (m < 0) { if (n % 2 === 0) throw new Error('even root of a negative'); m = -m; c = [-c[0], c[1]]; }
    if (n > 1) { var f = ex.nthFactor(m, n); if (f > 1) { m = m / Math.pow(f, n); c = qmul(c, [f, 1]); } }
    if (n === 1 || m === 1) { c = qmul(c, [n === 1 ? m : 1, 1]); n = 1; m = 1; }
    return { c: c, n: n, m: m };
  }
  R.T = T;
  /* combine like terms, first appearance first, zeros dropped */
  R.sum = function (list) {
    var out = [], at = {};
    list.forEach(function (u) { var k = u.n + '|' + u.m; if (at[k] == null) { at[k] = out.length; out.push({ c: u.c, n: u.n, m: u.m }); } else out[at[k]].c = qadd(out[at[k]].c, u.c); });
    return out.filter(function (u) { return u.c[0] !== 0; });
  };
  R.val = function (list) { return list.reduce(function (s, u) { return s + qv(u.c) * Math.pow(u.m, 1 / u.n); }, 0); };
  R.rt = function (n, inner) { return ex.texRoot(n, inner); };
  function coefTex(c, hasRad) { // |c| in front of a radical ('' for 1)
    var p = Math.abs(c[0]), q = c[1];
    if (q === 1) return hasRad && p === 1 ? '' : String(p);
    return '\\frac{' + p + '}{' + q + '}';
  }
  R.termTex = function (u, first) {
    var neg = u.c[0] < 0, body = u.n === 1 ? coefTex(u.c, false) : coefTex(u.c, true) + R.rt(u.n, u.m);
    return (neg ? '-' : first ? '' : '+') + body;
  };
  R.tex = function (list) { if (!list.length) return '0'; return list.map(function (u, i) { return R.termTex(u, i === 0); }).join(''); };
  /* product of two terms with the same index (or a rational factor) */
  R.mul = function (a, b) {
    if (a.n === 1) return T(qmul(a.c, b.c), b.n, b.m);
    if (b.n === 1) return T(qmul(a.c, b.c), a.n, a.m);
    if (a.n !== b.n) throw new Error('different indices');
    return T(qmul(a.c, b.c), a.n, a.m * b.m);
  };
  R.mulS = function (A, Bs) { var o = []; A.forEach(function (a) { Bs.forEach(function (b) { o.push(R.mul(a, b)); }); }); return R.sum(o); };
  /* "raw" product as the booklet writes it before simplifying: 2√3·√3 → 2(3), 2√3·4√5 → 8√15 */
  R.rawTex = function (a, b, first) {
    var c = qmul(a.c, b.c), neg = c[0] < 0, s = neg ? '-' : first ? '' : '+';
    if (a.n === 1 && b.n === 1) return s + coefTex(c, false);
    if (a.n === 1 || b.n === 1) { var u = a.n === 1 ? b : a; return s + coefTex(c, true) + R.rt(u.n, u.m); }
    if (a.m === b.m && a.n === 2) return s + (Math.abs(c[0]) === 1 && c[1] === 1 ? String(a.m) : coefTex(c, false) + '(' + a.m + ')');
    return s + coefTex(c, true) + R.rt(a.n, a.m * b.m);
  };
  /* simplified term-by-term (no collecting) — the middle line of an expansion */
  R.foilLines = function (A, Bs) {
    var raw = [], simp = [];
    A.forEach(function (a) { Bs.forEach(function (b) { raw.push(R.rawTex(a, b, !raw.length)); simp.push(R.mul(a, b)); }); });
    var simpTex = simp.filter(function (u) { return u.c[0] !== 0; }).map(function (u, i) { return R.termTex(u, i === 0); }).join('');
    return { raw: raw.join(''), simp: simpTex, list: simp };
  };
  /* question term c·ⁿ√(fⁿ·m) — an entire radical that simplifies to c·f·ⁿ√m */
  R.ent = function (c, n, f, m) { return { c: qq(c), n: n, f: f, m: m, E: Math.pow(f, n) * m }; };
  R.entTex = function (e, first) {
    var neg = e.c[0] < 0, ct = coefTex(e.c, true);
    return (neg ? '-' : first ? '' : '+') + ct + R.rt(e.n, F(e.E));
  };
  R.entsTex = function (list) { return list.map(function (e, i) { return R.entTex(e, i === 0); }).join(''); };
  R.entTerm = function (e) { return T(e.c, e.n, e.E); };
  /* "√28 = √4·√7 = 2√7" for one radical (index n, entire radicand E) */
  R.simpStep = function (n, E) {
    var f = ex.nthFactor(E, n), m = E / Math.pow(f, n);
    if (f === 1) return R.rt(n, F(E));
    if (m === 1) return R.rt(n, F(E)) + '=' + f;
    return R.rt(n, F(E)) + '=' + R.rt(n, F(Math.pow(f, n))) + R.rt(n, m) + '=' + f + R.rt(n, m);
  };
  /* the booklet's middle line: each term simplified, a coefficient in front kept as c(f√m) */
  R.entMid = function (list) {
    return list.map(function (e, i) {
      var f = ex.nthFactor(e.E, e.n), m = e.E / Math.pow(f, e.n), inner = m === 1 ? String(f) : (f === 1 ? '' : f) + R.rt(e.n, m);
      var neg = e.c[0] < 0, c = [Math.abs(e.c[0]), e.c[1]], s = neg ? '-' : i ? '+' : '';
      if (c[0] === 1 && c[1] === 1) return s + inner;
      return s + coefTex(c, false) + '\\left(' + inner + '\\right)';
    }).join('');
  };
  R.entSimpList = function (list) {
    return list.map(function (e, i) { return R.termTex(R.entTerm(e), i === 0); }).join('');
  };

  /* ---------------- reading an answer: its terms and their form ---------------- */
  var SAMPLE = [1.37, 2.29, 3.71, 5.13];
  function envs(vars, o) {
    o = o || {};
    if (o.env) return o.env;
    if (!vars.length) return [{}];
    return SAMPLE.map(function (s, i) { var e = {}; vars.forEach(function (v, j) { e[v] = s + 0.53 * j + (o.shift && o.shift[v] || 0) + (i === 2 ? 0.41 * j : 0); }); return e; });
  }
  R.envs = envs;
  function topTerms(a, sign, out) {
    if (a.t === 'add') { topTerms(a.a, sign, out); topTerms(a.b, sign, out); return out; }
    if (a.t === 'sub') { topTerms(a.a, sign, out); topTerms(a.b, -sign, out); return out; }
    if (a.t === 'neg' && (a.a.t === 'add' || a.a.t === 'sub')) { out.push({ node: a, sign: sign, brackets: true }); return out; }
    if (a.t === 'neg' && a.a.t === 'paren' && (a.a.a.t === 'add' || a.a.a.t === 'sub')) { out.push({ node: a, sign: sign, brackets: true }); return out; }
    if (a.t === 'paren' && sign > 0 && out.length === 0 && (a.a.t === 'add' || a.a.t === 'sub')) return topTerms(a.a, sign, out);
    out.push({ node: a, sign: sign }); return out;
  }
  function ratOf(x) { var r = ex.rat(x); return r; }
  function varKey(v) { return Object.keys(v).sort().filter(function (k) { return v[k]; }).map(function (k) { return k + v[k]; }).join(''); }
  function powName(n) { return n === 2 ? 'square' : n === 3 ? 'cube' : n === 4 ? 'fourth power' : n + 'th power'; }
  R.powName = powName;
  /* one term: coefficient × outside variables × (at most one) root. Returns { issue } or { key, zero } */
  function termInfo(node, envList) {
    var fz = ex.factors(node), roots = [], nNum = 0, nDen = 0, num = [1, 1], den = [1, 1], vars = {}, dec = false;
    for (var i = 0; i < fz.num.length; i++) {
      var f = fz.num[i];
      if (f.t === 'root') { roots.push(f); continue; }
      if (f.t === 'num') { if (f.dec) dec = true; var r = ratOf(f); if (!r) return { issue: ['simplify', null] }; nNum++; num = qmul(num, r); continue; }
      if (f.t === 'var') { vars[f.n] = (vars[f.n] || 0) + 1; continue; }
      if (f.t === 'pow' && f.a.t === 'var') { var e = ratOf(f.b); if (!e || e[1] !== 1 || e[0] < 1) return { issue: ['simplify', null] }; vars[f.a.n] = (vars[f.a.n] || 0) + e[0]; continue; }
      if (f.t === 'add' || f.t === 'sub') return { issue: ['u2l3-expand', 'Right value — now expand: multiply out the brackets and simplify each term.'] };
      if (f.t === 'pow') return { issue: ['u2l3-power', 'Right value — now work out the power (for example ' + t('\\left(3\\sqrt{2}\\right)^{2}=9(2)=18') + ').'] };
      return { issue: ['simplify', null] };
    }
    for (var j = 0; j < fz.den.length; j++) {
      var d = fz.den[j];
      if (d.t === 'num') { if (d.dec) dec = true; var rd = ratOf(d); if (!rd || !rd[0]) return { issue: ['simplify', null] }; nDen++; den = qmul(den, rd); continue; }
      if (d.t === 'root') return { issue: ['u2l3-rad-den', 'Right value — but leave no radical in a denominator.'] };
      return { issue: ['simplify', null] };
    }
    if (dec) return { issue: ['u2l3-dec-coef', 'Right value — write the coefficient as a fraction (or a whole number), not a decimal.'] };
    if (nNum > 1 || nDen > 1) return { issue: ['simplify', 'Right value — now multiply the numbers in front together into a single coefficient.'] };
    if (nDen === 1 && num[1] === 1 && den[1] === 1) {
      var g = gcd(num[0], den[0]); if (g > 1) return { issue: ['lowest', 'Right value — reduce the fraction in front of the radical (divide the top and bottom by ' + t(g) + ').'] };
      if (den[0] === 1) return { issue: ['simplify', 'Right value — dividing by 1 changes nothing; leave it out.'] };
    }
    var coef = qmul(num, [den[1], den[0]]);
    if (coef[0] === 0) return { issue: ['simplify', 'Right value — a term that is zero can be left out.'] };
    if (roots.length > 1) {
      var sameIdx = roots.every(function (x) { var a = ratOf(x.n), b = ratOf(roots[0].n); return a && b && a[0] === b[0]; });
      return { issue: ['u2l3-one-root', sameIdx ? 'Right value — now multiply the radicals into one: ' + t('\\sqrt{a}\\cdot\\sqrt{b}=\\sqrt{ab}') + ', then simplify.' : 'Right value — but write each term with at most one radical.'] };
    }
    var vk = varKey(vars);
    if (!roots.length) return { key: 'rat|' + vk };
    var rn = ratOf(roots[0].n); if (!rn || rn[1] !== 1 || rn[0] < 2) return { issue: ['simplify', null] };
    var n = rn[0], rad = roots[0].a, mono = ex.mono(rad);
    if (mono) {
      if (mono.k[1] !== 1) return { issue: ['u2l3-frac-rad', 'Right value — leave no fraction under the radical.'] };
      var m = mono.k[0];
      if (m < 0) return { issue: ['u2l3-neg-rad', 'Right value — take the negative sign out of the odd root: ' + t('\\sqrt[3]{-a}=-\\sqrt[3]{a}') + '.'] };
      var mv = Object.keys(mono.vars).filter(function (v) { return mono.vars[v]; });
      if (m === 1 && !mv.length) return { issue: ['simplify', 'Right value — ' + t(R.rt(n, 1) + '=1') + ', so that root isn’t needed.'] };
      if (!ex.simplest(m, n)) { var fct = ex.nthFactor(m, n); return { issue: ['not-simplest', 'Right value, but not in simplest form yet: ' + t(F(m)) + ' under the ' + (n === 2 ? 'square' : n === 3 ? 'cube' : n === 4 ? 'fourth' : n + 'th') + ' root still has the factor ' + t(F(Math.pow(fct, n)) + '=' + fct + '^{' + n + '}') + '. Take ' + t(fct) + ' out of the radical.'] }; }
      var big = mv.filter(function (v) { return mono.vars[v] >= n; });
      if (big.length) return { issue: ['not-simplest-var', 'Right value, but ' + t(big[0] + '^{' + mono.vars[big[0]] + '}') + ' under the radical still contains ' + t(big[0] + '^{' + n + '}') + '. Take it out of the radical.'] };
      return { key: n + '|' + m + varKey(mono.vars) + '|' + vk };
    }
    // a binomial radicand (√(x − 2)): its values at the sample points identify it; a common perfect-power factor is not simplest
    var vals = envList.map(function (e) { return ex.value(rad, e); });
    if (vals.some(function (v) { return !isFinite(v); })) return { issue: ['simplify', null] };
    var rv = Object.keys(ex.shape(rad).vars);
    if (rv.length === 1) {
      var e0 = {}, e1 = {}; e0[rv[0]] = 0; e1[rv[0]] = 1;
      var b0 = ex.value(rad, e0), a1 = ex.value(rad, e1) - b0;
      if (Math.abs(b0 - Math.round(b0)) < 1e-9 && Math.abs(a1 - Math.round(a1)) < 1e-9) {
        var gg = gcd(Math.round(a1), Math.round(b0)), ff = gg ? ex.nthFactor(gg, n) : 1;
        if (ff > 1) return { issue: ['not-simplest', 'Right value, but the radicand still has the common factor ' + t(F(Math.pow(ff, n))) + '. Factor it out and take its ' + (n === 2 ? 'square' : 'cube') + ' root, ' + t(ff) + ', out of the radical.'] };
      }
    }
    return { key: n + '|b' + vals.map(function (v) { return Math.round(v * 1e6); }).join(',') + '|' + vk };
  }
  /* null if the expression is in simplest form, else [code, hint] */
  R.formIssue = function (ast, envList) {
    var terms = topTerms(ast, 1, []), seen = {}, nRat = 0;
    if (terms.length === 1 && (terms[0].node.t === 'num' || (terms[0].node.t === 'neg' && terms[0].node.a.t === 'num')) && !terms[0].node.dec && !(terms[0].node.a && terms[0].node.a.dec)) return null;
    for (var i = 0; i < terms.length; i++) {
      if (terms[i].brackets) return ['u2l3-brackets', 'Right value — now remove the brackets (subtract each term inside them) and collect like terms.'];
      var info = termInfo(terms[i].node, envList);
      if (info.issue) return info.issue;
      if (seen[info.key]) return [info.key.indexOf('rat|') === 0 ? 'u2l3-like-rat' : 'u2l3-like', 'Right value — now collect the like terms: ' + (info.key.indexOf('rat|') === 0 ? 'add the rational terms (numbers without a radical) together.' : 'radicals with the same index and radicand combine, like ' + t('2x+3x=5x') + '.')];
      seen[info.key] = 1; if (info.key.indexOf('rat|') === 0) nRat++;
    }
    return null;
  };
  function evalAt(ast, list) { return list.map(function (e) { return ex.value(ast, e); }); }
  function sameVals(a, b) { return a.length === b.length && a.every(function (x, i) { return isFinite(x) && isFinite(b[i]) && ex.eq(x, b[i], 1e-8); }); }
  /* The answer checker. keyTex: the answer in simplest form. o.vars: letters; o.env / o.shift: sample values;
   * o.cands: [{ tex, code, hint }] known wrong answers (matched by value); o.form: false skips the form check;
   * o.diag(ast, vals) -> {code, hint} | null. */
  R.check = function (keyTex, o) {
    o = o || {};
    var kp = ex.parse(keyTex); if (!kp.ok) throw new Error(LID + ' kit: bad key ' + keyTex);
    var vars = o.vars || Object.keys(ex.shape(kp.ast).vars).sort(), E = envs(vars, o), KV = evalAt(kp.ast, E);
    if (KV.some(function (v) { return !isFinite(v); })) throw new Error(LID + ' kit: key undefined at a sample point ' + keyTex);
    var cands = (o.cands || []).map(function (c) { var p = ex.parse(c.tex); if (!p.ok) throw new Error('bad cand ' + c.tex); return { v: evalAt(p.ast, E), code: c.code, hint: c.hint }; }).filter(function (c) { return !sameVals(c.v, KV); });
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var sv = Object.keys(ex.shape(a.ast).vars).filter(function (v) { return vars.indexOf(v) < 0; });
      if (sv.length) return wrong('var', 'Your answer has a variable ' + t(sv[0]) + ' that isn’t in the question.');
      var V = evalAt(a.ast, E), sh = ex.shape(a.ast);
      if (sameVals(V, KV)) {
        if (o.form === false) return ok();
        var iss = R.formIssue(a.ast, E);
        return iss ? form(iss[0], iss[1] || 'Right value — now simplify it all the way (simplest radical form, like terms collected).') : ok();
      }
      if (sh.decimals && !vars.length && Math.abs(V[0] - KV[0]) < 0.02 * Math.max(1, Math.abs(KV[0]))) return form('decimal', 'That’s a decimal approximation. Give the <b>exact</b> answer, with radicals, in simplest form.');
      for (var i = 0; i < cands.length; i++) if (sameVals(V, cands[i].v)) return wrong(cands[i].code, cands[i].hint);
      var h = o.diag ? o.diag(a.ast, V) : null; if (h) return wrong(h.code, h.hint);
      if (sameVals(V, KV.map(function (x) { return -x; })) && KV[0] !== 0) return wrong('sign', 'Check the signs — your answer is the opposite of the right one.');
      return wrong('value', null);
    };
  };

  /* ---------------- restrictions: "x ≥ 0, y ≥ 0" or no restriction ---------------- */
  function normRel(s) {
    return String(s == null ? '' : s).replace(/\\left|\\right/g, '').replace(/\\(text|mathrm|textrm|operatorname)\{([^{}]*)\}/g, ' $2 ')
      .replace(/\\geq?(?![a-zA-Z])|≥|>=|\\geqslant/g, '≥').replace(/\\leq?(?![a-zA-Z])|≤|<=|\\leqslant/g, '≤').replace(/\\gt(?![a-zA-Z])/g, '>').replace(/\\lt(?![a-zA-Z])/g, '<')
      .replace(/\\[,;:! ]|\\quad|\\qquad|~/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function isNone(s) { return /^(none|no ?restrictions?|nothing|n\/a|all reals?|all real numbers|any real numbers?|[a-z] ?(\\in|∈) ?(\\mathbb\{?R\}?|ℝ|R|\\R)( ?, ?[a-z] ?(\\in|∈) ?(\\mathbb\{?R\}?|ℝ|R|\\R))*|([a-z] ?, ?)*[a-z] ?(\\in|∈) ?(\\mathbb\{?R\}?|ℝ|R|\\R))\.?$/i.test(s.trim()); }
  R.parseRestr = function (resp) {
    var s = normRel(resp);
    if (!s) return { empty: true };
    if (isNone(s)) return { none: true };
    var parts = s.split(/\s*(?:,|;|\band\b|&)\s*/).filter(function (x) { return x; }), out = {}, pend = [];
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].replace(/\s/g, '');
      if (/^[a-z]$/.test(p)) { pend.push(p); continue; }
      var m = /^([a-z])(≥|≤|>|<|=)(.+)$/.exec(p), flip = false;
      if (!m) { var m2 = /^(.+)(≥|≤|>|<|=)([a-z])$/.exec(p); if (m2) { m = [p, m2[3], m2[2], m2[1]]; flip = true; } }
      if (!m) return { bad: true };
      var op = m[2]; if (flip) op = { '≥': '≤', '≤': '≥', '>': '<', '<': '>', '=': '=' }[op];
      var pv = ex.parse(m[3]); if (!pv.ok) return { bad: true };
      var val = ex.value(pv.ast); if (!isFinite(val)) return { bad: true };
      [m[1]].concat(pend).forEach(function (v) { out[v] = { op: op, v: val }; }); pend = [];
    }
    if (pend.length) return { bad: true };
    return { set: out };
  };
  /* want: { x: 0, y: 0 } (each variable ≥ the value) or null (no restriction). o.hint: why (shown for a wrong value) */
  R.restrCheck = function (want, o) {
    o = o || {};
    var wv = want ? Object.keys(want).sort() : [];
    return function (resp) {
      var p = R.parseRestr(resp);
      if (p.empty) return form('empty', 'State the restriction (for example ' + t('x\\ge 0') + '), or press <b>none</b> if there isn’t one.');
      if (p.bad) return form('u2l3-restr-read', 'Write the restriction as an inequality, e.g. ' + t('x\\ge 0') + ' or ' + t('x\\ge 0,\\ y\\ge 0') + ' (or press <b>none</b>).');
      if (!want) {
        if (p.none) return ok();
        return wrong('u2l3-restr-odd', 'Every radical here is a cube root (odd index), and a cube root is defined for every real number — there is no restriction.');
      }
      if (p.none) return wrong('u2l3-restr-none', 'There is a square root (even index), so its radicand must be ' + t('\\ge 0') + '. ' + (o.hint || ''));
      var got = Object.keys(p.set);
      var extra = got.filter(function (v) { return wv.indexOf(v) < 0; });
      if (extra.length) return wrong('u2l3-restr-var', t(extra[0]) + ' isn’t a variable in this question.');
      var miss = wv.filter(function (v) { return got.indexOf(v) < 0; });
      if (miss.length) return wrong('u2l3-restr-missing', 'State a restriction for each variable: ' + t(miss[0]) + ' is missing. ' + (o.hint || ''));
      for (var i = 0; i < wv.length; i++) {
        var g = p.set[wv[i]];
        if (g.op === '=') return wrong('u2l3-restr-eq', 'A restriction is an inequality: the values that are allowed, e.g. ' + t(wv[i] + '\\ge ' + F(want[wv[i]])) + '.');
        if (g.op === '≤' || g.op === '<') return wrong('u2l3-restr-dir', 'Check the direction of the inequality: the radicand must be ' + t('\\ge 0') + '. ' + (o.hint || ''));
        if (!ex.eq(g.v, want[wv[i]]) && !(g.v === 0 && want[wv[i]] === 0)) return wrong('u2l3-restr-value', 'Check the value: set each radicand ' + t('\\ge 0') + ' and solve. ' + (o.hint || ''));
        if (g.op === '>') return wrong('u2l3-restr-strict', 'Use ' + t('\\ge') + ', not ' + t('>') + ': a radicand of ' + t('0') + ' is allowed (' + t('\\sqrt{0}=0') + ').');
      }
      return ok();
    };
  };
  R.restrTex = function (want) {
    if (!want) return '\\text{no restriction}';
    return Object.keys(want).sort().map(function (v) { return v + '\\ge ' + F(want[v]); }).join(',\\ ');
  };
  R.restrKey = function (want) { if (!want) return 'none'; return Object.keys(want).sort().map(function (v) { return v + '\\ge ' + want[v]; }).join(', '); };

  /* ---------------- codes ---------------- */
  var CODES = {
    'u2l3-expand': 'Left brackets unexpanded', 'u2l3-power': 'Left a power unevaluated', 'u2l3-rad-den': 'Radical in a denominator', 'u2l3-dec-coef': 'Decimal coefficient',
    'u2l3-one-root': 'Left a product of radicals', 'u2l3-frac-rad': 'Fraction under a radical', 'u2l3-neg-rad': 'Negative left under an odd root', 'u2l3-brackets': 'Left brackets after a minus sign',
    'u2l3-like': 'Like radicals not collected', 'u2l3-like-rat': 'Rational terms not collected',
    'u2l3-restr-read': 'Restriction not written as an inequality', 'u2l3-restr-odd': 'Gave a restriction for an odd root', 'u2l3-restr-none': 'Said “no restriction” for a square root',
    'u2l3-restr-var': 'Restriction on a variable that isn’t there', 'u2l3-restr-missing': 'Restriction missing for a variable', 'u2l3-restr-eq': 'Restriction written as an equation',
    'u2l3-restr-dir': 'Restriction in the wrong direction', 'u2l3-restr-value': 'Wrong value in the restriction', 'u2l3-restr-strict': 'Used > instead of ≥',
    'u2l3-add-rad': 'Added (or subtracted) the radicands', 'u2l3-coef-sq': 'Took the perfect square out without its root', 'u2l3-coef-skip': 'Dropped the coefficient in front',
    'u2l3-unlike': 'Combined unlike radicals', 'u2l3-coef-sum': 'Slip adding the coefficients', 'u2l3-rat-into-rad': 'Added a rational term to a radical',
    'u2l3-index': 'Combined radicals with different indices', 'u2l3-frac-coef': 'Slip with a fraction coefficient', 'u2l3-perim-half': 'Gave half the perimeter (forgot to double)',
    'u2l3-perim-side': 'Gave one side instead of the perimeter', 'u2l3-width-half': 'Forgot to halve the perimeter', 'u2l3-width-brackets': 'Subtracted only the first term of a side',
    'u2l3-len-noroot': 'Gave the square of a length', 'u2l3-len-legs': 'Added the run and rise for a length', 'u2l3-solve-step': 'Stopped before dividing',
    'u2l3-solve-sign': 'Sign slip moving a term', 'u2l3-d-back': 'Subtracted the terms the wrong way round', 'u2l3-tn-n': 'Used n steps instead of n − 1',
    'u2l3-k-sum': 'Added the radicands', 'u2l3-list-miss': 'Missed some values', 'u2l3-list-extra': 'Listed a value that doesn’t work',
    'u2l3-k-root': 'Gave the coefficient instead of the radicand', 'u2l3-perfect-rad': 'Left a perfect-square root'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u2l3-coef-sq': 'b', 'u2l3-coef-skip': 'b', 'u2l3-coef-sum': 's', 'u2l3-frac-coef': 's', 'u2l3-perim-half': 'b', 'u2l3-perim-side': 'b',
    'u2l3-width-half': 'b', 'u2l3-width-brackets': 's', 'u2l3-len-noroot': 'b', 'u2l3-solve-step': 'b', 'u2l3-solve-sign': 's', 'u2l3-d-back': 's', 'u2l3-tn-n': 's',
    'u2l3-restr-strict': 's', 'u2l3-restr-missing': 's', 'u2l3-restr-dir': 'b', 'u2l3-restr-value': 'b', 'u2l3-restr-odd': 'b', 'u2l3-restr-none': 'b', 'u2l3-restr-eq': 's',
    'u2l3-add-rad': 'n', 'u2l3-unlike': 'n', 'u2l3-index': 'n', 'u2l3-rat-into-rad': 'n', 'u2l3-k-sum': 'n', 'u2l3-k-root': 'b', 'u2l3-list-miss': 's', 'u2l3-list-extra': 'b' });

  /* ---------------- keypad (browser only): roots, + and −, letters, ≥ ---------------- */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var dg = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KK = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      enter: { label: 'Check ↵', fn: 'enter', wide: true }, sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' }, cbrt: { label: '∛', tex: '\\sqrt[3]{#0}', plain: 'cbrt(', title: 'Cube root' },
      nrt: { label: '<sup>n</sup>√', tex: '\\sqrt[#?]{#0}', plain: '\\sqrt[]{}', title: 'Root with any index' }, frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' },
      pow: { label: 'x<sup>n</sup>', tex: '#@^{#?}', plain: '^', title: 'Exponent' }, plus: { label: '+', tex: '+', plain: '+' }, minus: { label: '−', tex: '-', plain: '-' },
      times: { label: '×', tex: '\\times', plain: ' × ', title: 'Multiply' }, ge: { label: '≥', tex: '\\ge ', plain: '>=', title: 'Greater than or equal to' }, le: { label: '≤', tex: '\\le ', plain: '<=', title: 'Less than or equal to' },
      comma: { label: ',', tex: ',', plain: ',' }, dot: { label: '.', tex: '.', plain: '.' } };
    W.KEYSETS.p23rad = [[dg(7), dg(8), dg(9), KK.sqrt, KK.cbrt, KK.del], [dg(4), dg(5), dg(6), KK.nrt, KK.frac, KK.clear], [dg(1), dg(2), dg(3), KK.plus, KK.minus, KK.left], [dg(0), KK.times, KK.right, KK.enter]];
    W.KEYSETS.p23var = function (opt) {
      var vs = (opt && opt.vars && opt.vars.length ? opt.vars : ['x']).slice(0, 4).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; });
      var rel = opt && opt.rel === false ? [] : [KK.ge, KK.le, KK.comma];
      return [[dg(7), dg(8), dg(9), KK.sqrt, KK.cbrt, KK.nrt, KK.del], [dg(4), dg(5), dg(6), KK.plus, KK.minus, KK.times, KK.clear], [dg(1), dg(2), dg(3), KK.frac, KK.pow, KK.left, KK.right],
        vs.concat(rel), [dg(0), KK.enter]];
    };
    if (W.KEYHELP) {
      W.KEYHELP.p23rad = ['Use <b>√</b>, <b>∛</b> or <b><sup>n</sup>√</b> for roots and <b>+</b>/<b>−</b> between terms, e.g. 5 √ 2 + 3 for ' + HW.k('5\\sqrt{2}+3') + '. Press <b>▶</b> to step out of a root.',
        'Type roots as <code>5sqrt(2) + 3</code> or <code>2cbrt(4)</code>.'];
      W.KEYHELP.p23var = ['Type the number, then the letters, then the root, e.g. 3, x, √, 2, x for ' + HW.k('3x\\sqrt{2x}') + '. Press <b>▶</b> to step out of a root. Write a restriction like ' + HW.k('x\\ge 0,\\ y\\ge 0') + ', or press <b>none</b>.',
        'Type e.g. <code>3x sqrt(2x)</code>; a restriction as <code>x >= 0, y >= 0</code> or <code>none</code>.'];
    }
  }

  /* ---------------- part builders ---------------- */
  /* a constant answer (sum of radicals) in simplest form */
  R.part = function (prompt, keyTex, o) {
    o = o || {};
    var p = B.math(prompt, R.check(keyTex, o), keyTex, o.sol, o.hints || [], o.text, { keys: o.vars && o.vars.length ? 'p23var' : 'p23rad', vars: o.vars, rel: false, before: o.before, after: o.after, placeholder: o.vars && o.vars.length ? 'e.g. 3x sqrt(2x) + 5' : 'e.g. 5sqrt(2) + 3' });
    if (o.unit || o.after) p.answer = t(keyTex) + ' ' + (o.unit || o.after);
    var kv = R.envs(o.vars || [], o).map(function (e) { return ex.value(ex.parse(keyTex).ast, e); });
    p.bad = (o.cands || []).map(function (c) { return c.tex; }).concat(o.bad || []).filter(function (b) { var pb = ex.parse(b); if (!pb.ok) return true; var bv = R.envs(o.vars || [], o).map(function (e) { return ex.value(pb.ast, e); }); return !bv.every(function (x, i) { return ex.eq(x, kv[i], 1e-8); }); });
    p.good = o.good;
    return p;
  };
  /* an expression with variables + its restriction (two boxes) */
  R.partR = function (prompt, keyTex, want, o) {
    o = o || {};
    var vars = o.vars || Object.keys(ex.shape(ex.parse(keyTex).ast).vars).sort();
    var fields = [{ label: o.label || 'Simplified:', name: 'Expression', mode: 'math', keys: 'p23var', vars: vars, placeholder: 'e.g. 3x sqrt(2x)' }, { label: 'Restriction:', name: 'Restriction', mode: 'math', keys: 'p23var', vars: vars, none: true, placeholder: 'e.g. x >= 0, or none' }];
    var p = B.fields(prompt, fields, [R.check(keyTex, Object.assign({}, o, { vars: vars })), R.restrCheck(want, { hint: o.rHint })], [keyTex, R.restrKey(want)],
      'Simplified: ' + t(keyTex) + '<br>Restriction: ' + t(R.restrTex(want)), o.sol, o.hints || [], o.text);
    var kv = R.envs(vars, o).map(function (e) { return ex.value(ex.parse(keyTex).ast, e); });
    p.bad = (o.cands || []).filter(function (c) { var pb = ex.parse(c.tex); return !pb.ok || !R.envs(vars, o).every(function (e, i) { return ex.eq(ex.value(pb.ast, e), kv[i], 1e-8); }); }).map(function (c) { return [c.tex, R.restrKey(want)]; }).concat([[keyTex, want ? 'none' : 'x\\ge 0']]).concat(o.bad || []);
    p.good = [[keyTex, want ? Object.keys(want).sort().map(function (v) { return F(want[v]) + '\\le ' + v; }).join(', ') : 'x\\in\\mathbb{R}']];
    if (want && Object.keys(want).length === 2) { var vv = Object.keys(want).sort(); if (want[vv[0]] === want[vv[1]]) p.good.push([keyTex, vv.join(',') + '\\ge ' + want[vv[0]]]); }
    return p;
  };
  /* several boxes: specs [{ label, name, key, check | (key + o for R.check), vars }] */
  R.fieldsPart = function (prompt, specs, o) {
    o = o || {};
    var fields = specs.map(function (s) { return { label: s.label, name: s.name || String(s.label || '').replace(/<[^>]+>|\\\(|\\\)/g, ''), mode: 'math', keys: s.keys || (s.vars && s.vars.length ? 'p23var' : 'p23rad'), vars: s.vars, before: s.before, after: s.after, none: s.none, placeholder: s.check && s.none ? 'e.g. x >= 0, or none' : 'e.g. 5sqrt(2) + 3' }; });
    var checks = specs.map(function (s) { return s.check || R.check(s.key, s); });
    var p = B.fields(prompt, fields, checks, specs.map(function (s) { return s.key; }), specs.map(function (s) { return (s.label ? s.label + ' ' : '') + (s.before || '') + t(s.ansTex || s.key) + (s.after ? ' ' + s.after : ''); }).join('<br>'), o.sol, o.hints || [], o.text);
    p.bad = o.bad; p.good = o.good;
    return p;
  };
  R.mcPart = function (r, prompt, opts, sol, hints, text, keepOrder) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k] && !op.right) return; seen[k] = 1; out.push(op); });
    return B.mc(r, prompt, out, sol, hints || [], text, keepOrder);
  };
  R.nrPart = function (prompt, ans, cands, sol, hints, text) {
    var diag = function (v) { for (var i = 0; i < (cands || []).length; i++) if (Math.abs(v - cands[i][0]) < 1e-9) return { code: cands[i][1], hint: cands[i][2] }; return null; };
    var p = B.nr(prompt, ans, diag, sol, hints, text);
    p.bad = (cands || []).filter(function (c) { return Math.abs(c[0] - ans) > 1e-9; }).map(function (c) { return String(c[0]); });
    return p;
  };

  /* ---------------- figures ---------------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  /* a plain-text radical label: c√m, ∛ etc. (for SVG figures) */
  R.lab = function (c, n, m) {
    var rs = n === 2 ? '√' : n === 3 ? '∛' : n === 4 ? '∜' : '√';
    return (c === 1 || c === '' ? '' : String(c)) + rs + m;
  };
  R.rectFig = function (wLab, hLab, o) {
    o = o || {}; var W0 = o.square ? 120 : 190, H0 = o.square ? 120 : 92, x0 = 20, y0 = 14;
    var s = '<rect x="' + x0 + '" y="' + y0 + '" width="' + W0 + '" height="' + H0 + '" fill="#f6f4ef" stroke="#2b3340" stroke-width="2"/>';
    s += '<text x="' + (x0 + W0 / 2) + '" y="' + (y0 + H0 + 20) + '" font-size="15" text-anchor="middle" fill="#1c2230">' + esc(wLab) + '</text>';
    if (hLab) s += '<text x="' + (x0 + W0 + 8) + '" y="' + (y0 + H0 / 2 + 5) + '" font-size="15" fill="#1c2230">' + esc(hLab) + '</text>';
    var Wt = x0 + W0 + (hLab ? 16 + 8.5 * hLab.length : 20), Ht = y0 + H0 + 30;
    return '<svg class="fig-svg" viewBox="0 0 ' + Wt + ' ' + Ht + '" style="max-width:' + Wt + 'px" role="img" aria-label="' + esc(o.aria || 'rectangle') + '">' + s + '</svg>';
  };
  /* a triangle with three side labels (base, left, right) */
  R.triFig = function (base, left, right, o) {
    o = o || {};
    var dx = o.right ? 110 : 0, A = [40 + dx, 130], Bp = [250 + dx, 130], C = [(o.apex || 110) + dx, 24];
    var s = '<polygon points="' + [A, Bp, C].map(function (p) { return p.join(','); }).join(' ') + '" fill="#f6f4ef" stroke="#2b3340" stroke-width="2"/>';
    if (o.right) s += '<polyline points="' + (C[0]) + ',' + (A[1] - 12) + ' ' + (C[0] + 12) + ',' + (A[1] - 12) + ' ' + (C[0] + 12) + ',' + A[1] + '" fill="none" stroke="#2b3340" stroke-width="1.4"/>';
    s += '<text x="' + ((A[0] + Bp[0]) / 2) + '" y="' + (A[1] + 22) + '" font-size="15" text-anchor="middle" fill="#1c2230">' + esc(base) + '</text>';
    s += '<text x="' + ((A[0] + C[0]) / 2 - 8) + '" y="' + ((A[1] + C[1]) / 2) + '" font-size="15" text-anchor="end" fill="#1c2230">' + esc(left) + '</text>';
    s += '<text x="' + ((Bp[0] + C[0]) / 2 + 10) + '" y="' + ((Bp[1] + C[1]) / 2) + '" font-size="15" fill="#1c2230">' + esc(right) + '</text>';
    return '<svg class="fig-svg" viewBox="0 0 ' + (330 + dx) + ' 160" style="max-width:' + (330 + dx) + 'px" role="img" aria-label="' + esc(o.aria || 'triangle') + '">' + s + '</svg>';
  };

  /* ============================== Lesson 3 helpers ============================== */
  var SQ = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];          // square-free cores
  var CU = [2, 3, 4, 5, 6, 7, 9, 10];                    // cube-free cores
  function rt(n, m) { return R.rt(n, m); }
  function nm(n) { return n === 2 ? 'square' : n === 3 ? 'cube' : 'fourth'; }
  var H_LIKE = ['Like radicals have the same index and the same radicand. Add or subtract the coefficients and keep the radical, like ' + t('4x+3x=7x') + '.', 'Never add the radicands: ' + t('\\sqrt{a}+\\sqrt{b}\\ne\\sqrt{a+b}') + '.'];
  var H_SIMP = ['First write every radical as a mixed radical in simplest form (take out the largest perfect-square factor).', 'Then combine the like radicals; unlike radicals stay as separate terms.'];
  var H_CUBE = ['Look for perfect cubes (' + t('8,\\ 27,\\ 64,\\ 125') + ') or perfect fourth powers (' + t('16,\\ 81,\\ 256') + ') under the root.', 'Only radicals with the same index and radicand combine.'];
  /* the classic wrong answers for a sum of entire radicals (question terms ents) */
  function entCands(ents) {
    var out = [], n0 = ents[0].n, same = ents.every(function (e) { return e.n === n0; });
    var allOne = ents.every(function (e) { return Math.abs(e.c[0]) === 1 && e.c[1] === 1; });
    if (same && allOne) {
      var S = ents.reduce(function (s, e) { return s + (e.c[0] < 0 ? -1 : 1) * e.E; }, 0);
      if (S > 0 && S < 1e6) out.push({ tex: rt(n0, S), code: 'u2l3-add-rad', hint: 'You can’t add or subtract the numbers under the roots: ' + t('\\sqrt{a}+\\sqrt{b}\\ne\\sqrt{a+b}') + '. Simplify each radical first, then combine the like radicals.' });
    }
    if (ents.some(function (e) { return ex.nthFactor(e.E, e.n) > 1; })) {
      var sq = R.sum(ents.map(function (e) { var f = ex.nthFactor(e.E, e.n); return T(qmul(e.c, [Math.pow(f, e.n), 1]), e.n, e.E / Math.pow(f, e.n)); }));
      out.push({ tex: R.tex(sq), code: 'u2l3-coef-sq', hint: 'A perfect ' + powName(n0) + ' factor comes out of the radical as its <b>root</b>: ' + t(rt(n0, Math.pow(2, n0)) + '=2') + ', not ' + t(Math.pow(2, n0)) + '.' });
    }
    if (ents.some(function (e) { return !(Math.abs(e.c[0]) === 1 && e.c[1] === 1); })) {
      var sk = R.sum(ents.map(function (e) { return T(e.c[0] < 0 ? -1 : 1, e.n, e.E); }));
      out.push({ tex: R.tex(sk), code: 'u2l3-coef-skip', hint: 'Don’t lose the number in front: ' + t('3\\sqrt{20}=3\\left(2\\sqrt{5}\\right)=6\\sqrt{5}') + '. Multiply it by the number that comes out of the radical.' });
    }
    return out;
  }
  /* a "simplify this sum of entire radicals" part */
  function entPart(ents, o) {
    o = o || {};
    var q = R.entsTex(ents), ans = R.sum(ents.map(R.entTerm)), key = R.tex(ans);
    var steps = ents.filter(function (e) { return ex.nthFactor(e.E, e.n) > 1; }).map(function (e) { return t(R.simpStep(e.n, e.E)); });
    var mid = R.entMid(ents), mid2 = R.entSimpList(ents);
    var sol = (steps.length ? 'Simplify each radical: ' + steps.join(', &nbsp;') + '.<br>' : '') + t(q + '=' + mid + (mid2 !== mid ? '=' + mid2 : '') + '=' + key) + (o.note ? '<br>' + o.note : '');
    return R.part((o.pre || '') + t(q), key, { sol: sol, hints: o.hints || H_SIMP, text: o.text || 'simplify ' + q, cands: entCands(ents).concat(o.cands || []) });
  }
  function avoidQ(ents, list) { var q = R.entsTex(ents); return list.indexOf(q) < 0; }
  /* like radicals already simplified: terms [{c, n, m}] and rational terms (n = 1) */
  function likePart(list, o) {
    o = o || {};
    var q = list.map(function (u, i) { return R.termTex(u, i === 0); }).join(''), ans = R.sum(list), key = R.tex(ans);
    var groups = {}; list.forEach(function (u) { var k = u.n + '|' + u.m; (groups[k] = groups[k] || []).push(u); });
    var gt = Object.keys(groups).map(function (k) { var g = groups[k], u0 = g[0];
      var cs = g.map(function (u, i) { var v = qv(u.c); return i === 0 ? F(v) : v < 0 ? '-' + F(-v) : '+' + F(v); }).join('');
      return '\\left(' + cs + '\\right)' + (u0.n === 1 ? '' : rt(u0.n, u0.m)); });
    var sol = t(q + '=' + gt.join('+').replace(/\+\\left\(-/g, '+\\left(-') + '=' + key) + (o.note ? '<br>' + o.note : '');
    var cands = [];
    var radSum = list.filter(function (u) { return u.n === 2; });
    if (radSum.length >= 2 && Object.keys(groups).length === 1) {
      var S = radSum.length * radSum[0].m, C = ans.length ? ans[0].c : [0, 1];
      if (radSum.every(function (u) { return u.c[0] > 0; }) && C[0] !== 0) cands.push({ tex: R.tex([T(C, 1, 1)]) + '\\sqrt{' + S + '}', code: 'u2l3-add-rad', hint: 'Keep the radical part the same: only the coefficients add, like ' + t('8x-3x=5x') + ' (not ' + t('5x^{2}') + ').' });
    }
    if (Object.keys(groups).length > 1 && ans.length > 1) {
      var tot = ans.reduce(function (s, u) { return qadd(s, u.c); }, [0, 1]);
      var u1 = ans.filter(function (u) { return u.n > 1; })[0];
      if (u1 && tot[0]) cands.push({ tex: R.tex([T(tot, u1.n, u1.m)]), code: 'u2l3-unlike', hint: 'Only like radicals combine. ' + (ans.some(function (u) { return u.n === 1; }) ? 'A rational term (no radical) can’t join a radical term.' : 'Different radicands stay as separate terms.') });
    }
    return R.part((o.pre || '') + t(q), key, { sol: sol, hints: o.hints || H_LIKE, text: o.text || 'combine ' + q, cands: cands.concat(o.cands || []), vars: o.vars });
  }
  function L(c, n, m) { return T(c, n, m); } // a like-radical term (already simplest)
  function distinct(arr) { return arr.every(function (x, i) { return arr.indexOf(x) === i; }); }

  /* ---------- Q2(b) / like-pairs table ---------- */
  function likePairs(r, count) {
    var kinds = r.shuffle(['sq', 'sq', 'cu', 'swap', 'index', 'diff', 'sq2']).slice(0, count);
    if (!kinds.some(function (k) { return k === 'swap' || k === 'index' || k === 'diff'; })) kinds[count - 1] = 'swap';
    if (!kinds.some(function (k) { return k === 'sq' || k === 'cu' || k === 'sq2'; })) kinds[0] = 'sq';
    var used = {};
    return kinds.map(function (k, i) {
      return pickWhere(function () {
        var m, a, b, p, q;
        if (k === 'sq' || k === 'sq2') { m = r.pick([2, 3, 5, 6, 7]); var ab = r.sample([1, 2, 3, 4, 5], 2); a = ab[0]; b = ab[1]; if (a === 1 && k === 'sq') a = 6 - b; return { k: k, A: rt(2, a * a * m), Bt: rt(2, b * b * m), like: true, why: t(R.simpStep(2, a * a * m)) + ' and ' + t(R.simpStep(2, b * b * m)) + ': same radicand.' }; }
        if (k === 'cu') { m = r.pick([2, 3, 5]); var cd = r.sample([1, 2, 3, 4], 2); return { k: k, A: rt(3, Math.pow(cd[0], 3) * m), Bt: rt(3, Math.pow(cd[1], 3) * m), like: true, why: t(R.simpStep(3, Math.pow(cd[0], 3) * m)) + ' and ' + t(R.simpStep(3, Math.pow(cd[1], 3) * m)) + ': same index and radicand.' }; }
        if (k === 'swap') { var pq = r.sample([2, 3, 5, 6, 7], 2); p = pq[0]; q = pq[1]; return { k: k, A: p + rt(2, q), Bt: q + rt(2, p), like: false, why: 'Radicands ' + t(q) + ' and ' + t(p) + ' are different.' }; }
        if (k === 'index') { m = r.pick([2, 3, 5, 6, 7]); return { k: k, A: rt(2, m), Bt: rt(3, m), like: false, why: 'Indices ' + t(2) + ' and ' + t(3) + ' are different.' }; }
        var mm = r.sample([2, 3, 5], 2), f1 = r.pick([2, 3]), f2 = r.pick([2, 3]);
        return { k: k, A: rt(2, f1 * f1 * mm[0]), Bt: rt(2, f2 * f2 * mm[1]), like: false, why: t(R.simpStep(2, f1 * f1 * mm[0])) + ' and ' + t(R.simpStep(2, f2 * f2 * mm[1])) + ': different radicands.' };
      }, function (o) { var key = o.A + o.Bt; if (used[key] || o.A === o.Bt) return false; used[key] = 1; return true; });
    });
  }

  /* ---------- grid triangle ---------- */
  function triOnGrid(r, avoid) {
    return pickWhere(function () {
      var P = [r.int(-5, -1), r.int(-3, 3)], Qp = [r.int(0, 4), r.int(-4, 4)], Rp = [r.int(-3, 3), r.int(-4, 4)];
      return { P: P, Q: Qp, R: Rp };
    }, function (o) {
      var pts = [o.P, o.Q, o.R];
      var cross = (o.Q[0] - o.P[0]) * (o.R[1] - o.P[1]) - (o.Q[1] - o.P[1]) * (o.R[0] - o.P[0]); if (Math.abs(cross) < 4) return false;
      var d = [[o.P, o.Q], [o.Q, o.R], [o.P, o.R]].map(function (s) { var dx = s[1][0] - s[0][0], dy = s[1][1] - s[0][1]; return dx * dx + dy * dy; });
      if (d.some(function (x) { return ex.simplest(x, 2) && Math.sqrt(x) % 1; })) { /* allow one unsimplifiable side at most */ if (d.filter(function (x) { return ex.simplest(x, 2) && Math.sqrt(x) % 1; }).length > 1) return false; }
      if (d.some(function (x) { var s = Math.sqrt(x); return s === Math.round(s); })) return false;
      if (d.some(function (x) { return x > 90; })) return false;
      var cores = d.map(function (x) { return x / Math.pow(ex.nthFactor(x, 2), 2); });
      if (distinct(cores)) return false; // at least two sides are like radicals
      var key = JSON.stringify(pts); if ((avoid || []).indexOf(key) >= 0) return false;
      return pts.every(function (p) { return Math.abs(p[0]) <= 5 && Math.abs(p[1]) <= 4; });
    });
  }
  function lenLine(nameA, nameB, A, Bp) {
    var dx = Math.abs(Bp[0] - A[0]), dy = Math.abs(Bp[1] - A[1]), s = dx * dx + dy * dy;
    return t(nameA + nameB) + ': run ' + t(dx) + ', rise ' + t(dy) + ': ' + t('\\sqrt{' + dx * dx + '+' + dy * dy + '}=' + R.simpStep(2, s));
  }
  function segLen2(A, Bp) { var dx = Bp[0] - A[0], dy = Bp[1] - A[1]; return dx * dx + dy * dy; }
  function triPerimPart(names, pts, prompt, o) {
    o = o || {};
    var sides = [[0, 1], [1, 2], [0, 2]].map(function (s) { return segLen2(pts[s[0]], pts[s[1]]); });
    var ans = R.sum(sides.map(function (x) { return T(1, 2, x); })), key = R.tex(ans);
    var sol = [[0, 1], [1, 2], [0, 2]].map(function (s) { return lenLine(names[s[0]], names[s[1]], pts[s[0]], pts[s[1]]); }).join('<br>') + '<br>' + t('P=' + sides.map(function (x, i) { return R.termTex(T(1, 2, x), i === 0); }).join('') + '=' + key) + '&nbsp;units';
    var legs = [[0, 1], [1, 2], [0, 2]].reduce(function (s, sd) { return s + Math.abs(pts[sd[1]][0] - pts[sd[0]][0]) + Math.abs(pts[sd[1]][1] - pts[sd[0]][1]); }, 0);
    var sq = sides.reduce(function (s, x) { return s + x; }, 0);
    return R.part(prompt, key, { sol: sol, text: o.text || 'perimeter of a triangle on a grid', after: 'units',
      hints: ['Each side is the hypotenuse of a right triangle: length ' + t('=\\sqrt{(\\text{run})^{2}+(\\text{rise})^{2}}') + '.', 'Simplify each length, then add the like radicals.'],
      cands: [{ tex: String(legs), code: 'u2l3-len-legs', hint: 'You added the runs and rises. Each side is a hypotenuse: ' + t('\\sqrt{(\\text{run})^{2}+(\\text{rise})^{2}}') + '.' },
        { tex: String(sq), code: 'u2l3-len-noroot', hint: 'Those are the squares of the lengths. Take the square root of each, simplify, then add.' }] });
  }

  /* ============================== the assignment ============================== */
  var EX_Q3 = ['\\sqrt{48}+\\sqrt{75}', '\\sqrt{28}+\\sqrt{63}', '\\sqrt{200}-\\sqrt{72}', '3\\sqrt{20}-\\sqrt{125}', '\\sqrt{44}+2\\sqrt{99}-\\sqrt{176}', '4\\sqrt{54}-2\\sqrt{24}-\\sqrt{150}', '-2\\sqrt{243}+5\\sqrt{48}', '3\\sqrt{8}-\\sqrt{50}+\\sqrt{18}', '2\\sqrt{72}-3\\sqrt{32}+\\sqrt{98}', '\\sqrt{12}+\\sqrt{75}', '\\sqrt{99}-\\sqrt{44}', '2\\sqrt{45}+\\sqrt{80}', '\\sqrt{162}-2\\sqrt{32}+\\sqrt{8}'];
  function sqEnt(r, o) { // two/three entire square roots sharing a core
    o = o || {};
    return pickWhere(function () {
      var m = r.pick(o.cores || SQ), fs = r.sample(o.fs || [2, 3, 4, 5, 6, 7], o.k || 2), cs = (o.cs || []).map(function (c) { return typeof c === 'function' ? c() : c; });
      return fs.map(function (f, i) { return R.ent(cs[i] == null ? 1 : cs[i], 2, f, m); });
    }, function (ents) {
      var ans = R.sum(ents.map(R.entTerm));
      if (!ans.length || ents.some(function (e) { return e.E > (o.max || 300); })) return false;
      if (o.ok && !o.ok(ents, ans)) return false;
      return avoidQ(ents, EX_Q3.concat(o.avoid || []));
    });
  }
  function sgn(r) { return r.int(0, 1) ? 1 : -1; }

  var QUESTIONS = [
    { num: '1', section: 'Combining like radicals', stem: 'Simplify by combining like radicals.', parts: [
      { id: '1a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { var b = r.int(2, 6); return { m: r.pick([2, 3, 5, 6, 7, 10, 11]), a: r.int(b + 1, 12), b: b }; }, function (o) { return !(o.m === 6 && o.a === 8 && o.b === 3) && !(o.m === 5 && o.a === 6); });
        return likePart([L(o.a, 2, o.m), L(-o.b, 2, o.m)], { cands: [{ tex: (o.a + o.b) + rt(2, o.m), code: 'u2l3-coef-sum', hint: 'It’s a subtraction: ' + t(o.a + '-' + o.b) + '.' }] });
      } },
      { id: '1b', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([3, 5, 6, 7, 10, 11, 13, 14, 15]), a: r.int(2, 8), b: r.int(2, 9), c: r.int(8, 15) }; }, function (o) { return o.a + o.b - o.c < 0 && o.a + o.b - o.c !== -1 && !(o.m === 13) && !(o.m === 15 && o.a === 2 && o.b === 7); });
        return likePart([L(o.a, 2, o.m), L(o.b, 2, o.m), L(-o.c, 2, o.m)]);
      } },
      { id: '1c', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 4, 5, 7, 9, 10]), a: r.int(2, 7), c: r.int(5, 12) }; }, function (o) { return o.a + 1 - o.c < -1 && !(o.m === 6) && !(o.m === 5 && o.a === 4 && o.c === 9); });
        return likePart([L(o.a, 3, o.m), L(1, 3, o.m), L(-o.c, 3, o.m)], { hints: ['These are cube roots of the same number: like radicals. Combine the coefficients and keep ' + t(rt(3, o.m)) + '.', 'A radical with no number in front has coefficient ' + t(1) + '.'] });
      } },
      { id: '1d', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7, 10, 11], 2); return { p: pq[0], q: pq[1], a: r.int(2, 9), b: r.int(2, 6), c: r.int(5, 10) }; }, function (o) { return o.c !== o.b && !(o.p === 2 && o.q === 7 && o.a === 6) && !(o.p === 3 && o.q === 7); });
        return likePart([L(o.a, 2, o.p), L(-o.b, 2, o.q), L(1, 2, o.p), L(o.c, 2, o.q)], { hints: ['Group the like radicals: the ' + t(rt(2, o.p)) + ' terms together and the ' + t(rt(2, o.q)) + ' terms together.', 'Unlike radicals stay as separate terms, like ' + t('2x+5y') + '.'] });
      } },
      { id: '1e', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), A: r.int(5, 15), b: r.int(2, 6), Bn: r.int(2, 9), c: r.int(3, 9) }; }, function (o) { return o.c !== o.b && !(o.A === 9 && o.Bn === 5) && !(o.A === 10 && o.Bn === 4); });
        return likePart([L(o.A, 1, 1), L(-o.b, 2, o.m), L(o.Bn, 1, 1), L(o.c, 2, o.m)], { hints: ['Rational terms (no radical) combine with rational terms; radicals combine with like radicals.', 'Your answer has two terms: a number and a multiple of ' + t(rt(2, o.m)) + '.'] });
      } },
      { id: '1f', level: 'EMG', make: function (r) {
        var v = r.pick(['y', 'x', 'a', 'b']), o = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 9) }; }, function (o) { return o.a !== o.b && !(o.a === 5 && o.b === 8); });
        var q = o.a + '\\sqrt{' + v + '}+' + o.b + '\\sqrt{' + v + '}-\\sqrt{' + v + '}', key = (o.a + o.b - 1) + '\\sqrt{' + v + '}', w = {}; w[v] = 0;
        return R.partR(t(q) + '. State the restriction.', key, w, { vars: [v], text: 'like radicals with a variable',
          sol: t(q + '=(' + o.a + '+' + o.b + '-1)\\sqrt{' + v + '}=' + key) + ', &nbsp;' + t(v + '\\ge 0') + ' (the radicand of a square root must be ' + t('\\ge 0') + ').',
          hints: ['These are like radicals: combine the coefficients. ' + t('\\sqrt{' + v + '}') + ' on its own has coefficient ' + t(1) + '.', 'Restriction: the radicand ' + t(v) + ' of a square root must be ' + t('\\ge 0') + '.'],
          cands: [{ tex: (o.a + o.b) + '\\sqrt{' + v + '}', code: 'u2l3-coef-sum', hint: 'Don’t forget the last term: ' + t('-\\sqrt{' + v + '}') + ' means subtract ' + t('1\\sqrt{' + v + '}') + '.' }] });
      } }] },
    { num: '2', section: 'Like radicals', parts: [
      { id: '2a', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), f: r.int(2, 4) }; }, function (o) { return !(o.m === 3 && o.f === 2); });
        var E = o.f * o.f * o.m, S = E + o.m, right = (o.f + 1) + rt(2, o.m);
        return R.mcPart(r, 'A student wrote ' + t(rt(2, E) + '+' + rt(2, o.m) + '=' + rt(2, S)) + '. Which explains the error and gives the correct answer?', [
          { html: 'The radicands can’t be added. Simplify first: ' + t(rt(2, E) + '=' + o.f + rt(2, o.m)) + ', so the sum is ' + t(right) + '.', right: true },
          { html: 'There is no error: ' + t('\\sqrt{a}+\\sqrt{b}=\\sqrt{a+b}') + '.', why: 'Test it: ' + t('\\sqrt{9}+\\sqrt{16}=3+4=7') + ', but ' + t('\\sqrt{25}=5') + '. Radicands are never added.' },
          { html: 'The radicands should be multiplied: the answer is ' + t(rt(2, E * o.m) + '=' + (o.f * o.m)) + '.', why: 'Multiplying radicands is for a <b>product</b> of radicals. This is a sum: simplify each radical, then add like radicals.' },
          { html: 'The radicands can’t be added. Simplify first: the answer is ' + t(o.f + rt(2, o.m)) + '.', why: 'Close — but the second radical ' + t(rt(2, o.m)) + ' still has to be added: ' + t(o.f + rt(2, o.m) + '+' + rt(2, o.m) + '=' + right) + '.' }],
          'Radicands can’t be added (' + t('\\sqrt{a}+\\sqrt{b}\\ne\\sqrt{a+b}') + '). ' + t(rt(2, E) + '+' + rt(2, o.m) + '=' + o.f + rt(2, o.m) + '+' + rt(2, o.m) + '=' + right) + ' (and ' + t(right + '=' + rt(2, (o.f + 1) * (o.f + 1) * o.m) + '\\ne' + rt(2, S)) + ').', H_LIKE, 'explain the error');
      } },
      { id: '2b', level: 'EMG', make: function (r) {
        var prs = likePairs(r, 5), rows = prs.map(function (p, i) { return { id: 'r' + i, html: '(' + ['i', 'ii', 'iii', 'iv', 'v'][i] + ') ' + t(p.A) + ' and ' + t(p.Bt) }; });
        var want = {}; prs.forEach(function (p, i) { want['r' + i] = p.like ? 'like' : 'not'; });
        return B.grid('Which pairs are like radicals once they are in simplest form?', rows, [{ id: 'like', html: 'Like' }, { id: 'not', html: 'Not like' }], want, {},
          prs.map(function (p, i) { return '(' + ['i', 'ii', 'iii', 'iv', 'v'][i] + ') ' + (p.like ? '<b>Like</b>: ' : '<b>Not like</b>: ') + p.why; }).join('<br>'),
          ['Write each radical in simplest form first.', 'Like radicals have the <b>same index</b> and the <b>same radicand</b>. The coefficients don’t matter.'], 'like radicals table');
      } }] },
    { num: '3', section: 'Simplify first, then combine', stem: 'Write each expression as a single radical in simplest form.', parts: [
      { id: '3a', level: 'BEG', make: function (r) { return entPart(sqEnt(r, { cores: [2, 3, 5, 6, 7, 10, 11] })); } },
      { id: '3b', level: 'BEG', make: function (r) { return entPart(sqEnt(r, { cs: [1, -1], fs: [3, 4, 5, 6, 7, 8, 10], ok: function (e, a) { return a[0].c[0] > 0; } })); } },
      { id: '3c', level: 'EMG', make: function (r) { return entPart(sqEnt(r, { cs: [function () { return r.int(2, 4); }, -1], ok: function (e, a) { return a[0].c[0] > 0; } })); } },
      { id: '3d', level: 'PRG', make: function (r) { return entPart(sqEnt(r, { k: 3, cs: [1, function () { return r.int(2, 3); }, -1], max: 400, ok: function (e, a) { return a[0].c[0] > 0; } })); } },
      { id: '3e', level: 'PRG', make: function (r) { return entPart(sqEnt(r, { k: 3, cs: [function () { return r.int(3, 5); }, function () { return -r.int(2, 3); }, -1], max: 400, ok: function (e, a) { return a[0].c[0] > 0; } })); } },
      { id: '3f', level: 'PRG', make: function (r) { return entPart(sqEnt(r, { cs: [function () { return -r.int(2, 3); }, function () { return r.int(3, 6); }], fs: [2, 3, 4, 5, 6, 9], max: 400 })); } }] },
    { num: '4', stem: 'Simplify. Leave unlike radicals as separate terms.', parts: [
      { id: '4a', level: 'PRG', make: function (r) { return entPart(twoCore(r, [1, 1, -1, 1], ['p', 'q', 'p', 'q'])); } },
      { id: '4b', level: 'PRG', make: function (r) { return entPart(twoCore(r, [1, -1, 1, -1], ['p', 'q', 'p', 'q'])); } },
      { id: '4c', level: 'PRG', make: function (r) { return entPart(twoCore(r, [function () { return r.int(2, 3); }, 1, -1], ['p', 'q', 'p'])); } },
      { id: '4d', level: 'PRG', make: function (r) { return entPart(twoCore(r, [function () { return r.int(2, 3); }, -1, function () { return r.int(2, 4); }], ['p', 'q', 'q'])); } }] },
    { num: '5', section: 'Cube roots and fourth roots', stem: 'Simplify.', parts: [
      { id: '5a', level: 'EMG', make: function (r) { return entPart(cuEnt(r, [1, 1]), { hints: H_CUBE }); } },
      { id: '5b', level: 'PRG', make: function (r) { return entPart(cuEnt(r, [function () { return r.int(2, 5); }, -1], function (e, a) { return a[0].c[0] > 0; }), { hints: H_CUBE }); } },
      { id: '5c', level: 'PRG', make: function (r) { return entPart(cuEnt(r, [1, 1, 1], function (e, a) { return a[0].c[0] > 0; }, true), { hints: [H_CUBE[0], 'A cube root of a negative number is negative: ' + t('\\sqrt[3]{-8}=-2') + '.'] }); } },
      { id: '5d', level: 'PRG', make: function (r) { return entPart(fourEnt(r, [1, 1]), { hints: H_CUBE }); } },
      { id: '5e', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), f: r.int(2, 3), q: r.pick([2, 3, 5, 6, 10]), g: r.int(2, 3) }; }, function (o) { return o.m !== o.q && !(o.m === 5 && o.f === 2 && o.q === 10) && !(o.m === 3 && o.q === 3); });
        var ents = [R.ent(1, 3, o.f, o.m), R.ent(1, 2, o.g, o.q), R.ent(-1, 3, 1, o.m)];
        return entPart(ents, { hints: ['Different indices are never like radicals: the square root stays separate from the cube roots.', 'Simplify each radical, then combine the two cube roots.'],
          cands: [{ tex: (o.f - 1 + o.g) + rt(3, o.m), code: 'u2l3-index', hint: 'A square root and a cube root are not like radicals (different indices) — they can’t be combined.' }] });
      } },
      { id: '5f', level: 'PRG', make: function (r) { return entPart(fourEnt(r, [function () { return r.int(2, 3); }, -1], function (e, a) { return a[0].c[0] > 0; }), { hints: H_CUBE }); } }] },
    { num: '6', section: 'Fractions in front', stem: 'Simplify.', parts: [
      { id: '6a', level: 'PRG', make: function (r) { return fracPart(r, 2, 'plusEq'); } },
      { id: '6b', level: 'PRG', make: function (r) { return fracPart(r, 2, 'minus'); } },
      { id: '6c', level: 'ADV', make: function (r) { return fracPart(r, 2, 'frac'); } },
      { id: '6d', level: 'PRG', make: function (r) { return fracPart(r, 3, 'plus'); } }] },
    { num: '7', section: 'Radicals with variables', stem: 'Simplify. State the restrictions on the variables.', parts: [
      { id: '7a', level: 'EMG', make: function (r) {
        var v = r.pick(['x', 'a', 'y', 'n']), o = pickWhere(function () { var ab = r.sample([2, 3, 4, 5, 6, 7], 2); return { a: ab[0], b: ab[1] }; }, function (o) { return !(o.a === 4 && o.b === 7) && !(o.a === 3 && o.b === 5); });
        var q = '\\sqrt{' + (o.a * o.a) + v + '}-\\sqrt{' + v + '}+\\sqrt{' + (o.b * o.b) + v + '}', key = (o.a - 1 + o.b) + '\\sqrt{' + v + '}', w = {}; w[v] = 0;
        return R.partR(t(q), key, w, { vars: [v], text: 'variable like radicals',
          sol: t(q + '=' + o.a + '\\sqrt{' + v + '}-\\sqrt{' + v + '}+' + o.b + '\\sqrt{' + v + '}=' + key) + ', &nbsp;' + t(v + '\\ge 0'),
          hints: ['Take the perfect square out of each radicand: ' + t('\\sqrt{' + (o.a * o.a) + v + '}=' + o.a + '\\sqrt{' + v + '}') + '.', 'Even index: the radicand must be ' + t('\\ge 0') + '.'],
          cands: [{ tex: (o.a * o.a - 1 + o.b * o.b) + '\\sqrt{' + v + '}', code: 'u2l3-coef-sq', hint: 'Take the square root of the perfect square: ' + t('\\sqrt{' + (o.a * o.a) + v + '}=' + o.a + '\\sqrt{' + v + '}') + '.' }] });
      } },
      { id: '7b', level: 'PRG', make: function (r) {
        var v = r.pick(['a', 'x', 'm']), o = pickWhere(function () { var ab = r.sample([2, 3, 4, 5], 2); return { c: r.pick([2, 3, 5, 6, 7]), a: ab[0], b: ab[1] }; }, function (o) { return o.a * o.a * o.c <= 100 && o.b * o.b * o.c <= 100 && !(o.c === 3 && o.a === 2 && o.b === 3) && !(o.c === 2 && o.a === 2 && o.b === 3); });
        var q = '\\sqrt{' + (o.a * o.a * o.c) + v + '^{3}}+' + v + '\\sqrt{' + (o.b * o.b * o.c) + v + '}', key = (o.a + o.b) + v + '\\sqrt{' + o.c + v + '}', w = {}; w[v] = 0;
        return R.partR(t(q), key, w, { vars: [v], text: 'variable radicals: x³ under the root',
          sol: t('\\sqrt{' + (o.a * o.a * o.c) + v + '^{3}}=\\sqrt{' + (o.a * o.a) + v + '^{2}}\\sqrt{' + o.c + v + '}=' + o.a + v + '\\sqrt{' + o.c + v + '}') + '; &nbsp;' + t(v + '\\sqrt{' + (o.b * o.b * o.c) + v + '}=' + o.b + v + '\\sqrt{' + o.c + v + '}') + '<br>Sum: ' + t(key) + ', &nbsp;' + t(v + '\\ge 0'),
          hints: ['Split off the largest perfect square, including ' + t(v + '^{2}') + ': ' + t('\\sqrt{' + (o.a * o.a * o.c) + v + '^{3}}=\\sqrt{' + (o.a * o.a) + v + '^{2}}\\cdot\\sqrt{' + o.c + v + '}') + '.', 'Both terms become multiples of ' + t(v + '\\sqrt{' + o.c + v + '}') + '.'],
          cands: [{ tex: (o.a + o.b) + '\\sqrt{' + o.c + v + '}', code: 'var-exp', hint: t('\\sqrt{' + v + '^{2}}=' + v) + ' comes out of the radical too: both terms have ' + t(v) + ' in front.' }] });
      } },
      { id: '7c', level: 'PRG', make: function (r) {
        var v = r.pick(['m', 'y', 'n']), o = pickWhere(function () { var ab = r.sample([2, 3, 4], 2); return { c: r.pick([2, 3, 4, 5, 7]), a: ab[0], b: ab[1] }; }, function (o) { return Math.pow(o.a, 3) * o.c <= 200 && Math.pow(o.b, 3) * o.c <= 200 && !(o.c === 3 && o.a === 2 && o.b === 3) && !(o.c === 2 && o.a === 2 && o.b === 3); });
        var A3 = Math.pow(o.a, 3) * o.c, B3 = Math.pow(o.b, 3) * o.c;
        var q = '\\sqrt[3]{' + A3 + v + '^{4}}+' + v + '\\sqrt[3]{' + B3 + v + '}', key = (o.a + o.b) + v + '\\sqrt[3]{' + o.c + v + '}';
        return R.partR(t(q), key, null, { vars: [v], text: 'cube roots with a variable',
          sol: t('\\sqrt[3]{' + A3 + v + '^{4}}=\\sqrt[3]{' + Math.pow(o.a, 3) + v + '^{3}}\\sqrt[3]{' + o.c + v + '}=' + o.a + v + '\\sqrt[3]{' + o.c + v + '}') + '; &nbsp;' + t(v + '\\sqrt[3]{' + B3 + v + '}=' + o.b + v + '\\sqrt[3]{' + o.c + v + '}') + '<br>Sum: ' + t(key) + '. No restriction (cube roots).',
          hints: ['Take out the perfect cube, including ' + t(v + '^{3}') + '.', 'An odd index (cube root) needs no restriction — press <b>none</b>.'] });
      } },
      { id: '7d', level: 'PRG', make: function (r) {
        var v = r.pick(['y', 'x', 'b']), o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7], 2), ab = r.sample([2, 3, 4, 5], 2); return { p: pq[0], q: pq[1], a: Math.max(ab[0], ab[1]), b: Math.min(ab[0], ab[1]), c: r.int(2, 4) }; }, function (o) { return o.a * o.a * o.p <= 150 && o.c * o.c * o.q <= 150 && !(o.p === 3 && o.q === 5); });
        var q = '\\sqrt{' + (o.a * o.a * o.p) + v + '}-\\sqrt{' + (o.b * o.b * o.p) + v + '}+\\sqrt{' + (o.c * o.c * o.q) + v + '}';
        var k1 = o.a - o.b, key = (k1 === 1 ? '' : k1) + '\\sqrt{' + o.p + v + '}+' + o.c + '\\sqrt{' + o.q + v + '}', w = {}; w[v] = 0;
        return R.partR(t(q), key, w, { vars: [v], text: 'variable radicals, two groups',
          sol: t(q + '=' + o.a + '\\sqrt{' + o.p + v + '}-' + o.b + '\\sqrt{' + o.p + v + '}+' + o.c + '\\sqrt{' + o.q + v + '}=' + key) + ', &nbsp;' + t(v + '\\ge 0'),
          hints: H_SIMP, cands: [{ tex: (k1 + o.c) + '\\sqrt{' + o.p + v + '}', code: 'u2l3-unlike', hint: t('\\sqrt{' + o.p + v + '}') + ' and ' + t('\\sqrt{' + o.q + v + '}') + ' have different radicands: they stay as separate terms.' }] });
      } },
      { id: '7e', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), h: r.int(1, 7), c: r.int(2, 6) }; }, function (o) { return !(o.a === 3 && o.h === 2) && !(o.a === 2 && o.h === 2); });
        var A2 = o.a * o.a, q = '\\sqrt{' + A2 + 'x-' + (A2 * o.h) + '}+' + o.c + '\\sqrt{x-' + o.h + '}', key = (o.a + o.c) + '\\sqrt{x-' + o.h + '}', sh = { x: o.h + 0.5 };
        return R.partR(t(q), key, { x: o.h }, { vars: ['x'], shift: sh, text: 'binomial radicand: factor first',
          sol: 'Factor: ' + t('\\sqrt{' + A2 + '(x-' + o.h + ')}=' + o.a + '\\sqrt{x-' + o.h + '}') + '<br>' + t(o.a + '\\sqrt{x-' + o.h + '}+' + o.c + '\\sqrt{x-' + o.h + '}=' + key) + ', &nbsp;' + t('x-' + o.h + '\\ge 0') + ', so ' + t('x\\ge ' + o.h),
          hints: ['Factor the radicand: ' + t(A2 + 'x-' + (A2 * o.h) + '=' + A2 + '(x-' + o.h + ')') + ', and ' + t(A2) + ' is a perfect square.', 'Restriction: ' + t('x-' + o.h + '\\ge 0') + '.'],
          rHint: 'Here the radicand is ' + t('x-' + o.h) + '.',
          cands: [{ tex: (A2 + o.c) + '\\sqrt{x-' + o.h + '}', code: 'u2l3-coef-sq', hint: t('\\sqrt{' + A2 + '}=' + o.a) + ' comes out of the radical, not ' + t(A2) + '.' }] });
      } },
      { id: '7f', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var ab = r.sample([2, 3, 4, 5], 2); return { p: r.pick([2, 3, 5, 6]), a: Math.max(ab[0], ab[1]), b: Math.min(ab[0], ab[1]) }; }, function (o) { return o.a * o.a * o.p <= 150 && !(o.p === 2 && o.a === 5 && o.b === 2); });
        var q = '\\sqrt{' + (o.a * o.a * o.p) + 'xy^{2}}-y\\sqrt{' + (o.b * o.b * o.p) + 'x}', k = o.a - o.b, key = (k === 1 ? '' : k) + 'y\\sqrt{' + o.p + 'x}';
        return R.partR(t(q), key, { x: 0, y: 0 }, { vars: ['x', 'y'], text: 'two variables',
          sol: t('\\sqrt{' + (o.a * o.a * o.p) + 'xy^{2}}=\\sqrt{' + (o.a * o.a) + 'y^{2}}\\sqrt{' + o.p + 'x}=' + o.a + 'y\\sqrt{' + o.p + 'x}') + '; &nbsp;' + t('y\\sqrt{' + (o.b * o.b * o.p) + 'x}=' + o.b + 'y\\sqrt{' + o.p + 'x}') + '<br>' + t(o.a + 'y\\sqrt{' + o.p + 'x}-' + o.b + 'y\\sqrt{' + o.p + 'x}=' + key) + ', &nbsp;' + t('x\\ge 0,\\ y\\ge 0'),
          hints: ['Take out ' + t(o.a * o.a + 'y^{2}') + ' as ' + t(o.a + 'y') + '. Both terms become multiples of ' + t('y\\sqrt{' + o.p + 'x}') + '.', 'Even index: state that each variable is ' + t('\\ge 0') + '.'],
          rHint: 'For a square root, state each variable ' + t('\\ge 0') + ' (so that ' + t('\\sqrt{y^{2}}=y') + ').' });
      } }] },
    { num: '8', section: 'Perimeter and missing lengths', stem: 'Determine the perimeter of the figure in simplest form.', parts: [
      { id: '8a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var ab = r.sample([2, 3, 4, 5, 6], 2); return { m: r.pick([2, 3, 5, 6, 7]), a: Math.max(ab[0], ab[1]), b: Math.min(ab[0], ab[1]) }; }, function (o) { return o.a * o.a * o.m <= 200 && !(o.m === 3 && o.a === 6 && o.b === 3); });
        var L1 = o.a * o.a * o.m, W1 = o.b * o.b * o.m, P = 2 * (o.a + o.b);
        return R.part('Rectangle:<br>' + R.rectFig(R.lab(1, 2, L1), R.lab(1, 2, W1), { aria: 'rectangle' }), P + rt(2, o.m), { text: 'rectangle perimeter',
          sol: t(R.simpStep(2, L1)) + ', &nbsp;' + t(R.simpStep(2, W1)) + '<br>' + t('P=2\\left(' + o.a + rt(2, o.m) + '+' + o.b + rt(2, o.m) + '\\right)=2\\left(' + (o.a + o.b) + rt(2, o.m) + '\\right)=' + P + rt(2, o.m)),
          hints: ['A rectangle has two lengths and two widths: ' + t('P=2l+2w') + '.', 'Simplify each side first.'],
          cands: [{ tex: (o.a + o.b) + rt(2, o.m), code: 'u2l3-perim-half', hint: 'That’s one length plus one width. A rectangle has <b>two</b> of each: ' + t('P=2(l+w)') + '.' }, { tex: rt(2, 2 * (L1 + W1)), code: 'u2l3-add-rad', hint: 'Don’t add the radicands — simplify each side, then add like radicals.' }] });
      } },
      { id: '8b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7], 2); return { p: pq[0], q: pq[1], a: r.int(2, 4), b: r.int(2, 5), c: r.int(2, 5) }; }, function (o) { return o.b !== o.c && o.a * o.a * o.p <= 100 && o.b * o.b * o.q <= 150 && o.c * o.c * o.q <= 150 && !(o.p === 2 && o.q === 5 && o.a === 4); });
        var sides = [o.a * o.a * o.p, o.b * o.b * o.q, o.c * o.c * o.q], ans = R.sum(sides.map(function (x) { return T(1, 2, x); })), key = R.tex(ans);
        return R.part('Triangle:<br>' + R.triFig(R.lab(1, 2, sides[0]), R.lab(1, 2, sides[1]), R.lab(1, 2, sides[2]), { aria: 'triangle' }), key, { text: 'triangle perimeter',
          sol: sides.map(function (x) { return t(R.simpStep(2, x)); }).join(', &nbsp;') + '<br>' + t('P=' + sides.map(function (x, i) { return R.termTex(T(1, 2, x), i === 0); }).join('') + '=' + key),
          hints: H_SIMP, cands: entCands(sides.map(function (x) { return R.ent(1, 2, ex.nthFactor(x, 2), x / Math.pow(ex.nthFactor(x, 2), 2)); })) });
      } }] },
    { num: '9', parts: [
      { id: '9', level: 'PRG', make: function (r) {
        var g = triOnGrid(r, [JSON.stringify([[-4, 1], [2, 3], [0, -3]]), JSON.stringify([[-3, -2], [1, 0], [3, -4]])]), names = ['P', 'Q', 'R'], pts = [g.P, g.Q, g.R];
        var fig = HW.graph ? HW.graph({ x: [-6, 6], y: [-5, 5], points: pts.map(function (p, i) { return { x: p[0], y: p[1], label: names[i] }; }), segs: [{ pts: pts.concat([pts[0]]) }], aria: 'triangle PQR on a grid', max: 300 }) : '';
        return triPerimPart(names, pts, 'Triangle ' + t('PQR') + ' has vertices ' + t('P(' + g.P.join(',\\ ') + ')') + ', ' + t('Q(' + g.Q.join(',\\ ') + ')') + ' and ' + t('R(' + g.R.join(',\\ ') + ')') + '. Determine its perimeter in simplest form.<br>' + fig);
      } }] },
    { num: '10', parts: [
      { id: '10a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var ab = r.sample([2, 3, 4, 5, 6, 7, 8, 9, 10], 2); return { m: r.pick([2, 3, 5, 6, 7]), a: Math.max(ab[0], ab[1]), b: Math.min(ab[0], ab[1]) }; }, function (o) { return o.a * o.a * o.m <= 400 && !(o.m === 3 && o.a === 10 && o.b === 4); });
        var AB = o.a * o.a * o.m, AC = o.b * o.b * o.m, k = o.a - o.b, key = (k === 1 ? '' : k) + rt(2, o.m);
        return R.part('Point ' + t('C') + ' lies on segment ' + t('AB') + '. If ' + t('AB=' + rt(2, AB)) + ' and ' + t('AC=' + rt(2, AC)) + ', determine ' + t('CB') + ' in simplest form.', key, { before: t('CB='), text: 'missing part of a segment',
          sol: t('CB=AB-AC=' + rt(2, AB) + '-' + rt(2, AC) + '=' + o.a + rt(2, o.m) + '-' + o.b + rt(2, o.m) + '=' + key),
          hints: ['The two parts add to the whole: ' + t('AC+CB=AB') + ', so ' + t('CB=AB-AC') + '.', 'Simplify both radicals before subtracting.'],
          cands: [{ tex: rt(2, AB - AC), code: 'u2l3-add-rad', hint: 'Don’t subtract the radicands. Simplify each radical, then subtract like radicals.' }, { tex: (o.a + o.b) + rt(2, o.m), code: 'u2l3-coef-sum', hint: t('CB') + ' is the <b>difference</b> ' + t('AB-AC') + '.' }] });
      } },
      { id: '10b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7], 2); return { p: pq[0], q: pq[1], L1: r.int(3, 7), g: r.int(2, 3), w1: r.int(1, 4), w2: r.int(1, 3) }; }, function (o) { return o.g * o.g * o.q <= 50 && !(o.p === 5 && o.q === 3 && o.L1 === 5 && o.w1 === 3); });
        // length L1√p + √(g²q) (the second term entire); width w1√p + w2√q
        var Lq = o.g * o.g * o.q, Pp = 2 * (o.L1 + o.w1), Pq = 2 * (o.g + o.w2);
        var ptex = Pp + rt(2, o.p) + '+' + Pq + rt(2, o.q), ltex = o.L1 + rt(2, o.p) + '+' + rt(2, Lq);
        var key = R.tex([T(o.w1, 2, o.p), T(o.w2, 2, o.q)]);
        var half = R.tex([T(o.L1 + o.w1, 2, o.p), T(o.g + o.w2, 2, o.q)]);
        return R.part('A rectangle has perimeter ' + t(ptex) + ' m and length ' + t(ltex) + ' m. Determine its width in simplest form.', key, { before: t('w='), unit: 'm', after: 'm', text: 'rectangle width from the perimeter',
          sol: 'Length ' + t('+') + ' width ' + t('=\\frac{1}{2}\\left(' + ptex + '\\right)=' + half) + '. Length ' + t('=' + o.L1 + rt(2, o.p) + '+' + o.g + rt(2, o.q)) + '.<br>Width ' + t('=' + half + '-\\left(' + o.L1 + rt(2, o.p) + '+' + o.g + rt(2, o.q) + '\\right)=' + key) + ' m',
          hints: ['The perimeter is ' + t('2(l+w)') + ', so half of it is ' + t('l+w') + '.', 'Simplify the length, then subtract it in brackets: ' + t('w=(l+w)-l') + '.'],
          cands: [{ tex: R.tex([T(Pp - o.L1, 2, o.p), T(Pq - o.g, 2, o.q)]), code: 'u2l3-width-half', hint: 'The perimeter counts the length and the width twice. Halve it first: ' + t('l+w=\\frac{P}{2}') + '.' },
            { tex: R.tex([T(o.w1, 2, o.p), T(o.g + o.w2 + o.g, 2, o.q)]), code: 'u2l3-width-brackets', hint: 'Put the length in brackets before subtracting it: both of its terms are subtracted.' }] });
      } }] },
    { num: '11', parts: [
      { id: '11', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var ab = r.sample([1, 2, 3, 4, 5, 6, 7], 2); return { m: r.pick([2, 3, 5, 6, 7]), a: ab[0], b: ab[1], k: r.pick([2, 2, 3]) }; }, function (o) { return (o.a + o.b) % o.k === 0 && o.a * o.a * o.m <= 300 && o.b * o.b * o.m <= 300 && o.a !== 1 && !(o.m === 3 && o.a === 6 && o.b === 2); });
        var A = o.a * o.a * o.m, Bv = o.b * o.b * o.m, x = (o.a + o.b) / o.k, ent = x * x * o.m;
        var lhs = o.k + 'x-' + rt(2, Bv) + '=' + rt(2, A);
        return R.fieldsPart('If ' + t(lhs) + ', determine ' + t('x') + ' as a mixed radical in simplest form and as an entire radical.', [
          { label: 'Mixed radical:', name: 'Mixed radical', key: (x === 1 ? '' : x) + rt(2, o.m), before: t('x='), check: K.radical({ k: [x, 1], n: 2, m: o.m }, 'mixed', { diag: function (v) { if (Math.abs(v - (o.a + o.b) * Math.sqrt(o.m)) < 1e-9 && o.k > 1) return { code: 'u2l3-solve-step', hint: 'That’s ' + t(o.k + 'x') + '. Divide by ' + t(o.k) + ' to get ' + t('x') + '.' }; if (Math.abs(v - (o.a - o.b) * Math.sqrt(o.m) / o.k) < 1e-9 || Math.abs(v - (o.b - o.a) * Math.sqrt(o.m) / o.k) < 1e-9) return { code: 'u2l3-solve-sign', hint: 'Move ' + t('-' + rt(2, Bv)) + ' to the other side by <b>adding</b> it.' }; return null; } }) },
          { label: 'Entire radical:', name: 'Entire radical', key: rt(2, ent), before: t('x='), check: K.radical({ k: [x, 1], n: 2, m: o.m }, 'entire') }],
          { text: 'solve for x, mixed and entire', sol: t(o.k + 'x=' + rt(2, A) + '+' + rt(2, Bv) + '=' + o.a + rt(2, o.m) + '+' + o.b + rt(2, o.m) + '=' + (o.a + o.b) + rt(2, o.m)) + ', so ' + t('x=' + (x === 1 ? '' : x) + rt(2, o.m)) + '.<br>As an entire radical: ' + t('x=\\sqrt{' + (x * x) + '\\cdot ' + o.m + '}=' + rt(2, ent)) + '.',
            hints: ['Solve like a linear equation: add ' + t(rt(2, Bv)) + ' to both sides, simplify and combine, then divide by ' + t(o.k) + '.', 'For the entire radical, square the coefficient and move it inside: ' + t('a\\sqrt{b}=\\sqrt{a^{2}b}') + '.'],
            bad: [[((o.a + o.b)) + rt(2, o.m), rt(2, ent)]] });
      } }] },
    { num: '12', section: 'Sequences with radical terms', stem: 'Each sequence is arithmetic.', parts: [
      { id: '12a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), s: r.int(1, 3), j: r.int(1, 3) }; }, function (o) { return Math.pow(o.s + 2 * o.j, 2) * o.m <= 300 && !(o.m === 2 && o.s === 1 && o.j === 1); });
        var ks = [0, 1, 2, 3, 4].map(function (i) { return o.s + i * o.j; }), terms = ks.slice(0, 3).map(function (k) { return rt(2, k * k * o.m); });
        var dK = (o.j === 1 ? '' : o.j) + rt(2, o.m), n4 = ks[3] + rt(2, o.m), n5 = ks[4] + rt(2, o.m);
        return R.fieldsPart(t(terms.join(',\\ ') + ',\\ \\dots') + ' &nbsp; Determine ' + t('d') + ' and the next two terms in simplest form.', [
          { label: t('d='), name: 'd', key: dK }, { label: t('t_4='), name: 't4', key: n4 }, { label: t('t_5='), name: 't5', key: n5 }],
          { text: 'arithmetic sequence of radicals', sol: 'Simplify: ' + t(ks.slice(0, 3).map(function (k) { return (k === 1 ? '' : k) + rt(2, o.m); }).join(',\\ ') + ',\\ \\dots') + ', so ' + t('d=' + dK) + '.<br>Next: ' + t(n4) + ', ' + t(n5) + '.',
            hints: ['Simplify each term first — they all become multiples of ' + t(rt(2, o.m)) + '.', t('d=t_2-t_1') + '; add ' + t('d') + ' to get each next term.'],
            bad: [[rt(2, Math.pow(ks[1], 2) * o.m - Math.pow(ks[0], 2) * o.m), n4, n5]] });
      } },
      { id: '12b', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), p: r.int(4, 12), q: r.int(-3, 3), u: r.pick([-3, -2, 2, 3]), w: r.int(1, 4), n: r.int(12, 25) }; }, function (o) { return o.q !== 0 && o.q + o.w !== 0 && o.q + 2 * o.w !== 0 && !(o.p === 10 && o.q === -1 && o.u === -2 && o.w === 2) && !(o.p === 3 && o.q === 1 && o.u === 2 && o.w === 3); });
        var tm = function (k) { return [T(o.p + k * o.u, 1, 1), T(o.q + k * o.w, 2, o.m)]; }, txt = function (k) { return R.tex(R.sum(tm(k))); };
        var dK = R.tex(R.sum([T(o.u, 1, 1), T(o.w, 2, o.m)])), tnK = txt(o.n - 1);
        return R.fieldsPart(t(txt(0) + ',\\ ' + txt(1) + ',\\ ' + txt(2) + ',\\ \\dots') + ' &nbsp; Determine ' + t('d') + ' and ' + t('t_{' + o.n + '}') + '.', [
          { label: t('d='), name: 'd', key: dK, cands: [{ tex: R.tex(R.sum([T(-o.u, 1, 1), T(-o.w, 2, o.m)])), code: 'u2l3-d-back', hint: t('d=t_2-t_1') + ': subtract the first term from the second.' }] },
          { label: t('t_{' + o.n + '}='), name: 't' + o.n, key: tnK, cands: [{ tex: txt(o.n), code: 'u2l3-tn-n', hint: t('t_n=t_1+(n-1)d') + ': there are ' + t(o.n - 1) + ' steps from ' + t('t_1') + ' to ' + t('t_{' + o.n + '}') + ', not ' + t(o.n) + '.' }] }],
          { text: 'arithmetic sequence: d and a far term', sol: t('d=\\left(' + txt(1) + '\\right)-\\left(' + txt(0) + '\\right)=' + dK) + '<br>' + t('t_{' + o.n + '}=t_1+' + (o.n - 1) + 'd=' + txt(0) + '+' + (o.n - 1) + '\\left(' + dK + '\\right)=' + tnK),
            hints: ['Subtract consecutive terms, collecting the rational parts and the radical parts separately.', t('t_n=t_1+(n-1)d') + '.'],
            bad: [[dK, txt(o.n)]] });
      } }] },
    { num: '13', section: 'Multiple choice and numerical response', parts: [
      { id: '13', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var fg = r.sample([2, 3, 4, 5], 2); return { m: r.pick([2, 3, 5, 6, 7]), f: fg[0], g: fg[1], q: r.pick([2, 3, 5, 6, 7, 10]) }; }, function (o) { return o.q !== o.m && o.q !== 2 * o.m && o.m * 2 !== o.q && !(o.m === 5 && o.f === 2 && o.g === 3); });
        var A = o.f * o.f * o.m, right = o.g * o.g * o.m, b1 = o.g * o.g * o.q, b2 = A * 2 === right ? A * 3 : A * 2;
        if (ex.nthFactor(b2, 2) > 1 && b2 / Math.pow(ex.nthFactor(b2, 2), 2) === o.m) b2 = A + o.m * 2 + 1;
        return R.mcPart(r, 'Which radical can be combined with ' + t(rt(2, A)) + ' by addition?', [
          { html: t(rt(2, right)), right: true },
          { html: t(rt(2, b1)), why: t(R.simpStep(2, b1)) + ': its radicand isn’t ' + t(o.m) + ', so it isn’t a like radical.' },
          { html: t(rt(2, b2)), why: t(R.simpStep(2, b2)) + ': not a multiple of ' + t(rt(2, o.m)) + '.' },
          { html: t(o.g + rt(3, o.m)), why: 'A cube root has a different index from a square root, so they are not like radicals.' }],
          t(R.simpStep(2, A)) + ' and ' + t(R.simpStep(2, right)) + ' are like radicals.', H_SIMP, 'which can be combined');
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var abc = r.sample([2, 3, 4, 5], 3); return { m: r.pick([2, 3, 5]), a: abc[0], b: abc[1], c: abc[2] }; }, function (o) { return o.a + o.b - o.c > 0 && !(o.m === 2 && o.a === 5 && o.b === 3 && o.c === 2); });
        var E = [o.a * o.a * o.m, o.b * o.b * o.m, o.c * o.c * o.m], k = o.a + o.b - o.c, S = E[0] + E[1] - E[2], sf = ex.nthFactor(S, 2);
        return R.mcPart(r, 'In simplest form, ' + t(rt(2, E[0]) + '+' + rt(2, E[1]) + '-' + rt(2, E[2])) + ' is', [
          { html: t((k === 1 ? '' : k) + rt(2, o.m)), right: true },
          { html: t(rt(2, S)), why: 'That adds and subtracts the radicands — not allowed. Simplify each radical first.' },
          { html: t((sf > 1 ? sf : '') + rt(2, S / (sf * sf))), why: 'That comes from combining the radicands (' + t(rt(2, S)) + '). Simplify each radical first, then combine.' },
          { html: t((o.a + o.b + o.c) + rt(2, o.m)), why: 'The last radical is <b>subtracted</b>: ' + t(o.a + '+' + o.b + '-' + o.c) + '.' }],
          t(o.a + rt(2, o.m) + '+' + o.b + rt(2, o.m) + '-' + o.c + rt(2, o.m) + '=' + (k === 1 ? '' : k) + rt(2, o.m)) + '.', H_SIMP, 'simplest form MC');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), f: r.int(2, 4) }; }, function (o) { return !(o.m === 3 && o.f === 2); });
        var E = o.f * o.f * o.m, side = o.f + 1, P = 4 * side;
        return R.mcPart(r, 'A square has sides of length ' + t(rt(2, E) + '+' + rt(2, o.m)) + ' cm. Its perimeter is', [
          { html: t(P + rt(2, o.m)) + ' cm', right: true },
          { html: t(side + rt(2, o.m)) + ' cm', why: 'That is one side. A square has <b>four</b> equal sides.' },
          { html: t('4' + rt(2, E + o.m)) + ' cm', why: 'The radicands can’t be added. Simplify ' + t(rt(2, E)) + ' first.' },
          { html: t(2 * side + rt(2, o.m)) + ' cm', why: 'A square has four sides, not two: multiply the side by ' + t(4) + '.' }],
          'Side ' + t('=' + o.f + rt(2, o.m) + '+' + rt(2, o.m) + '=' + side + rt(2, o.m)) + ', perimeter ' + t('=4\\left(' + side + rt(2, o.m) + '\\right)=' + P + rt(2, o.m)) + ' cm.', ['Simplify the side first, then multiply by 4.'], 'square perimeter MC');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var ab = r.sample([2, 3, 4, 5, 6, 7], 2); return { m: r.pick([2, 3, 5]), a: ab[0], b: ab[1] }; }, function (o) { return o.a * o.a * o.m <= 150 && o.b * o.b * o.m <= 150 && !(o.m === 2 && ((o.a === 7 && o.b === 2) || (o.a === 2 && o.b === 7))); });
        var A = o.a * o.a * o.m, Bv = o.b * o.b * o.m, ans = 4 * (o.a + o.b);
        return R.nrPart('<b>Numerical response.</b> A square has sides of length ' + t(rt(2, A) + '+' + rt(2, Bv)) + ' m. Its perimeter can be written as ' + t('a' + rt(2, o.m)) + ' m. The value of ' + t('a') + ' is ____.', ans,
          [[o.a + o.b, 'u2l3-perim-side', 'That is the side: ' + t((o.a + o.b) + rt(2, o.m)) + '. The perimeter is four sides.'], [2 * (o.a + o.b), 'u2l3-perim-half', 'A square has four sides: multiply the side by 4.'], [4 * (A + Bv), 'u2l3-coef-sq', 'Take the square roots of the perfect squares when you simplify: ' + t(R.simpStep(2, A)) + '.']],
          'Side ' + t('=' + o.a + rt(2, o.m) + '+' + o.b + rt(2, o.m) + '=' + (o.a + o.b) + rt(2, o.m)) + '; perimeter ' + t('=4\\left(' + (o.a + o.b) + rt(2, o.m) + '\\right)=' + ans + rt(2, o.m)) + ', so ' + t('a=' + ans) + '.', ['Simplify each radical, add them for the side, then multiply by 4.'], 'NR square perimeter');
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 4, 5]), a: r.pick([1, 3, 5]), b: r.int(1, 4), half: r.pick([2, 4]) }; }, function (o) { return Math.pow(o.a, 3) * o.m <= 300 && Math.pow(o.b, 3) * o.m <= 300 && (o.a % o.half !== 0) && !(o.m === 2 && o.a === 3 && o.b === 2 && o.half === 2); });
        var A = Math.pow(o.a, 3) * o.m, Bv = Math.pow(o.b, 3) * o.m, ans = Math.round((o.a / o.half + o.b) * 1000) / 1000;
        return R.nrPart('<b>Numerical response.</b> When ' + t('\\frac{1}{' + o.half + '}\\sqrt[3]{' + A + '}+\\sqrt[3]{' + Bv + '}') + ' is written in the form ' + t('a\\sqrt[3]{' + o.m + '}') + ', the value of ' + t('a') + ', as a decimal, is ____.', ans,
          [[o.a + o.b, 'u2l3-frac-coef', 'Don’t forget the ' + t('\\frac{1}{' + o.half + '}') + ' in front: ' + t('\\frac{1}{' + o.half + '}\\left(' + o.a + '\\sqrt[3]{' + o.m + '}\\right)') + '.'], [Math.round((1 / o.half + o.b) * 1000) / 1000, 'u2l3-coef-skip', 'The ' + t('\\frac{1}{' + o.half + '}') + ' multiplies the number that comes out of the cube root: ' + t('\\sqrt[3]{' + A + '}=' + o.a + '\\sqrt[3]{' + o.m + '}') + '.']],
          t('\\frac{1}{' + o.half + '}\\left(' + o.a + '\\sqrt[3]{' + o.m + '}\\right)+' + o.b + '\\sqrt[3]{' + o.m + '}=' + (o.a / o.half) + '\\sqrt[3]{' + o.m + '}+' + o.b + '\\sqrt[3]{' + o.m + '}=' + ans + '\\sqrt[3]{' + o.m + '}') + ', so ' + t('a=' + ans) + '.', ['Simplify each cube root (look for a perfect cube), then combine the coefficients.'], 'NR cube roots with a fraction');
      } }] }
  ];

  /* ---------- generators used above ---------- */
  function twoCore(r, cs, which) {
    return pickWhere(function () {
      var pq = r.sample([2, 3, 5, 6, 7, 10, 11], 2), fs = which.map(function () { return r.int(2, 6); });
      return which.map(function (w, i) { var c = typeof cs[i] === 'function' ? cs[i]() : cs[i]; return R.ent(c, 2, fs[i], w === 'p' ? pq[0] : pq[1]); });
    }, function (ents) {
      if (ents.some(function (e) { return e.E > 300; })) return false;
      var ans = R.sum(ents.map(R.entTerm)); if (ans.length !== 2) return false;
      var fsP = ents.filter(function (e, i) { return which[i] === 'p'; }).map(function (e) { return e.f; }), fsQ = ents.filter(function (e, i) { return which[i] === 'q'; }).map(function (e) { return e.f; });
      if (!distinct(fsP) || !distinct(fsQ)) return false;
      return avoidQ(ents, ['\\sqrt{45}+\\sqrt{8}-\\sqrt{20}+\\sqrt{50}', '\\sqrt{112}-\\sqrt{18}+\\sqrt{63}-\\sqrt{32}', '3\\sqrt{24}+\\sqrt{90}-\\sqrt{150}', '2\\sqrt{96}-\\sqrt{300}+4\\sqrt{27}', '\\sqrt{20}+\\sqrt{27}+\\sqrt{45}-\\sqrt{12}', '\\sqrt{28}+\\sqrt{12}-\\sqrt{63}+\\sqrt{48}']);
    });
  }
  function cuEnt(r, cs, okf, negFirst) {
    return pickWhere(function () {
      var m = r.pick([2, 3, 4, 5, 6, 7]), fs = r.sample([1, 2, 3, 4, 5], cs.length);
      return fs.map(function (f, i) { var c = typeof cs[i] === 'function' ? cs[i]() : cs[i]; return R.ent(negFirst && i === 0 ? -c : c, 3, f, m); });
    }, function (ents) {
      if (ents.some(function (e) { return e.E > 400; }) || ents.filter(function (e) { return e.f === 1; }).length > (negFirst ? 0 : 0)) return false;
      var ans = R.sum(ents.map(R.entTerm)); if (!ans.length || (okf && !okf(ents, ans))) return false;
      return avoidQ(ents, ['\\sqrt[3]{54}+\\sqrt[3]{16}', '\\sqrt[3]{24}+\\sqrt[3]{192}', '5\\sqrt[3]{16}-\\sqrt[3]{250}', '\\sqrt[3]{24}+\\sqrt[3]{81}', '2\\sqrt[3]{81}-\\sqrt[3]{24}+\\sqrt[3]{375}']);
    }).map(function (e, i) { if (negFirst && i === 0) { e.E = e.E; } return e; });
  }
  function fourEnt(r, cs, okf) {
    return pickWhere(function () {
      var m = r.pick([2, 3, 5, 6]), fs = r.sample([1, 2, 3], cs.length);
      return fs.map(function (f, i) { var c = typeof cs[i] === 'function' ? cs[i]() : cs[i]; return R.ent(c, 4, f, m); });
    }, function (ents) {
      if (ents.some(function (e) { return e.f === 1 && e.c[0] > 0 && ents.indexOf(e) === 0; })) return false;
      var ans = R.sum(ents.map(R.entTerm)); if (!ans.length || (okf && !okf(ents, ans))) return false;
      return avoidQ(ents, ['\\sqrt[4]{48}+\\sqrt[4]{243}', '\\sqrt[4]{80}+\\sqrt[4]{405}', '2\\sqrt[4]{32}-\\sqrt[4]{162}', '\\sqrt[4]{96}+\\sqrt[4]{486}']);
    });
  }
  /* fractions in front: kind 'plusEq' (both become the same whole multiple), 'minus', 'frac' (a fraction answer), 'plus' (cube roots) */
  function fracPart(r, n, kind) {
    var ents = pickWhere(function () {
      var m = n === 2 ? r.pick([2, 3, 5, 6, 7]) : r.pick([2, 3, 4, 5]);
      var q1 = r.int(2, 6), q2 = r.int(2, 6), p1 = r.int(1, 3), p2 = r.int(1, 2);
      var f1 = kind === 'frac' ? r.int(2, 6) : q1 * r.int(1, 2), f2 = kind === 'frac' ? q2 : q2;
      if (n === 3) { f1 = q1 === 2 || q1 === 4 ? 2 : q1 === 3 || q1 === 6 ? 3 : q1; f2 = q2 <= 3 ? q2 : 2; }
      return [R.ent([p1, q1], n, f1, m), R.ent(kind === 'minus' ? [-p2, q2] : [p2, q2], n, f2, m)];
    }, function (e) {
      if (e.some(function (x) { return x.c[1] === 1 || x.E > (n === 2 ? 300 : 400) || x.f === 1; })) return false;
      var ans = R.sum(e.map(R.entTerm)); if (ans.length !== 1 || ans[0].c[0] <= 0) return false;
      var c1 = qmul(e[0].c, [e[0].f, 1]), c2 = qmul(e[1].c, [e[1].f, 1]);
      if (kind === 'frac') { if (ans[0].c[1] === 1 || (c1[1] === 1 && c2[1] === 1)) return false; }
      else if (c1[1] !== 1 || c2[1] !== 1) return false;
      if (kind === 'plusEq' && !(c1[0] === c2[0])) return false;
      return avoidQ(e, ['\\frac{1}{2}\\sqrt{48}+\\frac{2}{3}\\sqrt{27}', '\\frac{3}{4}\\sqrt{32}-\\frac{1}{5}\\sqrt{50}', '\\frac{2}{3}\\sqrt{18}+\\frac{1}{4}\\sqrt{8}', '\\frac{1}{2}\\sqrt{20}+\\frac{1}{3}\\sqrt{45}', '\\frac{2}{5}\\sqrt{75}-\\frac{1}{4}\\sqrt{48}', '\\frac{3}{4}\\sqrt{8}+\\frac{1}{6}\\sqrt{72}', '\\frac{1}{2}\\sqrt[3]{16}+\\frac{2}{3}\\sqrt[3]{54}', '\\frac{1}{3}\\sqrt{72}+\\frac{2}{3}\\sqrt{50}']);
    });
    var ans = R.sum(ents.map(R.entTerm));
    var noFrac = R.tex(R.sum(ents.map(function (e) { return T(e.c[0] < 0 ? -e.f : e.f, n, e.m); })));
    return entPart(ents, { hints: ['A fraction in front is a coefficient: simplify the radical, then multiply the fraction by the number that came out.', n === 2 ? 'Then combine the like radicals (add the fractions with a common denominator if you need to).' : 'Look for perfect cubes under the roots.'],
      note: kind === 'frac' ? '(Also accepted: ' + t('\\frac{' + ans[0].c[0] + rt(n, ans[0].m) + '}{' + ans[0].c[1] + '}') + '.)' : '',
      cands: [{ tex: noFrac, code: 'u2l3-frac-coef', hint: 'Don’t drop the fractions in front: multiply each one by the number that comes out of its radical.' }] });
  }

  /* ============================== the extra practice ============================== */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Simplify.', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) { var o = pickWhere(function () { var b = r.int(2, 5); return { m: r.pick([3, 5, 6, 10, 11, 14]), a: r.int(b + 2, 12), b: b }; }, function (o) { return !(o.m === 10 && o.a === 9 && o.b === 2); }); return likePart([L(o.a, 2, o.m), L(-o.b, 2, o.m)]); } },
      { id: 'A1b', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(3, 9), b: r.int(1, 7) }; }, function (o) { return o.a - 1 - o.b > 0 && !(o.m === 6 && o.a === 5 && o.b === 3); }); return likePart([L(-1, 2, o.m), L(o.a, 2, o.m), L(-o.b, 2, o.m)]); } },
      { id: 'A1c', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { m: r.pick([2, 3, 4, 5, 7, 9]), a: r.int(2, 9), b: r.int(2, 9) }; }, function (o) { return !(o.m === 7 && o.a === 3 && o.b === 8); }); return likePart([L(o.a, 3, o.m), L(o.b, 3, o.m)]); } },
      { id: 'A1d', level: 'EMG', make: function (r) { var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7, 10], 2); return { p: pq[0], q: pq[1], a: r.int(2, 5), b: r.int(2, 8), c: r.int(5, 9) }; }, function (o) { return o.a - o.c !== 0 && !(o.p === 5 && o.q === 3); }); return likePart([L(o.a, 2, o.p), L(o.b, 2, o.q), L(-o.c, 2, o.p), L(1, 2, o.q)]); } },
      { id: 'A1e', level: 'EMG', make: function (r) {
        var v = r.pick(['x', 'a', 'y']), o = pickWhere(function () { return { a: r.int(7, 15), b: r.int(2, 6) }; }, function (o) { return !(o.a === 12 && o.b === 5); });
        var q = o.a + '\\sqrt{' + v + '}-' + o.b + '\\sqrt{' + v + '}', key = (o.a - o.b) + '\\sqrt{' + v + '}', w = {}; w[v] = 0;
        return R.partR(t(q) + '. State the restriction.', key, w, { vars: [v], text: 'like radicals with a variable', sol: t(q + '=' + key) + ', &nbsp;' + t(v + '\\ge 0'), hints: H_LIKE });
      } },
      { id: 'A1f', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 4, 5, 6, 7]), a: r.int(2, 6), b: r.int(2, 5), s: r.pick([4, 9, 16, 25]) }; }, function (o) { return !(o.m === 4 && o.a === 3 && o.b === 2 && o.s === 4); });
        var sr = Math.sqrt(o.s), key = o.a + rt(3, o.m) + '+' + (o.b * sr);
        return R.part(t(o.a + rt(3, o.m) + '+' + o.b + rt(2, o.s)), key, { text: 'a perfect square root next to a cube root',
          sol: t(rt(2, o.s) + '=' + sr) + ', so ' + t(o.a + rt(3, o.m) + '+' + o.b + rt(2, o.s) + '=' + key) + '. (The cube root and the number are not like terms.)',
          hints: ['Is ' + t(o.s) + ' a perfect square? Then ' + t(rt(2, o.s)) + ' is a whole number.', 'A cube root and a rational number can’t be combined.'],
          cands: [{ tex: (o.a + o.b) + rt(3, o.m), code: 'u2l3-index', hint: 'A cube root and a square root are not like radicals — and ' + t(rt(2, o.s) + '=' + sr) + ' is a whole number.' }, { tex: o.a + rt(3, o.m) + '+' + o.b * o.s, code: 'u2l3-perfect-rad', hint: t(rt(2, o.s) + '=' + sr) + ', not ' + t(o.s) + '.' }] });
      } }] },
    { num: 'A2', stem: 'Write each expression as a single radical in simplest form.', parts: [
      { id: 'A2a', level: 'BEG', make: function (r) { return entPart(sqEnt(r, { cores: [2, 3, 5, 7, 10, 11] })); } },
      { id: 'A2b', level: 'BEG', make: function (r) { return entPart(sqEnt(r, { cs: [1, -1], ok: function (e, a) { return a[0].c[0] === 1; } })); } },
      { id: 'A2c', level: 'EMG', make: function (r) { return entPart(sqEnt(r, { cs: [function () { return r.int(2, 3); }, 1] })); } },
      { id: 'A2d', level: 'PRG', make: function (r) { return entPart(sqEnt(r, { k: 3, cs: [1, function () { return -r.int(2, 3); }, 1], max: 400, ok: function (e, a) { return a[0].c[0] > 0; } })); } },
      { id: 'A2e', level: 'EMG', make: function (r) { return entPart(cuEnt(r, [1, 1]), { hints: H_CUBE }); } },
      { id: 'A2f', level: 'PRG', make: function (r) { return entPart(cuEnt(r, [1, function () { return r.int(2, 4); }], function (e, a) { return a[0].c[0] > 0; }, true), { hints: [H_CUBE[0], 'A cube root of a negative is negative: ' + t('\\sqrt[3]{-125}=-5') + '.'] }); } }] },
    { num: 'A3', stem: 'Simplify.', parts: [
      { id: 'A3a', level: 'PRG', make: function (r) { return entPart(twoCore(r, [1, 1, -1, 1], ['p', 'q', 'p', 'q'])); } },
      { id: 'A3b', level: 'PRG', make: function (r) { return entPart(twoCore(r, [1, -1, 1], ['p', 'p', 'q'])); } },
      { id: 'A3c', level: 'PRG', make: function (r) { return entPart(fourEnt(r, [1, 1]), { hints: H_CUBE }); } },
      { id: 'A3d', level: 'ADV', make: function (r) { return fracPart(r, 2, 'frac'); } }] },
    { num: 'B1', section: 'B. Applying', stem: 'Simplify. State the restrictions on the variables.', parts: [
      { id: 'B1a', level: 'EMG', make: function (r) {
        var v = r.pick(['b', 'x', 'k']), o = pickWhere(function () { var ab = r.sample([2, 3, 4, 5, 6, 7], 2); return { a: Math.max(ab[0], ab[1]), b: Math.min(ab[0], ab[1]) }; }, function (o) { return !(o.a === 6 && o.b === 3); });
        var q = '\\sqrt{' + o.a * o.a + v + '}-\\sqrt{' + o.b * o.b + v + '}', k = o.a - o.b, key = (k === 1 ? '' : k) + '\\sqrt{' + v + '}', w = {}; w[v] = 0;
        return R.partR(t(q), key, w, { vars: [v], text: 'variable like radicals', sol: t(q + '=' + o.a + '\\sqrt{' + v + '}-' + o.b + '\\sqrt{' + v + '}=' + key) + ', &nbsp;' + t(v + '\\ge 0'), hints: H_SIMP,
          cands: [{ tex: '\\sqrt{' + (o.a * o.a - o.b * o.b) + v + '}', code: 'u2l3-add-rad', hint: 'Don’t subtract the radicands. Simplify each radical first.' }] });
      } },
      { id: 'B1b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var ab = r.sample([2, 3, 4], 2); return { c: r.pick([2, 3, 5, 6, 7]), a: ab[0], b: ab[1] }; }, function (o) { return !(o.c === 5 && o.a === 2 && o.b === 3); });
        var q = '\\sqrt{' + o.a * o.a * o.c + 'x^{3}}+x\\sqrt{' + o.b * o.b * o.c + 'x}', key = (o.a + o.b) + 'x\\sqrt{' + o.c + 'x}';
        return R.partR(t(q), key, { x: 0 }, { vars: ['x'], text: 'variable radicals with x³', sol: t('\\sqrt{' + o.a * o.a * o.c + 'x^{3}}=' + o.a + 'x\\sqrt{' + o.c + 'x}') + '; &nbsp;' + t('x\\sqrt{' + o.b * o.b * o.c + 'x}=' + o.b + 'x\\sqrt{' + o.c + 'x}') + '<br>Sum: ' + t(key) + ', &nbsp;' + t('x\\ge 0'),
          hints: ['Take ' + t(o.a * o.a + 'x^{2}') + ' out of the first radical as ' + t(o.a + 'x') + '.', 'Both terms become multiples of ' + t('x\\sqrt{' + o.c + 'x}') + '.'] });
      } },
      { id: 'B1c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { c: r.pick([2, 3, 4, 5]), a: r.int(2, 4), b: r.int(1, 5) }; }, function (o) { return o.a !== o.b && Math.pow(o.a, 3) * o.c <= 300 && !(o.c === 2 && o.a === 3 && o.b === 1); });
        var A3 = Math.pow(o.a, 3) * o.c, k = o.b - o.a, key = (k === 1 ? '' : k === -1 ? '-' : k) + 'a\\sqrt[3]{' + o.c + 'a}';
        var q = '\\sqrt[3]{-' + A3 + 'a^{4}}+' + (o.b === 1 ? '' : o.b) + 'a\\sqrt[3]{' + o.c + 'a}';
        return R.partR(t(q), key, null, { vars: ['a'], text: 'cube root of a negative with a variable', sol: t('\\sqrt[3]{-' + A3 + 'a^{4}}=-' + o.a + 'a\\sqrt[3]{' + o.c + 'a}') + '<br>' + t('-' + o.a + 'a\\sqrt[3]{' + o.c + 'a}+' + (o.b === 1 ? '' : o.b) + 'a\\sqrt[3]{' + o.c + 'a}=' + key) + '; no restriction (cube roots).',
          hints: ['A negative comes out of a cube root as negative: ' + t('\\sqrt[3]{-' + Math.pow(o.a, 3) + 'a^{3}}=-' + o.a + 'a') + '.', 'Cube roots need no restriction.'],
          cands: [{ tex: (o.a + o.b) + 'a\\sqrt[3]{' + o.c + 'a}', code: 'sign', hint: 'The cube root of a negative number is negative: ' + t('\\sqrt[3]{-' + A3 + 'a^{4}}=-' + o.a + 'a\\sqrt[3]{' + o.c + 'a}') + '.' }] });
      } },
      { id: 'B1d', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), h: r.int(1, 6), s: r.pick([1, 2]) }; }, function (o) { return !(o.a === 5 && o.h === 2) && o.a - o.s > 0; });
        var A2 = o.a * o.a, q = '\\sqrt{' + A2 + 'x+' + A2 * o.h + '}-' + (o.s === 1 ? '' : o.s) + '\\sqrt{x+' + o.h + '}', k = o.a - o.s, key = (k === 1 ? '' : k) + '\\sqrt{x+' + o.h + '}';
        return R.partR(t(q), key, { x: -o.h }, { vars: ['x'], shift: { x: 0 }, text: 'binomial radicand', sol: t('\\sqrt{' + A2 + '(x+' + o.h + ')}=' + o.a + '\\sqrt{x+' + o.h + '}') + '<br>' + t(o.a + '\\sqrt{x+' + o.h + '}-' + (o.s === 1 ? '' : o.s) + '\\sqrt{x+' + o.h + '}=' + key) + ', &nbsp;' + t('x+' + o.h + '\\ge 0') + ', so ' + t('x\\ge -' + o.h),
          hints: ['Factor ' + t(A2) + ' out of the first radicand.', 'Restriction: ' + t('x+' + o.h + '\\ge 0') + '.'], rHint: 'Here the radicand is ' + t('x+' + o.h) + '.' });
      } }] },
    { num: 'B2', parts: [
      { id: 'B2', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var ab = r.sample([2, 3, 4, 5, 6], 2); return { m: r.pick([2, 3, 5, 6, 7]), a: ab[0], b: ab[1] }; }, function (o) { return o.a * o.a * o.m <= 200 && o.b * o.b * o.m <= 200 && !(o.m === 2 && o.a === 5 && o.b === 6); });
        var A = o.a * o.a * o.m, Bv = o.b * o.b * o.m, P = 2 * o.a + o.b;
        return R.part('An isosceles triangle has two equal sides of length ' + t(rt(2, A)) + ' cm and a base of length ' + t(rt(2, Bv)) + ' cm. Determine its perimeter in simplest form.', P + rt(2, o.m), { unit: 'cm', after: 'cm', text: 'isosceles perimeter',
          sol: t('P=2\\left(' + o.a + rt(2, o.m) + '\\right)+' + o.b + rt(2, o.m) + '=' + P + rt(2, o.m)) + ' cm', hints: ['An isosceles triangle has <b>two</b> equal sides plus the base.', 'Simplify each radical first.'],
          cands: [{ tex: (o.a + o.b) + rt(2, o.m), code: 'u2l3-perim-side', hint: 'Count the equal side twice: ' + t('P=2s+b') + '.' }] });
      } }] },
    { num: 'B3', parts: [
      { id: 'B3', level: 'ADV', make: function (r) {
        var g = triOnGrid(r, [JSON.stringify([[0, 0], [3, 3], [5, -1]])]), pts = [g.P, g.Q, g.R];
        return triPerimPart(['A', 'B', 'C'], pts, 'A triangle has vertices ' + t('A(' + g.P.join(',\\ ') + ')') + ', ' + t('B(' + g.Q.join(',\\ ') + ')') + ' and ' + t('C(' + g.R.join(',\\ ') + ')') + '. Determine its perimeter in simplest form.', { text: 'perimeter from vertices' });
      } }] },
    { num: 'B4', parts: [
      { id: 'B4', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7], 2); return { p: pq[0], q: pq[1], f: r.int(2, 6), w1: r.int(1, 4), w2: r.int(1, 4) }; }, function (o) { return o.f * o.f * o.p <= 200 && !(o.p === 3 && o.f === 5 && o.q === 2); });
        var Lr = o.f * o.f * o.p, Pp = 2 * (o.f + o.w1), Pq = 2 * o.w2, ptex = Pp + rt(2, o.p) + '+' + Pq + rt(2, o.q), half = R.tex([T(o.f + o.w1, 2, o.p), T(o.w2, 2, o.q)]), key = R.tex([T(o.w1, 2, o.p), T(o.w2, 2, o.q)]);
        return R.part('A rectangle has length ' + t(rt(2, Lr)) + ' m and perimeter ' + t(ptex) + ' m. Determine its width in simplest form.', key, { before: t('w='), unit: 'm', after: 'm', text: 'width from perimeter',
          sol: 'Length ' + t('+') + ' width ' + t('=' + half) + '. Width ' + t('=' + half + '-' + o.f + rt(2, o.p) + '=' + key) + ' m',
          hints: ['Half the perimeter is length ' + t('+') + ' width.', 'Simplify the length, then subtract.'],
          cands: [{ tex: R.tex([T(Pp - o.f, 2, o.p), T(Pq, 2, o.q)]), code: 'u2l3-width-half', hint: 'Halve the perimeter first: it holds two lengths and two widths.' }] });
      } }] },
    { num: 'B5', parts: [
      { id: 'B5', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5]), k: r.pick([4, 5, 6, 7, 8]) }; }, function (o) { return !(o.m === 2 && o.k === 6); });
        var k = o.k, m = o.m, half = k % 2 === 0 ? k / 2 : null;
        var A = { html: t(rt(2, k * k * m)), right: false, why: t(R.simpStep(2, k * k * m)) + ': it is equal.' };
        var Bo = half ? { html: t(rt(2, half * half * m) + '+' + rt(2, half * half * m)), why: 'Each is ' + t(half + rt(2, m)) + '; the sum is ' + t(k + rt(2, m)) + ': it is equal.' } : { html: t(rt(2, 4 * m) + '+' + rt(2, (k - 2) * (k - 2) * m)), why: t('2' + rt(2, m) + '+' + (k - 2) + rt(2, m) + '=' + k + rt(2, m)) + ': it is equal.' };
        var C = { html: t(rt(2, (k - 1) * (k - 1) * m) + '+' + rt(2, m)), why: t((k - 1) + rt(2, m) + '+' + rt(2, m) + '=' + k + rt(2, m)) + ': it is equal.' };
        var D = { html: t(rt(2, k * k) + '+' + rt(2, m)), right: true };
        return R.mcPart(r, 'Which expression is <b>not</b> equal to ' + t(k + rt(2, m)) + '?', [A, Bo, C, D], 'D: ' + t(rt(2, k * k) + '+' + rt(2, m) + '=' + k + '+' + rt(2, m)) + ', which is not ' + t(k + rt(2, m)) + ' (a rational term and a radical don’t combine).', H_SIMP, 'which is not equal');
      } }] },
    { num: 'B6', parts: [
      { id: 'B6', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var abc = r.sample([2, 3, 4, 5], 3); return { m: r.pick([2, 3, 5, 6, 7]), c: r.int(2, 3), a: abc[0], b: abc[1], d: abc[2] }; }, function (o) { var k = o.c * o.a + o.b - o.d; return k > 0 && [o.a, o.b, o.d].every(function (x) { return x * x * o.m <= 200; }) && !(o.m === 7 && o.c === 3 && o.a === 2 && o.b === 5 && o.d === 3); });
        var E = [o.a * o.a * o.m, o.b * o.b * o.m, o.d * o.d * o.m], k = o.c * o.a + o.b - o.d;
        return R.nrPart('<b>Numerical response.</b> When ' + t(o.c + rt(2, E[0]) + '+' + rt(2, E[1]) + '-' + rt(2, E[2])) + ' is written in the form ' + t('a' + rt(2, o.m)) + ', the value of ' + t('a') + ' is ____.', k,
          [[o.a + o.b - o.d, 'u2l3-coef-skip', 'Don’t lose the ' + t(o.c) + ' in front: ' + t(o.c + '\\left(' + o.a + rt(2, o.m) + '\\right)=' + o.c * o.a + rt(2, o.m)) + '.']],
          t(o.c * o.a + rt(2, o.m) + '+' + o.b + rt(2, o.m) + '-' + o.d + rt(2, o.m) + '=' + k + rt(2, o.m)) + ', so ' + t('a=' + k) + '.', H_SIMP, 'NR combine');
      } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'C1a', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), f: r.int(2, 3) }; }, function (o) { return !(o.m === 3 && o.f === 2); });
        var A = o.m, Bv = o.f * o.f * o.m, S = (o.f + 1) * (o.f + 1) * o.m;
        return R.mcPart(r, 'It is true that ' + t(rt(2, A) + '+' + rt(2, Bv) + '=' + rt(2, S)) + ', even though ' + t(A + '+' + Bv + '\\ne ' + S) + '. Why?', [
          { html: t(rt(2, A) + '+' + o.f + rt(2, o.m) + '=' + (o.f + 1) + rt(2, o.m)) + ' and ' + t(rt(2, S) + '=' + (o.f + 1) + rt(2, o.m)) + ': once simplified they are like radicals.', right: true },
          { html: 'Because ' + t('\\sqrt{a}+\\sqrt{b}=\\sqrt{a+b}') + ' whenever the answer is a whole number.', why: 'Radicands never add: ' + t('\\sqrt{a}+\\sqrt{b}\\ne\\sqrt{a+b}') + '. Simplify each side instead.' },
          { html: 'Because ' + t(rt(2, A) + '\\times' + rt(2, Bv) + '=' + rt(2, S)) + '.', why: 'Check: ' + t(rt(2, A) + '\\times' + rt(2, Bv) + '=' + rt(2, A * Bv) + '=' + (o.f * o.m)) + ' — that isn’t it.' },
          { html: 'It isn’t really true — it is only approximately equal.', why: 'It is exactly true: simplify ' + t(rt(2, Bv)) + ' and ' + t(rt(2, S)) + '.' }],
          t(rt(2, A) + '+' + rt(2, Bv) + '=' + rt(2, A) + '+' + o.f + rt(2, o.m) + '=' + (o.f + 1) + rt(2, o.m)) + ' and ' + t(rt(2, S) + '=' + R.simpStep(2, S).split('=').pop()) + '. They are like radicals once simplified.', H_SIMP, 'show that');
      } },
      { id: 'C1b', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), n: r.int(3, 6) }; }, function (o) { return o.n * o.n * o.m <= 300 && !(o.m === 5 && o.n === 4); });
        var S = o.n * o.n * o.m, k = (o.n - 1) * (o.n - 1) * o.m;
        var p = R.nrPart('Determine the whole number ' + t('k') + ' for which ' + t(rt(2, o.m) + '+\\sqrt{k}=' + rt(2, S)) + '.', k,
          [[S - o.m, 'u2l3-k-sum', 'Radicands don’t add or subtract. Simplify ' + t(rt(2, S)) + ' first.'], [o.n - 1, 'u2l3-k-root', 'That is the coefficient: ' + t('\\sqrt{k}=' + (o.n - 1) + rt(2, o.m)) + '. Write it as an entire radical to find ' + t('k') + '.']],
          t(rt(2, S) + '=' + o.n + rt(2, o.m)) + ', so ' + t('\\sqrt{k}=' + (o.n - 1) + rt(2, o.m) + '=\\sqrt{' + (o.n - 1) * (o.n - 1) + '\\cdot ' + o.m + '}=\\sqrt{' + k + '}') + ' and ' + t('k=' + k) + '.', ['Simplify ' + t(rt(2, S)) + '; ' + t('\\sqrt{k}') + ' must be a multiple of ' + t(rt(2, o.m)) + '.', 'Write that multiple as an entire radical.'], 'find k');
        p.input = { type: 'number' };
        return p;
      } }] },
    { num: 'C2', parts: [
      { id: 'C2', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), f: r.int(2, 3), top: r.pick([50, 100, 100]) }; }, function (o) { return !(o.m === 3 && o.f === 2 && o.top === 100); });
        var E = o.f * o.f * o.m, want = []; for (var j = 1; o.m * j * j <= o.top; j++) want.push(o.m * j * j);
        var check = function (resp) {
          var got = (resp || []).map(Number).filter(function (x) { return isFinite(x); });
          if (!got.length) return form('empty', 'Add the values of ' + t('k') + ' one at a time.');
          var extra = got.filter(function (x) { return want.indexOf(x) < 0; }), miss = want.filter(function (x) { return got.indexOf(x) < 0; });
          if (extra.length) return wrong('u2l3-list-extra', t('\\sqrt{' + extra[0] + '}') + (ex.nthFactor(extra[0], 2) > 1 ? '=' + R.simpStep(2, extra[0]).split('=').pop() : '') + ' isn’t a multiple of ' + t(rt(2, o.m)) + ', so it won’t combine with ' + t(o.f + rt(2, o.m)) + '.');
          if (miss.length) return wrong('u2l3-list-miss', 'You have ' + got.length + ' of the ' + want.length + ' values. ' + t('k') + ' must be ' + t(o.m) + ' times a perfect square: ' + t(o.m + '\\cdot 1,\\ ' + o.m + '\\cdot 4,\\ ' + o.m + '\\cdot 9,\\ \\dots') + ' up to ' + t(o.top) + '.');
          return ok();
        };
        return { prompt: 'List every whole number ' + t('k') + ' from 1 to ' + o.top + ' for which ' + t(rt(2, E) + '+\\sqrt{k}') + ' can be written as a single radical.', input: { type: 'list' }, check: check, key: want.slice(), answer: t(want.join(',\\ ')),
          solution: t(R.simpStep(2, E)) + ', so ' + t('\\sqrt{k}') + ' must be a multiple of ' + t(rt(2, o.m)) + ': ' + t('k=' + o.m + 'j^{2}') + '.<br>' + t('k=' + want.join(',\\ ')), hints: ['Simplify ' + t(rt(2, E)) + ' first.', t('\\sqrt{k}') + ' has to be a like radical: ' + t('\\sqrt{k}=j' + rt(2, o.m)) + ', so ' + t('k=' + o.m + 'j^{2}') + '.'], text: 'list every k', bad: [want.slice(1), want.concat([o.m * 2 + 1 === want[1] ? o.m * 3 : o.m * 2])] };
      } }] },
    { num: 'C3', parts: [
      { id: 'C3', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(1, 4), k: r.int(4, 6), d: r.int(1, 4), j: 0 }; }, function (o) { var b = o.a + (o.k - 1) * o.d; return b * b * o.m <= 1000 && !(o.m === 3 && o.a === 2 && o.k === 5 && o.d === 2); });
        o.j = 2 + (o.k % 2 === 0 ? 1 : 0); if (o.j >= o.k) o.j = 2;
        var b = o.a + (o.k - 1) * o.d, t1 = o.a * o.a * o.m, tk = b * b * o.m, dK = (o.d === 1 ? '' : o.d) + rt(2, o.m), tj = (o.a + (o.j - 1) * o.d) + rt(2, o.m);
        return R.fieldsPart('In an arithmetic sequence, ' + t('t_1=' + rt(2, t1)) + ' and ' + t('t_' + o.k + '=' + rt(2, tk)) + '. Determine ' + t('d') + ' and ' + t('t_' + o.j) + ' in simplest form.', [
          { label: t('d='), name: 'd', key: dK, cands: [{ tex: ((b - o.a) === 1 ? '' : (b - o.a)) + rt(2, o.m), code: 'u2l3-solve-step', hint: 'That is ' + t((o.k - 1) + 'd') + '. Divide by ' + t(o.k - 1) + '.' }] },
          { label: t('t_' + o.j + '='), name: 't' + o.j, key: tj }],
          { text: 'two terms of an arithmetic sequence', sol: t('t_' + o.k + '=t_1+' + (o.k - 1) + 'd') + ': ' + t(b + rt(2, o.m) + '=' + (o.a === 1 ? '' : o.a) + rt(2, o.m) + '+' + (o.k - 1) + 'd\\Rightarrow ' + (o.k - 1) + 'd=' + (b - o.a) + rt(2, o.m) + '\\Rightarrow d=' + dK) + '<br>' + t('t_' + o.j + '=' + (o.a === 1 ? '' : o.a) + rt(2, o.m) + '+' + (o.j - 1) + '\\left(' + dK + '\\right)=' + tj),
            hints: ['Simplify both terms first.', t('t_' + o.k + '=t_1+' + (o.k - 1) + 'd') + ': solve for ' + t('d') + '.'] });
      } }] }
  ];

  HW.defineLesson({ id: 'u2l3', unit: 2, num: '3', title: 'Adding and Subtracting Radicals', outcome: 'AN2', calc: false, questions: QUESTIONS, extra: EXTRA });
})(window);
