// builds the scrolling ticker bar
function addTickerBar() {
  var bar = document.createElement("div");
  bar.className = "ticker-bar";
  document.body.append(bar);
}

function textThing() {
  var bar = document.getElementsByClassName("ticker-bar");
  bar = bar[0];
  var para = document.createElement("p");
  para.appendChild(document.createTextNode("Stocks in this page:"));
  para.id = "stockPara";
  bar.appendChild(para);
};

// adds the stocks that are in this page to the ticker
function addPageStocksToTicker() {
  console.log("running")
  $(".top-matter").each(function (index, value) {
    var title = $(this).find($("p.title a")).text();
    console.log(title);
    var ticker = stockNameInPost(title);
    console.log(ticker);
    if (ticker != "") {
      var node = document.createTextNode(" " + ticker + " |");
      document.getElementById("stockPara").appendChild(node);
    }
  });
}

chrome.storage.sync.get({
  // uses true as a default value
  isTicker: true
}, function(items) {
  if (items.isTicker) {
    window.onload = function() {
      addTickerBar();
      textThing();
      addPageStocksToTicker();
    };
  }
});
