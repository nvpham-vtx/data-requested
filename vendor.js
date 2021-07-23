(function() {
  subStr = function(str) {
    return str;
  }
 
  if (typeof define === 'function' && define.amd) {
    define('vinhpn', [], function() {
      return _;
    });
  }
}.call(this));
