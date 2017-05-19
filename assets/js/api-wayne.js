


$(document).ready(function(){

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

// Initialize Firebase
var config = {
	apiKey: "AIzaSyBUVssFCnGKGEypDRsWSps4-Aklr1H9Zag",
	authDomain: "jobba-fe187.firebaseapp.com",
	databaseURL: "https://jobba-fe187.firebaseio.com",
	projectId: "jobba-fe187",
	storageBucket: "jobba-fe187.appspot.com",
	messagingSenderId: "430840990935"
};
firebase.initializeApp(config);

jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        console.log("URL ===",options.url);
    }
});


		

$('#submit').on('click',function(event){

<<<<<<< HEAD
	event.preventDefault();
	var uIP, uBrowser;
	var qURL = 'https://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=151095&t.k=dSWk91gUjq3&action=employers&q=web&userip=192.185.16.105&useragent=Chrome';
	
	$.ajax({
		type:'GET',
		url: qURL,
	}).done(function(result){
		var database = firebase.database();

		// Get search query for the sake of sorting by 
		var q = encodeURIComponent($('#search').val().trim());
		
		// In the event that search is left blank, bail out
		if ( q.length === 0 ) return;

		// Specify where to store the reponse.
		var refPath = '/searchLog/'+ q
		var searchRef = database.ref(refPath);

		// Pushes response to a unique ID at location specified above
		// push() is essential in order to avoid overwriting.
		var newSearchLog = searchRef.push();

		newSearchLog.set({
			source: 'Glassdoor',
			qURL: qURL,
			res: result.response,
		})

		// Log response to console
		console.log('done',result);

	}).fail(function(){
		console.log('fail', qURL.result);
	});

=======
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
>>>>>>> origin/master


}); //////////////////////////////////////// end click event

}); //////////////////////////////////////// end document.ready


