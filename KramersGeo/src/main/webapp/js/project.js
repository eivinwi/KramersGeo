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
	alert($('form').is(":visible"));
	if ($('form').is(":visible")) {
		$('form').hide()
		alert("visible");
	} else {
		$('form').show()
		alert("not visible");
	}
}

function add_comment() {
	$("postComment").show("slow");
	alert($("postComment").show("slow"));
}

