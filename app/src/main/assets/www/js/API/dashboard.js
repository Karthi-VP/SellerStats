var selected_val

function getDashboardWidget(val, opt){
    
    if(opt == "") $(".loader").removeClass("invisible").addClass("visible")
    
    if(val == ""){
        selected_val = "day"
    }else{
        selected_val = val
    }
    
    if(selected_val == "custom"){
        var start_date = window.localStorage.getItem("start_date");
        var end_date   = window.localStorage.getItem("end_date");
    }else{
        var start_date = ""
        var end_date   = ""
    }
    
    //Get Target profit value
    var target_profit  = window.localStorage.getItem("target_profit")
    
    //Get dashboard data based on selected country
    var statVal  = window.localStorage.getItem("selStateOpt")
    
    //Authenticate user login
    var sending_url = api_baseurl+'widget'
    if(selected_val == "custom"){
        var sending_val = JSON.stringify({"widget_ids": "OverallProfitWidget, TodayBestSeller, InventoryRestockTop3","interval": selected_val,"start": start_date,"end": end_date,"country": statVal});
    }else{
        var sending_val = JSON.stringify({"widget_ids": "OverallProfitWidget, TodayBestSeller, InventoryRestockTop3","interval": selected_val,"country": statVal});
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
           console.log("result=>##"+JSON.stringify(html))
           
            if(opt == "") $(".loader").removeClass("visible").addClass("invisible")
           
            if(html.responseCode == 0 || html.responseCode == 7){
                var sales_html     = ""
                var topSeller_html = ""
           
                $.each(result, function (idx, obj){
                    
                    if(obj.widget_id == "Countries"){
                        if($.isEmptyObject(obj.values) === false){
                       
                            var count    = 0
                            var stateOpt = '<select class="state_selOpt text-uppercase" onchange="getSelStateOpt(this)">'
                       
                            $.each(obj.values, function (index, val){
                                count++;
                                if(statVal == "" || statVal == null){
                                    if(count == 1){
                                        window.localStorage.setItem("selStateOpt", index);
                                    }
                                }else{
                                   if(statVal == index){
                                        var selOpt = "selected"
                                   }else{
                                        var selOpt = ""
                                   }
                                }
                                   
                                stateOpt += '<option value="'+ index +'" '+ selOpt +'>'+ val +'</option>'
                            })
                                stateOpt += '</select>'
                                   
                            $("#selStateOpt").html(stateOpt)
                        }
                    }
                       
                    if(obj.widget_id == "OverallProfitWidget"){
                        if($.isEmptyObject(obj.values) === false){
                       
                            var TotSale   = ""
                            var unitSold  = ""
                            var totProfit = ""
                            var profitPer = ""
                            var aurVal    = ""
                            var acos      = ""
                       
                            var actList        = ""
                            var actListTitle   = ""
                            var inactive       = ""
                            var inactiveTitle  = ""
                       
                            var suppressedList      = ""
                            var suppressedListTitle = ""
                            var cancelledList       = ""
                            var cancelledListTitle  = ""
                       
                            $.each(obj.values, function (idx1, obj1){
                                   
                                if(idx1 == "Total Sales")    TotSale    = obj1
                                if(idx1 == "Units Sold")     unitSold   = obj1
                                if(idx1 == "Total Profit")   totProfit  = obj1
                                if(idx1 == "Profit Percent") profitPer  = obj1
                                if(idx1 == "AUR")            aurVal     = obj1
                                if(idx1 == "ACOS")           acos       = obj1
                                
                                if(idx1 == "Active Listing"){
                                   actList      = obj1
                                   actListTitle = idx1
                                }
                                   
                                if(idx1 == "InActive Listing"){
                                   inactive      = obj1
                                   inactiveTitle = idx1
                                }
                                   
                                if(idx1 == "Suppressed Listing"){
                                   suppressedList      = obj1
                                   suppressedListTitle = idx1
                                }
                                   
                                if(idx1 == "Cancelled Listing"){
                                   cancelledList      = obj1
                                   cancelledListTitle = idx1
                                }
                            })
                       
//                            var pro_data = totProfit.split(' ');
//                            if(pro_data[1] > target_profit){
//                                var optImg = '<i class="fa fa-arrow-up profit_positive" aria-hidden="true"></i>'
//                            }else{
//                                var optImg = '<i class="fa fa-arrow-down profit_negative" aria-hidden="true"></i>'
//                            }
                       
                            //Using show data product status
                            var proStatus = '  <div class="col-3 pro_box_p">\
                                                    <div class="card card-inverse card-success">\
                                                        <div class="box pro_bg_active text-center pro_status">\
                                                            <h2 class="font-light text-white">'+ actList +'</h1>\
                                                            <h6 class="text-white pro_box_title">'+ actListTitle +'</h6>\
                                                        </div>\
                                                    </div>\
                                               </div>\
                                                <div class="col-3 pro_box_p">\
                                                    <div class="card card-inverse card-info">\
                                                        <div class="box bg-warning text-center pro_status">\
                                                            <h2 class="font-light text-white">'+ inactive +'</h1>\
                                                            <h6 class="text-white pro_box_title">'+ inactiveTitle +'</h6>\
                                                        </div>\
                                                    </div>\
                                                </div>\
                                                <div class="col-3 pro_box_p">\
                                                    <div class="card card-primary card-inverse">\
                                                        <div class="box pro_bg_suppr text-center pro_status">\
                                                            <h2 class="font-light text-white">'+ suppressedList +'</h1>\
                                                            <h6 class="text-white pro_box_title">'+ suppressedListTitle +'</h6>\
                                                        </div>\
                                                    </div>\
                                                </div>\
                                                <div class="col-3 pro_box_p">\
                                                    <div class="card card-inverse card-success">\
                                                        <div class="box pro_bg_cancel text-center pro_status">\
                                                            <h2 class="font-light text-white">'+ cancelledList +'</h1>\
                                                            <h6 class="text-white pro_box_title">'+ cancelledListTitle +'</h6>\
                                                        </div>\
                                                    </div>\
                                                </div>'
                       
                            $(".dataStatusList").html(proStatus)
                       
                            //Using show data product status END
                       
                            if(unitSold.length > 4){
                                var class1 = 'class="h6"'
                            }else{
                                var class1 = 'class="h5"'
                            }
                       
                            if(totProfit.length > 4){
                                var class2 = 'class="h6"'
                            }else{
                                var class2 = 'class="h5"'
                            }
                       
                            sales_html  ='  <div class="sales_card_list d-inline-block" onclick="showAURVal()">\
                                                <span id="unitsLable">UNITS</span>\
                                                <span id="aurLable" style="display: none">AUR</span>\
                                                <p id="unitsValue" '+ class1 +'>'+ unitSold +'</p>\
                                                <p '+ class1 +' style="display: none" id="aurValue">'+ aurVal +'</p>\
                                            </div>\
                                            <div class="sales_card_list d-inline-block" onclick="showPercentageVal()">\
                                                <span>PROFIT</span>\
                                                <p '+ class2 +' id="profit">'+ totProfit +'</p>\
                                                <p '+ class2 +' style="display: none" id="profitPercentage">'+ profitPer +'</p>\
                                            </div>\
                                            <div class="sales_card_list d-inline-block">\
                                                <span>Act SKU</span>\
                                                <span class="h5 d-block">'+ actList +'</span>\
                                            </div>\
                                            <div class="sales_card_list d-inline-block">\
                                                <span>ACOS</span>\
                                                <span class="h5 d-block">'+ acos +'</span>\
                                            </div>';
                       
                            if(html.responseCode === 7){
                       
                                var warning_html = '<div id="info_msg_container" class="info_msg alert alert-warning alert-dismissible" role="alert">'+ html.responseDescription +'\
                                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                                                            <span aria-hidden="true">&times;</span>\
                                                        </button>\
                                                    </div>'
                       
                                $(".graph_bg").prepend(warning_html)
                            }
                       
                            if(TotSale.length > 6){
                                $("#total_sale_val").removeClass("h4").addClass("h5")
                            }else{
                                $("#total_sale_val").removeClass("h5").addClass("h4")
                            }
                       
                            $("#total_sale_val").html(TotSale)
                       
                            $("#sales_card").html(sales_html)
                       
                        }else{
                            $("#sales_card").html("<p class='text-center'> No data available! </p>")
                        }
                    }
                       
                    if(obj.widget_id == "TodayBestSeller"){
                        
                        if(obj.values.length > 0){
                            $.each(obj.values, function (idx2, obj2){

                                var str = obj2.title
                                if(str.length > 40) str = str.substring(0,40);

                                topSeller_html += ' <li class="media m-3 border-bottom pb-3">\
                                                        <img class="align-self-center mr-3" src="'+ obj2.image +'" onclick="window.open(\''+ obj2.url +'\',\'_system\')">\
                                                        <div class="media-body">\
                                                            <p class="mb-2 pro_title" onclick="window.open(\''+ obj2.url +'\',\'_system\')">'+ str +'</p>\
                                                            <p class="mb-2" onclick="location.href=\'product_details.html?asin='+ obj2.id +'\'">\
                                                                <span class="small text-muted mr-2">'+ obj2.id +'</span>\
                                                                <span class="small text-muted">#'+ obj2.sku +'</span>\
                                                            </p>\
                                                            <small class="mr-3">Sold Unit - <b>'+ obj2.total_sold +'</b></small>\
                                                            <small>Total Sales - <b>'+ obj2.total_sale +'</b></small>\
                                                        </div>\
                                                    </li>';

                            })
                       
                            $(".todayBest_sellerList p.error_msg").remove()
                            $("#top_sellers").html(topSeller_html)
                       
                       }else{
                            $("#top_sellers").html("")
                       
                            var err_html = '<p class="error_msg text-center mt-3"> No data available! </p>';
                            if($(".todayBest_sellerList p.error_msg").length <= 0){
                                $(".todayBest_sellerList h5").after(err_html);
                            }
                       }
                       
                       //$("#top_seller_header").html("<strong>"+ obj.widget_name +"</strong>")
                    }

                    if(obj.widget_id == "InventoryRestockTop3"){

                        if(obj.values.length > 0){

                            var lowInventory_html = "";
                            $.each(obj.values, function (idx2, obj2){

                                var str = obj2.title
                                if(str.length > 40) str = str.substring(0,40);
                                   
                                if(obj2.stock_label == "out of stock"){

                                   var status = '<span class="productBadge badge badge-danger">'+ obj2.stock_label +'</span>'
                                }else if(obj2.stock_label == "low stock"){

                                   var status = '<span class="productBadge badge badge-warning">'+ obj2.stock_label +'</span>'
                                }else{

                                   var status = ''
                                }

                                lowInventory_html += '  <li class="media m-3 border-bottom pb-3">\
                                                            <img class="align-self-center mr-3" src="'+ obj2.image +'" onclick="window.open(\''+ obj2.url +'\',\'_system\')">\
                                                            <div class="media-body">\
                                                                <p class="mb-2 pro_title" onclick="window.open(\''+ obj2.url +'\',\'_system\')">'+ str +'</p>\
                                                                <p class="mb-2" onclick="location.href=\'product_details.html?asin='+ obj2.id +'\'">\
                                                                    <span class="small text-muted mr-2">'+ obj2.id +'</span>\
                                                                    '+ status +'\
                                                                </p>\
                                                                <small class="mb-2 mr-2">In Stock - <b>'+ obj2.stock +'</b></small>\
                                                                <small class="small mb-2">Days of Supply - <b>'+ obj2.days_supply +'</b></small>\
                                                            </div>\
                                                        </li>';

                              })

                            $(".lowOnInventoryList p.error_msg").remove()
                            $("#top_lowInventory").html(lowInventory_html)

                        }else{
                            $("#top_lowInventory").html("")

                            var err_html = '<p class="error_msg text-center mt-3"> No data available! </p>';
                            if($(".lowOnInventoryList p.error_msg").length <= 0){
                                $(".top_lowInventory h5").after(err_html);
                            }
                        }
                    }
                })
           
                window.localStorage.setItem("store_limit", html.store_limit);
                checkStoreStatus();
           
            }else if(html.responseCode == 5){
                //Session expired
                sessionExpired(html.responseDescription)
            }else{
           
                var errorHTML = '<div class="data_errorMsg text-white text-center">\
                                    <h4 class="m-2 mr-5 d-inline-block ">'+ storeName +'</h4>\
                                    <img src="img/setting_icon.png" class="mr-3" onclick="javascript:location.href=\'select_store.html\'">\
                                    <img src="img/menu_icon.png" onclick="openNav()">\
                                    <p class="mt-3">'+ html.responseDescription +'</p>\
                                 </div>'
           
                $(".todayBest_sellerList").hide()
                $(".lowOnInventoryList").hide()
                $(".todaySales_recordSales").hide()
                $(".dataStatusList").hide()
                $(".graph_bg").html(errorHTML)
           }
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           
           $(".loader").removeClass("visible").addClass("invisible")
           
           console.log(status,err,'Dashboard Widget');
        }
    });
}

