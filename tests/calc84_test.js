/* Tests for the TI-84 Plus CE–style calculator (js/calc84.js): node tests/calc84_test.js
 * Keys are pressed by their ids (see the top of calc84.js), e.g. "neg 2 sq enter" = (−) 2 x² ENTER. */
var fs = require('fs'), vm = require('vm');
var ctx = { console: console, Math: Math, JSON: JSON, Number: Number, String: String, Error: Error, Object: Object, Array: Array, isFinite: isFinite, isNaN: isNaN };
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/calc84.js', 'utf8'), ctx);
var Calc = ctx.HW.Calc.engine, fails = 0, n = 0;
function press(c, seq) { seq.split(/\s+/).filter(Boolean).forEach(function (k) { c.press(k); }); return c; }
function out(c) { if (c.scr === 'error') return 'ERR:' + c.err.code; var h = c.hist[c.hist.length - 1]; return h ? h.out : ''; }
function ok(cond, name, got) { n++; if (!cond) { fails++; console.log('FAIL', name, got !== undefined ? '=> ' + JSON.stringify(got) : ''); } else console.log('ok  ', name, got !== undefined ? '=> ' + JSON.stringify(got) : ''); }
function run(seq, want, c) { c = c || new Calc(); var got = out(press(c, seq)); ok(got === want, seq + '  (want ' + want + ')', got); return c; }
function near(a, b, tol) { return Math.abs(a - b) <= (tol || 1e-9) * Math.max(1, Math.abs(b)); }

console.log('--- order of operations');
run('2 pow 3 pow 2 enter', '64');                 // ^ is left to right on the TI-84
run('neg 2 sq enter', '-4');                      // powers before negation
run('neg 2 pow 2 enter', '-4');
run('lp neg 2 rp sq enter', '4');
run('6 div 2 lp 1 add 2 rp enter', '9');          // implied multiplication is the same level as × ÷
run('2 neg 3 enter', '-6');                       // 2⁻3 is 2 × (−3)
run('3 mul 2 pow 4 enter', '48');
run('neg 4 mul lp neg 3 rp pow 4 enter', '-324');
run('neg 4 mul neg 3 pow 4 enter', '324');
run('lp neg 3 rp pow 8 enter', '6561');
run('neg 3 pow 8 enter', '-6561');
run('2 2nd pow enter', '6.283185307');            // 2π
run('2 lp 3 add 4 enter', '14');                  // the missing ) at the end is fine
run('2 mul sub 3 enter', 'ERR:SYNTAX');           // − (subtract) where a number must start
run('2 add add 3 enter', 'ERR:SYNTAX');
run('1 div 0 enter', 'ERR:DIVIDE BY 0');
run('2 lp 3 add 4 rp rp enter', 'ERR:SYNTAX');

console.log('--- display');
run('1 div 3 enter', '.3333333333');
run('2 div 3 enter', '.6666666667');
run('neg 1 div 4 enter', '-.25');
run('1 2 3 4 5 6 7 8 9 mul 1 0 0 0 enter', '1.23456789ᴇ11');
run('. 0 0 0 1 2 enter', '1.2ᴇ-4');
run('. 0 0 1 enter', '.001');
run('2 2nd comma 3 enter', '2000');               // EE
run('4 5 0 mul 1 . 1 2 pow 1 0 enter', '1397.631694');
run('6 5 0 0 mul 1 . 0 3 8 pow 9 enter', '9092.630403');
run('mode down right right right enter 2nd mode 1 div 3 enter', '.33'); // Fix 2

console.log('--- fractions (►Frac, ►Dec)');
run('1 div 3 add 1 div 6 math 1 enter', '1/2');
run('1 2 5 0 mul lp neg 1 div 5 rp pow 7 enter math 1 enter', '-2/125'); // MATH 1 after ENTER pastes Ans►Frac
run('1 2 1 5 mul lp neg 1 div 3 rp pow 7 math 1 enter', '-5/9');
run('. 7 5 math 1 enter', '3/4');
run('2nd pow math 1 enter', '3.141592654');       // π has no fraction
run('1 div 3 math 2 enter', '.3333333333');
run('1 2 8 mul lp lp 1 div 4 rp pow 7 sub 1 rp div lp 1 div 4 sub 1 rp math 1 enter', '5461/32');
run('math right 0 1 7 comma 5 enter', '2');       // remainder(17,5)

