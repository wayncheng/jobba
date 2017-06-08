var uid;

function firstJobLoad(){
	if(sessionStorage.getItem("userKey")){

		userId = sessionStorage.getItem("userKey");
			
		var allJobs = [];
		
			// At the initial load, get a snapshot of the current data.
			firebase.database().ref("/users/"+userId+"/jobs").once("value", function(snapshot) {

				var jobs_data = snapshot.val();
				allJobs = [];

				// Put all trains object from database into array
				for(var i in jobs_data) {

					// Print the initial data to the console.
					// console.log("Jobs " +i+ ":" +jobs_data[i]);
					// i is source+JobID

					allJobs.push([i,jobs_data[i]]);
				}

				$("#saved-feed").empty();

				var index = 0;

				allJobs.forEach(function(jobData){

					index++;

					// Variables for details to be written
					var jobID = jobData[0];
					var title = jobData[1].title;
					var company = jobData[1].company;
					var location = jobData[1].location;
					var date = moment(jobData[1].date,'MMM D YY').format('MMM D, YYYY');
					var source = jobData[1].source;
					var description = jobData[1].description;
					var url = jobData[1].url;
					var jobIndex = index;
					
					// Convert date to days ago
					var d = moment().diff(moment(date, 'MMM D YYYY'), 'days');
					var daysAgo = d + 'd';


				  // console.log("The saved job in display.js is: job title: "+title +" company: "+ company+ " location: " +location+ " Date: " +daysAgo+ " Source: " +source+ " Description: "+description+ "URL: "+url);    

					var listingEl = $('<li>');
						listingEl.addClass('listing');
						listingEl.attr('data-index',jobIndex)
						listingEl.attr('data-company',company);
						listingEl.attr('data-source',source);
						listingEl.attr('data-source-id',completeSourceID);
						listingEl.attr('id',jobID);

					var listingNumberEl = $('<span>');
						listingNumberEl.addClass('listing-number ghost');
						listingNumberEl.text(index);
					
					var headerEl = $('<div>');
						headerEl.addClass('collapsible-header');
					
					var bodyEl = $('<div>');
						bodyEl.addClass('collapsible-body');

					var headlineEl = $('<h2>');
						headlineEl.addClass('headline');
						headlineEl.text(title);

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
						sourceWrap.addClass('sourceURL');

						var sourceURLLink = $('<a>');
							sourceURLLink.attr('href',url);
							sourceURLLink.attr('target',"_blank");
							sourceURLLink.attr('alt', 'View this job listing on the original site');
							sourceURLLink.text('Apply Here');
							sourceWrap.append(sourceURLLink);
					// Remove button
					var removeBtn = $("<button>")
						removeBtn.addClass("remove-btn");
						// removeBtn.text("x");
						var removeIcon = $('<i>');
							removeIcon.addClass('.material-icons');
							removeIcon.text('close');
							removeBtn.append(removeIcon);

					
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
					headerEl.append(removeBtn);				

					listingEl.append(headerEl);
					// listingEl.append(saveWrap);
					listingEl.append(bodyEl);

					$('#saved-feed').append(listingEl);
					// console.log(jobData[1],jobData[0]);
				});			
			});			

	}
}


