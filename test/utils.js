import { NIL } from '../src/rb-tree.js';

function isBalanced(node) {
    const [mind, maxd] = minMaxDepth(node);
    return (maxd / mind) <= 2;
}

function minMaxDepth(node) {
    if (node === NIL) {
        return [1, 1];
    }
    const [minl, maxl] = minMaxDepth(node.l);
    const [minr, maxr] = minMaxDepth(node.r);
    return [Math.min(minl, minr) + 1, Math.max(maxl, maxr) + 1];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

export {
    isBalanced,
    getRandomInt
};