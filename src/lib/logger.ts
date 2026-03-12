import { classifyUA, type Classification } from "./classifier";

export interface LogEntry {
  id: string;
  timestamp: Date;
  path: string;
  userAgent: string;
  classification: Classification;
}

let logs: LogEntry[] = [];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach(fn => fn());
}

export function logNavigation(path: string) {
  const ua = navigator.userAgent;
  logs.unshift({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    path,
    userAgent: ua,
    classification: classifyUA(ua),
  });
  notify();
}

export function getLogs(): LogEntry[] {
  return logs;
}

export function clearLogs() {
  logs = [];
  notify();
}

export function subscribe(fn: () => void) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}
