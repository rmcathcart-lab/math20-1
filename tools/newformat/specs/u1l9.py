from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

seq = lambda k, s: f'<div><b>{k}</b>{T(s)}</div>'

SPEC = dict(
    warm=dict(
        title='Which One Doesn’t Belong?',
        ask='Which one doesn’t belong? Be ready to say why.',
        body=('<div class="vw-wodb">'
              + seq('A', r'3,\ 6,\ 12,\ 24,\ \dots')
              + seq('B', r'5,\ 8,\ 11,\ 14,\ \dots')
              + seq('C', r'1,\ 4,\ 9,\ 16,\ \dots')
              + seq('D', r'32,\ 16,\ 8,\ 4,\ \dots')
              + '</div>'),
        strip=strip(sb('🍎', 110, 0, 36), sb('🍎', 165, .25, 36), sb('🍎', 220, .5, 36), srock('🍐', 280, 14, 1.6, 38)),
        nudge='Can you find a reason for a different one?',
        reveal=('<b>Every one of them can be the odd one out.</b> '
                '<b>A</b>: the only one where every number is a multiple of 3. '
                '<b>B</b>: the only one that adds the same amount each time (+3). '
                '<b>C</b>: the only one that neither adds nor multiplies by the same number (the square numbers). '
                '<b>D</b>: the only one that gets smaller, and the only one you could add up forever and still get a number: '
                + T(r'32+16+8+4+\cdots=64') + '.')),
    # sideBySide: arithmetic vs geometric again (the summary table says it); countTerms (s2b), twoTerms, threeTerms (s3b,
    # with its b^2 = ac area picture) and sumToTerm (s3c): replays of lesson 6, 2/5, 1 and 7 ideas the table and
    # "How to choose" already list. Kept: whichFormula (the decision chart lighting up), findN (the table climbing to the
    # target), bounce (the ball).
    drop_str=['  <h3 class="sub">Side by side</h3>\n'],
    drop_expl_with_prev=['sideBySide'],
    drop_expl=['twoTerms'],
    drop_cards=['s2b', 's3b', 's3c'],
    # review lesson: no practice break (the whole assignment is mixed test-style practice)
)
