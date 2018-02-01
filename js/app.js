
var styleJSON = [
	{elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
	{elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
	{elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
	{
	featureType: 'administrative',
	elementType: 'geometry.stroke',
	stylers: [{color: '#c9b2a6'}]
	},
	{
	featureType: 'administrative.land_parcel',
	elementType: 'geometry.stroke',
	stylers: [{color: '#dcd2be'}]
	},
	{
	featureType: 'administrative.land_parcel',
	elementType: 'labels.text.fill',
	stylers: [{color: '#ae9e90'}]
	},
	{
	featureType: 'landscape.natural',
	elementType: 'geometry',
	stylers: [{color: '#dfd2ae'}]
	},
	{
	featureType: 'poi',
	elementType: 'geometry',
	stylers: [{color: '#dfd2ae'}]
	},
	{
	featureType: 'poi',
	elementType: 'labels.text.fill',
	stylers: [{color: '#93817c'}]
	},
	{
	featureType: 'poi.park',
	elementType: 'geometry.fill',
	stylers: [{color: '#a5b076'}]
	},
	{
	featureType: 'poi.park',
	elementType: 'labels.text.fill',
	stylers: [{color: '#447530'}]
	},
	{
	featureType: 'road',
	elementType: 'geometry',
	stylers: [{color: '#f5f1e6'}]
	},
	{
	featureType: 'road.arterial',
	elementType: 'geometry',
	stylers: [{color: '#fdfcf8'}]
	},
	{
	featureType: 'road.highway',
	elementType: 'geometry',
	stylers: [{color: '#f8c967'}]
	},
	{
	featureType: 'road.highway',
	elementType: 'geometry.stroke',
	stylers: [{color: '#e9bc62'}]
	},
	{
	featureType: 'road.highway.controlled_access',
	elementType: 'geometry',
	stylers: [{color: '#e98d58'}]
	},
	{
	featureType: 'road.highway.controlled_access',
	elementType: 'geometry.stroke',
	stylers: [{color: '#db8555'}]
	},
	{
	featureType: 'road.local',
	elementType: 'labels.text.fill',
	stylers: [{color: '#806b63'}]
	},
	{
	featureType: 'transit.line',
	elementType: 'geometry',
	stylers: [{color: '#dfd2ae'}]
	},
	{
	featureType: 'transit.line',
	elementType: 'labels.text.fill',
	stylers: [{color: '#8f7d77'}]
	},
	{
	featureType: 'transit.line',
	elementType: 'labels.text.stroke',
	stylers: [{color: '#ebe3cd'}]
	},
	{
	featureType: 'transit.station',
	elementType: 'geometry',
	stylers: [{color: '#dfd2ae'}]
	},
	{
	featureType: 'water',
	elementType: 'geometry.fill',
	stylers: [{color: '#AADAFF'}]
	},
	{
	featureType: 'water',
	elementType: 'labels.text.fill',
	stylers: [{color: '#92998d'}]
	}
];
var styler = [
	{elementType: 'geometry', stylers: [{color: '#F2F1F0'}]},
/*{elementType: 'geometry.fill', stylers: [{color: '#EFEFEF'}]},
{elementType: 'geometry.stroke', stylers: [{color: '#DDDFE1'}]},*/
	{
		featureType: 'road',
		elementType: 'geometry.fill',
		stylers: [{color: '#FFFFFF'}]
	},
	{
		featureType: 'road',
		elementType: 'geometry.stroke',
		stylers: [{color: '#DDDFE1'}]
	},

	{
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [{color: '#FEF7EE'}]
    },
{
        featureType: 'landscape.man_made',
        elementType: 'geometry.stroke',
        stylers: [{color: '#F2E3D3'}]
    },
	{
		featureType: 'poi.park',
		elementType: 'geometry.fill',
		stylers: [{color: '#C0ECAE'}]
	},
	{
		featureType: 'water',
		elementType: 'geometry.fill',
		stylers: [{color: '#AADAFF'}]
	}
];
var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
  		center: {lat: 39.91632, lng: 116.397057},
  		zoom: 13,
		zoomControl: true,
		scaleControl: false,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: true,
		styles: styler,

		mapTypeControl: false
	});
	//map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
	/*var styledMapType = new google.maps.StyledMapType(styler, {name: 'Styled Map'});
	map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');*/

	var soloist = {lat:39.895962, lng:116.393037 };
	var marker = new google.maps.Marker({
		position: soloist,
		map: map,
		title: 'Soloist',
		animation: google.maps.Animation.DROP,
		id: 1
	});
	var infowindow = new google.maps.InfoWindow({
		content: `title: ${marker.title}, address:'this address'`
	});
	//var bounds = new google.maps.LatLngBounds();
	//bounds.extend(marker.position);
	marker.addListener('click', function() {
		infowindow.open(map, marker);
	});
	//map.fitBounds(bounds);


}
//show listings
function  showListings() {

}
//hide listings
function  hideListings() {

}

function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          //center: {lat: -33.8688, lng: 151.2195},
		center: {lat: 39.91632, lng: 116.397057},
          zoom: 13,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

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

//fix: map canvas not showing in bootstrap 'main'
$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 60; // Calculate the top offset

    $('#map').css('height', (h - offsetTop));
}).resize();