import { startOfDay } from "date-fns"
import { z } from "zod"

const meetingSchemaBase = z.object({ /* schema for meeting */
  startTime: z.date().min(new Date()),
  guestEmail: z.string().email().min(1, "Required"),
  guestName: z.string().min(1, "Required"),
  guestNotes: z.string().optional(),
  timezone: z.string().min(1, "Required"),
})

export const meetingFormSchema = z /* object with just the date and merge in with all the date */
  .object({
    date: z.date().min(startOfDay(new Date()), "Must be in the future"),
  })
  .merge(meetingSchemaBase)

export const meetingActionSchema = z /* object with just the eventId and clerkUserId and merge in with all the date, action schema feeds into action*/
  .object({
    eventId: z.string().min(1, "Required"),
    clerkUserId: z.string().min(1, "Required"),
  })
  .merge(meetingSchemaBase)