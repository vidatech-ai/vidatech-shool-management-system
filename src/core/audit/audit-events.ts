export const AuditEvents = {
  SCHOOL_SUSPENDED: "school.suspended",
  SCHOOL_REACTIVATED: "school.reactivated",
} as const;

export type AuditEvent = (typeof AuditEvents)[keyof typeof AuditEvents];
