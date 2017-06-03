





// Filter button
	$('#applyFilters').on('click',function(e){
		e.preventDefault();
		jobba.filter.byTerms.fx(whiteList,blackList);
	})
// Trigger filter on focus out
	// $('#filter-side-nav').on('focusout',function(e){
	// 	e.preventDefault();
	// 	jobba.filterTerms(whiteList,blackList);
	// });	