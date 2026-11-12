/* Math 20-1 · Unit 5 · Lesson 10 — Maximum and Minimum Problems: Algebraic Approach (outcomes RF4, RF5)
 * Assignment 10 (m201book unit5/u5_l10.tex, Questions 1–18) and the Lesson 10 Extra Practice (u5_ep10.tex, A1–A2, B1–B7,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (contexts vary a
 * little); the lesson's example numbers and the booklet question's own numbers are left out. Calculator allowed, but the
 * vertex is found algebraically (completing the square, x = −b/(2a), or midway between the zeros), so vertex coordinates
 * are exact (fractions where the booklet has them); landing times and lengths are rounded as the booklet asks.
 * RF4 on every part except the "given value" equations (3(e), 11, 12(a), 13, Extra B4(b)), which are RF5.
 *
 * Uses the kit HW.u5mm from u5l9.js (load it first). Vertex form is checked by value at several x plus its form
 * a(x − p)² + q, with diagnoses: the sign of p, the added square not multiplied by a when it comes out of the bracket,
 * the added square not subtracted, a wrong q, a wrong a. "Maximum or minimum" is a word box.
 * Recognised mistakes (codes u5l10-…): the number of price changes for the price, a zero instead of the midpoint, the
 * x-coordinate for the max/min value, metres left in metres (centimetres asked), a fence counted wrongly (dividers, the
 * wall, the gate), one end of the yard instead of two, the side of one square for its perimeter, the time of the maximum
 * for its value. Conversions: "show that" → write the expression; "explain the two answers" / "which" → multiple choice;
 * pairs of numbers or lengths → boxes (either order where the booklet gives no order).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 13, Extra C1, C3(b). */
