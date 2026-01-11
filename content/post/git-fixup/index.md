---
title: "Optimize Your Git Commit History with git --fixup"
date: 2023-05-18
tags: [git]
authors:
    - Nemanja
---

In this blog post, I'll introduce ***git --fixup***, a valuable feature that aids in maintaining a clean commit history for your project.
Whether you're junior developer or someone with more experience, you've probably encountered situations where you've made multiple
commits on a feature branch, only to discover a bug in a commit that you'd like to change. If the bug is in the most recent commit,
you can use ***--amend*** to modify it. (Read more about amend [here](https://goodbyeplanet-blog.vercel.app/post/git-amend/)).
However, if the commit you want to change is not the most recent one, you'll need to make code changes, commit them, and then
perform an interactive rebase to maintain a clean git history. This is where the ***git commit --fixup*** comes in handy.
But before we explore the fixup command, let's first understand how to achieve the same result without it, so you can appreciate
its convenience.

Let's consider the following commit history:

```shell
* 0b2c830 (HEAD -> feature-A) Show error toastr message if user update is not successful
* 812d77a Change text in the Header.js
* c31bb1c Add notification toastr message when update of the user is successful
* 6e8f079 Change hint message on the Home Page
* 260a8a5 Add modal for changing user location address
```

Suppose we have a bug in the commit with SHA-1 ***260a8a5*** (the last one), and we want to fix it. After resolving the bug,
we make a new commit, resulting in the following history:

```shell
* 2b10dde (HEAD -> feature-A) Fix save action in the modal for changing user location
* 0b2c830 Show error toastr message if user update is not successful
* 812d77a Change text in the Header.js
* c31bb1c Add notification toastr message when update of the user is successful
* 6e8f079 Change hint message on the Home Page
* 260a8a5 Add modal for changing user location address
```

To rewrite our git history and squash the commit that introduced the bug into the commit that fixed it, we need to perform an
interactive rebase:

```shell
$ git rebase --interactive HEAD~6

pick 260a8a5 Add modal for changing user location address
pick 6e8f079 Change hint message on the Home Page
pick c31bb1c Add notification toastr message when update of the user is successful
pick 812d77a Change text in the Header.js
pick 0b2c830 Show error toastr message if user update is not successful
pick 2b10dde Fix save action in the modal for changing user location

# Rebase 296c8b6..2b10dde onto 296c8b6 (6 commands)
```

Once the interactive rebase starts, we need to move the commit that fixes the bug bellow the commit that introduced the bug and
change ***pick*** to ***fixup*** or simply use the letter ***f***:

```shell
pick 260a8a5 Add modal for changing user location address
fixup 2b10dde Fix save action in the modal for changing user location
pick 6e8f079 Change hint message on the Home Page
pick c31bb1c Add notification toastr message when update of the user is successful
pick 812d77a Change text in the Header.js
pick 0b2c830 Show error toastr message if user update is not successful
```

After completing these steps, simply close the editor, and ***git*** will handle the rest, providing a successful
update message for the references.

***Successfully rebased and updated refs/heads/feature-A.***

You can admit that this whole process could take time and repeating all this is not nice, that's why ***git*** has introduced
***git commit --fixup*** feature. Let's see how using it is much easier than the above process.

The first thing to do once we fix a bug is to stage the changes and then commit them using the following command:

```shell
$ git commit --fixup 260a8a5
```

After that our history will look like this:

```shell
* f5b8829 (HEAD -> feature-A) fixup! Add modal for changing user location address
* e716f2d Show error toastr message if user update is not successful
* 98bc709 Change text in the Header.js
* e8da9ef Add notification toastr message when update of the user is successful
* e1f7672 Change hint message in the Home Page
* 260a8a5 Add modal for changing user location address
```

You can notice how ***git*** has added ***fixup!*** keyword just before the same commit message of the ***260a8a5*** commit, and this
is how ***git*** will be able to move commits on his own once we execute ***rebase -i --autosquash commit-sha-1***
command. ***commit-sha-1*** represents one commit before the commit that we want to fix. So to squash commits we have to use interactive
rebase with ***--autosquash*** option, and this will rewrite our history with squashing the original commit that introduced a bug
into the commit that fixes the bug.

```shell
$ git rebase --interactive --autosquash 260a8a5~1
```

When we execute this command we will get an interactive editor opened for us:

```shell
pick 260a8a5 Add modal for changing user location address
fixup f5b8829 fixup! Add modal for changing user location address
pick e1f7672 Change hint message in the Home Page
pick e8da9ef Add notification toastr message when update of the user is successful
pick 98bc709 Change text in the Header.js
```

You can see how git has already rearranged commits for us and all we have to do next is to exit the interactive editor, ***git***
will do the rest for us, squashing commit that introduced a bug into the commit that fixed it, leaving us with a nice and
clean ***git*** history.

This is really good practice if you're working in the team that performs PR reviews, and you can imagine how your ***git*** commit
history can look like when you add a bunch of new commits that contain small changes in order to fulfill all suggestions that
your team members added after reviewing your PR.

I hope this blog post has helped you understand the ***git commit --fixed*** feature and I encourage you to utilize it
in order to maintain a clean commit history.
If you're interested in learning more about ***git*** check out my ebook [git-basics](https://nemanjas.gumroad.com/l/PwJfo) that I
published on gumroad.