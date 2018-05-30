let activeBulletinId;
let walletAddress;
let recipientAdded = false;
let bulletins = {
    ids: [],
    titles: [],
    createdDates: [],
    authors: []
};

$( document ).ready(function() {
    $("#saveBtn").click(function() {
        updateBulletinArrays();
        bulletins = addMarkers(bulletins);

        if(!isNull(bulletins.ids[0])) {
            saveBulletins(bulletins, activeBulletinId, $('#bulletinMainContent').val());
        } else {
            delBulletins();
        }
    });

    $("#addBulletinBtn").click(function() {
        let newId = generateUUID();
        let newTitle = 'Title';
        let newDate = new Date().toLocaleDateString();

        newBulletinListItem(newId, newTitle, newDate, walletAddress);

        //push new bulletin data to bulletin object
        bulletins.ids.push(newId);
        bulletins.titles.push(newTitle);
        bulletins.createdDates.push(newDate);
        bulletins.authors.push(walletAddress);
    });

    $("#bulletinList").on("click", ".bulletinListItem", function(e) {
        $('#bottomHelpBannerText').hide();
        $('#loader').css('display', 'flex');
        updateBulletinArrays();
        activeBulletinId = $(this).attr("data-bulletinId");
        getBulletin(activeBulletinId);
        e.stopPropagation();
    });

    $("#removeBulletinBtn").click(function() {
        let activeIdIndex = getActiveBulletinIdIndex();

        bulletins.ids.splice(activeIdIndex, 1);
        bulletins.titles.splice(activeIdIndex, 1);
        bulletins.createdDates.splice(activeIdIndex, 1);
        bulletins.authors.splice(activeIdIndex, 1);

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
        validateWalletAddress($('#recipientAddress').val());
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
        $('#helpBanner').css('display', 'block');
    } else {
        //set help banner
        $('#helpBanner').append('<div class="alert" role="alert"><div id="alertText">WebExtensionWallet detected!</div><button class="btn btn-sm alertCloseBtn" type="button"><img class="bulletinIcon" src="images/cancel.png" /></button></div></div>');

        getAccountData();
        getBulletins();
        helpBannerHandler();
    }
});

function helpBannerHandler() {
    let helpMessages = ['None of your changes will be committed until you click save!', 'WebExtensionWallet detected!'];
    let helpIndex = 0;

    //if user has no bulletins, add help message to array
    if(bulletins.ids[0] == 'undefined' || bulletins.ids[0] == '') {
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

function handleBulletinsResponse(data) {
    $('#loader').hide();

    //remove old data from arrays and list
    bulletins = [];
    $("#bulletinList").empty();

    bulletins = splitReturnedBulletinData(data);
    bulletins = removeMarkers(bulletins);

    for (let i in bulletins.ids) {
        newBulletinListItem(bulletins.ids[i], bulletins.titles[i], bulletins.createdDates[i], bulletins.authors[i]);
    };
};

function handleBulletinResponse(data) {
    //apply active styling to main bulletin container
    $(".sidebarBulletinTitle").removeClass('activeBulletin');
    $(this).find(".sidebarBulletinTitle").addClass('activeBulletin');

    //loader and enable buttons
    $('#loader').css('display', 'none');
    $('#bottomHelpBannerText').hide();
    disableEnableBulletinSpecificButtons('enable');

    //set bulletin contents
    let activeIdIndex = getActiveBulletinIdIndex();
    $('#bulletinMainContent').val(data);
    $('#bulletinTitle').val(bulletins.titles[activeIdIndex]);

    //show main bulletin and set focus
    $("#bulletinCol").fadeIn('fast', function() {
        $('.cardHeaderTitle').focus();
    });

    //if user is on mobile, hide bulletin list
    if (mobileMode()) {
        $('#bulletinListCol').hide();
        changeIconImageSource('#bulletinListBtn', "images/list.png");
    } else {
        //apply active styling to bulletin list item
        $('.bulletinListItem').css('font-weight', '');
        $('#bulletinList').find(`[data-bulletinid='${activeBulletinId}']`).css("font-weight", "bold");
        $('.eye').fadeOut('fast');
        $('#bulletinList').find(`[data-bulletinid='${activeBulletinId}']`).find(".eye").fadeIn('fast');
    }
};

function sendBulletinsHandler(data) {
    let recipientBulletins = new Object();
    if(!isNull(data)) {
        recipientBulletins = splitReturnedBulletinData(data);
        recipientBulletins = removeMarkers(recipientBulletins);
    }

    //add bulletin we want to send to bulletin object
    index = getActiveBulletinIdIndex();
    recipientBulletins.ids.unshift(bulletins.ids[index]);
    recipientBulletins.titles.unshift(bulletins.titles[index]);
    recipientBulletins.createdDates.unshift(bulletins.createdDates[index]);
    getAccountData();
    recipientBulletins.authors.unshift(walletAddress);

    recipientBulletins = addMarkers(recipientBulletins);

    sendBulletins(recipientBulletins, $('#recipientAddress').val());
};

function updateBulletinArrays() {
    //activeBulletinId is initially null and after bulletin has been removed
    if(null != activeBulletinId) {
        let activeIdIndex = getActiveBulletinIdIndex();
        bulletins.titles.splice(activeIdIndex, 1, $('#bulletinTitle').val());
    };
};

//add new bulletin to bulletin list
function newBulletinListItem(bulletinId, title, date, authorId) {
    author = authorId == walletAddress? 'You': authorId;
    $("#bulletinList").append("<li class='bulletinListItem' data-bulletinId='" + bulletinId + "'><div class='row'><div class='col-10'><span class='sidebarBulletinTitle'>" + title + "</span><div class='bulletinListSmallText'>" + 'Created: ' + date + "</div><div class='bulletinListSmallText'>" + 'Author: '+ author + "</div></div><div class='col-2'><img class='eye' src='images/eye.png'/></div></div><hr class='listItemBottomBorder'/></li>");
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
    return bulletins.ids.indexOf(activeBulletinId);
};

function mobileMode() {
    return $(window).width() < 768;
};

function disableEnableBulletinSpecificButtons(ind) {
    if(ind == 'disable') {
        disableButton('#addRecipientBtn');
        disableButton('#removeBulletinBtn');
        disableButton('#saveBtn');
        changeIconImageSource('#removeBulletinBtn', 'images/rubbish-bin.png');
    } else {
        enableButton('#addRecipientBtn');
        enableButton('#removeBulletinBtn');
        enableButton('#saveBtn');
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
        createdDates: data.createdDates.split(','),
        authors: data.authors.split(',')
    }
    return bulletins;
};

function removeMarkers(bulletinsObj) {
    bulletinsObj.titles = bulletinsObj.titles.map(function(titles) {
        return replaceAll(titles, '/.t1tle./', '');
    });
    return bulletinsObj;
};

function addMarkers(bulletinsObj) {
    for (var i in bulletinsObj.ids) {
        bulletinsObj.titles[i] = '/.t1tle./' + bulletinsObj.titles[i] + '/.t1tle./';
      };
    return bulletinsObj;
};

function getAccountData() {
    window.postMessage({
        "target": "contentscript",
        "data":{
        },
        "method": "getAccount",
    }, "*");

    //remove first to avoid duplicate listeners being created
    window.removeEventListener('message', function(e) {
        // e.detail contains the transferred data
        console.log("recived by page:" + e + ", e.data:"+ JSON.stringify(e.data));
        if(null != e.data.data.account){
            walletAddress = e.data.data.account;
        }
    });

    // listen message from contentscript
    window.addEventListener('message', function(e) {
        // e.detail contains the transferred data
        console.log("recived by page:" + e + ", e.data:"+ JSON.stringify(e.data));
        if(null != e.data.data.account){
            walletAddress = e.data.data.account;
        }
        // if(!!e.data.data.txhash){
        //     document.getElementById("txResult").innerHTML = "Transaction hash\n" +  JSON.stringify(e.data.data.txhash,null,'\t');
        // }
        // if(!!e.data.data.receipt){
        //     document.getElementById("txResult").innerHTML = "Transaction Receipt\n" +  JSON.stringify(e.data.data.receipt,null,'\t');
        // }
        // if(!!e.data.data.neb_call){
        //     document.getElementById("txResult").innerHTML = "return of call\n" +  JSON.stringify(e.data.data.neb_call,null,'\t');
        // }
    });
}

function isNull(result) {
    return result == 'null' || typeof result == 'undefined' || result == '';
}

function validateWalletAddress(address) {
    if (address == walletAddress) {
        $('#loader').hide();
        $('#bottomHelpBannerText')
            .text('Cannot send bulletin to yourself.')
            .show();
    } else if (address.length != 35 || isNull(address)) {
        $('#loader').hide();
        $('#bottomHelpBannerText')
            .text('Please enter a valid wallet address.')
            .show();
    } else {
        getRecipientBulletins($('#recipientAddress').val());
        $('#bottomHelpBannerText').hide();
    }
};