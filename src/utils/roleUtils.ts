
/**
 * Maps backend role names to frontend role names
 * Backend uses: BENEFACTOR, BENEFACTEE
 * Frontend uses: sponsor, beneficiary
 */
export const mapRoleName = (role: string): string => {
  if (!role) return "";
  
  // Convert to lowercase for case-insensitive comparison
  const normalizedRole = role.toLowerCase();
  
  // Map backend roles to frontend roles
  if (normalizedRole === "benefactee") return "beneficiary";
  if (normalizedRole === "benefactor") return "sponsor";
  
  // If already using frontend role naming convention, return as is
  if (normalizedRole === "beneficiary" || normalizedRole === "sponsor") {
    return normalizedRole;
  }
  
  // Default fallback
  console.warn(`Unknown role type: ${role}`);
  return normalizedRole;
};

/**
 * Gets the correct dashboard path based on the role
 */
export const getDashboardPathByRole = (role: string): string => {
  const mappedRole = mapRoleName(role);
  
  if (mappedRole === "sponsor") {
    return "/dashboard/sponsor";
  }
  
  // Default to beneficiary dashboard
  return "/dashboard/beneficiary";
};
