A set of basic functions for working with delta format described in
[jsondiffpatch • Delta Format](https://github.com/benjamine/jsondiffpatch/blob/master/docs/deltas.md).

## Installation

```shell
npm i @vbarbarosh/jsondiffpatch-helpers
```

## Usage

```javascript
reverse(diff_ab) // will return a diff to produce a from b
unpatch(b, diff_ab) // will return object identical to a
```
