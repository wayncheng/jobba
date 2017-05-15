//--------------------------------------------------
// Indeed Job Search API - Novia
//--------------------------------------------------

$(document).ready(function(){

	$('#submit').on('click', function(){
	    event.preventDefault();
	    $("#feed").empty();
		q = $('#search').val();
		url = createIndeedURL(q,"","","10");
		doAjaxCall(url,getIndeedResponse);
	});

});


// ---------------Sample Format--------------------
// http://api.indeed.com/ads/apisearch?publisher=422492215893931&q=java&l=austin%2C+tx&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2
// ------------------------------------------------



function createIndeedURL(searchString,city,state,noOfRecords){

	var url = "https://api.indeed.com/ads/apisearch?publisher=422492215893931&sort=&radius=&st=&jt=&start=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2&format=json";

	if(searchString != ""){
		searchString = encodeURIComponent(searchString);
		url = url + "&q=" + searchString;
	}
	if(city != ""){
		city = encodeURIComponent(city);
		url = url + "&l=" + city;
	}
	//Test case using San Diego
	else{ 
		city="san+diego";
		url = url + "&l=" + city;
	}	
	if(state != ""){
		state = encodeURIComponent(state);
		url = url + "C+" + state;
	}
	if(noOfRecords != ""){
		noOfRecords = encodeURIComponent(noOfRecords);
		url = url + "&limit=" + noOfRecords;
	}

	console.log("URL is:"+url);
	return url;
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

function getIndeedResponse(result){
	console.log('done',result);
	console.log('First Record No in this request :: ',result.start);
	console.log('Last Record No in this request :: ',result.end);
	console.log('Previous URL if any :: ',result.prevURL);
	console.log('Next URL :: ',result.nextUrl);

	console.log('-----------------JOB DETAILS-----------------');
	var jobsResults = result.results;

	$("#feed").append();
	for(var i=0; i< jobsResults.length; i++){
		console.log(i+1);
		console.log('jobTitle :: ',jobsResults[i].jobtitle);
		console.log('company :: ',jobsResults[i].company);
		console.log('location :: ',jobsResults[i].city);
		console.log('date ::',jobsResults[i].date);

		var p = $("<p>");

		var source = $("<span>");
		source.append("Source:: ");
		source.append("Indeed");
		source.append("&nbsp;");
		source.append("&nbsp;");

		var jobTitle = $("<span>");
		jobTitle.append("JobTitle :: ");
		jobTitle.append(jobsResults[i].jobtitle);
		jobTitle.append("&nbsp;");
		jobTitle.append("&nbsp;");

		var company = $("<span>");
		company.append("Company :: ");
		company.append(jobsResults[i].company);
		company.append("&nbsp;");
		company.append("&nbsp;");

		var location = $("<span>");
		location.append("Location :: ");
		location.append(jobsResults[i].city);

		p.append(source);
		p.append(jobTitle);
		p.append(company);
		p.append(location);

		$("#feed").append(p);

	}


}

