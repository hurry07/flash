/*
 * FlashManager1.h
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */

#ifndef FLASHMANAGER_H_
#define FLASHMANAGER_H_

#include "cocos2d.h"
#include "Symbol.h"
#include <map>
#include <string>

using namespace cocos2d;
using std::map;
using std::string;

class Sequence;
class Flash;
class FlashContext;
class CreateAdapter;
class FlashLoader;

class FlashInstance {
public:
	FlashInstance(Flash* flash, Sequence* seq);
	~FlashInstance();

	void update(float step);
	void updateTo(float time);
	void updateToPercent(float percent);
	void updateToFrame(int frame);

	CCNode* getNode();

	float getDuration();
	float getFrameRate();
	void setFrameRate(float rate);

private:
	float framerate;
	Sequence* sequence;
	CCNode* node;
    FlashContext* context;
    void apply();
    Flash* flash;
};

class FlashManager {
public:
    FlashManager();
    ~FlashManager();

	Flash* load(string name, string path);
    void unload(string name);
    Flash* find(string name);
    FlashInstance* create(string name, CreateAdapter* adapter = 0);
    void clear();

private:
    FlashLoader* loader;
    CreateAdapter* emptyAdapter;
    map<string, Flash*> configs;
};

#endif /* FLASHMANAGER_H_ */
