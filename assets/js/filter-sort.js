

	$('#filter-source').on('click','.filterSourceInput',function(event){
	// $('.filterSourceInput').on('click',function(event){
	// $('#filter-source').on('click',function(event){
		// event.preventDefault();
		var $t = $(this);
		$t.toggleClass('data-hide');

		var sourceReport = {show: [], hide: [], };
		var sourceHidden = [];

		$('.filterSourceInput.data-hide').each(function(){
			var dataRep = $(this).attr('value');
			sourceHidden.push(dataRep);
		});
		console.log('sourceHidden',sourceHidden);

		// Pass to global filter
		jobba.resultFilter(sourceHidden);
	});




// Filter button
	$('#applyFilters').on('click',function(e){
		e.preventDefault();
		jobba.filterTerms(whiteList,blackList);
	})
// Trigger filter on focus out
	// $('#filter-side-nav').on('focusout',function(e){
	// 	e.preventDefault();
	// 	jobba.filterTerms(whiteList,blackList);
	// });	
// Array of tags to filter out
	var whiteList = [];
	var blackList = [];

// Add tag to filter & trigger
	$('.filterTermInput').on('keyup',function(event){
		event.preventDefault();
		var c = event.keyCode

		// Bail unless key pressed is comma or return 
		if ( c !== (13 || 44) ) return;

	// If right key pressed, save tag
		// Text inputs
		var excludeInput = $('#excludeTerms').val().trim();
		// var includeInput = $('#includeTerms').val().trim();

		// Push to lists
		blackList.push(excludeInput);
		// whiteList.push(includeInput);

		// Clear input fields
		$('#excludeTerms').val('');
		// $('#includeTerms').val('');

		// Add chip for term
		// Sample: <div class="chip"> Tag <i class="close material-icons">close</i> </div>
		var chip = $('<div>').addClass('chip');
		var x = $('<i>').addClass('close material-icons').text('close');
		chip.text(excludeInput);
		chip.append(x);
		$('.chip-bag').append(chip);

		// Pass on
		jobba.filterTerms(whiteList, blackList);



		// // Split terms
		// var exSplit = excludeInput.split(','); 
		// var inSplit = includeInput.split(',');
		// console.log('inSplit',inSplit);
		// console.log('exSplit',exSplit);

		// Pass to filter
		// jobba.filterTerms(inSplit,exSplit);

	});

// Term Removal
	$('.chip-bag').on('click','.close',function(e){
		e.preventDefault();
		var $t = $(this);
		var term = $t.parent('.chip').text();
		var targetList = blackList;

	 	// Remove term from term list 
		blackList = targetList.filter(function(eachTerm){
			return eachTerm !== term;
		});

		// Remove from DOM
		$t.parent('.chip').remove();

		// Refilter new terms --- (refine this in the future to just restore the difference)
		jobba.filterTerms(whiteList,blackList);
	})
