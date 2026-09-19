export const DEPARTMENT_PERMISSION = "it:department";

export function hasPermission(
  permissions: string[] | undefined | null,
  permission: string
): boolean {
  return Boolean(permissions?.includes(permission));
}

export function hasDepartmentAccess(
  permissions: string[] | undefined | null
): boolean {
  return hasPermission(permissions, DEPARTMENT_PERMISSION);
}
