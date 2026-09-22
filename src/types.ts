import type { ClipboardEvent, FormEvent } from 'react';

export type Role = 'customer' | 'worker' | 'admin';
export type AppPage = 'login' | 'otp' | 'customer-registration' | 'worker-registration' | 'success' | 'worker-pending' | 'dashboard';
export type WorkerFilter = 'all' | 'nearby' | 'rated' | 'available';

export interface Session {
  role?: Role;
  name?: string;
  phone?: string;
  location?: string;
  skills?: string[];
  experience?: string;
  workerVerification?: 'pending' | null;
}

export interface AdminCredentials { id: string; password: string; }
export interface OtpInput { current?: HTMLInputElement | null; }
export interface CustomerRegistration { step: 1 | 2; name: string; phone: string; otpSent: boolean; }
export interface WorkerRegistration { step: 1 | 2 | 3 | 4; name: string; phone: string; otpSent: boolean; aadhaar: string; aadhaarOtp: string; aadhaarVerified: boolean; skills: string[]; experience: string; consented: boolean; }

export interface HouseholdCategory {
  id: string;
  icon: string;
  name: string;
  description: string;
  workerLabel: string;
  workerType: string;
  workerCopy: string;
  issues: string[];
}

export interface PopularProblem { categoryId: string; issue: string; icon: string; label: string; description: string; }
export interface WorkerProfile { name: string; age: number; rating: number; reviews: number; distance: number; time: number; status: 'Available now' | 'Busy now'; rate: number; hue: string; skills: string[]; }
export interface HomeRepairState { view: 'home' | 'categories' | 'issues' | 'workers'; category: HouseholdCategory | null; issue: string; filter: WorkerFilter; workers: WorkerProfile[]; }
export interface DashboardContent { heading: string; copy: string; taskTitle: string; taskText: string; }

export interface AppState {
  page: AppPage;
  role: Role;
  session: Session;
  phone: string;
  admin: AdminCredentials;
  otp: string[];
  toast: string;
  customerRegistration: CustomerRegistration;
  workerRegistration: WorkerRegistration;
  profileOpen: boolean;
  searchQuery: string;
  dashboard: DashboardContent;
  homeRepair: HomeRepairState;
}

export interface AppActions {
  setRole: (role: Role) => void;
  setPhone: (value: string) => void;
  setAdminId: (id: string) => void;
  setAdminPassword: (password: string) => void;
  setOtpInputRef: (index: number, node: HTMLInputElement | null) => void;
  setOtpDigit: (index: number, value: string) => void;
  pasteOtp: (event: ClipboardEvent<HTMLInputElement>) => void;
  focusPreviousOtp: (index: number, isEmpty: boolean) => void;
  login: (event: FormEvent<HTMLFormElement>) => void;
  startRegistration: () => void;
  verifyLoginOtp: (event: FormEvent<HTMLFormElement>) => void;
  resendOtp: () => void;
  showToast: (message: string) => void;
  goToLogin: () => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  sendCustomerOtp: () => void;
  submitCustomerRegistration: (event: FormEvent<HTMLFormElement>) => void;
  backCustomerRegistration: () => void;
  setWorkerName: (name: string) => void;
  setWorkerPhone: (phone: string) => void;
  setWorkerAadhaar: (aadhaar: string) => void;
  setWorkerAadhaarOtp: (otp: string) => void;
  setWorkerExperience: (experience: string) => void;
  setWorkerConsent: (consented: boolean) => void;
  sendWorkerOtp: () => void;
  verifyAadhaar: () => void;
  toggleWorkerSkill: (skill: string) => void;
  submitWorkerRegistration: (event: FormEvent<HTMLFormElement>) => void;
  backWorkerRegistration: () => void;
  continueToDashboard: () => void;
  toggleProfile: () => void;
  signOut: () => void;
  setSearchQuery: (query: string) => void;
  searchDashboard: (event: FormEvent<HTMLFormElement>) => void;
  openHomeRepair: () => void;
  chooseHouseholdCategory: (category: HouseholdCategory) => void;
  chooseHouseholdIssue: (issue: string) => void;
  openPopularProblem: (categoryId: string, issue: string) => void;
  goBackInHomeRepair: () => void;
  closeHomeRepair: () => void;
  setWorkerFilter: (filter: WorkerFilter) => void;
  bookWorker: (worker: WorkerProfile) => void;
  notifyWorker: (worker: WorkerProfile) => void;
}
