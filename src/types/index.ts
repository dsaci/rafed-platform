/* ═══════════════════════════════
   رافد — TypeScript Types
   ═══════════════════════════════ */

// ── Database Enums ──
export type PlatformCategory = 'teacher' | 'admin' | 'parent' | 'external';
export type PlatformStatus = 'active' | 'maintenance' | 'suspended';
export type UserType = 'teacher' | 'admin' | 'parent' | 'employee';
export type IssueStatus = 'new' | 'processing' | 'solved' | 'escalated';
export type IssuePriority = 'low' | 'normal' | 'high' | 'critical';
export type ContentType = 'video' | 'article' | 'faq';
export type ReportPeriod = 'weekly' | 'monthly';
export type ProfileRole = 'admin' | 'superadmin';

// ── Database Models ──
export interface Platform {
  id: string;
  name: string;
  category: PlatformCategory;
  is_official: boolean;
  description: string | null;
  url: string | null;
  status: PlatformStatus;
  icon: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: string;
  ticket_number: string;
  platform_id: string | null;
  user_type: UserType;
  wilaya: string;
  description: string;
  contact: string | null;
  anonymous: boolean;
  status: IssueStatus;
  solution: string | null;
  ai_diagnosis: string | null;
  priority: IssuePriority;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  // Joined
  platform?: Platform;
}

export interface Content {
  id: string;
  platform_id: string | null;
  title: string;
  slug: string;
  type: ContentType;
  body: string | null;
  video_url: string | null;
  thumbnail: string | null;
  tags: string[];
  views: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  platform?: Platform;
}

export interface Report {
  id: string;
  title: string;
  period: ReportPeriod;
  period_start: string;
  period_end: string;
  platform_id: string | null;
  total_issues: number;
  new_issues: number;
  solved_issues: number;
  escalated_issues: number;
  top_problem: string | null;
  wilaya_breakdown: Record<string, number>;
  category_breakdown: Record<string, number>;
  summary: string | null;
  generated_at: string;
  // Joined
  platform?: Platform;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: ProfileRole;
  wilaya: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// ── API Types ──
export interface DiagnoseRequest {
  issueId: string;
  description: string;
  platformName: string;
  userType: UserType;
  wilaya: string;
}

export interface DiagnoseResponse {
  diagnosis: string;
  solution_steps: string[];
  confidence: 'high' | 'medium' | 'low';
  should_escalate: boolean;
  escalation_reason: string | null;
}

export interface IssueFormData {
  platform_id: string;
  user_type: UserType;
  wilaya: string;
  description: string;
  contact: string;
  anonymous: boolean;
}

export interface ContentFormData {
  platform_id: string;
  title: string;
  slug: string;
  type: ContentType;
  body: string;
  video_url: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

// ── Stats ──
export interface DashboardStats {
  totalIssues: number;
  newIssues: number;
  processingIssues: number;
  solvedIssues: number;
  escalatedIssues: number;
  totalPlatforms: number;
  totalContent: number;
}

export interface HomeStats {
  solvedIssues: number;
  totalPlatforms: number;
  totalWilayas: number;
  totalIssues: number;
}

// ── UI Types ──
export interface NavLink {
  label: string;
  href: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

