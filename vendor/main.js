$( document ).ready(function() {

    $(".bulletinContainer").mouseover(function() {
    	$(this).find(".removeBulletinBtn").css("display", "block");
    });

    $(".bulletinContainer").mouseleave(function() {
    	$(this).find(".removeBulletinBtn").css("display", "none");
    });
});