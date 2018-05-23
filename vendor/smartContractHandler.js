"use strict";

const dappAddress = "n1nr5uJetnmYR2MxGSSVB65mcCDkq4KMap9";
var intervalQuery;
const nebulas = require("nebulas"),
  Account = nebulas.Account,
  neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

var NebPay = require("nebpay");
var nebPay = new NebPay();
var serialNumber;

function getBulletins() {
  let value = "0";
  let callFunction = "getBulletins";
  let callArgs = "[]";

  nebPay.simulateCall(dappAddress, value, callFunction, callArgs, {
    listener: cbSearch
  });
};

function saveBulletins(bulletinIds, bulletinTitles, bulletinContents) {
  let to = dappAddress;
  let value = "0";
  let callFunction = "set";

  for(var i in bulletinContents) {
    bulletinContents[i] = '/.c0ntent./' + bulletinContents[i].replace(/ /g, '&nbsp;'); + '/.c0ntent./';
    bulletinTitles[i] = '/.t1tle./' + bulletinTitles[i].replace(/ /g, '&nbsp;') + '/.t1tle./';
  };

  let callArgs = "[\"" + bulletinIds + "\",\"" + bulletinTitles + "\",\"" + bulletinContents + "\"]";

  serialNumber = nebPay.call(to, value, callFunction, callArgs, {
    listener: cbPush
  });

  intervalQuery = setInterval(function () {
    funcIntervalQuery();
  }, 5000);
};

function delBulletins() {
  let value = "0";
  let callFunction = "delBulletins";
  let callArgs = "[]";

  nebPay.call(dappAddress, value, callFunction, callArgs, {
    listener: cbDelete
  });
};

function cbPush(resp) {
  console.log("response of push: " + JSON.stringify(resp))
};

function cbSearch(resp) {
  //resp is an object, resp.result is a JSON string
  var result = resp.result;
  console.log("return of rpc call: " + JSON.stringify(result));

  if(result === 'null') {

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

function cbDelete(resp) {
  console.log("response of deletion: " + JSON.stringify(resp));
  $("#bulletinList").empty();
  $("#bulletinContainer").fadeOut('fast');
}

function funcIntervalQuery() {
  //search transaction result from server (result upload to server by app)
  nebPay.queryPayInfo(serialNumber)
    .then(function (resp) {
      //resp is a JSON string
      let respObject = JSON.parse(resp)
      console.log("tx result: " + resp)
      if (respObject.code === 0) {
        // alert(`set ${$("#addressInput").val()} succeed!`)
        clearInterval(intervalQuery)
      }
    })
    .catch(function (err) {
      console.log(err);
    });
};