// desktop/renderer/app.js
// HermesShield Desktop IDE — Renderer Logic

const API_BASE = 'http://localhost:8000/api/v1';

let activeProject = {
  folderName: 'Project Titan',
  folderPath: 'Bundled Workspace Sample',
  detectedFiles: ['requirements.txt', 'package.json'],
  combinedContext: '',
};

let currentBriefingMarkdown = '';

// Predefined workflow recipes (dynamically bound to active project)
const RECIPES = {
  architecture_sync: {
    getPrompt: (name) => `Audit all current dependencies for ${name}, scrub PII via privacy airlock, verify live Mitre security advisories, and prepare a technical briefing with mandatory rollback plan.`,
    label: 'Security & Bug Scan',
  },
  pr_review: {
    getPrompt: (name) => `Conduct a zero-trust PR security review for ${name}. Audit authentication packages against CVE advisories and verify framework patch levels.`,
    label: 'Pull Request Review',
  },
  health_check: {
    getPrompt: (name) => `Perform an operational dependency health check on ${name}, inspect potential vulnerabilities, and generate a step-by-step rollback procedure.`,
    label: 'Health & Rollback Plan',
  },
};

// DOM Elements
const btnSelectFolder = document.getElementById('btn-select-folder');
const folderNameLabel = document.getElementById('folder-name-label');
const folderSubLabel = document.getElementById('folder-sub-label');
const detectedFilesList = document.getElementById('detected-files-list');
const customInstruction = document.getElementById('custom-instruction');
const btnRun = document.getElementById('btn-run-analysis');
const btnRunText = document.getElementById('btn-run-text');
const placeholderScreen = document.getElementById('placeholder-screen');
const reportContent = document.getElementById('report-content');
const metricStatus = document.getElementById('metric-status');
const backendStatusText = document.getElementById('backend-status-text');
const btnCopy = document.getElementById('btn-copy-report');
const copyBtnLabel = document.getElementById('copy-btn-label');
const btnSave = document.getElementById('btn-save-report');
const statusWorkspaceName = document.getElementById('status-workspace-name');

// 1. Check Backend Connectivity
async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      const data = await res.json();
      backendStatusText.textContent = data.is_fallback ? 'Engine: Fallback Mode' : 'Engine: Live (Connected)';
      backendStatusText.style.color = data.is_fallback ? '#f59e0b' : '#10b981';
    } else {
      backendStatusText.textContent = 'Engine Offline (Start Backend)';
      backendStatusText.style.color = '#ef4444';
    }
  } catch (err) {
    backendStatusText.textContent = 'Engine Offline (Port 8000)';
    backendStatusText.style.color = '#ef4444';
  }
}

// 2. Folder Selection using Native OS Picker
btnSelectFolder.addEventListener('click', async () => {
  if (!window.hermesDesktop || !window.hermesDesktop.selectDirectory) {
    alert('Folder picker is only available inside the native desktop app window.');
    return;
  }

  const result = await window.hermesDesktop.selectDirectory();
  if (result) {
    activeProject = result;
    folderNameLabel.textContent = result.folderName;
    folderSubLabel.textContent = result.folderPath;
    statusWorkspaceName.textContent = `Workspace: ${result.folderName}`;

    // Update detected badges
    detectedFilesList.innerHTML = '';
    if (result.detectedFiles.length > 0) {
      result.detectedFiles.forEach((file) => {
        const badge = document.createElement('span');
        badge.className = 'detected-badge';
        badge.textContent = file.name;
        detectedFilesList.appendChild(badge);
      });
      customInstruction.value = `Audit all dependencies in ${result.folderName} (${result.detectedFiles.map((f) => f.name).join(', ')}), check for live CVE advisories, and construct a rollback plan.`;
    } else {
      const badge = document.createElement('span');
      badge.className = 'detected-badge';
      badge.textContent = 'No manifests detected';
      detectedFilesList.appendChild(badge);
      customInstruction.value = `Audit all dependencies in ${result.folderName}, check for live CVE advisories, and construct a rollback plan.`;
    }
  }
});

// 3. Workflow Recipe Selection
document.querySelectorAll('.recipe-card').forEach((card) => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.recipe-card').forEach((c) => c.classList.remove('active'));
    card.classList.add('active');
    const radio = card.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;

    const presetKey = card.getAttribute('data-preset');
    if (RECIPES[presetKey]) {
      customInstruction.value = RECIPES[presetKey].getPrompt(activeProject.folderName);
    }
  });
});

