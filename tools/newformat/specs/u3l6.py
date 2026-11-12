from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

# Clyde: lower jaw fixed, upper jaw (with its eye) swinging open and shut about the hinge. The jaws never open as
# far as 90 degrees in the loop, so the picture does not give the answer away.
_teeth_lo = ''.join(f'<polygon points="{x},181 {x+8},181 {x+4},171" fill="#fffdf4" stroke="#c9c2a8" stroke-width="1"/>' for x in range(78, 222, 16))
_teeth_up = ''.join(f'<polygon points="{x},179 {x+8},179 {x+4},189" fill="#fffdf4" stroke="#c9c2a8" stroke-width="1"/>' for x in range(82, 282, 16))
CROC = svg(
    f'<rect x="0" y="206" width="330" height="44" fill="#cfe8f0"/>'
    f'<path d="M0 214 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#9cc9d6" stroke-width="3">'
    f'<animateTransform attributeName="transform" type="translate" values="0 0;-40 0" dur="2s" repeatCount="indefinite"/></path>'
    f'<path d="M14 196 Q14 150 56 152 L56 200 Q30 206 14 196 Z" fill="#5d8f3c" stroke="#3f6b28" stroke-width="3"/>'
    f'<path d="M56 182 L236 182 Q244 186 236 194 L56 200 Z" fill="#5d8f3c" stroke="#3f6b28" stroke-width="3" stroke-linejoin="round"/>{_teeth_lo}'
    f'<text x="146" y="226" font-size="20" font-weight="800" fill="#3f6b28" text-anchor="middle">30 cm</text>'
    f'<g><animateTransform attributeName="transform" type="rotate" values="-3 56 180;-36 56 180;-36 56 180;-3 56 180" keyTimes="0;.45;.6;1" dur="3.2s" repeatCount="indefinite"/>'
    f'<path d="M56 178 L292 178 Q300 172 292 164 L120 156 Q80 140 50 146 Z" fill="#5d8f3c" stroke="#3f6b28" stroke-width="3" stroke-linejoin="round"/>{_teeth_up}'
    f'<circle cx="78" cy="144" r="12" fill="#5d8f3c" stroke="#3f6b28" stroke-width="3"/><circle cx="80" cy="142" r="6" fill="#fff8c6"/><ellipse cx="81" cy="142" rx="2" ry="5" fill="#1c2230"/>'
    f'<ellipse cx="286" cy="166" rx="4" ry="3" fill="#3f6b28"/>'
    f'<text x="186" y="152" font-size="20" font-weight="800" fill="#3f6b28" text-anchor="middle">40 cm</text></g>'
    + qmark(286, 120, 40, RED),
    'Clyde the crocodile opening and closing his jaws')

SPEC = dict(
    warm=dict(
        title='Clyde’s Big Bite',
        ctx='Clyde the crocodile’s jaws are hinged at the back. His lower jaw is <b>30&nbsp;cm</b> long and his upper jaw is <b>40&nbsp;cm</b> long.',
        ask='How wide an angle must he open his jaws so the tips are exactly <b>50&nbsp;cm</b> apart?',
        pic=CROC,
        strip=strip(sdrive('🐟', 7, size=34), sdrive('🐠', 9, begin=-4, size=30, y=40), sfloat('🫧', 300, 3), sfloat('🫧', 40, 3.6, 1.5, 24)),
        nudge='How do you know?',
        reveal=f'<b>90°</b>, a right angle. 30, 40, 50 is the 3-4-5 right triangle made 10 times bigger: {T("30^2+40^2=900+1600=2500=50^2")}. Open less than 90° and the tips are closer than 50 cm; open more and they are farther apart.'),
    # Example 2 replay, the proof replay, the which-letters replay, the cosine dial (with its card) and the
    # parallelogram replay go. Kept: the "can the sine law start?" stamp, the Pythagoras-with-a-correction hinge
    # (slider), one procedure each for a side, an angle and solving SAS, and the sailing boats.
    drop_expl=['alt', 'derive', 'forms', 'dial', 'para'],
    drop_cards=['s4b'],
    practice=dict(after='ex5', qs='1–6', rest='7–18', line='The forms of the law, then a side from SAS and an angle from SSS.',
                  chips=[('1', 'Forms of the cosine law'), ('2–4', 'Find a side (SAS)'), ('5–6', 'Find an angle (SSS)')],
                  note='We carry on when most of the class has reached Question 5.'),
)
