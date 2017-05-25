$(document).ready(function(){
	console.log('devTools loaded');

	var $w = $(window);

	// var height, innerHeight, innerWidth, outerHeight, outerWidth, width;
	// var keyList = ['height','innerHeight','innerWidth','outerHeight','outerWidth','width'];
	// // var data = [
	// // 	{ 'height' : 0 },
	// // 	{ 'innerHeight': 0 },
	// // 	{ 'innerWidth': 0 },
	// // 	{ 'outerHeight': 0 },
	// // 	{ 'outerWidth': 0 },
	// // 	{ 'width': 0 }
	// // ];
	// var data = {
	// 	'height' : 0 ,
	// 	'innerHeight': 0 ,
	// 	'innerWidth': 0 ,
	// 	'outerHeight': 0 ,
	// 	'outerWidth': 0 ,
	// 	'width': 0
	// };

	// function getReport(elem){
	// 		var el = elem;

	// 		data.height = 		el.height();
	// 		data.innerHeight = 	el.innerHeight();
	// 		data.innerWidth = 	el.innerWidth();
	// 		data.outerHeight = 	el.outerHeight();
	// 		data.outerWidth = 	el.outerWidth();
	// 		data.width = 		el.width();

	// 		// data[0].height = el.height();
	// 		// data[1].innerHeight = el.innerHeight();
	// 		// data[2].innerWidth = el.innerWidth();
	// 		// data[3].outerHeight = el.outerHeight();
	// 		// data[4].outerWidth = el.outerWidth();
	// 		// data[5].width = el.width();

	// 		// data[0].value = el.height();
	// 		// data[1].value = el.innerHeight();
	// 		// data[2].value = el.innerWidth();
	// 		// data[3].value = el.outerHeight();
	// 		// data[4].value = el.outerWidth();
	// 		// data[5].value = el.width();

	// 		console.log('data',data);
	// 		writeToHTML();
	// 	}; // end getReport()

	// function writeToHTML(){
	// 	for (var i=0; i<keyList.length; i++) {
	// 		var dataKey = keyList[i];
	// 		// var di = data[i];
	// 		// console.log('di',di);
	// 		// var dk = data.dataKey;
	// 		var dataValue = data[dataKey].toString();
	// 		var dataAttr = 'data-' + dataKey;
	// 		console.log('dataKey',dataKey);
	// 		console.log('dataValue',dataValue);
	// 		console.log('dataAttr',dataAttr);

	// 		$('html').attr(dataAttr,dataValue);
	// 	};
	// 	}; //////////////////// end writeToHTML()


var u = {
	keyList: [ 
		'height',
		'innerHeight',
		'innerWidth',
		'outerHeight',
		'outerWidth',
		'width'
	],
	
	data: {
		'height' : 0 ,
		'innerHeight': 0 ,
		'innerWidth': 0 ,
		'outerHeight': 0 ,
		'outerWidth': 0 ,
		'width': 0
	},

	getReport: 
			function(elem){
				var el = elem;

				u.data.height = 		el.height();
				u.data.innerHeight = 	el.innerHeight();
				u.data.innerWidth = 	el.innerWidth();
				u.data.outerHeight = 	el.outerHeight();
				u.data.outerWidth = 	el.outerWidth();
				u.data.width = 			el.width();

				console.log('data',u.data);
				u.writeToHTML();
			},
	writeToHTML: 
			function(){
				for (var i=0; i<u.keyList.length; i++) {
					var dataKey = u.keyList[i];
					// var di = data[i];
					// console.log('di',di);
					// var dk = data.dataKey;
					var dataValue = u.data[dataKey].toString();
					var dataAttr = 'data-' + dataKey;
					console.log('dataKey',dataKey);
					console.log('dataValue',dataValue);
					console.log('dataAttr',dataAttr);

					$('html').attr(dataAttr,dataValue);
				}; // end loop
			},

	bootstrapAlert:
			function(){

				var w = $(window).width();
				var h = $(window).height();
				var el = $('html');
				var body = $('body');

				// log window width 
				el.attr('data-window-width', w);
				el.attr('data-window-height', h);

				// log bootstrap grid size
				if ( w >= 1200 ) {
					// el.attr('data-boot-size', 'col-xl-')
					body.attr('data-boot-size', 'col-xl-')
				}
				else if ( w >= 992 ) {
					// el.attr('data-boot-size', 'col-lg-')
					body.attr('data-boot-size', 'col-lg-')
				}
				else if ( w >= 768 ) {
					// el.attr('data-boot-size', 'col-md-')
					body.attr('data-boot-size', 'col-md-')
				}
				else if ( w >= 576 ) {
					// el.attr('data-boot-size', 'col-sm-')
					body.attr('data-boot-size', 'col-sm-')
				}
				else {
					// el.attr('data-boot-size', 'col-')
					body.attr('data-boot-size', 'col-')
				}
			}
} ////////////////////// end u object

// Window event
// $(window).on('click', function(event){
// 	event.preventDefault();
// 	u.getReport($w);
// });

// Throttled event
	// Set resizeTimer to empty so it resets on page load
	var resizeTimer; 
	var delay = 200;
	// On resize, run the function and reset the timeout
	$(window).on('resize', function() {
	    clearTimeout(resizeTimer);
	    resizeTimer = setTimeout(u.bootstrapAlert, delay);
	});

	u.bootstrapAlert();


// Bind to Window
	window.ub = u;

}); ////////////////////////////////////////////////// end document.ready