$(document).ready(function(){
	var city,q;

	$('#submit').on('click', function(){
	    event.preventDefault();
	    $("#feed").empty();
			q = $('#search').val();
			city = $('#q-city').val();

			var githubURL = github.createURL(q,city,"","10");
			github.ajaxCall(githubURL,github.getResponse);
	});

});

// $('#submit').on('click', function(){
// 		authenticURL = createAuthenticJobsReq(q,"",city,"","100");
// 		console.log("Authentic Jobs URL: "+authenticURL);
// 		console.log("Authentic Jobs city: "+city);

// 		doAjaxCall(url,getAuthenticJobsResponse);
// 	});

var github = {
	url: "",
	
	createURL: 	
		function(searchString,city,state,noOfRecords) {
			// ---------------Sample Format--------------------
			// https://jobs.github.com/positions.json?description=python&location=sf&full_time=true
			// ------------------------------------------------

			var githubURL = "https://crossorigin.me/https://jobs.github.com/positions.json?";
			github.url = githubURL;

			if(searchString != ""){
				searchString = encodeURIComponent(searchString);
				githubURL = githubURL + "&description=" + searchString;
			}
			if(city != ""){
				city = encodeURIComponent(city);
				githubURL = githubURL + "&location=" + city;
			}
			//Test case using LA
			else{ 
				city="la";
				githubURL = githubURL + "&location=" + city;
			}	

				githubURL = githubURL + "&full_time=true";
			
			console.log("Github URL is:"+githubURL);
			return githubURL;
		},

	getResponse: 
		function(result){
			var jobsResults = result;
			var jobTitle, 
				jobCompany, 
				jobLocation, 
				jobDateRaw, 
				jobDate,
				jobSource,
				jobDescription,
				jobURL;

			console.log('-----------------GITHUB DETAILS-----------------');
			for(var i=0; i< jobsResults.length; i++){
				var ji = jobsResults[i];

				jobTitle = ji.title;
				jobCompany = ji.company;
				jobLocation = ji.location;
				jobDateRaw = ji.created_at;
				jobDate = moment(jobDateRaw).format("MMM D");
				jobSource = "Github";
				jobDescription = ji.description;
				jobURL = ji.url;

				// Send to Global Print Function
				var jobJSON = {
					"title" :  jobTitle,
					"company": jobCompany,
					"location": jobLocation,
					"date": jobDate,
					"source": jobSource,
					"description": jobDescription,
					"url": jobURL,
				}
				var jobStr = JSON.stringify(jobJSON);
				globalObj.printManager(jobStr);
			} // end for loop

			// Change status to done.
			globalObj.apiStatus.github = 'done';

		},

	ajaxCall: 
		function(qURL, mycallback){
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
}

// function createGitHubURL(searchString,city,state,noOfRecords){
// 	// ---------------Sample Format--------------------
// 	// https://jobs.github.com/positions.json?description=python&location=sf&full_time=true
// 	// ------------------------------------------------

// 	var githubURL = "https://crossorigin.me/https://jobs.github.com/positions.json?";

// 	if(searchString != ""){
// 		searchString = encodeURIComponent(searchString);
// 		githubURL = githubURL + "&description=" + searchString;
// 	}
// 	if(city != ""){
// 		city = encodeURIComponent(city);
// 		githubURL = githubURL + "&location=" + city;
// 	}
// 	//Test case using LA
// 	else{ 
// 		city="la";
// 		githubURL = githubURL + "&location=" + city;
// 	}	

// 		githubURL = githubURL + "&full_time=true";
	
// 	console.log("Github URL is:"+githubURL);
// 	return githubURL;
// }


// function getGitHubResponse(result){

// 	var jobsResults = result;
// 	var jobTitle, 
// 		jobCompany, 
// 		jobLocation, 
// 		jobDateRaw, 
// 		jobDate,
// 		jobSource,
// 		jobDescription,
// 		jobURL;

// 	for(var i=0; i< jobsResults.length; i++){
// 		var ji = jobsResults[i];

// 		jobTitle = ji.title;
// 		jobCompany = ji.company;
// 		jobLocation = ji.location;
// 		jobDateRaw = ji.created_at;
// 		jobDate = moment(jobDateRaw).format("MMM D");
// 		jobSource = "Github";
// 		jobDescription = ji.description;
// 		jobURL = ji.url;

// 		// Send to Global Print Function
// 		var jobJSON = {
// 			"title" :  jobTitle,
// 			"company": jobCompany,
// 			"location": jobLocation,
// 			"date": jobDate,
// 			"source": jobSource,
// 			"description": jobDescription,
// 			"url": jobURL,
// 		}
// 		var jobStr = JSON.stringify(jobJSON);
// 		globalObj.printManager(jobStr);
// 	}
// }


// function doAjaxCall(qURL, mycallback){

// 	$.ajax({
// 		type:'GET',
// 		url: qURL,
// 	}).done(mycallback).fail(function(){
// 		//Create a new function to process errors
// 		console.log('fail', qURL.result);
// 	});


// }