-- ═══════════════════════════════
-- رافد — Database Migration 001
-- Initial Schema
-- ═══════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PLATFORMS TABLE
create table if not exists platforms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null check (category in ('teacher','admin','parent','external')),
  is_official boolean default true,
  description text,
  url text,
  status text default 'active' check (status in ('active','maintenance','suspended')),
  icon text,
  order_index integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. ISSUES TABLE
create table if not exists issues (
  id uuid default gen_random_uuid() primary key,
  ticket_number text unique,
  platform_id uuid references platforms(id) on delete set null,
  user_type text not null check (user_type in ('teacher','admin','parent','employee')),
  wilaya text not null,
  description text not null,
  contact text,
  anonymous boolean default false,
  status text default 'new' check (status in ('new','processing','solved','escalated')),
  solution text,
  ai_diagnosis text,
  priority text default 'normal' check (priority in ('low','normal','high','critical')),
  internal_notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  resolved_at timestamp with time zone
);

-- Auto-generate ticket number
create or replace function generate_ticket_number()
returns trigger as $$
begin
  new.ticket_number := 'RAF-' || upper(substr(gen_random_uuid()::text, 1, 8));
  return new;
end;
$$ language plpgsql;

drop trigger if exists issues_ticket_number on issues;
create trigger issues_ticket_number before insert on issues
  for each row when (new.ticket_number is null)
  execute function generate_ticket_number();

-- 3. CONTENT TABLE
create table if not exists content (
  id uuid default gen_random_uuid() primary key,
  platform_id uuid references platforms(id) on delete set null,
  title text not null,
  slug text unique not null,
  type text not null check (type in ('video','article','faq')),
  body text,
  video_url text,
  thumbnail text,
  tags text[] default '{}',
  views integer default 0,
  published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. REPORTS TABLE
create table if not exists reports (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  period text not null check (period in ('weekly','monthly')),
  period_start date not null,
  period_end date not null,
  platform_id uuid references platforms(id) on delete set null,
  total_issues integer default 0,
  new_issues integer default 0,
  solved_issues integer default 0,
  escalated_issues integer default 0,
  top_problem text,
  wilaya_breakdown jsonb default '{}',
  category_breakdown jsonb default '{}',
  summary text,
  generated_at timestamp with time zone default now()
);

-- 5. PROFILES TABLE
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text default 'admin' check (role in ('admin','superadmin')),
  wilaya text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- INDEXES
create index if not exists idx_issues_status on issues(status);
create index if not exists idx_issues_platform_id on issues(platform_id);
create index if not exists idx_issues_wilaya on issues(wilaya);
create index if not exists idx_issues_created_at on issues(created_at desc);
create index if not exists idx_content_platform_id on content(platform_id);
create index if not exists idx_content_published on content(published);
create index if not exists idx_content_slug on content(slug);

-- TRIGGERS for updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists issues_updated_at on issues;
create trigger issues_updated_at before update on issues
  for each row execute function update_updated_at();

drop trigger if exists content_updated_at on content;
create trigger content_updated_at before update on content
  for each row execute function update_updated_at();

drop trigger if exists platforms_updated_at on platforms;
create trigger platforms_updated_at before update on platforms
  for each row execute function update_updated_at();

-- ROW LEVEL SECURITY
alter table issues enable row level security;
alter table profiles enable row level security;
alter table content enable row level security;
alter table platforms enable row level security;
alter table reports enable row level security;

-- Policies
drop policy if exists "Anyone can insert issues" on issues;
create policy "Anyone can insert issues" on issues for insert with check (true);

drop policy if exists "Anyone can view solved issues" on issues;
create policy "Anyone can view solved issues" on issues for select using (status = 'solved');

drop policy if exists "Anyone can view published content" on content;
create policy "Anyone can view published content" on content for select using (published = true);

drop policy if exists "Anyone can view active platforms" on platforms;
create policy "Anyone can view active platforms" on platforms for select using (status = 'active');

drop policy if exists "Authenticated users full access issues" on issues;
create policy "Authenticated users full access issues" on issues for all using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users full access content" on content;
create policy "Authenticated users full access content" on content for all using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users full access platforms" on platforms;
create policy "Authenticated users full access platforms" on platforms for all using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users full access reports" on reports;
create policy "Authenticated users full access reports" on reports for all using (auth.role() = 'authenticated');

drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- SEED DATA
insert into platforms (name, category, is_official, description, order_index) values
('فضاء الأستاذ', 'teacher', true, 'منصة العمل اليومي للأستاذ الجزائري', 1),
('منصة تقييم المكتسبات', 'teacher', true, 'تقييم وتسجيل نتائج التلاميذ إلكترونياً', 2),
('منصة موظف', 'teacher', true, 'الخدمات الإدارية الرقمية للموظف', 3),
('الامتحانات المهنية للرتب', 'teacher', true, 'التسجيل في المسابقات والامتحانات المهنية', 4),
('فضاء المؤسسة', 'admin', true, 'منصة إدارة المؤسسة التربوية', 5),
('جدول المستجدات التربوية الإدارية', 'admin', true, 'آخر المستجدات والقرارات الإدارية', 6),
('فضاء الأولياء', 'parent', true, 'منصة متابعة الأبناء رقمياً', 7),
('موقع الديوان الوطني للامتحانات والمسابقات', 'parent', true, 'نتائج الامتحانات الرسمية الوطنية', 8),
('مسابقات التوظيف', 'parent', true, 'مسابقات توظيف الأساتذة والإداريين', 9),
('برامج تسيير امتحانات الباك والبيام', 'external', false, 'برامج مراكز الإجراء — غير رسمية', 10)
on conflict do nothing;
