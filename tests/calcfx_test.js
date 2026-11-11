/* Tests for the Casio fx-9750GIII–style calculator (js/calcfx.js, which reuses js/calc84.js): node tests/calcfx_test.js
 * Keys are pressed by their ids (see the top of calcfx.js), e.g. "neg 2 sq exe" = (−) 2 x² EXE.
 * The last part runs every "Show me" demo on the lesson pages (data-keys) on both calculators and checks that the
 * Casio ends on the same number as the TI-84. */
var fs = require('fs'), vm = require('vm'), path = require('path');
var ctx = { console: console, Math: Math, JSON: JSON, Number: Number, String: String, Error: Error, Object: Object, Array: Array, isFinite: isFinite, isNaN: isNaN, Uint8Array: Uint8Array };
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/calc84.js', 'utf8'), ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/calcfx.js', 'utf8'), ctx);
var HW = ctx.HW, Fx = HW.CalcFx.engine, TI = HW.Calc84.Calc, fails = 0, n = 0;
function press(c, seq) { seq.split(/\s+/).filter(Boolean).forEach(function (k) { c.press(k); }); return c; }
/* what the last answer shows (exact form when there is one, as the Math display draws it), or ERR:<message> */
function out(c) {
  if (c.pop) return 'ERR:' + (c.err ? c.err.msg : c.pop.lines[0]);
  var h = c.hist[c.hist.length - 1]; if (!h) return '';
  var t = c.text().split('\n'); return t[t.length - 2];
}
function ok(cond, name, got) { n++; if (!cond) { fails++; console.log('FAIL', name, got !== undefined ? '=> ' + JSON.stringify(got) : ''); } else console.log('ok  ', name, got !== undefined ? '=> ' + JSON.stringify(got) : ''); }
function run(seq, want, c) { c = c || new Fx(); var got = out(press(c, seq)); ok(got === want, seq + '  (want ' + want + ')', got); return c; }
function near(a, b, tol) { return Math.abs(a - b) <= (tol || 1e-9) * Math.max(1, Math.abs(b)); }

console.log('--- order of operations (the Casio way)');
run('2 pow 3 right pow 2 exe', '64');            // (2³)² with ► out of the first exponent box
run('2 pow 3 pow 2 exe', '512');                 // 2^(3^2): the second ^ goes in the raised box
run('neg 2 sq exe', '-4');                       // (−) takes what comes after it: −(2²)
run('lp neg 2 rp sq exe', '4');
run('6 div 2 lp 1 add 2 rp exe', '1');           // a product without × comes before ÷ on the Casio
run('6 div 2 mul lp 1 add 2 rp exe', '9');
run('2 neg 3 exe', '-6');
run('neg 4 mul lp neg 3 rp pow 4 exe', '-324');
run('neg 3 pow 8 exe', '-6561');
run('2 lp 3 add 4 exe', '14');                   // the missing ) at the end is fine
run('2 mul sub 3 exe', 'ERR:Syntax ERROR');      // − (subtract) where a number must start
run('1 div 0 exe', 'ERR:Math ERROR');
run('2 lp 3 add 4 rp rp exe', 'ERR:Syntax ERROR');
run('sin 3 0 add 1 exe', '3/2');                 // sin 30 + 1 = sin(30) + 1
run('2 sin 3 0 exe', '1');
run('8 add 2 lp 3 rp exe', '14');
run('shift exp 2 exe', '6.283185307');           // π2 = 2π
run('2 shift exp exe', '6.283185307');

