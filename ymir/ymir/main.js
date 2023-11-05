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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFub255bW91cy53aXNwIl0sIm5hbWVzIjpbIl9uc18iLCJpZCIsImRvYyIsImluYyIsImV4cG9ydHMiLCJ4IiwiZGVjIiwibWlkcG9pbnQiLCJhIiwiYiIsImF2ZXJhZ2UyIiwiYXZlcmFnZTQiLCJjIiwiZCIsInNhZmVBdmVyYWdlIiwidG90YWzDuDEiLCJjb3VudMO4MSIsImlzRXZlbiIsIm4iLCJpc09kZCIsInJhbmQiLCJNYXRoIiwicmFuZG9tIiwicmFuZEFyb3VuZFplcm8iLCJzcHJlYWQiLCJqaXR0ZXIiLCJ2YWx1ZSIsImhlaWdodG1hcFJlc29sdXRpb24iLCJoZWlnaHRtYXAiLCJzaGFwZSIsImhlaWdodG1hcExhc3RJbmRleCIsImhlaWdodG1hcENlbnRlckluZGV4IiwiaGVpZ2h0bWFwR2V0IiwieSIsImdldCIsImhlaWdodG1hcEdldFNhZmUiLCJsYXN0w7gxIiwiaGVpZ2h0bWFwU2V0IiwidmFsIiwic2V0IiwiaGVpZ2h0bWFwU2V0SWZVbnNldCIsImhlaWdodG1hcE1heCIsIm1heMO4MSIsIkluZmluaXR5IiwiZWzDuDEiLCJoZWlnaHRtYXBNaW4iLCJtaW7DuDEiLCJub3JtYWxpemUiLCJzcGFuw7gxIiwieMO4MSIsInnDuDEiLCJjbGFtcExvdyIsImZpeMO4MSIsImNsYW1wSGlnaCIsImNsYW1wIiwic2FuaXRpemUiLCJmcm9udC5nZXRJbnB1dEJvb2xlYW4iLCJtYWtlSGVpZ2h0bWFwIiwiZXhwb25lbnQiLCJyZXNvbHV0aW9uw7gxIiwicG93IiwiaGVpZ2h0bWFww7gxIiwibmRhcnJheSIsIkZsb2F0NjRBcnJheSIsInJlc29sdXRpb24iLCJsYXN0IiwidG9wTGVmdENvcm5lciIsImNlbnRlcsO4MSIsImxvIiwiaGkiLCJ0b3BSaWdodENvcm5lciIsImJvdHRvbUxlZnRDb3JuZXIiLCJib3R0b21SaWdodENvcm5lciIsInJhbmRvbU5vaXNlIiwibXBkSW5pdENvcm5lcnMiLCJtcGREaXNwbGFjZSIsInNwcmVhZFJlZHVjdGlvbiIsImPDuDEiLCJib3R0b21MZWZ0w7gxIiwiYm90dG9tUmlnaHTDuDEiLCJ0b3BMZWZ0w7gxIiwidG9wUmlnaHTDuDEiLCJ0b3DDuDEiLCJsZWZ0w7gxIiwiYm90dG9tw7gxIiwicmlnaHTDuDEiLCJuZXh0U3ByZWFkw7gxIiwibWlkcG9pbnREaXNwbGFjZW1lbnQiLCJpbml0aWFsU3ByZWFkw7gxIiwiZnJvbnQuZ2V0SW5wdXROdW1iZXIiLCJzcHJlYWRSZWR1Y3Rpb27DuDEiLCJkc0luaXRDb3JuZXJzIiwiZHNTcXVhcmUiLCJyYWRpdXMiLCJuZXdIZWlnaHTDuDEiLCJkc0RpYW1vbmQiLCJkc1NxdWFyZXMiLCJkc0RpYW1vbmRzIiwic2l6ZcO4MSIsInNoaWZ0w7gxIiwiZGlhbW9uZFNxdWFyZSIsInJhZGl1c8O4MSIsInNwcmVhZMO4MSIsImFsZ29yaXRobXMiLCJwaWNrQWxnb3JpdGhtIiwiZnJvbnQuZ2V0SW5wdXRTdHJpbmciLCJydW4iLCJzY2VuZSIsIlRIUkVFIiwiU2NlbmUiLCJhZGQiLCJBeGlzSGVscGVyIiwiY2xvY2siLCJDbG9jayIsImNhbWVyYSIsInJlbmQubWFrZUNhbWVyYSIsInJlbmRlcmVyIiwicmVuZC5tYWtlUmVuZGVyZXIiLCJnZW9tZXRyeSIsInBsYW5lIiwicmVuZC5tYWtlRGlyZWN0aW9uYWxMaWdodCIsIkFtYmllbnRMaWdodCIsInJlZnJlc2giLCJleHBvbmVudMO4MSIsInJlbmQubWFrZUdlb21ldHJ5IiwicmVuZC51cGRhdGVHZW9tZXRyeSIsInJlbW92ZSIsInJlbmQubWFrZVBsYW5lIiwiZnJvbnQuc2hvd0FsZ29yaXRobVNldHRpbmdzIiwiJCIsImNoYW5nZSIsInJlbmQuYXR0YWNoVG9Eb20iLCJjb250cm9scyIsInJlbmQubWFrZUNvbnRyb2xzIiwicmVuZGVyIiwiZGVsdGHDuDEiLCJnZXREZWx0YSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInVwZGF0ZSIsIndpbmRvdyIsIm9ubG9hZCJdLCJtYXBwaW5ncyI6IjtJQUFBLElBQUNBLEksR0FBRDtBQUFB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QixFQUZJO0FBQUEsWUFHSixPQUFDbkIsUUFBQSxDQUFTa0IsTUFBVixDQUFpQjNCLEtBQWpCLEVBQXVCTyxNQUF2QixFQUhJO0FBQUEsUyxLQUFOLEMsSUFBQTtBQUFBLEtBREYsQztJQU1Db0IsTUFBRCxHOztDQXJERixDO0FBd0RNSyxNQUFBLENBQU9DLE1BQWIsR0FBb0IsWUFBTztBQUFBLFdBQUNsQyxHQUFEO0FBQUEsQ0FBM0IiLCJzb3VyY2VzQ29udGVudCI6WyIobnMgeW1pci5tYWluXG4gICg6cmVxdWlyZSBbbmRhcnJheV1cbiAgICAgICAgICAgIFt5bWlyLmZyb250ZW5kIDphcyBmcm9udF1cbiAgICAgICAgICAgIFt5bWlyLnJlbmRlcmluZyA6YXMgcmVuZF0pKVxuXG5cbjsgR2VuZXJhbCBVdGlsaXRpZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbihkZWZtYWNybyB3aGVuIFtjb25kaXRpb24gJiBib2R5XVxuICBgKGlmIH5jb25kaXRpb25cbiAgICAgKGRvIH5AYm9keSkpKVxuXG4oZGVmbWFjcm8gd2hlbi1ub3QgW2NvbmRpdGlvbiAmIGJvZHldXG4gIGAod2hlbiAobm90IH5jb25kaXRpb24pXG4gICAgIH5AYm9keSkpXG5cbihkZWZtYWNybyAtPiBbJiBvcGVyYXRpb25zXVxuICAocmVkdWNlXG4gICAgKGZuIFtmb3JtIG9wZXJhdGlvbl1cbiAgICAgIChjb25zIChmaXJzdCBvcGVyYXRpb24pXG4gICAgICAgICAgICAoY29ucyBmb3JtIChyZXN0IG9wZXJhdGlvbikpKSlcbiAgICAoZmlyc3Qgb3BlcmF0aW9ucylcbiAgICAocmVzdCBvcGVyYXRpb25zKSkpXG5cblxuKGRlZm4gaW5jIFt4XVxuICAoKyB4IDEpKVxuXG4oZGVmbiBkZWMgW3hdXG4gICgtIHggMSkpXG5cblxuKGRlZm1hY3JvIGRvLXRpbWVzIFt2YXJuYW1lIGxpbWl0ICYgYm9keV1cbiAgKGxldCBbZW5kIChnZW5zeW0pXVxuICAgIGAobGV0IFt+ZW5kIH5saW1pdF1cbiAgICAgICAobG9vcCBbfnZhcm5hbWUgMF1cbiAgICAgICAgICh3aGVuICg8IH52YXJuYW1lIH5lbmQpXG4gICAgICAgICAgIH5AYm9keVxuICAgICAgICAgICAocmVjdXIgKGluYyB+dmFybmFtZSkpKSkpKSlcblxuKGRlZm1hY3JvIGRvLXN0cmlkZSBbdmFybmFtZXMgc3RhcnQtZm9ybSBlbmQtZm9ybSBzdHJpZGUtZm9ybSAmIGJvZHldXG4gIChsZXQgW3N0cmlkZSAoZ2Vuc3ltIFwic3RyaWRlXCIpXG4gICAgICAgIHN0YXJ0IChnZW5zeW0gXCJzdGFydFwiKVxuICAgICAgICBlbmQgKGdlbnN5bSBcImVuZFwiKVxuICAgICAgICBidWlsZCAoZm4gYnVpbGQgW3ZhcnNdXG4gICAgICAgICAgICAgICAgKGlmIChlbXB0eT8gdmFycylcbiAgICAgICAgICAgICAgICAgIGAoZG8gfkBib2R5KVxuICAgICAgICAgICAgICAgICAgKGxldCBbdmFybmFtZSAoZmlyc3QgdmFycyldXG4gICAgICAgICAgICAgICAgICAgIGAobG9vcCBbfnZhcm5hbWUgfnN0YXJ0XVxuICAgICAgICAgICAgICAgICAgICAgICAod2hlbiAoPCB+dmFybmFtZSB+ZW5kKVxuICAgICAgICAgICAgICAgICAgICAgICAgIH4oYnVpbGQgKHJlc3QgdmFycykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKHJlY3VyICgrIH52YXJuYW1lIH5zdHJpZGUpKSkpKSkpXVxuICAgIDsgRml4IHRoZSBudW1iZXJzIG9uY2Ugb3V0c2lkZSB0aGUgbmVzdGVkIGxvb3BzLFxuICAgIDsgYW5kIHRoZW4gYnVpbGQgdGhlIGd1dHMuXG4gICAgYChsZXQgW35zdGFydCB+c3RhcnQtZm9ybVxuICAgICAgICAgICB+ZW5kIH5lbmQtZm9ybVxuICAgICAgICAgICB+c3RyaWRlIH5zdHJpZGUtZm9ybV1cbiAgICAgICB+KGJ1aWxkIHZhcm5hbWVzKSkpKVxuXG5cbihkZWZtYWNybyBkby1uZGFycmF5IFt2YXJzIGFycmF5LWZvcm0gJiBib2R5XVxuICAobGV0IFthcnJheS12YXIgKGdlbnN5bSBcImFycmF5XCIpXG4gICAgICAgIGJ1aWxkIChmbiBidWlsZCBbdmFycyBuXVxuICAgICAgICAgICAgICAgIChpZiAoZW1wdHk/IHZhcnMpXG4gICAgICAgICAgICAgICAgICBgKGRvIH5AYm9keSlcbiAgICAgICAgICAgICAgICAgIGAoZG8tdGltZXMgfihmaXJzdCB2YXJzKSAoYWdldCAoLi1zaGFwZSB+YXJyYXktdmFyKSB+bilcbiAgICAgICAgICAgICAgICAgICAgIH4oYnVpbGQgKHJlc3QgdmFycykgKGluYyBuKSkpKSldXG4gICAgYChsZXQgW35hcnJheS12YXIgfmFycmF5LWZvcm1dXG4gICAgICAgfihidWlsZCB2YXJzIDApKSkpXG5cbihkZWZtYWNybyBkby1uZGFycmF5LWVsIFtlbGVtZW50IGFycmF5LWZvcm0gJiBib2R5XVxuICAobGV0IFtpbmRleCAoZ2Vuc3ltIFwiaW5kZXhcIilcbiAgICAgICAgYXJyYXkgKGdlbnN5bSBcImFycmF5XCIpXVxuICAgIGAobGV0IFt+YXJyYXkgfmFycmF5LWZvcm1dXG4gICAgICAgKGRvLXRpbWVzIH5pbmRleCAoLi1sZW5ndGggKC4tZGF0YSB+YXJyYXkpKVxuICAgICAgICAgKGxldCBbfmVsZW1lbnQgKGFnZXQgKC4tZGF0YSB+YXJyYXkpIH5pbmRleCldXG4gICAgICAgICAgIH5AYm9keSkpKSkpXG5cblxuKGRlZm1hY3JvIGluYyEgW3BsYWNlXVxuICBgKHNldCEgfnBsYWNlIChpbmMgfnBsYWNlKSkpXG5cbihkZWZtYWNybyBhZGQhIFtwbGFjZSBhbW91bnRdXG4gIGAoc2V0ISB+cGxhY2UgKCsgfnBsYWNlIH5hbW91bnQpKSlcblxuXG4oZGVmbWFjcm8gbCBbJiBmb3Jtc11cbiAgYChjb25zb2xlLmxvZyB+QGZvcm1zKSlcblxuKGRlZm1hY3JvIHRpbWUgWyYgYm9keV1cbiAgKGxldCBbc3RhcnQgKGdlbnN5bSlcbiAgICAgICAgZW5kIChnZW5zeW0pXG4gICAgICAgIHJlc3VsdCAoZ2Vuc3ltKV1cbiAgICBgKGxldCBbfnN0YXJ0ICguZ2V0VGltZSAobmV3IERhdGUpKVxuICAgICAgICAgICB+cmVzdWx0IChkbyB+QGJvZHkpXG4gICAgICAgICAgIH5lbmQgKC5nZXRUaW1lIChuZXcgRGF0ZSkpXVxuICAgICAgIChsICgrIFwiRWxhcHNlZCB0aW1lOiBcIiAoLSB+ZW5kIH5zdGFydCkgXCJtcy5cIikpXG4gICAgICAgfnJlc3VsdCkpKVxuXG5cbihkZWZuIG1pZHBvaW50IFthIGJdXG4gICgvICgrIGEgYikgMikpXG5cbihkZWZuIGF2ZXJhZ2UyIFthIGJdXG4gICgvICgrIGEgYikgMikpXG5cbihkZWZuIGF2ZXJhZ2U0IFthIGIgYyBkXVxuICAoLyAoKyBhIGIgYyBkKSA0KSlcblxuKGRlZm4gc2FmZS1hdmVyYWdlIFthIGIgYyBkXVxuICAobGV0IFt0b3RhbCAwIGNvdW50IDBdXG4gICAgKHdoZW4gYSAoYWRkISB0b3RhbCBhKSAoaW5jISBjb3VudCkpXG4gICAgKHdoZW4gYiAoYWRkISB0b3RhbCBiKSAoaW5jISBjb3VudCkpXG4gICAgKHdoZW4gYyAoYWRkISB0b3RhbCBjKSAoaW5jISBjb3VudCkpXG4gICAgKHdoZW4gZCAoYWRkISB0b3RhbCBkKSAoaW5jISBjb3VudCkpXG4gICAgKC8gdG90YWwgY291bnQpKSlcblxuXG4oZGVmbiBldmVuPyBbbl1cbiAgKD09IDAgKG1vZCBuIDIpKSlcblxuKGRlZm4gb2RkPyBbbl1cbiAgKD09IDEgKG1vZCBuIDIpKSlcblxuXG47IFJhbmRvbW5lc3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4oZGVmbiByYW5kIFtdXG4gIChNYXRoLnJhbmRvbSkpXG5cbihkZWZuIHJhbmQtYXJvdW5kLXplcm8gW3NwcmVhZF1cbiAgKC0gKCogc3ByZWFkIChyYW5kKSAyKSBzcHJlYWQpKVxuXG4oZGVmbiBqaXR0ZXIgW3ZhbHVlIHNwcmVhZF1cbiAgKCsgdmFsdWUgKHJhbmQtYXJvdW5kLXplcm8gc3ByZWFkKSkpXG5cblxuOyBIZWlnaHRtYXAgSGVscGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKGRlZm4gaGVpZ2h0bWFwLXJlc29sdXRpb24gW2hlaWdodG1hcF1cbiAgKGFnZXQgaGVpZ2h0bWFwLnNoYXBlIDApKVxuXG4oZGVmbiBoZWlnaHRtYXAtbGFzdC1pbmRleCBbaGVpZ2h0bWFwXVxuICAoZGVjIChoZWlnaHRtYXAtcmVzb2x1dGlvbiBoZWlnaHRtYXApKSlcblxuKGRlZm4gaGVpZ2h0bWFwLWNlbnRlci1pbmRleCBbaGVpZ2h0bWFwXVxuICAobWlkcG9pbnQgMCAoaGVpZ2h0bWFwLWxhc3QtaW5kZXggaGVpZ2h0bWFwKSkpXG5cblxuKGRlZm4gaGVpZ2h0bWFwLWdldCBbaGVpZ2h0bWFwIHggeV1cbiAgKC5nZXQgaGVpZ2h0bWFwIHggeSkpXG5cbihkZWZuIGhlaWdodG1hcC1nZXQtc2FmZSBbaGVpZ2h0bWFwIHggeV1cbiAgKGxldCBbbGFzdCAoaGVpZ2h0bWFwLWxhc3QtaW5kZXggaGVpZ2h0bWFwKV1cbiAgICAod2hlbiAoYW5kICg8PSAwIHggbGFzdClcbiAgICAgICAgICAgICAgICg8PSAwIHkgbGFzdCkpXG4gICAgICAoaGVpZ2h0bWFwLWdldCBoZWlnaHRtYXAgeCB5KSkpKVxuXG4oZGVmbiBoZWlnaHRtYXAtc2V0ISBbaGVpZ2h0bWFwIHggeSB2YWxdXG4gICguc2V0IGhlaWdodG1hcCB4IHkgdmFsKSlcblxuKGRlZm4gaGVpZ2h0bWFwLXNldC1pZi11bnNldCEgW2hlaWdodG1hcCB4IHkgdmFsXVxuICAod2hlbiAoPT0gMCAoaGVpZ2h0bWFwLWdldCBoZWlnaHRtYXAgeCB5KSlcbiAgICAoaGVpZ2h0bWFwLXNldCEgaGVpZ2h0bWFwIHggeSB2YWwpKSlcblxuXG4oZGVmbiBoZWlnaHRtYXAtbWF4IFtoZWlnaHRtYXBdXG4gIChsZXQgW21heCAoLSBJbmZpbml0eSldXG4gICAgKGRvLW5kYXJyYXktZWwgZWwgaGVpZ2h0bWFwXG4gICAgICAod2hlbiAoPCBtYXggZWwpIChzZXQhIG1heCBlbCkpKVxuICAgIG1heCkpXG5cbihkZWZuIGhlaWdodG1hcC1taW4gW2hlaWdodG1hcF1cbiAgKGxldCBbbWluIEluZmluaXR5XVxuICAgIChkby1uZGFycmF5LWVsIGVsIGhlaWdodG1hcFxuICAgICAgKHdoZW4gKD4gbWluIGVsKSAoc2V0ISBtaW4gZWwpKSlcbiAgICBtaW4pKVxuXG5cbihkZWZuIG5vcm1hbGl6ZSBbaGVpZ2h0bWFwXVxuICAobGV0IFttYXggKC0gSW5maW5pdHkpXG4gICAgICAgIG1pbiBJbmZpbml0eV1cbiAgICAoZG8tbmRhcnJheS1lbCBlbCBoZWlnaHRtYXBcbiAgICAgICh3aGVuICg8IG1heCBlbCkgKHNldCEgbWF4IGVsKSlcbiAgICAgICh3aGVuICg+IG1pbiBlbCkgKHNldCEgbWluIGVsKSkpXG4gICAgKGxldCBbc3BhbiAoLSBtYXggbWluKV1cbiAgICAgIChkby1uZGFycmF5IFt4IHldIGhlaWdodG1hcFxuICAgICAgICAoaGVpZ2h0bWFwLXNldCEgaGVpZ2h0bWFwIHggeVxuICAgICAgICAgICAgICAgICAgICAgICAgKC8gKC0gKGhlaWdodG1hcC1nZXQgaGVpZ2h0bWFwIHggeSkgbWluKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BhbikpKSkpKVxuXG4oZGVmbiBjbGFtcC1sb3cgW2hlaWdodG1hcF1cbiAgKGxldCBbbWluIChoZWlnaHRtYXAtbWluIGhlaWdodG1hcClcbiAgICAgICAgZml4ICgtIG1pbildXG4gICAgKHdoZW4gKDwgbWluIDApXG4gICAgICAoZG8tbmRhcnJheSBbeCB5XSBoZWlnaHRtYXBcbiAgICAgICAgKGhlaWdodG1hcC1zZXQhIGhlaWdodG1hcCB4IHlcbiAgICAgICAgICAgICAgICAgICAgICAgICgrIChoZWlnaHRtYXAtZ2V0IGhlaWdodG1hcCB4IHkpIGZpeCkpKSkpKVxuXG4oZGVmbiBjbGFtcC1oaWdoIFtoZWlnaHRtYXBdXG4gIChsZXQgW21heCAoaGVpZ2h0bWFwLW1heCBoZWlnaHRtYXApXVxuICAgICh3aGVuICg+IG1heCAxKVxuICAgICAgKGRvLW5kYXJyYXkgW3ggeV0gaGVpZ2h0bWFwXG4gICAgICAgIChoZWlnaHRtYXAtc2V0ISBoZWlnaHRtYXAgeCB5XG4gICAgICAgICAgICAgICAgICAgICAgICAoLyAoaGVpZ2h0bWFwLWdldCBoZWlnaHRtYXAgeCB5KSBtYXgpKSkpKSlcblxuKGRlZm4gY2xhbXAgW2hlaWdodG1hcF1cbiAgKGNsYW1wLWxvdyBoZWlnaHRtYXApXG4gIChjbGFtcC1oaWdoIGhlaWdodG1hcCkpXG5cblxuKGRlZm4gc2FuaXRpemUgW2hlaWdodG1hcF1cbiAgKGlmIChmcm9udC9nZXQtaW5wdXQtYm9vbGVhbiBcIm1haW4tc2V0dGluZ3NcIiBcIm5vcm1hbGl6ZVwiKVxuICAgIChub3JtYWxpemUgaGVpZ2h0bWFwKVxuICAgIChjbGFtcCBoZWlnaHRtYXApKSlcblxuXG4oZGVmbiBtYWtlLWhlaWdodG1hcCBbZXhwb25lbnRdXG4gIChsZXQgW3Jlc29sdXRpb24gKCsgKE1hdGgucG93IDIgZXhwb25lbnQpIDEpXVxuICAgIChsZXQgW2hlaWdodG1hcCAobmRhcnJheSAobmV3IEZsb2F0NjRBcnJheSAoKiByZXNvbHV0aW9uIHJlc29sdXRpb24pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcmVzb2x1dGlvbiByZXNvbHV0aW9uXSldXG4gICAgICAoc2V0ISBoZWlnaHRtYXAuZXhwb25lbnQgZXhwb25lbnQpXG4gICAgICAoc2V0ISBoZWlnaHRtYXAucmVzb2x1dGlvbiByZXNvbHV0aW9uKVxuICAgICAgKHNldCEgaGVpZ2h0bWFwLmxhc3QgKGRlYyByZXNvbHV0aW9uKSlcbiAgICAgIGhlaWdodG1hcCkpKVxuXG5cbihkZWZuIHRvcC1sZWZ0LWNvcm5lciBbaGVpZ2h0bWFwXVxuICAobGV0IFtjZW50ZXIgKGhlaWdodG1hcC1jZW50ZXItaW5kZXggaGVpZ2h0bWFwKV1cbiAgICAoLT4gaGVpZ2h0bWFwXG4gICAgICAoLmxvIDAgMClcbiAgICAgICguaGkgKGluYyBjZW50ZXIpIChpbmMgY2VudGVyKSkpKSlcblxuKGRlZm4gdG9wLXJpZ2h0LWNvcm5lciBbaGVpZ2h0bWFwXVxuICAobGV0IFtjZW50ZXIgKGhlaWdodG1hcC1jZW50ZXItaW5kZXggaGVpZ2h0bWFwKV1cbiAgICAoLT4gaGVpZ2h0bWFwXG4gICAgICAoLmxvIGNlbnRlciAwKVxuICAgICAgKC5oaSAoaW5jIGNlbnRlcikgKGluYyBjZW50ZXIpKSkpKVxuXG4oZGVmbiBib3R0b20tbGVmdC1jb3JuZXIgW2hlaWdodG1hcF1cbiAgKGxldCBbY2VudGVyIChoZWlnaHRtYXAtY2VudGVyLWluZGV4IGhlaWdodG1hcCldXG4gICAgKC0+IGhlaWdodG1hcFxuICAgICAgKC5sbyAwIGNlbnRlcilcbiAgICAgICguaGkgKGluYyBjZW50ZXIpIChpbmMgY2VudGVyKSkpKSlcblxuKGRlZm4gYm90dG9tLXJpZ2h0LWNvcm5lciBbaGVpZ2h0bWFwXVxuICAobGV0IFtjZW50ZXIgKGhlaWdodG1hcC1jZW50ZXItaW5kZXggaGVpZ2h0bWFwKV1cbiAgICAoLT4gaGVpZ2h0bWFwXG4gICAgICAoLmxvIGNlbnRlciBjZW50ZXIpXG4gICAgICAoLmhpIChpbmMgY2VudGVyKSAoaW5jIGNlbnRlcikpKSkpXG5cblxuOyBSYW5kb20gTm9pc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKGRlZm4gcmFuZG9tLW5vaXNlIFtoZWlnaHRtYXBdXG4gIChkby1uZGFycmF5IFt4IHldIGhlaWdodG1hcFxuICAgIChoZWlnaHRtYXAtc2V0ISBoZWlnaHRtYXAgeCB5IChyYW5kKSkpKVxuXG5cbjsgTWlkcG9pbnQgRGlzcGxhY2VtZW50IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbihkZWZuIG1wZC1pbml0LWNvcm5lcnMgW2hlaWdodG1hcF1cbiAgKGxldCBbbGFzdCAoaGVpZ2h0bWFwLWxhc3QtaW5kZXggaGVpZ2h0bWFwKV1cbiAgICAoaGVpZ2h0bWFwLXNldCEgaGVpZ2h0bWFwIDAgICAgMCAgICAocmFuZCkpXG4gICAgKGhlaWdodG1hcC1zZXQhIGhlaWdodG1hcCAwICAgIGxhc3QgKHJhbmQpKVxuICAgIChoZWlnaHRtYXAtc2V0ISBoZWlnaHRtYXAgbGFzdCAwICAgIChyYW5kKSlcbiAgICAoaGVpZ2h0bWFwLXNldCEgaGVpZ2h0bWFwIGxhc3QgbGFzdCAocmFuZCkpKSlcblxuKGRlZm4gbXBkLWRpc3BsYWNlIFtoZWlnaHRtYXAgc3ByZWFkIHNwcmVhZC1yZWR1Y3Rpb25dXG4gIChsZXQgW2xhc3QgKGhlaWdodG1hcC1sYXN0LWluZGV4IGhlaWdodG1hcClcbiAgICAgICAgYyAobWlkcG9pbnQgMCBsYXN0KVxuXG4gICAgICAgIGJvdHRvbS1sZWZ0ICAoaGVpZ2h0bWFwLWdldCBoZWlnaHRtYXAgMCAgICAwKVxuICAgICAgICBib3R0b20tcmlnaHQgKGhlaWdodG1hcC1nZXQgaGVpZ2h0bWFwIGxhc3QgMClcbiAgICAgICAgdG9wLWxlZnQgICAgIChoZWlnaHRtYXAtZ2V0IGhlaWdodG1hcCAwICAgIGxhc3QpXG4gICAgICAgIHRvcC1yaWdodCAgICAoaGVpZ2h0bWFwLWdldCBoZWlnaHRtYXAgbGFzdCBsYXN0KVxuXG4gICAgICAgIHRvcCAgICAoYXZlcmFnZTIgdG9wLWxlZnQgdG9wLXJpZ2h0KVxuICAgICAgICBsZWZ0ICAgKGF2ZXJhZ2UyIGJvdHRvbS1sZWZ0IHRvcC1sZWZ0KVxuICAgICAgICBib3R0b20gKGF2ZXJhZ2UyIGJvdHRvbS1sZWZ0IGJvdHRvbS1yaWdodClcbiAgICAgICAgcmlnaHQgIChhdmVyYWdlMiBib3R0b20tcmlnaHQgdG9wLXJpZ2h0KVxuICAgICAgICBjZW50ZXIgKGF2ZXJhZ2U0IHRvcCBsZWZ0IGJvdHRvbSByaWdodClcblxuICAgICAgICBuZXh0LXNwcmVhZCAoKiBzcHJlYWQgc3ByZWFkLXJlZHVjdGlvbildXG4gICAgKGhlaWdodG1hcC1zZXQtaWYtdW5zZXQhIGhlaWdodG1hcCBjICAgIDAgICAgKGppdHRlciBib3R0b20gc3ByZWFkKSlcbiAgICAoaGVpZ2h0bWFwLXNldC1pZi11bnNldCEgaGVpZ2h0bWFwIGMgICAgbGFzdCAoaml0dGVyIHRvcCBzcHJlYWQpKVxuICAgIChoZWlnaHRtYXAtc2V0LWlmLXVuc2V0ISBoZWlnaHRtYXAgMCAgICBjICAgIChqaXR0ZXIgbGVmdCBzcHJlYWQpKVxuICAgIChoZWlnaHRtYXAtc2V0LWlmLXVuc2V0ISBoZWlnaHRtYXAgbGFzdCBjICAgIChqaXR0ZXIgcmlnaHQgc3ByZWFkKSlcbiAgICAoaGVpZ2h0bWFwLXNldC1pZi11bnNldCEgaGVpZ2h0bWFwIGMgICAgYyAgICAoaml0dGVyIGNlbnRlciBzcHJlYWQpKVxuICAgICh3aGVuLW5vdCAoPT0gMyAoaGVpZ2h0bWFwLXJlc29sdXRpb24gaGVpZ2h0bWFwKSlcbiAgICAgIChtcGQtZGlzcGxhY2UgKHRvcC1sZWZ0LWNvcm5lciBoZWlnaHRtYXApIG5leHQtc3ByZWFkIHNwcmVhZC1yZWR1Y3Rpb24pXG4gICAgICAobXBkLWRpc3BsYWNlICh0b3AtcmlnaHQtY29ybmVyIGhlaWdodG1hcCkgbmV4dC1zcHJlYWQgc3ByZWFkLXJlZHVjdGlvbilcbiAgICAgIChtcGQtZGlzcGxhY2UgKGJvdHRvbS1sZWZ0LWNvcm5lciBoZWlnaHRtYXApIG5leHQtc3ByZWFkIHNwcmVhZC1yZWR1Y3Rpb24pXG4gICAgICAobXBkLWRpc3BsYWNlIChib3R0b20tcmlnaHQtY29ybmVyIGhlaWdodG1hcCkgbmV4dC1zcHJlYWQgc3ByZWFkLXJlZHVjdGlvbikpKSlcblxuKGRlZm4gbWlkcG9pbnQtZGlzcGxhY2VtZW50IFtoZWlnaHRtYXBdXG4gIChsZXQgW2luaXRpYWwtc3ByZWFkIChmcm9udC9nZXQtaW5wdXQtbnVtYmVyIFwibWlkcG9pbnQtZGlzcGxhY2VtZW50LXNldHRpbmdzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpbml0aWFsLXNwcmVhZFwiKVxuICAgICAgICBzcHJlYWQtcmVkdWN0aW9uIChmcm9udC9nZXQtaW5wdXQtbnVtYmVyIFwibWlkcG9pbnQtZGlzcGxhY2VtZW50LXNldHRpbmdzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNwcmVhZC1yZWR1Y3Rpb25cIildXG4gICAgKG1wZC1pbml0LWNvcm5lcnMgaGVpZ2h0bWFwKVxuICAgIChtcGQtZGlzcGxhY2UgaGVpZ2h0bWFwIGluaXRpYWwtc3ByZWFkIHNwcmVhZC1yZWR1Y3Rpb24pXG4gICAgKHNhbml0aXplIGhlaWdodG1hcCkpKVxuXG5cbjsgRGlhbW9uZC1TcXVhcmUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbihkZWZuIGRzLWluaXQtY29ybmVycyBbaGVpZ2h0bWFwXVxuICAobGV0IFtsYXN0IChoZWlnaHRtYXAtbGFzdC1pbmRleCBoZWlnaHRtYXApXVxuICAgIChoZWlnaHRtYXAtc2V0ISBoZWlnaHRtYXAgMCAgICAwICAgIChyYW5kKSlcbiAgICAoaGVpZ2h0bWFwLXNldCEgaGVpZ2h0bWFwIDAgICAgbGFzdCAocmFuZCkpXG4gICAgKGhlaWdodG1hcC1zZXQhIGhlaWdodG1hcCBsYXN0IDAgICAgKHJhbmQpKVxuICAgIChoZWlnaHRtYXAtc2V0ISBoZWlnaHRtYXAgbGFzdCBsYXN0IChyYW5kKSkpKVxuXG4oZGVmbiBkcy1zcXVhcmUgW2hlaWdodG1hcCB4IHkgcmFkaXVzIHNwcmVhZF1cbiAgKGxldCBbbmV3LWhlaWdodCAoaml0dGVyXG4gICAgICAgICAgICAgICAgICAgICAoYXZlcmFnZTRcbiAgICAgICAgICAgICAgICAgICAgICAgKGhlaWdodG1hcC1nZXQgaGVpZ2h0bWFwICgtIHggcmFkaXVzKSAoLSB5IHJhZGl1cykpXG4gICAgICAgICAgICAgICAgICAgICAgIChoZWlnaHRtYXAtZ2V0IGhlaWdodG1hcCAoLSB4IHJhZGl1cykgKCsgeSByYWRpdXMpKVxuICAgICAgICAgICAgICAgICAgICAgICAoaGVpZ2h0bWFwLWdldCBoZWlnaHRtYXAgKCsgeCByYWRpdXMpICgtIHkgcmFkaXVzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGhlaWdodG1hcC1nZXQgaGVpZ2h0bWFwICgrIHggcmFkaXVzKSAoKyB5IHJhZGl1cykpKVxuICAgICAgICAgICAgICAgICAgICAgc3ByZWFkKV1cbiAgICAoaGVpZ2h0bWFwLXNldCEgaGVpZ2h0bWFwIHggeSBuZXctaGVpZ2h0KSkpXG5cbihkZWZuIGRzLWRpYW1vbmQgW2hlaWdodG1hcCB4IHkgcmFkaXVzIHNwcmVhZF1cbiAgKGxldCBbbmV3LWhlaWdodCAoaml0dGVyXG4gICAgICAgICAgICAgICAgICAgICAoc2FmZS1hdmVyYWdlXG4gICAgICAgICAgICAgICAgICAgICAgIChoZWlnaHRtYXAtZ2V0LXNhZmUgaGVpZ2h0bWFwICgtIHggcmFkaXVzKSB5KVxuICAgICAgICAgICAgICAgICAgICAgICAoaGVpZ2h0bWFwLWdldC1zYWZlIGhlaWdodG1hcCAoKyB4IHJhZGl1cykgeSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGhlaWdodG1hcC1nZXQtc2FmZSBoZWlnaHRtYXAgeCAoLSB5IHJhZGl1cykpXG4gICAgICAgICAgICAgICAgICAgICAgIChoZWlnaHRtYXAtZ2V0LXNhZmUgaGVpZ2h0bWFwIHggKCsgeSByYWRpdXMpKSlcbiAgICAgICAgICAgICAgICAgICAgIHNwcmVhZCldXG4gICAgKGhlaWdodG1hcC1zZXQhIGhlaWdodG1hcCB4IHkgbmV3LWhlaWdodCkpKVxuXG5cbihkZWZuIGRzLXNxdWFyZXMgW2hlaWdodG1hcCByYWRpdXMgc3ByZWFkXVxuICAoZG8tc3RyaWRlIFt4IHldIHJhZGl1cyAoaGVpZ2h0bWFwLXJlc29sdXRpb24gaGVpZ2h0bWFwKSAoKiAyIHJhZGl1cylcbiAgICAoZHMtc3F1YXJlIGhlaWdodG1hcCB4IHkgcmFkaXVzIHNwcmVhZCkpKVxuXG4oZGVmbiBkcy1kaWFtb25kcyBbaGVpZ2h0bWFwIHJhZGl1cyBzcHJlYWRdXG4gIChsZXQgW3NpemUgKGhlaWdodG1hcC1yZXNvbHV0aW9uIGhlaWdodG1hcCldXG4gICAgKGRvLXN0cmlkZSBbeV0gMCBzaXplIHJhZGl1c1xuICAgICAgKGxldCBbc2hpZnQgKGlmIChldmVuPyAoLyB5IHJhZGl1cykpIHJhZGl1cyAwKV1cbiAgICAgICAgKGRvLXN0cmlkZSBbeF0gc2hpZnQgc2l6ZSAoKiAyIHJhZGl1cylcbiAgICAgICAgICAoZHMtZGlhbW9uZCBoZWlnaHRtYXAgeCB5IHJhZGl1cyBzcHJlYWQpKSkpKSlcblxuKGRlZm4gZGlhbW9uZC1zcXVhcmUgW2hlaWdodG1hcF1cbiAgKGxldCBbaW5pdGlhbC1zcHJlYWQgKGZyb250L2dldC1pbnB1dC1udW1iZXIgXCJkaWFtb25kLXNxdWFyZS1zZXR0aW5nc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5pdGlhbC1zcHJlYWRcIilcbiAgICAgICAgc3ByZWFkLXJlZHVjdGlvbiAoZnJvbnQvZ2V0LWlucHV0LW51bWJlciBcImRpYW1vbmQtc3F1YXJlLXNldHRpbmdzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNwcmVhZC1yZWR1Y3Rpb25cIilcbiAgICAgICAgY2VudGVyIChoZWlnaHRtYXAtY2VudGVyLWluZGV4IGhlaWdodG1hcClcbiAgICAgICAgc2l6ZSAoYWdldCBoZWlnaHRtYXAuc2hhcGUgMCldXG4gICAgKGRzLWluaXQtY29ybmVycyBoZWlnaHRtYXApXG4gICAgKGxvb3AgW3JhZGl1cyBjZW50ZXJcbiAgICAgICAgICAgc3ByZWFkIGluaXRpYWwtc3ByZWFkXVxuICAgICAgKHdoZW4gKD49IHJhZGl1cyAxKVxuICAgICAgICAoZHMtc3F1YXJlcyBoZWlnaHRtYXAgcmFkaXVzIHNwcmVhZClcbiAgICAgICAgKGRzLWRpYW1vbmRzIGhlaWdodG1hcCByYWRpdXMgc3ByZWFkKVxuICAgICAgICAocmVjdXIgKC8gcmFkaXVzIDIpXG4gICAgICAgICAgICAgICAoKiBzcHJlYWQgc3ByZWFkLXJlZHVjdGlvbikpKSlcbiAgICAoc2FuaXRpemUgaGVpZ2h0bWFwKSkpXG5cblxuOyBNYWluIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuOyBBbGwgY29kZSBiZWxvdyBoZXJlIGlzIGhhY2t5IGZyb250ZW5kIGdhcmJhZ2UsIHBsZWFzZSBkb24ndCBqdWRnZSBtZS5cblxuKGRlZiBhbGdvcml0aG1zXG4gIHs6bWlkcG9pbnQtZGlzcGxhY2VtZW50IG1pZHBvaW50LWRpc3BsYWNlbWVudFxuICAgOmRpYW1vbmQtc3F1YXJlIGRpYW1vbmQtc3F1YXJlXG4gICA6cmFuZG9tLW5vaXNlIHJhbmRvbS1ub2lzZX0pXG5cbihkZWZuIHBpY2stYWxnb3JpdGhtIFtdXG4gIChnZXQgYWxnb3JpdGhtc1xuICAgICAgIChmcm9udC9nZXQtaW5wdXQtc3RyaW5nIFwiYWxnb3JpdGhtLXNlbGVjdG9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImdlbmVyYXRpb24tYWxnb3JpdGhtXCIpKSlcblxuXG4oZGVmbiBydW4gW11cbiAgKGRlZiBzY2VuZSAobmV3IFRIUkVFLlNjZW5lKSlcbiAgKHNjZW5lLmFkZCAobmV3IFRIUkVFLkF4aXNIZWxwZXIgMTAwKSlcblxuICAoZGVmIGNsb2NrIChuZXcgVEhSRUUuQ2xvY2spKVxuICAoZGVmIGNhbWVyYSAocmVuZC9tYWtlLWNhbWVyYSkpXG4gIChkZWYgcmVuZGVyZXIgKHJlbmQvbWFrZS1yZW5kZXJlcikpXG5cbiAgKGRlZiBnZW9tZXRyeSlcbiAgKGRlZiBwbGFuZSlcblxuICAoc2NlbmUuYWRkIChyZW5kL21ha2UtZGlyZWN0aW9uYWwtbGlnaHQpKVxuICAoc2NlbmUuYWRkIChuZXcgVEhSRUUuQW1iaWVudExpZ2h0IDB4ZmZmZmZmIDAuMDUpKVxuXG4gIChkZWZuIHJlZnJlc2ggW11cbiAgICAobCBcIlxcblwiKVxuICAgIChsZXQgW2V4cG9uZW50IChmcm9udC9nZXQtaW5wdXQtbnVtYmVyIFwibWFpbi1zZXR0aW5nc1wiIFwiZXhwb25lbnRcIilcbiAgICAgICAgICBoZWlnaHRtYXAgKG1ha2UtaGVpZ2h0bWFwIGV4cG9uZW50KV1cbiAgICAgIChsIFwiR2VuZXJhdGluZyB0ZXJyYWluLi4uXCIpXG4gICAgICAodGltZVxuICAgICAgICAoKHBpY2stYWxnb3JpdGhtKSBoZWlnaHRtYXApKVxuXG4gICAgICA7IFJlYnVpbGQgdGhlIGdlb21ldHJ5IHdpdGggdGhlIHZhbHVlcyBmcm9tIHRoZSBoZWlnaHRtYXAuICBBY3R1YWxseSB3ZVxuICAgICAgOyBuZWVkIHRvIHVzZSBhbiBlbnRpcmVseSBuZXcgR2VvbWV0cnkgYmVjYXVzZSBUaHJlZS5qcyBkb2Vzbid0IHNlZW0gdG9cbiAgICAgIDsgbGV0IHVzIGNoYW5nZSB0aGUgcmVzb2x1dGlvbiBhZnRlciB3ZSd2ZSBtYWRlIGl0LlxuICAgICAgKGwgXCJSZWJ1aWxkaW5nIGdlb21ldHJ5Li4uXCIpXG4gICAgICAodGltZVxuICAgICAgICAoc2V0ISBnZW9tZXRyeSAocmVuZC9tYWtlLWdlb21ldHJ5IGhlaWdodG1hcCkpXG4gICAgICAgIChyZW5kL3VwZGF0ZS1nZW9tZXRyeSBnZW9tZXRyeSBoZWlnaHRtYXApKVxuXG4gICAgICA7IFJlbW92ZSB0aGUgb2xkIHBsYW5lIGZyb20gdGhlIHNjZW5lIGFuZCBhZGQgYSBuZXcgb25lIGZvciB0aGUgbmV3bHlcbiAgICAgIDsgYnVpbHQgZ2VvbWV0cnkuXG4gICAgICAobCBcIlJlYnVpbGRpbmcgcGxhbmUuLi5cIilcbiAgICAgICh0aW1lXG4gICAgICAgIChzY2VuZS5yZW1vdmUgcGxhbmUpXG4gICAgICAgIChzZXQhIHBsYW5lIChyZW5kL21ha2UtcGxhbmUgZ2VvbWV0cnkpKVxuICAgICAgICAoc2NlbmUuYWRkIHBsYW5lKSkpKVxuXG4gIDsgV2hlbiB0aGUgYWxnb3JpdGhtIGNoYW5nZXMgd2Ugd2FudCB0byB1cGRhdGUgdGhlIHNldHRpbmdzIHBhbmVsLlxuICAoZnJvbnQvc2hvdy1hbGdvcml0aG0tc2V0dGluZ3MpXG4gICguY2hhbmdlICgkIFwiI2dlbmVyYXRpb24tYWxnb3JpdGhtXCIpIGZyb250L3Nob3ctYWxnb3JpdGhtLXNldHRpbmdzKVxuXG4gIChyZW5kL2F0dGFjaC10by1kb20gcmVuZGVyZXIgcmVmcmVzaClcbiAgKHJlZnJlc2gpXG5cbiAgKGRlZiBjb250cm9scyAocmVuZC9tYWtlLWNvbnRyb2xzIGNhbWVyYSByZW5kZXJlcikpXG5cbiAgKGRlZm4gcmVuZGVyIFtdXG4gICAgKGxldCBbZGVsdGEgKGNsb2NrLmdldERlbHRhKV1cbiAgICAgIChyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcmVuZGVyKVxuICAgICAgKC51cGRhdGUgY29udHJvbHMgZGVsdGEpXG4gICAgICAocmVuZGVyZXIucmVuZGVyIHNjZW5lIGNhbWVyYSkpKVxuXG4gIChyZW5kZXIpXG4gIG5pbClcblxuKHNldCEgd2luZG93Lm9ubG9hZCAoZm4gW10gKHJ1bikpKVxuXG47IHZpbTogbHcrPWRvLXRpbWVzIGx3Kz1kby1uZGFycmF5IGx3Kz1kby1uZGFycmF5LWVsIGx3Kz1kby1zdHJpZGUgOlxuIl19
