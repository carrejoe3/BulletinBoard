'use strict';

var BulletinBoard = function () {
};

BulletinBoard.prototype = {
    init: function () {
    },
    setBulletins: function (idList, titles, contents, createdDates) {
        var author = Blockchain.transaction.from;
        titles = titles.trim();
        contents = contents.trim();
        LocalContractStorage.set(author, {ids: idList, titles: titles, contents: contents, createdDates: createdDates});
    },
    sendBulletins: function (idList, titles, contents, createdDates, owner) {
        titles = titles.trim();
        contents = contents.trim();
        LocalContractStorage.set(owner, {ids: idList, titles: titles, contents: contents, createdDates: createdDates});
    },
    getBulletins: function () {
        var author = Blockchain.transaction.from;
        return LocalContractStorage.get(author);
    },
    getSpecificBulletins: function (owner) {
        return LocalContractStorage.get(owner);
    },
    delBulletins: function () {
        var author = Blockchain.transaction.from;
        LocalContractStorage.del(author);
    }
};

module.exports = BulletinBoard;