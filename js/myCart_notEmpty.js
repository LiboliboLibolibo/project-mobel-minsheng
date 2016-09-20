var bf_iteminfo={};
function callbackNotEmptyCart(response) {
  
  var $cart_header=$('<span><div class="allChoose"><input type="checkbox" value="checkAll" name="checkAll" checked="checked" /></div>您的购物车中有<span class="cl_red" id="productTotal">0</span>件商品<a class="keepShopping" href="index.html">继续购物</a><a class="cDelete" href="javascript:delProBatch()"></a></span>');

  
  if (response.mutilShopCart.shopCartList.length > 0) {
    bf_iteminfo.cartprice=response.mutilShopCart.allTotalToString;
    bf_iteminfo.items=new Array();
    
    $cart_header.find("#productTotal").html(response.productCount);
    var template="";
    $.each(response.mutilShopCart.shopCartList,function(index,result){
        template+='<li id="shopCode_'+result.shopCode+'"><dl class="cart_list"><dt class="cart_hd"><div class="merChoose">';
        if(result.selectStatus=='1'){
              template+='<input type="checkbox" checked="checked" value="shop"  name="checkbox" shopCode="'+result.shopCode+'" class="shopCheckAll"/>';
        }else{
              template+='<input type="checkbox" value="shop"  name="checkbox" shopCode="'+result.shopCode+'" class="shopCheckAll"/>';
        }
        template+='</div><a href="commodityList.html?shop_code='+result.shopCode+'&source=internal">'+result.merchantName+'</a></dt>';
      /*购物车商家优惠信息 start*/
      if((result.ordercount != null && result.ordercount > 0)||(result.cdtList.length != null && result.cdtList.length > 0)){
        template+='<dd class="shopWelfare">';
        if(result.ordercount != null && result.ordercount > 0) {
          template+='<div class="fullDiscount"><span class="icon_discount">满减</span><ul class="discountList">';
          $.each(result.premium,function(index,prem){
            template+='<li class="discountItem">满<span>' + prem.ordercount + '</span>元减<span>'+ prem.cutcount + '</span>元</li>';
          });
          template+='</ul></div>';
        }
        if(result.cdtList.length != null && result.cdtList.length > 0) {
          template+='<div class="cardDiscount"><span class="icon_discount">店铺优惠券</span><ul class="cardList">';
          $.each(result.cdtList,function(index,cdt){
            if(cdt.usecondition){
              template+='<li class="cardItem">'+cdt.consumeamount+'减'+ cdt.cardCost+'</li>';
            }
            else{
              template+='<li class="cardItem cardNoLimit">立减'+ cdt.cardCost +'</li>';
            }
          });
          template+='</ul>';
          template+='<div class="popMask"></div>';
          template+='<div class="popBox">'+
                    '<div class="popTitle">'+
                      '<div class="popTit">领取优惠券</div>'+
                    '<div class="getCardShop">'+ result.merchantName +'</div>'+
                    '<div class="popClose">×</div>'+
                  '</div>'+
                  '<div class="popContent">'+
                      '<ul class="getCardList">';
          $.each(result.cdtList,function(index,cdt){
            template+='<li class="cardBox">'+
                    '<div class="cardDetail">'+
                      '<div class="cardCost"><span class="cost">'+ cdt.cardCost +'</span>元</div>'+
                      '<div class="cardLimit">';
                      if(cdt.usecondition){
                        template+='订单满'+ cdt.consumeamount +'元减'+ cdt.cardCost +'元';
                      }
                      else{
                        template+='订单优惠'+ cdt.cardCost +'元';
                      }
                      var lhtml = "";
                      if(cdt.limitStatus == 0) {
                        lhtml = '<a href="javascript:drawCard('+ cdt.cdtId +',\''+ cdt.usecondition +'\','+ cdt.shopCode +',\'\',\''+ cdt.merchantName+'\',\'\')" class="drawCard">领取</a>'
                      }else {
                        lhtml = '<span class="notdrawCard">已领取</a>'
                      }
                      template+='</div>'+
                      '<div class="cardDate">使用期限 '+ cdt.cardstartTimeStr.substring(0,10).replace(/-/g,".") +'-'+ cdt.cardendTimeStr.substring(0,10).replace(/-/g,".") +'</div>'+
                    '</div>'+ lhtml + '</li>';
                      
          });
          template+='</ul>'+
                      '<div class="popAlert">注：优惠券可以和红包同时使用！</div>'+
                  '</div>'+
                '</div>';
          template+='</div>';
        }
        template+='</dd>';
      }
      /*购物车商家优惠信息 end*/
        $.each(result.shopCartRecords,function(index,shopCart){ 
            if(shopCart.combinationId==null||shopCart.combinationId==''){
                var line=shopCart.cartRecordList[0];
                var imageNameArray=line.product.imgSmall.split(".");
                template+='<dd id="'+line.product.pid+"_"+index+'"><div class="pdChoose">';
                if(line.selectStatus=='1'){
                    template+='<input type="checkbox" checked="checked" name="checkbox" class="checkbox_'+result.shopCode+'" cname="checkbox_'+result.shopCode+'" value="p_'+line.product.pid+'_'+result.shopCode+'" pids="'+shopCart.pids+'"/>';
                }else{
                    template+='<input type="checkbox" name="checkbox" class="checkbox_'+result.shopCode+'" cname="checkbox_'+result.shopCode+'" value="p_'+line.product.pid+'_'+result.shopCode+'" pids="'+shopCart.pids+'"/>';
                }
                template+='</div><a class="imgA" href="prodDetail.html?prod_id='+line.product.pid+'&shop_code='+line.product.shopCode+'&source=internal">'+
                  '<img class="pro_img" width="48" height="48" style_external="width:48px; height:48px; border:1px solid #cccccc; " src="images/loading.png" data-originalbak="'+image_server + line.product.imgSmall+'"'+
                  'data-original="'+image_server + line.product.imgSmall.replace( ("."+imageNameArray[imageNameArray.length-1]) ,"_bbfm.jpg")+'"/></a>'+
                    '<div class="cDetail">'+
                        '<a href="prodDetail.html?prod_id='+line.product.pid+'&shop_code='+line.product.shopCode+'" class="cName">'+line.product.showName+'</a>';
                       if(line.product.drugBase.guige!=null) template+='<p class="comboPdGuige">规格:<span class="cl_grey">'+line.product.drugBase.guige+'</span></p>';
                        template+='<div class="cCount">'+
                          '<div class="countBox">'+
                              '<a class="minus" href="javascript:modCheckQuantity(0,'+line.product.pid+',null,'+line.skinColorId+','+line.sizeId+','+line.product.shopCode+','+index+','+line.type+')">－</a>'+
                                '<input type="text" class="count" value="'+line.quantity+'" id="'+line.product.pid+'_num_'+index+'" maxlength="3" onKeyUp="inputLimit(0,'+line.product.pid+',null,'+line.skinColorId+','+line.sizeId+','+line.product.shopCode+','+index+','+line.type+')"/>'+
                                '<a class="plus" href="javascript:modCheckQuantity(1,'+line.product.pid+',null,'+line.skinColorId+','+line.sizeId+','+line.product.shopCode+','+index+','+line.type+')">+</a>'+
                            '</div>'+
                            '<span id="p_'+line.product.pid+'_'+index+'_total" class="cPrice">￥'+line.amountToString+'</span>';
                           if(line.product.storage==0){
                             template+='<p class="cart_noStorage_tips">无货'+'</p>'+'</div>'+'</div></dd>';
                             }else{
                               template+='<p class="cart_storage_tips">库存'+line.product.storage+'件</p>'+'</div>'+'</div></dd>';
                             }
                           /* '<p>库存'+line.product.storage+'</p>'+
                        '</div>'+
                    '</div></dd>';*/
                    
            }else{
                template+='<dd><div class="pdChoose">';
                if(shopCart.selectStatus=='1'){
                    template+='<input type="checkbox" checked="checked" name="checkbox" cname="checkbox_'+result.shopCode+'"  class="checkbox_'+result.shopCode+'" value="g_'+shopCart.combinationId+'_'+result.shopCode+'" pids="'+shopCart.pids+'"/>';
                }else{
                    template+='<input type="checkbox" name="checkbox" cname="checkbox_'+result.shopCode+'"  class="checkbox_'+result.shopCode+'"  value="g_'+line.combinationId+'_'+result.shopCode+'" pids="'+shopCart.pids+'" />';
                }
                template+='</div>'+
            '<div class="cDetail comboDetail">'+
              '<p>'+shopCart.packageName+'</p>'+
              '<div class="cCount comboCount">'+
                '<div class="countBox">'+
                  '<a class="minus" href="javascript:modCheckQuantityPackage(\'0\','+shopCart.combinationId+',\''+shopCart.pids+'\',\'/shop/\','+result.shopCode+','+index+')">－</a>'+
                  '<input type="text" class="count" value="'+shopCart.packageCount+'" id="combination_'+shopCart.combinationId+'_num_'+index+'" maxlength="3" onKeyUp="modCheckQuantityPackage(\'3\','+shopCart.combinationId+',\''+shopCart.pids+'\',\'/shop/\','+result.shopCode+','+index+')"/>'+
                  '<a class="plus" href="javascript:modCheckQuantityPackage(\'1\','+shopCart.combinationId+',\''+shopCart.pids+'\',\'/shop/\','+result.shopCode+','+index+')">+</a>'+
                '</div>'+
              '</div>'+
            '</div>';
                $.each(shopCart.cartRecordList,function(index,line){ 
                var item={}; 
      //item.id=result.product.pid;
      item.count=line.quantity;
      item.name=line.product.showName;
      item.imageurl=image_server + line.product.imgSmall;
      item.url='http://www.800pharm.com/shop/m/prodDetail.html?prod_id='+line.product.pid+'&shop_code='+line.shopCode;
      item.siteprice=line.product.shopPrices;
      bf_iteminfo.items.push(item);
                var imageNameArray=line.product.imgSmall.split(".");
                template+='<div class="comboPd">'+
              '<a class="imgA" href="prodDetail.html?prod_id='+line.product.pid+'&shop_code='+line.product.shopCode+'&source=internal">'+
              '<img class="pro_img" width="48" height="48" style_external="width:48px; height:48px; border:1px solid #cccccc; " src="images/loading.png" data-originalbak="'+image_server + line.product.imgSmall+'"'+
              'data-original="'+image_server + line.product.imgSmall.replace( ("."+imageNameArray[imageNameArray.length-1]) ,"_bbfm.jpg")+'"/></a>'+
              '<div class="cDetail">'+
                '<a href="prodDetail.html?prod_id='+line.product.pid+'&shop_code='+line.product.shopCode+'" class="cName">'+line.product.showName+'</a>';
              if(line.product.drugBase.guige!=null)template+='<p class="comboPdGuige">规格:<span class="cl_grey">'+line.product.drugBase.guige+'</span></p>';
              template+='<p class="comboPdCount" id="cp_'+line.combinationId+'_'+line.pid+'_num">数量:'+line.quantity+'</p>'+
              '<p class="comboPdPrice">总价:<span class="cl_red" id="cp_'+line.combinationId+'_'+line.pid+'_total">￥'+line.amountToString+'</span></p>'+
            '</div></div>'
                });
                template+='</div></dd>';
                
            }
        });
        template+='</dl><p class="cart_ft">总计：<span class="price" id="'+result.shopCode+'_sumPrices">￥'+result.total+'</span></span></p></li>';  
    });
  
    $("#cart_header").addClass("cart_header");
    $("#cart_header").html($cart_header.html());
    $("#fixedCartHead").addClass("fixedCartHead").addClass("cart_header");
    $("#fixedCartHead").html($cart_header.html());
    $("#info_more").hide();
    $("#cartList").addClass("cartList");
    $("#cartList").html(template);
    
    $(".count").blur(function(){
      var v = $(this).val();
      if(v == "" || v < 1){
        $(this).val("1"); 
      }
    });
    $("input[name='checkAll']").click(function(){
          var checked=true;
            if(!$(this).is(":checked")) checked=false;
            var selectStatus="0";  
          if(checked){
            selectStatus="1";
            $("input[name='checkbox']").prop("checked",true);
          }else{
            $("input[name='checkbox']").removeAttr("checked");
          }
      jQuery("input[name='checkAll']").prop("checked",checked);  
          var pids="";
          var arrChk=$("input[name='checkbox']");
          $(arrChk).each(function(){
             if($(this).val()!=null&&$(this).val()!='on'&&$(this).val()!='shop'){
                pids=pids+","+$(this).val(); 
             }
      });
          changeSelectCartCart('/shop/',pids,'0','0',0,selectStatus);   
        });
        
        $(".shopCheckAll").click(function(){
          var shopCode=$(this).attr("shopCode");
          var checked=true;
          if(!$(this).is(":checked")) checked=false;
          if(checked){
          $("input[cname='checkbox_"+shopCode+"']").prop("checked",true);
      }else{
          $("input[cname='checkbox_"+shopCode+"']").removeAttr("checked");
      }  
        });
        
        $("input[name='checkbox']").click(function(){
          var checked=true;
          if(!$(this).is(":checked")) checked=false;
      var checkType = jQuery(this).attr("class");
      //若勾选的是商品的checkbox
      if(checkType != "shopCheckAll"){
        var shop_code = $(this).attr("cname").replace("checkbox_","");
        var shopCheck = $(".shopCheckAll[shopCode=" + shop_code + "]");
        var pdCheck = $("input[cname='checkbox_"+shop_code+"']");
      }
          var selectStatus="0";  
          if(checked){
        selectStatus="1";
        //若勾选的商品checkbox，且同商家没有没勾选的，选择店家
        if((checkType != "shopCheckAll") && (pdCheck.not(":checked").length == 0)){
          shopCheck.prop("checked",checked);
        }
        //如果所有商家都没有没勾选的，全选
        if($(".shopCheckAll").not(":checked").length == 0){
          $("input[name='checkAll']").prop("checked",checked);
        }
      }
      else{
        //若勾选的商品checkbox，该所属商家去掉勾选
        if(checkType != "shopCheckAll"){
          shopCheck.prop("checked",checked);
        }
        //全选去掉勾选
        $("input[name='checkAll']").prop("checked",checked);
      }
          var baseURL=$(this).attr("cdn_url");
          var pids="";
          if($(this).val()=='shop'){
             var shopCode=$(this).attr("shopCode");
             var arrChk=$("input[cname='checkbox_"+shopCode+"']");
             $(arrChk).each(function(){
             if($(this).val()!=null&&$(this).val()!='on'&&$(this).val()!='shop'){
                pids=pids+","+$(this).val(); 
             }
          }); 
          }else{
             pids=$(this).val();
          }
          changeSelectCartCart('/shop/',pids,'0','0',0,selectStatus);
        });
    
    jQuery(".fullDiscount").on("click",function(){
      jQuery(this).parent().toggleClass("shopWelfareAuto");
    });
    
    jQuery(".cardList").on("click",function(){
      jQuery(".popMask").show();
      jQuery(".popBox").css("transition-property","transform").css("-webkit-transition-property","-webkit-transform").css("transition-duration","0s").css("-webkit-transition-duration","0s").css("transform","translate(-50%,390px)").css("-webkit-transform","translate(-50%,390px)")
      jQuery(this).siblings(".popBox").css("transition-property","transform").css("-webkit-transition-property","-webkit-transform").css("transition-duration","0.6s").css("-webkit-transition-duration","0.6s").css("transform","translate(-50%,0px)").css("-webkit-transform","translate(-50%,0px)");
    });
    
    jQuery(".popClose").on("click",function(){
      jQuery(".popMask").hide();
      jQuery(this).parents(".popBox").css("transform","translate(-50%,390px)").css("-webkit-transform","translate(-50%,390px)");
    });
    
    jQuery(".popMask").on("click",function(){
      jQuery(this).hide();
      jQuery(".popBox").css("transform","translate(-50%,390px)").css("-webkit-transform","translate(-50%,390px)");
    });

   }
  
  var $fixedCartMenu=$('<span><div class="settleBox">'+
                  '<p>合计:<span class="total"></span>(未含邮费)</p>'+
                    '<a class="settleBtn" id="buy_btn" href="javascript:orderConfirm();">结算</a>'+
                    '</div></span>');
  $fixedCartMenu.find(".total").html("￥" + response.mutilShopCart.allTotalToString);
  $("#fixedCartMenu").addClass("fixedCartMenu");
  $("#fixedCartMenu").html($fixedCartMenu.html());

  $(window).scroll(function(){
    var st = $(window).scrollTop();
    if(st>50){
      $("#fixedCartHead").show(); 
    }
    else{
      $("#fixedCartHead").hide(); 
    }
  });
  
  $("#header").load("mobileHeader.html?v=3.2",function(){$(".hd_tit").text("购物车");});
  
  $("#loadingDiv").attr("style","display:none;");
  $("#notEmptyDiv").attr("style","display:block;");
  
  $(".pro_img").show().lazyload();//加载商品图片
}

