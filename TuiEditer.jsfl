var ITEM_IMG_PADDING = 1;


/////////////////////////////////////////////////////////////////////
ExportElementXMLErrorStrings = {};
ExportElementXMLErrorStrings.kNoOpenedFla = "no opened fla document!";
ExportElementXMLErrorStrings.kNullDocument = "export error, empty document!";
ExportElementXMLErrorStrings.kNoSetScheme = "export error, no such scheme!";
ExportElementXMLErrorStrings.kCanNotFindLibraryItem = "can not find library item!";
/////////////////////////////////////////////////////////////////////
/*给函数原型增加一个extend函数，实现继承*/  
Function.prototype.extend = function(superClass){  
	if(typeof superClass !== 'function'){  
		throw new Error('fatal error:Function.prototype.extend expects a constructor of class');  
	}  

	var F = function(){}; //创建一个中间函数对象以获取父类的原型对象  
	F.prototype = superClass.prototype; //设置原型对象  
	this.prototype = new F(); //实例化F, 继承父类的原型中的属性和方法，而无需调用父类的构造函数实例化无关的父类成员  
	this.prototype.constructor = this; //设置构造函数指向自己  
	this.superClass = superClass; //同时，添加一个指向父类构造函数的引用，方便调用父类方法或者调用父类构造函数  
          
    return this;  
};

/**
 @brief 打印
 @param str:string 字符串
 */
function trace( str ){
	fl.outputPanel.trace( str );
}

/** 清屏 */
function cls(){
	fl.outputPanel.clear();
}

/** 保留小数 */
function formatNumber( num, retain){
	retain = retain || 100;
	return Math.round(num * retain) / 100;
}

/////////////////////////////////////////////////////////////////////
/** 默认的xml 节点名字 */
XMLNode = {};
XMLNode.root = "root";
XMLNode.control = "control";
XMLNode.scheme = "scheme";

/////////////////////////////////////////////////////////////////////
/** xml类 */
TXML = function( nodename ){
	/** 父节点 */
	this.parent = null;
	/** 子节点 */
	this.children = [];
	/** 所有需要输出的属性 */
	this.attributes = {};
	
	this.xml = "";
	this.nodeName = nodename==null ? XMLNode.root : nodename;
	
	this.init();
}

TXML.prototype.init = function(){
}

TXML.prototype.setNodeName = function( name ){
	this.nodeName = name;
}

TXML.prototype.getNodeName = function(){
	return this.nodeName;
}

TXML.prototype.addChild = function( o ){
	if( !o ){
		alert( o );
	}
	o.parent = this;
	this.children.push( o );
}

TXML.prototype.registerAttribute = function( k, v ){
	this.attributes[k] = v;
}

TXML.prototype.setAttribute = function( k, v ){
	if( this.attributes[k] == null ){
		//alert( "没有属性: " + k );
	}
	this.attributes[k] = v;
}

TXML.prototype.getAttribute = function( k ){
	if( this.attributes[k] == null ){
		//alert( "没有属性: " + k );
	}
	return this.attributes[k];
}

TXML.prototype.getTabCount = function(){
	if( this.parent != null ){
		return this.parent.getTabCount() + 1;
	}
	return 0;
}

TXML.prototype.pushXMLAttribution = function( key, value ){
	if( value == null ) return;
	var str = value.toString();
	if( str=="" ) return;
	this.xml += " " + key + "=" + "\"" + value + "\"";
}


TXML.prototype.pushXML = function( str ){
	this.xml += str;
}

TXML.prototype.outputControlXML = function(){
	//trace( "{" + "name" + ":" + this.attributes["name"] + "}" );
	for( k in this.attributes ){
		this.pushXMLAttribution( k, this.attributes[k] );
	}
}

TXML.prototype.outputChildrenXML = function(){
	for each( c in this.children ){
		c.outputXML();
	}
}

