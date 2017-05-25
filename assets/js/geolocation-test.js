function locationSupport(){
		// check for Geolocation support
		if (navigator.geolocation) {
			console.log('supported');
		  return true;
		}
		else {
		  console.log('Geolocation is not supported for this Browser/OS.');
		  return false;
		}
}
// console.log('navigator.geolocation',navigator.geolocation);
// console.log('locationSupport()',locationSupport());

function getUserLocation() {
	var startPos;
	var geoOptions = {
		maximumAge: 5 * 60 * 1000,
		timeout: 10 * 1000,
	};

	function geoSuccess(position) {
		startPos = position;
		document.getElementById('startLat').innerHTML = startPos.coords.latitude;
		document.getElementById('startLon').innerHTML = startPos.coords.longitude;
	};
	function geoError(error) {
		console.log('Error occurred. Error code: ' + error.code);
		// error.code can be:
		//   0: unknown error
		//   1: permission denied
		//   2: position unavailable (error response from location provider)
		//   3: timed out
	};
	navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
};
function nudgeUser(){
		var startPos;
		var nudge = document.getElementById("nudge");

		function showNudgeBanner() {
			nudge.style.display = "block";
		};

		function hideNudgeBanner() {
			nudge.style.display = "none";
		};

		var nudgeTimeoutId = setTimeout(showNudgeBanner, 5000);

		function geoSuccess(position) {
			hideNudgeBanner();
			// We have the location, don't display banner
			clearTimeout(nudgeTimeoutId);

			// Do magic with location
			startPos = position;
			document.getElementById('startLat').innerHTML = startPos.coords.latitude;
			document.getElementById('startLon').innerHTML = startPos.coords.longitude;
		};

		function geoError(error) {
			switch(error.code) {
			  case error.TIMEOUT:
			    // The user didn't accept the callout
			    showNudgeBanner();
			    break;
			};
		};

	  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}


	var bool = jobba.checkLocationSupport();
	console.log('bool',bool);
	console.log('jobba.checkLocationSupport',jobba.checkLocationSupport());

