import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
  const diffInMonths = now.getMonth() - date.getMonth() + 12 * (now.getFullYear() - date.getFullYear());

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}w`;
  } else if (diffInMonths < 1) {
    return `${diffInWeeks}w`;
  } else {
    // If older than a month, return a formatted date
    return format(date, "MMM dd, yyyy");
  }
}

// Usage in component
export function DateDisplay({ dateString }: { dateString: string }) {
  const formattedDate = useMemo(() => formatDate(dateString), [dateString]);

  return <span>{formattedDate} ago</span>;
}

export const formatAsLocalDateTimeWithMillis = (date: Date): string => {
  const pad = (n: number, width = 2) => n.toString().padStart(width, '0');
  const padMillis = (n: number) => n.toString().padStart(3, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${padMillis(date.getMilliseconds())}`;
};