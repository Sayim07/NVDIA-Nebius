/**
 * HermesShield Content Store
 * Single source of truth for all copy, links, metrics, presets, and roadmap items.
 * Non-technical teammates can edit this file directly to update the site.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface MetricItem {
  value: string;
  numericValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  caption: string;
}

export interface SafetyLayerItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tabId: 'workspace' | 'airlock' | 'security' | 'skills';
  accent: 'green' | 'cyan' | 'amber';
  badge: string;
}

export interface AirlockStepItem {
  step: number;
  title: string;
  description: string;
  detail: string;
}

export interface StackMarqueeItem {
  name: string;
  category: string;
  why: string;
}

export interface QuickstartStep {
  step: string;
  title: string;
  command: string;
  description: string;
}

export interface ContentConfig {
  meta: {
    name: string;
    tagline: string;
    pitch: string;
    track: string;
    hackathon: string;
    license: string;
    author: string;
  };
  links: {
    github: string;
    liveDemo: string;
    youtube: string;
    devpost: string;
  };
  nav: {
    links: NavItem[];
    cta: string;
    searchLabel: string;
  };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    titleEnd: string;
    subtext: string;
    primaryCta: string;
    secondaryCta: string;
    trustRowLabel: string;
    trustLogos: { name: string; tag: string }[];
  };
  problemSolution: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    headingEnd: string;
    problem: {
      badge: string;
      title: string;
      description: string;
      bulletPoints: string[];
    };
    solution: {
      badge: string;
      title: string;
      description: string;
      bulletPoints: string[];
    };
  };
  metrics: MetricItem[];
  layers: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    headingEnd: string;
    description: string;
    items: SafetyLayerItem[];
  };
  airlock: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    headingEnd: string;
    description: string;
    steps: AirlockStepItem[];
    diffSample: {
      rawPrompt: string;
      redactedTokens: string[];
      sanitizedQuery: string;
    };
    cta: string;
  };
  architecture: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    headingEnd: string;
    description: string;
  };
  console: {
    eyebrow: string;
    title: string;
    instruction: string;
    tabs: {
      id: 'workspace' | 'airlock' | 'security' | 'skills';
      label: string;
      sub: string;
    }[];
  };
  video: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    headingEnd: string;
    caption: string;
    youtubeId: string; // TODO: Replace with live walkthrough video ID
  };
  techStack: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    headingEnd: string;
    marquee: StackMarqueeItem[];
  };
  quickstart: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    headingEnd: string;
    offlineNote: string;
    steps: QuickstartStep[];
  };
  roadmap: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    headingEnd: string;
    futureItems: { title: string; desc: string; status: string }[];
    hackathonFeedback: {
      title: string;
      nebiusFeedback: string;
      nemoClawFeedback: string;
    };
  };
  footer: {
    copyright: string;
    mission: string;
  };
}

export const content: ContentConfig = {
  meta: {
    name: 'HermesShield',
    tagline: 'Zero-Trust Personal AI Executive',
    pitch:
      'A personal AI executive that can read your workspace and search the web without ever leaking your secrets.',
    track: 'Personal AI | Best Use of Tavily',
    hackathon: 'Nebius x NVIDIA Global AI Hackathon',
    license: 'MIT',
    author: 'Sayim07',
  },

  links: {
    github: 'https://github.com/Sayim07/NVDIA-Nebius',
    liveDemo: '#console',
    youtube: 'https://www.youtube.com/watch?v=placeholder', // TODO: Swap with real walkthrough URL
    devpost: 'https://devpost.com',
  },

  nav: {
    links: [
      { label: 'Overview', href: '#overview' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Airlock', href: '#airlock' },
      { label: 'Cost', href: '#cost' },
      { label: 'Live demo', href: '#console' },
    ],
    cta: 'Launch console',
    searchLabel: 'Search',
  },

  hero: {
    eyebrow: 'Nebius x NVIDIA Global AI Hackathon // Personal AI Track',
    titleLead: 'Personal AI that stays',
    titleAccent: 'private.',
    titleEnd: '',
    subtext:
      'A personal AI executive that reads your workspace and searches the web without ever leaking your secrets. Guarded out-of-process by NVIDIA NemoClaw and Nebius Token Factory.',
    primaryCta: 'Launch console',
    secondaryCta: 'Simulate an attack',
    trustRowLabel: 'Engineered with open, independent sovereign AI infrastructure',
    trustLogos: [
      { name: 'NVIDIA NemoClaw', tag: 'Out-of-Process Guard' },
      { name: 'Nebius Token Factory', tag: 'High-Throughput GPUs' },
      { name: 'NVIDIA Nemotron', tag: '3-Tier Cost Routing' },
      { name: 'Tavily Search', tag: 'Sanitized Web Airlock' },
    ],
  },

  problemSolution: {
    eyebrow: 'Why HermesShield Exists',
    headingLead: 'Autonomous agents need',
    headingAccent: 'boundaries.',
    headingEnd: '',
    problem: {
      badge: 'The Vulnerability',
      title: 'AI agents leak secrets when they touch your files or search the web.',
      description:
        'Standard personal AI assistants receive ambient workspace access. One malicious prompt injection or poisoned search result can instruct the agent to exfiltrate SSH keys, .env credentials, and private customer data to attacker servers.',
      bulletPoints: [
        'Unchecked prompt injection reads credentials from local files',
        'Raw search queries send proprietary secrets directly to third-party search engines',
        'Heavy frontier models bill maximum cost even for trivial regex checks',
      ],
    },
    solution: {
      badge: 'The Architecture',
      title: 'HermesShield puts 4 safety layers between your agent and the world.',
      description:
        'Every tool call, file read, and web query passes through an isolated zero-trust sandbox. Secrets are scrubbed before search queries touch the wire, and policy checks run out-of-process in under 15ms.',
      bulletPoints: [
        'NemoClaw OpenShell blocks unauthorized filesystem reads and outbound exfiltration',
        'Tavily Airlock scrubs 100% of PII tokens before sending web search queries',
        '3-tier FinOps router slashes inference spend by -82.4% with Nemotron Nano/Super/Ultra',
      ],
    },
  },

  metrics: [
    {
      value: '-82.4%',
      numericValue: 82.4,
      prefix: '-',
      suffix: '%',
      decimals: 1,
      label: 'Inference Cost Reduction',
      caption: '$0.00142 vs $0.00806 baseline via 3-tier Nemotron routing on Token Factory',
    },
    {
      value: '<15ms',
      numericValue: 15,
      prefix: '<',
      suffix: 'ms',
      decimals: 0,
      label: 'Policy Check Latency',
      caption: 'Out-of-process security verification intercepting rogue bash & file access',
    },
    {
      value: '100%',
      numericValue: 100,
      prefix: '',
      suffix: '%',
      decimals: 0,
      label: 'PII Scrubbed in Airlock',
      caption: 'Dual-pass deterministic regex + Nemotron Nano sanitization before Tavily search',
    },
    {
      value: '0',
      numericValue: 0,
      prefix: '',
      suffix: '',
      decimals: 0,
      label: 'Policy Violations Allowed',
      caption: 'Air-tight OpenShell sandbox boundaries enforced across all tool executions',
    },
  ],

  layers: {
    eyebrow: 'Defense in Depth',
    headingLead: 'Four sovereign layers of',
    headingAccent: 'zero-trust',
    headingEnd: 'protection.',
    description:
      'HermesShield isolates the agent runtime from both your local machine and external networks.',
    items: [
      {
        id: 'nemoclaw-sandbox',
        title: 'NemoClaw OpenShell Sandbox',
        tagline: 'Out-of-process security boundary',
        description:
          'Monitors every shell command and file read out-of-process. Prohibits access to .env, SSH keys, and unauthorized egress endpoints.',
        tabId: 'security',
        accent: 'green',
        badge: 'Layer 1',
      },
      {
        id: 'tavily-airlock',
        title: 'Privacy-Preserving Tavily Airlock',
        tagline: 'Zero-PII web scout pipeline',
        description:
          'Passes web requests through dual-pass scrubbing (deterministic regex + Nemotron Nano) before dispatching to Tavily for CVE research.',
        tabId: 'airlock',
        accent: 'cyan',
        badge: 'Layer 2',
      },
      {
        id: 'nebius-finops',
        title: 'Nebius 3-Tier FinOps Router',
        tagline: 'Intelligent workload model dispatch',
        description:
          'Routes queries between Nemotron-3 Nano (PII sanitization), Super (reasoning), and Ultra (skill synthesis) to reduce token spend by 82.4%.',
        tabId: 'workspace',
        accent: 'green',
        badge: 'Layer 3',
      },
      {
        id: 'hermes-skills',
        title: 'Hermes Skill Studio',
        tagline: 'Self-writing persistent memory',
        description:
          'Transforms corrections into reusable YAML skills stored in local disk memory, continuously expanding sovereign agent capabilities.',
        tabId: 'skills',
        accent: 'cyan',
        badge: 'Layer 4',
      },
    ],
  },

  airlock: {
    eyebrow: 'Zero-PII Search Pipeline',
    headingLead: 'How the privacy airlock',
    headingAccent: 'neutralizes',
    headingEnd: 'leaks.',
    description:
      'Before your agent searches the web with Tavily, all proprietary secrets and internal workspace identifiers are scrubbed locally.',
    steps: [
      {
        step: 1,
        title: 'Private Prompt',
        description: 'Agent requires external web research to resolve a task.',
        detail: 'Contains internal workspace paths, staging URLs, emails, or credentials.',
      },
      {
        step: 2,
        title: 'Regex Firewall',
        description: 'High-speed deterministic pattern matching.',
        detail: 'Instantly redacts API keys, JWTs, emails, and IPv4 addresses.',
      },
      {
        step: 3,
        title: 'Nemotron Nano Scrub',
        description: 'Contextual semantic entity redaction.',
        detail: 'Extracts purely technical search keywords and CVE identifiers.',
      },
      {
        step: 4,
        title: 'Safe Tavily Search',
        description: 'Dispatched to Tavily API with zero private context.',
        detail: 'Returns verified public security advisories and documentation.',
      },
    ],
    diffSample: {
      rawPrompt:
        'Audit staging auth at https://api.internal-titan.corp/v1 for sayim@corp.io using JWT eyJhbGciOi... and check for FastAPI CVEs.',
      redactedTokens: [
        'https://api.internal-titan.corp/v1',
        'sayim@corp.io',
        'eyJhbGciOi...',
      ],
      sanitizedQuery:
        'FastAPI security advisory CVE-2024 OAuth2 authentication token bypass',
    },
    cta: 'Open Airlock view',
  },

  architecture: {
    eyebrow: 'System Blueprint',
    headingLead: 'Decoupled sovereign runtime',
    headingAccent: 'architecture.',
    headingEnd: '',
    description:
      'High-performance Next.js 14 client paired with a FastAPI runtime, orchestrated over Nebius Token Factory and NVIDIA NemoClaw.',
  },

  console: {
    eyebrow: 'Interactive Execution Environment',
    title: 'HermesShield Live Console',
    instruction: 'Step 1: Pick a preset. Step 2: Press Dispatch.',
    tabs: [
      {
        id: 'workspace',
        label: 'Workspace Runner',
        sub: 'Executive Briefings & Presets',
      },
      {
        id: 'airlock',
        label: 'Tavily Airlock',
        sub: 'Zero-PII Search Diff',
      },
      {
        id: 'security',
        label: 'NemoClaw Guard',
        sub: 'Out-of-Process Ledger',
      },
      {
        id: 'skills',
        label: 'Hermes Skills',
        sub: 'Episodic Memory & YAML',
      },
    ],
  },

  video: {
    eyebrow: 'Product Walkthrough',
    headingLead: 'See HermesShield in',
    headingAccent: 'action.',
    headingEnd: '',
    caption: '3-minute technical walkthrough & live attack simulation demo',
    youtubeId: 'dQw4w9WgXcQ', // TODO: Swap with production video ID
  },

  techStack: {
    eyebrow: 'Stack & Ecosystem',
    headingLead: 'Powered by open-source',
    headingAccent: 'infrastructure.',
    headingEnd: '',
    marquee: [
      {
        name: 'NVIDIA NemoClaw',
        category: 'Security Guard',
        why: 'Out-of-process isolation intercepting rogue agent actions.',
      },
      {
        name: 'Nebius Token Factory',
        category: 'Inference Engine',
        why: 'Ultra-low latency inference on dedicated NVIDIA GPU clusters.',
      },
      {
        name: 'NVIDIA Nemotron-3',
        category: 'Foundation Models',
        why: 'Nano for PII scrub, Super for reasoning, Ultra for skill synthesis.',
      },
      {
        name: 'Tavily Search',
        category: 'Web Intelligence',
        why: 'Developer-tailored web search for real-time security intelligence.',
      },
      {
        name: 'OpenShell Guard',
        category: 'Sandbox Runtime',
        why: 'Enforces strict filesystem and network policy boundaries.',
      },
      {
        name: 'FastAPI',
        category: 'Backend Core',
        why: 'Async Python runtime serving security, agent, and memory APIs.',
      },
      {
        name: 'Next.js 14',
        category: 'Frontend UI',
        why: 'App router with GSAP micro-animations and Lenis smooth scrolling.',
      },
    ],
  },

  quickstart: {
    eyebrow: 'Developer Onboarding',
    headingLead: 'Up and running in',
    headingAccent: 'three',
    headingEnd: 'steps.',
    offlineNote: 'Runs in offline simulation mode without API keys.',
    steps: [
      {
        step: '01',
        title: 'Clone repository',
        command: 'git clone https://github.com/Sayim07/NVDIA-Nebius.git\ncd "NVDIA - nebuis"',
        description: 'Clone the MIT-licensed repository to your local environment.',
      },
      {
        step: '02',
        title: 'Configure environment keys',
        command: 'cp backend/.env.example backend/.env\n# Add NEBIUS_API_KEY and TAVILY_API_KEY (optional for live mode)',
        description: 'Provide your Nebius Token Factory and Tavily keys, or run offline immediately.',
      },
      {
        step: '03',
        title: 'Start backend & frontend',
        command: '# Terminal 1 (FastAPI on :8000)\ncd backend && uvicorn main:app --reload --port 8000\n\n# Terminal 2 (Next.js on :3000)\ncd frontend && npm run dev',
        description: 'Launch the sovereign runtime and open http://localhost:3000 in your browser.',
      },
    ],
  },

  roadmap: {
    eyebrow: 'Future Vision & Hackathon Feedback',
    headingLead: 'What lies',
    headingAccent: 'ahead.',
    headingEnd: '',
    futureItems: [
      {
        title: 'Multi-Agent Consensus Verification',
        desc: 'Cross-verifying high-impact workspace write operations across 2 independent Nemotron models.',
        status: 'In Design',
      },
      {
        title: 'Encrypted Episodic Memory Enclaves',
        desc: 'Hardware-level memory encryption for MEMORY.md on NVIDIA confidential computing instances.',
        status: 'Planned',
      },
      {
        title: 'Browser-Native Web Scraping Airlock',
        desc: 'Sandboxed headless browser execution with automatic DOM secret redacting.',
        status: 'Research',
      },
    ],
    hackathonFeedback: {
      title: 'Builder Feedback for Nebius & NVIDIA',
      nebiusFeedback:
        'Nebius Token Factory provided extraordinary TTFT (<180ms) and rock-solid OpenAI-compatible endpoints for Nemotron-3. Effortless tier switching.',
      nemoClawFeedback:
        'NemoClaw and OpenShell provided the ideal out-of-process isolation needed for sovereign personal agents without docker overhead.',
    },
  },

  footer: {
    copyright: '© 2026 HermesShield. Built under MIT License.',
    mission:
      'Engineered for the Nebius x NVIDIA Global AI Hackathon. Sovereign Personal AI Track.',
  },
};
