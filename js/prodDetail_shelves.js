var flag = false;
var pageNo = 1;
var pageSize = 10;

function callbackShelvesProdDetail(response) {

//  小能代码  
    
    bf_iteminfo = {
        item: {
            'id': response.pid,
            'name': response.detailPro.showName,
            'imageurl': image_server + response.mainImg,
            'url': 'http://www.800pharm.com/shop/m/prodDetail.html?prod_id=' + response.pid + '&shop_code=' + response.shopCode,
            'marketprice': response.detailPro.marketPrices,
            'siteprice': response.detailPro.salePrices,
            'customPid': ['商品编号',response.pid],
            'customShopName': ['商家名称',response.merchantRow.merchantName],
            'customSpecification': ['规格',response.detailPro.productSkuInfo.productSpec.specification]
            //  'customXXX': ['自定义属性名称','自定义属性值'],
            //  'customprice':['自定义价格名称','自定义价格值',true|false]
        }
    };

    $("#shelves_pid").val(response.pid);
    $("#shelves_shopCode").val(response.shopCode);
    $("#shelves_limitId").val(response.limitSaleId);
    //显示前置
    $("#loadingDiv").attr("style", "display:none;");
    $("#shelvesDiv").attr("style", "display:block;");
    $("#header").attr("style", "display:block;");
    $("#footer").attr("style", "display:block;");

    //商品主图
    var imageMainArray = response.mainImg.split(".");
    var imgLi = '<li class="swiper-slide"><img class="pro_picture"'
            //+' src="'+image_server + response.mainImg.replace( ("."+imageMainArray[imageMainArray.length-1]) ,"_bbfm.jpg")

        + 'src="images/loading.png"'
        + 'data-originalbak="' + image_server + response.mainImg + '"'
        + 'data-original="' + image_server + response.mainImg.replace(("." + imageMainArray[imageMainArray.length - 1]), "_bbfm.jpg") + '"'
        + '"/></li>';

    +'"/></li>';
    //商品附加图
    if (response.productAppendImg) {
        $.each(response.productAppendImg, function (index, result) {
            var imageProArray = result.simg.split(".");
            imgLi += '<li class="swiper-slide"><img class="pro_picture" style="width:200px; height:200px; margin:0 auto; display:block;" '
                + 'src="images/loading.png"'
                + 'data-originalbak="' + image_server + result.simg + '"'
                + 'data-original="' + image_server + result.simg.replace(("." + imageProArray[imageProArray.length - 1]), "_bbfm.jpg") + '"'
                + '"/></li>';
        });
    }
    //一商品基本信息
    var $shelves_info = $('<span><div class="swiper-container mpdImg" id="pdImgContainer"><ul class="pd_imgList swiper-wrapper">' + imgLi +
        '</ul><div class="swiper-pagination pdDot" id="pdDot"></div></div>' +
        '<div class="pName">' +
        '<h1>' +
        '<img class="rx" style="display:none;" src="images/pDetail/rx.png">' +
        '<img class="otc" style="display:none;" src="images/pDetail/otc.png">' +
        '<img class="crossborder" style="display:none;" src="images/pDetail/crossborder.png">' +
        '<span id="pro_name"></span>' +
        '</h1>' +
        '</div>' +
        '<dl>' +
        '<dt id="RxTips" style="display: none">本品为处方药，需凭处方购买</dt>' +
        '<dt class="price">价格：</dt>' +
        '<dd class="cl_red" id="pro_salePrices"></dd><dd id="pro_marketPrices"></dd>' +
        '<dt>编码：</dt>' +
        '<dd>'+ response.pid +'</dd>'+
        '<dt>保障：</dt>' +
        '<dd><span class="zheng">正品</span><span class="tui">7天退换</span><span class="bao">保障隐私</span></dd>' +
        '<dd class="favBox"><a class="fav" href="javascript:addShelvesFavory();">收藏</a></dd>' +
        '<dt class="zhengpinbaozheng"><span></span><span>八百方已委托中华保险为此商品承保，保证正品！</span></dt>' +
        '</dl>' +
        '<div class="sdNotice" style="display:none;">' +
        '<a id="notice-xnkf" class="notice-xnkf" href="javascript:;" onclick="NTKF.im_openInPageChat(\'bf_1000_1450344131702\')">需求提交</a>' +
        '<a id="notice-xnkf_tel" class="notice-phone" href="tel:4008855171">客服热线</a>' +
        ' </div></span>');


    //商品名称和图标
    //isChuFang;商品属性：0-非药物 1-处方药 2-非处方药
    var tmp_drug_base = response.detailPro.productSkuInfo.productSpec.productBaseInfo;
    if (tmp_drug_base.iSCHUFANG == 1) {
        $shelves_info.find(".rx").css("display", "block");
    } else if (tmp_drug_base.iSCHUFANG == 2) {
        $shelves_info.find(".otc").css("display", "block");
    } 
    if (response.detailPro.ifcrossborder == 1){
      $shelves_info.find(".crossborder").css("display", "block");
    }
    var ghStr = '';
    /* 暂时去掉GH标志。。
     if(response.detailPro.aTTRIBUTE=='GH'){
     ghStr='（广货）';
     }*/


    $shelves_info.find("#pro_name").html(ghStr + response.detailPro.showName);
    window.document.title = '上八百方网上药店买' + response.detailPro.showName;

    //价格
    $shelves_info.find("#pro_salePrices").html("￥" + response.detailPro.salePrices);
    $shelves_info.find("#pro_marketPrices").html($("<del>￥" + response.detailPro.marketPrices + "</del>"));

    //是否货到付款（原商家信息独立）
    if (response.merchantRow.cashondelivery != null && response.merchantRow.cashondelivery == 1) {
        $shelves_info.find("#pro_marketPrices").append('<span class="payAfter"><em>货到付款</em></span>');
    }

    $("#shelves_info").addClass("pd_info");
    $("#shelves_info").html($shelves_info.html());//商品图片信息赋值

    //商品图滚动设定
    var pdDot = '#pdDot';
    if ($("#pdImgContainer li").length == 1) {
        pdDot = '';
    }
    if ($("#pdImgContainer li").length) {
        var bannerSwiper = new Swiper('#pdImgContainer', {
            speed: 500,
            mode: 'horizontal',
            resistance: '100%',
            simulateTouch: 'false',
            onInit: function () {
                $(".pro_picture").show().lazyload();
                $("#pdImgContainer .pd_imgList").css("height", "200px").show();
                $("#pdImgContainer .swiper-slide").css("height", "200px");
            },
            pagination: pdDot,
            onSlideChangeStart: function (swiper) {  //轮播加入lazy load..
                $(".pro_picture").show().lazyload();
            }
        });
    }
    //以防加载不了主图问题
    $("#pdImgContainer .pd_imgList").css("height", "200px").show();
    $("#pdImgContainer .swiper-slide").css("height", "200px");

    //商家信息
    var $shop_company = $('<span>' +
        '<a class="shopCompany" id="shopCompany">' +
        '<span id="companyName"></span>' +
        '<p class="icon_star"><b style="width:' + response.zhpf * 20 + '%"></b></p>' +
        '</a>' +
        '<div class="shopContact">' +
        '<a class="xnkf" href="javascript:;" >'+
    '<img class="xnkfImges" border="0" width="40" height="30" src=""/>'+
    
    '</a>'+
        '<a class="telContact" href=""></a>' +
        
       
        
        
        '</div>' +
        '<p class="merchantTips"></p>'
    );
    $shop_company.find("#shopCompany").attr("href", "commodityList.html?shop_code=" + response.shopCode).find("#companyName").text(response.merchantRow.merchantName);
    /*暂时屏蔽商家QQ客服 暂时替换成八百方客服*/
    var shopList = ["100335", "100113", "100267", "100359", "100281", "3000", "100100", "100084", "100367", "100376", "100135", "100358"];
    if (response.merchantRow.proxyOperationId!=null) {
      
      $shop_company.find(".xnkf").attr("onclick","NTKF.im_openInPageChat('"+response.merchantRow.proxyOperationId+"')");
        $("#notice-xnkf").attr("onclick","NTKF.im_openInPageChat('"+response.merchantRow.proxyOperationId+"')");//上面补充咨询
      $shop_company.find(".xnkfImges").attr("src","images/xnkf.png");
        //商家信息--联系电话
        if (response.merchantRow.contactPhone != null && response.merchantRow.contactPhone != "") {
            $shop_company.find(".telContact").attr("href", "tel:" + response.merchantRow.contactPhone);
        }
    }
    else {
        //$shop_company.find(".qqContact").removeClass("qqContact").addClass("kefuContact").attr("href","http://chat.53kf.com/webCompany.php?arg=800pharm");
//    $shop_company.find(".qqContact").removeClass("qqContact").addClass("kefuContact").attr("href","#");
//    $shop_company.find("kefuContact").on("click",function(){
//      NTKF.im_openInPageChat('bf_1000_1450344131702');
//    });
 //        $shop_company.find(".qqContact").remove();
        $shop_company.find(".telContact").remove();
        
        $shop_company.find(".xnkf").attr("onclick","NTKF.im_openInPageChat('bf_1000_1450344131702')");
        $("#notice-xnkf").attr("onclick","NTKF.im_openInPageChat('bf_1000_1450344131702')");//上面补充咨询
        $shop_company.find(".xnkfImges").attr("src","images/xnkf.png");
        
    }
    //商家信息--温馨提示
    if (response.tips != null && response.tips != "") {
        $shop_company.find(".merchantTips").text(response.tips);
    }

    var shop_company_html = $shop_company.html();
    shop_company_html = shop_company_html + '</span>';
    $("#shop_company").addClass("shop_company");
    $("#shop_company").html(shop_company_html);//商家信息赋值

    //处方药流程提示
    if (tmp_drug_base.iSCHUFANG == 1) {
        $("#RxTips").show();
        $("#RxNotice").show();
        $("#RxProcessImg").show();
    }

    //规格
    var storage_tips = "";
    if(response.storage > 0) {
        storage_tips = "<span class='storage_tips'>库存" +response.storage + "件</span>";
    }
    else {
        storage_tips = "<span class='noStorage_tips'>无货</span>";
    }

    var $shelves_buy = $('<span><dl>' +
        '<dt>规格：</dt>' +
        '<dd class="selectBox"></dd>' +
        '<dt>数量：</dt>' +
        '<dd>' +
        '<div class="countBox">' +
        '<a href="javascript:countMinus();" class="minus">－</a>' +
        '<input class="count" value="1" maxlength="3" onKeyUp="inputLimit()" type="tel" > ' +
        '<a href="javascript:countPlus();" class="plus">＋</a>' +
        storage_tips+
        '</div>' +
        '</dd>' +
        '</dl></span>');
    if (response.productSpecList && response.productSpecList.length > 1) {
        var $template = $('<span>' +
            '<a id="selectBox" href="javascript:void(0);" class="select"></a>' +
            '<select id="itemBox" onchange="guigeChange()"></select>' +
            '</span>');
        $.each(response.productSpecList, function (index, result) {
            if (result.pid == response.pid) {
                $template.find("#itemBox").append('<option value="' + result.pid + '" selected="selected" >' + result.guige + ' (￥' + result.shopPrices + ') </option>');
            } else {
                $template.find("#itemBox").append('<option value="' + result.pid + '">' + result.guige + ' (￥' + result.shopPrices + ')</option>');
            }
        });
        $template.find("#selectBox").html($template.find("#itemBox option:selected").text());
        $shelves_buy.find(".selectBox").append($template.html());
    } else if (response.detailPro.productSkuInfo.productSpec.specification) {
        $shelves_buy.find(".selectBox").addClass("singleBox");
        $shelves_buy.find(".selectBox").append(response.detailPro.productSkuInfo.productSpec.specification);
    } else {
        $shelves_buy.find(".selectBox").addClass("singleBox");
        $shelves_buy.find(".selectBox").append("无");
    }
    $("#shelves_buy").addClass("buy");
    $("#shelves_buy").html($shelves_buy.html());
    $(".count").blur(function () {
        var v = $(this).val();
        if (v == "" || v < 1) {
            $(this).val("1");
        }
    });

    /*商家优惠信息 -- 广货/优惠券/满立减 start*/
    //(response.detailPro.aTTRIBUTE == 'GH') ||
    if ((response.cdtList.length != null && response.cdtList.length > 0) || (response.premiumall.length != null && response.premiumall.length > 0)) {
        $("#shelves_welfare").show();
        //优惠券
        if ((response.cdtList.length != null && response.cdtList.length > 0)) {
            $("#shelves_welfare #welCard").show();
            $("#cardBox").show();
            var template2 = '';
            template2 += '<ul class="getCardList">';
            $.each(response.cdtList, function (index, cdt) {
                template2 += '<li class="cardBox">' +
                    '<div class="cardDetail">' +
                    '<div class="cardCost"><span class="cost">' + cdt.cardCost + '</span>元</div>' +
                    '<div class="cardLimit">';
                if (cdt.usecondition) {
                    template2 += '订单满' + cdt.consumeamount + '元减' + cdt.cardCost + '元';
                }
                else {
                    template2 += '订单优惠' + cdt.cardCost + '元';
                }
                var lhtml = "";
                if (cdt.limitStatus == 0) {
                    lhtml = '<a href="javascript:drawCard(' + cdt.cdtId + ',\'' + cdt.usecondition + '\',' + cdt.shopCode + ',\'\',\'' + cdt.merchantName + '\',\'\')" class="drawCard">领取</a>'
                } else {
                    lhtml = '<span class="notdrawCard">已领取</a>'
                }
                template2 += '</div>' +
                    '<div class="cardDate">使用期限 ' + cdt.cardstartTimeStr.substring(0, 10).replace(/-/g, ".") + '-' + cdt.cardendTimeStr.substring(0, 10).replace(/-/g, ".") + '</div>' +
                    '</div>' + lhtml + '</li>';

            });
            $("#cardContent").append(template2);
        }
        //满立减
        if ((response.premiumall.length != null && response.premiumall.length > 0)) {
            $("#shelves_welfare #welPrem").show();
            $("#premBox").show();
            var template = '';
            $.each(response.premiumall, function (index, premium) {
                if (index < 2) {
                    template += '<p>满' + premium.ordercount + '元减' + premium.cutcount + '元</p>';
                }
            });
            $("#premContent").html(template);
        }
        //广货网上行
        //if (response.detailPro.aTTRIBUTE == 'GH') {
        //    $("#shelves_welfare #welGh").show();
        //    $("#ghBox").show();
        //}
        //活动弹窗
        $("#shelves_welfare").on("click", function () {
            $(".welList .popMask").show();
            $(".popBox").css({
                "transition-property": "transform",
                "-webkit-transition-property": "-webkit-transform",
                "transition-duration": "0.6s",
                "-webkit-transition-duration": "0.6s",
                "transform": "translate(-50%,0px)",
                "-webkit-transform": "translate(-50%,0px)"
            });
        });

        $(".popClose").on("click", function () {
            $(".welList .popMask").hide();
            $(this).parents(".popBox").css({
                "transform": "translate(-50%,100%)",
                "-webkit-transform": "translate(-50%,100%)"
            });
        });

        $(".welList .popMask").on("click", function () {
            $(this).hide();
            $(".popBox").css({"transform": "translate(-50%,100%)", "-webkit-transform": "translate(-50%,100%)"});
        });
    }
    /*商家优惠信息 end*/

    //药品说明书
    var tmp_drug_base = response.detailPro.productSkuInfo.productSpec.productBaseInfo;
    if (tmp_drug_base.iSCHUFANG == 1 || tmp_drug_base.iSCHUFANG == 2) {
        $("#baseInfoDiv").show();
        var $shelves_baseInfo = $('<span><h2><p>药品说明书</p></h2>' +
            '<div class="infoTable">' +
            '<table>' +
            '<tbody id="pro_baseInfo"></tbody>' +
            '</table>' +
            '<div class="stamp"></div>' +
            '</div>' +
            '<div class="toggleUpDown" id="iconUpDown">' +
            '<p></p>' +
            '<div class="iconDown"></div>' +
            '</div></span>');

        $shelves_baseInfo.find("#pro_baseInfo").html('<tr><td width="25%">药品名称：</td><td width="75%" id="nAME"></td></tr>');
        if (tmp_drug_base.nAME) {
            $shelves_baseInfo.find("#nAME").html(tmp_drug_base.nAME);
        }
        if (tmp_drug_base.pRONAME) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>通用名称：</td><td>" + tmp_drug_base.pRONAME + "</td></tr>");
        }
        if (tmp_drug_base.pZWH) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>批准文号：</td><td>" + tmp_drug_base.pZWH + "</td></tr>");
        }
        if (response.detailPro.productSkuInfo.productSpec.specification) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>规格：</td><td>" + response.detailPro.productSkuInfo.productSpec.specification + "</td></tr>");
        }
        if (tmp_drug_base.eNAME) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>英文名/拼音：</td><td>" + tmp_drug_base.eNAME + "</td></tr>");
        }
        if (tmp_drug_base.hXMC) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>化学名：</td><td>" + tmp_drug_base.hXMC + "</td></tr>");
        }
        if (tmp_drug_base.standard_code) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>药品本位码：</td><td>" + tmp_drug_base.standard_code + "</td></tr>");
        }
        if (tmp_drug_base.cOMPANY) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>生产厂商：</td><td>" + tmp_drug_base.manufacturer.name + "</td></tr>");
        }
        if (tmp_drug_base.aDDRESS) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>生产厂商地址：</td><td>" + tmp_drug_base.aDDRESS + "</td></tr>");
        }
        if (tmp_drug_base.brand.name) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>品牌：</td><td>" + tmp_drug_base.brand.name + "</td></tr>");
        }
        if (tmp_drug_base.iSCHUFANG == 1) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>药品属性：</td><td>处方药</td></tr>");
        }
        if (tmp_drug_base.iSCHUFANG == 2) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>药品属性：</td><td>非处方药</td></tr>");
        }
        if (tmp_drug_base.xZH) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>性状：</td><td>" + tmp_drug_base.xZH + "</td></tr>");
        }
        if (tmp_drug_base.jIXING) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>剂型：</td><td>" + tmp_drug_base.jIXING + "</td></tr>");
        }
        if (tmp_drug_base.cUNCANG) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>储藏：</td><td>" + tmp_drug_base.cUNCANG + "</td></tr>");
        }
        if (response.detailPro.productSkuInfo.unit) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>商品单位：</td><td>" + response.detailPro.productSkuInfo.unit + "</td></tr>");
        }
        if (tmp_drug_base.iSJINKOU) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>是否进口：</td><td>" + tmp_drug_base.iSJINKOU + "</td></tr>");
        }
        if (tmp_drug_base.yOUXIAOQI) {
            $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>有效期：</td><td>" + tmp_drug_base.yOUXIAOQI + "</td></tr>");
        }

        if (tmp_drug_base.cbType != 3) {
            if (tmp_drug_base.zHYCHF) {
                $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>主要成份：</td><td>" + tmp_drug_base.zHYCHF + "</td></tr>");
            }
            if (tmp_drug_base.gNZHZH) {
                $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>功能主治：</td><td>" + tmp_drug_base.gNZHZH + "</td></tr>");
            }
            if (tmp_drug_base.yLYF) {
                $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>用法用量：</td><td>" + tmp_drug_base.yLYF + "</td></tr>");
            }
            if (tmp_drug_base.yLZY) {
                $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>药理作用：</td><td>" + tmp_drug_base.yLZY + "</td></tr>");
            }
            if (tmp_drug_base.bLFY) {
                $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>不良反应：</td><td>" + tmp_drug_base.bLFY + "</td></tr>");
            }
            if (tmp_drug_base.zHYSHX) {
                $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>注意事项：</td><td>" + tmp_drug_base.zHYSHX + "</td></tr>");
            }
            if (tmp_drug_base.jINJI) {
                $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>禁忌：</td><td>" + tmp_drug_base.jINJI + "</td></tr>");
            }
            if (tmp_drug_base.yWXHZY) {
                $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>药物相互作用：</td><td>" + tmp_drug_base.yWXHZY + "</td></tr>");
            }
            if (tmp_drug_base.yLDL) {
                $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>药理毒理：</td><td>" + tmp_drug_base.yLDL + "</td></tr>");
            }
            if (tmp_drug_base.sHYRQ) {
                $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>适用人群：</td><td>" + tmp_drug_base.sHYRQ + "</td></tr>");
            }
            if (tmp_drug_base.sHPBZH) {
                $shelves_baseInfo.find("#pro_baseInfo").append("<tr><td>备注说明：</td><td>" + tmp_drug_base.sHPBZH + "</td></tr>");
            }
        }
        $("#shelves_baseInfo").addClass("pd_baseInfo");
        $("#shelves_baseInfo").html($shelves_baseInfo.html());//药品说明书赋值
    }

    //感兴趣的商品
    if (response.productInfoList.length > 0) {
        var $shelves_interest = $('<span><h2>可能帮到你</h2><ul id="pro_interest"></ul></span>');
        var pro_interest = "";
        $.each(response.productInfoList, function (index, result) {
            var $interest = $('<span><li><a class="iHref" href="#">' +
                '<img class="iPicture" style_external="width:90px; margin:0 auto; display:block; border:1px solid #efefef;" width="90" height="90" src="images/loading.png">' +
                '<p class="iName"></p>' +
                '<p class="iPrice"></p>' +
                '</a></li></span>');
            var imageNameArray="";
            if(result.showImg != null && result.showImg != ""){
              imageNameArray = result.showImg.split(".");
              $interest.find(".iPicture").attr("data-original", image_server + result.showImg.replace(("." + imageNameArray[imageNameArray.length - 1]), "_bbfm.jpg"));
                $interest.find(".iPicture").attr("data-originalbak", image_server + result.showImg);
            }else{
              imageNameArray = result.listSImg.split(".");
              $interest.find(".iPicture").attr("data-original", image_server + result.listSImg.replace(("." + imageNameArray[imageNameArray.length - 1]), "_bbfm.jpg"));
                $interest.find(".iPicture").attr("data-originalbak", image_server + result.listSImg);
            }
            
            if(result.show_name != null && result.show_name != ""){
               $interest.find(".iName").append(result.show_name);
            }
            else if (result.selfDefinitionName != null && result.selfDefinitionName != "") {
                $interest.find(".iName").append(result.selfDefinitionName);
            } else {
                $interest.find(".iName").append(result.name);
            }
            $interest.find(".iPrice").append("￥" + FormatNumber(result.shopPrices, 2));
            $interest.find(".iHref").attr("href", "prodDetail.html?prod_id=" + result.pID + "&shop_code=" + result.sHOP_CODE + "&source=internal");
            pro_interest += $interest.html();
        });
        $shelves_interest.find("#pro_interest").html(pro_interest);
        $("#shelves_interest").addClass("shelves_interest");
        $("#shelves_interest").html($shelves_interest.html());//感兴趣的商品赋值
    }

    //立即购买、购物车按钮显示
    //修改于2015-12-04 处方药为立即预订 Start
    var $shelves_fixedMenuBox = $('<span><div class="buttonSet">' +
        '<a href="javascript:autoLogin(' + "'buyNow'" + '); " class="buyBtn">立即购买</a>' +
        '<a href="javascript:autoLogin(' + "'addCart'" + '); " class="cartBtn">加入购物车</a>' +
        '<a href="javascript:gotoCart(); " class="goCart"></a>' +
        '</div></span>');
    if(response.storage == 0){
      var $shelves_fixedMenuBox = $('<span><div class="buttonSet">' +
              '<a href="javascript:void(0)" class="buyBtn noStorage_btn">立即购买</a>' +
              '<a href="javascript:void(0)" class="cartBtn noStorage_btn">加入购物车</a>' +
              '<a href="javascript:gotoCart(); " class="goCart"></a>' +
              '</div></span>');
    }

    if (response.buttonState && (response.buttonState == 'book_now_rx.jsp' )) {
        $shelves_fixedMenuBox = $('<span><div class="buttonSet">' +
            '<a href="javascript:autoLogin(' + "'buyNow'" + '); " class="buyBtn">提交需求</a>' +
            '<a href="javascript:autoLogin(' + "'addCart'" + '); " class="cartBtn">加入购物车</a>' +
            '<a href="javascript:gotoCart(); " class="goCart"></a>' +
            '</div></span>');
        if(response.storage == 0){
          $shelves_fixedMenuBox = $('<span><div class="buttonSet">' +
                '<a href="javascript:void(0)" class="buyBtn noStorage_btn">提交需求</a>' +
                '<a href="javascript:void(0)" class="cartBtn noStorage_btn">加入购物车</a>' +
                '<a href="javascript:gotoCart(); " class="goCart"></a>' +
                '</div></span>');
        }
    }
    //修改于2015-12-04 处方药为立即预订 End

    $("#shelves_fixedMenuBox").addClass("fixedMenuBox");
    $("#shelves_fixedMenuBox").html($shelves_fixedMenuBox.html());//感兴趣的商品赋值

    //套餐
    if (response.packageModelList != null) {
        if (response.packageModelList.length > 0) {
            //添加套餐标题
            if (response.packageModelList[0].description != "") {
                var $shelves_package = $('<span><a class="comboBtn" href="javascript:comboShow();">套餐：<span>' +
                    response.packageModelList[0].description
                    + '</span></a></span>');
            }
            else {
                var $shelves_package = $('<span><a class="comboBtn" href="javascript:comboShow();">优惠套餐搭配</a></span>');
            }
            $("#shelves_package").addClass("shelves_package");
            $("#shelves_package").html($shelves_package.html());

            //套餐内容添加
            var package_concat = ""
            var $shelves_package_list = $('<span><div id="packageComboBox" class="comboBox">' +
                '</div><div class="comboBS" onClick="comboHide()"></div></span>');
            //套餐商品列表第一个(商品自身,隐藏已选中)
            var $package_list_myself = $('<span><div class="comboTit">优惠套餐搭配</div><div class="comboClose" onclick="comboHide()">×</div><div class="comboMain">' +
                '<img class="comboPdImg" src="images/loading.png" style_external="width: 72px; height: 71px; padding-left: 10px; float: left;"/>' +
                '<div class="comboPdDetail"><p class="comboPdName">' +
                response.packageModelList[0].packProductList[0].productInfo.productSkuInfo.productSpec.productBaseInfo.nAME
                + '</p><p class="comboPdGuige">' +
                response.packageModelList[0].packProductList[0].productInfo.productSkuInfo.productSpec.specification
                + '</p><p class="comboPdPrice">' +
                response.packageModelList[0].packProductList[0].packagePrices
                + '</p></div>' +
                '<input class="checkBoxIpt" type="checkbox" checked="checked" id="packageBox0" name="packageBox" style="display:none"/><div class="comboDesp">搭配</div></div></span>');
            if (response.packageModelList[0].packProductList[0].productInfo.imgType == 1) {
                $package_list_myself.find(".comboPdImg").attr("src", image_server + response.packageModelList[0].packProductList[0].productInfo.img_s);
            } else {
                $package_list_myself.find(".comboPdImg").attr("src", image_server + response.packageModelList[0].packProductList[0].productInfo.productSkuInfo.mainImg);
            }
            $package_list_myself.find("#packageBox0").attr("value",
                response.shopCode + "_" + response.packageModelList[0].packProductList[0].productInfo.pID + "_" +
                response.packageModelList[0].packProductList[0].productInfo.shopPrices + "_" +
                response.packageModelList[0].packProductList[0].packagePrices);
            //拼接部分3-1
            package_concat += $package_list_myself.html()
            //$shelves_package_list.find("#packageComboBox").html($package_list_myself.html());
            //$("#shelves_package_list").html($shelves_package_list.html());
            //循环套餐商品列表(第一个商品不计入循环,已在上边输出)
            var $package_list_product = $('<span><div class="comboListBox swiper-container" id="comboListBox"><ul class="comboList swiper-wrapper"></ul></div></span>');
            var package_list_product_str = "";
            var packProductListCount = response.packageModelList[0].packProductList.length;
            for (var i = 1; i < packProductListCount; i++) {
                var $package_list_product_li = $('<span><li class="swiper-slide"><label class="comboListLabel" for="packageBox' + i + '"><img class="comboListImg" src="images/loading.png"/></label>' +
                    '<a class="comboListDetail iHref" href="#"><p class="comboPdName">' +
                    response.packageModelList[0].packProductList[i].productInfo.productSkuInfo.productSpec.productBaseInfo.nAME
                    + '</p><p class="comboPdGuige">' +
                    response.packageModelList[0].packProductList[i].productInfo.productSkuInfo.productSpec.specification
                    + '</p><p class="comboPdPrice">' +
                    response.packageModelList[0].packProductList[i].packagePrices
                    + '<del>/￥' +
                    response.packageModelList[0].packProductList[i].productInfo.shopPrices
                    + '</del></p></a><label for="packageBox' + i + '" class="chooseBox"><input class="checkBoxIpt" type="checkbox" id="packageBox' + i + '" name="packageBox" value="' +
                    response.shopCode + "_" + response.packageModelList[0].packProductList[i].productInfo.pID + "_" +
                    response.packageModelList[0].packProductList[i].productInfo.shopPrices + "_" +
                    response.packageModelList[0].packProductList[i].packagePrices
                    + '" onclick="packageCheck()"/></label></li></span>');
                $package_list_product_li.find(".iHref").attr("href", "prodDetail.html?prod_id=" + response.packageModelList[0].packProductList[i].product_id + "&shop_code=" + response.shopCode + "&source=internal");
                if (response.packageModelList[0].packProductList[i].productInfo.imgType == 1) {
                    $package_list_product_li.find(".comboListImg").attr("src", image_server + response.packageModelList[0].packProductList[i].productInfo.img_s);
                } else {
                    $package_list_product_li.find(".comboListImg").attr("src", image_server + response.packageModelList[0].packProductList[i].productInfo.productSkuInfo.mainImg);
                }
                package_list_product_str += $package_list_product_li.html();
            }
            $package_list_product.find(".comboList").html(package_list_product_str);
            //拼接部分3-2
            package_concat += $package_list_product.html();
            //套餐购物车部分
            $package_list_pay = $('<span><div class="comboAmount"><span class="totalPackagePrices" id="totalPackagePrices">共:￥' +
                response.packageModelList[0].packProductList[0].packagePrices
                + '</span><span class="totalSavePrices">节省￥<span id="totalSavePrices">' +
                FormatNumber(response.packageModelList[0].packProductList[0].productInfo.shopPrices - response.packageModelList[0].packProductList[0].packagePrices, 2)
                + '</span></span>'
                + '<input type="hidden" id="packageId" value="' + response.packageModelList[0].id + '" />'
                    //+'<a class="comboBuy" href="javascript:autoLogin(' + "'buyNowPackage'" + '); ">立即购买</a>'
                + '<a class="comboCart" href="javascript:autoLogin(' + "'addCartPackage'" + '); ">加入购物车</a></div></span>');
            //拼接部分3-3
            package_concat += $package_list_pay.html();
            //赋值
            $shelves_package_list.find("#packageComboBox").html(package_concat);
            $("#shelves_package_list").html($shelves_package_list.html());

            //套餐列表swiper化
            var comboL = $("#comboListBox li").length;
            if (comboL) {
                var bannerSwiper = new Swiper('#comboListBox', {
                    mode: 'horizontal',
                    slidesPerView: 'auto',
                    simulateTouch: 'false'
                });
            }
            //选择效果
            $(".checkBoxIpt").on("change", function () {
                $(this).parent(".chooseBox").toggleClass("cur");
            });
        }
    }

    //商品信息导航
    if (response.detailPro.productSkuInfo.dETAIL_DESC || tmp_drug_base.iSCHUFANG == 1 || tmp_drug_base.iSCHUFANG == 2) {

        //图文详情
        if (response.detailPro.productSkuInfo.dETAIL_DESC) {
            $("#proDetailDiv").show();
            //加载图文详情
            $("#shelves_proDetail").append('<h2 class="descTit">图文详情</h2>' + response.detailPro.productSkuInfo.dETAIL_DESC);
            $("#shelves_proDetail").find("*").attr("style", "").removeAttr("width");
            //处理图片
            $("#shelves_proDetail").find("img").each(function (index) {
                hadleImagInDesc($(this));
            });
            $("[type='image']").each(function (index) {
                hadleImagInDesc($(this));
            });
        }
    }

    //三商品评论
    var pro_comtList = "";
    if (response.proEvaluate.items.length > 0) {
        $("#commentDiv").html("评论 (" + response.proEvaluate.recordTotal + ")").removeClass("noIcon");
        $("#commentDiv").on("click", function () {
            $(".comtList").css({
                "transition-property": "transform",
                "-webkit-transition-property": "-webkit-transform",
                "transition-duration": "0.6s",
                "-webkit-transition-duration": "0.6s",
                "transform": "translate(0px,0px)",
                "-webkit-transform": "translate(0px,0px)"
            });
            $(".comtMask").show();
        });
        $(".comtMask").on("click", function () {
            $(".comtList").css({"transform": "translate(-100%,0px)", "-webkit-transform": "translate(-100%,0px)"});
            $(this).hide();
        });
        $.each(response.proEvaluate.items, function (index, result) {
            var $comtList = $('<span><li>' +
                '<p class="comtContent"></p>' +
                '<span class="comtId"></span>' +
                '<span class="comtTime"></span>' +
                '<p class="comtAppend" style="display:none;" id="' + result.pid + "_" + result.id + '_div">追评：<span class="appendContent" id="' + result.pid + "_" + result.id + '"></span></p>' +
                '</li></span>');
            $comtList.find(".comtContent").append(result.reviews);
            $comtList.find(".comtId").append(result.subAuthor);
            $comtList.find(".comtTime").append(result.subReviewsDate);

            var additional = result.additional || "";
            if (additional != "") {
                $comtList.find("#" + result.pid + "_" + result.id).html(additional);
                $comtList.find("#" + result.pid + "_" + result.id + "_div").show();
            }
            pro_comtList += $comtList.html();
        });
        $(".comtBox").html(pro_comtList);
        $("#comment_more").show();
        $("#comment_more").html("查看更多评论");
        $("#comment_more").attr("href", "javascript:searchMore(); ");
    }
    else {
        $("#commentDiv").html("暂时没有评论");
    }

    commonMethod();

    //如果是试点模式，不要规格信息和漂浮导航并且在商品主图那块最后加多一个DIV
    if (response.buttonState && (response.buttonState == 'lock_up.jsp' || response.buttonState == 'online_consultant.jsp' || response.buttonState == 'advice_product.jsp')) {
        $(".sdNotice").show();
        $("#shelves_buy").hide();
        $("#shelves_fixedMenuBox").hide();
    }
 //20160216 屏蔽处方药，药购买按钮改为 在线咨询但仍然可以购买     new add
    if (response.buttonState && (response.buttonState == 'buy_now_otc.jsp' )) {
      $("#notice-xnkf").attr("onclick","");
      $("#notice-xnkf").html("下一步");
      $("#notice-xnkf").click(function () {
        autoLogin('buyNow');
        });
        $("#notice-xnkf_tel").click(function () {
        autoLogin('buyNow');
        });
     //   $("#notice-xnkf_tel").hide();
        $(".sdNotice").show();
        $("#shelves_buy").hide();
        $("#shelves_fixedMenuBox").hide();
        
    }
 //20160216 屏蔽处方药，药购买按钮改为 在线咨询但仍然可以购买     end
    $table = $("#shelves_baseInfo");
    var h = $table.find(".infoTable").height();
    $table.find(".infoTable").css("height", "125px");
    //计算高度后，默认隐藏
    $table.hide();
    $table.find("#iconUpDown").click(function () {
        var c = $(this).find("div").attr("class");
        if (c == "iconDown") {
            $table.find(".infoTable").animate({height: h});
            $(this).find("div").attr("class", "iconUp");
            $("body,html").animate({scrollTop: $table.offset().top}, 500);
        }
        else {
            $table.find(".infoTable").animate({height: "125px"});
            $(this).find("div").attr("class", "iconDown");
            $("body,html").animate({scrollTop: $table.offset().top}, 500);
        }
    });

    $("#pro_picture").show().lazyload();//加载主图
    $(".iPicture").show().lazyload();//加载感兴趣图片
    $(".desc_img_lazy").show().lazyload({threshold: 300});//加载图文详情图片
    $(".comboPdImg").show().lazyload();//加载套餐商品图片
}

