
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
<<<<<<< HEAD
		alert("We recomend you to use Google Chrome");
=======

		alert('Your browser does not support Geolocation.')
>>>>>>> 07a0a7570114623972eb168a03336fccc9efce40
	}
}