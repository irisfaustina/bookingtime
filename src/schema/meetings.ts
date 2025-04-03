import { startOfDay } from "date-fns"
import { z } from "zod"

export const meetingFormSchema = z.object({
    startDate: z.date(),
    guestEmail: z.string().email().min(1, "Required"),
    guestName: z.string().min(1, "Required"),
    guestNotes: z.string().optional(),
    timezone: z.string().min(1, "Required"),
    date: z.date().min(startOfDay(new Date()), "Must be today or later"),
})

export type MeetingFormSchema = z.infer<typeof meetingFormSchema>