function countMinus() {
    var count = Number($(".count").val());
    if (count > 1) {
        count = count - 1;
        $(".count").val(count);
    }
}

function inputLimit() {
    var count = $(".count").val();
    count = count.replace(/[^\d]/g, "");
    $(".count").val(count);
}

function countPlus() {
    var count = Number($(".count").val());
    if (count >= 0) {
        count = count + 1;
        $(".count").val(count);
    }
}

function guigeChange() {
    prod_id = $("#itemBox option:selected").val();
    $("#header").attr("style", "display:none;");
    $("#footer").attr("style", "display:none;");
    $("#shelvesDiv").attr("style", "display:none;");

    $("#loadingDiv").attr("style", "display:block;");

    var url_str = "/shop/nm_product-" + shop_code + "-" + prod_id + ".html?source=" + source + "&t=" + new Date().getTime();
    asnyTask(url_str, null, callbackProdDetail);
}

//处理图片
function hadleImagInDesc(element) {
    element.removeAttr("width");
    element.removeAttr("height");
    var oldImg = element.attr("src") || "";
    var partern = /800pharm|^\//i;
    element.attr("src", "images/loading.png");
    element.attr("class", "desc_img_lazy");
    element.attr("style_external", "width:100%; margin:0 auto; float:left;");
    if (oldImg != "" && oldImg.match(partern)) {
        var imgNameArray = oldImg.split(".");
        var rpStr = "." + imgNameArray[(imgNameArray.length - 1)];
        var temimgname = oldImg.replace(rpStr, "");
        element.attr("data-original", temimgname + "_bbfm.jpg");
        element.attr("data-originalbak", oldImg);
    } else {
        element.attr("data-original", oldImg);
    }
}

