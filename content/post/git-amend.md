---
title: "Amend your commit"
date: 2022-09-23
tags: [git]
authors:
    - Nemanja
---

If you're developer I'm pretty sure that by working with *git* every day it happened that you committed some changes
and then you realize that you made a typo in the commit message, or you realize that you have to add one more
line of code, and for that small change there is no reason to add completely new commit.
This is where *--amend* option comes handy.

If you made a typo in commit message you don't have to use *git reset* and then *git commit* to add a new message,
you can use:

{{< cmd >}}
git commit --amend -m '<commit-message>'
{{</ cmd >}}

to change message of the last commit. Or if you have added a new change and you would like to include it in the
last commit without changing commit message you can use:

{{< cmd >}}
git commit --amend --no-edit
{{</ cmd >}}

to add that change to the last commit.

- - -
But there is one thing that you have to keep in mind when using *--amend*. It will change *SHA-1* hash of your
last commit object and because of that you will have to do *git push --force* to push your latest changes.