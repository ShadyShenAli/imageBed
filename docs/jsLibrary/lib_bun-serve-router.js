// @bun
// ../../../../../../../C:/TEMP/bun/workspace/serv/node_modules/urlpattern-polyfill/dist/urlpattern.js
var ke = function(e, t) {
  return (t ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(e);
};
var v = function(e, t = false) {
  let r = [], n = 0;
  for (;n < e.length; ) {
    let o = e[n], c = function(l) {
      if (!t)
        throw new TypeError(l);
      r.push({ type: "INVALID_CHAR", index: n, value: e[n++] });
    };
    if (o === "*") {
      r.push({ type: "ASTERISK", index: n, value: e[n++] });
      continue;
    }
    if (o === "+" || o === "?") {
      r.push({ type: "OTHER_MODIFIER", index: n, value: e[n++] });
      continue;
    }
    if (o === "\\") {
      r.push({ type: "ESCAPED_CHAR", index: n++, value: e[n++] });
      continue;
    }
    if (o === "{") {
      r.push({ type: "OPEN", index: n, value: e[n++] });
      continue;
    }
    if (o === "}") {
      r.push({ type: "CLOSE", index: n, value: e[n++] });
      continue;
    }
    if (o === ":") {
      let l = "", s = n + 1;
      for (;s < e.length; ) {
        let i = e.substr(s, 1);
        if (s === n + 1 && Pe.test(i) || s !== n + 1 && Se.test(i)) {
          l += e[s++];
          continue;
        }
        break;
      }
      if (!l) {
        c(`Missing parameter name at ${n}`);
        continue;
      }
      r.push({ type: "NAME", index: n, value: l }), n = s;
      continue;
    }
    if (o === "(") {
      let l = 1, s = "", i = n + 1, a = false;
      if (e[i] === "?") {
        c(`Pattern cannot start with "?" at ${i}`);
        continue;
      }
      for (;i < e.length; ) {
        if (!ke(e[i], false)) {
          c(`Invalid character '${e[i]}' at ${i}.`), a = true;
          break;
        }
        if (e[i] === "\\") {
          s += e[i++] + e[i++];
          continue;
        }
        if (e[i] === ")") {
          if (l--, l === 0) {
            i++;
            break;
          }
        } else if (e[i] === "(" && (l++, e[i + 1] !== "?")) {
          c(`Capturing groups are not allowed at ${i}`), a = true;
          break;
        }
        s += e[i++];
      }
      if (a)
        continue;
      if (l) {
        c(`Unbalanced pattern at ${n}`);
        continue;
      }
      if (!s) {
        c(`Missing pattern at ${n}`);
        continue;
      }
      r.push({ type: "REGEX", index: n, value: s }), n = i;
      continue;
    }
    r.push({ type: "CHAR", index: n, value: e[n++] });
  }
  return r.push({ type: "END", index: n, value: "" }), r;
};
var D = function(e, t = {}) {
  let r = v(e);
  t.delimiter ??= "/#?", t.prefixes ??= "./";
  let n = `[^${x(t.delimiter)}]+?`, o = [], c = 0, l = 0, s = "", i = new Set, a = (f) => {
    if (l < r.length && r[l].type === f)
      return r[l++].value;
  }, h = () => a("OTHER_MODIFIER") ?? a("ASTERISK"), p = (f) => {
    let u = a(f);
    if (u !== undefined)
      return u;
    let { type: d, index: T } = r[l];
    throw new TypeError(`Unexpected ${d} at ${T}, expected ${f}`);
  }, O = () => {
    let f = "", u;
    for (;u = a("CHAR") ?? a("ESCAPED_CHAR"); )
      f += u;
    return f;
  }, xe = (f) => f, L = t.encodePart || xe, I = "", H = (f) => {
    I += f;
  }, $ = () => {
    I.length && (o.push(new k(3, "", "", L(I), "", 3)), I = "");
  }, G = (f, u, d, T, Y) => {
    let g = 3;
    switch (Y) {
      case "?":
        g = 1;
        break;
      case "*":
        g = 0;
        break;
      case "+":
        g = 2;
        break;
    }
    if (!u && !d && g === 3) {
      H(f);
      return;
    }
    if ($(), !u && !d) {
      if (!f)
        return;
      o.push(new k(3, "", "", L(f), "", g));
      return;
    }
    let m;
    d ? d === "*" ? m = M : m = d : m = n;
    let R = 2;
    m === n ? (R = 1, m = "") : m === M && (R = 0, m = "");
    let S;
    if (u ? S = u : d && (S = c++), i.has(S))
      throw new TypeError(`Duplicate name '${S}'.`);
    i.add(S), o.push(new k(R, S, L(f), m, L(T), g));
  };
  for (;l < r.length; ) {
    let f = a("CHAR"), u = a("NAME"), d = a("REGEX");
    if (!u && !d && (d = a("ASTERISK")), u || d) {
      let g = f ?? "";
      t.prefixes.indexOf(g) === -1 && (H(g), g = ""), $();
      let m = h();
      G(g, u, d, "", m);
      continue;
    }
    let T = f ?? a("ESCAPED_CHAR");
    if (T) {
      H(T);
      continue;
    }
    if (a("OPEN")) {
      let g = O(), m = a("NAME"), R = a("REGEX");
      !m && !R && (R = a("ASTERISK"));
      let S = O();
      p("CLOSE");
      let be = h();
      G(g, m, R, S, be);
      continue;
    }
    $(), p("END");
  }
  return o;
};
var x = function(e) {
  return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
};
var X = function(e) {
  return e && e.ignoreCase ? "ui" : "u";
};
var Z = function(e, t, r) {
  return F(D(e, r), t, r);
};
var y = function(e) {
  switch (e) {
    case 0:
      return "*";
    case 1:
      return "?";
    case 2:
      return "+";
    case 3:
      return "";
  }
};
var F = function(e, t, r = {}) {
  r.delimiter ??= "/#?", r.prefixes ??= "./", r.sensitive ??= false, r.strict ??= false, r.end ??= true, r.start ??= true, r.endsWith = "";
  let n = r.start ? "^" : "";
  for (let s of e) {
    if (s.type === 3) {
      s.modifier === 3 ? n += x(s.value) : n += `(?:${x(s.value)})${y(s.modifier)}`;
      continue;
    }
    t && t.push(s.name);
    let i = `[^${x(r.delimiter)}]+?`, a = s.value;
    if (s.type === 1 ? a = i : s.type === 0 && (a = M), !s.prefix.length && !s.suffix.length) {
      s.modifier === 3 || s.modifier === 1 ? n += `(${a})${y(s.modifier)}` : n += `((?:${a})${y(s.modifier)})`;
      continue;
    }
    if (s.modifier === 3 || s.modifier === 1) {
      n += `(?:${x(s.prefix)}(${a})${x(s.suffix)})`, n += y(s.modifier);
      continue;
    }
    n += `(?:${x(s.prefix)}`, n += `((?:${a})(?:`, n += x(s.suffix), n += x(s.prefix), n += `(?:${a}))*)${x(s.suffix)})`, s.modifier === 0 && (n += "?");
  }
  let o = `[${x(r.endsWith)}]|\$`, c = `[${x(r.delimiter)}]`;
  if (r.end)
    return r.strict || (n += `${c}?`), r.endsWith.length ? n += `(?=${o})` : n += "$", new RegExp(n, X(r));
  r.strict || (n += `(?:${c}(?=${o}))?`);
  let l = false;
  if (e.length) {
    let s = e[e.length - 1];
    s.type === 3 && s.modifier === 3 && (l = r.delimiter.indexOf(s) > -1);
  }
  return l || (n += `(?=${c}|${o})`), new RegExp(n, X(r));
};
var J = function(e, t) {
  return e.length ? e[0] === "/" ? true : !t || e.length < 2 ? false : (e[0] == "\\" || e[0] == "{") && e[1] == "/" : false;
};
var Q = function(e, t) {
  return e.startsWith(t) ? e.substring(t.length, e.length) : e;
};
var Ee = function(e, t) {
  return e.endsWith(t) ? e.substr(0, e.length - t.length) : e;
};
var W = function(e) {
  return !e || e.length < 2 ? false : e[0] === "[" || (e[0] === "\\" || e[0] === "{") && e[1] === "[";
};
var N = function(e) {
  if (!e)
    return true;
  for (let t of ee)
    if (e.test(t))
      return true;
  return false;
};
var te = function(e, t) {
  if (e = Q(e, "#"), t || e === "")
    return e;
  let r = new URL("https://example.com");
  return r.hash = e, r.hash ? r.hash.substring(1, r.hash.length) : "";
};
var re = function(e, t) {
  if (e = Q(e, "?"), t || e === "")
    return e;
  let r = new URL("https://example.com");
  return r.search = e, r.search ? r.search.substring(1, r.search.length) : "";
};
var ne = function(e, t) {
  return t || e === "" ? e : W(e) ? j(e) : z(e);
};
var se = function(e, t) {
  if (t || e === "")
    return e;
  let r = new URL("https://example.com");
  return r.password = e, r.password;
};
var ie = function(e, t) {
  if (t || e === "")
    return e;
  let r = new URL("https://example.com");
  return r.username = e, r.username;
};
var ae = function(e, t, r) {
  if (r || e === "")
    return e;
  if (t && !ee.includes(t))
    return new URL(`${t}:${e}`).pathname;
  let n = e[0] == "/";
  return e = new URL(n ? e : "/-" + e, "https://example.com").pathname, n || (e = e.substring(2, e.length)), e;
};
var oe = function(e, t, r) {
  return _(t) === e && (e = ""), r || e === "" ? e : K(e);
};
var ce = function(e, t) {
  return e = Ee(e, ":"), t || e === "" ? e : A(e);
};
var _ = function(e) {
  switch (e) {
    case "ws":
    case "http":
      return "80";
    case "wws":
    case "https":
      return "443";
    case "ftp":
      return "21";
    default:
      return "";
  }
};
var A = function(e) {
  if (e === "")
    return e;
  if (/^[-+.A-Za-z0-9]*$/.test(e))
    return e.toLowerCase();
  throw new TypeError(`Invalid protocol '${e}'.`);
};
var le = function(e) {
  if (e === "")
    return e;
  let t = new URL("https://example.com");
  return t.username = e, t.username;
};
var he = function(e) {
  if (e === "")
    return e;
  let t = new URL("https://example.com");
  return t.password = e, t.password;
};
var z = function(e) {
  if (e === "")
    return e;
  if (/[\t\n\r #%/:<>?@[\]^\\|]/g.test(e))
    throw new TypeError(`Invalid hostname '${e}'`);
  let t = new URL("https://example.com");
  return t.hostname = e, t.hostname;
};
var j = function(e) {
  if (e === "")
    return e;
  if (/[^0-9a-fA-F[\]:]/g.test(e))
    throw new TypeError(`Invalid IPv6 hostname '${e}'`);
  return e.toLowerCase();
};
var K = function(e) {
  if (e === "" || /^[0-9]*$/.test(e) && parseInt(e) <= 65535)
    return e;
  throw new TypeError(`Invalid port '${e}'.`);
};
var fe = function(e) {
  if (e === "")
    return e;
  let t = new URL("https://example.com");
  return t.pathname = e[0] !== "/" ? "/-" + e : e, e[0] !== "/" ? t.pathname.substring(2, t.pathname.length) : t.pathname;
};
var ue = function(e) {
  return e === "" ? e : new URL(`data:${e}`).pathname;
};
var pe = function(e) {
  if (e === "")
    return e;
  let t = new URL("https://example.com");
  return t.search = e, t.search.substring(1, t.search.length);
};
var de = function(e) {
  if (e === "")
    return e;
  let t = new URL("https://example.com");
  return t.hash = e, t.hash.substring(1, t.hash.length);
};
var ge = function(e, t) {
  if (typeof e != "string")
    throw new TypeError("parameter 1 is not of type 'string'.");
  let r = new URL(e, t);
  return { protocol: r.protocol.substring(0, r.protocol.length - 1), username: r.username, password: r.password, hostname: r.hostname, port: r.port, pathname: r.pathname, search: r.search !== "" ? r.search.substring(1, r.search.length) : undefined, hash: r.hash !== "" ? r.hash.substring(1, r.hash.length) : undefined };
};
var P = function(e, t) {
  return t ? C(e) : e;
};
var w = function(e, t, r) {
  let n;
  if (typeof t.baseURL == "string")
    try {
      n = new URL(t.baseURL), e.protocol = P(n.protocol.substring(0, n.protocol.length - 1), r), e.username = P(n.username, r), e.password = P(n.password, r), e.hostname = P(n.hostname, r), e.port = P(n.port, r), e.pathname = P(n.pathname, r), e.search = P(n.search.substring(1, n.search.length), r), e.hash = P(n.hash.substring(1, n.hash.length), r);
    } catch {
      throw new TypeError(`invalid baseURL '${t.baseURL}'.`);
    }
  if (typeof t.protocol == "string" && (e.protocol = ce(t.protocol, r)), typeof t.username == "string" && (e.username = ie(t.username, r)), typeof t.password == "string" && (e.password = se(t.password, r)), typeof t.hostname == "string" && (e.hostname = ne(t.hostname, r)), typeof t.port == "string" && (e.port = oe(t.port, e.protocol, r)), typeof t.pathname == "string") {
    if (e.pathname = t.pathname, n && !J(e.pathname, r)) {
      let o = n.pathname.lastIndexOf("/");
      o >= 0 && (e.pathname = P(n.pathname.substring(0, o + 1), r) + e.pathname);
    }
    e.pathname = ae(e.pathname, e.protocol, r);
  }
  return typeof t.search == "string" && (e.search = re(t.search, r)), typeof t.hash == "string" && (e.hash = te(t.hash, r)), e;
};
var C = function(e) {
  return e.replace(/([+*?:{}()\\])/g, "\\$1");
};
var Re = function(e) {
  return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
};
var ye = function(e, t) {
  t.delimiter ??= "/#?", t.prefixes ??= "./", t.sensitive ??= false, t.strict ??= false, t.end ??= true, t.start ??= true, t.endsWith = "";
  let r = ".*", n = `[^${Re(t.delimiter)}]+?`, o = /[$_\u200C\u200D\p{ID_Continue}]/u, c = "";
  for (let l = 0;l < e.length; ++l) {
    let s = e[l];
    if (s.type === 3) {
      if (s.modifier === 3) {
        c += C(s.value);
        continue;
      }
      c += `{${C(s.value)}}${y(s.modifier)}`;
      continue;
    }
    let i = s.hasCustomName(), a = !!s.suffix.length || !!s.prefix.length && (s.prefix.length !== 1 || !t.prefixes.includes(s.prefix)), h = l > 0 ? e[l - 1] : null, p = l < e.length - 1 ? e[l + 1] : null;
    if (!a && i && s.type === 1 && s.modifier === 3 && p && !p.prefix.length && !p.suffix.length)
      if (p.type === 3) {
        let O = p.value.length > 0 ? p.value[0] : "";
        a = o.test(O);
      } else
        a = !p.hasCustomName();
    if (!a && !s.prefix.length && h && h.type === 3) {
      let O = h.value[h.value.length - 1];
      a = t.prefixes.includes(O);
    }
    a && (c += "{"), c += C(s.prefix), i && (c += `:${s.name}`), s.type === 2 ? c += `(${s.value})` : s.type === 1 ? i || (c += `(${n})`) : s.type === 0 && (!i && (!h || h.type === 3 || h.modifier !== 3 || a || s.prefix !== "") ? c += "*" : c += `(${r})`), s.type === 1 && i && s.suffix.length && o.test(s.suffix[0]) && (c += "\\"), c += C(s.suffix), a && (c += "}"), s.modifier !== 3 && (c += y(s.modifier));
  }
  return c;
};
var k = class {
  type = 3;
  name = "";
  prefix = "";
  value = "";
  suffix = "";
  modifier = 3;
  constructor(t, r, n, o, c, l) {
    this.type = t, this.name = r, this.prefix = n, this.value = o, this.suffix = c, this.modifier = l;
  }
  hasCustomName() {
    return this.name !== "" && typeof this.name != "number";
  }
};
var Pe = /[$_\p{ID_Start}]/u;
var Se = /[$_\u200C\u200D\p{ID_Continue}]/u;
var M = ".*";
var b = { delimiter: "", prefixes: "", sensitive: true, strict: true };
var B = { delimiter: ".", prefixes: "", sensitive: true, strict: true };
var q = { delimiter: "/", prefixes: "/", sensitive: true, strict: true };
var ee = ["ftp", "file", "http", "https", "ws", "wss"];
var U = class {
  #i;
  #n = [];
  #t = {};
  #e = 0;
  #s = 1;
  #u = 0;
  #c = 0;
  #p = 0;
  #d = 0;
  #g = false;
  constructor(t) {
    this.#i = t;
  }
  get result() {
    return this.#t;
  }
  parse() {
    for (this.#n = v(this.#i, true);this.#e < this.#n.length; this.#e += this.#s) {
      if (this.#s = 1, this.#n[this.#e].type === "END") {
        if (this.#c === 0) {
          this.#P(), this.#l() ? this.#r(9, 1) : this.#h() ? (this.#r(8, 1), this.#t.hash = "") : (this.#r(7, 0), this.#t.search = "", this.#t.hash = "");
          continue;
        } else if (this.#c === 2) {
          this.#f(5);
          continue;
        }
        this.#r(10, 0);
        break;
      }
      if (this.#p > 0)
        if (this.#T())
          this.#p -= 1;
        else
          continue;
      if (this.#O()) {
        this.#p += 1;
        continue;
      }
      switch (this.#c) {
        case 0:
          this.#S() && (this.#t.username = "", this.#t.password = "", this.#t.hostname = "", this.#t.port = "", this.#t.pathname = "", this.#t.search = "", this.#t.hash = "", this.#f(1));
          break;
        case 1:
          if (this.#S()) {
            this.#C();
            let t = 7, r = 1;
            this.#g && (this.#t.pathname = "/"), this.#E() ? (t = 2, r = 3) : this.#g && (t = 2), this.#r(t, r);
          }
          break;
        case 2:
          this.#x() ? this.#f(3) : (this.#b() || this.#h() || this.#l()) && this.#f(5);
          break;
        case 3:
          this.#R() ? this.#r(4, 1) : this.#x() && this.#r(5, 1);
          break;
        case 4:
          this.#x() && this.#r(5, 1);
          break;
        case 5:
          this.#A() ? this.#d += 1 : this.#w() && (this.#d -= 1), this.#y() && !this.#d ? this.#r(6, 1) : this.#b() ? this.#r(7, 0) : this.#h() ? this.#r(8, 1) : this.#l() && this.#r(9, 1);
          break;
        case 6:
          this.#b() ? this.#r(7, 0) : this.#h() ? this.#r(8, 1) : this.#l() && this.#r(9, 1);
          break;
        case 7:
          this.#h() ? this.#r(8, 1) : this.#l() && this.#r(9, 1);
          break;
        case 8:
          this.#l() && this.#r(9, 1);
          break;
        case 9:
          break;
        case 10:
          break;
      }
    }
  }
  #r(t, r) {
    switch (this.#c) {
      case 0:
        break;
      case 1:
        this.#t.protocol = this.#o();
        break;
      case 2:
        break;
      case 3:
        this.#t.username = this.#o();
        break;
      case 4:
        this.#t.password = this.#o();
        break;
      case 5:
        this.#t.hostname = this.#o();
        break;
      case 6:
        this.#t.port = this.#o();
        break;
      case 7:
        this.#t.pathname = this.#o();
        break;
      case 8:
        this.#t.search = this.#o();
        break;
      case 9:
        this.#t.hash = this.#o();
        break;
      case 10:
        break;
    }
    this.#k(t, r);
  }
  #k(t, r) {
    this.#c = t, this.#u = this.#e + r, this.#e += r, this.#s = 0;
  }
  #P() {
    this.#e = this.#u, this.#s = 0;
  }
  #f(t) {
    this.#P(), this.#c = t;
  }
  #m(t) {
    return t < 0 && (t = this.#n.length - t), t < this.#n.length ? this.#n[t] : this.#n[this.#n.length - 1];
  }
  #a(t, r) {
    let n = this.#m(t);
    return n.value === r && (n.type === "CHAR" || n.type === "ESCAPED_CHAR" || n.type === "INVALID_CHAR");
  }
  #S() {
    return this.#a(this.#e, ":");
  }
  #E() {
    return this.#a(this.#e + 1, "/") && this.#a(this.#e + 2, "/");
  }
  #x() {
    return this.#a(this.#e, "@");
  }
  #R() {
    return this.#a(this.#e, ":");
  }
  #y() {
    return this.#a(this.#e, ":");
  }
  #b() {
    return this.#a(this.#e, "/");
  }
  #h() {
    if (this.#a(this.#e, "?"))
      return true;
    if (this.#n[this.#e].value !== "?")
      return false;
    let t = this.#m(this.#e - 1);
    return t.type !== "NAME" && t.type !== "REGEX" && t.type !== "CLOSE" && t.type !== "ASTERISK";
  }
  #l() {
    return this.#a(this.#e, "#");
  }
  #O() {
    return this.#n[this.#e].type == "OPEN";
  }
  #T() {
    return this.#n[this.#e].type == "CLOSE";
  }
  #A() {
    return this.#a(this.#e, "[");
  }
  #w() {
    return this.#a(this.#e, "]");
  }
  #o() {
    let t = this.#n[this.#e], r = this.#m(this.#u).index;
    return this.#i.substring(r, t.index);
  }
  #C() {
    let t = {};
    Object.assign(t, b), t.encodePart = A;
    let r = Z(this.#o(), undefined, t);
    this.#g = N(r);
  }
};
var V = ["protocol", "username", "password", "hostname", "port", "pathname", "search", "hash"];
var E = "*";
var me = class {
  #i;
  #n = {};
  #t = {};
  #e = {};
  #s = {};
  constructor(t = {}, r, n) {
    try {
      let o;
      if (typeof r == "string" ? o = r : n = r, typeof t == "string") {
        let i = new U(t);
        if (i.parse(), t = i.result, o === undefined && typeof t.protocol != "string")
          throw new TypeError("A base URL must be provided for a relative constructor string.");
        t.baseURL = o;
      } else {
        if (!t || typeof t != "object")
          throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");
        if (o)
          throw new TypeError("parameter 1 is not of type 'string'.");
      }
      typeof n > "u" && (n = { ignoreCase: false });
      let c = { ignoreCase: n.ignoreCase === true }, l = { pathname: E, protocol: E, username: E, password: E, hostname: E, port: E, search: E, hash: E };
      this.#i = w(l, t, true), _(this.#i.protocol) === this.#i.port && (this.#i.port = "");
      let s;
      for (s of V) {
        if (!(s in this.#i))
          continue;
        let i = {}, a = this.#i[s];
        switch (this.#t[s] = [], s) {
          case "protocol":
            Object.assign(i, b), i.encodePart = A;
            break;
          case "username":
            Object.assign(i, b), i.encodePart = le;
            break;
          case "password":
            Object.assign(i, b), i.encodePart = he;
            break;
          case "hostname":
            Object.assign(i, B), W(a) ? i.encodePart = j : i.encodePart = z;
            break;
          case "port":
            Object.assign(i, b), i.encodePart = K;
            break;
          case "pathname":
            N(this.#n.protocol) ? (Object.assign(i, q, c), i.encodePart = fe) : (Object.assign(i, b, c), i.encodePart = ue);
            break;
          case "search":
            Object.assign(i, b, c), i.encodePart = pe;
            break;
          case "hash":
            Object.assign(i, b, c), i.encodePart = de;
            break;
        }
        try {
          this.#s[s] = D(a, i), this.#n[s] = F(this.#s[s], this.#t[s], i), this.#e[s] = ye(this.#s[s], i);
        } catch {
          throw new TypeError(`invalid ${s} pattern '${this.#i[s]}'.`);
        }
      }
    } catch (o) {
      throw new TypeError(`Failed to construct 'URLPattern': ${o.message}`);
    }
  }
  test(t = {}, r) {
    let n = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
    if (typeof t != "string" && r)
      throw new TypeError("parameter 1 is not of type 'string'.");
    if (typeof t > "u")
      return false;
    try {
      typeof t == "object" ? n = w(n, t, false) : n = w(n, ge(t, r), false);
    } catch {
      return false;
    }
    let o;
    for (o of V)
      if (!this.#n[o].exec(n[o]))
        return false;
    return true;
  }
  exec(t = {}, r) {
    let n = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
    if (typeof t != "string" && r)
      throw new TypeError("parameter 1 is not of type 'string'.");
    if (typeof t > "u")
      return;
    try {
      typeof t == "object" ? n = w(n, t, false) : n = w(n, ge(t, r), false);
    } catch {
      return null;
    }
    let o = {};
    r ? o.inputs = [t, r] : o.inputs = [t];
    let c;
    for (c of V) {
      let l = this.#n[c].exec(n[c]);
      if (!l)
        return null;
      let s = {};
      for (let [i, a] of this.#t[c].entries())
        if (typeof a == "string" || typeof a == "number") {
          let h = l[i + 1];
          s[a] = h;
        }
      o[c] = { input: n[c] ?? "", groups: s };
    }
    return o;
  }
  static compareComponent(t, r, n) {
    let o = (i, a) => {
      for (let h of ["type", "modifier", "prefix", "value", "suffix"]) {
        if (i[h] < a[h])
          return -1;
        if (i[h] === a[h])
          continue;
        return 1;
      }
      return 0;
    }, c = new k(3, "", "", "", "", 3), l = new k(0, "", "", "", "", 3), s = (i, a) => {
      let h = 0;
      for (;h < Math.min(i.length, a.length); ++h) {
        let p = o(i[h], a[h]);
        if (p)
          return p;
      }
      return i.length === a.length ? 0 : o(i[h] ?? c, a[h] ?? c);
    };
    return !r.#e[t] && !n.#e[t] ? 0 : r.#e[t] && !n.#e[t] ? s(r.#s[t], [l]) : !r.#e[t] && n.#e[t] ? s([l], n.#s[t]) : s(r.#s[t], n.#s[t]);
  }
  get protocol() {
    return this.#e.protocol;
  }
  get username() {
    return this.#e.username;
  }
  get password() {
    return this.#e.password;
  }
  get hostname() {
    return this.#e.hostname;
  }
  get port() {
    return this.#e.port;
  }
  get pathname() {
    return this.#e.pathname;
  }
  get search() {
    return this.#e.search;
  }
  get hash() {
    return this.#e.hash;
  }
};

// ../../../../../../../C:/TEMP/bun/workspace/serv/node_modules/urlpattern-polyfill/index.js
if (!globalThis.URLPattern) {
  globalThis.URLPattern = me;
}

// ../../../../../../../C:/TEMP/bun/workspace/serv/node_modules/bun-serve-router/router.ts
class Router {
  routeList = [];
  add(method, pattern, handler) {
    method = method.toUpperCase();
    const route = new Route(method, new me({
      pathname: pattern
    }), handler);
    this.routeList.push(route);
  }
  async match(request) {
    for (const route of this.routeList) {
      if (request.method === route.method) {
        const result = route.urlPattern.exec(request.url);
        if (result) {
          let r = route.handler(request, result.pathname.groups, result);
          if (r instanceof Response) {
            return r;
          } else {
            return await r;
          }
        }
      }
    }
  }
}

class Route {
  method;
  urlPattern;
  handler;
  constructor(method, urlPattern, handler) {
    this.method = method;
    this.urlPattern = urlPattern;
    this.handler = handler;
  }
}
export {
  Router
};
