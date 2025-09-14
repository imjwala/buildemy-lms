/**
 * Utility functions for consistent date formatting across the application
 * to prevent hydration errors in Next.js
 */

/**
 * Formats a date consistently for display in the UI
 * Uses a fixed locale and format to prevent hydration mismatches
 * @param date - The date to format (string, Date, or timestamp)
 * @returns Formatted date string in MM/DD/YYYY format
 */
export function formatDate(date: string | Date | number): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Formats a date with time for display in the UI
 * @param date - The date to format (string, Date, or timestamp)
 * @returns Formatted date string in MM/DD/YYYY, HH:MM AM/PM format
 */
export function formatDateTime(date: string | Date | number): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a date for relative display (e.g., "2 days ago")
 * @param date - The date to format (string, Date, or timestamp)
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date | number): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
}
