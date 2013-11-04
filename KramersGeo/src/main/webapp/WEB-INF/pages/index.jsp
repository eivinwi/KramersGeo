<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html lang="en">
<head>
<!-- For aa inkludere kart --> 
<style>
html, body {
        height: 100%;
}
#map-canvas {
        height: 75%;
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
        width: 90%;
}
</style>
</head>

<body>

	<!-- Bootstrap core JavaScript
	================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->

	<script src="http://modernizr.com/downloads/modernizr-latest.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/project.js"></script>
	
<!-- For aa inkludere kart -->
<div id="map-canvas" class="container map"></div>
	
	<!-- Loads the map right away after the page is deployed-->loaded
	<script>
	$(document).ready(function() {
		initialize_map();
	});
	</script>

<!-- For å vise kart -->
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>

</body>
</html>
