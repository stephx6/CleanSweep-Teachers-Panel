// helpers/roomCodeHelpers.ts

import type { ClassroomCode } from "../types/dashboardTypes";

/**
 * Formats a Firestore Timestamp or date value into a human-readable string.
 */
export const formatDate = (timestamp: any): string => {
  if (!timestamp) return "Date not available";

  try {
    // Handle Firestore Timestamp
    if (timestamp?.toDate) {
      const date = timestamp.toDate();
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Handle regular date string or number
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Date error";
  }
};

/**
 * Filters classroom codes by search term and optional active-only flag.
 */
export const filterCodes = (
  codes: ClassroomCode[],
  searchTerm: string,
  showActiveOnly: boolean,
): ClassroomCode[] => {
  return codes.filter((code) => {
    const matchesSearch =
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showActiveOnly ? code.isActive : true;
    return matchesSearch && matchesStatus;
  });
};

/**
 * Copies a code string to the clipboard.
 */
export const copyToClipboard = (code: string): void => {
  navigator.clipboard.writeText(code);
};