console.log('--- trig (degree is the default) and inverse trig');
run('sin 3 0 enter', '.5');
run('cos 6 0 rp enter', '.5');
run('tan 4 5 enter', '1');
run('sin 1 8 0 enter', '0');
run('tan 9 0 enter', 'ERR:DOMAIN');
run('2nd sin . 5 enter', '30');
run('2nd cos neg . 5 enter', '120');
run('2nd tan 1 enter', '45');
run('2nd sin 2 enter', 'ERR:DOMAIN');
run('8 mul tan 4 0 rp enter', '6.712797049');
var rad = 'mode down down left enter 2nd mode ';
run(rad + 'sin 2nd pow div 6 enter', '.5');
run(rad + '2nd sin 1 enter', '1.570796327');
run(rad + 'sin 3 0 2nd apps 1 enter', '.5');      // 30° in radian mode

console.log('--- roots, powers, abs');
run('2nd sq 4 9 enter', '7');
run('2nd sq neg 4 enter', 'ERR:NONREAL ANSWERS');
run('3 math 5 8 enter', '2');                     // 3 ˣ√ 8
run('math 4 neg 2 7 enter', '-3');                // ³√(−27)
run('lp neg 8 rp pow lp 1 div 3 rp enter', '-2');
run('lp neg 8 rp pow lp 2 div 3 rp enter', '4');
run('lp neg 8 rp pow . 5 enter', 'ERR:NONREAL ANSWERS');
run('7 math 5 1 . 3 6 enter', '1.044905432');
run('1 . 3 6 pow lp 1 div 7 rp enter', '1.044905432');
run('5 math 3 enter', '125');
run('4 inv enter', '.25');
run('0 inv enter', 'ERR:DIVIDE BY 0');
run('math right 1 neg 5 enter', '5');
run('math right 1 3 sub 8 enter', '5');
run('math right 5 neg 2 . 5 enter', '-3');        // int(
run('math right 3 neg 2 . 5 enter', '-2');        // iPart(
run('0 pow 0 enter', 'ERR:DOMAIN');
run('1 0 pow 1 0 0 enter', 'ERR:OVERFLOW');
run('5 math left left 4 enter', '120');           // 5!
run('5 math left left 3 2 enter', '10');          // 5 nCr 2

console.log('--- lists, seq(, sum(');
run('2nd stat left 5 2nd stat right 5 3 mul 2 pow lp alpha log sub 1 rp comma alpha log comma 1 comma 1 0 rp rp enter', '3069'); // sum(seq(3*2^(N−1),N,1,10))
run('2nd stat right 5 alpha log sq comma alpha log comma 1 comma 4 enter', '{1 4 9 16}');
run('2nd lp 1 comma 2 comma 3 2nd rp mul 2 enter', '{2 4 6}');
run('2nd lp 1 comma 2 2nd rp add 2nd lp 1 comma 2 comma 3 2nd rp enter', 'ERR:DIM MISMATCH');
run('2nd stat right 5 4 0 0 mul . 7 5 pow alpha log comma alpha log comma 1 comma 3 sto 2nd 1 enter 2nd stat left 5 2nd 1 enter', '693.75');
run('math 0 2 alpha log sub 1 comma alpha log comma 1 comma 1 0 0 enter', '10000'); // Σ(2N−1,N,1,100)
run('2nd stat right 5 alpha log comma alpha log comma 1 enter', 'ERR:ARGUMENT');

