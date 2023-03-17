import SchemaBuilder from "@pothos/core";
import { BigIntResolver, DateTimeResolver } from "graphql-scalars";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { prisma } from "./db";

export const builder = new SchemaBuilder<{
  Scalars: {
    DateTime: { Input: Date; Output: Date };
    ID: { Input: bigint; Output: bigint };
  };
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

builder.addScalarType("DateTime", DateTimeResolver, {});
builder.addScalarType("ID", BigIntResolver, {});