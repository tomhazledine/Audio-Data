/**
 * ---------------------------------------------------------
 * MEGA-SUPER-SYNTH
 *
 * Call this function to invoke a new instance of
 * a synth. Simplified example:
 *     
 *     var newSynth = MegaSuperSynth(window.AudioContext);
 *
 * This function just creates the sounds. It requires the
 * MegaSuperSynthInputs module to provide inputs.
 *
 * This synth is mono-phonic. This means that we create an
 * oscillator and leave it running the entire time. Whether
 * we hear it or not is determined by a volume control for
 * the oscillator. When we change note, we're altering the
 * pitch of our main oscillator. If we wanted a polyphonic
 * synth, we'd need to initialise an oscillator for each
 * individual note.
 *
 * We are using a second oscillator to add extra texture to
 * the notes we make. This runs in tandem with the first
 * oscillator, and is controlled by the same volume setting.
 * ---------------------------------------------------------
 */
var MegaSuperSynth = function megaSuperSynth(contextClass){

    var // Set up audio context (set as a param so
        // we can use the browser-specific version)
        context = new contextClass();

    var // Controller Values
        masterVolume = 0.5,
        currentPitch = null,
        currentNote = null;

    var // Controller Starting Values
        vco2PM = 2, // (PM = Pitch Multiplier)
        vco1wav = 'sine',
        vco2wav = 'triangle';

    /**
     * -----------------------------------
     * SETTING UP AUDIO
     *
     * We need oscillators to create our
     * waveforms, and amplifiers to then
     * manipulate them.
     * 
     * VCO = voltage controlled oscillator
     * VCA = voltage controlled amplifier
     *
     * VCO & VCA are terms taken from
     * analogue synth construction (they
     * used real circuits and voltages)
     * -----------------------------------
     */
    
    // VCO #1
    // Create an oscillator using the API:
    var vco1 = context.createOscillator();
    // Set the waveform for our new VCO:
    vco1.type = vco1wav;// OPTIONS: sine, square, sawtooth, triangle
    // Set the starting frequency for the VCO
    vco1.frequency.value = 440.00;// 440.00Hz = "A", the standard note all orchestras tune to.
    // Get the VCO running
    vco1.start(0);

    // VCO #2
    // Repeat the process for our second oscillator:
    var vco2 = context.createOscillator();
    vco2.type = vco2wav;
    vco2.frequency.value = 440.00;
    vco2.start(0);

    // VCA
    // This is a gain (volume) node that
    // will control the volume of the note.
    var vca = context.createGain();
    vca.gain.value = 0;

    // VCO#1 VOLUME
    // Gain node for VCO#1
    var vco1vol = context.createGain();
    vco1vol.gain.value = 1;

    // VCO#2 VOLUME
    // Gain node for VCO#2
    var vco2vol = context.createGain();
    vco2vol.gain.value = 0.6;

    // MASTER VCA
    // This is our overall volume control
    // When we trigger a note, the normal
    // VCA goes from 0 to full. Having a
    // master volume control allows us to
    // set the global volume without
    // affecting the notes' on/off function.
    var master = context.createGain();
    master.gain.value = 0.1;

    // CONNECTIONS
    // Here we link all our nodes
    // together. The final setting
    // of `context.destination`
    // pipes the resulting sounds
    // to our audio output, so we
    // can hear it.
    vco1.connect(vco1vol);
    vco1vol.connect(vca);
    vco2.connect(vco2vol);
    vco2vol.connect(vca);
    vca.connect(master);
    master.connect(context.destination);

    /**
     * -------------------------------------
     * NOTE CONTROLS
     *
     * These methods begin and end our note.
     * 
     * `noteStart()` is passed a frequency,
     * sets that frequency to the VCOs and
     * then makes sure the VCA is set to 1
     * (a.k.a. full volume). Then it adds a
     * class to the relevant note on the
     * keyboard so we can visually show that
     * the note has been pressed.
     * 
     * `noteEnd()` reverses this process.
     * -------------------------------------
     */
    function noteStart(note){
        // console.log('the note is: ' + note);
        vco1.frequency.value = note;// Set note pitch
        vco2.frequency.value = (note / vco2PM);// Set note pitch
        vca.gain.value = 1;// Start note
        addPressedClass(note);
    }
    function noteEnd(note){
        removePressedClass(note);
        // console.log('The note has ended.');
        vca.gain.value = 0;// End note
    }

    /**
     * ------------------------
     * OSCILLATOR CONTROLS
     *
     * We can use these methods
     * to alter various aspects
     * of the oscillators.
     * ------------------------
     */
    
    function masterVolumeControl(volume){
        master.gain.value = volume;
    }
    
    function oscOneVolumeControl(osc1volume){
        vco1vol.gain.value = osc1volume;
    }
    
    function oscTwoVolumeControl(osc2volume){
        vco2vol.gain.value = osc2volume;
    }
    
    function oscOneWaveControl(oscOneWaveType){
        vco1wav = _handleWaveType(oscOneWaveType);
        vco1.type = vco1wav;
    }
    
    function oscTwoWaveControl(oscTwoWaveType){
        vco2wav = _handleWaveType(oscTwoWaveType);
        vco2.type = vco2wav;
    }
    
    function oscTwoPitchControl(pitchMultiplier){
        vco2PM = pitchMultiplier;
    }

    /**
     * -------------------
     * CONTROL ROUTER
     *
     * Handles incoming
     * control changes and
     * directs them to the
     * correct controller.
     * -------------------
     */
    function _controlRouter(name,value){
        // console.log('the ' + name + ' control has been set to ' + value);
        switch (name) {
            case 'masterVolume':
                masterVolumeControl(value);
                break;
            case 'oscOneVolume':
                oscOneVolumeControl(value);
                break;
            case 'oscTwoVolume':
                oscTwoVolumeControl(value);
                break;
            case 'oscOneWave':
                oscOneWaveControl(value);
                break;
            case 'oscTwoWave':
                oscTwoWaveControl(value);
                break;
            case 'oscTwoPitch':
                oscTwoPitchControl(value);
                break;
        }

    }

    /**
     * ----------------------------
     * HANDLE WAVE TYPES
     * 
     * This helper-function takes a
     * raw value from a range input
     * and converts it into the
     * correct string value for the
     * oscillator type.
     * ----------------------------
     */
    function _handleWaveType(int){
        var rawWaveValue = parseInt(int);
        switch (rawWaveValue) {
            case 0:
                stringWaveValue = 'sine';
                break;
            case 1:
                stringWaveValue = 'square';
                break;
            case 2:
                stringWaveValue = 'sawtooth';
                break;
            case 3:
                stringWaveValue = 'triangle';
                break;
        }
        return stringWaveValue;
    }

    /**
     * ----------------------------
     * TOGGLE CLASSES TO STYLE KEYS
     *
     * Requires "noQuery" module
     * ----------------------------
     */
    
    function addPressedClass(note){
        targetPitch = Math.floor(note);
        targetClass = 'pitchClass' + targetPitch;
        targetKey = document.getElementsByClassName(targetClass);
        noQuery.addClass(targetKey[0],'pressed');
    }

    function removePressedClass(note){
        targetPitch = Math.floor(note);
        targetClass = 'pitchClass' + targetPitch;
        targetKey = document.getElementsByClassName(targetClass);
        noQuery.removeClass(targetKey[0],'pressed');
    }

    /**
     * ---------------
     * AUDIO ANALYSIS
     *
     * Send our audio
     * output and the
     * context to our
     * analysis tools. 
     * ---------------
     */
    audioAnalysis(context,master);


    /**
     * ------------------------------
     * Public API
     *
     * These are the methods that we
     * want to expose publicly.
     * MegaSuperSynthInputs taps into
     * these to control the synth.
     * ------------------------------
     */
    var publicAPI = {
        handleWaveType: _handleWaveType,
        controlChanged: _controlRouter,
        noteStart: noteStart,
        noteEnd: noteEnd
    };
    
    return publicAPI;

}