function showPercentageVal(){
    $('#profit').toggle();
    $('#profitPercentage').toggle();
}

function showAURVal(){
    $('#unitsLable').toggle();
    $('#unitsValue').toggle();
    $('#aurLable').toggle();
    $('#aurValue').toggle();
}

function getSelStateOpt(opt){
    window.localStorage.setItem("selStateOpt", opt.value);
    
    if(selected_val != ""){
        getDashboardWidget(selected_val,"");
    }else{
        getDashboardWidget("day","");
    }
    
    //Call chart data also
    getChartData()
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


//get chart data
function getChartData(){
    
    if(selected_val == ""){
        selected_val = "day"
    }
    
    if(selected_val == "custom"){
        var start_date = window.localStorage.getItem("start_date");
        var end_date   = window.localStorage.getItem("end_date");
    }else{
        var start_date = ""
        var end_date   = ""
    }
    
    var statVal  = window.localStorage.getItem("selStateOpt")
    
    var sending_url = api_baseurl+'widget'
    if(selected_val == "custom"){
        var sending_val = JSON.stringify({"widget_ids": "StorePerformance, DailyTarget","interval": selected_val,"start": start_date,"end": end_date,"country": statVal});
    }else{
        var sending_val = JSON.stringify({"widget_ids": "StorePerformance, DailyTarget","interval": selected_val,"country": statVal});
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
        success     : function(html){
            var result = html.responseMessage;
            //console.log("StorePerformance=>"+JSON.stringify(html))
           
            if(result.length > 0){
                $.each(result, function (idx, obj){
                       
                    if(obj.widget_id == "StorePerformance"){
                       
                       //Load chart data
                        var ChartValues    = new Object();
                        ChartValues.labels = [];
                        var chart_data     = [];
                        var profit         = [];
                       
                        $.each(obj.values, function (idx, ele) {
                            ChartValues.labels.push(idx);
                            chart_data.push(ele);
                        });

                        $.each(obj.profit_values, function (idx, ele) {
                            profit.push(ele);
                        });
                       
                        ChartValues.data = [];
                        ChartValues.data.push({ borderWidth: 0, name: 'Cost', data: chart_data });
                        ChartValues.data.push({ borderWidth: 0, name: 'Profit', data: profit });
                       
                        var statVal  = window.localStorage.getItem("selStateOpt")
                        if(statVal !== null && statVal !== ""){
                            var currencyCode = GetCurrencyCode(statVal)
                        }
                       
                        load_barChart_data(ChartValues, "#chart_data_info", obj.widget_name, currencyCode)
                    }
                       
                    if(obj.widget_id == "DailyTarget"){
                       
                        var targetUnit  = ""
                        var currentUnit = ""
                        var targetSale  = ""
                        var currentSale = ""
                        var lableByUnit = ""
                        var lableBySale = ""
                       
                        $.each(obj.values, function (index, object) {
                              
                            if(index == "Target Unit")  targetUnit  = object
                            if(index == "Current Unit") currentUnit = object
                            if(index == "Target Sale")  targetSale  = object
                            if(index == "Current Sale") currentSale = object
                            if(index == "label 1")      lableByUnit = object
                            if(index == "label 2")      lableBySale = object
                        });
                       
                        $("#chart_dailyTarget_header").html("<strong>"+ obj.widget_name +"</strong>")
                        loadDailyTargetCharts(targetUnit, currentUnit, targetSale, currentSale, lableByUnit, lableBySale)
                    }
                })
            }else if(html.responseCode == 5){
                //Session expired
                sessionExpired(html.responseDescription)
           }
           
        },timeout: ajaxTimeout,
        error: function(xhr, status, err){
           console.log(status,err,'get Chart Data');
        }
    });
}

