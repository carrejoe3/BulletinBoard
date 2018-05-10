class BulletinBoard {
    init() {};

    set(author, content) {
        LocalContractStorage.set(author,content);
    };

    get(author) {
        return LocalContractStorage.get(author);
    };

    del(author) {
        var result = LocalContractStorage.del(author);
        console.log("del result: " + result);
    };
}

module.exports = BulletinBoard;