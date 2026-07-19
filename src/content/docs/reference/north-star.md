---
title: Project North Star & Scope Policy
description: Definition of our wiki's core mission, what content belongs, and what lies outside our boundaries.
---

Like game database sites (e.g., Fextralife, ESO-Hub) that organize dense tables of weapons, builds, and level walkthroughs, this wiki is a **structured database and walkthrough catalog for AI Engineering**.

Our **North Star** is to provide developers with factual, highly structured, and actionable data to help them construct AI "builds" (applications) with optimal components.

---

## In-Scope: The AI Engineering Catalog

Our scope is intentionally broad, focusing on the practical "game mechanics" of AI. The following categories are in-scope:

### 1. The Component Database (Equivalent to Item databases)

- **Model Catalogs**: Detailed technical specifications (context windows, tokens-per-second, pricing, capability scores).
- **Tooling Registries**: Vector databases (Qdrant, Pinecone, pgvector), agent frameworks (LangGraph, AutoGen), and embedding models (Cohere, OpenAI, Voyage).

### 2. Implementation "Builds" (Equivalent to Character Build guides)

- Standard recipes for assembling AI applications. For example:
  - *The Production RAG Build*: Hybrid Search + Reranker + LLM.
  - *The Autonomous Agent Build*: LangGraph + Tool Calling + Reflection Loop.

### 3. Step-by-Step Walkthroughs (Equivalent to Quest walkthroughs)

- Actionable guides to achieve specific engineering goals:
  - How to fine-tune a model using Unsloth.
  - How to set up local LLM inference with Ollama.
  - How to deploy models to serverless platforms.

### 4. Mechanics & Formulas (Equivalent to Game scaling formulas)

- Explanations of core mathematical and logical formulas:
  - Tokenization math and cost calculations.
  - Attention scaling limits.
  - Latency vs. throughput formulas.

---

## Out-of-Scope: What We Do Not Accept

To maintain data integrity and prevent bloat, the following are strictly out-of-scope:

- **AI Corporate Drama & News**: Funding announcements, executive hires, or community gossip.
- **Subjective Speculation**: Opinion pieces about AGI timelines, societal impacts, or non-technical philosophies.
- **Marketing & Hype**: Vague press releases or commercial tool promotions that do not supply verifiable benchmarks, technical architecture maps, or open code repositories.