TXML.prototype.outputTabXML = function(){
	var n = this.getTabCount();
	for( var i = 0; i<n; ++i ){
		this.pushXML( "\t" );
	}
}

TXML.prototype.outputXML = function(){
	this.xml = "";
	this.outputTabXML(); this.pushXML( "<" + this.nodeName ); this.outputControlXML(); this.pushXML( ">" );
	
	if( this.children.length > 0 ){
		this.pushXML( "\n" );
	}
	this.outputChildrenXML();
	if( this.children.length > 0 ){
		this.outputTabXML(); 
	}
	this.pushXML( "</" + this.nodeName + ">\n" );
	
	if( this.parent ){
		this.parent.pushXML( this.xml );
	}
	
	//alert(this.xml);
	
	return this.xml;
}

UIXML = function(uiname){
	UIXML.superClass.call( this, "ui" );
	
	this.registerAttribute( "name", (uiname == null ? "uipanel" : uiname) );
}

UIXML.extend( TXML );
UIXML.prototype.init = function(){
	UIXML.superClass.prototype.init.call(this);

	this.registerAttribute( "version", "1.0" );
}

KeyFrameXML = function(uiname){
	KeyFrameXML.superClass.call( this, "keyframe" );
}

KeyFrameXML.extend( TXML );
KeyFrameXML.prototype.init = function(){
	KeyFrameXML.superClass.prototype.init.call(this);
}

FrameLabelXML = function(uiname){
	KeyFrameXML.superClass.call( this, "framelabel" );
}

FrameLabelXML.extend( TXML );
FrameLabelXML.prototype.init = function(){
	FrameLabelXML.superClass.prototype.init.call(this);
}

FrameActionXML = function(uiname){
	KeyFrameXML.superClass.call( this, "frameaction" );
}

FrameActionXML.extend( TXML );
FrameActionXML.prototype.init = function(){
	FrameActionXML.superClass.prototype.init.call(this);
}


/////////////////////////////////////////////////////////////////////
/** ui主题的属性 */
SchemeAttribute = {};
/** 主题的名字, 如: iphone4, iphone5, ipad */
SchemeAttribute.kName = "name";
SchemeAttribute.kIsRetina = "is_retina";
SchemeAttribute.kScreenWidth = "screen_width";
SchemeAttribute.kScreenHeight= "screen_height";

/** 支持的控件类型 */
UIControlType = {};
UIControlType.kPanel = "panel";
UIControlType.kImage = "image";
UIControlType.kButton = "button";

/////////////////////////////////////////////////////////////////////
/** 控件的属性 */
UIControlAttribute = {};
/** 控件的类型 */
UIControlAttribute.kType = "type";
/** 控件的名字,在程序中控制用 */
UIControlAttribute.kName = "name";
/** 是否可托动 */
UIControlAttribute.kEnableDrag = "enable_drag";
/** 用到的图片 */
UIControlAttribute.kImage = "image";
/** 点击事件 */
UIControlAttribute.kClickEvent = "click_event";
/** 坐标 */
UIControlAttribute.kX = "x";
UIControlAttribute.kY = "y";
/** 图层决定zorder */
UIControlAttribute.kZ = "z";
/** 中心点坐标 */
UIControlAttribute.kOriginX = "ox";
UIControlAttribute.kOriginY = "oy";
/** 宽高 */
UIControlAttribute.kWidth = "width";
UIControlAttribute.kHeight = "height";
/** 缩放 */
UIControlAttribute.kScaleX = "scalex";
UIControlAttribute.kScaleY = "scaley";
/** 角度 */
UIControlAttribute.kAngle = "angle";

UIControlAttribute.frameIndex = "frameIndex";
UIControlAttribute.id = "id";

/**
 @brief 控件基类
 */
UIControl = function(){
	UIControl.superClass.call(this, XMLNode.control );
}

UIControl.extend( TXML );
UIControl.prototype.init = function(){
	for( k in UIControlAttribute ){
		this.registerAttribute( UIControlAttribute[k], "" );
	}
//	this.setNodeName( "control" );
}

