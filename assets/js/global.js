
var g = {

allResults: [],
page: 1,
itemsPerPage: 10,
resultNumber: 1,

apiStatus: 
		{
			github: 'processing',
			authentic: 'processing',
			dice: 'processing',
			indeed: 'processing'
		},

getItemsPerPage: 	
		$('#items-per-page').on('change', function(event){
			event.preventDefault();
			g.itemsPerPage = parseInt( $('#items-per-page').val() );
			g.pagination();
			// Bug! -- Need to return to 1st page
		}),

printManager: 	
		function(jobStr){
			// Push to allResults
			g.allResults.push(jobStr);

			// Once there are enough results to populate 1 page, show feed elements and begin printing
			if( g.allResults.length >= g.itemsPerPage ) {
				// Display the feed elements;
				$('#page1').show();
				
				// Banner Effects
				$('#banner').css('height','40vh');

				// Scroll to Top Button
				$('#scroll-to-top').show();

				// Begin printing
				g.pagination();
			}
		},

paginationHandler: 
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
		}),

pagination: 
		function(){
			// Determine start and end indeces of print range
			var start = (g.page-1) * g.itemsPerPage;
			// var end = (page * itemsPerPage) - 1;
			var end = g.page * g.itemsPerPage;

			// Clear feed
			$('#feed').empty();

			// Loop through listings from start to end in allResults array
			for (var i=start; i<end; i++) {
				// Set current index in global
				g.resultNumber = i+1;
				// Print each listing
				g.print(g.allResults[i]);
			};
		},

print: 	
		function(jobStr){
			// Convert data passed as string back to JSON form
			var jobData = JSON.parse(jobStr);

			// Variables for details to be written
			var title = jobData.title;
			var title = g.resultNumber +'. '+ jobData.title;
			var company = jobData.company;
			var location = jobData.location;
			var date = jobData.date;
			var source = jobData.source;
			var description = jobData.description;

			// Convert date to days ago
			var daysAgo = moment(date,'MMM-DD').fromNow();

			// var metaArray = [location, date, source];
			var metaArray = [
				{ key: "location", value: location},
				{ key: "date", value: daysAgo},
				{ key: "source", value: source}
			];


			var wrap = $('<div>').addClass('listing panel panel-default');
			var body = $('<div>').addClass('panel-body');
			var h2 = $('<h2>').addClass('headline');
			var h3 = $('<h3>').addClass('company');
			
			h2.text(title);
			h3.text('('+ company +')');
			
			var d = $('<p>').addClass('description below-fold fold-hide');
			d.html(description);

			var metaWrap = $('<div>').addClass('meta');
			for (var i=0; i<metaArray.length; i++) {
				var p = $('<p>');
				p.addClass('meta-detail');
				p.addClass(metaArray[i].key);
				p.text(metaArray[i].value);
				metaWrap.append(p);
			};

			// Fold toggle
			var foldToggle = $('<div>').addClass('toggle-fold');
			foldToggle.attr('data-fold','closed');
			// foldToggle.text('View Description');
			foldToggle.on('click',function(event){
				event.preventDefault();
				var $t = $(this);

				// $t.toggleClass('btn-view');

				var dataFold = $t.attr('data-fold');

				if(dataFold === 'closed') {
					$t.attr('data-fold','open');
					// $t.text('Hide Description');
					$(this).siblings('.below-fold').removeClass('fold-hide');
				} 
				else {
					$t.attr('data-fold','closed');
					// $t.text('View Description');
					$(this).siblings('.below-fold').addClass('fold-hide');
				}

			});

			body.append(h2);
			body.append(h3);
			body.append(metaWrap);
			body.append(foldToggle);
			body.append(d);
			wrap.append(body);
			$('#feed').append(wrap);
		},
reset: 
		function(){
			// Reset API Status
			g.apiStatus =  {
				github: 'processing',
				authentic: 'processing',
				dice: 'processing',
				indeed: 'processing'
			};

			// Reset Pagination
				// Remove active class from current page
				$('.pagination').find('.active').removeClass('active');

				// Add active class to 1st page
				$('.pagination li:nth-child(2)').addClass('active');

				// Set page number to 1 in global variable
				globalObj.page = 1;

			// Hide feed
			$('#page1').hide();
		},

scrollToTop: 
		$('#scroll-to-top').on('click',function(event){
			event.preventDefault();
			$(window).scrollTop(0);
		}),

submit: 
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
		})
}

// Bind to Window
window.globalObj = g;