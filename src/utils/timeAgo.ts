// Short Hebrew relative time, e.g. "לפני 10 דקות"
export const timeAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "עכשיו";
  if (minutes < 60) return "לפני " + minutes + " דקות";

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return "לפני " + hours + " שעות";

  const days = Math.floor(hours / 24);
  return "לפני " + days + " ימים";
};