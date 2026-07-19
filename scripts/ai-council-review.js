import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.log('⚠️ GEMINI_API_KEY not found. Running in Dry Run / Mock Mode.');
}

// 1. Get List of Changed Files
function getChangedFiles() {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    return args.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  }

  try {
    // Detect changes compared to main branch or previous commit
    const output = execSync('git diff --name-only origin/main...HEAD || git diff --name-only HEAD~1', { encoding: 'utf8' });
    return output
      .split('\n')
      .map(f => f.trim())
      .filter(f => f && (f.endsWith('.md') || f.endsWith('.mdx')));
  } catch (error) {
    console.warn('⚠️ Could not run git diff. Defaulting to all markdown files in src/content/docs/');
    // If not a git repo or git fails, look for files in docs directory recursively
    // A simplified fallback for testing
    return [];
  }
}

// 2. Define AI Agent Prompts
const AGENTS = {
  northStar: {
    name: 'North Star Guardian (Scope & Tone)',
    prompt: `You are the "North Star" Guardian for a community-driven AI Wiki. 
Your mission is to evaluate if the contribution fits the wiki's long-term vision, scope, and tone guidelines.

Wiki Scope: Core AI concepts, tools, methodologies, and tutorial guides. We avoid commercial promotion of paid tools unless they are industry standards.
Tone: Objective, neutral, educational, and professional.

Analyze the following file content and state:
1. Is it within scope? (YES/NO)
2. Does the tone match? (YES/NO)
3. Any specific improvements? (Be concise and actionable).`,
  },
  groundTruth: {
    name: 'Ground Truth Validator (Technical Accuracy)',
    prompt: `You are the Ground Truth Validator for a community-driven AI Wiki.
Your mission is to verify the factual and technical accuracy of the contribution. You should identify hallucinations, outdated API parameters, mathematical errors, or incorrect assumptions.
Use Google Search tool to cross-reference statements with official documentation or reputable sources.

Analyze the following file content and state:
1. Are there any technical inaccuracies? (YES/NO)
2. Detailed list of inaccuracies or warnings, with corrected values/code.
3. Suggest links to official documentation if relevant.`,
    useSearch: true,
  },
  gatekeeper: {
    name: 'Structural Gatekeeper (Metadata & Formatting)',
    prompt: `You are the Structural Gatekeeper.
Your mission is to ensure the file is well-structured and follows Astro Starlight conventions:
- Must have valid Frontmatter block (between --- markers) containing "title" and "description".
- Must use standard Markdown heading hierarchies.
- Code blocks must declare a language (e.g. \`\`\`python).

Analyze the following file content and state:
1. Is the structure valid? (YES/NO)
2. Any formatting or structure violations?`,
  }
};

