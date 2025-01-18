import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";

export function formatDate(dateString: string): { formattedDate: string; isRelative: boolean } {
  const date = new Date(dateString);
  const now = new Date();

  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
  const diffInMonths = now.getMonth() - date.getMonth() + 12 * (now.getFullYear() - date.getFullYear());

  if (diffInMinutes < 60) {
    return { formattedDate: `${diffInMinutes} min`, isRelative: true };
  } else if (diffInHours < 24) {
    return { formattedDate: `${diffInHours}h`, isRelative: true };
  } else if (diffInDays < 7) {
    return { formattedDate: `${diffInDays}d`, isRelative: true };
  } else if (diffInWeeks < 4) {
    return { formattedDate: `${diffInWeeks}w`, isRelative: true };
  } else if (diffInMonths < 1) {
    return { formattedDate: `${diffInWeeks}w`, isRelative: true };
  } else {
    // If older than a month, return a formatted date
    return { formattedDate: format(date, "MMM dd, yyyy"), isRelative: false };
  }
}

// Usage in component
export function DateDisplay({ dateString }: { dateString: string }) {
  const { formattedDate, isRelative } = useMemo(() => formatDate(dateString), [dateString]);

  return <span>{formattedDate}{isRelative ? " ago" : ""}</span>;
}

export const formatAsLocalDateTimeWithMillis = (date: Date): string => {
  const pad = (n: number, width = 2) => n.toString().padStart(width, '0');
  const padMillis = (n: number) => n.toString().padStart(3, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${padMillis(date.getMilliseconds())}`;
};