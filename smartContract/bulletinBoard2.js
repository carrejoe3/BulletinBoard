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
        LocalContractStorage.del(author);
    };

    delBulletin(bulletinId) {
        LocalContractStorage.del(bulletinId);
    };
}

module.exports = BulletinBoard;