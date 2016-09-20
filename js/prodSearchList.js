var pageNo = 1;
var locationHref = null;//用于综合排序和重置
var keyStr = null;
var obcid = null;
var twbcid = null;
var thrbcid = null;
var catalog = null;//判断是分类筛选是第几级
var catalogName = null;//筛选的分类名称
var flag = false;//判断是否需要筛选分类，默认不需要筛选

var cityId = null;
var cityName = null;//筛选的城市名称
var brandId = null;
var brandName = null;//筛选的品牌名称
var price_st = null;
var price_en = null;
var sortType = null;

var type = null;//1是从PC端搜索页转接过来的或者是移动首页，2搜索关键词
var line = 0;//定义一个全局的line以用于记录当前显示的是哪一行
var keycontrol = 0; //用于控制当弹出框还未显示或失去焦点时，上下键取值的问题，如果失去焦点，上下键将不取li里的值,0表示不取值，1表示可取值
var vkeyword = "";
var time;
var str_company = "";
var str_pzwh = "";

$(document).ready(function () {

    common.staticLog();

    locationHref = location.href;

    obcid = common.GetUrlParam("obcid") || "";
    twbcid = common.GetUrlParam("twbcid") || "";
    thrbcid = common.GetUrlParam("thrbcid") || "";
    sortType = common.GetUrlParam("sortType") || "";

    if (obcid != "" && twbcid != "" && thrbcid != "") {//如果三级分类进来隐藏分类筛选
        catalog = 4;
    } else if (obcid != "" && twbcid != "") {//如果二级分类进来显示三级分类筛选
        catalog = 3;
    } else if (obcid != "") {//如果一级分类进来显示二级分类筛选
        catalog = 2;
    } else {//如果关键字进来显示一级分类筛选
        catalog = 1;
    }

    var fromUrl = common.GetUrlParam("from_url") || '';
    if (fromUrl != '') {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = "fromurl_800pharm_visitor" + "=" + escape(fromUrl) + ";expires=" + exp.toGMTString() + ";Path=/;Domain=.800pharm.com";
    }

    $("#header").load("mobileSearchHeader.html?v=3.2", function () {
        //按回车后头部搜索
        $("#searchHeadContent").keydown(function (event) {
            if (event.keyCode == 13) {
                keyStr = $("#searchHeadContent").val() || "";
                if (keyStr == "") {
                    return false;
                }
                window.location = "prodSearchList.html?search_key=" + keyStr;
                return false;
            }
        });

        $("#hd_input").val(keyStr);
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

    $("#footer").load("mobileFooter.html?v=3.2");

    if (obcid != "") {
        type = "1";
    } else {
        type = "2";
        keyStr = common.GetUrlParam("search_key") || "";
        str_company = common.GetUrlParam("company") || "";
        str_pzwh = common.GetUrlParam("pzwh") || "";

        if (keyStr != "") {
            keyStr = decodeURI(keyStr);
        }

        if (str_company != "") {
            str_company = decodeURI(str_company);
        }

        if (str_pzwh != "") {
            str_pzwh = decodeURI(str_pzwh);
        }

    }

    loadingList(1);

});

//头部搜索
function searchHead() {
    keyStr = $("#searchHeadContent").val() || "";
    if (keyStr == "") {
        return false;
    }
    window.location = "prodSearchList.html?search_key=" + keyStr;
}

function loadingList(pageNum) {
    pageNo = pageNum;
    //1是从PC端搜索页转接过来的或者是移动首页，2搜索关键词
    if (type == "1") {
        var url_str = "/shop/searchm/search_m.html?t=" + new Date().getTime();
        var dataObj = {
            p: pageNo,
            sortType: sortType,
            cityId: cityId,
            brandId: brandId,
            price_st: price_st,
            price_en: price_en,
            obcid: obcid,
            twbcid: twbcid,
            thrbcid: thrbcid
        };//sortType排序 1为价格升序，3为销售降序
        asnyTask(url_str, dataObj, callbackProductList);
    } else {
        var url_str = "/shop/searchm/search_m.html?t=" + new Date().getTime();
        var dataObj = {
            p: pageNo,
            sortType: sortType,
            cityId: cityId,
            brandId: brandId,
            price_st: price_st,
            price_en: price_en,
            obcid: obcid,
            twbcid: twbcid,
            thrbcid: thrbcid,
            keyword: keyStr,
            company: str_company,
            pzwh: str_pzwh
        };//sortType排序 1为价格升序，3为销售降序
        asnyTask(url_str, dataObj, callbackProductList);
    }
}

function callbackProductList(response) {
    if (response.adSeachResult != null) {
        $("#advResultA").attr("href", response.adSeachResult.link);
        $("#advResultI").attr("src", image_server + response.adSeachResult.url);
    }

    $('html,body').animate({scrollTop: '0px'}, 200);
    if (type == "1") {
        if (response.catalogBaseName != null && response.catalogBaseName != "") {
            $("#header").load("mobileSearchHeader.html?v=3.2", function () {
                $("#hd_input").val(response.catalogBaseName);
            });
        }
    }

    if (response.page.items.length > 0) {
        var productContent = "";
        $.each(response.page.items, function (index, result) {
            var $template = $('<span><a class="box_pd" href="">' +
                '<div class="pdImg"><img class="pd_picture" style_external="max-width:100px; max-height:100px;" src="images/loading.png"/></div>' +
                '<div class="pd_detail">' +
                '<p class="pd_name"></p>' +
                '<p class="pd_merchant"></p>' +
                '<p class="pd_price"></p>' +
                '<p class="pd_standard"></p>' +
                '</div>' +
                '</a></span>');
            var imageNameArray = result.listSImg.split(".");
            $template.find(".pd_picture").attr("data-original", image_server + result.listSImg.replace(("." + imageNameArray[imageNameArray.length - 1]), "_bbfm.jpg"));
            $template.find(".pd_picture").attr("data-originalbak", image_server + result.listSImg);
            if (result.selfDefinitionName != null && result.selfDefinitionName != "") {
                $template.find(".pd_name").append(result.selfDefinitionName);
            } else {
                $template.find(".pd_name").append(result.name);
            }
            $template.find(".pd_price").append("￥" + FormatNumber(result.shopPrice, 2));
            $template.find(".pd_standard").append(result.guige);
            $template.find(".pd_merchant").append(result.merchantName);
            if (result.cashOnDelivery != null && result.cashOnDelivery == 1) {
                $template.find(".pd_merchant").append('<span class="payOffline"><em>货到付款</em></span></dd>');
            }
            var user_from_url = TempCache.getItem("user_from_url");
            var unionid = TempCache.getItem("unionid");
            if (user_from_url != null && user_from_url != "" && user_from_url.toLowerCase() != "null" && unionid != null && unionid != "" && unionid.toLowerCase() != "null") {
                if (response.shopCodeList != null && response.shopCodeList.length > 0) {
                    for (var i = 0; i < response.shopCodeList.length; i++) {
                        if (result.shopCode == response.shopCodeList[i]) {
                            $template.find(".pd_standard").append('<p class="in_same_shop">购物车有同店商品</p>');
                        }
                    }
                }
            }

            $template.find(".box_pd").attr("href", "prodDetail.html?prod_id=" + result.pid + "&shop_code=" + result.shopCode + "&source=internal");
            productContent += $template.html();
        });

        var pageTotal = response.page.pageTotal;

        productContent += '<div class="pagination">';
        if (parseInt(pageNo) == 1) {//如果是第一页，则上一页是本身，跳转无效
            productContent += '<a href="javascript:;" class="goPrev notGo">上一页</a>';
        } else {
            productContent += '<a href="javascript:loadingList(' + (parseInt(pageNo) - 1) + ')" class="goPrev">上一页</a>';
        }
        //只有一页的时候，选择页码不显示，多于1页才显示
        if (parseInt(pageTotal) == 1) {
            productContent += '<div class="nowPage onlyOne"><span>' + pageNo + '</span>/<span>' + pageTotal + '</span></div>';
        } else {
            productContent += '<div class="nowPage" id="pagePop"><span>' + pageNo + '</span>/<span>' + pageTotal + '</span></div>';
        }
        if (parseInt(pageNo) == parseInt(pageTotal)) {//如果是最后一页，则下一页是本身，跳转无效
            productContent += '<a href="javascript:;" class="goNext notGo">下一页</a>';
        } else {
            productContent += '<a href="javascript:loadingList(' + (parseInt(pageNo) + 1) + ')" class="goNext">下一页</a>';
        }
        productContent += '<div class="choosePage" id="pageBox"><ul class="pageList">';
        for (var i = 1; i <= pageTotal; i++) {
            productContent += '<li><a href="javascript:loadingList(' + i + ')">' + i + '</a></li>';
        }
        productContent += '</ul></div></div></div>';

        $(".pd_list").html(productContent);
        $(".pd_picture").show().lazyload();
        $(".search_hd").show();
        //选择页码出现
        $("#pagePop").click(function () {
            $("#pageBox").toggle();
        });

        if (brandId != null && brandId != "") {
            var brandCon = "<dt>品牌：<div id='brandChoose' class='filterChoose'>" + brandName + "</div></dt><dd><label class='filterLabel' for='brand_all'>全部品牌</label><input class='filterRadio' type='radio' name='brand' id='brand_all' value=''></dd>";
            $.each(response.filterBrandList, function (i, item) {
                if (brandId == item.id) {
                    brandCon += "<dd><label class='filterLabel cur' for='brand_" + item.id + "''>" + item.name + "(" + item.recordTotal + ")" + "</label><input class='filterRadio' type='radio' name='brand' id='brand_" + item.id + "' value=" + item.id + "></dd>";
                } else {
                    brandCon += "<dd><label class='filterLabel' for='brand_" + item.id + "''>" + item.name + "(" + item.recordTotal + ")" + "</label><input class='filterRadio' type='radio' name='brand' id='brand_" + item.id + "' value=" + item.id + "></dd>";
                }
            });
            $("#brand").html(brandCon);
        } else {
            var brandCon = "<dt>品牌：<div id='brandChoose' class='filterChoose'>全部品牌</div></dt><dd><label class='filterLabel cur' for='brand_all'>全部品牌</label><input class='filterRadio' type='radio' name='brand' id='brand_all' value=''></dd>";
            $.each(response.filterBrandList, function (i, item) {
                brandCon += "<dd><label class='filterLabel' for='brand_" + item.id + "''>" + item.name + "(" + item.recordTotal + ")" + "</label><input class='filterRadio' type='radio' name='brand' id='brand_" + item.id + "' value=" + item.id + "></dd>";
            });
            $("#brand").html(brandCon);
        }

        if (cityId != null && cityId != "") {
            var cityCon = "<dt>城市：<div id='cityChoose' class='filterChoose'>" + cityName + "</div></dt><dd><label class='filterLabel' for='city_all'>全部城市</label><input class='filterRadio' type='radio' name='city' id='city_all' value=''></dd>";
            $.each(response.filterCityList, function (i, item) {
                if (brandId == item.id) {
                    cityCon += "<dd><label class='filterLabel cur' for='city_" + item.id + "''>" + item.name + "(" + item.recordTotal + ")" + "</label><input class='filterRadio' type='radio' name='city' id='city_" + item.id + "' value=" + item.id + "></dd>";
                } else {
                    cityCon += "<dd><label class='filterLabel' for='city_" + item.id + "''>" + item.name + "(" + item.recordTotal + ")" + "</label><input class='filterRadio' type='radio' name='city' id='city_" + item.id + "' value=" + item.id + "></dd>";
                }
            });
            $("#city").html(cityCon);
        } else {
            var cityCon = "<dt>城市：<div id='cityChoose' class='filterChoose'>全部城市</div></dt><dd><label class='filterLabel cur' for='city_all'>全部城市</label><input class='filterRadio' type='radio' name='city' id='city_all' value=''></dd>";
            $.each(response.filterCityList, function (i, item) {
                cityCon += "<dd><label class='filterLabel' for='city_" + item.id + "''>" + item.name + "(" + item.recordTotal + ")" + "</label><input class='filterRadio' type='radio' name='city' id='city_" + item.id + "' value=" + item.id + "></dd>";
            });
            $("#city").html(cityCon);
        }

        if (catalog == 4) {//如果三级分类进来，隐藏分类筛选
            $("#catalog").hide();
        } else {//如果是二级分类、一级分类、关键字进来，显示分类筛选
            if (flag) {
                var catalogCon = "<dt>分类：<div id='catalogChoose' class='filterChoose'>" + catalogName + "</div></dt><dd><label class='filterLabel' for='catalog_all'>全部分类</label><input class='filterRadio' type='radio' name='catalog' id='catalog_all' value=''></dd>";
                if (catalog == 1) {
                    catalogCon += "<dd><label class='filterLabel cur' for='catalog_" + obcid + "''>" + catalogName + ")" + "</label><input class='filterRadio' type='radio' name='catalog' id='catalog_" + obcid + "' value=" + obcid + "></dd>";
                } else if (catalog == 2) {
                    catalogCon += "<dd><label class='filterLabel cur' for='catalog_" + twbcid + "''>" + catalogName + ")" + "</label><input class='filterRadio' type='radio' name='catalog' id='catalog_" + twbcid + "' value=" + twbcid + "></dd>";
                } else if (catalog == 3) {
                    catalogCon += "<dd><label class='filterLabel cur' for='catalog_" + thrbcid + "''>" + catalogName + ")" + "</label><input class='filterRadio' type='radio' name='catalog' id='catalog_" + thrbcid + "' value=" + thrbcid + "></dd>";
                }
                $("#catalog").html(catalogCon);
            } else {
                var catalogCon = "<dt>分类：<div id='catalogChoose' class='filterChoose'>全部分类</div></dt><dd><label class='filterLabel cur' for='catalog_all'>全部分类</label><input class='filterRadio' type='radio' name='catalog' id='catalog_all' value=''></dd>";
                $.each(response.filterCatalogBaseList, function (i, item) {
                    catalogCon += "<dd><label class='filterLabel' for='catalog_" + item.id + "''>" + item.name + "(" + item.recordTotal + ")" + "</label><input class='filterRadio' type='radio' name='catalog' id='catalog_" + item.id + "' value=" + item.id + "></dd>";
                });
                $("#catalog").html(catalogCon);
            }
        }
    } else {

      var productContent = '<div class="searchNotice"><div class="searchNotice-box"><h2>搜索比较笨，让客服妹妹帮您吧~~<br>还能领取私房红包哦！~~</h2><a class="help_btn"  href="javascript:;" onclick="NTKF.im_openInPageChat(\'bf_1000_1450344131702\')"></a></div></div>';
        if (response.recommendProList && response.recommendProList.length > 0) {
            productContent += "<div id='shelves_interest' class='shelves_interest'><h2>可能帮到你</h2><ul id='pro_interest'>";
            $.each(response.recommendProList, function (index, result) {
                productContent += '<li><a class="iHref" href="prodDetail.html?prod_id=' + result.pid + '&shop_code=' + result.shopCode + '&source=internal">'
                    + '<img class="iPicture" style="width:90px; margin:0 auto; display:block; border:1px solid #efefef;" src="' + image_server + result.listSImg + '">'
                    + '<p class="iName">' + result.name + '</p>'
                    + '<p class="iPrice">￥' + result.shopPrice + '</p>'
                    + '</a></li>';
            });
            productContent += "</ul></div>";
        }
        if (response.adverInfo != null) {
            productContent += '<div id="promo_logo" class="promo_logo">'
                + '<a id="promo_logolink" href="' + response.adverInfo.link + '">'
                + '<img id="promobanner" src="' + image_server + response.adverInfo.url + '">'
                + '</a></div>';
        }
        $(".pd_list").html(productContent);
        $(".backTop").hide();
    }

    $(".filterChoose").on("click", function () {
        $(this).parent().siblings("dd").toggle();
        $(this).toggleClass("open");
    });

    $(".filterLabel").on("click", function () {
        var area = $(this).parents("dl");
        area.find(".cur").removeClass("cur");
        $(this).addClass("cur");
        var txt = $(this).text();
        area.find(".filterChoose").text(txt);
        area.find("dd").hide();
    });

    $(".filterMask").on("click", function () {
        filterHide();
    });

}

function searchPro() {
    filterHide();
    $("input[name='brand']").each(function () {
        if ($(this).is(":checked")) {
            brandId = $(this).val();
            brandName = $(this).prev().text();
        }
    });
    $("input[name='city']").each(function () {
        if ($(this).is(":checked")) {
            cityId = $(this).val();
            cityName = $(this).prev().text();
        }
    });
    if (catalog != 4) {//如果是二级分类、一级分类、关键字进来，显示分类筛选
        $("input[name='catalog']").each(function () {
            if ($(this).is(":checked")) {
                var catalogVal = $(this).val() || "";
                if (catalogVal != "") {
                    if (catalog == 3) {//二级分类进来显示三级分类筛选
                        thrbcid = $(this).val();
                    } else if (catalog == 2) {//一级分类进来显示二级分类筛选
                        twbcid = $(this).val();
                    } else if (catalog == 1) {//关键字进来显示一级分类筛选
                        obcid = $(this).val();
                    }
                    catalogName = $(this).prev().text();
                    flag = true;
                } else {//清空分类选项
                    if (catalog == 3) {//二级分类进来显示三级分类筛选
                        thrbcid = null;
                    } else if (catalog == 2) {//一级分类进来显示二级分类筛选
                        twbcid = null;
                    } else if (catalog == 1) {//关键字进来显示一级分类筛选
                        obcid = null;
                    }
                    flag = false;
                }
            }
        });
    }
    price_st = $("#price_st").val();
    price_en = $("#price_en").val();
    $(".search_hd").show();
    loadingList(1);
}

//重置
function resetSort() {
    location.href = locationHref;
}

//默认排序
function defaultSort() {
    sortType = null;
    $(".cur").removeClass("cur");
    $(".default").addClass("cur");
    $(".pd_list").html("");
    loadingList(1);
}

//销量排序
function saleSort() {
    sortType = 3;
    $(".cur").removeClass("cur");
    $(".sales").addClass("cur");
    $(".pd_list").html("");
    loadingList(1);
}

//价格排序
function priceSort() {
    if ($(".price").hasClass("sortDown")) {
        sortType = 1;//升序
        $(".price").removeClass("sortDown").addClass("sortUp");
    } else {
        sortType = 2;//奖序
        $(".price").removeClass("sortUp").addClass("sortDown");
    }
    $(".cur").removeClass("cur");
    $(".price").addClass("cur");
    $(".pd_list").html("");
    loadingList(1);
}

function filterShow() {
    $(".filterBox").css({
        "transition-property": "transform",
        "-webkit-transition-property": "-webkit-transform",
        "transition-duration": "0.6s",
        "-webkit-transition-duration": "0.6s",
        "transform": "translate(0px,0px)",
        "-webkit-transform": "translate(0px,0px)"
    })
    $(".filterMask").fadeIn(600);
    $(".wrap").css("overflow", "hidden").css("height", $(window).height());
}

function filterHide() {
    $(".filterBox").css({"transform": "translate(-100%,0px)", "-webkit-transform": "translate(-100%,0px)"});
    $(".filterMask").fadeOut(600);
    $(".wrap").css("overflow", "auto").css("height", "auto");
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