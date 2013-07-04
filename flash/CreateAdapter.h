/*
 * CreateAdapter1.h
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */

#ifndef CREATEADAPTER_H_
#define CREATEADAPTER_H_

#include "cocos2d.h"
#include <string>

using cocos2d::CCSprite;
using cocos2d::CCSize;
using cocos2d::CCPoint;
using std::string;

/**
 * adapter
 */
class CreateAdapter {
public:
    CreateAdapter();
    ~CreateAdapter();
	/**
	 * @param size size change
	 * @param aline to old sprite
	 */
	CCSprite* createSprite(string path, CCSize& size, CCPoint& aline);
};

#endif /* CREATEADAPTER_H_ */
