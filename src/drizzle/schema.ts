//sql code
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";
import { relations } from "drizzle-orm";
import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"; /* import pgcore to work directly with postgres */

const createdAt = timestamp("createdAt").notNull().defaultNow(); /* create these two columns because we'll use them on every table */
const updatedAt = timestamp("updatedAt")
.notNull()
.defaultNow()
.$onUpdate(() =>new Date()); /* This is a function provided by Drizzle ORM that allows you to specify a value or a function that will be used to update a column automatically when a row is updated. */

//postgres table to represets events created
export const EventTable = pgTable("events",{
    id: uuid("id").primaryKey().defaultRandom(), /* creates a unique event id which is the primary key */
    name: text("name").notNull(),
    description: text("description"), /* description is optional */
    durationInMinutes: integer("durationInMinutes").notNull(), /* 15, 30, 60 mins etc. */
    clerkUserId: text("clerkUserId").notNull(),/* every event must be tied to a registered user - user id from clerk for future proof in case you swap your auth provider */
    isActive: boolean("isActive").notNull().default(true), /* to activate or deactivate events without deleting them */
    createdAt,
    updatedAt,
}, table => ({
    clerkUserIdIndex: index("clerkUserIdIndex").on(table.clerkUserId) /* takes a table object and returns an index */
}));

//postgres table to represets user schedules
export const ScheduleTable = pgTable("schedules",{
    id: uuid("id").primaryKey().defaultRandom(), /* unique id for each schedule */
    timezone: text("timezone").notNull(), /* convert text entry to timezone format*/
    clerkUserId: text("clerkUserId").notNull(), /* every schedule must be tied to a registered user - user id from clerk for future proof in case you swap your auth provider */
    createdAt,
    updatedAt,
})

export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
    availabilities: many(ScheduleAvailabilityTable) /* connecting schedule with avail tables and  */
}))

export const scheduleDayOfWeekEnum = pgEnum("scheduleDayOfWeek", DAYS_OF_WEEK_IN_ORDER); /* create const in src/data/constants.ts */

//postgres table to store user schedule entries
export const ScheduleAvailabilityTable = pgTable("scheduleAvailabilities",{
    id: uuid("id").primaryKey().defaultRandom(), /* unique id for each schedule entry */
    scheduleId: uuid("scheduleId")
    .notNull()
    .references(() => ScheduleTable.id, { onDelete: "cascade"}), /* ereference to schedule table once associate schedule rows are deleted also delete availability */
    startTime: timestamp("startTime").notNull(), /* convert text entry to date and time format */
    endTime: timestamp("endTime").notNull(), /* convert text entry to date and time format */
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(), /* convert text entry to day of week format */
}, table => ({
    scheduleIdIndex: index("scheduleIdIndex").on(table.scheduleId) /* takes a table object and returns an index */
}))

export const ScheduleAvailabilityTableRelation = relations(ScheduleAvailabilityTable, ({ one }) => ({
    schedule: one(ScheduleTable, {
        fields: [ScheduleAvailabilityTable.scheduleId], /* foreign key to reference */
        references: [ScheduleTable.id] /* column its references */
    })
}))
