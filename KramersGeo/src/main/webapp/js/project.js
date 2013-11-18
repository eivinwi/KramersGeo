$(function() {
  var availableTags = ["A0 Cholera", "B1 Malaria"];
  $( "#icd" ).autocomplete({
    source:availableTags
  });

$(function() {
	$( "#orgName" ).autocomplete({
		source: orgList,
		autoFocus: true,
		select: function( event, ui ) {
			event.preventDefault();
			selectedOrg = ui.item.label;
			$( "#orgName" ).val( ui.item.label );
			//$( "#orgId" ).val( ui.item.value );
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
			//$( "#progId" ).val( ui.item.value );
		}

	}).click(function( event, ui ) {
			$(this).autocomplete('search', " ");
	});
});

$("#radio").buttonset();
$( "#status" ).buttonset();
$('.datepicker').datepicker();

});

var real_url = "http://apps.dhis2.org/dev";
var test_url = "http://localhost:8082";
var orgsTmp= []; //internal tmp storage
var orgList = [];  //storing all organistasions as options
var progTmp = [];
var progList = [];
var selectedOrg;
var selectedProg;

//To get single event data perhaps?
function getData() {
	
}

//Add map
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

//var isVisible=form.style.display != 'none';
function show_hide_form() {
	$('body').toggleClass('hidden-bar');
	return;
	//alert($('form').is(":visible"));
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

function loadPrograms() {
	console.log("Trying to load programs.");
	$.getJSON("programs.json", function(data) {
		$.each(data.programs, function(key, val) {
			progTmp.push(val);
		});
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

//TODO: caching
function loadOrganisations() {
	console.log("Trying to load organisation tree.");

	//$.getJSON(test_url + '/api/organisationUnits.json', function(data) {
    $.getJSON("organisationUnits.json", function(data) {
   		$.each(data.organisationUnits, function(key, val) {
   			orgsTmp.push(val);
   		});
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

//Test for å hide form, og gjøre map større, og motsatt...
function test() {	
	var formcanvas = $(document.form-canvas)
	formcanvas.hide()
	var $body = $(document.body)
	$body.hide();
}