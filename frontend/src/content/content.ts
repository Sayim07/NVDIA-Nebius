/**
 * HermesShield Content Store
 * Single source of truth for all copy, links, metrics, presets, and roadmap items.
 * Written in calm, professional plain English in the spirit of Stripe, Linear, and Vercel.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface OverlayMenuItem {
  id: string;
  label: string;
  description: string;
  href?: string;
  action?: 'video' | 'replay' | 'app';
  badge?: string;
}

export interface MetricItem {
  value: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  isTextValue?: boolean;
  label: string;
  caption: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  techTag: string;
  tabId: 'briefing' | 'airlock' | 'sandbox' | 'skills';
  actionLabel: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  shortDesc: string;
  detail: string;
}

export interface StackItem {
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

export interface RoadmapItem {
  title: string;
  description: string;
  status: string;
}

export interface ContentConfig {
  meta: {
    name: string;
    tagline: string;
    description: string;
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
    logoText: string;
    links: NavItem[];
    overlayMenu: OverlayMenuItem[];
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
    trustLabel: string;
    trustLogos: { name: string; category: string }[];
  };
  problemSolution: {
    eyebrow: string;
    problem: {
      badge: string;
      title: string;
      description: string;
      points: string[];
    };
    fix: {
      badge: string;
      title: string;
      description: string;
      points: string[];
    };
  };
  results: {
    eyebrow: string;
    heading: string;
    footnote: string;
    items: MetricItem[];
  };
  features: {
    eyebrow: string;
    heading: string;
    subheading: string;
    items: FeatureItem[];
  };
  howItWorks: {
    eyebrow: string;
    tavilyBadge: string;
    heading: string;
    subheading: string;
    steps: HowItWorksStep[];
    diffCard: {
      rawPrompt: string;
      rawPromptRedactions: string[];
      cleanedQuery: string;
      cta: string;
    };
  };
  architecture: {
    eyebrow: string;
    heading: string;
    subheading: string;
  };
  liveDemo: {
    eyebrow: string;
    heading: string;
    instruction: string;
    tabs: {
      id: 'briefing' | 'airlock' | 'sandbox' | 'skills';
      label: string;
      sub: string;
    }[];
    demoModeTooltip: string;
  };
  video: {
    eyebrow: string;
    heading: string;
    caption: string;
    youtubeId: string;
  };
  techStack: {
    eyebrow: string;
    heading: string;
    subheading: string;
    items: StackItem[];
  };
  getStarted: {
    eyebrow: string;
    heading: string;
    note: string;
    steps: QuickstartStep[];
  };
  roadmap: {
    eyebrow: string;
    heading: string;
    items: RoadmapItem[];
    feedback: {
      title: string;
      nebiusFeedback: string;
      nemoClawFeedback: string;
    };
  };
  footer: {
    tagline: string;
    copyright: string;
    columns: {
      title: string;
      links: { label: string; href: string }[];
    }[];
  };
}

export const content: ContentConfig = {
  meta: {
    name: 'HermesShield',
    tagline: 'A personal AI assistant that keeps your secrets secret',
    description:
      'HermesShield reads your project files and researches the web for you. Before anything leaves your computer, it removes private details like emails, keys and internal names.',
    track: 'Personal AI track · Best Use of Tavily target',
    hackathon: 'Nebius x NVIDIA Global AI Hackathon',
    license: 'MIT',
    author: 'Sayim',
  },

  links: {
    github: 'https://github.com/Sayim07/NVDIA-Nebius',
    liveDemo: '#demo',
    youtube: 'https://www.youtube.com/watch?v=gfVYxTViN14',
    devpost: 'https://devpost.com',
  },

  nav: {
    logoText: 'HermesShield',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Features', href: '#features' },
      { label: 'Airlock', href: '#airlock' },
      { label: 'Savings', href: '#savings' },
      { label: 'Live demo', href: '#demo' },
    ],
    overlayMenu: [
      { id: 'overview', label: 'Overview', description: 'Product introduction & core zero-trust concept', action: 'replay' },
      { id: 'how-it-works', label: 'How it works', description: '4-step privacy pipeline & sovereign architecture', href: '/app/how-it-works' },
      { id: 'airlock', label: 'Privacy airlock', description: 'Zero-PII web search redaction diff & live test', href: '/app/airlock' },
      { id: 'costs', label: 'Cost savings', description: 'FinOps telemetry & 82.4% token reduction breakdown', href: '/app/costs' },
      { id: 'demo', label: 'Live demo', description: 'Executive workspace & preset briefings', href: '/app' },
      { id: 'video', label: 'Watch video', description: '3-minute full architecture walkthrough', action: 'video' },
      { id: 'app', label: 'Open the app', description: 'Launch the Cyber Command Center dashboard', href: '/app' },
      { id: 'github', label: 'GitHub', description: 'Source code, policies, and documentation', href: 'https://github.com/Sayim07/NVDIA-Nebius' },
    ],
    cta: 'Try the demo',
    searchLabel: 'Search',
  },

  hero: {
    eyebrow: 'Nebius x NVIDIA Global AI Hackathon · Personal AI track',
    titleLead: 'A personal AI assistant that keeps your secrets',
    titleAccent: 'secret.',
    titleEnd: '',
    subtext:
      'HermesShield reads your project files and researches the web for you. Before anything leaves your computer, it removes private details like emails, keys and internal names.',
    primaryCta: 'Try the demo',
    secondaryCta: 'Watch the attack get blocked',
    trustLabel: 'Built with open, sovereign AI infrastructure',
    trustLogos: [
      { name: 'NVIDIA NemoClaw', category: 'Security guard' },
      { name: 'Nebius Token Factory', category: 'GPU inference' },
      { name: 'NVIDIA Nemotron', category: 'Model routing' },
      { name: 'Tavily', category: 'Web intelligence' },
    ],
  },

  problemSolution: {
    eyebrow: 'Why privacy-first AI matters',
    problem: {
      badge: 'The problem',
      title: 'AI agents are powerful, but they see everything.',
      description:
        'One careless web search can leak an API key, a customer email or a private staging domain to third parties. If an agent executes an unchecked command, malicious prompt injections can read secret credentials from your disk.',
      points: [
        'Raw web searches send internal project names and keys directly to outside servers',
        'Unrestricted shell access lets rogue prompts read .env files and private keys',
        'Frontier models charge full price for basic string filtering tasks',
      ],
    },
    fix: {
      badge: 'The fix',
      title: 'HermesShield sits between your AI and the outside world.',
      description:
        'It checks every local action and cleans every outgoing web search before anything touches the wire. You get the full power of a deep assistant with zero fear of data leaks.',
      points: [
        'Privacy airlock strips secrets, tokens and emails before searching Tavily',
        'Command sandbox intercepts file access to .env and SSH keys in under 15ms',
        'Smart model router cuts token costs by 82.4% by assigning tasks to the right size',
      ],
    },
  },

  results: {
    eyebrow: 'Measured results',
    heading: 'Engineered for real-world reliability and speed',
    footnote: 'Measured in our demo environment against standard frontier models without airlocks.',
    items: [
      {
        value: '-82.4%',
        numericValue: 82.4,
        prefix: '-',
        suffix: '%',
        decimals: 1,
        label: 'Lower AI cost',
        caption: 'by routing each task to the right-sized model ($0.00142 vs $0.00806 baseline)',
      },
      {
        value: '<15 ms',
        numericValue: 15,
        prefix: '<',
        suffix: ' ms',
        decimals: 0,
        label: 'Policy check time',
        caption: 'to check and block a risky command out-of-process',
      },
      {
        value: 'Secrets removed',
        isTextValue: true,
        label: 'Dual-pass scrub',
        caption: 'from every outgoing web search via pattern matching and Nemotron Nano',
      },
      {
        value: 'Blocked',
        isTextValue: true,
        label: 'Zero breaches',
        caption: 'access to .env and SSH keys in our prompt injection attack test',
      },
    ],
  },

  features: {
    eyebrow: 'Features',
    heading: 'Four protective layers between your agent and the web',
    subheading: 'Each layer runs independently so a failure in one never compromises the others.',
    items: [
      {
        id: 'sandbox',
        title: 'Safe command sandbox',
        techTag: 'NVIDIA NemoClaw + OpenShell',
        description:
          'Blocks risky commands and access to secret files before they run. Supervised out-of-process so the model cannot override rules.',
        tabId: 'sandbox',
        actionLabel: 'Try the sandbox',
      },
      {
        id: 'airlock',
        title: 'Private web search',
        techTag: 'Tavily Airlock',
        description:
          'Removes emails, keys and internal names from every search before dispatching to Tavily for verified security research.',
        tabId: 'airlock',
        actionLabel: 'Inspect the airlock',
      },
      {
        id: 'routing',
        title: 'Smart cost routing',
        techTag: 'Nebius Token Factory',
        description:
          'Small Nemotron models do easy work, bigger ones handle hard reasoning. Up to 82.4% cheaper with sub-200ms initial response.',
        tabId: 'briefing',
        actionLabel: 'See cost breakdown',
      },
      {
        id: 'skills',
        title: 'Learns your preferences',
        techTag: 'Hermes Skills',
        description:
          'Turns your corrections into reusable skills you can read and edit directly in simple YAML files on your computer.',
        tabId: 'skills',
        actionLabel: 'Open skill studio',
      },
    ],
  },

  howItWorks: {
    eyebrow: 'How it works',
    tavilyBadge: 'Best Use of Tavily',
    heading: 'How the privacy airlock protects your searches',
    subheading:
      'Before your assistant searches the web with Tavily, all proprietary secrets and internal identifiers are removed locally.',
    steps: [
      {
        step: 1,
        title: 'You ask',
        shortDesc: 'Your request may contain private details.',
        detail: 'For example, internal workspace paths, staging URLs, emails or local tokens.',
      },
      {
        step: 2,
        title: 'Pattern check',
        shortDesc: 'Instantly strips keys, tokens and internal domains.',
        detail: 'Fast regex firewall identifies and redacts API keys, JWTs and IP addresses.',
      },
      {
        step: 3,
        title: 'AI clean-up',
        shortDesc: 'Nemotron Nano removes names and project codenames.',
        detail: 'Small model extracts pure technical keywords without proprietary context.',
      },
      {
        step: 4,
        title: 'Safe search',
        shortDesc: 'Only the cleaned question reaches Tavily.',
        detail: 'Returns verified public CVE advisories and documentation with zero secret leaks.',
      },
    ],
    diffCard: {
      rawPrompt:
        'Audit staging auth at https://api.internal-titan.corp/v1 for sayim@corp.io using JWT eyJhbGciOi... and check for FastAPI CVEs.',
      rawPromptRedactions: [
        'https://api.internal-titan.corp/v1',
        'sayim@corp.io',
        'eyJhbGciOi...',
      ],
      cleanedQuery:
        'FastAPI security advisory CVE-2024 OAuth2 authentication token bypass',
      cta: 'See it live in demo',
    },
  },

  architecture: {
    eyebrow: 'Architecture',
    heading: 'How HermesShield connects your tools safely',
    subheading:
      'A decoupled design separating the local assistant from external cloud models and the public web.',
  },

  liveDemo: {
    eyebrow: 'Interactive demo',
    heading: 'Try it yourself',
    instruction: '1. Pick a scenario. 2. Press Run.',
    tabs: [
      {
        id: 'briefing',
        label: 'Briefing',
        sub: 'Workspace scenarios & briefings',
      },
      {
        id: 'airlock',
        label: 'Airlock',
        sub: 'Before & after search diff',
      },
      {
        id: 'sandbox',
        label: 'Sandbox',
        sub: 'NemoClaw policy & attack test',
      },
      {
        id: 'skills',
        label: 'Skills',
        sub: 'Persistent memory & YAML skills',
      },
    ],
    demoModeTooltip:
      'Demo mode uses pre-recorded responses. Add API keys in backend/.env to go live.',
  },

  video: {
    eyebrow: 'Video walkthrough',
    heading: 'See it in 3 minutes',
    caption: 'A quick tour of the privacy airlock, attack blocker and cost dashboard.',
    youtubeId: 'gfVYxTViN14',
  },

  techStack: {
    eyebrow: 'Tech stack',
    heading: 'Built on open, independent infrastructure',
    subheading:
      'We chose open-source components that give you full ownership of your data and models.',
    items: [
      {
        name: 'NVIDIA NemoClaw',
        category: 'Security supervisor',
        why: 'Out-of-process process isolation that intercepts rogue commands before execution.',
      },
      {
        name: 'Nebius Token Factory',
        category: 'Inference platform',
        why: 'High-throughput NVIDIA GPU clusters with OpenAI-compatible endpoints.',
      },
      {
        name: 'NVIDIA Nemotron-3',
        category: 'Foundation models',
        why: 'Nano for fast PII scrub, Super for reasoning, Ultra for compiling new skills.',
      },
      {
        name: 'Tavily Search',
        category: 'Web intelligence',
        why: 'Developer-tailored search API returning high-signal documentation and CVE feeds.',
      },
      {
        name: 'OpenShell Guard',
        category: 'Sandbox runner',
        why: 'Strict declarative policy engine for filesystem and process supervision.',
      },
      {
        name: 'FastAPI',
        category: 'Backend runtime',
        why: 'Fast, async Python runtime serving security, agent, and memory APIs.',
      },
      {
        name: 'Next.js 14',
        category: 'Web frontend',
        why: 'App router with clean server components, GSAP physics and Lenis smooth scrolling.',
      },
    ],
  },

  getStarted: {
    eyebrow: 'Get started',
    heading: 'Run it on your computer in 3 steps',
    note: 'No keys? It runs in demo mode out of the box.',
    steps: [
      {
        step: '01',
        title: 'Clone repository',
        command: 'git clone https://github.com/Sayim07/NVDIA-Nebius.git\ncd "NVDIA - nebuis"',
        description: 'Get the MIT-licensed code on your local machine.',
      },
      {
        step: '02',
        title: 'Add API keys (optional)',
        command: 'cp backend/.env.example backend/.env\n# Add NEBIUS_API_KEY and TAVILY_API_KEY for live models',
        description: 'Runs in offline demo mode automatically if keys are omitted.',
      },
      {
        step: '03',
        title: 'Start backend and frontend',
        command: '# Terminal 1 (FastAPI on :8000)\ncd backend && uvicorn main:app --reload --port 8000\n\n# Terminal 2 (Next.js on :3000)\ncd frontend && npm run dev',
        description: 'Open http://localhost:3000 to interact with HermesShield.',
      },
    ],
  },

  roadmap: {
    eyebrow: 'Roadmap & builder feedback',
    heading: 'What is next for HermesShield',
    items: [
      {
        title: 'Two-model consensus',
        description:
          'Cross-verify high-impact workspace file changes with two independent Nemotron models before saving.',
        status: 'In design',
      },
      {
        title: 'Encrypted local memory',
        description:
          'Hardware-level memory encryption for stored preferences on confidential computing GPUs.',
        status: 'Planned',
      },
      {
        title: 'Browser DOM airlock',
        description:
          'Scrub credentials and private tokens from web page DOMs before passing page text to the model.',
        status: 'Research',
      },
    ],
    feedback: {
      title: 'Our feedback on Nebius Token Factory and NemoClaw',
      nebiusFeedback:
        'Nebius Token Factory delivered exceptional time-to-first-token (<180ms) and clean drop-in OpenAI client compatibility for Nemotron-3. Switching between Nano, Super, and Ultra tiers was seamless.',
      nemoClawFeedback:
        'NemoClaw and OpenShell gave us the precise out-of-process isolation needed to stop prompt injection attacks without the heavy overhead of Docker containers.',
    },
  },

  footer: {
    tagline: 'A personal AI assistant that keeps your secrets secret.',
    copyright: '© 2026 HermesShield. MIT License.',
    columns: [
      {
        title: 'Project',
        links: [
          { label: 'GitHub Repository', href: 'https://github.com/Sayim07/NVDIA-Nebius' },
          { label: 'Live Demo', href: '#demo' },
          { label: 'Video Walkthrough', href: 'https://www.youtube.com/watch?v=gfVYxTViN14' },
          { label: 'Documentation', href: 'https://github.com/Sayim07/NVDIA-Nebius#readme' },
        ],
      },
      {
        title: 'Built with',
        links: [
          { label: 'NVIDIA NemoClaw', href: 'https://developer.nvidia.com' },
          { label: 'Nebius Token Factory', href: 'https://tokenfactory.nebius.com' },
          { label: 'NVIDIA Nemotron', href: 'https://build.nvidia.com' },
          { label: 'Tavily Search', href: 'https://tavily.com' },
        ],
      },
      {
        title: 'Hackathon',
        links: [
          { label: 'Nebius x NVIDIA Hackathon', href: 'https://devpost.com' },
          { label: 'Personal AI Track', href: 'https://devpost.com' },
          { label: 'Best Use of Tavily Target', href: 'https://devpost.com' },
        ],
      },
    ],
  },
};
