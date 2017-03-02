var controlPad = $('.controlPad');

var volumeInput = 0;
var pitchInput = 0;
var noteOn = false;

var offset = controlPad.offset();


/**
 * ------------------
 * CONTROL PAD EVENTS
 * ------------------
 */
controlPad.on('mousedown',function(e){
  noteOn = true;
  newSynth.noteStart(400);
});

controlPad.on('mouseup mouseout',function(e){
  noteOn = false;
});

controlPad.on('mousemove mousedown',function(e){
  if (noteOn) {
    var rawVolInput = e.pageY - offset.top;
    var rawPitchInput = e.pageX - offset.left;
    volumeInput = parseNoteValue(rawVolInput);
    pitchInput = parsePitchValue(rawPitchInput);
    console.log('Volume = ' + volumeInput);
    console.log('Pitch = ' + pitchInput);
  }
});

// Parse note value.
// -----------------
// Make sure we're using a value
// between 0.00 and 1.00 for volume.
function parseNoteValue(input){
  var output = input / 300;
  return (1 - output).toFixed(2);
}

// Parse pitch value.
// ------------------
// Make sure we're using a value
// between 200.00 and 800.00 for pitch.
function parsePitchValue(input){
  var output = input * 2;
  output = output + 200;
  return output.toFixed(2);
}