// all the functions at the top

// imgur authorization
function setHeader(xhr) {
    xhr.setRequestHeader('Authorization', 'Client-ID 4120f4b7ddae1ea');
}









// this gets URL variables
function getUrlVars(url) {
    var vars = [], hash;
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}









// this function gets an imgur album image
function getAlbumImage(api, target){

	$.ajax({
      url: api,
      type: 'GET',
      dataType: 'json',
      success: function(data) {

      	$(target).find('.preview-replace, .preview-album').replaceWith("<div data-album='" + api + "' class='preview preview-album' style='background-image:url(" + data.data[0].link + ")'></div>");

      },
      error: function(request, status, message) {
      	console.log(message);
      },
      beforeSend: setHeader
    });

}










function getEntireAlbum(api){

	$.ajax({
      url: api,
      type: 'GET',
      dataType: 'json',
      success: function(data) {

        console.log(data);

      	for( i = 0; i < data.data.length; i++ ){

      		captionTitle = data.data[i].title;
      		captionDescription = data.data[i].description;

      		if( captionTitle != null){
      			captionTitle = captionTitle.replace('"',"'");
      		}

      		if( captionDescription != null){
      			captionDescription = captionDescription.replace('"',"'");
      		}

      		$('.album-thumbnails').append('<img data-title="' + captionTitle + '" data-description="' + captionDescription + '" data-image="' + data.data[i].link + '" src="//i.imgur.com/' + data.data[i].id + 't.jpg" />');

      	}

      	$('.album-thumbnails').find("img").first().addClass("active-thumb");

      	$('.large-album').css("background-image", "url(" + data.data[0].link + ")" );

      	$('.shine-expand .large-album').zoom({url: data.data[0].link, on: 'click'});

      	$('.album-captions').html("");

      	if( data.data[0].title != null || data.data[0].description != null ){

      		$('.album-captions').html('<div class="show-captions"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-291 389 20 16" style="enable-background:new -291 389 20 16;" xml:space="preserve"><path d="M-273,389h-16c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2v-12C-271,389.9-271.9,389-273,389z M-289,397h4v2h-4V397z M-279,403h-10v-2h10V403z M-273,403h-4v-2h4V403z M-273,399h-10v-2h10V399z"/></svg></div><div class="caption-text"><strong></strong><p></p></div>');

      		if( data.data[0].title != null ){
      			$('.caption-text strong').html(data.data[0].title);
      		}

      		if( data.data[0].description != null ){
      			$('.caption-text p').html(data.data[0].description);
      		}

      	}

		$('html').addClass("expanding expand-albums");

      },
      error: function(request, status, message) {
      	console.log(message);
      },
      beforeSend: setHeader
    });

}










// this gets our vimeo thumbnail
function getVimeoThumbnail(vidID, target){

	$.ajax({
      url: '//vimeo.com/api/v2/video/' + vidID + '.json',
      type: 'GET',
      dataType: 'jsonp',
      success: function(data) {

        var vimeoThumb = data[0].thumbnail_large;

		    $(target).find('.preview-replace').replaceWith("<div class='preview preview-vimeo' data-video='//player.vimeo.com/video/" + vidID + "?autoplay=1' style='background-image:url(" + vimeoThumb + ")' ></div>");

      },
      error: function(request, status, message) {
      	console.log(message);
      },
      beforeSend: setHeader
    });

}


// this gets our clips.twitch.tv thumbnail
function getTwitchThumbnail(vidID, target){

  $.ajax({
      url: '//api.twitch.tv/kraken/clips/' + vidID,
      type: 'GET',
      headers: {
       'Client-ID': 'wtf8dir4p97yu2eopunfrukdhs7myx',
       'Accept': 'application/vnd.twitchtv.v5+json'
      },
      success: function(data) {

        var twitchThumb = data.thumbnails.medium;

        $(target).find('.preview-replace').replaceWith("<div class='preview preview-youtube' data-video='//clips.twitch.tv/embed?clip=" + vidID +"&autoplay=true' style='background-image:url(" + twitchThumb + ")'></div>");

      },
      error: function(request, status, message) {
        console.log(message);
      }
    });

}



