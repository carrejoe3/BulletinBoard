'use strict';

var BulletinBoard = function () {
};

BulletinBoard.prototype = {
    init: function () {
    },
    setBulletins: function (idList, titles, contents, createdDates, authors) {
        var author = Blockchain.transaction.from;
        titles = titles.trim();
        contents = contents.trim();
        LocalContractStorage.set(author, {ids: idList, titles: titles, contents: contents, createdDates: createdDates, authors: authors});
    },
    sendBulletins: function (idList, titles, contents, createdDates, authors, sendTo) {
        titles = titles.trim();
        contents = contents.trim();
        LocalContractStorage.set(sendTo, {ids: idList, titles: titles, contents: contents, createdDates: createdDates, authors: authors});
    },
    getBulletins: function () {
        var author = Blockchain.transaction.from;
        return LocalContractStorage.get(author);
    },
    getRecipientBulletins: function (owner) {
        return LocalContractStorage.get(owner);
    }
};

module.exports = BulletinBoard;

//params for webwallet
["idList", "titles", "contents", "createdDates", "authors", "sendTo"]