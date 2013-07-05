/*
 * Position.cpp
 *
 *  Created on: 2013-6-25
 *      Author: jie
 */

#include "Position.h"
#include <math.h>

std::vector<std::string> &split(const std::string &s, char delim, std::vector<std::string> &elems) {
	std::stringstream ss(s);
	std::string item;
	while (std::getline(ss, item, delim)) {
		elems.push_back(item);
	}
	return elems;
}
std::vector<std::string> split(const std::string &s, char delim) {
	std::vector < std::string > elems;
	split(s, delim, elems);
	return elems;
}

Position::Position() :
        x(0), y(0),//
        scalex(1), scaley(1), //
        centerx(0), centery(0), //
        rotation(0) {
}
Position::~Position() {
}
void Position::setPosition(float x, float y) {
	this->x = x;
	this->y = y;
}
void Position::setScale(float sx, float sy) {
	this->scalex = sx;
	this->scaley = sy;
}
void Position::setRotation(float r) {
	this->rotation = r;
}
void Position::setCenter(float x, float y) {
	this->centerx = x;
	this->centery = y;
}
void Position::initWith(Position* p) {
	this->x = p->x;
	this->y = p->y;
	this->scalex = p->scalex;
	this->scaley = p->scaley;
	this->centerx = p->centerx;
	this->centery = p->centery;
	this->rotation = p->rotation;
}
void Position::initAttr(string key, string value) {
	if (key == "x") {
		x = std::atof(value.c_str());
	} else if (key == "y") {
		y = std::atof(value.c_str());
	} else if (key == "scale") {
		vector<string> vs;
		split(value, ',', vs);
		scalex = std::atof(vs.at(0).c_str());
		scaley = std::atof(vs.at(1).c_str());
	} else if (key == "center") {
		vector<string> vs;
		split(value, ',', vs);
		centerx = std::atof(vs.at(0).c_str());
		centery = std::atof(vs.at(1).c_str());
	} else if (key == "rotation") {
		rotation = std::atof(value.c_str()) / M_PI * 180;
	}
}
XMLInteract* Position::startParse(const char *name) {
	return 0;
}
void Position::endParse(const char *name) {
}
void Position::print() {
	CCLog("point:x:%f, y:%f, cx:%f, cy:%f, sx:%f, sy:%f, r:%f", x, y, centerx, centery, scalex, scaley, rotation);
}
