/*autocomplete初始化*/
var line = 0;//定义一个全局的line以用于记录当前显示的是哪一行
var keycontrol = 0; //用于控制当弹出框还未显示或失去焦点时，上下键取值的问题，如果失去焦点，上下键将不取li里的值,0表示不取值，1表示可取值
var vkeyword = "";
var time;
$(document).ready(function () {
    //设置from_url 用来获取来源记录
    var from_url = common.GetUrlParam("from_url") || "";
    markFrom_url2Cache(from_url);
    //设置sem cookie  function defined in common.js
    setSem();

    common.staticLog();

    var url_str = "/shop/mobile_index3.html?t=" + new Date().getTime();
    asnyTask(url_str, null, callbackLoadIndexDesc);

    // 初始化按病找药分类列表
    //asnyTask("/shop/mIndexInitTypes.html?t="+new Date().getTime(), null, callBackGetInfoTypes);

    $(window).on("scroll", function () {
        var st = $(window).scrollTop();
        var site = $(".bbfNav").offset().top - 51;
        if (st > site) {
            $(".headerContainer").addClass("fixedHd");
        }
        else {
            $(".headerContainer").removeClass("fixedHd");
        }
    });

    //按回车后头部搜索
    $('#searchHeadContent').keydown(function (event) {
        if (event.keyCode == 13) {
            var searchKeyWord = $("#searchHeadContent").val() || "";
            if (searchKeyWord == "") {
                return false;
            }
            window.location = "prodSearchList.html?search_key=" + searchKeyWord;
            return false;
        }
    });

    //autocomplete启动
    jQuery(".main_input").keyup(function (e) {
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
    });
    //失去焦点之后关闭
    jQuery(document.documentElement).click(function () {
        keycontrol = 0;//将keycontrol的值初始化为0,防止上下键取li里的值
        none();
        $("#kefu-sl").hide();
    });

    //首页客服选择
    $("#menu-kefu").on('click', function (event) {
        event.stopPropagation();
        $("#kefu-sl").toggle();
    });

    $("#footer").load("mobileFooter.html?v=3.1");
    $(".wrap").css("visibility", "visible");
});


