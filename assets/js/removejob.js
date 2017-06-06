
	$("#saved-jobs-modal").on("click", ".remove-btn", function() {
		var jobKey = $(this).parent().parent().attr('id');
			database.ref("/"+userId+"/jobs/"+jobKey).remove();
		var feedSel = '#feed [data-source-id="'+jobKey+'"]';
		var saveWrap = $(feedSel).find('.save-wrap');
			saveWrap.removeClass('saved');
			saveWrap.attr('data-saved','true');
			


		console.log("The key of job is?" +jobKey);

	});

