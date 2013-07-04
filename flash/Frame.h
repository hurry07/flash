/*
 * Frame1.h
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */

#ifndef FRAME_H_
#define FRAME_H_

#include "FlashManager.h"

class Position;
class FlashContext;

class Frame: public XMLInteract {
public:
	static const int ANIMATION_NONE = 0;
	static const int ANIMATION_MOTION = 1;
	static const int ANIMATION_SHAPE = 2;

	static const int TIP_NONE = 0;
	static const int TIP_TRANSLATE = 1;
	static const int TIP_SCALE = 1 << 1;
	static const int TIP_ROTATE = 1 << 2;
	static const int TIP_TRANSLATE_CENTER = 1 << 3;

	// int drawable, int start, int duration, Position* p
	Frame();
	~Frame();

	int drawable;
	int start;
	/**
	 * animation time
	 */
	int duration;
	/**
	 * properties change between current frame and next frame
	 */
	int animationType;
	int animationTip;
	/**
	 * cw or ccw cycle count
	 */
	int rotationCycles;
    int rotationDirection;
    float alpha;

	int getEnd();
	static void initAnimaTip(Frame* previous, Frame* current);

	Position* position;

	static float interprate(float p, float f1, float f2);
	static void interprate(float percent, Frame* f1, Frame* f2, Position& p, FlashContext* context);
    static float interprateRotate(float percent, Frame* f1, Frame* f2);

	virtual void initAttr(string key, string value);
	virtual XMLInteract* startParse(const char *name);
	virtual void endParse(const char *name);

	bool isVisiable();
};

#endif /* FRAME_H_ */
