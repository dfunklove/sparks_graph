import { InputFieldRef, InputShapeFromFields } from "@pothos/core";
import { prisma } from "./db";

export function parseID(id: any): number {
  return parseInt(String(id))
}

export async function updateRatingsAndGoals(lessonId: number|string, ratingSet: InputShapeFromFields<{
  score: InputFieldRef<number, "InputObject">;
  goalId: InputFieldRef<string | number, "InputObject">;
}>[]) {
  const lesson_id = parseID(lessonId);
  await prisma.ratings.deleteMany({ where: { lesson_id: lesson_id }});
  await prisma.ratings.createMany({data:
    ratingSet.map((rating) => ({
      lesson_id: lesson_id,
      score: rating.score,
      goal_id: parseID(rating.goalId),
    }))
  });
  const lesson = await prisma.lessons.findUniqueOrThrow({where: { id: lesson_id }, select: { student_id: true }})
  const student_id = lesson.student_id
  await prisma.student_goals.deleteMany({where: { student_id: student_id }});
  await prisma.student_goals.createMany({
    data: ratingSet.map((rating) => ({ goal_id: parseID(rating.goalId), student_id: student_id }))
  });
}