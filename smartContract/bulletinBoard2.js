class BulletinBoard {
    init() {};

    setBulletinIds(author, idList) {
        LocalContractStorage.set(author, idList);
    };

    getBulletinIds(author) {
        return LocalContractStorage.get(author);
    };

    //this also needs to loop through all ids and call delBulletinList on each id 
    //this ensures all user data is removed from blockchain
    detBulletinIds(author) {
        let result = LocalContractStorage.del(author);
        console.log("del result: " + result);
    };

    setBulletin(bulletinId, content) {
        LocalContractStorage.set(bulletinId, content);
    };

    getBulletin(bulletinId) {
        return LocalContractStorage.get(bulletinId);
    }; 

    delBulletin(bulletinId) {
        let result = LocalContractStorage.del(bulletinId);
        console.log("del result: " + result);
    };
}

module.exports = BulletinBoard;