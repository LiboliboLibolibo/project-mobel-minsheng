var wxBrowser = false;//判断是否微信浏览器

$(document).ready(function () {
    var from_url = common.GetUrlParam("from_url");

    if (from_url != '') {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = "fromurl_800pharm_visitor" + "=" + decodeURI(from_url) + ";expires=" + exp.toGMTString() + ";Path=/;Domain=.800pharm.com";
    }

    if (navigator.userAgent.match(/iPhone|iPod/i)) {
        if (!document.cookie.match(/createQuick=hidden|fromurl_800pharm_visitor=wxgd/i) && from_url != "wxgd") {
            $("body").append('<a id="createQuick" class="createQuick" href="javascript:createQuickHide();"></a>');
        }
    }
    $(".backTop").on("click", function () {
        $('html,body').animate({scrollTop: '0px'}, 800);
    });
    $(document).on('WeixinJSBridgeReady', function onBridgeReady() {
        //微信浏览器
        wxBrowser = true;
        //在此设置微信需要的设定。。。
    });
});

$(document).on({
    ajaxStart: function () {
        loading("show", "");
    },
    ajaxStop: function () {
        loading("hide", "");
    }
});

function loading(state, content) {
    if (state == "show") {
        if ($(".loadingToast").length == 0) {//如果不存在则增加
            $("body").append("<div class='loadingToast'>正在加载...</div>");
        }
        $(".loadingToast").css("z-index", 20).fadeIn(300);
    }
    else if (state == "hide") {
        $(".loadingToast").remove();
    }
}

var common = {
    realize: function () {
        alert('该功能尚未实现');
    },
    GetUrlParam: function (paramName) {
        var oRegex = new RegExp('[\?&]' + paramName + '=([^&]+)', 'i');
        var oMatch = oRegex.exec(window.location.search);
        if (oMatch && oMatch.length > 1)
            return oMatch[1];
        else
            return '';
    },
    // 空格验证
    fTrim: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    staticLog: function (label) {
        var v_label = label || "";
        var _umy = encodeURIComponent(document.location.href) + v_label + "&&&" + encodeURIComponent(document.referrer || "") + "&&&" + encodeURIComponent(location.search || "") + "&&&" + new Date().getTime();
        var static_url = unescape("/shop/js/staticxxx.jsx%3F" + _umy);
        $.ajax({url: static_url.replace("\#", "$")});
    },
    currentUrl: function () {
        return window.location.href;
    },
    //获取当前服务器时间 - 获取失败则获取客户端时间
    getNowDay: function () {
        var nowDay = "";
        $.ajax({
            url: "/shop/getDate.html?t=" + new Date().getTime(),
            type: "get", //数据传递方式(get或post)
            dataType: "json", //期待数据返回的数据格式(例如 "xml", "html", "script",或 "json")
            async: false,
            success: function (data) { //当请求成功时触发函数
                var nowDate = new Date(data.date);
                var month = nowDate.getMonth() + 1;
                if (month < 10)month = "0" + month;
                nowDay = nowDate.getFullYear() + "-" + month + "-" + nowDate.getDate();
            },
            error: function () {
                //获取失败时，获取客户端时间
                var nowDate = new Date();
                nowDay = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
            }
        });
        return nowDay;
    }

};

function setSem() {
    var sem = common.GetUrlParam("sem");
    var refererFrom = document.referrer;
    if (sem != null) {
        //set cookie
        $.ajax({
            url: "/shop/member/writeNewHomeSemCookie.html?t=" + new Date().getTime() + "&sem=" + sem,
            type: "get", //数据传递方式(get或post)
            dataType: "text", //期待数据返回的数据格式(例如 "xml", "html", "script",或 "json")
            success: function (result) { //当请求成功时触发函数
                if (result == "ok") {
                    return;
                }
            }
        });
    }
}

function markFrom_url2Cache(from_url) {
    if (from_url != null && from_url != "") {
        TempCache.itemUpdate("from_url", from_url);
    }
}

function asnyTask(url, dataObj, callBackFunc) {
    $.ajax({
        type: "POST",
        url: url,
        data: dataObj,
        contenttype: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        success: callBackFunc,
        timeout: 60000,
        error: errorHandler
    });
}

function errorHandler(jqXHR, textStatus, errorThrown) {
    console.log("Error, textStatus: 11" + textStatus + " errorThrown: " + errorThrown);
}

