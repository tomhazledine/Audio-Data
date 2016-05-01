/**
 * ---------------
 * AUDIO ANALYSIS
 *
 * These functions
 * hook into the
 * output of the
 * synth, and get
 * data about the
 * audio.
 * ---------------
 */


// context = current audio API context
// master = master audio output
function audioAnalysis(context,master){
    
    // Setup an analyser
    var analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    var bufferSize = analyser.frequencyBinCount;
    // Connect the analyser to our master audio output
    master.connect(analyser);

    // Create a Node to listen to the output every
    // 2048 'frames' (a.k.a. 21 times a
    // second at sample-rate of 44.1k)
    listenerNode = context.createScriptProcessor(16384,1,1);

    // Connect it to our audio:
    listenerNode.connect(master);

    listenerNode.onaudioprocess = function(){

        // Create an array to store our data
        var array = new Uint8Array(analyser.frequencyBinCount);
        // Get the audio data and store it in our array
        analyser.getByteTimeDomainData(array);
        
        // Only log the result if there's a signal
        var logArray = false;
        for (var i = 0; i < array.length; i++) {
            if (array[i] > 128) {// no signal = 128
                logArray = true;
            }
        }
        if (logArray) {
            console.log(array);
        }

    }
}