# Red-Black Tree

A red-black tree implemented in JavaScript based on Cormen et al. (2009) with the following features:

* Typical red-black tree guarantees for lookup, insertion, and deletion<a href="#fn-deletion" id="fn-deletion-text"><sup>1</sup></a> in O(log N) worst-case time for N keys,
* Built-in handling of duplicate keys,
* Stress-tested with large number of random insertions and deletions,
* Comprehensive set of unit tests, so hopefully bug-free (if you find a bug, please open an issue),
* No dependencies

## Usage

### Browser

Enable ES modules when referencing the script.

```html
<script type="module" src="rb-tree.js"></script>
```

### Node

Install the package via `npm`.

```bash
npm install rb-tree-multi
```

Import `RBTree` and use it.

```javascript
import RBTree from "rb-tree-multi";

const tree = new RBTree()

tree.insert('c', 3)
tree.insert('a', 1)
tree.insert('a', 0)
tree.insert('b', 2)

for (let [key, value] of tree.inorder()) {
    console.log(key, value)
}
// a 1
// a 0
// b 2
// c 3
```


## Interface

* `new RBTree(keyComp = defaultComp, valueComp = defaultComp)`: creates a new red-black tree.
```javascript
import RBTree, { defaultComp } from '../src/rb-tree.js';

// Default constructor
const tree = new RBTree()
// Constructor with default key comparator and custom comparator for case-insensitive string values
const tree = new RBTree(defaultComp, (a, b) => defaultComp(a.toLowerCase(), b.toLowerCase()))
```

Keys and values can be arbitrary objects. By default they are compared with the following function:

```javascript
const defaultComp = (a, b) => a < b ? -1 : a > b ? 1 : 0
```

If the default comparator function doesn't work for you, pass your own.


### Methods


* `delete(key, value)`: deletes specified key-value pair. Value defaults to `null` if omitted. Returns true if deletion was successful, false otherwise. If you supplied a custom value comparator function to the constructor, it will be used to determine which value to delete.
    ```javascript
    tree.delete(2, 'b')
    // Delete key 1 with value null, counterpart to tree.insert(1)
    tree.delete(1)
    ```
* `find(key, extractor = node => node.value, node = this.root)`: returns array of associated value(s) or `undefined` if the key does not exist. Optionally, you can define a custom extractor function that operatores on the node.
    ```javascript
    tree.find(2)
    // Find with custom extractor that returns single value or array of values (possibly ambiguous if you inserted `undefined` values)
    tree.find(1, n => n.value)
    // Find with custom extractor that returns node itself
    tree.find(1, n => n)
    ```
* `has(key, node = this.root)`: returns `true` if key is present in tree, `false` otherwise.
* `insert(key, value)`: inserts a key-value pair. Value defaults to `null` if omitted. Insertion order is determined solely by the key, values associated with the same key have no guaranteed order.
    ```javascript
    // Insert a key with implicit null value twice
    tree.insert(1)
    tree.insert(1)
    // Insert key-value pairs
    tree.insert(2, 'b')
    // Insert duplicate keys with same or different values
    tree.insert(2, 'b')
    tree.insert(2, 'x')
    ```
* `maximum(extractor = node => [node.key, node.values], node = this.root)`: returns maximal key contained in tree and array of its associated value(s). Optionally, you can specify an extractor function that operates on the node, see `find`.
* `minimum(extractor = node => [node.key, node.values], node = this.root)`: returns minimal key contained in tree and array of its associated value(s). Optionally, you can specify an extractor function that operates on the node, see `find`.
    ```javascript
    let [minKey, minValues] = tree.minimum()
    ```
* `removeKey(key, extractor = node => node.values)`: removes key and all values associated with it. Returns removed values or `undefined` if key does not exist. Optionally, you can specify an extractor function that operates on the node, see `find`.
    ```javascript
    let values = tree.remove(2)
    ```

### Iterators

* `inorder(extractor = (node, value) => [node.key, value], node = this.root)`: In-order traversal of key-value pairs. Takes an optional extractor that is passed a node and the current value.
    ```javascript
    // Basic use
    for (let [key, value] of tree.inorder()) {
        console.log(key, value)
    }

    // Use with custom extractor that returns only values
    for (let value of tree.inorder((n, v) => v)) {
        console.log(value)
    }
    ```
* `postorder(extractor = (node, value) => [node.key, value], node = this.root)`: Prost-order traversal of key-value pairs. Takes an optional extractor that is passed a node and the current value.
* `preorder(extractor = (node, value) => [node.key, value], node = this.root)`: Pre-order traversal of key-value pairs. Takes an optional extractor that is passed a node and the current value.

### Nodes

In all basic use cases, nodes remain an implementation detail hidden from you. However, if you write custom extractors, you can access them directly, e.g. to use them as starting point for lookups and iterations, or to access their properties:

* `key`: key according to which nodes are ordered
* `value`: one or multiple values associated with the key
* `red`: color of the node
* `p`: parent pointer
* `l`: left child pointer
* `r`: right child pointer
* `multi`: indicates whether this node has multiple values

Have a look at the tests for examples.

---

<a id="fn-deletion" href="#fn-deletion-text"><sup>1</sup></a> For fast insertions, duplicates are simply appended to the same node. That means, the key-value deletion finds the node with the specified key in O(log N) time and then performs a linear scan over all the duplicates associated with this key. So if you have a lot of duplicates and perform a lot of deletions, this linear component might dominate the deletion time.

---

Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). Introduction to algorithms. MIT press.