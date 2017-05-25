// Initialize Firebase
var config = {
	apiKey: "AIzaSyBUVssFCnGKGEypDRsWSps4-Aklr1H9Zag",
	authDomain: "jobba-fe187.firebaseapp.com",
	databaseURL: "https://jobba-fe187.firebaseio.com",
	projectId: "jobba-fe187",
	storageBucket: "jobba-fe187.appspot.com",
	messagingSenderId: "430840990935"
};
firebase.initializeApp(config);

var uid;

function initApp() {
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

					$("#savedJobsFeed").empty();

					allJobs.forEach(function(jobData){

						// Update table with train data
						// updateTrainTable(trainData[1],trainData[0]);

						console.log(jobData[1],jobData[0]);
					});			
				});			

			}

	}); // END of initial load
		
}

window.onload = function() {
	initApp();
	// Register the callback to be fired every time auth state changes
};






