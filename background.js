chrome.browserAction.onClicked.addListener(function(){
    var newURL = "http://www.reddit.com/";
    chrome.tabs.create({ url: newURL });
});