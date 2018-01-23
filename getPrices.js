// gets the price of the stock when a post was posted and
// compares it to the current price of the stock

// test to make sure that this js file is running on the proper pages
console.log("getPrices.js triggered");

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
  // gets the JSON
  var priceJSON = $.getJSON(url, function(data) {
    // navigating the JSON to get the price
    var priceData = data["Time Series (Daily)"]
    var priceString = priceData[formattedDate()]["4. close"]
    return priceString;
  });
  console.log(priceJSON);
  return priceJSON;
}

console.log(getPrice("MU"));
