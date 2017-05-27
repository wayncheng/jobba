
$("#submit").on("click",function(){
	console.log("IN PAGINATION.JS");
	$("#pagination").empty();
	setTimeout(function(){ 
	totalRecordsDisplay = totalIndeedJobs+totalAJJobs+totalDiceJobs
	console.log("TOTAL NUMBER OF JOBS in PAGINATION==== ",totalRecordsDisplay);
	var ul = $("<ul>");
	ul.addClass("pagination");


	var pagesToDisplay = totalRecordsDisplay/12;
	for(var j=0; j<pagesToDisplay; j++){
		var li = $("<li>");
		var anchor = $("<a>");
		anchor.attr("href","#");
		anchor.attr("page",j+1);
		anchor.text(j+1);
		li.append(anchor);
		ul.append(li);
	}

	$("#pagination").append(ul);
	// alert("Hello"); 
}, 5000);
});