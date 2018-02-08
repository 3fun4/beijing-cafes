'use strict';
/**
 *
 */
var map;

/**
 *
 */
var map_canvas = {

	/*
	 *
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
	/*
	 
	 */
	init: function() {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 39.941165,
				lng: 116.395888
			},
			zoom: 13,
			mapTypeControl: false
			/*,
						zoomControl: true,
						scaleControl: false,
						streetViewControl: false,
						rotateControl: false,
						fullscreenControl: true,
						styles:this.styler*/
		});


	},

	/**
	 *
	 */
	render: function(data) {

		var features = map.data.addGeoJson(data);
		console.dir(features);

		//set marker style of the Geo data
		map.data.setStyle(function(feature) {
			return {
				visible: feature.getProperty('active'), //for filter
				title: feature.getProperty('title'),
				//icon: 'https://foursquare.com/img/categories/food/default.png',
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
			//TODO: //change marker color

		});

	},
	filterMarkers: function(val) {
		if (val) {
			map.data.forEach(function(feature) {
				var title = feature.getProperty('title');
				if (title.toLowerCase().indexOf(val.toLowerCase()) >= 0) {
					feature.setProperty('active', true);
					//$('#left_list li[data-id="' + feature.getId() + '"]').show();
				} else {
					feature.setProperty('active', false);
					//$('#left_list li[data-id="' + feature.getId() + '"]').hide();
				}
			});
		} else {
			map.data.forEach(function(feature) {
				feature.setProperty('active', true);
			});
			//$('#left_list li').show();
		}
	},

	/**
	 *
	 */
	render1: function() {

		//load Geo data from JSON file
		map.data.loadGeoJson('data/places_GeoJSON.json');

		//set marker style of the Geo data
		map.data.setStyle(function(feature) {
			return {
				title: feature.getProperty('title'),
				//icon: 'https://foursquare.com/img/categories/food/default.png',
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
		});


	},
	render2: function() {
		// map.data.addGeoJson(places_GeoJSON);
		var $ul_markers = $('#ul_markers');
		$ul_markers.html('');

		//marker
		map.data.forEach(function(feature) {

			//TODO: //left list
			$ul_markers.append(`
					<li class="nav-item">
					<a class="nav-link active" href="#">${feature.getProperty('title')}</a>
					<!--<small style="color:#000;padding-left:15px;font-weight:200;">${feature.getProperty('address')}</small>-->
					</li>
					`);

			console.log(feature.getGeometry().get().lat() + ',' + feature.getGeometry().get().lng());
			console.log('coordinate:' + feature.getGeometry().get());
			console.log('updated');
			var point = new google.maps.LatLng({
				lat: feature.getGeometry().get().lat(),
				lng: feature.getGeometry().get().lng()
			});
			var marker = new google.maps.Marker({
				position: feature.getGeometry().get(),
				title: feature.getProperty('title'),
				//icon: 'https://foursquare.com/img/categories/food/default.png',
				map: map,
				draggable: false,
				animation: google.maps.Animation.DROP
			});
			var infowindow = new google.maps.InfoWindow({
				content: `<div class="card box-shadow border-0">
					<div class="card-img-top">
					<div class="info-card">
					<img class="img-fluid" src="${feature.getProperty('url_image')?feature.getProperty('url_image'):""}" >
					</div>
					</div>

					<div class="card-body">
					<h6>${feature.getProperty('title')}</h6>

					<p><i class="fa fa-thumbtack"></i> ${feature.getProperty('address')}</p>
					<p>
					<a target="_blank" href="${feature.getProperty('url_dianping')}" ><img src="http://www.dpfile.com/s/i/app/api/images/accr-logo2.237abf5a477e500c02971f2343b844df.png" style="width:16px;height:16px;" ></a>

					</p>
					</div>
					</div>
					`
			});
			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
		});
		//TODO: //search box
		var input = document.getElementById('txt_filter');
		var searchBox = new google.maps.places.SearchBox(input);
		// Bias the SearchBox results towards current map's viewport.
		map.addListener('bounds_changed', function() {
			searchBox.setBounds(map.getBounds());
		});

		// Listen for the event fired when the user selects a prediction and retrieve
		// more details for that place.
		searchBox.addListener('places_changed', function() {
			var places = searchBox.getPlaces();

			if (places.length == 0) {
				return;
			}
			//TODO: //filter
			var markers = [];
			// Clear out the old markers.
			markers.forEach(function(marker) {
				marker.setMap(null);
			});
			markers = [];

			// For each place, get the icon, name and location.
			var bounds = new google.maps.LatLngBounds();
			places.forEach(function(place) {
				if (!place.geometry) {
					console.log("Returned place contains no geometry");
					return;
				}
				var icon = {
					url: place.icon,
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(25, 25)
				};

				// Create a marker for each place.
				markers.push(new google.maps.Marker({
					map: map,
					icon: icon,
					title: place.name,
					position: place.geometry.location
				}));

				if (place.geometry.viewport) {
					// Only geocodes have viewport.
					bounds.union(place.geometry.viewport);
				} else {
					bounds.extend(place.geometry.location);
				}
			});
			map.fitBounds(bounds);
		});


	}

};