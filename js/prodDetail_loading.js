var prod_id;
var shop_code;
var source;
var line = 0;//定义一个全局的line以用于记录当前显示的是哪一行
var keycontrol = 0; //用于控制当弹出框还未显示或失去焦点时，上下键取值的问题，如果失去焦点，上下键将不取li里的值,0表示不取值，1表示可取值
var vkeyword = "";
var time;

// JavaScript Document
$(document).ready(function () {
    //设置sem cookie  function defined in common.js
    setSem();

    prod_id = common.GetUrlParam("prod_id");
    shop_code = common.GetUrlParam("shop_code");
    source = common.GetUrlParam("source");
    if (shop_code.indexOf("___shelves") > 0) {
        shop_code = shop_code.replace("___shelves", "");
    }
    //from url cookies
    var fromUrl = common.GetUrlParam("from_url") || '';
    if (fromUrl != '') {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = "fromurl_800pharm_visitor" + "=" + escape(fromUrl) + ";expires=" + exp.toGMTString() + ";Path=/;Domain=.800pharm.com";
    }
    var url_str = "/shop/nm_product-" + shop_code + "-" + prod_id + ".html?source=" + source + "&t=" + new Date().getTime();
    asnyTask(url_str, null, callbackProdDetail);

    //全屏广告
    asnyTask("/shop/mobile_index3.html?t=" + new Date().getTime(), null, callbackLoadIndexDesc);
});

//全屏广告
function callbackLoadIndexDesc(response) {
    if (response.advIndex != null) {
        $("#advIndexA").attr("href", response.advIndex.link);
        $("#full_ad_img").attr("src", image_server + response.advIndex.url);
        if ($("#full_ad_img").attr("src") != "") {
            show_full_ad();
        }
    }
}

function callbackProdDetail(response) {
    if (response.status != null) {
        if (response.status == 'notExist') {
            loadNotExist();
        } else if (response.status == 'shelves') {//上架
            loadShelvesProdDetail_autoLogin();
        } else if (response.status == 'offshelf_shelves') {//下架但存在替换商品
            prod_id = response.pid;
            shop_code = response.shopCode;
            loadShelvesProdDetail_autoLogin();
        } else {//下架
            loadOffshelfProdDetail();
        }
    } else {
        window.history.go(-1);
    }
}

function loadNotExist() {
    commonMethod();

    $("#indexBaner").load("index.html .index_scroll", function () {
        var length = $(".index_scroll").children().length;
        var ramdon = parseInt(length * Math.random());
        $(".index_scroll").children().eq(ramdon).siblings().remove();
    });

    $("#loadingDiv").attr("style", "display:none;");
    $("#notFoundDiv").attr("style", "display:block;");
}

//判断是否需要自动登陆
function loadShelvesProdDetail_autoLogin() {

    var username = TempCache.getItem("login_username") || "";
    if (username != "") {//判断后台是否有登陆记录
        var url_str = "/shop/member/isLogin_m.html?t=" + new Date().getTime();
        asnyTask(url_str, null, callbackLoginLoading_autoLogin);
    } else {
        loadShelvesProdDetail();
    }
}

function callbackLoginLoading_autoLogin(response) {
    if (response.rt_code == "-1") {//如果后台没登陆记录，则自动登陆
        var username = TempCache.getItem("login_username") || "";
        var password = TempCache.getItem("login_password") || "";
        if (username != "" && password != "") {
            var loginUrl = "/shop/member/mobileCheckLogin_m.html?t=" + new Date().getTime();
            var data_obj = {"account": decrypt(username), "pwd": decrypt(password), "status": ""};
            asnyTask(loginUrl, data_obj, loadShelvesProdDetail);
        } else {//如果后台有登陆记录
            loadShelvesProdDetail();
        }
    } else {
        loadShelvesProdDetail();
    }
}

function loadShelvesProdDetail() {
    var url_str = "/shop/shelves-" + shop_code + "-" + prod_id + ".html?t=" + new Date().getTime();
    common.staticLog("___shelves");
    asnyTask(url_str, null, callbackShelvesProdDetail);
}

function loadOffshelfProdDetail() {
    var timeTemp = new Date().getTime();
    var url_str = "/shop/offshelf-" + shop_code + "-" + prod_id + ".html?t=" + timeTemp;
    common.staticLog("___offShelf");
    asnyTask(url_str, null, callbackOffshelfProdDetail);
}

