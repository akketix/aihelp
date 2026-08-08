// rehype-gloss — auto-wraps known glossary terms in markdown content with the
// same .gloss tooltip markup used by the <Term> component, so every blog/news
// post gets inline plain-English glosses without per-post edits.
//
// Safeguards:
//  - only glosses text nodes (never code, pre, links, or existing .gloss)
//  - word-boundary matching (term not flanked by alphanumerics) to avoid
//    mid-word matches
//  - first occurrence only per page (gloss the term once, then leave it plain)
//  - terms flagged auto:false in glossary.ts (ambiguous common words like
//    "agent") are skipped here — use them via explicit <Term> instead
import { GLOSSARY, type GlossaryTerm } from "../../data/glossary";

function escapeRe(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Eligible terms + their aliases, longest form first (prefer the longest match).
const AUTO: GlossaryTerm[] = GLOSSARY.filter((t) => t.auto !== false);
type Form = { re: string; id: string };
const forms: Form[] = [];
for (const t of AUTO) {
	for (const f of [t.term, ...(t.aliases ?? [])])
		forms.push({ re: escapeRe(f), id: t.id });
}
forms.sort((a, b) => b.re.length - a.re.length);

const combined = new RegExp(
	`(^|[^A-Za-z0-9])(${forms.map((f) => f.re).join("|")})($|[^A-Za-z0-9])`,
	"gi",
);
const idByFormLower = new Map<string, string>();
for (const t of AUTO)
	for (const f of [t.term, ...(t.aliases ?? [])])
		idByFormLower.set(f.toLowerCase(), t.id);
const byId = new Map<string, GlossaryTerm>(
	GLOSSARY.map((t) => [t.id, t] as const),
);

let counter = 0;

interface HastNode {
	type: string;
	tagName?: string;
	properties?: Record<string, unknown>;
	children?: HastNode[];
	value?: string;
}

function makeGloss(id: string, display: string): HastNode {
	const t = byId.get(id)!;
	const tipId = `gloss-tip-${id}-${++counter}`;
	return {
		type: "element",
		tagName: "span",
		properties: {
			className: ["gloss"],
			tabIndex: 0,
			role: "term",
			title: `${t.term} — ${t.plain}`,
		},
		children: [
			{
				type: "element",
				tagName: "span",
				properties: { className: ["gloss-word"] },
				children: [{ type: "text", value: display }],
			},
			{
				type: "element",
				tagName: "span",
				properties: { className: ["gloss-tip"], id: tipId, role: "tooltip" },
				children: [
					{
						type: "element",
						tagName: "strong",
						properties: {},
						children: [{ type: "text", value: `${t.term}. ` }],
					},
					{ type: "text", value: t.plain },
				],
			},
		],
	};
}

function glossText(value: string, used: Set<string>): HastNode[] {
	const out: HastNode[] = [];
	let last = 0;
	combined.lastIndex = 0;
	let m: RegExpExecArray | null;
	while ((m = combined.exec(value)) !== null) {
		const pre = m[1] ?? "";
		const matched = m[2] ?? "";
		const id = idByFormLower.get(matched.toLowerCase());
		if (!id || used.has(id)) {
			// leave as plain text (will be picked up by the next slice / remainder)
			continue;
		}
		const startText = value.slice(last, m.index) + pre;
		if (startText) out.push({ type: "text", value: startText });
		out.push(makeGloss(id, matched));
		used.add(id);
		last = m.index + pre.length + matched.length; // right after the matched word (before the suffix boundary)
	}
	if (last < value.length) out.push({ type: "text", value: value.slice(last) });
	return out;
}

const SKIP_TAGS = new Set([
	"code",
	"pre",
	"a",
	"script",
	"style",
	"kbd",
	"samp",
]);

function hasClass(node: HastNode | undefined, cls: string): boolean {
	const c = node?.properties?.className;
	return Array.isArray(c) && c.includes(cls);
}

function walk(node: HastNode, used: Set<string>): void {
	const children = node.children;
	if (!children) return;
	const next: HastNode[] = [];
	for (const child of children) {
		if (child.type === "element") {
			if (
				SKIP_TAGS.has(child.tagName ?? "") ||
				hasClass(child, "gloss") ||
				hasClass(child, "gloss-tip")
			) {
				next.push(child);
				continue;
			}
			walk(child, used);
			next.push(child);
		} else if (child.type === "text" && child.value && child.value.trim()) {
			next.push(...glossText(child.value, used));
		} else {
			next.push(child);
		}
	}
	node.children = next;
}

export function rehypeGloss() {
	return (tree: any) => {
		counter = 0;
		const used = new Set<string>();
		walk(tree as HastNode, used);
	};
}
