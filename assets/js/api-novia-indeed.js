//--------------------------------------------------
// Indeed Job Search API - Novia
//--------------------------------------------------

$(document).ready(function(){

	$('#submit').on('click', function(){
	    event.preventDefault();
	    $("#feed").empty();
		q = $('#search').val();
		city = $('#q-city').val();
		console.log("Indeed city is: "+city);
		url = createIndeedURL(q,city,"","50");
		doAjaxCall(url,getIndeedResponse);
	});

});


// ---------------Sample Format--------------------
// http://api.indeed.com/ads/apisearch?publisher=422492215893931&q=java&l=austin%2C+tx&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2
// ------------------------------------------------



function createIndeedURL(searchString,city,state,noOfRecords){

	var url = "https://crossorigin.me/https://api.indeed.com/ads/apisearch?publisher=422492215893931&sort=&radius=&st=&jt=&start=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Chrome&v=2&format=json";

	if(searchString != ""){
		searchString = encodeURIComponent(searchString);
		url = url + "&q=" + searchString;
	}
	if(city != ""){
		city = encodeURIComponent(city);
		url = url + "&l=" + city;
	}
	//Test case using San Diego
	else{ 
		city="san+diego";
		url = url + "&l=" + city;
	}	
	if(state != ""){
		state = encodeURIComponent(state);
		url = url + "C+" + state;
	}
	if(noOfRecords != ""){
		noOfRecords = encodeURIComponent(noOfRecords);
		url = url + "&limit=" + noOfRecords;
	}

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
		globalObj.apiStatus.indeed = 'fail';
	});


}

function getIndeedResponse(result){
	// console.log('done',result);
	// console.log('First Record No in this request :: ',result.start);
	// console.log('Last Record No in this request :: ',result.end);
	// console.log('Previous URL if any :: ',result.prevURL);
	// console.log('Next URL :: ',result.nextUrl);

	console.log('-----------------INDEED DETAILS-----------------');
	var jobsResults = result.results;

	$("#feed").append();
	for(var i=0; i< jobsResults.length; i++){
		console.log(i+1);
		console.log('jobsResults[i]',jobsResults[i]);

		// Format date using moment.js
		var dateFormatted = moment(jobsResults[i].date).format("MMM D");

		// Send to Global Print Function
		var jobJSON = {
			"title" :  jobsResults[i].jobtitle,
			"company": jobsResults[i].company,
			"location": jobsResults[i].city,
			"date": dateFormatted,
			"source": "Indeed",
			"description": jobsResults[i].snippet,
			"url": jobsResults[i].url,
		}
		var jobStr = JSON.stringify(jobJSON);
		// globalObj.print(jobStr);
		globalObj.printManager(jobStr);
	} // end for loop

	// Change status to done.
	globalObj.apiStatus.indeed = 'done';


}

