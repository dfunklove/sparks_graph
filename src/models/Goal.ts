import { builder } from "../builder";
import { prisma } from "../db";

export default builder.prismaObject("goals", {
    select: { id: true},
    fields: t => ({
//        id: t.exposeID("id"),
        name: t.exposeString("name"),
    })
})

builder.queryField("goals", 
  t => t.prismaField({
    type: ['goals'],
    resolve: async (query, root, args, ctx, info) => {
      return prisma.goals.findMany({ ...query });
    }
  })
)
