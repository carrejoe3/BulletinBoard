let bulletinIds = [];
let bulletinTitles = [];
let bulletinContents = [];
let bulletinCreatedDates = [];
let activeBulletinId;

$( document ).ready(function() {
    $("#saveBtn").click(function() {
        updateBulletinArrays();
        saveBulletins(bulletinIds, bulletinTitles, bulletinContents, bulletinCreatedDates);
    });

    $("#addBulletinBtn").click(function() {
        newBulletinListItem(generateUUID(), 'Title', '', new Date().toLocaleDateString());
        if($('#deleteAllBtn').css("visibility") == "hidden") {
            $('#deleteAllBtn').css({"visibility": "visible", "opacity": "1"}).hide().fadeIn('fast');
        }
    });

    $("#bulletinList").on("click", ".bulletinListItem", function(e) {
        //activeBulletinId is initially null and after bulletin has been removed
        if(null != activeBulletinId) {
            updateBulletinArrays();
        };

        //apply active styling to main bulletin container
        $(".sidebarBulletinTitle").removeClass('activeBulletin');
        $(this).find(".sidebarBulletinTitle").addClass('activeBulletin');

        //set bulletin contents
        activeBulletinId = $(this).attr("data-bulletinId");
        let activeIdIndex = getActiveBulletinIdIndex();
        $('#bulletinTitle').val(bulletinTitles[activeIdIndex]);
        $('#bulletinMainContent').val(bulletinContents[activeIdIndex]);
        $('#bulletinCreateDate').val('Created: ' + bulletinCreatedDates[activeIdIndex]);

        //if new bulletin, set focus on bulletin title
        if($(this).find('span').text() == 'Title') {
            e.stopPropagation();
            $('.cardHeaderTitle').focus();
        }

        //if user is on mobile, hide bulletin list
        if ($(window).width() < 768) {
            $('.col-md-4').hide();
            $("#bulletinContainer").show();
            $('#bulletinListBtn').removeClass('activeBtn');
        } else {
            $("#bulletinContainer").fadeIn('fast');
            //apply active styling to bulletin list item
            $('.bulletinListItem').css('font-weight', '');
            $(this).css("font-weight", "bold");
            $('.eye').fadeOut('fast');
            $(this).find(".eye").fadeIn('fast');
        }
    });

    $("#removeBulletinBtn").click(function() {
        let activeIdIndex = getActiveBulletinIdIndex();
        bulletinIds.splice(activeIdIndex, 1);
        bulletinTitles.splice(activeIdIndex, 1);
        bulletinContents.splice(activeIdIndex, 1);
        bulletinCreatedDates.splice(activeIdIndex, 1);

        $('#bulletinList').find(`[data-bulletinid='${activeBulletinId}']`).remove();

        //set activeBulletinId to null, so updateBulletinArrays isn't called when user clicks on bulletinListItem
        activeBulletinId = null;

        //if user is on mobile, show bulletin list again
        if ($(window).width() < 768) {
            $('.col-md-4').show();
            $('#bulletinContainer').hide();
        } else {
            $('#bulletinContainer').fadeOut('fast');
        }

        //if there aren't any bulletins left, hide delete all button
        if(bulletinIds[0] == undefined || bulletinIds[0] == '') {
            // duration, opacity, callback
            $('#deleteAllBtn').fadeTo('fast', 0, function() {
                $('#deleteAllBtn').css("visibility", "hidden");
            });
        }

        $('#bulletinListBtn').addClass('activeBtn');
    });

    $("#deleteAllBtn").click(function() {

        $('.col-md-4').show();
        $('#bulletinContainer').hide();

        delBulletins();

        $(this).fadeTo('fast', 0, function() {
            $(this).css("visibility", "hidden");
        });

        $('#bulletinListBtn').addClass('activeBtn');
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

    $('#bulletinListBtn').click(function() {
        $('#bulletinContainer').hide();
        $('.col-md-4').show();
        $(this).addClass('activeBtn');
    });
});

//WebWalletExtension detection
window.addEventListener("load", function () {
    let isExtensionExist = typeof (webExtensionWallet) !== "undefined";
    if (!isExtensionExist) {
        $('#helpBanner').append('<div class="alert" role="alert"><div>Please install <a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a> to use Bulletin Board</div></div>');
        $('#bulletinMainContent, #addBulletinBtn, #bulletinTitle, #deleteAllBtn, #saveBtn, #bulletinListBtn').prop('disabled', true);
    } else {
        $('#helpBanner').append('<div class="alert" role="alert"><div id="alertText">WebExtensionWallet detected!</div><button class="btn btn-sm alertCloseBtn" type="button"><img class="bulletinIcon" src="images/cancel.png" /></button></div></div>');
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
    bulletinCreatedDates = [];
    $("#bulletinList").empty();

    const sortedIds = data.ids.split(',');
    const sortedTitles = data.titles.split('/.t1tle./,/.t1tle./');
    const sortedContents = data.contents.split('/.c0ntent./,/.c0ntent./');
    const sortedCreatedDates = data.createdDates.split(',');

    //if returned object isnt blank, populate bulletin list
    if(sortedIds[0] !== "") {

        //show delete all button
        if($('#deleteAllBtn').css("visibility") == "hidden") {
            $('#deleteAllBtn').css({"visibility": "visible", "opacity": "1"}).hide().fadeIn('fast');
        }

        for(let i in sortedIds) {

            //remove content markers
            let markerlessTitles = replaceAll(sortedTitles[i], '/.t1tle./', '');
            let markerlessContent = replaceAll(sortedContents[i], '/.c0ntent./', '');

            //replace replace new line markers with new lines
            markerlessContent = replaceAll(markerlessContent, '/.n3wLine./', '\n');

            newBulletinListItem(sortedIds[i], markerlessTitles, markerlessContent, sortedCreatedDates[i]);
        }
    } else {
        //if there aren't any bulletins left, hide delete all button
        // duration, opacity, callback
        $('#deleteAllBtn').fadeTo('fast', 0, function() {
            $('#deleteAllBtn').css("visibility", "hidden");
        });
    }
};

function updateBulletinArrays() {
    let activeIdIndex = getActiveBulletinIdIndex();
    bulletinTitles.splice(activeIdIndex, 1, $('#bulletinTitle').val());
    bulletinContents.splice(activeIdIndex, 1, $('#bulletinMainContent').val());
};

function newBulletinListItem(bulletinId, title, content, date) {
    $("#bulletinList").append("<li class='bulletinListItem' data-bulletinId='" + bulletinId + "'><div class='bulletinListItemInnerDiv'><span class='sidebarBulletinTitle'>" + title + "</span><img class='eye' src='images/eye.png'/></div><hr class='listItemBottomBorder'/></li>");
    bulletinIds.push(bulletinId);
    bulletinTitles.push(title);
    bulletinContents.push(content);
    bulletinCreatedDates.push(date);
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