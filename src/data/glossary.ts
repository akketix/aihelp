// Single source of truth for plain-English term definitions across the AI Help
// Wiki (aihelp.mneurix.dev). Used by <Term id="…"> (inline hover/focus tooltips),
// <GlossText>, the /reference/glossary page, and the rehype-gloss plugin
// (auto-applied to every doc page).
//
// Convention: keep the real term, add a plain gloss — don't dumb down.

export type GlossaryCategory =
	| "AI & LLMs"
	| "Agents & RAG"
	| "Local AI & hardware"
	| "Identity & credentials"
	| "Engines & dev";

export interface GlossaryTerm {
	id: string;
	term: string;
	plain: string;
	category: GlossaryCategory;
	aliases?: string[];
	/** Eligible for automatic glossing in posts. Default true; set false for ambiguous common words. */
	auto?: boolean;
}

export const GLOSSARY: GlossaryTerm[] = [
	// ---- AI & LLMs -----------------------------------------------------
	{
		id: "llm",
		term: "LLM",
		category: "AI & LLMs",
		aliases: ["large language model", "large language models"],
		plain:
			"Large Language Model — an AI trained on huge amounts of text to predict the next word, which lets it write, summarize, code, and answer questions.",
	},
	{
		id: "embedding",
		term: "embedding",
		category: "AI & LLMs",
		plain:
			"A numerical representation of text as a list of numbers, so texts with similar meanings sit close together — the basis of search and retrieval.",
	},
	{
		id: "token",
		term: "token",
		category: "AI & LLMs",
		plain:
			"A chunk of text (a word piece) that a model reads or writes. Models count usage and cost in tokens, not words.",
	},
	{
		id: "context-window",
		term: "context window",
		category: "AI & LLMs",
		plain:
			"How much text a model can consider at once (input + output). Bigger windows handle longer documents but cost more.",
	},
	{
		id: "hallucination",
		term: "hallucination",
		category: "AI & LLMs",
		plain:
			"When a model confidently states something that isn't true — it generates plausible-sounding but wrong content.",
	},
	{
		id: "fine-tuning",
		term: "fine-tuning",
		category: "AI & LLMs",
		plain:
			"Further training of a model on specific data so it gets better at a particular task or style.",
	},
	{
		id: "quantization",
		term: "quantization",
		category: "AI & LLMs",
		plain:
			"Compressing a model to use less memory (e.g. Q4), trading a little accuracy for the ability to run on smaller hardware.",
	},
	{
		id: "inference",
		term: "inference",
		category: "AI & LLMs",
		plain:
			"Running a trained model to produce an output — the step that happens when you ask it something.",
	},
	{
		id: "temperature",
		term: "temperature",
		category: "AI & LLMs",
		plain:
			"A setting controlling how random the output is: low = focused and predictable, high = more varied and creative.",
	},
	{
		id: "system-prompt",
		term: "system prompt",
		category: "AI & LLMs",
		plain:
			"The hidden instructions that set a model's role and rules for a conversation, before the user's messages.",
	},
	{
		id: "grounding",
		term: "grounding",
		category: "AI & LLMs",
		plain:
			"Tying a model's answer to real source material so it's less likely to make things up.",
	},

	// ---- Agents & RAG --------------------------------------------------
	{
		id: "agent",
		term: "agent",
		category: "Agents & RAG",
		plain:
			"An AI program that can take actions — call tools, run steps, make decisions — toward a goal, not just answer one question.",
	},
	{
		id: "rag",
		term: "RAG",
		category: "Agents & RAG",
		plain:
			"Retrieval-Augmented Generation — grounding an AI's answers in your own documents so it draws on real sources instead of guessing.",
	},
	{
		id: "multi-agent-harness",
		term: "multi-agent harness",
		category: "Agents & RAG",
		plain:
			"A system that coordinates several AI agents working together on a task, each with a specialized job.",
	},
	{
		id: "tool-calling",
		term: "tool calling",
		category: "Agents & RAG",
		plain:
			"Letting a model request an action (run code, search, call an API) rather than only producing text.",
	},
	{
		id: "prompt-engineering",
		term: "prompt engineering",
		category: "Agents & RAG",
		plain:
			"Crafting the instructions given to a model to get better, more reliable outputs.",
	},

	// ---- Local AI & hardware ------------------------------------------
	{
		id: "local-first",
		term: "local-first",
		category: "Local AI & hardware",
		plain:
			"Software that keeps your data on your own machine by default, rather than on a company's servers.",
	},
	{
		id: "self-hostable",
		term: "self-hostable",
		category: "Local AI & hardware",
		plain:
			"Software you run on your own server or computer, so you control it — instead of logging into a vendor's hosted version.",
	},
	{
		id: "vram",
		term: "VRAM",
		category: "Local AI & hardware",
		plain:
			"Video RAM — memory on your graphics card; running local AI models needs enough of it to hold the model.",
	},
	{
		id: "gguf",
		term: "GGUF",
		category: "Local AI & hardware",
		plain:
			"A file format for running large AI models locally on your own hardware, often compressed (quantized) to fit in less memory.",
	},
	{
		id: "wasm",
		term: "WASM",
		category: "Local AI & hardware",
		plain:
			"WebAssembly — fast, safe near-native-speed code that runs inside a browser.",
	},
	{
		id: "ollama",
		term: "Ollama",
		category: "Local AI & hardware",
		plain: "A tool for running large language models locally on your own machine.",
	},

	// ---- Identity & credentials ---------------------------------------
	{
		id: "did-web",
		term: "did:web",
		category: "Identity & credentials",
		plain:
			"A way to anchor a digital identity to your own web domain — anyone can verify it by reading a file on your site.",
	},
	{
		id: "verifiable-credential",
		term: "verifiable credential",
		category: "Identity & credentials",
		plain:
			"A digital claim anyone can check is genuine and really came from the issuer, without calling the issuer.",
	},
	{
		id: "sd-jwt",
		term: "SD-JWT",
		category: "Identity & credentials",
		plain:
			"Selective-Disclosure JWT — a format that lets a holder reveal only the fields needed (e.g. prove age, not birthdate).",
	},
	{
		id: "ed25519",
		term: "Ed25519",
		category: "Identity & credentials",
		plain:
			"A fast, secure digital-signature method used to prove a credential really came from its claimed source.",
	},

	// ---- Engines & dev -------------------------------------------------
	{
		id: "source-available",
		term: "source-available",
		category: "Engines & dev",
		plain:
			"Code you can read and inspect (and usually extend for your own use), even if it isn't fully open-source.",
	},
	{
		id: "elv2",
		term: "ELv2",
		category: "Engines & dev",
		plain:
			"Elastic License 2.0 — use, modify, and self-host freely; don't resell it as a competing hosted service.",
	},
];

export function termById(id: string): GlossaryTerm {
	const t = GLOSSARY.find((x) => x.id === id);
	if (!t) throw new Error(`Unknown glossary id: "${id}". Add it to src/data/glossary.ts.`);
	return t;
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
	"AI & LLMs",
	"Agents & RAG",
	"Local AI & hardware",
	"Identity & credentials",
	"Engines & dev",
];

export function termsByCategory(): Array<{ category: GlossaryCategory; terms: GlossaryTerm[] }> {
	return GLOSSARY_CATEGORIES.map((category) => ({
		category,
		terms: GLOSSARY.filter((t) => t.category === category),
	}));
}