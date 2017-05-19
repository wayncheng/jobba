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
	});


}

function getGitHubResponse(result){
	console.log('done',result);

	console.log('-----------------JOB DETAILS-----------------');
	var jobsResults = result;
	var jobTitle;
	var jobCompany;
	var jobLocation;
	var jobDate;

	$("#feed").append();
	for(var i=0; i< jobsResults.length; i++){
		console.log(i+1);

		jobTitle = jobsResults[i].title;
		jobCompany = jobsResults[i].company;
		jobLocation = jobsResults[i].location;
		jobDate = jobsResults[i].created_at;



		console.log('jobTitle :: ',jobTitle);
		console.log('company :: ',jobCompany);
		console.log('location :: ',jobLocation);
		console.log('date ::',jobDate);

		// var p = $("<p>");

		// var source = $("<span>");
		// source.append("Source:: ");
		// source.append("GitHub");
		// source.append("&nbsp;");
		// source.append("&nbsp;");

		// var jobTitleDisplay = $("<span>");
		// jobTitleDisplay.append("Job Title :: ");
		// jobTitleDisplay.append(jobTitle);
		// jobTitleDisplay.append("&nbsp;");
		// jobTitleDisplay.append("&nbsp;");

		// var companyDisplay = $("<span>");
		// companyDisplay.append("Company :: ");
		// companyDisplay.append(jobCompany);
		// companyDisplay.append("&nbsp;");
		// companyDisplay.append("&nbsp;");

		// var locationDisplay = $("<span>");
		// locationDisplay.append("Location :: ");
		// locationDisplay.append(jobLocation);
		// locationDisplay.append("&nbsp;");
		// locationDisplay.append("&nbsp;");

		// var detailUrl = $("<a>");
		// var detailUrlImg = $("<img>");
		// detailUrlImg.attr("src","assets/img/github-logo.png");
		// detailUrl.attr("href",jobsResults[i].url);
		// detailUrl.attr("name","detailUrl");
		// detailUrl.attr("target","_blank");
		// detailUrlImg.addClass("logo");
		// detailUrl.append(detailUrlImg);

		

		// p.append(source);
		// p.append(jobTitleDisplay);
		// p.append(companyDisplay);
		// p.append(locationDisplay);
		// p.append(detailUrl);

		// $("#feed").append(p);

		// Format date using moment.js
		var dateFormatted = moment(jobDate).format("MMM D");

		// Send to Global Print Function
		var jobJSON = {
			"title" :  jobTitle,
			"company": jobCompany,
			"location": jobLocation,
			"date": dateFormatted,
			"source": "Github",
			
		}
		var jobStr = JSON.stringify(jobJSON);
		globalObj.print(jobStr);

	}


}

