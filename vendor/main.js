var bulletinIds = [];
var bulletinId;

$( document ).ready(function() {
    $("#saveBtn").click(function() {
        saveBulletins(bulletinIds, getBulletinTitles());
    });

    $("#submitBtn").click(function() {
        getBulletins();
    });

    $(".addBulletinBtn").click(function() {
        newBulletinListItem(generateUUID(), 'New');
    });

    $("#bulletinList").on("click", ".bulletinListItem", function() {
        let bulletinId = $(this).attr("data-bulletinId");
        // getBulletin(bulletinId);
    });

    $("#deleteAllBtn").click(function() {
        deleteEverything();
    });
});

function handleResponse(data) {

    const sortedIds = data.ids.split(',');
    const sortedTitles = data.titles.split(',');
    $("#bulletinList").empty();

    //if returned object isnt blank
    if(sortedIds[0] !== "") {
        for(let i in sortedIds) {
            newBulletinListItem(sortedIds[i], sortedTitles[i]);
        }
    }
};

function setBulletinContent(data) {
    //set bulletin content with returned values
};

function getBulletinTitles() {

    var bulletinTitles = [];

    $(".bulletinListItem").each(function() {
        bulletinTitles.push($(this).text());
    });

    return bulletinTitles;
};

function generateUUID() {
    var d = new Date().getTime();

    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

function newBulletinListItem(bulletinId, title) {
    let x = "<li class='bulletinListItem' data-bulletinId=''>" + title + "</li><hr class='listItemBottomBorder'>";
    x = x.substring(0, 46) + bulletinId + x.substring(46, x.length);
    $("#bulletinList").append(x);
    bulletinIds.push(bulletinId);
};

function deleteEverything() {
    $("#bulletinList").empty();
    delBulletins();
    bulletinIds = [];
};