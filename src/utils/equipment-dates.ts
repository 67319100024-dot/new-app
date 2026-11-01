const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function formatEquipmentDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getOverdueDays(returnDate: string, now = Date.now()) {
  const dueTime = new Date(returnDate).getTime();
  if (Number.isNaN(dueTime) || now <= dueTime) {
    return 0;
  }

  return Math.ceil((now - dueTime) / MILLISECONDS_PER_DAY);
}
