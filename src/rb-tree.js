/**
 * Red-black tree following Cormen et al. (2009).
 */
class RBBaseNode {
    constructor(key, value, red, p, left, right) {
        this.key = key;
        this.value = value;
        this.red = red;
        this.p = p;
        this.l = left;
        this.r = right;
    }
}

class RBNil extends RBBaseNode {
    constructor() {
        super(null, null, false, null, null, null);
    }
}

const NIL = new RBNil();

class RBNode extends RBBaseNode {
    constructor(key, value = null, red = true, p = NIL, left = NIL, right = NIL) {
        super(key, value, red, p, left, right);
        this.multi = false;
    }

    get length() {
        if (this.multi) {
            return this.value.length;
        }
        return 1;
    }

    get values() {
        if (!this.multi) {
            return [this.value];
        }
        return this.value;
    }

    /**
     * Adds value to node. Turns node into multi node, if it isn't already.
     * @param {*} value 
     */
    addValue(value) {
        if (!this.multi) {
            this.value = [this.value];
            this.multi = true;
        }
        this.value.push(value);
    }

    /**
     * Removes last matching value. Assumes that there are multiple values! 
     * If there is only one value, the entire node has to be deleted.
     * @param {*} value 
     */
    removeValue(value, comp = defaultComp) {
        for (let i = this.value.length - 1; i >= 0; i--) {
            if (comp(this.value[i], value) === 0) {
                this.value.splice(i, 1);
                if (this.length < 2) {
                    this.value = this.value[0];
                    this.multi = false;
                }
                return true;
            }
        }
        return false;
    }
}

const getKeyValue = (node, value) => [node.key, value];
const defaultComp = (a, b) => a < b ? -1 : a > b ? 1 : 0;

class RBTree {
    constructor(keyComp = defaultComp, valueComp = defaultComp) {
        this.root = NIL;
        this.length = 0;
        this.keyComp = keyComp;
        this.valueComp = valueComp;
    }

    /**
     * Convenience method to insert several key-value pairs. Only accepts array
     * of two-element arrays (key-value pairs).
     * @param {*} keyValuePairs 
     */
    insertAll(keyValuePairs) {
        for (const [key, value] of keyValuePairs) {
            this.insert(key, value);
        }
    }

    /**
     * Inserts key into tree.
     * @param {*} key 
     */
    insert(key, value) {
        this.length++;
        var y = NIL;
        var x = this.root;
        while (x !== NIL) {
            y = x;
            switch(this.keyComp(key, y.key)) {
                case -1:
                    x = x.l;
                    break;
                case 0:
                    x.addValue(value);
                    return;
                default:
                    x = x.r;
                    break;
            }
        }
        const z = new RBNode(key, value);
        z.p = y;
        if (y === NIL) {
            this.root = z;
        } else {
            if (this.keyComp(key, y.key) == -1) {
                y.l = z;
            } else {
                y.r = z;
            }
        }
        z.l = NIL;
        z.r = NIL;
        z.red = true;
        this.#fixupInsert(z);
    }

