import { z } from "zod";

import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";

export const scheduleFormSchema = z.object({
    timezone: z.string().min(1, "Required"),
    availabilities: z.array
    (z.object({
        startTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be between 00:00 and 23:59 (in the format HH:MM)"),/* regex broken into two parts, demote time in 01:12, 14:20 2nd half is beween 00 and 59 */
        endTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
        dayOfWeek: z.enum(DAYS_OF_WEEK_IN_ORDER)
    })
).superRefine((availabilities, ctx) => { /* add errors if certian conditions are not met */
    availabilities.forEach((availability, index) => {
        const overlaps = availabilities.some((a, i) => { /* check for overlaps and makes sure end time is always after start imte */
            return i !== index && a.dayOfWeek === availability.dayOfWeek && 
            timeToInt(a.startTime) < timeToInt(availability.endTime) && timeToInt(a.endTime) > timeToInt(availability.startTime)
        })
        if (overlaps) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Availabilities cannot overlap",
                path: [index, "startTime"]
            })
        }
    })
})
})

function timeToInt(time: string) {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
}

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>