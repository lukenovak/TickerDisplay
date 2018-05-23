
// gets the option on whether to have percent or dollars
function getPercentOption() {
  var options = document.getElementsByName("percent?");
  var percent;
  // since we only have two options for now we can iterate
  if (options[0].checked) {
    percent = true;
  }
  else {
    percent = false;
  }
  console.log(percent + "");
  chrome.storage.sync.set({
    isPercent: percent
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
      getPercentOption();
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
    isPercent: true
  }, function(items) {
    if (items.isPercent) {
      document.getElementById("percentOrDollars1").checked = true;
    }
    if (!items.isPercent) {
      document.getElementById("percentOrDollars2").checked = true;
    }
  });
}
