


// $(document).ready(function(){

// var uIP, uBrowser;
// var q;

// 	$.getJSON('https://jsonip.com/?callback=?', function (data) {
// 		var uIP = data.ip;
// 	});
//    	uBrowser = bowser.name;


// //  Click Event
// $('#submit').on('click', function(){
//     event.preventDefault();
// 	q = $('#search').val();
// }


// })

jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        console.log("URL ===",options.url);
    }
});


		


$(document).ready(function(){


	//UNCOMMENTED WAYNE'S CODE

		var qURL = 'https://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=151095&t.k=dSWk91gUjq3&userip=192.185.16.105&useragent=Chrome&q=web&action=jobs-prog';
		console.log("qUrl === ",qURL);
		$.ajax({
			type:'GET',
			url: qURL,
		}).done(function(result){
			console.log('done',result);
		}).fail(function(){
			console.log('fail', qURL.result);
		});



});


