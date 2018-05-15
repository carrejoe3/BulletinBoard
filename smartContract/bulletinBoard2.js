class BulletinBoard {
    init() {};

    set(author, idList, titles) {

        //this doesnt work, as you cant pass an array item into localContractStorage
        // for(var i in idList) {
        //     LocalContractStorage.set(idList[i], titles[i]);
        // }

        LocalContractStorage.set(author, idList);
    };

    getBulletinIds(author) {
        return LocalContractStorage.get(author);
    };

    getBulletin(bulletinId) {
        return LocalContractStorage.get(bulletinId);
    };

    delBulletinIds(author) {
        let result = LocalContractStorage.del(author);
        console.log("del result: " + result);
    };

    delBulletin(bulletinId) {
        let result = LocalContractStorage.del(bulletinId);
        console.log("del result: " + result);
    };
}

module.exports = BulletinBoard;