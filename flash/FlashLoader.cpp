/*
 * FlashLoader1.cpp
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */
#include "FlashLoader.h"
#include "Flash.h"

FlashLoader::FlashLoader():flash(0) {
}
FlashLoader::~FlashLoader() {
}
void FlashLoader::release() {
	vector<XMLInteract*>::iterator itor = stack.begin();
	while (itor != stack.end()) {
		delete (*itor);
		itor = stack.erase(itor);
	}
}
Flash* FlashLoader::load(string path) {
	CCSAXParser parser;
	if (false == parser.init("UTF-8")) {
		CCLog("init failed");
		return 0;
	}
    
	stack.push_back(this);
	parser.setDelegator(this);
	bool res = parser.parse(CCFileUtils::sharedFileUtils()->fullPathForFilename(path.c_str()).c_str());
	if (!res) {
		release();
		CCLog("parser failed");
		return 0;
	}
    
    stack.clear();
	return flash;
}
void FlashLoader::startElement(void *ctx, const char *name, const char **atts) {
	CC_UNUSED_PARAM(ctx);
	XMLInteract* child = stack.at(stack.size() - 1)->startParse(name);
	if (atts && atts[0]) {
		for (int i = 0; atts[i]; i += 2) {
			std::string key = (char*) atts[i];
			std::string value = (char*) atts[i + 1];
			child->initAttr(key, value);
		}
	}
	stack.push_back(child);
}
void FlashLoader::endElement(void *ctx, const char *name) {
	CC_UNUSED_PARAM(ctx);
	XMLInteract* child = stack.at(stack.size() - 1);
	child->endParse(name);
	stack.pop_back();
}
void FlashLoader::textHandler(void *ctx, const char *ch, int len) {
}
void FlashLoader::initAttr(string key, string value) {
}
XMLInteract* FlashLoader::startParse(const char *name) {
	std::string elementName = (char*) name;
	if (elementName == "flash") {
		return this->flash = new Flash();
	}
	return 0;
}
void FlashLoader::endParse(const char *name) {
}