//显示更多评论
function searchMore() {
    $("#comment_more").html("加载中，请稍候...");
    $("#comment_more").attr("href", "javascript:void(0);");
    flag = true;
    pageNo += 1;
    var url_str = '/shop/getOrderReview.html';
    var dataObj = {pageNo: pageNo, pageSize: pageSize, pid: $("#shelves_pid").val()};
    asnyTask(url_str, dataObj, callbackOrderReview);
}

function callbackOrderReview(response) {
    var pro_comtList = "";
    if (response.proEvaluate.items.length > 0) {
        $.each(response.proEvaluate.items, function (index, result) {
            var $comtList = $('<span><li>' +
                '<p class="comtContent"></p>' +
                '<span class="comtId"></span>' +
                '<span class="comtTime"></span>' +
                '<p class="comtAppend" style="display:none;" id="' + result.pid + "_" + result.id + '_div">追评：<span class="appendContent" id="' + result.pid + "_" + result.id + '"></span></p>' +
                '</li></span>');
            $comtList.find(".comtContent").append(result.reviews);
            $comtList.find(".comtId").append(result.subAuthor);
            $comtList.find(".comtTime").append(result.subReviewsDate);
            var additional = result.additional || "";
            if (additional != "") {
                $comtList.find("#" + result.pid + "_" + result.id).html(additional);
                $comtList.find("#" + result.pid + "_" + result.id + "_div").show();
            }
            pro_comtList += $comtList.html();
        });
        if (flag) {
            $(".comtBox").append(pro_comtList);
        } else {
            $(".comtBox").html(pro_comtList);
        }
        $("#comment_more").html("查看更多评论");
        $("#comment_more").attr("href", "javascript:searchMore(); ");
    } else {
        if (response.proEvaluate.recordTotal == 0) {
            $("#comment_more").html("暂时没有评论");
            $("#comment_more").attr("href", "javascript:void(0);");
        } else {
            $("#comment_more").html("很抱歉，暂时没有了");
            $("#comment_more").attr("href", "javascript:void(0);");
        }
    }
}