    #fixupInsert(z) {
        // while there is a red node with a red child
        while (z.p.red) {
            // if the parent of z is a left child
            if (z.p === z.p.p.l) {
                // set y as the parent's right sibling
                const y = z.p.p.r;
                // case 1a: both the parent and its sibling are red
                if (y.red) {
                    // color parent and sibling black
                    z.p.red = false;
                    y.red = false;
                    // color grandparent red
                    z.p.p.red = true;
                    // continue with grandparent as z
                    z = z.p.p;
                }
                // sibling of the parent is black
                else {
                    // case 2a: z is a right child
                    if (z === z.p.r) {
                        z = z.p;
                        this.#leftRotate(z);
                    }
                    // case 3a: z and its parent are left children
                    z.p.red = false;
                    z.p.p.red = true;
                    this.#rightRotate(z.p.p);
                }
            } else {
                // y is the parent's left sibling
                const y = z.p.p.l;
                // case 1b: both the parent and its sibling are red
                if (y.red) {
                    // color parent and sibling black
                    z.p.red = false;
                    y.red = false;
                    // color grandparent red
                    z.p.p.red = true;
                    // continue with grandparent as z
                    z = z.p.p;
                }
                else {
                    // case 2b: z is a left child
                    if (z === z.p.l) {
                        z = z.p;
                        this.#rightRotate(z);
                    }
                    // case 3b: z and its parent are right children
                    z.p.red = false;
                    z.p.p.red = true;
                    this.#leftRotate(z.p.p);
                }
            }
        }
        this.root.red = false;
    }

    /**
     * In-order key-value generator.
     * @param {RBNode} node
     */
    * inorder(extractor = getKeyValue, node = this.root) {
        const stack = [];
        while (stack.length != 0 || node !== NIL) {
            if (node !== NIL) {
                stack.push(node);
                node = node.l;
            } else {
                node = stack.pop();
                for (let v of node.values) {
                    yield extractor(node, v);
                }
                node = node.r;
            }
        }
    }

    /**
     * Pre-order key-value generator.
     * @param {RBNode} node 
     */
    * preorder(extractor = getKeyValue, node = this.root) {
        if (node === NIL) {
            return;
        }
        const stack = [node];
        while (stack.length !== 0) {
            node = stack.pop();
            for (let v of node.values) {
                yield extractor(node, v);
            }
            if (node.r !== NIL) {
                stack.push(node.r);
            }
            if (node.l !== NIL) {
                stack.push(node.l);
            }
        }
    }

    /**
     * Post-order key-value generator.
     * @param {RBNode} node 
     */
    * postorder(extractor = getKeyValue, node = this.root) {
        const stack = [];
        let prevNode = NIL;
        while (stack.length !== 0 || node !== NIL) {
            if (node !== NIL) {
                stack.push(node);
                node = node.l;
            } else {
                const peekNode = stack[stack.length - 1];
                if (peekNode.r !== NIL && prevNode !== peekNode.r) {
                    node = peekNode.r;
                } else {
                    for (let v of peekNode.values) {
                        yield extractor(peekNode, v);
                    }
                    prevNode = stack.pop();
                }
            }
        }
    }

    /**
     * Level-order key-value generator.
     * @param {RBNode} node 
     */
    * levelorder(extractor = getKeyValue, node = this.root) {
        if (node == NIL) {
            return;
        }
        const queue = [node];
        while (queue.length !== 0) {
            node = queue.shift();
            for (let v of node.values) {
                yield extractor(node, v);
            }
            if (node.l !== NIL) {
                queue.push(node.l);
            }
            if (node.r !== NIL) {
                queue.push(node.r);
            }
        }
    }

    /**
     * Returns key and value(s) associated with given key or null, if key 
     * doesn't exist.
     * @param {*} key 
     */
    find(key, extractor = node => node.values, node = this.root) {
        while (node !== NIL) {
            switch(this.keyComp(key, node.key)) {
                case -1:
                    node = node.l;
                    break;
                case 0:
                    return extractor(node);
                default:
                    node = node.r;
                    break;
            }
        }
        return undefined;
    }

    /**
     * Returns true if key exists in tree, false otherwise.
     * @param {*} key 
     * @returns {boolean}
     */
    has(key, node = this.root) {
        return this.find(key, n => n, node) !== undefined;
    }

    /**
     * Deletes key from tree if present. Returns true if key (and value) was present, 
     * false otherwise.
     * @param {*} key 
     * @returns {boolean}
     */
    delete(key, value) {
        const z = this.find(key, n => n);
        if (z === undefined) {
            return false;
        }
        if (z.multi) {
            const removed = z.removeValue(value, this.valueComp);
            if (removed) {
                this.length--;
            }
            return removed;
        }
        this.#deleteNode(z);
        this.length--;
        return true;
    }

    /**
     * Removes and returns all values associated with given key.
     * @param {*} key 
     * @param {*} extractor 
     */
    removeKey(key, extractor = node => node.values) {
        const z = this.find(key, n => n);
        if (z === undefined) {
            return undefined;
        }
        this.#deleteNode(z);
        this.length -= z.values.length;
        return extractor(z);
    }

    #deleteNode(z) {
        // maintain y as element to be moved or removed
        let y = z;
        let yOriginalRed = y.red;
        // x will be the start node for the fixup routine
        let x = NIL;
        // if left child of z is empty
        if (z.l === NIL) {
            // put right child in position of z
            x = z.r;
            this.#transplant(z, z.r);
        }
        // if right child is empty
        else if (z.r == NIL) {
            // put left child in position of z
            x = z.l;
            this.#transplant(z, z.l)
        } else {
            // find smallest element greater than z
            y = this.minimum(n => n, z.r);
            yOriginalRed = y.red;
            x = y.r;
            // if y is the right child of z
            if (y.p === z) {
                x.p = y;
            } else {
                this.#transplant(y, y.r);
                y.r = z.r;
                y.r.p = y;
            }
            // take left child from z and make it left child of y
            this.#transplant(z, y);
            y.l = z.l;
            y.l.p = y;
            y.red = z.red;
        }
        if (!yOriginalRed) {
            this.#fixupDelete(x);
        }
    }

    #fixupDelete(x) {
        let w = NIL;
        while (x !== this.root && !x.red) {
            // if x is a left child
            if (x === x.p.l) {
                w = x.p.r;
                // case 1a: x's sibling is red
                if (w.red) {
                    w.red = false;
                    x.p.red = true;
                    this.#leftRotate(x.p);
                    w = x.p.r;
                }
                // case 2a: x's sibling w and both of w's children are black
                if (!w.l.red && !w.r.red) {
                    w.red = true;
                    x = x.p;
                } else {
                    // case 3a: x's sibling w is black, w's left child is red, w's right child is black
                    if (!w.r.red) {
                        w.l.red = false;
                        w.red = true;
                        this.#rightRotate(w);
                        w = x.p.r;
                    }
                    // case 4a: x's sibling w is black, w's right child is red
                    w.red = x.p.red;
                    x.p.red = false;
                    w.r.red = false;
                    this.#leftRotate(x.p);
                    x = this.root;
                }
            }
            // if x is a right child
            else {
                w = x.p.l;
                // case 1b: x's sibling is red
                if (w.red) {
                    w.red = false;
                    x.p.red = true;
                    this.#rightRotate(x.p);
                    w = x.p.l;
                }
                // case 2b: x's sibling w and both of w's children are black
                if (!w.r.red && !w.l.red) {
                    w.red = true;
                    x = x.p;
                } else {
                    if (!w.l.red) {
                        w.r.red = false;
                        w.red = true;
                        this.#leftRotate(w);
                        w = x.p.l;
                    }
                    w.red = x.p.red;
                    x.p.red = false;
                    w.l.red = false;
                    this.#rightRotate(x.p);
                    x = this.root;
                }
            }
        }
        x.red = false;
    }

    // Get minimal element from tree.
    minimum(extractor = node => [node.key, node.values], x = this.root) {
        while (x.l !== NIL) {
            x = x.l;
        }
        return extractor(x);
    }

    // Get maximal element from tree.
    maximum(extractor = node => [node.key, node.values], x = this.root) {
        while (x.r !== NIL) {
            x = x.r;
        }
        return extractor(x);
    }

    // Puts v in place of u.
    #transplant(u, v) {
        if (u.p === NIL) {
            this.root = v;
        } else if (u === u.p.l) {
            u.p.l = v;
        } else {
            u.p.r = v;
        }
        v.p = u.p;
    }

    /*
         x                y
        / \              / \
       a   y     =>     x   c
          / \          / \
         b   c        a   b 
    */
    #leftRotate(x) {
        const y = x.r;
        x.r = y.l;
        if (y.l !== NIL) {
            y.l.p = x;
        }
        y.p = x.p;
        if (x.p === NIL) {
            this.root = y;
        } else if (x === x.p.l) {
            x.p.l = y;
        } else {
            x.p.r = y;
        }
        y.l = x;
        x.p = y;
    }

    /*
         x                y
        / \              / \
       a   y     <=     x   c
          / \          / \
         b   c        a   b 
    */
    #rightRotate(y) {
        const x = y.l;
        y.l = x.r;
        if (x.r !== NIL) {
            x.r.p = y;
        }
        x.p = y.p;
        if (y.p === NIL) {
            this.root = x;
        } else if (y === y.p.r) {
            y.p.r = x;
        } else {
            y.p.l = x;
        }
        x.r = y;
        y.p = x;
    }
}

export { RBTree as default, NIL, RBNode, defaultComp };