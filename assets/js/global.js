

var g = {
report:
		function(){
			console.log('userIP',g.userIP);
			console.log('lastSearchLocal.get()',g.lastSearchLocal.get());
			// console.log('firebaseCount("allArchive/data")',g.firebaseCount("allArchive/data"));
			console.log('apiCheck',g.apiCheck);
			console.log('totalResultCount',g.totalResultCount);
			console.log('allResults',g.allResults);
			console.log('companyTally',g.companyTally);
			console.log('locationTally',g.locationTally);
			console.log('filter.atlas',g.filter.atlas);
			console.log('atlasCleared',g.atlasCleared);
			console.log('atlasSorted',g.atlasSorted);
		},
salaryData: {},
allRawData: [],
allResults: [],
allResultsStr: [],
allSaved: [],
partData: [],
companyList: [],
companyTally: [],
companyCounter: [],
locationList: [],
locationTally: [],
locationCounter: [],
companyLocationList:[],
googleMaps_latLng : [],
printFrom: 'allResults',
totalResultCount: 0,
page: 1,
lastPage: 1,
itemsPerPage: 20,
resultNumber: 1,
userIP: '',
getIP:
		$.getJSON("https://jsonip.com/?callback=?", function (data) {
	        g.userIP = data.ip;
	        console.log('jobba.userIP',g.userIP);
	    }),
geolocation: {
	location: '',
	userTrigger: $('#location-icon').on('click',function(e){
						e.preventDefault();
						$(this).addClass('active'); // turn blue

						g.geolocation.get();ll
					}),
	removeTrigger: $('#q-city').on('keyup',function(e){
						e.preventDefault();
						// If value changes, then we remove active class from icon;
						var user = $('#q-city').val().trim();
						if ( user != g.geolocation.location ) {
							$('#location-icon').removeClass('active');
						}
					}),
	isSupported: function(){
					// check for Geolocation support
					if (navigator.geolocation) {
						console.log('supported');
					  return true;
					}
					else {
					  console.log('Geolocation is not supported for this Browser/OS.');
					  return false;
					}
				},
	get: function() {
				// If geolocation not supported, tell them to fill it in manually
				if (g.geolocation.isSupported === false) {
					
						// When user play punk and dont enter a location

			            Materialize.toast("Enter a location",4000);
			            $('#q-city').css("border-style","solid");
			            $('#q-city').css("border-width","2px");			            
			            $('#q-city').css("border-color","red");

			            // End of when user play punk and dont enter a location


					return;
				}
				// If geolocation is supported, get the location
				else {

					var startPos;
					var geoOptions = {
						maximumAge: 5 * 60 * 1000,
						timeout: 10 * 1000,
					};

					function geoSuccess(position) {

						startPos = position;
						// document.getElementById('startLat').innerHTML = startPos.coords.latitude;
						// document.getElementById('startLon').innerHTML = startPos.coords.longitude;
						console.log('startPos.coords.latitude',startPos.coords.latitude);
						console.log('startPos.coords.longitude',startPos.coords.longitude);
						var latlng = startPos.coords.latitude +','+ startPos.coords.longitude;
						console.log('latlng',latlng);

						g.geolocation.convert(latlng); // Send to function to convert coordinates to city
					};
					function geoError(error) {
						console.log('Error occurred. Error code: ' + error.code);
			            
						// When user play punk and dont enter a location

			            Materialize.toast("Enter a location",4000);
			            $('#q-city').css("border-style","solid");
			            $('#q-city').css("border-width","2px");			            
			            $('#q-city').css("border-color","red");

			            // End of when user play punk and dont enter a location

						return;
						// error.code can be:
						//   0: unknown error
						//   1: permission denied
						//   2: position unavailable (error response from location provider)
						//   3: timed out
					};
					navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
				}
			},
	convert: function(latlng){
					// Example: https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
					// country, administrative_area_level_1 (state), locality, street_address, postal_code
					var resultType = 'locality';
					var locationType = 'APPROXIMATE';
					var qURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ latlng +'&location_type='+ locationType +'&result_type='+ resultType +'&key=AIzaSyBB1s2bgxqg4sMi9_1HJoZ-OV7ZzRnsYP4';
					
				    $.ajax({
				    	type: 'GET',
				    	url: qURL,
				    }).done(function(response){
				    	// var r = response.results[0].address_components;
				    	// var city = r[0].short_name;
				    	// var state = r[2].short_name;
				    	// var country = r[3].short_name;
				    	// console.log(city,state,country);

				    	var a = response.results[0].formatted_address;
				    	g.geolocation.location = a;
				    	console.log('a',a);

				    	// Set location in search bar, change color of location icon
				    	$('#q-city').val(a);
				    	$('#location-icon').addClass('active');

				    	// If main search is empty, don't continue
				    	if ($('#search').val().trim().length === 0) {
				    		return;
				    	}
				    	else {
					    	// Re-evaluate for submission
					    	g.submitCheck();
				    	}

				    });

				}
},
map: {
	el: '',
	fx: 
      function initMap() {
        g.map.el = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: new google.maps.LatLng(2.8,-187.3),
          mapTypeId: 'roadmap'
        });

        // Create a <script> tag and set the USGS URL as the source.
        var script = document.createElement('script');
        // This example uses a local copy of the GeoJSON stored at
        // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
        script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
        document.getElementsByTagName('head')[0].appendChild(script);
      }

      // // Loop through the results array and place a marker for each
      // // set of coordinates.
      // window.eqfeed_callback = function(results) {
      //   for (var i = 0; i < results.features.length; i++) {
      //     var coords = results.features[i].geometry.coordinates;
      //     var latLng = new google.maps.LatLng(coords[1],coords[0]);
      //     var marker = new google.maps.Marker({
      //       position: latLng,
      //       map: map
      //     });
      //   }
      // }
},
lastSearchLocal: {
	save: 	function(q,city){
				if (q == '' || city == '') return;

				var obj = {
					'q': q,
					'city': city,
				};

				var str = JSON.stringify(obj);
				localStorage.setItem('lastSearch', str);

				$('#last-search').show();
				$('#last-search-q').text(obj.q);
				$('#last-search-city').text(obj.city);
			},
	get: 	function(){
				var str = localStorage.getItem('lastSearch');
				if(str) {
					$('#last-search').show();
					return str;
				}
				else {
					$('#last-search').hide(); 
					return; 
				}
			},
	print: 	function(){
				var str = g.lastSearchLocal.get();
				if(str) {
					var item = JSON.parse(str);

					$('#last-search-q').text(item.q);
					$('#last-search-city').text(item.city);
				}
				else {
					return;
				}
			},
	listener: 
		$('#last-search-trigger').on('click',function(e){
			e.preventDefault();
			
			// Get values from the target spans in HTML and use those set the main search values 
			var lastq = $('#last-search-q').text();
			var lastcity = $('#last-search-city').text();

			$('#search').val(lastq);
			$('#q-city').val(lastcity);

			// Skip check and trigger submission
			g.submit();
		}),
	},
