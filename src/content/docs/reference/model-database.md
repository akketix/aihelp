---
title: LLM Component Database
description: A structured reference catalog of Large Language Models and their technical specifications.
---

This page serves as a component registry for Large Language Models. When designing your application "builds," use this data to select models based on context requirements, cost limits, and search capabilities.

---

## Technical Specifications Table

| Model Name | Provider | Context Window | Input Cost (per 1M) | Output Cost (per 1M) | Core Strengths (Stat Modifiers) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gemini 2.5 Pro** | Google | **2,000,000** | $1.25 | $5.00 | Multi-modal reasoning, large file ingestion, long context RAG |
| **Gemini 2.5 Flash** | Google | **1,000,000** | $0.075 | $0.30 | Speed, high rate-limits, lightweight agent tasks, cost efficiency |
| **Claude 3.5 Sonnet** | Anthropic | **200,000** | $3.00 | $15.00 | Code generation, complex agent logic, structured JSON output |
| **GPT-4o** | OpenAI | **128,000** | $2.50 | $10.00 | High general reasoning, conversational speech, fast API response |
| **Llama 3.3 70B** | Meta (Open) | **128,000** | *Self-Hosted* | *Self-Hosted* | Local privacy, fine-tuning potential, high reasoning output |

---

## Active Passive Modifiers (Features)

When selecting a model, pay attention to the passive capabilities they unlock:

### 🚀 Google Search Grounding

- **Unlocked by**: Gemini series.
- **Effect**: Allows the model to search the web in real-time to verify facts, reducing hallucinations to near-zero for factual queries.

### 💻 Computer Use / Tool Calling

- **Unlocked by**: Claude 3.5 Sonnet, GPT-4o.
- **Effect**: High accuracy in parsing tool schemas and calling external APIs sequentially in agent loops.

### 🧪 System Instruction Guarding

- **Unlocked by**: Most frontier models.
- **Effect**: Strong adherence to system prompts and constraints under adversarial user inputs.
