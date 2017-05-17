


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


		


$(document).ready(function(){


	//UNCOMMENTED WAYNE'S CODE

	var uIP, uBrowser;
	var qURL = 'https://crossorigin.me/https://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=151095&t.k=dSWk91gUjq3&action=employers&q=web&userip=192.185.16.105&useragent=Chrome';
	
	$.ajax({
		type:'GET',
		url: qURL,
	}).done(function(result){
		console.log('done',result);
	}).fail(function(){
		console.log('fail', qURL.result);
	});




});


