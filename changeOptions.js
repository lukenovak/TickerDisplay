
// gets user options
function getUserOptions() {
  var options = document.getElementsByName("percent?");
  var options2 = document.getElementById("ticker?");
  var percent;
  var ticker;
  // since we only have two options for now we can iterate
  if (options[0].checked) {
    percent = true;
  }
  if (options[1].checked) {
    percent = false;
  }
  if (options2.checked) {
    ticker = true;
  }
  if (!options2.checked) {
    ticker = false;
  }
  chrome.storage.sync.set({
    isPercent: percent,
    isTicker: ticker
  }, function() {
    var statusUpdate = "Settings saved";
    document.getElementById("submit-button").append(statusUpdate);
  });
}

// sets the listener so this is active
function setListeners() {
  var button = document.getElementById("submitButton");
  button.addEventListener("click",
    function(event){
      getUserOptions();
    });
}

//ensures that the above function isn't called until everything is loaded
document.addEventListener("DOMContentLoaded", function(event){
  setListeners();
  resetUserOptions();
})

// resets options to what the user currently has set
function resetUserOptions() {
  var isPercent =
  chrome.storage.sync.get({
    // uses true as a default value
    isPercent: true,
    isTicker: true
  }, function(items) {
    if (items.isPercent) {
      document.getElementById("percentOrDollars1").checked = true;
    }
    if (!items.isPercent) {
      document.getElementById("percentOrDollars2").checked = true;
    }
    if (items.isTicker) {
      document.getElementById("ticker?").checked = true;
    }
    if (!items.isTicker) {
      document.getElementById("ticker?").checked = false;
    }
  });
}