/**
 * ---------------------------------------------------
 * MegaSuperSynthInputs
 * 
 * handles event- and data-input for MegaSuperSynth.
 * 
 * @param {element} controls Wrapper ID for controls
 * @param {element} keys     Wrapper ID for piano keys
 * ---------------------------------------------------
 */
var MegaSuperSynthInputs = function megaSuperSynthInputs(controls,keys){

    var // Note Inputs (the keyboard)
        synthKeys = keys.getElementsByClassName('synthKey');
    
    var // Controller Inputs
        masterVolumeSlider = controls.getElementsByClassName('masterVolume'),
        oscOneVolumeSlider = controls.getElementsByClassName('oscOneVolume'),
        oscTwoVolumeSlider = controls.getElementsByClassName('oscTwoVolume'),
        oscOneWaveSlider = controls.getElementsByClassName('oscOneWave'),
        oscTwoWaveSlider = controls.getElementsByClassName('oscTwoWave'),
        oscTwoPitchSlider = controls.getElementsByClassName('oscTwoPitch');

    var // Utility Variables
        keyIsDown = false,
        keysDown = [];

    var // Map keys as array
        keyToKey = {
             65: '261.63',//'Cl',
             87: '277.18',//'C#l',
             83: '293.66',//'Dl',
             69: '311.13',//'D#l',
             68: '329.63',//'El',
             70: '349.23',//'Fl',
             84: '369.99',//'F#l',
             71: '392.00',//'Gl',
             89: '415.30',//'G#l',
             72: '440.00',//'Al',
             85: '466.16',//'A#l',
             74: '493.88',//'Bl',
             75: '523.25',//'Cu',
             79: '554.37',//'C#u',
             76: '587.33',//'Du',
             80: '622.25',//'D#u',
            186: '659.26',//'Eu',
            222: '698.46',//'Fu',
            221: '739.99',//'F#u',
            220: '783.99',//'Gu',
            // 13: '830.61'//'G#u'
        };

    /**
     * ---------------------
     * SETUP EVENT LISTENERS
     * ---------------------
     */
    for (var i = 0; i < synthKeys.length; i++) {
        synthKeys[i].addEventListener('mousedown',_notePress,false);
        synthKeys[i].addEventListener('mouseover',_noteMouseover,false);
        synthKeys[i].addEventListener('mouseout',_noteMouseout,false);
        synthKeys[i].addEventListener('mouseup',_noteMouseup,false);
    };
    document.addEventListener('keydown',_noteKeydown,false);
    document.addEventListener('keyup',_noteKeyup,false);
    masterVolumeSlider[0].addEventListener('change',_controlPress,false);
    oscOneVolumeSlider[0].addEventListener('change',_controlPress,false);
    oscTwoVolumeSlider[0].addEventListener('change',_controlPress,false);
    oscOneWaveSlider[0].addEventListener('change',_controlPress,false);
    oscTwoWaveSlider[0].addEventListener('change',_controlPress,false);
    oscTwoPitchSlider[0].addEventListener('change',_controlPress,false);

    /**
     * ----------------------------
     * HANDLE LISTENER ROUTING
     * 
     * Different types of event
     * trigger the same end-results
     * but require different paths
     * (e.g. mousedown and
     * mouseover)
     * ----------------------------
     */
    
    function _notePress(){
        keyIsDown = true;
        var noteValue = this.getAttribute('data-pitch');
        // console.log(noteValue);
        newSynth.noteStart(noteValue);
    }

    function _noteMouseover(){
        if (keyIsDown) {
            var noteValue = this.getAttribute('data-pitch');
            newSynth.noteStart(noteValue);
        }
    }

    function _noteMouseout(){
        if (keyIsDown) {
            var noteValue = this.getAttribute('data-pitch');
            newSynth.noteEnd(noteValue);
        }
    }

    function _noteMouseup(){
        keyIsDown = false;
        var noteValue = this.getAttribute('data-pitch');
        newSynth.noteEnd(noteValue);
    }

    /**
     * ---------------------
     * CONTROLLER ROUTING
     * 
     * Sends controller data
     * to controller
     * ---------------------
     */
    function _controlPress(){
        var sliderValue = this.value;
        var sliderName = this.getAttribute('data-controlName');
        newSynth.controlChanged(sliderName,sliderValue);
        sliderChange(sliderName,sliderValue);
    }

    /**
     * ---------------
     * CONTROL DISPLAY
     * 
     * Show live value
     * for the control
     * sliders.
     * ---------------
     */
    function sliderChange(name,value){
        var targetClass = "controlLabel_" + name;
        var target = document.getElementsByClassName(targetClass);
        var outputValue;

        switch (name) {
            case 'masterVolume':
                outputValue = value * 10;
                break;
            case 'oscOneVolume':
                outputValue = value * 10;
                break;
            case 'oscTwoVolume':
                outputValue = value * 10;
                break;
            case 'oscOneWave':
                outputValue = newSynth.handleWaveType(value);
                break;
            case 'oscTwoWave':
                outputValue = newSynth.handleWaveType(value);
                break;
            case 'oscTwoPitch':
                outputValue = 0 - value;
                console.log()
                break;
        }

        target[0].textContent = outputValue;
    }

    /**
     * ------------
     * KEY BINDINGS
     * ------------
     */
    function _noteKeydown(key){
        // If the key is already being held down, abort function.
        if (key.keyCode in keysDown){
            key.preventDefault();
            return;
        }
        // Log the key in keysDown
        keysDown[key.keyCode] = true;
        if (typeof keyToKey[key.keyCode] !== 'undefined'){
            key.preventDefault();
            noteValue = keyToKey[key.keyCode];
            newSynth.noteStart(noteValue);
        }
    }

    function _noteKeyup(key){
        delete keysDown[key.keyCode];
        if (typeof keyToKey[key.keyCode] !== 'undefined'){
            key.preventDefault();
            noteValue = keyToKey[key.keyCode];
            //console.log(noteValue);
            newSynth.noteEnd(noteValue);
        }
    }

    
}

