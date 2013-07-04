/*
 * Flash1.h
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */

#ifndef FLASH_H_
#define FLASH_H_

#include "XMLInteract.h"
#include <vector>

using std::vector;
using std::string;
class Symbol;
class Sequence;
class FlashInstance;
class CreateAdapter;
class FlashContext;

/**
 * total flash file
 */
class Flash: public XMLInteract {
public:
	static const int NODE_WIDTH = 100;
	static const int NODE_HEIGHT = 100;

	Flash();
	~Flash();

	void addSymbol(Symbol* symbol);
	Symbol* findSymbol(int index);
    string getImgPath(string& name);

	vector<Symbol*> symbols;
	float width;
	float height;
	int framerate;
    string resourcePath;

	FlashInstance* createInstance(CreateAdapter* adapter);
	Sequence* createSequence(int index, CreateAdapter* adapter);
	Sequence* createMain(CreateAdapter* adapter);

	virtual void initAttr(string key, string value);
	virtual XMLInteract* startParse(const char *name);
	virtual void endParse(const char *name);
    
    int releaseInstance();
    int referInstance();
    int getInstanceCount();

    void setPath(string path);
    string getPath();

private:
    int instanceCount;
    string path;
};

#endif /* FLASH_H_ */
