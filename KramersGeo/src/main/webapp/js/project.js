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

var isVisible=form.style.display != 'none';
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