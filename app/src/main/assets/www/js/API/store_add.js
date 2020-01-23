var selRegURL = ""
var selRegID  = ""
var storeName = ""

//Get query string value
var qs = (function(a) {
          if (a == "") return {};
          var b = {};
          for (var i = 0; i < a.length; ++i){
            var p=a[i].split('=', 2);
            if (p.length == 1)
                b[p[0]] = "";
            else
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
          }
          return b;
          })(window.location.search.substr(1).split('&'));

//Get selected issue id
pageType = qs["option"];

if(pageType == "newStore"){
    $("#left_arrow").hide()
    //$("#right_optSetting").hide()
    $("#menu_addStore") .hide()
    $("#menu_accountConfig").hide()
    $("#addStore_title").removeClass("col-6").addClass("col-8")
}

function get_storeRegion(){
    
    var sending_url = api_baseurl+'configuration/zones'
    //console.log(sending_url)
    
    $.ajax({
        type        : "GET",
        url         : sending_url,
        headers : {
           'accountID': accountID,
           'authToken': authToken,
        },
        success : function(html){
            var result = html.responseMessage;
            //console.log("result=>"+JSON.stringify(html))
            if(html.responseCode == 0){
                var regHtml = ""
                $.each(result, function (idx, obj){
                    if(obj.is_enabled === true){
                       
                       selRegURL = obj.url;
                       selRegID  = obj.id;
                       
                       if(obj.id === 0){
                            var img = 'img/northAmerica-regions.png'
                       }else if(obj.id === 1){
                            var img = 'img/europe-regions.png'
                       }

                       regHtml += ' <div class="card mb-2">\
                                        <div class="card-body" onclick="ext_browser(\''+ obj.url +'\',\''+ obj.id +'\')">\
                                            <div class="float-left card_img_container">\
                                                <img src="'+ img +'" class="mr-3"/>\
                                            </div>\
                                            <p></p>\
                                            <p class="card-text mb-2">'+ obj.name +'</p>\
                                        </div>\
                                    </div>';
                       
                    }
                })
           
                $("#store_region").html(regHtml)
                //console.log("result=>"+JSON.stringify(result))
           
            }else if(html.responseCode == 5){
           
                //Session expired
                sessionExpired(html.responseDescription)
            }
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'Get store option list');
        }
    })
}

function ext_browser(url, id){
    
    selRegURL = url
    selRegID  = id
    
    $("#store_region").hide()
    $("#store_info_det").show()
}

//Using inapp browser
function continueStoreAddProcess(){
    
    storeName = $("#store_name").val()
    
    if(storeName == ""){
        showAlert("Please enter store name")
        return false;
    }
    
    var options = "hideurlbar=yes,useWideViewPort=yes,enableViewportScale=yes,location=yes,hidden=no,clearsessioncache=yes";
    
    var inAppRef = cordova.InAppBrowser.open(encodeURI(selRegURL), '_blank', options);
    
    //Temporary solution
    // var loop =  setInterval(function() {
//                     inAppRef.executeScript({
//                         code: "document.getElementsByClassName('credentials-content')[0].innerHTML"
//                     },function(html) {
//                         if (html) {
//                             clearInterval(loop);
//                             
//                             window.localStorage.setItem("seller_account_det", html);
//                             //Call Send Store Details function
//                             sendStoreDet()
//                             //Close inappbrowser
//                             inAppRef.close()
//                         }
//                     });
//                 }, 6000);
    
   inAppRef.addEventListener('loadstop', function() {
       console.log("loadstop")
       inAppRef.executeScript({
           code: "document.getElementsByClassName('credentials-content')[0].innerHTML"
       }, function(html) {
           //console.log("html=>"+ html)
           window.localStorage.setItem("seller_account_det", html);
           //Call Send Store Details function
           sendStoreDet()
           //Close inappbrowser
           inAppRef.close()
       });
   });
    
    inAppRef.addEventListener('loaderror', function() {
        console.log("loaderror")
    });
    
    inAppRef.addEventListener('exit', function() {
        //Close inappbrowser
        inAppRef.close()
    });
}

function sendStoreDet(){
    
    var sending_url = api_baseurl+'store/create'
    var store_html  = $.trim(window.localStorage.getItem("seller_account_det"))
    var sending_val = JSON.stringify({"store_name": storeName, "market_place" : parseInt(selRegID), "data_string" : store_html})
    //console.log(sending_url)
    //console.log(sending_val)
    
    $.ajax({
        type    : "POST",
        url     : sending_url,
        data    : sending_val,
        contentType   : "application/json",
        headers : {
           'accountID': accountID,
           'authToken': authToken,
        },
        success : function(html){
            var result = html.responseMessage
           
            if(html.responseCode == 0){
                window.localStorage.setItem("storeID", result.id)
                window.localStorage.setItem("storeName", result.store_name)
                window.localStorage.setItem("account_status", "Activated");
                window.localStorage.setItem("store_limit", html.store_limit);

                storeSuccessAlert(html.responseDescription)
            }else if(html.responseCode == 5){
                //Session expired
                sessionExpired(html.responseDescription)
            }else{
                $("#store_info_det").hide()
                $("#store_region").show()
                showAlert(html.responseDescription)
            }
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'Get store option list');
        }
    })
}

//Show alert notification
function storeSuccessAlert(msg) {
    navigator.notification.alert(
        msg,                     // message
        storeSuccessDismissed,  // callback
        alertTitle,            // title
        'Ok'                  // buttonName
    );
}

// alert dialog dismissed
function storeSuccessDismissed() {
    // do something
    
    var storeID = window.localStorage.getItem("storeID")
    
    if(authToken != "" && storeID != ""){
        location.replace("dashboard.html")
    }

    return false;
}

function checkView(){
    
    if($('#store_info_det').is(':visible')){
        $("#store_info_det").hide()
        $("#store_region").show()
    }else{
        window.history.back()
    }
}
