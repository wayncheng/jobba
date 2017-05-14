


$(document).ready(function(){

var uIP, uBrowser;
var q;

//  Click Event
$('#submit').on('click', function(){
    event.preventDefault();
	q = $('#search').val();

    getGlassDoor();
});

// var userInfo = {
// 					'ip': '',
// 					'browser': '',
// 					'version': bowser.version,
// 				};

	$.getJSON('https://jsonip.com/?callback=?', function (data) {
		uIP = data.ip;
	});
    // User Bowser to get Browser/userAgent. 
   	uBrowser = bowser.name;

    // navigator.userAgent is widely discouraged, due to ineffectiveness
    // var agent = navigator.userAgent;


function getGlassDoor(){

			// var gd_tp, gd_tk, gd_userIP, gd_action;
			// gd_tp = '151095';
			// gd_tk = 'dSWk91gUjq3';
			// gd_userIP = uIP;
			// gd_userAgent = userInfo.browser +'/%2F'+ userInfo.version;
			// gd_action = 'employers';
			// console.log('gd_userIP',gd_userIP);



			// var gd_queryURL = 'http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p='+ gd_tp +'&t.k='+ gd_tk +'&action='+ gd_action +'&q=pharmaceuticals&userip='+ uIP +'&useragent='+ api.userInfo.browser +'/%2F'+ api.userInfo.version;
			// var gd_queryURL = 'http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=151095&t.k=dSWk91gUjq3&action=employers&q='+ q +'&userip='+ userInfo.ip +'&useragent='+ gd_userAgent;

			// var gd_queryURL = 'http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=151095&t.k=dSWk91gUjq3&action=employers&q=developer&userip=2602:306:c40d:54b0:45fe:eeaf:3f0c:b0bd&useragent=Chrome';
			var gd_queryURL = 'https://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=151095&t.k=dSWk91gUjq3&action=employers&q='+ q +'&userip='+ uIP +'&useragent='+ uBrowser;


			console.log('gd_queryURL',gd_queryURL);


			$.ajax({
				type: 'GET',
				url: gd_queryURL
			}).done(function(response){
				console.log('response',response);



			}); //end ajax

		}




});