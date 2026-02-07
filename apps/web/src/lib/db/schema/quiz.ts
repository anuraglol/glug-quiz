import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const question = pgTable("question", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  options: text("options").array().notNull(),
  correctIndex: integer("correct_index").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const quizAttempt = pgTable("quiz_attempt", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
