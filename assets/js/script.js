$('#submit').on('click', function(event){
	event.preventDefault();

	globalObj.reset();
	
	//  Show Feed
	// $('#page1').show();

	// Banner Effects
	// $('#banner').css('height','40vh');
	// $('#banner').animate({'height': '40vh'}, 1000);

	// Scroll to Top Button
	// var bannerHeight = $('#banner').height();
	// console.log('bannerHeight',bannerHeight);
	// $('#scroll-to-top').show();
});

// Pagination Events
$('.pagination > li > a').on('click',function(event){
	event.preventDefault();

	// Get current page number
	var currentPageEl = $('.pagination').find('.active');
	var currentPage = parseInt( currentPageEl.text() );

	// Remove "active" class from current page
	currentPageEl.removeClass('active');

	// Get target page
	var targetPageEl = $(this).parent('li');
	var targetPage = parseInt( targetPageEl.text() );

	// Add "active" class to target page
	targetPageEl.addClass('active');

	// Set page in global variable, which will be used by pagination();
	globalObj.page = targetPage;

	// Print target page
	g.pagination();
})

$('#scroll-to-top').on('click',function(event){
	event.preventDefault();
	$(window).scrollTop(0);
})
