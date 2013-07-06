function DistinctImages() {
    this.imageCount = 0;
}
DistinctImages.prototype.nextName = function () {
    var name = 'imgs_' + (this.imageCount < 10 ? '0' + this.imageCount : this.imageCount) + '.png';
    this.imageCount++;
    return name;
}
function findName(name) {
    var index = name.lastIndexOf('/');
    if(index == -1) {
        index = name.lastIndexOf('\\');
    }
    if(index != -1) {
        name = name.slice(index + 1);
    }
    index = name.lastIndexOf('.');
    if(index != -1) {
        name = name.slice(0, index);
    }
    return name;
}

var destFolder = fl.browseForFolderURL('select', 'select a release folder');
var name = findName(fl.getDocumentDOM().path);

fl.runScript(fl.configURI + 'Javascript/export_action.jsfl', "exportFla", destFolder, '', name, new DistinctImages());
