import { builder } from "./builder";
import { prisma } from "./db";

import "./models/Goal";
import "./models/GroupLesson";
import "./models/Lesson";
import { Lesson, LessonInput} from "./models/Lesson"
import "./models/Rating";
import "./models/School";
import "./models/Student";
import "./models/User";

// Required to have a root query.  All others can be defined using queryField.
// TODO: Put all of the queries here?
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

// TODO: Get the dev of Pothos to answer for this mess! Ugh!
builder.mutationType({
  fields: (t) => ({
    createLesson: t.prismaField({
      type: Lesson,
      args: {
        input: t.arg({ type: LessonInput, required: true }),
      },
      resolve: (query, _, {input}) =>
        prisma.lessons.create({...query, data: {
          notes: input.notes,
          schools: { connect: { id: BigInt(input.school.id) } }, 
          students: { connect: { id: BigInt(input.student.id) } },
          time_in: input.timeIn,
          time_out: input.timeOut,
          users: { connect: { id: BigInt(input.user.id) } },
        }})
    }),
  }),
});

export const schema = builder.toSchema({});