/////////////////////////////////////////////////////////////////////
/**
 @brief 面板,所有UI都得放在面板里
 */
UIPanel = function(){
	UIPanel.superClass.call(this);
}

UIPanel.extend( UIControl );
UIPanel.prototype.init = function(){
	UIPanel.superClass.prototype.init.call(this);
	this.setAttribute( UIControlAttribute.kType, UIControlType.kPanel );
	//this.setAttribute( UIControlAttribute.kEnableDrag, 0 );
}

/////////////////////////////////////////////////////////////////////
/**
 @brief 图片,只显示一个图片
 */
UIImage = function(){
	UIImage.superClass.call(this);
}

UIImage.extend( UIControl );
UIImage.prototype.init = function(){
	UIImage.superClass.prototype.init.call(this);
	this.setAttribute( UIControlAttribute.kType, UIControlType.kImage );
}

/**
 @brief 按钮
 */
UIButton = function(){
	UIButton.superClass.call(this);
}
UIButton.extend( UIControl );
UIButton.prototype.init = function(){
	UIButton.superClass.prototype.init.call(this);
	this.setAttribute( UIControlAttribute.kType, UIControlType.kButton );
}

/**
 @brief text
 */
UIText = function(){
	UIText.superClass.call(this);
}
UIText.extend( UIControl );
UIText.prototype.init = function(){
	UIText.superClass.prototype.init.call(this);
	this.setAttribute( UIControlAttribute.kType, "text" );
}

/////////////////////////////////////////////////////////////////////
/** 
 @brief 把fla文件转换为xml
  		flash里的 element.libraryItem.itemType有类型映射:
		panel: movie clip, 
		image: graphic
		button:button
 */
kExportLayerCurrent = 0; //导出当前层
kExportLayerVisible = 1; //导出可见层
kExportLayerAll = 2;	 //导出所有层

FlaToXML = function(){
	/** TXML,保存xml */
	this.txml = null;
	/** 当前处理的fla文件, Document Object */
	this.obj_fla = null;
	
	this.elementTagCount = 1;
	this.tagDic = {};
	
	this.frameLabelTagDic = {};
	this.frameLabelTagCount = 1;
	
	/** 导出哪些层,默认为导出所有层 */
	this.export_layer_type = kExportLayerAll;
	
	this.init();
}

FlaToXML.prototype.init = function(){
}

/** 判断element是否为panel */
FlaToXML.prototype.elementIsPanel = function( element ){
	var type = element.libraryItem.itemType;
	if( "movie clip" == type ) return true;
	if( "graphic" == type ) return true;
	return false;
}

/** 判断element是否为image */
FlaToXML.prototype.elementIsImage = function( element ){
	var type = element.libraryItem ? element.libraryItem.itemType : null;
	if( "bitmap" == type ) return true;
	return false;
}

/** 判断element是否为button */
FlaToXML.prototype.elementIsButton = function( element ){
	var type = element.libraryItem ? element.libraryItem.itemType : null;
	if( "button" == type ) return true;
	return false;
}

/** 判断element是否为text */
FlaToXML.prototype.elementIsText = function( element ){
	if(element.elementType == "text") return true;
	return false;
}

FlaToXML.prototype.elementIsPanel = function( element ){
	var type = element.libraryItem ? element.libraryItem.itemType : null;
	if( "movie clip" == type ) return true;
	if( "graphic" == type ) return true;
	return false;
}

/** 
 @brief 把objfla:Document Object转换为xmlfile:string xml文件 
 @param objfla:Document Object
 @param xmlfile:string 目标文件名
 @param uiname:string UI名字
 */
