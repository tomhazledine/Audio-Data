
var FinishingPositions = function finishingPositions(settings){

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
            // X Axis uses dates in YYYY format
            data[settings.xColumn[i]] = new Date(data[settings.xColumn[i]],0,1);
        }
        for (i = 0; i < settings.yColumn.length; i++) {
            // Y Axis has multiple columns that must be integers, not strings
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
    var xScale = d3.time.scale().range([0, width]),
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
        bgWrap.append('line')
            .attr('x1',0)
            .attr('x2',width)
            .attr('y1',(barHeight * i))
            .attr('y2',(barHeight * i))
            .classed(bgClass, true);
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
        .tickFormat(function(d){return d3.time.format('%Y')(new Date(d));});
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
    // var yLabelText = 'Finishing Position';

    var yAxisLabel = yAxisG.append('text')
        .classed('axisLabel',true)
        .attr('transform','translate(' + yLabelOffset + ',' + (height / 2) + ') rotate(-90)');
        // .text(yLabelText);

    /**
     * Tooltip
     */
    // var tooltip = d3.select('.tooltip');
    var tooltipsWrapper = d3.select('.chart1tooltips');

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
        
        // Setup vars to handle the `for` statement
        var circles = [];
        var paths = [];
        var lines = [];
        var entryWrapper = [];
        var tooltips = [];
        var hoverTargets = [];

        for (i = 0; i < settings.yColumn.length; i++) {

            entryWrapper[i] = svgInner.append('g')
                .classed('entry entry' + i + ' entry' + settings.yColumn[i],true);

            paths[i] = entryWrapper[i].append('path');
            paths[i + settings.yColumn.length] = entryWrapper[i].append('path');

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
                .interpolate('linear');// monotone | basis | linear | cardinal | bundle

            paths[i]
                .attr('d',lines[i](data))
                .attr('fill','none')
                .attr('data-nation',settings.yColumn[i])
                .classed('chartline line' + settings.yColumn[i], true)
                .attr('stroke-width','1px');

            paths[i + settings.yColumn.length]
                .attr('d',lines[i](data))
                .attr('fill','none')
                .attr('data-nation',settings.yColumn[i])
                .classed('chartline chartline_hover line' + settings.yColumn[i], true)
                .attr('stroke-width','10px');

            /**
             * TOOLTIPS
             */
            tooltips[i] = tooltipsWrapper.append('div')
                .classed('chart1tooltip ' + settings.yColumn[i],true);
                // .text(settings.yColumn[i])
            
            tooltips[i].append('div')
                .classed('colourBox colourBox_' + settings.yColumn[i], true);

            tooltips[i].append('p')
                .classed('labelBox labelBox_' + settings.yColumn[i], true)
                .text(settings.yColumn[i]);

            /**
             * TRANSITIONS
             */
            paths[i + settings.yColumn.length].on('mouseover',function(){
                activeOn($(this));
            });

            paths[i + settings.yColumn.length].on('mouseout',function(){
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

                var targetClass = '.passive.entry' + nation;
                var target = d3.select(targetClass);

                var targetTooltipClass = '.chart1tooltip.' + nation;
                var targetTooltip = d3.select(targetTooltipClass);
                // tooltip.text(nation);
                target.classed('hovering',true);

                // if (target.hasClass('passive'))

                targetTooltip
                    // .text(nation)
                    // .classed(nation,true)
                    .classed('hovering',true);
                    // .style('left', (d3.event.pageX + 20) + 'px')
                    // .style('top', (d3.event.pageY) + 'px');
            }

            function activeOff(subject){
                var nation = subject.attr('data-nation');
                var targetClass = '.passive.entry' + nation;
                var target = d3.select(targetClass);
                target.classed('hovering',false);

                var targetTooltipClass = '.chart1tooltip.' + nation;
                var targetTooltip = d3.select(targetTooltipClass);
                targetTooltip
                    // .text('nothing selected')
                    // .classed(nation,false)
                    .classed('hovering',false);
            }
        }

        /**
         * HOVER TARGETS
         */
        // var hoverTargetWidth = width / settings.xColumn[0].length;
        // var hoverTargetNumber = settings.xColumn[0].length;
        // var testVar = data[settings.xColumn[0]];
        // console.log(testVar);
        
        // var hoverTargets = svgInner.selectAll('rect')
        //   .data(data)
        //   .enter()
        //     .append('rect')
        //     .attr("x", function(datum, index) { return xScale(index); })
        //     .attr("y", 0)
        //     .attr('width',hoverTargetWidth)
        //     .attr('height',height)
        //     .classed('hoverTarget',true);
        
        







        // hoverTargets = svgInner.selectAll('rect').data(data);

        // hoverTargets.enter().append('rect');

        // function getit(d){ return d[settings.xColumn[0]]; }

        // var hoverTargetNumber = getit();
        // console.log(hoverTargetNumber);

        // hoverTargets
        //     // .filter(function(d){ return !isNaN(d[settings.yColumn[i]]); })
        //     .attr('x',function (d){ return xScale(d[settings.xColumn[0]]); })
        //     .attr('y',0)
        //     // .attr('data-nation',settings.yColumn[i])
        //     .classed('hoverTarget', true);

        // hoverTargets.exit().remove();

        







        // var hoverTargets = svgInner.append('g')
        //     .classed('hoverTargets',true);
        
        // // var hoverTargetNumber = settings.xColumn[0].length;
        // // var barHeight = height / barNumber;
        
        // for (i = 0; i < barNumber; i++) {
        //     // var hoverTargetWidth = width / hoverTargetNumber;
            
        //     hoverTargets.append('rect')
        //         .classed('hoverTarget',true)
        //         .attr('width',hoverTargetWidth)
        //         .attr('height',height)
        //         .attr('transform','translate(' + (hoverTargetWidth * i) + ',0)');
        // }

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

var testWrap1 = $('#chart1');

if(testWrap1.length) {
    var chartOne = FinishingPositions({
        dataSrc  : '/data/resultspositions.csv',
        wrapper  : d3.select('#chart1'),
        margin   : { top: 20, right: 20, bottom: 30, left: 15 },
        xColumn  : ['year'],
        yColumn  : ['england','scotland','ireland','wales','france','italy'],
        hasTimeX : true,
        hasTimeY : false,
        circleRadius : 3
    });
}