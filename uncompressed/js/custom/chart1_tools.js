function activateLines(options){
    settings = [];

    for (i = 0; i < options.length; i++) {

        /**
         * PARSE OPTIONS
         */
        settings[i] = {
            active: _checkFalse(options[i][0]),
            passive: _checkFalse(options[i][1]),
            target: options[i][2]
        }

        /**
         * FIND ELEMENTS
         */
        var entryClass = '.entry' + settings[i].target;
        var entry = d3.select(entryClass);
        var tooltipClass = '.chart1tooltip.' + settings[i].target;
        var tooltip = d3.select(tooltipClass);
        // var entries = $('.entry');

        /**
         * APPLY STATES
         */
        if (settings[i].passive) {
            entry.classed('passive',true);
            tooltip.classed('passive',true);
        } else {
            entry.classed('passive',false);
            tooltip.classed('passive',false);
        }

        if (settings[i].active) {
            entry.classed('active',true);
            tooltip.classed('active',true);
        } else {
            entry.classed('active',false);
            tooltip.classed('active',false);
        }

        // console.log(entry);

    }


    /**
     * HELPERS
     */
    function _checkFalse(target) {
        if (target) {
            return true;
        } else {
            return false;
        }
    }
}

function activateCaptions(target){
    var targetClass = '.chart1caption' + target;
    var targetCaption = $(targetClass);
    var captions = $('.chart1caption');

    captions.removeClass('active');
    targetCaption.addClass('active');
    // console.log('the wrapper:');
    // console.log(wrapper);
    // console.log('the target:');
    // console.log(target);
}

var buttons = $('.triggerchart1'),
    button1 = $('.triggerchart1.one'),
    button2 = $('.triggerchart1.two'),
    button3 = $('.triggerchart1.three'),
    button4 = $('.triggerchart1.four');

button1.on('click',function(){
    buttons.removeClass('active');
    $(this).addClass('active');
    
    var target = $(this).data('target');
    activateCaptions(target);

    activateLines( [
            [1,0,'england'],
            [0,0,'italy'],
            [0,0,'wales'],
            [0,0,'scotland'],
            [0,0,'ireland'],
            [0,0,'france']
    ]);
});

button2.on('click',function(){
    buttons.removeClass('active');
    $(this).addClass('active');
    
    var target = $(this).data('target');
    activateCaptions(target);
    activateLines( [
            [0,1,'england'],
            [1,0,'italy'],
            [0,0,'wales'],
            [0,0,'scotland'],
            [0,0,'ireland'],
            [0,0,'france']
    ]);
});

button3.on('click',function(){
    buttons.removeClass('active');
    $(this).addClass('active');
    
    var target = $(this).data('target');
    activateCaptions(target);
    activateLines( [
            [0,1,'england'],
            [0,1,'italy'],
            [1,0,'wales'],
            [0,0,'scotland'],
            [0,0,'ireland'],
            [0,0,'france']
    ]);
});

button4.on('click',function(){
    buttons.removeClass('active');
    $(this).addClass('active');
    
    var target = $(this).data('target');
    activateCaptions(target);
    activateLines( [
            [0,1,'england'],
            [0,1,'italy'],
            [0,1,'wales'],
            [0,1,'scotland'],
            [0,1,'ireland'],
            [0,1,'france']
    ]);
});