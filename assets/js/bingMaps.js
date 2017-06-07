function loadMapScenario() {

                // var points = ["CyberCoders Los Angeles, CA", "CyberCoders Los Angeles, CA", "TMZ.com Los Angeles, CA", "8K Miles Software Services, Inc. Irvine, CA", "Robert Half Technology Sherman Oaks, CA", "Robert Half Technology Sherman Oaks, CA", "TMZ.com Los Angeles, CA", "Robert Half Technology Culver City, CA", "Robert Half Technology Santa Monica, CA", "PFI Tech Lake Forest, CA", "Aarkay Technologies Torrance, CA", "Princeton Information Ltd Glendale, CA", "Robert Half Technology Burbank, CA", "Robert Half Technology Sherman Oaks, CA", "Genuent, LLC Glendale, CA", "HAN IT Staffing Inc. Los Angeles, CA", "Robert Half Technology Burbank, CA", "8K Miles Software Services, Inc. Irvine, CA", "P. Murphy & Associates, Inc Woodland Hills, CA"];

                var points = jobba.companyLocationList;

                var map = new Microsoft.Maps.Map(document.getElementById('map'), {
                    credentials: 'AgGEsp9I45TTP7nNh3ehLbqyUf7GtNaahE1CMfzaoJEuf_KCWX3VYJEQ2QRl7Etn'
                });

                // for(var i=0; i< points.length; i++){
                	// console.log("POINTS ==== ", points[i]);
                // Microsoft.Maps.loadModule('Microsoft.Maps.Search', { callback: searchModuleLoaded });


                Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                	console.log("inside loadModule ....");

                	for(var i=0; i< points.length; i++){
                	console.log("POINTS ==== ", points[i]);
                    var searchManager = new Microsoft.Maps.Search.SearchManager(map);
                    var requestOptions = {
                        bounds: map.getBounds(),
                        where: points[i],
                        userData: points[i],
                        callback: function (answer, userData) {
                            map.setView({ bounds: answer.results[0].bestView });
                            console.log("USERDATA === ",userData);
                            console.log((answer.results[0]));
                            var pushpin = new Microsoft.Maps.Pushpin(answer.results[0].location,{  icon: 'https://ecn.dev.virtualearth.net/mapcontrol/v7.0/7.0.20150902134620.61/i/poi_search.png',
    anchor: new Microsoft.Maps.Point(12, 39), title: userData, subTitle: '' });
                            map.entities.push(pushpin);
                            var infobox = new Microsoft.Maps.Infobox(answer.results[0].location, { title: userData, description: '' });
                            
// Binding the events
                            Microsoft.Maps.Events.addHandler(pushpin, 'click', function () { infobox.setMap(map);});
                        }
                    };
                    console.log("Calling geoCode....");
                    searchManager.geocode(requestOptions);
                }
                });
            // }
                
            }


$("#map-trigger").on("click",function(){
      // ajax_for_googleMap();
       // companyLocationList = (jobba.googleMaps_latLng);

       var script = document.createElement('script');
        script.src = 'https://cors-anywhere.herokuapp.com/https://www.bing.com/api/maps/mapcontrol?callback=loadMapScenario';
        document.getElementsByTagName('head')[0].appendChild(script);

       // <script type='text/javascript' src='http://www.bing.com/api/maps/mapcontrol?callback=loadMapScenario' async defer></script>

   });

