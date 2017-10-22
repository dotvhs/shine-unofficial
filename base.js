// GLOBAL RESETS AND FIXES 
$('body').removeClass("listing-chooser-collapsed");

$('head').append('<link href="//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css" rel="stylesheet" />');

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

var commentNumber; // For numbering comments


// creating the default settings variable if they havn't saved any settings yet
var defaultSettings = {
	"global" : {
		"layout" : "list", 
		"shortcuts" : "show", 
		"theme" : "legacy-white", 
		"sidebar" : "", 
		"multis" : "",
		"color" : "orange"
	},

    "list" :  {"split" : "6040", "columns" : "two"},

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

    "account" : {
    	"status" : "shinebright"
    },

    "message" : "",

    "version" : {
    	"current" : "",
    	"updateinfo" : "show",
    	"dismissed" : "no"
    }

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

	if(!currentSettings.version){

		var changelogSettings = {
			"version" : {
		    	"current" : "",
		    	"updateinfo" : "show",
		    	"dismissed" : "no"
		    }
		};

		currentSettings = $.extend(currentSettings, changelogSettings);
		chrome.storage.local.set({"shine": currentSettings});

	}

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
			'<svg class="grid-switch" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3" /></svg>'+
			'<svg class="list-switch" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3,4H21V8H3V4M3,10H21V14H3V10M3,16H21V20H3V16Z" /></svg>'+
			'<svg class="list-side-switch" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3,16h8v4H3V16z M3,14h8v-4H3V14z M3,8h8V4H3V8z M13,4v16h8V4H13z"/></svg>'+
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
				'<div data-settings-panel=".panel-theme" class="tab tab-theme">Theme Settings</div>'+
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
						'<label for="settings-shortcuts-bar">Shortcuts Bar</label>'+
						'<span class="settings-small-print">Hide or show the shortcuts bar at the top.</span>'+
						'<select name="settings-shortcuts-bar" id="settings-shortcuts-bar">'+
							'<option value="show">Show</option>'+
							'<option value="hide">Hide</option>'+
						'</select>'+
					'</div>'+
				'</div>'+
				'<div class="settings-halves">'+
					'<div class="settings-column-half">'+
						'<label for="settings-update-info">Show Update Info</label>'+
						'<span class="settings-small-print">Display information about the SHINE updates.</span>'+
						'<select name="settings-update-info" id="settings-update-info">'+
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
			'<div class="panel panel-theme">'+
				'<div class="settings-halves">'+
					'<div class="settings-column-half">'+
						'<label for="settings-main-theme">Main Theme</label>'+
						'<span class="settings-small-print">If you have RES, turn it on Night Mode for dark themes too.</span>'+
						'<div id="themeselect">'+
							'<label class="legacy-white">'+
								'<input type="radio" name="settings-main-theme" value="legacy-white">'+
								'<div class="foreground"><span>Aa</span>'+
									'<div class="background"></div>'+
									'<div class="secondary"></div>'+
								'</div>'+
								'<div class="theme-name">Legacy White</div>'+
							'</label>'+
							'<label class="legacy-night">'+
								'<input type="radio" name="settings-main-theme" value="legacy-night">'+
								'<div class="foreground"><span>Aa</span>'+
									'<div class="background"></div>'+
									'<div class="secondary"></div>'+
								'</div>'+
								'<div class="theme-name">Legacy Night</div>'+
							'</label>'+
							'<label class="violet">'+
								'<input type="radio" name="settings-main-theme" value="violet">'+
								'<div class="foreground"><span>Aa</span>'+
									'<div class="background"></div>'+
									'<div class="secondary"></div>'+
								'</div>'+
								'<div class="theme-name">Violet Dark</div>'+
							'</label>'+
							'<label class="material">'+
								'<input type="radio" name="settings-main-theme" value="material">'+
								'<div class="foreground"><span>Aa</span>'+
									'<div class="background"></div>'+
									'<div class="secondary"></div>'+
								'</div>'+
								'<div class="theme-name">Material Dark</div>'+
							'</label>'+
							'<label class="blue">'+
								'<input type="radio" name="settings-main-theme" value="blue">'+
								'<div class="foreground"><span>Aa</span>'+
									'<div class="background"></div>'+
									'<div class="secondary"></div>'+
								'</div>'+
								'<div class="theme-name">Night Time</div>'+
							'</label>'+
							'<label class="brown">'+
								'<input type="radio" name="settings-main-theme" value="brown">'+
								'<div class="foreground"><span>Aa</span>'+
									'<div class="background"></div>'+
									'<div class="secondary"></div>'+
								'</div>'+
								'<div class="theme-name">Milk Chocolate</div>'+
							'</label>'+
							'<label class="gray">'+
								'<input type="radio" name="settings-main-theme" value="gray">'+
								'<div class="foreground"><span>Aa</span>'+
									'<div class="background"></div>'+
									'<div class="secondary"></div>'+
								'</div>'+
								'<div class="theme-name">Pale Gray</div>'+
							'</label>'+
							'<label class="dark">'+
								'<input type="radio" name="settings-main-theme" value="dark">'+
								'<div class="foreground"><span>Aa</span>'+
									'<div class="background"></div>'+
									'<div class="secondary"></div>'+
								'</div>'+
								'<div class="theme-name">Mono Dark</div>'+
							'</label>'+
							'<label class="black">'+
								'<input type="radio" name="settings-main-theme" value="black">'+
								'<div class="foreground"><span>Aa</span>'+
									'<div class="background"></div>'+
									'<div class="secondary"></div>'+
								'</div>'+
								'<div class="theme-name">Pure Black</div>'+
							'</label>'+
						'</div>'+
					'</div>'+
					'<div class="settings-column-half">'+
						'<label for="settings-color-theme">Color Selector</label>'+
						'<span class="settings-small-print">Pick your color accent.</span>'+
						'<div id="colorselect">'+
							'<label class="color red">'+
							  '<input type="radio" name="settings-color-theme" value="red">'+
							  '<div class="button"><span></span></div>'+
							'</label>'+
							'<label class="color orange">'+
							  '<input type="radio" name="settings-color-theme" value="orange">'+
							  '<div class="button"><span></span></div>'+
							'</label>'+
							'<label class="color amber">'+
							  '<input type="radio" name="settings-color-theme" value="amber">'+
							  '<div class="button"><span></span></div>'+
							'</label>'+
							'<label class="color lime">'+
							  '<input type="radio" name="settings-color-theme" value="lime">'+
							  '<div class="button"><span></span></div>'+
							'</label>'+
							'<label class="color greenlight">'+
							  '<input type="radio" name="settings-color-theme" value="greenlight">'+
							  '<div class="button"><span></span></div>'+
							'</label>'+
							'<label class="color teal">'+
							  '<input type="radio" name="settings-color-theme" value="teal">'+
							  '<div class="button"><span></span></div>'+
							'</label>'+
							'<label class="color cyan">'+
							  '<input type="radio" name="settings-color-theme" value="cyan">'+
							  '<div class="button"><span></span></div>'+
							'</label>'+
							'<label class="color blue">'+
							  '<input type="radio" name="settings-color-theme" value="blue">'+
							  '<div class="button"><span></span></div>'+
							'</label>'+
							'<label class="color indigo">'+
							  '<input type="radio" name="settings-color-theme" value="indigo">'+
							  '<div class="button"><span></span></div>'+
							'</label>'+
						'</div>'+
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
							'<option value="6">Six</option>'+
							'<option value="7">Seven</option>'+
							'<option value="8">Eight</option>'+
							'<option value="9">Nine</option>'+
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


	$('body').append(''+
		'<div class="changelog-panel">'+
			'<div class="update">'+
				'<h2>SHINE for Reddit (unofficial) by vhs (u/voythas)</h2>'+
				'<h3>Version 1.5.0</h3>'+
				'<ul class="updates">'+
					'<li class="new">Theme and color selector</li>'+
					'<li class="new">Support for clips.twitch.tv (both grid and list)</li>'+
					'<li class="new">Support for few NSFW sources: pornhub.com, xhamster.com and xvideos.com (list view only for now)</li>'+
					'<li class="new">This neat little window and updates notifications (you can disable them in options if you find this annoying)</li>'+
					'<li class="enh">Third view type is now accessible without going to the options</li>'+
					'<li class="enh">"Hide Child Comments" should be more accessible in side comments view</li>'+
					'<li class="enh">Many icons were changed and should be more crips now</li>'+
					'<li class="enh">Replaced post icons to a themeable versions</li>'+
					'<li class="enh">v.redd.it support for Grid</li>'+
					'<li class="enh">It\'s now possible to select more columns in grid mode</li>'+
					'<li class="enh">Changed lines icon to Reddit Snu</li>'+
					'<li class="enh">Replaced SHINE text with Reddit Snu</li>'+
					'<li class="enh">Small animation on hover</li>'+
					'<li class="enh">A bit more color integration with RES</li>'+
					'<li class="fix">Vimeo in grid mode is now fixed</li>'+
					'<li class="fix">Facebook image fixes</li>'+
					'<li class="fix">Small margin fixes for Firefox</li>'+
					'<li class="fix">Premium features unlocked for everyone</li>'+
					'<li class="fix">A lot of other fixes I can\'t really remember now</li>'+
					'<li class="rem">Removed Clean Dark Theme</li>'+
					'<li class="rem">All SVG files got removed</li>'+
					'<li class="rem">All unnecessary files were removed (jpg pictures and stuff)</li>'+
					'<li class="bug">Known bugs: Due to many changes, old nightmode (Legacy Night) is not looking as it should, I\'m really sorry, it will be fixed in next version. Please, use any other black themes for now.</li>'+
				'</ul>'+
				'<h3>Version 1.4.5.5</h3>'+
				'<ul class="updates">'+
					'<li class="new">Support for streamable.com (thanks to u/itzblitz94)</li>'+
					'<li class="new">Support for v.redd.it (list view only)</li>'+
					'<li class="new">Clean Dark theme added</li>'+
					'<li class="new">Premium features unlocked</li>'+
					'<li class="fix">Fixed Imgur loading</li>'+
					'<li class="rem">Removed Google Analytics</li>'+
				'</ul>'+
			'</div>'+
		'</div>'
	);




	/* SETTINGS BAR */

	if( currentSettings.global.shortcuts == "hide" ){

		$('#settings-shortcuts-bar').val("hide");

	}else{

		$('html').addClass("show-shortcuts");

	}

	/* UPDATE INFO */

	if( currentSettings.version.updateinfo == "hide" ){

		$('#settings-update-info').val("hide");

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

	//$('#settings-main-theme').val( currentSettings.global.night );

	$('input[type="radio"][name="settings-main-theme"][value="'+currentSettings.global.theme+'"]').attr('checked', true);

	/* COLOR THEME */

	//$('input[type=radio][name=settings-color-theme]:checked').val( currentSettings.global.color );
	$('input[type="radio"][name="settings-color-theme"][value="'+currentSettings.global.color+'"]').attr('checked', true);

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


	if( currentSettings.global.theme == undefined || currentSettings.global.theme == "" ){
		if (currentSettings.global.night == "on") {
			currentSettings.global.theme = "legacy-night";
		} else {
			currentSettings.global.theme = "legacy-white";
		}
	}


	// this adds the nightmode class
	if( currentSettings.global.theme == "legacy-night" ){
		$('html').addClass("res-nightmode");
		$('body').addClass("res-nightmode");
	}else if( currentSettings.global.theme == "legacy-white" ){
		$('html').removeClass("res-nightmode");
		$('body').removeClass("res-nightmode");
	}else{
		$('html').addClass("res-nightmode theme-"+currentSettings.global.theme);
		$('body').addClass("res-nightmode theme-"+currentSettings.global.theme);
	}


	// this adds the nightmode class
	if( currentSettings.global.color == undefined || currentSettings.global.color == "" ){
		$('html').addClass("color-orange");
		$('body').addClass("color-orange");
		currentSettings.global.color = "orange";
	}else{
		$('html').addClass("color-"+currentSettings.global.color);
		$('body').addClass("color-"+currentSettings.global.color);	
	}





	// this adds hide nsfw class

	if( currentSettings.grid.nsfw == "no" ){
		$('html').addClass("shine-hide-nsfw");
	}


	// this adds a class to the html that says if we've paid or not
	$('html').addClass( currentSettings.account.status );



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
			$.getScript( chrome.extension.getURL("shine-shortcuts.js") );

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
				
				$('html').addClass("shine-splitheme-" + currentSettings.grid.split);
				
			}
			
			

		}else if( whichView == "list" ){

			if(currentSettings.list.columns == "two"){
				$('html').addClass("shine-list-classic");
			}			

			$.getScript( chrome.extension.getURL("jquery.zoom.min.js") );
			$.getScript( chrome.extension.getURL("shine-list.js") );
			$.getScript( chrome.extension.getURL("shine-shortcuts.js") );
			
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

	$('html').addClass("SHINE");


	if (currentSettings.version.current == undefined) {
		currentSettings.version.current = "1.4.5.5";
		chrome.storage.local.set({"shine": currentSettings});
	}

	var manifest = chrome.runtime.getManifest();
	var shineVersion = manifest.version;

	$('body').append(''+
		'<div class="update-info">'+
			'<div class="update-info-content">'+
				'SHINE got updated to version '+ shineVersion +
				'<span class="open-changelog">CHANGELOG</span>'+
				'<span class="dismiss-changelog"></span>'+
			'</div>'+
		'</div>'
		);
	if (currentSettings.version.current != shineVersion && currentSettings.version.updateinfo != "hide") {
		console.info('JUST UPDATED! Old version:' + currentSettings.version.current);
		console.info('JUST UPDATED! New version:' + shineVersion);
		currentSettings.version.dismissed = "no";
		currentSettings.version.current = shineVersion;
		chrome.storage.local.set({"shine": currentSettings});
	    $('.update-info').fadeIn('fast');
	} else if (currentSettings.version.current == shineVersion && currentSettings.version.updateinfo != "hide" && currentSettings.version.dismissed != "yes"){
		$('.update-info').show();
	}


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
	$('html').removeClass("show-changelog");
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

$('body').on('click','.open-changelog', function(){

	resetInterfaces();
	$('html').toggleClass("show-changelog");
	$('.update-info').fadeOut('fast');

	currentSettings.version.dismissed = "yes";

	chrome.storage.local.set({"shine": currentSettings});


});

$('body').on('click','.dismiss-changelog', function(){

	$('.update-info').fadeOut('fast');

	currentSettings.version.dismissed = "yes";

	chrome.storage.local.set({"shine": currentSettings});

});

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


$('body').on('change','#settings-update-info', function(){

	currentSettings.version.updateinfo = $(this).val();

	chrome.storage.local.set({"shine": currentSettings}, function(){

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
		currentSettings.list.columns = "one";

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


$('body').on('click','.list-side-switch', function(){
		currentSettings.list.columns = "two";

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

$('body').on('change','input[type=radio][name=settings-main-theme]',function(){

	if( $(this).val() == "legacy-dark" ){

		currentSettings.global.theme = "legacy-dark";

		chrome.storage.local.set({"shine": currentSettings}, function(){

			if( !$('#nightSwitchToggleContainer').hasClass("enabled") ){

				$('#nightSwitchToggleContainer').click();

			}

			$('html').addClass("res-nightmode");
			$('body').addClass("res-nightmode");
			
			$('html').removeClass (function (index, className) {
			    return (className.match (/\btheme-\S+/g) || []).join(' ');
			});
			$('body').removeClass (function (index, className) {
			    return (className.match (/\btheme-\S+/g) || []).join(' ');
			});
			
			$('html').removeClass (function (index, className) {
			    return (className.match (/\bcolor-\S+/g) || []).join(' ');
			});
			$('body').removeClass (function (index, className) {
			    return (className.match (/\bcolor-\S+/g) || []).join(' ');
			});

			saveSettingsMessage();

		});

	}else if( $(this).val() == "legacy-white" ){

		currentSettings.global.theme = "legacy-white";

		chrome.storage.local.set({"shine": currentSettings}, function(){

			if( $('#nightSwitchToggleContainer').hasClass("enabled") ){

				$('#nightSwitchToggleContainer').click();

			}

			$('html').removeClass("res-nightmode");
			$('body').removeClass("res-nightmode");
			
			$('html').removeClass (function (index, className) {
			    return (className.match (/\btheme-\S+/g) || []).join(' ');
			});
			$('body').removeClass (function (index, className) {
			    return (className.match (/\btheme-\S+/g) || []).join(' ');
			});

			saveSettingsMessage();

		});

	}else{

		currentSettings.global.theme = $(this).val();

		chrome.storage.local.set({"shine": currentSettings}, function(){

			if( !$('#nightSwitchToggleContainer').hasClass("enabled") ){

				$('#nightSwitchToggleContainer').click();

			}

			$('html').addClass("res-nightmode");
			$('body').addClass("res-nightmode");
			
			$('html').removeClass (function (index, className) {
			    return (className.match (/\btheme-\S+/g) || []).join(' ');
			});
			$('body').removeClass (function (index, className) {
			    return (className.match (/\btheme-\S+/g) || []).join(' ');
			});

			$('html').addClass("theme-"+currentSettings.global.theme);
			$('body').addClass("theme-"+currentSettings.global.theme);

			saveSettingsMessage();

		});

	}

});

$('body').on('change','input[type=radio][name=settings-color-theme]',function(){

	currentSettings.global.color = $(this).val();

	chrome.storage.local.set({"shine": currentSettings}, function(){
		
		$('html').removeClass (function (index, className) {
		    return (className.match (/\bcolor-\S+/g) || []).join(' ');
		});
		$('body').removeClass (function (index, className) {
		    return (className.match (/\bcolor-\S+/g) || []).join(' ');
		});

		$('html').addClass("color-"+currentSettings.global.color);
		$('body').addClass("color-"+currentSettings.global.color);

		saveSettingsMessage();

	});

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


$('body').on('mouseover','#themeselect',function(){
	$('.dark-background').addClass("hide-bg");
});

$('body').on('mouseout','#themeselect',function(){
	$('.dark-background').removeClass("hide-bg");
});


$('body').on('mouseover','#colorselect',function(){
	$('.dark-background').addClass("hide-bg");
});

$('body').on('mouseout','#colorselect',function(){
	$('.dark-background').removeClass("hide-bg");
});




$(".menuarea").detach().appendTo('#header-bottom-left')

$('body').on('mouseover','.menuarea',function(){
	$('.menuarea').find('.drop-choices.lightdrop').addClass("inuse");
});

$("body").on('mouseout','.menuarea',function(){
	$('.menuarea').find('.drop-choices.lightdrop').removeClass("inuse");
});