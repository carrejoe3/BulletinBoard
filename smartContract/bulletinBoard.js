'use strict';

var BulletinBoard = function () {
};

BulletinBoard.prototype = {
    init: function () {
    },
    setBulletins: function (idList, titles, contents, createdDates, owner) {
        var author = Blockchain.transaction.from;
        titles = titles.trim();
        contents = contents.trim();
        LocalContractStorage.set(author, {ids: idList, titles: titles, contents: contents, createdDates: createdDates});
    },
    getBulletins: function (owner) {
        var author = Blockchain.transaction.from;
        return LocalContractStorage.get(author);
    },
    delBulletins: function () {
        var author = Blockchain.transaction.from;
        LocalContractStorage.del(author);
    }
};

module.exports = BulletinBoard;