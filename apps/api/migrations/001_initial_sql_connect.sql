create table if not exists users (
  uid text primary key,
  updated_at timestamptz not null default now(),
  data jsonb not null
);

create table if not exists cycles (
  id text primary key,
  uid text not null references users(uid) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  data jsonb not null
);

create table if not exists body_measurements (
  id text primary key,
  uid text not null references users(uid) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  data jsonb not null
);

create table if not exists triage_sessions (
  id text primary key,
  uid text not null references users(uid) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  data jsonb not null
);

create table if not exists investigations (
  id text primary key,
  uid text not null references users(uid) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  data jsonb not null
);

create table if not exists operational_assessments (
  id text primary key,
  uid text not null references users(uid) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  data jsonb not null
);

create table if not exists adaptive_profiles (
  id text primary key,
  uid text not null references users(uid) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  data jsonb not null
);

create table if not exists action_plans (
  id text primary key,
  uid text not null references users(uid) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  data jsonb not null
);

create table if not exists checkins (
  id text primary key,
  uid text not null references users(uid) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  data jsonb not null
);

create table if not exists cycle_reports (
  id text primary key,
  uid text not null references users(uid) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  data jsonb not null
);

create index if not exists cycles_uid_created_at_idx on cycles(uid, created_at desc);
create index if not exists body_measurements_uid_created_at_idx on body_measurements(uid, created_at desc);
create index if not exists triage_sessions_uid_created_at_idx on triage_sessions(uid, created_at desc);
create index if not exists investigations_uid_created_at_idx on investigations(uid, created_at desc);
create index if not exists operational_assessments_uid_created_at_idx on operational_assessments(uid, created_at desc);
create index if not exists adaptive_profiles_uid_created_at_idx on adaptive_profiles(uid, created_at desc);
create index if not exists action_plans_uid_created_at_idx on action_plans(uid, created_at desc);
create index if not exists checkins_uid_created_at_idx on checkins(uid, created_at desc);
create index if not exists cycle_reports_uid_created_at_idx on cycle_reports(uid, created_at desc);
