L.mapbox.accessToken = 'pk.eyJ1IjoidHJ5ZmF0dXIiLCJhIjoiY2lxdDJ5d3R1MDAydmZybmh3a3VtcmFvMiJ9.lL9RoXOtTscOHiSvOCrL-Q';
var map              = L.mapbox.map('map').setView([-6.909620, 107.634553], 13);
var geojson;
var text;

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken).addTo(map);
L.MakiMarkers.accessToken = L.mapbox.accessToken;

function onEachFeature(feature, layer) {
	text = "<b>" + feature.properties.nama + "</b>";
	text += "<p>" + feature.properties.alamat_jalan + "</p>";
	text += "<p>" + "Kel." + feature.properties.desa_kelurahan_id + ", " + feature.properties.kecamatan + "</p>";
	
	layer.bindPopup(text);
}

var url, type, color, source;

url  = window.location.pathname;
url  = url.split('/');
type = url[3].split('.');

if (type[0] == "sd") {
	color = "#E62129";
	source = "src/json/data-sd.json";
} else if (type[0] == "smp") {
	color = "#FFF000";
	source = "src/json/data-smp.json";
} else if (type[0] == "sma") {
	color = "#6E3A3E";
	source = "src/json/data-sma.json";
}

var icon = L.MakiMarkers.icon({icon: "college", color: color, size: "l"});

$.getJSON(source, function(data) {
	L.geoJson(data, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: icon
			});
		},
		onEachFeature: onEachFeature
	}).addTo(map);
});

map.attributionControl.addAttribution('<a href="http://portal.bandung.go.id/">Pemerintah Kota Bandung</a> &copy; 2016');
map.attributionControl.addAttribution('Dinas Pendidikan & Dinas Komunikasi dan Informatika');