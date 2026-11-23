-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ConductType" AS ENUM ('MISCONDUCT', 'COMMENDATION');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MASTER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT', 'SUPPORT_STAFF');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('PENDING_PAYMENT', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SubscriptionPaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "EducationStage" AS ENUM ('ECDE', 'LOWER_PRIMARY', 'UPPER_PRIMARY', 'JUNIOR_SCHOOL', 'SENIOR_SCHOOL', 'SECONDARY_844');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'MPESA', 'BANK');

-- CreateEnum
CREATE TYPE "FeeAudience" AS ENUM ('ALL', 'BOARDERS', 'DAY_SCHOLARS');

-- CreateEnum
CREATE TYPE "GradingCurriculum" AS ENUM ('CBC', 'LEGACY_844');

-- CreateEnum
CREATE TYPE "MessageKind" AS ENUM ('DIRECT', 'BROADCAST', 'NOTIFICATION');

-- CreateEnum
CREATE TYPE "BroadcastAudience" AS ENUM ('ALL_PARENTS', 'ALL_TEACHERS', 'SUPPORT_STAFF', 'CLASS_PARENTS');

-- CreateEnum
CREATE TYPE "CalendarEventType" AS ENUM ('TERM', 'EXAM_WINDOW', 'BREAK', 'EVENT');

-- CreateEnum
CREATE TYPE "GalleryItemType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('NEWS', 'ACHIEVEMENT', 'EXAM_RESULT', 'EVENT');

