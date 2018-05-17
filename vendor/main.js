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
        newBulletinListItem(generateUUID(), 'Bulletin Title', '');
    });

    $("#bulletinList").on("click", ".bulletinListItem", function() {
        $('.bulletinListItem').css('font-weight', '');
        $(this).css("font-weight", "bold");

        $('.eye').fadeOut('fast');
        $(this).find(".eye").fadeIn('fast');

        activeBulletinId = $(this).attr("data-bulletinId");
        let activeIdIndex = bulletinIds.indexOf(activeBulletinId);
        $('#bulletinTitle').val(bulletinTitles[activeIdIndex]);
        $('#bulletinMainContent').val(bulletinContents[activeIdIndex]);
    });

    $("#deleteAllBtn").click(function() {
        delBulletins();
        getBulletins();
    });
});

//WebWalletExtension detection
window.addEventListener("load", function () {
    let isExtensionExist = typeof (webExtensionWallet) !== "undefined";
    if (!isExtensionExist) {
        $('#webWalletExtensionDetectionBanner').append('<div class="alert alert-warning" role="alert"><div>Please install <a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a> to use Bulletin Board</div></div>');
        $('#bulletinMainContent, .addBulletinBtn, #bulletinTitle, #deleteAllBtn, #saveBtn').prop('disabled', true);
    } else {
        $('#webWalletExtensionDetectionBanner').append('<div class="alert alert-success" role="alert"><div>WebExtensionWallet detected!</div></div>');
    }
});

function handleResponse(data) {
    //firstly, remove old data from arrays and list
    bulletinIds = [];
    bulletinTitles = [];
    bulletinContents = [];
    $("#bulletinList").empty();

    const sortedIds = data.ids.split(',');
    const sortedTitles = data.titles.split(',');
    const sortedContents = data.contents.split('/.c0ntent./,/.c0ntent./');

    //if returned object isnt blank, populate bulletin list
    if(sortedIds[0] !== "") {
        for(let i in sortedIds) {
            //remove content markers
            let markerless = replaceAll(sortedContents[i], '/.c0ntent./', '');
            newBulletinListItem(sortedIds[i], sortedTitles[i], markerless);
        }
    }
};

function setBulletinContent() {
    let activeIdIndex = bulletinIds.indexOf(activeBulletinId);
    bulletinTitles.splice(activeIdIndex, 1, $('#bulletinTitle').val());
    bulletinContents.splice(activeIdIndex, 1, $('#bulletinMainContent').val().trim());
};

function newBulletinListItem(bulletinId, title, content) {
    let x = "<li class='bulletinListItem' data-bulletinId=''><span class='sidebarBulletinTitle'>" + title + "</span><img class='eye' src='images/eye.png'/></li><hr class='listItemBottomBorder'>";
    x = x.substring(0, 46) + bulletinId + x.substring(46, x.length);
    $("#bulletinList").append(x);
    bulletinIds.push(bulletinId);
    bulletinTitles.push(title);
    bulletinContents.push(content);
};

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
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