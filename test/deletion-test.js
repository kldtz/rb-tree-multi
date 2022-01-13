import { strict as assert } from 'assert';
import RBTree, { defaultComp } from '../src/rb-tree.js';
import { isBalanced, getRandomInt } from './utils.js';

test('simple deletion', () => {
    const tree = new RBTree();
    tree.insert(2);
    tree.insert(1);
    tree.insert(3);
    assert.equal(tree.length, 3);

    tree.delete(3);
    assert.equal(tree.length, 2);
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        [2, 1]);
});

test('deletion of unknown element => null', () => {
    const tree = new RBTree();
    tree.insert(2);
    tree.insert(1);
    tree.insert(3);
    assert.equal(tree.length, 3);

    const deleted = tree.delete(4);
    assert(!deleted);
    assert.equal(tree.length, 3);
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        [2, 1, 3]);
});

test('delete all elements', () => {
    const tree = new RBTree();
    tree.insert(1);
    tree.delete(1);

    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        []);
});

test('deletion case 1a, 2a', () => {
    const tree = new RBTree();
    tree.insert(1);
    tree.insert(2);
    tree.insert(3);
    tree.insert(4);
    tree.insert(5);
    tree.insert(6);

    tree.delete(1);
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        [4, 2, 5, 3, 6])
});

test('deletion case 3a, 4a', () => {
    const tree = new RBTree();
    tree.insert(4);
    tree.insert(1);
    tree.insert(2);
    tree.insert(3);

    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        [2, 1, 4, 3]);
    tree.delete(1);
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        [3, 2, 4]);
});

test('delete two keys: 3a, 4a, 2b', () => {
    const tree = new RBTree();
    tree.insert(4);
    tree.insert(1);
    tree.insert(2);
    tree.insert(3);

    tree.delete(1);
    tree.delete(3);
    assert.deepEqual(
        Array.from(tree.levelorder(n => n.key)),
        [4, 2]);
});

test('custom value comparator function', () => {
    const tree = new RBTree(
        defaultComp,
        (a, b) => defaultComp(a.toLowerCase(), b.toLowerCase())
    );

    tree.insert(1, 'A');
    tree.insert(1, 'B');
    tree.insert(1, 'C');

    tree.delete(1, 'b');
    assert.deepEqual(Array.from(tree.levelorder((n, v) => v)), ['A', 'C']);
});

test('random deletions', () => {
    const tree = new RBTree();
    const numInsertions = getRandomInt(10, 50);
    const expected = [];
    for (let i = 0; i < numInsertions; i++) {
        const value = getRandomInt(1, 50);
        tree.insert(value);
        expected.push(value);
    }
    expected.sort((a, b) => a - b);
    assert.deepEqual(
        Array.from(tree.inorder(n => n.key)),
        expected);

    const numDeletions = getRandomInt(1, numInsertions);
    for (let i = 0; i < numDeletions; i++) {
        const delIdx = getRandomInt(0, expected.length - 1);
        const delKey = expected[delIdx];
        tree.delete(delKey);
        expected.splice(delIdx, 1);
    }
    assert.deepEqual(
        Array.from(tree.inorder(n => n.key)),
        expected);
    assert(isBalanced(tree.root));
});


test('remove key', () => {
    const tree = new RBTree();

    tree.insert(1, 'a');
    tree.insert(1, 'b');
    tree.insert(2, 'c');

    assert.equal(tree.length, 3);
    tree.removeKey(1);
    assert.equal(tree.length, 1);
});