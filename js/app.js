
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
		mapTypeControl: false,
		/*styles: styler*/
	});
	//TODO: //map style
	//map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
	/*var styledMapType = new google.maps.StyledMapType(styler, {name: 'Styled Map'});
	map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');*/

	//transit layer
	// var transitLayer = new google.maps.TransitLayer();
 	//transitLayer.setMap(map);

map.data.loadGeoJson('marker.json');


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
	marker.addListener('click', function() {
		infowindow.open(map, marker);
	});
	//var bounds = new google.maps.LatLngBounds();
	//bounds.extend(marker.position);
	//map.fitBounds(bounds);

	//TODO: //search box
	var input = document.getElementById('txt_filter');
    var searchBox = new google.maps.places.SearchBox(input);
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

//
function printResults(data) {
      console.log(JSON.stringify(data));
    }

//
$(document).ready(function(){
      var url = $('#link_markers_data').attr('href');
      console.log(url);
      $.getJSON( url, {
        format: "json",
        crossOrigin: null
      }).done(function( data ) {
        console.log(JSON.stringify(data));
      });

});
