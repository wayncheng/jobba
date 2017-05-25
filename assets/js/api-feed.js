$(document).ready(function(){
	//  City Autocomplete
		var locationOptions = { 
			types: ['(cities)'] 
		};
	    var locationInput = document.getElementById('q-city');
	    var autocomplete = new google.maps.places.Autocomplete(locationInput, locationOptions);



	$('#submit').on('click', function(event){
	    event.preventDefault();
		globalObj.reset();

		// Search parameters
		var q = $('#search').val();
		var city = $('#q-city').val();

		console.log('q',q);
		console.log('city', city);

		var githubURL = github.createURL(q,city,"","10");
		github.ajaxCall(githubURL,github.getResponse);

		var indeedURL = indeed.createURL(q,city,"","50");
		indeed.ajaxCall(indeedURL,indeed.getResponse);

		var diceURL = dice.createURL(q,"",city,"","","");
		dice.ajaxCall(diceURL,dice.getResponse);

		var authenticURL = authentic.createURL(q,"",city,"","100");
		authentic.ajaxCall(authenticURL,authentic.getResponse);

		setTimeout(printAllResultsObject, 10000);
	});

	function printAllResultsObject(){
		var resultArray = globalObj.allResults;
		var allResultsParsed = [];
		for (var i=0; i<resultArray.length; i++) {
			var resultJSON = JSON.parse(resultArray[i]);
			allResultsParsed.push(resultJSON);
		};
		console.log('allResultsParsed',allResultsParsed);
	};

});

/*=============================================================
        GITHUB
==============================================================*/
var github = {
	url: "",

	createURL: 	
		function(searchString,city,state,noOfRecords) {
			// ---------------Sample Format--------------------
			// https://jobs.github.com/positions.json?description=python&location=sf&full_time=true
			// ------------------------------------------------

			var githubURL = "https://crossorigin.me/https://jobs.github.com/positions.json?";

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
			github.url = githubURL;
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

			console.log('-----------------GITHUB RESULTS-----------------');
			console.log('Github jobsResults',jobsResults);

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

			// Notify console 
			console.log('-----------------GITHUB DONE-----------------');
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
}; // end github object


/*=============================================================
        INDEED
==============================================================*/
var indeed = {
	url: "",

	createURL:
		function(searchString,city,state,noOfRecords){

			var url = "https://crossorigin.me/https://api.indeed.com/ads/apisearch?publisher=422492215893931&sort=&radius=&st=&jt=&start=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Chrome&v=2&format=json";
			indeed.url = url;

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

			console.log("Indeed URL is: "+url);
			indeed.url = url;
			return url;
		},

	getResponse: 
		function(result){

			var jobsResults = result.results;

			console.log('-----------------INDEED RESULTS-----------------');
			console.log('Indeed jobsResults',jobsResults);

			for(var i=0; i< jobsResults.length; i++){

				// var	ji = jobsResults[i],
				// 	jobTitle = ji.jobtitle, 
				// 	jobCompany = ji.company, 
				// 	jobLocation = ji.city, 
				// 	jobDateRaw = ji.date, 
				// 	jobDate = moment(ji.date).format("MMM D"),
				// 	jobSource = "Indeed",
				// 	jobDescription = ji.snippet,
				// 	jobURL = ji.url;

				var ji = jobsResults[i];

				// Send to Global Print Function
				var jobJSON = {
					"title" :  ji.jobtitle,
					"company": ji.company,
					"location": ji.city,
					"date": moment(ji.date).format("MMM D"),
					"source": "Indeed",
					"description": ji.snippet,
					"url": ji.url,
				}
				// Convert to string for export
				var jobStr = JSON.stringify(jobJSON);

				// Export to global print manager
				globalObj.printManager(jobStr);

			} // end for loop

			// Change status to done.
			globalObj.apiStatus.indeed = 'done';

			// Notify console
			console.log('-----------------INDEED DONE-----------------');
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
				globalObj.apiStatus.indeed = 'fail';
			});
		}
}; // end indeed object

