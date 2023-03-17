import { builder } from "./builder";
import { prisma } from "./db";

import "./models/Goal";
import "./models/GroupLesson";
import "./models/Lesson";
import "./models/Rating";
import "./models/School";
import "./models/Student";
import "./models/User";

// Required to have a root query.  All others can be defined using queryField.
// TODO: Put openLesson query here.
builder.queryType({
  fields: t => ({
    default: t.prismaField({
      type: ['lessons'],
      resolve: async (query, root, args, ctx, info) => {
        return prisma.lessons.findMany({ ...query });
      }
    })
  })
})

export const schema = builder.toSchema({});