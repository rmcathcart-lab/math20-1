/* On-screen graphing calculator in the style of the Casio fx-9750GIII (monochrome 128×64 dot-matrix LCD, the real key
 * layout: F1–F6, SHIFT (yellow functions above the keys), ALPHA (red letters), OPTN, VARS, MENU, EXIT, EXE, ×10ˣ, (−),
 * S⇔D, the □/□ fraction key). Like js/calc84.js it has the basics and everything Math 20-1 uses; it is not a full emulator.
 * It is loaded by js/calc84.js (beside it) when a student picks "Casio" on the calculator's TI-84 | Casio switch, and it
 * reuses the TI-84's maths (numbers with exact fractions, the evaluator, the graph solver); the keys, menus, screens,
 * order of operations and error messages are the Casio's.
 *
 *   MENU          1 Run-Matrix, 3 Graph, 5 Table (the other apps say they aren't on this calculator). Arrows + EXE or
 *                 the app's number.
 *   RUN-MAT       natural ("Math") input and output: □/□ fractions, √□, ˣ√□, ³√□, powers in a raised box (► leaves the
 *                 box), 10^□, e^□, x², x⁻¹; results as fractions (improper, or mixed with Frac Result ab/c), surds (3√19,
 *                 √3/2) or decimals (10 digits); S⇔D switches the last answer between exact and decimal. Ans (SHIFT (−)),
 *                 an operator on an empty line starts with Ans, EXE on an empty line repeats the last calculation, ◄ ►
 *                 on an empty line bring the last calculation back to edit, ▲ ▼ pick an earlier line (EXE copies it).
 *                 → stores in A–Z, r, θ (ALPHA letter). Casio order of operations: functions such as sin, √ and (−) take
 *                 the value after them (sin 30+1 = sin(30)+1, (−)2² = −4, sin 2X = sin(2X)), and a product written
 *                 without × is worked out before × and ÷ (6÷2(1+2) = 1, unlike the TI-84). A missing ")" at the end is fine.
 *   OPTN          LIST (List, Dim, Seq(, Min(, Max(, Mean(, Med(, Sum, Prod, Cuml), CALC ▷ Σ( and logab(, PROB (x!, nPr,
 *                 nCr, Ran#), NUM (Abs, Int, Frac, Intg, RndFix(, GCD(, LCM(, MOD(), ANGLE (° r). VARS ▸ GRAPH ▸ Y.
 *                 MATH (F4 in Run-Matrix): logab(, |□|, Σ(.
 *   SET UP        SHIFT MENU: Input/Output Math, Frac Result d/c ab/c, Draw Type Connect/Plot, Angle Deg/Rad (default
 *                 Deg, for the class), Coord, Grid, Axes, Label, Display Norm1/Norm2/Fix 0–9/Sci 0–9.
 *   GRAPH         the Y= list (Y1–Y20; F1 SELECT, F2 DELETE, F3 TYPE: Y= and the inequalities Y> Y< Y≥ Y≤ with shading,
 *                 F4 STYLE, F6 DRAW), SHIFT F3 V-Window (Xmin max scale dot Ymin max scale; INITIAL, TRIG, STANDRD),
 *                 SHIFT F1 Trace (◄ ► move one dot, ▲ ▼ change graph, type an X), SHIFT F2 Zoom (BOX, IN, OUT, AUTO,
 *                 ▷ ORIGINAL, SQUARE, INTEGER, PREVIOUS), SHIFT F5 G-Solv: ROOT, MAX, MIN, Y-ICEPT, INTSECT, ▷ Y-CAL,
 *                 X-CAL (◄ ► go to the previous / next solution; "Not Found" when there is none in the window).
 *   TABLE         the same function list; F5 SET (Start, End, Step), F6 TABLE (◄ ► ▲ ▼; type over an X to change it).
 *   Errors        Syntax ERROR, Math ERROR (÷0, tan 90, sin⁻¹ 2, …), Non-Real ERROR, Argument ERROR, Dimension ERROR,
 *                 Range ERROR, in a box: EXIT goes back, ◄ ► go to the mistake.
 *   Left out      statistics, matrices, programs, complex numbers, the other apps, Line input, CATALOG, ∫ d/dx.
 *
 * API (registered with js/calc84.js; the public HW.Calc façade is the same for both models): the engine is Fx, with
 * press(id) (a key id below, following SHIFT / ALPHA like the real keys, or the name of a SHIFT/ALPHA function directly),
 * toHome(clear), text() (the screen as plain text), value() (the number on the screen: the last answer, the table cell,
 * the G-Solv / Trace point), shift, alpha and app/scr (the app and the screen).
 * Key ids: f1 f2 f3 f4 f5 f6 · shift optn vars menu · alpha sq pow exit · xt log ln sin cos tan · frac sd lp rp comma sto
 * · 7 8 9 del ac · 4 5 6 mul div · 1 2 3 add sub · 0 . exp neg exe · up down left right.
 *
 * Key-press demos: HW.Calc.plan(spec) takes the same data-keys tokens as the TI-84 (written with TI-84 key names, see
 * the top of js/calc84.js) and turns them into Casio key presses and captions: ENTER → EXE, 2nd sin → SHIFT sin,
 * Ans → SHIFT (−), STO→ → →, sin 30 ) → sin 30 (brackets kept when the angle is an expression), a power's ► out of the
 * exponent box, √ … ) → SHIFT x² … ►, ˣ√ → SHIFT ^ with the index first, MODE → SHIFT MENU (SET UP), Y= → MENU 3 (or
 * MENU 5 when the demo makes a table), CLEAR in Y= → F2 (DELETE) F1 (Yes), TBLSET → F5 (SET), TABLE → F6 (TABLE),
 * ZStandard → SHIFT F3 F3 (STANDRD), CALC zero / minimum / maximum / intersect / value → SHIFT F5 (G-SOLV) ROOT / MIN /
 * MAX / INTSECT / Y-CAL (with ► to the same solution the TI-84's bounds find), ►Frac → S⇔D when needed. Where the TI-84
 * shows a decimal and the Casio a fraction or surd, the demo adds S⇔D, so both show the same number.
 */
