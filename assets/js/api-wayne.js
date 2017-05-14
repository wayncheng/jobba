


// var uIP, uBrowser;
// var q;

//  Click Event
// $('#submit').on('click', function(){
//     event.preventDefault();
// 	q = $('#search').val();

//     gd();
// });


	// $.getJSON('https://jsonip.com/?callback=?', function (data) {
	// 	uIP = data.ip;
	// });
 //   	uBrowser = bowser.name;
$(document).ready(function(){

var uIP, uBrowser;

	// $.getJSON('https://jsonip.com/?callback=?', function (data) {
	// 	var uIP = data.ip;
	// });

		$.getJSON("http://api.glassdoor.com/api/api.htm", {
		    v: 1,
		    format: 'json',
		    't.p': '151095',
		    't.k': 'dSWk91gUjq3',
		    action: 'employers',
		    q: 'developer',
		    userip: '0.0.0.0',
		    useragent: bowser.name
		}, function(response) {
		    console.log('response',response);
		});


// };
// gd();
})
			// $.ajax({
			// 	type: 'GET',
			// 	url: gd_queryURL,
			// }).done(function(response){
			// 	console.log('response',response);



			// }); //end ajax

		