function changeSelectCartCart(baseURL,pids,skinColorId,sizeId,type,selectStatus) {
    var url = baseURL + "carts/changeSelectCart.html?t="+new Date().getTime() ;
    $.getJSON(url,{pids:pids,selectStatus:selectStatus,skinColorId:skinColorId,sizeId:sizeId,type:type},function(data){
        $(".total").text("￥"+data.allTotal) ;
        var allTotal=eval(data.allTotal||0);
        if(allTotal==null||allTotal<=0){
            $('#buy_btn').attr('class','settleBtnGray');
            $('#buy_btn').attr('href','javascript:void(0)');
        }else{
            $('#buy_btn').attr('class','settleBtn');
            $('#buy_btn').attr('href','javascript:orderConfirm();');
        }
    });
}
//批量删除
function delProBatch() {
    var pids="";
  var arrChk=$("input[name='checkbox']");
    $(arrChk).each(function(){
       if($(this).is(":checked")&&$(this).val()!=null&&$(this).val()!='on'&&$(this).val()!='shop'){
          pids=pids+","+$(this).val(); 
       }
    }); 
    if(pids==""){
       alert("请选择需删除的商品");
       return;
    }
  if (delBatch()){
    var url = "/shop/" + "carts/deleteCartBatch.html?t="+new Date().getTime() ;
      $.getJSON(url,{pids:pids},function(data){
        location.reload();
    });
  }
}

