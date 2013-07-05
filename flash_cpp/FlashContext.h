//
//  FlashContext.h
//  flash
//
//  Created by jie on 13-7-3.
//
//

#ifndef __flash__FlashContext__
#define __flash__FlashContext__

#include <vector>

using std::vector;

class FlashContext {
public:
    FlashContext();

    float getAlpha();
    void setAlpha(float a);
    void multipAlpha(float percent);
    int getAlphaInt();

    void reset();
    void pushContext();
    void popContext();

private:
    float alpha;
    vector<float> alphaStack;
};

#endif /* defined(__flash__FlashContext__) */
