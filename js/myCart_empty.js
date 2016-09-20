var line = 0;//定义一个全局的line以用于记录当前显示的是哪一行
var keycontrol = 0; //用于控制当弹出框还未显示或失去焦点时，上下键取值的问题，如果失去焦点，上下键将不取li里的值,0表示不取值，1表示可取值
var vkeyword ="";
var time;

function callbackEmptyDetail(response){
   var user_from_url = TempCache.getItem("user_from_url");
   var unionid = TempCache.getItem("unionid");
   if(user_from_url != null && user_from_url !="" && user_from_url.toLowerCase() != "null" && unionid != null && unionid !="" && unionid.toLowerCase() != "null"){
     var $noneNotice=$('<span><p>主人，购物车还是空空的</p>'+
            '<span>快来给我塞满吧~~~</span>'+
            '<a href="/shop/m/medicinebox/medicinebox_index.html?from_url=tk&unid='+unionid+'">去购物</a></span>');
   }else{
     var $noneNotice=$('<span><p>主人，购物车还是空空的</p>'+
            '<span>快来给我塞满吧~~~</span>'+
            '<a href="index.html">去购物</a></span>');
   }
    $("#noneNotice").addClass("noneNotice");
  $("#noneNotice").html($noneNotice.html());//感兴趣的商品赋值

  //感兴趣的商品
  var pro_interest="";
  if (response.mobileTop4List.length > 0) {
    var $pro_interest=$('<span><h2>你可能感兴趣的商品</h2><ul id="pro_interest"></ul></span>');
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
    $pro_interest.find("#pro_interest").html(pro_interest);
    $("#interest").addClass("interest");
    $("#interest").html($pro_interest.html());//感兴趣的商品赋值
  }
  
  $("#header").load("mobileSearchHeader.html?v=3.2",function(){
    var searchContent = $("#searchHeadContent");
    //搜索框清空按钮
    if(searchContent.val()!="" && searchContent.val()!=null){
      searchContent.siblings(".empty_input").show();
    }
    else{
      searchContent.siblings(".empty_input").hide();  
    }
    searchContent.on("keyup",function(){
      if(searchContent.val()!="" && searchContent.val()!=null){
        searchContent.siblings(".empty_input").show();
      }
      else{
        searchContent.siblings(".empty_input").hide();  
      }
    });
    searchContent.siblings(".empty_input").on("click",function(){
      $(this).hide(); 
    });
    //按回车后头部搜索
    $('#searchHeadContent').keydown(function(event){
      if(event.keyCode==13){
        keyStr=$("#searchHeadContent").val()||"";
        if (keyStr == "") {
          return false;
        }
        window.location="prodSearchList.html?search_key="+keyStr;
        return false;
      }
    });
    //autocomplete
    jQuery(".main_input").keyup(function(e){
      if(e.keyCode!=13){
        vkeyword=jQuery(".main_input").val();
        keycontrol = 1;//将状态变为1，供下面上下键取li里的值使用
        if(vkeyword !=""){
          clearTimeout(time);//清除定时器，防止操作频繁造成过多查询的情况
          time = setTimeout(function(){getResult(vkeyword)},100);
        }else{
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
  
  $("#loadingDiv").attr("style","display:none;");
  $("#emptyDiv").attr("style","display:block;");
  
  $(".iPicture").show().lazyload();//加载感兴趣的商品图片
}

//头部搜索
function searchHead(){
  var searchKeyWord=$("#searchHeadContent").val()||"";
  if (searchKeyWord == "") {
    return false;
  }
  window.location="prodSearchList.html?search_key="+searchKeyWord;
}

//异步请求数据
function getResult(val){
  jQuery.ajax({
    type : "get",
    cache : false,//不缓存
    async:false,
    url: "/shop/searchKWTip.html?searchValue="+encodeURIComponent(val),
    dataType : "jsonp",
    jsonp: "callbackparam",//服务端用于接收callback调用的function名的参数
    jsonpCallback:"callback",//callback的function名称
    success : function(json){
      jQuery(".autocomplete ul").remove();//增加节点前先清空
      var litag ="";
      var n = 0;
      if(json.length > 5)
        n = 5;
      else
        n = json.length;
      for(var i=0;i<n;i++){
        var url = 'prodSearchList.html?search_key='+encodeURIComponent(json[i].kw);
        litag = litag + "<li><a href='"+url+"'>"+json[i].kw+"</a></li>";
      }
      litag = litag +  "<li class='closeComplete'><a href='javascript:closeComplete()'>关闭</a></li>";
      jQuery(".autocomplete").append("<ul>"+litag +"</ul>");
      var length = jQuery(".autocomplete li").length;
      if(length>0){
        jQuery(".autocomplete").show();
      }else{
        none();
      }
    },
    error:function(){
    }
  });
}

function closeComplete(){
  $("body").click();
}

//关闭
function none(){
    jQuery(".autocomplete").empty().hide();
    line = 0;
}