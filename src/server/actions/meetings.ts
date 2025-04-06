"use server"
import { db } from "@/drizzle"
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule"
import { meetingActionSchema } from "@/schema/meetings"
import "use-server" /* make sure this is only called from the server */
import { z } from "zod"
import { createCalendarEvent } from "../googleCalendar"
import { redirect } from "next/navigation"
import { fromZonedTime } from "date-fns-tz"

export async function createMeeting(
  unsafeData: z.infer<typeof meetingActionSchema>
) {
  const { success, data } = meetingActionSchema.safeParse(unsafeData)

  if (!success) return { error: true } /* don't need user auth the page is public */

  const event = await db.query.EventTable.findFirst({ /* verify data is correct */
    where: ({ clerkUserId, isActive, id }, { eq, and }) =>
      and(
        eq(isActive, true),
        eq(clerkUserId, data.clerkUserId),
        eq(id, data.eventId)
      ),
  })

  if (event == null) return { error: true }
  const startInTimezone = fromZonedTime(data.startTime, data.timezone) /* convert start time to the selected local timezone */

  const validTimes = await getValidTimesFromSchedule([startInTimezone], event) /* a single date, is this date valid for this event */
  if (validTimes.length === 0) return { error: true } /* if not valid, return error */

  await createCalendarEvent({ /* function to create in googleCalendar, we pass on data below*/
    ...data,
    startTime: startInTimezone, /* local timezone */
    durationInMinutes: event.durationInMinutes,
    eventName: event.name,
  })

  redirect( /* redirect to success page */
    `/book/${data.clerkUserId}/${
      data.eventId
    }/success?startTime=${data.startTime.toISOString()}`
  )
}