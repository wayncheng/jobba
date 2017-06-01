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
    event.preventDefault();
    loginGH();
  }); // End of sign on with GitHub  


function loginGH(){

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      user = result.user;

      $('html').addClass('logged-in');

      // $(".save-wrap").css('visibility', 'visible');
      // $("#displayJobs").css('visibility', 'visible');

      // $("#signInWithGithub").hide();
      // $("#signOut").css('visibility', 'visible');
      // $("#signOut").show();
      // to retrieve current user unique ID
      userId = firebase.auth().currentUser.uid;
      console.log("userid 1 is: "+userId);

      sessionStorage.setItem("userKey",userId);
      checkJobs();

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

}

function saveJobs(jobObj){
  // console.log(jobObj);

    var jobTitle = jobObj.title;
    var jobCompany = jobObj.company;
    var jobLocation = jobObj.location;
    var jobDate = jobObj.date;
    var jobSource = jobObj.source;
    var jobDescription = jobObj.description;
    var jobURL = jobObj.url;
    var sourceJobID = jobObj.source.replace(/\s/g,'') + '=' +jobObj.sourceID;

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
    // jobcon = database.ref("/"+userId+"/jobs/"+sourceJobID).push();
    if(userId!=""){
      database.ref("/"+userId+"/jobs/"+sourceJobID).set(addJobs);
    }

}



$('#signOut').on("click", function(){

    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("Bye");
      $('html').removeClass('logged-in');
      sessionStorage.removeItem("userKey");

      // $("#signInWithGithub").css('visibility', 'visible');
      // $("#signInWithGithub").show();
      // $("#signOut").hide();
      // $(".save-wrap").css('visibility', 'hidden');
      // $("#displayJobs").css('visibility', 'hidden');
      
    }).catch(function(error) {
      // An error happened.
    }); 
  });

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
    