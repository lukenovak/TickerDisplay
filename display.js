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
  for (var i = 0;
      i < title.length;
      i= i + 1) {
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
  for (var i = 0;
  i < title.length;
  i = i + 1) {
    if (title.charAt(i) == "$") {
      // records the ticker, goes until it finds a non-letter
      for (var j = i + 1;
      j <= i + 4;
      j = j + 1) {
        if (isLatinLetter(title.charAt(j))) {
          ticker = ticker + title.charAt(j);
        }
        else {
          break;
        }
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
  // TODO: Find another way to remove the api key here
  var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY' +
            '&symbol=' + ticker + '&apikey=IPXXZJEA5YWKM5CP';
  console.log(url);
  // gets the JSON
  var priceJSON = $.getJSON(url, function(data) {
    console.log("running function")
    // navigating the JSON to get the price
    var priceData = data["Time Series (Daily)"];
    var priceString = priceData[formattedDate()]["4. close"];
    return priceString;
    console.log(priceString);
  });
  return priceJSON;
}

console.log(getPrice("MU"))
// gets the current price of a ticker if there is one
function getPriceIfPresent(title) {
  var ticker = getTickersIfPresent(title);
  if (ticker !== "No stocks in this post") {
    console.log(true);
    console.log(ticker);
    var price = getPrice(ticker);
    return price;
  }
  else {
    console.log(false);
    return "No stocks in this post";
  }
}

console.log(
  getPriceIfPresent($("p.title:first a[data-event-action = title]").text()));
