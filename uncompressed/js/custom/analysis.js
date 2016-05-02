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
        // If we wanted information about the waveform
        // rather than the frequency, we would use this:
        // volumeAnalyser.getByteTimeDomainData(array);

        // Calculate the mean value of the frequency frame
        var volume = getAverageVolume(array);

        var parsedArray = parseFreqArray(array);

        // Update the volume display
        redrawVolume(volume);
        redrawFrequency(parsedArray);

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

    // Limit to 2 decimal places
    average = average.toFixed(2);
    
    // Remove any negative numbers
    if (average < 0) {
        average = 0;
    }

    // Flatten peaks
    if (average > 150) {
        average = 150;
    }

    return average;
}

/**
 * -----------------------
 * PARSE FREQUENCY ARRAY
 * 
 * Sanitize the frequency
 * data to suppress errors
 * and zoom-in on relevant
 * part of audio spectrum.
 * -----------------------
 */
function parseFreqArray(array){
    var result = [];

    // logArray(array);

    // Return only the first X number of array items
    for (var i = 0; i < 100; i++) {
        result.push(array[i]);
    }

    logArray(result);

    return result;
}

/**
 * ------------------
 * LOG ARRAY
 * 
 * Only log if array
 * contains values
 * greater than zero.
 * ------------------
 */
function logArray(array){
    var logArray = false;
    for (var i = 0; i < array.length; i++) {
        if (array[i] > 0) {
            logArray = true;
        }
    }
    if (logArray) {
        console.log(array);
    }
}

/**
 * ---------------------
 * DRAW VOLUME OUTPUT
 *
 * Use the D3.js library
 * to create an SVG that
 * can display volume as
 * a simple bar chart.
 * ---------------------
 */

// Set the width and height
// of our display.
var vol_w = 20,
    vol_h = 80;

// Creat a D3 Scale to map
// our data to the width of
// our display.
var vol_x = d3.scale.linear()
    .domain([0,1])
    .range([0,vol_w]);

// Creat a D3 Scale to map
// our data to the height
// of our display.
var vol_y = d3.scale.pow()
    .domain([0,150])
    .rangeRound([0,vol_h]);

// Append an SVG to the DOM node
// we've created in the markup.
var volumeOutput = d3.select('#volumeDisplay')
    .append('svg')
        .attr('class','volumeOutputChart')
        .attr('width',vol_w)
        .attr('height',vol_h);

// Add a background "group" ("g") to that SVG
var volumeOutputBackground = volumeOutput.append('g')
    .attr('class','backgroundWrapper')
    .attr('width',vol_w)
    .attr('height',vol_h)
        // And add a rectangle within that group.
        .append('rect')
            .attr('class','background')
            .attr('width',vol_w)
            .attr('height',vol_h);

// Add a "group" to contain our dynamic shapes
var volumeOutputData = volumeOutput.append('g')
    .attr('class','dataWrapper')
    .attr('width',vol_w)
    .attr('height',vol_h);

// Use placeholder data ("[0]") to generate
// the starting-point of our bar. We do this
// by passing the data into D3 and generating
// rectangles for each data item (nice and
// simple for this 1-bar volume chart).
volumeOutputData.selectAll('rect')
    .data([0])
    .enter().append('rect')
        .attr('x',0)
        .attr('y',0)
        .attr('width',vol_w)
        .attr('height',function(d){ return vol_h - vol_y(d); });

// Declare a function that will redraw the rectangle
// based on input value ("float").
// This function gets called by our Analyser.
function redrawVolume(float){
    volumeOutputData.selectAll('rect')
        .data([float])
        .transition()
            .duration(0001)
            // Update the height based on the data.
            // We're using this rectangle as a mask
            // over our coloured background, so we
            // subtract the value from the total
            // height.
            .attr('height',function(d){ return vol_h - vol_y(d); });
}




/**
 * ---------------------
 * DRAW FREQUENCY OUTPUT
 *
 * Use the D3.js library
 * to create an SVG that
 * can display real-time
 * frequency data as a
 * a line graph.
 * ---------------------
 */


// Generate some placeholder data to use
// when we initialise the graph on-load.
var placeholderFrequencyData = [];
for (var i = 0; i < 1024; i++) {
    placeholderFrequencyData.push(0);
}

// Set the width and height
// of our display.
var freq_w = 800,
    freq_h = 250;

// Creat a D3 Scale to map
// our data to the width of
// our display.
var freq_x = d3.scale.linear()
    .domain([0,1])
    .range([0,freq_w]);

// Creat a D3 Scale to map
// our data to the height of
// our display.
var freq_y = d3.scale.linear()
    .domain([0,250])
    .rangeRound([0,freq_h]);

// Append an SVG to the DOM node
// we've created in the markup.
var frequencyOutput = d3.select('#frequencyDisplay')
    .append('svg')
        .attr('class','frequencyOutputChart')
        .attr('width',freq_w)
        .attr('height',freq_h);

// Add a background "group" ("g") to that SVG
var frequencyOutputBackground = frequencyOutput.append('g')
    .attr('class','backgroundWrapper')
    .attr('width',freq_w)
    .attr('height',freq_h)
        // And add a rectangle within that group.
        .append('rect')
            .attr('class','background')
            .attr('width',freq_w)
            .attr('height',freq_h);

// Add a "group" to contain our dynamic shapes
var frequencyOutputData = frequencyOutput.append('g')
    .attr('class','dataWrapper')
    .attr('width',freq_w)
    .attr('height',freq_h);

// Create a path in our SVG
var freq_path = frequencyOutputData.append('path');

// Create a D3 function to set the path's
// values based on given data.
line = d3.svg.line()
    .x(function(d,i){ return (freq_w / 100) * i; })
    .y(function(d){ return freq_h - freq_y(d); })
    .interpolate('monotone');

// Use the line() function to pass placeholder data
// into our SVG path
freq_path
    .attr('d',line(placeholderFrequencyData))
    .attr('fill','none')
    .classed('y1',true)
    .attr('stroke-width','1px');

// Declare a function that will redraw the line
// based on input value ("array").
// This function gets called by our Analyser.
function redrawFrequency(array){

    // Pass new data into the line() function
    // and use that to set the new points for
    // the SVG path.
    freq_path
        .attr('d',line(array));
}