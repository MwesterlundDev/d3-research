'use strict'

var Main = function() {

	var HEIGHT = 500,
		WIDTH = 800;
	
	var points = [];

	var xDomain = 32;
	var yDomain = 32;
	var radius = 4;

	
	var svgMargin = {
		top: 10,
		right: 100,
		bottom: 10,
		left: 10,
	}
	
	var randomNormal = d3.randomNormal()
	
	function getNormalRandomInt(max) {
		return  (randomNormal() + 3) /6 * max;
	}
	
	function getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}

	var plotStroke = d3.rgb(80, 80, 80);
	var circleColor = d3.rgb(73, 123, 194);

	var mainSvg,
		xScale,
		yScale;
	
	
	this.initialize = function() {
		
		console.log("initialize");
		mainSvg = d3.select("#test-svg");
	
		mainSvg.attr("height", HEIGHT + svgMargin.top + svgMargin.bottom)
			.attr("width", WIDTH + svgMargin.left + svgMargin.right)
	
		mainSvg.append("rect")
			.attr("x", svgMargin.left)
			.attr("y", svgMargin.top)
			.attr("height", HEIGHT)
			.attr("width", WIDTH - svgMargin.right)
			.style("fill", "transparent")
			.style("stroke", plotStroke);

		d3.csv("data/US_births_1994-2014.csv", function(error, data) {

			console.log("myData: ", data[0]);

			var filteredData = data.filter(function(d) {
				return true;
				// return d.month == 4;
				// return d.month == 2;
				// return d.month == 10;
				// return d.day_of_week == 3;
				// return d.day_of_week == 5 && d.month == 10;
			});

			update(filteredData);

		});
	}

	function update(data) {
				
		var births = data.map(function(d) {
			return Number(d.births);
		});

		var birthsByDate = d3.nest()
			.key(function(d) { return d.date_of_month})
			.entries(data)
		
		console.log(birthsByDate)

		var aveByDate = birthsByDate.map(function(d) {
			
			var value = 0;

			d.values.forEach(function(count) {
				value += Number(count.births);
			});
			
			var average = value / d.values.length;
			
			return {
				key: Number(d.key),
				value: average
			};
		});

		console.log("Ave by date", aveByDate);

		console.log('births: ', births)

		var maxBirths = d3.max(births);
		var minBirths = d3.min(births);
		var aveBirths = d3.mean(births);
		var median = d3.median(births);

		console.log("maxBirths: ", maxBirths);
		console.log("minBirths: ", minBirths);
		console.log("aveBirths: ", aveBirths);
		console.log("median: ", median);
		
		xScale = d3.scaleLinear()
			.domain([0, xDomain])
			.rangeRound([svgMargin.left, WIDTH + svgMargin.left - svgMargin.right])
			.clamp(true);
	
		yScale = d3.scaleLinear()
			.domain([maxBirths, minBirths])
			.rangeRound([svgMargin.top, HEIGHT + svgMargin.top - svgMargin.bottom])
			.clamp(true);

		var colorScale = d3.scaleLinear()
			.domain([1, 4, 8, 12])
			.range(["blue", "green", "yellow", "red"]);

		console.log("colorscale: ", colorScale(data[23].births));

		mainSvg.selectAll(".dot").remove();

		var pointDots = mainSvg.selectAll(".dot")
				.data(data)
				.enter();

		pointDots.append("circle")
			.attr("id", function(d, i) {
				return "dot-" + d.year + "-" + d.month + "-" + d.date_of_month;
			})
			.classed("dot", 1)
			.classed("triangle", 1)
			.attr("cx", function(d) {
				return xScale(d.date_of_month);
			})
			.attr("cy", function(d) {
				return yScale(d.births);
			})
			.attr("r", radius) // circle radius
			.style("fill", function(d) {

				return colorScale(d.month);
			}) // color
			.style("opacity", ".4") // opacity
			// .style("stroke", d3.rgb(255, 255, 255))
			.on('mouseover', function(d) {
				// show tooltip
				var tip = "Date: " + d.month + "/" + d.date_of_month + "/" + d.year + "<br>" +
					"Births: " + d.births + "<br>";

				$("#tooltip").html(tip);
				makeLine(d.births);

			})
			.on('mouseout', function() {
				mainSvg.selectAll(".value").remove();
				$("#tooltip").html("");
			});

		var averageDots = mainSvg.selectAll(".dot-ave")
			.data(aveByDate)
			.enter();

		averageDots.append('circle')
			.attr("id", function(d) {return "ave-" + d.key})
			.attr("cx", function(d) {
				return xScale(d.key);
			})
			.attr("cy", function(d) {
				return yScale(d.value);
			})
			.attr("r", 6) // circle radius
			.style("fill", d3.rgb(255, 225, 225))
			.style("stroke", d3.rgb(255, 255, 255))
			.on('mouseover', function(d) {
				// show tooltip
				var tip = "Date: " + d.key + "<br>" +
					"Births: " + d.value.toFixed(2) + "<br>";

				$("#tooltip").html(tip);
				makeLine(d.value);

			})
			.on('mouseout', function() {
				mainSvg.selectAll(".value").remove();
				$("#tooltip").html("");
			});

		mainSvg.append('line')
			.attr("id", "median-line")
			.attr('x1', xScale(0))
			.attr('x2', xScale(xDomain))
			.attr('y1', yScale(median))
			.attr('y2', yScale(median))
			.style('stroke', plotStroke);
		
		mainSvg.append('line')
			.attr("id", "mean-line")
			.attr('x1', xScale(0))
			.attr('x2', xScale(xDomain))
			.attr('y1', yScale(aveBirths))
			.attr('y2', yScale(aveBirths))
			.style('stroke', plotStroke);
		
		// mainSvg.append('text')
		// 	.attr("id", "median-line")
		// 	.attr('x', xScale(xDomain) + 2)
		// 	.attr('y', yScale(median))
		// 	.attr("text-anchor", 'start')
		// 	.style('fill', "white")
		// 	.style('font-size', 10)
		// 	.text("Median: " + median);
		
		// mainSvg.append('text')
		// 	.attr("id", "median-line")
		// 	.attr('x', xScale(xDomain) + 2)
		// 	.attr('y', yScale(aveBirths))
		// 	.attr("text-anchor", 'start')
		// 	.style('fill', "white")
		// 	.style('font-size', 10)
		// 	.text("Average: " + aveBirths.toFixed(2));

	}

	function makeLine(value) {

		mainSvg.selectAll(".value").remove();

		mainSvg.append('line')
			.attr("id", "line-" + value)
			.classed("value", 1)
			.attr('x1', xScale(0))
			.attr('x2', xScale(xDomain))
			.attr('y1', yScale(value))
			.attr('y2', yScale(value))
			.style('stroke', "white");
		
		mainSvg.append('text')
			.attr("id", "text-line")
			.classed("value", 1)
			.attr('x', xScale(xDomain) + 2)
			.attr('y', yScale(value))
			.attr("text-anchor", 'start')
			.style('fill', "white")
			.style('font-size', 10)
			.text("Value: " + Number(value).toFixed(2));
	}
	
}