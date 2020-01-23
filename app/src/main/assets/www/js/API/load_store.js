var regTokenID = ""

function loadStoreList(){
    
    var store_id  = window.localStorage.getItem("storeID")
    var storeName = window.localStorage.getItem("storeName")
    
    //Get store list
    var sending_url = api_baseurl+'store'
    //console.log(sending_url);

    $.ajax({
        type        : "GET",
        url         : sending_url,
        headers : {
           'accountID': accountID,
           'authToken': authToken,
           'storeID'  : storeID,
        },
        success : function(html){
            var result = html.responseMessage
            //console.log("result=>"+JSON.stringify(html))
           
            if(html.responseCode == 0){
                if(jQuery.isEmptyObject(result) === false){
           
                    var storeList = ""
                    $.each(result, function (idx, obj){
                  
                           if(store_id == obj.id){
                                var selected = "checked"
                                //Assign target profit value in selected store
                                var target_profit = obj.target_profitability
                                $("#target_profit").val(target_profit)
                                window.localStorage.setItem("target_profit", target_profit)
                                if(obj.status > 3){
                                    $("#targetProfit_btn").hide();
                                    $("#target_profit").attr('readonly', true);
                                }
                           }else{
                                var selected = ""
                           }
                           
                           storeList += '   <li class="list-group-item mb-1">\
                                                <div class="custom-control custom-radio custom-control-inline">\
                                                    <input type="radio" id="storeList_'+ obj.id +'" name="storeList" class="custom-control-input" onclick="selectedStore(\''+ obj.id +'\',\''+ obj.name +'\',this)" '+ selected +'>\
                                                    <label class="custom-control-label" for="storeList_'+ obj.id +'">'+ obj.name +'</label>\
                                                </div>\
                                                <div class="d-inline float-right opt_btn">\
                                                    <a href="store_info.html?page=edit&store_id='+ obj.id +'" class="mr-3"><i class="fa fa-pencil-square-o p-2" aria-hidden="true"></i></a>\
                                                    <a onclick="deleteStore(\''+ obj.id +'\')"><i class="fa fa-trash-o p-2" aria-hidden="true"></i></a>\
                                                </div>\
                                            </li>'
                  
                    })
           
                    $("#load_store_list").html(storeList)
                    $("#setTargetProfit").show()
           
                }else{
           
                    if(store_id != "" && storeName != ""){
       
                        var storeList = '   <li class="list-group-item mb-1">\
                                                <div class="custom-control custom-radio custom-control-inline">\
                                                    <input type="radio" id="storeList_'+ store_id +'" name="storeList" class="custom-control-input" onclick="selectedStore(\''+ store_id +'\',\''+ storeName +'\',this)" checked>\
                                                    <label class="custom-control-label" for="storeList_'+ store_id +'">'+ storeName +'</label>\
                                                </div>\
                                                <div class="d-inline float-right opt_btn">\
                                                    <a href="store_info.html?page=edit&store_id='+ store_id +'" class="mr-3"><i class="fa fa-pencil-square-o p-2" aria-hidden="true"></i></a>\
                                                    <a onclick="deleteStore(\''+ store_id +'\')"><i class="fa fa-trash-o p-2" aria-hidden="true"></i></a>\
                                                </div>\
                                            </li>'
       
                        $("#load_store_list").html(storeList)
                        $("#setTargetProfit").show()
       
                    }else{
       
                        showAlert("Something went wrong please try again.")
       
                    }
                }
            }else if(html.responseCode == 5){
                //Session expired
                sessionExpired(html.responseDescription)
            }else{
                $("#menu_addStore") .hide()
                $("#menu_accountConfig").hide()
            }
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'Get Store List');
        }
    })
}

function selectedStore(id, name, attr){
    
    window.localStorage.setItem("storeID", id)
    window.localStorage.setItem("storeName", name)
    
    $(attr).removeClass("text-success")
    $(attr).addClass("text-success")
    
    location.replace("dashboard.html")
}

function cardToggle(id){
    $("#optionCard_"+id).toggle()
}

