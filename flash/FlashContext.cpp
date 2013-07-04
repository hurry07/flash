//
//  FlashContext.cpp
//  flash
//
//  Created by jie on 13-7-3.
//
//
#include "FlashContext.h"

FlashContext::FlashContext() :alpha(1) {
}

float FlashContext::getAlpha() {
    return alpha;
}
void FlashContext::setAlpha(float a) {
    alpha = a;
}
void FlashContext::multipAlpha(float percent) {
    alpha = alpha * percent;
}
int FlashContext::getAlphaInt(){
    return alpha * 255;
}
void FlashContext::reset() {
    alpha = 1;
    alphaStack.clear();
}
void FlashContext::pushContext() {
    alphaStack.push_back(alpha);
}
void FlashContext::popContext() {
    alpha = alphaStack.back();
    alphaStack.pop_back();
}
