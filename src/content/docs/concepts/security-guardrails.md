---
title: Security Guardrails & Write Safety
description: Pre-execution code validation, write guardrails, and AST scanning.
---

Giving coding agents direct write access to files can cause bugs, broken dependencies, and security vulnerabilities. **Security Guardrails** (modeled after `write-guard.ts` and `north-star-guard.ts`) serve as pre-execution filters, checking generated files before they touch the disk.

---

## The Pre-Write Guardrail Architecture

Instead of letting an agent write directly to the workspace, file writes are intercepted. The payload passes through syntactic, structural, and security verification checks:

```text
[ Agent Payload ] ──> (Syntax Check) ──> (AST Security Scan) ──> (Write to Disk)
                            │                     │
                            ▼                     ▼
                     [ Reject & Retry ] <── [ Failures ]
```

### Active Guardrail Filters

1. **Syntactic Linter**: Validates code structure (e.g., checks TypeScript compile safety, JSON formatting, or Markdown structure).
2. **Abstract Syntax Tree (AST) Scanner**: Audits code for blacklisted imports, dangerous system calls, or suspicious network access.
3. **North Star Gatekeeper**: Verifies that the proposed modifications align with the project's in-scope directories and design policies.

---

## Mechanics: AST Validation Checking

To detect security exploits (like code injecting unauthorized scripts or importing banned network packages), the write guard parses the file into an Abstract Syntax Tree (AST) to evaluate imports and calls statically:

```json
{
  "type": "ImportDeclaration",
  "source": {
    "type": "Literal",
    "value": "node:child_process"
  }
}
```

If an AST contains nodes trying to import `node:child_process` or `eval` in a context where they are banned, the write guard immediately cancels the write operation.

---

## Walkthrough: Constructing a Write Guard

This TypeScript example outlines how a file write checker parses JavaScript/TypeScript strings, validates their syntax, and blocks insecure imports:

```typescript
import { parseModule } from "esprima"; // Mock JavaScript AST Parser

interface VerificationResult {
  isSafe: boolean;
  issues: string[];
}

export class CodeWriteGuard {
  private bannedImports = ["child_process", "fs/promises", "dns"];

  // Inspect the generated code before allowing filesystem writes
  public verifyCodeSafety(code: string): VerificationResult {
    const result: VerificationResult = { isSafe: true, issues: [] };

    // 1. Basic Syntax Check
    try {
      const ast = parseModule(code);
      
      // 2. AST Walk to inspect Import Declarations
      for (const node of ast.body) {
        if (node.type === "ImportDeclaration") {
          const importSource = node.source.value as string;
          if (this.bannedImports.includes(importSource)) {
            result.isSafe = false;
            result.issues.push(`Banned import detected: "${importSource}"`);
          }
        }
      }
    } catch (parseError: any) {
      result.isSafe = false;
      result.issues.push(`Syntax Error: ${parseError.message}`);
    }

    return result;
  }
}
```
