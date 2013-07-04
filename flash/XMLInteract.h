/*
 * XMLInteract1.h
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */

#ifndef XMLINTERACT_H_
#define XMLINTERACT_H_

#include <string>

using std::string;

class XMLInteract {
public:
    virtual ~XMLInteract() {}
	virtual void initAttr(string key, string value)= 0;
	virtual XMLInteract* startParse(const char *name)= 0;
	virtual void endParse(const char *name)= 0;
};

#endif /* XMLINTERACT_H_ */
