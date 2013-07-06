/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-7-5
 * Time: 上午10:34
 * To change this template use File | Settings | File Templates.
 */
function _extends(sub, super_, props) {
    sub.prototype = Object.create(super_.prototype);
    if (props) {
        for (var i in props) {
            sub.prototype[i] = props[i];
        }
    }
    sub.prototype.constructor = sub;
    return sub;
}
function each(array, fn, bind) {
    if (!bind) {
        bind = this;
    }
    var str = '';
    for (var i = 0, len = array.length; i < len; i++) {
        str += fn.call(bind, array[i], i) + '\n';
    }
}

function CreateAdapter() {
}
CreateAdapter.prototype.createSprite = function (div, imgpath) {
    var img = document.createElement('img');
    img.src = imgpath;
    div.appendChild(img);
}

function FlashContext() {
    this.mAlpha = 1;
    this.alphaStack = [];
}
FlashContext.prototype.alpha = function (a) {
    if (arguments.length == 1) {
        this.mAlpha = a;
    } else {
        return this.mAlpha;
    }
}
FlashContext.prototype.reset = function () {
    this.mAlpha = 1;
    this.alphaStack.splice(0, this.alphaStack.length);
}
FlashContext.prototype.mulAlpha = function (a) {
    this.mAlpha *= a;
}
FlashContext.prototype.pushContext = function () {
    this.alphaStack.push(this.mAlpha);
}
FlashContext.prototype.popContext = function () {
    this.mAlpha = this.alphaStack.pop();
}
/**
 * drawable node, wrapper of html div or image
 * @constructor
 */
function Node(htmlelement) {
    this.element = htmlelement
    this.c = '';
    this.r = '';
    this.s = '';
    this.t = '';
//    this.element.setAttribute('id', new Date().getTime());
//    console.log(this.element);
}
Node.prototype.init = function (browser) {
    switch (browser) {
        case 'ff':// firefox
            this.transProp = 'MozTransform';
            this.originProp = 'MozTransformOrigin';
            break;
        case 'webkit':// Safari and Chrome
            this.transProp = 'webkitTransform';
            this.originProp = 'webkitTransformOrigin';
            break;
        case 'ie':
            this.transProp = 'msTransform';
            this.originProp = 'msTransformOrigin';
            break;
        case 'opera':
            this.transProp = 'OTransform';
            this.originProp = 'OTransformOrigin';
            break;
    }
}
Node.prototype.center = function (x, y) {
    this.c = [x, 'px ', y, 'px'].join('');
}
Node.prototype.rotate = function (r) {
    this.r = ['rotate(', r, 'deg)'].join('');
}
Node.prototype.scale = function (sx, sy) {
    this.s = ['scale(', sx, ',', sy, ')'].join('');
}
Node.prototype.translate = function (tx, ty) {
    this.t = ['translate(', tx, 'px,', ty, 'px)'].join('');
}
Node.prototype.apply = function (position) {
    this.center(position.cx, position.cy);
    this.scale(position.sx, position.sy);
    this.rotate(position.r);
    this.translate(position.x - position.cx, position.y - position.cy);

    this.element.style[this.originProp] = this.c;
    this.element.style[this.transProp] = [this.t, this.r, this.s].join(' ');
    this.element.style['opacity'] = position.a;
}
Node.prototype.node = function () {
    return this.element;
}
Node.prototype.addChild = function (node) {
    this.element.appendChild(node.element);
}
Node.prototype.removeChildren = function () {
    var from = this.element.childNodes;
    for (var i = 0, length = from.length; i < length; i++) {
        this.element.removeChild(from[i]);
    }
}
Node.prototype.setVisible = function (visible) {
    this.visible = visible;
    if(visible) {
        this.element.style.display = 'block';
    } else {
        this.element.style.display = 'none';
    }
}
Node.prototype.appendChildren = function (node) {
    var from = node.element.childNodes;
    for (var i = 0, length = from.length; i < length; i++) {
        this.element.appendChild(from[i]);
    }
}

/**
 * data bean, keep all kind of translate param in it
 * @constructor
 */
