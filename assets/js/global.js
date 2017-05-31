
var g = {
allRawData: [],
allResults: [],
allResultsStr: [],
partData: [],
companyList: [],
printFrom: 'allResults',
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
prevCheck: 0,
sort:
		function(){

		},
filteredCount: 0,
filterTerms:
		function(inTerms,exTerms){
			var data = g.partData;
			if (data.length === 0) data = g.allResults; // If data already filtered, use it. Else, use all results
			var data = g.allResults;

			var filtered = data.filter(function(res){
				var str = res.title.toUpperCase();

				var m = exTerms.map(function(term){
					term = term.toUpperCase().trim();

					// Term vs. Title String comparison
					var bool = str.includes(term);
				
					// Only return if there are no matches
					return bool;
				});

				// var final = m.filter(function(){
				// Return if can't find any match
				var neg1 = m.indexOf(true); 
				return neg1 === -1;
				// });
				// console.log('final',final);
				// return final;
			})
			// console.log('filtered',filtered);

			g.partData = filtered;
			console.log('g.partData',g.partData);

			g.printFrom = 'partData';

			Materialize.toast('Removed listings containing your blacklisted terms!', 2000);

			g.pagination();
		},
resultFilter: 
		function(hideList){
			var all = g.allResults;

			g.partData = all.filter(function(res){
				// Return if not found in hideList array
				var iof = hideList.indexOf(res.source);
				return iof === -1;
			});
			
			// Count the number of items in filtered data for comparison
			g.filteredCount = g.partData.length;

			// In event there are no results after filtering
			if( g.filteredCount === 0 )
				alert("No results that fit what you are searching for.");
			// In event filtering didn't remove anything
			else if ( g.filteredCount === g.totalResultsCount ) {
				alert("The filters did not remove any results");
			}
			console.log('g.filteredCount',g.filteredCount);
			console.log('g.partData',g.partData);

			// Update where to print from
			g.printFrom = 'partData';

			Materialize.toast('Result sources filtered!', 2000);

			g.pagination();
		},
checkStatus:
		function(){
			// Check for change in progress, update bar if there is
			var oldStatus = g.prevCheck;
			var newStatus = g.apiCheck;
			if ( newStatus > oldStatus ) {
				var pct = g.apiCheck/5*100 + 10;
				console.log('pct',pct);
				// $('.progress-target').css('width',pct+'%');
				$('.progress-target').animate({
					'width': pct+'%'
				}, 500);
			}
			//  Update previous status since check is done.
			g.prevCheck = g.apiCheck;

			// If completely done
			if( g.apiCheck === 5 ) {
				console.log('all apis done');

				// change run status
				g.apisRunning = false;

				// Remove global loading class
				$('html').removeClass('do-not-disturb');

				// Hide progress bar
				$('#progress-wrap').hide();
				$('.progress-target').css('width','0%');

				// Toast!
				Materialize.toast(g.totalResultCount + ' job listings found!',4000);
				
				// Prepare to print
				g.beginPrint();
			}

		},
getItemsPerPage: 	
		$('#pagination-num-sel input').on('change', function(event){
			event.preventDefault();
			g.itemsPerPage = parseInt( $(this).val() );
			g.pagination();
			// Bug! -- Need to return to 1st page
		}),
dedup:
		function(jobObj){
			// console.log('dedup start')
			var isDup = false;

			// // If a duplicate...
			// if ( isDup === true ) {
			// 	var matchID = "Blahhh=blahblahblah";
			// 	return matchID;
			// }
			// //  If not a duplicate...
			// else {
			// 	return null;
			// }
			return null;
		},
firebaseCount:
		function(path){
			$.ajax({
				type: 'GET',
				url: 'https://jobba-fe187.firebaseio.com/'+ path +'/.json?shallow=true'
			}).done(function(res) {
				var n = Object.keys(res).length;
				console.log('n', n);
				return n;
			})

		},
writeToFirebaseArchive:
		function(jobObj){
			var database = firebase.database();

			// var dataSourceID = jobObj.sourceID;
			var jobSource = jobObj.source;
			var jobSourceID = jobObj.sourceID;
			// Combine source and sourceID
			var sourceID = jobSource.replace(/\s/g,'') + '=' + jobSourceID; 

			// Write every listing to this archive.
			var allArchiveDataRef = database.ref('allArchive/data');			

			// Look for existing job. Write to allArchive if not in there 
			allArchiveDataRef.once('value').then(function(snapshot){
				var check = snapshot.child(sourceID).exists();
				// if listing is not found, add to firebase
				if ( check === false ) {
					allArchiveDataRef.child(sourceID).set(jobObj);
				}
				else {
					// return;
				}
			})

			// Testing a guide formatted as follows:
			// 
			// 	allArchiveGuide
			//    |-- Dice=10216836_WEB-DEV-CA-18 : -Japodcan1dociDUzd86
			//    |-- Github=di9029nc09a09sfduqoi : -Kl0bjylHcNGxp7bAQ3E
			//    |-- Indeed=930ads0fjn2093jnlks3 : -Kl0bjylHcNGxp7bAQ3E
			// 
			// Helpful for deduplification. We can just write which post/info
			// it refers too for each listing, and if there are multiple sources
			// for one listing, that's fine.

			// Look for exisitng job in All Archive Guide
			database.ref('allArchive/guide').once('value').then(function(snapshot){
				var bool = snapshot.child(sourceID).exists();
				// If it's not in guide yet...
				if (bool === false) {
					// Perform magic deduplication. Assume you get back either the 
					// matching listing sourceID or something else when there are 
					// no matches found (e.g. null, false, etc.)...
					// ---  If unmatched.... inside of uniqueArchive, you push your
					//  	job object, which will generate its own unique firebase id.
					// 		Before pushing, get that unique firebase id using .key()
					// 		After pushing to uniqueArchive, create a new node inside of 
					//  	allArchiveGuide where the key is your original source id
					// 		(e.g. Indeed=930ads0fjn2093jnlks3) and the value is the
					// 		unique firebase just generated (e.g. -Japodcan1dociDUzd86).
					// ---  If matched, you navigate to the match's source id in 
					// 		allArchiveGuide (e.g. Github=di9029nc09a09sfduqoi) to 
					// 		retrieve the unique firebase id (e.g. -Kl0bjylHcNGxp7bAQ3E)
					// 		generated by push(). Then you create a new ref inside of 
					//  	allArchiveGuide where the key is your original source id
					// 		(e.g. Indeed=930ads0fjn2093jnlks3) and the value is the
					// 		unique firebase id found earlier (-Kl0bjylHcNGxp7bAQ3E).


					var dedupReturn = g.dedup(jobObj); // Send jobObj to be deduped. Currently return everything as not duplicated
					// console.log('dedupReturn',dedupReturn);
					
					if ( dedupReturn === null ) {
						// All the code for when the listing is unique
						
						// Push to uniqueArchive, get new fireID
						var ref = database.ref('allArchive/unique')
						var uniqueRef = ref.push();
						uniqueRef.set(jobObj);
						var fireID = uniqueRef.key; // new firebase ID just generated by push
						// var guideRefPath = uniqueRef.toString(); // gets ABSOLUTE PATH to guide item

						// Write to allArchive guide with sourceID and fireID
						// database.refFromURL(guideRefPath).set(fireID);
						database.ref('allArchive/guide/'+sourceID).set(fireID);

					}
					else {
						// All the code for when the listing is a match
						var matchID = dedupReturn;
					}
				}
			})
			// var archiveGuideRef = 'allArchiveGuide' +'/'+ dataSourceID;
			// database.ref(archiveGuideRef).set('yo');

			

			// console.log('writeToFirebaseArchive end');
		},
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

			g.writeToFirebaseArchive(jobObj);

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
			if( g.apiCheck === 5 ) {
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
			g.pagination(g.allResults);
		},
paginationHandler: 
		$('.pagination > li > a').on('click',function(event){
			event.preventDefault();

			// Novia: Display .save-wrap when user is logged on
			var userId;

			firebase.auth().onAuthStateChanged(function(user) {
	        
	        if(user){
		        // to retrieve current user unique ID
		        userId = firebase.auth().currentUser.uid;
		        
				if(userId!=="undefined"){
					$(".save-wrap").css('visibility', 'visible');
				}	     
			}   
	      	}); 	

			
			// End .save-wrap display code

			// Get current page number
			var currentPageEl = $('.pagination').find('.active');
			var currentPage = parseInt( currentPageEl.text() );
			// console.log('currentPage',currentPage);

			// Remove "active" class from current page
			currentPageEl.removeClass('active');

			// Get target page
			var targetPageEl = $(this).parent('li');
			var targetData = parseInt(targetPageEl.attr('data-pg'));
			// var targetPage = parseInt( targetPageEl.text() );

			// console.log('targetData',targetData);

			
			if ( targetData === 0 ) {
				targetData = currentPage - 1
			}
			if ( targetData === -1 ) {
				targetData = currentPage + 1
			}

			// Add "active" class to target page
			targetPageEl.addClass('active');

			// Set page in global variable, which will be used by pagination();
			g.page = targetData;

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

			// var printFrom = g.printFrom;
			// Loop through listings from start to end in allResultsStr array
			for (var i=start; i<end; i++) {
				// Set current index in global
				g.resultNumber = i+1;
				// Print each listing
				g.print(g[g.printFrom][i]);
			};

			g.markTerms();
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
			var sourceURL = jobData.url;
			var jobIndex = jobData.index;
			var saveBtnText = 'Save Job';
			var saveBtnImageSource = 'assets/icons/heart1s-gray-red.svg';

			// Combine source and sourceID
			var completeSourceID = source.replace(/\s/g,'') + '=' + sourceID; 

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
				listingEl.attr('data-source-id',completeSourceID);


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
				saveWrap.attr('data-saved','false');

			// Meta Details
			// for (var i=0; i<metaArray.length; i++) {
			// 	var p = $('<p>');
			// 		p.addClass('meta-detail');
			// 		p.addClass(metaArray[i].key);
			// 		p.text(metaArray[i].value);
			// 		bodyEl.append(p);
			// };
			var locationWrap = $('<p>');
				locationWrap.addClass('meta-detail');
				locationWrap.addClass('location');
				locationWrap.text(location);

			var dateWrap = $('<p>');
				dateWrap.addClass('meta-detail');
				dateWrap.addClass('date');
				dateWrap.text(date);
			
			// Original Source URL
			var sourceWrap = $('<p>');
				sourceWrap.addClass('meta-detail');
				sourceWrap.addClass('source sourceURL');

				var sourceURLLink = $('<a>');
					sourceURLLink.attr('href',sourceURL);
					sourceURLLink.attr('alt', 'View this job listing on the original site');
					sourceURLLink.text(source);
					sourceWrap.append(sourceURLLink);


			
			// meta
			bodyEl.append(locationWrap);
			bodyEl.append(dateWrap);
			bodyEl.append(sourceWrap);

			// Listing description except dice
			if ( source != "Dice" ) {
				var descriptionEl = $('<div>');
					descriptionEl.addClass('meta-detail description');
					descriptionEl.html(description);

					bodyEl.append($('<p>').addClass('meta-detail description-label'));
					bodyEl.append(descriptionEl);
			}

			// All Appends
			headerEl.append(listingNumberEl);			
			headerEl.append(headlineEl);			
			headerEl.append(companyEl);			

			listingEl.append(headerEl);
			listingEl.append(saveWrap);
			listingEl.append(bodyEl);

			$('#feed').append(listingEl);

		},
markTerms:
		function(){
			var q = $('#search').val().split(' ');
			$(".meta-detail.description").mark(q);

			// var options = {
			//     "element": "mark",
			//     "className": "",
			//     "exclude": [],
			//     "separateWordSearch": true,
			//     "accuracy": "partially",
			//     "diacritics": true,
			//     "synonyms": {},
			//     "iframes": false,
			//     "iframesTimeout": 5000,
			//     "acrossElements": false,
			//     "caseSensitive": false,
			//     "ignoreJoiners": false,
			//     "wildcards": "disabled",
			//     "each": function(node){
			//         // node is the marked DOM element
			//     },
			//     "filter": function(textNode, foundTerm, totalCounter, counter){
			//         // textNode is the text node which contains the found term
			//         // foundTerm is the found search term
			//         // totalCounter is a counter indicating the total number of all marks
			//         //              at the time of the function call
			//         // counter is a counter indicating the number of marks for the found term
			//         return true; // must return either true or false
			//     },
			//     "noMatch": function(term){
			//         // term is the not found term
			//     },
			//     "done": function(counter){
			//         // counter is a counter indicating the total number of all marks
			//     },
			//     "debug": false,
			//     "log": window.console
			// };
			// $(".context").mark("test", options);

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

			// Reset result count
			g.totalResultCount = 0;


			g.apiStatus = ['processing','processing','processing','processing'];

			// Clear previous results
			g.allResultsStr = [];
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

			// Add global loading class to html, so any element that 
			// has different style depending on load status, can specify
			// in CSS, rather than adding and removing all these classes
			// to and from all these elements
			$('html').addClass('do-not-disturb');			

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

			var linkupURL = g.api.linkup.createURL(q,city,"","100");
			g.api.linkup.ajaxCall(linkupURL,g.api.linkup.getResponse);
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
							var sourceID = urlExtracted.replace(/[#/]/g,'_');


							// Send to Global Print Function
							var jobJSON = {
								"title" :  ji.jobTitle,
								"jobPosition:": ji.jobTitle,
								"company": ji.company,
								"location": ji.location,
								"date": moment(ji.date).format("MMM D"),
								"source": "Dice",
								"sourceID": sourceID,
								"description": "For job details, visit Dice's website.",
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
			},	
			

		linkup: {
				url: "",
				status: "processing",
				apiIndex: 4,
				createURL: 
					function CreateLinkupUrl(searchString,city,state,noOfRecords){

						var url = "https://cors-anywhere.herokuapp.com/http://www.linkup.com/developers/v-1/search-handler.js?api_key=6681AB844790FB012488B9027B231749&embedded_search_key=b599c6a6e9b2178c2e673516252cad2a&";  //orig_ip=";

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
						if(noOfRecords != ""){
							noOfRecords = encodeURIComponent(noOfRecords);
							url = url + "&limit=" + noOfRecords;

						console.log("URL is:"+url);
						return url;
						}
					},
				getResponse: 
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
							// var ji = jobsResults[i];
							// g.allRawData.push(ji);

							// Convert URL into ID (urls are variable lengths)
							// from: http://www.linkup.com/job/eea3d25a7127f2f365a8d924e3411ffabaad/software-developer-job-in-san-diego-ca?embedded-search=b599c6a6e9b2178c2e673516252cad2a
							// to: eea3d25a7127f2f365a8d924e3411ffabaad

							var urlEnd = jobsResults[i].job_title_link.slice(26,62);
							// console.log("can we use this??"+ urlEnd);
							// var queryStartIndex = urlEnd.indexOf('?')
							// var urlExtracted = urlEnd.slice(0,queryStartIndex);
							// var sourceID = urlExtracted.replace(/[#/]/g,'_');
							var sourceID = urlEnd.replace(/[#/]/g,'_');

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
								"source": "LinkUp",
								"sourceID": sourceID,
								"description": jobsResults[i].job_description,
								"url": jobsResults[i].job_title_link,
							}
							var jobStr = JSON.stringify(jobJSON);
							g.printManager(jobStr);

						} // end for loop

						// Change status to done.
						g.apiCheck++;
						g.checkStatus();
						console.log('g.apiCheck',g.apiCheck);
						var apiIndex = g.api.linkup.apiIndex;
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
							var apiIndex = g.api.linkup.apiIndex;
							g.apiStatus[apiIndex] = 'fail';
						});
					}
			}
	}

} // end g

// Bind to Window
window.jobba = g;