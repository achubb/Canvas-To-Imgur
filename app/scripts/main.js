/* jshint devel:true */

/* Imgur Keys */
/* Client id = d2d39ade652407b */
/* Client Secret = d85be53bf98b900833a7d3d3a52a87f8c7da2442 */

(function ($, window, document, undefined) {

  'use strict';

  // var image64 = 'OOOOOOOOOO';

  // Converts an img to a base64 format

  function convertImgToBase64(url, callback, outputFormat){
		var img = new Image();

		img.crossOrigin = 'Anonymous';
		img.onload = function(){
		  var canvas = document.createElement('CANVAS');
		  var ctx = canvas.getContext('2d');
			canvas.height = this.height;
			canvas.width = this.width;
		 	ctx.drawImage(this,0,0);
		  var dataURL = canvas.toDataURL(outputFormat || 'image/png');
		  callback(dataURL);
		  canvas = null; 
		};
		img.src = url;
	}

	/*
  |--------------------------------------------------------------------------
  | Image Draw 
  |--------------------------------------------------------------------------
  |
  | Pass in the url of the image to draw on the canvas and the ID of the 
  | canvas element to draw it to. 
  |
  */

	function imageDraw(im,cv){
		var imageUrl = im;
		var canvasId = cv;
		var image64;

		// Prepare the images base64 format

		function prepareImg(imageToDraw){
			var deferredObject = $.Deferred();

			convertImgToBase64(imageToDraw, function(base64Img){
				image64 = base64Img.substring(base64Img.indexOf(",") + 1);
				deferredObject.resolve();
			});

			return deferredObject.promise();
		}

		// Draw a base64 image to a canvas element

		function drawImageToCanvas(element){
			var id = element.id;
			var canvas = document.getElementById(id);
			var ctx = canvas.getContext("2d");
			var image = new Image();

			image.onload = function() {
	    	ctx.drawImage(image, 0, 0);
			};
			image.src = "data:image/  png;base64," + image64;
		}

		var prepImage = prepareImg(imageUrl);

		prepImage.done(function () {
   	 	drawImageToCanvas(cv);
		});

	}

	// Post to imgur

	function sendToImgur(element){
		var id = element.id;

		try {
    	var img = document.getElementById(id).toDataURL('image/png', 0.9).split(',')[1];
		} catch(e) {
    	var img = document.getElementById(id).toDataURL().split(',')[1];
		}

		$.ajax({
    	url: 'https://api.imgur.com/3/image',
    	type: 'post',
    	headers: {
        Authorization: 'Client-ID d2d39ade652407b'
    	},
    	data: {
        image: img
    	},
    	dataType: 'json',
    	success: function(response) {
        if(response.success) {
            console.log(response.data.link);
        }
    	}
		});
	}


  $(function () {
    
  	var imageUrl = "/images/dinosaur.png";

		$('.btn--draw').on('click', function(){
			imageDraw(imageUrl,myCanvas); 
		});

		$('.btn--up').on('click', function(){
			sendToImgur(myCanvas);
		});

  });

})(jQuery, window, document);