function Position() {
    this.x = this.y = 0;
    this.sx = this.sy = 1;
    this.cx = this.cy = 0;
    this.r = 0;
    this.a = 1;
}
_extends(Position, XMLInteract);
Position.prototype.init = function (p) {
    this.x = p.x;
    this.y = p.y;
    this.cx = p.cx;
    this.cy = p.cy;
    this.sx = p.sx;
    this.sy = p.sy;
    this.r = p.r;
    this.a = p.a;
}
Position.prototype.toString = function () {
    return ['P:{', this.x, this.y, this.cx, this.cy , this.sx, this.sy, this.r, this.a, '}'].join(' ');
}
Position.prototype.center = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
}
Position.prototype.translate = function (x, y) {
    this.x = x;
    this.y = y;
}
Position.prototype.scale = function (sx, sy) {
    this.sx = sx;
    this.sy = sy;
}
Position.prototype.rotate = function (r) {
    this.r = r;
}
Position.prototype.alpha = function (a) {
    this.a = a;
}
Position.prototype.initAttr = function (key, value) {
    switch (key) {
        case 'x':
            this.x = parseFloat(value);
            break;
        case 'y':
            this.y = parseFloat(value);
            break;
        case 'scale':
            var arr = value.split(',');
            this.sx = parseFloat(arr[0]);
            this.sy = parseFloat(arr[1]);
            break;
        case 'center':
            var arr = value.split(',');
            this.cx = parseFloat(arr[0]);
            this.cy = parseFloat(arr[1]);
            break;
        case 'rotation':
            this.r = parseFloat(value) / Math.PI * 180;
            break;
    }
}

function XMLInteract() {

}
XMLInteract.prototype.initAttr = function (key, valu) {
}
XMLInteract.prototype.startParse = function (name) {
    return 0;
}
XMLInteract.prototype.endParse = function (name) {
}

/**
 * an animation frame
 * @constructor
 */
function Frame() {
    this.animationTip = this.TIP_NONE;
    this.animationType = this.ANIMATION_NONE;
    this.position = new Position();
    this.drawable = -1;// drawable refer index

    this.start = 0;
    this.duration = 0;

    this.rotationCycles = this.rotationDirection = 0;
    this.alpha = 1;
}
_extends(Frame, XMLInteract);
Frame.prototype.ANIMATION_NONE = 0;
Frame.prototype.ANIMATION_MOTION = 1;
Frame.prototype.ANIMATION_SHAPE = 2;

Frame.prototype.TIP_NONE = 0;
Frame.prototype.TIP_TRANSLATE = 1;
Frame.prototype.TIP_SCALE = 1 << 1;
Frame.prototype.TIP_ROTATE = 1 << 2;
Frame.prototype.TIP_TRANSLATE_CENTER = 1 << 3;
Frame.prototype.interpratef = function (p, f1, f2) {
    return f1 + (f2 - f1) * p;
}
/**
 * @param percent
 * @param f1
 * @param f2
 * @param p output object
 * @param context
 */
