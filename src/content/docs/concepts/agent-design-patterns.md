---
title: Agentic Loop Design Patterns
description: Comparative architectural blueprints for autonomous agents and sequential prompt queuing patterns.
---

Agentic systems go beyond simple single-turn prompts by structuring LLMs inside execution loops. This guide maps out standard agent design patterns, including the **Sequential Prompt Queue** and **Domain Tool Extension** patterns popularized by advanced coding harness platforms.

---

## Agent Architectures Comparison

| Design Pattern | Key Feature | Latency Penalty | Loop Safety | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **ReAct Loop** | Reason → Action step interleaving | Low (step-by-step) | Retry limit / budget | Simple tool-use, search, calculators |
| **Prompt Queue** | Chained sequential instruction pipeline | Moderate | Sequence gating | Batch operations, multi-stage builds |
| **Reflection** | Output verification vs. self-correct | High (double call) | Similarity checker | Critical code generation, linting gates |

---

## Pattern: The Sequential Prompt Queue

When executing complex, multi-stage engineering operations (such as scaffolding, building, and deploying a project), running a single massive prompt often leads to instruction drift.

Instead, the **Sequential Prompt Queue** structures tasks into discrete, prioritized steps. The queue executes each prompt in order, passing state context down the pipeline:

```text
[Prompt 1: Scaffold] ──> (Run & Validate) ──> [Prompt 2: Code Edit] ──> (Run & Validate) ──> [Prompt 3: Deploy]
```

### Queue Execution Gating

To prevent cascading errors, each item in the queue must pass an **execution gate** before the next step runs:

- **Structural Gate**: Code compiles and syntax check (linter) passes.
- **Factual Gate**: Code is tested or evaluated against a known schema.
- **Dependency Gate**: Ensure prerequisites are met.

---

## Pattern: Domain-Specific Tool Extensions

Autonomous coding agents (like the Pi Coder Harness) achieve high reliability by connecting to specialized **Domain Tool Extensions** (e.g., CRPG rules engines, model databases, validator kits) rather than relying purely on LLM reasoning.

For instance, an agent editing game metrics doesn't just guess balance values; it executes a local tool that validates action economy budgets:

\[Boss\_Actions = \lceil \text{Party Size} \times 0.6 \rceil\]

---

## Walkthrough: TypeScript Agentic Loop

Here is the implementation of a state-based agentic loop that executes a sequential queue of tool tasks, including self-correction:

```typescript
interface AgentState {
  taskQueue: string[];
  currentIndex: number;
  workspaceCode: string;
  errors: string[];
}

export async function runAgentQueue(initialState: AgentState): Promise<AgentState> {
  let state = { ...initialState };

  while (state.currentIndex < state.taskQueue.length) {
    const currentTask = state.taskQueue[state.currentIndex];
    
    // 1. Generate solution
    const solution = await callLLM(currentTask, state.workspaceCode);
    
    // 2. Dry-run locally (Linter / Compile gate)
    const verification = verifyCode(solution);
    
    if (verification.success) {
      // Pass code to next step
      state.workspaceCode = solution;
      state.currentIndex++;
    } else {
      // Feed error back to LLM for self-correction (Reflection)
      state.errors.push(verification.errorMessage);
      const correction = await callLLMForCorrection(solution, verification.errorMessage);
      
      if (verifyCode(correction).success) {
        state.workspaceCode = correction;
        state.currentIndex++;
      } else {
        throw new Error(`Agent halted: failed to resolve task "${currentTask}" after self-correction.`);
      }
    }
  }

  return state;
}

async function callLLM(task: string, code: string): Promise<string> {
  // Call to Gemini 2.5 Flash / Pro
  return "updated code";
}

function verifyCode(code: string): { success: boolean; errorMessage: string } {
  // Run local linter/compile check
  return { success: true, errorMessage: "" };
}

async function callLLMForCorrection(code: string, error: string): Promise<string> {
  return "corrected code";
}
```
