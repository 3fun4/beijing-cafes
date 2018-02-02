
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
var map = new google.maps.Map(document.getElementById('map'), {
  mapTypeId: 'terrain',
  center: {lat: 39.91632, lng: 116.397057},
  zoom: 11/*,
  zoomControl: true,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  mapTypeControl: false,
  styles: styler*/
});
function initMap(items) {


/*
	//var bounds = new google.maps.LatLngBounds();
	//bounds.extend(marker.position);
	//map.fitBounds(bounds);*/

        /*$.each(items, function(index,marker) {
          var drop = new google.maps.Marker({
            position: marker.position,
            map: map,
            title: marker.title,
            animation: google.maps.Animation.DROP,
            id: marker.id
          });
          var infowindow = new google.maps.InfoWindow({
            content: `title: ${marker.title}, address: ${marker.address}`
          });
          drop.addListener('click', function() {
            infowindow.open(map, drop);
          });
        });*/


var customLayer = new google.maps.Data();

  map.data.addGeoJson(places_GeoJSON);
  map.data.setStyle({
    title: '#',
    //icon: 'https://foursquare.com/img/categories/food/default.png',
    map: map,
  });

 /*
//marker
map.data.forEach(function(feature) {

console.log(feature.getGeometry().get().lat()+','+feature.getGeometry().get().lng());
    var point = new google.maps.LatLng({lat: feature.getGeometry().get().lat(), lng:feature.getGeometry().get().lng()});
    var mark = new google.maps.Marker({
      position: point,
      title: '#',
      //icon: 'https://foursquare.com/img/categories/food/default.png',
      map: map,
      draggable: false,
      animation: google.maps.Animation.DROP
    });
  });*/






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


//fix: map canvas not showing in bootstrap 'main'
$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 60; // Calculate the top offset

    $('#map').css('height', (h - offsetTop));
}).resize();

/**
 * Update a map's viewport to fit each geometry in a dataset
 * @param {google.maps.Map} map The map to adjust
 */
function zoom(map) {
  var bounds = new google.maps.LatLngBounds();
  map.data.forEach(function(feature) {
    processPoints(feature.getGeometry(), bounds.extend, bounds);
  });
  map.fitBounds(bounds);
}

//
$(document).ready(function(){

      $.getJSON( 'data/markers.json', {
        format: "json",
        crossOrigin: null
      }).done(function( data ) {
        console.log(JSON.stringify(data));
        //TODO: //load data to left side bar
        //TODO: //init map
        initMap(data);

      });


});
