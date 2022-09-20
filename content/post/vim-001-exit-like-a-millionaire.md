---
title: "Vim 001 - Exit like a millionaire"
date: 2022-09-20
tags: [vim]
authors:
- Nemanja
---

If you are here you most likely have a problem with exiting *Vim*?.
So let's fix that.

The way that all people of **Planet Earth** know:

{{< cmd >}}
:wq
{{</ cmd >}}

which stands for *write/save and quit*. This will do the just fine, and you will be outside of Vim.

Another way that will do the same thing but, it's a bit shorter: 

{{< cmd >}}
:x
{{</ cmd >}}

The fastest way that does exact same thing like previous two commands:

{{< cmd >}}
ZZ
{{</ cmd >}}

If you want to exit without saving the file you can do:

{{< cmd >}}
:q!
{{</ cmd >}}

but, better, faster way:

{{< cmd >}}
:ZQ
{{</ cmd >}}

Now you know how to exit Vim like a millionaire :).