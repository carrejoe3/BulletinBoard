"use strict";

const dappAddress = "n1zztvm5ttGapmYGxhZ7TG1kq1j1UApg48n";
var intervalQuery;
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

function getRecipientBulletins(owner) {
  let value = "0";
  let callFunction = "getRecipientBulletins";
  let callArgs = "[\"" + owner + "\"]";

  nebPay.simulateCall(dappAddress, value, callFunction, callArgs, {
    listener: cbSend
  });
};

function getBulletin(bulletinId) {
  let value = "0";
  let callFunction = "getBulletin";
  let callArgs = "[\"" + bulletinId + "\"]";

  nebPay.simulateCall(dappAddress, value, callFunction, callArgs, {
    listener: cbBulletinSearch
  });
};

function saveBulletins(bulletins, bulletinId, content) {
  let to = dappAddress;
  let value = "0";
  let callFunction = "setBulletins";
  let callArgs = "[\"" + bulletins.ids + "\",\"" + bulletins.titles + "\",\"" + bulletins.createdDates + "\",\"" + bulletins.authors + "\",\"" + bulletinId + "\",\"" + content + "\"]";

  serialNumber = nebPay.call(to, value, callFunction, callArgs, {
    listener: cbPush
  });

  intervalQuery = setInterval(function () {
    funcIntervalQuery();
  }, 5000);
};

function sendBulletins(recipientBulletins, sendTo, bulletinId, content) {
  let to = dappAddress;
  let value = "0";
  let callFunction = "sendBulletins";
  let callArgs = "[\"" + recipientBulletins.ids + "\",\"" + recipientBulletins.titles + "\",\"" + recipientBulletins.createdDates + "\",\"" + recipientBulletins.authors + "\",\"" + sendTo + "\",\"" + bulletinId + "\",\"" + content + "\"]";

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
  console.log("response of push: " + JSON.stringify(resp));
  transactionFeedbackHandler(JSON.stringify(resp));
};

function cbSearch(resp) {
  //resp is an object, resp.result is a JSON string
  let result = resp.result;
  console.log("return of rpc call: " + JSON.stringify(result));

  if (isNull(result)) {
    console.log('No bulletins found for this wallet address');
    $('#loader').css('display', 'none');
  } else {
    //if result is not null, then it should be "return value" or "error message"
    try {
      result = JSON.parse(result);
    } catch (err) {
      console.log(err);
    }
    handleBulletinsResponse(result);
  }
};

function cbBulletinSearch(resp) {
  //resp is an object, resp.result is a JSON string
  let result = resp.result;
  console.log("return of rpc call: " + JSON.stringify(result));

  if (isNull(result)) {
    console.log('No bulletin content found');
    handleBulletinResponse(null);
  } else {
    //if result is not null, then it should be "return value" or "error message"
    try {
      result = JSON.parse(result);
    } catch (err) {
      console.log(err);
    }
    handleBulletinResponse(result);
  }
};

function cbDelete(resp) {
  console.log("response of deletion: " + JSON.stringify(resp));
  $("#bulletinList").empty();
  $("#bulletinCol").fadeOut('fast');
};

function cbSend(resp) {
    //resp is an object, resp.result is a JSON string
    let result = resp.result;
    console.log("return of rpc call: " + JSON.stringify(result));

    if (isNull(result)) {
      console.log('No bulletins found for this wallet address');
    } else {
      //if result is not null, then it should be "return value" or "error message"
      try {
        result = JSON.parse(result);
      } catch (err) {
        console.log(err);
      }
    }
    sendBulletinsHandler(result);
};

function funcIntervalQuery() {
  //search transaction result from server (result upload to server by app)
  nebPay.queryPayInfo(serialNumber)
    .then(function (resp) {
      //resp is a JSON string
      let respObject = JSON.parse(resp)
      console.log("tx result: " + resp)
      transactionFeedbackHandler(respObject.msg);
      if (respObject.code == 0) {
        clearInterval(intervalQuery);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
};