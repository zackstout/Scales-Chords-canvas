
let w1, h1, w2, h2, staged, grabbing_staged, opts, opts2, w3, h3;
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const note_objs = notes.map(n => {
  return {name: n, active: false, pos: {x: 0, y: 0}};
});
let all_note_objs = [];
let toggleSound, current_scale;
// const { inputs, handleInput } = require('./inputs.js');

let pattern;
// 1 is a halfstep (or semitone), 2 a whole step.
const major = [2, 2, 1, 2, 2, 2, 1];
const natural_minor = [2, 1, 2, 2, 1, 2, 2];
const harmonic_minor = [2, 1, 2, 2, 1, 3, 1];
const melodic_minor = [2, 1, 2, 2, 2, 2, 1];

const Tone = require('Tone');

console.log(note_objs);
const synth = new Tone.Synth().toMaster();

let audio_on = false;
// synth.triggerAttackRelease('E4', '8n');
// synth.triggerAttackRelease('G4', '8n');

pattern = new Tone.Pattern(function(time, note){
	synth.triggerAttackRelease(note, 0.4);
}, ["C4", "E4", "G4", "A4"]);
// pattern.start(0);

// part.start("0"); // tells how long to wait before it starts.
Tone.Transport.start("+0.1");

new p5(inputs, 'inputs');
new p5(topSketch, 'top');
new p5(btmSketch, 'btm');
new p5(freqs, 'freqs');

// ===============================================================================================

const freq_ratios = [
  {name: 'Minor Second', ratio: '~ 19/20'},
  {name: 'Second', ratio: '~ 8/9'},
  {name: 'Minor Third', ratio: '~ 5/6'},
  {name: 'Major Third', ratio: '~ 4/5'},
  {name: 'Perfect Fourth', ratio: '3/4'}, // 5h, and 2 ^ (-5/12) = 0.75
  {name: 'Tritone', ratio: '~~ 5/7'},
  {name: 'Perfect Fifth', ratio: '2/3'},
  {name: 'Minor Sixth', ratio: '~ 7/11'},
  {name: 'Major Sixth', ratio: '~ 3/5'},
  {name: 'Minor Seventh', ratio: '~ 5/9'},
  {name: 'Major Seventh', ratio: '> 1/2'},
  {name: 'Octave', ratio: '1/2'},
];

let mar;
let staged_i = 5;

// Remember to pass in ratio/y, not just y:
function drawLinesForDataPoint(i, y, p) { // Pass in i instead of x so that we have i here.
  p.fill('red');
  p.stroke('red');
  const ratio = h3 - (mar + 10);
  const x = i * (w3 - (mar + 10))/12;
  const new_y = ratio/y;
  p.line(x, 0, x, new_y);
  p.line(0, new_y, x, new_y);
  p.text(`${i}h`, x, -10);
  p.text(freq_ratios[i-1].ratio, -35, new_y);
  p.text(freq_ratios[i-1].name, (w3 - (mar + 10))/2, -30);
}

function freqs(p) {
  p.setup = function() {
    w3 = 800;
    h3 = 500;
    p.createCanvas(w3, h3);
    p.background('lightgray');
    mar = 70;
    p.push();
    p.translate(w3/2, h3/2);
    p.line(-w3/2 + mar, -h3/2, -w3/2 + mar, h3/2);
    p.line(-w3/2, -h3/2 + mar, w3/2, -h3/2 + mar);
    p.pop();

    p.push();
    p.translate(50, 50);

    const ratio = h3 - (mar + 10);
    // First data point:
    p.ellipse(0, ratio, 5);

    for (let i=1; i < 13; i++) {
      // Axis ticks:
      p.stroke('black');
      const x = i * (w3 - (mar + 10))/12;
      p.line(x, -5, x, 5);

      // Data points:
      const y = Math.pow(2, i / 12);
      // console.log(y, ratio);
      p.text('1', -15, ratio);
      p.noStroke();
      p.ellipse(x, ratio / y, 5);
    }
    p.pop();

  };

  p.mouseMoved = function() {
    const x_from_origin = p.mouseX - 50;
    const bar_width = (w3 - (mar + 10))/12;
    const i_from_origin = Math.floor((x_from_origin + bar_width/2) / bar_width); // adding bar_width/2 so that it changes when in the middle of two ticks, not as crossing over a tick.
    // console.log(i_from_origin);
    staged_i = i_from_origin;

  };

  p.draw = function() {
    p.background('lightgray');
    mar = 50;
    p.push();
    p.translate(w3/2, h3/2);
    p.line(-w3/2 + mar, -h3/2, -w3/2 + mar, h3/2);
    p.line(-w3/2, -h3/2 + mar, w3/2, -h3/2 + mar);
    p.pop();

    p.push();
    p.translate(50, 50);

    const ratio = h3 - (mar + 10);
    // First data point:
    p.ellipse(0, ratio, 5);

    for (let i=1; i < 13; i++) {
      // Axis ticks:
      p.stroke('black');
      const x = i * (w3 - (mar + 10))/12;
      p.line(x, -5, x, 5);

      // Data points:
      const y = Math.pow(2, i / 12);
      p.text('1', -15, ratio);
      p.noStroke();

      if (i == staged_i) {
        drawLinesForDataPoint(i, y, p);
      }
      p.fill('black');
      p.ellipse(x, ratio / y, 5);
    }
    p.pop();
  };
}

// ===============================================================================================

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

    toggleSound = p.createButton('Sound on');
    toggleSound.position(200, 30);
    toggleSound.mousePressed(handlePress);
    // console.log('hi');
  };
}

// Note, this will only reset the scale when you click the button, not any time you change the scale. Should fix that.
function handlePress() {
  let notes_to_play = current_scale.map(n => n + '4');
  if (audio_on) {
    pattern.stop();
    toggleSound.html('Sound on');
  } else {

    pattern = new Tone.Pattern(function(time, note){
    	synth.triggerAttackRelease(note, 0.4);
    }, notes_to_play);
    pattern.start();
    toggleSound.html('Silence');
  }
  audio_on = !audio_on;
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

  current_scale = result;


  note_objs.forEach(n => {
    if (result.includes(n.name)) {
      n.active = true;
    } else {
      n.active = false;
    }
  });
}

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
  // What about 2-4 and 4-2? Oh i think maybe those only appeared because of an error...?
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

function drawBtmRow(p, row) {
  const height = 70;

  let indices = [];  // Holds the current chord
  let names = [];
  const active = all_note_objs.filter(n => n.active);

  // Prepare the current triad:
  for (let i=0; i < active.length; i++) {
    const check = [row, row + 2, row + 4];
    if (check.includes(i)) {
      indices.push(active[i].index);
      names.push(active[i].name); // Pushing on name of the note here to feed into getChordFromTriad
    }
  }

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
