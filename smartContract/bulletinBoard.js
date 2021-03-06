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
    sendBulletins: function (idList, titles, createdDates, authors, sendTo, bulletinId, content) {
        var author = Blockchain.transaction.from;
        titles = titles.trim();
        content = content.trim();
        LocalContractStorage.set(sendTo, {ids: idList, titles: titles, createdDates: createdDates, authors: authors});
        LocalContractStorage.set(author, {ids: idList, titles: titles, createdDates: createdDates, authors: authors});
        LocalContractStorage.set(bulletinId, content);
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

//tx hash
ea1123208746fa0c2a592ffdec49ab3b638abb9f22b597bd1d9c7716205657e0