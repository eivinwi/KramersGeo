'use strict';

/* Siden fungerer bare dersom du bruker Chrome/Chromium med --disable-web-security */

/**
 * GMaps API key
 * 
 * Authorized for some folk.uio.no/*, dhis.org/.../KramersGeo
 */
var GoogleAPIKey = 'AIzaSyDY7GeWGMJ7CiH2okMABZ3HBF9Fx6FXZg8';


/**
 * Callback function for GMaps API
 *
 * Must be in the global namespace
 */
function maps_loaded() {
  var acOptions = { componentRestrictions: {country: 'no'} };

  var mapOptions = {
    zoom: 8,
    minZoom: 3,
    center: new google.maps.LatLng(59.923022,10.752869),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var ac = new google.maps.places.Autocomplete($('#location')[0], {});
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  var gc = new google.maps.Geocoder();
  var marker = null;

  var setLocation = function (latLng) {
    var lat = latLng.ob, lng = latLng.pb;
    $('#lat').val(lat)
    $('#lng').val(lng)
    
    if (marker != null) {
      marker.setVisible(false)
      marker.setMap(null)
    }

    marker = new google.maps.Marker({
      position: latLng,
      map: map,
      animation: google.maps.Animation.DROP
    });
  };

  /* Add via location autocomplete */
  google.maps.event.addListener(ac, 'place_changed', function() {
    var place = ac.getPlace();
    setLocation(place.geometry.location);
  });

  /* Add via click on map */
  google.maps.event.addListener(map, 'rightclick', function(ev) {
    /*
    var deltaLatitude  = ev.ca.y /  111111;
    var deltaLongitude = ev.ca.x / (111111 * Math.cos(ev.latLng.pb));
    var sw = new google.maps.LatLng(
      ev.latLng.lat() - deltaLatitude  / 2,
      ev.latLng.lng() - deltaLongitude / 2);
    var ne = new google.maps.LatLng(
      ev.latLng.lat() + deltaLatitude  / 2,
      ev.latLng.lng() + deltaLongitude / 2);
    var extent = new google.maps.LatLngBounds(sw, ne)
    */

    /* Overwritten if geocode returns */
    $('#location').val('Dropped pin');
    setLocation(ev.latLng);

    var gcReq = {
      location: ev.latLng
    }

    gc.geocode(gcReq, function (results, status) {
      $('#location').val(results[0].formatted_address);
    });

    if ($('#autohide:checked').length) {
      $('body').removeClass('map');
      $('#map').val(0);
      $('#map').removeClass('active');
    }
  });
}

/**
 * Load GMaps on-demand
 */
var maps_init = function()
{
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
    'libraries=places&' +
    'sensor=false&' +
    'key=' + GoogleAPIKey +
    '&callback=maps_loaded';
  document.body.appendChild(script);

  /* Only initialize once, so replace this function with a dummy */
  maps_init = function(){}
}
