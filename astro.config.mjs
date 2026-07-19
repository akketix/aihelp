// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	output: 'server',
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
			sidebar: [
              {
                  label: 'Core Concepts',
                  items: [
                      { label: 'Agentic-First Wiki', slug: 'concepts/agentic-first' },
                      { label: 'Large Language Models', slug: 'concepts/llms' },
                      { label: 'Retrieval-Augmented Generation', slug: 'concepts/rag' },
                      { label: 'Prompt Engineering', slug: 'concepts/prompt-engineering' },
                  ],
              },
              {
                  label: 'Contributing & Policies',
                  items: [
                      { label: 'Getting Started', slug: 'guides/getting-started' },
                      { label: 'How to Contribute', slug: 'guides/contributing' },
                      { label: 'Usage & Due Diligence Policy', slug: 'guides/usage-policy' },
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