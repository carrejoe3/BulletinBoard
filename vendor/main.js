var bulletinIds = [];
var bulletinTitles = [];
var bulletinContents = [];
var activeBulletinId;

$( document ).ready(function() {
    $("#saveBtn").click(function() {
        setBulletinContent();
        saveBulletins(bulletinIds, bulletinTitles, bulletinContents);
    });

    $("#submitBtn").click(function() {
        getBulletins();
    });

    $(".addBulletinBtn").click(function() {
        newBulletinListItem(generateUUID(), 'Bulletin Title', 'Bulletin text goes here...');
    });

    $("#bulletinList").on("click", ".bulletinListItem", function() {
        activeBulletinId = $(this).attr("data-bulletinId");
        let activeIdIndex = bulletinIds.indexOf(activeBulletinId);
        $('#bulletinTitle').val(bulletinTitles[activeIdIndex]);
        $('#bulletinMainContent').val(bulletinContents[activeIdIndex]);
    });

    $("#deleteAllBtn").click(function() {
        deleteEverything();
    });
});

function handleResponse(data) {

    const sortedIds = data.ids.split(',');
    const sortedTitles = data.titles.split(',');
    const sortedContents = data.contents.split('/.c0ntent./');

    $("#bulletinList").empty();

    //if returned object isnt blank, populate bulletin list
    if(sortedIds[0] !== "") {
        for(let i in sortedIds) {
            sortedTitles[i].replace('/.c0ntent./', '');
            newBulletinListItem(sortedIds[i], sortedTitles[i], sortedContents[i]);
        }
    }
};

function setBulletinContent() {
    let activeIdIndex = bulletinIds.indexOf(activeBulletinId);
    bulletinTitles.splice(activeIdIndex, 1, $('#bulletinTitle').val());
    bulletinContents.splice(activeIdIndex, 1, '/.c0ntent./' + $('#bulletinMainContent').val().trim() + '/.c0ntent./');
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

function newBulletinListItem(bulletinId, title, content) {
    let x = "<li class='bulletinListItem' data-bulletinId=''>" + title + "</li><hr class='listItemBottomBorder'>";
    x = x.substring(0, 46) + bulletinId + x.substring(46, x.length);
    $("#bulletinList").append(x);
    bulletinIds.push(bulletinId);
    bulletinTitles.push(title);
    bulletinContents.push(content);

};

function deleteEverything() {
    $("#bulletinList").empty();
    delBulletins();
    bulletinIds = [];
    bulletinTitles = [];
    bulletinContents = [];
};