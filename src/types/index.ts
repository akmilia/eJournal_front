export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface Subject {
  id: number;
  name: string;
  credits: number;
}

export interface GroupInfo {
  group_id: number;
  group_name: string;
  group_subject_id: number;
  semester: number;
}

export interface JournalListItem {
  group_subject_id: number;
  group_name: string;
  subject_name: string;
  semester: number;
}

export interface ColumnConfig {
  key: string;
  title: string;
  type: 'number' | 'bool' | 'text';
  max_score?: number;
}

export interface StudentRow {
  student_id: number;
  name: string;
  record_id: number;   // <-- ДОБАВЛЯЕМ
  values: Record<string, any>;
}
export interface JournalData {
  group_subject_id: number;
  columns_config: ColumnConfig[];
  students: StudentRow[];
}

export interface AddColumnRequest {
  title: string;
  type: 'number' | 'bool' | 'text';
  max_score?: number;
}

export interface UpdateCellRequest {
  field: string;
  value: any;
} 

export interface Subject {
  id: number;
  name: string;
  credits: number;
}

export interface GroupInfo {
  group_id: number;
  group_name: string;
  group_subject_id: number;
  semester: number;
}

export interface JournalListItem {
  group_subject_id: number;
  group_name: string;
  subject_name: string;
  semester: number;
}