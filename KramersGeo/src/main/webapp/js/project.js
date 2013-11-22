'use strict';

var GoogleAPIKey = 'AIzaSyDY7GeWGMJ7CiH2okMABZ3HBF9Fx6FXZg8';

function initialize_gmaps()
{
  var acOptions = {
    componentRestrictions: {country: 'no'}
  };

  var mapOptions = {
    zoom: 8,
    minZoom: 3,
    center: new google.maps.LatLng(59.923022,10.752869),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var ac = new google.maps.places.Autocomplete($('#location')[0], {});
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  var gc = new google.maps.Geocoder();
  //var places = new google.maps.places.PlacesService(map);
  var marker = null;
  
  var setLocation = function (latLng) {
    var lat = latLng.ob,
      lng = latLng.pb;
    
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

  google.maps.event.addListener(ac, 'place_changed', function() {
    var place = ac.getPlace();
    
    setLocation(place.geometry.location);
  });
  
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
    var gcReq = {
/*      bounds: extent, */
      location: ev.latLng
    }

    setLocation(ev.latLng);
    gc.geocode(gcReq, function (results, status) {
      console.log(status)
      console.log(results)
      $('#location').val(results[0].formatted_address);
    });
    
    
    if ($('#autohide:checked').length) {
    	$('body').removeClass('map');
      $('#map').val(0);
    	$('#map').removeClass('active');
    }
  });
}

var add_map = function()
{
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
      'libraries=places&' +
      'sensor=false&' +
      'key=' + GoogleAPIKey +
      '&callback=initialize_gmaps';
  document.body.appendChild(script);
}

$(function() {
  var availableTags = ["A0 Cholera", "B1 Malaria"];

  $( "#icd" ).autocomplete({
    source:availableTags
  });

  $('.tip').tooltip({
    container: 'body'
  });

  if (!Modernizr.inputtypes.date) {
    $('.datepicker').datepicker();
  }

  $('#comment').popover({
    html: true,
    title: 'Comment'
  });

  $('#submit').click(function(ev) {
    if (Modernizr.history) {
      var state = {};
      history.pushState(state, null, link.href);
    }
  });

  $('#map').click(function(ev) {
  	$('body').toggleClass('map', $(this).val());
  });

  add_map();
});


function add_comment() {
	$("postComment").show();
	alert($("postComment").show("slow"));	
}


function submit_form() {
	alert($("postComment").show("slow"))
/*
	{
	  "program": "eBAyeGv0exc",  //find the program-id
	  "orgUnit": "DiszpKrYNg8",  //find org unit-id
	  "eventDate": "2013-05-17", //date from form
	  "status": "COMPLETED",	 //status from form
	  "storedBy": "admin",		//get userid
	  "coordinate": {			
	    "latitude": "59.8",		//latitude from form/gps
	    "longitude": "10.9"		//longitude from form/gps
	  },
	  "dataValues": [		//other values from form
	    { "dataElement": "qrur9Dvnyt5", "value": "22" },
	    { "dataElement": "oZg33kd9taw", "value": "Male" },
	    { "dataElement": "msodh3rEMJa", "value": "2013-05-18" }
	  ]
	} */
}

/*
function getStuff() {
	//alert("Trying to get json");

	var stuff = $.getJSON("dhis-web-commons-ajax-json/getOrganisationUnitTree", function() {
		console.log("success");
	}).done(function() {
		console.log("second success");
	}).fail(function() {
		console.log("error");
	}).always(function() {
		console.log("complete");
	});


}*/


//Test for å hide form, og gjøre map større, og motsatt...
function test() {	
	var formcanvas = $(document.form-canvas)
	formcanvas.hide()
	var $body = $(document.body)
	$body.hide();
}