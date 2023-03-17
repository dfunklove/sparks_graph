-- CreateTable
CREATE TABLE "goals" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_lessons" (
    "id" BIGSERIAL NOT NULL,
    "notes" TEXT,
    "user_id" BIGINT NOT NULL,
    "time_in" TIMESTAMP(6) NOT NULL,
    "time_out" TIMESTAMP(6),
    "course_id" BIGINT,

    CONSTRAINT "group_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" BIGSERIAL NOT NULL,
    "student_id" BIGINT NOT NULL,
    "time_in" TIMESTAMP(6) NOT NULL,
    "time_out" TIMESTAMP(6),
    "notes" TEXT,
    "user_id" BIGINT NOT NULL,
    "school_id" BIGINT NOT NULL,
    "group_lesson_id" BIGINT,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" BIGSERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "goal_id" BIGINT NOT NULL,
    "lesson_id" BIGINT NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_goals" (
    "id" BIGSERIAL NOT NULL,
    "goal_id" BIGINT NOT NULL,
    "student_id" BIGINT NOT NULL,

    CONSTRAINT "student_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" BIGSERIAL NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "school_id" BIGINT NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "password_digest" VARCHAR NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "index_goals_on_name" ON "goals"("name");

-- CreateIndex
CREATE INDEX "index_group_lessons_on_user_id" ON "group_lessons"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_group_lessons_on_user_id_and_time_in" ON "group_lessons"("user_id", "time_in");

-- CreateIndex
CREATE INDEX "index_lessons_on_group_lesson_id" ON "lessons"("group_lesson_id");

-- CreateIndex
CREATE INDEX "index_lessons_on_school_id" ON "lessons"("school_id");

-- CreateIndex
CREATE INDEX "index_lessons_on_student_id" ON "lessons"("student_id");

-- CreateIndex
CREATE INDEX "index_lessons_on_user_id" ON "lessons"("user_id");

-- CreateIndex
CREATE INDEX "index_ratings_on_goal_id" ON "ratings"("goal_id");

-- CreateIndex
CREATE INDEX "index_ratings_on_lesson_id" ON "ratings"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_schools_on_name" ON "schools"("name");

-- CreateIndex
CREATE INDEX "index_student_goals_on_goal_id" ON "student_goals"("goal_id");

-- CreateIndex
CREATE INDEX "index_student_goals_on_student_id" ON "student_goals"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_student_goals_on_goal_id_and_student_id" ON "student_goals"("goal_id", "student_id");

-- CreateIndex
CREATE INDEX "index_students_on_school_id" ON "students"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_users_on_email" ON "users"("email");

-- AddForeignKey
ALTER TABLE "group_lessons" ADD CONSTRAINT "fk_rails_d877e32e5d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "fk_rails_09010f5a34" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "fk_rails_6027eb145c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "fk_rails_7ed30edb11" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "fk_rails_ff5e4bcaa0" FOREIGN KEY ("group_lesson_id") REFERENCES "group_lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "fk_rails_6e6d997ed4" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "fk_rails_85b3c4a593" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_goals" ADD CONSTRAINT "student_goals_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_goals" ADD CONSTRAINT "student_goals_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "fk_rails_0adebddbd5" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
