export type LoginPayload = {
  username: string;
  password: string;
};

/** @deprecated use username */
export type LegacyLoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  requires_context_selection?: boolean;
  available_contexts?: Array<"employee" | "student">;
  active_context?: "employee" | "student";
  csrf_token?: string;
  id?: number | null;
  access?: string;
  refresh?: string;
};

// Вложенный декодированный объект user_data из access токена (legacy JWT)
interface UserData {
  id: number;
  user: number;
  unique_code_user: string;
  first_name: string;
  surname: string;
  last_name: string;
  number_phone: string;
  imeag: string;
  gender: string;
  data_of_birth: string;
  email: string;
  is_head_of: boolean;
  is_super_singer_kpi: boolean;
  is_admin_human_department: boolean;
  is_admin_reference: boolean;
  is_admin_it_department: boolean;
  is_admin_create_discipline: boolean;
  is_singer_kpi: boolean;
  is_mol_of: boolean;
  is_admin_of: boolean;
  is_support_of: boolean;
  is_admin_kpi: boolean;
  calendar: boolean;
  chat: boolean;
  conversion: boolean;
  is_univer_admin: boolean;
  order: boolean;
  statistic: boolean;
  struct: boolean;
  task: boolean;
  is_order_regist_of: boolean;
  auditor_fund: boolean;
  capacity: boolean;
  discipline: boolean;
  flow: boolean;
  kpi: boolean;
  registration: boolean;
  report: boolean;
  rup: boolean;
  support: boolean;
  is_admin_of_news: boolean;
  is_admin_entrant: boolean;
  is_zakupki_admin: boolean;
  stavka: number;
  pin: string;
  position: string;
  user_type: string;
  is_stud: boolean;
  is_online: boolean;
  is_superuser: boolean;
  alert_number: number;
  journal_order: boolean;
  id_institute: number;
  univer_branch: number;
  efficiency: number;
  is_zakupki_head: boolean;
  division: string;
  univer_branch_name: string;
  is_student: boolean;
  is_employee: boolean;
  role: string;
}

export interface DecodedJWT {
  user_data: UserData;
}
