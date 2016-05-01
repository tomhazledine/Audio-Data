/**
 * ---------------
 * AUDIO ANALYSIS
 *
 * This function
 * hooks into the
 * output of the
 * synth, and gets
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
    analyser.smoothingTimeConstant = 0;
    var bufferSize = analyser.frequencyBinCount;
    // Connect the analyser to our master audio output
    master.connect(analyser);

    // Create a Node to listen to the output every
    // 2048 'frames' (a.k.a. 21 times a
    // second at sample-rate of 44.1k)
    listenerNode = context.createScriptProcessor(2048,1,1);

    // Connect it to our audio:
    listenerNode.connect(master);

    listenerNode.onaudioprocess = function(){

        // Create an array to store our data
        var array = new Uint8Array(analyser.frequencyBinCount);
        // Get the audio data and store it in our array
        analyser.getByteFrequencyData(array);
        // analyser.getByteTimeDomainData(array);

        var volume = getAverageVolume(array);
        redrawVolume(volume);

    }
}

/**
 * --------------------
 * AVERAGE VOLUME
 *
 * Convert all the
 * frequency amplitudes
 * (for a given frame)
 * into a single number
 * --------------------
 */
function getAverageVolume(array){
    var values = 0;
    var count = 0;
    var average = 0;
    var length = array.length;

    // Sum all the frequency values
    for (var i = 0; i < length; i++) {
        if (array[i] > 0) {
            values += array[i];
            count++;
        }
    }

    // Get the mean value
    if (values > 0 && count > 0) {
        average = values / count;
    } else {
        average = 0;
    }

    average = average.toFixed(2);

    return average;
}

/**
 * DRAW VOLUME OUTPUT
 */

var w = 20,
    h = 80;

var x = d3.scale.linear()
    .domain([0,1])
    .range([0,w]);

var y = d3.scale.pow()
    .domain([0,140])
    .rangeRound([0,h]);

var volumeOutput = d3.select('#volumeDisplay')
    .append('svg')
        .attr('class','volumeOutputChart')
        .attr('width',w)
        .attr('height',h);

var volumeOutputBackground = volumeOutput.append('g')
    .attr('class','backgroundWrapper')
    .attr('width',w)
    .attr('height',h)
        .append('rect')
            .attr('class','background')
            .attr('width',w)
            .attr('height',h);

var volumeOutputData = volumeOutput.append('g')
    .attr('class','dataWrapper')
    .attr('width',w)
    .attr('height',h);

volumeOutputData.selectAll('rect')
    .data([0])
    .enter().append('rect')
        .attr('x',0)// - .5)
        .attr('y',0)//function(d){ return h - y(d) - .5; })
        .attr('width',w)
        .attr('height',function(d){ return h - y(d); });

function redrawVolume(float){

    // chart = d3.select('#volumeDisplay .volumeOutputChart');

    volumeOutputData.selectAll('rect')
        .data([float])
        .transition()
            .duration(0001)
            // .attr("y", function(d) { return h - y(d) - .5; })
            .attr('height',function(d){ return h - y(d); });
}