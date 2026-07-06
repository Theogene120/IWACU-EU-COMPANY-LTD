// pg parses DATE columns into a Date representing local midnight for that calendar
// day, so read it back with local getters — toISOString() converts to UTC first and
// rolls the date back a day in any positive UTC-offset timezone (e.g. Africa/Kigali).
export function toDateString(raw: any): string | undefined {
  if (!raw) return undefined;
  if (raw instanceof Date) {
    const y = raw.getFullYear();
    const m = String(raw.getMonth() + 1).padStart(2, '0');
    const d = String(raw.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(raw).split('T')[0];
}