/*=============================================================
        DICE
==============================================================*/
var dice = {
	url: "",

	createURL:
		function(searchString,state,city,areacode,pageNumber,noOfRecords){

			var url = "https://cors-anywhere.herokuapp.com/http://service.dice.com/api/rest/jobsearch/v1/simple.json?text=";

			if(searchString != ""){
				searchString = encodeURIComponent(searchString);
				url = url + searchString;
			}
			if(state != ""){
				state = encodeURIComponent(state);
				url = url + "&state=" + state;
			}
			if(city != ""){
				var finalCity = city.split(",");
				console.log("finalcity string length is: "+finalCity.length);

				if(finalCity.length>2){
					city = (finalCity[0]+", "+finalCity[1]);
					console.log("FINAL CITY IS: "+city);
				}

				city = encodeURIComponent(city);
				url = url + "&city=" + city;

				console.log("the modified city is: "+city);

			}
			else{ 
				city="san+diego,+CA";
				url = url + "&city=" + city;
			}	
			if(areacode != ""){
				areacode = encodeURIComponent(areacode);
				url = url + "&areacode=" + areacode;
			}
			if(pageNumber != ""){
				pageNumber = encodeURIComponent(pageNumber);
				url = url + "&page=" + pageNumber;
			}
			if(noOfRecords != ""){
				noOfRecords = encodeURIComponent(noOfRecords);
				url = url + "&pgcnt=" + noOfRecords;
			}

			console.log("Dice URL is: "+url);
			dice.url = url;
			return url;
		},

	getResponse: 
		function(result){

			var jobsResults = result.resultItemList;
			console.log('-----------------DICE RESULTS-----------------');
			console.log('Dice jobsResults',jobsResults);

			for(var i=0; i< jobsResults.length; i++){
				var ji = jobsResults[i];

				// Send to Global Print Function
				var jobJSON = {
					"title" :  ji.jobTitle,
					"company": ji.company,
					"location": ji.location,
					"date": moment(ji.date).format("MMM D"),
					"source": "Dice",
					"description": "Description is not available. For more details, visit Dice's website.",
					"url": ji.detailUrl,
				}

				var jobStr = JSON.stringify(jobJSON);

				globalObj.printManager(jobStr);

			} // end for loop

			// Change status to done.
			globalObj.apiStatus.dice = 'done';

			// Notify console 
			console.log('-----------------DICE DONE-----------------');
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
				globalObj.apiStatus.dice = 'fail';
			});
		}

}; // end dice object

/*=============================================================
        AUTHENTIC JOBS
==============================================================*/
var authentic = {
	url: "",
	createURL: 
		function(searchString,state,city,pageNumber,noOfRecords){
			// Sample url = https://authenticjobs.com/api/?api_key=a446a0eefe6f5699283g34f4d5b51fa0&method=aj.jobs.get&id=1569

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

			console.log("Authentic Jobs URL is: "+url);

			authentic.url = url;
			return url;
		},

	getResponse: 
		function(result){

			var jobsResults = result.listings;
			console.log('-----------------AUTHENTIC JOB RESULTS-----------------');
			console.log('Authentic jobsResults',jobsResults);

			for(var i=0; i< jobsResults.length; i++){

				var ji = jobsResults[i];

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
					"date": moment(ji.post_date).format("MMM D"),
					"source": "Authentic Jobs",
					"description": ji.description,
					"url": ji.url
				}
				// "apply_url": ji.apply_url,

				// Convert to string to be exported
				var jobStr = JSON.stringify(jobJSON);

				// Send to Global Print Function
				globalObj.printManager(jobStr);

			} // end for loop

			// Change status to done.
			globalObj.apiStatus.authentic = 'done';

			// Notify console 
			console.log('-----------------AUTHENTIC JOBS DONE-----------------');

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
}; // end Authentic Jobs object









/*=============================================================
        TEMPLATE
==============================================================*/
// var template = {
// 	url: "",
// 	createURL: 
// 		function(){

// 		},
// 	getResponse: 
// 		function(){

// 		},
// 	ajaxCall: 
// 		function(){

// 		},
// }