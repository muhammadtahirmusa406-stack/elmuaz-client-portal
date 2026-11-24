-- ============================================================
-- ELMUAZ TECHNOLOGIES LTD (EIMS)
-- Row Level Security (RLS) Policies & Access Control
-- ============================================================

-- 1. Enable RLS on all operational tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check current user role
CREATE OR REPLACE FUNCTION get_auth_role()
RETURNS user_role_enum AS $$
    SELECT role FROM profiles WHERE id = auth.uid() AND status = 'active';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function to check if caller is active
CREATE OR REPLACE FUNCTION is_active_staff()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND status = 'active');
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- 2. PROFILES POLICIES
-- ============================================================
-- Only active authenticated users can view coworker profiles
CREATE POLICY "Active staff can view coworker profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (is_active_staff() OR id = auth.uid());

-- Self registration (signup): creates profile in 'pending_approval' status
CREATE POLICY "New users can self-register profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (
        id = auth.uid() 
        AND status = 'pending_approval'
        AND role = 'employee'
    );

-- Users can update own personal info (avatar, phone, settings)
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid() AND status = 'active')
    WITH CHECK (
        id = auth.uid() 
        AND role = (SELECT role FROM profiles WHERE id = auth.uid()) -- Cannot elevate role
    );

-- CEO / Management has full control over profiles (approve, decline, create employee)
CREATE POLICY "CEO full control over profiles and onboarding"
    ON profiles FOR ALL
    TO authenticated
    USING (get_auth_role() IN ('ceo', 'management'))
    WITH CHECK (get_auth_role() IN ('ceo', 'management'));

-- ============================================================
-- 3. DEPARTMENTS POLICIES
-- ============================================================
CREATE POLICY "Departments viewable by authenticated staff"
    ON departments FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Management can manage departments"
    ON departments FOR ALL
    TO authenticated
    USING (get_auth_role() IN ('ceo', 'management'));

-- ============================================================
-- 4. TASKS & WORK POLICIES (8-Stage Workflow Enforcement)
-- ============================================================
-- CEO & Management see all tasks
CREATE POLICY "Management full access to tasks"
    ON tasks FOR ALL
    TO authenticated
    USING (get_auth_role() IN ('ceo', 'management'));

-- Department Heads see their department's tasks
CREATE POLICY "Department heads manage department tasks"
    ON tasks FOR ALL
    TO authenticated
    USING (
        get_auth_role() = 'department_head'
        AND department_id = (SELECT department_id FROM profiles WHERE id = auth.uid())
    );

-- Employees see tasks assigned to them or assigned by them
CREATE POLICY "Employees can view own assigned tasks"
    ON tasks FOR SELECT
    TO authenticated
    USING (assigned_to = auth.uid() OR assigned_by = auth.uid());

CREATE POLICY "Employees can update progress and submit own tasks"
    ON tasks FOR UPDATE
    TO authenticated
    USING (assigned_to = auth.uid())
    WITH CHECK (assigned_to = auth.uid());

-- ============================================================
-- 5. TASK COMMENTS & FILES POLICIES
-- ============================================================
CREATE POLICY "Task comments visible to task participants"
    ON task_comments FOR SELECT
    TO authenticated
    USING (
        get_auth_role() IN ('ceo', 'management')
        OR EXISTS (
            SELECT 1 FROM tasks t 
            WHERE t.id = task_comments.task_id 
            AND (t.assigned_to = auth.uid() OR t.assigned_by = auth.uid() OR t.reviewer_id = auth.uid())
        )
    );

CREATE POLICY "Authenticated users can comment on their tasks"
    ON task_comments FOR INSERT
    TO authenticated
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Task files accessible to task stakeholders"
    ON task_files FOR ALL
    TO authenticated
    USING (
        get_auth_role() IN ('ceo', 'management')
        OR uploaded_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM tasks t 
            WHERE t.id = task_files.task_id 
            AND (t.assigned_to = auth.uid() OR t.reviewer_id = auth.uid())
        )
    );

-- ============================================================
-- 6. MEETINGS POLICIES
-- ============================================================
CREATE POLICY "Users can view meetings they are part of"
    ON meetings FOR SELECT
    TO authenticated
    USING (
        get_auth_role() IN ('ceo', 'management')
        OR host_user_id = auth.uid()
        OR meeting_type = 'general'
        OR (meeting_type = 'department' AND department_id = (SELECT department_id FROM profiles WHERE id = auth.uid()))
        OR EXISTS (
            SELECT 1 FROM meeting_participants mp
            WHERE mp.meeting_id = meetings.id AND mp.user_id = auth.uid()
        )
    );

CREATE POLICY "Host or Management can manage meetings"
    ON meetings FOR ALL
    TO authenticated
    USING (get_auth_role() IN ('ceo', 'management') OR host_user_id = auth.uid());

-- ============================================================
-- 7. FINANCE & PAYMENTS POLICIES (Least Privilege Protection)
-- ============================================================
CREATE POLICY "Finance visibility strictly restricted"
    ON payments FOR SELECT
    TO authenticated
    USING (
        get_auth_role() IN ('ceo', 'management', 'accountant')
        OR recipient_user_id = auth.uid() -- Employee sees only their own salary/disbursements
    );

CREATE POLICY "Accountant and Management can manage payments"
    ON payments FOR ALL
    TO authenticated
    USING (get_auth_role() IN ('ceo', 'management', 'accountant'));

CREATE POLICY "Transactions restricted to finance"
    ON payment_transactions FOR ALL
    TO authenticated
    USING (get_auth_role() IN ('ceo', 'management', 'accountant'));

-- ============================================================
-- 8. NOTIFICATIONS POLICIES
-- ============================================================
CREATE POLICY "Users view only their own notifications"
    ON notifications FOR SELECT
    TO authenticated
    USING (recipient_id = auth.uid());

CREATE POLICY "Users can mark own notifications read/acknowledged"
    ON notifications FOR UPDATE
    TO authenticated
    USING (recipient_id = auth.uid())
    WITH CHECK (recipient_id = auth.uid());

-- ============================================================
-- 9. ACTIVITY LOGS AUDIT POLICIES
-- ============================================================
-- Immutable: Insert allowed, no updates, no deletes except by system
CREATE POLICY "Audit logs insertable by system/authenticated"
    ON activity_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Only CEO and Management can view audit history
CREATE POLICY "Audit logs visible only to CEO and Management"
    ON activity_logs FOR SELECT
    TO authenticated
    USING (get_auth_role() IN ('ceo', 'management'));
