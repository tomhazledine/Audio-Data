/**
 * ------------------------------------------------------------------------------------------
 * DRAW BAR
 * Draws a bar chart using given options.
 *
 * options.barData = [array of integers] The data to be drawn).
 * options.wrapper = [d3.selection] Container element for the graph.
 * options.margin = [array of 4 integers] The px-value of margins (top, right, bottom, left).
 * ------------------------------------------------------------------------------------------
 */
var DrawBar = function drawBar(options){

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
     * Fallbacks
     */
    var
        barData = [1,2,3],
        wrapper = d3.select('body'),
        margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        },
        colours = [
            '#ffb832',
            '#c61c6f',
            '#268bd2',
            '#85992c'
        ],
        sort = true;

    /**
     * Set Options (if declared)
     */
    if ( options.margins !== undefined ) {
        var margin = options.margins;
    }
    if ( options.data !== undefined ) {
        var barData = options.data;
    }
    if ( options.wrapper !== undefined ) {
        var wrapper = options.wrapper;
    }
    if ( options.colours !== undefined ) {
        var colours = options.colours;
    }
    if ( options.sort === false ) {
        var sort = false;
    }

    /**
     * --------
     * SETTINGS
     *
     * Sizes
     * Scales
     * --------
     */

    /**
     * Sizes
     */
    var wrapperWidth = parseInt(wrapper.style('width')),
        wrapperHeight = parseInt(wrapper.style('height')),
        height = wrapperHeight - margin.top - margin.bottom,
        width = wrapperWidth - margin.left - margin.right,
        barWidth = 40,
        barOffset = 10;

    /**
     * Scales
     */
    var yScale = d3.scale.linear()
        .domain([0,d3.max(barData)])
        .range([0, height]);

    var xScale = d3.scale.ordinal()
        .domain(d3.range(0, barData.length))
        .rangeBands([0,width], .5);

    var vGuideScale = d3.scale.linear()
        .domain([0,d3.max(barData)])
        .range([height,0]);

    /**
     * ---------------------
     * COLOURS
     *
     * Spread colours evenly
     * across the width of
     * the chart.
     * ---------------------
     */
    var tempColour;
    var colourDomain = [];
    if (colours.length > 2) {
        for ( var x = 0; x < colours.length; x++) {
            var multiplier = (x * (100 / (colours.length - 1)) / 100);
            colourDomain.push(barData.length * multiplier);
        }
    }
    var colours = d3.scale.linear()
        .domain(colourDomain)
        .range(colours);


    /**
     * -------
     * TOOLTIP
     * -------
     */
    var tooltip = d3.select('body').append('div')
        .classed('tooltip',true)

    /**
     * ------------
     * DATA SORTING
     * ------------
     */
    if (sort) {
        barData.sort(function compareNumbers(a,b){
            return a - b;
        })
    }
    
    /**
     * ---------------
     * BUILD THE GRAPH
     * ---------------
     */
    var myChart = wrapper.append('svg')
        .attr('height',height + margin.top + margin.bottom)
        .attr('width',width + margin.left + margin.right)
        .append('g')
        .attr('transform','translate(' + margin.left + ', ' + margin.top + ')')
        .attr('width',width)
        .attr('height',height)
        .selectAll('rect').data(barData)
        .enter().append('rect')
            .style('fill',function(d,i){
                return colours(i);
            })
            .attr('width',xScale.rangeBand())
            .attr('height',function(d){
                return 0;
            })
            .attr('y',function(d){
                return height;
            })
            .attr('x',function(d,i){
                return xScale(i);
            })
        .on('mouseover',function(d){

            tooltip.style('opacity',.9)

            tooltip.html(d)
                .style('left', (d3.event.pageX - 40) + 'px')
                .style('top', (d3.event.pageY) + 'px')

            tempColour = this.style.fill;
            d3.select(this)
                .style('opacity',.5)
                .style('fill','yellow')
        })
        .on('mouseout',function(d){

            d3.select(this)
                .style('opacity',1)
                .style('fill',tempColour)
        })

    /**
     * -----------
     * TRANSITIONS
     * -----------
     */
    myChart.transition()
        .attr('height',function(d){
            return yScale(d);
        })
        .attr('y',function(d){
            return height - yScale(d);
        })
        .delay(function(d,i){
            return i * 10;
        })
        .duration(800)
        .ease('elastic')

    /**
     * -------------
     * AXES & GUIDES
     *
     * vAxis
     * vGuide
     * hAxis
     * hGuide
     * -------------
     */

    var vAxis = d3.svg.axis()
        .scale(vGuideScale)
        .orient('left')
        .ticks(10)

    var vGuide = wrapper.select('svg').append('g')
        vAxis(vGuide)
        vGuide.attr('transform','translate(' + margin.left + ', ' + margin.top + ')')
        vGuide.selectAll('path')
            .style({fill: 'none',stroke: "#000"})
        vGuide.selectAll('line')
            .style({stroke: "#000"})

    var hAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickValues(xScale.domain().filter(function(d,i){
            return !(i % (barData.length/5));
        }))

    var hGuide = wrapper.select('svg').append('g')
        hAxis(hGuide)
        hGuide.attr('transform','translate(' + margin.left + ', ' + (height + margin.top) + ')')
        hGuide.selectAll('path')
            .style({fill: 'none',stroke: "#000"})
        hGuide.selectAll('line')
            .style({stroke: "#000"})
}