FlaToXML.prototype.convert = function( objfla, xmlfile, uiname, packWidth, packHeight) {
	if( objfla == null ){
		alert( ExportElementXMLErrorStrings.kNoOpenedFla );
	}

	this.obj_fla = objfla;
	this.txml = new UIXML( uiname );
	
	if( xmlfile == "" || xmlfile == null ){
		xmlfile = objfla.name.split(".")[0] + ".xml";
	}
	
	var packRects = this.packImg(objfla, packWidth, packHeight);
	
	this.packImgRects = packRects;
	
	this.exportPackImg(packRects, objfla, packWidth, packHeight);
	
	objfla.editScene(0);
	
	//导出全部
	this.fetchElement( objfla.getTimeline(), this.txml, true);

	this.outputXML();
}

FlaToXML.prototype.getPackImgRect = function(item) {
	if(this.packImgRects) {
		for each(var rect in this.packImgRects) {
			if(rect.item == item)
				return rect;
		}
	}
	
	return null;
}

Rectangle = function(){
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
}

ItemRectangle = function() {
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.item = null;
}

FlaToXML.prototype.getImgItemRects = function( objfla ) {
	var library = objfla.library;
	var items = objfla.library.items;
	var itemRects = [];
	
	for each(var item in items) {
		if(item.itemType != "bitmap")
			continue;
	
		library.deleteItem("texture_temp_item");
		library.addNewItem("movie clip", "texture_temp_item");
		library.editItem("texture_temp_item");
		
		objfla.addItem({x:0, y:0}, item);
		
		var elem = objfla.getTimeline().layers[0].frames[0].elements[0];
		
		var itemRect = new ItemRectangle();
		itemRect.item = item;
		itemRect.width = elem.width;
		itemRect.height = elem.height;
		
		//按面积从大到小排序 优化图片拼接
		var area = itemRect.width * itemRect.height;
		for(var i = 0; i < itemRects.length; i++) {
			var orect = itemRects[i];
			
			var oarea = orect.width * orect.height;
			
			if(area >= oarea) {
				itemRects.splice(i, 0, itemRect);
				break;
			}
		}
		
		if(itemRects.indexOf(itemRect) == -1)
			itemRects.push(itemRect);
	}
	
	library.deleteItem("texture_temp_item");
	
	return itemRects;
}

FlaToXML.prototype.packImg = function( objfla, packWidth, packHeight ) {
	var freeRects = [];
	var fillRects = [];
	var itemRects = this.getImgItemRects( objfla );
	
	var n = new Rectangle();
	n.width = formatNumber(packWidth);
	n.height = formatNumber(packHeight);
	freeRects.push(n);
	
	while(itemRects.length != 0) {
		var itemRect = itemRects[0];
	
		var freeRect = this.findBestFreeRect(freeRects, itemRect);
		
		if(!freeRect) {
			alert("not find freeRect");
			break;
		}
		
		itemRect.x = freeRect.x + ITEM_IMG_PADDING;
		itemRect.y = freeRect.y + ITEM_IMG_PADDING;
		itemRects.splice(0, 1);
		
		this.spliceRect(freeRects, freeRect, itemRect);
		
		fillRects.push(itemRect);
	}
	
	return fillRects;
}

FlaToXML.prototype.exportPackImg = function(fillRects, objfla, packWidth, packHeight) {
	library = objfla.library;

	library.deleteItem("texture_swf_item");
	
	if(!library.itemExists("texture_swf_item")){
		library.addNewItem("movie clip", "texture_swf_item");
	}
	
	library.editItem("texture_swf_item");
	
	for each(var fillRect in fillRects) {
		objfla.addItem({x:0, y:0}, fillRect.item);
		var frame = objfla.getTimeline().layers[0].frames[0];
		var elem = frame.elements[frame.elements.length - 1];
		elem.x = fillRect.x;
		elem.y = fillRect.y;
	}
	
	var ow = objfla.width;
	var oh = objfla.height;
	
	objfla.width = formatNumber(packWidth);
	objfla.height = formatNumber(packHeight);
	objfla.exportPNG(getPackImgFileName(), true, true);
	
	objfla.width = ow;
	objfla.height = oh;
}

