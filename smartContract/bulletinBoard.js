'use strict';

var BulletinBoard = function () {
};

BulletinBoard.prototype = {
    init: function () {
    },
    set: function (author, idList, titles, contents) {
        LocalContractStorage.set(author, {ids: idList, titles: titles, contents: contents});
    },
    getBulletins: function (author) {
        return LocalContractStorage.get(author);
    },
    delBulletins: function (author) {
        LocalContractStorage.del(author);
    }
};

module.exports = BulletinBoard;