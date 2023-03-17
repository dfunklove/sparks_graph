import { builder } from "../builder";
import { prisma } from "../db";

export const Goal = builder.prismaObject("goals", {
    select: { id: true},
    fields: t => ({
//        id: t.exposeID("id"),
        name: t.exposeString("name"),
    })
})

export const GoalInputPartial = builder.inputType('GoalInputPartial', {
  fields: (t) => ({
    id: t.id({ required: true }),
  }),
});

builder.queryField("goals", 
  t => t.prismaField({
    type: ['goals'],
    resolve: async (query, root, args, ctx, info) => {
      return prisma.goals.findMany({ ...query });
    }
  })
)