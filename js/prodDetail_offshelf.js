//新增下架B页。。用于分析看不同页面，用户的行为走向。。
function callbackOffshelfProdDetail(response) {

  $("#offshelf_pid").val(response.pid);
    $("#offshelf_shopCode").val(response.shopCode);
    
  var $offshelf_info=$( '<span><ul class="sameList quehuo">'+
                      '<li class="samePd"><div class="pd_picBox">'+
          '<img id="pro_picture" style_external="width:70px; height:70px; border:1px solid #cccccc; " width="70" height="70" src="images/loading.png"><span class="pd_quehuo">商品售罄</span></div>'+
           
         ' <div class="pd_detail">'+
                                  '<h3 id="prod_name" class="pro_name"></h3>'+
                                  '<span class="iPrice"></span><img class="wxfollow" id="wxfollow" src="images/pDetail/wximg.png">'+
                              '</div>'+
                    '<p class="clear"/><div class="offshelfBtn"><a class="b_link b_offshel" id="btn_apply" >登记补货</a>  <a class="b_link b_offshel" id="btn_enter">进入店铺</a>  </div>'+
                      '</li>'+
                  '</ul>'+
                  
                  '<div class="offshelf" style="display:none; ">该商品已下架</div></span>');
                  
    //商品主图                        
  var imageNameArray=response.mainImg.split(".");
  $offshelf_info.find("#pro_picture").attr("data-original", image_server + response.mainImg.replace( ("."+imageNameArray[imageNameArray.length-1]) ,"_bbfm.jpg") );
  $offshelf_info.find("#pro_picture").attr("data-originalbak",image_server + response.mainImg);
  $offshelf_info.find("#btn_enter").attr("href","http://www.800pharm.com/shop/m/commodityList.html?shop_code="+response.detailPro.sHOP_CODE);
  
  //商品名称和图标
  
   // $offshelf_info.find("#pro_name").html(response.detailPro.showName);
   $offshelf_info.find(".pro_name").html(response.detailPro.showName);
    window.document.title = '上八百方网上药店买'+response.detailPro.showName;
    //价格
    $offshelf_info.find(".iPrice").html("￥"+response.detailPro.salePrices);
   // $offshelf_info.find("#pro_marketPrices").html($("<del>￥"+response.detailPro.marketPrices+"</del>"));
    
  //$("#offshelf_info").addClass("pd_info");
  $("#offshelf_info").html($offshelf_info.html());//商品图片信息赋值
  $("#wxfollow").on("click",function(){
    $(".mask_b").show();
    if(wxBrowser){
      $("#wxguanzhuToast").show();
    }
    else{
      $("#guanzhuToast").show();
    }
  });
  $(".btnKnow, .btniKnow").on("click",function(){
    $(this).parents(".offshelfToast").hide();
    $(".mask_b").hide();
  });
  $("#btn_apply").click(qiugou);
    //商品供应商家
    if(response.otherShelvesList.length >0){
      //如果有同类商品。隐藏求购按钮。。
        $("#btn_apply").remove();
        
      var $offshelf_otherSame=$('<span><div class="promo_logo" id="promo_logo" ><a id="promo_logolink"><img id="promobanner" src="images/loading.png" style="display:block; margin:0 auto;" /></a></div><div class="sameListTit"><div class="same_tag">同类商品</div><a class="viewMoreQue" id="viewMore" "href="#" style="float:right" >更多 >></a></div><ul class="sameList"></ul></span>');
      var pro_otherSame="";
    $.each(response.otherShelvesList,function(index,result){
      if(index<2)//只显示2个
      {
        var $otherSame=$('<span><li><a class="samePd" href="#">'+
                                '<div class="pd_picBox">'+
                                    '<img class="pd_pic" style_external="width:70px; height:70px; border:1px solid #cccccc; " width="70" height="70" src="images/loading.png">'+
                                    '<p class="cl_red"></p>'+
                                '</div>'+
                                '<div class="pd_detail">'+
                                    '<h3 class="pro_name"></h3>'+
                                    '<p class="pd_standard">规<b></b>格：<span class="pro_standard"></span></p>'+
                                    '<p class="pd_producer">生<i></i>产<i></i>商：<span class="pro_producer"></span></p>'+
                                    '<p class="pd_merchant">药<b></b>房：<span class="pro_merchant"></span></p>'+
                                '</div>'+
                            '</a></li></span>');
        var imageNameArray=result.listSImg.split(".");
        $otherSame.find(".pd_pic").attr("data-original", image_server + result.listSImg.replace( ("."+imageNameArray[imageNameArray.length-1]) ,"_bbfm.jpg") );
        $otherSame.find(".pd_pic").attr("data-originalbak",image_server + result.listSImg);
        if(result.selfDefinitionName!=null&&result.selfDefinitionName!=""){
          $otherSame.find(".pro_name").append(result.selfDefinitionName);
        }else{
          $otherSame.find(".pro_name").append(result.name);
        }
        $otherSame.find(".pro_standard").append(result.guige);
        $otherSame.find(".pro_producer").append(result.company);
        $otherSame.find(".pro_merchant").append(result.merchantName);
        $otherSame.find(".pd_picBox .cl_red").append("￥"+FormatNumber(result.shopPrice,2));
        $otherSame.find(".samePd").attr("href", "prodDetail.html?prod_id="+result.pid+"&shop_code="+result.shopCode+"&source=internal");
        pro_otherSame += $otherSame.html(); 
      }
    });
    
    //guangg promoBanner


    $offshelf_otherSame.find(".sameList").html(pro_otherSame);
    
    $offshelf_otherSame.find("#viewMore").attr("href","prodSearchList.html?search_key="+response.searchName);
    
    $("#offshelf_otherSame").addClass("otherSame");
    $("#offshelf_otherSame").html($offshelf_otherSame.html());
  }else
    {
      $("#offshelf_otherSame").addClass("otherSame");
    $("#offshelf_otherSame").html('<span><div id="promo_logo" class="promo_logo" ><a id="promo_logolink"><img id="promobanner"  src="images/loading.png" style="display:block; margin:0 auto;" /></a></div></span>');
    }
   if(response.promoBanner){
  //   console.log(response.promoBanner);
   $("#promobanner").attr("src", image_server + response.promoBanner.url );
   $("#promo_logolink").attr("href",  response.promoBanner.link );
  // $("#promobanner").attr("data-originalbak", image_server + response.promoBanner.url );
   }
   
  //感兴趣的商品
  if (response.mobileTop4List.length > 0) {
      
    var $offshelf_interest=$('<span><h2>购买该药用户也购买了</h2><ul id="pro_interest"></ul></span>');
    var pro_interest="";
    $.each(response.mobileTop4List,function(index,result){
      var $interest=$('<span><li><a class="iHref" href="#">'+
          '<img class="iPicture" style_external="width:100px; margin:0 auto; display:block; border:1px solid #efefef;" width="90" height="90" src="images/loading.png">'+
          '<p class="iName"></p>'+
          '<p class="iPrice"></p>'+
          '</a></li></span>');
      var imageNameArray=result.listSImg.split(".");
      $interest.find(".iPicture").attr("data-original", image_server + result.listSImg.replace( ("."+imageNameArray[imageNameArray.length-1]) ,"_bbfm.jpg") );
      $interest.find(".iPicture").attr("data-originalbak",image_server + result.listSImg);
      if(result.selfDefinitionName!=null&&result.selfDefinitionName!=""){
        $interest.find(".iName").append(result.selfDefinitionName);
      }else{
        $interest.find(".iName").append(result.name);
      }
      $interest.find(".iPrice").append("￥"+FormatNumber(result.shopPrice,2));
      $interest.find(".iHref").attr("href", "prodDetail.html?prod_id="+result.pid+"&shop_code="+result.shopCode+"&source=internal");
      pro_interest += $interest.html(); 
    });
    $offshelf_interest.find("#pro_interest").html(pro_interest);
    $("#offshelf_interest").addClass("shelves_interest");
    $("#offshelf_interest").html($offshelf_interest.html());//感兴趣的商品赋值
  }
  
  commonMethod();
  
  $("#loadingDiv").attr("style","display:none;");
  $("#offshelfDiv").attr("style","display:block;");
  
  $("#pro_picture").show().lazyload();//加载主图
  $(".pd_pic").show().lazyload();//加载商品供应商家图片
  $(".iPicture").show().lazyload();//加载感兴趣图片
//  $("#promobanner").show().lazyload();//加载广告
}