//收藏商品
function addShelvesFavory() {
    var urlStr = "/shop/m_bbfHome/m_addFavory.html?t=" + new Date().getTime();
    var dataStr = {shopCode: $("#shelves_shopCode").val(), pid: $("#shelves_pid").val()};
    asnyTask(urlStr, dataStr, callBackAddShelvesFavory);
}

function callBackAddShelvesFavory(response) {
    if (response == 0) {//未登录
        TempCache.itemUpdate("bcakHref", document.location.href);
        location.href = "memberLogin.html";
    } else if (response == 1 || response == 4) {//已收藏或收藏成功
        $('#shelves_toast').html("收藏成功");
        showShelvesToast();
    } else {//收藏失败
        $('#shelves_toast').html("收藏失败");
        showShelvesToast();
    }
}

//先判断是否自动登陆，如果登陆状态需把购物车写入数据库
var loginType = "";
function autoLogin(type) {
    loginType = type;

    var username = TempCache.getItem("login_username") || "";
    if (username != "") {//判断后台是否有登陆记录
        var url_str = "/shop/member/isLogin_m.html?t=" + new Date().getTime();
        asnyTask(url_str, null, callbackLoginLoading);
    } else {
        callBackLogin();
    }
}

function callbackLoginLoading(response) {
    if (response.rt_code == "-1") {//如果后台没登陆记录，则自动登陆
        var username = TempCache.getItem("login_username") || "";
        var password = TempCache.getItem("login_password") || "";
        if (username != "" && password != "") {
            var loginUrl = "/shop/member/mobileCheckLogin_m.html?t=" + new Date().getTime();
            var data_obj = {"account": decrypt(username), "pwd": decrypt(password), "status": ""};
            asnyTask(loginUrl, data_obj, callBackLogin);
        } else {//如果后台有登陆记录
            callBackLogin();
        }
    } else {
        callBackLogin();
    }
}

