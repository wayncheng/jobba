function getCurrentUser() {

      var userId;
      // Listening for auth state changes.
      // [START authstatelistener]
      firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        // [END_EXCLUDE]

        // to retrieve current user unique ID
        userId = firebase.auth().currentUser.uid;
        
          return userId;
        
      }); 
      // [END authstatelistener]

    } // [END initApp()]