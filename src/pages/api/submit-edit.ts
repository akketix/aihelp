import type { APIRoute } from 'astro';

export const prerender = false;

// Configure Gitea variables (Gitea API matches GitHub API for contents/pulls)
const GITEA_API_URL = process.env.GITEA_API_URL || import.meta.env.GITEA_API_URL || 'http://localhost:3000/api/v1';
const GITEA_REPO = process.env.GITEA_REPO || import.meta.env.GITEA_REPO || 'owner/repo';
const GITEA_TOKEN = process.env.GITEA_TOKEN || import.meta.env.GITEA_TOKEN;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { filePath, content, commitMessage } = await request.json();

    if (!filePath || !content || !commitMessage) {
      return new Response(
        JSON.stringify({ message: 'Missing required parameters: filePath, content, or commitMessage' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!GITEA_TOKEN) {
      console.warn('⚠️ GITEA_TOKEN is not configured. Running in Mock API Mode.');
      // Simulate success for local testing/mock environments
      const mockPrNumber = Math.floor(Math.random() * 100) + 1;
      return new Response(
        JSON.stringify({
          message: 'Mock submission success.',
          prNumber: mockPrNumber,
          prUrl: `${GITEA_API_URL.replace('/api/v1', '')}/${GITEA_REPO}/pulls/${mockPrNumber}`
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const headers = {
      'Authorization': `token ${GITEA_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'AI-Wiki-OnSite-Editor'
    };

    // 1. Get the latest commit SHA of the main branch (to branch off from)
    // and the file's current SHA (to commit changes)
    let fileSha = '';
    const fileUrl = `${GITEA_API_URL}/repos/${GITEA_REPO}/contents/${filePath}?ref=main`;
    
    try {
      const fileRes = await fetch(fileUrl, { headers });
      if (fileRes.ok) {
        const fileData = await fileRes.json();
        fileSha = fileData.sha;
      }
    } catch (err) {
      console.warn(`File ${filePath} does not exist yet or content fetch failed. Will attempt to create a new file.`);
    }

    // 2. Create a unique branch name
    const branchName = `edit-patch-${Date.now()}`;
    const createBranchUrl = `${GITEA_API_URL}/repos/${GITEA_REPO}/branches`;
    
    const branchRes = await fetch(createBranchUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        new_branch_name: branchName,
        old_branch_name: 'main'
      })
    });

    if (!branchRes.ok) {
      const errText = await branchRes.text();
      throw new Error(`Failed to create branch: ${branchRes.statusText} (${errText})`);
    }

    // 3. Commit the updated file content (encoded in Base64) to the new branch
    const contentBase64 = Buffer.from(content).toString('base64');
    const commitFileUrl = `${GITEA_API_URL}/repos/${GITEA_REPO}/contents/${filePath}`;
    
    const commitBody: any = {
      branch: branchName,
      content: contentBase64,
      message: commitMessage,
      author: {
        name: 'Wiki Contributor',
        email: 'anonymous@wiki.local'
      }
    };
    
    if (fileSha) {
      commitBody.sha = fileSha;
    }

    const commitRes = await fetch(commitFileUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(commitBody)
    });

    if (!commitRes.ok) {
      const errText = await commitRes.text();
      throw new Error(`Failed to commit file: ${commitRes.statusText} (${errText})`);
    }

    // 4. Create the Pull Request (Change Request)
    const prUrl = `${GITEA_API_URL}/repos/${GITEA_REPO}/pulls`;
    
    const prRes = await fetch(prUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        base: 'main',
        head: branchName,
        title: commitMessage,
        body: `### On-Site Wiki Contribution\n\nThis is an automated contribution submitted anonymously from the wiki interface.\n\n**Proposed Changes:**\n* File modified: \`${filePath}\`\n* Summary: ${commitMessage}`
      })
    });

    if (!prRes.ok) {
      const errText = await prRes.text();
      throw new Error(`Failed to create Pull Request: ${prRes.statusText} (${errText})`);
    }

    const prData = await prRes.json();

    return new Response(
      JSON.stringify({
        message: 'Pull Request created successfully.',
        prNumber: prData.number,
        prUrl: prData.html_url
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Error processing wiki edit submission:', error);
    return new Response(
      JSON.stringify({ message: error.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