function delBatch(){
  if (confirm("确定从购物车中删除选中商品?")){
    return(true);
  }else{
    return(false);
  }
}

//结算操作
function orderConfirm(){
  var username = TempCache.getItem("login_username")||"";
  if(username != "") {
    var url_str="/shop/member/isLogin_m.html?t="+new Date().getTime();
      asnyTask(url_str ,null,callbackNotEmptyLoading);
  }else{
      
    TempCache.itemUpdate("bcakHref",document.location.href);
        location.href="memberLogin.html";
  }
}

function callbackFilterOrderInfoMainByAlive(response){
    if(response.notAliveProduct=='yes'){
        buildNoAlivePageView('yes',response.notAliveProductList)
    }else{
        location.href="orderConfirm.html";
    }
}

function callbackFilterOrderInfoMain(response){
    if(response.packageOutDate=='yes'){
        //$('#notEmptyDiv').hide();
        //$('#emptyDiv').hide();
        //$("#packageAlert").text("您的购物车中的套餐("+response.packageNames+")已经终止。请删除后再进行提交。");
    //$('#packageAlertWin').show();
    alert("您的购物车中的套餐("+response.packageNames+")已经终止。请删除后再进行提交。");
    location.reload();
    }else if(response.outOfStock=='yes'){
        //$('#notEmptyDiv').hide();
        //$('#emptyDiv').hide();
        //$("#packageAlert").text("您的购物车中的套餐("+response.packageNames+")库存不足。请到购物车重新选择再进行提交。");
    //$('#packageAlertWin').show();
    alert("您的购物车中的套餐("+response.packageNames+")库存不足或已经下架。请到购物车重新选择再进行提交。");
    location.reload();
    }else if(response.outOfStockProduct=='yes'){
    alert("您的购物车中库存不足或已经下架。请到购物车重新选择再进行提交。");
    location.reload();
    }else if(response.notAliveProduct=='yes'){
        buildNoAlivePageView('yes',response.notAliveProductList)
    }else{
        location.href="orderConfirm.html";
    }
}

