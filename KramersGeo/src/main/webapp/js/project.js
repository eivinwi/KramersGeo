$(function() {
	var test = ["A1", "B2"];
  $( "#sumthing" ).autocomplete({
    source: test
  });

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

/*
 * $(function() { $( "#icd" ).autocomplete({ source: ICD, autoFocus: true,
 * select: function( event, ui ) { event.preventDefault(); $( "#icd" ).val(
 * ui.item.label ); }
 * 
 * }).click(function( event, ui ) { $(this).autocomplete('search', " "); }); });
 */


$("#icd").autocomplete({ 
    source: function(request, response) {
        var results = $.ui.autocomplete.filter(ICD, request.term);
        response(results.slice(0, 10));
    }
});

// TODO fix icd array
/*
 * $(function() { var placeholders = ["A00 Vondt i kneet", "A01 Død"]; $( "#icd"
 * ).autocomplete({ source: placeholders }).click(function( event, ui ) {
 * $(this).autocomplete('search', " "); });
 * 
 * });
 */
$("#radio").buttonset();
$( "#status" ).buttonset();
$('.datepicker').datepicker();

});

var real_url = "http://apps.dhis2.org/dev";
var test_url = "http://localhost:8082";
var orgsTmp= []; // internal tmp storage
var orgList = [];  // storing all organistasions as options
var progTmp = [];
var progList = [];
var ICDtmp = [];
var ICD = ["1"];
var selectedOrg;
var selectedProg;


// To get single event data perhaps?
function getData() {
	
}

// Add map
var map;
function initialize_map() {
	var mapOptions = {
		zoom : 10,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	// Try HTML5 geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude,
					position.coords.longitude);
			map.setCenter(pos);
		}, function() {
			handleNoGeolocation(true);
		});
	} else {
		alert("We recomend you to use Google Chrome");
	}
	
}

// var isVisible=form.style.display != 'none';
function show_hide_form() {
	alert("lol");
	$('body').toggleClass('hidden-bar');
	return;
	if ($('form').is(":visible")) {
		$('form').hide()
	} else {
		$('form').show()
	}
}


function add_comment() {
	$("postComment").show("slow");
	alert($("postComment").show("slow"));	
}


function submit_form() {
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
	sendEvent(data);
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
		alert("Done"); 
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