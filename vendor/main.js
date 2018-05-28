let bulletinIds = [];
let bulletinTitles = [];
let bulletinContents = [];
let bulletinCreatedDates = [];
let activeBulletinId;
let recipientAdded = false;

$( document ).ready(function() {
    $("#saveBtn").click(function() {
        updateBulletinArrays();
        saveBulletins(bulletinIds, bulletinTitles, bulletinContents, bulletinCreatedDates, null);
    });

    $("#addBulletinBtn").click(function() {
        newBulletinListItem(generateUUID(), 'Title', '', new Date().toLocaleDateString());
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

        //show main bulletin and set focus
        $("#bulletinCol").fadeIn('fast', function() {
            $('.cardHeaderTitle').focus();
            e.stopPropagation();
        });

        //if user is on mobile, hide bulletin list
        if (mobileMode()) {
            $('#bulletinListCol').hide();
            changeIconImageSource('#bulletinListBtn', "images/list.png");
        } else {
            //apply active styling to bulletin list item
            $('.bulletinListItem').css('font-weight', '');
            $(this).css("font-weight", "bold");
            $('.eye').fadeOut('fast');
            $(this).find(".eye").fadeIn('fast');
        }

        disableEnableBulletinSpecificButtons('enable');
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
        if (mobileMode()) {
            $('#bulletinListCol').show();
            $('#bulletinCol').hide();
        } else {
            $('#bulletinCol').fadeOut('fast');
        }

        changeIconImageSource('#bulletinListBtn', "images/listActive.png");
        disableEnableBulletinSpecificButtons('disable');
    });

    //set active buttons on hover
    $("#removeBulletinBtn").mouseover(function() {
        changeIconImageSource(this, "images/rubbishBinActive.png");
    });
    $("#removeBulletinBtn").mouseleave(function() {
        changeIconImageSource(this, "images/rubbish-bin.png");
    });
    $("#addBulletinBtn").mouseover(function() {
        changeIconImageSource(this, "images/addActive.png");
    });
    $("#addBulletinBtn").mouseleave(function() {
        changeIconImageSource(this, "images/add.png");
    });
    $("#addRecipientBtn").mouseover(function() {
        if(!recipientAdded) {
            changeIconImageSource(this, "images/addRecipientActive.png");
        }
    });
    $("#addRecipientBtn").mouseleave(function() {
        if(!recipientAdded) {
            changeIconImageSource(this, "images/addRecipient.png");
        }
    });
    $("#saveBtn").mouseover(function() {
        changeIconImageSource(this, "images/saveActive.png");
    });
    $("#saveBtn").mouseleave(function() {
        changeIconImageSource(this, "images/save.png");
    });
    $("#sendBtn").mouseover(function() {
        changeIconImageSource(this, "images/sendActive.png");
    });
    $("#sendBtn").mouseleave(function() {
        changeIconImageSource(this, "images/send.png");
    });

    //add recipient button handler
    $('#addRecipientBtn').click(function(e) {
        if(recipientAdded == false) {
            changeIconImageSource('#addRecipientBtn', "images/addRecipientActive.png");

            //if mobile mode, also slideToggle bulletin list button
            if(mobileMode()) {
                $('#removeBulletinBtn, #saveBtn, #bulletinListBtn').fadeOut('fast', function() {
                    fadeInRecipientAddress(e);
                });
            } else {
                $('#removeBulletinBtn, #saveBtn').fadeOut('fast', function() {
                    fadeInRecipientAddress(e);
                });
            }

        } else {
            changeIconImageSource('#addRecipientBtn', "images/addRecipient.png");
            $('#recipientAddressContainer, #sendBtn').fadeOut('fast', function() {
                $('#removeBulletinBtn, #saveBtn').fadeIn('fast');
                if(mobileMode()) {
                    $('#bulletinListBtn').fadeIn('fast');
                }
            });
        }
        recipientAdded = (recipientAdded == false? true: false);
    });

    //send button handler
    $('#sendBtn').click(function() {
        updateBulletinArrays();
        getRecipientBulletins($('#recipientAddress').val());
    });

    //close helper banner button handler
    $('.alertCloseBtn').click(function() {
        $('#helpBanner').fadeOut();
    });

    //update the sidebar active bulletin title when editing active bulletin
    $("#bulletinTitle").change(function() {
        $(".activeBulletin").text($("#bulletinTitle").val());
    });

    //bulletin list button handler for small screens
    $('#bulletinListBtn').click(function() {
        $('#bulletinCol').hide();
        $('#bulletinListCol').fadeIn('fast');
        changeIconImageSource(this, 'images/listActive.png');
        disableEnableBulletinSpecificButtons('disable');
    });
});

