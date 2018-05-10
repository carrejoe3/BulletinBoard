"use strict";

//change dapp address to deployed smart contract
var dappAddress = "n1tLCrAi5FWxbvLDnRoy11aoVWTk5tc3sKQ";

var nebulas = require("nebulas"),
  Account = nebulas.Account,
  neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

function getBulletins() {
  let from = $("#addressInput").val();
  let value = "0";
  let nonce = "0";
  let gas_price = "1000000";
  let gas_limit = "2000000";
  let callFunction = "get";
  let callArgs = "[\"" + from + "\"]"; //in the form of ["args"]
  let contract = {
    "function": callFunction,
    "args": callArgs
  };

  neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
    cbSearch(resp);
  }).catch(function (err) {
    //cbSearch(err)
    console.log("error:" + err.message);
  })
};

function setBulletin() {
  let from = $("#addressInput").val();
  let value = "0";
  let nonce = "0";
  let gas_price = "1000000";
  let gas_limit = "2000000";
  let callFunction = "set";
  let callArgs = "[\"" + from + "\",\"" + $("#bulletinMainContent").val() + "\"]"; //in the form of ["args"]
  let contract = {
    "function": callFunction,
    "args": callArgs
  };

  neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
    cbSearch(resp);
  }).catch(function (err) {
    //cbSearch(err)
    console.log("error:" + err.message);
  })
};

function cbSearch(resp) {
  //resp is an object, resp.result is a JSON string
  var result = resp.result;
  console.log(resp);
  console.log("return of rpc call: " + JSON.stringify(result));

  if (result === 'null') {
    //let user know they don't have any items
  } else {
    //if result is not null, then it should be "return value" or "error message"
    try {
      result = JSON.parse(result);
    } catch (err) {
      //result is the error message
      console.log(err);
    }
    if (!!result.key) {
      //"return value"
      console.log('Saved bulletin: ' + result);
    } else {
      //"error message"
    }
  }
};