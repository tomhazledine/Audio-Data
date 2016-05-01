<?php include('header.php'); ?>

<h1>Web Audio API Keyboard</h1>
<p>This keyboard generates its sounds using the javascript Web Audio API, which is baked into most modern browsers.</p>

<?php include('keyboard.php'); ?>

<h2>Fancy visualisations will go here</h2>
<p>Now we've got some audio with a <code>context.destination</code>, we can hook that into all sorts of analytical tools&hellip;</p>

<div class="volumeDisplayWrapper">
    <h4>Volume:</h4>
    <div id="volumeDisplay" class="volumeDisplay"></div>
    <!-- <canvas id="volumeCanvas" class="volumeCanvas"></canvas> -->
</div>

<div class="frequencyDisplayWrapper">
    <h4>Frequency:</h4>
    <div id="frequencyDisplay" class="frequencyDisplay"></div>
</div>

<?php include('footer.php'); ?>