function callbackNotEmptyLoading(response){
  if (response.rt_code == "-1") {//如果后台没登陆记录，则自动登陆
    var username = TempCache.getItem("login_username")||"";
    var password = TempCache.getItem("login_password")||"";
    if(username != "" && password!="") {
      var loginUrl = "/shop/member/mobileCheckLogin_m.html?t="+new Date().getTime();
      var data_obj={"account": decrypt(username) ,"pwd": decrypt(password) ,"status" :""};
      asnyTask(loginUrl ,data_obj,callBackNotEmptyLogin);
    }else{//如果后台有登陆记录，则直接购买或加入购物车
      location.href="memberLogin.html";
    }
  } else if(response.rt_code == "1"){
       var  url_str = "/shop/order/filterOrderInfoMain_m.html?t="+new Date().getTime();
         $.ajax({
          url : url_str,
          contenttype : "application/json;charset=utf-8",
          dataType : "json",
          success : callbackFilterOrderInfoMain,
          timeout : Global_requestTimeOut,
          error : errorHandler
        });
    
  } 
}

function goonOrder(){
  var  url_str = "/shop/order/filterOrderInfoMain_m.html?t="+new Date().getTime();
     $.ajax({
      url : url_str,
      contenttype : "application/json;charset=utf-8",
      dataType : "json",
      success : callbackFilterOrderInfoMain,
      timeout : Global_requestTimeOut,
      error : errorHandler
    });
}

