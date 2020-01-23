var selected_opt = ""
var selected_val = ""
var sendingCount = 0
var loadCount    = 0

function getSalesDetailsInfo(opt, val, loadOpt, searchVal){
    
    if(loadOpt == "") $(".loader").removeClass("invisible").addClass("visible")
    
    if(opt == "") opt = "sales"
    if(val == "") val = "day"
    
    //This one using button select based on dashboard page selected option
    selected_val = val
        
    if(selected_val == "custom"){
        var start_date = window.localStorage.getItem("start_date");
        var end_date   = window.localStorage.getItem("end_date");
    }else{
        var start_date = ""
        var end_date   = ""
    }
    
    //Get Target profit value
    var target_profit  = window.localStorage.getItem("target_profit")
        
    //This one used get data based on selected country
    var statVal  = window.localStorage.getItem("selStateOpt")
    
    //Get value search value
    if(searchVal == "") searchVal = $("#pro_search").val()
    
    //Get All Product details
    var sending_url = api_baseurl+'widget'
    if(selected_val == "custom"){
        var sending_val = JSON.stringify({"widget_ids": "BestSeller, OverallProfitWidget","type": opt,"interval": val,"start": start_date,"end": end_date,"country": statVal, "search_key": searchVal});
    }else{
        var sending_val = JSON.stringify({"widget_ids": "BestSeller, OverallProfitWidget","type": opt,"interval": val,"country": statVal, "search_key": searchVal});
    }
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
                       
                    if(obj.widget_id == "OverallProfitWidget"){
                       if($.isEmptyObject(obj.values) === false){
                            $.each(obj.values, function (idx1, obj1){
                                   if(idx1 == "Total Sales")  TotSale     = obj1
                                   if(idx1 == "Units Sold")   unitSold    = obj1
                            })
                                   
                            var totalRevnue = ' <div class="pro_sale_widget d-inline-block text-center">\
                                                    <span>Total Sale</span>\
                                                    <p class="h5 mb-0">'+ TotSale +'</p>\
                                                </div>\
                                                <div class="pro_unit_widget d-inline-block text-center">\
                                                    <span> UNITS </span>\
                                                    <p class="h5 mb-0">'+ unitSold +'</p>\
                                                </div>'
                       
                            $("#totalRevenueUnit").html(totalRevnue)
                       }
                    }
                       
                    if(obj.widget_id == "BestSeller"){
                        if(obj.values.length > 0){
                            num = 0
                            $.each(obj.values, function (idx1, obj1){
                                   
                                num++;
                                   
                                var str        = obj1.title
                                var header_str = obj1.title
                                   
                                //if(str.length > 30) str = str.substring(0,30)+"..."
                                if(header_str.length > 40) header_str = header_str.substring(0,40)+"..."
                               
                                if(opt == "sales" || opt == ""){
                                    var priceHtml = '<span>'+ obj1.currency_code +' '+ obj1.total_amt_sold +'</span>';
                                }else{
                                    var priceHtml = '<span>'+ obj1.total_units_sold +'</span>';
                                }
                                  
                                if(obj1.is_active === true){
                                   var proStatus = 'ACTIVE'
                                }else{
                                   var proStatus = 'INACTIVE'
                                }
                                   
//                                if(obj1.profit > target_profit){
//                                   var optImg = '<i class="fa fa-arrow-up proList_profit_positive" aria-hidden="true"></i>'
//                                }else{
//                                   var optImg = '<i class="fa fa-arrow-down proList_profit_negative" aria-hidden="true"></i>'
//                                }
                                   
                                sales_html += '  <div class="card mb-1">\
                                                    <div class="card-body">\
                                                        <div class="float-left card_img_container">\
                                                            <img src="'+ obj1.image_url +'" onclick="window.open(\''+ obj1.product_link +'\',\'_system\')" class="mr-3"/>\
                                                        </div>\
                                                        <div class="pro_list_content">\
                                                            <p class="card-text mb-2 pro_title" onclick="window.open(\''+ obj1.product_link +'\',\'_system\')">'+ header_str +'</p>\
                                                            <a class="card-text d-inline-block mb-2" href="product_details.html?asin='+ obj1.asin +'">\
                                                                <small class="text-muted mr-2">'+ obj1.asin +'</small>\
                                                                <small class="text-muted">#'+ obj1.sku +'</small>\
                                                            </a>\
                                                            <p class="small mb-2">Units in Stock - '+ obj1.stock +'</p>\
                                                            <span class="productBadge badge badge-primary">'+ proStatus +'</span>\
                                                            <a class="card-text pro_viewIcon" href="product_details.html?asin='+ obj1.asin +'">\
                                                                View <i class="fa fa-eye" aria-hidden="true"></i>\
                                                            </a>\
                                                        </div>\
                                                    </div>\
                                                    <div class="card-footer split3_card">\
                                                        <div class="d-inline-block border-right">\
                                                            <p>Sold Units</p>\
                                                            <p class="font-weight-bold">'+ obj1.total_units_sold +'</p>\
                                                        </div>\
                                                        <div class="d-inline-block border-right">\
                                                            <p>Total Sales</p>\
                                                            <p class="font-weight-bold">'+ obj1.currency_code + obj1.total_amt_sold +'</p>\
                                                        </div>\
                                                        <div class="d-inline-block" onclick="showPercentageVal(\''+ num +'\')">\
                                                            <p>Profit</p>\
                                                            <p class="font-weight-bold" id="profit_'+ num +'">'+ obj1.currency_code +' '+ obj1.profit +'</p>\
                                                            <p class="font-weight-bold" style="display: none" id="profitPercentage_'+ num +'">'+ obj1.profit_percent +'</p>\
                                                        </div>\
                                                    </div>\
                                                </div>'
                                   
                            })
                       
                            sendingCount = 0
                            $("#totalRevenueUnit").show()
                            $("#product_list").html(sales_html)

                        }else{
                       
                            var empty_html = '<p class="text-center" style="margin-top: 14em"> No data available! </p>'
                       
                            $("#totalRevenueUnit").hide()
                            $("#product_list").html(empty_html)
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

function showPercentageVal(num){
    $('#profit_'+num).toggle();
    $('#profitPercentage_'+num).toggle();
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

function selectOptBtn1(opt, val){
    selected_opt = val
    
    $(".top_btn_option .btn").removeClass("btn_active_1")
    $(opt).addClass("btn_active_1")
    
    window.localStorage.setItem("selected_opt", selected_opt);
    
    getSalesDetailsInfo(selected_opt, selected_val, "", "")
}

function selectOptBtn2(opt, val){
    selected_val = val
    
    $(".top_menu_button .btn").removeClass("btn_active_1")
    $(opt).addClass("btn_active_1")
    
    window.localStorage.setItem("selected_val", selected_val);
    
    getSalesDetailsInfo(selected_opt, selected_val, "", "")
}

//This function used Advance option
function select_optBtn(sel){
    selected_val = sel.value
    
    $(".top_menu_button .btn").removeClass("btn_active_1")
    $(sel).addClass("btn_active_1")
    
    if(selected_val == "custom"){
        $("#custom_date_modalbox").trigger("click")
    }else{
        window.localStorage.setItem("selected_val", selected_val);
    
        getSalesDetailsInfo(selected_opt, selected_val, "", "")
    }
}

function validateDate(){
    
    var start_date = $("#start_date").val()
    var end_date   = $("#end_date").val()
    
    if(start_date !== "" && end_date !== ""){
        
        $(".close_modal_btn").show();
    }
}

function selectedCustomDate(){
    
    var start_date = $("#start_date").val()
    var end_date   = $("#end_date").val()
    
    window.localStorage.setItem("start_date", start_date);
    window.localStorage.setItem("end_date", end_date);

    selected_val = "custom"
    window.localStorage.setItem("selected_val", selected_val);
    getSalesDetailsInfo(selected_opt, selected_val, "", "")
    
}

function moveProductDetails(id){
    location.replace("product_details.html?id="+id);
}

//Pull To Refresh Option
var ptr = PullToRefresh.init({
    mainElement: '#totalRevenueUnit',
    onRefresh: function(){
        
        var searchVal = $("#pro_search").val()
        // can be used to load more content
        getSalesDetailsInfo(selected_opt, selected_val, "pullToRef", searchVal)
    }
});

function browseProduct(url){
    
    var options = "hideurlbar=yes,useWideViewPort=yes,enableViewportScale=yes,location=yes";
    //Browse Amazon product
    cordova.InAppBrowser.open(url, '_blank', options);
}

function enableSearchOpt(){
    $(".pro_search").show();
    $(".top_menu_button").css({"top": "4.2em"})
    $(".menu_container").css({"height": "13.8em"})
    $(".totalRevenueUnit").css({"margin-top": "13.8em"})
}

//Get search data
$("#pro_search").keyup(function(){
    var searchVal      = this.value
    var searchValCount = searchVal.length
                       
    getSalesDetailsInfo(selected_opt, selected_val, "", searchVal)
    
});


//Load more data using ajax
$(window).scroll(function() {
                 
    if($(window).scrollTop() == $(document).height() - $(window).height()) {
       
        if($(".noMoreData").length > 0 === false){
                 
            if(sendingCount != loadCount){
                 
                //Using Validate
                sendingCount = loadCount
                 
                if(selected_opt == "") selected_opt = "sales"
                if(selected_val == "") selected_val = "day"
                 
                //This one used get data based on selected country
                var statVal  = window.localStorage.getItem("selStateOpt")
                 
                //Search data also included
                var searchVal = $("#pro_search").val()
                 
                //Load more data option
                //var loadMore = '/page/'+ loadCount
                 
                //Get All Product details
                var sending_url = api_baseurl+'widget'
                var sending_val = JSON.stringify({"widget_ids": "BestSeller","type": selected_opt,"interval": selected_val,"country": statVal, "search_key": searchVal, "page": loadCount});
                //console.log("####=>"+sending_url);
                 
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
                                if(obj.widget_id == "BestSeller"){
                                    if(obj.values.length > 0){
                                        num = 0
                                        $.each(obj.values, function (idx1, obj1){

                                            num++;

                                            var str        = obj1.title
                                            var header_str = obj1.title

                                            //if(str.length > 30) str = str.substring(0,30)+"..."
                                            if(header_str.length > 40) header_str = header_str.substring(0,40)+"..."

                                            if(selected_opt == "sales" || selected_opt == ""){
                                               var priceHtml = '<span>'+ obj1.currency_code +' '+ obj1.total_amt_sold +'</span>';
                                            }else{
                                               var priceHtml = '<span>'+ obj1.total_units_sold +'</span>';
                                            }

                                            if(obj1.is_active === true){
                                               var proStatus = 'ACTIVE'
                                            }else{
                                               var proStatus = 'INACTIVE'
                                            }

                                            sales_html += ' <div class="card mb-1">\
                                                                <div class="card-body p-2">\
                                                                    <div class="float-left card_img_container">\
                                                                        <img src="'+ obj1.image_url +'" onclick="browseProduct(\''+ obj1.product_link +'\')" class="mr-3"/>\
                                                                    </div>\
                                                                    <div class="pro_list_content">\
                                                                        <p class="card-text mb-2 pro_title" onclick="browseProduct(\''+ obj1.product_link +'\')">'+ header_str +'</p>\
                                                                        <a class="card-text d-inline-block mb-2" href="product_details.html?asin='+ obj1.asin +'">\
                                                                            <small class="text-muted mr-2">'+ obj1.asin +'</small>\
                                                                            <small class="mr-3">Units in Stock - '+ obj1.stock +'</small>\
                                                                        </a>\
                                                                        <span class="productBadge badge badge-primary">'+ proStatus +'</span>\
                                                                        <a class="card-text pro_viewIcon" href="product_details.html?asin='+ obj1.asin +'">\
                                                                            View <i class="fa fa-eye" aria-hidden="true"></i>\
                                                                        </a>\
                                                                    </div>\
                                                                </div>\
                                                                <div class="card-footer split3_card">\
                                                                    <div class="d-inline-block border-right">\
                                                                        <p>Sold Units</p>\
                                                                        <p class="font-weight-bold">'+ obj1.total_units_sold +'</p>\
                                                                    </div>\
                                                                    <div class="d-inline-block border-right">\
                                                                        <p>Total Sales</p>\
                                                                        <p class="font-weight-bold">'+ obj1.currency_code + obj1.total_amt_sold +'</p>\
                                                                    </div>\
                                                                    <div class="d-inline-block" onclick="showPercentageVal(\''+ num +'\')">\
                                                                        <p>Profit</p>\
                                                                        <p class="font-weight-bold" id="profit_'+ num +'">'+ obj1.currency_code +' '+ obj1.profit +'</p>\
                                                                        <p class="font-weight-bold" style="display: none" id="profitPercentage_'+ num +'">'+ obj1.profit_percent +'</p>\
                                                                    </div>\
                                                                </div>\
                                                            </div>'

                                        })

                                        $("#product_list").append(sales_html)

                                    }else{

                                        var empty_html = '  <div class="card mt-3 mb-3 noMoreData">\
                                                                <div class="card-body">\
                                                                    <p class="text-center mb-0"> No more data available! </p>\
                                                                </div>\
                                                            </div>'

                                        $("#product_list").append(empty_html)
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


// When the user scrolls down 20px from the top of the document, show the button
/*window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.getElementById("button_click_top").style.display = "block";
    } else {
        document.getElementById("button_click_top").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}*/
