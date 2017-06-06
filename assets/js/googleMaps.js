
		var latLng;
      var map;
      var companyLocationList;
	function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7, 
          center: new google.maps.LatLng(companyLocationList[0].lat,companyLocationList[0].lng),
          mapTypeId: 'terrain'
        });

        // Loop through the results array and place a marker for each
        // set of coordinates.
        console.log("companyLocationList ===",companyLocationList);
        for(var i=0; i< companyLocationList.length; i++){
          var marker = new google.maps.Marker({
            position: {lat: parseFloat(companyLocationList[i].lat), lng: parseFloat(companyLocationList[i].lng+1)},
            map: map,
            title: companyLocationList[i].title

          });
        }
}



$("#map-trigger").on("click",function(){

	   // companyLocationList = JSON.parse(localStorage.getItem("companyLocationList"));
     companyLocationList = (jobba.googleMaps_latLng);


     var latLngValue = jobba.googleMaps_latLng;

      console.log("LAT LNG VALUE FRM JOBBA OBJ",jobba.googleMaps_latLng[0].lat);
      
      // Create a <script> tag and set the USGS URL as the source.
      var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCqrPL7NGZ91Z_Dw7FOxLEyOF2Uc4cVqpc&callback=initMap';
        document.getElementsByTagName('head')[0].appendChild(script);
	

  });