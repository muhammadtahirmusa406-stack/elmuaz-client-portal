/**
 * ELMUAZ TECHNOLOGIES LTD
 * Internal Company Management System (EIMS)
 * TypeScript Database Definitions & Entity Models
 */

export type UserRole = 'ceo' | 'management' | 'department_head' | 'accountant' | 'employee';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus =
  | 'pending'
  | 'in_progress'
  | 'submitted'
  | 'under_review'
  | 'needs_correction'
  | 'approved'
  | 'completed'
  | 'cancelled';

export type MeetingType = 'general' | 'department' | 'specific';
export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type AttendanceStatus = 'invited' | 'accepted' | 'declined' | 'attended' | 'absent';

export type PaymentStatus = 'pending' | 'approved' | 'processing' | 'successful' | 'failed' | 'rejected';
export type PaymentType =
  | 'salary'
  | 'contract_payment'
  | 'reimbursement'
  | 'vendor_expense'
  | 'client_invoice'
  | 'bonus';

export type NotificationType =
  | 'task_assigned'
  | 'task_status_changed'
  | 'task_comment'
  | 'meeting_invite'
  | 'announcement'
  | 'payment_update'
  | 'correction_required'
  | 'system_alert';

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  head_user_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string; // matches auth.users.id
  employee_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  department_id?: string;
  department?: Department;
  position_title?: string;
  rank_level?: string;
  salary?: number;
  date_of_joining: string;
  status: 'active' | 'pending_approval' | 'rejected' | 'on_leave' | 'probation' | 'terminated' | 'suspended';
  auth_provider?: 'email' | 'google';
  approved_by?: string;
  approved_at?: string;
  settings?: {
    theme?: string;
    email_notifications?: boolean;
    whatsapp_alerts?: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  code?: string;
  description?: string;
  department_id: string;
  department?: Department;
  client_name?: string;
  lead_user_id?: string;
  lead?: Profile;
  start_date?: string;
  due_date?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
  budget: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  project?: Project;
  department_id?: string;
  department?: Department;
  title: string;
  instructions: string;
  assigned_to: string;
  assignee?: Profile;
  assigned_by: string;
  creator?: Profile;
  reviewer_id?: string;
  reviewer?: Profile;
  priority: TaskPriority;
  status: TaskStatus;
  progress_percentage: number;
  deadline: string;
  submitted_at?: string;
  reviewed_at?: string;
  completed_at?: string;
  correction_notes?: string;
  comments?: TaskComment[];
  files?: TaskFile[];
  created_at: string;
  updated_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  author_id: string;
  author?: Profile;
  comment: string;
  is_internal_review: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskFile {
  id: string;
  task_id: string;
  uploaded_by: string;
  uploader?: Profile;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size_bytes?: number;
  is_submission_deliverable: boolean;
  version_number: number;
  created_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  agenda?: string;
  meeting_type: MeetingType;
  department_id?: string;
  department?: Department;
  host_user_id: string;
  host?: Profile;
  scheduled_start: string;
  scheduled_end: string;
  meeting_link?: string;
  status: MeetingStatus;
  participants?: MeetingParticipant[];
  notes?: MeetingNote[];
  created_at: string;
  updated_at: string;
}

export interface MeetingParticipant {
  id: string;
  meeting_id: string;
  user_id: string;
  user?: Profile;
  attendance_status: AttendanceStatus;
  joined_at?: string;
  left_at?: string;
  created_at: string;
}

export interface MeetingNote {
  id: string;
  meeting_id: string;
  author_id: string;
  author?: Profile;
  notes: string;
  action_items?: Array<{
    item: string;
    assignee_id?: string;
    due_date?: string;
    done?: boolean;
  }>;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  reference_no: string;
  title: string;
  description?: string;
  payment_type: PaymentType;
  recipient_user_id?: string;
  recipient?: Profile;
  requested_by: string;
  requester?: Profile;
  approved_by?: string;
  approver?: Profile;
  amount: number;
  currency: string;
  status: PaymentStatus;
  due_date?: string;
  paid_at?: string;
  notes?: string;
  transactions?: PaymentTransaction[];
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  payment_id: string;
  gateway_provider: string; // 'paystack'
  gateway_reference: string;
  channel?: string;
  amount_paid: number;
  fees: number;
  currency: string;
  gateway_status: string;
  gateway_response?: Record<string, unknown>;
  paid_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  sender_id?: string;
  sender?: Profile;
  type: NotificationType;
  title: string;
  message: string;
  link_url?: string;
  requires_acknowledgment: boolean;
  is_read: boolean;
  read_at?: string;
  is_acknowledged: boolean;
  acknowledged_at?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  user?: Profile;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