//结算前判断是否登陆，如果未登陆则跳转到登陆页面
function callBackNotEmptyLogin(response) {
  if (response.login_result == "0" || response.login_result == "2" || response.login_result == "1") {// 登录成功
    //location.href="orderConfirm.html";
    var  url_str = serverUrl + "/shop/order/filterOrderInfoMainByAlive_m.html?t="+new Date().getTime()+"&selPids="+tempSelProducts ;
         $.ajax({
          url : url_str,
          contenttype : "application/json;charset=utf-8",
          dataType : "json",
          success : callbackFilterOrderInfoMain,
          timeout : Global_requestTimeOut,
          error : errorHandler
        });
  } else {
    location.href="memberLogin.html";
  }
}

function modCheckQuantity(flag,pid,baseURL,skinColorId,sizeId,shopCode,recordIndex,type){
  
  //减少数量
  var num = $("#"+pid+"_num_"+recordIndex).val();
  if(flag==0){
    if(num<=1){
      return false;
    }else{
      num--;
    }
  }
  
    //增加数量
  if(flag==1){
    num++;
  }
  
  //修改数量
  if(flag==3){
    num = $("#"+pid+"_num_"+recordIndex).val();
    if(num<1){
      num=1;
    }
  }
    
  var url = "/shop/carts_m/modCartCheck_m.html?t="+new Date().getTime();  
  $.getJSON(url,{pid:pid,quantity:num,shop_code:shopCode,type:type},function(data){
    if(data==0 || data==2){
        modQuantity(flag,pid,baseURL,skinColorId,sizeId,shopCode,recordIndex,type);
    }else if(data==1){
      alert("很抱歉，您购买数量超过了商品库存！") ;
    }else if(data==3){
      alert("很抱歉，您购买数量超过了限时抢购的剩余商品数量！") ;
    }else if(data==4){
      alert("很抱歉，您购买数量超过了限时抢购的每人限购数量！") ;
    }else if(data==5){
      alert("很抱歉，您购买数量超过了商品的限购数量！") ;
    }else if(data==6){
      alert("很抱歉，您购买数量超过了折扣商品的每人限购数量！") ;
    }
  });
}