// 3.5 Nebius $5.00 Evaluation Credit Pool Management
function updateNebiusCreditDisplay() {
  const nebiusEvalPill = document.getElementById('nebius-eval-pill');
  if (!nebiusEvalPill) return;

  const hasCustom = Boolean(localStorage.getItem('hermes_custom_nebius_key') || (keyNebius && keyNebius.value.trim()));
  if (hasCustom) {
    nebiusEvalPill.textContent = 'Nebius: BYOK Unlimited';
    nebiusEvalPill.style.color = '#38bdf8';
    return;
  }

  const spent = parseFloat(localStorage.getItem('hermes_nebius_spend_usd') || '0.00');
  const remaining = Math.max(0, 5.00 - spent);
  if (remaining <= 0) {
    nebiusEvalPill.textContent = 'Nebius Limit: $5.00 Hit (Enter Key)';
    nebiusEvalPill.style.color = '#ef4444';
  } else {
    nebiusEvalPill.textContent = `Nebius Eval: $${spent.toFixed(2)} / $5.00`;
    nebiusEvalPill.style.color = '#10b981';
  }
}

// 4. Run Analysis
btnRun.addEventListener('click', async () => {
  const prompt = customInstruction.value.trim();
  if (!prompt) {
    alert('Please enter an instruction or choose a workflow recipe.');
    return;
  }

  // Check $5.00 Nebius Evaluation Limit
  const hasCustom = Boolean(localStorage.getItem('hermes_custom_nebius_key') || (keyNebius && keyNebius.value.trim()));
  const currentSpent = parseFloat(localStorage.getItem('hermes_nebius_spend_usd') || '0.00');
  if (!hasCustom && currentSpent >= 5.00) {
    alert(
      "⚠️ NEBIUS $5.00 EVALUATION CREDIT LIMIT REACHED!\n\n" +
      "The shared $5.00 evaluation credit has been fully consumed. Limit khatam!\n\n" +
      "Please enter your own personal Nebius API key in Settings (BYOK) to continue running live AI models."
    );
    const settingsBtn = document.querySelectorAll('.activity-btn')[2];
    if (settingsBtn) settingsBtn.click();
    if (keyNebius) {
      keyNebius.focus();
      keyNebius.style.borderColor = '#ef4444';
    }
    return;
  }

  // Set loading state
  btnRun.disabled = true;
  btnRunText.textContent = 'Scanning Codebase...';
  metricStatus.textContent = 'Executing...';
  metricStatus.className = 'metric-val';

  placeholderScreen.style.display = 'flex';
  placeholderScreen.innerHTML = `
    <div style="margin-bottom: 16px;">
      <div style="width: 32px; height: 32px; border: 2px solid #27272a; border-top-color: #10b981; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
    </div>
    <h3 style="color: #e4e4e7;">Analyzing ${activeProject.folderName}</h3>
    <p style="color: #71717a;">Scrubbing secrets via Privacy Airlock ➔ Scouting live CVEs ➔ Synthesizing with NVIDIA Nemotron Super</p>
    <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
  `;
  reportContent.style.display = 'none';

  try {
    const payload = {
      instruction: prompt,
      workspace_id: activeProject.folderName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      workspace_context: activeProject.combinedContext || null,
    };

    const res = await fetch(`${API_BASE}/agent/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    currentBriefingMarkdown = data.briefing_markdown;

    // Record Nebius usage
    if (!hasCustom) {
      const runCost = data.finops?.total_cost_usd || 0.0018;
      const nextSpent = Math.min(5.00, Number((currentSpent + runCost).toFixed(4)));
      localStorage.setItem('hermes_nebius_spend_usd', String(nextSpent));
      updateNebiusCreditDisplay();
    }

    // Render report
    placeholderScreen.style.display = 'none';
    reportContent.style.display = 'block';
    reportContent.innerHTML = formatMarkdown(data.briefing_markdown);

    metricStatus.textContent = 'Audit Complete';
    metricStatus.className = 'metric-val text-safe';
  } catch (err) {
    console.error('Analysis error:', err);
    placeholderScreen.style.display = 'flex';
    placeholderScreen.innerHTML = `
      <h3 style="color: #ef4444;">Execution Error</h3>
      <p style="color: #a1a1aa;">Failed to connect to the analysis engine: ${err.message}. Make sure the backend server is running on port 8000.</p>
    `;
    metricStatus.textContent = 'Error';
    metricStatus.className = 'metric-val';
  } finally {
    btnRun.disabled = false;
    btnRunText.textContent = 'Run Security Analysis';
  }
});

// 5. Copy Report
btnCopy.addEventListener('click', () => {
  if (!currentBriefingMarkdown) return;
  navigator.clipboard.writeText(currentBriefingMarkdown);
  copyBtnLabel.textContent = 'Copied!';
  setTimeout(() => {
    copyBtnLabel.textContent = 'Copy';
  }, 2000);
});

// 6. Save Report
btnSave.addEventListener('click', async () => {
  if (!currentBriefingMarkdown) {
    alert('Please run an analysis first before saving.');
    return;
  }

  if (window.hermesDesktop && window.hermesDesktop.saveReport) {
    const defaultName = `${activeProject.folderName.toLowerCase().replace(/\s+/g, '-')}-security-briefing.md`;
    await window.hermesDesktop.saveReport({ content: currentBriefingMarkdown, defaultName });
  } else {
    // Fallback: download via browser link
    const blob = new Blob([currentBriefingMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'security-briefing.md';
    a.click();
    URL.revokeObjectURL(url);
  }
});

// 7. Robust Markdown & Table Formatter
function formatMarkdown(md) {
  if (!md) return '';

  const lines = md.split('\n');
  let html = '';
  let inTable = false;
  let tableHeaderParsed = false;
  let inCodeBlock = false;
  let codeBlockContent = '';

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Code blocks ```
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        html += `<pre><code>${escapeHtml(codeBlockContent.trim())}</code></pre>`;
        inCodeBlock = false;
        codeBlockContent = '';
      } else {
        inCodeBlock = true;
        codeBlockContent = '';
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += rawLine + '\n';
      continue;
    }

    // Horizontal Rule ---
    if (/^---{1,}/.test(line)) {
      if (inTable) { html += '</tbody></table>'; inTable = false; }
      html += '<hr style="border: none; border-top: 1px solid #27272a; margin: 20px 0;">';
      continue;
    }

    // Markdown Table Detection
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(c => c.trim());

      // Check if it's separator line (e.g. |---|---|)
      const isSeparator = cells.every(c => /^:?-+:?$/.test(c));

      if (isSeparator) {
        tableHeaderParsed = true;
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeaderParsed = false;
        html += '<table><thead><tr>';
        cells.forEach(c => {
          html += `<th>${inlineFormat(c)}</th>`;
        });
        html += '</tr></thead><tbody>';
      } else {
        html += '<tr>';
        cells.forEach(c => {
          html += `<td>${inlineFormat(c)}</td>`;
        });
        html += '</tr>';
      }
      continue;
    } else if (inTable) {
      html += '</tbody></table>';
      inTable = false;
    }

    // Headings
    if (line.startsWith('### ')) {
      html += `<h3>${inlineFormat(line.slice(4))}</h3>`;
    } else if (line.startsWith('## ')) {
      html += `<h2>${inlineFormat(line.slice(3))}</h2>`;
    } else if (line.startsWith('# ')) {
      html += `<h1>${inlineFormat(line.slice(2))}</h1>`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      html += `<ul><li>${inlineFormat(line.slice(2))}</li></ul>`;
    } else if (line.length > 0) {
      html += `<p>${inlineFormat(line)}</p>`;
    }
  }

  if (inTable) {
    html += '</tbody></table>';
  }

  return html;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inlineFormat(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:#10b981;">$1</a>');
}

// 8. Activity Bar Navigation (Explorer, Safety Shield, API Keys)
const tabExplorer = document.getElementById('tab-explorer');
const tabSafety = document.getElementById('tab-safety');
const tabInfo = document.getElementById('tab-info');

const panelExplorer = document.getElementById('panel-explorer');
const panelSafety = document.getElementById('panel-safety');
const panelInfo = document.getElementById('panel-info');

function switchSidebarTab(activeTab, activePanel) {
  [tabExplorer, tabSafety, tabInfo].forEach((t) => t.classList.remove('active'));
  [panelExplorer, panelSafety, panelInfo].forEach((p) => p.classList.remove('active'));

  activeTab.classList.add('active');
  activePanel.classList.add('active');

  if (activeTab === tabInfo) {
    loadSettingsKeys();
  }
}

tabExplorer.addEventListener('click', () => switchSidebarTab(tabExplorer, panelExplorer));
tabSafety.addEventListener('click', () => switchSidebarTab(tabSafety, panelSafety));
tabInfo.addEventListener('click', () => switchSidebarTab(tabInfo, panelInfo));

// 9. Safety Shield: Sandbox Security Attack Test
const btnTestAttack = document.getElementById('btn-test-attack');
const sandboxTestResult = document.getElementById('sandbox-test-result');

btnTestAttack.addEventListener('click', async () => {
  btnTestAttack.disabled = true;
  btnTestAttack.textContent = 'Simulating Injection Attack...';
  sandboxTestResult.innerHTML = '<span style="color:#a1a1aa;">Testing NemoClaw sandbox intercept...</span>';

  try {
    const res = await fetch(`${API_BASE}/security/simulate-attack`, { method: 'POST' });
    const data = await res.json();
    if (data.status === 'BLOCKED') {
      sandboxTestResult.innerHTML = `
        <div style="background:#064e3b; border:1px solid #10b981; border-radius:4px; padding:8px; margin-top:6px;">
          <strong style="color:#34d399;">✓ ATTACK BLOCKED (&lt;15ms)</strong><br>
          <span style="color:#d1fae5; font-size:10px;">Rule: ${escapeHtml(data.policy_rule || 'NemoClaw Shell Guard')}</span><br>
          <span style="color:#a7f3d0; font-size:10px;">Reason: ${escapeHtml(data.reason || 'Unauthorized command')}</span>
        </div>
      `;
    } else {
      sandboxTestResult.innerHTML = `<span style="color:#fbbf24;">Status: ${escapeHtml(data.status)}</span>`;
    }
  } catch (err) {
    sandboxTestResult.innerHTML = `<span style="color:#ef4444;">Error testing sandbox: ${err.message}</span>`;
  } finally {
    btnTestAttack.disabled = false;
    btnTestAttack.textContent = 'Run Sandbox Security Test';
  }
});

// 10. API Keys Management (BYOK - Bring Your Own Key)
const keyNebius = document.getElementById('key-nebius');
const keyTavily = document.getElementById('key-tavily');
const keyContext = document.getElementById('key-context');
const btnSaveKeys = document.getElementById('btn-save-keys');
const keysSaveStatus = document.getElementById('keys-save-status');

const badgeNebius = document.getElementById('badge-nebius-status');
const badgeTavily = document.getElementById('badge-tavily-status');
const badgeContext = document.getElementById('badge-context-status');

// Toggle eye visibility
document.querySelectorAll('.btn-toggle-eye').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁' : '🔒';
    }
  });
});

