import { builder } from "../builder";
import { prisma } from "../db";

builder.prismaObject("lessons", {
  fields: t => ({
      id: t.exposeID(),
      notes: t.exposeString("notes", {nullable: true}),
      time_in: t.expose("time_in", {type: "DateTime"}),
      time_out: t.expose("time_out", {type: "DateTime", nullable: true}),
  })
})

builder.queryType({
  fields: t => ({
    lessons: t.prismaField({
      type: ['lessons'],
      resolve: async (query, root, args, ctx, info) => {
        return prisma.lessons.findMany({ ...query });
      }
    })
  })
})