-- CreateEnum
CREATE TYPE "DocumentKind" AS ENUM ('ADMISSION_FORM', 'FEE_STRUCTURE', 'OTHER');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "LeadershipGroup" AS ENUM ('PRINCIPAL_TEAM', 'BOARD');

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stage" "EducationStage" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streams" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "streams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "stage" "EducationStage" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_assignments" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "stream_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_enrollments" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "stream_id" TEXT,
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "academic_year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_attendance" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "marked_by_id" TEXT NOT NULL,
    "lesson_id" TEXT,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_attendance" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "staff_id" TEXT NOT NULL,
    "marked_by_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "reviewer_id" TEXT,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impersonation_sessions" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "target_user_id" TEXT,
    "reason" TEXT NOT NULL,
    "ip_address" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "impersonation_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "school_id" TEXT,
    "actor_id" TEXT,
    "actor_role" "Role",
    "impersonation_session_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "sequence" INTEGER NOT NULL,
    "prev_hash" TEXT,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conduct_records" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "reported_by_id" TEXT NOT NULL,
    "type" "ConductType" NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "severity" INTEGER,
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "occurred_on" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conduct_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_items" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "audience" "FeeAudience" NOT NULL DEFAULT 'ALL',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fee_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_structures" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "term_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_structure_lines" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "fee_item_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "fee_structure_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_fee_profiles" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "is_boarder" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_fee_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "term_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "amount_paid" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_lines" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "fee_item_id" TEXT,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "invoice_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "recorded_by_id" TEXT,
    "amount" INTEGER NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "transaction_code" TEXT,
    "payer_phone" TEXT,
    "reference" TEXT,
    "note" TEXT,
    "paid_on" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "supplier_id" TEXT,
    "recorded_by_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "incurred_on" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_payments" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "recorded_by_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "reference" TEXT,
    "paid_on" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplier_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grading_scales" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "curriculum" "GradingCurriculum" NOT NULL,
    "subject_id" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grading_scales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_bands" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "scale_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "min_percent" INTEGER NOT NULL,
    "max_percent" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "descriptor" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "grade_bands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_types" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight_percent" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "term_id" TEXT NOT NULL,
    "type_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "stream_id" TEXT,
    "created_by_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "max_score" INTEGER NOT NULL DEFAULT 100,
    "held_on" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_scores" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "recorded_by_id" TEXT NOT NULL,
    "scale_id" TEXT,
    "score" DOUBLE PRECISION NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "grade_code" TEXT,
    "points" INTEGER,
    "auto_grade_code" TEXT,
    "auto_points" INTEGER,
    "is_overridden" BOOLEAN NOT NULL DEFAULT false,
    "override_reason" TEXT,
    "overridden_by_id" TEXT,
    "overridden_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "sender_id" TEXT,
    "reply_to_id" TEXT,
    "audience_class_id" TEXT,
    "kind" "MessageKind" NOT NULL,
    "audience" "BroadcastAudience",
    "category" TEXT,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_recipients" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_broadcasts" (
    "id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_broadcasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "TenantStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "county" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "enabledStages" "EducationStage"[],
    "logoUrl" TEXT,
    "motto" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#1d4ed8',
    "secondaryColor" TEXT NOT NULL DEFAULT '#0f172a',
    "subscriptionExpiresAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "suspendedReason" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_payments" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "status" "SubscriptionPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "periodDays" INTEGER NOT NULL,
    "paidAt" TIMESTAMP(3),
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_extensions" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "granted_by_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_extensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_slots" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_minute" INTEGER NOT NULL,
    "end_minute" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_break" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timetable_lessons" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "term_id" TEXT NOT NULL,
    "slot_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "stream_id" TEXT,
    "subject_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "room" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timetable_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duty_shifts" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "staff_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "week_start" DATE NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_minute" INTEGER NOT NULL,
    "end_minute" INTEGER NOT NULL,
    "workstation" TEXT,
    "task" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "duty_shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_events" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "type" "CalendarEventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "school_id" TEXT,
    "role" "Role" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "admission_number" TEXT,
    "password_hash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_student_links" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_student_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_profiles" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "founded_year" INTEGER,
    "history" TEXT,
    "vision" TEXT,
    "mission" TEXT,
    "core_values" TEXT,
    "principal_name" TEXT,
    "principal_message" TEXT,
    "principal_photo_url" TEXT,
    "address" TEXT,
    "map_url" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_banners" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "headline" TEXT,
    "subtext" TEXT,
    "link_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hero_banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_profiles" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "group" "LeadershipGroup" NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT,
    "photo_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leadership_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_albums" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "cover_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_items" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "album_id" TEXT NOT NULL,
    "type" "GalleryItemType" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_posts" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "category" "NewsCategory" NOT NULL DEFAULT 'NEWS',
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT NOT NULL,
    "cover_url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_vacancies" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT,
    "employment_type" TEXT,
    "description" TEXT NOT NULL,
    "qualifications" TEXT,
    "how_to_apply" TEXT,
    "deadline" DATE,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_vacancies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admission_requirements" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "stage" "EducationStage" NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admission_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "downloadable_documents" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "kind" "DocumentKind" NOT NULL DEFAULT 'OTHER',
    "stage" "EducationStage",
    "title" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "downloadable_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "handled_by_id" TEXT,
    "parent_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "child_name" TEXT,
    "stage" "EducationStage",
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "classes_school_id_stage_idx" ON "classes"("school_id", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "classes_school_id_name_key" ON "classes"("school_id", "name");

-- CreateIndex
CREATE INDEX "streams_school_id_class_id_idx" ON "streams"("school_id", "class_id");

-- CreateIndex
CREATE UNIQUE INDEX "streams_class_id_name_key" ON "streams"("class_id", "name");

-- CreateIndex
CREATE INDEX "subjects_school_id_stage_idx" ON "subjects"("school_id", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_school_id_stage_name_key" ON "subjects"("school_id", "stage", "name");

-- CreateIndex
CREATE INDEX "teacher_assignments_school_id_teacher_id_idx" ON "teacher_assignments"("school_id", "teacher_id");

-- CreateIndex
CREATE INDEX "teacher_assignments_school_id_class_id_idx" ON "teacher_assignments"("school_id", "class_id");

-- CreateIndex
CREATE INDEX "student_enrollments_school_id_student_id_is_current_idx" ON "student_enrollments"("school_id", "student_id", "is_current");

-- CreateIndex
CREATE INDEX "student_enrollments_school_id_class_id_is_current_idx" ON "student_enrollments"("school_id", "class_id", "is_current");

-- CreateIndex
CREATE INDEX "student_attendance_school_id_date_idx" ON "student_attendance"("school_id", "date");

-- CreateIndex
CREATE INDEX "student_attendance_school_id_class_id_date_idx" ON "student_attendance"("school_id", "class_id", "date");

-- CreateIndex
CREATE INDEX "student_attendance_school_id_lesson_id_date_idx" ON "student_attendance"("school_id", "lesson_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "student_attendance_student_id_date_lesson_id_key" ON "student_attendance"("student_id", "date", "lesson_id");

-- CreateIndex
CREATE INDEX "staff_attendance_school_id_date_idx" ON "staff_attendance"("school_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "staff_attendance_staff_id_date_key" ON "staff_attendance"("staff_id", "date");

-- CreateIndex
CREATE INDEX "leave_requests_school_id_status_idx" ON "leave_requests"("school_id", "status");

-- CreateIndex
CREATE INDEX "leave_requests_school_id_requester_id_idx" ON "leave_requests"("school_id", "requester_id");

-- CreateIndex
CREATE INDEX "impersonation_sessions_school_id_started_at_idx" ON "impersonation_sessions"("school_id", "started_at");

-- CreateIndex
CREATE INDEX "impersonation_sessions_admin_id_started_at_idx" ON "impersonation_sessions"("admin_id", "started_at");

-- CreateIndex
CREATE INDEX "audit_logs_school_id_createdAt_idx" ON "audit_logs"("school_id", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_school_id_actor_id_createdAt_idx" ON "audit_logs"("school_id", "actor_id", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_school_id_action_idx" ON "audit_logs"("school_id", "action");

-- CreateIndex
CREATE INDEX "audit_logs_school_id_entity_type_entity_id_idx" ON "audit_logs"("school_id", "entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "audit_logs_school_id_sequence_key" ON "audit_logs"("school_id", "sequence");

-- CreateIndex
CREATE INDEX "conduct_records_school_id_student_id_occurred_on_idx" ON "conduct_records"("school_id", "student_id", "occurred_on");

-- CreateIndex
CREATE INDEX "conduct_records_school_id_type_escalated_idx" ON "conduct_records"("school_id", "type", "escalated");

-- CreateIndex
CREATE UNIQUE INDEX "fee_items_school_id_name_key" ON "fee_items"("school_id", "name");

-- CreateIndex
CREATE INDEX "fee_structures_school_id_term_id_idx" ON "fee_structures"("school_id", "term_id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_structures_school_id_term_id_class_id_key" ON "fee_structures"("school_id", "term_id", "class_id");

-- CreateIndex
CREATE INDEX "fee_structure_lines_school_id_structure_id_idx" ON "fee_structure_lines"("school_id", "structure_id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_structure_lines_structure_id_fee_item_id_key" ON "fee_structure_lines"("structure_id", "fee_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_fee_profiles_school_id_student_id_key" ON "student_fee_profiles"("school_id", "student_id");

-- CreateIndex
CREATE INDEX "invoices_school_id_term_id_idx" ON "invoices"("school_id", "term_id");

-- CreateIndex
CREATE INDEX "invoices_school_id_student_id_idx" ON "invoices"("school_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_school_id_student_id_term_id_key" ON "invoices"("school_id", "student_id", "term_id");

-- CreateIndex
CREATE INDEX "invoice_lines_school_id_invoice_id_idx" ON "invoice_lines"("school_id", "invoice_id");

-- CreateIndex
CREATE INDEX "payments_school_id_invoice_id_idx" ON "payments"("school_id", "invoice_id");

-- CreateIndex
CREATE INDEX "payments_school_id_student_id_idx" ON "payments"("school_id", "student_id");

-- CreateIndex
CREATE INDEX "payments_school_id_method_paid_on_idx" ON "payments"("school_id", "method", "paid_on");

-- CreateIndex
CREATE UNIQUE INDEX "payments_school_id_receipt_number_key" ON "payments"("school_id", "receipt_number");

-- CreateIndex
CREATE UNIQUE INDEX "payments_school_id_transaction_code_key" ON "payments"("school_id", "transaction_code");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_school_id_name_key" ON "suppliers"("school_id", "name");

-- CreateIndex
CREATE INDEX "expenses_school_id_incurred_on_idx" ON "expenses"("school_id", "incurred_on");

-- CreateIndex
CREATE INDEX "expenses_school_id_supplier_id_idx" ON "expenses"("school_id", "supplier_id");

-- CreateIndex
CREATE INDEX "supplier_payments_school_id_supplier_id_idx" ON "supplier_payments"("school_id", "supplier_id");

-- CreateIndex
CREATE INDEX "grading_scales_school_id_curriculum_is_default_idx" ON "grading_scales"("school_id", "curriculum", "is_default");

-- CreateIndex
CREATE UNIQUE INDEX "grading_scales_school_id_name_key" ON "grading_scales"("school_id", "name");

-- CreateIndex
CREATE INDEX "grade_bands_school_id_scale_id_idx" ON "grade_bands"("school_id", "scale_id");

-- CreateIndex
CREATE UNIQUE INDEX "grade_bands_scale_id_code_key" ON "grade_bands"("scale_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_types_school_id_name_key" ON "assessment_types"("school_id", "name");

-- CreateIndex
CREATE INDEX "assessments_school_id_class_id_subject_id_term_id_idx" ON "assessments"("school_id", "class_id", "subject_id", "term_id");

-- CreateIndex
CREATE INDEX "assessments_school_id_created_by_id_idx" ON "assessments"("school_id", "created_by_id");

-- CreateIndex
CREATE INDEX "assessment_scores_school_id_student_id_idx" ON "assessment_scores"("school_id", "student_id");

-- CreateIndex
CREATE INDEX "assessment_scores_school_id_assessment_id_idx" ON "assessment_scores"("school_id", "assessment_id");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_scores_assessment_id_student_id_key" ON "assessment_scores"("assessment_id", "student_id");

-- CreateIndex
CREATE INDEX "messages_school_id_createdAt_idx" ON "messages"("school_id", "createdAt");

-- CreateIndex
CREATE INDEX "messages_school_id_sender_id_idx" ON "messages"("school_id", "sender_id");

-- CreateIndex
CREATE INDEX "messages_school_id_kind_idx" ON "messages"("school_id", "kind");

-- CreateIndex
CREATE INDEX "message_recipients_school_id_recipient_id_read_at_idx" ON "message_recipients"("school_id", "recipient_id", "read_at");

-- CreateIndex
CREATE UNIQUE INDEX "message_recipients_message_id_recipient_id_key" ON "message_recipients"("message_id", "recipient_id");

-- CreateIndex
CREATE INDEX "platform_broadcasts_createdAt_idx" ON "platform_broadcasts"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "schools_slug_key" ON "schools"("slug");

-- CreateIndex
CREATE INDEX "schools_status_idx" ON "schools"("status");

-- CreateIndex
CREATE INDEX "schools_subscriptionExpiresAt_idx" ON "schools"("subscriptionExpiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_payments_reference_key" ON "subscription_payments"("reference");

-- CreateIndex
CREATE INDEX "subscription_payments_school_id_status_idx" ON "subscription_payments"("school_id", "status");

-- CreateIndex
CREATE INDEX "subscription_payments_school_id_createdAt_idx" ON "subscription_payments"("school_id", "createdAt");

-- CreateIndex
CREATE INDEX "subscription_extensions_school_id_createdAt_idx" ON "subscription_extensions"("school_id", "createdAt");

-- CreateIndex
CREATE INDEX "terms_school_id_is_current_idx" ON "terms"("school_id", "is_current");

-- CreateIndex
CREATE UNIQUE INDEX "terms_school_id_academic_year_number_key" ON "terms"("school_id", "academic_year", "number");

-- CreateIndex
CREATE INDEX "time_slots_school_id_sort_order_idx" ON "time_slots"("school_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "time_slots_school_id_name_key" ON "time_slots"("school_id", "name");

-- CreateIndex
CREATE INDEX "timetable_lessons_school_id_class_id_term_id_day_of_week_idx" ON "timetable_lessons"("school_id", "class_id", "term_id", "day_of_week");

-- CreateIndex
CREATE INDEX "timetable_lessons_school_id_teacher_id_term_id_idx" ON "timetable_lessons"("school_id", "teacher_id", "term_id");

-- CreateIndex
CREATE UNIQUE INDEX "timetable_lessons_school_id_teacher_id_term_id_day_of_week__key" ON "timetable_lessons"("school_id", "teacher_id", "term_id", "day_of_week", "slot_id");

-- CreateIndex
CREATE INDEX "duty_shifts_school_id_week_start_idx" ON "duty_shifts"("school_id", "week_start");

-- CreateIndex
CREATE INDEX "duty_shifts_school_id_staff_id_week_start_idx" ON "duty_shifts"("school_id", "staff_id", "week_start");

-- CreateIndex
CREATE INDEX "calendar_events_school_id_start_date_idx" ON "calendar_events"("school_id", "start_date");

-- CreateIndex
CREATE INDEX "calendar_events_school_id_type_idx" ON "calendar_events"("school_id", "type");

-- CreateIndex
CREATE INDEX "users_school_id_role_idx" ON "users"("school_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "users_school_id_email_key" ON "users"("school_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "users_school_id_phone_key" ON "users"("school_id", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_school_id_admission_number_key" ON "users"("school_id", "admission_number");

-- CreateIndex
CREATE INDEX "parent_student_links_school_id_parent_id_idx" ON "parent_student_links"("school_id", "parent_id");

-- CreateIndex
CREATE INDEX "parent_student_links_school_id_student_id_idx" ON "parent_student_links"("school_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "parent_student_links_parent_id_student_id_key" ON "parent_student_links"("parent_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "school_profiles_school_id_key" ON "school_profiles"("school_id");

-- CreateIndex
CREATE INDEX "hero_banners_school_id_is_published_sort_order_idx" ON "hero_banners"("school_id", "is_published", "sort_order");

-- CreateIndex
CREATE INDEX "leadership_profiles_school_id_group_sort_order_idx" ON "leadership_profiles"("school_id", "group", "sort_order");

-- CreateIndex
CREATE INDEX "gallery_albums_school_id_is_published_sort_order_idx" ON "gallery_albums"("school_id", "is_published", "sort_order");

-- CreateIndex
CREATE INDEX "gallery_items_school_id_album_id_sort_order_idx" ON "gallery_items"("school_id", "album_id", "sort_order");

-- CreateIndex
CREATE INDEX "news_posts_school_id_is_published_published_at_idx" ON "news_posts"("school_id", "is_published", "published_at");

-- CreateIndex
CREATE INDEX "news_posts_school_id_category_idx" ON "news_posts"("school_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "news_posts_school_id_slug_key" ON "news_posts"("school_id", "slug");

-- CreateIndex
CREATE INDEX "job_vacancies_school_id_is_published_deadline_idx" ON "job_vacancies"("school_id", "is_published", "deadline");

-- CreateIndex
CREATE INDEX "admission_requirements_school_id_stage_sort_order_idx" ON "admission_requirements"("school_id", "stage", "sort_order");

-- CreateIndex
CREATE INDEX "downloadable_documents_school_id_kind_is_published_idx" ON "downloadable_documents"("school_id", "kind", "is_published");

-- CreateIndex
CREATE INDEX "inquiries_school_id_status_createdAt_idx" ON "inquiries"("school_id", "status", "createdAt");

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streams" ADD CONSTRAINT "streams_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streams" ADD CONSTRAINT "streams_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "streams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "streams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_marked_by_id_fkey" FOREIGN KEY ("marked_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "timetable_lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_attendance" ADD CONSTRAINT "staff_attendance_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_attendance" ADD CONSTRAINT "staff_attendance_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_attendance" ADD CONSTRAINT "staff_attendance_marked_by_id_fkey" FOREIGN KEY ("marked_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impersonation_sessions" ADD CONSTRAINT "impersonation_sessions_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impersonation_sessions" ADD CONSTRAINT "impersonation_sessions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impersonation_sessions" ADD CONSTRAINT "impersonation_sessions_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_impersonation_session_id_fkey" FOREIGN KEY ("impersonation_session_id") REFERENCES "impersonation_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conduct_records" ADD CONSTRAINT "conduct_records_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conduct_records" ADD CONSTRAINT "conduct_records_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conduct_records" ADD CONSTRAINT "conduct_records_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conduct_records" ADD CONSTRAINT "conduct_records_reported_by_id_fkey" FOREIGN KEY ("reported_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_items" ADD CONSTRAINT "fee_items_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_term_id_fkey" FOREIGN KEY ("term_id") REFERENCES "terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structure_lines" ADD CONSTRAINT "fee_structure_lines_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structure_lines" ADD CONSTRAINT "fee_structure_lines_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "fee_structures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structure_lines" ADD CONSTRAINT "fee_structure_lines_fee_item_id_fkey" FOREIGN KEY ("fee_item_id") REFERENCES "fee_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_profiles" ADD CONSTRAINT "student_fee_profiles_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_profiles" ADD CONSTRAINT "student_fee_profiles_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_term_id_fkey" FOREIGN KEY ("term_id") REFERENCES "terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_fee_item_id_fkey" FOREIGN KEY ("fee_item_id") REFERENCES "fee_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_payments" ADD CONSTRAINT "supplier_payments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_payments" ADD CONSTRAINT "supplier_payments_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_payments" ADD CONSTRAINT "supplier_payments_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading_scales" ADD CONSTRAINT "grading_scales_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading_scales" ADD CONSTRAINT "grading_scales_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_bands" ADD CONSTRAINT "grade_bands_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_bands" ADD CONSTRAINT "grade_bands_scale_id_fkey" FOREIGN KEY ("scale_id") REFERENCES "grading_scales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_types" ADD CONSTRAINT "assessment_types_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_term_id_fkey" FOREIGN KEY ("term_id") REFERENCES "terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "assessment_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "streams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_scores" ADD CONSTRAINT "assessment_scores_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_scores" ADD CONSTRAINT "assessment_scores_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_scores" ADD CONSTRAINT "assessment_scores_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_scores" ADD CONSTRAINT "assessment_scores_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_scores" ADD CONSTRAINT "assessment_scores_scale_id_fkey" FOREIGN KEY ("scale_id") REFERENCES "grading_scales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_scores" ADD CONSTRAINT "assessment_scores_overridden_by_id_fkey" FOREIGN KEY ("overridden_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_audience_class_id_fkey" FOREIGN KEY ("audience_class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_recipients" ADD CONSTRAINT "message_recipients_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_recipients" ADD CONSTRAINT "message_recipients_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_recipients" ADD CONSTRAINT "message_recipients_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_broadcasts" ADD CONSTRAINT "platform_broadcasts_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_extensions" ADD CONSTRAINT "subscription_extensions_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_extensions" ADD CONSTRAINT "subscription_extensions_granted_by_id_fkey" FOREIGN KEY ("granted_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms" ADD CONSTRAINT "terms_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_lessons" ADD CONSTRAINT "timetable_lessons_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_lessons" ADD CONSTRAINT "timetable_lessons_term_id_fkey" FOREIGN KEY ("term_id") REFERENCES "terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_lessons" ADD CONSTRAINT "timetable_lessons_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "time_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_lessons" ADD CONSTRAINT "timetable_lessons_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_lessons" ADD CONSTRAINT "timetable_lessons_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "streams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_lessons" ADD CONSTRAINT "timetable_lessons_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_lessons" ADD CONSTRAINT "timetable_lessons_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duty_shifts" ADD CONSTRAINT "duty_shifts_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duty_shifts" ADD CONSTRAINT "duty_shifts_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duty_shifts" ADD CONSTRAINT "duty_shifts_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_student_links" ADD CONSTRAINT "parent_student_links_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_student_links" ADD CONSTRAINT "parent_student_links_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_student_links" ADD CONSTRAINT "parent_student_links_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_profiles" ADD CONSTRAINT "school_profiles_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hero_banners" ADD CONSTRAINT "hero_banners_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leadership_profiles" ADD CONSTRAINT "leadership_profiles_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_albums" ADD CONSTRAINT "gallery_albums_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "gallery_albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_posts" ADD CONSTRAINT "news_posts_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_posts" ADD CONSTRAINT "news_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_vacancies" ADD CONSTRAINT "job_vacancies_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_vacancies" ADD CONSTRAINT "job_vacancies_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admission_requirements" ADD CONSTRAINT "admission_requirements_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloadable_documents" ADD CONSTRAINT "downloadable_documents_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_handled_by_id_fkey" FOREIGN KEY ("handled_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
