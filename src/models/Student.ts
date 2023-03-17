import { builder } from "../builder";
import { prisma } from "../db";
import Goal from "./Goal"

builder.prismaObject("students", {
  fields: t => ({
//      id: t.exposeID("id"),
      firstName: t.exposeString("first_name"),
      lastName: t.exposeString("last_name"),
      school: t.relation("schools"),
      goals: t.field({
        select: (args, ctx, nestedSelection) => ({
          goals: {
            select: {
              // This will look at what fields are queried on Media
              // and automatically select uploadedBy if that relation is requested
              goals: nestedSelection(
                // This arument is the default query for the media relation
                // It could be something like: `{ select: { id: true } }` instead
                true,
              ),
            },
          },
        }),
        type: [Goal],
        resolve: (students) => students.goals.map(({ goals }) => goals),
      }),
  })
})

builder.queryField("students", 
  t => t.prismaField({
    type: ['students'],
    resolve: async (query, root, args, ctx, info) => {
      return prisma.students.findMany({ ...query });
    }
  })
)
