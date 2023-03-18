import { builder } from "../builder";
import { GoalInputPartial } from "./Goal";

export const Rating = builder.prismaObject("ratings", {
  fields: t => ({
      id: t.exposeID("id"),
      goal: t.relation("goals"),
      lesson: t.relation("lessons"),
      score: t.exposeInt("score"),
  })
})

export const RatingInputPartial = builder.inputType('RatingInputPartial', {
  fields: (t) => ({
    score: t.int({ required: true }),
    goalId: t.id({ required: true }),
  }),
});
