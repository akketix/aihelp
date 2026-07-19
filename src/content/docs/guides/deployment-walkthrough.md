---
title: DigitalOcean App Platform Deployment
description: Step-by-step quest walkthrough to deploy the Astro Wiki on DigitalOcean.
---

This guide provides a step-by-step walkthrough to deploy your Astro Wiki on the DigitalOcean App Platform as a dynamic Node.js web service.

---

## Prerequisites

Before starting, ensure you have:

1. A **GitHub repository** containing the wiki code (e.g., `akketix/aihelp`).
2. A **DigitalOcean account**.
3. A custom domain (e.g., `mneurix.dev`) managed by Namecheap, Cloudflare, or GoDaddy.

---

## Step 1: Astro Configuration

To support backend API routes (like the on-site editor `/api/submit-edit`), the wiki must run as a dynamic Node.js server rather than a purely static build.

In your `astro.config.mjs`, verify the `@astrojs/node` adapter is configured:

```javascript
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    starlight({
      title: 'AI Help Wiki',
      // ...
    }),
  ],
});
```

---

## Step 2: Write the App Specification

Create a file named `app-spec.json` at the root of your repository to programmatically configure the App Platform deployment:

```json
{
  "name": "mneurix-wiki",
  "region": "fra",
  "domains": [
    {
      "domain": "aihelp.mneurix.dev",
      "type": "PRIMARY"
    }
  ],
  "features": [
    "buildpack-stack=ubuntu-22"
  ],
  "ingress": {
    "rules": [
      {
        "component": { "name": "wiki" },
        "match": { "path": { "prefix": "/" } }
      }
    ]
  },
  "services": [
    {
      "name": "wiki",
      "github": {
        "repo": "akketix/aihelp",
        "branch": "master",
        "deploy_on_push": true
      },
      "build_command": "npm install && npm run build",
      "run_command": "node dist/server/entry.mjs",
      "environment_slug": "node-js",
      "envs": [
        {
          "key": "PORT",
          "scope": "RUN_AND_BUILD_TIME",
          "value": "8080"
        },
        {
          "key": "HOST",
          "scope": "RUN_AND_BUILD_TIME",
          "value": "0.0.0.0"
        }
      ],
      "http_port": 8080,
      "instance_count": 1,
      "instance_size_slug": "basic-xxs"
    }
  ]
}
```

---

## Step 3: Launch on DigitalOcean

Using the `doctl` command-line utility or the DigitalOcean API, submit the app specification to spin up the service:

```bash
doctl apps create --spec app-spec.json
```

DigitalOcean will:

1. Connect to GitHub using OAuth.
2. Clone your repository.
3. Build the node container (installs node modules and executes `npm run build`).
4. Start the server on port `8080`.
5. Allocate a default subdomain (e.g., `mneurix-wiki-8nfsu.ondigitalocean.app`).

---

## Step 4: Configure DNS Routing

To bind your custom subdomain `aihelp.mneurix.dev`:

1. Copy the default app domain allocated by DigitalOcean (e.g., `mneurix-wiki-8nfsu.ondigitalocean.app`).
2. Log into your domain registrar (e.g., Namecheap or Cloudflare DNS settings).
3. Add a new **CNAME** record:
   - **Type**: `CNAME`
   - **Host**: `aihelp`
   - **Target / Value**: `mneurix-wiki-8nfsu.ondigitalocean.app`
   - **TTL**: `Automatic`

Once DNS propagates, DigitalOcean will verify the record, auto-provision an SSL certificate, and serve the wiki at `https://aihelp.mneurix.dev`.
