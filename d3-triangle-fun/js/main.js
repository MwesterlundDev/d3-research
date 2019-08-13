'use strict'

var Main = function() {

	var Y_MAX = 15,
		X_MAX = 15;
	
	var svgMargin = {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10,
	}

	var xScale = {},
		yScale = {};

	var plotColor = d3.rgb(255, 255, 255),
		plotLineColor = d3.rgb(150, 200, 255),
		red = d3.rgb(255, 0 , 0),
		green = d3.rgb(0, 255, 0),
		blue = d3.rgb(0, 0, 255),
		black = d3.rgb(0, 0, 0),
		yellow = d3.rgb(255, 255, 0),
		cyan = d3.rgb(0, 255, 255),
		magenta = d3.rgb(255, 0, 255);

	var domainScale = 15;

	var trianglePoints = [];
	var triangleLines = [];
	var perpBisectors = [];

	var VERTEX = "vertext",
		MID_POINT = "mid_point";
	
	var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"]

	this.initialize = function() {		
		console.log("initialize");
		
		generateTriangle();

		// add origin?
		var origin = {
			id: "origin",
			x: 0,
			y: 0,
			type: VERTEX,
		}

		// fix later
		// riddlerExpress(10);

		// trianglePoints.push(origin)
		
		update();

		// ui click stuff
		$("#plus").on('click', function() {
			domainScale++;
			update()
		})

		$("#minus").on('click', function() {
			domainScale--;
			if (domainScale < 1) {
				domainScale = 1;
			}
			update()
		})

		$( "#slider" ).slider({
			orientation: "vertical",
			range: "min",
			min: 1,
			max: 100,
			value: domainScale,
			slide: function( event, ui ) {
				domainScale = ui.value;
				update();
			}
		});

		$("#refresh").on("click", function() {
			trianglePoints = [];
			triangleLines = [];

			generateTriangle();

			// add origin?
			var origin = {
				id: "origin",
				x: 0,
				y: 0,
				type: VERTEX,
			}

			trianglePoints.push(origin)

			update();

		})

	}

	function update() {

		console.log("domainScale: ", domainScale)

		var height = $("#test-svg").height() - svgMargin.top - svgMargin.bottom;
		var width = $("#test-svg").width() - svgMargin.left - svgMargin.right;

		var xDomain = (width / (domainScale *2))

		console.log("domains: ", xDomain)

		xScale = d3.scaleLinear()
				.domain([-xDomain, xDomain])
				.rangeRound([svgMargin.left, width + svgMargin.left]);

		var yDomain = (height / (domainScale *2))

		yScale = d3.scaleLinear()
				.domain([yDomain, -yDomain])
				.rangeRound([svgMargin.top, height + svgMargin.top]);

		var mainSvg = d3.select("#test-svg");

		mainSvg.append("rect")
			.attr("x", svgMargin.left)
			.attr("y", svgMargin.top)
			.attr("height", height)
			.attr("width", width)
			.style("fill", plotColor);

		mainSvg.selectAll(".plotLine").remove();

		mainSvg.append("line")
			.classed("plotLine", 1)
			.attr("x1", xScale(-xDomain))
			.attr("x2", xScale(xDomain))
			.attr("y1", yScale(0))
			.attr("y2", yScale(0))
			.style("stroke-width", "2px")
			.style("stroke", plotLineColor);
		
		mainSvg.append("line")
			.classed("plotLine", 1)
			.attr("x1", xScale(0))
			.attr("x2", xScale(0))
			.attr("y1", yScale(-yDomain))
			.attr("y2", yScale(yDomain))
			.style("stroke-width", "2px")
			.style("stroke", plotLineColor);

		var xLines = [];
		for (var i = 0; i <= xDomain; i +=1) {
			xLines.push(i);
			xLines.push(-i);
		}

		var yLines = [];
		for (var i = 0; i <= yDomain; i +=1) {
			yLines.push(i);
			yLines.push(-i);
		}

		var xLines = mainSvg.selectAll(".xLines")
			.data(xLines)
			.enter();

		xLines.append("line")
			.classed("xLines", 1)
			.classed("plotLine", 1)
			.attr("x1", function(d) {
				return xScale(d); 
			})
			.attr("x2", function(d) {
				return xScale(d); 
			})
			.attr("y1", yScale(-yDomain))
			.attr("y2", yScale(yDomain))
			.style("stroke-width", "1px")
			.style("stroke", plotLineColor);
		
		var yLines = mainSvg.selectAll(".yLines")
			.data(yLines)
			.enter();

		yLines.append("line")
			.classed("yLines", 1)
			.classed("plotLine", 1)
			.attr("y1", function(d) {
				return yScale(d); 
			})
			.attr("y2", function(d) {
				return yScale(d); 
			})
			.attr("x1", xScale(-xDomain))
			.attr("x2", xScale(xDomain))
			.style("stroke-width", "1px")
			.style("stroke", plotLineColor);

		console.log("Update.Points: ", trianglePoints);

		// draw points;
		mainSvg.selectAll(".triangle").remove();

		// draw sides first  
		// triangle sides
		var sides = mainSvg.selectAll(".side")
			.data(triangleLines)
			.enter();

		sides.append("line")
			.attr("id", function(d, i) {
				return "side-" + d.id;
			})
			.classed("side", 1)
			.classed("triangle", 1)
			.attr("y1", function(d) {
				return yScale(d.a.y); 
			})
			.attr("y2", function(d) {
				return yScale(d.b.y); 
			})
			.attr("x1", function(d) {
				return xScale(d.a.x); 
			})
			.attr("x2", function(d) {
				return xScale(d.b.x); 
			})
			.style("stroke-width", "2px")
			.style("stroke", black)
			.attr("title", function(d) {
				return getLineTooltip(d);
			})

		var pointDots = mainSvg.selectAll(".dot")
			.data(trianglePoints)
			.enter();

		pointDots.append("circle")
			.attr("id", function(d, i) {
				return "dot-" +d.id;
			})
			.classed("dot", 1)
			.classed("triangle", 1)
			.attr("cx", function(d) {
				return xScale(d.x);
			})
			.attr("cy", function(d) {
				return yScale(d.y);
			})
			.attr("r", 4)
			.style("fill", function(d) {
				if (d.type === VERTEX) {
					return black;
				} else if (d.type === MID_POINT) {
					return red;
				}
			})
			.attr("title", function(d) {
				return d.id + ": (" + d.x + ", " + d.y + ")";
			})

		// add Text
		var dotLabel = mainSvg.selectAll(".dot-label")
			.data(trianglePoints)
			.enter();
		
		dotLabel.append("text")
			.attr("id", function(d, i) {
				return "dot-text-" +d.id;
			})
			.classed("dot-text", 1)
			.classed("triangle", 1)
			.attr("x", function(d) {
				return xScale(d.x) + 3;
			})
			.attr("y", function(d) {
				return yScale(d.y);
			})
			.text(function(d) {
				return d.id;
			})
			.style("fill", function(d) {
				if (d.type === VERTEX) {
					return black;
				} else if (d.type === MID_POINT) {
					return red;
				}
			})
			.attr("title", function(d) {
				return d.id + ": (" + d.x + ", " + d.y + ")";
			})

		var xFake =  100000
		console.log("perp bisectors: ", perpBisectors)
		var bisectors = mainSvg.selectAll(".bisector")
			.data(perpBisectors)
			.enter();

		bisectors.append("line")
			.attr("id", function(d, i) {
				return "side-" + d.id;
			})
			.classed("bisector", 1)
			.classed("triangle", 1)
			.attr("y1", function(d) {
				var y = d.slope * -xFake + d.b
				return yScale(y); 
			})
			.attr("y2", function(d) {
				var y = d.slope * xFake + d.b
				return yScale(y); 
			})
			.attr("x1", function(d) {
				return xScale(-xFake); 
			})
			.attr("x2", function(d) {
				return xScale(xFake); 
			})
			.style("stroke-width", "2px")
			.style("stroke", red)
			.attr("title", function(d) {
				return getLineTooltip(d);
			})


		setTooltips();

	}

	// sets "points" to 3 randomn points
	function generateTriangle() {
		console.log("Generate Points");

		for (var i = 0; i < 3; i++) {
			var point = {
				id: letters[i],
				x: getRandomInt(-X_MAX, X_MAX),
				y: getRandomInt(-Y_MAX, Y_MAX),
				type: VERTEX,
			}

			trianglePoints.push(point)
		}

		triangleLines.push({
			id: "A-B",
			a: trianglePoints[0],
			b: trianglePoints[1]
		})

		triangleLines.push({
			id: "B-C",
			a: trianglePoints[1],
			b: trianglePoints[2]
		})

		triangleLines.push({
			id: "A-C",
			a: trianglePoints[0],
			b: trianglePoints[2]
		})
		console.log("Points: ", trianglePoints)
		console.log("Points: ", triangleLines)

		calculateLineProperties();

	}

	function calculateLineProperties() {
		console.log("calculate Slopes")

		perpBisectors = [];

		triangleLines.forEach(function(line, i){

			var xComponent = (line.b.x - line.a.x)
			var yComponent = (line.b.y - line.a.y)

			var point = {
				id: letters[i+3],
				x: line.a.x + (xComponent/2),
				y: line.a.y + (yComponent/2),
				type: MID_POINT,
			}

			trianglePoints.push(point);
			
			var slope = yComponent / xComponent;
			var length = Math.sqrt(xComponent * xComponent + yComponent * yComponent);
			
			
			var b = point.y - (-1 / slope) * point.x

			perpBisectors.push({
				slope: -1/slope,
				b: b
			})

			line.xComponent = xComponent;
			line.yComponent = yComponent;
			line.length = length;
			line.slope = slope;
			line.perpSlope = -1/slope;
		})
	}

	function setTooltips() {
		$(".triangle")
			.on(tooltip.handlers)
			.tooltip(tooltip.BOTTOM);
	}

	function getLineTooltip(d) {
		var tip = "";
		
		for (var prop in d) {
			tip += prop + ": " + d[prop] + "</br>"
		}

		return tip;
	} 

	function riddlerExpress (rounds) {
		var ralph = 2;
		var mark = 1;

		var markWin = 0;
		var ralphWin = 0;

		for (var i = 0; i < rounds; i++) {

			var winner = play(ralph, mark, getRandomInt(1,3));

			if (winner === "mark") {
				markWin++;
			} else {
				ralphWin++;
			}
		} 

		console.log("Ralph Wins: ", ralphWin);
		console.log("Mark Wins: ", markWin);
		console.log("Rounds: ", rounds);
		console.log("Ralph %: ", ralphWin / rounds);
		console.log("Mark %: ", markWin / rounds);

	}

	function play(ralph, mark, random) {

		if (random % 3 != 0) {
			mark--;
			ralph++;
		} else {
			ralph--;
			mark++;
		}

		if (mark == 0) {
			return "ralph";
		} else {
			return "mark";
		}

		// if (mark != 0 && ralph != 0) {
		// 	return play(ralph, mark, getRandomInt(1,3));
		// } else {
		// 	if (mark === 0) {
		// 		return "ralph";
		// 	} else {
		// 		return "mark";
		// 	}
		// }
	}


}