(function (root) {
  'use strict';
  var HW = root.HW = root.HW || {};
  var TI = HW.Calc84;
  if (!TI) return;
  var V = TI.V, fromQ = TI.fromQ, ZERO = TI.ZERO, E = TI.E, chk = TI.chk, isInt = TI.isInt, r14 = TI.r14, gcd = TI.gcd, fracOf = TI.fracOf;

  /* ======================= the LCD: 128×64 dots, a 5×7 font (6×8 cells) and a small 3×5 font ======================= */
  var FONT = {" ":"0000000","0":"ehjlphe","1":"4c4444e","2":"eh1248v","3":"v2421he","4":"26aiv22","5":"vgu11he","6":"68guhhe","7":"v124888","8":"ehhehhe","9":"ehhf12c","A":"ehhvhhh","B":"uhhuhhu","C":"ehggghe","D":"sihhhis","E":"vgguggv","F":"vgguggg","G":"ehgnhhf","H":"hhhvhhh","I":"e44444e","J":"72222ic","K":"hikokih","L":"ggggggv","M":"hrllhhh","N":"hhpljhh","O":"ehhhhhe","P":"uhhuggg","Q":"ehhhlid","R":"uhhukih","S":"fgge11u","T":"v444444","U":"hhhhhhe","V":"hhhhha4","W":"hhhllla","X":"hha4ahh","Y":"hha4444","Z":"v1248gv","a":"00e1fhf","b":"ggmphhu","c":"00egghe","d":"11djhhf","e":"00ehvge","f":"698s888","g":"0fhhf1e","h":"ggmphhh","i":"40c444e","j":"20622ic","k":"ggikoki","l":"c44444e","m":"00qllhh","n":"00mphhh","o":"00ehhhe","p":"00uhugg","q":"00djf11","r":"00mpggg","s":"00ege1u","t":"88s8896","u":"00hhhjd","v":"00hhha4","w":"00hhlla","x":"00ha4ah","y":"00hhf1e","z":"00v248v","+":"044v440","−":"000v000","-":"000v000","⁻":"000e000","×":"0ha4ah0","÷":"040v040","=":"00v0v00","≠":"02v4v80","<":"248g842",">":"8421248","≤":"248420e","≥":"842480e","(":"2488842",")":"8422248","[":"e88888e","]":"e22222e","{":"2448442","}":"8442448","|":"4444444",",":"0000c48",".":"00000cc",":":"0cc0cc0",";":"0cc0c48","!":"4444404","?":"eh12404","'":"4480000","\"":"aaa0000","/":"01248g0","*":"04lel40","%":"op248j3","#":"aavavaa","&":"cik8lid","$":"4fke5u4","_":"000000v","^":"4ah0000","~":"008l200","°":"ciic000","θ":"ehhvhhe","π":"00vaaa9","Σ":"vg848gv","√":"7444kc4","∫":"344444o","ᴇ":"00ugsgu","→":"042v240","⇔":"0avhva0","►":"8cefec8","◄":"26eue62","▲":"04ev000","▼":"000ve40","▷":"8ca9ac8","↵":"115dvc4","∠":"0248v00","·":"000cc00","■":"vvvvvvv","□":"vhhhhhv","⌟":"111111v","∞":"00ala00","Δ":"044aahv","↑":"4el4444","↓":"4444le4","←":"048v840"};
  var SMALL = {" ":"200000","A":"38kskk","B":"3okoko","C":"3cgggc","D":"3okkko","E":"3sgogs","F":"3sgogg","G":"3cgkkc","H":"3kkskk","I":"1ggggg","J":"3444k8","K":"3kkokk","L":"3ggggs","M":"5hrlhh","N":"4iqmii","O":"38kkk8","P":"3okogg","Q":"38kkoc","R":"3okokk","S":"3cg84o","T":"3s8888","U":"3kkkks","V":"3kkkk8","W":"5hhlrh","X":"3kk8kk","Y":"3kk888","Z":"3s48gs","a":"30ckkc","b":"3gokko","c":"30cggc","d":"34ckkc","e":"308sgc","f":"28gogg","g":"30ckco","h":"3gokkk","i":"1g0ggg","j":"28088g","k":"3gkokk","l":"1ggggg","m":"50qlll","n":"30okkk","o":"308kk8","p":"30okog","q":"30ckc4","r":"208ggg","s":"30co4o","t":"2gogg8","u":"30kkkc","v":"30kkk8","w":"50hlla","x":"30k88k","y":"30kkco","z":"30s8gs","0":"3skkks","1":"28o888","2":"3o48gs","3":"3o484o","4":"3kks44","5":"3sgo4o","6":"3cgsks","7":"3s4888","8":"3sksks","9":"3sks4o","-":"300s00","+":"308s80","=":"30s0s0",".":"10000g",":":"10g0g0","/":"3448gg","(":"28ggg8",")":"2g888g","▷":"3gokog","↔":"50ava0","Σ":"3sg8gs","√":"464kc4","∫":"3c888o","°":"3sks00",">":"3g848g","<":"348g84","≥":"3g8g0s","≤":"34840s","!":"1ggg0g","%":"3k48gk","θ":"38ksk8","π":"30skkk","~":"408k40","'":"1gg000","²":"2o8go0","ʳ":"20ogg0","#":"3ksksk","[":"2ogggo","]":"2o888o","&":"38k8kc","ᴇ":"3sgogs","×":"30k8k0","▲":"504ev0","▼":"50ve40","►":"3gosog","◄":"34csc4"};
  var B32 = '0123456789abcdefghijklmnopqrstuv';
  var GLYPH = {}, SGLYPH = {};
  Object.keys(FONT).forEach(function (c) { GLYPH[c] = FONT[c].split('').map(function (d) { return B32.indexOf(d); }); });
  Object.keys(SMALL).forEach(function (c) { var s = SMALL[c]; SGLYPH[c] = { w: +s[0], r: s.slice(1).split('').map(function (d) { return B32.indexOf(d); }) }; });
  var LW = 128, LH = 64;
  function LCD() { this.p = new Uint8Array(LW * LH); this.notes = []; this.clipX = [0, LW]; }
  LCD.prototype = {
    clear: function () { this.p.fill(0); this.notes = []; },
    set: function (x, y, v) { x = Math.round(x); y = Math.round(y); if (x < this.clipX[0] || x >= this.clipX[1] || y < 0 || y >= LH) return; this.p[y * LW + x] = v == null ? 1 : v; },
    get: function (x, y) { return x >= 0 && x < LW && y >= 0 && y < LH ? this.p[y * LW + x] : 0; },
    xor: function (x, y) { if (x >= 0 && x < LW && y >= 0 && y < LH) this.p[y * LW + x] ^= 1; },
    rect: function (x, y, w, h, v) { for (var j = y; j < y + h; j++) for (var i = x; i < x + w; i++) this.set(i, j, v); },
    inv: function (x, y, w, h) { for (var j = y; j < y + h; j++) for (var i = x; i < x + w; i++) this.xor(i, j); },
    frame: function (x, y, w, h, v) { this.hl(x, x + w - 1, y, v); this.hl(x, x + w - 1, y + h - 1, v); this.vl(x, y, y + h - 1, v); this.vl(x + w - 1, y, y + h - 1, v); },
    hl: function (x0, x1, y, v) { for (var i = Math.min(x0, x1); i <= Math.max(x0, x1); i++) this.set(i, y, v); },
    vl: function (x, y0, y1, v) { for (var j = Math.min(y0, y1); j <= Math.max(y0, y1); j++) this.set(x, j, v); },
    line: function (x0, y0, x1, y1, v) {
      x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
      var dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx + dy;
      for (var n = 0; n < 400; n++) { this.set(x0, y0, v); if (x0 === x1 && y0 === y1) break; var e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
    },
    ch: function (x, y, c, v) { // one 5×7 character with its top-left at (x, y)
      var g = GLYPH[c] || GLYPH['?']; v = v == null ? 1 : v;
      for (var r = 0; r < 7; r++) for (var b = 0; b < 5; b++) if (g[r] & (16 >> b)) this.set(x + b, y + r, v);
    },
    str: function (x, y, s, v, note) { s = String(s); for (var i = 0; i < s.length; i++) this.ch(x + 6 * i, y, s[i], v); if (note !== false) this.note(x, y, s); return 6 * s.length; },
    sw: function (s) { var w = 0; s = String(s); for (var i = 0; i < s.length; i++) { var g = SGLYPH[s[i]] || SGLYPH[s[i].toUpperCase()] || SGLYPH[' ']; w += g.w + 1; } return w ? w - 1 : 0; },
    small: function (x, y, s, v, note) { // the 3×5 font (proportional), top-left at (x, y)
      s = String(s); v = v == null ? 1 : v; var x0 = x;
      for (var i = 0; i < s.length; i++) { var g = SGLYPH[s[i]] || SGLYPH[s[i].toUpperCase()] || SGLYPH[' ']; for (var r = 0; r < 5; r++) for (var b = 0; b < g.w; b++) if (g.r[r] & (16 >> b)) this.set(x + b, y + r, v); x += g.w + 1; }
      if (note) this.note(x0, y, s);
      return x - x0 - 1;
    },
    note: function (x, y, s) { if (s && String(s).trim()) this.notes.push({ x: x, y: y, s: String(s) }); },
    /* the screen as text lines, for the tests and for screen readers / the lesson-page checks */
    text: function () {
      var n = this.notes.slice().sort(function (a, b) { return a.y - b.y || a.x - b.x; }), lines = [], cur = null;
      n.forEach(function (o) { if (!cur || o.y - cur.y > 3) { cur = { y: o.y, parts: [] }; lines.push(cur); } cur.parts.push(o.s); });
      return lines.map(function (l) { return l.parts.join(' ').replace(/\s+/g, ' ').trim(); }).join('\n');
    }
  };

  /* ======================= the input editor: rows of tokens and templates (□/□, √□, ˣ√□, powers…) ======================= */
  var SLOTS = { frac: ['a', 'b'], sqrt: ['a'], root: ['n', 'a'], pow: ['e'], ten: ['e'], epow: ['e'], abs: ['a'] };
  function tk(id, s, k, extra) { var t = { k: k || 't', id: id, s: s }; if (extra) for (var q in extra) t[q] = extra[q]; return t; }
  var PRE = { sin: 'sin', cos: 'cos', tan: 'tan', asin: 'sin⁻¹', acos: 'cos⁻¹', atan: 'tan⁻¹', log: 'log', ln: 'ln', Abs: 'Abs', Int: 'Int', Frac: 'Frac', Intg: 'Intg', Sum: 'Sum', Prod: 'Prod', Dim: 'Dim', Cuml: 'Cuml', dList: 'ΔList' };
  var PRE_F = { sin: 'sin', cos: 'cos', tan: 'tan', asin: 'asin', acos: 'acos', atan: 'atan', log: 'log', ln: 'ln', Abs: 'abs', Int: 'ipart', Frac: 'fpart', Intg: 'int', Sum: 'sum', Prod: 'prod', Dim: 'dim', Cuml: 'cumsum', dList: 'dlist' };
  var FNA = { sigma: 'Σ(', seq: 'Seq(', min: 'Min(', max: 'Max(', mean: 'Mean(', median: 'Med(', round: 'RndFix(', gcd: 'GCD(', lcm: 'LCM(', rem: 'MOD(', logab: 'logab(' };
  /* the token (or template) a named action types */
  function tokOf(a) {
    if (/^[0-9.]$/.test(a)) return tk(a, a);
    switch (a) {
      case 'add': return tk('add', '+'); case 'sub': return tk('sub', '−'); case 'mul': return tk('mul', '×'); case 'div': return tk('div', '÷');
      case 'neg': return tk('neg', '⁻'); case 'lp': return tk('lp', '('); case 'rp': return tk('rp', ')'); case 'comma': return tk('comma', ',');
      case 'sto': return tk('sto', '→'); case 'exp': return tk('ee', 'ᴇ'); case 'pi': return tk('pi', 'π'); case 'ans': return tk('ans', 'Ans');
      case 'lb': return tk('lb', '{'); case 'rb': return tk('rb', '}'); case 'eqsign': return tk('eq', '=');
      case 'xt': return tk('v', 'X', 'v', { n: 'X' });
      case 'sq': return tk('sq', '2', 'post', { p: 'sq', sup: '2' }); case 'inv': return tk('inv', '-1', 'post', { p: 'inv', sup: '⁻1' });
      case 'fact': return tk('fact', '!', 'post', { p: 'fact' }); case 'deg': return tk('deg', '°', 'post', { p: 'deg' }); case 'rad': return tk('rad', 'ʳ', 'post', { p: 'rad', sup: 'r' });
      case 'npr': return tk('npr', 'P', 'op', { o: 'npr' }); case 'ncr': return tk('ncr', 'C', 'op', { o: 'ncr' });
      case 'rand': return tk('rand', 'Ran# ', 'rand'); case 'list': return tk('list', 'List ', 'list'); case 'yv': return tk('yv', 'Y', 'yv');
      case 'frac': return { k: 'frac', a: [], b: [] }; case 'sqrt': return { k: 'sqrt', a: [] }; case 'xroot': return { k: 'root', n: [], a: [] };
      case 'cbrt': return { k: 'root', n: [tk('3', '3')], a: [], cb: 1 }; case 'pow': return { k: 'pow', e: [] }; case 'tenx': return { k: 'ten', e: [] };
      case 'ex': return { k: 'epow', e: [] }; case 'absT': return { k: 'abs', a: [] };
    }
    if (PRE[a]) return tk(a, PRE[a] + ' ', 'pre', { f: PRE_F[a] });
    if (/^fn:/.test(a) && FNA[a.slice(3)]) return tk(a.slice(3), FNA[a.slice(3)], 'fn', { f: a.slice(3) });
    if (/^[A-Zθr]$/.test(a)) return tk('v', a, 'v', { n: a });
    return null;
  }
  function isTpl(t) { return t && SLOTS[t.k]; }
  function cloneRow(r) { return r.map(function (t) { if (!isTpl(t)) return t; var c = { k: t.k }; for (var q in t) if (q !== 'k') c[q] = Array.isArray(t[q]) ? cloneRow(t[q]) : t[q]; return c; }); }
  function emptyRow(r) { return !r || !r.length; }
  function Ed(rowArr) { this.root = rowArr || []; this.path = []; this.i = this.root.length; }
  Ed.prototype = {
    row: function () { var p = this.path[this.path.length - 1]; return p ? p.n[p.s] : this.root; },
    empty: function () { return !this.root.length; },
    put: function (t) {
      var r = this.row();
      if (isTpl(t)) {
        r.splice(this.i, 0, t); var sl = SLOTS[t.k], first = t.cb ? 1 : 0;
        this.path.push({ n: t, s: sl[first] }); this.i = 0; return;
      }
      r.splice(this.i, 0, t); this.i++;
    },
    right: function () {
      var r = this.row(), t = r[this.i];
      if (this.i < r.length) { if (isTpl(t)) { this.path.push({ n: t, s: SLOTS[t.k][0] }); this.i = 0; } else this.i++; return true; }
      var p = this.path[this.path.length - 1]; if (!p) return false;
      var sl = SLOTS[p.n.k], k = sl.indexOf(p.s);
      if (k < sl.length - 1) { p.s = sl[k + 1]; this.i = 0; return true; }
      this.path.pop(); var pr = this.row(); this.i = pr.indexOf(p.n) + 1; return true;
    },
    left: function () {
      var r = this.row();
      if (this.i > 0) { var t = r[this.i - 1]; if (isTpl(t)) { var sl = SLOTS[t.k]; this.path.push({ n: t, s: sl[sl.length - 1] }); this.i = t[sl[sl.length - 1]].length; } else this.i--; return true; }
      var p = this.path[this.path.length - 1]; if (!p) return false;
      var sl2 = SLOTS[p.n.k], k = sl2.indexOf(p.s);
      if (k > 0) { p.s = sl2[k - 1]; this.i = p.n[p.s].length; return true; }
      this.path.pop(); this.i = this.row().indexOf(p.n); return true;
    },
    vert: function (d) { // ▲ ▼ between a fraction's numerator and denominator (or an index and its radicand)
      for (var j = this.path.length - 1; j >= 0; j--) {
        var p = this.path[j];
        if (p.n.k === 'frac' && ((d > 0 && p.s === 'a') || (d < 0 && p.s === 'b'))) { this.path.length = j + 1; p.s = d > 0 ? 'b' : 'a'; this.i = Math.min(this.i, p.n[p.s].length); if (j < this.path.length - 1) this.i = p.n[p.s].length; return true; }
      }
      return false;
    },
    del: function () { // DEL in Math input: deletes what is left of the cursor
      var r = this.row();
      if (this.i > 0) {
        var t = r[this.i - 1];
        if (isTpl(t)) {
          var sl = SLOTS[t.k], all = sl.every(function (s) { return emptyRow(t[s]) || (t.cb && s === 'n'); });
          if (all || t.k === 'pow' || t.k === 'sqrt' || t.k === 'abs' || t.k === 'ten' || t.k === 'epow') { // remove the template, keep what was inside
            var keep = t.k === 'frac' || t.k === 'root' ? [] : (t[sl[sl.length - 1]] || []);
            if (t.k === 'ten') keep = [tk('1', '1'), tk('0', '0')].concat(keep); if (t.k === 'epow') keep = keep;
            if (!all && (t.k === 'frac' || t.k === 'root')) { this.left(); return; }
            Array.prototype.splice.apply(r, [this.i - 1, 1].concat(keep)); this.i = this.i - 1 + keep.length; return;
          }
          this.left(); return;
        }
        r.splice(this.i - 1, 1); this.i--; return;
      }
      var p = this.path[this.path.length - 1]; if (!p) return;
      var t2 = p.n, sl3 = SLOTS[t2.k];
      if (sl3.indexOf(p.s) > 0) { this.left(); return; }
      // at the start of a template's first box: take the template apart
      this.path.pop(); var pr = this.row(), at = pr.indexOf(t2), inside = [];
      sl3.forEach(function (s) { if (!(t2.cb && s === 'n')) inside = inside.concat(t2[s]); });
      if (t2.k === 'ten') inside = [tk('1', '1'), tk('0', '0')].concat(inside);
      Array.prototype.splice.apply(pr, [at, 1].concat(inside)); this.i = at;
    },
    home: function () { this.path = []; this.i = 0; },
    end: function () { this.path = []; this.i = this.root.length; }
  };

  /* ======================= tree → tokens → Casio parser (TI-84 syntax-tree nodes, so the TI evaluator works them out) ======================= */
  function flat(row, out, top) {
    out = out || [];
    row.forEach(function (t, k) {
      var at = top == null ? k : top;
      if (isTpl(t)) { var g = { k: 'grp', g: t.k, r: at }; SLOTS[t.k].forEach(function (s) { g[s] = flat(t[s], [], at); }); out.push(g); }
      else { var c = {}; for (var q in t) c[q] = t[q]; c.r = at; out.push(c); }
    });
    return out;
  }
  function exactDec(s, e10) {
    var parts = s.split('.'), dec = (parts[1] || '').length, n = Number((parts[0] || '') + (parts[1] || '') || '0'), d = Math.pow(10, dec);
    if (e10 > 0) n *= Math.pow(10, e10); else if (e10 < 0) d *= Math.pow(10, -e10);
    var safe = function (x) { return Math.abs(x) < 1e15 && x % 1 === 0; };
    return safe(n) && safe(d) ? fromQ(n, d) : V(Number(s + 'e' + e10));
  }
  function SYN(t) { return E('SYNTAX', t ? t.r : null); }
  function cparse(toks) {
    var i = 0;
    function pk() { return toks[i]; }
    function isT(id) { var t = toks[i]; return t && t.k === 't' && t.id === id; }
    function digit(t) { return t && t.k === 't' && /^[0-9.]$/.test(t.id); }
    function sub(ts) { if (!ts || !ts.length) throw E('SYNTAX', toks[i - 1] ? toks[i - 1].r : null); var p = cparse(ts); if (p.sto) throw SYN(ts[0]); return p.ast; }
    function close() { if (isT('rp')) { i++; return; } if (!pk() || isT('sto')) return; throw SYN(pk()); }
    function number() {
      var s = '', dots = 0, st = pk();
      while (digit(pk())) { if (pk().id === '.') dots++; s += pk().id; i++; }
      if (dots > 1 || s === '.') throw SYN(st);
      if (isT('ee')) {
        i++; var sg = ''; if (isT('neg') || isT('sub')) { sg = '-'; i++; } else if (isT('add')) i++;
        var ed = ''; while (digit(pk()) && pk().id !== '.') { ed += pk().id; i++; }
        if (!ed) throw SYN(pk() || st);
        return { t: 'n', v: exactDec(s || '1', Number(sg + ed)) };
      }
      return { t: 'n', v: exactDec(s, 0) };
    }
    function intAfter() { var s = ''; while (digit(pk()) && pk().id !== '.') { s += pk().id; i++; } return s ? Number(s) : null; }
    function prim() {
      var t = pk(); if (!t) throw SYN(toks[i - 1]);
      if (digit(t) || (t.k === 't' && t.id === 'ee')) return number();
      if (t.k === 't') {
        switch (t.id) {
          case 'lp': { i++; var e = expr(); close(); return e; }
          case 'pi': i++; return { t: 'c', n: 'pi' };
          case 'ans': i++; return { t: 'ans' };
          case 'lb': {
            i++; var items = [];
            if (isT('rb')) { i++; return { t: 'list', items: items }; }
            items.push(expr()); while (isT('comma')) { i++; items.push(expr()); }
            if (isT('rb')) i++; else if (pk() && !isT('sto')) throw SYN(pk());
            return { t: 'list', items: items };
          }
        }
        throw SYN(t);
      }
      switch (t.k) {
        case 'v': i++; return { t: 'v', n: t.n };
        case 'rand': i++; return { t: 'rand' };
        case 'list': { i++; var ln = intAfter(); if (!ln || ln > 6) throw SYN(t); return { t: 'lv', n: ln }; }
        case 'yv': {
          i++; var yn = intAfter(); if (!yn || yn > 20) throw SYN(t);
          if (isT('lp')) { i++; var a = expr(); close(); return { t: 'yv', n: yn, arg: a }; }
          return { t: 'yv', n: yn };
        }
        case 'fn': {
          i++; var args = [];
          if (isT('rp')) throw E('ARGUMENT', t.r);
          args.push(expr()); while (isT('comma')) { i++; args.push(expr()); }
          close();
          var f = t.f;
          if (f === 'logab') { if (args.length !== 2) throw E('ARGUMENT', t.r); return { t: 'f', f: 'logb', args: [args[1], args[0]] }; }
          if (f === 'sigma' && args.length === 5) return { t: 'f', f: 'sum', args: [{ t: 'f', f: 'seq', args: args }] };
          return { t: 'f', f: f, args: args, p: t.r };
        }
        case 'grp': {
          i++;
          switch (t.g) {
            case 'frac': return { t: 'b', o: 'div', a: sub(t.a), b: sub(t.b) };
            case 'sqrt': return { t: 'f', f: 'sqrt', args: [sub(t.a)] };
            case 'root': return { t: 'b', o: 'root', a: sub(t.n), b: sub(t.a) };
            case 'ten': return { t: 'f', f: 'tenx', args: [sub(t.e)] };
            case 'epow': return { t: 'f', f: 'ex', args: [sub(t.e)] };
            case 'abs': return { t: 'f', f: 'abs', args: [sub(t.a)] };
          }
          throw SYN(t); // a power box with nothing before it
        }
      }
      throw SYN(t);
    }
    function pw() { // x² x⁻¹ x! ° and the power box
      var v = prim();
      for (;;) {
        var t = pk();
        if (t && t.k === 'post') { i++; v = { t: 'post', p: t.p, a: v }; }
        else if (t && t.k === 'grp' && t.g === 'pow') { i++; v = { t: 'b', o: 'pow', a: v, b: sub(t.e) }; }
        else return v;
      }
    }
    function startsVar(t) { return t && (t.k === 'v' || t.k === 'yv' || (t.k === 't' && (t.id === 'pi' || t.id === 'ans'))); }
    function imp1() { var v = pw(); while (startsVar(pk())) v = { t: 'b', o: 'mul', a: v, b: pw() }; return v; } // 2π, 5A, 3X
    function pref() { // sin cos tan log ln √ (−) Abs Int … take what comes after them
      var t = pk();
      if (t && t.k === 'pre') { i++; if (!pk()) throw SYN(t); return { t: 'f', f: t.f, args: [pref()], p: t.r }; }
      if (t && t.k === 't' && t.id === 'neg') { i++; if (!pk()) throw SYN(t); return { t: 'neg', a: pref() }; }
      return imp1();
    }
    function startsImp(t) {
      if (!t) return false;
      if (t.k === 't') return /^(lp|pi|ans|neg|lb|[0-9.])$/.test(t.id);
      return t.k === 'pre' || t.k === 'fn' || (t.k === 'grp' && t.g !== 'pow') || t.k === 'v' || t.k === 'yv' || t.k === 'list' || t.k === 'rand';
    }
    function imp2() { var v = pref(); while (startsImp(pk())) v = { t: 'b', o: 'mul', a: v, b: pref() }; return v; } // 2√3, 2sin 30, 2(3+1)
    function perm() { var v = imp2(); while (pk() && pk().k === 'op') { var o = pk().o; i++; if (!pk()) throw SYN(toks[i - 1]); v = { t: 'b', o: o, a: v, b: imp2() }; } return v; }
    function mul() { var v = perm(); while (isT('mul') || isT('div')) { var o = pk().id; i++; if (!pk()) throw SYN(toks[i - 1]); v = { t: 'b', o: o, a: v, b: perm() }; } return v; }
    function add() { var v = mul(); while (isT('add') || isT('sub')) { var o = pk().id; i++; if (!pk()) throw SYN(toks[i - 1]); v = { t: 'b', o: o, a: v, b: mul() }; } return v; }
    function expr() { var v = add(); if (isT('eq')) throw SYN(pk()); return v; }
    if (!toks.length) return null;
    var ast = expr(), sto = null;
    if (isT('sto')) {
      var at = pk(); i++; var tg = pk();
      if (tg && tg.k === 'v') { sto = { k: 'v', n: tg.n }; i++; }
      else if (tg && tg.k === 'list') { i++; var nn = intAfter(); if (!nn || nn > 6) throw SYN(tg); sto = { k: 'lv', n: nn }; }
      else throw SYN(tg || at);
    }
    if (i < toks.length) throw SYN(toks[i]);
    return { ast: ast, sto: sto };
  }
  function lin(row) { // a row as one line of text (Y=… at the top of the graph, the tests)
    return row.map(function (t) {
      if (!isTpl(t)) return t.k === 'post' ? (t.p === 'sq' ? '²' : t.p === 'inv' ? '⁻¹' : t.s) : t.k === 't' && t.id === 'neg' ? '-' : t.s;
      switch (t.k) {
        case 'frac': { var sa = lin(t.a), sb = lin(t.b), simple = function (q) { return /^[0-9.A-Zθπ]+$/.test(q); }; return (simple(sa) ? sa : '(' + sa + ')') + '/' + (simple(sb) ? sb : '(' + sb + ')'); }
        case 'sqrt': return '√(' + lin(t.a) + ')';
        case 'root': return t.cb ? '³√(' + lin(t.a) + ')' : '(' + lin(t.n) + ')√(' + lin(t.a) + ')';
        case 'pow': return t.e.length === 1 && !isTpl(t.e[0]) ? '^' + lin(t.e) : '^(' + lin(t.e) + ')';
        case 'ten': return '10^(' + lin(t.e) + ')';
        case 'epow': return 'e^(' + lin(t.e) + ')';
        case 'abs': return '|' + lin(t.a) + '|';
      }
      return '';
    }).join('').replace(/ +/g, ' ');
  }

  /* ======================= numbers the Casio way ======================= */
  function digitsOf(n) { return String(Math.abs(n)).length; }
  function sqfree(n) { var a = 1, b = n; for (var k = 2; k * k <= b; k++) while (b % (k * k) === 0) { b /= k * k; a *= k; } return [a, b]; }
  function smallFrac(x, maxD, tol) { // x as p/q with q ≤ maxD, or null
    for (var q = 1; q <= maxD; q++) { var p = Math.round(x * q); if (Math.abs(x - p / q) <= tol * Math.max(1, Math.abs(x))) return [p, q]; }
    return null;
  }
  /* the exact form the Math display uses: { k:'int'|'frac'|'surd', … } or null (then a decimal) */
  function exactForm(v) {
    if (v.L) return null;
    var x = v.f;
    if (!isFinite(x)) return null;
    if (v.q) {
      if (v.q[1] === 1) return Math.abs(x) < 1e10 ? { k: 'int', n: v.q[0] } : null;
      if (digitsOf(v.q[0]) + digitsOf(v.q[1]) <= 9) return { k: 'frac', n: v.q[0], d: v.q[1] };
      return null;
    }
    if (isInt(x) && Math.abs(x) < 1e10) return { k: 'int', n: x };
    var sf = smallFrac(x, 12, 1e-13);
    if (sf && digitsOf(sf[0]) + digitsOf(sf[1]) <= 9) return sf[1] === 1 ? { k: 'int', n: sf[0] } : { k: 'frac', n: sf[0], d: sf[1] };
    // a surd: x² is a fraction with a small denominator (√171 = 3√19, cos 30 = √3/2)
    var x2 = x * x;
    if (x2 < 1e7) {
      var q2 = smallFrac(x2, 100, 3e-14);
      if (q2 && q2[0] > 0) {
        var pq = q2[0] * q2[1], ab = sqfree(pq), a = ab[0], b = ab[1], c = q2[1];
        if (b > 1) { var g = gcd(a, c); a /= g; c /= g; if (a < 100 && b < 1000 && c < 100) return { k: 'surd', s: x < 0 ? -1 : 1, a: a, b: b, c: c }; }
      }
    }
    return null;
  }
  function expStr(e) { return 'ᴇ' + (e < 0 ? '-' : '+') + (Math.abs(e) < 10 ? '0' : '') + Math.abs(e); }
  function sciStr(x, sig) {
    if (x === 0) return '0';
    var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e), ms = m.toPrecision(sig);
    if (Math.abs(Number(ms)) >= 10) { e++; m = x / Math.pow(10, e); ms = m.toPrecision(sig); }
    if (ms.indexOf('.') >= 0) ms = ms.replace(/0+$/, '').replace(/\.$/, '');
    return ms + expStr(e);
  }
  /* a decimal the way the fx-9750GIII shows it (Norm1: 10 digits, ᴇ form below 0.01 and from 10¹⁰) */
  function decStr(x, st) {
    st = st || { disp: 'Norm1' };
    if (Math.abs(x) < 1e-99) x = 0;
    if (!isFinite(x)) return 'ERROR';
    if (st.disp === 'Sci') return sciStr(x, st.dn || 10);
    if (st.disp === 'Fix') {
      if (Math.abs(x) >= 1e10) return sciStr(x, 10);
      var f = x.toFixed(st.dn); if (Number(f) === 0 && x !== 0 && st.dn < 9) { /* Casio shows 0.00 */ }
      return f.replace(/^-0(\.0*)?$/, '0$1');
    }
    if (x === 0) return '0';
    var r = Number(x.toPrecision(10)), ar = Math.abs(r), lo = st.disp === 'Norm2' ? 1e-9 : 1e-2;
    if (ar >= 1e10 || ar < lo) return sciStr(r, 10);
    var t = String(r); if (/e/.test(t)) return sciStr(r, 10);
    return t;
  }
  /* the shortest Casio form of x in n characters (table cells, the graph readouts) */
  function fitStr(x, n) {
    if (!isFinite(x)) return 'ERROR';
    for (var sig = 10; sig >= 1; sig--) { var s = decStr(Number(x.toPrecision(sig))); if (s.length <= n) return s; }
    for (var s2 = 6; s2 >= 1; s2--) { var t = sciStr(x, s2); if (t.length <= n) return t; }
    return sciStr(x, 1);
  }

  /* ======================= the key layout ======================= */
  // [id, key label, primary action, SHIFT label, SHIFT action, ALPHA label, ALPHA action, class]
  var FRAC_IC = '<svg viewBox="0 0 14 16" width="11" height="13" aria-hidden="true"><rect x="3" y="1" width="8" height="5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M1 8h12" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="10" width="8" height="5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
  var LAYOUT = [
    [['f1', 'F1', 'f1', 'TRACE', 'trace', '', null, 'fk'], ['f2', 'F2', 'f2', 'ZOOM', 'zoom', '', null, 'fk'], ['f3', 'F3', 'f3', 'V-WIN', 'vwin', '', null, 'fk'], ['f4', 'F4', 'f4', 'SKETCH', 'na:SKETCH', '', null, 'fk'], ['f5', 'F5', 'f5', 'G-SOLV', 'gsolv', '', null, 'fk'], ['f6', 'F6', 'f6', 'G↔T', 'gt', '', null, 'fk']],
    [['shift', 'SHIFT', 'shift', '', null, '', null, 'kshift'], ['optn', 'OPTN', 'optn', '', null, '', null, 'fn'], ['vars', 'VARS', 'vars', 'PRGM', 'na:PRGM', '', null, 'fn'], ['menu', 'MENU', 'menu', 'SET UP', 'setup', '', null, 'fn']],
    [['alpha', 'ALPHA', 'alpha', 'A-LOCK', 'alock', '', null, 'kalpha'], ['sq', 'x<sup>2</sup>', 'sq', '√', 'sqrt', 'r', 'r', 'fn'], ['pow', '^', 'pow', '<sup>x</sup>√', 'xroot', 'θ', 'θ', 'fn'], ['exit', 'EXIT', 'exit', 'QUIT', 'quit', '', null, 'fn']],
    [['xt', 'X,θ,T', 'xt', '', null, 'A', 'A', 'fn sm'], ['log', 'log', 'log', '10<sup>x</sup>', 'tenx', 'B', 'B', 'fn'], ['ln', 'ln', 'ln', 'e<sup>x</sup>', 'ex', 'C', 'C', 'fn'], ['sin', 'sin', 'sin', 'sin<sup>-1</sup>', 'asin', 'D', 'D', 'fn'], ['cos', 'cos', 'cos', 'cos<sup>-1</sup>', 'acos', 'E', 'E', 'fn'], ['tan', 'tan', 'tan', 'tan<sup>-1</sup>', 'atan', 'F', 'F', 'fn']],
    [['frac', FRAC_IC, 'frac', '□□/□', 'na:mixed fractions', 'G', 'G', 'fn'], ['sd', 'S⇔D', 'sd', '', null, 'H', 'H', 'fn sm'], ['lp', '(', 'lp', '<sup>3</sup>√', 'cbrt', 'I', 'I', 'fn'], ['rp', ')', 'rp', 'x<sup>-1</sup>', 'inv', 'J', 'J', 'fn'], ['comma', ',', 'comma', '', null, 'K', 'K', 'fn'], ['sto', '→', 'sto', '', null, 'L', 'L', 'fn']],
    [['7', '7', '7', 'CAPTURE', 'na:CAPTURE', 'M', 'M', 'num'], ['8', '8', '8', 'CLIP', 'na:CLIP', 'N', 'N', 'num'], ['9', '9', '9', 'PASTE', 'na:PASTE', 'O', 'O', 'num'], ['del', 'DEL', 'del', 'INS', 'ins', '', null, 'kdel'], ['ac', 'AC<small>/ON</small>', 'ac', 'OFF', 'off', '', null, 'kac']],
    [['4', '4', '4', 'CATALOG', 'na:CATALOG', 'P', 'P', 'num'], ['5', '5', '5', 'FORMAT', 'na:FORMAT', 'Q', 'Q', 'num'], ['6', '6', '6', '', null, 'R', 'R', 'num'], ['mul', '×', 'mul', '{', 'lb', 'S', 'S', 'num op'], ['div', '÷', 'div', '}', 'rb', 'T', 'T', 'num op']],
    [['1', '1', '1', 'List', 'list', 'U', 'U', 'num'], ['2', '2', '2', 'Mat', 'na:matrices', 'V', 'V', 'num'], ['3', '3', '3', '', null, 'W', 'W', 'num'], ['add', '+', 'add', '[', 'na:matrices', 'X', 'X', 'num op'], ['sub', '−', 'sub', ']', 'na:matrices', 'Y', 'Y', 'num op']],
    [['0', '0', '0', 'i', 'na:complex numbers', 'Z', 'Z', 'num'], ['.', '.', '.', '=', 'eqsign', 'SPACE', 'na:SPACE', 'num'], ['exp', '×10<sup>x</sup>', 'exp', 'π', 'pi', '"', 'na:"', 'num sm'], ['neg', '(−)', 'neg', 'Ans', 'ans', '', null, 'num'], ['exe', 'EXE', 'exe', '↵', 'na:↵', '', null, 'kexe']]
  ];
  var KEY = {};
  LAYOUT.forEach(function (row) { row.forEach(function (k) { KEY[k[0]] = { id: k[0], a: k[2], s: k[4], al: k[6], lab: k[1], sl: k[3] }; }); });
  ['up', 'down', 'left', 'right'].forEach(function (d) { KEY[d] = { id: d, a: d, s: d, al: null }; });
  var ALPHA_KEY = {}; Object.keys(KEY).forEach(function (id) { if (KEY[id].al && /^[A-Zθr]$/.test(KEY[id].al)) ALPHA_KEY[KEY[id].al] = id; });

  /* ======================= function menus (the F1–F6 bar at the bottom of the screen) ======================= */
  // an item: { l: label, a: action that types | c: command | sub: menu | page: menu (▷) | na: 1 }
  function I(l, o) { o = o || {}; o.l = l; return o; }
  var NA1 = function (l) { return I(l, { na: 1 }); };
  var FM = {
    run: [I('JUMP', { sub: 'jump' }), I('DEL', { c: 'hdel' }), NA1('MAT'), I('MATH', { sub: 'math' }), null, null],
    jump: [I('TOP', { c: 'htop' }), I('BTM', { c: 'hbot' }), null, null, null, null],
    math: [NA1('MAT'), I('logab', { a: 'fn:logab' }), I('Abs', { a: 'absT' }), I('Σ(', { a: 'fn:sigma' }), NA1('∫dx'), NA1('d/dx')],
    optn1: [I('LIST', { sub: 'list1' }), NA1('MAT'), NA1('CPLX'), I('CALC', { sub: 'calc1' }), NA1('STAT'), I('▷', { page: 'optn2' })],
    optn2: [NA1('HYP'), I('PROB', { sub: 'prob' }), I('NUM', { sub: 'num1' }), I('ANGL', { sub: 'angle' }), NA1('ESYM'), I('▷', { page: 'optn3' })],
    optn3: [NA1('PICT'), NA1('FMEM'), NA1('LOGIC'), NA1('CAPT'), NA1('TVM'), I('▷', { page: 'optn1' })],
    list1: [I('List', { a: 'list' }), NA1('L→M'), I('Dim', { a: 'Dim' }), NA1('Fill'), I('Seq', { a: 'fn:seq' }), I('▷', { page: 'list2' })],
    list2: [I('Min', { a: 'fn:min' }), I('Max', { a: 'fn:max' }), I('Mean', { a: 'fn:mean' }), I('Med', { a: 'fn:median' }), NA1('Aug'), I('▷', { page: 'list3' })],
    list3: [I('Sum', { a: 'Sum' }), I('Prod', { a: 'Prod' }), I('Cuml', { a: 'Cuml' }), NA1('%'), I('ΔList', { a: 'dList' }), I('▷', { page: 'list1' })],
    calc1: [NA1('Solve'), NA1('d/dx'), NA1('d²/d'), NA1('∫dx'), NA1('SolvN'), I('▷', { page: 'calc2' })],
    calc2: [NA1('FMin'), NA1('FMax'), I('Σ(', { a: 'fn:sigma' }), I('logab', { a: 'fn:logab' }), NA1('Int÷'), I('▷', { page: 'calc1' })],
    prob: [I('x!', { a: 'fact' }), I('nPr', { a: 'npr' }), I('nCr', { a: 'ncr' }), I('Ran#', { a: 'rand' }), NA1('P('), null],
    num1: [I('Abs', { a: 'Abs' }), I('Int', { a: 'Int' }), I('Frac', { a: 'Frac' }), NA1('Rnd'), I('Intg', { a: 'Intg' }), I('▷', { page: 'num2' })],
    num2: [I('RndFi', { a: 'fn:round' }), I('GCD', { a: 'fn:gcd' }), I('LCM', { a: 'fn:lcm' }), I('MOD', { a: 'fn:rem' }), null, I('▷', { page: 'num1' })],
    angle: [I('°', { a: 'deg' }), I('r', { a: 'rad' }), NA1('g'), NA1("°'\""), NA1('►DMS'), null],
    vars: [NA1('VWIN'), NA1('FACTR'), NA1('STAT'), I('GRAPH', { sub: 'vgraph' }), NA1('DYNA'), null],
    vgraph: [I('Y', { a: 'yv' }), NA1('r'), NA1('Xt'), NA1('Yt'), NA1('X'), null],
    glist: [I('SEL', { c: 'sel' }), I('DEL', { c: 'fdel' }), I('TYPE', { sub: 'type1' }), I('STYL', { sub: 'style' }), NA1('MOD'), I('DRAW', { c: 'draw' })],
    tlist: [I('SEL', { c: 'sel' }), I('DEL', { c: 'fdel' }), I('TYPE', { sub: 'type1' }), I('STYL', { sub: 'style' }), I('SET', { c: 'tset' }), I('TABL', { c: 'table' })],
    type1: [I('Y=', { c: 'type:Y=' }), NA1('r='), NA1('Parm'), NA1('X='), NA1('CONV'), I('▷', { page: 'type2' })],
    type2: [I('Y>', { c: 'type:Y>' }), I('Y<', { c: 'type:Y<' }), I('Y≥', { c: 'type:Y≥' }), I('Y≤', { c: 'type:Y≤' }), null, I('▷', { page: 'type1' })],
    style: [I('Norm', { c: 'style:0' }), I('Thick', { c: 'style:1' }), I('Brokn', { c: 'style:2' }), I('Dot', { c: 'style:3' }), null, null],
    tablem: [NA1('FORM'), NA1('DEL'), NA1('ROW'), NA1('EDIT'), NA1('GCON'), NA1('GPLT')],
    vwin: [I('INIT', { c: 'w:init' }), I('TRIG', { c: 'w:trig' }), I('STD', { c: 'w:std' }), NA1('VMEM'), null, null],
    zoom1: [I('BOX', { c: 'z:box' }), NA1('FACT'), I('IN', { c: 'z:in' }), I('OUT', { c: 'z:out' }), I('AUTO', { c: 'z:auto' }), I('▷', { page: 'zoom2' })],
    zoom2: [I('ORIG', { c: 'z:orig' }), I('SQR', { c: 'z:sq' }), NA1('RND'), I('INTG', { c: 'z:int' }), I('PRE', { c: 'z:pre' }), I('▷', { page: 'zoom1' })],
    gsolv1: [I('ROOT', { c: 'gs:root' }), I('MAX', { c: 'gs:max' }), I('MIN', { c: 'gs:min' }), I('YICPT', { c: 'gs:yicpt' }), I('ISCT', { c: 'gs:isct' }), I('▷', { page: 'gsolv2' })],
    gsolv2: [I('Y-CAL', { c: 'gs:ycal' }), I('X-CAL', { c: 'gs:xcal' }), NA1('∫dx'), null, null, I('▷', { page: 'gsolv1' })],
    yesno: [I('Yes', { c: 'yes' }), null, null, null, null, I('No', { c: 'no' })],
    dig1: [I('0', { c: 'dn:0' }), I('1', { c: 'dn:1' }), I('2', { c: 'dn:2' }), I('3', { c: 'dn:3' }), I('4', { c: 'dn:4' }), I('▷', { page: 'dig2' })],
    dig2: [I('5', { c: 'dn:5' }), I('6', { c: 'dn:6' }), I('7', { c: 'dn:7' }), I('8', { c: 'dn:8' }), I('9', { c: 'dn:9' }), I('▷', { page: 'dig1' })]
  };
  var GS_LABEL = { root: 'ROOT', max: 'MAX', min: 'MIN', yicpt: 'Y-ICEPT', isct: 'ISCT', ycal: 'Y-CAL', xcal: 'X-CAL' };

  /* SET UP: [key, label, options [shown, value, unavailable?]] */
  var SETUP = [
    ['io', 'Input/Output', [['Math', 'Math'], ['Line', 'Line', 1]]],
    ['frac', 'Frac Result', [['d/c', 'd/c'], ['ab/c', 'ab/c']]],
    ['func', 'Func Type', [['Y=', 'Y='], ['r=', 'r=', 1], ['Parm', 'Parm', 1], ['X=', 'X=', 1]]],
    ['draw', 'Draw Type', [['Connect', 'Con'], ['Plot', 'Plot']]],
    ['deriv', 'Derivative', [['On', 1, 1], ['Off', 0]]],
    ['angle', 'Angle', [['Deg', 'Deg'], ['Rad', 'Rad'], ['Gra', 'Gra', 1]]],
    ['cplx', 'Complex Mode', [['Real', 'Real'], ['a+bi', 'a+bi', 1], ['r∠θ', 'r∠θ', 1]]],
    ['coord', 'Coord', [['On', true], ['Off', false]]],
    ['grid', 'Grid', [['On', 1], ['Off', 0], ['Line', 2]]],
    ['axes', 'Axes', [['On', true], ['Off', false]]],
    ['label', 'Label', [['On', true], ['Off', false]]],
    ['disp', 'Display', [['Fix', 'Fix'], ['Sci', 'Sci'], ['Norm', 'Norm'], ['Eng', 'Eng', 1]]]
  ];
  var SETUP_ROW = {}; SETUP.forEach(function (r, i) { SETUP_ROW[r[0]] = i; });
  var APPS = [['1', 'Run-Matrix', 'RUN', 'run'], ['2', 'Statistics', 'STAT'], ['3', 'Graph', 'GRAPH', 'graph'], ['4', 'Dyna Graph', 'DYNA'], ['5', 'Table', 'TABLE', 'table'], ['6', 'Recursion', 'RECUR'],
    ['7', 'Conic Graphs', 'CONIC'], ['8', 'Equation', 'EQUA'], ['9', 'Program', 'PRGM'], ['A', 'Financial', 'FINANCE'], ['B', 'Memory', 'MEMORY'], ['C', 'System', 'SYSTEM']];
  var INIT_WIN = { xmin: -6.3, xmax: 6.3, xscl: 1, ymin: -3.1, ymax: 3.1, yscl: 1 };
  var GWX = 126, GHY = 62; // the graph is 127 × 63 dots: x = Xmin + c·dot for c = 0 … 126
  var VW_ROWS = [['xmin', 'Xmin'], ['xmax', ' max'], ['xscl', ' scale'], ['dot', ' dot'], ['ymin', 'Ymin'], ['ymax', ' max'], ['yscl', ' scale']];
  var TS_ROWS = [['start', ' Start'], ['end', ' End'], ['step', ' Step']];
  var NF = 20;
  var ERR_NAME = { 'SYNTAX': 'Syntax ERROR', 'DOMAIN': 'Math ERROR', 'DIVIDE BY 0': 'Math ERROR', 'OVERFLOW': 'Math ERROR', 'NONREAL ANSWERS': 'Non-Real ERROR', 'ARGUMENT': 'Argument ERROR', 'DATA TYPE': 'Dimension ERROR', 'DIM MISMATCH': 'Dimension ERROR', 'INVALID DIM': 'Dimension ERROR', 'INVALID': 'Math ERROR', 'WINDOW RANGE': 'Range ERROR', 'RANGE': 'Range ERROR', 'NOT FOUND': 'Not Found', 'NO SIGN CHANGE': 'Not Found', 'BOUND': 'Range ERROR' };
  var ERR_HELP = {
    'Syntax ERROR': 'Something is typed wrong: check the brackets, use (−) for a negative number, and ► to leave a box.',
    'Math ERROR': 'The answer can’t be worked out: dividing by 0, tan 90, sin⁻¹ of a number bigger than 1, or too big.',
    'Non-Real ERROR': 'The answer is not a real number (e.g. the square root of a negative number).',
    'Argument ERROR': 'This function has the wrong number of values in its brackets.',
    'Dimension ERROR': 'A list was used where a number is needed, or two lists have different lengths.',
    'Range ERROR': 'Check the V-Window (Xmin < max, Ymin < max) or the table settings (Start, End, Step).',
    'Not Found': 'There is no solution in the window that is on the screen. Change the V-Window and try again.'
  };

  /* ======================= the calculator ======================= */
  function Fx() {
    var b = this.b = new TI.Calc(); // the TI-84's evaluator does the arithmetic (and holds A–Z, Ans and the window)
    b.vars.r = ZERO(); b.mode.angle = 'DEG';
    this.st = { io: 'Math', frac: 'd/c', func: 'Y=', draw: 'Con', deriv: 0, angle: 'Deg', cplx: 'Real', coord: true, grid: 0, axes: true, label: false, disp: 'Norm1', dn: 0 };
    this.app = 'run'; this.scr = 'run';
    this.shift = false; this.alpha = false; this.alock = false;
    this.fm = []; this.pop = null; this.on = true; this.ver = 0;
    this.hist = []; this.ed = new Ed(); this.hsel = -1; this.last = null;
    this.F = []; for (var i = 0; i < NF; i++) this.F.push({ row: [], on: true, type: 'Y=', style: 0, ver: 0 });
    this.fl = { row: 0, top: 0, ed: null };
    this.win = b.win; for (var k in INIT_WIN) this.win[k] = INIT_WIN[k];
    this.vw = { row: 0, top: 0, ed: null, ret: 'glist' };
    this.ts = { start: 1, end: 5, step: 1, row: 0, ed: null };
    this.tb = { xs: [], r: 0, c: 0, top: 0, c0: 0, ed: null };
    this.g = { mode: 'none' }; this.zprev = null;
    this.su = { row: 0, top: 0, ask: null, ret: 'run' };
    this.mm = { sel: 0, from: 'run' };
    this.astc = {};
    var self = this;
    b.yAst = function (i, quiet) { return self.fAst(i, quiet); };
    b.active = function () { return self.drawn(); };
  }
  var P = Fx.prototype;

  /* ---------- keys ---------- */
  P.press = function (a) {
    if (!this.on) { if (a === 'ac') { this.on = true; } return; }
    if (KEY[a]) return this.key(a);
    this.shift = false; if (!this.alock) this.alpha = false;
    return this.act(a);
  };
  P.key = function (id) {
    var K = KEY[id], a;
    if (id === 'shift') { this.shift = !this.shift; return; }
    if (id === 'alpha') {
      if (this.shift) { this.shift = false; this.alock = this.alpha = true; return; }
      if (this.alpha) { this.alpha = this.alock = false; return; }
      this.alpha = true; return;
    }
    if (this.shift) { this.shift = false; a = K.s; if (!a) return; }
    else if (this.alpha && K.al) { a = K.al; if (!this.alock) this.alpha = false; }
    else { if (this.alpha && !this.alock) this.alpha = false; a = K.a; }
    return this.act(a);
  };
  P.toHome = function (clear) {
    this.pop = null; this.fm = []; this.shift = this.alpha = this.alock = false; this.on = true;
    this.app = 'run'; this.scr = 'run'; this.g = { mode: 'none' }; this.ed = new Ed(); this.hsel = -1;
    this.fl.row = 0; this.fl.top = 0; this.fl.ed = null; this.vw.ed = null; this.ts.ed = null; this.tb.ed = null; this.su.row = 0; this.su.top = 0; this.su.ask = null;
    if (clear) this.hist = [];
  };
  P.homeScr = function () { return this.app === 'graph' ? 'glist' : this.app === 'table' ? 'tlist' : 'run'; };
  P.na = function (what) { this.popup(['Not on this', 'calculator', '', 'Press:[EXIT]'], 'UNAVAILABLE', null, what); };
  P.popup = function (lines, code, back, detail) { this.pop = { lines: lines, code: code, back: back || null, detail: detail || '' }; this.shift = false; if (!this.alock) this.alpha = false; };
  P.fail = function (code, back) {
    var name = ERR_NAME[code] || 'Math ERROR';
    this.err = { code: code, msg: name };
    this.popup(name === 'Not Found' ? ['Not Found', '', 'Press:[EXIT]'] : [name, '', 'Press:[EXIT]'].concat(back && back.scr === 'run' ? ['[◄][►]:Goto'] : []), code, back);
  };
  P.popKey = function (a) {
    var p = this.pop;
    if (p.code === 'DELETE') { if (a === 'f1' || a === 'exe') { this.pop = null; this.fm = []; this.F[this.fl.row].row = []; this.F[this.fl.row].ver++; this.ver++; } else if (a === 'f6' || a === 'exit' || a === 'ac') { this.pop = null; this.fm = []; } return; }
    if (a === 'exit' || a === 'ac' || a === 'exe' || a === 'quit') { this.pop = null; this.closedPop(p); return; }
    if ((a === 'left' || a === 'right') && p.back && p.back.scr === 'run') {
      this.pop = null; this.ed = new Ed(cloneRow(p.back.row)); if (p.back.pos != null) { this.ed.i = Math.min(p.back.pos + (a === 'right' ? 1 : 0), this.ed.root.length); } return;
    }
  };
  P.closedPop = function (p) {
    if (p.code === 'NOT FOUND' || p.code === 'NO SIGN CHANGE') { this.g = { mode: 'none' }; this.fm = []; }
    if (p.back && p.back.scr === 'glist') { this.scr = this.homeScr(); this.fl.row = p.back.row; }
    if (p.back && p.back.scr === 'vwin') { this.scr = 'vwin'; }
    if (p.back && p.back.scr === 'tset') { this.scr = 'tset'; }
  };
  P.act = function (a) {
    if (this.pop) return this.popKey(a);
    if (/^na:/.test(a)) return this.na(a.slice(3));
    switch (a) {
      case 'menu': this.leave(); if (this.scr !== 'menu') this.mm.from = this.scr; this.scr = 'menu'; this.fm = []; this.mm.sel = Math.max(0, APPS.findIndex(function (x) { return x[3] === this.app; }, this)); return;
      case 'setup': this.leave(); if (this.scr !== 'setup') this.su.ret = this.scr; this.scr = 'setup'; this.fm = []; this.su.ask = null; return;
      case 'quit': this.leave(); this.fm = []; this.g = { mode: 'none' }; this.scr = this.homeScr(); return;
      case 'off': this.on = false; return;
      case 'alock': this.alpha = this.alock = true; return;
    }
    if (/^f[1-6]$/.test(a)) return this.fkey(+a[1] - 1);
    if (a === 'exit' && this.fm.length) { this.fm.pop(); if (this.scr === 'setup') this.su.ask = null; return; }
    switch (this.scr) {
      case 'menu': return this.menuKey(a);
      case 'run': return this.runKey(a);
      case 'glist': case 'tlist': return this.listKey(a);
      case 'graph': return this.graphKey(a);
      case 'vwin': return this.vwKey(a);
      case 'tset': return this.tsKey(a);
      case 'table': return this.tableKey(a);
      case 'setup': return this.suKey(a);
    }
  };
  /* the F-menu on the screen now: an open OPTN / VARS / sub-menu, or the screen's own */
  P.curMenu = function () {
    if (this.fm.length) return FM[this.fm[this.fm.length - 1]];
    switch (this.scr) {
      case 'run': return FM.run;
      case 'glist': return FM.glist;
      case 'tlist': return FM.tlist;
      case 'table': return FM.tablem;
      case 'vwin': return FM.vwin;
      case 'setup': return this.suMenu();
    }
    return null;
  };
  P.fkey = function (k) {
    var m = this.curMenu();
    if (this.scr === 'graph' && !this.fm.length) { // the graph screen: F1 Trace, F2 Zoom, F3 V-Window, F5 G-Solv, F6 G↔T
      return this.act(['trace', 'zoom', 'vwin', 'na:SKETCH', 'gsolv', 'gt'][k]);
    }
    var it = m && m[k]; if (!it) return;
    if (it.na) return this.na(it.l);
    if (it.sub) { this.fm.push(it.sub); return; }
    if (it.page) { if (this.fm.length) this.fm[this.fm.length - 1] = it.page; else this.fm.push(it.page); return; }
    if (it.a) { var ed = this.edFor(true); if (ed) this.typeAct(it.a, ed); return; }
    if (it.c) return this.cmd(it.c);
  };
  /* the editor that typing goes into on this screen (a function row starts one) */
  P.edFor = function (start) {
    switch (this.scr) {
      case 'run': return this.ed;
      case 'glist': case 'tlist': if (!this.fl.ed && start) this.fl.ed = new Ed([]); return this.fl.ed;
      case 'vwin': if (!this.vw.ed && start) this.vw.ed = new Ed([]); return this.vw.ed;
      case 'tset': if (!this.ts.ed && start) this.ts.ed = new Ed([]); return this.ts.ed;
      case 'table': if (!this.tb.ed && start && this.tb.c === 0) this.tb.ed = new Ed([]); return this.tb.ed;
      case 'graph': return this.g.inp || null;
    }
    return null;
  };
  var ANS_FIRST = { add: 1, sub: 1, mul: 1, div: 1, sq: 1, inv: 1, fact: 1, deg: 1, rad: 1, npr: 1, ncr: 1, pow: 1, sto: 1 };
  P.typeAct = function (a, ed) {
    var t = tokOf(a); if (!t) return false;
    if (ed === this.ed && ed.empty() && this.scr === 'run' && ANS_FIRST[t.id || t.k] && this.hist.length) ed.put(tk('ans', 'Ans'));
    ed.put(t); return true;
  };
  P.leave = function () { // leaving a screen: a value being typed is kept
    if (this.scr === 'vwin' && this.vw.ed) this.commitVw(true);
    if (this.scr === 'tset' && this.ts.ed) this.commitTs(true);
    if ((this.scr === 'glist' || this.scr === 'tlist') && this.fl.ed) this.commitF();
    this.tb.ed = null; if (this.g.inp) this.g = { mode: 'none' };
  };
  P.cmd = function (c) {
    var fl = this.fl, F = this.F[fl.row], w = this.win, self = this;
    if (/^type:/.test(c)) { if (fl.ed) this.commitF(); F.type = c.slice(5); F.ver++; this.ver++; this.fm = []; return; }
    if (/^style:/.test(c)) { if (fl.ed) this.commitF(); F.style = +c.slice(6); this.ver++; this.fm = []; return; }
    if (/^dn:/.test(c)) { this.st.disp = this.su.ask; this.st.dn = +c.slice(3); this.su.ask = null; this.fm = []; this.ver++; return; }
    if (/^gs:/.test(c)) return this.gsolv(c.slice(3));
    if (/^z:/.test(c)) return this.zoomCmd(c.slice(2));
    if (/^w:/.test(c)) { if (this.vw.ed) this.vw.ed = null; this.setWin(c === 'w:init' ? INIT_WIN : c === 'w:std' ? { xmin: -10, xmax: 10, xscl: 1, ymin: -10, ymax: 10, yscl: 1 } : this.st.angle === 'Deg' ? { xmin: -540, xmax: 540, xscl: 90, ymin: -1.6, ymax: 1.6, yscl: 0.5 } : { xmin: -3 * Math.PI, xmax: 3 * Math.PI, xscl: Math.PI / 2, ymin: -1.6, ymax: 1.6, yscl: 0.5 }); return; }
    switch (c) {
      case 'htop': this.fm = []; if (this.hist.length) this.hsel = 0; return;
      case 'hbot': this.fm = []; this.hsel = -1; return;
      case 'hdel': if (this.hsel >= 0) { this.hist.splice(this.hsel, 1); this.hsel = Math.min(this.hsel, this.hist.length - 1); } return;
      case 'sel': if (fl.ed) this.commitF(); F.on = !F.on; this.ver++; return;
      case 'fdel': if (fl.ed) fl.ed = null; if (!F.row.length) return; this.pop = { lines: ['Delete One?', '', 'Yes:[F1]', 'No :[F6]'], code: 'DELETE' }; return;
      case 'draw': this.leave(); return this.draw();
      case 'tset': this.leave(); this.scr = 'tset'; this.ts.row = 0; this.ts.ed = null; this.fm = []; return;
      case 'table': this.leave(); return this.showTable();
    }
  };

  /* ---------- MENU ---------- */
  P.menuKey = function (a) {
    var m = this.mm, n = APPS.length;
    switch (a) {
      case 'left': m.sel = (m.sel + n - 1) % n; return;
      case 'right': m.sel = (m.sel + 1) % n; return;
      case 'up': m.sel = (m.sel + n - 4) % n; return;
      case 'down': m.sel = (m.sel + 4) % n; return;
      case 'exe': return this.openApp(m.sel);
      case 'exit': this.scr = m.from || 'run'; return;
    }
    var keyCh = { xt: 'A', log: 'B', ln: 'C' }[a] || a;
    for (var k = 0; k < n; k++) if (APPS[k][0] === keyCh) { m.sel = k; return this.openApp(k); }
  };
  P.openApp = function (k) {
    var ap = APPS[k]; if (!ap[3]) return this.na(ap[1]);
    this.app = ap[3]; this.fm = []; this.g = { mode: 'none' }; this.hsel = -1;
    this.scr = this.homeScr(); if (this.scr !== 'run') { this.fl.ed = null; }
  };

  /* ---------- RUN-MAT ---------- */
  P.runKey = function (a) {
    var ed = this.ed;
    if (this.hsel >= 0 && !/^(up|down|exe)$/.test(a)) { if (a === 'left' || a === 'right') { this.ed = new Ed(cloneRow(this.hist[this.hsel].row)); this.hsel = -1; if (a === 'right') this.ed.home(); return; } this.hsel = -1; }
    switch (a) {
      case 'exe':
        if (this.hsel >= 0) { var h = this.hist[this.hsel]; this.hsel = -1; this.ed = new Ed(cloneRow(h.row)); return; }
        return this.exec();
      case 'ac': if (!ed.empty()) this.ed = new Ed(); else this.hist = []; return;
      case 'exit': return;
      case 'up': if (ed.vert(-1)) return; if (this.hist.length) this.hsel = this.hsel < 0 ? this.hist.length - 1 : Math.max(0, this.hsel - 1); return;
      case 'down': if (ed.vert(1)) return; if (this.hsel >= 0) { this.hsel++; if (this.hsel >= this.hist.length) this.hsel = -1; } return;
      case 'left': if (ed.empty() && this.last) { this.ed = new Ed(cloneRow(this.last)); return; } ed.left(); return;
      case 'right': if (ed.empty() && this.last) { this.ed = new Ed(cloneRow(this.last)); this.ed.home(); return; } ed.right(); return;
      case 'del': ed.del(); return;
      case 'ins': return;
      case 'sd': return this.toggleSD();
      case 'optn': this.fm = ['optn1']; return;
      case 'vars': this.fm = ['vars']; return;
      case 'trace': case 'zoom': case 'vwin': case 'gsolv': case 'gt': return;
    }
    this.typeAct(a, ed);
  };
  P.evalRow = function (row) {
    var p = cparse(flat(row)); if (!p) throw E('SYNTAX');
    var b = this.b; b.depth = 0;
    var v = chk(b.ev(p.ast, null));
    return { v: v, sto: p.sto };
  };
  P.exec = function () {
    var row = this.ed.root, again = false;
    if (!row.length) { if (!this.last) return; row = cloneRow(this.last); again = true; }
    var res;
    try {
      res = this.evalRow(row);
      if (res.sto) {
        if (res.sto.k === 'lv') { if (!res.v.L) throw E('DATA TYPE'); this.b.lists[res.sto.n] = res.v.L.slice(); }
        else { if (res.v.L) throw E('DATA TYPE'); this.b.vars[res.sto.n] = res.v; }
        this.ver++;
      }
    } catch (e) { if (!e.calc) throw e; if (!again) this.fail(e.code, { scr: 'run', row: cloneRow(row), pos: e.pos }); else this.fail(e.code); return; }
    this.b.ans = res.v;
    this.last = cloneRow(row);
    this.hist.push({ row: cloneRow(row), v: res.v, show: 'auto' }); if (this.hist.length > 30) this.hist.shift();
    this.ed = new Ed();
  };
  /* what an answer shows: an exact form (fraction, surd) or null for a decimal */
  P.shown = function (h) {
    if (h.show === 'dec') return null;
    if (h.show === 'frac') { var q = fracOf(h.v); return q ? (q[1] === 1 ? { k: 'int', n: q[0] } : { k: 'frac', n: q[0], d: q[1] }) : null; }
    return exactForm(h.v);
  };
  P.toggleSD = function () {
    var h = this.hist[this.hist.length - 1]; if (!h || h.v.L) return;
    var ex = this.shown(h);
    if (ex && ex.k !== 'int') { h.show = 'dec'; return; }
    if (!ex) { var q = fracOf(h.v); if (q && q[1] !== 1 && h.show !== 'frac') { h.show = h.show === 'dec' && exactForm(h.v) ? 'auto' : 'frac'; return; } if (h.show === 'dec' && exactForm(h.v)) h.show = 'auto'; }
  };

  /* ---------- the function list (GRAPH and TABLE share it) ---------- */
  P.fAst = function (i, quiet) {
    var F = this.F[i]; if (!F || !F.row.length) return null;
    var c = this.astc[i];
    if (!c || c.ver !== F.ver) {
      var ast = null, err = null;
      try { var p = cparse(flat(F.row)); if (p.sto) throw E('SYNTAX'); ast = p.ast; } catch (e) { if (!e.calc) throw e; err = e; }
      c = this.astc[i] = { ver: F.ver, ast: ast, err: err };
    }
    if (c.err && !quiet) throw c.err;
    return c.err ? null : c.ast;
  };
  P.drawn = function () { var out = []; for (var i = 0; i < NF; i++) if (this.F[i].on && this.F[i].row.length) out.push(i); return out; };
  P.yfns = function () { var self = this; return this.drawn().filter(function (i) { return self.F[i].type === 'Y='; }); };
  P.fx = function (i, x) { return this.b.fx(i, x); };
  P.checkFns = function (list) {
    for (var k = 0; k < list.length; k++) { try { this.fAst(list[k]); } catch (e) { if (!e.calc) throw e; this.fail(e.code, { scr: 'glist', row: list[k] }); return false; } }
    return true;
  };
  P.commitF = function () { var fl = this.fl, F = this.F[fl.row]; if (!fl.ed) return; F.row = fl.ed.root; F.ver++; if (F.row.length) F.on = true; fl.ed = null; this.fm = []; this.ver++; };
  P.listKey = function (a) {
    var fl = this.fl, ed = fl.ed;
    if (ed) {
      switch (a) {
        case 'exe': this.commitF(); if (fl.row < NF - 1) fl.row++; return;
        case 'up': case 'down': if (ed.vert(a === 'up' ? -1 : 1)) return; this.commitF(); fl.row = Math.max(0, Math.min(NF - 1, fl.row + (a === 'up' ? -1 : 1))); return;
        case 'ac': fl.ed = null; return;
        case 'exit': this.commitF(); return;
        case 'left': ed.left(); return;
        case 'right': ed.right(); return;
        case 'del': ed.del(); return;
        case 'optn': this.fm = ['optn1']; return;
        case 'vars': this.fm = ['vars']; return;
        case 'sd': case 'sto': return;
        case 'trace': case 'zoom': case 'gsolv': case 'gt': case 'ins': return;
        case 'vwin': this.commitF(); return this.openVw();
      }
      this.typeAct(a, ed); return;
    }
    switch (a) {
      case 'up': fl.row = Math.max(0, fl.row - 1); return;
      case 'down': fl.row = Math.min(NF - 1, fl.row + 1); return;
      case 'exe': return this.app === 'table' ? this.showTable() : this.draw();
      case 'left': case 'right': case 'del': fl.ed = new Ed(cloneRow(this.F[fl.row].row)); if (a === 'right') fl.ed.home(); if (a === 'del') fl.ed.del(); return;
      case 'ac': case 'exit': case 'sd': case 'sto': case 'ins': case 'trace': case 'zoom': case 'gsolv': return;
      case 'gt': if (this.app === 'graph') return this.draw(); return;
      case 'vwin': return this.openVw();
      case 'optn': fl.ed = new Ed([]); this.fm = ['optn1']; return;
      case 'vars': fl.ed = new Ed([]); this.fm = ['vars']; return;
    }
    if (!tokOf(a)) return;
    fl.ed = new Ed([]); this.typeAct(a, fl.ed); // typing on a row replaces it
  };

  /* ---------- V-Window and Table Setting: a field takes an expression; typing replaces the old value ---------- */
  P.dot = function () { return (this.win.xmax - this.win.xmin) / GWX; };
  P.ydot = function () { return (this.win.ymax - this.win.ymin) / GHY; };
  P.vwVal = function (k) { return k === 'dot' ? r14(this.dot()) : this.win[k]; };
  P.evalField = function (row) { var r = this.evalRow(row); if (r.sto || r.v.L) throw E('SYNTAX'); return r.v.f; };
  P.setWin = function (o) { this.zprev = Object.assign({}, this.win); for (var k in o) this.win[k] = o[k]; this.ver++; };
  P.openVw = function () { this.leave(); this.vw.ret = this.scr === 'graph' ? 'graph' : this.homeScr(); this.scr = 'vwin'; this.vw.row = 0; this.vw.ed = null; this.fm = []; };
  P.fieldKey = function (a, o, n, commit) {
    switch (a) {
      case 'up': case 'down': case 'exe': if (o.ed && !commit()) return true; o.row = Math.max(0, Math.min(n - 1, o.row + (a === 'up' ? -1 : 1))); return true;
      case 'left': if (o.ed) o.ed.left(); return true;
      case 'right': if (o.ed) o.ed.right(); return true;
      case 'ac': o.ed = null; return true;
      case 'del': if (o.ed) o.ed.del(); return true;
      case 'optn': if (!o.ed) o.ed = new Ed([]); this.fm = ['optn1']; return true;
      case 'vars': if (!o.ed) o.ed = new Ed([]); this.fm = ['vars']; return true;
    }
    var t = tokOf(a); if (!t || a === 'sto') return true;
    if (!o.ed) o.ed = new Ed([]);
    this.typeAct(a, o.ed); return true;
  };
  P.vwKey = function (a) {
    var self = this;
    if (a === 'exit' || a === 'quit') { if (this.vw.ed && !this.commitVw()) return; this.scr = this.vw.ret; if (this.scr === 'graph') { this.g = { mode: 'none' }; this.draw(); } return; }
    if (a === 'vwin') return;
    this.fieldKey(a, this.vw, VW_ROWS.length, function () { return self.commitVw(); });
  };
  P.commitVw = function (quiet) {
    var o = this.vw, k = VW_ROWS[o.row][0]; if (!o.ed) return true;
    if (!o.ed.root.length) { o.ed = null; return true; }
    var x;
    try { x = this.evalField(o.ed.root); } catch (e) { if (!e.calc) throw e; o.ed = null; if (!quiet) this.fail(e.code, { scr: 'vwin' }); return false; }
    var w = this.win;
    if (k === 'dot') { if (x <= 0) { o.ed = null; if (!quiet) this.fail('RANGE', { scr: 'vwin' }); return false; } w.xmax = r14(w.xmin + x * GWX); }
    else w[k] = x;
    o.ed = null; this.ver++; return true;
  };
  P.tsKey = function (a) {
    var self = this;
    if (a === 'exit' || a === 'quit') { if (this.ts.ed && !this.commitTs()) return; this.scr = 'tlist'; return; }
    this.fieldKey(a, this.ts, TS_ROWS.length, function () { return self.commitTs(); });
  };
  P.commitTs = function (quiet) {
    var o = this.ts; if (!o.ed) return true;
    if (!o.ed.root.length) { o.ed = null; return true; }
    var x;
    try { x = this.evalField(o.ed.root); } catch (e) { if (!e.calc) throw e; o.ed = null; if (!quiet) this.fail(e.code, { scr: 'tset' }); return false; }
    o[TS_ROWS[o.row][0]] = x; o.ed = null; return true;
  };

  /* ---------- TABLE ---------- */
  P.tcols = function () { var self = this; return this.drawn().filter(function (i) { return self.F[i].type === 'Y='; }); };
  P.showTable = function () {
    var cols = this.tcols(); if (!this.checkFns(cols)) return;
    var t = this.ts, xs = [];
    if (!t.step || (t.end - t.start) / t.step < 0) { this.fail('RANGE', { scr: 'tset' }); return; }
    var n = Math.floor((t.end - t.start) / t.step + 1e-9) + 1;
    if (n > 999) { this.fail('RANGE', { scr: 'tset' }); return; }
    for (var k = 0; k < n; k++) xs.push(r14(t.start + k * t.step));
    this.tb = { xs: xs, r: 0, c: 0, top: 0, c0: 0, ed: null };
    this.scr = 'table'; this.fm = [];
  };
  P.TROWS = 4;
  P.tableKey = function (a) {
    var tb = this.tb, ncol = this.tcols().length + 1;
    if (tb.ed) {
      switch (a) {
        case 'exe': { var x; try { x = this.evalField(tb.ed.root); } catch (e) { if (!e.calc) throw e; tb.ed = null; this.fail(e.code); return; } tb.xs[tb.r] = x; tb.ed = null; return; }
        case 'ac': case 'exit': tb.ed = null; return;
        case 'del': tb.ed.del(); return;
        case 'left': tb.ed.left(); return; case 'right': tb.ed.right(); return;
        case 'up': case 'down': tb.ed = null; break;
        default: this.typeAct(a, tb.ed); return;
      }
    }
    switch (a) {
      case 'up': if (tb.r > 0) tb.r--; if (tb.r < tb.top) tb.top = tb.r; return;
      case 'down': if (tb.r < tb.xs.length - 1) tb.r++; if (tb.r >= tb.top + this.TROWS) tb.top = tb.r - this.TROWS + 1; return;
      case 'left': if (tb.c > 0) tb.c--; if (tb.c > 0 && tb.c <= tb.c0) tb.c0 = tb.c - 1; if (tb.c === 0) tb.c0 = 0; return;
      case 'right': if (tb.c < ncol - 1) tb.c++; if (tb.c - tb.c0 > 2) tb.c0 = tb.c - 2; return;
      case 'exit': this.scr = 'tlist'; return;
      case 'exe': case 'ac': case 'optn': case 'vars': return;
      case 'gt': return;
    }
    if (tb.c === 0 && tokOf(a) && a !== 'sto') { tb.ed = new Ed([]); this.typeAct(a, tb.ed); }
  };
  P.cell = function (r, c) { var x = this.tb.xs[r]; if (c === 0) return x; var i = this.tcols()[c - 1]; return this.fx(i, x); };

  /* ---------- SET UP ---------- */
  P.suVal = function (r) { var row = SETUP[r], v = this.st[row[0]]; if (row[0] === 'disp') return v === 'Fix' || v === 'Sci' ? v + this.st.dn : v; for (var k = 0; k < row[2].length; k++) if (row[2][k][1] === v) return row[2][k][0]; return String(v); };
  P.suMenu = function () {
    if (this.su.ask) return FM[this.fm.length ? this.fm[this.fm.length - 1] : 'dig1'];
    var row = SETUP[this.su.row];
    var m = row[2].map(function (o) { var lab = o[0].length > 5 ? String(o[1]) : o[0]; return o[2] ? I(lab, { na: 1 }) : I(lab, { c: 'su:' + row[0] + ':' + o[0] }); });
    while (m.length < 6) m.push(null);
    return m;
  };
  P.suKey = function (a) {
    var su = this.su, n = SETUP.length;
    if (su.ask) {
      if (/^[0-9]$/.test(a)) { this.st.disp = su.ask; this.st.dn = +a; su.ask = null; this.fm = []; this.ver++; return; }
      if (a === 'exit') { su.ask = null; this.fm = []; return; }
      return;
    }
    switch (a) {
      case 'up': su.row = Math.max(0, su.row - 1); return;
      case 'down': su.row = Math.min(n - 1, su.row + 1); return;
      case 'exit': case 'exe': this.scr = su.ret || this.homeScr(); if (this.scr === 'graph') this.draw(); return;
    }
  };
  var cmd0 = P.cmd;
  P.cmd = function (c) {
    if (!/^su:/.test(c)) return cmd0.call(this, c);
    var parts = c.split(':'), key = parts[1], lab = parts.slice(2).join(':'), row = SETUP[SETUP_ROW[key]], opt = null;
    row[2].forEach(function (o) { if (o[0] === lab) opt = o; });
    if (!opt) return;
    if (key === 'disp') {
      if (opt[1] === 'Norm') { this.st.disp = this.st.disp === 'Norm1' ? 'Norm2' : 'Norm1'; this.ver++; return; }
      this.su.ask = opt[1]; this.fm = ['dig1']; return;
    }
    this.st[key] = opt[1];
    if (key === 'angle') this.b.mode.angle = opt[1] === 'Rad' ? 'RAD' : 'DEG';
    this.ver++;
  };

  /* ---------- GRAPH: drawing, Trace, Zoom, G-Solv ---------- */
  P.draw = function () {
    var w = this.win;
    if (!this.checkFns(this.drawn())) return false;
    if (!(w.xmin < w.xmax) || !(w.ymin < w.ymax)) { this.fail('RANGE', { scr: 'vwin' }); this.vw.ret = 'glist'; return false; }
    this.app = this.app === 'table' ? 'table' : 'graph';
    this.scr = 'graph'; this.g = { mode: 'none' }; this.fm = []; return true;
  };
  P.colX = function (c) { return r14(this.win.xmin + c * this.dot()); };
  P.mid = function () { return this.colX(63); };
  P.graphKey = function (a) {
    var g = this.g, self = this;
    if (g.inp) { // X: / Y: typed for Trace, Y-CAL, X-CAL
      switch (a) {
        case 'exe': {
          var x; try { x = this.evalField(g.inp.root); } catch (e) { if (!e.calc) throw e; this.g = { mode: 'none' }; this.fail(e.code); return; }
          var then = g.then; g.inp = null; return then.call(this, x);
        }
        case 'ac': if (!g.inp.empty()) g.inp = new Ed([]); else { g.inp = null; if (g.mode !== 'trace') this.g = { mode: 'none' }; } return;
        case 'exit': g.inp = null; if (g.mode !== 'trace') this.g = { mode: 'none' }; return;
        case 'del': g.inp.del(); return;
        case 'left': g.inp.left(); return; case 'right': g.inp.right(); return;
      }
      this.typeAct(a, g.inp); return;
    }
    if (this.fm.length) { // the Zoom / G-Solv menu is up: only EXIT and the F keys
      if (a === 'ac') { this.fm = []; return; }
      if (a === 'trace' || a === 'vwin' || a === 'gt') { this.fm = []; } else if (a !== 'zoom' && a !== 'gsolv') return;
    }
    switch (a) {
      case 'exit': case 'ac': if (g.mode !== 'none') { this.g = { mode: 'none' }; return; } if (a === 'exit') this.scr = this.homeScr(); return;
      case 'gt': this.g = { mode: 'none' }; this.scr = this.homeScr(); return;
      case 'trace': return this.startTrace();
      case 'zoom': this.g = { mode: 'none' }; this.fm = ['zoom1']; return;
      case 'gsolv': this.g = { mode: 'none' }; this.fm = ['gsolv1']; return;
      case 'vwin': return this.openVw();
    }
    switch (g.mode) {
      case 'trace':
        if (a === 'left' || a === 'right') return this.traceMove(a === 'right' ? 1 : -1);
        if (a === 'up' || a === 'down') { var d = this.drawn().filter(function (i) { return self.F[i].type === 'Y=' || /[<>≤≥]/.test(self.F[i].type); }); var k = d.indexOf(g.fi); g.fi = d[(k + (a === 'down' ? 1 : d.length - 1)) % d.length]; return; }
        if (/^[0-9.]$/.test(a) || a === 'neg' || a === 'sub' || a === 'pi') { g.inp = new Ed([]); g.label = 'X:'; g.then = function (x) { this.g.x = x; }; this.typeAct(a === 'sub' ? 'neg' : a, g.inp); }
        return;
      case 'sel':
        if (a === 'up' || a === 'down') { var cand = g.cand, j = cand.indexOf(g.fi); g.fi = cand[(j + (a === 'down' ? 1 : cand.length - 1)) % cand.length]; return; }
        if (a === 'exe') { g.picked.push(g.fi); g.cand = g.cand.filter(function (i) { return g.picked.indexOf(i) < 0; }); if (g.picked.length >= g.need) return this.solveWith(g.kind, g.picked); if (g.cand.length) g.fi = g.cand[0]; return; }
        return;
      case 'res':
        if (a === 'right' && g.k < g.sols.length - 1) { g.k++; this.setXY(); return; }
        if (a === 'left' && g.k > 0) { g.k--; this.setXY(); return; }
        if (a === 'exe') return;
        return;
      case 'ptr':
        if (/^(up|down|left|right)$/.test(a)) { if (a === 'left') g.cx = Math.max(0, g.cx - 1); else if (a === 'right') g.cx = Math.min(GWX, g.cx + 1); else if (a === 'up') g.cy = Math.max(0, g.cy - 1); else g.cy = Math.min(GHY, g.cy + 1); return; }
        if (a === 'exe') return this.ptrEnter();
        return;
    }
    if (/^(up|down|left|right)$/.test(a)) { this.g = { mode: 'ptr', act: 'free', cx: 63, cy: 31 }; return this.graphKey(a); }
  };
  P.startTrace = function () {
    var d = this.drawn(); if (!d.length) { this.g = { mode: 'ptr', act: 'free', cx: 63, cy: 31 }; return; }
    var x = this.g && this.g.mode === 'trace' ? this.g.x : this.mid();
    this.g = { mode: 'trace', fi: d[0], x: x }; this.fm = [];
  };
  P.traceMove = function (d) {
    var g = this.g, w = this.win, dot = this.dot();
    g.x = r14(g.x + d * dot);
    if (g.x > w.xmax + dot / 2 || g.x < w.xmin - dot / 2) { var sh = r14(31 * dot * d); w.xmin = r14(w.xmin + sh); w.xmax = r14(w.xmax + sh); this.ver++; }
  };
  P.ptrX = function (g) { return r14(this.win.xmin + g.cx * this.dot()); };
  P.ptrY = function (g) { return r14(this.win.ymax - g.cy * this.ydot()); };
  P.ptrEnter = function () {
    var g = this.g, w = this.win, x = this.ptrX(g), y = this.ptrY(g);
    if (g.act === 'in' || g.act === 'out') {
      var f = g.act === 'in' ? 0.5 : 2, hw = (w.xmax - w.xmin) / 2 * f, hh = (w.ymax - w.ymin) / 2 * f;
      this.setWin({ xmin: r14(x - hw), xmax: r14(x + hw), ymin: r14(y - hh), ymax: r14(y + hh) }); this.g = { mode: 'none' }; return;
    }
    if (g.act === 'box') {
      if (!g.stage) { g.stage = 1; g.bx = g.cx; g.by = g.cy; return; }
      if (g.cx === g.bx || g.cy === g.by) return;
      var x0 = this.ptrX({ cx: g.bx }), y0 = this.ptrY({ cy: g.by });
      this.setWin({ xmin: Math.min(x0, x), xmax: Math.max(x0, x), ymin: Math.min(y0, y), ymax: Math.max(y0, y) }); this.g = { mode: 'none' }; return;
    }
  };
  P.zoomCmd = function (z) {
    var w = this.win, self = this; this.fm = [];
    switch (z) {
      case 'box': case 'in': case 'out': this.g = { mode: 'ptr', act: z, cx: 63, cy: 31, stage: 0 }; return;
      case 'orig': this.setWin(INIT_WIN); break;
      case 'sq': { var dx = this.dot(), yc = (w.ymin + w.ymax) / 2; this.setWin({ ymin: r14(yc - dx * GHY / 2), ymax: r14(yc + dx * GHY / 2) }); break; }
      case 'int': { var xc = Math.round((w.xmin + w.xmax) / 2), yc2 = Math.round((w.ymin + w.ymax) / 2); this.setWin({ xmin: xc - 63, xmax: xc + 63, xscl: 10, ymin: yc2 - 31, ymax: yc2 + 31, yscl: 10 }); break; }
      case 'pre': if (this.zprev) { var p = this.zprev; this.zprev = Object.assign({}, w); for (var k in p) w[k] = p[k]; this.ver++; } break;
      case 'auto': {
        var lo = Infinity, hi = -Infinity;
        this.yfns().forEach(function (i) { for (var c = 0; c <= GWX; c++) { var y = self.fx(i, self.colX(c)); if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); } } });
        if (isFinite(lo)) { if (hi - lo < 1e-9) { lo -= 1; hi += 1; } var pad = (hi - lo) * 0.05; this.setWin({ ymin: r14(lo - pad), ymax: r14(hi + pad) }); }
        break;
      }
    }
    this.g = { mode: 'none' };
  };
  P.gsolv = function (kind) {
    this.fm = [];
    var d = this.drawn().filter(function (i) { return this.F[i].type === 'Y=' || kind !== 'isct'; }, this), need = kind === 'isct' ? 2 : 1;
    if (d.length < need) { this.fail('NOT FOUND'); return; }
    if (d.length > need) { this.g = { mode: 'sel', kind: kind, need: need, cand: d.slice(), picked: [], fi: d[0] }; return; }
    return this.solveWith(kind, d.slice(0, need));
  };
  /* every x in the window where f(x) = 0: sign changes, and touching (a double root) */
  P.rootsOf = function (f) {
    var w = this.win, L = w.xmin, R = w.xmax, N = 4 * GWX, out = TI.crossings(f, L, R, N), span = R - L;
    var ys = []; for (var k = 0; k <= N; k++) ys.push(f(L + span * k / N));
    for (var j = 1; j < N; j++) {
      var a0 = Math.abs(ys[j - 1]), a1 = Math.abs(ys[j]), a2 = Math.abs(ys[j + 1]);
      if (!(isFinite(a0) && isFinite(a1) && isFinite(a2)) || !(a1 <= a0 && a1 <= a2) || (ys[j - 1] < 0) !== (ys[j + 1] < 0)) continue;
      var lo = L + span * (j - 1) / N, hi = L + span * (j + 1) / N, gr = (Math.sqrt(5) - 1) / 2, c = hi - gr * (hi - lo), dd = lo + gr * (hi - lo), fc = Math.abs(f(c)), fd = Math.abs(f(dd));
      for (var n = 0; n < 120; n++) { if (fc < fd) { hi = dd; dd = c; fd = fc; c = hi - gr * (hi - lo); fc = Math.abs(f(c)); } else { lo = c; c = dd; fc = fd; dd = lo + gr * (hi - lo); fd = Math.abs(f(dd)); } }
      var xm = (lo + hi) / 2, scale = Math.max(1, Math.abs(ys[j - 1]) + Math.abs(ys[j + 1]));
      if (Math.abs(f(xm)) < 1e-9 * scale) out.push(xm);
    }
    out = out.map(function (x) { return TI.nice(f, x, function (p, q) { return Math.abs(p) <= Math.abs(q); }); });
    out.sort(function (p, q) { return p - q; });
    var uniq = []; out.forEach(function (x) { if (!uniq.length || Math.abs(x - uniq[uniq.length - 1]) > 1e-7 * Math.max(1, span)) uniq.push(x); });
    return uniq.filter(function (x) { return x >= L - 1e-12 && x <= R + 1e-12; });
  };
  P.extrema = function (fi, max) {
    var w = this.win, L = w.xmin, R = w.xmax, N = 4 * GWX, span = R - L, self = this, ys = [], out = [];
    for (var k = 0; k <= N; k++) { var y = this.fx(fi, L + span * k / N); ys.push(isFinite(y) ? (max ? y : -y) : NaN); }
    for (var j = 1; j < N; j++) {
      if (!(ys[j] >= ys[j - 1] && ys[j] >= ys[j + 1]) || !(ys[j] > ys[j - 1] || ys[j] > ys[j + 1])) continue;
      var x = this.b.extremum(fi, L + span * (j - 1) / N, L + span * (j + 1) / N, L + span * j / N, max);
      if (x > L && x < R) out.push(x);
    }
    out.sort(function (p, q) { return p - q; });
    var uniq = []; out.forEach(function (x) { if (!uniq.length || Math.abs(x - uniq[uniq.length - 1]) > 1e-6 * Math.max(1, span)) uniq.push(x); });
    return uniq.map(function (x) { return { x: x, y: r14(self.fx(fi, x)) }; });
  };
  P.solveWith = function (kind, fis) {
    var self = this, fi = fis[0], f = function (x) { return self.fx(fi, x); }, sols = [];
    var done = function (list) {
      if (!list.length) { self.g = { mode: 'none' }; self.fail('NOT FOUND'); return; }
      self.g = { mode: 'res', kind: kind, fi: fi, fis: fis, sols: list, k: 0 }; self.setXY();
    };
    switch (kind) {
      case 'root': sols = this.rootsOf(f).map(function (x) { return { x: x, y: 0 }; }); return done(sols);
      case 'max': case 'min': return done(this.extrema(fi, kind === 'max'));
      case 'yicpt': { var y0 = f(0); return done(isFinite(y0) ? [{ x: 0, y: r14(y0) }] : []); }
      case 'isct': { var fj = fis[1], h = function (x) { return self.fx(fi, x) - self.fx(fj, x); }; return done(this.rootsOf(h).map(function (x) { return { x: x, y: r14(self.fx(fi, x)) }; })); }
      case 'ycal': this.g = { mode: 'inp', kind: kind, fi: fi, inp: new Ed([]), label: 'X:', then: function (x) { var y = f(x); done(isFinite(y) ? [{ x: x, y: r14(y) }] : []); } }; return;
      case 'xcal': this.g = { mode: 'inp', kind: kind, fi: fi, inp: new Ed([]), label: 'Y:', then: function (y) { done(this.rootsOf(function (x) { return f(x) - y; }).map(function (x) { return { x: x, y: y }; })); } }; return;
    }
  };
  P.setXY = function () { var s = this.g.sols[this.g.k]; this.b.vars.X = V(s.x); this.b.vars.Y = V(s.y); };

  /* ---------- what the screen shows, as a number (tests and the demo checks) ---------- */
  P.value = function () {
    if (this.pop) return { kind: 'error', code: this.pop.code };
    if (this.scr === 'run') { var h = this.hist[this.hist.length - 1]; return h ? { kind: 'ans', v: h.v.L ? h.v.L.map(function (x) { return x.f; }) : h.v.f } : { kind: 'none' }; }
    if (this.scr === 'table') { var tb = this.tb; return { kind: 'cell', v: this.cell(tb.r, tb.c), x: tb.xs[tb.r] }; }
    if (this.scr === 'graph') { var g = this.g; if (g.mode === 'res') { var s = g.sols[g.k]; return { kind: 'point', x: s.x, y: s.y, label: g.kind }; } if (g.mode === 'trace') return { kind: 'point', x: g.x, y: this.fx(g.fi, g.x), label: 'trace' }; }
    return { kind: 'screen', scr: this.scr };
  };

  /* ======================= natural display: boxes { w, h, ax (the middle line), draw(lcd, x, y, v) } ======================= */
  function glyphs(s, extra) {
    s = String(s);
    return { w: 6 * s.length + (extra || 0), h: 7, ax: 3, lin: s, draw: function (L, x, y, v) { for (var i = 0; i < s.length; i++) L.ch(x + 6 * i, y, s[i], v); } };
  }
  function hbox(items) {
    var ax = 3, below = 4, w = 0;
    items.forEach(function (b) { ax = Math.max(ax, b.ax); below = Math.max(below, b.h - b.ax); w += b.w; });
    var box = {
      w: w, h: ax + below, ax: ax, items: items,
      draw: function (L, x, y, v) { var cx = x; items.forEach(function (b, k) { if (box.cur === k && box.ctx) box.ctx.cur = { x: cx, y: y + ax - 3 }; b.draw(L, cx, y + ax - b.ax, v); cx += b.w; }); if (box.cur === items.length && box.ctx) box.ctx.cur = { x: cx, y: y + ax - 3 }; }
    };
    return box;
  }
  function sup(inner) { // a raised box: its bottom sits on the middle line of the text before it
    return { w: inner.w, h: inner.h, ax: inner.h, draw: function (L, x, y, v) { inner.draw(L, x, y, v); } };
  }
  function holder() { return { w: 6, h: 7, ax: 3, draw: function (L, x, y, v) { for (var i = 0; i < 5; i++) { if (!(i % 2)) { L.set(x + i, y, v); L.set(x + i, y + 6, v); } } for (var j = 0; j < 7; j++) if (!(j % 2)) { L.set(x, y + j, v); L.set(x + 4, y + j, v); } } }; }
  function fracBox(N, D) {
    var W = Math.max(N.w, D.w) + 1;
    return { w: W + 2, h: N.h + 3 + D.h, ax: N.h + 1, draw: function (L, x, y, v) { N.draw(L, x + 1 + Math.floor((W - N.w) / 2), y, v); L.hl(x, x + W, y + N.h + 1, v); D.draw(L, x + 1 + Math.floor((W - D.w) / 2), y + N.h + 3, v); } };
  }
  function sqrtBox(A) {
    return { w: A.w + 6, h: A.h + 2, ax: A.ax + 2, draw: function (L, x, y, v) { var b = y + A.h + 1; L.set(x, b - 3, v); L.set(x + 1, b - 2, v); L.set(x + 1, b - 1, v); L.set(x + 2, b, v); L.vl(x + 3, y, b, v); L.hl(x + 3, x + A.w + 5, y, v); A.draw(L, x + 5, y + 2, v); } };
  }
  function rootBox(N, A) {
    var R = sqrtBox(A), nw = Math.max(0, N.w - 3), off = Math.max(0, N.h - (R.h - 4));
    return { w: nw + R.w, h: off + R.h, ax: off + R.ax, draw: function (L, x, y, v) { N.draw(L, x, y + off + R.h - 4 - N.h, v); R.draw(L, x + nw, y + off, v); } };
  }
  function absBox(A) { return { w: A.w + 5, h: A.h + 2, ax: A.ax + 1, draw: function (L, x, y, v) { L.vl(x + 1, y, y + A.h + 1, v); L.vl(x + A.w + 3, y, y + A.h + 1, v); A.draw(L, x + 3, y + 1, v); } }; }
  /* an editor row laid out (ctx.ed / ctx.cur: where the cursor is drawn) */
  function layRow(row, ctx) {
    var items = [];
    row.forEach(function (t) { items.push(layTok(t, ctx)); });
    if (!row.length) items.push(ctx && (ctx.noHolder || ctx.bare === row) ? { w: 0, h: 7, ax: 3, draw: function () {} } : holder());
    var b = hbox(items);
    if (ctx && ctx.ed && ctx.ed.row() === row) { b.cur = Math.min(ctx.ed.i, items.length); if (!row.length) b.cur = 0; b.ctx = ctx; }
    return b;
  }
  function layTok(t, ctx) {
    switch (t.k) {
      case 'frac': return fracBox(layRow(t.a, ctx), layRow(t.b, ctx));
      case 'sqrt': return sqrtBox(layRow(t.a, ctx));
      case 'root': return rootBox(layRow(t.n, ctx), layRow(t.a, ctx));
      case 'pow': return sup(layRow(t.e, ctx));
      case 'ten': return hbox([glyphs('10'), sup(layRow(t.e, ctx))]);
      case 'epow': return hbox([glyphs('e'), sup(layRow(t.e, ctx))]);
      case 'abs': return absBox(layRow(t.a, ctx));
      case 'post': if (t.sup) return sup(glyphs(t.sup === '⁻1' ? '⁻1' : t.sup)); return glyphs(t.s);
    }
    return glyphs(t.s);
  }
  function negStr(s) { return String(s).replace(/-/g, '⁻'); }
  /* an answer laid out: a fraction, a surd or a decimal */
  function layAns(v, ex, st) {
    if (v.L) return glyphs('{' + v.L.map(function (x) { var e = exactForm(x); return e && e.k === 'frac' ? negStr(e.n + '⌟' + e.d) : negStr(e && e.k === 'int' ? String(e.n) : decStr(x.f, st)); }).join(',') + '}');
    if (!ex) { var b = glyphs(negStr(decStr(v.f, st))); b.lin = decStr(v.f, st); return b; }
    if (ex.k === 'int') { var bi = glyphs(negStr(String(ex.n))); bi.lin = String(ex.n); return bi; }
    if (ex.k === 'frac') {
      var n = ex.n, d = ex.d, sg = n < 0 ? '-' : '', an = Math.abs(n), parts = [];
      if (sg) parts.push(glyphs('⁻'));
      if (st && st.frac === 'ab/c' && an > d) { var whole = Math.floor(an / d); parts.push(glyphs(String(whole))); an -= whole * d; }
      parts.push(fracBox(glyphs(String(an)), glyphs(String(d))));
      var hb = hbox(parts); hb.lin = sg + (st && st.frac === 'ab/c' && Math.abs(n) > d ? Math.floor(Math.abs(n) / d) + ' ' + an + '/' + d : Math.abs(n) + '/' + d); return hb;
    }
    // a surd: (sign) a√b / c
    var top = hbox([].concat(ex.a > 1 ? [glyphs(String(ex.a))] : [], [sqrtBox(glyphs(String(ex.b)))]));
    var body = ex.c > 1 ? fracBox(top, glyphs(String(ex.c))) : top, sb = hbox((ex.s < 0 ? [glyphs('⁻')] : []).concat([body]));
    sb.lin = (ex.s < 0 ? '-' : '') + (ex.a > 1 ? ex.a : '') + '√' + ex.b + (ex.c > 1 ? '/' + ex.c : ''); return sb;
  }

  /* ======================= painting the screen ======================= */
  var MENU_Y = 57;
  P.fmenu = function (L, m) {
    if (!m) return;
    for (var k = 0; k < 6; k++) {
      var it = m[k]; if (!it) continue;
      var x = k * 21 + 1, w = 20;
      if (it.page) { L.small(x + 8, MENU_Y + 1, '▷'); L.note(x, MENU_Y, '▷'); continue; }
      L.rect(x, MENU_Y, w, 7, 1);
      if (it.sub) { L.set(x + w - 1, MENU_Y, 0); L.set(x + w - 2, MENU_Y, 0); L.set(x + w - 1, MENU_Y + 1, 0); }
      var tw = L.sw(it.l), sx = x + Math.max(0, Math.floor((w - tw) / 2));
      L.clipX = [x, x + w]; L.small(sx, MENU_Y + 1, it.l, 0); L.clipX = [0, LW];
      L.note(x, MENU_Y, it.l);
    }
  };
  P.status = function (L) {
    var x = 0;
    if (this.shift || this.alpha) { L.rect(0, 0, 5, 7, 1); L.small(1, 1, this.shift ? 'S' : this.alock ? 'A' : 'a', 0); x = 7; }
    var s = this.st, d = s.disp === 'Fix' || s.disp === 'Sci' ? s.disp + s.dn : s.disp;
    L.small(x, 1, [s.io, s.angle, d, s.frac, s.cplx].join('  ').replace(/  /g, ' '));
    L.frame(117, 1, 9, 5, 1); L.vl(126, 2, 4, 1); L.rect(118, 2, 6, 3, 1); // a battery
  };
  P.paint = function (L, blink) {
    L.clear();
    if (!this.on) return;
    var scr = this.scr;
    if (scr === 'menu') this.paintMenu(L);
    else if (scr === 'graph') this.paintGraph(L, blink);
    else {
      this.status(L);
      switch (scr) {
        case 'run': this.paintRun(L, blink); break;
        case 'glist': case 'tlist': this.paintList(L, blink); break;
        case 'vwin': this.paintFields(L, blink, 'View Window', VW_ROWS, this.vw, function (k) { return this.vwVal(k); }); break;
        case 'tset': this.paintFields(L, blink, 'Table Setting', TS_ROWS, this.ts, function (k) { return this.ts[k]; }); break;
        case 'table': this.paintTable(L, blink); break;
        case 'setup': this.paintSetup(L); break;
      }
      this.fmenu(L, this.curMenu());
    }
    if (this.pop) this.paintPop(L);
  };
  P.cursor = function (L, ctx, blink) { if (ctx.cur && blink !== false) { L.vl(ctx.cur.x, ctx.cur.y - 1, ctx.cur.y + 7, 1); if (this.shift || this.alpha) L.vl(ctx.cur.x + 1, ctx.cur.y - 1, ctx.cur.y + 7, 1); } };
  /* draw a laid-out box in the band y0…y1, scrolled sideways so the cursor shows */
  P.drawEd = function (L, box, ctx, x, y, maxW, blink, right) {
    var off = 0;
    if (ctx && ctx.ed) { var probe = new LCD(); probe.clipX = [-1e4, 1e4]; box.draw(probe, 0, 0, 1); var cx = ctx.cur ? ctx.cur.x : 0; if (cx > maxW - 3) off = cx - maxW + 4; ctx.cur = null; }
    var sx = right ? x + maxW - box.w : x - off;
    var save = L.clipX; L.clipX = [x, x + maxW]; box.draw(L, sx, y, 1); L.clipX = save;
    if (ctx) this.cursor(L, ctx, blink);
    if (box.lin != null) L.note(sx, y, box.lin);
  };
  P.paintRun = function (L, blink) {
    var top = 8, bot = 56, st = this.st, self = this, blocks = [];
    this.hist.forEach(function (h, i) {
      var inb = layRow(h.row); inb.lin = lin(h.row);
      var outb = layAns(h.v, self.shown(h), st);
      blocks.push({ b: inb, sel: i === self.hsel }); blocks.push({ b: outb, right: true });
    });
    var ctx = { ed: this.ed, bare: this.ed.root }, cur = layRow(this.ed.root, ctx); cur.lin = lin(this.ed.root);
    blocks.push({ b: cur, ctx: ctx });
    var H = 0; blocks.forEach(function (o) { o.h = o.b.h + 1; H += o.h; });
    var y = bot - H;
    if (this.hsel >= 0) { var yy = 0; for (var k = 0; k < this.hsel * 2; k++) yy += blocks[k].h; if (y + yy < top) y = top - yy; }
    var clip = function (fn) { var s = L.set; L.set = function (px, py, v) { if (py >= top && py < bot) s.call(L, px, py, v); }; fn(); L.set = s; };
    clip(function () {
      blocks.forEach(function (o) {
        if (y >= top - 1 && y + o.h <= bot + 1) { // whole lines only, as on the real screen
          if (o.ctx) self.drawEd(L, o.b, o.ctx, 0, y, 127, blink);
          else if (o.right) self.drawEd(L, o.b, null, 1, y, 126, blink, true);
          else { self.drawEd(L, o.b, null, 0, y, 127, blink); if (o.sel) L.inv(0, y - 1, Math.min(127, o.b.w + 1), o.b.h + 2); }
        }
        y += o.h;
      });
    });
  };
  P.paintList = function (L, blink) {
    var fl = this.fl, self = this, y0 = 16, bot = 56;
    L.str(0, 8, (this.app === 'table' ? 'Table' : 'Graph') + ' Func  :Y=');
    if (fl.row < fl.top) fl.top = fl.row;
    for (;;) { // keep the row with the cursor on the screen
      var y = y0, seen = false;
      for (var r = fl.top; r < NF && y < bot; r++) { var hh = this.rowH(r); if (r === fl.row) { seen = y + hh <= bot; break; } y += hh; }
      if (seen || fl.top >= fl.row) break; fl.top++;
    }
    var yy = y0;
    for (var i = fl.top; i < NF && yy < bot; i++) {
      var F = this.F[i], editing = i === fl.row && fl.ed, row = editing ? fl.ed.root : F.row, ctx = editing ? { ed: fl.ed } : null;
      var box = layRow(row, ctx || { noHolder: true }), h = this.rowH(i);
      var name = 'Y' + (i + 1), sym = row.length || editing ? (F.type === 'Y=' ? '=' : F.type.slice(1)) : ':';
      var ty = yy + Math.max(0, box.ax - 3);
      var nx = 6 * name.length; L.str(0, ty, name, 1, false); L.ch(nx, ty, sym);
      if (F.on && F.row.length && sym !== ':') L.inv(nx - 1, ty - 1, 7, 9);
      var ex = nx + 6;
      this.drawEd(L, box, ctx, ex, yy, 127 - ex, blink); L.note(0, ty, name + sym + (editing ? '' : lin(row)));
      if (i === fl.row && !editing) L.inv(ex - 1, yy - 1, 128 - ex, Math.min(h, bot - yy + 1));
      if (F.style && F.row.length) L.small(122, ty + 1, ['', '▬', '-', '.'][F.style] || '');
      yy += h;
    }
  };
  P.rowH = function (i) { var fl = this.fl, row = i === fl.row && fl.ed ? fl.ed.root : this.F[i].row; return Math.max(8, layRow(row, { noHolder: true }).h + 1); };
  P.paintFields = function (L, blink, title, rows, o, val) {
    L.str(0, 8, title);
    if (o.row < o.top) o.top = o.row; if (o.row > o.top + 4) o.top = o.row - 4;
    for (var k = o.top; k < Math.min(rows.length, o.top + 5); k++) {
      var y = 16 + (k - o.top) * 8; L.str(0, y, rows[k][1]); L.str(36, y, ':');
      if (k === o.row && o.ed) { var ctx = { ed: o.ed }, b = layRow(o.ed.root, ctx); this.drawEd(L, b, ctx, 42, y, 85, blink); }
      else { var s = decStr(val.call(this, rows[k][0])), w = L.str(42, y, negStr(s), 1, false); L.note(42, y, s); if (k === o.row) L.inv(41, y - 1, w + 1, 9); }
    }
  };
  P.paintTable = function (L, blink) {
    var tb = this.tb, cols = this.tcols(), self = this, xw = 34, yw = 46;
    var vis = [0].concat([1, 2].map(function (k) { return tb.c0 + k; }).filter(function (k) { return k <= cols.length; }));
    var colX = [0], x = xw; vis.slice(1).forEach(function () { colX.push(x); x += yw; });
    vis.forEach(function (c, j) {
      var w = j ? yw : xw, nm = c === 0 ? 'X' : 'Y' + (cols[c - 1] + 1), tw = 6 * nm.length;
      L.str(colX[j] + Math.floor((w - tw) / 2), 8, nm);
      if (j) L.vl(colX[j] - 1, 8, 47, 1);
    });
    L.hl(0, x - 1, 15, 1);
    for (var r = 0; r < this.TROWS; r++) {
      var ri = tb.top + r; if (ri >= tb.xs.length) break;
      var y = 17 + r * 8;
      vis.forEach(function (c, j) {
        var w = j ? yw : xw, v = self.cell(ri, c), s = isFinite(v) ? fitStr(v, j ? 7 : 5) : 'ERROR', tw = 6 * s.length;
        L.str(colX[j] + w - tw - 2, y, negStr(s), 1, false); L.note(colX[j] + w - tw - 2, y, s);
        if (ri === tb.r && c === tb.c) L.inv(colX[j], y - 1, w - 1, 9);
      });
    }
    if (tb.ed) { L.str(0, 49, 'X='); var ctx = { ed: tb.ed }, b = layRow(tb.ed.root, ctx); this.drawEd(L, b, ctx, 12, 49, 115, blink); }
    else if (tb.xs.length) { var v = this.cell(tb.r, tb.c), s = isFinite(v) ? decStr(v, this.st) : 'ERROR', w = 6 * s.length; L.str(127 - w, 49, negStr(s), 1, false); L.note(127 - w, 49, s); }
  };
  P.paintSetup = function (L) {
    var su = this.su;
    if (su.row < su.top) su.top = su.row; if (su.row > su.top + 5) su.top = su.row - 5;
    for (var k = su.top; k < Math.min(SETUP.length, su.top + 6); k++) {
      var y = 8 + (k - su.top) * 8, lab = SETUP[k][1];
      L.str(0, y, lab); L.str(72, y, ':' + this.suVal(k));
      if (k === su.row) L.inv(0, y - 1, 128, 8);
    }
    if (su.ask) { L.rect(14, 22, 100, 20, 0); L.frame(14, 22, 100, 20, 1); L.str(18, 25, 'Number Of'); L.str(18, 33, (su.ask === 'Fix' ? 'Dec Places' : 'Sig Digits') + ' 0~9'); }
  };
  P.paintMenu = function (L) {
    var m = this.mm, ap = APPS[m.sel];
    L.small(1, 1, 'MAIN MENU'); var t = ap[0] + ':' + ap[1], tw = L.sw(t); L.small(127 - tw, 1, t); L.note(0, 0, 'MAIN MENU ' + t);
    for (var k = 0; k < APPS.length; k++) {
      var c = k % 4, r = Math.floor(k / 4), x = c * 32, y = 7 + r * 19, a = APPS[k];
      L.frame(x + 1, y + 1, 30, 18, 1); L.set(x + 1, y + 1, 0); L.set(x + 30, y + 1, 0); L.set(x + 1, y + 18, 0); L.set(x + 30, y + 18, 0);
      L.small(x + 3, y + 3, a[0]);
      this.icon(L, a[3] || a[2], x + 10, y + 3);
      var lw = L.sw(a[2]); L.clipX = [x + 2, x + 30]; L.small(x + 1 + Math.max(1, Math.floor((30 - lw) / 2)), y + 12, a[2]); L.clipX = [0, LW];
      L.note(x, y + 8, a[0] + ' ' + a[2]);
      if (k === m.sel) L.inv(x + 2, y + 2, 28, 16);
    }
  };
  P.icon = function (L, id, x, y) { // small pictures of my own for the three apps here
    if (id === 'run') { L.ch(x + 2, y, '÷'); L.ch(x + 9, y, '×'); return; }
    if (id === 'graph') { L.hl(x, x + 16, y + 6, 1); L.vl(x + 8, y, y + 8, 1); for (var i = -4; i <= 4; i++) L.set(x + 8 + 2 * i, y + 7 - Math.round(i * i * 0.4), 1); return; }
    if (id === 'table') { L.frame(x + 2, y, 13, 8, 1); L.vl(x + 7, y, y + 7, 1); L.hl(x + 2, x + 14, y + 3, 1); return; }
  };
  P.paintPop = function (L) {
    var p = this.pop, lines = p.lines, h = lines.length * 8 + 6, w = 112, x = 8, y = Math.max(1, Math.floor((64 - h) / 2));
    L.rect(x - 1, y - 1, w + 3, h + 3, 0); L.frame(x, y, w, h, 1); L.hl(x + 2, x + w, y + h, 1); L.vl(x + w, y + 2, y + h, 1);
    lines.forEach(function (s, k) { if (!s) return; var tw = 6 * s.length, sx = k === 0 ? x + Math.floor((w - tw) / 2) : x + 6; L.str(sx, y + 3 + k * 8, s); });
  };

  /* ---------- the graph screen ---------- */
  P.gx = function (x) { return (x - this.win.xmin) / this.dot(); };
  P.gy = function (y) { return (this.win.ymax - y) / this.ydot(); };
  P.paintGraph = function (L, blink) {
    var w = this.win, self = this, g = this.g, st = this.st;
    // grid and axes
    if (st.grid && w.xscl > 0 && w.yscl > 0 && (w.xmax - w.xmin) / w.xscl < 130 && (w.ymax - w.ymin) / w.yscl < 64) {
      for (var gx = Math.ceil(w.xmin / w.xscl) * w.xscl; gx <= w.xmax + 1e-9; gx += w.xscl) {
        var px = Math.round(this.gx(gx));
        if (st.grid === 2) { for (var yy = 0; yy <= GHY; yy += 2) L.set(px, yy, 1); }
        else for (var gy = Math.ceil(w.ymin / w.yscl) * w.yscl; gy <= w.ymax + 1e-9; gy += w.yscl) L.set(px, Math.round(this.gy(gy)), 1);
      }
      if (st.grid === 2) for (var gy2 = Math.ceil(w.ymin / w.yscl) * w.yscl; gy2 <= w.ymax + 1e-9; gy2 += w.yscl) { var py = Math.round(this.gy(gy2)); for (var xx = 0; xx <= GWX; xx += 2) L.set(xx, py, 1); }
    }
    // inequalities: shade where every one of them is true (Casio's "intersection" shading)
    var ineq = this.drawn().filter(function (i) { return self.F[i].type !== 'Y='; });
    if (ineq.length) {
      var cols = ineq.map(function (i) { var a = []; for (var c = 0; c <= GWX; c++) a.push(self.fx(i, self.colX(c))); return a; });
      for (var c = 0; c <= GWX; c++) for (var r = 0; r <= GHY; r++) {
        if ((c + r) % 2) continue;
        var y = w.ymax - r * this.ydot(), ok = true;
        for (var q = 0; q < ineq.length && ok; q++) { var fy = cols[q][c], ty = this.F[ineq[q]].type; if (!isFinite(fy)) ok = false; else if (ty === 'Y>' || ty === 'Y≥') ok = y > fy; else ok = y < fy; }
        if (ok) L.set(c, r, 1);
      }
    }
    if (st.axes) {
      var ax = Math.round(this.gy(0)), ay = Math.round(this.gx(0));
      if (ax >= 0 && ax <= GHY) { L.hl(0, GWX, ax, 1); if (w.xscl > 0 && (w.xmax - w.xmin) / w.xscl < 130) for (var tx = Math.ceil(w.xmin / w.xscl) * w.xscl; tx <= w.xmax + 1e-9; tx += w.xscl) { var tp = Math.round(this.gx(tx)); L.set(tp, ax - 1, 1); L.set(tp, ax + 1, 1); } }
      if (ay >= 0 && ay <= GWX) { L.vl(ay, 0, GHY, 1); if (w.yscl > 0 && (w.ymax - w.ymin) / w.yscl < 64) for (var ty2 = Math.ceil(w.ymin / w.yscl) * w.yscl; ty2 <= w.ymax + 1e-9; ty2 += w.yscl) { var tq = Math.round(this.gy(ty2)); L.set(ay - 1, tq, 1); L.set(ay + 1, tq, 1); } }
      if (st.label) { if (ax >= 0 && ax <= GHY) L.small(GWX - 3, Math.max(0, ax - 6), 'x'); if (ay >= 0 && ay <= GWX) L.small(Math.min(GWX - 4, ay + 2), 0, 'y'); }
    }
    // the graphs
    this.drawn().forEach(function (i) { self.plot(L, i, g.mode === 'sel' && g.fi === i && blink === false ? -1 : g.mode === 'sel' && g.fi === i ? 1 : 0); });
    // pointer, readouts and labels
    var X = function (x) { return 'X=' + fitStr(x, 10); }, Y = function (y) { return 'Y=' + (isFinite(y) ? fitStr(y, 10) : ''); };
    var cross = function (cx, cy) { cx = Math.round(cx); cy = Math.round(cy); for (var d = -2; d <= 2; d++) { if (d) { L.xor(cx + d, cy); L.xor(cx, cy + d); } } L.xor(cx, cy); };
    var label = function (s) { var tw = L.sw(s) + 2; L.rect(0, 0, tw + 1, 7, 0); L.small(1, 1, s, 1, true); };
    var fname = function (i) { var s = 'Y' + (i + 1) + (self.F[i].type === 'Y=' ? '=' : self.F[i].type.slice(1)) + lin(self.F[i].row); return s; };
    var bottom = function (xs, ys) {
      if (6 * (xs.length + ys.length + 1) <= 128) { L.rect(0, 56, 128, 8, 0); L.str(0, 57, negStr(xs), 1, false); L.note(0, 57, xs); L.str(128 - 6 * ys.length, 57, negStr(ys), 1, false); L.note(64, 57, ys); }
      else { L.rect(0, 48, 128, 16, 0); L.str(0, 49, negStr(xs), 1, false); L.note(0, 49, xs); L.str(128 - 6 * ys.length, 57, negStr(ys), 1, false); L.note(64, 57, ys); }
    };
    var top = function (s) { s = s.length > 21 ? s.slice(0, 21) : s; L.rect(0, 0, 6 * s.length + 1, 8, 0); L.str(0, 0, negStr(s), 1, false); L.note(0, 0, s); };
    if (g.mode === 'trace' && g.fi != null) {
      var ty3 = this.fx(g.fi, g.x); top(fname(g.fi));
      if (isFinite(ty3)) cross(this.gx(g.x), this.gy(ty3));
      if (g.inp) this.inputBox(L, g, blink); else if (st.coord) bottom(X(g.x), Y(ty3));
    } else if (g.mode === 'res') {
      var s0 = g.sols[g.k]; label(GS_LABEL[g.kind]);
      cross(this.gx(s0.x), this.gy(s0.y));
      bottom(X(s0.x), Y(s0.y));
    } else if (g.mode === 'sel') {
      top(fname(g.fi));
    } else if (g.mode === 'inp') {
      label(GS_LABEL[g.kind]); this.inputBox(L, g, blink);
    } else if (g.mode === 'ptr') {
      cross(g.cx, g.cy);
      if (g.act === 'box' && g.stage) { var x0 = Math.min(g.bx, g.cx), x1 = Math.max(g.bx, g.cx), y0 = Math.min(g.by, g.cy), y1 = Math.max(g.by, g.cy); for (var bx = x0; bx <= x1; bx += 2) { L.set(bx, y0, 1); L.set(bx, y1, 1); } for (var by = y0; by <= y1; by += 2) { L.set(x0, by, 1); L.set(x1, by, 1); } }
      if (st.coord) bottom(X(this.ptrX(g)), Y(this.ptrY(g)));
    }
    if (this.fm.length) { L.rect(0, MENU_Y - 1, 128, 8, 0); this.fmenu(L, this.curMenu()); }
  };
  P.inputBox = function (L, g, blink) {
    L.rect(0, 47, 128, 17, 0); L.frame(0, 47, 128, 17, 1);
    L.str(2, 51, g.label); var ctx = { ed: g.inp }, b = layRow(g.inp.root, ctx); this.drawEd(L, b, ctx, 2 + 6 * g.label.length, 51, 120 - 6 * g.label.length, blink);
  };
  P.plot = function (L, i, hl) {
    if (hl < 0) return;
    var self = this, F = this.F[i], prev = null, w = this.win, dot = this.dot(), plotOnly = this.st.draw === 'Plot' || F.style === 3;
    var f = function (x) { return self.fx(i, x); };
    var thick = F.style === 1 || hl > 0, broken = F.style === 2 || (F.type === 'Y>' || F.type === 'Y<');
    var put = function (c, r, n) { if (broken && (n % 4) > 1) return; L.set(c, r, 1); if (thick) { L.set(c, r + 1, 1); L.set(c + 1, r, 1); } };
    var n = 0;
    for (var c = 0; c <= GWX; c++) {
      var x = w.xmin + c * dot, y = f(x);
      if (!isFinite(y)) { prev = null; continue; }
      var r = this.gy(y), rr = Math.round(r);
      if (plotOnly) { if (rr >= 0 && rr <= GHY) put(c, rr, n++); prev = null; continue; }
      if (prev) {
        var jump = Math.abs(r - prev.r), ok = jump <= 2;
        if (!ok && !(prev.r < -64 && r < -64) && !(prev.r > 128 && r > 128)) { // steep: draw it unless there is an asymptote between
          var xm = x - dot / 2, ym = f(xm);
          if (isFinite(ym)) { var rm = this.gy(ym); ok = jump < 200 && rm >= Math.min(prev.r, r) - 2 && rm <= Math.max(prev.r, r) + 2; }
        }
        if (ok) {
          var r0 = Math.max(-1, Math.min(GHY + 1, Math.round(prev.r))), r1 = Math.max(-1, Math.min(GHY + 1, rr)), mid = Math.round((r0 + r1) / 2);
          if (r0 === r1) put(c, r1, n++);
          else { var stp = r1 > r0 ? 1 : -1; for (var q = r0; q !== r1 + stp; q += stp) put(q === r0 ? c - 1 : (stp > 0 ? q <= mid : q >= mid) ? c - 1 : c, q, n++); }
        } else if (rr >= 0 && rr <= GHY) put(c, rr, n++);
      } else if (rr >= 0 && rr <= GHY) put(c, rr, n++);
      prev = { r: r };
    }
  };
  P.text = function () { var L = new LCD(); this.paint(L, false); return L.text(); };

  /* ======================= the skin: the Casio's case, LCD and keys inside the shared window ======================= */
  var CSS = [
    '.c84.m-fx .c84-in{background:linear-gradient(180deg,#f7f8fa,#e6e9ee 40%,#dfe3e9);color:#1d2430;box-shadow:0 18px 44px rgba(10,15,25,.35),inset 0 1px 0 #fff;border-radius:22px 22px 34px 34px}',
    '.c84.m-fx .c84-hbtn,.c84.m-fx .calc-close,.c84.m-fx .calc-size{background:rgba(20,30,50,.09);color:#1d2430}.c84.m-fx .c84-hbtn:hover,.c84.m-fx .calc-close:hover,.c84.m-fx .calc-size:hover{background:rgba(20,30,50,.16)}.c84.m-fx .c84-hbtn.on{background:#1f3a6e;color:#fff}',
    '.c84.m-fx .c84-sw{background:rgba(20,30,50,.09)}.c84.m-fx .c84-sw button{color:#3b4556}.c84.m-fx .c84-sw button.on{background:#1f3a6e;color:#fff}.c84.m-fx .c84-sw button:not(.on):hover{background:rgba(20,30,50,.12)}',
    '.cfx-brand{font:800 12px/1 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;letter-spacing:.03em;color:#1f3a6e;white-space:nowrap}.cfx-brand em{font-style:normal;font-weight:500;color:#6b7686;letter-spacing:0;margin-left:3px}',
    '.cfx-body{display:flex;flex-direction:column;gap:9px}',
    '.c84.wide.m-fx .cfx-body{flex-direction:row;align-items:flex-start;gap:14px}',
    '.cfx-bez{background:linear-gradient(180deg,#22324f,#17233a);border-radius:12px;padding:9px 10px 10px;box-shadow:inset 0 2px 5px rgba(0,0,0,.45);width:328px;box-sizing:border-box}',
    '.c84 .calc-screen.cfx-scr{position:relative;width:308px;height:154px;margin:0;padding:0;border-radius:3px;background:#c7d0bd;box-shadow:inset 0 1px 4px rgba(0,0,0,.35);overflow:hidden;display:block}',
    '.cfx-scr canvas{width:308px;height:154px;display:block}',
    '.cfx-sr{position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:pre}',
    '.cfx-model{font:700 9.5px/1 system-ui,-apple-system,Arial,sans-serif;color:#aab6cc;letter-spacing:.08em;text-align:right;margin-top:6px}',
    '.cfx-pad{width:328px;display:flex;flex-direction:column;gap:2px}',
    '.cfx-row{display:grid;column-gap:6px}.cfx-row.c6{grid-template-columns:repeat(6,1fr)}.cfx-row.c5{grid-template-columns:repeat(5,1fr);column-gap:8px}',
    '.cfx-mid{display:grid;grid-template-columns:repeat(4,1fr) 112px;column-gap:6px;row-gap:2px}',
    '.cfx-kc{display:flex;flex-direction:column;align-items:stretch}',
    '.cfx-kl{height:11px;display:flex;justify-content:space-between;font:700 8px/11px system-ui,-apple-system,Arial,sans-serif;white-space:nowrap;padding:0 1px;letter-spacing:-.01em}',
    '.cfx-kl .ls{color:#b27a00}.cfx-kl .la{color:#d0262d}.cfx-kl sup{font-size:6px;line-height:0}',
    '.cfx-k{height:24px;border:none;border-radius:6px;background:#3a414d;color:#fff;font:700 12px/1 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;cursor:pointer;padding:0;box-shadow:0 2px 0 #1b1f26,inset 0 1px 0 rgba(255,255,255,.15);touch-action:manipulation;display:flex;align-items:center;justify-content:center}',
    '.cfx-k sup{font-size:8px;line-height:0;margin-top:-6px}.cfx-k small{font-size:7.5px}',
    '.cfx-k.fk{height:17px;border-radius:9px;background:#fdfdfe;color:#1d2430;font-size:10.5px;box-shadow:0 2px 0 #9aa3b0,inset 0 1px 0 #fff}',
    '.cfx-k.num{height:30px;background:#fbfbfc;color:#141820;font-size:16px;border-radius:7px;box-shadow:0 2px 0 #9aa3b0,inset 0 1px 0 #fff}.cfx-k.num.op{font-size:18px}.cfx-k.num.sm{font-size:11px}',
    '.cfx-k.sm{font-size:10px}.cfx-k.kshift{background:#f2c230;color:#3b2a00;box-shadow:0 2px 0 #9b7a10}.cfx-k.kalpha{background:#d8343a;box-shadow:0 2px 0 #7d1418}',
    '.cfx-k.kdel,.cfx-k.kac{height:30px;background:#2f6fd1;font-size:12.5px;box-shadow:0 2px 0 #183d78}.cfx-k.kexe{height:30px;background:#1f3a6e;font-size:13px;box-shadow:0 2px 0 #0c1a33}',
    '.cfx-k:hover{filter:brightness(1.08)}.cfx-k.down,.cfx-k:active{transform:translateY(1.5px);box-shadow:none}',
    '.cfx-k.demo,.cfx-ar.demo{outline:3px solid #ffb400;outline-offset:2px;filter:brightness(1.15);transform:translateY(1.5px) scale(1.06)}',
    '.cfx-dp{grid-column:5;grid-row:1/3;display:flex;align-items:center;justify-content:center}',
    '.cfx-ring{position:relative;width:96px;height:62px;border-radius:50%;background:radial-gradient(circle at 50% 45%,#4a5260,#2b313b 70%);box-shadow:0 2px 0 #1b1f26}',
    '.cfx-ar{position:absolute;border:none;background:none;color:#fff;cursor:pointer;padding:0;font-size:11px;touch-action:manipulation}',
    '.cfx-ar.up{left:33px;top:0;width:30px;height:20px}.cfx-ar.down{left:33px;bottom:0;width:30px;height:20px}.cfx-ar.left{left:0;top:16px;width:33px;height:30px}.cfx-ar.right{right:0;top:16px;width:33px;height:30px}',
    '.cfx-ar:active,.cfx-ar.down2{color:#ffb400}',
    '.c84.m-fx .calc-demo-cap span{background:#1f3a6e;color:#ffd84a}'
  ].join('\n');

  function fxSkin(doc, shell) {
    var c = new Fx();
    if (!doc.getElementById('cfx-css')) { var st = doc.createElement('style'); st.id = 'cfx-css'; st.textContent = CSS; doc.head.appendChild(st); }
    var el = function (t, cl, h) { var e = doc.createElement(t); if (cl) e.className = cl; if (h != null) e.innerHTML = h; return e; };
    var body = el('div', 'cfx-body'), bez = el('div', 'cfx-bez'), screen = el('div', 'calc-screen cfx-scr'), cv = el('canvas'), sr = el('div', 'cfx-sr');
    var K = 5; cv.width = LW * K; cv.height = LH * K; screen.appendChild(cv); screen.appendChild(sr); bez.appendChild(screen);
    bez.appendChild(el('div', 'cfx-model', 'fx-9750GIII style · natural display'));
    var pad = el('div', 'cfx-pad');
    var flash = function (b) { b.classList.add('down'); setTimeout(function () { b.classList.remove('down'); }, 90); };
    function wire(b, id) {
      b.type = 'button'; b.dataset.k = id;
      b.addEventListener('pointerdown', function (e) { e.preventDefault(); shell.focus(); c.press(id); phase = true; render(); flash(b); });
      b.addEventListener('click', function (e) { e.preventDefault(); });
      return b;
    }
    function keyCell(k) {
      var cell = el('div', 'cfx-kc');
      cell.appendChild(el('div', 'cfx-kl', '<span class="ls">' + (k[3] || '&nbsp;') + '</span><span class="la">' + (k[5] || '') + '</span>'));
      var b = wire(el('button', 'cfx-k ' + k[7], k[1]), k[0]);
      b.setAttribute('aria-label', (k[0] === 'frac' ? 'fraction' : k[1].replace(/<[^>]+>/g, '')) + (k[3] ? ' (SHIFT: ' + k[3].replace(/<[^>]+>/g, '') + ')' : ''));
      cell.appendChild(b); return cell;
    }
    LAYOUT.forEach(function (row, ri) {
      if (ri === 1 || ri === 2) return;
      var r = el('div', 'cfx-row ' + (row.length === 6 ? 'c6' : 'c5'));
      row.forEach(function (k) { r.appendChild(keyCell(k)); });
      pad.appendChild(r);
      if (ri === 0) { // SHIFT OPTN VARS MENU / ALPHA x² ^ EXIT, with the arrow pad on the right
        var mid = el('div', 'cfx-mid');
        LAYOUT[1].forEach(function (k) { mid.appendChild(keyCell(k)); });
        var dp = el('div', 'cfx-dp'), ring = el('div', 'cfx-ring');
        [['up', '▲'], ['left', '◀'], ['right', '▶'], ['down', '▼']].forEach(function (a) { var b = wire(el('button', 'cfx-ar ' + a[0], a[1]), a[0]); b.setAttribute('aria-label', a[0]); ring.appendChild(b); });
        dp.appendChild(ring); mid.appendChild(dp);
        LAYOUT[2].forEach(function (k) { mid.appendChild(keyCell(k)); });
        pad.appendChild(mid);
      }
    });
    body.appendChild(bez); body.appendChild(pad);
    var lcd = new LCD(), ctx2 = cv.getContext('2d'), phase = true, timer = null, lastTxt = '';
    var ghost = null;
    function render() {
      c.paint(lcd, phase);
      var g = ctx2;
      g.fillStyle = '#c7d0bd'; g.fillRect(0, 0, cv.width, cv.height);
      if (!ghost) { var pc = doc.createElement('canvas'); pc.width = K; pc.height = K; var pg = pc.getContext('2d'); pg.fillStyle = 'rgba(70,90,60,.07)'; pg.fillRect(0.4, 0.4, K - 0.8, K - 0.8); ghost = g.createPattern(pc, 'repeat'); }
      if (c.on) { g.fillStyle = ghost; g.fillRect(0, 0, cv.width, cv.height); }
      g.fillStyle = '#1c2418';
      var p = lcd.p;
      for (var y = 0; y < LH; y++) for (var x = 0; x < LW; x++) if (p[y * LW + x]) g.fillRect(x * K + 0.3, y * K + 0.3, K - 0.6, K - 0.6);
      var t = lcd.text(); if (t !== lastTxt) { sr.textContent = t; lastTxt = t; }
    }
    function tick() { phase = !phase; render(); }
    var KB = { Enter: 'exe', '=': 'exe', ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', Backspace: 'del', Delete: 'del', '+': 'add', '*': 'mul', '/': 'div', '^': 'pow', '(': 'lp', ')': 'rp', ',': 'comma' };
    function keydown(e) {
      var k = e.key, a = null;
      if (/^[0-9.]$/.test(k)) a = k;
      else if (k === '-') { var ed = c.edFor(false), r = ed && ed.row(), prev = r && ed.i > 0 ? r[ed.i - 1] : null; a = ed && (!prev || (prev.k === 't' && /^(add|sub|mul|div|lp|comma|neg|sto)$/.test(prev.id)) || prev.k === 'pre' || prev.k === 'fn' || prev.k === 'op') && !(c.scr === 'run' && ed.empty() && c.hist.length) ? 'neg' : 'sub'; }
      else if (k === 'Escape') a = c.scr === 'run' && !c.fm.length ? 'ac' : 'exit';
      else if (k === 'x' || k === 'X') a = 'xt';
      else if (/^[a-zA-Z]$/.test(k)) a = k.toUpperCase();
      else if (KB[k]) a = KB[k];
      if (!a) return false;
      c.shift = false; if (!c.alock) c.alpha = false;
      c.press(a); phase = true; render(); return true;
    }
    var help = '<h4>The on-screen Casio fx-9750GIII</h4><ul>' +
      '<li>Type a calculation and press <kbd>EXE</kbd>. Use <kbd>(−)</kbd> for a negative number. <kbd class="y">SHIFT</kbd> then a key gives the yellow word above it; <kbd class="r">ALPHA</kbd> gives the red letter.</li>' +
      '<li>Natural display: <kbd>□/□</kbd> makes a fraction, <kbd class="y">SHIFT</kbd> <kbd>x²</kbd> is √, <kbd>^</kbd> opens a raised box for the power (press <kbd>►</kbd> to leave a box). Answers come out as fractions or surds: <kbd>S⇔D</kbd> switches to a decimal.</li>' +
      '<li><kbd class="y">SHIFT</kbd> <kbd>MENU</kbd> (SET UP): Angle Deg or Rad, and the Display (Fix, Sci, Norm). <kbd>MENU</kbd> picks the app: 1 Run-Matrix, 3 Graph, 5 Table.</li>' +
      '<li>Graphs: <kbd>MENU</kbd> <kbd>3</kbd>, type Y1 with <kbd>X,θ,T</kbd>, <kbd>EXE</kbd>, <kbd>F6</kbd> (DRAW). <kbd class="y">SHIFT</kbd> <kbd>F3</kbd> V-Window (F3 STANDRD is −10 to 10), <kbd class="y">SHIFT</kbd> <kbd>F1</kbd> Trace, <kbd class="y">SHIFT</kbd> <kbd>F5</kbd> G-Solv: ROOT, MAX, MIN, Y-ICEPT, INTSECT (<kbd>►</kbd> for the next one).</li>' +
      '<li>Tables: <kbd>MENU</kbd> <kbd>5</kbd>, type the function, <kbd>F5</kbd> (SET) Start, End, Step, <kbd>EXIT</kbd>, <kbd>F6</kbd> (TABLE).</li>' +
      '<li>Series: <kbd>OPTN</kbd> <kbd>F4</kbd> (CALC) <kbd>F6</kbd> <kbd>F3</kbd> is Σ(, e.g. Σ(3×2^(N−1),N,1,10). <kbd>OPTN</kbd> <kbd>F1</kbd> (LIST) has Seq and Sum.</li>' +
      '<li>Keyboard: digits, + − * / ^ ( ) , Enter, Backspace, arrows; x for X, other letters for A–Z, Esc = AC / EXIT.</li></ul>';
    var hcss = doc.getElementById('cfx-help-css'); if (!hcss) { hcss = doc.createElement('style'); hcss.id = 'cfx-help-css'; hcss.textContent = '.c84-help kbd.y{background:#f2c230;color:#3b2a00}.c84-help kbd.r{background:#d8343a}'; doc.head.appendChild(hcss); }
    render();
    return {
      calc: c, body: body, render: render, keydown: keydown, help: help, cls: 'm-fx',
      brand: '<span class="cfx-brand">fx-9750GIII<em>style</em></span>', label: 'Graphing calculator (Casio fx-9750GIII style)',
      shown: function (on) { clearInterval(timer); timer = null; if (on) timer = setInterval(tick, 520); },
      press: function (seq) { (Array.isArray(seq) ? seq : String(seq).split(/\s+/)).forEach(function (a) { if (a) c.press(a); }); render(); var h = c.hist[c.hist.length - 1]; return { l1: lin(c.ed.root), l2: h ? (layAns(h.v, c.shown(h), c.st).lin || '') : '', text: c.text() }; }
    };
  }

  /* ======================= key-press demos: the TI-84 tokens as Casio keys ======================= */
  var NAME = { f1: 'F1', f2: 'F2', f3: 'F3', f4: 'F4', f5: 'F5', f6: 'F6', shift: 'SHIFT', optn: 'OPTN', vars: 'VARS', menu: 'MENU', alpha: 'ALPHA', sq: 'x²', pow: '^', exit: 'EXIT', xt: 'X,θ,T', log: 'log', ln: 'ln', sin: 'sin', cos: 'cos', tan: 'tan', frac: '□/□', sd: 'S⇔D', lp: '(', rp: ')', comma: ',', sto: '→', del: 'DEL', ac: 'AC', mul: '×', div: '÷', add: '+', sub: '−', exp: '×10ˣ', neg: '(−)', exe: 'EXE', up: '▲', down: '▼', left: '◄', right: '►' };
  function K(keys, label) { return { keys: keys, label: label || keys.map(function (k) { return NAME[k] || k; }).join(' ') }; }
  var OPEN_FN = { sin: ['sin'], cos: ['cos'], tan: ['tan'], log: ['log'], ln: ['ln'], 'sin⁻¹': ['shift', 'sin'], 'cos⁻¹': ['shift', 'cos'], 'tan⁻¹': ['shift', 'tan'] };
  var OPEN_FN_LABEL = { 'sin⁻¹': 'SHIFT sin (sin⁻¹)', 'cos⁻¹': 'SHIFT cos (cos⁻¹)', 'tan⁻¹': 'SHIFT tan (tan⁻¹)' };
  var OPEN_TPL = { '√': K(['shift', 'sq'], 'SHIFT x² (√)'), '10^(': K(['shift', 'log'], 'SHIFT log (10ˣ)'), 'e^(': K(['shift', 'ln'], 'SHIFT ln (eˣ)'), '³√(': K(['shift', 'lp'], 'SHIFT ( (³√)'), '³√': K(['shift', 'lp'], 'SHIFT ( (³√)') };
  var OPEN_OPTN = {
    'abs(': K(['optn', 'f6', 'f3', 'f1', 'lp'], 'OPTN F6 (▷) F3 (NUM) F1 (Abs) ('), 'iPart(': K(['optn', 'f6', 'f3', 'f2', 'lp'], 'OPTN F6 F3 (NUM) F2 (Int) ('), 'fPart(': K(['optn', 'f6', 'f3', 'f3', 'lp'], 'OPTN F6 F3 (NUM) F3 (Frac) ('),
    'int(': K(['optn', 'f6', 'f3', 'f5', 'lp'], 'OPTN F6 F3 (NUM) F5 (Intg) ('), 'round(': K(['optn', 'f6', 'f3', 'f6', 'f1'], 'OPTN F6 F3 (NUM) F6 F1 (RndFix()'),
    'sum(': K(['optn', 'f1', 'f6', 'f6', 'f1', 'lp'], 'OPTN F1 (LIST) F6 F6 F1 (Sum) ('), 'prod(': K(['optn', 'f1', 'f6', 'f6', 'f2', 'lp'], 'OPTN F1 (LIST) F6 F6 F2 (Prod) ('),
    'dim(': K(['optn', 'f1', 'f3', 'lp'], 'OPTN F1 (LIST) F3 (Dim) ('), 'cumSum(': K(['optn', 'f1', 'f6', 'f6', 'f3', 'lp'], 'OPTN F1 (LIST) F6 F6 F3 (Cuml) ('),
    'seq(': K(['optn', 'f1', 'f5'], 'OPTN F1 (LIST) F5 (Seq)'), 'Σ(': K(['optn', 'f4', 'f6', 'f3'], 'OPTN F4 (CALC) F6 (▷) F3 (Σ()')
  };
  var SIMPLE = { 'x²': K(['sq']), 'x⁻¹': K(['shift', 'rp'], 'SHIFT ) (x⁻¹)'), '+': K(['add']), '−': K(['sub']), '-': K(['sub']), '×': K(['mul']), '*': K(['mul']), '÷': K(['div']), '/': K(['div']),
    '^': K(['pow']), '(−)': K(['neg']), ',': K(['comma']), 'STO→': K(['sto']), '→': K(['sto']), 'Ans': K(['shift', 'neg'], 'SHIFT (−) (Ans)'), 'π': K(['shift', 'exp'], 'SHIFT ×10ˣ (π)'),
    'EE': K(['exp']), '{': K(['shift', 'mul'], 'SHIFT × ({)'), '}': K(['shift', 'div'], 'SHIFT ÷ (})'), X: K(['xt']), '!': K(['optn', 'f6', 'f2', 'f1'], 'OPTN F6 F2 (PROB) F1 (x!)'),
    '°': K(['optn', 'f6', 'f4', 'f1'], 'OPTN F6 F4 (ANGLE) F1 (°)'), nPr: K(['optn', 'f6', 'f2', 'f2'], 'OPTN F6 F2 (PROB) F2 (nPr)'), nCr: K(['optn', 'f6', 'f2', 'f3'], 'OPTN F6 F2 (PROB) F3 (nCr)'),
    DEL: K(['del']), INS: K(['shift', 'del'], 'SHIFT DEL (INS)'), ON: K(['ac'], 'AC/ON'), ALPHA: K(['alpha']), '2nd': K(['shift']), 'A-LOCK': K(['shift', 'alpha'], 'SHIFT ALPHA (A-LOCK)'),
    MATH: K(['optn']), VARS: K(['vars']), LIST: K(['optn', 'f1'], 'OPTN F1 (LIST)'), ANGLE: K(['optn', 'f6', 'f4'], 'OPTN F6 F4 (ANGLE)'), FORMAT: K(['shift', 'menu'], 'SHIFT MENU (SET UP)'),
    '▲': K(['up']), '▼': K(['down']), '◄': K(['left']), '►': K(['right']), ENTRY: K(['left'], '◄ (the last calculation)') };
  var POSTFIX = { 'x²': 1, 'x⁻¹': 1, '!': 1, '°': 1, '³': 1, 'x³': 1 };
  var CONV = { '►Frac': 'frac', '►Dec': 'dec', 'F◂▸D': 'fd' };
  var OKNEXT = { '+': 1, '−': 1, '-': 1, '×': 1, '*': 1, '÷': 1, '/': 1, ')': 1, ',': 1, '=': 1, ENTER: 1, 'STO→': 1, '→': 1 };
  var GRAPHISH = { GRAPH: 1, TRACE: 1, ZOOM: 1, CALC: 1, WINDOW: 1, ZStandard: 1, ZDecimal: 1, ZTrig: 1, ZSquare: 1, ZInteger: 1, ZoomFit: 1, ZBox: 1, ZoomIn: 1, ZoomOut: 1, value: 1, zero: 1, minimum: 1, maximum: 1, intersect: 1 };
  function isNum(t) { return /^[0-9.]+$/.test(t); }
  function isLetter(t) { return /^[A-Zθ]$/.test(t) && t !== 'X'; }
  function opensParen(t) { return t === '(' || OPEN_FN[t] || OPEN_TPL[t] || OPEN_OPTN[t]; }
  function primEnd(t) { return isNum(t) || t === ')' || t === 'X' || isLetter(t) || t === 'Ans' || t === 'π' || t === 'e' || POSTFIX[t] || t === '}' || /^[LY][1-6]$/.test(t); }
  function primStart(t) { return isNum(t) || opensParen(t) || t === 'X' || isLetter(t) || t === 'Ans' || t === 'π' || t === 'e' || t === '{' || t === '(−)' || /^[LY][1-6]$/.test(t); }
  function typing(t) { return primStart(t) || primEnd(t) || /^(\+|−|-|×|\*|÷|\/|\^|,|STO→|→|ˣ√|nPr|nCr|EE)$/.test(t); }
  function numKeys(x) {
    var s = String(r14(x)), keys = [], m = s.match(/^(-?)([0-9.]+)(?:e([+-]?)(\d+))?$/);
    if (!m) return K(['0']);
    if (m[1]) keys.push('neg');
    m[2].split('').forEach(function (ch) { keys.push(ch); });
    if (m[4]) { keys.push('exp'); if (m[3] === '-') keys.push('neg'); m[4].split('').forEach(function (ch) { keys.push(ch); }); }
    return K(keys, (m[1] ? '(−) ' : '') + m[2] + (m[4] ? ' ×10ˣ ' + (m[3] === '-' ? '(−) ' : '') + m[4] : ''));
  }
  /* MATH 1, ZOOM 6, 2nd CALC 2, VARS ► 1 2 … → the token they stand for (►Frac, ZStandard, zero, Y2 …) */
  var REV = null;
  function rev() {
    if (REV) return REV;
    REV = {};
    Object.keys(TI.DEMO).forEach(function (n) { var k = TI.DEMO[n][0].join(','); if (TI.DEMO[n][0].length > 1 && !REV[k]) REV[k] = n; });
    return REV;
  }
  var OPENERS = { MATH: 1, LIST: 1, TEST: 1, ANGLE: 1, CALC: 1, ZOOM: 1, VARS: 1 };
  function normalize(toks) {
    var R = rev(), out = [];
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      if (OPENERS[t] && TI.DEMO[t]) {
        var keys = TI.DEMO[t][0].slice(), j = i + 1, hit = null, hitJ = i;
        while (j < toks.length && /^[◄►]$/.test(toks[j])) { keys.push(toks[j] === '◄' ? 'left' : 'right'); j++; }
        for (var n = 0; n < 2 && j < toks.length && /^[0-9A-Z]$/.test(toks[j]); n++, j++) { keys.push(toks[j]); if (R[keys.join(',')]) { hit = R[keys.join(',')]; hitJ = j; } }
        if (hit) { out.push(hit); i = hitJ; continue; }
      }
      if (/^k:/.test(t)) { var id = t.slice(2), name = null; Object.keys(TI.DEMO).some(function (n2) { if (TI.DEMO[n2][0].length === 1 && TI.DEMO[n2][0][0] === id) { name = n2; return true; } return false; }); if (/^[0-9.]$/.test(id)) name = id; out.push(name || t); continue; }
      out.push(t);
    }
    return out;
  }
  function tiKeys(t, prev) { var p = TI.plan(prev === 'STO→' || prev === '→' ? prev + ' ' + t : t); return p[p.length - 1].keys; }
  var LIVE = null; // the live Casio (the plan copies its angle mode)
  function fxPlan(spec) {
    var toks = normalize(String(spec).trim().split(/\s+/).filter(Boolean)), n = toks.length, out = [], fallbacks = [];
    var ti = new TI.Calc(); ti.toHome(true);
    var fx = new Fx(); fx.toHome(true);
    if (LIVE) { fx.st.angle = LIVE.st.angle; fx.b.mode.angle = LIVE.b.mode.angle; ti.mode.angle = LIVE.b.mode.angle; }
    function emit(tok, k) { if (!k || !k.keys.length) return; out.push({ tok: tok, label: k.label, keys: k.keys.slice() }); k.keys.forEach(function (a) { fx.press(a); }); }
    function tiRun(i) { tiKeys(toks[i], toks[i - 1]).forEach(function (a) { ti.press(a); }); }
    function closeMenus(tok) { if (fx.pop && fx.pop.code === 'UNAVAILABLE') emit(tok, K(['exit'])); var k = []; for (var q = 0; q < fx.fm.length; q++) k.push('exit'); if (k.length) emit(tok, K(k)); }
    function storeEdit(tok) { closeMenus(tok); if ((fx.scr === 'glist' || fx.scr === 'tlist') && fx.fl.ed) emit(tok, K(['exe'])); }
    function toRun(tok) { closeMenus(tok); if (fx.scr === 'setup' || fx.scr === 'vwin' || fx.scr === 'tset') emit(tok, K(['exit'])); if (fx.scr !== 'run') emit(tok, K(['menu', '1'], 'MENU 1 (RUN-MAT)')); }
    function toApp(tok, app) {
      closeMenus(tok);
      var list = app === 'table' ? 'tlist' : 'glist';
      if (fx.app === app && fx.scr === list) return;
      if (fx.app === app && (fx.scr === 'vwin' || fx.scr === 'tset' || fx.scr === 'table' || fx.scr === 'graph')) { emit(tok, K(['exit'])); if (fx.scr === list) return; }
      emit(tok, app === 'table' ? K(['menu', '5'], 'MENU 5 (TABLE)') : K(['menu', '3'], 'MENU 3 (GRAPH)'));
    }
    function toGraph(tok) { // the graph drawn on the screen
      storeEdit(tok);
      if (fx.scr === 'graph') { if (fx.g.mode !== 'none') emit(tok, K(['exit'])); return; }
      if (fx.scr === 'vwin') { emit(tok, K(['exit'])); if (fx.scr === 'graph') return; }
      if (fx.scr !== 'glist') toApp(tok, 'graph');
      emit(tok, K(['f6'], 'F6 (DRAW)'));
    }
    function setWindow(tok, w) { // the V-Window rows that differ, typed in
      storeEdit(tok);
      var from = fx.scr, keys = ['shift', 'f3'], lab = ['SHIFT F3 (V-WIN)'], rows = ['xmin', 'xmax', 'xscl', 'dot', 'ymin', 'ymax', 'yscl'], pend = 0;
      if (from !== 'glist' && from !== 'graph') { toApp(tok, 'graph'); }
      rows.forEach(function (r) {
        if (r === 'dot' || Math.abs(fx.win[r] - w[r]) < 1e-12 * Math.max(1, Math.abs(w[r]))) { pend++; return; }
        for (; pend > 0; pend--) { keys.push('down'); lab.push('▼'); }
        var nk = numKeys(w[r]); keys = keys.concat(nk.keys, ['exe']); lab.push(nk.label + ' EXE');
      });
      keys.push('exit'); lab.push('EXIT');
      emit(tok, K(keys, lab.join(' ')));
    }
    function setTable(tok, start, step, rowsNeeded) {
      storeEdit(tok); toApp(tok, 'table');
      var end = r14(start + step * Math.max(19, rowsNeeded)), a = numKeys(start), b = numKeys(end), c = numKeys(step);
      emit(tok, K(['f5'].concat(a.keys, ['exe'], b.keys, ['exe'], c.keys, ['exe', 'exit']), 'F5 (SET) ' + a.label + ' EXE ' + b.label + ' EXE ' + c.label + ' EXE EXIT'));
    }
    function downsAfter(i) { var d = 0; for (var j = i + 1; j < n; j++) if (toks[j] === '▼') d++; return d; }
    function tiShowsFrac() { var h = ti.hist[ti.hist.length - 1]; return !!(h && /\//.test(h.out)); }
    function syncDisplay(tok) { // the TI-84 shows a decimal and the Casio a fraction or surd (or the other way): S⇔D
      if (fx.scr !== 'run' || !fx.hist.length || ti.scr !== 'home' || fx.pop) return;
      var h = fx.hist[fx.hist.length - 1], ex = fx.shown(h), exact = !!(ex && ex.k !== 'int'), want = tiShowsFrac();
      if (want === exact) return;
      if (!want && exact) return emit(tok, K(['sd']));
      var q = fracOf(h.v); if (q && q[1] !== 1) emit(tok, K(['sd']));
    }
    // brackets: which ) closes which opener; where a power's (or a root's) box ends; where an ˣ√ index starts
    var match = [], expEnd = {}, rootAt = {};
    (function () {
      var st = [];
      for (var i = 0; i < n; i++) {
        var t = toks[i];
        if (!typing(t)) { st.forEach(function (k) { match[k] = -1; }); st = []; continue; }
        if (opensParen(t)) st.push(i); else if (t === ')' && st.length) match[st.pop()] = i;
      }
      st.forEach(function (k) { match[k] = -1; });
      var lineEnd = function (i) { while (i < n && typing(toks[i])) i++; return i - 1; };
      var operandEnd = function (k) {
        while (k < n && toks[k] === '(−)') k++;
        if (k >= n || !typing(toks[k])) return k - 1;
        var e = opensParen(toks[k]) ? (match[k] >= 0 ? match[k] : lineEnd(k)) : k;
        while (e + 1 < n && POSTFIX[toks[e + 1]]) e++;
        return e;
      };
      for (var j = 0; j < n; j++) {
        if (toks[j] === '^' || toks[j] === 'ˣ√') { var e = operandEnd(j + 1); expEnd[e] = (expEnd[e] || 0) + 1; }
        if (toks[j] === '³' || toks[j] === 'x³' || toks[j] === 'e') expEnd[j] = (expEnd[j] || 0) + 1;
        if (toks[j] === 'ˣ√') {
          var s = j - 1; while (s > 0 && POSTFIX[toks[s]]) s--;
          if (toks[s] === ')') { for (var q = 0; q < s; q++) if (match[q] === s) { s = q; break; } }
          rootAt[s] = j;
        }
      }
    })();
    var frames = [], divSeen = [false], convOnly = false, prevEnd = false;
    for (var i = 0; i < n; i++) {
      var t = toks[i], nx = toks[i + 1];
      // the TI-84 is on its home screen and the Casio isn't: back to Run-Matrix before typing
      if (typing(t) && ti.scr === 'home' && fx.scr !== 'run') toRun(t);
      if (typing(t) && fx.scr === 'graph' && fx.g.mode === 'none') toRun(t);
      // a product without × after a ÷ in the same bracket: the TI-84 works it out left to right, the Casio first
      if (primStart(t) && prevEnd && divSeen[divSeen.length - 1]) emit(t, K(['mul']));
      if (rootAt[i] != null) emit('ˣ√', K(['shift', 'pow'], 'SHIFT ^ (ˣ√)'));
      if (typing(t)) {
        if (isNum(t)) emit(t, K(t.split(''), t));
        else if (t === 'X') emit(t, SIMPLE.X);
        else if (isLetter(t)) emit(t, K(['alpha', ALPHA_KEY[t]], 'ALPHA ' + t));
        else if (t === 'e') emit(t, K(['shift', 'ln', '1'], 'SHIFT ln (eˣ) 1'));
        else if (t === '³' || t === 'x³') emit(t, K(['pow', '3'], '^ 3'));
        else if (/^L[1-6]$/.test(t)) emit(t, K(['shift', '1', t[1]], 'SHIFT 1 (List) ' + t[1]));
        else if (/^Y[1-6]$/.test(t)) emit(t, K(['vars', 'f4', 'f1', t[1]], 'VARS F4 (GRAPH) F1 (Y) ' + t[1]));
        else if (t === 'ˣ√') emit(t, K(['right'], '► (to the root)'));
        else if (OPEN_FN[t]) {
          var close = match[i], argEnd = close >= 0 ? close - 1 : (function () { var k = i + 1; while (k < n && typing(toks[k])) k++; return k - 1; })();
          var arg = toks.slice(i + 1, argEnd + 1), after = close >= 0 ? toks[close + 1] : toks[argEnd + 1];
          var simple = (arg.length === 1 && (isNum(arg[0]) || isLetter(arg[0]) || arg[0] === 'X' || arg[0] === 'Ans' || arg[0] === 'π')) || (arg.length === 2 && arg[0] === '(−)' && isNum(arg[1]));
          var okAfter = after == null || OKNEXT[after] || !typing(after);
          if (simple && okAfter) { emit(t, K(OPEN_FN[t], OPEN_FN_LABEL[t])); frames.push('skip'); }
          else { emit(t, K(OPEN_FN[t].concat(['lp']), (OPEN_FN_LABEL[t] || t) + ' (')); frames.push('p'); }
          divSeen.push(false);
        }
        else if (OPEN_TPL[t]) { emit(t, OPEN_TPL[t]); frames.push('tpl'); divSeen.push(false); }
        else if (OPEN_OPTN[t]) { emit(t, OPEN_OPTN[t]); frames.push(t === 'seq(' ? { seq: 0 } : 'p'); divSeen.push(false); }
        else if (t === '(') { emit(t, K(['lp'])); frames.push('p'); divSeen.push(false); }
        else if (t === ')') {
          var fr = frames.pop(); divSeen.pop(); if (!divSeen.length) divSeen = [false];
          if (fr === 'skip') { /* sin 30 ) → sin 30 */ }
          else if (fr === 'tpl') { if (nx != null && typing(nx)) emit(t, K(['right'], '►')); }
          else if (fr && fr.seq != null && fr.seq === 3) emit(t, K(['comma', '1', 'rp'], ', 1 )'));
          else emit(t, K(['rp']));
        }
        else if (t === ',') { var top = frames[frames.length - 1]; if (top && top.seq != null) top.seq++; emit(t, K(['comma'])); divSeen[divSeen.length - 1] = false; }
        else if (SIMPLE[t]) emit(t, SIMPLE[t]);
        else { fallbacks.push(t); }
        if (t === '÷' || t === '/') divSeen[divSeen.length - 1] = true;
        if ((t === '+' || t === '−' || t === '-') ) divSeen[divSeen.length - 1] = false;
        // leave a power's (or root's) box when more is typed after it
        if (expEnd[i] && nx != null && typing(nx)) for (var q2 = 0; q2 < expEnd[i]; q2++) emit(t, K(['right'], '►'));
        prevEnd = primEnd(t) && t !== 'ˣ√';
        if (t === ',' || t === '(' || opensParen(t)) prevEnd = false;
        tiRun(i); continue;
      }
      prevEnd = false; frames = []; divSeen = [false];
      switch (t) {
        case '=': case 'ENTER': {
          var inList = (fx.scr === 'glist' || fx.scr === 'tlist');
          if (fx.scr === 'run') {
            if (convOnly && fx.ed.empty()) { /* Ans►Frac: nothing to type on the Casio */ }
            else emit(t, K(['exe']));
            convOnly = false; tiRun(i);
            if (!CONV[nx]) syncDisplay(t);
          } else if (inList && fx.fl.ed) { emit(t, K(['exe'])); tiRun(i); }
          else if (fx.scr === 'graph' && fx.g.mode === 'trace' && !fx.g.inp) { tiRun(i); }
          else { emit(t, K(['exe'])); tiRun(i); }
          break;
        }
        case '►Frac': case '►Dec': case 'F◂▸D': if (fx.scr === 'run' && fx.ed.empty()) convOnly = true; tiRun(i); break;
        case 'CLEAR':
          if (fx.scr === 'glist' || fx.scr === 'tlist') { closeMenus(t); if (fx.fl.ed) emit(t, K(['ac'])); else emit(t, K(['f2', 'f1'], 'F2 (DELETE) F1 (Yes)')); }
          else if (fx.scr === 'graph') { closeMenus(t); emit(t, K(['exit'])); }
          else if (fx.scr === 'table') emit(t, K(['menu', '1'], 'MENU 1 (RUN-MAT)'));
          else emit(t, K(['ac']));
          tiRun(i); break;
        case 'QUIT':
          closeMenus(t);
          if (fx.scr === 'setup' || fx.scr === 'vwin' || fx.scr === 'tset') emit(t, K(['exit']));
          if (fx.scr !== 'run') emit(t, K(['menu', '1'], 'MENU 1 (RUN-MAT)'));
          tiRun(i); break;
        case 'Y=': {
          var tbl = false; for (var j2 = i + 1; j2 < n; j2++) { if (GRAPHISH[toks[j2]]) break; if (toks[j2] === 'TABLE' || toks[j2] === 'TBLSET') { tbl = true; break; } }
          toApp(t, tbl ? 'table' : 'graph'); tiRun(i); break;
        }
        case '▼': case '▲': case '◄': case '►':
          if ((t === '▼' || t === '▲') && (fx.scr === 'glist' || fx.scr === 'tlist') && fx.fl.ed && ti.scr === 'yeq') { closeMenus(t); emit(t, t === '▼' ? K(['exe']) : K(['exe', 'up', 'up'], 'EXE ▲ ▲')); }
          else emit(t, SIMPLE[t]);
          tiRun(i); break;
        case 'MODE': {
          var rowsTouched = {}, j3 = i;
          tiRun(i);
          while (j3 + 1 < n && /^(▲|▼|◄|►|=|ENTER)$/.test(toks[j3 + 1])) { j3++; if (toks[j3] === '=' || toks[j3] === 'ENTER') rowsTouched[ti.mrow] = 1; tiRun(j3); }
          closeMenus(t);
          var keys = ['shift', 'menu'], lab = ['SHIFT MENU (SET UP)'], at = 0;
          var go = function (row, fk, flab) { var d = row - at; for (; d > 0; d--) { keys.push('down'); lab.push('▼'); } for (; d < 0; d++) { keys.push('up'); lab.push('▲'); } at = row; keys = keys.concat(fk); lab.push(flab); };
          if (rowsTouched[2]) go(SETUP_ROW.angle, [ti.mode.angle === 'RAD' ? 'f2' : 'f1'], ti.mode.angle === 'RAD' ? 'F2 (Rad)' : 'F1 (Deg)');
          if (rowsTouched[0] || rowsTouched[1]) {
            if (ti.mode.note === 'SCI') { var dn = ti.mode.fix < 0 ? 0 : Math.min(9, ti.mode.fix + 1); go(SETUP_ROW.disp, ['f2'].concat(dn < 5 ? ['f' + (dn + 1)] : ['f6', 'f' + (dn - 4)]), 'F2 (Sci) ' + dn); }
            else if (ti.mode.fix >= 0) { var fn2 = ti.mode.fix; go(SETUP_ROW.disp, ['f1'].concat(fn2 < 5 ? ['f' + (fn2 + 1)] : ['f6', 'f' + (fn2 - 4)]), 'F1 (Fix) ' + fn2); }
            else if (fx.st.disp !== 'Norm1') go(SETUP_ROW.disp, ['f3'], 'F3 (Norm)');
          }
          keys.push('exit'); lab.push('EXIT');
          emit(t, K(keys, lab.join(' ')));
          i = j3; break;
        }
        case 'TBLSET': {
          var j4 = i; tiRun(i);
          while (j4 + 1 < n && (typing(toks[j4 + 1]) || /^(=|ENTER|▲|▼|CLEAR|DEL)$/.test(toks[j4 + 1]))) { j4++; tiRun(j4); }
          setTable(t, ti.tbl.start, ti.tbl.step, downsAfter(j4) + 4);
          i = j4; break;
        }
        case 'TABLE':
          tiRun(i);
          if (!(fx.ts.start === ti.tbl.start && fx.ts.step === ti.tbl.step && (fx.ts.end - fx.ts.start) / fx.ts.step >= downsAfter(i) + 1)) setTable(t, ti.tbl.start, ti.tbl.step, downsAfter(i) + 4);
          storeEdit(t); toApp(t, 'table');
          if (fx.scr === 'tlist') emit(t, K(['f6'], 'F6 (TABLE)'));
          break;
        case 'WINDOW': {
          var j5 = i; tiRun(i);
          while (j5 + 1 < n && (typing(toks[j5 + 1]) || /^(=|ENTER|▲|▼|CLEAR|DEL)$/.test(toks[j5 + 1]))) { j5++; tiRun(j5); }
          closeMenus(t); setWindow(t, ti.win);
          i = j5; break;
        }
        case 'GRAPH': tiRun(i); toGraph(t); break;
        case 'TRACE': tiRun(i); toGraph(t); emit(t, K(['shift', 'f1'], 'SHIFT F1 (TRACE)')); break;
        case 'ZStandard': case 'ZDecimal': case 'ZTrig': {
          tiRun(i); storeEdit(t);
          if (fx.scr !== 'glist' && fx.scr !== 'graph') toApp(t, 'graph');
          var fk = t === 'ZStandard' ? ['f3', 'F3 (STANDRD)'] : t === 'ZDecimal' ? ['f1', 'F1 (INITIAL)'] : ['f2', 'F2 (TRIG)'];
          emit(t, K(['shift', 'f3', fk[0], 'exit'], 'SHIFT F3 (V-WIN) ' + fk[1] + ' EXIT'));
          toGraph(t); break;
        }
        case 'ZoomFit': case 'ZSquare': case 'ZInteger': case 'ZBox': case 'ZoomIn': case 'ZoomOut': {
          tiRun(i); toGraph(t);
          var zk = { ZoomFit: [['f5'], 'F5 (AUTO)'], ZSquare: [['f6', 'f2'], 'F6 F2 (SQUARE)'], ZInteger: [['f6', 'f4'], 'F6 F4 (INTEGER)'], ZBox: [['f1'], 'F1 (BOX)'], ZoomIn: [['f3'], 'F3 (IN)'], ZoomOut: [['f4'], 'F4 (OUT)'] }[t];
          emit(t, K(['shift', 'f2'].concat(zk[0]), 'SHIFT F2 (ZOOM) ' + zk[1])); break;
        }
        case 'zero': case 'minimum': case 'maximum': case 'intersect': case 'value': {
          var j6 = i; tiRun(i);
          var doneTI = function () { return ti.scr === 'error' || (ti.g && ti.g.mode === 'calc' && (ti.g.stage === 'done' || (ti.g.kind === 'value' && ti.g.res && !ti.g.inp))); };
          while (j6 + 1 < n && !doneTI()) { j6++; tiRun(j6); }
          if (ti.scr === 'error' || !ti.g || ti.g.mode !== 'calc') { fallbacks.push(t + ' (the TI-84 demo did not finish)'); i = j6; break; }
          var tx = ti.g.x, w0 = fx.win;
          if (tx < w0.xmin || tx > w0.xmax) { closeMenus(t); if (fx.scr === 'graph') emit(t, K(['exit'])); setWindow(t, ti.win); }
          toGraph(t);
          var kind = { zero: 'root', minimum: 'min', maximum: 'max', intersect: 'isct', value: 'ycal' }[t];
          var gk = { root: [['f1'], 'F1 (ROOT)'], max: [['f2'], 'F2 (MAX)'], min: [['f3'], 'F3 (MIN)'], isct: [['f5'], 'F5 (INTSECT)'], ycal: [['f6', 'f1'], 'F6 (▷) F1 (Y-CAL)'] }[kind];
          emit(t, K(['shift', 'f5'].concat(gk[0]), 'SHIFT F5 (G-SOLV) ' + gk[1]));
          var want = kind === 'isct' ? [ti.g.f1, ti.g.f2] : [ti.g.fi];
          for (var w1 = 0; fx.g.mode === 'sel' && w1 < want.length; w1++) {
            var mv = []; for (var guard = 0; fx.g.fi !== want[w1] && guard < 25; guard++) { mv.push('down'); fx.press('down'); }
            mv.forEach(function () { fx.press('up'); });
            emit(t, K(mv.concat(['exe']), (mv.length ? mv.map(function () { return '▼'; }).join(' ') + ' ' : '') + 'EXE (pick Y' + (want[w1] + 1) + ')'));
          }
          if (kind === 'ycal' && fx.g.mode === 'inp') { var vk = numKeys(tx); emit(t, K(vk.keys.concat(['exe']), vk.label + ' EXE')); }
          if (fx.g.mode === 'res') {
            var best = 0; fx.g.sols.forEach(function (s, k) { if (Math.abs(s.x - tx) < Math.abs(fx.g.sols[best].x - tx)) best = k; });
            if (best > 0) { var rk = []; for (var r2 = 0; r2 < best; r2++) rk.push('right'); emit(t, K(rk, rk.map(function () { return '►'; }).join(' ') + ' (the next one)')); }
            if (Math.abs(fx.g.sols[fx.g.k].x - tx) > 1e-6 * Math.max(1, Math.abs(tx))) fallbacks.push(t + ' (not the same point)');
          } else if (fx.pop) fallbacks.push(t + ' (Not Found on the Casio)');
          i = j6; break;
        }
        case 'CALC': tiRun(i); toGraph(t); emit(t, K(['shift', 'f5'], 'SHIFT F5 (G-SOLV)')); break;
        case 'ZOOM': tiRun(i); toGraph(t); emit(t, K(['shift', 'f2'], 'SHIFT F2 (ZOOM)')); break;
        default:
          if (SIMPLE[t]) emit(t, SIMPLE[t]); else fallbacks.push(t);
          tiRun(i);
      }
    }
    out.fallbacks = fallbacks;
    return out;
  }

  /* ======================= register with js/calc84.js ======================= */
  TI.register('fx', { id: 'fx', name: 'Casio fx-9750GIII', engine: Fx, plan: fxPlan, skin: function (doc, shell) { var s = fxSkin(doc, shell); LIVE = s.calc; return s; } });
  HW.CalcFx = { engine: Fx, plan: fxPlan, LCD: LCD, exactForm: exactForm, decStr: decStr, cparse: cparse, flat: flat, KEY: KEY };
})(window);