function deleteStoreConform(id){
    
    //Authenticate user login
    var sending_url = api_baseurl+'store/delete/'+id
    //console.log(sending_url);

    $.ajax({
        type        : "PUT",
        url         : sending_url,
        contentType : "application/json",
        headers : {
           'accountID': accountID,
           'authToken': authToken,
        },
        success : function(html){
            //console.log("result=>"+JSON.stringify(html))
            var result = html.responseMessage;
           
            if(html.responseCode == 0){
           
                if(result.account_status === "Active" || result.account_status === "Activated"){
                //local storage set storeID and storeName for 1st one
                    if(jQuery.isEmptyObject(result.store_ids) === false){
                        var count = 0
                        $.each(result.store_ids, function (idx, obj){
                            if(count == 0){
                               window.localStorage.setItem("storeID", idx)
                               window.localStorage.setItem("storeName", obj)
                            }
                            count++
                        })
                    }
           
                    //location.replace("dashboard.html")
                    deleteAlert(html.responseDescription)
           
                }else{
           
                    window.localStorage.setItem("storeID", "")
                    window.localStorage.setItem("storeName", "")
                    window.localStorage.setItem("account_status", result.account_status)
           
                    location.replace("add_store.html?option=newStore")
           
                }
           
                window.localStorage.setItem("store_limit", result.store_limit);
           
            }else if(html.responseCode == 5){
                //Session expired
                sessionExpired(html.responseDescription)
            }

        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'Logout Store Session');
        }
    })
}

// process the confirmation dialog result
function onConfirmDelete(button, id) {
    if(button === 1){
        deleteStoreConform(id)
    }
}

// Show a custom confirmation dialog
function deleteStore(id) {
    navigator.notification.confirm(
        'Are you sure want to delete?',  // message
        function(buttonIndex){
            onConfirmDelete(buttonIndex, id);
        },                              // callback to invoke with index of button pressed
        alertTitle,                     // title
        'Delete,Cancel'                 // buttonLabels
    );
}


//Show alert notification
function deleteAlert(msg) {
    navigator.notification.alert(
        msg,                     // message
        deleteAlertDismissed,   // callback
        alertTitle,            // title
        'Ok'                  // buttonName
    );
}

// alert dialog dismissed
function deleteAlertDismissed() {
    
    loadStoreList()
}

//Get Account info
function getAccountInfo(){
    
    $(".loader").removeClass("invisible").addClass("visible")
    
    //Get account info
    var sending_url = api_baseurl+'accounts/accountinfo'
    console.log(sending_url);
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
           //console.log("store_info=>"+JSON.stringify(html))
           
           $(".loader").removeClass("visible").addClass("invisible")
           
           if(html.responseCode == 0){
                if(result.subscription !== 0){
                    if(result.cycle == 0){
                        var typeOpt = "Monthly"
                    }else if(result.cycle == 1){
                        var typeOpt = "Annually"
                    }
                    var price = result.amount +' / <span class="small">'+ typeOpt +'</span> </br>'
                }else{
                    var price = ''
                }
           
                var text = price + result.plan_info.limit_detail
           
                var date = ""
           
                if(result.trial_end_date != null){
           
                    date += '<div class="mb-2">\
                                <span class="small">Trial End Date</span>\
                                <p class="pull-right h6 mt-1">'+ result.trial_end_date +'</p>\
                            </div>'
                }
           
                if(result.next_bill_date != null){
           
                    date += '<div class="mb-2">\
                                <span class="small">Next Bill Date</span>\
                                <p class="pull-right h6 mt-1">'+ result.next_bill_date +'</p>\
                            </div>'
                }
           
                if(result.canceled_date != null){
           
                    date += '<div class="mb-2">\
                                <span class="small">Canceled Date</span>\
                                <p class="pull-right h6 mt-1">'+ result.canceled_date +'</p>\
                            </div>'
                }
//Hide this code for iOS using inapp purchase so it not use
//                if(result.account_status !== 8 && result.account_status !== 9){
//
//                    var buttonText = '<div class="mt-3"><button type="button" class="btn btn-link pl-0" onclick="cancelSubscripe()"> Cancel Subscription </button></div>'
//
//                }else if(result.account_status === 8){
//
//                    var buttonText = '<div class="mt-3"><button type="button" class="btn btn-link pl-0" onclick="reSubscribe()">Re-Subscribe</button></div>'
//
//                }else if(result.account_status === 9){
//
//                    var buttonText = '<div class="mt-3"><button type="button" class="btn btn-link pl-0" onclick="cancelSubscripe()">Subscribe</button></div>'
//
//                }else{
//                    var buttonText = ''
//                }
           
                var accountInfo = ' <div class="mb-2">\
                                        <span class="small">Selected Plan</span>\
                                        <p class="pull-right h6 mt-1">'+ result.plan_info.display_name +'</p>\
                                    </div>\
                                    <div class="mb-2">\
                                        <span class="small">Account Status</span>\
                                        <p class="pull-right h6 mt-1">'+ result.status +'</p>\
                                    </div>\
                                    <div class="mb-2">\
                                        <span class="small">Account Type</span>\
                                        <p class="pull-right h6 mt-1">'+ result.type +'</p>\
                                    </div>\
                                    <div>\
                                        <span class="small">Plan Details</span>\
                                        <p class="text-right">'+ text +'</p>\
                                    </div>\
                                    '+ date
           
                $("#accountInfo").html(accountInfo)
                $("#myAccountInfo").show()
           
           }else{
           
                showAlert(html.responseDescription)
           }
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'get Account Info');
        }
    })
}

