
// apiStatus: 
// 		{
// 			github: 'processing',
// 			authentic: 'processing',
// 			dice: 'processing',
// 			indeed: 'processing'
// 		},


var g = {
allResults: [],
totalResultCount: 0,
page: 1,
itemsPerPage: 20,
resultNumber: 1,
userIP: '',
getIP:
		$.getJSON("http://jsonip.com/?callback=?", function (data) {
	        g.userIP = data.ip;
	        // console.log('data.ip',data.ip);
	        console.log('jobba.userIP',g.userIP);
	    }),
apiStatus: ['processing','processing','processing','processing'],
apiCheckpoint: 'processing',
checkStatus:
		function(){
			if (g.apiStatus[0] === 'done' && g.apiStatus[0] === 'done' && g.apiStatus[0] === 'done')
			for (var i=0; i< g.apiStatus.length; i++) {
				var si = g.apiStatus[i];
				// If any of the statuses are processing, do not continue
				if ( si === 'processing') {
					console.log('apis incomplete');
					break;
				}	
			};
			if ( g.apiCheckpoint === 'done' ) {
				g.apiCheckpoint = 'done';
				console.log('all apis done');
			}
		},
getItemsPerPage: 	
		$('#items-per-page').on('change', function(event){
			event.preventDefault();
			g.itemsPerPage = parseInt( $('#items-per-page').val() );
			g.pagination();
			// Bug! -- Need to return to 1st page
		}),

printManager: 	
		function(jobStr){
			// Push to allResults
			g.allResults.push(jobStr);

			// Increment total result counter, write to page
			g.totalResultCount++;
			$('#total-result-count').text(g.totalResultCount);

			// Show link in pagination nav if enough results
			// var remainder = (g.totalResultCount - 1) % g.itemsPerPage;
			// if ( remainder === 0 ) {
			// 	var pageNum = (g.totalResultCount-1) / g.itemsPerPage;
			// 	var selector = '#pg-'+pageNum;
			// 	$(selector).css('display','initial');
			// }

			// Check Status of all APIs
			g.checkStatus();
			
			// Once there are enough results to populate 1 page, show feed elements and begin printing
			if( g.allResults.length >= g.itemsPerPage ) {
			// if( g.allResults.length > 0 ) {
				// Display the feed elements;
				$('#page1').show();
				$('#pg-1').css('display','initial');
				
				// Banner Effects
				$('#banner').css({
					'height': '50vh',
					'background-position-y': '70%'
				});
				$('.banner-body').css('margin-top','0px');

				// Scroll to Top Button
				$('#scroll-to-top').show();

				// Begin printing
				g.pagination();
			}
		},

paginationHandler: 
		$('.pagination > li > a').on('click',function(event){
			event.preventDefault();

			// Get current page number
			var currentPageEl = $('.pagination').find('.active');
			var currentPage = parseInt( currentPageEl.text() );

			// Remove "active" class from current page
			currentPageEl.removeClass('active');

			// Get target page
			var targetPageEl = $(this).parent('li');
			var targetPage = parseInt( targetPageEl.text() );

			// Add "active" class to target page
			targetPageEl.addClass('active');

			// Set page in global variable, which will be used by pagination();
			g.page = targetPage;

			// Print target page
			g.pagination();
		}),

pagination: 
		function(){
			// Determine start and end indeces of print range
			var start = (g.page-1) * g.itemsPerPage;
			// var end = (page * itemsPerPage) - 1;
			var end = g.page * g.itemsPerPage;

			// Clear feed
			$('#feed').empty();

			// Loop through listings from start to end in allResults array
			for (var i=start; i<end; i++) {
				// Set current index in global
				g.resultNumber = i+1;
				// Print each listing
				g.print(g.allResults[i]);
			};
		},

print: 	
		function(jobStr){
			// Convert data passed as string back to JSON form
			var jobData = JSON.parse(jobStr);

			// Variables for details to be written
			var title = jobData.title;
			var title = g.resultNumber +'. '+ jobData.title;
			var company = jobData.company;
			var location = jobData.location;
			var date = jobData.date;
			var source = jobData.source;
			var description = jobData.description;

			// Convert date to days ago
			var daysAgo = moment(date,'MMM-DD').fromNow();

			// var metaArray = [location, date, source];
			var metaArray = [
				{ key: "location", value: location},
				{ key: "date", value: daysAgo},
				{ key: "source", value: source}
			];

			var wrap = $('<div>');
				wrap.addClass('listing panel panel-default');
				wrap.attr('data-company',company);

			var body = $('<div>');
				body.addClass('panel-body');

			var h2 = $('<h2>');
				h2.addClass('headline');
				h2.text(title);
			
			var h3 = $('<h3>');
				h3.addClass('company');
				h3.text('('+ company +')');
			
			var d = $('<p>');
				d.addClass('description below-fold fold-hide');
				d.html(description);

			var metaWrap = $('<div>');
				metaWrap.addClass('meta');

			for (var i=0; i<metaArray.length; i++) {
				var p = $('<p>');
					p.addClass('meta-detail');
					p.addClass(metaArray[i].key);
					p.text(metaArray[i].value);
					
				metaWrap.append(p);
			};

			// Fold toggle
			var foldToggle = $('<div>').addClass('toggle-fold');
			foldToggle.attr('data-fold','closed');
			// foldToggle.text('View Description');
			foldToggle.on('click',function(event){
				event.preventDefault();
				var $t = $(this);

				// $t.toggleClass('btn-view');

				var dataFold = $t.attr('data-fold');

				if(dataFold === 'closed') {
					$t.attr('data-fold','open');
					// $t.text('Hide Description');
					$(this).siblings('.below-fold').removeClass('fold-hide');
				} 
				else {
					$t.attr('data-fold','closed');
					// $t.text('View Description');
					$(this).siblings('.below-fold').addClass('fold-hide');
				}

			});

			body.append(h2);
			body.append(h3);
			body.append(metaWrap);
			body.append(foldToggle);
			body.append(d);
			wrap.append(body);
			$('#feed').append(wrap);
		},

reset: 
		function(){
			// Reset API Status
			g.apiStatus =  {
				github: 'processing',
				authentic: 'processing',
				dice: 'processing',
				indeed: 'processing'
			};

			// Clear previous results
			g.allResults = [];

			// Reset Pagination: Remove active class from current page
			$('.pagination').find('.active').removeClass('active');

			// Reset Pagination: Add active class to 1st page
			$('.pagination li:nth-child(2)').addClass('active');

			// Reset Pagination: Set page number to 1
			g.page = 1;

			// Hide feed until ready
			$('#page1').hide();
		},

scrollToTop: 
		$('#scroll-to-top').on('click',function(event){
			event.preventDefault();
			$(window).scrollTop(0);
		}),

submit: 
		$('#submit').on('click', function(event){
		    event.preventDefault();
			g.reset();

			// Search parameters
			var q = $('#search').val();
			var city = $('#q-city').val().trim();

			// If city left blank
			if ( city === '') {
				city = 'San Francisco, CA, United States'
			}

			console.log('q',q);
			console.log('city', city);

			var githubURL = g.api.github.createURL(q,city,"","10");
			g.api.github.ajaxCall(githubURL,g.api.github.getResponse);

			var indeedURL = g.api.indeed.createURL(q,city,"","50");
			g.api.indeed.ajaxCall(indeedURL,g.api.indeed.getResponse);

			var diceURL = g.api.dice.createURL(q,"",city,"","","");
			g.api.dice.ajaxCall(diceURL,g.api.dice.getResponse);

			var authenticURL = g.api.authentic.createURL(q,"",city,"","100");
			g.api.authentic.ajaxCall(authenticURL,g.api.authentic.getResponse);
		}),

api: 
	{
		github: {
				url: "",
				status: "processing",
				apiIndex: 0,
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
						g.api.github.url = githubURL;
						return githubURL;
					},
				getResponse: 
					function(result){
						var jobsResults = result;

						console.log('-----------------GITHUB RESULTS-----------------');
						console.log('Github jobsResults',jobsResults);

						for(var i=0; i< jobsResults.length; i++){
							var ji = jobsResults[i];

							var jobTitle = ji.title;
							var jobCompany = ji.company;
							var jobLocation = ji.location;
							var jobDateRaw = ji.created_at;
							var jobDate = moment(jobDateRaw).format("MMM D");
							var jobSource = "Github";
							var jobDescription = ji.description;
							var jobURL = ji.url;

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
							g.printManager(jobStr);
						} // end for loop

						// Notify console 
						console.log('----------------------------------GITHUB DONE');

						// Change status to done.
						var apiIndex = g.api.github.apiIndex;
						g.apiStatus[apiIndex] = 'done';
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
							var apiIndex = g.api.github.apiIndex;
							g.apiStatus[apiIndex] = 'fail';
						});
					}
			},

		indeed: {
				url: "",
				status: "processing",
				apiIndex: 1,
				createURL:
					function(searchString,city,state,noOfRecords){

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

						console.log("Indeed URL is: "+url);
						g.api.indeed.url = url;
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
							g.printManager(jobStr);

						} // end for loop

						// Change status to done.
						var apiIndex = g.api.indeed.apiIndex;
						g.apiStatus[apiIndex] = 'done';

						// Notify console
						console.log('----------------------------------INDEED DONE');
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
							// g.apiStatus[g.api.indeed.apiIndex] = 'fail';
							var apiIndex = g.api.indeed.apiIndex;
							g.apiStatus[apiIndex] = 'fail';
						});
					}
			},

		dice: {
				url: "",
				status: "processing",
				apiIndex: 2,
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
						g.api.dice.url = url;
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

							g.printManager(jobStr);

						} // end for loop

						// Change status to done.
						// g.apiStatus[g.api.dice.apiIndex] = 'done';
						var apiIndex = g.api.dice.apiIndex;
						g.apiStatus[apiIndex] = 'done';

						// Notify console 
						console.log('----------------------------------DICE DONE');
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
							// g.apiStatus[g.api.dice.apiIndex] = 'fail';
							var apiIndex = g.api.dice.apiIndex;
							g.apiStatus[apiIndex] = 'fail';
						});
					}
			},

		authentic: {
				url: "",
				status: "processing",
				apiIndex: 3,
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

						g.api.authentic.url = url;
						return url;
					},
				getResponse: 
					function(result){

						var jobsResults = result.listings.listing;
						console.log('-----------------AUTHENTIC JOB RESULTS-----------------');
						console.log('Authentic result.listings', result.listings);
						console.log('Authentic jobsResults', jobsResults);

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
							g.printManager(jobStr);

						} // end for loop

						// Notify console 
						console.log('----------------------------------AUTHENTIC JOBS DONE');
						
						// Change status to done.
						var apiIndex = g.api.authentic.apiIndex;
						g.apiStatus[apiIndex] = 'done';

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
							var apiIndex = g.api.authentic.apiIndex;
							g.apiStatus[apiIndex] = 'fail';
						});
					}
			}	
	},

documentReady:
		$(document).ready(function() {
			g.getIP;
		    console.log('document ready');
		})


} // end g

// Bind to Window
window.jobba = g;