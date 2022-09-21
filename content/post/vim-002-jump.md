---
title: "Vim 002 - Jump like a kangaroo .1"
date: 2022-09-20
tags: [vim]
authors:
    - Nemanja
---

You want to jump like a *kangaroo*? So, let's start with vertical jumping :).

First, do this in your Vim:

{{< cmd >}}
:set number relativenumber
{{</ cmd >}}

Then let's say we have something like this:
![Vim](/images/vim.png)

My cursor is at line 42. And I want to jump on top of the function, and then I want to jump
all the way down in *else* block but I want to jump to end of the line.

I will do:

**9K** - to jump 9 lines up

**15$** - to jump 15 lines down and to the end of the line

Now let's say I want to jump up to the *window.addEventListener* line and then I want to jump down
to the second *if* statement but to the first non blank character.

I will do:

**5k** - to jump 5 lines up

**3+** - to jump 3 lines down but to the first non blank character on that line


