
	$("#saved-jobs-modal").on("click", ".remove-btn", function() {
		var jobKey = $(this).parent().parent().attr('id');
			console.log("helloooo:"+jobKey);
			console.log("is user still on??"+userId);
			database.ref("/"+userId+"/jobs/"+jobKey).remove();

	});


  //   $("#scheduleDetails").on("click", ".deleteBtn", function() {
  //   var trainKey = $(this).parent().parent().attr('id');

  //   database.ref("/"+trainKey).remove();
  // });





// $(".saveJob").on("click", function() {
// // $(".listing").on("click", ".saveJob", function() {

//     // var trainKey = $(this).parent().parent().attr('id');
//     // var newTrainName = $(this).parent().parent().find('td>.trainName').val();
//     // var newDestination = $(this).parent().parent().find('td>.destination').val();
//     // var updatedArrivalTime = $(this).parent().parent().find('td>.firstTrainTime').val();
//     var database = firebase.database();

//     var jobTitle = "Developer";
//     var jobCompany = "Amazon";
//     var jobLocation = "San Diego";
//     var jobDate = "01/01/2017";
//     var jobSource = "Indeed";
//     var jobDescription = "Sample Description";
//     var jobURL = "wwww.indeed.com";

//     var addJobs = {
//       title :  jobTitle,
//       company: jobCompany,
//       location: jobLocation,
//       date: jobDate,
//       source: jobSource,
//       description: jobDescription,
//       url: jobURL
//     };

//     console.log("userid: "+userId);

//     // Insert into database
//     database.ref("/"+userId+"/jobs").push(addJobs);

// }); // End of on click
