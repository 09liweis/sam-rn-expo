export const DONE_VALUES = ['done', 'completed', 'true', 'finished'];

export function isDone(status: string): boolean {
  return DONE_VALUES.includes(status.toLowerCase());
}

export function nextStatus(status: string): string {
  return isDone(status) ? 'pending' : 'done';
}
