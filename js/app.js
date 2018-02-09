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


/**
 * Knockout ViewModel
 */
function appViewModel() {
	var self = this;
	//
	self.filterInput = ko.observable("init");
	//current clicked list item
	self.currrentShopId = ko.observable(0);
	//trigger map marker click event when clicks left list item
	self.showThisMarker = function(shop) {
		self.currrentShopId(shop.id);
		map_canvas.triggerMarkerClickEvent(shop);
	};
	//custom places array
	self.coffee_shops = ko.observableArray([]);
	//filtered places
	self.filterShops = ko.computed(function() {

		var search = self.filterInput().toLowerCase();

		//filter map markers
		map_canvas.filterMarkers(search);

		return ko.utils.arrayFilter(self.coffee_shops, function(shop) {
			var title = shop.properties.title;
			return (title.toLowerCase().indexOf(search) >= 0);
		});

	});
}

/**
 *
 */
$(document).ready(function() {

	//load Geo data from JSON file
	$.ajax({
		url: 'data/places_GeoJSON.json',
		dataType: 'json',
		async: false,
		success: function(data) {

			/**init map*/
			map_canvas.init();
			map_canvas.render(data);

			/**init Knockout observer*/
			var vm = new appViewModel();
			//add custom places to observer
			vm.coffee_shops = data.features;
			//trigger filterArray observer in order to display all places by default
			vm.filterInput("");
			ko.applyBindings(vm);

		}
	});


});