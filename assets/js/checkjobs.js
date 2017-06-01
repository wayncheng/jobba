function checkJobs(){
	// At the initial load, get a snapshot of the current data.
	firebase.database().ref("/"+userId+"/jobs").on("value", function(snapshot) {

		var jobs_data = snapshot.val();
		allJobs = [];

		// Put all jobs object from database into array
		for(var i in jobs_data) {

			// Print the initial data to the console.
			// console.log("Jobs " +i+ ":" +jobs_data[i]);
			// i is source+JobID

			allJobs.push([i,jobs_data[i]]);
			console.log(jobs_data[i]);
		}

		sessionStorage.setItem("allJobs",allJobs);

		for(var j in allJobs){
			console.log("REACHED: "+allJobs[j]);
		}
	});	

}