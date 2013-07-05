/*
 * Layer1.h
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */

#ifndef LAYER_H_
#define LAYER_H_

#include "FlashManager.h"
#include "Sequence.h"
#include <vector>

using std::vector;

class Flash;
class Frame;
class CreateAdapter;
class Sequence;
class LayerNode;
class Position;

/**
 * layer of TimeLine1
 */
class Layer: public XMLInteract {
public:
	Layer(Flash* flash, int framecount);
	~Layer();

	void addFrame(Frame* conf);
	void addDrawable(int dindex);

	/**
	 * @param time, given time in current layer
	 * @tip last frame, speed up the finding logic
	 */
	int findStartFrame(int time, int tip);
	Frame* getFrame(int index);

	LayerNode* createLayerNode(CreateAdapter* adapter);
	Sequence* createSequence(int drawid, CreateAdapter* adapter);

	vector<Frame*> frames;
	vector<int> drawable;
	Flash* flash;
	int framecount;
    bool debug;

	virtual void initAttr(string key, string value);
	virtual XMLInteract* startParse(const char *name);
	virtual void endParse(const char *name);

	void initRefer(string key, string value);
	int getFrameCount();

private:
	static const int STATUS_NONE = -1;
	static const int STATUS_DRAWABLE = 0;
	static const int STATUS_REFER = 1;
	static const int STATUS_FRAMES = 10;
	int status; // 0 drawable, 1 frames

	void framesInitFinish();
	void checkAnimaTip(Frame* previous, Frame* current);
};

class LayerNode: public Sequence {
public:
	LayerNode(Layer* layer);
	virtual ~LayerNode();
	/**
	 * cycled times
	 * update time
	 */
	void update(int cycle, float current, float step, float stopTime);
	virtual void updateTo(float time);
	/**
	 * will not be called
	 */
	virtual void update(float step);
	virtual void apply(FlashContext* context);

	void init(CreateAdapter* adapter);

private:
	Layer* layer;
	vector<Sequence*> drawable;
	/**
	 * last frame index
	 */
	int currentFrame;
};

#endif /* LAYER_H_ */
