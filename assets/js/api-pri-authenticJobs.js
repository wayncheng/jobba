
$('#submit').on('click', function(){
	    event.preventDefault();
	    $("#feed").empty();
		q = $('#search').val();
		url = createAuthenticJobsReq(q,"","","1","10");
		console.log("Wayne file URL: "+url);
		doAjaxCall(url,getAuthenticJobsResponse);
	});


function createAuthenticJobsReq(searchString,state,city,pageNumber,noOfRecords){

	var url = "https://crossorigin.me/https://authenticjobs.com/api/?api_key=fb7dee3fcbf41f8c7d867402491d81cb&method=aj.jobs.search&format=json";

	if(searchString != ""){
		searchString = encodeURIComponent(searchString);
		url = url + "&keywords=" + searchString;
	}
	if(state != ""){
		state = encodeURIComponent(state);
		url = url + "&location=" + state;
	}
	if(city != ""){
		city = encodeURIComponent(city);
		url = url + "&location=" + city;
	}
	
	if(pageNumber != ""){
		pageNumber = encodeURIComponent(pageNumber);
		url = url + "&page=" + pageNumber;
	}
	if(noOfRecords != ""){
		noOfRecords = encodeURIComponent(noOfRecords);
		url = url + "&perpage=" + noOfRecords;
	}
	return url;

	console.log("URL is: "+url);
}

function doAjaxCall(qURL, mycallback){

	$.ajax({
		type:'GET',
		url: qURL,
	}).done(mycallback).fail(function(){
		//Create a new function to process errors
		console.log('fail', qURL.result);
	});


}

function getAuthenticJobsResponse(result){
	console.log('done',result);
	// console.log('First Record No in this request :: ',result.firstDocument);
	console.log('Last Record No in this request :: ',result.listings.total);
	// console.log('Previous URL if any :: ',result.prevURL);
	// console.log('Next URL :: ',result.nextUrl);

	console.log('-----------------JOB DETAILS-----------------');
	var jobsResults = result.listings.listing;

	$("#feed").append();
	for(var i=0; i< jobsResults.length; i++){
		console.log(i+1);
		console.log('jobTitle :: ',jobsResults[i].title);
		console.log('company :: ',jobsResults[i].company);
		console.log('location :: ',jobsResults[i].company.location);
		console.log('date ::',jobsResults[i].date);

		var p = $("<p>");

		var source = $("<span>");
		source.append("Source:: ");
		source.append("Authentic Jobs");
		source.append("&nbsp;");
		source.append("&nbsp;");


		var jobTitle = $("<span>");
		jobTitle.append("JobTitle :: ");
		jobTitle.append(jobsResults[i].title);
		jobTitle.append("&nbsp;");
		jobTitle.append("&nbsp;");

		var company = $("<span>");
		company.append("Company :: ");
		company.append(jobsResults[i].company.name);
		company.append("&nbsp;");
		company.append("&nbsp;");

		if(jobsResults[i].company.location){
			var location = $("<span>");
			location.append("Location :: ");
			location.append(jobsResults[i].company.location.name);
			location.append("&nbsp;");
			location.append("&nbsp;");
		}
		
		var detailUrl = $("<a>");
		var detailUrlImg = $("<img>");
		detailUrlImg.attr("src","assets/img/logo-authentic-jobs.svg");
		// var detailUrlSpan = $("<span>");
		// detailUrlSpan.append("DICE");
		detailUrl.attr("href",jobsResults[i].url);
		detailUrl.attr("name","detailUrl");
		detailUrl.attr("target","_blank");
		detailUrlImg.addClass("logo");
		detailUrl.append(detailUrlImg);

		p.append(source);
		p.append(jobTitle);
		p.append(company);
		p.append(location);
		p.append(detailUrl);


		$("#feed").append(p);

	}


}