function callbackLoadIndexDesc(response) {
    //1、商家广告(滚动)
    if (response.rollImgUrlList.length > 0) {
        var advContent = '<ul class="swiper-wrapper banerWrapper">';
        $.each(response.rollImgUrlList, function (index, result) {
            var $advInfo = $('<span><li class="swiper-slide banerSlide">' +
                '<a href="" class="linkClass"><img class="imageClass"></a>' +
                '</li><span>');
            $advInfo.find(".imageClass").attr("src", image_server + result.url);
            $advInfo.find(".linkClass").attr("href", result.link);
            advContent += $advInfo.html();
        });
        advContent += '</ul><div class="swiper-pagination banerDot" id="banerDot"></div>';
        $("#banerContainer").append(advContent);
    }

    //首页全屏广告
    if (response.advIndex != null) {
        $("#advIndexA").attr("href", response.advIndex.link);
        $("#full_ad_img").attr("src", image_server + response.advIndex.url);
        //全屏广告
        if($("#full_ad_img").attr("src") != "") {
            show_full_ad();
        }
    }

    //首页banner滚动设定
    /*var banerLoop = true;
    var banerDot = '#banerDot';
    if ($("#banerContainer li").length == 1) {
        banerLoop = false;
        banerDot = '';
    }
    if ($("#banerContainer li").length) {
        var bannerSwiper = new Swiper('#banerContainer', {
            autoplay: 4500,
            speed: 500,
            loop: banerLoop,
            mode: 'horizontal',
            resistance: '100%',
            simulateTouch: 'false',
            //初始化
            onFirstInit: function () {
                var boxWidth = $("#banerContainer").width();
                //焦点图高宽比率
                var ratio = 110 / 320
                $("#banerContainer .banerWrapper").css("height", boxWidth * ratio);
            },
            //再次调用
            onInit: function () {
                var boxWidth = $("#banerContainer").width();
                //焦点图高宽比率
                var ratio = 110 / 320
                $("#banerContainer .banerWrapper").css("height", boxWidth * ratio);
            },
            pagination: banerDot
        });
    }*/

    /*每周优惠暂时撤离
     //2、每周优惠
     if (response.recommendProList && response.recommendProList.length > 0) {
     var recListContent = '<ul class="discountList swiper-wrapper">';
     $.each(response.recommendProList, function(index, result) {
     var $recInfo =  $('<span><li class="swiper-slide">'+
     '<a href="" class="dcInfo">'+
     '<div class="dcImg"><img class="recommendImg"></div>'+
     '<div class="dcDetail">'+
     '<p class="dcName"></p>'+
     '<p class="dcPrice">￥</p>'+
     '</div></a></li><span>');
     $recInfo.find(".dcInfo").attr("href","prodDetail.html?prod_id="+result.pid+"&shop_code="+result.shopCode+"&source=internal");
     $recInfo.find(".recommendImg").attr("src", image_server + result.listSImg);
     $recInfo.find(".dcName").html(result.name);
     $recInfo.find(".dcPrice").append(result.shopPrice);
     recListContent += $recInfo.html();
     });
     recListContent += '</ul>';
     $("#discountContainer").append(recListContent);
     //swiper化
     if(response.recommendProList.length > 3){
     var bannerSwiper = new Swiper('#discountContainer',{
     mode: 'horizontal',
     slidesPerView: 'auto',
     simulateTouch: 'false',
     onInit: function(){
     var l_width = 100/response.recommendProList.length;
     $("#discountContainer li").css("width",l_width + "%").css("visibility","visible");
     }
     });
     }
     }
     */

    //2、季节常见疾病（广告位）
    if (response.imgUrlList.length > 0) {
        $.each(response.imgUrlList, function (index, result) {
            index += 1;
            $("#sygd_url_" + result.adverPositionCode).attr("href", result.link);
            $("#sygd_img_" + result.adverPositionCode).attr("src", image_server + result.url);
        });
    }

    //3、广告位
    if (response.adImgUrlList.length > 0) {
        $.each(response.adImgUrlList, function (index, result) {
            index += 1;
            $("#sygd_url" + index).attr("href", result.link);
            $("#sygd_img" + index).attr("src", image_server + result.url);
        });
    }

    
}

//条码搜药
function wxScan() {
    if (wxBrowser) {
        window.location = "wxQrcodeScan.html";
    } else {
        //alert("请在微信浏览器下使用扫码功能哦~");
        $(".mask_b").show();
        $("#guanzhu_Toast").show();
    }
}
//上传处方
function uploadChufang() {
    window.location = "uploadChufang.html";
}
//头部搜索
function searchHead() {
    var searchKeyWord = $("#searchHeadContent").val() || "";
    if (searchKeyWord == "") {
        return false;
    }
    window.location = "prodSearchList.html?search_key=" + searchKeyWord;
}

function searchOneCategory(obcid) {
    window.location = "prodSearchList.html?obcid=" + obcid;
}

function toMyHomePage() {
    var username = TempCache.getItem("login_username") || "";
    if (username != "") {
        window.location = "memberHome.html";
    } else {
        window.location = "memberLogin.html";
    }
}

//autocomplete异步请求数据
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
            if (n > 0) {
                litag = litag + "<li class='closeComplete'><a href='javascript:closeComplete()'>关闭</a></li>";
            }
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

