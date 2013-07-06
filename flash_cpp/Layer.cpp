/*
 * Layer1.cpp
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */
#include "Layer.h"
#include "Frame.h"
#include "Position.h"
#include "Flash.h"
#include "Sequence.h"
#include "FlashContext.h"

Layer::Layer(Flash* flash, int framecount) :
		status(STATUS_NONE), debug(false) {
	this->flash = flash;
	this->framecount = framecount;
}
Layer::~Layer() {
	vector<Frame*>::iterator itor = frames.begin();
	while (itor != frames.end()) {
		delete (*itor);
		itor = frames.erase(itor);
	}
}
void Layer::addFrame(Frame* conf) {
	frames.push_back(conf);
}
void Layer::addDrawable(int index) {
	drawable.push_back(index);
}
Frame* Layer::getFrame(int index) {
	if (index >= frames.size()) {
		return 0;
	}
	return frames.at(index);
}
int Layer::findStartFrame(int time, int tip = 0) {
	if (frames.size() == 0) {
		return -1;
	}
	// < start, return last frame
	if (time < frames.at(0)->start) {
		return 0;
	}
	// >= end
	if (time >= frames.at(frames.size() - 1)->getEnd()) {
		return frames.size() - 1;
	}

	int start = 0;
	int end = frames.size();
	if (tip >= 0 && tip < end) {
		if (frames.at(tip)->start <= time) {
			start = tip;
		} else {
			end = tip;
		}
	}

	int c = 0;
	while (end - start > 1) {
		int mid = (start + end) / 2;
		c = frames.at(mid)->start - time;
		if (c > 0) {
			end = mid;
		} else {
			start = mid;
		}
	}
	return start;
}
LayerNode* Layer::createLayerNode(CreateAdapter* adapter) {
	LayerNode* l = new LayerNode(this);
	l->init(adapter);
	return l;
}
void Layer::initRefer(string key, string value) {
	if (key == "index") {
		this->drawable.push_back(atoi(value.c_str()));
	}
}
void Layer::initAttr(string key, string value) {
    if(status == STATUS_NONE) {
        if(key == "debug") {
            if(value == "true" || value == "TRUE") {
                debug = true;
            } else {
                debug = false;
            }
        }
    } else if (status == STATUS_REFER) {
		initRefer(key, value);
	}
}
XMLInteract* Layer::startParse(const char *name) {
	std::string elementName = (char*) name;
	if (elementName == "drawable") {
		status = STATUS_DRAWABLE;
		return this;
	} else if (elementName == "frames") {
		status = STATUS_FRAMES;
		return this;
	} else if (elementName == "refer") {
		status = STATUS_REFER;
		return this;
	} else if (elementName == "frame") {
		Frame* frame = new Frame();
		addFrame(frame);
		return frame;
	}
	return 0;
}
void Layer::framesInitFinish() {
	vector<Frame*> target;
	int preend = 0;

	vector<Frame*>::iterator itor = frames.begin();
	while (itor != frames.end()) {
		Frame* current = *itor;
		if (current->start > preend) {
			Frame* p = new Frame();
			p->start = preend;
			p->duration = current->start - preend;
			target.push_back(p);
		}
		target.push_back(current);
		preend = current->getEnd();
		itor++;
	}

	if (preend < framecount) {
		Frame* p = new Frame();
		p->start = preend;
		p->duration = framecount - preend;
		target.push_back(p);
	}

	if (target.size() > frames.size()) {
		frames = target;
	}

	// detect animation tip
	Frame* previous = 0;
	itor = frames.begin();
	while (itor != frames.end()) {
		Frame* current = *itor;
		if (previous != 0) {
			Frame::initAnimaTip(previous, current);
		}
		previous = current;
		itor++;
	}
}
int Layer::getFrameCount() {
	return frames.size();
}
void Layer::endParse(const char *name) {
	std::string elementName = (char*) name;
	if (elementName == "frames") {
		framesInitFinish();
	}
}
Sequence* Layer::createSequence(int drawableId, CreateAdapter* adapter) {
	return flash->findSymbol(drawable.at(drawableId))->createSequence(adapter);
}

LayerNode::LayerNode(Layer* layer) :
		Sequence(layer->framecount), currentFrame(0) {
	this->layer = layer;
	node->setVisible(true);
}
LayerNode::~LayerNode() {
	vector<Sequence*>::iterator itor = drawable.begin();
	while (itor != drawable.end()) {
		delete (*itor);
		itor = drawable.erase(itor);
	}
}
void LayerNode::update(int cycle, float current, float step, float stopTime) {
	currentTime = stopTime;
	currentFrame = layer->findStartFrame(floorf(current), currentFrame);

    int size = layer->getFrameCount();
	int count = size * 2;
	for (int var = currentFrame; var < count; ++var) {
		Frame* f = layer->getFrame(var % size);
		float remain = f->getEnd() - current;
		if (remain >= step) {
			if (f->isVisiable()) {
				Sequence* symbol = drawable.at(f->drawable);
				symbol->update(step);
			}
			currentFrame = var % size;
			break;
		} else {
			if (f->isVisiable()) {
				Sequence* symbol = drawable.at(f->drawable);
				symbol->update(remain);
			}
			step -= remain;
		}

		current = fmodf(f->getEnd(), framecount);
	}

	if (cycle > 0) {
		// update each
		count = count / 2;
		for (int var = 0; var < count; ++var) {
			Frame* f = layer->getFrame(var);
			if (f->isVisiable()) {
				Sequence* symbol = drawable.at(f->drawable);
				symbol->update(f->duration);
			}
		}
	}
}
void LayerNode::update(float time) {
}
void LayerNode::updateTo(float time) {
	currentFrame = layer->findStartFrame(floorf(time), currentFrame);
	currentTime = time;
}
void LayerNode::apply(FlashContext* context) {
	Frame* f = layer->getFrame(currentFrame);

    if(layer->debug) {
        CCLog("layer.apply:%f", currentTime);
    }
	if (f->isVisiable()) {
		node->setVisible(true);

		if (f->animationType != Frame::ANIMATION_MOTION) {
			applyPosition(*(f->position));
            context->multipAlpha(f->alpha);
		} else {
			Frame* next = layer->getFrame(currentFrame + 1);
			if (next == 0) {
				applyPosition(*(f->position));
                context->multipAlpha(f->alpha);
			} else {
        		Position p;
				float time = currentTime - f->start;
                //context->setAlpha(1);
				Frame::interprate(time / f->duration, f, next, p, context);
				applyPosition(p);
			}
		}

		Sequence* child = drawable.at(f->drawable);
		child->apply(context);
		node->removeAllChildren();
		node->addChild(child->getNode());
	} else {
		node->setVisible(false);
	}
}

void LayerNode::init(CreateAdapter* adapter) {
	int size = layer->drawable.size();
	for (int var = 0; var < size; ++var) {
		this->drawable.push_back(layer->createSequence(var, adapter));
	}
}

