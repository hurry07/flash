/*
 * Graphic1.cpp
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */
#include "Graphic.h"
#include "Flash.h"
#include "Position.h"
#include "CreateAdapter.h"
#include "FlashContext.h"

Graphic::Graphic(Flash* flash) :
		Symbol(flash), position(0) {
}
Graphic::~Graphic() {
	delete position;
}
Sequence* Graphic::createSequence(CreateAdapter* adapter) {
	GraphicSequence* g = new GraphicSequence(this);

	CCNode* node = g->getNode();
	node->setContentSize(CCSize(Flash::NODE_WIDTH, Flash::NODE_HEIGHT));

	CCSize enlarge;
	CCPoint aline;
    
    string path = flash->getImgPath(this->path);
	CCSprite* sprite = adapter->createSprite(path, enlarge, aline);

	// there is no sprite intercepter
	if (sprite == 0) {
		sprite = CCSprite::create(path.c_str());
		const CCSize& size = sprite->getContentSize();

		sprite->setAnchorPoint(CCPoint(position->centerx / size.width, 1 - position->centery / size.height));
	} else {
		const CCSize& picsize = sprite->getContentSize();
		CCSize size(picsize.width + enlarge.width, picsize.height + enlarge.height);
		float cx = position->centerx - enlarge.width * aline.x;
		float cy = position->centery - enlarge.height * (1 - aline.y);

		sprite->setAnchorPoint(CCPoint(cx / picsize.width, 1 - cy / picsize.height));
	}

	sprite->setPosition(CCPoint(position->x, -position->y));
	sprite->setRotation(position->rotation);
	node->addChild(sprite);

    g->setSprite(sprite);
	return g;
}
void Graphic::initAttr(string key, string value) {
	if (key == "path") {
		this->path = value;
	}
}
XMLInteract* Graphic::startParse(const char *name) {
	std::string elementName = (char*) name;
	if (elementName == "position") {
		return this->position = new Position();
	}
	return 0;
}
void Graphic::endParse(const char *name) {
}

GraphicSequence::GraphicSequence(Graphic* graphic) :
		Sequence(1), alphaCache(255) {
	this->graphic = graphic;
}
GraphicSequence::~GraphicSequence() {
}
void GraphicSequence::update(float step) {
}
void GraphicSequence::updateTo(float step) {
}
void GraphicSequence::apply(FlashContext* context) {
    int alpha = context->getAlphaInt();
    if(alpha != alphaCache) {
        sprite->setOpacity(alphaCache = alpha);
    }
}
void GraphicSequence::setSprite(CCSprite* sprite) {
    this->sprite = sprite;
}
