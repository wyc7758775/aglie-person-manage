// 用户角色类型
export type UserRole = 'user' | 'superadmin';

// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  nickname: string;
  password: string;
  role?: UserRole;
};

export type LoginRequest = {
  nickname: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    nickname: string;
    isAdmin: boolean;
  };
};

export type RegisterRequest = {
  nickname: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    nickname: string;
  };
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type ProjectType = 'life' | 'code';

export type ProjectStatus = 'active' | 'completed' | 'paused' | 'planning';

export type ProjectPriority = 'high' | 'medium' | 'low';

export type Project = {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  goals: string[];
  tags: string[];
  startDate: string;
  endDate: string | null;
  progress: number;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectCreateRequest = Omit<Project, 'id' | 'progress' | 'createdAt' | 'updatedAt' | 'avatar'>;

export type ProjectUpdateRequest = Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>;

export type ProjectResponse = {
  success: boolean;
  project?: Project;
  message?: string;
};

// 需求管理类型定义
export type RequirementStatus = 'draft' | 'review' | 'approved' | 'development' | 'testing' | 'completed' | 'rejected';

export type RequirementPriority = 'critical' | 'high' | 'medium' | 'low';

export type RequirementType = 'feature' | 'enhancement' | 'bugfix' | 'research';

export type Requirement = {
  id: string;
  title: string;
  description: string;
  type: RequirementType;
  status: RequirementStatus;
  priority: RequirementPriority;
  assignee: string;
  reporter: string;
  createdDate: string;
  dueDate: string;
  storyPoints: number;
  tags: string[];
};

export type RequirementCreateRequest = Omit<Requirement, 'id'>;

export type RequirementUpdateRequest = Partial<Omit<Requirement, 'id'>>;

export type RequirementResponse = {
  success: boolean;
  requirement?: Requirement;
  message?: string;
};