async function loadSettingsKeys() {
  try {
    const res = await fetch(`${API_BASE}/settings/keys`);
    if (res.ok) {
      const data = await res.json();

      badgeNebius.textContent = data.nebius_configured ? 'Connected' : 'Unset';
      badgeNebius.className = `key-status-badge ${data.nebius_configured ? 'connected' : 'unset'}`;
      if (data.nebius_configured && data.nebius_masked) {
        keyNebius.placeholder = `${data.nebius_masked} (Saved)`;
      }

      badgeTavily.textContent = data.tavily_configured ? 'Connected' : 'Unset';
      badgeTavily.className = `key-status-badge ${data.tavily_configured ? 'connected' : 'unset'}`;
      if (data.tavily_configured && data.tavily_masked) {
        keyTavily.placeholder = `${data.tavily_masked} (Saved)`;
      }

      badgeContext.textContent = data.context_dev_configured ? 'Connected' : 'Optional';
      badgeContext.className = `key-status-badge ${data.context_dev_configured ? 'connected' : ''}`;
      if (data.context_dev_configured && data.context_dev_masked) {
        keyContext.placeholder = `${data.context_dev_masked} (Saved)`;
      }
    }
  } catch (err) {
    console.warn('Could not fetch settings keys:', err);
  }
}

