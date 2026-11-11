/* Site settings.
 * inkApi: the /exec URL of the Apps Script in backend/Code.gs. Empty = live sharing is off and every device can write
 * (ink is only saved on that device). Once it's set, only a device signed in with the teacher key can write; everyone
 * else sees the teacher's notes for their class link (?class=B), view only. */
export const CONFIG = {
  inkApi: 'https://script.google.com/macros/s/AKfycbz51sriUqUhW9fjckjU0by4DIIe8Y2mnxHHsm17S6HvgvS1XMARsiDnsFgq9A23vZym/exec',
  course: 'math20-1', // the course id in the Teaching Hub's schedule (teaching/js/courses.js): the blocks and times come from there
  classes: ['A', 'B', 'C', 'D'],
  classLabel: (c) => (/^[A-D]$/.test(c) ? 'Block ' + c : c)
};
