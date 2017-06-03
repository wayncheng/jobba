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



function CreateLinkupUrl(searchString,city,state){

	var url = "https://cors-anywhere.herokuapp.com/http://www.linkup.com/developers/v-1/search-handler.js?api_key=6681AB844790FB012488B9027B231749&embedded_search_key=b599c6a6e9b2178c2e673516252cad2a&orig_ip=j"+jobba.userIP;

	if(searchString != ""){
		searchString = encodeURIComponent(searchString);
		url = url + "&keyword=" + searchString;
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
	
	console.log("Linkup URL is:"+url);
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

	var jobsResults = result.jobs;
	var jobTitle;
	var jobCompany;
	var jobLocation;
	var jobDate;


	console.log('-----------------Linkup RESULTS-----------------');
	console.log('linkup jobsResults',jobsResults);

	for(var i=0; i< jobsResults.length; i++){
		// console.log(i+1);

		jobTitle = jobsResults[i].job_title;
		jobCompany = jobsResults[i].job_company;
		jobLocation = jobsResults[i].job_location;
		jobDate = jobsResults[i].job_date_added;

		// Format date using moment.js
		var dateFormatted = moment(jobDate).format("MMM D");

		// Send to Global Print Function
		var jobJSON = {
			"title" :  jobTitle,
			"company": jobCompany,
			"location": jobLocation,
			"date": dateFormatted,
			"source": "Linkup",
			"description": jobsResults[i].job_description,
			"url": jobsResults[i].job_title_link,
		}
		var jobStr = JSON.stringify(jobJSON);
		console.log(jobStr);

	} // end for loop

}



//=============================================
// 					TESTING 
//=============================================



 var qURL = CreateLinkupUrl("software","san diego","california");
	console.log("url "+ qURL);
	
	$.ajax({
		type:'GET',
		url: qURL,
	}).done(function(result){
		

		console.log('done',result);
		console.log('Title: ' + result.job_title)
		getLinkupResponse(result);

	}).fail(function(){
		console.log('fail', qURL.result);
	});

	


//=============================================
// 					
//=============================================
