// JavaScript Document
var line = 0;//定义一个全局的line以用于记录当前显示的是哪一行
var keycontrol = 0; //用于控制当弹出框还未显示或失去焦点时，上下键取值的问题，如果失去焦点，上下键将不取li里的值,0表示不取值，1表示可取值
var vkeyword ="";
var time;

$(document).ready(function(){

  common.staticLog();
  
  $(".allsort").css("height",$(window).height() - 50);
  
  $(".cataItem").on("click",function(){
    $(".cur").removeClass("cur");
    $(".categoryList").hide();
    $(this).addClass("cur");
    var c_index = $(this).index();
    $(".cataDetail").scrollTop();
    $(".cataDetail").children().eq(c_index).show();
  });
  
  $("#header").load("mobileSearchHeader.html?v=3.2",function(){
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
  
});

function searchThreeCategory(twbcid,obcid){
  window.location="prodSearchList.html?obcid="+obcid+"&twbcid="+twbcid;
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