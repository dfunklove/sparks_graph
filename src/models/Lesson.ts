import { builder } from "../builder";
import { prisma } from "../db";
import { RatingInputPartial } from "./Rating"
import { SchoolInputPartial } from "./School"
import { StudentInputPartial } from "./Student"
import { UserInputPartial } from "./User"

export const Lesson = builder.prismaObject("lessons", {
  fields: t => ({
//      id: t.id({resolve: x => x.id.toString()}),
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

builder.queryField("lesson", (t) =>
  t.prismaField({
    type: "lessons",
    args: {
      id: t.arg.id()
    },
    resolve: async (query, root, args, ctx, info) => {
      return prisma.lessons.findUniqueOrThrow({ ...query, where: { id: BigInt(args.id as (string | number | bigint | boolean)) } });
    },
  })
);

builder.queryField("lessons", (t) =>
  t.prismaField({
    type: ["lessons"],
    resolve: async (query, root, args, ctx, info) => {
      return prisma.lessons.findMany({ ...query });
    },
  })
);

builder.queryField("openLesson", (t) =>
  t.prismaField({
    type: "lessons",
    resolve: async (query, root, args, ctx, info) => {
      return prisma.lessons.findFirstOrThrow({ ...query, where: { time_out: null } });
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
        schools: { connect: { id: BigInt(input.school.id) } }, 
        students: { connect: { id: BigInt(input.student.id) } },
        time_in: input.timeIn,
        time_out: input.timeOut,
        users: { connect: { id: BigInt(input.user.id) } },
      }})
  })
);

builder.mutationField("updateLesson",
  (t) => t.prismaField({
    type: Lesson,
    args: {
      input: t.arg({ type: LessonInputPartial, required: true }),
    },
    resolve: (query, _, {input}) =>
      prisma.lessons.update({...query, data: {
        notes: input.notes,
        time_out: input.timeOut,
        ratings: { create: 
          input.ratingSet?.map((rating) => ({
            score: rating.score,
            goal_id: BigInt(rating.goalId)
          }))
        },
      },
      where: { id: BigInt(input.id) }
    })
  })
);