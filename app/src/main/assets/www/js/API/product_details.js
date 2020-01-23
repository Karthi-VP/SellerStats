var selected_opt = ""
var selected_val = ""

var asinID;
var pageID;

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
asinID = qs["asin"];
pageID = qs["page"];

function getSalesDetailsInfo(opt, val, loadOpt){
    
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
    if(statVal == "" || statVal == null){
        var stateURL = ''
    }else{
        var stateURL = '/country/'+statVal
    }
        
    //Get All Product details
    var sending_url = api_baseurl+'widget'
    if(selected_val == "custom"){
        var sending_val = JSON.stringify({"widget_ids": "ProductSaleHistory","type": opt,"interval": val,"start": start_date,"end": end_date,"country": statVal, "asin": asinID});
    }else{
        var sending_val = JSON.stringify({"widget_ids": "ProductSaleHistory","type": opt,"interval": val,"country": statVal, "asin": asinID});
    }
    console.log(sending_url);
    console.log(sending_val);
    
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
            console.log("result=>"+JSON.stringify(html))
           
            if(loadOpt == "") $(".loader").removeClass("visible").addClass("invisible")
           
            if(html.responseCode == 0){
           
                var sales_html = ""
                $.each(result, function (idx, obj){
                       
                    if(obj.widget_id == "ProductSaleHistory"){
                       
                        var str        = obj.product.title
                        var header_str = obj.product.title

                        //if(str.length > 30) str = str.substring(0,30)+"..."
                        if(header_str.length > 80) header_str = header_str.substring(0,80)+"..."
                       
                        if(opt == "sales" || opt == ""){
                            var priceHtml = '<span>'+ obj.product.currency_code +' '+ obj.product.total_amt_sold +'</span>';
                        }else{
                            var priceHtml = '<span>'+ obj.product.total_units_sold +'</span>';
                        }
                       
                        if(obj.product.is_active === true){
                           var proStatus = 'ACTIVE'
                        }else{
                           var proStatus = 'INACTIVE'
                        }
                       
//                        if(obj.product.profit > target_profit){
//                            var optImg = '<i class="fa fa-arrow-up proList_profit_positive" aria-hidden="true"></i>'
//                        }else{
//                            var optImg = '<i class="fa fa-arrow-down proList_profit_negative" aria-hidden="true"></i>'
//                        }
                       
                        if(pageID == "lowInventory"){
                            var days_supply = '<small class="mr-3"> Days of Supply - '+ obj.product.days_supply+'</small>'
                        }else{
                            var days_supply = ''
                        }
                       
                        if(pageID == "lowInventory"){
                            if(obj.product.stock_label !== ""){
                                var statusBadge = '<span class="productBadge badge badge-danger ml-2">'+ obj.product.stock_label +'</span>'
                            }else{
                                var statusBadge = ''
                            }
                        }else{
                            var statusBadge = ''
                        }
                       
                        //Currency code
                        var currency_code = obj.product.currency_code
                       
                       sales_html += '  <div class="card mb-1">\
                                            <div class="card-body">\
                                                <div class="float-left card_img_container">\
                                                    <img src="'+ obj.product.image_url +'" onclick="window.open(\''+ obj.product.product_link +'\',\'_system\')" class="mr-3"/>\
                                                </div>\
                                                <div class="pro_list_content">\
                                                    <p class="card-text mb-2 pro_title" onclick="window.open(\''+ obj.product.product_link +'\',\'_system\')">'+ header_str +'</p>\
                                                    <p class="card-text d-inline-block mb-2">\
                                                        <small class="text-muted mr-2">'+ obj.product.asin +'</small>\
                                                        <small class="text-muted">#'+ obj.product.sku +'</small>\
                                                    </p>\
                                                    <p class="mb-2">\
                                                        <small class="mr-3"> In Stock - '+ obj.product.stock+'</small>\
                                                        '+ days_supply +'\
                                                    </p>\
                                                    '+ statusBadge +'\
                                                    <span class="productBadge badge badge-primary">'+ proStatus +'</span>\
                                                </div>\
                                            </div>\
                                            <div class="card-footer split3_card">\
                                                <div class="d-inline-block border-right">\
                                                    <p>List Price</p>\
                                                    <p class="font-weight-bold">'+ currency_code + obj.product.listprice +'</p>\
                                                </div>\
                                                <div class="d-inline-block border-right">\
                                                    <p>Product Cost</p>\
                                                    <p class="font-weight-bold">'+ currency_code + obj.product.cost +'</p>\
                                                </div>\
                                                <div class="d-inline-block">\
                                                    <p>Ad Cost</p>\
                                                    <p class="font-weight-bold">'+ currency_code + obj.product.adv_cost +'</p>\
                                                </div>\
                                            </div>\
                                            <div class="card-footer split3_card">\
                                                <div class="d-inline-block border-right">\
                                                    <p>FBA Ship Cost</p>\
                                                    <p class="font-weight-bold">'+ currency_code + obj.product.ship_cost +'</p>\
                                                </div>\
                                                <div class="d-inline-block border-right">\
                                                    <p>Referral Fee</p>\
                                                    <p class="font-weight-bold">'+ currency_code + obj.product.referral_fee +'</p>\
                                                </div>\
                                                <div class="d-inline-block">\
                                                    <p>FBA Charge</p>\
                                                    <p class="font-weight-bold">'+ currency_code + obj.product.fba_fee +'</p>\
                                                </div>\
                                            </div>\
                                            <div class="card-footer split3_card">\
                                                <div class="d-inline-block border-right">\
                                                    <p>Sold Units</p>\
                                                    <p class="font-weight-bold">'+ obj.product.total_units_sold +'</p>\
                                                </div>\
                                                <div class="d-inline-block border-right">\
                                                    <p>Total Sales</p>\
                                                    <p class="font-weight-bold">'+ currency_code + obj.product.total_amt_sold +'</p>\
                                                </div>\
                                                <div class="d-inline-block">\
                                                    <p>Profit</p>\
                                                    <p class="font-weight-bold" id="profit">'+ currency_code + obj.product.profit +'</p>\
                                                </div>\
                                            </div>\
                                            <div class="card-footer split3_card">\
                                               <div class="d-inline-block border-right">\
                                                    <p>Profitability</p>\
                                                    <p class="font-weight-bold">'+ obj.product.profit_percent +'</p>\
                                               </div>\
                                                <div class="d-inline-block border-right">\
                                                    <p>Avg Sales Price</p>\
                                                    <p class="font-weight-bold">'+ currency_code + obj.product.asp +'</p>\
                                                </div>\
                                            </div>\
                                        </div>'
                       
                        //Load column chart data
                        var ChartValues    = new Object();
                        ChartValues.labels = [];
                        var chart_data     = [];
                        var profit         = [];
                        var inventory_data = [];
                       
                        $.each(obj.values, function (idx, ele) {
                            ChartValues.labels.push(idx);
                            chart_data.push(ele);
                        });

                        $.each(obj.profit_values, function (idx, ele) {
                            profit.push(ele);
                        });
                       
                        $.each(obj.inventory_values, function (idx, ele) {
                            inventory_data.push(ele);
                        });

                        ChartValues.data = [];
                        if (obj.type === 'sales') {
                            ChartValues.data.push({ type: 'column', name: 'Cost', data: chart_data, stack: 'sale' });
                            ChartValues.data.push({ type: 'column', name: 'Profit', data: profit, stack: 'sale' });
                            ChartValues.data.push({ type: 'spline', yAxis: 1, name: 'Inventory', data: inventory_data, stack: 'inventory' });
                        }else {
                            ChartValues.data.push({ type: 'column', name: 'Units', data: chart_data, stack: 'sale' });
                            ChartValues.data.push({ type: 'spline', name: 'Inventory', data: inventory_data, stack: 'inventory' });
                        }
                       
                        chartData(ChartValues, obj.widget_name, obj.type, obj.interval, currency_code)
                       
                        //Load line chart data
                        var lineChartValues    = new Object();
                        lineChartValues.labels = [];
                        var ranking_data       = [];
                       
                        $.each(obj.rank_values, function (idx, ele) {
                            lineChartValues.labels.push(idx)
                            ranking_data.push(ele);
                        });
                       
                        lineChartValues.data = [];
                        lineChartValues.data.push({ name: 'Sales Ranking', data: ranking_data });
                       
                        inventoryChartData(lineChartValues, obj.widget_name, obj.type, obj.interval, currency_code)
                       
                        $("#product_list").html(sales_html)

                    }
                })
           
                //Get advertisement data
                getAdvertisementGraph(sending_val);
           
            }else if(html.responseCode == 5){
                //Session expired
                sessionExpired(html.responseDescription)
            }
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           
           $(".loader").removeClass("invisible").addClass("visible")
           console.log(status,err,'Get Sale Details');
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

function selectOptBtn1(opt, val){
    selected_opt = val
    
    $(".top_btn_option .btn").removeClass("btn_active_1")
    $(opt).addClass("btn_active_1")
    
    window.localStorage.setItem("selected_opt", selected_opt);
    
    getSalesDetailsInfo(selected_opt, selected_val, "")
}

function selectOptBtn2(opt, val){
    selected_val = val
    
    $(".top_menu_button .btn").removeClass("btn_active_1")
    $(opt).addClass("btn_active_1")
    
    window.localStorage.setItem("selected_val", selected_val);
    
    getSalesDetailsInfo(selected_opt, selected_val, "")
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

//Pull To Refresh Option
var ptr = PullToRefresh.init({
    mainElement: '#product_list',
    onRefresh: function(){
        // can be used to load more content
        getSalesDetailsInfo(selected_opt, selected_val, "pullToRef")
    }
});

function browseProduct(url){
    
    var options = "hideurlbar=yes,useWideViewPort=yes,enableViewportScale=yes,location=yes";
    //Browse Amazon product
    cordova.InAppBrowser.open(url, '_blank', options);
}

function chartData(ChartValues, title, selOpt, selVal, currOpt){
    
    var ydata = [{
                    labels: {
                        format: '{value}',
                        style: {
                            color: '#0f8edd'
                        }
                    },
                    title: {
                        text: 'Currency (' + currOpt + ')',
                        style: {
                            color: '#0f8edd'
                        }
                    }
                }, {
                    gridLineWidth: 0,
                    title: {
                        text: 'Inventory (units)',
                        style: {
                            color: '#ff9966'
                        }
                    },
                    labels: {
                        format: '{value}',
                        style: {
                            color: '#ff9966'
                        }
                 },
                 opposite: true
            }];
    
    if (selOpt === 'units') {
        ydata = [{
                     labels: {
                        format: '{value}',
                        style: {
                            color: '#0f8edd'
                        }
                     },
                     title: {
                        text: 'Total Units',
                        style: {
                            color: '#0f8edd'
                        }
                     }
                 }];
    }
    
    Highcharts.chart('loadChart', {
        colors: ['#63a8e9','#ff9966'],
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: title,
            align: 'left',
            style: {'fontSize': '16px'},
            margin: 50
        },
        xAxis: {
            categories: ChartValues.labels,
            crosshair: true
        },
        yAxis: ydata,
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                stacking: 'normal'
            }
        },
        tooltip: {
            formatter: function () {
                var time = 'Date';
                if (selVal === "day" || selVal === "yesterday") {
                    time = 'Time';
                }
                var s = '<b>' + time + ' : ' + this.x + '</b>';
                var revenue = 0;
                $.each(this.points, function () {
                    if (this.series.name === 'Cost') {
                       s += '<br/>' + this.series.name + ' : ' + currOpt + this.y;
                       revenue += this.y;
                    }
                    else if (this.series.name === 'Units'){
                       s += '<br/>' + this.series.name + ' : ' + this.y + ' units';
                    }
                    else if (this.series.name === 'Profit'){
                       s += '<br/>' + this.series.name + ' : ' + currOpt + this.y;
                       revenue += this.y;
                       s += '<br/>Revenue : ' + currOpt + revenue;
                    }
                    else if (this.series.name === 'Inventory') {
                       s += '<br/>' + this.series.name + ' : ' + this.y;
                    }
                });
                return s;
            },
            shared: true
        },
        series: ChartValues.data,
        lang: {
            noData: "No data available"
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        },
        navigation: {
            buttonOptions: {
                enabled: false
            }
        },
        credits: {
            enabled: false
        }
    });
}

