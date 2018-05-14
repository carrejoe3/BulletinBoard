class BulletinBoard {
    init() {};

    set(author, idList, bulletinId, content) {
        LocalContractStorage.set(author, idList);
        LocalContractStorage.set(bulletinId, content);
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