<?xml version="1.0" encoding="UTF-8" ?>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<head>

<!-- For å inkludere kart --> 
<style>
html, body {
        height: 100%;
}
#map-canvas {
        height: 50%;
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
        width: 80%;
}
</style>
</head>
<body>
<!-- For å inkludere kart -->
<div id="map-canvas" class="container map"></div>


<!-- For å vise kart -->
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>

</body>
</html>