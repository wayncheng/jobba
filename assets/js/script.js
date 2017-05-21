$('.toggle-fold').on('click',function(event){
	event.preventDefault();

	var $t = $(this);
	$t.next('.below-fold').toggleClass('fold-hide');
})