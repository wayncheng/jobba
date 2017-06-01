
	$("#saved-jobs-modal").on("click", ".remove-btn", function() {
		var jobKey = $(this).parent().parent().attr('id');
			database.ref("/"+userId+"/jobs/"+jobKey).remove();

	});

