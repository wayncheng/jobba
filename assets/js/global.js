
var g = {
allRawData: [],
allResults: [],
allResultsStr: [],
filteredData: [],
companyList: [],
totalResultCount: 0,
page: 1,
itemsPerPage: 20,
resultNumber: 1,
userIP: '',
getIP:
		$.getJSON("https://jsonip.com/?callback=?", function (data) {
	        g.userIP = data.ip;
	        console.log('jobba.userIP',g.userIP);
	    }),
apiStatus: ['processing','processing','processing','processing'],
apiCheckpoint: 'processing',
apiCheck: 0,
apisRunning: false,
checkStatus:
		function(){
			// Update Progress Bar
			var pct = g.apiCheck/4*100;
			$('.progress-target').css('width',pct+'%');

			// If completely done
			if( g.apiCheck === 4 ) {
				console.log('all apis done');

				// change run status
				g.apisRunning = false;

				// Hide progress bar
				$('#progress-wrap').hide();
				$('.progress-target').css('width','0%');

				// Prepare to print
				g.beginPrint();
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
			// Push to allResultsStr
			g.allResultsStr.push(jobStr);

			// Parse data string from API responses into objects
			var jobObj = JSON.parse(jobStr);

			// Add index to each result
			jobObj['index'] = g.totalResultCount;

			// Add id to each result
			jobObj['id'] = g.totalResultCount;

			// Push to allResults
			g.allResults.push(jobObj);

			// Increment total result counter, write to page
			g.totalResultCount++;
			$('#total-result-count').text(g.totalResultCount);

			// Analyze individual listing
				// Get listing's company
				var company = jobObj.company;

				// Compare with existing companies. Only add if unique
				var companyIndex = g.companyList.indexOf(company);

				// If current company had no matches, add to companyList
				if ( companyIndex === -1 ) {
					g.companyList.push(company);
					// console.log('g.companyList',g.companyList);
				}

				// for (var i=0; i<g.companyList.length; i++) {
				// 	companyIndex = g.companyList.indexOf(company);
				// };


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
			if( g.apiCheck === 4 ) {
			// if( g.allResults.length >= g.itemsPerPage ) {

			}
		},
beginPrint: 
		function(){
			// Remove landing styling
			$('.landing').removeClass('landing');

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

			// Loop through listings from start to end in allResultsStr array
			for (var i=start; i<end; i++) {
				// Set current index in global
				g.resultNumber = i+1;
				// Print each listing
				g.print(g.allResults[i]);
			};
		},

print: 	
		function(jobObj){
			// Convert data passed as string back to JSON form
			// var jobData = JSON.parse(jobStr);
			var jobData = jobObj;

			// Variables for details to be written
			var title = jobData.title;
			// var title = g.resultNumber +'. '+ jobData.title;
			var jobPosition = jobData.jobPosition;
			var company = jobData.company;
			var location = jobData.location;
			var date = jobData.date;
			var source = jobData.source;
			var sourceID = jobData.sourceID;
			var description = jobData.description;
			var jobIndex = jobData.index;
			var saveBtnText = 'Save Job';
			var saveBtnImageSource = 'assets/icons/heart1s-gray-red.svg';

			// Convert date to days ago
			var daysAgo = moment(date,'MMM-DD').fromNow();

			// var metaArray = [location, date, source];
			var metaArray = [
				{ key: "location", value: location},
				{ key: "date", value: daysAgo},
				{ key: "source", value: source}
			];

			var listingEl = $('<li>');
				listingEl.addClass('listing');
				listingEl.attr('data-index',jobIndex)
				listingEl.attr('data-company',company);
				listingEl.attr('data-source',source);
				listingEl.attr('data-source-id',sourceID);


			var headerEl = $('<div>');
				headerEl.addClass('collapsible-header');
			
			var bodyEl = $('<div>');
				bodyEl.addClass('collapsible-body');

			var listingNumberEl = $('<span>');
				listingNumberEl.addClass('listing-number ghost');
				listingNumberEl.text(g.resultNumber);

			var headlineEl = $('<h2>');
				headlineEl.addClass('headline');
				headlineEl.text(title);

			// var company already exists
			var companyEl = $('<h3>');
				companyEl.addClass('company');
				companyEl.text(company);

			var saveWrap = $('<span>');
				saveWrap.addClass('save-wrap ghost');

			// Meta Details
			for (var i=0; i<metaArray.length; i++) {
				var p = $('<p>');
					p.addClass('meta-detail');
					p.addClass(metaArray[i].key);
					p.text(metaArray[i].value);
					bodyEl.append(p);
			};

			// Listing description
			var descriptionEl = $('<div>');
				descriptionEl.addClass('meta-detail description');
				descriptionEl.html(description);
				bodyEl.append(descriptionEl);

			// All Appends
			headerEl.append(listingNumberEl);			
			headerEl.append(headlineEl);			
			headerEl.append(companyEl);			
			headerEl.append(saveWrap);

			listingEl.append(headerEl);
			listingEl.append(bodyEl);

			$('#feed').append(listingEl);

			// var wrap = $('<div>');
			// 	wrap.addClass('listing panel panel-default');
			// 	// wrap.attr('data-all',jobStr);
			// 	wrap.attr('data-index',jobIndex);
			// 	wrap.attr('data-company',company);

			// var body = $('<div>');
			// 	body.addClass('panel-body');

			// var h2 = $('<h2>');
			// 	h2.addClass('headline');
			// 	h2.text(title);
			
			// var h3 = $('<h3>');
			// 	h3.addClass('company');
			// 	h3.text('('+ company +')');
			
			// var saveImg = $('<img>');
			// 	saveImg.addClass('save-img');
			// 	saveImg.attr('src',saveBtnImageSource);
			// 	saveImg.attr('alt','Save this job listing');

			// var saveWrap = $('<div>');
			// 	saveWrap.addClass('save-wrap')
			// 	saveWrap.html(saveImg);

			// // var d = $('<p>');
			// // 	d.addClass('description below-fold fold-hide');
			// // 	d.html(description);

			// var metaWrap = $('<div>');
			// 	metaWrap.addClass('meta');

			// for (var i=0; i<metaArray.length; i++) {
			// 	var p = $('<p>');
			// 		p.addClass('meta-detail');
			// 		p.addClass(metaArray[i].key);
			// 		p.text(metaArray[i].value);
			// 		metaWrap.append(p);
			// };
			
			// // Fold toggle
			// // var foldToggle = $('<div>').addClass('toggle-fold');
			// // 	foldToggle.attr('data-fold','closed');

			// body.append(h2);
			// body.append(h3);
			// body.append(saveWrap);
			// body.append(metaWrap);
			// // body.append(foldToggle);
			// // body.append(d);
			// wrap.append(body);
			// $('#feed').append(wrap);
		},

reset: 
		function(){
			// Reset API Status
			g.apiCheck = 0;
			// g.apiStatus =  {
			// 	github: 'processing',
			// 	authentic: 'processing',
			// 	dice: 'processing',
			// 	indeed: 'processing'
			// };
			g.apiStatus = ['processing','processing','processing','processing'];

			// Clear previous results
			g.allResultsStr = [];

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

			if ( g.apisRunning === true ) {
				return;
			}
			else {
				g.apisRunning = true;
			}

			// Search parameters
			var q = $('#search').val();
			var city = $('#q-city').val().trim();
			var lat, lng;

			// If location left blank, get current location
			if ( city === '' ) {
				alert('Enter a Location');
				$('.loc-wrap').addClass('has-error');
				$('#q-city').on('change',function(event){
					event.preventDefault();
					var loc = $('#q-city').val().trim();
					if (loc.length > 0) {
						$('.loc-wrap').removeClass('has-error');
					}
				});				
				return;
			}

			// Progress Bar
			$('#progress-wrap').show();			

				// city = 'San Francisco, CA, United States'
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
							g.allRawData.push(ji);

							// Send to Global Print Function
							var jobJSON = {
								"title":  ji.title,
								"jobPosition": ji.title,
								"company": ji.company,
								"location": ji.location,
								"date": moment(ji.created_at).format("MMM D"),
								"source": "Github",
								"sourceID": ji.id,
								"description": ji.description,
								"url": ji.url,
								"applyURL": ji.url,
								"type": ji.type,
								"company_url": ji.company_url,
								"company_logo": ji.company_logo,
							}
							var jobStr = JSON.stringify(jobJSON);
							g.printManager(jobStr);
						} // end for loop

						// Change status to done.
						g.apiCheck++;
						g.checkStatus();
						console.log('g.apiCheck',g.apiCheck);
							var apiIndex = g.api.github.apiIndex;
							g.apiStatus[apiIndex] = 'done';

						// Notify console of end
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

							var ji = jobsResults[i];
							g.allRawData.push(ji);

							// Send to Global Print Function
							var jobJSON = {
								"title" :  ji.jobtitle,
								"jobPosition:": ji.jobtitle,
								"company": ji.company,
								"location": ji.city,
								"date": moment(ji.date).format("MMM D"),
								"source": "Indeed",
								"sourceID": ji.jobkey,
								"description": ji.snippet,
								"url": ji.url,
								"applyURL": ji.url,
								"type": 'N/A',
								"company_url": 'N/A',
								"company_logo": 'N/A',
							}
							// Convert to string for export
							var jobStr = JSON.stringify(jobJSON);

							// Export to global print manager
							g.printManager(jobStr);

						} // end for loop

						// Change status to done.
						g.apiCheck++;
						g.checkStatus();
						console.log('g.apiCheck',g.apiCheck);
							var apiIndex = g.api.indeed.apiIndex;
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
							g.allRawData.push(ji);

							// Convert URL into ID (urls are variable lengths)
							// from: http://www.dice.com/job/result/10111699/01201702WBDCA?src=19
							// to: 10111699-01201702WBDCA
							var urlEnd = ji.detailUrl.slice(31,);
							var queryStartIndex = urlEnd.indexOf('?')
							var urlExtracted = urlEnd.slice(0,queryStartIndex);
							var sourceID = urlExtracted.replace('/','_');


							// Send to Global Print Function
							var jobJSON = {
								"title" :  ji.jobTitle,
								"jobPosition:": ji.jobTitle,
								"company": ji.company,
								"location": ji.location,
								"date": moment(ji.date).format("MMM D"),
								"source": "Dice",
								"sourceID": sourceID,
								"description": "Description is not available. For more details, visit Dice's website.",
								"url": ji.detailUrl,
								"applyURL": ji.detailUrl,
								"type": 'N/A',
								"company_url": 'N/A',
								"company_logo": 'N/A',
							}

							var jobStr = JSON.stringify(jobJSON);

							g.printManager(jobStr);

						} // end for loop

						// Change status to done.
						// g.apiStatus[g.api.dice.apiIndex] = 'done';
						g.apiCheck++;
						g.checkStatus();
						console.log('g.apiCheck',g.apiCheck);
							var apiIndex = g.api.dice.apiIndex;
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
							g.allRawData.push(ji);

							// In case company info is not provided...
							// Preprocess all company dependent variables
							var locationValue, 
								companyValue, 
								companyURLValue, 
								companyLogoValue;

							// Set everything to N/A
							companyValue = locationValue = companyURLValue = companyLogoValue = 'N/A'

							// if ( typeof ji.company === 'undefined' ) {
							// 	companyValue = locationValue = companyURLValue = companyLogoValue = 'N/A'
							// }
							// else if ( typeof ji.company === 'object' && typeof ji.company.location === 'undefined' ) {
							// 	companyValue = ji.company.name;
							// 	locationValue = 'N/A';
							// 	if (typeof ji.company.location === 'undefined')
							// }
							// else if ( typeof ji.company === 'object' && typeof ji.company.location === 'undefined' ) {
							// 	companyValue = ji.company.name;
							// 	locationValue = 'N/A';
							// }
							// else if{
							// 	companyValue = ji.company.name;
							// 	locationValue = ji.company.location.name;
							// }
							if ( typeof ji.company != 'undefined' ) {
								var jic = ji.company;
								companyValue = jic.name;
								
								if ( typeof jic.location != 'undefined' ) {
									locationValue = jic.location.name;
								}
								if ( typeof jic.url != 'undefined' ) {
									companyURLValue = jic.url;
								}
								if ( typeof jic.logo != 'undefined' ) {
									companyLogoValue = jic.logo;
								}
							}

							// Packaging the output values for the printer in the global object
							var jobJSON = {
								"title" :  ji.title,
								"jobPosition:": ji.title,
								"company": companyValue,
								"location": locationValue,
								"date": moment(ji.post_date).format("MMM D"),
								"source": "Authentic Jobs",
								"sourceID": ji.id,
								"description": ji.description,
								"url": ji.url,
								"applyURL": ji.apply_url,
								"type": ji.type.name,
								"companyURL": companyURLValue,
								"companyLogo": companyLogoValue,
							}

							// Convert to string to be exported
							var jobStr = JSON.stringify(jobJSON);

							// Send to Global Print Function
							g.printManager(jobStr);

						} // end for loop

						// Notify console of end
						console.log('----------------------------------');
						
						// Change status to done.
						g.apiCheck++;
						g.checkStatus();
						console.log('g.apiCheck',g.apiCheck);
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
	}


} // end g

// Bind to Window
window.jobba = g;