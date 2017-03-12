L.mapbox.accessToken = 'pk.eyJ1IjoidHJ5ZmF0dXIiLCJhIjoiY2lxdDJ5d3R1MDAydmZybmh3a3VtcmFvMiJ9.lL9RoXOtTscOHiSvOCrL-Q';

var map        = L.mapbox.map('map').setView([-6.909620, 107.634553], 13);
var tileLayer  = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken);
var marker     = L.FeatureGroup();
var cluster    = L.markerClusterGroup();
var geojson, radius, pointMarker, text, color, source;

tileLayer.addTo(map);
L.MakiMarkers.accessToken = L.mapbox.accessToken;

$(".leaflet-control-zoom").css("visibility", "hidden");

function onEachFeature(feature, layer) {
	text = "<h2><b>" + feature.properties.nama + "</b></h2>";
	text += "<p>" + feature.properties.alamat_jalan + "</p>";
	text += "<p>" + "Kel." + feature.properties.desa_kelurahan_nama + ", Kec. " + feature.properties.kecamatan_nama + "</p>";
	text += "<p>" + "Jumlah Guru: " + feature.properties.ptk + "</p>";
	text += "<p>" + "Jumlah Pegawai: " + feature.properties.pegawai + "</p>";
	text += "<p>" + "Jumlah Peserta Didik: " + feature.properties.pd + "</p>";
	text += "<p>" + "Jumlah Rombongan Belajar: " + feature.properties.rombel + "</p>";
	text += "<p>" + "Jumlah Ruang Kelas: " + feature.properties.ruang_kelas + "</p>";
	text += "<p>" + "Jumlah Perpustakaan: " + feature.properties.jml_perpus + "</p>";
	text += "<p>" + "Jumlah Laboratorium: " + feature.properties.jml_lab + "</p>";
	
	layer.bindPopup(text);
}

/*info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this._div.innerHTML = '<h4><b>Visualisasi Lokasi Sekolah Kota Bandung Kota Bandung</b></h4>';
	return this._div;
};
info.addTo(map);*/

/*optionData.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this._div.innerHTML = '<h4>Pilih Jenjang: <select id="jenjang">' + 
		'<option value="">-- Pilih Jenjang -- </option>' + 
		'<option value="sd">Sekolah Dasar/Sederajat</option>' + 
		'<option value="smp">Sekolah Menengah Pertama/Sederajat</option>' + 
		'<option value="sma">Sekolah Menengah Atas/Sederajat</option>' + 
		'</select></h4>';
	return this._div;
};
optionData.addTo(map);*/

function setMap(source, color){
	$.getJSON(source, function(data) {
		geojson = L.geoJson(data, {
			pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {icon: L.MakiMarkers.icon({icon: "college", color: color, size: "s"})});
			},
			filter: function (feature, layer) {
				return feature.properties.status_sekolah == "Negeri";
			},
			onEachFeature: onEachFeature
		});

		radius = L.geoJson(data, {
			pointToLayer: function(feature, latlng){
				return L.circle(latlng, 500, {color: color, fillColor: color, fillOpacity: 0.5 });
			},
			filter: function (feature, layer) {
				return feature.properties.status_sekolah == "Negeri";
			},
			onEachFeature: onEachFeature
		});

		// Clustering Pointer
		/*cluster.clearLayers();
		cluster.addLayer(geojson);
		cluster.addLayer(radius);
		map.addLayer(cluster);*/

		map.addLayer(geojson);
		map.addLayer(radius);

		tileLayer.addTo(map);
	});
}

function jenjangSekolah(jenjang) {
	switch (jenjang){
		case 1: 
			map.eachLayer(function (layer) {
				map.removeLayer(layer);
			});

			setMap('src/json/data-sd.json', '#E62129');
		break;

		case 2:
			map.eachLayer(function (layer) {
				map.removeLayer(layer);
			});

			setMap('src/json/data-smp.json', '#002C7F');
		break;

		case 3:
			map.eachLayer(function (layer) {
				map.removeLayer(layer);
			});

			setMap('src/json/data-sma.json', '#6E3A3E');
		break;
	}
}

map.attributionControl.addAttribution('<a href="http://portal.bandung.go.id/">Pemerintah Kota Bandung</a> &copy; 2016');
map.attributionControl.addAttribution('Dinas Pendidikan & Dinas Komunikasi dan Informatika');