function modCheckQuantityPackage(flag,combinationId,pids,baseURL,shopCode,recordIndex){
  
  //减少数量
  var num = $("#combination_"+combinationId+"_num_"+recordIndex).val();
  if(flag==0){
    if(num<=1){
      return false;
    }else{
      num--;
    }
  }
  
    //增加数量
  if(flag==1){
    num++;
  }
  
  //修改数量
  if(flag==3){
    num = $("#combination_"+combinationId+"_num_"+recordIndex).val();
    if(num<1){
      num=1;
    }
  }
    
  var url = "/shop/carts/modCartCheckBatch.html?t="+new Date().getTime();   
  $.getJSON(url,{pids:pids,quantity:num,shopCode:shopCode},function(data){
    if(data==0 || data==2){
        modQuantityPackage(flag,combinationId,pids,baseURL,shopCode,recordIndex);
    }else if(data==3){
      alert("很抱歉，您购买数量超过了限时抢购的剩余商品数量！") ;
    }else if(data==4){
      alert("很抱歉，您购买数量超过了限时抢购的每人限购数量！") ;
    }else if(data==5){
      alert("很抱歉，您购买数量超过了商品的限购数量！") ;
    }else if(data==6){
      alert("很抱歉，您购买数量超过了折扣商品的每人限购数量！") ;
    }else {
        alert("很抱歉，您购买数量超过库存数量！") ;
    }
  });
}

