import {strict as assert} from 'assert';
import RBTree from '../src/rb-tree.js';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function generateKeys(numKeys) {
    const keys = [];
    for (let i = 0; i < numKeys; i++) {
        keys.push(getRandomInt(1, numKeys));
    }
    return keys;
}

for (let numKeys of [3000, 30000, 300000, 3000000]) {
    // create tree with specified number of keys
    const tree = new RBTree();
    const keys = generateKeys(numKeys)
    for (let key of keys) {
        tree.insert(key, key);
    }
    const numCycles = 100000;
    const extraKeys = generateKeys(100000)
    // time number of cycles
    const start = performance.now();
    for (let key of extraKeys) {
        tree.insert(key, key);
        tree.delete(key, key);
    }
    const end = performance.now();
    const elapsed = (end - start).toFixed(2);
    console.log(`Elapsed time for ${numCycles} insert/delete cycles in a tree of size ${numKeys}: ${elapsed}ms`);
    // assert correctness
    assert.equal(tree.length, keys.length);
    assert.deepEqual(Array.from(tree.inorder((n, v) => v)), keys.sort((a, b) => a - b));
}