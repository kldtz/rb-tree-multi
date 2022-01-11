import {strict as assert} from 'assert';
import RBTree from '../src/rb-tree.js';

test('inorder iteration whole tree', () => {
    const tree = new RBTree();
    const keyValuePairs = [[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']];
    tree.insertAll(keyValuePairs)

    assert.deepEqual(Array.from(tree.inorder()), keyValuePairs);
});

test('inorder iteration subtree', () => {
    const tree = new RBTree();
    const keyValuePairs = [[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']];
    tree.insertAll(keyValuePairs)

    const actual =  Array.from(tree.inorder(
        (n) => [n.key, n.value],
        tree.find(3, n=>n)));
    assert.deepEqual(actual, [[3, 'c'], [4, 'd']]);
});

test('preorder iteration whole tree', () => {
    const tree = new RBTree();
    const keyValuePairs = [[2, 'b'], [1, 'a'], [3, 'c'], [4, 'd']];
    tree.insertAll(keyValuePairs)

    assert.deepEqual(Array.from(tree.preorder()), keyValuePairs);
});

test('preorder iteration whole tree', () => {
    const tree = new RBTree();
    const keyValuePairs = [[2, 'b'], [1, 'a'], [3, 'c'], [4, 'd']];
    tree.insertAll(keyValuePairs)

    assert.deepEqual(Array.from(tree.postorder()), [[1, 'a'], [4, 'd'], [3, 'c'], [2, 'b']]);
});

test('levelorder iteration whole tree', () => {
    const tree = new RBTree();
    const keyValuePairs = [[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']];
    tree.insertAll(keyValuePairs)

    assert.deepEqual(Array.from(tree.levelorder()), [[2, 'b'], [1, 'a'], [3, 'c'], [4, 'd']]);
});
