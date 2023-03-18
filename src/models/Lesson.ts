import { MaybePromise } from "@pothos/core";
import { group_lessons, lessons } from "@prisma/client";
import { builder } from "../builder";
import { prisma } from "../db";
import { parseID, updateRatingsAndGoals } from "../util";
import { GroupLesson, LessonInputPartial } from "./GroupLesson";
import { RatingInputPartial } from "./Rating"
import { SchoolInputPartial } from "./School"
import { StudentInputPartial } from "./Student"
import { UserInputPartial } from "./User"

export const Lesson = builder.prismaObject("lessons", {
  name: "Lesson",
  fields: t => ({
      id: t.exposeID("id"),
      group_lesson: t.relation("group_lessons"),
      notes: t.exposeString("notes", {nullable: true}),
      ratingSet: t.relation("ratings"),
      school: t.relation("schools"),
      student: t.relation("students"),
      timeIn: t.expose("time_in", {type: "DateTime"}),
      timeOut: t.expose("time_out", {type: "DateTime", nullable: true}),
      user: t.relation("users"),
  })
})

export const LessonInput = builder.inputType('LessonInput', {
  fields: (t) => ({
    notes: t.string(),
    school: t.field({type: SchoolInputPartial, required: true}),
    student: t.field({type: StudentInputPartial, required: true}),
    timeIn: t.field({type: "DateTime", required: true}),
    timeOut: t.field({type: "DateTime"}),
    user: t.field({type: UserInputPartial, required: true}),
  }),
});

builder.queryField("lesson", (t) =>
  t.prismaField({
    type: "lessons",
    args: {
      pk: t.arg.id()
    },
    resolve: async (query, root, args, ctx, info) => {
      return prisma.lessons.findUniqueOrThrow({ ...query, where: { id: parseID(args.pk) } });
    },
  })
);

builder.queryField("lessons", (t) =>
  t.prismaField({
    type: ["lessons"],
    args: {
      userId: t.arg.id()
    },
    resolve: async (query, root, args, ctx, info) => {
      return prisma.lessons.findMany({ ...query, where: { user_id: parseID(args.userId) } });
    },
  })
);

const lesson_any = builder.unionType("lesson_any", {
  types: [Lesson, GroupLesson],
  resolveType: (lesson: any) => {
    if (lesson.lessons)
      return GroupLesson;
    else
      return Lesson;
  }});

builder.queryField("openLesson", (t) =>
  t.field({
    type: lesson_any,
    args: {
      userId: t.arg.id()
    },
    resolve: async (parent, args, ctx, info) => {
      const lesson = await prisma.lessons.findFirstOrThrow({
        where: { time_out: null, user_id: parseID(args.userId) }, 
        include: { 
          group_lessons: { 
            include: { 
              lessons: true 
            }
          }
        }, 
      });
      if (lesson.group_lessons)
        return lesson.group_lessons;
      else
        return lesson;
    },
  })
);

builder.mutationField("createLesson",
  (t) => t.prismaField({
    type: Lesson,
    args: {
      input: t.arg({ type: LessonInput, required: true }),
    },
    resolve: (query, _, {input}) =>
      prisma.lessons.create({...query, data: {
        notes: input.notes,
        schools: { connect: { id: parseID(input.school.id) } }, 
        students: { connect: { id: parseID(input.student.id) } },
        time_in: input.timeIn,
        time_out: input.timeOut,
        users: { connect: { id: parseID(input.user.id) } },
      }})
  })
);

builder.mutationField("updateLesson",
  (t) => t.prismaField({
    type: Lesson,
    args: {
      input: t.arg({ type: LessonInputPartial, required: true }),
    },
    resolve: async (query, _, {input}) => {
      //const promises: Promise<any>[] = [];
      const promise = prisma.lessons.update({...query, data: {
          notes: input.notes,
          time_out: input.timeOut,
        },
        where: { id: parseID(input.id) }
      });
      await promise;
      if (input.ratingSet) {
        await updateRatingsAndGoals(input.id, input.ratingSet);
      }
      return promise;
    }
  })
);