function callBackLogin() {
    var shopCode = $("#shelves_shopCode").val();
    var pid = $("#shelves_pid").val();
    var q = $(".count").val();
    var colorId = "0";
    var sizeId = "0";
    var guyou_number = "0";
    var limitId = $("#shelves_limitId").val(); //抢购活动ID
    var adminId = "0";
    var adminAccount = "";
    var isBack = "0";
    var dictCount = "0";
    if (loginType == 'buyNow') {//立即购买
        var buyCheck_url = "/shop/carts_m/buyNowCheck_m.html?t=" + new Date().getTime();
        $.getJSON(buyCheck_url, {
                pid: pid,
                shop_code: shopCode,
                quantity: q,
                type: 0,
                skin_color_id: colorId,
                size_id: sizeId,
                productCode: guyou_number,
                limitId: limitId,
                adminId: adminId,
                adminAccount: adminAccount,
                isBack: isBack
            },
            function (data) {
                //0库存充足，1库存不足，2商品已下架
                if (data.status == 0) {
                    if (data.buyNowStatus == 0) {
                        location.href = "myCart.html";
                    } else {
                        $('#shelves_toast').html("很抱歉，购买失败，请重新购买");
                    }
                } else if (data.status == 1) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了商品库存");
                } else if (data.status == 2) {
                    $('#shelves_toast').html("抱歉，该商品已过期，请看看其他同类商品");
                    showShelvesToastAndReload();
                    return;
                } else if (data.status == 3) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了限时抢购的剩余商品数量");
                } else if (data.status == 4) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了限时抢购的每人限购数量");
                } else if (data.status == 5) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了商品的限购数量");
                } else if (data.status == 6) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了折扣商品的每人限购数量");
                }
                showShelvesToast();
            }
        );
    } else if (loginType == 'addCart') {//加入购物车
        var url = "/shop/carts_m/addCart_m.html?t=" + new Date().getTime();
        $.getJSON(
            url, {
                pid: pid,
                shop_code: shopCode,
                quantity: q,
                type: 0,
                skin_color_id: colorId,
                size_id: sizeId,
                productCode: guyou_number,
                limitId: limitId,
                adminId: adminId,
                adminAccount: adminAccount,
                isBack: isBack
            },
            function (data) {
                if (data.status == 0) {//0库存充足，1库存不足
                    $('#shelves_toast').html("加入购物车成功");
                } else if (data.status == 1) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了商品库存");
                } else if (data.status == 2) {//商品已下架
                    $('#shelves_toast').html("抱歉，该商品已过期，请看看其他同类商品");
                    showShelvesToastAndReload();
                    return;
                } else if (data.status == 3) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了限时抢购的剩余商品数量");
                } else if (data.status == 4) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了限时抢购的每人限购数量");
                } else if (data.status == 5) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了商品的限购数量");
                } else if (data.status == 6) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了折扣商品的每人限购数量");
                }
                showShelvesToast();
            }
        );
    } else if (loginType == 'buyNowPackage') {//套餐立即购买
        var packageCount = jQuery("[name=packageBox]:checkbox:checked").length;
        if (packageCount < 2) {
            alert("请选择组合套餐商品");
            return false;
        } else {
            //组合套餐选中pids
            var pids = packagePids();
            var url = "/shop/carts_m/buyCheckPackage_m.html?t=" + new Date().getTime();
            $.getJSON(url, {
                pids: pids,
                packageId: $("#packageId").val(),
                quantity: 1
            }, function (data) {
                comboHide();
                //0库存充足，1库存不足，2商品已下架
                if (data.status == 0) {
                    if (data.buyNowStatus == 0) {
                        location.href = "myCart.html";
                    } else {
                        $('#shelves_toast').html("很抱歉，购买失败，请重新购买");
                    }
                } else if (data.status == 1) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了商品库存");
                } else if (data.status == 2) {//商品已下架
                    $('#shelves_toast').html("抱歉，该商品已过期，请看看其他同类商品");
                } else if (data.status == 3) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了限时抢购的剩余商品数量");
                } else if (data.status == 4) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了限时抢购的每人限购数量");
                } else if (data.status == 5) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了商品的限购数量");
                } else if (data.status == 6) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了折扣商品的每人限购数量");
                } else if (data.status == 7) {
                    $('#shelves_toast').html("很抱歉，您购买的套餐活动已经终止");
                }
                showShelvesToastAndReload();
                //window.location.reload();
            });
        }
    } else if (loginType == 'addCartPackage') {//套餐加入购物车
        var packageCount = jQuery("[name=packageBox]:checkbox:checked").length;
        if (packageCount < 2) {
            alert("请选择组合套餐商品");
            return false;
        } else {
            //组合套餐选中pids
            var pids = packagePids();
            var url = "/shop/carts_m/add2CartPackage_m.html?t=" + new Date().getTime();
            $.getJSON(url, {
                pids: pids,
                packageId: $("#packageId").val(),
                quantity: 1
            }, function (data) {
                comboHide();
                if (data.status == 0) {//0库存充足，1库存不足
                    $('#shelves_toast').html("加入购物车成功");
                } else if (data.status == 1) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了商品库存");
                } else if (data.status == 2) {//商品已下架
                    $('#shelves_toast').html("抱歉，该商品已过期，请看看其他同类商品");
                } else if (data.status == 3) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了限时抢购的剩余商品数量");
                } else if (data.status == 4) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了限时抢购的每人限购数量");
                } else if (data.status == 5) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了商品的限购数量");
                } else if (data.status == 6) {
                    $('#shelves_toast').html("很抱歉，您购买数量超过了折扣商品的每人限购数量");
                } else if (data.status == 7) {
                    $('#shelves_toast').html("很抱歉，您购买的套餐活动已经终止");
                }
                showShelvesToastAndReload();
                //window.location.reload();
            });
        }
    }
}

