var selected_opt = ""
var selected_val = ""
var sendingCount = 0
var loadCount    = 0

function getSalesDetailsInfo(opt, val, loadOpt, searchVal){
    
    if(loadOpt == "") $(".loader").removeClass("invisible").addClass("visible")
    
    //This one used get data based on selected country
    var statVal  = window.localStorage.getItem("selStateOpt")
    
    //Get All Product details
    var sending_url = api_baseurl+'widget'
    var sending_val = JSON.stringify({"widget_ids": "InventoryRestock","country": statVal});
    //console.log(sending_url);
    //console.log(sending_val);
    
    $.ajax({
        type        : "POST",
        url         : sending_url,
        data        : sending_val,
        contentType : "application/json",
        headers : {
           'accountID': accountID,
           'authToken': authToken,
           'storeID'  : storeID,
        },
        success : function(html){
            var result = html.responseMessage;
            //console.log("result=>"+JSON.stringify(html))
           
            if(loadOpt == "") $(".loader").removeClass("visible").addClass("invisible")
           
            if(html.responseCode == 0){
           
                var currentPage = result[1].meta.current_page
                loadCount       = currentPage + 1
           
                var sales_html = ""
                $.each(result, function (idx, obj){ 
                       
                    if(obj.widget_id == "InventoryRestock"){
                        if(obj.values.length > 0){
                            num = 0
                            $.each(obj.values, function (idx1, obj1){
                                   
                                num++;
                                
                                var str        = obj1.title
                                var header_str = obj1.title
                                   
                                //if(str.length > 30) str = str.substring(0,30)+"..."
                                if(header_str.length > 40) header_str = header_str.substring(0,40)+"..."
                                   
                                if(obj1.stock_label == "out of stock"){
                                   
                                   var status = '<span class="productBadge badge badge-danger">'+ obj1.stock_label +'</span>'
                                }else if(obj1.stock_label == "low stock"){
                                   
                                   var status = '<span class="productBadge badge badge-warning">'+ obj1.stock_label +'</span>'
                                }else{
                                   
                                   var status = ''
                                }
                                   
                                if(obj1.recommend_date != ""){
                                   var recDate = obj1.recommend_date;
                                }else{
                                   var recDate = "-";
                                }
                               
                                sales_html += '  <div class="card mb-1">\
                                                    <div class="card-body">\
                                                        <div class="float-left card_img_container">\
                                                            <img src="'+ obj1.image +'" onclick="window.open(\''+ obj1.url +'\',\'_system\')" class="mr-3"/>\
                                                        </div>\
                                                        <div class="pro_list_content">\
                                                            <p class="card-text mb-2 pro_title" onclick="window.open(\''+ obj1.url +'\',\'_system\')">'+ header_str +'</p>\
                                                            <a class="card-text d-inline-block mb-2" href="product_details.html?asin='+ obj1.id +'&page=lowInventory">\
                                                                <small class="text-muted mr-2">'+ obj1.id +'</small>\
                                                                <small class="text-muted">#'+ obj1.sku +'</small>\
                                                            </a>\
                                                            <div class="mb-2">\
                                                                <small class="mb-2 mr-2">In Stock - <b>'+ obj1.stock +'</b></small>\
                                                                <small class="small mb-2">Days of Supply - <b>'+ obj1.days_supply +'</b></small>\
                                                            </div>\
                                                            '+ status +'\
                                                            <a class="card-text pro_viewIcon" href="product_details.html?asin='+ obj1.id +'&page=lowInventory">\
                                                                View <i class="fa fa-eye" aria-hidden="true"></i>\
                                                            </a>\
                                                        </div>\
                                                    </div>\
                                                    <div class="card-footer split2_card">\
                                                        <div class="d-inline-block border-right">\
                                                            <p> Rec Qty </p>\
                                                            <p class="font-weight-bold">'+ obj1.recommend_qty +'</p>\
                                                        </div>\
                                                        <div class="d-inline-block border-right">\
                                                            <p>Rec Date</p>\
                                                            <p class="font-weight-bold">'+ recDate +'</p>\
                                                        </div>\
                                                    </div>\
                                                </div>'
                                   
                            })
                       
                            sendingCount = 0
                            $("#lowInventory_list").html(sales_html)

                        }else{
                       
                            var empty_html = '<p class="text-center" style="margin-top: 14em"> No data available! </p>'
                       
                            $("#totalRevenueUnit").hide()
                            $("#lowInventory_list").html(empty_html)
                        }
                    }
                })
            }else if(html.responseCode == 5){
                //Session expired
                sessionExpired(html.responseDescription)
            }
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           
           $(".loader").removeClass("invisible").addClass("visible")
           console.log(status,err,'Sale Details');
        }
    })
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
    
    var marketplace_id = window.localStorage.getItem("marketplace_id")
    
    if(authToken != "" && marketplace_id != ""){
        location.replace("dashboard.html")
    }
    
    return false;
}

