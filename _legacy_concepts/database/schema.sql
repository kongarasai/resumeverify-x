-- ResumeVerify X™ Database Schema
-- PostgreSQL

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('candidate','teacher','mentor','recruiter','placement_officer','university_admin','company_admin','super_admin')),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url VARCHAR(500),
  phone VARCHAR(20),
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  two_fa_enabled BOOLEAN DEFAULT false,
  two_fa_secret VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Universities
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url VARCHAR(500),
  location VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free',
  is_approved BOOLEAN DEFAULT false,
  admin_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidates (extends users for role=candidate)
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  university_id UUID REFERENCES universities(id),
  department_id UUID REFERENCES departments(id),
  graduation_year INT,
  cgpa DECIMAL(4,2),
  resume_url VARCHAR(500),
  github_username VARCHAR(100),
  leetcode_username VARCHAR(100),
  linkedin_url VARCHAR(500),
  hackerrank_username VARCHAR(100),
  target_role VARCHAR(255),
  target_company VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trust Scores
CREATE TABLE trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  total_score DECIMAL(5,2),
  resume_score DECIMAL(5,2),
  github_score DECIMAL(5,2),
  leetcode_score DECIMAL(5,2),
  project_score DECIMAL(5,2),
  communication_score DECIMAL(5,2),
  fraud_risk_score DECIMAL(5,2),
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_explanation TEXT
);

-- Fraud Analysis
CREATE TABLE fraud_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  fraud_probability DECIMAL(5,2),
  flags JSONB,
  evidence TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  tech_stack TEXT[],
  originality_score DECIMAL(5,2),
  is_verified BOOLEAN DEFAULT false,
  skill_proof_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups (Batches / Classrooms)
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  university_id UUID REFERENCES universities(id),
  department_id UUID REFERENCES departments(id),
  created_by UUID REFERENCES users(id),
  group_type VARCHAR(50) DEFAULT 'classroom',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group Members
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Assignments
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id),
  title VARCHAR(255),
  description TEXT,
  type VARCHAR(50) DEFAULT 'coding',
  due_date TIMESTAMPTZ,
  max_marks INT DEFAULT 100,
  is_published BOOLEAN DEFAULT false,
  plagiarism_check BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coding Submissions
CREATE TABLE coding_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id),
  candidate_id UUID REFERENCES candidates(id),
  code TEXT,
  language VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  score DECIMAL(5,2),
  test_cases_passed INT,
  test_cases_total INT,
  runtime_ms INT,
  memory_mb DECIMAL(6,2),
  integrity_score DECIMAL(5,2),
  tab_switches INT DEFAULT 0,
  paste_count INT DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Rooms
CREATE TABLE interview_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255),
  room_type VARCHAR(50) DEFAULT 'technical',
  host_id UUID REFERENCES users(id),
  candidate_id UUID REFERENCES candidates(id),
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'scheduled',
  video_url VARCHAR(500),
  transcript TEXT,
  whiteboard_data JSONB,
  integrity_score DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Scorecards
CREATE TABLE interview_scorecards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES interview_rooms(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES users(id),
  problem_solving INT,
  code_quality INT,
  communication INT,
  time_management INT,
  cultural_fit INT,
  overall_score DECIMAL(5,2),
  recommendation VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Panels
CREATE TABLE interview_panels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES interview_rooms(id) ON DELETE CASCADE,
  panelist_id UUID REFERENCES users(id),
  role VARCHAR(100),
  joined_at TIMESTAMPTZ
);

-- Rankings
CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  university_id UUID REFERENCES universities(id),
  department_id UUID REFERENCES departments(id),
  total_xp INT DEFAULT 0,
  coding_xp INT DEFAULT 0,
  interview_xp INT DEFAULT 0,
  project_xp INT DEFAULT 0,
  department_rank INT,
  university_rank INT,
  national_rank INT,
  streak_days INT DEFAULT 0,
  badges TEXT[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  job_type VARCHAR(50),
  salary_min INT,
  salary_max INT,
  required_skills TEXT[],
  min_trust_score INT DEFAULT 0,
  min_cgpa DECIMAL(4,2),
  is_active BOOLEAN DEFAULT true,
  application_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'applied',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

-- Candidate Pipeline (Recruiter view)
CREATE TABLE candidate_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID REFERENCES users(id),
  candidate_id UUID REFERENCES candidates(id),
  job_id UUID REFERENCES jobs(id),
  stage VARCHAR(100) DEFAULT 'applied',
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  body TEXT,
  type VARCHAR(100),
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  group_id UUID REFERENCES groups(id),
  content TEXT,
  message_type VARCHAR(50) DEFAULT 'text',
  file_url VARCHAR(500),
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Career Growth
CREATE TABLE career_growth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  placement_readiness DECIMAL(5,2),
  career_health_score DECIMAL(5,2),
  salary_prediction_1yr INT,
  salary_prediction_2yr INT,
  recommended_companies TEXT[],
  weak_skills TEXT[],
  strong_skills TEXT[],
  ai_roadmap JSONB,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial Analytics
CREATE TABLE financial_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  internship_income DECIMAL(10,2),
  freelance_income DECIMAL(10,2),
  hackathon_winnings DECIMAL(10,2),
  learning_expenses DECIMAL(10,2),
  month DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Reports
CREATE TABLE ai_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id),
  report_type VARCHAR(100),
  content JSONB,
  model_used VARCHAR(100),
  tokens_used INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255),
  entity_type VARCHAR(100),
  entity_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50),
  entity_id UUID,
  plan VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  monthly_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill Proofs (video walkthroughs)
CREATE TABLE skill_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  title VARCHAR(255),
  proof_type VARCHAR(50),
  video_url VARCHAR(500),
  duration_seconds INT,
  ai_confidence_score DECIMAL(5,2),
  ai_originality_score DECIMAL(5,2),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  name VARCHAR(255),
  issuer VARCHAR(255),
  credential_id VARCHAR(255),
  credential_url VARCHAR(500),
  issued_date DATE,
  expiry_date DATE,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trust_scores_candidate ON trust_scores(candidate_id);
CREATE INDEX idx_submissions_assignment ON coding_submissions(assignment_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_rankings_dept ON rankings(department_id, department_rank);
CREATE INDEX idx_job_apps_candidate ON job_applications(candidate_id);

