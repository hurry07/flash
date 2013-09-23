/*
 * Frame.cpp
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */
#include "Frame.h"
#include "Position.h"
#include "FlashContext.h"

Frame::Frame() :
		animationType(ANIMATION_NONE), //
		animationTip(TIP_NONE), //
		position(0), //
		drawable(-1), //
		start(0), //
		duration(0), //
		rotationCycles(0),
        rotationDirection(0),
        alpha(1) {
}
Frame::~Frame() {
	if (position != 0) {
		delete position;
	}
}
float Frame::interprate(float p, float f1, float f2) {
	return f1 + (f2 - f1) * p;
}
void Frame::interprate(float percent, Frame* f1, Frame* f2, Position& p, FlashContext* context) {
    if(percent < 0 || percent > 1) {
        CCLog("error percent:%f", percent);
    }
	Position* p1 = f1->position;
	Position* p2 = f2->position;
	if ((f1->animationTip & TIP_TRANSLATE) > 0) {
		p.setPosition(interprate(percent, p1->x, p2->x), interprate(percent, p1->y, p2->y));
	}
	if ((f1->animationTip & TIP_SCALE) > 0) {
		p.setScale(interprate(percent, p1->scalex, p2->scalex), interprate(percent, p1->scaley, p2->scaley));
	}
	if ((f1->animationTip & TIP_ROTATE) > 0) {
		p.setRotation(interprateRotate(percent, f1, f2));
	}
	if ((f1->animationTip & TIP_TRANSLATE_CENTER) > 0) {
		p.setCenter(interprate(percent, p1->centerx, p2->centerx), interprate(percent, p1->centery, p2->centery));
	}
    context->multipAlpha(interprate(percent, f1->alpha, f2->alpha));
}
float Frame::interprateRotate(float percent, Frame* f1, Frame* f2) {
    float gap = f2->position->rotation - f1->position->rotation;
    int flag = 1;
    if(f1->rotationDirection == 0) {
        if(gap < -180) {
            gap += 360;
        } else if(gap > 180) {
            gap -= 360;
        }
        flag = gap < 0 ? -1 : 1;
    } else if(f1->rotationDirection == 1) {
        if(gap < 0) {
            gap += 360;
        }
    } else {
        if(gap > 0) {
            gap -= 360;
        }
        flag = -1;
    }
    return f1->position->rotation + (f1->rotationCycles * 360 * flag + gap) * percent;
}
int Frame::getEnd() {
	return start + duration;
}
void Frame::initAnimaTip(Frame* previous, Frame* current) {
	if (previous->animationType != Frame::ANIMATION_MOTION) {
		return;
	}
	Position* p1 = previous->position;
	Position* p2 = current->position;
	if (p1->x != p2->x || p1->y != p2->y) {
		previous->animationTip |= Frame::TIP_TRANSLATE;
	}
	if (p1->scalex != p2->scalex || p1->scaley != p2->scaley) {
		previous->animationTip |= Frame::TIP_SCALE;
	}
	if (p1->centerx != p2->centerx || p1->centery != p2->centery) {
		previous->animationTip |= Frame::TIP_TRANSLATE_CENTER;
	}
	if (p1->rotation != p2->rotation || previous->rotationCycles != 0) {
		previous->animationTip |= Frame::TIP_ROTATE;
	}
}
void Frame::initAttr(string key, string value) {
	if (key == "drawable") {
		drawable = std::atoi(value.c_str());
	} else if (key == "start") {
		start = std::atoi(value.c_str());
	} else if (key == "duration") {
		duration = std::atoi(value.c_str());
	} else if (key == "animation") {
		if (value == "none") {
			animationType = ANIMATION_NONE;
		} else if (value == "motion") {
			animationType = ANIMATION_MOTION;
		} else {
			animationType = ANIMATION_SHAPE;
		}
	} else if (key == "rotationDirection") {
		rotationDirection = std::atoi(value.c_str());
	} else if (key == "rotationCycles") {
		rotationCycles = std::atoi(value.c_str());
	} else if (key == "alpha") {
		alpha = std::atof(value.c_str());
	}
}
XMLInteract* Frame::startParse(const char *name) {
	std::string elementName = (char*) name;
	if (elementName == "position") {
		return this->position = new Position();
	}
	return 0;
}
void Frame::endParse(const char *name) {
}
bool Frame::isVisiable() {
	return this->drawable >= 0;
}
