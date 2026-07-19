---
title: Retrieval-Augmented Generation (RAG) Build
description: Production-grade RAG build blueprint, RRF search fusion math, and code implementation walkthrough.
---

Retrieval-Augmented Generation (RAG) is the standard build pattern for connecting LLMs to custom knowledge bases. This guide provides a production-grade blueprint for a **Hybrid RAG Build** featuring dense vector search, lexical keyword search, and reranking.

---

## The Hybrid RAG Component Blueprint

| Component | Technology Option | Role / Slot | Primary Metric |
| :--- | :--- | :--- | :--- |
| **Lexical Retriever** | BM25 / Elasticsearch | Keyword & exact term matching | Recall |
| **Dense Retriever** | Qdrant / pgvector | Semantic & conceptual matching | Semantic Recall |
| **Reranker** | Cohere Rerank / BGE-Reranker | Re-orders top results based on relevance | Precision @ K |
| **Generator** | Gemini 2.5 Flash | Synthesizes response from top documents | Faithfulness |

---

## Mechanics: Reciprocal Rank Fusion (RRF)

To combine the results of keyword search (BM25) and semantic vector search, we use the **Reciprocal Rank Fusion (RRF)** formula. RRF scores documents based on their rank in both search lists, ensuring that documents appearing high in both lists are promoted.

### The RRF Formula

For a document $d$ within a set of query result lists $M$:

\[RRF\_Score(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}\]

Where:

- **$M$**: The set of rank lists (e.g., $M = \{\text{Vector List}, \text{Keyword List}\}$).
- **$r_m(d)$**: The rank of document $d$ in list $m$ (1-indexed).
- **$k$**: A smoothing constant (typically set to 60 to prevent low-ranking items from disproportionately affecting the score).

---

## Mechanics: Chunking Strategies

Before embedding and storing documents, text must be divided into chunks. The strategy selected determines the quality of semantic retrieval:

### Chunking Spec Sheet

| Chunking Strategy | Mechanics | Computation Cost | Optimal Use Case |
| :--- | :--- | :--- | :--- |
| **Fixed-Size** | Split at exact token/character length (e.g., 500 characters) with overlap | Low | Standard search, flat documents |
| **Recursive Character** | Split hierarchically using paragraph, sentence, and word boundaries | Low-Moderate | Structured text, code files |
| **Semantic Distance** | Split when semantic embedding similarity between sentences drops below a threshold | High | Narrative text, transcripts, context-rich docs |

---

## Mechanics: Evaluation Metrics (Ragas Framework)

Measuring your RAG pipeline's quality requires automated tests to ensure your LLM isn't hallucinating or drawing from irrelevant context. The three primary metrics are:

1. **Faithfulness**: Measures if the generated answer is derived *only* from the retrieved context (detects hallucinations).
2. **Context Recall**: Measures if the retriever found *all* the relevant information needed to answer the question.
3. **Answer Relevance**: Measures if the generated response directly addresses the user's query.

---

## Walkthrough: Python Hybrid RAG Pipeline

Here is the implementation code for a standard hybrid retrieval and reranking build using `Qdrant` and `sentence-transformers`:

```python
from qdrant_client import QdrantClient
from sentence_transformers import CrossEncoder

def hybrid_rerank_pipeline(query: str, limit: int = 5) -> list:
    client = QdrantClient(url="http://localhost:6333")
    
    # 1. Execute Dense Semantic Search
    dense_results = client.search(
        collection_name="docs",
        query_vector=[0.1] * 384,  # Placeholder query embedding
        limit=20
    )
    
    # 2. Execute Lexical Keyword Search (BM25)
    sparse_results = client.search(
        collection_name="docs",
        query_vector=client.get_sparse_vector(query), # BM25 representation
        limit=20
    )
    
    # 3. Combine pools and apply Cross-Encoder Reranking
    candidate_pool = list({res.id: res for res in (dense_results + sparse_results)}.values())
    documents = [res.payload["text"] for res in candidate_pool]
    
    reranker = CrossEncoder("BAAI/bge-reranker-large")
    pairs = [[query, doc] for doc in documents]
    scores = reranker.predict(pairs)
    
    # Sort candidates by rerank score
    scored_candidates = sorted(
        zip(candidate_pool, scores), 
        key=lambda x: x[1], 
        reverse=True
    )
    
    return [candidate for candidate, score in scored_candidates[:limit]]
```