console.log('--- natural display: fractions, surds, S⇔D');
run('1 div 3 exe', '1/3');
run('1 div 3 exe sd', '0.3333333333');
run('1 div 3 exe sd sd', '1/3');
run('2 div 3 exe sd', '0.6666666667');
run('frac 1 right 3 right add frac 1 right 6 exe', '1/2'); // □/□ + □/□
run('frac 2 down 3 right pow 2 exe', '4/9');      // (2/3)²
run('1 2 5 0 mul lp neg 1 div 5 rp pow 7 exe', '-2/125');
run('0 . 7 5 exe', '3/4');                        // a decimal comes out as a fraction
run('1 5 mul 0 . 7 pow 4 exe sd', '3.6015');
run('6 0 0 div 9 exe', '200/3');
run('shift sq 8 exe', '2√2');                     // surds
run('shift sq 1 7 1 exe', '3√19');
run('cos 3 0 exe', '√3/2');
run('shift sq 9 sq add 6 sq sub 2 mul 9 mul 6 cos 1 2 0 exe sd', '13.07669683');
run('shift sq 4 9 exe', '7');
run('shift sq neg 4 exe', 'ERR:Non-Real ERROR');
run('shift pow 3 right 8 exe', '2');              // ˣ√ with the index first
run('shift lp neg 2 7 exe', '-3');                // ³√
run('shift pow 7 right 1 . 3 6 exe', '1.044905432');
run('1 . 3 6 pow 1 div 7 exe', '1.044905432');
run('lp neg 8 rp pow 2 div 3 exe', '4');          // (−8)^(2÷3)
run('lp neg 8 rp pow frac 1 right 3 exe', '-2');
run('4 shift rp exe', '1/4');                     // x⁻¹
run('5 0 0 mul . 7 pow 8 exe', '28.824005');
run('1 2 3 4 5 6 7 8 9 mul 1 0 0 0 exe', '1.23456789ᴇ+11');
run('. 0 0 0 1 2 exe sd', '1.2ᴇ-04');
run('2 exp 3 exe', '2000');
run('1 0 pow 1 0 0 exe', 'ERR:Math ERROR');
run('shift log 2 exe', '100');                    // 10^□
run('shift ln 1 exe sd', '2.718281828');
run('optn f6 f3 f1 neg 5 exe', '5');              // Abs
run('optn f6 f3 f5 neg 2 . 5 exe', '-3');         // Intg (floor)
run('optn f6 f3 f2 neg 2 . 5 exe', '-2');         // Int (integer part)
run('5 optn f6 f2 f1 exe', '120');                // 5!
run('5 optn f6 f2 f3 2 exe', '10');               // 5C2

console.log('--- degree trig (the default for the class)');
run('sin 3 0 exe', '1/2');
run('tan 4 5 exe', '1');
run('sin 1 8 0 exe', '0');
run('tan 9 0 exe', 'ERR:Math ERROR');
run('shift sin 0 . 5 exe', '30');
run('shift cos neg 0 . 5 exe', '120');
run('shift sin 2 exe', 'ERR:Math ERROR');
run('8 tan 4 0 exe', '6.712797049');
run('1 2 0 sin 3 1 div sin 2 1 exe', '172.4612066');
run('shift menu down down down down down f2 exit sin frac shift exp right 6 exe', '1/2'); // SET UP Angle Rad: sin(π/6)
run('shift menu down down down down down f2 exit sin shift exp div 6 exe', '0');   // sin π ÷ 6 = (sin π)÷6
c = press(new Fx(), 'shift menu down down down down down');
ok(/Angle\s*:Deg/.test(c.text()), 'SET UP shows Angle :Deg', c.text().split('\n').filter(function (l) { return /Angle/.test(l); })[0]);

console.log('--- Ans, history, STO, replay');
var c = run('5 exe add 3 exe', '8');              // + on an empty line starts with Ans
ok(c.hist[1].row.map(function (t) { return t.s; }).join('') === 'Ans+3', 'Ans put in front of +');
c = run('5 0 0 exe mul . 7 exe exe exe', '343/2'); // EXE on an empty line repeats the last calculation
c = run('5 sto alpha xt exe 2 alpha xt exe', '10'); // 5→A, 2A
c = run('3 exe shift neg mul 2 exe', '6');
c = press(new Fx(), '2 add 3 exe left'); ok(c.ed.root.map(function (t) { return t.s; }).join('') === '2+3', '◄ brings back the last calculation');
c = press(new Fx(), '7 exe 8 exe up up exe exe'); ok(out(c) === '7', '▲ picks an earlier line, EXE copies it, EXE runs it', out(c));
c = press(new Fx(), '2 add mul 3 exe'); ok(c.pop && c.err.msg === 'Syntax ERROR', 'Syntax ERROR box');
press(c, 'exit'); ok(!c.pop && c.ed.root.length === 4, 'EXIT goes back to the line');
c = press(new Fx(), '1 2 3 left del 9 exe'); ok(out(c) === '193', 'DEL deletes left of the cursor (insert)', out(c));

