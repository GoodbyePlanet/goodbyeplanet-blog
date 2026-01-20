---
title: "Embeddings"
date: 2026-01-07
tags: [AI, Embeddings, Vectors, RAG]
authors:
    - Nemanja
---

[![Click to zoom](/images/embeddings.png)](/images/embeddings.png)

Definition: Embeddings are vectors that represent semantic meaning in a multi-dimensional space.

Let's break this down:

**Vectors**:

A vector is just an array of numbers. For an AI model, the word "Apple" might look like this: [0.43, -0.12, 0.98, ...].
This "numerical identity" is what allows the computer to perform math on language. We can also represent people (and things)
as vectors of numbers.

**Semantic Meaning**:

Because "Apple" and "Pear" are both fruits, their vectors will have very similar numbers.
This allows the AI to understand that even if you didn't use the exact word "fruit," you are talking about
something in that category.

**Multi-Dimensional Space**:

A standard embedding usually has between 768 and 1,536 dimensions.
High-dimensional vector space means the AI represents text using many numbers.
Each number captures a small aspect of meaning, such as emotion, topic, or context.
Having many dimensions gives the AI enough space to understand subtle differences and prevents *crowding**,
where different ideas are forced too close together and become mixed up.

**Simple Market Analogy**:

A great way to visualize this is the layout of a supermarket. Similar products are always grouped together; you won't
find pens, ketchup, and diapers on the same shelf. In the same way, embeddings ensure that words with similar meanings
are "placed" near each other in the model's mathematical space.

---

*Crowding* - occurs when multiple unrelated sentences are embedded into a single vector, causing relevant meanings to
compete with unrelated ones during similarity search.

Imagine you have three sentences:
"I love basketball.", "The cat is sleeping on the sofa.", "The stock market crashed today."

If we pretend that we have only three dimensions, each vector would point far from the other two, and that would be fine.
But if we use two dimensions, we would not have enough space to represent the three sentences. E.g. sentence 
"The stock market crashed today" would get "crowded" within the region where the sentence "I love basketball" is located,
and it would appear as if it is similar to that sentence even though it has nothing in common with it.

---
Reference: https://jalammar.github.io/illustrated-word2vec/

