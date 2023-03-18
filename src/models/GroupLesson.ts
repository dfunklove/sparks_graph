import { MaybePromise } from "@pothos/core";
import { parse } from "path";
import { builder } from "../builder";
import { prisma } from "../db";
import { parseID, updateRatingsAndGoals } from "../util";
import { RatingInputPartial } from "./Rating";
import { SchoolInputPartial } from "./School";
import { StudentInputPartial } from "./Student";
import { UserInputPartial } from "./User";


export const LessonInputPartial = builder.inputType('LessonInputPartial', {
  fields: (t) => ({
    id: t.id({ required: true }),
    notes: t.string(),
    ratingSet: t.field({type: [RatingInputPartial] }),
    school: t.field({type: SchoolInputPartial }),
    student: t.field({type: StudentInputPartial }),
    timeIn: t.field({type: "DateTime" }),
    timeOut: t.field({type: "DateTime"}),
    user: t.field({type: UserInputPartial }),
  }),
});

export const GroupLesson = builder.prismaObject("group_lessons", {
  name: "GroupLesson",
  fields: t => ({
      id: t.exposeID("id"),
      lessonSet: t.relation("lessons"),
      notes: t.exposeString("notes", { nullable: true }),
      school: t.relation("schools"),
      timeIn: t.expose("time_in", {type: "DateTime"}),
      timeOut: t.expose("time_out", {type: "DateTime", nullable: true}),
      user: t.relation("users"),
  })
})

export const GroupLessonInput = builder.inputType('GroupLessonInput', {
  fields: (t) => ({
    lessonSet: t.field({type: [LessonInputPartial], required: true}),
    notes: t.string(),
    school: t.field({type: SchoolInputPartial, required: true}),
    timeIn: t.field({type: "DateTime", required: true}),
    timeOut: t.field({type: "DateTime"}),
    user: t.field({type: UserInputPartial, required: true}),
  }),
});

export const GroupLessonInputPartial = builder.inputType('GroupLessonInputPartial', {
  fields: (t) => ({
    id: t.id({ required: true }),
    lessonSet: t.field({type: [LessonInputPartial]}),
    notes: t.string(),
    school: t.field({type: SchoolInputPartial}),
    timeIn: t.field({type: "DateTime"}),
    timeOut: t.field({type: "DateTime"}),
    user: t.field({type: UserInputPartial}),
  }),
});

builder.queryField("groupLessons", (t) =>
  t.prismaField({
    type: ["group_lessons"],
    args: {
      userId: t.arg.id()
    },
    resolve: async (query, root, args, ctx, info) => {
      return prisma.group_lessons.findMany({ ...query, where: { user_id: parseID(args.userId) }, include: { lessons: true } });
    },
  })
);

builder.queryField("groupLesson", (t) =>
  t.prismaField({
    type: "group_lessons",
    args: {
      pk: t.arg.id()
    },
    resolve: async (query, root, args, ctx, info) => {
      return prisma.group_lessons.findUniqueOrThrow({ ...query, where: { id: parseID(args.pk) }, include: { lessons: true } });
    },
  })
);

builder.mutationField("createGroupLesson",
  (t) => t.prismaField({
    type: GroupLesson,
    args: {
      //input: t.arg({ type: GroupLessonInput, required: true }),
      schoolId: t.arg.id(),
      studentIds: t.arg.idList(),
      userId: t.arg.id(),
    },
    resolve: (query, _, {schoolId, studentIds, userId}) => {
      const time_in = (new Date()).toISOString();
      return prisma.group_lessons.create({...query, data: {
        time_in: time_in,
        school_id: parseID(schoolId),
        user_id: parseID(userId),
        lessons: { 
          create: studentIds?.map(studentId => ({ 
            time_in: time_in,
            students: { connect: { id: parseID(studentId) } },
            schools: { connect: { id: parseID(schoolId) } }, 
            users: { connect: { id: parseID(userId) } } 
          }))
        },
      }})
  }})
);

builder.mutationField("updateGroupLesson",
  (t) => t.prismaField({
    type: GroupLesson,
    args: {
      input: t.arg({ type: GroupLessonInputPartial, required: true }),
    },
    resolve: async (query, _, {input}) => {
      const promise = prisma.group_lessons.update({...query, 
        data: {
          notes: input.notes,
          time_out: input.timeOut,
          lessons: {
            update: input.lessonSet?.map(lesson => ({
              data: {
                notes: input.notes,
                time_out: input.timeOut,
              },
              where: {
                id: parseID(lesson.id)
              },
            }))
          }
        },
        where: { id: parseID(input.id) }
      })
      await promise;
      input.lessonSet?.map(async lesson => {
        if (lesson.ratingSet) {
          await updateRatingsAndGoals(lesson.id, lesson.ratingSet);
        }    
      })
      return promise;
    }
  })
);