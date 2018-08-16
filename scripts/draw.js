
let w1, h1, w2, h2, staged, grabbing_staged;
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const note_objs = notes.map(n => {
  return {name: n, active: false, pos: {x: 0, y: 0}};
});
let all_note_objs = [];

console.log(note_objs);

new p5(topSketch, 'top');
new p5(btmSketch, 'btm');

function drawTopBase(p) {
  p.background('lightgrey');
  p.line(10, h1/3, w1 - 10, h1/3);

  for (let i=0; i<13; i++) {
    const int = (w1 - 20) / 12;
    const x = int * i;
    const note_obj = note_objs[i % 12];
    note_obj.pos.x = x + 10;
    note_obj.pos.y = h1/3;
    const col = note_obj.active ? 'blue' : 'white';
    p.fill(col);
    p.ellipse(note_obj.pos.x, note_obj.pos.y, 10);
    p.text(note_obj.name, x + 5, h1*2/3);
  }
}

function topSketch(p) {
  p.setup = function() {
    w1 = 800;
    h1 = 150;
    p.createCanvas(w1, h1);
    drawTopBase(p);
  };

  p.mouseMoved = function() {
    grabbing_staged = false;
    note_objs.forEach(n => {
      if (p.dist(p.mouseX, p.mouseY, n.pos.x, n.pos.y) < 8) {
        grabbing_staged = true;
        console.log('ay');
        staged = n;
      }

      cursor_style = grabbing_staged ? p.HAND : p.ARROW;
      p.cursor(cursor_style);
    });
  };

  p.mouseClicked = function() {
    if (grabbing_staged) {
      staged.active = !staged.active;
    }
  };

  p.draw = function() {
    drawTopBase(p);
  };
}

function drawBtmBase(p) {
  all_note_objs = [];
  // First row just shows the scale, again (but longer):
  for (let i=0; i<25; i++) {
    const n = note_objs[i % 12];
    const int = (w2 - 20) / 24;
    const x = int * i;
    const col = n.active ? 'blue' : 'white';
    all_note_objs.push({...n, index: i}); // Note sure why it's yelling, this is fine.
    p.fill(col);
    p.ellipse(x + 10, 30, 10);
    p.text(n.name, x + 5, 50);
  }
}

function drawBtmRow(p, row) {
  const height = 70;

  let indices = [];
  const active = all_note_objs.filter(n => n.active);
  // for (let i = row; i <= row + 4; i += 2) {
  //   // console.log(i);
  //   indices.push(i);
  // }
  for (let i=0; i < active.length; i++) {
    const check = [row, row + 2, row + 4];
    if (check.includes(i)) {
      indices.push(active[i].index);
    }
  }

  for (let i=0; i<25; i++) {
    const n = note_objs[i % 12];
    const int = (w2 - 20) / 24;
    const x = int * i;
    // const col = n.active ? 'blue' : 'white';
    // p.fill(col);
    // const active = note_objs.filter(n => n.active);

    // console.log(active);
    // for (let i = row; i <= row + 4; i += 2) {
    //   // console.log(i);
    //   active[i].
    // }
    if (indices.includes(i)) {
      p.fill('green');
    } else {
      p.fill('white');
    }

    p.ellipse(x + 10, 30 + height + row * height, 10);
    p.text(n.name, x + 5, 50 + height + row * height);
  }
}

// NEXT STEPS:
// - Repeat the row 7 times.
// - Draw only the three active ones that form the current triad.
// - Write algorithm that takes in triads of notes and returns the chord name (i.e. key and type)


function btmSketch(p) {
  p.setup = function() {
    w2 = 1000;
    h2 = 800;
    p.createCanvas(w2, h2);
    drawBtmBase(p);
  };

  p.draw = function() {
    p.background('lightgray');

    drawBtmBase(p);
    for (let i=0; i < 7; i++) {
      drawBtmRow(p, i);
    }
  };
}