// this gets what type of image we're dealing with
function getImageFromServer(path, id, target){
    var xhr = new XMLHttpRequest();
    xhr.path = path;
    xhr.open("GET",path,true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function(e){

        if(this.status == 200){

            var imageType = getImageType(this.response);

			if( imageType == "image/gif" ){


				$(target).find('.preview-replace').replaceWith("<div data-video='//i.imgur.com/" + id + ".mp4' class='preview preview-gifv' style='background-image:url(//i.imgur.com/" + id + "h.jpg)'></div>");


			}else{


				$(target).find('.preview-replace').replaceWith("<div data-url='//i.imgur.com/" + id + ".png' class='preview preview-image' style='background-image:url(//i.imgur.com/" + id + ".png)'></div>");

			}

		}
        else{
            console.log("Problem retrieving image " + JSON.stringify(e))
        }
    }
    xhr.send();
}

function getCommentImageFromServer(path, id, target){
    var xhr = new XMLHttpRequest();
    xhr.path = path;
    xhr.open("GET",path,true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function(e){

        if(this.status == 200){

            var imageType = getImageType(this.response);

			if( imageType == "image/gif" ){

				$(target).addClass("shine-comment comment-html5");

				$(target).attr("data-video", "//i.imgur.com/" + id + ".mp4");

			}else{

				$(target).addClass("shine-comment comment-image");

				$(target).attr("data-image", "//i.imgur.com/" + id + ".png");

			}

		}
        else{
            console.log("Problem retrieving image " + JSON.stringify(e))
        }
    }
    xhr.send();
}

function getImageType(arrayBuffer){
    var type = "";
    var dv = new DataView(arrayBuffer,0,5);
    var nume1 = dv.getUint8(0,true);
    var nume2 = dv.getUint8(1,true);
    var hex = nume1.toString(16) + nume2.toString(16) ;
    switch(hex){
        case "8950":
            type = "image/png";
            break;
        case "4749":
            type = "image/gif";
            break;
        case "424d":
            type = "image/bmp";
            break;
        case "ffd8":
            type = "image/jpeg";
            break;
        default:
            type = null;
            break;
    }
    return type;
}









// this gets the ireddit picture url
function getireddit(url, target){
    
    $(target).find('.preview-replace').load(url + " img.preview", function() {
        
        iredditUrl = $(this).find('img.preview').attr("src");
                
        $(this).replaceWith("<div data-url='" + iredditUrl + "' class='preview preview-image' style='background-image:url(" + iredditUrl + ")'></div>");

    });
    
}









// this converts a regular old gif into a gfycat image
function convertGiftoGfy(target, url){

	$.ajax({
      url: '//upload.gfycat.com/transcode?fetchUrl=' + url,
      type: 'GET',
      dataType: 'json',
      success: function(data) {

	     gfyID = data.gfyname;

	     if( data.gfyname != undefined ){

	     	$(target).find('.preview-replace').replaceWith("<div data-url='" + gfyID + "' class='preview preview-gfycat' style='background-image:url(//thumbs.gfycat.com/" + gfyID + "-poster.jpg)'></div>");

	     }

	  },
      error: function(request, status, message) {
      	console.log(message);
      }
    });

}

function getCommentGfyCatURL(url, target){

	$.ajax({
      url: '//upload.gfycat.com/transcode?fetchUrl=' + url,
      type: 'GET',
      dataType: 'json',
      success: function(data) {

	     gfyID = data.gfyname;

	     if( data.gfyname != undefined ){

	     	$(target).attr("data-video", gfyID );

	     	$(target).addClass("shine-comment comment-gfycat");

	     }

	  },
      error: function(request, status, message) {
      	console.log(message);
      }
    });

}














function getRedditText(url, content, target){

	$.ajax({
		url:url,
		type:'GET',
		success: function(data){

			if( $(data).find(content).html() != undefined ){

				$(target).find('.preview-replace').replaceWith("<div class='preview preview-text'>" + $(data).find(content).html() + "</div>");

				$(target).find('.preview-text a').attr("target","_blank");

			}else{

				$(target).find('.preview-replace').remove();
				$(target).addClass("nopreview");

			}

		}
	});

}

function getvreddit(url, target){

  $.ajax({
    url:url,
    type:'GET',
    success: function(data){

      if( $(data).filter('meta[property="og:image"]') != undefined  ){

        $(target).find('.preview-replace').replaceWith("<div style='background-image:url(" + $(data).filter('meta[property="og:image"]').attr("content") + ")' class='preview preview-vreddit' data-video='" + $(data).find('a.thumbnail').attr('href') +"' />");

        //$(target).find('.preview-text a').attr("target","_blank");

      }else{

        $(target).find('.preview-replace').remove();
        $(target).addClass("nopreview");

      }

    }
  });

}














function getWikiContent(articleTitle, target){

	$.ajax({
      url: '//en.wikipedia.org/w/api.php?action=parse&format=json&page=' + articleTitle,
      type: 'GET',
      dataType: 'jsonp',
      success: function(data) {

      	$(target).find('.preview-replace').append("<div class='wiki-content' style='display:none;'></div>");

      	$(target).find('.wiki-content').html(data.parse.text["*"]);

      	wikiImage = $(target).find('.wiki-content img');

      	for( i = 0; i < wikiImage.length; i++ ){

      		if( $(wikiImage[i]).width() > 50 ){

      			$(target).find('.preview-replace').replaceWith("<div class='preview preview-wikipedia' style='background-image:url(" + $(wikiImage[i]).attr("src") + ")'></div>");

      			return;

      		}

      		if( i = wikiImage.length - 1 ){

      			$(target).find('.preview-replace').remove();
      			$(target).addClass("nopreview");

      		}

      	}

      	$(target).find('.preview-replace').remove();
      	$(target).addClass("nopreview");

      },
      error: function(request, status, message) {
      	console.log(message);
      },
      beforeSend: setHeader
    });

}










// getting the Sound Cloud embed
function getSoundCloudContent(soundCloudURL, target){

	$.ajax({
      url: '//api.soundcloud.com/resolve.json?url=' + soundCloudURL + '&client_id=343c40e7fa565f9d2b89820a05bb3a8f',
      type: 'GET',
      dataType: 'jsonp',
      success: function(data) {

          embedID = "";

          $.each(data, function(index, element) {

            if(index == "id"){

                    embedID = element;

                }

            });

            if(soundCloudURL.toLowerCase().indexOf("in=") != -1){

            	$(target).find('.preview-replace').replaceWith("<div class='preview preview-soundcloud'><iframe scrolling='no' frameborder='no' src='https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + embedID + "&amp;auto_play=false&amp;hide_related=false&amp;visual=true'></iframe></div>");

            }
            else if(soundCloudURL.toLowerCase().indexOf("sets") != -1){

            	$(target).find('.preview-replace').replaceWith("<div class='preview preview-soundcloud'><iframe scrolling='no' frameborder='no' src='https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/" + embedID +  "&amp;auto_play=false&amp;hide_related=false&amp;visual=true'></iframe></div>");

            }
            else{

            	$(target).find('.preview-replace').replaceWith("<div class='preview preview-soundcloud'><iframe scrolling='no' frameborder='no' src='https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + embedID + "&amp;auto_play=false&amp;hide_related=false&amp;visual=true'></iframe></div>");

            }

     },
     error: function(request, status, message) {
      	console.log(message);
      },
      beforeSend: setHeader
    });

}

















function getYouTubeTimeStamp(timeStamp){

    if(timeStamp != undefined){

        timeStamp = timeStamp.replace("s", "");
        timeStamp = timeStamp.replace("S", "");

        // if there are minutes
        if ( timeStamp.toLowerCase().indexOf("m") != -1 ){

            timeStamp = timeStamp.split("m");

            if(timeStamp[1]){
                timeStamp = parseInt((timeStamp[0] * 60)) + parseInt(timeStamp[1]);
            }else{
                timeStamp = parseInt((timeStamp[0] * 60));
            }

        }

    }else{
        timeStamp = "0";
    }

    return timeStamp;

}










function getGalleryImage(api, target){

	$.ajax({
      url: api,
      type: 'GET',
      dataType: 'json',
      success: function(data) {

          if( data.data.images.length > 1 ){

                albumAPI = "https://api.imgur.com/3/album/" + data.data.id + "/images";

                $(target).find('.preview-replace').replaceWith("<div data-album='" + albumAPI + "' class='preview preview-album' style='background-image:url(" + data.data.images[0].link + ")'></div>");

          }else{

                getImageFromServer( data.data.images[0].link , data.data.images[0].id , target);

          }

      },
      error: function(request, status, message) {
      	console.log(message);
      },
      beforeSend: setHeader
    });

}


















// ADDING SHINE HTML TO OUR INTERFACE

$('body').append(''+

	'<div class="shine-expand">'+
		'<div class="large-image"></div>'+
		'<div class="large-youtube"></div>'+
		'<div class="large-html5"></div>'+
		'<div class="large-album"></div>'+
		'<div class="album-thumbnails"></div>'+
		'<div class="album-captions"></div>'+
		'<div class="side-comments"></div>'+
		'<div class="toggle-child-comments">Child Comments</div>'+
	'</div>'

);

























// this javascript runs on the SHINE grid interface

function createPreviews(theThings){

	for( i = 0; i < theThings.length; i++ ){




		// setting up variables

		url = $(theThings[i]).find('a.title').attr("href").replace(".httml","");
		extension = url.substr(url.lastIndexOf('.')+1);

		// figuring out where to place our preview
		whereToPlace = '.entry';
		if( $(theThings[i]).find('.top-matter').length ){
			whereToPlace = '.top-matter';
		}


		// global changes to every card
   		if( $(theThings[i]).find('ul.flat-list a.comments').html() != undefined ){

		    $(theThings[i]).find('ul.flat-list a.comments').html( $(theThings[i]).find('ul.flat-list a.comments').html().replace(/\D/g,'') );

   	 	}

		$(theThings[i]).find('ul.flat-list a.comments').attr("target","_blank");
		$(theThings[i]).find('a.title').attr("target","_blank");







		// creating previews time






		// IMGUR
		if( url.toLowerCase().indexOf("imgur.com") != -1 && url.toLowerCase().indexOf("gifsound.com") == -1){

			url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH

			if( url.toLowerCase().indexOf("/a/") != -1){

				// we got an album
				albumID = url.substr(url.toLowerCase().indexOf("/a/") + 3);
				albumID = albumID.split(/[?#]/)[0];

				albumAPI = "https://api.imgur.com/3/album/" + albumID + "/images";

				$(theThings[i]).find(whereToPlace).append("<div class='preview preview-replace'></div>");

				getAlbumImage(albumAPI, ".id-" + $(theThings[i]).attr("data-fullname"));

			}else if( url.toLowerCase().indexOf("/r/") != -1 ){

				// we got a subreddit image
				$(theThings[i]).addClass("nopreview");


			}else if( url.toLowerCase().indexOf("/gallery/") != -1 ){





                // this is a gallery
                galleryID = url.substr(url.toLowerCase().indexOf("/gallery/") + 9);
				galleryID = galleryID.split(/[?#]/)[0];

				galleryAPI = "https://api.imgur.com/3/gallery/album/" + galleryID;

				$(theThings[i]).find(whereToPlace).append("<div class='preview preview-replace'></div>");

				getGalleryImage(galleryAPI, ".id-" + $(theThings[i]).attr("data-fullname"));






			}else if( url.toLowerCase().indexOf(".gifv") != -1 ){

				// we have a gifv
				html5 = url.substr(url.toLowerCase().indexOf("imgur.com/") + 10);
				html5 = html5.substring(0, html5.length - 5);

				$(theThings[i]).find(whereToPlace).append("<div data-video='//i.imgur.com/" + html5  + ".mp4' class='preview preview-gifv' style='background-image:url(//i.imgur.com/" + html5 + "h.jpg)'></div>");

			}else if( url.toLowerCase().indexOf(".gif") != -1 ){

				// we have a gif we're going to turn into a gifv
				html5 = url.substr(url.toLowerCase().indexOf("imgur.com/") + 10);
				html5 = html5.substring(0, html5.length - 4);

				$(theThings[i]).find(whereToPlace).append("<div data-video='//i.imgur.com/" + html5  + ".mp4' class='preview preview-gifv' style='background-image:url(//i.imgur.com/" + html5 + "h.jpg)'></div>");

			}else{


				// now we gotta figure out what kind of image it is before we know what to do with it

				IMGURID = url.substr(url.toLowerCase().indexOf("imgur.com/") + 10);

				if( IMGURID.indexOf(".tiff") != -1 || IMGURID.indexOf(".jpeg") != -1 ){

					IMGURID = IMGURID.substring(0, IMGURID.length - 5);

				}
				else if( IMGURID.indexOf(".png") != -1 || IMGURID.indexOf(".jpg") != -1 || IMGURID.indexOf(".tif") != -1){

					IMGURID = IMGURID.substring(0, IMGURID.length - 4);

				}

				$(theThings[i]).find(whereToPlace).append("<div class='preview preview-replace'></div>");

				getImageFromServer("https://i.imgur.com/" + IMGURID + ".png", IMGURID, ".id-" + $(theThings[i]).attr("data-fullname") );

			}


		}








		// REGULAR OLD GIFS CONVERTED TO GFYCAT
		else if( url.toLowerCase().indexOf(".gif") != -1 && url.toLowerCase().indexOf(".gifv") == -1 && url.toLowerCase().indexOf("/r/") == -1 ){


			url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH

			$(theThings[i]).find(whereToPlace).append("<div class='preview preview-replace'></div>");

			convertGiftoGfy( ".id-" + $(theThings[i]).attr("data-fullname"), url );


		}







		// ANY OTHER PICTURE
		else if( url.toLowerCase().indexOf(".png") != -1 || url.toLowerCase().indexOf(".jpg") != -1 || url.toLowerCase().indexOf(".jpeg") != -1 || url.toLowerCase().indexOf(".tif") != -1 || url.toLowerCase().indexOf(".tiff") != -1){

			// this is any other image

			url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH

			$(theThings[i]).find(whereToPlace).append("<div data-url='" + url + "' class='preview preview-image' style='background-image:url(" + url + ")'></div>");

		}








        // REDDIT UPLOADS
        else if( url.toLowerCase().indexOf("reddituploads.com") != -1){

			$(theThings[i]).find(whereToPlace).append("<div data-url='" + url + "' class='preview preview-image' style='background-image:url(" + url + ")'></div>");

		}










		// LIVEMEME
		else if( url.toLowerCase().indexOf("livememe.com") != -1){

			url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH

			liveMemeURL = url;
			if( liveMemeURL.slice(-1) == "/" ){
				liveMemeURL = liveMemeURL.substring(0, liveMemeURL.length - 1);
			}

			$(theThings[i]).find(whereToPlace).append("<div data-url='" + liveMemeURL + "' class='preview preview-image' style='background-image:url(" + liveMemeURL + ".jpg)'></div>");

		}







		//YOUTUBE
		else if( url.toLowerCase().indexOf("youtube.com") != -1 && url.toLowerCase().indexOf("/r/youtube") == -1 ){

            if( url.toLowerCase().indexOf("attribution") != -1){

                vidID = getUrlVars(url)["u"];
                vidID = decodeURIComponent(vidID);
                vidID = getUrlVars(vidID)["v"];

                timeStamp = getUrlVars(url)["t"];
                timeStamp = getYouTubeTimeStamp(timeStamp);

                $(theThings[i]).find(whereToPlace).append("<div style='background-image:url(//img.youtube.com/vi/" + vidID + "/0.jpg)' class='preview preview-youtube' data-video='//www.youtube.com/embed/" + vidID + "?rel=0&autoplay=1&vq=hd1080&wmode=transparent&start=" + timeStamp + "'></div>");


            }
            else{

                vidID = getUrlVars(url)["v"];

                timeStamp = getUrlVars(url)["t"];
                timeStamp = getYouTubeTimeStamp(timeStamp);

                $(theThings[i]).find(whereToPlace).append("<div style='background-image:url(//img.youtube.com/vi/" + vidID + "/0.jpg)' class='preview preview-youtube' data-video='//www.youtube.com/embed/" + vidID + "?rel=0&autoplay=1&vq=hd1080&wmode=transparent&start=" + timeStamp + "'></div>");

            }

		}



    //STREAMABLE INTEGRATION BY u/itzblitz94
    else if(url.toLowerCase().indexOf("streamable.com") != -1){
      url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH
      url = decodeURIComponent(url);
      shortcode = url.substr(url.toLowerCase().indexOf("streamable.com/") + 15);

      $(theThings[i]).find(whereToPlace).append("<div style='background-image:url(//cdn-e2.streamable.com/image/"+ shortcode +".jpg)' class='preview preview-youtube' data-video='https://streamable.com/s/" + shortcode + "'></div>");
    }


    //CLIPS.TWITCH.TV INTEGRATION
    else if( url.toLowerCase().indexOf("clips.twitch.tv") != -1 ){
          vidID = url.substr(url.toLowerCase().indexOf("clips.twitch.tv/") + 16);

          $(theThings[i]).find(whereToPlace).append("<div class='preview preview-replace'></div>");

          getTwitchThumbnail(vidID,  ".id-" + $(theThings[i]).attr("data-fullname"));

          //$(theThings[i]).find(whereToPlace).append('<div class="preview preview-youtube" data-video="https://clips.twitch.tv/embed?clip=' + vidID + '&autoplay=true"></div>');
    }


    //v.redd.it
    else if( $(theThings[i]).find('span.domain a').html() == "v.redd.it" ){
      url = $(theThings[i]).find('a.comments').attr("href");
      url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH

      $(theThings[i]).find(whereToPlace).append("<div class='preview preview-replace'></div>");

      getvreddit(url, ".id-" + $(theThings[i]).attr("data-fullname") );

      //$(theThings[i]).find(whereToPlace).append("<div style='background-image:url("+ thumbVReddit +")' class='preview preview-youtube' data-video=''></div>");
    }



		//YOUTUBE SHARE
		else if( url.toLowerCase().indexOf("youtu.be") != -1 ){


			vidID = url.substr(url.toLowerCase().indexOf("youtu.be/") + 9);
            vidID = vidID.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH

            timeStamp = getUrlVars(url)["t"];
            timeStamp = getYouTubeTimeStamp(timeStamp);

            $(theThings[i]).find(whereToPlace).append("<div style='background-image:url(//img.youtube.com/vi/" + vidID + "/0.jpg)' class='preview preview-youtube' data-video='//www.youtube.com/embed/" + vidID + "?rel=0&autoplay=1&vq=hd1080&wmode=transparent&start=" + timeStamp + "'></div>");


		}









		// VIMEO
		else if( url.toLowerCase().indexOf("vimeo.com") != -1 && url.toLowerCase().indexOf("/r/vimeo") == -1 ){

			url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH

			vidID = url.substr(url.toLowerCase().indexOf("vimeo.com/") + 10);

			$(theThings[i]).find(whereToPlace).append("<div class='preview preview-replace'></div>");

            getVimeoThumbnail(vidID,  ".id-" + $(theThings[i]).attr("data-fullname"));

		}

        
        
        
        // i.reddit.com uploads
        else if( $(theThings[i]).find('span.domain a').html() == "i.redd.it" ){
            
            url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH
            
            $(theThings[i]).find(whereToPlace).append("<div class='preview preview-replace'></div>");
            
            getireddit( url, ".id-" + $(theThings[i]).attr("data-fullname") );
            
        }







		//SELF POST POST
		else if( url.toLowerCase().indexOf("/r/") != -1 && url.toLowerCase().indexOf("comments") != -1 && url.toLowerCase().indexOf("reddit.com") == -1 && url.toLowerCase().indexOf("np.reddit") == -1){

			url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH

			$(theThings[i]).find(whereToPlace).append("<div class='preview preview-replace'></div>");

			getRedditText(url, ".sitetable.linklisting .usertext-body .md", ".id-" + $(theThings[i]).attr("data-fullname") );

		}









		//REDDIT COMMENT
        else if( url.toLowerCase().indexOf("reddit.com/r/") != -1 && url.toLowerCase().indexOf("comments") != -1 && url.toLowerCase().indexOf("np.reddit") == -1){

	        url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH

	        $(theThings[i]).find(whereToPlace).append("<div class='preview preview-replace'></div>");

	        getRedditText(url, ".usertext.border .md", ".id-" + $(theThings[i]).attr("data-fullname") );

		}








		//WIKIPEDIA
		else if( url.toLowerCase().indexOf("wikipedia.com") != -1 || url.toLowerCase().indexOf("wikipedia.org") != -1 ){

			url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH

			wikiTitle = url.substr(url.search(/wikipedia/i) + 19);

			$(theThings[i]).find(whereToPlace).append("<div class='preview preview-replace'></div>");

			getWikiContent(wikiTitle, ".id-" + $(theThings[i]).attr("data-fullname"));

		}







		//SOUNDCLOUD
        else if( url.toLowerCase().indexOf("soundcloud.com") != -1 ){

	        url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH

            $(theThings[i]).find(whereToPlace).append("<div class='preview preview-replace'></div>");

            getSoundCloudContent( url,  ".id-" + $(theThings[i]).attr("data-fullname") );

        }








		//GFYCAT
        else if( url.toLowerCase().indexOf("gfycat.com") != -1 ){

	        url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH

	        gfyID = url.substr(url.toLowerCase().indexOf("gfycat.com/") + 11);

	        if( gfyID.indexOf(".webm") != -1 || gfyID.indexOf(".gifv") != -1 ){
		        gfyID = gfyID.substring(0, gfyID.length - 5);
	        }else if ( gfyID.indexOf(".ogg") != -1 || gfyID.indexOf(".ogv") != -1 || gfyID.indexOf(".mp4") != -1){
	        	gfyID = gfyID.substring(0, gfyID.length - 4);
	        }

			       $(theThings[i]).find(whereToPlace).append("<div style='background-image:url(//thumbs.gfycat.com/" + gfyID + "-poster.jpg)' class='preview preview-gfycat' data-url='" + gfyID + "'></div>");

        }









		// IF NO PREVIEW
		else{

			$(theThings[i]).addClass("nopreview");

		}





		$(theThings[i]).addClass("shined");

	}

	$('html').addClass("shine-ready");

}

createPreviews( $('body > .content #siteTable .thing') );


















// when RES loads new things, run our JS on them

if( $('body').hasClass('res') ){

	window.addEventListener("neverEndingLoad", function() {

		createPreviews( $('body > .content .sitetable.linklisting .thing').not(".shined") );

		setTimeout("jQuery('#siteTable > .sitetable.linklisting .thing').first().unwrap()", 1);

	}, false);

}else{


	loading = false;

	//SCROLLING FUNCTIONS
    $(window).scroll(function(){

        if( $(window).scrollTop() + $(window).height() >= $('body').height() - 1000 && loading == false ){

            loading = true;

            lastThing = $('body > .content #siteTable > .thing').last().attr('data-fullname');

            subReddit = window.location.href.split(/[?#]/)[0];

        	$.ajax({
		      url: subReddit + "?count=25&after=" + lastThing,
		      cache: false,
		      success: function(data) {

			     window.location.hash = "shiny=" + lastThing;

			     $('body > .content #siteTable').append( $(data).find('#siteTable .thing') );

			     createPreviews( $('body > .content #siteTable .thing').not(".shined") );

			     loading = false;
                     
          if ($('#siteTable').find('.thing').length >= 150) {
            $('#siteTable').find('.thing:lt(25)').remove();
          }

			  },
		      error: function(request, status, message) {
		      	console.log(message);
		      }
		    });

        }

    });


}













var startCheckingComments;


// these are all our actions / click events
function resetInterfaces(){

	clearInterval(startCheckingComments);

	$('html').removeClass("shine-menu");
	$('html').removeClass("expanding");
	$('html').removeClass("expand-images");
	$('html').removeClass("expand-youtubes");
	$('html').removeClass("expand-html5s");
	$('html').removeClass("expand-albums");
	$('html').removeClass("show-search");
	$('html').removeClass("show-submit");
	$('html').removeClass("expand-comments");
	$('html').removeClass("show-shine-bright");
	$('.shine-grid .shine-expand .large-image').html("");
	$('.shine-grid .shine-expand .large-image').css("background-image","");
	$('.shine-grid .shine-expand .large-youtube').html("");
	$('.shine-grid .shine-expand .large-html5').html("");
	$('.shine-grid .shine-expand .large-album').html("");
	$('.shine-grid .shine-expand .album-thumbnails').html("");
	$('.shine-grid .shine-expand .side-comments').html("");
	$('html').removeClass("show-settings");
	$('html').removeClass("shine-hide-children");
    $('.album-captions').html("");

}



function checkSideComments(){

	theSideCommentLinks = $('.side-comments .thing .usertext-body a').not('.shine-comment');

	for( i = 0; i < theSideCommentLinks.length; i++ ){

		$(theSideCommentLinks[i]).attr("target","_blank");

		url = $(theSideCommentLinks[i]).attr("href");

		// it's an imgur link
		if( url.toLowerCase().indexOf("imgur.com") != -1 && url.toLowerCase().indexOf("gifsound.com") == -1 && url.toLowerCase().indexOf("google.com") == -1 ){

			// we have an album
			if( url.toLowerCase().indexOf("/a/") != -1){

				// we got an album
				albumID = url.substr(url.toLowerCase().indexOf("/a/") + 3);
				albumID = albumID.split(/[?#]/)[0];

				$(theSideCommentLinks[i]).attr("data-album", "https://api.imgur.com/3/album/" + albumID + "/images");

				$(theSideCommentLinks[i]).addClass("shine-comment comment-album");

			// we have a gifv
			}else if( url.toLowerCase().indexOf(".gifv") != -1 ){

				// we have a gifv
				html5 = url.substr(url.toLowerCase().indexOf("imgur.com/") + 10);
				html5 = html5.substring(0, html5.length - 5);

				$(theSideCommentLinks[i]).attr("data-video", "//i.imgur.com/" + html5  + ".mp4");

				$(theSideCommentLinks[i]).addClass("shine-comment comment-html5");

			// we have a gif make a gifv
			}else if( url.toLowerCase().indexOf(".gif") != -1 ){

				html5 = url.substr(url.toLowerCase().indexOf("imgur.com/") + 10);
				html5 = html5.substring(0, html5.length - 4);

				$(theSideCommentLinks[i]).attr("data-video", "//i.imgur.com/" + html5  + ".mp4");

				$(theSideCommentLinks[i]).addClass("shine-comment comment-html5");

			// time to find out what kind of image we have
			}else{

				url = url.split(/[?#]/)[0];

				url = decodeURIComponent(url);

				IMGURID = url.substr(url.toLowerCase().indexOf("imgur.com/") + 10);

				if( IMGURID.indexOf(".tiff") != -1 || IMGURID.indexOf(".jpeg") != -1 ){

					IMGURID = IMGURID.substring(0, IMGURID.length - 5);

				}
				else if( IMGURID.indexOf(".png") != -1 || IMGURID.indexOf(".jpg") != -1 || IMGURID.indexOf(".tif") != -1){

					IMGURID = IMGURID.substring(0, IMGURID.length - 4);

				}

				$(theSideCommentLinks[i]).addClass("comment-" + i + "-" + IMGURID);

				getCommentImageFromServer("https://i.imgur.com/" + IMGURID + ".png", IMGURID, ".comment-" + i + "-" + IMGURID );

			}

		}

		// this is a gif we should convert to gifycat
		else if( url.toLowerCase().indexOf(".gif") != -1 && url.toLowerCase().indexOf(".gifv") == -1 && url.toLowerCase().indexOf("/r/") == -1 ){

			$(theSideCommentLinks[i]).addClass(".gfy-comment-" + i);

			getCommentGfyCatURL(url, ".gfy-comment-" + i);

		}



        // this is reddit uploads
		else if( url.toLowerCase().indexOf("reddituploads.com") != -1){

			$(theSideCommentLinks[i]).attr("data-image", url);

			$(theSideCommentLinks[i]).addClass("shine-comment comment-image");

		}



		// this is any other photo
		else if( url.toLowerCase().indexOf(".png") != -1 || url.toLowerCase().indexOf(".jpg") != -1 || url.toLowerCase().indexOf(".jpeg") != -1 || url.toLowerCase().indexOf(".tif") != -1 || url.toLowerCase().indexOf(".tiff") != -1){

			$(theSideCommentLinks[i]).attr("data-image", url);

			$(theSideCommentLinks[i]).addClass("shine-comment comment-image");

		}

		// this is youtube
		else if( url.toLowerCase().indexOf("youtube.com") != -1 && url.toLowerCase().indexOf("/r/youtube") == -1 ){

			vidID = "";

			if( url.toLowerCase().indexOf("attribution") != -1){

                vidID = getUrlVars(url)["u"];
                vidID = decodeURIComponent(vidID);
                vidID = getUrlVars(vidID)["v"];

            }
            else{

                vidID = getUrlVars(url)["v"];

            }

            timeStamp = getUrlVars(url)["t"];
            timeStamp = getYouTubeTimeStamp(timeStamp);

			$(theSideCommentLinks[i]).attr("data-video", "//www.youtube.com/embed/" + vidID + "?rel=0&autoplay=1&vq=hd1080&wmode=transparent&start=" + timeStamp);

			$(theSideCommentLinks[i]).addClass("shine-comment comment-youtube");

		}


		// this is youtube share
		else if( url.toLowerCase().indexOf("youtu.be") != -1 ){

			vidID = url.substr(url.toLowerCase().indexOf("youtu.be/") + 9);

            timeStamp = getUrlVars(url)["t"];
            timeStamp = getYouTubeTimeStamp(timeStamp);

            $(theSideCommentLinks[i]).attr("data-video", "//www.youtube.com/embed/" + vidID + "?rel=0&autoplay=1&vq=hd1080&wmode=transparent&start=" + timeStamp);

			$(theSideCommentLinks[i]).addClass("shine-comment comment-youtube");

		}

		// this is a gfycat link
		else if( url.toLowerCase().indexOf("gfycat.com") != -1 ){

			url = url.split(/[?#]/)[0]; // REMOVES QUERY STRING AND HASH

	        gfyID = url.substr(url.toLowerCase().indexOf("gfycat.com/") + 11);

	        if( gfyID.indexOf(".webm") != -1 || gfyID.indexOf(".gifv") != -1 ){
		        gfyID = gfyID.substring(0, gfyID.length - 5);
	        }else if ( gfyID.indexOf(".ogg") != -1 || gfyID.indexOf(".ogv") != -1 || gfyID.indexOf(".mp4") != -1){
	        	gfyID = gfyID.substring(0, gfyID.length - 4);
	        }

	        $(theSideCommentLinks[i]).attr("data-video", gfyID );

			$(theSideCommentLinks[i]).addClass("shine-comment comment-gfycat");

		}

		else{

			$(theSideCommentLinks[i]).addClass("shine-comment");

		}

	}

	topLevelComments = $('.side-comments .commentarea > .sitetable > .thing').not(".been-shined");

	for( i = 0; i < topLevelComments.length; i++ ){

    commentNumber = -1;
		$(topLevelComments[i]).addClass("been-shined comment-"+i);

		theChildren = $(topLevelComments[i]).find('.child .sitetable');

		if( theChildren.length > 0 ){

			$(topLevelComments[i]).find("ul.flat-list").first().append("<li class='inline-child-toggle'><a>hide / show child comments</a></li>");

		}

	}

	// stuff to do to all anchor tags
	$('.side-comments a').each(function(){

		$(this).not('.expand').attr("target","_blank");

	});

}



function loadSideComments(target, url){

	$(target).load( url + " div.content", function(){

        $(this).find('.expando').children('*').not('.usertext').remove();
        $(this).find('.expando-button').remove();

		startCheckingComments = setInterval(checkSideComments, 1000);

	});

}

$('body').on('click','.preview-image', function(){

	resetInterfaces();

	$('.shine-expand .large-image').css('background-image','url(' + $(this).data("url") + ')');

	$('.shine-expand .large-image').zoom({url: $(this).data("url"), on: 'click'});

	loadSideComments( $('.shine-expand .side-comments'), $(this).parents('.thing').find('a.comments').attr("href") );

	$('html').addClass("expanding expand-images");


  $('.shine-expand').attr("data-original-type", "image");
  $('.shine-expand').attr("data-original-data", $(this).data("url"));


});

$('body').on('click','.preview-youtube', function(){

	resetInterfaces();

	$('.shine-expand .large-youtube').html("<iframe frameborder='0' allowfullscreen src='" + $(this).data("video") + "' />");

	loadSideComments( $('.shine-expand .side-comments'), $(this).parents('.thing').find('a.comments').attr("href") );

	$('html').addClass("expanding expand-youtubes");

  $('.shine-expand').attr("data-original-type", "youtube");
  $('.shine-expand').attr("data-original-data", $(this).data("video"));

});

$('body').on('click','.preview-vreddit', function(){

  resetInterfaces();

  var posturl = $(this).parents('.thing').find('a.comments').attr("href");

  $.ajax({
    url:posturl,
    type:'GET',
    success: function(data){

      theContent = $(data).find(".media-preview-content");

      $('.shine-expand').find('.large-youtube').html( theContent );
      $('.no-constraints-when-pinned').removeAttr('style');
      $('.reddit-video-player-root').css({
        'position' : 'absolute',
        'height' : '100%'
      });
    
    }
  });
  
  // theContent = $.get("//www.reddit.com" + url, function(data) {
  //   $(data).find(".media-preview-content");
  // });

  // $('.shine-expand').find('.large-youtube').html(theContent);

  // $('.no-constraints-when-pinned').removeAttr('style');
  // $('.reddit-video-player-root').css({
  //   'position' : 'absolute',
  //   'height' : '100%'
  // });

  loadSideComments( $('.shine-expand .side-comments'), $(this).parents('.thing').find('a.comments').attr("href") );

  $('html').addClass("expanding expand-youtubes");

      $('.shine-expand').attr("data-original-type", "comments");
      $('.shine-expand').attr("data-original-data", "comments");

});

$('body').on('click','.preview-gifv', function(){

	resetInterfaces();

	$('.shine-expand .large-html5').html("<video controls preload='auto' autoplay='autoplay' muted='muted' loop='loop' webkit-playsinline ><source src='" + $(this).data("video") + "' type='video/mp4' /></video>");

	loadSideComments( $('.shine-expand .side-comments'), $(this).parents('.thing').find('a.comments').attr("href") );

	$('html').addClass("expanding expand-html5s");

  $('.shine-expand').attr("data-original-type", "html5");
  $('.shine-expand').attr("data-original-data", $(this).data("video"));

});

$('body').on('click','.preview-gfycat', function(){

	resetInterfaces();

	$('.shine-expand .large-html5').html("<video controls preload='auto' autoplay='autoplay' muted='muted' loop='loop' webkit-playsinline ><source src='//fat.gfycat.com/" + $(this).data("url") + ".mp4' type='video/mp4' /><source src='//giant.gfycat.com/" + $(this).data("url") + ".mp4' type='video/mp4' /><source src='//zippy.gfycat.com/" + $(this).data("url") + ".mp4' type='video/mp4' /></video>");

	loadSideComments( $('.shine-expand .side-comments'), $(this).parents('.thing').find('a.comments').attr("href") );

	$('html').addClass("expanding expand-html5s");

  $('.shine-expand').attr("data-original-type", "gfycat");
  $('.shine-expand').attr("data-original-data", $(this).data("url"));

});

$('body').on('click','.preview-vimeo', function(){

	resetInterfaces();

	$('.shine-expand .large-youtube').html("<iframe frameborder='0' allowfullscreen src='" + $(this).data("video") + "' />");

	loadSideComments( $('.shine-expand .side-comments'), $(this).parents('.thing').find('a.comments').attr("href") );

	$('html').addClass("expanding expand-youtubes");

  $('.shine-expand').attr("data-original-type", "youtube");
  $('.shine-expand').attr("data-original-data", $(this).data("video"));

});

$('body').on('click','.preview-album',function(){

	resetInterfaces();

	loadSideComments( $('.shine-expand .side-comments'), $(this).parents('.thing').find('a.comments').attr("href") );

	getEntireAlbum( $(this).data("album") );

  $('.shine-expand').attr("data-original-type", "album");
  $('.shine-expand').attr("data-original-data", $(this).data("album"));

});

$('body').on('click','.album-thumbnails img', function(){

	$('.large-album').css("background-image", "url(" + $(this).data("image") + ")" );

	$('.shine-expand .large-album').trigger('zoom.destroy');

    $('.shine-expand .large-album').zoom({url: $(this).data("image"), on: 'click'});

    $('.album-thumbnails img').removeClass("active-thumb");

    $(this).addClass("active-thumb");

    $('.album-captions').html("");

    if( $(this).data("title") != null || $(this).data("description") != null ){

  		$('.album-captions').html('<div class="show-captions"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-291 389 20 16" style="enable-background:new -291 389 20 16;" xml:space="preserve"><path d="M-273,389h-16c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2v-12C-271,389.9-271.9,389-273,389z M-289,397h4v2h-4V397z M-279,403h-10v-2h10V403z M-273,403h-4v-2h4V403z M-273,399h-10v-2h10V399z"/></svg></div><div class="caption-text"><strong></strong><p></p></div>');

  		if( $(this).data("title") != "null" ){
  			$('.caption-text strong').html($(this).data("title"));
  		}

  		if( $(this).data("description") != "null" ){
  			$('.caption-text p').html($(this).data("description"));
  		}

  	}

});

$('body').on('click','.show-captions',function(e){

	$('html').toggleClass("activate-captions");

	e.stopPropagation();

	e.preventDefault();

	return false;

});

$(document).keydown(function(e) {

    if( $('html').hasClass("expand-albums") ){

    	theThumbs = $('.album-thumbnails img');

	    var code = (e.keyCode ? e.keyCode : e.which);
	    if (code == 40) {
	        //down pressed

	        for(i = 0; i < theThumbs.length; i++){

	        	if( $(theThumbs[i]).hasClass("active-thumb") ){

	        		if( i == theThumbs.length - 1 ){

	        			$(theThumbs[0]).click();

	        		}else{

						$(theThumbs[i+1]).click();

	        		}

	        		break;

	        	}

	        }

	        $('.album-thumbnails').scrollTop($('.album-thumbnails').scrollTop() + $('.active-thumb').position().top);

	    } else if (code == 38) {
	        //up pressed

	        for(i = 0; i < theThumbs.length; i++){

	        	if( $(theThumbs[i]).hasClass("active-thumb") ){

	        		if( i == 0 ){

	        			$(theThumbs[theThumbs.length - 1]).click();

	        		}else{

						$(theThumbs[i-1]).click();

	        		}

	        		break;

	        	}

	        }

	        $('.album-thumbnails').scrollTop($('.album-thumbnails').scrollTop() + $('.active-thumb').position().top);

	    }

	    e.preventDefault();
	    e.stopPropagation();
	    return false;

	}

});

$('body').on('click','.preview-text',function(){

	$(this).parents('.thing').addClass("reading");

});


$('body').on('click','.thing.shined a.comments', function(e){

	resetInterfaces();

	loadSideComments( $('.shine-expand .side-comments'), $(this).attr("href") );

	$('html').addClass("expanding expand-comments");

  $('.shine-expand').attr("data-original-type", "comments");
  $('.shine-expand').attr("data-original-data", "comments");

	e.preventDefault();

});



function clearExpandStuff(){

	$('html').removeClass("expand-images");
	$('html').removeClass("expand-youtubes");
	$('html').removeClass("expand-html5s");
	$('html').removeClass("expand-albums");
	$('html').removeClass("expand-comments");
	$('.shine-expand .large-image').html("");
	$('.shine-expand .large-image').css("background-image","");
	$('.shine-expand .large-youtube').html("");
	$('.shine-expand .large-html5').html("");
	$('.shine-expand .large-album').html("");
	$('.shine-expand .album-thumbnails').html("");

}





function getCommentAlbumImages( api ){

  $.ajax({
      url: api,
      type: 'GET',
      dataType: 'json',
      success: function(data) {

        clearExpandStuff();

        for( i = 0; i < data.data.length; i++ ){

          captionTitle = data.data[i].title;
          captionDescription = data.data[i].description;

          if( captionTitle != null){
            captionTitle = captionTitle.replace('"',"'");
          }

          if( captionDescription != null){
            captionDescription = captionDescription.replace('"',"'");
          }

          $('.album-thumbnails').append('<img data-title="' + captionTitle + '" data-description="' + captionDescription + '" data-image="' + data.data[i].link + '" src="//i.imgur.com/' + data.data[i].id + 't.jpg" />');

        }

        $('.album-thumbnails').find("img").first().addClass("active-thumb");

        $('.large-album').css("background-image", "url(" + data.data[0].link + ")" );

        $('.shine-expand .large-album').zoom({url: data.data[0].link, on: 'click'});

        $('.album-captions').html("");

        if( data.data[0].title != null || data.data[0].description != null ){

          $('.album-captions').html('<div class="show-captions"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-291 389 20 16" style="enable-background:new -291 389 20 16;" xml:space="preserve"><path d="M-273,389h-16c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2v-12C-271,389.9-271.9,389-273,389z M-289,397h4v2h-4V397z M-279,403h-10v-2h10V403z M-273,403h-4v-2h4V403z M-273,399h-10v-2h10V399z"/></svg></div><div class="caption-text"><strong></strong><p></p></div>');

          if( data.data[0].title != null ){
            $('.caption-text strong').html(data.data[0].title);
          }

          if( data.data[0].description != null ){
            $('.caption-text p').html(data.data[0].description);
          }

        }

    $('html').addClass("expanding expand-albums");

      },
      error: function(request, status, message) {
        console.log(message);
      },
      beforeSend: setHeader
    });

}






function replaceExpand(type,data,button){


  jumpTime = false;

  if( $('html').hasClass("expand-comments") ){

    jumpTime = true;

  }


  clearExpandStuff();



  if( type === "comments" ){


    clearExpandStuff();

    $('html').addClass("expand-comments");

    jumpTime = true;


  }else if( type === "image" ){



    $('.shine-expand .large-image').css("background-image", "url(" + data + ")" );

    $('.shine-expand .large-image').zoom({url: data, on: 'click'});

    $('html').addClass("expand-images");




  }else if( type === "youtube"){




    $('.shine-expand .large-youtube').html("<iframe frameborder='0' allowfullscreen src='" + data + "' />");

    $('html').addClass("expand-youtubes");




  }else if( type === "html5"){




    $('.shine-expand .large-html5').html("<video controls preload='auto' autoplay='autoplay' muted='muted' loop='loop' webkit-playsinline ><source src='" + data + "' type='video/mp4' /></video>");

    $('html').addClass("expand-html5s");




  }else if( type === "gfycat"){




    $('.shine-expand .large-html5').html("<video controls preload='auto' autoplay='autoplay' muted='muted' loop='loop' webkit-playsinline ><source src='//fat.gfycat.com/" + data + ".mp4' type='video/mp4' /><source src='//giant.gfycat.com/" + data + ".mp4' type='video/mp4' /><source src='//zippy.gfycat.com/" + data + ".mp4' type='video/mp4' /></video>");

    $('html').addClass("expand-html5s");




  }else if( type === "album"){




    getCommentAlbumImages( data );




  }







  if( jumpTime ){

    container = $('.side-comments');
      scrollTo = button;

    container.scrollTop(
        scrollTo.offset().top - container.offset().top + container.scrollTop() - 100
    );

  }




  if( !$(button).hasClass("closecommentmedia") ){
    $('.shine-comment').removeClass("closecommentmedia");
    $(button).addClass("closecommentmedia");
  }else{
    $('.shine-comment').removeClass("closecommentmedia");
  }





}






$('html').not('.shinelight').on('click','.comment-image:not(.closecommentmedia)',function(e){

  replaceExpand("image", $(this).data("image"), $(this) );

	e.preventDefault();

});






$('html').not('.shinelight').on('click','.comment-youtube:not(.closecommentmedia)',function(e){

  replaceExpand("youtube", $(this).data("video"), $(this) );

	e.preventDefault();

});






$('html').not('.shinelight').on('click','.comment-html5:not(.closecommentmedia)', function(e){

  replaceExpand("html5", $(this).data("video"), $(this) );

	e.preventDefault();

});





$('html').not('.shinelight').on('click','.comment-gfycat:not(.closecommentmedia)', function(e){

  replaceExpand("gfycat", $(this).data("video"), $(this) );

	e.preventDefault();

});






$('html').not('.shinelight').on('click','.comment-album:not(.closecommentmedia)', function(e){

  replaceExpand("album", $(this).data("album"), $(this) );

	e.preventDefault();

});





$('html').not('.shinelight').on('click','.closecommentmedia', function(e){

  replaceExpand( $('.shine-expand').attr("data-original-type"), $('.shine-expand').attr("data-original-data"), $(this) );

  e.preventDefault();

});





$('body').on('click','.toggle-child-comments', function(){

	$('html').toggleClass("shine-hide-children");

});

$('body').on('click','.inline-child-toggle', function(){

	if( !$(this).parents('.been-shined').hasClass("show-child-comments") ){

		$(this).parents('.been-shined').addClass("show-child-comments");
		$(this).parents('.been-shined').removeClass("hide-child-comments");

	}else{

		$(this).parents('.been-shined').removeClass("show-child-comments");
		$(this).parents('.been-shined').addClass("hide-child-comments");

	}

});













$(document).on('keyup keydown', function(e){

  if(e.keyCode == "27"){
    resetInterfaces();
  }

});

