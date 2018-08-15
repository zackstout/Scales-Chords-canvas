
let w1, h1, w2, h2;
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

new p5(topSketch, 'top');
new p5(btmSketch, 'btm');

function topSketch(p) {
  p.setup = function() {
    w1 = 800;
    h1 = 150;
    p.createCanvas(w1, h1);
    p.background('lightgrey');
    p.line(10, h1/3, w1 - 10, h1/3);

    for (let i=0; i<13; i++) {
      const int = (w1 - 20) / 12;
      const x = int * i;
      p.ellipse(x + 10, h1/3, 10);
      p.text(notes[i], x + 5, h1*2/3);
    }
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
