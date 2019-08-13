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

		var oneHourArc = getHourArc(100, 120);
		var eightHourArc = getHourArc(60, 80);
		var innerCircleRadius = 40;

		// var timeCircle = mainSvg.append("path")
		// 	.attr("id", "test-indicator")
		// 	.style("fill",d3.rgb(0, 0, 0))
		// 	.attr("transform", "translate(" + (WIDTH / 2) + "," + (HEIGHT / 2) + ")")
		// 	.attr("d", oneHourArc)
		// 	.attr("title", "THIS IS A TEST")
		// 	// .transition()
		// 	// .duration(10000)
		// 	// .on("end", function() {
		// 	// 	d3.select(this).style("fill", buildIndicatorGradient(10, 0, 1))
		// 	// })

		// must happen after first
		var timeCircle = mainSvg.append("path")
			.attr("id", "test-indicator")
			.style("fill", circleAutoHighColor)
			.attr("transform", "translate(" + (WIDTH / 2) + "," + (HEIGHT / 2) + ")")
			.attr("d", oneHourArc)
			.attr("title", "THIS IS A TEST")
			// .transition()
			// .duration(6000)
			// .on("end", function() {
			// 	d3.select(this).remove();
			// })
			
		// repeat();

		// mainSvg.append("path")
		// 	.attr("id", "middle-indicator")
		// 	// .style("fill", buildIndicatorGradient(5, 0, 2))
		// 	.attr("transform", "translate(" + (WIDTH / 2) + "," + (HEIGHT / 2) + ")")
		// 	.attr("d", eightHourArc)

		mainSvg.append("path")
			.attr("id", "middle-indicator")
			.style("fill",circleAutoHighColor)
			.attr("transform", "translate(" + (WIDTH / 2) + "," + (HEIGHT / 2) + ")")
			.attr("d", eightHourArc)
			// .transition()
			// .duration(6000)
			// .on("end", function() {
			// 	d3.select(this).remove();
			// })
			

		// draw inner circle
		mainSvg.append('circle')
			.attr("id", "inner-circle")
			.classed("indicatorCircle", 1)
			.attr("transform", "translate(" + (WIDTH / 2) + "," + (HEIGHT / 2) + ")")
			.style('fill', circleAutoHighColor)
			.attr("title", "blah")
			.attr('r', innerCircleRadius)


		mainSvg.append('rect')
			.attr("id", "inner")
			.classed("indicatorCircle", 1)
			.style('fill', addGlistenGradient("top-left"))
			.attr("title", "blah")
			.attr("x", 20)
			.attr("y", 20)
			.attr("height", 50)
			.attr("width", 200)

		mainSvg.append('rect')
			.attr("id", "inner")
			.classed("indicatorCircle", 1)
			.style('fill', addGlistenGradient("top-left"))
			.attr("title", "blah")
			.attr("x", 20)
			.attr("y", 80)
			.attr("height", 50)
			.attr("width", 100)

		mainSvg.append('rect')
			.attr("id", "inner")
			.classed("indicatorCircle", 1)
			.style('fill', addGlistenGradient("top-left"))
			.attr("title", "blah")
			.attr("x", 20)
			.attr("y", 150)
			.attr("height", 50)
			.attr("width", 50)


		

		// mainSvg.append('circle')
		// 	.attr("id", "inner-circle")
		// 	.classed("indicatorCircle", 1)
		// 	.attr("transform", "translate(" + (WIDTH / 2) + "," + (HEIGHT / 2) + ")")
		// 	.style("fill", (false) ? "url(#glisten-gradient)": "none")
		// 	.attr("title", "blah")
		// 	.attr('r', innerCircleRadius)
		// 	.transition()
		// 	.duration(6000)
		// 	.on("end", function() {
		// 		d3.select(this).remove();
		// 	})


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

	function buildIndicatorGradient( auto, manual, group) {
		//console.log("buildIndicatorGradient", d, value, group);
		var percFill = 0;

		if (manual === 0) {
			if (auto === 0) {
				return black;
			} else {
				// return getAutoColor(group, value.auto)
			}
		} else {
			percFill = 100 * manual / (manual + auto);
		}

	
		var autoColor = circleAutoLowColor;
		var manualColor = d3.rgb(255, 0, 0);

		// console.log("Percent Manual: ", percFill)


		var svg = d3.select("defs");

		var grad = svg.append('defs')
			.append('linearGradient')
			.attr("id", "indicator-gradient-" + group)
			.classed('indicator-gradients', true)
			.attr('x1', '0%')
			.attr('x2', '0%')
			.attr('y1', '100%')
			.attr('y2', '0%');

		grad.append('stop')
			.attr('offset', '0%')
			.attr('stop-opacity', '1')
			.attr('stop-color', manualColor) // light

		grad.append('stop')
			.attr('offset', percFill + '%')
			.attr('stop-opacity', '1')
			.attr('stop-color', manualColor)

		grad.append('stop')
			.attr('offset', percFill + '%')
			.attr('stop-opacity', '1')
			.attr('stop-color', autoColor);

		grad.append('stop')
			.attr('offset', '100%')
			.attr('stop-opacity', '1')
			.attr('stop-color', autoColor);

		return "url(#indicator-gradient-"+ group + ")"

	}

	function buildGlistenGradient(type) {
		var svg = d3.select("defs");

		var x1 = 0;
        var x2 = 0;
        var y1 = 0;
        var y2 = 0;

		switch (type) {
            case "left":
                x1 = 100;
                x2 = 0;
                y1 = 0;
                y2 = 0;
                break;
            case "right":
                x1 = 0;
                x2 = 100;
                y1 = 0;
                y2 = 0;
                break;
            case "up":
                x1 = 0;
                x2 = 0;
                y1 = 100;
                y2 = 0;
                break;
            case "down":
                x1 = 0;
                x2 = 0;
                y1 = 0;
                y2 = 100;
                break;
            case "top-left":
                x1 = 0;
                x2 = 100;
                y1 = 0;
                y2 = 100;
                break;

            default:
                x1 = 0;
                x2 = 0;
                y1 = 0;
                y2 = 0;
                break;
        }

		var grad = svg
			.append('linearGradient')
			.attr("id", "glisten-" + type + "-gradient")
			.classed('indicator-gradients', true)
			.attr('x1', x1 + '%')
			.attr('x2', x2 + '%')
			.attr('y1', y1 + '%')
			.attr('y2', y2 + '%');
	

		
		grad.append('stop')
			.attr('offset', '0')
			.attr('stop-opacity', '1')
			.attr('stop-color', circleAutoLowColor)
			.append("animate")
			// .attr("attributeName", "offset")
			// .attr("values", "0; 0")
			// .attr("dur", "1s")
			// .attr("repeatCount", "indefinite")

		grad.append('stop')
			.attr('offset', '0')
			.attr('stop-opacity', '0.1')
			.attr('stop-color', d3.rgb(255, 255, 255))
			.append("animate")
			.attr("attributeName", "offset")
			.attr("values", "0; 0.9; 0")
			.attr("begin", "0s")
			.attr("dur", "1s")
			.attr("repeatCount", "indefinite")

		grad.append('stop')
			.attr('offset', '0.1')
			.attr('stop-opacity', '1')
			.attr('stop-color', d3.rgb(255, 255, 255))
			.append("animate")
			.attr("attributeName", "offset")
			.attr("values", "0.1; 1; 0.1")
			.attr("begin", "0s")
			.attr("dur", "1s")
			.attr("repeatCount", "indefinite")



			
		grad.append('stop')
			.attr('offset', '0.1')
			.attr('stop-opacity', '0')
			.attr('stop-color', d3.rgb(255, 255, 255))
			.append("animate")
			.attr("attributeName", "offset")
			.attr("values", "0; 1; 0")
			.attr("begin", "0s")
			.attr("dur", "1s")
			.attr("repeatCount", "indefinite")

		return "url(#glisten-" + type + "-gradient)"
	}


	function addGlistenGradient( type) {

        var x1 = 0;
        var x2 = 0;
        var y1 = 0;
        var y2 = 0;

        var rotate = false;

        switch (type) {
            case "left":
                x1 = 100;
                x2 = 0;
                y1 = 0;
                y2 = 0;
                break;
            case "right":
                x1 = 0;
                x2 = 100;
                y1 = 0;
                y2 = 0;
                break;
            case "up":
                x1 = 0;
                x2 = 0;
                y1 = 100;
                y2 = 0;
                break;
            case "down":
                x1 = 0;
                x2 = 0;
                y1 = 0;
                y2 = 100;
                break;
            case "top-left":
                x1 = 0;
                x2 = 100;
                y1 = 0;
                y2 = 0;
                rotate = true;
                break;

            default:
                x1 = 0;
                x2 = 0;
                y1 = 0;
                y2 = 0;
                break;
        }

        var grad = d3.select("defs")
				.append('linearGradient')
				.attr("id", "glisten-" + type + "-gradient-2")
				.classed('indicator-gradients', true)
				.attr("gradientUnits", "userSpaceOnUse")
                .attr("gradientTransform", (rotate) ? "rotate(45 0 0)" : "rotate(0)")
				.attr('x1', x1 + '%')
				.attr('x2', x2 + '%')
				.attr('y1', y1 + '%')
				.attr('y2', y2 + '%');
	
			grad.append('stop')
				.attr('offset', '0')
				.attr('stop-opacity', '0')
				.attr('stop-color', d3.rgb(255, 255, 255))
	
			grad.append('stop')
				.attr('offset', '0')
				.attr('stop-opacity', '0.2')
				.attr('stop-color', d3.rgb(255, 255, 255))
				.append("animate")
				.attr("attributeName", "offset")
				.attr("values", "0; .8")
				.attr("dur", "2s")
                .attr("repeatCount", "indefinite")
                
			grad.append('stop')
				.attr('offset', '0')
				.attr('stop-opacity', '0.75')
				.attr('stop-color', d3.rgb(255, 255, 255))
				.append("animate")
				.attr("attributeName", "offset")
				.attr("values", ".1; .9")
				.attr("dur", "2s")
				.attr("repeatCount", "indefinite")
			
			grad.append('stop')
				.attr('offset', '0')
				.attr('stop-opacity', '0.2')
				.attr('stop-color', d3.rgb(255, 255, 255))
				.append("animate")
				.attr("attributeName", "offset")
				.attr("values", ".2; 1")
				.attr("dur", "2s")
                .attr("repeatCount", "indefinite")
	
			grad.append('stop')
				.attr('offset', '1')
				.attr('stop-opacity', '0')
				.attr('stop-color', d3.rgb(255, 255, 255))

        return "url(#glisten-" + type + "-gradient-2)";
    }

	

}