function cancelSubscripe(){
    
    //Get account info
    var sending_url = api_baseurl+'accounts/unsubscribe'
    console.log(sending_url);
    $.ajax({
        type        : "Delete",
        url         : sending_url,
        headers : {
           'accountID': accountID,
           'authToken': authToken,
           'storeID'  : storeID,
        },
        success : function(html){
           var result = html.responseMessage;
           console.log("store_info=>"+JSON.stringify(html))
           
           if(html.responseCode == 0){
                deleteSubscripe(html.responseDescription)
           }else if(html.responseCode == 7){
                re_subscribe(html.responseDescription)
           }else{
                showAlert(html.responseDescription)
           }
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'get Account Info');
        }
    })
}

//Show alert notification
function deleteSubscripe(msg) {
    navigator.notification.alert(
        msg,                         // message
        deleteSubscripeDismissed,   // callback
        alertTitle,                // title
        'Ok'                      // buttonName
    );
}

// alert dialog dismissed
function deleteSubscripeDismissed() {
    
    getAccountInfo()
}

function reSubscribe(){
    
    //Get account info
    var sending_url = api_baseurl+'accounts/resubscribe'
    console.log(sending_url);
    $.ajax({
        type        : "PUT",
        url         : sending_url,
        headers : {
           'accountID': accountID,
           'authToken': authToken,
           'storeID'  : storeID,
        },
        success : function(html){
           var result = html.responseMessage;
           //console.log("reSubscribe=>"+JSON.stringify(html))
           
           if(html.responseCode == 0){
                deleteSubscripe(html.responseDescription)
           }else{
                showAlert(html.responseDescription)
           }
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'Re Subscribe account');
        }
    })
}


//Show alert notification
function re_subscribe(msg) {
    navigator.notification.alert(
        msg,                         // message
        re_subscribeDismissed,   // callback
        alertTitle,                // title
        'Ok'                      // buttonName
    );
}

// alert dialog dismissed
function re_subscribeDismissed() {
    
    location.replace("subscription_plan.html?option=reSubscribe")
}

function updateTargetProfit(){
    
    var target_profit = $("#target_profit").val()
    
    if(target_profit == ""){
        showAlert("Please enter target profit")
        return false;
    }
    
    $(".loader").removeClass("invisible").addClass("visible")
    
    //Get account info
    var sending_url = api_baseurl+'store/update/targetprofit'
    var sending_val = JSON.stringify({"id": storeID, "target_profitability" : target_profit})
    //console.log(sending_url);
    $.ajax({
        type    : "PUT",
        url     : sending_url,
        data    : sending_val,
        contentType   : "application/json",
        headers : {
           'accountID': accountID,
           'authToken': authToken,
           'storeID'  : storeID,
        },
        success : function(html){
           var result = html.responseMessage;
           //console.log("target_profitability=>"+JSON.stringify(html))
           
           $(".loader").removeClass("visible").addClass("invisible")
           
           if(html.responseCode == 0){
                $("#target_profit").val(result)
                window.localStorage.setItem("target_profit", result)
                showAlert(html.responseDescription)
           }else{
                showAlert(html.responseDescription)
           }
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'Update Target Profit');
        }
    })
}

function getCardInfo(){
    
    //Get account info
    var sending_url = api_baseurl+'accounts/getcard'
    console.log(sending_url);
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
           console.log("get_crad_info=>"+JSON.stringify(html))
           
           var cardNumber = result.card_no
           cardNumber     = "************"+cardNumber
           
           var expiry_month = result.expiry_month
           var expiry_year  = result.expiry_year
           expiry_year      = expiry_year.toString().substring(2);
           
           var expiry_date = expiry_month+"/"+expiry_year
           
           var cardHolder_Name = result.card_holder_name
           
           $("#card_number").val(cardNumber)
           $("#expiry_date").val(expiry_date)
           $("#card_cvv").val("***")
           $("#card_holder_name").val(cardHolder_Name)
           
           $("#saved_card_info").show();
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'Get Card Info');
        }
    })
}

