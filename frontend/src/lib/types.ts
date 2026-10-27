// frontend/src/lib/types.ts
/**
 * TypeScript data contracts matching Schema.md §2.
 */

export interface HealthStatus {
  app_name: string;
  version: string;
  status: 'ok' | 'degraded';
  is_fallback: boolean;
  nebius_connected: boolean;
  tavily_connected: boolean;
  context_dev_connected?: boolean;
}


export interface TierTokenUsage {
  tier_name: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
}

export interface FinOpsTelemetry {
  total_cost_usd: number;
  baseline_cost_usd: number;
  cost_reduction_percent: number;
  execution_latency_ms: number;
  tier_breakdown: TierTokenUsage[];
}

export interface AirlockDiff {
  raw_context: string;
  sanitized_query: string;
  scrubbed_entities: string[];
  scrub_latency_ms: number;
}

export interface TavilySource {
  title: string;
  url: string;
  content: string;
  score: number;
  cve_id?: string | null;
}

export interface AirlockResult {
  diff: AirlockDiff;
  sources: TavilySource[];
  is_cached: boolean;
}

export interface SecurityEvent {
  id?: number;
  timestamp: string;
  command: string;
  status: 'ALLOWED' | 'BLOCKED';
  policy_rule: string;
  reason: string;
}

export interface AttackSimulationResponse {
  payload_executed: string;
  status: 'BLOCKED';
  violated_rule: string;
  execution_latency_ms: number;
  details: string;
}

export interface SecurityStateResponse {
  policy_yaml: string;
  events: SecurityEvent[];
}

export interface AgentSecuritySummary {
  commands_executed: string[];
  violations_detected: SecurityEvent[];
}

export interface AgentRunRequest {
  instruction: string;
  workspace_id: string;
  preset_name?: string | null;
  workspace_context?: string | null;
}

export interface AgentRunResponse {
  task_id: string;
  timestamp: string;
  status: 'completed' | 'failed';
  is_fallback: boolean;
  briefing_markdown: string;
  airlock: AirlockResult;
  security: AgentSecuritySummary;
  finops: FinOpsTelemetry;
}

export interface HermesSkill {
  skill_name: string;
  version: string;
  description: string;
  trigger_conditions: string[];
  execution_steps: string[];
  allowed_tools: string[];
  created_at: string;
}

export interface MemoryStateResponse {
  memory_markdown: string;
  skills: HermesSkill[];
}

export interface UpdateMemoryRequest {
  memory_markdown: string;
}

export interface UpdateMemoryResponse {
  updated: boolean;
  timestamp: string;
}

export interface CompileSkillRequest {
  user_feedback: string;
  reference_task_id?: string | null;
}

export interface CompileSkillResponse {
  skill: HermesSkill;
  raw_yaml: string;
  memory_updated: boolean;
}

export interface OvernightScoutResponse {
  job_id: string;
  status: string;
  briefing_path: string;
  dependencies_checked: number;
  new_advisories_found: number;
  execution_latency_ms: number;
}
