'use strict';

var BulletinBoard = function () {
};

BulletinBoard.prototype = {
    init: function () {
    },
    set: function (idList, titles, contents) {
        var author = Blockchain.transaction.from;
        titles = titles.trim();
        contents = contents.trim();
        LocalContractStorage.set(author, {ids: idList, titles: titles, contents: contents});
    },
    getBulletins: function () {
        var author = Blockchain.transaction.from;
        return LocalContractStorage.get(author);
    },
    delBulletins: function () {
        var author = Blockchain.transaction.from;
        LocalContractStorage.del(author);
    }
};

module.exports = BulletinBoard;