console.log('--- STO→, Ans, ENTRY, editing');
var c = run('5 sto math enter', '5');            // ALPHA comes on after STO→: math = A
run('2 alpha math enter', '10', c);
run('5 enter add 3 enter', '8');
c = run('5 0 0 enter mul . 7 enter enter enter', '171.5'); // ENTER on an empty line runs the last entry again
ok(c.hist[1].toks.map(function (t) { return t.s; }).join('') === 'Ans*.7', 'Ans inserted before ×', c.hist[1].toks.map(function (t) { return t.s; }).join(''));
c = press(new Calc(), '2 add 3 enter 2nd enter');
ok(c.line.t.map(function (t) { return t.s; }).join('') === '2+3', '2nd ENTRY recalls the last entry');
c = press(new Calc(), '1 2 3 left left 9 enter');     // overwrite: 193
ok(out(c) === '193', 'cursor overwrite', out(c));
c = press(new Calc(), '1 2 3 left left 2nd del 9 enter');  // insert: 1923
ok(out(c) === '1923', '2nd INS inserts', out(c));
c = press(new Calc(), '1 2 3 left del enter');
ok(out(c) === '12', 'DEL deletes the character under the cursor', out(c));
c = press(new Calc(), '2 add mul 3 enter');
ok(c.scr === 'error' && c.err.code === 'SYNTAX', 'syntax error screen');
press(c, '2'); ok(c.scr === 'home' && c.line.c === 2, 'Goto puts the cursor on the error', c.line.c);
c = press(new Calc(), '2 add mul 3 enter 1'); ok(c.scr === 'home' && c.line.t.length === 0, '1:Quit');
c = press(new Calc(), '7 enter 8 enter up up enter enter'); // ▲ ▲ picks the entry 8, ENTER pastes it, ENTER runs it
ok(out(c) === '8', '▲ into the history pastes an entry', out(c));
c = press(new Calc(), 'stat'); ok(c.scr === 'error' && c.err.code === 'UNAVAILABLE', 'STAT says it is not on this calculator');

console.log('--- Y=, TABLE, TBLSET');
function withY(exprKeys, more) { var c = press(new Calc(), 'yeq clear ' + exprKeys + ' 2nd mode'); return more ? press(c, more) : c; }
c = withY('xt sq sub 4');
ok(c.Y[0].on && c.Y[0].line.t.map(function (t) { return t.s; }).join('') === 'X²−4', 'Y1=X²−4 typed', c.Y[0].line.t.map(function (t) { return t.s; }).join(''));
ok(c.tableRow(3)[0] === 5 && c.tableRow(-1)[0] === -3, 'table values of X²−4', [c.tableRow(3)[0], c.tableRow(-1)[0]]);
press(c, '2nd graph');
ok(c.scr === 'table' && /X\s+Y₁/.test(c.text()) && /0 -4/.test(c.text().replace(/\s+/g, ' ')), 'TABLE screen shows X and Y1', c.text().split('\n').slice(2, 5).join(' | '));
press(c, '2nd window 1 enter 2 enter 2nd graph');
ok(c.tableX(0) === 1 && c.tableX(1) === 3 && c.tableRow(c.tableX(1))[0] === 5, 'TBLSET TblStart=1 ΔTbl=2', [c.tableX(0), c.tableX(1)]);
press(c, 'down down down down down down down down down down');
ok(c.tb.top === 5, 'scrolling past the bottom moves the table', c.tb.top);
c = withY('5 0 0 mul . 7 pow xt', '2nd window 0 enter 1 enter 2nd graph');
var rows = []; for (var r = 0; r < 9; r++) rows.push(c.fmtVal({ f: c.tableRow(c.tableX(r))[0] }));
ok(rows.slice(0, 4).join(' ') === '500 350 245 171.5', 'table of 500(.7)^X', rows.join(' '));
c = withY('1 div lp xt sub 2 rp', '2nd window 0 enter 1 enter 2nd graph');
ok(/ERROR/.test(c.text()) && isNaN(c.tableRow(2)[0]), 'table shows ERROR at X=2 for 1/(X−2)');

