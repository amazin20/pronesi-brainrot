'use strict';

const $=id=>document.getElementById(id);
const canvas=$('gl');
const UI={panel:$('labPanel'),start:$('startBtn'),reset:$('resetBtn'),pause:$('pauseBtn'),pauseModal:$('pause'),resume:$('resumeBtn'),restartPause:$('restartPause'),complete:$('complete'),again:$('againBtn'),hint:$('hint'),hintTitle:$('hintTitle'),hintText:$('hintText'),toast:$('impactToast'),mass:$('massBadge'),massName:$('massName'),massValue:$('massValue'),massFeel:$('massFeel'),grip:$('gripMeter'),gripFill:$('gripFill'),gripState:$('gripState'),status:$('statusText'),sdk:$('sdkBadge')};

