---
title: "Deep clone with structured clone"
date: 2023-01-23
tags: [javascript]
authors:
    - Nemanja
---

If you are Javascript developer you probably had a chance to do deep cloning.
If you were doing it before April 2022 you most likely had to do workarounds or use
libraries to get the job done for you.

For those who don't understand what is *deep clone* let's first understand *shallow clone*.
If you have an object which has nested object in itself, shallow copy
would mean that any change you make to values of nested object will be visible in copy as well as in original object.

One of the ways to do shallow copy is
using [Spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax).

Now, deep copy of an object means that even if you have nested object, properties of that object should be copied as well so that
when you are changing values of the nested object changes are not reflected to the original object.

The most common solution to deep cloning is to use Lodash *_.cloneDeep(object)* or to use *JSON.parse*:

```js
const copiedObject = JSON.parse(JSON.stringify(originalObject));
```

but using *JSON.parse* has major flaw, it will fail to deep copy an object if it has *Map*, *Set*, *Date*
or *ArrayBuffer*, and also it will discard functions.

### Structured cloning

Since of April 2022, Javascript has its own built-in function *structuredClone* which creates a deep
clone of a given object. And using it is pretty simple:

```js
structuredClone(value)
```

And that's pretty much it, if you need more info go [here](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone).