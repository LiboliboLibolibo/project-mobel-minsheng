// 临时存储
var TempCache = {
  setItem : function(key, value) {
    localStorage.setItem(key, value);
  },
  getItem : function(key) {
    return localStorage.getItem(key);
  },
  removeItem : function(key) {
    return localStorage.removeItem(key);
  },
  itemUpdate : function(key, value) {
    localStorage.removeItem(key);
    localStorage.setItem(key, value);
  },
  clearAll: function(){
    localStorage.clear();
  }
};

var sessionCache={
  
  setItem : function(key, value) {
    sessionStorage.setItem(key, value);
  },
  getItem : function(key) {
    var data = sessionStorage.getItem(key);
    if(key == 'user_id'){
      data = data.replace(/"/g, '');
    }
    return data;
  },
  removeItem : function(key) {
    return sessionStorage.removeItem(key);
  },
  itemUpdate : function(key, value) {
    sessionStorage.removeItem(key);
    sessionStorage.setItem(key, value);
  },
  clearAll: function(){
    sessionStorage.clear();
  }
  
};

