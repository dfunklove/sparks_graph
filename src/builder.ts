import SchemaBuilder from "@pothos/core";
import { BigIntResolver, DateTimeResolver, NonEmptyStringResolver } from "graphql-scalars";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { prisma } from "./db";

export const builder = new SchemaBuilder<{
  Scalars: {
    DateTime: { Input: Date; Output: Date };
    //ID: { Input: BigInt; Output: BigInt };
  };
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

//builder.addScalarType("ID", NonEmptyStringResolver, { serialize: ((x: any) => x.id.toString()) });
//builder.addScalarType("ID", BigIntResolver, {});
/*builder.scalarType("ID", {
  serialize: (n) => n.toString(),
  parseValue: (n: any) => n.toString() //BigInt(n as (string | number | bigint | boolean))
});*/
builder.addScalarType("DateTime", DateTimeResolver, {});

