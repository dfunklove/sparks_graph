import { builder } from "../builder";
import { prisma } from "../db";
import { Goal } from "./Goal"

export const Student = builder.prismaObject("students", {
  fields: t => ({
      id: t.exposeID("id"),
      firstName: t.exposeString("first_name"),
      lastName: t.exposeString("last_name"),
      school: t.relation("schools"),
      goals: t.field({
        select: (args, ctx, nestedSelection) => ({
          goals: {
            select: {
              goals: nestedSelection(
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

export const StudentInputPartial = builder.inputType('StudentInputPartial', {
  fields: (t) => ({
    id: t.id({ required: true }),
  }),
});

builder.queryField("students", 
  t => t.prismaField({
    type: ['students'],
    resolve: async (query, root, args, ctx, info) => {
      return prisma.students.findMany({ ...query });
    }
  })
)
