---
title: "LLM Parameters: Temperature & Top-P"
date: 2026-02-17
tags: [ AI, Parameters, LLM ]
authors:
  - Nemanja
---

[![Click to zoom](llm-parameters.png)](llm-parameters.png)

When working with Large Language Models via API, understanding the **temperature** and **top-p** parameters is essential
for transforming basic text generation into precise, predictable, or highly creative outputs.

Let's go straight to the examples!

You go to the developer console of your favorite LLM provider and ask about the weather:

*The weather today is...*

LLM will start predicting the next word that comes after "is" and it does this by generating a list of next probable
tokens. Every output token is one inference pass (One complete pass through LLM).
You get a list of tokens with their probabilities:

| Token      | Probability |
|------------|-------------|
| sunny      | 45%   |
| cold       | 30%   |
| beautiful  | 15%  |
| purple     | 0.5%  |
| banana     | 0.01%  |

---

#### **Temperature**:
This parameter controls how deterministic the model is when selecting tokens. The lower the value (e.g., 0.1 or 0.2),
the more predictable and focused the model becomes.

**Low Temperature** (e.g., 0.2) pushes high probabilities up and the low ones down.
Sunny becomes 92% cold becomes 7% beautiful becomes 1%.
Result: The model is now almost certain to pick "sunny." It has become deterministic.

**High Temperature** (e.g., 1.5), it flattens the differences, making the "underdogs" more relevant.
Sunny drops to 25%, cold drops to 22%, beautiful stays around 18%, purple jumps up to 10%.
Result: The model is now "adventurous." There is a decent chance it might pick "purple," making the sentence weird and
creative.

#### **Top-P Parameter**:

Top-P (Nucleus Sampling) acts as a filter, it defines a threshold, so the model only considers tokens within the
top "P" percentage of a likelihood, ignoring the unlikely "tail" of the distribution. 
It draws a line and cuts off the losers.

Top-P = 0.5 - The model adds up the tokens until it hits 50%:

Sunny (45%) ... not at 50% yet, keep going. Cold (30%) ... *Total is now 75%.*

The Resulting Pool: Only **[sunny, cold]**.

Everything else (beautiful, purple, banana) is deleted. The LLM is now forbidden from picking them, even if the
temperature is high.

Top-P = 0.9 - Sunny (45%), Cold (30%), Beautiful (15%) ... *Total is now 90%.*

The Resulting Pool: **[sunny, cold, beautiful]**.

"Purple" and "banana" are deleted. This allows for variety ("beautiful") but still protects the model from saying
something totally nonsensical like "The weather today is banana."

And this is pretty much it! Not that hard, right?