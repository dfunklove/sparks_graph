import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { builder } from "../builder";
import { prisma } from "../db";

export const User = builder.prismaObject("users", {
  fields: t => ({
      //id: t.exposeID("id"),
      firstName: t.exposeString("first_name"),
      lastName: t.exposeString("last_name"),
      email: t.exposeString("email"),
  })
})

export const UserInputPartial = builder.inputType('UserInputPartial', {
  fields: (t) => ({
    id: t.id({ required: true }),
  }),
});


builder.queryField("user", (t) =>
  t.prismaField({
    type: "users",
    args: {
      email: t.arg.string()
    },
    resolve: async (query, root, args, ctx, info) => {
      if (!args.email)
        throw new PrismaClientValidationError("email is required")
      return prisma.users.findFirstOrThrow({ ...query, where: { email: args.email } });
    },
  })
);
