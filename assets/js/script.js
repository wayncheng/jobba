// $('.toggle-fold').on('click',function(event){
// 	event.preventDefault();

// 	var $t = $(this);
// 	$t.next('.below-fold').toggleClass('fold-hide');
// })


$('#submit').on('click', function(event){
	event.preventDefault();

	//  Show Feed
	$('#page1').show();

	// Banner Effects
	$('#banner').css('height','40vh');
	// $('#banner').animate({'height': '40vh'}, 1000);


	// Scroll to Top Button
	// var bannerHeight = $('#banner').height();
	// console.log('bannerHeight',bannerHeight);
	$('#scroll-to-top').show();





});

$('#scroll-to-top').on('click',function(event){
	event.preventDefault();
	$(window).scrollTop(0);
})