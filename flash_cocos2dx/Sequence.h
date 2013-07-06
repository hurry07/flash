/*
 * Sequence1.h
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */

#ifndef SEQUENCE_H_
#define SEQUENCE_H_

#include "Position.h"

using cocos2d::CCNode;

class FlashContext;

/**
 * time line is an instance
 */
class Sequence {
public:
	Sequence(int time);
	Sequence();
	virtual ~Sequence();

	/**
	 * update with time pass
	 */
	virtual void update(float step) =0;
	/**
	 * update to given time
	 */
	virtual void updateTo(float time)=0;
	/**
	 * setup sprite position when it is visible, called by parent
	 */
	virtual void applyPosition(Position& p);
	/**
	 * calculate children position
	 */
    virtual void apply(FlashContext* context)=0;

	CCNode* getNode();
	int getFrameCount();

	void show();
	void hide();

protected:
	int framecount; // total time
	float currentTime; // current update time
	bool visiable;
	CCNode* node;
	void initNode();
};

#endif /* SEQUENCE_H_ */
