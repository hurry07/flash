/*
 * Symbol1.h
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */

#ifndef SYMBOL_H_
#define SYMBOL_H_

#include "XMLInteract.h"

class Flash;
class Sequence;
class CreateAdapter;

/**
 * symbol belongs to model
 */
class Symbol: public XMLInteract {
public:
	Symbol(Flash* flash);
	virtual ~Symbol();
	virtual Sequence* createSequence(CreateAdapter* adapter)=0;
	int getFrameCount();

protected:
	Flash* flash;
	int framecount;
};

#endif /* SYMBOL_H_ */
