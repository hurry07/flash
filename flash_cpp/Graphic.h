/*
 * Graphic1.h
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */

#ifndef GRAPHIC_H_
#define GRAPHIC_H_

#include "Symbol.h"
#include "Sequence.h"
#include <string>

#include "cocos2d.h"

using cocos2d::CCSprite;
using std::string;
class Sequence;
class CreateAdapter;
class Position;

/**
 * an picture
 */
class Graphic: public Symbol {
public:
	Graphic(Flash* flash);
	virtual ~Graphic();

	virtual Sequence* createSequence(CreateAdapter* adapter);

	Position* position;
	string path;

	virtual void initAttr(string key, string value);
	virtual XMLInteract* startParse(const char *name);
	virtual void endParse(const char *name);
};

/**
 * stands for a single picture
 */
class GraphicSequence: public Sequence {
public:
	GraphicSequence(Graphic* graphic);
	virtual ~GraphicSequence();

	virtual void update(float step);
	virtual void updateTo(float time);
	virtual void apply(FlashContext* context);

    void setSprite(CCSprite* sprite);

private:
	/**
	 * config refer
	 */
	Graphic* graphic;
    CCSprite* sprite;
    int alphaCache;
};

#endif /* GRAPHIC_H_ */
