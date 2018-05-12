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

    // $(".bulletinContainer").mouseover(function() {
    // 	$(this).find(".removeBulletinBtn").css("display", "block");
    // });

    // $(".bulletinContainer").mouseleave(function() {
    // 	$(this).find(".removeBulletinBtn").css("display", "none");
    // });
});