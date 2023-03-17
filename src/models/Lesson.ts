import { builder } from "../builder";
import { prisma } from "../db";

builder.prismaObject("lessons", {
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

