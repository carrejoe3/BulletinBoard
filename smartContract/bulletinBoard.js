"use strict";

var Bulletin = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.key = obj.key;
		this.value = obj.value;
		this.author = obj.author;
	} else {
	    this.key = "";
	    this.author = "";
	    this.value = "";
	}
};

Bulletin.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var BulletinBoard = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new Bulletin(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

BulletinBoard.prototype = {
    init: function () {
        // todo
    },

    save: function (key, value) {

        key = key.trim();
        value = value.trim();
        if (key === "" || value === ""){
            throw new Error("empty key / value");
        }
        if (value.length > 64 || key.length > 64){
            throw new Error("key / value exceed limit length")
        }

        var from = Blockchain.transaction.from;
        var bulletin = this.repo.get(key);
        if (bulletin){
            throw new Error("value has been occupied");
        }

        bulletin = new Bulletin();
        bulletin.author = from;
        bulletin.key = key;
        bulletin.value = value;

        this.repo.put(key, bulletin);
    },

    get: function (key) {
        key = key.trim();
        if ( key === "" ) {
            throw new Error("empty key")
        }
        return this.repo.get(key);
    }
};
module.exports = BulletinBoard;