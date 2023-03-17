import { builder } from "../builder";

builder.prismaObject("ratings", {
  fields: t => ({
//      id: t.exposeID("id"),
      goal: t.relation("goals"),
      lesson: t.relation("lessons"),
      score: t.exposeInt("score"),
  })
})
