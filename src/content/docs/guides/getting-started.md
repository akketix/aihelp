---
title: Getting Started
description: How to run the AI Help Wiki locally and start reading articles.
---

Welcome to the **AI Help Wiki**! This is a community-driven wiki providing documentation, definitions, and tutorials on Artificial Intelligence, Machine Learning, and Large Language Models.

## Running Locally

To run the wiki on your machine:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/example/aihelp.git
   cd aihelp
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the dev server**:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:4321`.

## Project Structure

- `src/content/docs/`: Where all markdown/MDX articles are stored.
  - `concepts/`: High-level concept explanations (LLMs, RAG, etc.).
  - `guides/`: Interactive guides, workflows, and procedures.
- `public/`: Static assets like logos, favicons, and the `ads.txt` file.
- `astro.config.mjs`: Central configuration file for Starlight, integrations, and sidebar layout.
- `scripts/`: Local scripts, including the AI Council PR validation pipeline.
