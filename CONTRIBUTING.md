# Contributing to the AI Help Wiki

Thank you for your interest in contributing to the AI Help Wiki! This project is a community-owned knowledge base dedicated to artificial intelligence.

We run a **Docs-as-Code** workflow, which means all content updates are made through standard Git pull requests (PRs).

## In-Browser Contributions

If you want to suggest a quick correction or edit:
1. Navigate to the page on the wiki.
2. Click the **"Edit this page"** button at the bottom of the article.
3. This will open the GitHub (or Gitea) web editor for that specific file.
4. Make your changes and submit a new branch and Pull Request directly from the browser.

## Local Development Setup

If you want to add multiple files or test locally:
1. Fork and clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local preview server (`http://localhost:4321`).
4. Run `npm run lint` to verify that your Markdown formatting is clean.

## Formatting Guidelines

To pass the automated checks:
- All pages must start with standard YAML frontmatter containing `title` and `description`:
  ```yaml
  ---
  title: Your Topic Name
  description: A short one-sentence description of the topic.
  ---
  ```
- Headings must be surrounded by blank lines.
- Fenced code blocks must have a specified language (e.g. `python`, `bash`, `text`).
- No hard tabs (`\t`) are allowed in markdown files. Use spaces instead.

## The AI Council Review

Once you open a Pull Request, an automated **AI Council** will review your changes and post a summary report. The council consists of:
1. **North Star Guardian**: Verifies that the topic fits our vision (educational, objective, and focused on AI concepts rather than paid tool advertisements).
2. **Ground Truth Validator**: Uses search grounding to verify the technical accuracy of code blocks, versions, and claims.
3. **Structural Gatekeeper**: Checks metadata syntax and formatting rules.

You will see their report as a comment on your PR within a few minutes. If they request any corrections, please update your PR before requesting final human review from the repository maintainer.
