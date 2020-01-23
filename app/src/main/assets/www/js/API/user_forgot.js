function forgotPassword(){
    
    var email_id = $("#email_address").val();
    
    if(email_id == ""){
        showAlert("Please enter email id");
        return false;
    }

    //Authenticate user login
    var sending_url = api_baseurl+'auth/forgotpassword/'+ email_id
    //console.log(sending_url);
    
    $.ajax({
        type        : "PUT",
        url         : sending_url,
        success     : function(html){

            //var result = html.responseMessage;
            //console.log("Result=>"+JSON.stringify(html));
           
            if(html.responseCode == 0){
                forgotAlert(html.responseDescription)
            }else{
                showAlert(html.responseDescription)
            }

        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'User Forgot Password');
        }
    });
}

//Show alert notification
function forgotAlert(msg) {
    navigator.notification.alert(
        msg,                     // message
        forgotAlertDismissed,   // callback
        alertTitle,            // title
        'Ok'                  // buttonName
    );
}

// alert dialog dismissed
function forgotAlertDismissed() {
    
    location.replace("index.html");
}
