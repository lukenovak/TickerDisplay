//testing that this file was run
console.log("display.js triggered");

// test of getting the text
console.log($("p.title:first a[data-event-action = title]").text());

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
function getPrice(ticker) {

  var defaultPrice = 1;
  var url = 'https://api.iextrading.com/1.0/stock/' +
            ticker + '/quote';
  // gets the JSON
  var priceJSON = $.getJSON(url, function(data) {
    var price = data.latestPrice;
    // calls the function that displays the price
    displayPrice(price, ticker);
    });
}

// gets the current price of a ticker if there is one
function getPriceIfPresent(title) {
  var ticker = getTickersIfPresent(title);
  if (ticker !== "No stocks in this post") {
    var price = getPrice(ticker);
    return price;
  }
  else {
    return "No stocks in this post";
  }
}

// displays the price on the page by inserting it next to the title
function displayPrice(price, ticker) {
  //jQuery gets the tile area and puts the price there
  $(".top-matter").after("<p>" + ticker + " $" + price + "</p>")
}

// function call that calls the function to display the price
getPriceIfPresent($("p.title:first a[data-event-action = title]").text())
