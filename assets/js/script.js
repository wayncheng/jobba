$(document).ready(function () {
		// Get user's IP
		jobba.getIP;

	$('#feed').on('click','.save-wrap',function(event){
		event.preventDefault();
		var $t = $(this);

		// Get listing data
		var thisListing = $(this).parents('.listing');
		var dataIndex = thisListing.attr('data-index');
		var saveData = jobba.allResults[dataIndex];
		console.log('saveData',saveData);

		saveJobs(saveData);

		// Icon Change
		$t.toggleClass('saved'); //How can we only only click this one time? - Novia

	}); // end listing click

	// Feature Function
	$('#feed').on('click','.listing',function(event){
		event.preventDefault();

		// clear previous selection
		$('.featured').removeClass('.featured');

		// Add class to new selection
		// $(this).toggleClass('featured');
		$(this).addClass('featured');

		// read listing index and fetch listing's data using index
		var dataIndex = $(this).attr('data-index');
		var data = jobba.allResults[dataIndex];


		// Description
		var description = data.description;
		$('#ft-description').html(description);

		// Company
		var companyName = data.company;
		$('#ft-company-name').text(companyName);

		// Make room for feature container, and reveal
		$('.filter-container').removeClass('col-md-offset-1');
		$('.feature-container').show();

		// Position feature display
		var windowPos = $(window).scrollTop();
		var bannerHeight = $('#banner').height();
		// var containerPos = $('.feature-container').scrollTop();
		var cushion = 105;
		var featurePos = windowPos - bannerHeight - cushion;

		if ( featurePos < 0 ) {
			featurePos = 0
		}
		$('#feature').css('top', featurePos+'px');

	}); // end listing click













}); ////////////////////////////////////////// end document.ready