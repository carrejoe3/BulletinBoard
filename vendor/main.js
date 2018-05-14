const bulletinIds = [];
var bulletinId;

$( document ).ready(function() {
    $("#saveBtn").click(function() {
        saveBulletins(bulletinIds, bulletinId);
    });

    $("#submitBtn").click(function() {
        getBulletinIds();
    });

    $(".addBulletinBtn").click(function() {
        newBulletinListItem(generateUUID());
    });

    $("#bulletinList").on("click", ".bulletinListItem", function() {
        let bulletinId = $(this).attr("data-bulletinId");
        getBulletin(bulletinId);
    });
});

function handleIdListResponse(data) {

    sortedIds = data.split(',');

    for(let i in sortedIds) {
        let id = sortedIds[i];
        newBulletinListItem(id);
    }
}

function setBulletinContent(data) {
    //set bulletin content with returned values
}

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
}

function newBulletinListItem(bulletinId) {
    let x = "<li class='bulletinListItem' data-bulletinId=''>New</li><hr class='listItemBottomBorder'>";
    x = x.substring(0, 46) + bulletinId + x.substring(46, x.length);
    $("#bulletinList").append(x);
    bulletinIds.push(bulletinId);
}