//WebWalletExtension detection
window.addEventListener("load", function () {
    let isExtensionExist = typeof (webExtensionWallet) !== "undefined";
    if (!isExtensionExist) {
        $('#helpBanner').append('<div class="alert" role="alert"><div>Please install <a href="https://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a> to use Bulletin Board</div></div>');
        $('#bulletinMainContent, #addBulletinBtn, #bulletinTitle, #saveBtn, #bulletinListBtn').prop('disabled', true);
    } else {
        //set help banner
        $('#helpBanner').append('<div class="alert" role="alert"><div id="alertText">WebExtensionWallet detected!</div><button class="btn btn-sm alertCloseBtn" type="button"><img class="bulletinIcon" src="images/cancel.png" /></button></div></div>');

        //remove old data from arrays and list
        bulletinIds = [];
        bulletinTitles = [];
        bulletinContents = [];
        bulletinCreatedDates = [];
        $("#bulletinList").empty();

        getBulletins();
        helpBannerHandler();
    }
});

function helpBannerHandler() {
    let helpMessages = ['None of your changes will be committed until you click save!', 'WebExtensionWallet detected!'];
    let helpIndex = 0;

    //if user has no bulletins, add help message to array
    if(bulletinIds[0] == 'undefined' || bulletinIds[0] == '') {
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
    bulletins = splitReturnedBulletinData(data);
    bulletins = removeMarkers(bulletins);

    for (let i in bulletins.ids) {
        newBulletinListItem(bulletins.ids[i], bulletins.titles[i], bulletins.contents[i], bulletins.createdDates[i]);
    };
};

function sendBulletinsHandler(data) {
    recipientBulletins = splitReturnedBulletinData(data);
    recipientBulletins = removeMarkers(recipientBulletins);

    //add bulletin we want to send to bulletin object
    index = getActiveBulletinIdIndex();
    recipientBulletins.ids.unshift(bulletinIds[index]);
    recipientBulletins.titles.unshift(bulletinTitles[index]);
    recipientBulletins.contents.unshift(bulletinContents[index]);
    recipientBulletins.createdDates.unshift(bulletinCreatedDates[index]);

    recipientBulletins = addMarkers(recipientBulletins);

    sendBulletins(recipientBulletins.ids, recipientBulletins.titles, recipientBulletins.contents, recipientBulletins.createdDates, $('#recipientAddress').val());
};

function updateBulletinArrays() {
    let activeIdIndex = getActiveBulletinIdIndex();
    bulletinTitles.splice(activeIdIndex, 1, $('#bulletinTitle').val());
    bulletinContents.splice(activeIdIndex, 1, $('#bulletinMainContent').val());
};

//add new bulletin to bulletin list, and push new content to arrays
function newBulletinListItem(bulletinId, title, content, date) {
    $("#bulletinList").append("<li class='bulletinListItem' data-bulletinId='" + bulletinId + "'><div class='bulletinListItemInnerDiv'><span class='sidebarBulletinTitle'>" + title + "</span><img class='eye' src='images/eye.png'/></div><div id='createdDate'>" + date + "</div><hr class='listItemBottomBorder'/></li>");
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

function mobileMode() {
    return $(window).width() < 768;
};

function disableEnableBulletinSpecificButtons(ind) {
    if(ind == 'disable') {
        disableButton('#addRecipientBtn');
        disableButton('#removeBulletinBtn');
        changeIconImageSource('#removeBulletinBtn', 'images/rubbish-bin.png');
    } else {
        enableButton('#addRecipientBtn');
        enableButton('#removeBulletinBtn');
    }
};

function disableButton(button) {
    $(button).prop('disabled', true);
};

function enableButton(button) {
    $(button).prop('disabled', false);
};

function changeIconImageSource(element, source) {
    $(element).find(".bulletinIcon").attr("src", source);
};

function fadeInRecipientAddress(e) {
    $('#recipientAddressContainer, #sendBtn').fadeTo( "fast" , 1, function() {
        $('#recipientAddress').focus();
        e.stopPropagation();
    });
};

function splitReturnedBulletinData(data) {
    let bulletins = {
        ids: data.ids.split(','),
        titles: data.titles.split('/.t1tle./,/.t1tle./'),
        contents: data.contents.split('/.c0ntent./,/.c0ntent./'),
        createdDates: data.createdDates.split(',')
    }
    return bulletins;
};

function removeMarkers(bulletinsObj) {
    bulletinsObj.titles = bulletinsObj.titles.map(function(titles) {
        return replaceAll(titles, '/.t1tle./', '');
    });
    bulletinsObj.contents = bulletinsObj.contents.map(function(contents) {
        return replaceAll(contents, '/.c0ntent./', '');
    });
    bulletinsObj.contents = bulletinsObj.contents.map(function(contents) {
        return replaceAll(contents, '/.n3wLine./', '\n');
    });
    return bulletinsObj;
};

function addMarkers(bulletinsObj) {
    for (var i in bulletinsObj.ids) {
        bulletinsObj.contents[i] = '/.c0ntent./' + bulletinsObj.contents[i].replace(/(?:\r\n|\r|\n)/g, '/.n3wLine./') + '/.c0ntent./';
        bulletinsObj.titles[i] = '/.t1tle./' + bulletinsObj.titles[i] + '/.t1tle./';
      };
    return bulletinsObj;
};