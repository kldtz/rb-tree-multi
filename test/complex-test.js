import {strict as assert} from 'assert';
import RBTree from '../src/rb-tree.js';

test('insert, delete, insert', () => {
    const tree = new RBTree();
    tree.insert(2, 'b');
    tree.delete(2);
    tree.insert(1, 'a');

    assert.deepEqual(Array.from(tree.inorder()), [[1, 'a']]);
});