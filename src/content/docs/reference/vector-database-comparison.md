---
title: Vector Database Comparison
description: Component specifications, indexing algorithms, and RAM footprint formulas for vector databases.
---

Vector Databases are critical components for storing and retrieving semantic embeddings in RAG builds. Selecting the correct database requires understanding their indexing algorithms, hardware constraints, and memory scaling formulas.

---

## Component Specifications Comparison

| Database | Primary Index | Hosting Model | Indexing Speed | RAM Footprint | Optimal Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Qdrant** | HNSW / Segment | Self-hosted / Cloud | Very Fast | High (In-Memory) | High-speed, real-time filtering, production RAG |
| **pgvector** | HNSW / IVFFlat | PostgreSQL Extension | Moderate | Moderate | Relational data aggregation, unified DB stacks |
| **Milvus** | HNSW / IVF / ANNS | Distributed Cluster | Fast | Very High | Enterprise-grade, multi-billion vector scale |
| **Pinecone** | Proprietary | Managed SaaS | Variable | Managed | Serverless setups, zero-ops infrastructure |

---

## Mechanics: HNSW Index Memory Calculation

Hierarchical Navigable Small World (HNSW) is the gold standard algorithm for vector search accuracy, but it stores its entire graph structure in RAM. When scaling your database, you must calculate memory constraints to avoid Out-Of-Memory (OOM) failures.

### The Memory Footprint Formula

For a dataset of $N$ vectors with dimension size $D$ using standard 32-bit floating-point precision, the total RAM required to hold the HNSW graph scales according to this formula:

\[Memory_{HNSW} \approx N \times \left( (D \times 4) + (M \times 8) \right) \times 1.2 \text{ bytes}\]

Where:

- **$N$**: Total number of vectors.
- **$D$**: Vector dimension size (e.g., 1536 for OpenAI `text-embedding-3-large`, 384 for `all-MiniLM-L6-v2`).
- **$M$**: Number of bi-directional links created per vector node in the graph (typically ranges from 8 to 64; higher values increase accuracy but double memory size).
- **$1.2$**: A 20% safety overhead margin for graph metadata.

### Example Calculation: 1,000,000 OpenAI Vectors

For 1,000,000 vectors ($N = 1,000,000$, $D = 1536$, with graph connectivity $M = 16$):

\[Memory = 1,000,000 \times \left( (1536 \times 4) + (16 \times 8) \right) \times 1.2 \text{ bytes}\]
\[Memory = 1,000,000 \times \left( 6144 + 128 \right) \times 1.2 \text{ bytes}\]
\[Memory = 1,000,000 \times 6272 \times 1.2 \text{ bytes} \approx 7.53\text{ GB of RAM}\]