FlaToXML.prototype.spliceRect = function(freeRects, targetRect, itemRect) {
	var index = freeRects.indexOf(targetRect);
	
	freeRects.splice(index, 1);
	
	if(targetRect.width > itemRect.width + ITEM_IMG_PADDING * 2) {
		var newWidthRect = new Rectangle();
		newWidthRect.x = targetRect.x + itemRect.width + ITEM_IMG_PADDING * 2;
		newWidthRect.y = targetRect.y;
		newWidthRect.width = targetRect.width - itemRect.width - ITEM_IMG_PADDING * 2;
		newWidthRect.height = itemRect.height;
		freeRects.push(newWidthRect);
	}
	
	if(targetRect.height > itemRect.height + ITEM_IMG_PADDING * 2) {
		var newHeightRect = new Rectangle();
		newHeightRect.x = targetRect.x;
		newHeightRect.y = targetRect.y + itemRect.height + ITEM_IMG_PADDING * 2;
		newHeightRect.width = targetRect.width;
		newHeightRect.height = targetRect.height - itemRect.height - ITEM_IMG_PADDING * 2;
		freeRects.push(newHeightRect);
	}
}

FlaToXML.prototype.findBestFreeRect = function(freeRects, itemRect) {
	var bestRect = null;
	
	for each(var freeRect in freeRects) {
		
		if (freeRect.width >= itemRect.width + ITEM_IMG_PADDING * 2 && freeRect.height >= itemRect.height + ITEM_IMG_PADDING * 2) {
			if(!bestRect) {
				bestRect = freeRect;
			} else {
				var bp = this.getFreeRectPriority(bestRect);
				var fp = this.getFreeRectPriority(freeRect);
				
				if(fp < bp)
					bestRect = freeRect;
			}
		}
	}
	
	return bestRect ? bestRect : null;
}

FlaToXML.prototype.getFreeRectPriority = function(freeRect) {
	return freeRect.x + freeRect.y * 1000;
}

/** 转换元素为UICnotrol */
FlaToXML.prototype.convertElement = function( element){
	var e_xml = null;
	if( this.elementIsPanel( element ) ){
		e_xml = this.convertMC( element);
	}else if( this.elementIsImage( element ) ){
		e_xml = this.convertImage( element);
	}else if( this.elementIsButton( element ) ){
		e_xml = this.convertButton( element);
	} else if(this.elementIsText(element)) {
		e_xml = this.convertText(element);
	} else {
		alert( "未知的类型: " + element.instanceType + " " + element.libraryItem.itemType );
	}
	return e_xml;
}

/** 填充一般属性 */
FlaToXML.prototype.fullNormalAttirbute = function( xml, element, id){
	var orotation = element.rotation;
	element.rotation = 0;
	
	xml.setAttribute( UIControlAttribute.kWidth, formatNumber(element.width) );
	xml.setAttribute( UIControlAttribute.kHeight, formatNumber(element.height) );
	
	xml.setAttribute( UIControlAttribute.kX, formatNumber( element.x ) );
	xml.setAttribute( UIControlAttribute.kY, formatNumber( element.y ) );
	
	element.rotation = orotation;
	
	xml.setAttribute( UIControlAttribute.id, id ? id : element.name);
}

/** 转换movie clip */
FlaToXML.prototype.convertMC = function(mc){
	var panel_xml = new UIPanel();
	
	panel_xml.setAttribute( UIControlAttribute.kName, mc.name );
	
	//元素tag
	panel_xml.setAttribute( "tag", formatNumber(this.getElementTag(mc.name)) );
	
	this.fullNormalAttirbute( panel_xml, mc);
	//获取mc的timeline
	var timeline = mc.libraryItem.timeline;
	this.fetchElement( timeline, panel_xml, false);
	return panel_xml;
}

