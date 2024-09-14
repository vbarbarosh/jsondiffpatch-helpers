const assert = require('assert');
const basic_test = require('./basic-test.json');
const issue295_test = require('./issue295-tests.json');
const jsondiffpatch = require('jsondiffpatch');
const jsondiffpatch_tests = require('./jsondiffpatch-tests.json');
const unpatch = require('../src/unpatch');

const items = [...basic_test, ...issue295_test];

const inst = jsondiffpatch.create({
    objectHash: function (item, i) {
        return item.uid || item.id || `$$index:${i}`;
    },
});

describe('unpatch', function () {
    jsondiffpatch_tests.atomicValues.forEach(function (item) {
        it('jsondiffpatch • atomicValues • ' + JSON.stringify(item), function () {
            const a = item.left;
            const b = item.right;
            const diff_ab = inst.diff(a, b);
            const diff_ba = inst.diff(b, a);
            assert.deepStrictEqual(inst.patch(dup(a), diff_ab), b);
            assert.deepStrictEqual(inst.patch(dup(b), diff_ba), a);
            assert.deepStrictEqual(unpatch(dup(a), diff_ba), b);
            assert.deepStrictEqual(unpatch(dup(b), diff_ab), a);
        });
    });
/*
    jsondiffpatch_tests.text.forEach(function (item) {
        xit('jsondiffpatch • text • ' + JSON.stringify(item), function () {
            const a = item.left;
            const b = item.right;
            const diff_ab = inst.diff(a, b);
            const diff_ba = inst.diff(b, a);
            assert.deepStrictEqual(inst.patch(dup(a), diff_ab), b);
            assert.deepStrictEqual(inst.patch(dup(b), diff_ba), a);
            assert.deepStrictEqual(unpatch(dup(a), diff_ba), b);
            assert.deepStrictEqual(unpatch(dup(b), diff_ab), a);
        });
    });
*/
    jsondiffpatch_tests.arrays.forEach(function (item) {
        it('jsondiffpatch • arrays • ' + item.name, function () {
            const a = item.left;
            const b = item.right;
            const diff_ab = inst.diff(a, b);
            const diff_ba = inst.diff(b, a);
            assert.deepStrictEqual(inst.patch(dup(a), diff_ab), b);
            assert.deepStrictEqual(inst.patch(dup(b), diff_ba), a);
            assert.deepStrictEqual(unpatch(dup(a), diff_ba), b);
            assert.deepStrictEqual(unpatch(dup(b), diff_ab), a);
        });
    });
    jsondiffpatch_tests.objects.forEach(function (item) {
        it('jsondiffpatch • objects • ' + item.name, function () {
            const a = item.left;
            const b = item.right;
            const diff_ab = inst.diff(a, b);
            const diff_ba = inst.diff(b, a);
            assert.deepStrictEqual(inst.patch(dup(a), diff_ab), b);
            assert.deepStrictEqual(inst.patch(dup(b), diff_ba), a);
            assert.deepStrictEqual(unpatch(dup(a), diff_ba), b);
            assert.deepStrictEqual(unpatch(dup(b), diff_ab), a);
        });
    });
    items.forEach(function (item) {
        it(item.label, function () {
            const {a, b} = item;
            const diff_ab = inst.diff(a, b);
            const diff_ba = inst.diff(b, a);
            assert.deepStrictEqual(inst.patch(dup(a), diff_ab), b);
            assert.deepStrictEqual(inst.patch(dup(b), diff_ba), a);
            assert.deepStrictEqual(unpatch(dup(a), diff_ba), b);
            assert.deepStrictEqual(unpatch(dup(b), diff_ab), a);
        });
    });
});

function dup(v)
{
    if (v === undefined) {
        return undefined;
    }
    return JSON.parse(JSON.stringify(v));
}
