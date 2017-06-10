// Company info
	function emptyReturn(){
	};

	// Trigger open 
	function triggerOpen(e){
		console.log('external trigger');
		e.preventDefault();
		$('#company-modal').modal('open'); 
	}
	// Trigger ajax on listing header click
	$('#feed').on('click', '.company-trigger',triggerOpen);

	// Get company info on listing click
	$('#feed').on('click','.collapsible-header',function(e){
		e.preventDefault();
		var companyName = $(this).parents('.listing').attr("data-company");
		console.log("company name: "+ companyName);
		// Remove empty return class from company modal

		var qURL = 'https://cors-anywhere.herokuapp.com/http://api.glassdoor.com/api/api.htm?t.p=151095&t.k=dSWk91gUjq3&userip='+jobba.userIP+'&useragent=&format=json&v=1&action=employers&q='+companyName;
		
		$.ajax({
			type:'GET',
			url: qURL,
		}).done(function(result){
			// Check if return is empty, If yes, bail out
			var len = result.response.employers.length;
			if (len == 0){
				console.log('Empty return from Glassdoor API');
				$('#company-modal').addClass('empty-return');
				$(this).parents('.listing').addClass('empty-return');
				// Materialize.toast('Oops! Looks like this company does not exist in Glassdoor yet', 3000);
				
				var trigger = $(this).parents('.listing').find('.company-trigger');
					// trigger.off('click',triggerOpen);
					trigger.css({
						'color':'#cccccc',
						'pointer-events': 'none',
					});
					trigger.hide();
					// trigger.removeClass('company-trigger');
				return;
			}

			$('#company-modal').removeClass('empty-return');
			console.log('done - Company info',result);
			var r = result.response;

				attributionURL = r.attributionURL,
				re = r.employers[0],
				name = re.name,
				website = re.website,
				industry = re.industry,
				numberOfRatings = re.numberOfRatings,
				squareLogo = re.squareLogo,
				overallRating = re.overallRating,
				ratingDescription = re.ratingDescription,
				cultureAndValuesRating = re.cultureAndValuesRating,
				seniorLeadershipRating = re.seniorLeadershipRating,
				compensationAndBenefitsRating = re.compensationAndBenefitsRating,
				careerOpportunitiesRating = re.careerOpportunitiesRating,
				workLifeBalanceRating = re.workLifeBalanceRating,
				recommendToFriendRating = re.recommendToFriendRating,
						sectorName = re.sectorName,
						industryName = re.industryName;
			
			var rf = re.featuredReview,
				currentJob = rf.currentJob,
				// 2017-05-14 10:47:31.71 (raw)
				reviewDateTime = moment(rf.reviewDateTime,'YYYY-MM-DD HH:mm:ss.SS').format('MMM D, YYYY'),
				jobTitle = rf.jobTitle,
				location = rf.location,
				headline = rf.headline,
				pros = rf.pros,
				cons = rf.cons,
				overallNumeric = rf.overallNumeric,
						attributionURL = rf.attributionURL,
						jobTitleFromDb = rf.jobTitleFromDb,
						overall = rf.overall;

			var rc = re.ceo,
				ceoName = rc.name,
				ceoTitle = rc.title,
				ceoNumberOfRatings = rc.numberOfRatings,
				ceoPctApprove = rc.pctApprove,
				ceoPctDisapprove = rc.pctDisapprove;



				var starWrap = $('#overall-rating-stars');
					starWrap.empty();
				var roundedDown = parseInt(overallRating);
				var decimal = parseFloat(overallRating - roundedDown);
				
				// Add complete stars
				for (var i=0; i<roundedDown; i++) {
					var star = $('<i>');
						star.addClass('material-icons');
						star.text('star');

					starWrap.append(star);
				};

				// Add the incomplete star
				var star=$('<i>').addClass('material-icons');
				if ( decimal < 0.75 && decimal >= 0.25 ) {
					star.text('star_half');
				}
				else if ( decimal < 0.25 ) {
					star.text('star_border');
				}
				else {
					star.text('star');
				}
				starWrap.append(star);

				// Add empty stars
				// var emptyStars = 5 - Math.round(overallRating);
				var emptyStars = 5 - (roundedDown+1);
				if ( emptyStars > 0) {
					for (var i=0; i<emptyStars; i++) {
						var starEmpty = $('<i>').addClass('material-icons');
							starEmpty.text('star_border');
						starWrap.append(starEmpty);
					};
				}



				$('.company-name-target').text(name);
				$('#overall-rating-number').text(overallRating);
				$('#number-of-reviews .target').text(numberOfRatings);
				$('#cultureValues .target').text(cultureAndValuesRating);
				$('#seniorLeadership .target').text(seniorLeadershipRating);
				$('#compensationBenefits .target').text(compensationAndBenefitsRating);
				$('#careerOpportunities .target').text(careerOpportunitiesRating);
				$('#workLifeBalance .target').text(workLifeBalanceRating);
				$('#recommendToFriend .target').text(recommendToFriendRating);

				$('#companySquareLogo').attr('src',squareLogo);

				$('#companyWebsite .target').attr('href',website).text(website);
				$('#companyName .target').text(name);
				$('#companyIndustry .target').text(industryName);

				$('#featuredReview .sec-headline .target').text(headline);
				$('#review-date .target').text(reviewDateTime);
				$('#review-position .target').text(jobTitle);
				$('#review-currentjob .target').text(currentJob);
				$('#review-location .target').text(location);
				$('#review-overall .target').text(overallNumeric);

				$('#fr-pros .target').text(pros);
				$('#fr-cons .target').text(cons);

				// Change background-color of rating wrap depending on the rating
				var ratingWrap = $('#rating-wrap');
				if ( overallRating <= 2 ) {
					ratingWrap.css('background-color','#e74c3c');
				}
				else if (overallRating <= 3.5) {
					ratingWrap.css('background-color','#f39c12');
				}
				else {
					ratingWrap.css('background-color','#27ae60');
				}

			// console.log("Company Review: " + industry + " " + overallRating + " " + seniorLeadershiptRating + " ");
			// console.log("Featured Review /w pros and cons: " + jobTitle + " " + pros + " " + cons);

		}).fail(function(){
			jobba.api.ajaxError();
		});

	});

