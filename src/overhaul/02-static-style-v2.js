'use strict';
(()=>{const G=window.GAME,base=G.makeStatic;if(!base)return;G.makeStatic=(x,y,z,sx,sy,sz,opt={})=>{const s=base(x,y,z,sx,sy,sz,opt);if(!Object.prototype.hasOwnProperty.call(opt,'color'))s.color=null;if(!Object.prototype.hasOwnProperty.call(opt,'rough'))s.rough=.82;if(!Object.prototype.hasOwnProperty.call(opt,'metal'))s.metal=.02;return s};})();
