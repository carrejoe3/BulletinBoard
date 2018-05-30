'use strict';

var BulletinBoard = function () {
};

BulletinBoard.prototype = {
    init: function () {
    },
    setBulletins: function (idList, titles, createdDates, authors, bulletinId, content) {
        var author = Blockchain.transaction.from;
        titles = titles.trim();
        content = content.trim();
        LocalContractStorage.set(author, {ids: idList, titles: titles, createdDates: createdDates, authors: authors});
        LocalContractStorage.set(bulletinId, content);
    },
    sendBulletins: function (idList, titles, createdDates, authors, sendTo) {
        titles = titles.trim();
        LocalContractStorage.set(sendTo, {ids: idList, titles: titles, createdDates: createdDates, authors: authors});
    },
    getBulletins: function () {
        var author = Blockchain.transaction.from;
        return LocalContractStorage.get(author);
    },
    getRecipientBulletins: function (owner) {
        return LocalContractStorage.get(owner);
    },
    getBulletin: function(bulletinId) {
        return LocalContractStorage.get(bulletinId);
    },
    delBulletins: function () {
        var author = Blockchain.transaction.from;
        LocalContractStorage.del(author);
    }
};

module.exports = BulletinBoard;

//params for deploying
["idList", "titles", "createdDates", "authors", "sendTo", "bulletinId", "content"]