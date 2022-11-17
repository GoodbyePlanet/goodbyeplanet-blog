---
title: "React - performance tip"
date: 2022-11-17
tags: [react, javascript]
authors:
- Nemanja
---

Have you ever done something like this in your ReactJS code?
```js
function ComponentA() {

  function ComponentB() {
    return <div>Hello from Child component</div>
  }

  return (
    <div>
        <p>Hello from component A</p>
        <ComponentB />
    </div>
  )
}
```

If Yes, then please dont' do it anymore, and here is why.

React has it's rendering algorithm for finding what changed in DOM structure in order to paint only changed parts of the UI.
This algorithm will compare `HTML` elements by their types and it will
use reference comparison. If it finds that some types have changed e.g. `<p>` changed to `<div>` then
in order to speed up process of finding new changes in your DOM structure it will assume that complete
component tree has changed. This will result in destroying component tree section and then it will
recreate those destroyed components making a new instances for them.

In above code example, whenever `ComponentA` is rendered it will also create a new component reference for
`ComponentB` which will lead to destroying and recreating child component tree.

Instead, what you should do is the following:

```js
function ComponentB() {
  return <div>Hello from Child component</div>
}

function ComponentA() {
  return (
    <div>
        <p>Hello from component A</p>
        <ComponentB />
    </div>
  )
}
```