import { builder } from "../builder";
import { prisma } from "../db";

const School = builder.prismaObject("schools", {
  fields: t => ({
//      id: t.exposeID("id"),
      name: t.exposeString("name"),
  })
})

const SchoolInput = builder.inputType('SchoolInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    createSchool: t.prismaField({
      type: School,
      args: {
        input: t.arg({ type: SchoolInput, required: true }),
      },
      resolve: (query, _, {input}) =>
        prisma.schools.create({...query, data: { name: input.name }})
    }),
  }),
});