//设置小数位
function FormatNumber(srcStr, nAfterDot) {
    var srcStr, nAfterDot;
    var resultStr, nTen;
    srcStr = "" + srcStr + "";
    strLen = srcStr.length;
    dotPos = srcStr.indexOf(".", 0);
    if (dotPos == -1) {
        resultStr = srcStr + ".";
        for (i = 0; i < nAfterDot; i++) {
            resultStr = resultStr + "0";
        }
        return resultStr;
    }
    else {
        if ((strLen - dotPos - 1) >= nAfterDot) {
            nAfter = dotPos + nAfterDot + 1;
            nTen = 1;
            for (j = 0; j < nAfterDot; j++) {
                nTen = nTen * 10;
            }
            resultStr = Math.round(parseFloat(srcStr) * nTen) / nTen;
            return resultStr;
        }
        else {
            resultStr = srcStr;
            for (i = 0; i < (nAfterDot - strLen + dotPos + 1); i++) {
                resultStr = resultStr + "0";
            }
            return resultStr;
        }
    }
}

//退出登录
function logout() {
    var url = "/shop/member/memberLogout_m.html";
    asnyTask(url, "", callbackLogout);
}

//个人中心
function toMyHomePage() {
    var username = TempCache.getItem("login_username") || "";
    if (username != "") {
        window.location = "/shop/m/memberHome.html";
    } else {
        window.location = "/shop/m/memberLogin.html";
    }
}

function callbackLogout(response) {
    sessionCache.clearAll();
    TempCache.clearAll();
    window.location = "/shop/m/memberLogin.html";
}

function createQuickHide() {
    $("#createQuick").hide();
    var d = new Date();
    d.setHours(d.getHours() + (24 * 90)); //保存3个月
    document.cookie = "createQuick=hidden; expires=" + d.toGMTString();
}

//滚动到底部
function runToBottom() {
    var currentPosition = 0;
    currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
    //currentPosition+=30;
    if (currentPosition < document.body.scrollHeight && (document.body.clientHeight + document.body.scrollTop < document.body.scrollHeight)) {
        document.body.scrollTop = currentPosition;
    }
    else {
        document.body.scrollTop = document.body.scrollHeight;
    }
}

function setCookie(name, value) {
    var Days = 30; //此 cookie 将被保存 30 天
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";domain=.800pharm.com;path=/";
}


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + '01';
    return currentdate;
}


//小能咨询增加订单推广参数统计
function getLatestUrl() {
    var fromurl = getCookie("fromurl_800pharm_visitor");
    var sem = getCookie("sem_src");
    if (fromurl == null && sem == null) {
        return "";
    } else if (fromurl != null && sem == null) {
        return "("+fromurl+")";
    } else if (fromurl == null && sem != null) {
        return "("+sem+")";
    } else if(fromurl != null && sem != null){
       return "("+fromurl+"，"+sem+")";
//        var fromurl_date = decodeURIComponent(getCookie("fromurltime_800pharm_visitor"));
//        var fromurl_date = new Date(fromurl_date.replace("+", " "));
//
//        var sem_date = decodeURIComponent(getCookie("sem_createdates"));
//        var sem_date = new Date(sem_date.replace("+", " "));
//
//        if (fromurl_date > sem_date) {
//            return "("+fromurl+")";
//        } else {
//            return "(sem="+sem+")";
//        }
    }
}
function getLatestUrlToB2c() {
    var fromurl = getCookie("fromurl_800pharm_visitor");
    var sem = getCookie("sem_src");
    if (fromurl == null && sem == null) {
        return "";
    } else if (fromurl != null && sem == null) {
        return "(F:"+fromurl+")";
    } else if (fromurl == null && sem != null) {
        return "(S:"+sem+")";
    } else if(fromurl != null && sem != null){
       return "("+fromurl+","+sem+")";
    }
}

function getFirstLatestUrlToB2c() {
  var fromurl = common.GetUrlParam("from_url") || "";
    var sem = common.GetUrlParam("sem") || "";
    if ((fromurl == null || fromurl == "") && (sem == null || sem == "")) {
        return "";
    } else if ((fromurl != null && fromurl != "") && (sem == null || sem == "")) {
        return "(F:"+fromurl+")";
    } else if ((fromurl == null || fromurl == "") && (sem != null && sem != "")) {
        return "(S:sem_"+sem+")";
    } else if(fromurl != null && fromurl != "" && sem != null && sem != ""){
       return "("+fromurl+",sem_"+sem+")";
    }
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return decodeURI(arr[2]);
    else
        return null;
}