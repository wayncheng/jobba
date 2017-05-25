
  var provider = new firebase.auth.GithubAuthProvider();
  var userId = "";

  // Reference for firebase database
  // var logindatabase = firebase.database();

  $("#signInWithGithub").on("click", function(event){

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      user = result.user;

      // successfully signed in.... What's next?
      // alert("Welcome, "+user.displayName)


      //----------------------------------------------------
      // Add code here
      //----------------------------------------------------

      // to retrieve current user unique ID
      userId = firebase.auth().currentUser.uid;
      console.log("userid is: "+userId);

      // return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      //   var username = snapshot.val().username;
      //   // ...

      //   console.log(username);
      // });

  

    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
        console.log("Error - " + errorCode + "  " + errorMessage + "  " + email + "  " + credential);
    });

  }); // End of sign on with GitHub


$(".saveJob").on("click", function() {
// $(".listing").on("click", ".saveJob", function() {

    // var trainKey = $(this).parent().parent().attr('id');
    // var newTrainName = $(this).parent().parent().find('td>.trainName').val();
    // var newDestination = $(this).parent().parent().find('td>.destination').val();
    // var updatedArrivalTime = $(this).parent().parent().find('td>.firstTrainTime').val();
    var database = firebase.database();

    var jobTitle = "Developer";
    var jobCompany = "Amazon";
    var jobLocation = "San Diego";
    var jobDate = "01/01/2017";
    var jobSource = "Indeed";
    var jobDescription = "Sample Description";
    var jobURL = "wwww.indeed.com";

    var addJobs = {
      title :  jobTitle,
      company: jobCompany,
      location: jobLocation,
      date: jobDate,
      source: jobSource,
      description: jobDescription,
      url: jobURL
    };

    console.log("userid: "+userId);

    // Insert into database
    database.ref("/"+userId+"/jobs").push(addJobs);

  });


                // playersRef.child(1).set({
                //   name: username,
                //   wins: 0,
                //   losses: 0
                // });