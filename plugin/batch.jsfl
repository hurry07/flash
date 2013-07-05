function DistinctImages(path) {
    this.imageCount = 0;
}
DistinctImages.prototype.nextName = function () {
    var name = 'imgs_' + (this.imageCount < 10 ? '0' + this.imageCount : this.imageCount) + '.png';
    this.imageCount++;
    return name;
}

function BatchUtil(src, dest) {
    this.src = src;
    this.dest = dest;
    this.fastbreak = false;
}
BatchUtil.prototype.execute = function () {
    var task = [''];
    while (task.length > 0 && !this.fastbreak) {
        var subpath = task.shift();
        this.searchFla(subpath, task);
    }
}
BatchUtil.prototype.searchFla = function (path, task) {
    var uri = this.src;
    if (path.length > 0) {
        uri += '/' + path;
    }
    var images = new DistinctImages();

    var fileList = FLfile.listFolder(uri);
    for (var i = 0, len = fileList.length; i < len; i++) {
        var childpath = uri + '/' + fileList[i];
        var attr = FLfile.getAttributes(childpath);
        if (attr.indexOf('D') != -1) {
            if (path.length == 0) {
                task.push(fileList[i]);
            } else {
                task.push(path + '/' + fileList[i]);
            }
        } else {
            if (this.endwith(fileList[i], '.fla')) {
                fl.outputPanel.trace(childpath + ' = ' + fileList[i].slice(0, -4));
                fl.openDocument(childpath);
                fl.runScript(slavepath, "exportFla", this.dest, path, fileList[i].slice(0, -4), images);
                fl.closeDocument(fl.getDocumentDOM());
                //this.fastbreak = true;
            }
        }
    }
}
BatchUtil.prototype.endwith = function (str, tail) {
    var index = str.indexOf(tail);
    if (index == -1) {
        return false;
    }
    if (index == str.length - tail.length) {
        return true;
    }
    return false;
}

var slavepath = "file:///Users/jie/git/flash_cpp/export.jsfl";
var batch = new BatchUtil('file:///Users/jie/Desktop/魔幻史诗FLASH_全_调亮/attack', 'file:///Users/jie/git/flash_cpp/export33');
//var batch = new BatchUtil('file:///Users/jie/git/flash_cpp/test', 'file:///Users/jie/git/flash_cpp/export');
batch.execute();