function gotoCart() {
    location.href = "myCart.html";
}

function showShelvesToast() {
    $("#shelves_toast").css("z-index", 20).fadeIn(300);
    $('#shelves_toast').delay(3000).hide(0);
}
function showShelvesToastAndReload() {
    $("#shelves_toast").css("z-index", 20).fadeIn(300);
    $('#shelves_toast').delay(4000).hide(0);
    setTimeout(function () {
        location.reload();
    }, 3000)
}

function comboShow() {
    $(".comboBox").css({
        "transition-property": "transform",
        "-webkit-transition-property": "-webkit-transform",
        "transition-duration": "0.6s",
        "-webkit-transition-duration": "0.6s",
        "transform": "translate(-50%,0px)",
        "-webkit-transform": "translate(-50%,0px)"
    });
    $(".comboBS").show();
}

function comboHide() {
    $(".comboBox").css({"transform": "translate(-50%,100%)", "-webkit-transform": "translate(-50%,100%)"});
    $(".comboBS").hide();
}

//选中套餐,改变价格显示,优化价钱
function packageCheck() {
    var totalPackagePrices = 0;
    var totalShopPrices = 0;
    $("[name=packageBox]:checkbox:checked").each(function () {
        var tmp_value = $.trim(jQuery(this).val());
        var tmp_array = tmp_value.split("_");
        //格式顺序:shopCode_pid_shopPrices_packagePrices
        totalPackagePrices = totalPackagePrices * 1 + tmp_array[3] * 1;
        totalShopPrices = totalShopPrices * 1 + tmp_array[2] * 1;
    })
    $("#totalPackagePrices").html("共:￥" + totalPackagePrices.toFixed(2));
    $("#totalSavePrices").html((totalShopPrices * 1 - totalPackagePrices * 1).toFixed(2));
    //$("#totalPrices").html((totalPackagePrices * $.trim(jQuery("#packageQuantity").val())).toFixed(2));
}

