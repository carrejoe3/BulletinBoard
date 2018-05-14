"use strict";

const dappAddress = "n1v6r39Z9iGw3nZ9dRDFqA59zMWuSSMfErE";
var intervalQuery;
const nebulas = require("nebulas"),
  Account = nebulas.Account,
  neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

var NebPay = require("nebpay");
var nebPay = new NebPay();
var serialNumber;

function getBulletinIds() {
  let from = $("#addressInput").val();
  let value = "0";
  let nonce = "0";
  let gas_price = "1000000";
  let gas_limit = "2000000";

  //function on smart contract to call
  let callFunction = "getBulletinIds";

  //function paramaters
  //in the form of ["args"]
  let callArgs = "[\"" + from + "\"]";
  let contract = {
    "function": callFunction,
    "args": callArgs
  };

  neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
    cbSearch(resp, 'array');
  }).catch(function (err) {
    console.log("error:" + err.message);
  })
};

function saveBulletins(bulletinIds, bulletinId) {
  let to = dappAddress;
  let value = "0";
  let callFunction = "set";
  let callArgs = "[\"" + $("#addressInput").val() + "\",\"" + bulletinIds + "\",\"" + bulletinId + "\",\"" + $("#bulletinMainContent").val() + "\"]";

  serialNumber = nebPay.call(to, value, callFunction, callArgs, {
    listener: cbPush
  });

  intervalQuery = setInterval(function () {
    funcIntervalQuery();
  }, 5000);
};

function getBulletin(bulletinId) {
  let from = $("#addressInput").val();
  let value = "0";
  let nonce = "0";
  let gas_price = "1000000";
  let gas_limit = "2000000";

  //function on smart contract to call
  let callFunction = "getBulletin";

  //function paramaters
  //in the form of ["args"]
  //bulletinId generated in main.js
  let callArgs = "[\"" + bulletinId + "\"]";
  let contract = {
    "function": callFunction,
    "args": callArgs
  };

  neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
    cbSearch(resp, 'bulletin');
  }).catch(function (err) {
    console.log("error:" + err.message);
  })
};

function cbPush(resp, type) {
  console.log("response of push: " + JSON.stringify(resp))
}

function cbSearch(resp, type) {
  //resp is an object, resp.result is a JSON string
  var result = resp.result;
  console.log("return of rpc call: " + JSON.stringify(result));

  if (result === 'null') {
    //let user know they don't have any stored bulletins
  } else {

    //if result is not null, then it should be "return value" or "error message"
    try {
      result = JSON.parse(result);
    } catch (err) {
      console.log(err);
    }

    //if resp is bulletin ids array, push to bulletinIds
    //if resp is bulletin, call setBulletinContent()
    if(type == 'array') {
      console.log('pushed to array: ' + bulletinIds);
      bulletinIds.push(resp.result);
    } else if(type == 'bulletin') {
      console.log('this will set bulletin content');
      //call setBulletinContent() when its written
    }
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
}