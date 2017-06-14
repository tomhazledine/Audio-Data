// Find our play and pause button elements.
var play_audio = document.getElementById('play_audio');
var pause_audio = document.getElementById('pause_audio');

// Set up event listeners for play and pause events.
play_audio.addEventListener('click',play_the_sound);
pause_audio.addEventListener('click',pause_the_sound);

// Set the url for our audio file.
let audio_url = '/files/lostThatEasy.mp3';

// Get the correct context.
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
const offline_context = new OfflineAudioContext( 2, 44100 * 40, 44100 );


var audioBuffer;
var sourceNode;
var fftSize = 1024;

var offline_source = offline_context.createBufferSource();

// load the sound
setupAudioNodes();
loadSound( audio_url );

function setupAudioNodes() {
    // create a buffer source node
    sourceNode = context.createBufferSource();
    // and connect to destination
    sourceNode.connect(context.destination);
}

// load the specified sound
function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    console.log('starting to load sound');

    // When loaded decode the data
    request.onload = function() {

        // decode the data
        context.decodeAudioData(request.response, function(buffer) {
            // when the audio is decoded play the sound
            // playSound(buffer);
            audioBuffer = buffer;
            // sourceNode.buffer = buffer;
            // displayBuffer( buffer );
            // sourceNode.start(0);
            // context.suspend();
            console.log('loaded!');

            offline_source.buffer = audioBuffer;
            offline_source.connect(offline_context.destination);
            offline_source.start();
            //offline_source.loop = true;
            offline_context.startRendering().then(function(renderedBuffer) {
                console.log('Rendering completed successfully');
                // var context = new (window.AudioContext || window.webkitAudioContext)();
                // var song = context.createBufferSource();
                // song.buffer = renderedBuffer;
                // console.log(renderedBuffer);

                var processor = offline_context.createScriptProcessor(fftSize, 1, 1);
                offline_source.connect(processor);

                processor.onaudioprocess = function( e ) {

                    console.log('running onaudioprocess');
                    
                    var input = e.inputBuffer.getChannelData(0);
                    
                    var data = new Uint8Array( (fftSize * 2) );
                    
                    var fft = fft.getByteFrequencyData( data );
                    
                    console.log(fft);
                  // do whatever you want with `data`
                }

                offline_context.startRendering();

                // song.connect(context.destination);

                // play.onclick = function() {
                //     song.start();
                // }
            }).catch(function(err) {
                console.log('Rendering failed: ' + err);
                // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
            });
        }, onError);
    };
    request.send();
}

function displayBuffer(buff /* is an AudioBuffer */) {
   var leftChannel = buff.getChannelData(0); // Float32Array describing left channel
   console.log(leftChannel);

   for (var i=0; i<  leftChannel.length; i++) {
       // on which line do we get ?
       var x = Math.floor ( canvasWidth * i / leftChannel.length ) ;
       var y = leftChannel[i] * canvasHeight / 2 ;
       context.beginPath();
       context.moveTo( x  , 0 );
       context.lineTo( x+1, y );
       context.stroke();
   }
   context.restore();
   console.log('done');
}


function playSound(buffer) {
    sourceNode.buffer = buffer;
    sourceNode.start(0);
}

// log if an error occurs
function onError(e) {
    console.log(e);
}

// var audio = new Audio();
// audio.src = '/files/lostThatEasy.mp3';

// var analyser = context.createAnalyser();


// window.addEventListener('load', function(e) {
//     // Our <audio> element will be the audio source.
//     var source = context.createMediaElementSource(audio);
//     source.connect(analyser);
//     analyser.connect(context.destination);

// }, false);

// var position

function play_the_sound(){
    // sourceNode.buffer = audioBuffer;
    context.resume();
}

function pause_the_sound(){
    context.suspend();
}




// // // let audio_file = new Audio( '/files/lostThatEasy.mp3' );

// // // audio_file.play();

// // let audioBuffer = null;
// // // Fix up prefixing
// // window.AudioContext = window.AudioContext || window.webkitAudioContext;
// // const context = new AudioContext();

// // function load_sound(url) {
// //     let new_buffer = false;
// //     var request = new XMLHttpRequest();
// //     request.open('GET', url, true);
// //     request.responseType = 'arraybuffer';

// //     // Decode asynchronously
// //     request.onload = function() {
// //         context.decodeAudioData(request.response, function(buffer) {
// //             new_buffer = buffer;
// //         }, onError);
// //     }
// //     request.send();

// //     return new_buffer;
// // }

// // function onError(e){
// //     console.log(e);
// // }

// // audioBuffer = load_sound( '/files/lostThatEasy.mp3' );

// // console.log(audioBuffer);