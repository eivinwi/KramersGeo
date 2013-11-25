'use strict';

var orgList = [];
var progList = [];
var orgsTmp = [];
var progTmp = [];
var ICD = [];
var selectedOrg;
var selectedProg;

var GoogleAPIKey = 'AIzaSyDY7GeWGMJ7CiH2okMABZ3HBF9Fx6FXZg8';

function initialize_gmaps() {
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
	//var places = new google.maps.places.PlacesService(map);
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
			// bounds: extent, 
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

//if user just want to get location from browser
function get_location() {
	var option = {frequency: 500, maximumAge: 0, timeout: 10000, enableHighAccuracy:true};
	if (Modernizr.geolocation) {
		navigator.geolocation.getCurrentPosition(location_found, handle_error, option);
	} else {
		x.innerHTML = "Geolocation is not supportet by your browse, you can mark the position manually"
	}
}

//should save the location, and add it to the form.
function location_found(position) {

}

//Handles when an error occur
function handle_error(err) {
	if (err == 1) {
			alert("you have not allowed access to your location");
	} else if (err == 2) {
		alert("the network is down or the positioning satellites can’t be contacted, we recomend you to type in the position manually");
	} else { // err == 3rt("stud
		alert("network is up but it takes too long to calculate the user’s position, we recomend you to type in the position manually");
	}
}

$(function() {
    $( "#orgName" ).autocomplete({
        source: orgList,
        autoFocus: true,
        select: function( event, ui ) {
            event.preventDefault();
            selectedOrg = ui.item.label;
            $( "#orgName" ).val( ui.item.label );
            // $( "#orgId" ).val( ui.item.value );
   		}
    }).click(function( event, ui ) {
        $(this).autocomplete('search', " ");
    });
});

$(function() {
    $( "#progName" ).autocomplete({
        source: progList,
        autoFocus: true,
        select: function( event, ui ) {
            event.preventDefault();
            selectedProg = ui.item.label;
            $( "#progName" ).val( ui.item.label );
            // $( "#progId" ).val( ui.item.value );
    	}
    }).click(function( event, ui ) {
        $(this).autocomplete('search', " ");
    });
});

$(function() {
	$("#icd").autocomplete({
	    source: function(request, response) {
	        var results = $.ui.autocomplete.filter(ICD, request.term);
	        response(results.slice(0, 10));
	    }
	});
});

$(function() {
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
		addComment();
	});

	$('#map').click(function(ev) {
		$('body').toggleClass('map', $(this).val());
		add_map();
	});
});

function add_comment() {
	$("postComment").show();
	alert($("postComment").show("slow"));	
}

function submit_form() {
	/*
	var data = { 	
		"program": selectedOrg, 
		"orgUnit": selectedProg, 
		"eventDate": "2013-05-17",
	 	"status": "COMPLETED", 
	 	"storedBy": "admin", 
	 	"coordinate": {"latitude": "59.8", "longitude": "10.9"}, 			
	 	"dataValues": [
			{	"dataElement": "qrur9Dvnyt5", "value": "22" }, 
			{	"dataElement": "oZg33kd9taw", "value": "Male" },
			{	"dataElement": "msodh3rEMJa", "value": "2013-05-18" } ] 
	};
	sendEvent(data);*/
}

function loadPrograms() {
	console.log("Trying to load programs.");
	$.getJSON("programs.json", function(data) {
		$.each(data.programs, function(key, val) {
			progTmp.push(val);
		});
	}).done(function() {
		console.log("Programs loaded");
		populateProgs();
	}).fail(function(jqXhr, textStatus, error) {
		console.log("Error loading programs: " + textStatus + ", " + error);
	});
}

function populateProgs() {
	for(var i = 0; i < progTmp.length; i++) {
		var prog = {label: progTmp[i].name, value: progTmp[i].id}
		progList.push(prog);
	}
}

// should send data in json format
function sendEvent(data) {
	/**
	 * oppsett for å sende data til serveren
	 */
	alert("sendEvent: "+data);
	$.ajax({
		type: "POST",
		url: "http://apps.dhis2.org/demo/api/events",
		dataType: "json",
		data: data,
		username: "admin",
		password: "district",
	}).fail(function(jqXhr, textStatus, error) {
		console.log("Error sendEvent: " + textStatus + ", " + error);
	}).done(function() {
		console.log("second success");
	}).fail(function() {
		console.log("error");
	}).always(function() {
		console.log("complete");
	});
}

// TODO: caching
function loadOrganisations() {
	console.log("Trying to load organisation tree.");

	// $.getJSON(test_url + '/api/organisationUnits.json', function(data) {
    $.getJSON("organisationUnits.json", function(data) {
   		$.each(data.organisationUnits, function(key, val) {
   			orgsTmp.push(val);
   		});
	}).done(function(){
		console.log("Organisation tree loaded.");
    	populateOrgs();
	}).fail(function(jqXhr, textStatus, error) {
		console.log("Error loading organisation units: " + textStatus + ", " + error);
	});
}

function populateOrgs() {
	for(var i = 0; i < orgsTmp.length; i++) {
		var org = {label: orgsTmp[i].name, value: orgsTmp[i].id}
		orgList.push(org);
	}
}

// api/optionSets/eUZ79clX7y1.json
function loadICD() {
	console.log("Trying to load ICD dignoses.");
	$.getJSON("eUZ79clX7y1.json", function(data) {
 		/*
		 * $.each(data.options, function(v) { ICD.push(JSON.parse(v)); });
		 */
		
		for ( var idx=0, len = data.options.length; idx < len; idx++ ) {
   			var icd_elem = data.options[idx];
			ICD[idx] = {
				"id" : icd_elem,
				"label" : icd_elem
			};
		}

	}).done(function(data) {
		console.log("ICD diagnoses loaded."+data.length);
		// populateICD();
	}).fail(function(jqXhr, textStatus, error) {
		console.log("Error loading diagnoses: " + textStatus + ", " + error);
	});
}

// Test for å hide form, og gjøre map større, og motsatt...
function test() {	
	var formcanvas = $(document.form-canvas)
	formcanvas.hide()
	var $body = $(document.body)
	$body.hide();
}