/* Math 20-1 · Unit 1 · Lesson 8 — Infinite Geometric Series (outcome RF10 on every part)
 * Assignment 8 (u1_l08.tex, Questions 1–18) and the Lesson 8 Extra Practice (u1_ep08.tex, Questions 1–13).
 * Every part is a generator (booklet idea, form and difficulty; new numbers; the lesson's example numbers and the
 * booklet's own excluded where feasible). Uses HW.u1seq from u1l7.js (load order).
 * "Convergent or divergent? S∞ where it exists": boxes r and S∞, with a none key for S∞ (a divergent series has no sum).
 * S∞ is accepted exact, or rounded to at least 2 decimal places (the booklet writes ≈ 4.67).
 * "Explain" parts -> multiple choice whose options are reasons. "For what values of x does it converge?" -> a double
 * inequality box (strict signs required; r = ±1 diverges).
 * Added: 2(c) "why are both divergent?" (multiple choice; the booklet asks it inside 2(a)/(b)).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 6, Extra 12, Extra 13. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u1l8', G = HW.u1seq;
  if (!G) throw new Error('u1l8.js needs js/lessons/u1l7.js loaded first');
  var L = G.lib, Q = L.Q, qn = L.qn, qa = L.qa, qs = L.qs, qm = L.qm, qd = L.qd, qp = L.qp, qv = L.qv, qeq = L.qeq, qint = L.qint, gsum = L.gsum, term = L.term, first = L.first,
    qtex = L.qtex, pT = L.pT, nT = L.nT, fx = L.fx, fxT = L.fxT, money = L.money, seriesTex = L.seriesTex, pickWhere = L.pickWhere, isBk = L.isBk, terminates = L.terminates, decStr = L.decStr,
    exactP = L.exactP, roundP = L.roundP, nrP = L.nrP, mcP = L.mcP, fieldsP = L.fieldsP, fNum = L.fNum, fRnd = L.fRnd, fS = L.fS, cS = L.cS, cE = L.cE, cSet = L.cSet, cleanC = L.cleanC, qkeyFrac = L.qkeyFrac, qkey = L.qkey, ord = G.ord;

  var CODES = {
    'u1l8-said-none': 'Said “no sum” for a convergent series', 'u1l8-div-sum': 'Gave a sum for a divergent series', 'u1l8-one-plus-r': 'S∞: used 1 + r', 'u1l8-times': 'S∞: multiplied by 1 − r',
    'u1l8-div-r': 'S∞: divided by r', 'u1l8-r-minus-1': 'S∞: used r − 1 (sign)', 'u1l8-gave-terms': 'Gave terms instead of partial sums', 'u1l8-ineq-unsolved': 'Interval: gave −1 < r < 1 without solving',
    'u1l8-ineq-equal': 'Interval: included r = ±1', 'u1l8-ineq': 'Interval: algebra slip', 'u1l8-ineq-order': 'Interval: ends in the wrong order', 'u1l8-r-invalid': 'Gave r ≤ −1 or r ≥ 1 as a valid ratio',
    'u1l8-1-minus-r': 'Solving for r: gave 1 − r instead of r', 'u1l8-block': 'Repeating decimal: wrong block length (r)', 'u1l8-non-rep': 'Repeating decimal: treated the non-repeating digit as repeating',
    'u1l8-not-rep': 'Repeating decimal: didn’t use the repeat', 'u1l8-down-only': 'Ball: only the distance down', 'u1l8-up-twice': 'Ball: started the rises at the drop height', 'u1l8-one-series': 'Found only one of the two series',
    'u1l8-n-off': 'Number of terms off by one', 'u1l8-term-not-sum': 'Gave a term instead of a total', 'u1l8-dose-count': 'Wrong number of doses', 'u1l8-x-for-r': 'Gave r instead of x',
    'u1l8-ratio': 'Used the percent decrease as the ratio', 'u1l8-t1-not-t2': 'Used the given term as t₁', 'u1l8-r-sign': 'Missed the negative ratio'
  };
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  HW.addPartial({ 'u1l8-said-none': 'n', 'u1l8-div-sum': 'n', 'u1l8-one-plus-r': 'b', 'u1l8-times': 'b', 'u1l8-div-r': 'b', 'u1l8-r-minus-1': 's', 'u1l8-gave-terms': 'b', 'u1l8-ineq-unsolved': 'b',
    'u1l8-ineq-equal': 's', 'u1l8-r-invalid': 'b', 'u1l8-1-minus-r': 's', 'u1l8-block': 'b', 'u1l8-non-rep': 'b', 'u1l8-down-only': 'b', 'u1l8-up-twice': 's', 'u1l8-n-off': 's', 'u1l8-term-not-sum': 'b',
    'u1l8-dose-count': 's', 'u1l8-x-for-r': 's', 'u1l8-ratio': 'b', 'u1l8-t1-not-t2': 'b', 'u1l8-r-sign': 's', 'u1l8-one-series': 's' });

  /* ---------------- helpers ---------------- */
  function sinf(t1, r) { return qd(t1, qs(1, r)); }
  function conv(r) { var v = qv(r); return v > -1 && v < 1; }
  function sinfCands(t1, r) {
    return [[qd(t1, qa(1, r)), 'u1l8-one-plus-r', 'The denominator is ' + t('1-r') + ': with ' + t('r=' + qtex(r)) + ' that is ' + t('1-' + pT(r) + '=' + qtex(qs(1, r))) + '.'],
      [qm(t1, qs(1, r)), 'u1l8-times', 'Divide ' + t('t_1') + ' by ' + t('1-r') + ' — don’t multiply.'], [qeq(r, 0) ? [0, 1] : qd(t1, r), 'u1l8-div-r', t('S_\\infty=\\dfrac{t_1}{1-r}') + ' — the denominator is ' + t('1-r') + ', not ' + t('r') + '.'],
      [qd(t1, qs(r, 1)), 'u1l8-r-minus-1', 'Check the sign: the denominator is ' + t('1-r') + ', not ' + t('r-1') + '.']];
  }
  function sinfLine(t1, r) {
    var D = qs(1, r);
    return 'S_\\infty=\\dfrac{t_1}{1-r}=\\dfrac{' + qtex(t1, { dec: true }) + '}{1-' + pT(r, { dec: true }) + '}=\\dfrac{' + qtex(t1, { dec: true }) + '}{' + qtex(D, { dec: true }) + '}=' + qtex(sinf(t1, r), { d: true }) + (!qint(sinf(t1, r)) ? (terminates(sinf(t1, r)) ? '=' + F(decStr(qv(sinf(t1, r)))) : '\\approx ' + fxT(qv(sinf(t1, r)), 2)) : '');
  }
  var HC = ['Find ' + t('r') + ' by dividing a term by the one before it.', 'If ' + t('-1<r<1') + ' the series converges and ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + '. Otherwise it diverges: press <b>none</b> for ' + t('S_\\infty') + '.'];
  /* boxes r and S∞ for a series given by its first terms */
  function classifyP(terms, t1, r, text, o) {
    o = o || {};
    var S = conv(r) ? sinf(t1, r) : null, rd = qd(terms[1], terms[0]);
    var rC = [[qd(terms[0], terms[1]), 'flip', 'Divide a term by the one <b>before</b> it: ' + t('r=\\dfrac{t_2}{t_1}') + '.'], [qs(terms[1], terms[0]), 'u1-diff', 'That is the difference. A geometric series has a common <b>ratio</b>: divide.']];
    var sol = t('r=\\dfrac{' + qtex(terms[1], { dec: o.dec }) + '}{' + qtex(terms[0], { dec: o.dec }) + '}=' + qtex(r, { dec: o.dec })) + (S ? ', which is between ' + t('-1') + ' and ' + t('1') + ': <b>convergent</b>.<br>' + t(sinfLine(t1, r)) :
      ': ' + (qv(r) === 1 ? t('r=1') + ', so the partial sums ' + t(qtex(t1) + ',\\ ' + qtex(qm(t1, 2)) + ',\\ ' + qtex(qm(t1, 3)) + ',\\ \\ldots') + ' grow' : qv(r) === -1 ? t('r=-1') + ', so the partial sums jump between ' + t(qtex(t1)) + ' and ' + t('0') : t(qv(r) > 0 ? 'r\\ge 1' : 'r\\le -1')) + ': <b>divergent</b>. No sum to infinity.');
    return fieldsP(t(seriesTex(terms, { dec: o.dec })), [fNum(t('r='), r, { cands: rC, math: true }), fS(t('S_\\infty='), S, { dp: 2, cands: S ? sinfCands(t1, r) : null })],
      t('r=' + qtex(r, { dec: o.dec })) + (S ? ', convergent, ' + t('S_\\infty=' + qtex(S)) : ', divergent (no ' + t('S_\\infty') + ')'), sol, HC, text);
  }
  /* repeating decimals: whole w, non-repeating digits a (string), repeating block b (string) */
  function repVal(w, a, b) { var na = a.length, nb = b.length, den = Math.pow(10, na) * (Math.pow(10, nb) - 1), num = Number(a + b || 0) - Number(a || 0); return qa(w, Q(num, den)); }
  function repTex(w, a, b) { return w + '.' + a + '\\overline{' + b + '}'; }
  function repP(r, w, a, b, text, o) {
    o = o || {};
    var V = repVal(w, a, b), nb = b.length, na = a.length, R = Q(1, Math.pow(10, nb)), T1 = Q(Number(b), Math.pow(10, na + nb)), tail = qd(T1, qs(1, R));
    var series = (w ? w + '+' : '') + (na ? '0.' + a + '+' : '') + '\\left(' + nT(qv(T1)) + '+' + nT(qv(qm(T1, R))) + '+\\cdots\\right)';
    var sol = t(repTex(w, a, b) + '=' + series) + '<br>' + t('t_1=' + nT(qv(T1)) + ',\\ r=' + nT(qv(R))) + ': ' + t('S_\\infty=\\dfrac{' + nT(qv(T1)) + '}{' + nT(1 - qv(R)) + '}=\\dfrac{' + b + '}{' + (Math.pow(10, na) * (Math.pow(10, nb) - 1)) + '}' + (qeq(tail, [Number(b), Math.pow(10, na) * (Math.pow(10, nb) - 1)]) ? '' : '=' + qtex(tail))) +
      (w || na ? '<br>' + t(repTex(w, a, b) + '=' + (w ? w + '+' : '') + (na ? qtex(Q(Number(a), Math.pow(10, na))) + '+' : '') + qtex(tail) + '=' + qtex(V)) : '');
    var wr = nb === 1 ? 0.01 : 0.1, aPart = Q(Number(a || 0), Math.pow(10, na));
    var cands = [[Q(Number(String(w) + a + b), Math.pow(10, na + nb)), 'u1l8-not-rep', 'That is the terminating decimal ' + t(w + '.' + a + b) + '. The digits ' + t(b) + ' repeat forever: use an infinite geometric series.'],
      [qa(w, qa(aPart, qd(T1, qs(1, qn(wr))))), 'u1l8-block', 'A block of ' + t(nb) + ' digit' + (nb > 1 ? 's' : '') + ' repeats, so each block is the one before moved ' + t(nb) + ' place' + (nb > 1 ? 's' : '') + ': ' + t('r=' + nT(qv(R))) + ', not ' + t(nT(wr)) + '.']];
    if (na) cands.push([qa(w, Q(Number(a + b), Math.pow(10, na + nb) - 1)), 'u1l8-non-rep', 'Only ' + t(b) + ' repeats; ' + t(a) + ' does not. Keep ' + t('0.' + a) + ' separate and add it at the end.']);
    return exactP(t(repTex(w, a, b)), V, { cands: cands, math: true, noDec: true }, sol, ['Split the decimal into its repeating blocks: each block is the one before it moved one block-length to the right.', 'Digits that don’t repeat stay separate; add them at the end.'], text);
  }
  function svgSquares(n) {
    var s = 120, o = 6, paths = [], pts = [[0, 0], [s, 0], [s, s], [0, s]];
    for (var i = 0; i < n; i++) {
      paths.push('<polygon points="' + pts.map(function (p) { return (p[0] + o) + ',' + (p[1] + o); }).join(' ') + '" fill="none" stroke="currentColor" stroke-width="1.5"/>');
      pts = pts.map(function (p, j) { var q = pts[(j + 1) % 4]; return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; });
    }
    return '<svg class="fig-svg" viewBox="0 0 ' + (s + 2 * o) + ' ' + (s + 2 * o) + '" style="max-width:150px" role="img" aria-label="Nested squares, each joining the midpoints of the one before">' + paths.join('') + '</svg>';
  }
  /* an expression in x: compare at several positive values */
  function cX(f, o) {
    o = o || {};
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/^\s*r\s*=\s*/, '');
      var a = K.read(s); if (a.res) return a.res;
      var vs = Object.keys(ex.shape(a.ast).vars);
      if (vs.some(function (v) { return v !== 'x'; })) return wrong('var', 'Use only the variable ' + t('x') + '.');
      var at = function (g) { return [2, 3, 5, 7, 1.5].every(function (x) { var v = ex.value(a.ast, { x: x }); return ex.eq(v, g(x), 1e-9); }); };
      if (at(f)) return ok();
      for (var i = 0; i < (o.cands || []).length; i++) if (at(o.cands[i][0])) return wrong(o.cands[i][1], o.cands[i][2]);
      return wrong('value', null);
    };
  }
  var HB = ['The ball goes <b>down</b> and <b>up</b>. Add two series: the drops (starting with the drop height) and the rises (starting with the first rebound).'];
  function ballForever(h, p, pt) {
    var D = h / (1 - p), U = h * p / (1 - p);
    return { v: D + U, sol: 'Down: ' + t(nT(h) + '+' + nT(h * p) + '+\\cdots') + ': ' + t('S_\\infty=\\dfrac{' + nT(h) + '}{1-' + pt + '}=' + nT(K.roundTo(D, 4))) + ' m.<br>Up: ' + t(nT(h * p) + '+' + nT(K.roundTo(h * p * p, 4)) + '+\\cdots') + ': ' + t('S_\\infty=\\dfrac{' + nT(h * p) + '}{1-' + pt + '}=' + nT(K.roundTo(U, 4))) + ' m.<br>Total: ' + t(nT(K.roundTo(D + U, 4))) + ' m.',
      cands: [[D, 'u1l8-down-only', 'That is only the distance down. The ball also rises: ' + t(nT(h * p) + '+' + nT(K.roundTo(h * p * p, 4)) + '+\\cdots') + '.'], [2 * D, 'u1l8-up-twice', 'The rises start with the first rebound, ' + t(nT(h * p)) + ' m, not the drop height.'], [U, 'u1l8-down-only', 'That is only the distance up. Add the distance down.']] };
  }

  /* =========================== Assignment 8 =========================== */
  var QUESTIONS = [
    { num: '1', section: 'Assignment', shared: function (r) {
        return pickWhere(function () { return { t1: r.pick([10, 20, 40, 50, 100, 25, 80]), r: r.pick([0.8, 0.6, 0.5, 0.75, 0.4, 0.9]), n: r.int(8, 30) }; }, function (z) {
          var gap = z.t1 / (1 - z.r) * Math.pow(z.r, z.n); if (gap < 0.05 || gap > 3) return false;
          var ok5 = true, s = 0; for (var i = 0; i < 5; i++) { s += z.t1 * Math.pow(z.r, i); if (Math.abs(s * 1e4 - Math.round(s * 1e4)) > 1e-6) ok5 = false; } return ok5 && !(z.t1 === 10 && z.r === 0.8);
        });
      }, stem: function (z) { return 'Consider the infinite geometric series ' + t(seriesTex(first(z.t1, qn(z.r), 3), { dec: true })) + '.'; }, parts: [
        { id: '1a', level: 'BEG', make: function (r, z) {
          var S = [], s = 0; for (var i = 0; i < 5; i++) { s += z.t1 * Math.pow(z.r, i); S.push(L.cl(s)); }
          return fieldsP('Complete the table of partial sums ' + t('S_1') + ' to ' + t('S_5') + '.', S.map(function (x, i) { return fNum(t('S_{' + (i + 1) + '}='), x, { cands: i ? [[L.cl(z.t1 * Math.pow(z.r, i)), 'u1l8-gave-terms', 'That is the term ' + t('t_{' + (i + 1) + '}') + '. A partial sum adds all the terms so far: ' + t('S_{' + (i + 1) + '}=S_' + i + '+t_' + (i + 1)) + '.']] : [] }); }),
            t(S.map(function (x) { return nT(x); }).join(',\\ ')), 'Add one term at a time: ' + S.map(function (x, i) { return t('S_{' + (i + 1) + '}=' + nT(x)); }).join(', ') + '.', ['Each partial sum is the one before plus the next term.'], 'table of partial sums');
        } },
        { id: '1b', level: 'EMG', make: function (r, z) {
          var si = qv(sinf(z.t1, qn(z.r))), x = si * (1 - Math.pow(z.r, z.n));
          return roundP('Determine ' + t('S_{' + z.n + '}') + ' to the nearest hundredth.', x, 2, { cands: [[si, 'u1l8-term-not-sum', 'That is ' + t('S_\\infty') + '. For ' + t('S_{' + z.n + '}') + ' use ' + t('\\dfrac{t_1(1-r^{n})}{1-r}') + '.'], [z.t1 * Math.pow(z.r, z.n - 1), 'u1l8-term-not-sum', 'That is the term ' + t('t_{' + z.n + '}') + '.'], [z.t1 * (1 - Math.pow(z.r, z.n - 1)) / (1 - z.r), 'u1l8-n-off', 'That is ' + t('S_{' + (z.n - 1) + '}') + '.']] },
            t('r=' + nT(z.r)) + '. ' + t('S_{' + z.n + '}=\\dfrac{' + z.t1 + '(1-' + nT(z.r) + '^{' + z.n + '})}{1-' + nT(z.r) + '}\\approx ' + fxT(x, 2)), [t('S_n=\\dfrac{t_1(1-r^n)}{1-r}') + '.'], 'a long partial sum');
        } },
        { id: '1c', level: 'BEG', make: function (r, z) {
          var S = sinf(z.t1, qn(z.r));
          return exactP('Determine ' + t('S_\\infty') + '.', S, { cands: sinfCands(z.t1, qn(z.r)), dp: 2 }, t(sinfLine(z.t1, qn(z.r))), [t('S_\\infty=\\dfrac{t_1}{1-r}') + '.'], 'sum to infinity');
        } },
        { id: '1d', level: 'PRG', make: function (r, z) {
          var nx = z.t1 * Math.pow(z.r, z.n);
          return mcP(r, 'Why is ' + t('S_{' + z.n + '}') + ' so close to ' + t('S_\\infty') + '?', 'The terms after ' + t('t_{' + z.n + '}') + ' are very small (' + t('t_{' + (z.n + 1) + '}\\approx ' + nT(K.roundTo(nx, 3))) + '), so adding all of them changes the total very little.',
            [{ html: t('S_{' + z.n + '}') + ' already includes every term of the series.', why: 'An infinite series has no last term — there are always more terms after ' + t('t_{' + z.n + '}') + ', just very small ones.' },
              { html: 'The partial sums grow without limit, so any two of them are close.', why: 'That describes a divergent series. Here ' + t('-1<r<1') + ': the partial sums level off.' },
              { html: 'The terms after ' + t('t_{' + z.n + '}') + ' are all negative and cancel the positive ones.', why: 'All the terms are positive here. They just get very small.' }],
            'Because ' + t('-1<r<1') + ', ' + t('r^n') + ' shrinks toward ' + t('0') + ': ' + t('t_{' + (z.n + 1) + '}=' + z.t1 + '(' + nT(z.r) + ')^{' + z.n + '}\\approx ' + nT(K.roundTo(nx, 3))) + '. All the terms after ' + t('t_{' + z.n + '}') + ' add up to ' + t('S_\\infty-S_{' + z.n + '}\\approx ' + fxT(z.t1 / (1 - z.r) * Math.pow(z.r, z.n), 2)) + '.',
            ['How big is the next term?'], 'why Sₙ is close to S∞');
        } }] },
    { num: '2', stem: 'Write the first five partial sums of each infinite geometric series.', parts: [
      { id: '2a', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { t1: r.int(1, 4), r: r.pick([1.5, 2, 3, 1.25]) }; }, function (z) { return !(z.t1 === 1 && z.r === 1.5); });
        var S = [], s = 0; for (var i = 0; i < 5; i++) { s += z.t1 * Math.pow(z.r, i); S.push(L.cl(s)); }
        return fieldsP(t(seriesTex(first(z.t1, qn(z.r), 3), { dec: true })), S.map(function (x, i) { return fNum(t('S_{' + (i + 1) + '}='), x, { cands: i ? [[L.cl(z.t1 * Math.pow(z.r, i)), 'u1l8-gave-terms', 'That is the term ' + t('t_{' + (i + 1) + '}') + '. Add it to ' + t('S_{' + i + '}') + '.']] : [] }); }),
          t(S.map(nT).join(',\\ ')), S.map(function (x, i) { return t('S_{' + (i + 1) + '}=' + nT(x)); }).join(', ') + '. The terms grow (' + t('r=' + nT(z.r)) + '), so the partial sums grow without limit: <b>divergent</b>.', ['Add one term at a time.'], 'partial sums, r > 1');
      } },
      { id: '2b', level: 'EMG', make: function (r) {
        var a = r.pick([2, 4, 5, 6, 7, 9, 10]), S = [a, 0, a, 0, a];
        return fieldsP(t(a + '-' + a + '+' + a + '-' + a + '+\\cdots'), S.map(function (x, i) { return fNum(t('S_{' + (i + 1) + '}='), x, { cands: [[i % 2 ? a : 0, 'u1l8-gave-terms', 'Add one term at a time: the terms alternate ' + t(a) + ' and ' + t('-' + a) + '.'], [(i + 1) * a, 'sign', 'Every second term is negative.']] }); }),
          t(S.join(',\\ ')), t(S.join(',\\ ')) + '. ' + t('r=-1') + ': the partial sums keep jumping between ' + t(a) + ' and ' + t('0') + ' and never settle on one value: <b>divergent</b>.', ['Add one term at a time; every second term is negative.'], 'partial sums, r = −1');
      } },
      { id: '2c', level: 'PRG', make: function (r) {
        return mcP(r, 'Why are both series in (a) and (b) divergent?', 'In (a) the partial sums grow without limit; in (b) they keep jumping between two values. In neither case do they settle on one number.',
          [{ html: 'Both have a negative ratio.', why: 'In (a) the ratio is positive and bigger than ' + t('1') + '. Look at what the partial sums do.' },
            { html: 'Both have partial sums that settle on one number, so they are divergent.', why: 'Settling on one number is what <b>convergent</b> means.' },
            { html: 'An infinite series can never have a sum.', why: 'A series with ' + t('-1<r<1') + ' does have a sum to infinity.' }],
          'A series is convergent only when its partial sums get closer and closer to one fixed number. (a): ' + t('r>1') + ', the sums grow without limit. (b): ' + t('r=-1') + ', the sums jump between two values.', ['What do the partial sums do?'], 'why divergent');
      } }] },
    { num: '3', stem: 'Determine ' + t('r') + ' and state whether each series is convergent or divergent. Calculate ' + t('S_\\infty') + ' where it exists (press <b>none</b> if it doesn’t).', parts: [
      { id: '3a', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { q: r.int(2, 5), c: r.int(1, 9) }; }, function (z) { return !(z.q === 3 && z.c === 6) && !(z.q === 3 && z.c === 5); }); var t1 = z.c * z.q * z.q, R = Q(1, z.q); return classifyP(first(t1, R, 3), t1, R, 'classify: r = 1/q'); } },
      { id: '3b', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { t1: r.pick([4, 5, 7, 8, 9, 12, 16, 20]), r: r.pick([-0.5, -0.25, -0.2, -0.4]) }; }, function (z) { return !(z.t1 === 7 && z.r === -0.5) && !(z.t1 === 20 && z.r === -0.8); }); var R = qn(z.r); return classifyP(first(z.t1, R, 3), z.t1, R, 'classify: negative decimal r', { dec: true }); } },
      { id: '3c', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { t1: Q(r.int(1, 5), 10), r: r.int(2, 4) }; }, function (z) { return !(qv(z.t1) === 0.2 && z.r === 3); }); return classifyP(first(z.t1, z.r, 3), z.t1, qn(z.r), 'classify: r > 1', { dec: true }); } },
      { id: '3d', level: 'EMG', make: function (r) { var a = r.pick([3, 4, 5, 7, 8, 9, -2, -5]); return classifyP([qn(a), qn(a), qn(a)], qn(a), [1, 1], 'classify: r = 1'); } },
      { id: '3e', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { t1: r.pick([100, 50, 125, 200, 80]), r: r.pick([-0.9, -0.8, -0.6, -0.75]) }; }, function (z) { return !(z.t1 === 100 && z.r === -0.9) && Math.abs(z.t1 * z.r * z.r * 100 - Math.round(z.t1 * z.r * z.r * 100)) < 1e-6; }); var R = qn(z.r); return classifyP(first(z.t1, R, 3), z.t1, R, 'classify: r close to −1', { dec: true }); } },
      { id: '3f', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { t1: -r.pick([16, 24, 32, 40, 48, 64, 80]), r: r.pick([0.75, 0.5, 0.25, 0.8, 0.6]) }; }, function (z) { return !(z.t1 === -24 && z.r === 0.75) && Math.abs(z.t1 * z.r * z.r * 100 - Math.round(z.t1 * z.r * z.r * 100)) < 1e-6; }); var R = qn(z.r); return classifyP(first(z.t1, R, 3), z.t1, R, 'classify: negative terms', { dec: true }); } },
      { id: '3g', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { p: r.int(1, 7), q: r.pick([2, 3, 4, 5]), d: r.pick([2, 3, 4]) }; }, function (z) { return L.gcd(z.p, z.q) === 1 && !(z.p === 5 && z.q === 2 && z.d === 3); }); var t1 = Q(z.p, z.q), R = Q(1, z.d); return classifyP(first(t1, R, 3), t1, R, 'classify: fraction terms'); } },
      { id: '3h', level: 'EMG', make: function (r) { var a = r.pick([2, 3, 5, 6, 7, 9, 12]); return classifyP([qn(a), qn(-a), qn(a)], qn(a), [-1, 1], 'classify: r = −1'); } },
      { id: '3i', level: 'PRG', make: function (r) {
        if (r.chance(0.6)) { var k = r.pick([6, 7, 8, 9]); return classifyP([Q(k * k, 100), Q(k, 10), qn(1)], Q(k * k, 100), Q(10, k), 'classify: r just over 1', { dec: true }); }
        var z = pickWhere(function () { return { p: r.int(3, 5), q: r.int(2, 4), m: r.int(1, 3) }; }, function (z) { return z.p > z.q && L.gcd(z.p, z.q) === 1; });
        return classifyP([qn(z.m * z.q * z.q), qn(-z.m * z.p * z.q), qn(z.m * z.p * z.p)], qn(z.m * z.q * z.q), Q(-z.p, z.q), 'classify: r below −1');
      } }] },
    { num: '4', shared: function (r) { return pickWhere(function () { return { t1: r.pick([100, 150, 250, 300, 400, 500, 120]), r: r.pick([0.8, 0.75, 0.6, 0.9, 0.5]), n: r.int(8, 12), f: r.pick([0.99, 0.98, 0.95]) }; }, function (z) {
        var Si = qv(sinf(z.t1, qn(z.r))), T = Si * z.f; z.T = K.roundTo(T, 2); var n = 1; while (Si * (1 - Math.pow(z.r, n)) <= z.T) n++; z.m = n; var a = Si * (1 - Math.pow(z.r, n - 1)), b = Si * (1 - Math.pow(z.r, n));
        return Number.isInteger(Si) && Math.abs(z.T - Math.round(z.T)) < 1e-9 && b - z.T > 0.05 && z.T - a > 0.05 && !(z.t1 === 200 && z.r === 0.8) && Math.abs(z.t1 * z.r * z.r - Math.round(z.t1 * z.r * z.r)) < 1e-9; }); },
      stem: function (z) { return 'Consider the series ' + t(seriesTex(first(z.t1, qn(z.r), 3), { dec: true })) + '.'; }, parts: [
        { id: '4a', level: 'EMG', make: function (r, z) {
          var Si = qv(sinf(z.t1, qn(z.r))), Sn = Si * (1 - Math.pow(z.r, z.n));
          return fieldsP('Determine ' + t('S_\\infty') + ' and ' + t('S_{' + z.n + '}') + ' (to the nearest hundredth).', [fNum(t('S_\\infty='), qn(Si), { cands: sinfCands(z.t1, qn(z.r)) }), fRnd(t('S_{' + z.n + '}\\approx'), Sn, 2, { cands: [[Si, 'u1l8-term-not-sum', 'That is ' + t('S_\\infty') + '.'], [z.t1 * Math.pow(z.r, z.n - 1), 'u1l8-term-not-sum', 'That is the term ' + t('t_{' + z.n + '}') + '.']] })],
            t('S_\\infty=' + F(Si) + ',\\ S_{' + z.n + '}\\approx ' + fxT(Sn, 2)), t('r=' + nT(z.r)) + '. ' + t('S_\\infty=\\dfrac{' + z.t1 + '}{' + nT(1 - z.r) + '}=' + F(Si)) + '<br>' + t('S_{' + z.n + '}=\\dfrac{' + z.t1 + '(1-' + nT(z.r) + '^{' + z.n + '})}{' + nT(1 - z.r) + '}=' + F(Si) + '(1-' + nT(z.r) + '^{' + z.n + '})\\approx ' + fxT(Sn, 2)),
            [t('S_\\infty=\\dfrac{t_1}{1-r}') + ' and ' + t('S_n=\\dfrac{t_1(1-r^n)}{1-r}') + '.'], 'S∞ and Sₙ');
        } },
        { id: '4b', level: 'ADV', make: function (r, z) {
          var Si = qv(sinf(z.t1, qn(z.r))), S = function (n) { return Si * (1 - Math.pow(z.r, n)); };
          return exactP('Use a calculator table to find the smallest number of terms whose sum is greater than ' + t(F(z.T)) + '.', [z.m, 1], { after: 'terms', cands: [[z.m - 1, 'u1l8-n-off', t('S_{' + (z.m - 1) + '}\\approx ' + fxT(S(z.m - 1), 2)) + ' — not greater than ' + t(F(z.T)) + ' yet.'], [z.m + 1, 'u1l8-n-off', 'Check ' + t('S_{' + z.m + '}\\approx ' + fxT(S(z.m), 2)) + '.']] },
            t('S_n=' + F(Si) + '(1-' + nT(z.r) + '^{n})>' + F(z.T)) + ' when ' + t(nT(z.r) + '^{n}<' + nT(K.roundTo(1 - z.f, 4))) + '.<br>' + t('S_{' + (z.m - 1) + '}\\approx ' + fxT(S(z.m - 1), 2) + ',\\ S_{' + z.m + '}\\approx ' + fxT(S(z.m), 2)) + '. The first ' + t(z.m) + ' terms are needed.',
            ['Put ' + t('Y_1=' + F(Si) + '(1-' + nT(z.r) + '^{X})') + ' in a table.'], 'terms needed to pass a value');
        } }] },
    { num: '5', stem: 'Each part describes an infinite geometric series. Determine the missing value.', parts: [
      { id: '5a', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { S: r.pick([20, 40, 50, 60, 80, 100, 120]), r: r.pick([0.35, 0.2, 0.45, 0.15, 0.6, 0.25, 0.4]) }; }, function (z) { return !(z.S === 60 && z.r === 0.35) && !(z.S === 50 && z.r === 0.3); });
        var t1 = qm(z.S, qs(1, qn(z.r)));
        return exactP(t('S_\\infty=' + z.S + ',\\ r=' + nT(z.r)) + '; find ' + t('t_1') + '.', t1, { cands: [[qm(z.S, qa(1, qn(z.r))), 'u1l8-one-plus-r', t('t_1=S_\\infty(1-r)') + ', not ' + t('(1+r)') + '.'], [qd(z.S, qs(1, qn(z.r))), 'u1l8-times', 'Multiply ' + t('S_\\infty') + ' by ' + t('1-r') + ' (solve ' + t(z.S + '=\\dfrac{t_1}{1-' + nT(z.r) + '}') + ').']] },
          t(z.S + '=\\dfrac{t_1}{1-' + nT(z.r) + '}\\ \\Rightarrow\\ t_1=' + z.S + '(' + nT(1 - z.r) + ')=' + qtex(t1, { dec: true })), ['Substitute into ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + ' and multiply both sides by ' + t('1-r') + '.'], 't₁ from S∞ and r');
      } },
      { id: '5b', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { S: -r.pick([20, 30, 40, 45, 60, 90]), r: r.pick([-0.5, -0.2, -0.25, -0.6]) }; }, function (z) { return !(z.S === -45 && z.r === -0.5); });
        var t1 = qm(z.S, qs(1, qn(z.r)));
        return exactP(t('S_\\infty=' + z.S + ',\\ r=' + nT(z.r)) + '; find ' + t('t_1') + '.', t1, { cands: [[qm(z.S, qa(1, qn(z.r))), 'u1l8-one-plus-r', t('1-r=1-(' + nT(z.r) + ')=' + nT(1 - z.r)) + '.'], [qm(-1, t1), 'sign', 'Check the sign: ' + t('S_\\infty') + ' is negative.']] },
          t('t_1=S_\\infty(1-r)=' + z.S + '(1-(' + nT(z.r) + '))=' + z.S + '(' + nT(1 - z.r) + ')=' + qtex(t1, { dec: true })), ['Careful: ' + t('1-r') + ' with a negative ' + t('r') + ' is more than ' + t('1') + '.'], 't₁ from S∞ and r (negatives)');
      } },
      { id: '5c', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { S: r.int(5, 30), p: r.int(1, 4), q: r.int(3, 5) }; }, function (z) { return z.p < z.q && L.gcd(z.p, z.q) === 1 && !(z.S === 20 && z.p === 2 && z.q === 3) && (z.S * (z.q - z.p)) % z.q !== 0; });
        var R = Q(z.p, z.q), t1 = qm(z.S, qs(1, R));
        return exactP(t('S_\\infty=' + z.S + ',\\ r=' + qtex(R)) + '; find ' + t('t_1') + '.', t1, { cands: [[qm(z.S, R), 'u1l8-1-minus-r', 'Multiply by ' + t('1-r=' + qtex(qs(1, R))) + ', not by ' + t('r') + '.'], [qd(z.S, qs(1, R)), 'u1l8-times', 'Multiply ' + t('S_\\infty') + ' by ' + t('1-r') + '.']], math: true },
          t('t_1=S_\\infty(1-r)=' + z.S + '\\left(' + qtex(qs(1, R)) + '\\right)=' + qtex(t1)), [t('t_1=S_\\infty(1-r)') + '.'], 't₁ from S∞ and a fraction r');
      } },
      { id: '5d', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { S: r.pick([10, 12, 15, 16, 20, 24, 30, 40]), f: r.pick([0.75, 0.5, 0.8, 0.6, 0.25, 0.9]) }; }, function (z) { var t1 = z.S * z.f; return Number.isInteger(t1) && !(z.S === 12 && t1 === 9) && !(z.S === 50 && t1 === 35); });
        var t1 = z.S * z.f, R = qs(1, Q(t1, z.S));
        return exactP(t('t_1=' + t1 + ',\\ S_\\infty=' + z.S) + '; find ' + t('r') + '.', R, { cands: [[Q(t1, z.S), 'u1l8-1-minus-r', 'That is ' + t('1-r') + '. Now solve for ' + t('r') + '.'], [Q(z.S, t1), 'flip', 'Solve ' + t(z.S + '(1-r)=' + t1) + ': ' + t('1-r=\\dfrac{' + t1 + '}{' + z.S + '}') + '.'], [qs(Q(t1, z.S), 1), 'sign', t('1-r=' + qtex(Q(t1, z.S), { dec: true })) + ' gives ' + t('r=1-' + qtex(Q(t1, z.S), { dec: true })) + '.']] },
          t(z.S + '=\\dfrac{' + t1 + '}{1-r}\\ \\Rightarrow\\ 1-r=\\dfrac{' + t1 + '}{' + z.S + '}=' + qtex(Q(t1, z.S), { dec: true }) + '\\ \\Rightarrow\\ r=' + qtex(R, { dec: true })), ['Multiply both sides by ' + t('1-r') + ', then divide by ' + t('S_\\infty') + '.'], 'r from t₁ and S∞');
      } },
      { id: '5e', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { S: r.pick([10, 12, 16, 20, 24, 40]), f: r.pick([1.5, 1.25, 1.2, 1.6, 1.8]) }; }, function (z) { var t1 = z.S * z.f; return Number.isInteger(t1) && !(z.S === 20 && t1 === 30) && !(z.S === 8 && t1 === 12); });
        var t1 = z.S * z.f, R = qs(1, Q(t1, z.S));
        return exactP(t('t_1=' + t1 + ',\\ S_\\infty=' + z.S) + '; find ' + t('r') + '.', R, { cands: [[Q(t1, z.S), 'u1l8-1-minus-r', 'That is ' + t('1-r') + '. Now solve for ' + t('r') + '.'], [qm(-1, R), 'sign', t('1-r=' + nT(z.f)) + ' gives ' + t('r=1-' + nT(z.f) + '=' + qtex(R, { dec: true })) + '.']] },
          t('1-r=\\dfrac{' + t1 + '}{' + z.S + '}=' + nT(z.f) + '\\ \\Rightarrow\\ r=' + qtex(R, { dec: true })) + ' (between ' + t('-1') + ' and ' + t('1') + ', so valid).', ['Solve ' + t(z.S + '(1-r)=' + t1) + '.'], 'r from t₁ and S∞ (negative r)');
      } },
      { id: '5f', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { S: r.int(3, 12), f: r.pick([2, 2, 2.5, 3]) }; }, function (z) { return Number.isInteger(z.S * z.f) && !(z.S === 7 && z.f === 2) && !(z.S === 4 && z.f === 2.5); });
        var t1 = z.S * z.f, rr = 1 - z.f;
        return fieldsP(t('t_1=' + t1 + ',\\ S_\\infty=' + z.S) + '; find ' + t('r') + '. (Press <b>none</b> if there is no such series.)', [{ label: t('r='), check: cS(null, { divCode: 'u1l8-r-invalid', divHint: 'Solving gives ' + t('r=' + nT(rr)) + ' — but a series with ' + t('r' + (rr === -1 ? '=-1' : '\\le -1')) + ' diverges, so it can’t have a sum to infinity. Press <b>none</b>.' }), key: 'none', mode: 'math', keys: 'fraction', none: true, name: 'r' }],
          'no such series', t('1-r=\\dfrac{' + t1 + '}{' + z.S + '}=' + nT(z.f) + '\\ \\Rightarrow\\ r=' + nT(rr)) + '. Not allowed: a series with ' + t(rr === -1 ? 'r=-1' : 'r<-1') + ' diverges, so <b>no such series exists</b>.', ['Solve for ' + t('r') + ', then check that ' + t('-1<r<1') + '.'], 'no such series', { bad: [[nT(rr)]] });
      } }] },
    { num: '6', parts: [{ id: '6', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { q: r.pick([2, 2, 3, 4]), c: r.int(1, 9) }; }, function (z) { return !(z.q === 2 && z.c === 6) && !(z.q === 2 && z.c === 16); });
      var a = z.c * z.q * z.q, t4 = Q(a, z.q * z.q), Rp = Q(1, z.q), Rn = Q(-1, z.q), t1p = qd(a, Rp), t1n = qd(a, Rn), Sp = sinf(t1p, Rp), Sn = sinf(t1n, Rn);
      var nb = function (x) { return 'Find ' + t('r') + ' first: ' + t(F(a) + 'r^{2}=' + qtex(t4)) + ', so ' + t('r=\\pm' + qtex(Rp)) + '. ' + x; };
      return fieldsP('In an infinite geometric series, ' + t('t_2=' + F(a)) + ' and ' + t('t_4=' + qtex(t4)) + '. Determine ' + t('t_1') + ' and ' + t('S_\\infty') + ' for each of the two possible series.',
        [fNum(t('r=' + qtex(Rp) + ':\\ t_1='), t1p, { cands: [[a, 'u1l8-t1-not-t2', t(F(a)) + ' is ' + t('t_2') + '. ' + t('t_1=t_2\\div r') + '.'], [qm(a, Rp), 'u1l8-t1-not-t2', t('t_1=t_2\\div r') + ' (the term before is bigger when ' + t('0<r<1') + ').']], name: 't₁ (r > 0)' }),
          fNum(t('S_\\infty='), Sp, { dp: 2, cands: sinfCands(t1p, Rp), name: 'S∞ (r > 0)' }),
          fNum(t('r=' + qtex(Rn) + ':\\ t_1='), t1n, { cands: [[t1p, 'u1l8-r-sign', 'With ' + t('r=' + qtex(Rn)) + ', ' + t('t_1=t_2\\div r') + ' is negative.']], name: 't₁ (r < 0)' }),
          fNum(t('S_\\infty='), Sn, { dp: 2, cands: sinfCands(t1n, Rn).concat([[Sp, 'u1l8-one-series', nb('The second series has a negative ratio.')]]), name: 'S∞ (r < 0)' })],
        t('r=' + qtex(Rp) + ':\\ t_1=' + qtex(t1p) + ',\\ S_\\infty=' + qtex(Sp) + ';\\ r=' + qtex(Rn) + ':\\ t_1=' + qtex(t1n) + ',\\ S_\\infty=' + qtex(Sn)),
        t('t_4=t_2r^{2}') + ': ' + t(F(a) + 'r^{2}=' + qtex(t4) + '\\ \\Rightarrow\\ r^{2}=' + qtex(Q(1, z.q * z.q)) + '\\ \\Rightarrow\\ r=\\pm' + qtex(Rp)) + '<br>' +
          t('r=' + qtex(Rp)) + ': ' + t('t_1=' + F(a) + '\\div ' + qtex(Rp) + '=' + qtex(t1p) + ',\\ ' + sinfLine(t1p, Rp)) + '<br>' + t('r=' + qtex(Rn)) + ': ' + t('t_1=' + F(a) + '\\div\\left(' + qtex(Rn) + '\\right)=' + qtex(t1n) + ',\\ ' + sinfLine(t1n, Rn)),
        ['From ' + t('t_2') + ' to ' + t('t_4') + ' is 2 steps: ' + t('t_4=t_2r^{2}') + '. An even power hides the sign of ' + t('r') + '.'], 'two series from t₂ and t₄');
    } }] },
    { num: '7', shared: function (r) { return pickWhere(function () { return { c: r.int(2, 9), k: r.int(2, 6), h: r.pick([2, 3, 4, 5]) }; }, function (z) { return !(z.c === 5 && z.k === 4) && z.h !== z.k; }); },
      stem: function (z) { return 'The expressions ' + t(z.c + 'x^{2}') + ', ' + t(z.c + 'x') + ' and ' + t(z.c) + ' are the first three terms of an infinite series (' + t('x\\ne 0') + ').'; }, parts: [
        { id: '7a', level: 'PRG', make: function (r, z) {
          return { prompt: 'Show that the series is geometric: write the common ratio ' + t('r') + ' in terms of ' + t('x') + '.', input: { type: 'math', keys: 'expo', vars: ['x'], before: 'r =' }, check: cX(function (x) { return 1 / x; }, { cands: [[function (x) { return x; }, 'flip', 'Divide a term by the one <b>before</b> it: ' + t('\\dfrac{' + z.c + 'x}{' + z.c + 'x^{2}}') + '.']] }),
            key: '\\frac{1}{x}', answer: t('r=\\dfrac{1}{x}'), solution: t('\\dfrac{' + z.c + 'x}{' + z.c + 'x^{2}}=\\dfrac{1}{x}') + ' and ' + t('\\dfrac{' + z.c + '}{' + z.c + 'x}=\\dfrac{1}{x}') + ': the ratios are equal, so the series is geometric with ' + t('r=\\dfrac{1}{x}') + '.', hints: ['Divide the second term by the first, and the third by the second.'], text: 'ratio in terms of x', good: ['x^{-1}', '1/x'], bad: ['x', '\\frac{5}{x}'] };
        } },
        { id: '7b', level: 'PRG', make: function (r, z) {
          var t1 = z.c * z.k * z.k, R = Q(1, z.k), S = sinf(t1, R);
          return exactP('Explain why the series has a sum to infinity when ' + t('x=' + z.k) + ', and determine it.', S, { dp: 2, cands: sinfCands(t1, R).concat([[sinf(z.c, R), 'u1l8-t1-not-t2', 'With ' + t('x=' + z.k) + ' the first term is ' + t(z.c + '(' + z.k + ')^{2}=' + t1) + '.']]) },
            t('r=\\dfrac{1}{' + z.k + '}') + ', which is between ' + t('-1') + ' and ' + t('1') + '. The series is ' + t(seriesTex(first(t1, R, 3))) + '.<br>' + t(sinfLine(t1, R)), ['Substitute ' + t('x=' + z.k) + ' into the terms and into ' + t('r') + '.'], 'S∞ at a value of x');
        } },
        { id: '7c', level: 'EMG', make: function (r, z) {
          var hx = '\\frac{1}{' + z.h + '}';
          return mcP(r, 'Why is there no sum to infinity when ' + t('x=' + hx) + '?', t('r=\\dfrac{1}{x}=' + z.h) + ', which is not between ' + t('-1') + ' and ' + t('1') + ', so the series diverges.',
            [{ html: t('x=' + hx) + ' is between ' + t('-1') + ' and ' + t('1') + ', so the series diverges.', why: 'The test is on ' + t('r') + ', not on ' + t('x') + '. Here ' + t('r=\\dfrac{1}{x}=' + z.h) + '.' },
              { html: 'The terms are fractions, so they can’t be added forever.', why: 'Fractions are fine. What matters is ' + t('r=\\dfrac{1}{x}') + '.' },
              { html: t('r=' + hx) + ', which is too small for the series to converge.', why: 'When ' + t('x=' + hx) + ', ' + t('r=\\dfrac{1}{x}=' + z.h) + ', not ' + t(hx) + '.' }],
            t('r=\\dfrac{1}{1/' + z.h + '}=' + z.h + '\\ge 1') + ', so the series diverges (' + t(seriesTex(first(Q(z.c, z.h * z.h), z.h, 3))) + ').', ['Work out ' + t('r=\\dfrac{1}{x}') + ' first.'], 'why no sum at a value of x');
        } }] },
    { num: '8', stem: 'Use an infinite geometric series to write each repeating decimal as a fraction in lowest terms.', parts: [
      { id: '8a', level: 'BEG', make: function (r) { return repP(r, 0, '', String(r.pick([1, 2, 3, 5, 6, 7])), 'repeating 0.d'); } },
      { id: '8b', level: 'EMG', make: function (r) { var b = pickWhere(function () { return r.int(12, 98); }, function (b) { return b % 11 !== 0 && b !== 45 && b !== 63 && b !== 24; }); return repP(r, 0, '', String(b), 'repeating 0.ab'); } },
      { id: '8c', level: 'PRG', make: function (r) { var b = pickWhere(function () { return r.int(101, 989); }, function (b) { return b % 111 !== 0 && b !== 126 && L.gcd(b, 999) > 1; }); return repP(r, 0, '', String(b), 'repeating 0.abc'); } },
      { id: '8d', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { w: r.int(1, 5), d: r.int(1, 8) }; }, function (z) { return !(z.w === 2 && z.d === 3); }); return repP(r, z.w, '', String(z.d), 'repeating w.d'); } },
      { id: '8e', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { a: r.int(1, 9), d: r.int(1, 9) }; }, function (z) { return z.a !== z.d && !(z.a === 4 && z.d === 6) && !(z.a === 2 && z.d === 7); }); return repP(r, 0, String(z.a), String(z.d), 'repeating 0.a(b)'); } },
      { id: '8f', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { a: r.int(1, 9), b: r.int(10, 98) }; }, function (z) { return z.b % 11 !== 0 && !(z.a === 1 && z.b === 36) && !(z.a === 1 && z.b === 5); }); return repP(r, 0, String(z.a), (z.b < 10 ? '0' : '') + z.b, 'repeating 0.a(bc)'); } },
      { id: '8g', level: 'PRG', make: function (r) {
        var kind = r.pick(['zero', 'zero', 'whole', 'digit']), w = kind === 'whole' ? r.int(1, 5) : 0, a = kind === 'digit' ? String(r.int(1, 8)) : '';
        var T1 = Q(9, Math.pow(10, a.length + 1)), V = qa(w, Q(Number(a || 0) + 1, Math.pow(10, a.length))), dec = repTex(w, a, '9');
        return fieldsP('Use a series to show that ' + t(dec) + ' is equal to ' + t(qtex(V)) + ': give ' + t('t_1') + ' and ' + t('r') + ' of the repeating part, and its sum.', [fNum(t('t_1='), T1, { name: 't₁' }), fNum(t('r='), Q(1, 10), { name: 'r', cands: [[Q(9, 10), 'u1l8-block', 'Each 9 is the one before moved one place right: ' + t('r=0.1') + '.']] }), fNum(t('S_\\infty='), qd(T1, Q(9, 10)), { name: 'S∞', math: true })],
          t('t_1=' + nT(qv(T1)) + ',\\ r=0.1,\\ S_\\infty=' + qtex(qd(T1, Q(9, 10)))), t(dec + '=' + (w ? w + '+' : '') + (a ? '0.' + a + '+' : '') + '(' + nT(qv(T1)) + '+' + nT(qv(T1) / 10) + '+\\cdots)') + '<br>' + t('S_\\infty=\\dfrac{' + nT(qv(T1)) + '}{1-0.1}=\\dfrac{' + nT(qv(T1)) + '}{0.9}=' + qtex(qd(T1, Q(9, 10)))) + (w || a ? ', so ' + t(dec + '=' + (w ? w + '+' : '') + (a ? '0.' + a + '+' : '') + qtex(qd(T1, Q(9, 10)), { dec: true }) + '=' + qtex(V, { dec: true })) : ', so ' + t('0.\\overline{9}=1')) + '.',
          ['Write the repeating part as ' + t(nT(qv(T1)) + '+' + nT(qv(T1) / 10) + '+\\cdots') + '.'], 'show that 0.999… = 1');
      } }] },
    { num: '9', shared: function (r) { return pickWhere(function () { var pq = r.pick([[3, 4], [2, 3], [1, 2], [3, 5], [4, 5]]); return { h: r.int(2, 12), p: pq[0], q: pq[1], k: r.int(5, 7) }; }, function (z) { return !(z.h === 4 && z.p === 3 && z.q === 4) && !(z.h === 9 && z.p === 3 && z.q === 5); }); },
      stem: function (z) { return 'A ball is dropped from a height of ' + t(z.h) + ' m. After each bounce it rises to ' + t('\\frac{' + z.p + '}{' + z.q + '}') + ' of the height it fell from.'; }, parts: [
        { id: '9a', level: 'PRG', make: function (r, z) {
          var p = z.p / z.q, B = ballForever(z.h, p, '\\frac{' + z.p + '}{' + z.q + '}'), V = Q(z.h * (z.q + z.p), z.q - z.p);
          return exactP('If the ball bounces forever, what total vertical distance does it travel?', V, { after: 'm', dp: 2, cands: B.cands.map(function (c) { return [qn(K.roundTo(c[0], 9)), c[1], c[2]]; }) }, B.sol, HB, 'ball: total distance forever');
        } },
        { id: '9b', level: 'ADV', make: function (r, z) {
          var p = z.p / z.q, x = G.ball.total(z.h, p, z.k);
          return roundP('How far has it travelled, to the nearest hundredth of a metre, at the moment it hits the ground for the ' + ord(z.k) + ' time?', x, 2, { after: 'm', cands: G.ball.cands(z.h, p, z.k).concat([[ballForever(z.h, p, '').v, 'u1l8-term-not-sum', 'That is the total if it bounced forever. Stop at the ' + ord(z.k) + ' hit: ' + t(z.k) + ' drops and ' + t(z.k - 1) + ' rises.']]) },
            G.ball.sol(z.h, p, z.k, 2, '\\left(\\frac{' + z.p + '}{' + z.q + '}\\right)'), [t(z.k) + ' drops and ' + t(z.k - 1) + ' rises: use ' + t('S_n') + ' for each.'], 'ball: distance at the kth hit');
        } }] },
    { num: '10', shared: function (r) { return pickWhere(function () { return { D: r.pick([100, 150, 200, 250, 300, 400, 500]), p: r.pick([0.25, 0.2, 0.1, 0.3, 0.4, 0.15]), k: 3, drug: r.pick(['medicine', 'antibiotic', 'pain reliever']) }; }, function (z) { return !(z.D === 200 && z.p === 0.25); }); },
      stem: function (z) { return 'Each morning a patient takes a ' + t(z.D) + ' mg dose of a ' + z.drug + '. By the next morning, ' + t(Math.round(z.p * 100) + '\\%') + ' of it is still in the body. Just after the ' + t('n') + 'th dose, the amount in the body is ' + t(z.D + '+' + z.D + '(' + nT(z.p) + ')+' + z.D + '(' + nT(z.p) + ')^{2}+\\cdots') + ' (' + t('n') + ' terms).'; }, parts: [
        { id: '10a', level: 'EMG', make: function (r, z) {
          var S = qn(L.cl(z.D * (1 - Math.pow(z.p, z.k)) / (1 - z.p)));
          return exactP('How much is in the body just after dose ' + t(z.k) + '?', S, { after: 'mg', cands: [[L.cl(z.D * (1 - Math.pow(z.p, z.k - 1)) / (1 - z.p)), 'u1l8-dose-count', 'That is after dose ' + t(z.k - 1) + '. Add ' + t(z.k) + ' terms.'], [L.cl(z.D * Math.pow(z.p, z.k - 1)), 'u1l8-term-not-sum', 'That is what is left of the first dose only. Add every dose still in the body.'], [L.cl(z.D * (1 - Math.pow(1 - z.p, z.k)) / z.p), 'u1l8-ratio', t(Math.round(z.p * 100) + '\\%') + ' <b>stays</b>, so ' + t('r=' + nT(z.p)) + '.']] },
            t(first(z.D, qn(z.p), z.k).map(function (x) { return qtex(x, { dec: true }); }).join('+') + '=' + qtex(S, { dec: true })) + ' mg', ['Add the first ' + t(z.k) + ' terms.'], 'medicine after k doses');
        } },
        { id: '10b', level: 'PRG', make: function (r, z) {
          var S = qd(z.D, qs(1, qn(z.p)));
          return exactP('If the patient keeps taking it for a long time, what amount (to the nearest hundredth of a milligram) does the level just after a dose approach?', S, { after: 'mg', dp: 2, cands: sinfCands(z.D, qn(z.p)).concat([[qd(z.D, qn(z.p)), 'u1l8-ratio', 'Use ' + t('r=' + nT(z.p)) + ' in ' + t('\\dfrac{t_1}{1-r}') + '.']]) },
            t('S_\\infty=\\dfrac{' + z.D + '}{1-' + nT(z.p) + '}=\\dfrac{' + z.D + '}{' + nT(1 - z.p) + '}' + (terminates(S) ? '=' + nT(qv(S)) : '\\approx ' + fxT(qv(S), 2))) + ' mg', ['The level approaches ' + t('S_\\infty') + '.'], 'medicine level approached');
        } }] },
    { num: '11', shared: function (r) { return pickWhere(function () { return { A: r.pick([2000, 3000, 4000, 5000, 1500, 2500]), pc: r.pick([8, 10, 12, 15, 20, 5]), k: r.int(5, 8), n: r.int(8, 12), what: r.pick([['gold mine', 'gold'], ['silver mine', 'silver'], ['copper mine', 'copper']]) }; }, function (z) { return !(z.A === 3000 && z.pc === 12) && (z.A * 100) % z.pc === 0; }); },
      stem: function (z) { return 'A ' + z.what[0] + ' produced ' + t(F(z.A)) + ' kg of ' + z.what[1] + ' in its first year. Each year after that, its production was ' + t(z.pc + '\\%') + ' less than the year before.'; }, parts: [
        { id: '11a', level: 'EMG', make: function (r, z) {
          var g = 1 - z.pc / 100, x = z.A * Math.pow(g, z.k - 1);
          return roundP('How much, to the nearest kilogram, did it produce in year ' + t(z.k) + '?', x, 0, { after: 'kg', cands: [[z.A * Math.pow(g, z.k), 'u1l7-day-off', 'Year ' + t(z.k) + ' is ' + t('t_{' + z.k + '}=t_1r^{' + (z.k - 1) + '}') + '.'], [z.A * Math.pow(z.pc / 100, z.k - 1), 'u1l8-ratio', t(z.pc + '\\%') + ' <b>less</b> means ' + t('r=1-' + nT(z.pc / 100) + '=' + nT(g)) + '.']] },
            t('r=' + nT(g)) + '. ' + t('t_{' + z.k + '}=' + F(z.A) + '(' + nT(g) + ')^{' + (z.k - 1) + '}\\approx ' + F(fx(x, 0))) + ' kg', [t(z.pc + '\\%') + ' less each year: ' + t('r=' + nT(g)) + '.'], 'production in year k');
        } },
        { id: '11b', level: 'PRG', make: function (r, z) {
          var g = 1 - z.pc / 100, x = z.A * (1 - Math.pow(g, z.n)) / (1 - g);
          return roundP('How much, to the nearest kilogram, did it produce in the first ' + t(z.n) + ' years?', x, 0, { after: 'kg', cands: [[z.A * Math.pow(g, z.n - 1), 'u1l8-term-not-sum', 'That is year ' + t(z.n) + ' only. Add all ' + t(z.n) + ' years.'], [z.A / (1 - g), 'u1l8-term-not-sum', 'That is ' + t('S_\\infty') + ' (forever). Stop at ' + t(z.n) + ' years.'], [z.A * (1 - Math.pow(g, z.n - 1)) / (1 - g), 'u1l8-n-off', 'That is ' + t(z.n - 1) + ' years.']] },
            t('S_{' + z.n + '}=\\dfrac{' + F(z.A) + '(1-' + nT(g) + '^{' + z.n + '})}{' + nT(1 - g) + '}\\approx ' + F(fx(x, 0))) + ' kg', [t('S_n=\\dfrac{t_1(1-r^n)}{1-r}') + '.'], 'total in the first n years');
        } },
        { id: '11c', level: 'PRG', make: function (r, z) {
          var S = Q(z.A * 100, z.pc);
          return exactP('What is the most it could ever produce if this pattern continued?', S, { after: 'kg', dp: 0, cands: sinfCands(z.A, qn(1 - z.pc / 100)).map(function (c) { return [qn(K.roundTo(qv(c[0]), 9)), c[1], c[2]]; }) },
            t('S_\\infty=\\dfrac{' + F(z.A) + '}{1-' + nT(1 - z.pc / 100) + '}=\\dfrac{' + F(z.A) + '}{' + nT(z.pc / 100) + '}=' + qtex(S, { dec: true })) + ' kg', ['The most it could ever produce is ' + t('S_\\infty') + '.'], 'total if it went on forever');
        } },
        { id: '11d', level: 'EMG', make: function (r, z) {
          return mcP(r, 'Give one reason the actual total could be less than your answer to (c).', 'When yearly production gets small, mining costs more than the ' + z.what[1] + ' is worth, so the mine closes.',
            [{ html: 'The terms of a convergent series eventually become negative.', why: 'With ' + t('0<r<1') + ' every term stays positive; they just get small.' }, { html: 'The sum to infinity is only an estimate of ' + t('S_{10}') + '.', why: t('S_\\infty') + ' is the total if production went on forever. In real life it stops.' },
              { html: 'A geometric series with ' + t('r<1') + ' has no sum.', why: 'With ' + t('-1<r<1') + ' it does: that is (c).' }],
            t('S_\\infty') + ' assumes the pattern goes on forever. In real life the mine closes when the small yearly amounts aren’t worth mining (or the pattern changes), so the actual total is less.', ['What does ' + t('S_\\infty') + ' assume?'], 'why the real total is less');
        } }] },
    { num: '12', shared: function (r) { return pickWhere(function () { var b = r.pick([-1, 1, -2, 2, 3, -3]), a = r.pick([2, 3, 4]); return { a: a, b: b, rv: r.pick([[1, 5], [1, 4], [1, 2], [1, 3], [-1, 3], [-1, 2], [2, 5], [3, 5]]), x0: null }; }, function (z) {
        if (z.a === 2 && z.b === -1) return false; var rr = z.rv[0] / z.rv[1]; z.xr = Q(z.rv[0] - z.b * z.rv[1], z.a * z.rv[1]);
        var cands = [Q(1, 2), Q(1, 4), Q(3, 4), Q(1, 3), Q(2, 3), Q(-1, 4), Q(-1, 2), Q(1, 5)].map(function (c) { return qd(qs(c, z.b), z.a); }).filter(function (x) { return !qeq(x, z.xr); });
        z.x0 = cands[Math.floor(Math.abs(Math.sin(z.a * 7 + z.b * 3 + z.rv[1])) * cands.length)]; return !!z.x0; }); },
      stem: function (z) { var e = z.a + 'x' + (z.b < 0 ? '-' + (-z.b) : '+' + z.b); return 'Consider the infinite geometric series ' + t('1+(' + e + ')+(' + e + ')^{2}+\\cdots') + '.'; }, parts: [
        { id: '12a', level: 'ADV', make: function (r, z) {
          var e = z.a + 'x' + (z.b < 0 ? '-' + (-z.b) : '+' + z.b), lo = Q(-1 - z.b, z.a), hi = Q(1 - z.b, z.a);
          return G.ineqP('For what values of ' + t('x') + ' does the series converge? (Type a double inequality.)', lo, hi, 'x',
            t('r=' + e) + ': ' + t('-1<' + e + '<1\\ \\Rightarrow\\ ' + (-1 - z.b) + '<' + z.a + 'x<' + (1 - z.b) + '\\ \\Rightarrow\\ ' + qtex(lo) + '<x<' + qtex(hi)),
            ['The ratio is ' + t('r=' + e) + '. The series converges when ' + t('-1<r<1') + '.', 'Do the same to all three parts: ' + (z.b < 0 ? 'add ' + t(-z.b) : 'subtract ' + t(z.b)) + ', then divide by ' + t(z.a) + '.'], 'interval of convergence',
            { cands: [[qv(Q(-1 + z.b, z.a)), qv(Q(1 + z.b, z.a)), 'u1l8-ineq', (z.b < 0 ? 'Add ' + t(-z.b) : 'Subtract ' + t(z.b)) + ' on all three parts (not the opposite).'], [-1 - z.b, 1 - z.b, 'u1l8-ineq', 'Now divide all three parts by ' + t(z.a) + '.']] });
        } },
        { id: '12b', level: 'PRG', make: function (r, z) {
          var R = qa(qm(z.a, z.x0), z.b), S = sinf(1, R);
          return exactP('Determine ' + t('S_\\infty') + ' when ' + t('x=' + qtex(z.x0, { dec: true })) + '.', S, { dp: 2, cands: sinfCands(1, R) },
            t('r=' + z.a + '(' + qtex(z.x0, { dec: true }) + ')' + (z.b < 0 ? '-' + (-z.b) : '+' + z.b) + '=' + qtex(R, { dec: true })) + '. ' + t(sinfLine(1, R)), ['Find ' + t('r') + ' at this ' + t('x') + ' first; ' + t('t_1=1') + '.'], 'S∞ at a value of x');
        } },
        { id: '12c', level: 'ADV', make: function (r, z) {
          var R = Q(z.rv[0], z.rv[1]), S = sinf(1, R), e = z.a + 'x' + (z.b < 0 ? '-' + (-z.b) : '+' + z.b);
          return exactP('Determine ' + t('x') + ' if ' + t('S_\\infty=' + qtex(S)) + '.', z.xr, { cands: [[R, 'u1l8-x-for-r', 'That is ' + t('r') + '. Now solve ' + t(e + '=' + qtex(R)) + ' for ' + t('x') + '.'], [qs(1, R), 'u1l8-1-minus-r', 'That is ' + t('1-r') + '. Find ' + t('r') + ', then ' + t('x') + '.']], math: true },
            t('\\dfrac{1}{1-r}=' + qtex(S) + '\\ \\Rightarrow\\ 1-r=' + qtex(qd(1, S)) + '\\ \\Rightarrow\\ r=' + qtex(R)) + '<br>' + t(e + '=' + qtex(R) + '\\ \\Rightarrow\\ x=' + qtex(z.xr)) + ' (it is inside the interval from (a)).',
            ['Solve ' + t('\\dfrac{1}{1-r}=' + qtex(S)) + ' for ' + t('r') + ', then set ' + t(e) + ' equal to it.'], 'x from S∞');
        } }] },
    { num: '13', shared: function (r) { return { s: r.pick([4, 6, 10, 12, 16, 20, 2]) }; },
      stem: function (z) { return '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">' + svgSquares(5) + '<div>A square has sides of ' + t(z.s) + ' cm. Joining the midpoints of its sides makes a second square with half the area of the first. Joining the midpoints of the second makes a third, and so on forever.</div></div>'; }, parts: [
        { id: '13a', level: 'BEG', make: function (r, z) {
          var A = [1, 2, 4, 8].map(function (d) { return Q(z.s * z.s, d); });
          return fieldsP('Write the areas of the first four squares (cm²).', A.map(function (a, i) { return fNum('square ' + (i + 1) + ':', a, { after: 'cm²', cands: i ? [[Q(z.s * z.s, Math.pow(4, i)), 'u1l8-ratio', 'Each square has <b>half</b> the area of the one before (its side is not half).']] : [[z.s * 4, 'u1l8-ratio', 'Area, not perimeter: ' + t(z.s + '^{2}') + '.']], name: 'square ' + (i + 1) }); }),
            t(A.map(function (a) { return qtex(a, { dec: true }); }).join(',\\ ')), 'Area of the first: ' + t(z.s + '^{2}=' + z.s * z.s) + '; each one after is half: ' + t(A.map(function (a) { return qtex(a, { dec: true }); }).join(',\\ ')) + ' (cm²).', ['Halve the area each time.'], 'areas of nested squares');
        } },
        { id: '13b', level: 'PRG', make: function (r, z) {
          var S = 2 * z.s * z.s;
          return exactP('Determine the total area of all the squares.', [S, 1], { after: 'cm²', cands: [[z.s * z.s, 'u1l8-term-not-sum', 'That is the first square only.'], [z.s * z.s * 4 / 3, 'u1l8-ratio', 'The areas halve: ' + t('r=\\frac{1}{2}') + ' (not ' + t('\\frac{1}{4}') + ').'], [z.s * z.s / 2, 'u1l8-div-r', t('S_\\infty=\\dfrac{t_1}{1-r}') + '.']] },
            t('t_1=' + z.s * z.s + ',\\ r=\\frac{1}{2}:\\quad S_\\infty=\\dfrac{' + z.s * z.s + '}{\\frac{1}{2}}=' + S) + ' cm²', ['The areas form an infinite geometric series with ' + t('r=\\frac{1}{2}') + '.'], 'total area of nested squares');
        } }] },
    { num: '14', parts: [{ id: '14', level: 'EMG', make: function (r) {
      var a = r.pick([2, 3, 4, 6, 8]), b = r.pick([12, 16, 20, 24, 40]), m = r.pick([5, 6, 7, 9]), fr = r.pick([[-3, 4], [-1, 2], [-2, 5], [-4, 5]]);
      var conv = first(b, Q(fr[0], fr[1]), 3);
      return mcP(r, 'Which infinite geometric series is convergent?', t(seriesTex(conv, { dec: true })),
        [{ html: t(seriesTex(first(a, qn(1.5), 3), { dec: true })), why: t('r=1.5\\ge 1') + ': divergent.' }, { html: t(m + '-' + m + '+' + m + '-\\cdots'), why: t('r=-1') + ': the partial sums jump between ' + t(m) + ' and ' + t('0') + '.' },
          { html: t(seriesTex(first(qn(0.1), 2, 3), { dec: true })), why: t('r=2') + ': divergent, even though the first terms are small.' }],
        t('r=' + qtex(Q(fr[0], fr[1]), { dec: true })) + ', which is between ' + t('-1') + ' and ' + t('1') + '. (The others: ' + t('r=1.5') + ', ' + t('r=-1') + ', ' + t('r=2') + '.)', ['Find ' + t('r') + ' for each.'], 'MC: which converges');
    } }] },
    { num: '15', parts: [{ id: '15', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { S: r.pick([12, 16, 20, 24, 30, 40, 48, 60]), f: r.pick([[3, 4], [2, 3], [4, 5], [3, 5], [5, 6]]) }; }, function (z) { return (z.S * z.f[0]) % z.f[1] === 0 && !(z.S === 48 && z.f[0] === 3 && z.f[1] === 4); });
      var t1 = z.S * z.f[0] / z.f[1], R = qs(1, Q(z.f[0], z.f[1]));
      return mcP(r, 'The sum to infinity of a geometric series is ' + t(z.S) + ' and its first term is ' + t(t1) + '. The common ratio is', t(qtex(R)),
        [{ html: t(qtex(Q(z.f[0], z.f[1]))), why: 'That is ' + t('1-r') + ', not ' + t('r') + '.' }, { html: t(qtex(Q(z.f[1], z.f[0]))), why: 'Solve ' + t(z.S + '=\\dfrac{' + t1 + '}{1-r}') + ': ' + t('1-r=\\dfrac{' + t1 + '}{' + z.S + '}') + '.' }, { html: t(qtex(qm(-1, R))), why: 'Check the sign: ' + t('r=1-' + qtex(Q(z.f[0], z.f[1]))) + '.' }],
        t(z.S + '=\\dfrac{' + t1 + '}{1-r}\\ \\Rightarrow\\ 1-r=\\dfrac{' + t1 + '}{' + z.S + '}=' + qtex(Q(z.f[0], z.f[1])) + '\\ \\Rightarrow\\ r=' + qtex(R)) + '.', ['Solve ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + ' for ' + t('r') + '.'], 'MC: r from S∞ and t₁');
    } }] },
    { num: '16', parts: [{ id: '16', level: 'ADV', make: function (r) {
      var k = r.pick([1, 1, 2, 3, 5]), ks = k === 1 ? '' : String(k);
      return mcP(r, 'For ' + t('x>1') + ', an expression for the sum to infinity of ' + t('\\dfrac{' + k + '}{x}+\\dfrac{' + k + '}{x^{2}}+\\dfrac{' + k + '}{x^{3}}+\\cdots') + ' is', t('\\dfrac{' + k + '}{x-1}'),
        [{ html: t('\\dfrac{' + ks + 'x}{x-1}'), why: 'That uses ' + t('t_1=' + k) + '. The first term is ' + t('\\dfrac{' + k + '}{x}') + '.' }, { html: t('\\dfrac{' + k + '}{1-x}'), why: 'Simplify ' + t('1-\\dfrac{1}{x}=\\dfrac{x-1}{x}') + ' carefully.' }, { html: t(k === 1 ? 'x-1' : '\\dfrac{x-1}{' + k + '}'), why: 'That is upside down. ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + '.' }],
        t('t_1=\\dfrac{' + k + '}{x},\\ r=\\dfrac{1}{x}') + '. ' + t('S_\\infty=\\dfrac{\\frac{' + k + '}{x}}{1-\\frac{1}{x}}=\\dfrac{\\frac{' + k + '}{x}}{\\frac{x-1}{x}}=\\dfrac{' + k + '}{x-1}') + '.', ['Find ' + t('t_1') + ' and ' + t('r') + ' in terms of ' + t('x') + '.'], 'MC: S∞ in terms of x');
    } }] },
    { num: '17', parts: [{ id: '17', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { r: r.pick([0.4, 0.2, 0.5, 0.6, 0.3]), S: r.pick([25, 50, 75, 100, 40, 60, 80, 125]) }; }, function (z) { var t1 = z.S * (1 - z.r), t3 = t1 * z.r * z.r; return !(z.r === 0.4 && z.S === 75) && Math.abs(t3 * 10 - Math.round(t3 * 10)) < 1e-6 && t3 < 999 && t3 >= 1; });
      var t1 = L.cl(z.S * (1 - z.r)), t3 = L.cl(t1 * z.r * z.r);
      return nrP('An infinite geometric series has ' + t('r=' + nT(z.r)) + ' and ' + t('S_\\infty=' + z.S) + '. The value of ' + t('t_3') + ', to the nearest tenth, is _____.', t3, { dp: 1, cands: [[t1, 'u1l8-term-not-sum', 'That is ' + t('t_1') + '. Then ' + t('t_3=t_1r^{2}') + '.'], [L.cl(t1 * z.r), 'u1l7-day-off', 'That is ' + t('t_2') + '.'], [L.cl(z.S * (1 + z.r) * z.r * z.r), 'u1l8-one-plus-r', t('t_1=S_\\infty(1-r)') + '.']] },
        t('t_1=' + z.S + '(1-' + nT(z.r) + ')=' + nT(t1)) + '. ' + t('t_3=' + nT(t1) + '(' + nT(z.r) + ')^{2}=' + nT(t3)), ['Find ' + t('t_1') + ' first, then ' + t('t_3=t_1r^{2}') + '.'], 'NR: t₃ from r and S∞');
    } }] },
    { num: '18', parts: [{ id: '18', level: 'PRG', make: function (r) {
      var b = pickWhere(function () { return r.int(12, 96); }, function (b) { return b % 11 !== 0 && L.gcd(b, 99) > 1 && b !== 24; });
      var fr = Q(b, 99);
      return nrP('When ' + t('0.\\overline{' + b + '}') + ' is written as a fraction ' + t('\\dfrac{a}{b}') + ' in lowest terms, the value of ' + t('a+b') + ' is _____.', fr[0] + fr[1], { cands: [[b + 99, 'lowest', t('\\dfrac{' + b + '}{99}') + ' is not in lowest terms yet: divide the top and bottom by ' + t(L.gcd(b, 99)) + '.'], [b + 100, 'u1l8-not-rep', t('0.\\overline{' + b + '}') + ' is not ' + t('\\dfrac{' + b + '}{100}') + ': use ' + t('r=0.01') + '.']] },
        t('0.' + b + '+0.00' + b + '+\\cdots=\\dfrac{0.' + b + '}{0.99}=\\dfrac{' + b + '}{99}=\\dfrac{' + fr[0] + '}{' + fr[1] + '}') + '. ' + t('a+b=' + fr[0] + '+' + fr[1] + '=' + (fr[0] + fr[1])), ['Two digits repeat: ' + t('r=0.01') + '. Reduce the fraction.'], 'NR: repeating decimal');
    } }] }
  ];

  /* =========================== Extra practice 8 =========================== */
  var EXTRA = [
    { num: '1', section: 'A. Skills', stem: 'Determine ' + t('r') + ' and state whether each series is convergent or divergent. Calculate ' + t('S_\\infty') + ' where it exists (press <b>none</b> if it doesn’t).', parts: [
      { id: 'e1a', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { t1: r.pick([40, 60, 80, 100, 120, 160, 200, 240]), q: r.pick([2, 2, 4]) }; }, function (z) { return !(z.t1 === 120 && z.q === 2) && (z.t1 % (z.q * z.q) === 0); }); var R = Q(1, z.q); return classifyP(first(z.t1, R, 3), z.t1, R, 'classify (extra): r = 1/q'); } },
      { id: 'e1b', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { p: r.int(1, 3), q: r.int(2, 4), m: r.int(1, 4) }; }, function (z) { return z.p < z.q && L.gcd(z.p, z.q) === 1 && !(z.p === 2 && z.q === 3 && z.m === 1); }); var t1 = z.m * z.q * z.q, R = Q(-z.p, z.q); return classifyP(first(t1, R, 3), t1, R, 'classify (extra): negative fraction r'); } },
      { id: 'e1c', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { d: r.pick([8, 9, 16, 27, 4]), r: r.int(2, 3) }; }, function (z) { return !(z.d === 8 && z.r === 2); }); var t1 = Q(1, z.d); return classifyP(first(t1, z.r, 3), t1, qn(z.r), 'classify (extra): fractions, r > 1'); } },
      { id: 'e1d', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { t1: r.pick([100, 500, 2000, 3000, 900]), r: 0.1 }; }, function (z) { return z.t1 !== 1000; }); return classifyP(first(z.t1, Q(1, 10), 3), z.t1, Q(1, 10), 'classify (extra): r = 0.1', { dec: true }); } },
      { id: 'e1e', level: 'EMG', make: function (r) { var a = r.pick([2, 3, 4, 6, 7, 8]) * r.pick([1, -1]); return classifyP([qn(a), qn(-a), qn(a)], qn(a), [-1, 1], 'classify (extra): r = −1'); } },
      { id: 'e1f', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { t1: r.pick([0.5, 0.4, 1.5, 2.5, 0.8]), r: r.pick([0.8, 0.6, 0.4]) }; }, function (z) { return !(z.t1 === 0.6 && z.r === 0.8); }); var R = qn(z.r); return classifyP(first(qn(z.t1), R, 3), qn(z.t1), R, 'classify (extra): decimals', { dec: true }); } }] },
    { num: '2', stem: 'Write each repeating decimal as a fraction in lowest terms, using an infinite geometric series.', parts: [
      { id: 'e2a', level: 'BEG', make: function (r) { return repP(r, 0, '', String(r.pick([1, 4, 5, 7, 8])), 'repeating 0.d (extra)'); } },
      { id: 'e2b', level: 'EMG', make: function (r) { var b = pickWhere(function () { return r.int(12, 98); }, function (b) { return b % 11 !== 0 && b !== 81 && L.gcd(b, 99) > 1; }); return repP(r, 0, '', String(b), 'repeating 0.ab (extra)'); } },
      { id: 'e2c', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { w: r.int(1, 6), d: r.pick([1, 2, 3, 4, 5, 6, 7, 8]) }; }, function (z) { return !(z.w === 3 && z.d === 6); }); return repP(r, z.w, '', String(z.d), 'repeating w.d (extra)'); } },
      { id: 'e2d', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { a: r.int(1, 9), d: r.int(1, 9) }; }, function (z) { return z.a !== z.d && !(z.a === 8 && z.d === 3); }); return repP(r, 0, String(z.a), String(z.d), 'repeating 0.a(b) (extra)'); } }] },
    { num: '3', stem: 'Each part describes an infinite geometric series. Determine the missing value.', parts: [
      { id: 'e3a', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { t1: r.pick([10, 12, 15, 20, 24, 30]), r: r.pick([-0.25, -0.5, 0.5, 0.25, -0.2, 0.2]) }; }, function (z) { return !(z.t1 === 15 && z.r === -0.25); });
        var R = qn(z.r), S = sinf(z.t1, R);
        return exactP(t('t_1=' + z.t1 + ',\\ r=' + nT(z.r)) + '; find ' + t('S_\\infty') + '.', S, { dp: 2, cands: sinfCands(z.t1, R) }, t(sinfLine(z.t1, R)), [t('S_\\infty=\\dfrac{t_1}{1-r}') + '.'], 'S∞ from t₁ and r');
      } },
      { id: 'e3b', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { S: r.pick([20, 30, 40, 50, 80, 25]), r: r.pick([0.6, 0.4, 0.2, 0.75, 0.3]) }; }, function (z) { return !(z.S === 40 && z.r === 0.6); });
        var t1 = qm(z.S, qs(1, qn(z.r)));
        return exactP(t('S_\\infty=' + z.S + ',\\ r=' + nT(z.r)) + '; find ' + t('t_1') + '.', t1, { cands: [[qm(z.S, qa(1, qn(z.r))), 'u1l8-one-plus-r', t('t_1=S_\\infty(1-r)') + '.'], [qm(z.S, qn(z.r)), 'u1l8-1-minus-r', 'Multiply by ' + t('1-r') + ', not by ' + t('r') + '.']] },
          t('t_1=S_\\infty(1-r)=' + z.S + '(' + nT(1 - z.r) + ')=' + qtex(t1, { dec: true })), [t('t_1=S_\\infty(1-r)') + '.'], 't₁ from S∞ and r (extra)');
      } },
      { id: 'e3c', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { S: r.pick([10, 12, 18, 20, 24, 30]), f: r.pick([1.5, 1.25, 0.75, 0.5, 1.2]) }; }, function (z) { return Number.isInteger(z.S * z.f) && !(z.S === 18 && z.f === 1.5); });
        var t1 = z.S * z.f, R = qs(1, Q(t1, z.S));
        return exactP(t('t_1=' + t1 + ',\\ S_\\infty=' + z.S) + '; find ' + t('r') + '.', R, { cands: [[Q(t1, z.S), 'u1l8-1-minus-r', 'That is ' + t('1-r') + '.'], [qm(-1, R), 'sign', 'Check the sign.']] },
          t('1-r=\\dfrac{' + t1 + '}{' + z.S + '}=' + nT(z.f) + '\\ \\Rightarrow\\ r=' + qtex(R, { dec: true })), ['Solve ' + t(z.S + '(1-r)=' + t1) + '.'], 'r from t₁ and S∞ (extra)');
      } }] },
    { num: '4', shared: function (r) { return pickWhere(function () { return { t1: r.pick([20, 40, 60, 80, 100, 30]), r: r.pick([0.5, 0.5, 0.25]) }; }, function (z) { return !(z.t1 === 50 && z.r === 0.5); }); },
      stem: function (z) { return 'Consider the series ' + t(seriesTex(first(z.t1, qn(z.r), 3), { dec: true })) + '.'; }, parts: [
        { id: 'e4a', level: 'BEG', make: function (r, z) {
          var S = [], s = 0; for (var i = 0; i < 6; i++) { s += z.t1 * Math.pow(z.r, i); S.push(L.cl(s)); }
          return fieldsP('Write the first six partial sums.', S.map(function (x, i) { return fNum(t('S_{' + (i + 1) + '}='), x, { cands: i ? [[L.cl(z.t1 * Math.pow(z.r, i)), 'u1l8-gave-terms', 'That is ' + t('t_{' + (i + 1) + '}') + '. Add it to ' + t('S_{' + i + '}') + '.']] : [] }); }),
            t(S.map(nT).join(',\\ ')), t(S.map(nT).join(',\\ ')), ['Add one term at a time.'], 'six partial sums');
        } },
        { id: 'e4b', level: 'EMG', make: function (r, z) {
          var S = sinf(z.t1, qn(z.r));
          return exactP('What value do the partial sums approach? (Confirm with the formula.)', S, { cands: sinfCands(z.t1, qn(z.r)) }, 'They approach ' + t(qtex(S)) + '. ' + t(sinfLine(z.t1, qn(z.r))), ['Use ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + '.'], 'value the partial sums approach');
        } }] },
    { num: '5', section: 'B. Applying', parts: [{ id: 'e5', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { var pq = r.pick([[2, 3], [3, 4], [1, 2], [3, 5]]); return { h: r.int(3, 20), p: pq[0], q: pq[1] }; }, function (z) { return !(z.h === 12 && z.p === 2 && z.q === 3) && !(z.h === 9 && z.p === 3 && z.q === 5); });
      var p = z.p / z.q, B = ballForever(z.h, p, '\\frac{' + z.p + '}{' + z.q + '}'), V = Q(z.h * (z.q + z.p), z.q - z.p);
      return exactP('A ball is dropped from a height of ' + t(z.h) + ' m. Each bounce reaches ' + t('\\frac{' + z.p + '}{' + z.q + '}') + ' of the height it fell from. If it keeps bouncing forever, what total vertical distance does it travel?', V, { after: 'm', dp: 2, cands: B.cands.map(function (c) { return [qn(K.roundTo(c[0], 9)), c[1], c[2]]; }) }, B.sol, HB, 'ball forever (extra)');
    } }] },
    { num: '6', parts: [{ id: 'e6', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { return { q: r.pick([2, 3, 3, 4]), c: r.int(1, 6) }; }, function (z) { return !(z.q === 3 && z.c === 2); });
      var t3 = z.c * z.q * z.q, t5 = Q(t3, z.q * z.q), t1 = t3 * z.q * z.q, Rp = Q(1, z.q), Rn = Q(-1, z.q), Sp = sinf(t1, Rp), Sn = sinf(t1, Rn);
      return fieldsP('In an infinite geometric series, ' + t('t_3=' + t3) + ' and ' + t('t_5=' + qtex(t5)) + '. Determine ' + t('S_\\infty') + ' for each of the two possible series.',
        [fNum(t('r=' + qtex(Rp) + ':\\ S_\\infty='), Sp, { dp: 2, cands: sinfCands(t1, Rp).concat([[sinf(t3, Rp), 'u1l8-t1-not-t2', t(t3) + ' is ' + t('t_3') + '. Find ' + t('t_1=\\dfrac{t_3}{r^{2}}') + ' first.']]), name: 'S∞ (r > 0)' }),
          fNum(t('r=' + qtex(Rn) + ':\\ S_\\infty='), Sn, { dp: 2, cands: sinfCands(t1, Rn).concat([[Sp, 'u1l8-one-series', 'That is the series with the positive ratio. The other has ' + t('r=' + qtex(Rn)) + '.'], [sinf(t3, Rn), 'u1l8-t1-not-t2', 'Find ' + t('t_1') + ' first (the same for both series).']]), name: 'S∞ (r < 0)' })],
        t('S_\\infty=' + qtex(Sp) + '\\ \\text{and}\\ ' + qtex(Sn)), t(t3 + 'r^{2}=' + qtex(t5) + '\\ \\Rightarrow\\ r^{2}=' + qtex(Q(1, z.q * z.q)) + '\\ \\Rightarrow\\ r=\\pm' + qtex(Rp)) + '. Either way ' + t('t_1=\\dfrac{' + t3 + '}{r^{2}}=' + t1) + '.<br>' + t('r=' + qtex(Rp) + ':\\ ' + sinfLine(t1, Rp)) + '<br>' + t('r=' + qtex(Rn) + ':\\ ' + sinfLine(t1, Rn)),
        ['From ' + t('t_3') + ' to ' + t('t_5') + ' is 2 steps: ' + t('r^{2}=\\dfrac{t_5}{t_3}') + '.'], 'two S∞ from t₃ and t₅');
    } }] },
    { num: '7', shared: function (r) { return pickWhere(function () { return { A: r.pick([10000, 20000, 25000, 30000, 15000, 40000]), p: r.pick([0.9, 0.8, 0.85, 0.75, 0.95]), k: r.int(6, 9) }; }, function (z) { return !(z.A === 25000 && z.p === 0.9); }); },
      stem: function (z) { return 'A yearly fundraiser raised ' + t('\\$' + F(z.A)) + ' in its first year. Each year after that it raised ' + t(Math.round(z.p * 100) + '\\%') + ' of the year before.'; }, parts: [
        { id: 'e7a', level: 'EMG', make: function (r, z) { var x = z.A * Math.pow(z.p, z.k - 1); return roundP('How much did it raise in year ' + t(z.k) + ' (to the nearest cent)?', x, 2, { before: '$', cands: [[z.A * Math.pow(z.p, z.k), 'u1l7-day-off', 'Year ' + t(z.k) + ' is ' + t('t_1r^{' + (z.k - 1) + '}') + '.'], [z.A * (1 - Math.pow(z.p, z.k)) / (1 - z.p), 'u1l8-term-not-sum', 'That is the total. The question asks for year ' + t(z.k) + ' only.']] }, t('t_{' + z.k + '}=' + F(z.A) + '(' + nT(z.p) + ')^{' + (z.k - 1) + '}\\approx ' + money(x)), [t('r=' + nT(z.p)) + '.'], 'amount in year k'); } },
        { id: 'e7b', level: 'PRG', make: function (r, z) { var x = z.A * (1 - Math.pow(z.p, z.k)) / (1 - z.p); return roundP('How much did it raise in total in the first ' + t(z.k) + ' years (to the nearest cent)?', x, 2, { before: '$', cands: [[z.A * Math.pow(z.p, z.k - 1), 'u1l8-term-not-sum', 'That is year ' + t(z.k) + ' only.'], [z.A / (1 - z.p), 'u1l8-term-not-sum', 'That is the total forever.']] }, t('S_{' + z.k + '}=\\dfrac{' + F(z.A) + '(1-' + nT(z.p) + '^{' + z.k + '})}{' + nT(1 - z.p) + '}\\approx ' + money(x)), [t('S_n=\\dfrac{t_1(1-r^n)}{1-r}') + '.'], 'total in k years'); } },
        { id: 'e7c', level: 'PRG', make: function (r, z) { var S = qd(z.A, qs(1, qn(z.p))); return exactP('What is the greatest total it could ever raise if the pattern continued?', S, { before: '$', money: true, dp: 2, cands: sinfCands(z.A, qn(z.p)) }, t('S_\\infty=\\dfrac{' + F(z.A) + '}{' + nT(1 - z.p) + '}' + (terminates(S) ? '=' + money(qv(S)) : '\\approx ' + money(qv(S)))), [t('S_\\infty=\\dfrac{t_1}{1-r}') + '.'], 'greatest total'); } }] },
    { num: '8', shared: function (r) { return pickWhere(function () { return { a: r.pick([2, 3, 4, 5, 6]), c: r.pick([1, 2, -1, -2, 3]), x0: r.pick([[-1, 2], [1, 2], [-1, 4], [1, 4], [-3, 4]]) }; }, function (z) {
        var R = qa(Q(z.x0[0], z.x0[1]), z.c); return conv(R) && !qeq(R, 0) && !(z.a === 4 && z.c === 1); }); },
      stem: function (z) { var e = 'x' + (z.c < 0 ? '-' + (-z.c) : '+' + z.c); return 'Consider the infinite geometric series ' + t(z.a + '+' + z.a + '(' + e + ')+' + z.a + '(' + e + ')^{2}+\\cdots') + '.'; }, parts: [
        { id: 'e8a', level: 'ADV', make: function (r, z) {
          var e = 'x' + (z.c < 0 ? '-' + (-z.c) : '+' + z.c), lo = Q(-1 - z.c, 1), hi = Q(1 - z.c, 1);
          return G.ineqP('For what values of ' + t('x') + ' does the series converge? (Type a double inequality.)', lo, hi, 'x', t('r=' + e) + ': ' + t('-1<' + e + '<1\\ \\Rightarrow\\ ' + qtex(lo) + '<x<' + qtex(hi)),
            ['The ratio is ' + t('r=' + e) + '.', (z.c < 0 ? 'Add ' + t(-z.c) : 'Subtract ' + t(z.c)) + ' on all three parts of ' + t('-1<' + e + '<1') + '.'], 'interval of convergence (extra)', { cands: [[-1 + z.c, 1 + z.c, 'u1l8-ineq', (z.c < 0 ? 'Add ' + t(-z.c) : 'Subtract ' + t(z.c)) + ' on all three parts — not the opposite.']] });
        } },
        { id: 'e8b', level: 'PRG', make: function (r, z) {
          var x0 = Q(z.x0[0], z.x0[1]), R = qa(x0, z.c), S = sinf(z.a, R);
          return exactP('Determine ' + t('S_\\infty') + ' when ' + t('x=' + qtex(x0, { dec: true })) + '.', S, { dp: 2, cands: sinfCands(z.a, R) },
            t('r=' + qtex(x0, { dec: true }) + (z.c < 0 ? '-' + (-z.c) : '+' + z.c) + '=' + qtex(R, { dec: true })) + ': ' + t(sinfLine(z.a, R)), ['Find ' + t('r') + ' at this ' + t('x') + '; ' + t('t_1=' + z.a) + '.'], 'S∞ at a value of x (extra)');
        } }] },
    { num: '9', parts: [{ id: 'e9', level: 'EMG', make: function (r) {
      var b = pickWhere(function () { return r.int(12, 96); }, function (b) { return b % 11 !== 0 && L.gcd(b, 99) > 1 && b !== 18 && b % 10 !== 0; });
      var fr = Q(b, 99), d100 = Q(b, 100), d999 = Q(b, 999), d90 = Q(b, 90);
      return mcP(r, 'The repeating decimal ' + t('0.\\overline{' + b + '}') + ' written as a fraction in lowest terms is', t(qtex(fr)),
        [{ html: t(qtex(d100)), why: 'That is ' + t('0.' + b) + ' exactly — it stops. The digits ' + t(b) + ' repeat: ' + t('r=0.01') + '.' }, { html: t(qtex(d999)), why: 'That is ' + t('0.\\overline{0' + b + '}') + ' (a 3-digit block).' }, { html: t(qtex(d90)), why: 'A 2-digit block repeats, so divide by ' + t('0.99') + ', not ' + t('0.9') + '.' }, { html: t('\\frac{' + b + '}{99}'), why: 'Reduce it to lowest terms.' }],
        t('\\dfrac{0.' + b + '}{0.99}=\\dfrac{' + b + '}{99}=' + qtex(fr)) + '.', ['Two digits repeat: ' + t('r=0.01') + '.'], 'MC: repeating decimal');
    } }] },
    { num: '10', parts: [{ id: 'e10', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { t1: r.int(5, 40), S: r.int(10, 60) }; }, function (z) { var rr = 1 - z.t1 / z.S; return z.t1 < z.S && Math.abs(rr * 10 - Math.round(rr * 10)) < 1e-9 && rr > 0 && !(z.t1 === 21 && z.S === 30); });
      var rr = L.cl(1 - z.t1 / z.S);
      return nrP('An infinite geometric series has first term ' + t(z.t1) + ' and sum to infinity ' + t(z.S) + '. The common ratio, to the nearest tenth, is _____.', rr, { dp: 1, cands: [[L.cl(z.t1 / z.S), 'u1l8-1-minus-r', 'That is ' + t('1-r') + '. Now find ' + t('r') + '.']] },
        t(z.S + '=\\dfrac{' + z.t1 + '}{1-r}\\ \\Rightarrow\\ 1-r=' + nT(L.cl(z.t1 / z.S)) + '\\ \\Rightarrow\\ r=' + nT(rr)), ['Solve ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + ' for ' + t('r') + '.'], 'NR: r from t₁ and S∞');
    } }] },
    { num: '11', section: 'C. Stretch', shared: function (r) { return pickWhere(function () { var k = r.pick([2, 3, 4, 5, 1.5, 2.5]); return { k: k, t2: r.int(2, 12) }; }, function (z) { var R = qs(1, qd(1, qn(z.k))); var t1 = qd(z.t2, R); return !(z.k === 3 && z.t2 === 8) && qv(t1) === Math.round(qv(t1) * 10) / 10; }); },
      stem: function (z) { return 'The sum to infinity of a geometric series is ' + t(nT(z.k)) + ' times its first term.'; }, parts: [
        { id: 'e11a', level: 'ADV', make: function (r, z) { var R = qs(1, qd(1, qn(z.k))); return exactP('Determine ' + t('r') + '.', R, { cands: [[qd(1, qn(z.k)), 'u1l8-1-minus-r', 'That is ' + t('1-r') + '.'], [qn(z.k), 'u1l8-r-invalid', 'Divide both sides by ' + t('t_1') + ': ' + t('\\dfrac{1}{1-r}=' + nT(z.k)) + '.']] }, t('\\dfrac{t_1}{1-r}=' + nT(z.k) + 't_1\\ \\Rightarrow\\ 1=' + nT(z.k) + '(1-r)\\ \\Rightarrow\\ 1-r=' + qtex(qd(1, qn(z.k))) + '\\ \\Rightarrow\\ r=' + qtex(R)), ['Write ' + t('\\dfrac{t_1}{1-r}=' + nT(z.k) + 't_1') + ' and divide by ' + t('t_1') + '.'], 'r when S∞ = k·t₁'); } },
        { id: 'e11b', level: 'ADV', make: function (r, z) { var R = qs(1, qd(1, qn(z.k))), t1 = qd(z.t2, R), S = qm(t1, qn(z.k)); return exactP('If ' + t('t_2=' + z.t2) + ', determine ' + t('S_\\infty') + '.', S, { dp: 2, cands: [[qm(z.t2, qn(z.k)), 'u1l8-t1-not-t2', t(z.t2) + ' is ' + t('t_2') + '. Find ' + t('t_1=t_2\\div r') + ' first.']] }, t('t_1=' + z.t2 + '\\div ' + qtex(R) + '=' + qtex(t1)) + '. ' + t('S_\\infty=' + nT(z.k) + '(' + qtex(t1) + ')=' + qtex(S)), ['Find ' + t('t_1=t_2\\div r') + ', then ' + t('S_\\infty=' + nT(z.k) + 't_1') + '.'], 'S∞ from t₂'); } }] },
    { num: '12', parts: [{ id: 'e12', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { var pq = r.pick([[2, 3], [1, 2], [1, 3], [3, 4], [2, 5], [3, 5]]); return { p: pq[0], q: pq[1], S: r.int(2, 30) }; }, function (z) { var t1 = z.S * (z.q - z.p) / z.q; return Number.isInteger(t1) && Number.isInteger(z.S * (z.q + z.p) / z.q) && !(z.S === 9 && z.p === 2 && z.q === 3); });
      var Rp = Q(z.p, z.q), Rn = Q(-z.p, z.q), t1p = qm(z.S, qs(1, Rp)), t1n = qm(z.S, qs(1, Rn)), S2 = qm(t1p, qa(1, Rp));
      return fieldsP('An infinite geometric series has ' + t('S_\\infty=' + z.S) + ', and the sum of its first two terms is ' + t(qtex(S2)) + '. Determine the two possible values of ' + t('r') + ' and the first term of each series.',
        [fNum(t('r='), Rp, { name: 'r (positive)', math: true }), fNum(t('t_1='), t1p, { name: 't₁ (r > 0)' }), fNum(t('r='), Rn, { name: 'r (negative)', math: true, cands: [[Rp, 'u1l8-r-sign', t('r^{2}=' + qtex(qm(Rp, Rp))) + ' has a negative solution too.']] }), fNum(t('t_1='), t1n, { name: 't₁ (r < 0)' })],
        t('r=' + qtex(Rp) + ',\\ t_1=' + qtex(t1p) + ';\\ r=' + qtex(Rn) + ',\\ t_1=' + qtex(t1n)),
        t('t_1=' + z.S + '(1-r)') + ' and ' + t('t_1+t_1r=t_1(1+r)=' + qtex(S2)) + '.<br>' + t(z.S + '(1-r)(1+r)=' + qtex(S2) + '\\ \\Rightarrow\\ 1-r^{2}=' + qtex(qd(S2, z.S)) + '\\ \\Rightarrow\\ r^{2}=' + qtex(qm(Rp, Rp)) + '\\ \\Rightarrow\\ r=\\pm' + qtex(Rp)) + '<br>' +
          t('r=' + qtex(Rp)) + ': ' + t('t_1=' + qtex(t1p)) + ', series ' + t(seriesTex(first(t1p, Rp, 3))) + '. ' + t('r=' + qtex(Rn)) + ': ' + t('t_1=' + qtex(t1n)) + ', series ' + t(seriesTex(first(t1n, Rn, 3))) + '.',
        ['Write ' + t('t_1') + ' in terms of ' + t('r') + ' from ' + t('S_\\infty') + ', and substitute into ' + t('t_1(1+r)') + '.', t('(1-r)(1+r)=1-r^{2}') + '.'], 'two series from S∞ and S₂');
    } }] },
    { num: '13', parts: [{ id: 'e13', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { q: r.pick([2, 3, 4, 5]), m: r.int(1, 12) }; }, function (z) { var odd = z.m * z.q * z.q; return !(z.q === 3 && odd === 36) && odd <= 200; });
      var R = Q(1, z.q), odd = z.m * z.q * z.q, even = z.m * z.q, t1 = qm(odd, qs(1, qm(R, R))), S = odd + even;
      return fieldsP('In an infinite geometric series, the odd-numbered terms (' + t('t_1+t_3+t_5+\\cdots') + ') add to ' + t(odd) + ' and the even-numbered terms (' + t('t_2+t_4+t_6+\\cdots') + ') add to ' + t(even) + '. Determine ' + t('r') + ', ' + t('t_1') + ' and ' + t('S_\\infty') + '.',
        [fNum(t('r='), R, { math: true, cands: [[Q(z.q, 1), 'flip', 'Each even term is ' + t('r') + ' times the odd term before it: ' + t('r=\\dfrac{' + even + '}{' + odd + '}') + '.']] }), fNum(t('t_1='), t1, { cands: [[qm(odd, qs(1, R)), 'u1l8-ratio', 'The odd terms alone have ratio ' + t('r^{2}') + ', not ' + t('r') + '.'], [odd, 'u1l8-term-not-sum', t(odd) + ' is the sum of the odd terms, not ' + t('t_1') + '.']] }), fNum(t('S_\\infty='), [S, 1])],
        t('r=' + qtex(R) + ',\\ t_1=' + qtex(t1) + ',\\ S_\\infty=' + S), 'Each even term is ' + t('r') + ' times the odd term before it, so ' + t('r=\\dfrac{' + even + '}{' + odd + '}=' + qtex(R)) + '.<br>The odd terms form a series with first term ' + t('t_1') + ' and ratio ' + t('r^{2}=' + qtex(qm(R, R))) + ': ' + t('\\dfrac{t_1}{1-' + qtex(qm(R, R)) + '}=' + odd + '\\ \\Rightarrow\\ t_1=' + qtex(t1)) + '.<br>' + t('S_\\infty=' + odd + '+' + even + '=' + S) + ' (check: ' + t(sinfLine(t1, R)) + ').',
        ['Compare ' + t('t_2+t_4+\\cdots') + ' with ' + t('t_1+t_3+\\cdots') + ': each term is ' + t('r') + ' times the one in the other list.', 'The odd terms are a geometric series with ratio ' + t('r^{2}') + '.'], 'odd and even terms');
    } }] }
  ];

  HW.defineLesson({ id: LID, unit: 1, num: '8', title: 'Infinite Geometric Series', outcome: 'RF10', questions: QUESTIONS, extra: EXTRA });
})(window);
