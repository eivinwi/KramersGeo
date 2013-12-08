'use strict';

/* Scope - maps */
(function($)
{
  /**
   * GMaps API key
   * 
   * Authorized for some folk.uio.no/*, dhis.org/.../KramersGeo
   */
  var GoogleAPIKey = 'AIzaSyDY7GeWGMJ7CiH2okMABZ3HBF9Fx6FXZg8';
  /**
   * GMaps instance
   * Set by gmaps_loaded().
   */
  var map = null;
  var marker = null;
  
  /**
   * Set location in form (if applicable), and add marker to map
   *
   * Supports both GMaps or GeoLocation coordinate object
   */
  var setLocation = function (coords)
  {
    var lat = coords.pb || coords.latitude
    var lng = coords.qb || coords.longitude
    var latLng = new google.maps.LatLng(lat, lng)
    
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
  
  
  var geolocate_toggle = function (enabled)
  {
  	if (!Modernizr.geolocation) {
  		alert('Geolocation is not supportet by your byrowse, you can mark your position by choosing the pin tool')
      return;
    }

  	var option = {frequency: 500, maximumAge: 0, timeout: 10000, enableHighAccuracy:true};

    var geo_found = function (pos) {
      /* Location found */
      setLocation(pos.coords)
      $('#location').val('Current position')
    }

    var geo_error = function (err) {
      switch (err.code) {
      case 1:
    	  alert("you have not allowed access to your location");
        break;
      case 2:
  	  	alert("the network is down or the positioning satellites can’t be contacted, you can mark your position by choosing the pin tool");
        break;
      default:
  	  	alert("network is up but it takes too long to calculate the user’s position, you can mark your position by choosing the pin tool");
        break;
  	  }
      
      console.log('GeoLocation error ' + err.code + ': ' + err.message)
    }

    $('#location')
      .toggleClass('current-location', enabled)
      .attr('readonly', enabled)
  
    $('#geolocate')
      .toggleClass('active', enabled)

    if (enabled) {
      navigator.geolocation.getCurrentPosition(geo_found, geo_error, option)
    } else {
      if ($('#location').val() == 'Current position') {
        $('#location').val('')
      }
    }
  }


  /**
   * GMaps API is loaded
   * 
   * Callback function invoked by external (gmaps) script
   */
  window.gmaps_loaded = function () {
    var acOptions = { componentRestrictions: {country: 'no'} };

    var mapOptions = {
      zoom: 8,
      minZoom: 3,
      center: new google.maps.LatLng(59.923022,10.752869),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var gc = new google.maps.Geocoder();

    /* If location field already visible in DOM */
    $('#location').trigger('focus');

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
      '&callback=gmaps_loaded';
    document.body.appendChild(script);
  }

  
  /**
   * DOM loaded
   */
  $(function ()
  {
    maps_init()
    
    $('#form-canvas').on('click', '#map', function(ev) {
      ev.stopImmediatePropagation()
      $(this).toggleClass('active')
      $('body').toggleClass('map', $(this).hasClass('active'));
      geolocate_toggle(false)
    });
    
    $('#form-canvas').on('click', '#geolocate', function(ev) {
      ev.stopImmediatePropagation()
      $(this).toggleClass('active')
      geolocate_toggle($(this).hasClass('active'))
    });

    $('#form-canvas').on('focus', '#location', function(ev) {
      if (!$(this).data('api-enabled')) {
        var ac = new google.maps.places.Autocomplete(this, {});

        /* Add via location autocomplete */
        google.maps.event.addListener(ac, 'place_changed', function() {
          var place = ac.getPlace();
          setLocation(place.geometry.location);
        });

        $(this).data('api-enabled', 1);
      }
    });
  })
})($)
