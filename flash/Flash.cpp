/*
 * Flash1.cpp
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */
#include "Flash.h"
#include "FlashManager.h"
#include "Graphic.h"
#include "TimeLine.h"
#include "Symbol.h"
#include "FlashContext.h"

Flash::Flash() :
		width(0), height(0), framerate(24), instanceCount(0) {
}
Flash::~Flash() {
    if(getInstanceCount() > 0) {
        CCLog("delete flash config with instance alive:%d", getInstanceCount());
    }
	vector<Symbol*>::iterator itor = symbols.begin();
	while (itor != symbols.end()) {
		delete (*itor);
		itor = symbols.erase(itor);
	}
}
void Flash::addSymbol(Symbol* symbol) {
	symbols.push_back(symbol);
}
Symbol* Flash::findSymbol(int index) {
	return symbols.at(index);
}
string Flash::getImgPath(string& name) {
    if(resourcePath.length() == 0) {
        return name;
    }
    return resourcePath + '/' + name;
}
FlashInstance* Flash::createInstance(CreateAdapter* adapter) {
	FlashInstance* ins = new FlashInstance(this, createMain(adapter));
    ins->updateToFrame(0);
	return ins;
}
Sequence* Flash::createSequence(int index, CreateAdapter* adapter) {
    return symbols.at(index)->createSequence(adapter);
}
Sequence* Flash::createMain(CreateAdapter* adapter) {
    return symbols.back()->createSequence(adapter);
}
void Flash::initAttr(string key, string value) {
	if (key == "width") {
		width = std::atof(value.c_str());
	} else if (key == "height") {
		height = std::atof(value.c_str());
	} else if (key == "framerate") {
		framerate = std::atoi(value.c_str());
	} else if (key == "resourcePath") {
		resourcePath = value;
	}
}
XMLInteract* Flash::startParse(const char *name) {
	std::string elementName = (char*) name;
	if (elementName == "graphic") {
		Graphic* g = new Graphic(this);
		addSymbol(g);
		return g;
	} else if (elementName == "timeline") {
		TimeLine* g = new TimeLine(this);
		addSymbol(g);
		return g;
	}
	return 0;
}
void Flash::endParse(const char *name) {
}
int Flash::releaseInstance() {
    return --instanceCount;
}
int Flash::referInstance() {
    return ++instanceCount;
}
int Flash::getInstanceCount() {
    return instanceCount;
}
void Flash::setPath(string path) {
    this->path = path;
}
string Flash::getPath() {
    return this->path;
}

