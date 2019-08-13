'use strict'

var Main = function () {

	var HEIGHT = 300,
		WIDTH = 300;

	var duration = 120 * 1000;


	var plotColor = d3.rgb(255, 255, 0);

	this.initialize = function () {

		console.log("initialize")
		var mainSvg = d3.select("#test-svg")

		mainSvg.attr("height", HEIGHT)
			.attr("width", WIDTH)

		// mainSvg.append("circle")
		// 	.attr("cx", 10)
		// 	.attr("cy", 10)
		// 	.attr("r", 10)
		// 	.style("fill", plotColor)

		var inner = 30;
		var outer = 40;

		var tau = 2 * Math.PI

		var arcTimer = d3.arc()
			.innerRadius(inner)
			.outerRadius(outer)
			.startAngle(0) //convert from degs to radians

		mainSvg.append("path")
			.datum({
				endAngle: 2 * Math.PI
			})
			.attr("id", "arc-timer")
			.attr("d", arcTimer)
			.attr("transform", "translate(72,72)")
			.style("fill", d3.rgb(0, 255, 255))
			.transition()
			.ease(d3.easeLinear)
			.duration(duration)
			.attrTween("d", arcTween(0));

		var count = duration / 1000;

		mainSvg.append("text")
			.attr("id", "timer-text")
			.attr("x", 72)
			.attr("y", 82)
			.style("text-anchor", "middle")
			.style("font-size", "30px")
			.style("font-weight", "bold")
			.style("fill", d3.rgb(255, 255, 255))
			.text(count)

		function arcTween(newAngle) {
			return function (d) {
				var interpolate = d3.interpolate(d.endAngle, newAngle);
				return function (t) {
					d.endAngle = interpolate(t);
					return arcTimer(d);
				};
			};
		}

		
		var digital = setInterval(function () {
			count--;
			d3.select("#timer-text")
				.text(count);

			if (count == 0) {
				clearInterval(digital)
			}

		}, 1000);

	}





}