---
title: "RAG (Retrieval Augmented Generation)"
date: 2026-01-04
tags: [AI, RAG]
authors:
    - Nemanja
---

RAG (Retrieval-Augmented Generation) is a technique that addresses the limitation of LLMs not having domain-specific
or up-to-date knowledge by augmenting the model’s responses with relevant information retrieved from an
external data source.

[![Click to zoom](/images/rag.png)](/images/rag.png)

This is a traditional RAG system that uses bi-encoders for retrieval, which enables fast similarity search but can lead
to information loss because documents are embedded without query context. Ok, but what does "information loss" mean?
Bi-encoder has to produce one vector that “represents all possible meanings” for each text chunk. This results in a
summary of the text chunk in vector form — basically the model guesses what’s important. Later on when we have the user 
query, we use the same bi-encoder to create a query vector, and we do similarity search between the query vector and the 
other vectors from a Vector database. The search relies purely on vector closeness, which can be imperfect: some vectors
may cover multiple topics, and while they are semantically similar to the query, they may not contain the most relevant
information.

This limitation can be addressed using a cross-encoder, which scores the relevance of a text chunk
**in the context of the query**. Let's see how that works in the next post.