//收藏商品
function addOffshelfFavory(){
    var urlStr="/shop/m_bbfHome/m_addFavory.html?t="+new Date().getTime();
    var dataStr = {shopCode:$("#offshelf_shopCode").val(),pid:$("#offshelf_pid").val()};
    asnyTask(urlStr ,dataStr,callBackAddOffshelfFavory);
}

function callBackAddOffshelfFavory(response){
  if(response==0){//未登录
    TempCache.itemUpdate("bcakHref",document.location.href);
        location.href="memberLogin.html";
  }else if(response==1 || response==4){//已收藏或收藏成功
    $('#offshelf_toast').html("收藏成功");
    showOffshelfToast();
  }else{//收藏失败
    $('#offshelf_toast').html("收藏失败");
    showOffshelfToast();
  }
}

function showOffshelfToast(){
  var winHeight = $(window).height();
  var winWidth = $(window).width();
  var divHeight = $("#offshelf_toast").height();
  var divWidth = $("#offshelf_toast").width();
  var top = (winHeight - divHeight) / 2 - 20;
  var left = (winWidth - divWidth) / 2 - 20;
  $("#offshelf_toast").css("z-index", 1002).css("left", left).fadeIn(300);
  $('#offshelf_toast').delay(3000).hide(0);
}

function qiugou(){
     var param = {};
     param["productName"] = $.trim($("#prod_name").html());
     param["brand"] = $.trim($("#brand").html());
    // param["productCount"] = $.trim($("#productCount").val());
     
     param["source"] = "2";
     var urlStr="/shop/qiugou.html?t="+new Date().getTime();
      asnyTask(urlStr ,param,callBackQiuGou);
  }

function callBackQiuGou(response){
  if(response.retCode==0)
  {
    $(".mask_b").show();
    if(wxBrowser){
      $("#wxbuhuoToast").show();
    }
    else{
      $("#buhuoToast").show();
    }
  }else
  {
    alert("提交失败！");
  }
  
}
  