console.log('--- CALC: zero, minimum, maximum, intersect, value');
c = withY('xt sq sub 4', 'zoom 6 2nd trace 2');
ok(c.g.mode === 'calc' && /Left Bound\?/.test(c.graphText()), 'CALC zero asks Left Bound?');
press(c, '0 enter'); ok(/Right Bound\?/.test(c.graphText()), 'then Right Bound?');
press(c, '5 enter'); ok(/Guess\?/.test(c.graphText()), 'then Guess?');
press(c, '3 enter');
ok(c.g.res && c.g.res.label === 'Zero' && c.g.x === 2, 'zero of X²−4 between 0 and 5 is 2', c.g.x);
ok(/X=2/.test(c.graphText()) && /Y=0/.test(c.graphText()), 'readout X=2 Y=0', c.graphText().replace(/<[^>]+>/g, ' '));
ok(near(c.zero(0, -5, 0, -1), -2), 'the other zero is −2', c.zero(0, -5, 0, -1));
var mn = c.extremum(0, -3, 3, 0, false); ok(near(mn, 0, 1e-7) && near(c.fx(0, mn), -4), 'minimum of X²−4 at (0, −4)', [mn, c.fx(0, mn)]);
c = withY('xt sq sub 4', 'zoom 6 2nd trace 3 neg 3 enter 3 enter 0 enter');
ok(c.g.res.label === 'Minimum' && Math.abs(c.g.x) < 1e-7 && c.g.res.y === -4, 'CALC minimum by keys', [c.g.x, c.g.res.y]);
c = withY('neg lp xt sub 2 rp sq add 5', 'zoom 6 2nd trace 4');
press(c, 'left left left left left left left left left left enter');   // Left Bound by moving the cursor
press(c, 'right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right enter enter');
ok(c.g.res && c.g.res.label === 'Maximum' && near(c.g.x, 2, 1e-7) && near(c.g.res.y, 5), 'maximum of −(X−2)²+5 is (2, 5)', [c.g.x, c.g.res && c.g.res.y]);
ok(/X=2 /.test(c.graphText().replace(/<[^>]+>/g, ' ') + ' ') && /Y=5/.test(c.graphText()), 'readout X=2 Y=5', c.graphText().replace(/<[^>]+>/g, ' '));
c = press(new Calc(), 'yeq clear 2 xt add 1 down clear xt sq 2nd mode zoom 6 2nd trace 5');
ok(/First curve\?/.test(c.graphText()), 'intersect asks First curve?');
press(c, 'enter'); ok(/Second curve\?/.test(c.graphText()) && c.g.fi === 1, 'then Second curve? on Y2');
press(c, 'enter'); ok(/Guess\?/.test(c.graphText()), 'then Guess?');
press(c, '2 enter');
ok(c.g.res.label === 'Intersection' && near(c.g.x, 1 + Math.SQRT2) && near(c.g.res.y, 3 + 2 * Math.SQRT2), 'intersection of 2X+1 and X² near 2 is (2.414…, 5.828…)', [c.g.x, c.g.res.y]);
ok(/X=2\.4142136/.test(c.graphText()) && /Y=5\.8284271/.test(c.graphText()), 'readout', c.graphText().replace(/<[^>]+>/g, ' '));
var i2 = c.intersect(0, 1, -1); ok(near(i2.x, 1 - Math.SQRT2), 'the other intersection (guess −1) is −0.414…', i2.x);
c = withY('xt sq sub 4', 'zoom 6 2nd trace 1 3 enter');
ok(/X=3/.test(c.graphText()) && /Y=5/.test(c.graphText()), 'CALC value at X=3 gives Y=5', c.graphText().replace(/<[^>]+>/g, ' '));
c = withY('1 div lp xt sub 2 rp', 'zoom 6 2nd trace 2 1 enter 3 enter 2 enter');
ok(c.scr === 'error' && c.err.code === 'NO SIGN CHANGE', '1/(X−2) has no zero between 1 and 3 (the sign change is the asymptote)', c.err && c.err.code);
c = withY('xt sq sub 4', 'zoom 6 2nd trace 2 5 enter 0 enter');
ok(c.scr === 'error' && c.err.code === 'BOUND', 'Right Bound left of the Left Bound is ERROR: BOUND', c.err && c.err.code);
c = withY('math right 1 xt sub 1 rp sub 2');
ok(near(c.zero(0, 0, 5, 3), 3) && near(c.zero(0, -5, 0, -1), -1), 'zeros of abs(X−1)−2 are 3 and −1');

