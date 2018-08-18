
let opts, opts2;

// The problem is I don't know how to handle global variables (i.e. state) if we split up like this.

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
}

module.exports = {
  handleInput: handleInput,
  inputs: inputs
};
