'use strict';
/**google.map object*/
var map;
/**google.map markers*/
var markers = [];
/**current clicked marker*/
var clickedMarker;

var iconDefault = 'image/coffee.png';
var iconClicked = 'image/coffee_clicked.png';

/**
 *
 */
var map_canvas = {

	/**
	 * google.map styler
	 */
	styler: [{
			elementType: 'geometry',
			stylers: [{
				color: '#F2F1F0'
			}]
		}, {
			elementType: 'geometry.fill',
			stylers: [{
				color: '#EFEFEF'
			}]
		}, {
			elementType: 'geometry.stroke',
			stylers: [{
				color: '#DDDFE1'
			}]
		}, {
			featureType: 'road',
			elementType: 'geometry.fill',
			stylers: [{
				color: '#FFFFFF'
			}]
		}, {
			featureType: 'road',
			elementType: 'geometry.stroke',
			stylers: [{
				color: '#DDDFE1'
			}]
		},

		{
			featureType: 'landscape.man_made',
			elementType: 'geometry.fill',
			stylers: [{
				color: '#FEF7EE'
			}]
		}, {
			featureType: 'landscape.man_made',
			elementType: 'geometry.stroke',
			stylers: [{
				color: '#F2E3D3'
			}]
		}, {
			featureType: 'poi.park',
			elementType: 'geometry.fill',
			stylers: [{
				color: '#C0ECAE'
			}]
		}, {
			featureType: 'water',
			elementType: 'geometry.fill',
			stylers: [{
				color: '#AADAFF'
			}]
		}
	],
	/**
	 * initial google.map
	 */
	init: function() {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 39.941165,
				lng: 116.395888
			},
			zoom: 13,
			mapTypeControl: false,
			streetViewControl: false
			/*,
						zoomControl: true,
						scaleControl: false,

						rotateControl: false,
						fullscreenControl: true,
						styles:this.styler*/
		});
	},
	/**
	 * get base url from a url string
	 * @param url
	 */
	getBaseURL: function(url) {
		var baseUrl = '';
		var url_arr = url.split('/');
		if (url_arr[2].split('.').length > 2 && url_arr[2].indexOf('www') < 0) {
			baseUrl = url_arr[0] + "//www." + url_arr[2].split('.')[1] + '.' + url_arr[2].split('.')[2];
		} else {
			baseUrl = url_arr[0] + '//' + url_arr[2];
		}
		return baseUrl;
	},

	/**
	 * render the map with custom places
	 * @param data {Array} places' GeoJSON data
	 */
	render: function(data) {
		//load data to map
		var features = map.data.addGeoJson(data);
		//set default marker icon to invisible
		map.data.setStyle(function(feature) {
			return {
				visible: false
			};
		});
		//append an infoWindow to the marker
		var inforWindow = new google.maps.InfoWindow();
		//infoWindow close event addListener
		google.maps.event.addListener(inforWindow, 'closeclick', function() {
			clickedMarker.setIcon(iconDefault);
			clickedMarker = null;

		});

		//add custom markers to map
		map.data.forEach(function(feature) {
			var marker = new google.maps.Marker({
				position: feature.getGeometry().get(),
				title: feature.getId() + '-' + feature.getProperty('title'),
				icon: iconDefault,
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
						var baseUrl = map_canvas.getBaseURL(url);
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

				inforWindow.setContent(infoHTML);
				inforWindow.open(map, marker);
				//change marker icon
				if (clickedMarker) {
					clickedMarker.setIcon(iconDefault);
				}
				clickedMarker = marker;
				marker.setIcon(iconClicked);
			});
			// save the info we need to use later for the side_bar click event
			markers.push(marker);

		});


	},
	/**
	 * filter markers by title
	 * @param val title
	 */
	filterMarkers: function(val) {
		if (val) {
			for (var i = 0; i < markers.length; i++) {
				var marker = markers[i];
				var title = marker.title;
				if (title.toLowerCase().indexOf(val.toLowerCase()) >= 0) {
					marker.setVisible(true);
				} else {
					marker.setVisible(false);
				}
			}
		} else {
			for (var i = 0; i < markers.length; i++) {
				var marker = markers[i];
				marker.setVisible(true);
			}
		}
	},
	/**
	 * trigger marker click event
	 * @param shop
	 */
	triggerMarkerClickEvent: function(shop) {
		map.data.forEach(function(feature) {
			if (shop.id === feature.getId()) {
				var thisTitle = shop.id + '-' + feature.getProperty('title');
				var markerToClick = map_canvas.getMarker(thisTitle);
				google.maps.event.trigger(markerToClick, 'click');

			}
		});
	},
	/**
	 * get coresponding marker by marker's title
	 * @param markerTitle
	 */
	getMarker: function(markerTitle) {
		var revMarker = {};
		for (var i = 0; i < markers.length; i++) {
			var marker = markers[i];
			if (marker.title === markerTitle) {
				revMarker = marker;
			}
		}
		return revMarker;
	}

};