/*
 * FlashLoader1.h
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */

#ifndef FLASHLOADER_H_
#define FLASHLOADER_H_

#include "cocos2d.h"
#include "XMLInteract.h"
#include <vector>

using namespace cocos2d;
using std::vector;
class Flash;

class FlashLoader: public CCSAXDelegator, public XMLInteract {
public:
	FlashLoader();
	~FlashLoader();

	Flash* load(string path);
	void release();

	// implement pure virtual methods of CCSAXDelegator
	void startElement(void *ctx, const char *name, const char **atts);
	void endElement(void *ctx, const char *name);
	void textHandler(void *ctx, const char *ch, int len);

	virtual void initAttr(string key, string value);
	virtual XMLInteract* startParse(const char *name);
	virtual void endParse(const char *name);

private:
	vector<XMLInteract*> stack;
	Flash* flash;
};

#endif /* FLASHLOADER_H_ */
