---
title: "Vim 002 - Jump like a kangaroo - 0.1"
date: 2022-09-20
tags: [vim]
authors:
    - Nemanja
---

You want to jump like a *kangaroo*? So, let's start with vertical jumping :).

First, open [Vim.js](https://wang-lu.com/vim.js/emterpreter/vim.html) and do this:

{{< cmd >}}
:set relativenumber
{{</ cmd >}}

Then let's say we have something like this:
![Vim](/images/vim.png)

My cursor is at line 1. And I want to jump all the way down to the *var LibraryVIM*. Copy *LibraryVIM*, then I want to go up
above the line where *vim_lib.js* is and paste what I've copied. 

I will do:

**29j** - to jump 29 lines down

**w yiw** - *w* to go the next word and *yiw* to copy that word

**28k** - to jump 27 lines up

**p** - to paste

- - -

Now let's say I want to jump up to the *Copyright* line, but to the end of the line and add dot at the end.

I will do:

**4$** - to jump 3 lines down including current line and to the end of the line

**a.** - to append dot at the end

- - -

Now I want to jump to the line where *var LibraryVIM* is, find *var* and change it to *const*.

I will do:

**25j 0** - to jump 25 lines down and *0* to jump to the start of the line

**ciw const** - to change *var* to *const*

- - -

**Now you are jumping like a **kangaroo** :)**

Thanks to [Lu Wang](https://github.com/coolwanglu) for creating **vim.js**.