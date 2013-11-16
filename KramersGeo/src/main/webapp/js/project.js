'use strict';

function initialize_map()
{
   var mapOptions = {
    zoom: 8,
    minZoom: 3,
    center: new google.maps.LatLng(59.923022,10.752869),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

var add_map = function()
{
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
      'key=AIzaSyDY7GeWGMJ7CiH2okMABZ3HBF9Fx6FXZg8&' +
      'callback=initialize_map';
  document.body.appendChild(script);
}

$(function() {
  var availableTags = ["A0 Cholera", "B1 Malaria"];
  $( "#icd" ).autocomplete({
    source:availableTags
  });

  $("#radio").buttonset();
  $( "#status" ).buttonset();
  $('.datepicker').datepicker();
  $('.tip').tooltip({container: 'body'});

  add_map();
});


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


//Test for å hide form, og gjøre map større, og motsatt...
function test() {	
	var formcanvas = $(document.form-canvas)
	formcanvas.hide()
	var $body = $(document.body)
	$body.hide();
}