apiStatus: ['processing','processing','processing','processing'],
apiCheckpoint: 'processing',
apiCheck: 0,
apisRunning: false,
prevCheck: 0,
sortDateNewest:
		function(){
			var data = g.allResults;
			// var data = sample;
			var directory = g.atlasCleared;

			var sorted = directory.map(function(clearedID){
				var di = data[clearedID];
				var age = moment().diff(moment(di.date, 'MMM D YY'), 'days');
				var obj = {age,clearedID};
				return obj;
			}).sort(function(a,b){
				return a.age - b.age;
			}).map(function(x){
				return x.clearedID;
			});

			console.log('sorted',sorted);
			g.atlasSorted = sorted;
		},
toast: 
		function(msg){
			Materialize.toast(msg,2000);
		},
atlasCleared: [],
atlasSorted: [],
filter: {
	atlas: {
		source: [],
		terms: [],
		age: [],
		distance: [],
		location: [],
		company: [],
			},
	atlasInit:
			function(){
				// var n = g.totalResultCount;
				// var baseline = [];
				// for (var i=0; i<g.totalResultCount; i++) {
				// 	baseline.push[i];
				// };
				var a = g.filter.atlas;
				a.source = a.terms = a.age = a.distance = a.location = a.company = [];
				// g.atlasCleared = [];
				for (var i=0; i<g.totalResultCount; i++) {
					g.atlasCleared.push(i);
				};

			 	//Initiate byLocation and by Company as well
			 	g.filter.byLocation.init();
			 	g.filter.byCompany.init();
			},	
	byTerms: {
			whiteList: [],
			blackList: [],
			trigger: 
					$('.filterTermInput').on('keyup',function(event){ // Add tag to lists and trigger function
						event.preventDefault();
						var c = event.keyCode
						var list;
						var bagSel; 
						var classVar;
						// Bail unless key pressed is comma or return 
						if ( c !== (13 || 44) ) return;

					// If right key pressed, save tag
						var whichList = $(this).attr('id');
						if (whichList === 'includeTerms'){
							list = g.filter.byTerms.whiteList;
							bagSel = '#whiteList';
						}
						else {
							list = g.filter.byTerms.blackList;
							bagSel = '#blackList';
						}
						// Text inputs
						var textInput = $(this).val().trim()

						// Push to lists
						list.push(textInput);

						// Clear input fields
						$(this).val('');

						// Add chip for term
						// Sample: <div class="chip"> Tag <i class="close material-icons">close</i> </div>
						var chip = $('<div>').addClass('chip');
						var x = $('<i>').addClass('close material-icons').text('close');
						chip.text(textInput);
						chip.attr('data-term',textInput);
						chip.append(x);
						$(bagSel).append(chip);

						// Pass on to function
						g.filter.byTerms.fx(g.filter.byTerms.whiteList, g.filter.byTerms.blackList);

					}),
			removal: 
					$('.chip-bag').on('click','.close',function(e){
							e.preventDefault();
							var $t = $(this);
							var term = $t.parent('.chip').attr('data-term');
							var chipBag = $t.parents('.chip-bag').attr('id');
							var targetList;
							// console.log('chipBag',chipBag);
							// console.log('term',term);

							if (chipBag === 'blackList') {
								targetList = g.filter.byTerms.blackList;
							 	// Remove term from term list 
								g.filter.byTerms.blackList = targetList.filter(function(eachTerm){
									return eachTerm !== term;
								});
								// console.log('blackList',g.filter.byTerms.blackList);
								// console.log('targetList',targetList);
							}
							else if (chipBag === 'whiteList'){
								targetList = g.filter.byTerms.whiteList;
							 	// Remove term from term list 
								g.filter.byTerms.whiteList = targetList.filter(function(eachTerm){
									return eachTerm !== term;
								});
								// console.log('whiteList',g.filter.byTerms.whiteList);
								// console.log('targetList',targetList);
							}

							// Remove from DOM
							$t.parent('.chip').remove();

							// Refilter new terms --- (refine this in the future to just restore the difference)
							g.filter.byTerms.fx(g.filter.byTerms.whiteList, g.filter.byTerms.blackList);
					}),
			fx: 
					function(inTerms,exTerms){
						console.log('blacklist',exTerms);
						console.log('whitelist',inTerms);
						
						// If data already filtered, use it. Else, use all results
						// var data = g.partData;
						// if (data.length === 0 || g.blackList.length > exTerms.length || g.whiteList.length < inTerms.length ) { 
						// 	data = g.allResults 
						// } 
						var data = g.allResults;

						var filtered = data.filter(function(res){
							var str = res.title.toUpperCase();

							var black = exTerms.map(function(term){
								term = term.toUpperCase().trim();

								// Term vs. Title String comparison
								var bool = str.includes(term);
							
								// Only return if there are no matches
								return bool;
							});
							var white = inTerms.map(function(term){
								term = term.toUpperCase().trim();

								// Term vs. Title String comparison
								var bool = str.includes(term);
							
								// Only return if there are no matches
								return bool;
							});

							// Return if can't find any match (matches are bad)
							var blackCheck = black.indexOf(true); 
							var whiteCheck = white.indexOf(false);
							// return blackCheck === -1 && whiteCheck === -1;

							// Trash testing
							return blackCheck !== -1 && whiteCheck !== -1;
						});

						var mapped = filtered.map(function(jobObj){
							return jobObj.id;
						})


						g.filter.byTerms.whiteList = inTerms;
						g.filter.byTerms.blackList = exTerms;
						g.partData = filtered;
						g.filter.export();
						g.filter.atlas.terms = mapped;
					},
			},
	bySource: {
			event: 
					$('#filter-source').on('change','.filterSourceInput',function(event){
						event.preventDefault();
						console.log('bysource');
						//  Switched from on click to change because on click was overriding the default click
						// function from materilalizeCSS.
						var $t = $(this);
						$t.toggleClass('data-hide');

						var sourceReport = {show: [], hide: [], };
						var sourceHidden = [];

						$('.filterSourceInput.data-hide').each(function(){
							var dataRep = $(this).attr('value');
							sourceHidden.push(dataRep);
						});
						console.log('sourceHidden',sourceHidden);

						// Pass to global filter
						g.filter.bySource.fx(sourceHidden);
					}),
			fx: 
					function(hideList){
						// If data already filtered, use it. Else, use all results
						// var data = g.partData;
						// if (data.length === 0) { data = g.allResults } 
						var data = g.allResults;

						var trash = data.filter(function(res){
							// Return if not found in hideList array
							var iof = hideList.indexOf(res.source);
							return iof !== -1;
						});
						// g.partData = filtered;

						var mapped = trash.map(function(jobObj){
							return jobObj.id;
						})
						g.filter.atlas.source = mapped;
						console.log('source atlas',mapped);

						g.filter.export();
					},
			},
	byLocation: {
			event: 
					$('#filter-location').on('change','.filterLocationInput',function(e){
						// console.log('byLocation triggered');
						e.preventDefault();
						//  Switched from on click to change because on click was overriding the default click
						// function from materilalizeCSS.
						var $t = $(this);
						$t.toggleClass('data-hide');

						var hidden = [];

						$('.filterLocationInput.data-hide').each(function(){
							var dataRep = $(this).attr('value');
							hidden.push(dataRep);
						});
						// console.log('hidden',hidden);

						// Pass to global filter
						g.filter.byLocation.fx(hidden);
					// }),
					}),
			processor: 
					function(jobObj){
							// Get unique locations and count repeats. Isolate city.
							var loc = jobObj.location;
							var split = loc.split(',');
							var city = split[0].trim().toLowerCase();
							var locIndex = g.locationList.indexOf(city);
							// var count = 1;

							// var obj = {
							// 	location: city,
							// 	n: 1,
							// }
							// var obj = {};
							// // If current company had no matches, add name and general location to companyList
							// if ( locIndex === -1 ) {
							// 	// Add company, and start count at 1;
							// 	obj[city]=1;
							// 	g.locationCounts.push(obj);

							// 	// List of unique cities
							// 	g.locationList.push(city);
							// }
							// else {
							// 	// Find current object the current count and increment
							// 	for (var i=0; i<g.locationCounts.length; i++) {
							// 		var li = g.locationCounts[i]
							// 		// for( var key in g.locationCounts[i]){

							// 			var locIndex = g.locationCounts[i][key].indexOf(city);
							// 			if (locIndex === -1){
							// 				var locO = g.locationCounts[i].city;
							// 				var count = locO.n;
							// 				locO.n = count+1;
							// 				break;
							// 			}
							// 		// }
							// 	};
							// 	// g.locationCounts.push(obj);
							// }

								var Ob = {
									name: city,
									tally: 1,
								};
							// If current company had no matches, add name and general location to companyList
							if ( locIndex === -1 ) {
								// Add company, and start count at 1;
								g.locationList.push(city);
								
								g.locationTally.push(Ob);

								var arr = [city,1];
								g.locationCounter.push(arr);
							}
							else {
								// Get the current count and increment

								//Array of Objects
								var target = g.locationTally[locIndex];
								var n = target.tally;
								g.locationTally[locIndex].tally = n+1;

								// Array of arrays counter
								var n = g.locationCounter[locIndex][1];
								g.locationCounter[locIndex][1] = n+1;
							}
					},
			init:
				function(){
					var tally = g.locationTally;

					// console.log('tally',tally);

					 // Sort by most popular first
					var locSorted = tally.sort(function(a,b){
						return b.tally-a.tally;
					});
					// console.log('locSorted',locSorted);
					g.locationTally = locSorted;

					// var wrap = $('<ul>');
					var wrap = $('#filter-location');
					var cutoff = 8;
					var belowFold = $('<div>');
						belowFold.addClass('below-fold');

					// Print each city in filter menu
					for (var i=0; i<locSorted.length; i++) {
						var loc = locSorted[i].name;
						var nospace = loc.replace(/\s/g, '');
						var id = 'loc-'+i
						var n = locSorted[i].tally;
						var str = loc +' ('+ n + ')';
						// console.log('str',str);

						var li = $('<li>');
							li.addClass('input-field');
						
						var input = $('<input>');
							input.addClass('filterLocationInput filterInput filled-in');
							input.attr({
								'type': 'checkbox',
								'name': 'filterLocation',
								'value': loc,
								'data-select': true,
								'checked': 'checked',
								'id': id,
							});
							
						var label = $('<label>');
							label.attr('for',id);
							label.text(str);
							
						li.append(input);
						li.append(label);

						if (i <= cutoff-1) {
							$('#filter-location').append(li);
						}
						else {
							belowFold.append(li);
						}
					};
					// Add below fold content to menu
					wrap.append(belowFold);

					if (locSorted.length > cutoff){
						var btn = $('<span>');
							btn.addClass('show-more-btn');
							btn.text('Show more...');
							btn.on('click', function(e){
								e.preventDefault();
								var wrap = $(this).parent('.overflow-wrap');
								// wrap.toggleClass('overflow-hidden');
								var isHidden = wrap.hasClass('overflow-hidden');
								
								if (isHidden) {
									wrap.removeClass('overflow-hidden');
									$(this).text('Show fewer...');
								}
								else {
									wrap.addClass('overflow-hidden');
									$(this).text('Show more...');
								}
							});

						wrap.append(btn);
						wrap.addClass('filter-listener overflow-hidden overflow-wrap');
						$('#locationFilters .sideNavForm').append(wrap);
					}

				},
			fx: 
				function(hidden){ // Filter by Location!!!
					var data = g.allResults;

					var trash = data.filter(function(res){
						var split = res.location.split(',');
						var city = split[0].trim().toLowerCase();
						var iof = hidden.indexOf(city);
						return iof !== -1;
					});

					// Temporary map for atlas
					var noFlyList = trash.map(function(jobObj){
						return jobObj.id;
					}) 
					
					g.filter.atlas.location = noFlyList;
					g.filter.export();
				},
			},
	byCompany: {
			event: 
					$('#filter-company').on('change','.filterCompanyInput',function(e){
						// console.log('byLocation triggered');
						e.preventDefault();
						//  Switched from on click to change because on click was overriding the default click
						// function from materilalizeCSS.
						var $t = $(this);
						$t.toggleClass('data-hide');

						var hidden = [];

						$('.filterCompanyInput.data-hide').each(function(){
							var dataRep = $(this).attr('value');
							hidden.push(dataRep);
						});
						// console.log('hidden',hidden);

						// Pass to global filter
						g.filter.byCompany.fx(hidden);
					// }),
					}),
			processor: 
					function(jobObj){
							// Get unique locations and count repeats. Isolate city.
							var co = jobObj.company;
							// var split = loc.split(',');
							// var city = split[0].trim().toLowerCase();
							var coIndex = g.companyList.indexOf(co);

							var obj = {
								name: co,
								tally: 1,
							};
							// If current company had no matches, add name and general location to companyList
							if ( coIndex === -1 ) {
								// Add company, and start count at 1;
								// g.companyCounts[co] = 1;
								g.companyList.push(co);
								
								g.companyTally.push(obj);

								// var arr = [co,1];
								// g.companyCounter.push(arr);
							}
							else {
								// Get the current count and increment

								//Array of Objects
								var target = g.companyTally[coIndex];
								var n = target.tally;
								g.companyTally[coIndex].tally = n+1;

								// Array of arrays counter
								// var n = g.companyCounter[coIndex][1];
								// g.companyCounter[coIndex][1] = n+1;
							}
					},
			init:
				function(){
					var tally = g.companyTally;

					// console.log('tally',tally);

					 // Sort by most popular first
					var compSorted = tally.sort(function(a,b){
						return b.tally-a.tally;
					});
					// console.log('compSorted',compSorted);
					g.companyTally = compSorted;

					// var wrap = $('<ul>');
					var wrap = $('#filter-company');
					var cutoff = 8;
					var belowFold = $('<div>');
						belowFold.addClass('below-fold');

					// Print each city in filter menu
					for (var i=0; i<compSorted.length; i++) {
						var comp = compSorted[i].name;
						var nospace = comp.replace(/\s/g, '');
						var id = 'comp-'+i
						var n = compSorted[i].tally;
						var str = comp +' ('+ n +')';
						// console.log('str',str);

						var li = $('<li>');
							li.addClass('input-field');
						
						var input = $('<input>');
							input.addClass('filterCompanyInput filterInput filled-in');
							input.attr({
								'type': 'checkbox',
								'name': 'filterCompany',
								'value': comp,
								'data-select': true,
								'checked': 'checked',
								'id': id,
							});
							
						var label = $('<label>');
							label.attr('for',id);
							label.text(str);
							
						li.append(input);
						li.append(label);

						if (i <= cutoff-1) {
							wrap.append(li);
						}
						else {
							belowFold.append(li);
						}
					};
					// Add below fold content to menu
					wrap.append(belowFold);

					if (compSorted.length > cutoff){
						var btn = $('<span>');
							btn.addClass('show-more-btn');
							btn.text('Show more...');
							btn.on('click', function(e){
								e.preventDefault();
								var wrap = $(this).parent('.overflow-wrap');
								// wrap.toggleClass('overflow-hidden');
								var isHidden = wrap.hasClass('overflow-hidden');
								
								if (isHidden) {
									wrap.removeClass('overflow-hidden');
									$(this).text('Show fewer...');
								}
								else {
									wrap.addClass('overflow-hidden');
									$(this).text('Show more...');
								}
							});

						wrap.append(btn);
					}
					wrap.addClass('overflow-hidden overflow-wrap');
						// $('#companyFilters .sideNavForm').append(wrap);

				},
			fx: 
				function(hidden){ // Filter by Location!!!
					var data = g.allResults;

					var trash = data.filter(function(res){
						var co = res.company;
						// var split = res.location.split(',');
						// var city = split[0].trim().toLowerCase();
						var iof = hidden.indexOf(co);
						return iof !== -1;
					});

					// Temporary map for atlas
					var noFlyList = trash.map(function(jobObj){
						return jobObj.id;
					}) 
					
					g.filter.atlas.company = noFlyList;
					g.filter.export();
				},
			},
	byAge: {
		event: $('#dateFilters').on('click','.sideNavForm a',function(e){
					e.preventDefault();
					var ageLimit = parseInt($(this).attr('data-age'));
					g.filter.byAge.fx(ageLimit);
				}),
		fx: 
				function(ageLimit){
					var data = g.allResults;

					// var filtered = data.filter(function(res){
					// 	var date = res.date;
					// 	var daysAgo = moment().diff(moment(date, 'MMM-DD YY'), 'days');
					// 	console.log('daysAgo',daysAgo);
					// 	return daysAgo <= ageLimit ;
					// });

					var trash = data.filter(function(res){
						var date = res.date;
						var daysAgo = moment().diff(moment(date, 'MMM-DD YY'), 'days');
						return daysAgo > ageLimit ; //return all the ones to be filtered out
					});

					var mapped = trash.map(function(jobObj){
						return jobObj.id; //return ids for each job
					});

					// g.partData = filtered;
					g.filter.atlas.age = mapped;
					g.filter.export();

				}
		},
	export:
			function(){
				console.log('g.filter.atlas',g.filter.atlas);
				var combined = [];
				var atlas = g.filter.atlas;

				$.each(atlas,function(k,v){
					var length = v.length;
					var unique = v.filter(function(id){
						var iof = combined.indexOf(id);
						return iof === -1;
					});
					combined = combined.concat(unique);
				});

				console.log('combined',combined);		

				// Print results that pass
				var passed = g.allResults.filter(function(r){
					var rID = r.id;
					var iof = combined.indexOf(rID);
					return iof === -1; // return if not found in trash
				});
				g.atlasCleared = passed.map(function(jobObj){
					return jobObj.id;
				});
				console.log('g.atlasCleared',g.atlasCleared);

				// Call for sort by newest
				g.sortDateNewest();
				// Update where to print from
				// g.printFrom = 'partData';

				// In event filtering didn't remove anything
				if ( g.atlasCleared.length === g.totalResultCount ) {
					g.toast("The filters did not remove any results. Showing all results");
					// g.printFrom = 'allResults';
				}

				// Update amount of results after filters
				$('#result-count').text(g.atlasCleared.length);

				g.paginationSet();
			},
},
checkStatus:
		function(){
			// Check for change in progress, update bar if there is
			var oldStatus = g.prevCheck;
			var newStatus = g.apiCheck;
			if ( newStatus > oldStatus && newStatus < 100) {
				var pct = g.apiCheck/5*100;
				// console.log('pct',pct);
				// $('.progress-target').css('width',pct+'%');
				$('.progress-target').animate({
					'width': (pct+10)+'%'
				}, 500);
				$('.progress-bar').animate({
					'width': pct+'%'
				}, 500);
			}
			else if ( newStatus >= 100 ) {
				$('.progress-bar','.progress-target').css('width','0%');
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

				//Initialize, Reinitialize filter atlas
				g.filter.atlasInit();

				// Sort by Newest
				g.sortDateNewest();

				// Toast!
				Materialize.toast(g.totalResultCount + ' job listings found!',4000);
				
				// Prepare to print
				g.beginPrint();
			}

		},
