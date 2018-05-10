$( document ).ready(function() {
    $("#saveBtn").click(function() {
        setBulletin();
    });

    $("#submitBtn").click(function () {
        getBulletins();
    });

    $(".bulletinContainer").mouseover(function() {
    	$(this).find(".removeBulletinBtn").css("display", "block");
    });

    $(".bulletinContainer").mouseleave(function() {
    	$(this).find(".removeBulletinBtn").css("display", "none");
    });
});