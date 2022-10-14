---
title: "Git - What changed"
date: 2022-10-14
tags: [git]
authors:
    - Nemanja
---

You know that feeling when you come back from vacation, and you want to know what has
been done in the days while you were not there, but you're too lazy to go through each and every
Pull Request to see the changes. It would be much easier if there is one command in the terminal
that can give you all changed files. Well sir, there is one.

{{< cmd >}}
git whatchanged -p --since='2 weeks ago'
{{</ cmd >}}

This command will give you diff of all files that changed in the last 2 weeks.

NOTE: You can use *--since* also for "month ago", "days ago", "hours ago" "minutes ago" 

