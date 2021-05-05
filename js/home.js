$(document).ready(function(){
    $("#menu-toggle").click(function(e){
        e.preventDefault();
        $("#wrapper").toggleClass("menuDisplayed");
    });
});

$(document).ready(function(){
    $("#dark").click(function(){
        $("body").css("background-color","black");
        $("body").css("color","white");
    });
});

