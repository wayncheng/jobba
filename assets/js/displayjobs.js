
var uid;

function printSavedJobs() {
	// Listening for auth state changes.
	// [START authstatelistener]
	firebase.auth().onAuthStateChanged(function(user) {
			// [START_EXCLUDE silent]
			// [END_EXCLUDE]
			console.log("Attempted Sign in");
			console.log(user);
			
			if (user) {
				// User is signed in.

				uid = user.uid;
				console.log("uid2: "+uid);


				// Retrieve and display results from Firebase
				var allJobs = [];
				// var user=null;


				userId = uid;
				console.log("userid 3 is: "+userId);

				// At the initial load, get a snapshot of the current data.
				firebase.database().ref("/"+userId+"/jobs").on("value", function(snapshot) {

					var jobs_data = snapshot.val();
					allJobs = [];

					// Put all trains object from database into array
					for(var i in jobs_data) {

						// Print the initial data to the console.
						console.log("Jobs " +i+ ":" +jobs_data[i]);

						allJobs.push([i,jobs_data[i]]);
					}

					$("#saved-feed").empty();

					for(var i =0; i<allJobs.length; i++){	
						console.log(allJobs[i][1].company);
					}


					allJobs.forEach(function(jobData){


						// Variables for details to be written
						var title = jobData[1].title;
						// var title = g.resultNumber +'. '+ jobData.title;
						var company = jobData[1].company;
						var location = jobData[1].location;
						var date = jobData[1].date;
						var source = jobData[1].source;
						var description = jobData[1].description;
						var url = jobData[1].url;
						// var jobIndex = jobData.index;
						
						// Convert date to days ago
						var daysAgo = moment(jobData[1].date,'MMM-DD').fromNow();


					  console.log("The saved job in display.js is: job title: "+title +" company: "+ company+ " location: " +location+ " Date: " +daysAgo+ " Source: " +source+ " Description: "+description+ "URL: "+url);    


						// var metaArray = [location, date, source];
						var metaArray = [
							{ key: "location", value: location},
							{ key: "date", value: daysAgo},
							{ key: "source", value: source},
						];

						var wrap = $('<div>');
							wrap.addClass('listing panel panel-default');
							// wrap.attr('data-all',jobStr);
							wrap.attr('data-index',jobIndex);
							wrap.attr('data-company',company);

						var body = $('<div>');
							body.addClass('panel-body');

						var h2 = $('<h2>');
							h2.addClass('headline');
							h2.text(title);
						
						var h3 = $('<h3>');
							h3.addClass('company');
							h3.text('('+ company +')');
						
						// var saveImg = $('<img>');
						// 	saveImg.addClass('save-img');
						// 	saveImg.attr('src',saveBtnImageSource);
						// 	saveImg.attr('alt','Save this job listing');

						// var saveWrap = $('<div>');
						// 	saveWrap.addClass('save-wrap')
						// 	saveWrap.html(saveImg);

						// var d = $('<p>');
						// 	d.addClass('description below-fold fold-hide');
						// 	d.html(description);

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
						// var foldToggle = $('<div>').addClass('toggle-fold');
						// 	foldToggle.attr('data-fold','closed');

						body.append(h2);
						body.append(h3);
						// body.append(saveWrap);
						body.append(metaWrap);
						// body.append(foldToggle);
						// body.append(d);
						wrap.append(body);
						$('#saved-feed').append(wrap);



						console.log(jobData[1],jobData[0]);
					});			
				});			

			}

	}); // END of initial load
		
}

// window.onload = function() {
// 	initApp();
// 	// Register the callback to be fired every time auth state changes
// };






