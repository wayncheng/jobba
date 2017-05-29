//--------------------------------------------------
// Linkup Job Search API
//--------------------------------------------------

$(document).ready(function(){

	$('#submit').on('click', function(){
	    event.preventDefault();
	    $("#feed").empty();
		q = $('#search').val();
		city = $('#q-city').val();
		url = createGitHubURL(q,city,"","10");
		doAjaxCall(url,getLinkupResponse);
	});
	$('#pagination').on('click','a', function(){
	    event.preventDefault();
		pageNumber = $(this).attr("page");

	    $("#feed").empty();
		q = $('#search').val();
		city = $('#q-city').val();
		url = createGitHubURL(q,city,"");
		doAjaxCall(url,getLinkupResponse);
	});

});



function CreateLinkupUrl(searchString,city,state,noOfRecords){

	var url = "";

	if(searchString != "http://www.linkup.com/developers/v-1/search-handler.js?api_key=6681AB844790FB012488B9027B231749&embedded_search_key=b599c6a6e9b2178c2e673516252cad2a&orig_ip=127.0.0.1&keyword=sales&location=55344&distance=50"){
		searchString = encodeURIComponent(searchString);
		url = url + "&description=" + searchString;
	}
	if(city != ""){
		city = encodeURIComponent(city);
		url = url + "&location=" + city;
	}
	//Test case using LA
	else{ 
		city="la";
		url = url + "&location=" + city;
	}	

		url = url + "&full_time=true";
	
	console.log("URL is:"+url);
	return url;
}

function doAjaxCall(qURL, mycallback){

	$.ajax({
		type:'GET',
		url: qURL,
	}).done(mycallback).fail(function(){
		//Create a new function to process errors
		console.log('fail', qURL.result);

		// Change status to fail.
		// globalObj.apiStatus.github = 'fail'; //  ADD STATUS!
	});


}

function getLinkupResponse(result){
	// console.log('done',result);

	var jobsResults = result;
	var jobTitle;
	var jobCompany;
	var jobLocation;
	var jobDate;


	console.log('-----------------Linkup RESULTS-----------------');
	console.log('linkup jobsResults',jobsResults);

	for(var i=0; i< jobsResults.length; i++){
		// console.log(i+1);

		jobTitle = jobsResults[i].title;
		jobCompany = jobsResults[i].company;
		jobLocation = jobsResults[i].location;
		jobDate = jobsResults[i].created_at;

		// Format date using moment.js
		var dateFormatted = moment(jobDate).format("MMM D");

		// Send to Global Print Function
		var jobJSON = {
			"title" :  jobTitle,
			"company": jobCompany,
			"location": jobLocation,
			"date": dateFormatted,
			"source": "Linkup",
			"description": jobsResults[i].description,
			"url": jobsResults[i].url,
		}
		var jobStr = JSON.stringify(jobJSON);
		globalObj.print(jobStr);

	} // end for loop




}

