(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict"

function iota(n) {
  var result = new Array(n)
  for(var i=0; i<n; ++i) {
    result[i] = i
  }
  return result
}

module.exports = iota
},{}],2:[function(require,module,exports){
/**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install is-buffer`
 */

module.exports = function (obj) {
  return !!(obj != null &&
    (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
      (obj.constructor &&
      typeof obj.constructor.isBuffer === 'function' &&
      obj.constructor.isBuffer(obj))
    ))
}

},{}],3:[function(require,module,exports){
var iota = require("iota-array")
var isBuffer = require("is-buffer")

var hasTypedArrays  = ((typeof Float64Array) !== "undefined")

function compare1st(a, b) {
  return a[0] - b[0]
}

function order() {
  var stride = this.stride
  var terms = new Array(stride.length)
  var i
  for(i=0; i<terms.length; ++i) {
    terms[i] = [Math.abs(stride[i]), i]
  }
  terms.sort(compare1st)
  var result = new Array(terms.length)
  for(i=0; i<result.length; ++i) {
    result[i] = terms[i][1]
  }
  return result
}

function compileConstructor(dtype, dimension) {
  var className = ["View", dimension, "d", dtype].join("")
  if(dimension < 0) {
    className = "View_Nil" + dtype
  }
  var useGetters = (dtype === "generic")

  if(dimension === -1) {
    //Special case for trivial arrays
    var code =
      "function "+className+"(a){this.data=a;};\
var proto="+className+".prototype;\
proto.dtype='"+dtype+"';\
proto.index=function(){return -1};\
proto.size=0;\
proto.dimension=-1;\
proto.shape=proto.stride=proto.order=[];\
proto.lo=proto.hi=proto.transpose=proto.step=\
function(){return new "+className+"(this.data);};\
proto.get=proto.set=function(){};\
proto.pick=function(){return null};\
return function construct_"+className+"(a){return new "+className+"(a);}"
    var procedure = new Function(code)
    return procedure()
  } else if(dimension === 0) {
    //Special case for 0d arrays
    var code =
      "function "+className+"(a,d) {\
this.data = a;\
this.offset = d\
};\
var proto="+className+".prototype;\
proto.dtype='"+dtype+"';\
proto.index=function(){return this.offset};\
proto.dimension=0;\
proto.size=1;\
proto.shape=\
proto.stride=\
proto.order=[];\
proto.lo=\
proto.hi=\
proto.transpose=\
proto.step=function "+className+"_copy() {\
return new "+className+"(this.data,this.offset)\
};\
proto.pick=function "+className+"_pick(){\
return TrivialArray(this.data);\
};\
proto.valueOf=proto.get=function "+className+"_get(){\
return "+(useGetters ? "this.data.get(this.offset)" : "this.data[this.offset]")+
"};\
proto.set=function "+className+"_set(v){\
return "+(useGetters ? "this.data.set(this.offset,v)" : "this.data[this.offset]=v")+"\
};\
return function construct_"+className+"(a,b,c,d){return new "+className+"(a,d)}"
    var procedure = new Function("TrivialArray", code)
    return procedure(CACHED_CONSTRUCTORS[dtype][0])
  }

  var code = ["'use strict'"]

  //Create constructor for view
  var indices = iota(dimension)
  var args = indices.map(function(i) { return "i"+i })
  var index_str = "this.offset+" + indices.map(function(i) {
        return "this.stride[" + i + "]*i" + i
      }).join("+")
  var shapeArg = indices.map(function(i) {
      return "b"+i
    }).join(",")
  var strideArg = indices.map(function(i) {
      return "c"+i
    }).join(",")
  code.push(
    "function "+className+"(a," + shapeArg + "," + strideArg + ",d){this.data=a",
      "this.shape=[" + shapeArg + "]",
      "this.stride=[" + strideArg + "]",
      "this.offset=d|0}",
    "var proto="+className+".prototype",
    "proto.dtype='"+dtype+"'",
    "proto.dimension="+dimension)

  //view.size:
  code.push("Object.defineProperty(proto,'size',{get:function "+className+"_size(){\
return "+indices.map(function(i) { return "this.shape["+i+"]" }).join("*"),
"}})")

  //view.order:
  if(dimension === 1) {
    code.push("proto.order=[0]")
  } else {
    code.push("Object.defineProperty(proto,'order',{get:")
    if(dimension < 4) {
      code.push("function "+className+"_order(){")
      if(dimension === 2) {
        code.push("return (Math.abs(this.stride[0])>Math.abs(this.stride[1]))?[1,0]:[0,1]}})")
      } else if(dimension === 3) {
        code.push(
"var s0=Math.abs(this.stride[0]),s1=Math.abs(this.stride[1]),s2=Math.abs(this.stride[2]);\
if(s0>s1){\
if(s1>s2){\
return [2,1,0];\
}else if(s0>s2){\
return [1,2,0];\
}else{\
return [1,0,2];\
}\
}else if(s0>s2){\
return [2,0,1];\
}else if(s2>s1){\
return [0,1,2];\
}else{\
return [0,2,1];\
}}})")
      }
    } else {
      code.push("ORDER})")
    }
  }

  //view.set(i0, ..., v):
  code.push(
"proto.set=function "+className+"_set("+args.join(",")+",v){")
  if(useGetters) {
    code.push("return this.data.set("+index_str+",v)}")
  } else {
    code.push("return this.data["+index_str+"]=v}")
  }

  //view.get(i0, ...):
  code.push("proto.get=function "+className+"_get("+args.join(",")+"){")
  if(useGetters) {
    code.push("return this.data.get("+index_str+")}")
  } else {
    code.push("return this.data["+index_str+"]}")
  }

  //view.index:
  code.push(
    "proto.index=function "+className+"_index(", args.join(), "){return "+index_str+"}")

  //view.hi():
  code.push("proto.hi=function "+className+"_hi("+args.join(",")+"){return new "+className+"(this.data,"+
    indices.map(function(i) {
      return ["(typeof i",i,"!=='number'||i",i,"<0)?this.shape[", i, "]:i", i,"|0"].join("")
    }).join(",")+","+
    indices.map(function(i) {
      return "this.stride["+i + "]"
    }).join(",")+",this.offset)}")

  //view.lo():
  var a_vars = indices.map(function(i) { return "a"+i+"=this.shape["+i+"]" })
  var c_vars = indices.map(function(i) { return "c"+i+"=this.stride["+i+"]" })
  code.push("proto.lo=function "+className+"_lo("+args.join(",")+"){var b=this.offset,d=0,"+a_vars.join(",")+","+c_vars.join(","))
  for(var i=0; i<dimension; ++i) {
    code.push(
"if(typeof i"+i+"==='number'&&i"+i+">=0){\
d=i"+i+"|0;\
b+=c"+i+"*d;\
a"+i+"-=d}")
  }
  code.push("return new "+className+"(this.data,"+
    indices.map(function(i) {
      return "a"+i
    }).join(",")+","+
    indices.map(function(i) {
      return "c"+i
    }).join(",")+",b)}")

  //view.step():
  code.push("proto.step=function "+className+"_step("+args.join(",")+"){var "+
    indices.map(function(i) {
      return "a"+i+"=this.shape["+i+"]"
    }).join(",")+","+
    indices.map(function(i) {
      return "b"+i+"=this.stride["+i+"]"
    }).join(",")+",c=this.offset,d=0,ceil=Math.ceil")
  for(var i=0; i<dimension; ++i) {
    code.push(
"if(typeof i"+i+"==='number'){\
d=i"+i+"|0;\
if(d<0){\
c+=b"+i+"*(a"+i+"-1);\
a"+i+"=ceil(-a"+i+"/d)\
}else{\
a"+i+"=ceil(a"+i+"/d)\
}\
b"+i+"*=d\
}")
  }
  code.push("return new "+className+"(this.data,"+
    indices.map(function(i) {
      return "a" + i
    }).join(",")+","+
    indices.map(function(i) {
      return "b" + i
    }).join(",")+",c)}")

  //view.transpose():
  var tShape = new Array(dimension)
  var tStride = new Array(dimension)
  for(var i=0; i<dimension; ++i) {
    tShape[i] = "a[i"+i+"]"
    tStride[i] = "b[i"+i+"]"
  }
  code.push("proto.transpose=function "+className+"_transpose("+args+"){"+
    args.map(function(n,idx) { return n + "=(" + n + "===undefined?" + idx + ":" + n + "|0)"}).join(";"),
    "var a=this.shape,b=this.stride;return new "+className+"(this.data,"+tShape.join(",")+","+tStride.join(",")+",this.offset)}")

  //view.pick():
  code.push("proto.pick=function "+className+"_pick("+args+"){var a=[],b=[],c=this.offset")
  for(var i=0; i<dimension; ++i) {
    code.push("if(typeof i"+i+"==='number'&&i"+i+">=0){c=(c+this.stride["+i+"]*i"+i+")|0}else{a.push(this.shape["+i+"]);b.push(this.stride["+i+"])}")
  }
  code.push("var ctor=CTOR_LIST[a.length+1];return ctor(this.data,a,b,c)}")

  //Add return statement
  code.push("return function construct_"+className+"(data,shape,stride,offset){return new "+className+"(data,"+
    indices.map(function(i) {
      return "shape["+i+"]"
    }).join(",")+","+
    indices.map(function(i) {
      return "stride["+i+"]"
    }).join(",")+",offset)}")

  //Compile procedure
  var procedure = new Function("CTOR_LIST", "ORDER", code.join("\n"))
  return procedure(CACHED_CONSTRUCTORS[dtype], order)
}

function arrayDType(data) {
  if(isBuffer(data)) {
    return "buffer"
  }
  if(hasTypedArrays) {
    switch(Object.prototype.toString.call(data)) {
      case "[object Float64Array]":
        return "float64"
      case "[object Float32Array]":
        return "float32"
      case "[object Int8Array]":
        return "int8"
      case "[object Int16Array]":
        return "int16"
      case "[object Int32Array]":
        return "int32"
      case "[object Uint8Array]":
        return "uint8"
      case "[object Uint16Array]":
        return "uint16"
      case "[object Uint32Array]":
        return "uint32"
      case "[object Uint8ClampedArray]":
        return "uint8_clamped"
    }
  }
  if(Array.isArray(data)) {
    return "array"
  }
  return "generic"
}

var CACHED_CONSTRUCTORS = {
  "float32":[],
  "float64":[],
  "int8":[],
  "int16":[],
  "int32":[],
  "uint8":[],
  "uint16":[],
  "uint32":[],
  "array":[],
  "uint8_clamped":[],
  "buffer":[],
  "generic":[]
}

;(function() {
  for(var id in CACHED_CONSTRUCTORS) {
    CACHED_CONSTRUCTORS[id].push(compileConstructor(id, -1))
  }
});

function wrappedNDArrayCtor(data, shape, stride, offset) {
  if(data === undefined) {
    var ctor = CACHED_CONSTRUCTORS.array[0]
    return ctor([])
  } else if(typeof data === "number") {
    data = [data]
  }
  if(shape === undefined) {
    shape = [ data.length ]
  }
  var d = shape.length
  if(stride === undefined) {
    stride = new Array(d)
    for(var i=d-1, sz=1; i>=0; --i) {
      stride[i] = sz
      sz *= shape[i]
    }
  }
  if(offset === undefined) {
    offset = 0
    for(var i=0; i<d; ++i) {
      if(stride[i] < 0) {
        offset -= (shape[i]-1)*stride[i]
      }
    }
  }
  var dtype = arrayDType(data)
  var ctor_list = CACHED_CONSTRUCTORS[dtype]
  while(ctor_list.length <= d+1) {
    ctor_list.push(compileConstructor(dtype, ctor_list.length-1))
  }
  var ctor = ctor_list[d+1]
  return ctor(data, shape, stride, offset)
}

module.exports = wrappedNDArrayCtor

},{"iota-array":1,"is-buffer":2}],4:[function(require,module,exports){
{
    var _ns_ = {
        id: 'ymir.frontend',
        doc: void 0
    };
}
var getFormField = exports.getFormField = function getFormField(form, element) {
    return $('form#' + form + ' [name=' + element + ']').val();
};
var getInputString = exports.getInputString = function getInputString(form, elementId) {
    return getFormField(form, elementId);
};
var getInputNumber = exports.getInputNumber = function getInputNumber(form, element) {
    return parseFloat(getFormField(form, element));
};
var getInputBoolean = exports.getInputBoolean = function getInputBoolean(form, element) {
    return 'true' == getFormField(form, element) ? true : false;
};
var showAlgorithmSettings = exports.showAlgorithmSettings = function showAlgorithmSettings() {
    console.log('what');
    return function () {
        var algorithmø1 = getInputString('algorithm-selector', 'generation-algorithm');
        $('#generation-algorithm-settings form').hide();
        return $('#' + algorithmø1 + '-settings').show();
    }.call(this);
};


},{}],5:[function(require,module,exports){
{
    var _ns_ = {
        id: 'ymir.main',
        doc: void 0
    };
    var ndarray = require('ndarray');
    var ymir_frontend = require('./frontend');
    var front = ymir_frontend;
    var ymir_rendering = require('./rendering');
    var rend = ymir_rendering;
}
void 0;
void 0;
void 0;
var inc = exports.inc = function inc(x) {
    return x + 1;
};
var dec = exports.dec = function dec(x) {
    return x - 1;
};
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
var midpoint = exports.midpoint = function midpoint(a, b) {
    return (a + b) / 2;
};
var average2 = exports.average2 = function average2(a, b) {
    return (a + b) / 2;
};
var average4 = exports.average4 = function average4(a, b, c, d) {
    return (a + b + c + d) / 4;
};
var safeAverage = exports.safeAverage = function safeAverage(a, b, c, d) {
    return function () {
        var totalø1 = 0;
        var countø1 = 0;
        a ? (function () {
            totalø1 = totalø1 + a;
            return countø1 = inc(countø1);
        })() : void 0;
        b ? (function () {
            totalø1 = totalø1 + b;
            return countø1 = inc(countø1);
        })() : void 0;
        c ? (function () {
            totalø1 = totalø1 + c;
            return countø1 = inc(countø1);
        })() : void 0;
        d ? (function () {
            totalø1 = totalø1 + d;
            return countø1 = inc(countø1);
        })() : void 0;
        return totalø1 / countø1;
    }.call(this);
};
var isEven = exports.isEven = function isEven(n) {
    return 0 == n % 2;
};
var isOdd = exports.isOdd = function isOdd(n) {
    return 1 == n % 2;
};
var rand = exports.rand = function rand() {
    return Math.random();
};
var randAroundZero = exports.randAroundZero = function randAroundZero(spread) {
    return spread * rand() * 2 - spread;
};
var jitter = exports.jitter = function jitter(value, spread) {
    return value + randAroundZero(spread);
};
var heightmapResolution = exports.heightmapResolution = function heightmapResolution(heightmap) {
    return heightmap.shape[0];
};
var heightmapLastIndex = exports.heightmapLastIndex = function heightmapLastIndex(heightmap) {
    return dec(heightmapResolution(heightmap));
};
var heightmapCenterIndex = exports.heightmapCenterIndex = function heightmapCenterIndex(heightmap) {
    return midpoint(0, heightmapLastIndex(heightmap));
};
var heightmapGet = exports.heightmapGet = function heightmapGet(heightmap, x, y) {
    return heightmap.get(x, y);
};
var heightmapGetSafe = exports.heightmapGetSafe = function heightmapGetSafe(heightmap, x, y) {
    return function () {
        var lastø1 = heightmapLastIndex(heightmap);
        return 0 <= x && x <= lastø1 && (0 <= y && y <= lastø1) ? (function () {
            return heightmapGet(heightmap, x, y);
        })() : void 0;
    }.call(this);
};
var heightmapSet = exports.heightmapSet = function heightmapSet(heightmap, x, y, val) {
    return heightmap.set(x, y, val);
};
var heightmapSetIfUnset = exports.heightmapSetIfUnset = function heightmapSetIfUnset(heightmap, x, y, val) {
    return 0 == heightmapGet(heightmap, x, y) ? (function () {
        return heightmapSet(heightmap, x, y, val);
    })() : void 0;
};
var heightmapMax = exports.heightmapMax = function heightmapMax(heightmap) {
    return function () {
        var maxø1 = 0 - Infinity;
        (function () {
            var array2ø1 = heightmap;
            return function () {
                var G__3ø1 = array2ø1.data.length;
                return function loop() {
                    var recur = loop;
                    var index1ø1 = 0;
                    do {
                        recur = index1ø1 < G__3ø1 ? (function () {
                            (function () {
                                var elø1 = array2ø1.data[index1ø1];
                                return maxø1 < elø1 ? (function () {
                                    return maxø1 = elø1;
                                })() : void 0;
                            }.call(this));
                            return loop[0] = inc(index1ø1), loop;
                        })() : void 0;
                    } while (index1ø1 = loop[0], recur === loop);
                    return recur;
                }.call(this);
            }.call(this);
        }.call(this));
        return maxø1;
    }.call(this);
};
var heightmapMin = exports.heightmapMin = function heightmapMin(heightmap) {
    return function () {
        var minø1 = Infinity;
        (function () {
            var array5ø1 = heightmap;
            return function () {
                var G__6ø1 = array5ø1.data.length;
                return function loop() {
                    var recur = loop;
                    var index4ø1 = 0;
                    do {
                        recur = index4ø1 < G__6ø1 ? (function () {
                            (function () {
                                var elø1 = array5ø1.data[index4ø1];
                                return minø1 > elø1 ? (function () {
                                    return minø1 = elø1;
                                })() : void 0;
                            }.call(this));
                            return loop[0] = inc(index4ø1), loop;
                        })() : void 0;
                    } while (index4ø1 = loop[0], recur === loop);
                    return recur;
                }.call(this);
            }.call(this);
        }.call(this));
        return minø1;
    }.call(this);
};
var normalize = exports.normalize = function normalize(heightmap) {
    return function () {
        var maxø1 = 0 - Infinity;
        var minø1 = Infinity;
        (function () {
            var array8ø1 = heightmap;
            return function () {
                var G__9ø1 = array8ø1.data.length;
                return function loop() {
                    var recur = loop;
                    var index7ø1 = 0;
                    do {
                        recur = index7ø1 < G__9ø1 ? (function () {
                            (function () {
                                var elø1 = array8ø1.data[index7ø1];
                                maxø1 < elø1 ? (function () {
                                    return maxø1 = elø1;
                                })() : void 0;
                                return minø1 > elø1 ? (function () {
                                    return minø1 = elø1;
                                })() : void 0;
                            }.call(this));
                            return loop[0] = inc(index7ø1), loop;
                        })() : void 0;
                    } while (index7ø1 = loop[0], recur === loop);
                    return recur;
                }.call(this);
            }.call(this);
        }.call(this));
        return function () {
            var spanø1 = maxø1 - minø1;
            return function () {
                var array10ø1 = heightmap;
                return function () {
                    var G__11ø1 = array10ø1.shape[0];
                    return function loop() {
                        var recur = loop;
                        var xø1 = 0;
                        do {
                            recur = xø1 < G__11ø1 ? (function () {
                                (function () {
                                    var G__12ø1 = array10ø1.shape[1];
                                    return function loop() {
                                        var recur = loop;
                                        var yø1 = 0;
                                        do {
                                            recur = yø1 < G__12ø1 ? (function () {
                                                (function () {
                                                    return heightmapSet(heightmap, xø1, yø1, (heightmapGet(heightmap, xø1, yø1) - minø1) / spanø1);
                                                })();
                                                return loop[0] = inc(yø1), loop;
                                            })() : void 0;
                                        } while (yø1 = loop[0], recur === loop);
                                        return recur;
                                    }.call(this);
                                }.call(this));
                                return loop[0] = inc(xø1), loop;
                            })() : void 0;
                        } while (xø1 = loop[0], recur === loop);
                        return recur;
                    }.call(this);
                }.call(this);
            }.call(this);
        }.call(this);
    }.call(this);
};
var clampLow = exports.clampLow = function clampLow(heightmap) {
    return function () {
        var minø1 = heightmapMin(heightmap);
        var fixø1 = 0 - minø1;
        return minø1 < 0 ? (function () {
            return function () {
                var array13ø1 = heightmap;
                return function () {
                    var G__14ø1 = array13ø1.shape[0];
                    return function loop() {
                        var recur = loop;
                        var xø1 = 0;
                        do {
                            recur = xø1 < G__14ø1 ? (function () {
                                (function () {
                                    var G__15ø1 = array13ø1.shape[1];
                                    return function loop() {
                                        var recur = loop;
                                        var yø1 = 0;
                                        do {
                                            recur = yø1 < G__15ø1 ? (function () {
                                                (function () {
                                                    return heightmapSet(heightmap, xø1, yø1, heightmapGet(heightmap, xø1, yø1) + fixø1);
                                                })();
                                                return loop[0] = inc(yø1), loop;
                                            })() : void 0;
                                        } while (yø1 = loop[0], recur === loop);
                                        return recur;
                                    }.call(this);
                                }.call(this));
                                return loop[0] = inc(xø1), loop;
                            })() : void 0;
                        } while (xø1 = loop[0], recur === loop);
                        return recur;
                    }.call(this);
                }.call(this);
            }.call(this);
        })() : void 0;
    }.call(this);
};
var clampHigh = exports.clampHigh = function clampHigh(heightmap) {
    return function () {
        var maxø1 = heightmapMax(heightmap);
        return maxø1 > 1 ? (function () {
            return function () {
                var array16ø1 = heightmap;
                return function () {
                    var G__17ø1 = array16ø1.shape[0];
                    return function loop() {
                        var recur = loop;
                        var xø1 = 0;
                        do {
                            recur = xø1 < G__17ø1 ? (function () {
                                (function () {
                                    var G__18ø1 = array16ø1.shape[1];
                                    return function loop() {
                                        var recur = loop;
                                        var yø1 = 0;
                                        do {
                                            recur = yø1 < G__18ø1 ? (function () {
                                                (function () {
                                                    return heightmapSet(heightmap, xø1, yø1, heightmapGet(heightmap, xø1, yø1) / maxø1);
                                                })();
                                                return loop[0] = inc(yø1), loop;
                                            })() : void 0;
                                        } while (yø1 = loop[0], recur === loop);
                                        return recur;
                                    }.call(this);
                                }.call(this));
                                return loop[0] = inc(xø1), loop;
                            })() : void 0;
                        } while (xø1 = loop[0], recur === loop);
                        return recur;
                    }.call(this);
                }.call(this);
            }.call(this);
        })() : void 0;
    }.call(this);
};
var clamp = exports.clamp = function clamp(heightmap) {
    clampLow(heightmap);
    return clampHigh(heightmap);
};
var sanitize = exports.sanitize = function sanitize(heightmap) {
    return front.getInputBoolean('main-settings', 'normalize') ? normalize(heightmap) : clamp(heightmap);
};
var makeHeightmap = exports.makeHeightmap = function makeHeightmap(exponent) {
    return function () {
        var resolutionø1 = Math.pow(2, exponent) + 1;
        return function () {
            var heightmapø1 = ndarray(new Float64Array(resolutionø1 * resolutionø1), [
                resolutionø1,
                resolutionø1
            ]);
            heightmapø1.exponent = exponent;
            heightmapø1.resolution = resolutionø1;
            heightmapø1.last = dec(resolutionø1);
            return heightmapø1;
        }.call(this);
    }.call(this);
};
var topLeftCorner = exports.topLeftCorner = function topLeftCorner(heightmap) {
    return function () {
        var centerø1 = heightmapCenterIndex(heightmap);
        return heightmap.lo(0, 0).hi(inc(centerø1), inc(centerø1));
    }.call(this);
};
var topRightCorner = exports.topRightCorner = function topRightCorner(heightmap) {
    return function () {
        var centerø1 = heightmapCenterIndex(heightmap);
        return heightmap.lo(centerø1, 0).hi(inc(centerø1), inc(centerø1));
    }.call(this);
};
var bottomLeftCorner = exports.bottomLeftCorner = function bottomLeftCorner(heightmap) {
    return function () {
        var centerø1 = heightmapCenterIndex(heightmap);
        return heightmap.lo(0, centerø1).hi(inc(centerø1), inc(centerø1));
    }.call(this);
};
var bottomRightCorner = exports.bottomRightCorner = function bottomRightCorner(heightmap) {
    return function () {
        var centerø1 = heightmapCenterIndex(heightmap);
        return heightmap.lo(centerø1, centerø1).hi(inc(centerø1), inc(centerø1));
    }.call(this);
};
var randomNoise = exports.randomNoise = function randomNoise(heightmap) {
    return function () {
        var array19ø1 = heightmap;
        return function () {
            var G__20ø1 = array19ø1.shape[0];
            return function loop() {
                var recur = loop;
                var xø1 = 0;
                do {
                    recur = xø1 < G__20ø1 ? (function () {
                        (function () {
                            var G__21ø1 = array19ø1.shape[1];
                            return function loop() {
                                var recur = loop;
                                var yø1 = 0;
                                do {
                                    recur = yø1 < G__21ø1 ? (function () {
                                        (function () {
                                            return heightmapSet(heightmap, xø1, yø1, rand());
                                        })();
                                        return loop[0] = inc(yø1), loop;
                                    })() : void 0;
                                } while (yø1 = loop[0], recur === loop);
                                return recur;
                            }.call(this);
                        }.call(this));
                        return loop[0] = inc(xø1), loop;
                    })() : void 0;
                } while (xø1 = loop[0], recur === loop);
                return recur;
            }.call(this);
        }.call(this);
    }.call(this);
};
var mpdInitCorners = exports.mpdInitCorners = function mpdInitCorners(heightmap) {
    return function () {
        var lastø1 = heightmapLastIndex(heightmap);
        heightmapSet(heightmap, 0, 0, rand());
        heightmapSet(heightmap, 0, lastø1, rand());
        heightmapSet(heightmap, lastø1, 0, rand());
        return heightmapSet(heightmap, lastø1, lastø1, rand());
    }.call(this);
};
var mpdDisplace = exports.mpdDisplace = function mpdDisplace(heightmap, spread, spreadReduction) {
    return function () {
        var lastø1 = heightmapLastIndex(heightmap);
        var cø1 = midpoint(0, lastø1);
        var bottomLeftø1 = heightmapGet(heightmap, 0, 0);
        var bottomRightø1 = heightmapGet(heightmap, lastø1, 0);
        var topLeftø1 = heightmapGet(heightmap, 0, lastø1);
        var topRightø1 = heightmapGet(heightmap, lastø1, lastø1);
        var topø1 = average2(topLeftø1, topRightø1);
        var leftø1 = average2(bottomLeftø1, topLeftø1);
        var bottomø1 = average2(bottomLeftø1, bottomRightø1);
        var rightø1 = average2(bottomRightø1, topRightø1);
        var centerø1 = average4(topø1, leftø1, bottomø1, rightø1);
        var nextSpreadø1 = spread * spreadReduction;
        heightmapSetIfUnset(heightmap, cø1, 0, jitter(bottomø1, spread));
        heightmapSetIfUnset(heightmap, cø1, lastø1, jitter(topø1, spread));
        heightmapSetIfUnset(heightmap, 0, cø1, jitter(leftø1, spread));
        heightmapSetIfUnset(heightmap, lastø1, cø1, jitter(rightø1, spread));
        heightmapSetIfUnset(heightmap, cø1, cø1, jitter(centerø1, spread));
        return !(3 == heightmapResolution(heightmap)) ? (function () {
            heightmapSetIfUnset(heightmap, cø1, 0, jitter(bottomø1, spread));
            heightmapSetIfUnset(heightmap, cø1, lastø1, jitter(topø1, spread));
            heightmapSetIfUnset(heightmap, 0, cø1, jitter(leftø1, spread));
            heightmapSetIfUnset(heightmap, lastø1, cø1, jitter(rightø1, spread));
            heightmapSetIfUnset(heightmap, cø1, cø1, jitter(centerø1, spread));
            mpdDisplace(topLeftCorner(heightmap), nextSpreadø1, spreadReduction);
            mpdDisplace(topRightCorner(heightmap), nextSpreadø1, spreadReduction);
            mpdDisplace(bottomLeftCorner(heightmap), nextSpreadø1, spreadReduction);
            return mpdDisplace(bottomRightCorner(heightmap), nextSpreadø1, spreadReduction);
        })() : void 0;
    }.call(this);
};
var midpointDisplacement = exports.midpointDisplacement = function midpointDisplacement(heightmap) {
    return function () {
        var initialSpreadø1 = front.getInputNumber('midpoint-displacement-settings', 'initial-spread');
        var spreadReductionø1 = front.getInputNumber('midpoint-displacement-settings', 'spread-reduction');
        mpdInitCorners(heightmap);
        mpdDisplace(heightmap, initialSpreadø1, spreadReductionø1);
        return sanitize(heightmap);
    }.call(this);
};
var dsInitCorners = exports.dsInitCorners = function dsInitCorners(heightmap) {
    return function () {
        var lastø1 = heightmapLastIndex(heightmap);
        heightmapSet(heightmap, 0, 0, rand());
        heightmapSet(heightmap, 0, lastø1, rand());
        heightmapSet(heightmap, lastø1, 0, rand());
        return heightmapSet(heightmap, lastø1, lastø1, rand());
    }.call(this);
};
var dsSquare = exports.dsSquare = function dsSquare(heightmap, x, y, radius, spread) {
    return function () {
        var newHeightø1 = jitter(average4(heightmapGet(heightmap, x - radius, y - radius), heightmapGet(heightmap, x - radius, y + radius), heightmapGet(heightmap, x + radius, y - radius), heightmapGet(heightmap, x + radius, y + radius)), spread);
        return heightmapSet(heightmap, x, y, newHeightø1);
    }.call(this);
};
var dsDiamond = exports.dsDiamond = function dsDiamond(heightmap, x, y, radius, spread) {
    return function () {
        var newHeightø1 = jitter(safeAverage(heightmapGetSafe(heightmap, x - radius, y), heightmapGetSafe(heightmap, x + radius, y), heightmapGetSafe(heightmap, x, y - radius), heightmapGetSafe(heightmap, x, y + radius)), spread);
        return heightmapSet(heightmap, x, y, newHeightø1);
    }.call(this);
};
var dsSquares = exports.dsSquares = function dsSquares(heightmap, radius, spread) {
    return function () {
        var start23ø1 = radius;
        var end24ø1 = heightmapResolution(heightmap);
        var stride22ø1 = 2 * radius;
        return function loop() {
            var recur = loop;
            var xø1 = start23ø1;
            do {
                recur = xø1 < end24ø1 ? (function () {
                    (function loop() {
                        var recur = loop;
                        var yø1 = start23ø1;
                        do {
                            recur = yø1 < end24ø1 ? (function () {
                                (function () {
                                    return dsSquare(heightmap, xø1, yø1, radius, spread);
                                })();
                                return loop[0] = yø1 + stride22ø1, loop;
                            })() : void 0;
                        } while (yø1 = loop[0], recur === loop);
                        return recur;
                    }.call(this));
                    return loop[0] = xø1 + stride22ø1, loop;
                })() : void 0;
            } while (xø1 = loop[0], recur === loop);
            return recur;
        }.call(this);
    }.call(this);
};
var dsDiamonds = exports.dsDiamonds = function dsDiamonds(heightmap, radius, spread) {
    return function () {
        var sizeø1 = heightmapResolution(heightmap);
        return function () {
            var start26ø1 = 0;
            var end27ø1 = sizeø1;
            var stride25ø1 = radius;
            return function loop() {
                var recur = loop;
                var yø1 = start26ø1;
                do {
                    recur = yø1 < end27ø1 ? (function () {
                        (function () {
                            return function () {
                                var shiftø1 = isEven(yø1 / radius) ? radius : 0;
                                return function () {
                                    var start29ø1 = shiftø1;
                                    var end30ø1 = sizeø1;
                                    var stride28ø1 = 2 * radius;
                                    return function loop() {
                                        var recur = loop;
                                        var xø1 = start29ø1;
                                        do {
                                            recur = xø1 < end30ø1 ? (function () {
                                                (function () {
                                                    return dsDiamond(heightmap, xø1, yø1, radius, spread);
                                                })();
                                                return loop[0] = xø1 + stride28ø1, loop;
                                            })() : void 0;
                                        } while (xø1 = loop[0], recur === loop);
                                        return recur;
                                    }.call(this);
                                }.call(this);
                            }.call(this);
                        })();
                        return loop[0] = yø1 + stride25ø1, loop;
                    })() : void 0;
                } while (yø1 = loop[0], recur === loop);
                return recur;
            }.call(this);
        }.call(this);
    }.call(this);
};
var diamondSquare = exports.diamondSquare = function diamondSquare(heightmap) {
    return function () {
        var initialSpreadø1 = front.getInputNumber('diamond-square-settings', 'initial-spread');
        var spreadReductionø1 = front.getInputNumber('diamond-square-settings', 'spread-reduction');
        var centerø1 = heightmapCenterIndex(heightmap);
        var sizeø1 = heightmap.shape[0];
        dsInitCorners(heightmap);
        (function loop() {
            var recur = loop;
            var radiusø1 = centerø1;
            var spreadø1 = initialSpreadø1;
            do {
                recur = radiusø1 >= 1 ? (function () {
                    dsSquares(heightmap, radiusø1, spreadø1);
                    dsDiamonds(heightmap, radiusø1, spreadø1);
                    return loop[0] = radiusø1 / 2, loop[1] = spreadø1 * spreadReductionø1, loop;
                })() : void 0;
            } while (radiusø1 = loop[0], spreadø1 = loop[1], recur === loop);
            return recur;
        }.call(this));
        return sanitize(heightmap);
    }.call(this);
};
var algorithms = exports.algorithms = {
    'midpoint-displacement': midpointDisplacement,
    'diamond-square': diamondSquare,
    'random-noise': randomNoise
};
var pickAlgorithm = exports.pickAlgorithm = function pickAlgorithm() {
    return (algorithms || 0)[front.getInputString('algorithm-selector', 'generation-algorithm')];
};
var run = exports.run = function run() {
    var scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(100));
    var clock = new THREE.Clock();
    var camera = rend.makeCamera();
    var renderer = rend.makeRenderer();
    var geometry = void 0;
    var plane = void 0;
    scene.add(rend.makeDirectionalLight());
    scene.add(new THREE.AmbientLight(16777215, 0.05));
    var refresh = function refresh() {
        console.log('\n');
        return function () {
            var exponentø1 = front.getInputNumber('main-settings', 'exponent');
            var heightmapø1 = makeHeightmap(exponentø1);
            console.log('Generating terrain...');
            (function () {
                var G__31ø1 = new Date().getTime();
                var G__33ø1 = (function () {
                    return pickAlgorithm()(heightmapø1);
                })();
                var G__32ø1 = new Date().getTime();
                console.log('Elapsed time: ' + (G__32ø1 - G__31ø1) + 'ms.');
                return G__33ø1;
            }.call(this));
            console.log('Rebuilding geometry...');
            (function () {
                var G__34ø1 = new Date().getTime();
                var G__36ø1 = (function () {
                    geometry = rend.makeGeometry(heightmapø1);
                    return rend.updateGeometry(geometry, heightmapø1);
                })();
                var G__35ø1 = new Date().getTime();
                console.log('Elapsed time: ' + (G__35ø1 - G__34ø1) + 'ms.');
                return G__36ø1;
            }.call(this));
            console.log('Rebuilding plane...');
            return function () {
                var G__37ø1 = new Date().getTime();
                var G__39ø1 = (function () {
                    scene.remove(plane);
                    plane = rend.makePlane(geometry);
                    return scene.add(plane);
                })();
                var G__38ø1 = new Date().getTime();
                console.log('Elapsed time: ' + (G__38ø1 - G__37ø1) + 'ms.');
                return G__39ø1;
            }.call(this);
        }.call(this);
    };
    front.showAlgorithmSettings();
    $('#generation-algorithm').change(front.showAlgorithmSettings);
    rend.attachToDom(renderer, refresh);
    refresh();
    var controls = rend.makeControls(camera, renderer);
    var render = function render() {
        return function () {
            var deltaø1 = clock.getDelta();
            requestAnimationFrame(render);
            controls.update(deltaø1);
            return renderer.render(scene, camera);
        }.call(this);
    };
    render();
    return void 0;
};
window.onload = function () {
    return run();
};


},{"./frontend":4,"./rendering":6,"ndarray":3}],6:[function(require,module,exports){
{
    var _ns_ = {
        id: 'ymir.rendering',
        doc: void 0
    };
    var ymir_frontend = require('./frontend');
    var front = ymir_frontend;
}
var width = exports.width = 800 - 2;
var height = exports.height = 500;
var terrainHeight = exports.terrainHeight = 50;
var terrainSize = exports.terrainSize = 100;
var makeDirectionalLight = exports.makeDirectionalLight = function makeDirectionalLight() {
    return function () {
        var lightø1 = new THREE.DirectionalLight(16777215, 1);
        lightø1.position.set(100, 50, 150);
        return lightø1;
    }.call(this);
};
var makeCamera = exports.makeCamera = function makeCamera() {
    return function () {
        var cameraø1 = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
        cameraø1.position.set(0, -100, 150);
        return cameraø1;
    }.call(this);
};
var makeRenderer = exports.makeRenderer = function makeRenderer() {
    return function () {
        var rendererø1 = new THREE.WebGLRenderer({ 'antialias': false });
        rendererø1.setClearColor(16777215);
        rendererø1.setSize(width, height);
        rendererø1.setPixelRatio(2);
        return rendererø1;
    }.call(this);
};
var makeGeometry = exports.makeGeometry = function makeGeometry(heightmap) {
    return function () {
        var resolutionø1 = heightmap.shape[0];
        var geometryø1 = new THREE.PlaneGeometry(terrainSize, terrainSize, resolutionø1 - 1, resolutionø1 - 1);
        return geometryø1;
    }.call(this);
};
var makeControls = exports.makeControls = function makeControls(camera, renderer) {
    return function () {
        var controlsø1 = new THREE.TrackballControls(camera, renderer.domElement);
        controlsø1.rotateSpeed = 1.4;
        controlsø1.zoomSpeed = 0.5;
        controlsø1.staticMoving = true;
        controlsø1.dynamicDampingFactor = 0.3;
        return controlsø1;
    }.call(this);
};
var makePlane = exports.makePlane = function makePlane(geometry) {
    return function () {
        var materialø1 = new THREE.MeshLambertMaterial({
            'wireframe': front.getInputBoolean('main-settings', 'wireframe'),
            'wireframeLinewidth': front.getInputNumber('main-settings', 'wireframe-width'),
            'color': 47872
        });
        return new THREE.Mesh(geometry, materialø1);
    }.call(this);
};
var attachToDom = exports.attachToDom = function attachToDom(renderer, refreshFn) {
    $('#render').append(renderer.domElement);
    (function () {
        var cancelScrollø1 = function (e) {
            return e.preventDefault();
        };
        renderer.domElement.onmousewheel = cancelScrollø1;
        return renderer.domElement.addEventListener('MozMousePixelScroll', cancelScrollø1, false);
    }.call(this));
    return $('#regenerate').click(refreshFn);
};
var updateGeometry = exports.updateGeometry = function updateGeometry(geometry, heightmap) {
    (function loop() {
        var recur = loop;
        var iø1 = 0;
        do {
            recur = iø1 < geometry.vertices.length ? (function () {
                geometry.vertices[iø1].z = terrainHeight * heightmap.data[iø1];
                return loop[0] = iø1 + 1, loop;
            })() : void 0;
        } while (iø1 = loop[0], recur === loop);
        return recur;
    }.call(this));
    geometry.computeVertexNormals();
    return geometry;
};


},{"./frontend":4}]},{},[5]);