Frame.prototype.interprate = function (percent, f1, f2, p) {
    var p1 = f1.position;
    var p2 = f2.position;
    var i = this.interpratef;
    if (f1.animationTip & this.TIP_TRANSLATE) {
        p.translate(i(percent, p1.x, p2.x), i(percent, p1.y, p2.y));
    }
    if (f1.animationTip & this.TIP_SCALE) {
        p.scale(i(percent, p1.sx, p2.sx), i(percent, p1.sy, p2.sy));
    }
    if (f1.animationTip & this.TIP_ROTATE) {
        p.rotate(this.interprateRotate(percent, f1, f2));
    }
    if (f1.animationTip & this.TIP_TRANSLATE_CENTER) {
        p.center(i(percent, p1.cx, p2.cx), i(percent, p1.cy, p2.cy));
    }
    p.alpha(i(percent, f1.alpha, f2.alpha));
}
Frame.prototype.interprateRotate = function (percent, f1, f2) {
    var gap = f2.position.r - f1.position.r;
    if (f1.rotationDirection == 0) {
        if (gap < -180) {
            gap += 360;
        } else if (gap > 180) {
            gap -= 360;
        }
    } else if (f1.rotationDirection == 1) {
        if (gap < 0) {
            gap += 360;
        }
    } else {
        if (gap > 0) {
            gap -= 360;
        }
    }
    return f1.position.r + (f1.rotationCycles * 360 + gap) * percent;
}
Frame.prototype.getEnd = function () {
    return this.start + this.duration;
}
Frame.prototype.initAnimaTip = function (previous, current) {
    var _f = Frame.prototype;
    if (previous.animationType != _f.ANIMATION_MOTION) {
        return;
    }
    var p1 = previous.position;
    var p2 = current.position;
    if (p1.x != p2.x || p1.y != p2.y) {
        previous.animationTip |= _f.TIP_TRANSLATE;
    }
    if (p1.sx != p2.sx || p1.sy != p2.sy) {
        previous.animationTip |= _f.TIP_SCALE;
    }
    if (p1.cx != p2.cx || p1.cy != p2.cy) {
        previous.animationTip |= _f.TIP_TRANSLATE_CENTER;
    }
    if (p1.r != p2.r || previous.rotationCycles != 0) {
        previous.animationTip |= _f.TIP_ROTATE;
    }
}
Frame.prototype.initAttr = function (key, value) {
    if (key == 'drawable') {
        this.drawable = parseInt(value);
    } else if (key == 'start') {
        this.start = parseInt(value);
    } else if (key == 'duration') {
        this.duration = parseInt(value);
    } else if (key == 'animation') {
        if (value == 'none') {
            this.animationType = this.ANIMATION_NONE;
        } else if (value == 'motion') {
            this.animationType = this.ANIMATION_MOTION;
        } else {
            this.animationType = this.ANIMATION_SHAPE;
        }
    } else if (key == 'rotationDirection') {
        this.rotationDirection = parseInt(value);
    } else if (key == 'rotationCycles') {
        this.rotationCycles = parseInt(value);
    } else if (key == 'alpha') {
        this.alpha = parseFloat(value);
    }
}
Frame.prototype.startParse = function (name) {
    if (name == 'position') {
        return this.position;
    }
    return null;
}
Frame.prototype.endParse = function (name) {
    this.position.alpha(this.alpha);
}
Frame.prototype.isVisiable = function () {
    return this.drawable >= 0;
}

function Flash() {
    this.width = this.height = 0;
    this.framerate = 24;
    this.symbols = [];
    this.resourcePath = '';
}
_extends(Flash, XMLInteract);
Flash.prototype.addSymbol = function (symbol) {
    this.symbols.push(symbol);
}
Flash.prototype.findSymbol = function (index) {
    return this.symbols[index];
}
Flash.prototype.getImgPath = function (name) {
    if (this.resourcePath.length == 0) {
        return name;
    }
    return this.resourcePath + '/' + name;
}
Flash.prototype.createInstance = function (adapter) {
    var ins = new FlashInstance(this, this.createMain(adapter));
    ins.updateToFrame(0);
    return ins;
}
Flash.prototype.createSequence = function (index, adapter) {
    return this.symbols[index].createSequence(adapter);
}
Flash.prototype.createMain = function (adapter) {
    return this.symbols[this.symbols.length - 1].createSequence(adapter);
}
Flash.prototype.initAttr = function (key, value) {
    switch (key) {
        case 'width':
            this.width = parseFloat(value);
            break;
        case 'height':
            this.height = parseFloat(value);
            break;
        case 'framerate':
            this.framerate = parseInt(value);
            break;
        case 'resourcePath':
            this.resourcePath = value;
            break;
    }
}
Flash.prototype.startParse = function (name) {
    if (name == 'graphic') {
        var g = new Graphic(this);
        this.addSymbol(g);
        return g;
    } else if (name == 'timeline') {
        var g = new TimeLine(this);
        this.addSymbol(g);
        return g;
    }
    return 0;
}
Flash.prototype.setPath = function (path) {
    this.resourcePath = path;
}
Flash.prototype.getPath = function () {
    return this.resourcePath;
}

function FlashInstance(flash, seq) {
    this.flash = flash;
    this.framerate = flash.framerate;
    this.sequence = seq;
    this.context = new FlashContext();
}
FlashInstance.prototype.update = function (step) {
    this.sequence.update(step * this.framerate);
    this.apply();
}
FlashInstance.prototype.updateTo = function (time) {
    this.sequence.updateTo(time / this.getDuration() * this.sequence.getFrameCount());
    this.apply();
}
FlashInstance.prototype.updateToPercent = function (percent) {
    this.sequence.updateTo(percent * this.sequence.getFrameCount());
    this.apply();
}
FlashInstance.prototype.updateToFrame = function (frame) {
    this.sequence.updateTo(frame);
    this.apply();
}
FlashInstance.prototype.getNode = function () {
    return this.sequence.getNode().node();
}
FlashInstance.prototype.getDuration = function () {
    var time = this.sequence.getFrameCount();
    return time / this.framerate;
}
FlashInstance.prototype.getFrameRate = function () {
    return this.framerate;
}
FlashInstance.prototype.setFrameRate = function (rate) {
    this.framerate = rate;
}
FlashInstance.prototype.apply = function () {
    this.context.reset();
    this.sequence.apply(this.context);
}