console.log('--- Σ( and lists');
run('optn f4 f6 f3 2 alpha 8 sub 1 comma alpha 8 comma 1 comma 1 0 0 exe', '10000'); // Σ(2N−1,N,1,100)
run('optn f4 f6 f3 3 mul 2 pow alpha 8 sub 1 right comma alpha 8 comma 1 comma 1 0 exe', '3069'); // Σ(3×2^(N−1),N,1,10)
run('optn f1 f6 f6 f1 optn f1 f5 alpha 8 sq comma alpha 8 comma 1 comma 4 comma 1 exe', '30'); // Sum Seq(N²,N,1,4,1)
run('optn f1 f5 alpha 8 sq comma alpha 8 comma 1 comma 4 comma 1 exe', '{1,4,9,16}');
run('shift mul 1 comma 2 comma 3 shift div mul 2 exe', '{2,4,6}');

console.log('--- MENU, GRAPH list, TABLE');
function withY(keys, more) { var c = press(new Fx(), 'menu 3 ' + keys + ' exe'); return more ? press(c, more) : c; }
c = withY('xt sq sub 4');
ok(c.app === 'graph' && c.F[0].on && c.F[0].row.length === 4, 'MENU 3, Y1=X²−4 typed', c.text().split('\n')[1]);
ok(/^Y1=X²−4$/m.test(c.text()), 'the list shows Y1=X²−4', c.text().split('\n')[1]);
press(c, 'menu 5'); ok(c.app === 'table' && c.scr === 'tlist' && c.F[0].row.length === 4, 'TABLE shares the functions');
press(c, 'f6'); ok(c.scr === 'table' && c.tb.xs.join(',') === '1,2,3,4,5', 'F6 TABLE: X from 1 to 5 by default', c.tb.xs.join(','));
press(c, 'right down'); ok(c.value().v === 0, 'X=2 gives Y1=0', c.value());
press(c, 'exit f5 0 exe 2 0 exe 1 exe exit f6 right down down down down down down down');
ok(c.tb.xs[0] === 0 && c.tb.xs.length === 21 && c.value().v === 45, 'SET Start 0 End 20 Step 1; scrolled to X=7', c.value());
ok(/45/.test(c.text()), 'the table shows 45', c.text());
press(c, 'left 2 . 5 exe'); ok(c.tb.xs[7] === 2.5 && c.cell(7, 1) === 2.25, 'typing over an X changes the row', c.cell(7, 1));
c = press(new Fx(), 'menu 5 1 div lp xt sub 2 exe f6 right down');
ok(/ERROR/.test(c.text()) && isNaN(c.value().v), 'table shows ERROR at X=2 for 1/(X−2)');

