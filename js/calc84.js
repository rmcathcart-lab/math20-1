/* On-screen graphing calculator in the style of the TI-84 Plus CE (colour screen, the real key layout with the 2nd
 * functions in blue and the ALPHA letters in green above the keys). It has the basics and everything Math 20-1 uses; it
 * is not a full emulator. It replaces the TI-30XIIS calculator (js/calc.js, kept in the repo but no longer loaded).
 *
 *   Home screen   history (entries left, answers right), Ans, 2nd ENTRY, ▲ into the history + ENTER to paste,
 *                 ◄ ► DEL, 2nd INS (insert; the default is overwrite, like Classic mode), CLEAR, 2nd QUIT.
 *                 TI order of operations: functions, then ² ⁻¹ ! ° ʳ, then ^ and ˣ√ (left to right), then (−),
 *                 then nPr nCr, then × ÷ and implied multiplication (same level, left to right), then + −.
 *                 So (−)2² = −4, 2^3^2 = 64 and 6÷2(1+2) = 9. A missing ")" at the end of a line is fine.
 *                 STO→ stores in A–Z, θ, X or L1–L6 (ALPHA comes on by itself after STO→). Results are shown in
 *                 Classic form (fractions as 5/6). MATH 1 ►Frac turns a decimal into a fraction (denominator < 10000).
 *   MODE          NORMAL SCI ENG · FLOAT 0–9 · RADIAN DEGREE (default DEGREE) · ANSWERS AUTO DEC FRAC-APPROX.
 *   Menus         MATH (MATH NUM CMPLX PROB FRAC), 2nd LIST (NAMES OPS MATH: seq( cumSum( dim( ΔList(, sum( prod(
 *                 min( max( mean( median(), 2nd TEST (= ≠ > ≥ < ≤, and or xor not(), 2nd ANGLE (° ' ʳ ►DMS),
 *                 VARS ► Y-VARS 1:Function (Y1–Y6). Arrows or the item's number/letter pick an item; CLEAR leaves.
 *   Graphing      Y= (Y1–Y6; ◄ to the "=" toggles a function, ◄ again to the line style: thick, thin, shade above ◥,
 *                 shade below ◣, dot), WINDOW (Xmin … Yscl, Xres, ΔX, TraceStep), ZOOM (1 ZBox, 2 Zoom In, 3 Zoom Out,
 *                 4 ZDecimal, 5 ZSquare, 6 ZStandard, 7 ZTrig, 8 ZInteger, 0 ZoomFit, A ZQuadrant1; MEMORY 1 ZPrevious),
 *                 2nd FORMAT (grid, axes, coordinates, expression), GRAPH, TRACE (◄ ► move, ▲ ▼ change function, type
 *                 a number to jump to that X), 2nd TABLE and 2nd TBLSET, 2nd CALC 1 value 2 zero 3 minimum
 *                 4 maximum 5 intersect 6 dy/dx with the real prompts (Left Bound? Right Bound? Guess? /
 *                 First curve? Second curve? Guess?). No false lines across vertical asymptotes.
 *   Errors        ERROR: SYNTAX, DOMAIN, DIVIDE BY 0, NONREAL ANSWERS, OVERFLOW, ARGUMENT, DATA TYPE, DIM MISMATCH,
 *                 INVALID, WINDOW RANGE, NO SIGN CHANGE, BOUND … with 1:Quit 2:Goto (Goto puts the cursor on the error).
 *   Left out      statistics, programs, matrices, complex numbers, apps, CATALOG, MathPrint templates, parametric /
 *                 polar / sequence graphing (those keys say so). Casio fx-9750GIII users have the same features
 *                 under different keys (the help page says so).
 *
 * API (the same as js/calc.js): HW.Calc = { engine, get(), toggle() } and HW.CALC_ICON. get() returns
 * { node, calc, show(), hide(), toggle(), isOpen(), render(), press(actions), setZoom(z), fit() }, with a .calc-head drag
 * bar and a .calc-close button. calc.press(id) presses a key by its id (below) and follows 2nd / ALPHA like the real
 * keys; it also takes the name of a 2nd or ALPHA function directly ('sqrt', 'table', 'A' …). calc.second, calc.alpha and
 * calc.menu are the 2nd / ALPHA state and the open menu. calc.toHome(clear) quits to an empty home screen line
 * (clear: and clears the screen, as the lesson demos do; 2nd ENTRY still remembers the old entries).
 * Key ids: yeq window zoom trace graph · 2nd mode del · alpha xt stat · math apps prgm vars clear · inv sin cos tan pow
 * · sq comma lp rp div · log 7 8 9 mul · ln 4 5 6 sub · sto 1 2 3 add · on 0 . neg enter · up down left right.
 *
 * Key-press demos on the lesson pages: data-keys="…" is a list of tokens separated by spaces; HW.Calc.plan(spec) turns
 * it into key presses and the caption text (lessons/js/ui.js runs it). The tokens:
 *   numbers           500  1.12  .7                  (one key per digit)
 *   keys              + − × ÷ ^ ( ) ,  = or ENTER  (−)  x²  x⁻¹  sin cos tan  log ln  X (the X,T,θ,n key)  STO→ (or →)
 *                     CLEAR DEL MODE MATH VARS ALPHA 2nd ON  Y= WINDOW ZOOM TRACE GRAPH  ▲ ▼ ◄ ►
 *   2nd functions     √ (2nd x²)  π  e  EE  {  }  Ans  ENTRY  QUIT  INS  sin⁻¹ cos⁻¹ tan⁻¹  10^(  e^(
 *                     TABLE TBLSET CALC FORMAT LIST TEST ANGLE  L1–L6  A-LOCK
 *   menu items        ►Frac ►Dec ³ (or x³) ³√( ˣ√ Σ(  (MATH)   abs( round( iPart( fPart( int( (MATH NUM)   nPr nCr !
 *                     seq( dim( cumSum( (2nd LIST OPS)   sum( prod( (2nd LIST MATH)   ° (2nd ANGLE)   > ≥ < ≤ ≠ (2nd TEST)
 *                     Y1–Y6 (VARS ► 1)   ZBox ZoomIn ZoomOut ZDecimal ZSquare ZStandard ZTrig ZInteger ZoomFit (ZOOM)
 *                     value zero minimum maximum intersect (2nd CALC)
 *   letters           A … Z (not X) and θ: ALPHA + that key, e.g. N = ALPHA LOG
 *   any key           k:<key id>, e.g. k:right
 * A digit token inside a menu picks that item, as on the real calculator (e.g. "ZOOM 6" = "ZStandard").
 */
