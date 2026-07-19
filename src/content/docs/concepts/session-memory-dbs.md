---
title: Session Memory & State Persistence
description: Architecture of persistent agent state databases and session tracking.
---

Coding agents require context that persists across multiple chat rounds, system restarts, and workspace changes. Pure context-window tokens are ephemeral and expensive. This page details how persistent **Session Memory databases** structure and manage long-term agent state.

---

## The Persistent Session DB Pattern

Instead of passing the entire historical transcript on every LLM call, a dedicated **Session DB** (modeled after `session-db.ts`) tracks key-value parameters, workspace stats, and task history in a local relational database (like SQLite).

```text
[ LLM Turn ] ──> (Extract State Changes) ──> [ Session DB (SQLite) ]
                                                        │
[ New Chat ] <── (Load Relevant Variables) <────────────╯
```

### Key Parameters Stored

* **Variable Registry**: Active repository branches, user preferences, API slugs, and target build directories.
* **Task State**: Active workflow indicators (`planning`, `executing`, `verifying`).
* **Context Summary**: A compressed semantic summary of previous developer interactions.

---

## Mechanics: SQLite Session Schema

Below is the standard relational schema used to hold persistent session information:

```sql
CREATE TABLE IF NOT EXISTS agent_sessions (
    session_id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    current_status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS session_variables (
    session_id TEXT NOT NULL,
    key_name TEXT NOT NULL,
    val_data TEXT, -- JSON serialized parameters
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (session_id, key_name),
    FOREIGN KEY (session_id) REFERENCES agent_sessions(session_id) ON DELETE CASCADE
);
```

---

## Walkthrough: Managing State Programmatically

This script demonstrates how an agent loads, updates, and saves persistent variables during a coding lifecycle:

```typescript
import { Database } from "sqlite3"; // Mocking SQLite database connection

interface SessionState {
  sessionId: string;
  variables: Record<string, any>;
}

export class SessionDBManager {
  private db: Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
  }

  // Retrieve variables for the active session
  public async getSessionVariables(sessionId: string): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT key_name, val_data FROM session_variables WHERE session_id = ?",
        [sessionId],
        (err, rows) => {
          if (err) return reject(err);
          const vars: Record<string, any> = {};
          for (const row of (rows as any[])) {
            vars[row.key_name] = JSON.parse(row.val_data);
          }
          resolve(vars);
        }
      );
    });
  }

  // Update a single session variable
  public async setSessionVariable(sessionId: string, key: string, value: any): Promise<void> {
    const serialized = JSON.stringify(value);
    const now = Date.now();
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO session_variables (session_id, key_name, val_data, updated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(session_id, key_name) DO UPDATE SET val_data = ?, updated_at = ?`,
        [sessionId, key, serialized, now, serialized, now],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }
}
```
