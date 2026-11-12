/* Math 20-1 · Unit 6 · Lesson 7 — Solving Rational Equations (outcome AN6)
 * Assignment 7 (u6_l07.tex, Questions 1–17) and the Lesson 7 Extra Practice (u6_ep07.tex, A1–A3, B1–B7, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out where that is easy). Calculator allowed; roots exact
 * (fractions), except the graphing-calculator and numerical-response items, which are rounded as the booklet asks.
 *
 * HW.p67 — this lesson's kit, also used by u6l8.js (it loads after this file):
 *   KT.F(s, n, den, o)       one term: sign s (±1), numerator n (a number, or coefficients high → low: [2, -1] = 2x − 1,
 *                            [1, 0, 4] = x² + 4), denominator den = list of numbers and linear factors [a, b] (= a·x + b;
 *                            [1, 0] is x), o: { dt: denominator LaTeX as shown, asc: show it in ascending order (6 − x) }.
 *   KT.eq(v, L, R, o)        the equation L = R worked as the booklet does: factor the denominators, NPVs, the LCD (each
 *                            different factor to its highest power; opposite factors 6 − x = −(x − 6) are the same factor
 *                            with a −1), every term multiplied by the LCD (o.cross: "cross-multiply"), solved (linear,
 *                            the x² terms cancelling, a quadratic by factoring or the formula, a false statement), NPV
 *                            roots rejected, o.verify: each root verified exactly. Returns { tex, npv, valid, extr, info,
 *                            sol, wr (wrong roots from not multiplying a whole-number term by the LCD / losing the −1 of an
 *                            opposite denominator) … }.
 *   KT.solvePart / npvPart / verifyPart / approxPart / numPart / mc — the answer boxes (roots use HW.u6assess.rootsPart
 *                            from u6test.js, NPVs HW.u6assess.npvPart — called only inside generators, since the test
 *                            file loads after the lessons).
 * Recognised mistakes (codes u6l7-…, u6l8-…): an extraneous (NPV) root kept, a valid root rejected, "no solution" when
 * there is one, a missing root, signs, a whole-number term not multiplied by the LCD, the −1 of an opposite denominator
 * lost, a bracket not distributed, NPVs of one side only / with the wrong signs / missing, the verification's conclusion,
 * the ratio's two amounts swapped, k vs the given root.
 * Conversions: "verify" → LS and RS boxes and yes/no; "explain the error" → MC on the error, then solve correctly;
 * graphing-calculator items → the roots to the nearest hundredth (the window and Y1/Y2 are in the solution); "write and
 * solve a rational equation" (ratios) → the two amounts; "solve for q" (lens) → the formula, checked by value.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 7b, 11, Extra C1b, C2a, C3. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!P) throw new Error('js/lessons/u6l7.js needs js/poly.js');
  var LID = 'u6l7', CP = LID + '-';
  function A6() { var a = HW.u6assess; if (!a || !a.rootsPart) throw new Error('u6l7/u6l8 need js/lessons/u6test.js (HW.u6assess)'); return a; }

  /* ======================================================================================================
   * HW.p67 — rational equations
   * ====================================================================================================== */
  var KT = HW.p67 = {};
  var gcd = function (a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); };
  function lcm(a, b) { return Math.abs(a) / gcd(a, b) * Math.abs(b); }
  function pick(gen, test) { for (var i = 0; i < 20000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u6l7/u6l8: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function mon(v, e) { var o = {}; if (e) o[v] = e; return o; }
  function lp(a, b, v) { return P.add(P.mono(a, mon(v, 1)), P.num(b)); }
  function cpoly(n, v) {
    if (typeof n === 'number') return P.num(n);
    if (Array.isArray(n)) { var d = n.length - 1, p = P.num(0); n.forEach(function (c, i) { if (c) p = P.add(p, P.mono(c, mon(v, d - i))); }); return p; }
    return n;
  }
  function tx(p) { return P.tex(p); }
  function txa(p) { return P.tex(p, { order: 'asc' }); }
  function R(x) { return Array.isArray(x) ? ex.norm(x[0], x[1]) : [x, 1]; }
  function rv(x) { x = R(x); return x[0] / x[1]; }
  function rt(x) { return ex.texRat(R(x)); }
  function qa(a, b) { a = R(a); b = R(b); return ex.norm(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function qm(a, b) { a = R(a); b = R(b); return ex.norm(a[0] * b[0], a[1] * b[1]); }
  function qd(a, b) { a = R(a); b = R(b); return ex.norm(a[0] * b[1], a[1] * b[0]); }
  function has(arr, x) { return arr.some(function (y) { return Math.abs(rv(y) - rv(x)) < 1e-9; }); }
  function uniqR(a) { var out = []; a.forEach(function (x) { if (!has(out, x)) out.push(R(x)); }); return out.sort(function (p, q) { return rv(p) - rv(q); }); }
  function isInt(x) { return R(x)[1] === 1; }
  function coefT(c) { return c === 1 ? '' : c === -1 ? '-' : String(c); }
  function normF(f) { var a = f[0], b = f[1], g = gcd(a, b) || 1; if (a < 0) g = -g; return { a: a / g, b: b / g, g: g, key: (a / g) + ':' + (b / g) }; }
  function F(s, n, den, o) { return { s: s, n: n, den: den || [], o: o || {} }; }
  function sgnF(c, n, den, o) { return F(c < 0 ? -1 : 1, typeof n === 'number' ? Math.abs(n) : n, den, o); } // a term whose sign is that of c (n a number: |n|)
  var X = [1, 0];
  function same(a, b) { return a.length === b.length && a.every(function (x) { return has(b, x); }); }

  /* exact roots of A x² + B x + C (D = B² − 4AC > 0, not a square), in simplest radical form */
  function exactRoots(Ai, Bi, Di) {
    var k = ex.nthFactor(Di, 2), m = Di / (k * k), g = gcd(gcd(Bi, k), 2 * Ai), b = -Bi / g, kk = k / g, d = 2 * Ai / g;
    if (d < 0) { d = -d; b = -b; kk = -kk; }
    var rad = (Math.abs(kk) === 1 ? '' : Math.abs(kk)) + '\\sqrt{' + m + '}';
    function piece(sgn) { var top = (b === 0 ? (sgn * kk < 0 ? '-' : '') : b + (sgn * kk < 0 ? '-' : '+')) + rad; return d === 1 ? top : '\\frac{' + top + '}{' + d + '}'; }
    var vp = (b + kk * Math.sqrt(m)) / d, vm = (b - kk * Math.sqrt(m)) / d;
    return { tex: [piece(1), piece(-1)], vals: [vp, vm], pm: (d === 1 ? (b === 0 ? '' : b) + '\\pm ' + rad : '\\frac{' + (b === 0 ? '' : b) + '\\pm ' + rad + '}{' + d + '}'), b: b, k: Math.abs(kk), m: m, d: d };
  }
  KT.exactRoots = exactRoots;

  /* E (a polynomial in v, integer coefficients): its roots */
  function solveE(E, v) {
    if (P.isZero(E)) return { deg: -1, all: true, roots: [] };
    var deg = P.degreeIn(E, v);
    if (deg === 0) return { deg: 0, roots: [], c: P.constant(E) };
    var a = P.coef(E, mon(v, 2)), b = P.coef(E, mon(v, 1)), c = P.constant(E);
    if (deg === 1) return { deg: 1, roots: [qd([-c[0], c[1]], b)], b: b, c: c };
    if (deg > 2) return { deg: deg, roots: [], big: true };
    var s = P.lead(E)[0] < 0 ? -1 : 1, A = s * rv(a), B = s * rv(b), C = s * rv(c);
    var g = gcd(gcd(A, B), C) || 1, Ar = A / g, Br = B / g, Cr = C / g, D = Br * Br - 4 * Ar * Cr;
    var out = { deg: 2, A: A, B: B, C: C, g: g, Ar: Ar, Br: Br, Cr: Cr, D: D, Es: P.scale(E, s) };
    if (D < 0) { out.roots = []; out.neg = true; return out; }
    var sq = Math.round(Math.sqrt(D));
    if (sq * sq === D) { out.roots = uniqR([ex.norm(-Br + sq, 2 * Ar), ex.norm(-Br - sq, 2 * Ar)]); out.dbl = D === 0; return out; }
    out.roots = []; out.irr = exactRoots(Ar, Br, D); return out;
  }
  KT.solveE = solveE;
  /* factored form of the reduced quadratic Ar x² + Br x + Cr with rational roots */
  function facQ(info, v) {
    var list = [], dd = 1;
    info.roots.forEach(function (x) { x = R(x); if (x[0] === 0) list.unshift(v); else list.push('(' + tx(lp(x[1], -x[0], v)) + ')'); dd *= x[1]; });
    if (info.roots.length === 1) { var x0 = R(info.roots[0]); dd *= x0[1]; list = [list[0] + '^{2}']; }
    var k = info.Ar / dd;
    return coefT(k) + list.join('');
  }
  function monoTx(c, e, v, needOne) { // c a positive rational
    c = R(c);
    var cs = c[1] === 1 ? (c[0] === 1 ? '' : String(c[0])) : '\\frac{' + c[0] + '}{' + c[1] + '}';
    var s = cs + (e ? v + (e > 1 ? '^{' + e + '}' : '') : '');
    return s || (needOne ? '1' : '');
  }

  /* the equation L = R (lists of KT.F terms) worked out */
  KT.eq = function (v, L, Rr, o) {
    o = o || {};
    function cl(tm) { return { s: tm.s, n: tm.n, den: tm.den, o: tm.o || {} }; }
    L = L.map(cl); Rr = Rr.map(cl);
    var all = L.concat(Rr), FS = {}, order = [], kL = 1;
    all.forEach(function (tm) {
      tm.np = cpoly(tm.n, v); tm.k = 1; tm.fs = {}; tm.dp = P.num(1);
      tm.den.forEach(function (d) {
        if (typeof d === 'number') { tm.k *= d; tm.dp = P.scale(tm.dp, d); return; }
        var f = normF(d); tm.k *= f.g; tm.dp = P.mul(tm.dp, lp(d[0], d[1], v));
        tm.fs[f.key] = (tm.fs[f.key] || 0) + 1;
        if (!FS[f.key]) { FS[f.key] = { a: f.a, b: f.b, n: 0 }; order.push(f.key); }
      });
      Object.keys(tm.fs).forEach(function (key) { FS[key].n = Math.max(FS[key].n, tm.fs[key]); });
      kL = lcm(kL, tm.k);
    });
    order.sort(function (a, b) { return (a === '1:0' ? 0 : 1) - (b === '1:0' ? 0 : 1); });
    var npvList = order.map(function (key) { return ex.norm(-FS[key].b, FS[key].a); });
    var npv = {}; npv[v] = npvList;
    function binT(key, e) { return '(' + tx(lp(FS[key].a, FS[key].b, v)) + ')' + (e > 1 ? '^{' + e + '}' : ''); }
    var lcdT = (function () {
      var s = kL > 1 ? String(kL) : '', me = FS['1:0'] ? FS['1:0'].n : 0, bins = order.filter(function (k) { return k !== '1:0'; });
      s += me ? v + (me > 1 ? '^{' + me + '}' : '') : '';
      if (!s && bins.length === 1 && FS[bins[0]].n === 1) return tx(lp(FS[bins[0]].a, FS[bins[0]].b, v));
      bins.forEach(function (k) { s += binT(k, FS[k].n); });
      return s || '1';
    })();
    all.forEach(function (tm) {
      tm.c = kL / tm.k; tm.mf = {}; var mp = P.num(tm.c);
      order.forEach(function (key) { var e = FS[key].n - (tm.fs[key] || 0); tm.mf[key] = e; if (e) mp = P.mul(mp, P.pow(lp(FS[key].a, FS[key].b, v), e)); });
      tm.mult = mp; tm.prod = P.scale(P.mul(tm.np, mp), tm.s);
    });
    function prodTex(tm) {
      var sg = tm.s * (tm.c < 0 ? -1 : 1), ca = Math.abs(tm.c), me = tm.mf['1:0'] || 0, bins = '';
      order.forEach(function (k) { if (k !== '1:0' && tm.mf[k] > 0) bins += binT(k, tm.mf[k]); });
      var ts = P.terms(tm.np), body, bare = false;
      if (ts.length === 2 && P.degreeIn(tm.np, v) === 1) { // a binomial numerator that is one of the multiplier's factors: (x − 2)(x − 2) → (x − 2)²
        var nf = normF([rv(P.coef(tm.np, mon(v, 1))), rv(P.constant(tm.np))]);
        if (Math.abs(nf.g) === 1 && tm.mf[nf.key] > 0 && isInt(P.coef(tm.np, mon(v, 1))) && isInt(P.constant(tm.np))) {
          var bins2 = ''; order.forEach(function (k) { if (k !== '1:0' && tm.mf[k] > 0) bins2 += binT(k, tm.mf[k] + (k === nf.key ? 1 : 0)); });
          var fr2 = monoTx([Math.abs(tm.c), 1], tm.mf['1:0'] || 0, v, false);
          return { neg: (sg * nf.g) < 0, body: fr2 + bins2, bare: false };
        }
      }
      if (!ts.length) body = '0';
      else if (ts.length === 1) {
        var c0 = ts[0].c; if (c0[0] < 0) sg = -sg;
        body = monoTx(ex.norm(Math.abs(c0[0]) * ca, c0[1]), (ts[0].v[v] || 0) + me, v, !bins) + bins;
      } else {
        var fr = monoTx([ca, 1], me, v, false);
        if (!fr && !bins) { body = tx(tm.np); bare = true; } else body = fr + '(' + tx(tm.np) + ')' + bins;
      }
      return { neg: sg < 0, body: body, bare: bare };
    }
    function sideT(list) {
      if (!list.length) return '0';
      return list.map(function (tm, i) { var p = prodTex(tm), b = p.bare && p.neg ? '(' + p.body + ')' : p.body; return (i === 0 ? (p.neg ? '-' : '') : (p.neg ? '-' : '+')) + b; }).join('');
    }
    function sum(list, f) { return list.reduce(function (s, tm) { return P.add(s, f(tm)); }, P.num(0)); }
    function shownDen(tm) { return tm.o.dt || (tm.o.asc ? txa(tm.dp) : tx(tm.dp)); }
    var Lt = sideT(L), Rt = sideT(Rr), SL = sum(L, function (tm) { return tm.prod; }), SR = sum(Rr, function (tm) { return tm.prod; });
    var crossed = o.cross && L.length === 1 && Rr.length === 1;
    if (crossed) { // a·d = c·b, written with the denominators as shown (4 = −3(5 − 2y))
      var mulT = function (np, sg, dp, dT) {
        var nn = P.scale(np, sg), one = P.count(dp) === 1 && !P.vars(dp).length && rv(P.constant(dp)) === 1;
        if (one) return tx(nn);
        var nM = P.count(nn) === 1, dM = P.count(dp) === 1;
        if (nM && dM) return tx(P.mul(nn, dp));
        if (nM) { var c = tx(nn); return c === '1' ? dT : c === '-1' ? '-(' + dT + ')' : c + '(' + dT + ')'; }
        if (dM) { var c2 = tx(dp); return (c2 === '1' ? '' : c2 === '-1' ? '-' : c2) + '(' + tx(nn) + ')'; }
        return '(' + tx(nn) + ')(' + dT + ')';
      };
      Lt = mulT(L[0].np, L[0].s, Rr[0].dp, shownDen(Rr[0])); Rt = mulT(Rr[0].np, Rr[0].s, L[0].dp, shownDen(L[0]));
      SL = P.scale(P.mul(L[0].np, Rr[0].dp), L[0].s); SR = P.scale(P.mul(Rr[0].np, L[0].dp), Rr[0].s);
    }
    var E = P.sub(SL, SR);
    var info = solveE(E, v), cands = info.roots;
    var valid = cands.filter(function (x) { return !has(npvList, x); }), extr = cands.filter(function (x) { return has(npvList, x); });

    // display of the equation
    function termTx(tm, i) {
      var nt = tm.o.nt || tx(tm.np), body;
      if (!tm.den.length) body = tm.s < 0 && P.count(tm.np) > 1 ? '(' + nt + ')' : nt;
      else body = '\\frac{' + nt + '}{' + (tm.o.dt || (tm.o.asc ? txa(tm.dp) : tx(tm.dp))) + '}';
      return (i === 0 ? (tm.s < 0 ? '-' : '') : (tm.s < 0 ? '-' : '+')) + body;
    }
    function listTx(list) { return list.length ? list.map(termTx).join('') : '0'; }
    var tex = listTx(L) + '=' + listTx(Rr);
    function facDen(tm) {
      var s = (tm.k < 0 ? '-' : '') + (Math.abs(tm.k) > 1 ? Math.abs(tm.k) : ''), me = tm.fs['1:0'] || 0, keys = Object.keys(tm.fs).filter(function (k) { return k !== '1:0'; });
      s += me ? v + (me > 1 ? '^{' + me + '}' : '') : '';
      if (!s.replace('-', '') && keys.length === 1 && tm.fs[keys[0]] === 1) return (tm.k < 0 ? '-(' : '') + tx(lp(FS[keys[0]].a, FS[keys[0]].b, v)) + (tm.k < 0 ? ')' : '');
      keys.forEach(function (k) { s += binT(k, tm.fs[k]); });
      return s;
    }
    var notes = [], opp = false;
    all.forEach(function (tm) {
      if (!tm.den.length) return;
      var shown = tm.o.dt || (tm.o.asc ? txa(tm.dp) : tx(tm.dp)), fd = facDen(tm);
      if (crossed && tm.k < 0) return;
      if (fd !== shown && notes.indexOf(shown + '=' + fd) < 0) notes.push(shown + '=' + fd);
      if (tm.k < 0) opp = true;
    });

    // worked solution
    var s = '';
    if (notes.length) s += (opp ? 'Write each denominator with the same factors: ' : 'Factor the denominators: ') + notes.map(function (n) { return t(n); }).join(', ') + '.<br>';
    s += 'NPVs: ' + t(A6npvTex(npv)) + '.';
    if (o.cross) s += ' Cross-multiply: ' + t(Lt + '=' + Rt) + '.';
    else if (lcdT !== '1') s += ' LCD ' + t(lcdT) + '. Multiply every term by it: ' + t(Lt + '=' + Rt) + '.';
    var Lx = tx(SL), Rx = tx(SR), exp = Lx + '=' + Rx, last = Lt + '=' + Rt;
    var nT = function (x) { return (x.replace(/^-/, '').match(/[+-]/g) || []).length + 1; };
    var reorder = !/\(|\\frac/.test(Lt + Rt) && P.count(SL) === nT(Lt) && P.count(SR) === nT(Rt);
    if (exp !== last && !reorder) { s += '<br>' + t(exp); last = exp; }
    var cancel = (P.degreeIn(SL, v) === 2 || P.degreeIn(SR, v) === 2) && info.deg < 2;
    if (cancel) s += ' (the ' + t(v + '^{2}') + ' terms cancel)';
    if (info.deg === 1) {
      var B = rv(info.b), C = rv(info.c), lhs = B < 0 ? monoTx([-B, 1], 1, v, true) : monoTx([B, 1], 1, v, true), rhs = rt(B < 0 ? C : -C);
      var lineC = lhs + '=' + rhs;
      if (lineC !== last) s += (cancel ? ', so ' : '<br>') + t(lineC);
      if (Math.abs(B) !== 1) s += ', so ' + t(v + '=' + rt(cands[0]));
      s += '.';
    } else if (info.deg === 0) {
      s += '<br>' + t('0=' + rt(qm(info.c, -1))) + ', which is never true: no value of ' + t(v) + ' works.';
    } else if (info.deg === 2) {
      s += '<br>' + t(tx(info.Es) + '=0');
      if (info.g > 1) s += '; divide by ' + t(info.g) + ': ' + t(tx(P.scale(info.Es, [1, info.g])) + '=0');
      if (info.roots.length) s += '<br>' + t(facQ(info, v) + '=0') + ', so ' + info.roots.map(function (x) { return t(v + '=' + rt(x)); }).join(' or ') + (info.dbl ? ' (a double root)' : '') + '.';
      else if (info.irr) {
        var raw = v + '=\\frac{' + (-info.Br) + '\\pm\\sqrt{' + info.D + '}}{' + 2 * info.Ar + '}';
        s += '. It does not factor: ' + t(raw + (raw.replace(/\s/g, '') === (v + '=' + info.irr.pm).replace(/\s/g, '') ? '' : '=' + info.irr.pm)) + '.';
      } else if (info.neg) s += '. The discriminant is ' + t('b^{2}-4ac=' + info.D) + ', which is negative: no real roots.';
    }
    if (extr.length) s += '<br>' + extr.map(function (x) { return t(v + '=' + rt(x)); }).join(' and ') + (extr.length > 1 ? ' are NPVs: reject them' : ' is an NPV: reject it') + ' (extraneous).';
    if (info.deg >= 0) {
      if (info.irr) s += '<br>The solutions are ' + t(v + '=' + info.irr.pm) + ' (' + t(v + '\\approx ' + K.roundTo(info.irr.vals[0], 2).toFixed(2)) + ' or ' + t(v + '\\approx ' + K.roundTo(info.irr.vals[1], 2).toFixed(2)) + ').';
      else if (valid.length) s += '<br>' + (valid.length > 1 ? 'The solutions are ' : 'The solution is ') + valid.map(function (x) { return t(v + '=' + rt(x)); }).join(' and ') + '.';
      else s += '<br>The equation has no ' + (info.neg ? 'real ' : '') + 'solution.';
    }
    function val(tm, x) { var env = {}; env[v] = R(x); return qm(tm.s, qd(P.atExact(tm.np, env), P.atExact(tm.dp, env))); }
    function sideV(list, x) {
      if (!list.length) return { t: '0', v: [0, 1] };
      var vs = list.map(function (tm) { return val(tm, x); }), tot = vs.reduce(qa, [0, 1]);
      var tt = vs.map(function (q, i) { return i === 0 ? rt(q) : (q[0] < 0 ? '-' + rt([-q[0], q[1]]) : '+' + rt(q)); }).join('');
      return { t: list.length > 1 ? tt + '=' + rt(tot) : rt(tot), v: tot };
    }
    if (o.verify && !info.irr) valid.forEach(function (x) { var a = sideV(L, x), b = sideV(Rr, x); s += '<br>Verify ' + t(v + '=' + rt(x)) + ': LS ' + t('=' + a.t) + ', RS ' + t('=' + b.t) + ' ✓'; });

    // wrong roots: a whole-number term not multiplied by the LCD; the −1 of an opposite denominator lost
    var wr = [];
    function alt(f, code, hint) {
      var E2 = P.sub(sum(L, f), sum(Rr, f)), i2 = solveE(E2, v);
      if (i2.roots.length && !same(i2.roots, valid)) { var vv = i2.roots.filter(function (x) { return !has(npvList, x); }); if (vv.length && !same(vv, valid)) wr.push({ vals: vv, code: code, hint: hint }); }
    }
    if (lcdT !== '1' && all.some(function (tm) { return !tm.den.length; })) alt(function (tm) { return tm.den.length ? tm.prod : P.scale(tm.np, tm.s); }, 'oneterm', 'Multiply <b>every</b> term by the LCD, including the whole-number term(s).');
    if (opp) alt(function (tm) { return P.scale(tm.prod, tm.c < 0 ? -1 : 1); }, 'opp', 'Check the opposite denominator: ' + t('a-' + v + '=-(' + v + '-a)') + ', so that fraction changes sign when you rewrite it.');
    return { v: v, L: L, R: Rr, tex: tex, npv: npv, npvList: npvList, lcdT: lcdT, Lt: Lt, Rt: Rt, SL: SL, SR: SR, E: E, info: info, valid: valid, extr: extr, sol: s, wr: wr, opp: opp, notes: notes,
      sideV: sideV, termTx: termTx, listTx: listTx };
  };
  function A6npvTex(o) {
    var vs = Object.keys(o).filter(function (v) { return o[v].length; });
    if (!vs.length) return '\\text{none}';
    return vs.map(function (v) { return v + '\\ne ' + o[v].map(rt).join(',\\ '); }).join(',\\ ');
  }
  KT.npvTex = A6npvTex;

  /* ---------- codes (per lesson prefix) ---------- */
  var BASE = {
    'eq-extr': ['Kept an extraneous root (an NPV)', 'b'], 'eq-rejvalid': ['Rejected a root that checks', 's'], 'eq-nosol': ['Said “no solution” when there is one', 'n'],
    'eq-missing': ['Found only one of the roots', 's'], 'eq-sign': ['Root(s) with the wrong sign', 's'], oneterm: ['Did not multiply every term by the LCD', 'n'],
    opp: ['Opposite denominator: lost the −1', 'b'], distrib: ['Did not distribute (a bracket multiplied by only its first term)', 'b'],
    'npv-sign': ['NPVs with the wrong signs', 'b'], 'npv-missing': ['Missed an NPV', 's'], 'npv-extra': ['Listed a value that is not an NPV', 's'], 'npv-one': ['NPVs of one side only', 'b'],
    'verify-concl': ['Verification: wrong conclusion', 'b'], 'ratio-swap': ['Ratio: the two amounts swapped', 's'], 'ratio-diff': ['Ratio: gave the difference or the total, not the amount', 'n'],
    'gave-k': ['Gave the value of k instead of what was asked', 'b'], 'gave-given': ['Gave the value that was given', 'n'], 'k-sign': ['Value with the wrong sign', 's'],
    'approx-one': ['Found only one of the solutions', 's'], 'neg-root': ['Kept the inadmissible (negative) root', 's'], 'other': ['Gave the other quantity, not the one asked for', 's'],
    'k-dir': ['Inequality the wrong way round', 'b'], 'k-eq': ['Gave the boundary value only, not the inequality', 's'], 'formula': ['Formula: rearranged incorrectly', 'n'], 'recip': ['Took the reciprocal of each term (1/f = 1/p + 1/q is not f = p + q)', 'n']
  };
  KT.codes = function (cp) {
    var codes = {}, part = {};
    Object.keys(BASE).forEach(function (k) { codes[cp + k] = BASE[k][0]; part[cp + k] = BASE[k][1]; });
    HW.addCodes(codes); HW.addPartial(part);
  };
  KT.codes(CP);

  /* ---------- parts ---------- */
  function big(s) { return String(s).replace(/\\frac\{/g, '\\dfrac{'); }
  KT.big = big;
  /* roots box. o: { radical, prompt, extraWrongs } */
  KT.solvePart = function (cp, prompt, W, hints, text, o) {
    o = o || {};
    var wrongs = W.wr.map(function (w) { return { vals: w.vals, code: cp + w.code, hint: w.hint }; }).concat(o.wrongs || []);
    var vals = W.valid, keyTex = null, radical = false;
    if (W.info.irr) { vals = W.info.irr.vals; keyTex = W.v + '=' + W.info.irr.tex[0] + ',\\ ' + W.v + '=' + W.info.irr.tex[1]; radical = true; }
    var p = A6().rootsPart(cp, prompt, vals, { v: W.v, extr: W.extr, wrongs: wrongs, bothValid: vals.length > 1, radical: radical, keyTex: keyTex, noneHint: o.noneHint }, o.sol || W.sol, hints, text);
    if (radical) p.bad = ['\\text{no solution}', W.v + '=' + W.info.irr.tex[0], W.v + '=' + (-K.roundTo(W.info.irr.vals[0], 6))];
    return p;
  };
  KT.npvPart = function (cp, prompt, W, nw, hints, text) {
    var sol = (W.notes.length ? 'Factor: ' + W.notes.map(function (n) { return t(n); }).join(', ') + '.<br>' : '') + 'Set each factor of each denominator (on both sides) equal to ' + t(0) + '.<br>NPVs: ' + t(A6npvTex(W.npv)) + '.';
    return A6().npvPart(cp, prompt, W.npv, { v: W.v, nw: (nw || []).map(function (w) { return { vals: w.vals, code: cp + w.code, hint: w.hint }; }) }, sol, hints, text);
  };
  /* LS and RS at x0, then yes/no */
  function ynCheck(truth) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').trim().toLowerCase();
      if (!s) return form('empty', 'Answer <b>yes</b> or <b>no</b>.');
      var no = /^(no|n|not|false|isn'?t|it is not|nope)\b/.test(s), yes = !no && /^(yes|y|true|it is|is|yep)\b/.test(s);
      if (!no && !yes) return form('unreadable', 'Answer <b>yes</b> or <b>no</b>.');
      return yes === truth ? ok() : wrong('value', null);
    };
  }
  KT.verifyPart = function (cp, W, x0, sol, hints, text) {
    var v = W.v, a = W.sideV(W.L, x0), b = W.sideV(W.R, x0), truth = rv(a.v) === rv(b.v) || Math.abs(rv(a.v) - rv(b.v)) < 1e-12;
    var c1 = K.value(a.v), c2 = K.value(b.v), c3 = ynCheck(truth);
    var prompt = 'Verify whether ' + t(v + '=' + rt(x0)) + ' is a solution of ' + t(big(W.tex)) + '. Give each side as a number.';
    var fields = [{ label: 'LS =', mode: 'math', keys: 'u6num', name: 'LS', placeholder: 'left side' }, { label: 'RS =', mode: 'math', keys: 'u6num', name: 'RS', placeholder: 'right side' }, { label: 'A solution?', mode: 'text', name: 'Solution?', placeholder: 'yes or no', wide: true }];
    var check = function (resp) {
      resp = resp || [];
      var r1 = c1(resp[0] == null ? '' : resp[0]), r2 = c2(resp[1] == null ? '' : resp[1]), r3 = c3(resp[2] == null ? '' : resp[2]);
      if (r1.v === 'correct' && r2.v === 'correct' && r3.v === 'correct') return ok();
      if (r1.v === 'wrong' || r2.v === 'wrong') {
        if (K.value(b.v)(resp[0] || '').v === 'correct' && K.value(a.v)(resp[1] || '').v === 'correct' && rv(a.v) !== rv(b.v)) return wrong('swap-answer', 'Those are the right values in each other’s boxes: LS is the left side.');
        return wrong('value', (r1.v === 'wrong' ? '<b>LS:</b> substitute ' + t(v + '=' + rt(x0)) + ' into each term of the left side and add. ' : '') + (r2.v === 'wrong' ? '<b>RS:</b> substitute into the right side and simplify.' : ''));
      }
      if (r1.v === 'form') return { v: 'form', code: r1.code, hint: '<b>LS:</b> ' + r1.hint };
      if (r2.v === 'form') return { v: 'form', code: r2.code, hint: '<b>RS:</b> ' + r2.hint };
      if (r3.v === 'form') return r3;
      return wrong(cp + 'verify-concl', truth ? 'LS = RS and ' + t(v + '=' + rt(x0)) + ' is not an NPV, so it <b>is</b> a solution.' : 'LS ≠ RS, so ' + t(v + '=' + rt(x0)) + ' is <b>not</b> a solution.');
    };
    var key = [rt(a.v), rt(b.v), truth ? 'yes' : 'no'];
    var p = { prompt: prompt, input: { type: 'fields', fields: fields }, check: check, key: key, answer: 'LS ' + t('=' + rt(a.v)) + ', RS ' + t('=' + rt(b.v)) + ': ' + (truth ? 'yes, it is a solution' : 'no, it is not a solution'), solution: sol, hints: hints || [], text: text };
    p.bad = [[key[0], key[1], truth ? 'no' : 'yes']];
    if (rv(a.v) !== rv(b.v)) p.bad.push([key[1], key[0], key[2]]);
    return p;
  };
  /* rounded roots (graphing calculator, nearest hundredth) */
  KT.approxPart = function (cp, prompt, vals, dp, v, sol, hints, text) {
    var want = vals.map(function (x) { return K.roundTo(x, dp); }).sort(function (a, b) { return a - b; });
    function close(a, b) { return Math.abs(a - b) < 1e-9; }
    var check = function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\(left|right)/g, '').replace(/\\approx|≈|\\doteq|\\simeq/g, '=').replace(/\\text\{\s*(or|and)\s*\}/gi, ',').replace(/\b(or|and)\b/gi, ',').replace(/;/g, ',').replace(/\\[ ,;:!]|~/g, ' ');
      if (/no\s*(real)?\s*sol/i.test(s.replace(/\\text\{([^}]*)\}/g, '$1'))) return wrong('value', 'The graphs do cross: find each intersection.');
      s = s.replace(/[a-zA-Z]\s*=\s*/g, '');
      if (!s.trim()) return form('empty', 'Type your answer first.');
      var got = [];
      var ps = s.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
      for (var i = 0; i < ps.length; i++) { var q = ex.parse(ps[i]); if (!q.ok) return form('unreadable', 'Write each solution as a decimal, separated by commas, e.g. ' + t(v + '=1.23,\\ ' + v + '=-4.56') + '.'); var x = ex.value(q.ast); if (!isFinite(x)) return form('unreadable', 'Write each solution as a decimal.'); got.push(x); }
      got = got.filter(function (x, i) { return got.slice(0, i).every(function (y) { return !close(x, y); }); });
      var rd = got.map(function (g) { return K.roundTo(g, dp); }), inW = function (x) { return want.some(function (w) { return close(x, w); }); };
      if (got.length === want.length && want.every(function (w) { return rd.some(function (x) { return close(x, w); }); }) && rd.every(inW)) {
        if (got.every(inW)) return ok();
        return form('round', 'Round each solution to the nearest hundredth.');
      }
      if (got.length < want.length && rd.every(inW)) return wrong(cp + 'approx-one', 'Correct so far — but the graphs cross ' + (want.length === 2 ? 'twice' : want.length + ' times') + '. Widen the window and find every intersection.');
      if (got.some(function (g) { return vals.some(function (x) { return Math.abs(g - x) < 0.02; }); })) return wrong('round', 'Close — check your rounding (to the nearest hundredth) and that you have every intersection.');
      return wrong('value', 'Check how you typed each side into the calculator: brackets around every numerator and denominator.');
    };
    var key = want.map(function (w) { return v + '\\approx ' + w.toFixed(dp); }).join(',\\ ');
    var p = KP.math(big(prompt), check, key, sol, hints, text, { keys: 'u6sol', vars: [v], placeholder: 'e.g. ' + v + ' = 1.23, ' + v + ' = -4.56' });
    p.bad = want.length > 1 ? [v + '=' + want[0].toFixed(dp), want.map(function (w) { return v + '=' + (-w).toFixed(dp); }).join(',')] : [v + '=' + (-want[0]).toFixed(dp)];
    p.bad = p.bad.filter(function (b) { return check(b).v !== 'correct'; });
    return p;
  };
  /* several number boxes: boxes [{ label, val, after, cands: [[value, code, hint]] }] */
  KT.numPart = function (prompt, boxes, sol, hints, text, o) {
    o = o || {};
    var fields = boxes.map(function (b) { return { label: b.label, mode: 'math', keys: o.keys || 'u6num', name: b.name || b.label.replace(/[:=]\s*$/, ''), after: b.after, placeholder: b.ph || '' }; });
    var checks = boxes.map(function (b) { return K.value(b.val, { diag: function (x) { var c = (b.cands || []).filter(function (cd) { return Math.abs(rv(cd[0]) - x) < 1e-9; })[0]; return c ? { code: c[1], hint: c[2] } : null; } }); });
    var check = function (resp) {
      resp = resp || [];
      var rs = checks.map(function (c, i) { return c(resp[i] == null ? '' : resp[i]); });
      if (rs.every(function (x) { return x.v === 'correct'; })) return ok();
      if (o.swap && boxes.length === 2 && K.value(boxes[1].val)(resp[0] || '').v === 'correct' && K.value(boxes[0].val)(resp[1] || '').v === 'correct') return wrong(o.swap, 'Right numbers in each other’s boxes: check which amount is which.');
      for (var i = 0; i < rs.length; i++) if (rs[i].v === 'wrong') return wrong(rs[i].code, '<b>' + fields[i].name + ':</b> ' + (rs[i].hint || 'Check this one again.'));
      for (var j = 0; j < rs.length; j++) if (rs[j].v === 'form') return { v: 'form', code: rs[j].code, hint: '<b>' + fields[j].name + ':</b> ' + rs[j].hint };
      return wrong('value', null);
    };
    var key = boxes.map(function (b) { return b.key || rt(b.val); });
    var p = { prompt: prompt, input: { type: 'fields', fields: fields }, check: check, key: key, answer: boxes.map(function (b, i) { return fields[i].name + ' ' + t('=' + key[i]) + (b.after ? ' ' + b.after : ''); }).join(', '), solution: sol, hints: hints || [], text: text };
    p.bad = [];
    if (boxes.length === 2 && rv(boxes[0].val) !== rv(boxes[1].val)) p.bad.push([key[1], key[0]]);
    boxes.forEach(function (b, i) { (b.cands || []).forEach(function (cd) { var bb = key.slice(); bb[i] = rt(cd[0]); if (rv(cd[0]) !== rv(b.val)) p.bad.push(bb); }); });
    return p;
  };
  /* multiple choice with duplicate options dropped */
  KT.mc = function (r, prompt, opts, sol, hints, text) {
    var seen = {}, list = [];
    opts.forEach(function (o) { var k = o.html.replace(/\s/g, ''); if (!seen[k]) { seen[k] = 1; list.push(o); } });
    if (list.filter(function (o) { return o.right; }).length !== 1) throw new Error('mc needs one right option');
    return KP.mc(r, big(prompt), list, sol, hints, text);
  };
  /* a side for the graphing calculator: 3/(X-2), X/(X+1), 2/X+1 */
  function plain(p, v) { return tx(p).replace(/\^\{(\d+)\}/g, '^$1').replace(new RegExp(v, 'g'), 'X'); }
  KT.calcSide = function (list, v) {
    if (!list.length) return '0';
    return list.map(function (tm, i) {
      var np = cpoly(tm.n, v), n = plain(np, v), body;
      if (!tm.den.length) body = tm.s < 0 && P.count(np) > 1 ? '(' + n + ')' : n;
      else { var dp = tm.den.reduce(function (acc, d) { return P.mul(acc, typeof d === 'number' ? P.num(d) : lp(d[0], d[1], v)); }, P.num(1)), d = tm.o.asc ? txa(dp).replace(/\^\{(\d+)\}/g, '^$1').replace(new RegExp(v, 'g'), 'X') : plain(dp, v); body = (P.count(np) > 1 ? '(' + n + ')' : n) + '/' + (P.count(dp) > 1 || /X/.test(d) && /\d/.test(d) ? '(' + d + ')' : d); }
      return (i === 0 ? (tm.s < 0 ? '-' : '') : (tm.s < 0 ? '-' : '+')) + body;
    }).join('');
  };
  KT.window = function (vals, npvs) {
    var xs = vals.concat(npvs || []), lo = Math.min.apply(null, xs), hi = Math.max.apply(null, xs);
    var a = lo >= -9 ? -10 : Math.floor((lo - 5) / 5) * 5, b = hi <= 9 ? 10 : Math.ceil((hi + 5) / 5) * 5;
    return t(v0('x') + ':\\ [' + a + ',\\ ' + b + ']') + ', ' + t('y:\\ [-10,\\ 10]');
  };
  function v0(x) { return x; }
  /* the graphing-calculator solution of W */
  KT.calcSol = function (W) {
    var vals = W.info.irr ? W.info.irr.vals : W.valid.map(rv), v = W.v;
    var srt = vals.slice().sort(function (a, b) { return a - b; });
    return 'Window ' + KT.window(vals, W.npvList.map(rv)) + '. ' + t('Y_1=') + '<code>' + KT.calcSide(W.L, v) + '</code>, ' + t('Y_2=') + '<code>' + KT.calcSide(W.R, v) + '</code>; graph, then use <b>intersect</b> at each crossing:<br>' +
      srt.map(function (x) { return t(v + '\\approx ' + K.roundTo(x, 2).toFixed(2)); }).join(' or ') + (W.npvList.length ? ' (neither is ' + (W.npvList.length > 1 ? 'an NPV: ' : 'the NPV ') + t(W.npvList.map(rt).join(',\\ ')) + ')' : '') + '.<br>(Algebraically: ' + W.sol.replace(/^.*?NPVs:[^.]*\.\s*/, '') + ')';
  };
  KT.F = F; KT.sgnF = sgnF; KT.X = X; KT.pick = pick; KT.nz = nz; KT.lp = lp; KT.cpoly = cpoly; KT.tx = tx; KT.txa = txa; KT.R = R; KT.rv = rv; KT.rt = rt; KT.qa = qa; KT.qm = qm; KT.qd = qd;
  KT.has = has; KT.isInt = isInt; KT.coefT = coefT; KT.gcd = gcd; KT.lcm = lcm; KT.monoTx = monoTx; KT.mon = mon; KT.ynCheck = ynCheck; KT.uniqR = uniqR;

  /* ======================================================================================================
   * Lesson 7
   * ====================================================================================================== */
  var H_NPV = ['Factor every denominator, on <b>both</b> sides of the equation.', 'Set each factor with a variable equal to ' + t(0) + ' and solve.'];
  var H_MONO = ['State the NPV (' + t('x\\ne 0') + '). The LCD is the lowest common multiple of the denominators.', 'Multiply <b>every</b> term (whole numbers too) by the LCD, then solve the linear equation.'];
  var H_CROSS = ['State the NPVs. With one fraction on each side, cross-multiply: ' + t('\\frac{a}{b}=\\frac{c}{d}\\Rightarrow ad=bc') + ' (brackets around binomials).', 'Expand, collect like terms and solve. Check that the root is not an NPV.'];
  var H_BIN = ['Factor every denominator and state the NPVs. The LCD is the product of the different factors.', 'Multiply every term by the LCD, solve, and check that the root is not an NPV.'];
  var H_OPP = ['Opposite denominators: ' + t('a-x=-(x-a)') + ', so ' + t('\\frac{p}{a-x}=-\\frac{p}{x-a}') + '.', 'Now the LCD is one binomial: multiply every term by it and solve.'];
  var H_CANCEL = ['State the NPVs and multiply every term by the LCD (a product of binomials and/or ' + t('x') + ').', 'Expand both sides: the ' + t('x^{2}') + ' terms cancel and leave a linear equation.'];
  var H_NONE = ['State the NPVs, multiply every term by the LCD and solve.', 'Compare your root with the NPVs: a root that is an NPV is rejected. If nothing is left, write “no solution”.'];
  var SOLVE = 'State the NPVs, then solve. ';
  function vOf(r) { return r.pick(['x', 'x', 'x', 'a', 'm', 'n', 't', 'y']); }
  function okRoot(W, maxAbs, maxDen) { if (W.valid.length !== 1 || W.info.deg !== 1) return false; var x = R(W.valid[0]); return Math.abs(x[0] / x[1]) <= (maxAbs || 40) && x[1] <= (maxDen || 1); }

  /* ---------- Q1: NPVs of an equation ---------- */
  function q1(r, kind) {
    var v = 'x', s = pick(function () {
      var L, Rr;
      if (kind === 'a') { var p = r.int(2, 9), q = r.int(1, 9), a = nz(r, 1, 9); L = [F(1, p, [[1, -a]])]; Rr = [F(1, q, [X])]; if (r.chance(0.4)) { var tmp = L; L = Rr; Rr = tmp; } return { L: L, R: Rr, sig: [a] }; }
      if (kind === 'b') { var m = r.int(2, 5), n = nz(r, 1, 9), c = r.int(1, 6), b = nz(r, 1, 9); if (gcd(m, n) !== 1) return null; return { L: [F(1, [1, 0], [[m, n]]), F(r.chance(0.7) ? 1 : -1, c, [])], R: [F(1, 1, [[1, -b]])], sig: [m, n, b] }; }
      if (kind === 'c') { var a2 = r.int(2, 9), shared = r.chance(0.6), b2 = shared ? (r.chance(0.5) ? a2 : -a2) : nz(r, 1, 9), p2 = r.int(2, 9); if (!shared && Math.abs(b2) === a2) return null; return { L: [F(1, p2, [[1, -a2], [1, a2]])], R: [F(1, 1, [[1, b2]])], sig: [a2] }; }
      var r1 = nz(r, 1, 8), r2 = nz(r, 1, 8), q4 = r.int(2, 9), sh = r.chance(0.6), b4 = sh ? -r.pick([r1, r2]) : nz(r, 1, 8); if (r1 === r2 || r1 === -r2) return null; if (!sh && (b4 === -r1 || b4 === -r2)) return null;
      return { L: [F(1, q4, [[1, -r1], [1, -r2]]), F(r.chance(0.7) ? 1 : -1, 1, [[1, b4]])], R: [F(1, 0, [])], sig: [r1, r2] };
    }, function (z) { var W = KT.eq(v, z.L, z.R); return !(kind === 'a' && z.sig[0] === 8) && !(kind === 'c' && (z.sig[0] === 7 || z.sig[0] === 6)) && !(kind === 'd' && ((z.sig[0] === 5 && z.sig[1] === -2) || (z.sig[0] === -2 && z.sig[1] === 5))) && W.npvList.length >= 1; });
    var W = KT.eq(v, s.L, s.R), first = KT.eq(v, [s.L[0]], [F(1, 0, [])]);
    var nw = same(first.npvList, W.npvList) ? [] : [{ vals: first.npv, code: 'npv-one', hint: 'Every denominator in the equation gives NPVs — the right side too.' }];
    return KT.npvPart(CP, 'State the non-permissible values of ' + t(big(W.tex)) + '.', W, nw, H_NPV, 'NPVs of an equation');
  }

  /* ---------- Q2: verify ---------- */
  function q2(r, kind) {
    var v = 'x', want = r.chance(0.5), s = pick(function () {
      if (kind === 'a') { // p/(x − a) + 1/q = c/x at x0
        var x0 = r.int(2, 12), a = nz(r, 1, 6), p = r.int(1, 9), q = r.int(2, 5); if (x0 === a || x0 - a === 0) return null;
        var lsv = qa([p, x0 - a], [1, q]), c = qm(lsv, x0); if (!isInt(c)) return null; var cc = c[0] + (want ? 0 : r.pick([-2, -1, 1, 2])); if (cc === 0) return null;
        return { L: [F(1, p, [[1, -a]]), F(1, 1, [q])], R: [sgnF(cc, cc, [X])], x0: x0, sig: [x0, a, p, q] };
      }
      // (x + a)/(x − b) = m x/(x + a) at x0
      var a2 = nz(r, 1, 6), b2 = nz(r, 1, 6), m = r.int(2, 4), x1 = nz(r, 1, 9); if (x1 === b2 || x1 === -a2 || x1 === 0) return null;
      var yes = (x1 + a2) * (x1 + a2) === m * x1 * (x1 - b2); if (yes !== want) return null;
      return { L: [F(1, [1, a2], [[1, -b2]])], R: [F(1, [m, 0], [[1, a2]])], x0: x1, sig: [a2, b2, m, x1] };
    }, function (z) { var j = JSON.stringify(z.sig); return j !== '[6,2,4,2]' && j !== '[3,1,2,3]' && j !== '[3,-3,4,1]'; });
    var W = KT.eq(v, s.L, s.R), a = W.sideV(W.L, s.x0), b = W.sideV(W.R, s.x0), truth = rv(a.v) === rv(b.v);
    var sol = t(v + '=' + s.x0) + ' is permissible (' + t(KT.npvTex(W.npv)) + ').<br>LS ' + t('=' + a.t) + ', RS ' + t('=' + b.t) + '.<br>' + (truth ? 'LS = RS, so ' + t(v + '=' + s.x0) + ' is a solution.' : 'LS ≠ RS, so ' + t(v + '=' + s.x0) + ' is not a solution.');
    return KT.verifyPart(CP, W, s.x0, sol, ['Substitute into the left side and the right side <b>separately</b>; work each one out exactly (fractions).', 'If LS = RS (and the value is not an NPV), it is a solution.'], 'verify a solution');
  }

  /* ---------- Q3: monomial denominators ---------- */
  function q3(r, kind, ep) {
    var v = kind === 'd' ? r.pick(['a', 'm', 't', 'n']) : 'x', s = pick(function () {
      if (kind === 'a') { var p = r.int(2, 12), c = nz(r, 1, 4), x0 = nz(r, 1, 9), q = p + c * x0; if (q === 0 || q === p) return null; return { L: [F(1, p, [X]), sgnF(c, c, [])], R: [sgnF(q, q, [X])], sig: [p, c, q] }; }
      if (kind === 'b') { var m = r.int(2, 4), n = r.int(2, 6), p2 = r.int(1, 9), q2 = r.int(1, 9); if (gcd(p2, m) !== 1 || n === m) return null; var sw = r.chance(0.3); return { L: [F(1, p2, [m, X]), F(sw ? -1 : 1, 1, [n])], R: [F(1, q2, [X])], sig: [p2, m, n, q2] }; }
      if (kind === 'c') { var m3 = r.pick([2, 3, 4, 5]), n3 = r.pick([2, 3, 4, 6, 8, 10]), a3 = nz(r, 1, 9), q3v = r.int(1, 7), sg3 = r.chance(0.75) ? 1 : -1; if (n3 === m3 || n3 % m3 !== 0 && m3 % n3 !== 0 && r.chance(0.5)) return null; return { L: [F(1, [1, a3], [m3, X])], R: [F(1, 1, [n3]), F(sg3, q3v, [X])], sig: [m3, n3, a3, q3v] }; }
      var p4 = r.int(2, 9), c4 = r.int(1, 3), b4 = nz(r, 1, 7), m4 = r.pick([2, 3, 4, 6]), n4 = r.pick([2, 3, 4]); if (gcd(gcd(c4, Math.abs(b4)), m4) > 1 || (c4 % m4 === 0)) return null;
      return { L: [F(1, p4, [X]), F(-1, [c4, b4], [m4, X])], R: [F(1, 1, [n4])], sig: [p4, c4, b4, m4, n4] };
    }, function (z) {
      var j = JSON.stringify(z.sig);
      if (['[6,-1,2]', '[8,-3,2]', '[3,2,4,5]', '[1,3,2,5]', '[3,6,-3,2]', '[2,4,-4,3]', '[5,2,1,4,2]', '[2,1,3,7]'].indexOf(j) >= 0) return false;
      var W = KT.eq(v, z.L, z.R); if (!okRoot(W, 40, kind === 'd' || kind === 'b' || kind === 'c' ? 6 : 1)) return false;
      if (R(W.valid[0])[1] > 1 && r.chance(kind === 'd' ? 0.3 : 0.7)) return false;
      return R(W.valid[0])[0] !== 0;
    });
    var W = KT.eq(v, s.L, s.R);
    return KT.solvePart(CP, SOLVE + t(W.tex), W, H_MONO.map(function (h) { return h.replace(/x\\ne 0/, v + '\\ne 0'); }), 'monomial denominators');
  }

  /* ---------- Q4: one fraction on each side ---------- */
  function q4(r, kind) {
    var v = kind === 'c' ? r.pick(['m', 'm', 'x', 'a']) : kind === 'd' ? r.pick(['y', 'y', 'x', 'n']) : 'x', s = pick(function () {
      if (kind === 'a') { var p = r.int(1, 9), q = r.int(1, 9), a = nz(r, 1, 9); if (p === q) return null; var L = [F(1, p, [[1, a]])], Rr = [F(1, q, [X])]; if (r.chance(0.4)) { var tmp = L; L = Rr; Rr = tmp; } return { L: L, R: Rr, sig: [p, a, q] }; }
      if (kind === 'b') { var m = r.int(1, 4), n = nz(r, 1, 7), a2 = nz(r, 1, 7), pp = nz(r, 1, 7), qq = r.int(2, 6); if (gcd(pp, qq) > 1) return null; return { L: [F(1, [m, n], [[1, a2]])], R: [sgnF(pp, pp, [qq])], sig: [m, n, a2, pp, qq] }; }
      if (kind === 'c') { var a3 = r.int(1, 4), b3 = nz(r, 1, 6), c3 = nz(r, 1, 5), d3 = nz(r, 1, 6), e3 = nz(r, 1, 6); if (e3 % 2 === 0) return null; return { L: [F(1, [a3, b3], [[1, c3]])], R: [F(1, [2 * a3, d3], [[2, e3]])], sig: [a3, b3, c3, d3, e3] }; }
      var k = r.int(1, 9), c4 = r.int(1, 9), dd = r.int(1, 4), e = nz(r, 1, 6); if (gcd(c4, dd) > 1) return null; return { L: [sgnF(k, k, [[-dd, c4]], { asc: true })], R: [sgnF(e, e, [])], sig: [k, c4, dd, e] };
    }, function (z) {
      var j = JSON.stringify(z.sig);
      if (['[3,4,5]', '[4,1,3]', '[2,-1,3,3,4]', '[3,2,-1,-1,3]', '[4,5,2,-3]', '[5,3,1,2]', '[6,-2,4]'].indexOf(j) >= 0) return false;
      var W = KT.eq(v, z.L, z.R, { cross: true }); if (!okRoot(W, 40, kind === 'a' ? 1 : 8)) return false;
      if (kind !== 'a' && R(W.valid[0])[1] > 1 && r.chance(0.5)) return false;
      if (kind === 'c' && P.degreeIn(W.SL, v) !== 2) return false;
      return R(W.valid[0])[0] !== 0 || r.chance(0.2);
    });
    var W = KT.eq(v, s.L, s.R, { cross: true }), wrongs = [];
    if (kind === 'd') { // k = e(c − d y) written as k = ec − d y
      var k = s.sig[0], c4 = s.sig[1], dd = s.sig[2], e = s.sig[3], y1 = ex.norm(e * c4 - k, dd);
      if (!has(W.valid, y1)) wrongs.push({ vals: [y1], code: CP + 'distrib', hint: 'Distribute the ' + t(e) + ' to <b>both</b> terms in the bracket: ' + t(e + '(' + c4 + '-' + coefT(dd) + v + ')') + '.' });
    }
    return KT.solvePart(CP, SOLVE + t(W.tex), W, H_CROSS, kind === 'c' ? 'cross-multiply: the squares cancel' : 'cross-multiply', { wrongs: wrongs });
  }

  /* ---------- Q5: binomial and trinomial denominators (verify) ---------- */
  function q5(r, kind) {
    var v = 'x', s = pick(function () {
      if (kind === 'a') { var a = r.int(1, 8), p = r.int(1, 6), q = r.int(1, 6), x0 = r.int(-6, 9), sg = r.chance(0.3) ? -1 : 1; if (Math.abs(x0) === a || p === q && sg < 0) return null; var S = p * (x0 - a) + sg * q * (x0 + a); if (S === 0 || Math.abs(S) > 80) return null; return { L: [F(1, p, [[1, a]]), F(sg, q, [[1, -a]])], R: [sgnF(S, S, [[1, -a], [1, a]])], sig: [a, p, q, sg] }; }
      if (kind === 'b') { var b = nz(r, 1, 6), c = nz(r, 1, 6), p2 = r.int(1, 7), q2 = r.int(1, 7), x1 = r.int(-6, 9); if (b === -c || p2 === q2 || x1 === b || x1 === -c) return null; var S2 = p2 * (x1 + c) - q2 * (x1 - b); if (S2 === 0 || Math.abs(S2) > 80) return null; return { L: [F(1, p2, [[1, -b]]), F(-1, q2, [[1, c]])], R: [sgnF(S2, S2, [[1, -b], [1, c]])], sig: [b, c, p2, q2] }; }
      var a3 = nz(r, 1, 7), p3 = r.int(2, 7), q3 = r.int(1, 5), S3 = r.int(1, 9); if (p3 === q3) return null; return { L: [F(1, S3, [X, [1, a3]])], R: [F(1, p3, [[1, a3]]), F(-1, q3, [X])], sig: [a3, p3, q3, S3] };
    }, function (z) {
      var j = JSON.stringify(z.sig); if (['[5,1,3,1]', '[2,3,1,1]', '[2,1,4,3]', '[1,3,2,1]', '[3,5,1,2]'].indexOf(j) >= 0) return false;
      var W = KT.eq(v, z.L, z.R); return okRoot(W, 30, kind === 'c' ? 6 : 1) && (kind !== 'c' || R(W.valid[0])[0] !== 0);
    });
    var W = KT.eq(v, s.L, s.R, { verify: true });
    return KT.solvePart(CP, 'State the NPVs, solve and verify. ' + t(W.tex), W, H_BIN, kind === 'c' ? 'a binomial and a monomial denominator' : 'binomial and trinomial denominators');
  }

  /* ---------- Q6: opposite denominators ---------- */
  function q6(r, kind) {
    var v = 'x', s = pick(function () {
      if (kind === 'a') { var a = r.int(2, 9), p = r.int(1, 9), c = r.int(2, 6), sg = r.chance(0.7) ? 1 : -1; return { L: [F(1, [1, 0], [[1, -a]]), F(sg, p, [[-1, a]], { asc: true })], R: [F(1, c, [])], sig: [a, p, c, sg] }; }
      var p2 = r.int(1, 9), q2 = r.int(1, 9), m = r.int(1, 4), n = r.int(1, 7), c2 = nz(r, 1, 5); if (gcd(m, n) > 1 || p2 === q2) return null;
      return { L: [F(1, p2, [[m, -n]])], R: [F(1, q2, [[-m, n]], { asc: true }), sgnF(c2, c2, [])], sig: [p2, q2, m, n, c2] };
    }, function (z) {
      var j = JSON.stringify(z.sig); if (['[6,2,5,1]', '[3,5,2,1,4]'].indexOf(j) >= 0) return false;
      var W = KT.eq(v, z.L, z.R); return okRoot(W, 40, kind === 'b' ? 8 : 1) && W.wr.some(function (w) { return w.code === 'opp'; }) && (kind === 'a' || R(W.valid[0])[1] === 1 || r.chance(0.5));
    });
    var W = KT.eq(v, s.L, s.R);
    return KT.solvePart(CP, 'Solve. (Watch for denominators that are opposites.) ' + t(W.tex), W, H_OPP, 'opposite denominators');
  }

  /* ---------- Q7: the x² terms cancel ---------- */
  function q7(r, kind) {
    var v = 'x', s = pick(function () {
      if (kind === 'a') { var a = nz(r, 1, 9), p = r.int(1, 9), sg = r.chance(0.7) ? 1 : -1; return { L: [F(1, [1, 0], [[1, a]]), F(sg, p, [X])], R: [F(1, 1, [])], sig: [a, p, sg] }; }
      var a2 = nz(r, 1, 6), b2 = nz(r, 1, 6), c = nz(r, 1, 12); if (a2 === -b2) return null; var k = r.pick([1, 2, 2, 3]);
      // (k+1)x/(x + a) − k x/(x − b) = (x² + c)/((x + a)(x − b))
      return { L: [F(1, [k + 1, 0], [[1, a2]]), F(-1, [k, 0], [[1, -b2]])], R: [F(1, [1, 0, c], [[1, a2], [1, -b2]])], sig: [a2, b2, c, k] };
    }, function (z) {
      var j = JSON.stringify(z.sig); if (['[4,2,1]', '[1,2,4,1]', '[2,3,1]'].indexOf(j) >= 0) return false;
      var W = KT.eq(v, z.L, z.R); return okRoot(W, 30, kind === 'b' ? 9 : 1) && R(W.valid[0])[0] !== 0 && (P.degreeIn(W.SL, v) === 2 || P.degreeIn(W.SR, v) === 2);
    });
    var W = KT.eq(v, s.L, s.R);
    return KT.solvePart(CP, 'Solve. The ' + t('x^{2}') + ' terms cancel. ' + t(W.tex), W, H_CANCEL, 'the squares cancel');
  }

  /* ---------- Q8: no solution ---------- */
  function q8(r, kind) {
    var v = 'x', s = pick(function () {
      if (kind === 'a') { var p = nz(r, 1, 7), a = nz(r, 1, 7); if (p === -a || p === a) return null; return { L: [F(1, [1, p], [X]), F(-1, [1, 0], [[1, -a]])], R: [sgnF(p, p, [X])], sig: [p, a] }; }
      var k = r.pick([1, 2, 3]), a2 = r.int(1, 5), sgn = r.chance(0.5) ? 1 : -1, c = sgn * (2 * k + 1) * a2 * a2;
      return { L: [F(1, [k + 1, 0], [[1, a2]]), F(-1, [k, 0], [[1, -a2]])], R: [F(1, [1, 0, c], [[1, -a2], [1, a2]])], sig: [k, a2, c] };
    }, function (z) { var j = JSON.stringify(z.sig); if (j === '[1,2]' || j === '[2,1,5]') return false; var W = KT.eq(v, z.L, z.R); return W.valid.length === 0 && W.extr.length === 1 && W.info.deg === 1; });
    var W = KT.eq(v, s.L, s.R);
    return KT.solvePart(CP, 'Solve, or show that the equation has no solution. ' + t(W.tex), W, H_NONE, 'no solution: the root is an NPV');
  }

  /* ---------- Q9 / EP B4: graphing calculator ---------- */
  function calcQ(r, kind) {
    var v = 'x', s = pick(function () {
      if (kind === 'a') { var p = nz(r, 1, 9), a = nz(r, 1, 6), b = nz(r, 1, 6); return { L: [sgnF(p, p, [[1, -a]])], R: [F(1, [1, b], [])], sig: [p, a, b] }; }
      if (kind === 'b') { var a2 = nz(r, 1, 5), p2 = r.int(1, 9); return { L: [F(1, [1, 0], [[1, a2]])], R: [F(1, p2, [X]), F(-1, 1, [])], sig: [a2, p2] }; }
      var p3 = r.int(1, 9), a3 = nz(r, 1, 6), q3 = r.pick([2, 3, 4]), c3 = nz(r, 1, 4); return { L: [F(1, p3, [[1, a3]])], R: [F(1, [1, 0], [q3]), sgnF(c3, c3, [])], sig: [p3, a3, q3, c3] };
    }, function (z) {
      var j = JSON.stringify(z.sig); if (['[3,2,1]', '[1,4]', '[2,3,2,-1]', '[5,-1,3]', '[3,1,2]'].indexOf(j) >= 0) return false;
      var W = KT.eq(v, z.L, z.R); if (!W.info.irr) return false; var xs = W.info.irr.vals; return xs.every(function (x) { return Math.abs(x) < 12 && W.npvList.every(function (n) { return Math.abs(x - rv(n)) > 0.15; }); });
    });
    var W = KT.eq(v, s.L, s.R);
    return KT.approxPart(CP, 'Use a graphing calculator to solve, to the nearest hundredth. ' + t(W.tex), W.info.irr.vals, 2, v, KT.calcSol(W), ['Graph ' + t('Y_1=') + ' the left side and ' + t('Y_2=') + ' the right side (brackets around every numerator and denominator).', 'Use <b>intersect</b> at each crossing — there are two. Widen the window if you see only one.'], 'graphing calculator: intersect');
  }

  /* ---------- Q10: Kai's error ---------- */
  function kaiShared(r) {
    return pick(function () { return { p: r.int(2, 12), c: r.int(2, 5), x0: nz(r, 1, 6) }; }, function (z) { var q = z.p + z.c * z.x0; return q > 0 && q !== z.p && z.p + z.c !== q && !(z.p === 5 && z.c === 2 && z.x0 === 2) && !(z.p === 6 && z.c === 1); });
  }
  function kaiEq(s) { var q = s.p + s.c * s.x0; return KT.eq('x', [F(1, s.p, [X]), F(1, s.c, [])], [F(1, q, [X])]); }

  /* ---------- Q11: k from a given root ---------- */
  function q11(r) {
    var s = pick(function () { return { a: nz(r, 1, 5), p: r.int(1, 9), c: r.int(1, 6), x0: nz(r, 1, 6), sk: r.chance(0.5) }; }, function (z) {
      if (z.x0 === z.a || z.x0 === 0) return false; var k = qm(qa(z.c, qm(-z.p, [1, z.x0])), z.x0 - z.a); return isInt(k) && k[0] !== 0 && Math.abs(k[0]) <= 40 && k[0] !== z.x0 && !(z.a === 1 && z.p === 2 && z.c === 3 && z.x0 === 2);
    });
    var k = qm(qa(s.c, qm(-s.p, [1, s.x0])), s.x0 - s.a)[0], v = 'x';
    var eqT = '\\frac{k}{' + tx(lp(1, -s.a, v)) + '}+\\frac{' + s.p + '}{x}=' + s.c;
    var pv = qd(s.p, s.x0), sol = 'Substitute ' + t('x=' + s.x0) + ': ' + t('\\frac{k}{' + (s.x0 - s.a) + '}+' + (isInt(pv) ? rt(pv) : '\\frac{' + s.p + '}{' + s.x0 + '}') + '=' + s.c) + ', so ' + t('\\frac{k}{' + (s.x0 - s.a) + '}=' + rt(qa(s.c, qm(pv, -1)))) + ' and ' + t('k=' + k) + '.';
    var p = KP.math(big('The equation ' + t(eqT) + ' has the solution ' + t('x=' + s.x0) + '. Determine the value of ' + t('k') + '.'),
      K.value(k, { diag: function (x) { if (x === s.x0) return { code: CP + 'gave-given', hint: 'That is the given root. Substitute it for ' + t('x') + ' and solve for ' + t('k') + '.' }; return null; } }),
      String(k), sol, ['A solution makes the equation true: substitute ' + t('x=' + s.x0) + '.', 'Then solve the equation in ' + t('k') + '.'], 'working backwards: k', { keys: 'u6num', before: 'k=' });
    p.bad = [String(s.x0), String(-k)].filter(function (b) { return b !== String(k); });
    return p;
  }

  /* ---------- Q12 / EP B5: ratio problems ---------- */
  var RCTX = [
    { a: 'Adult', b: 'Student', txt: function (d, m, n) { return 'At a school concert, ' + t(d) + ' more student tickets than adult tickets were sold. The ratio of adult tickets to student tickets was ' + t(m + ':' + n) + '.'; }, unit: 'tickets' },
    { a: 'Non-fiction', b: 'Fiction', txt: function (d, m, n) { return 'A classroom library has ' + t(d) + ' more fiction books than non-fiction books. The ratio of non-fiction to fiction books is ' + t(m + ':' + n) + '.'; }, unit: 'books' },
    { a: 'Red', b: 'Silver', txt: function (d, m, n) { return 'A parking lot has ' + t(d) + ' more silver cars than red cars. The ratio of red cars to silver cars is ' + t(m + ':' + n) + '.'; }, unit: 'cars' },
    { a: 'Pumpkin', b: 'Sunflower', txt: function (d, m, n) { return 'A bag of seed mix has ' + t(d) + ' more sunflower seeds than pumpkin seeds. The ratio of pumpkin seeds to sunflower seeds is ' + t(m + ':' + n) + '.'; }, unit: 'seeds' }
  ];
  function q12(r) {
    var c = r.pick(RCTX), s = pick(function () { var n = r.int(3, 11), m = r.int(1, n - 1), k = r.int(3, 20); return { m: m, n: n, d: k * (n - m), a: k * m }; }, function (z) { return gcd(z.m, z.n) === 1 && z.d <= 150 && z.a <= 200 && !(z.m === 2 && z.n === 7 && z.d === 85) && !(z.m === 4 && z.n === 5 && z.d === 7); });
    var b = s.a + s.d, L = c.a.toLowerCase(), letter = L.charAt(0);
    var sol = 'Let ' + t(letter) + ' be the number of ' + L + ' ' + c.unit + '; there are ' + t(letter + '+' + s.d) + ' ' + c.b.toLowerCase() + ' ' + c.unit + '.<br>' + t('\\frac{' + letter + '}{' + letter + '+' + s.d + '}=\\frac{' + s.m + '}{' + s.n + '}') + ' (' + t(letter + '\\ne -' + s.d) + '). Cross-multiply: ' + t(s.n + letter + '=' + s.m + '(' + letter + '+' + s.d + ')') + ', ' + t(s.n + letter + '=' + (s.m === 1 ? '' : s.m) + letter + '+' + s.m * s.d) + ', ' + (s.n - s.m === 1 ? t(letter + '=' + s.a) : t((s.n - s.m) + letter + '=' + s.m * s.d) + ', ' + t(letter + '=' + s.a)) + '.<br>' + t(s.a) + ' ' + L + ' and ' + t(b) + ' ' + c.b.toLowerCase() + ' ' + c.unit + '. (Check: ' + t('\\frac{' + s.a + '}{' + b + '}=\\frac{' + s.m + '}{' + s.n + '}') + ' ✓)';
    return KT.numPart(c.txt(s.d, s.m, s.n) + ' Write and solve a rational equation to find how many of each there are.', [{ label: c.a + ':', val: s.a, cands: [[s.d, CP + 'ratio-diff', 'That is the difference. Let ' + t(letter) + ' be the smaller amount: the other is ' + t(letter + '+' + s.d) + '.']] }, { label: c.b + ':', val: b }],
      sol, ['Let ' + t(letter) + ' be the smaller amount; the other is ' + t(letter + '+' + s.d) + '. Write ' + t('\\frac{' + letter + '}{' + letter + '+' + s.d + '}=\\frac{' + s.m + '}{' + s.n + '}') + '.', 'Cross-multiply and solve.'], 'a ratio problem', { swap: CP + 'ratio-swap' });
  }

  /* ---------- Q13: MC p/(a − y) = c ---------- */
  function q13(r) {
    var s = pick(function () { return { p: r.int(1, 9), a: r.int(1, 6), c: r.int(2, 6) }; }, function (z) {
      var ok1 = z.c * z.a !== z.p && gcd(z.p, z.c) === 1 && !(z.p === 3 && z.a === 2 && z.c === 4) && !(z.p === 5 && z.a === 3 && z.c === 2);
      var vals = [ex.norm(z.c * z.a - z.p, z.c), ex.norm(z.c * z.a + z.p, z.c), ex.norm(z.p - z.c * z.a, z.c), [z.c * z.a - z.p, 1]];
      return ok1 && uniqR(vals).length === 4;
    });
    var y = ex.norm(s.c * s.a - s.p, s.c);
    var opts = [{ html: t(rt(y)), right: true }, { html: t(rt(ex.norm(s.p - s.c * s.a, s.c))), why: 'Check the sign: ' + t(s.c + 'y') + ' moves to the other side.', code: 'sign' },
      { html: t(rt(ex.norm(s.c * s.a + s.p, s.c))), why: 'Check the signs when you collect terms: ' + t(s.p + '=' + s.c * s.a + '-' + s.c + 'y') + '.', code: 'collect' },
      { html: t(String(s.c * s.a - s.p)), why: 'Distribute the ' + t(s.c) + ' to both terms: ' + t(s.c + '(' + s.a + '-y)=' + s.c * s.a + '-' + s.c + 'y') + '.', code: 'distrib' }];
    return KT.mc(r, 'If ' + t('\\frac{' + s.p + '}{' + s.a + '-y}=' + s.c) + ', then ' + t('y') + ' equals', opts,
      'NPV ' + t('y\\ne ' + s.a) + '. ' + t(s.p + '=' + s.c + '(' + s.a + '-y)=' + s.c * s.a + '-' + s.c + 'y') + ', so ' + t(s.c + 'y=' + (s.c * s.a - s.p)) + ' and ' + t('y=' + rt(y)) + '.', ['Write the right side over 1 and cross-multiply.', 'Distribute, then collect the ' + t('y') + '-term.'], 'MC: cross-multiply');
  }

  /* ---------- Q14: MC NPVs ---------- */
  function q14(r) {
    var s = pick(function () { return { a: nz(r, 1, 9), b: nz(r, 1, 9) }; }, function (z) { return z.a !== -z.b && z.a !== z.b && Math.abs(z.a) !== Math.abs(z.b) && !(z.a === 4 && z.b === 1) && z.b !== 0; });
    var lst = function (arr) { return t(arr.join(',\\ ')); };
    var opts = [{ html: lst([0, s.a, -s.b]), right: true }, { html: lst([0, s.a]), why: 'The right side’s denominator gives an NPV too.', code: 'one' },
      { html: lst([s.a, -s.b]), why: t('x^{2}' + (s.a < 0 ? '+' : '-') + Math.abs(s.a) + 'x=x(x' + (s.a < 0 ? '+' : '-') + Math.abs(s.a) + ')') + ': the factor ' + t('x') + ' gives ' + t('x\\ne 0') + '.', code: 'zero' },
      { html: lst([0, -s.a, s.b]), why: 'Check the signs: ' + t('x-3=0') + ' gives ' + t('x=3') + '.', code: 'sign' }];
    var d1 = tx(P.add(P.mono(1, { x: 2 }), P.mono(-s.a, { x: 1 }))), d2 = tx(lp(1, s.b, 'x'));
    return KT.mc(r, 'The non-permissible values of ' + t('\\frac{2}{' + d1 + '}=\\frac{1}{' + d2 + '}') + ' are', opts,
      t(d1 + '=x(' + tx(lp(1, -s.a, 'x')) + ')') + ' gives ' + t('x\\ne 0,\\ ' + s.a) + '; ' + t(d2) + ' gives ' + t('x\\ne ' + (-s.b)) + '. NPVs: ' + lst([0, s.a, -s.b]) + '.', H_NPV, 'MC: NPVs of an equation');
  }

  /* ---------- Q15: MC multiplying by the LCD ---------- */
  function q15(r) {
    var s = pick(function () { var m = r.int(2, 4), j = r.int(2, 3); return { p: r.int(2, 9), m: m, L: m * j, j: j, q: r.int(1, 9) }; }, function (z) { return !(z.p === 3 && z.m === 2 && z.L === 4 && z.q === 5) && gcd(z.q, z.L) === 1 && z.p * z.L !== z.q; });
    var lhs = s.p * s.L, eqT = '\\frac{' + s.p + '}{x}-\\frac{1}{' + s.m + '}=\\frac{' + s.q + '}{' + s.L + 'x}';
    var opts = [{ html: t(lhs + '-' + s.j + 'x=' + s.q), right: true }, { html: t(s.p + '-1=' + s.q), why: 'Multiplying by the LCD does not just remove the denominators: ' + t(s.L + 'x\\cdot\\frac{1}{' + s.m + '}=' + s.j + 'x') + '.', code: 'drop' },
      { html: t(lhs + '-x=' + s.q), why: t(s.L + 'x\\cdot\\frac{1}{' + s.m + '}=\\frac{' + s.L + 'x}{' + s.m + '}=' + s.j + 'x') + '.', code: 'mid' },
      { html: t(lhs + 'x-' + s.j + 'x=' + s.q + 'x'), why: 'Divide out the ' + t('x') + ': ' + t(s.L + 'x\\cdot\\frac{' + s.p + '}{x}=' + lhs) + ', with no ' + t('x') + ' left.', code: 'keepx' }];
    return KT.mc(r, 'Multiplying every term of ' + t(eqT) + ' by the LCD gives', opts,
      'The LCD is ' + t(s.L + 'x') + ': ' + t(s.L + 'x\\cdot\\frac{' + s.p + '}{x}=' + lhs) + ', ' + t(s.L + 'x\\cdot\\frac{1}{' + s.m + '}=' + s.j + 'x') + ', ' + t(s.L + 'x\\cdot\\frac{' + s.q + '}{' + s.L + 'x}=' + s.q) + '.', ['The LCD is the LCM of ' + t('x') + ', ' + t(s.m) + ' and ' + t(s.L + 'x') + '.', 'Multiply each term by it and divide out.'], 'MC: multiply by the LCD');
  }

  /* ---------- Q16 / Q17 / EP B7: numerical response ---------- */
  function nrPart(prompt, W, dp, hints, text) {
    var x = rv(W.valid[0]);
    var p = KP.approx(big(prompt), x, dp, { nr: true }, W.sol, hints, text);
    return p;
  }
  function q16(r) {
    var s = pick(function () { return { p: r.int(1, 9), c: r.int(2, 5), a: r.int(1, 8) }; }, function (z) {
      if (z.c * z.a - z.p <= 0 || (z.p === 4 && z.c === 3 && z.a === 5)) return false; var x = z.p * z.a / (z.c * z.a - z.p); return x < 9.995 && x > 0.05 && Math.abs(x - Math.round(x)) > 0.004;
    });
    var W = KT.eq('x', [F(1, s.p, [X]), F(1, [s.c, 0], [[1, s.a]])], [F(1, s.c, [])]);
    return nrPart('The solution of ' + t(W.tex) + ', to the nearest hundredth, is ____.', W, 2, H_CANCEL, 'NR: the squares cancel');
  }
  function q17(r) {
    var s = pick(function () { return { a: r.int(1, 6), p: r.int(1, 6), q: r.int(1, 6), S: r.int(1, 40) }; }, function (z) {
      var x = (z.S - z.p * z.a + z.q * z.a) / (z.p + z.q); return x > 0 && x < 99.95 && Math.abs(x - z.a) > 1e-9 && !(z.a === 1 && z.p === 2 && z.q === 3 && z.S === 12) && Math.abs(x - Math.round(x)) > 1e-9;
    });
    var W = KT.eq('x', [F(1, s.p, [[1, -s.a]]), F(1, s.q, [[1, s.a]])], [F(1, s.S, [[1, -s.a], [1, s.a]])]);
    if (!W.valid.length) return q17(r);
    return nrPart('The solution of ' + t(W.tex) + ', to the nearest tenth, is ____.', W, 1, H_BIN, 'NR: binomial denominators');
  }

  /* ---------- extra practice ---------- */
  function epB1(r) { // c x/(x + a) + d = −ac/(x + a): no solution
    var s = pick(function () { return { c: r.int(1, 5), a: nz(r, 1, 7), d: r.int(1, 5) }; }, function (z) { return !(z.c === 2 && z.a === 4 && z.d === 3); });
    var e = -s.a * s.c, W = KT.eq('x', [F(1, [s.c, 0], [[1, s.a]]), F(1, s.d, [])], [sgnF(e, e, [[1, s.a]])]);
    return KT.solvePart(CP, 'Show that the equation has no solution (or solve it). ' + t(W.tex), W, H_NONE, 'no solution');
  }
  function epB2(r) { // p/(x − a) = c + (x + b)/(a − x)
    var v = 'x';
    var s2 = pick(function () { return { p: r.int(1, 12), a: r.int(1, 8), c: r.int(2, 4), b: nz(r, 1, 6) }; }, function (z) { var W = KT.eq(v, [F(1, z.p, [[1, -z.a]])], [F(1, z.c, []), F(1, [1, z.b], [[-1, z.a]], { asc: true })]); return z.b !== -z.a && okRoot(W, 40, 3) && !(z.p === 9 && z.a === 5 && z.c === 2 && z.b === -1); });
    var W = KT.eq(v, [F(1, s2.p, [[1, -s2.a]])], [F(1, s2.c, []), F(1, [1, s2.b], [[-1, s2.a]], { asc: true })], { verify: true });
    return KT.solvePart(CP, 'Solve. ' + t(W.tex), W, H_OPP, 'opposite denominators and a whole number');
  }
  function epB3(r) { // x/(x − a) − p/(x + b) = 1
    var s = pick(function () { return { a: nz(r, 1, 6), b: nz(r, 1, 6), p: r.int(1, 9), sg: r.chance(0.75) ? -1 : 1 }; }, function (z) {
      if (z.a === -z.b || (z.a === 1 && z.b === 2 && z.p === 3)) return false; var W = KT.eq('x', [F(1, [1, 0], [[1, -z.a]]), F(z.sg, z.p, [[1, z.b]])], [F(1, 1, [])]); return okRoot(W, 30, 4);
    });
    var W = KT.eq('x', [F(1, [1, 0], [[1, -s.a]]), F(s.sg, s.p, [[1, s.b]])], [F(1, 1, [])]);
    return KT.solvePart(CP, 'Solve. ' + t(W.tex), W, H_CANCEL, 'the squares cancel');
  }
  function epB5(r) { // juice : soda = n : m, juice is d more
    var CT = r.pick([{ a: 'Juice', b: 'Soda', txt: 'A punch recipe uses juice and soda in the ratio ', more: ' L more juice than soda' }, { a: 'White', b: 'Blue', txt: 'A paint mix uses white and blue paint in the ratio ', more: ' L more white paint than blue paint' }, { a: 'Water', b: 'Concentrate', txt: 'A cleaning solution uses water and concentrate in the ratio ', more: ' L more water than concentrate' }]);
    var s = pick(function () { var n = r.int(3, 9), m = r.int(1, n - 1), u = r.int(2, 15); return { n: n, m: m, u: u }; }, function (z) { return gcd(z.n, z.m) === 1 && !(z.n === 5 && z.m === 3 && z.u === 12) && (z.n - z.m) * z.u % 10 !== 0; });
    var soda = s.m * s.u / 10, juice = s.n * s.u / 10, d = (s.n - s.m) * s.u / 10, f1 = function (x) { return x.toFixed(1); };
    var sol = 'Let ' + t('s') + ' be the litres of ' + CT.b.toLowerCase() + '; ' + CT.a.toLowerCase() + ' ' + t('=s+' + f1(d)) + '.<br>' + t('\\frac{s+' + f1(d) + '}{s}=\\frac{' + s.n + '}{' + s.m + '}') + ' (' + t('s\\ne 0') + '): ' + t((s.m === 1 ? '' : s.m) + 's+' + f1(s.m * d) + '=' + s.n + 's') + ', ' + t('s=' + f1(soda)) + '.<br>' + t(f1(soda)) + ' L of ' + CT.b.toLowerCase() + ' and ' + t(f1(juice)) + ' L of ' + CT.a.toLowerCase() + '.';
    return KT.numPart(CT.txt + t(s.n + ':' + s.m) + '. One batch contains ' + t(f1(d)) + CT.more + '. Write and solve a rational equation to find the amount of each.', [{ label: CT.a + ':', val: [s.n * s.u, 10], key: f1(juice), after: 'L' }, { label: CT.b + ':', val: [s.m * s.u, 10], key: f1(soda), after: 'L', cands: [[[(s.n - s.m) * s.u, 10], CP + 'ratio-diff', 'That is the difference. Let ' + t('s') + ' be the smaller amount; the larger is ' + t('s+' + f1(d)) + '.']] }],
      sol, ['Let ' + t('s') + ' be the smaller amount; the other is ' + t('s+' + f1(d)) + '.', 'Write the ratio of the two amounts as a fraction equal to ' + t('\\frac{' + s.n + '}{' + s.m + '}') + ' and cross-multiply.'], 'a ratio problem with decimals', { swap: CP + 'ratio-swap' });
  }
  function epB6(r) { // x/(x + a) = p/(x + a) + 1 → no solution
    var s = pick(function () { return { a: nz(r, 1, 7), p: r.int(1, 9) }; }, function (z) { return z.p !== -z.a && !(z.a === 2 && z.p === 3) && z.p + 1 !== -z.a; });
    var W = KT.eq('x', [F(1, [1, 0], [[1, s.a]])], [F(1, s.p, [[1, s.a]]), F(1, 1, [])]), other = s.p + 1;
    var opts = [{ html: 'no solution', right: true }, { html: t('x=' + s.p), why: 'Setting the numerators equal ignores the ' + t('+1') + '. Multiply every term by ' + t(tx(lp(1, s.a, 'x'))) + '.', code: 'num' },
      { html: t('x=' + (-s.a)), why: t('x=' + (-s.a)) + ' is the NPV: it makes the denominators ' + t(0) + '.', code: 'npv' }, { html: t('x=' + other), why: 'Multiply the ' + t(1) + ' by the LCD too: ' + t('x=' + s.p + '+(' + tx(lp(1, s.a, 'x')) + ')') + '.', code: 'other' }];
    return KT.mc(r, 'The solution of ' + t(W.tex) + ' is', opts, W.sol, H_NONE, 'MC: no solution (a false statement)');
  }
  function epB7(r) { // p/(m x − n) = q/(x + a), nearest tenth
    var s = pick(function () { return { p: r.int(1, 9), m: r.int(2, 4), n: r.int(1, 7), q: r.int(1, 9), a: nz(r, 1, 6) }; }, function (z) {
      if (gcd(z.m, z.n) > 1 || (z.p === 4 && z.m === 2 && z.n === 1 && z.q === 3 && z.a === 2)) return false;
      var W = KT.eq('x', [F(1, z.p, [[z.m, -z.n]])], [F(1, z.q, [[1, z.a]])], { cross: true }); if (!W.valid.length) return false; var x = rv(W.valid[0]); return x > 0.05 && x < 99.95 && W.valid.length === 1;
    });
    var W = KT.eq('x', [F(1, s.p, [[s.m, -s.n]])], [F(1, s.q, [[1, s.a]])], { cross: true });
    return nrPart('The solution of ' + t(W.tex) + ', to the nearest tenth, is ____.', W, 1, H_CROSS, 'NR: cross-multiply');
  }
  /* C1: (m x + k)/(x − a) = c */
  function c1Shared(r) { return pick(function () { return { m: r.int(1, 4), a: nz(r, 1, 5), c: r.int(2, 7), x0: r.int(2, 9) }; }, function (z) { return z.c !== z.m && z.x0 !== z.a && !(z.m === 2 && z.a === 1 && z.c === 5 && z.x0 === 4) && z.c * (z.x0 - z.a) - z.m * z.x0 !== 0 && -z.a * z.m !== 0 && (z.c * (z.x0 - z.a) - z.m * z.x0) !== -z.a * z.m; }); }
  function c1Tex(s) { return '\\frac{' + (s.m === 1 ? '' : s.m) + 'x+k}{' + tx(lp(1, -s.a, 'x')) + '}=' + s.c; }
  /* C2: lens equation */
  function lensForms(sv) {
    // returns [N, D] as functions of the two other letters: the solved formula and its LaTeX
    if (sv === 'q') return { o: ['f', 'p'], val: function (e) { return e.f * e.p / (e.p - e.f); }, tex: '\\frac{fp}{p-f}' };
    if (sv === 'p') return { o: ['f', 'q'], val: function (e) { return e.f * e.q / (e.q - e.f); }, tex: '\\frac{fq}{q-f}' };
    return { o: ['p', 'q'], val: function (e) { return e.p * e.q / (e.p + e.q); }, tex: '\\frac{pq}{p+q}' };
  }
  function lensCheck(sv) {
    var Lf = lensForms(sv), PT = [[3.7, 11.3], [5.2, 17.9], [2.3, 7.1], [4.1, 9.7], [6.3, 13.9]];
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var bad = false; (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'var' && Lf.o.indexOf(x.n) < 0) bad = x.n; ['a', 'b', 'n'].forEach(function (k) { if (x[k] && typeof x[k] === 'object') w(x[k]); }); })(a.ast);
      if (bad) return wrong('value', 'Write ' + t(sv) + ' in terms of ' + t(Lf.o[0]) + ' and ' + t(Lf.o[1]) + ' only (you used ' + t(bad) + ').');
      var all = PT.every(function (pt) { var e = {}; e[Lf.o[0]] = pt[0]; e[Lf.o[1]] = pt[1]; var x = ex.value(a.ast, e); return isFinite(x) && Math.abs(x - Lf.val(e)) < 1e-7 * Math.max(1, Math.abs(x)); });
      if (all) {
        var nested = false; (function w(x, inDiv) { if (!x || typeof x !== 'object') return; if (x.t === 'div') { if (inDiv) nested = true; w(x.a, true); w(x.b, true); return; } ['a', 'b', 'n'].forEach(function (k) { if (x[k] && typeof x[k] === 'object') w(x[k], inDiv); }); })(a.ast, false);
        return nested ? form('simplify', 'Right value — now write it as a single fraction (no fraction inside a fraction).') : ok();
      }
      var rec = PT.every(function (pt) { var e = {}; e[Lf.o[0]] = pt[0]; e[Lf.o[1]] = pt[1]; var x = ex.value(a.ast, e), w2 = sv === 'f' ? e.p + e.q : sv === 'q' ? e.f - e.p : e.f - e.q; return isFinite(x) && Math.abs(x - w2) < 1e-7; });
      if (rec) return wrong(CP + 'recip', 'You cannot take the reciprocal of each term. Multiply every term by the LCD ' + t('fpq') + ' instead.');
      return wrong(CP + 'formula', 'Multiply every term by ' + t('fpq') + ', collect the ' + t(sv) + '-terms on one side and factor out ' + t(sv) + '.');
    };
  }

  /* ======================================================================================================
   * The questions
   * ====================================================================================================== */
  var QUESTIONS = [
    { num: '1', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return q1(r, 'a'); } },
      { id: '1b', level: 'EMG', make: function (r) { return q1(r, 'b'); } },
      { id: '1c', level: 'PRG', make: function (r) { return q1(r, 'c'); } },
      { id: '1d', level: 'PRG', make: function (r) { return q1(r, 'd'); } }] },
    { num: '2', parts: [
      { id: '2a', level: 'BEG', make: function (r) { return q2(r, 'a'); } },
      { id: '2b', level: 'EMG', make: function (r) { return q2(r, 'b'); } }] },
    { num: '3', parts: [
      { id: '3a', level: 'BEG', make: function (r) { return q3(r, 'a'); } },
      { id: '3b', level: 'EMG', make: function (r) { return q3(r, 'b'); } },
      { id: '3c', level: 'PRG', make: function (r) { return q3(r, 'c'); } },
      { id: '3d', level: 'PRG', make: function (r) { return q3(r, 'd'); } }] },
    { num: '4', parts: [
      { id: '4a', level: 'BEG', make: function (r) { return q4(r, 'a'); } },
      { id: '4b', level: 'EMG', make: function (r) { return q4(r, 'b'); } },
      { id: '4c', level: 'PRG', make: function (r) { return q4(r, 'c'); } },
      { id: '4d', level: 'PRG', make: function (r) { return q4(r, 'd'); } }] },
    { num: '5', parts: [
      { id: '5a', level: 'PRG', make: function (r) { return q5(r, 'a'); } },
      { id: '5b', level: 'PRG', make: function (r) { return q5(r, 'b'); } },
      { id: '5c', level: 'ADV', make: function (r) { return q5(r, 'c'); } }] },
    { num: '6', parts: [
      { id: '6a', level: 'PRG', make: function (r) { return q6(r, 'a'); } },
      { id: '6b', level: 'ADV', make: function (r) { return q6(r, 'b'); } }] },
    { num: '7', parts: [
      { id: '7a', level: 'PRG', make: function (r) { return q7(r, 'a'); } },
      { id: '7b', level: 'MAS', make: function (r) { return q7(r, 'b'); } }] },
    { num: '8', parts: [
      { id: '8a', level: 'ADV', make: function (r) { return q8(r, 'a'); } },
      { id: '8b', level: 'ADV', make: function (r) { return q8(r, 'b'); } }] },
    { num: '9', parts: [
      { id: '9a', level: 'PRG', make: function (r) { return calcQ(r, 'a'); } },
      { id: '9b', level: 'PRG', make: function (r) { return calcQ(r, 'b'); } }] },
    { num: '10', shared: kaiShared, stem: function (s) { var q = s.p + s.c * s.x0; return 'Kai solved ' + t(big('\\frac{' + s.p + '}{x}+' + s.c + '=\\frac{' + q + '}{x}')) + ' like this: “Multiply by ' + t('x') + ': ' + t(s.p + '+' + s.c + '=' + q) + '. Since ' + t((s.p + s.c) + '\\ne ' + q) + ', there is no solution.”'; }, parts: [
      { id: '10a', level: 'EMG', make: function (r, s) {
        var q = s.p + s.c * s.x0;
        return KT.mc(r, 'What is Kai’s error?', [{ html: 'He did not multiply the ' + t(s.c) + ' by ' + t('x') + ': every term must be multiplied by the LCD.', right: true },
          { html: 'The LCD is ' + t('x^{2}') + ', not ' + t('x') + '.', why: 'Both denominators are ' + t('x') + ', so the LCD is ' + t('x') + '.', code: 'lcd' },
          { html: 'He should have cross-multiplied.', why: 'The left side has two terms, so cross-multiplying does not apply. Multiplying by the LCD is right — but every term must be multiplied.', code: 'cross' },
          { html: 'There is no error: the equation has no solution.', why: 'Try ' + t('x=' + s.x0) + ' in the original equation.', code: 'none' }],
          'Kai multiplied only the fractions by ' + t('x') + '. The ' + t(s.c) + ' must be multiplied too: ' + t(s.p + '+' + s.c + 'x=' + q) + '.', ['Check each term of Kai’s step: what is ' + t('x\\times ' + s.c) + '?'], 'find the error');
      } },
      { id: '10b', level: 'PRG', make: function (r, s) { var W = kaiEq(s); return KT.solvePart(CP, 'Solve the equation correctly.', W, H_MONO, 'solve correctly'); } }] },
    { num: '11', parts: [{ id: '11', level: 'MAS', make: function (r) { return q11(r); } }] },
    { num: '12', parts: [{ id: '12', level: 'PRG', make: function (r) { return q12(r); } }] },
    { num: '13', parts: [{ id: '13', level: 'EMG', make: function (r) { return q13(r); } }] },
    { num: '14', parts: [{ id: '14', level: 'EMG', make: function (r) { return q14(r); } }] },
    { num: '15', parts: [{ id: '15', level: 'EMG', make: function (r) { return q15(r); } }] },
    { num: '16', parts: [{ id: '16', level: 'ADV', make: function (r) { return q16(r); } }] },
    { num: '17', parts: [{ id: '17', level: 'PRG', make: function (r) { return q17(r); } }] }
  ];

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) { return q3(r, 'a'); } },
      { id: 'A1b', level: 'EMG', make: function (r) { return q3(r, 'b'); } },
      { id: 'A1c', level: 'PRG', make: function (r) {
        var s = pick(function () { return { a: nz(r, 1, 9), m: r.pick([2, 3]), p: r.int(1, 9), n: r.pick([2, 3, 4, 6]) }; }, function (z) { // (x + a)/(m x) = p/x − 1/n
          if (z.m === z.n || (z.a === -4 && z.m === 2 && z.p === 3 && z.n === 4)) return false; var W = KT.eq('x', [F(1, [1, z.a], [z.m, X])], [F(1, z.p, [X]), F(-1, 1, [z.n])]); return okRoot(W, 40, 6) && rv(W.valid[0]) !== 0;
        });
        var W = KT.eq('x', [F(1, [1, s.a], [s.m, X])], [F(1, s.p, [X]), F(-1, 1, [s.n])]);
        return KT.solvePart(CP, SOLVE + t(W.tex), W, H_MONO, 'monomial denominators');
      } }] },
    { num: 'A2', parts: [
      { id: 'A2a', level: 'BEG', make: function (r) { return q4(r, 'a'); } },
      { id: 'A2b', level: 'PRG', make: function (r) { // (x + a)/(2x + b) = (x + c)/(2x + d)
        var s = pick(function () { return { a: nz(r, 1, 7), b: nz(r, 1, 5), c: nz(r, 1, 7), d: nz(r, 1, 5) }; }, function (z) {
          if (z.b % 2 === 0 || z.d % 2 === 0 || z.b === z.d || z.a === z.c || (z.a === 5 && z.b === -1 && z.c === -1 && z.d === 3)) return false; var W = KT.eq('x', [F(1, [1, z.a], [[2, z.b]])], [F(1, [1, z.c], [[2, z.d]])], { cross: true }); return okRoot(W, 30, 9);
        });
        var W = KT.eq('x', [F(1, [1, s.a], [[2, s.b]])], [F(1, [1, s.c], [[2, s.d]])], { cross: true });
        return KT.solvePart(CP, SOLVE + t(W.tex), W, H_CROSS, 'cross-multiply: the squares cancel');
      } },
      { id: 'A2c', level: 'EMG', make: function (r) { // p/(a − n) = 1/q
        var s = pick(function () { return { p: r.int(1, 9), a: r.int(1, 9), q: r.int(2, 5), sg: r.chance(0.3) ? -1 : 1 }; }, function (z) { return !(z.p === 3 && z.a === 4 && z.q === 2) && z.a - z.sg * z.p * z.q !== z.a; });
        var W = KT.eq('n', [F(1, s.p, [[-1, s.a]], { asc: true })], [F(s.sg, 1, [s.q])], { cross: true });
        return KT.solvePart(CP, SOLVE + t(W.tex), W, H_CROSS, 'cross-multiply');
      } }] },
    { num: 'A3', parts: [
      { id: 'A3a', level: 'PRG', make: function (r) { return q5(r, r.pick(['a', 'b'])); } },
      { id: 'A3b', level: 'PRG', make: function (r) { // 1/(x + a) + p/x = S/(x² + a x)
        var s = pick(function () { return { a: nz(r, 1, 7), p: r.int(1, 5), q: r.int(1, 3), S: nz(r, 1, 12) }; }, function (z) { if (z.a === 4 && z.p === 2 && z.S === 4) return false; var W = KT.eq('x', [F(1, z.q, [[1, z.a]]), F(1, z.p, [X])], [sgnF(z.S, z.S, [X, [1, z.a]])]); return okRoot(W, 30, 5); });
        var W = KT.eq('x', [F(1, s.q, [[1, s.a]]), F(1, s.p, [X])], [sgnF(s.S, s.S, [X, [1, s.a]])], { verify: true });
        return KT.solvePart(CP, 'State the NPVs, solve and verify. ' + t(W.tex), W, H_BIN, 'a monomial and a binomial denominator');
      } }] },
    { num: 'B1', section: 'B. Applying', parts: [{ id: 'B1', level: 'ADV', make: function (r) { return epB1(r); } }] },
    { num: 'B2', parts: [{ id: 'B2', level: 'ADV', make: function (r) { return epB2(r); } }] },
    { num: 'B3', parts: [{ id: 'B3', level: 'PRG', make: function (r) { return epB3(r); } }] },
    { num: 'B4', parts: [{ id: 'B4', level: 'PRG', make: function (r) { return calcQ(r, 'c'); } }] },
    { num: 'B5', parts: [{ id: 'B5', level: 'PRG', make: function (r) { return epB5(r); } }] },
    { num: 'B6', parts: [{ id: 'B6', level: 'ADV', make: function (r) { return epB6(r); } }] },
    { num: 'B7', parts: [{ id: 'B7', level: 'PRG', make: function (r) { return epB7(r); } }] },
    { num: 'C1', section: 'C. Stretch', shared: c1Shared, stem: function (s) { return 'Consider ' + t(big(c1Tex(s))) + '.'; }, parts: [
      { id: 'C1a', level: 'ADV', make: function (r, s) {
        var k = s.c * (s.x0 - s.a) - s.m * s.x0;
        var sol = 'Substitute ' + t('x=' + s.x0) + ': ' + t('\\frac{' + s.m * s.x0 + '+k}{' + (s.x0 - s.a) + '}=' + s.c) + ', so ' + t(s.m * s.x0 + '+k=' + s.c * (s.x0 - s.a)) + ' and ' + t('k=' + k) + '.';
        var p = KP.math('The solution is ' + t('x=' + s.x0) + '. Determine ' + t('k') + '.', K.value(k, { diag: function (x) { return x === s.x0 ? { code: CP + 'gave-given', hint: 'That is the given root: substitute it and solve for ' + t('k') + '.' } : null; } }), String(k), sol, ['Substitute ' + t('x=' + s.x0) + ' and solve for ' + t('k') + '.'], 'working backwards: k', { keys: 'u6num', before: 'k=' });
        p.bad = [String(-k), String(k + 1)].filter(function (b) { return b !== String(k); });
        return p;
      } },
      { id: 'C1b', level: 'MAS', make: function (r, s) {
        var k = -s.a * s.m, c = s.c, m = s.m, a = s.a;
        var sol = 'NPV ' + t('x\\ne ' + a) + '. Cross-multiply: ' + t((m === 1 ? '' : m) + 'x+k=' + c + '(' + tx(lp(1, -a, 'x')) + ')') + ', so ' + t(coefT(c - m) + 'x=k' + (c * a < 0 ? '-' : '+') + Math.abs(c * a)) + ' and ' + t('x=\\frac{k' + (c * a < 0 ? '-' : '+') + Math.abs(c * a) + '}{' + (c - m) + '}') + '.<br>This root is rejected only when it equals the NPV ' + t(a) + ': ' + t('\\frac{k' + (c * a < 0 ? '-' : '+') + Math.abs(c * a) + '}{' + (c - m) + '}=' + a) + ', so ' + t('k=' + k) + '.';
        var p = KP.math('For what value of ' + t('k') + ' does the equation have no solution?', K.value(k, { diag: function (x) { if (x === a) return { code: CP + 'gave-given', hint: t('x=' + a) + ' is the NPV. Find the ' + t('k') + ' that makes the root equal to it.' }; if (x === -k) return { code: CP + 'k-sign', hint: 'Check the sign.' }; return null; } }), String(k), sol, ['Solve for ' + t('x') + ' in terms of ' + t('k') + '.', 'The equation has no solution when that root is the NPV ' + t('x=' + a) + '.'], 'working backwards: no solution', { keys: 'u6num', before: 'k=' });
        p.bad = [String(a), String(-k)].filter(function (b) { return b !== String(k); });
        return p;
      } }] },
    { num: 'C2', shared: function (r) { return pick(function () { var sv = r.pick(['q', 'q', 'p', 'f']), f = r.pick([4, 5, 6, 8, 10, 12, 15, 20]), p = f + r.pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30]); return { sv: sv, f: f, p: p }; }, function (z) { var q = z.f * z.p / (z.p - z.f); return Math.abs(q - Math.round(q)) < 1e-9 && q <= 400 && !(z.f === 10 && z.p === 15); }); },
      stem: function () { return 'The lens equation is ' + t(big('\\frac{1}{f}=\\frac{1}{p}+\\frac{1}{q}')) + '.'; }, parts: [
      { id: 'C2a', level: 'MAS', make: function (r, s) {
        var Lf = lensForms(s.sv), sv = s.sv;
        var sol = sv === 'f' ? 'Multiply every term by ' + t('fpq') + ': ' + t('pq=fq+fp') + '. Factor: ' + t('pq=f(q+p)') + ', so ' + t('f=\\frac{pq}{p+q}') + '.'
          : 'Multiply every term by ' + t('fpq') + ': ' + t('pq=fq+fp') + '.<br>' + (sv === 'q' ? t('pq-fq=fp\\Rightarrow q(p-f)=fp\\Rightarrow q=\\frac{fp}{p-f}') : t('pq-fp=fq\\Rightarrow p(q-f)=fq\\Rightarrow p=\\frac{fq}{q-f}')) + '.';
        var p = KP.math('Solve for ' + t(sv) + '.', lensCheck(sv), Lf.tex, sol, ['Multiply every term by the LCD ' + t('fpq') + '.', 'Collect the terms with ' + t(sv) + ' on one side, factor ' + t(sv) + ' out, then divide.'], 'solve a formula for a variable', { keys: 'u6rat', vars: Lf.o.concat([sv]), before: sv + '=' });
        p.bad = [sv === 'f' ? 'p+q' : sv === 'q' ? 'f-p' : 'f-q', sv === 'f' ? '\\frac{p+q}{pq}' : '\\frac{fp}{f-p}'.replace(/p/g, sv === 'q' ? 'p' : 'q')];
        return p;
      } },
      { id: 'C2b', level: 'ADV', make: function (r, s) {
        var q = s.f * s.p / (s.p - s.f), sv = s.sv, giv, ans, sol;
        if (sv === 'f') { giv = 'p=' + s.p + '\\text{ cm and }q=' + q + '\\text{ cm}'; ans = s.f; sol = t('f=\\frac{' + s.p + '(' + q + ')}{' + s.p + '+' + q + '}=' + s.f) + ' cm.'; }
        else if (sv === 'p') { giv = 'f=' + s.f + '\\text{ cm and }q=' + s.p + '\\text{ cm}'; ans = q; sol = t('p=\\frac{' + s.f + '(' + s.p + ')}{' + s.p + '-' + s.f + '}=' + q) + ' cm.'; }
        else { giv = 'f=' + s.f + '\\text{ cm and }p=' + s.p + '\\text{ cm}'; ans = q; sol = t('q=\\frac{' + s.f + '(' + s.p + ')}{' + s.p + '-' + s.f + '}=' + q) + ' cm.'; }
        var p = KP.math('Determine ' + t(sv) + ' when ' + t(giv) + '.', K.value(ans), String(ans), sol, ['Substitute into your formula from (a).'], 'use the formula', { keys: 'u6num', before: sv + '=', after: 'cm' });
        p.bad = [String(sv === 'f' ? s.p + q : Math.abs(s.p - s.f))].filter(function (b) { return b !== String(ans); });
        return p;
      } }] },
    { num: 'C3', parts: [{ id: 'C3', level: 'MAS', make: function (r) { // three trinomial denominators sharing factors
      var s = pick(function () { var a = nz(r, 1, 6), b = nz(r, 1, 6), c = nz(r, 1, 6); return { a: a, b: b, c: c, p: r.int(1, 6), q: r.int(1, 4), w: r.int(1, 6), sg: r.chance(0.7) ? -1 : 1 }; }, function (z) {
        if (z.a === z.b || z.b === z.c || z.a === z.c || (z.a === 3 && z.b === -2 && z.c === 2)) return false;
        // p/((x−a)(x−b)) ± q/((x−c)(x−b)) = w/((x−c)(x−a))
        var W = KT.eq('x', [F(1, z.p, [[1, -z.a], [1, -z.b]]), F(z.sg, z.q, [[1, -z.c], [1, -z.b]])], [F(1, z.w, [[1, -z.c], [1, -z.a]])]); return okRoot(W, 40, 6);
      });
      var W = KT.eq('x', [F(1, s.p, [[1, -s.a], [1, -s.b]]), F(s.sg, s.q, [[1, -s.c], [1, -s.b]])], [F(1, s.w, [[1, -s.c], [1, -s.a]])]);
      return KT.solvePart(CP, 'Solve. ' + t(W.tex), W, ['Factor all three denominators: they share factors. State the NPVs.', 'The LCD is the product of the three different binomials; multiply every term by it.'], 'three trinomial denominators');
    } }] }
  ];

  HW.defineLesson({ id: LID, unit: 6, num: '7', title: 'Solving Rational Equations', outcome: 'AN6', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
