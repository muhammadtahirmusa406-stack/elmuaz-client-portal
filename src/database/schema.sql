-- ============================================================
-- ELMUAZ TECHNOLOGIES LTD
-- Internal Company Management System (EIMS) / Portal Database Schema
-- Architecture & Implementation for PostgreSQL / Supabase
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. ENUMS & DOMAINS
-- ============================================================

CREATE TYPE user_role_enum AS ENUM (
    'ceo',
    'management',
    'department_head',
    'accountant',
    'employee'
);

CREATE TYPE task_priority_enum AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);

CREATE TYPE task_status_enum AS ENUM (
    'pending',
    'in_progress',
    'submitted',
    'under_review',
    'needs_correction',
    'approved',
    'completed',
    'cancelled'
);

CREATE TYPE meeting_type_enum AS ENUM (
    'general',
    'department',
    'specific'
);

CREATE TYPE meeting_status_enum AS ENUM (
    'scheduled',
    'in_progress',
    'completed',
    'cancelled'
);

CREATE TYPE payment_status_enum AS ENUM (
    'pending',
    'approved',
    'processing',
    'successful',
    'failed',
    'rejected'
);

CREATE TYPE payment_type_enum AS ENUM (
    'salary',
    'contract_payment',
    'reimbursement',
    'vendor_expense',
    'client_invoice',
    'bonus'
);

CREATE TYPE notification_type_enum AS ENUM (
    'task_assigned',
    'task_status_changed',
    'task_comment',
    'meeting_invite',
    'announcement',
    'payment_update',
    'correction_required',
    'system_alert'
);

-- ============================================================
-- 2. CORE IDENTITY & ORGANIZATION
-- ============================================================

-- Departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    head_user_id UUID, -- Foreign key added via ALTER TABLE below
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table linked directly to auth.users
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30),
    avatar_url TEXT,
    role user_role_enum NOT NULL DEFAULT 'employee',
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    position_title VARCHAR(150),
    rank_level VARCHAR(50),
    salary NUMERIC(15, 2) DEFAULT 0.00,
    date_of_joining DATE DEFAULT CURRENT_DATE,
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'pending_approval', 'rejected', 'on_leave', 'probation', 'terminated', 'suspended')),
    auth_provider VARCHAR(50) DEFAULT 'email' CHECK (auth_provider IN ('email', 'google')),
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    emergency_contact JSONB,
    settings JSONB DEFAULT '{"theme": "liquid_glass", "email_notifications": true, "whatsapp_alerts": false}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles
    ADD CONSTRAINT fk_profiles_approved_by
    FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;

-- Connect department head back to profiles
ALTER TABLE departments
    ADD CONSTRAINT fk_department_head
    FOREIGN KEY (head_user_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Role permissions lookup table (RBAC granular capabilities)
CREATE TABLE roles_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role_enum NOT NULL,
    module VARCHAR(80) NOT NULL,
    can_create BOOLEAN DEFAULT FALSE,
    can_read BOOLEAN DEFAULT TRUE,
    can_update BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_approve BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_role_module UNIQUE(role, module)
);

-- ============================================================
-- 3. PROJECTS & TASKS
-- ============================================================

-- Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE,
    description TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    client_name VARCHAR(150),
    lead_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    start_date DATE,
    due_date DATE,
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'archived')),
    budget NUMERIC(15, 2) DEFAULT 0.00,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    assigned_to UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES profiles(id),
    reviewer_id UUID REFERENCES profiles(id),
    priority task_priority_enum DEFAULT 'medium',
    status task_status_enum DEFAULT 'pending',
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    deadline TIMESTAMPTZ NOT NULL,
    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    correction_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task Comments (Internal Discussions)
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    is_internal_review BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task Files & Attachments (Work Deliverables)
CREATE TABLE task_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size_bytes BIGINT,
    is_submission_deliverable BOOLEAN DEFAULT FALSE,
    version_number INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. MEETINGS & COLLABORATION
-- ============================================================

-- Meetings Table
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    agenda TEXT,
    meeting_type meeting_type_enum DEFAULT 'general',
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    host_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    meeting_link TEXT, -- Google Meet or WebRTC room
    status meeting_status_enum DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting Participants
CREATE TABLE meeting_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    attendance_status VARCHAR(20) DEFAULT 'invited' CHECK (attendance_status IN ('invited', 'accepted', 'declined', 'attended', 'absent')),
    joined_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_meeting_participant UNIQUE (meeting_id, user_id)
);

-- Meeting Notes & Minutes
CREATE TABLE meeting_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    notes TEXT NOT NULL,
    action_items JSONB DEFAULT '[]'::JSONB,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. FINANCE & PAYMENTS
-- ============================================================

-- Payments Table (High-Level Finance Record)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_no VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    payment_type payment_type_enum NOT NULL,
    recipient_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    requested_by UUID NOT NULL REFERENCES profiles(id),
    approved_by UUID REFERENCES profiles(id),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(10) DEFAULT 'NGN',
    status payment_status_enum DEFAULT 'pending',
    due_date DATE,
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Transactions (Paystack / Gateway Integration)
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    gateway_provider VARCHAR(50) DEFAULT 'paystack',
    gateway_reference VARCHAR(150) UNIQUE NOT NULL,
    channel VARCHAR(50), -- card, bank_transfer, ussd
    amount_paid NUMERIC(15, 2) NOT NULL,
    fees NUMERIC(15, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'NGN',
    gateway_status VARCHAR(50) NOT NULL,
    gateway_response JSONB,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. NOTIFICATIONS & COMMUNICATION
-- ============================================================

-- Notifications Table (with acknowledgment support)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    type notification_type_enum NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    requires_acknowledgment BOOLEAN DEFAULT FALSE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. AUDIT & ACTIVITY LOGS
-- ============================================================

-- Activity Logs (Immutable administrative security trail)
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g., 'task.approved', 'user.login', 'payment.disbursed'
    entity_type VARCHAR(80) NOT NULL, -- e.g., 'task', 'payment', 'user', 'meeting'
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. INDEXES FOR HIGH PERFORMANCE
-- ============================================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_department ON profiles(department_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_task_comments_task ON task_comments(task_id);
CREATE INDEX idx_task_files_task ON task_files(task_id);
CREATE INDEX idx_meetings_schedule ON meetings(scheduled_start);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);

-- ============================================================
-- 9. TRIGGERS & UTILITY FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on auth.user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Employee'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role_enum, 'employee')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-log critical actions to activity_logs
CREATE OR REPLACE FUNCTION log_task_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata)
        VALUES (
            COALESCE(NEW.reviewer_id, NEW.assigned_to),
            'task.status_changed',
            'task',
            NEW.id,
            jsonb_build_object(
                'from_status', OLD.status,
                'to_status', NEW.status,
                'task_title', NEW.title
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_task_status_audit
    AFTER UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION log_task_status_change();