console.log('--- G-Solv: ROOT, MAX, MIN, Y-ICEPT, INTSECT, Y-CAL, X-CAL');
c = withY('xt sq sub 4', 'shift f3 f3 exit f6 shift f5 f1');
ok(c.scr === 'graph' && c.g.mode === 'res' && c.value().x === -2 && /ROOT/.test(c.text()), 'ROOT of X²−4 finds −2 first', c.value());
press(c, 'right'); ok(c.value().x === 2 && c.value().y === 0, '► the next root is 2', c.value());
ok(/X=2/.test(c.text()) && /Y=0/.test(c.text()), 'readout X=2 Y=0', c.text());
c = withY('xt sq sub 4', 'f6 shift f5 f3'); ok(near(c.value().x, 0, 1e-7) && near(c.value().y, -4), 'MIN (0, −4)', c.value());
c = withY('neg lp xt sub 2 rp sq add 5', 'shift f3 f3 exit f6 shift f5 f2'); ok(near(c.value().x, 2, 1e-7) && near(c.value().y, 5), 'MAX of −(X−2)²+5 is (2, 5)', c.value());
c = withY('xt sq sub 4', 'f6 shift f5 f4'); ok(c.value().x === 0 && c.value().y === -4, 'Y-ICEPT', c.value());
c = press(new Fx(), 'menu 3 2 xt add 1 exe xt sq exe shift f3 f3 exit f6 shift f5 f5');
ok(c.g.mode === 'res' && near(c.value().x, 1 - Math.SQRT2) && near(c.value().y, 3 - 2 * Math.SQRT2), 'INTSECT of 2X+1 and X² (two graphs: no question)', c.value());
press(c, 'right'); ok(near(c.value().x, 1 + Math.SQRT2), '► the other intersection', c.value());
c = press(new Fx(), 'menu 3 2 xt add 1 exe xt sq exe xt exe shift f3 f3 exit f6 shift f5 f5');
ok(c.g.mode === 'sel', 'three graphs: INTSECT asks which two');
press(c, 'exe exe'); ok(c.g.mode === 'res' && near(c.value().x, 1 - Math.SQRT2), 'Y1 and Y2 picked', c.value());
c = withY('lp xt sub 2 rp sq', 'f6 shift f5 f1'); ok(c.g.mode === 'res' && near(c.value().x, 2, 1e-6), 'ROOT of (X−2)² (it touches the axis)', c.value());
c = withY('xt sq add 1', 'f6 shift f5 f1'); ok(c.pop && /Not Found/.test(c.pop.lines[0]), 'no root: Not Found');
c = withY('1 div lp xt sub 2 rp', 'f6 shift f5 f1'); ok(c.pop && /Not Found/.test(c.pop.lines[0]), '1/(X−2) has no root (the asymptote is not one)');
c = withY('xt sq sub 4', 'f6 shift f5 f6 f1 3 exe'); ok(c.value().x === 3 && c.value().y === 5, 'Y-CAL X=3 gives Y=5', c.value());
c = withY('xt sq sub 4', 'shift f3 f3 exit f6 shift f5 f6 f2 5 exe'); ok(near(c.value().x, -3) && c.value().y === 5, 'X-CAL Y=5 gives X=−3 first', c.value());
c = withY('optn f6 f3 f1 lp xt sub 1 rp sub 2', 'f6 shift f5 f1'); ok(near(c.value().x, -1), 'Abs(X−1)−2: root −1', c.value());

console.log('--- Trace, V-Window, Zoom, inequalities');
c = withY('xt sq sub 4', 'f6 shift f1');
ok(c.g.mode === 'trace' && c.g.x === 0 && /Y=-4/.test(c.text()), 'Trace starts at X=0 on the INITIAL window', c.text());
press(c, 'right'); ok(near(c.g.x, 0.1), '► moves one dot (0.1)', c.g.x);
press(c, '1 . 5 exe'); ok(c.g.x === 1.5 && /Y=-1.75/.test(c.text()), 'typing 1.5 jumps there', c.text());
c = press(new Fx(), 'menu 3 shift f3 neg 5 exe 5 exe');
ok(c.win.xmin === -5 && c.win.xmax === 5 && near(c.dot(), 10 / 126), 'V-Window: typing replaces Xmin and max', [c.win.xmin, c.win.xmax]);
c = press(new Fx(), 'menu 3 shift f3 5 exe neg 5 exe exit xt exe f6'); ok(c.pop && c.err.msg === 'Range ERROR', 'Xmin > max gives Range ERROR');
c = withY('xt sq', 'shift f3 f3 exit f6 shift f2 f5'); ok(near(c.win.ymin, -5, 1e-6) && near(c.win.ymax, 105, 1e-6), 'Zoom AUTO fits Y to X²', [c.win.ymin, c.win.ymax]);
c = press(new Fx(), 'menu 3 f3 f6 f1 xt exe xt sq exe f6');
ok(c.F[0].type === 'Y>' && c.F[1].type === 'Y=', 'TYPE ▷ Y> makes Y1 an inequality');
var L = new HW.CalcFx.LCD(); c.paint(L); var shaded = 0; for (var q = 0; q < L.p.length; q++) shaded += L.p[q];
ok(shaded > 1500, 'the region above Y1=X is shaded', shaded);
c = press(new Fx(), 'menu 3 2 add add exe f6'); ok(c.pop && c.err.msg === 'Syntax ERROR', 'a typo in Y1 stops the graph');
c = press(new Fx(), 'menu 3 xt exe up f1'); ok(!c.F[0].on, 'F1 SELECT turns Y1 off');
c = press(new Fx(), 'menu 3 xt exe up f2 f1'); ok(!c.F[0].row.length, 'F2 DELETE F1 Yes deletes Y1');
c = press(new Fx(), 'menu 3 xt exe xt sq exe menu 1 vars f4 f1 2 lp 3 rp exe'); ok(out(c) === '9', 'VARS GRAPH Y: Y2(3)', out(c));
c = press(new Fx(), 'menu 9'); ok(c.pop && /Not on this/.test(c.pop.lines[0]), 'other apps say they are not on this calculator');

