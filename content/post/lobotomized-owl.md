---
title: "Lobotomized owl selector"
date: 2022-09-18
tags: [css]
authors:
    - Nemanja
---

Have you even heard about **Lobotomized owl selector** in CSS?
If not this is how it looks like.

```css
* + * {
  margin-top: 1rem;
}
```

Crazy CSS stuff right? So what does it do? We all know that &#10033; is universal CSS selector that applies
given style to all elements in the DOM. The trick here is with &#10010; sign [adjacent sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator),
which will apply given style to all non-first elements, and no matter how many nested levels in your HTML structure you have.
But the best way to understand it is to play around with *margin-top* in this [code pen example](https://codepen.io/adamjberkowitz/pen/JOqNmd) created by
Adam Berkowitz.
Also, in this blog post [Axiomatic CSS and Lobotomized Owls](https://alistapart.com/article/axiomatic-css-and-lobotomized-owls/) *Heydon Pickering*
explains it in a lot more details.

