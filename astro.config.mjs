// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import node from '@astrojs/node';

// ---- AdSense (consent-gated, env-driven, inert until a real ca-pub-... is set) ----
// The publisher ID comes from PUBLIC_ADSENSE_CLIENT (set as a BUILD env on the
// mneurix-wiki DO app). While the placeholder is in place the whole ad stack
// stays inert: no AdSense script loads, no consent banner renders. Mirrors the
// blog.mneurix.dev scaffold.
const ADSENSE_CLIENT =
	process.env.PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-0000000000000000';
const adsActive =
	ADSENSE_CLIENT.startsWith('ca-pub-') &&
	!ADSENSE_CLIENT.includes('0000000000000000');

// Inline client script: consent banner + consent-gated AdSense auto-ads loader.
// Stored consent key: mneurix-consent (same as the blog). On first visit with no
// stored choice, the banner shows; Accept -> store + load ads; Reject -> store,
// no ads. Returning accepted visitors get ads without the banner.
const consentScript = `
(function () {
  var CLIENT = ${JSON.stringify(ADSENSE_CLIENT)};
  var KEY = 'mneurix-consent';
  function loadAds() {
    if (window.__adsenseLoaded) return;
    window.__adsenseLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.setAttribute('crossorigin', 'anonymous');
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + CLIENT;
    document.head.appendChild(s);
  }
  window.__adsenseLoad = loadAds;
  function injectStyle() {
    var st = document.createElement('style');
    st.textContent = "#mneurix-consent{position:fixed;bottom:1rem;left:1rem;right:1rem;max-width:680px;margin:auto;background:var(--sl-color-bg-inline-code,#1b1f24);color:var(--sl-color-white,#e6edf3);border:1px solid var(--sl-color-border,#2a323c);border-radius:8px;padding:1rem 1.25rem;font:0.95rem system-ui,sans-serif;z-index:9999;display:flex;gap:1rem;align-items:center;flex-wrap:wrap;box-shadow:0 4px 18px rgba(0,0,0,.35)}#mneurix-consent .mc-text{flex:1;min-width:240px}#mneurix-consent .mc-text a{color:inherit;text-decoration:underline}#mneurix-consent .mc-btns{display:flex;gap:.5rem}#mneurix-consent button{border:1px solid var(--sl-color-border,#2a323c);background:transparent;color:inherit;padding:.45rem .9rem;border-radius:6px;cursor:pointer;font:inherit}#mneurix-consent button.mc-accept{background:var(--sl-color-accent,#0a6fb3);color:#fff;border-color:var(--sl-color-accent,#0a6fb3)}@media(max-width:480px){#mneurix-consent{flex-direction:column;align-items:stretch}}";
    document.head.appendChild(st);
  }
  function showBanner() {
    if (document.getElementById('mneurix-consent')) return;
    injectStyle();
    var b = document.createElement('div');
    b.id = 'mneurix-consent';
    b.innerHTML = '<div class="mc-text">This wiki shows ads via Google AdSense to support hosting. See the <a href="/guides/privacy-policy/">privacy policy</a>. You can accept or reject ad cookies.</div><div class="mc-btns"><button class="mc-accept">Accept</button><button class="mc-reject">Reject</button></div>';
    document.body.appendChild(b);
    b.querySelector('.mc-accept').addEventListener('click', function () { try { localStorage.setItem(KEY, 'accepted'); } catch (e) {} loadAds(); b.remove(); });
    b.querySelector('.mc-reject').addEventListener('click', function () { try { localStorage.setItem(KEY, 'rejected'); } catch (e) {} b.remove(); });
  }
  function init() {
    var c = null;
    try { c = localStorage.getItem(KEY); } catch (e) {}
    if (c === 'accepted') loadAds();
    else if (c === null) showBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
`;

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
			// AdSense consent-gated loader on every page (only when a real publisher ID is configured).
			head: adsActive ? [{ tag: 'script', attrs: { type: 'text/javascript' }, content: consentScript }] : [],
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
