'use strict';
/**google.map object*/
var map;
/**google.map markers*/
var markers = [];
/**current clicked marker*/
var clickedMarker;

var iconDefault = 'image/coffee.png';
var iconClicked = 'image/coffee_clicked.png';

var iconDianping = 'http://www.dpfile.com/s/i/app/api/images/accr-logo2.237abf5a477e500c02971f2343b844df.png';
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
				var infoHTML_dianping = '';
				if (feature.getProperty('url_dianping') != "") {
					infoHTML_dianping = `<p>
										 	<a target = "_blank" href = "${feature.getProperty('url_dianping')}" >
												<img src = "${iconDianping}" style = "width:16px;height:16px;" >
											</a>
										 </p>
										`;
				}
				var infoHTML = `<div class="card box-shadow border-0">
									<div class="card-img-top">
										<div class="info-card border-top border-bottom">
										<img class="img-fluid" src="${feature.getProperty('url_image')?feature.getProperty('url_image'):""}" >
										</div>
									</div>

									<div class="card-body">
										<h6>${feature.getProperty('title')}</h6>
										<p style="width: 250px;"><i class="fa fa-thumbtack"></i> ${feature.getProperty('address')}</p>

										${infoHTML_dianping}

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
	 *
	 */
	render0: function(data) {

		var features = map.data.addGeoJson(data);
		console.dir(features);

		//set marker style of the Geo data
		map.data.setStyle(function(feature) {
			return {
				visible: feature.getProperty('active'), //for filter
				title: feature.getProperty('title'),

				//icon: 'https://foursquare.com/img/categories/food/default.png',
				map: map,
				fillColor: 'gray', //TODO: //change color

				//icon: 'http://maps.google.com/mapfiles/kml/pal2/icon62.png',
				icon: iconDefault, //color:'#5e3e18'
				map: map

			};
		});
		//append an infoWindow to the marker
		var inforWindow = new google.maps.InfoWindow();
		map.data.addListener('click', function(event) {
			var infoHTML = `<div class="card box-shadow border-0">
								<div class="card-img-top">
									<div class="info-card border">
									<img class="img-fluid" src="${event.feature.getProperty('url_image')?event.feature.getProperty('url_image'):""}" >
									</div>
								</div>

								<div class="card-body">
									<h6>${event.feature.getProperty('title')}</h6>

									<p style="width: 250px;"><i class="fa fa-thumbtack"></i> ${event.feature.getProperty('address')}</p>
									<p>
									<a target="_blank" href="${event.feature.getProperty('url_dianping')}" ><img src="http://www.dpfile.com/s/i/app/api/images/accr-logo2.237abf5a477e500c02971f2343b844df.png" style="width:16px;height:16px;" ></a>
									</p>
								</div>
							</div>
							`;
			inforWindow.setContent(infoHTML);
			inforWindow.setPosition(event.feature.getGeometry().get());
			// anchor the infowindow on the marker
			inforWindow.setOptions({
				pixelOffset: new google.maps.Size(0, -30)
			});
			inforWindow.open(map);
			//change marker color
			map.data.revertStyle();
			map.data.overrideStyle(event.feature, {
				icon: iconClicked
			});

		});
		//infoWindow close event addListener
		google.maps.event.addListener(inforWindow, 'closeclick', function() {
			//currentMark.setIcon(iconDefault);
			map.data.revertStyle();
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