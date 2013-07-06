/*
 * Symbol1.cpp
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */
#include "Symbol.h"

Symbol::Symbol(Flash* flash) :
		framecount(1) {
	this->flash = flash;
}
Symbol::~Symbol() {
}
int Symbol::getFrameCount() {
	return framecount;
}

