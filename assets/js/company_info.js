// Company info

	

$(document).ready(function(){


	$('#feed').on('click', ".listing",function(event){
		event.preventDefault();
		var companyName = $(this).attr("data-company");
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

		
	});

});