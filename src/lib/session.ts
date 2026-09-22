import type { Session } from '../types';

export const SESSION_KEY = 'labourack-session';
export const WORKER_PENDING = 'pending' as const;

export function loadSession(): Session {
  try { return JSON.parse(window.localStorage.getItem(SESSION_KEY) || '{}') as Session; } catch { return {}; }
}

export function saveSession(session: Session): void { window.localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
export function normalizePhone(value: string): string { return value.replace(/\D/g, '').slice(0, 10); }
export function phoneIsValid(value: string): boolean { return normalizePhone(value).length === 10; }
export function formatPhone(value: string): string { return value ? `+91 ${value.slice(0, 5)} ${value.slice(5)}` : 'your mobile number'; }
export function emptyOtp(): string[] { return ['', '', '', '', '', '']; }
export function otpIsComplete(otp: string[]): boolean { return otp.every(Boolean); }
export function initials(name = ''): string { return name.split(' ').filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'ME'; }
