function user_register(){
    
    var first_name   = $("#first_name").val();
    var last_name    = $("#last_name").val();
    var email_id     = $("#email_id").val();
    var password     = $("#user_password").val();
    var con_password = $("#conform_password").val();
    

    if(email_id == ""){
        showAlert("Please enter email id")
        return false;
    }else if(password == ""){
        showAlert("Please enter password")
        return false;
    }else if(con_password == ""){
        showAlert("Please re-enter password")
        return false;
    }else if(con_password != "" && (password != con_password)){        
        showAlert("Password does not match the confirm password")
        return false;
    }
    //Change processing status
    $(".user_reg_btn").text("Processing...")
    
    var deviceUUID      = device.uuid;
    var devicePlatform  = device.platform;

    //Authenticate user login
    var sending_url = api_baseurl+'auth/register'
    var sending_val = JSON.stringify({"first_name": first_name, "last_name": last_name, "email": email_id, "password": password, "device_type": devicePlatform})
    //console.log(sending_val);
    $.ajax({
        type        : "POST",
        url         : sending_url,
        contentType : "application/json",
        data        : sending_val,
        success     : function(html){

            var result = html.responseMessage;
            //console.log("Result=>"+JSON.stringify(html));
           
            //Change processing status
            $(".user_reg_btn").text("Register")
           
            if(html.responseCode === 0){
           
                registerAlert(html.responseDescription)
           
            }else{
                showAlert(html.responseDescription);
            }

        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           //Change processing status
           $(".user_reg_btn").text("Register")
           console.log(status,err,'Customer Register');
        }
    })
}

//Show alert notification
function registerAlert(msg) {
    navigator.notification.alert(
        msg,                     // message
        regAlertDismissed,         // callback
        alertTitle,            // title
        'Ok'                  // buttonName
    );
}

// alert dialog dismissed
function regAlertDismissed() {
    location.replace("sign_in.html");
}
