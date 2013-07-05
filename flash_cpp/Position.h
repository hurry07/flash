/*
 * Position.h
 *
 *  Created on: 2013-6-25
 *      Author: jie
 */

#ifndef POSITION_H_
#define POSITION_H_

#include "cocos2d.h"
#include <string>
#include <vector>
#include "FlashManager.h"

using namespace cocos2d;
using std::string;
using std::vector;

/**
 * bean containing position of a key frame
 */
class Position: public XMLInteract {
public:
	Position();
	virtual ~Position();

	float x;
	float y;
	float scalex;
	float scaley;
	float centerx;
	float centery;
float rotation;

	void setPosition(float x, float y);
	void setScale(float sx, float sy);
	void setRotation(float r);
	void setCenter(float x, float y);

	void initWith(Position* p);

	virtual void initAttr(string key, string value);
	virtual XMLInteract* startParse(const char *name);
	virtual void endParse(const char *name);

	void print();
};

#endif /* POSITION_H_ */
