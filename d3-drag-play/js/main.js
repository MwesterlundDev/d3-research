'use strict'

var Main = function() {

	var HEIGHT = 500,
		WIDTH = 1000,
		RECT_HEIGHT = 30;
	
	var svgMargin = {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10,
	}

	var plotColor = d3.rgb(0, 0, 0),
		rect1Color = d3.rgb(255, 0, 0 ),
		rect2Color = d3.rgb(255, 255, 0 ),
		rect3Color = d3.rgb(0, 255, 0 ),
		rect4Color = d3.rgb(0, 0, 255 ),
		brushColor = d3.rgb(120, 120, 120),
		tickColor = d3.rgb(50, 50, 50),
		textColor = d3.rgb(255, 255, 255);

	var xScale,
		yScale;

	var myObject = {
		start: 5,
		rect1: 10,
		rect2: 33,
		rect3: 26,
		rect4: 5,
	}	

	this.initialize = function() {
		
		console.group("Initialize")
		console.log("initialize")
		var mainSvg = d3.select("#test-svg")

		mainSvg.attr("height", HEIGHT)
			.attr("width", WIDTH)

		// background
		mainSvg.append("rect")
			.attr("x", svgMargin.left)
			.attr("y", svgMargin.top)
			.attr("height", HEIGHT - svgMargin.top - svgMargin.bottom)
			.attr("width", WIDTH - svgMargin.left - svgMargin.right)
			.style("fill", plotColor)
			
		createScales()
		
		var axisTicks = [];

		for ( var i = 0; i < 20; i++) {
			axisTicks.push(i * 5);
		}

		console.log("axisTicks: ", axisTicks)

		var ticks = mainSvg.selectAll(".tickLine")
			.data(axisTicks)
			.enter()

		ticks.append("line")
			.classed("tickLine", 1)
			.attr("x1", function(d) {
				// console.log("d: ", d)
				return xScale(d)  + svgMargin.left
			})
			.attr("x2",function(d) {
				return xScale(d)  + svgMargin.left
			})
			.attr("y1", svgMargin.top)
			.attr("y2", HEIGHT - svgMargin.bottom)
			.style("stroke", tickColor)
			.style("stroke-width", 1);

		var tickText = mainSvg.selectAll(".tickText")
			.data(axisTicks)
			.enter()
		
		tickText.append("text")
			.classed("tickText", 1)
			.attr("x",  function(d) {
				return xScale(d)  + svgMargin.left
			})
			.attr("y", svgMargin.top + 20)
			.attr("fill", brushColor)
			.style("text-align", "middle")
			.text(function(d) {
				return d;
			})
		
		
		console.groupEnd();
		
		update();
		// update2();
	}
		
	function update() {
		console.group("Update")
		var mainSvg = d3.select("#test-svg")

		var x = 0,
			startX = 0,
			rect1 = 0,
			rect2 = 0,
			rect3 = 0,
			rect4 = 0;

		var minStart = 3,
			min1 = 5,
			min2 = 0,
			min3 = 10,
			min4 = 0;
		
		var dragStartX = d3.drag()
			.on("start", function(d, i) {
				console.log("start")
				x = 0;

				startX = myObject.start;
				clearTooltips()
			}).on("drag", function(d,i) {
				// console.log("drag")
				// console.log("drag event: ", d3.event)
				var dx = d3.event.dx;			
				var deltaW = xScale(startX) + x + dx;

				if (deltaW < xScale(minStart)) {
					deltaW = xScale(minStart)
				} else {
					x += dx;
				}

				d3.selectAll(".postStart").attr("transform", "translate(" + x + ", 0 )")
				
				clearTooltips()
			}).on("end", function() {
				console.log("end")
				var newX = xScale.invert(x) + startX;
				myObject.start = newX;
				console.log("new x value: ", newX)
				clearTooltips()
				update();
			})

		

		var dragStartRect = d3.drag()
			.on("start", function(d, i) {
				console.log("start")
				x = 0;

				rect1 = myObject.rect1;
			}).on("drag", function(d,i) {
				// console.log("drag")
				// console.log("drag event: ", d3.event)
				var dx = d3.event.dx;			
				var deltaW = xScale(rect1) + x + dx;
				// console.log("deltaW: ", deltaW)
				if (deltaW < xScale(min1)) {
					deltaW = xScale(min1)
				} else {
					x += dx;
				}

				// if (newX < min1) {
				// 	x = 0;
				// }
				// actual movement
				d3.selectAll(".post1").attr("transform", "translate(" + x + ", 0 )")
				d3.select("#rect1").attr("width",deltaW)
				clearTooltips()
			}).on("end", function() {
				console.log("end")
				var newX = xScale.invert(x) + rect1;
				myObject.rect1 = newX;
				console.log("new x value: ", newX)
				update();
				clearTooltips()
			})

		var dragReconRect = d3.drag()
			.on("start", function(d, i) {
				console.log("start")
				x = 0;

				rect2 = myObject.rect2;
			}).on("drag", function(d,i) {
				// console.log("drag")
				// console.log("drag event: ", d3.event)
				var dx = d3.event.dx;			
				var deltaW = xScale(rect2) + x + dx;
				// console.log("deltaW: ", deltaW)
				if (deltaW < xScale(min2)) {
					deltaW = xScale(min2)
				} else {
					x += dx;
				}
				d3.selectAll(".post2").attr("transform", "translate(" + x + ", 0 )")
				d3.select("#rect2").attr("width", deltaW)

				clearTooltips()
			}).on("end", function() {
				console.log("end")
				var newX = xScale.invert(x) + rect2;
				myObject.rect2 = newX;
				console.log("new x value: ", newX)
				update();
				clearTooltips()
			})

		var dragManeuverRect = d3.drag()
			.on("start", function(d, i) {
				console.log("start")
				x = 0;

				rect3 = myObject.rect3;
			}).on("drag", function(d,i) {
				// console.log("drag")
				// console.log("drag event: ", d3.event)
				var dx = d3.event.dx;			
				var deltaW = xScale(rect3) + x + dx;
				// console.log("deltaW: ", deltaW)
				if (deltaW < xScale(min3)) {
					deltaW = xScale(min3)
				} else {
					x += dx;
				}

				d3.selectAll(".post3").attr("transform", "translate(" + x + ", 0 )")
				d3.select("#rect3").attr("width", deltaW)

				clearTooltips()
			}).on("end", function() {
				console.log("end")
				var newX = xScale.invert(x) + rect3;
				myObject.rect3 = newX;
				console.log("new x value: ", newX)
				update();
				clearTooltips()
			})

		var dragFightRect = d3.drag()
			.on("start", function(d, i) {
				console.log("start")
				x = 0;

				rect4 = myObject.rect4;
			}).on("drag", function(d,i) {
				// console.log("drag")
				// console.log("drag event: ", d3.event)
				var dx = d3.event.dx;			
				var deltaW = xScale(rect4) + x + dx;
				// console.log("deltaW: ", deltaW)
				if (deltaW < xScale(min4)) {
					deltaW = xScale(min4)
				} else {
					x += dx;
				}

				d3.selectAll(".post4").attr("transform", "translate(" + x + ", 0 )")
				d3.select("#rect4").attr("width", deltaW)

				clearTooltips()
			}).on("end", function() {
				console.log("end")
				var newX = xScale.invert(x) + rect4;
				myObject.rect4 = newX;
				console.log("new x value: ", newX)
				update();
				clearTooltips()
			})

		mainSvg.selectAll(".myRect").remove();
		mainSvg.selectAll(".dragTriangle").remove();
		mainSvg.selectAll(".dragLine").remove();

		mainSvg.append("rect")
			.attr("id", "rect1")
			.classed("myRect", 1)
			.classed("postStart", 1)
			.attr("x", xScale(myObject.start) + svgMargin.left)
			.attr("y", yScale(-RECT_HEIGHT / 2))
			.attr("height", RECT_HEIGHT)
			.attr("width", xScale(myObject.rect1))
			.style("fill", rect1Color)
			.attr("title", "x: <b>" + myObject.rect1 + "</b>")
			

		mainSvg.append("rect")
			.attr("id", "rect2")
			.classed("myRect", 1)
			.classed("postStart", 1)
			.classed("post1", 1)
			.attr("x", xScale(myObject.start + myObject.rect1) + svgMargin.left)
			.attr("y", yScale(-RECT_HEIGHT / 2))
			.attr("height", RECT_HEIGHT)
			.attr("width", xScale(myObject.rect2))
			.style("fill", rect2Color)
			.attr("title", "x: <b>" + myObject.rect2 + "</b>")
			

		mainSvg.append("rect")
			.attr("id", "rect3")
			.classed("myRect", 1)
			.classed("postStart", 1)
			.classed("post1", 1)
			.classed("post2", 1)
			.attr("x", xScale(myObject.start + myObject.rect1 + myObject.rect2) + svgMargin.left)
			.attr("y", yScale(-RECT_HEIGHT / 2))
			.attr("height", RECT_HEIGHT)
			.attr("width", xScale(myObject.rect3))
			.style("fill", rect3Color)
			.attr("title", "x: <b>" + myObject.rect3 + "</b>")
			

		mainSvg.append("rect")
			.attr("id", "rect4")
			.classed("myRect", 1)
			.classed("postStart", 1)
			.classed("post1", 1)
			.classed("post2", 1)
			.classed("post3", 1)
			.attr("x", xScale(myObject.start + myObject.rect1 + myObject.rect2 + myObject.rect3)  + svgMargin.left)
			.attr("y", yScale(-RECT_HEIGHT / 2))
			.attr("height", RECT_HEIGHT)
			.attr("width", xScale(myObject.rect4))
			.style("fill", rect4Color)
			.attr("title", "rect4 width: <b>" + myObject.rect4 + "</b>")
			
		
		mainSvg.append("path")
			.attr("id", "dragTriangle1")
			.classed("dragTriangle", 1)
			.classed("postStart", 1)
			.attr("d", generateTopTrianglePath(xScale(myObject.start) + svgMargin.left, yScale(-30)))
			.style("fill", brushColor)
			.attr("title", "x: <b>" + myObject.start + "</b>")
			.call(dragStartX)
			

		mainSvg.append("path")
			.attr("id", "dragTriangle2")
			.classed("dragTriangle", 1)
			.classed("postStart", 1)
			.classed("post1", 1)
			.attr("d", generateTopTrianglePath(xScale(myObject.start + myObject.rect1) + svgMargin.left, yScale(-30)))
			.style("fill", brushColor)
			.attr("title","x: <b>" + (myObject.start + myObject.rect1) + "</b>")
			.call(dragStartRect)

		mainSvg.append("path")
			.attr("id", "dragTriangle3")
			.classed("dragTriangle", 1)
			.classed("postStart", 1)
			.classed("post1", 1)
			.classed("post2", 1)
			.attr("d", generateTopTrianglePath(xScale(myObject.start + myObject.rect1 + myObject.rect2) + svgMargin.left, yScale(-30)))
			.style("fill", brushColor)
			.attr("title","x: <b>" + (myObject.start + myObject.rect1 + myObject.rect2) + "</b>")
			.call(dragReconRect)

		mainSvg.append("path")
			.attr("id", "dragTriangle4")
			.classed("dragTriangle", 1)
			.classed("postStart", 1)
			.classed("post1", 1)
			.classed("post2", 1)
			.classed("post3", 1)
			.attr("d", generateTopTrianglePath(xScale(myObject.start + myObject.rect1 + myObject.rect2 + myObject.rect3) + svgMargin.left, yScale(-30)))
			.style("fill", brushColor)
			.attr("title", "x: <b>" + (myObject.start + myObject.rect1 + myObject.rect2 + myObject.rect3) + "</b>")
			.call(dragManeuverRect)

		mainSvg.append("path")
			.attr("id", "dragTriangle5")
			.classed("dragTriangle", 1)
			.classed("postStart", 1)
			.classed("post1", 1)
			.classed("post2", 1)
			.classed("post3", 1)
			.classed("post4", 1)
			.attr("d", generateTopTrianglePath(xScale(myObject.start + myObject.rect1 + myObject.rect2 + myObject.rect3 + myObject.rect4) + svgMargin.left, yScale(-30)))
			.style("fill", brushColor)
			.attr("title", "x: <b>" + (myObject.start + myObject.rect1 + myObject.rect2 + myObject.rect3 + myObject.rect4) + "</b>")		
			.call(dragFightRect)

		mainSvg.append("line")
			.attr("id", "line1")
			.classed("dragLine", 1)
			.classed("postStart", 1)
			.attr("x1", xScale(myObject.start) + svgMargin.left)
			.attr("x2", xScale(myObject.start) + svgMargin.left)
			.attr("y1", yScale(-30))
			.attr("y2", yScale(RECT_HEIGHT / 2))
			.style("stroke", brushColor)
			.style("stroke-width", 2);

		mainSvg.append("line")
			.attr("id", "line2")
			.classed("dragLine", 1)
			.classed("postStart", 1)
			.classed("post1", 1)
			.attr("x1", xScale(myObject.start + myObject.rect1) + svgMargin.left)
			.attr("x2", xScale(myObject.start + myObject.rect1) + svgMargin.left)
			.attr("y1", yScale(-30))
			.attr("y2", yScale(RECT_HEIGHT / 2))
			.style("stroke", brushColor)
			.style("stroke-width", 2);

		mainSvg.append("line")
			.attr("id", "line3")
			.classed("dragLine", 1)
			.classed("postStart", 1)
			.classed("post1", 1)
			.classed("post2", 1)
			.attr("x1", xScale(myObject.start + myObject.rect1 + myObject.rect2) + svgMargin.left)
			.attr("x2", xScale(myObject.start + myObject.rect1 + myObject.rect2) + svgMargin.left)
			.attr("y1", yScale(-30))
			.attr("y2", yScale(RECT_HEIGHT / 2))
			.style("stroke", brushColor)
			.style("stroke-width", 2);

		mainSvg.append("line")
			.attr("id", "line4")
			.classed("dragLine", 1)
			.classed("postStart", 1)
			.classed("post1", 1)
			.classed("post2", 1)
			.classed("post3", 1)
			.attr("x1", xScale(myObject.start + myObject.rect1 + myObject.rect2 + myObject.rect3) + svgMargin.left)
			.attr("x2", xScale(myObject.start + myObject.rect1 + myObject.rect2 + myObject.rect3) + svgMargin.left)
			.attr("y1", yScale(-30))
			.attr("y2", yScale(RECT_HEIGHT / 2))
			.style("stroke", brushColor)
			.style("stroke-width", 2);

		mainSvg.append("line")
			.attr("id", "line5")
			.classed("dragLine", 1)
			.classed("postStart", 1)
			.classed("post1", 1)
			.classed("post2", 1)
			.classed("post3", 1)
			.classed("post4", 1)
			.attr("x1", xScale(myObject.start + myObject.rect1 + myObject.rect2 + myObject.rect3 + myObject.rect4) + svgMargin.left)
			.attr("x2", xScale(myObject.start + myObject.rect1 + myObject.rect2 + myObject.rect3 + myObject.rect4) + svgMargin.left)
			.attr("y1", yScale(-30))
			.attr("y2", yScale(RECT_HEIGHT / 2))
			.style("stroke", brushColor)
			.style("stroke-width", 2);

		console.log("xScale(100): ", xScale(100))

		console.groupEnd();

		setToolTips();
			
	}
	
	function setToolTips() {

		$(".dragTriangle, .myRect")
			.on(tooltip.handlers)   
			.tooltip(tooltip.BOTTOM);
	}

	function clearTooltips() {
        if ($('.tooltip'))
                $('.tooltip').remove()
    }

	function createScales() {

		// do nothing scale
		yScale = function (value) {
			var halfHeight = HEIGHT / 2;
			return value + halfHeight;
		}

		xScale = d3.scaleLinear()
		.domain([0, 100])
		.rangeRound([0, (WIDTH - svgMargin.right - svgMargin.left)]);
	}

	function generateTopTrianglePath(x, y) {
		
		var offset = 10;

		return "M " + x + " " + y +
			"L " + (x - offset) + " " + (y - offset) +
			"L " + (x + offset) + " " + (y - offset) +
			"L " + x + " " + y;
	}

}