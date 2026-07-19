---
title: Usage & Due Diligence Policy
description: Our shared accountability model and reasonable due diligence guidelines.
---

This wiki is a community-driven common good. Because information in the field of Artificial Intelligence evolves rapidly, we operate under a **Shared Accountability Model** to maintain content safety, quality, and liability boundaries.

---

## 1. Defining "Reasonable" Due Diligence

As maintainers, we employ reasonable due diligence to review and filter content. In this project, "reasonable" is strictly defined as:

* **Automated Linting**: Validating that markdown structure, links, and code blocks comply with basic syntax rules (`markdownlint`).
* **AI Council Cross-Examination**: Running automated Gemini agents to scan pull requests for obvious hallucinations and outdated API schemas.
* **Maintainer Oversight**: Performing voluntary human reviews of flagged submissions before merging.

### What Due Diligence is NOT

* We do **not** compile, run, or execute third-party code submissions on physical hardware or test virtual machines.
* We do **not** audit third-party code for zero-day exploits, deep security logic vulnerabilities, or hardware performance impacts.
* We do **not** guarantee that information is up to date with the latest hours-old API updates.

---

## 2. User Responsibility: Sandboxed Verification

To maintain the viability of this platform, users and readers must uphold their end of the accountability agreement:

* **The Sandbox Rule**: You must test and verify any code snippet, script, command, or architectural formula in a **sandboxed, non-production test environment** before deploying it to production.
* **Direct Production Copying Prohibited**: Copying code directly from this wiki into production environments without prior verification constitutes a breach of user due diligence.
* **Critical Evaluation**: Formulas (like HNSW RAM usage or KV cache sizes) are models based on standard configurations. Real-world parameters will fluctuate, and users must calibrate these values for their specific hardware and software stacks.

---

## 3. Disclaimers & Limits of Liability

Consistent with the **Apache License 2.0** under which this wiki is licensed:

> [!CAUTION]
> **NO WARRANTY AND NO LIABILITY**
>
> * **As-Is Provision**: All content, code, tutorials, and formulas are provided "AS IS", without warranties or conditions of any kind, either express or implied.
> * **No Liability for Damages**: In no event and under no legal theory (whether in tort, contract, or otherwise) shall the project maintainers, contributors, or authors be liable to you for any damages, including direct, indirect, special, incidental, or consequential damages.
> * **Specific Exclusions**: This includes, but is not limited to, **LLM/API token cost overruns**, cloud platform hosting bills, system downtime, data loss, hardware failures, or security breaches arising out of the use or inability to use the information on this wiki.

---

## 4. Contributor Accountability

If you contribute edits or write new articles:

* **Fact-Checking**: You are responsible for ensuring your code compilations and specifications are checked against official developer documentations.
* **Safety**: Submitting intentionally malicious code, stealthy prompt injections, or telemetry bypasses will result in permanent banning from the repository and associated organizations.
* **Corrections**: If you identify a flaw, outdated metric, or syntax error, you are encouraged to submit a correction immediately using the **"Edit Page on Website"** link.
