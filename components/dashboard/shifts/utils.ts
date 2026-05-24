export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount);
}

function parseDate(dateStr: string | undefined): Date {
  if (!dateStr) return new Date();

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.warn('Invalid date format:', dateStr);
    return new Date();
  }
  return date;
}

export function formatDate(dateStr: string): string {
  try {
    const date = parseDate(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', dateStr, error);
    return 'Invalid date';
  }
}

export function timeAgo(dateStr: string): string {
  try {
    const date = parseDate(dateStr);
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${mins} min ago`;
  } catch (error) {
    console.error('Error calculating timeAgo:', dateStr, error);
    return 'N/A';
  }
}

export function duration(start: string, end?: string): string {
  try {
    const startDate = parseDate(start);
    const endDate = parseDate(end);
    const ms = endDate.getTime() - startDate.getTime();
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  } catch (error) {
    console.error('Error calculating duration:', start, end, error);
    return 'N/A';
  }
}

export function getShiftInitial(name: string | undefined): string {
  return name?.charAt(0)?.toUpperCase() ?? '?';
}

export function formatShiftId(id: string): string {
  return `#${id.slice(0, 6).toUpperCase()}`;
}
