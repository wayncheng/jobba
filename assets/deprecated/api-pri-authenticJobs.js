
var totalAJJobs = 0;
var pageNumber = 1;

$('#submit').on('click', function(){
	    event.preventDefault();
	    $("#feed").empty();
		q = $('#search').val();
		var city = $('#q-city').val().trim();
		url = createAuthenticJobsReq(q,"",city,pageNumber,noOfRecords);
		console.log("Authentic Jobs URL: "+url);
		console.log("Authentic Jobs city: "+city);

		doAjaxCall(url,getAuthenticJobsResponse);
	});

$('#pagination').on('click','a', function(){
	    event.preventDefault();
		pageNumber = $(this).attr("page");
	    
	    $("#feed").empty();
		q = $('#search').val();
		var city = $('#q-city').val().trim();
		url = createAuthenticJobsReq(q,"",city,pageNumber,noOfRecords);
		console.log("Authentic Jobs URL: "+url);
		console.log("Authentic Jobs city: "+city);

		doAjaxCall(url,getAuthenticJobsResponse);
	});

// Sample url = https://authenticjobs.com/api/?api_key=a446a0eefe6f5699283g34f4d5b51fa0&method=aj.jobs.get&id=1569

function createAuthenticJobsReq(searchString,state,city,pageNumber,noOfRecords){

	var url = "https://crossorigin.me/https://authenticjobs.com/api/?api_key=fb7dee3fcbf41f8c7d867402491d81cb&method=aj.jobs.search&format=json";

	if(searchString != ""){
		searchString = encodeURIComponent(searchString);
		url = url + "&keywords=" + searchString;
	}
	if(state != ""){
		state = encodeURIComponent(state);
		url = url + "&location=" + state;
	}
	if(city != ""){
		var finalCity = city.split(",");

		if(finalCity.length>2){
			city = finalCity[0];
			console.log("Authenticjobs FINAL CITY IS: "+city);
		}
	

		city = encodeURIComponent(city);
		url = url + "&location=" + city;
	}
	else{ 
		city="san+diego";
		url = url + "&location=" + city;
	}	
	
	if(pageNumber != ""){
		pageNumber = encodeURIComponent(pageNumber);
		url = url + "&page=" + pageNumber;
	}
	if(noOfRecords != ""){
		noOfRecords = encodeURIComponent(noOfRecords);
		url = url + "&perpage=" + noOfRecords;
	}
	return url;

	console.log("URL is: "+url);
}

function doAjaxCall(qURL, mycallback){

	$.ajax({
		type:'GET',
		url: qURL,
	}).done(mycallback).fail(function(){
		//Create a new function to process errors
		console.log('fail', qURL.result);

		// Change status to fail.
		globalObj.apiStatus.authentic = 'fail';
	});


}

function getAuthenticJobsResponse(result){
	// console.log('done',result);
	// console.log('First Record No in this request :: ',result.firstDocument);
	// console.log('Last Record No in this request :: ',result.listings.total);
	// console.log('Previous URL if any :: ',result.prevURL);
	// console.log('Next URL :: ',result.nextUrl);

	var jobsResults = result.listings.listing;
	totalAJJobs = result.listings.total;
	console.log("TOTAL NUMBER OF AJ JOBS === ",totalAJJobs);
	console.log('-----------------AUTHENTIC JOB RESULTS-----------------');
	console.log('Authentic jobsResults',jobsResults);

	for(var i=0; i< jobsResults.length; i++){
		// console.log(i+1);
		// console.log('jobsResults[i]',jobsResults[i]);

	// Send to Global Print Function
		var ji = jobsResults[i];

		// Format date using moment.js
		var dateFormatted = moment(ji.post_date).format("MMM D");
		
		// In case company info is not provided...
		var loc, comp;
		if ( typeof ji.company === 'undefined' ) {
			comp = 'Company Info N/A';
			loc = 'Location N/A';
		}
		else if ( typeof ji.company === 'object' && typeof ji.company.location === 'undefined' ) {
			comp = ji.company.name;
			loc = 'Location N/A';
		}
		else {
			comp = ji.company.name;
			loc = ji.company.location.name;
		}

		// Packaging the output values for the printer in the global object
		var jobJSON = {
			"title" :  ji.title,
			"company": comp,
			"location": loc,
			"date": dateFormatted,
			"source": "Authentic Jobs",
			"description": ji.description,
			"url": ji.url
		}
			// "apply_url": ji.apply_url
		var jobStr = JSON.stringify(jobJSON);
		globalObj.print(jobStr);
		// globalObj.printManager(jobStr);

	}; // end for loop

	// Change status to done.
	// globalObj.apiStatus.authentic = 'done';

	// Notify console 
	console.log('-----------------AUTHENTIC JOBS DONE-----------------');


}