/* The Math 20-1 outcomes in the official wording (Alberta Education, Mathematics 10–12 Program of Studies, 2008, updated
 * 2016: Mathematics 20-1), and a small pop-out: any element with data-outcome="AN1" shows the outcome's wording when tapped.
 * HW.GENERAL_OUTCOME gives each strand's general outcome; HW.OUTCOME_TEXT each specific outcome. */
(function (root) {
  'use strict';
  var HW = root.HW = root.HW || {};
  var AN = 'Algebra and Number', T = 'Trigonometry', RF = 'Relations and Functions';
  HW.GENERAL_OUTCOME = {
    AN: 'Develop algebraic reasoning and number sense.',
    T: 'Develop trigonometric reasoning.',
    RF: 'Develop algebraic and graphical reasoning through the study of relations.'
  };
  var LIM = '(limited to numerators and denominators that are monomials, binomials or trinomials).';
  var CHAR = ['vertex', 'domain and range', 'direction of opening', 'axis of symmetry', '<i>x</i>- and <i>y</i>-intercepts'];
  HW.OUTCOME_TEXT = {
    AN1: { strand: AN, text: 'Demonstrate an understanding of the absolute value of real numbers.' },
    AN2: { strand: AN, text: 'Solve problems that involve operations on radicals and radical expressions with numerical and variable radicands.' },
    AN3: { strand: AN, text: 'Solve problems that involve radical equations (limited to square roots).' },
    AN4: { strand: AN, text: 'Determine equivalent forms of rational expressions ' + LIM },
    AN5: { strand: AN, text: 'Perform operations on rational expressions ' + LIM },
    AN6: { strand: AN, text: 'Solve problems that involve rational equations ' + LIM },
    T1: { strand: T, text: 'Demonstrate an understanding of angles in standard position [0° to 360°].' },
    T2: { strand: T, text: 'Solve problems, using the three primary trigonometric ratios for angles from 0° to 360° in standard position.' },
    T3: { strand: T, text: 'Solve problems, using the cosine law and sine law, including the ambiguous case.' },
    RF1: { strand: RF, text: 'Factor polynomial expressions of the form:', list: ['<i>ax</i><sup>2</sup> + <i>bx</i> + <i>c</i>, <i>a</i> ≠ 0',
      '<i>a</i><sup>2</sup><i>x</i><sup>2</sup> – <i>b</i><sup>2</sup><i>y</i><sup>2</sup>, <i>a</i> ≠ 0, <i>b</i> ≠ 0',
      '<i>a</i>(<i>f</i>(<i>x</i>))<sup>2</sup> + <i>b</i>(<i>f</i>(<i>x</i>)) + <i>c</i>, <i>a</i> ≠ 0',
      '<i>a</i><sup>2</sup>(<i>f</i>(<i>x</i>))<sup>2</sup> – <i>b</i><sup>2</sup>(<i>g</i>(<i>y</i>))<sup>2</sup>, <i>a</i> ≠ 0, <i>b</i> ≠ 0'],
      after: 'where <i>a</i>, <i>b</i> and <i>c</i> are rational numbers.' },
    RF2: { strand: RF, text: 'Graph and analyze absolute value functions (limited to linear and quadratic functions) to solve problems.' },
    RF3: { strand: RF, text: 'Analyze quadratic functions of the form <i>y</i> = <i>a</i>(<i>x</i> – <i>p</i>)<sup>2</sup> + <i>q</i> and determine the:', list: CHAR },
    RF4: { strand: RF, text: 'Analyze quadratic functions of the form <i>y</i> = <i>ax</i><sup>2</sup> + <i>bx</i> + <i>c</i> to identify characteristics of the corresponding graph, including:', list: CHAR, after: 'and to solve problems.' },
    RF5: { strand: RF, text: 'Solve problems that involve quadratic equations.' },
    RF6: { strand: RF, text: 'Solve, algebraically and graphically, problems that involve systems of linear-quadratic and quadratic-quadratic equations in two variables.' },
    RF7: { strand: RF, text: 'Solve problems that involve linear and quadratic inequalities in two variables.' },
    RF8: { strand: RF, text: 'Solve problems that involve quadratic inequalities in one variable.' },
    RF9: { strand: RF, text: 'Analyze arithmetic sequences and series to solve problems.' },
    RF10: { strand: RF, text: 'Analyze geometric sequences and series to solve problems.' },
    RF11: { strand: RF, text: 'Graph and analyze reciprocal functions (limited to the reciprocal of linear and quadratic functions).' }
  };

  var pop = null, anchor = null;
  function close() { if (pop) { pop.remove(); pop = null; anchor = null; } }
  HW.showOutcome = function (code, el) {
    var o = HW.OUTCOME_TEXT[code]; if (!o) return;
    if (pop && anchor === el) { close(); return; }
    close(); anchor = el;
    pop = document.createElement('div'); pop.className = 'oc-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Outcome ' + code);
    pop.innerHTML = '<div class="oc-h"><b>' + code + '</b><span>' + o.strand + ' · Specific outcome ' + code.replace(/\D/g, '') + '</span>' +
      '<button type="button" class="oc-x" aria-label="Close">×</button></div>' +
      '<p class="oc-t">' + o.text + '</p>' + (o.list ? '<ul class="oc-l">' + o.list.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '') +
      (o.after ? '<p class="oc-t">' + o.after + '</p>' : '') + (HW.GENERAL_OUTCOME[code.replace(/\d+$/, '')] ? '<div class="oc-src">General outcome: ' + HW.GENERAL_OUTCOME[code.replace(/\d+$/, '')] + '</div>' : '') + '<div class="oc-src">Alberta Education, Mathematics 20-1 Program of Studies</div>';
    document.body.appendChild(pop);
    pop.querySelector('.oc-x').addEventListener('click', close);
    var r = el.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight, vw = document.documentElement.clientWidth;
    var x = Math.max(8, Math.min(vw - w - 8, r.left)), y = r.bottom + 8;
    if (y + h > window.innerHeight - 8 && r.top - h - 8 > 8) y = r.top - h - 8;
    pop.style.left = x + window.scrollX + 'px'; pop.style.top = y + window.scrollY + 'px';
  };
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-outcome]');
    if (t && HW.OUTCOME_TEXT[t.dataset.outcome]) { e.preventDefault(); e.stopPropagation(); HW.showOutcome(t.dataset.outcome, t); return; }
    if (pop && !pop.contains(e.target)) close();
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  root.addEventListener('scroll', function () { if (pop && anchor && !anchor.isConnected) close(); }, { passive: true });
  root.addEventListener('hashchange', close);
})(window);
