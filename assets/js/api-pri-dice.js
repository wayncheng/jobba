$('#submit').on('click', function(){
	    event.preventDefault();
	    $("#feed").empty();
		q = $('#search').val();
		var city = $('#q-city').val().trim();
		url = createDiceReq(q,"",city,"","","");
		console.log("Wayne file URL: "+url);
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
		city = encodeURIComponent(city);
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

	console.log("URL is: "+url);
}

function doAjaxCallDice(qURL, mycallback){

	$.ajax({
		type:'GET',
		url: qURL,
	}).done(mycallback).fail(function(){
		//Create a new function to process errors
		console.log('fail', qURL.result);
	});


}

function getDiceResponse(result){
	console.log('done',result);
	console.log('First Record No in this request :: ',result.firstDocument);
	console.log('Last Record No in this request :: ',result.lastDocument);
	console.log('Previous URL if any :: ',result.prevURL);
	console.log('Next URL :: ',result.nextUrl);

	console.log('-----------------DICE DETAILS-----------------');
	var jobsResults = result.resultItemList;

	$("#feed").append();
	for(var i=0; i< jobsResults.length; i++){
		console.log(i+1);
		console.log('jobTitle :: ',jobsResults[i].jobTitle);
		console.log('company :: ',jobsResults[i].company);
		console.log('location :: ',jobsResults[i].location);
		console.log('date ::',jobsResults[i].date);

		// var p = $("<p>");

		// var source = $("<span>");
		// source.append("Source:: ");
		// source.append("Dice");
		// source.append("&nbsp;");
		// source.append("&nbsp;");


		// var jobTitle = $("<span>");
		// jobTitle.append("JobTitle :: ");
		// jobTitle.append(jobsResults[i].jobTitle);
		// jobTitle.append("&nbsp;");
		// jobTitle.append("&nbsp;");

		// var company = $("<span>");
		// company.append("Company :: ");
		// company.append(jobsResults[i].company);
		// company.append("&nbsp;");
		// company.append("&nbsp;");

		// var location = $("<span>");
		// location.append("Location :: ");
		// location.append(jobsResults[i].location);
		// location.append("&nbsp;");
		// location.append("&nbsp;");

		
		// var detailUrl = $("<a>");
		// var detailUrlSpan = $("<span>");
		// detailUrlSpan.append("DICE");
		// detailUrl.attr("href",jobsResults[i].detailUrl);
		// detailUrl.attr("name","detailUrl");
		// detailUrl.attr("target","_blank");
		// detailUrl.addClass("diceButton");
		// detailUrl.append(detailUrlSpan);

		// p.append(source);
		// p.append(jobTitle);
		// p.append(company);
		// p.append(location);
		// p.append(detailUrl);


		// $("#feed").append(p);

		// Format date using moment.js
		var dateFormatted = moment(jobsResults[i].date).format("MMM D");

		// Send to Global Print Function
		var jobJSON = {
			"title" :  jobsResults[i].jobTitle,
			"company": jobsResults[i].company,
			"location": jobsResults[i].location,
			"date": dateFormatted,
			"source": "Dice",
			
		}
		var jobStr = JSON.stringify(jobJSON);
		globalObj.print(jobStr);

	}


}

//END OF CODE ADDED BY PRIYANKA