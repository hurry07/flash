/*
 * Sequence1.cpp
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */
#include "Sequence.h"
#include "Flash.h"

Sequence::Sequence() :
		currentTime(0) {
	this->framecount = 0;
	this->visiable = true;
	this->initNode();
}
Sequence::Sequence(int time) :
		currentTime(0) {
	this->framecount = time;
	this->visiable = true;
	this->initNode();
}
Sequence::~Sequence() {
	this->node->release();
}
void Sequence::show() {
	this->visiable = true;
}
void Sequence::hide() {
	this->visiable = false;
}
CCNode* Sequence::getNode() {
	return this->node;
}
int Sequence::getFrameCount() {
	return this->framecount;
}
void Sequence::applyPosition(Position& p) {
	node->setVisible(visiable);
	if (!visiable) {
		return;
	}

	const CCSize& size = node->getContentSize();
	node->setAnchorPoint(CCPoint(p.centerx / size.width, -p.centery / size.height));
	node->setPosition(CCPoint(p.x, -p.y));
	node->setRotation(p.rotation);
    node->setScaleX(p.scalex);
    node->setScaleY(p.scaley);
}
void Sequence::initNode() {
	this->node = CCNode::create();
	this->node->retain();
	this->node->setContentSize(CCSize(Flash::NODE_WIDTH, Flash::NODE_HEIGHT));
}
