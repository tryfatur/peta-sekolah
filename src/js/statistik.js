$(document).ready(function () {
	$('#dataSekolah').DataTable({
		'ajax': 'src/json/data-lengkap.json',
		'columns': [
			{'data': 'npsn'},
			{'data': 'nama'},
			{'data': 'jenjang_pendidikan_nama'},
			{'data': 'alamat_jalan'},
			{'data': 'status_kepemilikan_nama'}
		]
	});
});

var counterSD = 0, counterSMP = 0, counterSMA = 0, counterSMK = 0;
for (var i = 0; i < sekolah.data.length; i++) {
	if (sekolah.data[i].bentuk_pendidikan_id == 5) { counterSD++; }
	if (sekolah.data[i].bentuk_pendidikan_id == 6) { counterSMP++; }
	if (sekolah.data[i].bentuk_pendidikan_id == 13) { counterSMA++; }
	if (sekolah.data[i].bentuk_pendidikan_id == 15) { counterSMK++; }
}

jumlahSekolah = counterSD + counterSMP + counterSMA + counterSMK;

$('#jumlahSekolah').text(jumlahSekolah);
$('#jumlahSD').text(counterSD);
$('#jumlahSMP').text(counterSMP);
$('#jumlahSMA').text(counterSMA);
$('#jumlahSMK').text(counterSMK);

var listKecamatan = $('#listKecamatan');
var totalData;

listKecamatan.append('<option value="">-- Pilih Kecamatan --</option>');
$.each(kecamatan.data, function(i, val) {
	listKecamatan.append('<option value="' + val.id + '">' + val.nama + '</option>');
});

var sekolahNegeri = 0;
var result = {
	jp: {
		jml_sd: 0,
		jml_smp: 0,
		jml_sma: 0
	},
	js: {
		sd_negeri: 0,
		smp_negeri: 0,
		sma_negeri: 0,
		sd_swasta: 0,
		smp_swasta: 0,
		sma_swasta: 0
	},
	sk:{
		pp: 0,
		pemda: 0,
		yayasan: 0,
		lainnya: 0
	},
	kk:{
		tanpa_kebutuhan_khusus: 0,
		kebutuhan_khusus: 0
	}
};

var options = {
	chart: {
		plotBackgroundColor: null,
		plotBorderWidth: null,
		plotShadow: false,
		type: 'pie'
	},
	title: { text: ''},
	tooltip: {
		pointFormat: '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)'
	},
	plotOptions: {
		pie: {
			allowPointSelect: true,
			cursor: 'pointer',
			dataLabels: {
				enabled: false
			},
			showInLegend: true
		}
	},
	series: [{
		name: 'Jumlah',
		colorByPoint: true
	}]
}

listKecamatan.change(function() {
	for (var i = 0; i < sekolah.data.length; i++) {
		if (sekolah.data[i].kecamatan_id == listKecamatan.val()) {
			// 1. Jumlah SD, SMP, SMA perkecamatan
			if (sekolah.data[i].jenjang_pendidikan == 4) { result.jp.jml_sd++ };
			if (sekolah.data[i].jenjang_pendidikan == 5) { result.jp.jml_smp++ };
			if (sekolah.data[i].jenjang_pendidikan == 6) { result.jp.jml_sma++ };

			// 2. Jumlah SD Negeri, SMP Negeri & SMA Negeri perkecamatan
			if ((sekolah.data[i].jenjang_pendidikan == 4) && (sekolah.data[i].jenis_sekolah_id == 1)) { result.js.sd_negeri++ };
			if ((sekolah.data[i].jenjang_pendidikan == 5) && (sekolah.data[i].jenis_sekolah_id == 1)) { result.js.smp_negeri++ };
			if ((sekolah.data[i].jenjang_pendidikan == 6) && (sekolah.data[i].jenis_sekolah_id == 1)) { result.js.sma_negeri++ };
			
			// 3. Jumlah SD Swasta, SMP Swasta & SMA Swasta perkecamatan
			if ((sekolah.data[i].jenjang_pendidikan == 4) && (sekolah.data[i].jenis_sekolah_id == 2)) { result.js.sd_swasta++ };
			if ((sekolah.data[i].jenjang_pendidikan == 5) && (sekolah.data[i].jenis_sekolah_id == 2)) { result.js.smp_swasta++ };
			if ((sekolah.data[i].jenjang_pendidikan == 6) && (sekolah.data[i].jenis_sekolah_id == 2)) { result.js.sma_swasta++ };

			// 4. Jumlah sekolah berdasarkan kepemilikan perkecamatan
			if (sekolah.data[i].status_kepemilikan_id == 1) { result.sk.pp++ };
			if (sekolah.data[i].status_kepemilikan_id == 2) { result.sk.pemda++ };
			if (sekolah.data[i].status_kepemilikan_id == 3) { result.sk.yayasan++ };
			if (sekolah.data[i].status_kepemilikan_id == 4) { result.sk.lainnya++ };

			// 5. Jumlah sekolah berkebutuhan khusus perkecamatan
			if (sekolah.data[i].kebutuhan_khusus_id == 0) { result.kk.tanpa_kebutuhan_khusus++ };
			if (sekolah.data[i].kebutuhan_khusus_id != 0) { result.kk.kebutuhan_khusus++ };
		}
	}

	options.series[0].data = [
		['SD/Sederajat', result.jp.jml_sd],
		['SMP/Sederajat', result.jp.jml_smp],
		['SMA/Sederajat', result.jp.jml_sma]
	];
	$('#jenjangPendidikan').css('height', '400px');
	$('#jenjangPendidikan').highcharts(options);

	options.series[0].data = [
		['SD/Sederajat Negeri', result.js.sd_negeri],
		['SMP/Sederajat Negeri', result.js.smp_negeri],
		['SMA/Sederajat Negeri', result.js.sma_negeri]
	];
	$('#jenisSekolahNegeri').css('height', '400px');
	$('#jenisSekolahNegeri').highcharts(options);

	options.series[0].data = [
		['SD/Sederajat Swasta', result.js.sd_swasta],
		['SMP/Sederajat Swasta', result.js.smp_swasta],
		['SMA/Sederajat Swasta', result.js.sma_swasta]
	];
	$('#jenisSekolahSwasta').css('height', '400px');
	$('#jenisSekolahSwasta').highcharts(options);

	options.series[0].data = [
		['Pemerintah Pusat', result.sk.pp],
		['Pemerintah Daerah', result.sk.pemda],
		['Yayasan', result.sk.yayasan],
		['Lainnya', result.sk.lainnya]
	];
	$('#kepemilikanSekolah').css('height', '400px');
	$('#kepemilikanSekolah').highcharts(options);

	options.series[0].data = [
		['Tanpa Kebutuhan Khusus', result.kk.tanpa_kebutuhan_khusus],
		['Dengan Kebutuhan Khusus', result.kk.kebutuhan_khusus],
	];
	$('#kebutuhanKhusus').css('height', '400px');
	$('#kebutuhanKhusus').highcharts(options);
});