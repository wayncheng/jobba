
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
        companyLocationList = (jobba.googleMaps_latLng);
        console.log("companyLocationList inside initMap() ===",companyLocationList);

        for(var i=0; i< companyLocationList.length; i++){
          if(companyLocationList[i] != null){
          var marker = new google.maps.Marker({
            position: {lat: parseFloat(companyLocationList[i].lat), lng: parseFloat(companyLocationList[i].lng+1)},
            map: map,
            title: companyLocationList[i].title

          });
        }
        }

//         map.data.addListener('mouseover', function(event) {
//           console.log("MOUSER OVER EVENT...");
//           marker.title = "HELLO WORLD";
//           map.data.revertStyle();
//           map.data.overrideStyle(event.feature, {strokeWeight: 8});
// });

}










<!-- $("#map-trigger").on("click",function(){ -->

      <!-- // jobba.ajax_for_googleMaps(); -->
      <!-- ajax_for_googleMap(); -->
      
	   <!-- // companyLocationList = JSON.parse(localStorage.getItem("companyLocationList")); -->
       <!-- companyLocationList = (jobba.googleMaps_latLng); -->


       <!-- // var latLngValue = jobba.googleMaps_latLng; -->

       <!-- // console.log("LAT LNG VALUE FRM JOBBA OBJ",jobba.googleMaps_latLng[0].lat); -->
        
      // Create a <script> tag and set the USGS URL as the source.
        // var script = document.createElement('script');
        // script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCqrPL7NGZ91Z_Dw7FOxLEyOF2Uc4cVqpc&callback=initMap';
        // document.getElementsByTagName('head')[0].appendChild(script);
	
      // } else{

      // }
  // });

$("#map-trigger").on("click",function(){
      ajax_for_googleMap();
       companyLocationList = (jobba.googleMaps_latLng);
   });




function getCompanyReviews(companyName){
    // var companyName = $(this).attr("data-company");
    console.log("company name: "+ companyName);

    var qURL = 'https://cors-anywhere.herokuapp.com/http://api.glassdoor.com/api/api.htm?t.p=151095&t.k=dSWk91gUjq3&userip='+jobba.userIP+'&useragent=&format=json&v=1&action=employers&q='+companyName;
    
    $.ajax({
      type:'GET',
      url: qURL,
    }).done(function(result){
  
      console.log('done - Company info',result);
    
      var industry = result.response.employers[0].industry;
      var overallRating = result.response.employers[0].overallRating;
      var leadershiptRating = result.response.employers[0].seniorLeadershipRating;

      // Featured Review

      var jobTitle = result.response.employers[0].featuredReview.jobTitle;
      var pros = result.response.employers[0].featuredReview.pros;
      var cons = result.response.employers[0].featuredReview.cons;

      console.log("Company Review: " + industry + " " + overallRating + " " + leadershiptRating + " ");
      console.log("Featured Review /w pros and cons: " + jobTitle + " " + pros + " " + cons);

    }).fail(function(){
      console.log('fail', qURL.result);
    });

}


 function ajax_for_googleMap(){
        var count = 0;
        var lat_long_obj = {};
        jobba.googleMaps_latLng = [];
        console.log('googleMaps_latLng',JSON.stringify(jobba.googleMaps_latLng));
        var name = "";
      for(var i=0; i< g.companyLocationList.length; i++){ 

        name = g.companyLocationList[i];
        console.log("Company Location NAme in starting:: ",g.companyLocationList[i]);

        var q_url = 'https://crossorigin.me/https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyDKldcapUDmMAubBu4w1zP_ieH00FoxmmE'
          +'&query='+encodeURIComponent(g.companyLocationList[i]);
        console.log("Before calling google maps api..",q_url);
        //ajax google api req to get json output
        $.ajax({
        type:'GET',
        url: q_url,
        }).done(function(result){
        
        var jsonResponse = JSON.parse(JSON.stringify(result));
        // console.log("RESPONSE RESULTS ===== ",result.results);
        // console.log("RESPONSE GEOMETRY ===== ",result.results[0].geometry);
        // console.log("RESPONSE LOCATION ===== ",result.results[0].geometry.location);
        // console.log("RESPONSE LATTITUDE ===== ",result.results[0].geometry.location.lat);

        if(result.error_message !== 'You have exceeded your daily request quota for this API.'){
           console.log("TITLE ==== ",result.results[0].name);
          lat_long_obj = {"title": result.results[0].name , "lat" : result.results[0].geometry.location.lat, "lng" : result.results[0].geometry.location.lng};
        //lat_long_obj = {"lat" : "33.123", "lng" : "-114.245"};
        }else{
          console.log("Company Location NAme in success:: ",name);
         lat_long_obj = {"title": name , "lat" : g.geolocation.lat, "lng" : g.geolocation.lng};

         jobba.googleMaps_latLng.push(lat_long_obj);

        // console.log('Google API result',JSON.stringify(g.googleMaps_latLng));
        // localStorage.setItem("companyLocationList",JSON.stringify(g.googleMaps_latLng));
        console.log("COUNT is getting increment...");


        count++;

        console.log("ITEM PER PAGE AND COUNT in success === ", jobba.itemsPerPage, count);


        if(count === jobba.itemsPerPage){

        console.log("Result ==== 20");

        
         var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDRVnIbg6ex56uLgU3VmRdfo-UOb8Hl0GM&callback=initMap';
        document.getElementsByTagName('head')[0].appendChild(script);
      }
        
      }
      //   g.googleMaps_latLng.push(lat_long_obj);

      //   // console.log('Google API result',JSON.stringify(g.googleMaps_latLng));
      //   localStorage.setItem("companyLocationList",JSON.stringify(g.googleMaps_latLng));



      //   count++;

      //   if(jobba.ajax_for_googleMaps.count === jobba.itemsPerPage){

      //   console.log("Result ==== 20");

      //   companyLocationList = (jobba.googleMaps_latLng);
      //    var script = document.createElement('script');
      //   script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCqrPL7NGZ91Z_Dw7FOxLEyOF2Uc4cVqpc&callback=initMap';
      //   document.getElementsByTagName('head')[0].appendChild(script);
      // }
        

      }).fail(function(error){
        console.log('fail',error.code);
        console.log("Company Location NAme :: ",name);
         lat_long_obj = {"title": name , "lat" : g.geolocation.lat, "lng" : g.geolocation.lng};
         count++;

        jobba.googleMaps_latLng.push(lat_long_obj);
        console.log("ITEM PER PAGE AND COUNT in fail === ", jobba.itemsPerPage, count);

        if(count === jobba.itemsPerPage){

        console.log("Result ==== 20");

        companyLocationList = (jobba.googleMaps_latLng);
         var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCqrPL7NGZ91Z_Dw7FOxLEyOF2Uc4cVqpc&callback=initMap';
        document.getElementsByTagName('head')[0].appendChild(script);
      }

        // g.apiError;
      });
    }

        console.log("OUTSIDE FAIL=== ", jobba.itemsPerPage, count);

      
        // jobba.googleMaps_latLng.push(lat_long_obj);
        console.log("ITEM PER PAGE AND COUNT OUTSIDE=== ", jobba.itemsPerPage, count);

        if(count === jobba.itemsPerPage){

        console.log("Result ==== 20");

        companyLocationList = (jobba.googleMaps_latLng);
         var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCqrPL7NGZ91Z_Dw7FOxLEyOF2Uc4cVqpc&callback=initMap';
        document.getElementsByTagName('head')[0].appendChild(script);
      }

    }