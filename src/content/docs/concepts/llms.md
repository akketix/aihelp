---
title: Large Language Models (LLMs)
description: Technical architectures, specifications, and GPU memory scaling mechanics for LLMs.
---

Large Language Models (LLMs) are the primary computing units of modern AI architectures. To design optimal application "builds," you must understand their underlying model architectures and their resource scaling formulas.

---

## Model Architectures Comparison

| Architecture | Example Models | Primary Advantage | Primary Bottleneck | Optimal Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Dense Transformer** | GPT-4, Llama 3 | High coherence, reasoning | $O(N^2)$ context scaling | General reasoning, logic tasks |
| **Mixture of Experts (MoE)** | Mixtral, Gemini Pro | Low inference cost (active parameters) | High VRAM storage size | High throughput, multi-tasking |
| **State Space Models (SSM)** | Mamba, Jamba | $O(N)$ linear context scaling | Weak associative memory | Long document processing, streams |

---

## Mechanics: KV Cache Memory Scaling

When serving LLMs, the primary bottleneck for long-context generation is the **Key-Value (KV) Cache** size, which stores keys and values of past tokens in GPU memory to avoid recomputation.

### The KV Cache Formula

For a standard transformer model using 16-bit floating-point precision (FP16), the total VRAM required for the KV Cache scales linearly with batch size and context length according to this formula:

\[Memory_{KVCache} = 2 \times 2 \times L \times H \times D \times B \times S \text{ bytes}\]

Where:

- **$L$**: Number of layers.
- **$H$**: Number of key-value heads.
- **$D$**: Dimension of each head.
- **$B$**: Batch size (number of concurrent requests).
- **$S$**: Sequence length (context history + new output tokens).

### Example Calculation: Llama 3 8B

For Llama 3 8B ($L=32$, $H=8$, $D=128$, at batch size $B=1$ and context length $S=8192$):
\[Memory = 4 \times 32 \times 8 \times 128 \times 1 \times 8192 \text{ bytes} \approx 1.07\text{ GB}\]

---

## Actionable Build: Token Estimation Script

When constructing prompts, you must calculate token counts locally to prevent API context-overflow failures. Here is a TypeScript helper using `tiktoken`:

```typescript
import { encodingForModel } from "js-tiktoken";

export function estimateTokenCount(text: string, modelName: any = "gpt-4o"): number {
  try {
    const encoder = encodingForModel(modelName);
    const tokens = encoder.encode(text);
    encoder.free(); // Prevent memory leaks
    return tokens.length;
  } catch (error) {
    // Fallback simple word-count multiplier if model not found
    return Math.ceil(text.split(/\s+/).length * 1.3);
  }
}
```