/** 转换text */
FlaToXML.prototype.convertText = function(textElem) {
	var text_xml = new UIText();
	
	var content = textElem.getTextString();
	
	text_xml.setAttribute( UIControlAttribute.kName, textElem.name );
	text_xml.setAttribute( "textContent", content );
	
	//元素tag
	text_xml.setAttribute( "tag", formatNumber(this.getElementTag(textElem.name)) );
	
	this.fullNormalAttirbute( text_xml, textElem);
	
	var textSize = textElem.getTextAttr("size");
	var color = textElem.getTextAttr("fillColor");
	var fontName = textElem.getTextAttr("face");
	
	text_xml.setAttribute( "fontSize", textSize );
	text_xml.setAttribute( "fontColor", color.replace("#", ""));
	text_xml.setAttribute( "fontName", fontName);
	
	return text_xml;
}

/** 转换image */
FlaToXML.prototype.convertImage = function( image) {
	var xml_img = new UIImage();
	
	var docName = fl.getDocumentDOM().name.replace(".fla", "");
	xml_img.setAttribute( UIControlAttribute.kImage, docName + ".png" );
	
	var imgRect = this.getPackImgRect(image.libraryItem);
	
	if(imgRect) {
		xml_img.setAttribute( "rectX", imgRect.x);
		xml_img.setAttribute( "rectY", imgRect.y);
		xml_img.setAttribute( "rectWidth", imgRect.width);
		xml_img.setAttribute( "rectHeight", imgRect.height);
	}
	
	this.fullNormalAttirbute( xml_img, image);
	return xml_img;
}

/** 转换button */
FlaToXML.prototype.convertButton = function(button) {
	var xml_btn = new UIButton();
	
	//元素tag
	xml_btn.setAttribute( "tag", formatNumber(this.getElementTag(button.name)) );
	
	xml_btn.setAttribute( UIControlAttribute.kName, button.name );
	xml_btn.setAttribute( UIControlAttribute.kClickEvent, "click_" + button.name );
	
	this.fullNormalAttirbute( xml_btn, button);
	
	var frames = button.libraryItem.timeline.layers[0].frames;
	
	for(var i = 0; i < frames.length; i++) {
		//不需要over状态
		if(i == 1) continue;
		
		var elem = frames[i].elements[0];
		var e_xml = this.convertElement(elem);
		xml_btn.addChild(e_xml);
	}
	
	return xml_btn;
}

FlaToXML.prototype.getElementTag = function(name) {
	var tagCount = this.tagDic[name];
	
	if(!tagCount) {
		tagCount = this.elementTagCount;
		this.tagDic[name] = tagCount;
		this.elementTagCount++;
	}
	
	return tagCount;
}

FlaToXML.prototype.getFrameLabelTag = function(name) {
	var tagCount = this.frameLabelTagDic[name];
	
	if(!tagCount) {
		tagCount = this.frameLabelTagCount;
		this.frameLabelTagDic[name] = tagCount;
		this.frameLabelTagCount++;
	}
	
	return tagCount;
}

FlaToXML.prototype.isLabelLayer = function(layer) {
	return layer.name.toLowerCase() == "framelabel";
}

FlaToXML.prototype.isActionLayer = function(layer) {
	return layer.name.toLowerCase() == "frameaction";
}

/**
 @brief 从timeline里提取element,并填加到父节点 
 @param parentxml:TXML 父节点
 */
