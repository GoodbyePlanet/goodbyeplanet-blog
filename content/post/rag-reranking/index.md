---
title: "RAG Reranking"
date: 2026-01-12
tags: [AI, RAG]
authors:
    - Nemanja
---

[![Click to zoom](rag-reranking.png)](rag-reranking.png)

RAG re-ranking is the process of re-ordering retrieved documents using a more accurate
relevance model so the LLM sees the best possible context. Let's break it down.

There are two steps:

- Retrieval: Is the process of finding relevant documents using, e.g., similarity search. This will return e.g. 50
possible candidate documents.

- Re-ranking: Reranker will then take a user query into consideration and re-order (filter) most relevant documents. (top N candidates)

But why do we need it?

Most embedding models used to create embeddings are bi-encoders.
Bi-encoders embed documents independently, without knowing the user’s query.
As a result, important query-specific details may not be emphasized in the embedding, which can reduce retrieval accuracy.
When searching a vector database, this can cause relevant documents to be ranked lower or missed entirely.

Types of reranking models:

- **cross-encoder** - An AI model that receives an input in the form of data pair (query and document pair or two sentences) 
and processes them together in a single pass*, producing a highly accurate relevance score.
We use this score to reorder retrieved documents by relevance to our query.

- **LLM-based re-ranking** - The LLM (like GPT 5.1) itself scores or orders documents.

- **Hybrid / metadata-aware re-ranking** -
Pure semantic re-ranking only measures meaning, but real-world relevance depends on more than semantics. 
Factors like recency, source trust, exact keyword matches, and document quality also matter. Hybrid (metadata-aware)
reranking combines these signals into a weighted score to produce better rankings.

  Examples:

  A newer document may be better than an older one.
 
  An official source may be better than a random blog.
   
  A document that mentions exact keywords may be more useful.

  A short, precise chunk may be better than a long one.

  So instead of relying on one score, we combine multiple signals. That’s hybrid / metadata-aware reranking.

  Semantic relevance (reranker score), Keyword relevance (exact match), Recency, source trust, popularity.
  **Final ranking = weighted combination**.

--- 
A single pass means one complete forward pass through the model’s neural network.