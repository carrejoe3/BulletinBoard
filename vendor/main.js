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

        //if there aren't any bulletins left, hide delete all button
        if(bulletinIds[0] == undefined || bulletinIds[0] == '') {
            // duration, opacity, callback
            $('#deleteAllBtn').fadeTo('fast', 0, function() {
                $('#deleteAllBtn').css("visibility", "hidden");
            });
        }

        changeIconImageSource('#bulletinListBtn', "images/listActive.png");
        disableEnableBulletinSpecificButtons('disable');
    });

    //delete all button handler
    $("#deleteAllBtn").click(function() {

        $('#bulletinListCol').show();
        $('#bulletinCol').hide();

        delBulletins();

        $(this).fadeTo('fast', 0, function() {
            $(this).css("visibility", "hidden");
        });

        changeIconImageSource('#bulletinListBtn', "images/listActive.png");
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
            $('#removeBulletinBtn, #saveBtn, #bulletinListBtn').slideToggle('fast', function() {
                $('#recipientAddressContainer').fadeTo( "fast" , 1, function() {
                    $('#recipientAddress').focus();
                    e.stopPropagation();
                });
            });
        } else {
            changeIconImageSource('#addRecipientBtn', "images/addRecipient.png");
            $('#recipientAddressContainer').fadeOut('fast', function() {
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
        let id = getActiveBulletinIdIndex();
        // sendBulletin(activeBulletinId, bulletinTitles[id], bulletinContents[id], bulletinCreatedDates[id], $('#recipientAddress').val());
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

    //remove old data from arrays and list
    bulletinIds = [];
    bulletinTitles = [];
    bulletinContents = [];
    bulletinCreatedDates = [];
    $("#bulletinList").empty();

    //sort bulletins from returned data
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