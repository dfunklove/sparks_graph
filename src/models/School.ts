import { builder } from "../builder";
import { prisma } from "../db";

export const School = builder.prismaObject("schools", {
  fields: t => ({
      id: t.exposeID("id"),
      name: t.exposeString("name"),
  })
})

export const SchoolInputPartial = builder.inputType('SchoolInputPartial', {
  fields: (t) => ({
    id: t.id({ required: true }),
  }),
});