//Load bar chart
function load_barChart_data(ChartValues,loadID,title,currOpt){
    
    $(loadID).highcharts({
        colors: ['#10dcff','#f8c06d'],
        chart: {
            type: 'column',
            marginBottom: 80,
            backgroundColor:'rgba(255, 255, 255, 0.0)'
        },
        title: {
            text: title,
            verticalAlign: 'bottom',
            style: {
                color: '#fff',
                fontSize: '16px'
            }
        },
        xAxis: {
            categories: ChartValues.labels,
            labels: {
                rotation: -65,
                style: {
                    fontSize: '13px',
                    color: '#fff',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: false,
            labels: {
                style: {
                    color: '#fff',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        legend: {
            itemMarginTop: 10,
            itemStyle: {
                color: '#fff',
                fontWeight: 'bold'
            }
        },
        tooltip: {
            formatter: function () {
                var time = 'Date';
                var s = '<b>' + time + ' : ' + this.x + '</b>';
                var revenue = 0;
                $.each(this.points, function () {
                    if (this.series.name === 'Cost') {
                       s += '<br/>' + this.series.name + ' : ' + currOpt + this.y;
                       revenue += this.y;
                    }else if (this.series.name === 'Profit'){
                       s += '<br/>' + this.series.name + ' : ' + currOpt + this.y;
                       revenue += this.y;
                       s += '<br/>Revenue : ' + currOpt + revenue;
                    }
                });
                return s;
            },
            shared: true
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
                color: '#fff'
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

function totalSalesDetails(opt, val){
    selected_val = val
    
    $(".btn_group_left .btn, .btn_group_right .btn").removeClass("btn_active")
    $(opt).addClass("btn_active")
    
    window.localStorage.setItem("selected_val", selected_val);
    
    getDashboardWidget(selected_val, "")
    
    //Call chart data also
    getChartData()
}

//This function used Advance option
function select_optBtn(sel){
    selected_val = sel.value
    
    $(".btn_group_left .btn, .btn_group_right .btn").removeClass("btn_active")
    $(sel).addClass("btn_active")
    
    if(selected_val == "custom"){
        $("#custom_date_modalbox").trigger("click")
    }else{
        window.localStorage.setItem("selected_val", selected_val);
        
        getDashboardWidget(selected_val, "")
        
        //Call chart data also
        getChartData()
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
    getDashboardWidget(selected_val, "")
    
    //Call chart data also
    getChartData()
    
}

function loadDailyTargetCharts(targetUnit, currentUnit, targetSale, currentSale, lableByUnit, lableBySale){
    
    var gaugeOptions = {
                        chart: {
                            type: 'solidgauge'
                        },
        
                        title: null,
        
                        pane: {
                            center: ['50%', '50%'],
                            size: '100%',
                            startAngle: -90,
                            endAngle: 90,
                            background: {
                                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                                innerRadius: '60%',
                                outerRadius: '100%',
                                shape: 'arc'
                            }
                        },
        
                        tooltip: {
                            enabled: false
                        },
        
                        // the value axis
                        yAxis: {
                            stops: [
                                [0.1, '#0e9aee'],
                                [0.5, '#00b7f4'],
                                [0.9, '#00c0f6']
                            ],
                            lineWidth: 0,
                            minorTickInterval: null,
                            tickAmount: 2,
                            title: {
                                y: -50
                            },
                            labels: {
                                y: 16,
                                align: 'center'
                            }
                        },
        
                        plotOptions: {
                            solidgauge: {
                                dataLabels: {
                                    y: -20,
                                    borderWidth: 0,
                                    useHTML: true
                                }
                            }
                        }
                    };

    // The speed gauge
    Highcharts.chart('chart_dailyTarget_unit',  Highcharts.merge(gaugeOptions, {
                                                          yAxis: {
                                                            min: 0,
                                                            max: targetUnit,
                                                            title: {
                                                                text: lableByUnit
                                                            }
                                                          },

                                                          credits: {
                                                            enabled: false
                                                          },
                                                          
                                                          exporting: {
                                                            enabled: false
                                                          },
                                                          
                                                          series: [{
                                                                        name: lableByUnit,
                                                                        data: [currentUnit],
                                                                        dataLabels: {
                                                                            format: '<div style="text-align:center"><span style="font-size:18px;color:' +
                                                                            ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                                                                            '<span style="font-size:12px;color:silver">By Unit</span></div>'
                                                                        },
                                                                        tooltip: {
                                                                            valueSuffix: 'By Unit'
                                                                        }
                                                                   }]

                                                        }));

    // The RPM gauge
    Highcharts.chart('chart_dailyTarget_sales',  Highcharts.merge(gaugeOptions, {
                                                        yAxis: {
                                                            min: 0,
                                                            max: targetSale,
                                                            title: {
                                                                text: lableBySale
                                                            }
                                                        },
                                                      
                                                        credits: {
                                                            enabled: false
                                                        },
                                                      
                                                        exporting: {
                                                            enabled: false
                                                        },
                                                      
                                                        series: [{
                                                                    name: lableBySale,
                                                                    data: [currentSale],
                                                                    dataLabels: {
                                                                        format: '<div style="text-align:center"><span style="font-size:18px;color:' +
                                                                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                                                                        '<span style="font-size:12px;color:silver">By Sale</span></div>'
                                                                    },
                                                                    tooltip: {
                                                                        valueSuffix: 'By Sale'
                                                                    }
                                                                }]
                                                      
                                                        }));

}


//Get currency code
function GetCurrencyCode(p_country_code) {
    
    var currencycode = '';
    switch (p_country_code) {
        case "A39IBJ37TRP1C6":
            currencycode = "$";
            break;
        case "A1VC38T7YXB528":
            currencycode = "¥";
            break;
        case "AAHKV2X7AFYLW":
            currencycode = "¥";
            break;
        case "A21TJRUUN4KGV":
            currencycode = "₹";
            break;
        case "A2Q3Y263D00KWC":
            currencycode = "R$";
            break;
        case "A1RKKUPIHCS9HS":
            currencycode = "€";
            break;
        case "A1F83G8C2ARO7P":
            currencycode = "£";
            break;
        case "A13V1IB3VIYZZH":
            currencycode = "€";
            break;
        case "A1PA6795UKMFR9":
            currencycode = "€";
            break;
        case "APJ6JRA9NG5V4":
            currencycode = "€";
            break;
        case "A2EUQ1WTGCTBG2":
            currencycode = "$";
            break;
        case "ATVPDKIKX0DER":
            currencycode = "$";
            break;
        case "A1AM78C64UM0Y8":
            currencycode = "$";
            break;
    }
    //console.log(currencycode);
    return currencycode;
}

//Menu change based store add status
function checkStoreStatus(){
    
    var store_limit = window.localStorage.getItem("store_limit");
    var account_pin = window.localStorage.getItem("account_pin")
    
    //Hide store add option
    if(store_limit <= 0){
        var addStore = '<a class="menu_text_disable" id="menu_addStore"><i class="fa fa-plus mr-3" aria-hidden="true"></i>ADD STORE <p class="mb-0 ml-4 small">( Enterprise account only )</p></a>'
    }else{
        var addStore = '<a id="menu_addStore" href="add_store.html"><i class="fa fa-plus mr-3" aria-hidden="true"></i>ADD STORE</a>'
    }
    
    if(account_pin !== 'null' && account_pin !== ""){
        var accPin = '<p class="h5">PIN - '+ account_pin + '</p>'
    }else{
        var accPin = ''
    }
    
    var slideMenu = '   <div class="nav_container">\
                            <div class="nav_menu">\
                                <div class="pt-5 clearfix">\
                                    <h3 class="w-50 float-left">Menu</h3>\
                                    <a href="javascript:void(0)" class="w-50 float-right closebtn" onclick="closeNav()">×</a>\
                                </div>\
                                <div class="mt-4 clearfix">\
                                    <div class="user_det_container">\
                                        <p class="mb-2 h4">'+ userEmail +'</p>\
                                        '+ accPin +'\
                                    </div>\
                                </div>\
                                <div class="mt-4" id="side_menu_list">\
                                    '+ addStore +'\
                                    <a id="menu_accountConfig" href="store_info.html"><i class="fa fa-cogs mr-3" aria-hidden="true"></i>ACCOUNT CONFIG</a>\
                                    <a id="menu_logOut" href="#" onclick="logOut()"><i class="fa fa-power-off mr-3" aria-hidden="true"></i>LOG OUT</a>\
                                </div>\
                            </div>\
                        </div>'
    
    $("#mySidenav").html(slideMenu)
}


function loadDefaultAdvanceBtn(){
    //It's load default advance option value loaded
    var default_option = '  <option value="" disabled selected>Advance</option>\
                            <option value="month">30 Days</option>\
                            <option value="quarter">3 Month</option>\
                            <option value="half">6 Month</option>\
                            <option value="year">1 Year</option>\
                            <option value="custom">Custom</option>'

    $("#advance_option").html(default_option)

}
