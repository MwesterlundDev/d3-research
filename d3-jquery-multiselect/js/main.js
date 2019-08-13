'use strict';

var Main = function () {

	/*
	Dropdown with Multiple checkbox select with jQuery - May 27, 2013
	(c) 2013 @ElmahdiMahmoud
	license: https://www.opensource.org/licenses/mit-license.php
*/

	var isOpen = false;

	this.initialize = function () {
		update();
	}

	var slideUp = function () {
		$(this).parent().find(".dropdown").hide();
		$(this).unbind('click');
	}

	// hide div if something is clicked
	$(document).bind('click', function (e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("dropdown")) $(".dropdown").hide();
	});


	var initializeDropdown = function (threat, options) {
		var id = "#rp-multiselect-" + threat.id;

		$(id).addClass("multiselect");
		$(id).append('<div class="select"></div>');

		console.log("id: ", id)

		$(id).find('.select').append('<label class="placeholder">' + options.placeholder + '</label>').css("color", "rgb(100, 100, 100);");
		$(id).find('.select').append('<div class="select-down"></div>');

		$(id).append('<div class="dropdown"></div>');
		$(id).find('.dropdown').append('<ul></ul>');

		options.options.forEach(function (option) {
			$(id).find('.dropdown ul').append('<li><input type="checkbox" value="' + option.value + '"/>' + option.name + '</li>');
		});

		$(".select-down").on('click', function (event) {
			console.log("select-down click")
			event.stopPropagation();
			$(this).parent().parent().find('.dropdown').show();;
			$(this).parent().on("click", slideUp);
		});

		$(id).find(".dropdown input[type=checkbox]").on('click', function () {

			threat.assessments = [];
			var title = "";

			$(this).closest('.dropdown').find("input:checked").each(function () {
				console.log("this: ", this);

				threat.assessments.push($(this).val());
				
				var index = findIndexByValue(options.options, "value", $(this).val())

				title += '<span class="selected">' + options.options[index].name + "; </span>";
			});

			console.log("NO ASSESSMENTS", threat.assessments.length);
			if (threat.assessments.length <= 0 ){
				console.log("NO ASSESSMENTS");
				title = options.placeholder;
			}

			console.log("threat: ", threat);

			$(this).closest(".multiselect").find('label').html(title);
		});
	}

	var update = function () {

		var threatTypes = [{
				value: "earliest",
				name: "Earliest possible Engagement"
			},
			{
				value: "include",
				name: "Include Details Page"
			},
			{
				value: "dangerous",
				name: "Most Dangerous"
			},
			{
				value: "likely",
				name: "Most Likely"
			}
		];

		var options = {
			placeholder: "Don't include",
			options: threatTypes
		};

		var threats = [{
				id: 1,
				name: "threat-1",
				assessments: [],
				isActive: true,
				isEarly: true,
				isDangerous: false
			},
			{
				id: 2,
				name: "threat-2",
				assessments: [],
				isActive: true,
				isEarly: false,
				isDangerous: false
			},

			{
				id: 3,
				name: "threat-3",
				assessments: [],
				isActive: false,
				isEarly: false,
				isDangerous: true
			},
			{
				id: 4,
				name: "threat-4",
				assessments: [],
				isActive: true,
				isEarly: false,
				isDangerous: false
			},
			{
				id: 5,
				name: "threat-5",
				assessments: [],
				isActive: false,
				isEarly: false,
				isDangerous: false
			}
		];

		var threatDiv = d3.select("#threat-rows");
	
		threatDiv.selectAll('.rp-threat-row').remove();

		var threatRowEnter = threatDiv.selectAll(".rp-threat-row")
			.data(threats)
			.enter();

		var threatRow = threatRowEnter.append('div')
			.attr("id", function(d) {
				return "rp-threat-row-" + d.id;
			})
			.classed('acove-popup-subgroup',1)
			.classed('rp-threat-row', 1);
		
		threatRow.append("div")
			.attr("id", function(d) {
				return "rp-finding-toggle-right-" + d.id;
			})
			.classed("tri-right", 1)
			.on('click', function(d) {
				$("#rp-threat-findings-" + d.id).show();
				$("#rp-finding-toggle-down-" + d.id).show();
				$("#rp-finding-toggle-right-" + d.id).hide();
				
				// console.log("click toggle right");
			});

		threatRow.append("div")
			.attr("id", function(d) {
				return "rp-finding-toggle-down-" + d.id;
			})
			.classed("tri-down", 1)
			.style("display", "none")
			.on('click', function(d) {
				$("#rp-threat-findings-" + d.id).hide();
				$("#rp-finding-toggle-down-" + d.id).hide();
				$("#rp-finding-toggle-right-" + d.id).show();

				// console.log("Click toggle down");
			});
			
		threatRow.append("label")
			.attr("id", function(d) {
				return "rp-threat-label-" + d.id;
			})
			.classed("rp-threat-label", 1)
			.text(function(d) {

				var recentCount = 0;
				return d.name + " (" + recentCount + ")"; // will be count of indicators
			});

		threatRow.append("div")
			.attr("id", function(d) {
				return "rp-multiselect-" + d.id;
			});
			

		threats.forEach(function(threat) {
			initializeDropdown(threat, options);


			if (threat.isEarly) {
				threat.assessments.push("earliest");
				$("#rp-multiselect-" + threat.id + " input[value=earliest]" ).prop("checked", true);
			}
			
			if (threat.isActive) {
				threat.assessments.push("likely");
				$("#rp-multiselect-" + threat.id + " input[value=likely]" ).prop("checked", true);
			}

			if (threat.isDangerous) {
				threat.assessments.push("dangerous");
				$("#rp-multiselect-" + threat.id + " input[value=dangerous]" ).prop("checked", true);
			}

			if (threat.assessments.length > 0) {
				var title = "";

				threat.assessments.forEach(function(assessment) {
					var index = findIndexByValue(threatTypes, "value", assessment);
					title += '<span class="selected">' + threatTypes[index].name + "; </span>";
				});

				$("#rp-multiselect-" + threat.id + " .select label").html(title);
			}

		});


	}

};