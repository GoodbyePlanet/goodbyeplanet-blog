---
title: "Update your dependencies like a boss"
date: 2022-09-17
tags: [scripts]
authors:
    - Nemanja
---

If you're Web developer you've probably been in the position where you have to update outdated
dependencies from your **package.json**. You could run

{{< cmd >}}
npm outdated
{{</ cmd >}}

to get all outdated dependencies, and then use *npm install* to install each dependency one by one.
But this is just annoying to do.
What I'll do instead is the following:

{{< cmd >}}
npm outdated --parseable | cut -f4 -d: | grep "@types" | xargs npm install
{{</ cmd >}}

This will execute outdated with *parsable* argument, so I can pipe it to *cut* to get right column and then pipe it to
*grep* which will find dependencies with specific name I want to update, in this case I want to update all *Typescript* types
and finally pipe it to *xargs* to install them. 

There is also [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) library which offers nice command line
interface to select dependencies you want to update, but I would rather use script instead of maintaining yet another library.