function browseProduct(url){
    
    var options = "hideurlbar=yes,useWideViewPort=yes,enableViewportScale=yes,location=yes";
    //Browse Amazon product
    cordova.InAppBrowser.open(url, '_blank', options);
}

//Load more data using ajax
$(window).scroll(function() {
                 
    if($(window).scrollTop() == $(document).height() - $(window).height()) {
       
        if($(".noMoreData").length > 0 === false){
                 
            if(sendingCount != loadCount){
                 
                //Using Validate
                sendingCount = loadCount
                 
                //This one used get data based on selected country
                var statVal  = window.localStorage.getItem("selStateOpt")
                 
                //Get All Product details
                var sending_url = api_baseurl+'widget'
                var sending_val = JSON.stringify({"widget_ids": "InventoryRestock","country": statVal,"page": loadCount});
                //console.log("sending_url=>"+sending_url);
                //console.log("sending_val=>"+sending_val);
                 
                $.ajax({
                    type        : "POST",
                    url         : sending_url,
                    data        : sending_val,
                    contentType : "application/json",
                    headers : {
                        'accountID': accountID,
                        'authToken': authToken,
                        'storeID'  : storeID,
                    },
                    success : function(html){
                       var result = html.responseMessage;
                       //console.log("result=>"+JSON.stringify(result))
                       
                        if(html.responseCode == 0){
                            //Increment load data value
                            loadCount += 1
                            var sales_html = ""
                            $.each(result, function (idx, obj){
                                if(obj.widget_id == "InventoryRestock"){
                                    if(obj.values.length > 0){
                                        num = 0
                                        $.each(obj.values, function (idx1, obj1){

                                            num++;

                                            var str        = obj1.title
                                            var header_str = obj1.title

                                            //if(str.length > 30) str = str.substring(0,30)+"..."
                                            if(header_str.length > 40) header_str = header_str.substring(0,40)+"..."
                                               
                                            if(obj1.stock_label != ""){
                                               var status = '<span class="productBadge badge badge-danger">'+ obj1.stock_label +'</span>'
                                            }else{
                                               var status = ''
                                            }

                                            sales_html += ' <div class="card mb-1">\
                                                                <div class="card-body">\
                                                                    <div class="float-left card_img_container">\
                                                                        <img src="'+ obj1.image +'" onclick="window.open(\''+ obj1.url +'\',\'_system\')" class="mr-3"/>\
                                                                    </div>\
                                                                    <div class="pro_list_content">\
                                                                        <p class="card-text mb-2 pro_title" onclick="window.open(\''+ obj1.url +'\',\'_system\')">'+ header_str +'</p>\
                                                                        <a class="card-text d-inline-block mb-2" href="product_details.html?asin='+ obj1.id +'&page=lowInventory">\
                                                                            <small class="text-muted mr-2">'+ obj1.id +'</small>\
                                                                            <small class="text-muted">#'+ obj1.sku +'</small>\
                                                                        </a>\
                                                                        <div class="mb-2">\
                                                                            <small class="mb-2 mr-2">In Stock - <b>'+ obj1.stock +'</b></small>\
                                                                            <small class="small mb-2">Days of Supply - <b>'+ obj1.days_supply +'</b></small>\
                                                                        </div>\
                                                                        '+ status +'\
                                                                        <a class="card-text pro_viewIcon" href="product_details.html?asin='+ obj1.id +'&page=lowInventory">\
                                                                            View <i class="fa fa-eye" aria-hidden="true"></i>\
                                                                        </a>\
                                                                    </div>\
                                                                </div>\
                                                                <div class="card-footer split3_card">\
                                                                    <div class="d-inline-block border-right">\
                                                                        <p>In Stock</p>\
                                                                        <p class="font-weight-bold">'+ obj1.stock +'</p>\
                                                                    </div>\
                                                                    <div class="d-inline-block border-right">\
                                                                        <p>Recm Qty</p>\
                                                                        <p class="font-weight-bold">'+ obj1.recommend_qty +'</p>\
                                                                    </div>\
                                                                    <div class="d-inline-block">\
                                                                        <p>Days Supply</p>\
                                                                        <p class="font-weight-bold">'+ obj1.days_supply +'</p>\
                                                                    </div>\
                                                                </div>\
                                                            </div>'

                                        })

                                        $("#lowInventory_list").append(sales_html)

                                    }else{

                                        var empty_html = '  <div class="card mt-3 mb-3 noMoreData">\
                                                                <div class="card-body">\
                                                                    <p class="text-center mb-0"> No more data available! </p>\
                                                                </div>\
                                                            </div>'

                                        $("#lowInventory_list").append(empty_html)
                                    }
                                }
                            })
                        }else if(html.responseCode == 5){
                            //Session expired
                            sessionExpired(html.responseDescription)
                        }
                    
                    },timeout: ajaxTimeout,
                    error: function(xhr, status, err){
                       
                        $(".loader").removeClass("visible").addClass("invisible")
                        console.log(status,err,'Sale List');
                    }
                })
            }
        }
    }
});
