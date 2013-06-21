var console = {
    log: function () {
        var str = '';
        var args = Array.prototype.slice.call(arguments, 0);
        for (var i in args) {
            str += args[i];
        }
        fl.outputPanel.trace(str);
    },
    clear: function () {
        fl.outputPanel.clear();
    }
};
function getAttrs() {
    var attrs = Array.prototype.slice.call(arguments, 0);
    return function (item) {
        var str = '{\n';
        for (var i = 0, len = attrs.length; i < len; i++) {
            str += '    ' + attrs[i] + ':';
            var value = item[attrs[i]];
            if (typeof value == 'function') {
                str += (item.getMotionObjectXML());
            } else {
                str += value;
            }
            str += '\n';
        }
        str += '}';
        return str;
    }
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

function Flash(library) {
    this.timelines = [];
    this.loadLibrary(library);
}
Flash.prototype.loadLibrary = function (library) {
    var itemsmap = this.itemsmap = {};
    var items = this.items = [];
    each(library.items, function (item) {
        if (item.name == '尾巴') {
            console.log(item.name + ',' + item.itemType + ',' + item);
        }
        var i = {name: item.name, type: item.itemType};
        itemsmap[item.name] = i;
        items.push(i);
    }, this);
}
Flash.prototype.createTimeline = function (timeline) {
    var t = new Timeline(this, timeline);
    this.timelines.push(t);
    return t;
}
Flash.prototype.exportXml = function () {
    var xml = new XML(0);

    xml.begin('flash');
    for (var i = 0, length = this.timelines.length; i < length; i++) {
        this.timelines[i].exportXml(xml);
    }
    xml.end();

    this.saveXml(xml);
}
Flash.prototype.saveXml = function (xml) {
    var URI = "file:///Users/jie/git/flash/text.txt";
    if (FLfile.write(URI, xml.buffer)) {
        console.log("Wrote xxx to " + URI);
    }
    /*
     if (FLfile.write(URI, "aaa", "append")) {
     console.log("Appended aaa to " + URI);
     }
     */
}
Flash.prototype.parse = function (timeline) {
    // add default timeline
    var t = new Timeline(this, timeline);
    this.timelines.push(t);

    // parse all timeline, including movieclip timeline
    for (var i = 0, length = this.timelines.length; i < length; i++) {
        this.timelines[i].parse();
    }
}

/**
 * 对应一个元件对象
 *
 * @param item
 * @constructor
 */
function Symbol(item) {
    this.parse(item);
}
Symbol.prototype.parse = function (item) {
    this.library = item.libraryItem;
    console.log(this.library + '&=========');
    switch (item.symbolType) {
        case 'movie clip':
            this.type = 'moveclip';
            break;
        case 'graphic':
            this.type = 'graphic';
            break;
        default:
            console.log('unsupported symbol type:' + item + item.symbolType);
    }
}

function Bitmap(item) {
    this.parse(item);
}
Bitmap.prototype.parse = function (item) {
    this.library = item.libraryItem;
    console.log(this.library + '<=========');
    switch (item.instanceType) {
        case 'bitmap':
            break;
        default :
            console.log('unsupported bitmap type:' + item.instanceType);
            break;
    }
}

/**
 * key frame
 */
function Frame(frame) {
    this.duration = frame.duration;
    this.startFrame = frame.startFrame;
    this.element = frame.elements[0];
    this.position = this.parsePosition(this.element);
    this.instance = this.parseInstance(this.element);
    this.elementIndex = 0;
}
Frame.prototype.parseInstance = function (element) {
    var instance;
    switch (element.instanceType) {
        case 'symbol':
            instance = new Symbol(element);
            break;
        case 'bitmap':
            instance = new Bitmap(element);
            break;
        default:
            console.log('unsupported instance type:' + element.instanceType);
            break;
    }
    return instance;
}
Frame.prototype.parsePosition = function (element) {
    //var x = element.x;
    //var y = element.y;
    var x = element.transformX;
    var y = element.transformY;
    var sx = element.scaleX;
    var sy = element.scaleY;
    var w = element.width;
    var h = element.height;
    var r = element.rotation / 180 * Math.PI;
    var p = element.getTransformationPoint();
    /*
     var sin = Math.sin(r);
     var cos = Math.cos(r);
     var cx = p.x * cos + p.y * sin;
     var cy = -p.x * sin + p.y * cos;
     console.log([x,y,tx,ty,sx,sy,w,h,r,cx,cy].join(','));
     */
    return {
        x: x,
        y: y,
        scalex: sx,
        scaley: sy,
        centerx: p.x,
        centery: p.y,
        width: w,
        height: h,
        rotation: r
    };
}
Frame.prototype.exportXml = function (xml) {
    xml.inline('frame', this.position, {start: this.startFrame, duration: this.duration});
}

function Layer(layer) {
    this.layer = layer;
    this.frames = [];
    this.elements = [];
}
Layer.prototype.parse = function () {
    each(this.layer.frames, this.parseFrame, this);
}
Layer.prototype.parseFrame = function (frame, i) {
    //console.log('t1');
    if (frame.startFrame != i) {
        return;
    }
    //console.log('t2');
    if (frame.elements == 0) {
        return;
    }
    //console.log('t3');
    if (frame.elements > 1) {
        console.log('unsupported frame.elements');
    }

    var f = new Frame(frame);
    this.frames.push(f);
    this.distinctElement(f);
}
Layer.prototype.distinctElement = function (frame) {
    var lib = frame.instance.library;
    for (var i = 0, es = this.elements, len = es.length; i < len; i++) {
        if (lib.name == es[i]) {
            frame.elementIndex = i;
            return;
        }
    }
    frame.elementIndex = this.elements.length;
    this.elements.push(lib.name);
}
Layer.prototype.exportXml = function (xml) {
    xml.begin('layer', {name: this.layer.name});
    this.exportLibrary(xml);
    this.exportFrames(xml);
    xml.end();
}
Layer.prototype.exportLibrary = function (xml) {
    xml.begin('library');
    each(this.elements, function (element) {
        xml.inline('item', {name: element});
    });
    xml.end();
}
Layer.prototype.exportFrames = function (xml) {
    xml.begin('frames');
    each(this.frames, function (frame) {
        frame.exportXml(xml);
    });
    xml.end();
}

function Timeline(flash, timeline) {
    this.flash = flash;
    this.timeline = timeline;
    this.layers = [];
}
Timeline.prototype.parse = function () {
    each(this.timeline.layers, this.parseLayers, this);
}
Timeline.prototype.parseLayers = function (layer) {
    /**
     if (layer.name != 'dragon_tail') {
        return;
    }
     */
    var l = new Layer(layer);
    this.layers.push(l);
    l.parse();
}
Timeline.prototype.exportXml = function (xml) {
    xml.begin('timeline', {framecount: this.timeline.frameCount});
    each(this.layers, function (layer) {
        layer.exportXml(xml);
    }, this);
    xml.end();
}

function XML(intend) {
    this.intend = intend ? intend : 0;
    this.names = [];
    this.buffer = '';
    this.space = '    ';
}
XML.prototype.begin = function (name, attrs) {
    this.names.push(name);
    for (var i = 0; i < this.intend; i++) {
        this.buffer += this.space;
    }
    this.buffer += '<' + name;
    if (attrs) {
        for (var i in attrs) {
            this.buffer += ' ' + i + '="' + attrs[i] + '"';
        }
    }
    this.buffer += '>\n';
    this.intend++;
}
XML.prototype.end = function () {
    this.intend--;
    for (var i = 0; i < this.intend; i++) {
        this.buffer += this.space;
    }
    this.buffer += '</' + this.names.pop() + '>\n'
}
XML.prototype.content = function (c) {
    this.buffer += c;
}
XML.prototype.inline = function (name, attrs) {
    for (var i = 0; i < this.intend; i++) {
        this.buffer += this.space;
    }

    var buffer = this.buffer += '<' + name;
    var args = Array.prototype.slice.call(arguments, 1);
    console.log('args:' + args);
    each(args, function (props) {
        for (var i in props) {
            buffer += ' ' + i + '="' + props[i] + '"';
        }
    });

    this.buffer += ' />\n';
}

console.clear();
var flash = new Flash(fl.getDocumentDOM().library);
flash.parse(fl.getDocumentDOM().getTimeline());
flash.exportXml();

console.log(fl.getDocumentDOM().timelines);

//var xml = new XML();
//xml.begin('a');
//xml.begin('b');
//xml.end();
//xml.end();

console.log('done...');
