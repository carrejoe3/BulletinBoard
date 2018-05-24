'use strict';

var BulletinBoard = function () {
    let owner = Blockchain.transaction.from;

    this.getOwner = function() {
        return owner;
    }
};

BulletinBoard.prototype = {
    init: function () {
    },
    set: function (idList, titles, contents, createdDates, sendTo) {

        titles = titles.trim();
        contents = contents.trim();
        LocalContractStorage.set(this.getOwner(), {ids: idList, titles: titles, contents: contents, createdDates: createdDates});

        if(null != sendTo) {
            LocalContractStorage.set(to, {ids: idList, titles: titles, contents: contents, createdDates: createdDates});
        }
    },
    getBulletins: function () {
        return LocalContractStorage.get(this.getOwner());
    },
    delBulletins: function () {
        LocalContractStorage.del(this.getOwner());
    }
};

module.exports = BulletinBoard;