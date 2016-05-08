<article class="keyboard clearfix">

    <!-- <canvas id="myCanvas"></canvas> -->

    <div id="synthControls" class="controls clearfix">

        <div class="controlStripOuter">
            <span>Master Volume</span>
            <div class="controlStrip clearfix">
                <div class="controlStripInner">
                    <input class="pianoController masterVolume" data-controlName="masterVolume" type="range" min="0" max="1" value="0.5" step="0.1">
                </div>
            </div>
            <span class="controlLabel_masterVolume controlValue">5</span>
        </div>

        <div class="controlStripOuter">
            <span>Osc. #1 Volume</span>
            <div class="controlStrip clearfix">
                <div class="controlStripInner">
                    <input class="pianoController oscOneVolume" data-controlName="oscOneVolume" type="range" min="0" max="1" value="1" step="0.1">
                </div>
            </div>
            <span class="controlLabel_oscOneVolume controlValue">10</span>
        </div>
        
        <div class="controlStripOuter">
            <span>Osc. #2 Volume</span>
            <div class="controlStrip clearfix">
                <div class="controlStripInner">
                    <input class="pianoController oscTwoVolume" data-controlName="oscTwoVolume" type="range" min="0" max="1" value="0.6" step="0.1">
                </div>
            </div>
            <span class="controlLabel_oscTwoVolume controlValue">6</span>
        </div>

        <div class="controlStripOuter">
            <span>Osc. #1: Wave</span>
            <div class="controlStrip clearfix">
                <div class="controlStripInner">
                    <input class="pianoController oscOneWave" data-controlName="oscOneWave" type="range" min="0" max="3" value="0" step="1">
                </div>
            </div>
            <span class="controlLabel_oscOneWave controlValue">Sine</span>
        </div>
        
        <div class="controlStripOuter">
            <span>Osc. #2: Wave</span>
            <div class="controlStrip clearfix">
                <div class="controlStripInner">
                    <input class="pianoController oscTwoWave" data-controlName="oscTwoWave" type="range" min="0" max="3" value="3" step="1">
                </div>
            </div>
            <span class="controlLabel_oscTwoWave controlValue">Triangle</span>
        </div>

        <div class="controlStripOuter">
            <span>Osc. #2: Pitch</span>
            <div class="controlStrip clearfix">
                <div class="controlStripInner">
                    <input class="pianoController oscTwoPitch" data-controlName="oscTwoPitch" type="range" min="1" max="5" value="2" step="0.1">
                </div>
            </div>
            <span class="controlLabel_oscTwoPitch controlValue">2</span>
        </div>

    </div>

    <div class="pianoWrapper">
        <div class="piano">

            <div class="octave-wrapper clearfix">
                <ol id="synthKeys" class="octave clearfix">
                    <li class="synthKey piano-key pitchClass261 natural"    data-pitch="261.63" data-note="C"  data-octave="4" ></li>
                    <li class="synthKey piano-key pitchClass277 accidental" data-pitch="277.18" data-note="C#" data-octave="4" ></li>
                    <li class="synthKey piano-key pitchClass293 natural"    data-pitch="293.66" data-note="D"  data-octave="4" ></li>
                    <li class="synthKey piano-key pitchClass311 accidental" data-pitch="311.13" data-note="D#" data-octave="4" ></li>
                    <li class="synthKey piano-key pitchClass329 natural"    data-pitch="329.63" data-note="E"  data-octave="4" ></li>
                    <li class="synthKey piano-key pitchClass349 natural"    data-pitch="349.23" data-note="F"  data-octave="4" ></li>
                    <li class="synthKey piano-key pitchClass369 accidental" data-pitch="369.99" data-note="F#" data-octave="4" ></li>
                    <li class="synthKey piano-key pitchClass392 natural"    data-pitch="392.00" data-note="G"  data-octave="4" ></li>
                    <li class="synthKey piano-key pitchClass415 accidental" data-pitch="415.30" data-note="G#" data-octave="4" ></li>
                    <li class="synthKey piano-key pitchClass440 natural"    data-pitch="440.00" data-note="A"  data-octave="4" ></li>
                    <li class="synthKey piano-key pitchClass466 accidental" data-pitch="466.16" data-note="A#" data-octave="4" ></li>
                    <li class="synthKey piano-key pitchClass493 natural"    data-pitch="493.88" data-note="B"  data-octave="4" ></li>

                    <li class="synthKey piano-key pitchClass523 natural"    data-pitch="523.25" data-note="C"  data-octave="5" ></li>
                    <li class="synthKey piano-key pitchClass554 accidental" data-pitch="554.37" data-note="C#" data-octave="5" ></li>
                    <li class="synthKey piano-key pitchClass587 natural"    data-pitch="587.33" data-note="D"  data-octave="5" ></li>
                    <li class="synthKey piano-key pitchClass622 accidental" data-pitch="622.25" data-note="D#" data-octave="5" ></li>
                    <li class="synthKey piano-key pitchClass659 natural"    data-pitch="659.26" data-note="E"  data-octave="5" ></li>
                    <li class="synthKey piano-key pitchClass698 natural"    data-pitch="698.46" data-note="F"  data-octave="5" ></li>
                    <li class="synthKey piano-key pitchClass739 accidental" data-pitch="739.99" data-note="F#" data-octave="5" ></li>
                    <li class="synthKey piano-key pitchClass783 natural"    data-pitch="783.99" data-note="G"  data-octave="5" ></li>
                    <li class="synthKey piano-key pitchClass830 accidental" data-pitch="830.61" data-note="G#" data-octave="5" ></li>
                    <li class="synthKey piano-key pitchClass880 natural"    data-pitch="880.00" data-note="A"  data-octave="5" ></li>
                    <li class="synthKey piano-key pitchClass932 accidental" data-pitch="932.33" data-note="A#" data-octave="5" ></li>
                    <li class="synthKey piano-key pitchClass987 natural"    data-pitch="987.77" data-note="B"  data-octave="5" ></li>
                </ol>
        </div>
        </div>
    </div>

</article>
