$( document ).ready(function() {
    $("#saveBtn").click(function() {
        setBulletin();
    });

    $("#submitBtn").click(function () {
        getBulletins();
    });

    $(".addBulletinBtn").click(function () {
        $("#bulletinList").append("<li class='bulletinListItem'>New</li><hr class='listItemBottomBorder'>");
    });
});