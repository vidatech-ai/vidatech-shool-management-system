export const AuditEvents = {
  SCHOOL_SUSPENDED: "school.suspended",
  SCHOOL_REACTIVATED: "school.reactivated",
  SCHOOL_APPROVED: "school.approved",
} as const;

export type AuditEvent = (typeof AuditEvents)[keyof typeof AuditEvents];
