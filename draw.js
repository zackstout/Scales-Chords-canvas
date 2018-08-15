
let w1, h1, w2, h2, staged, grabbing_staged;
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const note_objs = notes.map(n => {
  return {name: n, active: false, pos: {x: 0, y: 0}};
});
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


function btmSketch(p) {
  p.setup = function() {
    w2 = 1000;
    h2 = 800;
    p.createCanvas(w2, h2);
    p.background('lightgray');

    for (let i=0; i<25; i++) {
      const int = (w2 - 20) / 24;
      const x = int * i;
      p.ellipse(x + 10, 30, 10);
      p.text(notes[i % 12], x + 5, 50);
    }
  };
}
