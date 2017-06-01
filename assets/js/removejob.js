
	$("#saved-jobs-modal").on("click", ".remove-btn", function() {
		var jobKey = $(this).parent().parent().attr('id');
			console.log("helloooo:"+jobKey);
			console.log("is user still on??"+userId);
			database.ref("/"+userId+"/jobs/"+jobKey).remove();

	});

