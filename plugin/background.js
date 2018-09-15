// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
        console.log("The color is green.");
    });
/*
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'developer.chrome.com'},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
*/
});

//TODO: if message arrives change icon to not trusted

function log(){
    updateIcon();
    console.log("url: " + chrome.runtime.getURL("images/myimage.png"));
}

function updateIcon(request) {
    if(request == 1){
        chrome.browserAction.setIcon({path: 'images/declined128.png'});
        alert("Attention: this page could contain fake news!");
    } else {
        chrome.browserAction.setIcon({path: 'images/get_started128.png'});
    }

    //chrome.browserAction.setBadgeText({text:"100"});
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      updateIcon(request);
      console.log("received value " + request);
      sendResponse(request);
  });
