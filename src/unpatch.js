const assert = require('assert');

function unpatch(b, diff_ab)
{
    if (diff_ab === undefined) {
        return b;
    }

    if (Array.isArray(diff_ab)) {
        switch (diff_ab.length) {
        case 1: // [new]
            return undefined;
        case 2: // [old,new]
            assert.deepStrictEqual(b, diff_ab[1]);
            return diff_ab[0];
        case 3: // [new,0,0]
            if (diff_ab[2] !== 0) {
                throw new Error(`Invalid diff command: ${diff_ab[2]}, expected 0`);
            }
            return diff_ab[0];
        default:
            throw new Error(`Invalid diff length: ${diff_ab.length}`);
        }
    }

    if (diff_ab._t === 'a') {
        return unpatch_array(b, diff_ab);
    }
    return unpatch_object(b, diff_ab);
}

function unpatch_array(b, diff_ab)
{
    // 1. Undo modification first
    // 2. Then perform removal and insertion

    const keys = Object.keys(diff_ab);
    const remove = [];
    const insert = [];

    keys.forEach(function (key) {
        if (key === '_t') {
            return;
        }
        if (key[0] === '_') {
            // Schedule insert and remove
            switch (diff_ab[key][2]) {
            case 0: // "_555": [old,0,0]
                insert.push({i: parseInt(key.substring(1)), value: diff_ab[key][0]});
                break;
            case 3: // "_555": ['',x,3]
                insert.push({i: parseInt(key.substring(1)), value: b[diff_ab[key][1]]});
                remove.push(diff_ab[key][1]);
                break;
            }
            return;
        }
        if (Array.isArray(diff_ab[key]) && (diff_ab[key].length === 1)) { // [new]
            assert.deepStrictEqual(b[key], diff_ab[key][0]);
            remove.push(parseInt(key));
        }
        else {
            b[key] = unpatch(b[key], diff_ab[key]);
        }
    })

    // Remove in reverse order
    remove.sort((b,a) => a-b).forEach(i => b.splice(i, 1));

    // Insert in direct order
    insert.sort((a,b) => a.i-b.i).forEach(v => b.splice(v.i, 0, v.value));

    return b;
}

function unpatch_object(b, diff_ab)
{
    Object.keys(diff_ab).forEach(function (key) {
        if (Array.isArray(diff_ab[key]) && (diff_ab[key].length === 1)) { // [new]
            delete b[key];
        }
        else {
            b[key] = unpatch(b[key], diff_ab[key]);
        }
    });
    return b;
}

module.exports = unpatch;