(function (root) {
  'use strict';
  var HW = root.HW;
  /* the kit HW.u5mm comes from u5l9.js: build now if it is loaded, otherwise when it loads (tests load files alphabetically) */
  if (HW.u5mm) build(); else (HW.u5mmWait = HW.u5mmWait || []).push(build);
  function build() {
  var K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u5l10', M = HW.u5mm;
  var cl = M.cl, same = M.same, nT = M.nT, rd = M.rd, fx = M.fx, money = M.money, pickWhere = M.pickWhere, toFrac = M.toFrac, rT = M.rT, cT = M.cT,
    polyTex = M.polyTex, binTex = M.binTex, vfTex = M.vfTex, roots = M.roots, numPart = M.numPart, apxPart = M.apxPart, fieldsPart = M.fieldsPart, mcPart = M.mcPart, exprPart = M.exprPart;

  var CODES = {
    'u5l10-steps': 'Gave the number of price changes, not the price', 'u5l10-zero': 'Used a zero instead of the midpoint of the zeros', 'u5l10-xval': 'Gave the x-coordinate as the max/min value',
    'u5l10-units': 'Left the answer in metres (centimetres asked)', 'u5l10-fence': 'Counted the fencing wrongly', 'u5l10-one-end': 'Counted one end instead of two', 'u5l10-side': 'Used the side instead of the perimeter of a square',
    'u5l10-time-value': 'Gave the time of the maximum instead of its value', 'u5l10-dir': 'Price or sales changed in the wrong direction', 'u5l10-swap': 'Values in each other’s boxes', 'u5l10-half': 'Halved (or doubled) where it shouldn’t',
    'u5l10-similar': 'Similar triangles: ratio upside down', 'u5l10-sign-b': 'Sign slip in −b/(2a)', 'u5l10-y-int': 'Gave the y-intercept as the max/min'
  };
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  HW.addPartial({ 'u5l10-steps': 's', 'u5l10-zero': 'b', 'u5l10-xval': 's', 'u5l10-units': 's', 'u5l10-fence': 'b', 'u5l10-one-end': 'b', 'u5l10-side': 'b', 'u5l10-time-value': 's', 'u5l10-dir': 'b', 'u5l10-swap': 's', 'u5l10-half': 'b', 'u5l10-similar': 'b', 'u5l10-sign-b': 's', 'u5l10-y-int': 'b' });

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function svgWrap(w, h, body, aria) { return '<div class="fig"><svg class="fig-svg" viewBox="0 0 ' + w + ' ' + h + '" style="max-width:' + w + 'px" role="img" aria-label="' + (aria || 'diagram') + '"><rect width="' + w + '" height="' + h + '" fill="#fff"/>' + body + '</svg></div>'; }
  function txt(x, y, s, anchor, it) { return '<text x="' + x + '" y="' + y + '" font-size="13" text-anchor="' + (anchor || 'middle') + '" fill="#2b3340"' + (it ? ' font-style="italic"' : '') + '>' + s + '</text>'; }
  var HV = ['Vertex form ' + t('a(x-p)^{2}+q') + ': vertex ' + t('(p,\\ q)') + '. General form: the axis is ' + t('x=-\\frac{b}{2a}') + '; substitute it for the other coordinate. Factored form: the axis is midway between the zeros.', t('a<0') + ': the vertex is a maximum. ' + t('a>0') + ': a minimum.'];

  /* ---- completing the square: y = ax² + bx + c ---- */
  function csSol(a, b, c, v) {
    var p = -b / (2 * a), q = c - b * b / (4 * a), h = b / (2 * a), hh = h * h, cs = (same(c, 0) ? '' : (c < 0 ? '-' : '+') + cT(c, true));
    var inner = v + '^{2}' + (b / a < 0 ? '-' : '+') + (same(Math.abs(b / a), 1) ? '' : cT(b / a, true)) + v;
    var A = same(a, 1) ? '' : same(a, -1) ? '-' : (a < 0 ? '-' : '') + cT(a, true);
    var l1 = same(a, 1) ? 'y=(' + inner + '+' + rT(hh) + ')-' + rT(hh) + cs : 'y=' + A + '\\left(' + inner + '+' + rT(hh) + '-' + rT(hh) + '\\right)' + cs;
    return t(l1) + '<br>' + t('y=' + vfTex(a, p, q, v, true)) + '<br>Vertex ' + t('\\left(' + rT(p) + ',\\ ' + rT(q) + '\\right)') + '; ' + (a < 0 ? 'maximum' : 'minimum') + ' value ' + t(rT(q)) + '.';
  }
  function vertexFields(a, p, q, o) {
    o = o || {};
    var mm = a < 0 ? 'max' : 'min';
    var pc = [[-p, 'u5l10-sign-b', 'Check the sign: ' + t('x=-\\frac{b}{2a}') + '.'], [q, 'u5l10-swap', 'That is the second coordinate.']], qc = [[p, 'u5l10-xval', 'That is the first coordinate of the vertex. Substitute it to find the second.']].concat(o.qc || []);
    return [{ label: 'Vertex: ' + t('x='), ans: p, math: true, cands: pc }, { label: t('y='), ans: q, math: true, cands: qc }, { label: 'The vertex is a', maxmin: mm, after: 'point' }];
  }
  function csPart(prompt, a, b, c, o) {
    o = o || {};
    var p = -b / (2 * a), q = c - b * b / (4 * a), f = function (x) { return a * x * x + b * x + c; };
    var specs = [{ label: 'Vertex form: ' + t('y='), expr: { fn: f, v: 'x', vertex: { a: a, p: p, q: q, c: c } }, key: vfTex(a, p, q, 'x', true) }].concat(vertexFields(a, p, q, { qc: [[c, 'u5l10-y-int', t(nT(c)) + ' is the ' + t('y') + '-intercept, not the vertex.']] }));
    return fieldsPart(prompt + ' ' + t('y=' + polyTex([a, b, c], 'x', true)), specs, { sol: csSol(a, b, c, 'x'), hints: ['Factor ' + (same(a, 1) ? '' : t(rT(a)) + ' out of the first two terms, ') + 'add and subtract the square of half the coefficient of ' + t('x') + ' inside the bracket.', HV[1]], text: o.text || 'complete the square: vertex and max/min' });
  }
  /* ---- vertex by −b/(2a), the zeros, or the vertex formula ---- */
  function vPart(prompt, fnTex, a, b, c, how, o) {
    o = o || {};
    var p = -b / (2 * a), q = c - b * b / (4 * a), sol;
    if (how === 'b2a') sol = t('x=-\\frac{' + nT(b) + '}{2(' + nT(a) + ')}=' + rT(p)) + '; ' + t('y=' + nT(cl(a * p * p)) + (b * p < 0 ? '' : '+') + nT(cl(b * p)) + (c < 0 ? '' : '+') + nT(c) + '=' + rT(q));
    else if (how === 'zeros') sol = 'Zeros ' + t(rT(o.r) + '') + ' and ' + t(rT(o.s)) + ': axis ' + t('x=\\frac{' + rT(o.r) + '+' + (o.s < 0 ? '(' + rT(o.s) + ')' : rT(o.s)) + '}{2}=' + rT(p)) + '; ' + t('y=' + (o.y || rT(q)));
    else sol = t('x=-\\frac{b}{2a}=' + rT(p)) + '; ' + t('y=\\frac{4ac-b^{2}}{4a}=\\frac{4(' + nT(a) + ')(' + nT(c) + ')-' + (b < 0 ? '(' + nT(b) + ')' : nT(b)) + '^{2}}{' + nT(4 * a) + '}=' + rT(q));
    sol += '<br>Vertex ' + t('\\left(' + rT(p) + ',\\ ' + rT(q) + '\\right)') + '; ' + (a < 0 ? 'maximum' : 'minimum') + ' value ' + t(rT(q)) + '.';
    return fieldsPart(prompt + ' ' + t(fnTex), vertexFields(a, p, q, { qc: [[c, 'u5l10-y-int', t(nT(c)) + ' is the ' + t('y') + '-intercept.']] }), { sol: sol, hints: HV, text: o.text || 'vertex algebraically' });
  }
  function genCS(r, kind, ex1) {
    return pickWhere(function () {
      if (kind === 'a1') { var p = r.int(-9, 9), q = r.int(-12, 12); return { a: 1, b: -2 * p, c: p * p + q }; }
      if (kind === 'aint') { var a = -r.int(2, 5), p2 = r.int(-5, 5), q2 = r.int(-20, 30); return { a: a, b: -2 * a * p2, c: a * p2 * p2 + q2 }; }
      if (kind === 'frac') { var a3 = r.pick([2, 3, 4]) * (r.chance(0.3) ? -1 : 1), b3 = r.pick([-9, -7, -5, -3, -1, 1, 3, 5, 7, 9, -6, 6, 4, -4, 2, -2, 10, -10]); return { a: a3, b: b3, c: r.int(-6, 6) }; }
      var a4 = r.pick([-0.5, 0.5, -0.25, 0.25]), p4 = r.int(-6, 6), q4 = r.int(-8, 10); return { a: a4, b: -2 * a4 * p4, c: cl(a4 * p4 * p4 + q4) };
    }, function (z) { var p = -z.b / (2 * z.a); if (z.b === 0 || (ex1 && ex1(z))) return false; if (kind === 'frac') return !Number.isInteger(cl(p)) && Number.isInteger(z.c); if (kind === 'half') return Number.isInteger(z.c) && Number.isInteger(cl(z.b)) && z.c !== 0; return z.c !== 0; });
  }
  function revGen(r, dir, cfg, exc) {
    return pickWhere(function () {
      var P = r.pick(cfg.P), s = r.pick(cfg.s), m = r.pick(cfg.m), x = r.int(cfg.x[0], cfg.x[1]);
      var N = dir > 0 ? m * (2 * x + P / s) : m * (P / s - 2 * x);
      return { P: P, s: s, m: m, x: x, N: cl(N), dir: dir };
    }, function (z) { return Number.isInteger(z.N) && z.N >= cfg.N[0] && z.N <= cfg.N[1] && (z.dir > 0 || z.P - z.s * z.x > 0) && !(exc && exc(z)); });
  }
  function revFns(o) { return { price: function (x) { return o.P + o.dir * o.s * x; }, num: function (x) { return o.N - o.dir * o.m * x; } }; }
  function revTex(o) { return '(' + nT(o.P) + (o.dir > 0 ? '+' : '-') + nT(o.s) + 'x)(' + nT(o.N) + (o.dir > 0 ? '-' : '+') + nT(o.m) + 'x)'; }
  function revSol(o, word) {
    var z1 = -o.dir * o.P / o.s, z2 = o.dir * o.N / o.m, pr = cl(o.P + o.dir * o.s * o.x), n = o.N - o.dir * o.m * o.x;
    return t('R(x)=' + revTex(o)) + '<br>Zeros: ' + t(nT(o.P) + (o.dir > 0 ? '+' : '-') + nT(o.s) + 'x=0\\Rightarrow x=' + nT(z1)) + '; ' + t(nT(o.N) + (o.dir > 0 ? '-' : '+') + nT(o.m) + 'x=0\\Rightarrow x=' + nT(z2)) + '. Axis ' + t('x=\\frac{' + nT(z1) + '+' + (z2 < 0 ? '(' + nT(z2) + ')' : nT(z2)) + '}{2}=' + o.x) + '.<br>Price ' + t(nT(o.P) + (o.dir > 0 ? '+' : '-') + nT(cl(o.s * o.x)) + '=' + money(pr)) + '; ' + t(nT(n)) + ' ' + word + '; ' + t('R=' + nT(pr) + '(' + nT(n) + ')=' + money(pr * n)) + ' (now ' + t(money(o.P * o.N)) + ').';
  }
  function revFields(prompt, o, word, extra) {
    var pr = cl(o.P + o.dir * o.s * o.x), n = o.N - o.dir * o.m * o.x;
    return fieldsPart(prompt, [
      { label: 'Price', before: t('\\$'), ans: pr, cands: [[o.x, 'u5l10-steps', t('x=' + o.x) + ' is the number of price changes. Turn it into a price.'], [cl(o.P - o.dir * o.s * o.x), 'u5l10-dir', 'Check the direction of the price change.'], [cl(o.P + o.dir * o.s * (o.dir > 0 ? o.N / o.m : o.P / o.s)), 'u5l10-zero', 'That uses a zero of ' + t('R(x)') + '. The maximum is midway between the zeros.']] },
      { label: cap(word), ans: n, cands: [[o.N + o.dir * o.m * o.x, 'u5l10-dir', 'Check the direction of the change in sales.']] },
      { label: 'Revenue', before: t('\\$'), ans: cl(pr * n), cands: [[o.P * o.N, 'u5l10-steps', 'That is the current revenue.']] }],
      { sol: revSol(o, word), hints: ['Write ' + t('R(x)=(\\text{price})(\\text{number sold})') + '. Each factor gives a zero; the maximum is midway between them.'], text: extra || 'revenue: maximum' });
  }

  var QUESTIONS = [
    { num: '1', stem: 'Complete the square. State the vertex and whether it is a maximum or a minimum (the maximum or minimum value is its second coordinate).', parts: [
      { id: '1a', level: 'BEG', make: function (r) { var o = genCS(r, 'a1', function (z) { return (z.b === -10 && z.c === 31) || (z.b === 8 && z.c === 5); }); return csPart('(a)', o.a, o.b, o.c, { text: 'complete the square: a = 1' }); } },
      { id: '1b', level: 'EMG', make: function (r) { var o = genCS(r, 'aint', function (z) { return (z.a === -3 && z.b === 18) || (z.a === -4 && z.b === 24) || (z.a === -5 && z.b === 30); }); return csPart('(b)', o.a, o.b, o.c, { text: 'complete the square: integer a' }); } },
      { id: '1c', level: 'PRG', make: function (r) { var o = genCS(r, 'frac', function (z) { return (z.a === 2 && z.b === 6 && z.c === 1) || (z.a === 3 && z.b === -9 && z.c === 2); }); return csPart('(c)', o.a, o.b, o.c, { text: 'complete the square: fractions' }); } },
      { id: '1d', level: 'PRG', make: function (r) { var o = genCS(r, 'half', function (z) { return z.a === -0.5 && z.b === 4 && z.c === -3; }); return csPart('(d)', o.a, o.b, o.c, { text: 'complete the square: fractional a' }); } }] },

    { num: '2', stem: 'Determine the vertex using ' + t('x=-\\frac{b}{2a}') + ', the zeros or the vertex formula. State whether it is a maximum or a minimum.', parts: [
      { id: '2a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { var a = r.pick([-0.5, -0.25, 0.5, 0.25, -1.5, 1.5, -0.2, 0.2]), p = r.int(-8, 8), c = r.int(-9, 9); return { a: a, p: p, b: cl(-2 * a * p), c: c }; }, function (z) { return z.p !== 0 && !(z.a === -0.5 && z.p === 6 && z.c === 3) && !(z.a === -0.25 && z.p === 6 && z.c === -1) && Number.isInteger(cl(z.b * 10)); });
        return vPart('(a)', 'y=' + polyTex([o.a, o.b, o.c], 'x'), o.a, o.b, o.c, 'b2a', { text: 'vertex: −b/2a with decimals' });
      } },
      { id: '2b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var a = r.pick([-3, -2, 2, 3, -1, 4]), rr = r.int(-10, 8), s = rr + 2 * r.int(1, 8); return { a: a, r: rr, s: s }; }, function (z) { return !(z.a === -2 && z.r === -10 && z.s === 4) && z.r !== 0 && z.s !== 0; });
        var p = (o.r + o.s) / 2, b = -o.a * (o.r + o.s), c = o.a * o.r * o.s, q = o.a * (p - o.r) * (p - o.s);
        var fT = 'y=' + (o.a === -1 ? '-' : o.a === 1 ? '' : o.a) + '(' + binTex('x', o.r) + ')(' + binTex('x', o.s) + ')';
        return vPart('(b)', fT, o.a, b, c, 'zeros', { r: o.r, s: o.s, y: nT(o.a) + '(' + nT(p - o.r) + ')(' + nT(p - o.s) + ')=' + nT(q), text: 'vertex: from the zeros' });
      } },
      { id: '2c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3, 4, 5, -2, -3, -4, -5]), b: r.int(-9, 9), c: r.int(-6, 6) }; }, function (z) { return z.b !== 0 && !Number.isInteger(-z.b / (2 * z.a)) && !(z.a === 4 && z.b === -3 && z.c === 2) && !(z.a === -5 && z.b === 2 && z.c === 1); });
        return vPart('(c)', 'f(x)=' + polyTex([o.a, o.b, o.c], 'x'), o.a, o.b, o.c, 'formula', { text: 'vertex: vertex formula with fractions' });
      } },
      { id: '2d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3, 4, 5, -2, -3, -4]), b: r.int(-9, 9) }; }, function (z) { return z.b !== 0 && !(z.a === 3 && z.b === 7) && !Number.isInteger(z.b / z.a); });
        var z2 = -o.b / o.a, p = z2 / 2, q = -o.b * o.b / (4 * o.a);
        return vPart('(d)', 'y=' + polyTex([o.a, o.b, 0], 'x'), o.a, o.b, 0, 'zeros', { r: 0, s: z2, y: rT(q), text: 'vertex: from the zeros of ax² + bx' });
      } }] },

    { num: '3', shared: function (r) { return pickWhere(function () { var tv = r.int(11, 29) / 10, c = r.int(2, 15) / 10; return { tv: tv, c: c, b: cl(10 * tv), H: cl(5 * tv * tv + c), what: r.pick(['soccer ball is kicked', 'volleyball is bumped', 'football is kicked']) }; }, function (z) { return !(z.tv === 1.8 && z.c === 0.4) && Math.round(z.tv * 10) % 10 !== 0 && !(z.tv === 3 && z.c === 2); }); },
      stem: function (o) { return 'A ' + o.what + '. Its height in metres after ' + t('t') + ' seconds is ' + t('h(t)=' + polyTex([-5, o.b, o.c], 't')) + '.'; },
      parts: [
        { id: '3a', level: 'PRG', make: function (r, o) {
          var f = function (x) { return -5 * x * x + o.b * x + o.c; }, s = cl(o.tv * o.tv);
          return exprPart('Complete the square to write ' + t('h(t)') + ' in vertex form.', f, vfTex(-5, o.tv, o.H, 't'), { v: 't', before: t('h(t)='), vertex: { a: -5, p: o.tv, q: o.H, c: o.c },
            sol: t('h(t)=-5(t^{2}-' + nT(2 * o.tv) + 't+' + nT(s) + '-' + nT(s) + ')+' + nT(o.c)) + '<br>' + t('=-5(t-' + nT(o.tv) + ')^{2}+' + nT(cl(5 * s)) + '+' + nT(o.c) + '=' + vfTex(-5, o.tv, o.H, 't')), hints: ['Factor ' + t('-5') + ' out of the first two terms: ' + t('-5(t^{2}-' + nT(2 * o.tv) + 't)') + '. Half of ' + nT(2 * o.tv) + ' is ' + nT(o.tv) + '.'], text: 'ball: vertex form' });
        } },
        { id: '3b', level: 'BEG', make: function (r, o) { var v = cl(-5 + o.b + o.c); return numPart('How high is the ball after ' + t('1') + ' s?', v, { after: 'm', unit: 'm', cands: [[o.H, 'u5l10-time-value', 'That is the maximum height. Substitute ' + t('t=1') + '.']], sol: t('h(1)=-5(' + nT(cl((1 - o.tv) * (1 - o.tv))) + ')+' + nT(o.H) + '=' + nT(v)) + ' m', hints: ['Substitute ' + t('t=1') + ' into either form.'], text: 'ball: height at 1 s' }); } },
        { id: '3c', level: 'EMG', make: function (r, o) { return fieldsPart('State the maximum height and when it is reached.', [{ label: 'Maximum height', ans: o.H, after: 'm', cands: [[o.tv, 'u5l10-time-value', 'That is the time. The height is ' + t('q') + '.']] }, { label: 'Time', ans: o.tv, after: 's', cands: [[o.H, 'u5l10-time-value', 'That is the height. The time is ' + t('p') + '.'], [-o.tv, 'sign', 'In ' + t('(t-' + nT(o.tv) + ')^{2}') + ', the vertex is at ' + t('t=+' + nT(o.tv)) + '.']] }], { sol: 'Vertex ' + t('(' + nT(o.tv) + ',\\ ' + nT(o.H) + ')') + ', ' + t('a<0') + ': ' + t(nT(o.H)) + ' m after ' + t(nT(o.tv)) + ' s.', hints: HV, text: 'ball: maximum' }); } },
        { id: '3d', level: 'EMG', make: function (r, o) { var cm = cl(o.c * 100); return numPart('How high, in centimetres, was the ball at the start?', cm, { after: 'cm', unit: 'cm', cands: [[o.c, 'u5l10-units', 'That is in metres. 1 m = 100 cm.'], [o.H * 100, 'u5l10-time-value', 'That is the maximum height. Find ' + t('h(0)') + '.']], sol: t('h(0)=' + nT(o.c)) + ' m ' + t('=' + nT(cm)) + ' cm', hints: ['Find ' + t('h(0)') + ', then change metres to centimetres.'], text: 'ball: start height in cm' }); } },
        { id: '3e', level: 'PRG', outcome: 'RF5', make: function (r, o) {
          var T = o.tv + Math.sqrt(o.H / 5);
          return apxPart('When does the ball land? Answer to the nearest tenth of a second.', T, 1, { after: 's', unit: 's', outcome: 'RF5', cands: [[2 * o.tv, 'u5l10-half', 'That would be right only if the ball started at ground level. Solve ' + t('h(t)=0') + '.'], [o.tv - Math.sqrt(o.H / 5), 'sign', 'That root is negative: before the kick. Use the other one.']],
            sol: t('-5(t-' + nT(o.tv) + ')^{2}+' + nT(o.H) + '=0\\Rightarrow (t-' + nT(o.tv) + ')^{2}=\\frac{' + nT(o.H) + '}{5}=' + nT(cl(o.H / 5))) + ', so ' + t('t=' + nT(o.tv) + '+\\sqrt{' + nT(cl(o.H / 5)) + '}\\approx ' + fx(T, 1)) + ' s (the other root is negative).', hints: ['Set the vertex form equal to 0 and solve: isolate the square, then take square roots.'], text: 'ball: landing time' });
        } }] },

    { num: '4', parts: [
      { id: '4a', level: 'EMG', make: function (r) {
        var S = pickWhere(function () { return r.int(10, 40); }, function (x) { return x !== 16 && x !== 30; }), h = S / 2, m = S * S / 2;
        return fieldsPart('Two numbers have a sum of ' + t(S) + '. Determine the numbers for which the sum of their squares is a minimum, and that minimum.', [{ label: 'First number', ans: h }, { label: 'Second number', ans: h }, { label: 'Minimum', ans: m, cands: [[h * h, 'u5l10-half', 'Add the squares of <b>both</b> numbers.'], [S * S, 'u5l10-half', 'Square each number, then add.']] }],
          { sol: t('S(x)=x^{2}+(' + S + '-x)^{2}=2x^{2}-' + 2 * S + 'x+' + S * S) + '<br>' + t('x=\\frac{' + 2 * S + '}{4}=' + nT(h)) + '; the other is ' + t(nT(h)) + '. ' + t('S=' + nT(h * h) + '+' + nT(h * h) + '=' + nT(m)) + '.', hints: ['Let one number be ' + t('x') + '; the other is ' + t(S + '-x') + '. Write the sum of squares and find its vertex.'], text: 'numbers: minimum sum of squares' });
      } },
      { id: '4b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var k = r.pick([2, 3, 4]); return { k: k, S: 2 * k * r.int(1, 6) }; }, function (z) { return !(z.k === 2 && z.S === 20) && z.S >= 8; });
        var y = o.S / (2 * o.k), x = o.S / 2, P = x * y, kw = { 2: 'twice', 3: 'three times', 4: 'four times' }[o.k];
        return fieldsPart('The sum of a number and ' + kw + ' a second number is ' + t(o.S) + '. Determine the numbers whose product is a maximum, and that product.', [{ label: 'First number', ans: x, cands: [[y, 'u5l10-swap', 'That is the second number.']] }, { label: 'Second number', ans: y, cands: [[x, 'u5l10-swap', 'That is the first number.']] }, { label: 'Maximum product', ans: P }],
          { sol: 'Let the second number be ' + t('y') + '; the first is ' + t(o.S + '-' + o.k + 'y') + '.<br>' + t('P(y)=y(' + o.S + '-' + o.k + 'y)') + ': zeros ' + t('0') + ' and ' + t(nT(o.S / o.k)) + ', axis ' + t('y=' + nT(y)) + '.<br>The numbers are ' + t(nT(x)) + ' and ' + t(nT(y)) + '; the maximum product is ' + t(nT(P)) + '.', hints: ['Let the second number be ' + t('y') + ' and write the first in terms of ' + t('y') + '.'], text: 'numbers: maximum product' });
      } }] },

    { num: '5', parts: [
      { id: '5', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var n = r.pick([2, 3, 4]); return { n: n, F: 20 * r.int(3, 20) }; }, function (z) { return !(z.n === 3 && z.F === 160) && z.F % (2 * (z.n + 1)) === 0 && z.F % 4 === 0; });
        var w = o.F / (2 * (o.n + 1)), L = o.F / 4, A = w * L, W = 230, H = 110, xs = '';
        for (var i = 1; i < o.n; i++) xs += '<line x1="' + (30 + i * 180 / o.n) + '" y1="20" x2="' + (30 + i * 180 / o.n) + '" y2="80" stroke="#2b3340" stroke-width="2"/>';
        var fig = svgWrap(W, H, '<rect x="30" y="20" width="180" height="60" fill="none" stroke="#2b3340" stroke-width="2"/>' + xs + txt(20, 54, 'w', 'middle', true) + txt(120, 100, 'length'), 'field divided into pens');
        return fieldsPart('A rectangular field is divided into ' + o.n + ' pens by ' + (o.n - 1) + ' fence' + (o.n > 2 ? 's' : '') + ' parallel to its width, as shown. A total of ' + t(o.F) + ' m of fencing is used. Let ' + t('w') + ' be the width. Determine the dimensions that give the greatest total area, and that area.' + fig,
          [{ label: 'Width', ans: w, after: 'm', cands: [[o.F / 8, 'u5l10-fence', 'Count every fence parallel to the width: the two ends and ' + (o.n - 1) + ' divider' + (o.n > 2 ? 's' : '') + ' make ' + (o.n + 1) + ' widths.']] }, { label: 'Length', ans: L, after: 'm' }, { label: 'Greatest area', ans: A, after: t('\\text{m}^2'), cands: [[o.F * o.F / 16, 'u5l10-fence', 'Count the fencing: ' + t((o.n + 1) + 'w+2L=' + o.F) + '.']] }],
          { sol: (o.n + 1) + ' widths and two lengths: ' + t((o.n + 1) + 'w+2L=' + o.F) + ', so ' + t('L=' + nT(o.F / 2) + '-' + rT((o.n + 1) / 2) + 'w') + '.<br>' + t('A(w)=w\\left(' + nT(o.F / 2) + '-' + rT((o.n + 1) / 2) + 'w\\right)') + ': zeros ' + t('0') + ' and ' + t(rT(o.F / (o.n + 1))) + ', axis ' + t('w=' + nT(w)) + '.<br>' + t('w=' + nT(w)) + ' m, ' + t('L=' + nT(L)) + ' m; greatest area ' + t(nT(A) + '\\text{ m}^2') + '.', hints: ['Write the total fencing in terms of ' + t('w') + ' and the length, solve for the length, then write the area.'], text: 'pens: greatest area' });
      } }] },

    { num: '6', shared: function (r) { return pickWhere(function () { return { c1: r.pick([10, 12, 15, 20]), c2: r.pick([4, 5, 6, 8, 10]), k: r.int(1, 8), what: r.pick(['storage yard', 'garden', 'patio']) }; }, function (z) { var l = 4 * z.c2 * z.c1 / M.gcd(4 * z.c2, 2 * z.c1), B = l * z.k; z.B = B; return z.c2 < z.c1 && B >= 400 && B <= 3000 && !(z.c1 === 12 && z.c2 === 8 && B === 960); }); },
      stem: function (o) { return 'A rectangular ' + o.what + ' is built against a wall, so only three sides need fencing. The side parallel to the wall uses fencing that costs ' + t('\\$' + o.c1) + ' per metre; the two ends cost ' + t('\\$' + o.c2) + ' per metre. The budget is ' + t(money(o.B)) + '.'; },
      parts: [
        { id: '6a', level: 'EMG', make: function (r, o) {
          var L = function (x) { return o.B / o.c1 - 2 * o.c2 / o.c1 * x; }, key = rT(o.B / o.c1) + '-' + (same(2 * o.c2 / o.c1, 1) ? '' : rT(2 * o.c2 / o.c1)) + 'x';
          return exprPart('Let each end be ' + t('x') + ' metres. Write the length of the side parallel to the wall in terms of ' + t('x') + '.', L, key, { before: t('L='),
            cands: [[function (x) { return o.B / o.c1 - o.c2 / o.c1 * x; }, 'u5l10-one-end', 'There are <b>two</b> ends, each costing ' + t('\\$' + o.c2 + 'x') + '.'], [function (x) { return o.B / o.c2 - 2 * o.c1 / o.c2 * x; }, 'u5l10-fence', 'The parallel side costs ' + t('\\$' + o.c1) + ' per metre and the ends ' + t('\\$' + o.c2) + '.'], [function (x) { return o.B - 2 * x; }, 'u5l10-fence', 'This is a cost budget, not a length of fencing: ' + t(o.c2 + '(2x)+' + o.c1 + 'L=' + o.B) + '.']],
            sol: 'Cost: ' + t(o.c2 + '(2x)+' + o.c1 + 'L=' + o.B + '\\Rightarrow ' + o.c1 + 'L=' + o.B + '-' + 2 * o.c2 + 'x\\Rightarrow L=' + key) + '.', hints: ['Write the total cost: (cost per metre)(length) for each side, set it equal to the budget, and solve for ' + t('L') + '.'], text: 'yard: side in terms of x' });
        } },
        { id: '6b', level: 'ADV', make: function (r, o) {
          var x = o.B / (4 * o.c2), L = o.B / (2 * o.c1), A = x * L;
          return fieldsPart('Determine the dimensions that give the largest ' + o.what + ', and its area.', [{ label: 'Each end', ans: x, after: 'm', cands: [[L, 'u5l10-swap', 'That is the side parallel to the wall.']] }, { label: 'Side parallel to the wall', ans: L, after: 'm', cands: [[x, 'u5l10-swap', 'That is each end.']] }, { label: 'Area', ans: A, after: t('\\text{m}^2') }],
            { sol: t('A(x)=x\\left(' + rT(o.B / o.c1) + '-' + rT(2 * o.c2 / o.c1) + 'x\\right)') + ': zeros ' + t('0') + ' and ' + t(rT(o.B / (2 * o.c2))) + ', axis ' + t('x=' + nT(x)) + '.<br>' + t('L=' + rT(o.B / o.c1) + '-' + rT(2 * o.c2 / o.c1) + '(' + nT(x) + ')=' + nT(L)) + '. The ' + o.what + ' is ' + t(nT(x)) + ' m by ' + t(nT(L)) + ' m, with area ' + t(nT(A) + '\\text{ m}^2') + '.', hints: ['Area = (end)(parallel side). The maximum is midway between the zeros.'], text: 'yard: largest area for a budget' });
        } }] },

    { num: '7', shared: function (r) { return pickWhere(function () { return { b: 2 * r.int(3, 10), h: 3 * r.int(2, 8) }; }, function (z) { return !(z.b === 10 && z.h === 15) && z.b !== z.h; }); },
      stem: function (o) {
        var s = 8.4, W = 220, H = 160, sc = Math.min(180 / o.b, 130 / o.h), bx = 110 - o.b * sc / 2, by = 145, top = by - o.h * sc, rw = o.b * sc / 2, rh = o.h * sc / 2;
        var fig = svgWrap(W, H + 6, '<polygon points="' + bx + ',' + by + ' ' + (bx + o.b * sc) + ',' + by + ' 110,' + top + '" fill="none" stroke="#2b3340" stroke-width="2"/>' +
          '<rect x="' + (110 - rw / 2) + '" y="' + (by - rh) + '" width="' + rw + '" height="' + rh + '" fill="#e8e4da" stroke="#2b3340" stroke-width="1.5"/>' + '<line x1="110" y1="' + by + '" x2="110" y2="' + top + '" stroke="#6a7182" stroke-dasharray="4 3"/>' +
          txt(110, by + 15, String(o.b)) + txt(116 + rw / 2 + 4, by - rh / 2 + 4, 'y', 'start', true) + txt(116, top + 30, String(o.h), 'start'), 'rectangle inside a triangle');
        return 'A rectangle is drawn inside an isosceles triangle with base ' + t(o.b) + ' cm and height ' + t(o.h) + ' cm. The bottom of the rectangle lies on the base and its top corners touch the other two sides.' + fig;
      },
      parts: [
        { id: '7a', level: 'PRG', make: function (r, o) {
          var f = function (y) { return o.b - o.b / o.h * y; }, k = o.b / o.h, key = nT(o.b) + '-' + (same(k, 1) ? '' : rT(k)) + 'y';
          return exprPart('Let the height of the rectangle be ' + t('y') + '. Use similar triangles to write its width in terms of ' + t('y') + '.', f, key, { v: 'y', before: t('w='),
            cands: [[function (y) { return o.b - o.h / o.b * y; }, 'u5l10-similar', 'Match the ratios: ' + t('\\frac{w}{' + o.b + '}=\\frac{' + o.h + '-y}{' + o.h + '}') + ' (width to base, height to height).'], [function (y) { return o.b / o.h * y; }, 'u5l10-similar', 'The triangle above the rectangle has height ' + t(o.h + '-y') + ', not ' + t('y') + '.']],
            sol: 'The triangle above the rectangle has height ' + t(o.h + '-y') + ' and base ' + t('w') + ', similar to the whole: ' + t('\\frac{w}{' + o.b + '}=\\frac{' + o.h + '-y}{' + o.h + '}') + ', so ' + t('w=' + key) + '.', hints: ['The small triangle on top of the rectangle is similar to the whole triangle.'], text: 'triangle: width in terms of y' });
        } },
        { id: '7b', level: 'ADV', make: function (r, o) {
          var y = o.h / 2, w = o.b / 2, A = w * y;
          return fieldsPart('Determine the dimensions of the rectangle with the greatest area, and that area.', [{ label: 'Width', ans: w, after: 'cm', cands: [[y, 'u5l10-swap', 'That is the height.']] }, { label: 'Height', ans: y, after: 'cm', cands: [[w, 'u5l10-swap', 'That is the width.']] }, { label: 'Area', ans: A, after: t('\\text{cm}^2'), cands: [[o.b * o.h / 2, 'u5l10-half', 'That is the area of the triangle.']] }],
            { sol: t('A(y)=y\\left(' + nT(o.b) + '-' + rT(o.b / o.h) + 'y\\right)') + ': zeros ' + t('0') + ' and ' + t(o.h) + ', axis ' + t('y=' + nT(y)) + '.<br>Width ' + t(nT(o.b) + '-' + rT(o.b / o.h) + '(' + nT(y) + ')=' + nT(w)) + ' cm, height ' + t(nT(y)) + ' cm, area ' + t(nT(A) + '\\text{ cm}^2') + '.', hints: ['Area = (width)(height) = ' + t('y\\,w(y)') + '. The maximum is midway between the zeros.'], text: 'triangle: greatest rectangle' });
        } }] },

    { num: '8', shared: function (r) { var o = revGen(r, 1, { P: [20, 25, 30, 35, 40, 45, 50], s: [1, 2, 5], m: [5, 10, 15, 20, 25], x: [2, 10], N: [200, 1500] }, function (z) { return z.P === 40 && z.s === 2 && z.m === 20; }); o.what = r.pick([['school', 'yearbooks'], ['theatre', 'tickets'], ['club', 'calendars']]); return o; },
      stem: function (o) { return 'A ' + o.what[0] + ' sells ' + t(nT(o.N)) + ' ' + o.what[1] + ' at ' + t(money(o.P)) + ' each. For every ' + t(money(o.s)) + ' increase in price, ' + t(o.m) + ' fewer ' + o.what[1] + ' would sell. Let ' + t('x') + ' be the number of ' + t(money(o.s)) + ' increases.'; },
      parts: [
        { id: '8a', level: 'EMG', make: function (r, o) { var f = revFns(o); return exprPart('Write the revenue function.', function (x) { return f.price(x) * f.num(x); }, revTex(o), { before: t('R(x)='), cands: [[function (x) { return (o.P - o.s * x) * f.num(x); }, 'u5l10-dir', 'The price goes <b>up</b>.'], [function (x) { return f.price(x) * (o.N + o.m * x); }, 'u5l10-dir', 'Sales go <b>down</b>.']], sol: 'Price ' + t(nT(o.P) + '+' + nT(o.s) + 'x') + '; number sold ' + t(nT(o.N) + '-' + o.m + 'x') + '. ' + t('R(x)=' + revTex(o)), hints: ['Revenue = (price)(number sold).'], text: 'revenue function' }); } },
        { id: '8b', level: 'PRG', make: function (r, o) { return revFields('Determine the price that gives the maximum revenue, the number sold and the revenue.', o, o.what[1], 'revenue: price increases'); } }] },

    { num: '9', parts: [
      { id: '9', level: 'PRG', make: function (r) {
        var o = revGen(r, -1, { P: [60, 70, 75, 80, 90, 100, 120], s: [2, 3, 5], m: [50, 100, 150, 200], x: [2, 8], N: [500, 4000] }, function (z) { return z.P === 90 && z.s === 3 && z.m === 100; }), what = r.pick([['ski hill', 'day passes', 'skiers'], ['water park', 'day passes', 'visitors'], ['zoo', 'tickets', 'visitors']]);
        return revFields('A ' + what[0] + ' sells ' + t(nT(o.N)) + ' ' + what[1] + ' a day at ' + t(money(o.P)) + ' each. Research shows that each ' + t(money(o.s)) + ' decrease in price brings ' + t(o.m) + ' more ' + what[2] + '. Determine the price that gives the maximum daily revenue, the number of ' + what[2] + ' and the revenue.', o, what[2], 'revenue: price decreases');
      } }] },

    { num: '10', parts: [
      { id: '10', level: 'ADV', make: function (r) {
        var L = pickWhere(function () { return 8 * r.int(5, 20); }, function (x) { return x !== 80; }), h = L / 2, A = L * L / 32;
        return fieldsPart('A wire ' + t(L) + ' cm long is cut into two pieces. Each piece is bent into a square. Where should the wire be cut so that the total area of the two squares is as small as possible? What is that area?', [{ label: 'One piece', ans: h, after: 'cm' }, { label: 'Other piece', ans: h, after: 'cm' }, { label: 'Total area', ans: A, after: t('\\text{cm}^2'), cands: [[2 * h * h, 'u5l10-side', 'Each piece is the <b>perimeter</b> of a square: the side is ' + t('\\frac{' + h + '}{4}') + '.'], [A / 2, 'u5l10-half', 'Add the areas of <b>both</b> squares.']] }],
          { sol: 'Pieces ' + t('x') + ' and ' + t(L + '-x') + '; the sides are ' + t('\\frac{x}{4}') + ' and ' + t('\\frac{' + L + '-x}{4}') + '.<br>' + t('A(x)=\\frac{x^{2}}{16}+\\frac{(' + L + '-x)^{2}}{16}=\\frac{1}{16}(2x^{2}-' + 2 * L + 'x+' + nT(L * L) + ')') + '<br>' + t('x=\\frac{' + 2 * L + '}{4}=' + h) + '. Cut it in the middle (two ' + h + ' cm pieces): ' + t('A=' + nT(h * h / 16) + '+' + nT(h * h / 16) + '=' + nT(A) + '\\text{ cm}^2') + '.', hints: ['Let one piece be ' + t('x') + ' cm. Each square’s side is a quarter of its piece.'], text: 'wire cut into two squares' });
      } }] },

    { num: '11', shared: function (r) { return pickWhere(function () { var b = r.int(15, 30), k = r.int(5, 30); return { b: b, k: k, what: r.pick(['stone', 'ball', 'water rocket']) }; }, function (z) { return z.k < z.b * z.b / 20 - 1.5 && !(z.b === 24 && z.k === 20) && !(z.b === 18 && z.k === 12); }); },
      stem: function (o) { return 'A ' + o.what + ' is launched straight up. Its height in metres after ' + t('t') + ' seconds is ' + t('h(t)=' + o.b + 't-5t^{2}') + '.'; },
      parts: [
        { id: '11a', level: 'PRG', outcome: 'RF5', make: function (r, o) {
          var D = o.b * o.b - 20 * o.k, rt = roots(5, -o.b, o.k);
          return fieldsPart('When is it ' + t(o.k) + ' m above the ground? Answer to the nearest tenth of a second.', [{ label: 'Going up', ans: rt[0], dp: 1, after: 's' }, { label: 'Coming down', ans: rt[1], dp: 1, after: 's' }],
            { swap: [0, 1], outcome: 'RF5', sol: t('5t^{2}-' + o.b + 't+' + o.k + '=0') + ': ' + t('t=\\frac{' + o.b + '\\pm\\sqrt{' + o.b * o.b + '-' + 20 * o.k + '}}{10}=\\frac{' + o.b + '\\pm\\sqrt{' + D + '}}{10}') + '<br>' + t('t\\approx ' + fx(rt[0], 1)) + ' s and ' + t('t\\approx ' + fx(rt[1], 1)) + ' s.', hints: ['Set ' + t('h(t)=' + o.k) + ', write the equation in standard form and use the quadratic formula.'], text: 'times at a height (quadratic formula)' });
        } },
        { id: '11b', level: 'EMG', outcome: 'RF5', make: function (r, o) {
          return mcPart(r, 'Why are there two answers?', [
            { html: 'It passes ' + t(o.k) + ' m once on the way up and once on the way down.', right: true },
            { html: 'One of them is extraneous and should be rejected.', why: 'Both times are positive and before it lands: both are real times when the height is ' + o.k + ' m.' },
            { html: 'A quadratic equation always has two solutions.', why: 'Not always: a negative discriminant means none (for example, a height above the maximum is never reached).' }],
            'The ' + o.what + ' passes ' + t(o.k) + ' m once on the way up and once on the way down.', ['Picture the parabola and the line ' + t('h=' + o.k) + '.'], 'why two answers');
        } }] },

    { num: '12', shared: function (r) { return pickWhere(function () { var W = r.int(4, 20), L = W + r.int(2, 12); return { L: L, W: W, P: 2 * (L + W), A: L * W }; }, function (z) { return !(z.L === 17 && z.W === 12); }); },
      stem: function (o) { return 'The perimeter of a rectangular lot is ' + t(o.P) + ' m and its area is ' + t(o.A + '\\text{ m}^2') + '.'; },
      parts: [
        { id: '12a', level: 'PRG', outcome: 'RF5', make: function (r, o) {
          var hs = o.P / 2;
          return fieldsPart('Let the length be ' + t('x') + '. Write a quadratic equation and solve it to find the dimensions.', [{ label: 'Length', ans: o.L, after: 'm' }, { label: 'Width', ans: o.W, after: 'm' }],
            { swap: [0, 1], outcome: 'RF5', sol: 'Width ' + t(hs + '-x') + ': ' + t('x(' + hs + '-x)=' + o.A + '\\Rightarrow x^{2}-' + hs + 'x+' + o.A + '=0') + '<br>' + t('(x-' + o.W + ')(x-' + o.L + ')=0') + '. The lot is ' + t(o.L) + ' m by ' + t(o.W) + ' m.', hints: ['Length + width is half the perimeter. Multiply them to get the area.'], text: 'perimeter and area: dimensions' });
        } },
        { id: '12b', level: 'EMG', make: function (r, o) { var s = o.P / 4, A = s * s; return numPart('What is the greatest area a rectangle with this perimeter can have?', A, { after: 'm²', unitTex: '\\text{ m}^2', cands: [[o.A, 'value', 'That is this lot’s area. Find the vertex of ' + t('A(x)=x(' + o.P / 2 + '-x)') + '.'], [o.P * o.P / 4, 'u5l10-half', 'The axis is midway between the zeros ' + t('0') + ' and ' + t(o.P / 2) + '.']], sol: t('A(x)=x(' + o.P / 2 + '-x)') + ': axis ' + t('x=' + nT(s)) + '; ' + t('A=' + nT(s) + '^{2}=' + nT(A) + '\\text{ m}^2') + ' (a square).', hints: ['Write the area in terms of the length and find the vertex.'], text: 'perimeter: greatest area' }); } }] },

    { num: '13', parts: [
      { id: '13', level: 'MAS', outcome: 'RF5', make: function (r) {
        var o = pickWhere(function () { return { S: r.int(14, 40), d: r.int(10, 32) }; }, function (z) { var D = 2 * z.d * z.d - z.S * z.S; if (D <= 4 || z.d >= z.S || (z.S === 25 && z.d === 19)) return false; var sq = Math.sqrt(D); return Math.abs(sq - Math.round(sq)) > 0.05; });
        var D2 = 2 * o.d * o.d - o.S * o.S, x1 = (o.S - Math.sqrt(D2)) / 2, x2 = (o.S + Math.sqrt(D2)) / 2, C = (o.S * o.S - o.d * o.d) / 2;
        return fieldsPart('A path along two edges of a rectangular park totals ' + t(o.S) + ' m. A diagonal shortcut across the park is ' + t(o.d) + ' m. Determine the lengths of the two edges, to the nearest tenth of a metre.', [{ label: 'Longer edge', ans: x2, dp: 1, after: 'm' }, { label: 'Shorter edge', ans: x1, dp: 1, after: 'm' }],
          { swap: [0, 1], outcome: 'RF5', sol: t('x^{2}+(' + o.S + '-x)^{2}=' + o.d + '^{2}\\Rightarrow 2x^{2}-' + 2 * o.S + 'x+' + o.S * o.S + '=' + o.d * o.d) + '<br>' + t('x^{2}-' + o.S + 'x+' + nT(C) + '=0') + ': ' + t('x=\\frac{' + o.S + '\\pm\\sqrt{' + o.S * o.S + '-' + nT(4 * C) + '}}{2}=\\frac{' + o.S + '\\pm\\sqrt{' + D2 + '}}{2}') + '<br>' + t('x\\approx ' + fx(x2, 1)) + ' or ' + t('x\\approx ' + fx(x1, 1)) + '. The edges are ' + t(fx(x2, 1)) + ' m and ' + t(fx(x1, 1)) + ' m.', hints: ['Let one edge be ' + t('x') + '; the other is ' + t(o.S + '-x') + '. The diagonal is the hypotenuse: use the Pythagorean theorem.'], text: 'Pythagorean: edges of a park' });
      } }] },

    { num: '14', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var P = pickWhere(function () { return 4 * r.int(5, 20); }, function (x) { return x !== 36; }), s = P / 4, h = P / 2;
        return mcPart(r, 'The greatest possible area of a rectangle with a perimeter of ' + t(P) + ' cm is', [
          { html: t(nT(s * s) + '\\text{ cm}^2'), right: true }, { html: t(nT(h * h) + '\\text{ cm}^2'), why: 'That squares the half-perimeter ' + h + '. The sides add to ' + h + ', so the best is ' + s + ' by ' + s + '.' },
          { html: t(nT((s + 1) * (s - 1)) + '\\text{ cm}^2'), why: 'That is a ' + (s + 1) + ' by ' + (s - 1) + ' rectangle: close, but not the maximum.' }, { html: t(nT(s * h) + '\\text{ cm}^2'), why: 'The sides must add to ' + h + ' (half the perimeter).' }],
          t('A(x)=x(' + h + '-x)') + ', axis ' + t('x=' + s) + ', ' + t('A=' + s + '\\times ' + s + '=' + nT(s * s)) + '.', ['Length + width = half the perimeter.'], 'MC: greatest area for a perimeter');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 7), c: r.int(1, 9) }; }, function (z) { return !(z.p === 4 && z.c === 3) && !(z.p === 3 && z.c === 2); }), b = 10 * o.p, H = 5 * o.p * o.p + o.c;
        return mcPart(r, 'A ball’s height in metres is ' + t('h(t)=' + polyTex([-5, b, o.c], 't')) + '. The maximum height is reached after', [
          { html: t(o.p) + ' s', right: true }, { html: t(2 * o.p) + ' s', why: 'That is the positive zero of ' + t('-5t^{2}+' + b + 't') + '. Use ' + t('t=-\\frac{b}{2a}') + '.' },
          { html: t(-o.p) + ' s', why: 'Keep the sign of ' + t('a=-5') + ': ' + t('-\\frac{' + b + '}{2(-5)}=' + o.p) + '.' }, { html: t(H) + ' s', why: 'That is the maximum height, ' + H + ' m, not the time.' }],
          t('t=-\\frac{' + b + '}{2(-5)}=' + o.p) + ' s.', ['Use ' + t('t=-\\frac{b}{2a}') + '.'], 'MC: time of maximum height');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var P = r.int(10, 40), m = r.pick([5, 10, 20]), x = r.int(2, 10); return { P: P, m: m, x: x, N: m * (2 * x + P) }; }, function (z) { return !(z.P === 20 && z.m === 10 && z.x === 5) && z.N <= 1500; });
        var z2 = o.N / o.m, opts = [{ html: t('\\$' + o.x), why: 'That is the number of ' + t('\\$1') + ' increases, not the price.' }, { html: t('\\$' + (o.P + o.x)), right: true }, { html: t('\\$' + z2), why: 'That uses a zero instead of the midpoint between the zeros.' }, { html: t('\\$' + (o.P + z2)), why: 'Add the axis value ' + t(o.x) + ' to the price, not the zero.' }];
        return mcPart(r, 'For the revenue function ' + t('R(x)=(' + o.P + '+x)(' + o.N + '-' + o.m + 'x)') + ', where ' + t('x') + ' is the number of ' + t('\\$1') + ' increases on a ' + t('\\$' + o.P) + ' price, the price that gives the maximum revenue is', opts,
          'Zeros ' + t(-o.P) + ' and ' + t(z2) + ', axis ' + t('x=' + o.x) + ', price ' + t(o.P + '+' + o.x + '=\\$' + (o.P + o.x)) + '.', ['Find the zeros, then the midpoint.'], 'MC: price for maximum revenue', true);
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'EMG', make: function (r) {
        var Fn = pickWhere(function () { return 4 * r.int(10, 70); }, function (x) { return x !== 120 && x * x / 8 <= 9999; }), x = Fn / 4, A = Fn * Fn / 8;
        return numPart('<i>(Numerical Response)</i> A rectangular garden is fenced on three sides with ' + t(Fn) + ' m of fencing; the fourth side is a house wall. The maximum area of the garden, in square metres, is ______.', A, { nr: true, cands: [[Fn * Fn / 16, 'u5l10-fence', 'Only three sides are fenced: ' + t('A(x)=x(' + Fn + '-2x)') + '.']], sol: t('A(x)=x(' + Fn + '-2x)') + ': zeros ' + t('0') + ' and ' + t(Fn / 2) + ', axis ' + t('x=' + x) + '. ' + t('A=' + x + '(' + Fn / 2 + ')=' + nT(A) + '\\text{ m}^2') + '.', hints: ['Let each side perpendicular to the wall be ' + t('x') + '.'], text: 'NR: garden against a wall' });
      } }] },
    { num: '18', parts: [
      { id: '18', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { b: r.int(5, 14), c: r.int(1, 5) / 2 }; }, function (z) { return !(z.b === 8 && z.c === 1.5) && !(z.b === 24); }), tv = o.b / 10, H = 5 * tv * tv + o.c;
        return apxPart('<i>(Numerical Response)</i> A beanbag is tossed upward. Its height in metres after ' + t('t') + ' seconds is ' + t('h(t)=' + polyTex([-5, o.b, o.c], 't')) + '. Its maximum height, in metres to the nearest tenth, is ______.', H, 1, { nr: true, cands: [[tv, 'u5l10-time-value', 'That is the time of the maximum. Substitute it to get the height.']], sol: t('t=-\\frac{' + o.b + '}{2(-5)}=' + nT(tv)) + '; ' + t('h(' + nT(tv) + ')=' + nT(cl(-5 * tv * tv)) + '+' + nT(cl(o.b * tv)) + '+' + nT(o.c) + '=' + nT(cl(H))) + ' m.', hints: ['Find ' + t('t=-\\frac{b}{2a}') + ', then substitute.'], text: 'NR: maximum height' });
      } }] }
  ];

  /* =========================== Extra practice =========================== */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Complete the square. State the vertex and whether it is a maximum or a minimum.', parts: [
      { id: 'eA1a', level: 'BEG', make: function (r) { var o = genCS(r, 'a1', function (z) { return (z.b === 8 && z.c === 5) || (z.b === -10 && z.c === 31); }); return csPart('(a)', o.a, o.b, o.c, { text: 'complete the square: a = 1' }); } },
      { id: 'eA1b', level: 'EMG', make: function (r) { var o = genCS(r, 'aint', function (z) { return (z.a === -4 && z.b === 24) || (z.a === -3 && z.b === 18); }); return csPart('(b)', o.a, o.b, o.c, { text: 'complete the square: integer a' }); } },
      { id: 'eA1c', level: 'PRG', make: function (r) { var o = genCS(r, 'frac', function (z) { return (z.a === 3 && z.b === -9 && z.c === 2) || (z.a === 2 && z.b === 6 && z.c === 1); }); return csPart('(c)', o.a, o.b, o.c, { text: 'complete the square: fractions' }); } }] },
    { num: 'A2', stem: 'Determine the vertex by any algebraic method. State whether it is a maximum or a minimum.', parts: [
      { id: 'eA2a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { var a = r.pick([-0.25, 0.25, -0.5, 0.5, 0.2, -0.2]), p = r.int(-8, 8), c = r.int(-9, 9); return { a: a, p: p, b: cl(-2 * a * p), c: c }; }, function (z) { return z.p !== 0 && !(z.a === -0.25 && z.p === 6 && z.c === -1) && !(z.a === -0.5 && z.p === 6 && z.c === 3) && Number.isInteger(cl(z.b * 10)); });
        return vPart('(a)', 'y=' + polyTex([o.a, o.b, o.c], 'x'), o.a, o.b, o.c, 'b2a', { text: 'vertex: −b/2a with decimals' });
      } },
      { id: 'eA2b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var a = r.pick([0.5, -0.5, 1.5, -1.5]), rr = r.int(-9, 6), s = rr + 2 * r.int(1, 6); return { a: a, r: rr, s: s }; }, function (z) { return !(z.a === 0.5 && z.r === -6 && z.s === 2) && z.r !== 0 && z.s !== 0; });
        var p = (o.r + o.s) / 2, q = o.a * (p - o.r) * (p - o.s);
        return vPart('(b)', 'y=' + nT(o.a) + '(' + binTex('x', o.r) + ')(' + binTex('x', o.s) + ')', o.a, cl(-o.a * (o.r + o.s)), cl(o.a * o.r * o.s), 'zeros', { r: o.r, s: o.s, y: nT(o.a) + '(' + nT(p - o.r) + ')(' + nT(p - o.s) + ')=' + nT(q), text: 'vertex: from the zeros' });
      } },
      { id: 'eA2c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([-5, -4, -3, 3, 4, 5]), b: r.int(-7, 7), c: r.int(-5, 5) }; }, function (z) { return z.b !== 0 && !Number.isInteger(-z.b / (2 * z.a)) && !(z.a === -5 && z.b === 2 && z.c === 1) && !(z.a === 4 && z.b === -3 && z.c === 2); });
        return vPart('(c)', 'y=' + polyTex([o.a, o.b, o.c], 'x'), o.a, o.b, o.c, 'formula', { text: 'vertex: vertex formula' });
      } }] },

    { num: 'B1', section: 'B. Applying', parts: [
      { id: 'eB1', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([1, 2, 3, 4]), S: r.int(10, 30) }; }, function (z) { return !(z.m === 1 && z.S === 22); });
        var y = o.m / 2, x = o.S - y, mn = o.m * x + y * y, w = { 1: 'the first number', 2: 'twice the first number', 3: 'three times the first number', 4: 'four times the first number' }[o.m];
        return fieldsPart('The sum of two numbers is ' + t(o.S) + '. Determine the numbers for which the sum of ' + w + ' and the square of the second is as small as possible, and that minimum.', [{ label: 'First number', ans: x, cands: [[y, 'u5l10-swap', 'That is the second number.']] }, { label: 'Second number', ans: y, cands: [[x, 'u5l10-swap', 'That is the first number.']] }, { label: 'Minimum', ans: mn }],
          { sol: 'Let the second number be ' + t('y') + '; the first is ' + t(o.S + '-y') + '.<br>' + t('S(y)=' + (o.m === 1 ? '' : o.m) + '(' + o.S + '-y)+y^{2}=' + polyTex([1, -o.m, o.m * o.S], 'y')) + '; ' + t('y=\\frac{' + o.m + '}{2}=' + nT(y)) + ', first ' + t('=' + nT(x)) + '.<br>' + t('S=' + nT(o.m * x) + '+' + nT(y * y) + '=' + nT(mn)) + '. The numbers are ' + t(nT(x)) + ' and ' + t(nT(y)) + '; the minimum is ' + t(nT(mn)) + '.', hints: ['Let the second number be ' + t('y') + ' and write the expression to minimize in terms of ' + t('y') + '.'], text: 'numbers: minimum of first + square of second' });
      } }] },
    { num: 'B2', parts: [
      { id: 'eB2', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { F: r.int(30, 90), g: r.pick([1, 2, 3, 4]) }; }, function (z) { return !(z.F === 50 && z.g === 2) && (z.F + z.g) % 4 === 0; });
        var T = o.F + o.g, x = T / 4, L = T / 2, A = x * L;
        return fieldsPart('A rectangular play area is built against a school wall. The other three sides use ' + t(o.F) + ' m of fencing, except for a ' + t(o.g) + ' m wide gate opening on the side parallel to the wall. Let each side perpendicular to the wall be ' + t('x') + ' metres. Determine the dimensions that give the greatest area, and that area.', [{ label: 'Each perpendicular side', ans: x, after: 'm', cands: [[o.F / 4, 'u5l10-fence', 'The gate opening needs no fence: the parallel side is ' + t('L') + ' but uses only ' + t('L-' + o.g) + ' m of fencing.']] }, { label: 'Parallel side', ans: L, after: 'm', cands: [[o.F / 2, 'u5l10-fence', 'The gate adds ' + o.g + ' m to the parallel side.']] }, { label: 'Area', ans: A, after: t('\\text{m}^2') }],
          { sol: 'The parallel side ' + t('L') + ' uses ' + t('L-' + o.g) + ' m of fence: ' + t('2x+L-' + o.g + '=' + o.F) + ', so ' + t('L=' + T + '-2x') + '.<br>' + t('A(x)=x(' + T + '-2x)') + ': zeros ' + t('0') + ' and ' + t(nT(T / 2)) + ', axis ' + t('x=' + nT(x)) + '.<br>The play area is ' + t(nT(x)) + ' m by ' + t(nT(L)) + ' m, with area ' + t(nT(A) + '\\text{ m}^2') + '.', hints: ['The gate is part of the side but uses no fencing.'], text: 'play area with a gate' });
      } }] },
    { num: 'B3', parts: [
      { id: 'eB3', level: 'PRG', make: function (r) {
        var o = revGen(r, -1, { P: [10, 12, 14, 15, 16, 18, 20, 24], s: [1, 0.5], m: [10, 15, 20, 25], x: [2, 8], N: [80, 400] }, function (z) { return z.P === 16 && z.s === 1 && z.m === 20; }), what = r.pick([['pizza shop', 'pizzas'], ['food truck', 'meals'], ['bakery', 'cakes']]);
        return revFields('A ' + what[0] + ' sells ' + t(o.N) + ' ' + what[1] + ' a day at ' + t(money(o.P)) + ' each. For every ' + t(money(o.s).replace('\\$0.5', '\\$0.50')) + ' decrease in price, it sells ' + t(o.m) + ' more ' + what[1] + '. Determine the price for the maximum daily revenue, the number of ' + what[1] + ' and the revenue.', o, what[1], 'revenue: price decreases');
      } }] },
    { num: 'B4', shared: function (r) { return pickWhere(function () { var tv = r.int(25, 50) / 10, c = r.int(5, 20) / 10; return { tv: tv, c: c, b: cl(10 * tv), H: cl(5 * tv * tv + c), what: r.pick(['An arrow is shot', 'A flare is fired', 'A pop fly is hit']) }; }, function (z) { return !(z.tv === 4 && z.c === 1.5) && !(z.tv === 3 && z.c === 2); }); },
      stem: function (o) { return o.what + ' upward. Its height in metres after ' + t('t') + ' seconds is ' + t('h(t)=' + polyTex([-5, o.b, o.c], 't')) + '.'; },
      parts: [
        { id: 'eB4a', level: 'PRG', make: function (r, o) { var s = cl(o.tv * o.tv); return fieldsPart('Complete the square to find the maximum height and when it is reached.', [{ label: 'Maximum height', ans: o.H, after: 'm', cands: [[o.tv, 'u5l10-time-value', 'That is the time.'], [cl(o.c + s), 'u5l10-cs-a', 'The ' + t(nT(s)) + ' you added inside the bracket comes out multiplied by ' + t('-5') + '.']] }, { label: 'Time', ans: o.tv, after: 's', cands: [[o.H, 'u5l10-time-value', 'That is the height.']] }], { sol: t('h(t)=-5(t^{2}-' + nT(2 * o.tv) + 't+' + nT(s) + '-' + nT(s) + ')+' + nT(o.c) + '=' + vfTex(-5, o.tv, o.H, 't')) + '<br>A maximum of ' + t(nT(o.H)) + ' m after ' + t(nT(o.tv)) + ' s.', hints: ['Factor ' + t('-5') + ' from the first two terms.'], text: 'arrow: maximum by completing the square' }); } },
        { id: 'eB4b', level: 'PRG', outcome: 'RF5', make: function (r, o) { var T = o.tv + Math.sqrt(o.H / 5); return apxPart('When does it land? Answer to the nearest hundredth of a second.', T, 2, { after: 's', unit: 's', outcome: 'RF5', cands: [[2 * o.tv, 'u5l10-half', 'It starts above the ground: solve ' + t('h(t)=0') + '.']], sol: t('(t-' + nT(o.tv) + ')^{2}=\\frac{' + nT(o.H) + '}{5}=' + nT(cl(o.H / 5))) + ', ' + t('t=' + nT(o.tv) + '+\\sqrt{' + nT(cl(o.H / 5)) + '}\\approx ' + fx(T, 2)) + ' s.', hints: ['Set the vertex form equal to 0.'], text: 'arrow: landing time' }); } }] },
    { num: 'B5', parts: [
      { id: 'eB5', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var a = r.int(1, 6), b = r.int(1, 6), k = r.int(1, 6); return { a: a, b: b, c: 2 * a * b * k }; }, function (z) { return z.a !== z.b && !(z.a === 3 && z.b === 4 && z.c === 24) && z.c <= 120; });
        var x = o.c / (2 * o.a), y = o.c / (2 * o.b), A = x * y;
        return fieldsPart('A rectangle has one corner at the origin, two sides along the positive axes, and the opposite corner on the line ' + t(o.a + 'x+' + o.b + 'y=' + o.c) + '. Determine the dimensions of the rectangle with the greatest area, and that area.', [{ label: 'Width (along the ' + t('x') + '-axis)', ans: x, cands: [[y, 'u5l10-swap', 'That is the height.']] }, { label: 'Height (along the ' + t('y') + '-axis)', ans: y, cands: [[x, 'u5l10-swap', 'That is the width.']] }, { label: 'Area', ans: A, after: 'square units' }],
          { sol: 'The corner ' + t('(x,\\ y)') + ' has ' + t('y=' + rT(o.c / o.b) + '-' + rT(o.a / o.b) + 'x') + '.<br>' + t('A(x)=x\\left(' + rT(o.c / o.b) + '-' + rT(o.a / o.b) + 'x\\right)') + ': zeros ' + t('0') + ' and ' + t(rT(o.c / o.a)) + ', axis ' + t('x=' + rT(x)) + '; ' + t('y=' + rT(y)) + '.<br>The rectangle is ' + t(rT(x)) + ' by ' + t(rT(y)) + ', with area ' + t(rT(A)) + ' square units.', hints: ['Solve the line’s equation for ' + t('y') + '. The area is ' + t('xy') + '.'], text: 'rectangle under a line' });
      } }] },
    { num: 'B6', parts: [
      { id: 'eB6', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([1, 2, 3, 4]), p: r.int(-5, 5), c: r.int(-9, 9) }; }, function (z) { return z.p !== 0 && !(z.a === 2 && z.p === 2 && z.c === 3); }), b = -2 * o.a * o.p, q = o.c - o.a * o.p * o.p, wq = o.a * o.p * o.p + 2 * o.a * o.p * o.p + o.c;
        return mcPart(r, 'The minimum value of ' + t('y=' + polyTex([o.a, b, o.c], 'x')) + ' is', [{ html: t(q), right: true }, { html: t(o.p), why: 'That is the ' + t('x') + '-coordinate of the vertex. Substitute it.' }, { html: t(o.c), why: 'That is the ' + t('y') + '-intercept.' }, { html: t(wq), why: 'That uses ' + t('x=' + (-o.p)) + ': check the sign in ' + t('-\\frac{b}{2a}') + '.' }],
          t('x=-\\frac{' + b + '}{2(' + o.a + ')}=' + o.p) + ', ' + t('y=' + q) + '.', HV, 'MC: minimum value');
      } }] },
    { num: 'B7', parts: [
      { id: 'eB7', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { b: 2 * r.int(5, 15), c: r.int(1, 4) }; }, function (z) { return !(z.b === 24 && z.c === 1) && !(z.b === 8); }), tv = o.b / 10, H = 5 * tv * tv + o.c;
        return apxPart('<i>(Numerical Response)</i> A ball’s height in metres is ' + t('h(t)=' + polyTex([-5, o.b, o.c], 't')) + '. Its maximum height, in metres to the nearest tenth, is ______.', H, 1, { nr: true, cands: [[tv, 'u5l10-time-value', 'That is the time of the maximum.']], sol: t('t=' + nT(tv)) + '; ' + t('h(' + nT(tv) + ')=' + nT(cl(-5 * tv * tv)) + '+' + nT(cl(o.b * tv)) + '+' + o.c + '=' + nT(cl(H))) + ' m.', hints: ['Find ' + t('t=-\\frac{b}{2a}') + ', then substitute.'], text: 'NR: maximum height' });
      } }] },

    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'eC1', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { vA: r.pick([5, 10, 12, 15, 20]), vB: r.pick([5, 10, 15, 20, 25]), D: 10 * r.int(3, 10) }; }, function (z) {
          var S = z.vA * z.vA + z.vB * z.vB, ts = z.D * z.vB / S, d2 = z.D * z.D * z.vA * z.vA / S; z.ts = ts; z.d2 = d2;
          return !(z.vA === 10 && z.vB === 20 && z.D === 50) && Math.abs(ts * 100 - Math.round(ts * 100)) < 1e-9 && Number.isInteger(cl(d2)) && Math.abs(Math.sqrt(d2) - Math.round(Math.sqrt(d2))) > 1e-6 && ts > 0.4;
        });
        var d2 = Math.round(o.d2), kk = HW.ex.nthFactor(d2, 2), mm = d2 / (kk * kk), d = Math.sqrt(d2), S = o.vA * o.vA + o.vB * o.vB, ex2 = kk === 1 ? '\\sqrt{' + mm + '}' : kk + '\\sqrt{' + mm + '}';
        var lin = 2 * o.D * o.vB, mins = Math.round(o.ts * 60), clock = (12 + Math.floor(mins / 60) - 12 || 12) + ':' + ('0' + mins % 60).slice(-2) + ' p.m.';
        return fieldsPart('At noon, ship A is at a port and ship B is ' + t(o.D) + ' km due north of the port. Ship A sails east at ' + t(o.vA) + ' km/h and ship B sails south, toward the port, at ' + t(o.vB) + ' km/h. After ' + t('t') + ' hours, the square of the distance between them is ' + t('d^{2}=(' + o.vA + 't)^{2}+(' + o.D + '-' + o.vB + 't)^{2}') + '. When are the ships closest, and how far apart are they then? Give the distance exactly and to the nearest tenth of a kilometre.', [
          { label: 'Hours after noon', ans: o.ts, after: 'h' }, { label: 'Distance (exact)', check: K.radical({ k: kk, n: 2, m: mm }, 'mixed'), key: ex2, ansTex: ex2, math: true, keys: 'radical', after: 'km' }, { label: 'Distance', ans: d, dp: 1, after: 'km', cands: [[d2, 'u5l10-half', 'That is ' + t('d^{2}') + '. Take the square root.']] }],
          { sol: t('d^{2}=' + o.vA * o.vA + 't^{2}+' + o.D * o.D + '-' + lin + 't+' + o.vB * o.vB + 't^{2}=' + S + 't^{2}-' + lin + 't+' + o.D * o.D) + '<br>' + t('d^{2}') + ' is least when ' + t('t=\\frac{' + lin + '}{' + 2 * S + '}=' + nT(o.ts)) + ': ' + t('d^{2}=' + d2) + '.<br>At ' + clock + ', ' + t('d=\\sqrt{' + d2 + '}=' + ex2 + '\\approx ' + fx(d, 1)) + ' km. (The distance is least when its square is least.)', hints: ['Expand ' + t('d^{2}') + ' into general form and find its vertex.', 'The distance is smallest exactly when its square is smallest.'], text: 'ships: closest approach' });
      } }] },
    { num: 'C2', parts: [
      { id: 'eC2', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: -r.int(1, 4), p: r.int(1, 6), M: r.int(5, 40) }; }, function (z) { return !(z.a === -2 && z.p === 3 && z.M === 25); }), b = -2 * o.a * o.p, k = o.M + o.a * o.p * o.p, top = o.a * o.p * o.p + b * o.p;
        return numPart('Determine ' + t('k') + ' so that the maximum value of ' + t('y=' + polyTex([o.a, b, 0], 'x') + '+k') + ' is ' + t(o.M) + '.', k, { before: t('k='), cands: [[o.M - o.a * o.p * o.p, 'u5l10-q', 'Substitute ' + t('x=' + o.p) + ' carefully: ' + t(o.a + '(' + o.p + ')^{2}+' + b + '(' + o.p + ')=' + top) + '.'], [o.M + top, 'sign', t(top + '+k=' + o.M) + ', so subtract.']], sol: t('x=-\\frac{' + b + '}{' + 2 * o.a + '}=' + o.p) + '; ' + t('y=' + nT(o.a * o.p * o.p) + '+' + b * o.p + '+k=' + top + '+k=' + o.M) + ', so ' + t('k=' + k) + '.', hints: ['The maximum is at ' + t('x=-\\frac{b}{2a}') + '. Substitute and set the result equal to ' + o.M + '.'], text: 'find k for a given maximum' });
      } }] },
    { num: 'C3', stem: 'Show that, of all rectangles with perimeter ' + t('P') + ', the square has the greatest area.', parts: [
      { id: 'eC3a', level: 'ADV', make: function (r) {
        return mcPart(r, 'Let one side be ' + t('x') + '. The other side and the greatest-area rectangle are', [
          { html: 'other side ' + t('\\frac{P}{2}-x') + '; the axis is ' + t('x=\\frac{P}{4}') + ', so both sides are ' + t('\\frac{P}{4}') + ': a square', right: true },
          { html: 'other side ' + t('P-x') + '; the axis is ' + t('x=\\frac{P}{2}') + ', so both sides are ' + t('\\frac{P}{2}'), why: 'Two sides of each length use the perimeter: ' + t('2x+2(\\text{other})=P') + ', so the other side is ' + t('\\frac{P}{2}-x') + '.' },
          { html: 'other side ' + t('\\frac{P}{2}-x') + '; the axis is ' + t('x=\\frac{P}{2}') + ', a rectangle twice as long as wide', why: 'The zeros of ' + t('x\\left(\\frac{P}{2}-x\\right)') + ' are ' + t('0') + ' and ' + t('\\frac{P}{2}') + ': the axis is midway, at ' + t('\\frac{P}{4}') + '.' }],
          'Sides ' + t('x') + ' and ' + t('\\frac{P}{2}-x') + ': ' + t('A(x)=x\\left(\\frac{P}{2}-x\\right)') + ', zeros ' + t('0') + ' and ' + t('\\frac{P}{2}') + ', axis ' + t('x=\\frac{P}{4}') + '. The other side is ' + t('\\frac{P}{2}-\\frac{P}{4}=\\frac{P}{4}') + ': a square.', ['Write the other side using the perimeter, then find the axis from the zeros.'], 'square has the greatest area');
      } },
      { id: 'eC3b', level: 'MAS', make: function (r) {
        return exprPart('Write that greatest area in terms of ' + t('P') + '.', function (P) { return P * P / 16; }, '\\frac{P^{2}}{16}', { v: 'P', before: t('A='), cands: [[function (P) { return P * P / 4; }, 'u5l10-half', 'The side is ' + t('\\frac{P}{4}') + ', not ' + t('\\frac{P}{2}') + '.'], [function (P) { return P * P / 8; }, 'value', 'Square the side ' + t('\\frac{P}{4}') + ': ' + t('\\left(\\frac{P}{4}\\right)^{2}') + '.'], [function (P) { return P / 16; }, 'value', 'Square the whole side: ' + t('\\left(\\frac{P}{4}\\right)^{2}=\\frac{P^{2}}{16}') + '.']],
          sol: t('A=\\left(\\frac{P}{4}\\right)^{2}=\\frac{P^{2}}{16}'), hints: ['Each side of the square is ' + t('\\frac{P}{4}') + '.'], text: 'greatest area in terms of P' });
      } }] }
  ];

  HW.defineLesson({ id: LID, unit: 5, num: '10', title: 'Maximum and Minimum Problems: Algebraic Approach', outcome: 'RF4', calc: true, questions: QUESTIONS, extra: EXTRA });
  }
})(window);
