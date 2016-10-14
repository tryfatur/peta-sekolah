L.mapbox.accessToken = 'pk.eyJ1IjoidHJ5ZmF0dXIiLCJhIjoiY2lxdDJ5d3R1MDAydmZybmh3a3VtcmFvMiJ9.lL9RoXOtTscOHiSvOCrL-Q';
var map              = L.mapbox.map('map').setView([-6.909620, 107.634553], 13);
var tileLayer        = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken);
var info             = L.control();
var optionData       = L.control();
var marker           = L.FeatureGroup();
var geojson;
var text;

tileLayer.addTo(map);
L.MakiMarkers.accessToken = L.mapbox.accessToken;

function onEachFeature(feature, layer) {
	text = "<b>" + feature.properties.nama + "</b>";
	text += "<p>" + feature.properties.alamat_jalan + "</p>";
	text += "<p>" + "Kel." + feature.properties.desa_kelurahan_id + ", " + feature.properties.kecamatan + "</p>";
	
	layer.bindPopup(text);
}

var color, source;

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this._div.innerHTML = '<h4><b>Visualisasi Lokasi Sekolah Kota Bandung Kota Bandung</b></h4>';
	return this._div;
};
info.addTo(map);

optionData.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this._div.innerHTML = '<h4>Pilih Jenjang: <select id="jenjang">' + 
		'<option value="">-- Pilih Jenjang -- </option>' + 
		'<option value="sd">Sekolah Dasar/Sederajat</option>' + 
		'<option value="smp">Sekolah Menengah Pertama/Sederajat</option>' + 
		'<option value="sma">Sekolah Menengah Atas/Sederajat</option>' + 
		'</select></h4>';
	return this._div;
};
optionData.addTo(map);

function setMap(source, color){
	$.getJSON(source, function(data) {
		geojson = L.geoJson(data, {
			pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {
					icon: L.MakiMarkers.icon({icon: "college", color: color, size: "l"})
				});
			},
			onEachFeature: onEachFeature
		});
		tileLayer.addTo(map);
		geojson.addTo(map);
	});
}

$("#jenjang").on('change', function() {
	if (this.value == "sd") {
		map.eachLayer(function (layer) {
			map.removeLayer(layer)
		});
		setMap('src/json/data-sd.json', '#E62129');

	} else if (this.value == "smp") {
		map.eachLayer(function (layer) {
			map.removeLayer(layer)
		});
		setMap('src/json/data-smp.json', '#FFF000');
	} else if (this.value == "sma") {
		map.eachLayer(function (layer) {
			map.removeLayer(layer)
		});
		setMap('src/json/data-sma.json', '#6E3A3E');
	} else {
		tileLayer.addTo(map);
	}
});



map.attributionControl.addAttribution('<a href="http://portal.bandung.go.id/">Pemerintah Kota Bandung</a> &copy; 2016');
map.attributionControl.addAttribution('Dinas Pendidikan & Dinas Komunikasi dan Informatika');