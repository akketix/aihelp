---
title: Local LLM VRAM Optimization & Memory Compression
description: How to stop Windows Memory Compression from slowing down local LLMs (Ollama, ComfyUI, llama.cpp) and prevent CUDA Out of Memory (OOM) crashes.
---

When running open-weight Large Language Models (LLMs) locally with **Ollama**, **llama.cpp**, **vLLM**, or **ComfyUI**, hardware memory bandwidth is the primary bottleneck for token generation speed (tokens per second).

---

## ⚡ The Windows Memory Compression Problem

On Windows 10 and 11, when an application requests more memory than available physical VRAM or RAM, Windows does not immediately crash. Instead, the OS compresses unallocated working set pages into **Windows Memory Compression**.

While Memory Compression prevents instant system crashes, it creates a massive performance penalty for AI workloads:

- **VRAM to RAM Offloading Penalty:** Transferring KV-cache matrices over PCIe Gen4 (32 GB/s) instead of GDDR6X VRAM (1,000+ GB/s) causes a **10× to 30× drop in generation speed**.
- **CPU Compression Thrashing:** Decompressing pages on the fly consumes 100% of CPU thread capacity, starving the inference engine of memory access cycles.

---

## 🧮 Calculating VRAM Requirements

Before launching a model, compute its total VRAM footprint:

$$\text{VRAM}_{\text{Total}} = \left( \frac{\text{Params (Billions)} \times \text{Quant Bits}}{8} \right) + \text{KV Cache} + \text{CUDA Buffer (1.2 GB)}$$

Use the interactive [Local LLM VRAM Calculator](https://mneurix.dev/tools/vram-calculator) to test your exact model parameters and context lengths.

---

## 🛠️ Optimization Best Practices

### 1. Match Quantization to Dedicated VRAM
Always choose a quantization level (`Q4_K_M`, `Q5_K_M`) that leaves at least **1.5 GB of dedicated VRAM headroom** for CUDA contexts and desktop display compositing.

### 2. Auto-Flush Working Sets & Monitor Pressure
Use [MemScope](https://mneurix.dev/memscope), an open-source Windows utility developed by Mneurix that:
- Surfaces real-time **Windows Memory Compression Pressure**.
- Maps PID-level 64-bit DXGI VRAM allocations.
- Auto-triggers `POST :8000/free` or process working set purges when memory pressure hits critical thresholds.

---

## 🔗 Related Resources
- 🛠️ [Interactive VRAM & Model Size Calculator](https://mneurix.dev/tools/vram-calculator)
- 💾 [MemScope Open-Source Memory Monitor](https://mneurix.dev/memscope)
- 📄 [MemScope GitHub Repository](https://github.com/akketix/memscope)
