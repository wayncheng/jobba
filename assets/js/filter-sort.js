

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


// $('.filterSourceInput').on('click',function(event){
// 	event.preventDefault();
// 	console.log('filterSourceInput clicked');
// 	console.log('$(this)',$(this));
// });