/**
 * ------------------------------------
 * noQuery
 * 
 * These are basic utilities that allow
 * for cross-browser support, replacing
 * the need to use jQuery.
 * ------------------------------------
 */
var noQuery = (function(){
    
    /**
     * ---------
     * HAS CLASS
     * 
     * Does the target element have the target class?
     * @param  {object}  el        The target element.
     * @param  {string}  className The target class.
     * @return {Boolean}           If the el has the class, output 'true'. Otherwise 'false'.
     * ---------
     */
    function _hasClass(el, className){
        if (el.classList) {
            var result = el.classList.contains(className);
        } else {
            var result = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
        return result;
    }

    /**
     * ---------
     * ADD CLASS
     * 
     * Add a class to the target element.
     * @param {object} el        The target element.
     * @param {string} className The target class.
     * ---------
     */
    function _addClass(el, className){
        if (el.classList) {
            el.classList.add(className);
        }
        else {
            el.className += ' ' + className;
        }
    }

    /**
     * ------------
     * REMOVE CLASS
     * 
     * Remove a class from the target element.
     * @param  {object} el        The target element.
     * @param  {string} className The target class.
     * ------------
     */
    function _removeClass(el, className){
        if (el.classList) {
            el.classList.remove(className);
        }
        else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    /**
     * --------------
     * PUBLIC METHODS
     * 
     * Expose all our
     * nice functions
     * to the public.
     * --------------
     */
    var publicAPI = {
        hasClass: _hasClass,
        addClass: _addClass,
        removeClass: _removeClass
    };
    return publicAPI;
})();

/**
 * -------------------
 * INIT
 *
 * Initialise all our
 * functions (so stuff
 * actually happens)
 * -------------------
 */

// Set our DOM elements:
var controlsWrapper = document.getElementById('synthControls');
var keysWrapper = document.getElementById('synthKeys');

// console.log(controlsWrapper);

if (typeof controlsWrapper !== 'undefined') {
    // determine if Web Audio API is available
    // (`contextClass` will return `false` if
    // the API is not supported).
    var contextClass = (window.AudioContext || window.webkitAudioContext);


    if (contextClass) {
        // Initialise the audio functions
        var newSynth = MegaSuperSynth(contextClass);
        // Initialise the input controls
        var newSynthInputs = MegaSuperSynthInputs(controlsWrapper,keysWrapper);
    }
}