'use strict';

var BulletinBoard = function () {
};

BulletinBoard.prototype = {
    init: function () {
    },
    set: function (idList, titles, contents, createdDates) {
        var author = Blockchain.transaction.from;
        titles = titles.trim();
        contents = contents.trim();
        LocalContractStorage.set(author, {ids: idList, titles: titles, contents: contents, createdDates: createdDates});
    },
    send: function (id, title, content, createdDate, sendTo) {
        var author = Blockchain.transaction.from;
        LocalContractStorage.set(sendTo, {ids: id, titles: title, contents: content, createdDates: createdDate, author: author});
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