// 3. Evaluate a File
async function evaluateFile(filePath) {
  console.log(`🤖 Evaluating file: ${filePath}`);
  if (!existsSync(filePath)) {
    return { filePath, error: 'File does not exist' };
  }

  const content = readFileSync(filePath, 'utf8');
  const results = {};

  if (!ai) {
    // Return mock results in dry run mode
    return {
      filePath,
      mock: true,
      northStar: { pass: true, comment: 'Mock Pass: Tone looks objective and fits within scope.' },
      groundTruth: { pass: true, comment: 'Mock Pass: Technical details appear accurate.' },
      gatekeeper: { pass: true, comment: 'Mock Pass: Frontmatter and headings are valid.' }
    };
  }

  for (const [key, agent] of Object.entries(AGENTS)) {
    try {
      const config = {};
      if (agent.useSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${agent.prompt}\n\n--- FILE PATH: ${filePath} ---\n\n${content}`,
        config,
      });

      const text = response.text || '';
      const pass = !text.toLowerCase().includes('inaccuracies? yes') && 
                   !text.toLowerCase().includes('within scope? no') && 
                   !text.toLowerCase().includes('structure valid? no') &&
                   !text.toLowerCase().includes('tone match? no');

      results[key] = { pass, comment: text };
    } catch (err) {
      console.error(`❌ Error running agent ${agent.name}:`, err);
      results[key] = { pass: false, error: err.message };
    }
  }

  return { filePath, mock: false, ...results };
}

// 4. Generate Report
function generateMarkdownReport(evaluations) {
  let report = `# 🤖 AI Council Evaluation Report\n\n`;
  
  if (evaluations.length === 0) {
    report += `ℹ️ No markdown files were modified in this change. Everything is clear!\n`;
    return report;
  }

  let totalWarnings = 0;

  for (const ev of evaluations) {
    report += `## File: [\`${ev.filePath}\`](../edit/main/${ev.filePath})\n\n`;
    
    if (ev.error) {
      report += `❌ **Error:** ${ev.error}\n\n`;
      totalWarnings++;
      continue;
    }

    if (ev.mock) {
      report += `ℹ️ *Dry Run Mode: Displaying simulated passes for testing.*\n\n`;
    }

    const sections = [
      { key: 'northStar', name: 'Scope & Tone (North Star)' },
      { key: 'groundTruth', name: 'Technical Accuracy (Ground Truth)' },
      { key: 'gatekeeper', name: 'Metadata & Formatting (Structure)' }
    ];

    for (const sec of sections) {
      const res = ev[sec.key];
      const status = res.pass ? '✅ Pass' : '⚠️ Warning';
      if (!res.pass) totalWarnings++;

      report += `### ${sec.name}: ${status}\n\n`;
      report += `${res.comment || res.error || 'No comment.'}\n\n`;
    }

    report += `---\n\n`;
  }

  report += `### Summary\n`;
  if (totalWarnings > 0) {
    report += `⚠️ The AI Council found **${totalWarnings} warning(s)** that should be addressed before merging.\n`;
  } else {
    report += `✅ All checks passed! Ready for maintainer review.\n`;
  }

  return report;
}

// Main execution
async function main() {
  const files = getChangedFiles();
  console.log(`🔍 Found ${files.length} changed markdown files.`);

  // If no files changed and we are running in dry run/local mode, test with a sample file
  let filesToEvaluate = files;
  if (files.length === 0) {
    const sample = 'src/content/docs/concepts/llms.md';
    if (existsSync(sample)) {
      console.log(`ℹ️ No changed files detected. Testing with sample: ${sample}`);
      filesToEvaluate = [sample];
    } else {
      console.log('❌ No files found to evaluate.');
      process.exit(0);
    }
  }

  const evaluations = [];
  for (const file of filesToEvaluate) {
    const res = await evaluateFile(file);
    evaluations.push(res);
  }

  const report = generateMarkdownReport(evaluations);
  console.log('\n--- AI COUNCIL REPORT ---');
  console.log(report);
  console.log('-------------------------\n');

  // Save report to file
  writeFileSync('ai-council-report.md', report, 'utf8');
  console.log('💾 Saved report to ai-council-report.md');

  // Post to PR if running in a GitHub Actions environment
  await postCommentToPR(report);
}

async function postCommentToPR(report) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const apiUrl = process.env.GITHUB_API_URL || 'https://api.github.com';

  if (!token || !repo || !eventPath) {
    console.log('ℹ️ Skipping PR comment posting (not running in CI/PR environment).');
    return;
  }

  try {
    const event = JSON.parse(readFileSync(eventPath, 'utf8'));
    const prNumber = event.pull_request ? event.pull_request.number : null;

    if (!prNumber) {
      console.log('ℹ️ Event is not a pull request. Skipping comment.');
      return;
    }

    console.log(`💬 Posting comment to PR #${prNumber} on ${apiUrl}...`);
    const endpoint = `${apiUrl}/repos/${repo}/issues/${prNumber}/comments`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'AI-Council-Reviewer'
      },
      body: JSON.stringify({ body: report })
    });

    if (res.ok) {
      console.log('✅ Successfully posted PR comment!');
    } else {
      const errText = await res.text();
      console.error(`❌ Failed to post PR comment. Status: ${res.status}. Response: ${errText}`);
    }
  } catch (error) {
    console.error('❌ Error posting PR comment:', error);
  }
}

main().catch(err => {
  console.error('Fatal error in AI Council main loop:', err);
  process.exit(1);
});
