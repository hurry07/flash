/*
 * FlashManager1.cpp
 *
 *  Created on: 2013-6-28
 *      Author: jie
 */
#include "FlashManager.h"
#include "Flash.h"
#include "Sequence.h"
#include "FlashContext.h"
#include "CreateAdapter.h"
#include "FlashLoader.h"

FlashInstance::FlashInstance(Flash* flash, Sequence* seq) {
    flash->referInstance();
    this->flash = flash;
	this->framerate = flash->framerate;
	this->sequence = seq;
    this->context = new FlashContext();

	this->node = CCNode::create();
	node->retain();
	node->setContentSize(CCSize(flash->width, flash->height));
	CCNode* cnode = seq->getNode();
	cnode->setPosition(CCPoint(0, flash->height));
	node->addChild(cnode);
}
FlashInstance::~FlashInstance() {
	delete sequence;
    delete context;
	node->release();
    flash->releaseInstance();
}
void FlashInstance::update(float step) {
	sequence->update(step * framerate);
	apply();
}
void FlashInstance::updateTo(float time) {
	sequence->updateTo(time / getDuration() * sequence->getFrameCount());
	apply();
}
void FlashInstance::updateToPercent(float percent) {
	sequence->updateTo(percent * sequence->getFrameCount());
	apply();
}
void FlashInstance::updateToFrame(int frame) {
	sequence->updateTo(frame);
	apply();
}
CCNode* FlashInstance::getNode() {
	return this->node;
}
float FlashInstance::getDuration() {
	float time = sequence->getFrameCount();
	return time / framerate;
}
float FlashInstance::getFrameRate() {
	return this->framerate;
}
void FlashInstance::setFrameRate(float rate) {
	this->framerate = rate;
}
void FlashInstance::apply() {
    context->reset();
    sequence->apply(context);
}

FlashManager::FlashManager() {
    emptyAdapter = new CreateAdapter();
    loader = new FlashLoader();
}
FlashManager::~FlashManager() {
    delete emptyAdapter;
    delete loader;
    clear();
}
void FlashManager::clear() {
    map<string, Flash*>::iterator itor = configs.begin();
    while (itor != configs.end()) {
        delete itor->second;
        itor++;
    }
    configs.clear();
}
Flash* FlashManager::load(string name, string path) {
    // find if already loaded
    map<string, Flash*>::iterator findItor = configs.find(name);
    if(findItor != configs.end()) {
        Flash* previous = findItor->second;
        // if config has already loaded
        if(previous->getPath() == path) {
            return previous;
        } else {
            configs.erase(findItor);
            delete previous;
        }
    }

	Flash* flash = loader->load(path);
    if(flash == 0) {
        return 0;
    }

    // save the newly loaded config
    flash->setPath(path);
    configs.insert(map<string, Flash*>::value_type(name, flash));
    return flash;
}
void FlashManager::unload(string name) {
    map<string, Flash*>::iterator itor = configs.find(name);
    if(itor != configs.end()) {
        Flash* conf = itor->second;
        configs.erase(itor);
        delete conf;
    }
}
Flash* FlashManager::find(string name) {
    map<string, Flash*>::iterator itor = configs.find(name);
    if(itor == configs.end()) {
        return 0;
    }
    return itor->second;
}
FlashInstance* FlashManager::create(string name, CreateAdapter* adapter) {
    Flash* conf = find(name);
    if(conf == 0) {
        return 0;
    }
    return conf->createInstance(adapter == 0 ? emptyAdapter : adapter);
}

