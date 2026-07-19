---
title: Loop Engineering (Soly Framework)
description: Workflow verbs and state transition lifecycles in agent loops.
---

Standard chat interfaces force single-turn generation cycles. **Loop Engineering** (as implemented by the Soly framework) decomposes complex coding tasks into managed state stages, ensuring verification steps occur before final integrations.

---

## The Soly Workflow Verbs

The task lifecycle is structured into discrete transition phases driven by specific commands ("verbs"). This splits the planning phase from the execution phase, preventing model drift.

```text
       [ soly init ] 
             │
             ▼
       [ soly new ] ──> [ soly plan ] ──> [ soly discuss ]
                                                   │
                                                   ▼
       [ soly done ] <── [ soly execute ] <────────╯
```

### The Verbs Breakdown

1. **`soly init`**: Sets up project metadata, configures workspace constraints, and registers local agent capabilities.
2. **`soly new`**: Starts a new issue context. It creates a dedicated local work branch and isolates the workspace.
3. **`soly plan`**: Synthesizes a technical implementation plan (`implementation_plan.md`) describing exactly what files will be created or modified.
4. **`soly discuss`**: Gathers feedback, resolves ambiguities, and tests alternative approaches with the user or automated review panels.
5. **`soly execute`**: Performs the code edits, run scripts, compiles, and tests.
6. **`soly done`**: Validates final outputs, cleans up working directories, merges the branch, and updates session histories.

---

## Mechanics: Soly State Interface

Every Soly project tracks its current phase and active file changes inside a state object. The state model defines how steps advance:

```typescript
export type SolyPhase = "idle" | "planning" | "discussing" | "executing" | "completed";

export interface SolyState {
  projectName: string;
  cwd: string;
  phase: SolyPhase;
  activeBranch: string;
  planFile: string | null;
  modifiedFiles: string[];
  tasks: {
    id: string;
    description: string;
    completed: boolean;
  }[];
}
```

---

## Walkthrough: Custom State Transitions

This script outlines how a Soly-based loop parses incoming verbs, updates session states, and advances the project phase:

```typescript
import { SolyState, SolyPhase } from "./types"; // Mock types import

export class SolyWorkflowEngine {
  private state: SolyState;

  constructor(initialState: SolyState) {
    this.state = initialState;
  }

  // Processes state updates depending on command verbs
  public handleVerb(verb: string, args: string[]): SolyState {
    switch (verb) {
      case "new":
        this.state.phase = "planning";
        this.state.activeBranch = args[0] || "task-branch";
        this.state.modifiedFiles = [];
        this.state.planFile = "implementation_plan.md";
        break;

      case "plan":
        if (this.state.phase !== "planning") {
          throw new Error("Invalid transition: Must run 'new' before creating a plan.");
        }
        this.state.phase = "discussing";
        break;

      case "execute":
        if (this.state.phase !== "discussing" && this.state.phase !== "planning") {
          throw new Error("Invalid transition: Must establish plan/discussion before execution.");
        }
        this.state.phase = "executing";
        break;

      case "done":
        this.state.phase = "completed";
        break;

      default:
        throw new Error(`Unknown workflow verb: ${verb}`);
    }

    return this.state;
  }
}
```
