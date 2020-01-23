function user_login(rgData){
    
    var formdata = $("#login_form").serializeArray();
    
    var email_id = $("#email_id").val();
    var password = $("#user_password").val();

    if(email_id == ""){
        showAlert("Please enter email id");
        return false;
    }else if(password == ""){
        showAlert("Please enter password");
        return false;
    }
    
    if(rgData.length > 0){
        $.merge( formdata, rgData )
    }
    
    var datavalue = {};
    $(formdata).each(function(index, obj){
        datavalue[obj.name] = obj.value;
    });
    
    //Change Processign status
    $(".sign_in_btn").text("Processing...")

    //Authenticate user login
    var sending_url = api_baseurl+'auth/validate'
    var sending_val = JSON.stringify(datavalue)
    console.log(sending_val);
    $.ajax({
        type        : "POST",
        url         : sending_url,
        contentType : "application/json",
        data        : sending_val,
        success     : function(html){

            var result = html.responseMessage;
            console.log("Result=>"+JSON.stringify(html));
            //Change Processign status
            $(".sign_in_btn").text("SIGN IN")
           
            if(html.responseCode === 0 || html.responseCode === 7){
           
                if(result.account_status == "Unsubscribed" || result.account_status == "Expired"){
                    showAlert(html.responseDescription)
                    return false;
                }
           
                if(result.account_status === "Created"){
                    showAlert(html.responseDescription)
                    return false;
                }

                window.localStorage.setItem("user_id", result.user_id);
                window.localStorage.setItem("auth_token", result.auth_token);
                window.localStorage.setItem("account_id", result.account_id);
                window.localStorage.setItem("user_email", result.email);
                //window.localStorage.setItem("user_role", result.role);
                window.localStorage.setItem("account_status", result.account_status);
                window.localStorage.setItem("loginResponse", JSON.stringify(result));
           
                window.localStorage.setItem("store_limit", html.store_limit);
                window.localStorage.setItem("account_pin", result.account_pin);
           
                window.localStorage.setItem("account_type", result.account_type);
                window.localStorage.setItem("subscription", result.subscription);
                window.localStorage.setItem("payment_status", result.payment_status);
                window.localStorage.setItem("card_info", result.have_card_info);
           
                window.localStorage.setItem("accound_valid_end", result.accound_valid_end);
           
                if(result.account_status == "Active" || result.account_status == "Activated"){
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
           
                    location.replace("dashboard.html")
           
                }else{
           
                    location.replace("add_store.html?option=newStore")
                }

            }else{
                showAlert(html.responseDescription);
            }

        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           //Change Processign status
           $(".sign_in_btn").text("Sign in")
           console.log(status,err,'Customer Login');
        }
    });
}