function modQuantity(flag,pid,baseURL,skinColorId,sizeId,shopCode,recordIndex,type) {

  //减少数量
  if(flag==0){
    var num = $("#"+pid+"_num_"+recordIndex).val();
    if(num<=1){
      return false;
    }else{
      num--;
      $("#"+pid+"_num_"+recordIndex).val(num);
      getProductList(pid,baseURL,skinColorId,sizeId,shopCode,num,recordIndex,type);
    }
  }
  
  //增加数量
  if(flag ==1){
    var num = $("#"+pid+"_num_"+recordIndex).val();
    num++;
    $("#"+pid+"_num_"+recordIndex).val(num);
    getProductList(pid,baseURL,skinColorId,sizeId,shopCode,num,recordIndex,type);
  }
    
  //修改数量
  if(flag ==3){
    var num = $("#"+pid+"_num_"+recordIndex).val();
    if(num<1){
      num =1;
      $("#"+pid+"_num_"+recordIndex).val(num);
    }
    getProductList(pid,baseURL,skinColorId,sizeId,shopCode,num,recordIndex,type);
  }
  
}


function modQuantityPackage(flag,combinationId,pids,baseURL,shopCode,recordIndex) {

  //减少数量
  if(flag==0){
    var num = $("#combination_"+combinationId+"_num_"+recordIndex).val();
    if(num<=1){
      return false;
    }else{
      num--;
      $("#combination_"+combinationId+"_num_"+recordIndex).val(num);
      getProductListPackage(combinationId,pids,baseURL,shopCode,recordIndex,num);
    }
  }
  
  //增加数量
  if(flag ==1){
    var num = $("#combination_"+combinationId+"_num_"+recordIndex).val();
    num++;
    $("#combination_"+combinationId+"_num_"+recordIndex).val(num);
    getProductListPackage(combinationId,pids,baseURL,shopCode,recordIndex,num);
  }
    
  //修改数量
  if(flag ==3){
    var num = $("#combination_"+combinationId+"_num_"+recordIndex).val();
    if(num<1){
      num =1;
      $("#combination_"+combinationId+"_num_"+recordIndex).val(num);
    }
    getProductListPackage(combinationId,pids,baseURL,shopCode,recordIndex,num);
  }
  
}

function getProductList(pid,baseURL,skinColorId,sizeId,shopCode,num,recordIndex,type) {
  var url = "/shop/carts_m/modCart_m.html?t="+new Date().getTime() ;
  $.getJSON(url,{productId:pid,quantity:num,skinColorId:skinColorId,sizeId:sizeId,shopCode:shopCode,type:type},function(data){
      $("#p_"+pid+'_'+recordIndex+"_total").html('￥'+data.amount) ;
    $("#"+shopCode+"_sumPrices").html("￥"+data.total);
    $(".total").html("￥"+data.allTotal) ;
  });
}

function getProductListPackage(combinationId,pids,baseURL,shopCode,recordIndex,num) {
  var url = "/shop/carts_m/modCartPackage_m.html?t="+new Date().getTime() ;
  $.getJSON(url,{combinationId:combinationId,quantity:num,shopCode:shopCode},function(data){
    //$("#"+shopCode+"_sumPrices").html("￥"+data.total);
    $(".total").html("￥"+data.allTotal) ;
    $("#"+shopCode+"_sumPrices").html("￥"+data.total);
    if(data.changeList!=null&&data.changeList.length>0){
          $.each(data.changeList,function(index,cartRecord){ 
               //cp_${shopCardRecord.combinationId}_${cardRecord.product.pid}_num
               $('#cp_'+cartRecord.combinationId+'_'+cartRecord.pid+'_num').html(num);
               $('#cp_'+cartRecord.combinationId+'_'+cartRecord.pid+'_total').html(cartRecord.amountToString);
          });
      }
  });
}

