
let w1, h1, w2, h2, staged, grabbing_staged, opts, opts2;
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const note_objs = notes.map(n => {
  return {name: n, active: false, pos: {x: 0, y: 0}};
});
let all_note_objs = [];

const major = [2, 2, 1, 2, 2, 2, 1];
const natural_minor = [2, 1, 2, 2, 1, 2, 2];
const harmonic_minor = [2, 1, 2, 2, 1, 3, 1];
const melodic_minor = [2, 1, 2, 2, 2, 2, 1];

const Tone = require('Tone');

console.log(note_objs);
// const synth = new Tone.Synth().toMaster();
// synth.triggerAttackRelease('E4', '8n');
// synth.triggerAttackRelease('G4', '8n');

new p5(inputs, 'inputs');
new p5(topSketch, 'top');
new p5(btmSketch, 'btm');

// ===============================================================================================

// Sample input: ['C', 'E', 'G'], output: 'C [major]'
// Should be able to take variable number of inputs, from 3 to 5:
function getChordFromTriad(a, b, c) {
  const root = notes.indexOf(a);
  const med = notes.indexOf(b);
  const end = notes.indexOf(c);
  // const span = Math.max(in1, in2, in3) - Math.min(in1, in2, in3); // This is 7 for CEG, reflecting that there are 7 semitones between C and G.
  const root_to_med = Math.min(Math.abs(root - med), Math.abs(med + 12 - root));
  const med_to_end = Math.min(Math.abs(med - end), Math.abs(end + 12 - med));
  // console.log(root_to_med, med_to_end);
  let chord_type;
  // What about 2-4 and 4-2?
  if (root_to_med == 4 && med_to_end == 3) {
    chord_type = 'Maj';
  } else if (root_to_med == 3 && med_to_end == 4) {
    chord_type = 'min';
  } else if (root_to_med == 3 && med_to_end == 3) {
    chord_type = 'dim';
  } else if (root_to_med == 4 && med_to_end == 4) {
    chord_type = 'aug';
  }
  return (`${a} ${chord_type}`);
}

// ===============================================================================================

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


function inputs(p) {
  p.setup = function() {
    // const input = p.createInput();
    opts = p.createSelect();
    for (let i=0; i < notes.length; i++) {
      opts.option(notes[i]);
    }
    opts.position(20, 30);

    opts2 = p.createSelect();
    opts2.option('Major');
    opts2.option('Natural minor');
    opts2.option('Harmonic minor');
    opts2.option('Melodic minor');
    opts2.position(70, 30);

    opts.changed(handleInput);
    opts2.changed(handleInput);

    // const sub = p.createButton('submit');

    console.log('hi');
  };
}



function handleInput() {
  const key = opts.value();
  const scale = opts2.value();
  console.log(key, scale);
  let real_scale;
  switch(scale) {
    case 'Major': real_scale = major; break;
    case 'Natural minor': real_scale = natural_minor; break;
    case 'Harmonic minor': real_scale = harmonic_minor; break;
    case 'Melodic minor': real_scale = melodic_minor; break;
  }

  console.log(real_scale);
  let current_index = notes.indexOf(key); // starting point

  let result = [];
  for (let i=0; i < real_scale.length; i++) {
    result.push(notes[current_index]);
    current_index = (current_index + real_scale[i]) % 12;
  }
  console.log(result);


  note_objs.forEach(n => {
    if (result.includes(n.name)) {
      n.active = true;
    } else {
      n.active = false;
    }
  });
  // console.log(all_note_objs);
}

// ===============================================================================================

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

      const cursor_style = grabbing_staged ? p.HAND : p.ARROW;
      p.cursor(cursor_style);
    });
  };


  p.mouseClicked = function() {
    if (grabbing_staged) {
      staged.active = !staged.active;
    }
    // synth.triggerAttackRelease('E4', '8n');
  };


  p.draw = function() {
    drawTopBase(p);
  };
}

// ===============================================================================================

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

// ===============================================================================================

function drawBtmRow(p, row) {
  const height = 70;

  let indices = [];  // Holds the current chord
  let names = [];
  const active = all_note_objs.filter(n => n.active);

  // Prepare the current triad:
  for (let i=0; i < active.length; i++) {
    const check = [row, row + 2, row + 4];
    if (check.includes(i)) {
      indices.push(active[i].index); // Could also push on name of the note here to feed into getChordFromTriad
      names.push(active[i].name);
    }
  }

  // console.log(names);

  for (let i=0; i<20; i++) {
    const n = note_objs[i % 12];
    const int = (w2 - 20) / 24;
    const x = int * i;

    if (indices.includes(i)) {
      p.fill('green');
    } else {
      p.fill('white');
    }

    p.ellipse(x + 10, 30 + height + row * height, 10);
    p.text(n.name, x + 5, 50 + height + row * height);
  }
  p.fill('green');
  p.text(getChordFromTriad(...names), w2 - 100, 30 + height + row*height);
}

// ===============================================================================================

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
