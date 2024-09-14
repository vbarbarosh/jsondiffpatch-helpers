/**
 * Reverse a result of DIFF(a,b) so that PATCH(b, REVERSE(DIFF(a,b))) will
 * return the exactly same object as a.
 */
function reverse(diff)
{
    if (diff === undefined) {
        return undefined;
    }
    if (Array.isArray(diff)) {
        switch (diff.length) {
        case 1: // "555": [new]
            return [diff[1], 0, 0];
        case 2: // "555": [old,new]
            return [diff[1], diff[0]];
        case 3: // "555": [old,0,0]
            return [diff[0]];
        default:
            throw new Error(diff.length);
        }
    }
    if (diff._t === 'a') {
        return reverse_array(diff);
    }
    return reverse_object(diff);
}

function reverse_array(diff)
{
    const out = {_t: 'a'};
    const keys = Object.keys(diff);

    // (1) Remove
    // (2) Insert
    // (3) Modify

    keys.forEach(function (key) {
        if (key === '_t') {
            return;
        }
        if (key[0] !== '_') {
            // "555": [new]
            if (Array.isArray(diff[key]) && diff[key].length === 1) {
                out[`_${key}`] = [diff[key][0], 0, 0];
                return;
            }
            out[revi(parseInt(key))] = reverse(diff[key]);
            return;
        }
        switch (diff[key][2]) {
        case 0: // "_555": [old,0,0]
            out[key.substring(1)] = [diff[key][0]];
            break;
        case 3: // "_555": ["",x,3]
            out['_' + diff[key][1]] = ['', parseInt(key.substring(1)), 3];
            break;
        }
    });

    return out;

    function revi(i) {
        const remove = [];
        const insert = [];
        for (let j = 0; j < keys.length; ++j) {
            const key = keys[j];
            if (key === '_t') {
                continue;
            }
            if (key[0] === '_') {
                if (diff[key][1] === i) { // "_555": [old,x,3]
                    return parseInt(key.substring(1));
                }
                insert.push(parseInt(key.substring(1)));
                if (diff[key][2] === 3) { // "_555": [old,x,3]
                    remove.push(diff[key][1]);
                }
                continue;
            }
            if (Array.isArray(diff[key]) && (diff[key].length === 1)) { // "555": [new]
                remove.push(parseInt(key));
            }
        }
        i -= remove.reduce((a,v) => a + (v < i), 0);
        insert.sort((a,b) => a - b).forEach(v => i += (v <= i));
        return i;
    }
}

function reverse_object(diff)
{
    const out = {};
    Object.keys(diff).forEach(key => out[key] = reverse(diff[key]));
    return out;
}

module.exports = reverse;
