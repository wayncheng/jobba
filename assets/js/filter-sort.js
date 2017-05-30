

// $('#filter-source').on('click','.filterSourceInput',function(event){
// $('.filterSourceInput').on('click',function(event){
$('#filter-source').on('click',function(event){
	// event.preventDefault();
	var $t = $(this);

	$t.find('input')
	// var report = {
	// 	'github': 'checked',
	// 	'indeed': 'checked',
	// 	'dice': 'checked',
	// 	'authenticJobs': 'checked',
	// }
	var inputFieldEl = $(this).find('.input-field');

	inputFieldEl.each(function(){
		var inputEl = $(this).find('input')
		// var dataChecked = inputEl.attr('checked');
		// var dataRep = inputEl.attr('data-rep');
		var isChecked = inputEl.checked;
		var dataRep = inputEl.attr('value');
		var report = {};
		report[dataRep] = isChecked;

		console.log('report',report);
	});

	


})

$('.filterSourceInput').on('click',function(event){
	event.preventDefault();
	console.log('filterSourceInput clicked');
	console.log('$(this)',$(this));
})
