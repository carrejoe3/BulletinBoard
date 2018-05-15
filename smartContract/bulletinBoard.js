'use strict';

var BulletinBoard = function () {
};

BulletinBoard.prototype = {
    init: function () {
    },
    set: function (author, idList, titles) {
        LocalContractStorage.set(author, {ids: idList, titles: titles});
    },
    getBulletins: function (author) {
        return LocalContractStorage.get(author);
    },
    delBulletins: function (author) {
        var result = LocalContractStorage.del(author);
        console.log("del result: " + result)
    }
};

module.exports = BulletinBoard;