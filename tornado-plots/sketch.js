let _reads, _redraw, _ori;
let _rateNoise, _lRate, _rRate;
let _overcutRate, _overcutExpt;
let _undercutRate;
let _block1Loc, _block2Loc;
let _block1Pause, _block2Pause;
let _population, _seconds;
let _firingModel, _halfLife, _firingProb;
let _numReads;

let _genomeLength = 100000;
let _nBins = 100;

let w = 1000;
let h = 800;
let pad = 10;

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

function computeReadTimesExponential() {
    let result = new Array();
    n = _population.value();
    hl = _halfLife.value();
    sec = _seconds.value();
    under = _undercutRate.value();
    ts = 0.05;

    lt = hl / Math.log(2);

    for (t = 0; n > 0 && t <= sec; t += ts) {
        if (lt == 0) {
            p = 1.0;
        } else {
            p = ts/lt;
        }

        fired = 0;
        for (i = 0; i < n; i++) {
            if (random() < p) {
                fired += 1;
                if (!(random() < under)) { result.push(sec - t); }
                if (!(random() < under)) { result.push(sec - t); }
            }
        }
        n -= fired;
    }

    return result;
}

function computeReadTimesLinear() {
    // https://cabot-institute.blogspot.com/2016/12/converting-probabilities-between-time.html
    let result = new Array();
    n = _population.value();
    fp = _firingProb.value();
    sec = _seconds.value();
    under = _undercutRate.value();

    ts = 0.05;
    fp = (1 - ((1 - fp)**(ts/1)));

    for (t = 0; n > 0 && t <= sec; t+= ts) {
        m = n;
        for (i = 0; i < m; i++) {
            if (random() < fp) {
                n -= 1;
                if (!(random() < under)) { result.push(sec - t); }
                if (!(random() < under)) { result.push(sec - t); }
            }
        }
    }

    return result;
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

function generateReads() {
    let reads = new Array();

    ori = _ori.value();
    lRate = _lRate.value();
    rRate = _rRate.value();
    seconds = _seconds.value();
    overcutRate = _overcutRate.value();
    overcutExpt = _overcutExpt.value();
    if (_firingModel.value() == 'e') {
        times = computeReadTimesExponential();
    } else if (_firingModel.value() == 'l') {
        times = computeReadTimesLinear();
    }
    _numReads.html(times.length + " reads");

    for (i = 0; i < times.length; i++) {
        r = generateRead(ori, lRate, rRate, times[i]);
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

function computeReadCount() {
    pop = _population.value();
    sec = _seconds.value();
    hl = _halfLife.value();
    under = _undercutRate.value();

    // N(t) = N₀(1/2)^(t/hl)
    unfired = Math.ceil(pop * ((1/2) ** (sec / hl)));
    fired = pop - unfired;
    reads = 2 * fired;
    reads *= (1 - under);

    return Math.ceil(reads);
}

function rerender() {
    reads = generateReads();
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
        ph = (h-pad)/hist.length;
        y = (h - pad) - map_range(i, 0, hist.length, 0, h - pad) - ph;
        rect(800, y, 300 * hist[i], ph);
    }
}

function sliderLabel(name, val) {
    return name + ': ' + val;
}

function makeSlider(name, x, y, minVal, maxVal, defaultVal) {
    let step = 1;
    if (maxVal <= 1) {
        step = 0.01;
    } else if (maxVal <= 100) {
        step = 0.1;
    }

    let s = createSlider(minVal, maxVal, defaultVal, step);
    s.size(w/2)
    s.position(x, y);
    let label = createSpan(sliderLabel(name, s.value()));
    label.position(s.x + s.width + 10, y);
    label.size(300);

    s.input(function() { label.html(sliderLabel(name, this.value())); rerender(); });
    return s;
}

function setup() {
    createCanvas(w, h);

    x = 10;
    y = 10;
    _population = makeSlider("cells", x, y, 0, 3000, 500); y += 20;
    _seconds = makeSlider("synthesis time", x, y, 0, 30, 10); y += 20;


    y += 10;
    _firingModel = createRadio();
    _firingModel.option('e', 'exponential firing');
    _firingModel.option('l', 'linear firing');
    _firingModel.position(x, y);
    _firingModel.size(400);
    _firingModel.selected('e');
    _firingModel.input(rerender);
    y += 20;
    _halfLife = makeSlider("firing half-life", x, y, 0.0, 30, 5); y += 20;
    _firingProb = makeSlider("firing probability", x, y, 0, 1, 0.1); y += 20;
    _ori = makeSlider("ori", x, y, 0, _genomeLength, _genomeLength / 2); y += 20;
    _lRate = makeSlider("left fork rate", x, y, 0, 10000, 2000); y += 20;
    _rRate = makeSlider("right fork rate", x, y, 0, 10000, 2000); y += 20;
    _rateNoise = makeSlider("rate noise", x, y, 0, 1.0, 0.1); y += 20;
    _undercutRate = makeSlider("undercut rate", x, y, 0, 1, 0); y += 20;
    _overcutRate = makeSlider("overcut rate", x, y, 0, 1, 0); y += 20;
    _overcutExpt = makeSlider("overcut expt", x, y, 1, 4, 1); y += 20;
    _block1Loc = makeSlider("block 1 location ", x, y, 0, _genomeLength, _genomeLength * 1/3); y += 20;
    _block1Pause = makeSlider("block 1 pause length", x, y, 0, 30, 0); y += 20;
    _block2Loc = makeSlider("block 2 location ", x, y, 0, _genomeLength, _genomeLength * 2/3); y += 20;
    _block2Pause = makeSlider("block 2 pause length", x, y, 0, 30, 0); y += 20;

    y += 10;
    _redraw = createButton('regen');
    _redraw.position(x, y);
    _redraw.mousePressed(rerender);

    _numReads = createSpan("reads");
    _numReads.position(x, h-pad-10);
    _numReads.size(200);

    rerender();
}
