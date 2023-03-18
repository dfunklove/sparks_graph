import { builder } from "../builder";
import { prisma } from "../db";
import { parseID } from "../util";

builder.prismaObject("group_lessons", {
  fields: t => ({
      id: t.exposeID("id"),
      lessonSet: t.relation("lessons"),
      notes: t.exposeString("notes", { nullable: true }),
      timeIn: t.expose("time_in", {type: "DateTime"}),
      timeOut: t.expose("time_out", {type: "DateTime", nullable: true}),
      user: t.relation("users"),
  })
})

builder.queryField("groupLessons", (t) =>
  t.prismaField({
    type: ["group_lessons"],
    resolve: async (query, root, args, ctx, info) => {
      return prisma.group_lessons.findMany({ ...query });
    },
  })
);

builder.queryField("groupLesson", (t) =>
  t.prismaField({
    type: "group_lessons",
    args: {
      id: t.arg.id()
    },
    resolve: async (query, root, args, ctx, info) => {
      return prisma.group_lessons.findUniqueOrThrow({ ...query, where: { id: parseID(args.id) } });
    },
  })
);
