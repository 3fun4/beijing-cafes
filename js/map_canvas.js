'use strict';

/**
 *
 */
var MAP_CANVAS = MAP_CANVAS || (function() {

	var self = {};

	/**google.map object*/
	var map;
	//map center
	var _LATLNG_CENTER = {
		lat: 39.941165,
		lng: 116.395888
	};
	//map markers
	var _MARKERS = [];
	//current clicked marker
	var _CLICKED_MARKER;
	//marker's icon
	var _ICON_DEFAULT = 'image/coffee.png';
	var _ICON_CLICKED = 'image/coffee_clicked.png';
	//infoWindow
	var _INFO_WINDOW;

	/**
	 * initial google.map
	 */
	self.init = function() {

		map = new google.maps.Map(document.getElementById('map'), {
			center: _LATLNG_CENTER,
			zoom: 13,
			mapTypeControl: false,
			streetViewControl: false
		});
		//reset map center when window resizes
		google.maps.event.addDomListener(window, "resize", function() {
			var center = map.getCenter();
			google.maps.event.trigger(map, "resize");
			map.setCenter(center);
		});
		//info window
		_INFO_WINDOW = new google.maps.InfoWindow();
	};
	/**
	 * get base url from a url string
	 * @param url
	 */
	var getBaseURL = function(url) {
		var baseUrl = '';
		var url_arr = url.split('/');
		if (url_arr[2].split('.').length > 2 && url_arr[2].indexOf('www') < 0) {
			baseUrl = url_arr[0] + "//www." + url_arr[2].split('.')[1] + '.' + url_arr[2].split('.')[2];
		} else {
			baseUrl = url_arr[0] + '//' + url_arr[2];
		}
		return baseUrl;
	};

	/**
	 * render the map with custom places
	 * @param data {Array} places' GeoJSON data
	 */
	self.render = function(data) {
		//load data to map
		var features = map.data.addGeoJson(data);
		//set default marker icon to invisible
		map.data.setStyle(function(feature) {
			return {
				visible: false
			};
		});

		//infoWindow close event addListener
		google.maps.event.addListener(_INFO_WINDOW, 'closeclick', function() {
			setClickedMarker(null);
		});

		//add custom markers to map
		map.data.forEach(function(feature) {

			var marker = new google.maps.Marker({
				position: feature.getGeometry().get(),
				title: feature.getId() + '-' + feature.getProperty('title'),
				icon: _ICON_DEFAULT,
				map: map,
				draggable: false,
				animation: google.maps.Animation.DROP
			});
			//marker click event addListener
			google.maps.event.addListener(marker, 'click', function() {

				//info window html
				var infoHTML_openhours = '';
				if (feature.getProperty('open_hours') && feature.getProperty('open_hours') != '') {
					infoHTML_openhours = `<p style="width: 250px;"><i class="far fa-clock"></i> ${feature.getProperty('open_hours')}</p>
										`;
				}
				var infoHTML_links = '<p><i class="fa fa-link"></i> ';
				var links = feature.getProperty('links');
				if (links) {
					for (var i = 0; i < links.length; i++) {
						var url = links[i];
						var baseUrl = getBaseURL(url);
						infoHTML_links += ` <a target = "_blank" href = "${url}"  title = "${url}"><img src = "${baseUrl}/favicon.ico" style = "width:16px;height:16px;" ></a>`;
					}
				}
				var infoHTML = `<div class="card box-shadow border-0">
									<div class="card-img-top">
										<div class="info-card border-top border-bottom">
										<img class="img-fluid" src="${feature.getProperty('url_image')?feature.getProperty('url_image'):""}" >
										</div>
									</div>
									<div class="card-body">
										<h6>${feature.getProperty('title')}</h6>
										<p><i class="fa fa-map-marker-alt"></i> ${feature.getProperty('address')}</p>
										${infoHTML_openhours}
										${infoHTML_links}
									</div>
								</div>
								`;

				_INFO_WINDOW.setContent(infoHTML);
				_INFO_WINDOW.open(map, marker);
				//change marker icon
				setClickedMarker(marker);
			});
			// save the info we need to use later for the side_bar click event
			_MARKERS.push(marker);

		});


	};
	/**
	 * filter markers by title
	 * @param val title
	 */
	self.filterMarkers = function(val) {
		//if info window is open, close it and set clicked marker to null
		if (_CLICKED_MARKER) {
			//clear clicked marker
			setClickedMarker(null);
			//trigger info window close event
			_INFO_WINDOW.close();
		}
		//filter markers
		if (val) {
			for (var i = 0; i < _MARKERS.length; i++) {
				var marker = _MARKERS[i];
				var title = marker.title;
				if (title.toLowerCase().indexOf(val.toLowerCase()) >= 0) {
					marker.setVisible(true);
				} else {
					marker.setVisible(false);
				}
			}
		} else {
			for (var i = 0; i < _MARKERS.length; i++) {
				var marker = _MARKERS[i];
				marker.setVisible(true);
			}
		}
	};
	/**
	 * trigger marker click event
	 * @param shop
	 */
	self.triggerMarkerClickEvent = function(shop) {
		map.data.forEach(function(feature) {
			if (shop.id === feature.getId()) {
				var thisTitle = shop.id + '-' + feature.getProperty('title');
				var markerToClick = getMarker(thisTitle);
				google.maps.event.trigger(markerToClick, 'click');

			}
		});
	};
	/**
	 * get coresponding marker by marker's title
	 * @param markerTitle
	 */
	var getMarker = function(markerTitle) {
		var revMarker = {};
		for (var i = 0; i < _MARKERS.length; i++) {
			var marker = _MARKERS[i];
			if (marker.title === markerTitle) {
				revMarker = marker;
			}
		}
		return revMarker;
	};
	/**
	 *
	 * @param marker
	 */
	var setClickedMarker = function(marker) {
		if (marker) {
			//change marker icon
			if (_CLICKED_MARKER) {
				_CLICKED_MARKER.setIcon(_ICON_DEFAULT);
			}
			//set clicked marker
			_CLICKED_MARKER = marker;
			marker.setIcon(_ICON_CLICKED);
		} else {
			//clear clicked marker
			_CLICKED_MARKER.setIcon(_ICON_DEFAULT);
			_CLICKED_MARKER = null;
		}
	}

	return self;

}());