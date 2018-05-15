'use strict';

var BulletinBoard = function () {
};

BulletinBoard.prototype = {
    init: function () {
    },
    set: function (author, idList, titles) {

        for(var i in idList) {
            setBulletin(idList[i], titles[i]);
        }

        LocalContractStorage.set(author, idList);
    },
    setBulletin: function (bulletinId, title) {
        LocalContractStorage.set(bulletinId, title);
    },
    getBulletinIds: function (author) {
        return LocalContractStorage.get(author);
    },
    getBulletin: function (bulletinId) {
        return LocalContractStorage.get(bulletinId);
    },
    delBulletinIds: function (author) {
        var result = LocalContractStorage.del(author);
        console.log("del result: " + result)
    },
    delBulletin: function (bulletinId) {
        var result = LocalContractStorage.del(bulletinId);
        console.log("del result: " + result);
    }
};

module.exports = BulletinBoard;