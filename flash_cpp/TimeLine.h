/*
 * symbolimpl.h
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */

#ifndef TIMELINE_H_
#define TIMELINE_H_

#include "Symbol.h"
#include "Sequence.h"
#include <vector>
#include <string>

using std::vector;
using std::string;

class Flash;
class CreateAdapter;
class Layer;
class LayerNode;
class FlashContext;

/**
 * flash TimeLine1 config
 */
class TimeLine: public Symbol {
public:
	TimeLine(Flash* flash);
	virtual ~TimeLine();

	virtual Sequence* createSequence(CreateAdapter* adapter);

	vector<Layer*> layers;
	/**
	 * symbol index
	 */
	vector<int> drawable;

	virtual void initAttr(string key, string value);
	virtual XMLInteract* startParse(const char *name);
	virtual void endParse(const char *name);
};

/**
 * flash timeline instance
 */
class AnimationSequence: public Sequence {
public:
	AnimationSequence(TimeLine* symbol);
	virtual ~AnimationSequence();

	virtual void update(float step);
	virtual void updateTo(float time);
	virtual void apply(FlashContext* context);

	virtual void addLayer(LayerNode* layer);

private:
	/**
	 * drawable instance
	 */
	vector<LayerNode*> layers;
	/**
	 * config reference
	 */
	TimeLine* symbol;
};

#endif /* TIMELINE_H_ */
