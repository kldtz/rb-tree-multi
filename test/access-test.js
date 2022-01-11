import {strict as assert} from 'assert';
import RBTree from '../src/rb-tree.js';

test('key exists', () => {
    const tree = new RBTree();
    tree.insert(2);
    tree.insert(1);
    tree.insert(3);

    assert(tree.has(3));
});

test('key does not exist', () => {
    const tree = new RBTree();
    tree.insert(2);
    tree.insert(1);
    tree.insert(3);

    assert(!tree.has(4));
});

test('find value', () => {
    const tree = new RBTree();
    tree.insert(1, 'a');
    tree.insert(2, 'b');
    tree.insert(3, 'c');
    tree.insert(4, 'd');

    assert.deepEqual(tree.find(4), ['d']);
});

test('minimum', () => {
    const tree = new RBTree();
    tree.insert(1, 'a');
    tree.insert(2, 'b');
    tree.insert(3, 'c');
    tree.insert(4, 'd');

    assert.deepEqual(tree.minimum(n => n.key), 1);
});

test('maximum', () => {
    const tree = new RBTree();
    tree.insert(1, 'a');
    tree.insert(2, 'b');
    tree.insert(3, 'c');
    tree.insert(4, 'd');

    assert.deepEqual(tree.maximum(n => n.key), 4);
});