/**
 * basic flash element
 *
 * @param flash
 * @constructor
 */
function Symbol(flash) {
    this.framecount = 1;
    this.flash = flash;
}
_extends(Symbol, XMLInteract);
Symbol.prototype.getFrameCount = function () {
    return this.framecount;
}
Symbol.prototype.createSequence = function (adapter) {
    return 0;
}

function Graphic(flash) {
    Symbol.call(this, flash);
    this.position = new Position();
    this.path = '';
}
_extends(Graphic, Symbol);
Graphic.prototype.createSequence = function (adapter) {
    var g = new GraphicSequence(this);
    var node = g.getNode();
    adapter.createSprite(node.node(), this.flash.getImgPath(this.path));
    node.apply(this.position);
    return g;
}
Graphic.prototype.initAttr = function (key, value) {
    if (key == 'path') {
        this.path = value;
    }
}
Graphic.prototype.startParse = function (name) {
    if (name == 'position') {
        return this.position;
    }
    return 0;
}

function Layer(flash, framecount) {
    this.flash = flash;
    this.framecount = framecount;
    this.frames = [];
    this.drawable = [];
    this.status = this.STATUS_NONE;
    this.debug = false;
}
_extends(Layer, XMLInteract);
Layer.prototype.STATUS_NONE = -1;
Layer.prototype.STATUS_DRAWABLE = 0;
Layer.prototype.STATUS_REFER = 1;
Layer.prototype.STATUS_FRAMES = 10;
Layer.prototype.addFrame = function (frame) {
    this.frames.push(frame);
}
Layer.prototype.getFrame = function (index) {
    if (index >= this.frames.length) {
        return 0;
    }
    return this.frames[index];
}
Layer.prototype.findStartFrame = function (time, tip) {
    var frames = this.frames;
    if (frames.length == 0) {
        return -1;
    }
    // < start, return last frame
    if (time < frames [0].start) {
        return 0;
    }
    // >= end
    if (time >= frames[ frames.length - 1].getEnd()) {
        return frames.length - 1;
    }

    var start = 0;
    var end = frames.length;
    if (arguments.length > 1 && tip >= 0 && tip < end) {
        if (frames[tip].start <= time) {
            start = tip;
        } else {
            end = tip;
        }
    }

    var c = 0;
    while (end - start > 1) {
        var mid = Math.floor((start + end) / 2);
        c = frames[mid].start - time;
        if (c > 0) {
            end = mid;
        } else {
            start = mid;
        }
    }
    return start;
}
Layer.prototype.createLayerNode = function (adapter) {
    var node = new LayerNode(this);
    node.init(adapter);
    return node;
}
Layer.prototype.initRefer = function (key, value) {
    if (key == 'index') {
        this.drawable.push(parseInt(value));
    }
}
Layer.prototype.initAttr = function (key, value) {
    if (this.status == this.STATUS_NONE) {
        if (key == 'debug') {
            if (value.toUpperCase() == 'TRUE') {
                this.debug = true;
            } else {
                this.debug = false;
            }
        }
    } else if (this.status == this.STATUS_REFER) {
        this.initRefer(key, value);
    }
}
Layer.prototype.startParse = function (name) {
    switch (name) {
        case 'drawable':
            this.status = this.STATUS_DRAWABLE;
            return this;
        case 'frames':
            this.status = this.STATUS_FRAMES;
            return this;
        case 'refer':
            this.status = this.STATUS_REFER;
            return this;
        case 'frame':
            var f = new Frame();
            this.addFrame(f);
            return f;
    }
    return 0;
}
Layer.prototype.framesInitFinish = function () {
    var target = [];
    var preend = 0;

    for (var itor = 0, coll = this.frames, size = coll.length; itor < size; itor++) {
        var current = coll[itor];
        if (current.start > preend) {
            var p = new Frame();
            p.start = preend;
            p.duration = current.start - preend;
            target.push(p);
        }
        target.push(current);
        preend = current.getEnd();
    }

    if (preend < this.framecount) {
        var p = new Frame();
        p.start = preend;
        p.duration = this.framecount - preend;
        target.push(p);
    }

    if (target.length > frames.length) {
        this.frames = target;
    }

    // detect animation tip
    var previous = 0;
    for (var itor = 0, coll = this.frames, size = coll.length; itor < size; itor++) {
        var current = coll[itor];
        if (previous != 0) {
            Frame.prototype.initAnimaTip(previous, current);
        }
        previous = current;
    }
}
Layer.prototype.getFrameCount = function () {
    return this.frames.length;
}
Layer.prototype.endParse = function (name) {
    if (name == 'frames') {
        this.framesInitFinish();
    }
}
Layer.prototype.createSequence = function (drawableId, adapter) {
    return this.flash.findSymbol(this.drawable[drawableId]).createSequence(adapter);
}

