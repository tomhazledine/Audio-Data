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


var audioBuffer;
var sourceNode;

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

    // When loaded decode the data
    request.onload = function() {

        // decode the data
        context.decodeAudioData(request.response, function(buffer) {
            // when the audio is decoded play the sound
            // playSound(buffer);
            audioBuffer = buffer;
            sourceNode.buffer = buffer;
            sourceNode.start(0);
            context.suspend();
            console.log('loaded!');
        }, onError);
    }
    request.send();
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