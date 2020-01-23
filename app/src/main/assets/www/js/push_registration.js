var regToken = "";
var pushNotification;



function getRegisterToken(){
    
    var push = PushNotification.init({
                    "android": {
                        "senderID": '30489627762'
                    },
                    "ios": {
                        "alert": true,
                        "badge": true,
                        "sound": true
                    }
                });
    
    push.on('registration', (data) => {
        if (data.registrationId == null || data.registrationId == "") {
            console.log("null token");
            setTimeout(getTheToken, 1500);
        }else {
            regToken = data.registrationId;
            console.log("I got the token: " + data.registrationId);
        }
        console.log("reg id=>"+data.registrationId);
        console.log("reg type=>"+data.registrationType);
    });
    
    push.on('error', e => {
        console.log(e.message);
    });
}


push.on('notification', data => {
    console.log(data.message);
    console.log(data.title);
    console.log(data.count);
    console.log(data.sound);
    console.log(data.image);
    console.log(data.additionalData);
});



//Using 
function send_registerToken(){
	var deviceUUID      = device.uuid;
	var devicePlatform  = device.platform;
	var datavalue       = [{"name":"device_id","value":deviceUUID},{"name":"device_type","value":devicePlatform},{"name":"registration_id","value":regToken}];
	user_login(datavalue);
}

//Using Finger Print Authentication
function getFCMRegistration(){
    
    var deviceUUID      = device.uuid;
    var devicePlatform  = device.platform;
    var datavalue       = [{"name":"deviceID","value":deviceUUID},{"name":"deviceType","value":devicePlatform},{"name":"registrationID","value":regToken}];
    
    validateLoginReg(datavalue);
}