/**
 * basic render element
 *
 * @constructor
 */
function Sequence() {
    this.framecount = 1;
    this.currentTime = 0;
    this.visiable = true;
    this.node = new Node(document.createElement('div'));
}

Sequence.prototype.show = function () {
    this.visiable = true;
}
Sequence.prototype.hide = function () {
    this.visiable = false;
}
Sequence.prototype.getNode = function () {
    return this.node;
}
Sequence.prototype.getFrameCount = function () {
    return this.framecount;
}
Sequence.prototype.applyPosition = function (p) {
    this.node.apply(p);
}
Sequence.prototype.update = function (dt) {
}
Sequence.prototype.updateTo = function (dt) {
}
Sequence.prototype.apply = function (context) {
}

function GraphicSequence(graphic) {
    Sequence.call(this);
    this.graphic = graphic;
}
_extends(GraphicSequence, Sequence);
GraphicSequence.prototype.apply = function (context) {
    var alpha = context.alpha();// TODO
}

function LayerNode(layer) {
    Sequence.call(this);
    this.framecount = layer.framecount;
    this.currentFrame = 0;
    this.layer = layer;
    this.drawable = [];
}
_extends(LayerNode, Sequence);
LayerNode.prototype.update = function (cycle, current, step, stopTime) {
    this.currentTime = stopTime;
    this.currentFrame = this.layer.findStartFrame(Math.floor(current), this.currentFrame);

    var size = this.layer.getFrameCount();
    var count = size * 2;
    for (var index = this.currentFrame; index < count; ++index) {
        var f = this.layer.getFrame(index % size);
        var remain = f.getEnd() - current;
        if (remain >= step) {
            if (f.isVisiable()) {
                var symbol = this.drawable[f.drawable];
                symbol.update(step);
            }
            this.currentFrame = index % size;
            break;
        } else {
            if (f.isVisiable()) {
                var symbol = this.drawable[f.drawable];
                symbol.update(remain);
            }
            step -= remain;
        }

        current = f.getEnd() % this.framecount;
    }

    if (cycle > 0) {
        for (var i = 0; i < size; i++) {
            var f = this.layer.getFrame(i);
            if (f.isVisiable()) {
                var symbol = this.drawable[f.drawable];
                symbol.update(f.duration);
            }
        }
    }
}
LayerNode.prototype.updateTo = function (time) {
    this.currentFrame = this.layer.findStartFrame(time, this.currentFrame);
    this.currentTime = time;
}
LayerNode.prototype.apply = function (context) {
    var node = this.node;
    var f = this.layer.getFrame(this.currentFrame);

    if (this.layer.debug) {
        // CCLog("layer.apply:%f", this.currentTime);
    }
    if (f.isVisiable()) {
        node.setVisible(true);

        if (f.animationType != Frame.prototype.ANIMATION_MOTION) {
            this.applyPosition(f.position);
        } else {
            var next = this.layer.getFrame(this.currentFrame + 1);
            if (next == 0) {
                this.applyPosition(f.position);
            } else {
                var time = this.currentTime - f.start;
                var p = new Position();
                p.init(f.position);
                Frame.prototype.interprate(time / f.duration, f, next, p);
                this.applyPosition(p);
            }
        }

        var child = this.drawable[f.drawable];
        child.apply(context);
        this.node.removeChildren();
        this.node.addChild(child.getNode());
    } else {
        node.setVisible(false);
    }
}

