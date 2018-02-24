'use strict';
/**
 * ajax request error handler
 */
$(document).ajaxError(function(event, jqxhr, settings, error) {
	event.preventDefault();
	var err_text = `[${jqxhr.status}] ${settings.url}`;
	swal({
		type: 'error',
		title: jqxhr.statusText,
		text: err_text,
		allowOutsideClick: false
	});
});

//places GeoJSON file url
var DATA_URL = 'data/coffees_GeoJSON.json';

/**
 * Knockout ViewModel: places list items
 */
function appViewModel() {
	var self = this;
	//input text
	self.filterInput = ko.observable("init");
	//current clicked list item
	self.currrentShopId = ko.observable(0);
	//trigger map marker click event when clicks left list item
	self.showThisMarker = function(shop) {
		self.currrentShopId(shop.id);
		MAP_CANVAS.triggerMarkerClickEvent(shop);
	};
	//custom places array
	self.coffee_shops = ko.observableArray([]);
	//filtered places
	self.filterShops = ko.computed(function() {

		var search = self.filterInput().toLowerCase();

		//filter map markers
		MAP_CANVAS.filterMarkers(search);

		return ko.utils.arrayFilter(self.coffee_shops, function(shop) {
			var title = shop.properties.title;
			return (title.toLowerCase().indexOf(search) >= 0);
		});

	});
}


$(document).ready(function() {



	//load Geo data from JSON file
	var request = $.ajax({
		url: DATA_URL,
		dataType: 'json',
		method: 'GET'

	}).done(function(data, textStatus, jqXHR) {

		/**init map*/
		MAP_CANVAS.init('map');
		MAP_CANVAS.render(data);

		/**init Knockout observer*/
		var vm = new appViewModel();
		//add custom places to observer
		vm.coffee_shops = data.features;
		//trigger filterArray observer in order to display all places by default
		vm.filterInput("");
		ko.applyBindings(vm);

	});

});