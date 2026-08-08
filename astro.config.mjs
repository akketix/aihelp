// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import node from '@astrojs/node';
import { rehypeGloss } from './src/lib/gloss/rehype-gloss.ts';

// ---- AdSense (env-driven; inert until a real ca-pub-... is set) ----
// Publisher ID from PUBLIC_ADSENSE_CLIENT (BUILD env on the mneurix-wiki DO app).
// Consent for EEA/UK visitors is handled by Google's CMP (enabled in the AdSense
// dashboard), which is embedded in adsbygoogle.js — so we load the script directly
// and Google shows the consent message where required. No custom consent banner.
const ADSENSE_CLIENT =
  process.env.PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-4548561758943925';
const adsActive =
  ADSENSE_CLIENT.startsWith('ca-pub-') &&
  !ADSENSE_CLIENT.includes('0000000000000000');

// https://astro.build/config
export default defineConfig({
  site: 'https://aihelp.mneurix.dev',
  output: 'server',
  security: {
    checkOrigin: false,
  },
  markdown: {
    rehypePlugins: [rehypeGloss],
  },
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    starlight({
      title: 'AI Help Wiki',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/akketix/aihelp' }],
      editLink: {
        baseUrl: 'https://github.com/akketix/aihelp/edit/master/',
      },
      components: {
        EditLink: './src/components/CustomEditLink.astro',
      },
      customCss: ['./src/styles/gloss.css'],
      head: [
        {
          tag: 'script',
          attrs: {},
          content: `document.addEventListener("click",function(e){var t=e.target instanceof Element?e.target.closest(".gloss"):null;document.querySelectorAll(".gloss.is-open").forEach(function(el){if(el!==t)el.classList.remove("is-open");});if(t&&window.matchMedia("(pointer: coarse)").matches)t.classList.toggle("is-open");});document.addEventListener("keydown",function(e){if(e.key==="Escape")document.querySelectorAll(".gloss.is-open").forEach(function(el){el.classList.remove("is-open");});});`,
        },
        {
          tag: 'meta',
          attrs: {
            name: 'google-adsense-account',
            content: 'ca-pub-4548561758943925',
          },
        },
        ...(adsActive
          ? [
              {
                tag: 'script',
                attrs: {
                  src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CLIENT,
                  async: true,
                  crossorigin: 'anonymous',
                },
              },
            ]
          : []),
      ],
      sidebar: [
        {
          label: 'Core Concepts',
          items: [
            { label: 'Agentic-First Wiki', slug: 'concepts/agentic-first' },
            { label: 'Large Language Models', slug: 'concepts/llms' },
            { label: 'Retrieval-Augmented Generation', slug: 'concepts/rag' },
            { label: 'Prompt Engineering', slug: 'concepts/prompt-engineering' },
            { label: 'Agent Design Patterns', slug: 'concepts/agent-design-patterns' },
            { label: 'Session State & Memory', slug: 'concepts/session-memory-dbs' },
            { label: 'Game Engine Bridges', slug: 'concepts/game-engine-bridges' },
            { label: 'Soly Loop Engineering', slug: 'concepts/loop-engineering' },
            { label: 'Security Guardrails', slug: 'concepts/security-guardrails' },
            { label: 'Agent Integration Architectures', slug: 'concepts/integration-architectures' },
          ],
        },
        {
          label: 'Contributing & Policies',
          items: [
            { label: 'Getting Started', slug: 'guides/getting-started' },
            { label: 'Agent Token Cost Calculator', slug: 'guides/agent-token-cost-calculator' },
            { label: 'Local LLM VRAM Optimization', slug: 'guides/local-llm-vram-optimization' },
            { label: 'How to Contribute', slug: 'guides/contributing' },
            { label: 'Usage & Due Diligence Policy', slug: 'guides/usage-policy' },
            { label: 'Privacy Policy', slug: 'guides/privacy-policy' },
            { label: 'DigitalOcean Deployment', slug: 'guides/deployment-walkthrough' },
          ],
        },
        {
          label: 'Reference',
          items: [{ autogenerate: { directory: 'reference' } }],
        },
      ],
    }),
  ],
});