console.log('--- graph: trace, asymptotes, zooms, window');
c = withY('xt sq sub 4', 'zoom 6 trace');
ok(c.g.mode === 'trace' && c.g.x === 0 && /Y=-4/.test(c.graphText()), 'TRACE starts at X=0 on ZStandard', c.graphText().replace(/<[^>]+>/g, ' '));
press(c, 'right'); ok(near(c.g.x, 20 / 264 * 2), 'one ► moves by TraceStep = 2ΔX', c.g.x);
press(c, '1 . 5 enter'); ok(c.g.x === 1.5 && /Y=-1\.75/.test(c.graphText()), 'typing 1.5 jumps the trace to X=1.5', c.graphText().replace(/<[^>]+>/g, ' '));
c = withY('1 div lp xt sub 2 rp', 'zoom 6');
var p = c.plot()[0], cut = c.px(2), bad = p.segs.filter(function (s) { return s[0][0] < cut && s[s.length - 1][0] > cut; });
ok(p.segs.length >= 2 && bad.length === 0, 'no line across the asymptote of 1/(X−2)', p.segs.length + ' segments');
c = withY('math right 1 xt rp');
p = c.plot()[0]; ok(p.segs.length === 1, 'abs(X) graphs as one piece', p.segs.length);
c = withY('xt sq', 'zoom 4');
ok(c.win.xmin === -6.6 && c.win.xmax === 6.6 && c.win.ymax === 4.1, 'ZDecimal');
press(c, 'trace right'); ok(near(c.g.x, 0.1), 'ZDecimal traces by .1', c.g.x);
press(c, 'zoom 5'); ok(near(c.dX(), c.dY()), 'ZSquare makes ΔX = ΔY', [c.dX(), c.dY()]);
c = withY('xt sq', 'zoom 0'); ok(near(c.win.ymin, 0, 1e-6) && near(c.win.ymax, 100, 1e-6), 'ZoomFit fits Y to X² on −10…10', [c.win.ymin, c.win.ymax]);
c = press(new Calc(), 'window neg 5 enter 5 enter');
ok(c.win.xmin === -5 && c.win.xmax === 5, 'WINDOW: typing replaces Xmin and Xmax', [c.win.xmin, c.win.xmax]);
c = press(new Calc(), 'window 5 enter neg 5 enter graph');
ok(c.scr === 'error' && c.err.code === 'WINDOW RANGE', 'Xmin > Xmax gives WINDOW RANGE');
c = press(new Calc(), 'yeq 2 add add 2nd mode graph');
ok(c.scr === 'error' && c.err.code === 'SYNTAX', 'a typo in Y1 stops the graph');
press(c, '2'); ok(c.scr === 'yeq' && c.yrow === 0, 'Goto opens Y=');
c = press(new Calc(), 'yeq xt left left enter');
ok(!c.Y[0].on, '◄ to = and ENTER turns Y1 off');
press(c, 'left enter enter'); ok(c.Y[0].style === 2, '◄ to the style and ENTER changes it (shade above)', c.Y[0].style);
c = press(new Calc(), 'yeq xt down 2 2nd mode vars right 1 2 lp 3 enter');
ok(out(c) === '2', 'VARS Y-VARS: Y2(3)', out(c));
c = press(new Calc(), 'yeq xt sq 2nd mode vars right 1 1 lp 4 rp enter');
ok(out(c) === '16', 'Y1(4)', out(c));

console.log('--- key-press demos (HW.Calc.plan)');
var P = ctx.HW.Calc.plan;
var pl = P('1250 × ( (−) 1 ÷ 5 ) ^ 7 = ►Frac =');
ok(pl[pl.length - 2].label === 'MATH 1 (►Frac)' && pl[0].keys.join('') === '1250', 'plan labels', pl.map(function (x) { return x.label; }).join(' '));
ok(P('√').map(function (x) { return x.label; })[0] === '2nd x² (√)' && P('TABLE')[0].label === '2nd TABLE', 'TI-84 key names in captions');
function demo(spec) { var c = new Calc(); P(spec).forEach(function (s) { s.keys.forEach(function (k) { c.press(k); }); }); return c; }
ok(out(demo('1250 × ( (−) 1 ÷ 5 ) ^ 7 = ►Frac =')) === '-2/125', 'demo ►Frac');
ok(out(demo('sum( seq( 3 × 2 ^ ( N − 1 ) , N , 1 , 10 ) ) =')) === '3069', 'demo sum(seq(');
c = demo('Y= CLEAR 500 × .7 ^ X TBLSET 0 ENTER 1 ENTER TABLE');
ok(c.scr === 'table' && c.tableRow(8)[0] < 30 && /500/.test(c.text()), 'demo table', c.text().split('\n').slice(2, 4).join(' | '));
c = demo('Y= CLEAR 2 X + 1 ▼ CLEAR X x² ZStandard intersect ENTER ENTER 2 ENTER');
ok(c.g.res && c.g.res.label === 'Intersection', 'demo intersect');

console.log('\n' + (n - fails) + '/' + n + ' passed');
if (fails) process.exit(1);
