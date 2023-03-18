/*
  Warnings:

  - Added the required column `school_id` to the `group_lessons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "group_lessons" ADD COLUMN     "school_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "group_lessons" ADD CONSTRAINT "group_lessons_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
