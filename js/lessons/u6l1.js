/* Math 20-1 · Unit 6 · Lesson 1 — Rational Expressions and Non-Permissible Values (outcome AN4 on every part)
 * Assignment 1 (m201book unit6/u6_l01.tex, Questions 1–18) and the Lesson 1 Extra Practice (u6_ep01.tex, A1–A3, B4–B10,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's
 * example numbers and the booklet question's own numbers are left out). Calculator allowed; answers stay exact.
 * Conversions: "Is it a rational expression? Explain" -> multiple choice with the reasons; "describe / explain" (table
 * near an NPV, Jaden's error, the meaning of an NPV in context) -> multiple choice; tables -> labelled boxes (a value or
 * "undefined"); "factor the denominator and state the NPVs" -> two boxes; numerical response -> a 4-character box.
 * Recognised mistakes: NPVs from the numerator, after cancelling, with the wrong signs, from only one denominator,
 * "none" for a sum of squares mistaken for a difference, y left out of two-variable NPVs; evaluating: undefined where it has
 * a value (a numerator of 0), a value where it is undefined, −x² for (−x)²; working backwards: k given for the NPV.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q6(i), Q18, Extra C1, C2, C3.
 *
 * ============================================================================================================
 * HW.u6kit — the Unit 6 practice kit (defined here; later Unit 6 lesson files reuse it: load this file first)
 * ============================================================================================================
 *   var U = HW.u6kit, P = HW.poly;
 *   Codes:     U.codes('u6l3-') registers the kit's mistake codes (npv-num, npv-cancel, npv-missing, npv-extra, npv-sign,
 *              npv-none, npv-one, npv-noy, npv-wrong, ev-undef, ev-def, ev-slip, opp, terms, mono-exp, mono-coef, k-gave,
 *              recip-num) under a lesson prefix, with partial credit. Format nudges use shared 'u6k-…' codes.
 *              Every builder takes s.cp (that prefix; default 'u6k-').
 *   Polys:     U.lin(a, b, v) = a·v + b;  U.mono(c, {x:2});  U.fromRoots([r…], v) = ∏(q·v − p) for r = p/q;
 *              U.ratRoots(poly, v) -> the distinct rational roots [[p,q]…] (sorted);  U.subTex(poly, {x: r}) -> the
 *              substitution written out, e.g. 3(2)^{2}-5(2);  U.pt(poly) = P.tex; U.pta(poly) ascending.
 *   Reduce:    U.reduce(numFactors, denFactors) -> { N, D (originals, expanded), T: { N, D } (lowest terms, signs folded
 *              into N), tex (the simplified answer in factored form, e.g. -\frac{x+3}{2(x-1)}), cut (a factor was divided out) }.
 *              Factors are polys / LaTeX / numbers, or { p, k } for a power; opposite factors (3 − x and x − 3) cancel to −1.
 *   NPVs:      maps { x: [3, [-2, 3]] } (numbers / [p,q] / LaTeX like '4y' or '\frac{y}{2}' for two-variable NPVs; {} = none).
 *              U.npvTex(map) -> 'x\ne\pm 4' …;  U.npvOf(D, v) -> the map from a denominator (or a list of them);
 *              U.npvCheck(map, { v, cp, wrongs: [{ vals: map, code, hint }] }) -> checker for "x ≠ 3, −2", "x ≠ ±4",
 *              "3, −2", "a ≠ 0, b ≠ 0", "x ≠ ±7y", "none" (x = 3 gets a format nudge; another letter gets a nudge).
 *   Checkers:  U.ratCheck({ N, D }, { cp, vars, dl: [{ N, D, code, hint }], npvBox }) — value at six points, then form:
 *              one fraction, lowest terms (the written denominator has the degree of the simplest one; numbers reduced),
 *              integers not decimals; factored or expanded both fine; the opposite of the answer gets the 'opp' hint.
 *              U.valCheck(value | null, { cp, cands: [[value, code, hint]] }) — an exact number or "undefined" (null).
 *              U.recipCheck(roots, { v, cp }) — "1 over an expanded polynomial whose real zeros are exactly these" (any
 *              constant multiple, any extra factor with no real zeros; roots [] = no NPVs).
 *   Parts:     U.simpPart(prompt, s) — "Simplify. State the NPVs": two boxes. s: { num, den (factor lists, as for U.reduce)
 *              | N, D, T, key; v; npv (map; default: from the original denominator); dl; nw: [{ vals, code, hint }];
 *              sol, hints, text, cp }. Automatic NPV diagnoses: NPVs of the simplified denominator (npv-cancel), zeros of
 *              the numerator (npv-num), "none".
 *              U.ratPart(prompt, s) — one rational-expression box (s: { T, key, dl, vars, before, … }).
 *              U.npvPart(prompt, s) — s: { D (poly or list), N (for numerator-zero diagnoses), npv, v, nw, … }.
 *              U.factNpvPart(prompt, s) — "Factor the denominator and state the NPVs": s: { fact (factored LaTeX), D, … }.
 *              U.valPart(prompt, value | null, s) and U.valTable(prompt, [{ label, val, cands }], s) — evaluating.
 *              U.recipPart(prompt, roots, s) — write 1/(expanded denominator) with these NPVs.
 *              U.mc(r, prompt, opts, sol, hints, text) — multiple choice, duplicate options dropped.
 *   Keypads:   'u6k' (expressions and NPVs: ≠, ±, commas, the question's letters), 'u6kn' (the same with none),
 *              'u6kv' (a value or undefined).
 */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!P || !HW.factor) throw new Error('js/lessons/u6l1.js needs js/poly.js and js/factor.js');
  var FT = HW.factor;

  /* ======================================================================================================
   * HW.u6kit
   * ====================================================================================================== */
  var U = HW.u6kit = {};
  var KC = {
    'npv-num': ['NPVs: used a zero of the numerator', 'b'], 'npv-cancel': ['NPVs taken after dividing out a factor (one missing)', 's'],
    'npv-missing': ['NPVs: missed one', 's'], 'npv-extra': ['NPVs: listed a value that is not an NPV', 's'], 'npv-sign': ['NPVs with the wrong signs', 'b'],
    'npv-none': ['Said there are no NPVs', 'b'], 'npv-one': ['NPVs of only one denominator', 'b'], 'npv-noy': ['Two-variable NPVs: left out the other variable', 'b'],
    'npv-wrong': ['Right expression, NPVs wrong or missing', 'b'], 'ev-undef': ['Evaluating: said undefined when it has a value', 'n'],
    'ev-def': ['Evaluating: gave a value where it is undefined', 'n'], 'ev-slip': ['Evaluating: substitution slip', 's'],
    opp: ['Opposite factors: lost the −1', 'b'], terms: ['Divided out terms instead of factors', 'n'], 'mono-exp': ['Monomials: a power on the wrong side', 'b'],
    'mono-coef': ['Monomials: coefficients not divided correctly', 's'], 'k-gave': ['Gave k (or the given value) instead of what was asked', 'b'],
    'recip-num': ['Expression with these NPVs: wrong denominator', 'n']
  };
  var REG = {};
  U.codes = function (cp) {
    if (REG[cp]) return; REG[cp] = 1;
    var c = {}, pa = {};
    Object.keys(KC).forEach(function (k) { c[cp + k] = KC[k][0]; if (KC[k][1]) pa[cp + k] = KC[k][1]; });
    HW.addCodes(c); HW.addPartial(pa);
  };
  HW.addCodes({ 'u6k-single': 'Not written as a single fraction (format)', 'u6k-lowest': 'Not in lowest terms: a common factor left (format)', 'u6k-reduce': 'Numbers in the fraction not reduced (format)',
    'u6k-tidy': 'Numerator or denominator not simplified (format)', 'u6k-decimal': 'Decimal coefficients instead of exact ones (format)', 'u6k-npvletter': 'NPVs written for the wrong letter (format)',
    'u6k-ne': 'NPVs written with = instead of ≠ (format)', 'u6k-npvbox': 'NPVs typed in the expression box (format)', 'u6k-expand': 'Denominator not expanded (format)', 'u6k-num1': 'Numerator not 1 (format)',
    'u6k-const': 'Constant denominator where a polynomial was meant (format)', 'u6k-factored': 'Not in factored form (format)', 'u6k-radical': 'Radical answer not simplified (format)' });
  U.codes('u6k-');

  /* ---------- small tools ---------- */
  var gcd = function (a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); };
  function lcm(a, b) { return Math.abs(a) / gcd(a, b) * Math.abs(b); }
  function R(x) { return Array.isArray(x) ? ex.norm(x[0], x[1]) : [x, 1]; }
  function rv(x) { x = R(x); return x[0] / x[1]; }
  function rt(x) { return ex.texRat(R(x)); }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function pickWhere(gen, test, n) { for (var i = 0; i < (n || 8000); i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u6kit: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function mon(v, e) { var o = {}; if (e) o[v] = e; return o; }
  function qd(a, b) { return ex.norm(a[0] * b[1], a[1] * b[0]); }
  function qm(a, b) { return ex.norm(a[0] * b[0], a[1] * b[1]); }
  function qa(a, b) { return ex.norm(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function lin(a, b, v) { return P.add(P.mono(a, mon(v || 'x', 1)), P.num(b)); }
  function pt(p) { return P.tex(p); }
  function pta(p) { return P.tex(p, { order: 'asc' }); }
  function frac(n, d) { return d === '1' ? n : '\\frac{' + n + '}{' + d + '}'; }
  function dfrac(n, d) { return d === '1' ? n : '\\dfrac{' + n + '}{' + d + '}'; }
  function sg(n) { return n < 0 ? '-' + (-n) : '+' + n; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function coefT(c) { return c === 1 ? '' : c === -1 ? '-' : String(c); }
  function astVars(a) { var acc = {}; (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'var') acc[x.n] = 1; ['a', 'b', 'n'].forEach(function (k) { if (x[k] && typeof x[k] === 'object') w(x[k]); }); })(a); return Object.keys(acc); }
  function hasVar(x) { if (!x || typeof x !== 'object') return false; if (x.t === 'var') return true; return hasVar(x.a) || hasVar(x.b); }
  function hasVarDiv(x) { if (!x || typeof x !== 'object') return false; if (x.t === 'div' && hasVar(x.b)) return true; return hasVarDiv(x.a) || hasVarDiv(x.b); }
  function hasDiv(x) { if (!x || typeof x !== 'object') return false; if (x.t === 'div') return true; return hasDiv(x.a) || hasDiv(x.b); }
  function divisors(n) { n = Math.abs(n); var o = []; for (var i = 1; i <= n; i++) if (n % i === 0) o.push(i); return o; }
  U.gcd = gcd; U.lcm = lcm; U.R = R; U.rv = rv; U.rt = rt; U.uniq = uniq; U.pickWhere = pickWhere; U.nz = nz; U.mon = mon;
  U.lin = lin; U.pt = pt; U.pta = pta; U.frac = frac; U.dfrac = dfrac; U.sg = sg; U.par = par; U.coefT = coefT; U.qd = qd; U.qm = qm; U.qa = qa;
  U.mono = function (c, v) { return P.mono(c, v); };
  U.fromRoots = function (roots, v) { return roots.reduce(function (acc, r) { r = R(r); return P.mul(acc, lin(r[1], -r[0], v)); }, P.num(1)); };
  U.vars = function () { var o = []; for (var i = 0; i < arguments.length; i++) o = o.concat(arguments[i] ? P.vars(arguments[i]) : []); return uniq(o).sort(); };
  /* the substitution written out: 3(2)^{2}-5(2)+1 */
  U.subTex = function (p, env) {
    var out = '';
    P.sorted(p).forEach(function (T, i) {
      var c = T.c, neg = c[0] < 0, ac = [Math.abs(c[0]), c[1]], vs = Object.keys(T.v).sort();
      var body = vs.map(function (v) { var x = R(env[v]), s = x[1] !== 1 ? '\\left(' + rt(x) + '\\right)' : '(' + x[0] + ')'; return s + (T.v[v] > 1 ? '^{' + T.v[v] + '}' : ''); }).join('');
      var ct = ac[1] === 1 ? (vs.length && ac[0] === 1 ? '' : String(ac[0])) : '\\frac{' + ac[0] + '}{' + ac[1] + '}';
      out += (neg ? '-' : i ? '+' : '') + ct + body;
    });
    return out || '0';
  };
  U.at = function (p, env) { return P.atExact(p, env); };

  /* rational roots of a one-variable polynomial (distinct, sorted) */
  function ratRoots(p, v) {
    v = v || 'x';
    if (P.vars(p).some(function (w) { return w !== v; })) return [];
    var deg = P.degreeIn(p, v); if (!(deg >= 1)) return [];
    var cs = []; for (var e = 0; e <= deg; e++) cs.push(P.coef(p, mon(v, e)));
    var L = cs.reduce(function (l, c) { return lcm(l, c[1]); }, 1), ci = cs.map(function (c) { return c[0] * (L / c[1]); });
    var out = [], lo = 0; while (ci[lo] === 0) lo++;
    if (lo > 0) out.push([0, 1]);
    if (deg - lo >= 1) {
      var A = divisors(ci[lo]), Bq = divisors(ci[deg]);
      A.forEach(function (a) { Bq.forEach(function (q) { [a, -a].forEach(function (s) { var r = ex.norm(s, q), env = {}; env[v] = r; if (out.some(function (o) { return o[0] === r[0] && o[1] === r[1]; })) return; if (P.atExact(p, env)[0] === 0) out.push(r); }); }); });
    }
    return out.sort(function (a, b) { return a[0] / a[1] - b[0] / b[1]; });
  }
  U.ratRoots = ratRoots;
  /* p ÷ (v − r) for a root r (synthetic division) */
  function divRoot(p, r, v) {
    var deg = P.degreeIn(p, v), cs = [], acc = [0, 1], out = [], q = P.num(0);
    for (var e = deg; e >= 0; e--) cs.push(P.coef(p, mon(v, e)));
    cs.forEach(function (c) { acc = qa(qm(acc, r), c); out.push(acc); });
    out.pop();
    out.forEach(function (c, i) { q = P.add(q, P.mono(c, mon(v, deg - 1 - i))); });
    return q;
  }
  U.divRoot = divRoot;
  function hasRealRoot(p, v) {
    var deg = P.degreeIn(p, v); if (deg < 1) return false;
    if (deg % 2 === 1) return true;
    if (deg === 2) { var a = rv(P.coef(p, mon(v, 2))), b = rv(P.coef(p, mon(v, 1))), c = rv(P.constant(p)); return b * b - 4 * a * c >= -1e-12; }
    var env = {}, prev = null;
    for (var x = -60; x <= 60; x += 0.005) { env[v] = x; var y = P.at(p, env); if (Math.abs(y) < 1e-9) return true; if (prev != null && (prev < 0) !== (y < 0)) return true; prev = y; }
    return false;
  }

  /* ---------- reducing a quotient of factor lists ---------- */
  function liftList(list) { return (list || []).map(function (f) { return f && f.p ? { p: P.lift(f.p), k: f.k || 1 } : { p: P.lift(f), k: 1 }; }); }
  function sideTex(co, mo, prims) {
    var m = P.tex(P.mono(co, mo)); if (m === '1') m = '';
    if (!prims.length) return m || '1';
    if (!m && prims.length === 1 && prims[0].k === 1) return P.tex(prims[0].p);
    return m + prims.map(function (f) { return '(' + P.tex(f.p) + ')' + (f.k > 1 ? '^{' + f.k + '}' : ''); }).join('');
  }
  function sidePoly(co, mo, prims) { return prims.reduce(function (acc, f) { return P.mul(acc, P.pow(f.p, f.k)); }, P.mono(co, mo)); }
  U.reduce = function (numList, denList) {
    var nl = liftList(numList), dl = liftList(denList);
    var N = nl.reduce(function (a, f) { return P.mul(a, P.pow(f.p, f.k)); }, P.num(1)), D = dl.reduce(function (a, f) { return P.mul(a, P.pow(f.p, f.k)); }, P.num(1));
    var fn = FT.normal(nl), fd = FT.normal(dl), c = qd(fn.c, fd.c), sign = c[0] < 0 ? -1 : 1;
    var mn = {}, md = {}, cut = false;
    uniq(Object.keys(fn.v).concat(Object.keys(fd.v))).forEach(function (x) { var e = (fn.v[x] || 0) - (fd.v[x] || 0); if (e > 0) mn[x] = e; else if (e < 0) md[x] = -e; if ((fn.v[x] || 0) && (fd.v[x] || 0)) cut = true; });
    var pn = [], pd = [];
    uniq(Object.keys(fn.keys).concat(Object.keys(fd.keys))).forEach(function (k) { var e = (fn.keys[k] || 0) - (fd.keys[k] || 0), p = fn.prims[k] || fd.prims[k]; if ((fn.keys[k] || 0) && (fd.keys[k] || 0)) cut = true; if (e > 0) pn.push({ p: p, k: e }); else if (e < 0) pd.push({ p: p, k: -e }); });
    var TN = P.scale(sidePoly(Math.abs(c[0]), mn, pn), sign), TD = sidePoly(c[1], md, pd);
    var nt = sideTex(Math.abs(c[0]), mn, pn), dt = sideTex(c[1], md, pd), bareSum = Math.abs(c[0]) === 1 && !Object.keys(mn).length && pn.length === 1 && pn[0].k === 1, tex;
    if (dt === '1') tex = sign < 0 ? (bareSum ? '-(' + nt + ')' : '-' + nt) : nt;
    else tex = (sign < 0 ? '-' : '') + frac(nt, dt);
    return { N: N, D: D, T: { N: TN, D: TD }, tex: tex, cut: cut };
  };

  /* ---------- NPV maps ---------- */
  var LET = 'abcdefghijklmnopqrstuvwxyz', VP = [1.37, -2.29, 3.61, 0.43, -0.77, 2.93, -3.47, 4.19, 1.83, -1.21];
  var VENV = [0, 1, 2].map(function (i) { var e = {}; LET.split('').forEach(function (c, j) { e[c] = VP[(i * 3 + j) % 10] + 0.013 * j; }); return e; });
  function nvOf(x) {
    if (x && x.ast) return x;
    var tex = typeof x === 'string' ? x : rt(x), p = ex.parse(tex);
    if (!p.ok) throw new Error('u6kit: bad NPV ' + tex);
    return { tex: tex, ast: p.ast };
  }
  function vval(a, e) { return ex.value(a.ast, e); }
  function veq(a, b) { return VENV.every(function (e) { var x = vval(a, e), y = vval(b, e); return isFinite(x) && isFinite(y) && Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(x), Math.abs(y)); }); }
  function vnegOf(a, b) { return VENV.every(function (e) { var x = vval(a, e), y = vval(b, e); return isFinite(x) && isFinite(y) && Math.abs(x + y) < 1e-9 * Math.max(1, Math.abs(x)) && Math.abs(x) > 1e-9; }); }
  function vhas(list, a) { return list.some(function (b) { return veq(a, b); }); }
  function nmap(m) { var o = {}; Object.keys(m || {}).forEach(function (v) { var l = []; (m[v] || []).forEach(function (x) { var y = nvOf(x); if (!vhas(l, y)) l.push(y); }); if (l.length) o[v] = l; }); return o; }
  function mapEq(A, Bm) { var ks = uniq(Object.keys(A).concat(Object.keys(Bm))); return ks.every(function (v) { var x = A[v] || [], y = Bm[v] || []; return x.every(function (z) { return vhas(y, z); }) && y.every(function (z) { return vhas(x, z); }); }); }
  U.npvTex = function (m) {
    m = nmap(m); var vs = Object.keys(m).sort(); if (!vs.length) return '\\text{none}';
    return vs.map(function (v) {
      var l = m[v], used = [], out = [];
      l.forEach(function (a, i) {
        if (used[i]) return;
        var j = -1; for (var k = i + 1; k < l.length; k++) if (!used[k] && vnegOf(a, l[k])) { j = k; break; }
        if (j >= 0) { used[j] = 1; out.push('\\pm ' + (a.tex.charAt(0) === '-' ? l[j].tex : a.tex)); } else out.push(a.tex);
      });
      return v + '\\ne ' + out.join(',\\ ');
    }).join(',\\ ');
  };
  U.npvEq = function (a, b) { return mapEq(nmap(a), nmap(b)); };
  U.npvOf = function (Ds, v) {
    Ds = Array.isArray(Ds) ? Ds : [Ds]; v = v || 'x'; var all = [];
    Ds.forEach(function (D) { ratRoots(P.lift(D), v).forEach(function (r) { if (!all.some(function (o) { return o[0] === r[0] && o[1] === r[1]; })) all.push(r); }); });
    var o = {}; if (all.length) o[v] = all; return o;
  };
  function npvParse(resp, dv) {
    var s = String(resp == null ? '' : resp).replace(/\\(left|right)/g, '').replace(/\\(text|mathrm|textrm|operatorname)\{([^{}]*)\}/g, ' $2 ').replace(/\\[ ,;:!]|~|\\quad|\\qquad/g, ' ');
    if (/^\s*$/.test(s)) return { empty: true };
    var flat = s.replace(/\s+/g, ' ').trim().toLowerCase().replace(/\.$/, '');
    if (/^(none|no( real)?( npvs?| restrictions?| non-?\s*permissible values?| values?)?|there are none|nonpvs|\\emptyset|\\varnothing|∅|\\\{\s*\\\})$/.test(flat)) return { map: {} };
    s = s.replace(/\\not\s*=|\\neq?(?![a-zA-Z])|≠|!=|=\/=|<>/g, '≠').replace(/\b(and|or)\b/gi, ',').replace(/;/g, ',').replace(/\\pm(?![a-zA-Z])|±/g, '±').replace(/−/g, '-');
    var pieces = s.split(','), map = {}, cur = dv, any = false, eq = false;
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i].replace(/\s+/g, ''); if (!p) continue;
      var m = /^([a-zA-Z])≠(.*)$/.exec(p);
      if (m) { cur = m[1]; p = m[2]; }
      else { var m2 = /^([a-zA-Z])=(.*)$/.exec(p); if (m2) { eq = true; cur = m2[1]; p = m2[2]; } else if (/[≠=<>]/.test(p)) return { bad: true }; }
      if (!p) return { bad: true };
      var pm = p.charAt(0) === '±'; if (pm) p = p.slice(1);
      if (/\\times|\\cdot|[×*+]/.test(p) || /[0-9a-zA-Z})]-/.test(p)) return { unsimp: true };
      var r = ex.parse(p); if (!r.ok) return { bad: true };
      if (astVars(r.ast).indexOf(cur) >= 0) return { bad: true };
      var val = { tex: p, ast: r.ast };
      if (!VENV.every(function (e) { return isFinite(vval(val, e)); })) return { bad: true };
      map[cur] = map[cur] || []; map[cur].push(val); if (pm) map[cur].push({ tex: '-' + p, ast: { t: 'neg', a: r.ast } }); any = true;
    }
    if (!any) return { bad: true };
    return { map: map, eq: eq };
  }
  U.npvParse = npvParse;
  U.npvCheck = function (Tm, opt) {
    opt = opt || {}; var cp = opt.cp || 'u6k-';
    var T = nmap(Tm), vs = Object.keys(T), dv = opt.v || vs[0] || 'x';
    var wr = (opt.wrongs || []).map(function (w) { return { m: nmap(w.vals), code: w.code, hint: w.hint }; }).filter(function (w) { return !mapEq(w.m, T); });
    return function (resp) {
      var L = npvParse(resp, dv);
      if (L.empty) return form('empty', 'State the non-permissible values (or write “none”).');
      if (L.unsimp) return form('simplify', 'Write each NPV as a single number (no ' + t('\\times') + ', + or − between numbers).');
      if (L.bad) return form('unreadable', 'Write the NPVs like ' + t(dv + '\\ne 3,\\ -2') + ' (or ' + t(dv + '\\ne\\pm 4') + '), or “none” if there are none.');
      var A = L.map, ks = Object.keys(A);
      if (mapEq(A, T)) return L.eq ? form('u6k-ne', 'Right values — but write them with ' + t('\\ne') + ': ' + t(U.npvTex(Tm)) + ' (they are the values the variable cannot be).') : ok();
      if (vs.length === 1 && ks.length === 1 && ks[0] !== vs[0]) { var A2 = {}; A2[vs[0]] = A[ks[0]]; if (mapEq(A2, T)) return form('u6k-npvletter', 'Right values — but the variable here is ' + t(vs[0]) + '.'); }
      for (var i = 0; i < wr.length; i++) if (mapEq(A, wr[i].m)) return wrong(wr[i].code, wr[i].hint);
      if (!vs.length) return wrong(cp + 'npv-extra', opt.noneHint || 'Check the denominator: one with no variable, or one like ' + t(dv + '^{2}+4') + ' that is never ' + t(0) + ', gives no NPVs.');
      if (!ks.length) return wrong(cp + 'npv-none', 'There are NPVs: set each factor of the denominator equal to ' + t(0) + ' and solve.');
      var all = uniq(ks.concat(vs)), miss = 0, extra = 0, negd = true;
      all.forEach(function (v) { var x = A[v] || [], y = T[v] || []; y.forEach(function (z) { if (!vhas(x, z)) miss++; }); x.forEach(function (z) { if (!vhas(y, z)) { extra++; if (!y.some(function (w) { return vnegOf(z, w); })) negd = false; } }); if (x.length !== y.length) negd = false; });
      if (negd && extra) return wrong(cp + 'npv-sign', 'Check the signs: ' + t(dv + '-3=0') + ' gives ' + t(dv + '=3') + ', so the factor ' + t('(' + dv + '-3)') + ' gives ' + t(dv + '\\ne 3') + '.');
      if (miss && !extra) return wrong(cp + 'npv-missing', 'You are missing ' + (miss === 1 ? 'an NPV' : miss + ' NPVs') + '. Factor every denominator fully: each factor with a variable gives an NPV.');
      if (extra && !miss) return wrong(cp + 'npv-extra', 'You have ' + (extra === 1 ? 'a value that is not an NPV' : 'values that are not NPVs') + '. Only the denominators matter: a numerator equal to ' + t(0) + ' is allowed.');
      return wrong('value', 'Set each factor of each denominator equal to ' + t(0) + ' and solve.');
    };
  };

  /* ---------- a rational expression: value at six points, then form ---------- */
  var PTS = [1.37, -2.29, 3.61, 0.43, -0.77, 2.93, -3.47, 4.19, 1.83, -1.21];
  function envs(vars, Ds) {
    var out = [];
    for (var i = 0; out.length < 6 && i < 60; i++) {
      var env = {}; vars.forEach(function (v, j) { env[v] = PTS[(i + 3 * j) % PTS.length] + 0.011 * i; });
      if (Ds.every(function (D) { var d = P.at(D, env); return isFinite(d) && Math.abs(d) > 1e-4; })) out.push(env);
    }
    return out;
  }
  function polyOK(a) {
    while (a.t === 'paren') a = a.a;
    if (a.t === 'neg') return polyOK(a.a);
    if (a.t === 'mul' || (a.t === 'div' && !hasVar(a.b))) return polyOK(a.a) && polyOK(a.b);
    if (a.t === 'pow') { var b = a.a; while (b.t === 'paren') b = b.a; if (b.t === 'add' || b.t === 'sub') { var e = ex.rat(a.b); return !!e && e[1] === 1 && e[0] > 0 && polyOK(b); } }
    return P.formIssue(a) == null;
  }
  function content(p) { return P.terms(p).reduce(function (g, tm) { return tm.c[1] !== 1 ? -1 : g < 0 ? g : gcd(g, tm.c[0]); }, 0); }
  var RH = {
    single: 'Right value — now write it as a <b>single fraction</b>.',
    lowest: 'Right value, but it is not in lowest terms: the numerator and the denominator still share a factor. Factor both fully and divide out the common factors.',
    reduce: 'Right value — now reduce: the numbers in the numerator and the denominator share a common factor.',
    tidy: 'Right value — now simplify the numerator and the denominator (factored or expanded is fine).',
    decimal: 'That has decimals. Give the exact expression with integers, not decimals.'
  };
  function ratForm(ast, T) {
    if (ex.shape(ast).decimals) return form('u6k-decimal', RH.decimal);
    var top = ast; while (top.t === 'paren' || top.t === 'neg') top = top.a;
    var fz = ex.factors(top), all = fz.num.concat(fz.den);
    for (var i = 0; i < all.length; i++) {
      var f = all[i]; while (f.t === 'paren') f = f.a;
      if ((f.t === 'add' || f.t === 'sub') && hasVarDiv(f)) return form('u6k-single', RH.single);
      if (!polyOK(f)) return form(hasVarDiv(f) ? 'u6k-single' : 'u6k-tidy', hasVarDiv(f) ? RH.single : RH.tidy);
    }
    var Nw = P.num(1), Dw = P.num(1);
    try { fz.num.forEach(function (x) { Nw = P.mul(Nw, P.read(x).p); }); fz.den.forEach(function (x) { Dw = P.mul(Dw, P.read(x).p); }); } catch (e) { return form('u6k-tidy', RH.tidy); }
    if (P.degree(Dw) > P.degree(T.D)) return form('u6k-lowest', RH.lowest);
    var cN = content(Nw), cD = content(Dw);
    if (cN < 0 || cD < 0) return form('u6k-tidy', 'Right value — now clear the fractions inside the numerator and the denominator, so it is one fraction with integer coefficients.');
    if (cN > 0 && gcd(cN, cD) > 1) return form('u6k-reduce', RH.reduce);
    return null;
  }
  U.ratForm = ratForm;
  U.ratCheck = function (T, opt) {
    opt = opt || {}; var cp = opt.cp || 'u6k-';
    var vars = uniq(P.vars(T.N).concat(P.vars(T.D)).concat(opt.vars || [])).sort(), E = envs(vars, [T.D].concat(opt.avoid || []));
    function vals(N, D) { return E.map(function (e) { return P.at(N, e) / P.at(D, e); }); }
    function same(a, b) { return a.every(function (x, i) { return isFinite(x) && isFinite(b[i]) && ex.eq(x, b[i], 1e-7); }); }
    var tv = vals(T.N, T.D);
    var dl = (opt.dl || []).filter(function (d) { return d && d.N; }).map(function (d) { return { v: vals(d.N, d.D || P.num(1)), code: d.code, hint: d.hint }; }).filter(function (d) { return d.v.every(isFinite) && !same(d.v, tv); });
    return function (resp) {
      if (/\\neq?(?![a-zA-Z])|≠|!=/.test(String(resp == null ? '' : resp))) return form('u6k-npvbox', opt.npvBox ? 'Put only the simplified expression in this box — the NPVs go in their own box.' : 'Give just the expression here (no NPVs).');
      var a = K.read(resp); if (a.res) return a.res;
      var used = astVars(a.ast), extra = used.filter(function (v) { return vars.indexOf(v) < 0; });
      if (extra.length) return wrong('value', 'Use only the letter' + (vars.length > 1 ? 's ' : ' ') + vars.map(function (v) { return t(v); }).join(', ') + ' (you wrote ' + t(extra[0]) + ').');
      var sv = E.map(function (e) { return ex.value(a.ast, e); });
      if (same(sv, tv)) return (opt.form ? opt.form(a.ast) : null) || (opt.noForm ? null : ratForm(a.ast, T)) || ok();
      for (var i = 0; i < dl.length; i++) if (same(sv, dl[i].v)) return wrong(dl[i].code, dl[i].hint);
      if (same(sv, tv.map(function (x) { return -x; }))) return wrong(cp + 'opp', 'Check the sign: your answer is the opposite of the right one. Look for opposite factors such as ' + t('(a-b)') + ' and ' + t('(b-a)') + ', and for a minus sign in front of a fraction.');
      if (opt.diag) { var h = opt.diag(a.ast, sv, tv); if (h) return wrong(h.code, h.hint); }
      return wrong('value', opt.valueHint || null);
    };
  };

  /* ---------- a value, or "undefined" ---------- */
  function isUndef(resp) { var s = String(resp == null ? '' : resp).replace(/\\(text|mathrm|textrm)\{([^{}]*)\}/g, '$2').replace(/\\[ ,;:!]|~|\s+/g, '').toLowerCase(); return /^(undefined|undef\.?|und|novalue|dne|doesnotexist|notdefined|\\varnothing|∅)$/.test(s); }
  U.isUndef = isUndef;
  function terminating(r) { var q = R(r)[1]; while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; }
  U.valCheck = function (val, opt) {
    opt = opt || {}; var cp = opt.cp || 'u6k-', T = val == null ? null : R(val), Tv = T ? rv(T) : null;
    return function (resp) {
      if (isUndef(resp)) return T ? wrong(cp + 'ev-undef', opt.defHint || 'The denominator is not ' + t(0) + ' at this value, so the expression has a value' + (T[0] === 0 ? ' (a numerator of ' + t(0) + ' is fine: the value is ' + t(0) + ')' : '') + '. Substitute and simplify.') : ok();
      var a = K.read(resp); if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (Object.keys(sh.vars).length) return form('notnumber', 'Give a number' + (opt.noUndef ? '' : ' (or “undefined”)') + '.');
      if (!T) return wrong(cp + 'ev-def', opt.undefHint || 'Check the denominator at this value: it is ' + t(0) + ', so the expression is <b>undefined</b>' + (opt.noUndef ? '' : ' (type “undefined”)') + '.');
      if (!isFinite(a.val)) return wrong('value', null);
      var mv = ex.mixedValue(a.ast);
      if (mv != null) return ex.eq(mv, Tv) ? form('mixed-num', 'Right value! Write it as an improper fraction, not a mixed number.') : wrong('value', null);
      if (ex.eq(a.val, Tv) || (Tv === 0 && Math.abs(a.val) < 1e-12)) {
        var pf = ex.plainFraction(a.ast);
        if (sh.ops || sh.pow || sh.roots || sh.muls || (sh.divs && !pf)) return form('simplify', 'Right value — now simplify it to a single number.');
        if (pf && pf[1] !== 1 && gcd(pf[0], pf[1]) > 1) return form('lowest', 'Right value — now reduce the fraction to lowest terms.');
        return ok();
      }
      if (sh.decimals && !terminating(T) && Math.abs(a.val - Tv) < 0.01) return form('decimal-rounded', 'That decimal is close, but it isn’t exact. Give the exact value as a fraction.');
      var c = opt.cands || [];
      for (var i = 0; i < c.length; i++) if (c[i] && c[i][0] != null && isFinite(rv(c[i][0])) && ex.eq(a.val, rv(c[i][0])) && !ex.eq(rv(c[i][0]), Tv)) return wrong(c[i][1], c[i][2]);
      if (Tv !== 0 && ex.eq(a.val, -Tv)) return wrong('sign', 'Check the sign of your answer.');
      if (Tv !== 0 && ex.eq(a.val, 1 / Tv)) return wrong('flip', 'Your fraction is upside down: it is the numerator’s value over the denominator’s value.');
      return wrong(opt.slipCode || (cp + 'ev-slip'), opt.slipHint || 'Substitute carefully (brackets around negatives and fractions), then simplify the numerator and the denominator separately.');
    };
  };

  /* ---------- 1 over an expanded polynomial with exactly these NPVs ---------- */
  U.recipCheck = function (roots, opt) {
    opt = opt || {}; var cp = opt.cp || 'u6k-', v = opt.v || 'x', W = roots.map(R);
    function zero(D, r) { var e = {}; e[v] = r; return P.atExact(D, e)[0] === 0; }
    return function (resp) {
      if (/\\neq?(?![a-zA-Z])|≠|!=/.test(String(resp))) return form('u6k-npvbox', 'Give just the expression here (no NPVs).');
      var a = K.read(resp); if (a.res) return a.res;
      var top = a.ast; while (top.t === 'paren') top = top.a;
      if (top.t !== 'div') return wrong(cp + 'recip-num', 'Write a fraction: ' + t('1') + ' over a polynomial in ' + t(v) + '.');
      var Nr = P.read(top.a), Dr = P.read(top.b);
      if (!Nr.ok || !Dr.ok) return wrong(cp + 'recip-num', 'Write ' + t('1') + ' over a polynomial in ' + t(v) + ' (no variable in an exponent or under a root).');
      var D = Dr.p;
      if (P.vars(D).some(function (w) { return w !== v; }) || P.vars(Nr.p).some(function (w) { return w !== v; })) return wrong('value', 'Use only the variable ' + t(v) + '.');
      if (P.isZero(D)) return wrong('value', null);
      var miss = W.filter(function (r) { return !zero(D, r); });
      if (miss.length) {
        if (miss.length === W.length && W.every(function (r) { return zero(D, [-r[0], r[1]]); })) return wrong(cp + 'npv-sign', 'Check the signs: the NPV ' + t(v + '=' + rt(W[0])) + ' comes from the factor ' + t('(' + pt(lin(W[0][1], -W[0][0], v)) + ')') + '.');
        return wrong(cp + 'recip-num', 'Your denominator is not ' + t(0) + ' at ' + t(v + '=' + rt(miss[0])) + ', so that is not an NPV. Use a factor that is ' + t(0) + ' there: ' + t('(' + pt(lin(miss[0][1], -miss[0][0], v)) + ')') + '.');
      }
      var Q = D; W.forEach(function (r) { var e = {}; e[v] = r; while (P.degreeIn(Q, v) >= 1 && P.atExact(Q, e)[0] === 0) Q = divRoot(Q, r, v); });
      if (hasRealRoot(Q, v)) return wrong(cp + 'recip-num', 'Your denominator is ' + t(0) + ' at another value too, so it has an extra NPV. Use only the factors for the given NPVs' + (W.length ? '' : ' (or a denominator like ' + t(v + '^{2}+1') + ' that is never ' + t(0) + ')') + '.');
      if (!W.length && P.degreeIn(D, v) < 1) return form('u6k-const', 'True, there are no NPVs — but make the denominator a polynomial in ' + t(v) + ' that is never ' + t(0) + ', for example ' + t(v + '^{2}') + ' plus a positive number.');
      if (P.isZero(P.sub(Nr.p, P.num(1)))) { /* numerator 1 */ } else return form('u6k-num1', 'The NPVs are right — now use a numerator of ' + t('1') + ', as the question asks.');
      var fi = P.formIssue(top.b); if (fi && fi.code !== 'not-poly') return form('u6k-expand', 'Right NPVs — now <b>expand</b> the denominator (multiply out the brackets and collect like terms).');
      return ok();
    };
  };

  /* ---------- keypads ---------- */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = {
      del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, enter: { label: 'Check ↵', fn: 'enter', wide: true },
      left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      plus: { label: '+', tex: '+', plain: '+' }, minus: { label: '−', tex: '-', plain: '-' }, dot: { label: '.', tex: '.', plain: '.' },
      sq: { label: 'x<sup>2</sup>', tex: '^{2}', plain: '^2', title: 'Squared' }, pow: { label: 'x<sup>n</sup>', tex: '#@^{#?}', plain: '^', title: 'Exponent' },
      frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Brackets' },
      comma: { label: ',', tex: ',', plain: ', ' }, ne: { label: '≠', tex: '\\ne ', plain: ' != ', title: 'is not equal to' }, pm: { label: '±', tex: '\\pm ', plain: '±' },
      none: { label: 'none', tex: '\\text{none}', plain: 'none', title: 'There are none' }, undef: { label: 'undefined', tex: '\\text{undefined}', plain: 'undefined', title: 'Undefined (no value)' }
    };
    var vk = function (opt) { return (opt && opt.vars && opt.vars.length ? opt.vars : ['x']).slice(0, 6).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; }); };
    W.KEYSETS.u6k = function (opt) { return [vk(opt), [d(7), d(8), d(9), KY.plus, KY.minus, KY.del], [d(4), d(5), d(6), KY.sq, KY.pow, KY.clear], [d(1), d(2), d(3), KY.frac, KY.left, KY.right], [d(0), KY.par, KY.comma, KY.ne, KY.pm, KY.enter]]; };
    W.KEYSETS.u6kn = function (opt) { return [vk(opt), [d(7), d(8), d(9), KY.plus, KY.minus, KY.del], [d(4), d(5), d(6), KY.sq, KY.pow, KY.clear], [d(1), d(2), d(3), KY.frac, KY.left, KY.right], [d(0), KY.par, KY.comma, KY.ne, KY.pm, KY.none, KY.enter]]; };
    W.KEYSETS.u6kv = function () { return [[d(7), d(8), d(9), KY.frac, KY.del], [d(4), d(5), d(6), KY.minus, KY.clear], [d(1), d(2), d(3), KY.left, KY.right], [d(0), KY.dot, KY.undef, KY.enter]]; };
    if (W.KEYHELP) {
      W.KEYHELP.u6k = ['Use <b><sup>a</sup>⁄<sub>b</sub></b> for a fraction and <b>( )</b> for factors; press <b>▶</b> to step out of a box. NPVs: <b>≠</b> and commas, e.g. x ≠ 3, −2 or x ≠ ±4.', 'Type fractions with <code>/</code> and brackets, e.g. <code>(x+3)/(2(x-1))</code>. NPVs: <code>x != 3, -2</code>.'];
      W.KEYHELP.u6kn = ['Write the NPVs with <b>≠</b> and commas, e.g. x ≠ 3, −2 (or x ≠ ±4), or press <b>none</b>.', 'Type e.g. <code>x != 3, -2</code> (or just <code>3, -2</code>), or <code>none</code>.'];
      W.KEYHELP.u6kv = ['Type the value (a fraction with <b><sup>a</sup>⁄<sub>b</sub></b>), or press <b>undefined</b> if the expression has no value there.', 'Type a number such as <code>-7/8</code>, or <code>undefined</code>.'];
    }
  }

  /* ---------- part builders ---------- */
  function dedupe(arr) { var seen = {}; return arr.filter(function (b) { var k = JSON.stringify(b); if (seen[k]) return false; seen[k] = 1; return true; }); }
  U.mc = function (r, prompt, opts, sol, hints, text, keepOrder) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k] && !op.right) return; seen[k] = 1; out.push(op); });
    return B.mc(r, prompt, out, sol, hints || [], text, keepOrder);
  };
  function autoNw(s, cp, npv, v) {
    var nw = (s.nw || []).slice();
    if (s.autoNw === false) return nw;
    try {
      if (s.T && Object.keys(npv).length) { var nc = U.npvOf(s.T.D, v); if (!U.npvEq(nc, npv)) nw.push({ vals: nc, code: cp + 'npv-cancel', hint: 'The NPVs come from the <b>original</b> denominator, before any factor is divided out. Factor it and set each factor equal to ' + t(0) + '.' }); }
      if (s.N) { var nn = U.npvOf(s.N, v), both = {}; if (Object.keys(nn).length) { nw.push({ vals: nn, code: cp + 'npv-num', hint: 'Those come from the numerator. A numerator of ' + t(0) + ' is allowed; only the denominator gives NPVs.' }); both[v] = (nn[v] || []).concat(npv[v] || []); if (!U.npvEq(both, npv)) nw.push({ vals: both, code: cp + 'npv-num', hint: 'Leave out the values from the numerator: a numerator of ' + t(0) + ' is allowed. Only the denominator gives NPVs.' }); } }
    } catch (e) { /* two-variable expressions: only the given wrongs */ }
    return nw;
  }
  /* "Simplify. State the NPVs." */
  U.simpPart = function (prompt, s) {
    var cp = s.cp || 'u6k-', rd = s.num ? U.reduce(s.num, s.den) : null;
    var N = s.N || (rd && rd.N), D = s.D || (rd && rd.D), T = s.T || (rd && rd.T), key0 = s.key || (rd && rd.tex);
    var v = s.v || U.vars(D)[0] || 'x', vars = uniq([v].concat(U.vars(N, D, T.N, T.D)).concat(s.vars || []));
    var npv = s.npv || U.npvOf(D, v);
    var nw = autoNw({ nw: s.nw, T: T, N: N, autoNw: s.autoNw }, cp, npv, v).filter(function (w) { return !U.npvEq(w.vals, npv); });
    var c1 = U.ratCheck(T, { cp: cp, vars: vars, dl: s.dl, npvBox: true, avoid: [D], diag: s.diag }), c2 = U.npvCheck(npv, { cp: cp, v: v, wrongs: nw, noneHint: s.noneHint });
    var key = [key0, U.npvTex(npv)];
    var check = function (resp) {
      resp = Array.isArray(resp) ? resp : [resp, ''];
      var r1 = c1(resp[0] == null ? '' : resp[0]), r2 = c2(resp[1] == null ? '' : resp[1]);
      if (r1.v === 'correct' && r2.v === 'correct') return ok();
      var h1 = '<b>Simplified:</b> ' + (r1.hint || 'Check the simplifying again.'), h2 = '<b>NPVs:</b> ' + (r2.hint || 'Check the NPVs again.');
      if (r1.v === 'wrong' && r2.v === 'wrong') return wrong(r1.code === 'value' ? r2.code : r1.code, h1 + '<br>' + h2);
      if (r1.v === 'wrong') return r2.v === 'correct' ? wrong(r1.code, h1) : wrong(r1.code, h1 + '<br>' + h2);
      if (r2.v === 'wrong') return wrong(r2.code === 'value' ? cp + 'npv-wrong' : r2.code, h2);
      if (r1.v === 'form') return { v: 'form', code: r1.code, hint: h1 };
      return { v: 'form', code: r2.code, hint: h2 };
    };
    var p = { prompt: prompt, input: { type: 'fields', fields: [{ label: 'Simplified:', mode: 'math', keys: 'u6k', vars: vars, name: 'Simplified' }, { label: 'NPVs:', mode: 'math', keys: 'u6k', vars: vars, none: true, name: 'NPVs', placeholder: 'e.g. ' + v + ' ≠ 3, −2' }] },
      check: check, key: key, answer: t(key[0]) + ', \\(' + key[1] + '\\)', solution: s.sol, hints: s.hints || [], text: s.text };
    var bad = [];
    (s.dl || []).forEach(function (w) { if (w && w.tex) bad.push([w.tex, key[1]]); });
    nw.forEach(function (w) { bad.push([key[0], U.npvTex(w.vals)]); });
    bad.push([key[0], key[1] === '\\text{none}' ? v + '\\ne 0' : '\\text{none}']);
    p.bad = dedupe(bad).filter(function (b) { return JSON.stringify(b) !== JSON.stringify(key); });
    p.good = s.good;
    return p;
  };
  U.ratPart = function (prompt, s) {
    var cp = s.cp || 'u6k-', T = s.T, vars = uniq((s.vars || []).concat(U.vars(T.N, T.D)));
    var p = B.math(prompt, U.ratCheck(T, { cp: cp, vars: vars, dl: s.dl, avoid: s.avoid, form: s.form, noForm: s.noForm, diag: s.diag }), s.key, s.sol, s.hints, s.text, { keys: 'u6k', vars: vars, before: s.before, after: s.after, placeholder: s.placeholder });
    p.bad = uniq((s.dl || []).filter(function (w) { return w && w.tex; }).map(function (w) { return w.tex; }).concat(s.bad || []));
    p.good = s.good;
    return p;
  };
  U.npvPart = function (prompt, s) {
    var cp = s.cp || 'u6k-', Ds = s.D ? (Array.isArray(s.D) ? s.D : [s.D]) : [], v = s.v || (Ds.length ? U.vars.apply(null, Ds)[0] : null) || 'x';
    var npv = s.npv || U.npvOf(Ds, v);
    var nw = autoNw({ nw: s.nw, N: s.N, autoNw: s.autoNw }, cp, npv, v).filter(function (w) { return !U.npvEq(w.vals, npv); });
    var vars = uniq([v].concat(s.vars || []).concat(Object.keys(npv)));
    var p = B.math(prompt, U.npvCheck(npv, { cp: cp, v: v, wrongs: nw, noneHint: s.noneHint }), U.npvTex(npv), s.sol, s.hints, s.text, { keys: 'u6kn', vars: vars, placeholder: 'e.g. ' + v + ' ≠ 3, −2  (or: none)' });
    p.bad = uniq(nw.map(function (w) { return U.npvTex(w.vals); }).concat(Object.keys(npv).length ? ['\\text{none}'] : [v + '\\ne 0'])).filter(function (b) { return b !== U.npvTex(npv); });
    return p;
  };
  U.factNpvPart = function (prompt, s) {
    var cp = s.cp || 'u6k-', D = s.D || FT.product(s.fact), v = s.v || U.vars(D)[0] || 'x', npv = s.npv || U.npvOf(D, v);
    var nw = autoNw({ nw: s.nw, N: s.N }, cp, npv, v).filter(function (w) { return !U.npvEq(w.vals, npv); });
    var vars = uniq([v].concat(U.vars(D)));
    var c1 = K.factored(s.fact, { wrong: s.fw }), c2 = U.npvCheck(npv, { cp: cp, v: v, wrongs: nw });
    var key = [s.fact, U.npvTex(npv)];
    var p = B.fields(prompt, [{ label: 'Factored denominator:', name: 'Factored denominator', mode: 'math', keys: 'u6k', vars: vars }, { label: 'NPVs:', name: 'NPVs', mode: 'math', keys: 'u6k', vars: vars, none: true, placeholder: 'e.g. ' + v + ' ≠ 3, −2' }],
      [c1, c2], key, t(key[0]) + ', \\(' + key[1] + '\\)', s.sol, s.hints, s.text);
    p.bad = dedupe(nw.map(function (w) { return [key[0], U.npvTex(w.vals)]; }).concat([[pt(D), key[1]], [key[0], '\\text{none}']]));
    return p;
  };
  U.valPart = function (prompt, val, s) {
    s = s || {};
    var key = val == null ? '\\text{undefined}' : rt(val);
    var p = B.math(prompt, U.valCheck(val, s), key, s.sol, s.hints, s.text, { keys: s.noUndef ? 'fraction' : 'u6kv', before: s.before, after: s.after });
    p.bad = uniq([val == null ? '0' : '\\text{undefined}'].concat((s.cands || []).filter(function (c) { return c && c[0] != null && (val == null || rv(c[0]) !== rv(val)); }).map(function (c) { return rt(c[0]); })));
    return p;
  };
  U.valTable = function (prompt, cells, s) {
    s = s || {};
    var fields = cells.map(function (c) { return { label: c.label, name: c.name || c.label.replace(/<[^>]*>|\\[()]/g, ''), mode: 'math', keys: 'u6kv' }; });
    var checks = cells.map(function (c) { return U.valCheck(c.val, { cp: s.cp, cands: c.cands }); });
    var keys = cells.map(function (c) { return c.val == null ? '\\text{undefined}' : rt(c.val); });
    var p = B.fields(prompt, fields, checks, keys, cells.map(function (c, i) { return c.label + ' ' + t(keys[i]); }).join('<br>'), s.sol, s.hints, s.text);
    p.bad = [keys.map(function (k) { return k === '\\text{undefined}' ? '0' : k; })];
    return p;
  };
  U.recipPart = function (prompt, roots, s) {
    s = s || {}; var v = s.v || 'x', D = s.D || U.fromRoots(roots, v), key = '\\frac{1}{' + pt(D) + '}';
    var p = B.math(prompt, U.recipCheck(roots, { v: v, cp: s.cp }), key, s.sol, s.hints, s.text, { keys: 'u6k', vars: [v], placeholder: 'e.g. 1/(x^2 + 2x - 3)' });
    var bad = [];
    if (roots.length) { bad.push('\\frac{1}{' + pt(U.fromRoots(roots.map(function (r) { r = R(r); return [-r[0], r[1]]; }), v)) + '}'); bad.push('\\frac{1}{' + v + '^{2}+1}'); }
    else bad.push('\\frac{1}{' + v + '^{2}-1}');
    p.bad = bad.filter(function (b) { return b !== key; });
    p.good = s.good;
    return p;
  };
  /* one exact number (an integer or a fraction): o.cands [[value, code, hint]], o.before / o.after */
  U.numPart = function (prompt, ans, o) {
    o = o || {}; var fr = R(ans)[1] !== 1;
    var p = B.math(prompt, U.valCheck(ans, { cp: o.cp, cands: o.cands, noUndef: true, slipCode: 'value', slipHint: o.slipHint || null }), rt(ans), o.sol, o.hints, o.text, { keys: 'fraction', before: o.before, after: o.after });
    if (!fr) p.input = { type: 'number', before: o.before, after: o.after };
    p.bad = uniq((o.cands || []).filter(function (c) { return c && rv(c[0]) !== rv(ans) && (fr || R(c[0])[1] === 1); }).map(function (c) { return rt(c[0]); }).concat([String(rv(ans) + 1)]));
    return p;
  };

  /* ---------- small generators ---------- */
  U.pickVar = function (r, pool) { return r.pick(pool || ['x', 'x', 'x', 'a', 'm', 'y', 't', 'n', 'p', 'k', 'w']); };
  /* a binomial a·v + b with gcd(a, b) = 1, b ≠ 0 */
  U.bin = function (r, v, aList, bMax) { return pickWhere(function () { var a = r.pick(aList || [1]), b = nz(r, 1, bMax || 7); return { a: a, b: b, p: lin(a, b, v) }; }, function (o) { return gcd(o.a, o.b) === 1; }); };
  U.fsign = function (n) { return n < 0 ? '-' : '+'; };

  /* ======================================================================================================
   * Lesson 1
   * ====================================================================================================== */
  var LID = 'u6l1', CP = LID + '-';
  U.codes(CP);
  HW.addCodes({ 'u6l1-differ': 'Gave a value where the two expressions agree (or are both undefined)', 'u6l1-food': 'Cost per person: left out the per-person cost', 'u6l1-cost': 'Gave the cost instead of the number of people' });
  HW.addPartial({ 'u6l1-differ': 'n', 'u6l1-food': 'b', 'u6l1-cost': 'n' });
  var OUT = 'AN4';

  /* ---------- lesson helpers ---------- */
  var nvT = U.npvTex, npvOf = U.npvOf;
  function dq(n, d) { return '\\dfrac{' + n + '}{' + d + '}'; }
  function rtp(x) { x = R(x); return x[1] !== 1 ? '\\left(' + rt(x) + '\\right)' : x[0] < 0 ? '(' + x[0] + ')' : String(x[0]); }
  function ym(m, w) { w = w || 'y'; return (m === 1 ? '' : m === -1 ? '-' : String(m)) + w; }
  function ymF(p, q, w) { w = w || 'y'; var r = ex.norm(p, q); if (r[1] === 1) return ym(r[0], w); return (r[0] < 0 ? '-' : '') + '\\frac{' + (Math.abs(r[0]) === 1 ? '' : Math.abs(r[0])) + w + '}{' + r[1] + '}'; }
  function fxs(x) { var s = (Math.round(x * 1000) / 1000).toFixed(3).replace(/0+$/, '').replace(/\.$/, ''); return s === '-0' ? '0' : s; }
  function solveLin(a, b, v) { return t(pt(lin(a, b, v)) + '=0\\Rightarrow ' + v + '=' + rt([-b, a])); }
  var HNPV = ['Only the denominator matters: set it (each factor with a variable) equal to ' + t(0) + ' and solve.'];
  var HFAC = ['Factor the denominator fully (common factor first), then set each factor with a variable equal to ' + t(0) + '.'];
  var HEV = ['Substitute, then simplify the numerator and the denominator separately. A denominator of ' + t(0) + ' means undefined.'];
  function excl(o, list) { return !list.some(function (e) { return Object.keys(e).every(function (k) { return o[k] === e[k]; }); }); }

  /* ---------- Q1: is it a rational expression? ---------- */
  function ratKind(r, kind) {
    var v = U.pickVar(r, ['x', 'a', 't', 'm', 'y', 'n', 'p']), k = r.int(2, 9), m = r.int(1, 9), n = r.int(2, 4), tex, why;
    if (kind === 'mono') {
      tex = r.chance(0.5) ? dq(r.int(2, 13), v + '^{' + n + '}') : dq(pt(lin(1, nz(r, 1, 9), v)), k + v + (r.chance(0.5) ? '^{' + n + '}' : ''));
      if (tex === dq(6, 'a^{2}') || tex === dq(5, 'x')) tex = dq(7, v + '^{3}');
      why = 'Yes: the numerator and the denominator are both polynomials (a variable in the denominator is fine; only the denominator ' + t(0) + ' is not allowed).';
    } else if (kind === 'rad') {
      var c = r.pick([0, 1, 2]);
      tex = c === 0 ? dq('\\sqrt{' + v + '}' + sg(m), pt(lin(1, -r.int(1, 9), v))) : c === 1 ? dq(k, '\\sqrt{' + v + '}' + sg(-m)) : dq(pt(lin(1, m, v)), k + '\\sqrt{' + v + '}');
      why = 'No: ' + t('\\sqrt{' + v + '}') + ' is not a polynomial term (a variable under a radical).';
    } else if (kind === 'expo') {
      var b = r.int(2, 5), c2 = r.pick([0, 1, 2]);
      tex = c2 === 0 ? dq(k, b + '^{' + v + '}') : c2 === 1 ? dq(b + '^{' + v + '}' + sg(m), v) : dq(v, b + '^{' + v + '}' + sg(-m));
      if (tex === dq(5, '3^{x}')) tex = dq(4, '2^{x}');
      why = 'No: ' + t(b + '^{' + v + '}') + ' has the variable in an exponent, so it is not a polynomial term.';
    } else {
      var a2 = r.int(1, 5), b2 = nz(r, 1, 9), c3 = nz(r, 1, 9);
      tex = r.chance(0.5) ? pt(P.add(P.mono(a2, mon(v, 2)), P.mono(b2, mon(v, 1)), P.num(c3))) : dq(pt(P.add(P.mono(a2, mon(v, 2)), P.num(c3))), r.int(2, 11));
      if (tex === 'x^{2}-4x+1') tex = 'x^{2}-4x+3';
      why = 'Yes: it is a polynomial over a polynomial (a polynomial by itself has denominator ' + t(1) + ').';
    }
    return { tex: tex, kind: kind, why: why };
  }
  function ratMC(r, kind) {
    var o = ratKind(r, kind), yes = kind === 'mono' || kind === 'poly';
    var opts = [
      { html: 'Yes: the numerator and the denominator are both polynomials (a polynomial by itself has denominator ' + t(1) + ')', right: yes, why: 'Look at every term: is a variable under a radical or in an exponent?' },
      { html: 'No: a variable is under a radical, so it is not a polynomial', right: kind === 'rad', why: kind === 'rad' ? null : 'Is there a radical sign over a variable here?' },
      { html: 'No: a variable is in an exponent, so it is not a polynomial', right: kind === 'expo', why: kind === 'expo' ? null : 'Is there a variable in an exponent here?' },
      { html: 'No: a rational expression cannot have a variable in its denominator', right: false, why: 'A variable in the denominator is fine (that is what makes most rational expressions interesting). The denominator just cannot be ' + t(0) + '.' }
    ];
    return U.mc(r, t(o.tex), opts, o.why, ['A rational expression is a polynomial over a polynomial. Polynomials have only whole-number exponents on their variables: no variable under a radical, in an exponent, or in a denominator of a term.'], 'is it rational: ' + kind, true);
  }

  /* ---------- NPV generators (Q5, Extra A2) ---------- */
  function npvKind(r, kind, ex1) {
    var v = U.pickVar(r), o, D, N, npv, nw = [], sol, show;
    ex1 = ex1 || [];
    if (kind === 'mono') {
      o = pickWhere(function () { return { k: r.int(2, 13), c: r.int(2, 9) }; }, function (z) { return excl(z, [{ k: 9, c: 5 }, { k: 11, c: 6 }, { k: 7, c: 2 }].concat(ex1)); });
      D = P.mono(o.c, mon(v, 1)); show = dq(o.k, o.c + v);
      nw = [{ vals: mk(v, [o.c]), code: 'value', hint: t(o.c + v + '=0') + ' means ' + t(v + '=0') + ' (divide both sides by ' + o.c + ').' }, { vals: mk(v, [-o.c]), code: 'value', hint: t(o.c + v + '=0') + ' means ' + t(v + '=0') + '.' }];
      sol = t(o.c + v + '=0\\Rightarrow ' + v + '=0') + ', so ' + t(v + '\\ne 0') + '.';
    } else if (kind === 'lin') {
      o = pickWhere(function () { return { a: nz(r, 1, 12), b: nz(r, 1, 12) }; }, function (z) { return z.a !== z.b && excl(z, [{ a: -7, b: 9 }, { a: -3, b: 11 }].concat(ex1)); });
      N = lin(1, o.a, v); D = lin(1, o.b, v); show = dq(pt(N), pt(D));
      sol = solveLin(1, o.b, v) + ', so ' + t(v + '\\ne ' + (-o.b)) + '. (The numerator does not matter.)';
    } else if (kind === 'frac') {
      o = pickWhere(function () { return { a: r.int(1, 13), b: r.int(2, 6), k: r.int(1, 9) }; }, function (z) { return gcd(z.a, z.b) === 1 && z.a % z.b !== 0 && excl(z, [{ a: 5, b: 4 }, { a: 9, b: 2 }, { a: 12, b: 3 }].concat(ex1)); });
      D = lin(-o.b, o.a, v); show = dq(o.k, pta(D));
      nw = [{ vals: mk(v, [[o.b, o.a]]), code: 'flip', hint: 'Solve ' + t(pta(D) + '=0') + ': ' + t(o.b + v + '=' + o.a) + ', so ' + t(v + '=\\frac{' + o.a + '}{' + o.b + '}') + '.' }];
      sol = t(pta(D) + '=0\\Rightarrow ' + o.b + v + '=' + o.a + '\\Rightarrow ' + v + '=\\frac{' + o.a + '}{' + o.b + '}') + ', so ' + t(v + '\\ne\\frac{' + o.a + '}{' + o.b + '}') + '.';
    } else if (kind === 'const') {
      o = pickWhere(function () { return { k: nz(r, 1, 9), c: r.int(2, 15), sq: r.chance(0.5) }; }, function (z) { return excl(z, [{ k: 3, c: 14 }, { k: 5, c: 6 }].concat(ex1)); });
      N = o.sq ? P.add(P.mono(1, mon(v, 2)), P.num(o.k)) : lin(1, o.k, v); show = dq(pt(N), o.c);
      nw = [{ vals: mk(v, [0]), code: CP + 'npv-extra', hint: 'The denominator is ' + t(o.c) + ', which is never ' + t(0) + '. A numerator of ' + t(0) + ' is allowed, so there are no NPVs.' }];
      sol = 'The denominator ' + t(o.c) + ' is never ' + t(0) + ': no NPVs.';
    } else if (kind === 'sumsq') {
      o = pickWhere(function () { return { s: r.int(2, 9), k: r.int(1, 9), sq: r.chance(0.4) }; }, function (z) { return excl(z, [{ s: 5 }, { s: 4 }, { s: 7 }].concat(ex1)); });
      N = o.sq ? P.mono(1, mon(v, 2)) : P.mono(o.k, mon(v, 1)); D = P.add(P.mono(1, mon(v, 2)), P.num(o.s * o.s)); show = dq(pt(N), pt(D));
      nw = [{ vals: mk(v, [o.s, -o.s]), code: CP + 'npv-extra', hint: t(pt(D)) + ' is a <b>sum</b> of squares: ' + t(v + '^{2}\\ge 0') + ', so ' + t(pt(D) + '\\ge ' + o.s * o.s) + ' and it is never ' + t(0) + '. (Only a difference of squares factors.)' }];
      sol = t(v + '^{2}\\ge 0') + ', so ' + t(pt(D) + '\\ge ' + o.s * o.s) + ': never ' + t(0) + '. No NPVs.';
    } else if (kind === 'two') {
      o = pickWhere(function () { return { a: r.int(1, 6), b: r.int(2, 6), c: nz(r, 1, 9), d: r.int(2, 5), e: nz(r, 1, 9) }; }, function (z) { return z.a !== z.b && gcd(z.d, z.e) === 1 && z.e % z.d !== 0 && excl(z, [{ a: 2, d: 3, e: 5 }].concat(ex1)); });
      o.a = r.chance(0.5) ? o.a : -o.a;
      N = lin(1, o.c, v); var f1 = lin(1, -o.a, v), f2 = lin(o.d, o.e, v); D = P.mul(f1, f2);
      show = dq(pt(N), '(' + pt(f1) + ')(' + pt(f2) + ')');
      nw = [{ vals: mk(v, [o.a, [o.e, o.d]]), code: CP + 'npv-sign', hint: 'Solve ' + t(pt(f2) + '=0') + ': ' + t(v + '=' + rt([-o.e, o.d])) + '.' }, { vals: mk(v, [o.a, [-o.d, o.e]]), code: 'flip', hint: 'Solve ' + t(pt(f2) + '=0') + ': ' + t(o.d + v + '=' + (-o.e)) + ', so ' + t(v + '=' + rt([-o.e, o.d])) + '.' }];
      sol = t(pt(f1) + '=0\\Rightarrow ' + v + '=' + o.a) + ' and ' + solveLin(o.d, o.e, v) + '. ' + t(nvT(mk(v, [o.a, [-o.e, o.d]]))) + '.';
    } else if (kind === 'twovar') {
      var L2 = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['r', 's']]);
      o = pickWhere(function () { return { k: r.int(2, 15), m: r.int(1, 3), n: r.int(1, 3), c: r.int(1, 6) }; }, function (z) { return z.m + z.n > 2 && excl(z, [{ k: 8, m: 2, n: 1 }, { k: 5, m: 2, n: 1, c: 3 }].concat(ex1)); });
      v = L2[0]; var w = L2[1];
      D = P.mono(o.c, (function () { var z = {}; z[v] = o.m; z[w] = o.n; return z; })()); show = dq(o.k, pt(D));
      npv = {}; npv[v] = [0]; npv[w] = [0];
      sol = t(pt(D) + '=0') + ' when ' + t(v + '=0') + ' or ' + t(w + '=0') + '. ' + t(v + '\\ne 0,\\ ' + w + '\\ne 0') + '.';
    } else if (kind === 'cancel') {
      o = pickWhere(function () { return { a: nz(r, 1, 9), k: r.int(1, 3) }; }, function (z) { return excl(z, [{ a: 1 }].concat(ex1)); });
      var fb = lin(1, -o.a, v); N = P.mono(o.k, mon(v, 1)); D = P.mul(P.mono(1, mon(v, 1)), fb);
      show = dq(pt(N), v + '(' + pt(fb) + ')');
      nw = [{ vals: mk(v, [o.a]), code: CP + 'npv-cancel', hint: 'Do not divide out ' + t(v) + ' first: the NPVs come from the original denominator ' + t(v + '(' + pt(fb) + ')') + ', and ' + t(v + '=0') + ' makes it ' + t(0) + '.' }];
      sol = t(v + '(' + pt(fb) + ')=0') + ' when ' + t(v + '=0') + ' or ' + t(v + '=' + o.a) + ': ' + t(nvT(mk(v, [0, o.a]))) + '. (Even though ' + t(v) + ' is also in the numerator.)';
    } else if (kind === 'prod') { // k/(v(v + a))
      o = pickWhere(function () { return { a: nz(r, 1, 12), k: r.int(2, 9) }; }, function (z) { return excl(z, [{ a: 8, k: 6 }].concat(ex1)); });
      var fp = lin(1, o.a, v); D = P.mul(P.mono(1, mon(v, 1)), fp); show = dq(o.k, v + '(' + pt(fp) + ')');
      nw = [{ vals: mk(v, [-o.a]), code: CP + 'npv-missing', hint: 'The factor ' + t(v) + ' is also a factor of the denominator: ' + t(v + '=0') + ' makes it ' + t(0) + '.' }];
      sol = t(v + '=0') + ' or ' + t(pt(fp) + '=0') + ': ' + t(nvT(mk(v, [0, -o.a]))) + '.';
    }
    return { show: show, D: D, N: N, v: v, npv: npv, nw: nw, sol: sol };
  }
  function mk(v, vals) { var o = {}; o[v] = vals; return o; }
  function npvQ(r, kind, ex1) {
    var g = npvKind(r, kind, ex1);
    return U.npvPart(t(g.show), { cp: CP, D: g.D, N: g.N, v: g.v, npv: g.npv, nw: g.nw, sol: g.sol, hints: kind === 'sumsq' || kind === 'const' ? ['Can the denominator ever be ' + t(0) + '? A square is never negative.'] : HNPV, text: 'NPVs: ' + kind });
  }

  /* ---------- factor-the-denominator generators (Q6, Extra A3) ---------- */
  function facKind(r, kind, ex1) {
    var v = 'x', o, f, D, N, sol, show, factT, nw = [];
    ex1 = ex1 || [];
    if (kind === 'tri') {
      o = pickWhere(function () { return { p: nz(r, 1, 9), q: nz(r, 1, 9), s: nz(r, 1, 9) }; }, function (z) { return z.p < z.q && z.p + z.q !== 0 && excl(z, [{ p: -3, q: 4 }, { p: -5, q: 3 }, { p: 2, q: 6 }, { p: 3, q: 5 }].concat(ex1)); });
      v = U.pickVar(r, ['x', 'x', 'a', 'm', 'y']);
      D = U.fromRoots([o.p, o.q], v); N = lin(1, o.s, v); factT = '(' + pt(lin(1, -o.p, v)) + ')(' + pt(lin(1, -o.q, v)) + ')';
      sol = t(pt(D) + '=' + factT) + ': ' + t(nvT(mk(v, [o.p, o.q]))) + '.';
    } else if (kind === 'dos') {
      o = pickWhere(function () { return { a: r.int(2, 12), k: r.int(1, 9) }; }, function (z) { return excl(z, [{ a: 6 }, { a: 9 }].concat(ex1)); });
      v = U.pickVar(r, ['x', 'x', 'y', 't', 'n']);
      D = P.add(P.mono(1, mon(v, 2)), P.num(-o.a * o.a)); N = P.num(o.k); factT = '(' + pt(lin(1, -o.a, v)) + ')(' + pt(lin(1, o.a, v)) + ')';
      sol = t(pt(D) + '=' + factT) + ': ' + t(v + '\\ne\\pm ' + o.a) + '.';
    } else if (kind === 'gcf') { // g·v(v + m)
      o = pickWhere(function () { return { m: nz(r, 2, 12), g: r.pick([1, 1, 2, 3, 4, 5]), k: r.int(1, 9) }; }, function (z) { return excl(z, [{ m: 7, g: 1 }, { m: 4, g: 5 }, { m: -4, g: 3 }].concat(ex1)); });
      v = U.pickVar(r, ['a', 'x', 'p', 'n', 'k']);
      D = P.mul(P.mono(o.g, mon(v, 1)), lin(1, o.m, v)); N = r.chance(0.5) ? P.mono(o.k, mon(v, 1)) : lin(1, -o.k, v); factT = coefT(o.g) + v + '(' + pt(lin(1, o.m, v)) + ')';
      sol = t(pt(D) + '=' + factT) + ': ' + t(nvT(mk(v, [0, -o.m]))) + '.';
    } else if (kind === 'ac') { // (p v + q)(v + s)
      o = pickWhere(function () { return { p: r.int(2, 5), q: nz(r, 1, 7), s: nz(r, 1, 7) }; }, function (z) { return gcd(z.p, z.q) === 1 && excl(z, [{ p: 3, q: 2, s: -4 }, { p: 2, q: -1, s: 4 }, { p: 2, q: 5, s: -3 }, { p: 3, q: 4, s: 0 }].concat(ex1)); });
      var f1 = lin(o.p, o.q), f2 = lin(1, o.s); D = P.mul(f1, f2); N = r.chance(0.5) ? P.num(1) : lin(1, nz(r, 1, 9)); factT = '(' + pt(f1) + ')(' + pt(f2) + ')';
      var ac = o.p * o.q * o.s, b1 = o.p * o.s, b2 = o.q;
      sol = t('ac=' + ac) + ': ' + t(b1) + ' and ' + t(b2) + '. ' + t(pt(D) + '=' + factT) + ': ' + t(nvT(mk('x', [[-o.q, o.p], -o.s]))) + '.';
      nw = [{ vals: mk('x', [[o.q, o.p], o.s]), code: CP + 'npv-sign', hint: 'Check the signs: ' + t(pt(f1) + '=0') + ' gives ' + t('x=' + rt([-o.q, o.p])) + '.' }, { vals: mk('x', [-o.q, -o.s]), code: 'value', hint: 'Solve ' + t(pt(f1) + '=0') + ' all the way: divide by ' + o.p + '.' }];
    } else if (kind === 'sq') { // (p v + q)^2, p = 1 allowed with o.mon
      o = pickWhere(function () { return { p: ex1.mon ? 1 : r.int(2, 5), q: nz(r, 1, 9), s: nz(r, 1, 9) }; }, function (z) { return gcd(z.p, z.q) === 1 && excl(z, [{ p: 2, q: 3 }, { p: 1, q: 7 }, { p: 1, q: -5 }].concat(ex1.list || [])); });
      v = U.pickVar(r, ['y', 'x', 'a']);
      f = lin(o.p, o.q, v); D = P.pow(f, 2); N = lin(1, o.s, v); factT = '(' + pt(f) + ')^{2}';
      sol = t(pt(D) + '=' + factT) + ': one NPV, ' + t(nvT(mk(v, [[-o.q, o.p]]))) + '.';
    } else if (kind === 'dosf') { // a² − b²v² written ascending, or b²v² − a²
      o = pickWhere(function () { return { a: r.int(1, 9), b: r.int(2, 6), asc: ex1.asc != null ? ex1.asc : r.chance(0.5) }; }, function (z) { return gcd(z.a, z.b) === 1 && excl(z, [{ a: 5, b: 4 }, { a: 1, b: 2 }].concat(ex1.list || [])); });
      if (o.asc) { D = P.add(P.num(o.a * o.a), P.mono(-o.b * o.b, { x: 2 })); show = pta(D); factT = '(' + pta(lin(-o.b, o.a)) + ')(' + pta(lin(o.b, o.a)) + ')'; }
      else { D = P.add(P.mono(o.b * o.b, { x: 2 }), P.num(-o.a * o.a)); factT = '(' + pt(lin(o.b, -o.a)) + ')(' + pt(lin(o.b, o.a)) + ')'; }
      N = r.chance(0.5) ? P.mono(1, { x: 1 }) : P.num(r.int(2, 9));
      sol = t((o.asc ? pta(D) : pt(D)) + '=' + factT) + ': ' + t('x\\ne\\pm\\frac{' + o.a + '}{' + o.b + '}') + '.';
      nw = [{ vals: mk('x', [[o.b, o.a], [-o.b, o.a]]), code: 'flip', hint: 'Solve ' + t(o.b + 'x=' + o.a) + ': ' + t('x=\\frac{' + o.a + '}{' + o.b + '}') + '.' }, { vals: mk('x', [[o.a * o.a, o.b * o.b], [-o.a * o.a, o.b * o.b]]), code: 'value', hint: 'Take square roots: ' + t('x^{2}=\\frac{' + o.a * o.a + '}{' + o.b * o.b + '}') + ' gives ' + t('x=\\pm\\frac{' + o.a + '}{' + o.b + '}') + '.' }];
    } else if (kind === 'gtri') { // g(v − p)(v − q)
      o = pickWhere(function () { return { g: r.int(2, 5), p: nz(r, 1, 8), q: nz(r, 1, 8), k: r.int(1, 9) }; }, function (z) { return z.p < z.q && z.p + z.q !== 0 && excl(z, [{ g: 2, p: -2, q: 6 }].concat(ex1)); });
      D = P.mul(P.num(o.g), U.fromRoots([o.p, o.q])); N = P.num(o.k); factT = o.g + '(' + pt(lin(1, -o.p)) + ')(' + pt(lin(1, -o.q)) + ')';
      sol = t(pt(D) + '=' + o.g + '(' + pt(U.fromRoots([o.p, o.q])) + ')=' + factT) + ': ' + t(nvT(mk('x', [o.p, o.q]))) + '.';
    } else if (kind === 'gdos') { // g(x² − a²)
      o = pickWhere(function () { return { g: r.int(2, 6), a: r.int(1, 9), k: r.int(1, 9) }; }, function (z) { return excl(z, [{ g: 3, a: 3 }].concat(ex1)); });
      D = P.add(P.mono(o.g, { x: 2 }), P.num(-o.g * o.a * o.a)); N = P.num(o.k); factT = o.g + '(x-' + o.a + ')(x+' + o.a + ')';
      sol = t(pt(D) + '=' + o.g + '(x^{2}-' + o.a * o.a + ')=' + factT) + ': ' + t('x\\ne\\pm ' + o.a) + '.';
    } else if (kind === 'cub') { // v(v − p)²
      o = pickWhere(function () { return { p: nz(r, 1, 6), s: nz(r, 1, 9) }; }, function (z) { return excl(z, [{ p: 2 }].concat(ex1)); });
      v = U.pickVar(r, ['k', 'x', 'n', 'p']);
      f = lin(1, -o.p, v); D = P.mul(P.mono(1, mon(v, 1)), P.pow(f, 2)); N = lin(1, o.s, v); factT = v + '(' + pt(f) + ')^{2}';
      sol = t(pt(D) + '=' + v + '(' + pt(P.pow(f, 2)) + ')=' + factT) + ': ' + t(nvT(mk(v, [0, o.p]))) + '.';
      nw = [{ vals: mk(v, [o.p]), code: CP + 'npv-missing', hint: 'Take out the common factor ' + t(v) + ' first: ' + t(v + '=0') + ' is an NPV too.' }];
    } else if (kind === 'quart') { // (x²−a²)(x²−b²)
      o = pickWhere(function () { return { a: r.int(1, 5), b: r.int(1, 5), s: r.int(1, 9) }; }, function (z) { return z.a < z.b && excl(z, [{ a: 1, b: 2 }, { a: 2, b: 3 }].concat(ex1)); });
      D = P.mul(P.add(P.mono(1, { x: 2 }), P.num(-o.a * o.a)), P.add(P.mono(1, { x: 2 }), P.num(-o.b * o.b))); N = P.add(P.mono(1, { x: 2 }), P.num(-o.s * o.s));
      if (o.s === o.a || o.s === o.b) N = P.add(P.mono(1, { x: 2 }), P.num(o.s));
      factT = '(x-' + o.a + ')(x+' + o.a + ')(x-' + o.b + ')(x+' + o.b + ')';
      sol = 'Let ' + t('u=x^{2}') + ': ' + t('u^{2}-' + (o.a * o.a + o.b * o.b) + 'u+' + o.a * o.a * o.b * o.b + '=(u-' + o.a * o.a + ')(u-' + o.b * o.b + ')') + '.<br>' + t(pt(D) + '=(x^{2}-' + o.a * o.a + ')(x^{2}-' + o.b * o.b + ')=' + factT) + ': ' + t('x\\ne\\pm ' + o.a + ',\\ \\pm ' + o.b) + '.';
      nw = [{ vals: mk('x', [o.a * o.a, o.b * o.b]), code: CP + 'npv-missing', hint: 'Those are the values of ' + t('x^{2}') + '. Factor each difference of squares again: ' + t('x^{2}=' + o.a * o.a) + ' gives ' + t('x=\\pm ' + o.a) + '.' }, { vals: mk('x', [o.a, o.b]), code: CP + 'npv-missing', hint: 'Each difference of squares gives two NPVs, ' + t('\\pm') + '.' }];
    }
    return { v: v, D: D, N: N, show: show || pt(D), fact: factT, sol: sol, nw: nw };
  }
  function facQ(r, kind, ex1) {
    var g = facKind(r, kind, ex1);
    return U.factNpvPart(t(dq(pt(g.N), g.show)), { cp: CP, D: g.D, N: g.N, v: g.v, fact: g.fact, nw: g.nw, sol: g.sol, hints: HFAC, text: 'factor and NPVs: ' + kind });
  }

  /* ---------- two-variable NPVs (Q7, Extra B5) ---------- */
  function yQ(r, kind, ex1) {
    var o, show, npv, nw = [], sol, k = r.int(2, 9);
    ex1 = ex1 || [];
    if (kind === 'lin') {
      o = pickWhere(function () { return { m: nz(r, 1, 9) }; }, function (z) { return excl(z, [{ m: 4 }, { m: -6 }].concat(ex1)); });
      var Dl = P.add(P.v('x'), P.mono(-o.m, { y: 1 }));
      show = dq(r.chance(0.5) ? k + 'x' : String(k), pt(Dl)); npv = { x: [ym(o.m)] };
      nw = [{ vals: { x: [o.m] }, code: CP + 'npv-noy', hint: 'Keep the ' + t('y') + ': ' + t(pt(Dl) + '=0') + ' gives ' + t('x=' + ym(o.m)) + '.' }];
      sol = t(pt(Dl) + '=0\\Rightarrow x=' + ym(o.m)) + ', so ' + t('x\\ne ' + ym(o.m)) + '.';
    } else if (kind === 'dos') {
      o = pickWhere(function () { return { m: r.int(2, 9) }; }, function (z) { return excl(z, [{ m: 7 }, { m: 5 }, { m: 4 }].concat(ex1)); });
      var D2 = P.add(P.mono(1, { x: 2 }), P.mono(-o.m * o.m, { y: 2 }));
      show = dq(r.chance(0.5) ? 'x+y' : 'x-y', pt(D2)); npv = { x: [ym(o.m), ym(-o.m)] };
      nw = [{ vals: { x: [o.m, -o.m] }, code: CP + 'npv-noy', hint: 'Keep the ' + t('y') + ': ' + t('x-' + o.m + 'y=0') + ' gives ' + t('x=' + o.m + 'y') + '.' }];
      sol = t(pt(D2) + '=(x-' + o.m + 'y)(x+' + o.m + 'y)') + ': ' + t('x\\ne\\pm ' + o.m + 'y') + '.';
    } else {
      o = pickWhere(function () { return { p: nz(r, 1, 7), q: nz(r, 1, 7) }; }, function (z) { return z.p < z.q && z.p + z.q !== 0 && excl(z, [{ p: -2, q: 3 }, { p: 3, q: 4 }, { p: -3, q: 2 }].concat(ex1)); });
      var f1 = P.add(P.v('x'), P.mono(-o.p, { y: 1 })), f2 = P.add(P.v('x'), P.mono(-o.q, { y: 1 })), D3 = P.mul(f1, f2);
      show = dq(r.chance(0.5) ? '1' : 'x-y', pt(D3)); npv = { x: [ym(o.p), ym(o.q)] };
      nw = [{ vals: { x: [o.p, o.q] }, code: CP + 'npv-noy', hint: 'Keep the ' + t('y') + ': ' + t(pt(f1) + '=0') + ' gives ' + t('x=' + ym(o.p)) + '.' }];
      sol = t(pt(D3) + '=(' + pt(f1) + ')(' + pt(f2) + ')') + ': ' + t('x\\ne ' + ym(o.p) + ',\\ ' + ym(o.q)) + '.';
    }
    return U.npvPart(t(show), { cp: CP, v: 'x', vars: ['x', 'y'], npv: npv, nw: nw, sol: sol, hints: ['Treat ' + t('y') + ' like a number: factor the denominator and solve each factor ' + t('=0') + ' for ' + t('x') + '.'], text: 'NPVs in terms of y: ' + kind });
  }

  /* ---------- NPVs of a difference of two fractions (Q8, Extra B6) ---------- */
  function twoFracQ(r, ex1) {
    var o = pickWhere(function () { return { r1: nz(r, 1, 9), r2: nz(r, 1, 9), k: r.int(2, 7), c: nz(r, 1, 5), op: r.pick(['+', '-']), xnum: r.chance(0.5) }; }, function (z) { return z.r1 !== z.r2 && excl(z, [{ r1: -6, r2: 4 }, { r1: 2, r2: -5 }].concat(ex1 || [])); });
    var d1 = lin(1, -o.r1), d2 = P.add(P.mono(1, { x: 2 }), P.mono(-o.r2, { x: 1 })), n2 = o.xnum ? P.v('x') : lin(1, o.c);
    var npv = { x: [o.r1, 0, o.r2] };
    var nw = [{ vals: { x: [o.r1] }, code: CP + 'npv-one', hint: 'Every denominator gives NPVs: factor the second one too.' }, { vals: { x: [0, o.r2] }, code: CP + 'npv-one', hint: 'Every denominator gives NPVs: include the first one.' }, { vals: { x: [o.r1, o.r2] }, code: CP + 'npv-missing', hint: 'Factor ' + t(pt(d2) + '=x(' + pt(lin(1, -o.r2)) + ')') + ': the factor ' + t('x') + ' gives ' + t('x\\ne 0') + '.' }];
    return U.npvPart('Determine the non-permissible values of ' + t(dq(o.k, pt(d1)) + o.op + dq(pt(n2), pt(d2))) + '.', { cp: CP, v: 'x', npv: npv, nw: nw,
      sol: t(pt(d1) + '=0') + ' and ' + t(pt(d2) + '=x(' + pt(lin(1, -o.r2)) + ')=0') + ': ' + t(nvT(npv)) + '.', hints: ['Every denominator gives NPVs. Factor each one.'], text: 'NPVs of two fractions' });
  }

  /* ---------- table near an NPV (Q4, Extra B4) ---------- */
  function nearShared(r, ex1, recip) {
    return pickWhere(function () { return recip ? { p: 0, q: r.int(1, 3), c: nz(r, 1, 9) } : { p: r.int(1, 4), q: r.int(-6, 6), c: nz(r, 1, 6) }; }, function (z) { return z.p * z.c + z.q !== 0 && excl(z, [{ p: 2, q: 0, c: -1 }, { p: 1, q: 1, c: 3 }, { p: 0, q: 1, c: 5 }].concat(ex1 || [])); });
  }
  function nearTex(o) { return dq(o.p ? pt(lin(o.p, o.q)) : String(o.q), pt(lin(1, -o.c))); }
  function nearTable(o, hs) {
    var k = o.p * o.c + o.q;
    var cells = hs.map(function (h) { var x = o.c + h; return { label: t('x=' + fxs(x)), name: 'x = ' + fxs(x), val: h === 0 ? null : Math.round(k / h) + o.p, cands: h ? [[Math.round(k / h) * -1 + o.p, 'sign', 'Check the sign: the denominator ' + t('x-' + par(o.c)) + ' is ' + (h < 0 ? 'negative' : 'positive') + ' here.']] : [] }; });
    var x1 = o.c + hs[1];
    return U.valTable('Complete the table for ' + t(nearTex(o)) + '.', cells, { cp: CP, text: 'table near an NPV',
      sol: 'At ' + t('x=' + o.c) + ' the denominator is ' + t(0) + ': undefined. For example, ' + t('x=' + fxs(x1) + ':\\ ' + dq(o.p ? U.subTex(lin(o.p, o.q), { x: [Math.round(x1 * 1000), 1000] }) : String(o.q), fxs(x1) + '-' + par(o.c)) + '=' + dq(fxs(o.p * x1 + o.q), fxs(hs[1])) + '=' + (Math.round(k / hs[1]) + o.p)) + '. (Use a calculator TABLE, or substitute.)',
      hints: ['Substitute each value (a calculator TABLE with Y1 = the expression is quickest). At ' + t('x=' + o.c) + ' the denominator is ' + t(0) + '.'] });
  }
  function nearMC(r, o) {
    var k = o.p * o.c + o.q, L = k > 0 ? 'negative' : 'positive', Rr = k > 0 ? 'positive' : 'negative';
    var d1 = 'Just left of ' + t(o.c) + ' the values are large and ' + L + '; just right of ' + t(o.c) + ' they are large and ' + Rr + '. ';
    var d2 = 'Just left of ' + t(o.c) + ' the values are large and ' + Rr + '; just right of ' + t(o.c) + ' they are large and ' + L + '. ';
    var e1 = 'At ' + t('x=' + o.c) + ' it is ' + t('\\frac{' + k + '}{0}') + ': a value ' + t('v') + ' would need ' + t('v\\times 0=' + k) + ', which is impossible, so there is no value.';
    var e2 = 'At ' + t('x=' + o.c) + ' it is ' + t('\\frac{' + k + '}{0}=0') + ', because ' + t('0\\times 0=0') + '.';
    return U.mc(r, 'Describe the values near ' + t('x=' + o.c) + ', and explain why ' + t(nearTex(o)) + ' has no value at ' + t('x=' + o.c) + '.', [
      { html: d1 + e1, right: true }, { html: d2 + e1, why: 'Look at the signs in your table: left of ' + t(o.c) + ' the denominator is negative.' },
      { html: d1 + e2, why: 'If ' + t('\\frac{' + k + '}{0}') + ' were ' + t(0) + ', then ' + t('0\\times 0') + ' would have to be ' + t(k) + '. Division undoes multiplication.' }, { html: d2 + e2, why: 'Check the signs in your table, and think about what ' + t('v\\times 0') + ' always equals.' }],
      d1 + e1, ['Division undoes multiplication: ' + t('\\frac{12}{3}=4') + ' because ' + t('4\\times 3=12') + '. What would ' + t('\\frac{' + k + '}{0}') + ' have to satisfy?'], 'near an NPV: describe and explain');
  }

  /* ---------- Questions ---------- */
  var QUESTIONS = [
    { num: '1', stem: 'Is each a rational expression? Explain.', shared: function (r) { return { ord: r.shuffle(['mono', 'rad', 'expo', 'poly']) }; }, parts: [0, 1, 2, 3].map(function (i) {
      return { id: '1' + 'abcd'.charAt(i), level: 'BEG', make: function (r, o) { return ratMC(r, o.ord[i]); } };
    }) },
    { num: '2', shared: function (r) {
        return pickWhere(function () { return { p: r.int(2, 5), q: nz(r, 1, 7), m: nz(r, 1, 6), a: r.int(1, 6), b: -r.int(1, 5) }; }, function (z) {
          if (gcd(z.p, z.q) !== 1 || z.q % z.p === 0 || !excl(z, [{ p: 3, q: 1, m: 2 }])) return false;
          return [z.a, z.b].every(function (x) { return x !== z.m && x !== 0 && z.p * x - z.q !== 0; }) && z.a !== z.b;
        });
      },
      stem: function (o) { return 'Evaluate ' + t(dq(pt(lin(o.p, -o.q)), pt(P.add(P.mono(1, { x: 2 }), P.mono(-o.m, { x: 1 }))))) + ' for each value of ' + t('x') + '.'; },
      parts: ['a', 'b', 'c', 'd', 'e'].map(function (L) {
        return { id: '2' + L, level: L === 'c' || L === 'e' ? 'EMG' : 'BEG', make: function (r, o) {
          var N = lin(o.p, -o.q), D = P.add(P.mono(1, { x: 2 }), P.mono(-o.m, { x: 1 })), x = L === 'a' ? o.a : L === 'b' ? o.b : L === 'c' ? [o.q, o.p] : L === 'd' ? o.m : 0;
          var env = { x: R(x) }, nv = P.atExact(N, env), dv = P.atExact(D, env), val = dv[0] === 0 ? null : qd(nv, dv), cands = [];
          if (L === 'b') { var dw = P.atExact(P.add(P.mono(-1, { x: 2 }), P.mono(-o.m, { x: 1 })), env); if (dw[0]) cands.push([qd(nv, dw), CP + 'ev-slip', 'Brackets around the negative: ' + t('(' + o.b + ')^{2}=' + o.b * o.b) + ', not ' + t(-o.b * o.b) + '.']); }
          var sub = dq(U.subTex(N, env), U.subTex(D, env));
          var sol = val == null ? t(sub + '=' + dq(rt(nv), '0')) + ': the denominator is ' + t(0) + ', so it is <b>undefined</b>.'
            : nv[0] === 0 ? 'Numerator ' + t(U.subTex(N, env) + '=0') + ', denominator ' + t(U.subTex(D, env) + '=' + rt(dv)) + ' (not ' + t(0) + '): the value is ' + t(0) + '.'
            : t(sub + '=' + dq(rt(nv), rt(dv)) + '=' + rt(val));
          return U.valPart(t('x=' + rt(x)), val, { cp: CP, cands: cands, sol: sol, hints: HEV, text: 'evaluate at x (' + L + ')' });
        } };
      }) },
    { num: '3', shared: function (r) {
        return pickWhere(function () { var z = { k: r.int(2, 4), s: nz(r, 1, 3), m: nz(r, 1, 4), a: nz(r, 1, 4), b: nz(r, 1, 4), b2: nz(r, 1, 2) }; z.a2 = -z.m * z.b2; return z; }, function (z) {
          return excl(z, [{ k: 2, s: -1, m: 3 }]) && z.a + z.m * z.b !== 0 && z.k * z.a2 * z.a2 + z.s * z.b2 !== 0 && z.k * z.a * z.a + z.s * z.b !== 0 && Math.abs(z.a2) <= 8;
        });
      },
      stem: function (o) { return 'Evaluate ' + t(dq(pt(P.add(P.mono(o.k, { a: 2 }), P.mono(o.s, { b: 1 }))), pt(P.add(P.v('a'), P.mono(o.m, { b: 1 }))))) + ' for each pair of values.'; },
      parts: ['a', 'b'].map(function (L) {
        return { id: '3' + L, level: L === 'a' ? 'BEG' : 'EMG', make: function (r, o) {
          var N = P.add(P.mono(o.k, { a: 2 }), P.mono(o.s, { b: 1 })), D = P.add(P.v('a'), P.mono(o.m, { b: 1 }));
          var env = L === 'a' ? { a: [o.a, 1], b: [o.b, 1] } : { a: [o.a2, 1], b: [o.b2, 1] }, nv = P.atExact(N, env), dv = P.atExact(D, env), val = dv[0] === 0 ? null : qd(nv, dv);
          var sub = dq(U.subTex(N, env), U.subTex(D, env)), cands = [];
          if (env.a[0] < 0) { var nw2 = P.atExact(P.add(P.mono(-o.k, { a: 2 }), P.mono(o.s, { b: 1 })), env); if (dv[0]) cands.push([qd(nw2, dv), CP + 'ev-slip', 'Square the negative with brackets: ' + t('(' + env.a[0] + ')^{2}=' + env.a[0] * env.a[0]) + '.']); }
          return U.valPart(t('a=' + env.a[0] + ',\\ b=' + env.b[0]), val, { cp: CP, cands: cands, hints: HEV, text: 'evaluate two variables (' + L + ')',
            sol: val == null ? t(sub + '=' + dq(rt(nv), '0')) + ': <b>undefined</b>.' : t(sub + '=' + dq(rt(nv), rt(dv)) + '=' + rt(val)) });
        } };
      }) },
    { num: '4', shared: function (r) { return nearShared(r); }, parts: [
      { id: '4a', level: 'EMG', make: function (r, o) { return nearTable(o, [-0.1, -0.01, -0.001, 0, 0.001, 0.01, 0.1]); } },
      { id: '4b', level: 'EMG', make: function (r, o) { return nearMC(r, o); } }] },
    { num: '5', stem: 'Determine the non-permissible values.', parts: [
      { id: '5a', level: 'BEG', make: function (r) { return npvQ(r, 'mono'); } },
      { id: '5b', level: 'BEG', make: function (r) { return npvQ(r, 'lin'); } },
      { id: '5c', level: 'EMG', make: function (r) { return npvQ(r, 'frac'); } },
      { id: '5d', level: 'BEG', make: function (r) { return npvQ(r, 'const'); } },
      { id: '5e', level: 'EMG', make: function (r) { return npvQ(r, 'sumsq'); } },
      { id: '5f', level: 'PRG', make: function (r) { return npvQ(r, 'two'); } },
      { id: '5g', level: 'EMG', make: function (r) { return npvQ(r, 'twovar'); } },
      { id: '5h', level: 'PRG', make: function (r) { return npvQ(r, 'cancel'); } }] },
    { num: '6', stem: 'Factor the denominator and determine the non-permissible values.', parts: [
      { id: '6a', level: 'PRG', make: function (r) { return facQ(r, 'tri'); } },
      { id: '6b', level: 'EMG', make: function (r) { return facQ(r, 'dos'); } },
      { id: '6c', level: 'EMG', make: function (r) { return facQ(r, 'gcf', [{ g: 2 }, { g: 3 }, { g: 4 }, { g: 5 }]); } },
      { id: '6d', level: 'PRG', make: function (r) { return facQ(r, 'ac'); } },
      { id: '6e', level: 'PRG', make: function (r) { return facQ(r, 'sq', {}); } },
      { id: '6f', level: 'ADV', make: function (r) { return facQ(r, 'dosf', { asc: true }); } },
      { id: '6g', level: 'ADV', make: function (r) { return facQ(r, 'gtri'); } },
      { id: '6h', level: 'ADV', make: function (r) { return facQ(r, 'cub'); } },
      { id: '6i', level: 'MAS', make: function (r) { return facQ(r, 'quart'); } }] },
    { num: '7', stem: 'Determine the non-permissible values for ' + t('x') + ' in terms of ' + t('y') + '.', parts: [
      { id: '7a', level: 'EMG', make: function (r) { return yQ(r, 'lin'); } },
      { id: '7b', level: 'PRG', make: function (r) { return yQ(r, 'dos'); } },
      { id: '7c', level: 'PRG', make: function (r) { return yQ(r, 'tri'); } }] },
    { num: '8', parts: [{ id: '8', level: 'PRG', make: function (r) { return twoFracQ(r); } }] },
    { num: '9', shared: function (r) {
        return pickWhere(function () { var a = r.int(2, 6), s = r.pick([1, -1]), p = r.int(1, a + 3), q = r.int(1, a + 4); return { a: a, s: s, xs: [-a, 0, p, a, q].sort(function (u, w) { return u - w; }), p: p, q: q }; }, function (z) {
          return z.p !== z.q && [z.p, z.q].every(function (x) { return x !== z.a; }) && excl(z, [{ a: 4, s: 1 }, { a: 2, s: -1 }]);
        });
      },
      stem: function (o) { return 'Consider ' + t(dq(pt(P.add(P.mono(1, { x: 2 }), P.mono(-o.s * o.a, { x: 1 }))), 'x^{2}-' + o.a * o.a)) + ' and ' + t(dq('x', pt(lin(1, o.s * o.a))) + '.') + ' Use the values ' + t('x=' + o.xs.join(',\\ ')) + '.'; },
      parts: [
        { id: '9a', level: 'EMG', make: function (r, o) { return q9row(o, 1); } },
        { id: '9b', level: 'EMG', make: function (r, o) { return q9row(o, 2); } },
        { id: '9c', level: 'PRG', make: function (r, o) {
          var d = o.s * o.a, c = o.xs.filter(function (x) { return x !== d; }).map(function (x) { return [x, 'u6l1-differ', x === -d ? 'At ' + t('x=' + x) + ' both are undefined, so neither has a value there.' : 'At ' + t('x=' + x) + ' both have the same value. Look for where only one is undefined.']; });
          return U.numPart('For which value of ' + t('x') + ' in the table do the expressions differ?', d, { cp: CP, before: t('x='), cands: c, hints: ['Compare the two rows column by column.'], text: 'where the expressions differ',
            sol: 'At ' + t('x=' + d) + ': the first is ' + t('\\frac{0}{0}') + ' (undefined), the second is ' + t(rt(qd([d, 1], [d + o.s * o.a, 1]))) + '. Everywhere else in the table they agree.' });
        } },
        { id: '9d', level: 'PRG', make: function (r, o) {
          var d = o.s * o.a, n1 = { x: [o.a, -o.a] }, n2 = { x: [-d] };
          var c1 = U.npvCheck(n1, { cp: CP, v: 'x', wrongs: [{ vals: n2, code: CP + 'npv-cancel', hint: 'The NPVs of the first expression come from its own denominator ' + t('x^{2}-' + o.a * o.a + '=(x-' + o.a + ')(x+' + o.a + ')') + ', before anything is divided out.' }, { vals: { x: [0, d] }, code: CP + 'npv-num', hint: 'Only the denominator gives NPVs.' }] });
          var c2 = U.npvCheck(n2, { cp: CP, v: 'x', wrongs: [{ vals: n1, code: CP + 'npv-extra', hint: 'The second expression has only one factor in its denominator: ' + t(pt(lin(1, d))) + '.' }] });
          var p = B.fields('State the NPVs of each expression.', [{ label: 'First:', name: 'First', mode: 'math', keys: 'u6k', vars: ['x'], none: true }, { label: 'Second:', name: 'Second', mode: 'math', keys: 'u6k', vars: ['x'], none: true }], [c1, c2], [nvT(n1), nvT(n2)], 'First: ' + t(nvT(n1)) + '<br>Second: ' + t(nvT(n2)),
            t('x^{2}-' + o.a * o.a + '=(x-' + o.a + ')(x+' + o.a + ')') + ': the first has ' + t(nvT(n1)) + '. The second has only ' + t(nvT(n2)) + '.', ['Use each expression’s own denominator, before simplifying.'], 'NPVs of each expression');
          p.bad = [[nvT(n2), nvT(n2)], [nvT(n1), nvT(n1)]];
          return p;
        } }] },
    { num: '10', stem: 'Write a rational expression with a numerator of ' + t(1) + ' and the denominator expanded that has the given NPVs.', parts: [
      { id: '10a', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.int(1, 9), b: -r.int(1, 9) }; }, function (z) { return excl(z, [{ a: 3, b: -8 }, { a: 6, b: -1 }, { a: 5, b: -2 }]); }); return recipQ([o.a, o.b], r); } },
      { id: '10b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: nz(r, 1, 9) }; }, function (z) { return excl(z, [{ a: -5 }]); }); return recipQ([0, o.a], r); } },
      { id: '10c', level: 'ADV', make: function (r) { var o = pickWhere(function () { return { p: r.int(1, 7), q: r.int(2, 5) }; }, function (z) { return gcd(z.p, z.q) === 1 && excl(z, [{ p: 2, q: 3 }]); }); return recipQ([[o.p, o.q], [-o.p, o.q]], r); } },
      { id: '10d', level: 'ADV', make: function (r) { var o = pickWhere(function () { return { p: nz(r, 1, 5), q: r.int(2, 5), a: nz(r, 1, 6) }; }, function (z) { return gcd(z.p, z.q) === 1 && excl(z, [{ p: 1, q: 4, a: -2 }]); }); return recipQ([[o.p, o.q], o.a], r); } },
      { id: '10e', level: 'PRG', make: function (r) { return recipQ([], r); } }] },
    { num: '11', shared: function (r) {
        return pickWhere(function () { var F = r.pick([600, 720, 840, 900, 1080, 1200, 1260, 1440]), f = r.pick([15, 20, 25, 35, 40, 45]); var dv = divisors(F); return { F: F, f: f, n0: r.pick(dv.filter(function (x) { return x >= 5 && x <= 15; })), n1: r.pick(dv.filter(function (x) { return x >= 10 && x <= 40; })), ctx: r.int(0, 2) }; }, function (z) { return z.n0 !== z.n1 && !(z.F === 960 && z.f === 30); });
      },
      stem: function (o) { var c = [['rents a cabin', 'food'], ['books a hall', 'the meal'], ['charters a boat', 'lunch']][o.ctx]; return 'A group ' + c[0] + ' for ' + t('\\$' + o.F) + ' and pays ' + t('\\$' + o.f) + ' per person for ' + c[1] + '. The cost per person when ' + t('n') + ' people go is ' + t('C=' + dq(o.F + '+' + o.f + 'n', 'n')) + ' dollars.'; },
      parts: [
        { id: '11a', level: 'BEG', make: function (r, o) { var v = (o.F + o.f * o.n0) / o.n0; return U.numPart('Determine the cost per person for ' + o.n0 + ' people.', v, { cp: CP, before: '\\$', cands: [[o.F / o.n0, 'u6l1-food', 'Add the per-person cost: the numerator is ' + t(o.F + '+' + o.f + '(' + o.n0 + ')') + '.']], sol: t('C=' + dq(o.F + '+' + o.f + '(' + o.n0 + ')', o.n0) + '=' + dq(o.F + o.f * o.n0, o.n0) + '=\\$' + v), hints: ['Substitute ' + t('n=' + o.n0) + '.'], text: 'cost per person' }); } },
        { id: '11b', level: 'EMG', make: function (r) {
          return U.mc(r, 'State the NPV and the values of ' + t('n') + ' that make sense in this context.', [
            { html: t('n\\ne 0') + '; ' + t('n') + ' is a positive whole number (' + t('1,\\ 2,\\ 3,\\ \\ldots') + ')', right: true },
            { html: t('n\\ne 0') + '; ' + t('n') + ' can be any real number except ' + t(0), why: 'Think about the context: can ' + t('-2') + ' or ' + t('2.5') + ' people go?' },
            { html: t('n\\ne 0') + '; ' + t('n') + ' can be any positive number, such as ' + t('2.5'), why: 'People come in whole numbers.' },
            { html: 'No NPV; ' + t('n') + ' is a positive whole number', why: 'The denominator ' + t('n') + ' is ' + t(0) + ' when ' + t('n=0') + ': that is an NPV.' }],
            t('n\\ne 0') + ' (the denominator). In context ' + t('n') + ' counts people: ' + t('n=1,\\ 2,\\ 3,\\ \\ldots'), ['The NPV comes from the denominator. Then ask: what kind of number is ' + t('n') + ' here?'], 'NPV and context');
        } },
        { id: '11c', level: 'PRG', make: function (r, o) {
          var T = o.F / o.n1 + o.f;
          return U.numPart('Use a calculator table (or try values) to find how many people must go for the cost to be ' + t('\\$' + T) + ' per person.', o.n1, { cp: CP, after: 'people', cands: [[o.F / T, 'u6l1-food', 'Each person also pays ' + t('\\$' + o.f) + ': solve ' + t(dq(o.F + '+' + o.f + 'n', 'n') + '=' + T) + '.'], [T, 'u6l1-cost', 'That is the cost. The question asks for the number of people.']],
            sol: 'Table of ' + t('Y_1=' + dq(o.F + '+' + o.f + 'X', 'X')) + ': at ' + t('X=' + o.n1) + ', ' + t(dq(o.F + '+' + o.f * o.n1, o.n1) + '=' + dq(o.F + o.f * o.n1, o.n1) + '=' + T) + '. So ' + t('n=' + o.n1) + '. (Or: ' + t(o.F + '+' + o.f + 'n=' + T + 'n\\Rightarrow ' + o.F + '=' + (T - o.f) + 'n') + '.)',
            hints: ['Enter ' + t('Y_1=(' + o.F + '+' + o.f + 'X)/X') + ' and look down the TABLE for ' + t(T) + '.'], text: 'people for a given cost' });
        } }] },
    { num: '12', shared: function (r) {
        return pickWhere(function () { var A = r.pick([24, 30, 36, 40, 42, 48, 54, 56, 72, 80, 84, 90, 96]), c = r.int(1, 9), dv = divisors(A).filter(function (x) { return x > 1 && x < A; }), w = r.sample(dv, 2); return { A: A, c: c, x1: c + Math.min(w[0], w[1]), x2: c + Math.max(w[0], w[1]) }; }, function (z) { return z.x1 !== z.x2 && !(z.A === 60 && z.c === 3); });
      },
      stem: function (o) { return 'A rectangle has an area of ' + t(o.A + '\\text{ cm}^2') + ' and a width of ' + t('(x-' + o.c + ')') + ' cm, so its length is ' + t(dq(o.A, 'x-' + o.c)) + ' cm.'; },
      parts: [
        { id: '12a', level: 'BEG', make: function (r, o) {
          var l1 = o.A / (o.x1 - o.c), l2 = o.A / (o.x2 - o.c);
          var p = B.fields('Determine the length when ' + t('x=' + o.x1) + ' and when ' + t('x=' + o.x2) + '.', [{ label: 'Length when ' + t('x=' + o.x1) + ':', name: 'x = ' + o.x1, after: 'cm' }, { label: 'Length when ' + t('x=' + o.x2) + ':', name: 'x = ' + o.x2, after: 'cm' }],
            [K.number(l1, function (v) { return v === o.x1 - o.c ? { code: 'value', hint: 'That is the width. The length is ' + t(o.A + '\\div') + ' the width.' } : null; }), K.number(l2, function (v) { return v === o.x2 - o.c ? { code: 'value', hint: 'That is the width. The length is ' + t(o.A + '\\div') + ' the width.' } : null; })],
            [String(l1), String(l2)], t('x=' + o.x1) + ': ' + t(l1) + ' cm<br>' + t('x=' + o.x2) + ': ' + t(l2) + ' cm', t('x=' + o.x1 + ':\\ \\frac{' + o.A + '}{' + (o.x1 - o.c) + '}=' + l1) + ' cm; ' + t('x=' + o.x2 + ':\\ \\frac{' + o.A + '}{' + (o.x2 - o.c) + '}=' + l2) + ' cm', ['Substitute into ' + t(dq(o.A, 'x-' + o.c)) + '.'], 'rectangle lengths');
          p.bad = [[String(o.x1 - o.c), String(l2)]].filter(function (b) { return b[0] !== String(l1); });
          return p;
        } },
        { id: '12b', level: 'EMG', make: function (r, o) {
          return U.mc(r, 'State the NPV. Which values of ' + t('x') + ' make sense in this context? Why?', [
            { html: t('x\\ne ' + o.c) + '; ' + t('x>' + o.c) + ', because the width ' + t('x-' + o.c) + ' must be positive', right: true },
            { html: t('x\\ne ' + o.c) + '; every ' + t('x') + ' except ' + t(o.c) + ' makes sense', why: 'A width cannot be negative or zero: what does that say about ' + t('x-' + o.c) + '?' },
            { html: t('x\\ne -' + o.c) + '; ' + t('x>-' + o.c) + ', because the width must be positive', why: 'Solve ' + t('x-' + o.c + '=0') + ' for the NPV.' },
            { html: t('x\\ne ' + o.c) + '; ' + t('x>0') + ', because ' + t('x') + ' is a length', why: t('x') + ' itself is not a length here; the width is ' + t('x-' + o.c) + '.' }],
            t('x\\ne ' + o.c) + ' (the denominator). The width ' + t('x-' + o.c) + ' must be positive, so ' + t('x>' + o.c) + '.', ['Which expression is the width? It must be positive.'], 'rectangle: NPV and context');
        } }] },
    { num: '13', shared: function (r) { return pickWhere(function () { return { p: r.int(1, 9), q: nz(r, 2, 9) }; }, function (z) { return z.p !== -z.q && z.p !== z.q && excl(z, [{ p: 5, q: 3 }]); }); },
      stem: function (o) { return 'Jaden says the NPVs of ' + t(dq('x-' + o.p, pt(P.add(P.mono(1, { x: 2 }), P.mono(o.q, { x: 1 }))))) + ' are ' + t('x\\ne ' + o.p) + ' and ' + t('x\\ne ' + (-o.q)) + '.'; },
      parts: [
        { id: '13a', level: 'EMG', make: function (r, o) {
          return U.mc(r, 'What is his error?', [
            { html: 'He used the numerator: ' + t('x=' + o.p) + ' makes the numerator ' + t(0) + ', which is allowed (the value is ' + t(0) + '). Only the denominator gives NPVs, and he missed a factor of it.', right: true },
            { html: 'He should have divided out ' + t('x') + ' first, so there are no NPVs.', why: 'Nothing divides out here, and NPVs come from the denominator before any simplifying.' },
            { html: 'His values are right, but he also needs ' + t('x\\ne ' + (-o.p)) + '.', why: 'The numerator never gives NPVs: a numerator of ' + t(0) + ' is fine.' },
            { html: 'He used the wrong signs: they should be ' + t('x\\ne ' + (-o.p)) + ' and ' + t('x\\ne ' + o.q) + '.', why: 'Signs are not the problem. Where do NPVs come from?' }],
            'He used the numerator. ' + t('x=' + o.p) + ' gives ' + t('\\frac{0}{\\ldots}=0') + ', a value. The denominator ' + t('x(' + pt(lin(1, o.q)) + ')') + ' gives the NPVs.', HNPV, 'Jaden’s error');
        } },
        { id: '13b', level: 'PRG', make: function (r, o) {
          var D = P.add(P.mono(1, { x: 2 }), P.mono(o.q, { x: 1 }));
          return U.npvPart('Give the correct NPVs.', { cp: CP, D: D, N: lin(1, -o.p), v: 'x', nw: [{ vals: { x: [o.p, -o.q] }, code: CP + 'npv-num', hint: 'That is Jaden’s answer: ' + t('x=' + o.p) + ' comes from the numerator.' }],
            sol: t(pt(D) + '=x(' + pt(lin(1, o.q)) + ')=0') + ': ' + t(nvT({ x: [0, -o.q] })) + '.', hints: ['Factor the denominator.'], text: 'Jaden: correct NPVs' });
        } }] },
    { num: '14', parts: [{ id: '14', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { return { a: nz(r, 1, 7), r0: nz(r, 1, 7) }; }, function (z) { return z.r0 !== -z.a && z.r0 !== z.a && excl(z, [{ a: 2, r0: 5 }]); });
      var D = P.mul(lin(1, -o.r0), lin(1, o.a));
      return U.mc(r, 'The non-permissible values of ' + t(dq(pt(lin(1, o.a)), pt(D))) + ' are', [
        { html: t(nvT({ x: [o.r0, -o.a] })), right: true }, { html: t('x\\ne ' + o.r0) + ' only', why: 'Don’t divide out ' + t('(' + pt(lin(1, o.a)) + ')') + ' first: it is still a factor of the original denominator.' },
        { html: t(nvT({ x: [-o.r0, o.a] })), why: 'Check the signs: ' + t(pt(lin(1, -o.r0)) + '=0') + ' gives ' + t('x=' + o.r0) + '.' }, { html: t('x\\ne ' + (-o.a)) + ' only', why: 'Factor the denominator: it has two factors.' }],
        t(pt(D) + '=(' + pt(lin(1, -o.r0)) + ')(' + pt(lin(1, o.a)) + ')') + ', so ' + t(nvT({ x: [o.r0, -o.a] })) + '.', HFAC, 'MC: NPVs with a shared factor');
    } }] },
    { num: '15', parts: [{ id: '15', level: 'EMG', make: function (r) {
      var k = r.int(2, 9), m = r.int(2, 16);
      return U.mc(r, 'Which expression has no non-permissible values?', [
        { html: t(dq('x', 'x^{2}-' + k * k)), why: t('x^{2}-' + k * k + '=(x-' + k + ')(x+' + k + ')') + ': ' + t('x\\ne\\pm ' + k) + '.' },
        { html: t(dq('x^{2}-' + k * k, 'x')), why: 'The denominator ' + t('x') + ' is ' + t(0) + ' when ' + t('x=0') + '.' },
        { html: t(dq('x-' + k, 'x^{2}+' + m)), right: true },
        { html: t(dq('1', pt(U.fromRoots([k, k])))), why: t(pt(U.fromRoots([k, k])) + '=(x-' + k + ')^{2}') + ': ' + t('x\\ne ' + k) + '.' }],
        t('x^{2}+' + m + '\\ge ' + m) + ' is never ' + t(0) + ', so ' + t(dq('x-' + k, 'x^{2}+' + m)) + ' has no NPVs.', ['Which denominator can never be ' + t(0) + '?'], 'MC: no NPVs');
    } }] },
    { num: '16', parts: [{ id: '16', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { return { p: r.int(1, 7), q: r.int(2, 5) }; }, function (z) { return gcd(z.p, z.q) === 1 && z.p !== z.q && excl(z, [{ p: 3, q: 2 }]); });
      var fr = '\\frac{' + o.p + '}{' + o.q + '}';
      return U.mc(r, 'Which expression has the non-permissible values ' + t('x\\ne 0,\\ -' + fr) + '?', [
        { html: t(dq(1, pt(P.add(P.mono(o.q, { x: 2 }), P.mono(o.p, { x: 1 }))))), right: true },
        { html: t(dq(1, pt(P.add(P.mono(o.q, { x: 2 }), P.mono(-o.p, { x: 1 }))))), why: t('x(' + pt(lin(o.q, -o.p)) + ')=0') + ' gives ' + t('x=' + fr) + ', not ' + t('-' + fr) + '.' },
        { html: t(dq(1, pt(P.add(P.mono(o.p, { x: 2 }), P.mono(o.q, { x: 1 }))))), why: t('x(' + pt(lin(o.p, o.q)) + ')=0') + ' gives ' + t('x=' + rt([-o.q, o.p])) + '.' },
        { html: t(dq('x', pt(lin(o.q, o.p)))), why: 'The ' + t('x') + ' is in the numerator, so ' + t('x=0') + ' is allowed: only ' + t('x\\ne -' + fr) + '.' }],
        t(pt(P.add(P.mono(o.q, { x: 2 }), P.mono(o.p, { x: 1 }))) + '=x(' + pt(lin(o.q, o.p)) + ')=0') + ' gives ' + t('x=0') + ' or ' + t('x=-' + fr) + '.', ['Factor each denominator and solve.'], 'MC: expression with given NPVs');
    } }] },
    { num: '17', parts: [{ id: '17', level: 'ADV', make: function (r) {
      var o = pickWhere(function () { return { p: r.pick([2, 5]), q: r.int(1, 9), s: r.int(1, 9), c: nz(r, 1, 9) }; }, function (z) { return gcd(z.p, z.q) === 1 && excl(z, [{ p: 2, q: 3, s: 5 }]); });
      var f1 = lin(o.p, -o.q), f2 = lin(1, -o.s), D = P.mul(f1, f2), sum = o.q / o.p + o.s;
      var A = o.p, C = o.q * o.s, ac = A * C, b1 = -o.p * o.s, b2 = -o.q;
      return nrPart('The sum of the non-permissible values of ' + t(dq(pt(lin(1, o.c)), pt(D))) + ', to the nearest tenth, is ____.', sum, 1, [[-sum, CP + 'npv-sign', 'Check the signs: ' + t(pt(f2) + '=0') + ' gives ' + t('x=' + o.s) + '.'], [o.q + o.s, 'value', 'Solve ' + t(pt(f1) + '=0') + ' all the way: ' + t('x=\\frac{' + o.q + '}{' + o.p + '}') + '.'], [o.s - o.c, CP + 'npv-num', 'Only the denominator gives NPVs.']],
        t('ac=' + ac) + ': ' + t(b1) + ' and ' + t(b2) + '. ' + t(pt(D) + '=(' + pt(f1) + ')(' + pt(f2) + ')') + '.<br>NPVs ' + t('\\frac{' + o.q + '}{' + o.p + '}') + ' and ' + t(o.s) + '; sum ' + t('=' + fxs(sum)) + '.', HFAC, 'NR: sum of NPVs');
    } }] },
    { num: '18', parts: [{ id: '18', level: 'MAS', make: function (r) {
      var o = pickWhere(function () { return { r0: r.int(2, 6), s: r.int(2, 9), n: r.int(2, 9) }; }, function (z) { return z.r0 !== z.s && excl(z, [{ r0: 3, s: 6 }]); });
      var c = o.r0 * o.s, k = -(o.r0 + o.s);
      var p = B.nr('The expression ' + t(dq(o.n, 'x^{2}+kx+' + c)) + ' has a non-permissible value of ' + t('x=' + o.r0) + '. Its other non-permissible value is ____.', o.s, function (v) { return v === o.r0 ? { code: CP + 'k-gave', hint: 'That is the given NPV. Find ' + t('k') + ', factor, and give the other one.' } : v === o.r0 + o.s ? { code: CP + 'k-gave', hint: 'That looks like ' + t('-k') + '. Factor ' + t('x^{2}' + sg(k) + 'x+' + c) + ' to find the other NPV.' } : null; },
        t(o.r0 * o.r0 + '+' + o.r0 + 'k+' + c + '=0\\Rightarrow k=' + k) + '. ' + t('x^{2}' + sg(k) + 'x+' + c + '=(x-' + o.r0 + ')(x-' + o.s + ')') + ', so the other NPV is ' + t(o.s) + '.', ['An NPV makes the denominator ' + t(0) + ': substitute ' + t('x=' + o.r0) + ' and solve for ' + t('k') + '.'], 'NR: k and the other NPV');
      p.bad = [String(o.r0), String(o.r0 + o.s)];
      return p;
    } }] }
  ];
  function q9row(o, which) {
    var d = o.s * o.a;
    var cells = o.xs.map(function (x) {
      var val = which === 1 ? (x * x - o.a * o.a === 0 ? null : ex.norm(x * x - d * x, x * x - o.a * o.a)) : (x + d === 0 ? null : ex.norm(x, x + d));
      return { label: t('x=' + x), name: 'x = ' + x, val: val };
    });
    var ex1 = which === 1 ? dq(pt(P.add(P.mono(1, { x: 2 }), P.mono(-d, { x: 1 }))), 'x^{2}-' + o.a * o.a) : dq('x', pt(lin(1, d)));
    return U.valTable('Complete the table for ' + t(ex1) + '.', cells, { cp: CP, text: 'table row ' + which,
      sol: cells.map(function (c) { return c.label + ': ' + t(c.val == null ? '\\text{undefined}' : rt(c.val)); }).join('; ') + (which === 1 ? '. At ' + t('x=' + d) + ' it is ' + t('\\frac{0}{0}') + ': undefined.' : '.'), hints: ['Substitute each value. A denominator of ' + t(0) + ' means undefined (even if the numerator is ' + t(0) + ' too).'] });
  }
  function recipQ(roots, r) {
    var m = {}; m.x = roots;
    var D = U.fromRoots(roots, 'x'), parts = roots.map(function (x) { x = R(x); return '(' + pt(lin(x[1], -x[0])) + ')'; }), k = r.int(1, 9);
    var key = roots.length ? null : '\\frac{1}{x^{2}+' + k + '}';
    var p = U.recipPart(t(roots.length ? nvT(m) : '\\text{no NPVs}'), roots, { cp: CP, v: 'x', D: roots.length ? D : P.add(P.mono(1, { x: 2 }), P.num(k)), text: 'expression with given NPVs',
      sol: roots.length ? t(dq(1, parts.map(function (s) { return s.replace(/^\(x\)$/, 'x'); }).join('')) + '=' + dq(1, pt(D))) + ' (any constant multiple of the denominator works too).' : 'For example ' + t(key) + ': ' + t('x^{2}+' + k + '\\ge ' + k) + ' is never ' + t(0) + '.',
      hints: roots.length ? ['An NPV ' + t('x=r') + ' comes from a factor ' + t('(x-r)') + '; ' + t('x=\\frac{p}{q}') + ' from ' + t('(qx-p)') + '. Multiply the factors out.'] : ['Use a denominator that is never ' + t(0) + ', such as a square plus a positive number.'] });
    if (roots.length) p.good = ['\\frac{1}{' + pt(P.scale(D, 2)) + '}'];
    else p.good = ['\\frac{1}{x^{2}+' + (k + 1) + '}', '\\frac{1}{2x^{2}+3}'];
    return p;
  }
  function nrPart(prompt, x, dp, cands, sol, hints, text) {
    var p = B.approx(prompt, x, dp, { nr: true, diag: function (v) { for (var i = 0; i < cands.length; i++) if (Math.abs(K.roundTo(cands[i][0], dp) - v) < 1e-9 && Math.abs(K.roundTo(cands[i][0], dp) - K.roundTo(x, dp)) > 1e-9) return { code: cands[i][1], hint: cands[i][2] }; return null; } }, sol, hints, text);
    p.bad = cands.map(function (c) { return K.roundTo(c[0], dp).toFixed(dp); }).filter(function (b) { return Number(b) !== K.roundTo(x, dp) && b.length <= 4 && Number(b) >= 0; });
    return p;
  }

  /* ---------- Extra practice ---------- */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', shared: function (r) {
        return pickWhere(function () { return { a: r.int(1, 9), b: nz(r, 2, 6), x1: r.int(1, 5), x2: -r.int(1, 4), h: r.pick([[1, 2], [1, 3], [-1, 2], [2, 3], [3, 2]]) }; }, function (z) {
          return excl(z, [{ a: 1, b: 4 }]) && [z.x1, z.x2].every(function (x) { return x !== z.b; }) && z.h[0] / z.h[1] !== z.b;
        });
      },
      stem: function (o) { return 'Evaluate ' + t(dq('x^{2}+' + o.a, pt(lin(1, -o.b)))) + ' for each value of ' + t('x') + '.'; },
      parts: ['a', 'b', 'c', 'd'].map(function (L) {
        return { id: 'eA1' + L, level: L === 'd' ? 'EMG' : 'BEG', make: function (r, o) {
          var N = P.add(P.mono(1, { x: 2 }), P.num(o.a)), D = lin(1, -o.b), x = L === 'a' ? o.x1 : L === 'b' ? o.x2 : L === 'c' ? o.b : o.h;
          var env = { x: R(x) }, nv = P.atExact(N, env), dv = P.atExact(D, env), val = dv[0] === 0 ? null : qd(nv, dv), cands = [];
          if (L === 'b') cands.push([qd(P.atExact(P.add(P.mono(-1, { x: 2 }), P.num(o.a)), env), dv), CP + 'ev-slip', 'Brackets: ' + t('(' + o.x2 + ')^{2}=' + o.x2 * o.x2) + '.']);
          var sub = dq(U.subTex(N, env), U.subTex(D, env));
          var sol = val == null ? t(sub + '=' + dq(rt(nv), '0')) + ': <b>undefined</b>.' : L === 'd' ? t(sub + '=' + dq(rt(nv), rt(dv)) + '=' + rt(nv) + '\\times' + rtp(qd([1, 1], dv)) + '=' + rt(val)) : t(sub + '=' + dq(rt(nv), rt(dv)) + '=' + rt(val));
          return U.valPart(t('x=' + rt(x)), val, { cp: CP, cands: cands, sol: sol, hints: L === 'd' ? ['Work out the top and the bottom as fractions, then divide (multiply by the reciprocal).'] : HEV, text: 'EP evaluate (' + L + ')' });
        } };
      }) },
    { num: 'A2', stem: 'Determine the non-permissible values.', parts: [
      { id: 'eA2a', level: 'BEG', make: function (r) { return npvQ(r, 'mono'); } },
      { id: 'eA2b', level: 'BEG', make: function (r) { return npvQ(r, 'lin'); } },
      { id: 'eA2c', level: 'EMG', make: function (r) { return npvQ(r, 'frac'); } },
      { id: 'eA2d', level: 'EMG', make: function (r) { return npvQ(r, 'sumsq'); } },
      { id: 'eA2e', level: 'BEG', make: function (r) { return npvQ(r, 'prod'); } },
      { id: 'eA2f', level: 'BEG', make: function (r) { return npvQ(r, 'const'); } }] },
    { num: 'A3', stem: 'Factor the denominator and determine the non-permissible values.', parts: [
      { id: 'eA3a', level: 'PRG', make: function (r) { return facQ(r, 'tri'); } },
      { id: 'eA3b', level: 'PRG', make: function (r) { return facQ(r, 'dosf', { asc: false }); } },
      { id: 'eA3c', level: 'PRG', make: function (r) { return facQ(r, 'gcf', [{ g: 1 }]); } },
      { id: 'eA3d', level: 'PRG', make: function (r) { return facQ(r, 'ac'); } },
      { id: 'eA3e', level: 'PRG', make: function (r) { return facQ(r, 'sq', { mon: true }); } },
      { id: 'eA3f', level: 'ADV', make: function (r) { return facQ(r, 'gdos'); } }] },
    { num: 'B4', section: 'B. Applying', shared: function (r) { return nearShared(r, [], true); }, parts: [
      { id: 'eB4a', level: 'EMG', make: function (r, o) { return nearTable(o, [-0.1, -0.01, 0, 0.01, 0.1]); } },
      { id: 'eB4b', level: 'EMG', make: function (r, o) { return nearMC(r, o); } }] },
    { num: 'B5', stem: 'Determine the non-permissible values for ' + t('x') + ' in terms of ' + t('y') + '.', parts: [
      { id: 'eB5a', level: 'EMG', make: function (r) { return yQ(r, 'lin', [{ m: -6 }]); } },
      { id: 'eB5b', level: 'PRG', make: function (r) { return yQ(r, 'tri', [{ p: 3, q: 4 }]); } }] },
    { num: 'B6', parts: [{ id: 'eB6', level: 'PRG', make: function (r) { return twoFracQ(r); } }] },
    { num: 'B7', stem: 'Write a rational expression with a numerator of ' + t(1) + ' and the denominator expanded that has the given NPVs.', parts: [
      { id: 'eB7a', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.int(1, 9), b: -r.int(1, 9) }; }, function (z) { return excl(z, [{ a: 5, b: -2 }, { a: 3, b: -8 }]); }); return recipQ([o.a, o.b], r); } },
      { id: 'eB7b', level: 'ADV', make: function (r) { var a = r.int(2, 6); return recipQ([0, a, -a], r); } },
      { id: 'eB7c', level: 'ADV', make: function (r) { var o = pickWhere(function () { return { p: nz(r, 1, 7), q: r.int(2, 5) }; }, function (z) { return gcd(z.p, z.q) === 1 && excl(z, [{ p: 3, q: 4 }, { p: 2, q: 3 }]); }); return recipQ([0, [o.p, o.q]], r); } }] },
    { num: 'B8', shared: function (r) {
        return pickWhere(function () { var C = r.pick([120, 144, 180, 240, 288, 300, 360, 420, 480]), d = r.int(2, 5), dv = divisors(C).filter(function (x) { return x >= 4 && x <= 30; }), m = r.pick(dv); return { C: C, d: d, n: m + d, m: m }; }, function (z) { return C_ok(z); });
      },
      stem: function (o) { return 'Students share the ' + t('\\$' + o.C) + ' cost of a bus. If ' + t('n') + ' students sign up but ' + o.d + ' drop out, each remaining student pays ' + t(dq(o.C, 'n-' + o.d)) + ' dollars.'; },
      parts: [
        { id: 'eB8a', level: 'EMG', make: function (r, o) {
          var pay = o.C / o.m, all = o.C / o.n, more = pay - all;
          var p = B.fields('Determine the cost per student when ' + t('n=' + o.n) + ', and how much more that is than if nobody had dropped out.', [{ label: 'Cost per student:', name: 'Cost', before: '\\$', mode: 'math', keys: 'fraction' }, { label: 'How much more:', name: 'More', before: '\\$', mode: 'math', keys: 'fraction' }],
            [U.valCheck(pay, { cp: CP, noUndef: true, cands: [[all, 'value', 'That is the cost if nobody drops out. Only ' + t(o.n + '-' + o.d + '=' + o.m) + ' students pay.']] }), U.valCheck(more, { cp: CP, noUndef: true, cands: [[pay, 'value', 'Subtract the cost if all ' + o.n + ' paid, ' + t('\\frac{' + o.C + '}{' + o.n + '}') + '.']] })],
            [moneyKey(pay), moneyKey(more)], 'Cost ' + t('\\$' + moneyTex(pay)) + '; ' + t('\\$' + moneyTex(more)) + ' more',
            t(dq(o.C, o.n + '-' + o.d) + '=' + dq(o.C, o.m) + '=\\$' + moneyTex(pay)) + '. With all ' + o.n + ': ' + t(dq(o.C, o.n) + '=\\$' + moneyTex(all)) + '. Each pays ' + t('\\$' + moneyTex(more)) + ' more.', ['Substitute ' + t('n=' + o.n) + ', then compare with ' + t('\\frac{' + o.C + '}{' + o.n + '}') + '.'], 'bus: cost and difference');
          p.bad = [[moneyKey(all), moneyKey(more)]];
          return p;
        } },
        { id: 'eB8b', level: 'EMG', make: function (r, o) {
          return U.mc(r, 'State the NPV and the values of ' + t('n') + ' that make sense.', [
            { html: t('n\\ne ' + o.d) + '; ' + t('n') + ' is a whole number greater than ' + t(o.d), right: true },
            { html: t('n\\ne ' + o.d) + '; any real number except ' + t(o.d), why: 'Can ' + t('n') + ' be ' + t('2.5') + ' or negative? It counts students.' },
            { html: t('n\\ne 0') + '; ' + t('n') + ' is a positive whole number', why: 'The denominator is ' + t('n-' + o.d) + '. When is that ' + t(0) + '?' },
            { html: t('n\\ne -' + o.d) + '; ' + t('n') + ' is a whole number greater than ' + t(o.d), why: 'Solve ' + t('n-' + o.d + '=0') + '.' }],
            t('n\\ne ' + o.d) + '. Someone must be left to pay, so ' + t('n') + ' is a whole number greater than ' + t(o.d) + '.', ['NPV from the denominator; then think about who is left to pay.'], 'bus: NPV and context');
        } }] },
    { num: 'B9', parts: [{ id: 'eB9', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { return { a: r.int(1, 9), b: nz(r, 2, 9) }; }, function (z) { return z.a !== Math.abs(z.b) && excl(z, [{ a: 2, b: 4 }]); });
      return U.mc(r, 'The non-permissible values of ' + t(dq('x^{2}-' + o.a * o.a, pt(P.add(P.mono(1, { x: 2 }), P.mono(o.b, { x: 1 }))))) + ' are', [
        { html: t('x\\ne\\pm ' + o.a), why: 'Those come from the numerator. Only the denominator gives NPVs.' }, { html: t(nvT({ x: [0, -o.b] })), right: true },
        { html: t(nvT({ x: [0, o.b] })), why: 'Check the sign: ' + t(pt(lin(1, o.b)) + '=0') + ' gives ' + t('x=' + (-o.b)) + '.' }, { html: t('x\\ne ' + (-o.b)) + ' only', why: 'The common factor ' + t('x') + ' gives ' + t('x\\ne 0') + ' too.' }],
        t(pt(P.add(P.mono(1, { x: 2 }), P.mono(o.b, { x: 1 }))) + '=x(' + pt(lin(1, o.b)) + ')=0') + ': ' + t(nvT({ x: [0, -o.b] })) + '.', HFAC, 'EP MC: NPVs');
    } }] },
    { num: 'B10', parts: [{ id: 'eB10', level: 'ADV', make: function (r) {
      var o = pickWhere(function () { return { p: r.int(2, 4), q: r.int(1, 7), u: r.pick([2, 5]), s: r.int(1, 9), c: nz(r, 1, 9) }; }, function (z) { return gcd(z.p, z.q) === 1 && gcd(z.u, z.s) === 1 && z.s % z.u !== 0 && excl(z, [{ p: 3, q: 4, u: 2, s: 3 }]); });
      var f1 = lin(o.p, o.q), f2 = lin(o.u, -o.s), D = P.mul(f1, f2), x = o.s / o.u;
      return nrPart('The positive non-permissible value of ' + t(dq(pt(lin(1, o.c)), pt(D))) + ', to the nearest tenth, is ____.', x, 1, [[o.q / o.p, CP + 'npv-sign', 'That comes from ' + t(pt(f1)) + ' with the wrong sign: ' + t(pt(f1) + '=0') + ' gives a negative value.'], [o.u / o.s, 'flip', 'Solve ' + t(pt(f2) + '=0') + ': ' + t('x=\\frac{' + o.s + '}{' + o.u + '}') + '.']],
        t('ac=' + o.p * o.u * o.q * -o.s) + ': ' + t(o.p * -o.s) + ' and ' + t(o.q * o.u) + '. ' + t(pt(D) + '=(' + pt(f1) + ')(' + pt(f2) + ')') + '.<br>NPVs ' + t(rt([-o.q, o.p])) + ' and ' + t('\\frac{' + o.s + '}{' + o.u + '}') + '; the positive one is ' + t(fxs(x)) + '.', HFAC, 'EP NR: positive NPV');
    } }] },
    { num: 'C1', section: 'C. Stretch', parts: [{ id: 'eC1', level: 'MAS', make: function (r) {
      var o = pickWhere(function () { return { b: nz(r, 2, 9), r0: nz(r, 1, 6), c: nz(r, 1, 5) }; }, function (z) { var oth = -z.b - z.r0; return oth !== z.r0 && oth !== 0 && excl(z, [{ b: -7, r0: 2 }]); });
      var k = -(o.r0 * o.r0 + o.b * o.r0), oth = -o.b - o.r0;
      var p = B.fields('The expression ' + t(dq(pt(lin(1, o.c)), 'x^{2}' + sg(o.b) + 'x+k')) + ' has a non-permissible value of ' + t('x=' + o.r0) + '. Determine ' + t('k') + ' and the other non-permissible value.',
        [{ label: t('k='), name: 'k' }, { label: 'Other NPV: ' + t('x='), name: 'other NPV' }],
        [K.number(k, function (v) { return v === -k ? { code: 'sign', hint: 'Substitute carefully: ' + t(par(o.r0) + '^{2}' + sg(o.b) + '(' + o.r0 + ')+k=0') + '.' } : null; }), K.number(oth, function (v) { return v === o.r0 ? { code: CP + 'k-gave', hint: 'That is the given NPV. Factor to find the other.' } : v === k ? { code: CP + 'k-gave', hint: 'That is ' + t('k') + '. Factor the denominator to find the other NPV.' } : null; })],
        [String(k), String(oth)], t('k=' + k) + ', other NPV ' + t('x=' + oth),
        t(par(o.r0) + '^{2}' + sg(o.b) + '(' + o.r0 + ')+k=0\\Rightarrow k=' + k) + '. ' + t('x^{2}' + sg(o.b) + 'x' + sg(k) + '=(' + pt(lin(1, -o.r0)) + ')(' + pt(lin(1, -oth)) + ')') + ': the other NPV is ' + t('x=' + oth) + '.', ['An NPV makes the denominator ' + t(0) + '.'], 'EP: k and the other NPV');
      p.bad = [[String(k), String(o.r0)], [String(-k), String(oth)]];
      return p;
    } }] },
    { num: 'C2', parts: [{ id: 'eC2', level: 'MAS', make: function (r) {
      var a = r.pick([1, 3, 4, 5]), D = P.add(P.mono(1, { x: 4 }), P.num(-Math.pow(a, 4)));
      return U.npvPart('Determine the non-permissible values of ' + t(dq('x', pt(D))) + '. (Why are there only two?)', { cp: CP, D: D, v: 'x', npv: { x: [a, -a] }, N: P.v('x'),
        nw: [{ vals: { x: [a, -a, a * a, -a * a] }, code: CP + 'npv-extra', hint: t('x^{2}+' + a * a + '=0') + ' has no real solution: ' + t('x^{2}+' + a * a + '\\ge ' + a * a) + '.' }, { vals: { x: [a * a, -a * a] }, code: 'value', hint: 'Factor twice: ' + t(pt(D) + '=(x^{2}-' + a * a + ')(x^{2}+' + a * a + ')') + ', then factor ' + t('x^{2}-' + a * a) + ' again.' }],
        sol: t(pt(D) + '=(x^{2}-' + a * a + ')(x^{2}+' + a * a + ')=(x-' + a + ')(x+' + a + ')(x^{2}+' + a * a + ')') + '.<br>' + t('x^{2}+' + a * a + '\\ge ' + a * a) + ' is never ' + t(0) + ', so the NPVs are ' + t('x\\ne\\pm ' + a) + ' only.', hints: ['Difference of squares twice. Can a sum of squares be ' + t(0) + '?'], text: 'EP: NPVs of x/(x⁴ − a⁴)' });
    } }] },
    { num: 'C3', shared: function (r) { return { h: pickWhere(function () { return nz(r, 2, 9); }, function (h) { return h !== 4; }) }; },
      stem: function (o) { return 'Consider ' + t(dq(1, 'x^{2}' + sg(-2 * o.h) + 'x+k')) + '.'; },
      parts: [
        { id: 'eC3a', level: 'MAS', make: function (r, o) {
          var k = o.h * o.h;
          var p = B.fields('For which value of ' + t('k') + ' is there exactly one NPV? State it.', [{ label: t('k='), name: 'k' }, { label: 'NPV: ' + t('x\\ne'), name: 'NPV' }],
            [K.number(k, function (v) { return v === -k ? { code: 'sign', hint: 'A perfect square: ' + t('(x' + sg(-o.h) + ')^{2}=x^{2}' + sg(-2 * o.h) + 'x+' + k) + '.' } : v === 2 * o.h || v === -2 * o.h ? { code: 'value', hint: 'The constant of a perfect square is the square of half the middle coefficient.' } : null; }), K.number(o.h, function (v) { return v === -o.h ? { code: CP + 'npv-sign', hint: t('(x' + sg(-o.h) + ')^{2}=0') + ' gives ' + t('x=' + o.h) + '.' } : null; })],
            [String(k), String(o.h)], t('k=' + k) + '; NPV ' + t('x\\ne ' + o.h),
            'Exactly one NPV when the denominator is a perfect square: ' + t('x^{2}' + sg(-2 * o.h) + 'x+' + k + '=(x' + sg(-o.h) + ')^{2}') + '. So ' + t('k=' + k) + ' and the NPV is ' + t('x\\ne ' + o.h) + '.', ['When does a trinomial have only one root? Think of a perfect square.'], 'EP: one NPV');
          p.bad = [[String(-k), String(o.h)], [String(k), String(-o.h)]];
          return p;
        } },
        { id: 'eC3b', level: 'MAS', make: function (r, o) {
          var k = o.h * o.h;
          return U.mc(r, 'For which values of ' + t('k') + ' are there no NPVs?', [
            { html: t('k>' + k), right: true }, { html: t('k\\ge ' + k), why: 'At ' + t('k=' + k) + ' there is one NPV, ' + t('x=' + o.h) + '.' },
            { html: t('k<' + k), why: 'For a small ' + t('k') + ' (try ' + t('k=0') + ') the denominator factors and has two zeros.' }, { html: t('k>' + Math.abs(2 * o.h)), why: 'Complete the square: the denominator is ' + t('(x' + sg(-o.h) + ')^{2}+(k-' + k + ')') + '.' }],
            t('x^{2}' + sg(-2 * o.h) + 'x+k=(x' + sg(-o.h) + ')^{2}+(k-' + k + ')') + '. If ' + t('k>' + k) + ' this is at least ' + t('k-' + k + '>0') + ', never ' + t(0) + ': no NPVs.', ['Complete the square in the denominator.'], 'EP: no NPVs for k');
        } }] }
  ];
  function C_ok(z) { return z.m > 0 && !(z.C === 180 && z.d === 3) && (z.C / z.n) * 100 % 1 === 0 && (z.C / z.m) % 1 === 0; }
  function moneyTex(x) { return Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : x.toFixed(2); }
  function moneyKey(x) { return moneyTex(x); }

  HW.defineLesson({ id: LID, unit: 6, num: '1', title: 'Rational Expressions and Non-Permissible Values', outcome: OUT, calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
