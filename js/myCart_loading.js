// JavaScript Document
$(document).ready(function(){
  common.staticLog();
  
  TempCache.removeItem("merchant_shop_code");
  
  var username = TempCache.getItem("login_username")||"";
  if(username != "") {//判断后台是否有登陆记录
    var url_str="/shop/member/isLogin_m.html?t="+new Date().getTime();
      asnyTask(url_str ,null,callbackLoginLoading);
  }else{
    callBackLogin();
  }
  
});

function callbackLoginLoading(response){
  if (response.rt_code == "-1") {//如果后台没登陆记录，则自动登陆
    var username = TempCache.getItem("login_username")||"";
    var password = TempCache.getItem("login_password")||"";
    if(username != "" && password!="") {
      var loginUrl = "/shop/member/mobileCheckLogin_m.html?t="+new Date().getTime();
      var data_obj={"account": decrypt(username) ,"pwd": decrypt(password) ,"status" :""};
      asnyTask(loginUrl ,data_obj,callBackLogin);
    }else{//如果后台有登陆记录
      callBackLogin();
    }
  } else {
    callBackLogin();
  }
}

function callBackLogin(){
  var url_str = "/shop/carts_m/cart_m.html?t="+new Date().getTime();
  asnyTask(url_str ,null,callbackCartDetail);
}

function callbackCartDetail(response) {
  if (response.mutilShopCart.shopCartList.length > 0) {//不为空的购物车
    //var url_str = "/shop/carts_m/cart_m.html?t="+new Date().getTime();
    //asnyTask(url_str ,null ,callbackNotEmptyCart);
    callbackNotEmptyCart(response);
  }else{//为空的购物车
    var url_str = "/shop/carts_m/emptyCart_m.html?t="+new Date().getTime();
    asnyTask(url_str ,null ,callbackEmptyDetail);
  }
}