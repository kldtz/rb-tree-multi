import {strict as assert} from 'assert';
import RBTree from '../src/rb-tree.js';

test('insert, delete, insert', () => {
    const tree = new RBTree();
    tree.insert(2, 'b');
    tree.delete(2);
    tree.insert(1, 'a');

    assert.deepEqual(Array.from(tree.inorder()), [[1, 'a']]);
});


test('custom key comparator', () => {
    const tree = new RBTree({
        "keyComp": (a, b) => a < b ? 1 : a > b ? -1 : 0
    });

    tree.insert(2, 'b');
    tree.insert(1, 'a');
    tree.insert(3, 'c');

    assert.deepEqual(Array.from(tree.inorder(n => n.key)), [3, 2, 1]);
    assert.equal(tree.find(2, n => n.value), 'b');
});