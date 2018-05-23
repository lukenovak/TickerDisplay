// Represents a Post, currently not used
function Post(title) {
  var title = title;
}

// String of length = 1 -> Boolean
// is this character a letter in the latin alphabet?
function isLatinLetter(letter) {
  letter += "";
  return (letter.length === 1 && letter.match(/[a-z]/i));
}

// String -> Boolean
// does the string contain a stock?
// a stock is defined as a sequence of the following:
// A dollar sign ("$") followed by a sequence of 1-5 letters
function containsStock(title) {
  // making sure that title is a string
  title += "";
  // has a stock been found?
  var stockFound = false;
  for (var i = 0; i < title.length; i= i + 1) {
    if (title.charAt(i) == "$") {
      if (isLatinLetter(title.charAt(i + 1))) {
        stockFound = true;
        break;
      }
    }
  }
  return stockFound;
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

// gets the tickers from a post only if it has one
function getTickersIfPresent(title) {
  if (containsStock(title)) {
    return stockNameInPost(title);
  }
  else return "No stocks in this post";
}

// Post -> String -> Number
// how many days ago was this post made
function getDate() {
  var date = $("p.tagline time").attr("title");
  // parses the date based on what date has fed it
  // ** see Date.parse documentation for more info here **
  return Date.parse(date);
}

// gets the current date and formats for the api
function formattedDate() {
  // generation of the date and getting the data to be formatted
  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();

  // adds the 0 before the month if it's only one digit
  if (month < 10) {
    month = "0" + month;
  }

  // formatting the date
  var dateInFormat = year + "-" + month + "-" + day;
  return dateInFormat;
}

// gets the current price of a given stock
// the input ticker must be a string
function getPrice(ticker, post) {
  var html = "no price present"
  var defaultPrice = 1;
  var url = 'https://api.iextrading.com/1.0/stock/' +
            ticker + '/quote';
  // gets the JSON
  var priceJSON = $.getJSON(url, function(data) {
    // this code only runs on success
    // calls the function that displays the price
    displayPrice(data, post);
    });
  return priceJSON;
}

// gets the current price of a ticker if there is one
function getPriceIfPresent(title, post) {
  var ticker = getTickersIfPresent(title);
  if (ticker !== "No stocks in this post") {
    var price = getPrice(ticker, post);
    return price;
  }
  else {
    return "No stocks in this post";
  }
}

// returns the box that should be displayed for the
function displayPrice(data, post) {
  if (post == null) {
    return;
  }
  var price = data.latestPrice;
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
  if (change <= 0) {
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
  percentChange = Number((percentChange * 100).toFixed(3)); // rounds to 3 decmial pts
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
  var dollarString = "$";
  if (dollarChange > 0) {
    dollarString = "+ " + dollarString + dollarChange;
  }
  else {
    dollarChange = dollarChange * -1;
    dollarString = "- " + dollarString + dollarChange;
  }
  return dollarString;
}


// function call that calls the function to display the price
$(".top-matter").each(function(index, value) {
  var title = $(this).find($("p.title a[data-event-action = title]")).text()
  var toBeInserted = getPriceIfPresent(title, $(this));
});
