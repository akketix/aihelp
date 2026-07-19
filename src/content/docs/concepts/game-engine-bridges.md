---
title: Game Engine Runtime Bridges
description: Integrating coding agents directly with active game engines.
---

For game development, static file edits are insufficient. Agents must check changes inside the game loop runtime. This page details how **Game Engine Bridges** (modeled after `godot-tools.ts` and `godot-console.ts`) connect agents to live game viewports via socket interfaces.

---

## Socket-Based Engine Bridges

Instead of making edit-and-run cycles manual, the agent connects directly to the game engine's developer console using a local TCP/UDP socket or HTTP API wrapper.

```text
[ Coding Agent ] ──> (Socket Commands / JSON-RPC) ──> [ Godot Editor Engine ]
       ▲                                                        │
       ╰─────────── (Runtime Console Outputs / Errors) <────────╯
```

### Supported Capabilities

* **Auto-Importing**: Triggering the asset pipeline to rebuild textures, materials, and 3D scenes instantly on file change.
* **Runtime Execution**: Sending debug scripts to execute live inside the running test viewport (e.g., reloading a level, spawning an item, or modifying character stats).
* **Log Capturing**: Fetching errors and memory leaks directly from the game stdout console for self-correction loops.

---

## Mechanics: Godot JSON-RPC Schema

When communication is established, command packets are sent as JSON-RPC messages. A typical command payload to trigger a file import looks like this:

```json
{
  "jsonrpc": "2.0",
  "method": "core/import_asset",
  "params": {
    "path": "res://assets/characters/hero_mesh.glb",
    "force_reimport": true
  },
  "id": 42
}
```

---

## Walkthrough: Live Console Connection Script

Below is a client connection script that lets a coding agent connect to an active Godot console port (`localhost:6008`), send commands, and read the console stream:

```typescript
import { Socket } from "node:net";

export class GodotEngineBridge {
  private client: Socket;
  private port: number;
  private host: string;

  constructor(port = 6008, host = "127.0.0.1") {
    this.port = port;
    this.host = host;
    this.client = new Socket();
  }

  // Open socket to the engine
  public connectToEngine(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.connect(this.port, this.host, () => {
        console.log("[GodotBridge] Connected to live engine console.");
        resolve();
      });

      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }

  // Send a JSON-RPC method to the running editor
  public sendCommand(method: string, params: Record<string, any>): void {
    const payload = JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: Date.now()
    });
    this.client.write(payload + "\n");
  }

  // Subscribe to console stdout stream
  public subscribeToLogs(onLogReceived: (log: string) => void): void {
    this.client.on("data", (data) => {
      onLogReceived(data.toString("utf-8"));
    });
  }

  // Close connection
  public disconnect(): void {
    this.client.end();
  }
}
```
