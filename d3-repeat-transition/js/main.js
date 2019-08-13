'use strict'

var Main = function() {

	var HEIGHT = 500,
		WIDTH = 1000;

	var flickerDuration = 500;
	
	var svgMargin = {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10,
	}

	var circleAutoLowColor = d3.rgb(58, 166, 143),
		circleAutoHighColor = d3.rgb(255, 255, 255);

	var plotColor = d3.rgb(0, 0, 0);

	this.initialize = function() {
		
		console.log("initialize")
		var mainSvg = d3.select("#test-svg")

		mainSvg.attr("height", HEIGHT)
			.attr("width", WIDTH)

		mainSvg.append("rect")
			.attr("x", svgMargin.left)
			.attr("y", svgMargin.top)
			.attr("height", HEIGHT - svgMargin.top - svgMargin.bottom)
			.attr("width", WIDTH - svgMargin.left - svgMargin.right)
			.style("fill", plotColor)

		circleTransition();

	}

	function circleTransition() { 
		var mainSvg = d3.select("#test-svg")

		var oneHourArc = getHourArc(10, 12);
		var eightHourArc = getHourArc(6, 8);
		var innerCircleRadius = 4;

		var timeCircle = mainSvg.append("path")
			.attr("id", "test-indicator")
			.style("fill", circleAutoLowColor)
			.attr("transform", "translate(" + (WIDTH / 2) + "," + (HEIGHT / 2) + ")")
			.attr("d", oneHourArc)
			.attr("title", "THIS IS A TEST")
			.on("mouseover", function() {

				mainSvg.select("#test-indicator")
					.transition()
					.duration(250)
					.style("fill", circleAutoLowColor)
					.on("end", function() {
						// do nothing
					})
					.attr("title", "THIS IS A TEST")
			})
			
		// repeat();

		mainSvg.append("path")
			.attr("id", "middle-indicator")
			.classed("flashy", 1)
			.style("fill", circleAutoLowColor)
			.attr("transform", "translate(" + (WIDTH / 2) + "," + (HEIGHT / 2) + ")")
			.attr("d", eightHourArc)
			.on("mouseenter", function() {

				d3.select(this).classed("flashy", 0)
			})

		// draw inner circle
		mainSvg.append('circle')
			.attr("id", "inner-circle")
			.classed("indicatorCircle", 1)
			// .attr('r', 0)
			.attr("transform", "translate(" + (WIDTH / 2) + "," + (HEIGHT / 2) + ")")
			.style('fill', circleAutoLowColor)
			.attr("title", "blah")
			.attr('r', innerCircleRadius)

		
		function repeat() {
		  timeCircle
		  	.style("fill", circleAutoHighColor)
			.transition()        // apply a transition
			.duration(flickerDuration)      // apply it over 2000 milliseconds
			.style("fill", circleAutoLowColor)
			.transition()        // apply a transition
			.duration(flickerDuration)      // apply it over 2000 milliseconds
			.style("fill", circleAutoHighColor)
			.on("end", repeat);  // when the transition finishes start again
		};
	
	};


	// Indicator functions
	function getHourArc(inner, outer) {

		var arc = d3.arc()
			.innerRadius(inner)
			.outerRadius(outer)
			.startAngle(0) //convert from degs to radians
			.endAngle(2 * Math.PI)

		return arc
	}
	

}