function commonMethod() {
    $("#header").load("mobileSearchHeader.html?v=3.2", function () {
        var searchContent = $("#searchHeadContent");
        //搜索框清空按钮
        if (searchContent.val() != "" && searchContent.val() != null) {
            searchContent.siblings(".empty_input").show();
        }
        else {
            searchContent.siblings(".empty_input").hide();
        }
        searchContent.on("keyup", function () {
            if (searchContent.val() != "" && searchContent.val() != null) {
                searchContent.siblings(".empty_input").show();
            }
            else {
                searchContent.siblings(".empty_input").hide();
            }
        });
        searchContent.siblings(".empty_input").on("click", function () {
            $(this).hide();
        });
        //按回车后头部搜索
        $('#searchHeadContent').keydown(function (event) {
            if (event.keyCode == 13) {
                keyStr = $("#searchHeadContent").val() || "";
                if (keyStr == "") {
                    return false;
                }
                window.location = "prodSearchList.html?search_key=" + keyStr;
                return false;
            }
        });
        //autocomplete
        jQuery(".main_input").keyup(function (e) {
            if (e.keyCode != 13) {
                vkeyword = jQuery(".main_input").val();
                keycontrol = 1;//将状态变为1，供下面上下键取li里的值使用
                if (vkeyword != "") {
                    clearTimeout(time);//清除定时器，防止操作频繁造成过多查询的情况
                    time = setTimeout(function () {
                        getResult(vkeyword)
                    }, 100);
                } else {
                    none();
                }
            }
        });

        //失去焦点之后关闭
        jQuery(document.documentElement).click(function () {
            keycontrol = 0;//将keycontrol的值初始化为0,防止上下键取li里的值
            none();
        });
    });
}

//头部搜索
function searchHead() {
    var searchKeyWord = $("#searchHeadContent").val() || "";
    if (searchKeyWord == "") {
        return false;
    }
    window.location = "prodSearchList.html?search_key=" + searchKeyWord;
}

//异步请求数据
function getResult(val) {
    jQuery.ajax({
        type: "get",
        cache: false,//不缓存
        async: false,
        url: "/shop/searchKWTip.html?searchValue=" + encodeURIComponent(val),
        dataType: "jsonp",
        jsonp: "callbackparam",//服务端用于接收callback调用的function名的参数
        jsonpCallback: "callback",//callback的function名称
        success: function (json) {
            jQuery(".autocomplete ul").remove();//增加节点前先清空
            var litag = "";
            var n = 0;
            if (json.length > 5)
                n = 5;
            else
                n = json.length;
            for (var i = 0; i < n; i++) {
                var url = 'prodSearchList.html?search_key=' + encodeURIComponent(json[i].kw);
                litag = litag + "<li><a href='" + url + "'>" + json[i].kw + "</a></li>";
            }
            litag = litag + "<li class='closeComplete'><a href='javascript:closeComplete()'>关闭</a></li>";
            jQuery(".autocomplete").append("<ul>" + litag + "</ul>");
            var length = jQuery(".autocomplete li").length;
            if (length > 0) {
                jQuery(".autocomplete").show();
            } else {
                none();
            }
        },
        error: function () {
        }
    });
}

function closeComplete() {
    $("body").click();
}

//关闭
function none() {
    jQuery(".autocomplete").empty().hide();
    line = 0;
}

//百度统计代码
var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?e70be84907793e52f974a062e2bfcd4d";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

//全屏广告
function show_full_ad() {
    var full_ad_flag = $.cookie("full_ad_flag");
    if (full_ad_flag == null) {
        $("#full_ad").show();
        $.cookie("full_ad_flag", 1, {expires: 1, path: "/"});
        var w_width = $(window).width();
        var w_height = $(window).height();
        var ad_width = $("#full_ad_img").width();
        var ad_height = (ad_width / 580) * 730;
        $("#full_ad_img").css("height", ad_height);
        var ad_left = (w_width - ad_width) / 2;
        var ad_top = (w_height - ad_height) / 2;
        $("#full_ad_img").css({
            left: ad_left,
            top: ad_top
        });

        $("#skip_full_ad").css({
            right: ad_left - 15,
            top: ad_top - 50
        });

        var skip_time = 5;

        setInterval(function () {
            if (skip_time > 1) {
                skip_time--;
                $("#skip_timmer").text(skip_time);
            } else {
                hide_full_ad();
                return;
            }
        }, 1000);
    }
}

function hide_full_ad() {
    $("#full_ad").hide();
}