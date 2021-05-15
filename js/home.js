$(document).ready(function(){
    $("#menu-toggle").click(function(e){
        e.preventDefault();
        $("#wrapper").toggleClass("menuDisplayed");
    });
});

// $(document).ready(function(){
//     $("#dark").click(function(){
//         $("body").css("background-color","black");
//         $("body").css("color","white");
//     });
// });
//-----------------------------------------------------------------------------------------------
function favourite() {
    var button = event.target
    var item = button.parentElement.parentElement
    console.log(item)
    var img = item.getElementsByClassName("myImg")[0].src
    // console.log(img)

    var title = item.getElementsByTagName('h2')[0].innerText
    // console.log(title)
    addfav(img, title)
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function addfav(img, title){
    var fav = getCookie("favourite")
    var data = [img, title]
    console.log(fav)
    if(fav==""){
        var ans = [0,data]
        console.log(ans)
        document.cookie = `favourite=${[JSON.stringify(ans)]}; path=/`
        return
    }
    var ans = JSON.parse(fav)
    ans.push(data)
    document.cookie = `favourite=${JSON.stringify(ans)}; path=/`
}

