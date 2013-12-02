'use strict';

var orgList = [];
var progList = [];
var orgsTmp = [];
var progTmp = [];
var progOrgArray = [];
var ICD = [];
var selectedOrg;
var selectedProg;

var url = "";

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
		x.innerHTML = "Geolocation is not supportet by your byrowse, you can mark your position by choosing the pin tool"
	}
}

//should save the location, and add it to the form.
function location_found(position) {
	alert(position.coords.latitude + "," + position.coords.longitude);
	//Funker dette, hmm?, kanskje :S
	var setLocation = function (positionO) {
		var lat = positionO.coords.latitude, lng = positionO.coords.longitude;
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
	setLocation(position);
	$('#location').val(results[0].formatted_address);
}

//Handles when an error occur
function handle_error(err) {
	if (err == 1) {
		alert("you have not allowed access to your location");
	} else if (err == 2) {
		alert("the network is down or the positioning satellites can’t be contacted, you can mark your position by choosing the pin tool");
	} else { // err == 3rt("stud
		alert("network is up but it takes too long to calculate the user’s position, you can mark your position by choosing the pin tool");
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
            searchForPrograms();	//fills in available programs for selected org
   		}
    }).click(function( event, ui ) {ICD
        $(this).autocomplete('search', " ");
    });
});


function getSelectedProg() {
	selectedProg = document.getElementById('progName').value;
}
/* TODO: show the label
$(function() {
	$( "#orgName" ).autocomplete({
		source: function(request, response) {
			var results = $.ui.autocomplete.filter(orgList, request.term);
			var res = results.slice(0.10);
			response(results.slice(0, 10), function(item) {
				return {
					label: item.label,
					value: item.value
				}
			});
		}
	}).click(function( event, ui ) {
		$(this).autocomplete('search', " ");
	});
});*/

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
		add_comment();
		if (Modernizr.history) {
	 		var state = {};
			history.pushState(state, null, link.href);
		}
		//addComment();
	});

	$('#map').click(function(ev) {
		$('body').toggleClass('map', $(this).val());
		add_map();
	});

	$('#locate').click(function(e) {
		e.preventDefault();
		get_location();
	});
});

//Should save the comment. 
function add_comment() {
	var comment = $("#leaveComment").val();
	//here we should save the comment.
	if (comment.length > 0) {
		alert($("#leaveComment").val());	
	}
}

//Skal lage json data for innsending av innsamlet data
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
			{	"dataElement": "msodh3rEMJa", "value": "2013-05-18" } 
			{	"dataElement": "comment", "value": "kommentar skal inn her"} //litt usikker på comment elementet her
		] 
	};
	sendEvent(data);*/
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
	}).always(function() {
		console.log("complete");
	});
}

//For testing. Skal benytte noe lignende til å kun vise riktig forms
function display(e) {
	alert(selectedProg);
	if (e.checked) {
		document.getElementById('test').style.display = 'block';
	} else {
		document.getElementById('test').style.display = 'none';
	}
}

function loadPrograms() {
	//url + /api/ + "programs.json"
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
	loadProgOrgs();
}

// TODO: caching
function loadOrganisations() {
	// $.getJSON(url + '/api/organisationUnits.json', function(data) {
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

//url +  api/optionSets/eUZ79clX7y1.json
function loadICD() {
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
		console.log("ICD diagnoses loaded.");
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

//loads information about what organisations is connected to each program
//necesarry because the dhis2 api is stupid
function loadProgOrgs() {
	progOrgArray = new Array(progList.length);
	console.log("Loading program<->organisation connections");
	for (var i = 0; i < progList.length; i++) {
		getOrgProg(i);
	}
}

function getOrgProg (i) {
	progOrgArray[i] = [];
	$.getJSON(url + progList[i].value + ".json", function(data) {
		$.each(data.organisationUnits, function(key, val) {
				progOrgArray[i].push(val);
			});
	}).done(function() {
		console.log("Loaded: " + url + progList[i].value +".json");
	}).fail(function(jqXhr, textStatus, error) {
		console.log("Error loading prog<->org connections: " + textStatus + ", " + error);
	});
}


//searches for programs for currently selected organisation, fills them into currentProgs
function searchForPrograms() {
	var sel = ClearOptionsFast('progName');
	for (var i = 0; i < progList.length; i++) {
		for (var j = 0; j < progOrgArray[i].length; j++)  {
			if(progOrgArray[i][j].name === selectedOrg) {
				var opt = document.createElement('option');
				opt.innerHTML = progList[i].label;
				opt.value = progList[i].value; //perhaps label
				sel.appendChild(opt);
			}
		}
	}
}

function ClearOptionsFast(id)
{
	var selectObj = document.getElementById(id);
	var selectParentNode = selectObj.parentNode;
	var newSelectObj = selectObj.cloneNode(false); // Make a shallow copy
	selectParentNode.replaceChild(newSelectObj, selectObj);
	return newSelectObj;
}