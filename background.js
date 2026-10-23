// Service worker — keeps extension alive
chrome.runtime.onInstalled.addListener(() => {
  console.log("IRCTC Fast Filler installed!");
});