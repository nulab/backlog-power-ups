// var QueueWorker = function() {
//   this.queues = [];
//   this.tabId = null;
//   this.loaded = false;
//   this.push = function(details) {
//     this.queues.push(details);
//     this.notify();
//   }
//
//   this.notify = function() {
//     if(this.tabId === null || !this.loaded) {
//       return;
//     }
//     while (this.queues.length != 0) {
//       var details = this.queues.shift();
//       chrome.tabs.sendMessage(this.tabId, details, function(response){
//         if (chrome.runtime.lastError) {
//           console.log("chrome.runtime.lastError" + chrome.runtime.lastError.message);
//         }
//       });
//     }
//   }
// }
// var worker = new QueueWorker();
//
// function check(tabId, changeInfo, tab) {
//   if (tab.url.indexOf('backlog.jp') > 0
//       || tab.url.indexOf('backlogtool.com') > 0
//       || tab.url.indexOf('backlog.com') > 0) {
//     // chrome.pageAction.show(tabId);
//     if (tab.status === 'complete') {
//       worker.tabId = tabId;
//       worker.notify();
//     }
//   }
// };
// chrome.tabs.onUpdated.addListener(check);
// chrome.runtime.onMessage.addListener(function(request, sender, callback) {
//   if(request.message === "unload") {
//     worker.tabId = null;
//     worker.loaded = false;
//   } else if(request.message === "loaded") {
//     worker.loaded = true;
//     worker.notify();
//   }
// });
// chrome.webRequest.onHeadersReceived.addListener(function (details) {
//     if(details.statusCode !== 302) {
//       worker.push(details);
//     }
//   }, {
//     urls: ["https://*.backlog.jp/*", "https://*.backlog.com/*", "https://*.backlogtool.com/*"],
//     types: ["main_frame", "xmlhttprequest"]
//   }, ["responseHeaders"]
// );