getItemsPerPage: 	
		$('#per-page-options').on('click','.pagination-num-opt', function(event){
			event.preventDefault();
			g.itemsPerPage = parseInt($(this).text());
			// Remove selected class and apply to new one
			// $('#per-page-options .selected').removeClass('selected');
			// $(this).parent('li').addClass('selected');
			g.paginationSet();
		}),
menuSelectionListener:
		$('.horizontal-options').on('click','a', function(event){
			event.preventDefault();
			// Remove selected class and apply to new one
			$('.horizontal-options .selected').removeClass('selected');
			$(this).parent('li').addClass('selected');
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
getSaves:
		function(){
			// 
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
			$('#result-count').text(g.totalResultCount);

			// Analyze Listing Company
			g.filter.byCompany.processor(jobObj);
			g.filter.byLocation.processor(jobObj);


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

			$('html').addClass('feed-printed');

			// Begin printing
			// g.pagination(g.allResults);
			g.paginationSet();
		},
paginationHandler: 
		$('.pagination').on('click','.pg-control',function(event){
			event.preventDefault();

			// If clicked button is disabled, bail out
			if ($(this).hasClass('disabled') === true) {
				return;
			}

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
			var targetPageEl = $(this);
			var targetData = parseInt(targetPageEl.attr('data-pg'));

			// Guidance for the < and > buttons
			if ( targetData === 0 ) {
				targetData = currentPage - 1
			}
			if ( targetData === -1 ) {
				targetData = currentPage + 1
			}

			// Styling for the < and > buttons
			// Clear disabled classes, then add back on if appropriate 
			$('#pg-prev, #pg-next').removeClass('disabled');
			// (probably a better way to do this, but I'm too lazy to think of it right now)
			if (targetData === 1) {
				$('#pg-prev').addClass('disabled');
			}
			if (targetData === g.lastPage) {
				$('#pg-next').addClass('disabled');
			}

			// Add "active" class to target page
			targetPageEl = $('.pg-control[data-pg="'+targetData+'"]');
			targetPageEl.addClass('active');

			// Set page in global variable, which will be used by pagination();
			g.page = targetData;

			// Print target page
			g.pagination();
		}),
paginationSet:
		function(){
			var numberOfPages, resultCount;

			// If filtered, print from partData
			// if (g.partData.length !== 0) { 
			// 	resultCount = g.partData.length 
			// }
			// else { 
			// 	resultCount = g.totalResultCount 
			// }	
			// resultCount = g[g.printFrom].length;

			// Number of results to show is total results - ones being filtered out
			resultCount = g.atlasCleared.length;
			
			// Display message saying there are no results
			if (resultCount === 0) {
				$('html').addClass('no-results');
				console.log('No Results to Show');
				// var $div = $('<div>');
				// 	$div.addClass('no-results');
				// var $h2 = $('<h2>');
				// 	$h2.addClass('no-results');
				// 	$h2.text('Sorry, there are no results that match your search criteria.');
				// 	$div.append($h2);
				// $('#feed').empty();
				// $('#feed').append($div);
				return;
			}
			else {
				$('html').removeClass('no-results');
			}
			// Count number of pages in results
			numberOfPages = parseInt(resultCount / g.itemsPerPage);

			// Accounting for last page
			var remainder = resultCount % g.itemsPerPage;
			if (remainder !== 0) {
				numberOfPages++;
			}	
			
			// Set last page value for use by handler
			g.lastPage = numberOfPages;

			// Clear previous pagination controls
			$('#pg-control-wrap').empty();

			// Add pagination control for each page
			for (var i=1; i<=numberOfPages; i++) {
				var li = $('<li>');
					li.addClass('pg-control waves-effect');
					li.attr('data-pg',i);
					
					// Style 1st page as active since we're returning there
					if (i === 1) {
						li.addClass('active');
					};

					var a = $('<a>');
						a.attr('href','#!');
						a.text(i);
				li.html(a);
				$('#pg-control-wrap').append(li);
			};


			// Call pagination to print 1st page
			g.page = 1;
			g.pagination();


			// console.log('numberOfPages',numberOfPages);
			// console.log('resultCount',resultCount);
			// console.log('g.itemsPerPage',g.itemsPerPage);
		},
pagination: 
		function(){	

			// Determine start and end indeces of print range
			var start = (g.page-1) * g.itemsPerPage;
			var end = g.page * g.itemsPerPage;

			// Account for last page
			var length = g.atlasCleared.length;
			if (end >= length) {
				end = length;
			}

			// Write start and end to feed details
			var range = (start+1) +'-'+ end;
			$('#page-range').text(range);

			// Clear feed
			$('#feed').empty();  
			g.companyLocationList = [];         

			// Loop through listings from start to end in allResultsStr array
			// var atlas = g.atlasCleared;
			var atlas = g.atlasSorted;

			for (var i=start; i<end; i++) {
				// Set current index in global
				g.resultNumber = i+1;
				// Print each listing
				var ai = atlas[i];
				// console.log('ai',ai);
				var aRai = g.allResults[ai];
				// console.log('aRai',aRai);
				g.print(aRai);
			};

			// console.log("CALLING GOOGLE MAPS AJAX....");
			// g.ajax_for_googleMaps();
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
			var saved;

			//Fetching Company And its location, to pass in to Google Maps API to get latitude and longitude.
			var companyAndLocation = company + " " + location;
			// console.log('companyLocationList OBJ ==*********',g.companyLocationList);
			g.companyLocationList.push(companyAndLocation);
			// Combine source and sourceID
			var completeSourceID = source.replace(/\s/g,'') + '=' + sourceID; 

			// Check for match
			g.allSaved = sessionStorage.getItem("allJobs");

			if(g.allSaved!==null){
				var iof = g.allSaved.indexOf(completeSourceID);
				if (iof === -1) {
					saved = false;
				}
				else {
					saved = true;
				}
			}

			// Convert date to days ago
			// var daysAgo = moment(date,'MMM-DD').fromNow(true);
			var d = moment().diff(moment(date, 'MMM DD YY'), 'days');
			var daysAgo = d + 'd'

			// var metaArray = [location, date, source];
			// var metaArray = [
			// 	{ key: "location", value: location},
			// 	{ key: "date", value: daysAgo},
			// 	{ key: "source", value: source}
			// ];

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
			var subheadlineEl = $('<h3>');
				subheadlineEl.addClass('subheadline');

				var subheadCompany = $('<span>');
					subheadCompany.addClass('company');
					subheadCompany.text(company);
				
				var subheadLocation = $('<span>');
					subheadLocation.addClass('location');
					subheadLocation.text(location);
				
				var subheadDate = $('<span>');
					subheadDate.addClass('date');
					subheadDate.text(daysAgo);

					subheadlineEl.append(subheadCompany);
					subheadlineEl.append(subheadLocation);
					subheadlineEl.append(subheadDate);

					// Save Wrap
					var saveWrap = $('<span>');
						saveWrap.addClass('save-wrap ghost');

					if (saved === true) {
						saveWrap.attr('data-saved','true');
						saveWrap.addClass('saved');
					}
					else {
						saveWrap.attr('data-saved','false');
					}

			// Meta Details
			// for (var i=0; i<metaArray.length; i++) {
			// 	var p = $('<p>');
			// 		p.addClass('meta-detail');
			// 		p.addClass(metaArray[i].key);
			// 		p.text(metaArray[i].value);
			// 		bodyEl.append(p);
			// };

			var companyWrap = $('<p>');
				companyWrap.addClass('meta-detail');
				companyWrap.addClass('company');
				companyWrap.text(company);

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
					sourceURLLink.attr('target',"_blank");
					sourceURLLink.attr('alt', 'View this job listing on the original site');
					sourceURLLink.text(source);
					sourceWrap.append(sourceURLLink);


			
			// meta
			bodyEl.append(companyWrap);
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
			headerEl.append(subheadlineEl);			

			listingEl.append(headerEl);
			listingEl.append(saveWrap);
			listingEl.append(bodyEl);

			$('#feed').append(listingEl);

		},
ajax_for_googleMaps: 
			function(){

				var lat_long_obj = {};
				g.googleMaps_latLng = [];
			for(var i=0; i< g.companyLocationList.length; i++){	

				// var q_url = 'https://crossorigin.me/https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyAMi4D8mMbs7bI7lFkxo7dmlwpR0yRGrJA'
				// 	+'&query='+encodeURIComponent(g.companyLocationList[i]);

				var q_url = 'https://cors.now.sh/https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyAMi4D8mMbs7bI7lFkxo7dmlwpR0yRGrJA'
					+'&query='+encodeURIComponent(g.companyLocationList[i]);

				// console.log("Before calling google maps api..",q_url);
				//ajax google api req to get json output
				$.ajax({
				type:'GET',
				url: q_url,
				}).done(function(result){

					console.log("THE RESULT IS:::: " +result);
				
				var jsonResponse = JSON.parse(JSON.stringify(result));
				// console.log("RESPONSE RESULTS ===== ",result.results);
				// console.log("RESPONSE GEOMETRY ===== ",result.results[0].geometry);
				// console.log("RESPONSE LOCATION ===== ",result.results[0].geometry.location);
				// console.log("RESPONSE LATTITUDE ===== ",result.results[0].geometry.location.lat);

				console.log("TITLE ==== ",jsonResponse);


					console.log("THE RESULT IS:::: " +result);
		
				var jsonResponse = JSON.parse(JSON.stringify(result));
				// console.log("RESPONSE RESULTS ===== ",result.results);
				// console.log("RESPONSE GEOMETRY ===== ",result.results[0].geometry);
				// console.log("RESPONSE LOCATION ===== ",result.results[0].geometry.location);
				// console.log("RESPONSE LATTITUDE ===== ",result.results[0].geometry.location.lat);


				console.log("TITLE ==== ",jsonResponse);

				if((result.error_message !== 'You have exceeded your daily request quota for this API.') && result.status === "OK"){


					 lat_long_obj = {"title": result.results[0].name , "lat" : result.results[0].geometry.location.lat, "lng" : result.results[0].geometry.location.lng};
					//lat_long_obj = {"lat" : "33.123", "lng" : "-114.245"};

					g.googleMaps_latLng.push(lat_long_obj);

					console.log('Google API result',JSON.stringify(g.googleMaps_latLng));
					localStorage.setItem("companyLocationList",JSON.stringify(g.googleMaps_latLng));
				}
				

			}).fail(function(error){
				console.log('fail',error.code);
				g.api.ajaxError();
			});


		}
		// localStorage.setItem("companyLocationList",g.googleMaps_latLng);
		// console.log('Google API result',g.googleMaps_latLng);
},		
markTerms:
		function(){
			var q = $('#search').val().split(' ');
			$(".meta-detail.description").mark(q);

			if (g.filter.byTerms.whiteList.length !== 0){
				$('.listing').mark(g.filter.byTerms.whiteList);
			}
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
			// 	indeed: 'processing',
			// 	linkup: 'processing'
			// };

			// Reset result count
			g.totalResultCount = 0;


			g.apiStatus = ['processing','processing','processing','processing','processing'];

			// Clear previous results
			g.allResultsStr = [];
			g.allResults = [];
			g.companyList = [];
			g.locationList = [];
			g.companyCounts = {};
			g.locationCounts = {};



			// Reset Pagination: Remove active class from current page
			$('.pagination').find('.active').removeClass('active');

			// Reset Pagination: Add active class to 1st page
			$('.pagination li:nth-child(2)').addClass('active');

			// Reset Pagination: Set page number to 1
			g.page = 1;

			// Hide feed until ready
			// $('#page1').hide();

		},
scrollToTop: 
		$('#scroll-to-top').on('click',function(event){
			event.preventDefault();
			$(window).scrollTop(0);
		}),
submitHandler:
		$('#submit').on('click', function(event){
			event.preventDefault();
			// console.log('submitHandler');
			g.submitCheck();
		}),
submitCheck:
		function(){
			console.log('submitCheck');
			g.reset();

			// Search parameters
			var q = $('#search').val();
			var city = $('#q-city').val().trim();

			// console.log("reset!! #before"+sessionStorage.getItem("userKey"));
			
			console.log('city',city);
			// If location left blank, get current location
			if ( city === '' ) {
				g.geolocation.get();				
				return;
			}
			else{
				$('#q-city').css("outline","none");
			    $('#q-city').css("border-width","0px");			            
			    $('#q-city').css("border-color","none");
			}
			// Allow submission
			g.submit();
		},
submit: 
		function(){
			console.log('submit');
   		if($('#q-city').val().trim()===""){
				alert("City empty");
			}
			else{
			
        if ( g.apisRunning === true ) {
				  return;
			  }
			  else {
				  g.apisRunning = true;
			  }
			// Search parameters
			var q = $('#search').val();
			var city = $('#q-city').val().trim();

			// Add global loading class to html, so any element that 
			// has different style depending on load status, can specify
			// in CSS, rather than adding and removing all these classes
			// to and from all these elements
			$('html').addClass('do-not-disturb');			

				// city = 'San Francisco, CA, United States'


			// Testing abort methods
			// var githubxhr = null;
			// var githubURL = g.api.github.createURL(q,city,"","10");
			// function goGithub(){
			// 	console.log('goGithub()');
			// 	if (githubxhr != null) {
			// 		githubxhr.abort();
			// 		githubxhr = null;
			// 	}
			// 	githubxhr = g.api.github.ajaxCall(githubURL,g.api.github.getResponse);
			// } 
			// goGithub();

			// Glassdoor API Call
			g.analysis.salary.ajax(q);

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

			// Store the last search locally
			g.lastSearchLocal.save(q,city);

			console.log('q',q);
			console.log('city', city);
		    } // End of else
		},
analysis: {
	salary: {
		ajax: function(q){
			var ip = g.userIP;
			// var searchTerm = $('#search').val().trim();
			var searchTerm = q;
			var qURL = 'https://cors-anywhere.herokuapp.com/https://api.glassdoor.com/api/api.htm?t.p=151095&t.k=dSWk91gUjq3&userip='+ ip +'&useragent=&format=json&v=1&action=jobs-prog&countryId=1&jobTitle='+searchTerm;
	
			$.ajax({
				type:'GET',
				url: qURL,
			}).done(function(result){
				var r = result.response;
				console.log('Glassdoor done',result);
				jobba.salaryData = r;
				var attribution = r.attributionURL;

				//  Query title
				var jobTitle = r.jobTitle;
				$('.job-position-target').text(jobTitle);

				var payLow = Math.round(r.payLow/100)/10 +'k';
				var payMedian = Math.round(r.payMedian/100)/10 +'k';
				var payHigh = Math.round(r.payHigh/100)/10 +'k';
				console.log('pays',payLow, payMedian, payHigh);
				$('#pay-low').text(payLow);
				$('#pay-median').text(payMedian);
				$('#pay-high').text(payHigh);

				// Next Job Table
				var nextArr = r.results;
				console.log('nextArr',nextArr);
				var keys = ['nextJobTitle','medianSalary','frequency','frequencyPercent','nationalJobCount'];
				for (var i=0; i<nextArr.length; i++) {
					var io = nextArr[i];
					console.log('io',io);
					var tr = $('<tr>');

					var titleEl = $('<td>');
						titleEl.addClass('col0');
						titleEl.text(io.nextJobTitle);

					var salaryEl = $('<td>');
					var salVal = Math.round(io.medianSalary/1000)+'k'
						salaryEl.addClass('col1');
						salaryEl.text(salVal);

					var freqEl = $('<td>');
					// var freqText =io.frequency + freqPctVal; 
					var freqText =io.frequency; 
						freqEl.addClass('col2');
						freqEl.text(freqText);

						var freqPctEl = $('<span>');
						var freqPctVal = ' ['+ Math.round(io.frequencyPercent) +'%]';
							freqPctEl.addClass('freq-pct');
							freqPctEl.text(freqPctVal);
					freqEl.append(freqPctEl);

					var jobCountEl = $('<td>');
					var jobCount = io.nationalJobCount;

						if (jobCount > 999) jobCount = Math.round(jobCount/1000) +'k';
						else if (jobCount > 999999) jobCount = Math.round(jobCount/1000000) +'m';
					
						jobCountEl.addClass('col3');
						jobCountEl.text(jobCount);


						// for each value in each column
						// for (var j=0; j < keys.length; j++) {
						// 	var k = keys[j];
						// 	var v = io[k];
						// 	console.log('kv',k,v);
						// 	var td = $('<td>');
						// 		td.addClass('col'+j);

						// 	if (j===1) {
						// 		// Salary ROunded
						// 		v = '$ '+ Math.round(v/1000)+'k';
						// 		// v = Math.round(v/100)/10 +'k' // Salary Round to 1 decimal
						// 	}
						// 	else if (j===3) {
						// 		// v = Math.round(v*10)/10;  // Convert 19.123491234 to 19.1
						// 		v = Math.round(v) +'%';
						// 	}
						// 	else if (j===4){
						// 		if (v > 999) {
						// 			v = Math.round(v/1000)+'k';
						// 		}
						// 		else if (v > 999999) {
						// 			v = Math.round(v/1000000) + 'm';
						// 		}
						// 	}




						// 		td.text(v);
						// 		console.log('td',td);
						// 		tr.append(td);
						// };
					tr.append(titleEl);
					tr.append(salaryEl);
					tr.append(freqEl);
					tr.append(jobCountEl);
					// append row to tbody
					$('#nextJobAnalysis tbody').append(tr);
				};


			}).fail(function(){
				console.log('fail');
				g.api.ajaxError();
			});
		}
	}
},
api: 
	{
		timeout: 5000,
		ajaxError: 	
				function(){
					console.log('ajaxError');
					// Change status to fail.
					g.apiCheck++;
					g.checkStatus();
					console.log('g.apiCheck',g.apiCheck);
				},
		github: {
				url: "",
				status: "processing",
				apiIndex: 0,
				createURL: 	
					function(searchString,city,state,noOfRecords) {
						// ---------------Sample Format--------------------
						// https://jobs.github.com/positions.json?description=python&location=sf&full_time=true
						// ------------------------------------------------

						// var githubURL = "https://crossorigin.me/https://jobs.github.com/positions.json?";
						var githubURL = "https://cors.now.sh/https://jobs.github.com/positions.json?";

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
						
						// console.log("Github URL is:"+githubURL);
						g.api.github.url = githubURL;
						return githubURL;
					},
				getResponse: 
					function(result){
						var jobsResults = result;
						console.log('github success');
						// console.log('-----------------GITHUB RESULTS-----------------');
						console.log('Github jobsResults',jobsResults);

						for(var i=0; i< jobsResults.length; i++){
							var ji = jobsResults[i];
							g.allRawData.push(ji);

							// Clean up location data
							var loc = ji.location.trim();

							// Send to Global Print Function
							var jobJSON = {
								"title":  ji.title,
								"jobPosition": ji.title,
								"company": ji.company,
								"location": loc,
								"date": moment(ji.created_at).format("MMM D YY"),
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
						// console.log('g.apiCheck',g.apiCheck);
							var apiIndex = g.api.github.apiIndex;
							g.apiStatus[apiIndex] = 'done';

						// Notify console of end
					},
				ajaxCall: 
					function(qURL, mycallback){
						$.ajax({
							type:'GET',
							url: qURL,
							timeout: g.api.timeout
						}).done(mycallback).fail(g.api.ajaxError);
					}
			},

		indeed: {
				url: "",
				status: "processing",
				apiIndex: 1,
				createURL:
					function(searchString,city,state,noOfRecords){

						// var url = "https://crossorigin.me/https://api.indeed.com/ads/apisearch?publisher=422492215893931&sort=&radius=&st=&jt=&start=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Chrome&v=2&format=json";

						var url = "https://cors.now.sh/https://api.indeed.com/ads/apisearch?publisher=422492215893931&sort=&radius=&st=&jt=&start=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Chrome&v=2&format=json";

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

						// console.log("Indeed URL is: "+url);
						g.api.indeed.url = url;
						return url;
					},
				getResponse: 
					function(result){

						var jobsResults = result.results;
						// console.log('indeed success');
						// console.log('-----------------INDEED RESULTS-----------------');
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
								"date": moment(ji.date).format("MMM D YY"),
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
						// console.log('g.apiCheck',g.apiCheck);
							var apiIndex = g.api.indeed.apiIndex;
							g.apiStatus[apiIndex] = 'done';

					},
				ajaxCall: 
					function(qURL, mycallback){
						$.ajax({
							type:'GET',
							url: qURL,
						}).done(mycallback).fail(g.api.ajaxError);
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
							// console.log("finalcity string length is: "+finalCity.length);

							if(finalCity.length>2){
								city = (finalCity[0]+", "+finalCity[1]);
								// console.log("FINAL CITY IS: "+city);
							}

							city = encodeURIComponent(city);
							url = url + "&city=" + city;

							// console.log("the modified city is: "+city);

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

						// console.log("Dice URL is: "+url);
						g.api.dice.url = url;
						return url;
					},
				getResponse: 
					function(result){

						var jobsResults = result.resultItemList;
						// console.log('-----------------DICE RESULTS-----------------');
						console.log('Dice jobsResults',jobsResults);


						if (!$.trim(jobsResults)){   
							//If empty, do...


						}
						else{   

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
									"date": moment(ji.date).format("MMM D YY"),
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
						g.apiStatus[g.api.dice.apiIndex] = 'done';
						g.apiCheck++;
						g.checkStatus();
						// console.log('g.apiCheck',g.apiCheck);
							var apiIndex = g.api.dice.apiIndex;
							g.apiStatus[apiIndex] = 'done';

						}	

					},
				ajaxCall: 
					function(qURL, mycallback){
						$.ajax({
							type:'GET',
							url: qURL,
							timeout: g.api.timeout
						}).done(mycallback).fail(g.api.ajaxError);
					}
			},

		authentic: {
				url: "",
				status: "processing",
				apiIndex: 3,
				createURL: 
					function(searchString,state,city,pageNumber,noOfRecords){
						// Sample url = https://authenticjobs.com/api/?api_key=a446a0eefe6f5699283g34f4d5b51fa0&method=aj.jobs.get&id=1569

						// var url = "https://crossorigin.me/https://authenticjobs.com/api/?api_key=fb7dee3fcbf41f8c7d867402491d81cb&method=aj.jobs.search&format=json";

						var url = "https://cors.now.sh/https://authenticjobs.com/api/?api_key=fb7dee3fcbf41f8c7d867402491d81cb&method=aj.jobs.search&format=json";
						

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
								// console.log("Authenticjobs FINAL CITY IS: "+city);
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

						// console.log("Authentic Jobs URL is: "+url);

						g.api.authentic.url = url;
						return url;
					},
				getResponse: 
					function(result){

						var jobsResults = result.listings.listing;
						// console.log('-----------------AUTHENTIC JOB RESULTS-----------------');
						// console.log('Authentic result.listings', result.listings);
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
								"date": moment(ji.post_date).format("MMM D YY"),
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

						// Change status to done.
						g.apiCheck++;
						g.checkStatus();
						// console.log('g.apiCheck',g.apiCheck);
							var apiIndex = g.api.authentic.apiIndex;
							g.apiStatus[apiIndex] = 'done';

					},
				ajaxCall: 
					function(qURL, mycallback){
						$.ajax({
							type:'GET',
							url: qURL,
						}).done(mycallback).fail(g.api.ajaxError);
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

						// console.log("URL is:"+url);
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


						// console.log('-----------------Linkup RESULTS-----------------');
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
							var dateFormatted = moment(jobDate).format("MMM D YY");

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
						// console.log('g.apiCheck',g.apiCheck);
						var apiIndex = g.api.linkup.apiIndex;
						g.apiStatus[apiIndex] = 'done';
					},
				ajaxCall: 
					function(qURL, mycallback){
						$.ajax({
							type:'GET',
							url: qURL,
						}).done(mycallback).fail(g.api.ajaxError);
					}
			}
	}

} // end g

// Bind to Window
window.jobba = g;
