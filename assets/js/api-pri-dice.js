$('#submit').on('click', function(){
	    event.preventDefault();
	    $("#feed").empty();
		q = $('#search').val();
		
		var city = $('#q-city').val().trim();

		url = createDiceReq(q,"",city,"","","");
		console.log("Dice URL: "+url);
		console.log("Dice city is: "+city);
		doAjaxCallDice(url,getDiceResponse);
	});

//CODE ADDED BY PRIYANKA

function createDiceReq(searchString,state,city,areacode,pageNumber,noOfRecords){

	var url = "https://cors-anywhere.herokuapp.com/http://service.dice.com/api/rest/jobsearch/v1/simple.json?text=";

	if(searchString != ""){
		searchString = encodeURIComponent(searchString);
		url = url + searchString;
	}
	if(state != ""){
		state = encodeURIComponent(state);
		url = url + "&state=" + state;
	}
	if(city != ""){
		var finalCity = city.split(",");
		console.log("finalcity string length is: "+finalCity.length);

		if(finalCity.length>2){
			city = (finalCity[0]+", "+finalCity[1]);
			console.log("FINAL CITY IS: "+city);
		}

		city = encodeURIComponent(city);
		url = url + "&city=" + city;

		console.log("the modified city is: "+city);


	}
	else{ 
		city="san+diego,+CA";
		url = url + "&city=" + city;
	}	
	if(areacode != ""){
		areacode = encodeURIComponent(areacode);
		url = url + "&areacode=" + areacode;
	}
	if(pageNumber != ""){
		pageNumber = encodeURIComponent(pageNumber);
		url = url + "&page=" + pageNumber;
	}
	if(noOfRecords != ""){
		noOfRecords = encodeURIComponent(noOfRecords);
		url = url + "&pgcnt=" + noOfRecords;
	}
	return url;

}

function doAjaxCallDice(qURL, mycallback){

	$.ajax({
		type:'GET',
		url: qURL,
	}).done(mycallback).fail(function(){
		//Create a new function to process errors
		console.log('fail', qURL.result);

		// Change status to fail.
		globalObj.apiStatus.dice = 'fail';
	});


}

function getDiceResponse(result){
	// console.log('done',result);
	// console.log('First Record No in this request :: ',result.firstDocument);
	// console.log('Last Record No in this request :: ',result.lastDocument);
	// console.log('Previous URL if any :: ',result.prevURL);
	// console.log('Next URL :: ',result.nextUrl);

	var jobsResults = result.resultItemList;
	console.log('-----------------DICE RESULTS-----------------');
	console.log('Dice jobsResults',jobsResults);

	$("#feed").append();
	for(var i=0; i< jobsResults.length; i++){
		// Format date using moment.js
		var dateFormatted = moment(jobsResults[i].date).format("MMM D");

		// Send to Global Print Function
		var jobJSON = {
			"title" :  jobsResults[i].jobTitle,
			"company": jobsResults[i].company,
			"location": jobsResults[i].location,
			"date": dateFormatted,
			"source": "Dice",
			"description": "Description is not available. For more details, visit Dice's website.",
			"url": jobsResults[i].detailUrl,
		}
		var jobStr = JSON.stringify(jobJSON);
		// globalObj.print(jobStr);
		globalObj.printManager(jobStr);

	} // end for loop

	// Change status to done.
	globalObj.apiStatus.dice = 'done';

	// Notify console 
	console.log('-----------------DICE DONE-----------------');


}

//END OF CODE ADDED BY PRIYANKA