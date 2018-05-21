let bulletinIds = [];
let bulletinTitles = [];
let bulletinContents = [];
let activeBulletinId;

$( document ).ready(function() {
    $("#saveBtn").click(function() {
        updateBulletinArrays();
        saveBulletins(bulletinIds, bulletinTitles, bulletinContents);
    });

    $("#addBulletinBtn").click(function() {
        newBulletinListItem(generateUUID(), 'Bulletin Title', '');
    });

    $("#bulletinList").on("click", ".bulletinListItem", function(e) {
        //activeBulletinId is initially null and after bulletin has been removed
        if(null != activeBulletinId) {
            updateBulletinArrays();
        };

        //apply active styling to main bulletin container
        $("#bulletinContainer").fadeIn('fast');
        $(".sidebarBulletinTitle").removeClass('activeBulletin');
        $(this).find(".sidebarBulletinTitle").addClass('activeBulletin');

        //apply active styling to bulletin list item
        $('.bulletinListItem').css('font-weight', '');
        $(this).css("font-weight", "bold");
        $('.eye').fadeOut('fast');
        $(this).find(".eye").fadeIn('fast');

        //set bulletin contents
        activeBulletinId = $(this).attr("data-bulletinId");
        let activeIdIndex = getActiveBulletinIdIndex();
        $('#bulletinTitle').val(bulletinTitles[activeIdIndex]);
        $('#bulletinMainContent').val(bulletinContents[activeIdIndex]);

        //if new bulletin, set focus on bulletin title
        if($(this).find('span').text() == "Bulletin Title") {
            e.stopPropagation();
            $('.cardHeaderTitle').focus();
        }
    });

    $("#removeBulletinBtn").click(function() {
        let activeIdIndex = getActiveBulletinIdIndex();
        bulletinIds.splice(activeIdIndex, 1);
        bulletinTitles.splice(activeIdIndex, 1);
        bulletinContents.splice(activeIdIndex, 1);

        $('#bulletinList').find(`[data-bulletinid='${activeBulletinId}']`).remove();
        $('#bulletinContainer').fadeOut('fast');

        //set activeBulletinId to null, so updateBulletinArrays isn't called when user clicks on bulletinListItem
        activeBulletinId = null;
    });

    $("#deleteAllBtn").click(function() {
        delBulletins();
    });

    $("#removeBulletinBtn").mouseover(function() {
        $(this).find(".bulletinIcon").attr("src", "images/minusActive.png");
    });

    $("#removeBulletinBtn").mouseleave(function() {
        $(this).find(".bulletinIcon").attr("src", "images/minus.png");
    });

    $("#addBulletinBtn").mouseover(function() {
        $(this).find(".bulletinIcon").attr("src", "images/addActive.png");
    });

    $("#addBulletinBtn").mouseleave(function() {
        $(this).find(".bulletinIcon").attr("src", "images/add.png");
    });

    $('#saveBtn, #deleteAllBtn').hover(function() {
        $(this).toggleClass('activeBtn');
    });

    $('.alertCloseBtn').click(function() {
        $('#helpBanner').fadeOut();
    });

    //update the sidebar active bulletin title when editing active bulletin
    $("#bulletinTitle").change(function() {
        $(".activeBulletin").text($("#bulletinTitle").val());
    });
});

//WebWalletExtension detection
window.addEventListener("load", function () {
    let isExtensionExist = typeof (webExtensionWallet) !== "undefined";
    if (!isExtensionExist) {
        $('#helpBanner').append('<div class="alert" role="alert"><div>Please install <a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a> to use Bulletin Board</div></div>');
        $('#bulletinMainContent, #addBulletinBtn, #bulletinTitle, #deleteAllBtn, #saveBtn').prop('disabled', true);
    } else {
        $('#helpBanner').append('<div class="alert" role="alert"><div id="alertText">WebExtensionWallet detected!</div><button class="btn alertCloseBtn" type="button" class="btn btn-sm"><img class="bulletinIcon" src="images/cancel.png" /></button></div></div>');
        getBulletins();
        helpBannerHandler();
    }
});

function helpBannerHandler() {
    let helpMessages = ['None of your changes will be committed until you click save!', 'WebExtensionWallet detected!'];
    let helpIndex = 0;

    //if user has no bulletins, add help message to array
    if(bulletinIds[0] == undefined || bulletinIds[0] == '') {
        helpMessages.push('Click + to add your first bulletin');
    }

    //change help message
    window.setInterval(function() {
        $('#alertText').fadeOut(function() {
            $(this).text(helpMessages[helpIndex]).fadeIn();
            helpIndex >= helpMessages.length - 1? helpIndex = 0: helpIndex++;
        })
    }, 4000 );
};

function handleResponse(data) {
    //firstly, remove old data from arrays and list
    bulletinIds = [];
    bulletinTitles = [];
    bulletinContents = [];
    $("#bulletinList").empty();

    const sortedIds = data.ids.split(',');
    const sortedTitles = data.titles.split('/.t1tle./,/.t1tle./');
    const sortedContents = data.contents.split('/.c0ntent./,/.c0ntent./');

    //if returned object isnt blank, populate bulletin list
    if(sortedIds[0] !== "") {
        for(let i in sortedIds) {
            //remove content markers
            let markerlessTitles = replaceAll(sortedTitles[i], '/.t1tle./', '');
            let markerlessContent = replaceAll(sortedContents[i], '/.c0ntent./', '');
            newBulletinListItem(sortedIds[i], markerlessTitles, markerlessContent);
        }
    }
};

function updateBulletinArrays() {
    let activeIdIndex = getActiveBulletinIdIndex();
    bulletinTitles.splice(activeIdIndex, 1, $('#bulletinTitle').val());
    bulletinContents.splice(activeIdIndex, 1, $('#bulletinMainContent').val());
};

function newBulletinListItem(bulletinId, title, content) {
    //this can be shorted
    let x = "<li class='bulletinListItem' data-bulletinId=''><div class='bulletinListItemInnerDiv'><span class='sidebarBulletinTitle'>" + title + "</span><img class='eye' src='images/eye.png'/></div><hr class='listItemBottomBorder'/></li>";
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
    let d = new Date().getTime();

    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

function getActiveBulletinIdIndex() {
    return bulletinIds.indexOf(activeBulletinId);
};