FlaToXML.prototype.fetchElement = function( timeline, parentxml, isParentRoot ) {
	//trace( "FlaToXML: 提取fla里的元素" );
	//获取时间轴
	var time_line = timeline;
	var nlayer = time_line.layerCount;
	
	var actionLayer = null;
	var labelLayer = null;
	
	//根据图层顺序从后往前解析图层
	for( var layer_index = nlayer-1; layer_index >= 0; --layer_index ) {
	//for( var layer_index = 0; layer_index < nlayer; ++layer_index ) {
		var layer = time_line.layers[layer_index];
		
		var nframe = layer.frameCount;
		
		var firstElem = null;
		var firstElemXml = null;
		
		//记录标签layer
		if(this.isLabelLayer(layer)) {
			var frameLabelXMLList = this.createFrameLabel(layer);
				
			for each(var frameLabelXML in frameLabelXMLList) {
				parentxml.addChild(frameLabelXML);
			}
				
			continue;
		} else if(this.isActionLayer(layer)) {//记录action layer
			actionLayer = layer;
			
			continue;
		}
		
		for( var frame_index = 0; frame_index < nframe; ++frame_index ) {
			var frame = layer.frames[frame_index];
			
			//只取关键帧
			if(frame_index != frame.startFrame)
				continue;
			
			//一个图层最多只能有一个元素
			var nelement = frame.elements.length;
			
			if(nelement > 0) {
				var element = frame.elements[0];
						
				var exml = this.convertElement( element);
				
				//添加最长图层帧数
				exml.setAttribute( "frameCount", formatNumber( timeline.frameCount) );
				
				if(!firstElem) {
					firstElem = element;
					firstElemXml = exml;
					
					//若第一帧为空帧 添加空帧元素
					if(frame_index != 0) {
						var keyframeXML = this.createKeyFrame(firstElem, 0, 0, 0, frame);
						firstElemXml.addChild(keyframeXML);
					}
				}
				
				var exmlId = exml.attributes["id"];
				var isContain = false;
				
				var keyframeXML = this.createKeyFrame(element, frame_index, frame.tweenType != "none" ? 1 : 0, 1, frame);
				
				for each(var cexml in parentxml.children) {
					var id = cexml.attributes["id"];
							
					if(id && exmlId && id == exmlId) {		
						cexml.addChild( keyframeXML );
						isContain = true;
						break;
					}
				}
			
				
				if(!isContain) {
					//最外层control不添加keyFrame
					if(!isParentRoot)
						exml.addChild(keyframeXML);
					
					parentxml.addChild( exml );	
				}
				
			} else {
				//添加空帧元素
				if(firstElem) {
					firstElemXml.addChild(this.createKeyFrame(firstElem, frame_index, 0, 0, frame));
				}
			}
		}
	}
	
	
	if(actionLayer) {
		for each(var cexml in parentxml.children) {
			if(cexml.nodeName != "control") continue;
		
			var frameActionXMLList = this.createFrameAction(layer);
			
			for each(var frameActionXML in frameActionXMLList) {
				cexml.addChild(frameActionXML);
			}
		}
	}
}

FlaToXML.prototype.createFrameLabel = function(layer) {
	var frameXMLList = [];
	
	var frames = layer.frames;
	
	var frameLabelDic = {};
	
	for(var i = 0; i < frames.length; i++) {
		var frame = frames[i];
		
		var label = frame.name;
		
		if(!label) continue;
		
		var labelInfo = frameLabelDic[label];
		
		if(!labelInfo) {
			labelInfo = {start:i, length:0};
			frameLabelDic[label] = labelInfo;
		} else {
			labelInfo.length++;
		}
	}
	
	for(var k in frameLabelDic ){
		var labelInfo = frameLabelDic[k];
		
		var frameLabelXML = new FrameLabelXML();
		frameLabelXML.setAttribute("startFrame", labelInfo.start);
		frameLabelXML.setAttribute("endFrame", labelInfo.start + labelInfo.length);
		frameLabelXML.setAttribute("name", k);
		frameLabelXML.setAttribute("tag", this.getFrameLabelTag(k));
		
		frameXMLList.push(frameLabelXML);
	}
	
	return frameXMLList;
}

FlaToXML.prototype.createFrameAction = function(layer) {
	var frameXMLList = [];

	var frames = layer.frames;
	
	for(var i = 0; i < frames.length; i++) {
		var frame = frames[i];
		
		var action = frame.actionScript;
		
		if(!action) continue;
		
		var isStop = (action.indexOf("stop();") != -1 || action.indexOf("stop()") != -1) ? 1 : 0;
		
		var frameActionXML = new FrameActionXML();
		
		frameActionXML.setAttribute("frameIndex", i);
		frameActionXML.setAttribute("stop", isStop);
		
		frameXMLList.push(frameActionXML);
	}
	
	return frameXMLList;
}

