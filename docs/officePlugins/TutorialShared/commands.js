!function () {
  var n = {};
  n.g = function () {
    if ("object" == typeof globalThis)
      return globalThis;
    try {
      return this || new Function("return this")()
    } catch (n) {
      if ("object" == typeof window)
        return window
    }
  }
  (),
  Office.onReady((function () {})),
  ("undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== n.g ? n.g : void 0).action = function (n) {
    n.completed()
  }
}
();
//# sourceMappingURL=commands.js.map
