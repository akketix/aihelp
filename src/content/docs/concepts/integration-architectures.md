---
title: Agent Integration Architectures
description: Comparison grid and decision guidelines for Extensions, Skills, APIs, and MCPs.
---

When building agentic ecosystems, developers must connect language models to external data, capabilities, and system environments. This guide defines when to use **Extensions**, **Skills**, **APIs**, and **MCPs (Model Context Protocol)**.

---

## Architectural Comparison Grid

| Integration Type | Execution Layer | Connection Protocol | Deployment Complexity | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Skills** | Prompt Context | Natural Language / Markdown | Very Low (Text files) | Domain instructions, workflow checklists, styling rules |
| **Extensions** | System Host | Direct Node/Python runtime | High (Local package install) | File system validation, local database operations, compilers |
| **APIs** | Network Remote | REST / GraphQL / gRPC | Moderate (HTTP requests) | Third-party services, model endpoints, remote databases |
| **MCPs** | Protocol Server | Standardized MCP (JSON-RPC) | Low-Moderate (Mcp Config) | Standardized tool sharing, editor integrations, web dev consoles |

---

## When to Use Which?

### Use **Skills** When

* You need to provide the agent with **behavioral instructions**, style guidelines, or step-by-step troubleshooting checklists.
* The capabilities are represented purely as natural language context.
* *Example*: A `SKILL.md` outlining specific code-style rules or project constraints.

### Use **Extensions** When

* The agent needs to execute **deep OS-level operations** or run long-running state machines on the local workstation.
* You need to run complex Node.js or Python packages that coordinate multiple local operations (like git checkouts, database writes, and compilers).
* *Example*: The `pi-soly` loop engineering extension or `session-db` SQLite persistent storage.

### Use **APIs** When

* The target data or service is **hosted remotely** by a third party.
* You need to perform database lookups, trigger serverless functions, or call large models (like calling the Gemini API).
* *Example*: Making HTTP fetch calls to a remote database or model hosting endpoints.

### Use **MCPs (Model Context Protocol)** When

* You want to expose **pre-built, standardized tools** (like a browser control interface, database client, or engine console) to any compliant LLM client.
* You want tool schemas to be loaded dynamically without rewriting the client integration code.
* *Example*: Using `chrome-devtools-mcp` to let the agent inspect and drive a web browser dynamically.
