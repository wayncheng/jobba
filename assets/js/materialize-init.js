$(document).ready(function(){
	// Materialize Inits

	// Initialize header collapse button
	$('#header-side-nav-link').sideNav({
		menuWidth: 300, // Default is 300
		edge: 'left', // Choose the horizontal origin
		closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
		draggable: true // Choose whether you can drag to open on touch screens
	});
	// Initialize filter collapse button
	$('#filter-side-nav-link').sideNav({
		menuWidth: 300, // Default is 300
		edge: 'right', // Choose the horizontal origin
		closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
		draggable: true // Choose whether you can drag to open on touch screens
	});
	// Initialize collapsible (uncomment the line below if you use the dropdown variation)
	$('.collapsible').collapsible();
	$('select').material_select();
// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function() { 
	      // Callback for Modal open. Modal and trigger parameters available.
        console.log('modal open');
      },
      complete: function() { 
      	// Callback for Modal close
      	} 
    });
    
    // $('#salaryAnalysis').modal('open');

	// close side nav when link pressed.
	$('.close-btn').sideNav('hide');

	// Tag Chips
	$('.chips').material_chip();
	
	// Tooltipss
	$('.tooltipped').tooltip({delay:50});
	
	// Date Slider
	// var slider = document.getElementById('date-slider');
	// noUiSlider.create(slider, {
	//     start: [0, 30],
	//     behavior:'tap-drag',
	//     connect: true,
	//     // tooltips: [ wNumb({decimals: 0}), wNumb({decimals: 0}) ],
	//     step: 1,
	//     range: {
	//         'min': 0,
	//         'max': 40
	//     },
	//     format: wNumb({
	//         decimals: 0
	//     })
	// });


});