


var database = firebase.database();

// Search log portion of the database
// var searchRef = database.ref('/searchLog');



$('#submit').on('click',function(event){

	event.preventDefault();

	var q = encodeURIComponent($('#search').val());
	var refPath = '/searchLog/'+ q
	var queryRef = database.ref(refPath);
	var newSearchLog = queryRef.push();
	newSearchLog.set({

	})

});