LayerNode.prototype.init = function (adapter) {
    for (var i = 0, coll = this.layer.drawable, size = coll.length; i < size; i++) {
        this.drawable.push(this.layer.createSequence(i, adapter));
    }
}

function AnimationSequence(timeline) {
    Sequence.call(this);
    this.symbol = timeline;
    this.framecount = timeline.getFrameCount();
    this.layers = [];
}
_extends(AnimationSequence, Sequence);
AnimationSequence.prototype.update = function (step) {
    var cycle = Math.floor(step / this.framecount);
    step = step % this.framecount;
    var end = (step + this.currentTime) % this.framecount;

    for (var itor = 0, coll = this.layers, size = coll.length; itor < size; itor++) {
        coll[itor].update(cycle, this.currentTime, step, end);
    }

    this.currentTime = end;
}
AnimationSequence.prototype.updateTo = function (dt) {
    for (var itor = 0, coll = this.layers, size = coll.length; itor < size; itor++) {
        coll[itor].updateTo(dt);
    }
}
AnimationSequence.prototype.apply = function (context) {
    for (var itor = 0, coll = this.layers, size = coll.length; itor < size; itor++) {
        context.pushContext();
        coll[itor].apply(context);
        context.popContext();
    }
}
AnimationSequence.prototype.addLayer = function (layer) {
    this.layers.push(layer);
    this.node.addChild(layer.getNode());
//    console.log(this.node.node());
}

function TimeLine(flash) {
    Symbol.call(this, flash);
    this.layers = [];
}
_extends(TimeLine, Symbol);
TimeLine.prototype.createSequence = function (adapter) {
    var seq = new AnimationSequence(this);
    each(this.layers, function (layer) {
        seq.addLayer(layer.createLayerNode(adapter));
    }, this);
    return seq;
}
TimeLine.prototype.initAttr = function (key, value) {
    if (key == 'framecount') {
        this.framecount = parseInt(value);
    }
}
TimeLine.prototype.startParse = function (name) {
    if (name == 'layer') {
        var layer = new Layer(this.flash, this.framecount);
        this.layers.push(layer);
        return layer;
    }
    return 0;
}

function FlashLoader() {
    this.stack = [];
    this.chars = '';
}
_extends(FlashLoader, XMLInteract);
FlashLoader.prototype.load = function (str) {
    this.stack.splice(0, this.stack.length);
    this.stack.push(this);

    var start = 0;
    var end = str.length;

    while (start < end) {
        var p1 = str.indexOf('<', start);
        if (p1 == -1) {
            break;
        }
        var p2 = str.indexOf('>', p1);
        if (p2 == -1) {
            break;
        }

        this.parsePart(str.substring(p1, p2 + 1));

        start = p2 + 1;
    }

    return this.flash;// TODO
}
FlashLoader.prototype.parsePart = function (str) {
    if (str.charAt(1) == '/') {
        this.endElement(str.slice(2, -1));
    } else {
        var offset = str.charAt(str.length - 2) == '/' ? 1 : 0;

        str = str.slice(1, -1 - offset);
        var name = str;
        var first = str.indexOf(' ');
        if (first == -1) {
            this.startElement(str, []);
        } else {
            name = str.slice(0, first);
            str = str.slice(first + 1);

            var attr = [];
            var matches = str.match(/\w+=(['"]).*?\1/g)
            for (var i = 0; i < matches.length; i++) {
                var parts = matches[i].split('=');
                parts[1] = parts[1].slice(1, -1);
                attr = attr.concat(parts);
            }
            this.startElement(name, attr);
        }

        if (offset != 0) {
            this.endElement(name);
        }
    }
}
FlashLoader.prototype.startElement = function (name, attrs) {
    var child = this.stack[this.stack.length - 1].startParse(name);
    if (attrs.length > 0) {
        for (var i = 0; i < attrs.length; i += 2) {
            child.initAttr(attrs[i], attrs[i + 1]);
        }
    }
    this.stack.push(child);
}
FlashLoader.prototype.endElement = function (name) {
    this.stack.pop().endParse(name);
}
FlashLoader.prototype.startParse = function (name) {
    if (name == 'flash') {
        return this.flash = new Flash();
    }
}