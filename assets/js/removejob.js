
	$("#saved-jobs-modal").on("click", ".remove-btn", function() {
		var jobKey = $(this).parent().parent().attr('id');
			database.ref("/users/"+userId+"/jobs/"+jobKey).remove();

			console.log("The key of job is?" +jobKey);

	});

