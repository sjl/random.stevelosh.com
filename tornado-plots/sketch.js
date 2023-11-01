let _reads, _numReads, _redraw, _ori, _rateNoise, _lRate, _rRate, _seconds, _overcutRate, _overcutExpt;
let _block1Loc, _block2Loc;
let _block1Pause, _block2Pause;

let _genomeLength = 100000;

function handleBlock(ori, rate, t, block) {
    if (rate < 0 && block.loc < ori || rate > 0 && block.loc > ori) {
        tPre = min(Math.abs((ori - block.loc) / rate), t);
        tPost = t - tPre;
        return tPre + max(tPost - block.pause, 0);
    } else {
        return t;
    }
}

function handleBlocks(ori, rate, t, blocks) {
    t = handleBlock(ori, rate, t, blocks[0]);
    t = handleBlock(ori, rate, t, blocks[1]); // i'm lazy
    return t;
}

function generateRead(ori, lRate, rRate, t) {
    noise = _rateNoise.value();

    lRate = -lRate;

    lRate += lRate * random(-noise, noise);
    rRate += rRate * random(-noise, noise);

    b1Loc = _block1Loc.value();
    b1Pause = _block1Pause.value();
    b2Loc = _block2Loc.value();
    b2Pause = _block2Pause.value();

    if (Math.abs(ori - b1Loc) > Math.abs(ori - b2Loc)) { // normalize so b1 = closest
        tmp = b1Loc;
        b1Loc = b2Loc;
        b2Loc = tmp;
        tmp = b1Pause;
        b1Pause = b2Pause;
        b2Pause = tmp;
    }

    blocks = [
        {loc: b1Loc, pause: b1Pause},
        {loc: b2Loc, pause: b2Pause},
    ];

    tl = handleBlocks(ori, lRate, t, blocks);
    tr = handleBlocks(ori, rRate, t, blocks);

    lLen = lRate * tl;
    rLen = rRate * tr;

    return {
        start: ori + lLen,
        end:   ori + rLen,
    };
}

function generateReads(n) {
    let reads = new Array();

    ori = _ori.value();
    lRate = _lRate.value();
    rRate = _rRate.value();
    seconds = _seconds.value();
    overcutRate = _overcutRate.value();
    overcutExpt = _overcutExpt.value();
    for (i = 0; i < n; i++) {
        r = generateRead(ori, lRate, rRate, random() * seconds);
        if (random() < overcutRate) {
            cutLen = random()**overcutExpt * (r.end - r.start);

            if (random() < 0.5) {
                cut = r.start + cutLen;
            } else {
                cut = r.end - cutLen;
            }

            reads.push({
                start: r.start,
                end: cut,
            });
            reads.push({
                start: cut,
                end: r.end,
            });
        } else {
            reads.push(r);
        }
    }

    return reads;
}

let _nBins = 100;

function lengthHist(reads) {
    let bins = new Array(_nBins).fill(0);
    let binWidth = _genomeLength / _nBins;

    for (i = 0; i < reads.length; i++) {
        l = reads[i].end - reads[i].start;
        bins[Math.floor(l / binWidth)] += 1;
    }

    for (i = 0; i < bins.length; i++) {
        bins[i] /= reads.length;
    }

    return bins;
}

let w = 1000;
let h = 700;
let pad = 10;

function map_range(value, fromLo, fromHi, toLo, toHi) {
    return toLo + (toHi - toLo) * (value - fromLo) / (fromHi - fromLo);
}

function clamp(value, lo, hi) {
    return min(hi, max(lo, value));
}

function plotRead(r) {
    xs = clamp(map_range(r.start, 0, _genomeLength, 0, w), 0, w);
    xe = clamp(map_range(r.end, 0, _genomeLength, 0, w), 0, w);
    y = (h-pad)-map_range(r.end-r.start, 0, _genomeLength, 0, h - pad) - 1;
    rect(xs, y, max(xe-xs, 1), 1);
}

function rerender() {
    reads = generateReads(_numReads.value());
    console.log("Redrawing");

    // BG
    background(220);
    stroke(1);
    strokeWeight(3);
    line(0, h - pad, w, h - pad);

    // Ori
    x = map_range(_ori.value(), 0, _genomeLength, 0, w);
    line(x, h - 2*pad, x, h);

    // Block 1
    x = map_range(_block1Loc.value(), 0, _genomeLength, 0, w);

    noStroke();
    fill(0, 0, 0, 255);
    text("B1", x, h-pad-10);

    strokeWeight(3);
    stroke(255, 0, 0);
    line(x, h - pad - 5, x, h - pad + 5);

    strokeWeight(1);
    drawingContext.setLineDash([5, 5]);
    line(x, 0, x, h);
    drawingContext.setLineDash([]);

    // Block 2
    x = map_range(_block2Loc.value(), 0, _genomeLength, 0, w)

    noStroke();
    text("B2", x, h-pad-10);

    strokeWeight(3);
    stroke(255, 100, 100);
    line(x, h - pad - 5, x, h - pad + 5);

    strokeWeight(1);
    drawingContext.setLineDash([5, 5]);
    line(x, 0, x, h);
    drawingContext.setLineDash([]);

    // Reads
    noStroke();
    fill(0, 0, 255, 50);
    reads.forEach(plotRead);

    // Hist
    strokeWeight(1);
    stroke(0, 0, 0);
    hist = lengthHist(reads);
    for (i = 0; i < hist.length; i++) {
        y = (h - pad) - map_range(i, 0, hist.length, 0, h - pad) - 5;
        rect(800, y, 300 * hist[i], 5);
    }
}

function sliderLabel(name, val) {
    return name + ': ' + val;
}

function makeSlider(name, y, minVal, maxVal, defaultVal) {
    let step = 1;
    if (maxVal <= 1) {
        step = 0.01;
    } else if (maxVal <= 100) {
        step = 0.1;
    }

    let s = createSlider(minVal, maxVal, defaultVal, step);
    s.size(w/2)
    s.position(0, y);
    let label = createSpan(sliderLabel(name, s.value()));
    label.position(s.x + s.width + 10, y);
    label.size(300);

    s.input(function() { label.html(sliderLabel(name, this.value())); rerender(); });
    return s;
}

function setup() {
    createCanvas(w, h);

    y = 0;
    _numReads = makeSlider("# of reads", y, 0, 1000, 300); y += 20;
    _ori = makeSlider("ori", y, 0, _genomeLength, _genomeLength / 2); y += 20;
    _lRate = makeSlider("left fork rate", y, 0, 10000, 2000); y += 20;
    _rRate = makeSlider("right fork rate", y, 0, 10000, 2000); y += 20;
    _rateNoise = makeSlider("rate noise", y, 0, 1.0, 0.1); y += 20;
    _seconds = makeSlider("synthesis time", y, 0, 30, 10); y += 20;
    _overcutRate = makeSlider("overcut rate", y, 0, 1, 0); y += 20;
    _overcutExpt = makeSlider("overcut expt", y, 1, 4, 1); y += 20;
    _block1Loc = makeSlider("block 1 location ", y, 0, _genomeLength, _genomeLength * 1/3); y += 20;
    _block1Pause = makeSlider("block 1 pause length", y, 0, 30, 0); y += 20;
    _block2Loc = makeSlider("block 2 location ", y, 0, _genomeLength, _genomeLength * 2/3); y += 20;
    _block2Pause = makeSlider("block 2 pause length", y, 0, 30, 0); y += 20;

    _redraw = createButton('regen');
    _redraw.position(0, y);
    _redraw.mousePressed(rerender);

    rerender();
}
