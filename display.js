// String of length = 1 -> Boolean
// is this character a letter in the latin alphabet?
function isLatinLetter(letter) {
  letter += "";
  return (letter.length === 1 && letter.match(/[a-z]/i));
}

// identifies the first stock in the post
// only run if the post contains a stock
function stockNameInPost(title) {
  var ticker = "";
  title += "";
  // gets the stock (finds the dollar sign and records letters after)
  for (var i = 0; i < title.length; i = i + 1) {
    if (title.charAt(i) == "$") {
      // records the ticker, goes until it finds a non-letter
      for (var j = i + 1; j <= i + 4; j = j + 1) {
        if (isLatinLetter(title.charAt(j))) {
          ticker = ticker + title.charAt(j);
        }
        else {
          break;
        }
      }
      if (ticker.length > 1) {
        break;
      }
    }
  }
    return ticker;
}

// gets the current price of a given stock
// the input ticker must be a string
function getAndDisplayPrice(title, post) {
  var ticker = stockNameInPost(title)
  var defaultPrice = 1;
  var url = 'https://api.iextrading.com/1.0/stock/' +
            ticker + '/quote';
  // gets the JSON
  if (ticker.length > 0) {
    var priceJSON = $.getJSON(url, function(data) {
      // this code only runs on success
      // calls the function that displays the price
      displayPrice(data, post);
      defaultPrice = data.latestPrice;
      return defaultPrice;
      });
    }
}

// returns the box that should be displayed for the
function displayPrice(data, post) {
  var price = data.latestPrice;
  // if the price is greater than 1000 then we will just round to the dollar
  if (price > 1000) {
    price = Number(price.toFixed(0))
  }
  var ticker = data.symbol;
  // are we representing our data as percents or dollars
  var percent = true;
  chrome.storage.sync.get(["isPercent"], function(item) {
    console.log(item.isPercent);
    percent = item.isPercent;
    if (percent) {
      var change = data.changePercent;
    }
    else {
      var change = data.change;
    }
    var htmlInsert = buildTickerBox(price, ticker, change, percent);
    post.prepend(htmlInsert);
  })
}

// Builds a string that contains the html to be inserted into the pageX
function buildTickerBox(price, ticker, change, isPercent) {
  var htmlString = "";
  var changeString = "";
  if (isPercent) {
    changeString = percentChangeString(change);
  }
  else {
    changeString = dollarChangeString(change);
  }
  htmlString = "<div class=\"box-stock "
  // if statement (box and text should be green if stock is up, red if down)
  if (change > 0) {
    //adds the div wrapper
    htmlString = htmlString + "stock-up\">";
  }
  else {
    htmlString = htmlString + "stock-down\">";
  }
  // adds the text inside the divider
  htmlString = htmlString + "<p>" + ticker + " $" + price
                          + "<br>" + changeString + "</p>";
  // ends the divider
  htmlString = htmlString + "</div>";
  return htmlString;
}

// creates a percent change string from the percent change dataType
function percentChangeString(percentChange) {
  percentChange = Number((percentChange * 100).toFixed(2)); // rounds to 3 decmial pts
  var percentString = "";
  if (percentChange > 0) {
    percentString = "+" + percentChange + "%";
  }
  else {
    percentString = percentChange + "%";
  }
  return percentString;
}

// creates a dollar change string from dollar change data
function dollarChangeString(dollarChange) {
  dollarChange = Number(dollarChange.toFixed(2)); //rounds to the cent
  var dollarString;
  if (dollarChange > 0) {
    dollarString = "+ $" + dollarChange;
  }
  else {
    dollarChange = dollarChange * -1;
    dollarString = "- $" + dollarChange;
  }
  return dollarString;
}

// function call that calls the function to display the price
$(".top-matter").each(function(index, value) {
  var post = $(this).find($("p.title a[data-event-action = title]"));
  var toBeInserted = getAndDisplayPrice(post.text(), $(this));
});