function packagePids() {
    var str = "";
    jQuery("[name=packageBox]:checkbox:checked").each(function () {
        var tmp_value = jQuery.trim(jQuery(this).val());
        var tmp_array = tmp_value.split("_");
        str += tmp_array[1] + "_" + tmp_array[0] + ",";
    });
    var pids = str.substring(0, str.length - 1);
    return pids;
}

//获取优惠券
function drawCard(cardId, usecondition, shopCode, productList, merchantName, productName) {
    jQuery.ajax({
        url: "/shop/m_bbfHome/drawCard.html", //数据请求页面的url
        type: "get", //数据传递方式(get或post)
        timeout: 10000, //设置时间延迟请求的时间
        data: {cdtId: cardId},
        dataType: "json",
        success: function (data) {//当请求成功时触发函数
            if (data.success == 0) {
                alert("领取成功！");
                window.location.reload();
            } else if (data.success == 1) {
                TempCache.itemUpdate("bcakHref", document.location.href);
                window.location = "memberLogin.html";
            } else if (data.success == 6) {
                alert("对不起，该优惠券指定的商品已经下架，暂不能领取!");
                window.location.reload();
            } else if (data.success == 2) {
                alert("优惠券活动已中止");
                window.location.reload();
            } else if (data.success == 3) {
                alert("优惠券活动已领完");
                window.location.reload();
            } else if (data.success == 4) {
                alert("优惠券活动已过期");
                window.location.reload();
            } else if (data.success == 5) {
                alert("领取次数已用完");
                window.location.reload();
            }
        }, error: function (data) {//当请求失败时触发的函数

        }
    });
}

//obj表示锚点的ID
function animateScroll(obj) {
    $("#" + obj).show();
    var scroll_offset = $("#" + obj).offset(); //得到pos这个div层的offset，包含两个值，top和left
    $("body,html").animate({
        scrollTop: scroll_offset.top - 5 //让body的scrollTop等于pos的top，就实现了滚动
    }, 500);
}