btnSaveKeys.addEventListener('click', async () => {
  btnSaveKeys.disabled = true;
  btnSaveKeys.textContent = 'Saving Keys...';
  keysSaveStatus.innerHTML = '<span style="color:#a1a1aa;">Updating local configuration...</span>';

  const payload = {};
  if (keyNebius.value.trim()) payload.nebius_api_key = keyNebius.value.trim();
  if (keyTavily.value.trim()) payload.tavily_api_key = keyTavily.value.trim();
  if (keyContext.value.trim()) payload.context_dev_api_key = keyContext.value.trim();

  try {
    const res = await fetch(`${API_BASE}/settings/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      keysSaveStatus.innerHTML = '<span style="color:#10b981;">✓ Keys saved locally to .env and activated!</span>';
      if (payload.nebius_api_key) {
        localStorage.setItem('hermes_custom_nebius_key', payload.nebius_api_key);
      }
      keyNebius.value = '';
      keyTavily.value = '';
      keyContext.value = '';
      await checkHealth();
      await loadSettingsKeys();
      updateNebiusCreditDisplay();
    } else {
      keysSaveStatus.innerHTML = '<span style="color:#ef4444;">Failed to save keys to server.</span>';
    }
  } catch (err) {
    keysSaveStatus.innerHTML = `<span style="color:#ef4444;">Error saving keys: ${err.message}</span>`;
  } finally {
    btnSaveKeys.disabled = false;
    btnSaveKeys.textContent = 'Save & Connect API Keys';
  }
});

// Initial probe
checkHealth();
loadSettingsKeys();
updateNebiusCreditDisplay();
setInterval(checkHealth, 5000);
