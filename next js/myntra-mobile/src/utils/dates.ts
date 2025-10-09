export function formatRelativeDelivery(daysFromNow = 4): string {
  const target = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  const today = new Date();
  const diffDays = Math.floor((target.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / (24*60*60*1000));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return target.toLocaleDateString(undefined, { weekday: 'long' });
}


