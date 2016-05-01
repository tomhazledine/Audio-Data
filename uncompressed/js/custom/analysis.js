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
    
    // Setup an analyser node
    var volumeAnalyser = context.createAnalyser();
    volumeAnalyser.fftSize = 2048;
    volumeAnalyser.smoothingTimeConstant = 0;
    var bufferSize = volumeAnalyser.frequencyBinCount;
    // Connect the volumeAnalyser to our master audio output
    master.connect(volumeAnalyser);

    // Create a Node to listen to the output every
    // 2048 'frames' (a.k.a. 21 times a
    // second at sample-rate of 44.1k)
    listenerNode = context.createScriptProcessor(2048,1,1);

    // Connect it to our audio:
    listenerNode.connect(master);

    listenerNode.onaudioprocess = function(){

        // Create an array to store our data
        var array = new Uint8Array(volumeAnalyser.frequencyBinCount);
        // Get the audio data and store it in our array
        volumeAnalyser.getByteFrequencyData(array);
        // volumeAnalyser.getByteTimeDomainData(array);

        var volume = getAverageVolume(array);
        redrawVolume(volume);
        redrawFrequency(array);

    }
}

// function audioAnalysis_frequency(context,master){
    
//     // Setup a frequencyAnalyser
//     var frequencyAnalyser = context.createAnalyser();
//     frequencyAnalyser.fftSize = 2048;
//     frequencyAnalyser.smoothingTimeConstant = 0;
//     var bufferSize = frequencyAnalyser.frequencyBinCount;
//     // Connect the frequencyAnalyser to our master audio output
//     master.connect(frequencyAnalyser);

//     // Create a Node to listen to the output every
//     // 2048 'frames' (a.k.a. 21 times a
//     // second at sample-rate of 44.1k)
//     listenerNode = context.createScriptProcessor(2048,1,1);

//     // Connect it to our audio:
//     listenerNode.connect(master);

//     listenerNode.onaudioprocess = function(){

//         // Create an array to store our data
//         var array = new Uint8Array(frequencyAnalyser.frequencyBinCount);
//         // Get the audio data and store it in our array
//         frequencyAnalyser.getByteFrequencyData(array);
//         // frequencyAnalyser.getByteTimeDomainData(array);

//         var frequency = array;
//         redrawfrequency(frequency);

//     }
// }

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

var vol_w = 20,
    vol_h = 80;

var vol_x = d3.scale.linear()
    .domain([0,1])
    .range([0,vol_w]);

var vol_y = d3.scale.pow()
    .domain([0,140])
    .rangeRound([0,vol_h]);

var volumeOutput = d3.select('#volumeDisplay')
    .append('svg')
        .attr('class','volumeOutputChart')
        .attr('width',vol_w)
        .attr('height',vol_h);

var volumeOutputBackground = volumeOutput.append('g')
    .attr('class','backgroundWrapper')
    .attr('width',vol_w)
    .attr('height',vol_h)
        .append('rect')
            .attr('class','background')
            .attr('width',vol_w)
            .attr('height',vol_h);

var volumeOutputData = volumeOutput.append('g')
    .attr('class','dataWrapper')
    .attr('width',vol_w)
    .attr('height',vol_h);

volumeOutputData.selectAll('rect')
    .data([0])
    .enter().append('rect')
        .attr('x',0)// - .5)
        .attr('y',0)//function(d){ return h - y(d) - .5; })
        .attr('width',vol_w)
        .attr('height',function(d){ return vol_h - vol_y(d); });

function redrawVolume(float){

    volumeOutputData.selectAll('rect')
        .data([float])
        .transition()
            .duration(0001)
            // .attr("y", function(d) { return h - y(d) - .5; })
            .attr('height',function(d){ return vol_h - vol_y(d); });
}

/**
 * DRAW FREQUENCY OUTPUT
 */

var placeholderFrequencyData = [];
for (var i = 0; i < 1024; i++) {
    placeholderFrequencyData.push(0);
}

// placeholderFrequencyData = [0, 0, 26, 11, 0, 9, 0, 0, 0, 27, 50, 49, 38, 14, 21, 68, 162, 220, 243, 234, 192, 118, 67, 123, 168, 207, 232, 237, 220, 184, 133, 75, 29, 22, 23, 22, 0, 0, 15, 14, 8, 25, 49, 52, 33, 0, 0, 0, 0, 0, 18, 83, 135, 176, 200, 204, 187, 154, 113, 64, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 19, 11, 0, 7, 13, 15, 5, 0, 0, 0, 0, 0, 0, 0, 2, 42, 88, 127, 157, 177, 185, 180, 165, 141, 112, 80, 48, 13];

// console.log(placeholderFrequencyData);

var freq_w = 800,
    freq_h = 250;

var freq_x = d3.scale.linear()
    .domain([0,1])
    .range([0,freq_w]);

var freq_y = d3.scale.linear()
    .domain([0,250])
    .rangeRound([0,freq_h]);

var frequencyOutput = d3.select('#frequencyDisplay')
    .append('svg')
        .attr('class','frequencyOutputChart')
        .attr('width',freq_w)
        .attr('height',freq_h);

var frequencyOutputBackground = frequencyOutput.append('g')
    .attr('class','backgroundWrapper')
    .attr('width',freq_w)
    .attr('height',freq_h)
        .append('rect')
            .attr('class','background')
            .attr('width',freq_w)
            .attr('height',freq_h);

var frequencyOutputData = frequencyOutput.append('g')
    .attr('class','dataWrapper')
    .attr('width',freq_w)
    .attr('height',freq_h);

// frequencyOutputData.selectAll('rect')
//     .data(placeholderFrequencyData)
//     .enter().append('rect')
//         .attr('x',function(d,i){ return (freq_w / placeholderFrequencyData.length) * i;})
//         .attr('y',0)//function(d){ return freq_h - freq_y(d); })
//         .attr('width',freq_w / placeholderFrequencyData.length)
//         .attr('height',function(d){ return freq_y(d); });

var freq_path = frequencyOutputData.append('path');
// freq_path
//     .data(placeholderFrequencyData)
//     .enter()

            line = d3.svg.line()
                .x(function(d,i){ return (freq_w / 512) * i; })
                .y(function(d){ return freq_h - freq_y(d); })
                .interpolate('monotone');

            freq_path
                .attr('d',line(placeholderFrequencyData))
                .attr('fill','none')
                .classed('y1',true)
                .attr('stroke-width','1px');

function redrawFrequency(array){

    freq_path
        .attr('d',line(array))

    // frequencyOutputData.selectAll('rect')
    //     .data(array)
    //     .transition()
    //         .duration(0001)
    //         .attr('x',function(d,i){ return (freq_w / array.length) * i;})
    //         .attr('y',0)//function(d){ return freq_h - freq_y(d); })
    //         .attr('width',freq_w / array.length)
    //         .attr('height',function(d){ return freq_h - freq_y(d); });
}