function printSavedJobs() {

	// Listening for auth state changes.
	// [START authstatelistener]
	firebase.auth().onAuthStateChanged(function(user) {
			// [START_EXCLUDE silent]
			// [END_EXCLUDE]
			
			if (user) {
				// User is signed in.

				uid = user.uid;

				// Retrieve and display results from Firebase
				var allJobs = [];

				userId = uid;
				console.log("userid 3 is: "+userId);

				// At the initial load, get a snapshot of the current data.
				firebase.database().ref("/users/"+userId+"/jobs").on("value", function(snapshot) {

					var jobs_data = snapshot.val();
					allJobs = [];

					// Put all trains object from database into array
					for(var i in jobs_data) {

						// Print the initial data to the console.
						// console.log("Jobs " +i+ ":" +jobs_data[i]);
						// i is source+JobID

						allJobs.push([i,jobs_data[i]]);
					}

					$("#saved-feed").empty();

					var index = 0;

				allJobs.forEach(function(jobData){

					index++;

					// Variables for details to be written
					var jobID = jobData[0];
					var title = jobData[1].title;
					var company = jobData[1].company;
					var location = jobData[1].location;
					var date = moment(jobData[1].date,'MMM D YY').format('MMM D, YYYY');
					var source = jobData[1].source;
					var description = jobData[1].description;
					var url = jobData[1].url;
					var jobIndex = index;
					
					// Convert date to days ago
					var d = moment().diff(moment(date, 'MMM D YYYY'), 'days');
					var daysAgo = d + 'd';


				  // console.log("The saved job in display.js is: job title: "+title +" company: "+ company+ " location: " +location+ " Date: " +daysAgo+ " Source: " +source+ " Description: "+description+ "URL: "+url);    

					var listingEl = $('<li>');
						listingEl.addClass('listing');
						listingEl.attr('data-index',jobIndex)
						listingEl.attr('data-company',company);
						listingEl.attr('data-source',source);
						listingEl.attr('id',jobID);

					var listingNumberEl = $('<span>');
						listingNumberEl.addClass('listing-number ghost');
						listingNumberEl.text(index);
					
					var headerEl = $('<div>');
						headerEl.addClass('collapsible-header');
					
					var bodyEl = $('<div>');
						bodyEl.addClass('collapsible-body');

					var headlineEl = $('<h2>');
						headlineEl.addClass('headline');
						headlineEl.text(title);

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
						sourceWrap.addClass('sourceURL');

						var sourceURLLink = $('<a>');
							sourceURLLink.attr('href',url);
							sourceURLLink.attr('target',"_blank");
							sourceURLLink.attr('alt', 'View this job listing on the original site');
							sourceURLLink.text('Apply Here');
							sourceWrap.append(sourceURLLink);

					// Remove button
					var removeBtn = $("<button>")
						removeBtn.addClass("remove-btn btn waves-effect waves-light ghost");
						// removeBtn.text("x");
						var removeIcon = $('<i>');
							removeIcon.addClass('material-icons');
							removeIcon.text('close');
							removeBtn.append(removeIcon);

					
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
					headerEl.append(removeBtn);		

					listingEl.append(headerEl);
					listingEl.append(bodyEl);

					$('#saved-feed').append(listingEl);
					// console.log(jobData[1],jobData[0]);
				});		
					// allJobs.forEach(function(jobData){

					// 	index++;

					// 	// Variables for details to be written
					// 	var jobID = jobData[0];
					// 	var title = jobData[1].title;
					// 	var company = jobData[1].company;
					// 	var location = jobData[1].location;
					// 	var date = jobData[1].date;
					// 	var source = jobData[1].source;
					// 	var description = jobData[1].description;
					// 	var url = jobData[1].url;
					// 	var jobIndex = index;
						
					// 	// Convert date to days ago
					// 	var daysAgo = moment(jobData[1].date,'MMM-DD').fromNow();


					//   // console.log("The saved job in display.js is: job title: "+title +" company: "+ company+ " location: " +location+ " Date: " +daysAgo+ " Source: " +source+ " Description: "+description+ "URL: "+url);    

					//   	var listingNumberEl = $('<span>');
					// 	listingNumberEl.addClass('listing-number ghost');
					// 	listingNumberEl.text(index);

					// 	// var metaArray = [location, date, source, url];
					// 	var metaArray = [
					// 		{ key: "location", value: location},
					// 		{ key: "date", value: daysAgo},
					// 		{ key: "source", value: source}
					// 	];

					// 	var wrap = $('<div>');
					// 		wrap.addClass('listing panel panel-default');
					// 		// wrap.attr('data-all',jobStr);
					// 		wrap.attr('data-index',jobIndex);
					// 		wrap.attr('data-company',company);
					// 		wrap.attr('id',jobID);

					// 	var body = $('<div>');
					// 		body.addClass('panel-body');

					// 	var h2 = $('<h2>');
					// 		h2.addClass('headline');
					// 		h2.text(title);
						
					// 	var h5 = $('<h5>');
					// 		h5.addClass('company');
					// 		h5.text('('+ company +')');
						
					// 	// var saveImg = $('<img>');
					// 	// 	saveImg.addClass('save-img');
					// 	// 	saveImg.attr('src',saveBtnImageSource);
					// 	// 	saveImg.attr('alt','Save this job listing');

					// 	// var saveWrap = $('<div>');
					// 	// 	saveWrap.addClass('save-wrap')
					// 	// 	saveWrap.html(saveImg);

					// 	// var d = $('<p>');
					// 	// 	d.addClass('description below-fold fold-hide');
					// 	// 	d.html(description);

					// 	var removeBtn = $("<button>")
					// 		removeBtn.addClass("remove-btn");
					// 		removeBtn.text("x");

					// 	// Original Source URL
					// 	var sourceWrap = $('<p>');
					// 		sourceWrap.addClass('meta-detail');
					// 		sourceWrap.addClass('details sourceURL');

					// 		var sourceURLLink = $('<a>');
					// 			sourceURLLink.attr('href',url);
					// 			sourceURLLink.attr('target',"_blank");
					// 			sourceURLLink.attr('alt', 'View this job listing on the original site');
					// 			sourceURLLink.text("Apply here");
					// 			sourceWrap.append(sourceURLLink);

					// 	var metaWrap = $('<div>');
					// 		metaWrap.addClass('meta');

					// 	for (var i=0; i<metaArray.length; i++) {
					// 		var p = $('<p>');
					// 			p.addClass('meta-detail');
					// 			p.addClass(metaArray[i].key);
					// 			p.text(metaArray[i].value);
					// 			metaWrap.append(p);
					// 	};
						
					// 	// Fold toggle
					// 	// var foldToggle = $('<div>').addClass('toggle-fold');
					// 	// 	foldToggle.attr('data-fold','closed');

					// 	body.append(listingNumberEl);
					// 	body.append(h2);
					// 	body.append(h5);
					// 	// body.append(saveWrap);
					// 	body.append(metaWrap);
					// 	body.append(sourceWrap);
					// 	body.append(removeBtn);	
					// 	// body.append(foldToggle);
					// 	// body.append(d);
					// 	wrap.append(body);
					// 	$('#saved-feed').append(wrap);
					// 	$('#saved-feed').append("<hr>");

					// 	// console.log(jobData[1],jobData[0]);
					// });			
				});			

			}

	}); // END of initial load
		
}

// window.onload = function() {
// 	initApp();
// 	// Register the callback to be fired every time auth state changes
// };