console.log('--- the TI-84 | Casio choice');
ok(HW.Calc.model === 'TI-84 Plus CE' && HW.Calc.engine === TI, 'TI-84 by default');
HW.Calc.setModel('fx');
ok(HW.Calc.model === 'Casio fx-9750GIII' && HW.Calc.engine === Fx && HW.Calc.modelId() === 'fx', 'setModel("fx") switches the façade');
var p = HW.Calc.plan('600 ÷ 9 =');
ok(p.map(function (s) { return s.label; }).join(' ') === '600 ÷ 9 EXE S⇔D', 'Casio captions', p.map(function (s) { return s.label; }).join(' '));
HW.Calc.setModel('ti84');
ok(HW.Calc.plan('600 ÷ 9 =').map(function (s) { return s.label; }).join(' ') === '600 ÷ 9 ENTER', 'and back to the TI-84');

console.log('--- key-press demos: every lesson demo on both calculators gives the same number');
var Pfx = HW.CalcFx.plan, Pti = HW.Calc84.plan;
function tiRun(spec) { var c = new TI(); c.toHome(true); Pti(spec).forEach(function (s) { s.keys.forEach(function (k) { c.press(k); }); }); return c; }
function fxRun(spec) { var c = new Fx(); c.toHome(true); var pl = Pfx(spec); pl.forEach(function (s) { s.keys.forEach(function (k) { c.press(k); }); }); c.plan = pl; return c; }
function tiVal(c) {
  if (c.scr === 'error') return { err: c.err.code };
  if (c.scr === 'table') { var tb = c.tb, x = c.tableX(tb.row); return { v: tb.col === 0 ? x : c.tableRow(x)[tb.col - 1] }; }
  if (c.scr === 'graph' && c.g.mode === 'calc' && c.g.res) return { v: c.g.x, y: c.g.res.y != null ? c.g.res.y : c.fx(c.g.fi, c.g.x) };
  var h = c.hist[c.hist.length - 1]; return h ? { v: h.v.L ? h.v.L.map(function (x) { return x.f; }) : h.v.f } : {};
}
function fxVal(c) { var v = c.value(); if (v.kind === 'error') return { err: v.code }; if (v.kind === 'point') return { v: v.x, y: v.y }; return { v: v.v }; }
function same(a, b) {
  if (a.v === undefined && b.v === undefined && !a.err && !b.err) return true;
  if (a.err || b.err) return !!a.err && !!b.err;
  if (Array.isArray(a.v)) return Array.isArray(b.v) && a.v.length === b.v.length && a.v.every(function (x, k) { return near(x, b.v[k], 1e-9); });
  if (!(typeof a.v === 'number' && typeof b.v === 'number' && (near(a.v, b.v, 1e-9) || (isNaN(a.v) && isNaN(b.v))))) return false;
  return a.y == null || near(a.y, b.y, 1e-7);
}
function shownSame(c, t) { // the Casio shows the same kind of number (no fraction where the TI-84 shows a decimal)
  if (c.scr !== 'run' || t.scr !== 'home' || !c.hist.length || c.pop) return true;
  var h = c.hist[c.hist.length - 1], ex = c.shown(h), th = t.hist[t.hist.length - 1];
  return !!(ex && ex.k !== 'int') === /\//.test(th ? th.out : '');
}
var specs = {};
(function walk(dir) {
  fs.readdirSync(dir).forEach(function (f) {
    var p2 = path.join(dir, f);
    if (fs.statSync(p2).isDirectory()) return walk(p2);
    if (!/\.(html|js)$/.test(f)) return;
    var s = fs.readFileSync(p2, 'utf8'), re = /data-keys="([^"]*)"/g, m;
    while ((m = re.exec(s))) { var sp = m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'); if (sp !== '…') (specs[sp] = specs[sp] || []).push(path.relative(__dirname + '/..', p2)); }
  });
})(path.join(__dirname, '..', 'lessons'));
// demos for what is coming in Units 5–8 (graphs, roots, intersections, windows), and the examples in the brief
[
  'Y= CLEAR X x² − 4 ZStandard zero (−) 1 ENTER 5 ENTER 2 ENTER',
  'Y= CLEAR X x² − 4 ZStandard zero (−) 5 ENTER (−) 1 ENTER (−) 2 ENTER',
  'Y= CLEAR (−) ( X − 2 ) x² + 5 ZStandard maximum 0 ENTER 4 ENTER 2 ENTER',
  'Y= CLEAR 2 X x² − 8 X + 3 ZStandard minimum 0 ENTER 4 ENTER 2 ENTER',
  'Y= CLEAR 2 X + 1 ▼ CLEAR X x² ZStandard intersect ENTER ENTER 2 ENTER',
  'Y= CLEAR 2 X + 1 ▼ CLEAR X x² ZStandard intersect ENTER ENTER (−) 1 ENTER',
  'Y= CLEAR √ X + 3 ) ▼ CLEAR X − 3 ZStandard intersect ENTER ENTER 6 ENTER',
  'Y= CLEAR abs( X − 1 ) − 2 ZStandard zero 0 ENTER 5 ENTER 3 ENTER',
  'Y= CLEAR 1 ÷ ( X − 2 ) ▼ CLEAR 3 ZStandard intersect ENTER ENTER 3 ENTER',
  'Y= CLEAR X x² − 4 GRAPH value 3 ENTER',
  'Y= CLEAR X x² − 2 X − 8 WINDOW (−) 10 ENTER 10 ENTER 1 ENTER (−) 12 ENTER 5 ENTER 1 ENTER zero 2 ENTER 6 ENTER 4 ENTER',
  'Y= CLEAR .5 X x² − 3 X + 2 TBLSET (−) 2 ENTER .5 ENTER TABLE ► ▼ ▼ ▼ ▼',
  'sum( seq( 3 × 2 ^ ( N − 1 ) , N , 1 , 10 ) ) =',
  'Σ( 2 N − 1 , N , 1 , 100 ) =',
  'MATH 1',
  '1 ÷ 3 + 1 ÷ 6 = ►Frac =',
  '5 STO→ A = 2 A =',
  '500 ÷ 2 sin 30 ) =',
  '6 ÷ 2 ( 1 + 2 ) =',
  '2 ^ 3 ^ 2 =',
  '( 1 + 2 ) ˣ√ 8 =',
  '√ 49 ) + 1 =',
  'MODE ▼ ▼ ◄ ENTER QUIT sin 3.14159 ÷ 6 ) =',
  '1 ÷ 3 = ►Frac = ►Dec ='
].forEach(function (s) { (specs[s] = specs[s] || []).push('(extra)'); });
var keysUsed = {}, demoFails = 0, demoN = 0, fb = {};
Object.keys(specs).forEach(function (spec) {
  var t = tiRun(spec), c = fxRun(spec), a = tiVal(t), b = fxVal(c), good = same(a, b) && shownSame(c, t);
  demoN++; if (!good) demoFails++;
  (c.plan.fallbacks || []).forEach(function (f) { fb[f] = (fb[f] || 0) + 1; });
  ok(good, 'demo  ' + spec + '  →  ' + c.plan.map(function (s) { return s.label; }).join(' '), { ti: a, casio: b, where: specs[spec][0] });
});
console.log('  ' + (demoN - demoFails) + '/' + demoN + ' demos the same on both' + (Object.keys(fb).length ? '; tokens with no Casio equivalent: ' + JSON.stringify(fb) : ''));

console.log('\n' + (n - fails) + '/' + n + ' passed');
if (fails) process.exit(1);
