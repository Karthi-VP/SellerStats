var store_id = ""

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
pageType = qs["page"];
store_id = qs["store_id"];

function loadAccountSetting(storeID){
    
    //Get All Product details
    var sending_url = api_baseurl+'store/'+ storeID
    //console.log(sending_url)
    
    $.ajax({
        type        : "GET",
        url         : sending_url,
        headers : {
           'accountID': accountID,
           'authToken': authToken,
           'storeID'  : storeID,
        },
        success : function(html){
           var result = html.responseMessage;
           //console.log("result=>"+JSON.stringify(result))
           
           if(html.responseCode == 0){
           
               $("#store_name").val(result.store_name)
               $("#seller_id").val(result.seller_id)
               $("#access_key").val(result.access_key)
               $("#secret_key").val(result.secret_key)
           
               getAccountOption(result.type, result.market_place)
           }else if(html.responseCode == 5){
           
                //Session expired
                sessionExpired(html.responseDescription)
           }
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'Load Account Settings');
        }
    })
}

function updateAccountSetting(){
    
    var formdata = $("#account_setting").serializeArray();
    
    var store_name       = $("#store_name").val();
    var fulfillment_type = $("#fulfillment_type").val();
    var market_place     = $("#market_place").val();
    var seller_id        = $("#seller_id").val();
    var access_key       = $("#access_key").val();
    var secret_key       = $("#secret_key").val();

    if(store_name == ""){
        showAlert("Please enter store name");
        return false;
    }else if(fulfillment_type == ""){
        showAlert("Please select fulfillment type");
        return false;
    }else if(market_place == ""){
        showAlert("Please select marketplace");
        return false;
    }else if(seller_id == ""){
        showAlert("Please enter seller id");
        return false;
    }else if(access_key == ""){
        showAlert("Please enter access key ");
        return false;
    }else if(secret_key == ""){
        showAlert("Please enter secret key");
        return false;
    }
    
    var datavalue = {};
    $(formdata).each(function(index, obj){
        datavalue[obj.name] = obj.value;
    });
    
    //Create and update user store details
    var sending_url = api_baseurl+'store/update'
    var sending_val = JSON.stringify(datavalue)
    
    //console.log(sending_url)
    //console.log(sending_val)
    
    $.ajax({
        type        : "PUT",
        url         : sending_url,
        contentType : "application/json",
        headers : {
           'accountID': accountID,
           'authToken': authToken,
        },
        data    : sending_val,
        success : function(html){
            //console.log(html)
            var result = html.responseMessage;

            if(html.responseCode == 0){
                window.localStorage.setItem("storeID", result.id)
                window.localStorage.setItem("storeName", result.store_name)
                window.localStorage.setItem("account_status", "Activated");
                $("#store_id").val(result.id)
           
                showSettingAlert(html.responseDescription)
            }else if(html.responseCode == 5){
           
                //Session expired
                sessionExpired(html.responseDescription)
            }

        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'Account Setting');
        }
    });
}

//Show alert notification
function showSettingAlert(msg) {
    navigator.notification.alert(
        msg,                     // message
        settingAlertDismissed,  // callback
        alertTitle,            // title
        'Ok'                  // buttonName
    );
}

// alert dialog dismissed
function settingAlertDismissed() {
    // do something
    
    var storeID = window.localStorage.getItem("storeID")
    
    if(authToken != "" && storeID != ""){
        location.replace("dashboard.html")
    }
    
    return false;
}


function getAccountOption(accountType, marketPlace){
    
    //Get Account Option
    var sending_url = api_baseurl+'configuration/MarketPlace,FulfillmentType'
    //console.log(sending_url);
    
    $.ajax({
        type        : "GET",
        url         : sending_url,
        headers : {
           'accountID': accountID,
           'authToken': authToken,
           'storeID'  : storeID,
        },
        success     : function(html){
            var result = html.responseMessage;
            //console.log("Result=>"+JSON.stringify(html));
           
            if(html.responseCode == 0){
           
                $.each(result, function (idx, obj){
                    
                    //Load Marketplace options
                    if(obj.key == "MarketPlace"){
                       
                        var marketOption = '<option value="">Please select</option>';
                        $.each(obj.data, function (idx1, obj1){
                               
                            if(accountType !== ""){
                                if(obj1.value == marketPlace){
                                    var opt = 'selected'
                                }else{
                                    var opt = ''
                                }
                            }else{
                                if(obj1.is_default == true){
                                    var opt = 'selected'
                                }else{
                                    var opt = ''
                                }
                            }
                               
                            marketOption += '<option value="'+ obj1.value +'" '+ opt +'>'+ obj1.text +'</option>'
                        })
                               
                        $("#market_place").html(marketOption)
                    }
                    
                    //Load fulfillment type options
                    if(obj.key == "FulfillmentType"){

                        var marketOption = '<option value="">Please select</option>';
                        $.each(obj.data, function (idx2, obj2){
                            
                            if(marketPlace !== ""){
                               if(obj2.value == accountType){
                                    var sel_opt = 'selected'
                               }else{
                                    var sel_opt = ''
                               }
                            }else{
                               if(obj2.is_default == true){
                                    var sel_opt = 'selected'
                               }else{
                                    var sel_opt = ''
                               }
                            }
                               
                            marketOption += '<option value="'+ obj2.value +'" '+ sel_opt +'>'+ obj2.text +'</option>'
                        })

                        $("#fulfillment_type").html(marketOption)
                    }
                })
            }else if(html.responseCode == 5){
           
                //Session expired
                sessionExpired(html.responseDescription)
            }

        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'Account Option');
        }
    });
}
