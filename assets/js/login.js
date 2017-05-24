
  var provider = new firebase.auth.GithubAuthProvider();

  // Reference for firebase database
  // var logindatabase = firebase.database();

  $("#signInWithGithub").on("click", function(event){

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      user = result.user;

      // successfully signed in.... What's next?
      alert("Welcome, "+user.displayName)
      

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
