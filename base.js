// GLOBAL RESETS AND FIXES 
$('body').removeClass("listing-chooser-collapsed");

// FUNCTIONS SECTION

// this function returns our query string variable
function getQueryString(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function IsJsonString(str) {
    
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;

}

// INITIAL VARIABLE CREATION SECTION

// creating the settings variable to use when we update and save settings
var currentSettings = {};

// creating the default settings variable if they havn't saved any settings yet
var defaultSettings = {"global" : {"layout" : "list", "shortcuts" : "show", "night" : "off", "sidebar" : "", "multis" : ""},

    "list" :  {"split" : "6040", "columns" : "one"},

    "grid" :  {"columns" : "5", "nsfw" : "no", "split" : "6040"},

    "subreddits" : [
    	{"url" : "www.reddit.com/r/shine/", "layout" : "list"},
    	{"url" : "www.reddit.com/r/aww/", "layout" : "grid"},
    	{"url" : "www.reddit.com/r/earthporn/", "layout" : "list"}
    ],

    "multireddits" : [
    	{"url" : "www.reddit.com/user/evilnight/m/redditunes", "layout" : "grid"},
    	{"url" : "www.reddit.com/user/Abbigale221/m/moviesandtv", "layout" : "list"}
    ],

    "account" : {"status" : "shinebright"},

    "message" : ""

};



// this creates our variable that stories what today's date is
var d = new Date();
var curr_date = d.getDate();
var curr_month = d.getMonth() + 1;
todayIs = curr_month.toString() + curr_date.toString();



// this is the main SHINE base function that runs after we've retrieved or created thier settings
// this sets up the basic global interface
function SHINE(){
	currentSettings.account.status = "shinebright";

    //console.log(currentSettings);

	// adding our menu interface

	htmlToAdd = ""+

		'<div class="dark-background"></div>'+

		'<div class="shine-nav">'+
			
			'<div class="shine-menu-button shine-search">'+
				'<label>search reddit</label>'+
			'</div>'+

			'<div class="shine-menu-button shine-settings">'+
				'<label>shine settings</label>'+
			'</div>';

		if( $('body').hasClass("with-listing-chooser") ){

			htmlToAdd = htmlToAdd +

			'<div class="shine-menu-button shine-multi">'+
				'<label>toggle multireddits</label>'+
			'</div>';

		}

		htmlToAdd = htmlToAdd +

			'<div class="shine-menu-button shine-sidebar">'+
				'<label>toggle sidebar</label>'+
			'</div>'+

			'<a href="" class="shine-menu-button shine-submit">'+
				'<label>post to reddit</label>'+
			'</a>'+

			'<div class="shine-menu-button shine-navicon">'+
				'<span class="lines"></span>'+
			'</div>'+

		'</div>'+

		'<form action="https://www.reddit.com/search" id="shine-search" name="search">'+
        	'<input name="q" placeholder="type here and hit enter" tabindex="20" type="text" id="shine-search-box">'+
        	'<input tabindex="22" type="submit" value="">'+
        	'<a href="https://www.reddit.com/wiki/search">advanced search: by author, subreddit...</a>'+
    	'</form>';

	$('body').append(htmlToAdd);

	$('#header').append(''+

		'<div class="layout-switch">'+
			'<svg class="grid-switch" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/></svg>'+
			'<svg class="list-switch" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/></svg>'+
		'</div>'

	);

	if( $('.pagename a').attr("href") != undefined ){
		$('.shine-submit').attr("href", $('.pagename a').attr("href") + "submit/" );
	}else{
		$('.shine-submit').attr("href", "/submit/");
	}


	// moving subscribe button into nav
	$('.side .subscribe-button').clone().prependTo(".shine-nav");
	$('.shine-nav .subscribe-button .option').addClass("shine-menu-button shine-subscribe");




	// HERE WE ADD THE SETTINGS DIV
	$('body').append(''+

		'<div class="settings-panel">'+
			'<div class="settings-tabs">'+
				'<div data-settings-panel=".panel-default" class="tab tab-default tab-active">Default Settings</div>'+
				'<div data-settings-panel=".panel-grid" class="tab tab-grid">Grid Settings</div>'+
				'<div data-settings-panel=".panel-list" class="tab tab-list">List Settings</div>'+
			'</div>'+
			'<div class="panel panel-default panel-active">'+
				'<div class="settings-halves">'+
					'<div class="settings-column-half">'+
						'<label for="settings-default-view">Default View</label>'+
						'<span class="settings-small-print">The default view for most pages.</span>'+
						'<select name="settings-default-view" id="settings-default-view">'+
							'<option value="list">List View</option>'+
							'<option value="grid">Grid View</option>'+
						'</select>'+
					'</div>'+
					'<div class="settings-column-half">'+
						'<label for="settings-night-mode">Theme Selector</label>'+
						'<span class="settings-small-print">If you have RES, turn it on Night Mode for dark themes too.</span>'+
						'<select name="settings-night-mode" id="settings-night-mode">'+
							'<option value="off">White</option>'+
							'<option value="on">Night</option>'+
							'<option value="dark">Clean Dark</option>'+
						'</select>'+
					'</div>'+
				'</div>'+
				'<div class="settings-halves">'+
					'<div class="settings-column-half">'+					
						'<label for="settings-shortcuts-bar">Shortcuts Bar</label>'+
						'<span class="settings-small-print">Hide or show the shortcuts bar at the top.</span>'+
						'<select name="settings-shortcuts-bar" id="settings-shortcuts-bar">'+
							'<option value="show">Show</option>'+
							'<option value="hide">Hide</option>'+
						'</select>'+
					'</div>'+
				'</div>'+
				'<p>To add or edit subreddit or multireddit defaults, please go to that subreddit or multireddit and click the grid view or list view icon in the top bar. To remove a default from the lists below, click the delete icon.</p>'+
				'<div class="settings-halves">'+
					'<div class="settings-column-half">'+
						'<label>Subreddit Defaults</label>'+
						'<div class="settings-subreddit-defaults"></div>'+
					'</div>'+
					'<div class="settings-column-half">'+
						'<label>Multireddit Defaults</label>'+
						'<div class="settings-multireddit-defaults"></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="panel panel-grid">'+
				'<p>The settings below are applied to all Grid View pages.</p>'+
				'<div class="settings-halves">'+
					'<div class="settings-column-half">'+
						'<label for="settings-number-columns">Number of Columns</label>'+
						'<select name="settings-number-columns" id="settings-number-columns">'+
							'<option value="1">One</option>'+
							'<option value="2">Two</option>'+
							'<option value="3">Three</option>'+
							'<option value="4">Four</option>'+
							'<option value="5">Five</option>'+
						'</select>'+
					'</div>'+
					'<div class="settings-column-half">'+
						'<label for="settings-grid-split">Image & Comments Split Percentage</label>'+
						'<select name="settings-grid-split" id="settings-grid-split">'+
							'<option value="7030">70 / 30</option>'+
							'<option value="6040">60 / 40</option>'+
							'<option value="5050">50 / 50</option>'+
							'<option value="4060">40 / 60</option>'+
							'<option value="3070">30 / 70</option>'+
						'</select>'+
					'</div>'+
				'</div>'+
				'<div class="settings-halves">'+
					'<div class="settings-column-half">'+
						'<label for="settings-show-nsfw">Show NSFW Automatically</label>'+
						'<select name="settings-show-nsfw" id="settings-show-nsfw">'+
							'<option value="no">No</option>'+
							'<option value="yes">Yes</option>'+
						'</select>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="panel panel-list">'+
				'<p>The settings below are applied to all List View pages.</p>'+
				'<div class="settings-halves">'+
					'<div class="settings-column-half">'+
						'<label for="settings-list-layout">List View Layout</label>'+
						'<select name="settings-list-layout" id="settings-list-layout">'+
							'<option value="one">Display content underneath list item.</option>'+
							'<option value="two">Display content to the right of list items.</option>'+
						'</select>'+
					'</div>'+
					'<div class="settings-column-half">'+
						'<label for="settings-list-split">Image & Comments Split Percentage</label>'+
						'<select name="settings-list-split" id="settings-list-split">'+
							'<option value="7030">70 / 30</option>'+
							'<option value="6040">60 / 40</option>'+
							'<option value="5050">50 / 50</option>'+
							'<option value="4060">40 / 60</option>'+
							'<option value="3070">30 / 70</option>'+
						'</select>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="settings-saved">Your settings have been saved.</div>'+
		'</div>'

	);




	/* SETTINGS BAR */

	if( currentSettings.global.shortcuts == "hide" ){

		$('#settings-shortcuts-bar').val("hide");

	}else{

		$('html').addClass("show-shortcuts");

	}

	/* DEFAULT VIEW */

	if( currentSettings.global.layout == "list" ){

		$('#settings-default-view').val("list");

	}else{

		$('#settings-default-view').val("grid");

	}

	/* GRID COLUMNS */

	$('#settings-number-columns').val( currentSettings.grid.columns );

	/* NIGHT MODE */

	$('#settings-night-mode').val( currentSettings.global.night );

	/* NSFW */

	$('#settings-show-nsfw').val( currentSettings.grid.nsfw );

	/* LIST VIEW */

	$('#settings-list-layout').val( currentSettings.list.columns );
	
	/* GRID SPLIT */
	
	if( currentSettings.grid.split == "7030" || currentSettings.grid.split == "6040" || currentSettings.grid.split == "5050" || currentSettings.grid.split == "4060" || currentSettings.grid.split == "3070"){
		$('#settings-grid-split').val( currentSettings.grid.split );
	}
	
	/* LIST SPLIT */
	
	if( currentSettings.list.split == "7030" || currentSettings.list.split == "6040" || currentSettings.list.split == "5050" || currentSettings.list.split == "4060" || currentSettings.list.split == "3070"){
		$('#settings-list-split').val( currentSettings.list.split );
	}

	/* DISABLE STUFF IF SHINE LIGHT */

	if( currentSettings.account.status == "shinelight" ){

		$('#settings-default-view').attr("disabled","disabled");
		$('#settings-night-mode').attr("disabled","disabled");
		$('#settings-shortcuts-bar').attr("disabled","disabled");
		$('#settings-number-columns').attr("disabled","disabled");
		$('#settings-show-nsfw').attr("disabled","disabled");
		$('#settings-list-layout').attr("disabled","disabled");
		$('#settings-grid-split').attr("disabled","disabled");
		$('#settings-list-split').attr("disabled","disabled");

	}


	// this adds the nightmode class
	if( currentSettings.global.night == "on" ){
		$('html').addClass("res-nightmode");
		$('body').addClass("res-nightmode");
	}

	if( currentSettings.global.night == "dark" ){
		$('html').addClass("res-nightmode cleandark");
		$('body').addClass("res-nightmode cleandark");
	}





	// this adds hide nsfw class

	if( currentSettings.grid.nsfw == "no" ){
		$('html').addClass("shine-hide-nsfw");
	}



	// this adds a class to the html that says if we've paid or not
	$('html').addClass( currentSettings.account.status );

	if( currentSettings.account.status == "shinelight" ){

		$('#header-bottom-left').prepend('<div class="header-shine-bright shine-prompt">Get Shine Bright Now</div>');

	}




	// this adds the sidebar class and multireddit class
	$('html').addClass( currentSettings.global.sidebar );

	if( $('body').hasClass("with-listing-chooser") ){
		$('html').addClass( currentSettings.global.multis );
	}






	// this cleans up the top right section
	if( !$('body').hasClass("loggedin") ){
		$('#header-bottom-right .user').contents().first().remove();
		$('#header-bottom-right .user').contents().last().remove();
	}












	// this makes sure we're on the home page, a subreddit, or a multireddit
	if( $('body').hasClass("listing-page") && !$('body').hasClass("profile-page") && $('#header-bottom-left .pagename').html() != "preferences" && !$('body').hasClass("subreddits-page") ){










		//time to decide if we're going to load the list view or the grid view
		var whichView = "";

		//time to check the subreddits
		if( currentSettings.subreddits.length > 0){

			for(i = 0; i < currentSettings.subreddits.length; i++){

				windowLocation = $('.pagename a').attr("href");
				subredditURL = currentSettings.subreddits[i].url;

				if( windowLocation != undefined ){
					if( windowLocation.indexOf( subredditURL ) != -1 ){
						whichView = currentSettings.subreddits[i].layout;
					}
				}

				displayURL = currentSettings.subreddits[i].url;
				displayURL = displayURL.replace("www.reddit.com","");

				$('.settings-subreddit-defaults').append('<li data-url="' + currentSettings.subreddits[i].url + '"><a href="http://' + currentSettings.subreddits[i].url + '">' + displayURL + '</a><span data-url="' + currentSettings.subreddits[i].url + '" class="remove-default remove-subreddit-default"></span><span class="default-view">' + currentSettings.subreddits[i].layout + ' view</span></li>');

			}

		}

		// now it's time to check the multireddits
		if( currentSettings.multireddits.length > 0){

			for(i = 0; i < currentSettings.multireddits.length; i++){

				windowLocation = $('.pagename a').attr("href");
				multiredditURL = currentSettings.multireddits[i].url;

				if( windowLocation != undefined ){
					if( windowLocation.indexOf( multiredditURL ) != -1 ){
						whichView = currentSettings.multireddits[i].layout;
					}
				}

				displayURL = currentSettings.multireddits[i].url;
				displayURL = displayURL.replace("www.reddit.com/user","").replace("www.reddit.com/me","");

				$('.settings-multireddit-defaults').append('<li data-url="' + currentSettings.multireddits[i].url + '"><a href="http://' + currentSettings.multireddits[i].url + '">' + displayURL + '</a><span data-url="' + currentSettings.multireddits[i].url + '" class="remove-default remove-multireddit-default"></span><span class="default-view">' + currentSettings.multireddits[i].layout + ' view</span></li>');

			}

		}


		// if whichView is still blank, use the default layout
		if( whichView == "" ){

			whichView = currentSettings.global.layout;

		}


		// time to load our other javascript files

		if( whichView == "grid" ){

			$.getScript( chrome.extension.getURL("jquery.zoom.min.js") );
			$.getScript( chrome.extension.getURL("shine-grid.js") );

			thingWidth = screen.width / ( parseInt(currentSettings.grid.columns) + 1);

			$('html').attr("data-columns", currentSettings.grid.columns);

			$('head').append(''+

				'<style id="shine-card-width" type="text/css">'+
					'html.SHINE.shine-grid body > .content #siteTable .thing{'+
						'width:' + thingWidth + 'px;'+
					'}'+
					'html.SHINE.shine-grid body > .content #siteTable .thing .preview{'+
						'width:' + thingWidth + 'px;'+
						'flex-basis:' + thingWidth + 'px;'+
					'}'+
				'</style>'

			);
			
			if( currentSettings.grid.split == "7030" || currentSettings.grid.split == "6040" || currentSettings.grid.split == "5050" || currentSettings.grid.split == "4060" || currentSettings.grid.split == "3070"){
				
				$('html').addClass("shine-split-" + currentSettings.grid.split);
				
			}
			
			

		}else if( whichView == "list" ){

			if(currentSettings.list.columns == "two"){
				$('html').addClass("shine-list-classic");
			}			

			$.getScript( chrome.extension.getURL("jquery.zoom.min.js") );
			$.getScript( chrome.extension.getURL("shine-list.js") );
			
			if(currentSettings.list.split == "7030" || currentSettings.list.split == "6040" || currentSettings.list.split == "5050" || currentSettings.list.split == "4060" || currentSettings.list.split == "3070"){
				
				if( !$('html').hasClass("shine-list-classic") ){
					$('html').addClass("shine-split-" + currentSettings.list.split);
				}	
				
			}
			

		}


		// add our view class to the html
		$('html').addClass("shine-" + whichView);



	}else{

		// if we're not on a content page, then load SHINE's default interface

		$('html').addClass("shine-default shine-ready");


	}












	// remove subreddit styling

	headLinks = $('head link');

	for(i = 0;i<headLinks.length;i++){
		
		if( $(headLinks[i]).attr("title") == "applied_subreddit_stylesheet" ){
			
			subredditCss = $(headLinks[i]).attr("href");

			$(headLinks[i]).remove();

		}

	}

	
	

    
    
    
    
    
    
    
    
    
    
    // LISTENING FOR MESSAGE FROM IFRAME
    
    function listener(event){
        
        if ( event.origin == "https://madewithgusto.com" && event.data == "shinebright" ){
            
            //time to shine bright
            $('#settings-default-view').removeAttr("disabled");
            $('#settings-night-mode').removeAttr("disabled");
            $('#settings-shortcuts-bar').removeAttr("disabled");
            $('#settings-number-columns').removeAttr("disabled");
            $('#settings-show-nsfw').removeAttr("disabled");
            $('#settings-list-layout').removeAttr("disabled");
            $('#settings-grid-split').removeAttr("disabled");
            $('#settings-list-split').removeAttr("disabled");

            $('.header-shine-bright').remove();
            
            $('html').removeClass('shinelight');
            $('html').addClass('shinebright');
            
            currentSettings.account.status = "shinebright";
            
            chrome.storage.local.set({"shine": currentSettings}, function(){
                
                replacePanel = ''+
                '<div class="shining-bright">'+
                    '<div id="sunburst"><img src="' + chrome.extension.getURL("sunburst.png") + '" /></div>'+
                    '<h1>You did it!</h1>'+
                    "<p>You've just unlocked the best way to experience all the delicious content reddit has to offer. You'll also have first access to all the sweet new features we'll be adding over the months and years to come. We are now massively in your debt and appreciate you supporting the hard work we've put into building SHINE. If you have any feedback or questions for us, please feel free to post in <a target='_blank' href='/r/shine'>/r/shine</a> or email us at <a target='_blank' href='mailto:shine@madewithgusto.com'>shine@madewithgusto.com</a></p><p><i>May the force be with you.</i></p><p>-The SHINE team at Gusto Creative House</p>"+
                    '<div id="shine-bright-logout">Logout of Shine Bright <img src="' + chrome.extension.getURL("logout.svg") + '" /></div>'+
                '</div>';
                
                $('.shine-bright-panel').html(replacePanel);

            });
            
        }
            
    }

    
    if (window.addEventListener){
        
        addEventListener("message", listener, false);
        
    } else {
        
        attachEvent("onmessage", listener);
        
    }
	

	//SHINE BRIGHT FORM
    
    if( currentSettings.account.status == "shinebright" ){
        
        $('body').append(''+
             '<div class="shine-bright-panel">'+
                '<div class="shining-bright">'+
                    '<div id="sunburst"><img src="' + chrome.extension.getURL("sunburst.png") + '" /></div>'+
                    '<h1>You did it!</h1>'+
                    "<p>You've just unlocked the best way to experience all the delicious content reddit has to offer. You'll also have first access to all the sweet new features we'll be adding over the months and years to come. We are now massively in your debt and appreciate you supporting the hard work we've put into building SHINE. If you have any feedback or questions for us, please feel free to post in <a target='_blank' href='/r/shine'>/r/shine</a> or email us at <a target='_blank' href='mailto:shine@madewithgusto.com'>shine@madewithgusto.com</a></p><p><i>May the force be with you.</i></p><p>-The SHINE team at Gusto Creative House</p>"+
                    '<div id="shine-bright-logout">Logout of Shine Bright <img src="' + chrome.extension.getURL("logout.svg") + '" /></div>'+
                '</div>'+
             '</div>'
        );
        
    }else{
        
        $('body').append('<div class="shine-bright-panel"></div>');
        
    }

	$('body').on('click','.shine-prompt', function(e){
        
        if( currentSettings.account.status == "shinelight" ){
            $('.shine-bright-panel').html('<iframe id="shine-bright-iframe" frameborder="0" height="100%" width="100%" src="https://madewithgusto.com/SHINE-IFRAME-CREATEACCOUNT.php" />');
        }

		$('html').addClass("show-shine-bright");

		e.preventDefault();
		e.stopPropagation();
		return false;

	});
    
    $('body').on('click','#shine-bright-logout', function(){
       
        currentSettings.account.status = "shinelight";
        
        chrome.storage.local.set({"shine": currentSettings}, function(){

			location.reload();

		});
        
    });
    
    
    
    


















	$('html').addClass("SHINE");


} // end SHINE function

















// this is the function that gets our settings
// this will go get our settings, and then once we've returned everything
// call our SHINE() function to kick off the sexy interface

function getSettings(){

	chrome.storage.local.get("shine", function (data) {

		// if we don't have stored settings, store default then call this function again
		if( data.shine == undefined || data.shine == "" ){

			chrome.storage.local.set({"shine": defaultSettings});

	   		getSettings();

		}else{

			// set our currentSettings variable to whatever was stored
			currentSettings = data.shine;

			SHINE();

		}

	});

}

getSettings();
























/* INTERFACE ACTIONS */

function resetInterfaces(){

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

}

$('body').on('click','.dark-background', function(){

	resetInterfaces();

});

$('body').on('click','.shine-navicon',function(){

	resetInterfaces();

});

$('body').on('click','.shine-sidebar', function(){

	if( $('html').hasClass("show-sidebar") ){

		currentSettings.global.sidebar = "";

		chrome.storage.local.set({"shine": currentSettings});

		resetInterfaces();

		$('html').removeClass("show-sidebar");

	}else{

		currentSettings.global.sidebar = "show-sidebar";

		chrome.storage.local.set({"shine": currentSettings});

		resetInterfaces();

		$('html').addClass("show-sidebar");

	}

});

$('body').on('click','.shine-search', function(){

	resetInterfaces();

	$('html').addClass("show-search");

	$('#shine-search-box').focus();

});

$('body').on('click','.shine-multi', function(){

	if( $('html').hasClass("show-multireddits") ){

		currentSettings.global.multis = "";

		chrome.storage.local.set({"shine": currentSettings});

		resetInterfaces();

		$('html').removeClass("show-multireddits");

	}else{

		currentSettings.global.multis = "show-multireddits";

		chrome.storage.local.set({"shine": currentSettings});

		resetInterfaces();

		$('html').addClass("show-multireddits");

	}

});
















// ALL THE SETTINGS STUFF

function saveSettingsMessage(){

	$('html').addClass("settings-are-saved");
	setTimeout("jQuery('html').removeClass('settings-are-saved')", 2000);		

}

$('body').on('click','.shine-settings', function(){

	resetInterfaces();
	$('html').toggleClass("show-settings");

});


$('body').on('click','.settings-panel .tab',function(){

	$('.settings-panel .panel').removeClass("panel-active");
	$( $(this).data("settings-panel") ).addClass("panel-active");

	$('.tab').removeClass("tab-active");
	$(this).addClass("tab-active");

});

$('body').on('change','#settings-default-view', function(){

	currentSettings.global.layout = $(this).val();

	chrome.storage.local.set({"shine": currentSettings}, function(){

		saveSettingsMessage();

	});

});


$('body').on('change','#settings-shortcuts-bar', function(){

	currentSettings.global.shortcuts = $(this).val();

	chrome.storage.local.set({"shine": currentSettings}, function(){

		if( currentSettings.global.shortcuts == "show" ){

			$('html').addClass("show-shortcuts");

		}else{

			$('html').removeClass("show-shortcuts");

		}

		saveSettingsMessage();

	});

});


$('body').on('change','#settings-list-layout', function(){

	currentSettings.list.columns = $(this).val();

	chrome.storage.local.set({"shine": currentSettings}, function(){

		if( currentSettings.list.columns == "two" && $('html').hasClass("shine-list") ){

			$('html').addClass("shine-list-classic");
			$('html').removeClass("shine-split-7030 shine-split-6040 shine-split-5050 shine-split-4060 shine-split-3070");

		}

		if( currentSettings.list.columns == "one" ){

			$('html').removeClass("shine-list-classic");
			$('html').addClass("shine-split-" + currentSettings.list.split);

		}

		saveSettingsMessage();

	});

});


$('body').on('change','#settings-grid-split', function(){

	currentSettings.grid.split = $(this).val();

	chrome.storage.local.set({"shine": currentSettings}, function(){
		
		if( $('html').hasClass("shine-grid") ){

			$('html').removeClass("shine-split-7030 shine-split-6040 shine-split-5050 shine-split-4060 shine-split-3070");
			
			$('html').addClass("shine-split-" + currentSettings.grid.split);
		
		}

		saveSettingsMessage();

	});

});

$('body').on('change','#settings-list-split', function(){

	currentSettings.list.split = $(this).val();

	chrome.storage.local.set({"shine": currentSettings}, function(){
		
		if( $('html').hasClass("shine-list") && !$('html').hasClass("shine-list-classic") ){

			$('html').removeClass("shine-split-7030 shine-split-6040 shine-split-5050 shine-split-4060 shine-split-3070");
			
			$('html').addClass("shine-split-" + currentSettings.list.split);
			
		}

		saveSettingsMessage();

	});

});


// CLICKING THE GRID VIEW SWITCHER

$('body').on('click','.grid-switch', function(){

	if( window.location.href.indexOf("/r/") == -1 && window.location.href.indexOf("/m/") == -1 ){

		currentSettings.global.layout = "grid";

	}else if( $('.pagename a').attr("href").indexOf("/r/") != -1 ) {

		// we're in a subreddit
		if( currentSettings.subreddits.length > 0 ){

			foundIt = false;

			for(i = 0; i < currentSettings.subreddits.length; i++){

				urlToCheck = currentSettings.subreddits[i].url;

				if( $('.pagename a').attr("href").indexOf( urlToCheck ) != -1 ){

					currentSettings.subreddits[i].layout = "grid";
					foundIt = true;
					break;

				}

			}

			if( foundIt == false ){

				defaultToAdd = {"url" : $('.pagename a').attr("href").replace("https://","").replace("http://","") , "layout" : "grid"};

				currentSettings.subreddits.push( defaultToAdd );

			}

		}else{

			defaultToAdd = {"url" : $('.pagename a').attr("href").replace("https://","").replace("http://","") , "layout" : "grid"};

			currentSettings.subreddits.push( defaultToAdd );

		}

	}else if( $('.pagename a').attr("href").indexOf("/m/") != -1 ){

		// we're in a multireddit
		if( currentSettings.multireddits.length > 0 ){

			foundIt = false;

			for(i = 0; i < currentSettings.multireddits.length; i++){

				urlToCheck = currentSettings.multireddits[i].url;

				if( $('.pagename a').attr("href").indexOf( urlToCheck ) != -1 ){

					currentSettings.multireddits[i].layout = "grid";
					foundIt = true;
					break;

				}

			}

			if( foundIt == false ){

				defaultToAdd = {"url" : $('.pagename a').attr("href").replace("https://","").replace("http://","") , "layout" : "grid"};

				currentSettings.multireddits.push( defaultToAdd );

			}

		}else{

			defaultToAdd = {"url" : $('.pagename a').attr("href").replace("https://","").replace("http://","") , "layout" : "grid"};

			currentSettings.multireddits.push( defaultToAdd );

		}

	}

	chrome.storage.local.set({"shine": currentSettings}, function(){

		location.reload();

	});

});

// CLICKING THE LIST VIEW SWITCHER

$('body').on('click','.list-switch', function(){

	if(  window.location.href.indexOf("/r/") == -1 && window.location.href.indexOf("/m/") == -1  ){

		currentSettings.global.layout = "list";

	}else if( $('.pagename a').attr("href").indexOf("/r/") != -1 ) {

		// we're in a subreddit
		if( currentSettings.subreddits.length > 0 ){

			foundIt = false;

			for(i = 0; i < currentSettings.subreddits.length; i++){

				urlToCheck = currentSettings.subreddits[i].url;

				if( $('.pagename a').attr("href").indexOf( urlToCheck ) != -1 ){

					currentSettings.subreddits[i].layout = "list";
					foundIt = true;
					break;

				}

			}

			if( foundIt == false ){

				defaultToAdd = {"url" : $('.pagename a').attr("href").replace("https://","").replace("http://","") , "layout" : "list"};

				currentSettings.subreddits.push( defaultToAdd );

			}

		}else{

			defaultToAdd = {"url" : $('.pagename a').attr("href").replace("https://","").replace("http://","") , "layout" : "list"};

			currentSettings.subreddits.push( defaultToAdd );

		}

	}else if( $('.pagename a').attr("href").indexOf("/m/") != -1 ){

		// we're in a multireddit
		if( currentSettings.multireddits.length > 0 ){

			foundIt = false;

			for(i = 0; i < currentSettings.multireddits.length; i++){

				urlToCheck = currentSettings.multireddits[i].url;

				if( $('.pagename a').attr("href").indexOf( urlToCheck ) != -1 ){

					currentSettings.multireddits[i].layout = "list";
					foundIt = true;
					break;

				}

			}

			if( foundIt == false ){

				defaultToAdd = {"url" : $('.pagename a').attr("href").replace("https://","").replace("http://","") , "layout" : "list"};

				currentSettings.multireddits.push( defaultToAdd );

			}

		}else{

			defaultToAdd = {"url" : $('.pagename a').attr("href").replace("https://","").replace("http://","") , "layout" : "list"};

			currentSettings.multireddits.push( defaultToAdd );

		}

	}

	chrome.storage.local.set({"shine": currentSettings}, function(){

		location.reload();

	});

});

// DELETE DEFAULT VIEW BUTTON
$('body').on('click','.remove-subreddit-default',function(){

	for( i = 0; i < currentSettings.subreddits.length; i++ ){

		if( currentSettings.subreddits[i].url == $(this).data("url") ){

			currentSettings.subreddits.splice(i, 1);

			chrome.storage.local.set({"shine": currentSettings}, function(){

				saveSettingsMessage();

			});

			$(this).parents("li").remove();
		}

	}

});

$('body').on('click','.remove-multireddit-default',function(){

	for( i = 0; i < currentSettings.multireddits.length; i++ ){

		if( currentSettings.multireddits[i].url == $(this).data("url") ){

			currentSettings.multireddits.splice(i, 1);

			chrome.storage.local.set({"shine": currentSettings}, function(){

				saveSettingsMessage();

			});

			$(this).parents("li").remove();
		}

	}

});


$('body').on('change','#settings-number-columns',function(){

	currentSettings.grid.columns = $(this).val();

	chrome.storage.local.set({"shine": currentSettings}, function(){

		if( $('html').hasClass("shine-grid") ){

			$('head').find('#shine-card-width').remove();

			thingWidth = screen.width / ( parseInt(currentSettings.grid.columns) + 1);

			$('head').append(''+

				'<style id="shine-card-width" type="text/css">'+
					'html.SHINE.shine-grid body > .content #siteTable .thing{'+
						'width:' + thingWidth + 'px;'+
					'}'+
					'html.SHINE.shine-grid body > .content #siteTable .thing .preview{'+
						'width:' + thingWidth + 'px;'+
						'flex-basis:' + thingWidth + 'px;'+
					'}'+
				'</style>'

			);

		}

		saveSettingsMessage();

	});

});

$('body').on('change','#settings-night-mode',function(){

	if( $(this).val() == "on" ){

		currentSettings.global.night = "on";

		chrome.storage.local.set({"shine": currentSettings}, function(){

			if( !$('#nightSwitchToggleContainer').hasClass("enabled") ){

				$('#nightSwitchToggleContainer').click();

			}

			$('html').addClass("res-nightmode");
			$('body').addClass("res-nightmode");
			
			$('html').removeClass("cleandark");
			$('body').removeClass("cleandark");

			saveSettingsMessage();

		});

	}else if( $(this).val() == "dark" ){

		currentSettings.global.night = "dark";

		chrome.storage.local.set({"shine": currentSettings}, function(){

			if( !$('#nightSwitchToggleContainer').hasClass("enabled") ){

				$('#nightSwitchToggleContainer').click();

			}

			$('html').addClass("res-nightmode");
			$('body').addClass("res-nightmode");

			$('html').addClass("cleandark");
			$('body').addClass("cleandark");

			saveSettingsMessage();

		});

	}else{

		currentSettings.global.night = "off";

		chrome.storage.local.set({"shine": currentSettings}, function(){

			if( $('#nightSwitchToggleContainer').hasClass("enabled") ){

				$('#nightSwitchToggleContainer').click();

			}

			$('html').removeClass("res-nightmode");
			$('body').removeClass("res-nightmode");
			
			$('html').removeClass("cleandark");
			$('body').removeClass("cleandark");

			saveSettingsMessage();

		});

	}

});

$('body').on('change','#settings-show-nsfw', function(){

	if( $(this).val() == "no" ){

		currentSettings.grid.nsfw = "no";

		chrome.storage.local.set({"shine": currentSettings}, function(){

			$('html').addClass("shine-hide-nsfw");

			saveSettingsMessage();

		});

	}else{

		currentSettings.grid.nsfw = "yes";

		chrome.storage.local.set({"shine": currentSettings}, function(){

			$('html').removeClass("shine-hide-nsfw");

			saveSettingsMessage();

		});

	}

});













$('*[data-res-css]').attr("style","");

















/* SHINE LIGHT STUFF */

$(window).scroll(function() {
    if ($(document).scrollTop() > 100) {
        $('html').addClass("shine-scrolling");
    }
    else {
        $('html').removeClass("shine-scrolling");
    }
});