FlaToXML.prototype.createKeyFrame = function(parentElem, frame_index, hasTween, visible, frame) {
	var emptyKeyFrameXML = new KeyFrameXML();
	
	emptyKeyFrameXML.setAttribute( "hasTween", hasTween);
	emptyKeyFrameXML.setAttribute( "visible", visible);
	emptyKeyFrameXML.setAttribute( "frameIndex", frame_index);
	
	var orotation = parentElem.rotation;
	var oscalex = parentElem.scaleX;
	var oscaley = parentElem.scaleY;
	
	parentElem.rotation = 0;
	parentElem.scaleX = 1;
	parentElem.scaleY = 1;
	
	emptyKeyFrameXML.setAttribute( UIControlAttribute.kX, formatNumber( parentElem.x ) );
	emptyKeyFrameXML.setAttribute( UIControlAttribute.kY, formatNumber( parentElem.y ) );
	
	parentElem.rotation = orotation;
	parentElem.scaleX = oscalex;
	parentElem.scaleY = oscaley;
	
	
	emptyKeyFrameXML.setAttribute( "scaleX", formatNumber( parentElem.scaleX ) );
	emptyKeyFrameXML.setAttribute( "scaleY", formatNumber( parentElem.scaleY ) );
	
	var r = orotation;
	
	emptyKeyFrameXML.setAttribute( "isClockwise", frame.motionTweenRotate == "counter-clockwise" ? 0 : 1);
	
	//偏移范围至[0,359]
	r = r >= 0 ? r : 360 + r;
	
	emptyKeyFrameXML.setAttribute( "rotation", formatNumber( r ) );
	
	var alpha = (parentElem.colorAlphaPercent || parentElem.colorAlphaPercent == 0) ? parentElem.colorAlphaPercent / 100 : 1;
	
	emptyKeyFrameXML.setAttribute( "alpha", formatNumber( alpha) );
	
	return emptyKeyFrameXML;
}

FlaToXML.prototype.outputXML = function(){
	this.txml.outputXML();
}

/**
 @brief 导出当前打开的fla文件xml
 @param uiname:string uiname
 @param schemename:string 主题名
 @param isportrait:bool 是否竖屏
 */
export_current_layer = function( uiname, packWidth, packHeight){
	var convert = new FlaToXML();
	convert.convert( fl.getDocumentDOM(), null, uiname, packWidth, packHeight);
	return convert.txml.xml;
}

preview_pack_img = function(packWidth, packHeight) {
	var convert = new FlaToXML();
	
	var objfla = fl.getDocumentDOM();
	
	var packRects = convert.packImg(objfla, packWidth, packHeight);
	
	convert.packImgRects = packRects;
	
	convert.exportPackImg(packRects, objfla, packWidth, packHeight);
	
	var packImgFileURL = objfla.pathURI.replace(objfla.name, getPackImgFileName());
	
	return packImgFileURL;
}

getPackImgFileName = function() {
	return fl.getDocumentDOM().name.replace(".fla", ".png");
}

//继承的实现
/*
Base = function(){
	this.init();
}

Base.prototype.getName = function(){
	return this.name;
}

Base.prototype.init = function(){
	trace( "call base init" );
	this.name = "base";
}

Sub = function(){
	Sub.superClass.call(this);	//这里必须调用一下你类的构造
}

Sub.extend( Base ); //要先写继承，再定义函数
Sub.prototype.init = function(){
	Sub.superClass.prototype.init.call(this);	//调用父类的init
	trace( "call sub init" );
	this.name = "sub" + Sub.superClass.prototype.getName.call(this);
}

var base = new Base();
trace( base.getName() );
var sub = new Sub();
trace( sub.getName() );
*/