//推荐商品通用方法
/*function drawLi(wapIndexProdReList) {
    var recListContent = '<li class="hsLi swiper-slide">';
    $.each(wapIndexProdReList, function (index, result) {
        if (index < 10) {
            var $recInfo = $('<span><a class="hsProd" href="#">' +
                '<div class="prodImage">' +
                '<img class="pd_picture" style_external="height:auto; width:auto;" width="120" height="120" src="images/loading.png">' +
                '</div>' +
                '<p class="prodName"></p>' +
                '<p class="prodPrice">' +
                '<span class="bPrice"></span>' +
                '<span class="mPrice"></span>' +
                '</p>' +
                '</a></span>');
            $recInfo.find(".hsProd").attr("href", "prodDetail.html?prod_id=" + result.pid + "&shop_code=" + result.shopCode + "&source=internal");
            var imageNameArray = result.listSImg.split(".");
            $recInfo.find(".pd_picture").attr("data-original", image_server + result.listSImg.replace(("." + imageNameArray[imageNameArray.length - 1]), "_bbfm.jpg"));
            $recInfo.find(".pd_picture").attr("data-originalbak", image_server + result.listSImg);
            $recInfo.find(".prodName").html(result.name);
            $recInfo.find(".bPrice").html('￥' + result.shopPrice);
            $recInfo.find(".mPrice").html('￥' + result.marketPrice);
            recListContent += $recInfo.html();
        }
    });
    recListContent += '</li>';
    $(".hsUl").append(recListContent);
    $(".pd_picture").show().lazyload({threshold: 900});//加载图片
}*/

//全屏广告
function show_full_ad() {
    var full_ad_flag = $.cookie("full_ad_flag");
    if (full_ad_flag == null) {
        $("#full_ad").show();
        $.cookie("full_ad_flag", 1, {expires: 1, path: "/"});
        var w_width = $(window).width();
        var w_height = $(window).height();
        var ad_width = $("#full_ad_img").width();
        var ad_height = (ad_width/580)*730;
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

///**
// * 初始化资讯分类列表
// */
//function callBackGetInfoTypes(respone)
//{
//  if (respone.fstClassList) {
//    // 一级分类列表
//    var str= "";
//    var arr = new Array();
//    var arrLength = 0;
//    var num = 0;
//    var last = 0;
//    $("#InfoTypeList").html("");
//    $.each(respone.fstClassList, function(index, fstClass) {
//      // 二级分类，只显示有二级分类的一级分类
//      if (fstClass.secondClassList.length > 0) {
//        num++;
//        $("#InfoTypeList").append('<p class="main-list">' + fstClass.category_name +"</p>");
//        str += "<div class='subList-container'>";
//        $.each(fstClass.secondClassList, function (index, sndClass) {
//          str += '<div class="sub-list"><a href="http://www.800pharm.com/shop/m/searchList.html?categoryId='
//            + sndClass.id + '">'+ sndClass.category_name + '</a></div>'
//        });
//        str += "</div>";
//      }
//
//      // 首页结构：每四个一级分类一组，每组一级分类下的二级分类放在每行一级分类末尾
//      if ((num % 4 == 0 && num != last) || index == respone.fstClassList.length - 1) {
//        last = num;
//        str = "<div class='box-subList'>" + str + "</div>";
//        arr.push(str);
//        str = "";
//      }
//    });
//
//    if (arr.length > 0) {
//      var pArr = $("#InfoTypeList").children();
//      var t= 0;
//      for (var i = 0; i < pArr.length; i++) {
//        if ((i != 0 && (i + 1) % 4 == 0) || i == pArr.length - 1) {
//          $(arr[t++]).insertAfter(pArr[i]);
//        }
//      }
//    }
//
//    $(".main-list").each(function() {
//      var i = $(".main-list").index(this);
//      // 如果一级分类下有符合的二级分类
//      if ($(".subList-container").eq(i).children().length > 0) {
//        $(this).click(function() {
//          if($(this).hasClass("hover")){
//            $(this).removeClass("hover");
//            $(".subList-container").eq(i).hide();
//          }
//          else{
//            $(".main-list.hover").removeClass("hover");
//            $(this).addClass("hover");
//            $(".subList-container").hide();
//            $(".subList-container").eq(i).show();
//          }
//        });
//      }
//    });
//  }
//}