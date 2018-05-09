'use strict';

var BulletinBoard = function () {
};

BulletinBoard.prototype = {
    init: function () {
    },
    set: function (author, content) {

        LocalContractStorage.set(author,content);
    },
    get: function (author) {

        return LocalContractStorage.get(author);
    },
    del: function (author) {
        var result = LocalContractStorage.del(author);
        console.log("del result: " + result)
    }
};

module.exports = BulletinBoard;