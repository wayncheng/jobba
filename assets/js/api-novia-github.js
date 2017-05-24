//--------------------------------------------------
// GitHub Job Search API - Novia
//--------------------------------------------------

$(document).ready(function(){

	$('#submit').on('click', function(){
	    event.preventDefault();
	    $("#feed").empty();
		q = $('#search').val();
		city = $('#q-city').val();
		url = createGitHubURL(q,city,"","10");
		doAjaxCall(url,getGitHubResponse);
	});

});

// ---------------Sample Format--------------------
// https://jobs.github.com/positions.json?description=python&location=sf&full_time=true
// ------------------------------------------------


function createGitHubURL(searchString,city,state,noOfRecords){

	var url = "https://crossorigin.me/https://jobs.github.com/positions.json?";

	if(searchString != ""){
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
		globalObj.apiStatus.github = 'fail';
	});


}

function getGitHubResponse(result){
	// console.log('done',result);

	// console.log('-----------------JOB DETAILS-----------------');
	var jobsResults = result;
	var jobTitle;
	var jobCompany;
	var jobLocation;
	var jobDate;

	$("#feed").append();
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
			"source": "Github",
			"description": jobsResults[i].description,
			"url": jobsResults[i].url,
		}
		var jobStr = JSON.stringify(jobJSON);
		globalObj.print(jobStr);

	} // end for loop

	// Change status to done.
	globalObj.apiStatus.github = 'done';


}

