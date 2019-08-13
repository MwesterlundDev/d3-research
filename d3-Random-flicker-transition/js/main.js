'use strict'

var Main = function () {

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
		circleAutoHighColor = circleAutoHighColor = d3.rgb(0, 255, 201);

	var plotColor = d3.rgb(0, 0, 0);

	this.initialize = function () {

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

		var oneHourArc = getHourArc(30, 29);
		// var eightHourArc = getHourArc(60, 80);
		// var innerCircleRadius = 40;

		// must happen after first
		var timeCircle = mainSvg.append("path")
			.attr("id", "test-indicator")
			.style("opacity", 0)
			.style("fill", circleAutoHighColor)
			.attr("transform", "translate(" + (WIDTH / 2) + "," + (HEIGHT / 2) + ")")
			.attr("d", oneHourArc)
			.attr("title", "THIS IS A TEST")
			.transition()
			.duration(2000)
			.ease(flickerEase)
			.style("opacity", function(d) {
				console.log("here")
				return 1;
			})
			.on("end", function() {
				d3.select(this).attr("d", getHourArc(23, 21))
			})
			



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


	function flickerEase(t) {
		console.log("T: ", t);

		var value = 0

		switch (true) {

			case t > 0 && t < 0.1:
				value = 0;
				break;
			case t > 0.1 && t < 0.1:
				value = 1;
				break;
			case t > 0.1 && t < 0.13:
				value = 0;
				break;
			case t > 0.13 && t < 0.15:
				value = 1;
				break;
			case t > 0.15 && t < 0.25:
				value = 0;
				break;
			case t > 0.25 && t < 0.5:
				value = 1;
				break;
			case t > 0.5 && t < 0.55:
				value = 0;
				break;
			case t > 0.55 && t < 0.58:
				value = 1;
				break;
			case t > 0.58 && t < 0.61:
				value = 0;
				break;
			case t > 0.61 && t < 0.62:
				value = 1;
				break;
			case t > 0.62 && t < 0.7:
				value = 0;
				break;
			case t > 0.7 && t < 0.75:
				value = 1;
				break;
			case t > 0.75 && t < 0.77:
				value = 0;
				break;
			case t > 0.77 && t < 0.79:
				value = 1;
				break;
			case t > 0.79 && t < 0.83:
				value = 0;
				break;
			default:
				value = 1;
				break;
		}

		console.log("Value: ", value);

		return value;
	}
}