//Inventory chart load
function inventoryChartData(lineChart_value, title, selOpt, selVal, currOpt){
    
    title = title.replace("sales details", "sales ranking");
    
    Highcharts.chart('lineChart', {
        colors: ['#63a8e9','#ff9966'],
        chart: {
            type: 'line'
        },
        title: {
            text: title,
            align: 'left',
            style: {'fontSize': '16px'},
            margin: 50
        },
        xAxis: {
            categories: lineChart_value.labels
        },
        yAxis: {
            min: 0,
            title: false
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: lineChart_value.data,
        lang: {
            noData: "No data available"
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        },
        navigation: {
            buttonOptions: {
                enabled: false
            }
        },
        credits: {
            enabled: false
        }
    });
}

//Get advertisement graph data
function getAdvertisementGraph(sendVal){
    
    //logout logged in users
    var sending_url = api_baseurl+'widget/ad'
    console.log(sending_url);
    
    $.ajax({
        type        : "POST",
        url         : sending_url,
        data        : sendVal,
        contentType : "application/json",
        headers : {
           'accountID': accountID,
           'authToken': authToken,
        },
        success : function(html){
            var result = html.responseMessage;
            //console.log("result&&&=>"+JSON.stringify(result))
           
            var ChartValues    = new Object();
            ChartValues.labels = [];
           
            var cost_value = []
            var sale_value = []
           
            $.each(result[0].values, function (idx, ele) {
                ChartValues.labels.push(idx);
                cost_value.push(ele);
            });
           
            $.each(result[0].profit_values, function (idx, ele) {
                sale_value.push(ele);
            });
           
           ChartValues.data = [];
           ChartValues.data.push({ name: 'Ad Cost', data: cost_value });
           ChartValues.data.push({ name: 'Sale via ad', data: sale_value });
           
           adChartData(ChartValues, result[0].widget_name)
           
           //localStorage.clear();
           //location.replace("sign_in.html")
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'Logout Store Session');
        }
    })
}

//Advertisement chart load
function adChartData(ChartValues, title){
    
    Highcharts.chart('adChart', {
        colors: ['#0f8edd', '#ff9966'],
        chart: {
            type: 'line'
        },
        title: {
            text: title,
            align: 'left',
            style: {'fontSize': '16px'},
            margin: 50
        },
        xAxis: {
            categories: ChartValues.labels
        },
        yAxis: {
            min: 0,
            title: false
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: ChartValues.data,
        lang: {
            noData: "No data available"
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        },
        navigation: {
            buttonOptions: {
                enabled: false
            }
        },
        credits: {
            enabled: false
        }
    });
}
