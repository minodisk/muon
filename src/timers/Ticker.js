var EventEmitter = require('muon.events.EventEmitter')
  , requestAnimationFrame = function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function () {
      var counter = 0;
      return function (callback) {
        setTimeout(callback, 66);
        return counter++;
      };
    }();
}();

function Ticker() {

}

module.exports = Ticker;