---
title: "Clean your node_modules"
date: 2023-03-15
tags: [script, javascript]
authors:
    - Nemanja
---

*node_modules* can be huge, I'm pretty sure you experienced that.
If you have a lot of JavaScript projects on your machine that are just
sitting there and you are not working them anymore, there is a neat way
to clean *node_modules* so they don't take up your disk space.

{{< cmd >}}
npx npkill
{{</ cmd >}}

Is all that you need. :)
You can also take a look at their [Homepage](https://github.com/voidcosmos/npkill#readme).
