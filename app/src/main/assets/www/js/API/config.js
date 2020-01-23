var ajaxTimeout = "90000";

var api_baseurl = "https://sellerstats.net/api/";
//var api_baseurl = "http://18.221.164.83:82/api/";
//var api_baseurl = "http://34.217.42.188:84/api/";

var alertTitle  = "Seller Stats";

//Get Auth and Account id in local storage
var authToken = window.localStorage.getItem("auth_token");
var accountID = window.localStorage.getItem("account_id");
var storeID   = window.localStorage.getItem("storeID");
var storeName = window.localStorage.getItem("storeName")
var userEmail = window.localStorage.getItem("user_email")

var store_limit    = window.localStorage.getItem("store_limit")
var account_pin    = window.localStorage.getItem("account_pin")

var account_type   = window.localStorage.getItem("account_type")
var payment_status = window.localStorage.getItem("payment_status")
var subscription   = window.localStorage.getItem("subscription")
var card_info      = window.localStorage.getItem("card_info")

//Show Store Name for user
if(storeName != null && storeName != ""){
    storeName = capitalize(storeName)
}else{
    storeName = ""
}

$(".selStoreName").html(storeName)

//Show alert notification - Start
function showAlert(msg) {
    navigator.notification.alert(
        msg,                     // message
        alertDismissed,         // callback
        alertTitle,            // title
        'Ok'                  // buttonName
    );
}

// alert dialog dismissed
function alertDismissed() {
    // do something
    return false;
}
//Show alert notification - End

//Show alert notification
function sessionExpired(msg) {
    navigator.notification.alert(
        msg,                      // message
        sessionExpiredDismissed, // callback
        alertTitle,             // title
        'Ok'                   // buttonName
    );
}

// alert dialog dismissed
function sessionExpiredDismissed() {
    //Log out
    logOut();
    
    return false;
}

function check_user_loginState(){
    
    var authToken = window.localStorage.getItem("auth_token");
    return authToken;
}

function logOut(){
    
    //logout logged in users
    var sending_url = api_baseurl+'auth/logout'
    console.log(sending_url);

    $.ajax({
        type        : "GET",
        url         : sending_url,
        contentType : "application/json",
        headers : {
           'accountID': accountID,
           'authToken': authToken,
        },
        success : function(html){
           var result = html.responseMessage;
           //console.log("result=>"+result)
           
           localStorage.clear();
           location.replace("sign_in.html")

        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'Logout Store Session');
        }
    })
}

function capitalize(s){
    return s[0].toUpperCase() + s.slice(1);
}

//Hide store add option
if(store_limit <= 0){
    var addStore = '<a class="menu_text_disable" id="menu_addStore"><i class="fa fa-plus mr-3" aria-hidden="true"></i>ADD STORE <p class="mb-0 ml-4 small">( Enterprise account only )</p></a>'
}else{
    var addStore = '<a id="menu_addStore" href="add_store.html"><i class="fa fa-plus mr-3" aria-hidden="true"></i>ADD STORE</a>'
}

if(account_pin !== 'null' && account_pin !== ""){
    var accPin = '<p class="h5">PIN - '+ account_pin + '</p>'
}else{
    var accPin = ''
}

var slideMenu = '   <div class="nav_container">\
                        <div class="nav_menu">\
                            <div class="pt-5 clearfix">\
                                <h3 class="w-50 float-left">Menu</h3>\
                                <a href="javascript:void(0)" class="w-50 float-right closebtn" onclick="closeNav()">×</a>\
                            </div>\
                            <div class="mt-4 clearfix">\
                                <div class="user_det_container">\
                                    <p class="mb-2 h4">'+ userEmail +'</p>\
                                    '+ accPin +'\
                                </div>\
                            </div>\
                            <div class="mt-4" id="side_menu_list">\
                                '+ addStore +'\
                                <a id="menu_accountConfig" href="store_info.html"><i class="fa fa-cogs mr-3" aria-hidden="true"></i>ACCOUNT CONFIG</a>\
                                <a id="menu_logOut" href="#" onclick="logOut()"><i class="fa fa-power-off mr-3" aria-hidden="true"></i>LOG OUT</a>\
                            </div>\
                        </div>\
                    </div>'

$("#mySidenav").html(slideMenu)

function openNav() {
    document.getElementById("mySidenav").style.width = "100vw";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

//Using Payment subscription
function paymentAlert(){
    var msg = "Please subscribe your account."
    navigator.notification.alert(
        msg,                     // message
        payAlertDismissed,      // callback
        alertTitle,            // title
        'Ok'                  // buttonName
    );
}

// alert dialog dismissed
function payAlertDismissed() {
    // do something
    location.replace("subscription_payment.html")
    return false;
}

var accountErMsg = ""
//Using account activation
function accountActiveAlert(){
    if(accountErMsg != ""){
        var msg = accountErMsg
    }else{
        var msg = "Please verify your account."
    }
    
    navigator.notification.alert(
        msg,                       // message
        accountActiveDismissed,   // callback
        alertTitle,              // title
        'Ok'                    // buttonName
    );
}

// alert dialog dismissed
function accountActiveDismissed() {
    // do something
    var user_mail = window.localStorage.getItem("user_email")
    location.replace("subscription_payment.html?opt=codeActive&mail="+user_mail)
    return false;
}

//Using Payment subscription
function reSubscripeAccount(msg){
    if(msg == ""){
        var msg = "Your Account Expired. Please subscribe"
    }else{
        msg = msg+'. Please subscribe'
    }
    navigator.notification.alert(
        msg,                     // message
        reSubscripeDismissed,   // callback
        alertTitle,            // title
        'Ok'                  // buttonName
    );
}

// alert dialog dismissed
function reSubscripeDismissed() {
    // do something
    location.replace("subscription_plan.html?option=reSubscribe")
    return false;
}

function shareOption(){
    
    navigator.screenshot.URI(function(error,res){
        if(error){
            console.error(error);
        }else{
            //html = '<img style="width:50%;" src="'+res.URI+'">';
            //document.body.innerHTML = html;
                
            //console.log("URI=>"+res.URI)
            window.plugins.socialsharing.share(null, 'SellerStats', res.URI, null)
        }
    },50);
}
