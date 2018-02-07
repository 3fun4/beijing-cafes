
function initMap() {

  map_canvas.init();
  map_canvas.render();

}


//fix: map canvas not showing in bootstrap 'main'
$(window).resize(function () {
    //set height
    var h = $(window).height(),
        offsetTop = 60; // Calculate the top offset

    $('#map').css('height', (h - offsetTop));

    //set width
    //TODO: //responsive
    var w = $(window).width();
    var sidebar_sticky_width = 300;
    $('#map').css('width', (w-sidebar_sticky_width));
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

      initMap();

});
