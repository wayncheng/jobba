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

var database = firebase.database();

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

      $(".save-wrap").css('visibility', 'visible');

      // successfully signed in.... What's next?
      // alert("Welcome, "+user.displayName)

      //----------------------------------------------------
      // Add code here
      //----------------------------------------------------

      $("#signInWithGithub").hide();
      $("#signOut").css('visibility', 'visible');
      $("#signOut").show();
      // to retrieve current user unique ID
      userId = firebase.auth().currentUser.uid;
      console.log("userid 1 is: "+userId);

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

function saveJobs(jobObj){
  // console.log(jobObj);

    var jobTitle = jobObj.title;
    var jobCompany = jobObj.company;
    var jobLocation = jobObj.location;
    var jobDate = jobObj.date;
    var jobSource = jobObj.source;
    var jobDescription = jobObj.description;
    var jobURL = jobObj.url;

  console.log("The saved job in login.js is: job title: "+jobTitle +" company: "+ jobCompany+ " location: " +jobLocation+ " Date: " +jobDate+ " Source: " +jobSource+ " Description: "+jobDescription+" URL: " +jobURL);    

    var addJobs = {
      title :  jobTitle,
      company: jobCompany,
      location: jobLocation,
      date: jobDate,
      source: jobSource,
      description: jobDescription,
      url: jobURL
    };

    // Insert into database
    database.ref("/"+userId+"/jobs").push(addJobs);


}

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


$('#signOut').on("click", function(){

    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("Bye");
      $("#username").text("So Long! "+user.displayName);  
      
      $("#signInWithGithub").toggle();
      $("#signOut").hide();
      $(".save-wrap").css('visibility', 'hidden');
      
    }).catch(function(error) {
      // An error happened.
    }); 
  });




$('#displayjobs').on("click", function(){

  //How to pass userID from one page to the other?
  window.location = '/saved-jobs.html';   
});



    // When user logs in, direct to saved-jobs.html

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
          
          var uid = user.uid;
          // window.location = '/saved-jobs.html';          
          console.log(uid);
        }
      }); 
      // [END authstatelistener]

    } // [END initApp()]

    window.onload = function() {
      initApp();
    };
    