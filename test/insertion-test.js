import {strict as assert} from 'assert';
import RBTree from '../src/rb-tree.js';
import { isBalanced, getRandomInt } from './utils.js';

test('create single-element tree', () => {
    const tree = new RBTree();
    assert.equal(tree.length, 0);
    tree.insert(4);
    assert.equal(tree.length, 1);
    assert.equal(tree.root.key, 4);
});


test('insertion case 1a, right', () => {
    const tree = new RBTree();
    tree.insert(3);
    tree.insert(1);
    tree.insert(4);
    tree.insert(2);
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        [3, 1, 4, 2]);
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.red)),
        [false, false, false, true]);
});

test('insertion case 1a, left', () => {
    const tree = new RBTree();
    tree.insert(3);
    tree.insert(2);
    tree.insert(4);
    tree.insert(1);
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        [3, 2, 4, 1]
    );
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.red)),
        [false, false, false, true]
    );
});

test('insertion case 1b', () => {
    const tree = new RBTree();
    tree.insert(2);
    tree.insert(1);
    tree.insert(3);
    tree.insert(4);
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        [2, 1, 3, 4]
    );
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.red)),
        [false, false, false, true]
    );
});

test('insertion case 3a', () => {
    const tree = new RBTree();
    tree.insert(3);
    tree.insert(2);
    tree.insert(1);
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        [2, 1, 3]
    );
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.red)),
        [false, true, true]
    );
});

test('insertion case 3b', () => {
    const tree = new RBTree();
    tree.insert(1);
    tree.insert(2);
    tree.insert(3);
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        [2, 1, 3]
    );
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.red)),
        [false, true, true]
    );
});

test('insertion case 2 => 3', () => {
    const tree = new RBTree();
    tree.insert(3);
    tree.insert(1);
    tree.insert(2);
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        [2, 1, 3]
    );
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.red)),
        [false, true, true]
    );
});

test('insertion case 2b => 3b', () => {
    const tree = new RBTree();
    tree.insert(1);
    tree.insert(3);
    tree.insert(2);
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        [2, 1, 3]
    );
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.red)),
        [false, true, true]
    );
});


test('random insertions', () => {
    const tree = new RBTree();
    const numInsertions = getRandomInt(20, 50);
    const expected = [];
    for (let i = 0; i < numInsertions; i++) {
        const value = getRandomInt(1, 50);
        tree.insert(value);
        expected.push(value);
    }
    expected.sort((a, b) => a - b);

    assert(isBalanced(tree.root));
    assert.deepEqual(
        Array.from(tree.inorder(n => n.key)),
        expected);
});