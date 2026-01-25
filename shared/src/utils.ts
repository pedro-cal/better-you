// Shared utility functions for Better You

/**
 * Format date to YYYY-MM-DD string
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2);
}

/**
 * Get days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

/**
 * Calculate habit streak
 */
export function calculateStreak(entries: { date: Date; completed: boolean }[]): {
  current: number;
  longest: number;
} {
  if (entries.length === 0) {
    return { current: 0, longest: 0 };
  }

  // Sort entries by date (newest first)
  const sortedEntries = entries
    .filter(entry => entry.completed)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  if (sortedEntries.length === 0) {
    return { current: 0, longest: 0 };
  }

  let current = 0;
  let longest = 0;
  let tempStreak = 0;
  let previousDate: Date | null = null;

  for (const entry of sortedEntries) {
    if (previousDate === null) {
      // First entry
      current = 1;
      tempStreak = 1;
    } else {
      const daysDiff = daysBetween(entry.date, previousDate);
      
      if (daysDiff === 1) {
        // Consecutive day
        tempStreak++;
        if (previousDate === sortedEntries[0].date) {
          current = tempStreak;
        }
      } else {
        // Streak broken
        longest = Math.max(longest, tempStreak);
        tempStreak = 1;
        if (previousDate === sortedEntries[0].date) {
          current = 1;
        }
      }
    }
    
    previousDate = entry.date;
  }

  longest = Math.max(longest, tempStreak);
  
  return { current, longest };
}

/**
 * Generate a simple UUID v4
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}