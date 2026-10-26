/**
 * Utility formatters for Argentine currency, dates and metrics
 */

export function formatARS(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$ 0,00';
  }
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('ARS', '$').trim();
}

export function formatCompactARS(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$ ${(amount / 1_000_000_000).toFixed(2).replace('.', ',')} B`;
  }
  if (amount >= 1_000_000) {
    return `$ ${(amount / 1_000_000).toFixed(2).replace('.', ',')} M`;
  }
  if (amount >= 1_000) {
    return `$ ${(amount / 1_000).toFixed(1).replace('.', ',')} k`;
  }
  return formatARS(amount);
}

export function formatNumberAR(value: number): string {
  return new Intl.NumberFormat('es-AR').format(value);
}

export function formatPercent(value: number, includeSign = false): string {
  const formatted = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
  if (includeSign && value > 0) {
    return `+${formatted}%`;
  }
  return `${formatted}%`;
}

export function formatDateAR(dateString: string | Date): string {
  const d = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(d.getTime())) return 'Fecha no disponible';
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatShortDateAR(dateString: string | Date): string {
  const d = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(d.getTime())) return '--/--/----';
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function getCountdownParts(targetIso: string) {
  const target = new Date(targetIso).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false };
}
