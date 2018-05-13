$( document ).ready(function() {
    $("#saveBtn").click(function() {
        setBulletin();
    });

    $("#submitBtn").click(function() {
        getBulletinIds();
    });

    $(".addBulletinBtn").click(function() {
        newBulletin();
    });

    $("#bulletinList").on("click", ".bulletinListItem", function() {
        let bulletinId = $(this).attr("data-bulletinId");
        //call getBulletin() and set bulletin fields to returned values
    });
});

const bulletinIds = [];
const bulletinId;

function newBulletin() {
    let x = "<li class='bulletinListItem' data-bulletinId=''>New</li><hr class='listItemBottomBorder'>";

    //give bulletin list item an id
    bulletinId = generateUUID();
    x = x.substring(0, 46) + generateUUID() + x.substring(46, x.length);
    $("#bulletinList").append(x);

    bulletinIds.push(bulletinId);
    //call setBulletinIds when i've written it
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