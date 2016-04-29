/**
 * -----------------------------------------
 * DRAW Line
 * Draw a scatter graph using given options.
 *
 * options [object]:
 * 
 * dataSrc [path string]
 * wrapper [d3 selection]
 * margin [top,right,bottom,left]
 * xColumn [string]
 * yColumn [string]
 * -----------------------------------------
 */

var DrawLine = function drawLine(options){

    /**
     * ---------------------------------
     * OPTIONS
     * 
     * Use fallback values if options
     * are not set in the function call,
     * otherwise use defined options.
     * ---------------------------------
     */
    
    /**
     * FALLBACKS
     */
    var settings = {
        dataSrc      : '/week_temp.csv',
        wrapper      : d3.select('body'),
        margin       : { top: 20, right: 20, bottom: 20, left: 20 },
        xColumn      : ['xColumn'],
        yColumn      : ['yColumn'],
        hasTimeX     : false,
        hasTimeY     : false,
        circleRadius : 3
    };

    /**
     * SET OPTIONS (if declared)
     */
    if (options !== undefined) {
        if ( options.dataSrc      !== undefined ) { settings.dataSrc      = options.dataSrc;      }
        if ( options.wrapper      !== undefined ) { settings.wrapper      = options.wrapper;      }
        if ( options.margin       !== undefined ) { settings.margin       = options.margin;       }
        if ( options.xColumn      !== undefined ) { settings.xColumn      = options.xColumn;      }
        if ( options.yColumn      !== undefined ) { settings.yColumn      = options.yColumn;      }
        if ( options.hasTimeX     === true      ) { settings.hasTimeX     = true;                 }
        if ( options.hasTimeY     === true      ) { settings.hasTimeY     = true;                 }
    }

    /**
     * --------------------
     * PARSE THE DATA
     *
     * Make sure columns
     * used return integers
     * and not strings.
     * --------------------
     */
    function _type(data){
        for (i = 0; i < settings.xColumn.length; i++) {
            if (settings.hasTimeX) {
                data[settings.xColumn[i]] = (new Date(data[settings.xColumn[i]]).getTime()) / 1000;
            } else {
                data[settings.xColumn[i]] = +data[settings.xColumn[i]];
            }
        }
        for (i = 0; i < settings.yColumn.length; i++) {
            data[settings.yColumn[i]] = +data[settings.yColumn[i]];
        }
        return data;
    }

    /**
     * ----------------------------
     * SIZES
     *
     * Find the w/h for the chart's
     * wrapper, and calculate the
     * inner w/h using the margins.
     * ----------------------------
     */
    var wrapperWidth = parseInt(settings.wrapper.style('width')),
        wrapperHeight = parseInt(settings.wrapper.style('height')),
        height = wrapperHeight - settings.margin.top - settings.margin.bottom,
        width = wrapperWidth - settings.margin.left - settings.margin.right;

    /**
     * ------------------------
     * SCALES
     *
     * Set the x & y scales.
     * ------------------------
     */
    var xScale = d3.scale.linear().range([0, width]),
        yScale = d3.scale.linear().range([height, 0]);

    /**
     * --------------------
     * DRAW SVG
     *
     * Build the containing
     * SVG for our chart.
     * Build and position
     * the inner group.
     * --------------------
     */
    var scatterSvg = settings.wrapper.append('svg')
        .attr('width',wrapperWidth)
        .attr('height',wrapperHeight)
        .classed('chartSvg',true);

    var svgInner = scatterSvg.append('g')
        .attr('transform','translate(' + settings.margin.left + ', ' + settings.margin.top + ')')
        .attr('width',width)
        .attr('height',height)
        .classed('chartWrapper',true);

    /**
     * Background
     */
    var bgWrap = svgInner.append('g')
        .classed('background',true);
    
    var barNumber = 6;
    var barHeight = height / barNumber;
    
    for (i = 0; i < barNumber; i++) {
        var bgClass = 'bgBar';
        if ((i - 1) % 2){
            bgClass = bgClass + ' odd';
        }
        bgWrap.append('rect')
            .attr('width',width)
            .attr('height',barHeight)
            .classed(bgClass, true)
            .attr('transform','translate(0,' + (barHeight * i) + ')');
    }

    /**
     * ---------------
     * AXES
     *
     * Draw the x axis
     * & y axis.
     * ---------------
     */
    var axesGroup = scatterSvg.append('g')
        .attr('transform', 'translate(' + settings.margin.left + ',' + settings.margin.top + ')')
        .classed('axesWrapper',true);
    var xAxisG = axesGroup.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .classed('axis xAxis',true);
    var yAxisG = axesGroup.append('g')
        .classed('axis yAxis',true);
    
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickFormat(function(d){return d3.time.format('%Y')(new Date((d * 1000)));});
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickValues([1,2,3,4,5,6])
        .tickFormat(d3.format());

    /**
     * Axes Labels
     */

    var xLabelOffset = 35;
    var xLabelText = 'Year';
    var yLabelOffset = -30;
    var yLabelText = 'Finishing Position';

    var yAxisLabel = yAxisG.append('text')
        .classed('axisLabel',true)
        .attr('transform','translate(' + yLabelOffset + ',' + (height / 2) + ') rotate(-90)')
        .text(yLabelText);

    /**
     * Tooltip
     */
    var tooltip = d3.select('.tooltip');

    /**
     * -------------------------
     * PUT IT ALL TOGETHER
     *
     * Using all our vars and
     * settings, build the chart
     * from the given dataset.
     * -------------------------
     */
    function _renderChart(data){
        
        /**
         * -----------------
         * DATA MIN MAX
         * 
         * Get the min & max
         * values for x & y
         * columns.
         * -----------------
         */
        
        // Get the Maximum values
        var xColumnMaximums = [];
        var yColumnMaximums = [];
        for (i = 0; i < settings.xColumn.length; i++) {
            xColumnMaximums.push(d3.max(data, function (d){ return d[settings.xColumn[i]]; }));
        }
        for (i = 0; i < settings.yColumn.length; i++) {
            yColumnMaximums.push(d3.max(data, function (d){ return d[settings.yColumn[i]]; }));
        }
        var xMax = Math.max.apply(null,xColumnMaximums),
            yMax = Math.max.apply(null,yColumnMaximums);
        // console.log('xMax = ' + xMax);
        // console.log('yMax = ' + yMax);

        // Get the Minimum values
        var xColumnMinimums = [];
        var yColumnMinimums = [];
        for (i = 0; i < settings.xColumn.length; i++) {
            xColumnMinimums.push(d3.min(data, function (d){ return d[settings.xColumn[i]]; }));
        }
        for (i = 0; i < settings.yColumn.length; i++) {
            yColumnMinimums.push(d3.min(data, function (d){ return d[settings.yColumn[i]]; }));
        }
        var xMin = Math.min.apply(null,xColumnMinimums),
            yMin = Math.min.apply(null,yColumnMinimums);
        // console.log('xMin = ' + xMin);
        // console.log('yMin = ' + yMin);

        /**
         * -------
         * DOMAINS
         * -------
         */
        var xScaleExtent = d3.extent(data, function (d){ return d[settings.xColumn]; });
        var yScaleExtent = d3.extent(data, function (d){ return d[settings.yColumn2]; });
        
        xScale.domain([xMin,xMax]);
        yScale.domain([7,1]);

        /**
         * AXES
         */
        xAxisG.call(xAxis);
        yAxisG.call(yAxis);

        /**
         * CREATE SHAPES
         */
        var circles = [];
        var paths = [];
        var lines = [];
        var entryWrapper = [];

        for (i = 0; i < settings.yColumn.length; i++) {

            entryWrapper[i] = svgInner.append('g')
                .classed('entry entry' + i + ' entry' + settings.yColumn[i],true);

            paths[i] = entryWrapper[i].append('path');

            /**
             * CIRCLES
             */
            circles[i] = entryWrapper[i].selectAll('circle').data(data);

            circles[i].enter().append('circle');

            circles[i]
                .filter(function(d){ return !isNaN(d[settings.yColumn[i]]); })
                .attr('cx',function (d){ return xScale(d[settings.xColumn[0]]); })
                .attr('cy',function (d){ return yScale(d[settings.yColumn[i]]); })
                .attr('r',function(d){ return settings.circleRadius; })
                .attr('data-nation',settings.yColumn[i])
                .classed('chartcircle circle' + settings.yColumn[i], true);

            circles[i].exit().remove();
    
            /**
             * LINES
             */
            lines[i] = d3.svg.line()
                .defined(function(d) { return !isNaN(d[settings.yColumn[i]]); })
                .x(function(d){ return xScale(d[settings.xColumn[0]]); })
                .y(function(d){ return yScale(d[settings.yColumn[i]]); })
                .interpolate('monotone');// monotone | basis | linear | cardinal | bundle

            paths[i]
                .attr('d',lines[i](data))
                .attr('fill','none')
                .attr('data-nation',settings.yColumn[i])
                .classed('chartline line' + settings.yColumn[i], true)
                .attr('stroke-width','1px');

            /**
             * TRANSITIONS
             */
            paths[i].on('mouseover',function(){
                activeOn($(this));
            });

            paths[i].on('mouseout',function(){
                activeOff($(this));
            });

            circles[i].on('mouseover',function(){
                activeOn($(this));
            });

            circles[i].on('mouseout',function(){
                activeOff($(this));
            });

            function activeOn(subject){
                var nation = subject.attr('data-nation');
                // var targetClass = '.entry' + nation;
                // var target = d3.select(targetClass);
                tooltip.text(nation);
                // target.classed('active',true);
            }

            function activeOff(subject){
                // var nation = subject.attr('data-nation');
                // var targetClass = '.entry' + nation;
                // var target = d3.select(targetClass);
                tooltip.text('nothing selected');
                // target.classed('active',false);
            }
        }

    }

    /**
     * ----------------------
     * INITIALISE THE CHART
     *
     * Get the data, parse it
     * using _type, then draw
     * the chart using
     * _renderChart.
     * ----------------------
     */
    d3.csv(settings.dataSrc, _type, _renderChart);
    


}

var testWrap1 = $('#resultsLine');

if(testWrap1.length) {
    var testScatter = DrawLine({
        dataSrc  : '/data/resultspositions.csv',
        wrapper  : d3.select('#resultsLine'),
        margin   : { top: 20, right: 20, bottom: 30, left: 50 },
        xColumn  : ['year'],
        yColumn  : ['england','scotland','ireland','wales','france','italy'],
        hasTimeX : true
    });
}