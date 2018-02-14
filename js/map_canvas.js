'use strict';

/**
 *
 */
var MAP_CANVAS = MAP_CANVAS || (function() {

	var self = {};

	/**google.map object*/
	var _MAP;
	//map center
	var _LATLNG_CENTER = {
		lat: 39.926915,
		lng: 116.396633
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
	 * @param canvasId
	 */
	self.init = function(canvasId) {

		_MAP = new google.maps.Map(document.getElementById(canvasId), {
			center: _LATLNG_CENTER,
			zoom: 13,
			mapTypeControl: false,
			streetViewControl: false
		});
		//reset map center when window resizes
		google.maps.event.addDomListener(window, "resize", function() {
			var center = _MAP.getCenter();
			google.maps.event.trigger(_MAP, "resize");
			_MAP.setCenter(center);
			//resize infowindow
			if (isInfoWindowOpen()) {
				var content = _INFO_WINDOW.getContent();
				_INFO_WINDOW.close();
				_INFO_WINDOW.setContent(content);
				_INFO_WINDOW.open(_MAP, _CLICKED_MARKER);
			}
		});
		//info window
		_INFO_WINDOW = new google.maps.InfoWindow();
	};
	/**
	 * check whether the infowindow is open
	 * @returns boolean
	 */
	var isInfoWindowOpen = function() {
		if (_INFO_WINDOW) {
			var map_infowindow = _INFO_WINDOW.getMap();
			return (map_infowindow !== null && map_infowindow !== "undefined");
		} else {
			return false;
		}
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
	 * form info window html and return
	 * @param feature google map feature
	 * @return string
	 */
	var getInfoWindowHTML = function(feature) {
		//info window html
		var infoHTML_openhours = '';
		if (feature.getProperty('open_hours') && feature.getProperty('open_hours') != '') {
			infoHTML_openhours = `<p><i class="far fa-clock"></i> ${feature.getProperty('open_hours')}</p>
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
		var infoHTML = `<div>
							<div class="info-card-img">
								<img src="${feature.getProperty('url_image')}">
							</div>
							<div class="info-card-txt">
								<h6>${feature.getProperty('title')}</h6>
								<p><i class="fa fa-map-marker-alt"></i> ${feature.getProperty('address')}</p>
								${infoHTML_openhours}
								${infoHTML_links}
							</div>
						</div>
						`;
		return infoHTML;
	};
	/**
	 * render the map with custom places
	 * @param data {Array} places' GeoJSON data
	 */
	self.render = function(data) {
		//load data to map
		var features = _MAP.data.addGeoJson(data);
		//set default marker icon to invisible
		_MAP.data.setStyle(function(feature) {
			return {
				visible: false
			};
		});

		//infoWindow close event addListener
		google.maps.event.addListener(_INFO_WINDOW, 'closeclick', function() {
			setClickedMarker(null);
		});

		//add custom markers to map
		_MAP.data.forEach(function(feature) {

			var marker = new google.maps.Marker({
				position: feature.getGeometry().get(),
				title: feature.getId() + '-' + feature.getProperty('title'),
				icon: _ICON_DEFAULT,
				map: _MAP,
				draggable: false,
				animation: google.maps.Animation.DROP
			});
			//marker click event addListener
			google.maps.event.addListener(marker, 'click', function() {

				//info window html
				var infoHTML = getInfoWindowHTML(feature);
				_INFO_WINDOW.setContent(infoHTML);
				_INFO_WINDOW.open(_MAP, marker);
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
		_MAP.data.forEach(function(feature) {
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
	 * set clicked marker
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