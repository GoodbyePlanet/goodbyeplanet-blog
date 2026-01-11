---
title: "Vim 003 - Jump like a kangaroo - 0.2"
date: 2022-09-29
tags: [vim]
authors:
    - Nemanja
---

You want to jump like a *kangaroo*? Let's learn horizontal jumping :).

Having code example like bellow:

```js
document.getElementById('patterns-nav').scrollTop = parseInt(localStorage.getItem('scrollPoint'));
```

If my cursor is at the start of the line and I want to jump to the *=* sign I could do:

**f=** - to find *=* sign and jump to it

**t=** - to jump to one character before *=* sign 

- - -

If I wanted to jump to *localStorage* I would do it with this command:

**2f(** - to find second opening parentheses and jump to it, with that I'm just one character before *localStorage*

- - - 

To jump to the end of the line you can use

**$** - to jump to the end of the line

**A** - to jump to the end of the line and switch to INSERT mode

- - -

If your cursor is at the end of the line you can use

**0** - to jump to the start of the line

**&#8248;** - to jump backwards to the first non-blank character

**I** - to jump to the first non-blank character and to switch to INSERT mode 

**F=** - to jump backwards to the *=* sign

**2F.** - to jump backwards to find second dot just before *scrollTop*

- - -

These are commands that I am using all the time when I need to jump horizontally, and it works perfectly for me.