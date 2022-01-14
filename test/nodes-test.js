import {strict as assert} from 'assert';
import { defaultComp, RBNode, DuplicateStrategy } from '../src/rb-tree.js';

const add = DuplicateStrategy.add;

test('add values', () => {
    const node = new RBNode(1, 'a');
    add(node, 'b');
    add(node, 'c');
    
    assert.equal(node.length, 3);
});

test('add null values', () => {
    const node = new RBNode(1);
    add(node);
    add(node, null);

    assert.equal(node.length, 3);
});

test('remove values', () => {
    const node = new RBNode(1, 'a');
    add(node, 'b');
    add(node, 'c');

    node.removeValue('b');
    assert.deepEqual(node.value, ['a', 'c']);
    node.removeValue('c');
    assert.deepEqual(node.value, 'a');
});

test('remove values with custom eq function', () => {
    const node = new RBNode(1, 'a');
    add(node, 'b');
    add(node, 'c');

    node.removeValue('B', (a, b) => defaultComp(a.toLowerCase(), b.toLowerCase()));
    assert.deepEqual(node.value, ['a', 'c']);
});

test('array as value', () => {
    const node = new RBNode(1, []);
    assert.equal(node.length, 1);
    assert.deepEqual(node.values, [[]]);
});