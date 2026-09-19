import { UserProfileData, UserServiceProfile, UsersMe } from "../types/user";

export function mapUsersMeToProfile(
  me: UsersMe | UserServiceProfile,
  lms?: UserProfileData
): UserProfileData {
  const instituteName =
    "institute_name" in me ? me.institute_name : null;
  const studentProfile =
    "student_profile" in me ? me.student_profile : null;
  const employments = me.employee_profile?.employments ?? [];
  const activeJob = employments.find((job) => job.is_active) ?? employments[0];
  const studentGroup =
    studentProfile?.group_name || studentProfile?.group || "";

  return {
    id: lms?.id ?? 0,
    user_id: lms?.user_id ?? 0,
    first_name: me.first_name || lms?.first_name || "",
    last_name: me.last_name || lms?.last_name || "",
    middle_name: me.middle_name || lms?.middle_name || "",
    avatar: me.avatar_url || lms?.avatar || "",
    is_employee: Boolean(me.employee_profile) || Boolean(lms?.is_employee),
    position: activeJob?.position || lms?.position || "",
    group:
      instituteName ||
      studentGroup ||
      activeJob?.organization_name ||
      lms?.group ||
      "",
    email: me.email || lms?.email || "",
    number_phone: me.phone_number || lms?.number_phone || "",
    telegram_username: lms?.telegram_username || "",
    bio: lms?.bio || "",
    custom_permission: lms?.custom_permission || [""],
    username: me.username,
    birth_date: me.birth_date,
    gender: me.gender,
    institute_name: instituteName,
    employments,
  };
}
