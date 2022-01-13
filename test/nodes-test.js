import {strict as assert} from 'assert';
import { defaultValComp, RBNode } from '../src/rb-tree.js';


test('add values', () => {
    const tree = new RBNode(1, 'a');
    tree.addValue('b');
    tree.addValue('c');
    
    assert.equal(tree.length, 3);
});

test('add null values', () => {
    const tree = new RBNode(1);
    tree.addValue();
    tree.addValue(null);

    assert.equal(tree.length, 3);
});

test('remove values', () => {
    const tree = new RBNode(1, 'a');
    tree.addValue('b');
    tree.addValue('c');

    tree.removeValue('b');
    assert.deepEqual(tree.value, ['a', 'c']);
    tree.removeValue('c');
    assert.deepEqual(tree.value, 'a');
});

test('remove values with custom eq function', () => {
    const tree = new RBNode(1, 'a');
    tree.addValue('b');
    tree.addValue('c');

    tree.removeValue('B', (a, b) => defaultValComp(a.toLowerCase(), b.toLowerCase()));
    assert.deepEqual(tree.value, ['a', 'c']);
});

test('array as value', () => {
    const tree = new RBNode(1, []);
    assert.equal(tree.length, 1);
    assert.deepEqual(tree.values, [[]]);
});