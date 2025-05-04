
/**
 * Formats a date string relative to current time
 * 
 * @param dateString - ISO date string to format
 * @returns Formatted date string (e.g. "Just now", "2h ago", "Yesterday", "May 4")
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    // Less than 24 hours ago
    const hours = Math.floor(diffInHours);
    return hours === 0 ? "Just now" : `${hours}h ago`;
  } else if (diffInHours < 48) {
    // Yesterday
    return "Yesterday";
  } else {
    // Format as date
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric" 
    });
  }
};