(function (root) {
  'use strict';
  var HW = root.HW = root.HW || {};
  /* the calculator icon used on every calculator button (practice, test mode; lessons/js/ui.js draws the same shape) */
  HW.CALC_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="5" y="2.5" width="14" height="19" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="7.5" y="5" width="9" height="4" rx=".6" fill="currentColor" opacity=".35"/><g fill="currentColor"><circle cx="9" cy="12.5" r="1"/><circle cx="12" cy="12.5" r="1"/><circle cx="15" cy="12.5" r="1"/><circle cx="9" cy="15.5" r="1"/><circle cx="12" cy="15.5" r="1"/><circle cx="15" cy="15.5" r="1"/><circle cx="9" cy="18.5" r="1"/><circle cx="12" cy="18.5" r="1"/><circle cx="15" cy="18.5" r="1"/></g></svg>';

  /* ======================= numbers: a float plus an exact fraction where possible ======================= */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function V(f, q) { return { f: f, q: q || null }; }
  function safe(x) { return Math.abs(x) < 1e15 && x % 1 === 0; }
  function fromQ(n, d) {
    if (d === 0) throw E('DIVIDE BY 0');
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d) || 1; n /= g; d /= g;
    return safe(n) && safe(d) ? V(n / d, [n, d]) : V(n / d);
  }
  var ZERO = function () { return V(0, [0, 1]); };
  function E(code, pos) { var e = new Error(code); e.calc = true; e.code = code; if (pos != null) e.pos = pos; return e; }
  function isInt(x) { return isFinite(x) && Math.floor(x) === x; }
  function r14(x) { return x === 0 ? 0 : Number(x.toPrecision(14)); }
  function chk(v) { if (v.L) { v.L.forEach(chk); return v; } if (isNaN(v.f)) throw E('DOMAIN'); if (!isFinite(v.f) || Math.abs(v.f) >= 1e100) throw E('OVERFLOW'); return v; }
  /* the fraction a TI-84 would show for a value (►Frac): denominator below 10000, or null */
  function fracOf(v) {
    if (v.q && v.q[1] < 10000) return v.q;
    var x = v.f; if (!isFinite(x) || Math.abs(x) >= 1e10) return null;
    if (isInt(x)) return [x, 1];
    var h0 = 1, h1 = Math.floor(x), k0 = 0, k1 = 1, b = x - Math.floor(x);
    for (var i = 0; i < 40 && k1 < 10000; i++) {
      if (Math.abs(x - h1 / k1) <= 1e-11 * Math.max(1, Math.abs(x))) return [h1, k1];
      if (b < 1e-14) break;
      b = 1 / b; var a = Math.floor(b); b -= a;
      var h2 = a * h1 + h0, k2 = a * k1 + k0; h0 = h1; h1 = h2; k0 = k1; k1 = k2;
    }
    return k1 < 10000 && Math.abs(x - h1 / k1) <= 1e-11 * Math.max(1, Math.abs(x)) ? [h1, k1] : null;
  }
  function exactRoot(v, k) {
    if (v.q && v.q[0] >= 0 && k >= 1) {
      var n = Math.round(Math.pow(v.q[0], 1 / k)), d = Math.round(Math.pow(v.q[1], 1 / k));
      if (Math.pow(n, k) === v.q[0] && Math.pow(d, k) === v.q[1]) return fromQ(n, d);
    }
    return null;
  }
  var OP = {
    add: function (a, b) { if (a.q && b.q) { var n = a.q[0] * b.q[1] + b.q[0] * a.q[1], d = a.q[1] * b.q[1]; if (safe(n) && safe(d)) return fromQ(n, d); } return V(a.f + b.f); },
    sub: function (a, b) { return OP.add(a, OP.neg(b)); },
    mul: function (a, b) { if (a.q && b.q) { var n = a.q[0] * b.q[0], d = a.q[1] * b.q[1]; if (safe(n) && safe(d)) return fromQ(n, d); } return V(a.f * b.f); },
    div: function (a, b) { if (b.f === 0) throw E('DIVIDE BY 0'); if (a.q && b.q) { var n = a.q[0] * b.q[1], d = a.q[1] * b.q[0]; if (safe(n) && safe(d)) return fromQ(n, d); } return V(a.f / b.f); },
    neg: function (a) { return a.q ? V(-a.f, [-a.q[0], a.q[1]]) : V(-a.f); },
    pow: function (a, b) {
      if (a.f === 0 && b.f === 0) throw E('DOMAIN');
      if (a.f === 0 && b.f < 0) throw E('DIVIDE BY 0');
      if (a.q && b.q && b.q[1] === 1 && Math.abs(b.q[0]) <= 400) {
        var e = Math.abs(b.q[0]), n = Math.pow(a.q[0], e), d = Math.pow(a.q[1], e);
        if (safe(n) && safe(d)) return b.q[0] >= 0 ? fromQ(n, d) : fromQ(d, n);
      }
      if (!isInt(b.f)) {
        var fq = b.q && b.q[1] < 10000 ? b.q : fracOf(b), ex = null;
        if (fq && a.q && fq[1] <= 12) { var rt = exactRoot(V(Math.abs(a.f), [Math.abs(a.q[0]), a.q[1]]), fq[1]); if (rt) ex = OP.pow(rt, V(fq[0], [fq[0], 1])); }
        if (a.f < 0) { // a negative base: only a fraction exponent with an odd denominator is real, e.g. (−8)^(2/3) = 4
          if (!fq || fq[1] % 2 === 0) throw E('NONREAL ANSWERS');
          var odd = Math.abs(fq[0]) % 2 === 1;
          if (ex) return odd ? OP.neg(ex) : ex;
          var r0 = Math.pow(-a.f, b.f); return V(odd ? -r0 : r0);
        }
        if (ex) return ex;
      }
      var r = Math.pow(a.f, b.f);
      if (!isFinite(r)) throw E('OVERFLOW');
      return V(r);
    },
    root: function (k, x) { // k ˣ√ x
      if (k.f === 0) throw E('DOMAIN');
      if (isInt(k.f) && k.f > 0) { var ex = exactRoot(V(Math.abs(x.f), x.q ? [Math.abs(x.q[0]), x.q[1]] : null), k.f); if (x.f < 0) { if (k.f % 2 === 0) throw E('NONREAL ANSWERS'); return ex ? OP.neg(ex) : V(-Math.pow(-x.f, 1 / k.f)); } if (ex) return ex; }
      if (x.f < 0) { var kq = fracOf(k); if (kq && kq[0] % 2 !== 0) { var r1 = Math.pow(-x.f, 1 / k.f); return V(kq[1] % 2 ? -r1 : r1); } throw E('NONREAL ANSWERS'); }
      return V(Math.pow(x.f, 1 / k.f));
    }
  };
  function fact(x) { var n = x.f; if (n < 0 || !isInt(n)) throw E('DOMAIN'); if (n > 69) throw E('OVERFLOW'); var r = 1; for (var i = 2; i <= n; i++) r *= i; return safe(r) ? V(r, [r, 1]) : V(r); }
  function npr(a, b, c) { var n = a.f, k = b.f; if (!isInt(n) || !isInt(k) || n < 0 || k < 0) throw E('DOMAIN'); if (k > n) return ZERO(); var r = 1; for (var i = 0; i < k; i++) r *= n - i; if (c) { for (var j = 2; j <= k; j++) r /= j; r = Math.round(r); } return safe(r) ? V(r, [r, 1]) : V(r); }
  function lift1(v, fn) { return v.L ? { L: v.L.map(fn) } : fn(v); }
  function lift2(a, b, fn) {
    if (!a.L && !b.L) return fn(a, b);
    if (a.L && b.L && a.L.length !== b.L.length) throw E('DIM MISMATCH');
    var n = a.L ? a.L.length : b.L.length, out = [];
    for (var i = 0; i < n; i++) out.push(fn(a.L ? a.L[i] : a, b.L ? b.L[i] : b));
    return { L: out };
  }
  function scalar(v) { if (v.L) throw E('DATA TYPE'); return v; }
  function list(v) { if (!v.L) throw E('DATA TYPE'); return v.L; }
  function bool(x) { return x ? V(1, [1, 1]) : ZERO(); }
  function intv(x) { return isInt(x) && Math.abs(x) < 1e15 ? V(x, [x, 1]) : V(x); }

  /* ======================= display formats ======================= */
  function trim(s) { if (s.indexOf('.') < 0) return s; return s.replace(/0+$/, '').replace(/\.$/, ''); }
  function noLead(s) { return s.replace(/^(-?)0\./, '$1.'); }
  function sci(x, sig, fix, eng) {
    if (x === 0) return fix >= 0 ? (0).toFixed(fix) + 'ᴇ0' : '0ᴇ0';
    var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
    var ms = fix >= 0 ? m.toFixed(fix) : m.toPrecision(sig);
    if (Math.abs(Number(ms)) >= 10) { e++; m = x / Math.pow(10, e); ms = fix >= 0 ? m.toFixed(fix) : m.toPrecision(sig); }
    if (eng) { var sh = ((e % 3) + 3) % 3; e -= sh; m = x / Math.pow(10, e); ms = fix >= 0 ? m.toFixed(fix) : m.toPrecision(Math.max(sig, sh + 1)); }
    if (fix < 0) ms = trim(ms);
    return ms + 'ᴇ' + e;
  }
  /* a number the way the home screen shows it (10 digits, ".5" without the leading zero, 1.2ᴇ12) */
  function fmtNum(x, mode) {
    mode = mode || { note: 'NORMAL', fix: -1 };
    if (x === 0 || Math.abs(x) < 1e-99) x = 0;
    var fix = mode.fix == null ? -1 : mode.fix;
    if (mode.note === 'SCI' || mode.note === 'ENG') return sci(x, 10, fix, mode.note === 'ENG');
    if (x === 0) return fix >= 0 ? (0).toFixed(fix) : '0';
    var ax = Math.abs(x);
    if (fix >= 0) {
      if (ax >= 1e10) return sci(x, 10, fix);
      var s = x.toFixed(fix); if (Number(s) === 0) return sci(x, 10, fix);
      var digits = s.replace(/[-.]/g, '').length; if (digits > 10) s = x.toFixed(Math.max(0, fix - (digits - 10)));
      return noLead(s);
    }
    var r = Number(x.toPrecision(10)), ar = Math.abs(r);
    if (ar >= 1e10 || ar < 1e-3) return sci(r, 10, -1);
    var t = String(r); if (/e/.test(t)) return sci(r, 10, -1);
    return noLead(t);
  }
  /* the shortest TI-style form of x that fits in n characters (table cells, the graph screen) */
  function fmtFit(x, n) {
    if (!isFinite(x)) return 'ERROR';
    for (var sig = 10; sig >= 1; sig--) { var s = fmtNum(Number(x.toPrecision(sig))); if (s.length <= n) return s; }
    for (var s2 = 8; s2 >= 1; s2--) { var t = sci(x, s2, -1); if (t.length <= n) return t; }
    return sci(x, 1, -1);
  }
  function fmtDMS(x) {
    var sg = x < 0 ? '-' : '', t = Math.round(Math.abs(x) * 3600 * 1e6) / 1e6, d = Math.floor(t / 3600 + 1e-12), m = Math.floor((t - d * 3600) / 60 + 1e-12), s = Number((t - d * 3600 - m * 60).toPrecision(8));
    return sg + d + '°' + m + "'" + fmtNum(s) + '"';
  }

  /* ======================= tokens ======================= */
  var T = {
    d: function (c) { return { k: 'd', s: c }; },
    ee: function () { return { k: 'ee', s: 'ᴇ' }; },
    op: function (o, s) { return { k: 'op', o: o, s: s }; },
    neg: function () { return { k: 'neg', s: '⁻' }; },
    lp: function () { return { k: 'lp', s: '(' }; }, rp: function () { return { k: 'rp', s: ')' }; },
    comma: function () { return { k: 'comma', s: ',' }; },
    lb: function () { return { k: 'lb', s: '{' }; }, rb: function () { return { k: 'rb', s: '}' }; },
    fn: function (f, s) { return { k: 'fn', f: f, s: s }; },
    post: function (p, s) { return { k: 'post', p: p, s: s }; },
    conv: function (c, s) { return { k: 'conv', c: c, s: s }; },
    cst: function (n, s) { return { k: 'cst', n: n, s: s }; },
    v: function (n) { return { k: 'v', n: n, s: n }; },
    ans: function () { return { k: 'ans', s: 'Ans' }; },
    lv: function (n) { return { k: 'lv', n: n, s: 'L' + '₁₂₃₄₅₆'[n - 1] }; },
    yv: function (n) { return { k: 'yv', n: n, s: 'Y' + '₁₂₃₄₅₆'[n - 1] }; },
    sto: function () { return { k: 'sto', s: '→' }; },
    rand: function () { return { k: 'rand', s: 'rand' }; },
    fb: function () { return { k: 'fb', s: '⁄' }; },
    ch: function (s) { return { k: 'ch', s: s }; }
  };
  var FNS = { sin: 'sin(', cos: 'cos(', tan: 'tan(', asin: 'sin⁻¹(', acos: 'cos⁻¹(', atan: 'tan⁻¹(', sqrt: '√(', log: 'log(', ln: 'ln(', tenx: '10^(', ex: 'e^(' };
  /* the token a named key action types, or null */
  function tokFor(a) {
    if (/^[0-9.]$/.test(a)) return T.d(a);
    switch (a) {
      case 'add': return T.op('add', '+'); case 'sub': return T.op('sub', '−'); case 'mul': return T.op('mul', '*'); case 'div': return T.op('div', '/');
      case 'pow': return T.op('pow', '^'); case 'neg': return T.neg(); case 'lp': return T.lp(); case 'rp': return T.rp(); case 'comma': return T.comma();
      case 'lb': return T.lb(); case 'rb': return T.rb(); case 'ee': return T.ee(); case 'sq': return T.post('sq', '²'); case 'inv': return T.post('inv', '⁻¹');
      case 'pi': return T.cst('pi', 'π'); case 'econst': return T.cst('e', 'e'); case 'xt': return T.v('X'); case 'ans': return T.ans(); case 'sto': return T.sto();
      case 'quote': return T.ch('"'); case 'space': return T.ch(' '); case 'colon': return T.ch(':'); case 'qmark': return T.ch('?');
    }
    if (FNS[a]) return T.fn(a, FNS[a]);
    if (/^L[1-6]$/.test(a)) return T.lv(+a[1]);
    if (/^[A-Zθ]$/.test(a)) return T.v(a);
    return null;
  }
  function toksText(t) { return t.map(function (x) { return x.s; }).join(''); }
  /* a shown answer back into tokens (pasting from the history) */
  function strToks(s) {
    var out = [];
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (/[0-9.]/.test(ch)) out.push(T.d(ch));
      else if (ch === '-') out.push(T.neg());
      else if (ch === 'ᴇ') out.push(T.ee());
      else if (ch === '/') out.push(T.op('div', '/'));
      else if (ch === '{') out.push(T.lb()); else if (ch === '}') out.push(T.rb());
      else if (ch === ' ') { if (out.length && out[out.length - 1].k !== 'lb') out.push(T.comma()); }
    }
    return out;
  }

  /* ======================= parser (tokens → tree) ======================= */
  var STARTS = { d: 1, ee: 1, lp: 1, lb: 1, fn: 1, cst: 1, v: 1, ans: 1, lv: 1, yv: 1, rand: 1, neg: 1 };
  function parse(toks) {
    var i = 0, usedFb = false;
    function pk() { return toks[i]; }
    function isOp(o) { var t = toks[i]; return t && t.k === 'op' && t.o === o; }
    function close() { var t = toks[i]; if (t && t.k === 'rp') { i++; return; } if (!t || t.k === 'sto' || t.k === 'conv') return; throw E('SYNTAX', i); }
    function number() {
      var start = i, s = '', dots = 0, hasE = false;
      while (toks[i] && toks[i].k === 'd') { if (toks[i].s === '.') dots++; s += toks[i].s; i++; }
      if (dots > 1 || s === '.') throw E('SYNTAX', start);
      if (toks[i] && toks[i].k === 'ee') {
        hasE = true; i++; var es = '';
        if (toks[i] && toks[i].k === 'neg') { es = '-'; i++; }
        var ed = ''; while (toks[i] && toks[i].k === 'd' && toks[i].s !== '.') { ed += toks[i].s; i++; }
        if (!ed) throw E('SYNTAX', i);
        if (!s) s = '1';
        return { t: 'n', v: exactDec(s, Number(es + ed)) };
      }
      var v = exactDec(s, 0);
      if (toks[i] && toks[i].k === 'fb') { // n⁄d: an exact fraction
        var p = i; i++; var ds = ''; while (toks[i] && toks[i].k === 'd') { ds += toks[i].s; i++; }
        if (!ds || /\./.test(ds) || /\./.test(s) || hasE) throw E('SYNTAX', p);
        usedFb = true; v = fromQ(Number(s), Number(ds));
      }
      return { t: 'n', v: v };
    }
    function exactDec(s, e10) {
      var parts = s.split('.'), dec = (parts[1] || '').length, n = Number((parts[0] || '') + (parts[1] || '') || '0'), d = Math.pow(10, dec);
      if (e10 > 0) n *= Math.pow(10, e10); else if (e10 < 0) d *= Math.pow(10, -e10);
      return safe(n) && safe(d) ? fromQ(n, d) : V(Number(s + 'e' + e10));
    }
    function prim() {
      var t = pk(), p = i; if (!t) throw E('SYNTAX', i);
      switch (t.k) {
        case 'd': case 'ee': return number();
        case 'lp': i++; var e = expr(); close(); return e;
        case 'lb': i++; var items = [];
        if (pk() && pk().k === 'rb') { i++; return { t: 'list', items: items, p: p }; }
          items.push(expr()); while (pk() && pk().k === 'comma') { i++; items.push(expr()); }
          if (pk() && pk().k === 'rb') i++; else if (pk() && pk().k !== 'sto' && pk().k !== 'conv') throw E('SYNTAX', i);
          return { t: 'list', items: items, p: p };
        case 'fn': i++; var args = [];
          if (pk() && pk().k === 'rp') throw E('ARGUMENT', i);
          args.push(expr()); while (pk() && pk().k === 'comma') { i++; args.push(expr()); }
          close(); return { t: 'f', f: t.f, args: args, p: p };
        case 'cst': i++; return { t: 'c', n: t.n };
        case 'v': i++; return { t: 'v', n: t.n, p: p };
        case 'ans': i++; return { t: 'ans' };
        case 'lv': i++; return { t: 'lv', n: t.n };
        case 'rand': i++; return { t: 'rand' };
        case 'yv': i++;
          if (pk() && pk().k === 'lp') { i++; var a = expr(); close(); return { t: 'yv', n: t.n, arg: a, p: p }; }
          return { t: 'yv', n: t.n, p: p };
      }
      throw E('SYNTAX', i);
    }
    function post() {
      var v = prim();
      while (pk() && pk().k === 'post') { var p = i; v = { t: 'post', p: pk().p, a: v, pos: p }; i++; }
      return v;
    }
    function powArg() { if (pk() && pk().k === 'neg') { var p = i; i++; return { t: 'neg', a: powArg(), pos: p }; } return post(); }
    function power() {
      var v = post();
      while (isOp('pow') || isOp('root')) { var o = pk().o, p = i; i++; v = { t: 'b', o: o, a: v, b: powArg(), p: p }; }
      return v;
    }
    function perm() {
      var v = power();
      while (isOp('npr') || isOp('ncr')) { var o = pk().o, p = i; i++; v = { t: 'b', o: o, a: v, b: power(), p: p }; }
      return v;
    }
    function negx() { if (pk() && pk().k === 'neg') { var p = i; i++; return { t: 'neg', a: negx(), pos: p }; } return perm(); }
    function mul() {
      var v = negx();
      for (;;) {
        if (isOp('mul') || isOp('div')) { var o = pk().o, p = i; i++; v = { t: 'b', o: o, a: v, b: negx(), p: p }; }
        else if (pk() && STARTS[pk().k]) { var p2 = i; v = { t: 'b', o: 'mul', a: v, b: negx(), p: p2 }; }
        else return v;
      }
    }
    function add() {
      var v = mul();
      while (isOp('add') || isOp('sub')) { var o = pk().o, p = i; i++; if (!pk()) throw E('SYNTAX', i); v = { t: 'b', o: o, a: v, b: mul(), p: p }; }
      return v;
    }
    function rel() { var v = add(); while (pk() && pk().k === 'op' && /^(eq|ne|gt|ge|lt|le)$/.test(pk().o)) { var o = pk().o, p = i; i++; v = { t: 'b', o: o, a: v, b: add(), p: p }; } return v; }
    function andx() { var v = rel(); while (isOp('and')) { var p = i; i++; v = { t: 'b', o: 'and', a: v, b: rel(), p: p }; } return v; }
    function expr() { var v = andx(); while (isOp('or') || isOp('xor')) { var o = pk().o, p = i; i++; v = { t: 'b', o: o, a: v, b: andx(), p: p }; } return v; }
    if (!toks.length) return null;
    var ast = expr(), conv = null, sto = null;
    if (pk() && pk().k === 'conv') { conv = pk().c; i++; }
    if (pk() && pk().k === 'sto') {
      i++; var tg = pk();
      if (!tg || (tg.k !== 'v' && tg.k !== 'lv')) throw E('SYNTAX', i);
      sto = tg; i++;
    }
    if (i < toks.length) throw E('SYNTAX', i);
    return { ast: ast, conv: conv, sto: sto, fb: usedFb };
  }

  /* ======================= the key layout ======================= */
  // [id, key label, primary action, 2nd label, 2nd action, alpha label, alpha action, class]
  var LAYOUT = [
    [['yeq', 'y=', 'yeq', 'stat plot', 'na:STAT PLOT', 'f1', null, 'top'], ['window', 'window', 'window', 'tblset', 'tblset', 'f2', null, 'top'], ['zoom', 'zoom', 'zoom', 'format', 'format', 'f3', null, 'top'], ['trace', 'trace', 'trace', 'calc', 'calc', 'f4', null, 'top'], ['graph', 'graph', 'graph', 'table', 'table', 'f5', null, 'top']],
    [['2nd', '2nd', '2nd', '', null, '', null, 'k2nd'], ['mode', 'mode', 'mode', 'quit', 'quit', '', null, 'fn'], ['del', 'del', 'del', 'ins', 'ins', '', null, 'fn']],
    [['alpha', 'alpha', 'alpha', 'A-lock', 'alock', '', null, 'kalpha'], ['xt', 'X,T,θ,<i>n</i>', 'xt', 'link', 'na:LINK', '', null, 'fn sm'], ['stat', 'stat', 'na:STAT', 'list', 'list', '', null, 'fn']],
    [['math', 'math', 'math', 'test', 'test', 'A', 'A', 'fn'], ['apps', 'apps', 'na:APPS', 'angle', 'angle', 'B', 'B', 'fn'], ['prgm', 'prgm', 'na:PRGM', 'draw', 'na:DRAW', 'C', 'C', 'fn'], ['vars', 'vars', 'vars', 'distr', 'na:DISTR', '', null, 'fn'], ['clear', 'clear', 'clear', '', null, '', null, 'fn']],
    [['inv', 'x<sup>-1</sup>', 'inv', 'matrix', 'na:MATRIX', 'D', 'D', 'fn'], ['sin', 'sin', 'sin', 'sin<sup>-1</sup>', 'asin', 'E', 'E', 'fn'], ['cos', 'cos', 'cos', 'cos<sup>-1</sup>', 'acos', 'F', 'F', 'fn'], ['tan', 'tan', 'tan', 'tan<sup>-1</sup>', 'atan', 'G', 'G', 'fn'], ['pow', '^', 'pow', 'π', 'pi', 'H', 'H', 'fn']],
    [['sq', 'x<sup>2</sup>', 'sq', '√', 'sqrt', 'I', 'I', 'fn'], ['comma', ',', 'comma', 'EE', 'ee', 'J', 'J', 'fn'], ['lp', '(', 'lp', '{', 'lb', 'K', 'K', 'fn'], ['rp', ')', 'rp', '}', 'rb', 'L', 'L', 'fn'], ['div', '÷', 'div', 'e', 'econst', 'M', 'M', 'fn op']],
    [['log', 'log', 'log', '10<sup>x</sup>', 'tenx', 'N', 'N', 'fn'], ['7', '7', '7', 'u', 'na:u', 'O', 'O', 'num'], ['8', '8', '8', 'v', 'na:v', 'P', 'P', 'num'], ['9', '9', '9', 'w', 'na:w', 'Q', 'Q', 'num'], ['mul', '×', 'mul', '[', 'na:MATRIX', 'R', 'R', 'fn op']],
    [['ln', 'ln', 'ln', 'e<sup>x</sup>', 'ex', 'S', 'S', 'fn'], ['4', '4', '4', 'L4', 'L4', 'T', 'T', 'num'], ['5', '5', '5', 'L5', 'L5', 'U', 'U', 'num'], ['6', '6', '6', 'L6', 'L6', 'V', 'V', 'num'], ['sub', '−', 'sub', ']', 'na:MATRIX', 'W', 'W', 'fn op']],
    [['sto', 'sto→', 'sto', 'rcl', 'na:RCL', 'X', 'X', 'fn'], ['1', '1', '1', 'L1', 'L1', 'Y', 'Y', 'num'], ['2', '2', '2', 'L2', 'L2', 'Z', 'Z', 'num'], ['3', '3', '3', 'L3', 'L3', 'θ', 'θ', 'num'], ['add', '+', 'add', 'mem', 'na:MEM', '"', 'quote', 'fn op']],
    [['on', 'on', 'on', 'off', 'off', '', null, 'fn'], ['0', '0', '0', 'catalog', 'na:CATALOG', '␣', 'space', 'num'], ['.', '.', '.', 'i', 'na:i', ':', 'colon', 'num'], ['neg', '(−)', 'neg', 'ans', 'ans', '?', 'qmark', 'num'], ['enter', 'enter', 'enter', 'entry', 'entry', 'solve', 'na:SOLVE', 'fn']]
  ];
  var KEY = {};
  LAYOUT.forEach(function (row) { row.forEach(function (k) { KEY[k[0]] = { id: k[0], a: k[2], s2: k[4], al: k[6] }; }); });
  ['up', 'down', 'left', 'right'].forEach(function (d) { KEY[d] = { id: d, a: d, s2: d === 'left' ? 'lstart' : d === 'right' ? 'lend' : d, al: null }; });
  var ALPHA_KEY = {}; Object.keys(KEY).forEach(function (id) { if (KEY[id].al && /^[A-Zθ]$/.test(KEY[id].al)) ALPHA_KEY[KEY[id].al] = id; });

  /* ======================= menus ======================= */
  function P(tok) { return { paste: tok }; } // an item that types a token
  var NA = { na: true };
  var MENUS = {
    math: [
      { n: 'MATH', items: [['►Frac', P(function () { return T.conv('frac', '►Frac'); })], ['►Dec', P(function () { return T.conv('dec', '►Dec'); })], ['³', P(function () { return T.post('cube', '³'); })], ['³√(', P(function () { return T.fn('cbrt', '³√('); })], ['ˣ√', P(function () { return T.op('root', 'ˣ√'); })],
        ['fMin(', NA], ['fMax(', NA], ['nDeriv(', P(function () { return T.fn('nderiv', 'nDeriv('); })], ['fnInt(', NA], ['summation Σ(', P(function () { return T.fn('sigma', 'Σ('); })], ['logBASE(', P(function () { return T.fn('logb', 'logBASE('); })], ['Solver…', NA]] },
      { n: 'NUM', items: [['abs(', P(function () { return T.fn('abs', 'abs('); })], ['round(', P(function () { return T.fn('round', 'round('); })], ['iPart(', P(function () { return T.fn('ipart', 'iPart('); })], ['fPart(', P(function () { return T.fn('fpart', 'fPart('); })], ['int(', P(function () { return T.fn('int', 'int('); })],
        ['min(', P(function () { return T.fn('min', 'min('); })], ['max(', P(function () { return T.fn('max', 'max('); })], ['lcm(', P(function () { return T.fn('lcm', 'lcm('); })], ['gcd(', P(function () { return T.fn('gcd', 'gcd('); })], ['remainder(', P(function () { return T.fn('rem', 'remainder('); })],
        ['►n/d◄►Un/d', NA], ['►F◄►D', P(function () { return T.conv('fd', '►F◄►D'); })], ['Un/d', NA], ['n/d', P(function () { return T.fb(); })]] },
      { n: 'CMPLX', items: [['conj(', NA], ['real(', NA], ['imag(', NA], ['angle(', NA], ['abs(', P(function () { return T.fn('abs', 'abs('); })], ['►Rect', NA], ['►Polar', NA]] },
      { n: 'PROB', items: [['rand', P(function () { return T.rand(); })], ['nPr', P(function () { return T.op('npr', ' nPr '); })], ['nCr', P(function () { return T.op('ncr', ' nCr '); })], ['!', P(function () { return T.post('fact', '!'); })], ['randInt(', P(function () { return T.fn('randint', 'randInt('); })], ['randNorm(', NA], ['randBin(', NA], ['randIntNoRep(', NA]] },
      { n: 'FRAC', items: [['n/d', P(function () { return T.fb(); })], ['Un/d', NA], ['►F◄►D', P(function () { return T.conv('fd', '►F◄►D'); })], ['►n/d◄►Un/d', NA]] }
    ],
    list: [
      { n: 'NAMES', items: [1, 2, 3, 4, 5, 6].map(function (k) { return ['L' + '₁₂₃₄₅₆'[k - 1], P(function () { return T.lv(k); })]; }) },
      { n: 'OPS', items: [['SortA(', NA], ['SortD(', NA], ['dim(', P(function () { return T.fn('dim', 'dim('); })], ['Fill(', NA], ['seq(', P(function () { return T.fn('seq', 'seq('); })], ['cumSum(', P(function () { return T.fn('cumsum', 'cumSum('); })], ['ΔList(', P(function () { return T.fn('dlist', 'ΔList('); })], ['Select(', NA], ['augment(', NA], ['List►matr(', NA], ['Matr►list(', NA], ['↑', NA]] },
      { n: 'MATH', items: [['min(', P(function () { return T.fn('min', 'min('); })], ['max(', P(function () { return T.fn('max', 'max('); })], ['mean(', P(function () { return T.fn('mean', 'mean('); })], ['median(', P(function () { return T.fn('median', 'median('); })], ['sum(', P(function () { return T.fn('sum', 'sum('); })], ['prod(', P(function () { return T.fn('prod', 'prod('); })], ['stdDev(', NA], ['variance(', NA]] }
    ],
    test: [
      { n: 'TEST', items: [['=', P(function () { return T.op('eq', '='); })], ['≠', P(function () { return T.op('ne', '≠'); })], ['>', P(function () { return T.op('gt', '>'); })], ['≥', P(function () { return T.op('ge', '≥'); })], ['<', P(function () { return T.op('lt', '<'); })], ['≤', P(function () { return T.op('le', '≤'); })]] },
      { n: 'LOGIC', items: [['and', P(function () { return T.op('and', ' and '); })], ['or', P(function () { return T.op('or', ' or '); })], ['xor', P(function () { return T.op('xor', ' xor '); })], ['not(', P(function () { return T.fn('not', 'not('); })]] }
    ],
    angle: [
      { n: 'ANGLE', items: [['°', P(function () { return T.post('deg', '°'); })], ["'", P(function () { return T.post('min', "'"); })], ['ʳ', P(function () { return T.post('rad', 'ʳ'); })], ['►DMS', P(function () { return T.conv('dms', '►DMS'); })], ['R►Pr(', NA], ['R►Pθ(', NA], ['P►Rx(', NA], ['P►Ry(', NA]] }
    ],
    vars: [
      { n: 'VARS', items: [['Window…', NA], ['Zoom…', NA], ['GDB…', NA], ['Picture & Background…', NA], ['Statistics…', NA], ['Table…', NA], ['String…', NA]] },
      { n: 'Y-VARS', items: [['Function…', { sub: 'yvars' }], ['Parametric…', NA], ['Polar…', NA], ['On/Off…', NA]] }
    ],
    yvars: [{ n: 'FUNCTION', items: [1, 2, 3, 4, 5, 6].map(function (k) { return ['Y' + '₁₂₃₄₅₆'[k - 1], P(function () { return T.yv(k); })]; }) }],
    zoom: [
      { n: 'ZOOM', items: [['ZBox', { run: 'zbox' }], ['Zoom In', { run: 'zin' }], ['Zoom Out', { run: 'zout' }], ['ZDecimal', { run: 'zdec' }], ['ZSquare', { run: 'zsq' }], ['ZStandard', { run: 'zstd' }], ['ZTrig', { run: 'ztrig' }], ['ZInteger', { run: 'zint' }], ['ZoomStat', NA], ['ZoomFit', { run: 'zfit' }], ['ZQuadrant1', { run: 'zq1' }], ['ZFrac1/2', NA], ['ZFrac1/3', NA], ['ZFrac1/4', NA]] },
      { n: 'MEMORY', items: [['ZPrevious', { run: 'zprev' }], ['ZoomSto', { run: 'zsto' }], ['ZoomRcl', { run: 'zrcl' }], ['SetFactors…', NA]] }
    ],
    calc: [{ n: 'CALCULATE', items: [['value', { run: 'cvalue' }], ['zero', { run: 'czero' }], ['minimum', { run: 'cmin' }], ['maximum', { run: 'cmax' }], ['intersect', { run: 'cint' }], ['dy/dx', { run: 'cdydx' }], ['∫f(x)dx', NA]] }]
  };
  function itemNum(k) { return k < 9 ? String(k + 1) : k === 9 ? '0' : String.fromCharCode(65 + k - 10); }
  var MENU_KEYS = { math: 'math', list: 'list', test: 'test', angle: 'angle', vars: 'vars', zoom: 'zoom', calc: 'calc' };

  var MODE_ROWS = [
    { k: 'note', opts: [['NORMAL', 'NORMAL'], ['SCI', 'SCI'], ['ENG', 'ENG']] },
    { k: 'fix', opts: [['FLOAT', -1], ['0', 0], ['1', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5], ['6', 6], ['7', 7], ['8', 8], ['9', 9]] },
    { k: 'angle', opts: [['RADIAN', 'RAD'], ['DEGREE', 'DEG']] },
    { k: 'func', opts: [['FUNCTION', 1], ['PARAMETRIC', 0, 1], ['POLAR', 0, 1], ['SEQ', 0, 1]] },
    { k: 'real', opts: [['REAL', 1], ['a+bi', 0, 1], ['re^(θi)', 0, 1]] },
    { k: 'full', opts: [['FULL', 1], ['HORIZONTAL', 0, 1], ['GRAPH-TABLE', 0, 1]] },
    { k: 'answers', label: 'ANSWERS:', opts: [['AUTO', 'AUTO'], ['DEC', 'DEC'], ['FRAC-APPROX', 'FRAC']] }
  ];
  var FORMAT_ROWS = [
    { k: 'coord', opts: [['CoordOn', true], ['CoordOff', false]] },
    { k: 'grid', opts: [['GridOff', 0], ['GridDot', 1], ['GridLine', 2]] },
    { k: 'axes', opts: [['AxesOn', true], ['AxesOff', false]] },
    { k: 'label', opts: [['LabelOff', false], ['LabelOn', true]] },
    { k: 'expr', opts: [['ExprOn', true], ['ExprOff', false]] }
  ];
  var WIN_ROWS = [['xmin', 'Xmin'], ['xmax', 'Xmax'], ['xscl', 'Xscl'], ['ymin', 'Ymin'], ['ymax', 'Ymax'], ['yscl', 'Yscl'], ['xres', 'Xres'], ['dx', 'ΔX'], ['tstep', 'TraceStep']];
  var ERR_TEXT = {
    'SYNTAX': 'Something is typed wrong: check the brackets and commas, and use (−) for a negative number, not −.',
    'DOMAIN': 'A value is outside what the function allows (e.g. sin⁻¹ of a number bigger than 1, or tan(90) in degrees).',
    'DIVIDE BY 0': 'You divided by zero.',
    'NONREAL ANSWERS': 'The answer is not a real number (e.g. the square root of a negative number).',
    'OVERFLOW': 'The answer is too big for the calculator (1ᴇ100 or more).',
    'ARGUMENT': 'This function has the wrong number of values (arguments) in its brackets.',
    'DATA TYPE': 'A list was used where a number is needed (or the other way around).',
    'DIM MISMATCH': 'The two lists are not the same length.',
    'INVALID': 'That doesn’t work here.',
    'INVALID DIM': 'The list is too long (999 items at most) or empty.',
    'WINDOW RANGE': 'Xmin must be less than Xmax and Ymin less than Ymax (WINDOW).',
    'NO SIGN CHANGE': 'The graph doesn’t cross between the bounds you chose. Pick a Left Bound and a Right Bound on either side of the crossing.',
    'BOUND': 'The Left Bound must be to the left of the Right Bound.',
    'UNAVAILABLE': 'This on-screen TI-84 has only the features Math 20-1 uses.'
  };
  var COLORS = ['#1f4fd8', '#d42020', '#141414', '#c21fc2', '#13883b', '#e8780c'];
  var COLOR_NAMES = ['BLUE', 'RED', 'BLACK', 'MAGENTA', 'GREEN', 'ORANGE'];
  var STYLES = ['thick', 'thin', 'above', 'below', 'dot'];
  var GW = 265, GH = 165; // the CE graph area in pixels

  /* ======================= the calculator ======================= */
  function Line(t) { this.t = t || []; this.c = this.t.length; }
  Line.prototype = {
    put: function (tok, ins) { if (ins || this.c >= this.t.length) this.t.splice(this.c, 0, tok); else this.t[this.c] = tok; this.c++; },
    del: function () { if (this.c < this.t.length) this.t.splice(this.c, 1); else if (this.t.length) { this.t.pop(); this.c = this.t.length; } },
    clear: function () { this.t = []; this.c = 0; },
    copy: function () { return new Line(this.t.slice()); }
  };

  function Calc() {
    this.mode = { note: 'NORMAL', fix: -1, angle: 'DEG', answers: 'AUTO', func: 1, real: 1, full: 1 };
    this.fmt = { coord: true, grid: 0, axes: true, label: false, expr: true };
    this.vars = {}; var self = this;
    'ABCDEFGHIJKLMNOPQRSTUVWXYZθ'.split('').forEach(function (n) { self.vars[n] = ZERO(); });
    this.lists = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    this.ans = ZERO(); this.hist = []; this.entries = []; this.entryIdx = -1; this.hsel = -1;
    this.line = new Line(); this.second = false; this.alpha = false; this.alock = false; this.ins = false;
    this.scr = 'home'; this.menu = null; this.err = null; this.on = true; this.ver = 0;
    this.Y = [0, 1, 2, 3, 4, 5].map(function (i) { return { line: new Line(), on: true, style: 0, color: i }; });
    this.yrow = 0; this.ycol = 'expr';
    this.win = { xmin: -10, xmax: 10, xscl: 1, ymin: -10, ymax: 10, yscl: 1, xres: 1, tstep: null };
    this.wrow = 0; this.wline = null;
    this.tbl = { start: 0, step: 1 }; this.trow = 0; this.tline = null;
    this.tb = { top: 0, row: 0, col: 0, c0: 0, inp: null };
    this.g = { mode: 'none' }; this.zprev = null; this.zsave = null;
    this.mrow = 0; this.mcol = 0; this.frow = 0; this.fcol = 0;
    this.astCache = {};
  }
  var C = Calc.prototype;

  /* ---------- keys ---------- */
  C.press = function (a) {
    if (a === 'second') a = '2nd';
    if (!this.on) { if (a === 'on') { this.on = true; this.scr = 'home'; } return; }
    if (KEY[a]) return this.key(a);
    this.second = false;
    return this.act(a);
  };
  C.key = function (id) {
    var K = KEY[id], a;
    if (id === '2nd') { this.second = !this.second; return; }
    if (id === 'alpha') {
      if (this.second) { this.second = false; this.alock = true; this.alpha = true; return; }
      if (this.alpha) { this.alpha = false; this.alock = false; return; }
      this.alpha = true; return;
    }
    if (this.second) { this.second = false; if (!this.alock) this.alpha = false; a = K.s2 || K.a; }
    else if (this.alpha && K.al) { if (!this.alock) this.alpha = false; a = K.al; }
    else { if (this.alpha && !this.alock) this.alpha = false; a = K.a; }
    return this.act(a);
  };
  C.toHome = function (clearScreen) { if (clearScreen) { this.hist = []; this.hsel = -1; } this.yrow = 0; this.ycol = 'expr'; this.second = false; this.alpha = false; this.alock = false; this.err = null; this.menu = null; this.g = { mode: 'none' }; this.scr = 'home'; this.hsel = -1; this.ins = false; this.line.clear(); this.on = true; };

  C.act = function (a) {
    if (this.scr === 'error') return this.errKey(a);
    if (this.scr === 'menu' && !this.menu) this.scr = 'home';
    if (/^na:/.test(a)) return this.fail('UNAVAILABLE', null, a.slice(3));
    // keys that work on every screen
    switch (a) {
      case 'quit': this.leaveEditors(); if (this.err) return; this.scr = 'home'; this.menu = null; this.g = { mode: 'none' }; this.hsel = -1; return;
      case 'off': this.on = false; return;
      case 'alock': this.alpha = this.alock = true; return;
      case 'mode': this.leaveEditors(); if (this.err) return; this.scr = 'mode'; this.mrow = 0; this.mcol = this.modeCol(0); return;
      case 'format': this.leaveEditors(); if (this.err) return; this.scr = 'format'; this.frow = 0; this.fcol = this.fmtCol(0); return;
      case 'yeq': this.leaveEditors(); if (this.err) return; this.scr = 'yeq'; this.ycol = 'expr'; this.Y[this.yrow].line.c = this.Y[this.yrow].line.t.length; return;
      case 'window': this.leaveEditors(); if (this.err) return; this.scr = 'window'; this.wrow = 0; this.wline = null; return;
      case 'tblset': this.leaveEditors(); if (this.err) return; this.scr = 'tblset'; this.trow = 0; this.tline = null; return;
      case 'graph': this.leaveEditors(); if (this.err) return; return this.showGraph();
      case 'trace': this.leaveEditors(); if (this.err) return; if (this.scr !== 'graph' && !this.showGraph()) return; return this.startTrace('trace');
      case 'table': this.leaveEditors(); if (this.err) return; return this.showTable();
    }
    if (MENU_KEYS[a]) {
      if (this.scr === 'menu' && this.menu && this.menu.id === a) { this.closeMenu(); return; }
      var ret = this.scr === 'menu' && this.menu ? this.menu.ret : this.scr;
      if (a !== 'zoom' && a !== 'calc' && !/^(home|yeq|window|tblset)$/.test(ret)) ret = 'home';
      if ((a === 'zoom' || a === 'calc') && ret !== 'graph') this.leaveEditors();
      if (this.err) return;
      this.menu = { id: a, tab: 0, sel: 0, top: 0, ret: ret }; this.scr = 'menu'; return;
    }
    switch (this.scr) {
      case 'home': return this.homeKey(a);
      case 'menu': return this.menuKey(a);
      case 'yeq': return this.yeqKey(a);
      case 'window': return this.winKey(a);
      case 'tblset': return this.tsetKey(a);
      case 'table': return this.tableKey(a);
      case 'graph': return this.graphKey(a);
      case 'mode': return this.modeKey(a);
      case 'format': return this.formatKey(a);
    }
  };
  C.fail = function (code, back, detail) {
    this.err = { code: code, back: back || null, sel: 0, detail: detail || '', from: this.scr === 'error' ? 'home' : this.scr };
    this.scr = 'error'; this.second = false; if (!this.alock) this.alpha = false;
  };
  C.errKey = function (a) {
    var e = this.err, n = e.back ? 2 : 1;
    if (a === 'up' || a === 'down') { e.sel = (e.sel + (a === 'up' ? n - 1 : 1)) % n; return; }
    var pick = a === '1' ? 0 : a === '2' && n === 2 ? 1 : a === 'enter' ? e.sel : a === 'clear' || a === 'quit' ? 0 : -1;
    if (pick < 0) return;
    this.err = null;
    if (pick === 1 && e.back) { var b = e.back; this.scr = b.scr; if (b.scr === 'home') { this.line = new Line(b.toks.slice()); this.line.c = Math.min(b.pos == null ? b.toks.length : b.pos, b.toks.length); } else if (b.scr === 'yeq') { this.yrow = b.row; this.ycol = 'expr'; var L = this.Y[b.row].line; L.c = Math.min(b.pos == null ? L.t.length : b.pos, L.t.length); } else if (b.scr === 'window') { this.wrow = b.row; this.wline = null; } else if (b.scr === 'tblset') { this.trow = b.row; this.tline = null; } return; }
    // Quit: back to the home screen (an error on the graph screen also goes home, as on the real calculator)
    this.scr = 'home'; this.menu = null; this.g = { mode: 'none' }; this.line.clear(); this.hsel = -1;
  };

  /* ---------- the home screen ---------- */
  var ANS_FIRST = { op: 1, post: 1, conv: 1, sto: 1 };
  C.homeKey = function (a) {
    var L = this.line;
    if (this.hsel >= 0 && a !== 'up' && a !== 'down' && a !== 'enter') this.hsel = -1;
    switch (a) {
      case 'enter':
        if (this.hsel >= 0) { var it = this.histItems()[this.hsel]; this.hsel = -1; if (it) { var tk = it.out ? strToks(it.text) : it.toks.slice(); for (var i = 0; i < tk.length; i++) L.put(tk[i], true); } return; }
        this.ins = false; return this.exec();
      case 'clear': if (L.t.length) L.clear(); else { this.hist = []; } this.ins = false; return;
      case 'up': { var n = this.histItems().length; if (n) this.hsel = Math.min(n - 1, this.hsel + 1); return; }
      case 'down': if (this.hsel >= 0) this.hsel--; return;
      case 'left': this.ins = false; L.c = Math.max(0, L.c - 1); return;
      case 'right': this.ins = false; L.c = Math.min(L.t.length, L.c + 1); return;
      case 'lstart': L.c = 0; return;
      case 'lend': L.c = L.t.length; return;
      case 'del': L.del(); return;
      case 'ins': this.ins = !this.ins; return;
      case 'entry': if (!this.entries.length) return; this.entryIdx = (this.entryIdx + 1) % this.entries.length; this.line = new Line(this.entries[this.entryIdx].slice()); return;
      case 'on': return;
    }
    var tok = tokFor(a); if (!tok) return;
    if (!L.t.length && ANS_FIRST[tok.k] && !(tok.k === 'op' && tok.o === 'root')) L.put(T.ans());
    L.put(tok, this.ins);
    if (tok.k === 'sto') { this.alpha = true; }
  };
  C.histItems = function () { // newest first: each answer, then its entry
    var out = [];
    for (var i = this.hist.length - 1; i >= 0; i--) { var h = this.hist[i]; out.push({ out: true, text: h.out, h: i }); out.push({ out: false, toks: h.toks, h: i }); }
    return out;
  };
  C.exec = function () {
    var L = this.line;
    if (!L.t.length) { if (!this.entries.length) return; L = this.line = new Line(this.entries[0].slice()); }
    var toks = L.t.slice(), res;
    try { res = this.run(toks); }
    catch (e) { if (!e.calc) throw e; this.fail(e.code, { scr: 'home', toks: toks, pos: e.pos }); return; }
    this.entries.unshift(toks); if (this.entries.length > 30) this.entries.pop(); this.entryIdx = -1;
    this.hist.push({ toks: toks, out: res.text, v: res.v }); if (this.hist.length > 40) this.hist.shift();
    this.line = new Line();
  };
  /* evaluate one line of tokens: { v, text } (stores Ans, and the STO→ target) */
  C.run = function (toks) {
    var pr = parse(toks); if (!pr) return null;
    this.depth = 0;
    var v = chk(this.ev(pr.ast, null)), disp = this.mode.answers === 'FRAC' || (this.mode.answers === 'AUTO' && pr.fb) ? 'frac' : 'dec';
    if (pr.conv === 'frac') disp = 'frac'; else if (pr.conv === 'dec') disp = 'dec'; else if (pr.conv === 'dms') disp = 'dms';
    else if (pr.conv === 'fd') disp = this.lastDisp === 'frac' ? 'dec' : 'frac';
    if (pr.sto) {
      if (pr.sto.k === 'lv') { if (!v.L) throw E('DATA TYPE', toks.length - 1); this.lists[pr.sto.n] = v.L.slice(); }
      else { if (v.L) throw E('DATA TYPE', toks.length - 1); this.vars[pr.sto.n] = v; }
      this.ver++;
    }
    this.ans = v; this.lastDisp = disp;
    return { v: v, text: this.fmtVal(v, disp) };
  };
  C.fmtVal = function (v, disp) {
    var self = this;
    if (v.L) return '{' + v.L.map(function (x) { return self.fmtVal(x, disp); }).join(' ') + '}';
    if (disp === 'frac') { var q = fracOf(v); if (q && q[1] !== 1) return (q[0] < 0 ? '-' : '') + Math.abs(q[0]) + '/' + q[1]; }
    if (disp === 'dms') return fmtDMS(v.f);
    return fmtNum(v.f, this.mode);
  };

  /* ---------- evaluation ---------- */
  C.unit = function () { return this.mode.angle === 'DEG' ? Math.PI / 180 : 1; };
  C.trig = function (f, x) {
    var deg = this.mode.angle === 'DEG', a = x.f, r;
    if (f === 'sin' || f === 'cos' || f === 'tan') {
      if (deg) {
        var m = ((a % 360) + 360) % 360;
        if (f === 'sin' && m % 180 === 0) return ZERO();
        if (f === 'cos' && m % 180 === 90) return ZERO();
        if (f === 'tan') { if (m % 180 === 90) throw E('DOMAIN'); if (m % 180 === 0) return ZERO(); }
        a = m * Math.PI / 180;
      }
      if (f === 'tan' && Math.abs(Math.cos(a)) < 1e-15) throw E('DOMAIN');
      r = Math[f](a); if (Math.abs(r) < 1e-13) r = 0;
      return V(r14(r));
    }
    if ((f === 'asin' || f === 'acos') && Math.abs(a) > 1) throw E('DOMAIN');
    r = Math[f](a) / this.unit();
    return V(r14(r));
  };
  C.ev = function (n, ctx) {
    try { return this.ev0(n, ctx); }
    catch (e) { if (e.calc && e.pos == null && n.p != null) e.pos = n.p; if (e.calc && e.pos == null && n.pos != null) e.pos = n.pos; throw e; }
  };
  C.ev0 = function (n, ctx) {
    var self = this;
    switch (n.t) {
      case 'n': return n.v;
      case 'c': return V(n.n === 'pi' ? Math.PI : Math.E);
      case 'v': return ctx && ctx[n.n] ? ctx[n.n] : this.vars[n.n];
      case 'ans': return this.ans;
      case 'rand': return V(Math.random());
      case 'lv': return { L: this.lists[n.n].slice() };
      case 'list': return { L: n.items.map(function (it) { return scalar(self.ev(it, ctx)); }) };
      case 'neg': return lift1(this.ev(n.a, ctx), OP.neg);
      case 'yv': {
        var ast = this.yAst(n.n - 1, true); if (!ast) throw E('INVALID');
        if (++this.depth > 12) throw E('INVALID');
        try {
          var xv = n.arg ? this.ev(n.arg, ctx) : (ctx && ctx.X ? ctx.X : this.vars.X);
          return lift1(xv, function (x) { var c2 = {}; for (var k in ctx) c2[k] = ctx[k]; c2.X = x; return scalar(self.ev(ast, c2)); });
        } finally { this.depth--; }
      }
      case 'post': {
        var a = this.ev(n.a, ctx), p = n.p;
        return lift1(a, function (v) {
          switch (p) {
            case 'sq': return chk(OP.mul(v, v));
            case 'cube': return chk(OP.mul(OP.mul(v, v), v));
            case 'inv': return OP.div(V(1, [1, 1]), v);
            case 'fact': return fact(v);
            case 'deg': return self.mode.angle === 'DEG' ? v : V(v.f * Math.PI / 180);
            case 'min': return self.mode.angle === 'DEG' ? OP.div(v, V(60, [60, 1])) : V(v.f * Math.PI / 10800);
            case 'rad': return self.mode.angle === 'RAD' ? v : V(v.f * 180 / Math.PI);
          }
          throw E('SYNTAX');
        });
      }
      case 'b': {
        var A = this.ev(n.a, ctx), B = this.ev(n.b, ctx), o = n.o;
        return lift2(A, B, function (x, y) {
          switch (o) {
            case 'add': return chk(OP.add(x, y)); case 'sub': return chk(OP.sub(x, y));
            case 'mul': return chk(OP.mul(x, y)); case 'div': return chk(OP.div(x, y));
            case 'pow': return chk(OP.pow(x, y)); case 'root': return chk(OP.root(x, y));
            case 'npr': return npr(x, y, false); case 'ncr': return npr(x, y, true);
            case 'eq': return bool(x.f === y.f); case 'ne': return bool(x.f !== y.f); case 'gt': return bool(x.f > y.f);
            case 'ge': return bool(x.f >= y.f); case 'lt': return bool(x.f < y.f); case 'le': return bool(x.f <= y.f);
            case 'and': return bool(x.f !== 0 && y.f !== 0); case 'or': return bool(x.f !== 0 || y.f !== 0); case 'xor': return bool((x.f !== 0) !== (y.f !== 0));
          }
          throw E('SYNTAX');
        });
      }
      case 'f': return this.fn(n, ctx);
    }
    throw E('SYNTAX');
  };
  var ARGS = { seq: [4, 5], sigma: [4, 4], nderiv: [3, 4], round: [1, 2], min: [1, 2], max: [1, 2], lcm: [2, 2], gcd: [2, 2], rem: [2, 2], logb: [2, 2], randint: [2, 3], sum: [1, 3], prod: [1, 1], dim: [1, 1], cumsum: [1, 1], dlist: [1, 1], mean: [1, 1], median: [1, 1] };
  C.fn = function (n, ctx) {
    var f = n.f, args = n.args, self = this, rng = ARGS[f] || [1, 1];
    if (args.length < rng[0] || args.length > rng[1]) throw E('ARGUMENT', n.p);
    function ev(k) { return self.ev(args[k], ctx); }
    function evS(k) { return scalar(ev(k)); }
    if (f === 'seq' || f === 'sigma' || f === 'nderiv') {
      var vn = args[1]; if (vn.t !== 'v') throw E('SYNTAX', n.p);
      var with_ = function (x) { var c2 = {}; for (var k in ctx) c2[k] = ctx[k]; c2[vn.n] = x; return scalar(self.ev(args[0], c2)); };
      if (f === 'nderiv') { var x0 = evS(2).f, h = args[3] ? evS(3).f : 1e-3; return V(r14((with_(V(x0 + h)).f - with_(V(x0 - h)).f) / (2 * h))); }
      var a = evS(2), b = evS(3), st = f === 'seq' && args[4] ? evS(4) : V(1, [1, 1]);
      if (st.f === 0) throw E('DOMAIN', n.p);
      var cnt = Math.floor((b.f - a.f) / st.f + 1e-9) + 1;
      if (cnt > 999) throw E('INVALID DIM', n.p);
      var out = [], cur = a;
      for (var k = 0; k < cnt; k++) { out.push(with_(cur)); cur = OP.add(cur, st); }
      if (f === 'sigma') { var s = ZERO(); out.forEach(function (v) { s = OP.add(s, v); }); return chk(s); }
      if (!out.length) throw E('INVALID DIM', n.p);
      return { L: out };
    }
    var one = {
      sin: 1, cos: 1, tan: 1, asin: 1, acos: 1, atan: 1,
      sqrt: function (x) { if (x.f < 0) throw E('NONREAL ANSWERS'); return exactRoot(x, 2) || V(Math.sqrt(x.f)); },
      cbrt: function (x) { return OP.root(V(3, [3, 1]), x); },
      abs: function (x) { return x.q ? fromQ(Math.abs(x.q[0]), x.q[1]) : V(Math.abs(x.f)); },
      ipart: function (x) { return intv(Math.trunc(x.f)); },
      fpart: function (x) { return x.q ? OP.sub(x, intv(Math.trunc(x.f))) : V(x.f - Math.trunc(x.f)); },
      int: function (x) { return intv(Math.floor(x.f)); },
      log: function (x) { if (x.f < 0) throw E('NONREAL ANSWERS'); if (x.f === 0) throw E('DOMAIN'); var r = Math.log10(x.f); return isInt(r) ? intv(r) : V(r); },
      ln: function (x) { if (x.f < 0) throw E('NONREAL ANSWERS'); if (x.f === 0) throw E('DOMAIN'); return V(Math.log(x.f)); },
      tenx: function (x) { return chk(OP.pow(V(10, [10, 1]), x)); },
      ex: function (x) { return chk(V(Math.exp(x.f))); },
      not: function (x) { return bool(x.f === 0); }
    };
    if (one[f]) { var fn1 = one[f] === 1 ? function (x) { return self.trig(f, x); } : one[f]; return lift1(ev(0), fn1); }
    switch (f) {
      case 'round': { var dp = args[1] ? evS(1).f : 9; if (!isInt(dp) || dp < 0 || dp > 9) throw E('DOMAIN', n.p); return lift1(ev(0), function (x) { var m = Math.pow(10, dp), r = Math.round(Math.abs(x.f) * m + 1e-9) / m; r = x.f < 0 ? -r : r; return fracOf(V(r)) && dp <= 4 ? fromQ(Math.round(r * m), m) : V(r); }); }
      case 'min': case 'max': {
        var pick = f === 'min' ? Math.min : Math.max;
        if (args.length === 1) { var L1 = list(ev(0)); if (!L1.length) throw E('INVALID DIM', n.p); var best = L1[0]; L1.forEach(function (v) { if (pick(v.f, best.f) === v.f) best = v; }); return best; }
        return lift2(ev(0), ev(1), function (x, y) { return pick(x.f, y.f) === x.f ? x : y; });
      }
      case 'lcm': case 'gcd': return lift2(ev(0), ev(1), function (x, y) { if (!isInt(x.f) || !isInt(y.f) || x.f < 0 || y.f < 0) throw E('DOMAIN'); var g = gcd(x.f, y.f); return intv(f === 'gcd' ? g : (g ? x.f / g * y.f : 0)); });
      case 'rem': return lift2(ev(0), ev(1), function (x, y) { if (y.f === 0) throw E('DIVIDE BY 0'); if (!isInt(x.f) || !isInt(y.f)) throw E('DOMAIN'); return intv(x.f % y.f); });
      case 'logb': return lift2(ev(0), ev(1), function (x, b) { if (x.f <= 0 || b.f <= 0) throw E(x.f < 0 || b.f < 0 ? 'NONREAL ANSWERS' : 'DOMAIN'); if (b.f === 1) throw E('DIVIDE BY 0'); return V(r14(Math.log(x.f) / Math.log(b.f))); });
      case 'randint': { var lo = evS(0).f, hi = evS(1).f, cn = args[2] ? evS(2).f : 0; var one1 = function () { return intv(Math.floor(lo + Math.random() * (hi - lo + 1))); }; if (!cn) return one1(); var rs = []; for (var q = 0; q < cn; q++) rs.push(one1()); return { L: rs }; }
      case 'sum': case 'prod': {
        var L2 = list(ev(0)), s0 = args[1] ? evS(1).f : 1, s1 = args[2] ? evS(2).f : L2.length;
        var acc = f === 'sum' ? ZERO() : V(1, [1, 1]);
        for (var j = s0 - 1; j < Math.min(s1, L2.length); j++) acc = f === 'sum' ? OP.add(acc, L2[j]) : OP.mul(acc, L2[j]);
        return chk(acc);
      }
      case 'dim': return intv(list(ev(0)).length);
      case 'cumsum': { var c0 = ZERO(); return { L: list(ev(0)).map(function (v) { c0 = OP.add(c0, v); return c0; }) }; }
      case 'dlist': { var L3 = list(ev(0)); if (L3.length < 2) throw E('INVALID DIM', n.p); var d = []; for (var t = 1; t < L3.length; t++) d.push(OP.sub(L3[t], L3[t - 1])); return { L: d }; }
      case 'mean': { var L4 = list(ev(0)); if (!L4.length) throw E('INVALID DIM', n.p); var sm = ZERO(); L4.forEach(function (v) { sm = OP.add(sm, v); }); return OP.div(sm, intv(L4.length)); }
      case 'median': { var L5 = list(ev(0)).slice().sort(function (x, y) { return x.f - y.f; }); if (!L5.length) throw E('INVALID DIM', n.p); var mid = L5.length >> 1; return L5.length % 2 ? L5[mid] : OP.div(OP.add(L5[mid - 1], L5[mid]), V(2, [2, 1])); }
    }
    throw E('SYNTAX', n.p);
  };

  /* ---------- Y= functions ---------- */
  C.yAst = function (i, quiet) {
    var t = this.Y[i].line.t; if (!t.length) return null;
    var key = toksText(t) + '\u0001' + t.map(function (x) { return x.k; }).join(',');
    var c = this.astCache[i];
    if (c && c.key === key) { if (c.err && !quiet) throw c.err; return c.err ? null : c.ast; }
    var ast = null, err = null;
    try { var pr = parse(t); if (pr.sto || pr.conv) throw E('SYNTAX', t.length - 1); ast = pr.ast; } catch (e) { if (!e.calc) throw e; err = e; }
    this.astCache[i] = { key: key, ast: ast, err: err };
    if (err && !quiet) throw err;
    return ast;
  };
  /* Y_i(x) as a number (NaN where it's undefined) */
  C.fx = function (i, x) {
    var ast = this.yAst(i, true); if (!ast) return NaN;
    this.depth = 0;
    try { var v = this.ev(ast, { X: V(x) }); return v.L ? NaN : v.f; } catch (e) { if (e.calc) return NaN; throw e; }
  };
  C.active = function () { var out = []; for (var i = 0; i < 6; i++) if (this.Y[i].on && this.Y[i].line.t.length) out.push(i); return out; };
  C.checkFns = function () { // syntax errors in the selected functions stop the graph (Goto opens that line of Y=)
    var act = this.active();
    for (var k = 0; k < act.length; k++) { try { this.yAst(act[k]); } catch (e) { if (!e.calc) throw e; this.fail(e.code, { scr: 'yeq', row: act[k], pos: e.pos }); return false; } }
    return true;
  };
  C.yeqKey = function (a) {
    var Y = this.Y[this.yrow], L = Y.line;
    switch (a) {
      case 'up': this.ins = false; if (this.yrow > 0) { this.yrow--; this.fixYc(L.c); } return;
      case 'down': this.ins = false; if (this.yrow < 5) { this.yrow++; this.fixYc(L.c); } return;
      case 'left': this.ins = false; if (this.ycol === 'expr' && L.c > 0) L.c--; else if (this.ycol === 'expr') this.ycol = 'eq'; else if (this.ycol === 'eq') this.ycol = 'style'; return;
      case 'right': this.ins = false; if (this.ycol === 'style') this.ycol = 'eq'; else if (this.ycol === 'eq') { this.ycol = 'expr'; L.c = 0; } else L.c = Math.min(L.t.length, L.c + 1); return;
      case 'lstart': this.ycol = 'expr'; L.c = 0; return;
      case 'lend': this.ycol = 'expr'; L.c = L.t.length; return;
      case 'enter': this.ins = false;
        if (this.ycol === 'style') { Y.style = (Y.style + 1) % STYLES.length; this.ver++; return; }
        if (this.ycol === 'eq') { Y.on = !Y.on; this.ver++; return; }
        if (this.yrow < 5) { this.yrow++; this.fixYc(L.c); } return;
      case 'clear': L.clear(); this.ycol = 'expr'; this.ver++; return;
      case 'del': if (this.ycol === 'expr') { L.del(); this.ver++; } return;
      case 'ins': this.ins = !this.ins; return;
      case 'on': return;
    }
    var tok = tokFor(a); if (!tok || tok.k === 'sto') return;
    this.ycol = 'expr'; L.put(tok, this.ins); Y.on = true; this.ver++;
  };
  C.fixYc = function (c) { var L = this.Y[this.yrow].line; if (this.ycol === 'expr') L.c = Math.min(L.t.length, c); };

  /* ---------- WINDOW / TBLSET editors: a field takes an expression; typing replaces the old value ---------- */
  C.winVal = function (k) {
    var w = this.win;
    if (k === 'dx') return (w.xmax - w.xmin) / (GW - 1);
    if (k === 'tstep') return w.tstep || 2 * (w.xmax - w.xmin) / (GW - 1);
    return w[k];
  };
  C.evalField = function (toks) {
    var pr = parse(toks); if (!pr || pr.sto || pr.conv) throw E('SYNTAX', toks.length);
    this.depth = 0; var v = scalar(chk(this.ev(pr.ast, null))); return v.f;
  };
  C.fieldKey = function (a, get, setLine, n, rowName, commit) {
    // shared by WINDOW and TBLSET: returns true when the key was used here
    var line = get();
    switch (a) {
      case 'up': case 'down': case 'enter':
        if (line && !commit()) return true;
        var r = this[rowName] + (a === 'up' ? -1 : 1);
        this[rowName] = Math.max(0, Math.min(n - 1, r)); setLine(null); return true;
      case 'left': if (line) line.c = Math.max(0, line.c - 1); return true;
      case 'right': if (line) line.c = Math.min(line.t.length, line.c + 1); return true;
      case 'clear': setLine(new Line()); return true;
      case 'del': if (!line) { line = this.fieldLine(); setLine(line); line.c = 0; } line.del(); return true;
      case 'ins': this.ins = !this.ins; return true;
    }
    var tok = tokFor(a); if (!tok || tok.k === 'sto') return true;
    if (!line) { line = new Line(); setLine(line); } // the first key replaces the value
    line.put(tok, this.ins); return true;
  };
  C.fieldLine = function () { return new Line(strToks(this.scr === 'window' ? fmtNum(this.winVal(WIN_ROWS[this.wrow][0])) : fmtNum(this.trow === 0 ? this.tbl.start : this.tbl.step))); };
  C.winKey = function (a) {
    var self = this;
    this.fieldKey(a, function () { return self.wline; }, function (l) { self.wline = l; }, WIN_ROWS.length, 'wrow', function () { return self.commitWin(); });
  };
  C.commitWin = function () {
    var k = WIN_ROWS[this.wrow][0], L = this.wline; if (!L) return true;
    if (!L.t.length) { this.wline = null; return true; }
    var x;
    try { x = this.evalField(L.t); } catch (e) { if (!e.calc) throw e; this.fail(e.code, { scr: 'window', row: this.wrow }); this.wline = null; return false; }
    var w = this.win;
    if (k === 'dx') { if (x <= 0) { this.fail('DOMAIN', { scr: 'window', row: this.wrow }); this.wline = null; return false; } w.xmax = w.xmin + x * (GW - 1); }
    else if (k === 'tstep') { if (x <= 0) { this.fail('DOMAIN', { scr: 'window', row: this.wrow }); this.wline = null; return false; } w.tstep = x; }
    else if (k === 'xres') { if (!isInt(x) || x < 1 || x > 8) { this.fail('DOMAIN', { scr: 'window', row: this.wrow }); this.wline = null; return false; } w.xres = x; }
    else { w[k] = x; if (k === 'xmin' || k === 'xmax') w.tstep = null; }
    this.wline = null; this.ver++; return true;
  };
  C.tsetKey = function (a) {
    var self = this;
    this.fieldKey(a, function () { return self.tline; }, function (l) { self.tline = l; }, 2, 'trow', function () { return self.commitTset(); });
  };
  C.commitTset = function () {
    var L = this.tline; if (!L) return true;
    if (!L.t.length) { this.tline = null; return true; }
    var x;
    try { x = this.evalField(L.t); } catch (e) { if (!e.calc) throw e; this.fail(e.code, { scr: 'tblset', row: this.trow }); this.tline = null; return false; }
    if (this.trow === 1 && x === 0) { this.fail('DOMAIN', { scr: 'tblset', row: 1 }); this.tline = null; return false; }
    if (this.trow === 0) this.tbl.start = x; else this.tbl.step = x;
    this.tline = null; return true;
  };
  C.leaveEditors = function () { // a field being typed in is saved when you leave the screen
    if (this.scr === 'window' && this.wline) this.commitWin();
    if (this.scr === 'tblset' && this.tline) this.commitTset();
    this.ins = false;
  };

  /* ---------- MODE and FORMAT ---------- */
  C.modeCol = function (r) { var row = MODE_ROWS[r], v = this.mode[row.k]; for (var i = 0; i < row.opts.length; i++) if (row.opts[i][1] === v) return i; return 0; };
  C.fmtCol = function (r) { var row = FORMAT_ROWS[r], v = this.fmt[row.k]; for (var i = 0; i < row.opts.length; i++) if (row.opts[i][1] === v) return i; return 0; };
  function gridKey(a, rows, st, rowK, colK, colFn, apply) {
    var row = rows[st[rowK]];
    switch (a) {
      case 'up': case 'down': st[rowK] = (st[rowK] + (a === 'up' ? rows.length - 1 : 1)) % rows.length; st[colK] = colFn.call(st, st[rowK]); return;
      case 'left': case 'right': {
        var c = st[colK], n = row.opts.length;
        for (var k = 0; k < n; k++) { c = (c + (a === 'left' ? n - 1 : 1)) % n; if (!row.opts[c][2]) break; }
        st[colK] = c; return;
      }
      case 'enter': if (!row.opts[st[colK]][2]) apply(row.k, row.opts[st[colK]][1]); return;
      case 'clear': st.scr = 'home'; return;
    }
  }
  C.modeKey = function (a) { var self = this; gridKey(a, MODE_ROWS, this, 'mrow', 'mcol', this.modeCol, function (k, v) { self.mode[k] = v; self.ver++; }); };
  C.formatKey = function (a) { var self = this; gridKey(a, FORMAT_ROWS, this, 'frow', 'fcol', this.fmtCol, function (k, v) { self.fmt[k] = v; self.ver++; }); };

  /* ---------- menus ---------- */
  C.menuTabs = function () { return MENUS[this.menu.id]; };
  C.closeMenu = function () { var r = this.menu ? this.menu.ret : 'home'; this.menu = null; this.scr = r || 'home'; };
  C.menuKey = function (a) {
    var m = this.menu, tabs = this.menuTabs(), items = tabs[m.tab].items, n = items.length;
    switch (a) {
      case 'up': m.sel = (m.sel + n - 1) % n; return;
      case 'down': m.sel = (m.sel + 1) % n; return;
      case 'left': case 'right': if (tabs.length > 1) { m.tab = (m.tab + (a === 'left' ? tabs.length - 1 : 1)) % tabs.length; m.sel = 0; m.top = 0; } return;
      case 'clear': return this.closeMenu();
      case 'enter': return this.choose(items[m.sel]);
    }
    for (var k = 0; k < n; k++) if (itemNum(k) === a) { m.sel = k; return this.choose(items[k]); }
  };
  C.choose = function (it) {
    var m = this.menu, act = it[1];
    if (act.na) return this.fail('UNAVAILABLE', null, it[0]);
    if (act.sub) { this.menu = { id: act.sub, tab: 0, sel: 0, top: 0, ret: m.ret }; return; }
    if (act.run) { this.menu = null; return this.runItem(act.run, m.ret); }
    var tok = act.paste(); this.closeMenu(); this.pasteTok(tok);
  };
  C.pasteTok = function (tok) { // a menu item typed into whatever editor the menu came from
    switch (this.scr) {
      case 'home': { var L = this.line; if (!L.t.length && ANS_FIRST[tok.k] && !(tok.k === 'op' && tok.o === 'root')) L.put(T.ans()); L.put(tok, this.ins); return; }
      case 'yeq': this.ycol = 'expr'; this.Y[this.yrow].line.put(tok, this.ins); this.Y[this.yrow].on = true; this.ver++; return;
      case 'window': if (!this.wline) this.wline = new Line(); this.wline.put(tok, this.ins); return;
      case 'tblset': if (!this.tline) this.tline = new Line(); this.tline.put(tok, this.ins); return;
    }
    this.scr = 'home'; this.pasteTok(tok);
  };

  /* ---------- window, zooms ---------- */
  C.dX = function () { return (this.win.xmax - this.win.xmin) / (GW - 1); };
  C.dY = function () { return (this.win.ymax - this.win.ymin) / (GH - 1); };
  C.step = function () { return this.win.tstep || 2 * this.dX(); };
  C.px = function (x) { return (x - this.win.xmin) / (this.win.xmax - this.win.xmin) * (GW - 1); };
  C.py = function (y) { return (this.win.ymax - y) / (this.win.ymax - this.win.ymin) * (GH - 1); };
  C.setWin = function (o) { this.zprev = Object.assign({}, this.win); Object.assign(this.win, o); this.win.tstep = null; this.ver++; };
  C.winOK = function () { var w = this.win; if (!(w.xmin < w.xmax) || !(w.ymin < w.ymax)) { this.fail('WINDOW RANGE', { scr: 'window', row: !(w.xmin < w.xmax) ? 0 : 3 }); return false; } return true; };
  C.runItem = function (r, ret) {
    var w = this.win, self = this;
    var zoom = function (o) { self.setWin(o); self.showGraph(); };
    switch (r) {
      case 'zstd': return zoom({ xmin: -10, xmax: 10, xscl: 1, ymin: -10, ymax: 10, yscl: 1 });
      case 'zdec': return zoom({ xmin: -6.6, xmax: 6.6, xscl: 1, ymin: -4.1, ymax: 4.1, yscl: 1 });
      case 'zq1': return zoom({ xmin: 0, xmax: 13.2, xscl: 1, ymin: 0, ymax: 8.2, yscl: 1 });
      case 'zint': return zoom({ xmin: -132, xmax: 132, xscl: 10, ymin: -82, ymax: 82, yscl: 10 });
      case 'ztrig': return zoom(this.mode.angle === 'DEG' ? { xmin: -352.5, xmax: 352.5, xscl: 90, ymin: -4, ymax: 4, yscl: 1 } : { xmin: -47 * Math.PI / 24, xmax: 47 * Math.PI / 24, xscl: Math.PI / 2, ymin: -4, ymax: 4, yscl: 1 });
      case 'zsq': {
        var dx = this.dX(), dy = this.dY(), xc = (w.xmin + w.xmax) / 2, yc = (w.ymin + w.ymax) / 2;
        if (dx > dy) return zoom({ ymin: yc - dx * (GH - 1) / 2, ymax: yc + dx * (GH - 1) / 2 });
        return zoom({ xmin: xc - dy * (GW - 1) / 2, xmax: xc + dy * (GW - 1) / 2 });
      }
      case 'zfit': {
        var lo = Infinity, hi = -Infinity, act = this.active();
        if (!this.checkFns()) return;
        act.forEach(function (i) { for (var c = 0; c < GW; c++) { var y = self.fx(i, w.xmin + c * self.dX()); if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); } } });
        if (!isFinite(lo)) return this.showGraph();
        if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
        return zoom({ ymin: lo, ymax: hi });
      }
      case 'zprev': if (this.zprev) { var p = this.zprev; this.zprev = Object.assign({}, w); Object.assign(w, p); this.ver++; } return this.showGraph();
      case 'zsto': this.zsave = Object.assign({}, w); return this.showGraph();
      case 'zrcl': if (this.zsave) this.setWin(this.zsave); return this.showGraph();
      case 'zbox': case 'zin': case 'zout':
        if (!this.showGraph()) return;
        this.g = { mode: r, cx: Math.round((GW - 1) / 2), cy: Math.round((GH - 1) / 2), stage: 0 }; return;
      case 'cvalue': case 'czero': case 'cmin': case 'cmax': case 'cint': case 'cdydx': return this.startCalc(r);
    }
  };

  /* ---------- the graph screen ---------- */
  C.showGraph = function () {
    if (!this.winOK() || !this.checkFns()) return false;
    this.scr = 'graph'; this.menu = null; this.g = { mode: 'none' }; return true;
  };
  C.firstFn = function () { var a = this.active(); return a.length ? a[0] : -1; };
  C.mid = function () { return r14(this.win.xmin + Math.round((GW - 1) / 2) * this.dX()); };
  C.startTrace = function (kind) {
    var fi = this.g && this.g.fi != null && this.Y[this.g.fi].on && this.Y[this.g.fi].line.t.length ? this.g.fi : this.firstFn();
    var x = this.g && this.g.x != null && this.g.x >= this.win.xmin && this.g.x <= this.win.xmax ? this.g.x : this.mid();
    this.g = { mode: kind || 'trace', fi: fi, x: x, inp: null };
    if (fi < 0) this.g.mode = 'free', this.g.cx = Math.round((GW - 1) / 2), this.g.cy = Math.round((GH - 1) / 2);
  };
  C.startCalc = function (r) {
    if (!this.showGraph()) return;
    var act = this.active(), kind = { cvalue: 'value', czero: 'zero', cmin: 'min', cmax: 'max', cint: 'int', cdydx: 'dydx' }[r];
    if (!act.length || (kind === 'int' && act.length < 2)) { this.fail('INVALID'); return; }
    this.g = { mode: 'calc', kind: kind, fi: act[0], x: this.mid(), stage: kind === 'int' ? 'first' : kind === 'value' ? 'value' : kind === 'dydx' ? 'dydx' : 'left', inp: kind === 'value' ? new Line() : null };
  };
  C.moveFn = function (d) { var act = this.active(); if (!act.length) return; var k = act.indexOf(this.g.fi); this.g.fi = act[(k + (d > 0 ? 1 : act.length - 1) + act.length) % act.length]; this.g.res = null; };
  C.moveX = function (d) {
    var g = this.g, w = this.win, st = this.step();
    g.x = r14(g.x + d * st); g.res = null;
    if (g.x > w.xmax || g.x < w.xmin) { var sh = (w.xmax - w.xmin) / 2 * (d > 0 ? 1 : -1); w.xmin = r14(w.xmin + sh); w.xmax = r14(w.xmax + sh); this.ver++; }
  };
  C.graphKey = function (a) {
    var g = this.g, self = this;
    // typing an X value (trace, CALC prompts)
    if (g.inp) {
      if (a === 'enter') {
        var x; try { x = this.evalField(g.inp.t); } catch (e) { if (!e.calc) throw e; this.fail(e.code); return; }
        if (x < this.win.xmin || x > this.win.xmax) { this.fail('INVALID'); return; }
        g.x = x; g.inp = null; g.res = null;
        if (g.mode === 'calc' && g.stage === 'value') { g.res = { label: '' }; g.stage = 'value'; return; }
        if (g.mode === 'calc') return this.calcEnter();
        return;
      }
      if (a === 'clear') { if (g.inp.t.length) g.inp.clear(); else g.inp = null; return; }
      if (a === 'del') { g.inp.del(); return; }
      if (a === 'left') { g.inp.c = Math.max(0, g.inp.c - 1); return; }
      if (a === 'right') { g.inp.c = Math.min(g.inp.t.length, g.inp.c + 1); return; }
      var tk = tokFor(a); if (tk && tk.k !== 'sto') g.inp.put(tk, this.ins); return;
    }
    if (a === 'clear') { if (g.mode !== 'none') { this.g = { mode: 'none', fi: g.fi, x: g.x }; return; } this.scr = 'home'; this.g = { mode: 'none' }; return; }
    var typing = /^[0-9.]$/.test(a) || a === 'neg' || a === 'pi';
    if (g.mode === 'none' || g.mode === 'free') {
      if (/^(up|down|left|right)$/.test(a)) { if (g.mode === 'none') { this.g = { mode: 'free', cx: Math.round((GW - 1) / 2), cy: Math.round((GH - 1) / 2) }; } return this.moveCur(a); }
      if (a === 'enter') return;
      if (tokFor(a)) { this.scr = 'home'; this.g = { mode: 'none' }; return this.homeKey(a); } // typing on the graph goes to the home screen
      return;
    }
    if (g.mode === 'zbox' || g.mode === 'zin' || g.mode === 'zout') {
      if (/^(up|down|left|right)$/.test(a)) return this.moveCur(a);
      if (a !== 'enter') return;
      var cx = this.win.xmin + g.cx * this.dX(), cy = this.win.ymax - g.cy * this.dY();
      if (g.mode === 'zbox') {
        if (g.stage === 0) { g.stage = 1; g.bx = g.cx; g.by = g.cy; return; }
        if (g.cx === g.bx || g.cy === g.by) return;
        var x0 = this.win.xmin + g.bx * this.dX(), y0 = this.win.ymax - g.by * this.dY();
        this.setWin({ xmin: Math.min(x0, cx), xmax: Math.max(x0, cx), ymin: Math.min(y0, cy), ymax: Math.max(y0, cy) });
        this.g = { mode: 'none' }; return;
      }
      var f = g.mode === 'zin' ? 1 / 4 : 4, hw = (this.win.xmax - this.win.xmin) / 2 * f, hh = (this.win.ymax - this.win.ymin) / 2 * f;
      this.setWin({ xmin: r14(cx - hw), xmax: r14(cx + hw), ymin: r14(cy - hh), ymax: r14(cy + hh) });
      g.cx = Math.round((GW - 1) / 2); g.cy = Math.round((GH - 1) / 2); return;
    }
    // trace and CALC
    if (typing) { if (g.mode === 'calc' && (g.stage === 'done' || g.stage === 'dydx')) g.mode = 'trace'; g.inp = new Line(); g.res = null; return this.graphKey(a); }
    switch (a) {
      case 'left': case 'right':
        if (g.mode === 'calc' && g.stage === 'done') { g.mode = 'trace'; }
        if (g.mode === 'calc' && g.stage === 'value') return;
        return this.moveX(a === 'right' ? 1 : -1);
      case 'up': case 'down':
        if (g.mode === 'calc' && g.stage === 'second') { this.moveFn(a === 'up' ? -1 : 1); if (g.fi === g.f1) this.moveFn(a === 'up' ? -1 : 1); return; }
        if (g.mode === 'calc' && g.stage === 'done') g.mode = 'trace';
        if (g.mode === 'calc' && g.stage === 'value') { this.moveFn(a === 'up' ? -1 : 1); g.res = { label: '' }; return; }
        return this.moveFn(a === 'up' ? -1 : 1);
      case 'enter':
        if (g.mode === 'trace') { // QuickZoom: the window moves so the cursor is in the middle
          var w = this.win, hw2 = (w.xmax - w.xmin) / 2, y = this.fx(g.fi, g.x), hh2 = (w.ymax - w.ymin) / 2;
          this.setWin({ xmin: r14(g.x - hw2), xmax: r14(g.x + hw2), ymin: isFinite(y) ? r14(y - hh2) : w.ymin, ymax: isFinite(y) ? r14(y + hh2) : w.ymax });
          return;
        }
        if (g.mode === 'calc') return this.calcEnter();
        return;
    }
  };
  C.moveCur = function (a) {
    var g = this.g;
    if (a === 'left') g.cx = Math.max(0, g.cx - 1); else if (a === 'right') g.cx = Math.min(GW - 1, g.cx + 1);
    else if (a === 'up') g.cy = Math.max(0, g.cy - 1); else g.cy = Math.min(GH - 1, g.cy + 1);
  };
  C.calcEnter = function () {
    var g = this.g, k = g.kind;
    try {
      if (k === 'value') { g.inp = new Line(); return; }
      if (k === 'dydx') { var h = 1e-3, d = (this.fx(g.fi, g.x + h) - this.fx(g.fi, g.x - h)) / (2 * h); g.res = { label: '', dydx: isFinite(d) ? r14(d) : NaN }; g.stage = 'done'; return; }
      if (k === 'int') {
        if (g.stage === 'first') { g.f1 = g.fi; g.stage = 'second'; this.moveFn(1); return; }
        if (g.stage === 'second') { g.f2 = g.fi; g.stage = 'guess'; return; }
        if (g.stage === 'guess') { var r = this.intersect(g.f1, g.f2, g.x); g.x = r.x; g.fi = g.f1; this.setXY(r.x, r.y); g.res = { label: 'Intersection', y: r.y }; g.stage = 'done'; return; }
      }
      if (g.stage === 'left') { g.L = g.x; g.stage = 'right'; return; }
      if (g.stage === 'right') { if (g.x < g.L) throw E('BOUND'); g.R = g.x; g.stage = 'guess'; return; }
      if (g.stage === 'guess') {
        var G = Math.max(g.L, Math.min(g.R, g.x)), x;
        if (k === 'zero') x = this.zero(g.fi, g.L, g.R, G); else x = this.extremum(g.fi, g.L, g.R, G, k === 'max');
        var y = this.fx(g.fi, x); if (k === 'zero' || Math.abs(y) < 1e-12) y = k === 'zero' ? 0 : y;
        g.x = x; this.setXY(x, y); g.res = { label: k === 'zero' ? 'Zero' : k === 'min' ? 'Minimum' : 'Maximum', y: r14(y) }; g.stage = 'done'; return;
      }
    } catch (e) { if (!e.calc) throw e; this.fail(e.code); }
  };
  C.setXY = function (x, y) { this.vars.X = V(x); this.vars.Y = V(y); };

  /* ---------- CALC: zero, minimum / maximum, intersect ---------- */
  function bisect(f, a, b, fa) {
    for (var k = 0; k < 200; k++) {
      var m = (a + b) / 2; if (m === a || m === b) break;
      var fm = f(m); if (fm === 0) return m;
      if ((fm < 0) === (fa < 0)) { a = m; fa = fm; } else b = m;
    }
    return (a + b) / 2;
  }
  function nice(f, x, better) { var r = Number(x.toPrecision(10)); return better(f(r), f(x)) ? r : x; }
  /* every crossing of f in [L, R] (sign changes, not poles), nearest the guess first */
  function crossings(f, L, R, N) {
    var out = [], x0 = L, f0 = f(L);
    for (var k = 1; k <= N; k++) {
      var x1 = L + (R - L) * k / N, f1 = f(x1);
      if (f0 === 0) out.push(x0);
      else if (isFinite(f0) && isFinite(f1) && f1 !== 0 && (f0 < 0) !== (f1 < 0)) {
        var r = bisect(f, x0, x1, f0), fr = f(r);
        if (isFinite(fr) && Math.abs(fr) < 1e-6 * Math.max(1, Math.abs(f0) + Math.abs(f1))) out.push(r);
      }
      x0 = x1; f0 = f1;
    }
    if (f0 === 0) out.push(x0);
    return out;
  }
  C.zero = function (i, L, R, G) {
    var self = this, f = function (x) { return self.fx(i, x); };
    var c = crossings(f, L, R, 400);
    if (!c.length) throw E('NO SIGN CHANGE');
    c.sort(function (a, b) { return Math.abs(a - G) - Math.abs(b - G); });
    return nice(f, c[0], function (a, b) { return Math.abs(a) <= Math.abs(b); });
  };
  C.extremum = function (i, L, R, G, max) {
    var self = this, s = max ? -1 : 1, f = function (x) { var y = self.fx(i, x); return isFinite(y) ? s * y : Infinity; };
    var N = 400, best = -1, bv = Infinity;
    for (var k = 0; k <= N; k++) { var v = f(L + (R - L) * k / N); if (v < bv) { bv = v; best = k; } }
    if (best < 0) throw E('NO SIGN CHANGE');
    var a = L + (R - L) * Math.max(0, best - 1) / N, b = L + (R - L) * Math.min(N, best + 1) / N, gr = (Math.sqrt(5) - 1) / 2;
    var c = b - gr * (b - a), d = a + gr * (b - a), fc = f(c), fd = f(d);
    for (var n = 0; n < 200 && b - a > 1e-15 * Math.max(1, Math.abs(a)); n++) { if (fc < fd) { b = d; d = c; fd = fc; c = b - gr * (b - a); fc = f(c); } else { a = c; c = d; fc = fd; d = a + gr * (b - a); fd = f(d); } }
    var x = (a + b) / 2, h = Math.max(1e-4, 1e-4 * Math.abs(x)), f0 = f(x - h), f1 = f(x), f2 = f(x + h), den = f0 - 2 * f1 + f2;
    if (den > 0 && isFinite(den)) { var xv = x + h * (f0 - f2) / (2 * den); if (Math.abs(xv - x) < h && xv >= L && xv <= R && f(xv) <= f1 + 1e-12 * Math.max(1, Math.abs(f1))) x = xv; }
    if (x <= L + 1e-12 * Math.max(1, Math.abs(L)) || x >= R - 1e-12 * Math.max(1, Math.abs(R))) { /* the edge of the bounds: that is what the TI-84 gives too */ }
    return nice(f, x, function (p, q) { return p <= q; });
  };
  C.intersect = function (i, j, G) {
    var self = this, h = function (x) { return self.fx(i, x) - self.fx(j, x); }, w = this.win;
    var c = crossings(h, w.xmin, w.xmax, 528);
    if (!c.length) { // touching (no sign change): Newton from the guess
      var x = G;
      for (var k = 0; k < 60; k++) { var hx = h(x), d = (h(x + 1e-6) - h(x - 1e-6)) / 2e-6; if (!isFinite(hx) || !d) break; var nx = x - hx / d; if (Math.abs(nx - x) < 1e-13) { x = nx; break; } x = nx; }
      if (isFinite(h(x)) && Math.abs(h(x)) < 1e-9) c = [x];
    }
    if (!c.length) throw E('NO SIGN CHANGE');
    c.sort(function (a, b) { return Math.abs(a - G) - Math.abs(b - G); });
    var r = nice(h, c[0], function (a, b) { return Math.abs(a) <= Math.abs(b); });
    return { x: r, y: r14(this.fx(i, r)) };
  };

  /* ---------- plotting: the pixels of each graph, broken at asymptotes ---------- */
  C.plotSig = function () { var self = this; return JSON.stringify([this.win, this.mode.angle, this.ver, this.Y.map(function (y) { return [toksText(y.line.t), y.on, y.style]; }), this.active().map(function (i) { return self.astCache[i] && self.astCache[i].key; })]); };
  C.plot = function () {
    var sig = this.plotSig(); if (this._plot && this._plot.sig === sig) return this._plot.out;
    var self = this, w = this.win, dX = this.dX(), out = [];
    this.active().forEach(function (i) {
      var f = function (x) { return self.fx(i, x); }, segs = [], seg = null, cols = [], px = -1, py0 = 0, x0 = 0, y0 = 0;
      var P = function (y) { return self.py(y); };
      var conn = function (xa, ya, xb, yb, depth) {
        var pa = P(ya), pb = P(yb);
        if (Math.abs(pa - pb) <= 2) return true;
        // both points off the same side of the screen: nothing to draw, nothing to break
        if ((pa < -GH && pb < -GH) || (pa > 2 * GH && pb > 2 * GH)) return Math.abs(pa - pb) < 50 * GH;
        if (depth === 0) return Math.abs(pa - pb) < GH;
        var xm = (xa + xb) / 2, ym = f(xm); if (!isFinite(ym)) return false;
        var pm = P(ym), d = Math.abs(pa - pb);
        if (d < GH && pm >= Math.min(pa, pb) - 1 && pm <= Math.max(pa, pb) + 1) return true; // steep but steady
        return conn(xa, ya, xm, ym, depth - 1) && conn(xm, ym, xb, yb, depth - 1);
      };
      for (var c = 0; c < GW; c++) {
        var x = w.xmin + c * dX, y = f(x);
        if (!isFinite(y)) { seg = null; cols.push(null); continue; }
        var p = P(y); cols.push(p);
        if (seg && c === px + 1 && conn(x0, y0, x, y, 7)) seg.push([c, p]);
        else { seg = [[c, p]]; segs.push(seg); }
        px = c; x0 = x; y0 = y;
      }
      out.push({ i: i, color: COLORS[self.Y[i].color], style: STYLES[self.Y[i].style], segs: segs, cols: cols });
    });
    this._plot = { sig: sig, out: out };
    return out;
  };
  /* the table's rows: [x, [y per function]] */
  C.tableRow = function (x) { var self = this; return this.active().map(function (i) { return self.fx(i, x); }); };
  C.tableX = function (r) { return r14(this.tb.top + r * this.tbl.step); };
  C.showTable = function () {
    if (!this.checkFns()) return;
    if (this.scr !== 'table') this.tb = { top: this.tbl.start, row: 0, col: 0, c0: 0, inp: null };
    this.scr = 'table'; this.menu = null;
  };
  C.TROWS = 9;
  C.tableKey = function (a) {
    var tb = this.tb, ncol = this.active().length + 1;
    if (tb.inp) {
      if (a === 'enter') { var x; try { x = this.evalField(tb.inp.t); } catch (e) { if (!e.calc) throw e; this.fail(e.code); return; } tb.top = x; tb.row = 0; tb.inp = null; return; }
      if (a === 'clear') { tb.inp = null; return; }
      if (a === 'del') { tb.inp.del(); return; }
      var tk0 = tokFor(a); if (tk0 && tk0.k !== 'sto') tb.inp.put(tk0); return;
    }
    switch (a) {
      case 'up': if (tb.row > 0) tb.row--; else tb.top = r14(tb.top - this.tbl.step); return;
      case 'down': if (tb.row < this.TROWS - 1) tb.row++; else tb.top = r14(tb.top + this.tbl.step); return;
      case 'left': if (tb.col > 0) tb.col--; if (tb.col > 0 && tb.col <= tb.c0) tb.c0 = tb.col - 1; return;
      case 'right': if (tb.col < ncol - 1) tb.col++; if (tb.col - tb.c0 > 3) tb.c0 = tb.col - 3; return;
      case 'clear': this.scr = 'home'; return;
      case 'enter': return;
    }
    if (tb.col === 0 && (/^[0-9.]$/.test(a) || a === 'neg')) { tb.inp = new Line(); tb.inp.put(tokFor(a)); }
  };

  /* ======================= the floating window ======================= */
  var CSS = [
    '.calc.c84{width:auto;height:auto;padding:0;background:none;box-shadow:none;border-radius:0;right:16px;bottom:16px;color:#fff;touch-action:none;outline:none}',
    '.calc.c84.hidden{display:none!important}',
    '.c84-in{transform-origin:0 0;width:352px;box-sizing:border-box;background:linear-gradient(180deg,#3a3f47,#24282e 30%,#202328);border-radius:26px 26px 40px 40px;padding:6px 12px 16px;box-shadow:0 18px 44px rgba(10,15,25,.4),inset 0 1px 0 rgba(255,255,255,.1);font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;position:relative}',
    '.c84 .calc-head{display:flex;align-items:center;gap:6px;cursor:move;padding:2px 2px 6px;touch-action:none}',
    '.c84-brand{font:800 12px/1 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;letter-spacing:.04em;color:#e9edf3;white-space:nowrap}.c84-brand b{color:#5fb6ee}.c84-brand em{font-style:normal;font-weight:500;color:#9aa3b0;letter-spacing:0;margin-left:3px}',
    '.c84 .calc-head .c84-sp{flex:1}',
    '.c84 .c84-hbtn,.c84 .calc-close,.c84 .calc-size{border:none;background:rgba(255,255,255,.1);color:#e3e8ef;height:26px;min-width:26px;padding:0 8px;border-radius:13px;cursor:pointer;font:700 12px system-ui,-apple-system,Arial,sans-serif;line-height:26px}',
    '.c84 .calc-close{font-size:17px;padding:0;width:26px}',
    '.c84 .c84-hbtn:hover,.c84 .calc-close:hover,.c84 .calc-size:hover{background:rgba(255,255,255,.2)}.c84 .c84-hbtn.on{background:#5fb6ee;color:#0d2233}',
    '.c84 .calc-head .calc-tools{display:flex;gap:6px;margin:0}',
    '.c84-body{display:flex;flex-direction:column;gap:10px}',
    '.c84.wide .c84-in{width:max-content}.c84.wide .c84-body{flex-direction:row;align-items:flex-start;gap:14px}',
    '.c84-bez{background:#14161a;border-radius:10px;padding:4px;box-shadow:inset 0 2px 5px rgba(0,0,0,.6);width:328px;height:248px;box-sizing:border-box;overflow:hidden}',
    '.c84.wide .c84-bez{width:408px;height:308px}.c84.wide .c84-scr{transform:scale(1.25);transform-origin:0 0}',
    '.c84 .calc-screen.c84-scr{position:relative;width:320px;height:240px;margin:0;padding:0;border-radius:3px;background:#fff;color:#111;box-shadow:none;display:block;overflow:hidden;font:600 17px/22px ui-monospace,"SF Mono",Menlo,Consolas,"DejaVu Sans Mono","Liberation Mono",monospace;letter-spacing:.2px}',
    '.c84-st{position:absolute;left:0;right:0;top:0;height:18px;background:#e4e7ec;border-bottom:1px solid #b9bfc8;font:700 10.5px/18px system-ui,-apple-system,Arial,sans-serif;color:#2b3340;padding:0 6px;white-space:nowrap;display:flex;gap:5px;letter-spacing:.02em}',
    '.c84-st .sp{flex:1}.c84-st .b2{background:#2b8fd0;color:#fff;border-radius:3px;padding:0 4px;line-height:14px;margin-top:2px}.c84-st .ba{background:#3d9a33;color:#fff;border-radius:3px;padding:0 4px;line-height:14px;margin-top:2px}',
    '.c84-st .bat{width:16px;height:8px;border:1.5px solid #2b3340;border-radius:2px;margin-top:4px;position:relative;box-sizing:border-box}.c84-st .bat:after{content:"";position:absolute;left:1px;top:1px;bottom:1px;width:9px;background:#3d9a33}',
    '.c84-hint{position:absolute;left:0;right:0;top:19px;height:16px;font:700 10px/16px system-ui,-apple-system,Arial,sans-serif;color:#fff;background:#3c4452;padding:0 6px;white-space:nowrap;overflow:hidden}',
    '.c84-tx{position:absolute;left:0;right:0;top:19px;bottom:0;padding:1px 4px 0;overflow:hidden}',
    '.c84-tx.hh{top:35px}',
    '.c84-hist{position:absolute;left:4px;right:4px;top:1px;bottom:0;overflow:hidden}',
    '.c84-l{white-space:pre-wrap;word-break:break-all;min-height:22px}.c84-l.o{text-align:right}',
    '.c84-l.sel>span.t{background:#2b8fd0;color:#fff}',
    '.c84-cur{background:#111;color:#fff;animation:c84b 1s steps(1) infinite}.c84-cur.ins{background:none;color:inherit;border-bottom:3px solid #111}.c84-cur.s2{background:#2b8fd0}.c84-cur.al{background:#3d9a33}',
    '@keyframes c84b{50%{background:transparent;color:inherit}}',
    '.c84-ee{font-size:.78em;vertical-align:.08em}',
    '.c84-tabs{white-space:nowrap}.c84-tabs span{padding:0 3px;margin-right:4px}.c84-tabs span.on{background:#111;color:#fff}',
    '.c84-mi{white-space:nowrap;overflow:hidden}.c84-mi .n.on{background:#111;color:#fff}.c84-mi.dim{color:#9aa1ab}',
    '.c84-err-h{background:#c3202b;color:#fff;padding:0 4px;margin:0 -4px 4px}',
    '.c84-err-m{font:600 12.5px/16px system-ui,-apple-system,Arial,sans-serif;color:#3a4250;margin-top:8px;white-space:normal}',
    '.c84-mode .o{padding:0 2px}.c84-mode .o.on{background:#111;color:#fff}.c84-mode .o.dis{color:#a7adb6}.c84-mode .o.cur{outline:2px solid #2b8fd0;outline-offset:-1px;animation:c84o 1s steps(1) infinite}',
    '@keyframes c84o{50%{outline-color:transparent}}',
    '.c84-mode .row{white-space:nowrap;font-size:15px;line-height:21px}',
    '.c84-y{display:flex;align-items:flex-start;min-height:22px}.c84-y .ic{width:16px;flex:0 0 16px;height:22px;display:flex;align-items:center;justify-content:center}.c84-y .ic.cur{outline:2px solid #2b8fd0;outline-offset:-2px;animation:c84o 1s steps(1) infinite}',
    '.c84-y .nm{white-space:nowrap}.c84-y .eq{padding:0 1px}.c84-y .eq.on{color:#fff}.c84-y .eq.cur{outline:2px solid #2b8fd0;outline-offset:-2px}',
    '.c84-y .ex{flex:1;white-space:pre-wrap;word-break:break-all}',
    '.c84-plots{font-size:14px;color:#6f7782;line-height:20px}',
    '.c84-w .h{font-size:15px}.c84-w .r{white-space:nowrap;overflow:hidden;line-height:21px}',
    '.c84-gw{position:absolute;left:27px;top:47px;width:265px;height:165px;outline:1px solid #9aa3b0}',
    '.c84-gw canvas{width:265px;height:165px;display:block}',
    '.c84-gt{position:absolute;left:0;top:0;right:0;bottom:0;font:700 13px/16px ui-monospace,"SF Mono",Menlo,Consolas,monospace;pointer-events:none}',
    '.c84-gt .top{position:absolute;left:2px;top:1px;background:rgba(255,255,255,.85);padding:0 2px;white-space:nowrap}',
    '.c84-gt .bot{position:absolute;left:2px;right:2px;bottom:1px}',
    '.c84-gt .bot div{background:rgba(255,255,255,.85);display:inline-block;padding:0 2px;white-space:nowrap}',
    '.c84-gt .xy{display:flex!important;justify-content:space-between;background:rgba(255,255,255,.85)}',
    '.c84-tbl{position:absolute;left:4px;right:4px;top:37px;font-size:13.5px;line-height:17px}',
    '.c84-tbl table{border-collapse:collapse;width:100%;table-layout:fixed}.c84-tbl td,.c84-tbl th{border:1px solid #b5bcc6;text-align:right;padding:0 3px;height:17px;white-space:nowrap;overflow:hidden;font-weight:600}',
    '.c84-tbl th{text-align:center;background:#eef1f5}.c84-tbl td.on{background:#2b8fd0;color:#fff}',
    '.c84-tbl .bl{margin-top:3px;white-space:nowrap;overflow:hidden}',
    '.c84-off{position:absolute;inset:0;background:#0d0f12}',
    /* keys */
    '.c84-pad{width:328px;display:grid;grid-template-columns:repeat(5,1fr);column-gap:7px;row-gap:1px}',
    '.c84-kc{display:flex;flex-direction:column;align-items:stretch}',
    '.c84-kl{height:12px;display:flex;justify-content:space-between;font:700 8.6px/12px system-ui,-apple-system,Arial,sans-serif;white-space:nowrap;padding:0 1px;letter-spacing:-.01em}',
    '.c84-kl .l2{color:#62bdf2}.c84-kl .la{color:#86d465}.c84-kl sup{font-size:6.5px;line-height:0}',
    '.c84-k{height:26px;border:none;border-radius:7px;background:#16181c;color:#f2f4f7;font:700 13px/1 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;cursor:pointer;padding:0;box-shadow:0 2px 0 #000,inset 0 1px 0 rgba(255,255,255,.12);touch-action:manipulation}',
    '.c84-k sup{font-size:8.5px;line-height:0}.c84-k i{font-style:italic}',
    '.c84-k.num{background:#e8eaed;color:#15171a;font-size:16px;box-shadow:0 2px 0 #7d838c,inset 0 1px 0 #fff}',
    '.c84-k.op{font-size:16px}.c84-k.sm{font-size:10.5px}',
    '.c84-k.top{height:20px;border-radius:5px;background:#d7dbe0;color:#1b1e22;font-size:11.5px;box-shadow:0 2px 0 #6f757d}',
    '.c84-k.k2nd{background:#3d9ad8;color:#fff}.c84-k.kalpha{background:#4ea844;color:#fff}',
    '.c84-k:hover{filter:brightness(1.12)}.c84-k.down,.c84-k:active{transform:translateY(1.5px);box-shadow:none}',
    '.c84-k.demo,.c84-ar.demo{outline:3px solid #ffd84a;outline-offset:2px;filter:brightness(1.3);transform:translateY(1.5px) scale(1.06)}',
    '.c84-dp{grid-column:4/6;grid-row:2/4;display:flex;align-items:center;justify-content:center}',
    '.c84-ring{position:relative;width:96px;height:72px}',
    '.c84-ar{position:absolute;border:none;background:#16181c;color:#e9edf3;cursor:pointer;padding:0;font-size:11px;box-shadow:0 2px 0 #000,inset 0 1px 0 rgba(255,255,255,.12);touch-action:manipulation}',
    '.c84-ar.up{left:30px;top:0;width:36px;height:22px;border-radius:12px 12px 4px 4px}.c84-ar.down{left:30px;bottom:0;width:36px;height:22px;border-radius:4px 4px 12px 12px}',
    '.c84-ar.left{left:0;top:22px;width:30px;height:28px;border-radius:12px 4px 4px 12px}.c84-ar.right{right:0;top:22px;width:30px;height:28px;border-radius:4px 12px 12px 4px}',
    '.c84-ar:active,.c84-ar.down2{transform:translateY(1px);box-shadow:none}',
    '.c84-help{position:absolute;left:10px;right:10px;bottom:14px;top:40px;background:#f7f8fa;color:#1d232c;border-radius:14px;padding:12px 14px;font:500 13px/1.42 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;overflow:auto;box-shadow:0 8px 24px rgba(0,0,0,.4);z-index:2}',
    '.c84-help h4{margin:0 0 6px;font-size:14px}.c84-help ul{margin:0 0 8px;padding-left:18px}.c84-help li{margin:2px 0}.c84-help kbd{font:700 11px system-ui,Arial,sans-serif;background:#23272e;color:#fff;border-radius:4px;padding:1px 4px}.c84-help kbd.b{background:#3d9ad8}',
    '.c84-help .casio{background:#fff3cd;border-radius:8px;padding:6px 8px;margin-top:6px}',
    '.c84 .calc-demo-cap{position:absolute;left:0;right:0;top:auto;bottom:calc(100% + 6px);text-align:center;pointer-events:none}',
    '.c84 .calc-demo-cap span{display:inline-block;max-width:100%;white-space:normal;background:#1c2230;color:#ffd84a;font:700 15px/1.35 system-ui,-apple-system,Arial,sans-serif;padding:5px 12px;border-radius:14px;box-shadow:0 4px 12px rgba(0,0,0,.25)}',
    '.c84 .calc-demo-cap u{color:#fff;text-decoration-thickness:2px}'
  ].join('\n');

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function nhtml(s) { return esc(s).replace(/ᴇ/g, '<span class="c84-ee">E</span>'); }
  var STYLE_IC = {
    thick: '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 12L12 2" stroke="@" stroke-width="3" stroke-linecap="round"/></svg>',
    thin: '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 12L12 2" stroke="@" stroke-width="1.3"/></svg>',
    above: '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 13L13 1V1H1z" fill="@" opacity=".45"/><path d="M1 13L13 1" stroke="@" stroke-width="2"/></svg>',
    below: '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 13L13 1V13z" fill="@" opacity=".45"/><path d="M1 13L13 1" stroke="@" stroke-width="2"/></svg>',
    dot: '<svg width="14" height="14" viewBox="0 0 14 14"><g fill="@"><circle cx="3" cy="11" r="1.4"/><circle cx="7" cy="7" r="1.4"/><circle cx="11" cy="3" r="1.4"/></g></svg>'
  };

  /* ---------- screen HTML (the engine's state drawn as text; the graph is a canvas) ---------- */
  C.lineHTML = function (L, active) {
    var h = '', t = L.t, cls = 'c84-cur' + (this.ins ? ' ins' : '') + (this.second ? ' s2' : this.alpha ? ' al' : '');
    var mark = this.second ? '↑' : this.alpha ? 'A' : ' ';
    for (var i = 0; i <= t.length; i++) {
      if (active && i === L.c) h += '<span class="' + cls + '">' + (t[i] && !this.ins && !this.second && !this.alpha ? nhtml(t[i].s) : esc(mark)) + '</span>' + (t[i] && (this.ins || this.second || this.alpha) ? nhtml(t[i].s) : '');
      else if (t[i]) h += nhtml(t[i].s);
    }
    return h;
  };
  C.status = function () {
    var m = this.mode;
    return '<div class="c84-st"><span>' + m.note + '</span> <span>' + (m.fix < 0 ? 'FLOAT' : 'FIX' + m.fix) + '</span> <span>' + m.answers + '</span> <span>REAL</span> <span>' + (m.angle === 'DEG' ? 'DEGREE' : 'RADIAN') + '</span> <span>CL</span><span class="sp"></span>' +
      (this.second ? '<span class="b2">2ND</span>' : this.alpha ? '<span class="ba">' + (this.alock ? 'A-LOCK' : 'ALPHA') + '</span>' : '') + '<span class="bat"></span></div>';
  };
  C.html = function () {
    if (!this.on) return '<div class="c84-off"></div>';
    var s = this.status(), self = this;
    switch (this.scr) {
      case 'error': {
        var e = this.err, opts = e.back ? ['Quit', 'Goto'] : ['Quit'];
        return s + '<div class="c84-tx"><div class="c84-err-h">ERROR: ' + esc(e.code) + '</div>' + opts.map(function (o, k) { return '<div class="c84-mi"><span class="n' + (k === e.sel ? ' on' : '') + '">' + (k + 1) + ':</span>' + o + '</div>'; }).join('') +
          '<div class="c84-err-m">' + nhtml(e.code === 'UNAVAILABLE' && e.detail ? e.detail + ' isn’t on this on-screen calculator: it has only the features Math 20-1 uses.' : ERR_TEXT[e.code] || '') + '</div></div>';
      }
      case 'menu': {
        var m = this.menu, tabs = this.menuTabs(), items = tabs[m.tab].items, ROWS = 8;
        if (m.sel < m.top) m.top = m.sel; if (m.sel >= m.top + ROWS) m.top = m.sel - ROWS + 1;
        var hh = '<div class="c84-tabs">' + tabs.map(function (t, k) { return '<span' + (k === m.tab ? ' class="on"' : '') + '>' + esc(t.n) + '</span>'; }).join('') + '</div>';
        for (var k = m.top; k < Math.min(items.length, m.top + ROWS); k++) {
          var more = (k === m.top + ROWS - 1 && k < items.length - 1) ? '↓' : (k === m.top && m.top > 0) ? '↑' : ':';
          hh += '<div class="c84-mi' + (items[k][1].na ? ' dim' : '') + '"><span class="n' + (k === m.sel ? ' on' : '') + '">' + itemNum(k) + more + '</span>' + esc(items[k][0]) + '</div>';
        }
        return s + '<div class="c84-tx">' + hh + '</div>';
      }
      case 'mode': case 'format': {
        var rows = this.scr === 'mode' ? MODE_ROWS : FORMAT_ROWS, st = this.scr === 'mode' ? this.mode : this.fmt, rr = this.scr === 'mode' ? this.mrow : this.frow, cc = this.scr === 'mode' ? this.mcol : this.fcol;
        return s + '<div class="c84-tx c84-mode">' + rows.map(function (row, ri) {
          return '<div class="row">' + (row.label ? esc(row.label) + ' ' : '') + row.opts.map(function (o, ci) { return '<span class="o' + (st[row.k] === o[1] ? ' on' : '') + (o[2] ? ' dis' : '') + (ri === rr && ci === cc ? ' cur' : '') + '">' + esc(o[0]) + '</span>'; }).join(' ') + '</div>';
        }).join('') + '</div>';
      }
      case 'yeq': {
        var hy = '<div class="c84-plots">Plot1 Plot2 Plot3</div>';
        this.Y.forEach(function (Y, i) {
          var col = COLORS[Y.color], cur = i === self.yrow;
          hy += '<div class="c84-y"><span class="ic' + (cur && self.ycol === 'style' ? ' cur' : '') + '">' + STYLE_IC[STYLES[Y.style]].replace(/@/g, col) + '</span><span class="nm">Y' + '₁₂₃₄₅₆'[i] + '<span class="eq' + (Y.on ? ' on' : '') + (cur && self.ycol === 'eq' ? ' cur' : '') + '"' + (Y.on ? ' style="background:' + col + '"' : '') + '>=</span></span><span class="ex">' + self.lineHTML(Y.line, cur && self.ycol === 'expr') + '</span></div>';
        });
        return s + '<div class="c84-tx">' + hy + '</div>';
      }
      case 'window': {
        var hw = '<div class="h">WINDOW</div>';
        WIN_ROWS.forEach(function (r, i) {
          var cur = i === self.wrow, val = cur && self.wline ? self.lineHTML(self.wline, true) : cur ? '<span class="c84-cur">' + nhtml(fmtNum(self.winVal(r[0]))[0] || ' ') + '</span>' + nhtml(fmtNum(self.winVal(r[0])).slice(1)) : nhtml(fmtNum(self.winVal(r[0])));
          hw += '<div class="r">' + esc(r[1]) + '=' + val + '</div>';
        });
        return s + '<div class="c84-tx c84-w" style="line-height:21px">' + hw + '</div>';
      }
      case 'tblset': {
        var vals = [this.tbl.start, this.tbl.step], ht = '<div class="h">TABLE SETUP</div>';
        ['TblStart', 'ΔTbl'].forEach(function (nm, i) {
          var cur = i === self.trow, v = fmtNum(vals[i]);
          ht += '<div class="r">' + nm + '=' + (cur && self.tline ? self.lineHTML(self.tline, true) : cur ? '<span class="c84-cur">' + nhtml(v[0]) + '</span>' + nhtml(v.slice(1)) : nhtml(v)) + '</div>';
        });
        ht += '<div class="r c84-mode">Indpnt: <span class="o on">Auto</span> <span class="o dis">Ask</span></div><div class="r c84-mode">Depend: <span class="o on">Auto</span> <span class="o dis">Ask</span></div>';
        return s + '<div class="c84-tx c84-w">' + ht + '</div>';
      }
      case 'table': return s + this.tableHTML();
      case 'graph': return s + '<div class="c84-hint">' + esc(this.graphHint()) + '</div>';
    }
    // home
    var hh2 = '', items = this.hsel >= 0 ? this.histItems() : null, selItem = items ? items[this.hsel] : null;
    this.hist.forEach(function (h, i) {
      var sIn = selItem && !selItem.out && selItem.h === i, sOut = selItem && selItem.out && selItem.h === i;
      hh2 += '<div class="c84-l' + (sIn ? ' sel' : '') + '"><span class="t">' + nhtml(toksText(h.toks)) + '</span></div><div class="c84-l o' + (sOut ? ' sel' : '') + '"><span class="t">' + nhtml(h.out) + '</span></div>';
    });
    hh2 += '<div class="c84-l c84-entry">' + this.lineHTML(this.line, this.hsel < 0) + '</div>';
    return s + '<div class="c84-tx"><div class="c84-hist">' + hh2 + '</div></div>';
  };
  C.graphHint = function () {
    var g = this.g;
    switch (g.mode) {
      case 'trace': return 'TRACE  ◄ ► move · ▲ ▼ function · type an X';
      case 'free': return 'GRAPH  free cursor';
      case 'zbox': return g.stage ? 'ZOOM BOX  move to the other corner, ENTER' : 'ZOOM BOX  move to a corner, ENTER';
      case 'zin': return 'ZOOM IN  move the cursor, ENTER';
      case 'zout': return 'ZOOM OUT  move the cursor, ENTER';
      case 'calc': return 'CALC ' + { value: 'VALUE', zero: 'ZERO', min: 'MINIMUM', max: 'MAXIMUM', int: 'INTERSECT', dydx: 'DY/DX' }[g.kind];
    }
    return '';
  };
  C.graphText = function () { // the words drawn over the graph
    var g = this.g, w = this.win, self = this, top = '', lines = [], xy = null;
    var fname = function (i) { return 'Y' + '₁₂₃₄₅₆'[i] + '=' + toksText(self.Y[i].line.t); };
    if ((g.mode === 'trace' || g.mode === 'calc') && g.fi >= 0 && this.fmt.expr) top = '<span style="color:' + COLORS[this.Y[g.fi].color] + '">' + nhtml(fname(g.fi)) + '</span>';
    var X = function (x) { return 'X=' + fmtFit(x, 9); }, Y = function (y) { return 'Y=' + (isFinite(y) ? fmtFit(y, 9) : ''); };
    if (g.mode === 'free' || g.mode === 'zin' || g.mode === 'zout' || g.mode === 'zbox') { if (this.fmt.coord) xy = [X(w.xmin + g.cx * this.dX()), Y(w.ymax - g.cy * this.dY())]; }
    else if (g.mode === 'trace' || g.mode === 'calc') {
      var y = g.res && g.res.y != null ? g.res.y : this.fx(g.fi, g.x);
      if (g.mode === 'calc') {
        var pr = { left: 'Left Bound?', right: 'Right Bound?', guess: 'Guess?', first: 'First curve?', second: 'Second curve?' }[g.stage];
        if (pr) lines.push(nhtml(pr));
        if (g.res && g.res.label) lines.push(nhtml(g.res.label));
        if (g.res && g.res.dydx != null) { lines.push(nhtml('dy/dx=' + (isFinite(g.res.dydx) ? fmtFit(g.res.dydx, 10) : ''))); }
      }
      if (g.inp) lines.push('X=' + this.lineHTML(g.inp, true));
      else if (!(g.mode === 'calc' && g.stage === 'value' && !g.res)) xy = [X(g.x), Y(y)];
    }
    var bot = lines.map(function (l) { return '<div>' + l + '</div>'; }).join('<br>');
    if (xy) bot += (bot ? '<br>' : '') + '<div class="xy"><span>' + nhtml(xy[0]) + '</span><span>' + nhtml(xy[1]) + '</span></div>';
    return (top ? '<div class="top">' + top + '</div>' : '') + '<div class="bot">' + bot + '</div>';
  };
  C.tableHTML = function () {
    var tb = this.tb, act = this.active(), self = this, cols = [-1].concat(act), vis = [0].concat([1, 2, 3].map(function (k) { return tb.c0 + k; }).filter(function (k) { return k < cols.length; }));
    var h = '<div class="c84-tbl"><table><tr>' + vis.map(function (k) { var i = cols[k]; return '<th' + (i >= 0 ? ' style="color:' + COLORS[self.Y[i].color] + '"' : '') + '>' + (i < 0 ? 'X' : 'Y' + '₁₂₃₄₅₆'[i]) + '</th>'; }).join('') + '</tr>';
    var sel = '';
    for (var r = 0; r < this.TROWS; r++) {
      var x = this.tableX(r), ys = this.tableRow(x);
      h += '<tr>' + vis.map(function (k) {
        var v = k === 0 ? x : ys[k - 1], on = r === tb.row && k === tb.col, txt = isFinite(v) ? fmtFit(v, 7) : 'ERROR';
        if (on) sel = (k === 0 ? 'X' : 'Y' + '₁₂₃₄₅₆'[cols[k]]) + '=' + (isFinite(v) ? fmtNum(v, self.mode) : 'ERROR');
        return '<td' + (on ? ' class="on"' : '') + '>' + nhtml(txt) + '</td>';
      }).join('') + '</tr>';
    }
    h += '</table><div class="bl">' + (tb.inp ? 'X=' + this.lineHTML(tb.inp, true) : nhtml(sel)) + '</div></div>';
    return '<div class="c84-hint">' + (act.length ? 'TABLE  ▲ ▼ scroll · type an X' : 'TABLE  type functions in Y= first') + '</div>' + h;
  };
  /* the screen as plain text (tests, the lesson-page checks) */
  C.text = function () { var d = this.html().replace(/<br>|<\/div>|<\/tr>/g, '\n').replace(/<\/t[dh]>/g, ' ').replace(/<span class="c84-ee">E<\/span>/g, 'ᴇ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'); return d.replace(/\n+/g, '\n').trim(); };

  /* ---------- drawing the graph ---------- */
  C.draw = function (cv) {
    var S = cv.width / GW, x = cv.getContext('2d'), w = this.win, self = this, g = this.g;
    x.setTransform(S, 0, 0, S, 0, 0); x.clearRect(0, 0, GW, GH); x.fillStyle = '#fff'; x.fillRect(0, 0, GW, GH);
    var PX = function (v) { return self.px(v); }, PY = function (v) { return self.py(v); };
    // grid
    if (this.fmt.grid && w.xscl > 0 && w.yscl > 0 && (w.xmax - w.xmin) / w.xscl < 200 && (w.ymax - w.ymin) / w.yscl < 200) {
      x.fillStyle = x.strokeStyle = '#c9ced6'; x.lineWidth = 1 / S;
      for (var gx = Math.ceil(w.xmin / w.xscl) * w.xscl; gx <= w.xmax; gx += w.xscl) {
        if (this.fmt.grid === 2) { x.beginPath(); x.moveTo(PX(gx), 0); x.lineTo(PX(gx), GH); x.stroke(); }
        else for (var gy = Math.ceil(w.ymin / w.yscl) * w.yscl; gy <= w.ymax; gy += w.yscl) x.fillRect(PX(gx) - 0.6, PY(gy) - 0.6, 1.2, 1.2);
      }
      if (this.fmt.grid === 2) for (var gy2 = Math.ceil(w.ymin / w.yscl) * w.yscl; gy2 <= w.ymax; gy2 += w.yscl) { x.beginPath(); x.moveTo(0, PY(gy2)); x.lineTo(GW, PY(gy2)); x.stroke(); }
    }
    var plots = this.plot();
    // shading first, then the axes, then the lines
    plots.forEach(function (p) {
      if (p.style !== 'above' && p.style !== 'below') return;
      x.fillStyle = p.color; x.globalAlpha = 0.26;
      p.cols.forEach(function (py, c) { if (py == null) return; var yy = Math.max(-1, Math.min(GH + 1, py)); if (p.style === 'above') x.fillRect(c - 0.5, 0, 1, yy); else x.fillRect(c - 0.5, yy, 1, GH - yy); });
      x.globalAlpha = 1;
    });
    if (this.fmt.axes) {
      x.strokeStyle = '#111'; x.lineWidth = 1; var ax = PY(0), ay = PX(0);
      x.beginPath();
      if (ax >= 0 && ax <= GH - 1) { x.moveTo(0, ax); x.lineTo(GW, ax); }
      if (ay >= 0 && ay <= GW - 1) { x.moveTo(ay, 0); x.lineTo(ay, GH); }
      x.stroke();
      x.beginPath();
      if (w.xscl > 0 && (w.xmax - w.xmin) / w.xscl < 400 && ax >= 0 && ax <= GH - 1) for (var tx = Math.ceil(w.xmin / w.xscl) * w.xscl; tx <= w.xmax; tx += w.xscl) { x.moveTo(PX(tx), ax - 2.5); x.lineTo(PX(tx), ax + 2.5); }
      if (w.yscl > 0 && (w.ymax - w.ymin) / w.yscl < 400 && ay >= 0 && ay <= GW - 1) for (var ty = Math.ceil(w.ymin / w.yscl) * w.yscl; ty <= w.ymax; ty += w.yscl) { x.moveTo(ay - 2.5, PY(ty)); x.lineTo(ay + 2.5, PY(ty)); }
      x.stroke();
      if (this.fmt.label) { x.fillStyle = '#111'; x.font = '700 10px system-ui,Arial'; if (ax >= 0 && ax <= GH) x.fillText('x', GW - 9, ax - 4); if (ay >= 0 && ay <= GW) x.fillText('y', ay + 4, 10); }
    }
    plots.forEach(function (p) {
      x.strokeStyle = x.fillStyle = p.color; x.lineWidth = p.style === 'thin' ? 1 : 2.2; x.lineJoin = 'round'; x.lineCap = 'round';
      p.segs.forEach(function (sg) {
        if (p.style === 'dot') { sg.forEach(function (pt) { if (pt[1] > -2 && pt[1] < GH + 2) x.fillRect(pt[0] - 0.9, pt[1] - 0.9, 1.8, 1.8); }); return; }
        x.beginPath(); sg.forEach(function (pt, k) { var yy = Math.max(-500, Math.min(GH + 500, pt[1])); if (k) x.lineTo(pt[0], yy); else x.moveTo(pt[0], yy); });
        if (sg.length === 1) x.lineTo(sg[0][0] + 0.01, sg[0][1]); x.stroke();
      });
    });
    // bounds, boxes and cursors
    var tri = function (xx, right) { var p = PX(xx); x.fillStyle = '#111'; x.beginPath(); if (right) { x.moveTo(p, 2); x.lineTo(p + 5, 6); x.lineTo(p, 10); } else { x.moveTo(p, 2); x.lineTo(p - 5, 6); x.lineTo(p, 10); } x.fill(); };
    if (g.mode === 'calc' && g.L != null && g.stage !== 'done') tri(g.L, true);
    if (g.mode === 'calc' && g.R != null && g.stage !== 'done') tri(g.R, false);
    var cross = function (cx, cy, col) {
      x.strokeStyle = '#fff'; x.lineWidth = 3; x.beginPath(); x.moveTo(cx - 5, cy); x.lineTo(cx + 5, cy); x.moveTo(cx, cy - 5); x.lineTo(cx, cy + 5); x.stroke();
      x.strokeStyle = col; x.lineWidth = 1.3; x.beginPath(); x.moveTo(cx - 5, cy); x.lineTo(cx + 5, cy); x.moveTo(cx, cy - 5); x.lineTo(cx, cy + 5); x.stroke();
    };
    if (g.mode === 'free' || g.mode === 'zin' || g.mode === 'zout' || g.mode === 'zbox') {
      if (g.mode === 'zbox' && g.stage === 1) { x.strokeStyle = '#111'; x.lineWidth = 1; x.setLineDash([3, 2]); x.strokeRect(Math.min(g.bx, g.cx), Math.min(g.by, g.cy), Math.abs(g.cx - g.bx), Math.abs(g.cy - g.by)); x.setLineDash([]); }
      cross(g.cx, g.cy, '#111');
    }
    if ((g.mode === 'trace' || g.mode === 'calc') && g.fi >= 0 && !(g.mode === 'calc' && g.stage === 'value' && !g.res)) {
      var yv = g.res && g.res.y != null ? g.res.y : this.fx(g.fi, g.x);
      if (isFinite(yv)) {
        var cx2 = PX(g.x), cy2 = PY(yv), col = COLORS[this.Y[g.fi].color];
        if (cy2 >= -3 && cy2 <= GH + 3) { cross(cx2, cy2, col); x.strokeStyle = col; x.lineWidth = 1.4; x.beginPath(); x.arc(cx2, cy2, 3.2, 0, 7); x.stroke(); }
      }
    }
  };

  /* ---------- the window ---------- */
  var UI = null;
  function build() {
    var c = new Calc(), doc = document;
    if (!doc.getElementById('c84-css')) { var st = doc.createElement('style'); st.id = 'c84-css'; st.textContent = CSS; doc.head.appendChild(st); }
    var el = function (t, cl, h) { var e = doc.createElement(t); if (cl) e.className = cl; if (h != null) e.innerHTML = h; return e; };
    var box = el('div', 'calc c84 hidden'); box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Graphing calculator (TI-84 Plus CE style)'); box.tabIndex = -1;
    var inner = el('div', 'c84-in');
    var head = el('div', 'calc-head', '<span class="c84-brand">TI-84 <b>Plus CE</b><em>style</em></span><span class="c84-sp"></span>');
    var helpB = el('button', 'c84-hbtn', '?'); helpB.type = 'button'; helpB.title = 'How to use this calculator'; head.appendChild(helpB);
    var close = el('button', 'calc-close', '×'); close.type = 'button'; close.title = 'Close calculator'; head.appendChild(close);
    var bodyEl = el('div', 'c84-body'), bez = el('div', 'c84-bez'), screen = el('div', 'calc-screen c84-scr');
    var txt = el('div', 'c84-txt'), gw = el('div', 'c84-gw'), cv = el('canvas'), gt = el('div', 'c84-gt');
    cv.width = GW * 3; cv.height = GH * 3; gw.appendChild(cv); gw.appendChild(gt);
    screen.appendChild(txt); screen.appendChild(gw); bez.appendChild(screen);
    var pad = el('div', 'c84-pad');
    var flash = function (b) { b.classList.add('down'); setTimeout(function () { b.classList.remove('down'); }, 90); };
    function wire(b, id) {
      b.type = 'button'; b.dataset.a = id; b.dataset.k = id; if (KEY[id] && KEY[id].s2 && !/^na:/.test(KEY[id].s2)) b.dataset.b = KEY[id].s2;
      b.addEventListener('pointerdown', function (e) { e.preventDefault(); try { box.focus({ preventScroll: true }); } catch (er) { /* ignore */ } c.press(id); render(); flash(b); });
      b.addEventListener('click', function (e) { e.preventDefault(); });
      return b;
    }
    LAYOUT.forEach(function (row, ri) {
      row.forEach(function (k) {
        var cell = el('div', 'c84-kc');
        cell.appendChild(el('div', 'c84-kl', '<span class="l2">' + (k[3] || '&nbsp;') + '</span><span class="la">' + (k[5] || '') + '</span>'));
        var b = wire(el('button', 'c84-k ' + k[7], k[1]), k[0]); b.setAttribute('aria-label', k[1].replace(/<[^>]+>/g, '') + (k[3] ? ' (2nd: ' + k[3].replace(/<[^>]+>/g, '') + ')' : ''));
        cell.appendChild(b); pad.appendChild(cell);
      });
      if (ri === 1) {
        var dp = el('div', 'c84-dp'), ring = el('div', 'c84-ring');
        [['up', '▲'], ['left', '◀'], ['right', '▶'], ['down', '▼']].forEach(function (a) { var b = wire(el('button', 'c84-ar ' + a[0], a[1]), a[0]); b.setAttribute('aria-label', a[0]); ring.appendChild(b); });
        dp.appendChild(ring); pad.appendChild(dp);
      }
    });
    bodyEl.appendChild(bez); bodyEl.appendChild(pad);
    var help = el('div', 'c84-help', '<h4>The on-screen TI-84 Plus CE</h4><ul>' +
      '<li>Type a calculation and press <kbd>enter</kbd>. Use <kbd>(−)</kbd> for a negative number and <kbd>−</kbd> to subtract. <kbd class="b">2nd</kbd> then a key gives the blue word above it; <kbd>alpha</kbd> gives the green letter.</li>' +
      '<li><kbd>math</kbd> <kbd>1</kbd> ►Frac turns the answer into a fraction. <kbd class="b">2nd</kbd> <kbd>x²</kbd> is √(. <kbd>mode</kbd> sets DEGREE or RADIAN and the decimals.</li>' +
      '<li>Graphs: type functions in <kbd>y=</kbd> with <kbd>X,T,θ,n</kbd> for X, then <kbd>graph</kbd> (<kbd>zoom</kbd> <kbd>6</kbd> is ZStandard). <kbd>trace</kbd> moves along a graph. <kbd class="b">2nd</kbd> <kbd>trace</kbd> (CALC) finds a zero, minimum, maximum or intersection.</li>' +
      '<li>Tables: <kbd class="b">2nd</kbd> <kbd>window</kbd> (TBLSET) sets the start and the step, <kbd class="b">2nd</kbd> <kbd>graph</kbd> (TABLE) shows it.</li>' +
      '<li>Series: <kbd class="b">2nd</kbd> <kbd>stat</kbd> (LIST) has seq( under OPS and sum( under MATH, e.g. sum(seq(3*2^(N−1),N,1,10)).</li>' +
      '<li>Keyboard: digits, + − * / ^ ( ) , Enter, Backspace, arrows; x for X, other letters for A–Z, Esc = clear.</li></ul>' +
      '<div class="casio"><b>Casio fx-9750GIII?</b> It has all of these features too, under different keys (MENU → Run-Matrix, Graph, Table).</div>');
    help.hidden = true;
    inner.appendChild(head); inner.appendChild(bodyEl); inner.appendChild(help); box.appendChild(inner);
    doc.body.appendChild(box);
    helpB.addEventListener('click', function () { help.hidden = !help.hidden; helpB.classList.toggle('on', !help.hidden); });
    helpB.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    help.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    help.addEventListener('click', function () { help.hidden = true; helpB.classList.remove('on'); });

    var lastScr = '';
    function render() {
      var gr = c.on && c.scr === 'graph';
      txt.innerHTML = c.html();
      gw.style.display = gr ? '' : 'none';
      if (gr) { c.draw(cv); gt.innerHTML = c.graphText(); }
      var hs = txt.querySelector('.c84-hist');
      if (hs) { var s2 = hs.querySelector('.sel'); if (s2) { if (s2.offsetTop < hs.scrollTop) hs.scrollTop = s2.offsetTop; else if (s2.offsetTop + s2.offsetHeight > hs.scrollTop + hs.clientHeight) hs.scrollTop = s2.offsetTop + s2.offsetHeight - hs.clientHeight; } else hs.scrollTop = hs.scrollHeight; }
      var tx = txt.querySelector('.c84-tx'); if (tx && c.scr === 'yeq') { var cur = tx.querySelector('.c84-cur, .cur'); if (cur && cur.offsetTop + 22 > tx.clientHeight) tx.scrollTop = cur.offsetTop - tx.clientHeight + 26; }
      lastScr = c.scr;
    }
    close.addEventListener('click', function () { api.hide(); });
    close.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    // drag by the head
    var drag = null;
    head.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; var r = box.getBoundingClientRect(); drag = { dx: e.clientX - r.left, dy: e.clientY - r.top }; try { head.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ } });
    head.addEventListener('pointermove', function (e) { if (!drag) return; var x = Math.max(0, Math.min(innerWidth - box.offsetWidth, e.clientX - drag.dx)), y = Math.max(0, Math.min(innerHeight - 40, e.clientY - drag.dy)); box.style.left = x + 'px'; box.style.top = y + 'px'; box.style.right = 'auto'; box.style.bottom = 'auto'; });
    head.addEventListener('pointerup', function () { drag = null; });
    // the physical keyboard while the calculator has focus
    var KB = { Enter: 'enter', '=': 'enter', Escape: 'clear', ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', Delete: 'del', Insert: 'ins', '+': 'add', '*': 'mul', '/': 'div', '^': 'pow', '(': 'lp', ')': 'rp', ',': 'comma', '{': 'lb', '}': 'rb', '!': null };
    box.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var k = e.key, a = null;
      if (/^[0-9.]$/.test(k)) a = k;
      else if (k === '-') { // the keyboard's minus is a negative sign where a number has to start
        var L = c.scr === 'home' ? c.line : c.scr === 'yeq' ? c.Y[c.yrow].line : c.scr === 'window' ? c.wline : c.scr === 'tblset' ? c.tline : c.scr === 'graph' ? c.g.inp : c.scr === 'table' ? c.tb.inp : null;
        var prev = L && L.c > 0 ? L.t[L.c - 1] : null;
        a = !prev ? (c.scr === 'home' || c.scr === 'yeq' || c.scr === 'window' || c.scr === 'tblset' || c.scr === 'graph' || c.scr === 'table' ? 'neg' : 'sub') : /^(op|lp|comma|neg|fn|sto|lb)$/.test(prev.k) ? 'neg' : 'sub';
      }
      else if (k === 'Backspace') { if (c.scr === 'home' && c.line.c > 0) { c.line.c--; a = 'del'; } else if (c.scr === 'yeq' && c.Y[c.yrow].line.c > 0) { c.Y[c.yrow].line.c--; a = 'del'; } else a = 'del'; }
      else if (k === 'x' || k === 'X') a = 'xt';
      else if (/^[a-zA-Z]$/.test(k)) a = k.toUpperCase();
      else if (KB[k]) a = KB[k];
      if (!a) return;
      e.preventDefault(); e.stopPropagation();
      c.second = false; if (!c.alock) c.alpha = false;
      c.press(a);
      render();
    });
    box.addEventListener('pointerdown', function () { try { box.focus({ preventScroll: true }); } catch (e) { /* ignore */ } });

    /* size: scaled to fit the screen (and the lesson page's Size button); a wide layout when the screen is short */
    function measure() { inner.style.transform = 'none'; return { w: inner.offsetWidth, h: inner.offsetHeight }; }
    function fit() {
      if (box.classList.contains('hidden')) return;
      var z = api.zoom || 1, top = api.top || 8, vw = Math.max(200, innerWidth - 12), vh = Math.max(200, innerHeight - top - 8);
      box.classList.remove('wide');
      var m = measure(), s = Math.min(z, vw / m.w, vh / m.h);
      if (s < z * 0.85 && innerWidth > 700) {
        box.classList.add('wide'); var m2 = measure(), s2 = Math.min(z, vw / m2.w, vh / m2.h);
        if (s2 > s * 1.05) { m = m2; s = s2; } else { box.classList.remove('wide'); m = measure(); }
      }
      inner.style.transform = 'scale(' + s + ')';
      box.style.width = Math.round(m.w * s) + 'px'; box.style.height = Math.round(m.h * s) + 'px';
      api.scale = s;
      if (box.style.left) { var x = Math.max(4, Math.min(innerWidth - m.w * s - 4, parseFloat(box.style.left) || 0)), y = Math.max(top, Math.min(innerHeight - m.h * s - 4, parseFloat(box.style.top) || 0)); box.style.left = x + 'px'; box.style.top = y + 'px'; }
    }
    addEventListener('resize', function () { if (api.isOpen()) fit(); });
    render();
    var api = {
      calc: c, node: box, render: render, fit: fit, zoom: 1, top: 8, scale: 1,
      setZoom: function (z) { api.zoom = z || 1; fit(); },
      show: function () { box.classList.remove('hidden'); doc.body.classList.add('calc-open'); fit(); render(); try { box.focus({ preventScroll: true }); } catch (e) { /* ignore */ } if (api.onToggle) api.onToggle(true); },
      hide: function () { box.classList.add('hidden'); doc.body.classList.remove('calc-open'); if (api.onToggle) api.onToggle(false); },
      toggle: function () { if (box.classList.contains('hidden')) api.show(); else api.hide(); },
      isOpen: function () { return !box.classList.contains('hidden'); },
      press: function (seq) { (Array.isArray(seq) ? seq : String(seq).split(/\s+/)).forEach(function (a) { if (a) c.press(a); }); render(); var h = c.hist[c.hist.length - 1]; return { l1: toksText(c.line.t), l2: h ? h.out : '', text: c.text() }; }
    };
    return api;
  }

  /* ======================= key-press demos (data-keys) ======================= */
  var DEMO = {
    '=': [['enter'], 'ENTER'], ENTER: [['enter'], 'ENTER'], '+': [['add'], '+'], '−': [['sub'], '−'], '-': [['sub'], '−'], '×': [['mul'], '×'], '*': [['mul'], '×'], '÷': [['div'], '÷'], '/': [['div'], '÷'],
    '^': [['pow'], '^'], '(': [['lp'], '('], ')': [['rp'], ')'], ',': [['comma'], ','], '(−)': [['neg'], '(−)'], 'x²': [['sq'], 'x²'], 'x⁻¹': [['inv'], 'x⁻¹'],
    sin: [['sin'], 'SIN'], cos: [['cos'], 'COS'], tan: [['tan'], 'TAN'], log: [['log'], 'LOG'], ln: [['ln'], 'LN'], X: [['xt'], 'X,T,θ,n'], 'STO→': [['sto'], 'STO→'], '→': [['sto'], 'STO→'],
    CLEAR: [['clear'], 'CLEAR'], DEL: [['del'], 'DEL'], MODE: [['mode'], 'MODE'], MATH: [['math'], 'MATH'], VARS: [['vars'], 'VARS'], ALPHA: [['alpha'], 'ALPHA'], '2nd': [['2nd'], '2nd'], ON: [['on'], 'ON'],
    'Y=': [['yeq'], 'Y='], WINDOW: [['window'], 'WINDOW'], ZOOM: [['zoom'], 'ZOOM'], TRACE: [['trace'], 'TRACE'], GRAPH: [['graph'], 'GRAPH'],
    '▲': [['up'], '▲'], '▼': [['down'], '▼'], '◄': [['left'], '◄'], '►': [['right'], '►'],
    '√': [['2nd', 'sq'], '2nd x² (√)'], 'π': [['2nd', 'pow'], '2nd ^ (π)'], e: [['2nd', 'div'], '2nd ÷ (e)'], EE: [['2nd', 'comma'], '2nd , (EE)'], '{': [['2nd', 'lp'], '2nd ( ({)'], '}': [['2nd', 'rp'], '2nd ) (})'],
    Ans: [['2nd', 'neg'], '2nd ANS'], ENTRY: [['2nd', 'enter'], '2nd ENTRY'], QUIT: [['2nd', 'mode'], '2nd QUIT'], INS: [['2nd', 'del'], '2nd INS'],
    'sin⁻¹': [['2nd', 'sin'], '2nd SIN⁻¹'], 'cos⁻¹': [['2nd', 'cos'], '2nd COS⁻¹'], 'tan⁻¹': [['2nd', 'tan'], '2nd TAN⁻¹'], '10^(': [['2nd', 'log'], '2nd LOG (10ˣ)'], 'e^(': [['2nd', 'ln'], '2nd LN (eˣ)'],
    TABLE: [['2nd', 'graph'], '2nd TABLE'], TBLSET: [['2nd', 'window'], '2nd TBLSET'], CALC: [['2nd', 'trace'], '2nd CALC'], FORMAT: [['2nd', 'zoom'], '2nd FORMAT'], LIST: [['2nd', 'stat'], '2nd LIST'], TEST: [['2nd', 'math'], '2nd TEST'], ANGLE: [['2nd', 'apps'], '2nd ANGLE'], 'A-LOCK': [['2nd', 'alpha'], '2nd A-LOCK'],
    '►Frac': [['math', '1'], 'MATH 1 (►Frac)'], '►Dec': [['math', '2'], 'MATH 2 (►Dec)'], '³': [['math', '3'], 'MATH 3 (³)'], 'x³': [['math', '3'], 'MATH 3 (³)'], '³√(': [['math', '4'], 'MATH 4 (³√()'], '³√': [['math', '4'], 'MATH 4 (³√()'], 'ˣ√': [['math', '5'], 'MATH 5 (ˣ√)'], 'Σ(': [['math', '0'], 'MATH 0 (Σ()'],
    'abs(': [['math', 'right', '1'], 'MATH ► 1 (abs()'], 'round(': [['math', 'right', '2'], 'MATH ► 2 (round()'], 'iPart(': [['math', 'right', '3'], 'MATH ► 3 (iPart()'], 'fPart(': [['math', 'right', '4'], 'MATH ► 4 (fPart()'], 'int(': [['math', 'right', '5'], 'MATH ► 5 (int()'],
    nPr: [['math', 'left', 'left', '2'], 'MATH ◄ ◄ 2 (nPr)'], nCr: [['math', 'left', 'left', '3'], 'MATH ◄ ◄ 3 (nCr)'], '!': [['math', 'left', 'left', '4'], 'MATH ◄ ◄ 4 (!)'],
    'seq(': [['2nd', 'stat', 'right', '5'], '2nd LIST ► 5 (seq()'], 'dim(': [['2nd', 'stat', 'right', '3'], '2nd LIST ► 3 (dim()'], 'cumSum(': [['2nd', 'stat', 'right', '6'], '2nd LIST ► 6 (cumSum()'],
    'sum(': [['2nd', 'stat', 'left', '5'], '2nd LIST ◄ 5 (sum()'], 'prod(': [['2nd', 'stat', 'left', '6'], '2nd LIST ◄ 6 (prod()'],
    '°': [['2nd', 'apps', '1'], '2nd ANGLE 1 (°)'], '>': [['2nd', 'math', '3'], '2nd TEST 3 (>)'], '≥': [['2nd', 'math', '4'], '2nd TEST 4 (≥)'], '<': [['2nd', 'math', '5'], '2nd TEST 5 (<)'], '≤': [['2nd', 'math', '6'], '2nd TEST 6 (≤)'], '≠': [['2nd', 'math', '2'], '2nd TEST 2 (≠)'],
    ZBox: [['zoom', '1'], 'ZOOM 1 (ZBox)'], ZoomIn: [['zoom', '2'], 'ZOOM 2 (Zoom In)'], ZoomOut: [['zoom', '3'], 'ZOOM 3 (Zoom Out)'], ZDecimal: [['zoom', '4'], 'ZOOM 4 (ZDecimal)'], ZSquare: [['zoom', '5'], 'ZOOM 5 (ZSquare)'], ZStandard: [['zoom', '6'], 'ZOOM 6 (ZStandard)'], ZTrig: [['zoom', '7'], 'ZOOM 7 (ZTrig)'], ZInteger: [['zoom', '8'], 'ZOOM 8 (ZInteger)'], ZoomFit: [['zoom', '0'], 'ZOOM 0 (ZoomFit)'],
    value: [['2nd', 'trace', '1'], '2nd CALC 1 (value)'], zero: [['2nd', 'trace', '2'], '2nd CALC 2 (zero)'], minimum: [['2nd', 'trace', '3'], '2nd CALC 3 (minimum)'], maximum: [['2nd', 'trace', '4'], '2nd CALC 4 (maximum)'], intersect: [['2nd', 'trace', '5'], '2nd CALC 5 (intersect)'],
    'F◂▸D': [['math', '1', 'enter'], 'MATH 1 ENTER (►Frac)']
  };
  [1, 2, 3, 4, 5, 6].forEach(function (k) { DEMO['L' + k] = [['2nd', String(k)], '2nd L' + k]; DEMO['Y' + k] = [['vars', 'right', '1', String(k)], 'VARS ► 1 ' + k + ' (Y' + k + ')']; });
  /* data-keys="…" → [{ tok, label, keys: [key ids] }] */
  function plan(spec) {
    var prev = '';
    return String(spec).trim().split(/\s+/).filter(Boolean).map(function (t) {
      var after = prev; prev = t;
      if (DEMO[t]) return { tok: t, label: DEMO[t][1], keys: DEMO[t][0].slice() };
      if (/^k:/.test(t)) return { tok: t, label: t.slice(2), keys: [t.slice(2)] };
      if (/^[0-9.]+$/.test(t)) return { tok: t, label: t, keys: t.split('') };
      // after STO→ the calculator is already in ALPHA, so the letter is one key press
      if (/^[A-Zθ]$/.test(t) && ALPHA_KEY[t] && (after === 'STO→' || after === '→')) return { tok: t, label: t, keys: [ALPHA_KEY[t]] };
      if (/^[A-Zθ]$/.test(t) && ALPHA_KEY[t]) return { tok: t, label: 'ALPHA ' + t, keys: ['alpha', ALPHA_KEY[t]] };
      return { tok: t, label: t, keys: t.split('').filter(function (ch) { return KEY[ch]; }) };
    });
  }

  HW.Calc = { engine: Calc, get: function () { if (!UI) UI = build(); return UI; }, toggle: function () { HW.Calc.get().toggle(); }, plan: plan, fmtNum: fmtNum, fracOf: fracOf, model: 'TI-84 Plus CE' };
})(window);
