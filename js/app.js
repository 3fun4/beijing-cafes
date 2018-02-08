'use strict';



//fix: map canvas not showing in bootstrap 'main'
$(window).resize(function() {
	//set height
	var h = $(window).height(),
		offsetTop = 60; // Calculate the top offset

	$('#map').css('height', (h - offsetTop));

	//set width
	//TODO: //responsive
	var w = $(window).width();
	var sidebar_sticky_width = 300;
	$('#map').css('width', (w - sidebar_sticky_width));
}).resize();



var coffee_shops = [];

function appViewModel() {
	var self = this;
	self.filterInput = ko.observable("init");

	self.currrentShopId = ko.observable(0);
	self.showThisMarker = function(shop) {
		self.currrentShopId(shop.id);
	};

	self.coffee_shops = ko.observableArray([]);
	self.filterShops = ko.computed(function() {

		var search = self.filterInput().toLowerCase();
		console.log("search=" + search);
		//filter map markers
		map_canvas.filterMarkers(search);

		return ko.utils.arrayFilter(self.coffee_shops, function(shop) {
			var title = shop.properties.title;
			return (title.toLowerCase().indexOf(search) >= 0);
		});

	});
}

$(document).ready(function() {

	//load Geo data from JSON file
	$.ajax({
		url: 'data/places_GeoJSON.json',
		dataType: 'json',
		async: false,
		success: function(data) {

			console.log(data.features);
			//init map
			map_canvas.init();
			map_canvas.render(data);

			//
			var vm = new appViewModel();
			vm.coffee_shops = data.features;
			vm.filterInput("");
			ko.applyBindings(vm);

		}
	});

	/*        //append left list
	            var left_list = $('#left_list');
	            map.data.forEach(function(feature) {
	              left_list.append(`<li class="nav-item"
	                  data-id="${feature.getId()}"
	                  data-title="${feature.getProperty('title')}"
	                  data-lat="${feature.getGeometry().get().lat()}"
	                  data-lng="${feature.getGeometry().get().lng()}"
	                  >
	                  <a class="nav-link" href="#">${feature.getProperty('title')}</a>
	                  </li>`);
	            });
	            //bind list item click event
	            $('#left_list li').each(function(index, value) {
	              $(this).on('click', function() {
	                console.log($(this).data('title') + ':' + $(this).data('lat') + ',' + $(this).data('lng'));
	                $(this).find('a').toggleClass('active');
	              });
	            });
	//input changes, set map markers visibility
	$('#zoom-to-area-text').on('input', function() {
		var val = $(this).val();
		map_canvas.filterMarkers(val);

	});*/

});

/**
 *
 */