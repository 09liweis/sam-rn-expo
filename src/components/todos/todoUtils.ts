export const DONE_VALUES = ['done', 'completed', 'true', 'finished'];

export function isDone(status: string): boolean {
  return DONE_VALUES.includes(status.toLowerCase());
}

export function nextStatus(status: string): string {
  return isDone(status) ? 'pending' : 'done';
}

export function formatDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
