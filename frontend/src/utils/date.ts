import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function getTimeAgo(date?: string) {
  if (!date) {
    return "Unknown";
  }
  return dayjs(date).fromNow();
}
