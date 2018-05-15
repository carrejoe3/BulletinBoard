"use strict";

const dappAddress = "n1wZNRHBd46r2pe4MCTiTHK6c9DG624DNc9";
var intervalQuery;
const nebulas = require("nebulas"),
  Account = nebulas.Account,
  neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

var NebPay = require("nebpay");
var nebPay = new NebPay();
var serialNumber;

function getBulletins() {
  let from = $("#addressInput").val();
  let value = "0";
  let nonce = "0";
  let gas_price = "1000000";
  let gas_limit = "2000000";

  //function on smart contract to call
  let callFunction = "getBulletins";

  //function paramaters
  //in the form of ["args"]
  let callArgs = "[\"" + from + "\"]";
  let contract = {
    "function": callFunction,
    "args": callArgs
  };

  neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
    cbSearch(resp);
  }).catch(function (err) {
    console.log("error:" + err.message);
  })
};

function saveBulletins(bulletinIds, bulletinTitles) {
  let to = dappAddress;
  let value = "0";
  let callFunction = "set";
  let callArgs = "[\"" + $("#addressInput").val() + "\",\"" + bulletinIds + "\",\"" + bulletinTitles + "\"]";

  serialNumber = nebPay.call(to, value, callFunction, callArgs, {
    listener: cbPush
  });

  intervalQuery = setInterval(function () {
    funcIntervalQuery();
  }, 5000);
};

function delBulletin() {
  let from = $("#addressInput").val();
  let value = "0";
  let nonce = "0";
  let gas_price = "1000000";
  let gas_limit = "2000000";

  //function on smart contract to call
  let callFunction = "delBulletins";

  //function paramaters
  //in the form of ["args"]
  //bulletinId generated in main.js
  let callArgs = "[\"" + from + "\"]";
  let contract = {
    "function": callFunction,
    "args": callArgs
  };

  neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
    console.log("delete bulletin response: " + resp.result)
  }).catch(function (err) {
    console.log("error:" + err.message);
  })
};

function cbPush(resp, type) {
  console.log("response of push: " + JSON.stringify(resp))
};

function cbSearch(resp, type) {
  //resp is an object, resp.result is a JSON string
  var result = resp.result;
  console.log("return of rpc call: " + JSON.stringify(result));

  if(result === 'null') {
    //let user know they don't have any stored bulletins
  } else {

    //if result is not null, then it should be "return value" or "error message"
    try {
      result = JSON.parse(result);
    } catch (err) {
      console.log(err);
    }
    
    handleResponse(result);
  }
};

function funcIntervalQuery() {
  //search transaction result from server (result upload to server by app)
  nebPay.queryPayInfo(serialNumber)
    .then(function (resp) {
      //resp is a JSON string
      let respObject = JSON.parse(resp)
      console.log("tx result: " + resp)
      if (respObject.code === 0) {
        alert(`set ${$("#addressInput").val()} succeed!`)
        clearInterval(intervalQuery)
      }
    })
    .catch(function (err) {
      console.log(err);
    });
};