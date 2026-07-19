# AI Help Wiki

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

Welcome to the **AI Help Wiki** repository. This is a static, Docs-as-Code wiki serving as a common goods repository for artificial intelligence definitions, workflows, and concepts. 

The site is built with Astro Starlight, optimized for fast delivery, complete markdown structure, out-of-the-box search, and compatibility with static CDN hosting like Cloudflare Pages.

## 🚀 Features

- **High Performance**: Zero client-side JS by default, yielding fast load times.
- **Search & Navigation**: Multi-level sidebar navigation and lightning-fast client-side search.
- **Ad Network Ready**: Natively serves `public/ads.txt` in the domain root.
- **AI PR Reviews**: Automatically evaluates Pull Requests with three specialized LLM agents (North Star, Ground Truth, and Structural Gatekeeper).
- **Markdown Linting**: Continuous integration ensures consistent formatting across all contributions.

## 🧞 Local Commands

Run all commands from the root of the project:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs project dependencies |
| `npm run dev` | Starts the local dev server at `http://localhost:4321` |
| `npm run build` | Compiles the production site into `./dist/` |
| `npm run lint` | Runs the markdown formatter check |
| `npm run ai-council` | Runs the AI PR evaluation review script locally |

## 🛠️ Folder Structure

```
.
├── .github/workflows/
│   └── ci.yml             # GitHub/Gitea CI Actions pipeline
├── public/
│   └── ads.txt            # Ad network verification file
├── scripts/
│   └── ai-council-review.js # AI Council PR review engine
├── src/
│   ├── assets/            # Static media (images, logo)
│   └── content/
│       └── docs/          # Wiki pages (.md and .mdx files)
├── .markdownlint.json     # Linter rules configuration
├── astro.config.mjs       # Central Astro & Starlight config
├── package.json           # Scripts and package manifests
└── tsconfig.json          # TypeScript configurations
```

## 🤝 Contributing

Contributions are semi-open! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) to understand the workflow, formatting guidelines, and the AI PR review process before submitting a change.
