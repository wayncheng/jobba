$(document).ready(function(){
	var form = document.getElementById('file-form');
	var fileSelect = document.getElementById('file-select');
	var uploadButton = document.getElementById('upload-button');
	var formData ="";
	var rText = "";
	var fileContent = "";
	PDFJS.workerSrc = 'assets/js/pdf.worker.js';
	var pdfText = "";

	$("#upload-button").on("click",function(evt){
		
		      evt.preventDefault();
		      $("#upload-button").html("Uploading...");
			  $("#grade,#advice,#error").empty();
		      $(".progress").show();
			  $("#result").addClass("previewMessage resume-result");

  				var files = fileSelect.files;

  				//If No file selected then check the textarea and call API
  				if(files.length === 0){
					console.log("files.length == 0",document.getElementById('resumeText'));
					if(document.getElementById('resumeText')){
						rText = document.getElementById('resumeText').value;
						fileContent = rText;
						console.log('resumeText:'+rText);
						ajaxCall(rText);
					}
					
				}
  				else if(files.length){
  					console.log("Before processing file...")
  					var sFileExtension = files[0].name.split(".")[files[0].name.split(".").length-1];
  					console.log("EXTENSION ==== ",sFileExtension);
  					if(sFileExtension === "pdf"){
  						console.log("Found PDF File");
						convertPdfToText(URL.createObjectURL($("#file-select").get(0).files[0]));
						return;
  					}
  					//Commenting the code for file extension doc, as it is not working in right manner..
  				// 	if(sFileExtension === "doc"){
  				// 		var fr = new FileReader(); // FileReader instance
					 //  	fr.readAsText(files[0],"UTF-8");
						// fr.onload = function () {
						// 	fileContent = fr.result;
						// 	ajaxCall(fileContent);
						// };
						// return;
  				// 	}
  					if(sFileExtension === "txt"){
  						console.log("Found TXT File");
  						var fr = new FileReader(); // FileReader instance
					  	fr.readAsText( files[0] );
						fr.onload = function () {
							fileContent = fr.result;
							ajaxCall(fileContent);
						};
						fr.onerror = function(){
							console.log("ERROR OCCURRED ==",fr.error);
							$(".progress").hide();
							$("#error").text("File Not Uploaded.");
							$("#upload-button").html("Submit");
						};
  					}
  					else{

  						//generate error that File not Supported
  						console.log("Error occurred while getting file.");
						$(".progress").hide();
						$("#upload-button").html("Submit");
  						$("#error").text("File Extension Not Supported.");
  					}
  				}
  				else{
  					//validation on file input and text area
  					if(handleFileSelect(fileSelect,rText) === 0){
						$(".progress").hide();
						$("#upload-button").html("Submit");
			  			return;
			  		} 
  				}

		});


	function ajaxCall(fileContent){
			var encodedFileContent = encodeURIComponent(fileContent);
			console.log("Going to call rezscore api... ");
			
			$.ajax({
				type:'POST',
				url: 'https://cors-anywhere.herokuapp.com/https://rezscore.com/a/9a65ac/grade.xml',
				async: true,
				data: {
            			resume: fileContent
        				},
					
			}).done(function(response){
				console.log("Done & Received Response.");
				//Catches any 300 errors.
				xmlDoc = $.parseXML( response );
				var errorCode = $( xmlDoc ).find("error_description");

				if(errorCode.text()){
					$(".progress").hide();
					$("#error").html(errorCode.text());
		      		$("#upload-button").html("Submit");

				}
				else{
				//Xml response is converted to json
				var jsonResponse = JSON.parse(JSON.stringify(xml2json(response)));

				 $(".progress").hide();
				 if(jsonResponse.rezscore.score){
		      		$("#upload-button").html("Submit");
				 	$("#grade").html(jsonResponse.rezscore.score.grade);
				 	var tips = jsonResponse.rezscore.advice.tip;
				 	if(tips.length > 0){
					 	for(var j=0; j<tips.length; j++){
					 		$("#advice").append(tips[j].long);
					 		$("#advice").removeClass("small-advice");
					 		$("#advice").addClass("large-advice");
					 	}
					 }else{
					 		$("#advice").append(tips.long);
					 		$("#advice").addClass("small-advice");
					 }

				 } else{
				 	$("#error").text("ERROR OCCURRED");
		      		$("#upload-button").html("Submit");

				 }
				}
			}).fail(function(error){
				//Create a new function to process errors
				console.log('fail', error.code);
				$(".progress").hide();
				$("#error").text("Error ocurred : "+error.code);
		      	$("#upload-button").html("Submit");


				// Change status to fail.
			});
		

		}



		function handleFileSelect(input,rText)
		  {               
		    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
		      $("#error").text("The File APIs are not fully supported in this browser.");
		      return 0;
		    }   

		    // input = document.getElementById('fileinput');
		    if (!input) {
		      $("#error").text("Um, couldn't find the fileinput element.");
		      return 0;

		    }
		    else if (!input.files) {
		      $("#error").text("This browser doesn't seem to support the `files` property of file inputs.");
		      return 0;

		    }
		    else if (!input.files[0] && rText=="") {
		      $("#error").text("Please select a file before clicking 'Load'");
		      return 0;

		    }
		    
		  }
	
		  
		 function convertPdfToText(urlPDF){
		 	pdfText="";
		 	PDFJS.getDocument({url: urlPDF}).then(function (pdf) {
            var pdfDocument = pdf;
            var pagesPromises = [];

            for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
                // Required to prevent that i is always the total of pages
                (function (pageNumber) {
                    pagesPromises.push(getPageText(pageNumber, pdfDocument));
                })(i + 1);
            }

            Promise.all(pagesPromises).then(function (pagesText) {

                // Display text of all the pages in the console
                console.log(pagesText);
                for(var j=0; j<pagesText.length;j++){
                	pdfText = pdfText +pagesText[j];
                }
                console.log("Calling ajax for pdf file...",);
                ajaxCall(pdfText);
            });

            

        }, function (reason) {
            // PDF loading error
            console.error(reason);
        });

		 	/**
         * Retrieves the text of a specif page within a PDF Document obtained through pdf.js 
         * 
         * @param {Integer} pageNum Specifies the number of the page 
         * @param {PDFDocument} PDFDocumentInstance The PDF document obtained 
         **/
        function getPageText(pageNum, PDFDocumentInstance) {
            // Return a Promise that is solved once the text of the page is retrieven
            return new Promise(function (resolve, reject) {
                PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
                    // The main trick to obtain the text of the PDF page, use the getTextContent method
                    pdfPage.getTextContent().then(function (textContent) {
                        var textItems = textContent.items;
                        var finalString = "";

                        // Concatenate the string of the item to the final string
                        for (var i = 0; i < textItems.length; i++) {
                            var item = textItems[i];

                            finalString += item.str + " ";
                        }

                        // Solve promise with the text retrieven from the page
                        resolve(finalString);
                    });
                });
            });
        }
        

		 }



});

//Converts XML to JSON object.

function xml2json(xml) {
  try {
    var obj = {};
    if (xml.children.length > 0) {
      for (var i = 0; i < xml.children.length; i++) {
        var item = xml.children.item(i);
        var nodeName = item.nodeName;

        if (typeof (obj[nodeName]) == "undefined") {
          obj[nodeName] = xml2json(item);
        } else {
          if (typeof (obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];

            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xml2json(item));
        }
      }
    } else {
      obj = xml.textContent;
    }
    return obj;
  } catch (e) {
      console.log(e.message);
  }
}


        



