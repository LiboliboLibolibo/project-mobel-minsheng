// JavaScript Document
$(document).ready(function(){
  var from_url=common.GetUrlParam("from_url")||"";
  var uid=common.GetUrlParam("uid")||"";
  var mobile = common.GetUrlParam("mobile")||"";
  common.staticLog();
  if(from_url != "" && uid != ""){
    var Days = 30; 
        var exp = new Date(); 
        exp.setTime(exp.getTime() + Days*24*60*60*1000); 
        document.cookie = "fromurl_800pharm_visitor" + "="+ escape (from_url) + ";expires=" + exp.toGMTString()+";Path=/;Domain=.800pharm.com";
    var url_wxgd="/shop/wxgdLoginOrRegister.html";
    jQuery.ajax({
      type : "get",
      cache: false,
      async: false,
      url:url_wxgd+"?from_url="+from_url+"&uid="+uid+"&mobile="+mobile,
      success : function(data){
        data=eval("("+data+")");
        //alert(JSON.stringify(data));
        if(data.flag != 0){
          window.location.href="../index.html";
        }else{
          //alert(JSON.stringify(data));
          if(data.login_result==0){
            var username=data.login_name;
            TempCache.itemUpdate("login_username",encrypt(username));
            TempCache.itemUpdate("user_type", data.user_type);
            TempCache.itemUpdate("user_from_url", data.user_from_url);
            TempCache.itemUpdate("uid", data.uid);
            sessionCache.itemUpdate("user_id", JSON.stringify(data.user_id));
            sessionCache.itemUpdate("username", data.user_ac);
            TempCache.itemUpdate("login_username_display",data.user_ac);
          }
        }
      }
    });
  }
  
});