//Enter numbers only
function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

$("#expiry_date").keypress(function(){
                           
    if ($(this).val().length == 2){
        $(this).val($(this).val() + "/");
    }
    return true;
});

var stripeKey = ""
function getStripePaymentKey(){
    
    var sending_url = api_baseurl+'configuration/key'
    //console.log(sending_url);
    $.ajax({
        type        : "GET",
        url         : sending_url,
        contentType : "application/json",
        headers : {
           'accountID': accountID,
           'authToken': authToken,
        },
        success     : function(html){
           //console.log("Result=>"+JSON.stringify(html));
           var result = html.responseMessage;
           stripeKey  = result
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'Get Stripe Payment Key');
        }
    })
}

function updateCardInfo(){
    
    var card_number      = $("#card_number").val()
    var expiry_date      = $("#expiry_date").val()
    var card_cvv         = $("#card_cvv").val()
    var card_holder_name = $("#card_holder_name").val()
    
    if(card_number == ""){
        $(".personalInfo_error_msg").text("")
        $(".cardInfo_error_msg").text("Please enter card number")
        return false;
    }else if(expiry_date == ""){
        $(".cardInfo_error_msg").text("Please enter expiry date")
        return false;
    }else if(card_cvv == ""){
        $(".cardInfo_error_msg").text("Please enter card cvv number")
        return false;
    }
    
    Stripe.setPublishableKey(stripeKey);
    
    //Split expiry date
    var date = expiry_date.split('/');
    
    if(Stripe.card.validateCardNumber(card_number) === false){
        $(".cardInfo_error_msg").text("Please enter valid card number")
        return false;
    }else if(Stripe.card.validateExpiry(date[0], date[1]) === false){
        $(".cardInfo_error_msg").text("Please enter valid expiry date")
        return false;
    }else if(Stripe.card.validateCVC(card_cvv) === false){
        $(".cardInfo_error_msg").text("Please enter valid CVV number")
        return false;
    }else{
        $(".cardInfo_error_msg").text("")
    }
    
    Stripe.card.createToken({
        number: card_number,
        cvc: card_cvv,
        exp_month: date[0],
        exp_year: date[1],
        name: card_holder_name
    }, stripeResponseHandler);
    
    function stripeResponseHandler(status, response) {
        if (response.error) {
            $(".cardInfo_error_msg").text("Something went wrong please try again!")
            return false;
        }else{
            regTokenID = JSON.stringify(response)
        }
        //console.log("token=>"+JSON.stringify(response));
    }
    
    //Show loader option
    $(".loader").removeClass("invisible").addClass("visible")
    
    var getRegTokenID = 0
    var count    = 0
    var interval =  setInterval(function() {
                        count++;
                        if(regTokenID != ""){
                            sendDataToServer();
                        }
                                
                        if(count >= 10){
                            //avoid continues loop mode
                            clearInterval(interval);
                            $(".loader").removeClass("visible").addClass("invisible")
                        }
                    }, 3000);
    
    $(".cardInfo_error_msg").text("")
    
    function sendDataToServer(){
        
        clearInterval(interval); // stop the interval
        
        //Authenticate user login
        var sending_url = api_baseurl+'accounts/changecard'
        var sending_val = JSON.stringify(regTokenID);
        console.log(sending_url);
        console.log(sending_val);
        $.ajax({
            type        : "POST",
            url         : sending_url,
            contentType : "application/json",
            data        : sending_val,
            headers : {
               'accountID': accountID,
               'authToken': authToken,
            },
            success     : function(html){
               console.log("Result=>"+JSON.stringify(html));
               $(".loader").removeClass("visible").addClass("invisible")
               
               var result = html.responseMessage;
               //console.log("Result=>"+JSON.stringify(html));
               
               if(html.responseCode === 0){
                    cardUpdateMsg(html.responseDescription)
               }else{
                    cardUpdateMsg(html.responseDescription);
               }
               
            },timeout: ajaxTimeout,
            error: function(xhr, status, err){
               console.log(status,err,'Card details update');
            }
        })
    }
}


//Using Payment subscription
function cardUpdateMsg(msg){
    navigator.notification.alert(
        msg,                     // message
        cardUpdateDismissed,    // callback
        alertTitle,            // title
        'Ok'                  // buttonName
    );
}

// alert dialog dismissed
function cardUpdateDismissed() {
    // do something
    getCardInfo()
}