//删除商品
function delPro(pid,baseURL,skinColorId,sizeId,shopCode,recordIndex,type) {
  if (confirm("是否确认删除该商品？")){
    var url = "/shop/carts_m/deleteCart_m.html?t="+new Date().getTime() ;
      $.getJSON(url,{pid:pid,skin_color_id:skinColorId,size_id:sizeId,shop_code:shopCode,type:type},function(data){
      if(data.hasProduct>0){
        $("#productTotal").html(data.productCount);
        $("#"+pid+"_"+recordIndex).hide() ;
        $("#"+shopCode+"_sumPrices").html("￥"+data.total);
        $(".total").html("￥"+data.allTotal);
        if (data.shopHidden == '0') {
          $("#shopCode_"+shopCode).hide();
        }
        //判断页面是否还能滚动
        if (document.documentElement.scrollHeight <= document.documentElement.clientHeight){
          $("#fixedCartHead").hide(); 
        }
      }else{
        location.href="myCart.html";
        }
    });
  }
}

function inputLimit(flag,pid,baseURL,skinColorId,sizeId,shopCode,recordIndex,type){
  var num = $("#"+pid+"_num_"+recordIndex).val()||"";
  num=num.replace(/[^\d]/g,"")
  $("#"+pid+"_num_"+recordIndex).val(num);
  getProductList(pid,baseURL,skinColorId,sizeId,shopCode,num,recordIndex,type);
}

function buildNoAlivePageView(notAliveAll,notAliveProductList){
     //set login_grid_my_cart also
     if(notAliveAll=="yes"){
            $('#notEmptyDiv').hide();
            $('#emptyDiv').hide();
            $('#noaliveDiv').show();
      //$('#noAliveSubmit').hide();
      //$('#noAliveClose').show();
   }else{
          location.reload();
      //$('#noAliveSubmit').show();
      //$('#noAliveClose').hide();
   }
   $("#noalive_list").empty();
     var markup="";
     $.each(notAliveProductList,function(index,result){
      var $template = $('<div><li><div style="font-size:14px;white-space:normal;" class="name"></div><div style="font-size:14px;white-space:normal; " class="prod_price"></div><div style="font-size:14px;white-space:normal; " class="shop_name"></div></li></div>');
      $template.find(".name").append("商品名称："+result.product.showName);
      $template.find(".prod_price").append("商品价格："+"&#65509;" + FormatNumber(result.product.shopPrices,2));
      $template.find(".shop_name").append("商家名称："+result.product.merchantName);
      
      markup += $template.html();
    });
    $('#noalive_list').append(markup);
}

//获取优惠券
function drawCard(cardId,usecondition,shopCode,productList,merchantName,productName){
  jQuery.ajax({ url: "/shop/m_bbfHome/drawCard.html", //数据请求页面的url  
     type:"get", //数据传递方式(get或post)  
     timeout:10000, //设置时间延迟请求的时间  
     data:{cdtId:cardId},
     dataType:"json",
     success:function(data){//当请求成功时触发函数  
      if(data.success==0){
        alert("领取成功！");
        window.location.reload();
       }else if(data.success==1){
        TempCache.itemUpdate("bcakHref",document.location.href);
        window.location="memberLogin.html";
       }else if(data.success==6){
          alert("对不起，该优惠券指定的商品已经下架，暂不能领取!");
        window.location.reload();
       }else if(data.success==2){
        alert("优惠券活动已中止");
        window.location.reload();
       }else if(data.success==3){
        alert("优惠券活动已领完");
        window.location.reload();
       }else if(data.success==4){
        alert("优惠券活动已过期");
        window.location.reload();
       }else if(data.success==5){
        alert("领取次数已用完");
        window.location.reload();
       }
     }, error:function(data){//当请求失败时触发的函数
        
     }  
  });
}