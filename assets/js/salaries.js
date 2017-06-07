


$(document).ready(function(){


		

$('#submit').on('click',function(event){

	event.preventDefault();


	// var uIP, uBrowser;
	console.log(jobba.userIP);
	console.log(typeof(jobba.userIP));

			var ip = jobba.userIP;
			var searchTerm = $('#search').val().trim();
			var qURL = 'https://cors-anywhere.herokuapp.com/https://api.glassdoor.com/api/api.htm?t.p=151095&t.k=dSWk91gUjq3&userip='+ ip +'&useragent=&format=json&v=1&action=jobs-prog&countryId=1&jobTitle='+searchTerm;
	
			$.ajax({
				type:'GET',
				url: qURL,
			}).done(function(result){
				var r = result.response;
				console.log('Glassdoor done',result);
				jobba.salaryData = r;
				var attribution = r.attributionURL;

				//  Query title
				var jobTitle = r.jobTitle;
				$('.job-position-target').text(jobTitle);


				//  Pay Range Info
						// 114091.81 --> 1140.9181 --> 1141 --> 114.1
				// 	function convertToK(salary){
				// 		var k = Math.round(salary/100)/10;
				// 		return k+'k';
				// 	};
				// var payLow = convertToK(r.payLow);
				// var payMedian = convertToK(r.payMedian);
				// var payHigh = convertToK(r.payHigh);

				var payLow = Math.round(r.payLow/100)/10;
				var payMedian = Math.round(r.payMedian/100)/10;
				var payHigh = Math.round(r.payHigh/100)/10;
				console.log('pays',payLow, payMedian, payHigh);
				$('#pay-low').text(payLow);
				$('#pay-median').text(payMedian);
				$('#pay-high').text(payHigh);

				// Next Job Table
				var nextArr = r.results;
				console.log('nextArr',nextArr);
				var keys = ['frequency','frequencyPercent','medianSalary','nationalJobCount','nextJobTitle'];
				for (var i=0; i<nextArr.length; i++) {
					var io = nextArr[i];
					console.log('io',io);
					var tr = $('<tr>');
						// for each value in each column
						for (var j=0; j < keys.length; j++) {
							// var KEY = keys[i];
							var VAL = io[keys[j]];
							var td = $('<td>');
								td.addClass('col-'+(j));
								td.text(VAL);
							tr.apppend(td);
						};
					// append row to tbody
					$('#nextJobAnalysis tbody').append(tr);
				};


			}).fail(function(){
				jobba.api.ajaxError();
			});
	

	});


	



});


