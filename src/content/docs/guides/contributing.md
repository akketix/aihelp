---
title: How to Contribute
description: Guidelines for submitting Pull Requests and writing documentation for the AI Help Wiki.
---

We welcome contributions from the community! Because this site is built using a **Docs-as-Code** model, all changes go through Git Pull Requests.

## Contribution Workflow

### 1. Click "Edit this page"

At the bottom of every page, there is an **Edit this page** button. Clicking this will direct you to GitHub's web editor for that specific file. Alternatively, you can fork the repository and work locally.

### 2. Run Automated Checks

When you submit a Pull Request (PR), our automated pipeline runs two verification steps:

1. **Markdown Linter**: Ensures that your markdown is clean and correctly formatted.
2. **AI Council Review**: A panel of specialized LLM agents reviews your PR to verify:
   - **North Star Alignment**: Does the content belong in the wiki? Is it objective and non-promotional?
   - **Ground Truth**: Are there any factual errors, outdated versions, or hallucinations?
   - **Structure**: Are the links valid and is the metadata (frontmatter) correctly configured?

### 3. Review & Merge

A maintainer will review the AI Council report and your changes. If everything looks good, it will be merged and instantly deployed to the live site.

## Writing Standards

- **Tone**: Professional, informative, and objective. Avoid hype or vendor-specific marketing.
- **Accuracy**: Provide references or links to official docs/research papers for technical claims.
- **Formatting**: Keep paragraphs short, use bold text for emphasis, and use code blocks for command line or code examples.
