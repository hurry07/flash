/*
 * symbolimpl.cpp
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */
#include "cocos2d.h"
#include "TimeLine.h"
#include "Layer.h"
#include <string>
#include "Flash.h"
#include "CreateAdapter.h"
#include "FlashContext.h"

using namespace cocos2d;

TimeLine::TimeLine(Flash* flash) :
		Symbol(flash) {
}
TimeLine::~TimeLine() {
	vector<Layer*>::iterator itor = layers.begin();
	while (itor != layers.end()) {
		delete (*itor);
		itor = layers.erase(itor);
	}
}
Sequence* TimeLine::createSequence(CreateAdapter* adapter) {
	AnimationSequence* a = new AnimationSequence(this);
	int size = this->layers.size();
	for (int var = 0; var < size; ++var) {
		a->addLayer(layers.at(var)->createLayerNode(adapter));
	}
	return a;
}
void TimeLine::initAttr(string key, string value) {
	if (key == "framecount") {
		this->framecount = std::atoi(value.c_str());
	}
}
XMLInteract* TimeLine::startParse(const char *name) {
	std::string elementName = (char*) name;
	if (elementName == "layer") {
		Layer* l = new Layer(flash, framecount);
		this->layers.push_back(l);
		return l;
	}
	return 0;
}
void TimeLine::endParse(const char *name) {
}

AnimationSequence::AnimationSequence(TimeLine* symbol) {
	this->symbol = symbol;
	this->framecount = symbol->getFrameCount();
}
AnimationSequence::~AnimationSequence() {
	vector<LayerNode*>::iterator itor = layers.begin();
	while (itor != layers.end()) {
		delete (*itor);
		itor = layers.erase(itor);
	}
}
void AnimationSequence::update(float step) {
	int cycle = step / framecount;
	step = fmodf(step, framecount);
	float end = fmodf(currentTime + step, framecount);

	vector<LayerNode*>::iterator itor = layers.begin();
	while (itor != layers.end()) {
		(*itor)->update(cycle, currentTime, step, end);
		itor++;
	}

	currentTime = end;
}
void AnimationSequence::updateTo(float time) {
	vector<LayerNode*>::iterator itor = layers.begin();
	while (itor != layers.end()) {
		(*itor)->updateTo(time);
		itor++;
	}
}
void AnimationSequence::apply(FlashContext* context) {
	vector<LayerNode*>::iterator itor = layers.begin();
	while (itor != layers.end()) {
        context->pushContext();
		(*itor)->apply(context);
        context->popContext();
		itor++;
	}
}
void AnimationSequence::addLayer(LayerNode* layer) {
	this->layers.push_back(layer);
	this->node->addChild(layer->getNode());
}

