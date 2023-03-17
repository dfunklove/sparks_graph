import { builder } from "./builder";
import { prisma } from "./db";

import "./models/Goal";
import "./models/GroupLesson";
import "./models/Lesson";
import { Lesson, LessonInput, LessonInputPartial } from "./models/Lesson"
import "./models/Rating";
import "./models/School";
import "./models/Student";
import "./models/User";

builder.queryType();
builder.mutationType();

export const schema = builder.toSchema({});