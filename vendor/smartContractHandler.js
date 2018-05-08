"use strict";

//change dapp address to deployed smart contract
var dappAddress = "n1oXdmwuo5jJRExnZR5rbceMEyzRsPeALgm";

var nebulas = require("nebulas"),
  Account = nebulas.Account,
  neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

$("#submitBtn").click(function () {

  var from = Account.NewAccount().getAddressString();
  console.log(from);

  var value = "0";
  var nonce = "0";
  var gas_price = "1000000";
  var gas_limit = "2000000";
  var callFunction = "get";
  //change arguments to whatever my smart contract needs 
  var callArgs = "[\"" + $("#search_value").val() + "\"]"; //in the form of ["args"]
  var contract = {
    "function": callFunction,
    "args": callArgs
  }

  neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
    cbSearch(resp)
  }).catch(function (err) {
    //cbSearch(err)
    console.log("error:" + err.message)
  })
});

//return of search,
function cbSearch(resp) {
  var result = resp.result;    //resp is an object, resp.result is a JSON string
  console.log("return of rpc call: " + JSON.stringify(result));

  if (result === 'null') {
    //let user know they don't have any items
  } else {
    //if result is not null, then it should be "return value" or "error message"
    try {
      result = JSON.parse(result)
    } catch (err) {
      //result is the error message
    }

    if (!!result.key) {      //"return value"

      // $("#search_banner").text($("#search_value").val())
      // $("#search_result").text(result.value)
      // $("#search_result_author").text(result.author)

    } else {        //"error message"

      // $("#search_banner").text($("#search_value").val())
      // $("#search_result").text(result)
      // $("#search_result_author").text("")
    }
  }
};