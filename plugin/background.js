// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
        console.log("The color is green.");
    });
});


function log(){
    updateIcon();
    console.log("url: " + chrome.runtime.getURL("images/myimage.png"));
}

function updateIcon(request) {
    if(request.exists == 1 || request.exists == true){
        chrome.browserAction.setIcon({path: 'images/declined128.png'});
        chrome.notifications.create( {
            type: "basic",
            title: "Fake news!",
            message: "Attention: this page could contain fake news!\nReported by:\n" + request.reporter + "\nVerified by:\n" + request.validator,
            iconUrl: "images/srf.png"
        }, function(){});
    } else {
        chrome.browserAction.setIcon({path: 'images/get_started128.png'});
    }

    //chrome.browserAction.setBadgeText({text:"100"});
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      updateIcon(request);
      console.log("received value " + request.exists);
      sendResponse(request);
  });
